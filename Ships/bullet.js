//Concept of a bullet.
//Could be subclassed as "PlayerBullet" and "DodgerBullet"...

const BULLET_ASSET = ASSET_MANAGER.getAsset("./Ships/gfx/bullet.png");


class Bullet {
    constructor(game, x, y) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Bullet.png");
        this.x = x;
        this.y = y;

    }
    
    draw(ctx) {
        ctx.drawImage(BULLET_ASSET, this.x, this.y);
    }

    update() {

    }
}