import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHistory } from "react-router-dom";
import Intro from "./../Intro/Intro";
import Intro2 from "./../Intro2/Intro2";

import gsap from "gsap";

import color from "./8kcolor.jpeg";
import height from "./8knormal.jpg";
import ground from "./moonbump4k.jpg";

import circle from "./mark.png";

import bkg1_front from "./front.png";
import bkg1_back from "./back.png";
import bkg1_top from "./top.png";
import bkg1_left from "./left.png";
import bkg1_right from "./right.png";
import bkg1_bot from "./bottom.png";

export default function In() {
  const mountRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();

    let frameId;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const points = [
      {
        position: new THREE.Vector3(0, 0, 5.1),
        element: document.querySelector(".point-0"),
      },
      {
        position: new THREE.Vector3(5.1, 0, 0),
        element: document.querySelector(".point-1"),
      },
      {
        position: new THREE.Vector3(-3, 4, 2),
        element: document.querySelector(".point-2"),
      },
      {
        position: new THREE.Vector3(2, -4, 3),
        element: document.querySelector(".point-3"),
      },
    ];

    let canvas = mountRef.current;

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
    controls.minDistance = 12;

    controls.maxDistance = 60;
    controls.enablePan = false;
    //controls.enableZoom = false;

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const colorMat = textureLoader.load(color);
    const normalMat = textureLoader.load(height);
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

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.render(scene, camera);
    }

    for (const point of points) {
      point.element.addEventListener("pointerdown", () =>
        //history.push("/surface"),

        gsap.to(camera.position, {
          duration: 1,
          delay: 0,
          x: point.position.x * 3,
          y: point.position.y * 3,
          z: point.position.z * 3,
        }),
      );
    }

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      //group.children.forEach((el) => (el.material.rotation = elapsedTime));
      // Go through each point
      light1.position.x = 130 * Math.cos(elapsedTime * 0.5);
      light1.position.z = 130 * Math.sin(elapsedTime * 0.5);

      for (const point of points) {
        // Get 2D screen position
        const screenPosition = point.position.clone();

        screenPosition.project(camera);

        // Set the raycaster
        raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        // No intersect found
        if (intersects.length === 0) {
          // Show
          point.element.classList.add("visible");
        }

        // Intersect found
        else {
          // Get the distance of the intersection and the distance of the point
          const intersectionDistance = intersects[0].distance;
          const pointDistance = point.position.distanceTo(camera.position);

          // Intersection is close than the point
          if (intersectionDistance < pointDistance) {
            // Hide
            point.element.classList.remove("visible");
          }
          // Intersection is further than the point
          else {
            // Show
            point.element.classList.add("visible");
          }
        }

        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = -screenPosition.y * sizes.height * 0.5;

        if (point.element.classList.contains("visible")) {
          point.element.classList.add("marker-left");
        } else {
          point.element.classList.remove("marker-left");
        }

        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
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
      <div className="point point-0 ">
        <div className="label">
          <i className="fal fa-user"></i>
        </div>
        {/* <div className="text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </div> */}
      </div>
      <div className="point point-1">
        <div className="label">
          <i className="fal fa-code"></i>
        </div>
        {/* <div className="text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </div> */}
      </div>
      <div className="point point-2">
        <div className="label">
          <i className="fal fa-telescope"></i>
        </div>
        {/* <div className="text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </div> */}
      </div>
      <div className="point point-3">
        <div className="label">
          <i className="fal fa-cube"></i>
        </div>
        {/* <div className="text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </div> */}
      </div>
      <div ref={mountRef}></div>
    </>
  );
}
