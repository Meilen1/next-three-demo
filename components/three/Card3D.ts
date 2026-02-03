import * as THREE from "three";

export default class Card3D {
  mesh: THREE.Mesh;
  hovered = false;
  active = false;

  constructor(texture: THREE.Texture, position: THREE.Vector3) {
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0xdcdcdc,
      roughness: 0.9
    });

    const topMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8
    });

    const materials = [
      sideMaterial,
      sideMaterial,
      topMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial
    ];

    

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.08, 3),
      materials
    );

    this.mesh.position.copy(position);
  }

  update() {
    const targetY = this.hovered ? 0.18 : 0;
    this.mesh.position.y += (targetY - this.mesh.position.y) * 0.12;
  }
}
