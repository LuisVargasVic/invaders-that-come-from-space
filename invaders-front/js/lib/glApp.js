class GlApp {

  constructor ({ canvas, canvasText, life, clearColor, animate, data }) {
    this.data = Object.assign({}, data)
    this.animate = animate
    this.components = []
    this.projectiles = []
    this.closeEnough = 1

    // Get a WebGL Context.
    this.canvas = document.getElementById(canvas)
    this.gl = this.canvas.getContext("webgl")

	  this.canvasText = document.getElementById(canvasText)
    this.ctx = this.canvasText.getContext('2d')
    this.points = 0
    
    this.elem = document.getElementById(life)
    this.life = 100
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

  lowLife () {
    this.life = this.life - 20
    this.elem.style.width = this.life + '%'
    console.log(this.life)
  }

  run () {
    let self = this;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    // Mapping from clip-space coords to the viewport in pixels
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle= "red"
    this.ctx.font = "italic bold 20pt Tahoma"
    //syntax : .fillText("text", x, y)
    
    this.ctx.fillText("Points: "+this.points,30,80)
    for (let component of this.projectiles) {
      component.update()
      component.loadCameraData(this.camera)
      component.render()
      let returnVal = component.checkCollision(this.components)
      if (returnVal[0]) {
      this.points++
      this.ctx.clearRect(0, 0, this.canvasText.width, this.canvasText.height);
      this.ctx.fillText("Points: "+this.points,30,80)
        let enemyIndex = this.components.indexOf(returnVal[1])
        if (enemyIndex !== -1) {
          this.components.splice(enemyIndex, 1)
        }
      }
    }

    // Tell each component to render itthis
    for (let component of this.components) {
      component.update()
      component.loadCameraData(this.camera)
      component.render()
      // 
      let distance = component.checkClose()
      if (distance <= this.closeEnough) {
        this.lowLife()
        let enemyIndex = this.components.indexOf(component)
        if (enemyIndex !== -1) {
          this.components.splice(enemyIndex, 1)
        }
      }
    }
    // Animate if needed
    if (this.animate) {
      requestAnimationFrame(function () { self.run() })
    }
  }
}