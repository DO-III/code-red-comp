/*
Chasers pursue the player relentlessly with some concept of velocity.

They move stictly towards the player taking the most direct route possible.
*/

const CHASER_WIDTH = 30; //Should match graphic in final.
const CHASER_HEIGHT = 30; //Should match graphic in final.

const CGW_CENTER = CHASER_WIDTH / 2; //Measures center of graphic, x-value.
const CGH_CENTER = CHASER_HEIGHT / 2; //Center of graphic, y-value.

const CHASER_RADIUS = 10; //Size of Chaser bounding circle.
const CHASER_MOVE_RATE = 12.5; //Speed at which Chaser moves.
const CHASER_FRICTION = 0.97; //Rate at which Chaser loses speed. Lower = slower.


class Chaser {
    constructor(game) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/chaser.png"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);
        console.log(this.player);

        this.x = 100;
        this.y = 100;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(CHASER_RADIUS, this.xCenter, this.yCenter);



        this.playerX = 0;
        this.playerY = 0;
        

    }
    
    draw(ctx) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = CHASER_WIDTH;
        myCanvas.height = CHASER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (CGW_CENTER, CGH_CENTER); //This should go to the center of the object.
        this.angle = this.rotateHandle();
        myCtx.rotate (this.angle);
        myCtx.translate (-(CGW_CENTER), -(CGH_CENTER));
        myCtx.drawImage(this.imageAsset, 0, 0);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);

        //Debug to show bounding circle, keep out of final release.
        ctx.beginPath();
        ctx.arc(this.BoundingCircle.xCenter, this.BoundingCircle.yCenter, CHASER_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    update() {
        
        //Get player's location.
        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;
        //Get current location.
        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;
        this.dX *= CHASER_FRICTION;
        this.dY *= CHASER_FRICTION;
        this.updateCenter();
        
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
    Update the Chaser's center.

    For the bounding circle.
    */
    updateCenter() {
        this.xCenter = this.x + CGW_CENTER;
        this.yCenter = this.y + CGH_CENTER;
        this.BoundingCircle = new BoundingCircle(CHASER_RADIUS, this.xCenter, this.yCenter);
    }

    /*
    Calculate the vector that will be used to move the bullets.

    Accomplished through the magic of polar coordinates.
    */
    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = CHASER_MOVE_RATE * this.game.clockTick;
        console.log(this.game.clockTick);

        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }

    rotateHandle() {
        if (this.player == null) {
            return(0); //If player doesn't exist, don't rotate.
        }

        var dx = (this.playerX) - (this.x + CGW_CENTER); //Accounting for difference in center of thing.
        var dy = (this.playerY) - (this.y + CGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
    }

}