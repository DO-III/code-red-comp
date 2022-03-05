class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop});

        this.framesConsumed = 0;
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;

    };

    drawFrame(tick, ctx, x, y) {

        this.elapsedTime += tick;

        if(this.isDone()) { //Check for looping animation, or to stop animating.
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } 
        }


        let frame = this.currentFrame();


        ctx.drawImage(this.spritesheet, 
             (this.xStart + this.width*frame), this.yStart,
             this.width, this.height,
             x, y,
             this.width, this.height);

        this.framesConsumed++;

    };

    currentFrame() { //Report current frame based on elapsed time.
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };

    loops() {
        return (Math.floor(this.framesConsumed / this.frameCount));
    }

    /*
    Reset the number of times an animation has looped.
    */
    resetLoops() {
        this.framesConsumed = 0;
        this.elapsedTime = 0;
    }



}