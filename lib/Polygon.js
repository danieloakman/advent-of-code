'use strict';
const Vector2 = require('./Vector2');

module.exports = class Polygon {
  /**
   * @param {Vector2[]} vertices 
   */
  constructor (vertices) {
    this.vertices = vertices;
  }

  /**
   * 
   * @param {Vector2[]} vertices 
   * @param {number} index 
   * @returns {import('./Line')}
   */
  static sides (vertices, index = -1) {
    if (vertices.length < 2)
      return null;
    if (index <= vertices.length && index > -1) {
      const Line = require('./Line');
      return new Line(vertices[index], vertices[(index + 1) % vertices.length]);
    } else
      return vertices.map((_, i) => module.exports.sides(vertices, i));
  }

  *[Symbol.iterator] () {
    yield *this.vertices;
  }

  /** @returns The outer most bounds of this polygon. */
  get bounds () {
    if (!this.vertices.length)
      return { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity };
    const bounds = {
      xMin: this.vertices[0].x, xMax: this.vertices[0].x,
      yMin: this.vertices[0].y, yMax: this.vertices[0].y
    };
    for (let i = 1; i < this.vertices.length; i++) {
      if (bounds.xMin > this.vertices[i].x)
        bounds.xMin = this.vertices[i].x;
      if (bounds.xMax < this.vertices[i].x)
        bounds.xMax = this.vertices[i].x;
      if (bounds.yMin > this.vertices[i].y)
        bounds.yMin = this.vertices[i].y;
      if (bounds.yMax < this.vertices[i].y)
        bounds.yMax = this.vertices[i].y;
    }
    return bounds;
  }

  /**
   * @returns The mid point of this polygon's bounds. To calculate the actual mid point
   * of any polygon is quite involved, so a possible todo in the future.
   */
  get midPoint () {
    const bounds = this.bounds;
    return new Vector2((bounds.xMin + bounds.xMax) / 2, (bounds.yMin + bounds.yMax) / 2);
  }

  /** @returns The area of this polygon. May be negative depending on winding of this.vertices. */
  get area () {
    let area = 0;
    if (this.vertices.length < 3)
      return area;
    const first = this.vertices[0];
    for (let i = 1; i < this.vertices.length; i++) {
      const edge1 = first.copy.sub(this.vertices[i - 1]);
      const edge2 = first.copy.sub(this.vertices[i]);
      area += ((edge1.x * edge2.y) - (edge1.y * edge2.x));
    }
    return area / 2;
  }

  /** @returns True if clockwise, false if anti-clockwise. */
  get winding () {
    return this.area() > 0;
  }

  /** @returns A deep copy of this polygon. */
  get copy () {
    return new Polygon(this.vertices);
  }

  toJSON () {
    return this.vertices.map(v => v.toJSON());
  }

  toString () {
    return JSON.stringify(this.toJSON());
  }

  /** @returns Array of 2 element number arrays. */
  toArray () {
    return this.vertices.map(v => v.toArray());
  }

  /**
   * Removes any duplicate vertices that are one after another.
   * @returns This polygon after cleaning.
   */
  clean () {
    for (let i = this.vertices.length - 1; i > 0; i--)
      if (this.vertices[i].equalTo(this.vertices[i - 1]))
        this.vertices.splice(i, 1);
    return this;
  }

  translate (vector) {
    this.vertices.forEach(vertex => vertex.add(vector));
    return this;
  }

  rotate (angle, origin = this.midPoint) {
    this.vertices.forEach(vertex => vertex.rotate(angle, origin));
    return this;
  }

  scale (vector) {
    const offset = this.midPoint;
    this.vertices.forEach(vertex => vertex.mult(vector));
    offset.sub(this.midPoint);
    return this.translate(offset);
  }

  sides (index = -1) {
    return Polygon.sides(this.vertices, index);
  }

  /**
   * @param {number} index The index of the vertex to return.
   * @returns Returns the vertex at the index position of this.vertices. If index is negative, the nth
   * element from the end of this.vertices is returned.
   */
  nth (index) {
    return index >= 0
      ? this.vertices[index]
      : this.vertices[this.vertices.length + index];
  }

  /**
   * @param {Vector2} vector The vector to test.
   * @returns Returns true if vector is inside of this polygon, false if not.
   */
  contains (vector) {
    if (this.vertices.length < 3)
      return false;
    const Line = require('./Line');
    const line = new Line(vector, vector.copy.add(9e9, 0));
    // Count how many intersections there are with a line that starts at vector and ends
    // effectively an infinite distance away:
    let intersections = 0;
    for (const side of this.sides())
      if (line.intersect(side))
        intersections++;
    // The vector is inside of this polygon if the number of intersections is odd:
    return intersections % 2 === 1;
  }

  /**
   * @param {Polygon} polygon 
   */
  equalTo (polygon) {
    return polygon && polygon.vertices && polygon.vertices.length === this.vertices.length &&
      this.vertices.every((vertex, i) => vertex.equalTo(polygon.vertices[i]));
  }
};
