/*
Chasers pursue the player relentlessly with some concept of velocity.

They move strictly toward the player taking the most direct route possible.
*/

const CHASER_WIDTH = 75;
const CHASER_HEIGHT = 75;
const CGW_CENTER = CHASER_WIDTH / 2;
const CGH_CENTER = CHASER_HEIGHT / 2;

const CHASER_RADIUS = 17.5;
const CHASER_MOVE_RATE = 12.5;
const CHASER_FRICTION = 0.97;

class Chaser extends ChasingEnemy {
    constructor(game, point) {
        super(game, point, {
            width: CHASER_WIDTH,
            height: CHASER_HEIGHT,
            radius: CHASER_RADIUS,
            imageAsset: ASSET_MANAGER.getAsset("./Ships/gfx/Chaser.svg"),
            spriteOffsetX: 12,
            spriteOffsetY: 12,
            moveRate: CHASER_MOVE_RATE,
            friction: CHASER_FRICTION
        });
    }

    draw(ctx) {
        this.drawFacingPlayer(ctx);
    }

    update() {
        this.checkIfShot(50, 'red');
        this.updateChasing(CHASER_FRICTION, CHASER_MOVE_RATE);
    }

    edgeDetect() {
        if (this.collideLeft() || this.collideRight()) {
            this.x += (this.collideLeft() ? 1 : -1);
            this.dX *= -0.1;
        }

        if (this.collideUp() || this.collideDown()) {
            this.dY *= -0.1;
        }
    }
}