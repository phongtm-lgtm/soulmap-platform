const SOULMAP_CANVAS_BASE = '/soulmap-canvas';

export const APP_ASSETS = {
  linhNhiMascot: '/linh-nhi-mascot.png',
  linhNhiMbtiMascot: '/mbti/linhnhi-mbti-Photoroom.png',
  mbtiPreparationBg: '/mbti/mbti-preparation-bg.png',
  mbtiTestBg: '/mbti-test-bg.webp',
  mbtiStartTestBg: 'https://res.cloudinary.com/mlv5dzac/image/upload/v1783400296/bg-lam-bai-test_eprhio.png',
  mbtiManualResultBg: 'https://res.cloudinary.com/mlv5dzac/image/upload/v1783400298/bg-nhap-kq-mbti_jajqar.png',
  soulmapIsland: '/soulmap-island.webp',
  journey: {
    scenery: '/journey/journey-scenery.png',
    start: '/journey/journey-start.png',
    goal: '/journey/journey-goal.png',
  },
  pillars: {
    self: '/pillars/pillar-self.png',
    career: '/pillars/pillar-career.png',
    love: '/pillars/pillar-love.png',
    life: '/pillars/pillar-life.png',
    decorLeaf: '/pillars/decor-leaf.png',
    decorBlossom: '/pillars/decor-blossom.png',
  },
  soulmapCanvas: {
    basePath: SOULMAP_CANVAS_BASE,
    sky: `${SOULMAP_CANVAS_BASE}/sky.png`,
    base: `${SOULMAP_CANVAS_BASE}/17-Photoroom.png`,
    layer18: `${SOULMAP_CANVAS_BASE}/18-Photoroom.png`,
    layer19: `${SOULMAP_CANVAS_BASE}/19-Photoroom.png`,
    layer20: `${SOULMAP_CANVAS_BASE}/20-Photoroom.png`,
    layer21: `${SOULMAP_CANVAS_BASE}/21-Photoroom.png`,
  },
} as const;

export type AppAssetUrl = string;
