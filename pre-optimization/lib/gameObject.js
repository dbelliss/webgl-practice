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
    }

    render(gl) {
        console.log("Rendering ", this.name)
    }

    addForce(force) {
        this.velocity.add(force.scaled(1/this.mass))
    }

    fixedUpdate(deltaTime) {
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

    render(gl) {
        // Create buffer object to send data between CPU and GPU
        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.boxVertices), gl.DYNAMIC_DRAW);

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.boxIndices), gl.DYNAMIC_DRAW);

        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');

        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);

        gl.drawElements(gl.TRIANGLES, this.boxIndices.length, gl.UNSIGNED_SHORT, 0);
    }

    fixedUpdate(deltaTime) {
        if (!(this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0)) {
            this.transform.position.add(this.velocity.scaled(deltaTime));
            this.boxVertices = generateBox([this.transform.position.x, this.transform.position.y, this.transform.position.z])[0];
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

    static random(upperBound) {
        return new Vector3(randomVal() * upperBound, randomVal() * upperBound, randomVal() * upperBound);
    }
}

