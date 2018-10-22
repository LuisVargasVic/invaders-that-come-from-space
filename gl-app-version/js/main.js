"use strict"

var pointShader, singleColorShader, perVertexColorShader

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

	let cube = new Cube({
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

	cube.setDrawingMode('per-vertex-color');

	let cube2 = new Cube({
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

	cube2.setDrawingMode("single-color");

	cube.translate(0, 0, -5);
	cube2.translate(-10, 0, 0);

	components.push(cube);
	components.push(cube2);

	return components
}

var mainApp
var gl

function mouseMoveEventListener(event) {
	let x = event.clientX;
	let y = event.clientY;
	let rect = event.target.getBoundingClientRect();
	let maxX = rect.right;
	let maxY = rect.bottom;
	x = x - rect.left;
	y = y - rect.top;
	var factor = 10.0 / canvas.height; // The rotation ratio
	mainApp.camera.center = [-(maxX / 2 - x) * factor, (maxY / 2 - y) * factor, 0.];
	mainApp.updateCamera();
	mainApp.run();

}

function initEventHandlers() {
	// canvas.addEventListener("mousedown", mouseDownEventListener, false)
	// canvas.addEventListener("mouseup", mouseUpEventListener, false)
	canvas.addEventListener("mousemove", mouseMoveEventListener, false)
}

var canvas

function main() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	mainApp = new GlApp({ canvas: "canvas", clearColor: [0., 0., 0., 1.], animate: false })
	if (!mainApp.gl) return
	gl = mainApp.gl
	var components = createComponents(mainApp.gl)
	// Adding a component can be done in one of the following ways:
	
	// For one component at a time
	// mainApp.addComponent(components[0])
	
	// For multiple components
	mainApp.addComponents(components)

	let camera = new Camera();
	camera.setPerspective()

	mainApp.addCamera(camera);

	mainApp.run()
	initEventHandlers();
}
