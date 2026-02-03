import * as THREE from "three";

export default class Card3D {
  group: THREE.Group;
  mesh: THREE.Mesh;   // la card
  base: THREE.Mesh;   // el slot
  hovered = false;
  active = false;

  constructor(
    texture: THREE.Texture,
    position: THREE.Vector3,
    size: { w: number; d: number },
    id: string
  ) {
    // 👉 crear el grupo (FALTABA)
    this.group = new THREE.Group();

    /* ===== BASE (slot fijo) ===== */
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5c542,
      roughness: 1
    });



    this.base = new THREE.Mesh(
      new THREE.BoxGeometry(size.w + 0.2, 0.08, size.d + 0.2),
      baseMaterial
    );


    // siempre pegada al suelo
    this.base.position.y = 0.01;

    // que NO interfiera con el raycaster
    // this.base.layers.set(1);

    this.group.add(this.base);

    /* ===== CARD ===== */
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0xdcdcdc,
      roughness: 0.9
    });

    const topMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8
    });

    const materials = [
      sideMaterial, // right
      sideMaterial, // left
      topMaterial,  // top
      sideMaterial, // bottom
      sideMaterial, // front
      sideMaterial  // back
    ];

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size.w, 0.08, size.d),
      materials
    );

    // arranca arriba de la base (ANTES ERA 0)
    this.mesh.position.y = 0.08 / 2;

    this.mesh.userData.id = id;

    this.group.add(this.mesh);

    // posicionar TODO el lote
    this.group.position.copy(position);
  }

  update() {
    // mantenemos el comportamiento original
    const baseY = 0.08 / 2;
    const targetY = this.hovered ? 1.4 : baseY;

    this.mesh.position.y += (targetY - this.mesh.position.y) * 0.05;

    // --- ROTACIÓN X (correcta, NO infinita) ---
    const targetRotX = this.hovered ? 1.6 : 0;
    this.mesh.rotation.x += (targetRotX - this.mesh.rotation.x) * 0.05;
    
  }
}
