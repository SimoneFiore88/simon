import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";
import alpha from "./../../textures/grass/opacity.png";

export default function Scene1() {
  const mountRef = useRef(null);

  useEffect(() => {
    let temp = mountRef.current;
    const scene = new THREE.Scene();

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 15, 0);
    scene.add(light1);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(22, 10, 28);
    camera.lookAt(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(60, 60, 80, 80);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load(color),
      displacementMap: groundDisplacement,
      displacementScale: 1,
      //bumpMap: groundDisplacement,
      //bumpScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      depthWrite: false,
      color: "#BB430E",
      wireframe: false,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    /*     plane.receiveShadow = true;
    plane.castShadow = true; */
    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    mountRef.current.appendChild(labelRenderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(1000, 20);
    //scene.add(gridHelper);

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, labelRenderer.domElement);

    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //controls.enableZoom = false;
    //controls.enablePan = false;

    /**
     * Points of interest
     */

    let points = [
      {
        position: new THREE.Vector3(16, 12, 16),
        name: "Lorem 1",
      },
      {
        position: new THREE.Vector3(-15, 9, 10),
        name: "Lorem 2",
      },
      {
        position: new THREE.Vector3(8, 9, -10),
        name: "Lorem 3",
      },
    ];

    points.forEach((point, i) => {
      /*       const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(...point.position);
      scene.add(cube); */

      const div = document.createElement("div");

      div.innerHTML = `
        <div class="marker">
            <div class="marker-icon">
                <i class="fal fa-map-marker-exclamation"></i>
            </div>
    
            <div class="marker-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </div>
        </div>
      `;
      div.style.marginTop = "0em";
      div.style.color = "white";
      const label = new CSS2DObject(div);
      label.position.set(0, 0, 0);
      scene.add(label);
      gsap.to(label.position, {
        duration: 1,
        delay: 2,
        x: point.position.x,
        y: point.position.y,
        z: point.position.z,
      });
    });

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    //gsap.to(camera.position, { duration: 2, delay: 2, x: 25, y: 15, z: 25 });
    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 12 });

    //const clock = new THREE.Clock();

    const tick = () => {
      /*  for (const point of points) {
        const screenPosition = point.position.clone();
        screenPosition.project(camera);

        const translateX = screenPosition.x * window.innerWidth * 0.5;
        const translateY = -screenPosition.y * window.innerHeight * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      } */
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      temp.removeChild(renderer.domElement);
      temp.removeChild(labelRenderer.domElement);
    };

    /*     return () => {
      console.log("remove");
      temp.removeChild(renderer.domElement);
      console.log(document.querySelectorAll(".marker"));
      document
        .querySelectorAll(".marker")
        .forEach((e) => e.parentElement.removeChild(e));
      console.log(mountRef);
    }; */
  }, []);

  return <div ref={mountRef}></div>;
}
