const PG_WIDTH = 50; //Should match player graphic in final.
const PG_HEIGHT = 50; //Should match player graphic in final.

const PGW_CENTER = PG_WIDTH / 2; //Measures center of player graphic, x-value.
const PGH_CENTER = PG_HEIGHT / 2; //Center of player graphic, y-value.

const PLAYER_MOVE_RATE= 1.5; //Rate at which player accelerates.
const PLAYER_BACK_MOVE_RATE = PLAYER_MOVE_RATE * -1;
const PLAYER_FRICTION = 0.85; //Rate at which speed decreases. Lower = slower.
const PLAYER_RADIUS = 10; //Radius of player.

const PLAYER_FIRING_COOLDOWN = 0.15; //Rate that player is allowed to fire.

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
        this.BoundingCircle = new BoundingCircle(PLAYER_RADIUS, this.x, this.y);
        this.lastShot = 0;


        this.xVelocity = 0; //Change in X between ticks.
        this.yVelocity = 0; //Change in Y between ticks.

        this.angle;         //Direction player points in, 0 is straight up...?
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
        myCtx.rotate (this.angle);
        myCtx.translate (-(PGW_CENTER), -(PGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.arc(this.xCenter, this.yCenter, PLAYER_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();

    }

    /*
    Update player's state.
    */
    update() {
        //TODO Get final player graphic so we can do a proper check on edges.
        this.moveHandle();
        this.rotateHandle();
        this.updateBoundingCircle();
        this.lastShot += this.game.clockTick;

        //If mouse exists, is down, and shot not on cooldown, fire.
        if (this.game.mousedown && this.game.mouse && this.lastShot > PLAYER_FIRING_COOLDOWN) {
            this.shoot(this.game.mouse);
            this.lastShot = 0;
            this.game.click = false;
        }

    }

    /*
    Create a bullet given the location of the last click.

    This creates a new Bullet object using the Player's X and Y,
    and the X and Y coordinates of the last click. Please see
    bullet.js for more information.
    */
    shoot(click){
        this.game.addEntity(new Bullet(this.game,
                                      (this.x + PGW_CENTER), 
                                      (this.y +PGH_CENTER), click.x, click.y));
        
        //this.bullets.push(new Bullet(this.game, this.x + 12, this.y));
    }

    /*
    Control player's movement.

    The player's movement is velocity based - it rapidly approaches a cap.
    This is to give "flow" of movement.
    */
    moveHandle() {
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
        /*if (this.x < 0 || this.x > 650) {
            this.xVelocity = 0;
        }*/
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > 650) {
            this.x = 650;
        }

        this.y += this.yVelocity; 
        /*if (this.y < 0 || this.y > 650) {
            this.yVelocity = 0;
        }*/
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > 650) {
            this.y = 650;
        }
        //Calculate friction.

        this.x *= PLAYER_FRICTION;
        this.y *= PLAYER_FRICTION;

        this.updateCenter();
    }

    /*
    Update the player's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + PGW_CENTER;
        this.yCenter = this.y + PGH_CENTER;
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

    /*
    Handles the bounding circle.

    This should check if the player is colliding with anything of note.
    In the Player's case, this is primarily interested in Dodger rounds and enemies.
    */
   updateBoundingCircle() {
        this.BoundingCircle = new BoundingCircle(PLAYER_RADIUS, this.x, this.y);
   }
}