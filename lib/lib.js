"use strict;"

/**
 * Creates and initializes a WebGL object without culling
 *
 * @param {canvasID} string ID of the canvas object on the HTML page
 * @param {vertexShaderText} string to compile and use as the vertex shader
 * @param {fragmentShaderText} string to compile and use as the fragment shader
 * @returns {gl} the initialized webGL object, or {undefined} if any errors occurred
 */
var InitializeGL = function(canvas, vertexShaderText, fragmentShaderText, isCullingEnabled=true) {
    console.log('Initializing');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL is not supported on this browser, falling back to experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL')
        return
    }

    if (isCullingEnabled) {
    	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
    }


    program = createProgram(gl, vertexShaderText, fragmentShaderText);
    if (program == undefined) {
        return
    }

    return [gl, program]
}

var createProgram = function(gl, vertexShaderText, fragmentShaderText) {
    //
    // Create the shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error: Could not compile vertex shader: ', gl.getShaderInfoLog(vertexShader))
        return
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error: Could not compile fragment shader: ', gl.getShaderInfoLog(fragmentShader))
        return
    }

    //
    // Create program and attach shaders
    //
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //
    // Link and validate, like a C program
    //
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error: Could not link program: ', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error: Program validation failed: ', gl.getProgramInfoLog(program))
        return;
    }
    return program
}

var clearGL = function(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
}

var InitializeGLWithoutCulling = function(canvasID, vertexShaderText, fragmentShaderText) {
    return InitializeGL(canvasID, vertexShaderText, fragmentShaderText, false)
}

var readInput = function() {
    var transformVector = [0, 0, 0]
    if(key.isPressed("W")) {
        transformVector[2] += 1
    }
    if (key.isPressed("S")) {
        transformVector[2] += -1
    }

    if(key.isPressed("A")) {
        transformVector[0] += -1
    }
    else if (key.isPressed("D")) {
        transformVector[0] += 1
    }
    return transformVector
}

/**
 * Creates a list of floats that generated a cube centered around the given offset
 *
 * @param {offset} Offset of the cube form the origin, defaults to the origin
 */
var generateBox = function(offset=[0,0,0]) {
    //
	// Create buffer
	//
	const xOffset = offset[0]
	const yOffset = offset[1]
	const zOffset = offset[2]
	var boxVertices =
	[ // X, Y, Z           R, G, B
		// Top
		-1.0 + xOffset, 1.0 + yOffset, -1.0 + zOffset,   0.5, 0.5, 0.5,
		-1.0 + xOffset, 1.0 + yOffset, 1.0 + zOffset,    0.5, 0.5, 0.5,
		1.0 + xOffset, 1.0 + yOffset, 1.0 + zOffset,     0.5, 0.5, 0.5,
		1.0 + xOffset, 1.0 + yOffset, -1.0 + zOffset,    0.5, 0.5, 0.5,

		// Left
		-1.0  + xOffset, 1.0 + yOffset, 1.0 + zOffset,    0.75, 0.25, 0.5,
		-1.0  + xOffset, -1.0 + yOffset, 1.0 + zOffset,   0.75, 0.25, 0.5,
		-1.0  + xOffset, -1.0 + yOffset, -1.0 + zOffset,  0.75, 0.25, 0.5,
		-1.0  + xOffset, 1.0 + yOffset, -1.0 + zOffset,   0.75, 0.25, 0.5,

		// Right
		1.0 + xOffset, 1.0 + yOffset, 1.0 + zOffset,    0.25, 0.25, 0.75,
		1.0 + xOffset, -1.0 + yOffset, 1.0 + zOffset,   0.25, 0.25, 0.75,
		1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset,  0.25, 0.25, 0.75,
		1.0 + xOffset, 1.0 + yOffset, -1.0 + zOffset,   0.25, 0.25, 0.75,

		// Front
		1.0 + xOffset, 1.0 + yOffset, 1.0 + zOffset,    1.0, 0.0, 0.15,
		1.0 + xOffset, -1.0 + yOffset, 1.0 + zOffset,    1.0, 0.0, 0.15,
		-1.0 + xOffset, -1.0 + yOffset, 1.0 + zOffset,    1.0, 0.0, 0.15,
		-1.0 + xOffset, 1.0 + yOffset, 1.0 + zOffset,    1.0, 0.0, 0.15,

		// Back
		1.0 + xOffset, 1.0 + yOffset, -1.0 + zOffset,    0.0, 1.0, 0.15,
		1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset,    0.0, 1.0, 0.15,
		-1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset,    0.0, 1.0, 0.15,
		-1.0 + xOffset, 1.0 + yOffset, -1.0 + zOffset,    0.0, 1.0, 0.15,

		// Bottom
		-1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset,   0.5, 0.5, 1.0,
		-1.0 + xOffset, -1.0 + yOffset, 1.0 + zOffset,    0.5, 0.5, 1.0,
		1.0 + xOffset, -1.0 + yOffset, 1.0 + zOffset,     0.5, 0.5, 1.0,
		1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset,    0.5, 0.5, 1.0,
	];

	const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];
	return [boxVertices, boxIndices];
}

/**
 * Returns a random value between -1 and 1
 */
var randomVal = function() {
    return Math.random() * 2 - 1
}