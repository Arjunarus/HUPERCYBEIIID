"use strict"

// - - - init 1/2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Settings:
const FIELD_OF_VIEW = 90;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight * 2 / 3;
const ASPECT_RATIO = WIDTH / HEIGHT;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 1000;

const SHELL_SIZE = 28;
const CUBE_COLOR = "rgb(22, 22, 200)";
const SPEED_RATIO = 0.01;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = SHELL_SIZE * 2;

var renderer = new THREE.WebGLRenderer();
renderer.alpha = true;
renderer.setClearColor("#000000");
renderer.setSize(WIDTH, HEIGHT);
document.body.replaceChild(renderer.domElement, document.getElementById("renderer")); // todo: msg if !js || !webgl

var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial();

var light = new THREE.PointLight(0xffffff, 0.8);
light.position.set(10, 10, 50);
scene.add(light);

window.addEventListener('resize', onWindowResize, false);
onWindowResize();

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// - - - classes - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function GetDigits(a) {
    let number = a;
    let result = [];
    while (number > 0) {
        let lastDigit = number % 10;
        result.push(lastDigit);
        number -= lastDigit;
        number /= 10;
    }
    
    return result.reverse();
}

class Cube {
    
    static GetCoord(iteration, cubeNumber) {
        
        if (cubeNumber > 999 || cubeNumber < 0)
            throw "Incorrect cube number: " + cubeNumber;
        
        let digits = GetDigits(cubeNumber);
        
        // Cube has only 3 iterations
        switch(iteration) {
            case 0:
                return digits[0] + digits[1] + digits[2]; 
            case 1:
                return 2 * digits[1] + digits[2]; 
            case 2:
                return digits[1] + 2 * digits[2];
                
            default: throw "Incorrect cube iteration: " + iteration;
        }
    }
    
    GetCubePosition(iteration) {
        return [Cube.GetCoord(iteration, this.a),
                Cube.GetCoord(iteration, this.b),
                Cube.GetCoord(iteration, this.c)];
    }
    
    PutCubeInShell(x, y, z) {
        this.drawable.position.set(
            this.position[0] - SHELL_SIZE/2, 
            this.position[1] - SHELL_SIZE/2, 
            this.position[2] - SHELL_SIZE/2
        );
    }
    
    GetNextIteration() {
        return (this.iteration + 1) % 3;
    }
    
    GetNextPosition() {
        //TODO
    }
    
    // Cube is full-described by three numbers (aaa, bbb, ccc)
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.iteration = 0;
        this.position = this.GetCubePosition(this.iteration);
        this.targetPosition = this.position;
        this.movingVector = {
            x: 0, 
            y: 0, 
            z: 0
        };
        
        this.drawable = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({ color: CUBE_COLOR }));
        console.log("Cube " + a + " " + b + " " + c + ": " + this.position);
        this.PutCubeInShell(this.position[0], this.position[1], this.position[2]);
        this.StartMoving(this.GetNextPosition());
    }
    
    StartMoving(newPosition) {
        // TODO
    }
    
    Update() {
        if (this.position != this.targetPosition) {
            // TODO
        } else {
            this.StartMoving(this.GetNextPosition());
        }
    }
}

var CUBES = [[566, 472, 737],
             [656, 778, 462],
             [100, 100, 100]
             // Add cubes here
            ]

class Shell {
    constructor() {
        this.shellMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff33, 
                opacity: 0.2,
                transparent: true
        });
        
        this.drawable = new THREE.Mesh(new THREE.BoxGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SIZE), 
                                       this.shellMaterial);
        
        this.drawable.material.linewidth = 3;
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
    
    Update() {
        for (let i = 0; i < this.cubes.length; ++i) {
            this.cubes[i].Update();
        }
    }
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

function animate() {
  //controls.update();
  hc.Update();
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
}

animate();


  // todo: add new UI.*
  // fix h