// === TỰ CHỈNH TỈ LỆ TRỰC TIẾP, KHÔNG QUAN TÂM SCALE ===
// 0.0 = mép trái, 1.0 = mép phải (tính từ mép phải tới tâm lỗ)
const HOLE_OFFSET_X_RATIO      = 0.10;   // chỉnh ngang: tăng/giảm để lỗ dịch vào/ra theo chiều ngang

// chỉnh dọc: 0.5 = giữa, <0.5 = lên, >0.5 = xuống
const HOLE_OFFSET_Y_LEFT_RATIO  = 0.455; // thẻ số (card)
const HOLE_OFFSET_Y_RIGHT_RATIO = 0.455; // thẻ hình (card2)

// Lỗ tròn trên card gốc cao 225px, đường kính ~26px
const HOLE_RADIUS_RATIO        = (26 / 2) / 225;

// Độ sâu line chui vào lỗ (tính theo bán kính lỗ hiển thị)
const HOLE_ALONG_FACTOR        = 0.9;

// Độ dày line (tính từ đường kính lỗ)
const LINE_THICKNESS_FACTOR    = 0.6;

// CẮT THÊM 1 CHÚT Ở HAI ĐẦU LINE ĐỂ KHÔNG VƯỢT QUÁ LỖ
const LINE_TRIM_FACTOR         = 0.22; // chỉnh tăng = line ngắn hơn

// LỆCH TÂM LỖ THEO HƯỚNG ĐƯỜNG CHÉO
// 0 → không lệch, >0 → lệch rõ hơn
const HOLE_SLOPE_OFFSET_RATIO  = 0.06;

// ----------------- LOGIC RIÊNG CHO BÀI 1–2 -----------------
// 10 asset dùng cho trò 1–2
const ALL_ASSETS_12 = [
  'flower',  // bông hoa
  'bear',
  'ball',
  'marble',
  'drum',
  'rabbit',
  'clock',
  'red',
  'yellow',
  'babie',
];

// label hiển thị dưới thẻ hình (nếu bạn không cần text thì cho '' hết cũng được)
const LABEL_BY_ASSET = {
  // ví dụ:
  // flower: 'Bông hoa',
};

// Các pattern số 1/2 cho 1 màn (4 cặp)
const ONE_TWO_PATTERNS = [
  [1, 1, 1, 2],
  [1, 1, 2, 2],
  [1, 2, 2, 2],
];

// shuffle đơn giản (không phụ thuộc Phaser)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Tạo list level theo logic 1–2
function buildOneTwoLevels() {
  const shuffledAssets = shuffle(ALL_ASSETS_12);

  // 3 màn là đủ đi hết 10 asset:
  const level1Assets = shuffledAssets.slice(0, 4);  // 4 asset
  const level2Assets = shuffledAssets.slice(4, 8);  // 4 asset tiếp
  const level3Assets = shuffledAssets.slice(8, 10)  // 2 asset còn lại
    .concat(shuffledAssets.slice(0, 2));            // mượn lại 2 asset cho đủ 4

  const bgKeys   = ['bg1', 'bg2', 'bg3'];
  const charKeys = ['char1', 'char2', 'char1'];

  const assetGroups = [level1Assets, level2Assets, level3Assets];

  const levelsCore = assetGroups.map((assets, idx) => {
    const pattern = ONE_TWO_PATTERNS[
      Math.floor(Math.random() * ONE_TWO_PATTERNS.length)
    ]; // ví dụ: [1,1,2,2]

    const items = assets.map((assetKey, i) => ({
      number: pattern[i],              // chỉ 1 hoặc 2
      asset: assetKey,
      label: LABEL_BY_ASSET[assetKey] || '',
    }));

    return {
      items,
      background: bgKeys[idx],
      character:  charKeys[idx],
    };
  });

  // Thêm intro / outro cho khớp code cũ
  return ['intro', ...levelsCore, 'outro'];
}

import { preloadAssets } from './assetLoader.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // DÙNG LOGIC 1–2 MỚI
    this.levels = buildOneTwoLevels();
  }

  preload() {
    preloadAssets(this);
  }

  init(data) {
    this.level = data.level || 1;
  }

  // Helper: scale bán kính lỗ theo chiều cao card
  getHoleRadius(card) {
    return card.displayHeight * HOLE_RADIUS_RATIO;
  }

  /**
   * slopeDir:
   *   0  : không lệch (đường ngang)
   *   >0 : lệch xuống
   *   <0 : lệch lên
   */
  getHolePos(card, side = 'right', slopeDir = 0) {
    const offsetX = card.displayWidth * HOLE_OFFSET_X_RATIO;

    const yRatio = (side === 'right')
      ? HOLE_OFFSET_Y_LEFT_RATIO    // thẻ số (card) - nối lỗ bên phải
      : HOLE_OFFSET_Y_RIGHT_RATIO;  // thẻ hình (card2) - nối lỗ bên trái

    const baseOffsetY = card.displayHeight * (yRatio - 0.5);
    const slopeOffset = slopeDir * card.displayHeight * HOLE_SLOPE_OFFSET_RATIO;

    const x = (side === 'right')
      ? card.x + card.displayWidth / 2 - offsetX
      : card.x - card.displayWidth / 2 + offsetX;
    const y = card.y + baseOffsetY + slopeOffset;

    return { x, y };
  }

  // Vẽ lại tất cả các line nối dựa trên this.matches
  drawAllLines() {
    if (this.permanentLines && Array.isArray(this.permanentLines)) {
      this.permanentLines.forEach(line => { if (line && line.destroy) line.destroy(); });
    }
    this.permanentLines = [];

    if (this.matches && Array.isArray(this.matches)) {
      for (let i = 0; i < this.matches.length; i++) {
        if (!this.matches[i]) continue;

        const startCard = this.numbers[i];
        const n = startCard.customData.number;
        const objIdx = this.objects.findIndex(
          obj => obj.customData.number === n && obj.texture.key.startsWith('card_yellow2')
        );
        if (objIdx === -1) continue;

        const endCard = this.objects[objIdx];

        const dyCenter = endCard.y - startCard.y;
        const slopeDirStart = -Math.sign(dyCenter); // thẻ số đi ngược hướng
        const slopeDirEnd   =  Math.sign(dyCenter); // thẻ hình đi cùng hướng

        const start = this.getHolePos(startCard, 'right', slopeDirStart);
        const end   = this.getHolePos(endCard,   'left',  slopeDirEnd);

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const rVisual = this.getHoleRadius(startCard);
        const rAlong  = rVisual * HOLE_ALONG_FACTOR;
        const trim    = rVisual * LINE_TRIM_FACTOR;
        const lineThickness = rVisual * 2 * LINE_THICKNESS_FACTOR;

        const bodyLength = Math.max(dist - 2 * (rAlong + trim), 0);
        const startBodyX = start.x + (dx / dist) * (rAlong + trim);
        const startBodyY = start.y + (dy / dist) * (rAlong + trim);

        const line = this.add.image(startBodyX, startBodyY, 'line_glow')
          .setOrigin(0, 0.5)
          .setDisplaySize(bodyLength, lineThickness)
          .setRotation(Math.atan2(dy, dx));

        this.permanentLines.push(line);
      }
    }
  }

  create() {
    // --- PHÁT NHẠC NỀN ---
    if (this.sound && this.sound.add && !this.bgm) {
      this.bgm = this.sound.add('bgm_main', { loop: true, volume: 0.5 });
    }

    // --- BACKGROUND & CHARACTER TỪ LEVEL CONFIG ---
    const width = 900, height = 600;
    const bgW = 2160, bgH = 1620;
    const scaleBG_BG = Math.max(width / bgW, height / bgH);
    const scaleBG = Math.min(width / bgW, height / bgH);

    const levelIdx = (typeof this.level === 'number' ? this.level : 0);
    const currentLevel = this.levels[levelIdx];

    // Load background nếu có
    if (currentLevel && currentLevel.background && this.textures.exists && this.textures.exists(currentLevel.background)) {
      this.add.image(width / 2, height / 2, currentLevel.background)
        .setOrigin(0.5)
        .setScale(scaleBG_BG);
    } else {
      this.cameras.main.setBackgroundColor("#e1f5fe");
    }

    // Load character nếu có
    const charW = 364, charH = 676;
    const scaleChar = scaleBG;
    const charX = 70 + (charW * scaleChar) / 2, charY = height - 10;
    if (currentLevel && currentLevel.character && this.textures.exists && this.textures.exists(currentLevel.character)) {
      this.add.image(charX, charY, currentLevel.character).setOrigin(0.5, 1).setScale(scaleChar);
    } else {
      this.add.text(charX, charY, "😊", { fontSize: `${Math.round(120 * scaleChar)}px` }).setOrigin(0.5, 1);
    }

    // Nút replay / next
    const replayBtnSize = Math.round(90 * scaleBG);
    const nextBtnSize = Math.round(90 * scaleBG);
    this.replayBtn = this.createButton(width * 0.05, height * 0.07, '', 'replay_svg', null, () => {
      window.location.reload();
    }, replayBtnSize);
    this.nextBtn = this.createButton(width * 0.95, height * 0.07, '', 'next_svg', null, () => {
      if (this.isLevelComplete()) {
        let nextLevel = (typeof this.level === 'number') ? this.level + 1 : 1;
        if (nextLevel >= this.levels.length) nextLevel = this.levels.length - 1;
        this.scene.restart({ level: nextLevel });
      } else {
        if (this.snd && this.snd.needFinish) {
          this.snd.needFinish.play({ volume: 0.8 });
        }
        if (this.sound && this.sound.play) {
          this.sound.play('voice_need_finish', { volume: 1 });
        }
      }
    }, nextBtnSize);

    // Nếu là màn kết thúc (outro), chuyển sang EndGameScene
    if (currentLevel === 'outro') {
      this.scene.start('EndGameScene');
      return;
    }

    // Đã có OverlayScene riêng, không cần overlay intro ở đây nữa

    // ----- CÁC MÀN CHƠI BÌNH THƯỜNG -----
    const items = currentLevel.items;

    // Trộn vị trí cột đồ vật
    const shuffled = Phaser.Utils.Array.Shuffle([...items]);

    // --- MAIN BOARD ---
    const boardOrigW = 1603;
    const boardOrigH = 1073;
    const leftEdge = charX + (charW * scaleChar) / 2 + 30;
    const rightEdge = width - 40;
    const boardAreaW = rightEdge - leftEdge;
    const boardAreaH = 900 * scaleBG + 80 * scaleBG;
    const scaleBoard = Math.min(boardAreaW / boardOrigW, boardAreaH / boardOrigH);
    const boardW = boardOrigW * scaleBoard;
    const boardH = boardOrigH * scaleBoard;
    const boardX = leftEdge + boardAreaW / 2;
    const boardY = height / 2;

    if (this.textures.exists && this.textures.exists("board")) {
      this.add.image(boardX, boardY, "board").setOrigin(0.5).setDisplaySize(boardW, boardH);
    }

    const colNumX = boardX + boardW / 4 + 10 * scaleBG;
    const colObjX = boardX - boardW / 4 - 10 * scaleBG;

    this.numbers = [];
    this.objects = [];
    this.lines = [];
    this.matched = new Set();
    this.isDrawing = false;
    this.currentLine = null;
    this.startIndex = null;
    this.nextWarn = null;

    const cardScale = 0.85;
    const cardGap = 18 * scaleBG;
    const totalCardH = 4 * (225 * scaleBG * cardScale) + 3 * cardGap;
    const baseY = boardY - totalCardH / 2 + (225 * scaleBG * cardScale) / 2;

    // Thẻ số bên trái
    items.forEach((item, i) => {
      const y = baseY + i * ((225 * scaleBG * cardScale) + cardGap);
      const cardW = 669 * scaleBG * cardScale, cardH = 225 * scaleBG * cardScale;

      let card;
      if (this.textures.exists && this.textures.exists('card')) {
        card = this.add.image(colObjX, y, 'card').setOrigin(0.5).setDisplaySize(cardW, cardH);
      } else if (this.textures.exists && this.textures.exists('card.png')) {
        card = this.add.image(colObjX, y, 'card.png').setOrigin(0.5).setDisplaySize(cardW, cardH);
      } else {
        card = this.add.zone(colObjX, y, cardW, cardH).setOrigin(0.5);
      }

      const numAsset = `number_${item.number}`;
      if (this.textures.exists && this.textures.exists(numAsset)) {
        const numContent = this.add.image(colObjX, y, numAsset).setOrigin(0.5);
        const scaleNum = Math.min((cardH * 0.7) / numContent.height, (cardW * 0.7) / numContent.width, 1);
        numContent.setScale(scaleNum);
      } else {
        this.add.text(colObjX, y, `${item.number}`, {
          fontFamily: 'Fredoka',
          fontSize: `${Math.round(120 * scaleBG)}px`,
          color: '#ff69b4', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5);
      }

      card.setInteractive({ useHandCursor: true });
      card.customData = { index: i, number: item.number, cardW, cardH, glow: null };
      this.numbers.push(card);
    });

    // Thẻ hình bên phải
    shuffled.forEach((item, i) => {
      const y = baseY + i * ((225 * scaleBG * cardScale) + cardGap);
      const cardW = 669 * scaleBG * cardScale, cardH = 225 * scaleBG * cardScale;

      let card;
      if (this.textures.exists && this.textures.exists('card2')) {
        card = this.add.image(colNumX, y, 'card2').setOrigin(0.5).setDisplaySize(cardW, cardH);
      } else if (this.textures.exists && this.textures.exists('card2.png')) {
        card = this.add.image(colNumX, y, 'card2.png').setOrigin(0.5).setDisplaySize(cardW, cardH);
      } else {
        card = this.add.zone(colNumX, y, cardW, cardH).setOrigin(0.5);
      }

      // Vẽ icon theo số lượng (1 hoặc 2)
      if (this.textures.exists && this.textures.exists(item.asset)) {
        const count = item.number; // 1 hoặc 2
        let tempIcon = this.add.image(0, 0, item.asset);
        const assetW = tempIcon.width || 1;
        const assetH = tempIcon.height || 1;
        tempIcon.destroy();
        const iconGapX = -6;

        const scaleSmallX = (cardW * 0.9) / (count * assetW);
        const scaleSmallY = (cardH * 1.05) / assetH;
        const scaleSmall = Math.min(scaleSmallX, scaleSmallY);
        const totalWidth = count * assetW * scaleSmall;
        const SHIFT_RIGHT = cardW * 0.10;
        const startX = colNumX - totalWidth / 2 + (assetW * scaleSmall) / 2 + SHIFT_RIGHT;
        const startY = y;
        for (let k = 0; k < count; k++) {
          let icon = this.add.image(startX + k * (assetW * scaleSmall + iconGapX), startY, item.asset).setOrigin(0.5);
          icon.setScale(scaleSmall);
        }
      }

      this.add.text(colNumX, y + cardH / 2 - 32 * scaleBG, item.label || '', {
        fontFamily: 'Fredoka', fontSize: `${Math.round(48 * scaleBG)}px`,
        color: '#222', align: 'center'
      }).setOrigin(0.5, 0.5);

      card.setInteractive({ useHandCursor: true });
      card.customData = { index: i, number: item.number, asset: item.asset, cardW, cardH, glow: null };
      this.objects.push(card);
    });

    // --- KÉO NỐI (DRAG CONNECT LOGIC) ---
    this.permanentLines = [];
    this.dragLine = null;
    this.isDragging = false;
    this.dragStartIdx = null;
    this.matches = Array(4).fill(false);

    // Bàn tay gợi ý
    const showHintHand = () => {
      if (this.textures && this.textures.exists && this.textures.exists('hand')) {
        let hintIdx = null, objHintIdx = null;
        for (let i = 0; i < 4; i++) {
          if (this.matches && this.matches[i]) continue;
          const n = items[i].number;
          for (let j = 0; j < 4; j++) {
            if (this.matches && this.matches[j]) continue;
            const objN = shuffled[j].number;
            if (n === objN) {
              hintIdx = i;
              objHintIdx = j;
              break;
            }
          }
          if (objHintIdx !== null) break;
        }
        if (hintIdx !== null && objHintIdx !== null) {
          const numObj = this.numbers[hintIdx];
          const objCard = this.objects[objHintIdx];
          if (numObj && objCard) {
            let hand = this.add.image(numObj.x, numObj.y + 40, 'hand').setOrigin(0.5).setDisplaySize(64, 64);
            hand.setDepth(1000);
            this.tweens.add({
              targets: hand,
              x: objCard.x,
              y: objCard.y + 40,
              duration: 1200,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
            this.time.delayedCall(3000, () => { if (hand && hand.destroy) hand.destroy(); });
          }
        }
      } else {
        this.time.delayedCall(200, showHintHand);
      }
    };
    this.time.delayedCall(200, showHintHand);

    // Enable drag cho thẻ số
    this.numbers.forEach((numCard, idx) => {
      numCard.setInteractive({ useHandCursor: true, draggable: true });
      numCard.on('pointerdown', (pointer) => {
        if (this.matches[idx]) return;
        this.isDragging = true;
        this.dragStartIdx = idx;

        const start = this.getHolePos(numCard, 'right', 0);
        const rVisual = this.getHoleRadius(numCard);
        const lineThickness = rVisual * 2 * LINE_THICKNESS_FACTOR;

        this.dragLine = this.add.image(start.x, start.y, 'line_glow')
          .setOrigin(0, 0.5)
          .setDisplaySize(1, lineThickness);
      });
    });

    this.input.on('pointermove', (pointer) => {
      if (!this.isDragging || this.dragStartIdx === null || !this.dragLine) return;

      const startCard = this.numbers[this.dragStartIdx];
      const dyCenter = pointer.y - startCard.y;
      const slopeDirStart = -Math.sign(dyCenter);

      const start = this.getHolePos(startCard, 'right', slopeDirStart);

      const dx = pointer.x - start.x;
      const dy = pointer.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const rVisual = this.getHoleRadius(startCard);
      const rAlong  = rVisual * HOLE_ALONG_FACTOR;
      const trim    = rVisual * LINE_TRIM_FACTOR;
      const lineThickness = rVisual * 2 * LINE_THICKNESS_FACTOR;

      const bodyLength = Math.max(dist - 2 * (rAlong + trim), 0);
      const startBodyX = start.x + (dx / dist) * (rAlong + trim);
      const startBodyY = start.y + (dy / dist) * (rAlong + trim);

      this.dragLine.x = startBodyX;
      this.dragLine.y = startBodyY;
      this.dragLine.setDisplaySize(bodyLength, lineThickness);
      this.dragLine.rotation = Math.atan2(dy, dx);
    });

    this.input.on('pointerup', (pointer) => {
      if (!this.isDragging || this.dragStartIdx === null) return;
      let matched = false;

      this.objects.forEach((objCard, objIdx) => {
        const bounds = objCard.getBounds();
        if (!Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) return;

        const n = items[this.dragStartIdx].number;
        const objN = shuffled[objIdx].number;
        const startCard = this.numbers[this.dragStartIdx];
        const endCard   = objCard;

        if (n === objN && !this.matches[this.dragStartIdx]) {
          this.matches[this.dragStartIdx] = true;
          matched = true;

          if (this.snd && this.snd.correct) {
            this.snd.correct.play({ volume: 0.7 });
          }
          if (this.sound && this.sound.play) {
            this.sound.play('sfx_correct', { volume: 1 });
          }
          // Confetti effect removed for Phaser 3.60+ compatibility
          // You can add a temporary sprite or flash here if you want a visual effect

          // Đổi texture 2 card thành thẻ vàng
          if (startCard.setTexture) {
            startCard.setTexture('card_yellow');
            startCard.setDisplaySize(startCard.customData.cardW, startCard.customData.cardH);
            if (this.textures.exists('card_glow')) {
              const glowScale = 1.12;
              const glow = this.add.image(startCard.x, startCard.y, 'card_glow')
                .setOrigin(0.5)
                .setDisplaySize(startCard.customData.cardW * glowScale, startCard.customData.cardH * glowScale)
                .setAlpha(1);
              glow.setDepth(startCard.depth ? startCard.depth - 1 : 0);
              this.tweens.add({
                targets: glow,
                alpha: 0,
                duration: 400,
                ease: 'Cubic.easeIn',
                onComplete: () => { glow.destroy(); }
              });
            }
          }
          if (endCard.setTexture) {
            endCard.setTexture('card_yellow2');
            endCard.setDisplaySize(endCard.customData.cardW, endCard.customData.cardH);
            if (this.textures.exists('card_glow')) {
              const glowScale = 1.12;
              const glow = this.add.image(endCard.x, endCard.y, 'card_glow')
                .setOrigin(0.5)
                .setDisplaySize(endCard.customData.cardW * glowScale, endCard.customData.cardH * glowScale)
                .setAlpha(1);
              glow.setDepth(endCard.depth ? endCard.depth - 1 : 0);
              this.tweens.add({
                targets: glow,
                alpha: 0,
                duration: 400,
                ease: 'Cubic.easeIn',
                onComplete: () => { glow.destroy(); }
              });
            }
          }

          // Chốt line thành permanent
          if (this.dragLine) {
            const dyCenter = endCard.y - startCard.y;
            const slopeDirStart = -Math.sign(dyCenter);
            const slopeDirEnd   =  Math.sign(dyCenter);

            const start = this.getHolePos(startCard, 'right', slopeDirStart);
            const end   = this.getHolePos(endCard,   'left',  slopeDirEnd);

            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            const rVisual = this.getHoleRadius(startCard);
            const rAlong  = rVisual * HOLE_ALONG_FACTOR;
            const trim    = rVisual * LINE_TRIM_FACTOR;
            const lineThickness = rVisual * 2 * LINE_THICKNESS_FACTOR;

            const bodyLength = Math.max(dist - 2 * (rAlong + trim), 0);
            const startBodyX = start.x + (dx / dist) * (rAlong + trim);
            const startBodyY = start.y + (dy / dist) * (rAlong + trim);

            this.dragLine.x = startBodyX;
            this.dragLine.y = startBodyY;
            this.dragLine.setDisplaySize(bodyLength, lineThickness);
            this.dragLine.rotation = Math.atan2(dy, dx);

            this.permanentLines.push(this.dragLine);
            this.dragLine = null;
          }

          this.tweens.add({
            targets: [startCard, endCard],
            scaleX: startCard.scaleX * 1.05,
            scaleY: startCard.scaleY * 1.05,
            yoyo: true,
            duration: 120
          });
        } else if (!this.matches[this.dragStartIdx]) {
          this.tweens.add({ targets: [objCard], x: '+=10', yoyo: true, repeat: 2, duration: 60 });
          if (this.sound && this.sound.play) {
            this.sound.play('sfx_wrong', { volume: 1 });
          }
        }
      });

      if (!matched && this.dragLine) {
        this.dragLine.destroy();
        this.dragLine = null;
      }
      this.isDragging = false;
      this.dragStartIdx = null;

      if (this.matches.every(m => m)) {
        this.time.delayedCall(2000, () => {
          if (this.snd && this.snd.complete) {
            this.snd.complete.play({ volume: 0.8 });
          }
          if (this.sound && this.sound.play) {
            this.sound.play('voice_complete', { volume: 1 });
          }
          if (this.confettiEmitter) {
            this.confettiEmitter.setTint([
              0xff4081, 0xffeb3b, 0x40c4ff, 0x69f0ae
            ]);
            this.confettiEmitter.explode(40, 450, 260);
          }
        });
      }
    });
  }

  redrawLines() {
    this.drawAllLines();
  }

  createButton(x, y, label, assetKey, bgColor, onClick, fontSize = 32) {
    let btn;
    if (assetKey && this.textures.exists && this.textures.exists(assetKey)) {
      btn = this.add.image(x, y, assetKey).setOrigin(0.5).setInteractive({ useHandCursor: true });
      btn.setDisplaySize(fontSize, fontSize);
    } else {
      btn = this.add.text(x, y, label, {
        fontFamily: 'Fredoka', fontSize: `${fontSize}px`, color: '#fff',
        backgroundColor: bgColor ? bgColor : undefined,
        padding: { left: 16, right: 16, top: 8, bottom: 8 }, borderRadius: 20
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    }
    btn.on('pointerdown', onClick);
    return btn;
  }

  isLevelComplete() {
    return Array.isArray(this.matches) ? this.matches.every(m => m) : false;
  }
}


