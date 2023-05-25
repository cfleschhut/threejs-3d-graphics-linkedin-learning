import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const getBox = (width, height, depth) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshPhongMaterial({
    color: 'rgb(120, 120, 120)',
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;

  return mesh;
};

const getBoxGrid = (amount, separationMultiplier) => {
  const group = new THREE.Group();

  for (let i = 0; i < amount; i++) {
    const obj = getBox(1, 1, 1);

    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;

    group.add(obj);

    for (let j = 0; j < amount; j++) {
      const obj = getBox(1, 1, 1);

      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.position.z = j * separationMultiplier;

      group.add(obj);
    }
  }

  group.position.x = -((amount - 1) * separationMultiplier) / 2;
  group.position.z = -((amount - 1) * separationMultiplier) / 2;

  return group;
};

const getPlane = (size) => {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 'rgb(120, 120, 120)',
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;

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
  light.castShadow = true;

  return light;
};

const getSpotLight = (intensity) => {
  const light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

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

  const boxGrid = getBoxGrid(10, 1.5);
  const plane = getPlane(20);
  const spotLight = getSpotLight(1);
  const sphere = getSphere(0.05);

  plane.name = 'plane-1';

  plane.rotation.x = THREE.MathUtils.DEG2RAD * 90;
  spotLight.position.y = 4;
  spotLight.intensity = 2;

  gui.add(spotLight.position, 'x', 0, 20);
  gui.add(spotLight.position, 'y', 0, 20);
  gui.add(spotLight.position, 'z', 0, 20);
  gui.add(spotLight, 'intensity', 0, 10);
  gui.add(spotLight, 'penumbra', 0, 1);

  scene.add(boxGrid);
  scene.add(plane);
  spotLight.add(sphere);
  scene.add(spotLight);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(1, 2, 5);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120, 120, 120)');

  document.getElementById('webgl').append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);

  return scene;
};

window.scene = init();
