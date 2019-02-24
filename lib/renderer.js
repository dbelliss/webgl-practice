"use strict";

/**
 * All rendering should be done in this class
 * GameObject are added to a renderer instance along with their texture
 * When the render function is called, all previously added objects are rendered in groups
 *
 * All objects with the same texture have their vetices and indices
 * concatenated before being sent to GPU for performance reasons
 *
 */
class Renderer {
    constructor(gl, textureLoader, program) {
        this.gl = gl
        this.textureLoader = textureLoader;
        this.program = program;
        this.textureToGameObjects = {} // Stores a list of gameObjects for each texture
    }

    /**
     * Adds a gameObject to be rendered
     *
     * If the texture on the gameObject has not been seen before, add a new entry to the map
     * @param {gameObject} GameObject to render for each frame
     */
    addObject(gameObject) {
        const textureName = gameObject.renderData.textureName
        var l = this.textureToGameObjects[textureName]
        if (l === undefined) {
            this.textureToGameObjects[textureName] = []
            l = this.textureToGameObjects[textureName]
        }
        l.push(gameObject)
    }

    /**
     * Render all enabled gameObjects
     *
     * If the texture on the gameObject has not been seen before, add a new entry to the map
     * @param {gameObject} GameObject to render for each frame
     */
    render(textureLoader) {
        var allVertices = []
        var allIndices = []
        var renderData = null
        var texture = null
        var drawType = null
        for (const [textureName, gameObjectList] of Object.entries(this.textureToGameObjects)) {
            texture = this.textureLoader.getTexture(textureName)
            drawType = this.textureToGameObjects[textureName][0].renderData.drawType;
            if (texture === null || texture === undefined) {
                console.log("Unknown texture: ", textureName)
                continue;
            }
            // Try to combine multiple objects into the same draw call to maximize performance
            gameObjectList.forEach(function(gameObject) {
                if (gameObject.isEnabled && !gameObject.isDestroyed) {
                    renderData = gameObject.getRenderData()

                    // Each index must be offset by how many vertices have been inserted into the list so far
                    // Each vertex has 5 elements - Position: x,y,z, Texture Position: u,v (3 + 2 = 5)
                    var numVerticesInList = allVertices.length/5;
                    var indices = renderData.getIndices().slice()
                    for (var i = 0; i < indices.length; i++) {
                                indices[i] += numVerticesInList;
                    }
                    // Add new indices and vertices to the lists
                    allIndices = allIndices.concat(indices)
                    allVertices = allVertices.concat(renderData.getVertices())

                    if (numVerticesInList > 5000) {
                        // Flush/Draw data early if there are a lot of vertices
                        this.program.draw(this.gl, allVertices, allIndices, texture, drawType)
                        allVertices = []
                        allIndices = []
                    }
                }
            })
            if (allVertices.length > 0) {
                // Flush/Draw all remaining data
                this.program.draw(this.gl, allVertices, allIndices, texture, drawType)
            }
            allVertices.length = 0
            allIndices.length = 0
        }
    }
}
