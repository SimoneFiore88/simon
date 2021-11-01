import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import classes from "./Scene2.module.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";

import alpha from "./../../textures/grass/test_b_alpha.jpeg";
import mark from "./../../textures/grass/flare.png";
import loader from "./loader-1.png";

/* import bkg1_front from "./bkg1_front.png";
import bkg1_back from "./bkg1_back.png";
import bkg1_top from "./bkg1_top.png";
import bkg1_left from "./bkg1_left.png";
import bkg1_right from "./bkg1_right.png";
import bkg1_bot from "./bkg1_bot.png"; */

import bkg1_front from "./desertdawn_ft.jpg";
import bkg1_back from "./desertdawn_bk.jpg";
import bkg1_top from "./desertdawn_up.jpg";
import bkg1_left from "./desertdawn_lf.jpg";
import bkg1_right from "./desertdawn_rt.jpg";
import bkg1_bot from "./desertdawn_dn.jpg";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

export default function Scene2() {
  let history = useHistory();

  const mountRef = useRef(null);
  const overlay = useRef(null);
  const overlayText = useRef(null);

  useEffect(() => {
    let canvas = mountRef.current;
    const scene = new THREE.Scene();

    let frameId;

    let notTouched = true;

    const pointer = new THREE.Vector2();
    document.addEventListener("mousemove", onPointerMove);
    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    /*     {
      const color = 0x333333;
      const near = 4;
      const far = 100;
      scene.fog = new THREE.Fog(color, near, far);
    } */

    const loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        // Wait a little
        setTimeout(() => {
          console.log("loaded");
          console.log(overlay.current.style);
          overlay.current.style.opacity = 0;
          overlay.current.style.zIndex = -1;

          gsap.to(plane.material, {
            duration: 2,
            delay: 1,
            displacementScale: 12,
          });
        }, 2000);

        setTimeout(() => {
          labels.forEach((label) => (label.visible = true));
        }, 3500);
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        console.log(Math.round(progressRatio * 100));
        overlayText.current.textContent = Math.round(progressRatio * 100) + "%";
      },
    );

    const light1 = new THREE.PointLight(0xffffff, 0.5);
    light1.position.set(0, 15, 0);
    //scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
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
        bkg1_right,
        bkg1_left,
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

    const planeGeometry = new THREE.PlaneBufferGeometry(120, 120, 60, 60);
    const planeMaterial = new THREE.MeshStandardMaterial({
      //map: colorMat,
      displacementMap: groundDisplacement,
      displacementScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      //depthWrite: false,
      //color: "#559cc5",
      color: "#BB430E",
      color: "#F19D00",
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 60;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (Math.PI * 3) / 8;

    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //controls.enableZoom = false;
    controls.enablePan = false;
    //controls.enableRotate = false
    /**
     * Points of interest
     */

    let points = [
      {
        position: new THREE.Vector3(8, 5, 4),
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
        position: new THREE.Vector3(12, 8, -12),
        icon: "<i class='fal fa-telescope'></i>",

        name: "Hobbies",
        text: "CS, Space&Science and many other things.",
      },
      {
        position: new THREE.Vector3(-12, 8, -8),
        icon: "<i class='fab fa-node-js'></i>",

        name: "JavaScript",
        text: "Everywhere!",
      },
    ];

    const labels = [];
    points.forEach((point, i) => {
      /*  const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(...point.position);
      cube.name = point.name; */

      //scene.add(cube);

      const div = document.createElement("div");
      div.classList = "marker";

      const icon = document.createElement("div");
      icon.classList = "marker-icon-2";
      icon.innerHTML = `${point.icon}`;

      div.appendChild(icon);

      const text = document.createElement("div");
      text.classList = "marker-text btn";

      text.innerHTML = `
        <p class="text-yellow-300">${point.name}</p>
        <p>${point.text}</p>
      `;

      div.appendChild(text);

      //div.style.marginTop = "0em";

      const label = new CSS2DObject(div);

      label.position.set(point.position.x, point.position.y, point.position.z);
      label.visible = false;
      labels.push(label);

      scene.add(label);

      /*       const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(...point.position);
      sprite.scale.set(5, 5, 5);
      scene.add(sprite); */

      text.addEventListener("pointerdown", () => {
        notTouched = false;
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

    window.addEventListener("pointerdown", () => (notTouched = false));

    /*     gsap.to(camera.position, { duration: 2, delay: 0, x: 22, y: 15, z: 28 });
    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 12 });
 */
    //camera.position.set(22, 15, 28);

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      /* console.log(elapsedTime);
      if (elapsedTime > 10) scene.remove(plane); */

      if (notTouched) {
        camera.position.x = 35 * Math.cos(elapsedTime * 0.1);
        camera.position.z = 35 * Math.sin(elapsedTime * 0.1);
      }

      controls.update();

      // Render
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      // Call tick again on the next frame
      frameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      frameId = null;
      canvas.removeChild(renderer.domElement);
      canvas.removeChild(labelRenderer.domElement);
    };

    /*     return () => {
      console.log("remove");
      canvas.removeChild(renderer.domElement);
      console.log(document.querySelectorAll(".marker"));
      document
        .querySelectorAll(".marker")
        .forEach((e) => e.parentElement.removeChild(e));
      console.log(mountRef);
    }; */
  }, []);

  return (
    <>
      {/*       <div className="w-screen h-16 fixed flex items-center px-2 z-50 justify-between navbar">
        <Link to="/surface" className={classes.btn + " font-electrolize "}>
          <span className="text-yellow-300">SimoneFiore</span>
        </Link>
        <div className="flex flex-col h-32 w-20 justify-between self-start pt-4">
          <Link to="/home2" className={classes.btn}>
            <i className="fal fa-signal-stream text-yellow-300"></i>2
          </Link>
          <Link to="/" className={classes.btn}>
            <i className="fal fa-user text-yellow-300"></i>1
          </Link>
          <button to="/surface" className={classes.btn}>
            <i className="fal fa-cube text-yellow-300"></i>
          </button>
        </div>
      </div> */}
      <div className="overlay" ref={overlay}>
        <img src={loader} className="loader" alt="" />
        <div className="absolute">
          <p className="">Loading</p>
          <p className="font-electrolize text-xl" ref={overlayText}></p>
        </div>
      </div>
      <div ref={mountRef}></div>
    </>
  );
}
