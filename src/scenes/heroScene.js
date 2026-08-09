import * as THREE from 'three';
import { animate } from 'animejs';
import 'animejs/adapters/three'; // registra Object3D como target animable (cámara)
import { prefersReducedMotion } from '../utils/motion.js';

export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(0, 0, 22);

  // ── Grid de puntos ──────────────────────────────────────────────────────
  const COLS = 32;
  const ROWS = 20;
  const SPACING = 1.4;
  const count = COLS * ROWS;

  const positions = new Float32Array(count * 3);
  const randoms   = new Float32Array(count);
  const speeds    = new Float32Array(count);

  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions[i * 3]     = (c - COLS / 2) * SPACING;
      positions[i * 3 + 1] = (r - ROWS / 2) * SPACING;
      positions[i * 3 + 2] = 0;
      randoms[i] = Math.random();
      speeds[i]  = 0.5 + Math.random() * 1.0;
      i++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aRandom',  new THREE.BufferAttribute(randoms, 1));
  geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime:   { value: 0 },
      uMouse:  { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#C9A96E') },
      uColor2: { value: new THREE.Color('#4A90D9') },
      uColor3: { value: new THREE.Color('#ffffff') },
      uOpacity: { value: prefersReducedMotion ? 1 : 0 },
    },
    vertexShader: `
      attribute float aRandom;
      attribute float aSpeed;
      uniform float uTime;
      uniform vec2  uMouse;
      varying float vAlpha;
      varying float vMix;
      varying float vGlow;

      void main() {
        vec3 pos = position;

        // Onda principal
        float wave = sin(pos.x * 0.22 + uTime * aSpeed * 0.6)
                   * cos(pos.y * 0.22 + uTime * aSpeed * 0.4)
                   * 2.8;

        // Segunda onda diagonal
        float wave2 = sin((pos.x + pos.y) * 0.15 + uTime * 0.35) * 1.2;
        pos.z += wave + wave2;

        // Repulsión del mouse
        vec2 mouseWorld = uMouse * vec2(21.0, 13.0);
        vec2 diff  = pos.xy - mouseWorld;
        float dist = length(diff);
        float push = smoothstep(7.0, 0.0, dist) * 5.5;
        pos.z += push;
        pos.xy += normalize(diff + 0.001) * push * 0.5;

        float waveNorm = abs(wave + wave2) / 4.0;
        vAlpha = 0.5 + 0.5 * waveNorm;
        vGlow  = smoothstep(5.0, 0.0, dist); // brilla cerca del mouse
        vMix   = aRandom;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        // Puntos más grandes en crestas de onda y cerca del mouse
        float size = 4.5 + aRandom * 3.5 + waveNorm * 3.0 + vGlow * 6.0;
        gl_PointSize = size * (22.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uOpacity;
      varying float vAlpha;
      varying float vMix;
      varying float vGlow;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;

        // Núcleo brillante
        float core  = smoothstep(0.5, 0.05, d);
        float halo  = smoothstep(0.5, 0.2, d) * 0.4;
        float alpha = (core + halo) * vAlpha * uOpacity;

        vec3 color = mix(uColor1, uColor2, vMix);
        // Cerca del mouse vira a blanco brillante
        color = mix(color, uColor3, vGlow * 0.7);

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── Líneas de conexión ──────────────────────────────────────────────────
  const baseX = (c, r) => (c - COLS / 2) * SPACING;
  const baseY = (c, r) => (r - ROWS / 2) * SPACING;
  const lineVerts = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c < COLS - 1) {
        lineVerts.push(baseX(c,r), baseY(c,r), 0, baseX(c+1,r), baseY(c+1,r), 0);
      }
      if (r < ROWS - 1) {
        lineVerts.push(baseX(c,r), baseY(c,r), 0, baseX(c,r+1), baseY(c,r+1), 0);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: 0x4A90D9, transparent: true, opacity: 0.12,
  })));

  // ── Mouse ───────────────────────────────────────────────────────────────
  const mouse = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);

  const onMouseMove = (e) => {
    target.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onTouchMove = (e) => {
    target.x =  (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
    target.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // ── Resize ──────────────────────────────────────────────────────────────
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

  // ── Entrada: la cámara "vuela" hacia su posición final y el grid se
  //    materializa con fade-in, en vez de aparecer todo de golpe ──────────
  const heroAnims = [];
  if (!prefersReducedMotion) {
    camera.position.set(0, 0, 34);
    heroAnims.push(
      animate(camera.position, { z: 22, duration: 1400, ease: 'outExpo' })
    );
    heroAnims.push(
      animate(mat.uniforms.uOpacity, { value: 1, duration: 1800, ease: 'outSine' })
    );
  }

  // ── Loop ────────────────────────────────────────────────────────────────
  let running = true;
  const clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    mouse.lerp(target, 0.05);
    mat.uniforms.uTime.value  = clock.getElapsedTime();
    mat.uniforms.uMouse.value.copy(mouse);
    renderer.render(scene, camera);
  }
  tick();

  return () => {
    running = false;
    ro.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    heroAnims.forEach((a) => a.pause && a.pause());
    renderer.dispose();
  };
}