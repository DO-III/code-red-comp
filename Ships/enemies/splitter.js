const SPLITTER_WIDTH = 75;
const SPLITTER_HEIGHT = 75;
const SGW_CENTER = SPLITTER_WIDTH / 2;
const SGH_CENTER = SPLITTER_HEIGHT / 2;

const SPLITTER_RADIUS = 25;
const SPLITTER_MOVE_RATE = 1.5;
const SPLITTER_FRICTION = 0.996;

/*
Splitters are slow enemies that split into three Splitter Shards on death.

They are clumsy and often bump into walls. Their children are less so,
essentially being Chasers with less restraint.
*/
class Splitter extends AbstractEnemy {
    constructor(game, point) {
        super(game, point, {
            width: SPLITTER_WIDTH,
            height: SPLITTER_HEIGHT,
            radius: SPLITTER_RADIUS,
            imageAsset: ASSET_MANAGER.getAsset("./Ships/gfx/Splitter.svg"),
            spriteOffsetX: 12,
            spriteOffsetY: 12,
            moveRate: SPLITTER_MOVE_RATE,
            friction: SPLITTER_FRICTION
        });

        this.playerX = 0;
        this.playerY = 0;
        this.lastShot = 0;
    }

    draw(ctx) {
        this.angle = this.rotateHandle();
        super.draw(ctx);
    }

    update() {
        this.checkIfShot(50, 'yellow');
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

    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = this.moveRate * this.game.clockTick;

        this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
        this.dX += Math.cos(this.angle) * effectiveMoveRate;
        this.dY += Math.sin(this.angle) * effectiveMoveRate;
    }

    onDefeat() {
        let deathPoint = new Point(this.x, this.y);
        this.spawnShards(deathPoint);
    }

    spawnShards(deathPoint) {
        for (let i = 0; i < 3; i++) {
            this.game.addEntity(new SplitterShard(this.game, deathPoint));
        }
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