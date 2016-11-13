/**
 * generate random position based on grid
 */
function getRandomPosition (fromNum, toNum) {
    var x = fromNum + Math.random() * (toNum - fromNum);
    var y = fromNum + Math.random() * (toNum - fromNum);

    var roundX = x - x % (GRID_SIZE + 0.1);
    var roundY = y - y % (GRID_SIZE + 0.1);
    return new Vector(roundX, roundY);
}

function detectCollision (pos1, pos2, gridSize) {

    var nResult = false;


    var rec1Left = pos1.x;
    var rec1Right = pos1.x + gridSize;
    var rec2Left = pos2.x;
    var rec2Right = pos2.x + gridSize;
    var rec1Top = pos1.y;
    var rec2Top = pos2.y;
    var rec1Bottom = pos1.y + gridSize;
    var rec2Bottom = pos2.y + gridSize;

    if (rec1Right > rec2Left && rec1Left < rec2Right) {
        if (rec1Bottom > rec2Top && rec1Top < rec2Bottom) {
            nResult = true;
        }
    }
    return nResult;
}

function drawCell (color, pos, size) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillRect(pos.x, pos.y, size, size);
    // console.log('in draw', this.position);
    ctx.closePath();
    ctx.fill();
}


