import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

let container;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let inputImage;

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 500;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 80;

container = document.createElement('div');
document.body.appendChild(container);

const renderer = new THREE.WebGLRenderer({
    container,
    antialias: true,
    clearAlpha: 1,
    sortObjects: false,
    sortElements: false
});

var lineHolder = new THREE.Object3D();
scene.add(lineHolder);

window.addEventListener('resize', onWindowResize, false);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//document.body.appendChild(VRButton.createButton(renderer));

// Lights

// const ambientLight = new THREE.AmbientLight(0xFFC0CB, 1);
// ambientLight.castShadow = true;
// ambientLight.physicallyCorrectLights = true;
// scene.add(ambientLight);

// const spotLight = new THREE.SpotLight(0xffffff, 2);
// spotLight.castShadow = true;
// spotLight.position.set(12, 64, 32);
// spotLight.physicallyCorrectLights = true;
// scene.add(spotLight);

scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(3, 6, 0);
light.castShadow = true;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = - 2;
light.shadow.camera.right = 2;
light.shadow.camera.left = - 2;
light.shadow.mapSize.set(4096, 4096);
scene.add(light);

// Painting

// const paintGeometry = new THREE.BoxGeometry(50, 50, 1);
// paintGeometry.antialias = true;
// const paintTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/nb/main/src/weOpMin.jpg');
// const paintMaterial = new THREE.MeshBasicMaterial({ map: paintTexture });
// paintMaterial.metalness = 0.5;
// paintMaterial.roughness = 1;
// const paintMesh = new THREE.Mesh(paintGeometry, paintMaterial);
// scene.add(paintMesh);

function readImage(path) {
    var reader = new THREE.FileLoader();
    reader.load('https://raw.githubusercontent.com/GanyuHail/paintlines/main/src/weOpMin.jpg');
    reader.onload = function (event) {
        onImageLoaded(reader.result);
    };
    reader.readAsDataURL(this.files[0]);
}
readImage;

function onImageLoaded(path) {

    inputImage = new Image();
    inputImage.src = path;

    inputImage.onload = function () {
        lines();
    };
}

function lines(image) {
    imageWidth = inputImage.width;
    imageHeight = inputImage.height;
    canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    context = canvas.getContext('2d');
    context.drawImage(inputImage, 0, 0);
    pixels = context.getImageData(0, 0, imageWidth, imageHeight).data;

    createLines();
}

function createLines() {

    container.appendChild(renderer.domElement);

    var x = 0, y = 0;

    if (lineGroup)
        scene.removeObject(lineGroup);

    lineGroup = new THREE.Object3D();

    material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 2,
        linewidth: 2,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        vertexColors: true
    });

    // go through the image pixels
    for (y = 0; y < imageHeight; y += 5) {
        var geometry = new THREE.Geometry();
        for (x = 0; x < imageWidth; x += 5) {
            var color = new THREE.Color(getColor(x, y));
            var brightness = getBrightness(color);
            var posn = new THREE.Vector3(x - imageWidth / 2, y - imageHeight / 2, -brightness * 100 + 100 / 2);
            geometry.vertices.push(new THREE.Vertex(posn));
            geometry.colors.push(color);
        }
        //add a line
        var line = new THREE.Line(geometry, material);
        lineGroup.addChild(line);
    }

    lineHolder.addChild(lineGroup);
}

function render() {

    // lineHolder.scale = new THREE.Vector3(2,2,2);

    // var xrot = mouseX/_stageWidth * Math.PI*2 + Math.PI;
    // var yrot = mouseY/_stageHeight* Math.PI*2 + Math.PI;

    // lineHolder.rotation.x += (-yrot - lineHolder.rotation.x) * 0.3;
    // lineHolder.rotation.y += (xrot - lineHolder.rotation.y) * 0.3;

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
