const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Ships/gfx/Player.png");
ASSET_MANAGER.queueDownload("./Ships/gfx/Chaser.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/Wanderer.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/Bullet.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/explosion.svg");
//Add all images here.

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	const util = new GameConstants();

	gameEngine.init(ctx);

    
	gameEngine.addEntity(new PlayerShip(gameEngine));
	//Messy hardcode. Should later have an entity that manages spawning.
	//gameEngine.addEntity(new Chaser(gameEngine));
	gameEngine.addEntity(new Wanderer(gameEngine));
	gameEngine.addEntity(new Dodger(gameEngine));

	

	gameEngine.start();
});
