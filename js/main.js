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

// HÀM ĐỢI FONT FREDOKA LOAD XONG
function waitForFredoka() {
    // Nếu trình duyệt không hỗ trợ document.fonts thì bỏ qua, chạy luôn
    if (!document.fonts || !document.fonts.load) {
        return Promise.resolve();
    }

    // Gọi load ít nhất 1 lần với font Fredoka
    const loadPromise = document.fonts.load('400 24px "Fredoka"');

    // Đề phòng bị treo: timeout sau 1500ms thì cho game chạy luôn
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });

    return Promise.race([loadPromise, timeoutPromise]);
}

window.onload = async function () {
    const container = document.getElementById('game-container');
    if (container) {
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.background = '#e1f5fe';
    }

    // 🔹 ĐỢI FONT RỒI MỚI TẠO GAME
    try {
        await waitForFredoka();
    } catch (e) {
        // Có lỗi cũng kệ, vẫn cho game chạy
        console.warn('Không đợi được font Fredoka, chạy game luôn.', e);
    }

    new Phaser.Game(config);
};
