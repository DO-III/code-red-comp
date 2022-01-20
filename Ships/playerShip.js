const PG_WIDTH = 100; //Should match player graphic in final.
const PG_HEIGHT = 100; //Should match player graphic in final.

const PLAYER_MAX_MOVE_SPEED = 5;
const PLAYER_MOVE_RATE= 1.5;
const PLAYER_BACK_MOVE_RATE = PLAYER_MOVE_RATE * -1;
const PLAYER_FRICTION = 0.85;

class PlayerShip {

    constructor(game) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Player.png"); //Messy hardcode, fix later.

        this.x = 0;
        this.y = 0;

        this.xVelocity = 0; //Change in X between ticks.
        this.yVelocity = 0; //Change in Y between ticks.


        this.angle;         //Direction player points in, 0 is straight up.

    }
    
    draw(ctx) {

        var myCanvas = document.createElement('canvas');
        myCanvas.width = PG_WIDTH;
        myCanvas.height = PG_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (PG_WIDTH / 2, PG_HEIGHT / 2);
        myCtx.rotate (Math.PI / 2);
        myCtx.translate (-(PG_WIDTH / 2), -(PG_HEIGHT / 2));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();
        
        ctx.drawImage(myCanvas, this.x, this.y);
    }

    update() {
        //TODO Get final player graphic so we can do a proper check on edges.

        this.moveHandle();
        this.rotateHandle();

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
    */

    rotateHandle() {
        var mouse = this.game.mouse;

        console.log(mouse.x);



        

    }
}