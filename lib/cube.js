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
            var deltaPos = this.velocity.scaled(deltaTime);
            this.transform.position.add(deltaPos);
            this.renderData.addOffsetToVertices(deltaPos);
            this.applyDrag()
        }
    }
}
