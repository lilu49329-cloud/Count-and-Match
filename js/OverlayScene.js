// js/OverlayScene.js
import { preloadAssets } from "./assetLoader.js";

export default class OverlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "OverlayScene" });
  }

  // ======================
  // PRELOAD: MÀN LOADING
  // ======================
  preload() {
    const cam    = this.cameras.main;
    const width  = cam.width;
    const height = cam.height;

    cam.setBackgroundColor("#e1f5fe");

    const loadingText = this.add.text(width / 2, height / 2 - 60, "Đang tải...", {
      fontFamily: "Fredoka",
      fontSize: "28px",
      color: "#333",
    }).setOrigin(0.5);

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(0x000000, 0.25);
    progressBox.fillRoundedRect(width / 2 - 170, height / 2 - 20, 340, 40, 10);

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRoundedRect(
        width / 2 - 160,
        height / 2 - 15,
        320 * value,
        30,
        8
      );
    });

    this.load.once("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    preloadAssets(this);
  }

  // ======================
  // CREATE: INTRO + UI
  // ======================
  create() {
    const width  = this.scale.width;
    const height = this.scale.height;

    // Kích thước file design background
    const DESIGN_W = 2160;
    const DESIGN_H = 1620;

    // ====== BACKGROUND: COVER, GHIM MÉP TRÊN (KHÔNG BAO GIỜ MẤT CHỮ) ======
    const INTRO_BG_KEYS = [
      "intro_bg_1",
      "intro_bg_2",
      "intro_bg_3",
      "intro_bg_4",
      "intro_bg_5",
      "intro_bg_6",
      "intro_bg_7",
    ];
    const chosenBG = Phaser.Utils.Array.GetRandom(INTRO_BG_KEYS);

    // scale cover: luôn kín màn, không méo
    const scaleBG = Math.max(width / DESIGN_W, height / DESIGN_H);

    // 👇 KHÁC BIỆT CHÍNH Ở ĐÂY:
    // - origin (0.5, 0) = neo theo mép TRÊN
    // - y = 0  => mép trên hình luôn trùng mép trên màn → chữ phía trên không bao giờ bị cắt
    const bg = this.add
      .image(width / 2, 0, chosenBG)
      .setOrigin(0.5, 0)
      .setScale(scaleBG);

    // Overlay sáng nhẹ
    this.add.rectangle(0, 0, width, height, 0xffffff, 0.10).setOrigin(0, 0);

    // ======================
    // NHẠC NỀN
    // ======================
    let bgm = this.sound.get("bgm_main");
    if (!bgm) {
      bgm = this.sound.add("bgm_main", {
        loop: true,
        volume: 0.28,
      });
    }
    this.bgm = bgm;

    // ======================
    // HÀM START GAME
    // ======================
    const startGame = () => {
      if (this._started) return;
      this._started = true;

      if (this.bgm && !this.bgm.isPlaying) {
        this.bgm.play();
      }

      if (this.sound && this.sound.play) {
        this.sound.play("voice_intro", { volume: 1 });
      }

      this.scene.start("GameScene", { level: 0 });
    };

    // ======================
    // UI: NÚT BẮT ĐẦU + TEXT
    // (GHIM THEO MÀN HÌNH, KHÔNG BỊ CROP)
    // ======================
    const uiScale = Math.min(width / DESIGN_W, height / DESIGN_H);

    const buttonY = height * 0.78; // ~3/4 chiều cao màn

    const startButton = this.add
      .image(width / 2, buttonY, "btn_start")
      .setOrigin(0.5)
      .setScale(uiScale * 1.1)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    startButton.on("pointerover", () => {
      this.tweens.add({
        targets: startButton,
        scale: uiScale * 1.16,
        duration: 120,
        ease: "Quad.easeOut",
      });
    });

    startButton.on("pointerout", () => {
      this.tweens.add({
        targets: startButton,
        scale: uiScale * 1.1,
        duration: 120,
        ease: "Quad.easeOut",
      });
    });

    startButton.on("pointerdown", startGame);

    // Nếu sau này muốn thêm text "Nhấn để bắt đầu trò chơi" thì vẽ thêm ở đây:
    // const infoText = this.add.text(...)

    // ======================
    // MOBILE: CHẠM BẤT KỲ ĐÂU CŨNG ĐƯỢC
    // ======================
    this.input.once("pointerdown", () => {
      if (!this._started) startGame();
    });
  }
}
