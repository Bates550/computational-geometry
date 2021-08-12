import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

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
// const settings = {
//   rotationSpeed: 1,
// };

// gui.add(settings, "rotationSpeed").min(0).max(150).step(1);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const vertices = [];

for (let i = 0; i < 10; i++) {
  const x = THREE.MathUtils.randFloatSpread(5);
  const y = THREE.MathUtils.randFloatSpread(5);
  // const z = THREE.MathUtils.randFloatSpread(5);
  const z = 0;

  vertices.push(x, y, z);
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);

const material = new THREE.PointsMaterial({ color: 0x888888, size: 0.1 });

const points = new THREE.Points(geometry, material);
scene.add(points);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
