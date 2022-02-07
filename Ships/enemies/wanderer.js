/*
Wanderers... wander.
*/

const WANDERER_WIDTH = 50; //Should match graphic in final.
const WANDERER_HEIGHT = 50; //Should match graphic in final.

const WGW_CENTER = WANDERER_WIDTH / 2; //Measures center of graphic, x-value.
const WGH_CENTER = WANDERER_HEIGHT / 2; //Center of graphic, y-value.

const WANDERER_RADIUS = 20; //Size of Wanderer bounding circle.
const WANDERER_MOVE_RATE = 2.5; //Speed at which Wanderer moves.
const WANDERER_FRICTION = 1; //Rate at which Chaser loses speed. Lower = slower.
const TIME_TO_SHOOT = .5;

class Wanderer {
    constructor(game,player) {
        //Initialize element.
        this.game = game;
        this.player = player;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/wanderer.png"); //Messy hardcode, fix later.

        this.x = 200;
        this.y = 200;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(WANDERER_RADIUS, this.xCenter, this.yCenter);
        this.lastShoot = 0;
        //Pick a random direction and start moving.
        this.angle = this.rotateHandle();
        this.calcMovement();


    }

    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = WANDERER_WIDTH;
        myCanvas.height = WANDERER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate(WGW_CENTER, WGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate (this.angle);
        myCtx.translate(-(WGW_CENTER), -(WGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, WANDERER_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    update() {
        //Get current location.
        this.updateCenter();
        this.updateDirection();
        this.rotateHandle();
        this.lastShoot += this.game.clockTick;

        if(TIME_TO_SHOOT < this.lastShoot)
        {
            this.shoot();
            this.lastShoot = 0;
        }
        this.x += this.dX;
        this.y += this.dY;
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

    shoot() {
        this.game.addEntity(new Bullet(this.game,
            (this.x + WGW_CENTER),
            (this.y + WGH_CENTER), player.x,player.y));
    }

    collideLeft() {
        return ((this.xCenter - WANDERER_RADIUS) < 0)
    }

    collideRight() {
        return ((this.xCenter + WANDERER_RADIUS) > 600)
    }

    collideUp() {
        return ((this.yCenter - WANDERER_RADIUS) < 0)
    }

    collideDown() {
        return ((this.yCenter + WANDERER_RADIUS) > 600)
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
        // this.rotate();

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

    rotateHandle() {
        if (this.player == null) {
            return(0); //If mouse isn't defined yet, don't try to rotate.
                       //I know this is gross, bear with me.
        }

        var dx = (this.player.x) - (this.x + WGW_CENTER); //Accounting for difference in center of thing.
        var dy = (this.player.y) - (this.y + WGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
    }

}