const PG_WIDTH = 70; //Should match player graphic in final.
const PG_HEIGHT = 70; //Should match player graphic in final.

const PGW_CENTER = PG_WIDTH / 2; //Measures center of player graphic, x-value.
const PGH_CENTER = PG_HEIGHT / 2; //Center of player graphic, y-value.

const PLAYER_MOVE_RATE= 45; //Rate at which player accelerates.
const PLAYER_FRICTION = 0.90; //Rate at which speed decreases. Lower = slower.
const PLAYER_RADIUS = 15; //Radius of player.

const PLAYER_FIRING_COOLDOWN = 0.1; //Rate that player is allowed to fire.

class PlayerShip {

    /*
    Create the PlayerShip object.
    */
    constructor(game) {
        
        this.playerCanDie = true;
        this.dead = true;
        this.drawMe = false;

        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Player.png"); //Messy hardcode, fix later.
        this.explodeAsset = ASSET_MANAGER.getAsset("./Ships/gfx/explosion.svg"); //Messy hardcode, fix later.
        this.deathAnimation = new Animator(this.explodeAsset, 0, 0, 50, 50, 3, 0.1, true);

        this.x = GAME_WORLD_WIDTH / 2 - 40;
        this.y = GAME_WORLD_HEIGHT / 2 - 45;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(PLAYER_RADIUS, this.xCenter, this.yCenter);
        this.lastShot = 0;


        this.xVelocity = 0; //Change in X between ticks.
        this.yVelocity = 0; //Change in Y between ticks.

        this.angle;         //Direction player points in, 0 is straight up...?
    }

    /*
    "Spawns" the player ship by resetting its position.


    */
    spawnPlayer() {
        this.deathAnimation.resetLoops();
        this.drawMe = true;
        this.dead = false;
        this.x = GAME_WORLD_WIDTH / 2 - 40;
        this.y = GAME_WORLD_HEIGHT / 2 - 45;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        
    }

    /*
    Draw the PlayerShip.

    Rotates to point to the cursor.
    */
    draw(ctx) {

        if (this.drawMe) {

        if(this.dead) {
            this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y + 10);
        } else {


        var myCanvas = document.createElement('canvas');
        myCanvas.width = PG_WIDTH;
        myCanvas.height = PG_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (PGW_CENTER, PGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate (this.angle);
        myCtx.translate (-(PGW_CENTER), -(PGH_CENTER));
        myCtx.drawImage(this.imageAsset, 10, 10);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        /*
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, PLAYER_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
        */
        }
        }

    }

    /*
    Update player's state.
    */
    update() {
        console.log(this.deathAnimation.loops());
        //This causes problems with the player being seen again...
        if (this.deathAnimation.loops() > 30) {
            this.drawMe = false;
        }

        this.moveHandle();
        this.rotateHandle();
        this.checkForCollisions();
        //this.edgeDetect();
        this.lastShot += this.game.clockTick;

        //If mouse exists, is down, and shot not on cooldown, fire.
        if (!this.dead && this.game.mousedown && this.game.mouse && this.lastShot > PLAYER_FIRING_COOLDOWN) {
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
                                        (this.xCenter - 10), 
                                        (this.yCenter - 10), click.x - 10, click.y - 10, "PlayerShip"));
        
        //this.bullets.push(new Bullet(this.game, this.x + 12, this.y));
    }

    /*
    Control player's movement.

    The player's movement is velocity based - it rapidly approaches a cap.
    This is to give "flow" of movement.
    */
    moveHandle() {
        //Note: commented code 
        let effectiveMoveRate = PLAYER_MOVE_RATE * this.game.clockTick;

        //Calculate the x velocity.
        //This is found by adding "left" to "right"; if both are pressed, no movement.
        if (!this.dead) {
        this.xVelocity += (
            //Get player's movement in the first place.
            ((this.game.left && !this.collideLeft()) ? (-1 * effectiveMoveRate) : 0 ) 
            + ((this.game.right && !this.collideRight())? effectiveMoveRate : 0 )
        );
        //Repeat for y velocity; bearing in mind that "0" is at the top.
        this.yVelocity += (
            ((this.game.up && !this.collideUp()) ? (-1 * effectiveMoveRate) : 0 ) 
            + ((this.game.down && !this.collideDown()) ? effectiveMoveRate : 0 )
        );
        }

        //Calculate differences and change position according to clock tick.
        //this.x += this.xVelocity * this.game.clockTick;
        //this.y += this.yVelocity * this.game.clockTick;
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        

        //Calculate friction.

        this.xVelocity *= PLAYER_FRICTION;
        this.yVelocity *= PLAYER_FRICTION;

        this.edgeDetect();

        this.updateCenter();
        
    }

    /*
    Update the player's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + PGW_CENTER;
        this.yCenter = this.y + PGH_CENTER;
        this.BoundingCircle = new BoundingCircle(PLAYER_RADIUS, this.xCenter, this.yCenter);
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
    Handle collisions with various objects.

    This should primarily check for collisions with enemies.
    Later, it could be extended to deal with items or whatnot.
    */
    checkForCollisions() {

        var that = this;

        this.game.entities.forEach(function (entity) {
            /*
            Check if thing has bounding circle.
            If so, make sure it's not the player.
            If that's true, actually detect collision.
            */
            if(!(typeof entity.BoundingCircle === 'undefined') && !(entity instanceof PlayerShip || entity instanceof Bullet)
            && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
                that.dead = true;
            }
            //Now check for Dodger rounds
            if(!(typeof entity.BoundingCircle === 'undefined') && (entity instanceof Bullet)
            && entity.BoundingCircle && entity.parent == "Enemy" && that.BoundingCircle.collide(entity.BoundingCircle)) {
                that.dead = true;
            }
        })
    }

    edgeDetect() {
        if(this.collideLeft() || this.collideRight()) {
            this.xVelocity *= -1;
        }

        if(this.collideUp() || this.collideDown()) {
            this.yVelocity *= -1;
        }
    }

    collideLeft() {  
        return((this.xCenter - PLAYER_RADIUS) < 0)
    }

    collideRight() {
        return((this.xCenter + PLAYER_RADIUS) > GAME_WORLD_WIDTH)
    }

    collideUp() {
        return((this.yCenter - PLAYER_RADIUS) < 0)
    }

    collideDown() {
        return((this.yCenter + PLAYER_RADIUS) > GAME_WORLD_HEIGHT)
    }
}