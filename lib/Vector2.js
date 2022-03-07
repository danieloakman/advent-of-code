'use strict';

const { toRadians } = require('./utils');

const RADIANS_360 = toRadians(360);
const RADIANS_450 = toRadians(450);

module.exports = class Vector2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor (x, y) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
  }

  *[Symbol.iterator] () {
    yield this.x;
    yield this.y;
  }

  /** Shorthand for new Vector(1, 0). */
  static get x () {
    return new Vector2(1, 0);
  }

  /** Shorthand for new Vector(0, 1). */
  static get y () {
    return new Vector2(0, 1);
  }

  /** Shorthand for new Vector(1, 1), new Vector(1). */
  static get one () {
    return new Vector2(1, 1);
  }

  /** Shorthand for new Vector(0, 0), new Vector(0). */
  static get zero () {
    return new Vector2(0, 0);
  }

  /** Shorthand for new Vector(0, -1). */
  static get up () {
    return new Vector2(0, -1);
  }

  /** Shorthand for new Vector(0, 1). */
  static get down () {
    return new Vector2(0, 1);
  }

  /** Shorthand for new Vector(1, 0). */
  static get right () {
    return new Vector2(1, 0);
  }

  /** Shorthand for new Vector(-1, 0). */
  static get left () {
    return new Vector2(-1, 0);
  }

  /**
   * @param {Vector2} vectorA
   * @param {Vector2} vectorB
   * @returns {number} The distance between vectorA and VectorB. */
  static distance (vectorA, vectorB) {
    return vectorA.distanceTo(vectorB);
  }

  /**
   * Linearly interpolates between two points.
   * @param {Vector2} vectorA The first vector.
   * @param {Vector2} vectorB The second vector.
   * @param {number} interpolant Any decimal number.
   * @return The vector at some fraction between vectorA and vectorB if is between 0 and 1. For
   * interpolant values greater than 1 and less than 0, the point will still be collinear with
   * the line vectorA->vectorB.
   * For example:
   * - If interpolant is 0 then returns vectorA.
   * - If 1 then returns vectorB.
   * - If 0.5 then returns the mid way point between the two.
   * - If 2 then returns a point on the same line as vectorA->vectorB but the distance of the line
   * away from vectorB. Same thing with -1 but will be on the side of vectorA instead.
   */
  static lerp (vectorA, vectorB, interpolant) {
    return new Vector2(
      vectorA.x * (1 - interpolant) + vectorB.x * interpolant,
      vectorA.y * (1 - interpolant) + vectorB.y * interpolant
    );
  }

  get 0 () {
    return this.x;
  }

  get 1 () {
    return this.y;
  }

  get copy () {
    return new Vector2(this.x, this.y);
  }

  get mag () {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get norm () {
    return this.x === 0 && this.y === 0
      ? this // Handle special case 0,0 as dividing by it's magnitude will return NaN.
      : this.div(this.copy.mag);
  }

  toString () {
    return `{"x":${this.x},"y":${this.y}}`;
  }

  toArray () {
    return [this.x, this.y];
  }

  toJSON () {
    return { x: this.x, y: this.y };
  }

  /**
   * @param {Vector2} other
   */
  add (other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * @param {Vector2} other
   */
  sub (other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * @param {Vector2} other
   */
  mult (other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * @param {Vector2} other
   */
  div (other) {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  /**
   * @param {Vector2} other
   */
  mod (other) {
    this.x %= other.x;
    this.y %= other.y;
    return this;
  }

  /**
   * @param {Vector2} other
   */
  pow (other) {
    this.x **= other.x;
    this.y **= other.y;
    return this;
  }

  /** @returns This vector with both axes as absolute values. */
  abs () {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  /**
   * @param {Vector2} other
   */
  isEqual (other) {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * @param {Vector2} other
   */
  distanceTo (other) {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  /**
   * TODO
   * @param decimalPlaces Optional, the number of decimal places the number is to be
   * rounded to (default: 0).
   * @returns This vector with both axes rounded to 'precision' number of decimal places.
   */
  round (decimalPlaces = 0) {
    this.x = round(this.x, decimalPlaces);
    this.y = round(this.y, decimalPlaces);
    return this;
  }

  /** @returns This vector after both axes having been passed through `Math.floor`. */
  floor () {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /** @returns This vector after both axes having been passed through `Math.ceil`. */
  ceil () {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  /**
   * TODO
   * @param decimalPlaces Optional, the number of decimal places the number is to be
   * truncated to (default: 0).
   * @returns This vector with both axes truncated to 'precision' number of decimal places.
   */
  trunc (decimalPlaces = 0) {
    this.x = parseFloat(truncateDecimals(this.x, decimalPlaces));
    this.y = parseFloat(truncateDecimals(this.y, decimalPlaces));
    return this;
  }

  /**
   * @param {Vector2} other
   */
  dot (other) {
    return (this.x * other.x) + (this.y * other.y);
  }

  /**
   * @param {Vector2} other The other vector.
   * @returns The positive angle between this vector and other. This is in radians by
   * default. It will only return a positive number from 0 (inclusive) to 360 (exclusive) or the
   * equivalent in radians. From this vector, another vector that is directly up would be 0
   * degrees, directly right is 90, down is 180, left is 270. The returned angle is never negative.
   */
  angleTo (other) {
    const result = Math.atan2(other.y - this.y, other.x - this.x);
    return (RADIANS_450 + result) % RADIANS_360;
  }

  /**
   * Rotates this vector around an origin point.
   * @param {number} angle Radian angle.
   * @param {Vector2} origin Optional, the origin point from which this vector is
   * rotated around (default: Vector2.zero).
   * @returns This vector after rotation.
   */
  rotate (angle, origin = Vector2.zero) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    // Translate vector back to origin:
    const xo = this.x - origin.x;
    const yo = this.y - origin.y;
    // Rotate vector, then translate it back:
    this.x = (xo * c - yo * s) + origin.x;
    this.y = (xo * s + yo * c) + origin.y;
    return this.round(5);
  }

  /**
   * @returns This vector with 1 or -1 in each axis representing positive or negative for
   * that axis.
   * @example
   *  const a = new Vector2(-5, 50).sign() // { x: -1, y: 1 }
   */
  sign () {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    return this;
  }

  /**
   * @template T
   * @param {(x: number, y: number) => T} func The function that is used on this vector's x and y.
   * @returns {T} The value returned in the func parameter.
   */
  reduce (func) {
    return func(this.x, this.y);
  }

  /**
   * @param {Vector2} other The other vector.
   * @returns {Vector2} A new Vector2 representing the direction to another vector. This is the
   * normalised vector of (other - this).
   */
  directionTo (other) {
    return other.copy.sub(this).norm;
  }
};
