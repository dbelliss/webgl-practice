"use strict";

/**
 * Class for a cube GameObject
 */
class MeshObject extends GameObject{
    constructor(_name, position, texture, drawType, program, json) {
        super(_name, position, texture);
        var box = generateTexturedBox([position.x, position.y, position.z]);
        this.program = program
        this.json = json
//        this.renderData = new RenderData(this.transform, this.program, box[0], box[1], texture, drawType);
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
