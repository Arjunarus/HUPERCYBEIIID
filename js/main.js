"use strict"

// - - - init 1/2

var scene, camera, renderer, light, controls, WIDTH = 1, HEIGHT = 1;
var SIZE = 5, TICKRATE, CUBESPEED;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(20, WIDTH / HEIGHT, 0.1, 1000);
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial();
//var material = new THREE.MeshNormalMaterial();
camera.position.set(new THREE.Vector3(SIZE / 2, SIZE / 2, 20));

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#111");
renderer.setSize(WIDTH, HEIGHT);
document.body.replaceChild(renderer.domElement, document.getElementById("renderer")); // todo: msg if !js || !webgl

light = new THREE.PointLight(0xaaffff);
light.position.set(-10, 0, 10);
scene.add(light);

window.addEventListener('resize', onWindowResize, false);
onWindowResize();

controls = new THREE.OrbitControls(camera, renderer.domElement);

// - - - classes

class Cube {
  // Numbers[], positions[][3]
  // THREE.cube
  constructor(x, y, z) {
    //if (x === undefined) x = ...;
    this.drawwable = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#' + Math.round(Math.random() * 156 + 100).toString(16) + Math.round(Math.random() * 156 + 100).toString(16) + Math.round(Math.random() * 156 + 100).toString(16) }));
    this.drawwable.position.set(x, y, z);
    // generate Numbers

    y = x;

    this.numbers = [];
    for (var i = 0; i < 3; i++) {
      this.numbers.push(Math.ceil(Math.random() * Math.min(9, x)));
      x -= this.numbers[this.numbers.length - 1];
    }
    console.log(this.numbers + ' ' + y);
  }
  getCoordinates() { }
  getNextCoordinates() { }
  move() { }
  draw() {

  }
}
class Hypercube { // cube manager & dispatcher
  // cubes[SIZE+2][SIZE+2][SIZE+2]
  // bridgeCube
  draw() { // ← :/
  }
  constructor(fullness) {
    this.cubes = [];
    for (var i = 1; i <= SIZE; i++) {
      for (var j = 1; j <= SIZE; j++) {
        for (var k = 1; k <= SIZE; k++) {
          this.cubes.push(new Cube(i, j, k));
          scene.add(this.cubes[this.cubes.length - 1].drawwable);
        }
      }
    }
    // … 
    // addBridge
  }
  isMoveble(cube) { }
  move(cube) { }
  findPath() { }
}

//- - - main

//var cube = new THREE.Mesh(geometry, material); scene.add(cube);
var hc = new Hypercube(0);


// - - - init 2/2

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
  //hc.cubes[hc.cubes.length-1].drawwable.rotation.y += 0.01;
  //cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  //controls.update();
};

render();


  // todo: add new UI.*
  // fix h