class PlayerShip {
    constructor(game) {
        //Initialize element.
        this.game = game;
        this.imageAsset = ASSET_MANAGER.getAsset("./Ships/gfx/Player.png"); //Messy hardcode, fix later.

        this.x = 100;
        this.y = 100;

        this.xVelocity = 0; //Change in X between ticks.
        this.yVelocity = 0; //Change in Y between ticks.

        this.pointing = 0; //Zero is directly upwards.

    }
    
    draw(ctx) {
        ctx.drawImage(this.imageAsset, this.x, this.y);
    }

    update() {
        //TODO Get final player graphic so we can do a proper check on edges.


        //The basic idea is that the player points in the direction they move in
        //and shoots in the direction the arrow keys press, like a ship.

        //That means we need to rotate the graphic to match the WASD inputs.
        
        //Calculate the x velocity.
        //This is found by adding "left" to "right"; if both are pressed, no movement.
        this.xVelocity = (
            (this.game.left ? -5 : 0 )
            +
            (this.game.right? 5 : 0 )
        );
        //Repeat for y velocity; bearing in mind that "0" is at the top.
        this.yVelocity = (
            (this.game.up ? -5 : 0 )
            +
            (this.game.down? 5 : 0 )
        );

        //Calculate differences and change position.
        this.x += this.xVelocity;
        this.y += this.yVelocity;


    }
}