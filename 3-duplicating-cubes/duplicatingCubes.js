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
        glMatrix.mat4.lookAt(this.viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
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

        // Create Test GameObject
        var cube = new Cube("TestCube")
        programTogameObjects[basicProgram].push(cube);

        // Render Loop
        var prevTime = performance.now() / 1000; // Get seconds
        var curTime = performance.now() / 1000;
        var deltaTime = 0
        var frameNum = 0
        var numCubes = 0
        var timeUntilNewCube = 2;
        var render = function () {
            curTime = performance.now() / 1000;
            deltaTime = curTime - prevTime;

            timeUntilNewCube -= deltaTime;

            if (numCubes < 10 && timeUntilNewCube < 0) {
                programTogameObjects[basicProgram].push(new Cube(numCubes, new Vector3(randomVal() * 4, randomVal() * 4, randomVal() * 4)));
                timeUntilNewCube = 2;
                numCubes++;
            }

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
            frameNum++;
            requestAnimationFrame(render);
            prevTime = curTime;
        };
        requestAnimationFrame(render);
    }
}




