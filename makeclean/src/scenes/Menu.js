import Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.2, 'Select Object to Clean', {
            fontSize: '32px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const createSelection = (x, y, key, targetKey) => {
            const container = this.add.container(x, y);

            // Calculate scale to fit in a 150x150 box roughly
            const img = this.add.image(0, 0, key).setOrigin(0.5);
            // Default assumes large images; we will scale down. Let's do 0.25 for now,
            // later we might adjust based on exact image size.
            const scale = 150 / Math.max(img.width, 1);
            img.setScale(scale > 0 && scale < 1 ? scale : 0.25);

            const hitArea = new Phaser.Geom.Rectangle(-100, -100, 200, 200);
            container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            container.add(img);

            // Keep reference for hover
            container.on('pointerdown', () => {
                this.scene.start('Play', { model: targetKey });
            });
            container.on('pointerover', () => {
                this.tweens.add({
                    targets: img,
                    scale: img.scale * 1.1,
                    duration: 100
                });
            });
            container.on('pointerout', () => {
                this.tweens.add({
                    targets: img,
                    scale: scale > 0 && scale < 1 ? scale : 0.25,
                    duration: 100
                });
            });
        };

        createSelection(width / 2, height * 0.4, 'car-dirty', 'car');
        createSelection(width / 2, height * 0.6, 'tank-dirty', 'tank');
        createSelection(width / 2, height * 0.8, 'airplane-dirty', 'airplane');
    }
}
