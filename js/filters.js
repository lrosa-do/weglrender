
"use strict";

function CreateScreenShader()
{
    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;

    void main() {
            gl_FragColor = texture2D(uTexture, fragTexCoord);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.UnSet();
    return shader;
}

function CreateGrayScale()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;

    void main() {
       // gl_FragColor = texture2D(uTexture, vec2(v_texCoord.x, 1.0 - v_texCoord.y));
     
       vec4 texelColor = texture2D(uTexture, fragTexCoord);
       // Convert texel color to grayscale using NTSC conversion weights
       float gray = dot(texelColor.rgb, vec3(0.299, 0.587, 0.114));

      gl_FragColor = vec4(gray, gray, gray, texelColor.a);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.UnSet();
    return shader;
    


}

function CreatePixelizer()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;

    uniform float renderWidth;
    uniform float renderHeight;

    float pixelWidth = 5.0;
    float pixelHeight = 5.0;

    void main() {
      
        float dx = pixelWidth*(1.0/renderWidth);
        float dy = pixelHeight*(1.0/renderHeight);
    
        vec2 coord = vec2(dx*floor(fragTexCoord.x/dx), dy*floor(fragTexCoord.y/dy));
    
        vec3 tc = texture2D(uTexture, coord).rgb;

        gl_FragColor = vec4(tc, 1.0);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.AddUniform("renderWidth");
    shader.AddUniform("renderHeight");
    shader.UnSet();
    return shader;
    


}

function CreateCrossHatching()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;

    float hatchOffsetY = 5.0;
    float lumThreshold01 = 0.9;
    float lumThreshold02 = 0.7;
    float lumThreshold03 = 0.5;
    float lumThreshold04 = 0.3;


    void main()
     {
      
        vec3 tc = vec3(1.0, 1.0, 1.0);
        float lum = length(texture2D(uTexture, fragTexCoord).rgb);
    
        if (lum < lumThreshold01)
        {
            if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) tc = vec3(0.0, 0.0, 0.0);
        }
    
        if (lum < lumThreshold02)
        {
            if (mod(gl_FragCoord .x - gl_FragCoord .y, 10.0) == 0.0) tc = vec3(0.0, 0.0, 0.0);
        }
    
        if (lum < lumThreshold03)
        {
            if (mod(gl_FragCoord .x + gl_FragCoord .y - hatchOffsetY, 10.0) == 0.0) tc = vec3(0.0, 0.0, 0.0);
        }
    
        if (lum < lumThreshold04)
        {
            if (mod(gl_FragCoord .x - gl_FragCoord .y - hatchOffsetY, 10.0) == 0.0) tc = vec3(0.0, 0.0, 0.0);
        }
    
        gl_FragColor = vec4(tc, 1.0);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");

    shader.UnSet();
    return shader;
    


}

function CreateCrossStitching()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;


    uniform float renderWidth;
    uniform float renderHeight;


    float stitchingSize = 6.0;
    int invert = 0;
    
    vec4 PostFX(sampler2D tex, vec2 uv)
    {
        vec4 c = vec4(0.0);
        float size = stitchingSize;
        vec2 cPos = uv * vec2(renderWidth, renderHeight);
        vec2 tlPos = floor(cPos / vec2(size, size));
        tlPos *= size;
    
        int remX = int(mod(cPos.x, size));
        int remY = int(mod(cPos.y, size));
    
        if (remX == 0 && remY == 0) tlPos = cPos;
    
        vec2 blPos = tlPos;
        blPos.y += (size - 1.0);
    
        if ((remX == remY) || (((int(cPos.x) - int(blPos.x)) == (int(blPos.y) - int(cPos.y)))))
        {
            if (invert == 1) c = vec4(0.2, 0.15, 0.05, 1.0);
            else c = texture2D(tex, tlPos * vec2(1.0/renderWidth, 1.0/renderHeight)) * 1.4;
        }
        else
        {
            if (invert == 1) c = texture2D(tex, tlPos * vec2(1.0/renderWidth, 1.0/renderHeight)) * 1.4;
            else c = vec4(0.0, 0.0, 0.0, 1.0);
        }
    
        return c;
    }

    void main()
     {
      
        vec3 tc = PostFX(uTexture, fragTexCoord).rgb;

        gl_FragColor = vec4(tc, 1.0);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.AddUniform("renderWidth");
    shader.AddUniform("renderHeight");

    shader.UnSet();
    return shader;
    


}




function CreatePretator()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;

    void main() {
        vec3 color = texture2D(uTexture, fragTexCoord).rgb;
        vec3 colors[3];
        colors[0] = vec3(0.0, 0.0, 1.0);
        colors[1] = vec3(1.0, 1.0, 0.0);
        colors[2] = vec3(1.0, 0.0, 0.0);
    
        float lum = (color.r + color.g + color.b)/3.0;
    
        vec3 tc = vec3(0.0, 0.0, 0.0);
    
        if (lum < 0.5) tc = mix(colors[0], colors[1], lum/0.5);
        else tc = mix(colors[1], colors[2], (lum - 0.5)/0.5);
    
        gl_FragColor = vec4(tc, 1.0);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.UnSet();
    return shader;
    


}

function CreateScanlines()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;



    float offset = 0.0;
    float frequency = 450.0/3.0;

    void main() {
       
        float globalPos = (fragTexCoord.y + offset) * frequency;
        float wavePos = cos((fract(globalPos) - 0.5)*3.14);
    
        vec4 color = texture2D(uTexture, fragTexCoord);
    
        gl_FragColor = mix(vec4(0.0, 0.3, 0.0, 0.0), color, wavePos);

    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");

    shader.UnSet();
    return shader;
}

function CreateFisheye()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;

    const float PI = 3.1415926535;

    void main()
    {
        float aperture = 178.0;
        float apertureHalf = 0.5 * aperture * (PI / 180.0);
        float maxFactor = sin(apertureHalf);
    
        vec2 uv = vec2(0.0);
        vec2 xy = 2.0 * fragTexCoord.xy - 1.0;
        float d = length(xy);
    
        if (d < (2.0 - maxFactor))
        {
            d = length(xy * maxFactor);
            float z = sqrt(1.0 - d * d);
            float r = atan(d, z) / PI;
            float phi = atan(xy.y, xy.x);
    
            uv.x = r * cos(phi) + 0.5;
            uv.y = r * sin(phi) + 0.5;
        }
        else
        {
            uv = fragTexCoord.xy;
        }
    
        gl_FragColor = texture2D(uTexture, uv);
    }
    `;

    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.UnSet();
    return shader;
}


function CreateSobel()
{
    

    let VertexShaderScreen = ` 
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 fragTexCoord;

    void main() 
    {
        gl_Position = vec4(a_position, 0.0, 1.0);
        fragTexCoord = (a_position + 1.0) / 2.0;
    }
    `;

    let FragmentShaderScreen = ` 
    precision mediump float;
    varying vec2 fragTexCoord;
    uniform sampler2D uTexture;
    uniform float renderWidth;
    uniform float renderHeight;


    void main() {
        vec2 resolution = vec2(renderWidth, renderHeight);

        float x = 1.0/resolution.x;
        float y = 1.0/resolution.y;
    
        vec4 horizEdge = vec4(0.0);
        horizEdge -= texture2D(uTexture, vec2(fragTexCoord.x - x, fragTexCoord.y - y))*1.0;
        horizEdge -= texture2D(uTexture, vec2(fragTexCoord.x - x, fragTexCoord.y    ))*2.0;
        horizEdge -= texture2D(uTexture, vec2(fragTexCoord.x - x, fragTexCoord.y + y))*1.0;
        horizEdge += texture2D(uTexture, vec2(fragTexCoord.x + x, fragTexCoord.y - y))*1.0;
        horizEdge += texture2D(uTexture, vec2(fragTexCoord.x + x, fragTexCoord.y    ))*2.0;
        horizEdge += texture2D(uTexture, vec2(fragTexCoord.x + x, fragTexCoord.y + y))*1.0;
    
        vec4 vertEdge = vec4(0.0);
        vertEdge -= texture2D(uTexture, vec2(fragTexCoord.x - x, fragTexCoord.y - y))*1.0;
        vertEdge -= texture2D(uTexture, vec2(fragTexCoord.x    , fragTexCoord.y - y))*2.0;
        vertEdge -= texture2D(uTexture, vec2(fragTexCoord.x + x, fragTexCoord.y - y))*1.0;
        vertEdge += texture2D(uTexture, vec2(fragTexCoord.x - x, fragTexCoord.y + y))*1.0;
        vertEdge += texture2D(uTexture, vec2(fragTexCoord.x    , fragTexCoord.y + y))*2.0;
        vertEdge += texture2D(uTexture, vec2(fragTexCoord.x + x, fragTexCoord.y + y))*1.0;
    
        vec3 edge = sqrt((horizEdge.rgb*horizEdge.rgb) + (vertEdge.rgb*vertEdge.rgb));
    
        gl_FragColor = vec4(edge, texture2D(uTexture, fragTexCoord).a);
    
    }
    `;
    let shader = new Shader();
    shader.Load(VertexShaderScreen, FragmentShaderScreen);
    shader.AddUniform("uTexture");
    shader.AddUniform("renderWidth");
    shader.AddUniform("renderHeight");
    shader.UnSet();
    return shader;
}


function CreateBloom()
{
        
    
        let VertexShaderScreen = ` 
        precision mediump float;
        attribute vec2 a_position;
        varying vec2 fragTexCoord;
    
        void main() 
        {
            gl_Position = vec4(a_position, 0.0, 1.0);
            fragTexCoord = (a_position + 1.0) / 2.0;
        }
        `;
    
        let FragmentShaderScreen = ` 
        precision mediump float;
        varying vec2 fragTexCoord;
        uniform sampler2D uTexture;
        
        uniform float renderWidth;
        uniform float renderHeight;


        const float samples = 5.0;          // Pixels per axis; higher = bigger glow, worse performance
        const float quality = 2.5;          // Defines size factor: Lower = smaller glow, better quality
    
        void main() {

            vec2 size = vec2(renderWidth, renderHeight);


            vec4 sum = vec4(0);
            vec2 sizeFactor = vec2(1)/size*quality;
        
            // Texel color fetching from texture sampler
            vec4 source = texture2D(uTexture, fragTexCoord);
        
            const int range = 2;            // should be = (samples - 1)/2;
        
            for (int x = -range; x <= range; x++)
            {
                for (int y = -range; y <= range; y++)
                {
                    sum += texture2D(uTexture, fragTexCoord + vec2(x, y)*sizeFactor);
                }
            }
        
            // Calculate final fragment color
            gl_FragColor = ((sum/(samples*samples)) + source);

        }
        `;
    
        let shader = new Shader();
        shader.Load(VertexShaderScreen, FragmentShaderScreen);
        shader.AddUniform("uTexture");
        shader.AddUniform("renderWidth");
        shader.AddUniform("renderHeight");
        shader.UnSet();
        return shader;

}


function CreateBlur()
{
            
        
            let VertexShaderScreen = ` 
            precision mediump float;
            attribute vec2 a_position;
            varying vec2 fragTexCoord;
        
            void main() 
            {
                gl_Position = vec4(a_position, 0.0, 1.0);
                fragTexCoord = (a_position + 1.0) / 2.0;
            }
            `;
        
            let FragmentShaderScreen = ` 
            precision mediump float;
            varying vec2 fragTexCoord;
            uniform sampler2D uTexture;
            
            uniform float renderWidth;
            uniform float renderHeight;

           
            vec3 offset = vec3(0.0, 1.3846153846, 3.2307692308);
            vec3 weight = vec3(0.2270270270, 0.3162162162, 0.0702702703);

            void main()
            {
                // Texel color fetching from texture sampler
                vec3 tc = texture2D(uTexture, fragTexCoord).rgb*weight.x;

                tc += texture2D(uTexture, fragTexCoord + vec2(offset.y)/renderWidth, 0.0).rgb*weight.y;
                tc += texture2D(uTexture, fragTexCoord - vec2(offset.y)/renderWidth, 0.0).rgb*weight.y;

                tc += texture2D(uTexture, fragTexCoord + vec2(offset.z)/renderWidth, 0.0).rgb*weight.z;
                tc += texture2D(uTexture, fragTexCoord - vec2(offset.z)/renderWidth, 0.0).rgb*weight.z;

                gl_FragColor = vec4(tc, 1.0);
            }
            `;
        
            let shader = new Shader();
            shader.Load(VertexShaderScreen, FragmentShaderScreen);
            shader.AddUniform("uTexture");
            shader.AddUniform("renderWidth");
            shader.AddUniform("renderHeight");
            shader.UnSet();
            return shader;

}

function CreatePosterization()
{
                
            
                let VertexShaderScreen = ` 
                precision mediump float;
                attribute vec2 a_position;
                varying vec2 fragTexCoord;
            
                void main() 
                {
                    gl_Position = vec4(a_position, 0.0, 1.0);
                    fragTexCoord = (a_position + 1.0) / 2.0;
                }
                `;
            
                let FragmentShaderScreen = ` 
                precision mediump float;
                varying vec2 fragTexCoord;
                uniform sampler2D uTexture;
  

                float gamma = 0.6;
                float numColors = 8.0;

                void main()
                {
                    vec3 color = texture2D(uTexture, fragTexCoord.xy).rgb;

                    color = pow(color, vec3(gamma, gamma, gamma));
                    color = color*numColors;
                    color = floor(color);
                    color = color/numColors;
                    color = pow(color, vec3(1.0/gamma));

                    gl_FragColor = vec4(color, 1.0);
                }
                `;
            
                let shader = new Shader();
                shader.Load(VertexShaderScreen, FragmentShaderScreen);
                shader.AddUniform("uTexture");
    
                shader.UnSet();
                return shader;

}


function CreatDreamtVision()
{
                    
                
                    let VertexShaderScreen = ` 
                    precision mediump float;
                    attribute vec2 a_position;
                    varying vec2 fragTexCoord;
                
                    void main() 
                    {
                        gl_Position = vec4(a_position, 0.0, 1.0);
                        fragTexCoord = (a_position + 1.0) / 2.0;
                    }
                    `;
                
                    let FragmentShaderScreen = ` 
                    precision mediump float;
                    varying vec2 fragTexCoord;
                    uniform sampler2D uTexture;
                    void main()
                    {
                        vec4 color = texture2D(uTexture, fragTexCoord);

                        color += texture2D(uTexture, fragTexCoord + 0.001);
                        color += texture2D(uTexture, fragTexCoord + 0.003);
                        color += texture2D(uTexture, fragTexCoord + 0.005);
                        color += texture2D(uTexture, fragTexCoord + 0.007);
                        color += texture2D(uTexture, fragTexCoord + 0.009);
                        color += texture2D(uTexture, fragTexCoord + 0.011);

                        color += texture2D(uTexture, fragTexCoord - 0.001);
                        color += texture2D(uTexture, fragTexCoord - 0.003);
                        color += texture2D(uTexture, fragTexCoord - 0.005);
                        color += texture2D(uTexture, fragTexCoord - 0.007);
                        color += texture2D(uTexture, fragTexCoord - 0.009);
                        color += texture2D(uTexture, fragTexCoord - 0.011);

                        color.rgb = vec3((color.r + color.g + color.b)/3.0);
                        color = color/9.5;

                        gl_FragColor = color;
                }
                    `;
                
                    let shader = new Shader();
                    shader.Load(VertexShaderScreen, FragmentShaderScreen);
                    shader.AddUniform("uTexture");
                    shader.AddUniform("renderWidth");
                    shader.AddUniform("renderHeight");
                    shader.UnSet();
                    return shader;

}

function CreateToon()
{
                            
                        
                            let VertexShaderScreen = ` 
                            precision mediump float;
                            attribute vec2 a_position;
                            varying vec2 fragTexCoord;
                        
                            void main() 
                            {
                                gl_Position = vec4(a_position, 0.0, 1.0);
                                fragTexCoord = (a_position + 1.0) / 2.0;
                            }
                            `;
                        
                            let FragmentShaderScreen = ` 
                            precision mediump float;
                            varying vec2 fragTexCoord;
                            uniform sampler2D uTexture;
                            uniform float renderWidth;
                            uniform float renderHeight;
                            void main()
                            {
                                vec2 resolution = vec2(renderWidth, renderHeight);
                                vec2 texel = vec2(1.0, 1.0)/resolution;
                                vec3 color = texture2D(uTexture, fragTexCoord).rgb;
                                vec3 lum = vec3(0.299, 0.587, 0.114);
                                float d = 0.0;
                                vec3 tc = vec3(0.0);
                                for (int x = -1; x <= 1; x++)
                                {
                                    for (int y = -1; y <= 1; y++)
                                    {
                                        vec3 sample = texture2D(uTexture, fragTexCoord + vec2(x, y)*texel).rgb;
                                        float l = dot(sample, lum);
                                        d += l;
                                        tc += step(color, sample);
                                    }
                                }
                                tc /= 9.0;
                                if (d > 1.7) tc = vec3(1.0);
                                else if (d > 1.0) tc = vec3(0.5);
                                else if (d > 0.5) tc = vec3(0.3);
                                else tc = vec3(0.1);
                                gl_FragColor = vec4(tc, 1.0);
                            }
                            `;
                        
                            let shader = new Shader();
                            shader.Load(VertexShaderScreen, FragmentShaderScreen);
                            shader.AddUniform("uTexture");
                            shader.AddUniform("renderWidth");
                            shader.AddUniform("renderHeight");
                            shader.UnSet();
                            return shader;

}

