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
        this.waveManager = this.getWaveManager(game);
        this.score = 0;
    }

    /*
    Draw the player's current score.
    */
    draw(ctx) {
        ctx.font = 'small-caps 700 30px courier';
        ctx.textAlign = 'center';

        ctx.strokeText(this.score, GAME_WORLD_WIDTH/2, 30);
    }

    /*
    Fetch the player reference from the game manager.
    */
    getWaveManager(game) {
        var foundManager;
        while(typeof foundManager === 'undefined') {
            foundManager = game.entities.find(entity => entity instanceof WaveManager);
        }
        return(foundManager);
    }

    /*
    Reset the player's score whenever the game is restarted.
    */
    update() {
        if(this.waveManager.gameIsReset) {
            this.score = 0;
            this.waveManager.gameIsReset = false;
            
        }

    }
}

/*
The little score bubbles thrown by enemies on death.

Each one corresponds to a certain value.
They persist for a few seconds and are promptly removed.
*/
class Score {
    /**
     * Create a new Score object.
     * @param {*} game Game world.
     * @param {*} x X location of score to display.
     * @param {*} y Y location of score to display.
     * @param {*} value How many points is this enemy worth?
     * @param {*} color What color was the enemy that just died? We flash between that and white.
     */
    constructor(game, x, y, value, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.value = value;
        this.myTextColor = color;

        this.timePresent = 0;
        this.scoreKeeper = this.getScoreKeeper(this.game);
        this.scoreKeeper.score += this.value;
    }

    draw(ctx) {
        //Drawing this normally would cause a conflict with the canvas,
        //so we'll just give it its own little canvas.
        var myCanvas = document.createElement('canvas');
        myCanvas.width = 50;
        myCanvas.height = 50;
        var myCtx = myCanvas.getContext('2d');
        myCtx.font = 'small-caps 15px courier';
        myCtx.textAlign = 'center';
        myCtx.strokeStyle = this.myTextColor;

        myCtx.strokeText(this.value, 25, 25);
        
        this.game.ctx.drawImage(myCanvas, this.x, this.y);
    }

    update() {
       this.timePresent += this.game.clockTick;
        if (this.timePresent > 1.5) {
            this.removeFromWorld = true;
        }
    }

    /*
    Fetch the player reference from the game manager.
    */
    getScoreKeeper(game) {
        var foundKeeper;
        while(typeof foundKeeper === 'undefined') {
            foundKeeper = game.entities.find(entity => entity instanceof ScoreKeeper);
        }
        return(foundKeeper);
    }

}
