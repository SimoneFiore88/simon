import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import gsap from "gsap";
import Intro2 from "./../Intro2/Intro2";

import color from "./8kcolor.jpeg";
import normal from "./8knormal.jpg";
import ground from "./moonbump4k.jpg";

import Info from "../Info/Info";

import bkg1_front from "./front.png";
import bkg1_back from "./back.png";
import bkg1_top from "./top.png";
import bkg1_left from "./left.png";
import bkg1_right from "./right.png";
import bkg1_bot from "./bottom.png";

import sound from "./sound2.wav";

export default function Main() {
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

    const raycaster = new THREE.Raycaster();

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

    let points = [
      {
        position: new THREE.Vector3(0, 0, 5.1),
        icon: "<i class='fal fa-user'></i>",
        name: "Bio",
        text: "I don't think we've met. \nMy name is Simone Fiore, but everyone calls me Fiore.",
      },
      {
        position: new THREE.Vector3(0, 5.1, 2),
        icon: "<i class='fal fa-code'></i>",

        name: "Occupation",
        text: "Frontend developer and teacher.",
      },
      {
        position: new THREE.Vector3(-3, 4, 2),
        icon: "<i class='fal fa-telescope'></i>",

        name: "Hobbies",
        text: "CS, Space&Science and many other things.",
      },
      {
        position: new THREE.Vector3(2, -4, 3),
        icon: "<i class='fab fa-node-js'></i>",

        name: "JavaScript",
        text: "Everywhere!",
      },
    ];

    const cubeLabel = [];

    const geometry1 = new THREE.SphereGeometry(0.05, 8, 6);
    const material1 = new THREE.MeshBasicMaterial({
      color: 0x2696e7,
      wireframe: true,
    });
    points.forEach((point, i) => {
      const cube = new THREE.Mesh(geometry1, material1);
      cube.position.set(...point.position);
      scene.add(cube);

      const div = document.createElement("div");
      div.classList = "mark";

      const icon = document.createElement("div");
      icon.classList = "mark-icon";
      icon.innerHTML = point.icon;

      div.appendChild(icon);

      const label = new CSS2DObject(div);

      label.position.set(point.position.x, point.position.y, point.position.z);
      scene.add(label);

      cubeLabel.push([cube, label]);

      icon.addEventListener("pointerdown", () => {
        new Audio(sound).play();
        gsap.to(camera.position, {
          duration: 1.2,
          delay: 0,
          x: point.position.x * 3,
          y: point.position.y * 3,
          z: point.position.z * 3,
        });

        setInfo(i);
      });
    });

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(15, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    canvas.appendChild(labelRenderer.domElement);

    // controls
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    //controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    //controls.enableZoom = false;
    controls.minDistance = 10;
    controls.maxDistance = 25;

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const colorMat = textureLoader.load(color);
    const normalMat = textureLoader.load(normal);
    const groundMat = textureLoader.load(ground);

    const geometry = new THREE.SphereGeometry(5, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      map: colorMat,
      normalMap: normalMat,
      bumpMap: groundMat,
      bumpScale: 0.05,
      //wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 0, -130);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
    scene.add(light);

    const renderScene = () => {
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    function getScreenPos(object) {
      const pos = object.position.clone();
      camera.updateMatrixWorld();
      pos.project(camera);
      return new THREE.Vector2(pos.x, pos.y);
    }

    function isOccluded(object) {
      raycaster.setFromCamera(getScreenPos(object), camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects[0] && intersects[0].object === object) {
        return false;
      } else {
        return true;
      }
    }

    const clock = new THREE.Clock();

    const tick = () => {
      controls.update();

      const elapsedTime = clock.getElapsedTime();
      light1.position.x = 130 * Math.cos(elapsedTime * 0.2);
      light1.position.z = 130 * Math.sin(elapsedTime * 0.2);

      cubeLabel.forEach((el) => {
        if (isOccluded(el[0])) {
          el[1].visible = false;
        } else {
          el[1].visible = true;
        }
      });

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
      canvas.removeChild(renderer.domElement);
      canvas.removeChild(labelRenderer.domElement);

      scene.remove(sphere);
      scene.children = null;
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <>
      {visible && (
        <Intro2
          loaded={loaded}
          setLoaded={setLoaded}
          visible={visible}
          setVisible={setVisible}
          progress={progress}
        />
      )}
      {info >= 0 && <Info id={info} setInfo={setInfo} />}

      <div className="" ref={mount} />
    </>
  );
}
