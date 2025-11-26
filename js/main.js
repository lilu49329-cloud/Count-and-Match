import OverlayScene from './OverlayScene.js';
import GameScene from './GameScene.js';
import EndGameScene from './EndGameScene.js';

// =========================
//  CONFIG PHASER
// =========================
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',

  // Canvas luôn bằng kích thước thật của màn hình
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: '#00000000', // transparent

  scale: {
    mode: Phaser.Scale.FIT,       // auto zoom đúng tỉ lệ
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  render: {
    pixelArt: true,
    antialias: false
  },

  scene: [OverlayScene, GameScene, EndGameScene]
};

let game;

// =========================
//  SETUP CONTAINER
// =========================
function setupContainer() {
  const container = document.getElementById('game-container');
  if (!container) return;

  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.background = 'transparent';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
}

// =========================
//  KHÔNG CHỜ FONT – TỐI ƯU TỐC ĐỘ
// =========================
function waitForFredoka() {
  // Trường hợp browser không hỗ trợ
  if (!document.fonts || !document.fonts.load) return Promise.resolve();

  // Load nhanh – timeout để không delay
  const loadPromise = document.fonts.load('400 20px Fredoka');
  const timeout = new Promise(res => setTimeout(res, 50));

  return Promise.race([loadPromise, timeout]);
}

// =========================
//  START GAME
// =========================
async function initGame() {
  setupContainer();

  try {
    await waitForFredoka();
  } catch (e) {
    console.warn('Không load kịp font, chạy game luôn.');
  }

  game = new Phaser.Game(config);

  // Fix canvas margin (Safari / Cốc Cốc hay lỗi)
  setTimeout(() => {
    const canvas = document.querySelector('#game-container canvas');
    if (canvas) {
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.style.display = 'block';
    }
  }, 20);

  // Resize khi xoay ngang / đổi cửa sổ
  window.addEventListener('resize', () => {
    if (!game) return;
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
}

document.addEventListener('DOMContentLoaded', initGame);
