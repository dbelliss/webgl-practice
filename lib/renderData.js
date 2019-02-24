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
            RenderData.textureToVertices[textureName] = new Float32Array(this.vertices.length * 5)
            RenderData.textureToIndices[textureName] = new Uint16Array(this.indices.length * 5)
            RenderData.numVerticesInList[textureName] = 0
            RenderData.numIndicesInList[textureName] = 0
        }

        if (RenderData.textureToVertices[textureName].length < this.vertices.length +  RenderData.numVerticesInList[textureName]) {
            var expandedArr = new Float32Array(RenderData.textureToVertices[textureName].length * 2)
            for (var i = 0; i < RenderData.numVerticesInList[textureName]; i++) {
                expandedArr[i] = RenderData.textureToVertices[textureName][i]
            }
            RenderData.textureToVertices[textureName] = expandedArr
        }

        if (RenderData.textureToIndices[textureName].length < this.indices.length +  RenderData.numIndicesInList[textureName]) {
            var expandedArr = new Uint16Array(RenderData.textureToIndices[textureName].length * 2)
            for (var i = 0; i < RenderData.numIndicesInList[textureName]; i++) {
                expandedArr[i] = RenderData.textureToIndices[textureName][i]
            }
            RenderData.textureToIndices[textureName] = expandedArr
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
        for (var i = 0; i < this.vertices.length; i++) {
            RenderData.textureToVertices[this.textureName][this.vertexStart + i] = vertices[i];
        }
        this.vertices = vertices;
    }

    addOffsetToVertices(offset) {
        for (var i = 0; i < this.vertices.length/5; i++) {
            RenderData.textureToVertices[this.textureName][this.vertexStart + (i * 5)] += offset.x;
            RenderData.textureToVertices[this.textureName][this.vertexStart + (i * 5) + 1] += offset.y;
            RenderData.textureToVertices[this.textureName][this.vertexStart + (i * 5) + 2] += offset.z;
        }
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