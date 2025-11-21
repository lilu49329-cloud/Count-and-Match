export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	init(data) {
		this.level = data.level || 1;
	}

	create() {
		// --- BACKGROUND ---
		// Gán background cho scene. Nếu có asset hình nền, dùng 'background' với kích thước 900x600px
		// Ví dụ: assets/background.png
		const width = 900, height = 600;
		if (this.textures.exists && this.textures.exists("background")) {
			// Asset background: 900x600px
			this.add.image(width / 2, height / 2, "background").setDisplaySize(width, height);
		} else {
			this.cameras.main.setBackgroundColor("#e1f5fe"); // fallback màu xanh nhạt
		}

		// --- NHÂN VẬT DƯỚI GÓC TRÁI ---
		// Asset nhân vật: character.png, kích thước đề xuất 140x140px
		// Vị trí: charX, charY (góc trái dưới màn hình)
		const charX = 70, charY = 600 - 70;
		if (this.textures.exists && this.textures.exists("character")) {
			// Gán asset nhân vật, tỷ lệ 140x140px
			this.add.image(charX, charY, "character").setDisplaySize(140, 140).setOrigin(0.5, 1);
		} else {
			this.add.text(charX, charY, "😊", { fontSize: "96px" }).setOrigin(0.5, 1);
		}

		this.add.text(450, 40, `Level: ${this.level}`, { fontFamily: 'Fredoka', fontSize: '32px', color: '#4682b4' }).setOrigin(0.5);

		// Nút Chơi lại (góc trên phải)
			// TODO: Gán asset nút replay (replay_btn.png), kích thước đề xuất 64x64px
			// Ví dụ: this.add.image(860, 40, 'replay_btn').setDisplaySize(64, 64)
		let replayBtn;
		if (this.textures.exists && this.textures.exists('replay_btn')) {
			// Nếu có asset nút replay, dùng hình ảnh
			replayBtn = this.add.image(860, 40, 'replay_btn').setDisplaySize(64, 64).setOrigin(0.5).setInteractive({ useHandCursor: true });
		} else {
			// Fallback text nếu chưa có asset
			replayBtn = this.add.text(860, 40, '⟳', {
				fontFamily: 'Fredoka', fontSize: '32px', color: '#fff', backgroundColor: '#ff9800', padding: { left: 16, right: 16, top: 8, bottom: 8 }, borderRadius: 20
			}).setOrigin(0.5).setInteractive({ useHandCursor: true });
		}
		replayBtn.on('pointerdown', () => this.scene.restart({ level: this.level }));

		// Nút Chuyển màn (góc dưới phải)
			// TODO: Gán asset nút next (next_btn.png), kích thước đề xuất 64x64px
			// Ví dụ: this.add.image(860, 570, 'next_btn').setDisplaySize(64, 64)
		let nextBtn;
		if (this.textures.exists && this.textures.exists('next_btn')) {
			// Nếu có asset nút next, dùng hình ảnh
			nextBtn = this.add.image(860, 570, 'next_btn').setDisplaySize(64, 64).setOrigin(0.5).setInteractive({ useHandCursor: true });
		} else {
			// Fallback text nếu chưa có asset
			nextBtn = this.add.text(860, 570, '→', {
				fontFamily: 'Fredoka', fontSize: '32px', color: '#fff', backgroundColor: '#4caf50', padding: { left: 16, right: 16, top: 8, bottom: 8 }, borderRadius: 20
			}).setOrigin(0.5).setInteractive({ useHandCursor: true });
		}
		nextBtn.on('pointerdown', () => {
			// Chỉ cho qua màn khi đã hoàn thành (đã nối đúng đủ số lượng)
			if (this.matched.size < this.numbers.length * 2) {
				// Hiển thị thông báo hoặc hiệu ứng báo chưa hoàn thành
				if (!this.nextWarn) {
					this.nextWarn = this.add.text(860, 520, 'Bạn cần hoàn thành màn này!', {
						fontFamily: 'Fredoka', fontSize: '20px', color: '#ff1744', backgroundColor: '#fff', padding: { left: 10, right: 10, top: 5, bottom: 5 }, borderRadius: 8
					}).setOrigin(0.5);
					this.time.delayedCall(1500, () => {
						this.nextWarn.destroy();
						this.nextWarn = null;
					});
				}
				return;
			}
			// Chuyển sang màn tiếp theo, nếu hết thì sang outro
			let nextLevel = (typeof this.level === 'number') ? this.level + 1 : 1;
			if (nextLevel >= levels.length) nextLevel = levels.length - 1; // Không vượt quá outro
			this.scene.restart({ level: nextLevel });
		});

		// Nút X (thoát game) ở góc trên bên trái
		let exitBtn;
		if (this.textures.exists && this.textures.exists('exit_btn')) {
			// Nếu có asset nút X, dùng hình ảnh
			exitBtn = this.add.image(30, 30, 'exit_btn').setDisplaySize(48, 48).setOrigin(0.5).setInteractive({ useHandCursor: true });
		} else {
			// Fallback text nếu chưa có asset
			exitBtn = this.add.text(30, 30, '✖', {
				fontFamily: 'Fredoka',
				fontSize: '32px',
				color: '#fff',
				backgroundColor: '#ff1744',
				padding: { left: 12, right: 12, top: 8, bottom: 8 },
				borderRadius: 16
			}).setOrigin(0.5).setInteractive({ useHandCursor: true });
		}
		exitBtn.on('pointerdown', () => {
			if (window.confirm('Bạn có chắc muốn thoát game?')) {
				window.location.reload();
			}
		});

		// Nút quay lại menu (giữ lại nếu muốn)
		this.add.text(90, 30, '← Menu', { fontFamily: 'Fredoka', fontSize: '24px', color: '#fff', backgroundColor: '#4682b4', padding: { left: 10, right: 10, top: 5, bottom: 5 } })
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => this.scene.start('MenuScene'));

		// Dữ liệu các màn chơi, mỗi màn 4 ảnh đồ vật và 4 số
		// Khi có asset, chỉ cần đặt đúng tên file asset vào thư mục assets/
		// 7 màn chơi, mỗi màn 4 số từ 1-9, đảm bảo đủ số và đa dạng đồ vật
		// Thêm màn mở đầu (intro) và kết thúc (outro)
		// Intro và outro là các màn đặc biệt, không có logic kéo nối, chỉ hiển thị thông báo
		const levels = [
			'intro',
			[ // Level 1
				{ number: 1, asset: 'bear', label: 'gấu' },
				{ number: 2, asset: 'doll', label: 'búp bê' },
				{ number: 3, asset: 'ball', label: 'bóng' },
				{ number: 4, asset: 'car', label: 'xe' },
			],
			[ // Level 2
				{ number: 5, asset: 'apple', label: 'táo' },
				{ number: 6, asset: 'carrot', label: 'cà rốt' },
				{ number: 7, asset: 'flower', label: 'hoa' },
				{ number: 8, asset: 'robot', label: 'robot' },
			],
			[ // Level 3
				{ number: 9, asset: 'horse', label: 'ngựa gỗ' },
				{ number: 2, asset: 'car', label: 'xe' },
				{ number: 4, asset: 'apple', label: 'táo' },
				{ number: 7, asset: 'bird', label: 'chim' },
			],
			[ // Level 4
				{ number: 3, asset: 'carrot', label: 'cà rốt' },
				{ number: 5, asset: 'ball', label: 'bóng' },
				{ number: 6, asset: 'doll', label: 'búp bê' },
				{ number: 8, asset: 'flower', label: 'hoa' },
			],
			[ // Level 5
				{ number: 1, asset: 'robot', label: 'robot' },
				{ number: 3, asset: 'apple', label: 'táo' },
				{ number: 6, asset: 'bear', label: 'gấu' },
				{ number: 9, asset: 'car', label: 'xe' },
			],
			[ // Level 6
				{ number: 2, asset: 'flower', label: 'hoa' },
				{ number: 4, asset: 'horse', label: 'ngựa gỗ' },
				{ number: 5, asset: 'doll', label: 'búp bê' },
				{ number: 7, asset: 'ball', label: 'bóng' },
			],
			[ // Level 7
				{ number: 8, asset: 'carrot', label: 'cà rốt' },
				{ number: 1, asset: 'bird', label: 'chim' },
				{ number: 3, asset: 'horse', label: 'ngựa gỗ' },
				{ number: 9, asset: 'bear', label: 'gấu' },
			],
			'outro',
		];

		// Lấy dữ liệu màn hiện tại (level: 0=intro, 1...n, n+1=outro)
		const levelIdx = (typeof this.level === 'number' ? this.level : 0);
		const currentLevel = levels[levelIdx];
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

		// Còn lại là các màn chơi bình thường
		const items = currentLevel;


		// Trộn vị trí cột đồ vật để tránh trùng thứ tự
		const shuffled = Phaser.Utils.Array.Shuffle([...items]);

		// --- MAIN BOARD ---
		// Asset mainboard: mainboard.png, kích thước đề xuất 370x440px
		// Vị trí: boardX, boardY (giữa-phải màn hình)
		// TODO: Nếu có asset hình bảng, thay rectangle bằng this.add.image(boardX, boardY, 'mainboard').setDisplaySize(boardW, boardH).setOrigin(0.5)
		const boardX = 600, boardY = 300, boardW = 370, boardH = 440;
		const board = this.add.rectangle(boardX, boardY, boardW, boardH, 0xffffff, 1).setStrokeStyle(4, 0x4682b4).setOrigin(0.5);

		// Board không còn frame nhân vật. Tất cả cột số & hình vẽ như cũ, chỉ cập nhật lại toạ độ trong board mới.
		const leftX = boardX - boardW / 2 + 75;
		const rightX = boardX + boardW / 2 - 75;
		const startY = boardY - boardH / 2 + 60;
		const gapY = 90;

		// Lưu vị trí các số và đồ vật
		this.numbers = [];
		this.objects = [];
		this.lines = [];
		this.matched = new Set();
		this.isDrawing = false;
		this.currentLine = null;
		this.startIndex = null;

		// Hiển thị cột số (dùng asset số nếu có, fallback text nếu chưa)
		// Asset số: number_1.png ... number_9.png, kích thước đề xuất 60x60px
		// Vị trí: leftX, y
		items.forEach((item, i) => {
			const y = startY + i * gapY;
			let numSprite;
			const numAsset = `number_${item.number}`;
			if (this.textures.exists && this.textures.exists(numAsset)) {
				// Gán asset số, tỷ lệ 60x60px
				numSprite = this.add.image(leftX, y, numAsset).setDisplaySize(60, 60).setOrigin(0.5).setInteractive({ useHandCursor: true });
			} else {
				numSprite = this.add.text(leftX, y, `${item.number}`, {
					fontFamily: 'Fredoka', fontSize: '48px', color: '#ff6347', backgroundColor: '#fff', padding: { left: 18, right: 18, top: 10, bottom: 10 },
					borderRadius: 10
				}).setOrigin(0.5).setInteractive({ useHandCursor: true });
			}
			numSprite.data = { index: i, number: item.number };
			this.numbers.push(numSprite);
		});

		// Hiển thị cột đồ vật (hiển thị đúng số lượng asset hình ảnh)
		// Asset card: card.png, kích thước đề xuất 110x90px
		// Asset icon đồ vật: bear.png, apple.png..., kích thước đề xuất 48x48px
		// Vị trí: rightX, y
		shuffled.forEach((item, i) => {
			const y = startY + i * gapY;
			// Placeholder khung card, có thể thay bằng asset card.png từ Figma
			// TODO: Nếu có asset card, thay rectangle bằng this.add.image(rightX, y, 'card').setDisplaySize(110, 90).setOrigin(0.5)
			const card = this.add.rectangle(rightX, y, 110, 90, 0xffffff, 1).setStrokeStyle(2, 0x32cd32).setOrigin(0.5);

			// Hiển thị đúng số lượng asset hình ảnh (ví dụ: bear.png, apple.png...)
			// TODO: Khi có asset, thay thế bằng this.add.image(iconX, y, assetName).setDisplaySize(48, 48)
			const iconSize = 48;
			const spacing = 10;
			const totalWidth = item.number * iconSize + (item.number - 1) * spacing;
			const startX = rightX - totalWidth / 2 + iconSize / 2;
			for (let j = 0; j < item.number; j++) {
				const assetName = item.asset;
				const iconX = startX + j * (iconSize + spacing);
				if (this.textures.exists && this.textures.exists(assetName)) {
					// Gán asset icon đồ vật, tỷ lệ 48x48px
					this.add.image(iconX, y, assetName).setDisplaySize(iconSize, iconSize).setOrigin(0.5);
				} else {
					this.add.circle(iconX, y, iconSize / 2, 0xffe082).setStrokeStyle(2, 0xffb300);
				}
			}
			// Tạo vùng tương tác cho card
			card.setInteractive({ useHandCursor: true });
			card.data = { index: i, number: item.number, asset: item.asset };
			this.objects.push(card);
			// Ghi chú vị trí asset: (rightX, y), asset: item.asset, số lượng: item.number
		});

		// Sự kiện kéo nối
		this.input.on('pointerdown', (pointer, targets) => {
			if (this.isDrawing) return;
			const numIdx = this.numbers.findIndex(n => n.getBounds().contains(pointer.x, pointer.y));
			if (numIdx !== -1 && !this.matched.has(numIdx)) {
				this.isDrawing = true;
				this.startIndex = numIdx;
				const start = this.numbers[numIdx];
				this.currentLine = this.add.line(0, 0, start.x, start.y, pointer.x, pointer.y, 0x888888, 1).setLineWidth(6);
			}
		});

		this.input.on('pointermove', (pointer) => {
			if (this.isDrawing && this.currentLine) {
				this.currentLine.setTo(this.numbers[this.startIndex].x, this.numbers[this.startIndex].y, pointer.x, pointer.y);
			}
		});

		this.input.on('pointerup', (pointer) => {
			if (!this.isDrawing || this.currentLine === null) return;
			// Kiểm tra thả vào đúng object nào
			const objIdx = this.objects.findIndex(o => o.getBounds().contains(pointer.x, pointer.y));
			const num = this.numbers[this.startIndex];
			if (objIdx !== -1 && !this.matched.has(objIdx)) {
				const obj = this.objects[objIdx];
				// Đúng: số và object cùng number
				if (num.data.number === obj.data.number) {
					this.currentLine.setTo(num.x, num.y, obj.x, obj.y);
					this.currentLine.setStrokeStyle(6, 0x32cd32); // Xanh lá
					this.lines.push(this.currentLine);
					this.matched.add(this.startIndex);
					this.matched.add(objIdx);
					// TODO: Hiệu ứng đúng (âm thanh đúng, animation sticker), asset: correct.mp3, sticker.png
					this.tweens.add({ targets: [num, obj], scale: 1.15, yoyo: true, duration: 120 });
					// Kiểm tra hoàn thành
					if (this.matched.size >= this.numbers.length * 2) {
						this.time.delayedCall(500, () => this.showComplete(), [], this);
					}
				} else {
					// Sai: đường đỏ, rung nhẹ
					this.currentLine.setStrokeStyle(6, 0xff0000);
					this.tweens.add({ targets: [num, obj], x: '+=10', yoyo: true, repeat: 2, duration: 60 });
					// TODO: Hiệu ứng sai (âm thanh sai, rung), asset: wrong.mp3
					this.time.delayedCall(350, () => { this.currentLine.destroy(); }, [], this);
				}
			} else {
				// Không thả vào object nào
				this.currentLine.destroy();
			}
			this.isDrawing = false;
			this.currentLine = null;
			this.startIndex = null;
		});
	}

	showComplete() {
		// TODO: Hiệu ứng hoàn thành (animation, âm thanh, sticker), asset: complete.mp3, sticker.png
		const msg = this.add.text(450, 550, 'Hoàn thành!', { fontFamily: 'Fredoka', fontSize: '36px', color: '#ff69b4', backgroundColor: '#fff', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderRadius: 10 })
			.setOrigin(0.5);
		this.tweens.add({ targets: msg, scale: 1.2, yoyo: true, duration: 200 });
		// TODO: Thêm nút qua level tiếp theo
	}
}
