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
    constructor() {
        textureToObject = {} // Stores a list of gameObjects for each texture
    }

    addObject(texture, gameObject) {
        var l = textureToObject[texture]
        if (l === undefined) {
            textureToObject[texture] = []
            l = textureToObject[texture]
        }
        l.push(gameObject)
    }

    render() {
        const vertices = []
        const indices = []
        var renderData = null
        Object.keys(this.textureToObject).forEach(function(texture,gameObjectList) {
            // Try to combine multiple objects into the same draw call to maximize performance
            gameobjectList.forEach(function(gameObject) {
                renderData = gameObject.getRenderData()
                objectVertices = objectVertices.concat(renderData[0]) // Add new vertices to the list

                // Each index must be offset by how many vertices have been inserted into the list so far
                // Each vertex has 5 elements - Position: x,y,z, Texture Position: u,v (3 + 2 = 5)
                var numVerticesInList = vertices.length/5;
                for (var i = 0; i < renderData[1].length; i++) {
                            renderData[1][i] += numVerticesInList;
                }
                indices = indices.concat(renderData[1])

                if (numVerticesInList > 200) {
                    // Flush/Draw data early if there are a lot of vertices
                    program.draw(gl, vertices, indices)
                    vertices = []
                    indices = []
                }
            })
            if (objectVertices.length > 0) {
                // Flush/Draw all remaining data
                program.draw(gl, vertices, indices, this.textureLoader.getTexture("burningCrate"))
            }
            vertices.length = 0
            indices.length = 0
        })
    }
}
