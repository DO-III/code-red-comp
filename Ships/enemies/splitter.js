const SPLITTER_WIDTH = 75; //Should match graphic in final.
const SPLITTER_HEIGHT = 75; //Should match graphic in final.

const SGW_CENTER = SPLITTER_WIDTH / 2; //Measures center of graphic, x-value.
const SGH_CENTER = SPLITTER_HEIGHT / 2; //Center of graphic, y-value.

const SPLITTER_RADIUS = 17.5; //Size of Splitter bounding circle.
const SPLITTER_MOVE_RATE = 10.5; //Speed at which Splitter moves.
const SPLITTER_FRICTION = 0.5; //Rate at which Splitter loses speed. Lower = slower.

const SPLITTER_SHOOT_RATE = 1; // Controls the time between the Dodger's shots.


class Splitter {
    constructor(game) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Chaser.svg"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);
        console.log(this.player);

        this.x = 10;
        this.y = 100;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(SPLITTER_RADIUS, this.xCenter, this.yCenter);



        this.playerX = 0;
        this.playerY = 0;
        this.lastShot = 0;

    }

    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = SPLITTER_WIDTH;
        myCanvas.height = SPLITTER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (SGW_CENTER, SGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate (this.angle);
        myCtx.translate (-(SGW_CENTER), -(SGH_CENTER));
        myCtx.drawImage(this.imageAsset, 12, 12);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, SPLITTER_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
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
        this.dX *= SPLITTER_FRICTION;
        this.dY *= SPLITTER_FRICTION;
        this.edgeDetect();
        this.updateCenter();
        
        this.lastShot += this.game.clockTick;
        //If mouse exists, is down, and shot not on cooldown, fire.
        if (!this.dead && this.lastShot > SPLITTER_SHOOT_RATE) {
            this.shoot();
            this.lastShot = 0;
        }

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
        this.xCenter = this.x + SGW_CENTER;
        this.yCenter = this.y + SGH_CENTER;
        this.BoundingCircle = new BoundingCircle(SPLITTER_RADIUS, this.xCenter, this.yCenter);
    }

    shoot() {
        this.game.addEntity(new Bullet(this.game,(this.xCenter - 10),(this.yCenter - 10), this.player.xCenter-5, this.player.yCenter-5 , "Enemy",-3));
        this.game.addEntity(new Bullet(this.game,(this.xCenter - 10),(this.yCenter - 10), this.player.xCenter, this.player.yCenter , "Enemy",-2));
        this.game.addEntity(new Bullet(this.game,(this.xCenter - 10),(this.yCenter - 10), this.player.xCenter+5, this.player.yCenter+5 , "Enemy",-1));
    }

    /*
    Calculate the vector that will be used to move the bullets.

    Accomplished through the magic of polar coordinates.
    */
    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = SPLITTER_MOVE_RATE * this.game.clockTick;

        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }

    rotateHandle() {
        if (this.player == null) {
            return(0); //If player doesn't exist, don't rotate.
        }

        var dx = (this.playerX) - (this.x + SGW_CENTER); //Accounting for difference in center of thing.
        var dy = (this.playerY) - (this.y + SGH_CENTER);

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
                && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
                entity.removeFromWorld = true;  
                that.game.addEntity(new Score(that.game, that.xCenter, that.yCenter, 50, 'red'));
                WaveManager.activeEnemies--;
                that.removeFromWorld = true;
            }
        })
    }

    collideLeft() {  
        return((this.xCenter - SPLITTER_RADIUS) < 0)
    }

    collideRight() {
        return((this.xCenter + SPLITTER_RADIUS) > GAME_WORLD_WIDTH)
    }

    collideUp() {
        return((this.yCenter - SPLITTER_RADIUS) < 0)
    }

    collideDown() {
        return((this.yCenter + SPLITTER_RADIUS) > GAME_WORLD_HEIGHT)
    }

    edgeDetect() {
        if(this.collideLeft() || this.collideRight()) {
            this.x += (this.collideLeft() ? 1 : -1);
            this.dX *= -0.1;
        }

        if(this.collideUp() || this.collideDown()) {
            this.dY *= -0.1;
        }
    }

}