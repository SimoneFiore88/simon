import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";

import alpha from "./../../textures/grass/test_b_alpha.jpeg";
import mark from "./../../textures/grass/flare.png";

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

import model from "./../../iss/source/cube.glb";

export default function Model() {
  let history = useHistory();

  const mountRef = useRef(null);

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
        /* setTimeout(() => {
          gsap.to(plane.material, {
            duration: 2,
            delay: 1,
            displacementScale: 12,
          });
        }, 2000); */
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        console.log(Math.round(progressRatio * 100));
      },
    );

    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          // child.material.envMap = environmentMap
          //child.material.envMapIntensity = debugObject.envMapIntensity;

          child.material.depthWrite = false;
          child.material.depthTest = false;
          child.material.wireframe = true;

          child.material.color = new THREE.Color("rgb(255, 255, 255)");
          child.material.side = THREE.DoubleSide;
          child.material.shininess = 0;
        }
      });
    };

    const gltfLoader = new GLTFLoader(loadingManager);

    gltfLoader.load(model, (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.x = 1.57 / 2;
      scene.add(gltf.scene);

      updateAllMaterials();
    });

    const light1 = new THREE.PointLight(0xff0000, 4);
    light1.position.set(60, 0, 0);
    //scene.add(light1);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(120, 0, 0);

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);

    /*     const light12 = new THREE.PointLight(0x00ff00, 4);
    light12.position.set(-60, 0, 0);
    scene.add(light12); */

    const light = new THREE.AmbientLight(0x00ff00, 12); // soft white light
    //scene.add(light);

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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(55);
    //scene.add(axesHelper);

    camera.position.set(140, 0, 0);

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

    //scene.add(plane);

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
    //controls.maxDistance = 60;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
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
        camera.position.x = 140 * Math.cos(elapsedTime * 0.3);
        camera.position.z = 140 * Math.sin(elapsedTime * 0.3);
      }

      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      frameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      frameId = null;
      canvas.removeChild(renderer.domElement);
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
      <div ref={mountRef}></div>
    </>
  );
}
