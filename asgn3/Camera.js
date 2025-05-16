class Camera{
	constructor(){
		this.fov = 30;
		//this.eye = new Vector3(0,0,3);
		//this.at = new Vector3(0,0,-1);
		//this.up = new Vector3(0,1,0);
		this.eye = new Vector3([0, 0, 10]);
        this.at = new Vector3([0, 0, 5]);
        this.up = new Vector3([0, 1, 0]);
		this.viewMatrix = new Matrix4().setIdentity();
		//this.viewMatrix = new Matrix4().setLookAt(this.eye.elements,
		//										this.at.elements,
		//										this.up.elements);
		//gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
		//this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
		//						this.at.elements[0], this.at.elements[1], this.at.elements[2], 
		//						this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        //gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
		//this.projectionMatrix = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 100);
		//gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
		this.projectionMatrix = new Matrix4().setIdentity();
		this.projectionMatrix.setPerspective(30, canvas.width/canvas.height, .1, 100);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
		this.speed = 1;
	}
	
	moveForward(){
		let f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		f.normalize();
		f.mul(this.speed);
		//console.log(this.eye.elements[2]);
		this.eye.add(f);
		this.at.add(f);
	}
	
	moveBackward(){
		let b = new Vector3();
		b.set(this.at);
		b.sub(this.eye);
		b.normalize();
		b.mul(this.speed);
		this.eye.sub(b);
		this.at.sub(b);
	}
	
	moveLeft(){
		let f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		let s = Vector3.cross(this.up, f);
		//s = this.up;
		//s = Vector3.cross(s, f);
		s.normalize();
		s.mul(this.speed);
		this.eye.sub(s);
		this.at.sub(s);
	}
		
	moveRight(){
		let f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		let s = Vector3.cross(f, this.up);
		//s = this.up;
		//s = Vector3.cross(f, s);
		s.normalize();
		s.mul(this.speed);
		this.eye.sub(s);
		this.at.sub(s);
	}
	
	panLeft(alpha){
		let f = new Vector3(this.at.elements);
		f.sub(this.eye);
		
		let rotateMatrix = new Matrix4();
		rotateMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		
		f = rotateMatrix.multiplyVector3(f);
		f.add(this.eye);
		this.at = f;

	}
	
	panRight(alpha){
		let f = new Vector3(this.at.elements);
		f.sub(this.eye);
		
		let rotateMatrix = new Matrix4();
		rotateMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		
		f = rotateMatrix.multiplyVector3(f);
		f.add(this.eye);
		this.at = f;
	}
	
	panUp(){
		this.at.elements[1] += .2;
	}
	
	panDown(){
		this.at.elements[1] -= .2;
	}
	
}
		