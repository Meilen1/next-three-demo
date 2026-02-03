import * as THREE from "three";
import Card3D from "./Card3D";

export default class CardManager {
  cards: Card3D[] = [];
  hovered: Card3D | null = null;
  active: Card3D | null = null;

  private raycaster = new THREE.Raycaster();
  private backOffset = 50;

  constructor(
    private camera: THREE.Camera,
    private scene: THREE.Scene
  ) {
    this.raycaster.near = -100;
    this.raycaster.far = 1000;
  }

  add(card: Card3D) {
    this.cards.push(card);
    this.scene.add(card.mesh);
  }

  pick(mouse: THREE.Vector2) {
    this.camera.updateMatrixWorld();
    this.cards.forEach(c => c.mesh.updateMatrixWorld());

    this.raycaster.setFromCamera(mouse, this.camera);

    // 🔑 compensar near negativo
    this.raycaster.ray.origin.addScaledVector(
      this.raycaster.ray.direction,
      -this.backOffset
    );

    const hits = this.raycaster.intersectObjects(
      this.cards.map(c => c.mesh),
      true
    );

    if (hits.length === 0) {
      this.hovered = null;
      return;
    }

    // intersección más lejana
    const farthestHit = hits.reduce((a, b) =>
      a.distance > b.distance ? a : b
    );

    this.hovered =
      this.cards.find(
        c =>
          c.mesh === farthestHit.object ||
          c.mesh.children.includes(farthestHit.object)
      ) || null;
  }

  click() {
    this.active = this.hovered;
  }

  update() {
    this.cards.forEach(card => {
      card.hovered = card === this.hovered;
      card.active = card === this.active;
      card.update();
    });
  }
}
