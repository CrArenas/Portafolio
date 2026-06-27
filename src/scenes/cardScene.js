import * as THREE from 'three';

export function initCardScene(canvas, project) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
  camera.position.z = 4;

  const light = new THREE.PointLight(0xffffff, 2, 20);
  light.position.set(3, 3, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x4A90D9, 0.5));

  const color = new THREE.Color(project.color);

  let geo;
  switch (project.geometry) {
    case 'torus':   geo = new THREE.TorusGeometry(1, 0.35, 16, 60); break;
    case 'box':     geo = new THREE.BoxGeometry(1.5, 1.5, 1.5); break;
    default:        geo = new THREE.IcosahedronGeometry(1.2, 1);
  }

  const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // wireframe
  const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 });
  const wireMesh = new THREE.Mesh(geo, wireMat);
  wireMesh.scale.setScalar(1.02);
  scene.add(wireMesh);

  let w = canvas.clientWidth, h = canvas.clientHeight;
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();

  let running = true;
  const clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    mesh.rotation.y = t * 0.5;
    mesh.rotation.x = t * 0.2;
    wireMesh.rotation.copy(mesh.rotation);
    renderer.render(scene, camera);
  }
  tick();

  return () => { running = false; renderer.dispose(); };
}
