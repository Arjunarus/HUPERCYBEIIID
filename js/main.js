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

function GetCubeColor()
{
    var rColor = (0x11).toString();
    var gColor = (0x22).toString();
    var bColor = Math.round(Math.random() * 140 + 50).toString();
    return "rgba(" + rColor + "," + gColor + "," + bColor + ", 255)";
}

// - - - classes - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

class Cube {
    
    static GetCoord(iteration, cubeNumber) {
        
        if (cubeNumber > 999 || cubeNumber < 0)
            throw "Incorrect cube number" + cuberNumebr;
        
        // Cube has only 3 iterations
        switch(iteration) {
            case 0:
                return cubeNumber % 10 + (cubeNumber/10) % 10 + (cubeNumber/100) % 10; 
            case 1:
                return 2 * ((cubeNumber/10) % 10) + (cubeNumber/100) % 10; 
            case 2:
                return (cubeNumber/10) % 10 + 2 *((cubeNumber/100) % 10);
            default: throw "Incorrect cuber iteration: " + iteration;
        }
    }
    
    GetCubePosition(iteration) {
        return [Cube.GetCoord(iteration, this.a),
                Cube.GetCoord(iteration, this.b),
                Cube.GetCoord(iteration, this.c)];
    }
    
    // Cube is full-described by three numbers (aaa, bbb, ccc)
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        
        this.position = this.GetCubePosition(0);
        
        this.drawable = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: GetCubeColor() }));
        this.drawable.position.set(this.position[0], this.position[1], this.position[2]);
    }
    
    getNumbers() {
        return this.numbers;
    }
    
    getCoordinates() { }
    getNextCoordinates() { }
    move() { }
    draw() { }
}

var CUBES = [[566, 472, 737],
             [656, 778, 462]
             // Add cubes here
            ]

class Shell {
    // TODO skeleton shell
    constructor() {
        this.drawable = new THREE.Mesh(new THREE.BoxGeometry(27, 27, 27), new THREE.MeshBasicMaterial())
    }
}
            
class Hypercube { 
    draw() { }
  
    constructor() {
        this.cubes = [];
        for (var i = 0; i < CUBES.length; ++i) {
            this.cubes.push(new Cube(CUBES[i][0], CUBES[i][1], CUBES[i][2]));
            scene.add(this.cubes[this.cubes.length - 1].drawable);
        }
        
        scene.add((new Shell()).drawable)
    }
    
    isMoveble(cube) { }
    move(cube) { }
    findPath() { }
}

//- - - main - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var hc = new Hypercube();

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
  //hc.cubes[hc.cubes.length-1].drawable.rotation.y += 0.01;
  //cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  //controls.update();
};

render();


  // todo: add new UI.*
  // fix h