import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    let temp = mountRef.current;
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 15, 0);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(30, 30, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(1000, 20);
    scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: "#d3d3d3",
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.y = 1;
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      //render();
    }

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      moon.position.x = 10 * Math.cos(elapsedTime);
      moon.position.z = 10 * Math.sin(elapsedTime);
      moon.position.y = 10 * Math.sin(elapsedTime);
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => temp.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef}></div>;
}
