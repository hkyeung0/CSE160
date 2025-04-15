class TriangleFree{
  constructor(){
	  this.type = 'trianglefree';
	  this.position = [0.0, 0.0, 0.0];
	  this.color = [1.0, 1.0, 1.0, 1.0];
	  this.size = 5.0;
	  this.v1 = [0,0];
	  this.v2 = [0.5,0];
	  this.v3 = [0,0.5];
  }
  
  render(){
	var xy = this.position;
	var rgba = this.color;
	var size = this.size;
	var v1 = this.v1;
	var v2 = this.v2;
	var v3 = this.v3;
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
	
	// Pass the size of a point to u_Size variable
	gl.uniform1f(u_Size, size);
	
	// Draw
	var d = this.size/200.0; // delta
	drawTriangle( [v1[0], v1[1], v2[0], v2[1], v3[0], v3[1] ] );
  }
  
}


function drawTriangle(vertices) {
  //var vertices = new Float32Array([0, 0.5,   -0.5, 0.5,   0.5, -0.5]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  
  return n;
}