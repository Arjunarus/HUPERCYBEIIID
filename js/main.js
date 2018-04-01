"use strict"

var scene = new THREE.Scene();
var WIDTH = 1, HEIGHT = 1;
var camera = new THREE.PerspectiveCamera(20, WIDTH / HEIGHT, 0.1, 1000);
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer({ antialias: true });
// var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor("#111");
renderer.setSize(WIDTH, HEIGHT);
document.body.replaceChild(renderer.domElement, document.getElementById("renderer"));

var light = new THREE.PointLight(0xaaffff);
light.position.set(-10, 40, 0);
scene.add(light);

onWindowResize();

// - - -

var SIZE = 26;
var TICKRATE, CUBESPEED;

class Cube {
  // Numbers[], positions[][3]
  // THREE.cube
  Cube() {
    // generate Numbers
  }
  Cube(x, y, z) { }
  getCoordinates() { }
  getNextCoordinates() { }
  move() { }
}
class Hypercube { // cube manager & dispatcher
  // cubes[SIZE][SIZE][SIZE]
  // bridgeCube
  Hypercube(fullness) {
    // … 
    // addBridge
  }
  isMoveble(cube) { }
  move(cube) { }
  findPath() { }
  // draw() ← :/
}

// - - -

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({ color: "#433F81" });
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  WIDTH = window.innerWidth, HEIGHT = 480;
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);

  var speed = document.getElementById("btnReset").offsetLeft + document.getElementById("btnReset").clientWidth - document.getElementById("btnSpeed").offsetLeft;
  document.getElementById("btnSpeed").style.width = speed + 'px';

  var h = window.innerHeight;
  h -= document.getElementById("logo").offsetHeight;
  h -= document.getElementsByTagName("canvas")[0].offsetHeight;
  h -= document.getElementById("panel").offsetHeight;
  h -= 10 * 4 * 2; // #badtrick
  document.getElementById("log").style.height = h + 'px';
}
var render = function () {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
};

render();


  // todo: add new UI.*
  // fix h