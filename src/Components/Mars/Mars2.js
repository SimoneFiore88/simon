import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHistory } from "react-router-dom";
import gsap from "gsap";

import color from "./map2k.jpg";
import height from "./bump2k.jpg";

import circle from "./circle-2.png";

export default function Mars2() {
  const mountRef = useRef(null);
  let history = useHistory();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const points = [
      {
        position: new THREE.Vector3(5.3, 0, 0),
        element: document.querySelector(".point-0"),
      },
      {
        position: new THREE.Vector3(0, 0, 5.3),
        element: document.querySelector(".point-1"),
      },
      {
        position: new THREE.Vector3(-3, 4, 2),
        element: document.querySelector(".point-2"),
      },
      {
        position: new THREE.Vector3(2, -4, 3),
        element: document.querySelector(".point-3"),
      },
    ];

    let canvas = mountRef.current;

    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(10, 0, -130);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
    scene.add(light);

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(15, 0, 0);

    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //controls.minDistance = 12;
    controls.minDistance = 5;

    controls.maxDistance = 60;
    controls.enablePan = false;
    //controls.enableZoom = false;

    const textureLoader = new THREE.TextureLoader();
    const colorMat = textureLoader.load(color);
    const groundMat = textureLoader.load(height);

    const geometry = new THREE.SphereGeometry(5, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      map: colorMat,
      displacementMap: groundMat,
      bumpMap: groundMat,
      bumpScale: 0.05,
      displacementScale: 0.1,
      //wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.render(scene, camera);
    }

    const map = new THREE.TextureLoader().load(circle);

    const mat = new THREE.SpriteMaterial({ map: map });

    for (const point of points) {
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.0, 1.0, 1.0);

      sprite.position.set(...point.position);
      scene.add(sprite);
    }

    const tick = () => {
      // Go through each point

      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      canvas.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef}></div>
    </>
  );
}
