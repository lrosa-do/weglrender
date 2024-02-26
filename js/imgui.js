"use strict";




class Gui 
{
    static Init()
    {
        this.batch   = new PolyBatch(1024);
        this.sprites = new SpriteBatch(1024);
        this.font = Renderer.defaultFont;
        this.backgroundColor = new Color(0.5,0.5,0.5,1);
        this.overColor = new Color(0.93, 0.81, 0.98,1);
        this.ID = 0;
        this.FocusId = 0;

        this.theme = 
        {
            backgroundColor: new Color(0.5,0.5,0.5,1),
            overColor: new Color(0.43, 0.41, 0.48,1),
            fontColor: new Color(0,0,0,1),
            fontOverColor: new Color(0.93, 0.81, 0.98,1),
            checkBoxSelectedColor: new Color(0.1, 0.1, 0.1,1),
            buttonColor: new Color(0.5,0.5,0.5,1),
            buttonOverColor: new Color(0.93, 0.81, 0.98,1),
            buttonLabelColor: new Color(0.8,0.8,0.8,1),
            sliderFillColor: new Color(0.53, 0.81, 0.98,1),
            progressBarFillColor: new Color(0.3, 0.91, 0.3,1),
            editCursorColor: new Color(0.8, 0.3, 0.3,1),
            editFontColor: new Color(1,1,1,1),
            editFontColorDeactive: new Color(1,0.8,1,1),
            panelColor : new Color(30/225.0,30/225.0,30/225.0, 0.3),
            fontOverColor: new Color(0.2, 0.2, 0.2,1),
            fontOverSize: 20,
            fontSize: 18,
        };
        
    }

    static SetCursor(cursor)
    {
        if (canvas.style.cursor !== cursor) 
            canvas.style.cursor = cursor;
    }

    static Release()
    {
        if (this.batch)
        {
            this.batch.Release();
  
        }
        if (this.sprites)
        {
            this.sprites.Release();
 
        }
        
    }

    static Render()
    {
        
        this.batch.Render();
        this.sprites.Render();
        this.ID = 0;
      
    }

    static Slider(x, y, w, h, labelLeft,labelRight, min, max, value)
    {
        
        if (!this.batch) return;
        this.ID++;
     


        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x, y, w, h);
        let isPressed = false;
        let dragging = false;

        if (isOver && Input.IsMouseDown(0))
        {
              isPressed = true;
        }
  


        this.batch.SetColor(this.theme.backgroundColor);
        this.batch.DrawRectangle(x, y, w, h);
        if (isOver)
        {
            this.batch.SetColor(this.theme.overColor);
            this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);
            this.SetCursor("pointer");
            this.FocusId = this.ID-1;
        }
  
     


        if (isPressed)
        {
            value = min + (max - min) * ((mouse_x - x) / w);
            dragging = true;
           
        }

        let percent = (value - min) / (max - min);
        
        let slider_x = x+ percent * w;
     
     
        this.batch.SetColor(this.theme.sliderFillColor);
        this.batch.DrawRectangle(x,y,percent * w,h);
      
      
        if (isOver)
        {
            this.font.SetColor(this.theme.fontOverColor);
            this.font.SetSize(this.theme.fontOverSize);
          

        } else 
        {
            this.font.SetColor(this.theme.fontColor);
            this.font.SetSize(this.theme.fontSize);
       
        }
        
        if (labelLeft !== "")
        {
            this.font.SetAllignment("right");
            let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
            this.font.Print(this.sprites,x-10,offY,labelLeft);
        }
        if (labelRight !== "")
        {
            this.font.SetAllignment("left");
            let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
            this.font.Print(this.sprites,x+w+10,offY,labelRight);
        }
        
           return value;
           

    }

    static VerticalSlider(x, y, w, h, labelTop,labelBottom, min, max, value)
    {
            
            if (!this.batch) return;
            this.ID++;

            let mouse_x = Mouse.X;
            let mouse_y = Mouse.Y;

            let isOver = PointInRect( mouse_x, mouse_y, x, y-2, w, h+2);
            let isPressed = false;
      

            if (isOver && Input.IsMouseDown(0))
            {
                isPressed = true;
              
            }

            this.batch.SetColor(this.theme.backgroundColor);
            this.batch.DrawRectangle(x, y, w, h);

            if (isOver)
            {
                this.batch.SetColor(this.theme.overColor);
                this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);
                this.SetCursor("pointer");
                this.FocusId = this.ID-1;
            }

            if (isPressed)
            {
                value = min + (max - min) * ((mouse_y - y) / h);
            }

            let percent = (value - min) / (max - min);

            this.batch.SetColor(this.theme.sliderFillColor);
            this.batch.DrawRectangle(x, y, w, percent * h);

            if (isOver)
            {
                this.font.SetColor(this.theme.fontOverColor);
                this.font.SetSize(this.theme.fontOverSize);
            }
            else
            {
                this.font.SetColor(this.theme.fontColor);
                this.font.SetSize(this.theme.fontSize);
            }

            if (labelTop !== "")
            {
                this.font.SetAllignment("center");
                let offX = x +(w * 0.5) - (this.font.GetMaxWidth() * 0.5);
                let offY = y  - this.font.GetMaxHeight();
                this.font.Print(this.sprites,offX, offY,labelTop);
            }

            if (labelBottom !== "")
            {
                this.font.SetAllignment("center");
                let offX = x +(w * 0.5) - (this.font.GetMaxWidth() * 0.5);
                this.font.Print(this.sprites,offX,y+h+10,labelBottom);
            }

            return value;
    }
    
       


   static ProgressBar(x, y, w, h, label,  max, value)
    {
        if (!this.batch) return;
        this.ID++;
        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x, y, w, h);



        this.batch.SetColor(this.theme.backgroundColor);
        this.batch.DrawRectangle(x, y, w, h);
        this.batch.SetColor(this.theme.progressBarFillColor);
        this.batch.DrawRectangle(x, y , w * (value / max), h);
        if (isOver)
        {
            this.FocusId = this.ID-1;
        }

        if (label !== null)
        {
            if (label !== "")
            {
                this.font.SetColor(this.theme.fontColor);
                this.font.SetSize(this.theme.fontSize);
                this.font.SetAllignment("center");
                let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
                this.font.Print(this.sprites,x+(w*0.5),offY,label);
            }
        }
        
     
        return value;
    }
    
    static CheckBox(x, y, w, h, label, value)
    {

        if (!this.batch) return;
        this.ID++;


        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x, y, w, h);
        let isPressed = false;
 

        if (isOver && Input.IsMousePressed(0))
        {
              isPressed = true;
            
        }
 
        this.batch.SetColor(this.theme.backgroundColor);
        this.batch.DrawRectangle(x, y, w, h);
        if (isOver)
        {
            this.batch.SetColor(this.theme.overColor);
            this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);
            this.SetCursor("pointer");
            this.FocusId = this.ID-1;
        }

        if (isPressed)
        {
            value = !value;
        }

        if (value)
        {
            
            this.batch.SetColor(this.theme.checkBoxSelectedColor);
            this.batch.DrawRectangle(x+5, y+5, w-10, h-10);
        }

        if (isOver)
        {
            this.font.SetColor(this.theme.fontOverColor);
            this.font.SetSize(this.theme.fontOverSize);

        } else 
        {
            this.font.SetColor(this.theme.fontColor);
            this.font.SetSize(this.theme.fontSize);
    
        }
        
        let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
        let offX = x + w + (this.font.GetMaxWidth() * 0.5);
        this.font.SetAllignment("left");
        this.font.Print(this.sprites,offX,offY,label);
        return value;

    }
   static Button(x, y, w, h, label)
    {
        if (!this.batch) return;
        this.ID++;


        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x-1, y-1, w+1, h+1);
        let isPressed = false;
        if (isOver && Input.IsMousePressed(0))
        {
              isPressed = true;
              
        }


        this.batch.SetColor(this.theme.backgroundColor);
        this.batch.DrawRectangle(x, y, w, h);
        
        if (isOver)
        {
            this.batch.SetColor(this.theme.overColor);
            this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);

            this.font.SetColor(this.theme.fontOverColor);
            this.font.SetSize(this.theme.fontOverSize);
            this.SetCursor("pointer");
            this.FocusId = this.ID-1;

        } else 
        {
            this.font.SetColor(this.theme.buttonLabelColor);
            this.font.SetSize(this.theme.fontSize);
    
        }
        
        let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
        this.font.SetAllignment("center");
        this.font.Print(this.sprites,x+(w*0.5),offY,label);
        return isPressed;
    }   

    static ImageButton(x, y, w, h, base, over)
    {
        if (!this.batch) return;
        this.ID++;

        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x-1, y-1, w+1, h+1);
        let isPressed = false;
        if (isOver && Input.IsMousePressed(0))
        {
              isPressed = true;
              this.SetCursor("pointer");
              this.FocusId = this.ID-1;
        }
        if (isOver)
        {
            this.batch.SetColor(this.theme.overColor);
            this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);
        } 
        if (base !== null && !isOver)
        {      
              this.sprites.Draw(base, x, y, w, h);
        }
        if (over !== null && isOver)
        {
              this.sprites.Draw(over, x, y, w, h);
        }
        return isPressed;
    }

    static Label(x, y, label,size=0)
    {
        if (!this.batch) return;
        this.ID++;

        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;

        let width = this.font.GetTextWidth(label);
        let height = this.font.GetMaxHeight();

        let isOver = PointInRect( mouse_x, mouse_y,x, y, width, height  );

        if (isOver)
        {
            this.SetCursor("pointer");
            this.FocusId = this.ID-1;
        }


        this.font.SetColor(this.theme.fontColor);
        if (size === 0)
        {
            this.font.SetSize(this.theme.fontSize);
        } else 
        {
            this.font.SetSize(size);
        }
        this.font.SetAllignment("center");
        this.font.Print(this.sprites,x, y, label);
    }

    static InputText(x, y, w, h, obj)
    {
        if (!this.batch) return;
        this.ID++;

        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x, y, w, h);
        let selected = obj.selected;
        let text = obj.text;
        let state = false;

        if (this.FocusId !== this.ID-1)
        {
            selected = false;
        }
    

        if (isOver)
        {
            this.SetCursor("text");
            if (Input.IsMousePressed(0))
            {
                selected = true;    
            
                        
            }
        }

        if (Input.IsMousePressed(0) &&  !isOver &&  selected)
        {
            selected = false;
        }
  
        this.batch.SetColor(this.theme.backgroundColor);
        this.batch.DrawRectangle(x, y, w, h);
        if (selected)
        {
            this.batch.SetColor(this.theme.fontOverColor);
            this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);
            this.FocusId = this.ID-1;
        }
  
  
        if (selected)
        {
            this.font.SetColor(this.theme.editFontColor);
            this.font.SetSize(this.theme.fontOverSize);
            this.SetCursor("text");

        } else 
        {
            this.font.SetColor(this.theme.editFontColorDeactive);
            this.font.SetSize(this.theme.fontSize);
    
        }
        let cursorX = x + this.font.GetTextWidth(text) + 2;

        if (selected && Input.IsAnyKeyPressed())
        {
            let char = Input.GetLastChar();
            let key = Input.GetLastKey();
            if (char==="Backspace")
            {
                text = text.substring(0, text.length - 1);
            } else 
            if (char==="Delete")
            {
                text = text.substring(0, text.length - 1);
            } else
            if (char === "Enter")
            {
                selected = false;
                state = true;
            }else
            if (char !== ""  && key>=32 && key<=126)
            {
                if (this.font.GetTextWidth(text + char) < w)
                {
                    text += char;
                }
                
            }   
           
            
        }
        
        let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
        this.font.SetAllignment("left");
        this.font.Print(this.sprites,x+1,offY,text);
   
        if (selected)
        {
           
            this.batch.SetColor(this.theme.editCursorColor);

            Date.now() % 1000 > 500 ? this.batch.SetColor(this.theme.editCursorColor) : this.batch.SetColor(this.theme.backgroundColor);
            this.batch.Line(cursorX, y+2, cursorX, y+h-2) ;
        }

        obj.text = text;
        obj.selected = selected;
        return state;
    }

    static Toggle(x, y, w, h, label, value)
    {
        if (!this.batch) return;
        this.ID++;

        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x, y, w, h);
        let isPressed = false;
        if (isOver && Input.IsMousePressed(0))
        {
              isPressed = true;
        }

        this.batch.SetColor(this.theme.backgroundColor);
        this.batch.DrawRectangle(x, y, w, h);
        if (isOver)
        {
            this.batch.SetColor(this.theme.overColor);
            this.batch.DrawRectangleLines(x-1, y-1, w+2, h+2);
        }

        if (isPressed)
        {
            value = !value;
        }

        if (value)
        {
            this.batch.SetColor(this.theme.checkBoxSelectedColor);
            this.batch.DrawCircle(x + w * 0.5, y + h * 0.5, h * 0.4);
        }

        if (isOver)
        {
            this.font.SetColor(this.theme.fontOverColor);
            this.font.SetSize(this.theme.fontOverSize);
            this.FocusId = this.ID-1;
             this.SetCursor("pointer");   

        } else 
        {
            this.font.SetColor(this.theme.fontColor);
            this.font.SetSize(this.theme.fontSize);
    
        }
        
        let offY = y +(h * 0.5) - (this.font.GetMaxHeight() * 0.5);
        this.font.SetAllignment("right");
        this.font.Print(this.sprites,x,offY,label);
        return value;
    }

    static Panel(x, y, w, h)
    {
        if (!this.batch) return;
        this.ID++;

        let mouse_x = Mouse.X;
        let mouse_y = Mouse.Y;
        let isOver = PointInRect( mouse_x, mouse_y,x, y, w, h);
        if (isOver)
        {
           // this.FocusId = this.ID-1;
        }
        this.batch.SetColor(this.theme.panelColor);
        this.batch.DrawRectangle(x, y, w, h);
    }

}