class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, reverse, loop, mirror) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, reverse, loop, mirror});

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
        if (this.reverse) {
            frame = this.frameCount - frame - 1;
        }


        ctx.drawImage(this.spritesheet, 
             (this.xStart + this.width*frame), this.yStart,
             this.width, this.height,
             x, y,
             this.width, this.height);

    };

    currentFrame() { //Report current frame based on elapsed time.
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };



}