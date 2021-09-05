import * as THREE from "three";

export class Algorithm {
  constructor(vertices) {
    // S
    this.vertices = vertices;

    // P[0]
    this.leftMostPoint = this.#calculateLeftMostPoint(this.vertices);

    // P
    this.convexHull = [];

    // Initialize the generator
    this.generator = this.compute();
    this.done = false;
  }

  #calculateLeftMostPoint(vertices) {
    const leftMostPoint = vertices.reduce((acc, cur) => {
      // If the current left-most x coordinate is less than than the one we're looking at
      if (cur[0] < acc[0]) {
        // The current coordinate is the left-most x coordinate.
        return cur;
      }
      return acc;
    }, vertices[0]);
    return leftMostPoint;
  }

  // Run algorithm to next iteration
  next() {
    return this.generator.next().value;
  }

  // Run algorithm to completion and returns the result
  finish() {
    let result;
    while (!this.done) {
      const { done, value } = this.generator.next();
      this.done = done;
      result = value;
    }
    return result;
  }

  *compute() {
    let i = 0;
    let currentBest;
    do {
      if (i >= 6) {
        return null;
      }
      this.convexHull[i] = this.leftMostPoint;
      currentBest = this.vertices[0];

      for (let j = 0; j < this.vertices.length; ++j) {
        const checking = new THREE.Vector2(...this.vertices[j]);
        const mostRecentConvexHullPoint = new THREE.Vector2(
          ...this.convexHull[this.convexHull.length - 1]
        );

        const checkingVector = checking.sub(mostRecentConvexHullPoint);
        const currentBestVector = new THREE.Vector2(...currentBest).sub(
          mostRecentConvexHullPoint
        );

        const checkingIsBetter = currentBestVector.cross(checkingVector) > 0;
        // debugger;
        yield {
          convexHull: this.convexHull,
          checking,
          currentBest,
          currentBestVector,
          checkingVector,
        };

        if (
          new THREE.Vector2(...currentBest).equals(
            new THREE.Vector2(...this.leftMostPoint)
          ) ||
          checkingIsBetter
        ) {
          currentBest = this.vertices[j];
        }
      }
      i++;
      // this.convexHull[i] = currentBest;
      this.leftMostPoint = currentBest;
    } while (
      !new THREE.Vector2(...currentBest).equals(
        new THREE.Vector2(...this.convexHull[0])
      )
    );

    return this.convexHull;
  }
}
