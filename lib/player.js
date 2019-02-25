"use strict";

/**
 * Class for the Player
 * Takes in input to move the player around the map
 */
class Player extends Cube {
    constructor(_name, position, texture, drawType, program) {
        super(_name, position, texture, drawType, program);
        this.moveDir = new Vector3(0,0,1)
        this.thrust = 1
        this.turnPower = .05
        this.theta = 0
        this.phi = 0
    }

    /**
     * Physics update the GameObject
     *
     * First read in input to apply forces, then call the parent fixedUpdate()
     * @param {deltaTime} float for the amount of seconds that have passed since the last fixedUpdate
     */
    fixedUpdate(deltaTime) {
        var input = InputManager.readInput().scaled(this.turnPower)
        this.theta += input.x
        this.phi += input.y
        if (this.phi > Math.PI/3) {
            this.phi = Math.PI/3
        }
        else if (this.phi < -Math.PI/3) {
            this.phi = -Math.PI/3
        }
        var sin = Math.sin
        var cos = Math.cos
        var theta = this.theta
        var phi = this.phi
        this.moveDir = new Vector3(sin(theta), sin(phi), cos(theta) * cos(phi))
        var shouldMove = InputManager.isKeyPressed("space");
        if (shouldMove) {
            this.drag = 0
            this.addForce(this.moveDir.scaled(this.thrust));
        }
        else {
            this.drag = 1000
        }
        super.fixedUpdate(deltaTime)
    }
}