
class Color 
{
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Set(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    SetColor(color)
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }
    SetHex(hex)
    {
        this.r = ((hex >> 16) & 0xff) / 255;
        this.g = ((hex >> 8) & 0xff) / 255;
        this.b = (hex & 0xff) / 255;
        this.a = ((hex >> 24) & 0xff) / 255;
    }
    SetRandom()
    {
        this.r = Math.random();
        this.g = Math.random();
        this.b = Math.random();
        this.a = 1.0;
    }
    static Fade(color, alpha)
    {
        if (alpha < 0.0) alpha = 0.0;
        else if (alpha > 1.0) alpha = 1.0;
        return new Color(color.r, color.g, color.b, alpha);
    }

}


const RED = new Color(1.0, 0.0, 0.0, 1.0);
const GREEN = new Color(0.0, 1.0, 0.0, 1.0);
const BLUE = new Color(0.0, 0.0, 1.0, 1.0);
const WHITE = new Color(1.0, 1.0, 1.0, 1.0);
const BLACK = new Color(0.0, 0.0, 0.0, 1.0);
const YELLOW = new Color(1.0, 1.0, 0.0, 1.0);
const MAGENTA = new Color(1.0, 0.0, 1.0, 1.0);
const CYAN = new Color(0.0, 1.0, 1.0, 1.0);
const ORANGE = new Color(1.0, 0.5, 0.0, 1.0);
const GRAY = new Color(0.5, 0.5, 0.5, 1.0);
const BROWN = new Color(0.5, 0.25, 0.0, 1.0);
const PURPLE = new Color(0.5, 0.0, 0.5, 1.0);
const PINK = new Color(1.0, 0.5, 0.5, 1.0);
const LIME = new Color(0.5, 1.0, 0.5, 1.0);
const TEAL = new Color(0.0, 0.5, 0.5, 1.0);
const OLIVE = new Color(0.5, 0.5, 0.0, 1.0);
const MAROON = new Color(0.5, 0.0, 0.0, 1.0);
const NAVY = new Color(0.0, 0.0, 0.5, 1.0);
const SILVER = new Color(0.75, 0.75, 0.75, 1.0);
const GOLD = new Color(1.0, 0.84, 0.0, 1.0);
const SKYBLUE = new Color(0.53, 0.81, 0.98, 1.0);
const VIOLET = new Color(0.93, 0.51, 0.93, 1.0);
const INDIGO = new Color(0.29, 0.0, 0.51, 1.0);
const TURQUOISE = new Color(0.25, 0.88, 0.82, 1.0);
const BEIGE = new Color(0.96, 0.96, 0.86, 1.0);
const TAN = new Color(0.82, 0.71, 0.55, 1.0);
const KHAKI = new Color(0.94, 0.9, 0.55, 1.0);
const LAVENDER = new Color(0.9, 0.9, 0.98, 1.0);
const SALMON = new Color(0.98, 0.5, 0.45, 1.0);
const CORAL = new Color(1.0, 0.5, 0.31, 1.0);
const AQUA = new Color(0.0, 1.0, 1.0, 1.0);
const MINT = new Color(0.74, 0.99, 0.79, 1.0);
const LEMON = new Color(0.99, 0.91, 0.0, 1.0);
const APRICOT = new Color(0.98, 0.81, 0.69, 1.0);
const PEACH = new Color(1.0, 0.9, 0.71, 1.0);
const LILAC = new Color(0.78, 0.64, 0.78, 1.0);
const LAVENDERBLUSH = new Color(1.0, 0.94, 0.96, 1.0);
const CRIMSON = new Color(0.86, 0.08, 0.24, 1.0);
const DARKORANGE = new Color(1.0, 0.55, 0.0, 1.0);
const LIGHTGRAY = new Color(0.83, 0.83, 0.83, 1.0);
const DARKGRAY = new Color(0.66, 0.66, 0.66, 1.0);
const DARKGREEN = new Color(0.0, 0.39, 0.0, 1.0);
const DARKBLUE = new Color(0.0, 0.0, 0.55, 1.0);
const DARKRED = new Color(0.55, 0.0, 0.0, 1.0);
const DARKCYAN = new Color(0.0, 0.55, 0.55, 1.0);
const RAYWHITE = new Color(0.96, 0.96, 0.96, 1.0);




class Shader
{
    uniforms = {};
    
    constructor()
    {
        this.program = null;
    }

    Release()
    {
        gl.deleteProgram(this.program);

    }
 
    static   CreateSolidShader()
{
    let VertexShaderSolid = `
    precision mediump float;
    attribute vec3 aPosition;
    attribute vec4 aColor;
    uniform mat4 uProjection;
    uniform mat4 uView;
    varying vec4 vColor;
    void main()
    {
        gl_Position = uProjection * uView * vec4(aPosition, 1.0);
        vColor = aColor;
    }
    `;

    let FragmentShaderSolid = `
    precision mediump float;
    varying vec4 vColor;
    void main()
    {
        gl_FragColor = vColor;
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderSolid, FragmentShaderSolid);
    shader.Use();
    shader.AddUniform("uProjection");
    shader.AddUniform("uView");
    shader.UnSet();
    return shader;

    }

    static  CreateTextureShader()
    {
        let VertexShaderSprite = `
        precision mediump float;
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
        attribute vec4 aColor;
        uniform mat4 uProjection;
        uniform mat4 uView;

        varying vec2 vTexCoord;
        varying vec4 vColor;

        void main()
            {
                gl_Position = uProjection * uView * vec4(aPosition, 1.0);
                vTexCoord = aTexCoord;
                vColor = aColor;
            }
            `;

        let FragmentShaderSprite = `
        precision mediump float;
        varying vec2 vTexCoord;
        varying vec4 vColor;
        uniform sampler2D uTexture;

        void main()
        {
            gl_FragColor =  texture2D(uTexture, vTexCoord) * vColor;
        }
        `;

        let shader = new Shader();
        shader.Load(VertexShaderSprite, FragmentShaderSprite);
        shader.AddUniform("uProjection");
        shader.AddUniform("uView");
        shader.AddUniform("uTexture");
        shader.SetUniform1i("uTexture", 0);
        shader.UnSet();
        return shader;

    }
    static  CreateTextureNoColorShader()
    {
        let VertexShaderSprite = `
        precision mediump float;
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
  
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform mat4 uModel;

        varying vec2 vTexCoord;
  

        void main()
            {
                gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
                vTexCoord = aTexCoord;
      
            }
            `;

        let FragmentShaderSprite = `
        precision mediump float;
        varying vec2 vTexCoord;

        uniform sampler2D uTexture;

        void main()
        {
            gl_FragColor =  texture2D(uTexture, vTexCoord) ;
        }
        `;

        let shader = new Shader();
        shader.Load(VertexShaderSprite, FragmentShaderSprite);
        shader.AddUniform("uProjection");
        shader.AddUniform("uView");
        shader.AddUniform("uModel");
        shader.AddUniform("uTexture");
        shader.SetUniform1i("uTexture", 0);
        shader.UnSet();
        return shader;

    }

    Load( vertexShaderSource, fragmentShaderSource)
    {
        
        this.program = gl.createProgram();
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vertexShader, vertexShaderSource);
        gl.shaderSource(this.fragmentShader, fragmentShaderSource);
        gl.compileShader(this.vertexShader);
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) 
        {
            console.error('Erro ao compilar o vertex shader!', gl.getShaderInfoLog(this.vertexShader));
            return;
        }
        gl.compileShader(this.fragmentShader);
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) 
        {
            console.error('Erro ao compilar o fragment shader!', gl.getShaderInfoLog(this.fragmentShader));
            return;
        }
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) 
        {
            console.error('Erro ao linkar o programa!', gl.getProgramInfoLog(this.program));
            return;
        }
        gl.deleteShader(this.vertexShader);
        gl.deleteShader(this.fragmentShader);

        this.Use();

        console.log("Shader carregado com sucesso" );

    }
    Use()
    {
        if (this.program === null) return;
        Renderer.SetProgram(this.program);
    }

    UnSet()
    {
        Renderer.SetProgram(null);

    }

    AddUniform(name)
    {
        if (this.program === null) return;
        
        this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }
    ContainsUniform(name)
    {
        if (this.program === null) return false;
        return this.uniforms[name] !== undefined;
    }
    SetUniform1f(name, value)
    {
        if (this.ContainsUniform(name))
        {
          
            gl.uniform1f(this.uniforms[name], value);
        }
    }
    SetUniform2f(name, x, y)
    {
        if (this.ContainsUniform(name))
        {
        
            gl.uniform2f(this.uniforms[name], x, y);
        }
    }
    SetUniform3f(name, x, y, z)
    {
        if (this.ContainsUniform(name))
        {
        
            gl.uniform3f(this.uniforms[name], x, y, z);
        }
    }
    SetUniform4f(name, x, y, z, w)
    {
        if (this.ContainsUniform(name))
        {
      
            gl.uniform4f(this.uniforms[name], x, y, z, w);
        }
    }
    SetUniform1i(name, value)
    {
        if (this.ContainsUniform(name))
        {
    
            gl.uniform1i(this.uniforms[name], value);
        }
    }
    SetUniform4fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
  
            gl.uniform4fv(this.uniforms[name], value);
        }
    }
    SetUniformMatrix4fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
      
            gl.uniformMatrix4fv(this.uniforms[name], false, value);
        }
    }
    SetUniformMatrix2fv(name, value)
    {
        if (this.ContainsUniform(name))
        {

            gl.uniformMatrix2fv(this.uniforms[name], false, value);
        }
    }
    SetUniformMatrix3fv(name, value)
    {
        if (this.ContainsUniform(name))
        {
 
            gl.uniformMatrix3fv(this.uniforms[name], false, value);
        }
    }


}

const POINTS                         = 0x0000;
const LINES                          = 0x0001;
const LINE_LOOP                      = 0x0002;
const LINE_STRIP                     = 0x0003;
const TRIANGLES                      = 0x0004;
const TRIANGLE_STRIP                 = 0x0005;
const TRIANGLE_FAN                   = 0x0006;


class PolyBatch
{
    constructor(maxVertex)
    {
        this.vertexStrideSize = (3 + 4) ;

        this.maxVertex =  maxVertex ;
 
        this.vertices = new Float32Array( this.maxVertex * 3 * this.vertexStrideSize *4); 
        this.totalAlloc = Math.floor( ( this.maxVertex * 3 * this.vertexStrideSize * 4) /7 );
        console.log("TotalAlloc: " + this.totalAlloc + " Vertex: " + Math.floor(this.totalAlloc*7));
        this.vertexCount= 0;
        this.indexCount = 0;
        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
        this.mode = -1;
        this.Init();
   
    }
    Release()
    {
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteVertexArray(this.VAO);
    }

    Reset()
    {
     

    }

    Init()
    {
      

        this.vertexBuffer = gl.createBuffer();
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
 
     

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, this.vertexStrideSize *4, 3*4);


        gl.bindVertexArray(null);





    }
    Vertex3f(x, y, z)
    {
       
        this.vertices[this.indexCount++] = x;
        this.vertices[this.indexCount++] = y;
        this.vertices[this.indexCount++] = z;
        this.vertices[this.indexCount++] = this.colorr;
        this.vertices[this.indexCount++] = this.colorg;
        this.vertices[this.indexCount++] = this.colorb;
        this.vertices[this.indexCount++] = this.colora;
        
        if ( this.vertexCount >= this.totalAlloc ) 
        {

            throw "Vertex buffer overflow with " +this.vertexCount + "  max  " + this.totalAlloc;
        }

        this.vertexCount++;
        
       
    }
    Vertex2f(x, y)
    {
        this.Vertex3f(x, y, 0.5);
    }
    Color4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    Color3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }

    Render()
    {
       this.Flush();   
    }

    Flush()
    {
     
        if (this.indexCount === 0) return;
        if (this.mode === -1) return;
        Renderer.SetSolidRender();

        Renderer.EnableBlend(true);

       
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.indexCount));
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      




        let count =this.vertexCount;

   
        gl.bindVertexArray(this.VAO);
 
        Renderer.DrawArrays(this.mode, 0, count);

        gl.bindVertexArray(null);

        this.indexCount = 0;
        this.vertexCount = 0;


     //   console.log( "Vertex buffer overflow with " + this.indexCount+" vtx " +this.vertexCount + "  max  " + this.totalAlloc);
    
    //     const error = gl.getError();
    //    if (error !== gl.NO_ERROR) 
    //    {
    //     console.log( "Vertex buffer overflow" + this.indexCount + " "+this.vertexCount +" "+ this.totalAlloc);
    //       // console.error("Erro WebGL:", error);       
    //    }

       
    }
    Clear()
    {

        this.vertices.fill(0);
              
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      

        this.indexCount = 0;
        this.vertexCount = 0;
    }
    SetMode(mode)
    {
        if (this.mode !== mode)
        {
            this.Flush();
        }
     
        this.mode = mode;
    }

    SetColor4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    SetColor3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }
    SetColor(color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }
    Line(x1, y1, x2, y2)
    {
        this.SetMode(LINES);
        this.Vertex2f(x1, y1);
        this.Vertex2f(x2, y2);
    }

    DrawRotateRectangle(x, y, w, h, pivot_x, pivot_y,rotation)
    {
        let cosRotation = Math.cos(rotation*DEG2RAD);
        let sinRotation = Math.sin(rotation*DEG2RAD);


        let dx = -pivot_x * w;
        let dy = -pivot_y * h;

        let topLeftX = x + dx * cosRotation - dy * sinRotation;
        let topLeftY = y + dx * sinRotation + dy * cosRotation;

        let topRightX = x + (dx + w) * cosRotation - dy * sinRotation;
        let topRightY = y + (dx + w) * sinRotation + dy * cosRotation;

        let bottomLeftX = x + dx * cosRotation - (dy + h) * sinRotation;
        let bottomLeftY = y + dx * sinRotation + (dy + h) * cosRotation;

        let bottomRightX = x + (dx + w) * cosRotation - (dy + h) * sinRotation;
        let bottomRightY = y + (dx + w) * sinRotation + (dy + h) * cosRotation;


        this.SetMode(TRIANGLES);

        
        this.Vertex2f(topLeftX, topLeftY);
        this.Vertex2f(topRightX, topRightY);
        this.Vertex2f(bottomRightX, bottomRightY);

        this.Vertex2f(bottomRightX, bottomRightY);
        this.Vertex2f(bottomLeftX, bottomLeftY);
        this.Vertex2f(topLeftX, topLeftY);

        
    }
    DrawCircleSector(x, y, radius, startAngle, endAngle,  segments)
    {
            
            this.SetMode(TRIANGLES);
            if (radius <= 0.0) radius = 0.1;
            if (endAngle < startAngle)
            {
                let tmp = startAngle;
                startAngle = endAngle;
                endAngle = tmp;
            }
    
            let minSegments = Math.ceil((endAngle - startAngle)/90);
    
            if (segments < minSegments)
            {
                let th = Math.acos(2*Math.pow(1 - 0.5/radius, 2) - 1);
                segments = Math.ceil(2*Math.PI/th);
                if (segments <= 0) segments = minSegments;
            }
    
            let stepLength = (endAngle - startAngle)/segments;
            let angle = startAngle;
           
    
            for (let i = 0; i < segments; i++)
            {
                this.Vertex2f(x, y);
                this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
                this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*radius, y + Math.cos(DEG2RAD*(angle + stepLength))*radius);
                    
                angle += stepLength;
            }
    

    }
    DrawCircle(x, y, radius)    
    {
        this.DrawCircleSector(x, y, radius, 0, 360, 28);
    }


    DrawCircleSectorLines(x, y, radius, startAngle, endAngle,  segments)
    {

        this.SetMode(LINES);
        if (radius <= 0.0) radius = 0.1;
        if (endAngle < startAngle)
        {
            let tmp = startAngle;
            startAngle = endAngle;
            endAngle = tmp;
        }

        let minSegments = Math.ceil((endAngle - startAngle)/90);

        if (segments < minSegments)
        {
            let th = Math.acos(2*Math.pow(1 - 0.5/radius, 2) - 1);
            segments = Math.ceil(2*Math.PI/th);
            if (segments <= 0) segments = minSegments;
        }

        let stepLength = (endAngle - startAngle)/segments;
        let angle = startAngle;
        let showCapLines = false;

  
        
        if (showCapLines)
        {
        this.Vertex2f(x, y);
        this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
        }

        for (let i = 0; i < segments; i++)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*radius, y + Math.cos(DEG2RAD*(angle + stepLength))*radius);
                
            angle += stepLength;
        }
        if(showCapLines)
        {
        this.Vertex2f(x, y);
        this.Vertex2f(x + Math.sin(DEG2RAD*angle)*radius, y + Math.cos(DEG2RAD*angle)*radius);
        }

    
    }

    DrawCircleLines(x, y, radius)
    {
        this.DrawCircleSectorLines(x, y, radius, 0, 360, 18);

    }
    DrawRingLines(x, y, innerRadius, outerRadius, startAngle, endAngle,  segments)
    {
        if (startAngle == endAngle) return;

        if (outerRadius < innerRadius)
        {
            let tmp = outerRadius;
            outerRadius = innerRadius;
            innerRadius = tmp;

            if (outerRadius <= 0.0) outerRadius = 0.1;
        }

        if (endAngle < startAngle)
        {
            let tmp = startAngle;
            startAngle = endAngle;
            endAngle = tmp;
        }

        let minSegments = Math.ceil((endAngle - startAngle)/90);

        if (segments < minSegments)
        {
            let th = Math.acos(2*Math.pow(1 - 0.5/outerRadius, 2) - 1);
            segments = Math.ceil(2*Math.PI/th);
            if (segments <= 0) segments = minSegments;
        }

        if (innerRadius <= 0.0)
        {
            this.DrawCircleSectorLines(x, y, outerRadius, startAngle, endAngle, segments);
            return;
        }

        let stepLength = (endAngle - startAngle)/segments;
        let angle = startAngle;
        let showCapLines = true;

        this.SetMode(LINES);
        if (showCapLines)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*outerRadius, y + Math.cos(DEG2RAD*angle)*outerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*innerRadius, y + Math.cos(DEG2RAD*angle)*innerRadius);
        }

        for (let i = 0; i < segments; i++)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*outerRadius, y + Math.cos(DEG2RAD*angle)*outerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*outerRadius, y + Math.cos(DEG2RAD*(angle + stepLength))*outerRadius);

            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*innerRadius, y + Math.cos(DEG2RAD*angle)*innerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*innerRadius, y + Math.cos(DEG2RAD*(angle + stepLength))*innerRadius);

            angle += stepLength;
        }

        if (showCapLines)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*outerRadius, y + Math.cos(DEG2RAD*angle)*outerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*innerRadius, y + Math.cos(DEG2RAD*angle)*innerRadius);
        }

    }
    DrawRing(x, y, innerRadius, outerRadius, startAngle, endAngle,  segments)
    {
        if (startAngle == endAngle) return;

        if (outerRadius < innerRadius)
        {
            let tmp = outerRadius;
            outerRadius = innerRadius;
            innerRadius = tmp;

            if (outerRadius <= 0.0) outerRadius = 0.1;
        }

        if (endAngle < startAngle)
        {
            let tmp = startAngle;
            startAngle = endAngle;
            endAngle = tmp;
        }

        let minSegments = Math.ceil((endAngle - startAngle)/90);

        if (segments < minSegments)
        {
            let th = Math.acos(2*Math.pow(1 - 0.5/outerRadius, 2) - 1);
            segments = Math.ceil(2*Math.PI/th);
            if (segments <= 0) segments = minSegments;
        }

        if (innerRadius <= 0.0)
        {
            this.DrawCircleSector(x, y, outerRadius, startAngle, endAngle, segments);
            return;
        }

        let stepLength = (endAngle - startAngle)/segments;
        let angle = startAngle;

        this.SetMode(TRIANGLES);
        for (let i = 0; i < segments; i++)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*outerRadius, y + Math.cos(DEG2RAD*angle)*outerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*outerRadius, y + Math.cos(DEG2RAD*(angle + stepLength))*outerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*innerRadius, y + Math.cos(DEG2RAD*angle)*innerRadius);

            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*outerRadius, y + Math.cos(DEG2RAD*(angle + stepLength))*outerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*innerRadius, y + Math.cos(DEG2RAD*(angle + stepLength))*innerRadius);
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*innerRadius, y + Math.cos(DEG2RAD*angle)*innerRadius);

            angle += stepLength;
        }



    }





    DrawEllipseLine(x, y, width, height)
    {
        this.SetMode(LINES);
        let segments = 36;
        let stepLength = 360/segments;
        let angle = 0;
        for (let i = 0; i < segments; i++)
        {
            this.Vertex2f(x + Math.sin(DEG2RAD*angle)*width, y + Math.cos(DEG2RAD*angle)*height);
            this.Vertex2f(x + Math.sin(DEG2RAD*(angle + stepLength))*width, y + Math.cos(DEG2RAD*(angle + stepLength))*height);
            angle += stepLength;
        }       
    }
    DrawRectangleLinesFromTo(x, y,x2,y2)
    {
        this.SetMode(LINES);
        this.Vertex2f(x, y);
        this.Vertex2f(x2, y);
        this.Vertex2f(x2, y);
        this.Vertex2f(x2, y2);
        this.Vertex2f(x2, y2);
        this.Vertex2f(x, y2);
        this.Vertex2f(x, y2);
        this.Vertex2f(x, y);
    }
    DrawRectangleLines(x, y,width,height)
    {
        this.SetMode(LINES);
        this.Vertex2f(x, y);
        this.Vertex2f(x + width, y);
        this.Vertex2f(x + width, y);
        this.Vertex2f(x + width, y + height);
        this.Vertex2f(x + width, y + height);
        this.Vertex2f(x, y + height);
        this.Vertex2f(x, y + height);
        this.Vertex2f(x, y);
    }
    DrawRectangle(x, y,width,height)
    {
        this.SetMode(TRIANGLES);
        this.Vertex2f(x, y);
        this.Vertex2f(x + width, y);
        this.Vertex2f(x + width, y + height);

        this.Vertex2f(x + width, y + height);
        this.Vertex2f(x, y + height);
        this.Vertex2f(x, y);
    }
    DrawRectangleFromTo(x, y,x2,y2)
    {
        this.SetMode(TRIANGLES);
        this.Vertex2f(x, y);
        this.Vertex2f(x2, y);
        this.Vertex2f(x2, y2);

        this.Vertex2f(x2, y2);
        this.Vertex2f(x, y2);
        this.Vertex2f(x, y);
    }
    DrawTrianglesStrip(points)
    {
        this.SetMode(TRIANGLE_STRIP);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawTrianglesFan(points)
    {
        this.SetMode(TRIANGLE_FAN);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawLines(points)
    {
        this.SetMode(LINES);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawPoints(points)
    {
        this.SetMode(POINTS);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawLinesStrip(points)
    {
        this.SetMode(LINE_STRIP);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawLinesLoop(points)
    {
        this.SetMode(LINE_LOOP);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
    DrawTriangles(points)
    {
        this.SetMode(TRIANGLES);
        for (let i = 0; i < points.length; i++)
        {
            this.Vertex2f(points[i].x, points[i].y);
        }
    }
}


const Allign =
{
    Left  : 0,
    Right : 1,
    Center: 2,
    Bottom: 3,
    Top   : 4,
    
};

class SpriteBatch 
{
    static  FIX_ARTIFACTS_BY_STRECHING_TEXEL = true;

    constructor(capacity)
    {
        this.maxVertex = capacity;
        this.vertexStrideSize = (3 + 2 + 4);
        this.vertices = new Float32Array(capacity * 4 * this.vertexStrideSize);
        this.indices  = new Uint16Array(capacity *  4 * 6);
        this.maxElemnts = capacity * 4 * 6;

        this.quad = new Float32Array(8);
    


        this.totalAlloc = Math.floor( ( this.maxVertex * 4 * this.vertexStrideSize * 4) / 9);

        this.vertexCount  = 0;
        this.vertexIndex  = 0;


        this.invTexWidth  = 1;
        this.invTexHeight = 1;




        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
        this.uvx=0;
        this.uvy=0;
        this.flip_x = false;
        this.flip_y = false;
        
        this.defaultTexture  = Renderer.defaultTexture;
        let k=0;
        for (let i = 0; i < this.maxElemnts ; i+=6)
        {
            this.indices[i ]    = 4 * k + 0;
            this.indices[i + 1] = 4 * k + 1;
            this.indices[i + 2] = 4 * k + 2;
            this.indices[i + 3] = 4 * k + 0;
            this.indices[i + 4] = 4 * k + 2;
            this.indices[i + 5] = 4 * k + 3;
            k++;
        }    
        this.Init();

    }

    Release()
    {
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.indexBuffer);
        this.defaultTexture.Release();
    }
    Init()
    {
       

  
     //   this.defaultTexture.Create(1, 1, 4, new Uint8Array([255, 0, 255, 255]));
        this.currentBaseTexture = this.defaultTexture;
 

        
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer  = gl.createBuffer();
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.vertexStrideSize *4, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.vertexStrideSize *4, 3 * 4);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.vertexStrideSize *4, 5 * 4);

       gl.bindVertexArray(null);


    }
    Vertex3(x, y, z)
    {
        this.vertices[this.vertexIndex++] = x;
        this.vertices[this.vertexIndex++] = y;
        this.vertices[this.vertexIndex++] = z;
        this.vertices[this.vertexIndex++] = this.uvx;
        this.vertices[this.vertexIndex++] = this.uvy;
        this.vertices[this.vertexIndex++] = this.colorr;
        this.vertices[this.vertexIndex++] = this.colorg;
        this.vertices[this.vertexIndex++] = this.colorb;
        this.vertices[this.vertexIndex++] = this.colora;

        if ( this.vertexCount >= this.totalAlloc ) 
        {
            throw "Vertex buffer overflow with " +this.vertexCount + "  max  " + this.totalAlloc;
        }

        this.vertexCount++;

    }



    SwitchTexture(texture)
    {
       
        this.Flush();
        
        this.currentBaseTexture = texture;
        this.invTexWidth =  1.0 / texture.width;
        this.invTexHeight = 1.0 / texture.height;
        this.textureCount++;
    }

    Render()
    {
        this.Flush();

    }

    
    Flush()
    {
     

       if (this.vertexCount === 0) return;

     
        Renderer.EnableBlend(true);
        Renderer.SetBlendMode(BlendMode.Normal);
        Renderer.SetTextureShader();
 
       
       gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
       gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.vertexIndex));
       gl.bindBuffer(gl.ARRAY_BUFFER, null);


  

      


        gl.bindVertexArray(this.VAO);
        this.currentBaseTexture.Use();
        Renderer.DrawElements(gl.TRIANGLES, (this.vertexCount / 4) * 6, 0);
  
        gl.bindVertexArray(null);


        this.vertexIndex = 0;
        this.vertexCount = 0;

    


      //  this.currentBaseTexture = this.defaultTexture;
    }


 

    Clear()
    {
        this.vertices.fill(0);
              
       gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
       gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.vertexIndex = 0;
        this.vertexCount = 0;
 
      
    }
    SetFlip(flipX, flipY)
    {
        this.flip_x = flipX;
        this.flip_y = flipY;
    }
    FlipX(v)
    {
        this.flip_x = v;
    }

    FlipY(v)
    {
        this.flip_y = v;
    }
    
    SetColor4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    SetColor (color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }
    Vertex2(x, y)
    {
        this.Vertex3(x, y, 0.0);
    }

    TextCoords(u, v)
    {
        this.uvx = u ;
        this.uvy = v ;
    }

    Color4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    Color3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }
    
    Color(color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }



    DrawScrollingTiled(texture, x, y, width, height, xAmount , yAmount, xTiles, yTiles)
    {
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

 
        
        let totalTilesX = Math.floor(xTiles);
        let totalTilesY = Math.floor(yTiles);
    
  
    
        // Calcula as coordenadas de textura ajustadas com base no número total de tiles
        let left = 0 + (xAmount * totalTilesX);
        let right = left + (width / texture.width) * (1 * totalTilesX);
        let top = 0 + (yAmount / totalTilesY);
        let bottom = top + (height / texture.height) * (1 *totalTilesY);



        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }

        let fx2 = x + width;
        let fy2 = y + height;

        this.TextCoords(left, top);
        this.Vertex2(x, y);

        this.TextCoords(left, bottom);
        this.Vertex2(x, fy2);

        this.TextCoords(right, bottom);
        this.Vertex2(fx2, fy2);

        this.TextCoords(right, top);
        this.Vertex2(fx2, y);
    }

    DrawScrolling(texture, x, y, width, height, xAmount , yAmount)
    {

        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }


        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
       
        

        if (xAmount !== 0)
        {
            let widthTex = (right - left) * texture.width;
            left = (left + xAmount) % 1;
            right = left + widthTex / texture.width;
        }

        if (yAmount !== 0)
        {
            let heightTex = (bottom - top) * texture.height;
            top = (top + yAmount) % 1;
            bottom = top + heightTex / texture.height;
        }

        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }

        

        let fx2 = x + width;
        let fy2 = y + height;

        this.TextCoords(left, top);
        this.Vertex2(x, y);

        this.TextCoords(left, bottom);
        this.Vertex2(x, fy2);

        this.TextCoords(right, bottom);
        this.Vertex2(fx2, fy2);

        this.TextCoords(right, top);
        this.Vertex2(fx2, y);



    }

    
    DrawTransformedClip(texture, src_x, src_y, src_width,src_height, matrix, x_align=Allign.Left,y_align=Allign.Top)
    {
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        let widthTex  = texture.width;
        let heightTex = texture.height;



        if (this.FIX_ARTIFACTS_BY_STRECHING_TEXEL)
        {
      
         left = (2*src_x+1) / (2*widthTex);
         right =  left +(src_width*2-2) / (2*widthTex);
         top = (2*src_y+1) / (2*heightTex);
         bottom = top +(src_height * 2 - 2) / (2 * heightTex);
      
      
      
      }else
        {
         left = src_x / widthTex;
         right =  (src_x + src_width) / widthTex;
         top = src_y / heightTex;
         bottom = (src_y + src_height) / heightTex;
        }		
        
        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }


        if (x_align === Allign.Left)
        {
            this.quad[0] = 0;
            this.quad[2] = 0;
            this.quad[4] = src_width;
            this.quad[6] = src_width;
        } else 
        if (x_align === Allign.Right)
        {
            this.quad[0] = -src_width;
            this.quad[2] = -src_width;
            this.quad[4] = 0;
            this.quad[6] = 0;
        } else
        if (x_align === Allign.Center)
        {
            this.quad[0] = -src_width * 0.5;
            this.quad[2] = -src_width * 0.5;
            this.quad[4] = src_width * 0.5;
            this.quad[6] = src_width * 0.5;
        }

        if (y_align === Allign.Top)
        {
            this.quad[1] = 0;
            this.quad[3] = src_height;
            this.quad[5] = src_height;
            this.quad[7] = 0;
        } else
        if (y_align === Allign.Bottom)
        {
            this.quad[1] = -src_height;
            this.quad[3] = 0;
            this.quad[5] = 0;
            this.quad[7] = -src_height;
        } else
        if (y_align === Allign.Center)
        {
            this.quad[1] = -src_height * 0.5;
            this.quad[3] = src_height * 0.5;
            this.quad[5] = src_height * 0.5;
            this.quad[7] = -src_height * 0.5;
        }

    

        for (let i = 0; i < 4; i++)
        {
            let x = this.quad[i * 2];
            let y = this.quad[i * 2 + 1];

            this.quad[i * 2] = matrix.a * x + matrix.c * y + matrix.tx;
            this.quad[i * 2 + 1] = matrix.d * y + matrix.b * x + matrix.ty;
        }
            
      
   

        this.TextCoords(left, top);
        this.Vertex2( this.quad[0], this.quad[1]);

        this.TextCoords(left, bottom);
        this.Vertex2( this.quad[2], this.quad[3]);

        this.TextCoords(right, bottom);
        this.Vertex2( this.quad[4], this.quad[5]);

        this.TextCoords(right, top);
        this.Vertex2( this.quad[6], this.quad[7]);


      
    }

    DrawTransformed(texture,  matrix, x_align=Allign.Left,y_align=Allign.Top)
    {
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        let widthTex  = texture.width;
        let heightTex = texture.height;


        
        
        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }


        if (x_align === Allign.Left)
        {
            this.quad[0] = 0;
            this.quad[2] = 0;
            this.quad[4] = widthTex;
            this.quad[6] = widthTex;
        } else 
        if (x_align === Allign.Right)
        {
            this.quad[0] = -widthTex;
            this.quad[2] = -widthTex;
            this.quad[4] = 0;
            this.quad[6] = 0;
        } else
        if (x_align === Allign.Center)
        {
            this.quad[0] = -widthTex * 0.5;
            this.quad[2] = -widthTex * 0.5;
            this.quad[4] = widthTex * 0.5;
            this.quad[6] = widthTex * 0.5;
        }

        if (y_align === Allign.Top)
        {
            this.quad[1] = 0;
            this.quad[3] = heightTex;
            this.quad[5] = heightTex;
            this.quad[7] = 0;
        } else
        if (y_align === Allign.Bottom)
        {
            this.quad[1] = -heightTex;
            this.quad[3] = 0;
            this.quad[5] = 0;
            this.quad[7] = -heightTex;
        } else
        if (y_align === Allign.Center)
        {
            this.quad[1] = -heightTex * 0.5;
            this.quad[3] = heightTex * 0.5;
            this.quad[5] = heightTex * 0.5;
            this.quad[7] = -heightTex * 0.5;
        }

    

        for (let i = 0; i < 4; i++)
        {
            let x = this.quad[i * 2];
            let y = this.quad[i * 2 + 1];

            this.quad[i * 2] = matrix.a * x + matrix.c * y + matrix.tx;
            this.quad[i * 2 + 1] = matrix.d * y + matrix.b * x + matrix.ty;
        }
            
      
   

        this.TextCoords(left, top);
        this.Vertex2( this.quad[0], this.quad[1]);

        this.TextCoords(left, bottom);
        this.Vertex2( this.quad[2], this.quad[3]);

        this.TextCoords(right, bottom);
        this.Vertex2( this.quad[4], this.quad[5]);

        this.TextCoords(right, top);
        this.Vertex2( this.quad[6], this.quad[7]);


      
    }

    
    DrawTiled(texture, x, y, width, height,texture_repeat_x,texture_repeat_y)
    {
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

       
        let widthTex  = texture.width;
        let heightTex = texture.height;

        let left = 0;
        let right = texture_repeat_x;
        let top = 0;
        let bottom =texture_repeat_y;
    
        if (this.flip_x) {
            let tmp = left;
            left = right;
            right = tmp;
        }
    
        if (this.flip_y) {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }

        let fx2 = x + width;
        let fy2 = y + height;

        this.TextCoords(left, top);
        this.Vertex2(x, y);

        this.TextCoords(left, bottom);
        this.Vertex2(x, fy2);

        this.TextCoords(right, bottom);
        this.Vertex2(fx2, fy2);

        this.TextCoords(right, top);
        this.Vertex2(fx2, y);


      
      
    }

    Draw(texture, x, y, width, height)
    {
     
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }


      
        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }
       

      

        let fx2 = x + width;
        let fy2 = y + height;

        this.TextCoords(left, top);
        this.Vertex2(x, y);

        this.TextCoords(left, bottom);
        this.Vertex2(x, fy2);

        this.TextCoords(right, bottom);
        this.Vertex2(fx2, fy2);

        this.TextCoords(right, top);
        this.Vertex2(fx2, y);

    }

    DrawRotate(texture, x, y, w, h, pivot_x, pivot_y, rotation)
    {
   
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let spin = (rotation * DEG2RAD);
        let cosRotation = Math.cos(spin);
        let sinRotation = Math.sin(spin);


        let dx = -pivot_x * w;
        let dy = -pivot_y * h;

        let topLeftX = x + dx * cosRotation - dy * sinRotation;
        let topLeftY = y + dx * sinRotation + dy * cosRotation;

        let topRightX = x + (dx + w) * cosRotation - dy * sinRotation;
        let topRightY = y + (dx + w) * sinRotation + dy * cosRotation;

        let bottomLeftX = x + dx * cosRotation - (dy + h) * sinRotation;
        let bottomLeftY = y + dx * sinRotation + (dy + h) * cosRotation;

        let bottomRightX = x + (dx + w) * cosRotation - (dy + h) * sinRotation;
        let bottomRightY = y + (dx + w) * sinRotation + (dy + h) * cosRotation;


        let u = 0;
        let v = 0;
        let u2 = 1;
        let v2 = 1;

        if (this.flip_x)
        {
            let tmp = u;
            u = u2;
            u2 = tmp;
        }

        if (this.flip_y)
        {
            let tmp = v;
            v = v2;
            v2 = tmp;
        }


        this.TextCoords(u, v);
        this.Vertex2(topLeftX, topLeftY);

        this.TextCoords(u, v2);
        this.Vertex2(bottomLeftX, bottomLeftY);

        this.TextCoords(u2, v2);
        this.Vertex2(bottomRightX, bottomRightY);

        this.TextCoords(u2, v);
        this.Vertex2(topRightX, topRightY);

        
    }

    DrawRotateClip(texture, x, y, w, h, pivot_x, pivot_y,rotation, src_x, src_y, src_width, src_height)
    {
   
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let spin = (rotation * DEG2RAD);
        let cosRotation = Math.cos(spin);
        let sinRotation = Math.sin(spin);


        let dx = -pivot_x * w;
        let dy = -pivot_y * h;

        let topLeftX = x + dx * cosRotation - dy * sinRotation;
        let topLeftY = y + dx * sinRotation + dy * cosRotation;

        let topRightX = x + (dx + w) * cosRotation - dy * sinRotation;
        let topRightY = y + (dx + w) * sinRotation + dy * cosRotation;

        let bottomLeftX = x + dx * cosRotation - (dy + h) * sinRotation;
        let bottomLeftY = y + dx * sinRotation + (dy + h) * cosRotation;

        let bottomRightX = x + (dx + w) * cosRotation - (dy + h) * sinRotation;
        let bottomRightY = y + (dx + w) * sinRotation + (dy + h) * cosRotation;

        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        let widthTex = texture.width;
        let heightTex = texture.height;



        if (this.FIX_ARTIFACTS_BY_STRECHING_TEXEL)
        {
      
         left = (2*src_x+1) / (2*widthTex);
         right =  left +(src_width*2-2) / (2*widthTex);
         top = (2*src_y+1) / (2*heightTex);
         bottom = top +(src_height * 2 - 2) / (2 * heightTex);
      
      
      
      }else
        {
         left = src_x / widthTex;
         right =  (src_x + src_width) / widthTex;
         top = src_y / heightTex;
         bottom = (src_y + src_height) / heightTex;
         
      
       
        }		
        
        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }
       

        this.TextCoords(left, top);
        this.Vertex2(topLeftX, topLeftY);

        this.TextCoords(left, bottom);
        this.Vertex2(bottomLeftX, bottomLeftY);

        this.TextCoords(right, bottom);
        this.Vertex2(bottomRightX, bottomRightY);

        this.TextCoords(right, top);
        this.Vertex2(topRightX, topRightY);

        
    }

  
    DrawRotateClipScale(texture, x, y, pivot_x, pivot_y,rotation, scale_x, scale_y, src_x, src_y, src_width, src_height)
    {
   
        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let spin = (rotation * DEG2RAD);
        let cosRotation = Math.cos(spin);
        let sinRotation = Math.sin(spin);

        let w = src_width * scale_x;
        let h = src_height * scale_y;


        let dx = -pivot_x * w;
        let dy = -pivot_y * h;

        let topLeftX = x + dx * cosRotation - dy * sinRotation;
        let topLeftY = y + dx * sinRotation + dy * cosRotation;

        let topRightX = x + (dx + w) * cosRotation - dy * sinRotation;
        let topRightY = y + (dx + w) * sinRotation + dy * cosRotation;

        let bottomLeftX = x + dx * cosRotation - (dy + h) * sinRotation;
        let bottomLeftY = y + dx * sinRotation + (dy + h) * cosRotation;

        let bottomRightX = x + (dx + w) * cosRotation - (dy + h) * sinRotation;
        let bottomRightY = y + (dx + w) * sinRotation + (dy + h) * cosRotation;

        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        let widthTex = texture.width;
        let heightTex = texture.height;



        if (this.FIX_ARTIFACTS_BY_STRECHING_TEXEL)
        {
      
         left = (2*src_x+1) / (2*widthTex);
         right =  left +(src_width*2-2) / (2*widthTex);
         top = (2*src_y+1) / (2*heightTex);
         bottom = top +(src_height * 2 - 2) / (2 * heightTex);
      
      
      
      }else
        {
         left = src_x / widthTex;
         right =  (src_x + src_width) / widthTex;
         top = src_y / heightTex;
         bottom = (src_y + src_height) / heightTex;
         
      
       
        }		
        
        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }
       

        this.TextCoords(left, top);
        this.Vertex2(topLeftX, topLeftY);

        this.TextCoords(left, bottom);
        this.Vertex2(bottomLeftX, bottomLeftY);

        this.TextCoords(right, bottom);
        this.Vertex2(bottomRightX, bottomRightY);

        this.TextCoords(right, top);
        this.Vertex2(topRightX, topRightY);

        
    }

  
    DrawClip(texture, x, y, width, height, src_x, src_y, src_width, src_height)
    {

        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        let widthTex = texture.width;
        let heightTex = texture.height;



        if (this.FIX_ARTIFACTS_BY_STRECHING_TEXEL)
        {
      
         left = (2*src_x+1) / (2*widthTex);
         right =  left +(src_width*2-2) / (2*widthTex);
         top = (2*src_y+1) / (2*heightTex);
         bottom = top +(src_height * 2 - 2) / (2 * heightTex);
           
      
        }else
        {
         left = src_x / widthTex;
         right =  (src_x + src_width) / widthTex;
         top = src_y / heightTex;
         bottom = (src_y + src_height) / heightTex;
        }		
        
        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }
       



        this.TextCoords(left, top);
        this.Vertex2(x, y);

        this.TextCoords(left, bottom);
        this.Vertex2(x, y + height);

        this.TextCoords(right, bottom);
        this.Vertex2(x + width, y + height);

        this.TextCoords(right, top);
        this.Vertex2(x + width, y);


    }


    DrawClipScale(texture, x, y, scale_x, scale_y, src_x, src_y, src_width, src_height)
    {

        if (texture===null || texture === undefined) 
        {
            this.SwitchTexture(this.defaultTexture);
        } else 
        if (texture.id !== this.currentBaseTexture.id)
        { 
            this.SwitchTexture(texture);
        }

        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;

        let width  = src_width * scale_x;
        let height = src_height * scale_y;
    

        let widthTex = texture.width;
        let heightTex = texture.height;



        if (this.FIX_ARTIFACTS_BY_STRECHING_TEXEL)
        {
      
         left = (2*src_x+1) / (2*widthTex);
         right =  left +(src_width*2-2) / (2*widthTex);
         top = (2*src_y+1) / (2*heightTex);
         bottom = top +(src_height * 2 - 2) / (2 * heightTex);
      
      
      
      }else
        {
         left = src_x / widthTex;
         right =  (src_x + src_width) / widthTex;
         top = src_y / heightTex;
         bottom = (src_y + src_height) / heightTex;
         
      
       
        }			
       
        if (flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (flip_y)
        {   
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }




        this.TextCoords(left, top);
        this.Vertex2(x, y);

        this.TextCoords(left, bottom);
        this.Vertex2(x, y + height);

        this.TextCoords(right, bottom);
        this.Vertex2(x + width, y + height);

        this.TextCoords(right, top);
        this.Vertex2(x + width, y);


    }

    
}



class PolySprite 
{
    static VBOVERTEX=2;
    static VBOCOLOR =4;
    static VBOUV    =8;

    constructor()
    {
        this.points = [];
        this.colors = [];
        this.vertices = [];
        this.uvs = [];
        this.vertexBuffer = null;
        this.texture = null;
        this.color = new Color(1, 1, 1, 1);
        this.depth=0;
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.regionWidth = 0;
        this.regionHeight = 0;
        this.flags = 0;
        this.isTriangulated = false;
        this.triangles =0;
        this.Init();

        
    }

    Init()
    {
        this.vertexBuffer = gl.createBuffer();
        this.colorBuffer  = gl.createBuffer();
        this.uvBuffer     = gl.createBuffer();
        this.vertexArray  = gl.createVertexArray();

        gl.bindVertexArray(this.vertexArray);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);       

        gl.bindVertexArray(null);
      
    }

    TotalPoints()
    {
        return this.points.length / 2;
    }

    Clear()
    {
        this.points = [];
        this.colors = [];
        this.vertices = [];
        this.uvs = [];
        this.isTriangulated = false;
        this.triangles = 0;
        this.Update();
    }

    Move(x, y)
    {
        for (let i = 0; i < this.points.length; i += 2)
        {
            this.points[i] += x;
            this.points[i + 1] += y;
        }
    }

    Update()
    {
        if (this.texture === null || this.texture === undefined)  
        {
            throw new Error('[Render] The texture is not set.');
        };
        if (!this.isTriangulated) return;

        if (this.flags & PolySprite.VBOVERTEX)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.flags &= ~PolySprite.VBOVERTEX;
        }
        
        if (this.flags & PolySprite.VBOCOLOR)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.flags &= ~PolySprite.VBOCOLOR;
        }

        if (this.flags & PolySprite.VBOUV)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.flags &= ~PolySprite.VBOUV;
        }

   

    }

    SetRegion(x, y, width, height)
    {
        if (this.texture === null || this.texture === undefined) 
        {
            throw new Error('[SetRegion] The texture is not set.');
        };
        let invTexWidth  = 1 / this.texture.width;
        let invTexHeight = 1 / this.texture.height;
        this.SetUv(x * invTexWidth, y * invTexHeight, (x + width) * invTexWidth, (y + height) * invTexHeight);
        this.regionWidth = Math.abs(width);
        this.regionHeight = Math.abs(height);
    }

    SetUv(u, v, u2, v2)
    {
        this.left = u;
        this.top = v;
        this.right = u2;
        this.bottom = v2;
        this.flags |= PolySprite.VBOUV;

    }



    Release()
    {
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.colorBuffer);
        gl.deleteBuffer(this.uvBuffer);
        gl.deleteVertexArray(this.vertexArray);
    }

    SetTexture(texture)
    {
        this.texture = texture;
        this.SetRegion(0, 0, texture.width, texture.height);
    }

    AddPoint(x, y)
    {
        this.points.push(x);
        this.points.push(y);
    }

    PointX(index)
    {
        return this.points[index * 2];
    }
    PointY(index)
    {
        return this.points[index * 2 + 1];
    }
    ScaleVertex(factorX, factorY)
    {
        let no_verts = this.vertices.length;
        for (let i = 0; i < no_verts; i += 3)
        {
            this.vertices[i] *= factorX;
            this.vertices[i + 1] *= factorY;
        }
        this.flags |= PolySprite.VBOVERTEX;
    }
    ScaleTexCoords(factorX, factorY)
    {
        let no_uvs = this.uvs.length;
        for (let i = 0; i < no_uvs; i += 2)
        {
            this.uvs[i] *= factorX;
            this.uvs[i + 1] *= factorY;
        }
        this.flags |= PolySprite.VBOUV;
    }
    AddTriangle(x,y)
    {
        if (this.texture === null || this.texture === undefined)
        {
            throw new Error('[AddTriangle] The texture is not set.');
        };
        
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(this.depth);
        this.colors.push(this.color.r);
        this.colors.push(this.color.g);
        this.colors.push(this.color.b);
        this.colors.push(this.color.a);

      

        let uvWidth  = this.right - this.left;
        let uvHeight = this.bottom - this.top;

        let width  = this.regionWidth;
        let height = this.regionHeight;

        let xu = this.left + uvWidth * (x / width);
        let xv = this.top + uvHeight * (y / height);

        this.uvs.push(xu);
        this.uvs.push(xv);    
        this.triangles++;
    
    }

    Triangulate()
    {
        let no_verts = this.points.length / 2;
        if (no_verts < 3) return;

        this.colors = [];
        this.vertices = [];
        this.uvs = [];

        // for (let i = 0; i < no_verts; i++)
        // {
        //     this.AddTriangle(this.PointX(i), this.PointY(i));
        // }
        
        let tris = Triangulate(this.points);

        for (let i = 0; i < tris.length; i += 3)
        {
            let i0 = tris[i];
            let i1 = tris[i + 1];
            let i2 = tris[i + 2];

            this.AddTriangle(this.PointX(i0), this.PointY(i0));
            this.AddTriangle(this.PointX(i1), this.PointY(i1));
            this.AddTriangle(this.PointX(i2), this.PointY(i2));
   
        }


       
        console.log("Triangulate PolySprite" + this.triangles);
        this.isTriangulated = true;
        this.flags |= PolySprite.VBOVERTEX | PolySprite.VBOCOLOR | PolySprite.VBOUV;
    }


    Render()
    {
        this.Update();
        if (this.vertices.length === 0 || !this.isTriangulated) return;
      

        if (this.texture === null || this.texture === undefined)  
        {
            throw new Error('[Render] The texture is not set.');
        };

   
        Renderer.EnableBlend(true);
        Renderer.SetBlendMode(BlendMode.Normal);
        Renderer.SetTextureShader();
     
        this.texture.Use();
     

   

        gl.bindVertexArray(this.vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, this.triangles);
        gl.bindVertexArray(null);
  

    }

    Transform(matrix)
    {
        if (this.vertices.length === 0) return;
        let no_verts = this.vertices.length / 3;

        let is2D = matrix instanceof Matrix2D;
 
        for (let i = 0; i < no_verts; i++)
        {
            let x = this.vertices[i * 3];
            let y = this.vertices[i * 3 + 1];
            let z = this.vertices[i * 3 + 2];

            if (is2D)
            {
                this.vertices[i * 3] = matrix.a * x + matrix.c * y + matrix.tx;
                this.vertices[i * 3 + 1] = matrix.d * y + matrix.b * x + matrix.ty;
                this.vertices[i * 3 + 2] = z;
            } else 
            {
                        console.log("TODO: 3D Transform PolySprite");
            }
        }
        this.flags |= PolySprite.VBOVERTEX;
    }

    DrawPointsLines(PolyBatch ,color)
    {
        if (this.points.length === 0) return;
        PolyBatch.SetColor(color);
        let no_verts = this.points.length / 2;
        if (no_verts < 2) return;
        for (let i = 0; i < no_verts - 1; i++)
        {
            let x0 = this.PointX(i);
            let y0 = this.PointY(i);
            let x1 = this.PointX(i + 1);
            let y1 = this.PointY(i + 1);
            PolyBatch.Line(x0, y0, x1, y1);
        }

        if (no_verts > 2)
        {
            let x0 = this.PointX(no_verts - 1);
            let y0 = this.PointY(no_verts - 1);
            let x1 = this.PointX(0);
            let y1 = this.PointY(0);
            PolyBatch.Line(x0, y0, x1, y1);
        }


    
    }

    DrawLines(PolyBatch ,color)
    {
        if (this.points.length === 0) return;
        if (this.points.length < 2) return;
        if (!this.isTriangulated)    return;
        PolyBatch.SetColor(color);
             //triangles
        
        for (let i = 0; i < this.triangles; i++)
        {
            let i0 = i * 3;
            let i1 = i0 + 1;
            let i2 = i0 + 2;
            let x0 = this.vertices[i0 * 3];
            let y0 = this.vertices[i0 * 3 + 1];
            let x1 = this.vertices[i1 * 3];
            let y1 = this.vertices[i1 * 3 + 1];
            let x2 = this.vertices[i2 * 3];
            let y2 = this.vertices[i2 * 3 + 1];
            PolyBatch.Line(x0, y0, x1, y1);
            PolyBatch.Line(x1, y1, x2, y2);
            PolyBatch.Line(x2, y2, x0, y0);
        }
    
    }
}


class SpriteTerrain 
{
    constructor()
    {
        this.terrainTop = new PolySprite();
        this.terrain   = new PolySprite();
        this.terrainTop.color.Set(1,1,1, 1);
        this.points = [];
        this.select = -1;
        this.dragging = false;
        this.radius   = 20;
        this.thickness = 50; // Height of the terrain
        this.splinePoints = [];
    }
    Pick(x, y)
    {
        for (let i = 0; i < this.points.length; i++) 
        {
            if (this.points[i].distance(x, y) < this.radius)
            {
                return i;
            }
        }
        return -1;
    }
    TotalPoints()
    {
        return this.points.length;
    }
    CalculateCenter()
    {
        let center = new Vector2(0, 0);
        for (let i = 0; i < this.points.length; i++) 
        {
            center.x += this.points[i].x;
            center.y += this.points[i].y;
        }
        center.x /= this.points.length;
        center.y /= this.points.length;
        return center;
    }

    AddPoint(x, y)
    {
        this.points.push(new Vector2(x, y));
        
    }

    Move(x, y)
    {
       for (let i = 0; i < this.points.length; i++)
       {
           this.points[i].x += x;
           this.points[i].y += y;
       }
    }

    Clear()
    {
        this.points = [];
        this.splinePoints = [];
        this.terrain.Clear();
        this.terrainTop.Clear();
    }
    PointX(index)
    {
        return this.points[index].x;
    }
    PointY(index)
    {
        return this.points[index].y;
    }

    Triangulate(spline=true)
    {
        this.terrain.Clear();
        this.terrainTop.Clear();

        if (spline)
        {
            this.splinePoints = CatmullRomSplineInterpolationClean(this.points,0.05, this.radius*4);
            let count = this.splinePoints.length;
            if (count < 2) return;
            for (let i = 0; i < count; i++)
            {
                let point = this.splinePoints[i]; 
                this.terrainTop.AddPoint(point.x, point.y);
            }

            for (let i = 0; i < count; i++)
            {
                let p0 = (i==0) ? this.splinePoints[count-1] : this.splinePoints[i-1];
                let p1 = this.splinePoints[i];
                let p2 = this.splinePoints[(i+1) % count];

                let n1 = Vector2.NormalVector(p0,p1);
                let n2 = Vector2.NormalVector(p1,p2);

                let factor = 1 + (n1.x * n2.x + n1.y * n2.y);
                let normal = new Vector2((n1.x + n2.x)/factor, (n1.y + n2.y)/factor);
                let point = new Vector2(p1.x + normal.x * this.thickness, p1.y + normal.y * this.thickness);
                this.terrain.AddPoint(point.x, point.y);
            }

        } else 
        {

        

        let count = this.points.length;
        if (count < 2) return;
        for (let i = 0; i < count; i++)
        {

            let point = this.points[i]; 
            this.terrainTop.AddPoint(point.x, point.y);

        }


        for (let i = 0; i < count; i++)
        {
            let p0 = (i==0) ? this.points[count-1] : this.points[i-1];
            let p1 = this.points[i];
            let p2 = this.points[(i+1) % count];

            let n1 = Vector2.NormalVector(p0,p1);
            let n2 = Vector2.NormalVector(p1,p2);

            let factor = 1 + (n1.x * n2.x + n1.y * n2.y);
            let normal = new Vector2((n1.x + n2.x)/factor, (n1.y + n2.y)/factor);
            let point = new Vector2(p1.x + normal.x * this.thickness, p1.y + normal.y * this.thickness);
            this.terrain.AddPoint(point.x, point.y);
              

           
        }

       
        }
        

     



        this.terrain.Triangulate();
        this.terrainTop.Triangulate();
    }
    Render()
    {
     
      
        this.terrainTop.Render();
        this.terrain.Render();
      
    }
    Pop()
    {
        if (this.points.length > 0)
        {
            this.points.pop();
        }
    }

    Editor(PolyBatch )
    {
        if (Input.IsMousePressed(0) && !this.dragging)
        {
            let x = Mouse.X;
            let y = Mouse.Y;
            this.select = this.Pick(x, y);
            if (this.select != -1)
            {
                this.dragging = true;
            } else 
            {
                this.AddPoint(x, y);
            }
        }

        
        PolyBatch.SetColor(WHITE);
        for (let i = 0; i < this.points.length; i++)
        {
            PolyBatch.DrawCircleLines(this.points[i].x, this.points[i].y, this.radius);
        }
        let count = this.points.length;
        if (count < 2) return;
        for (let i = 0; i < this.points.length - 1; i++)
        {
            PolyBatch.Line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
        }
        PolyBatch.Line(this.points[count - 1].x, this.points[count - 1].y, this.points[0].x, this.points[0].y);

      

        if (Input.IsKeyPressed(Key.D))
        {
            this.Pop();
        }
       
     
       
        
        if (Input.IsMouseReleased(0))
        {
            this.dragging = false;
            this.select = -1;
        }

        if (this.dragging)
        {
            let x = Mouse.X;
            let y = Mouse.Y;
            
            this.points[this.select].x = x;
            this.points[this.select].y = y;
            
        
        }
    
        PolyBatch.SetColor(RED);
        const center = this.CalculateCenter();
        PolyBatch.DrawCircleLines(center.x, center.y, this.radius/2);
 

        if (this.select != -1)
        {
            PolyBatch.SetColor(RED);
            PolyBatch.DrawCircleLines(this.points[this.select].x, this.points[this.select].y, this.radius + 0.9);
        }

        for (let i = 0; i < this.splinePoints.length - 1; i++)
        {
            PolyBatch.Line(this.splinePoints[i].x, this.splinePoints[i].y, this.splinePoints[i + 1].x, this.splinePoints[i + 1].y);
        }
        for (let i = 0; i < this.splinePoints.length; i++)
        {
            PolyBatch.SetColor(WHITE);
            PolyBatch.DrawCircle(this.splinePoints[i].x, this.splinePoints[i].y, 6);
        }
    }

   

}

class SpriteCloud 
{
    static VBOVERTEX=2;
    static VBOCOLOR =4;
    static VBOUV    =8;
    static VBOINDEX =16;
    static  FIX_ARTIFACTS_BY_STRECHING_TEXEL = true;

    constructor()
    {

        this.colors = [];
        this.vertices = [];
        this.uvs = [];
        this.indices = [];


        this.texture = null;

        this.vertexCount  = 0;
        this.vertexIndex  = 0;

        this.invTexWidth  = 1;
        this.invTexHeight = 1;

        this.depth = 0.0;


        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;

        this.flip_x = false;
        this.flip_y = false;

        this.depth=0;
        this.flags = 0;
        this.triangles =0;
        this.Init();        
    }


    Init()
    {
        this.vertexBuffer = gl.createBuffer();
        this.colorBuffer  = gl.createBuffer();
        this.uvBuffer     = gl.createBuffer();
        this.indexBuffer  = gl.createBuffer();
        this.vertexArray  = gl.createVertexArray();

        gl.bindVertexArray(this.vertexArray);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);      
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


        gl.bindVertexArray(null);
      
    }

   

    Clear()
    {
      
        this.colors = [];
        this.vertices = [];
        this.uvs = [];
        this.indices = [];

        this.vertexCount  = 0;
        this.vertexIndex  = 0;

        this.Update();
    }
 
    SetColor (color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }


    Update()
    {
        if (this.texture === null || this.texture === undefined)  
        {
            throw new Error('[Render] The texture is not set.');
        };
      
       if (this.flags & SpriteCloud.VBOVERTEX)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.flags &= ~SpriteCloud.VBOVERTEX;
        }
        
       if (this.flags & SpriteCloud.VBOCOLOR)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.flags &= ~SpriteCloud.VBOCOLOR;
        }

       if (this.flags & SpriteCloud.VBOUV)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            this.flags &= ~SpriteCloud.VBOUV;
        }

        if (this.flags & SpriteCloud.VBOINDEX)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            this.flags &= ~SpriteCloud.VBOINDEX;
        }
        this.flags = 0;
 

    }


    Release()
    {
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.colorBuffer);
        gl.deleteBuffer(this.uvBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteVertexArray(this.vertexArray);
    }

    SetTexture(texture)
    {
        this.texture = texture;
        this.invTexWidth =  1.0 / texture.width;
        this.invTexHeight = 1.0 / texture.height;
    }

 
    ScaleVertex(factorX, factorY)
    {
        let no_verts = this.vertices.length;
        for (let i = 0; i < no_verts; i += 3)
        {
            this.vertices[i] *= factorX;
            this.vertices[i + 1] *= factorY;
        }
        this.flags |= SpriteCloud.VBOVERTEX;
    }
    ScaleTexCoords(factorX, factorY)
    {
        let no_uvs = this.uvs.length;
        for (let i = 0; i < no_uvs; i += 2)
        {
            this.uvs[i] *= factorX;
            this.uvs[i + 1] *= factorY;
        }
        this.flags |= SpriteCloud.VBOUV;
    }
   



    Render()
    {

        if (this.vertexCount === 0) return;
        this.Update();

      
        if (this.texture === null || this.texture === undefined)  
        {
            throw new Error('[Render] The texture is not set.');
        };

   
        Renderer.EnableBlend(true);
        Renderer.SetBlendMode(BlendMode.Normal);
        Renderer.SetTextureShader();
     
        this.texture.Use();
     
  

        gl.bindVertexArray(this.vertexArray);
       
        Renderer.DrawElements(gl.TRIANGLES, (this.vertexCount / 4) * 6,  0);

     //   console.log("DrawElements " + (this.vertexCount / 4));


        gl.bindVertexArray(null);
  

    }

    Transform(matrix)
    {
        if (this.vertices.length === 0) return;
        let no_verts = this.vertices.length / 3;

        let is2D = matrix instanceof Matrix2D;
 
        for (let i = 0; i < no_verts; i++)
        {
            let x = this.vertices[i * 3];
            let y = this.vertices[i * 3 + 1];
            let z = this.vertices[i * 3 + 2];

            if (is2D)
            {
                this.vertices[i * 3] = matrix.a * x + matrix.c * y + matrix.tx;
                this.vertices[i * 3 + 1] = matrix.d * y + matrix.b * x + matrix.ty;
                this.vertices[i * 3 + 2] = z;
            } else 
            {
                        console.log("TODO: 3D Transform PolySprite");
            }
        }
        this.flags |= PolySprite.VBOVERTEX;
    }

    AddQuad(x1, y1, x2, y2, x3, y3, x4, y4, u1, v1, u2, v2, u3, v3, u4, v4)
    {
        this.vertices.push(x1);        this.vertices.push(y1);        this.vertices.push(this.depth);
        this.uvs.push(u1);        this.uvs.push(v1);
        this.colors.push(this.colorr);
        this.colors.push(this.colorg);
        this.colors.push(this.colorb);
        this.colors.push(this.colora);

        this.vertices.push(x2);        this.vertices.push(y2);        this.vertices.push(this.depth);
        this.uvs.push(u2);        this.uvs.push(v2);
        this.colors.push(this.colorr);
        this.colors.push(this.colorg);
        this.colors.push(this.colorb);
        this.colors.push(this.colora);

        this.vertices.push(x3);        this.vertices.push(y3);        this.vertices.push(this.depth);
        this.uvs.push(u3);        this.uvs.push(v3);
        this.colors.push(this.colorr);
        this.colors.push(this.colorg);
        this.colors.push(this.colorb);
        this.colors.push(this.colora);

        this.vertices.push(x4);        this.vertices.push(y4);        this.vertices.push(this.depth);
        this.uvs.push(u4);        this.uvs.push(v4);
        this.colors.push(this.colorr);
        this.colors.push(this.colorg);
        this.colors.push(this.colorb);
        this.colors.push(this.colora);



        //add indices
        let index = this.vertexCount ;
        this.indices.push(index);
        this.indices.push(index + 1);
        this.indices.push(index + 2);
        this.indices.push(index);
        this.indices.push(index + 2);
        this.indices.push(index + 3);


        this.vertexCount += 4;
        this.indexCount += 6;

        this.flags |= SpriteCloud.VBOVERTEX | SpriteCloud.VBOCOLOR | SpriteCloud.VBOUV ;
        
        this.flags |= SpriteCloud.VBOINDEX;

    }
    SetFlip(flipX, flipY)
    {
        this.flip_x = flipX;
        this.flip_y = flipY;
    }
    FlipX(v)
    {
        this.flip_x = v;
    }

    FlipY(v)
    {
        this.flip_y = v;
    }

    Add( x, y, width, height)
    {
     
          
        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
    

        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }
       

      

        let fx2 = x + width;
        let fy2 = y + height;

        this.AddQuad(x, y, 
                     x, fy2, 
                     fx2, fy2, 
                     fx2, y, 
                     left, top, 
                     left, bottom, 
                     right, bottom, 
                     right, top);



    }
    AddTiled( x, y, width, height, src_x, src_y, src_width, src_height)
    {
        let left = 0;
        let right = 1;
        let top = 0;
        let bottom = 1;
        let widthTex = this.texture.width;
        let heightTex = this.texture.height;

        if (SpriteCloud.FIX_ARTIFACTS_BY_STRECHING_TEXEL)
        {
            left = (2*src_x+1) / (2*widthTex);
            right =  left +(src_width*2-2) / (2*widthTex);
            top = (2*src_y+1) / (2*heightTex);
            bottom = top +(src_height * 2 - 2) / (2 * heightTex);
        }else
        {
            left = src_x / widthTex;
            right =  (src_x + src_width) / widthTex;
            top = src_y / heightTex;
            bottom = (src_y + src_height) / heightTex;
        }			
       
        if (this.flip_x)
        {
            let tmp = left;
            left = right;
            right = tmp;
        }

        if (this.flip_y)
        {
            let tmp = top;
            top = bottom;
            bottom = tmp;
        }

        let fx2 = x + width;
        let fy2 = y + height;

        this.AddQuad(x, y, 
                     x, fy2, 
                     fx2, fy2, 
                     fx2, y, 
                     left, top, 
                     left, bottom, 
                     right, bottom, 
                     right, top);

    


    }

  
}


class TileLayer 
{
    imageWidth = 0;
    imageHeight = 0;
    depth = 0;
    numRows = 1;
    numCols = 1;
    numTiles =0xffffff;


    constructor(width, height, tileWidth, tileHeight)
    {
        this.tiles = [];
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = width;
        this.height = height;
        this.texture =  Renderer.defaultTexture;
       
   


    }

    LoadTiles(data)
    {
        let lines = data.split('\n');
        this.tiles=[];
        for (let y = 0; y < this.height; y++)
        {
            let tokens = lines[y].split(',');
            for (let x = 0; x < this.width; x++)
            {
                this.tiles[y * this.width + x] = parseInt(tokens[x]);
            }
        }
    }

    Fill(tile)
    {
        for (let y = 0; y < this.height; y++)
        {
            for (let x = 0; x < this.width; x++)
            {
                this.SetTile(x, y, tile);
            }
        }
    }
    FillRandom(min, max)
    {
        for (let y = 0; y < this.height; y++)
        {
            for (let x = 0; x < this.width; x++)
            {
                this.SetTile(x, y, RandomInt(min, max));
            }
        }
    }

    SetTile(x, y, tile)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.tiles[y * this.width + x] = tile;
    }

    GetTile(x, y)
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
        return this.tiles[y * this.width + x];
    }

    GetTileSourceRect(id)
    {
        if (!this.texture) 
        {
            console.error("Texture not set. Please call SetTexture(texture) first.");
            return;
        }
        this.imageWidth  = this.texture.width;
        this.imageHeight = this.texture.height;

        let cols  = Math.floor( this.imageWidth/this.tileWidth);
        let clip_x =( id  %  cols) *  this.tileWidth;
        let clip_y = Math.floor(id  / cols) * this.tileHeight ;

         //    console.log("numCols: " + this.numCols + " numRows: " + this.numRows + " numTiles: " + this.numTiles + " imageWidth: " + this.imageWidth + " imageHeight: " + this.imageHeight);



      //  console.log("numCols: " + cols + " imageWidth: " + this.imageWidth + " imageHeight: " + this.imageHeight);

        return {x: clip_x, y: clip_y};
    }
    SetTexture(texture)
    {
        this.texture = texture;
        this.imageWidth  = this.texture.width;
        this.imageHeight = this.texture.height;
        
        this.numCols =Math.floor(this.imageWidth  / this.tileWidth);
        this.numRows =Math.floor(this.imageHeight / this.tileHeight);
        this.numTiles = this.numRows * this.numCols;
   
      //  console.log("numCols: " + this.numCols + " numRows: " + this.numRows + " numTiles: " + this.numTiles + " imageWidth: " + this.imageWidth + " imageHeight: " + this.imageHeight);


    }



   

}


class CharacterInfo 
{
    constructor() 
    {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.char=0;

    }
}



class Font 
{
    constructor()
    {
    
        this.mCharInfo=[];
        this.isReady = false;
        this.buffersOk = false;
        this.texture = null;
        this.depth= 1.0;
        this.maxWidth = 1;
        this.maxHeight = 1;        
        this.size =16;
        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
        this.allign = "left";
    }

    Release()
    {
        this.texture.Release();
    }


    processData(data)
    {
        try 
        {
            let lines = data.split('\n');
            for (let i = 0; i < lines.length; i++)
            {
                let line = lines[i];
                let charInfo = new CharacterInfo();
                let tokens = line.split(',');
                charInfo.char = tokens[0].split('=')[1];
                charInfo.x = parseInt(tokens[1]);
                charInfo.y = parseInt(tokens[2]);
                charInfo.width = parseInt(tokens[3]);
                charInfo.height= parseInt(tokens[4]);

                if (charInfo.width > this.maxWidth) this.maxWidth = charInfo.width;
                if (charInfo.height > this.maxHeight) this.maxHeight = charInfo.height;

                charInfo.offsetX= parseInt(tokens[5]);
                charInfo.offsetY= parseInt(tokens[6]);
                this.mCharInfo.push(charInfo);
               // console.log("Char: " + charInfo.char + " x: " + charInfo.x + " y: " + charInfo.y + " w: " + charInfo.width + " h: " + charInfo.height + " ox: " + charInfo.offsetX + " oy: " + charInfo.offsetY);
            }

        
           
        } 
        catch (e) 
        {
            this.isReady = false;
            console.log("Fail process font data"+e);
            return;
        }
        
        this.isReady = true;
    }

    async Create(textureData, data)
    {
        return new Promise((resolve) => 
        {
            console.log("Processando fonte");
            this.processData(atob(data));
            let image = new Image();
            this.texture = new Texture2D();
            this.texture.name = "fontDefault";
                     
            image.onload = () => 
            {
                this.texture.Load(image);
                resolve();
            };
            image.src = textureData;
        });        


    }

    async Load(filename, imageName)
     {
        this.filename = filename;
        this.textureName = imageName;

        try 
        {
            const data = await Assets.LoadFile(this.filename);
            this.processData(data);
            this.texture = Game.GetTexture(this.textureName);
        } catch (error) 
        {
            console.error('Erro ao carregar o arquivo:', error);
        }
    }


    Render()
    {
        if (!this.isReady || this.vertexCount === 0 ) return;
        this.SpriteBatch.Render(); 
     }

    SetColor4f(r, g, b, a)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
        this.colora = a;
    }
    SetColor3f(r, g, b)
    {
        this.colorr = r;
        this.colorg = g;
        this.colorb = b;
    }

    SetColor(color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }
    SetSize(size)
    {
        this.size = size;
    }
   
    SetAllignment(allign)
    {
        this.allign = allign;
    }
    
    GetMaxHeight()  
    {
        return this.maxHeight;
    }

    GetMaxWidth()
    {
        return this.maxWidth;
    }


    GetTextWidth(text)
    {
        let length = text.length;
        let scale = this.size / this.maxWidth * 0.5;
        let offsetX = 0;
        for (let i = 0; i < length; i++)
        {
            let c = text.charCodeAt(i);
 
            let charInfo = this.mCharInfo[c - 32];
            if (charInfo === undefined) continue;
            let clip_w = charInfo.width;
            let off_x = charInfo.offsetX;
    
            offsetX +=  clip_w * scale;
        }
        return offsetX;

    }

    Print(batch, x, y, text)
    {
       

        let scale = this.size / this.maxWidth * 0.5;
        let offsetX = x;
        let offsetY = y ;
        let moveY =  (this.maxHeight * 0.5) * scale;
        let length = text.length;
        batch.SetColor4f(this.colorr, this.colorg, this.colorb, this.colora);

        if (this.allign === "center")
        {
            offsetX -=  (this.GetTextWidth(text) / 2);
        }
        else if (this.allign === "left")
        {
            offsetX = x;
        }
        else if (this.allign === "right")
        {
            offsetX -= this.GetTextWidth(text);
        }


        for (let i = 0; i < length; i++)
        {
            let c = text.charCodeAt(i);
            if (c === 10)
            {
                offsetY -= this.maxHeight * scale;
                offsetX = x;
                continue;
            }
            let charInfo = this.mCharInfo[c - 32];
            if (charInfo === undefined) continue;
            let clip_x = charInfo.x;
            let clip_y = charInfo.y;
            let clip_w = charInfo.width;
            let clip_h = charInfo.height;
            let off_x = charInfo.offsetX;
            let off_y = charInfo.offsetY + moveY;
          
            batch.DrawClip(this.texture,  
                 offsetX + off_x  * scale, 
                 offsetY + off_y  * scale, 
                clip_w * scale, clip_h * scale, 
                clip_x, clip_y, clip_w, clip_h);

              offsetX += clip_w * scale;
         
        }

    }


}

