import Phaser from 'phaser';
import BootScene from './scenes/LoadScene';
import GameScene from './scenes/GameScene';
import TitleScene from './scenes/TitleScene';

const sw = document.documentElement.clientWidth;
const sh = document.documentElement.clientHeight;

// 查看全部 https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const config = {
    width: sw, // 宽
    height: sh, // 高
    type: Phaser.AUTO, // 默认是AUTO,优先WEBGL，其次CANVAS
    parent: 'content', // 父元素的id
    scene: [ // 这个游戏的场景数组，默认从第一个开始
        BootScene,
        GameScene,
        TitleScene
    ],
    resolution: window.devicePixelRatio,
    title: '游戏DEMO', // 标题，显示在console中
    url: 'http://phaser3.io', // 游戏链接，显示在console中
    version: '0.0.1',
    physics: {
        // 详细配置 https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.ArcadeWorldConfig
        default: 'arcade', // 物理引擎系统，有3种， impact, matter
        arcade: {
            gravity: {
                y: 490
            },
            debug: false
        }
    }
    // pixelArt: true,
    // roundPixels: true

};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
