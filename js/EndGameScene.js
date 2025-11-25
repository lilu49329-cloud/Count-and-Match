// EndGameScene.js
export default class EndGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndGameScene" });
  }

  preload() {
    // Asset đã preload ở assetLoader
  }

  create() {
    const cam = this.cameras.main;
    const width = cam.width;
    const height = cam.height;

    cam.setBackgroundColor("#ffffff");

    // =========================
    // 0) ÂM THANH: BGM + VOICE_END
    // =========================
    // Lấy bgm_main (dùng chung từ Overlay/Game)
    let bgm = this.sound.get("bgm_main");
    if (!bgm) {
      // Phòng trường hợp scene này được vào trực tiếp mà chưa add bgm
      bgm = this.sound.add("bgm_main", { loop: true, volume: 0.28 });
      bgm.play();
    } else if (!bgm.isPlaying) {
      // Nếu vì lý do nào đó bgm đã stop, ta play lại
      bgm.play();
    }
    this.bgm = bgm;

    // Phát voice kết thúc
    if (this.sound && this.sound.play) {
      this.sound.play("voice_end", { volume: 1 });
    }

    // =========================
    // 1) BACKGROUND
    // =========================
    const BG_KEYS = [
      "bg_end1",
      "bg_end2",
      "bg_end3",
      "bg_end5",
      "bg_end6",
      "bg_end7",
    ];

    const chosenBG = Phaser.Utils.Array.GetRandom(BG_KEYS);

    const centerX = cam.centerX;
    const centerY = cam.centerY;

    // Tâm nội dung nằm thấp hơn giữa file PNG
    const BG_VISUAL_ORIGIN_Y = 0.68; // có thể chỉnh 0.65–0.7 nếu cần

    const bg = this.add
      .image(centerX, centerY, chosenBG)
      .setOrigin(0.5, BG_VISUAL_ORIGIN_Y);

    // Scale kiểu cover
    if (bg.width && bg.height) {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      const bgScale = Math.max(scaleX, scaleY);
      bg.setScale(bgScale);
    }

    // Sau khi scale xong, KÉO CẢ BẢNG XUỐNG
    // để đáy bảng nằm quanh 93% chiều cao màn (bớt trắng bên dưới)
    const BOTTOM_TARGET_RATIO = 0.93; // tăng lên 0.95 nếu muốn ít trắng hơn nữa
    const bottomTarget = height * BOTTOM_TARGET_RATIO;
    const currentBottom = bg.getBottomCenter().y;
    const dy = bottomTarget - currentBottom;
    bg.y += dy;

    // =========================
    // 2) NÚT REPLAY & EXIT – neo vào bảng
    // =========================
    // Lấy đáy của bảng SAU KHI ĐÃ KÉO XUỐNG
    const bottomOfPanelY = bg.getBottomCenter().y;

    // Đẩy nút lên so với đáy bảng
    const BTN_FROM_BOTTOM_RATIO = 0.18; // 18% chiều cao bg
    const btnY = bottomOfPanelY - bg.displayHeight * BTN_FROM_BOTTOM_RATIO;

    // Độ lệch trái/phải so với tâm bảng
    const BTN_OFFSET_X_RATIO = 0.12; // 12% chiều rộng bg
    const btnOffsetX = bg.displayWidth * BTN_OFFSET_X_RATIO;

    const replayBtn = this.add
      .image(centerX - btnOffsetX, btnY, "replay_endgame")
      .setOrigin(0.5)
      .setScale(0.55)
      .setInteractive({ useHandCursor: true });

    replayBtn.on("pointerdown", () => {
      // Chơi lại từ đầu game (level 0)
      this.scene.start("GameScene", { level: 0 });
    });

    const exitBtn = this.add
      .image(centerX + btnOffsetX, btnY, "exit_endgame")
      .setOrigin(0.5)
      .setScale(0.55)
      .setInteractive({ useHandCursor: true });

    exitBtn.on("pointerdown", () => {
      // Thoát game, tắt nhạc nền
      const bgmNow = this.sound.get("bgm_main");
      if (bgmNow && bgmNow.isPlaying) {
        bgmNow.stop();
      }
      window.location.href = "/";
    });

    
  }
}
