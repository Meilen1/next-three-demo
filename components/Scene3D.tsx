"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Card3D from "./three/Card3D";
import CardManager from "./three/CardManager";
import RoadNetwork from "./three/RoadNetwork";

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  

  const cityLayout = [
  {
    id: "mapa",
    image: "/cards/Nosotros.jpg",
    position: new THREE.Vector3(-6, 0, 4),
    size: { w: 5, d: 3 }
  },
  {
    id: "historia",
    image: "/cards/historia.jpg",
    position: new THREE.Vector3(-1, 0, 4),
    size: { w: 3, d: 2 }
  },
  {
    id: "smartflow",
    image: "/cards/smartflow.jpg",
    position: new THREE.Vector3(4, 0, 4),
    size: { w: 4.5, d: 2.5 }
  },
  {
    id: "beneficios",
    image: "/cards/beneficios.jpg",
    position: new THREE.Vector3(-6, 0, 0),
    size: { w: 3, d: 2 }
  },
  {
    id: "servicios",
    image: "/cards/servicios.jpg",
    position: new THREE.Vector3(-1, 0, 0),
    size: { w: 4, d: 3 }
  },
  {
    id: "datos",
    image: "/cards/datos.jpg",
    position: new THREE.Vector3(4, 0, 0),
    size: { w: 3, d: 2 }
  },
  {
    id: "contacto",
    image: "/cards/Nosotros.png",
    position: new THREE.Vector3(-2.5, 0, -4),
    size: { w: 5, d: 2.5 }
  },
  {
    id: "nosotros",
    image: "/cards/nosotros.jpg",
    position: new THREE.Vector3(4.5, 0, -4),
    size: { w: 2.5, d: 2 }
  }

];


  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const roads = new RoadNetwork(scene);

    const groundTexture = new THREE.TextureLoader().load("/pasto.jpg");



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


    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    // cuántas veces se repite la imagen
    groundTexture.repeat.set(50, 50);

    groundTexture.colorSpace = THREE.SRGBColorSpace;
    groundTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({
        map: groundTexture,
        roughness: 1,
        metalness: 0
      })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;

    scene.add(ground);
        

    /* LIGHTS */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 4, 2);
    scene.add(light);

    // Calle horizontal superior
    roads.addRoad(
      new THREE.Vector3(0, 0.001, 2),
      { w: 18, d: 1.2 }
    );

    // Calle horizontal central
    roads.addRoad(
      new THREE.Vector3(0, 0.001, -2),
      { w: 18, d: 1.2 }
    );

    // Calle vertical izquierda
    roads.addRoad(
      new THREE.Vector3(-3.5, 0.001, 0),
      { w: 1.2, d: 10 }
    );

    // Calle vertical derecha
    roads.addRoad(
      new THREE.Vector3(3.5, 0.001, 0),
      { w: 1.2, d: 10 }
    );


/* ========= CARD MANAGER ========= */
const cardManager = new CardManager(camera, scene);

/* TEXTURE */
const loader = new THREE.TextureLoader();

cityLayout.forEach(lot => {
  const texture = loader.load(lot.image);

  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  cardManager.add(
    new Card3D(
      texture,
      lot.position,
      lot.size,
      lot.id
    )
  );
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
