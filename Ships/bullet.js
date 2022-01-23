//Concept of a bullet.
//Could be subclassed as "PlayerBullet" and "DodgerBullet"...

const BULLET_ASSET = ASSET_MANAGER.getAsset("./Ships/gfx/bullet.png");
const BULLET_SPEED = 10;


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
        ctx.drawImage(BULLET_ASSET, this.x, this.y);
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