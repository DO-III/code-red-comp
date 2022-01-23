const PG_WIDTH = 100; //Should match player graphic in final.
const PG_HEIGHT = 100; //Should match player graphic in final.

const PGW_CENTER = PG_WIDTH / 2; //Measures center of player graphic, x-value.
const PGH_CENTER = PG_HEIGHT / 2; //Center of player graphic, y-value.

const PLAYER_MOVE_RATE= 1.5; //Rate at which player accelerates.
const PLAYER_BACK_MOVE_RATE = PLAYER_MOVE_RATE * -1;
const PLAYER_FRICTION = 0.85; //Rate at which speed decreases. Lower = slower.

class PlayerShip {

    /*
    Create the PlayerShip object.
    */
    constructor(game) {
        
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Player.png"); //Messy hardcode, fix later.

        this.x = 0;
        this.y = 0;
        this.xCenter = 0;
        this.yCenter = 0;


        this.xVelocity = 0; //Change in X between ticks.
        this.yVelocity = 0; //Change in Y between ticks.


        this.angle;         //Direction player points in, 0 is straight up...?

        this.bullets = [];
    }
    
    /*
    Draw the PlayerShip.

    Rotates to point to the cursor.
    */
    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = PG_WIDTH;
        myCanvas.height = PG_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (PGW_CENTER, PGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        //myCtx.rotate (Math.PI / 2); //Please don't
        myCtx.rotate (this.angle);
        myCtx.translate (-(PGW_CENTER), -(PGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        this.drawBullets();
        ctx.drawImage(myCanvas, this.x, this.y);
    }

    update() {
        //TODO Get final player graphic so we can do a proper check on edges.
        this.moveHandle();
        this.rotateHandle();

        this.updateBullets();
    }

    drawBullets(){
        for(let bullet of this.bullets){
            bullet.draw();
        }
    }

    shoot(){
        this.bullets.push(new playerWithBullet(this.x + 12, this.y));
    }
    updateBullets(){
        for(let i = this.bullets.length - 1; i>= 0; i--){
            this.bullet[i].update();
            // if(this.bullets[i].isOffScreen()){
            //     this.bullets.splice(i,1);
            //     break;
            // }
        }
    }

    /*
    Control player's movement.

    The player's movement is velocity based - it rapidly approaches a cap.
    This is to give "flow" of movement.
    */
    moveHandle() {
        //The basic idea is that the player points in the direction they move in
        //and shoots in the direction the arrow keys press, like a ship.

        //That means we need to rotate the graphic to match the WASD inputs.
        
        //Calculate the x velocity.
        //This is found by adding "left" to "right"; if both are pressed, no movement.
        this.xVelocity += (
            //Get player's movement in the first place.
            (this.game.left ? PLAYER_BACK_MOVE_RATE : 0 ) + (this.game.right? PLAYER_MOVE_RATE : 0 )
        );
        //Repeat for y velocity; bearing in mind that "0" is at the top.
        this.yVelocity += (
            (this.game.up ? PLAYER_BACK_MOVE_RATE : 0 ) + (this.game.down? PLAYER_MOVE_RATE : 0 )
        );

        //Calculate differences and change position.
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        //Calculate friction.

        this.x *= PLAYER_FRICTION;
        this.y *= PLAYER_FRICTION;
    }

    /*
    Handles rotating the player.

    The player points toward the cursor using trigonometry.
    Please don't alter the math here unless it's really necessary,
    it's very finicky and prone to fit-throwing.
    */
    rotateHandle() {
        var mouse = this.game.mouse;
        if (mouse == null) {
            return(0); //If mouse isn't defined yet, don't try to rotate.
                       //I know this is gross, bear with me.
        }

        var dx = (mouse.x) - (this.x + PGW_CENTER); //Accounting for difference in center of thing.
        var dy = (mouse.y) - (this.y + PGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
    }
}