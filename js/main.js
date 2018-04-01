"use strict"

var scene = new THREE.Scene();
var WIDTH = window.innerWidth, HEIGHT = 480;
var camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.z = 4;
// var renderer = new THREE.WebGLRenderer({ antialias: false });
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#111");
renderer.setSize(WIDTH, HEIGHT);

document.body.replaceChild(renderer.domElement, document.getElementById("renderer"));

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
  isMoveble(cube) { }
  move(cube) { }
  findPath() { }
  // draw() ← :/
}

// - - -

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: "#433F81" });
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// Render Loop
var render = function () {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

render();