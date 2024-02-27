"use strict";

// javascript:(function()
// {
//     var script=document.createElement('script');
//     script.onload=function()
//     {
//         var stats=new Stats();
//         document.body.appendChild(stats.dom);
//         requestAnimationFrame(function loop()
//         {
//             stats.update();
//             requestAnimationFrame(loop)});
//         };
//         script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';
//         document.head.appendChild(script);})()



console.log("start");
let canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");

if (!gl) 
{
    console.log("O WebGL não está disponível, seu navegador pode não suportar.");
}


let CurrentTime, ElapsedTime, PreviousTime = Date.now(), LagTime = 0;
let FPS = 60;          // Frames per second
let FrameTime = 1 / FPS;
let UpdateIntervalInSeconds = FrameTime;
let MPF = 1000 * FrameTime; // Milliseconds per frame.
let FrameCounter = 0;
let CurrentFPS = 0;
let UpdateTimeFPS = Date.now();

const pixelRatio = window.devicePixelRatio || 1;
canvas.width  = pixelRatio * window.innerWidth;
canvas.height = pixelRatio * window.innerHeight;


var width = canvas.width;
var height = canvas.height;




const main = async () => 
{
    console.log("main");
    
    
    Renderer.Init(width, height);
    Renderer.SetClearColor(0.1, 0.1, 0.1);
    Renderer.SetViewPort(0, 0, width, height);

    Renderer.SetOrthoProjection(0, width, height, 0, -10, 10);
    let camera = Mat4.GetMatrix2D(width/2,height/2,1,1,0,width/2,height/2);
    Renderer.SetViewMatrix(camera);


    Assets.Init();
    Input.Init();
    ImediateRenderer.Init();



    let total = 70000 / 4;

    let scollX = 0;
 

    let linesRender   = new PolyBatch(8192);
    let fillRender    = new PolyBatch(8192);
    let spriteRender  = new SpriteBatch(total);
    let fontRender    = new SpriteBatch(500);
 

    


    let font= new Font();   
    await font.Create(defaultFontImage, defaultFontData).then(() =>
    {
      
      
     
    });





    Assets.OnLoad = function(filename)
    {
     

    };

    Assets.OnComplete = function()
    {

       
    }

    Assets.OnProgress = function(filename, progress, total)
     {
    //     Renderer.Clear(0, 0, 0, 1);
      

        

    //     linesRender.SetColor(GRAY);
    //     linesRender.DrawRectangle(10, 40, canvas.width-20, 40);
    //     linesRender.SetColor(GREEN);
    //     linesRender.DrawRectangle(10, 40, (canvas.width-20) * (progress/total), 40);

    //     linesRender.Render();

    


    //     font.Print(spriteRender,10, 40,16, "Carregando: "+ filename +" Progresso: " + Math.floor((progress/total)*100) +"%");
   
    
    //    spriteRender.Render();
      






        console.log("Load:  "+filename+" Progresso: " + Math.floor((progress/total)*100) +"%");
    };



    Assets.AddTexture("wabbit", "assets/wabbit_alpha.png");
    Assets.AddTexture("atlas", "assets/minion_sprite.png");
    Assets.AddTexture("background", "assets/backgroundDesert.png");
    Assets.AddTexture("dirt", "assets/dirt.png");
    Assets.AddTexture("lama", "assets/lama.png");
    Assets.AddTexture("tiles", "assets/wall.png");
    
    await Assets.LoadAll();

    Gui.Init();


    
    // await Assets.LoadTexture("wabbit", "assets/wabbit_alpha.png");
    // await Assets.LoadTexture("atlas", "assets/minion_sprite.png");

    // await Assets.LoadImage("player", "assets/player.png");
    // await Assets.LoadImage("enemy", "assets/enemy.png");
    // await Assets.LoadImage("bullet", "assets/bullet.png");
    // await Assets.LoadAudio("shoot", "assets/shoot.wav");
    // await Assets.LoadAudio("explosion", "assets/explosion.wav");
    // await Assets.LoadAudio("background", "assets/background.mp3");

    console.log("Assets loaded");


    let w = 200;
    let h = 200;
    let x =width/2 - w/2;
    let y =height/2 - h/2;

    const vertices = [
        // Vertex 1
        x, y, 0,  // Position
        0, 0,  // UV
        1.0,1.0,1.0,1.0, // Color

        // Vertex 2
        x + w, y, 0,  // Position
        1, 0, // UV
        1.0,1.0,1.0,1.0, // Color

        // Vertex 3
        x + w, y + h, 0, // Position
        1, 1,  // UV
        1.0,1.0,1.0,1.0, // Color

        // Vertex 4
        x, y + h, 0,  // Position
        0, 1,  // UV
        1.0,1.0,1.0,1.0, // Color
    ];

    const indices = [0, 1, 2, 2, 3, 0];
    let quadArray = new VertexArray();
    quadArray.Begin();
    let quadBuffer = new VertexBuffer( vertices, vertices.length  , [POSIION3D,TEXTURE,COLOR4]);
    let quadIndexBuffer = new IndexBuffer(indices);
    quadArray.End();
  

    let innerRadius = 80.0;
    let outerRadius = 190.0;
    let segments = 30;
    let startAngle = 0.0;
    let endAngle = 360.0;
    let drawRing = false;
    let progress = 0.0;
    let rValue = 0.5;
    let gValue = 0;
    let bValue = 0;
    let inputText = {text:"Input", selected:false};





    function Update(dt)
    {
       
    }


    function Render()
    {
      
    //   Renderer.Clear();
       gl.clear(gl.COLOR_BUFFER_BIT);
       

       

   

       //    DrawRingLines(x, y, innerRadius, outerRadius, startAngle, endAngle,  segments)ºº

       
      

      //   spriteRender.SetColor(BLUE);
       //  spriteRender.Draw(Assets.GetTexture("wabbit"), 100, 400, 100,100);

        // fillRender.SetColor(LIGHTGRAY);
        // fillRender.DrawRectangle(1100, 30, 320, 600);
        
        // Gui.Panel(1100, 30, 320, 600)

        // innerRadius = Gui.Slider(1200, 40, 120, 20,"InnerRadius","", 0, 100, innerRadius);
        // outerRadius = Gui.Slider(1200, 80, 120, 20,"OuterRadius","", 0, 200, outerRadius);
        // segments = Gui.Slider(1200, 120, 120, 20,"Segments","", 0, 100, segments);

        // startAngle = Gui.Slider(1200, 160, 120, 20,"StartAngle","", 0, 360, startAngle);
        // endAngle = Gui.Slider(1200, 200, 120, 20,"EndAngle", "",0, 360, endAngle);

        // rValue = Gui.VerticalSlider(1330, 260, 20, 100, "R","", 0, 1, rValue);
        // gValue = Gui.VerticalSlider(1355, 260, 20, 100, "G","", 0, 1, gValue);
        // bValue = Gui.VerticalSlider(1380, 260, 20, 100, "B","", 0, 1, bValue);
        

        // drawRing = Gui.CheckBox(1200, 280, 20, 20,"DrawRing", drawRing);

        // if (Gui.Button(1200, 360, 120, 40, "Draw"))
        // {
        //     console.log("pressed");
        //     progress +=0.1;
        //     if (progress > 1) progress = 0;
        // }

        // Gui.ProgressBar(1200, 420, 120, 20, null,1, progress);

        // if (Gui.InputText(1200, 460, 120, 20,inputText))
        // {
        //     console.log("inputText"+inputText.text);
        // }

        
        //  fillRender.SetColor4f(rValue, gValue, bValue, 0.8);
        //  fillRender.DrawRing(600, 200, innerRadius, outerRadius, startAngle, endAngle, segments);

        //   linesRender.SetColor(RED);
        //   linesRender.DrawRingLines(600, 400,innerRadius, outerRadius, startAngle, endAngle, segments);


        // //  spriteRender.Render();   
        // //  fillRender.Render();
        //   linesRender.Render();
         
 

       // ImediateRenderer.DrawRectangle(40, 100, 100, 100);
  


        // quadArray.Begin();
        // Renderer.DrawElements(TRIANGLES, 6,  0);
        // quadArray.End();
       
      //  Gui.Render();
 
    


   
        // font.SetColor(LIME);
        // font.SetSize(22);
        // font.SetAllignment("left");
        // font.Print(fontRender,20, 20, "FPS: "+CurrentFPS );
        // font.Print(fontRender,20, 40, "textures: "+Renderer.numTextures + " Draws " + Renderer.numDrawCalls );
        // font.Print(fontRender,20, 60, "Programs: "+Renderer.numPrograms + " Vertices: " + Renderer.numVertex + " Triangles: " + Renderer.numTriangles);
       

   
       
        //  fontRender.Render();

  





      
        



    }


    function GameLoop () 
    {
        window.requestAnimationFrame(function () 
        {
            GameLoop();
        });

        Renderer.ResetStats();    
        CurrentTime = Date.now();
        ElapsedTime = (CurrentTime - PreviousTime)/1000;
        PreviousTime = CurrentTime;
        LagTime += ElapsedTime;
        FrameCounter++;

        Renderer.elapsedTime = CurrentTime;
        Renderer.deltaTime = ElapsedTime;
       
  
           
   
    
        // while (LagTime >= MPF) 
        // {
        //     LagTime -= MPF;
        //     Process();
        // }
        
        Update(ElapsedTime/100);

        
        Render();
      //  Input.Update();
        if (CurrentTime - UpdateTimeFPS > 1000) 
        {
            CurrentFPS = FrameCounter;
            FrameCounter = 0;
            window.document.title = "FPS: " + CurrentFPS;
            UpdateTimeFPS = Date.now();
        }

    };


GameLoop();


    window.onresize = function()
    {
        console.log("resize");
        let width  =  window.innerWidth;
        let height =  window.innerHeight;
        //Renderer.SetViewPort(0, 0, width, height);
       // Renderer.SetOrthoProjection(0, width, height, 0, -10, 10);

      //  let camera = Mat4.GetMatrix2D(width/2,height/2,1,1,0,width/2,height/2);
      //  Renderer.SetViewMatrix(camera);

    }


};



window.onload = function()
{
    console.log("onload");
    main();
};

/*
private function apply (fit:Bool, sourceWidth:Float,  sourceHeight:Float,  targetWidth:Float,  targetHeight:Float):Point
	{
	//	fit
	if (fit)
	{
			var targetRatio:Float = targetHeight / targetWidth;
			var sourceRatio:Float = sourceHeight / sourceWidth;
			var scale:Float = targetRatio > sourceRatio ? targetWidth / sourceWidth : targetHeight / sourceHeight;
			return new Point(sourceWidth * scale, sourceHeight * scale);
	} else
	{
		
	//	fill
		var targetRatio:Float = targetHeight / targetWidth;

			var sourceRatio:Float = sourceHeight / sourceWidth;

			var scale:Float = targetRatio < sourceRatio ? targetWidth / sourceWidth : targetHeight / sourceHeight;

			return new Point(sourceWidth * scale, sourceHeight * scale);


	}
	}
*/