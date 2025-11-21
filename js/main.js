// ----- MenuScene -----
class MenuScene extends Phaser.Scene {
    create() {
        // Bỏ menu, vào thẳng màn chơi đầu tiên và truyền showGuide
        this.scene.start('GameScene', { level: 1, showGuide: true });
    }
}

// --- GameScene ---
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.showGuide = data.showGuide;
    }

    create() {
        // Layout constants
        const boardWidth = 600;
        const boardHeight = 400;
        const boardX = 150;
        const boardY = 100;

        // Dữ liệu các màn chơi
        const levels = [
            'intro',
            [
                { number: 1, asset: 'bear', label: 'gấu' },
                { number: 2, asset: 'doll', label: 'búp bê' },
                { number: 3, asset: 'ball', label: 'bóng' },
                { number: 4, asset: 'car', label: 'xe' }
            ],
            [
                { number: 5, asset: 'apple', label: 'táo' },
                { number: 6, asset: 'carrot', label: 'cà rốt' },
                { number: 7, asset: 'flower', label: 'hoa' },
                { number: 8, asset: 'robot', label: 'robot' }
            ],
            [
                { number: 9, asset: 'horse', label: 'ngựa gỗ' },
                { number: 2, asset: 'car', label: 'xe' },
                { number: 4, asset: 'apple', label: 'táo' },
                { number: 7, asset: 'bird', label: 'chim' }
            ],
            [
                { number: 3, asset: 'carrot', label: 'cà rốt' },
                { number: 5, asset: 'ball', label: 'bóng' },
                { number: 6, asset: 'doll', label: 'búp bê' },
                { number: 8, asset: 'flower', label: 'hoa' }
            ],
            [
                { number: 1, asset: 'robot', label: 'robot' },
                { number: 3, asset: 'apple', label: 'táo' },
                { number: 6, asset: 'bear', label: 'gấu' },
                { number: 9, asset: 'car', label: 'xe' }
            ],
            [
                { number: 2, asset: 'flower', label: 'hoa' },
                { number: 4, asset: 'horse', label: 'ngựa gỗ' },
                { number: 5, asset: 'doll', label: 'búp bê' },
                { number: 7, asset: 'ball', label: 'bóng' }
            ],
            [
                { number: 8, asset: 'carrot', label: 'cà rốt' },
                { number: 1, asset: 'bird', label: 'chim' },
                { number: 3, asset: 'horse', label: 'ngựa gỗ' },
                { number: 9, asset: 'bear', label: 'gấu' }
            ],
            'outro'
        ];

        // Vẽ khung bảng chính (main board)
        // Kích thước asset bảng: 600x400px (boardWidth x boardHeight)
        // TODO: Nếu có asset hình bảng, thay rectangle bằng this.add.image(...)
        
        const board = this.add.rectangle(
            boardX + boardWidth / 2,
            boardY + boardHeight / 2,
            boardWidth,
            boardHeight,
            0xffffff
        ).setStrokeStyle(6, 0xff9800).setOrigin(0.5);

        // Tiêu đề level
        this.add.text(
            boardX + boardWidth / 2,
            boardY - 40,
            `Level: ${this.level}`,
            { fontFamily: 'Fredoka', fontSize: '32px', color: '#4682b4' }
        ).setOrigin(0.5);

        // Khung nhân vật trái/phải
        // Kích thước asset nhân vật: 220x340px (hoặc 120x180px nếu dùng placeholder)
        // TODO: Gán asset nhân vật (character_left.png, character_right.png) thay cho rectangle
        const charLeftY = boardY + boardHeight / 2 + 70; // Dịch xuống dưới thêm px
        const charLeft = this.add.rectangle(
            boardX - 80,
            charLeftY,
            120,
            180,
            0xffe4e1
        ).setStrokeStyle(4, 0x4682b4);
        this.add.text(
            boardX - 80,
            charLeftY,
            'Nhân vật Trái',
            { fontFamily: 'Fredoka', fontSize: '20px', color: '#333' }
        ).setOrigin(0.5);

        // Nút Chơi lại (góc trên phải màn hình)
        const replayBtn = this.add.text(
            boardX + boardWidth + 100,
            boardY + 20,
            '⟳',
            {
                fontFamily: 'Fredoka',
                fontSize: '32px',
                color: '#fff',
                backgroundColor: '#ff9800',
                padding: { left: 16, right: 16, top: 8, bottom: 8 },
                borderRadius: 20
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });
        replayBtn.on('pointerdown', () => this.scene.restart({ level: this.level }));

        // Nút Chuyển màn (góc dưới phải màn hình)
        const nextBtn = this.add.text(
            boardX + boardWidth + 100,
            boardY + boardHeight + 40,
            '→',
            {
                fontFamily: 'Fredoka',
                fontSize: '32px',
                color: '#fff',
                backgroundColor: '#4caf50',
                padding: { left: 16, right: 16, top: 8, bottom: 8 },
                borderRadius: 20
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        nextBtn.on('pointerdown', () => {
            // Chỉ cho qua màn khi đã hoàn thành (đã nối đúng đủ số lượng)
            if (this.matches && this.matches.every && !this.matches.every(m => m)) {
                // Hiển thị thông báo hoặc hiệu ứng báo chưa hoàn thành
                if (!this.nextWarn) {
                    this.nextWarn = this.add.text(
                        boardX + boardWidth + 100,
                        boardY + boardHeight - 20,
                    
                        {
                            fontFamily: 'Fredoka',
                            fontSize: '20px',
                            color: '#ff1744',
                            backgroundColor: '#fff',
                            padding: { left: 10, right: 10, top: 5, bottom: 5 },
                            borderRadius: 8
                        }
                    ).setOrigin(0.5);
                    this.time.delayedCall(1500, () => {
                        this.nextWarn.destroy();
                        this.nextWarn = null;
                    });
                }
                return;
            }
            let nextLevel = typeof this.level === 'number' ? this.level + 1 : 1;
            if (nextLevel >= levels.length) nextLevel = levels.length - 1;
            this.scene.restart({ level: nextLevel });
        });

        // Lấy dữ liệu màn chơi
        const levelData = levels[this.level];
        if (!levelData || this.level === 0 || this.level === 'intro') {
            this.add.text(
                boardX + boardWidth / 2,
                boardY + boardHeight / 2,
                'Chào mừng đến với game Nối Số Đúng!',
                { fontFamily: 'Fredoka', fontSize: '32px', color: '#333' }
            ).setOrigin(0.5);
            return;
        }

        // Shuffle
        function shuffle(arr) {
            let a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        const leftIdx = shuffle([0, 1, 2, 3]);
        const rightIdx = shuffle([0, 1, 2, 3]);

        // Hiển thị số (number card) với asset hình ảnh
        // Kích thước asset số: 80x80px (card.png hoặc SVG)
        // Sử dụng asset 'card.png' (hoặc SVG) cho thẻ số
        // Căn đều các thẻ số trong board, không bị tràn
        this.numbers = [];
        const cardW = 80, cardH = 80; // Kích thước bằng nhau cho cả số và hình
        const numCount = 4;
        // Tính toán vị trí y bắt đầu và khoảng cách đều để các thẻ nằm gọn trong board
        const numStartY = boardY + cardH/2 + 20; // cách trên 20px
        const numGapY = (boardHeight - cardH - 40) / (numCount - 1); // trừ 40px tổng cách trên/dưới
        const numX = boardX + 70; // Dịch vào trong board thêm px
        for (let i = 0; i < numCount; i++) {
            const n = levelData[leftIdx[i]].number;
            // Vẽ asset thẻ số
            const cardImg = this.add.image(
                numX,
                numStartY + i * numGapY,
                'card' // asset key, cần preload asset 'card.png' trong preload()
            ).setDisplaySize(cardW, cardH).setOrigin(0.5);
            // Vẽ số lên trên asset
            const numText = this.add.text(
                numX,
                numStartY + i * numGapY,
                n.toString(),
                {
                    fontFamily: 'Fredoka',
                    fontSize: '32px', // Giảm font cho vừa thẻ
                    color: '#ff69b4',
                }
            ).setOrigin(0.5);
            this.numbers.push(numText);
        }

        // Hiển thị object (object card)
        // Tách thành 4 thẻ hình riêng biệt, căn đều trong board
        // Kích thước mỗi thẻ hình: 80x80px (bằng thẻ số)
        this.objects = [];
        const objCount = 4;
        // Tính toán vị trí y bắt đầu và khoảng cách đều để các thẻ nằm gọn trong board
        const objStartY = boardY + cardH/2 + 20;
        const objGapY = (boardHeight - cardH - 40) / (objCount - 1);
        const objX = boardX + boardWidth - 70; // Dịch vào trong board thêm 20px nữa
        for (let i = 0; i < objCount; i++) {
            const obj = levelData[rightIdx[i]];
            // Vẽ thẻ hình riêng biệt
            const objCard = this.add.rectangle(
                objX,
                objStartY + i * objGapY,
                cardW,
                cardH,
                0xffe4e1
            ).setStrokeStyle(2, 0x333333);
            // TODO: Thay thế bằng this.add.image(objX, objStartY + i * objGapY, obj.asset) để hiển thị icon đúng, scale 80x80px
            this.add.text(
                objX,
                objStartY + i * objGapY,
                obj.label,
                { fontFamily: 'Fredoka', fontSize: '20px', color: '#333' }
            ).setOrigin(0.5, -1.2);
            this.objects.push(objCard);
        }

        this.leftIdx = leftIdx;
        this.rightIdx = rightIdx;

        // Hướng dẫn
        if (this.showGuide) {
            let hintIdx = 0;
            let objHintIdx;
            for (let i = 0; i < 4; i++) {
                const n = levelData[this.leftIdx[i]].number;
                for (let j = 0; j < 4; j++) {
                    const objN = levelData[this.rightIdx[j]].number;
                    if (n === objN) {
                        hintIdx = i;
                        objHintIdx = j;
                        break;
                    }
                }
                if (objHintIdx !== undefined) break;
            }

            const numObj = this.numbers[hintIdx];
            const objCard = this.objects[objHintIdx];
            if (numObj && objCard) {
                const hand = this.add.text(numObj.x, numObj.y + 40, '🖐️', { fontSize: '48px' }).setOrigin(0.5);
                this.tweens.add({
                    targets: hand,
                    x: objCard.x,
                    y: objCard.y + 40,
                    duration: 1200,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                this.time.delayedCall(3000, () => hand.destroy());
            }
        }

        // Logic kéo nối
        this.graphics = this.add.graphics();
        this.permanentLines = [];
        this.isDragging = false;
        this.dragStartIdx = null;
        this.matches = Array(4).fill(false);

        this.numbers.forEach((numText, idx) => {
            numText.setInteractive({ useHandCursor: true, draggable: true });
            numText.on('pointerdown', () => {
                if (this.matches[idx]) return;
                this.isDragging = true;
                this.dragStartIdx = idx;
                this.graphics.clear();
            });
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.isDragging || this.dragStartIdx === null) return;

            const start = this.numbers[this.dragStartIdx];

            this.graphics.clear();
            this.permanentLines.forEach(line => {
                this.graphics.lineStyle(8, 0x4caf50, 0.9);
                this.graphics.beginPath();
                this.graphics.moveTo(line.start.x, line.start.y);
                this.graphics.lineTo(line.end.x, line.end.y);
                this.graphics.strokePath();
            });

            this.graphics.lineStyle(6, 0x4682b4, 0.7);
            this.graphics.beginPath();
            this.graphics.moveTo(start.x, start.y);
            this.graphics.lineTo(pointer.x, pointer.y);
            this.graphics.strokePath();
        });

        this.input.on('pointerup', (pointer) => {
            if (!this.isDragging || this.dragStartIdx === null) return;

            let matched = false;

            this.objects.forEach((objCard, objIdx) => {
                const bounds = objCard.getBounds();
                if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
                    const n = levelData[this.leftIdx[this.dragStartIdx]].number;
                    const objN = levelData[this.rightIdx[objIdx]].number;

                    if (n === objN && !this.matches[this.dragStartIdx]) {
                        this.matches[this.dragStartIdx] = true;
                        matched = true;

                        this.permanentLines.push({
                            start: {
                                x: this.numbers[this.dragStartIdx].x,
                                y: this.numbers[this.dragStartIdx].y
                            },
                            end: { x: objCard.x, y: objCard.y }
                        });

                        this.graphics.clear();
                        this.permanentLines.forEach(line => {
                            this.graphics.lineStyle(8, 0x4caf50, 0.9);
                            this.graphics.beginPath();
                            this.graphics.moveTo(line.start.x, line.start.y);
                            this.graphics.lineTo(line.end.x, line.end.y);
                            this.graphics.strokePath();
                        });

                        objCard.setFillStyle(0xc8e6c9);
                        this.numbers[this.dragStartIdx].setColor('#4caf50');
                    } else {
                        objCard.setFillStyle(0xffcdd2);
                        const numText = this.numbers[this.dragStartIdx];
                        numText.setColor('#ff1744');

                        this.time.delayedCall(500, () => {
                            objCard.setFillStyle(0xffe4e1);
                            numText.setColor('#ff69b4');
                            this.graphics.clear();
                            this.permanentLines.forEach(line => {
                                this.graphics.lineStyle(8, 0x4caf50, 0.9);
                                this.graphics.beginPath();
                                this.graphics.moveTo(line.start.x, line.start.y);
                                this.graphics.lineTo(line.end.x, line.end.y);
                                this.graphics.strokePath();
                            });
                        });
                    }
                }
            });

            if (!matched) {
                this.graphics.clear();
                this.permanentLines.forEach(line => {
                    this.graphics.lineStyle(8, 0x4caf50, 0.9);
                    this.graphics.beginPath();
                    this.graphics.moveTo(line.start.x, line.start.y);
                    this.graphics.lineTo(line.end.x, line.end.y);
                    this.graphics.strokePath();
                });
            }

            this.isDragging = false;
            this.dragStartIdx = null;

            if (this.matches.every(m => m)) {
                this.time.delayedCall(500, () => {
                    this.add.text(450, 520, 'Hoàn thành màn này!', {
                        fontFamily: 'Fredoka', fontSize: '32px', color: '#4caf50'
                    }).setOrigin(0.5);
                });
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: '#f0f8ff',
    parent: 'game-container',
    scene: [MenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT, // Tự động co giãn vừa màn hình
        autoCenter: Phaser.Scale.CENTER_BOTH // Căn giữa cả chiều ngang và dọc
    }
};

window.onload = function () {
    // Đảm bảo parent container luôn co giãn đúng tỉ lệ, không bị méo
    const container = document.getElementById('game-container');
    if (container) {
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.background = '#e1f5fe'; // fallback màu nền
    }
    new Phaser.Game(config);
    // Gợi ý: Thêm vào index.html
    // <style>#game-container { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background: #e1f5fe; }</style>
};
