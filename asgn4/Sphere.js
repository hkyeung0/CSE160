function cos(x){
	return Math.cos(x);
}

function sin(x){
	return Math.sin(x);
}

class Sphere{
  constructor(){
	  this.type = 'sphere';
	  //this.position = [0.0, 0.0, 0.0];
	  this.color = [1.0, 1.0, 1.0, 1.0];
	  //this.size = 5.0;
	  //this.segments = 10;
	  this.matrix = new Matrix4();
	  this.textureNum = -2;
	  this.verts32 = new Float32Array([]);
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
	
	// Pass the size of a point to u_Size variable
	//gl.uniform1f(u_Size, size);
	
	var d = Math.PI/10;
	var dd = Math.PI/10;
	
	for (var t = 0; t < Math.PI; t+=d){
		for (var r = 0; r < (2*Math.PI); r+=d){
			var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];
			
			var p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
			var p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
			var p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];
			
			var v = [];
			var uv = [];
			v=v.concat(p1); uv=uv.concat([0,0]);
			v=v.concat(p2); uv=uv.concat([0,0]);
			v=v.concat(p4); uv=uv.concat([0,0]);
			
			gl.uniform4f(u_FragColor, 1,1,1,1);
			drawTriangle3DUVNormal(v,uv,v);
			
			v=[]; uv=[];
			v=v.concat(p1); uv=uv.concat([0,0]);
			v=v.concat(p4); uv=uv.concat([0,0]);
			v=v.concat(p3); uv=uv.concat([0,0]);
			gl.uniform4f(u_FragColor, 1,1,1,1);
			drawTriangle3DUVNormal(v,uv,v);
			}
		} 
	} 
}

