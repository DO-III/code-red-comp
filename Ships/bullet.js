//Concept of a bullet.
//Could be subclassed as "PlayerBullet" and "DodgerBullet"...

const BG_WIDTH = 10;
const BG_HEIGHT = 10;

const BGW_CENTER = BG_WIDTH / 2;
const BGH_CENTER = BG_HEIGHT / 2;

const BULLET_ASSET = ASSET_MANAGER.getAsset("./Ships/gfx/bullet.png");
const BULLET_SPEED = 12;


class Bullet {
    constructor(game, x, y, mouseX, mouseY) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Bullet.png");
        this.x = x; //X location
        this.y = y; //Y location

        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.angle; //Angle to move in.
        this.dX;
        this.dY;
        this.calcDXandDY(this.x, this.mouseX, this.y, this.mouseY);

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
        myCtx.drawImage(BULLET_ASSET, 0, 0);
        myCtx.restore();



        ctx.drawImage(myCanvas, this.x, this.y);
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

        //Ugly canvas size hardcode to remove.
        if(this.x < 0 || this.x > 600 || this.y < 0 || this.y > 600) {
            this.removeFromWorld = true;
        }
    }
}