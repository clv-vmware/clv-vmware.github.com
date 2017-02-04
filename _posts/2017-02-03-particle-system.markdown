---
layout: post
title: Particle System
date: 2017-02-03
categories: translation
---
我们用不到200行js代码实现一个带有多个发射器和可以吸引或者驱散发射区域的小型粒子系统
这是我刚开始从事js开发时的一个个人项目。我不是一个数学家，物理学家或是游戏程序员所以有很多更好的方法去接触这里写到的逻辑。即使是这样，这个例子也是很好的来学习js性能的实例
从这个项目中最受益的是勇敢的跨过graphic的入门这一步。如果你有text editor和浏览器，你就可以制作visualization 或者是video game

#### setting up environment

我们不打算深入canvas有关的内容，这里有一些[details] (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).

```javascript
<!DOCTYPE html>
<html>
  <body>
    <canvas></canvas>
  </body>
</html>
```

就是这样！这三个嵌套的标签就是我们html的骨架。

#### canvas obj

为了获取canvas obj, 我们先要拿到元素，任何你喜欢的方式都OK。
```
	var canvas = document.querySelector('canvas');
```
canvas元素有许多个contexts,我们需要用到的是basic 2d context, 这让我们能像bitmap一样操作canvas，这里是一些[参考API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

```
var ctx = canvas.getContext('2d');

```

为了让我们画布最大，我们把canvas尺寸设为整个window.

```
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

```
#### Animation Loop

animation loop 是第一个稍微陌生的概念如果你之前从事传统app开发的话。当用这种方法处理graphics 你可能会通过控制 drawing来管理系统的状态,你有两个不同的步骤来做update draw.你也需要清除当前画布然后排队下一个animation cycle。animation loop 如下概括

```JAVASCRIPT
function loop () {
	clear();
	update();
	draw();
	queue();
}
```

清除canvas 在这个例子中只有一行代码，但是当处理多个buffers或者是多个drawing state 情况会变得更加复杂

```
function clear () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
```
调用下一次动画循环可以使用setTimeout(), 但是它会带来诸多问题，所以我们用[requestAnimationFrame API](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) 来让浏览器告诉我们什么时候该调用下一帧。这个方法是没有前缀的，如果你需要做老的就浏览器的兼容问题，这有一些[参考](https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)

```
	function queue () {
		window.requestAnimationFrame(loop);
	}
```

update() 和 draw() 方法涵盖了大部分逻辑but you can stub them out for now and then initiate the first run of your loop to set up a solid foundation for canvas experimentation.

```javascript
function update() {
// stub
}
 
function draw() {
// stub
}
 
loop();
```

下面是 code 最后的基本部分。余下代码组织方式根据你自己喜好，结尾会附上完整demo.

```JAVASCRIPT
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 
function loop() {
  clear();
  update();
  draw();
  queue();
}
 
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
 
function update() {
// stub
}
 
function draw() {
// stub
}
 
function queue() {
  window.requestAnimationFrame(loop);
}
 
loop();
```
### Particle basics
从粒子系统的base版本中，我们考虑空间中一个移动的点，为了表示这样的状态，我们至少需要存储：position, velocity, acceleration.每一个属性可以用二维向量来表示，所以我们从构建vector开始。

#### Vector

这个对象会被经常用到。如果我们操纵10000 个粒子运动以每秒30帧的速率，我们对每一个粒子的3个属性都使用一个vector表示，也就是说每秒我们会创建和丢弃将近100 000 个对象。基于这样的考虑，vector需要优化。我会在别处另谈优化问题，现在我们先来考虑实现问题。

2d vector 的组成就是x, y 坐标。

```
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
```

一些utility

```
// Add a vector to another
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}
 
// Gets the length of the vector
Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
 
// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};
 
// Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};
```

#### Particle 

现在我们可以把Vector组合起来了。传入参数并设置默认值，至少我们现在有了静止在原点的particle。

```
function Particle(point, velocity, acceleration) {
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = acceleration || new Vector(0, 0);
}
```

在每一帧我们都会移动粒子，实现这个功能的方法也是很直观的。如果加速，修改velocity，然后，把velocity加到position上。

```
Particle.prototype.move = function () {
  // Add our current acceleration to our current velocity
  this.velocity.add(this.acceleration);
 
  // Add our current velocity to our position
  this.position.add(this.velocity);
};
```
### Particle Emitter 

emitter 是发射particle的obj.emitter可以是产生particles的任何东西，烟花，篝火等等可以产生sparkle fade效果的粒子.

我们实现的emitters 将会从一个定点推出particles,可以设定rate和一个angle.

```
function Emitter(point, velocity, spread) {
  this.position = point; // Vector
  this.velocity = velocity; // Vector
  this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
  this.drawColor = "#999"; // So we can tell them apart from Fields later
}
```
为了得到particles, 我们需要emitter去孵化粒子，这相当于创建一个新的Particle对象从emitter 继承了一些属性，this is where our Vector.fromAngle method comes in handy.fromAngle 方法会得到velocity

```
Emitter.prototype.emitParticle = function() {
  // Use an angle randomized over the spread so we have more of a "spray"
  var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
 
  // The magnitude of the emitter's velocity
  var magnitude = this.velocity.getMagnitude();
 
  // The emitter's position
  var position = new Vector(this.position.x, this.position.y);
 
  // New velocity based off of the calculated angle and magnitude
  var velocity = Vector.fromAngle(angle, magnitude);
 
  // return our new Particle!
  return new Particle(position,velocity);
};
```
#### Our First Animation!

我们已经有了构建基本particle sys的大部分内容，现在来填充update() 和draw()
我们用数组来描述particles和emitters的container

```
var particles = [];
 
// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
var emitters = [new Emitter(new Vector(100, 230), Vector.fromAngle(0, 2))],
```

update方法应该什么样？我们需要产生新的particles,移动他们我们也要把他们的位置限制在一定范围内，并且我们不会一直占据整个canvas.

```
// new update() function called from our animation loop
function update() {
  addNewParticles();
  plotParticles(canvas.width, canvas.height);
}
```
addNewParticles() 对于每个emitter 发射一定数量的particles 然后存储在particles array里

```
var maxParticles = 200; // experiment! 20,000 provides a nice galaxy
var emissionRate = 4; // how many particles are emitted each frame
 
function addNewParticles() {
  // if we're at our max, stop emitting.
  if (particles.length > maxParticles) return;
 
  // for each emitter
  for (var i = 0; i < emitters.length; i++) {
 
    // for [emissionRate], emit a particle
    for (var j = 0; j < emissionRate; j++) {
      particles.push(emitters[i].emitParticle());
    }
 
  }
}
```

plotParticles（）.我们不需要追踪超出范围的particles,所以我们需要管理范围，这也是bounds 参数的作用，我们只想渲染可见区域的一小部分。我们用canvas来设置bound

```
function plotParticles(boundsX, boundsY) {
  // a new array to hold particles within our bounds
  var currentParticles = [];
 
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos = particle.position;
 
    // If we're out of bounds, drop this particle and move on to the next
    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;
 
    // Move our particles
    particle.move();
 
    // Add this particle to the list of current particles
    currentParticles.push(particle);
  }
 
  // Update our global particles, clearing room for old particles to be collected
  particles = currentParticles;
}
```

现在每帧的状态都会被更新了，我们要做的就是画一些东西，我们用小正方形来代表粒子，当然你可以画任何你喜爱的东西。

```
var particleSize = 1;
 
function drawParticles() {
  // Set the color of our particles
  ctx.fillStyle = 'rgb(0,0,255)';
 
  // For each particle
  for (var i = 0; i < particles.length; i++) {
    var position = particles[i].position;
 
    // Draw a square at our position [particleSize] wide and tall
    ctx.fillRect(position.x, position.y, particleSize, particleSize);
  }
}
```

#### Adding Fields

在这个demo里我们的filed指的是一个attract 或者repel粒子的space.mass 参数可以是正数也可以是负数，我们为mass配置一个setter方法，以至于drawColor 方法能够根据field的类型来用不同颜色渲染（吸引green 排斥红色）。

```
function Field(point, mass) {
  this.position = point;
  this.setMass(mass);
}
```

```
Field.prototype.setMass = function(mass) {
  this.mass = mass || 100;
  this.drawColor = mass < 0 ? "#f00" : "#0f0";
}
```

现在我们建立第一个Field,它类似于我们的emitters

```
// Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
// that has a mass of `-140`
var fields = [new Field(new Vector(400, 230), -140)];
```

我们需要每个粒子根据field的速度和加速度来更新，所以我们要为Particle 加上一个方法。其中一些逻辑可能放在Vector中更好，但考虑到性能问题，我们把它放到这里。
```
Particle.prototype.submitToFields = function (fields) {
  // our starting acceleration this frame
  var totalAccelerationX = 0;
  var totalAccelerationY = 0;
 
  // for each passed field
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
 
    // find the distance between the particle and the field
    var vectorX = field.position.x - this.position.x;
    var vectorY = field.position.y - this.position.y;
 
    // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
    var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5);
 
    // add to the total acceleration the force adjusted by distance
    totalAccelerationX += vectorX * force;
    totalAccelerationY += vectorY * force;
  }
 
  // update our particle's acceleration
  this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
};
```

我们已经有了plotParticles 方法，我们现在把submitToFields 方法集成进去。

```
function plotParticles(boundsX, boundsY) {
  var currentParticles = [];
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos = particle.position;
    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;
 
    // Update velocities and accelerations to account for the fields
    particle.submitToFields(fields);
 
    particle.move();
    currentParticles.push(particle);
  }
  particles = currentParticles;
}
```

有一个方法来呈现fields和emitter是非常棒的，所以我们添加一个utility 并在draw中调用

```
// `object` is a field or emitter, something that has a drawColor and position
function drawCircle(object) {
  ctx.fillStyle = object.drawColor;
  ctx.beginPath();
  ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}
```

```
// Updated draw() function
function draw() {
  drawParticles();
  fields.forEach(drawCircle);
  emitters.forEach(drawCircle);
}
```
###Demos

cong! [final demo here](http://codepen.io/jsoverson/full/KtxmA)

试用一些不同的emitter和field组合。这里有几个徐鹤供参考

```
var emitters = [
  new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(6, 2))
];
 
var fields = [
  new Field(new Vector(midX - 100, midY + 20), 150),
  new Field(new Vector(midX - 300, midY + 20), 100),
  new Field(new Vector(midX - 200, midY + 20), -20),
];
```
```
var emitters = [
  new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(6, 2), Math.PI)
];
 
var fields = [
  new Field(new Vector(midX - 300, midY + 20), 900),
  new Field(new Vector(midX - 200, midY + 10), -50),
];
```

关于优化，参考[Optimization Notice](https://software.intel.com/en-us/articles/optimization-notice#opt-en)




