import * as THREE from 'three';

export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x4A90D9, 0.3);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xC9A96E, 2, 20);
  goldLight.position.set(5, 5, 5);
  scene.add(goldLight);

  const blueLight = new THREE.PointLight(0x4A90D9, 1.5, 20);
  blueLight.position.set(-5, -3, 4);
  scene.add(blueLight);

  // Central torus knot
  const knotGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 120, 16, 2, 3);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  // Wireframe overlay
  const wireGeo = new THREE.TorusKnotGeometry(1.52, 0.41, 60, 8, 2, 3);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xC9A96E, wireframe: true, transparent: true, opacity: 0.15 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wire);

  // Orbiting rings
  const rings = [];
  const ringData = [
    { r: 2.8, tube: 0.02, color: 0xC9A96E, tiltX: 0.4, tiltZ: 0 },
    { r: 3.2, tube: 0.015, color: 0x4A90D9, tiltX: Math.PI / 2, tiltZ: 0.6 },
    { r: 3.6, tube: 0.01, color: 0x9B59B6, tiltX: 1.1, tiltZ: 1.1 },
  ];

  ringData.forEach(d => {
    const geo = new THREE.TorusGeometry(d.r, d.tube, 8, 80);
    const mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = d.tiltX;
    ring.rotation.z = d.tiltZ;
    scene.add(ring);
    rings.push(ring);
  });

  // Floating small geometries
  const floaters = [];
  const geoms = [
    new THREE.OctahedronGeometry(0.25),
    new THREE.TetrahedronGeometry(0.2),
    new THREE.IcosahedronGeometry(0.18),
  ];

  for (let i = 0; i < 8; i++) {
    const geo = geoms[i % geoms.length];
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xC9A96E : 0x4A90D9,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const angle = (i / 8) * Math.PI * 2;
    const radius = 4 + Math.random();
    mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius * 0.3);
    mesh.userData = { angle, radius, speed: 0.3 + Math.random() * 0.3, yOff: mesh.position.y };
    scene.add(mesh);
    floaters.push(mesh);
  }

  let w = canvas.clientWidth, h = canvas.clientHeight;
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);

  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  let running = true;
  const clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    knot.rotation.y = t * 0.25;
    knot.rotation.x = t * 0.1 + mouse.y * 0.3;
    wire.rotation.y = t * 0.25;
    wire.rotation.x = knot.rotation.x;

    rings[0].rotation.y = t * 0.5;
    rings[1].rotation.z = t * 0.3;
    rings[2].rotation.x = t * 0.4;

    floaters.forEach(f => {
      f.userData.angle += f.userData.speed * 0.005;
      f.position.x = Math.cos(f.userData.angle) * f.userData.radius + mouse.x * 0.5;
      f.position.z = Math.sin(f.userData.angle) * f.userData.radius * 0.3;
      f.position.y = f.userData.yOff + Math.sin(t * 0.8 + f.userData.angle) * 0.3;
      f.rotation.y += 0.01;
    });

    goldLight.position.x = Math.sin(t * 0.5) * 6;
    goldLight.position.y = Math.cos(t * 0.3) * 4;

    renderer.render(scene, camera);
  }
  tick();

  return () => { running = false; ro.disconnect(); renderer.dispose(); };
}
