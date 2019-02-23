
class Player extends Cube {

    constructor(_name, offset=new Vector3(0,0,0)) {
        super(_name);
        this.moveDir = new Vector3(0,0,1)
        this.thrust = 1
        this.turnPower = .05
        this.theta = 0
        this.phi = 0
    }

    fixedUpdate(deltaTime) {
        var input = InputManager.readInput().scaled(this.turnPower)
        this.theta += input.x
        this.phi += input.y
        var sin = Math.sin
        var cos = Math.cos
        var theta = this.theta
        var phi = this.phi
        this.moveDir = new Vector3(sin(theta), sin(phi), cos(theta) * cos(phi))
        var shouldMove = InputManager.isKeyPressed("space");
        if (shouldMove) {
            this.drag = .05
            this.addForce(this.moveDir.scaled(this.thrust));
        }
        else {
            this.drag = 1
        }

        super.fixedUpdate(deltaTime)
    }
}