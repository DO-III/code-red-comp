class PlayerShip {
    constructor(game) {
        //Initialize element.
        this.myGame = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Player.png"); //Messy hardcode, fix later.

        this.x = 100;
        this.y = 100;

        this.pointing = 0; //Zero is directly upwards.

    }
    
    draw(ctx) {
        ctx.drawImage(this.imageAsset, this.x, this.y);
    }

    update() {
        //The basic idea is that the player points in the direction they move in
        //and shoots in the direction the arrow keys press.

        //That means we need to rotate the graphic to match the WASD inputs.

    }
}