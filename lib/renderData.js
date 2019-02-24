"use strict";

/**
 * Stores vertices and indices used to render a GameObject
 * vertices is a list of floats that contain the data use to render and object
 * indices is a list of ints to show which vertices should be used to construct each polygon
 */
class RenderData {
    constructor(vertices, indices, textureName, drawType) {
        if (RenderData.textureToVertices == undefined) {
            RenderData.textureToVertices = {}
            RenderData.textureToIndices = {}
            RenderData.numVerticesInList = {}
            RenderData.numIndicesInList = {}
        }
        this.vertices = vertices;
        this.indices = indices;

        if (RenderData.textureToVertices[textureName] === undefined) {
            RenderData.textureToVertices[textureName] = new Float32Array(100000)
            RenderData.textureToIndices[textureName] = new Uint16Array(10000)
            RenderData.numVerticesInList[textureName] = 0
            RenderData.numIndicesInList[textureName] = 0
        }
         



        this.vertexStart = RenderData.numVerticesInList[textureName]
        this.indicesStart = RenderData.numIndicesInList[textureName]

        var numVerticesInList = this.vertexStart/5
        for (var i = 0; i < indices.length; i++) {
            indices[i] += numVerticesInList;
        }

        for (var i = 0; i < this.vertices.length; i++) {
            RenderData.textureToVertices[textureName][this.vertexStart + i] = this.vertices[i]
        }

        for (var i = 0; i < this.indices.length; i++) {
            RenderData.textureToIndices[textureName][this.indicesStart + i] = this.indices[i]
        }

        this.textureName = textureName;
        this.drawType = drawType

        RenderData.numVerticesInList[textureName] += this.vertices.length
        RenderData.numIndicesInList[textureName] += this.indices.length
    }

    setVertices(vertices) {
        for (var i = 0; i < this.vertices.length - 1; i++) {
            RenderData.textureToVertices[this.textureName][this.vertexStart + i] = vertices[i];
        }
        this.vertices = vertices;
    }

    getIndices() {
        return this.indices;
    }

    getVertices() {
        return this.vertices;
    }

    static getAllRenderData() {
//        return {vertices, indices, textureName, drawType}
        return [RenderData.textureToVertices, RenderData.textureToIndices, RenderData.numVerticesInList, RenderData.numIndicesInList]
    }
}