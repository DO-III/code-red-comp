// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];
        this.background = null;

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.mousedown = false; //tracking when mouse is down.
        this.wheel = null;
        this.keys = {};

        // THE KILL SWITCH
        this.running = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.background = ASSET_MANAGER.getAsset("./backdrop.svg");
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        //Reference to self because JS.
        var that = this;

        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        //Player input block; all player inputs go here...
        this.ctx.canvas.addEventListener("keydown", function(e) {
        //    console.log(e);
            switch(e.code) {
                //Player Movement with WASD
                case "KeyA":
                case "ArrowLeft":
                    that.left = true;
                    break;
                case "KeyD":
                case "ArrowRight":
                    that.right = true;
                    break;
                case "KeyW":
                case "ArrowUp":
                    that.up = true;
                    break;
                case "KeyS":
                case "ArrowDown":
                    that.down = true;
                    break;
                case "KeyR":
                    that.restart = true;
            }
        }, false);

        //Now to detect key releases. Use same pattern as above...
        this.ctx.canvas.addEventListener("keyup", function(e) {
            switch(e.code) {
                //Player Movement with WASD
                case "KeyA":
                case "ArrowLeft":
                    that.left = false;
                    break;
                case "KeyD":
                case "ArrowRight":
                    that.right = false;
                    break;
                case "KeyW":
                case "ArrowUp":
                    that.up = false;
                    break;
                case "KeyS":
                case "ArrowDown":
                    that.down = false;
                    break;
                case "KeyR":
                    that.restart = false;
            }
        }, false);



        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("mousedown", e => {
            if (this.options.debugging) {
                console.log("MOUSE_DOWN", getXandY(e));
            }
            this.mousedown = true;
        });

        this.ctx.canvas.addEventListener("mouseup", e => {
            if (this.options.debugging) {
                console.log("MOUSE_UP", getXandY(e));
            }
            this.mousedown = null;
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            if (this.options.prevent.scrolling) {
                e.preventDefault(); // Prevent Scrolling
            }
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            if (this.options.prevent.contextMenu) {
                e.preventDefault(); // Prevent Context Menu
            }
            this.rightclick = getXandY(e);
        });

        window.addEventListener("keydown", event => this.keys[event.key] = true);
        window.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //Draw background.
        this.ctx.drawImage(this.background, 0, 0);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
    };

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)