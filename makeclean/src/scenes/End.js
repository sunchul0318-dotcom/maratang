import Phaser from 'phaser';

export default class End extends Phaser.Scene {
    constructor() {
        super('End');
    }

    init(data) {
        this.modelKey = data.model || 'car';
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(0, 0, width, height, 0x333344).setOrigin(0);

        // Awesome text
        this.add.text(width / 2, height * 0.2, 'NICE & CLEAN!', {
            fontSize: '48px',
            fontFamily: 'sans-serif',
            color: '#00ff00',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Show fully clean model
        const cleanImg = this.add.image(width / 2, height / 2, `${this.modelKey}-clean`);
        this.fitToScreen(cleanImg, width * 0.7, height * 0.5);

        // CTA Button
        const btnBg = this.add.rectangle(width / 2, height * 0.85, 300, 80, 0xffa500, 1).setInteractive({ cursor: 'pointer' });
        btnBg.setStrokeStyle(4, 0xffffff);
        const btnText = this.add.text(width / 2, height * 0.85, 'DOWNLOAD NOW', {
            fontSize: '32px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Pulse animation
        this.tweens.add({
            targets: [btnBg, btnText],
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        btnBg.on('pointerdown', () => {
            // Usually goes to app store. We can just alert or restart
            this.scene.start('Menu');
        });

        // Particles Using the 'brush' texture simply as a particle
        const emitZone = new Phaser.Geom.Rectangle(0, -10, width, 10);

        const emitter = this.add.particles(0, 0, 'brush', {
            x: 0,
            y: 0,
            emitZone: { type: 'random', source: emitZone },
            speedY: { min: 50, max: 200 },
            speedX: { min: -50, max: 50 },
            lifespan: 5000,
            scale: { start: 0.5, end: 0.1 },
            alpha: { start: 1, end: 0 },
            frequency: 100,
            blendMode: 'ADD',
            tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]
        });
    }

    fitToScreen(img, targetWidth, targetHeight) {
        const scaleX = targetWidth / img.width;
        const scaleY = targetHeight / img.height;
        const scale = Math.min(scaleX, scaleY);
        img.setScale(scale);
    }
}
