param(
    [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"
$serverProcess = $null
$ngrokProcess = $null
$serverLog = Join-Path $PSScriptRoot "backend-share.log"
$serverErrorLog = Join-Path $PSScriptRoot "backend-share-error.log"
$ngrokLog = Join-Path $PSScriptRoot "ngrok-share.log"
$ngrokErrorLog = Join-Path $PSScriptRoot "ngrok-share-error.log"

function Import-DotEnv {
    param([string]$Path)

    if (-not (Test-Path $Path -PathType Leaf)) {
        throw "Environment file not found: $Path. Copy .env.example to .env and configure it first."
    }

    foreach ($line in Get-Content $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith("#")) {
            continue
        }

        $separator = $trimmed.IndexOf("=")
        if ($separator -lt 1) {
            continue
        }

        $name = $trimmed.Substring(0, $separator).Trim()
        $value = $trimmed.Substring($separator + 1).Trim()
        if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

function Test-TcpPort {
    param(
        [string]$HostName,
        [int]$Port
    )

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $result = $client.BeginConnect($HostName, $Port, $null, $null)
        if (-not $result.AsyncWaitHandle.WaitOne(1000)) {
            return $false
        }
        $client.EndConnect($result)
        return $true
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Stop-ProcessTree {
    param([System.Diagnostics.Process]$Process)

    if ($null -ne $Process -and -not $Process.HasExited) {
        & taskkill.exe /PID $Process.Id /T /F 2>$null | Out-Null
    }
}

try {
    Set-Location $PSScriptRoot
    Import-DotEnv (Join-Path $PSScriptRoot $EnvFile)

    $port = if ($env:SERVER_PORT) { [int]$env:SERVER_PORT } else { 8090 }
    $databasePort = if ($env:SOULMAP_DATABASE_PORT) { [int]$env:SOULMAP_DATABASE_PORT } else { 5432 }

    if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
        throw "Java was not found. Install JDK 21 and open a new terminal."
    }
    if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
        throw "ngrok was not found. Install ngrok and add your authtoken first."
    }
    if (-not $env:SOULMAP_AI_API_KEY -or $env:SOULMAP_AI_API_KEY -eq "replace_me") {
        throw "SOULMAP_AI_API_KEY is not configured in .env."
    }
    if (-not (Test-TcpPort "localhost" $databasePort)) {
        throw "PostgreSQL is not reachable on localhost:$databasePort. Start PostgreSQL before sharing the backend."
    }
    if (Test-TcpPort "localhost" $port) {
        throw "Port $port is already in use. Stop the existing backend before running this script."
    }

    Remove-Item $serverLog, $serverErrorLog, $ngrokLog, $ngrokErrorLog -Force -ErrorAction SilentlyContinue

    Write-Host "Starting Soulmap backend on port $port..."
    $serverProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList @("/d", "/c", "mvnw.cmd spring-boot:run") `
        -WorkingDirectory $PSScriptRoot `
        -RedirectStandardOutput $serverLog `
        -RedirectStandardError $serverErrorLog `
        -WindowStyle Hidden `
        -PassThru

    $healthUrl = "http://localhost:$port/api/v1/actuator/health"
    $backendReady = $false
    for ($attempt = 0; $attempt -lt 120; $attempt++) {
        if ($serverProcess.HasExited) {
            throw "Backend stopped during startup. Check $serverErrorLog and $serverLog."
        }

        try {
            $health = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2
            if ($health.status -eq "UP") {
                $backendReady = $true
                break
            }
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }
    if (-not $backendReady) {
        throw "Backend did not become healthy within 120 seconds. Check $serverErrorLog and $serverLog."
    }

    Write-Host "Backend is healthy. Starting ngrok..."
    $ngrokProcess = Start-Process -FilePath "ngrok" `
        -ArgumentList @("http", "$port", "--log=stdout") `
        -WorkingDirectory $PSScriptRoot `
        -RedirectStandardOutput $ngrokLog `
        -RedirectStandardError $ngrokErrorLog `
        -WindowStyle Hidden `
        -PassThru

    $publicUrl = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if ($ngrokProcess.HasExited) {
            throw "ngrok stopped during startup. Check $ngrokErrorLog and $ngrokLog."
        }

        try {
            $tunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2
            $publicUrl = $tunnels.tunnels |
                Where-Object { $_.proto -eq "https" } |
                Select-Object -First 1 -ExpandProperty public_url
            if ($publicUrl) {
                break
            }
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }
    if (-not $publicUrl) {
        throw "Could not read the ngrok public URL. Check $ngrokErrorLog and $ngrokLog."
    }

    $apiUrl = "$publicUrl/api/v1"
    Write-Host ""
    Write-Host "Soulmap backend is public:" -ForegroundColor Green
    Write-Host $apiUrl -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Set this environment variable on Netlify, then redeploy:" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_API_BASE_URL=$apiUrl"
    Write-Host ""
    Write-Host "Frontend: https://soulmap-patform.netlify.app"
    Write-Host "Health:   $publicUrl/api/v1/actuator/health"
    Write-Host "Press Ctrl+C to stop the backend and ngrok."

    while (-not $serverProcess.HasExited -and -not $ngrokProcess.HasExited) {
        Start-Sleep -Seconds 2
    }

    if ($serverProcess.HasExited) {
        throw "Backend stopped unexpectedly. Check $serverErrorLog and $serverLog."
    }
    throw "ngrok stopped unexpectedly. Check $ngrokErrorLog and $ngrokLog."
}
finally {
    Write-Host "Stopping backend and ngrok..."
    Stop-ProcessTree $ngrokProcess
    Stop-ProcessTree $serverProcess
}
