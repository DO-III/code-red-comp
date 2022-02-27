const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Ships/gfx/Player.png");
ASSET_MANAGER.queueDownload("./Ships/gfx/Chaser.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/Wanderer.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/Bullet.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/explosion.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/Dodger.svg");
ASSET_MANAGER.queueDownload("./Ships/gfx/Splitter.png");
ASSET_MANAGER.queueDownload("./backdrop.svg");
//Add all images here.

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	const util = new GameConstants();
	
	

	
	

	gameEngine.init(ctx);
	gameEngine.addEntity(new PlayerShip(gameEngine));
	gameEngine.addEntity(new WaveManager(gameEngine));
	gameEngine.addEntity(new ScoreKeeper(gameEngine));
	
    
	
	

	gameEngine.start();
});
