"use strict";

/**
 * WebGL program to render objects that have a texture
 */
class TextureProgram extends Program {

    static getVertexShaderText() {
        var vertexShaderText = `
            precision lowp float;
            attribute vec3 vertPosition;
            attribute vec2 vertTexCoord;
            varying vec2 fragTexCoord;
            uniform mat4 mWorld;
            uniform mat4 mView;
            uniform mat4 mProj;

            void main()
            {
              fragTexCoord = vertTexCoord;
              gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
            }
        `;
        return vertexShaderText;
    }

    static getFragmentShaderText() {
        var fragmentShaderText = `
            precision lowp float;
            varying vec2 fragTexCoord;
            uniform sampler2D sampler; // gl.TEXTURE0

            void main()
            {
              gl_FragColor = texture2D(sampler, fragTexCoord);
            }
        `;
        return fragmentShaderText;
    }

    constructor(gl, worldMatrix, viewMatrix, projMatrix, aspectRatio) {
        super(gl, TextureProgram.getVertexShaderText(), TextureProgram.getFragmentShaderText(), worldMatrix, viewMatrix, projMatrix)
        gl.useProgram(this.program);
        this.matWorldUniformLocation = gl.getUniformLocation(this.program, 'mWorld');
        var matViewUniformLocation = gl.getUniformLocation(this.program, 'mView');
        var matProjUniformLocation = gl.getUniformLocation(this.program, 'mProj');

        glMatrix.mat4.identity(this.worldMatrix);
        glMatrix.mat4.lookAt(this.viewMatrix, [0, -20, 10], [0, 0, 0], [0, 1, 0]);
        glMatrix.mat4.perspective(this.projMatrix, glMatrix.glMatrix.toRadian(45), aspectRatio, 0.1, 1000.0);
        gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this.viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this.projMatrix);
        this.name = "TextureProgram"

        this.positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
        this.texCoordAttribLocation = gl.getAttribLocation(this.program, 'vertTexCoord');

        // Create buffer objects to send data between CPU and GPU
        this.boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.boxVertexBufferObject);

        this.boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.boxIndexBufferObject);
        this.identity = glMatrix.mat4.identity(new Float32Array(16))
    }

    /**
     * Update the view matrix to reflect changes to the camera
     */
    updateCamera() {
        var matViewUniformLocation = this.gl.getUniformLocation(this.program, 'mView');
        this.gl.uniformMatrix4fv(matViewUniformLocation, this.gl.FALSE, this.viewMatrix);
    }

    /**
     * Draws using the given data

     * @param {vertices} WebGL object
     * @param {indices} List of which indices should be used to make a single triangle
     * @param {texture} Texture to apply to the object
     */
    draw(gl, vertices, indices, texture, drawType, transform) {
//        var temp = new Float32Array(16)
//        glMatrix.mat4.identity(temp)
//        glMatrix.mat4.rotate(temp, temp, transform.rotation.x/180 * Math.PI, [1, 0, 0])
//        glMatrix.mat4.rotate(temp, temp, transform.rotation.y/180 * Math.PI, [0, 1, 0])
//        glMatrix.mat4.rotate(temp, temp, transform.rotation.z/180 * Math.PI, [0,0,1])
//        glMatrix.mat4.scale(temp, temp, [transform.scale.x, transform.scale.y, transform.scale.z])
//        glMatrix.mat4.translate(temp, temp, [transform.position.x, transform.position.y, transform.position.z])

//        this.worldMatrix = temp
        var quat = new Float32Array(4);
        glMatrix.quat.fromEuler(quat, transform.rotation.x, transform.rotation.y, transform.rotation.z)

        glMatrix.mat4.fromRotationTranslationScaleOrigin(this.worldMatrix, quat, [transform.position.x, transform.position.y, transform.position.z], [transform.scale.x, transform.scale.y, transform.scale.z], [0,0,0])

        gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, this.gl.DYNAMIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, drawType);

        // Tell GPU how the raw data will be structured
        gl.vertexAttribPointer(
            this.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            this.texCoordAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.enableVertexAttribArray(this.texCoordAttribLocation);

        // Set texture
    	gl.activeTexture(gl.TEXTURE0);
    	gl.bindTexture(gl.TEXTURE_2D, texture.texture);

		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        // Cleanup
//        gl.deleteBuffer(this.boxVertexBufferObject)
//        gl.deleteBuffer(this.boxIndexBufferObject)
    }

    /**
     * Draws using the given data

     * @param {vertices} WebGL object
     * @param {indices} List of which indices should be used to make a single triangle
     * @param {texture} Texture to apply to the object
     */
    drawMesh(gl, meshVertices, meshIndices, meshTexCoords, texture, drawType, transform) {
        var quat = new Float32Array(4);
        glMatrix.quat.fromEuler(quat, transform.rotation.x, transform.rotation.y, transform.rotation.z)
        glMatrix.mat4.fromRotationTranslationScaleOrigin(this.worldMatrix, quat, [transform.position.x, transform.position.y, transform.position.z], [transform.scale.x, transform.scale.y, transform.scale.z], [0,0,0])
        gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix);

        //
        // Create buffers
        //
        var vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshVertices), gl.STATIC_DRAW);

        var texCoordBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshTexCoords), gl.STATIC_DRAW);

        var indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshIndices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.vertexAttribPointer(
            this.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(this.positionAttribLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObject);
        gl.vertexAttribPointer(
            this.texCoordAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0
        );
        gl.enableVertexAttribArray(this.texCoordAttribLocation);

        // Set texture
    	gl.activeTexture(gl.TEXTURE0);
    	gl.bindTexture(gl.TEXTURE_2D, texture.texture);

		gl.drawElements(gl.TRIANGLES, meshIndices.length, gl.UNSIGNED_SHORT, 0);

        // Cleanup
//        gl.deleteBuffer(this.boxVertexBufferObject)
//        gl.deleteBuffer(this.boxIndexBufferObject)
    }
}