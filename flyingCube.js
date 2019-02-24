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

        this.textureProgram = new TextureProgram(gl, this.worldMatrix, this.viewMatrix, this.projMatrix, this.canvas.clientWidth / this.canvas.clientHeight)

        // Load renderer
        this.renderer = new Renderer(this.gl, this.textureLoader, this.textureProgram);

        // Initialize all Programs
//        this.programs = []
//        this.simpleProgram = new SimpleProgram(gl, this.worldMatrix, this.viewMatrix, this.projMatrix, this.canvas.clientWidth / this.canvas.clientHeight)
//        this.programs.push(this.simpleProgram);
//
//        this.simpleProgram2 = new SimpleProgram(gl, this.worldMatrix, this.viewMatrix, this.projMatrix, this.canvas.clientWidth / this.canvas.clientHeight)
//        this.simpleProgram2.name = "SimpleProgram2"
//        this.programs.push(this.simpleProgram2);


//        this.programs.push(this.textureProgram);

//        // Create mapping from program to GameObjects
//        this.programTogameObjects = new Map()
//        for (var i = 0; i < this.programs.length; i++) {
//            this.programTogameObjects[this.programs[i].name] = []
//        }

        this.gl.useProgram(this.textureProgram.program);

        // Create list of all active GameObjects to act on during FixedUpdate
        this.activeGameObjects = []

        // Create GameObjects
        this.crates = []
        this.asteroids = []
        this.createPlayer();
        this.createAsteroids(100)
        this.createCrates(100)
        this.createWalls()
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
            this.camera.trackObject(this.player, theta, phi);
                        this.textureProgram.updateCamera()
            this.renderer.render()
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
        var updateNum = 0
        while(true) {
            curTime = performance.now() / 1000;
            deltaTime = curTime - prevTime;
            prevTime = curTime;
            this.activeGameObjects.forEach(function (gameObject) {
                gameObject.fixedUpdate(.02)
            })

            if (updateNum % 100 == 0) {
                for (var i = 0; i < this.crates.length; i++) {
                    this.crates[i].addForce(Vector3.random(10));
                }
            }

            if (updateNum % 100 == 50) {
                for (var i = 0; i < this.asteroids.length; i++) {
                    this.asteroids[i].addForce(Vector3.random(10));
                }
            }
            updateNum++;
            await this.sleep(1000/60);
        }
    }

    createAsteroids(numAsteroids) {
        console.log("Creating asteroids");
        for (var i = 0; i < numAsteroids; i++) {
            var asteroid = new Cube("asteroid" + i, Vector3.random(30), "susan", this.gl.STATIC_DRAW)
            this.asteroids.push(asteroid);
            this.addGameObject(asteroid);
        }
    }

    createPlayer() {
        console.log("Creating player");
        this.player = new Player("Player", new Vector3(0,0,0), "burningCrate", this.gl.DYNAMIC_DRAW);
        this.addGameObject(this.player);
    }

    createCrates(numCrates) {
        console.log("Creating crates");
        for (var i = 0; i < numCrates; i++) {
            var crate = new Cube("crate" + i, Vector3.random(20), "crate", this.gl.STATIC_DRAW)
            this.crates.push(crate);
            this.addGameObject(crate);
        }
    }

    addGameObject(gameObject) {
        this.activeGameObjects.push(gameObject);
        this.renderer.addObject(gameObject)
    }

    createWalls() {
        console.log("Walls have not yet been implemented");
    }
}
