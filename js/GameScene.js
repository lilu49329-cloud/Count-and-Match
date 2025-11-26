import { preloadAssets } from './assetLoader.js'; 

// LƯU Ý: Trong config Phaser (new Phaser.Game) nên đặt:
// render: { pixelArt: true, antialias: false }

// ========== CÁC HẰNG SỐ CĂN LỖ & LINE ==========
// Dịch ngang: 0.0 = mép trái, 1.0 = mép phải
// -> Muốn line chui vào sâu hơn thân thẻ thì GIẢM số này.
const HOLE_OFFSET_X_RATIO = 0.22;

// Dịch dọc: 0.5 = giữa; <0.5 lên trên; >0.5 xuống dưới
// -> Muốn lỗ bên thẻ số lệch lên/xuống thì chỉnh 2 dòng dưới:
const HOLE_OFFSET_Y_LEFT_RATIO  = 0.497;
const HOLE_OFFSET_Y_RIGHT_RATIO = 0.497;

// Bán kính lỗ = tỉ lệ theo chiều cao card gốc (225px, lỗ 32px)
const HOLE_RADIUS_RATIO = (32 / 2) / 225;

// Hai hằng dưới giờ gần như KHÔNG dùng cho chiều dài line,
// chỉ giữ lại để không phá logic cũ (nếu muốn xài lại).
const HOLE_ALONG_FACTOR = 0.8;

// Độ dày line = 2 * bán kính * factor
// -> Muốn line dày hơn: tăng LINE_THICKNESS_FACTOR
// -> Muốn line mảnh lại: giảm nó xuống.
const LINE_THICKNESS_FACTOR = 0.7;

const LINE_TRIM_FACTOR = 0.12;

// Độ lệch lỗ theo đường chéo (chưa dùng, để 0 cho an toàn)
const HOLE_SLOPE_OFFSET_RATIO = 0.0;

// ====== HẰNG SỐ MỚI: CHỈNH TÂM 4 LỖ THẺ SỐ & 4 LỖ THẺ HÌNH ======
// Tất cả đều là TỈ LỆ theo kích thước thẻ.
const HOLE_OFFSET_NUMBER_DX = [0.139, 0.138, 0.138, 0.138];
const HOLE_OFFSET_NUMBER_DY = [-0.0206, -0.0196, -0.0316, -0.0216];

const HOLE_OFFSET_OBJECT_DX = [-0.138, -0.138, -0.138, -0.138];
const HOLE_OFFSET_OBJECT_DY = [-0.0238, -0.027, -0.014, -0.018];

// Asset tay hướng dẫn
const HAND_ASSET_KEY = 'hand';

// Origin của sprite "hand" trùng với NGÓN TAY (tinh chỉnh thêm nếu lệch)
// 0.0 = mép trái/trên, 1.0 = mép phải/dưới
const HAND_FINGER_ORIGIN_X = 0.8;
const HAND_FINGER_ORIGIN_Y = 0.2;

const ALL_ASSETS_12 = [
  'flower', 'bear', 'ball', 'marble', 'drum',
  'rabbit', 'clock', 'red', 'yellow', 'babie'
];

const LABEL_BY_ASSET = {};

const ONE_TWO_PATTERNS = [
  [1, 1, 1, 2],
  [1, 1, 2, 2],
  [1, 2, 2, 2]
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOneTwoLevels() {
  const shuffledAssets = shuffle(ALL_ASSETS_12);

  const level1Assets = shuffledAssets.slice(0, 4);
  const level2Assets = shuffledAssets.slice(4, 8);
  const level3Assets = shuffledAssets.slice(8, 10).concat(shuffledAssets.slice(0, 2));

  const bgKeys = ['bg1', 'bg2', 'bg3'];
  const charKeys = ['char1', 'char2', 'char1'];

  const assetGroups = [level1Assets, level2Assets, level3Assets];

  return assetGroups.map((assets, idx) => {
    const pattern = ONE_TWO_PATTERNS[Math.floor(Math.random() * ONE_TWO_PATTERNS.length)];

    const items = assets.map((key, i) => ({
      number: pattern[i],
      asset: key,
      label: LABEL_BY_ASSET[key] || ''
    }));

    return {
      items,
      background: bgKeys[idx],
      character: charKeys[idx]
    };
  });
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.levels   = buildOneTwoLevels();
    this.handHint = null;
    this.scaleBG  = 1;
  }

  preload() {
    preloadAssets(this);
  }

  init(data) {
    this.level = (typeof data.level === 'number') ? data.level : 0;
  }

  // Bán kính lỗ theo chiều cao thẻ hiện tại
  getHoleRadius(card) {
    return card.displayHeight * HOLE_RADIUS_RATIO;
  }

  // Tính TÂM LỖ trên một card (trả về {x,y})
  getHolePos(card, side = 'right', slopeDir = 0) {
    const offsetX = card.displayWidth * HOLE_OFFSET_X_RATIO;

    const yRatio = (side === 'right')
      ? HOLE_OFFSET_Y_RIGHT_RATIO
      : HOLE_OFFSET_Y_LEFT_RATIO;

    const baseOffsetY = card.displayHeight * (yRatio - 0.5);
    const slopeOffset = slopeDir * card.displayHeight * HOLE_SLOPE_OFFSET_RATIO;

    let idx = 0;
    if (card.customData && typeof card.customData.index === 'number') {
      idx = card.customData.index;
    }
    if (idx < 0) idx = 0;
    if (idx > 3) idx = 3;

    let extraDX = 0;
    let extraDY = 0;

    if (side === 'right') {
      extraDX = card.displayWidth  * (HOLE_OFFSET_NUMBER_DX[idx] || 0);
      extraDY = card.displayHeight * (HOLE_OFFSET_NUMBER_DY[idx] || 0);
    } else {
      extraDX = card.displayWidth  * (HOLE_OFFSET_OBJECT_DX[idx] || 0);
      extraDY = card.displayHeight * (HOLE_OFFSET_OBJECT_DY[idx] || 0);
    }

    const baseX = (side === 'right')
      ? card.x + card.displayWidth / 2 - offsetX
      : card.x - card.displayWidth / 2 + offsetX;

    const baseY = card.y + baseOffsetY + slopeOffset;

    const x = baseX + extraDX;
    const y = baseY + extraDY;

    return { x, y };
  }

  // Tính đoạn line nằm giữa 2 lỗ
  computeSegment(start, end, rStart, rEnd, thicknessFactor = LINE_THICKNESS_FACTOR, innerFactor = 1.0) {
    const dx   = end.x - start.x;
    const dy   = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const cStart = rStart * innerFactor;
    const cEnd   = rEnd   * innerFactor;

    const bodyLen = Math.max(dist - cStart - cEnd, 0);

    const x0 = start.x + (dx / dist) * cStart;
    const y0 = start.y + (dy / dist) * cStart;

    const thickness = rStart * 2 * thicknessFactor;
    const angle     = Math.atan2(dy, dx);

    return { x0, y0, bodyLen, thickness, angle };
  }

  drawAllLines() {
    if (this.permanentLines) {
      this.permanentLines.forEach(l => l && l.destroy && l.destroy());
    }
    this.permanentLines = [];

    if (!this.matches) return;

    for (let i = 0; i < this.matches.length; i++) {
      if (!this.matches[i]) continue;

      const startCard = this.numbers[i];
      const n        = startCard.customData.number;

      const objIdx = this.objects.findIndex(
        o => o.customData.number === n && o.texture.key.startsWith('card_yellow2')
      );
      if (objIdx === -1) continue;

      const endCard = this.objects[objIdx];
      const dyC     = endCard.y - startCard.y;

      let sStart = 0, sEnd = 0;
      if (dyC !== 0) { sStart = -1; sEnd = 1; }

      const start = this.getHolePos(startCard, 'right', sStart);
      const end   = this.getHolePos(endCard, 'left',  sEnd);

      const rStart = this.getHoleRadius(startCard);
      const rEnd   = this.getHoleRadius(endCard);

      const seg = this.computeSegment(start, end, rStart, rEnd);

      const line = this.add.image(seg.x0, seg.y0, 'line_glow')
        .setOrigin(0, 0.5)
        .setDisplaySize(seg.bodyLen, seg.thickness)
        .setRotation(seg.angle);

      this.permanentLines.push(line);
    }
  }

  create() {
    const cam    = this.cameras.main;
    const width  = cam.width;
    const height = cam.height;

    this.input.setDefaultCursor('default');

    // BGM
    let bgm = this.sound.get('bgm_main');
    if (!bgm) {
      bgm = this.sound.add('bgm_main', { loop: true, volume: 0.28 });
      bgm.play();
    } else if (!bgm.isPlaying) {
      bgm.play();
    }
    this.bgm = bgm;

    const level = this.levels[this.level];

    // BACKGROUND
    const bgW = 2160, bgH = 1620;
    const scaleBG = Math.max(width / bgW, height / bgH);
    this.scaleBG  = scaleBG;

    if (level && level.background && this.textures.exists(level.background)) {
      this.add.image(width / 2, height / 2, level.background)
        .setOrigin(0.5)
        .setScale(scaleBG);
    } else {
      this.cameras.main.setBackgroundColor('#000');
    }

    // CHARACTER
    const charW    = 364;
    const scaleChar = scaleBG * 1.3;
    const charX     = 70 + (charW * scaleChar) / 2;
    const charY     = height - 10;

    if (this.textures.exists(level.character)) {
      this.add.image(charX, charY, level.character)
        .setOrigin(0.5, 1)
        .setScale(scaleChar);
    } else {
      this.add.text(charX, charY, '😊', {
        fontSize: `${Math.round(120 * scaleChar)}px`
      }).setOrigin(0.5, 1);
    }

    // BOARD
    const items    = level.items;
    const shuffled = Phaser.Utils.Array.Shuffle([...items]);

    const boardOrigW = 1603, boardOrigH = 1073;
    const leftEdge   = charX + (charW * scaleChar) / 2 + 30;
    const rightEdge  = width - 40;

    const boardAreaW = rightEdge - leftEdge;
    const boardAreaH = 900 * scaleBG + 80 * scaleBG;

    const scaleBoard = Math.min(boardAreaW / boardOrigW, boardAreaH / boardOrigH);
    const boardW     = boardOrigW * scaleBoard;
    const boardH     = boardOrigH * scaleBoard;

    const boardX = leftEdge + boardAreaW / 2;
    const boardY = height  / 2;

    if (this.textures.exists("board")) {
      this.add.image(boardX, boardY, 'board')
        .setOrigin(0.5)
        .setDisplaySize(boardW, boardH);
    }

    const colNumX = boardX + boardW / 4 + 10 * scaleBG;
    const colObjX = boardX - boardW / 4 - 10 * scaleBG;

    this.numbers = [];
    this.objects = [];

    const cardScale = 0.85;
    const cardGap   = 18 * scaleBG;

    const totalH = 4 * (225 * scaleBG * cardScale) + 3 * cardGap;
    const baseY  = boardY - totalH / 2 + (225 * scaleBG * cardScale) / 2;

    // NUMBER CARDS (LEFT)
    items.forEach((item, i) => {
      const y     = baseY + i * ((225 * scaleBG * cardScale) + cardGap);
      const cardW = 669 * scaleBG * cardScale;
      const cardH = 225 * scaleBG * cardScale;

      let card;
      if (this.textures.exists('card'))
        card = this.add.image(colObjX, y, 'card')
          .setOrigin(0.5)
          .setDisplaySize(cardW, cardH);
      else
        card = this.add.zone(colObjX, y, cardW, cardH).setOrigin(0.5);

      const hoverTint  = 0xfff9c4;
      const activeTint = 0xffe082;

      card.setInteractive({ useHandCursor: true, cursor: 'pointer', draggable: true });

      card.on('pointerover', () => {
        if (!this.matches[i] && this.dragStartIdx !== i)
          card.setTint(hoverTint);
      });
      card.on('pointerout', () => {
        if (!this.matches[i] && this.dragStartIdx !== i)
          card.clearTint();
      });

      this.add.text(colObjX, y, String(item.number), {
        fontFamily: 'Fredoka',
        fontSize: `${Math.round(cardH * 0.65)}px`,
        color: '#ff006e',
        fontStyle: '900',
        stroke: '#fff',
        strokeThickness: Math.round(cardH * 0.08),
        resolution: 2
      }).setOrigin(0.5);

      card.customData = { index: i, number: item.number, cardW, cardH };
      card.hoverTint  = hoverTint;
      card.activeTint = activeTint;

      this.numbers.push(card);
    });

    // OBJECT CARDS (RIGHT)
    shuffled.forEach((item, i) => {
      const y     = baseY + i * ((225 * scaleBG * cardScale) + cardGap);
      const cardW = 669 * scaleBG * cardScale;
      const cardH = 225 * scaleBG * cardScale;

      let card;
      if (this.textures.exists('card2'))
        card = this.add.image(colNumX, y, 'card2')
          .setOrigin(0.5)
          .setDisplaySize(cardW, cardH);
      else
        card = this.add.zone(colNumX, y, cardW, cardH).setOrigin(0.5);

      const dropHoverTint = 0xc8e6ff;
      card.setInteractive({ useHandCursor: true, cursor: 'pointer' });

      card.on('pointerover', () => {
        if (!card.texture || card.texture.key !== 'card_yellow2')
          card.setTint(dropHoverTint);
      });
      card.on('pointerout', () => card.clearTint());

      // ICONS
      if (this.textures.exists(item.asset)) {
        let tmp = this.add.image(0, 0, item.asset);
        const aW = tmp.width, aH = tmp.height;
        tmp.destroy();

        const count = item.number;
        const gapX  = -6;

        const scaleX    = (cardW * 1.10) / (count * aW);
        const scaleY    = (cardH * 1.15) / aH;
        const iconScale = Math.min(scaleX, scaleY);

        const total       = count * aW * iconScale;
        const SHIFT_RIGHT = cardW * 0.10;

        const startX = colNumX - total / 2 + (aW * iconScale) / 2 + SHIFT_RIGHT;

        for (let k = 0; k < count; k++) {
          this.add.image(
            startX + k * (aW * iconScale + gapX), y, item.asset
          )
            .setOrigin(0.5)
            .setScale(iconScale);
        }
      }

      this.add.text(colNumX, y + cardH / 2 - 32 * scaleBG, item.label || '', {
        fontFamily: 'Fredoka',
        fontSize: `${Math.round(48 * scaleBG)}px`,
        color: '#222',
        stroke: '#fff',
        strokeThickness: 6,
        shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 4 }
      }).setOrigin(0.5);

      card.customData = {
        index:  i,
        number: item.number,
        asset:  item.asset,
        cardW, cardH
      };

      this.objects.push(card);
    });

    // ====== NÚT REPLAY & NEXT – NEO HAI GÓC TRÊN ======
    const replayBtnSize = Math.round(90 * scaleBG);
    const nextBtnSize   = Math.round(90 * scaleBG);
    const uiPad         = 20 * scaleBG;
    const btnY          = cam.worldView.y + uiPad;

    this.replayBtn = this.createButton(
      cam.worldView.x + uiPad,
      btnY,
      '',
      'replay_svg',
      null,
      () => {
        this.scene.restart({ level: this.level });
      },
      replayBtnSize
    ).setOrigin(0, 0).setDepth(100);

    this.nextBtn = this.createButton(
      cam.worldView.x + cam.width - uiPad,
      btnY,
      '',
      'next_svg',
      null,
      () => {
        if (!this.isLevelComplete()) {
          this.sound.play("voice_need_finish");
          return;
        }
        const nextIndex = this.level + 1;
        if (nextIndex >= this.levels.length)
          this.scene.start("EndGameScene");
        else
          this.scene.restart({ level: nextIndex });
      },
      nextBtnSize
    ).setOrigin(1, 0).setDepth(100);

    // ===== HAND HINT – CHỈ MÀN ĐẦU TIÊN, TẮT KHI USER CHẠM =====
    if (this.level === 0) {
      this.createHandHintForFirstPair(items);

      this.input.once('pointerdown', () => {
        if (this.handHint) {
          this.tweens.add({
            targets: this.handHint,
            alpha: 0,
            duration: 200,
            onComplete: () => {
              this.handHint.destroy();
              this.handHint = null;
            }
          });
        }
      });
    }

    // DRAG CONNECT
    this.permanentLines = [];
    this.dragLine       = null;
    this.isDragging     = false;
    this.dragStartIdx   = null;
    this.matches        = Array(4).fill(false);

    this.numbers.forEach((numCard, idx) => {
      numCard.on('pointerdown', () => {
        if (this.matches[idx]) return;

        this.isDragging   = true;
        this.dragStartIdx = idx;

        numCard.setTint(numCard.activeTint);

        const start = this.getHolePos(numCard, 'right', 0);
        const r     = this.getHoleRadius(numCard);
        const thick = r * 2 * LINE_THICKNESS_FACTOR;

        this.dragLine = this.add.image(start.x, start.y, 'line_glow')
          .setOrigin(0, 0.5)
          .setDisplaySize(1, thick)
          .setAlpha(0);

        this.tweens.add({
          targets: this.dragLine,
          alpha: { from: 0, to: 1 },
          duration: 120,
          ease: 'Quad.Out'
        });
      });
    });

    this.input.on('pointermove', (p) => {
      if (!this.isDragging || this.dragStartIdx === null || !this.dragLine) return;

      const startCard = this.numbers[this.dragStartIdx];
      const dyC       = p.y - startCard.y;
      const s         = (dyC !== 0) ? -1 : 0;

      const start  = this.getHolePos(startCard, 'right', s);
      const rStart = this.getHoleRadius(startCard);

      const end = { x: p.x, y: p.y };
      const seg = this.computeSegment(start, end, rStart, 0);

      this.dragLine.x = seg.x0;
      this.dragLine.y = seg.y0;
      this.dragLine.setDisplaySize(seg.bodyLen, seg.thickness);
      this.dragLine.rotation = seg.angle;
    });

    this.input.on('pointerup', (p) => {
      if (!this.isDragging || this.dragStartIdx === null) return;

      let matched     = false;
      const startIndex = this.dragStartIdx;
      const startCard  = this.numbers[startIndex];

      this.objects.forEach(objCard => {
        const b = objCard.getBounds();
        if (!Phaser.Geom.Rectangle.Contains(b, p.x, p.y)) return;

        const n    = items[startIndex].number;
        const objN = objCard.customData.number;

        if (n !== objN && !this.matches[startIndex]) {
          this.sound.play("sfx_wrong");
        }

        if (n === objN && !this.matches[startIndex]) {
          matched               = true;
          this.matches[startIndex] = true;

          this.sound.play('sfx_correct');

          startCard.clearTint();
          objCard.clearTint();

          startCard.setTexture('card_yellow')
            .setDisplaySize(startCard.customData.cardW, startCard.customData.cardH);

          objCard.setTexture('card_yellow2')
            .setDisplaySize(objCard.customData.cardW, objCard.customData.cardH);

          if (this.dragLine) {
            const dyC2    = objCard.y - startCard.y;
            let sStart = 0, sEnd = 0;
            if (dyC2 !== 0) { sStart = -1; sEnd = 1; }

            const st = this.getHolePos(startCard, 'right', sStart);
            const ed = this.getHolePos(objCard, 'left',  sEnd);

            const rStart = this.getHoleRadius(startCard);
            const rEnd   = this.getHoleRadius(objCard);

            const seg = this.computeSegment(st, ed, rStart, rEnd);

            this.dragLine.x = seg.x0;
            this.dragLine.y = seg.y0;
            this.dragLine.setDisplaySize(seg.bodyLen, seg.thickness);
            this.dragLine.rotation = seg.angle;

            this.permanentLines.push(this.dragLine);
            this.dragLine = null;
          }
        }
      });

      if (!matched) {
        if (this.dragLine) this.dragLine.destroy();
        if (!this.matches[startIndex]) startCard.clearTint();
      }

      this.isDragging   = false;
      this.dragStartIdx = null;

      if (this.matches.every(m => m)) {
        this.time.delayedCall(2000, () => {
          this.sound.play('voice_complete');
        });
      }
    });
  }

  // Tạo tay gợi ý di chuyển đúng cặp đầu tiên
  createHandHintForFirstPair(items) {
    if (!this.textures.exists(HAND_ASSET_KEY)) return;
    if (!this.numbers || !this.objects || this.numbers.length === 0) return;

    for (let i = 0; i < this.numbers.length; i++) {
      const numCard = this.numbers[i];
      const n       = items[i]?.number;
      if (n == null) continue;

      const objCard = this.objects.find(o => o.customData.number === n);
      if (!objCard) continue;

      // Tâm lỗ thẻ số
      const startPos = this.getHolePos(numCard, 'right', 0);

      // Tâm lỗ bên thẻ hình (bên trái)
      const rawEndPos = this.getHolePos(objCard, 'left', 0);

      // Đẩy tay chui thêm vào trong thẻ hình (dịch sang phải)
      const extraIntoObject = objCard.displayWidth * 0.28; // chỉnh 0.04–0.08 nếu cần

      const endPos = {
        x: rawEndPos.x + extraIntoObject,
        y: rawEndPos.y
      };

      const handScale = this.scaleBG * 0.9;

      this.handHint = this.add.image(startPos.x, startPos.y, HAND_ASSET_KEY)
        .setOrigin(HAND_FINGER_ORIGIN_X, HAND_FINGER_ORIGIN_Y) // ngón tay là tâm
        .setScale(handScale)
        .setAlpha(0.95);

      this.tweens.add({
        targets: this.handHint,
        x: endPos.x,
        y: endPos.y,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });

      this.tweens.add({
        targets: this.handHint,
        angle: { from: -8, to: 8 },
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });

      break; // chỉ gợi ý 1 cặp đầu tiên
    }
  }

  redrawLines() {
    this.drawAllLines();
  }

  createButton(x, y, label, assetKey, bgColor, onClick, size = 32) {
    let btn;
    if (assetKey && this.textures.exists(assetKey)) {
      btn = this.add.image(x, y, assetKey)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true, cursor: 'pointer' })
        .setDisplaySize(size, size);
    } else {
      btn = this.add.text(x, y, label, {
        fontFamily: 'Fredoka',
        fontSize: `${size}px`,
        color: '#fff',
        backgroundColor: bgColor || undefined,
        padding: { left: 16, right: 16, top: 8, bottom: 8 }
      })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true, cursor: 'pointer' });
    }
    btn.on('pointerdown', onClick);
    return btn;
  }

  isLevelComplete() {
    return this.matches.every(m => m);
  }
}
