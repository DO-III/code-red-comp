/*
Wanderers... wander.
*/

const WANDERER_WIDTH = 38; //Should match graphic in final.
const WANDERER_HEIGHT = 30; //Should match graphic in final.

const WGW_CENTER = WANDERER_WIDTH / 2; //Measures center of graphic, x-value.
const WGH_CENTER = WANDERER_HEIGHT / 2; //Center of graphic, y-value.

const WANDERER_RADIUS = 10; //Size of Wanderer bounding circle.
const WANDERER_MOVE_RATE = 0.25; //Speed at which Wanderer moves.
const WANDERER_FRICTION = 1; //Rate at which Chaser loses speed. Lower = slower.


class Wanderer {
    constructor(game) {
        //Initialize element.
        this.myGame = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/wanderer.png"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);
        console.log(this.player);

        this.x = 100;
        this.y = 100;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(CHASER_RADIUS, this.x, this.y);



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
        ctx.arc(this.xCenter, this.yCenter, CHASER_RADIUS, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    update() {
        //Get player's location.
        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;
        //Get current location.
        this.updateCenter();
        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;
        this.x *= CHASER_FRICTION;
        this.y *= CHASER_FRICTION;



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
    }

    /*
    Calculate the vector that will be used to move the bullets.

    Accomplished through the magic of polar coordinates.
    */
    calcMovement(p1X, p2X, p1Y, p2Y) {
        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * CHASER_MOVE_RATE;
        this.dY += Math.sin(this.angle) * CHASER_MOVE_RATE;
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