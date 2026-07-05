import { useEffect, useRef, useState } from 'react'
import './App.css'

type SoulLayer = {
  id: string
  label: string
  src: string
  x: number
  y: number
  width: number
  rotation: number
  zIndex: number
}

const CANVAS_WIDTH = 1672
const CANVAS_HEIGHT = 941
const soulmapSky = new URL('../../images/soulmap-canvas/sky.png', import.meta.url).href
const soulmapBackground = new URL('../../images/soulmap-canvas/17-Photoroom.png', import.meta.url).href
const soulmapLayer18 = new URL('../../images/soulmap-canvas/18-Photoroom.png', import.meta.url).href
const soulmapLayer19 = new URL('../../images/soulmap-canvas/19-Photoroom.png', import.meta.url).href
const soulmapLayer20 = new URL('../../images/soulmap-canvas/20-Photoroom.png', import.meta.url).href
const soulmapLayer21 = new URL('../../images/soulmap-canvas/21-Photoroom.png', import.meta.url).href

const initialLayers: SoulLayer[] = [
  {
    id: '18',
    label: 'Lớp 18',
    src: soulmapLayer18,
    x: 881.17,
    y: 154.19,
    width: 485,
    rotation: -5,
    zIndex: 46,
  },
  {
    id: '19',
    label: 'Lớp 19',
    src: soulmapLayer19,
    x: 216.7,
    y: 477.21,
    width: 590,
    rotation: -3,
    zIndex: 48,
  },
  {
    id: '20',
    label: 'Lớp 20',
    src: soulmapLayer20,
    x: 294.19,
    y: 116.49,
    width: 594,
    rotation: 3,
    zIndex: 45,
  },
  {
    id: '21',
    label: 'Lớp 21',
    src: soulmapLayer21,
    x: 739.74,
    y: 418.44,
    width: 608,
    rotation: -4,
    zIndex: 49,
  },
]

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [canvasScale, setCanvasScale] = useState(1)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const updateScale = () => {
      setCanvasScale(Math.min(1, viewport.clientWidth / CANVAS_WIDTH))
    }
    const observer = new ResizeObserver(updateScale)

    updateScale()
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [])

  return (
    <main className="builder-shell">
      <section className="builder-layout">
        <div className="canvas-card">
          <div className="canvas-viewport" ref={viewportRef} style={{ height: CANVAS_HEIGHT * canvasScale }}>
            <div
              className="soul-canvas"
              style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${canvasScale})` }}
            >
              <img className="sky-background" src={soulmapSky} alt="Soulmap sky background" />
              <img className="background-map" src={soulmapBackground} alt="Soulmap background 17" />

              {initialLayers.map((layer) => (
                <button
                  aria-label={layer.label}
                  className={`soul-piece ${selectedId === layer.id ? 'selected lifted' : ''}`}
                  key={layer.id}
                  onClick={() => setSelectedId(layer.id)}
                  style={{
                    left: layer.x,
                    top: layer.y,
                    width: layer.width,
                    zIndex: layer.zIndex,
                    transform: `rotate(${layer.rotation}deg)`,
                  }}
                  type="button"
                >
                  <img src={layer.src} alt={layer.label} draggable={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
