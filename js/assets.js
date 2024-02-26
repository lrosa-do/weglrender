"use strict";

class Texture
{
    constructor()
    {
        this.id = null;
        this.width = 0;
        this.height = 0;
        this.channels = 0;
        this.name = "";
    }
    Use()
    {
      //  gl.bindTexture(gl.TEXTURE_2D, this.id);
      Renderer.SetTexture(this.id);
    }
    Unbind()
    {
        Renderer.SetTexture(null);
       // gl.bindTexture(gl.TEXTURE_2D, null);
    }
    Release()
    {
        gl.deleteTexture(this.id);
    }
}

class Texture2D extends Texture
{
    constructor()
    {
        super();
      
    }
    Depth(width, height)
    {
        this.width = width;
        this.height = height;
        this.channels = 1;

        this.id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.id);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    }
    Blank(width, height, channels=4)
    {
        this.width = width;
        this.height = height;
        this.channels = channels;
        let format = 0;
        if (channels === 4)
        {
            format = gl.RGBA;
        } else if (channels === 3)
        {
            format = gl.RGB;
        } else if (channels === 2)
        {
            format = gl.RG;
        } else 
        {
            format = gl.RED;
        }
        this.id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);

    }

    Create(width, height, channels, data)
    {
        this.width = width;
        this.height = height;
        this.channels = channels;

        let format = 0;
        if (channels === 4)
        {
            format = gl.RGBA;
        } else if (channels === 3)
        {
            format = gl.RGB;
        } else if (channels === 2)
        {
            format = gl.RG;
        } else 
        {
            format = gl.RED;
        }
        this.id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.id);
      //  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      //  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    Load(image)
    {
        try 
        {
            if (image.width === 0 || image.height === 0 || image.data === null) 
            {
                console.log("Invalid image");
                return false;
            }  
          
            this.id = gl.createTexture();
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

            gl.bindTexture(gl.TEXTURE_2D, this.id);
     
 
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            this.width = image.width;
            this.height = image.height;
            this.format = gl.RGBA;
            console.log( `Textura carregada com sucesso: ${this.width}x${this.height}`);

            return true;
        } 
        catch (e)
        {
            console.log(e);
        }
        return false;
    }
}


class RenderTexture extends Texture
{
    constructor()
    {
        super();
        this.frameBuffer = null;
        this.saveViewport = new Rectangle(0,0,1,1);
        this.width = 0;
        this.height = 0;
    }
    Create(width, height)
    {
        this.width = width;
        this.height = height;
        this.id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        Renderer.TraceGl();
    }
    Begin()
    {
        this.saveViewport= Renderer.GetViewPort();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        Renderer.SetViewPort(0, 0, this.width, this.height);
        gl.clearColor(0, 0, 0, 1);   
        gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

    }
    End()
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        Renderer.SetViewPort(this.saveViewport.x, this.saveViewport.y, this.saveViewport.width, this.saveViewport.height);
    }
    Release()
    {
        gl.deleteFramebuffer(this.frameBuffer);
        gl.deleteTexture(this.id);
    }


}

class FrameBuffer
{
    constructor()
    {
        this.id = null;
        this.textureColor = new Texture2D();
        this.textureDepth = new Texture2D();

        this.width = 0;
        this.height = 0;
    }
    Create(width, height)
    {
        this.width = width;
        this.height = height;


        this.id = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
        

        this.textureColor.Blank(width, height, 4);


        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureColor.id, 0);




        this.textureDepth.Depth(width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.textureDepth.id);
        



        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    }
    Use()
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
    }
    Unbind()
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    Release()
    {
        gl.deleteFramebuffer(this.id);
        this.textureColor.Release();
        this.textureDepth.Release();

    }

}


class Assets
{
    static imagesToLoad = [];
    static audioToLoad = [];
    static texturesToLoad = [];

    static images = {};
    static textures = {};
    static audio = {};

    static progress = 0;
    static total = 0;
    static DefaultDelay = 1000;

    static Init()
    {
        console.log("Init");
        this.OnProgress = function(filename, progress,  total){}
        this.OnComplete = function(){}
        this.OnLoad= function(filename){}
    }

    static Ready()
    {
        return this.progress === this.total;
    }


    static ClearImages()
    {
        this.images = {};
    }
    static ClearTexture()
    {
        for (let key in this.textures)
        {
            this.textures[key].Release();
        }
        this.textures = {};
    }
    static ClearAudio()
    {
        this.audio = {};
    }
    static  Clear()
    {
        this.audioToLoad = [];
        this.imagesToLoad = [];
        this.texturesToLoad = [];
        this.ClearImages();
        this.ClearTexture();
        this.ClearAudio();
    }




    static Progress(filename, progress, total)
    {
       // console.log("Progresso: " + this.progress + "/" + this.total);
        this.OnProgress(filename, progress, total);
    }
    static Delay(delayTime)
     {
        return new Promise((resolve) => 
        {
            setTimeout(() => 
            {
                console.log("Delay: " + delayTime);
                resolve();
            }, delayTime);
        });
    
    }

    static async LoadAudio(name, src)
    {
        await Assets.Delay(Assets.DefaultDelay);
        return new Promise((resolve) => 
        {

        

            // resolve();
            // Assets.progress++;
            // Assets.Progress(src, Assets.progress, Assets.total);
        
            const audio = new Audio();
            audio.oncanplaythrough = () => 
            {
                Assets.progress++;
                Assets.Progress(src, Assets.progress, Assets.total);
                this.audio[name] = audio;
                this.OnLoad(src);
                resolve();
            };
            audio.src = src;
        });
    } 
    
    static async LoadTexture(name, src)
    {
       // await Assets.Delay(Assets.DefaultDelay);
        return new Promise((resolve) => 
        {
                    

            const image = new Image();
            image.onload = () => 
            {
                const texture = new Texture2D();
                if (texture.Load(image)) 
                {
                    texture.name = name;
                    this.textures[name] = texture;
                    Assets.progress++;
                    Assets.Progress(src, Assets.progress, Assets.total);
                    this.OnLoad(src);
                    resolve();
                } 
                else 
                {
                    console.error('Erro ao carregar a textura:', src);
                    reject();
                }
            };
           image.src = src;
        });
    }


    static async LoadImage(name, src) 
    {
        await Assets.Delay(Assets.DefaultDelay);
        return new Promise((resolve) => 
        {
           

            //             Assets.progress++;
            //      Assets.Progress(src, Assets.progress, Assets.total);

            
            // resolve();
           
         
            const image = new Image();
            image.onload = () => 
            {
                this.images[name] = image;
                Assets.progress++;
                Assets.Progress(src, Assets.progress, Assets.total);
                this.OnLoad(src);
   
                resolve();
            };
            image.src = src;
        });
    }

    static async LoadFile(filename) 
    {
        return new Promise((resolve, reject) => 
        {
            fetch(filename)
                .then(response => 
                    {
                    if (!response.ok)
                    {
                        throw new Error('Erro ao carregar o arquivo');
                    }
                    this.OnLoad(filename);
                    return response.text();
                })
                .then(data =>
                    {
                    resolve(data);
                })
                .catch(error => 
                    {
                    console.error('Erro ao carregar o arquivo:', error);
                    reject(error);
                });
        });
    }

    static AddTexture(name, filename)
    {
        this.texturesToLoad.push({name: name, src: filename});
    }

    static AddImage(name, filename)
    {
        this.imagesToLoad.push({name: name, src: filename});
    }

    static AddAudio(name, filename)
    {
        this.audioToLoad.push({name: name, src: filename});
    }

    static async LoadAll()
    {
        this.total = this.imagesToLoad.length + this.audioToLoad.length + this.texturesToLoad.length;
        this.progress = 0;
        for (let i = 0; i < this.imagesToLoad.length; i++)
        {
            await this.LoadImage(this.imagesToLoad[i].name, this.imagesToLoad[i].src);
        }
        for (let i = 0; i < this.audioToLoad.length; i++)
        {
            await this.LoadAudio(this.audioToLoad[i].name, this.audioToLoad[i].src);
        }
        for (let i = 0; i < this.texturesToLoad.length; i++)
        {

           await this.LoadTexture(this.texturesToLoad[i].name, this.texturesToLoad[i].src);
        }
        this.audioToLoad = [];
        this.imagesToLoad = [];
        this.texturesToLoad = [];
        this.OnComplete();

    }


    static SaveBinaryFile(filename, arrayBuffer)
    {
        let blob = new Blob([arrayBuffer], {type: "application/octet-stream"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);

        a.type='application/octet-stream';
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        document.body.removeChild(a);
    }

    static SaveTextFile(filename, text)
    {
        let blob = new Blob([text], {type: "text/plain"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);

        a.type='text/plain';
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);   
    }
    

    static ExportImage(src,saveName)
    {
        
                const image = new Image();
                image.onload = () => 
                {
                    
                    let canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                const dataArray = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                    const uint8Array = new TextEncoder().encode(canvas.toDataURL("image/png"));
                    Assets.SaveTextFile(saveName, uint8Array);
                        
                };
                image.src = src;


    }

    static GetTexture(name)
    {
        return this.textures[name];
    }


}
