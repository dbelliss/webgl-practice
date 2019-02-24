"use strict";

function Initialize() {
    var game = new Game();
}

class Game {
    initializeMatrices() {
        this.worldMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);


    }

    constructor() {
        // Create WebGL object
        var canvas = document.getElementById('game-surface');
        this.canvas = canvas;
        this.gl = InitializeGL(canvas);
        if (this.gl == undefined) {
            console.error('Could not initialize WebGL');
            return;
        }
        var gl = this.gl  // Shorter name
        clearGL(gl)

        // Initialize world, view, and proj matrixes
        this.initializeMatrices();


        // Load all textures
        this.textureLoader = new TextureLoader(gl)

        // Initialize all Programs
        this.programs = []
        this.simpleProgram = new SimpleProgram(gl, this.worldMatrix, this.viewMatrix, this.projMatrix, this.canvas.clientWidth / this.canvas.clientHeight)
        this.programs.push(this.simpleProgram);

        this.simpleProgram2 = new SimpleProgram(gl, this.worldMatrix, this.viewMatrix, this.projMatrix, this.canvas.clientWidth / this.canvas.clientHeight)
        this.simpleProgram2.name = "SimpleProgram2"
        this.programs.push(this.simpleProgram2);

        this.textureProgram = new TextureProgram(gl, this.worldMatrix, this.viewMatrix, this.projMatrix, this.canvas.clientWidth / this.canvas.clientHeight)
        this.programs.push(this.textureProgram);

        // Create mapping from program to GameObjects
        this.programTogameObjects = new Map()
        for (var i = 0; i < this.programs.length; i++) {
            this.programTogameObjects[this.programs[i].name] = []
        }

        // Create list of all active GameObjects to act on during FixedUpdate
        this.activeGameObjects = []

        // Create Player GameObject
        this.createPlayer();

        // Create asteroids

        this.createAsteroids(10)

        // Create crates

        this.createPickups(1)


        // Create textured boxes
        this.createCrates(10)

        this.createWalls()

        // Create Camera
        this.camera = new Camera(gl, this.worldMatrix, this.viewMatrix, this.projMatrix);

        // Render Loop
        var numFrames = 0
        var theta = 0
        var phi = 0
        function render () {
            clearGL(this.gl)
            var cameraInput = InputManager.readCameraInput()
            theta = cameraInput.x;
            phi = cameraInput.y;
            this.camera.trackObject(this.player, theta, phi)
            for (var programNum = 0; programNum < this.programs.length; programNum++) {
                var program = this.programs[programNum];
                var gameObjects = this.programTogameObjects[program.name];
                gl.useProgram(program.program);
                program.updateCamera();
                var objectVertices = []
                var boxIndices = []

                if (program.name == "SimpleProgram" || program.name == "SimpleProgram2") {
                    for (var gameObjectNum = 0; gameObjectNum < gameObjects.length; gameObjectNum++) {
                        var gameObject = gameObjects[gameObjectNum];
                        var renderData = gameObject.getRenderData()
                        var numIndiced = objectVertices.length/6;
                        objectVertices = objectVertices.concat(renderData[0])

                        for (var i = 0; i < renderData[1].length; i++) {
                            renderData[1][i] += numIndiced;
                        }
                        boxIndices = boxIndices.concat(renderData[1])
                        if (gameObjectNum > 50) {
                            program.draw(gl, objectVertices, boxIndices)
                            objectVertices = []
                            boxIndices = []
                        }
                    }
                    if (objectVertices.length > 0) {
                        program.draw(gl, objectVertices, boxIndices)
                    }
                }
                if (program.name == "TextureProgram") {
                    for (var gameObjectNum = 0; gameObjectNum < gameObjects.length; gameObjectNum++) {
                        var gameObject = gameObjects[gameObjectNum];
                        var renderData = gameObject.getRenderData()
                        var numIndices = objectVertices.length/5;
                        objectVertices = objectVertices.concat(renderData[0])

                        for (var i = 0; i < renderData[1].length; i++) {
                            renderData[1][i] += numIndices;
                        }
                        boxIndices = boxIndices.concat(renderData[1])
                        if (gameObjectNum > 50) {
                            program.draw(gl, objectVertices, boxIndices)
                            objectVertices = []
                            boxIndices = []
                        }
                    }
                    if (objectVertices.length > 0) {
                        program.draw(gl, objectVertices, boxIndices, this.textureLoader.getTexture("box"))
                    }
                }

            }
            numFrames++;
            requestAnimationFrame(render.bind(this));
        };
        requestAnimationFrame(render.bind(this));

        this.beginFixedUpdateLoop();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async beginFixedUpdateLoop() {
        var prevTime = performance.now() / 1000; // Get seconds
        var curTime = performance.now() / 1000;
        var deltaTime = 0

        while(true) {
            curTime = performance.now() / 1000;
            deltaTime = curTime - prevTime;
            prevTime = curTime;
            this.activeGameObjects.forEach(function (gameObject) {
                gameObject.fixedUpdate(deltaTime)
            })
            await this.sleep(1000/60);
        }
    }

    createAsteroids() {
        console.log("Creating obstacles");
    }

    createPlayer() {
        console.log("Creating player");
        this.player = new Player("Player", new Vector3(0,0,0));
        this.activeGameObjects.push(this.player);
        this.programTogameObjects[this.simpleProgram.name].push(this.player);
    }

    createPickups2(numPickups) {
        console.log("Creating pickups2");
        for (var i = 0; i < numPickups; i++) {
            var leftCube = new Cube("leftCube" + i, new Vector3(-2,i * 1, 2))
            this.activeGameObjects.push(leftCube);
            this.programTogameObjects[this.simpleProgram2.name].push(leftCube);

            var rightCube = new Cube("rightCube" + i, new Vector3(2,i * 1, 2))
            this.activeGameObjects.push(rightCube);
            this.programTogameObjects[this.simpleProgram2.name].push(rightCube);
        }
    }

    createPickups(numPickups) {
        console.log("Creating pickups");
        for (var i = 0; i < numPickups; i++) {
            var leftCube = new Cube("leftCube" + i, new Vector3(-3,i * 1, 0))
            this.activeGameObjects.push(leftCube);
            this.programTogameObjects[this.simpleProgram.name].push(leftCube);

            var rightCube = new Cube("rightCube" + i, new Vector3(3,i * 1, 0))
            this.activeGameObjects.push(rightCube);
            this.programTogameObjects[this.simpleProgram.name].push(rightCube);
        }
    }

    createCrates(numPickups) {
        console.log("Creating creates");
        for (var i = 0; i < numPickups; i++) {
            var leftCube = new TexturedCube("leftCube" + i, new Vector3(-1,-2, i * 20))
            this.activeGameObjects.push(leftCube);
            this.programTogameObjects[this.textureProgram.name].push(leftCube);

            var rightCube = new TexturedCube("rightCube" + i, new Vector3(1,-2, i * 20))
            this.activeGameObjects.push(rightCube);
            this.programTogameObjects[this.textureProgram.name].push(rightCube);
        }
    }

    createWalls() {
//        var leftWall= new Cube("LeftWall", new Vector3(-100, 0, 0))
//            this.activeGameObjects.push(leftCube);
//            this.programTogameObjects[this.simpleProgram.name].push(leftCube);

    }
}
