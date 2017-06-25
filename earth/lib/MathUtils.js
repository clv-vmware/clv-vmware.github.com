function Utils () {
    
}

Utils.prototype = {
     rand: function (min, max) {
        return this.lerp(Math.random(), min, max)
    },
lerp: function(ratio, start, end) {
        return start + (end - start) * ratio
    },
    doRandom: function(min, max) {
        return Math.round(this.rand(min - 0.5, max + 0.5))
    },
    headsTails : function(heads, tails) {
        return !_this.doRandom(0, 1) ? heads : tails
    },

    toDegrees : function(rad) {
        return rad * (180 / Math.PI)
    },

    toRadians : function(deg) {
        return deg * (Math.PI / 180)
    }
};