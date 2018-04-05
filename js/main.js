"use strict"

// - - - init 1/2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Settings:
const FIELD_OF_VIEW = 90;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight * 2 / 3;
const ASPECT_RATIO = WIDTH / HEIGHT;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 1000;

const SHELL_SIZE = 27;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = SHELL_SIZE * 2;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(WIDTH, HEIGHT);
document.body.replaceChild(renderer.domElement, document.getElementById("renderer")); // todo: msg if !js || !webgl

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial();

var light = new THREE.PointLight(0xaaffff);
light.position.set(-10, 0, 10);
scene.add(light);

window.addEventListener('resize', onWindowResize, false);
onWindowResize();

var controls = new THREE.OrbitControls(camera, renderer.domElement);

function GetCubeColor()
{
    let rColor = (0x11).toString();
    let gColor = (0x22).toString();
    let bColor = Math.round(Math.random() * 140 + 50).toString();
    return "rgba(" + rColor + "," + gColor + "," + bColor + ", 255)";
}

// - - - classes - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function SetItemOnScene(item, x, y, z) {
    item.position.set(x - SHELL_SIZE/2, y - SHELL_SIZE/2, z- SHELL_SIZE/2);
}

class Cube {
    
    static GetCoord(iteration, cubeNumber) {
        
        if (cubeNumber > 999 || cubeNumber < 0)
            throw "Incorrect cube number: " + cubeNumber;
        
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
        SetItemOnScene(this.drawable, this.position[0], this.position[1], this.position[2]);
    }
    
    getNumbers() {
        return [this.a, this.b, this.c];
    }
    
    getCoordinates() { }
    getNextCoordinates() { }
    move() { }
    draw() { }
}

var CUBES = [[566, 472, 737],
             [656, 778, 462],
             [100, 100, 100]
             // Add cubes here
            ]

class Shell {
    // TODO skeleton shell
    constructor() {
        this.drawable = new THREE.Mesh(new THREE.BoxGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SIZE), 
                                       new THREE.LineBasicMaterial({
                                                                    color: 0xffffff,
                                                                    linewidth: 1,
                                                                    linecap: 'round', //ignored by WebGLRenderer
                                                                    linejoin:  'round' //ignored by WebGLRenderer
                                                                    })
                                       );
        this.drawable.material.linewidth = 3;
        SetItemOnScene(this.drawable, 0, 0, 0);
    }
}
            
class Hypercube { 
    draw() { }
  
    constructor() {
        this.cubes = [];
        for (let i = 0; i < CUBES.length; ++i) {
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
  // WIDTH = window.innerWidth, HEIGHT = 480;
  // camera.aspect = WIDTH / HEIGHT;
  // camera.updateProjectionMatrix();
  // renderer.setSize(WIDTH, HEIGHT);

  // var speed = document.getElementById("btnReset").offsetLeft + document.getElementById("btnReset").clientWidth - document.getElementById("btnSpeed").offsetLeft;
  // document.getElementById("btnSpeed").style.width = speed + 'px';

  // var h = window.innerHeight;
  // h -= document.getElementById("logo").offsetHeight;
  // h -= document.getElementsByTagName("canvas")[0].offsetHeight;
  // h -= document.getElementById("panel").offsetHeight;
  // h -= 10 * 4 * 2; // #badtrick
  // document.getElementById("log").style.height = h + 'px';
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  // TODO animate labyrinth
  
  //controls.update();
}
render();


  // todo: add new UI.*
  // fix h