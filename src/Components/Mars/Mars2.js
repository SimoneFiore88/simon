import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHistory } from "react-router-dom";
import Intro from "./../Intro/Intro";

import gsap from "gsap";

import color from "./map2k.jpg";
import height from "./bump2k.jpg";

import circle from "./circle-2.png";

import bkg1_front from "./bkg1_front.png";
import bkg1_back from "./bkg1_back.png";
import bkg1_top from "./bkg1_top.png";
import bkg1_left from "./bkg1_left.png";
import bkg1_right from "./bkg1_right.png";
import bkg1_bot from "./bkg1_bot.png";

export default function Mars2() {
  const mountRef = useRef(null);
  let history = useHistory();

  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    let selectedObject;

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

    const points = [
      {
        position: new THREE.Vector3(5.5, 0, 0),
      },
      {
        position: new THREE.Vector3(0, 0, 5.5),
      },
      {
        position: new THREE.Vector3(-3, 4.4, 2),
      },
      {
        position: new THREE.Vector3(2, -4, 3.5),
      },
    ];

    const group = new THREE.Group();
    scene.add(group);

    const spriteTexture = new THREE.TextureLoader(loadingManager).load(circle);
    const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });

    for (const point of points) {
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(...point.position);
      sprite.scale.set(0.8, 0.8, 0.8);
      group.add(sprite);
    }

    document.addEventListener("pointerdown", (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObject(group, true);
      if (intersects.length > 0) {
        const res = intersects.filter((res) => {
          return res && res.object;
        })[0];

        if (res && res.object) {
          gsap.to(camera.position, {
            duration: 1.5,
            delay: 0.2,
            x: res.object.position.x * 3,
            y: res.object.position.y * 3,
            z: res.object.position.z * 3,
          });
        }
      }
    });

    /*     mountRef.current.addEventListener("mousemove", (event) => {
      group.children.forEach((el) => el.scale.set(0.8, 0.8, 0.8));
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObject(group, true);

      if (intersects.length > 0) {
        const res = intersects.filter(function (res) {
          return res && res.object;
        })[0];

        if (res && res.object) {
          gsap.to(res.object.scale, {
            duration: 0.3,
            delay: 0,
            x: 1.2,
            y: 1.2,
            z: 1.2,
          });
        }
      }
    }); */

    let canvas = mountRef.current;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 0, -130);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
    scene.add(light);

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(15, 0, 0);

    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(10);
    //scene.add(axesHelper);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //controls.minDistance = 12;
    controls.minDistance = 5;

    controls.maxDistance = 60;
    controls.enablePan = false;
    //controls.enableZoom = false;

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const colorMat = textureLoader.load(color);
    const groundMat = textureLoader.load(height);

    const geometry = new THREE.SphereGeometry(5, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      map: colorMat,
      displacementMap: groundMat,
      bumpMap: groundMat,
      bumpScale: 0.05,
      displacementScale: 0.1,
      //wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.render(scene, camera);
    }

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      //group.children.forEach((el) => (el.material.rotation = elapsedTime));
      // Go through each point
      light1.position.x = 130 * Math.cos(elapsedTime * 0.2);
      light1.position.z = 130 * Math.sin(elapsedTime * 0.2);

      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      canvas.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {visible && (
        <Intro
          loaded={loaded}
          setLoaded={setLoaded}
          visible={visible}
          setVisible={setVisible}
          progress={progress}
        />
      )}
      <div ref={mountRef}></div>
    </>
  );
}
