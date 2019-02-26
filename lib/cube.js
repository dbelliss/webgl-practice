"use strict";

/**
 * Class for a cube GameObject
 */
class Cube extends GameObject{
    constructor(_name, position, texture) {
        super(_name, position, texture);
        var box = generateTexturedBox([0,0,0]);
        this.renderData = [new RenderData(this.transform, texture, box[0], box[2], box[1])]
        this.transform.position = position;
    }

    /**
     * Gets RenderData for this object
     * @returns {RenderData} RenderData for this cube
     */
    getRenderData() {
        return this.renderData
    }
}
