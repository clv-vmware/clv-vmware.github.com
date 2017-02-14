var Vector = require('./Vector');
var Square = require('./Square');
var EventUtils = require('./utils/EventUtils');
var PaintUtils = require('./utils/PaintUtils');
var PrintUtils = require('./utils/PrintUtils');
var Constants = require('./Constants');


var canvas = document.querySelector('#gameScene');
var ctx = canvas.getContext('2d');
var square = new Square(new Vector(0, 0));

var velocity = new Vector(0, 30);


/**
 * GameScene Class
 */
function GameScene () {
    this.blockMap = this.initBlockMap();
    this.blockClolorMap = this.initBlockColorMap();
}

GameScene.prototype = {
    init: function () {
        loop();
        initButtons();
        listenKeyBoardEvent();
    },
    initBlockMap: function () {
        var blockMap = new Array(17);
        for (var j = 0;j < 17; j++) {
            blockMap[j] = new Array(10);
            for (var i = 0;i < 10;i ++) {
                blockMap[j][i] = false;
            }
        }

        return blockMap;
    },

    initBlockColorMap: function () {
        var blockMap = new Array(17);
        for (var j = 0;j < 17; j++) {
            blockMap[j] = new Array(10);
            for (var i = 0;i < 10;i ++) {
                blockMap[j][i] = '';
            }
        }

        return blockMap;
    },

    createSquare: function () {
        var randX = Math.floor(Math.random() * 17) * 30;
        console.log();
        square = new Square(new Vector(randX, 0));
    },

    updateBlockMap: function (pos) {
        // 检查 pos 和 现有堆积的squares 的连通性
        var j = Math.floor(pos.x / 30);
        var i = Math.floor(pos.y / 30);
        // console.log(i, j);
        this.blockMap[i][j] = true;
        this.initBlockColorMap[i][j] = '';
        PrintUtils.printColInMatrix(this.blockMap, 0);

        this.createSquare();
        
    },

    draw: function (ctx) {
        var ylen = this.blockMap.length;
        
        for (var i = 0; i < ylen; i++ ) {
            var xlen = this.blockMap[0].length;
            
            for (var j = 0;j < xlen; j++) {
                var square = new Square(new Vector(j * 30, i * 30));
                if (this.blockMap[i][j]) {
                    // console.log('draw gameScene', i, j, square.getPosition());
                    square.draw(ctx);
                }
            }
        }
    }
}

var gameScene = new GameScene();

var fps = 10;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
var runningFlag = true;

function loop () {
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        clear();
        update();
        draw();
    }
    queue();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update () {
    var curPos = square.getPosition();
    var nextPos = new Vector(curPos.x, curPos.y + velocity.y);

    var nextj = Math.floor(nextPos.x / 30);
    var nexti = Math.floor(nextPos.y / 30);
    if (PaintUtils.isInBoundry(nextPos) && (!gameScene.blockMap[nexti][nextj])) {
        curPos = square.move(velocity);
    }
    else { // hit case
        gameScene.updateBlockMap(curPos, color);
    }
}

function draw () {
    square.draw(ctx, '#673ab7');
    gameScene.draw(ctx);
}

function queue () {
    if (!runningFlag) return;
    window.requestAnimationFrame(loop);
}

/**
 * pause / run 
 */
function initButtons () {
    var pauseBtn = document.querySelector("#pause");
    EventUtils.addHandler(pauseBtn, 'click', function () {
        runningFlag = false;
    });

    var runBtn = document.querySelector("#run");
    
    EventUtils.addHandler(runBtn, 'click', function () {
        runningFlag = true;
        queue();
    });
}

function listenKeyBoardEvent () {
    EventUtils.addHandler(window, 'keydown', function (event) {

        if (event.keyCode === Constants.UP_ARROW) {
            velocity = new Vector(0, -absoluteV);
            snake.setVelocity(velocity);
        }
        else if(event.keyCode === Constants.DOWN_ARROW) {
            velocity = new Vector(0, absoluteV);
            snake.setVelocity(velocity);
        }
        else if(event.keyCode === Constants.LEFT_ARROW) {
            velocity = new Vector(-absoluteV, 0);
            snake.setVelocity(velocity);
        }
        else if(event.keyCode === Constants.RIGHT_ARROW) {
            velocity = new Vector(absoluteV, 0);
            snake.setVelocity(velocity);
        } 
    });
};

module.exports = GameScene;
