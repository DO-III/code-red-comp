/*
Dodgers are aggressive pink ships that run from the player's shots,
firing back as they go.

They also stop within range of the player, providing an interesting challenge.

Use them sparingly as they are exceptionally dangerous.

Credit to Sidise Tasisa for the "detecting player and bullet" logic.
*/
const DODGER_WIDTH = 50;
const DODGER_HEIGHT = 50;
const DGW_CENTER = DODGER_WIDTH / 2;
const DGH_CENTER = DODGER_HEIGHT / 2;

const DODGER_RADIUS = 20;
const DODGER_DETECT_RADIUS = DODGER_RADIUS * 3;
const DODGER_MOVE_RATE = 20;
const DODGER_FRICTION = 0.9;
const DODGER_DISTANCE_FROM_PLAYER = 200;
const DODGER_SHOOT_RATE = 1;

class Dodger extends AbstractEnemy {
    constructor(game, point) {
        super(game, point, {
            width: DODGER_WIDTH,
            height: DODGER_HEIGHT,
            radius: DODGER_RADIUS,
            imageAsset: ASSET_MANAGER.getAsset("./Ships/gfx/Dodger.svg"),
            spriteOffsetX: 0,
            spriteOffsetY: 0,
            moveRate: DODGER_MOVE_RATE,
            friction: DODGER_FRICTION
        });

        this.BulletBoundingCircle = new BoundingCircle(DODGER_DETECT_RADIUS, this.xCenter, this.yCenter);
        this.lastShot = 0;
    }

    draw(ctx) {
        this.angle = this.rotateHandle();
        super.draw(ctx);
    }

    update() {
        this.checkIfShot(100, 'fuchsia');
        this.handlePlayerDeath();

        this.playerX = this.player.xCenter;
        this.playerY = this.player.yCenter;

        this.calcMovement(this.xCenter, this.playerX, this.yCenter, this.playerY);
        this.x += this.dX;
        this.y += this.dY;
        this.dX *= this.friction;
        this.dY *= this.friction;
        this.edgeDetection();
        this.updateCenter();
        this.bulletDetection();

        this.lastShot += this.game.clockTick;

        if (!this.dead && this.lastShot > DODGER_SHOOT_RATE) {
            this.shoot();
            this.lastShot = 0;
        }
    }

    updateCenter() {
        super.updateCenter();
        this.BulletBoundingCircle = new BoundingCircle(DODGER_DETECT_RADIUS, this.xCenter, this.yCenter);
    }

    shoot() {
        this.game.addEntity(new Bullet(this.game,
            (this.xCenter - 10),
            (this.yCenter - 10), this.player.xCenter - 10, this.player.yCenter - 10, "Enemy"));
    }

    edgeDetection() {
        if (this.collideLeft() || this.collideRight()) {
            this.x = (this.collideLeft() ? 1 : GAME_WORLD_WIDTH - 50);
            this.dX *= -1;
        }

        if (this.collideUp() || this.collideDown()) {
            this.y = (this.collideUp() ? 1 : GAME_WORLD_HEIGHT - 50);
            this.dY *= -1;
        }
    }

    bulletDetection() {
        var that = this;

        this.game.entities.forEach(function (entity) {
            if (!(typeof entity.BoundingCircle === 'undefined') && (entity instanceof Bullet)
                && (entity.parent == "PlayerShip")
                && that.BulletBoundingCircle.collide(entity.BoundingCircle)) {
                var bullX = entity.xCenter;
                var bullY = entity.yCenter;
                let effectiveMoveRate = DODGER_MOVE_RATE * that.game.clockTick;
                let angle = (-1 + Math.random(1) * -1) / Math.atan2(that.yCenter - bullY, that.xCenter - bullX);
                that.dX += (Math.cos(angle) * effectiveMoveRate) * -9;
                that.dY += (Math.sin(angle) * effectiveMoveRate) * -9;
            }
        });
    }

    calcMovement(p1X, p2X, p1Y, p2Y) {
        let effectiveMoveRate = this.moveRate * this.game.clockTick;
        var distance = Math.sqrt(Math.pow((p2Y - p1Y), 2) + Math.pow((p2X - p1X), 2));
        if (distance > DODGER_DISTANCE_FROM_PLAYER) {
            this.angle = Math.atan2(p2Y - p1Y, p2X - p1X);
            this.dX += (Math.cos(this.angle) * effectiveMoveRate);
            this.dY += (Math.sin(this.angle) * effectiveMoveRate);
        }
    }

    calcDistance(p1X, p2X, p1Y, p2Y) {
        return Math.sqrt(Math.pow((p2Y - p1Y), 2) + Math.pow((p2X - p1X), 2));
    }
}
