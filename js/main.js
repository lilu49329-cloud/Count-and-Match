


import OverlayScene from './OverlayScene.js';
import GameScene from './GameScene.js';
import EndGameScene from './EndGameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: '#f0f8ff',
    parent: 'game-container',
    scene: [OverlayScene, GameScene, EndGameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

window.onload = function () {
    const container = document.getElementById('game-container');
    if (container) {
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.background = '#e1f5fe';
    }
    new Phaser.Game(config);
};
