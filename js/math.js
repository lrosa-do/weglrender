
"use strict";
const PI = 3.14159265;
const PI2 = 2*3.14159265;
const PI_2 = 3.14159265/2;
const PI_3 = 3.14159265/3;
const PI_4 = 3.14159265/4;
const HALF_PI = Math.PI / 2;
const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 180.0 / Math.PI;

function RAD(d) { return -d*PI/180.0;}
function DEG(r) { return -r*180.0/PI;}

function Rand()
{
	return Math.floor(65536 * Math.random());
}

function RandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandomFloat(min, max)
{
	return Math.random() * (max - min) + min;
}

function Rand32()
{
	return rand()|(rand()<<16);
}

function Min(a,b)
{
	return Math.min(a,b);
}

function Max(a,b)
{
	return Math.max(a,b);
}
function Random()
{
	return Math.random();
}

function Int(a)
{
	return Math.floor(a);
}

function Abs(a) {return (a<0)?(-a):(a);}



function Lerp(from,to,progress)
{
	return from+(to-from)*progress;
}



function Sign(a)
{
	return a < 0 ? -1 : (a > 0 ? 1 : 0);
}




function Clamp(value,min,max)
{
	if (max > min)
	{
		if (value < min) return min;
		else if (value > max) return max;
		else return value;
	} else 
	{
		if (value < max) return max;
		else if (value > min) return min;
		else return value;
	}
}

function ClampAngle(angle) 
{
    return (angle % 360 + 360) % 360;
}


function Scale(value,min,max,min2,max2)
{
	return min2 + ((value - min) / (max - min)) * (max2 - min2);
}


function ScaleClamp(value,min,max,min2,max2)
{
	value = min2 + ((value - min) / (max - min)) * (max2 - min2);
	if (max2 > min2)
	{
		value = value < max2 ? value : max2;
		return value > min2 ? value : min2;
	}
	value = value < min2 ? value : min2;
	return value > max2 ? value : max2;
}

function hermiteInterpolation(p0, m0, p1, m1, t) 
{
	const t2 = t * t;
	const t3 = t2 * t;
	const h00 = 2 * t3 - 3 * t2 + 1;
	const h10 = t3 - 2 * t2 + t;
	const h01 = -2 * t3 + 3 * t2;
	const h11 = t3 - t2;

	const x = h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x;
	const y = h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y;

	return { x, y };
  }

  function BezierSplineInterpolation(points, smoth) 
  {
	const n = points.length - 1;
	const splinePoints = [];

	for (let i = 0; i < n; i++)
	{
		const p0 = i > 0 ? points[i - 1] : points[i];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = i < n - 1 ? points[i + 2] : p2;

		const m0 = new Vector2((p2.x - p0.x) * smoth, (p2.y - p0.y) * smoth);
		const m1 = new Vector2((p3.x - p1.x) * smoth, (p3.y - p1.y) * smoth);

		for (let t = 0; t < 1; t += 0.4)
		{
			splinePoints.push(hermiteInterpolation(p1, m0, p2, m1, t));
		}
	}

	return splinePoints;
  }

  function LinearSplineInterpolation(points,step=0.5)
   {
	const splinePoints = [];

	for (let i = 0; i < points.length - 1; i++)
	 {
	  const p0 = points[i];
	  const p1 = points[i + 1];

	  for (let t = 0; t <= 1; t += step) 
	  {
		const x = p0.x + t * (p1.x - p0.x);
		const y = p0.y + t * (p1.y - p0.y);
		splinePoints.push({ x, y });
	  }
	}

	return splinePoints;
  }

  function CatmullRomSplineInterpolation(points,step=0.2) 
  {
	const n = points.length - 1;
	const splinePoints = [];

	for (let i = 1; i < n; i++) 
	{
	  const p0 = points[i - 1];
	  const p1 = points[i];
	  const p2 = points[i + 1];
	  const p3 = points[i + 2] || p2;

	  for (let t = 0; t <= 1; t += step) 
	  {
		const t2 = t * t;
		const t3 = t2 * t;

		const x = 0.5 * ((2 * p1.x) +
						(-p0.x + p2.x) * t +
						(2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
						(-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

		const y = 0.5 * ((2 * p1.y) +
						(-p0.y + p2.y) * t +
						(2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
						(-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

		splinePoints.push({ x, y });
	  }

	}

	return splinePoints;
}

function CatmullRomSplineInterpolationClean(points, step = 0.2, distanceThreshold = 5) {
	const n = points.length - 1;
	const splinePoints = [];
  
	for (let i = 1; i < n; i++) {
	  const p0 = points[i - 1];
	  const p1 = points[i];
	  const p2 = points[i + 1];
	  const p3 = points[i + 2] || p2;
  
	  for (let t = 0; t <= 1; t += step) {
		const t2 = t * t;
		const t3 = t2 * t;
  
		const x = 0.5 * ((2 * p1.x) +
						(-p0.x + p2.x) * t +
						(2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
						(-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
  
		const y = 0.5 * ((2 * p1.y) +
						(-p0.y + p2.y) * t +
						(2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
						(-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  
		splinePoints.push({ x, y });
	  }
	}
  
	// Remover pontos muito próximos
	const cleanedPoints = [splinePoints[0]];
  
	for (let i = 1; i < splinePoints.length; i++)
	 {
	  const currentPoint = splinePoints[i];
	  const lastPoint = cleanedPoints[cleanedPoints.length - 1];
  
	  const distance = Math.sqrt(Math.pow(currentPoint.x - lastPoint.x, 2) + Math.pow(currentPoint.y - lastPoint.y, 2));
  
	  if (distance >= distanceThreshold)
	   {
		cleanedPoints.push(currentPoint);
	  }
	}
  
	return cleanedPoints;
  }
  

function Constrain(value, min, max)
{
	return Math.min(Math.max(value, min), max);
}

function PointInCircle(x,y,cx,cy,r)
{
	return (x-cx)*(x-cx)+(y-cy)*(y-cy)<r*r;
}

function PointInRect(x,y,rx,ry,rw,rh)
{
	return x>=rx && x<=rx+rw && y>=ry && y<=ry+rh;
}

function RectInRect(x,y,w,h,rx,ry,rw,rh)
{
	return x+w>=rx && x<=rx+rw && y+h>=ry && y<=ry+rh;
}

function CircleInCircle(x1,y1,r1,x2,y2,r2)
{
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)<(r1+r2)*(r1+r2);
}

function CircleInRect(x,y,r,rx,ry,rw,rh)
{
	let testX=x;
	let testY=y;
	if (x<rx) testX=rx;
	else if (x>rx+rw) testX=rx+rw;
	if (y<ry) testY=ry;
	else if (y>ry+rh) testY=ry+rh;
	return Distance(x,y,testX,testY)<r;
}	





class Rectangle 
{
    constructor(x=0,y=0,w=1,h=1)
    {
        this.width=w;
        this.height=h;
        this.x=x;
        this.y=y;
    }
	contains(pointX, pointY) 
	{
        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }

    intersects(otherBound)
	{
        return (
            this.x < otherBound.x + otherBound.width &&
            this.x + this.width > otherBound.x &&
            this.y < otherBound.y + otherBound.height &&
            this.y + this.height > otherBound.y
        );
    }
	set(x,y,w,h)
	{
		this.width=w;
		this.height=h;
		this.x=x;
		this.y=y;
	}
	addPoint(x,y)
	{
		if (x < this.x) this.x = x;
		if (y < this.y) this.y = y;
		if (x > this.x + this.width) this.width = x - this.x;
		if (y > this.y + this.height) this.height = y - this.y;
	}
	addVector(v)
	{
		if (v.x < this.x) this.x = v.x;
		if (v.y < this.y) this.y = v.y;
		if (v.x > this.x + this.width) this.width = v.x - this.x;
		if (v.y > this.y + this.height) this.height = v.y - this.y;
	}
	static CreateAtlasFrames(width,height, count_x,count_y)
	{
		let w = width /count_x;
		let h = height/count_y;
		let bounds = [];
		for (let y=0;y<count_y;y++)
		{
			for (let x=0;x<count_x;x++)
			{
				bounds.push(new Rectangle(x*w,y*h,w,h));
			}
		}
		return bounds;
	}
}

class Vector2 
{
    constructor(x, y) 
	{
        this.x = x || 0;
        this.y = y || 0;
    }

	set(x,y)
	{
		this.x = x;
		this.y = y;
		return this;
	}

	get()
	{
		return new Vector2(this.x,this.y);
	}

	
	heading()
	{
		return DEG( Math.atan2(this.y , this.x));
	}

	setMag( magnitude) 
	{
		return this.normalize().mult(n);
	}

	mult(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

    add(v) 
	{
		this.x = this.x + v.x;
		this.y = this.y + v.y;
		return this;
    }

	sub(v) 
	{
		this.x = this.x - v.x;
		this.y = this.y - v.y;
		return this;
	}
	

    mult(n)
	{
		this.x = this.x * n;
		this.y = this.y * n;
		return this;
    }
	
	perpendicular()
	{
		let x = this.x;
		this.x = -this.y;
		this.y = x;
		return this;
	}

	

    div(n) 
	{
		this.x = this.x / n;
		this.y = this.y / n;
		return this;
	}

    magnitude()
	{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
	magnitudeSq()
	{
		return this.x * this.x + this.y * this.y;
	}

    normalize()
	 {
        let len = this.magnitude();
		if (len !== 0) this.mult(1 / len);
		return this;
    }
	limit(max)
	{
		
		if (this.magnitude() > max) 
		{
			this.normalize();
			this.mult(max);
		}

	}

    dot(vector) 
	{
        return this.x * vector.x + this.y * vector.y;
    }
	cross(vector)
	{

		return this.x * vector.y - this.y * vector.x;
		
	}

    clone() 
	{
        return new Vector2(this.x, this.y);
    }

	copy(vector)
	{
		this.x = vector.x;
		this.y = vector.y;
		return this;
	}
	angleBetween(v)
	{
		let dotmagmag = this.dot(v) / (this.mag() * v.mag());
		let angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
		return angle;
	}
	rotate (a)
	{
		let newHeading = this.heading() + a;
		let mag = this.magnitude();
		this.x = Math.cos(newHeading) * mag;
		this.y = Math.sin(newHeading) * mag;
		return this;
	}
	equals(v)
	{
		return this.x === v.x && this.y === v.y;
	}
	distance(x,y)
	{
		let dx = this.x - x;
		let dy = this.y - y;
		return Math.sqrt(dx * dx + dy * dy);
	
	}
	static Perpendicular(v)
	{
		return new Vector2(-v.y,v.x);
	}
	static Random2D()
	{
		return Vector2.fromAngle(Math.random() * PI2, 1);
	}
	static fromAngle(angle, length)
	{
		return new Vector2(length * Math.cos(angle), length * Math.sin(angle));
	
	}
	static Negate(v)
	{
		return new Vector2(-v.x,-v.y);
	}
	static Add(v1,v2)
	{
		return new Vector2(v1.x+v2.x,v1.y+v2.y);
	}

	static Mult(v1,n)
	{
		return new Vector2(v1.x*n,v1.y*n);
	}

	static Sub(v1,v2)
	{
		return new Vector2(v1.x-v2.x,v1.y-v2.y);
	}
	static Div(v1,n)
	{
		return new Vector2(v1.x/n,v1.y/n);
	}

	static Normalize(v)
	{
		let m = v.magnitude();
		if (m > 0) 
		{
			return new Vector2(v.x/m,v.y/m);
		}
		return new Vector2(0,0);
	}

	static Dot (v1,v2)
	{
		return v1.x*v2.x+v1.y*v2.y;
	}
	static Angle(v1,v2)
	{
		return Math.acos(Vector2.Dot(v1,v2)/(v1.magnitude()*v2.magnitude()));
	}
	static Distance(v1,v2)
	{
		return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x)+(v2.y-v1.y)*(v2.y-v1.y));
	}
	
	static NormalVector(p1,p2)
	{
		let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		return new Vector2(Math.cos(angle + HALF_PI), Math.sin(angle + HALF_PI));
	}
}

class Vector3
{
	constructor(x, y, z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	set(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	get()
	{
		return new Vector3(this.x, this.y, this.z);
	}

	mult(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;

	}

	add(v)
	{
		this.x = this.x + v.x;
		this.y = this.y + v.y;
		this.z = this.z + v.z;
		return this;
	}

	sub(v)
	{
		this.x = this.x - v.x;
		this.y = this.y - v.y;
		this.z = this.z - v.z;
		return this;
	}

	mult(n)
	{
		this.x = this.x * n;
		this.y = this.y * n;
		this.z = this.z * n;
		return this;
	}

	div(n)
	{
		this.x = this.x / n;
		this.y = this.y / n;
		this.z = this.z / n;
		return this;
	}

	magnitude()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	normalize()
	{
		let len = this.magnitude();
		if (len !== 0) this.mult(1 / len);
		return this;
	}

	dot(vector)
	{
		return this.x * vector.x + this.y * vector.y + this.z * vector.z;
	}

	cross(vector)
	{
		let x = this.y * vector.z - this.z * vector.y;
		let y = this.z * vector.x - this.x * vector.z;
		let z = this.x * vector.y - this.y * vector.x;
		return new Vector3(x, y, z);
	}
	static Cross(v1, v2)
	{
		let x = v1.y * v2.z - v1.z * v2.y;
		let y = v1.z * v2.x - v1.x * v2.z;
		let z = v1.x * v2.y - v1.y * v2.x;
		return new Vector3(x, y, z);
	}
	static Dot(v1, v2)
	{
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	}
	static Add(v1, v2)
	{
		return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
	}
	static Sub(v1, v2)
	{
		return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
	}
	static Mult(v1, n)
	{
		return new Vector3(v1.x * n, v1.y * n, v1.z * n);
	}
	static Div(v1, n)
	{
		return new Vector3(v1.x / n, v1.y / n, v1.z / n);
	}
	static Normalize(v)
	{
		let m = v.magnitude();
		if (m > 0)
		{
			return new Vector3(v.x / m, v.y / m, v.z / m);
		}
		return new Vector3(0, 0, 0);
	}
	static Distance(v1, v2)
	{
		return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y) + (v2.z - v1.z) * (v2.z - v1.z));
	}

}	

class Matrix2D
{
	
	constructor()
	{
	this.a = 1;
	this.b = 0;
	this.c = 0;
	this.d = 1;
	this.tx = 0;
	this.ty = 0;
	}

	identity()
	{
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
		return this;
	}
	set(a, b, c, d, tx, ty)
	{
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
		return this;
	}
	translate(x, y)
	{
		this.tx += x;
		this.ty += y;
		return this;
	}
	scale(x, y)
	{
		this.a *= x;
		this.d *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	}
	skew(skewX, skewY)
	{
		let sinX = Math.sin(skewX);
		let cosX = Math.cos(skewX);
		let sinY = Math.sin(skewY);
		let cosY = Math.cos(skewY);
	   
		this.set(this.a  * cosY - this.b  * sinX,
				this.a  * sinY + this.b  * cosX,
				this.c  * cosY - this.d  * sinX,
				this.c  * sinY + this.d  * cosX,
				this.tx * cosY - this.ty * sinX,
				this.tx * sinY + this.ty * cosX);
	}
	rotate(angle)
	{
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);
		let a = this.a;
		let c = this.c;
		let tx = this.tx;
		this.a = a * cos - this.b * sin;
		this.b = a * sin + this.b * cos;
		this.c = c * cos - this.d * sin;
		this.d = c * sin + this.d * cos;
		this.tx = tx * cos - this.ty * sin;
		this.ty = tx * sin + this.ty * cos;
		return this;
	}
	transformPoint(x, y)
	{
		return new Vector2(this.a * x + this.c * y + this.tx, this.b * x + this.d * y + this.ty);
	}

	transformRef(x, y, to)
	{
		to.x = this.a * x + this.c * y + this.tx;
		to.y = this.b * x + this.d * y + this.ty;
		return to;
	}

	transformVectorRef(v, to)
	{
		to.x = this.a * v.x + this.c * v.y + this.tx;
		to.y = this.b * v.x + this.d * v.y + this.ty;
		return to;
	}

	
	
	clone()
	{
		return new Matrix2D().set(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}
	copy(matrix)
	{
		return this.set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	concat(matrix)
	{
		let a = this.a;
		let c = this.c;
		let tx = this.tx;
		this.a = a * matrix.a + this.b * matrix.c;
		this.b = a * matrix.b + this.b * matrix.d;
		this.c = c * matrix.a + this.d * matrix.c;
		this.d = c * matrix.b + this.d * matrix.d;
		this.tx = tx * matrix.a + this.ty * matrix.c + matrix.tx;
		this.ty = tx * matrix.b + this.ty * matrix.d + matrix.ty;
		return this;
	}
	prepend(matrix)
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		this.a = matrix.a * a + matrix.b * c;
		this.b = matrix.a * b + matrix.b * d;
		this.c = matrix.c * a + matrix.d * c;
		this.d = matrix.c * b + matrix.d * d;
		this.tx += matrix.tx * a + matrix.ty * c;
		this.ty += matrix.tx * b + matrix.ty * d;
		return this;
	}
	invert()
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		let tx = this.tx;
		let ty = this.ty;
		let det = a * d - b * c;
		if (det === 0)
		{
			this.identity();
		} else
		{
			det = 1 / det;
			this.a = d * det;
			this.b = -b * det;
			this.c = -c * det;
			this.d = a * det;
			this.tx = (c * ty - d * tx) * det;
			this.ty = (b * tx - a * ty) * det;
		}
		return this;
	}

	mult(m)
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		let tx = this.tx;
		let ty = this.ty;
		this.a = m.a * a + m.b * c;
		this.b = m.a * b + m.b * d;
		this.c = m.c * a + m.d * c;
		this.d = m.c * b + m.d * d;
		this.tx = m.tx * a + m.ty * c + tx;
		this.ty = m.tx * b + m.ty * d + ty;
		return this;
	}
	transformRectangle(bound)
	{
		let x = bound.x;
		let y = bound.y;
		let xMax = x + bound.width;
		let yMax = y + bound.height;
		let x0 = this.a * x + this.c * y + this.tx;
		let y0 = this.b * x + this.d * y + this.ty;
		let x1 = this.a * xMax + this.c * y + this.tx;
		let y1 = this.b * xMax + this.d * y + this.ty;
		let x2 = this.a * xMax + this.c * yMax + this.tx;
		let y2 = this.b * xMax + this.d * yMax + this.ty;
		let x3 = this.a * x + this.c * yMax + this.tx;
		let y3 = this.b * x + this.d * yMax + this.ty;
		let minX = Math.min(x0, x1, x2, x3);
		let maxX = Math.max(x0, x1, x2, x3);
		let minY = Math.min(y0, y1, y2, y3);
		let maxY = Math.max(y0, y1, y2, y3);
		return new Rectangle(minX, minY, maxX - minX, maxY - minY);
	}
	transformRectangleRef(bound,to)
	{
		let x = bound.x;
		let y = bound.y;
		let xMax = x + bound.width;
		let yMax = y + bound.height;
		let x0 = this.a * x + this.c * y + this.tx;
		let y0 = this.b * x + this.d * y + this.ty;
		let x1 = this.a * xMax + this.c * y + this.tx;
		let y1 = this.b * xMax + this.d * y + this.ty;
		let x2 = this.a * xMax + this.c * yMax + this.tx;
		let y2 = this.b * xMax + this.d * yMax + this.ty;
		let x3 = this.a * x + this.c * yMax + this.tx;
		let y3 = this.b * x + this.d * yMax + this.ty;
		let minX = Math.min(x0, x1, x2, x3);
		let maxX = Math.max(x0, x1, x2, x3);
		let minY = Math.min(y0, y1, y2, y3);
		let maxY = Math.max(y0, y1, y2, y3);
		to.set(minX, minY, maxX - minX, maxY - minY);
		return to;
	}

	static Multiply(m1, m2)
	{
		return new Matrix2D().set(m1.a * m2.a + m1.b * m2.c, m1.a * m2.b + m1.b * m2.d, m1.c * m2.a + m1.d * m2.c, m1.c * m2.b + m1.d * m2.d, m1.tx * m2.a + m1.ty * m2.c + m2.tx, m1.tx * m2.b + m1.ty * m2.d + m2.ty);
	}
	static Identity()
	{
		return new Matrix2D();
	}
	static Translate(x, y)
	{
		return new Matrix2D().translate(x, y);
	}
	static Scale(x, y)
	{
		return new Matrix2D().scale(x, y);
	}
	static Rotate(angle)
	{
		return new Matrix2D().rotate(angle);
	}
	static TransformPoint(matrix, x, y)
	{
		return new Vector2(matrix.a * x + matrix.c * y + matrix.tx, matrix.b * x + matrix.d * y + matrix.ty);
	}
	static Clone(matrix)
	{
		return new Matrix2D().set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	static Copy(matrix, m)
	{
		return m.set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	static Concat(m1, m2)
	{
		return new Matrix2D().set(m1.a, m1.b, m1.c, m1.d, m1.tx, m1.ty).concat(m2);
	}
	static Prepend(m1, m2)
	{
		return new Matrix2D().set(m1.a, m1.b, m1.c, m1.d, m1.tx, m1.ty).prepend(m2);
	}
	static Invert(matrix)
	{
		return new Matrix2D().set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty).invert();
	}
}

class Mat4 
{
	constructor()
	{
		this.m = new Float32Array(16);
		this.identity();
	}

	set(m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
	{
		this.m[0] = m00; this.m[4] = m01; this.m[8] = m02; this.m[12] = m03;
		this.m[1] = m10; this.m[5] = m11; this.m[9] = m12; this.m[13] = m13;
		this.m[2] = m20; this.m[6] = m21; this.m[10] = m22; this.m[14] = m23;
		this.m[3] = m30; this.m[7] = m31; this.m[11] = m32; this.m[15] = m33;
	}

	identity()
	{
		this.m[0] = 1; this.m[4] = 0; this.m[8] = 0; this.m[12] = 0;
		this.m[1] = 0; this.m[5] = 1; this.m[9] = 0; this.m[13] = 0;
		this.m[2] = 0; this.m[6] = 0; this.m[10] = 1; this.m[14] = 0;
		this.m[3] = 0; this.m[7] = 0; this.m[11] = 0; this.m[15] = 1;
	}

	translate(x,y,z)
	{
		this.identity();

		this.m[12] = x;
		this.m[13] = y;
		this.m[14] = z;

	}

	scale(x,y,z)
	{
		this.identity();
		this.m[0] = x;
		this.m[5] = y;
		this.m[10] = z;
	}
	rotate(angle, x, y, z)
	{
		

		let lengthSquared = x*x + y*y + z*z;

		if ((lengthSquared != 1.0) && (lengthSquared != 0.0))
		{
			let ilength = 1.0/Math.sqrt(lengthSquared);
			x *= ilength;
			y *= ilength;
			z *= ilength;
		}

		let sinres = Math.sin(angle);
		let cosres = Math.cos(angle);
		let t = 1.0 - cosres;

		this.m[0] = x*x*t + cosres;
		this.m[1] = y*x*t + z*sinres;
		this.m[2] = z*x*t - y*sinres;
		this.m[3] = 0.0;

		this.m[4] = x*y*t - z*sinres;
		this.m[5] = y*y*t + cosres;
		this.m[6] = z*y*t + x*sinres;
		this.m[7] = 0.0;

		this.m[8] = x*z*t + y*sinres;
		this.m[9] = y*z*t - x*sinres;
		this.m[10] = z*z*t + cosres;
		this.m[11] = 0.0;

		this.m[12] = 0.0;
		this.m[13] = 0.0;
		this.m[14] = 0.0;
		this.m[15] = 1.0;

		


	}

	

	ortho(left, right, bottom, top, near, far)
	{
		let rl = (right - left);
		let tb = (top - bottom);
		let fn = (far - near);

		this.m[0] = 2.0/rl;
		this.m[1] = 0.0;
		this.m[2] = 0.0;
		this.m[3] = 0.0;
		this.m[4] = 0.0;
		this.m[5] = 2.0/tb;
		this.m[6] = 0.0;
		this.m[7] = 0.0;
		this.m[8] = 0.0;
		this.m[9] = 0.0;
		this.m[10] = -2.0/fn;
		this.m[11] = 0.0;
		this.m[12] = -((left + right)/rl);
		this.m[13] = -((top + bottom)/tb);
		this.m[14] = -((far + near)/fn);
		this.m[15] = 1.0;

	}



	static Multiply(left,right)
	{
		let result = new Mat4();
		result.m[0] = left.m[0]*right.m[0] + left.m[1]*right.m[4] + left.m[2]*right.m[8] + left.m[3]*right.m[12];
		result.m[1] = left.m[0]*right.m[1] + left.m[1]*right.m[5] + left.m[2]*right.m[9] + left.m[3]*right.m[13];
		result.m[2] = left.m[0]*right.m[2] + left.m[1]*right.m[6] + left.m[2]*right.m[10] + left.m[3]*right.m[14];
		result.m[3] = left.m[0]*right.m[3] + left.m[1]*right.m[7] + left.m[2]*right.m[11] + left.m[3]*right.m[15];
		result.m[4] = left.m[4]*right.m[0] + left.m[5]*right.m[4] + left.m[6]*right.m[8] + left.m[7]*right.m[12];
		result.m[5] = left.m[4]*right.m[1] + left.m[5]*right.m[5] + left.m[6]*right.m[9] + left.m[7]*right.m[13];
		result.m[6] = left.m[4]*right.m[2] + left.m[5]*right.m[6] + left.m[6]*right.m[10] + left.m[7]*right.m[14];
		result.m[7] = left.m[4]*right.m[3] + left.m[5]*right.m[7] + left.m[6]*right.m[11] + left.m[7]*right.m[15];
		result.m[8] = left.m[8]*right.m[0] + left.m[9]*right.m[4] + left.m[10]*right.m[8] + left.m[11]*right.m[12];
		result.m[9] = left.m[8]*right.m[1] + left.m[9]*right.m[5] + left.m[10]*right.m[9] + left.m[11]*right.m[13];
		result.m[10] = left.m[8]*right.m[2] + left.m[9]*right.m[6] + left.m[10]*right.m[10] + left.m[11]*right.m[14];
		result.m[11] = left.m[8]*right.m[3] + left.m[9]*right.m[7] + left.m[10]*right.m[11] + left.m[11]*right.m[15];
		result.m[12] = left.m[12]*right.m[0] + left.m[13]*right.m[4] + left.m[14]*right.m[8] + left.m[15]*right.m[12];
		result.m[13] = left.m[12]*right.m[1] + left.m[13]*right.m[5] + left.m[14]*right.m[9] + left.m[15]*right.m[13];
		result.m[14] = left.m[12]*right.m[2] + left.m[13]*right.m[6] + left.m[14]*right.m[10] + left.m[15]*right.m[14];
		result.m[15] = left.m[12]*right.m[3] + left.m[13]*right.m[7] + left.m[14]*right.m[11] + left.m[15]*right.m[15];
		return result;
			

	}

	static Translate(x,y,z)
	{
		let m = new Mat4();
		m.translate(x,y,z);
		return m;
	}

	static Scale(x,y,z)
	{
		let m = new Mat4();
		m.scale(x,y,z);
		return m;
	}

	static Rotate(angle,x,y,z)
	{
		let m = new Mat4();
		m.rotate(angle,x,y,z);
		return m;
	}


	/*
    // The camera in world-space is set by
    //   1. Move it to target
    //   2. Rotate by -rotation and scale by (1/zoom)
    //      When setting higher scale, it's more intuitive for the world to become bigger (= camera become smaller),
    //      not for the camera getting bigger, hence the invert. Same deal with rotation.
    //   3. Move it by (-offset);
    //      Offset defines target transform relative to screen, but since we're effectively "moving" screen (camera)
    //      we need to do it into opposite direction (inverse transform)

    // Having camera transform in world-space, inverse of it gives the modelview transform.
    // Since (A*B*C)' = C'*B'*A', the modelview is
    //   1. Move to offset
    //   2. Rotate and Scale
    //   3. Move by -target
 	*/

	static GetMatrix2D(position_x,position_y,scale_x,scale_y,angle,pivot_x,pivot_y)
	{

		let mOrigin = Mat4.Translate(-position_x, -position_y, 0);
		let mRotation = Mat4.Rotate(angle, 0, 0, 1);
		let mScale = Mat4.Scale(scale_x, scale_y, 1);
		let mTranslation = Mat4.Translate(pivot_x, pivot_y, 0);
		return Mat4.Multiply(Mat4.Multiply(mOrigin, Mat4.Multiply(mScale, mRotation)), mTranslation);

	}






}






function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy)
{
	let v0x = cx - ax;
	let v0y = cy - ay;
	let v1x = bx - ax;
	let v1y = by - ay;
	let v2x = px - ax;
	let v2y = py - ay;

	let dot00 = v0x * v0x + v0y * v0y;
	let dot01 = v0x * v1x + v0y * v1y;
	let dot02 = v0x * v2x + v0y * v2y;
	let dot11 = v1x * v1x + v1y * v1y;
	let dot12 = v1x * v2x + v1y * v2y;

	let invDen = 1.0 / (dot00 * dot11 - dot01 * dot01);
	let u = (dot11 * dot02 - dot01 * dot12) * invDen;
	let v = (dot00 * dot12 - dot01 * dot02) * invDen;

	return (u >= 0) && (v >= 0) && (u + v < 1);
}



function isConvexTriangle(ax, ay, bx, by, cx, cy)
{
	return (ay - by) * (cx - bx) + (bx - ax) * (cy - by) >= 0;
}

function IsVectorsIntersecting(ax, ay, bx, by, cx, cy, dx, dy)
{
	if ((ax == bx && ay == by) || (cx == dx && cy == dy)) return false; // length = 0

	let abx = bx - ax;
	let aby = by - ay;
	let cdx = dx - cx;
	let cdy = dy - cy;
	let tDen = cdy * abx - cdx * aby;

	if (tDen == 0.0) return false; // parallel or identical

	let t = (aby * (cx - ax) - abx * (cy - ay)) / tDen;

	if (t < 0 || t > 1) return false; // outside c->d

	let s = aby > 0 ? (cy - ay + t * cdy) / aby :
					 (cx - ax + t * cdx) / abx;

	return s >= 0.0 && s <= 1.0; // inside a->b
}

function calculateSmoothPoint(x, y, height, angle) {
    // Convert angle to radians
    const angleRad = angle * (Math.PI / 180);

    // Calculate the new position based on the angle
    const newX = x - height * Math.tan(angleRad);
    const newY = y + height;

    return { x: newX, y: newY };
}


function Triangulate(p)
{
	let n = p.length>>1;
	if(n<3) return [];
	let tgs = [];
	let avl = [];
	for(let i=0; i<n; i++) avl.push(i);
	
	let i = 0;
	let al = n;
	while(al > 3)
	{
		let i0 = avl[(i+0)%al];
		let i1 = avl[(i+1)%al];
		let i2 = avl[(i+2)%al];
		
		let ax = p[2*i0],  ay = p[2*i0+1];
		let bx = p[2*i1],  by = p[2*i1+1];
		let cx = p[2*i2],  cy = p[2*i2+1];
		
		let earFound = false;
		if(isConvexTriangle(ax, ay, bx, by, cx, cy))
		{
			earFound = true;
			for(let j=0; j<al; j++)
			{
				let vi = avl[j];
				if(vi==i0 || vi==i1 || vi==i2) continue;
				if(isPointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
			}
		}
		if(earFound)
		{
			tgs.push(i0, i1, i2);
			avl.splice((i+1)%al, 1);
			al--;
			i= 0;
		}
		else if(i++ > 3*al) break;		// no convex angles :(
	}
	tgs.push(avl[0], avl[1], avl[2]);
	return tgs;
	
}

//Vector2 array
function TriangulateVector(vec)
{
	let p = [];
	for(let i=0; i<vec.length; i++)
	{
		p.push(vec[i].x);
		p.push(vec[i].y);
	}
	return Triangulate(p);
	
}


//returns the min and max projection values of a shape onto an axis
function projShapeOntoAxis(axis, vertex)
{
    let min = Vector2.Dot(axis, vertex[0]);
    let max = min;
    for(let i=0; i<vertex.length; i++)
    {
        let p = Vector2.Dot(axis, vertex[i]);
        if(p<min)
        {
            min = p;
        } 
        if(p>max)
        {
            max = p;
        }
    }
    return {
        min: min,
        max: max
    }
}

//applying the separating axis theorem on two objects
function SAT(a, b)
{
    let axes = [];
    for(let i=0; i<a.length; i++)
    {
        let j = (i+1)%a.length;
        let edge = Vector2.Sub(a[j], a[i]);
        axes.push(Vector2.Normalize(edge));
    }
    for(let i=0; i<b.length; i++)
    {
        let j = (i+1)%b.length;
        let edge = Vector2.Sub(b[j], b[i]);
        axes.push(Vector2.Normalize(edge));
    }
    for(let i=0; i<axes.length; i++)
    {
        let axis = axes[i];
        let p1 = projShapeOntoAxis(axis, a);
        let p2 = projShapeOntoAxis(axis, b);
        if(p1.max<p2.min || p1.min>p2.max)
        {
            return false;
        }
    }
    return true;
}

class Polygon
{
	constructor()
	{
		this.vertices = [];
		this.worldVertices = [];
		this.bounds = new Rectangle(0,0,0,0);
		this.worldBounds = new Rectangle(0,0,0,0);
	}
	setBox(x,y,w,h)
	{
		this.vertices.push(new Vector2(x,y));
		this.vertices.push(new Vector2(x+w,y));
		this.vertices.push(new Vector2(x+w,y+h));
		this.vertices.push(new Vector2(x,y+h));
		this.worldVertices.push(new Vector2(x,y));
		this.worldVertices.push(new Vector2(x+w,y));
		this.worldVertices.push(new Vector2(x+w,y+h));
		this.worldVertices.push(new Vector2(x,y+h));
		this.bounds.addVector(this.vertices[0]);
		this.bounds.addVector(this.vertices[1]);
		this.bounds.addVector(this.vertices[2]);
		this.bounds.addVector(this.vertices[3]);

	}
	setCircle(x,y,radius,segments)
	{
		let angle = PI2 / segments;
		for (let i=0;i<segments;i++)
		{
			let v = new Vector2(x+Math.cos(angle*i)*radius,y+Math.sin(angle*i)*radius);
			this.vertices.push(v);
			this.worldVertices.push(v);
			this.bounds.addVector(v);
		}
	}
	transform(mat)
	{
		mat.transformBoundRef(this.bounds, this.worldBounds);

		for (let i=0;i<this.vertices.length;i++)
		{
		
			 mat.transformVectorRef(this.vertices[i], this.worldVertices[i]);
		}
	}
	addPoint(x,y)
	{
		let v = new Vector2(x,y);
		this.vertices.push(v);
		this.worldVertices.push(v);
		this.bounds.addPoint(x,y);
	}


	
	collide(p)
	{
		if (this.worldBounds.intersects(p.worldBounds) )
		{
			return SAT(this.worldVertices,p.worldVertices);
		}
	//	return SAT(this.worldVertices,p.worldVertices);
		return false;
	}
}