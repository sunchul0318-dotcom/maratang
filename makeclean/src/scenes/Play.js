import Phaser from 'phaser';

export default class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    init(data) {
        this.modelKey = data.model || 'car'; // 'car', 'tank', 'airplane'
    }

    create() {
        const { width, height } = this.scale;

        // Settings based on model
        const requirements = {
            'car': 'tool-cream',
            'tank': 'tool-chisel',
            'airplane': 'tool-screwdriver'
        };
        this.correctTool = requirements[this.modelKey];
        this.selectedTool = null;

        // Clean Image (Background of the object)
        const cleanImg = this.add.image(width * 0.45, height / 2, `${this.modelKey}-clean`);
        this.fitToScreen(cleanImg, width * 0.8, height * 0.8);

        // Dirty Image overlay using RenderTexture
        this.rt = this.add.renderTexture(0, 0, width, height);

        const dirtyImg = this.add.image(width * 0.45, height / 2, `${this.modelKey}-dirty`);
        // Forcing the dirty image to have the EXACT SAME display size as the clean image
        dirtyImg.setDisplaySize(cleanImg.displayWidth, cleanImg.displayHeight);
        dirtyImg.setVisible(false); // We just use it to draw to RT

        // Draw the dirty image onto the RenderTexture
        // If we omit x and y, it uses the dirtyImg's current transform and position
        this.rt.draw(dirtyImg);

        // We need a brush to erase
        this.brush = this.add.image(0, 0, 'brush');
        this.brush.setVisible(false);

        // Scratched coverage tracking
        this.setupWinConditionTracker();

        // UI tools on the right
        this.createToolKit();

        // Interaction
        this.input.on('pointerdown', this.handlePointer, this);
        this.input.on('pointermove', this.handlePointer, this);
    }

    fitToScreen(img, targetWidth, targetHeight) {
        const scaleX = targetWidth / img.width;
        const scaleY = targetHeight / img.height;
        const scale = Math.min(scaleX, scaleY);
        img.setScale(scale);
    }

    createToolKit() {
        const { width, height } = this.scale;

        // Tools background
        this.add.rectangle(width - 50, height / 2, 100, height, 0x222222, 0.8).setDepth(10);

        const tools = ['tool-chisel', 'tool-cream', 'tool-razor', 'tool-scissors', 'tool-screwdriver'];

        this.toolIcons = [];
        let startY = 150;
        const spacing = 150;

        // Highlight square
        this.highlight = this.add.rectangle(width - 50, -100, 80, 80, 0xffffff, 0).setStrokeStyle(4, 0xffff00).setDepth(11);

        tools.forEach((tool, index) => {
            const icon = this.add.image(width - 50, startY + index * spacing, tool).setInteractive().setDepth(12);
            // Scale icon down to fit the bar
            const scale = 80 / Math.max(icon.width, icon.height);
            icon.setScale(scale > 0 && scale < 1 ? scale : 0.8);

            icon.on('pointerdown', () => {
                this.selectTool(tool);
            });
            this.toolIcons.push({ key: tool, obj: icon });
        });
    }

    selectTool(toolKey) {
        this.selectedTool = toolKey;
        const selected = this.toolIcons.find(t => t.key === toolKey);
        if (selected) {
            this.highlight.setPosition(selected.obj.x, selected.obj.y);
        }
    }

    handlePointer(pointer) {
        if (!pointer.isDown) return;

        // Check if correct tool is selected
        if (this.selectedTool !== this.correctTool) return;

        // Erase on RenderTexture
        this.brush.setPosition(pointer.x, pointer.y);
        this.rt.erase(this.brush, pointer.x, pointer.y);

        // Create particle for feedback
        // Just a simple expanding circle tween or built-in graphic
        this.createParticle(pointer.x, pointer.y);

        // Update win condition tracking
        this.trackCleanPosition(pointer.x, pointer.y);
    }

    createParticle(x, y) {
        // limit particles slightly logic-wise
        if (Math.random() > 0.3) return;

        const particle = this.add.circle(x + Phaser.Math.Between(-20, 20), y + Phaser.Math.Between(-20, 20), Phaser.Math.Between(5, 15), 0xffffff, 0.8);
        this.tweens.add({
            targets: particle,
            y: y + Phaser.Math.Between(50, 100),
            alpha: 0,
            scale: 0.5,
            duration: 500,
            onComplete: () => particle.destroy()
        });
    }

    setupWinConditionTracker() {
        this.gridSize = 60;
        const { width, height } = this.scale;
        this.cols = Math.ceil(width / this.gridSize);
        this.rows = Math.ceil(height / this.gridSize);
        this.cleanedGrid = new Array(this.cols * this.rows).fill(false);
        this.totalPoints = 0;

        // Core area of model
        const startCol = Math.floor((width * 0.1) / this.gridSize);
        const endCol = Math.floor((width * 0.8) / this.gridSize);
        const startRow = Math.floor((height * 0.2) / this.gridSize);
        const endRow = Math.floor((height * 0.8) / this.gridSize);

        // The car doesn't take up the full bounding box. 
        // 25% of the bounding box is a more realistic target.
        this.targetPoints = (endCol - startCol) * (endRow - startRow) * 0.25;

        this.validBounds = {
            startX: width * 0.1,
            endX: width * 0.8,
            startY: height * 0.2,
            endY: height * 0.8
        };
    }

    trackCleanPosition(x, y) {
        if (x < this.validBounds.startX || x > this.validBounds.endX || y < this.validBounds.startY || y > this.validBounds.endY) {
            return;
        }

        const col = Math.floor(x / this.gridSize);
        const row = Math.floor(y / this.gridSize);
        const index = row * this.cols + col;

        if (!this.cleanedGrid[index]) {
            this.cleanedGrid[index] = true;
            this.totalPoints++;

            // Check win
            if (this.totalPoints >= this.targetPoints) {
                // To avoid multiple triggers
                this.targetPoints = 999999;

                // Slight delay before ending
                this.time.delayedCall(1000, () => {
                    this.win();
                });
            }
        }
    }

    win() {
        this.scene.start('End', { model: this.modelKey });
    }
}
