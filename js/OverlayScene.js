// js/OverlayScene.js
import { preloadAssets } from "./assetLoader.js";

export default class OverlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "OverlayScene" });
  }

  preload() {
    const cam = this.cameras.main;
    const width = cam.width;
    const height = cam.height;

    console.log("🟦 PRELOAD start – screen:", width, height);

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
      console.log("🟩 PRELOAD done");
      console.log("Has texture btn_start?", this.textures.exists("btn_start"));
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    preloadAssets(this);
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    console.log("🟦 CREATE start – screen:", width, height);
    console.log("Texture check btn_start:", this.textures.exists("btn_start"));

    const DESIGN_W = 2160;
    const DESIGN_H = 1620;

    // ========== BACKGROUND ==========
    const keys = [
      "intro_bg_1","intro_bg_2","intro_bg_3",
      "intro_bg_4","intro_bg_5","intro_bg_6","intro_bg_7"
    ];

    const chosenBG = Phaser.Utils.Array.GetRandom(keys);
    console.log("🎨 Chosen background:", chosenBG);

    const bgScale = Math.max(width / DESIGN_W, height / DESIGN_H);
    console.log("Background scale:", bgScale);

    this.add.image(width / 2, 0, chosenBG).setOrigin(0.5, 0).setScale(bgScale);

    // ========== MUSIC ==========
    let bgm = this.sound.get("bgm_main");
    if (!bgm) {
      bgm = this.sound.add("bgm_main", { loop: true, volume: 0.28 });
    }
    this.bgm = bgm;

    const startGame = () => {
      console.log("▶️ Start Game triggered");
      if (this._started) return;
      this._started = true;

      if (this.bgm && !this.bgm.isPlaying) this.bgm.play();
      this.sound.play("voice_intro", { volume: 1 });

      this.scene.start("GameScene", { level: 0 });
    };

    // ========== START BUTTON ==========
    const uiScale = Math.min(width / DESIGN_W, height / DESIGN_H);
    const bottomMargin = 80 * uiScale;

    console.log("UI scale:", uiScale);
    console.log("Bottom margin:", bottomMargin);

    const startY = height - bottomMargin;
    console.log("Button Y position:", startY);

    const startButton = this.add
      .image(width / 2, startY, "btn_start")
      .setOrigin(0.5)
      .setScale(uiScale * 1.2)
      .setDepth(999)
      .setInteractive({ useHandCursor: true });

    console.log("Button created:", {
      x: startButton.x,
      y: startButton.y,
      scale: startButton.scale,
      visible: startButton.visible,
      alpha: startButton.alpha
    });

    startButton.on("pointerdown", startGame);
  }
}
