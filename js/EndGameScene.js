// EndGameScene.js
export default class EndGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndGameScene" });
  }

  preload() {
    // Asset đã preload ở assetLoader
  }

  create() {
    const cam    = this.cameras.main;
    const width  = cam.width;
    const height = cam.height;

    cam.setBackgroundColor("#ffffff");

    // =========================
    // 0) ÂM THANH: BGM + VOICE_END
    // =========================
    let bgm = this.sound.get("bgm_main");
    if (!bgm) {
      bgm = this.sound.add("bgm_main", { loop: true, volume: 0.28 });
      bgm.play();
    } else if (!bgm.isPlaying) {
      bgm.play();
    }
    this.bgm = bgm;

    // Voice kết thúc
    if (this.sound && this.sound.play) {
      this.sound.play("voice_end", { volume: 1 });
    }

    // =========================
    // 1) BACKGROUND (COVER + AOI, KHÔNG MẤT CHI TIẾT CHÍNH)
    // =========================
    const BG_KEYS = [
      "bg_end1",
      "bg_end2",
    ];
    const chosenBG = Phaser.Utils.Array.GetRandom(BG_KEYS);

    // Kích thước design gốc của bg_end (giả sử giống intro)
    const DESIGN_W = 2160;
    const DESIGN_H = 1620;

    // VÙNG QUAN TRỌNG: bảng + bé + chữ
    // (cứ tạm: chừa 230px phía trên, 260px phía dưới; nếu muốn tinh hơn thì chỉnh 2 số này)
    const SAFE_TOP    = 230;
    const SAFE_BOTTOM = 260;

    const AOI_TOP    = SAFE_TOP;
    const AOI_BOTTOM = DESIGN_H - SAFE_BOTTOM;
    const AOI_CENTER = (AOI_TOP + AOI_BOTTOM) / 2;

    // SCALE kiểu COVER: không viền, không méo
    const scaleBG = Math.max(width / DESIGN_W, height / DESIGN_H);

    const bg = this.add
      .image(width / 2, 0, chosenBG)
      .setOrigin(0.5, 0)       // neo theo mép trên
      .setScale(scaleBG);

    // Đặt sao cho tâm vùng AOI nằm đúng giữa màn
    const AOI_center_scaled = AOI_CENTER * scaleBG;
    const screenCenterY     = height / 2;
    bg.y = screenCenterY - AOI_center_scaled;

    // Lúc này:
    // - Bảng + bé + chữ (vùng giữa) luôn nằm trọn trong khung
    // - Nếu có cắt thì chỉ cắt mép trên rất cao hoặc mép sàn dưới – ít chi tiết

    // =========================
    // 2) NÚT REPLAY & EXIT – neo theo bảng
    // =========================

    // Thay vì kéo cả bg xuống đáy như trước, giờ ta bám nút theo bg đã căn AOI
    const bottomOfPanelY = bg.getBottomCenter().y;

    // Đẩy nút lên so với đáy bảng (18% chiều cao ảnh – có thể chỉnh)
    const BTN_FROM_BOTTOM_RATIO = 0.18;
    const btnY = bottomOfPanelY - bg.displayHeight * BTN_FROM_BOTTOM_RATIO;

    // Độ lệch trái/phải so với tâm bảng
    const BTN_OFFSET_X_RATIO = 0.12;
    const btnOffsetX = bg.displayWidth * BTN_OFFSET_X_RATIO;

    // NÚT REPLAY – chơi lại từ level 0
    const replayBtn = this.add
      .image(cam.centerX - btnOffsetX, btnY, "replay_endgame")
      .setOrigin(0.5)
      .setScale(0.55 * scaleBG)        // scale theo bg để giữ tương quan
      .setInteractive({ useHandCursor: true });

    replayBtn.on("pointerdown", () => {
      this.scene.start("GameScene", { level: 0 });
    });

    // NÚT EXIT – về OverlayScene
    const exitBtn = this.add
      .image(cam.centerX + btnOffsetX, btnY, "exit_endgame")
      .setOrigin(0.5)
      .setScale(0.55 * scaleBG)
      .setInteractive({ useHandCursor: true });

    exitBtn.on("pointerdown", () => {
      const bgmNow = this.sound.get("bgm_main");
      if (bgmNow && bgmNow.isPlaying) {
        bgmNow.stop();
      }
      this.scene.start("OverlayScene");
    });
  }
}
