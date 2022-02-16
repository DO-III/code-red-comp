/*
Wanderers... wander.
*/
//TODO: Move all this to new class; rename and refactor all constants appropriately.
const WANDERER_WIDTH = 50; //Should match graphic in final.
const WANDERER_HEIGHT = 50; //Should match graphic in final.

const WGW_CENTER = WANDERER_WIDTH / 2; //Measures center of graphic, x-value.
const WGH_CENTER = WANDERER_HEIGHT / 2; //Center of graphic, y-value.

const WANDERER_RADIUS = 20; //Size of Wanderer bounding circle.
const WANDERER_DETECT_RADIUS = WANDERER_RADIUS * 3; //Size of detection range.
const WANDERER_MOVE_RATE = 20; //Speed at which Wanderer moves.
const WANDERER_FRICTION = 0.9; //Rate at which Chaser loses speed. Lower = slower.
const WANDERER_DISTANCE_FROM_PLAYER = 200; // Min distance Away from PLayer

const WANDERER_SHOOT_RATE = 1; // Shoot Rate 

class Wanderer {
    constructor(game) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Wanderer.svg"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);

        this.x = 200;
        this.y = 200;
        this.dX = 0;
        this.dY = 0;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(WANDERER_RADIUS, this.xCenter, this.yCenter);
        this.BulletBoundingCircle = new BoundingCircle(WANDERER_DETECT_RADIUS, this.xCenter, this.yCenter);
        console.log(this.BulletBoundingCircle);

        this.playerX = 0;
        this.playerY = 0;

        this.lastShot = 0;
    }

    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = WANDERER_WIDTH;
        myCanvas.height = WANDERER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate(WGW_CENTER, WGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate(this.angle);
        myCtx.translate(-(WGW_CENTER), -(WGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, WANDERER_RADIUS, 0, 2 * Math.PI, false);
        ctx.arc(this.BulletBoundingCircle.xCenter, this.BulletBoundingCircle.yCenter, WANDERER_DETECT_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    update() {
        //First off, have we been shot?
        this.checkIfShot();
        //Is the player dead?
        if (this.player.dead) {
            this.removeFromWorld = true;
        }
        //Get player's location.
        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;
        //Get current location.
        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;
        this.dX *= WANDERER_FRICTION;
        this.dY *= WANDERER_FRICTION;
        this.edgeDetection();
        //Get current location.
        this.updateCenter();
        this.bulletDetection();

        //this.edgeDetect();
        this.lastShot += this.game.clockTick;

        //If mouse exists, is down, and shot not on cooldown, fire.
        if (!this.dead && this.lastShot > WANDERER_SHOOT_RATE) {
            this.shoot();
            this.lastShot = 0;
        }
    }


    /*
    Update the Wanderer's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + WGW_CENTER;
        this.yCenter = this.y + WGH_CENTER;
        this.BoundingCircle = new BoundingCircle(WANDERER_RADIUS, this.xCenter, this.yCenter);
        this.BulletBoundingCircle = new BoundingCircle(WANDERER_DETECT_RADIUS, this.xCenter, this.yCenter);
    }

    rotateHandle() {
        if (this.player == null) {
            return (0); //If player doesn't exist, don't rotate.
        }

        var dx = (this.playerX) - (this.x + WGW_CENTER); //Accounting for difference in center of thing.
        var dy = (this.playerY) - (this.y + WGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
    }

    shoot() {
        this.game.addEntity(new Bullet(this.game,
            (this.xCenter - 10),
            (this.yCenter - 10), this.player.xCenter-10, this.player.yCenter-10 , "Enemy"));
    }

    collideLeft() {
        return ((this.xCenter - WANDERER_RADIUS) < 0)
    }

    collideRight() {
        return ((this.xCenter + WANDERER_RADIUS) > GAME_WORLD_WIDTH)
    }

    collideUp() {
        return ((this.yCenter - WANDERER_RADIUS) < 0)
    }

    collideDown() {
        return ((this.yCenter + WANDERER_RADIUS) > GAME_WORLD_HEIGHT)
    }

    edgeDetection() {
        // collision with left or right walls
        if (this.collideLeft() || this.collideRight()) {
            this.x = (this.collideLeft() ? 1 : GAME_WORLD_WIDTH - 50);
            this.dX *= -1;
        }

        if (this.collideUp() || this.collideDown()) {
            this.y = (this.collideUp() ? 1 : GAME_WORLD_HEIGHT - 50);
            this.dY *= -1;
        }
    }

    bulletDetection() {
        var that = this;
        /* Checing If Bullet Collide with bullet bounding circle*/
        this.game.entities.forEach(function (entity) {
            if (!(typeof entity.BoundingCircle === 'undefined') && (entity instanceof Bullet)
                && (entity.parent == "Player") 
                && that.BulletBoundingCircle.collide(entity.BoundingCircle)) {

                //If we're here, we're threatened by a bullet and must react.
                //First, get the x and y location of the bullet.
                var bullX = entity.xCenter;
                var bullY = entity.yCenter;
                //Now we want to push ourselves *away*.
                //We take a function of the inverse of the distance, and move away.
                let effectiveMoveRate = WANDERER_MOVE_RATE * that.game.clockTick;
                //Note that the angle is used to move away from the shot, with some variance.
                //Dodgers are menacing.
                let angle = (-1 + Math.random(1) * -1) / Math.atan2(that.yCenter - bullY, that.xCenter - bullX);
                that.dX += (Math.cos(angle) * effectiveMoveRate) * -9;
                that.dY += (Math.sin(angle) * effectiveMoveRate) * -9;
            }
        })
    }

    /*
    Calculate the vector that will be used to move the Wanderer.

    This is much simpler than others.
    */

    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = WANDERER_MOVE_RATE * this.game.clockTick;
        var distance = Math.sqrt(Math.pow((p2Y - p1Y), 2) + Math.pow((p2X - p1X), 2));
        if (distance > WANDERER_DISTANCE_FROM_PLAYER) {
            this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
            this.dX += (Math.cos(this.angle) * effectiveMoveRate);
            this.dY += (Math.sin(this.angle) * effectiveMoveRate);
        }
    }

    calcDistance(p1X, p2X, p1Y, p2Y) {
        return Math.sqrt(Math.pow((p2Y - p1Y), 2) + Math.pow((p2X - p1X), 2));
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
            if (!(typeof entity.BoundingCircle === 'undefined') && (entity instanceof Bullet)
                && (entity.parent == "Player") && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
                entity.removeFromWorld = true;
                that.removeFromWorld = true;
            }
        })
    }

    /*
Fetch the player reference from the game manager.
*/
    fetchPlayer(game) {
        var foundPlayer;
        while (typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return (foundPlayer);
    }
}