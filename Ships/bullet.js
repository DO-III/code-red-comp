//Concept of a bullet.
//Could be subclassed as "PlayerBullet" and "DodgerBullet"...
class Bullet {
    constructor(game) {
        //Initialize element.
        this.myGame = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Bullet.png");
        this.x = x;
        this.y = y;

    }
    
    draw() {
        fill(225);
        rect(this.x, this.y, 3, 10);
    }

    update() {

    }
}