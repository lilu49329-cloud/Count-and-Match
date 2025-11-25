// js/OverlayScene.js
import { preloadAssets } from "./assetLoader.js";

export default class OverlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "OverlayScene" });
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    const width  = this.scale.width  || 900;
    const height = this.scale.height || 600;

    // Kích thước thiết kế gốc
    const DESIGN_WIDTH  = 2160;
    const DESIGN_HEIGHT = 1620;

    // ====== VÙNG QUAN TRỌNG ======
    // Không mất chữ phía trên
    const SAFE_TOP = 240;

    // Không mất chân nhân vật phía dưới
    const SAFE_BOTTOM = 315;

    // Vùng quan trọng tổng hợp (Area Of Interest)
    const AOI_TOP = SAFE_TOP;
    const AOI_BOTTOM = DESIGN_HEIGHT - SAFE_BOTTOM;
    const AOI_CENTER = (AOI_TOP + AOI_BOTTOM) / 2; // px trên file gốc

    // Danh sách background intro
    const INTRO_BG_KEYS = [
      "intro_bg_1","intro_bg_2","intro_bg_3",
      "intro_bg_4","intro_bg_5","intro_bg_6","intro_bg_7"
    ];
    const chosenBG = Phaser.Utils.Array.GetRandom(INTRO_BG_KEYS);

    // ====== FIT WIDTH ======
    const scale = width / DESIGN_WIDTH;
    const scaledH = DESIGN_HEIGHT * scale; // nếu cần dùng sau

    // Tạo BG (anchor top để dễ tính toán crop)
    const bg = this.add.image(width / 2, 0, chosenBG).setOrigin(0.5, 0);
    bg.setScale(scale);

    // ====== CĂN GIỮA VÙNG QUAN TRỌNG (CHỮ + NHÂN VẬT) ======
    const screenCenterY = height / 2;
    const AOI_center_scaled = AOI_CENTER * scale;

    // Đặt Y của BG sao cho tâm vùng AOI nằm đúng giữa màn hình
    bg.y = screenCenterY - AOI_center_scaled;

    // Overlay làm sáng nhẹ toàn màn
    this.add.rectangle(0, 0, width, height, 0xffffff, 0.10).setOrigin(0, 0);

    // ======================
    // CHUẨN BỊ NHẠC NỀN CHUNG
    // ======================
    let bgm = this.sound.get("bgm_main");
    if (!bgm) {
      // Chỉ add, CHƯA play để tránh bị chặn autoplay
      bgm = this.sound.add("bgm_main", {
        loop: true,
        volume: 0.28,
      });
    }
    this.bgm = bgm;

    // ======================
    // HÀM START GAME (GỌI KHI BÉ CHẠM LẦN ĐẦU)
    // ======================
    const startGame = () => {
      // Chặn gọi nhiều lần nếu bé chạm liên tiếp
      if (this._started) return;
      this._started = true;

      // Lần tương tác đầu tiên → được phép play audio
      if (this.bgm && !this.bgm.isPlaying) {
        this.bgm.play();
      }

      // Phát voice intro nếu có
      if (this.sound && this.sound.play) {
        this.sound.play("voice_intro", { volume: 1 });
      }

      // Vào GameScene, level đầu tiên là 0
      this.scene.start("GameScene", { level: 0 });
    };

    // ======================
    // BỎ AUTO CHUYỂN MÀN
    // ======================
    // Không dùng delayedCall nữa – chờ bé chạm.

    // Bé chạm bất kỳ đâu trên màn -> bắt đầu game
    this.input.once("pointerdown", startGame);

  }
}
