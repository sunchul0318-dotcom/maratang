import Phaser from 'phaser';

import Boot from './scenes/Boot.js';
import Menu from './scenes/Menu.js';
import Play from './scenes/Play.js';
import End from './scenes/End.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 600,
    height: 900,
    backgroundColor: '#333344',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Boot, Menu, Play, End]
};

const game = new Phaser.Game(config);
