import Rocket from './Rocket.js';
import Wall from './Wall.js';

class Population {
    constructor(lifespan, target) {
        this.rockets = [];
        this.popSize = 100;
        this.matingPool = [];
        this.obstacles = [];
        this.target = target;
        this.lifespan = lifespan;
    }

    addObstacle = (obstacle) => {
        this.obstacles.push(obstacle);
    }

    setTarget = (target) => {
        this.target = target;
    }

    createPop(glScene) {
        let s = glScene;
        for (var i = 0; i < this.popSize; i++) {
            this.rockets[i] = new Rocket(new THREE.Vector3(0, 17, 0));
            this.rockets[i].create(s, this.lifespan);
        }
    }

    evaluate() {
        let maxFit = 0;
        this.rockets.forEach((rocket) => {
            rocket.calcFitness();
            if (rocket.fitness > maxFit) {
                maxFit = rocket.fitness;
            }
        });

        this.rockets.forEach((rocket) => {
            rocket.fitness /= maxFit; //TODO : WATCH FOR DEVIDE BY ZERO
        });


        this.matingPool = [];

        this.rockets.forEach((rocket) => {
            let n = rocket.fitness * 100; //extremely important bit : add n duplicates of this rocket based on its fitness. So it gets an n chance to get picked again (pass its genes)
            for (let i = 0; i < n; i++) {
                this.matingPool.push(rocket);
            }
        });
    }

    selection(targetPos, s) {
        var scene = s;
        let newRockets = [];
        for (var i = 0; i < this.rockets.length; i++) {
            let parentA = this.matingPool[Math.floor(Math.random() * this.matingPool.length)].dna;
            let parentB = this.matingPool[Math.floor(Math.random() * this.matingPool.length)].dna;
            let child = parentA.crossover(parentB);
            child.mutation();
            newRockets[i] = new Rocket(targetPos, child);
        }
        this.rockets = newRockets;
        this.rockets.forEach((rocket) => {
            rocket.create(s, this.lifespan);
        })

    }

    killPop(glScene) {
        let s = glScene;
        this.rockets.forEach((rocket) => {
            s.remove(rocket);
        })
    }

    run() {
        let rockets = this.rockets;
        rockets.forEach((rocket) => {
            rocket.update(this.obstacles, this.target);
        })
    }
}

export default Population;