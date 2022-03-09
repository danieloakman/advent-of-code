"use strict";

const Vector2 = require("./Vector2");
const { toDegrees, toRadians } = require("./utils");
const Polygon = require("./Polygon");

const RADIANS_180 = toRadians(180);

module.exports = class Line extends Polygon {
  get length () {
    return this[0].distanceTo(this[1]);
  }

  get 0 () {
    return this.vertices[0];
  }

  set 0 (value) {
    this.vertices[0] = value;
  }

  get 1 () {
    return this.vertices[1];
  }

  set 1 (value) {
    this.vertices[1] = value;
  }

  /** @returns A deep copy of this instance of Line. */
  get copy () {
    return new Line(this.vertices);
  }

  /** @returns This line after its points have been swapped. */
  get swap () {
    const temp = this[0];
    this[0] = this[1];
    this[1] = temp;
    return this;
  }

  /**
   * The sign represents the direction of the line: negative is in the direction of negative
   * coordinates, positive is in the direction of positive coordinates. So normally this would be
   * negative is right to left, positive is left to right.
   * The number value represents the actual steepness of the gradient. So 0 is a flat horizontal
   * line and Infinity is a straight vertical line.
   */
  get gradient () {
    const result = (this[1].y - this[0].y) / (this[1].x - this[0].x);
    return isNaN(result) ? 0 : result;
  }

  toJSON () {
    return [this[0].toJSON(), this[1].toJSON()];
  }

  /**
   * @param {Line} other
   * @returns {boolean}
   */
  intersect (other) {
    const determinant = (this[1].x - this[0].x) *
      (other[1].y - other[0].y) -
      (other[1].x - other[0].x) *
        (this[1].y - this[0].y);
    if (determinant !== 0) {
      // An intersection may exist, so now check that the intersection
      // lies between both lines.
      const unitsLineA = ((other[1].y - other[0].y) *
        (other[1].x - this[0].x) +
        (other[0].x - other[1].x) *
          (other[1].y - this[0].y)) / determinant;
      const unitsLineB = ((this[0].y - this[1].y) *
        (other[1].x - this[0].x) +
        (this[1].x - this[0].x) *
          (other[1].y - this[0].y)) / determinant;
      // Any value of unitsLineA or B that is not between 0 and 1, indicates that
      // there is no intersection.
      if ((unitsLineA > 0 && unitsLineA < 1) && (unitsLineB > 0 && unitsLineB < 1)) {
        return new Vector2.default(this[0].x + unitsLineA * (this[1].x - this[0].x), this[0].y + unitsLineA * (this[1].y - this[0].y));
      }
    }

    // There may be an intersection right on lineB as
    if (this.liesOver(other[0]))
      return other[0];
    else if (this.liesOver(other[1]))
      return other[1];
    if (other.liesOver(this[0]))
      return this[0];
    else if (other.liesOver(this[1]))
      return this[1];
    return null;
  }

  /**
   * @param {Line} other 
   */
  angleTo (other) {
    let result = Math.abs(Math.atan2(this[1].y - this[0].y, this[1].x - this[0].x) -
      Math.atan2(other[1].y - other[0].y, other[1].x - other[0].x));
    if (result > RADIANS_180)
      result %= RADIANS_180;
    return Math.abs(result);
  }

  /**
   * @param {Vector2} vector The vector to check if it's collinear with this line. Must either be
   * an instance of Vector2 or be compatible with it's constructor.
   * @return Returns true if the vector is collinear with this line. Collinear means
   * lying in the same straight line.
   */
  isCollinear (vector) {
    return (this[1].y - this[0].y) * (this[0].x - vector.x) ===
      (this[0].y - vector.y) * (this[1].x - this[0].x);
  }

  /**
   * @param {Vector2} vector The vector to check if it lies on this line. Must either be an
   * instance of Vector2 or be compatible with it's constructor.
   * @return Returns true if the vector lies anywhere on this line.
   */
  liesOver (vector) {
    return vector.x <= Math.max(this[0].x, this[1].x) &&
      vector.x >= Math.min(this[0].x, this[1].x) &&
      vector.y <= Math.max(this[0].y, this[1].y) &&
      vector.y >= Math.min(this[0].y, this[1].y);
  }

  /**
   * @param {Vector2} distance See example for valid uses of this parameter.
   * @returns Returns this line stretched by some distance. The length of this line will be
   * increased by whatever distance is, so `stretch(5, 2)` will increase the length by 7.
   * @example
   *  line.stretch(5); // Moves point 1 and 2 by 5 in opposite direction of each other.
   *  line.stretch(5, 0); // Moves only point 1 by 5.
   *  line.stretch(0, 5); // Moves only point 2 by 5.
   *  line.stretch(7, 4); // Moves point 1 by 7 and point 2 by 4. The length will be increased by 11.
   *  line.stretch(new Vector2(11, 12)) Moves point1 by 11 and point2 by 12.
   */
  stretch (distance) {
    const direction0to1 = this[0].directionTo(this[1]);
    const direction1to0 = direction0to1.copy.mult(-1);
    this[0].add(direction1to0.mult(distance[0]));
    this[1].add(direction0to1.mult(distance[1]));
    return this;
  }
  /**
   * Find the point of intersection with the X axis at `x`. This is the same as doing
   * `intersect(x, -9e9, x, 9e9)` but considerably more efficient.
   * @param {number} x The x axis number.
   * @returns The vector/point at which x intersects with this line, or null if no
   * intersection exists.
   */
  intersectAtX (x) {
    const { xMin, xMax } = this.bounds;
    if (x < xMin || x > xMax)
      return null; // x is not within the bounds of this line.
    const t = (x - xMin) / (xMax - xMin);
    return Vector2.lerp(this[0], this[1], t);
  }
  /**
   * Find the point of intersection with the Y axis at `y`. This is the same as doing
   * `intersect(-9e9, y, 9e9, y)` but considerably more efficient.
   * @param {number} y The y axis number.
   * @returns The vector/point at which y intersects with this line, or null if no
   * intersection exists.
   */
  intersectAtY (y) {
    const { yMin, yMax } = this.bounds;
    if (y < yMin || y > yMax)
      return null; // y is not within the bounds of this line.
    const t = (y - yMin) / (yMax - yMin);
    return Vector2.lerp(this[0], this[1], t);
  }
};
