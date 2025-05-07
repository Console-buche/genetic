import Population from './Population.js';
import Wall from './Wall.js';

//globals
var lifespan = 200,
    lifespanContainer = document.getElementById("lifespan"),
    generationCounter = document.getElementById("genCount");
var time = 0;
var goal;
var cycles = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Create a PointLight and turn on shadows for the light
var light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 7, 5);
light.castShadow = true; // default false
scene.add(light);

//Create a PointLight and turn on shadows for the light
var light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(2, 15, 5);
light.castShadow = true; // default false
scene.add(light);


var geometry = new THREE.SphereGeometry(0.5, 16, 16);
var material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF
});
goal = new THREE.Mesh(geometry, material);
goal.position.set(0, 20, 0);
scene.add(goal);



var pg = new THREE.PlaneGeometry(2000, 2000);
var pm = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF
});
pm.receiveShadow = true;

var p = new THREE.Mesh(pg, pm);
p.position.z = -3;
p.receiveShadow = true;
scene.add(p);




goal.geometry.computeBoundingBox();
goal.updateMatrixWorld(true);
goal.geometry.boundingBox.applyMatrix4(goal.matrixWorld);

var pop = new Population(lifespan, goal);
pop.createPop(scene);

//pop.setTarget(goal);

var wall = new Wall(new THREE.Vector3(0, 10, 0), {
    x: 3,
    y: 1,
    z: 1
});
wall.create(scene);
pop.obstacles.push(wall.boundingBox);

var wall4 = new Wall(new THREE.Vector3(-5, 10, 0), {
    x: 3,
    y: 1,
    z: 1
});
wall4.create(scene);
pop.obstacles.push(wall4.boundingBox);

var wall2 = new Wall(new THREE.Vector3(5, 10, 0), {
    x: 1,
    y: 10,
    z: 1
});
wall2.create(scene);
pop.obstacles.push(wall2.boundingBox);

var wall3 = new Wall(new THREE.Vector3(-10, 10, 0), {
    x: 1,
    y: 10,
    z: 1
});
wall3.create(scene);
pop.obstacles.push(wall3.boundingBox);

camera.position.y = 5;
camera.position.z = 25;

var animate = function () {
    requestAnimationFrame(animate);
    time = (time < lifespan) ? time + 1 : 0;
    lifespanContainer.innerHTML = time;
    if (time == lifespan - 1) {
        cycles++;
        generationCounter.innerHTML++;
        //if (cycles % 5 == 0) goal.position.x = Math.random() * 30 - 15;
        pop.killPop(scene);
        //pop.createPop(scene);
        //console.log(pop);
        pop.evaluate();
        pop.selection(goal.position, scene);

    }

    renderer.render(scene, camera);

    pop.run();
};

animate();