/*
The WaveManager controls when and where enemies spawn.

Please check the documentation provided in this class if you want to add
or edit any waves that appear.
*/
class WaveManager {
    constructor(game) {
        this.game = game;

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


    }


    devTestSpawn() {
        this.game.addEntity(new PlayerShip(this.game));
	    //this.game.addEntity(new Chaser(this.game));
	    this.game.addEntity(new Wanderer(this.game, this.locations[0]));
        this.game.addEntity(new Wanderer(this.game, this.locations[1]));
        this.game.addEntity(new Wanderer(this.game, this.locations[2]));
        this.game.addEntity(new Wanderer(this.game, this.locations[3]));
        this.game.addEntity(new Wanderer(this.game, this.locations[4]));
        this.game.addEntity(new Wanderer(this.game, this.locations[5]));
        this.game.addEntity(new Wanderer(this.game, this.locations[6]));
        this.game.addEntity(new Wanderer(this.game, this.locations[7]));
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