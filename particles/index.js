var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var particles = [];
 
// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
var emitters = [new Emitter(new Vector(100, 230), Vector.fromAngle(0, 2))],
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

var particleSize = 1;

// Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
// that has a mass of `-140`
var fields = [new Field(new Vector(400, 230), -140)];
 
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

function loop () {
	clear();
	update();
	draw();
	queue();
}

function clear () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function queue () {
    window.requestAnimationFrame(loop);
}

function update() {
    addNewParticles();
    plotParticles(canvas.width, canvas.height);
}

// `object` is a field or emitter, something that has a drawColor and position
function drawCircle(object) {
  ctx.fillStyle = object.drawColor;
  ctx.beginPath();
  ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}
 
function draw() {
    drawParticles();
    fields.forEach(drawCircle);
    emitters.forEach(drawCircle);
}
 
loop();