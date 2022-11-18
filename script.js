
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 500;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 80;

container = document.createElement('div');
document.body.appendChild(container);

const renderer = new THREE.WebGLRenderer({
    container, antialias: true
});

window.addEventListener('resize', onWindowResize, false);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Lights

const ambientLight = new THREE.AmbientLight(0xFFC0CB, 1);
ambientLight.castShadow = true;
ambientLight.physicallyCorrectLights = true;
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.castShadow = true;
spotLight.position.set(12, 64, 32);
spotLight.physicallyCorrectLights = true;
scene.add(spotLight);

// Painting

const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
paintGeometry.antialias = true;
const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
const paintMaterial = new THREE.MeshBasicMaterial({ map: paintTexture });
paintMaterial.metalness = 0.5;
paintMaterial.roughness = 1;
const paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
scene.add(paintMesh);

paintGeometry.userData = { URL: "https://github.com/GanyuHail/nb/blob/main/src/weOpMin.jpg" };

// Raycaster

// const raycaster = new THREE.Raycaster();
// const pointer = new THREE.Vector2();

// window.addEventListener('pointermove', onPointerMove);
// window.addEventListener('click', onMouseDown);
// window.addEventListener('touchend', touchEnd);
// console.log(onMouseDown);

// function onPointerMove(event) {
//   if (selectedObject) {
//     selectedObject.material.color.set('white');
//     selectedObject = null;
//   }

//   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(pointer, camera);
//   const intersects = raycaster.intersectObjects(scene.children, true);

//   for (let i = 0; i < intersects.length; i++) {
//     const intersect = intersects[i];

//     if (intersect && intersect.object) {
//       selectedObject = intersect.object;
//       intersect.object.material.color.set('pink');
//     }
//   }
// };

// function onMouseDown(event) {
//   if (selectedObject) {
//     window.location.href = "/nb/page2.html";
//   }
// };

// function touchEnd(event) {
//   if (selectedObject) {
//     window.location.href = "/nb/page2.html";
//   }
// };

function render() {

    renderer.render(scene, camera);
};

window.requestAnimationFrame(render);

// Orbit Controls 

const controls = new OrbitControls(camera, renderer.domElement);

const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};
animate();

renderer.setAnimationLoop(function () {
    renderer.render(scene, camera);
});

// Resize

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
