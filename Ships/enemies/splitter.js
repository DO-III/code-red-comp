/*
SPLITTERs pursue the player relentlessly with some concept of velocity.

They move strictly towards the player taking the most direct route possible.
*/

const SPLITTER_WIDTH = 75; //Should match graphic in final.
const SPLITTER_HEIGHT = 75; //Should match graphic in final.

const SGW_CENTER = SPLITTER_WIDTH / 2; //Measures center of graphic, x-value.
const SGH_CENTER = SPLITTER_HEIGHT / 2; //Center of graphic, y-value.

const SPLITTER_RADIUS = 17.5; //Size of SPLITTER bounding circle.
const SPLITTER_MOVE_RATE = 12.5; //Speed at which SPLITTER moves.
const SPLITTER_FRICTION = 0.97; //Rate at which SPLITTER loses speed. Lower = slower.


class Splitter {
    constructor(game) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/splitter.png"); //Messy hardcode, fix later.
        this.player = this.fetchPlayer(game);
        console.log(this.player);

        this.direction = Math.floor((Math.random()) - 0.5) ? -1 : 1;         //random left or right
        this.turnSpeed = 0.1;

        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);

        //
        this.x = 300;
        this.y = 300;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(SPLITTER_RADIUS, this.xCenter, this.yCenter);

        this.calcMovement();

        this.playerX = 0;
        this.playerY = 0;



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

    /*
    Fetch the player reference from the game manager.
    */
    fetchPlayer(game) {
        let foundPlayer;
        while(typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return(foundPlayer);
    }

    // generateX() {
    //     let x = Math.random() * (this.canvas.width - this.sizeX) > 0 ? (Math.random() * this.canvas.width) - this.sizeX : 10;
    //     return x;
    // }

    move() {
        if (this.direction < 0) { //left
            this.x += -this.turnSpeed;
        } else {                  //right
            this.x += this.turnSpeed;
        }
    }

    update() {

        //First - have we been shot?
        this.checkIfShot();

        //Get player's location.
        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;

        this.move();

        //Get current location.
        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;

        this.dX *= SPLITTER_FRICTION;
        this.dY *= SPLITTER_FRICTION;

        this.updateCenter();
    }

    // shoot() {
    //     if ((Math.random() * 100 > this.game.enemyShootProb) && (this.y < this.canvas.height - 250)) {
    //         const bullets = this.theme.bullets;
    //         bullets.forEach(function (bullet) {
    //             this.game.enemyBullets.push(new EnemyBullet(this, bullet));
    //         }.bind(this));
    //     }
    // }

    draw(ctx) {
        const myCanvas = document.createElement('canvas');
        myCanvas.width = SPLITTER_WIDTH;
        myCanvas.height = SPLITTER_HEIGHT;
        const myCtx = myCanvas.getContext('2d');
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

    rotateHandle() {
        if (this.player == null) {
            return(0); //If player doesn't exist, don't rotate.
        }

        const dx = (this.playerX) - (this.x + SGW_CENTER); //Accounting for difference in center of thing.
        const dy = (this.playerY) - (this.y + SGH_CENTER);

        return (Math.atan2(dy, dx) + (Math.PI / 2));
    }

    calcMovement(X1, X2, Y1, Y2) {
        let effectiveMoveRate = SPLITTER_MOVE_RATE * this.game.clockTick;
        console.log(this.game.clockTick);

        this.angle = Math.atan2(Y2 - Y1, X2 - X1);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }

    checkIfShot() {
        const that = this;

        this.game.entities.forEach(function (entity) {
            /*
            Check if thing has bounding circle.
            If so, make sure it's not the player.
            If that's true, actually detect collision.
            */
            if (!(typeof entity.BoundingCircle === 'undefined') && (entity instanceof Bullet)
                && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
                entity.removeFromWorld = true;
                that.removeFromWorld = true;
            }
        })


    }
}