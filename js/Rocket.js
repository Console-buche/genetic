console.log("ready for genetics");
import DNA from './DNA.js';
import Wall from './Wall.js';

class Rocket extends THREE.Mesh {
    constructor(targetPos, dna, lifespan) {
        super();
        //model
        this.material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF * Math.random(),
            blending: THREE.AdditiveBlending
        });
        this.castShadow = true;
        this.geometry = new THREE.BoxGeometry(0.25, 0.25, 1);

        //physics
        this.pos = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);
        this.acc = new THREE.Vector3(0, 0, 0);
        this.targetPos = targetPos; //TODO : PASS AS ARGUMENT, REMOVE HARDCODE
        this.boundingBox = null;
        this.scene = null;
        this.isStuck = false;
        this.hasArrived = false;
        this.lifespan = lifespan;
        this.timeToTarget = 0;

        //DNA
        if (dna) {
            this.dna = dna;
        } else {
            this.dna = new DNA();
        }
        this.count = 0;
        this.fitness = 0;
    }

    calcFitness = () => {
        let d = this.pos.distanceTo(this.targetPos);
        var speedBonus = 200 / Number(this.timeToTarget);
        if (this.hasArrived) {
            this.fitness = 1 / (d + 0.0001) * 10 * speedBonus; //*0.0001 to avoind div by 0
        } else {
            this.fitness = 1 / (d + 0.0001) * speedBonus; //TODO : WATCH FOR DEVIDE BY ZERO
        }



        //this.fitness += speedBonus + 0.00001;
    }



    applyForce = (force) => {
        this.acc.add(force);
    }

    create = (glScene) => {
        this.scene = glScene;
        // console.log(this.dna.genes)
        this.geometry.computeBoundingBox();
        this.boundingBox = this.geometry.boundingBox.clone();
        glScene.add(this);
    }

    checkCollision = (walls) => {
        walls.forEach((wall) => {
            //console.log(wall.intersectsBox(this.boundingBox))
            let isColliding = wall.intersectsBox(this.boundingBox);
            if (isColliding) {
                this.isStuck = true;
            }
        })
    }

    checkDestination = (target) => {
        let bs = target.geometry.boundingBox;
        let hasReachedTarget = bs.intersectsBox(this.boundingBox);
        if (hasReachedTarget) {
            this.hasArrived = true;
        }
    }

    update = (obstacles, t) => {

        if (!this.isStuck && !this.hasArrived) {
            let walls = obstacles;
            this.checkCollision(walls);
            this.checkDestination(t);

            this.timeToTarget += 1;

            this.applyForce(this.dna.genes[this.count]);
            this.count = (this.count < 199) ? this.count + 1 : 0; //TODO : get nb of frames for 1 pop life
            this.vel.add(this.acc);
            let v = new THREE.Vector3().copy(this.vel).normalize().multiplyScalar(0.15);
            this.pos.add(v);
            let futurePos = new THREE.Vector3().subVectors(this.dna.genes[this.count], this.pos);
            this.lookAt(new THREE.Vector3(this.pos.x, this.pos.y, futurePos.z));


            this.position.copy(this.pos);
            this.acc.multiplyScalar(0);

            //update bounding box after transforms for collision
            this.updateMatrixWorld(true);
            this.boundingBox = this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld);
        }
    }
}

export default Rocket;