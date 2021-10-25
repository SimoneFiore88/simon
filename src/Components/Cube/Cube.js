import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function App() {
  const mountRef = useRef(null);
  let { shape } = useParams();

  console.log(shape);

  useEffect(() => {
    let temp = mountRef.current;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    let renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    temp.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    //let geometry = new THREE.BoxGeometry(1, 1, 1);
    let geometry;

    if (shape === "d6") geometry = new THREE.BoxGeometry(2, 2, 2);
    if (shape === "d4") geometry = new THREE.TetrahedronGeometry(2, 0);
    let material = new THREE.MeshBasicMaterial({
      color: 0x559cc5,
      wireframe: true,
    });
    let cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => temp.removeChild(renderer.domElement);
  }, [shape]);

  return <div ref={mountRef}></div>;
}
