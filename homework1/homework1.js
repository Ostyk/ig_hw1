"use strict";

var canvas;
var gl;

var numVertices = 192;

var numChecks = 8;

var program;

var c;

var flag = true;

var positionsArray = [];
var colorsArray = [];

var near = 0.3;
var far = 10.0;
var z = 4.0;
var x = 0.0;
var y = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  
var  aspect = 2;


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);



var vertices = [


// bottommost octagon
vec4(0.6, 0.0, -2.0, 1.0), // point 0
vec4(0.3*Math.sqrt(2), 0.3*Math.sqrt(2), -2.0, 1.0), // point 1
vec4(0.0, 0.6, -2.0, 1.0), // point 2
vec4(-0.3*Math.sqrt(2), 0.3*Math.sqrt(2), -2.0, 1.0), // point 3
vec4(-0.6, 0.0, -2.0, 1.0), // point 4
vec4(-0.3*Math.sqrt(2), -0.3*Math.sqrt(2), -2.0, 1.0), // point 5
vec4(0.0, -0.6, -2.0, 1.0), // point 6
vec4(0.3*Math.sqrt(2), -0.3*Math.sqrt(2), -2.0, 1.0), // point 7
vec4(0, 0, -2.0, 1.0), // point (centroid) 8

// central lower  octagon
vec4(0.15, 0.0, -0.3, 1.0), // point 9
vec4(0.075*Math.sqrt(2), 0.075*Math.sqrt(2), -0.3, 1.0), // point 10
vec4(0.0, 0.15, -0.3, 1.0), // point 11
vec4(-0.075*Math.sqrt(2), 0.075*Math.sqrt(2), -0.3, 1.0), // point 12
vec4(-0.15, 0.0, -0.3, 1.0), // point 13
vec4(-0.075*Math.sqrt(2), -0.075*Math.sqrt(2), -0.3, 1.0), // point 14
vec4(0.0, -0.15, -0.3, 1.0), // point 15
vec4(0.075*Math.sqrt(2), -0.075*Math.sqrt(2), -0.3, 1.0), // point 16
vec4(0, 0, -0.3, 1.0), // point (centroid) 17

// central upper octagon
vec4(0.15, 0.0, 0.3, 1.0), // point 18
vec4(0.075*Math.sqrt(2), 0.075*Math.sqrt(2), 0.3, 1.0), // point 19
vec4(0.0, 0.15, 0.3, 1.0), // point 20
vec4(-0.075*Math.sqrt(2), 0.075*Math.sqrt(2), 0.3, 1.0), // point 21
vec4(-0.15, 0.0, 0.3, 1.0), // point 22
vec4(-0.075*Math.sqrt(2), -0.075*Math.sqrt(2), 0.3, 1.0), // point 23
vec4(0.0, -0.15, 0.3, 1.0), // point 24
vec4(0.075*Math.sqrt(2), -0.075*Math.sqrt(2), 0.3, 1.0), // point 25
vec4(0, 0, 0.3, 1.0), // point (centroid) 26

// topmost octagon
vec4(0.6, 0.0, 2.0, 1.0), // point 27
vec4(0.3*Math.sqrt(2), 0.3*Math.sqrt(2), 2.0, 1.0), // point 28
vec4(0.0, 0.6, 2.0, 1.0), // point 29
vec4(-0.3*Math.sqrt(2), 0.3*Math.sqrt(2), 2.0, 1.0), // point 30
vec4(-0.6, 0.0, 2.0, 1.0), // point 31
vec4(-0.3*Math.sqrt(2), -0.3*Math.sqrt(2), 2.0, 1.0), // point 32
vec4(0.0, -0.6, 2.0, 1.0), // point 33
vec4(0.3*Math.sqrt(2), -0.3*Math.sqrt(2), 2.0, 1.0), // point 34
vec4(0, 0, 2.0, 1.0), // point (centroid) 35



];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // white
];


function tri(a, b, c) {
    positionsArray.push(vertices[a])
    colorsArray.push(vertexColors[1])
  
    positionsArray.push(vertices[b])
    colorsArray.push(vertexColors[0])
  
    positionsArray.push(vertices[c])
    colorsArray.push(vertexColors[0])
  }

function quad(a, b, c, d) {
    positionsArray.push(vertices[a]);
    colorsArray.push(vertexColors[1]);

    positionsArray.push(vertices[b]);
    colorsArray.push(vertexColors[0]);

    positionsArray.push(vertices[c]);
    colorsArray.push(vertexColors[0]);

    positionsArray.push(vertices[a]);
    colorsArray.push(vertexColors[1]);

    positionsArray.push(vertices[c]);
    colorsArray.push(vertexColors[0]);
    
    positionsArray.push(vertices[d]);
    colorsArray.push(vertexColors[0]);
}

function colorHourGlass()
{
    tri(8, 0, 1);
    tri(8, 1, 2);
    tri(8, 2, 3);
    tri(8, 3, 4);
    tri(8, 4, 5);
    tri(8, 5, 6);
    tri(8, 6, 7);
    tri(8, 7, 0);
    tri(35, 27, 28);
    tri(35, 28, 29);
    tri(35, 29, 30);
    tri(35, 30, 31);
    tri(35, 31, 32);
    tri(35, 32, 33);
    tri(35, 33, 34);
    tri(35, 34, 27);
    tri(34, 27, 35);

    quad(0, 1, 10, 9); 
    quad(1, 2, 11, 10); 
    quad(2, 3, 12, 11); 
    quad(3, 4, 13, 12); 
    quad(4, 5, 14, 13); 
    quad(5, 6, 15, 14); 
    quad(6, 7, 16, 15); 
    quad(7, 0, 9, 16); 
    quad(9, 10, 19, 18); 
    quad(10, 11, 20, 19); 
    quad(11, 12, 21, 20); 
    quad(12, 13, 22, 21); 
    quad(13, 14, 23, 22); 
    quad(14, 15, 24, 23); 
    quad(15, 16, 25, 24); 
    quad(16, 9, 18, 25); 
    quad(18, 19, 28, 27); 
    quad(19, 20, 29, 28); 
    quad(20, 21, 30, 29); 
    quad(21, 22, 31, 30); 
    quad(22, 23, 32, 31); 
    quad(23, 24, 33, 32); 
    quad(24, 25, 34, 33); 
    quad(25, 18, 27, 34); 


}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorHourGlass();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

// sliders for viewing parameters

    document.getElementById("zFarSlider").oninput = function(event) {
        far = event.target.value;
    };
    document.getElementById("zNearSlider").oninput = function(event) {
        near = event.target.value;
    };
    document.getElementById("xSlider").oninput = function(event) {
        x = event.target.value;
    };
    document.getElementById("ySlider").oninput = function(event) {
        y = event.target.value;
    };
    document.getElementById("zSlider").oninput = function(event) {
        z = event.target.value;
    };
    document.getElementById("aspectSlider").oninput = function(event) {
        aspect = event.target.value;
    };
    document.getElementById("fovSlider").oninput = function(event) {
        fovy = event.target.value;
    };

    render();
}


var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)

    eye = vec3(x,y,z);
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimationFrame(render);
}




function resetButton(){

    document.getElementById("zFarSlider").value=10
    document.getElementById("zNearSlider").value=2


    document.getElementById("xSlider").value=0
    document.getElementById("ySlider").value=0
    document.getElementById("zSlider").value=0

    document.getElementById("fovSlider").value=40
    document.getElementById("aspectSlider").value=1

    far = 0.3
    near = 10.0
    x = 0.0
    y = 0.0
    z = 4.0
    ascpect = 2
    fovy = 45.0
    
    

    
}


