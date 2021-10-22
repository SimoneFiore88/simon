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

import alpha from "./../../textures/grass/test_b_alpha.jpeg";

import bkg1_front from "./bkg1_front.png";
import bkg1_back from "./bkg1_back.png";
import bkg1_top from "./bkg1_top.png";
import bkg1_left from "./bkg1_left.png";
import bkg1_right from "./bkg1_right.png";
import bkg1_bot from "./bkg1_bot.png";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
//const gui = new dat.GUI();

export default function Scene1() {
  let history = useHistory();

  const mountRef = useRef(null);

  useEffect(() => {
    let temp = mountRef.current;
    const scene = new THREE.Scene();

    {
      const color = 0x333333;
      const near = 4;
      const far = 100;
      scene.fog = new THREE.Fog(color, near, far);
    }

    const loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        // Wait a little
        window.setTimeout(() => {
          console.log("loaded");
          console.log(scene.children);
          gsap.to(camera.position, {
            duration: 2,
            delay: 0,
            x: 22,
            y: 15,
            z: 28,
          });

          gsap.to(plane.material, {
            duration: 2,
            delay: 1,
            displacementScale: 12,
          });
        }, 3000);

        setTimeout(() => {
          labels.forEach((label) => (label.visible = true));
        }, 4000);
        /* 
        gsap.to(sprite1.scale, {
          duration: 2,
          delay: 5,
          x: 22,
          y: 15,
          z: 28,
        }); */
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        console.log(progressRatio);
      },
    );

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 15, 0);
    //scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      //100,
      1000,
    );

    {
      const loader = new THREE.CubeTextureLoader(loadingManager);
      const texture = loader.load([
        bkg1_front,
        bkg1_back,
        bkg1_top,
        bkg1_bot,
        bkg1_left,
        bkg1_right,
      ]);
      scene.background = texture;
    }

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    //renderer.setClearColor("#111");

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    mountRef.current.appendChild(labelRenderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    camera.position.set(40, 15, 40);

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(120, 120, 120, 120);
    const planeMaterial = new THREE.MeshStandardMaterial({
      //map: colorMat,
      displacementMap: groundDisplacement,
      displacementScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      depthWrite: false,
      //color: "#BB430E",
      color: "#559cc5",

      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 90;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (Math.PI * 3) / 8;

    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //controls.enableZoom = false;
    //controls.enablePan = false;
    //controls.enableRotate = false
    /**
     * Points of interest
     */

    /*     const sprite1 = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: "#69f" }),
    );
    sprite1.position.set(6, 5, 5);
    sprite1.scale.set(0, 0, 0);
    scene.add(sprite1);
    let div = document.createElement("div");
    div.textContent = "boh proviamo";

    const text = new CSS2DObject(div);
    text.position.set(6, 5, 5); */

    let points = [
      {
        position: new THREE.Vector3(8, 4, 4),
        icon: "<i class='fal fa-user'></i>",
        name: "Bio",
        text: "I don't think we've met. \nMy name is Simone Fiore, but everyone calls me Fiore.",
      },
      {
        position: new THREE.Vector3(-15, 10, 10),
        icon: "<i class='fal fa-code'></i>",

        name: "Occupation",
        text: "Frontend developer and teacher.",
      },
      {
        position: new THREE.Vector3(8, 8, -10),
        icon: "<i class='fal fa-telescope'></i>",

        name: "Hobbies",
        text: "CS, Space&Science and many other things.",
      },
      {
        position: new THREE.Vector3(-12, 2, 4),
        icon: "<i class='fab fa-node-js'></i>",

        name: "JavaScript",
        text: "Everywhere!",
      },
    ];

    const labels = [];
    points.forEach((point, i) => {
      /*       const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(...point.position);
      scene.add(cube); */

      const div = document.createElement("div");
      div.classList = "marker";

      const icon = document.createElement("div");
      icon.classList = "marker-icon cursor-pointer";
      icon.innerHTML = `${point.icon}`;

      div.appendChild(icon);

      const text = document.createElement("div");
      text.classList = "marker-text btn";
      text.innerHTML = `
        <p>${point.name}</p>
        <p>${point.text}</p>
      `;

      div.appendChild(text);

      div.style.marginTop = "0em";

      const label = new CSS2DObject(div);

      label.position.set(point.position.x, point.position.y, point.position.z);
      label.visible = false;

      labels.push(label);

      scene.add(label);
      /*       gsap.to(label.position, {
        duration: 1,
        delay: 3,
        x: point.position.x,
        y: point.position.y,
        z: point.position.z,
      });
      gsap.to(div, {
        duration: 1,
        delay: 3,
        opacity: 1,
      }); */

      /*       icon.addEventListener("pointerdown", () =>
        history.push(`/cube/${point.name}`),
      ); */

      icon.addEventListener("pointerdown", () => {
        gsap.to(camera.lookAt, {
          duration: 2,
          delay: 0,
          x: 0,
          y: 0,
          z: 0,
        });

        gsap.to(controls.target, {
          duration: 2,
          delay: 0,
          x: 0,
          y: 0,
          z: 0,
        });

        gsap.to(camera.position, {
          duration: 2,
          delay: 0,
          x: point.position.x * 1.2,
          y: point.position.y * 1.2,
          z: point.position.z * 1.2,
        });
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

    /*     gsap.to(camera.position, { duration: 2, delay: 0, x: 22, y: 15, z: 28 });
    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 12 });
 */
    //camera.position.set(22, 15, 28);

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

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

  return (
    <>
      <div ref={mountRef}></div>
    </>
  );
}
