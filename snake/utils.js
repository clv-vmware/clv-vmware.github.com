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
    // ctx.fillRect(pos.x, pos.y, size, size);
    drawRoundedRect ('#272727', '#272727', pos.x, pos.y, size, size, 10)
    // console.log('in draw', this.position);
    ctx.closePath();
    ctx.fill();
}

function drawRoundedRect (strokeStyle, fillStyle, cornerX, cornerY, width, height, cornerRadius) {
    ctx.beginPath();
    roundedRect (cornerX, cornerY, width, height, cornerRadius);
    ctx.strokeStyle = strokeStyle;
    // ctx.shadowColor = "RGBA(127,127,127,1)";

    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 0;
    ctx.fillStyle = fillStyle;

    ctx.stroke();
    ctx.fill();
}

function roundedRect (cornerX, cornerY, width, height, cornerRadius) {
    if (width > 0) {
        ctx.moveTo(cornerX + cornerRadius, cornerY);
    }
    else {
        ctx.moveTo(cornerX - cornerRadius, cornerY);
    }

    ctx.arcTo(cornerX + width, cornerY, cornerX + width, cornerY + height, cornerRadius);
    ctx.arcTo(cornerX + width, cornerY + height, cornerX, cornerY + height, cornerRadius);
    ctx.arcTo(cornerX, cornerY + height, cornerX, cornerY, cornerRadius);

    if (width > 0) {
        ctx.arcTo(cornerX, cornerY, cornerX + cornerRadius, cornerY, cornerRadius);
    }
    else {
        ctx.arcTo(cornerX, cornerY, cornerX - cornerRadius, cornerY, cornerRadius);
    }
}


