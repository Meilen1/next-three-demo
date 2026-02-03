"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Card3D from "./three/Card3D";
import CardManager from "./three/CardManager";

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    /* CAMERA */
    const { clientWidth, clientHeight } = mountRef.current;
    const aspect = clientWidth / clientHeight;
    const size = 5;

    const camera = new THREE.OrthographicCamera(
      -size * aspect,
       size * aspect,
       size,
      -size,
      -15,
       100
    );

    camera.position.set(2, 1, 2);
    camera.lookAt(0, 0, 0);

    /* RENDERER */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    /* LIGHTS */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 4, 2);
    scene.add(light);

    /* TEXTURE */
    const texture = new THREE.TextureLoader().load("/PUENTE_LABRUNA.jpg");
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.LinearFilter;

    // máximo real de la GPU
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();


/* ========= CARD MANAGER ========= */
const cardManager = new CardManager(camera, scene);

const columns = [-10.5, -7, -3.5, 0, 3.5, 7, 10.5, 14];
const rows = [-9.6, -6.5,-3.2, 0, 3.2, 6.5, 9.6, 12.8];

rows.forEach(z => {
  columns.forEach(x => {
    cardManager.add(
      new Card3D(texture, new THREE.Vector3(x, 0, z))
    );
  });
});

    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = () => {
      cardManager.click();
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onClick);

    const animate = () => {
      requestAnimationFrame(animate);

      cardManager.pick(mouse);
      cardManager.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-screen h-screen" />;
}
