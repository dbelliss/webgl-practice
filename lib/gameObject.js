"use strict";

class Transform {
    constructor(_x=0, _y=0, _z=0) {
        this.x = 0
        this.y = 0;
        this.z = 0;
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
    }

    render() {
        console.log("Rendering ", this.name)
    }

    debugInfo() {
        return `Name:${this.name}, Position:${this.transform.debugInfo()}`
    }
}