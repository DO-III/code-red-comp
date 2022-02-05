//Concept of a bullet.
//Could be subclassed as "PlayerBullet" and "DodgerBullet"...


const BG_WIDTH = 20;
const BG_HEIGHT = 20;

const BGW_CENTER = BG_WIDTH / 2;
const BGH_CENTER = BG_HEIGHT / 2;

const BULLET_ASSET = ASSET_MANAGER.getAsset("./Ships/gfx/Bullet.svg");
const BULLET_SPEED = 7.5;

const BULLET_RADIUS = 3;

//const BulletUtils = new GameConstants();


class Bullet {
    constructor(game, x, y, mouseX, mouseY) {
        //Initialize element.
        this.game = game;
        this.x = x; //X location
        this.y = y; //Y location
        this.xCenter = 0;
        this.yCenter = 0;

        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.angle; //Angle to move in.
        this.dX;
        this.dY;
        this.calcDXandDY(this.x, this.mouseX, this.y, this.mouseY);

        this.BoundingCircle = (new BoundingCircle(BULLET_RADIUS, this.xCenter, this.yCenter));

    }

    /*
    Calculate the vector that will be used to move the bullets.

    Accomplished through the magic of polar coordinates.
    */
    calcDXandDY(p1X, p2X, p1Y, p2Y) {
        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX = Math.cos(this.angle) * BULLET_SPEED;
        this.dY = Math.sin(this.angle) * BULLET_SPEED;

    }
    
    /*
    Draw the bullet on the canvas.

    The bullet should be rotated to match its current direction.
    */
    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = BG_WIDTH;
        myCanvas.height = BG_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (BGW_CENTER, BGH_CENTER); //This should go to the center of the object.
        myCtx.rotate (this.angle + (Math.PI) / 2);
        myCtx.translate (-(BGW_CENTER), -(BGH_CENTER));
        myCtx.drawImage(BULLET_ASSET, 2, 5);
        myCtx.restore();



        ctx.drawImage(myCanvas, this.x, this.y);
        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, BULLET_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
    }

    /*
    Updates the current condition of the bullet.

    If the bullet collides with an enemy or leaves the screen, it should be deleted.

    Otherwise, it should continue to travel in a straight line
    in the direction it was fired.
    */
    update() {
        this.x += this.dX;
        this.y += this.dY;
        this.updateCenter();

        //Ugly canvas size hardcode to remove.
        if(this.xCenter < 0 || this.xCenter > GAME_WORLD_WIDTH || 
            this.yCenter < 0 || this.yCenter > GAME_WORLD_HEIGHT) {
            this.removeFromWorld = true;
            console.log('yeet');
        }
    }

    /*
    Update the center of this object and its bounding box.
    */
    updateCenter() {
        this.xCenter = this.x + BGW_CENTER;
        this.yCenter = this.y + BGH_CENTER;
        this.BoundingCircle = new BoundingCircle(BULLET_RADIUS, this.xCenter, this.yCenter);
    }
}