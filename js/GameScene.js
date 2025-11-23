

// --- Line/circle offset constants for Figma-accurate hole positions ---
// --- Figma-accurate hole position ratios (based on actual PNG and Figma measurements) ---
var LINE_PNG_ORIG_W = 1100; // width of the card PNG in Figma
var LINE_PNG_ORIG_H = 450;  // height of the card PNG in Figma
var HOLE_OFFSET_X = 90;      // measured from Figma: distance from left edge to hole center
var HOLE_OFFSET_X_RATIO = HOLE_OFFSET_X / LINE_PNG_ORIG_W; // ~0.082
var HOLE_OFFSET_Y_RATIO = 0.5; // hole is vertically centered

import { preloadAssets } from './assetLoader.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
		// Đưa levels thành thuộc tính class để các nút dùng được
		this.levels = [
			'intro',
			{
				items: [
					{ number: 1, asset: 'flower' },
					{ number: 3, asset: 'marble'},
					{ number: 4, asset: 'ball'},
					{ number: 2, asset: 'bear'},
				],
				background: 'bg1',
				character: 'char1'
			},
			{
				items: [
					{ number: 8, asset: 'red' },
					{ number: 6, asset: 'yellow'},
					{ number: 3, asset: 'ball'},
					{ number: 5, asset: 'drum'},
				],
				background: 'bg2',
				character: 'char2'
			},
			{
				items: [
					{ number: 9, asset: 'ball' },
					{ number: 2, asset: 'rabbit'},
					{ number: 4, asset: 'marble' },
					{ number: 7, asset: 'clock' },
				],
				background: 'bg3',
				character: 'char1'
			},
			{
				items: [
					{ number: 3, asset: 'babie'},
					{ number: 5, asset: 'ball' },
					{ number: 6, asset: 'bear'},
					{ number: 7, asset: 'red' },
				],
				background: 'bg4',
				character: 'char2'
			},
			{
				items: [
					{ number: 1, asset: 'flower'},
					{ number: 3, asset: 'rabbit'},
					{ number: 6, asset: 'bear' },
					{ number: 9, asset: 'yellow' },
				],
				background: 'bg5',
				character: 'char1'
			},
			{
				items: [
					{ number: 2, asset: 'drum' },
					{ number: 4, asset: 'clock' },
					{ number: 5, asset: 'marble' },
					{ number: 7, asset: 'ball' },
				],
				background: 'bg6',
				character: 'char2'
			},
			{
				items: [
					{ number: 8, asset: 'red'},
					{ number: 1, asset: 'babie' },
					{ number: 3, asset: 'rabbit'},
					{ number: 9, asset: 'ball'},
				],
				background: 'bg7',
				character: 'char1'
			},
			'outro',
		];
	}

	preload() {
		preloadAssets(this);
	}

	init(data) {
		this.level = data.level || 1;
	}


	// XÓA HÀM create() THỪA Ở ĐÂY

	getHolePos(card, side = 'right') {
		const offsetX = card.displayWidth * HOLE_OFFSET_X_RATIO;
		const x = side === 'right'
			? card.x + card.displayWidth / 2 - offsetX
			: card.x - card.displayWidth / 2 + offsetX;
		const y = card.y; // lỗ nằm giữa chiều cao
		return { x, y };
	}

	// Không còn dùng graphics để vẽ line nữa, dùng sprite line_glow PNG
	drawAllLines() {
		// Xóa hết các line sprite cũ (nếu có)
		if (this.permanentLines && Array.isArray(this.permanentLines)) {
			this.permanentLines.forEach(line => { if (line && line.destroy) line.destroy(); });
		}
		this.permanentLines = [];
		// Vẽ lại các line đã nối (theo matches)
		if (this.matches && Array.isArray(this.matches)) {
			for (let i = 0; i < this.matches.length; i++) {
				if (this.matches[i]) {
					const startCard = this.numbers[i];
					// Tìm đúng obj đã match với số này
					const n = startCard.customData.number;
					const objIdx = this.objects.findIndex(obj => obj.customData.number === n && obj.texture.key.startsWith('card_yellow2'));
					if (objIdx !== -1) {
						const endCard = this.objects[objIdx];
						const start = this.getHolePos(startCard, 'right');
						const end = this.getHolePos(endCard, 'left');
						const dx = end.x - start.x;
						const dy = end.y - start.y;
						const dist = Math.sqrt(dx*dx + dy*dy);
						const cardH = startCard.displayHeight;
						const lineThickness = cardH * 0.10;
						const ux = dx / dist;
						const uy = dy / dist;
						const bodyLength = Math.max(dist - lineThickness, 0);
						const startBodyX = start.x + ux * (lineThickness / 2);
						const startBodyY = start.y + uy * (lineThickness / 2);
						const line = this.add.image(startBodyX, startBodyY, 'line_glow')
							.setOrigin(0, 0.5)
							.setDisplaySize(bodyLength, lineThickness)
							.setRotation(Math.atan2(dy, dx));
						this.permanentLines.push(line);
					}
				}
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
			this.add.text(charX, charY, "😊", { fontSize: `${Math.round(120*scaleChar)}px` }).setOrigin(0.5, 1);
		}

		// Bỏ chữ Level

		       // Nút Chơi lại (góc trên trái) và Nút chuyển màn (góc trên phải) dùng SVG
		       // Đảm bảo asset SVG đã được preload với key: 'replay_svg', 'next_svg'
		       // Tách riêng cài đặt kích thước cho từng nút để không bị kéo theo nhau
		       const replayBtnSize = Math.round(90 * scaleBG); // replay lớn hơn để cân đối asset
		       const nextBtnSize = Math.round(90 * scaleBG);   // next giữ nguyên
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
                       // Phát âm thanh cảnh báo nếu chưa đủ điều kiện next màn
                       if (this.sound && this.sound.play) {
                           this.sound.play('voice_need_finish', { volume: 1 });
                       }
			       }
		       }, nextBtnSize);

	// Lấy dữ liệu màn hiện tại (level: 0=intro, 1...n, n+1=outro)
		// Nếu là màn kết thúc (outro)
		if (currentLevel === 'outro') {
			this.add.text(450, 220, 'CHÚC MỪNG BÉ ĐÃ HOÀN THÀNH!', { fontFamily: 'Fredoka', fontSize: '40px', color: '#ff69b4', align: 'center', wordWrap: { width: 800 } }).setOrigin(0.5);
			this.add.text(450, 320, 'Bé đã nối đúng tất cả các màn chơi!\nHẹn gặp lại ở những trò chơi tiếp theo!', { fontFamily: 'Fredoka', fontSize: '32px', color: '#4682b4', align: 'center', wordWrap: { width: 700 } }).setOrigin(0.5);
			// Nút chơi lại từ đầu
			const replayBtn = this.add.text(450, 450, 'CHƠI LẠI', { fontFamily: 'Fredoka', fontSize: '36px', color: '#fff', backgroundColor: '#ff9800', padding: { left: 30, right: 30, top: 15, bottom: 15 }, borderRadius: 20 })
				.setOrigin(0.5).setInteractive({ useHandCursor: true });
			replayBtn.on('pointerdown', () => this.scene.restart({ level: 1 }));
			return;
		}

		// Nếu là level 1 thì phát âm thanh intro (và overlay nếu muốn)
		if (this.level === 1) {
			const overlay = this.add.rectangle(450, 300, 900, 600, 0x000000, 0.35).setDepth(2000);
			const startText = this.add.text(450, 300, 'Chạm để bắt đầu', {
				fontFamily: 'Fredoka', fontSize: '48px', color: '#fff', backgroundColor: '#ff9800', padding: { left: 40, right: 40, top: 20, bottom: 20 }, borderRadius: 30
			}).setOrigin(0.5).setDepth(2001);
			this.input.once('pointerdown', () => {
				// Phát đồng thời voice_intro và nhạc nền
				if (this.sound && this.sound.play) {
					this.sound.play('voice_intro', { volume: 1 });
				}
				if (this.bgm) {
					if (!this.bgm.isPlaying) {
						this.bgm.play();
					} else if (this.bgm.isPaused && this.bgm.resume) {
						this.bgm.resume();
					}
				}
				overlay.destroy();
				startText.destroy();
			});
		}

		// Còn lại là các màn chơi bình thường
		const items = currentLevel.items;


		// Trộn vị trí cột đồ vật để tránh trùng thứ tự
		const shuffled = Phaser.Utils.Array.Shuffle([...items]);

		// --- MAIN BOARD ---
		// Luôn tính toán vị trí board và các cột, chỉ vẽ board nếu có asset
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
		// Vẽ board asset nếu có, nếu không thì vẽ khung board bằng graphics để luôn có viền bao quanh các thẻ
		let boardImg;
		if (this.textures.exists && this.textures.exists("board")) {
			boardImg = this.add.image(boardX, boardY, "board").setOrigin(0.5).setDisplaySize(boardW, boardH);
		}

		// Cột số bên phải bảng
		const colNumX = boardX + boardW / 4 + 10 * scaleBG;
		// Cột hình bên trái bảng
		const colObjX = boardX - boardW / 4 - 10 * scaleBG;
		const colW = 669 * scaleBG, colH = 900 * scaleBG;
		const colY = boardY;
		// Không vẽ nền trắng/viền cho cột số và cột hình nữa

		// Tính toán vị trí các số và hình
		const numStartY = colY - colH / 2 + 112 * scaleBG;
		const objStartY = colY - colH / 2 + 112 * scaleBG;
		const gapY = 225 * scaleBG;

		// Lưu vị trí các số và đồ vật
		this.numbers = [];
		this.objects = [];
		this.lines = [];
		this.matched = new Set();
		this.isDrawing = false;
		this.currentLine = null;
		this.startIndex = null;
		this.nextWarn = null;

		// 4 thẻ số bên trái (ưu tiên asset số nếu có)
		// Thẻ số: 669x225, scale nhỏ lại để không tràn khỏi board
		const cardScale = 0.85; // giảm còn 85% để chắc chắn vừa board
		const cardGap = 18 * scaleBG; // giảm gap để vừa khít hơn
		// Tính lại tổng chiều cao các thẻ và gap để căn giữa theo board
		const totalCardH = 4 * (225 * scaleBG * cardScale) + 3 * cardGap;
		const baseY = boardY - totalCardH / 2 + (225 * scaleBG * cardScale) / 2;
		items.forEach((item, i) => {
			const y = baseY + i * ((225 * scaleBG * cardScale) + cardGap);
			const cardW = 669 * scaleBG * cardScale, cardH = 225 * scaleBG * cardScale;
			let card;
			if (this.textures.exists && this.textures.exists('card')) {
				card = this.add.image(colObjX, y, 'card').setOrigin(0.5).setDisplaySize(cardW, cardH);
			} else if (this.textures.exists && this.textures.exists('card.png')) {
				card = this.add.image(colObjX, y, 'card.png').setOrigin(0.5).setDisplaySize(cardW, cardH);
			} else {
				// Không vẽ nền nếu không có asset card/card.png
				card = this.add.zone(colObjX, y, cardW, cardH).setOrigin(0.5);
			}
			// Asset số nếu có
			const numAsset = `number_${item.number}`;
			let numContent;
			if (this.textures.exists && this.textures.exists(numAsset)) {
				numContent = this.add.image(colObjX, y, numAsset).setOrigin(0.5);
				const scaleNum = Math.min((cardH * 0.7) / numContent.height, (cardW * 0.7) / numContent.width, 1);
				numContent.setScale(scaleNum);
			} else {
				// Số hồng
				numContent = this.add.text(colObjX, y, `${item.number}`, {
					fontFamily: 'Fredoka', fontSize: `${Math.round(120*scaleBG)}px`, color: '#ff69b4', fontStyle: 'bold', align: 'center'
				}).setOrigin(0.5);
			}
			card.setInteractive({ useHandCursor: true });
			card.customData = { index: i, number: item.number, cardW, cardH, glow: null };
			this.numbers.push(card);
		});

		// 4 thẻ hình bên phải (ưu tiên asset hình nếu có)
		// Thẻ hình: 669x225, scale theo background, tách thẻ như thẻ số
		shuffled.forEach((item, i) => {
			const y = baseY + i * ((225 * scaleBG * cardScale) + cardGap);
			const cardW = 669 * scaleBG * cardScale, cardH = 225 * scaleBG * cardScale;
			let card;
			if (this.textures.exists && this.textures.exists('card2')) {
				card = this.add.image(colNumX, y, 'card2').setOrigin(0.5).setDisplaySize(cardW, cardH);
			} else if (this.textures.exists && this.textures.exists('card2.png')) {
				card = this.add.image(colNumX, y, 'card2.png').setOrigin(0.5).setDisplaySize(cardW, cardH);
			} else {
				// Không vẽ nền nếu không có asset card/card.png
				card = this.add.zone(colNumX, y, cardW, cardH).setOrigin(0.5);
			}
			   // Asset hình nếu có (icon lớn, căn giữa), vẽ đúng số lượng
			   if (this.textures.exists && this.textures.exists(item.asset)) {
				   const count = item.number;
				   let tempIcon = this.add.image(0, 0, item.asset);
				   const assetW = tempIcon.width || 1;
				   const assetH = tempIcon.height || 1;
				   tempIcon.destroy();
				   const iconGapX = -6;
				   if (count <= 4) {
					   // CASE 1–4: 1 dòng, icon to, luôn căn giữa thẻ
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
				} else {
					   // CASE 5–9: 2 dòng, mỗi dòng max 4 icon, căn giữa block icon
					   let row1 = Math.ceil(count / 2);
					   let row2 = count - row1;
					   if (row1 > 4) { row1 = 4; row2 = count - 4; }
					   if (row2 > 4) { row2 = 4; row1 = count - 4; }
					   const rows = [row1, row2];
					   const rowMax = Math.max(row1, row2);
					   // Scale cho cả 2 dòng
					   const scaleWideX = (cardW * 1.15) / (rowMax * assetW);
					   const scaleWideY = (cardH * 1.05) / assetH;
					   const scale = Math.min(scaleWideX, scaleWideY, 1.0);
					   // Tính lại totalHeight và rowGap
					   // rowGap: khoảng cách giữa 2 dòng icon (âm = chồng lên, dương = cách xa)
					   const rowGap = -(assetH * scale * 0.75); // chỉnh thông số này để thay đổi khoảng cách
					   const totalHeight = assetH * scale * 2 + rowGap;
					   // SHIFT_RIGHT: dịch block icon sang phải (ví dụ 10% chiều rộng thẻ)
					   const SHIFT_RIGHT = cardW * 0.10;
					   let startY = y - totalHeight / 2 + (assetH * scale) / 2;
					   for (let r = 0; r < rows.length; r++) {
						   const nInRow = rows[r];
						   const totalWidth = nInRow * assetW * scale;
						   // Thêm SHIFT_RIGHT vào startX để dịch block icon sang phải
						   const startX = colNumX - totalWidth / 2 + (assetW * scale) / 2 + SHIFT_RIGHT;
						   for (let k = 0; k < nInRow; k++) {
							   let icon = this.add.image(startX + k * (assetW * scale + iconGapX), startY, item.asset).setOrigin(0.5);
							   icon.setScale(scale);
						   }
						   startY += assetH * scale + rowGap;
					   }
				   }
			}
			// Tên đồ vật (text đen, căn giữa dưới)
			const label = this.add.text(colNumX, y+cardH/2-32*scaleBG, item.label, {
				fontFamily: 'Fredoka', fontSize: `${Math.round(48*scaleBG)}px`, color: '#222', align: 'center'
			}).setOrigin(0.5, 0.5);
			card.setInteractive({ useHandCursor: true });
			card.customData = { index: i, number: item.number, asset: item.asset, cardW, cardH, glow: null };
			this.objects.push(card);
		});

		// --- KÉO NỐI (DRAG CONNECT LOGIC) ---
		// Không dùng graphics nữa
		this.permanentLines = [];
		this.dragLine = null;
		this.isDragging = false;
		this.dragStartIdx = null;
		// Luôn khởi tạo matches mới cho mỗi màn chơi
		this.matches = Array(4).fill(false);

		// --- HINT HAND ANIMATION (BÀN TAY HƯỚNG DẪN) ---
		// Hàm tạo hiệu ứng bàn tay gợi ý, sẽ tự retry nếu asset chưa load
		const showHintHand = () => {
			if (this.textures && this.textures.exists && this.textures.exists('hand')) {
				// Tìm cặp số khớp nhau đầu tiên chưa nối
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
				// Nếu asset chưa load, thử lại sau 200ms
				this.time.delayedCall(200, showHintHand);
			}
		};
		this.time.delayedCall(200, showHintHand);

		// Enable drag for each number card
		this.numbers.forEach((numCard, idx) => {
			numCard.setInteractive({ useHandCursor: true, draggable: true });
			numCard.on('pointerdown', (pointer) => {
				if (this.matches[idx]) return;
				this.isDragging = true;
				this.dragStartIdx = idx;
				// Tạo line đang kéo
				const start = this.getHolePos(numCard, 'right');
				const cardH = numCard.displayHeight;
				const lineThickness = cardH * 0.10;
				this.dragLine = this.add.image(start.x, start.y, 'line_glow')
					.setOrigin(0, 0.5)
					.setDisplaySize(1, lineThickness);
			});
		});

		this.input.on('pointermove', (pointer) => {
			if (!this.isDragging || this.dragStartIdx === null || !this.dragLine) return;
			const startCard = this.numbers[this.dragStartIdx];
			const start = this.getHolePos(startCard, 'right');
			const cardH = startCard.displayHeight;
			const lineThickness = cardH * 0.10;
			const dx = pointer.x - start.x;
			const dy = pointer.y - start.y;
			const dist = Math.sqrt(dx*dx + dy*dy);
			const ux = dx / dist;
			const uy = dy / dist;
			const bodyLength = Math.max(dist - lineThickness, 0);
			const startBodyX = start.x + ux * (lineThickness / 2);
			const startBodyY = start.y + uy * (lineThickness / 2);
			this.dragLine.x = startBodyX;
			this.dragLine.y = startBodyY;
			this.dragLine.setDisplaySize(bodyLength, lineThickness);
			this.dragLine.rotation = Math.atan2(dy, dx);
		});

		this.input.on('pointerup', (pointer) => {
			if (!this.isDragging || this.dragStartIdx === null) return;
			let matched = false;
			let foundObjIdx = null;
			this.objects.forEach((objCard, objIdx) => {
				const bounds = objCard.getBounds();
				if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
					// So sánh số giữa thẻ số và thẻ hình
					const n = items[this.dragStartIdx].number;
					const objN = shuffled[objIdx].number;
					const startCard = this.numbers[this.dragStartIdx];
					const endCard   = objCard;
					    if (n === objN && !this.matches[this.dragStartIdx]) {
						    this.matches[this.dragStartIdx] = true;
						    matched = true;
						    foundObjIdx = objIdx;
						    if (this.snd && this.snd.correct) {
							    this.snd.correct.play({ volume: 0.7 });
						    }
                                        // Phát âm thanh đúng
                                        if (this.sound && this.sound.play) {
                                            this.sound.play('sfx_correct', { volume: 1 });
                                        }
						       // Confetti burst
						    if (!this.confettiParticles) {
							    if (!this.textures.exists('confetti')) {
								    const g = this.add.graphics();
								    g.fillStyle(0xffffff, 1);
								    g.fillRect(0, 0, 4, 4);
								    g.generateTexture('confetti', 4, 4);
								    g.destroy();
							    }
							       this.confettiParticles = this.add.particles('confetti');
							       this.confettiParticles.setDepth(999);
							       this.confettiEmitter = this.confettiParticles.createEmitter({
								       speed: { min: 150, max: 300 },
								       angle: { min: 220, max: 320 },
								       scale: { start: 0.9, end: 0.3 },
								       alpha: { start: 1, end: 0 },
								       gravityY: 500,
								       lifespan: 900,
								       quantity: 0,
								       on: false
							       });
						       }
						       if (this.confettiEmitter) {
							       const cx = (startCard.x + endCard.x) / 2;
							       const cy = (startCard.y + endCard.y) / 2;
							       this.confettiEmitter.setTint([
								       0xff4081, 0xffeb3b, 0x40c4ff, 0x69f0ae
							       ]);
							       this.confettiEmitter.explode(20, cx, cy);
						       }
						       // Đổi texture 2 card thành thẻ vàng và hiệu ứng glow
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
						       // Chốt line đang kéo thành permanent
						       if (this.dragLine) {
							       // Đặt lại vị trí, chiều dài, góc cho đúng lỗ và trừ bán kính đầu tròn
							       const start = this.getHolePos(startCard, 'right');
							       const end = this.getHolePos(endCard, 'left');
							       const cardH = startCard.displayHeight;
							       const lineThickness = cardH * 0.10;
							       const dx = end.x - start.x;
							       const dy = end.y - start.y;
							       const dist = Math.sqrt(dx*dx + dy*dy);
							       const ux = dx / dist;
							       const uy = dy / dist;
							       const bodyLength = Math.max(dist - lineThickness, 0);
							       const startBodyX = start.x + ux * (lineThickness / 2);
							       const startBodyY = start.y + uy * (lineThickness / 2);
							       this.dragLine.x = startBodyX;
							       this.dragLine.y = startBodyY;
							       this.dragLine.setDisplaySize(bodyLength, lineThickness);
							       this.dragLine.rotation = Math.atan2(dy, dx);
							       this.permanentLines.push(this.dragLine);
							       this.dragLine = null;
						       }
						       // Nhún nhẹ cho vui mắt
						       this.tweens.add({
							       targets: [startCard, endCard],
							       scaleX: startCard.scaleX * 1.05,
							       scaleY: startCard.scaleY * 1.05,
							       yoyo: true,
							       duration: 120
						       });
					} else if (!this.matches[this.dragStartIdx]) {
						// Animate wrong
						this.tweens.add({ targets: [objCard], x: '+=10', yoyo: true, repeat: 2, duration: 60 });
                                        // Phát âm thanh sai
                                        if (this.sound && this.sound.play) {
                                            this.sound.play('sfx_wrong', { volume: 1 });
                                        }
					}
				}
			});
			// Nếu không match đúng thì xóa line đang kéo
			if (!matched && this.dragLine) {
				this.dragLine.destroy();
				this.dragLine = null;
			}
			this.isDragging = false;
			this.dragStartIdx = null;
			// Vẽ lại các line permanent (nếu cần)
			// this.drawAllLines();
			       if (this.matches.every(m => m)) {
				       this.time.delayedCall(2000, () => {
					       if (this.snd && this.snd.complete) {
						       this.snd.complete.play({ volume: 0.8 });
					       }
	                               // Phát âm thanh hoàn thành màn
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

	// Vẽ lại các line đã nối (không còn dùng, giữ lại nếu cần)
	redrawLines() {
		this.drawAllLines();
	}

		// Helper: tạo button
		createButton(x, y, label, assetKey, bgColor, onClick, fontSize = 32) {
			let btn;
			if (assetKey && this.textures.exists && this.textures.exists(assetKey)) {
				btn = this.add.image(x, y, assetKey).setOrigin(0.5).setInteractive({ useHandCursor: true });
				btn.setDisplaySize(fontSize, fontSize); // Luôn setDisplaySize cho SVG
			} else {
				btn = this.add.text(x, y, label, {
					fontFamily: 'Fredoka', fontSize: `${fontSize}px`, color: '#fff', backgroundColor: bgColor ? bgColor : undefined, padding: { left: 16, right: 16, top: 8, bottom: 8 }, borderRadius: 20
				}).setOrigin(0.5).setInteractive({ useHandCursor: true });
			}
			btn.on('pointerdown', onClick);
			return btn;
		}

		// Helper: kiểm tra hoàn thành màn
		isLevelComplete() {
			// matches is an array of booleans
			return Array.isArray(this.matches) ? this.matches.every(m => m) : false;
		}

		       // Đã bỏ showWarn và showComplete vì chỉ dùng âm thanh hướng dẫn
	}
