import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import color from "./../../textures/grass/mount.jpeg";
import displacement from "./../../textures/grass/height.gif";

import alpha from "./../../textures/grass/test_b_alpha.jpeg";
import mark from "./../../textures/grass/flare.png";

import bkg1_front from "./bkg1_front.png";
import bkg1_back from "./bkg1_back.png";
import bkg1_top from "./bkg1_top.png";
import bkg1_left from "./bkg1_left.png";
import bkg1_right from "./bkg1_right.png";
import bkg1_bot from "./bkg1_bot.png";

import model from "./../../iss/source/normal.glb";

export default function Plane() {
  const mountRef = useRef(null);

  useEffect(() => {
    let canvas = mountRef.current;
    const scene = new THREE.Scene();

    let frameId;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      //100,
      1000,
    );

    {
      const loader = new THREE.CubeTextureLoader();
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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    canvas.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(55);
    //scene.add(axesHelper);

    camera.position.set(40, 0, 0);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    plane.rotation.x = -Math.PI * 0.5;

    //scene.add(plane);

    //const controls = new OrbitControls(camera, renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    /*     gsap.to(camera.position, { duration: 2, delay: 0, x: 22, y: 15, z: 28 });
    gsap.to(plane.material, { duration: 2, delay: 1, displacementScale: 12 });
 */
    //camera.position.set(22, 15, 28);

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      /* console.log(elapsedTime);
      if (elapsedTime > 10) scene.remove(plane); */

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

    /*     return () => {
      console.log("remove");
      canvas.removeChild(renderer.domElement);
      console.log(document.querySelectorAll(".marker"));
      document
        .querySelectorAll(".marker")
        .forEach((e) => e.parentElement.removeChild(e));
      console.log(mountRef);
    }; */
  }, []);

  return (
    <>
      <div ref={mountRef}></div>
    </>
  );
}
