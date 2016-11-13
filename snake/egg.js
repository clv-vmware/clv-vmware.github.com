function Egg () {
    this.position = getRandomPosition(100, 400);
    this.eggSize = GRID_SIZE;

}

Egg.prototype.draw = function () {
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.fillRect(this.position.x, this.position.y, this.eggSize, this.eggSize);
    // console.log('in  egg  draw', this.position, this.eggSize);
    ctx.closePath();
    ctx.fill();
}

Egg.prototype.checkCollision = function () {
    var ifHit = detectCollision(this.position, s.headPos, this.eggSize);
    if (ifHit) {
        this.clear();
        this.position = getRandomPosition(100, 400);
        this.draw();
        score++;
        updateScore();
    }

    return ifHit;
}

Egg.prototype.clear = function () {
    ctx.clearRect(this.position.x, this.position.y, this.eggSize, this.eggSize);
    
}

function updateScore () {
    var scoreBtn = document.querySelector("#score");
    scoreBtn.innerHTML = score;
}