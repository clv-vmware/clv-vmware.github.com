// GLOBAL VARIABLE
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var GRID_SIZE = 30;
var velocity = new Vector(0, 0);



function Background () {

}

Background.prototype.drawGrid = function (gridSize) {
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0;i < width; i += gridSize) {
        drawLine(new Vector(i, 0), new Vector(i, height));
        

    }
    for (var i = 0;i < width; i += gridSize) {
        drawLine(new Vector(0, i), new Vector(width, i));
    }


}

function drawLine (startVector, endVector) {
    ctx.beginPath();
    ctx.moveTo(startVector.x, startVector.y);
    ctx.lineTo(endVector.x, endVector.y);
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}




