/*
Every enemy gets a bounding circle that defines its size.

Ideally, the hitbox should be about the size of the enemy - nobody
is going to complain if they get a free hit on an enemy from a bullet
that logically merely glanced it.
*/


class BoundingCircle {
    constructor(radius, xCenter, yCenter) {
        Object.assign(this, {radius, xCenter, yCenter});
    }

    /*
    Two circles are colliding if the sum of their radii is smaller than
    the distance between the center points.
    */
    collide(other) {
        var dx = this.xCenter - other.xCenter;
        var dy = this.yCenter - other.yCenter;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + other.radius) {
            return(true);
        }
        return(false);
    }

}