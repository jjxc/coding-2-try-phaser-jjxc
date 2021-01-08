export default class Beam extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {

        var x = scene.player.x;
        var y = scene.player.y;

        super(scene, x, y, "beam");
        this.setScale(4);
        scene.add.existing(this);
        scene.projectiles.add(this);
        
        this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y =- 500;

        

        //this.setGravity(0);
        

    }

    update() {
        if(this.y <= 75) {
            this.destroy();
        }

        if(this.y >= 575) {
            this.destroy();
        }

        if(this.x <= 75) {
            this.destroy();
        }

        if(this.x >= 750) {
            this.destroy();
        }
    }
}