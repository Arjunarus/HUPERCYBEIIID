"use strict"

// - - - init 1/2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var scene, camera, renderer, light, controls, WIDTH = 1, HEIGHT = 1;
var SIZE = 6, TICKRATE, CUBESPEED;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(90, WIDTH / HEIGHT, 1, 200);
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial();
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 10;

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

// - - - classes - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

class Cube {
  // Numbers[], positions[][3]
  // THREE.cube
  constructor(x, y, z) {
    //if (x === undefined) x = ...; //todo
    var str = '#1122' + (Math.round(Math.random() * 140 + 50).toString(16));
    // this.drawwable = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#' + Math.round(Math.random() * 156 + 100).toString(16) + Math.round(Math.random() * 156 + 100).toString(16) + Math.round(Math.random() * 156 + 100).toString(16) }));
    this.drawwable = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: str }));
    this.drawwable.position.set(x, y, z);
    // generate Numbers

    // picking teh numbers

    this.numbers = [];
    this.route = {
      vector: [], //vector3
      position: [], //vector3
      currentIndex: 0
    }

    var xyz = [x, y, z]; // copy of args
    for (var c = 0; c < xyz.length; c++) {
      this.numbers.push([]);
      for (var i = 0; i < 3; i++) {
        this.numbers[c].push(Math.ceil(Math.random() * Math.min(9, xyz[c])));
        xyz[c] -= this.numbers[c][this.numbers[c].length - 1];
      }
    }
    // getting vectors
    this.route.vector.push(new THREE.Vector3(this.numbers[0][0] - this.numbers[0][1], this.numbers[0][1] - this.numbers[0][2], this.numbers[0][2] - this.numbers[0][0]));
    this.route.vector.push(new THREE.Vector3(this.numbers[1][0] - this.numbers[1][1], this.numbers[1][1] - this.numbers[1][2], this.numbers[1][0] - this.numbers[1][2]));
    this.route.vector.push(new THREE.Vector3(this.numbers[2][0] - this.numbers[2][1], this.numbers[2][1] - this.numbers[2][2], this.numbers[2][0] - this.numbers[2][2]));

    // getting routes
    this.route.position.push(new THREE.Vector3(x, y, z).add(this.route.vector[0]));
    this.route.position.push(this.route.position[this.route.position.length - 1].add(this.route.vector[1]));
    this.route.position.push(this.route.position[this.route.position.length - 1].add(this.route.vector[2]));
    console.log(this.route.vector);
    console.log(this.route.position);
    // todo: is error?

    // numbers :: [[int]] -> str
    for (var c = 0; c < xyz.length; c++)
      this.numbers[c] = this.numbers[c].join('') + " ";
    this.numbers = this.numbers.join('');
    // console.log([x, y, z].join(",") + " = " + this.getNumbers());
    // console.log(this);
  }
  getNumbers() {
    return this.numbers;
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
  constructor(spawnChance) {
    this.cubes = [[], [], []];
    for (var i = 1; i <= SIZE; i++) {
      for (var j = 1; j <= SIZE; j++) {
        for (var k = 1; k <= SIZE; k++) {
          if (Math.random() > spawnChance)
            continue;
          this.cubes.push(new Cube(i, j, k));
          scene.add(this.cubes[this.cubes.length - 1].drawwable);
          // todo: nearbies detection
        }
      }
    }
    this.bridgeCube = new Cube(Math.floor(SIZE / 2), Math.floor(SIZE / 2), SIZE + 1);
    this.cubes.push(this.bridgeCube); // bridge
    scene.add(this.bridgeCube.drawwable);
  }
  isMoveble(cube) { }
  move(cube) { }
  findPath() { }
}

//- - - main - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var hc = new Hypercube(0.45);

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