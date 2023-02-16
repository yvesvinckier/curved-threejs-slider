import * as THREE from "three";

import img1 from "./assets/1_square.jpg";
import img2 from "./assets/2_square.jpg";

let textures = [img1, img2, img1, img2].map((url) =>
  new THREE.TextureLoader().load(url)
);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: textures[0] },
  },
  vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec3 newposition = position;
        float distanceFromCenter = abs(
            (modelMatrix * vec4(position, 1.0)).x
        );
         
        // most important
        newposition.y *= 1.0 + 0.3*pow(distanceFromCenter,2.);
          
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
      }`,
  fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main()	{
          gl_FragColor = texture2D(uTexture,vUv);
        }
       `,
});

// Mesh
for (let i = 0; i < 30; i++) {
  let m = material.clone();
  m.uniforms.uTexture.value = textures[i % 4];
  let mesh = new THREE.Mesh(geometry, m);
  mesh.position.x = (i - 15) * 1.2;
  scene.add(mesh);
}

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Resize
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

// Camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.01,
  10
);
camera.position.z = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas.webgl"),
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animation);

// animation
let time = 0;
function animation(time) {
  time += 0.001;
  scene.position.x = 3 * Math.sin(time / 2000);
  renderer.render(scene, camera);
}
