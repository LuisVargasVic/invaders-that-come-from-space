class Camera {

    constructor() {
        this.home();
    }

    home() {
        this.eye = [0., 0., 5.];
        this.center = [0., 0., 0.];
        this.up = [0., 1., 0.];
        this.rotX = 0.;
        this.rotY = 0.;
        this.lookAt(this.eye, this.center, this.up);
    }

    above() {
        this.eye = [0., 5., 0.];
        this.center = [0., 0., 0.];
        this.up = [0, 1, 0];
        this.rotX = 0;
        this.rotY = 0;
        this.lookAt(this.eye, this.center, this.up);
    }

    lookAt(eye, center, up) {
        // View Transformation
        this.viewMatrix = mat4.create();		// Mview = I
        this.eye = eye;
        this.center = center;
        this.up = up;
        mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up);
    }

    rotate(angle, rotAxis) {
        mat4.rotate(this.viewMatrix, this.viewMatrix, angle, rotAxis);
    }

    update() {
        this.lookAt(this.eye, this.center, this.up);
    }

    setPerspective() {
        // Proj Transformation
        this.projMatrix = mat4.create();		// Mproj = I
        this.fovy = 60.;	// degrees
        this.fovy = this.fovy * Math.PI / 180.;
        this.aspect = canvas.width / canvas.height;
        this.near = 0.1;
        this.far = 1000.;
        mat4.perspective(this.projMatrix, this.fovy, this.aspect, this.near, this.far);
    }
}