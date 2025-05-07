class DNA {
    constructor(genes) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];
            for (var i = 0; i < 200; i++) { //200 should be global var LIFESPAN cause we're gonna need 1 call every frame
                this.genes[i] = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
            }
        }
    }

    crossover(partner) {
        let newGenes = [];
        let mid = Math.floor(Math.random() * this.genes.length);
        for (var i = 0; i < this.genes.length; i++) {
            if (i > mid) {
                newGenes[i] = this.genes[i];
            } else {
                newGenes[i] = partner.genes[i];
            }
        }

        return new DNA(newGenes);
    };

    mutation() {
        this.genes.forEach((gene) => {
            let mutationChances = Math.random();
            if (mutationChances < 0.025) {
                gene = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
            }
        })
    }

}


export default DNA;