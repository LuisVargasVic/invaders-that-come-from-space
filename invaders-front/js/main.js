"use strict"

var pointShader, singleColorShader, perVertexColorShader

class Enemy extends Cube {
	constructor ({ gl, points, indices, center }) {
		super({
			gl,
			points,
			indices,
			colors: [
				1., 1., 1., 1., // V0: r,g,b,a
				1., 0., 0., 1., // v1
				0., 1., 0., 1., // V2
				0., 0., 1., 1., // V2
				0., 1., 1., 1., // V2
				1., 0., 1., 1., // V2
				0., 1., 0., 1., // V2
				1., 1., 0., 1.
			],
			color: [1., 0., 0., 1.],
			pointSize: 10,
			shaders: {
				"pointShader": pointShader,
				"singleColorShader": singleColorShader,
				"perVertexColorShader": perVertexColorShader
			}
		});
		this.points = points.slice()
		this.center = center
		this.setUpdate(this.animate)
	}

	translate(tx, ty, tz) {
		let length = this.points.length
		for (let i = 0; i < length; i++) {
			let modulus = i % 3
			if (modulus === 0) {
				this.points[i] += tx
			} else if (modulus === 1) {
				this.points[i] += ty
			} else if (modulus === 2) {
				this.points[i] += tz
			}
		}
		super.translate(tx, ty, tz);
	}

	getCentroid () {
		let avX = 0, avY = 0, avZ = 0, length = this.points.length
		for (let i = 0; i < length; i++) {
			let modulus = i % 3
			if (modulus === 0) {
				avX += this.points[i]
			} else if (modulus === 1) {
				avY += this.points[i]
			} else if (modulus === 2) {
				avZ += this.points[i]
			}
		}
		return [avX / 8, avY / 8, avZ / 8]
	}

	getMin () {
		let minimum = [null, null, null]
		let length = this.points.length
		for (let i = 0; i < length; i++) {
			let modulus = i % 3
			if (modulus === 0) {
				if (minimum[0] == null || minimum[0] > this.points[i]) minimum[0] = this.points[i];
			} else if (modulus === 1) {
				if (minimum[1] == null || minimum[1] > this.points[i]) minimum[1] = this.points[i];
			} else if (modulus === 2) {
				if (minimum[2] == null || minimum[2] > this.points[i]) minimum[2] = this.points[i];
			}
		}
		return minimum
	}

	getMax () {
		let maximum = [null, null, null]
		let length = this.points.length
		for (let i = 0; i < length; i++) {
			let modulus = i % 3
			if (modulus === 0) {
				if (maximum[0] == null || maximum[0] < this.points[i]) maximum[0] = this.points[i];
			} else if (modulus === 1) {
				if (maximum[1] == null || maximum[1] < this.points[i]) maximum[1] = this.points[i];
			} else if (modulus === 2) {
				if (maximum[2] == null || maximum[2] < this.points[i]) maximum[2] = this.points[i];
			}
		}
		return maximum
	}

	lookAtCenter (centroid) {
		let eye = centroid
		let up = [0., 1., 0.]
		mat4.lookAt(this.modelMatrix, eye, this.center, up);
	}

	animate () {
		let centroid = this.getCentroid()
		// this.lookAtCenter(centroid)
		let tx = this.center[0] - centroid[0]
		let ty = this.center[1] - centroid[1]
		let tz = this.center[2] - centroid[2]
		let magnitude = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2) + Math.pow(tz, 2))
		this.translate(tx / magnitude * .5, ty / magnitude * .5, tz / magnitude * .5)
	}

	checkClose () {
		let centroid = this.getCentroid()
		// this.lookAtCenter(centroid)
		let tx = this.center[0] - centroid[0]
		let ty = this.center[1] - centroid[1]
		let tz = this.center[2] - centroid[2]
		let magnitude = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2) + Math.pow(tz, 2))
		return magnitude
	}
}

class Projectile extends Cube {
	constructor({ gl, points, indices, center }) {
		super({
			gl,
			points,
			indices,
			colors: [
				1., 1., 1., 1., 	 // V0: r,g,b,a
				1., 0., 0., 1., // v1
				0., 1., 0., 1., // V2
				0., 0., 1., 1., // V2
				0., 1., 1., 1., // V2
				1., 0., 1., 1., // V2
				0., 1., 0., 1., // V2
				1., 1., 0., 1.
			],
			color: [1., 0., 0., 1.],
			pointSize: 10,
			shaders: {
				"pointShader": pointShader,
				"singleColorShader": singleColorShader,
				"perVertexColorShader": perVertexColorShader
			}
		});
		this.points = points.slice()
		let centroid = this.getCentroid()
		let tx = center[0] - centroid[0]
		let ty = center[1] - centroid[1]
		let tz = center[2] - centroid[2]
		let magnitude = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2) + Math.pow(tz, 2))
		this.direction = [tx / magnitude * 0.8, ty / magnitude * 0.8, tz / magnitude * 0.8]
		this.setUpdate(this.animate)
	}

	translate(tx, ty, tz) {
		let length = this.points.length
		for (let i = 0; i < length; i++) {
			let modulus = i % 3
			if (modulus === 0) {
				this.points[i] += tx
			} else if (modulus === 1) {
				this.points[i] += ty
			} else if (modulus === 2) {
				this.points[i] += tz
			}
		}
		super.translate(tx, ty, tz);
	}

	getCentroid() {
		let avX = 0, avY = 0, avZ = 0, length = this.points.length
		for (let i = 0; i < length; i++) {
			let modulus = i % 3
			if (modulus === 0) {
				avX += this.points[i]
			} else if (modulus === 1) {
				avY += this.points[i]
			} else if (modulus === 2) {
				avZ += this.points[i]
			}
		}
		return [avX / 8, avY / 8, avZ / 8]
	}

	lookAtCenter(centroid) {
		let eye = centroid
		let up = [0., 1., 0.]
		mat4.lookAt(this.modelMatrix, eye, this.center, up)
	}

	checkCollision (enemies) {
		let centroid = this.getCentroid()
		for (let enemy of enemies) {
			let min = enemy.getMin()
			let max = enemy.getMax()
			if (centroid[0] >= min[0] && centroid[0] <= max[0] &&
				centroid[1] >= min[1] && centroid[1] <= max[1] &&
				centroid[2] >= min[2] && centroid[2] <= max[2]) 
			{
				return [true, enemy]
			}
		}
		return [false, null]
	}

	animate() {
		this.translate(this.direction[0], this.direction[1], this.direction[2])
	}
}

function createComponents(gl) {

	pointShader = new GlShader({
		gl: gl,
		vertexShader: document.getElementById("point-shader-vs").text,
		fragmentShader: document.getElementById("point-shader-fs").text,
		attributes: ["aPosition"],
		uniforms: ["uPointSize", "uColor", "uModelViewProjMatrix"]
	})

	singleColorShader = new GlShader({
		gl: gl,
		vertexShader: document.getElementById("single-color-shader-vs").text,
		fragmentShader: document.getElementById("single-color-shader-fs").text,
		attributes: ["aPosition"],
		uniforms: ["uColor", "uModelViewProjMatrix"]
	})

	perVertexColorShader = new GlShader({
		gl: gl,
		vertexShader: document.getElementById("per-vertex-color-shader-vs").text,
		fragmentShader: document.getElementById("per-vertex-color-shader-fs").text,
		attributes: ["aPosition", "aColor"],
		uniforms: ["uModelViewProjMatrix"]
	})

	var components = []

	let cube = new Enemy({
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

	cube.setDrawingMode('per-vertex-color');

	let cube2 = new Enemy({
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
	})

	cube2.setDrawingMode("per-vertex-color")

	/*
		Ranges for X, Y, Z
		X => [-100, 120]
		Y => [-80, 100]
		Z => [-40, -100] 		
	*/

	cube.translate(0, 0, -80)
	cube2.translate(-10, 0, -100)
	// cube.translate(-100, 0, -80)
	// cube2.translate(120, 0, -100)
	// cube.translate(120, -50, -80)
	// cube2.translate(120, 100, -100)
	// cube.translate(-100, -80, -80)
	// cube2.translate(-100, 30, -100)


	components.push(cube)
	components.push(cube2)

	return components
}

var mainApp
var gl

function mouseMoveEventListener(event) {
	let x = event.clientX
	let y = event.clientY
	let rect = event.target.getBoundingClientRect()
	let maxX = rect.right
	let maxY = rect.bottom
	x = x - rect.left
	y = y - rect.top
	var factor = 10.0 / canvas.height // The rotation ratio
	mainApp.camera.center = [-(maxX / 2 - x) * factor, (maxY / 2 - y) * factor, -5.]
	mainApp.updateCamera()
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

function initEventHandlers() {
	// canvas.addEventListener("mousedown", mouseDownEventListener, false)
	canvas.addEventListener("mouseup", mouseUpEventListener, false)
	canvas.addEventListener("mousemove", mouseMoveEventListener, false)
}

var canvas

function main() {
	canvas = document.getElementById("canvas")
	canvas.style.cursor = 'none'
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	mainApp = new GlApp({ canvas: "canvas", canvasText: "text", life: "life", clearColor: [0., 0., 0., 1.], animate: true })
	if (!mainApp.gl) return
	gl = mainApp.gl
	var components = createComponents(mainApp.gl)
	// Adding a component can be done in one of the following ways:
	
	// For one component at a time
	// mainApp.addComponent(components[0])
	
	// For multiple components
	mainApp.addComponents(components)

	let camera = new Camera()
	camera.setPerspective()

	mainApp.addCamera(camera)

	mainApp.run()
	initEventHandlers()
}
