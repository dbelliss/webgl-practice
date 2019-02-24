class RenderData {
    constructor(indices, vertices) {
        this.indices = indices;
        this.vertices = vertices;
    }

    updateIndices(indices) {
        this.indices = indices;
    }

    getIndices() {
        return this.indices;
    }

    getVertices() {
        return this.vertices;
    }
}