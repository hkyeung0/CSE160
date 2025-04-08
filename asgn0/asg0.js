   // DrawRectangle.js
   var ctx;
   var convas;
   function main() {
    // Retrieve <canvas> element                             
     canvas = document.getElementById('example');
     if (!canvas) {
       console.log('Failed to retrieve the <canvas> element');
       return;
     }

   // Get the rendering context for 2DCG                        
   ctx = canvas.getContext('2d');

   // Create v1 
   var v1 = new Vector3([2.25, 2.25, 0.0]);
   // Set black color
   ctx.fillStyle = 'black'; 
   // Fill rectangle
   ctx.fillRect(0, 0, 400, 400); 
   // Draw v1 with red
   drawVector(v1, "red")
   }
   
   function drawVector(v, color){
	ctx.strokeStyle = color; 
	let cx = canvas.width/2;
	let cy = canvas.height/2;
	ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(200 + v.elements[0]*20, 200 - v.elements[1]*20, v.elements[2]*20);
    ctx.stroke();
}

   function handleDrawEvent() {
    // Clear the canvas and refill
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    // Read the input values to create v1,2
    var x1 = document.getElementById('x1').value;
    var y1 = document.getElementById('y1').value;
    var x2 = document.getElementById('x2').value;
    var y2 = document.getElementById('y2').value;
    
    // Draw new v1,2
    var v1 = new Vector3([x1, y1, 0.0]);
    drawVector(v1, "red");
    var v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v2, "blue");
   }

   function handleDrawOperationEvent() {
	// Clear the canvas and refill
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
	
	// Read the values to create v1,2
    var x1 = document.getElementById('x1').value;
    var y1 = document.getElementById('y1').value;
    var x2 = document.getElementById('x2').value;
    var y2 = document.getElementById('y2').value;
    
    // Draw v1,2
    var v1 = new Vector3([x1, y1, 0.0]);
    drawVector(v1, "red");
    var v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v2, "blue");
	
	// Draw operation
	var opt = document.getElementById('op').value;
	
	// add v1 and v2
    if (opt == 'add'){
        v1.add(v2);
        drawVector(v1, "green");
    } 
	
	// subtract v1 and v2
	else if (opt == 'sub') {
        v1.sub(v2);
        drawVector(v1, "green");
    } 
	
	// divide v1 and v2 by scalar
	else if (opt == 'div') {
        var s = document.getElementById('scalar').value;
        v1.div(s);
        v2.div(s);
		drawVector(v1, "green");
        drawVector(v2, "green");
    }

	// multiply v1 and v2 by scalar
	else if (opt == 'mult') {
        var s = document.getElementById('scalar').value;
        v1.mul(s);
        v2.mul(s);
		drawVector(v1, "green");
        drawVector(v2, "green");
	} 
	
	// calculate magnitude
	else if (opt == 'mag') {
        var mag1 = v1.magnitude()
		var mag2 = v2.magnitude()
        console.log("Magnitude v1: " + mag1);
        console.log("Magnitude v2: " + mag2);
	} 
	
	// calculate normalization
	else if (opt == 'norm') {
        v1.normalize();
        v2.normalize();
		drawVector(v1, "green");
        drawVector(v2, "green");
	} 
	
	// calculate angle between v1 and v2
	else if (opt == 'angle') {
        var an = angleBetween(v1, v2);
		console.log("Angle: " + an);
	} 
	
	// calculate area of triangle
	else if (opt == 'area') {
        var a = areaTriangle(v1, v2);
		console.log("Area of the triangle: " + a);
	}
}

   function angleBetween(v1, v2) {
	var angle = Math.acos(Vector3.dot(v1, v2)/(v1.magnitude() * v2.magnitude()));
	angle *= 180 / Math.PI;
	return angle;
}
   
    function areaTriangle(v1, v2){
	 var cross12 = Vector3.cross(v1, v2);
	 var v3 = new Vector3([cross12[0], cross12[1], cross12[2]]);
	 return v3.magnitude() / 2;
}