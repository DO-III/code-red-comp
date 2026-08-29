/*
Wanderers... wander.
*/
//TODO: Completely undocumented class...
const WANDERER_WIDTH = 50;
const WANDERER_HEIGHT = 50;
const WGW_CENTER = WANDERER_WIDTH / 2;
const WGH_CENTER = WANDERER_HEIGHT / 2;

const WANDERER_RADIUS = 20;
const WANDERER_MOVE_RATE = 200;
const WANDERER_FRICTION = 1;

class Wanderer extends WanderingEnemy {
    constructor(game, point) {
        super(game, point, {
            width: WANDERER_WIDTH,
            height: WANDERER_HEIGHT,
            radius: WANDERER_RADIUS,
            imageAsset: ASSET_MANAGER.getAsset("./Ships/gfx/Wanderer.svg"),
            spriteOffsetX: 0,
            spriteOffsetY: 0,
            moveRate: WANDERER_MOVE_RATE,
            friction: WANDERER_FRICTION
        });

        this.wave = this.fetchWave(game);
    }

    draw(ctx) {
        this.angle = this.rotateFromVelocity();
        super.draw(ctx);
    }

    update() {
        this.checkIfShot(25, 'cyan');
        this.updateWandering();
    }

    fetchWave(game) {
        var foundWave;
        while (typeof foundWave === 'undefined') {
            foundWave = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return (foundWave);
    }
}