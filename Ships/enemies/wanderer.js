/*
Wanderers... wander.
*/

const WANDERER_WIDTH = 50; //Should match graphic in final.
const WANDERER_HEIGHT = 50; //Should match graphic in final.

const WGW_CENTER = WANDERER_WIDTH / 2; //Measures center of graphic, x-value.
const WGH_CENTER = WANDERER_HEIGHT / 2; //Center of graphic, y-value.

const WANDERER_RADIUS = 20; //Size of Wanderer bounding circle.
const WANDERER_MOVE_RATE = 200; //Speed at which Wanderer moves.
const WANDERER_FRICTION = 1; //Rate at which Chaser loses speed. Lower = slower.


class Wanderer {
    constructor(game, point) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Wanderer.svg"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);
        this.wave = this.fetchWave(game);

        this.x = point.x;
        this.y = point.y;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(WANDERER_RADIUS, this.xCenter, this.yCenter);


        //Pick a random direction and start moving.
        this.angle = Math.random() * Math.PI * 2; //Random angle.
        this.calcMovement();
        
        
        

    }
    
    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = WANDERER_WIDTH;
        myCanvas.height = WANDERER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (WGW_CENTER, WGH_CENTER); //This should go to the center of the object.
        myCtx.rotate (this.angle );
        myCtx.translate (-(WGW_CENTER), -(WGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        /*
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, WANDERER_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
        */
    }

    update() {
        //First off, have we been shot?
        this.checkIfShot();
        //Is the player dead?
        if(this.player.dead) {
            this.removeFromWorld = true;
        }

        //Get current location.
        //this.calcMovement();
        this.updateCenter();
        this.updateDirection();
        
        this.x += this.dX * this.game.clockTick;
        this.y += this.dY * this.game.clockTick;
        
    }

    /*
    Update the Wanderer's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + WGW_CENTER;
        this.yCenter = this.y + WGH_CENTER;
        this.BoundingCircle = new BoundingCircle(WANDERER_RADIUS, this.xCenter, this.yCenter);
    }

    collideLeft() {
        return((this.xCenter - WANDERER_RADIUS) < 0)
    }

    collideRight() {
        return((this.xCenter + WANDERER_RADIUS) > GAME_WORLD_WIDTH)
    }

    collideUp() {
        return((this.yCenter - WANDERER_RADIUS) < 0)
    }

    collideDown() {
        return((this.yCenter + WANDERER_RADIUS) > GAME_WORLD_HEIGHT)
    }

    updateDirection() {
        // collision with left or right walls
        if (this.collideLeft() || this.collideRight()) {
            this.dX *= -1;
            
        }
        
        // collision with top or bottom walls
        if (this.collideUp() || this.collideDown()) {
            this.dY *= -1;
        }
        this.rotate();
        
    }



    /*
    Calculate the vector that will be used to move the Wanderer.

    This is much simpler than others.
    */
    calcMovement() {
        

        this.dX += Math.cos(this.angle) * WANDERER_MOVE_RATE;
        this.dY += Math.sin(this.angle) * WANDERER_MOVE_RATE;

        
    }

    rotate() {
        this.angle = (Math.atan2(this.dY, this.dX) + (Math.PI / 2));
    }

    /*
    Has this enemy been shot?
    
    If so, this enemy is removed from the game world.
    */
    checkIfShot() {
        var that = this;
    
        this.game.entities.forEach(function (entity) {
            /*
            Check if thing has bounding circle.
            If so, make sure it's not the player.
            If that's true, actually detect collision.
            */
            if(!(typeof entity.BoundingCircle === 'undefined') && (entity instanceof Bullet && entity.parent == "PlayerShip")
              && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
                entity.removeFromWorld = true;  
                that.game.addEntity(new Score(that.game, that.xCenter, that.yCenter, 25, 'cyan'));
                WaveManager.activeEnemies--;
                that.removeFromWorld = true;
            }
        })
    }

    /*
    Fetch the player reference from the game manager.
    */
    fetchPlayer(game) {
        var foundPlayer;
        while(typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return(foundPlayer);
    }

    /*
    Fetch the wave manager.
    */
    fetchWave(game) {
        var foundWave;
        while(typeof foundWave === 'undefined') {
            foundWave = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return(foundWave);
    }

}