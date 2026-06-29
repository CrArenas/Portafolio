import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initCardScene(canvas, project) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
  camera.position.z = 4;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x4A90D9, 0.6);
  fillLight.position.set(-3, 1, -2);
  scene.add(fillLight);

  // Plataforma
  const platformGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.04, 64);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  scene.add(platform);

  // Anillo
  const ringGeo = new THREE.TorusGeometry(1.1, 0.015, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xC9A96E, transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  const fallbackColor = new THREE.Color(project.color);

  function loadFallback() {
    let geo;
    switch (project.geometry) {
      case 'torus': geo = new THREE.TorusGeometry(1, 0.35, 16, 60); break;
      case 'box':   geo = new THREE.BoxGeometry(1.5, 1.5, 1.5); break;
      default:      geo = new THREE.IcosahedronGeometry(1.2, 1);
    }
    const mat = new THREE.MeshStandardMaterial({ color: fallbackColor, metalness: 0.7, roughness: 0.2 });
    scene.add(new THREE.Mesh(geo, mat));
    const wireMat = new THREE.MeshBasicMaterial({ color: fallbackColor, wireframe: true, transparent: true, opacity: 0.12 });
    const wire = new THREE.Mesh(geo, wireMat);
    wire.scale.setScalar(1.02);
    scene.add(wire);
  }

  if (project.file) {
    const basePath = project.basePath || '/modelos-3d/';
    const loader = new GLTFLoader();
    loader.load(
      `${basePath}${project.file}`,
      (gltf) => {
        const model = gltf.scene;

        // Centrar y escalar
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.8 / maxDim;
        model.scale.setScalar(scale);
        model.position.set(
          -center.x * scale,
          -center.y * scale,
          -center.z * scale
        );

        // Aplicar colorMap si el modelo lo tiene definido
        if (project.colorMap) {
          model.traverse(child => {
            if (!child.isMesh) return;
            const applyMat = (mat) => {
              const cfg = project.colorMap[mat.name];
              if (cfg) {
                mat.color = new THREE.Color(cfg.color);
                mat.roughness = cfg.roughness ?? 0.8;
                mat.metalness = 0.05;
                if (cfg.emissive) {
                  mat.emissive = new THREE.Color(cfg.emissive);
                  mat.emissiveIntensity = 0.5;
                }
                mat.needsUpdate = true;
              }
            };
            if (Array.isArray(child.material)) child.material.forEach(applyMat);
            else applyMat(child.material);
          });
        }

        scene.add(model);

        // Posicionar plataforma y anillo en la base
        const finalBox = new THREE.Box3().setFromObject(model);
        const bottomY = finalBox.min.y;
        platform.position.y = bottomY - 0.04;
        ring.position.y = bottomY - 0.02;

        // Ajustar cámara
        const finalSize = finalBox.getSize(new THREE.Vector3());
        camera.position.z = Math.max(finalSize.z * 2.5, 3);
        controls.update();
      },
      null,
      () => loadFallback()
    );
  } else {
    loadFallback();
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);

  let running = true;
  const clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    ring.material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
    ring.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  return () => { running = false; ro.disconnect(); controls.dispose(); renderer.dispose(); };
}