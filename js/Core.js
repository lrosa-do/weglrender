
"use strict";


const BlendMode =
{
    Normal: 0,
    Additive: 1,
    Multiply: 2,
    One : 3,
};


class ScreenQuad
{
    constructor()
    {
        this.VBO = null;
        this.VAO = null;
        this.Init();
    }
    Init()
    {
        this.VBO = gl.createBuffer();
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        const vertices = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0,
        ]);
  
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

    }
    Render(name="screen")
    {
         Core.SetFilter(name);
        
        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindVertexArray(null);
    }
    Release()
    {
        gl.deleteBuffer(this.VBO);
        gl.deleteVertexArray(this.VAO);
    }
}




class Core 
{
    static Init(width, height)
    {
        console.log("Render.Init");
        this.width = width;
        this.height = height;
        this.viewMatrix = new Mat4();
        this.projectionMatrix = new Mat4();  
        this.worldMatrix = new Mat4();
        this.solidShader = null;
        this.solidShader   = CreateSolidShader();
        this.textureShader = CreateTextureShader();
        this.deltaTime = 0;
        this.elapsedTime = 0;
        this.clearColor = new Color(0, 0, 0, 1);

            this.shaders = {};
            this.filters = {};
            this.shaders["solid"] = this.solidShader;
            this.shaders["texture"] = this.textureShader;
            this.filters["normal"] = CreateScreenShader();
            // this.filters["gray"] = CreateGrayScale();
            // this.filters["pixelizer"] = CreatePixelizer();
            // this.filters["crosshatching"] = CreateCrossHatching();
            // this.filters["crossstitching"] = CreateCrossStitching();
            // this.filters["pretator"] = CreatePretator();
            // this.filters["scanlines"] = CreateScanlines();
            // this.filters["fisheye"] = CreateFisheye();
            // this.filters["sobel"] = CreateSobel();
            // this.filters["bloom"] = CreateBloom();
            //this.filters["blur"] = CreateBlur();
            //this.filters["dreamvision"] = CreatDreamtVision();
            //  this.filters["posterization"] = CreatePosterization();
            //
            this.filters["toon"] = CreateToon();



      //todo

        // this.filters["motionblur"] = CreateMotionBlur();
        // this.filters["radialblur"] = CreateRadialBlur();


        // this.filters["edge"] = CreateEdge();
        // this.filters["emboss"] = CreateEmboss();
        // this.filters["gaussian"] = CreateGaussian();
        // this.filters["sharpen"] = CreateSharpen();

        // this.filters["vignette"] = CreateVignette();
        // this.filters["wobble"] = CreateWobble();
        // 
        // this.filters["noise"] = CreateNoise();
        // this.filters["ripple"] = CreateRipple();
        // this.filters["swirl"] = CreateSwirl();
        // this.filters["bulge"] = CreateBulge();
        // this.filters["tint"] = CreateTint();
        // this.filters["nightvision"] = CreateNightVision();
        // this.filters["thermal"] = CreateThermal();
        // this.filters["depth"] = CreateDepth();

        // this.filters["shockwave"] = CreateShockWave();
        // this.filters["twist"] = CreateTwist();
        // this.filters["zoomblur"] = CreateZoomBlur();
        // this.filters["color"] = CreateColor();
        // this.filters["contrast"] = CreateContrast();
        // this.filters["exposure"] = CreateExposure();
        // this.filters["hue"] = CreateHue();
        // this.filters["saturation"] = CreateSaturation();
        // this.filters["brightness"] = CreateBrightness();
        // this.filters["gamma"] = CreateGamma();
        // this.filters["levels"] = CreateLevels();
        // this.filters["vibrance"] = CreateVibrance();
        // this.filters["sepia"] = CreateSepia();
        // this.filters["invert"] = CreateInvert();
        // this.filters["kaleidoscope"] = CreateKaleidoscope();
        // this.filters["mirror"] = CreateMirror();
        // this.filters["tunnel"] = CreateTunnel();
        // this.filters["swirl"] = CreateSwirl();
        // this.filters["bulge"] = CreateBulge();
        // this.filters["pinch"] = CreatePinch();
        // this.filters["wobble"] = CreateWobble();


        this.currenProgram = null;
        this.currentTexture = null;
        this.enableBlend = false;
        this.enableDepthTest = false;
        this.enableCullFace = false;
        this.enableScissor = false;
        this.blendMode = -1;
        this.numVertex = 0;
        this.numDrawCalls = 0;
        this.numTriangles = 0;
        this.numTextures=0;
        this.numPrograms=0;
        this.defaultTexture =  new Texture2D();
        this.defaultTexture.Create(1, 1, 4, new Uint8Array([255, 255, 255, 255]));
        this.viewPort= new Rectangle(0, 0, width, height);

       
        this.defaultFont= new Font();   
        this.defaultFont.Create(defaultFontImage, defaultFontData);
     

    }
    static DefaultFont()
    {
        return this.defaultFont;
    }
    static ResetStats()
    {
        this.numVertex = 0;
        this.numDrawCalls = 0;
        this.numTriangles = 0;
        this.numTextures=0;
        this.numPrograms=0;
        Gui.SetCursor("default");
    }
    static TraceGl()
     {
        var error = gl.getError();
        if (error !== gl.NO_ERROR) {
            console.error("Erro WebGL: " + error);
        }
     }

    static GetShader(name)
    {
        return this.shaders[name];
    }

    static SetShader(name)
    {
        let shader = this.shaders[name];
        if(shader != null)
        {
            shader.Use();
            if (shader.ContainsUniform("uProjection"))
            {
                shader.SetUniformMatrix4fv("uProjection", this.projectionMatrix.m);
            }
            if (shader.ContainsUniform("uView"))
            {
                shader.SetUniformMatrix4fv("uView", this.viewMatrix.m);
            }
            if (shader.ContainsUniform("uWorld"))
            {
                shader.SetUniformMatrix4fv("uWorld", this.worldMatrix.m);
            }
            if (shader.ContainsUniform("uTexture"))
            {
                shader.SetUniform1i("uTexture", 0);
            }

        }
    }

    static SetFilter(name)
    {
        let filter = this.filters[name];
        if(filter != null)
        {
            filter.Use();
            if (filter.ContainsUniform("uTexture"))
            {
                filter.SetUniform1i("uTexture", 0);
            }
            if (filter.ContainsUniform("renderWidth"))
            {
                filter.SetUniform1f("renderWidth", this.width);
            }
            if (filter.ContainsUniform("renderHeight"))
            {
                filter.SetUniform1f("renderHeight", this.height);
            }
            if (filter.ContainsUniform("uTime"))
            {
                filter.SetUniform1f("uTime", Core.deltaTime);
            }
         //   console.log("Filter: " + name + " " + this.width + " " + this.height);

        }
    }

    static DrawElements(mode, vertexCount,  offset)
    {
        gl.drawElements(mode, vertexCount, gl.UNSIGNED_SHORT, offset);
        this.numDrawCalls++;
        this.numTriangles += vertexCount / 3;
        this.numVertex += vertexCount;
    }

    static DrawArrays(mode, first, count)
    {
        gl.drawArrays(mode, first, count);
        this.numDrawCalls++;
        this.numTriangles += count / 3;
        this.numVertex += count;
    }

    static SetClearColor(r, g, b)
    {
        this.clearColor.Set(r, g, b, 1);
        gl.clearColor(r, g, b, 1);
    }

    static EnableScissor(enable)
    {
      //  if(this.enableScissor != enable)
        {
            if(enable)
            {
                gl.enable(gl.SCISSOR_TEST);
            }
            else
            {
                gl.disable(gl.SCISSOR_TEST);
            }
            this.enableScissor = enable;
        }
    }

    static EnableBlend(enable)
    {
        if(this.enableBlend != enable)
        {
            if(enable)
            {
                gl.enable(gl.BLEND);
            }
            else
            {
                gl.disable(gl.BLEND);
            }
            this.enableBlend = enable;
        }
    }

    static EnableDepthTest(enable)
    {
        if(this.enableDepthTest != enable)
        {
            if(enable)
            {
                gl.enable(gl.DEPTH_TEST);
            }
            else
            {
                gl.disable(gl.DEPTH_TEST);
            }
            this.enableDepthTest = enable;
        }
    }

    static EnableCullFace(enable)
    {
        if(this.enableCullFace != enable)
        {
            if(enable)
            {
                gl.enable(gl.CULL_FACE);
            }
            else
            {
                gl.disable(gl.CULL_FACE);
            }
            this.enableCullFace = enable;
        }
    }



    static SetTexture(texture)
    {
        if(this.currentTexture != texture)
        {
            if(texture == null)
            {
                gl.bindTexture(gl.TEXTURE_2D, null);
                this.currentTexture = null;
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            this.numTextures++;
            this.currentTexture = texture;
        }
    }

    static SetBlendMode(blendMode)
    {
        if (!this.isBlendEnabled)
        {

            if (this.blendMode !== blendMode)
            {
                switch (blendMode)
                {
                    case BlendMode.Normal:
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                        break;
                    case BlendMode.Additive:
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                        break;
                    case BlendMode.Multiply:
                        gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                        break;
                    case BlendMode.One:
                        gl.blendFunc(gl.ONE, gl.ONE);
                        break;
                }
                this.blendMode = blendMode;
            }
        }
    }

    static SetProgram(program)
    {
        if(this.currentProgram != program)
        {
            if (program == null)
            {
                gl.useProgram(null);
                this.currentProgram = null;
                return;
            }
            gl.useProgram(program);
            this.numPrograms++;
            this.currentProgram = program;
        }
    }

    static Clear()
    {
      //  gl.clearColor(r,g,b, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    static SetViewPort(x, y, width, height)
    {
        gl.viewport(x, y, width, height);
        this.viewPort.set(x, y, width, height);
    }

    static SetViewPortRect(rect)
    {
        gl.viewport(rect.x, rect.y, rect.width, rect.height);
        this.viewPort.set(rect.x, rect.y, rect.width, rect.height);
    }

    static GetViewPort()
    {
        return this.viewPort;
    }
    static GetWidth()
    {
        return this.width;
    }

    static GetHeight()
    {
        return this.height;
    }

    static SetScissor(x, y, width, height)
    {
       
        gl.scissor(x, this.height - (y + height), width, height);};


    static SetViewMatrix(matrix)
    {
        this.viewMatrix = matrix;
    }
    static SetProjectionMatrix(matrix)
    {
        this.projectionMatrix = matrix;
    }

    static SetWorldMatrix(matrix)
    {
        this.worldMatrix = matrix;
    }

    static SetWorldMatrixArray(matrix)
    {
        this.worldMatrix.m[0] = matrix[0];
        this.worldMatrix.m[1] = matrix[1];
        this.worldMatrix.m[2] = matrix[2];
        this.worldMatrix.m[3] = matrix[3];
        this.worldMatrix.m[4] = matrix[4];
        this.worldMatrix.m[5] = matrix[5];
        this.worldMatrix.m[6] = matrix[6]; 
        this.worldMatrix.m[7] = matrix[7];
        this.worldMatrix.m[8] = matrix[8];
        this.worldMatrix.m[9] = matrix[9];
        this.worldMatrix.m[10] = matrix[10];
        this.worldMatrix.m[11] = matrix[11];
        this.worldMatrix.m[12] = matrix[12];
        this.worldMatrix.m[13] = matrix[13];
        this.worldMatrix.m[14] = matrix[14];
        this.worldMatrix.m[15] = matrix[15];
    }

    static SetProjectionMatrixArray(matrix)  
    {
        Core.projectionMatrix.m[0] = matrix[0];
        Core.projectionMatrix.m[1] = matrix[1];
        Core.projectionMatrix.m[2] = matrix[2];
        Core.projectionMatrix.m[3] = matrix[3];
        Core.projectionMatrix.m[4] = matrix[4];
        Core.projectionMatrix.m[5] = matrix[5];
        Core.projectionMatrix.m[6] = matrix[6]; 
        Core.projectionMatrix.m[7] = matrix[7];
        Core.projectionMatrix.m[8] = matrix[8];
        Core.projectionMatrix.m[9] = matrix[9];
        Core.projectionMatrix.m[10] = matrix[10];
        Core.projectionMatrix.m[11] = matrix[11];
        Core.projectionMatrix.m[12] = matrix[12];
        Core.projectionMatrix.m[13] = matrix[13];
        Core.projectionMatrix.m[14] = matrix[14];
        Core.projectionMatrix.m[15] = matrix[15];
    }
    static SetViewMatrixArray(matrix)
    {
        Core.viewMatrix.m[0] = matrix[0];
        Core.viewMatrix.m[1] = matrix[1];
        Core.viewMatrix.m[2] = matrix[2];
        Core.viewMatrix.m[3] = matrix[3];
        Core.viewMatrix.m[4] = matrix[4];
        Core.viewMatrix.m[5] = matrix[5];
        Core.viewMatrix.m[6] = matrix[6]; 
        Core.viewMatrix.m[7] = matrix[7];
        Core.viewMatrix.m[8] = matrix[8];
        Core.viewMatrix.m[9] = matrix[9];
        Core.viewMatrix.m[10] = matrix[10];
        Core.viewMatrix.m[11] = matrix[11];
        Core.viewMatrix.m[12] = matrix[12];
        Core.viewMatrix.m[13] = matrix[13];
        Core.viewMatrix.m[14] = matrix[14];
        Core.viewMatrix.m[15] = matrix[15];

    }


    static SetOrthoProjection(left, right, bottom, top, near, far)
    {
        this.projectionMatrix.ortho(left, right, bottom, top, near, far);
    }

    static SetSolidRender()
    {
        this.solidShader.Use();
        this.solidShader.SetUniformMatrix4fv("uProjection", this.projectionMatrix.m);
        this.solidShader.SetUniformMatrix4fv("uView", this.viewMatrix.m);

    }
    static SetWhiteTexture()
    {
        this.defaultTexture.Use();
    }

    static SetTextureShader()
    {
        this.textureShader.Use();
        this.textureShader.SetUniformMatrix4fv("uProjection", this.projectionMatrix.m);
        this.textureShader.SetUniformMatrix4fv("uView", this.viewMatrix.m);
        this.textureShader.SetUniform1i("uTexture", 0);

    }
    static SetScreenShader()
    {
        this.screenShader.Use();
        this.screenShader.SetUniform1i("uTexture", 0);
    }
    static Resize(width, height)
    {
        this.width = width;
        this.height = height;
    }
}



class ImediateRenderer 
{

    static Init()
    {
        let counts = 500 ;
        this.vertices = new Float32Array(counts *3);
        this.indices  = new Uint16Array(counts  *4 *6);
        this.uv       = new Float32Array(counts *2);
        this.colors   = new Float32Array(counts *4);

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



        
        this.depth = 0.0;


        this.colorr=1.0;
        this.colorg=1.0;
        this.colorb=1.0;
        this.colora=1.0;
      
    }
    static Release ()
    {
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.colorBuffer);
        gl.deleteBuffer(this.uvBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteVertexArray(this.vertexArray);
    }
    static SetColor (color)
    {
        this.colorr = color.r;
        this.colorg = color.g;
        this.colorb = color.b;
        this.colora = color.a;
    }

    static SetDepth (depth)
    {
        this.depth = depth;
    }

    static DrawRectangle(x, y, width, height)
    {
        let x0 = x;
        let y0 = y;
        let x1 = x + width;
        let y1 = y + height;

        let indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
        let vertices = new Float32Array([x0, y0, this.depth, x1, y0, this.depth, x1, y1, this.depth, x0, y1, this.depth]);
        let uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        let colors = new Float32Array( [this.colorr, this.colorg, this.colorb, this.colora,this.colorr, this.colorg, this.colorb, this.colora,this.colorr, this.colorg, this.colorb, this.colora,this.colorr, this.colorg, this.colorb, this.colora]);

        Core.SetTextureShader();
 
     


        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


        gl.bindVertexArray(this.vertexArray);

        
        Core.DrawElements(gl.TRIANGLES, 6, 0);

        gl.bindVertexArray(null);

    }
    static DrawRectangleLines(x, y, width, height)
    {
        let x0 = x;
        let y0 = y;
        let x1 = x + width;
        let y1 = y + height;

        let indices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0]);
        let vertices = new Float32Array([x0, y0, this.depth, x1, y0, this.depth, x1, y1, this.depth, x0, y1, this.depth]);
        let uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        let colors = new Float32Array( [this.colorr, this.colorg, this.colorb, this.colora,this.colorr, this.colorg, this.colorb, this.colora,this.colorr, this.colorg, this.colorb, this.colora,this.colorr, this.colorg, this.colorb, this.colora]);

        Core.SetTextureShader();
        Core.SetWhiteTexture();
       


        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


        gl.bindVertexArray(this.vertexArray);

        
        Core.DrawElements(gl.LINES, 8, 0);

        gl.bindVertexArray(null);

    }
   

}


class IndexBuffer 
{
    constructor(data,dynamic=false)
    {
        this.buffer = gl.createBuffer();
        this.count = data.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data),  dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);

    }
    Release()
    {
        gl.deleteBuffer(this.buffer);
    }
    Use()
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        this.isUsed = true;
    }

    UpdateData(data,offset=0)
    {
   
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, new Uint16Array(data));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
    }
}




const POSIION2D = 0;
const POSIION3D = 1;
const COLOR3    = 2;
const COLOR4    = 3;
const TEXTURE   = 4;
const TEXTURE1  = 5;
const TEXTURE2  = 6;
const TEXTURE3  = 7;



class VertexBuffer
{
    constructor(data, itemSize, attributes, dynamic=false)
    {
        this.buffer = gl.createBuffer();
        this.itemSize = itemSize;
        this.numItems = data.length / itemSize;
        this.isUsed = true;
        
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
        this.attributes = attributes;
        this.Config();

    
      
    }
    Release()
    {
        gl.deleteBuffer(this.buffer);
    }
    Config()
    {
        let offset = 0;

        for (let index in this.attributes)
        {
                let attribute = this.attributes[index];
               
                gl.enableVertexAttribArray(index);
                if (attribute === POSIION2D)
                {
                gl.vertexAttribPointer(index, 2, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 2;
                }  else 
                if (attribute === POSIION3D)
                {
                gl.vertexAttribPointer(index, 3, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 3;
                } else
                if (attribute === COLOR3)
                {
                gl.vertexAttribPointer(index, 3, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 3;
                } else
                if (attribute === COLOR4)
                {
                gl.vertexAttribPointer(index, 4, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 4;
                } else
                if (attribute === TEXTURE)
                {
                gl.vertexAttribPointer(index, 2, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 2;
                } else
                if (attribute === TEXTURE1)
                {
                gl.vertexAttribPointer(index, 2, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 2;
                } else
                if (attribute === TEXTURE2)
                {
                gl.vertexAttribPointer(index, 2, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 2;
                } else
                if (attribute === TEXTURE3)
                {
                gl.vertexAttribPointer(index, 2, gl.FLOAT, false, this.itemSize, offset * 4);
                offset += 2;
                }

           
            
        }

        // gl.enableVertexAttribArray(0);
        // gl.vertexAttribPointer(0, 3, gl.FLOAT, false, this.itemSize, offset * 4);
        // offset += 3;

        // gl.enableVertexAttribArray(1);
        // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, this.itemSize,  offset * 4);
        
        // offset += 2;

        // gl.enableVertexAttribArray(2);
        // gl.vertexAttribPointer(2, 4, gl.FLOAT, false, this.itemSize,  offset * 4);

        // offset += 4;


       
    }
    UpdateData(data,offset=0)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }
    Use()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
    Remove()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    }
}

class VertexArray
{
    constructor()
    {
        this.vertexArray = gl.createVertexArray();
    }
    Release()
    {
        gl.deleteVertexArray(this.vertexArray);
    }
    Begin()
    {
        gl.bindVertexArray(this.vertexArray);
    }
    End()
    {
        gl.bindVertexArray(null);
    }
}