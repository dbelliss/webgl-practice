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

    render(gl) {
        console.log("Rendering ", this.name)
    }

    debugInfo() {
        return `Name:${this.name}, Position:${this.transform.debugInfo()}`
    }
}

class Cube extends GameObject{
    constructor(_name, offset=[2,2,2]) {
        super(_name);
        var box = generateBox(offset);
        this.boxVertices = box[0];
        this.boxIndices = box[1];
    }

    render(gl) {
        // Create buffer object to send data between CPU and GPU
        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.boxVertices), gl.STATIC_DRAW);

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.boxIndices), gl.STATIC_DRAW);

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
}

