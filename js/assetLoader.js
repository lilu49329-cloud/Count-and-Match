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
        scene.load.audio('voice_end',        'assets/audio/voice_end.mp3');
    scene.load.image('bg1', 'assets/bg1.png');
    scene.load.image('bg2', 'assets/bg2.png');
    scene.load.image('bg3', 'assets/bg3.png');
    scene.load.image('bg4', 'assets/bg4.png');
    scene.load.image('bg5', 'assets/bg5.png');
    scene.load.image('bg6', 'assets/bg6.png');
    scene.load.image('bg7', 'assets/bg7.png');


    scene.load.svg('char1', 'assets/char1.svg');
    scene.load.svg('char2', 'assets/char2.svg');
    scene.load.svg('btn_start','assets/button start.svg')

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
    scene.load.svg('bear', 'assets/bear.svg');
    scene.load.svg('marble', 'assets/marble.svg');
    scene.load.svg('ball', 'assets/ball.svg');
    scene.load.svg('flower', 'assets/flower.svg');
    scene.load.svg('drum', 'assets/drum.svg');
    scene.load.svg('babie', 'assets/babie.svg');
    scene.load.svg('clock', 'assets/clock.svg');
    scene.load.svg('yellow', 'assets/yellow.svg');
    scene.load.svg('red', 'assets/red.svg');
    scene.load.svg('rabbit', 'assets/rabbit.svg');

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
