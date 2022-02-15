/*
This class exclusively keeps track of the player's score.

It prints text to the top-center of the canvas.
When an enemy is killed, it should add points.
*/
class ScoreKeeper {
    /*
    Keep score!

    Create the ScoreKeeper with an intial value of 0 points.
    It lives at the top center of the screen.
    */
    constructor(game) {
        this.game = game;
        this.score = 0;
    }

    draw(ctx) {
        ctx.font = 'small-caps 700 30px courier';
        ctx.textAlign = 'center';

        ctx.strokeText(this.score, GAME_WORLD_WIDTH/2, 30);
    }

    update() {

    }
}