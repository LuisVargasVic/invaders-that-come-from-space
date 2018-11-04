class GlBuffer {
    
    constructor ({ gl, type, initialData, isElement }) {
        this.gl = gl
        this.vbo = this.gl.createBuffer()
        this.type = type
        this.isElement = isElement
        if (initialData != null && !this.isElement)
            this.loadBufferData(initialData)
        else if (initialData != null && this.isElement)
            this.loadBufferElementData(initialData)
    }

    loadBufferData (bufferData) {
        if (bufferData == null) return
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new this.type(bufferData), this.gl.STATIC_DRAW)
    }

    loadBufferElementData (bufferData) {
        if (bufferData == null) return
        gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo);
        gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(bufferData), this.gl.STATIC_DRAW);
    }

    bind () {
        if (this.isElement) {
            gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo);
        } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        }
    }


}