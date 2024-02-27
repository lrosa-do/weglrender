"use strict";



console.log("start");
let canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");

if (!gl) 
{
    console.log("O WebGL não está disponível, seu navegador pode não suportar.");
}
var stats=new Stats();
document.body.appendChild(stats.dom);

let CurrentTime, ElapsedTime, PreviousTime = Date.now(), LagTime = 0;
let FPS = 60;          // Frames per second
let FrameTime = 1 / FPS;
let UpdateIntervalInSeconds = FrameTime;
let MPF = 1000 * FrameTime; // Milliseconds per frame.
let FrameCounter = 0;
let CurrentFPS = 0;
let UpdateTimeFPS = Date.now();

const pixelRatio = window.devicePixelRatio || 1;
canvas.width  = pixelRatio * window.innerWidth ;
canvas.height = pixelRatio * window.innerHeight;


var width = canvas.width;
var height = canvas.height;





console.log("main");


Renderer.Init(width, height);
Renderer.SetClearColor(0.1, 0.1, 0.1);
Renderer.SetViewPort(0, 0, width, height);
Renderer.SetOrthoProjection(0, width, height, 0, -10, 10);
let camera = Mat4.GetMatrix2D(width/2,height/2,1,1,0,width/2,height/2);
Renderer.SetViewMatrix(camera);


Assets.Init();
Input.Init();
Gui.Init();



let total = 20000 / 4;
let lines   = new LineBatch(2192);
let fill    = new FillBatch(2192);
let spriteRender  = new SpriteBatch(total);
let fontRender    = new SpriteBatch(500);
let font= new Font();   

Assets.AddTexture("wabbit", "assets/wabbit_alpha.png");
Assets.AddTexture("atlas", "assets/minion_sprite.png");
Assets.AddTexture("background", "assets/backgroundDesert.png");
Assets.AddTexture("dirt", "assets/dirt.png");
Assets.AddTexture("lama", "assets/lama.png");
Assets.AddTexture("tiles", "assets/wall.png");

async function Load()
{
    await font.Create(defaultFontImage, defaultFontData);
    await Assets.LoadAll();
}




Assets.OnLoad = function(filename)
{
    

};

Assets.OnComplete = function()
{

    
}

Assets.OnProgress = function(filename, progress, total)
{
    Renderer.Clear();
    

    

    fill.SetColor(GRAY);
    fill.Rectangle(10, 40, canvas.width-20, 40);
    fill.SetColor(GREEN);
    fill.Rectangle(10, 40, (canvas.width-20) * (progress/total), 40);

    fill.Render();




    font.Print(spriteRender,10, 40,16, "Carregando: "+ filename +" Progresso: " + Math.floor((progress/total)*100) +"%");


    spriteRender.Render();
    






    console.log("Load:  "+filename+" Progresso: " + Math.floor((progress/total)*100) +"%");
};




    






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
    let isToggle = false;

    let labels = 
    [
        {caption:"Radio1",state:false},
        {caption:"Radio2",state:false},
        {caption:"Radio3",state:true},
        {caption:"Radio4",state:false},
        {caption:"Radio5",state:false},
        {caption:"Radio6",state:false},
        {caption:"Radio7",state:false},
        {caption:"Radio8",state:false},
        
        
    ];

    let checkBox =
    [
        {caption:"Check1",state:false},
        {caption:"Check2",state:false},
        {caption:"Check3",state:true},
        {caption:"Check4",state:false},
        {caption:"Check5",state:false},
        {caption:"Check6",state:false},
        {caption:"Check7",state:false},
        {caption:"Check8",state:false},
        
        
    ];
        


    function Process()
    {
    
     
    }

    function Update(dt)
    {
        
    }


    function Render()
    {
      
         Renderer.Clear();
      
       

   

      

        spriteRender.SetColor(BLUE);
      //  spriteRender.Draw(Assets.GetTexture("wabbit"), 100, 400, 100,100);

        // fill.SetColor(LIGHTGRAY);
        // fill.Rectangle(1100, 30, 320, 600);

        Gui.Begin(1000,100,650,550,{bar:true,background:true,dragging:true,title:"Config" });

        //RadioGroup RadioGroup(x, y, w, h, rows, cols, labels)
     
        Gui.RadioGroup(210, 260, 20, 20,5,  4, labels,true, "Radio Group");

        Gui.CheckBoxGroup(200, 350, 20, 20,5,  4,    checkBox  ,true, "Check Box Group");
        
       // Gui.Panel(0, 0, 250, 500)

        innerRadius = Gui.Slider(100, 40, 120, 20,"InnerRadius","", 0, 100, innerRadius);
        outerRadius = Gui.Slider(100, 80, 120, 20,"OuterRadius","", 0, 200, outerRadius);
        segments = Gui.Slider(100, 120, 120, 20,"Segments","", 0, 100, segments);

        startAngle = Gui.Slider(100, 160, 120, 20,"StartAngle","", 0, 360, startAngle);
        endAngle = Gui.Slider(100, 200, 120, 20,"EndAngle", "",0, 360, endAngle);

        rValue = Gui.VerticalSlider(30, 330, 20, 100, "R","", 0, 1, rValue);
        gValue = Gui.VerticalSlider(55, 330, 20, 100, "G","", 0, 1, gValue);
        bValue = Gui.VerticalSlider(80, 330, 20, 100, "B","", 0, 1, bValue);
        

         drawRing = Gui.CheckBox(180, 450, 20, 20,"DrawRing", drawRing);

        if (Gui.Button(50, 450, 120, 40, "Draw"))
        {
            console.log("pressed");
            progress +=0.1;
            if (progress > 1) progress = 0;
        }

        isToggle=Gui.Radio(290,460, 20,25, "Toggle", isToggle);

         Gui.ProgressBar(50, 230, 120, 20, null,1, progress);

        if (Gui.InputText(50, 270, 120, 20,inputText))
        {
            console.log("inputText"+inputText.text);
        }
        Gui.End();

        
         fill.SetColor4f(rValue, gValue, bValue, 0.8);
         fill.Ring(600, 200, innerRadius, outerRadius, startAngle, endAngle, segments);

          lines.SetColor(RED);
          lines.Ring(600, 400,innerRadius, outerRadius, startAngle, endAngle, segments);


        spriteRender.Render();   


        fill.Render();
        lines.Render();
         
 

       
        Gui.Render();
 
    


   
        font.SetColor(LIME);
        font.SetSize(22);
        font.SetAllignment("left");
        font.Print(fontRender,20, 120, "FPS: "+Int(CurrentFPS ));
        font.Print(fontRender,20, 140, "textures: "+Int(Renderer.numTextures) + " Draws " + Int(Renderer.numDrawCalls));
        font.Print(fontRender,20, 160, "Programs: "+Int(Renderer.numPrograms) + " Vertices: " + Int(Renderer.numVertex) + " Triangles: " + Int(Renderer.numTriangles));
       

   
       
         fontRender.Render();

  

      
        



    }




    function GameLoop () 
    {
    

        Renderer.ResetStats();    
        CurrentTime = Date.now();
        ElapsedTime = (CurrentTime - PreviousTime)/1000;
        PreviousTime = CurrentTime;
        LagTime += (ElapsedTime * 1000);
        FrameCounter++;

        Renderer.elapsedTime = CurrentTime;
        Renderer.deltaTime = ElapsedTime;
       
  
           
        Update(ElapsedTime);
    
        while (LagTime >= MPF) 
        {
            LagTime -= MPF;
 
            Process();
        }

        Render();
      

        
       
        Input.Update();
        if (CurrentTime - UpdateTimeFPS > 1000) 
        {
            CurrentFPS = FrameCounter;
            FrameCounter = 0;
          //  window.document.title = "FPS: " + CurrentFPS;
            UpdateTimeFPS = Date.now();
        }

    };






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

window.onload = function()
{
    console.log("onload");
    Load().then(() =>
    {
        console.log("Start Game");
        Game();
    });

};




function Game()
{
    GameLoop();
    stats.update();
    requestAnimationFrame(Game);
}

