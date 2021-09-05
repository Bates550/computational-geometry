import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Algorithm } from "./Algorithm";
import { generateUUID } from "three/src/math/MathUtils";

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

const material = new THREE.PointsMaterial({ color: 0x888888, size: 0.1 });
material.size;

const points = new THREE.Points(geometry, material);
scene.add(points);

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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

  const currentSecond = Math.trunc(elapsedTime);
  if (currentSecond > lastSecond) {
    lastSecond = currentSecond;

    if (!algorithm.done) {
      console.log(algorithm.next());
    }
    debugger;
  }

  // Update objects

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
