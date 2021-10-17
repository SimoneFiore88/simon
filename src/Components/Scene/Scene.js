import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";
import alpha from "./../../textures/grass/opacity.png";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    let temp = mountRef.current;
    const scene = new THREE.Scene();

    /*     const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 15, 0);
    scene.add(light); */

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(22, 10, 28);
    camera.lookAt(0, 0, 0);

    const light = new THREE.AmbientLight(0xffffff, 30, 50);
    light.position.set(0, 20, 0);

    scene.add(light);

    const textureLoader = new THREE.TextureLoader();
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(60, 60, 120, 120);
    const planeMaterial = new THREE.MeshPhongMaterial({
      //map: colorMat,
      displacementMap: groundDisplacement,
      displacementScale: 1,
      //bumpMap: groundDisplacement,
      //bumpScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      wireframe: true,
      depthWrite: false,
      color: "cyan",
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    /*     plane.receiveShadow = true;
    plane.castShadow = true; */
    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(1000, 20);
    //scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //controls.enableZoom = false;
    //controls.enablePan = false;

    const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: "#d3d3d3",
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.y = 1;
    moon.castShadow = true;
    moon.receiveShadow = true;
    //scene.add(moon);

    /**
     * Points of interest
     */
    const raycaster = new THREE.Raycaster();
    const points = [
      {
        position: new THREE.Vector3(16, 12, 16),
        element: document.querySelector(".point-0"),
      },
      {
        position: new THREE.Vector3(-15, 9, 10),
        element: document.querySelector(".point-1"),
      },
      {
        position: new THREE.Vector3(8, 9, -10),
        element: document.querySelector(".point-2"),
      },
    ];

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    gsap.to(camera.position, { duration: 2, delay: 2, x: 25, y: 15, z: 25 });
    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 12 });

    const clock = new THREE.Clock();

    const tick = () => {
      /*       const elapsedTime = clock.getElapsedTime();

      moon.position.x = 10 * Math.cos(elapsedTime);
      moon.position.z = 10 * Math.sin(elapsedTime);
      moon.position.y = 10 * Math.sin(elapsedTime);
 */
      //if (elapsedTime > 5) plane.rotation.z += 0.001;

      for (const point of points) {
        const screenPosition = point.position.clone();
        screenPosition.project(camera);

        /*         raycaster.setFromCamera(screenPosition, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length === 0) {
          point.element.classList.add("visible");
        } else {
          const intersectionDistance = intersects[0].distance;
          const pointDistance = point.position.distanceTo(camera.position);

          if (intersectionDistance < pointDistance) {
            point.element.classList.remove("visible");
          } else {
            point.element.classList.add("visible");
          }
        } */

        const translateX = screenPosition.x * window.innerWidth * 0.5;
        const translateY = -screenPosition.y * window.innerHeight * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }
      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => temp.removeChild(renderer.domElement);
  }, []);

  return (
    <div>
      <div className="point point-0">
        <div className="label">
          <i className="fal fa-home"></i>
        </div>
        <div className="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          exercitationem corrupti incidunt quis atque consequatur,
          necessitatibus mollitia unde accusantium harum consequuntur
          voluptatibus molestiae veritatis error. Ipsa alias inventore ut
          dolorem.
        </div>
      </div>
      <div className="point point-1">
        <div className="label">
          <i className="fal fa-arrow-to-bottom"></i>
        </div>
        <div className="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
          exercitationem.
        </div>
      </div>
      <div className="point point-2">
        <div className="label">
          <i class="fal fa-map-marker-exclamation"></i>
        </div>
        <div className="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
      <div ref={mountRef}></div>
    </div>
  );
}
