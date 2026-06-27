import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 1, 5);

  // Controls — orbit con el mouse
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = true;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.target.set(0, 0.5, 0);

  // Luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
  keyLight.position.set(4, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x4A90D9, 0.8);
  fillLight.position.set(-4, 2, -2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xC9A96E, 1.2, 15);
  rimLight.position.set(0, 4, -3);
  scene.add(rimLight);

  // Plataforma sutil bajo el modelo
  const platformGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.05, 64);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.7,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -1.025;
  platform.receiveShadow = true;
  scene.add(platform);

  // Anillo dorado bajo la plataforma
  const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xC9A96E, transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.025;
  scene.add(ring);

  // Spinner de carga
  const loadingEl = document.createElement('div');
  loadingEl.style.cssText = `
    position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:12px; pointer-events:none;
  `;
  loadingEl.innerHTML = `
    <div style="width:32px;height:32px;border:2px solid #7a6240;border-top-color:#C9A96E;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#7a6240;letter-spacing:0.2em;">CARGANDO MODELO...</span>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;
  canvas.parentElement.style.position = 'relative';
  canvas.parentElement.appendChild(loadingEl);

  // Cargar modelo
  const loader = new GLTFLoader();
  loader.load(
    '/models/Perro_Cartoon_texturizado.glb',
    (gltf) => {
      loadingEl.remove();

      const model = gltf.scene;

      // Centrar y escalar automáticamente
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.0 / maxDim;
      model.scale.setScalar(scale);
      // Centrar completamente en el origen (X, Y, Z)
      model.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );

      // Mapa de colores por nombre de material
      const colorMap = {
        'Azul claro':   { color: 0xa6afb8, emissive: null,     roughness: 0.75 },
        'Azul claroo':  { color: 0x68abbe, emissive: null,     roughness: 0.75 },
        'Azul oscuroo': { color: 0x333940, emissive: null,     roughness: 0.80 },
        'Negro':        { color: 0x111111, emissive: null,     roughness: 0.90 },
        'Emision':      { color: 0x111111, emissive: 0x111111, roughness: 0.40 },
      };

      model.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const applyColor = (mat) => {
            const cfg = colorMap[mat.name] ?? { color: 0x5DDDD8, emissive: null, roughness: 0.75 };
            mat.color = new THREE.Color(cfg.color);
            mat.metalness = 0.05;
            mat.roughness = cfg.roughness;
            if (cfg.emissive) {
              mat.emissive = new THREE.Color(cfg.emissive);
              mat.emissiveIntensity = 0.5;
            }
            mat.needsUpdate = true;
          };

          if (Array.isArray(child.material)) {
            child.material.forEach(applyColor);
          } else {
            applyColor(child.material);
          }
        }
      });

      scene.add(model);

      // Centrar cámara al centro real del modelo ya escalado
      const finalBox = new THREE.Box3().setFromObject(model);
      const finalCenter = finalBox.getCenter(new THREE.Vector3());
      const finalSize = finalBox.getSize(new THREE.Vector3());
      controls.target.copy(finalCenter);
      camera.position.set(finalCenter.x, finalCenter.y, finalSize.z * 2.8);
      controls.update();
    },
    (progress) => {
      if (progress.total > 0) {
        const pct = Math.round((progress.loaded / progress.total) * 100);
        const span = loadingEl.querySelector('span');
        if (span) span.textContent = `CARGANDO... ${pct}%`;
      }
    },
    (error) => {
      console.error('Error cargando modelo:', error);
      loadingEl.innerHTML = `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#C9A96E;">ERROR AL CARGAR MODELO</span>`;
    }
  );

  // Resize
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

    // Pulso suave del anillo dorado
    ring.material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
    ring.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);

    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  return () => { running = false; ro.disconnect(); controls.dispose(); renderer.dispose(); };
}