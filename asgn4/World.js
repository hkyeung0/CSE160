// Hoi Lee Yeung 
// hkyeung@ucsc.edu

// Vertex shader program
// changes position
var VSHADER_SOURCE = `
  //precision mediup float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_NormalMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
	v_UV = a_UV;
	//v_Normal = a_Normal;
	v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
	v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
// changes color
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  varying vec4 v_VertPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  uniform bool u_spotOn;
  void main() {
	  
	// sphere normal
	if (u_whichTexture == -3){
		gl_FragColor =  vec4((v_Normal + 1.0)/2.0, 1.0);
	
	// wall normal
	} else if (u_whichTexture == -5){
		gl_FragColor =  vec4((v_Normal + 1.0)/2.0, 1.0);
		
	// walls light
	} else if (u_whichTexture == -2){
		gl_FragColor = u_FragColor;
	
	//sphere light
	} else if (u_whichTexture == -4){
		gl_FragColor = u_FragColor;
		
	} else if (u_whichTexture == -1){
		gl_FragColor = vec4(v_UV, 1.0, 1.0);
		
	} else if (u_whichTexture == 0){
		gl_FragColor = texture2D(u_Sampler0, v_UV);
	
	} else if (u_whichTexture == 1){
		gl_FragColor = texture2D(u_Sampler1, v_UV);
		
	} else if (u_whichTexture == 2){
		gl_FragColor = texture2D(u_Sampler2, v_UV);
		
	} else {
		gl_FragColor = vec4(0, .2, .2, 1);
	}
	
	//vec3 lightVector = vec3(v_VertPos)-u_lightPos;
	//float r=length(lightVector);
	//if(r<2.0){
	//	gl_FragColor= vec4(1,0,0,1);
	//}else if(r<3.0){
	//	gl_FragColor= vec4(0,1,0,1);
	//}
	
	vec3 lightVector = u_lightPos - vec3(v_VertPos);
	float r=length(lightVector);
	
	//if(r<2.0){
	//	gl_FragColor= vec4(1,0,0,1);
	//}else if(r<3.0){
	//	gl_FragColor= vec4(0,1,0,1);
	//}
	
	//gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
	
	vec3 L = normalize(lightVector);
	vec3 N = normalize(v_Normal);
	float nDotL = max(dot(N,L), 0.0);
	
	vec3 R = reflect(-L,N);
	vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
	
	float specular = pow(max(dot(E,R), 0.0), 10.0);
	vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
	vec3 ambient = vec3(gl_FragColor) * 0.3;
	if(u_lightOn || u_spotOn){
		// walls light
		if(u_whichTexture == -2 || u_whichTexture == -5){
			gl_FragColor = vec4(diffuse + ambient, 1.0);
		}else if(u_whichTexture == -6){
			specular = pow(max(dot(E,R), 0.0), 1.0);
			gl_FragColor = vec4(diffuse + specular + specular - diffuse, 1.0);
		}else{
			gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
		}
	}
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_NormalMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let a_Normal;
let u_cameraPos;
let u_lightOn;
let u_spotOn;

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
  
  // Get the storage location of UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  
  // Get the storage location of normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
  
  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }
  
  // Get the storage location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }
  
    // Get the storage location of u_spotOn
  u_spotOn = gl.getUniformLocation(gl.program, 'u_spotOn');
  if (!u_spotOn) {
    console.log('Failed to get the storage location of u_spotOn');
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
  
  // get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  
  // get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  
  // get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }
  
  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }
  
  // Get the storage location of u_Sampler
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }
  
  // Get the storage location of u_Sampler
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }
  
  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }
  
  //get the storage location of u_ModelMatrix
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }
	
  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
  
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  
  gl.uniformMatrix4fv(u_NormalMatrix, false, identityM.elements);
  
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
let g_camera;
let g_normalOn = false;
let g_lightPos = [0,1,-2];
let g_lightOn = false;
let g_AnimationOn = false;
let g_spot = false;

// Set up actions for HTML UI elements
function addActionsForhtmlUI(){
	document.getElementById('normalOn').onclick = function() { g_normalOn = true;};
	document.getElementById('normalOff').onclick = function() { g_normalOn = false;};
	document.getElementById('lightSlideX').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes(); }});
	document.getElementById('lightSlideY').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes(); }});
	document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev){if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes(); }});
	document.getElementById('lightOn').onclick = function() { g_lightOn = true; g_spot = false};
	document.getElementById('lightOff').onclick = function() { g_lightOn = false;};
	document.getElementById('aOn').onclick = function() { g_AnimationOn = true;};
	document.getElementById('aOff').onclick = function() { g_AnimationOn = false;};
	document.getElementById('sOn').onclick = function() { g_spot = true; g_lightOn = false};
	document.getElementById('sOff').onclick = function() { g_spot = false;};
	
}

function initTextures() {

  var image0 = new Image();  // Create the image object
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }
  // Tell the browser to load an image
  image0.src = '../resources/sky.jpg';
  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendTexturetoGLSL(image0, u_Sampler0, 0, gl.TEXTURE0); };
  
  
  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  // Tell the browser to load an image
  image1.src = '../resources/dirt.jpg';
  // Register the event handler to be called on loading an image
  image1.onload = function(){ sendTexturetoGLSL(image1, u_Sampler1, 1, gl.TEXTURE1); };
  
  
   var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Tell the browser to load an image
  image2.src = '../resources/grass.jpg';
  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTexturetoGLSL(image2, u_Sampler2, 2, gl.TEXTURE2); };


  return true;
}

function sendTexturetoGLSL(image, sam, samNum, iii ) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(iii);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(sam, samNum);
  
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('finished loadTexture');
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
  
  g_camera =  new Camera();
  g_camera.at.elements = [-1.3,1.3,1.3];
  g_camera.eye.elements = [-3.7,3.8,4.1];
  document.onkeydown = function(ev){
    switch (ev.key){
      case "w":
	    //console.log("w");
        g_camera.moveForward();
        break;
      case "s":
	    //console.log("s");
        g_camera.moveBackward();
        break;
      case "d":
        g_camera.moveLeft();
        break;
      case "a":
        g_camera.moveRight();
        break;
      case "q":
        g_camera.panLeft(20);
        break;
      case "e":
        g_camera.panRight(20);
        break;
	  case "z":
        //placeBlock(Math.round(g_camera.at.elements[0]), Math.round(g_camera.at.elements[2]));
		g_camera.moveUp();
		console.log(g_camera.at.elements + "up: " + g_camera.eye.elements);
        break;
	  case "x":
	    g_camera.moveDown();
        //removeBlock(Math.round(g_camera.at.elements[0]), Math.round(g_camera.at.elements[2]));
        break;
    }
    
  }
  
  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.9, 0.9, 0.9, 1.0);

  //renderAllShapes();
  requestAnimationFrame(tick);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //console.log("main " + u_whichTexture);
}


function placeBlock(x,y){
	g_map[x][y] = g_map[x][y]+ 1;
	//console.log("x:" + x + " y: " + y);
}

function removeBlock(x,y){
	if(g_map[x][y] != 0){
		g_map[x][y] = g_map[x][y] - 1;
	}
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
      //g_globalAngle = (g_globalAngle + 1) % 360;
	  g_camera.panLeft(2);
    } else if (x - lastx < 0) {
      //g_globalAngle = (g_globalAngle - 1) % 360;
	  g_camera.panRight(2);
    }

    if (y - lasty < 0) {
        //g_globalAngleY = (g_globalAngleY - .6) % 360;
		g_camera.panUp();
    } else if (y - lasty > 0) {
        //g_globalAngleY = (g_globalAngleY + .6) % 360;
		g_camera.panDown();
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
	if(g_AnimationOn){
		g_headAngle = Math.abs(45*Math.sin(g_seconds));
	//}
	//if(g_earAnimation){
		g_leftearAngle = Math.abs(45*Math.sin(g_seconds+45));
		g_rightearAngle = Math.abs(45*Math.sin(g_seconds+45));
	//}
	//if(g_tailAnimation){
		g_uppertailAngle = (30*Math.sin(g_seconds));
	//}
	//if(g_FrontLegAnimation){
		g_frontleftupperlegAngle = (30*Math.sin(g_seconds));
		g_frontleftlowerlegAngle = (45*Math.sin(g_seconds));
		g_frontrightupperlegAngle =  (-30*Math.sin(g_seconds));
		g_frontrightlowerlegAngle = (-45*Math.sin(g_seconds));
		g_frontleftpawAngle = (15*Math.sin(g_seconds))
		g_frontrightpawAngle = (-15*Math.sin(g_seconds))
	//}
	//if(g_BackLegAnimation){
		g_backleftupperlegAngle = (-30*Math.sin(g_seconds));
		g_backleftlowerlegAngle = (-45*Math.sin(g_seconds));
		g_backrightupperlegAngle = (30*Math.sin(g_seconds));
		g_backrightlowerlegAngle = (45*Math.sin(g_seconds));
		g_backleftpawAngle = (-15*Math.sin(g_seconds))
		g_backrightpawAngle = (15*Math.sin(g_seconds))
	//}
	
	g_lightPos[0] = cos(g_seconds) * 2;
	}
}

		


var g_map = [
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],

[1,1,1,1, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1],
[1,1,1,1, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,2,2, 1,1,1,1],

[1,1,1,1, 2,2,0,0, 3,3,3,3, 3,3,3,3, 3,3,3,3, 3,3,3,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,3, 0,0,2,2, 1,1,1,1],

[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,4,4,4, 4,4,4,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,0,0,0, 0,0,0,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,0,0,0, 0,0,0,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,0,0,0, 0,0,0,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],

[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,0,0,0, 0,0,0,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,0,0,0, 0,0,0,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,0,0,0, 0,0,0,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 4,4,4,4, 4,4,4,4, 0,0,0,3, 0,0,2,2, 1,1,1,1],

[1,1,1,1, 2,2,0,0, 3,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,3, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 3,3,3,3, 3,3,3,3, 3,3,3,3, 3,3,3,3, 0,0,2,2, 1,1,1,1],

[1,1,1,1, 2,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,2,2, 1,1,1,1],
[1,1,1,1, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1],
[1,1,1,1, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1],

[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
];

function drawMap(){
	for(x = 0; x<32; x++){
		for(y = 0; y<32; y++){
			for (i = 1; i < 5; i++){ 
				if(g_map[x][y] >= i){
					var body = new Cube();
					if ( i == 1){
						body.textureNum = 2;
					}else{
						body.textureNum = 1;
					}
					body.matrix.translate(x, i, y);
					body.render();
				}
			}
		}
	}
}

// Draw every shapes thats supposed to be in the canvas
function renderAllShapes(){
  // check the time at the start of this function
  var startTime = performance.now();
  
  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  
  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2], 
					g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],  
					g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  
  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // pass the matrix to u_NormalMatrix attribute
  var normalMat = new Matrix4();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
	//drawMap();
	
	gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	
	gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
	
	gl.uniform1i(u_lightOn, g_lightOn);
	
	gl.uniform1i(u_spotOn, g_spot);
	
	// light
	var light = new Cube();
	light.textureNum = -2;
	light.color = [2,2,0,1];
	light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	light.matrix.scale(-.1,-.1,-.1);
	light.matrix.translate(-.5,-.5,-.5);
	light.justrender();
	
	// floor
	var floor = new Cube();
	floor.textureNum = -2;
	floor.color = [.165, .43, .01, 1];
	floor.matrix.translate(0, -.75, 0);
	floor.matrix.scale(99,2,99);
	floor.matrix.translate(-.5, -5, -.5);
	floor.render();
	
	// sky
	var sky = new Cube();
	sky.textureNum = -2;
	sky.color = [.8,.8,.8,1.0];
	if(g_normalOn) sky.textureNum = -5;
	sky.matrix.scale(-10,-10,-10);
	sky.matrix.translate(-.5, -.5, -.5);
	sky.justrender();
	
	// sphere
	var sphere = new Sphere();
	sphere.textureNum = -4
	if(g_normalOn) sphere.textureNum = -3;
	if(g_spot) {
		sphere.textureNum = -6;
	}
	sphere.render();
	
	//var test = new Cube();
	//test.textureNum = -2;
	//test.color = [.5,.5,.5,1];
	//if(Math.round(g_camera.at.elements[0] > 0 && Math.round(g_camera.at.elements[2] > 0))){
	//	var eee = g_map[Math.round(g_camera.at.elements[0])][Math.round(g_camera.at.elements[2])];
	//}
	//test.matrix.translate(g_camera.at.elements[0], eee + 1 ,g_camera.at.elements[2]);
	//console.log("cube: " + g_camera.at.elements[0], g_camera.at.elements[2]);
	//test.matrix.scale(.5,.5,.5);
	//test.render();
	
	drawAnimal();
  
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

function drawAnimal(){
	var x = 1; 
	var y = -2;
	var z = 2;
	var tn = -3;
	var nn = -4;
	//head 
	var head = new Cube();
	head.textureNum = nn;
	head.color = [0.35, 0.35, 0.35, 1.0];
	if(g_normalOn) head.textureNum = tn;
	head.matrix.setTranslate(-.2, .2, -.6, 0);
	head.matrix.translate(x,y,z);
	head.matrix.rotate(-g_headAngle, g_headAngle, 0, 1);
	head.matrix.translate(0, -g_headAngle/200, 0, 0);
	var headmat = new Matrix4(head.matrix);
	var headmat2 = new Matrix4(head.matrix);
	var headmat3 = new Matrix4(head.matrix);
	var headmat4 = new Matrix4(head.matrix);
	var headmat5 = new Matrix4(head.matrix);
	head.matrix.scale(.4, .4, .4);
	head.normalMatrix.setInverseOf(head.matrix).transpose();
	head.justrender();
	
	//mouth
	var mouth = new Cube();
	mouth.textureNum = nn;
	mouth.color = [0.3, 0.3, 0.3, 1.0];
	if(g_normalOn) mouth.textureNum = tn;
	mouth.matrix = headmat;
	mouth.matrix.translate(.1, 0.2, 0, 0);
	mouth.matrix.rotate(180, 1, 0, 0);
	mouth.matrix.rotate(-g_mouthAngle, g_mouthAngle, 0, 1);
	var mouthmat = new Matrix4(mouth.matrix);
	mouth.matrix.scale(.2, .2, .2);
	mouth.justrender();
	
	//nose
	var nose = new Cube();
	nose.textureNum = nn;
	nose.color = [0.8, 0.8, 0.8, 1.0];
	if(g_normalOn) nose.textureNum = tn;
	nose.matrix = mouthmat;
	nose.matrix.translate(0.055, 0, .2, 0);
	nose.matrix.rotate(0, 1, 0, 0);
	nose.matrix.rotate(g_noseAngle, -g_noseAngle, 0, 1);
	nose.matrix.scale(.08, .08, .08);
	nose.justrender();
	
	//eye 
	var eye = new Cube();
	eye.textureNum = nn;
	eye.color = [0.1, 0.1, 0.1, 1.0];
	if(g_normalOn) eye.textureNum = tn;
	eye.matrix = headmat4;
	eye.matrix.translate(-.03, .25, .1, 0);
	eye.matrix.scale(.08, .08, .08);
	eye.justrender();
	
	//eye 
	var eye1 = new Cube();
	eye1.textureNum = nn;
	eye1.color = [0.1, 0.1, 0.1, 1.0];
	if(g_normalOn) eye1.textureNum = tn;
	eye1.matrix = headmat5;
	eye1.matrix.translate(.35, .25, .1, 0);
	eye1.matrix.scale(.08, .08, .08);
	eye1.justrender();
	
	//left ear 
	var ear = new Pyramid();
	ear.textureNum = nn;
	ear.color = [0.45, 0.45, 0.45, 1.0];
	if(g_normalOn) ear.textureNum = tn;
	ear.matrix = headmat2;
	ear.matrix.translate(0, .4, .3, 0.05);
	ear.matrix.rotate(g_leftearAngle, 1, 0, 0);
	ear.matrix.scale(.2, .2, .1);
	ear.render();
	
	//right ear 
	var ear1 = new Pyramid();
	ear1.textureNum = nn;
	ear1.color = [0.45, 0.45, 0.45, 1.0];
	if(g_normalOn) ear1.textureNum = tn;
	ear1.matrix = headmat3;
	ear1.matrix.translate(.2, .4, .3, .05);
	ear1.matrix.rotate(g_rightearAngle, 1, 0, 0);
	ear1.matrix.scale(.2, .2, .1);
	ear1.render();
	
	//body
	var body = new Cube();
	body.textureNum = nn;
	body.color = [0.3, 0.3, 0.3, 1.0];
	if(g_normalOn) body.textureNum = tn;
	body.matrix.setTranslate(-.25, -.1, -.3, 0);
	body.matrix.translate(x,y,z);
	body.matrix.rotate(1, 1, 0, 0);
	body.matrix.scale(.5, .5, .9);
	body.justrender();
	
	//tail
	var tail = new Cube();
	tail.textureNum = nn;
	tail.color = [0.7, 0.7, 0.7, 1.0];
	if(g_normalOn) tail.textureNum = tn;
	tail.matrix.setTranslate(-.1, .3, .6, 0);
	tail.matrix.translate(x,y,z);
	tail.matrix.rotate(150, 180, 1, 0);
	tail.matrix.rotate(g_uppertailAngle, -g_uppertailAngle, 0, 1);
	tail.matrix.scale(.2, .5, .17);
	tail.justrender();
	
	// frontleg
	var frontleg = new Cube();
	frontleg.textureNum = nn;
	frontleg.color = [0.3, 0.28, 0.3, 1.0];
	if(g_normalOn) frontleg.textureNum = tn;
	frontleg.matrix.setTranslate(-.28, 0, -.1, 0);
	frontleg.matrix.translate(x,y,z);
	frontleg.matrix.rotate(150, 1, 0, 0);
	frontleg.matrix.rotate(-g_frontleftupperlegAngle, 1, 0, 0);
	var frontleftleg = new Matrix4(frontleg.matrix);
	frontleg.matrix.scale(.18, .3, .18);
	frontleg.justrender();
	
	// frontleg right
	var frontleg1 = new Cube();
	frontleg1.textureNum = nn;
	frontleg1.color = [0.3, 0.28, 0.3, 1.0];
	if(g_normalOn) frontleg1.textureNum = tn;
	frontleg1.matrix.setTranslate(.1, 0, -.1, 0);
	frontleg1.matrix.translate(x,y,z);
	frontleg1.matrix.rotate(150, 1, 0, 0);
	frontleg1.matrix.rotate(-g_frontrightupperlegAngle, 1, 0, 0);
	var frontrightleg = new Matrix4(frontleg1.matrix);
	frontleg1.matrix.scale(.18, .3, .18);
	frontleg1.justrender();
	
	// frontleglower
	var frontleglower = new Cube();
	frontleglower.textureNum = nn;
	frontleglower.color = [0.25, 0.25, 0.25, 1.0];
	if(g_normalOn) frontleglower.textureNum = tn;
	frontleglower.matrix = frontleftleg;
	frontleglower.matrix.translate(0, .3, .05, 0);
	frontleglower.matrix.rotate(45, 1, 0, 0);
	frontleglower.matrix.rotate(g_frontleftlowerlegAngle, 1, 0, 0);
	var frontleglowerleftmat = new Matrix4(frontleglower.matrix);
	frontleglower.matrix.scale(.15, .3, .15);
	frontleglower.justrender();
	
	// frontleglower right
	var frontleglower1 = new Cube();
	frontleglower1.textureNum = nn;
	frontleglower1.color = [0.25, 0.25, 0.25, 1.0];
	if(g_normalOn) frontleglower1.textureNum = tn;
	frontleglower1.matrix = frontrightleg;
	frontleglower1.matrix.translate(0, .3, .05, 0);
	frontleglower1.matrix.rotate(45, 1, 0, 0);
	frontleglower1.matrix.rotate(g_frontrightlowerlegAngle, 1, 0, 0);
	var frontleglowerrightmat = new Matrix4(frontleglower1.matrix);
	frontleglower1.matrix.scale(.15, .3, .15);
	frontleglower1.justrender();
	
	//front left paw
    var paw1 = new Cube;
	paw1.textureNum = nn;
    paw1.color = [0.4, 0.4, 0.4, 1.0];
	if(g_normalOn) paw1.textureNum = tn;
	paw1.matrix = frontleglowerleftmat;
	paw1.matrix.translate(-0.01, .22, 0.01, 0);
	paw1.matrix.rotate(g_frontleftpawAngle, 1, 0, 0);
	paw1.matrix.scale(.17,.12,.2);
    paw1.justrender();
	
	//front right paw
	var paw2 = new Cube;
	paw2.textureNum = nn;
    paw2.color = [0.4, 0.4, 0.4, 1.0];
	if(g_normalOn) paw2.textureNum = tn;
	paw2.matrix = frontleglowerrightmat;
	paw2.matrix.translate(-0.01, .22, 0.01, 0);
	paw2.matrix.rotate(g_frontrightpawAngle, 1, 0, 0);
	paw2.matrix.scale(.17,.12,.2);
    paw2.justrender();
	
	// backleg
	var backleg = new Cube();
	backleg.textureNum = nn;
	backleg.color = [0.3, 0.28, 0.3, 1.0];
	if(g_normalOn) backleg.textureNum = tn;
	backleg.matrix.setTranslate(-.28, 0, .6, 0);
	backleg.matrix.translate(x,y,z);
	backleg.matrix.rotate(195, 1, 0, 0);
	backleg.matrix.rotate(-g_backleftupperlegAngle, 1, 0, 0);
	var backleftleg = new Matrix4(backleg.matrix);
	backleg.matrix.scale(.18, .3, .22);
	backleg.justrender();
	
	// backleg right
	var backleg1 = new Cube();
	backleg1.textureNum = nn;
	backleg1.color = [0.3, 0.28, 0.3, 1.0];
	if(g_normalOn) backleg1.textureNum = tn;
	backleg1.matrix.setTranslate(.1, 0, .6, 0);
	backleg1.matrix.translate(x,y,z);
	backleg1.matrix.rotate(195, 1, 0, 0);
	backleg1.matrix.rotate(-g_backrightupperlegAngle, 1, 0, 0);
	var backrightleg = new Matrix4(backleg1.matrix);
	backleg1.matrix.scale(.18, .3, .22);
	backleg1.justrender();
	
	// backleglower
	var backleglower = new Cube();
	backleglower.textureNum = nn;
	backleglower.color = [0.25, 0.25, 0.25, 1.0];
	if(g_normalOn) backleglower.textureNum = tn;
	backleglower.matrix = backleftleg;
	backleglower.matrix.translate(0, .2, .07, 0);
	backleglower.matrix.rotate(-15, 1, 0, 0);
	backleglower.matrix.rotate(g_backleftlowerlegAngle, 1, 0, 0);
	var backleglowermat = new Matrix4(backleglower.matrix);
	backleglower.matrix.scale(.15, .4, .15);
	backleglower.justrender();
	
	// backleglower right
	var backleglower1 = new Cube();
	backleglower1.textureNum = nn;
	backleglower1.color = [0.25, 0.25, 0.25, 1.0];
	if(g_normalOn) backleglower1.textureNum = tn;
	backleglower1.matrix = backrightleg;
	backleglower1.matrix.translate(.0, .2, .07, 0);
	backleglower1.matrix.rotate(-15, 1, 0, 0);
	backleglower1.matrix.rotate(g_backrightlowerlegAngle, 1, 0, 0);
	var backleglower1mat = new Matrix4(backleglower1.matrix);
	backleglower1.matrix.scale(.15, .4, .15);
	backleglower1.justrender();
	
	//back left paw
	var paw3 = new Cube;
	paw3.textureNum = nn;
    paw3.color = [0.4, 0.4, 0.4, 1.0];
	if(g_normalOn) paw3.textureNum = tn;
	paw3.matrix = backleglowermat;
	paw3.matrix.translate(-0.01, .35, -.01, 0);
	paw3.matrix.rotate(g_backleftpawAngle, 1, 0, 0);
	paw3.matrix.scale(.17,.12,.22);
    paw3.justrender();
	
	//back right paw
	var paw4 = new Cube;
	paw4.textureNum = nn;
    paw4.color = [0.4, 0.4, 0.4, 1.0];
	if(g_normalOn) paw4.textureNum = tn;
	paw4.matrix = backleglower1mat;
	paw4.matrix.translate(-0.01, .35, -.01, 0);
	paw4.matrix.rotate(g_backrightpawAngle, 1, 0, 0);
	paw4.matrix.scale(.17,.12,.22);
    paw4.justrender();
}