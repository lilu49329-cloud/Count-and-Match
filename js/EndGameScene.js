// EndGameScene.js
export default class EndGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndGameScene" });
  }

  preload() {
    // Đã preload ở assetLoader rồi
  }

  create() {
    const width  = this.scale.width  || 900;
    const height = this.scale.height || 600;

    this.cameras.main.setBackgroundColor("#ffffff");

    // =========================
    // 1) BACKGROUND (đã dính hết asset vào đây)
    // =========================
    const BG_KEYS = [
      "bg_end1", "bg_end2", "bg_end3", "bg_end5", "bg_end6", "bg_end7"
    ];

    const chosenBG = Phaser.Utils.Array.GetRandom(BG_KEYS);

    const bg = this.add.image(width / 2, height / 2, chosenBG).setOrigin(0.5);

    // Scale kiểu cover cho đầy màn
    if (bg.width && bg.height) {
      const scaleX = width  / bg.width;
      const scaleY = height / bg.height;
      const bgScale = Math.max(scaleX, scaleY);
      bg.setScale(bgScale);
    }

    // =========================
    // 2) NÚT REPLAY & EXIT
    // =========================
    // Vị trí bạn có thể chỉnh cho khớp vùng trống trên bg
    const btnY = height * 0.82;

    const replayBtn = this.add.image(width * 0.40, btnY, "replay_endgame")
      .setOrigin(0.5)
      .setScale(0.55)
      .setInteractive({ useHandCursor: true });

    replayBtn.on("pointerdown", () => {
      this.scene.start("GameScene", { level: 1 });
    });

    const exitBtn = this.add.image(width * 0.60, btnY, "exit_endgame")
      .setOrigin(0.5)
      .setScale(0.55)
      .setInteractive({ useHandCursor: true });

    exitBtn.on("pointerdown", () => {
      window.location.href = "/";
    });
  }
}
