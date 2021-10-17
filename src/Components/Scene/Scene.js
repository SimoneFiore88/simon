import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";
import alpha from "./../../textures/grass/opacity.png";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    let temp = mountRef.current;
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    /*     const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 15, 0);
    scene.add(light); */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 20, 0);
    camera.lookAt(0, 0, 0);

    const light = new THREE.AmbientLight(0xffffff, 30, 50);
    light.position.set(0, 20, 0);

    scene.add(light);

    const textureLoader = new THREE.TextureLoader();
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(60, 60, 140, 140);
    const planeMaterial = new THREE.MeshPhongMaterial({
      map: colorMat,
      displacementMap: groundDisplacement,
      displacementScale: 0,
      //bumpMap: groundDisplacement,
      bumpScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      wireframe: true,
      depthWrite: false,
      color: "cyan",
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    /*     plane.receiveShadow = true;
    plane.castShadow = true; */
    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(1000, 20);
    //scene.add(gridHelper);

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
    //scene.add(moon);

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    gsap.to(camera.position, { duration: 2, delay: 2, x: 35, y: 20, z: 35 });
    gsap.to(plane.material, { duration: 2, delay: 3, displacementScale: 12 });

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      moon.position.x = 10 * Math.cos(elapsedTime);
      moon.position.z = 10 * Math.sin(elapsedTime);
      moon.position.y = 10 * Math.sin(elapsedTime);

      //plane.rotation.z += 0.001;
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
