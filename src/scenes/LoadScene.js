import makeAnimations from '../helpers/animations';

class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene',
            pack: {
                // 用于在进入场本厂前就要加载的文件
                files: [
                    {
                        type: 'spritesheet',
                        key: 'marioHH',
                        url: 'assets/images/mario-sprites.png',
                        frameConfig: {
                            frameWidth: 16,
                            frameHeight: 32
                        }
                    }
                ]
            }
        });
    }
    init() {
        // 初始化的一些操作
        console.log('第一步：init');
        const config = {
            key: 'run',
            frames: 'marioHH',
            frameRate: 5,
            repeat: -1,
            repeatDelay: 0
        };
        this.anims.create(config); // 创建一个动画
    }
    preload() {
        // 用于加载资源以及监听操作
        console.log('第二步：load');
        // this.load.setBaseURL('/jansen/'); // 如果你要给所有的资源前面加一个url,统一提前调用此方法
        // this.load.setPath('/images/sprites/'); // 给所有的相对资源前面加一个统一路径
        // 亲测上述两个方法并不区分相对和绝对。只是BaseUrl会在Path前。

        // http://www.phaser.io/examples/v3/view/loader/image/load-image#
        // loadimage的多种方式，推荐配合setPath后使用key/file同名的方式，可以批量加载
        // this.load.image([
        //     { key: 'sukasuka-chtholly' },
        //     { key: 'taikodrummaster', extension: 'jpg'} ，默认后缀是png，如果是jpg需要写extension
        //     { key: 'evil', url: 'taikodrummaster.jpg'} 如果key,url不同名，就要写url
        // ]);
        this.load.image('background-clouds', 'assets/images/clouds.png'); // 16-bit later

        // atlas 加载图片合集资源，这个里也是雪碧图，但并不仅限等宽等高，其次，加载时序是等场景start后才会加载
        // json里该怎么写或者怎么生成还不知道。
        this.load.atlas(
            'mario-sprites',
            'assets/mario-sprites.png',
            'assets/mario-sprites.json'
        );

        // 雪碧图
        // load雪碧图 ,常用配置就是如下的配置
        this.load.spritesheet('tiles', 'assets/images/super-mario.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            margin: 0,
            spacing: 2
        });

        // Support for switching between 8-bit and 16-bit tiles
        this.load.spritesheet(
            'tiles-16bit',
            'assets/images/super-mario-16bit.png',
            {
                frameWidth: 16,
                frameHeight: 16,
                spacing: 2
            }
        );

        // Spritesheets with fixed sizes. Should be replaced with atlas:
        this.load.spritesheet('mario', 'assets/images/mario-sprites.png', {
            frameWidth: 16,
            frameHeight: 32
        });

        // 通常用来加载背景音乐
        this.load.audio('overworld', [
            'assets/music/overworld.ogg',
            'assets/music/overworld.mp3'
        ]);

        // 通常，游戏里的音效采用sprite的方式加载，json里定义资源和对应每种key的秒数。
        this.load.audioSprite(
            'sfx',
            'assets/audio/sfx.json',
            ['assets/audio/sfx.ogg', 'assets/audio/sfx.mp3'],
            {
                instances: 4
            }
        );

        // load.pack 打包加载
        // this.load.pack('key', 'url');
        // {
        //     "test3": {
        //         "files": [
        //             {
        //                 "type": "image",
        //                 "key": "makoto",
        //                 "url": "assets/pics/makoto.png"
        //             },
        //             {
        //                 "type": "image",
        //                 "key": "nayuki",
        //                 "url": "assets/pics/nayuki.png"
        //             },
        //             {
        //                 "type": "pack",
        //                 "key": "pack3",
        //                 "url": "assets/loader-tests/pack3.json"
        //             }
        //         ]
        //     },
        //     "meta": {
        //         "generated": "1401380327373",
        //         "app": "Phaser 3 Asset Packer",
        //         "url": "https://phaser.io",
        //         "version": "1.0",
        //         "copyright": "Photon Storm Ltd. 2018"
        //     }
        // }

        // Tilemap with a lot of objects and tile-properties tricks
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/super-mario.json');

        // 自定义的字体。使用的时候add.bitmapText
        this.load.bitmapFont(
            'font',
            'assets/fonts/font.png',
            'assets/fonts/font.fnt'
        );

        // This json contain recorded gamep
        this.load.json('attractMode', 'assets/json/attractMode.json');

        // add一个mario对象
        const loadMario = this.add.sprite(
            8,
            this.game.config.height / 2 - 16,
            'marioHH'
        );

        const progress = this.add.graphics();
        console.log(progress);
        loadMario.play('run');

        // makeAnimations(this);

        // events 常用的就是on, off, once
        // 最重要的进度条可以依赖于progress方法
        // 如果需要多进度条，比如正在加载图片，正在加载音乐，正在加载地图这样的，就需要用fileprogress来写了。
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(
                0,
                this.game.config.height / 2,
                this.game.config.width * value,
                60
            );

            loadMario.setX(this.game.config.width * value - 8);
        });

        // 所有资源加载完毕进入该方法。执行完毕后进入create方法
        this.load.on('complete', () => {
            progress.destroy();
            console.log('scene load complete');
            makeAnimations(this);
            // this.scene.start('TitleScene');
        });
    }
    create() {
        console.log('第三步：create');
        // 失去焦点后不要暂停音乐。
        this.sound.pauseOnBlur = false;
        const marioTextures = this.textures.get('mario-sprites');
        const hasMario = this.textures.exists('tiles');
        console.log(hasMario);
        // this.textures是所有资源key的集合，可以利用它去取任何资源
        // console.log(marioTextures.getFrameNames());
        console.log(marioTextures.getSourceImage('brick'));
        console.log(marioTextures.get('brick'));
        // 关于字体文字换行、排版，还不会
        this.dynamicTxt = this.add.bitmapText(
            50,
            100,
            'font',
            'WELCOME TO MY GAME',
            16
        );
        this.bitter = this.add.blitter(0, 0, 'background-clouds');
        this.bitter.create(200, 50);

        /* 
            scene.add方法，把各种东西加到场景中来。 通常画画类的，就是x,y,w,h / x,y, start,end
            add 方法会返回对应的对象。
            每个对象上都会有些相对应的方法
            每个对象都继承自GameObjects
            每个对象经过排列组合，都继承GameObjects[]下的基本Object，以及一些Components，比如旋转，透明度，显示等等。
            
        */

        // shape 类的， 可以做各种形状。
        this.ttell = this.add.ellipse(110, 200, 50, 100, 0x6666ff); // 加一个椭圆
        this.add.arc(250, 200, 50, 320, 40, true, 0x6666ff); // 一个缺角的弧 false/true 代表顺时针还是逆时针到那个角度。角度开始右边中间。
        this.add.circle(360, 200, 55, 0x6666ff); // 画圆
        this.add.star(200, 280, 5, 12, 32, 0x6666ff); // 画星星 x,y,stars,in, out, color
        var data = [0, 20, 84, 20, 84, 0, 120, 50, 84, 100, 84, 80, 0, 80]; // 点位
        this.add.polygon(300, 280, data, 0x6666ff); // 画多边形
        // ...还有其他的图像，官方文档找起来不是很容易
        // http://www.phaser.io/examples/v3/category/game-objects/shapes 通过这个可以看绝大对数的

        // graphics，有点类似于canvas自己画的感觉，开销比较大。
        const grap = this.add.graphics(); // 基本画图对象
        grap.clear(); // 清空
        grap.lineStyle(3, 0xff6600, 1); // 线的颜色, width, color, apha
        grap.beginPath(); // 开始
        grap.arc(
            100,
            300,
            50,
            Phaser.Math.DegToRad(30),
            Phaser.Math.DegToRad(330),
            false
        ); // 开始画
        // grap.closePath(); // 结束路径，上了这个会补到起点。如果描边的话。
        grap.strokePath(); // 描边
        // garp.fillPath 填充

        const testext = this.add.extern(); // 不知道干嘛的，没有例子，就说创建一个外部对象

        // 添加图像
        this.add.image(0, 100, 'background-clouds');
        this.add.text(0, 380, 'I AM A NORMAL TTTEXT', {
            fontSize: '19px'
        });
        this.make.text({
            x: {
                randInt: [0, 200]
            },
            y: 420,
            text: 'THIS TEXT IS MAKED'
        });
        // make要比add少很多方法，而且是用的conifg，区别说是不会自动加入到场景，但是看不出来。
        console.log(testext);
        // SOUND 部分，常用的就是play,pause,resume，以及部分监听事件。
        // this.scene.start('TitleScene');
        const music = this.sound.add('sfx');
        console.log(music);
        const music2 = this.sound.addAudioSprite('sfx');
        music2.play('smb_jump-small');
        this.sound.playAudioSprite('sfx', 'smb_gameover');

        /* tween 创建一个缓动动画
        // 就是一个目标，一个配置， 详细配置如下
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.TweenBuilderConfig
            配置里比如具体动画枚举没有
            var EaseMap = require('../../math/easing/EaseMap');
            Power0: Linear,
            Power1: Quadratic.Out,
            Power2: Cubic.Out,
            Power3: Quartic.Out,
            Power4: Quintic.Out
            剩下的要去源码里查
             Loop through every property defined in the Tween, i.e.: props { x, y, alpha }
            在源码里找到了这个，建议把这类属性放到props里，一样会解开，就是targets身上的属性。比如x,y等等。
        */

        const tween = this.tweens.add({
            targets: grap,
            delay: 100,
            x: 600, // 目的地X600
            ease: 'Power1',
            // ease: function (t) {
            //     return Math.pow(Math.sin(t * 3), 3); 支持自定义动画
            // },
            duration: 3000,
            hold: 1000, // 如果支持反向返回后，到了目的地返回前hold的秒数
            yoyo: true, // 是否支持反向返回
            repeat: 1,
            paused: false, // 创建的时候是否默认暂停，默认false，直接开动,  这个设置成true了之后直接开不起来了，不知道为啥
            onStart: function() {
                console.log('onStart');
                console.log(arguments);
            },
            onComplete: function() {
                console.log('onComplete');
                console.log(arguments);
            },
            onYoyo: function() {
                console.log('onYoyo');
                console.log(arguments);
            },
            onRepeat: function() {
                console.log('onRepeat');
                console.log(arguments);
            }
        });
        console.log(tween.isPaused());
        // tween.seek(0); 0 ~ 1
        // tween.restart();

        /*
            Animation 动画
        */
    }
    update() {
        // 每个对象上都会有对应的一些方法
        // setInteractive 让某一个方块可以支持input事件。
        this.dynamicTxt.rotation += 0.01;
        this.ttell.setVisible(!this.ttell.visible);
    }
}

export default BootScene;
