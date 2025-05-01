// Hoi Lee Yeung 
// hkyeung@ucsc.edu

// Vertex shader program
// changes position
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;

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
  gl.enable(gl.DEPTH_TEST);
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
  
  //get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  
  // get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
	
  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
}


// Global UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedSegment = 10;
let randomColor = 0;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let g_headAngle = 0;
let g_mouthAngle = 0;
let g_noseAngle = 0;
let g_leftearAngle = 0;
let g_rightearAngle = 0;
let g_frontleftupperlegAngle = 0;
let g_frontrightupperlegAngle = 0;
let g_frontleftlowerlegAngle = 0;
let g_frontrightlowerlegAngle = 0;
let g_backleftupperlegAngle = 0;
let g_backrightupperlegAngle = 0;
let g_backleftlowerlegAngle = 0;
let g_backrightlowerlegAngle = 0;
let g_uppertailAngle = 0;
let g_lowertailAngle = 0;
let g_headAnimation = false;
let g_earAnimation = false;
let g_tailAnimation = false;
let g_BackLegAnimation = false;
let g_FrontLegAnimation = false;
let g_frontrightpawAngle = 0;
let g_frontleftpawAngle = 0;
let g_backrightpawAngle = 0;
let g_backleftpawAngle = 0;
let g_Animationstarttime = undefined;

// Set up actions for HTML UI elements
function addActionsForhtmlUI(){
	
	document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
	document.getElementById('angleSlideY').addEventListener('mousemove', function() {g_globalAngleY = this.value; renderAllShapes(); });
	document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes(); });
	document.getElementById('mouthSlide').addEventListener('mousemove', function() {g_mouthAngle = this.value; renderAllShapes(); });
	document.getElementById('noseSlide').addEventListener('mousemove', function() {g_noseAngle = this.value; renderAllShapes(); });
	document.getElementById('leftEarSlide').addEventListener('mousemove', function() {g_leftearAngle = this.value; renderAllShapes(); });
    document.getElementById('rightEarSlide').addEventListener('mousemove', function() {g_rightearAngle = this.value; renderAllShapes(); });
	document.getElementById('frontleftupperlegSlide').addEventListener('mousemove', function() {g_frontleftupperlegAngle = this.value; renderAllShapes(); });
    document.getElementById('frontrightupperlegSlide').addEventListener('mousemove', function() {g_frontrightupperlegAngle = this.value; renderAllShapes(); });
	document.getElementById('frontleftlowerlegSlide').addEventListener('mousemove', function() {g_frontleftlowerlegAngle = this.value; renderAllShapes(); });
    document.getElementById('frontrightlowerlegSlide').addEventListener('mousemove', function() {g_frontrightlowerlegAngle = this.value; renderAllShapes(); });
	document.getElementById('backleftupperlegSlide').addEventListener('mousemove', function() {g_backleftupperlegAngle = this.value; renderAllShapes(); });
    document.getElementById('backrightupperlegSlide').addEventListener('mousemove', function() {g_backrightupperlegAngle = this.value; renderAllShapes(); });
	document.getElementById('backleftlowerlegSlide').addEventListener('mousemove', function() {g_backleftlowerlegAngle = this.value; renderAllShapes(); });
    document.getElementById('backrightlowerlegSlide').addEventListener('mousemove', function() {g_backrightlowerlegAngle = this.value; renderAllShapes(); });
	document.getElementById('tailupperSlide').addEventListener('mousemove', function() {g_uppertailAngle = this.value; renderAllShapes(); });
    document.getElementById('animationHeadOn').onclick=function() {g_headAnimation = true;};
	document.getElementById('animationHeadOff').onclick=function() {g_headAnimation = false;};
	document.getElementById('animationEarOn').onclick=function() {g_earAnimation = true;};
	document.getElementById('animationEarOff').onclick=function() {g_earAnimation = false;};
	document.getElementById('animationTailOn').onclick=function() {g_tailAnimation = true;};
	document.getElementById('animationTailOff').onclick=function() {g_tailAnimation = false;};
	document.getElementById('animationFrontLegOn').onclick=function() {g_FrontLegAnimation = true;};
	document.getElementById('animationFrontLegOff').onclick=function() {g_FrontLegAnimation = false;};
	document.getElementById('animationBackLegOn').onclick=function() {g_BackLegAnimation = true;};
	document.getElementById('animationBackLegOff').onclick=function() {g_BackLegAnimation = false;};
	document.getElementById('allOn').onclick=function() {g_headAnimation=true; g_earAnimation=true; g_tailAnimation=true; g_FrontLegAnimation=true; g_BackLegAnimation=true;};
	document.getElementById('allOff').onclick=function() {g_headAnimation=false; g_earAnimation=false; g_tailAnimation=false; g_FrontLegAnimation=false; g_BackLegAnimation=false;};
	document.getElementById('frpSlide').addEventListener('mousemove', function() {g_frontrightpawAngle = this.value; renderAllShapes(); });
	document.getElementById('flpSlide').addEventListener('mousemove', function() {g_frontleftpawAngle = this.value; renderAllShapes(); });
	document.getElementById('brpSlide').addEventListener('mousemove', function() {g_backrightpawAngle = this.value; renderAllShapes(); });
	document.getElementById('blpSlide').addEventListener('mousemove', function() {g_backleftpawAngle = this.value; renderAllShapes(); });
	
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
  gl.clearColor(0.9, 0.9, 0.9, 1.0);

  //renderAllShapes();
  requestAnimationFrame(tick);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


var g_shapesList = [];
var lastx = 0;
var lasty = 0;


function click(ev) {
  if(ev.shiftKey){
	  //do special animation
	  requestAnimationFrame(specialAnimation);
  }
  // Extract the event click and return it in WebGL coordinate
  let [x,y] = convertCoordinatesEventToGL(ev);
  
  UpdateAngle(x,y);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
  
}

function specialAnimation(){
	
	//record the time animation start
	if( g_Animationstarttime === undefined){
		g_Animationstarttime = g_seconds;
	}
	g_aaa = 1.5*(g_seconds-g_Animationstarttime);
	g_headAngle = Math.abs(-45*Math.sin(g_aaa));
	g_frontleftupperlegAngle = - Math.abs(100*Math.sin(g_aaa));
	g_frontleftpawAngle = - Math.abs(30*Math.sin(g_aaa));
	g_frontrightupperlegAngle = - Math.abs(100*Math.sin(g_aaa));
	g_frontrightpawAngle = - Math.abs(30*Math.sin(g_aaa));
	g_backleftupperlegAngle =  Math.abs(100*Math.sin(g_aaa));
	g_backleftpawAngle =  Math.abs(30*Math.sin(g_aaa));
	g_backrightupperlegAngle =  Math.abs(100*Math.sin(g_aaa));
	g_backrightpawAngle =  Math.abs(30*Math.sin(g_aaa));
	g_uppertailAngle = Math.abs(60*Math.sin(g_aaa));
	
	// if not enough time, keep animation on
	if (g_seconds - g_Animationstarttime < 2.1){
	requestAnimationFrame(specialAnimation);
	} else {
	// if times up, stop animation
		g_Animationstarttime = undefined;
		// reset angle
		g_headAngle = 0;
		g_frontleftupperlegAngle = 0;
		g_frontleftpawAngle = 0;
		g_frontrightupperlegAngle = 0;
		g_frontrightpawAngle = 0;
		g_backleftupperlegAngle =  0;
		g_backleftpawAngle =  0;
		g_backrightupperlegAngle =  0;
		g_backrightpawAngle =  0;
		g_uppertailAngle = 0;
		return;
	}
}


function UpdateAngle(x,y) {

  if (lastx != 0 || lasty != 0) {

    if (x - lastx > 0) {
      g_globalAngle = (g_globalAngle - 2) % 360;
    } else if (x - lastx < 0) {
      g_globalAngle = (g_globalAngle + 2) % 360;
    }

    if (y - lasty < 0) {
        g_globalAngleY = (g_globalAngleY - 2) % 360;
    } else if (y - lasty > 0) {
        g_globalAngleY = (g_globalAngleY + 2) % 360;
    }
    lastx = x;
    lasty = y;
  }

  if (lastx == 0 && lasty == 0) {
    lastx = x;
    lasty = y;
  }
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


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
	g_seconds = performance.now()/1000.0-g_startTime;
	//console.log(g_seconds);
	updateAnimationAngles();
	renderAllShapes();
	requestAnimationFrame(tick);
}


function updateAnimationAngles(){
	if(g_headAnimation){
		g_headAngle = Math.abs(45*Math.sin(g_seconds));
	}
	if(g_earAnimation){
		g_leftearAngle = Math.abs(45*Math.sin(g_seconds+45));
		g_rightearAngle = Math.abs(45*Math.sin(g_seconds+45));
	}
	if(g_tailAnimation){
		g_uppertailAngle = (30*Math.sin(g_seconds));
	}
	if(g_FrontLegAnimation){
		g_frontleftupperlegAngle = (30*Math.sin(g_seconds));
		g_frontleftlowerlegAngle = (45*Math.sin(g_seconds));
		g_frontrightupperlegAngle =  (-30*Math.sin(g_seconds));
		g_frontrightlowerlegAngle = (-45*Math.sin(g_seconds));
		g_frontleftpawAngle = (15*Math.sin(g_seconds))
		g_frontrightpawAngle = (-15*Math.sin(g_seconds))
	}
	if(g_BackLegAnimation){
		g_backleftupperlegAngle = (-30*Math.sin(g_seconds));
		g_backleftlowerlegAngle = (-45*Math.sin(g_seconds));
		g_backrightupperlegAngle = (30*Math.sin(g_seconds));
		g_backrightlowerlegAngle = (45*Math.sin(g_seconds));
		g_backleftpawAngle = (-15*Math.sin(g_seconds))
		g_backrightpawAngle = (15*Math.sin(g_seconds))
	}
}


// Draw every shapes thats supposed to be in the canvas
function renderAllShapes(){
  // check the time at the start of this function
  var startTime = performance.now();
  
  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngleY, 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  

	
	//head 
	var box = new Cube();
	box.color = [0.35, 0.35, 0.35, 1.0];
	box.matrix.setTranslate(-.2, .2, -.6, 0);
	box.matrix.rotate(-g_headAngle, g_headAngle, 0, 1);
	box.matrix.translate(0, -g_headAngle/200, 0, 0);
	var headmat = new Matrix4(box.matrix);
	var headmat2 = new Matrix4(box.matrix);
	var headmat3 = new Matrix4(box.matrix);
	var headmat4 = new Matrix4(box.matrix);
	var headmat5 = new Matrix4(box.matrix);
	box.matrix.scale(.4, .4, .4);
	box.render();
	
	//mouth
	var box1 = new Cube();
	box1.color = [0.3, 0.3, 0.3, 1.0];
	box1.matrix = headmat;
	box1.matrix.translate(.1, 0.2, 0, 0);
	box1.matrix.rotate(180, 1, 0, 0);
	box1.matrix.rotate(-g_mouthAngle, g_mouthAngle, 0, 1);
	var mouthmat = new Matrix4(box1.matrix);
	box1.matrix.scale(.2, .2, .2);
	box1.render();
	
	//nose
	var nose = new Cube();
	nose.color = [0.8, 0.8, 0.8, 1.0];
	nose.matrix = mouthmat;
	nose.matrix.translate(0.055, 0, .2, 0);
	nose.matrix.rotate(0, 1, 0, 0);
	nose.matrix.rotate(g_noseAngle, -g_noseAngle, 0, 1);
	nose.matrix.scale(.08, .08, .08);
	nose.render();
	
	//eye 
	var eye = new Cube();
	eye.color = [0.1, 0.1, 0.1, 1.0];
	eye.matrix = headmat4;
	eye.matrix.translate(-.03, .25, .1, 0);
	eye.matrix.scale(.08, .08, .08);
	eye.render();
	
	//eye 
	var eye1 = new Cube();
	eye1.color = [0.1, 0.1, 0.1, 1.0];
	eye1.matrix = headmat5;
	eye1.matrix.translate(.35, .25, .1, 0);
	eye1.matrix.scale(.08, .08, .08);
	eye1.render();
	
	//left ear 
	var ear = new Pyramid();
	ear.color = [0.45, 0.45, 0.45, 1.0];
	ear.matrix = headmat2;
	ear.matrix.translate(0, .4, .3, 0.05);
	ear.matrix.rotate(g_leftearAngle, 1, 0, 0);
	ear.matrix.scale(.2, .2, .1);
	ear.render();
	
	//right ear 
	var ear1 = new Pyramid();
	ear1.color = [0.45, 0.45, 0.45, 1.0];
	ear1.matrix = headmat3;
	ear1.matrix.translate(.2, .4, .3, .05);
	ear1.matrix.rotate(g_rightearAngle, 1, 0, 0);
	ear1.matrix.scale(.2, .2, .1);
	ear1.render();
	
	//body
	var body = new Cube();
	body.color = [0.3, 0.3, 0.3, 1.0];
	body.matrix.setTranslate(-.25, -.1, -.3, 0);
	body.matrix.rotate(1, 1, 0, 0);
	body.matrix.scale(.5, .5, .9);
	body.render();
	
	//tail
	var tail = new Cube();
	tail.color = [0.7, 0.7, 0.7, 1.0];
	tail.matrix.setTranslate(-.1, .3, .6, 0);
	tail.matrix.rotate(150, 180, 1, 0);
	tail.matrix.rotate(g_uppertailAngle, -g_uppertailAngle, 0, 1);
	tail.matrix.scale(.2, .5, .17);
	tail.render();
	
	// frontleg
	var frontleg = new Cube();
	frontleg.color = [0.3, 0.28, 0.3, 1.0];
	frontleg.matrix.setTranslate(-.28, 0, -.1, 0);
	frontleg.matrix.rotate(150, 1, 0, 0);
	frontleg.matrix.rotate(-g_frontleftupperlegAngle, 1, 0, 0);
	var frontleftleg = new Matrix4(frontleg.matrix);
	frontleg.matrix.scale(.18, .3, .18);
	frontleg.render();
	
	// frontleg right
	var frontleg1 = new Cube();
	frontleg1.color = [0.3, 0.28, 0.3, 1.0];
	frontleg1.matrix.setTranslate(.1, 0, -.1, 0);
	frontleg1.matrix.rotate(150, 1, 0, 0);
	frontleg1.matrix.rotate(-g_frontrightupperlegAngle, 1, 0, 0);
	var frontrightleg = new Matrix4(frontleg1.matrix);
	frontleg1.matrix.scale(.18, .3, .18);
	frontleg1.render();
	
	// frontleglower
	var frontleglower = new Cube();
	frontleglower.color = [0.25, 0.25, 0.25, 1.0];
	frontleglower.matrix = frontleftleg;
	frontleglower.matrix.translate(0, .3, .05, 0);
	frontleglower.matrix.rotate(45, 1, 0, 0);
	frontleglower.matrix.rotate(g_frontleftlowerlegAngle, 1, 0, 0);
	var frontleglowerleftmat = new Matrix4(frontleglower.matrix);
	frontleglower.matrix.scale(.15, .3, .15);
	frontleglower.render();
	
	// frontleglower right
	var frontleglower1 = new Cube();
	frontleglower1.color = [0.25, 0.25, 0.25, 1.0];
	frontleglower1.matrix = frontrightleg;
	frontleglower1.matrix.translate(0, .3, .05, 0);
	frontleglower1.matrix.rotate(45, 1, 0, 0);
	frontleglower1.matrix.rotate(g_frontrightlowerlegAngle, 1, 0, 0);
	var frontleglowerrightmat = new Matrix4(frontleglower1.matrix);
	frontleglower1.matrix.scale(.15, .3, .15);
	frontleglower1.render();
	
	//front left paw
    var paw1 = new Cube;
    paw1.color = [0.4, 0.4, 0.4, 1.0];
	paw1.matrix = frontleglowerleftmat;
	paw1.matrix.translate(-0.01, .22, 0.01, 0);
	paw1.matrix.rotate(g_frontleftpawAngle, 1, 0, 0);
	paw1.matrix.scale(.17,.12,.2);
    paw1.render();
	
	//front right paw
	var paw2 = new Cube;
    paw2.color = [0.4, 0.4, 0.4, 1.0];
	paw2.matrix = frontleglowerrightmat;
	paw2.matrix.translate(-0.01, .22, 0.01, 0);
	paw2.matrix.rotate(g_frontrightpawAngle, 1, 0, 0);
	paw2.matrix.scale(.17,.12,.2);
    paw2.render();
	
	// backleg
	var backleg = new Cube();
	backleg.color = [0.3, 0.28, 0.3, 1.0];
	backleg.matrix.setTranslate(-.28, 0, .6, 0);
	backleg.matrix.rotate(195, 1, 0, 0);
	backleg.matrix.rotate(-g_backleftupperlegAngle, 1, 0, 0);
	var backleftleg = new Matrix4(backleg.matrix);
	backleg.matrix.scale(.18, .3, .22);
	backleg.render();
	
	// backleg right
	var backleg1 = new Cube();
	backleg1.color = [0.3, 0.28, 0.3, 1.0];
	backleg1.matrix.setTranslate(.1, 0, .6, 0);
	backleg1.matrix.rotate(195, 1, 0, 0);
	backleg1.matrix.rotate(-g_backrightupperlegAngle, 1, 0, 0);
	var backrightleg = new Matrix4(backleg1.matrix);
	backleg1.matrix.scale(.18, .3, .22);
	backleg1.render();
	
	// backleglower
	var backleglower = new Cube();
	backleglower.color = [0.25, 0.25, 0.25, 1.0];
	backleglower.matrix = backleftleg;
	backleglower.matrix.translate(0, .2, .07, 0);
	backleglower.matrix.rotate(-15, 1, 0, 0);
	backleglower.matrix.rotate(g_backleftlowerlegAngle, 1, 0, 0);
	var backleglowermat = new Matrix4(backleglower.matrix);
	backleglower.matrix.scale(.15, .4, .15);
	backleglower.render();
	
	// backleglower right
	var backleglower1 = new Cube();
	backleglower1.color = [0.25, 0.25, 0.25, 1.0];
	backleglower1.matrix = backrightleg;
	backleglower1.matrix.translate(.0, .2, .07, 0);
	backleglower1.matrix.rotate(-15, 1, 0, 0);
	backleglower1.matrix.rotate(g_backrightlowerlegAngle, 1, 0, 0);
	var backleglower1mat = new Matrix4(backleglower1.matrix);
	backleglower1.matrix.scale(.15, .4, .15);
	backleglower1.render();
	
	//back left paw
	var paw3 = new Cube;
    paw3.color = [0.4, 0.4, 0.4, 1.0];
	paw3.matrix = backleglowermat;
	paw3.matrix.translate(-0.01, .35, -.01, 0);
	paw3.matrix.rotate(g_backleftpawAngle, 1, 0, 0);
	paw3.matrix.scale(.17,.12,.22);
    paw3.render();
	
	//back right paw
	var paw4 = new Cube;
    paw4.color = [0.4, 0.4, 0.4, 1.0];
	paw4.matrix = backleglower1mat;
	paw4.matrix.translate(-0.01, .35, -.01, 0);
	paw4.matrix.rotate(g_backrightpawAngle, 1, 0, 0);
	paw4.matrix.scale(.17,.12,.22);
    paw4.render();
  
  // check the time at end of the function and show on web pageX
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

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

