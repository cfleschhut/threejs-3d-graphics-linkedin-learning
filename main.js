import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const getBox = (width, height, depth) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshPhongMaterial({
    color: 'rgb(120, 120, 120)',
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

const getPlane = (size) => {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 'rgb(120, 120, 120)',
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

const getSphere = (size) => {
  const geometry = new THREE.SphereGeometry(size, 24, 24);
  const material = new THREE.MeshBasicMaterial({
    color: 'rgb(255, 255, 255)',
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

const getPointLight = (intensity) => {
  const light = new THREE.PointLight(0xffffff, intensity);

  return light;
};

const update = (renderer, scene, camera, controls) => {
  requestAnimationFrame(() => update(renderer, scene, camera, controls));

  controls.update();

  renderer.render(scene, camera);
};

const init = () => {
  const scene = new THREE.Scene();
  const gui = new dat.GUI();

  const enableFog = false;

  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
  }

  const box = getBox(1, 1, 1);
  const plane = getPlane(20);
  const pointLight = getPointLight(1);
  const sphere = getSphere(0.05);

  plane.name = 'plane-1';

  box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = THREE.MathUtils.DEG2RAD * 90;
  pointLight.position.y = 2;
  pointLight.intensity = 1;

  gui.add(pointLight, 'intensity', 0, 10);
  gui.add(pointLight.position, 'y', 0, 5);

  scene.add(box);
  scene.add(plane);
  pointLight.add(sphere);
  scene.add(pointLight);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(1, 2, 5);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120, 120, 120)');

  document.getElementById('webgl').append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);

  return scene;
};

window.scene = init();
