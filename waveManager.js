/*
The WaveManager controls when and where enemies spawn.

Please check the documentation provided in this class if you want to add
or edit any waves that appear.
*/

const SPAWN_TIME_COEFFICIENT = 350;
const WAVE_TEXT_BUFFER_TIME = 100;


class WaveManager {

    static activeEnemies = 0;
    static enemiesInWave = [];


    constructor(game) {
        this.game = game;
        this.player = this.fetchPlayer(this.game);
        this.beginGame = false;
        this.waveIsDoneSpawning = true;
        this.waveIsCompleted = true;
        this.gameIsOver = false;
        this.currentWave = 0;
        this.waveTextTimer = 0;

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
            new Point(374, 460)
        ];

        this.waves = [
            this.waveOne,
            this.waveTwo,
           // this.devTestWave
        ];

        

        


    }

    draw(ctx) {
        ctx.strokeStyle = 'green';
        //console.log(WaveManager.activeEnemies);
        if (this.beginGame === false) {
            ctx.strokeText("CLICK TO BEGIN", GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2);
        } else {


        if(this.player.dead) {
            ctx.strokeText("GAME OVER", GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2 - 20);
            ctx.strokeText("R TO RETRY", GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2 + 20);
        } else {
            if (this.gameIsOver) {
                ctx.strokeText("CONGRATULATIONS!", GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2);
            }
        }
        }
    }

    drawWaveText(ctx) {
        if (this.waveTextTimer < WAVE_TEXT_BUFFER_TIME) {
            ctx.strokeText("WAVE " + (this.currentWave + 1), GAME_WORLD_WIDTH/2, GAME_WORLD_HEIGHT/2);
            this.waveTextTimer += this.game.clockTick;
        } else {
            this.waveTextTimer = 0;
            
        }
    }

    update() {
        if (this.beginGame === false) {
            if (this.game.click != null) {
                this.beginGame = true;
                this.player.spawnPlayer();
            }

        } else if (this.player.dead) {
            console.log("he's dead, jim")
            console.log(this.game.restart)
            if (this.game.restart) {
                this.resetGame();
            }

        } else {

            if ((WaveManager.activeEnemies == 0) && this.waveIsDoneSpawning) {
                this.waveIsCompleted = true;
            } 

            if (this.waveIsCompleted) {
                console.log("Wave done, onto the next.")
                this.currentWave++;
                this.waveIsCompleted = false;
                this.waveIsDoneSpawning = false;
                console.log(this.waves.length);
                console.log(this.currentWave);
                if (!((this.currentWave - 1) === this.waves.length)) {
                    this.runGame();
                } else {
                    this.gameIsOver = true;
                }
                
            }
        }

    }

    /*
    Spawn all enemies in the wave.

    The wave number is tracked by the WaveManager; this method increments that number,
    then spawns that wave.

    If the player is killed during a wave... well, oops.
    */
    runGame() {
        this.waveIsDoneSpawning = false;
        var that = this;
        console.log(this.currentWave);

        this.waves[(this.currentWave - 1)](this.locations, this.game, this);
        WaveManager.activeEnemies = 0;
        console.log(WaveManager.enemiesInWave);

        WaveManager.enemiesInWave.forEach(function(spawn) {
            that.game.addEntity(spawn);
            spawn.isActive = true;
        })
        console.log(WaveManager.enemiesInWave);
        //this.enemiesInWave = [];
    }

    /*
    In case the player dies, restart the game.

    This resets the wave counter back to 0.
    */
    resetGame() {
        this.currentWave = 1;
        this.gameIsOver = false;
        this.gameIsReset = true;
        this.player.spawnPlayer();
        this.runGame();
    }

    /*
    Set up first wave.

    An easy wave so the player can come to grips.
    */
    waveOne(l, g, wv) {
        console.log(l);
        WaveManager.enemiesInWave = [
        new Spawn(wv, g, l[4], 'w', 0),
        new Spawn(wv, g, l[5], 'w', 0),
        new Spawn(wv, g, l[6], 'w', 0),
        new Spawn(wv, g, l[7], 'w', 0),

        new Spawn(wv, g, l[0], 'w', 500),
        new Spawn(wv, g, l[1], 'w', 500),
        new Spawn(wv, g, l[2], 'w', 500),
        new Spawn(wv, g, l[3], 'w', 500),

        new Spawn(wv, g, l[0], 'c', 1000),
        new Spawn(wv, g, l[1], 'c', 1000),
        new Spawn(wv, g, l[2], 'c', 1000),
        new Spawn(wv, g, l[3], 'c', 1001),
        ];
    }
    /*
    Set up second wave.

    A steady stream of wanderers and chasers

    Also does something fun; it uses loops to automate production!
    */
    waveTwo(l, g, wv) {
        console.log(l);

        for (var i = 0; i < 15; i++) {
            WaveManager.enemiesInWave.push(
                new Spawn(wv, g, l[4], 'w', i * 100)
            )
            WaveManager.enemiesInWave.push(
                new Spawn(wv, g, l[7], 'w', i * 150)
            )
        }
        WaveManager.enemiesInWave.push(new Spawn(wv, g, l[1], 's', 3000));
        WaveManager.enemiesInWave.push(new Spawn(wv, g, l[2], 's', 3000));
        WaveManager.enemiesInWave.push(new Spawn(wv, g, l[0], 'd', 3000));
        WaveManager.enemiesInWave.push(new Spawn(wv, g, l[3], 'd', 3001));
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
                this.waitTime -= (this.game.clockTick * SPAWN_TIME_COEFFICIENT);
            } else {
                this.radius -= (this.game.clockTick * SPAWN_TIME_COEFFICIENT);
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
            case 'd' :
            case 'D' :
                enemyRef = new Dodger(this.game, this.point);
                break;
            case 's' :
            case 'S' :
                enemyRef = new Splitter(this.game, this.point);
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