"use strict";

/**
 * Class to represent a vector in 3d space
 */
class Vector3 {
    constructor(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    scaled(scaleVal) {
        return new Vector3(this.x * scaleVal, this.y * scaleVal, this.z * scaleVal);
    }

    scale(scaleVal) {
        this.x *= scaleVal
        this.y *= scaleVal
        this.z *= scaleVal
    }

    static random(upperBound) {
        return new Vector3(randomVal() * upperBound, randomVal() * upperBound, randomVal() * upperBound);
    }

    normalize() {
        var d = this.magnitude()
        this.x /= d;
        this.y /= d;
        this.z /= d;
    }

    normalized() {
        var d = this.magnitude()
        return new Vector3(this.x / d, this.y/d, this.z/d)
    }

    magnitude() {
        var d = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
        return d
    }
}