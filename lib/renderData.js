"use strict";

/**
 * Stores vertices and indices used to render a GameObject
 * vertices is a list of floats that contain the data use to render and object
 * indices is a list of ints to show which vertices should be used to construct each polygon
 */
class RenderData {
    constructor(vertices, indices, textureName, drawType) {
        this.vertices = vertices;
        this.indices = indices;
        this.textureName = textureName;
        this.drawType = drawType
    }

    setVertices(vertices) {
        this.vertices = vertices;
    }

    getIndices() {
        return this.indices;
    }

    getVertices() {
        return this.vertices;
    }
}