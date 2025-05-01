class Cube{
  constructor(){
	  this.type = 'cube';
	  //this.position = [0.0, 0.0, 0.0];
	  this.color = [1.0, 1.0, 1.0, 1.0];
	  //this.size = 5.0;
	  //this.segments = 10;
	  this.matrix = new Matrix4();
  }
  
  render(){
	//var xy = this.position;
	var rgba = this.color;
	//var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
	
	gl.uniformMatrix4fv( u_ModelMatrix, false, this.matrix.elements);
	
	// Pass the size of a point to u_Size variable
	//gl.uniform1f(u_Size, size);
	
	// front of cube
	drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
	drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
	
	// Draw
	//var d = this.size/200.0; // delta
	//let angleStep = 360/this.segments;
	//for (var angle = 0; angle < 360; angle = angle + angleStep) {
	//	let centerPt = [xy[0], xy[1]];
	//	let angle1 = angle;
	//	let angle2 = angle + angleStep;
	//	let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
	//	let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
	//	let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
	//	let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

	//	top of cube
	drawTriangle3D( [0, 1, 0,  0, 1, 1,  1, 1, 1]);
	drawTriangle3D( [0, 1, 0,  1, 1, 1,  1, 1, 0]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.65, rgba[1]*.65, rgba[2]*.65, rgba[3]);
	
	//	bottom of cube
	drawTriangle3D( [0, 0, 0,  0, 0, 1,  1, 0, 1]);
	drawTriangle3D( [0, 0, 0,  1, 0, 1,  1, 0, 0]);
	
	// back of cube
	drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
	drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
	
	// left of cube
	drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
	drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
	
	// right of cube
	drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
	drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);
    } 
  
}

