class Cube{
  constructor(){
	  this.type = 'cube';
	  //this.position = [0.0, 0.0, 0.0];
	  this.color = [1.0, 1.0, 1.0, 1.0];
	  //this.size = 5.0;
	  //this.segments = 10;
	  this.matrix = new Matrix4();
	  this.textureNum = 0;
  }
  
  renderfast(){
	//var xy = this.position;
	var rgba = this.color;
	//var size = this.size;
	
	// pass the texture Number
	gl.uniform1i(u_whichTexture, this.textureNum);
	//console.log( u_whichTexture + " , " + this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
	
	gl.uniformMatrix4fv( u_ModelMatrix, false, this.matrix.elements);
	
	// Pass the size of a point to u_Size variable
	//gl.uniform1f(u_Size, size);
	
	// front of cube
	drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
	drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);
	//drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
	//drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

	//	top of cube
	drawTriangle3DUV([0, 1, 0,  0, 1, 1,  1, 1, 1], [1,0, 0,0, 0,1]);
	drawTriangle3DUV([0, 1, 0,  1, 1, 1,  1, 1, 0], [1,0, 0,1, 1,1]);
	//drawTriangle3D( [0, 1, 0,  0, 1, 1,  1, 1, 1]);
	//drawTriangle3D( [0, 1, 0,  1, 1, 1,  1, 1, 0]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.65, rgba[1]*.65, rgba[2]*.65, rgba[3]);
	
	//	bottom of cube
	drawTriangle3DUV([0, 0, 0,  0, 0, 1,  1, 0, 1], [1,0, 0,0, 0,1]);
	drawTriangle3DUV([0, 0, 0,  1, 0, 1,  1, 0, 0], [1,0, 0,1, 1,1]);
	//drawTriangle3D( [0, 0, 0,  0, 0, 1,  1, 0, 1]);
	//drawTriangle3D( [0, 0, 0,  1, 0, 1,  1, 0, 0]);
	
	// back of cube
    drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
	//drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
	//drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
	
	// left of cube
	drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [1,0, 0,0, 0,1]);
    drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [1,0, 0,1, 1,1]);
	//drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
	//drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
	
	// right of cube
	drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [1,0, 0,0, 0,1]);
    drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1]);
	//drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
	//drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);
    } 
	
	
	render(){
	//var xy = this.position;
	var rgba = this.color;
	//var size = this.size;
	
	// pass the texture Number
	gl.uniform1i(u_whichTexture, this.textureNum);
	//console.log( u_whichTexture + " , " + this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
	
	gl.uniformMatrix4fv( u_ModelMatrix, false, this.matrix.elements);
	
	var allverts = [];
	var alluvs = [];
	
	// Pass the size of a point to u_Size variable
	//gl.uniform1f(u_Size, size);
	
	allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
	allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);
	alluvs = alluvs.concat([0,0, 1,1, 1,0]);
	alluvs = alluvs.concat([0,0, 0,1, 1,1]);
	// front of cube
	//drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
	//drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);
	//drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
	//drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

	allverts = allverts.concat([0, 1, 0,  0, 1, 1,  1, 1, 1]);
	allverts = allverts.concat([0, 1, 0,  1, 1, 1,  1, 1, 0]);
	alluvs = alluvs.concat([1,0, 0,0, 0,1]);
	alluvs = alluvs.concat([1,0, 0,1, 1,1]);
	//	top of cube
	//drawTriangle3DUV([0, 1, 0,  0, 1, 1,  1, 1, 1], [1,0, 0,0, 0,1]);
	//drawTriangle3DUV([0, 1, 0,  1, 1, 1,  1, 1, 0], [1,0, 0,1, 1,1]);
	//drawTriangle3D( [0, 1, 0,  0, 1, 1,  1, 1, 1]);
	//drawTriangle3D( [0, 1, 0,  1, 1, 1,  1, 1, 0]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.65, rgba[1]*.65, rgba[2]*.65, rgba[3]);
	
	allverts = allverts.concat([0, 0, 0,  0, 0, 1,  1, 0, 1]);
	allverts = allverts.concat([0, 0, 0,  1, 0, 1,  1, 0, 0]);
	alluvs = alluvs.concat([1,0, 0,0, 0,1]);
	alluvs = alluvs.concat([1,0, 0,1, 1,1]);
	//	bottom of cube
	//drawTriangle3DUV([0, 0, 0,  0, 0, 1,  1, 0, 1], [1,0, 0,0, 0,1]);
	//drawTriangle3DUV([0, 0, 0,  1, 0, 1,  1, 0, 0], [1,0, 0,1, 1,1]);
	//drawTriangle3D( [0, 0, 0,  0, 0, 1,  1, 0, 1]);
	//drawTriangle3D( [0, 0, 0,  1, 0, 1,  1, 0, 0]);
	
	allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
	allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);
	alluvs = alluvs.concat([0,0, 1,1, 1,0]);
	alluvs = alluvs.concat([0,0, 0,1, 1,1]);
	// back of cube
    //drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    //drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
	//drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
	//drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);
	
	//pass the color 
	gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
	
	allverts = allverts.concat([0,0,0, 0,0,1, 0,1,1]);
	allverts = allverts.concat([0,0,0, 0,1,1, 0,1,0]);
	alluvs = alluvs.concat([1,0, 0,0, 0,1]);
	alluvs = alluvs.concat([1,0, 0,1, 1,1]);
	// left of cube
	//drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [1,0, 0,0, 0,1]);
    //drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [1,0, 0,1, 1,1]);
	//drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
	//drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
	
	allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);
	allverts = allverts.concat([1,0,0, 1,1,1, 1,1,0]);
	alluvs = alluvs.concat([1,0, 0,0, 0,1]);
	alluvs = alluvs.concat([1,0, 0,1, 1,1]);
	// right of cube
	//drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [1,0, 0,0, 0,1]);
   //drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1]);
	//drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
	//drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);
	drawTriangle3DUV( allverts, alluvs);
	
    } 
  
}

