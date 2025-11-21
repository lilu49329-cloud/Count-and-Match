export default class MenuScene extends Phaser.Scene {
	constructor() {
		super({ key: 'MenuScene' });
	}

	preload() {
		// Có thể load assets ở đây nếu cần
	}

	create() {
		this.add.text(450, 80, 'Nối Số Đúng', { font: '48px Comic Sans MS', color: '#ff69b4' }).setOrigin(0.5);
		this.add.text(450, 150, 'Count & Match', { font: '32px Comic Sans MS', color: '#4682b4' }).setOrigin(0.5);

		const levels = [
			{ label: 'Level 1: Dễ', value: 1 },
			{ label: 'Level 2: Trung bình', value: 2 },
			{ label: 'Level 3: Khó', value: 3 },
			{ label: 'Bonus: Nhanh tay', value: 'bonus' },
		];
		levels.forEach((lv, i) => {
			const btn = this.add.text(450, 240 + i * 60, lv.label, {
				font: '28px Comic Sans MS',
				backgroundColor: '#fffacd',
				color: '#333',
				padding: { left: 20, right: 20, top: 10, bottom: 10 },
				borderRadius: 10
			}).setOrigin(0.5).setInteractive({ useHandCursor: true });
			btn.on('pointerdown', () => {
				this.scene.start('GameScene', { level: lv.value });
			});
		});
	}
}