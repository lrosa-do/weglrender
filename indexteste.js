"use strict";

// javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

console.log("start");
let canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");

if (!gl) 
{
    console.log("O WebGL não está disponível, seu navegador pode não suportar.");
}
var stats=new Stats();
document.body.appendChild(stats.dom);

const pixelRatio = window.devicePixelRatio || 1;
canvas.width  = pixelRatio * window.innerWidth;
canvas.height = pixelRatio * window.innerHeight;


var width = canvas.width;
var height = canvas.height;
    
Core.Init(width, height);
Core.SetClearColor(0.1, 0.1, 0.1);
Core.SetViewPort(0, 0, width, height);

Core.SetOrthoProjection(0, width, height, 0, -10, 10);
let camera = Mat4.GetMatrix2D(width/2,height/2,1,1,0,width/2,height/2);
Core.SetViewMatrix(camera);


Assets.Init();
Input.Init();

let fontRender    = new SpriteBatch(500);
 

    


let font= new Font();   
font.Create(defaultFontImage, defaultFontData).then(() =>
{
  
  
 
});

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
          
    font.SetColor(LIME);
    font.SetSize(22);
    font.SetAllignment("left");

    font.Print(fontRender,20, 40, "textures: "+Core.numTextures + " Draws " + Core.numDrawCalls );
    font.Print(fontRender,20, 60, "Programs: "+Core.numPrograms + " Vertices: " + Core.numVertex + " Triangles: " + Core.numTriangles);
   
    fontRender.Render();


}


function update(dt)
{

}


window.requestAnimationFrame(function loop()
{
    Core.ResetStats();

    stats.begin();

    update(1/60.0);
    render();

   

    stats.update();
    stats.end();
    requestAnimationFrame(loop);
});