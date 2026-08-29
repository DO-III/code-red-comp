/*
Shared behavior for enemies that drift in a direction without actively chasing

the player.

This layer centralizes the movement and turning logic for simple roamers while
keeping their individual scoring, collision, and special behavior in each
concrete subclass.
*/
class WanderingEnemy extends AbstractEnemy {
    constructor(game, point, config) {
        super(game, point, config);

        this.angle = Math.random() * Math.PI * 2;
        this.calcMovement();
    }

    /*
    Update the enemy's wandering movement.
    */
    updateWandering() {
        this.handlePlayerDeath();

        this.updateCenter();
        this.updateDirection();
        this.x += this.dX * this.game.clockTick;
        this.y += this.dY * this.game.clockTick;
    }

    /*
    Apply a wall bounce and keep the sprite facing the travel direction.
    */
    updateDirection() {
        if (this.collideLeft() || this.collideRight()) {
            this.dX *= -1;
        }

        if (this.collideUp() || this.collideDown()) {
            this.dY *= -1;
        }

        this.angle = this.rotateFromVelocity();
    }

    /*
    Set the velocity using the current heading.
    */
    calcMovement() {
        this.dX += Math.cos(this.angle) * this.moveRate;
        this.dY += Math.sin(this.angle) * this.moveRate;
    }

    /*
    Convert velocity into a rotation for rendering.
    */
    rotateFromVelocity() {
        return (Math.atan2(this.dY, this.dX) + (Math.PI / 2));
    }
}
