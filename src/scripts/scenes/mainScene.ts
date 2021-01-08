import ExampleObject from '../objects/exampleObject';
import Beam from './beam';
import Explosion from './explosion';
//import { Scene } from 'phaser';


export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.TileSprite;
  midground: Phaser.GameObjects.TileSprite;
  foreground: Phaser.GameObjects.TileSprite;
  player: Phaser.Physics.Arcade.Sprite;
  ball1: Phaser.Physics.Arcade.Sprite;
  ball2: Phaser.Physics.Arcade.Sprite;
  ball3: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar;
  beam: Phaser.Physics.Arcade.Sprite;
  projectiles: Phaser.Physics.Arcade.Group;
  hoops: Phaser.Physics.Arcade.Group;
  balls: Phaser.Physics.Arcade.Group;
  scoreLabel;
  score: number = 0;
  beamSound;
  explosionSound;
  pickupSound;
  music;
  textLegend;
  textControls;
 
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {  
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0,0);
    this.background.setScrollFactor(0);
   
    this.midground = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "midground");
    this.midground.setOrigin(0,0);
    this.midground.setScrollFactor(0);

    this.foreground = this.add.tileSprite(0, 0, this.scale.width, 58, "foreground");
    this.foreground.setOrigin(0,0);
    this.foreground.setScrollFactor(0);
    this.foreground.y = 550;


    this.balls = this.physics.add.group();

    // this.ball1 = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height-100),"ball");
    // this.ball2 = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height-200),"ball");
    // this.ball3 = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height-300),"ball");

    // this.ball1.setVelocity(10,100);
    // this.ball2.setVelocity(0,100);
    // this.ball3.setVelocity(-10,100);

    // this.balls.add(this.ball1);
    // this.balls.add(this.ball2);
    // this.balls.add(this.ball3);


    this.hoops = this.physics.add.group();  

    var maxBalls = 1;

    for(var i = 0; i <= maxBalls; i++) {
      var ball = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height-100),"ball");
      ball.setScale(1.5);
      this.balls.add(ball);
      ball.setVelocity(100,100);
      ball.setCollideWorldBounds(true);
      ball.setBounce(1);
    }
    
    var maxObjects = 4;

    for(var i = 0; i <= maxObjects; i++) {
      var hoop = this.physics.add.sprite(0, 0, "hoop");
      this.hoops.add(hoop);
      hoop.setPosition(Phaser.Math.Between(10,this.scale.width), 0, this.scale.width, this.scale.height);
      hoop.setVelocity(0,100);
      hoop.setCollideWorldBounds(true);
      hoop.setBounce(1);
    }

    this.player = this.physics.add.sprite(100, 500,"player");
    this.player.play("player_anim",true);
    this.player.setCollideWorldBounds(true);
    this.player.setGravity(100);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles = this.physics.add.group();

    this.physics.add.overlap(this.balls, this.hoops, this.shootHoops, function (ball, hoop) {
      hoop.destroy();
      },
      this);                //Collider does not work now despite all sprites being initialized with Physics

    this.physics.add.overlap(this.player, this.hoops, this.pickHoops, function (player, hoop) {
      hoop.destroy();
      },
      this);

    this.physics.add.overlap(this.player, this.balls, this.hurtPlayer, function (player, ball) {
      hoop.destroy();
      },
      this);
    //this.physics.add.overlap(this.player, this.balls, this.hurtPlayer);   //FREEZES GAME
    this.physics.add.collider(this.projectiles, this.balls, this.hitBall, function (projectile, ball) {
      projectile.destroy();
      },
      this);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1.0);
    graphics.fillRect(0,0,this.scale.width,20);

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10,5,"pixelFont", "SCORE ", 16);

    this.beamSound = this.sound.add("audio_beam");
    this.beamSound.volume = 0.1;                                //SOOO LOUD 
    this.explosionSound = this.sound.add("audio_explosion");
    this.pickupSound = this.sound.add("audio_pickup");
    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.music.play(musicConfig);

    this.textLegend = this.add.text(20,20, "Player + Ball = -30 pts\nBall + Hoop = +20 pts\nPlayer + Hoop = +10 pts\n", {
      font: "20px Arial",
      fill: "black"   
    });

    this.textControls = this.add.text(this.scale.width - 210,20, "Left/Right = Movement\nUp(press) = Jump\nUp(hold) = float\nSPACE = Shoot", {
      font: "20px Arial",
      fill: "black"   
    });
  }

  shootHoops(ball, hoop) {

    //var explosion = new Explosion(this, ball.x, ball.y);

     
    this.score += 20;                                    //FREEZES GAME
    //var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + this.score; 
  }

  pickHoops(player, hoop) {
    //hoop.disableBody(true, true);

    //var explosion = new Explosion(this, hoop.x, hoop.y);    //FREEZES GAME
    
    this.score += 10;                                      //FREEZES GAME
    // var scoreFormated = this.zeroPad(this.score, 6);
    //console.log(this.score);
    this.scoreLabel.text = "SCORE " + this.score;
  }

  hitBall(projectiles, ball) {

  }

  hurtPlayer(player, ball) {

    if(this.player.alpha < 1) {
      return;
    }
    player.disableBody(true, true);
    
    this.time.addEvent({
      delay:1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });

    if(this.score - 30 >= 0) {  
      this.score -= 30;                                      //FREEZES GAME  
    }
    else {
      this.score = 0;
    }
    this.scoreLabel.text = "SCORE " + this.score;
  }

  

  update() {
    this.movePlayerManager();

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if(this.player.active) {
        this.attack();
      }

    }

    for(var i = 0; i < this.projectiles.getChildren().length; i++) {
      let beam = this.projectiles.getChildren()[i];
      beam.update();
    }


    if(!this.hoops.countActive()) {
      var maxObjects = 4
      for(var i = 0; i <= maxObjects; i++) {
        var hoop = this.physics.add.sprite(0, 0, "hoop");
        this.hoops.add(hoop);
        hoop.setPosition(Phaser.Math.Between(10,this.scale.width), 0, this.scale.width, this.scale.height);
        hoop.setVelocity(0,-100);
        hoop.setCollideWorldBounds(true);
        hoop.setBounce(1);
      }
    };
    

  }
  movePlayerManager() {
    if(this.cursorKeys.left?.isDown) {
      this.player.setVelocityX(-300);
      this.player.flipX = false;
    }
    else if(this.cursorKeys.right?.isDown) {
      this.player.setVelocityX(300);
      this.player.flipX = true;
    }

    else {
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up?.isDown) {
      this.player.setVelocityY(-400);
    }

    else {
      this.player.setVelocityY(150);
    }
  }

  attack() {
    var beam = new Beam(this);
    this.beamSound.play();
  }

  resetPlayer() {
    var x = this.scale.width / 2 - 8;
    var y = this.scale.height + 64;
    this.player.enableBody(true,x,y,true,true);

    this.player.alpha = 0.5;

    this.time.addEvent({
      delay:1500,
      callback: this.respawn,
      callbackScope: this,
      loop: false
    });
  }

  respawn() {
    this.player.alpha = 1;
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
}

