class Wall extends THREE.Mesh {
    constructor(pos, size) {
        super();
        this.pos = pos;
        this.geometry = new THREE.BoxGeometry(size.x, size.y, size.z * 5);
        this.material = new THREE.MeshPhongMaterial({
            color: 0xFAFA00
        });
        this.castShadow = true;
        this.receiveShadow = true;
        this.boundingBox = new THREE.Box3();
    }

    create = (scene) => {

        this.position.copy(this.pos);
        this.geometry.computeBoundingBox();
        this.updateMatrixWorld(true);
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld);
        scene.add(this);
    };
}

export default Wall;