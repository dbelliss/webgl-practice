"use strict";

class Transform {
    constructor(_x=0, _y=0, _z=0) {
        this.position = new Vector3(_x, _y, _z);
        this.scale = new Vector3(1, 1, 1);
        this.children = [];
        this.parentTransform = undefined;
    }

    addChild(childTransform) {
        this.children.push(childTransform)
        this.childTransform.parentTransform = this
    }

    debugInfo() {
        return `(${this.x},${this.y},${this.z}), Parent:${this.parentTransform}, Children:${this.children}`
    }
}

class GameObject {
    constructor(_name) {
        this.name = _name;
        this.transform = new Transform();
        this.mass = 1
        this.velocity = new Vector3(0, 0, 0)
        this.drag = .05;
        this.maxSpeed = 50
    }

    render(gl) {
        console.log("Rendering ", this.name)
    }

    addForce(force) {
        this.velocity.add(force.scaled(1/this.mass))
    }

    fixedUpdate(deltaTime) {
        var speed = this.velocity.magnitude
        if (speed > this.maxSpeed) {
            var factor = speed / this.maxSpeed
            velocity.scale(1/factor)
        }
        if (!(this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0)) {
            this.transform.position.add(this.velocity.scaled(deltaTime));
            this.applyDrag()
        }
    }

    applyDrag() {
        if (Math.abs(this.velocity.x) < this.drag) {
                this.velocity.x = 0
        }
        else {
            if (this.velocity.x > 0) {
                this.velocity.x -= this.drag;
            }
            else {
                this.velocity.x += this.drag;
            }
        }

        if (Math.abs(this.velocity.y) < this.drag) {
            this.velocity.y = 0
        }
        else {
            if (this.velocity.y > 0) {
                this.velocity.y -= this.drag;
            }
            else {
                this.velocity.y += this.drag;
            }
        }

        if (Math.abs(this.velocity.z) < this.drag) {
            this.velocity.z = 0
        }
        else {
            if (this.velocity.z > 0) {
                this.velocity.z -= this.drag;
            }
            else {
                this.velocity.z += this.drag;
            }
        }

    }

    debugInfo() {
        return `Name:${this.name}, Position:${this.transform.debugInfo()}`
    }
}

class Cube extends GameObject{

    constructor(_name, offset=new Vector3(0,0,0)) {
        super(_name);
        var box = generateBox([offset.x, offset.y, offset.z]);
        this.boxVertices = box[0];
        this.boxIndices = box[1];
        this.transform.position = offset
    }

    getRenderData() {
        return [this.boxVertices.slice(), this.boxIndices.slice()]
    }

    fixedUpdate(deltaTime) {
        if (!(this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0)) {
            this.transform.position.add(this.velocity.scaled(deltaTime));
            this.boxVertices = generateBox([this.transform.position.x, this.transform.position.y, this.transform.position.z])[0];
            this.applyDrag()
        }
    }
}


class TexturedCube extends GameObject{

    constructor(_name, offset=new Vector3(0,0,0)) {
        super(_name);
        var box = generateTexturedBox([offset.x, offset.y, offset.z]);
        this.boxVertices = box[0];
        this.boxIndices = box[1];
        this.transform.position = offset
    }

    getRenderData() {
        return [this.boxVertices.slice(), this.boxIndices.slice()]
    }

    fixedUpdate(deltaTime) {
        if (!(this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0)) {
            this.transform.position.add(this.velocity.scaled(deltaTime));
            this.boxVertices = generateTexturedBox([this.transform.position.x, this.transform.position.y, this.transform.position.z])[0];
            this.applyDrag()
        }
    }
}

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

