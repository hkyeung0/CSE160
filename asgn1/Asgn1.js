// Hoi Lee Yeung 
// hkyeung@ucsc.edu

// Vertex shader program
// changes position
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
	gl_PointSize = u_Size;
  }`

// Fragment shader program
// changes color
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
  
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 10;
let randomColor = 0;

// Set up actions for HTML UI elements
function addActionsForhtmlUI(){
	
	// Button Events (Shope Type)
	document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick   = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
	document.getElementById('clear').onclick   = function() { g_shapesList = []; renderAllShapes(); };
	
	document.getElementById('pointButton').onclick   = function() { g_selectedType = POINT };
	document.getElementById('triButton').onclick   = function() { g_selectedType = TRIANGLE };
	document.getElementById('cirButton').onclick   = function() { g_selectedType = CIRCLE };
	
	document.getElementById('drawButton').onclick   = function() { drawpicture(); };
	document.getElementById('randomColorButton').onclick   = function() { randomColor = 1; renderAllShapes(); };
	document.getElementById('randomColorOffButton').onclick   = function() { randomColor = 0 };
	
	// Slider Events
	document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
	document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });
	document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value });
	document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegment = this.value });
	
}


function main() {
  
  // set up canvas adn gl variables
  setupWebGL();
  // set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  
  // set up actions for HTML UI
  addActionsForhtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){ if(ev.buttons == 1) { click(ev)} };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}



var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes  = [];  // The array to store size

function click(ev) {
	
  // Extract the event click and return it in WebGL coordinate
  let [x,y] = convertCoordinatesEventToGL(ev);
  //console.log("x: " + x + "y: " + y);
  // Create and store the new Point
  let point;
  if (g_selectedType == POINT){
	  point = new Point();
  } else if (g_selectedType == TRIANGLE){
      point = new Triangle();
  } else if (g_selectedType == CIRCLE){
	  point = new Circle();
	  point.segments = g_selectedSegment;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  //g_points.push([x, y]);
  
  // Store the color to g_colors array
  //g_colors.push(g_selectedColor.slice());
  
  // Store the size to g_sizes array
  //g_sizes.push(g_selectedSize);
  
  // Store the coordinates to g_points array
  //if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //  g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  //} else if (x < 0.0 && y < 0.0) { // Third quadrant
  //  g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  //} else {                         // Others
  //  g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  //}
  
  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
  
}

// Extract the event click and return it in WebGL coordinate
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x,y]);
}

// Draw every shapes thats supposed to be in the canvas
function renderAllShapes(){
  // check the time at the start of this function
  var startTime = performance.now();
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw each shape in the list
  var len = g_shapesList.length;
  
  for(var i = 0; i < len; i++) {
	if( randomColor == 1){
	g_shapesList[i].color = [Math.floor((Math.random() * 1000) + 1)/1000, Math.floor((Math.random() * 1000) + 1)/1000, Math.floor((Math.random() * 1000) + 1)/1000, 1.0]
	}
	g_shapesList[i].render();
  }
  
  // check the time at end of the function and show on web pageX
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
  
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID){
	var htmlElm = document.getElementById(htmlID);
	if ( !htmlElm){
		console.log("Failed to get " + htmlID + " from HTML");
		return;
	}
	htmlElm.innerHTML = text;
}

// Draw picture
function drawpicture(){
	let point;
    // 1
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [0.05, -0.3];
	point.v3 = [-0.05, -0.3];
	point.color = [0.91, 0.745, 0.47, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//2
	point = new TriangleFree();
	point.v1 = [0, -0.4];
	point.v2 = [0.05, -0.3];
	point.v3 = [-0.05, -0.3];
	point.color = [0.91, 0.745, 0.47, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//3
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [0.05, -0.3];
	point.v3 = [0.15, -0.1];
	point.color = [0.749, 0.596, 0.306, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//4
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [-0.05, -0.3];
	point.v3 = [-0.15, -0.1];
	point.color = [0.749, 0.596, 0.306, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//nose
	point = new TriangleFree();
	point.v1 = [0, -0.32];
	point.v2 = [-0.03, -0.3];
	point.v3 = [0.03, -0.3];
	point.color = [0.0, 0.0, 0.0, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//eyes
	point = new TriangleFree();
	point.v1 = [0.1, -0.1];
	point.v2 = [0.05, -0.1];
	point.v3 = [0.08, -0.13];
	point.color = [0.0, 0.0, 0.0, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	point = new TriangleFree();
	point.v1 = [-0.1, -0.1];
	point.v2 = [-0.05, -0.1];
	point.v3 = [-0.08, -0.13];
	point.color = [0.0, 0.0, 0.0, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//5
	point = new TriangleFree();
	point.v1 = [-0.15, -0.1];
	point.v2 = [-0.18, -0.2];
	point.v3 = [0, -0.4];
	point.color = [0.659, 0.455, 0.075, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//6
	point = new TriangleFree();
	point.v1 = [0.15, -0.1];
	point.v2 = [0.18, -0.2];
	point.v3 = [0, -0.4];
	point.color = [0.659, 0.455, 0.075, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//7
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [-0.11, 0];
	point.v3 = [-0.15, -0.1];
	point.color = [0.5, 0.37, 0.2, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//8
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [0.11, 0];
	point.v3 = [0.15, -0.1];
	point.color = [0.5, 0.37, 0.2, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//9
	point = new TriangleFree();
	point.v1 = [-0.275, 0];
	point.v2 = [-0.11, 0];
	point.v3 = [-0.15, -0.1];
	point.color = [0.34, 0.22, 0.04, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//10
	point = new TriangleFree();
	point.v1 = [0.275, 0];
	point.v2 = [0.11, 0];
	point.v3 = [0.15, -0.1];
	point.color = [0.34, 0.22, 0.04, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//11
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [-0.1, 0];
	point.v3 = [-0.15, 0.3];
	point.color = [0.61, 0.52, 0.38, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//12
	point = new TriangleFree();
	point.v1 = [0, 0];
	point.v2 = [0.1, 0];
	point.v3 = [0.15, 0.3];
	point.color = [0.61, 0.52, 0.38, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//13
	point = new TriangleFree();
	point.v1 = [-0.12, 0.155];
	point.v2 = [-0.4, 0.4];
	point.v3 = [-0.15, 0.3];
	point.color = [0.76, 0.63, 0.48, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//14
	point = new TriangleFree();
	point.v1 = [0.12, 0.155];
	point.v2 = [0.4, 0.4];
	point.v3 = [0.15, 0.3];
	point.color = [0.76, 0.63, 0.48, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//15
	point = new TriangleFree();
	point.v1 = [-0.3, 0.32];
	point.v2 = [-0.52, 0.53];
	point.v3 = [-0.525, 0.41];
	point.color = [0.83, 0.75, 0.608, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//16
	point = new TriangleFree();
	point.v1 = [0.3, 0.32];
	point.v2 = [0.52, 0.53];
	point.v3 = [0.525, 0.41];
	point.color = [0.83, 0.75, 0.608, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//17
	point = new TriangleFree();
	point.v1 = [-0.615, 0.65];
	point.v2 = [-0.52, 0.53];
	point.v3 = [-0.525, 0.41];
	point.color = [0.95, 0.906, 0.8, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//18
	point = new TriangleFree();
	point.v1 = [0.615, 0.65];
	point.v2 = [0.52, 0.53];
	point.v3 = [0.525, 0.41];
	point.color = [0.95, 0.906, 0.8, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//19
	point = new TriangleFree();
	point.v1 = [-0.53, 0.86];
	point.v2 = [-0.52, 0.53];
	point.v3 = [-0.425, 0.43];
	point.color = [0.95, 0.906, 0.8, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//20
	point = new TriangleFree();
	point.v1 = [0.53, 0.86];
	point.v2 = [0.52, 0.53];
	point.v3 = [0.425, 0.43];
	point.color = [0.95, 0.906, 0.8, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//21
	point = new TriangleFree();
	point.v1 = [-0.385, 0.56];
	point.v2 = [-0.355, 0.37];
	point.v3 = [-0.425, 0.43];
	point.color = [0.95, 0.906, 0.8, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//22
	point = new TriangleFree();
	point.v1 = [0.385, 0.56];
	point.v2 = [0.355, 0.37];
	point.v3 = [0.425, 0.43];
	point.color = [0.95, 0.906, 0.8, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//23
	point = new TriangleFree();
	point.v1 = [0, -0.7];
	point.v2 = [-0.18, -0.2];
	point.v3 = [0, -0.4];
	point.color = [0.52, 0.36, 0.07, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//24
	point = new TriangleFree();
	point.v1 = [0, -0.7];
	point.v2 = [0.18, -0.2];
	point.v3 = [0, -0.4];
	point.color = [0.52, 0.36, 0.07, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
	//25
	point = new TriangleFree();
	point.v1 = [0, -0.7];
	point.v2 = [-0.18, -0.2];
	point.v3 = [-0.245, -0.5];
	point.color = [0.3, 0.2, 0.04, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	//26
	point = new TriangleFree();
	point.v1 = [0, -0.7];
	point.v2 = [0.18, -0.2];
	point.v3 = [0.245, -0.5];
	point.color = [0.3, 0.2, 0.04, 1.0];
	point.size = 30;
	g_shapesList.push(point);
	
    renderAllShapes();

}