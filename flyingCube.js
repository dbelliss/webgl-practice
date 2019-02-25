"use strict";

function Initialize() {

    loadJSONResource('./Assets/Asteroid.json', function (modelErr, asteroidObj) {
        loadJSONResource('./Assets/Susan.json', function (modelErr, rocketObj) {
            var game = new Game(asteroidObj, rocketObj);
        });
    });
}

class Game {
    initializeMatrices() {
        this.worldMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);
    }

    constructor(asteroidJson, rocketJson) {
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
        this.createPlayer(rocketJson);
        this.createAsteroids(1, asteroidJson)
        this.createCrates(4)
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
            for (var i = 0; i < this.crates.length; i++) {
                var gameObject = this.crates[i]
                var renderData = gameObject.renderData;
                renderData.program.draw(this.gl, renderData.vertices, renderData.indices, renderData.texture, renderData.drawType, gameObject.transform)
            }

            for (var i = 0; i < this.asteroids.length; i++) {
                var gameObject = this.asteroids[i]
                var jsonData = gameObject.json;
                this.textureProgram.drawMesh(this.gl, asteroidJson.meshes[0].vertices, [].concat.apply([], asteroidJson.meshes[0].faces), asteroidJson.meshes[0].texturecoords[0], this.textureLoader.textures["rock"], gl.DYNAMIC_DRAW, gameObject.transform)
            }

            var renderData = this.player.renderData;
            this.textureProgram.drawMesh(this.gl, rocketJson.meshes[0].vertices, [].concat.apply([], rocketJson.meshes[0].faces), rocketJson.meshes[0].texturecoords[0], this.textureLoader.textures["susan"], gl.DYNAMIC_DRAW, this.player.transform)

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

            this.player.transform.rotation.x = (this.player.transform.rotation.x + 1) % 360
            for (var i = 0; i < this.crates.length; i++) {
                var crate = this.crates[i];
                if (updateNum % 1000 == 60) {
//                    this.crates[i].transform.position = new Vector3(0,0,0)
                }
                if (i < this.crates.length/3) {
                    crate.transform.rotation.x = (crate.transform.rotation.x + 1) % 360
                }
                else if (i < this.crates.length * 2/3) {
                    crate.transform.rotation.y = (crate.transform.rotation.y + 1) % 360
                }
                else{
                    crate.transform.rotation.z = (crate.transform.rotation.z + 1) % 360
                }


            }

//            if (updateNum % 100 == 0) {

//            }
//
//            if (updateNum % 100 == 50) {
//                for (var i = 0; i < this.asteroids.length; i++) {
//                    this.asteroids[i].addForce(Vector3.random(10));
//                }
//            }
            updateNum++;
            await this.sleep(1000/60);
        }
    }

    createAsteroids(numAsteroids, asteroidJson) {
        console.log("Creating asteroids");
        for (var i = 0; i < numAsteroids; i++) {
            var asteroid = new MeshObject("asteroid" + i, Vector3.random(30), this.textureLoader.getTexture("susan"), this.gl.DYNAMIC_DRAW, this.textureProgram)
            asteroid.transform.scale.add(Vector3.random(10))
            asteroid.transform.rotation.x = Math.random() * 360
            asteroid.transform.rotation.y = Math.random() * 360
            asteroid.transform.rotation.z = Math.random() * 360
            asteroid.transform.scale = new Vector3(.1,.1,.1)
            this.asteroids.push(asteroid);
            this.addGameObject(asteroid);
        }
    }

    createPlayer(rocketJson) {
        console.log("Creating player");
        this.player = new Player("Player", new Vector3(0,0,0), this.textureLoader.getTexture("burningCrate"), this.gl.DYNAMIC_DRAW, this.textureProgram);
        this.addGameObject(this.player);
    }

    createCrates(numCrates) {
        console.log("Creating crates");
        for (var i = 0; i < numCrates; i++) {
            var crate = new Cube("crate" + i, Vector3.random(10), this.textureLoader.getTexture("crate"), this.gl.DYNAMIC_DRAW, this.textureProgram)
            crate.transform.rotation.x = Math.random() * 360
            crate.transform.rotation.y = Math.random() * 360
            crate.transform.rotation.z = Math.random() * 360
            this.crates.push(crate);
            this.addGameObject(crate);
        }
    }

    addGameObject(gameObject) {
        this.activeGameObjects.push(gameObject);
//        this.renderer.addObject(gameObject)
    }

    createWalls() {
        console.log("Walls have not yet been implemented");
    }
}
