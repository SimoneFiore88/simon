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

    const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    /*     const gridHelper = new THREE.GridHelper(100, 120);
    gridHelper.position.set(0, 60, 0);
    scene.add(gridHelper); */

    camera.position.set(22, 15, 28);

    camera.lookAt(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(60, 60, 120, 120);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load(color),
      displacementMap: groundDisplacement,
      displacementScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      depthWrite: false,
      color: "#BB430E",
      //color: "#2771CC",
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

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (Math.PI * 3) / 8;

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
        position: new THREE.Vector3(2, 1, 4),
        icon: "<i class='fal fa-user'></i>",
        name: "Bio",
        text: "I don't think we've met. \nMy name is Simone Fiore, but everyone calls me Fiore.",
      },
      {
        position: new THREE.Vector3(-15, 6, 10),
        icon: "<i class='fal fa-code'></i>",

        name: "Occupation",
        text: "Frontend developer and teacher.",
      },
      {
        position: new THREE.Vector3(8, 6, -10),
        icon: "<i class='fal fa-telescope'></i>",

        name: "Hobbies",
        text: "CS, Space&Science and many other things.",
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
                ${point.icon}
            </div>
    
            
            <div class="marker-text">
            <p>${point.name}</p>
            <p>${point.text}</p>
            </div>
        </div>
      `;
      div.style.marginTop = "0em";
      div.style.opacity = "0";
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
      gsap.to(div, {
        duration: 1,
        delay: 2,
        opacity: 1,
      });
    });

    const raycaster = new THREE.Raycaster();

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

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      //if (elapsedTime > 0) plane.rotation.z += 0.002;
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
