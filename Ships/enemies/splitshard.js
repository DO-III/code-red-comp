const SHARD_WIDTH = 75; //Should match graphic in final.
const SHARD_HEIGHT = 75; //Should match graphic in final.

const ShGW_CENTER = SHARD_WIDTH / 2; //Measures center of graphic, x-value.
const ShGH_CENTER = SHARD_HEIGHT / 2; //Center of graphic, y-value.

const SHARD_RADIUS = 15; //Size of Splitter bounding circle.
const SHARD_MOVE_RATE = 7.5; //Speed at which Splitter moves.
const SHARD_FRICTION = 0.999; //Rate at which Splitter loses speed. Lower = slower.

/* 
Splitter Shards are fast enemies that spawn from Splitters.

They are reckless and charge quickly.
*/
class SplitterShard {
    constructor(game, point) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/SplitterShard.svg"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);
        console.log(this.player);

        this.x = point.x;
        this.y = point.y;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(SHARD_RADIUS, this.xCenter, this.yCenter);


        this.spawnMovement();
        this.playerX = 0;
        this.playerY = 0;
        this.lastShot = 0;
        WaveManager.activeEnemies++;

    }

    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = SHARD_WIDTH;
        myCanvas.height = SHARD_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (ShGW_CENTER, ShGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate (this.angle);
        myCtx.translate (-(ShGW_CENTER), -(ShGW_CENTER));
        myCtx.drawImage(this.imageAsset, 12, 12);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        /*
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, SHARD_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
        */
    }

    update() {

        //First - have we been shot?
        this.checkIfShot();

        //Is the player dead?
        if(this.player.dead) {
            this.removeFromWorld = true;
        }
        
        //Get player's location.
        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;
        //Get current location.
        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;
        this.dX *= SHARD_FRICTION;
        this.dY *= SHARD_FRICTION;
        this.edgeDetect();
        this.updateCenter();
        
        this.lastShot += this.game.clockTick;

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
    Update the Splitter's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + ShGW_CENTER;
        this.yCenter = this.y + ShGH_CENTER;
        this.BoundingCircle = new BoundingCircle(SHARD_RADIUS, this.xCenter, this.yCenter);
    }

    /*
    Generate a random direction to move in.
    
    This is used specifically when the Shard spawns.
    */
    spawnMovement() {
        let effectiveMoveRate = SHARD_MOVE_RATE * this.game.clockTick;

        //Spin for a random direction.
        let toMoveIn = Math.floor(Math.random() * 360);
        toMoveIn *= (Math.PI / 180);

        this.angle = Math.floor(toMoveIn);
        this.dX += Math.cos(this.angle) * effectiveMoveRate * 32.5;
        this.dY += Math.sin(this.angle) * effectiveMoveRate * 32.5;

    }


    /*
    Calculate the vector that will be used to move the bullets.

    Accomplished through the magic of polar coordinates.
    */
    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = SHARD_MOVE_RATE * this.game.clockTick;

        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }

    rotateHandle() {
        if (this.player == null) {
            return(0); //If player doesn't exist, don't rotate.
        }

        var dx = (this.playerX) - (this.x + ShGW_CENTER); //Accounting for difference in center of thing.
        var dy = (this.playerY) - (this.y + ShGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
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
                && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)
                && that.removeFromWorld != true) {
                entity.removeFromWorld = true;  
                that.game.addEntity(new Score(that.game, that.xCenter, that.yCenter, 25, 'yellow'));
                WaveManager.activeEnemies--;
                that.removeFromWorld = true;
            }
        })
    }

    collideLeft() {  
        return((this.xCenter - SHARD_RADIUS) < 0)
    }

    collideRight() {
        return((this.xCenter + SHARD_RADIUS) > GAME_WORLD_WIDTH)
    }

    collideUp() {
        return((this.yCenter - SHARD_RADIUS) < 0)
    }

    collideDown() {
        return((this.yCenter + SHARD_RADIUS) > GAME_WORLD_HEIGHT)
    }

    edgeDetect() {
        if(this.collideLeft() || this.collideRight()) {
            this.x += (this.collideLeft() ? 1 : -1);
            this.dX *= -0.5;
        }

        if(this.collideUp() || this.collideDown()) {
            this.dY *= -0.5;
        }
    }

}