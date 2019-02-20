"use strict";

var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    '   fragColor = vertColor;',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}',
    '',
].join("\n")

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}',
    '',
].join("\n")

var Initialize = function () {
    var canvas = document.getElementById('game-surface');
    var initializedObjs = InitializeGLWithoutCulling(canvas, vertexShaderText, fragmentShaderText);

    if (initializedObjs == undefined) {
        console.err('Could not initialize WebGL');
        return;
    }

    var gl = initializedObjs[0]
    var program = initializedObjs[1]

    //
    // Create buffer of data to be fed into the GPU
    //
    var triangleVertices =
    [ //X, Y,   R,G,B
        0.0, 0.5,   1.0, 0.0, 0.0,
        -0.5, -0.5,  0.0, 1.0, 0.0,
        0.5, -0.5,   0.0, 0.0, 1.0,
    ];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of element
        gl.FALSE, // Normalized
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of a single vertex including color
        0, // Offset from the beginning of a single vertex to this attribute
    );

    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of element
        gl.FALSE, // Normalized
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of a single vertex including color
        2 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    // Render Loop
    //
    gl.useProgram(program);
    var first_index = 0;
    var num_vertices = 3;
    var defaultColor = [.75, .75, .9, 1.0];
	var loop = function () {
	    gl.clearColor(defaultColor[0], defaultColor[1], defaultColor[2], defaultColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, first_index, num_vertices);
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
}
