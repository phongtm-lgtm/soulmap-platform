import { APP_ASSETS } from '../assets';

/**
 * Assembled SoulMap island — ported from soulmap-compass-test.
 * The original canvas is 1672 × 941; every layer's absolute px position is
 * converted to a percentage so the whole scene scales fluidly with its parent
 * while keeping the exact composition (offsets, rotations and stacking order).
 */

const CANVAS_WIDTH = 1672;
const CANVAS_HEIGHT = 941;

type IslandLayer = {
  id: string;
  label: string;
  file: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  zIndex: number;
};

const LAYERS: IslandLayer[] = [
  { id: '18', label: 'Lớp 18', file: '18-Photoroom.png', x: 881.17, y: 154.19, width: 485, rotation: -5, zIndex: 46 },
  { id: '19', label: 'Lớp 19', file: '19-Photoroom.png', x: 216.7, y: 477.21, width: 590, rotation: -3, zIndex: 48 },
  { id: '20', label: 'Lớp 20', file: '20-Photoroom.png', x: 294.19, y: 116.49, width: 594, rotation: 3, zIndex: 45 },
  { id: '21', label: 'Lớp 21', file: '21-Photoroom.png', x: 739.74, y: 418.44, width: 608, rotation: -4, zIndex: 49 },
];

const toPct = (value: number, total: number) => `${(value / total) * 100}%`;

interface SoulmapIslandProps {
  className?: string;
  basePath?: string;
  interactive?: boolean;
}

export default function SoulmapIsland({
  className = '',
  basePath = APP_ASSETS.soulmapCanvas.basePath,
  interactive = true,
}: SoulmapIslandProps) {
  const mapFilter = 'saturate(1.22) contrast(1.07) brightness(1.04)';

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
      aria-label="Bản đồ SoulMap"
      role="img"
    >
      <img
        src={`${basePath}/sky.png`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, filter: mapFilter }}
        draggable={false}
      />
      <img
        src={`${basePath}/17-Photoroom.png`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1, filter: mapFilter }}
        draggable={false}
      />

      {LAYERS.map((layer) => (
        <img
          key={layer.id}
          src={`${basePath}/${layer.file}`}
          alt={layer.label}
          draggable={false}
          className={`absolute select-none pointer-events-none${
            interactive ? ' soul-piece-fx' : ''
          }`}
          style={{
            left: toPct(layer.x, CANVAS_WIDTH),
            top: toPct(layer.y, CANVAS_HEIGHT),
            width: toPct(layer.width, CANVAS_WIDTH),
            height: 'auto',
            zIndex: layer.zIndex,
            transformOrigin: 'center',
            transform: `rotate(${layer.rotation}deg)`,
            filter: mapFilter,
          }}
        />
      ))}
    </div>
  );
}
