const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090/api/v1';

type ApiResponse<T> = {
  data: T;
};

export type AuthUser = {
  name: string;
  email: string;
};

export async function verifyGoogleCredential(credential: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    throw new Error(`Google sign-in verification failed with status ${response.status}`);
  }

  const body = await response.json() as ApiResponse<AuthUser>;
  return body.data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });

  if (!response.ok) {
    throw new Error(`Session lookup failed with status ${response.status}`);
  }

  const body = await response.json() as ApiResponse<AuthUser>;
  return body.data;
}

export async function signOut(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
}
