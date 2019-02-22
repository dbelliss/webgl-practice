"use strict";

const vertexShaderText = `
    precision lowp float;
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
    precision lowp float;
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
        glMatrix.mat4.lookAt(this.viewMatrix, [0, -20, 10], [0, 0, 0], [0, 1, 0]);
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

        // Create reference cubes
        for (var i = 0; i < 100; i++) {
            var leftCube = new Cube("leftCube" + i, new Vector3(-4,i * 1, 0))
            activeGameObjects.push(leftCube);
            programTogameObjects[basicProgram].push(leftCube);

            var rightCube = new Cube("rightCube" + i, new Vector3(4,i * 1, 0))
            activeGameObjects.push(rightCube);
            programTogameObjects[basicProgram].push(rightCube);
        }


        // Render Loop
        var numFrames = 0

        var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        var viewMatrix = this.viewMatrix

        function render () {
            glMatrix.mat4.lookAt(viewMatrix, [0 + player.transform.position.x, -30 + player.transform.position.y, 10 + player.transform.position.z], [player.transform.position.x, player.transform.position.y, player.transform.position.z], [0, 1, 0]);
            gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
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

            while(true) {
                var inputVector = readInput()
                player.addForce(inputVector);
                curTime = performance.now() / 1000;
                deltaTime = curTime - prevTime;
                prevTime = curTime;
                activeGameObjects.forEach(function (gameObject) {
                    gameObject.fixedUpdate(deltaTime)
                })
                await sleep(1000/60);
            }
        }
        beginFixedUpdateLoop();

    }
}




