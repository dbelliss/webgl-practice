"use strict";

/**
 * Class for a cube GameObject
 */
class Cube extends GameObject{
    constructor(_name, position, textureName, drawType) {
        super(_name, position, textureName);
        var box = generateTexturedBox([position.x, position.y, position.z]);
        this.renderData = new RenderData(box[0], box[1], textureName, drawType);
        this.transform.position = position;
    }

    /**
     * Gets RenderData for this object
     * @returns {RenderData} RenderData for this cube
     */
    getRenderData() {
        return this.renderData
    }

    /**
     * Physics update the cube
     * @param {deltaTime} float for the amount of seconds that have passed since the last fixedUpdate
     */
    fixedUpdate(deltaTime) {
        if (!(this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0)) {
            this.transform.position.add(this.velocity.scaled(deltaTime));
            this.renderData.setVertices(generateTexturedBox([this.transform.position.x, this.transform.position.y, this.transform.position.z])[0]);
            this.applyDrag()
        }
    }
}
