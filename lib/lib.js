"use strict;"

/**
 * Creates and initializes a WebGL object without culling
 *
 * @param {canvasID} string ID of the canvas object on the HTML page
 * @returns {gl} the initialized webGL object, or {undefined} if any errors occurred
 */
var InitializeGL = function(canvas, fragmentShaderText,) {
    console.log('Initializing WebGL');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL is not supported on this browser, falling back to experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL')
        return
    }

    clearGL(gl)
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    return gl
}

var clearGL = function(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
}

function generateTexturedBox(offset= [0,0,0]) {
	var boxVertices =
	[ // X, Y, Z           U, V
		// Top
		-1.0 + offset[0], 1.0 + offset[1], -1.0 + offset[2],   0, 0,
		-1.0 + offset[0], 1.0 + offset[1], 1.0 + offset[2],    0, 1,
		1.0 + offset[0], 1.0 + offset[1], 1.0 + offset[2],     1, 1,
		1.0 + offset[0], 1.0 + offset[1], -1.0 + offset[2],    1, 0,

		// Left
		-1.0 + offset[0], 1.0 + offset[1], 1.0 + offset[2],    0, 0,
		-1.0 + offset[0], -1.0 + offset[1], 1.0 + offset[2],   1, 0,
		-1.0 + offset[0], -1.0 + offset[1], -1.0 + offset[2],  1, 1,
		-1.0 + offset[0], 1.0 + offset[1], -1.0 + offset[2],   0, 1,

		// Right
		1.0 + offset[0], 1.0 + offset[1], 1.0 + offset[2],    1, 1,
		1.0 + offset[0], -1.0 + offset[1], 1.0 + offset[2],   0, 1,
		1.0 + offset[0], -1.0 + offset[1], -1.0 + offset[2],  0, 0,
		1.0 + offset[0], 1.0 + offset[1], -1.0 + offset[2],   1, 0,

		// Front
		1.0 + offset[0], 1.0 + offset[1], 1.0 + offset[2],    1, 1,
		1.0 + offset[0], -1.0 + offset[1], 1.0 + offset[2],    1, 0,
		-1.0 + offset[0], -1.0 + offset[1], 1.0 + offset[2],    0, 0,
		-1.0 + offset[0], 1.0 + offset[1], 1.0 + offset[2],    0, 1,

		// Back
		1.0 + offset[0], 1.0 + offset[1], -1.0 + offset[2],    0, 0,
		1.0 + offset[0], -1.0 + offset[1], -1.0 + offset[2],    0, 1,
		-1.0 + offset[0], -1.0 + offset[1], -1.0 + offset[2],    1, 1,
		-1.0 + offset[0], 1.0 + offset[1], -1.0 + offset[2],    1, 0,

		// Bottom
		-1.0 + offset[0], -1.0 + offset[1], -1.0 + offset[2],   1, 1,
		-1.0 + offset[0], -1.0 + offset[1], 1.0 + offset[2],    1, 0,
		1.0 + offset[0], -1.0 + offset[1], 1.0 + offset[2],     0, 0,
		1.0 + offset[0], -1.0 + offset[1], -1.0 + offset[2],    0, 1,
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