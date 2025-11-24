// js/OverlayScene.js
import { preloadAssets } from "./assetLoader.js";

export default class OverlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "OverlayScene" });
  }

  preload() {
    preloadAssets(this);
    // nhớ preload vignette_mask.png trong assetLoader
  }

  create() {
    const width  = this.scale.width;
    const height = this.scale.height;

    const DESIGN_WIDTH  = 2160;
    const DESIGN_HEIGHT = 1620;

    // ==== RANDOM BG ====
    const INTRO_BG_KEYS = [
      "intro_bg_1","intro_bg_2","intro_bg_3",
      "intro_bg_4","intro_bg_5","intro_bg_6","intro_bg_7"
    ];
    const chosenBG = Phaser.Utils.Array.GetRandom(INTRO_BG_KEYS);

    // ==== BG FIT (không bị cắt) ====
    const bg = this.add.image(width/2, height/2, chosenBG).setOrigin(0.5);

    const scaleX = width  / DESIGN_WIDTH;
    const scaleY = height / DESIGN_HEIGHT;
    const fitScale = Math.min(scaleX, scaleY);     // giữ nguyên ảnh, không crop
    bg.setScale(fitScale);

    // ==== VIGNETTE (LỚP MỜ Ở VIỀN) ====
    const overlay = this.add.image(width/2, height/2, "vignette_mask")
      .setOrigin(0.5)
      .setAlpha(0.75);  // độ mờ (0.5–0.85 đẹp nhất)

    overlay.setScale(fitScale);  // khớp đúng BG

    // Auto vào game sau 3s
    this.time.delayedCall(3000, () => {
      this.scene.start("GameScene", { level: 1 });
    });

    // Click vào → vào ngay
    this.input.once("pointerdown", () => {
      this.scene.start("GameScene", { level: 1 });
    });
  }
}
