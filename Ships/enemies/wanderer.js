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


class Wanderer {
    constructor(game) {
        //Initialize element.
        this.myGame = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/wanderer.png"); //Messy hardcode, fix later.

        this.dead = false;
        
        this.x = 200;
        this.y = 200;
        this.dX = 0;
        this.dY = 0;
        this.xCenter = 0;
        this.yCenter = 0;
        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(WANDERER_RADIUS, this.xCenter, this.yCenter);

        //Pick a random direction and start moving.
        this.angle = Math.random() * Math.PI * 2; //Random angle.
        this.calcMovement();
        

    }
    
    draw(ctx) {

        if(this.dead) {
            console.log("Player dead flag raised.");
            this.dead = false;
        }


        var myCanvas = document.createElement('canvas');
        myCanvas.width = WANDERER_WIDTH;
        myCanvas.height = WANDERER_HEIGHT;
        var myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.translate (WGW_CENTER, WGH_CENTER); //This should go to the center of the object.
        myCtx.rotate (this.angle );
        myCtx.translate (-(WGW_CENTER), -(WGH_CENTER));
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
        this.x += this.dX;
        this.y += this.dY;

        this.checkForCollisions();
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

    // collide(other){
    //     return distance(this, other) < WANDERER_RADIUS + other.radius;
    // }

    collideLeft() {
        return((this.xCenter - WANDERER_RADIUS) < 0);
    }

    collideRight() {
        return((this.xCenter + WANDERER_RADIUS) > 600);
    }

    collideUp() {
        return((this.yCenter - WANDERER_RADIUS) < 0);
    }

    collideDown() {
        return((this.yCenter + WANDERER_RADIUS) > 600);
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
        this.rotate();

        //
        // // collision with other ships
        // for(car i = 0; i<this.game.entities.length; i++){
        //     var ent = this.game.entities[i];
        //     if(ent != this && this.collide(ent)){
        //         var dist = distance(this, ent);
        //         var delta = WANDERER_RADIUS + ent.radius - dist;
        //         var difX = (this.x - ent.x) / dist;
        //         var difY = (this.y - ent.y) / dist;
        //
        //         this.x += difX * delta / 2;
        //         this.y += difY * delta / 2;
        //         ent.x -= difX * delta / 2;
        //         ent.y -= difY * delta / 2;
        //     }
        // }
    }

    /*
    Check if the wanderer is colliding with the bullet
    
    */
    
    isCollidingWithBullet(obj) {
        return (this.x + 8 > obj.x && this.y + 8 > obj.y
            && obj.x + 8 > this.x && obj.y + 8 > this.y );
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

    shoot(click){
        this.game.addEntity(new Bullet(this.game,
            (this.x + PGW_CENTER),
            (this.y + PGH_CENTER), click.x, click.y));

        //this.bullets.push(new Bullet(this.game, this.x + 12, this.y));
    }

    // checkForCollisions() {
    //
    //     var that = this;
    //
    //     this.game.entities.forEach(function (entity) {
    //         /*
    //         Check if thing has bounding circle.
    //         If so, make sure it's not the player.
    //         If that's true, actually detect collision.
    //         */
    //         if(!(typeof entity.BoundingCircle === 'undefined') && !(entity instanceof Wanderer)
    //             && entity.BoundingCircle && that.BoundingCircle.collide(entity.BoundingCircle)) {
    //             that.dead = true;
    //         }
    //         /*
    //         else {
    //               that.dead = false
    //         }
    //         */
    //     })
    // }


    checkForCollisionWithBullet(){
        for (var i =0; i < bullets.length; i++) {
            bullets.update();
            for (var j = 0; j < enemies.length; j++) {
                if (bullets.isCollidingWith(enemies)) {
                    that.dead = true;
                }
        }
    }

    // shoot(){
    //     bullets.push(new Bullet(this.game,
    //         (this.x + PGW_CENTER),
    //         (this.y +PGH_CENTER), click.x, click.y));
    // )
    // }
}
