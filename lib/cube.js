"use strict";

/**
 * Class for a cube GameObject
 */
class Cube extends GameObject{
    constructor(_name, position, texture, drawType, program) {
        super(_name, position, texture);
        var box = generateTexturedBox([0,0,0]);
        this.program = program
        this.renderData = new RenderData(this.transform, this.program, box[0], box[1], texture, drawType);
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
