export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "./assets/images/back_combine_62_63.png");
    this.load.image("midground", "./assets/images/midground.png");
    this.load.image("foreground", "./assets/images/foreground.png");
    this.load.spritesheet("player", "./assets/spritesheets/wind_sprite_anim.png", {
      frameWidth: 160,
      frameHeight: 130
    });
    this.load.spritesheet("beam", "./assets/spritesheets/beam.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  
    this.load.spritesheet("hoop", "./assets/spritesheets/hoop.png", {
      frameWidth: 126,
      frameHeight: 42
    });

    this.load.spritesheet("ball", "./assets/spritesheets/power-up.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    
    this.load.bitmapFont("pixelFont", "./assets/font/font.png", "assets/font/font.xml");

    
  }

  create() {
    this.anims.create({
      key: "player_anim",
      frames: this.anims.generateFrameNumbers("player", {start: 3, end: 11}), 
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNames("explosion", {start: 0, end: 4}),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam", {start: 0, end: 1}), 
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "ball-grey",
      frames: this.anims.generateFrameNumbers("ball", {start: 2, end: 3}), 
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "ball-red",
      frames: this.anims.generateFrameNumbers("ball", {start: 0, end: 1}), 
      frameRate: 20,
      repeat: -1
    });

     
    this.scene.start('MainScene');
    
    
  }
}
