import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useHistory } from "react-router-dom";

import gsap from "gsap";

import colorImp from "./4kcolor.jpeg";
import heightImp from "./4kdis.jpeg";

import useData from "../Hooks/useData";

export default function Earth() {
  const mount = useRef(null);

  const controls = useRef(null);

  const [coords, setCoords] = useState(null);
  const [sun, setSun] = useState(null);
  const [data, setData] = useState(null);

  const { dataUse } = useData();

  console.log(dataUse);

  useEffect(() => {
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
      .then((data) => data.json())
      .then((data) => {
        setData(data);
        const phi = (90 - data.latitude) * (Math.PI / 180);
        const theta = (data.longitude + 180) * (Math.PI / 180);

        let x = -(5.3 * Math.sin(phi) * Math.cos(theta));
        let z = 5.3 * Math.sin(phi) * Math.sin(theta);
        let y = 5.3 * Math.cos(phi);

        const phiSun = (90 - data.solar_lat) * (Math.PI / 180);
        const thetaSun = (data.solar_lon + 180) * (Math.PI / 180);

        let xS = -(15.3 * Math.sin(phiSun) * Math.cos(thetaSun));
        let zS = 15.3 * Math.sin(phiSun) * Math.sin(thetaSun);
        let yS = 15.3 * Math.cos(phiSun);

        setCoords({ x, z, y });
        setSun({ xS, zS, yS });
      });
  }, []);

  useEffect(() => {
    let canvas = mount.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId;

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
    //controls.enableZoom = false;

    const axesHelper = new THREE.AxesHelper(15);
    //scene.add(axesHelper);

    if (coords) {
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshStandardMaterial({ color: "green" }),
      );
      sat.position.set(coords.x, coords.z, coords.y);

      scene.add(sat);
    }
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

    if (sun) {
      const light1 = new THREE.PointLight(0xffffff, 1);
      light1.position.set(sun.xS, sun.zS, sun.yS);
      scene.add(light1);
    }

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

    const clock = new THREE.Clock();
    const tick = () => {
      /* const elapsedTime = clock.getElapsedTime();
      sat.position.set(
        Math.cos(elapsedTime) * 8,
        Math.cos(elapsedTime),
        Math.sin(elapsedTime) * 6,
      ); */
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
  }, [coords, sun]);

  return (
    <>
      <div className="absolute bottom-2 right-2 z-50 text-white">
        Latitude: {data && data.latitude} <br />
        Longitude: {data && data.longitude}
        <p>{dataUse && dataUse.latitude}</p>
      </div>
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
