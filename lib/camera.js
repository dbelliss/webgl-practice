'use strict';

/**
* Class for controlling the Camera
* @param {gl} OpenGL object
* @param {worldMatrix}
* @param {viewMatrix}
* @param {projMatrix}
*/
class Camera {
    constructor(gl, worldMatrix, viewMatrix, projMatrix) {
        this.gl = gl;
        this.worldMatrix = worldMatrix;
        this.viewMatrix = viewMatrix;
        this.projMatrix = projMatrix;
        this.relativePosition = new Vector3(0, 0, -20)
        this.distance = Math.sqrt(Math.pow(this.relativePosition.x, 2) + Math.pow(this.relativePosition.y, 2) + Math.pow(this.relativePosition.z, 2))
        this.c = new Vector3(0, 0, -1);
        this.xPeriod = 0
        this.yPeriod = 0
    }



   /**
    * Moves the camera so that it is relative to the given GameObject
    *
    * @param {gameObject} GameObject to stay relative to
    */
    trackObject(gameObject, dx, dy) {
        if (dx != 0) {
            this.xPeriod += dx
            var y = this.c.y;
            var xzd = 1 - Math.pow(y, 2)

            var x = (this.linearSin(this.xPeriod, xzd, 1) * xzd)
            console.log(this.xPeriod)
            while (this.xPeriod - 1 > 0) {
                this.xPeriod = this.xPeriod - 1
            }
            var z = Math.sqrt(xzd - Math.pow(x, 2))
            if (this.xPeriod > 1/4 && this.xPeriod< 3/4) {
                z = -z
            }
            this.c = new Vector3(x,y,z)
                    console.log(this.c)
        }
        if (dy != 0) {
            this.yPeriod += dy
            var x = this.c.x;
            var yzd = 1 - Math.pow(x, 2)

            var y = (this.linearSin(this.yPeriod, yzd, 1) * yzd)
            console.log(this.yPeriod)
            while (this.yPeriod - 1 > 0) {
                this.yPeriod = this.yPeriod - 1
            }
            var z = Math.sqrt(yzd - Math.pow(y, 2))
            if (this.yPeriod > 1/4 && this.yPeriod< 3/4) {
                z = -z
            }
            this.c = new Vector3(x,y,z)
                    console.log(this.c)
        }

          if (this.xPeriod > 1/4 && this.xPeriod< 3/4) {
                z = -z
            }
            if (this.yPeriod > 1/4 && this.yPeriod< 3/4) {
                z = -z
            }

        var d = this.distance
        var v = new Vector3(this.c.x * d, this.c.y * d, this.c.z * d)
//        var v = new Vector3(d * Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi) * d, Math.cos(theta) * d)
//        console.log(v)
//        console.log(phi)
//        console.log(v)
        glMatrix.mat4.lookAt(this.viewMatrix,
                             [v.x + gameObject.transform.position.x, v.y + gameObject.transform.position.y, v.z + gameObject.transform.position.z],
                             [gameObject.transform.position.x, gameObject.transform.position.y, gameObject.transform.position.z],
                             [0, 1, 0]);
    }


   /**
    * Returns a value between -1 and 1
    * Creates graph similar to sin, but linear
    * Assume 1 period is 360 units
    *
    * @param {x}
    */
    linearSin(x, maxVal, period) {
        while (x - period > 0) {
            x = x - period
        }
        if (x <= period/4) {
            return x/(period/4) * maxVal;
        }
        if (x <= period/2) {
            return maxVal - this.linearSin(x - period/4, maxVal, period)
        }
        if (x <= 3 * period/4) {
            return -this.linearSin(x - period/2, maxVal, period);
        }
        else {
            return -(this.linearSin(x - period/2, maxVal, period))
        }
    }

    linearCos(x) {
        return this.linearSin(x + 270)

    }
}