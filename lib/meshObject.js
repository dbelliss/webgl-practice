"use strict";

/**
 * Class for a cube GameObject
 */
class MeshObject extends GameObject{
    constructor(_name, position, texture, json) {
        super(_name, position, texture);
        this.json = json
        this.renderData = []
        for (var i = 0; i < json.meshes.length; i++) {
            var vertices = json.meshes[i].vertices
            var indices = [].concat.apply([], json.meshes[i].faces)
            var textureVertices = json.meshes[i].texturecoords[0]
            this.renderData.push(new RenderData(this.transform, texture, vertices, indices, textureVertices))
        }
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
