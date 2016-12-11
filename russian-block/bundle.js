(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Vector = require('./Vector');

var Constants = {
    SQUARE_SIZE: 30,
    GAMESCENE_WIDTH: 10,
    GAMESCENE_HEIGHT: 16,

    LEFT_ARROW : 37,
    UP_ARROW : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW : 40,

    

    // COLOR_LIST:  ['#EFEECC', '#FE8B05', '#FE0557', '#400403', '#0AABBA'],
    COLOR_LIST:  ['#00e1fe', '#54d600', '#c874fe', '#fe2336', '#f6941d'],

    TETROMINO_TYPES: ['O', 'T', 'L', 'Z', 'S'],

    V_LEFT: new Vector(-1, 0),
    V_RIGHT: new Vector(1, 0),
    V_UP: new Vector(0, -1),
    V_DOWN: new Vector(0, 1),
    
};

module.exports = Constants;
},{"./Vector":5}],2:[function(require,module,exports){
/**
 * TODO: 结束界面 逻辑？ 
 */
var Vector = require('./Vector');
var Square = require('./Square');
var Tetromino = require('./Tetromino');
var EventUtils = require('./utils/EventUtils');
var PaintUtils = require('./utils/PaintUtils');
var PrintUtils = require('./utils/PrintUtils');
var MathUtils = require('./utils/MathUtils');
var Constants = require('./Constants');


var canvas = document.querySelector('#gameScene');
var ctx = canvas.getContext('2d');

var testTetromino = new Tetromino();
testTetromino.setVelocity(new Vector(0, 1));
var velocity = new Vector(0, 1);
var score = 0;


/**GAME SCENE CLASS */
function GameScene () {
    this.blockMap = this.initBlockMap();
    this.blockColorMap = this.initBlockColorMap();
}

GameScene.prototype = {
    init: function () {
        loop();
        initButtons();
        listenKeyBoardEvent();
    },

    // 采用 matrix 1， 0.。。 表示 
    initBlockMap: function () {
        var blockMap = new Array(16);
        for (var j = 0;j < 16; j++) {
            blockMap[j] = new Array(10);
            for (var i = 0;i < 10;i ++) {
                blockMap[j][i] = 0;
            }
        }
        return blockMap;
    },

    initBlockColorMap: function () {
        var colorMap = new Array(16);
        for (var j = 0;j < 16; j++) {
            colorMap[j] = new Array(10);
            for (var i = 0;i < 10;i ++) {
                colorMap[j][i] = '';
            }
        }
        // PrintUtils.printMatrix(colorMap);
        return colorMap;
    },

    createTetromino: function () {
        testTetromino = new Tetromino();
        testTetromino.setVelocity(new Vector(0, 1));
    },

    updateBlockMap: function (pos, color) {
        // 检查 pos 和 现有堆积的squares 的连通性
        var p = MathUtils.convertVectorList(pos);
        // PrintUtils.printMatrix(p);
        var rowsPlaceHolder = new Array(16);
        
        for (var i = 0;i < 16; i++ ) {
            var rowFullFlag = true;
            rowsPlaceHolder[i] = false;
            for (var j = 0;j < 10;j++) {
                // update color
                if (p[i][j] > 0) {
                    this.blockColorMap[i][j] = color;
                }
                this.blockMap[i][j] = this.blockMap[i][j] + p[i][j];
                if (this.blockMap[i][j] === 0) rowFullFlag = false;
                if (this.blockMap[i][j] > 0) rowsPlaceHolder[i] = true;
                
            }
            if (rowFullFlag) {
                // clean this row
                MathUtils.clearOneRow(this.blockMap, i);
                score++;
            }
        }
        // GAME OVER detect
        var everyRowIsPlaced = rowsPlaceHolder.every(function (item) {return item === true});
        if (everyRowIsPlaced) {
            runningFlag = false;
            // open the GAME OVER modal!
            gameOverModal.style.display = "block";
        }
        // PrintUtils.printMatrix(this.blockMap);
        
        // console.log(pos, i, j, color, PrintUtils.printColInMatrix(this.blockColorMap, 0));
        this.createTetromino();
    },

    checkCollide: function (nextPos) {
        // console.log('collide next', nextPos);
        var pos = MathUtils.convertVectorList(nextPos);
        // PrintUtils.printMatrix(pos);

        for (var i = 0;i < 16; i++ ) {
            for (var j = 0;j < 10;j++) {
                pos[i][j] = this.blockMap[i][j] + pos[i][j];
                if (pos[i][j] > 1 && testTetromino.velocity.x === 0) 
                {
                    // PrintUtils.printMatrix(pos);
                    return true;
                }
            }
        }
        return false;
    },


    getCollideMap: function (pos) {
        var pos = MathUtils.convertVectorList(pos);
        for (var i = 0;i < 16; i++ ) {
            for (var j = 0;j < 10;j++) {
                pos[i][j] = this.blockMap[i][j] + pos[i][j];
                    
            }
        }
        // PrintUtils.printMatrix(pos);

        return pos;
    },

    draw: function (ctx) {
        var ylen = this.blockMap.length;
        for (var i = 0; i < 16; i++ ) {
            var xlen = this.blockMap[0].length;
            
            for (var j = 0;j < 10; j++) {
                var square = new Square(new Vector(j, i));
                if (this.blockMap[i][j]) {
                    square.draw(ctx, this.blockColorMap[i][j]);
                }
            }
        }
    }
}


// DEFINE GLOBAL VARS
var gameScene = new GameScene();

var fps = 3;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
var runningFlag = true;

// LOOP HELPER FUNCS
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

function updateScore () {
    var scoreBtn = document.querySelector("#score");
    scoreBtn.innerHTML = score;
}

function update () {
    var curPos = testTetromino.getPosition();
    var nextPos = testTetromino.getNextPos();

    // 保证nextpos  在范围内，并且nextpos所在的 i ,j 在map内都为false
    // console.log('collide',PaintUtils.isTetrominoInBoundry(nextPos),  gameScene.checkCollide(nextPos), nextPos);
    // TODO : 此处逻辑混乱，重新理清楚 ！！！
    if (PaintUtils.isTetrominoInBoundry(nextPos)) {
        if (!gameScene.checkCollide(nextPos)) {
            curPos = testTetromino.move();
        }
        else if (testTetromino.velocity.y > 1){
            
        }
        else  if (testTetromino.velocity.x !== 0) {
            testTetromino.setVelocity(new Vector(0, 1));
        }
        else { // hit case!
            // console.log('hit!', curPos);
            gameScene.updateBlockMap(curPos, testTetromino.color);
        }
    }
    else {// OUT OF BOUNDRY CASE
        // 向左会触发 here
        // console.log('hit the boundry case!');
        if (testTetromino.velocity.x !== 0) {
            testTetromino.setVelocity(new Vector(0, 1));
        }
        else if (testTetromino.velocity.y > 1){

        }
        else { // hit case!
            // console.log('hit!', curPos);
            gameScene.updateBlockMap(curPos, testTetromino.color);
        }
    }
    updateScore();
    
}

function draw () {
    testTetromino.draw(ctx);
    gameScene.draw(ctx);
    testTetromino.setVelocity(new Vector(0, 1));
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

    var gameOverModal = document.querySelector("#gameOverModal");
    gameOverModal.style.display = "none";

    var newGameBtn = document.querySelector("#newGame");
    EventUtils.addHandler(newGameBtn, 'click', function () {
        MathUtils.clearAllRows(gameScene.blockMap);
        gameOverModal.style.display = "none";
        runningFlag = true;
        queue();
    });


}

function listenKeyBoardEvent () {
    EventUtils.addHandler(window, 'keydown', function (event) {
        if(event.keyCode === Constants.DOWN_ARROW) {
            testTetromino.setVelocity(new Vector(0, 2));
        }
        else if(event.keyCode === Constants.LEFT_ARROW) {
            
            testTetromino.setVelocity(new Vector(-1, 0));
        }
        else if(event.keyCode === Constants.RIGHT_ARROW) {
            testTetromino.setVelocity(new Vector(1, 0));
        } 

        // UP ARROW: CHANGE Tetromino SHAPE
        else if(event.keyCode === Constants.UP_ARROW) {
            testTetromino.changeShape();
        } 
    });
};

module.exports = GameScene;

},{"./Constants":1,"./Square":3,"./Tetromino":4,"./Vector":5,"./utils/EventUtils":7,"./utils/MathUtils":8,"./utils/PaintUtils":9,"./utils/PrintUtils":10}],3:[function(require,module,exports){
/**
 * 单个方块类
 */

var Constants = require('./Constants');
var Vector = require('./Vector');
var PaintUtils = require('./utils/PaintUtils');


function Square (pos) {
    // matrix pos
    this.pos = pos;
    this.color = PaintUtils.getRandomColor();
    this.velocity = new Vector(0, 0);
    // this.size = Constants.SQUARE_SIZE;
}

Square.prototype = {

    draw : function (ctx, color) {
        PaintUtils.drawCellByMap(ctx, color || this.color, this.pos);
    },

    move: function (v) {
        // console.log('in square move', v);
        var oldPos = this.getPosition();
        this.pos = oldPos.add(v || this.velocity);

        // BOUNDRY DETECT: 以网格为单位
        if (this.pos.x + 1 > Constants.GAMESCENE_WIDTH) {
            this.setVelocity(new Vector(-this.velocity.x, this.velocity.y));
            this.pos.x = Constants.GAMESCENE_WIDTH - 1;
        }

        if (this.pos.x < 0) {
            this.velocity = new Vector(-this.velocity.x, this.velocity.y);
            this.pos.x = 0;
        }

        if (this.pos.y + 1 > Constants.GAMESCENE_HEIGHT) {
            this.velocity = new Vector(this.velocity.x, -this.velocity.y);
            this.pos.y = Constants.GAMESCENE_HEIGHT - 1;
        }

        if (this.pos.y < 0) {
            this.velocity = new Vector(this.velocity.x, -this.velocity.y);
            this.pos.y = 0;
        }

        return this.pos;
    },

    getPosition: function () {
        return this.pos;
    },

    getColor: function () {
        return this.color;
    },

    setVelocity: function (v) {
        this.velocity = v;
    }

}

module.exports = Square;
},{"./Constants":1,"./Vector":5,"./utils/PaintUtils":9}],4:[function(require,module,exports){
/**
 * Tetromino类
 */

var Constants = require('./Constants');
var Vector = require('./Vector');
var Square = require('./Square');
var PaintUtils = require('./utils/PaintUtils');
var PrintUtils = require('./utils/PrintUtils');
var MathUtils = require('./utils/MathUtils');
var Utils = require('./utils/Utils');

function Tetromino (shape) {
    this.shape = shape || Utils.getRandomElement(Constants.TETROMINO_TYPES);
    // Tetromino pos  是一个vector list!
    var randPos = Utils.getRandomNum(2, 8);
    this.pos = this.getSquareListByType(this.shape, new Vector(randPos, 0));
    this.color = PaintUtils.getRandomColor();
    this.velocity = new Vector(0, 0);
    // USED FOR TOGGLE SHAPE STATUS
    this.toggle = 0;
    // T has four shapes
    this.toggleT = 0;
}

Tetromino.prototype = {
    draw: function (ctx, color) {
        var pos = this.pos;
        for (var i = 0;i < pos.length; i++) {
            pos[i].draw(ctx, this.color);
        }
    },

    batchMove: function (v) {
        for (var i = 0;i < this.pos.length; i++) {
            
            this.pos[i].pos.add(v);
            // console.log('batch', this.pos[i]);
        }
    },

    move: function (collideMap) {
        var pos = this.getNextPos();
        // var p = MathUtils.convertVectorList(pos);
        // PrintUtils.printColInMatrix(p, 0);

        // TODO : 向左右移动时的碰撞检测！！！
        
        for (var j = 0;j < pos.length; j++) {

            if (pos[j].x + 1 > Constants.GAMESCENE_WIDTH) {
                this.setVelocity(new Vector(0, 0));
                // this.batchMove(new Vector(-1, 0));
                break;
            }

            if (pos[j].x < 0) {
                this.setVelocity(new Vector(0, 0));
                // this.pos.x = 0;
                this.batchMove(new Vector(1, 0));
                break;
            }

            // if (this.pos.y + 1 > Constants.GAMESCENE_HEIGHT) {
            //     this.velocity = new Vector(this.velocity.x, -this.velocity.y);
            //     this.pos.y = Constants.GAMESCENE_HEIGHT - 1;
            //     break;
            // }

            if (this.pos.y < 0) {
                this.velocity = new Vector(this.velocity.x, -this.velocity.y);
                this.pos.y = 0;
                break;
            }
        }

        for (var i = 0;i < this.pos.length; i++) {
            this.pos[i].move(this.velocity);
        }
        
        return this.pos;
    },

    getNextPos: function () {
        // console.log('in nextpos', this.velocity);
        var list = [];
        var pos = this.pos;
        for (var i = 0;i < pos.length; i++) {
            list.push(MathUtils.vectorAdd(pos[i].getPosition(), this.velocity));
        }
        return list;
    },

    hitBoundry: function () {
        var list = this.pos;
        for (var i = 0;i < list.length; i++) {
            if (list[i].hitBoundry()) return true;
        }
        return false;
    },

    toggleLShape: function (pos) {
        
        var center = pos[2];
        var list = [];
        if (this.toggle) {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_LEFT, Constants.V_LEFT)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_LEFT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
        }
        else {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_UP, Constants.V_UP)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_UP)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
        }
        return list;
    },

    toggleZShape: function (pos) {
        var center = pos[2];
        var list = [];

        if (this.toggle) {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT, Constants.V_UP)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
        }
        else {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_LEFT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN, Constants.V_RIGHT)));
        }
        return list;
    },

    toggleTShape: function (pos) {
        var center = pos[2];
        var list = [];

        if (this.toggleT === 0) {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_LEFT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
        }
        else if (this.toggleT === 1) {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_UP)));
        }
        else if (this.toggleT === 2) {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_UP)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_LEFT)));
        }
        else {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_UP)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_LEFT)));
        }
        return list;
    },

    toggleSShape: function (pos) {
        var center = pos[2];
        var list = [];

        if (this.toggle) {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN, Constants.V_LEFT)));
        }
        else {
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_RIGHT)));
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_UP)));
            list.push(center);
            list.push(new Square(MathUtils.vectorAdd(center.pos, Constants.V_DOWN, Constants.V_RIGHT)));
        }
        return list;
    },

    changeShape: function () {
        this.toggle = !this.toggle;
        switch (this.shape) {
            case 'L':
                this.pos = this.toggleLShape(this.pos);
                break;
            case 'Z':
                this.pos = this.toggleZShape(this.pos);
                break;

            case 'T':
                this.toggleT = (++this.toggleT) % 4;
                this.pos = this.toggleTShape(this.pos);
                break;
            case 'S':
                this.pos = this.toggleSShape(this.pos);
                break;
        
            default:
                break;
        }
    },

    // 组成不同形状 tetromino 的square list 
    getSquareListByType: function (shape, pos) {
        var list = [];
        switch (shape) {
            case 'O':
                list.push(new Square(pos));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_DOWN)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT, Constants.V_DOWN)));
                break;

            case 'Z':
                list.push(new Square(pos));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_DOWN, Constants.V_RIGHT)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT, Constants.V_DOWN, Constants.V_RIGHT)));
                break;

            case 'T':
                list.push(new Square(pos));
                
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT, Constants.V_RIGHT)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT, Constants.V_DOWN)));
                break;

            case 'L':
                list.push(new Square(pos));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_DOWN)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_DOWN, Constants.V_DOWN)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_DOWN, Constants.V_DOWN, Constants.V_DOWN)));
                break;

            case 'S':
                list.push(new Square(pos));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_DOWN)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT, Constants.V_DOWN)));
                list.push(new Square(MathUtils.vectorAdd(pos, Constants.V_RIGHT, Constants.V_DOWN, Constants.V_DOWN)));
                break;
            default:
                break;
        }

        return list;
    },

    getPosition: function () {
        var list = [];
        var pos = this.pos;
        for (var i = 0;i < pos.length; i++) {
            list.push(pos[i].getPosition());
        }
        return list;
    },

    getColor: function () {
        return this.color;
    },

    setVelocity: function (v) {
        this.velocity = v;
    }
};

module.exports = Tetromino;
},{"./Constants":1,"./Square":3,"./Vector":5,"./utils/MathUtils":8,"./utils/PaintUtils":9,"./utils/PrintUtils":10,"./utils/Utils":11}],5:[function(require,module,exports){
/**
 * 
 */
function Vector (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype = {

    add : function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return new Vector(this.x, this.y);
    },

    minus : function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return new Vector(this.x, this.y);
    },

    getMagnitude : function () {
        return Math.sqrt(x * x + y * y);
    }
}

module.exports = Vector;
},{}],6:[function(require,module,exports){
var Square = require('./Square');
var Vector = require('./Vector');
var GameScene = require('./GameScene');

var gameScene = new GameScene();
gameScene.init();


},{"./GameScene":2,"./Square":3,"./Vector":5}],7:[function(require,module,exports){
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        }
    },

    removeHandler: function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        }
        else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        }
        else {
            element["on" + type] = null;
        }
    }
}

module.exports = EventUtil;
},{}],8:[function(require,module,exports){
var Vector = require('../Vector');
var PrintUtils = require('./PrintUtils');

var MathUtils = {
    vectorAdd: function (v1, v2) {
        var sumX = 0;
        var sumY = 0;
        for (var i = 0;i < arguments.length; i++) {
            sumX += arguments[i].x;
            sumY += arguments[i].y;
        }
        return new Vector(sumX, sumY);
    },

    vectorMinus: function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    },

    // convert vector list to matrix
    convertVectorList: function (list) {
        var matrix = new Array(16);
        for (var i = 0;i < 16; i++ ) {
            matrix[i] = new Array(10);
            for (var j = 0;j < 10;j++) {
                matrix[i][j] = 0;
            }
        }
        

        for(var s = 0;s < list.length;s++) {
            var x = list[s].x;
            var y = list[s].y;
            matrix[y][x] = 1;
        }
        // PrintUtils.printMatrix(matrix);

        return matrix;
    },

    clearOneRow: function (map, row) {
        for (var i = row;i >0; i-- ) {
            for (var j = 0;j < 10;j++) {
                map[i][j] = map[i - 1][j];
            }
        }
        for (var k = 0;k < 10;k++) {
            map[0][k] = 0;
        }
    },

    clearAllRows: function (map) {
        var rowLen = map.length;
        var colLen = map[0].length;
        for (var i = 0;i < rowLen; i++) {
            for (var j = 0;j < rowLen; j++) {
                map[i][j] = 0;
            }
        }
    }


}

module.exports = MathUtils;
},{"../Vector":5,"./PrintUtils":10}],9:[function(require,module,exports){
/**
 * 
 */

var Vector = require('../Vector');
var Constants = require('../Constants');


var PaintUtils = {
    getRandomPosition: function (fromNum, toNum) {
        var x = fromNum + Math.random() * (toNum - fromNum);
        var y = fromNum + Math.random() * (toNum - fromNum);

        var roundX = x - x % (Constants.SQUARE_SIZE);
        var roundY = y - y % (Constants.SQUARE_SIZE);
        return new Vector(roundX, roundY);
    },

    getRandomColor: function () {
        var rand = Math.floor(Math.random() * 5);
        return Constants.COLOR_LIST[rand];
    },

    drawCellByPixel: function(ctx, color, pos) {
        
        ctx.fillStyle = color || '#222222';
        ctx.beginPath();
        // this.drawRoundedRect (ctx, ctx.fillStyle, ctx.fillStyle, pos.x, pos.y, Constants.SQUARE_SIZE, Constants.SQUARE_SIZE, 5);
        this.drawBrick(ctx, color, pos);
        // console.log('in draw', this.position);
        ctx.closePath();
        ctx.fill();
    },

    // 包装方法， 把坐标转化为pixel 
    drawCellByMap: function (ctx, color, MapPos) {
        var posInPixel = new Vector(MapPos.x * Constants.SQUARE_SIZE, MapPos.y * Constants.SQUARE_SIZE);
        this.drawCellByPixel(ctx, color, posInPixel);
    },

    drawRoundedRect : function (ctx, strokeStyle, fillStyle, cornerX, cornerY, width, height, cornerRadius) {
        // console.log('in drawCell', ctx, strokeStyle, fillStyle, cornerX, cornerY, width, height, cornerRadius);
        ctx.beginPath();
        this.roundedRect (ctx, cornerX, cornerY, width, height, cornerRadius);
        ctx.strokeStyle = strokeStyle;

        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 0;
        ctx.fillStyle = fillStyle;
        ctx.stroke();
        ctx.fill();
    },

    drawBrick: function (ctx, color, pos) {
        ctx.fillStyle = color || '#222222';
        ctx.lineWidth=2;
        ctx.strokeStyle = '#57585a';
        ctx.beginPath();
        ctx.strokeRect(pos.x + 0.1, pos.y + 0.1,Constants.SQUARE_SIZE - 0.2, Constants.SQUARE_SIZE - 0.2 );
        // ctx.globalAlpha=0.3;
        ctx.fillRect(pos.x, pos.y, Constants.SQUARE_SIZE, Constants.SQUARE_SIZE);
        // ctx.globalAlpha=0.5;
        ctx.fillRect(pos.x + 5, pos.y + 5, Constants.SQUARE_SIZE - 10, Constants.SQUARE_SIZE - 10);
        ctx.closePath();
        ctx.fill();
    },

    // draw round rect
    roundedRect : function (ctx, cornerX, cornerY, width, height, cornerRadius) {
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
    },

    ifInBoundry: function (pos) {
        var flag = true;
        if (pos.x < 0 || pos.x > Constants.GAMESCENE_WIDTH) flag = false;
        if (pos.y < 0 || pos.y >= Constants.GAMESCENE_HEIGHT) flag = false;
        // console.log(' IN BOUNDRY', pos.x, flag);
        return flag;
    },

    isTetrominoInBoundry: function (posList) {
        
        var flag = true;
        var len = posList.length;
        for (var i = 0;i < len; i++) {
            if (!this.ifInBoundry(posList[i])) {
                return false;
            }
        }
        // console.log('in boundry', posList, flag);
        return flag;
    }

}

module.exports = PaintUtils;
},{"../Constants":1,"../Vector":5}],10:[function(require,module,exports){
var PrintUtils = {

    printMatrix: function (matrix) {
        console.log('-------------matrix start--------------');
        for (var i = 0; i < matrix.length; i++) {
            var row = '';
            for (var j = 0; j < matrix[0].length; j++) {
                row += matrix[i][j] + ' ';
            }
            
            console.log(row);
        }
        console.log('-------------matrix end--------------');
    },

    printColInMatrix: function (matrix, col) {
        console.log('-------------matrix start--------------');
        var row = '';
        
        for (var i = 0; i < matrix.length; i++) {
            
            for (var j = 0; j < matrix[0].length; j++) {
                if (j === col) row += matrix[i][j] + ', ';
            }
            
        }
        console.log(row);
        console.log('-------------matrix end--------------');
    },
}

module.exports = PrintUtils;
},{}],11:[function(require,module,exports){
var Utils = {
    getRandomElement: function (elems) {
        var len = elems.length;
        var rand = Math.floor(Math.random() * len);
        return elems[rand];
    },

    getRandomNum: function (fromNum, toNum) {
        var x = fromNum + Math.floor(Math.random() * (toNum - fromNum));
        return x;
    }

};

module.exports = Utils;
},{}]},{},[6]);
