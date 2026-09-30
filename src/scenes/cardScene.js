import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { animate, utils } from 'animejs';
import 'animejs/adapters/three'; // registra Object3D/Material como targets animables
import { prefersReducedMotion } from '../utils/motion.js';

// Guarda en memoria los .glb descargados: las tarjetas se recrean cada vez
// que se entra a la página y así no se vuelven a descargar.
THREE.Cache.enabled = true;

// Un solo loader para todas las tarjetas: el decodificador Draco (local,
// empaquetado por Vite) arranca sus workers una vez y se reutilizan.
const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader);

// Libera geometrías, materiales y texturas de un objeto y sus hijos.
function disposeObject(root) {
  root.traverse(child => {
    child.geometry?.dispose();
    const mats = Array.isArray(child.material) ? child.material : child.material ? [child.material] : [];
    mats.forEach(mat => {
      Object.values(mat).forEach(value => value?.isTexture && value.dispose());
      mat.dispose();
    });
  });
}

// model: ver src/content.config.js (colección "models")
// onProgress(0..1) y onLoad() permiten mostrar el estado de carga.
export function initCardScene(canvas, model, { onProgress, onLoad } = {}) {
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
  controls.autoRotate = !prefersReducedMotion;
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
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 1.0, 0.04, 64),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7 }),
  );
  scene.add(platform);

  // Anillo
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.015, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xC9A96E, transparent: true, opacity: 0.5 }),
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // Plataforma y anillo aparecen junto con el modelo (mientras carga, el
  // anillo visto de canto es una línea que cruza el indicador de carga).
  const showModel = () => {
    platform.visible = ring.visible = true;
    onLoad?.();
  };
  platform.visible = ring.visible = false;

  // Guarda toda animación de Anime.js creada en esta escena para poder
  // detenerla/limpiarla cuando la tarjeta se destruye (evita leaks).
  const cardAnims = [];

  // Pulso del anillo (adaptador de Three.js de Anime.js)
  if (!prefersReducedMotion) {
    cardAnims.push(
      animate(ring.material, { opacity: [0.3, 0.5], duration: 1600, ease: 'inOutSine', loop: true, alternate: true })
    );
    cardAnims.push(
      animate(ring.scale, { x: 1.02, y: 1.02, z: 1.02, duration: 2000, ease: 'inOutSine', loop: true, alternate: true })
    );
  }

  // Si el .glb no carga se muestra un icosaedro del color del modelo
  function loadFallback() {
    const color = new THREE.Color(model.color);
    const geo = new THREE.IcosahedronGeometry(1.2, 1);
    scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })));
    const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 }));
    wire.scale.setScalar(1.02);
    scene.add(wire);
    showModel();
  }

  gltfLoader.load(
    model.file,
    (gltf) => {
      // La tarjeta pudo destruirse mientras el modelo cargaba
      if (!running) return disposeObject(gltf.scene);
      const object = gltf.scene;

      // Centrar y escalar: baseSize es la altura (o la dimensión mayor)
      // que ocupa el modelo en la tarjeta; scale lo ajusta a mano.
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const refDim = model.scaleAxis === 'y' ? size.y : Math.max(size.x, size.y, size.z);
      const scaleFactor = (model.baseSize / refDim) * model.scale;
      object.scale.setScalar(scaleFactor);
      object.position.copy(center).multiplyScalar(-scaleFactor);

      // Colores por nombre de material
      object.traverse(child => {
        if (!child.isMesh) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(mat => {
          const cfg = model.colorMap[mat.name];
          if (!cfg) return;
          mat.color = new THREE.Color(cfg.color);
          mat.roughness = cfg.roughness;
          mat.metalness = 0.05;
          if (cfg.emissive) {
            mat.emissive = new THREE.Color(cfg.emissive);
            mat.emissiveIntensity = 0.5;
          }
          mat.needsUpdate = true;
        });
      });

      scene.add(object);

      // Plataforma y anillo en la base del modelo escalado
      const finalBox  = new THREE.Box3().setFromObject(object);
      const finalSize = finalBox.getSize(new THREE.Vector3());
      const bottomY   = finalBox.min.y;
      const ringRadius = Math.max(finalSize.x, finalSize.z) * 0.6 * model.platformScale;
      platform.geometry.dispose();
      platform.geometry = new THREE.CylinderGeometry(ringRadius, ringRadius, 0.04, 64);
      ring.geometry.dispose();
      ring.geometry = new THREE.TorusGeometry(ringRadius * 1.05, 0.015, 8, 80);
      platform.position.y = bottomY - 0.04;
      ring.position.y     = bottomY - 0.02;

      // Cámara a distancia fija relativa al baseSize
      const finalZ = Math.max(model.baseSize * 1.6, 2.5);
      const camY = model.cameraY;
      controls.target.set(0, 0, 0);

      if (prefersReducedMotion) {
        camera.position.set(0, camY, finalZ);
      } else {
        // Dolly-in: la cámara arranca más lejos/arriba y "vuela" hasta su
        // posición final cuando el modelo termina de cargar.
        camera.position.set(0, camY + finalZ * 0.35, finalZ * 1.8);
        cardAnims.push(
          animate(camera.position, {
            y: camY,
            z: finalZ,
            duration: 1100,
            ease: 'outExpo',
            onUpdate: () => controls.update(),
          })
        );
      }
      controls.update();
      showModel();
    },
    (e) => { if (e.total) onProgress?.(e.loaded / e.total); },
    () => { if (running) loadFallback(); }
  );

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);

  let running = true;

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  return () => {
    running = false;
    ro.disconnect();
    controls.dispose();
    // Detiene las animaciones de Anime.js (dolly-in, pulso del anillo)
    cardAnims.forEach((a) => a.pause());
    utils.remove([camera.position, ring.material, ring.scale]);
    disposeObject(scene);
    renderer.dispose();
    renderer.forceContextLoss(); // libera el contexto WebGL de verdad
  };
}
