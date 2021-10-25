import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

import color from "./color.jpg";
import height from "./bump.jpg";

export default function Moon() {
  const mountRef = useRef(null);

  useEffect(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let temp = mountRef.current;

    let scene = new THREE.Scene();

    // renderer
    const renderer = new THREE.WebGLRenderer();
    mountRef.current.appendChild(renderer.domElement);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        // Wait a little
        setTimeout(() => {
          console.log("loaded");

          //camera.position.set(10, 5, 10);

          gsap.to(camera.position, {
            duration: 5,
            delay: 0,
            x: 10,
            y: 5,
            z: 10,
          });

          gsap.to(controls.target, {
            duration: 2,
            delay: 0,
            x: 0,
            y: 0,
            z: 0,
          });
        }, 2000);
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        console.log(Math.round(progressRatio * 100));
      },
    );

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(60, 60, 0);

    scene.add(camera);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //controls.minDistance = 12;
    controls.minDistance = 10;

    controls.maxDistance = 60;
    controls.enablePan = false;

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 15, 0);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
    scene.add(light);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const textureLoader = new THREE.TextureLoader(loadingManager);
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

    // animation loop
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      sphere.rotation.y = elapsedTime * 0.15;
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    return () => temp.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef}></div>;
}
