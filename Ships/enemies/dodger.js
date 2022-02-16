/*
Dodgers are aggressive pink ships that run from the player's shots,
firing back as they go.

They also stop within range of the player, providing an interesting challenge.

Use them sparingly as they are exceptionally dangerous.

Credit to Sidise Tasisa for the "detecting player and bullet" logic.
*/
const DODGER_WIDTH = 50; //Should match graphic in final.
const DODGER_HEIGHT = 50; //Should match graphic in final.

const DGW_CENTER = DODGER_WIDTH / 2; //Measures center of graphic, x-value.
const DGH_CENTER = DODGER_HEIGHT / 2; //Center of graphic, y-value.

const DODGER_RADIUS = 20; //Size of Dodger bounding circle.
const DODGER_DETECT_RADIUS = DODGER_RADIUS * 3; //Size of detection range.
const DODGER_MOVE_RATE = 20; //Speed at which Dodger moves.
const DODGER_FRICTION = 0.9; //Rate at which Dodger loses speed. Lower = slower.
const DODGER_DISTANCE_FROM_PLAYER = 200; // Min distance Away from PLayer

const DODGER_SHOOT_RATE = 1; // Controls the time between the Dodger's shots.

class Dodger {
    constructor(game, point) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Dodger.svg");
        this.player = this.fetchPlayer(game);

        this.x = point.x;
        this.y = point.y;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(DODGER_RADIUS, this.xCenter, this.yCenter);
        this.BulletBoundingCircle = new BoundingCircle(DODGER_DETECT_RADIUS, this.xCenter, this.yCenter);
        console.log(this.BulletBoundingCircle);

        this.playerX = 0;
        this.playerY = 0;

        this.lastShot = 0;
    }

    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = DODGER_WIDTH;
        myCanvas.height = DODGER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate(DGW_CENTER, DGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate(this.angle);
        myCtx.translate(-(DGW_CENTER), -(DGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, DODGER_RADIUS, 0, 2 * Math.PI, false);
        ctx.arc(this.BulletBoundingCircle.xCenter, this.BulletBoundingCircle.yCenter, DODGER_DETECT_RADIUS, 0, 2 * Math.PI, false);
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
        this.dX *= DODGER_FRICTION;
        this.dY *= DODGER_FRICTION;
        this.edgeDetection();
        //Get current location.
        this.updateCenter();
        this.bulletDetection();

        //this.edgeDetect();
        this.lastShot += this.game.clockTick;

        //If mouse exists, is down, and shot not on cooldown, fire.
        if (!this.dead && this.lastShot > DODGER_SHOOT_RATE) {
            this.shoot();
            this.lastShot = 0;
        }
    }


    /*
    Update the Dodger's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + DGW_CENTER;
        this.yCenter = this.y + DGH_CENTER;
        this.BoundingCircle = new BoundingCircle(DODGER_RADIUS, this.xCenter, this.yCenter);
        this.BulletBoundingCircle = new BoundingCircle(DODGER_DETECT_RADIUS, this.xCenter, this.yCenter);
    }

    rotateHandle() {
        if (this.player == null) {
            return (0); //If player doesn't exist, don't rotate.
        }

        var dx = (this.playerX) - (this.x + DGW_CENTER); //Accounting for difference in center of thing.
        var dy = (this.playerY) - (this.y + DGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
    }

    shoot() {
        this.game.addEntity(new Bullet(this.game,
            (this.xCenter - 10),
            (this.yCenter - 10), this.player.xCenter-10, this.player.yCenter-10 , "Enemy"));
    }

    collideLeft() {
        return ((this.xCenter - DODGER_RADIUS) < 0)
    }

    collideRight() {
        return ((this.xCenter + DODGER_RADIUS) > GAME_WORLD_WIDTH)
    }

    collideUp() {
        return ((this.yCenter - DODGER_RADIUS) < 0)
    }

    collideDown() {
        return ((this.yCenter + DODGER_RADIUS) > GAME_WORLD_HEIGHT)
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
                && (entity.parent == "PlayerShip") 
                && that.BulletBoundingCircle.collide(entity.BoundingCircle)) {

                //If we're here, we're threatened by a bullet and must react.
                //First, get the x and y location of the bullet.
                var bullX = entity.xCenter;
                var bullY = entity.yCenter;
                //Now we want to push ourselves *away*.
                //We take a function of the inverse of the distance, and move away.
                let effectiveMoveRate = DODGER_MOVE_RATE * that.game.clockTick;
                //Note that the angle is used to move away from the shot, with some variance.
                //Dodgers are menacing.
                let angle = (-1 + Math.random(1) * -1) / Math.atan2(that.yCenter - bullY, that.xCenter - bullX);
                that.dX += (Math.cos(angle) * effectiveMoveRate) * -9;
                that.dY += (Math.sin(angle) * effectiveMoveRate) * -9;
            }
        })
    }

    /*
    Calculate the vector that will be used to move the Dodger.

    This is much simpler than others.
    */

    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = DODGER_MOVE_RATE * this.game.clockTick;
        var distance = Math.sqrt(Math.pow((p2Y - p1Y), 2) + Math.pow((p2X - p1X), 2));
        if (distance > DODGER_DISTANCE_FROM_PLAYER) {
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
                && (entity.parent == "PlayerShip") && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
                entity.removeFromWorld = true;
                that.game.addEntity(new Score(that.game, that.xCenter, that.yCenter, 100, 'fuchsia'));
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
        while (typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return (foundPlayer);
    }
}