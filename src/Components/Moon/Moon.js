import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from "gsap";

import color from "./map2k.jpg";
import height from "./bump2k.jpg";

export default function Moon() {
  const mountRef = useRef(null);

  useEffect(() => {
    let canvas = mountRef.current;

    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let INTERSECTED;

    /*     document.addEventListener("mousemove", onPointerMove);
    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    } */

    function onDocumentMouseDown(event) {
      event.preventDefault();

      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(scene.children, false);

      if (intersects.length > 0) {
        if (intersects[0].object.name) intersects[0].object.callback();
      }
    }
    document.addEventListener("click", onDocumentMouseDown);

    const loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        // Wait a little
        setTimeout(() => {
          console.log("loaded");

          //camera.position.set(10, 5, 10);

          gsap.to(camera.position, {
            duration: 5,
            delay: 0,
            x: 10,
            y: 5,
            z: 10,
          });

          gsap.to(controls.target, {
            duration: 2,
            delay: 0,
            x: 0,
            y: 0,
            z: 0,
          });
        }, 2000);
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        console.log(Math.round(progressRatio * 100));
      },
    );

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(0, 15, 0);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
    scene.add(light);

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(60, 60, 0);

    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(10);
    //scene.add(axesHelper);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //controls.minDistance = 12;
    controls.minDistance = 10;

    controls.maxDistance = 60;
    controls.enablePan = false;

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

    const geometry1 = new THREE.SphereGeometry(0.1, 16, 16);
    const material1 = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      //wireframe: true,
    });

    let points = [
      {
        position: new THREE.Vector3(3.7, 0, 3.8),
        icon: "<i class='fal fa-user'></i>",
        name: "Bio",
        text: "I don't think we've met. \nMy name is Simone Fiore, but everyone calls me Fiore.",
      },
      {
        position: new THREE.Vector3(4, 3, 2),
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
        position: new THREE.Vector3(0, 3.8, -3.7),
        icon: "<i class='fab fa-node-js'></i>",

        name: "JavaScript",
        text: "Everywhere!",
      },
    ];

    points.forEach((point) => {
      const sphere1 = new THREE.Mesh(geometry1, material1);
      sphere1.position.set(...point.position);
      sphere1.name = point.name;
      sphere1.callback = function () {
        alert(point.name);
      };

      scene.add(sphere1);
    });

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    // animation loop
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      /*       camera.position.x = 15 * Math.cos(elapsedTime * 0.1);
      camera.position.z = 15 * Math.sin(elapsedTime * 0.1); */

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

  return <div ref={mountRef}></div>;
}
