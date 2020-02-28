export default class Beam extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {

        var x = scene.player.x;
        var y = scene.player.y;

        super(scene, x, y, "beam");
        this.setScale(2);
        scene.add.existing(this);
        
        this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y =- 700;

        //this.setGravity(0);
        

    }

    update() {
        if(this.y <= 50) {
            this.destroy();
        }

        if(this.y >= 525) {
            this.destroy();
        }

        if(this.x <= 50) {
            this.destroy();
        }

        if(this.x >= 750) {
            this.destroy();
        }
    }
}