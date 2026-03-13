import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load assets
        this.load.setPath('assets/');

        // Models
        this.load.image('tank-clean', 'model/tank-clean.png');
        this.load.image('tank-dirty', 'model/tank-dirty.png');
        this.load.image('car-clean', 'model/car-clean.png');
        this.load.image('car-dirty', 'model/car-dirty.png');
        this.load.image('airplane-clean', 'model/airplane-clean.png');
        this.load.image('airplane-dirty', 'model/airplane-dirty.png');

        // Tools
        this.load.image('tool-chisel', 'tools/chisel-icon.png');
        this.load.image('tool-cream', 'tools/cream-icon.png');
        this.load.image('tool-razor', 'tools/razor-icon.png');
        this.load.image('tool-scissors', 'tools/scissors-icon.png');
        this.load.image('tool-screwdriver', 'tools/screwdriver-icon.png');

        // Create a basic circle for the "brush"
        const graphics = this.make.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(60, 60, 60);
        graphics.generateTexture('brush', 120, 120);
    }

    create() {
        this.scene.start('Menu');
    }
}
