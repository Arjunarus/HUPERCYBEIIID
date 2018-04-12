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
camera.position.z = SHELL_SIZE * 3;

var renderer = new THREE.WebGLRenderer();
renderer.alpha = true;
renderer.setClearColor("#000000");
renderer.setSize(WIDTH, HEIGHT);
document.body.replaceChild(renderer.domElement, document.getElementById("renderer")); // todo: msg if !js || !webgl

var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var cubeMaterial = new THREE.MeshStandardMaterial({
    color: CUBE_COLOR,
    shading: THREE.FlatShading,
    metalness: 0,
    roughness: 1
});

var shellGeometry = new THREE.BoxGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SIZE);
var shellMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff33, 
    opacity: 0.5,
    transparent: true,
    shading: THREE.FlatShading,
    metalness: 0,
    roughness: 3
}); 
    
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

var light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 30, 50);
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

// Distance between 2 positions
function Distance(position1, position2) {
    let dx = position2.x - position1.x;
    let dy = position2.y - position1.y;
    let dz = position2.z - position1.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

// Moving vector from startPosition to finishPosition
function MovingVector(startPosition, finishPosition) {
    return {
        x: (finishPosition.x - startPosition.x) * SPEED_RATIO,
        y: (finishPosition.y - startPosition.y) * SPEED_RATIO,
        z: (finishPosition.z - startPosition.z) * SPEED_RATIO
    }
}

function AddVectorToPosition(position, vector) {
    return {
        x: position.x + vector.x,
        y: position.y + vector.y,
        z: position.z + vector.z
    }
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
        return {
            x: Cube.GetCoord(iteration, this.a),
            y: Cube.GetCoord(iteration, this.b),
            z: Cube.GetCoord(iteration, this.c)
        };
    }
    
    PutCubeInShell(x, y, z) {
        this.drawable.position.set(
            this.position.x - SHELL_SIZE/2, 
            this.position.y - SHELL_SIZE/2, 
            this.position.z - SHELL_SIZE/2
        );
    }
    
    // Iterations for each position in shell
    GetNextIteration() {
        return (this.iteration + 1) % this.positions.length;
    }
    
    // Cube is full-described by three numbers (aaa, bbb, ccc)
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.iteration = 0;
        this.positions = [];
        
        // TODO: generate route for cube as positions array
        for (let i = 0; i < 3; ++i)
            this.positions.push(this.GetCubePosition(i));
        
        this.position = this.positions[0];
        this.targetPosition = this.position;
        this.movingVector = {
            x: 0,
            y: 0,
            z: 0
        };
        
        this.drawable = new THREE.Mesh(cubeGeometry, cubeMaterial);
        console.log("Cube " + a + " " + b + " " + c + ": " + this.position);
        this.PutCubeInShell(this.position.x, this.position.y, this.position.z);
        this.StartMoving(this.positions[this.GetNextIteration()]);
    }
    
    IsOnTarget() {
        return (Distance(this.position, this.targetPosition) <= 0.1);
    }
    
    StartMoving(newPosition) {
        this.position = this.positions[this.iteration];
        this.targetPosition = this.positions[this.GetNextIteration()];
        this.movingVector = MovingVector(this.position, this.targetPosition);
    }
    
    Update() {
        if (this.IsOnTarget()) {
            this.iteration = this.GetNextIteration();
            this.StartMoving(this.positions[this.GetNextIteration()]);
        } else {
            this.position = AddVectorToPosition(this.position, this.movingVector);
        }
        
        this.PutCubeInShell(this.position.x, this.position.y, this.position.z);
    }
}

var CUBES = [[566, 472, 737],
             [656, 778, 462],
             [120, 120, 120]
             // Add cubes here
            ]

class Shell {
    constructor() {
        this.drawable = new THREE.Mesh(shellGeometry, shellMaterial);
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