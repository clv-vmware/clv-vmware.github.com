function Vector (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;

    return new Vector(this.x, this.y);
}

Vector.prototype.minus = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
}

Vector.prototype.getMagnitude = function () {
    return Math.sqrt(x * x + y * y);
}