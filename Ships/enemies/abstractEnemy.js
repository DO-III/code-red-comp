/*
Base class for all enemies in the game.

This class centralizes the shared logic that every enemy needs:
- locating the player
- updating its collision circle
- rotating toward the player
- drawing itself on the canvas
- checking whether it has been hit by a player bullet
- handling basic wall collision helpers

Each concrete enemy still keeps its own unique movement and attack behavior
by overriding the methods it needs, but it no longer has to reimplement the
boring, repeated bookkeeping.
*/
class AbstractEnemy {
    constructor(game, point, config = {}) {
        if (new.target === AbstractEnemy) {
            throw new Error("AbstractEnemy cannot be instantiated directly.");
        }

        this.game = game;
        this.player = this.fetchPlayer(game);

        this.x = point.x;
        this.y = point.y;
        this.dX = 0;
        this.dY = 0;

        this.width = config.width ?? 50;
        this.height = config.height ?? 50;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.radius = config.radius ?? 20;
        this.imageAsset = config.imageAsset;
        this.spriteOffsetX = config.spriteOffsetX ?? 0;
        this.spriteOffsetY = config.spriteOffsetY ?? 0;
        this.moveRate = config.moveRate ?? 0;
        this.friction = config.friction ?? 1;

        this.xCenter = 0;
        this.yCenter = 0;
        this.playerX = 0;
        this.playerY = 0;
        this.angle = 0;
        this.lastShot = 0;

        this.updateCenter();
        this.BoundingCircle = new BoundingCircle(this.radius, this.xCenter, this.yCenter);
    }

    /*
    Find the player entity in the game world.

    This is the same mechanism used by all enemy classes and is kept here so
    every subclass can rely on the same behavior.
    */
    fetchPlayer(game) {
        let foundPlayer;
        while (typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return foundPlayer;
    }

    /*
    Update the enemy's collision center using the graphic's midpoint.
    */
    updateCenter() {
        this.xCenter = this.x + this.halfWidth;
        this.yCenter = this.y + this.halfHeight;
        this.BoundingCircle = new BoundingCircle(this.radius, this.xCenter, this.yCenter);
    }

    /*
    Use a standard enemy sprite renderer for all enemies.

    Subclasses that need special image offsets can set spriteOffsetX and
    spriteOffsetY in their constructor config.
    */
    draw(ctx) {
        const myCanvas = document.createElement('canvas');
        myCanvas.width = this.width;
        myCanvas.height = this.height;
        const myCtx = myCanvas.getContext('2d');

        myCtx.save();
        myCtx.translate(this.halfWidth, this.halfHeight);
        myCtx.rotate(this.angle ?? 0);
        myCtx.translate(-this.halfWidth, -this.halfHeight);
        myCtx.drawImage(this.imageAsset, this.spriteOffsetX, this.spriteOffsetY);
        myCtx.restore();

        ctx.drawImage(myCanvas, this.x, this.y);
    }

    /*
    Rotate the enemy to face the player.

    This is the exact same orientation math used by the original classes.
    */
    rotateHandle() {
        if (this.player == null) {
            return 0;
        }

        const dx = this.playerX - (this.x + this.halfWidth);
        const dy = this.playerY - (this.y + this.halfHeight);

        return Math.atan2(dy, dx) + (Math.PI / 2);
    }

    /*
    Return true if the enemy is out of bounds on the left side of the screen.
    */
    collideLeft() {
        return (this.xCenter - this.radius) < 0;
    }

    collideRight() {
        return (this.xCenter + this.radius) > GAME_WORLD_WIDTH;
    }

    collideUp() {
        return (this.yCenter - this.radius) < 0;
    }

    collideDown() {
        return (this.yCenter + this.radius) > GAME_WORLD_HEIGHT;
    }

    /*
    Shared helper for wall bouncing.

    Individual enemies can still override this for their own bounce behavior,
    but the common logic remains available here.
    */
    edgeDetect(bounceX = 0.1, bounceY = 0.1) {
        if (this.collideLeft() || this.collideRight()) {
            this.x += (this.collideLeft() ? 1 : -1);
            this.dX *= -bounceX;
        }

        if (this.collideUp() || this.collideDown()) {
            this.dY *= -bounceY;
        }
    }

    /*
    Shared bullet-hit detection.

    The score value and color can be overridden by each subclass to match the
    original rules (red, yellow, cyan, etc.).
    */
    checkIfShot(scoreValue = 25, scoreColor = 'white') {
        const that = this;

        this.game.entities.forEach(function (entity) {
            if (!(typeof entity.BoundingCircle === 'undefined')
                && (entity instanceof Bullet)
                && (entity.parent == "PlayerShip")
                && entity.BoundingCircle
                && that.BoundingCircle.collide(entity.BoundingCircle)
                && that.removeFromWorld != true) {
                entity.removeFromWorld = true;
                that.game.addEntity(new Score(that.game, that.xCenter, that.yCenter, scoreValue, scoreColor));
                that.onDefeat();
                WaveManager.activeEnemies--;
                that.removeFromWorld = true;
            }
        });
    }

    /*
    Hook for subclasses that need additional death behavior.

    Splitter overrides this to spawn shards when it dies.
    */
    onDefeat() {
        // Intended to be overridden by subclasses if they need extra behavior.
    }

    /*
    Standard “player dead” check used across enemy types.
    */
    handlePlayerDeath() {
        if (this.player && this.player.dead) {
            this.removeFromWorld = true;
        }
    }
}
