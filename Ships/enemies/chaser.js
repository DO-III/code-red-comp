/*
Chasers pursue the player relentlessly with some concept of velocity.

They move stictly towards the player taking the most direct route possible.
*/


const CHASER_RADIUS = 5; //Size of Chaser bounding circle.
const CHASER_MOVE_RATE = 1.5; //Speed at which Chaser moves.
const CHASER_FRICTION = 0.9; //Rate at which Chaser loses speed. Lower = slower.


class Chaser {
    constructor(game) {
        //Initialize element.
        this.myGame = game;

    }
    
    draw(ctx) {

    }

    update() {

    }
}