/*
The WaveManager controls when and where enemies spawn.

Please check the documentation provided in this class if you want to add
or edit any waves that appear.
*/

const WAVE_TIME_COEFFICIENT = 350;


class WaveManager {

    static activeEnemies = 0;


    constructor(game) {
        this.game = game;
        this.player = this.fetchPlayer(this.game);
        this.enemiesInWave = []; //Holds enemies spawned;
        this.waveIsDoneSpawning = false;

        //Set up basic spawn locations.
        //These are used to handle enemy spawning in the future.
        this.locations = [
            //Corners; used for threatening chasing enemies.
            new Point(12, 12),
            new Point(737, 12),
            new Point(12, 537),
            new Point(737, 537),
            //Field; give wandering enemies an edge.
            new Point(374, 70),
            new Point(130, 269),
            new Point(620, 269),
            new Point(374, 460),
        ];

        this.devTestWave();

        this.spawnWave();


    }

    draw(ctx) {
        console.log(WaveManager.activeEnemies);
        if(this.player.dead) {
            ctx.strokeText("GAME OVER", GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2);
        } else if((WaveManager.activeEnemies == 0) && (this.waveIsDoneSpawning)) {
            ctx.strokeText("YOU WIN", GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2);
        }
    }

    update() {

    }

    /*
    Spawn all enemies in the wave.

    If the player is killed during a wave... well, oops.
    */
    spawnWave() {
        this.waveIsDoneSpawning = false;
        var that = this;
        this.enemiesInWave.forEach(function(spawn) {
            that.game.addEntity(spawn);
            spawn.isActive = true;
        })
    }

    devTestWave() {
        this.enemiesInWave = [
        new Spawn(this, this.game, this.locations[4], 'w', 0),
        new Spawn(this, this.game, this.locations[5], 'w', 0),
        new Spawn(this, this.game, this.locations[6], 'w', 0),
        new Spawn(this, this.game, this.locations[7], 'w', 0),
	    //this.game.addEntity(new Chaser(this.game));
        
	    new Spawn(this, this.game, this.locations[0], 'c', 1000),
        new Spawn(this, this.game, this.locations[1], 'c', 1000),
        new Spawn(this, this.game, this.locations[2], 'c', 1000),
        new Spawn(this, this.game, this.locations[3], 'c', 1000),

        new Spawn(this, this.game, this.locations[4], 'w', 1100),
        new Spawn(this, this.game, this.locations[5], 'w', 1300),
        new Spawn(this, this.game, this.locations[6], 'w', 1500),
        new Spawn(this, this.game, this.locations[7], 'w', 1701)
        ];
    }

    fetchPlayer(game) {
        var foundPlayer;
        while(typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return(foundPlayer);
    }

    getPlayerReference() {
        return(this.player);
    }

    /*
    Fetch the player reference from the game manager.
    */
    fetchPlayer(game) {
        var foundPlayer;
        while(typeof foundPlayer === 'undefined') {
            foundPlayer = game.entities.find(entity => entity instanceof PlayerShip);
        }
        return(foundPlayer);
    }

}

/*
Defines a simple x/y point in 2D space.

Used pretty exclusively with the WaveManager.
*/
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/*
Defines the entire routine for spawning an enemy at a given point.

When constructed, the Spawn plays an animation of a circle rapidly shrinking
to a point over the course of three seconds, or about 
*/

class Spawn {
    /**
     * Creates an enemy Spawn.
     * Note that if the spawn time ends in 1 (such as "1701"), then that enemy signifies end of wave.
     * @param {*} wave WaveManager.
     * @param {*} game Game context.
     * @param {*} point A Point object representing an X and Y location in space.
     * @param {*} enemy Character representing enemy; W for Wanderer, C for Chaser.
     * @param {*} waitTime Determines when Spawn should activate. Longer means longer wait.
     */
    constructor(wave, game, point, enemy, waitTime) {
        this.wave = wave;
        this.game = game;
        this.point = point;
        //Enemy is a char literal corresponding to a certain enemy type.
        //w - Wanderer
        //c - Chaser
        this.enemy = enemy;
        this.radius = 800;
        this.waitTime = waitTime;
        this.isActive = false;
        this.player = wave.player;
        console.log(waitTime % 10);
        this.isLast = waitTime % 10 == 1;
    }

    /*
    Circle drawing animation to depict enemy "spawning" in.
    */
    draw(ctx) {
        if(this.waitTime <= 0 && this.isActive) {
            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.arc(this.point.x + 25, this.point.y + 25, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    /*
    Update circle size.
    */
    update() {
        if (this.isActive) {
            if(this.waitTime > 0) {
                this.waitTime -= (this.game.clockTick * WAVE_TIME_COEFFICIENT);
            } else {
                this.radius -= (this.game.clockTick * WAVE_TIME_COEFFICIENT);
                this.checkIsDone();
            }
        }
    }

    /*
    Checks if the circle has "become a point" and is thus ready to spawn.
    */
    checkIsDone() {
        if(this.radius <= 1) {
            this.spawnEnemyAtPoint();
            this.removeFromWorld = true;
        } else if (this.player.dead) {
            console.log(this.player);
            this.removeFromWorld = true;
        }
    }

    /*
    Spawn an enemy at the given point. Case insensitive.
    */
    spawnEnemyAtPoint() {
        let enemyRef = null;
        switch(this.enemy) {
            case 'w' :
            case 'W' :
                enemyRef = new Wanderer(this.game, this.point);
                break;
            case 'c' :
            case 'C' :
                enemyRef = new Chaser(this.game, this.point);
                break;
            default:
                throw "Spawn was given improper char representing enemy! (see documentation)";
        }
        WaveManager.activeEnemies++;
        gameEngine.addEntity(enemyRef);
        if (this.isLast) {
            this.wave.waveIsDoneSpawning = true;
            console.log("Wave is done, go get 'em!")
        }

    }

    
}