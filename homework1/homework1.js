"use strict";

var canvas;
var gl;

var numVertices = 48;

var numChecks = 8;
var texSize = 64;
var program;

var c;

var flag = false;

var positionsArray = [];
var colorsArray = [];
var normalsArray = []

var radius = 5.0;
var theta = 0;
var phi = 0.0;
var scaling = 1
var near = 0.3;
var far = 10.0;
var z = 0.0;
var x = 0.0;
var y = 0.0;
var axis = x;
var dr = 5.0 * Math.PI/180.0;
var  fovy = 45.0;  
var  aspect = 2;

///////////////////// material + light
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.4, 0.2, 0.4, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(0.0, 0.8, 0.0, 1.0);

var ambientColor, diffuseColor;
/////////


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var rotThetaLoc;
var theta_rotation = vec3(90.0, 90.0, 90.0);

var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);


// texture part
var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
var texture;


var vertices = [

// bottommost octagon
vec4(0.6, 0.0, -1.0, 1.0), // point 0
vec4(0.3*Math.sqrt(2), 0.3*Math.sqrt(2), -1.0, 1.0), // point 1
vec4(0.0, 0.6, -1.0, 1.0), // point 2
vec4(-0.3*Math.sqrt(2), 0.3*Math.sqrt(2), -1.0, 1.0), // point 3
vec4(-0.6, 0.0, -1.0, 1.0), // point 4
vec4(-0.3*Math.sqrt(2), -0.3*Math.sqrt(2), -1.0, 1.0), // point 5
vec4(0.0, -0.6, -1.0, 1.0), // point 6
vec4(0.3*Math.sqrt(2), -0.3*Math.sqrt(2), -1.0, 1.0), // point 7
vec4(0, 0, -1.0, 1.0), // point (centroid) 8

// central lower  octagon
vec4(0.15, 0.0, -0.2, 1.0), // point 9
vec4(0.075*Math.sqrt(2), 0.075*Math.sqrt(2), -0.2, 1.0), // point 10
vec4(0.0, 0.15, -0.2, 1.0), // point 11
vec4(-0.075*Math.sqrt(2), 0.075*Math.sqrt(2), -0.2, 1.0), // point 12
vec4(-0.15, 0.0, -0.2, 1.0), // point 13
vec4(-0.075*Math.sqrt(2), -0.075*Math.sqrt(2), -0.2, 1.0), // point 14
vec4(0.0, -0.15, -0.2, 1.0), // point 15
vec4(0.075*Math.sqrt(2), -0.075*Math.sqrt(2), -0.2, 1.0), // point 16
vec4(0, 0, -0.2, 1.0), // point (centroid) 17

// central upper octagon
vec4(0.15, 0.0, 0.2, 1.0), // point 18
vec4(0.075*Math.sqrt(2), 0.075*Math.sqrt(2), 0.2, 1.0), // point 19
vec4(0.0, 0.15, 0.2, 1.0), // point 20
vec4(-0.075*Math.sqrt(2), 0.075*Math.sqrt(2), 0.2, 1.0), // point 21
vec4(-0.15, 0.0, 0.2, 1.0), // point 22
vec4(-0.075*Math.sqrt(2), -0.075*Math.sqrt(2), 0.2, 1.0), // point 23
vec4(0.0, -0.15, 0.2, 1.0), // point 24
vec4(0.075*Math.sqrt(2), -0.075*Math.sqrt(2), 0.2, 1.0), // point 25
vec4(0, 0, 0.2, 1.0), // point (centroid) 26

// topmost octagon
vec4(0.6, 0.0, 1.0, 1.0), // point 27
vec4(0.3*Math.sqrt(2), 0.3*Math.sqrt(2), 1.0, 1.0), // point 28
vec4(0.0, 0.6, 1.0, 1.0), // point 29
vec4(-0.3*Math.sqrt(2), 0.3*Math.sqrt(2), 1.0, 1.0), // point 30
vec4(-0.6, 0.0, 1.0, 1.0), // point 31
vec4(-0.3*Math.sqrt(2), -0.3*Math.sqrt(2), 1.0, 1.0), // point 32
vec4(0.0, -0.6, 1.0, 1.0), // point 33
vec4(0.3*Math.sqrt(2), -0.3*Math.sqrt(2), 1.0, 1.0), // point 34
vec4(0, 0, 1.0, 1.0), // point (centroid) 35

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


//// texture
// function configureTexture( image ) {
//     texture_test = gl.createTexture();
//     gl.bindTexture( gl.TEXTURE_2D, texture_test );
//     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
//     gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
//          gl.RGB, gl.UNSIGNED_BYTE, image );
//     gl.generateMipmap( gl.TEXTURE_2D );
//     gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
//                       gl.NEAREST_MIPMAP_LINEAR );
//     gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

//     gl.uniform1i(gl.getUniformLocation(program, "texture_test"), 0);
// }

function configureTexture(image) {
    texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  
    gl.uniform1i(gl.getUniformLocation(program, 'texture_test'), 0)
  }


function tri(a, b, c) {
    positionsArray.push(vertices[a])
    //colorsArray.push(vertexColors[7])
    texCoordsArray.push(texCoord[0]);
    
    positionsArray.push(vertices[b])
    //colorsArray.push(vertexColors[7])
    texCoordsArray.push(texCoord[2]);
  
    positionsArray.push(vertices[c])
    //colorsArray.push(vertexColors[7])
    texCoordsArray.push(texCoord[3]);
  }

function quad(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    //colorsArray.push(vertexColors[1]);
    texCoordsArray.push(texCoord[0]);

    positionsArray.push(vertices[b]);
    normalsArray.push(normal);
    //colorsArray.push(vertexColors[0]);
    texCoordsArray.push(texCoord[1]);

    positionsArray.push(vertices[c]);
    normalsArray.push(normal);
    //colorsArray.push(vertexColors[0]);
    texCoordsArray.push(texCoord[2]);

    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    //colorsArray.push(vertexColors[1]);
    texCoordsArray.push(texCoord[0]);

    positionsArray.push(vertices[c]);
    normalsArray.push(normal);
    //colorsArray.push(vertexColors[0]);
    texCoordsArray.push(texCoord[2]);
    
    positionsArray.push(vertices[d]);
    normalsArray.push(normal);
    //colorsArray.push(vertexColors[0]);
    texCoordsArray.push(texCoord[3]);
}

function colorHourGlass()
{
 
    tri(1,0,8);
    tri(2, 1, 8);
    tri(3, 2, 8);
    tri(4, 3, 8);
    tri(5, 4, 8);
    tri(6, 5, 8);
    tri(7, 6, 8);
    tri(0, 7, 8);

    tri(35, 27, 28);
    tri(35, 28, 29);
    tri(35, 29, 30);
    tri(35, 30, 31);
    tri(35, 31, 32);
    tri(35, 32, 33);
    tri(35, 33, 34);
    tri(35, 34, 27);
    
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
    // what am i supposed to look at?
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorHourGlass();
    numVertices = positionsArray.length;
    this.console.log(this.numVertices);

    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    // var colorLoc = gl.getAttribLocation(program, "aColor");
    // gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    /// trxture
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var texCoordLoc = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( texCoordLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( texCoordLoc );

    var image = document.getElementById("texImage");
    configureTexture( image );

    

////////////////////////////////////////// light
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

//////////////////////////////////////////
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

//////////////////////////////////////////// sliders for viewing parameters

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

    document.getElementById("radiusSlider").onchange = function(event) {
        radius = event.target.value;
     };
     document.getElementById("thetaSlider").onchange = function(event) {
         theta = event.target.value* Math.PI/180.0;
     };
     document.getElementById("phiSlider").onchange = function(event) {
         phi = event.target.value* Math.PI/180.0;
     };

     document.getElementById('scaleSlider').oninput = function (event) {
        scaling = event.target.value
      }

document.getElementById('scaleSlider').value = 1
document.getElementById("ButtonX").onclick = function(){axis = 0};
document.getElementById("ButtonY").onclick = function(){axis = 1;};
document.getElementById("ButtonZ").onclick = function(){axis = 2;};
document.getElementById("ButtonT").onclick = function(){flag = !flag;};

// this.console.log(rotate(theta[x], vec3(1, 0, 0)))
// this.console.log(x)
    render();
}


var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)

    // eye = vec3(x,y,z);
    if(flag)  theta_rotation[axis] += 1;
    
    
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
                radius*Math.sin(theta)*Math.sin(phi),
                radius*Math.cos(theta));


    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    
    modelViewMatrix = mult(modelViewMatrix, scale(scaling, scaling, scaling))

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniform3fv( gl.getUniformLocation(program, "uTheta"), theta_rotation);
    
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
    document.getElementById('scaleSlider').value = 1

    document.getElementById('radiusSlider').value = 5
    document.getElementById('thetaSlider').value = 45
    document.getElementById('phiSlider').value = 360

    far = 0.3
    near = 10.0
    x = 0.0
    y = 0.0
    z = 4.0
    ascpect = 2
    fovy = 45.0
    scaling = 1

    radius = 5
    theta = 45
    phi = 360
    
    

    
}


