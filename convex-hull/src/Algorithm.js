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
    if (this.done) {
      throw new Error(
        "Algorithm.next called on a finished Algorithm. Check Algorithm.done before calling next."
      );
    }

    const { value, done } = this.generator.next();
    this.done = done;
    return value;
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
      if (i > this.vertices.length ** 2 + 1) {
        throw new Error(
          "Too many iterations? Stopping execution to preventing potential infinite loop."
        );
      }
      this.convexHull[i] = this.leftMostPoint;
      currentBest = this.vertices[0];

      for (let j = 0; j < this.vertices.length; ++j) {
        const checking = new THREE.Vector2(...this.vertices[j]);
        const mostRecentConvexHullPoint = new THREE.Vector2(
          ...this.convexHull[this.convexHull.length - 1]
        );

        // Make a copy to preserve the original checking vector.
        const checkingVector = new THREE.Vector2().copy(checking);
        checkingVector.sub(mostRecentConvexHullPoint);
        const currentBestVector = new THREE.Vector2(...currentBest).sub(
          mostRecentConvexHullPoint
        );

        const checkingIsBetter = currentBestVector.cross(checkingVector) > 0;

        yield {
          convexHull: this.convexHull,
          nextGuess: [...checking.toArray(), 0],
          currentBest,
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
      this.leftMostPoint = currentBest;
    } while (
      !new THREE.Vector2(...currentBest).equals(
        new THREE.Vector2(...this.convexHull[0])
      )
    );

    return {
      convexHull: this.convexHull,
      nextGuess: null,
      currentBest: null,
    };
  }
}
