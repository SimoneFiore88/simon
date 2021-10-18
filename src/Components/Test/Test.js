import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";
import alpha from "./../../textures/grass/opacity.png";

import gsap from "gsap";

const Test = () => {
  const otherRef = useRef(null);

  useEffect(() => {
    let temp = otherRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    console.log(controls);

    renderer.setSize(window.innerWidth, window.innerHeight);
    otherRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    const textureLoader = new THREE.TextureLoader();
    const groundDisplacement = textureLoader.load(displacement);
    const alphaMat = textureLoader.load(alpha);
    const colorMat = textureLoader.load(color);

    const planeGeometry = new THREE.PlaneBufferGeometry(60, 60, 80, 80);
    const planeMaterial = new THREE.MeshPhongMaterial({
      //map: colorMat,
      displacementMap: groundDisplacement,
      displacementScale: 1,
      //bumpMap: groundDisplacement,
      //bumpScale: 1,
      transparent: true,
      alphaMap: alphaMat,
      wireframe: false,
      depthWrite: false,
      color: "cyan",
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI * 0.5;

    scene.add(plane);

    const light = new THREE.AmbientLight(0xffffff, 30, 50);
    light.position.set(0, 20, 0);

    scene.add(light);

    camera.position.set(22, 10, 28);

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

    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 12 });
    const animate = function () {
      for (const point of points) {
        const screenPosition = point.position.clone();
        screenPosition.project(camera);
        const translateX = screenPosition.x * window.innerWidth * 0.5;
        const translateY = -screenPosition.y * window.innerHeight * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }

      controls.update();
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
      /*       cube.rotation.x += 0.01;
      cube.rotation.y += 0.01; */
    };

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    animate();

    //return () => temp.current.removeChild(renderer.domElement);
    return () => {
      console.log("remove");
      temp.removeChild(renderer.domElement);
      console.log(document.querySelectorAll(".marker"));
      document
        .querySelectorAll(".marker")
        .forEach((e) => e.parentElement.removeChild(e));
    };
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
          <i className="fal fa-map-marker-exclamation"></i>
        </div>
        <div className="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>
      <div ref={otherRef}></div>
    </div>
  );
};

export default Test;
