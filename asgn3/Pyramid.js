class Pyramid{
  constructor(){
	  this.type = 'Pyramid';
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
	
	// front of pyramid
	drawTriangle3D([0,0,0, 1,0,0, .5,1,.5]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
	
	//	left of pyramid
	drawTriangle3D([0,0,0, 0,0,1, .5,1,.5]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.65, rgba[1]*.65, rgba[2]*.65, rgba[3]);
	
	//	bottom of pyramid
	drawTriangle3D( [0, 0, 0,  0, 0, 1,  1, 0, 1]);
	drawTriangle3D( [0, 0, 0,  1, 0, 1,  1, 0, 0]);
	
	//	back of pyramid
	drawTriangle3D([1,0,1, 0,0,1, .5,1,.5]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
	
	//	right of pyramid
	drawTriangle3D([1,0,0, 1,0,1, .5,1,.5]);
	
    } 
  
}