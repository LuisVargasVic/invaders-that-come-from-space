class GlApp {

  constructor ({ canvas, clearColor, animate, data }) {
    this.data = Object.assign({}, data)
    this.animate = animate
    this.components = []
    this.projectiles = []
    // Get a WebGL Context.
    this.canvas = document.getElementById(canvas)
    this.gl = this.canvas.getContext("webgl")
    // Handle error by not performing any more tasks.
    if (!this.gl) return console.log("Error getting webgl")
    // Set the clear color
    this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3])
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
  }

  addCamera (camera) {
    this.camera = camera;
  }

  updateCamera () {
    this.camera.update();
  }

  pauseAnimation () {
    this.animate = false
  }

  resumeAnimation () {
    this.animate = true
    this.run()
  }

  addComponent (component) {
    this.components.push(component)
  }

  addProjectile (component, timeout) {
    let self = this
    this.projectiles.push(component)
    setTimeout(function () {
      let index = self.projectiles.indexOf(component)
      if (index !== -1)
        self.projectiles.splice(index, 1)
      else
        console.log("Not found!")
    }, timeout)
  }

  addComponents (components) {
    this.components = this.components.concat(components)
  }

  removeComponent (index) {
    this.components.splice(index, 1)
  }

  run () {
    let self = this;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    // Mapping from clip-space coords to the viewport in pixels
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    // Tell each component to render itthis
    for (let component of this.components) {
      component.update()
      component.loadCameraData(this.camera)
      component.render()
    }

    for (let component of this.projectiles) {
      component.update()
      component.loadCameraData(this.camera)
      component.render()
      let returnVal = component.checkCollision(this.components);
      if (returnVal[0]) {
        console.log(returnVal);
        let enemyIndex = this.components.indexOf(returnVal[1]);
        console.log("Enemy index: ", enemyIndex);
        if (enemyIndex !== -1) {
          console.log("Deleting enemy", enemyIndex)
          this.components.splice(enemyIndex, 1);
          console.log(this.components);

        }
      }
    }
    // Animate if needed
    if (this.animate) {
      requestAnimationFrame(function () { self.run() })
    }
  }
}