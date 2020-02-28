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
  score;
 
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

    
    
    this.ball1 = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height),"ball");
    this.ball2 = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height),"ball");
    this.ball3 = this.physics.add.sprite(Phaser.Math.Between(10,this.scale.width), Phaser.Math.Between(10,this.scale.height),"ball");
    
    this.balls = this.physics.add.group();
    this.balls.add(this.ball1);
    this.balls.add(this.ball2);
    this.balls.add(this.ball3);
    // this.ball1.setCollideWorldBounds(true);
    // this.ball2.setCollideWorldBounds(true);
    // this.ball3.setCollideWorldBounds(true);
    

    this.hoops = this.physics.add.group();
    

    var maxObjects = 4;
    
    for(var i = 0; i <= maxObjects; i++) {
      var hoop = this.physics.add.sprite(0, 0, "hoop");
      this.hoops.add(hoop);
      hoop.setPosition(Phaser.Math.Between(10,this.scale.width), 0, this.scale.width, this.scale.height);
      hoop.setVelocity(0,-100);
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

    this.physics.add.collider(this.projectiles, this.hoops);                //Collider does not work now despite all sprites being initialized with Physics

    this.physics.add.overlap(this.player, this.hoops, this.pickHoops);
    //this.physics.add.overlap(this.player, this.balls, this.hurtPlayer);   //FREEZES GAME
    this.physics.add.overlap(this.projectiles, this.balls, this.hitBall);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1.0);
    graphics.fillRect(0,0,this.scale.width,20);
    this.score = 0;

    this.scoreLabel = this.add.bitmapText(10,5,"pixelFont", "SCORE ", 16);
  }

  pickHoops(player, hoop) {
    hoop.disableBody(true, true);

    //var explosion = new Explosion(this, hoop.x, hoop.y);    //FREEZES GAME
    
    // this.score += 10;                                      //FREEZES GAME
    // var scoreFormated = this.zeroPad(this.score, 6);
    // this.scoreLabel.text = "SCORE " + this.score;
  }

  hurtPlayer(player, ball) {
    ball.destroy();
    player.x = this.scale.width / 2 - 8;
    player.y = this.scale.height - 64;
  }

  hitBall(projectiles, ball) {

    var explosion = new Explosion(this, ball.x, ball.y);

    projectiles.destroy();
    
    this.resetBallPos(ball);  
    // this.score += 15;                                    //FREEZES GAME
    // var scoreFormated = this.zeroPad(this.score, 6);
    // this.scoreLabel.text = "SCORE " + this.score;
  }

  update() {
    this.movePlayerManager();

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.attack();

    }

    for(var i = 0; i < this.projectiles.getChildren().length; i++) {
      let beam = this.projectiles.getChildren()[i];
      beam.update();
    }
    

  }
  movePlayerManager() {
    if(this.cursorKeys.left?.isDown) {
      this.player.setVelocityX(-200);
      this.player.flipX = false;
    }
    else if(this.cursorKeys.right?.isDown) {
      this.player.setVelocityX(200);
      this.player.flipX = true;
    }

    else {
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up?.isDown) {
      this.player.setVelocityY(-300);
    }

    else {
      this.player.setVelocityY(250);
    }
  }

  attack() {
    var beam = new Beam(this);
  }

  resetBallPos(ball) {
    ball.y = 0;
    var randX = Phaser.Math.Between(0,this.scale.width)
    ball.x = randX;
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
}

