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

  console.log(history);
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

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 15, 0);
    //scene.add(light1);

    const light = new THREE.AmbientLight(0x559cc5, 1); // soft white light
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      //100,
      1000,
    );

    {
      const loader = new THREE.CubeTextureLoader();
      const texture = loader.load([
        /*         "./img/corona_ft.png",
        "./img/corona_bk.png",
        "./img/corona_up.png",
        "./img/corona_dn.png",
        "./img/corona_rt.png",
        "./img/corona_lf.png", */
        bkg1_front,
        bkg1_back,
        bkg1_top,
        bkg1_bot,
        bkg1_left,
        bkg1_right,
      ]);
      scene.background = texture;
      console.log("asdf");
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

    /*     const gridHelper = new THREE.GridHelper(100, 120);
    gridHelper.position.set(0, 60, 0);
    scene.add(gridHelper); */

    camera.position.set(40, 15, 40);

    camera.lookAt(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(120, 120, 120, 120);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load(color),
      displacementMap: groundDisplacement,
      displacementScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      depthWrite: false,
      //color: "#BB430E",
      //color: "#2771CC",
      color: "white",
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    //gui.add(plane.material, "wireframe");

    /*     plane.receiveShadow = true;
    plane.castShadow = true; */
    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    /*     controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (Math.PI * 3) / 8; */

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
    ];

    points.forEach((point, i) => {
      /*       const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(...point.position);
      scene.add(cube); */

      const div = document.createElement("div");
      div.classList = "marker";

      const icon = document.createElement("div");
      icon.classList = "marker-icon";
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
      div.style.opacity = "0";
      div.style.color = "white";
      const label = new CSS2DObject(div);
      label.position.set(0, 0, 0);
      scene.add(label);
      gsap.to(label.position, {
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
      });

      icon.addEventListener("pointerdown", () =>
        history.push(`/cube/${point.name}`),
      );
    });

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    gsap.to(camera.position, { duration: 2, delay: 0, x: 22, y: 15, z: 28 });
    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 22 });

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
