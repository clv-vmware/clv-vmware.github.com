/**
 * 单个方块类
 */

var Constants = require('./Constants');
var PaintUtils = require('./utils/PaintUtils');


function Square (pos) {
    this.pos = pos;
    this.color = color;
    this.size = Constants.SQUARE_SIZE;
}

Square.prototype = {

    draw : function (ctx) {
        PaintUtils.drawCell(ctx, this.color, this.pos, this.size);
    },

    move: function (v) {
        this.pos.add(v);

        return this.pos;

    },

    getPosition: function () {
        return this.pos;
    },

    getColor: function () {
        return this.color;
    },

}

module.exports = Square;