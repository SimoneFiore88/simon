import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHistory } from "react-router-dom";

import gsap from "gsap";

import colorImp from "./map2k.jpg";
import heightImp from "./bump2k.jpg";

export default function Home() {
  const mount = useRef(null);

  const controls = useRef(null);

  useEffect(() => {
    let canvas = mount.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId;

    console.log(width, height);
    const raycaster = new THREE.Raycaster();

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(15, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.target.set(10, 15, 80);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;

    const textureLoader = new THREE.TextureLoader();
    const colorMat = textureLoader.load(colorImp);
    const groundMat = textureLoader.load(heightImp);
    const geometry = new THREE.SphereGeometry(5, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      map: colorMat,
      displacementMap: groundMat,
      bumpMap: groundMat,
      bumpScale: 0.15,
      displacementScale: 0.1,
      //wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(10, 0, -130);
    scene.add(light1);

    const light = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
    scene.add(light);

    renderer.setClearColor("#000000");
    renderer.setSize(width, height);

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

    const tick = () => {
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

        const translateX = screenPosition.x * width * 0.5;
        const translateY = -screenPosition.y * height * 0.5;

        if (point.element.classList.contains("visible")) {
          point.element.classList.add("marker-left");
        } else {
          point.element.classList.remove("marker-left");
        }

        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      }

      controls.update();
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

    canvas.appendChild(renderer.domElement);
    window.addEventListener("resize", handleResize);
    start();

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      canvas.removeChild(renderer.domElement);

      scene.remove(sphere);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <>
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
      <div className="" ref={mount} />
    </>
  );
}
