// js/assetLoader.js
// Hàm preload asset cho game
export function preloadAssets(scene) {
        // --- AUDIO ---
        scene.load.audio('voice_intro',      'assets/audio/voice_intro.mp3');
        scene.load.audio('voice_complete',   'assets/audio/voice_complete.mp3');
        scene.load.audio('voice_need_finish','assets/audio/voice_need_finish.mp3');
        scene.load.audio('sfx_correct',      'assets/audio/sfx_correct.mp3');
        scene.load.audio('sfx_wrong',        'assets/audio/sfx_wrong.mp3');
        scene.load.audio('bgm_main',         'assets/audio/bgm_main.mp3');
    scene.load.image('bg1', 'assets/bg1.png');
    scene.load.image('bg2', 'assets/bg2.png');
    scene.load.image('bg3', 'assets/bg3.png');
    scene.load.image('bg4', 'assets/bg4.png');
    scene.load.image('bg5', 'assets/bg5.png');
    scene.load.image('bg6', 'assets/bg6.png');
    scene.load.image('bg7', 'assets/bg7.png');

    scene.load.image('char1', 'assets/char1.png');
    scene.load.image('char2', 'assets/char2.png');

    scene.load.image('card', 'assets/card.png');
    scene.load.image('card2', 'assets/card2.png');
    scene.load.image('card_yellow', 'assets/card_yellow.png');
    scene.load.image('card_yellow2', 'assets/card_yellow2.png');
    scene.load.image('card_glow', 'assets/card_glow.png');
    scene.load.image('line_glow', 'assets/line_glow.png');

    scene.load.image('board', 'assets/board.png');
    scene.load.image('hand', 'assets/hand.png');
    scene.load.svg('replay_svg', 'assets/replay.svg');
    scene.load.svg('next_svg', 'assets/next.svg');
    scene.load.image('bear', 'assets/bear.png');
    scene.load.image('marble', 'assets/marble.png');
    scene.load.image('ball', 'assets/ball.png');
    scene.load.image('flower', 'assets/flower.png');
    scene.load.image('drum', 'assets/drum.png');
    scene.load.image('babie', 'assets/babie.png');
    scene.load.image('clock', 'assets/clock.png');
    scene.load.image('yellow', 'assets/yellow.png');
    scene.load.image('red', 'assets/red.png');
    scene.load.image('rabbit', 'assets/rabbit.png');

    scene.load.image('bg_end1', 'assets/bg_end1.png');
    scene.load.image('bg_end2', 'assets/bg_end2.png');
    scene.load.image('bg_end3', 'assets/bg_end3.png');
    scene.load.image('bg_end5', 'assets/bg_end5.png');
    scene.load.image('bg_end6', 'assets/bg_end6.png');
    scene.load.image('bg_end7', 'assets/bg_end7.png');
    scene.load.svg('replay_endgame', 'assets/replay_endgame.svg');
    scene.load.svg('exit_endgame', 'assets/exit.svg');

// Intro SVG assets cho OverlayScene (dùng convert SVG động)
scene.load.image("intro_bg_1",   "assets/intro/bge1.png");
scene.load.image("intro_bg_2",   "assets/intro/bge2.png");
scene.load.image("intro_bg_3",   "assets/intro/bge3.png");
scene.load.image("intro_bg_4",   "assets/intro/bge4.png");
scene.load.image("intro_bg_5",   "assets/intro/bge5.png");
scene.load.image("intro_bg_6",   "assets/intro/bge6.png");
scene.load.image("intro_bg_7",   "assets/intro/bge7.png");
  /*for (let i = 1; i <= 9; i++) {
        scene.load.image(`number_${i}`, `assets/number_${i}.png`);
    }*/    
}
