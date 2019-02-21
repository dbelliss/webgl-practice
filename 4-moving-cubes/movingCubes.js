"use strict";

const vertexShaderText = `
    precision mediump float;
    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
       fragColor = vertColor;
       gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
    `;


var singleColorShaderText = `
    precision mediump float;
    varying vec3 fragColor;
    void main()
    {
       gl_FragColor = vec4(fragColor, 1.0);
    }
    `;



var Initialize = function() {
    var game = new Game();
}

class Game {
    createCubeGameObject() {
        var gl = this.gl;
        var box = generateBox([2,2,2]);
        var boxVertices = box[0];
        var boxIndices = box[1];
        // Create buffer object to send data between CPU and GPU
        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

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
        return new GameObject("Cube", )
    }

    createCube(offset=[0,0,0]) {

        var gl = this.gl;
        var box = generateBox(offset);
        var boxVertices = box[0];
        var boxIndices = box[1];

        // Create buffer object to send data between CPU and GPU
        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

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
        return boxIndices.length
    };

    initializeUniforms() {
        var gl = this.gl
        var canvas = this.canvas
        var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

        this.worldMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);

        // Setup Camera
        glMatrix.mat4.identity(this.worldMatrix);
        glMatrix.mat4.lookAt(this.viewMatrix, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
        glMatrix.mat4.perspective(this.projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this.worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this.viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this.projMatrix);
    }

    initializeSimpleProgram() {
        this.initializeUniforms()
    }

    constructor() {
        var canvas = document.getElementById('game-surface');
        this.canvas = canvas;
        var initializedObjs = InitializeGL(canvas, vertexShaderText, singleColorShaderText);

        if (initializedObjs == undefined) {
            console.error('Could not initialize WebGL');
            return;
        }

        var gl = initializedObjs[0]
        clearGL(gl)
        this.gl = gl
        var basicProgram = initializedObjs[1]

        var programs = [basicProgram];

        // Initialize All Programs
        gl.useProgram(program);
        this.initializeSimpleProgram();

        // Create mapping from program to GameObjects
       var programTogameObjects = new Map()
        for (var programNum = 0; programNum < programs.length; programNum++) {
            var curProgram = programs[programNum];
            programTogameObjects[curProgram] = []
        }

        var activeGameObjects = []
        // Create Player GameObject
        var player = new Cube("Player", new Vector3(0,0,0))
        activeGameObjects.push(player);
        programTogameObjects[basicProgram].push(player);

        // Render Loop
        var numFrames = 0
        var render = function () {
            clearGL(gl)
            for (var programNum = 0; programNum < programs.length; programNum++) {
                var program = programs[programNum];
                var gameObjects = programTogameObjects[program];
                gl.useProgram(program);
                for (var gameObjectNum = 0; gameObjectNum < gameObjects.length; gameObjectNum++) {
                    var gameObject = gameObjects[gameObjectNum];
                    gameObject.render(gl)
                }
            }
            numFrames++;
            requestAnimationFrame(render);

        };
        requestAnimationFrame(render);

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function beginFixedUpdateLoop() {
            var prevTime = performance.now() / 1000; // Get seconds
            var curTime = performance.now() / 1000;
            var deltaTime = 0

            // Set up spawning cubes
            var numCubes = 1
            var cubeSpawnTime = .2;
            var timeSinceLastCube = cubeSpawnTime

            while(true) {
                curTime = performance.now() / 1000;
                deltaTime = curTime - prevTime;
                timeSinceLastCube -= deltaTime;
                prevTime = curTime;
                activeGameObjects.forEach(function (gameObject) {
                    gameObject.fixedUpdate(deltaTime)
                })

                if (numCubes < 100 && timeSinceLastCube <= 0) {
                    numCubes++;
                    var newCube = new Cube(numCubes, new Vector3(0,0,0))
                    newCube.mass = Math.abs(randomVal()) * 3;
                    newCube.addForce(Vector3.random(10))
                    activeGameObjects.push(newCube);
                    programTogameObjects[basicProgram].push(newCube);
                    timeSinceLastCube = cubeSpawnTime
                }

                await sleep(1000/60);
            }
        }
        beginFixedUpdateLoop();

    }
}




