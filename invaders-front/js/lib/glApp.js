class GlApp {

  constructor ({ canvas, canvasText, life, clearColor, animate, data }) {
    this.data = Object.assign({}, data)
    this.animate = animate
    this.components = []
    this.projectiles = []
    this.closeEnough = 1
    this.username = "GNRC"
    this.gameOver = false

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
    console.log("Life: ", this.life)
  }

  run () {
    console.log("Components Length: ", this.components.length)
    if(this.components.length < 10)
    {
      this.addEnemy()
    }
    let self = this;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    // Mapping from clip-space coords to the viewport in pixels
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle= "red"
    this.ctx.font = "italic bold 20pt Tahoma"
    //syntax : .fillText("text", x, y)
    
    this.ctx.fillText("Points: "+this.points,30,80)
    for (let projectile of this.projectiles) {
      projectile.update()
      projectile.loadCameraData(this.camera)
      projectile.render()
      let returnVal = projectile.checkCollision(this.components)
      if (returnVal[0]) {
        this.points++
        this.ctx.clearRect(0, 0, this.canvasText.width, this.canvasText.height);
        this.ctx.fillText("Points: "+this.points,30,80)
        let enemyIndex = this.components.indexOf(returnVal[1])
        if (enemyIndex !== -1) {
          this.components.splice(enemyIndex, 1)
          let projectileIndex = this.projectiles.indexOf(projectile)
          if (projectileIndex !== -1) {
            this.projectiles.splice(projectileIndex, 1)
          }
        }
        this.sendScore()
      }
    }

    // Tell each component to render itself
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

    if (this.life == 0){
      this.gameOver = true
    }

    // Animate if needed
    if (this.animate) {
      requestAnimationFrame(function () { self.run() })
    }
  }

  addEnemy()
  {
    let randX = Math.floor((Math.random() * 100) + 1);
    randX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

    let randY = Math.floor((Math.random() * 80) + 1);
    randY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

    let randZ = Math.floor((Math.random() * 50) + 100);
    randZ *= -1;

    let enemy = new Enemy({
      gl: gl,
      points: [
        1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1,
        -1, -1, -1
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,
        4, 7, 5,
        7, 6, 5,
        7, 2, 1,
        7, 1, 6,
        6, 0, 5,
        6, 1, 0,
        5, 0, 4,
        0, 3, 4,
        3, 2, 7,
        4, 3, 7
      ],
      center: [0., 0., 0.]
    });
    enemy.setDrawingMode("per-vertex-color");
    enemy.translate(randX, randY, randZ);

    this.components.push(enemy);
  }

  sendScore () {
    var data = {
      userId: this.username,
      score: this.points
    }
    var options = {
      hostname: 'localhost',
      port: 8080,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    };
    fetch("api/score", options)
      .then(res => {
        console.log(res);
      });
  }
}

function mouseUpEventListener(event) {
	let e = mainApp.camera.eye
	let center = mainApp.camera.center
	let points = [
		e[0] + .25, e[1] + .25, e[2] + .25,
		e[0] - .25, e[1] + .25, e[2] + .25,
		e[0] - .25, e[1] - .25, e[2] + .25,
		e[0] + .25, e[1] - .25, e[2] + .25,
		e[0] + .25, e[1] - .25, e[2] - .25,
		e[0] + .25, e[1] + .25, e[2] - .25,
		e[0] - .25, e[1] + .25, e[2] - .25,
		e[0] - .25, e[1] - .25, e[2] - .25
	]
	let projectile = new Projectile({
		gl,
		points,
		indices: [
			0, 1, 2,
			0, 2, 3,
			4, 7, 5,
			7, 6, 5,
			7, 2, 1,
			7, 1, 6,
			6, 0, 5,
			6, 1, 0,
			5, 0, 4,
			0, 3, 4,
			3, 2, 7,
			4, 3, 7
		],
		center
	})

	let timeout = 1 * 2000
	mainApp.addProjectile(projectile, timeout)
}