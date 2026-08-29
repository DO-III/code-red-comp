const SHARD_WIDTH = 75;
const SHARD_HEIGHT = 75;
const ShGW_CENTER = SHARD_WIDTH / 2;
const ShGH_CENTER = SHARD_HEIGHT / 2;

const SHARD_RADIUS = 15;
const SHARD_MOVE_RATE = 7.5;
const SHARD_FRICTION = 0.999;

/*
Splitter Shards are fast enemies that spawn from Splitters.

They are reckless and charge quickly.
*/
//TODO: Completely undocumented class...
class SplitterShard extends AbstractEnemy {
    constructor(game, point) {
        super(game, point, {
            width: SHARD_WIDTH,
            height: SHARD_HEIGHT,
            radius: SHARD_RADIUS,
            imageAsset: ASSET_MANAGER.getAsset("./Ships/gfx/SplitterShard.svg"),
            spriteOffsetX: 12,
            spriteOffsetY: 12,
            moveRate: SHARD_MOVE_RATE,
            friction: SHARD_FRICTION
        });

        this.spawnMovement();
        this.playerX = 0;
        this.playerY = 0;
        this.lastShot = 0;
        WaveManager.activeEnemies++;
    }

    draw(ctx) {
        this.angle = this.rotateHandle();
        super.draw(ctx);
    }

    update() {
        this.checkIfShot(25, 'yellow');
        this.handlePlayerDeath();

        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;

        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;
        this.dX *= this.friction;
        this.dY *= this.friction;
        this.edgeDetect();
        this.updateCenter();

        this.lastShot += this.game.clockTick;
    }

    spawnMovement() {
        let effectiveMoveRate = this.moveRate * this.game.clockTick;

        let toMoveIn = Math.floor(Math.random() * 360);
        toMoveIn *= (Math.PI / 180);

        this.angle = Math.floor(toMoveIn);
        this.dX += Math.cos(this.angle) * effectiveMoveRate * 32.5;
        this.dY += Math.sin(this.angle) * effectiveMoveRate * 32.5;
    }

    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = this.moveRate * this.game.clockTick;

        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }

    edgeDetect() {
        if (this.collideLeft() || this.collideRight()) {
            this.x += (this.collideLeft() ? 1 : -1);
            this.dX *= -0.5;
        }

        if (this.collideUp() || this.collideDown()) {
            this.dY *= -0.5;
        }
    }
}