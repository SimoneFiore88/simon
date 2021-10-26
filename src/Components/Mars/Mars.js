import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from "gsap";

import color from "./map2k.jpg";
import height from "./bump2k.jpg";

export default function Mars() {
  const mountRef = useRef(null);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const points = [
      {
        position: new THREE.Vector3(5.1, 0, 0),
        element: document.querySelector(".point-0"),
      },
      {
        position: new THREE.Vector3(4, 3, 2),
        element: document.querySelector(".point-1"),
      },
      {
        position: new THREE.Vector3(-3, 4, 2),
        element: document.querySelector(".point-2"),
      },
      {
        position: new THREE.Vector3(0, 3.8, -3.7),
        element: document.querySelector(".point-3"),
      },
    ];
    let canvas = mountRef.current;

    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(10, 0, -130);
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
    camera.position.set(10, 5, 0);

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
    controls.minDistance = 10;

    controls.maxDistance = 60;
    controls.enablePan = false;

    const textureLoader = new THREE.TextureLoader();
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

    // animation loop
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      /*       camera.position.x = 15 * Math.cos(elapsedTime * 0.1);
      camera.position.z = 15 * Math.sin(elapsedTime * 0.1); */

      controls.update();

      // Go through each point
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
          if (translateX > 0) {
            point.element.children[0].classList = "label marker-right";
          } else {
            point.element.children[0].classList = "label marker-left";
          }
        }
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }

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
      <div className="point point-0 ">
        <div className="label">1</div>
        <div className="text">
          Front and top screen with HUD aggregating terrain and battle
          informations.
        </div>
      </div>
      <div className="point point-1">
        <div className="label">2</div>
        <div className="text">
          Ventilation with air purifier and detection of environment toxicity.
        </div>
      </div>
      <div className="point point-2">
        <div className="label">3</div>
        <div className="text">
          Cameras supporting night vision and heat vision with automatic
          adjustment.
        </div>
      </div>
      <div className="point point-3">
        <div className="label">4</div>
        <div className="text">
          Cameras supporting night vision and heat vision with automatic
          adjustment.
        </div>
      </div>
      <div ref={mountRef}></div>
    </>
  );
}
