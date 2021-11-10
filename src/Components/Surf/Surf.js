import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import gsap from "gsap";
import Intro2 from "../Intro2/Intro2";

import Info from "../Info/Info";

import bkg1_front from "./front.png";
import bkg1_back from "./back.png";
import bkg1_top from "./top.png";
import bkg1_left from "./left.png";
import bkg1_right from "./right.png";
import bkg1_bot from "./bottom.png";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./t.png";

import alpha from "./../../textures/grass/opacity.png";

export default function Surf() {
  const mount = useRef(null);

  const [info, setInfo] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let canvas = mount.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId;

    const scene = new THREE.Scene();

    const loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        // Wait a little
        window.setTimeout(() => setLoaded(true), 2000);
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        setProgress(Math.round(progressRatio * 100));
      },
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

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(22, 15, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.appendChild(renderer.domElement);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    //controls.enableZoom = false;
    controls.minDistance = 10;
    controls.maxDistance = 25;

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(120, 120, 60, 60);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: colorMat,
      displacementMap: groundDisplacement,
      displacementScale: 15,
      transparent: true,
      alphaMap: alphaMat,
      depthWrite: false,
      //color: "#559cc5",
      color: "#F19D00",
      color: "#dddddd",
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.name = "plane";

    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = 0;
    scene.add(plane);

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 40, 0);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
    scene.add(light);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    const clock = new THREE.Clock();

    const tick = () => {
      controls.update();

      const elapsedTime = clock.getElapsedTime();
      light1.position.x = 130 * Math.cos(elapsedTime * 0.2);
      light1.position.z = 130 * Math.sin(elapsedTime * 0.2);

      renderScene();
      frameId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    window.addEventListener("resize", handleResize);
    start();

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      canvas.removeChild(renderer.domElement);
      scene.remove(plane);
      scene.children = null;
      planeGeometry.dispose();
      planeMaterial.dispose();
    };
  }, []);

  return (
    <>
      <div className="" ref={mount} />
    </>
  );
}
