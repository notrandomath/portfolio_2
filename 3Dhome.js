import * as THREE from './three/build/three.module.js';
import TWEEN from './three/addons/libs/tween.module.js';
import { OrbitControls } from './three/addons/controls/OrbitControls.js';
import { FontLoader } from './three/addons/loaders/FontLoader.js';
import { TextGeometry } from './three/addons/geometries/TextGeometry.js';
import { OutlinePass } from './three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';

console.log('threejs loaded');

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 100 );

const controls = new OrbitControls( camera, renderer.domElement );

const scene = new THREE.Scene();

const matFloor = new THREE.MeshPhongMaterial( { color: 0x9ba9b8 } );
const geoFloor = new THREE.PlaneGeometry( 100, 100 );
const mshFloor = new THREE.Mesh( geoFloor, matFloor );
mshFloor.rotation.x = - Math.PI * 0.5;

const loader = new FontLoader();
loader.load('src/Bangers_Regular.json', function(font) {
    
    const text = new TextGeometry('Omar Yahia', {
        font: font,
        size: 0.3,
        height: 0.1,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelSegments: 1
    });
    const text2 = new TextGeometry('Portfolio', {
      font: font,
      size: 0.3,
      height: 0.1,
      depth: 0.1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelSegments: 1
  });
  const textOutline = new TextGeometry('Omar Yahia', {
    font: font,
    size: 0.3,
    height: 0.1,
    depth: 0.09,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0.02, // size of border
    bevelOffset: 0,
    bevelSegments: 1
});
  const textOutline2 = new TextGeometry('Portfolio', {
    font: font,
    size: 0.3,
    height: 0.1,
    depth: 0.09,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0.02, // size of border
    bevelOffset: 0,
    bevelSegments: 1
  });

    const matTextOutline = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const mshTextOutline = new THREE.Mesh(textOutline, matTextOutline);
    const mshText2Outline = new THREE.Mesh(textOutline2, matTextOutline);
    const matText = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mshText = new THREE.Mesh(text, matText);
    const mshText2 = new THREE.Mesh(text2, matText);
    
    
    mshText.castShadow = true;
    mshText.receiveShadow = true;
    mshText.position.set(-1, 0.6, 0);
    mshTextOutline.position.set(-1, 0.6, 0);

    mshText2.castShadow = true;
    mshText2.receiveShadow = true;
    mshText2.position.set(-0.9, 0.1, 0);
    mshText2Outline.position.set(-0.9, 0.1, 0);

    scene.add(mshText);
    scene.add(mshText2);
    scene.add(mshTextOutline);
    scene.add(mshText2Outline);
});

const ambient = new THREE.AmbientLight( 0x888888 );

const spotLight1 = createSpotlight( 0xFF00FF );
const spotLight2 = createSpotlight( 0x8800FF );
const spotLight3 = createSpotlight( 0x0000FF );

// Postprocessing setup
const composer = new EffectComposer(renderer); // renderer is your THREE.WebGLRenderer
const renderPass = new RenderPass(scene, camera); // camera is your THREE.Camera
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
composer.addPass(outlinePass);

const color = 0x000000;
// Configure outline pass (optional)
outlinePass.edgeStrength = 3;        // Adjust outline thickness
outlinePass.edgeGlow = 0.5;          // Adjust outline glow
outlinePass.visibleEdgeColor.set(color);
outlinePass.hiddenEdgeColor.set(color);

// Add the cone to the outline pass's selected objects
outlinePass.selectedObjects = [spotLight1.userData.coneMesh, spotLight2.userData.coneMesh, spotLight3.userData.coneMesh];

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Color and intensity
scene.add(ambientLight);

function init() {

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.set( 0, -5, 0 );

  spotLight1.position.set( 1.5, 4, 4.5 );
  spotLight2.position.set( 0, 4, 3.5 );
  spotLight3.position.set( - 1.5, 4, 4.5 );

  mshFloor.receiveShadow = true;
  mshFloor.position.set( 0, - 0.05, 0 );

  scene.add( mshFloor );
  scene.add( ambient );
  scene.add( spotLight1, spotLight2, spotLight3 );
  
  const container = document.getElementById("threedcontainer");
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize );
  window.addEventListener("scroll", function() {
    if (window.scrollY >= 4*window.innerHeight) {
        container.style.display = "none"; // Hide the object if scrollY > threshold
    } else {
        container.style.display = "block"; // Show the object if scrollY <= threshold
    }
});

  controls.target.set( 0, 0.5, 0 );
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.update();
  controls.dispose();

}

function createSpotlight( color ) {

  const newObj = new THREE.SpotLight( color, 10 );

  newObj.castShadow = true;
  newObj.angle = 0.3;
  newObj.penumbra = 0.2;
  newObj.decay = 2;
  newObj.distance = 50;
  newObj.power = 90;

  const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
  const coneMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
  const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
  coneMesh.geometry.rotateX( -Math.PI / 2 );

  scene.add(coneMesh);
  newObj.userData.coneMesh = coneMesh;  

  return newObj;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}

function tween( light ) {
  let dist = 0.5

  new TWEEN.Tween( light ).to( {
    // penumbra:  Math.random() < 0.5 ? (light.penumbra <= 1 ? light.penumbra + dist : light.penumbra - dist) : (light.penumbra >= 2 ? light.penumbra - dist : light.penumbra + dist),
  }, 2000 )
    .easing( TWEEN.Easing.Linear.None ).start();

  new TWEEN.Tween( light.position ).to( {
    x: Math.random() < 0.5 ? (light.position.x <= -1.5 ? light.position.x + dist : light.position.x - dist) : (light.position.x >= 1.5 ? light.position.x - dist : light.position.x + dist),
    y: Math.random() < 0.5 ? (light.position.y <= 1.5 ? light.position.y + dist : light.position.y - dist) : (light.position.y >= 2.5 ? light.position.y - dist : light.position.y + dist),
    z: Math.random() < 0.5 ? (light.position.z <= -1.5 ? light.position.z + dist : light.position.z - dist) : (light.position.z >= 1.5 ? light.position.z - dist : light.position.z + dist),
  }, 2000 )
    .easing( TWEEN.Easing.Linear.None ).start();

}

function updateTweens() {

  tween( spotLight1 );
  tween( spotLight2 );
  tween( spotLight3 );

  setTimeout( updateTweens, 1000 );

}

function animate() {

  TWEEN.update();

  [spotLight1, spotLight2, spotLight3].forEach(light => {
    if (light.userData.coneMesh) {
      const position = light.position.clone().add(light.target.position).multiplyScalar(0.5);

      light.userData.coneMesh.position.copy(position);
      light.userData.coneMesh.lookAt(light.target.position); // Aim toward the center
    }
  });

  composer.render( scene, camera );

}

init();
updateTweens();