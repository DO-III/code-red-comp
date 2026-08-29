/*
Shared behavior for enemies that actively pursue the player.

This layer handles the common chase logic while leaving each enemy to define
how it reacts to the player, how it bounces off walls, and what score/bonus it
awards on defeat.
*/
class ChasingEnemy extends AbstractEnemy {
    constructor(game, point, config) {
        super(game, point, config);
    }

    /*
    Update the enemy's movement toward the player using a standard acceleration
    pattern, then apply friction and wall constraints.
    */
    updateChasing(friction = this.friction, moveRate = this.moveRate) {
        this.handlePlayerDeath();

        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;

        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY, moveRate);
        this.x += this.dX;
        this.y += this.dY;
        this.dX *= friction;
        this.dY *= friction;
        this.edgeDetect();
        this.updateCenter();
    }

    /*
    Draw this enemy rotated toward the player.
    */
    drawFacingPlayer(ctx) {
        this.angle = this.rotateHandle();
        super.draw(ctx);
    }

    /*
    Accelerate the enemy toward the target point using a standard vector move.
    */
    calcMovement(p1X, p2X, p1Y, p2Y, moveRate = this.moveRate) {
        let effectiveMoveRate = moveRate * this.game.clockTick;

        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }
}
