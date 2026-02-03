import * as THREE from "three";

export default class RoadNetwork {
  group = new THREE.Group();

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  addRoad(
    position: THREE.Vector3,
    size: { w: number; d: number },
    rotationY = 0
  ) {
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9
    });

    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(size.w, size.d),
      material
    );

    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotationY;
    road.position.copy(position);

    road.receiveShadow = true;

    this.group.add(road);
  }
}
