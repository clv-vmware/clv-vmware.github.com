function Particle(point, velocity, acceleration) {
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = acceleration || new Vector(0, 0);
}

Particle.prototype.move = function () {
  // Add our current acceleration to our current velocity
  this.velocity.add(this.acceleration);
 
  // Add our current velocity to our position
  this.position.add(this.velocity);
};

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