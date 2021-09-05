import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Algorithm } from "./Algorithm";

window.THREE = THREE;

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Texture Loading
 */

const textureManager = new THREE.LoadingManager();
textureManager.onLoad = () => {
  console.log("loaded");
};

const textureLoader = new THREE.TextureLoader(textureManager);

// const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
// const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
// const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
// const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
// const gradientsTexture = textureLoader.load("/textures/gradients/3.jpg");
// // In using this gradient texture on the MeshToonMaterial, if we use the default
// // behavior mipmapping behavior then we lose the gradient levels provided by the
// // image because values in between are interpolated. Using NearestFilter and
// // turning mipmaps off maintains the cartoon shaded look.
// gradientsTexture.minFilter = THREE.NearestFilter;
// gradientsTexture.magFilter = THREE.NearestFilter;
// gradientsTexture.generateMipmaps = false;
// const matcapsTexture = textureLoader.load("/textures/matcaps/3.png");

/**
 * Settings
 */
const settings = {
  rotationSpeed: 1,
};

gui.add(settings, "rotationSpeed").min(0).max(150).step(1);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// // Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// prettier-ignore
const vertices = [
  // On the convex hull
  [7, 3, 0],
  [3, 5, 0],
  [2, 4, 0],
  [2, 1, 0],
  [1, 1, 0],
  // Not on the convex hull
  [4, 4, 0],
  [3, 3, 0],
  [3, 4, 0],
];

// const vertices = [];
// for (let i = 0; i < 10; i++) {
//   const x = THREE.MathUtils.randFloatSpread(5);
//   const y = THREE.MathUtils.randFloatSpread(5);
//   const z = 0;
//   vertices.push([x, y, z]);
// }

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices.flat(), 3)
);

const pointMaterial = new THREE.PointsMaterial({
  color: 0x888888,
  size: 0.2,
});

const points = new THREE.Points(geometry, pointMaterial);
scene.add(points);

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Lines
// - red lines are already placed lines
// - black line is the current best guess for the new line
// - green line is the next guess

// Placed Lines
const placedLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

// For some reason the drawing is not rendered when we update the geometry in the render loop unless we do some sort of initialization on the position attribute.
// Either of these calls seem to work even though we're not actually initializing them with any point values

// Option A
// BufferGeometry#setAttribute
const placedLineGeometry = new THREE.BufferGeometry();
placedLineGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(), 3)
);

// Option B
// BufferGeometry#setFromPoints
// This calls setAttribute under the hood. That seems to be the common theme.
// https://github.com/mrdoob/three.js/blob/master/src/core/BufferGeometry.js#L282
// const placedLineGeometry = new THREE.BufferGeometry().setFromPoints([]);

const placedLine = new THREE.Line(placedLineGeometry, placedLineMaterial);
scene.add(placedLine);

// Current Best Guess Line
const currentBestGuessLineMaterial = new THREE.LineBasicMaterial({
  // Need a non-black background for black line to work
  // color: 0x000000,
  color: 0xffffff,
});
const currentBestGuessLineGeometry = new THREE.BufferGeometry().setFromPoints(
  []
);
const currentBestGuessLine = new THREE.Line(
  currentBestGuessLineGeometry,
  currentBestGuessLineMaterial
);
scene.add(currentBestGuessLine);

// Next Guess Line
const nextGuessLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const nextGuessLineGeometry = new THREE.BufferGeometry().setFromPoints([]);
const nextGuessLine = new THREE.Line(
  nextGuessLineGeometry,
  nextGuessLineMaterial
);
scene.add(nextGuessLine);

// /**
//  * Lights
//  */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 8;

gui.add(camera.position, "x").min(0).max(20).step(0.1);
gui.add(camera.position, "y").min(0).max(20).step(0.1);
gui.add(camera.position, "z").min(0).max(20).step(0.1);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target = new THREE.Vector3(4, 4, 0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

/**
 * Algorithm
 */
const algorithm = new Algorithm(vertices);

/**
 * Tick
 */
let lastSecond = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  const currentSecond = Math.trunc(elapsedTime * 3);
  if (currentSecond > lastSecond) {
    lastSecond = currentSecond;

    if (!algorithm.done) {
      const result = algorithm.next();

      // Update placed line
      const points = result.convexHull.map(
        (point) => new THREE.Vector3(...point)
      );
      placedLine.geometry.setFromPoints(points);

      // Update current best guess line
      const currentPoint = result.convexHull[result.convexHull.length - 1];
      currentBestGuessLine.geometry.setFromPoints([
        new THREE.Vector3(...currentPoint),
        new THREE.Vector3(...result.currentBest),
      ]);

      // Update next guess line
      nextGuessLine.geometry.setFromPoints([
        new THREE.Vector3(...currentPoint),
        new THREE.Vector3(...result.checkingCopy.toArray()),
      ]);

      debugger;
      console.log(placedLine);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
