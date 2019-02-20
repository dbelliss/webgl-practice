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

    return [gl, program]
}

var InitializeGLWithoutCulling = function(canvasID, vertexShaderText, fragmentShaderText) {
    return InitializeGL(canvasID, vertexShaderText, fragmentShaderText, false)
}