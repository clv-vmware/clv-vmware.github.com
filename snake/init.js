// DRAW bg
// var bg = new Background();
// bg.drawGrid(GRID_SIZE);

/**
 * CONTROL FPS
 */

var fps = 10;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

var runningFlag = true;
var score = 0;

// DRAW SNAKE
var s = new Snake();

var absoluteV = 30;
s.setVelocity(new Vector(absoluteV, 0));


var obstacle = new Egg();

window.addEventListener('keydown', function (event) {

    if (event.key === 'ArrowUp') {
        velocity = new Vector(0, -absoluteV);
        s.setVelocity(velocity);
    }
    else if(event.key === 'ArrowDown') {
        velocity = new Vector(0, absoluteV);
        s.setVelocity(velocity);
    }
    else if(event.key === 'ArrowLeft') {
        velocity = new Vector(-absoluteV, 0);
        s.setVelocity(velocity);
    }
    else if(event.key === 'ArrowRight') {
        velocity = new Vector(absoluteV, 0);
        s.setVelocity(velocity);
    } 
});

var pauseBtn = document.querySelector("#pause");
pauseBtn.addEventListener('click', function () {
    runningFlag = false;
});

var runBtn = document.querySelector("#run");
runBtn.addEventListener('click', function () {
    runningFlag = true;
    loop();
});


function loop () {
    queue();
}

function clear() {
    ctx.clearRect(0, 0, width, height);
}
function update() {
    s.move();
}

function draw () {
    s.draw();
    obstacle.draw();
    var ifHit = obstacle.checkCollision();
    
}

function queue () {
    if (runningFlag) window.requestAnimationFrame(loop);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        clear();
        update();
        draw();
    }
}

loop();