import * as THREE from 'three';
import { animate } from 'animejs';
import 'animejs/adapters/three'; // registra Object3D como target animable (cámara)
import { prefersReducedMotion } from '../utils/motion.js';

// Ondas simultáneas que admite el shader (clics/toques recientes)
const MAX_RIPPLES = 4;
// Segundos sin interacción antes de que la malla se mueva sola
const IDLE_SECONDS = 3;

export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(0, 0, 22);

  const clock = new THREE.Clock();

  // ── Grid de puntos ──────────────────────────────────────────────────────
  // Suficientes columnas para cubrir contenedores anchos.
  const COLS = 72;
  const ROWS = 22;
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
      uHalf:   { value: new THREE.Vector2(21, 13) }, // medio ancho/alto visible (mundo)
      // Cada onda: (x, y, instante de inicio). z = -100 → inactiva
      uRipples: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3(0, 0, -100)) },
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
      uniform vec2  uHalf;
      uniform vec3  uRipples[${MAX_RIPPLES}];
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

        // Repulsión del cursor
        vec2 mouseWorld = uMouse * uHalf;
        vec2 diff  = pos.xy - mouseWorld;
        float dist = length(diff);
        float push = smoothstep(7.0, 0.0, dist) * 5.5;
        pos.z += push;
        pos.xy += normalize(diff + 0.001) * push * 0.5;

        // Ondas expansivas de los clics / toques
        float rippleGlow = 0.0;
        for (int k = 0; k < ${MAX_RIPPLES}; k++) {
          float age = uTime - uRipples[k].z;
          if (age < 0.0 || age > 4.0) continue;
          float rd   = length(position.xy - uRipples[k].xy);
          float ring = exp(-pow(rd - age * 12.0, 2.0) * 0.35) * (1.0 - age / 4.0);
          pos.z += ring * 4.5;
          rippleGlow = max(rippleGlow, ring);
        }

        float waveNorm = abs(wave + wave2) / 4.0;
        vAlpha = 0.5 + 0.5 * waveNorm;
        vGlow  = max(smoothstep(5.0, 0.0, dist), rippleGlow * 0.9);
        vMix   = aRandom;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        // Puntos más grandes en crestas de onda, cerca del cursor y en las ondas
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
        // Cerca del cursor / en las ondas vira a blanco brillante
        color = mix(color, uColor3, vGlow * 0.7);

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── Líneas de conexión ──────────────────────────────────────────────────
  const baseX = (c) => (c - COLS / 2) * SPACING;
  const baseY = (r) => (r - ROWS / 2) * SPACING;
  const lineVerts = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c < COLS - 1) lineVerts.push(baseX(c), baseY(r), 0, baseX(c + 1), baseY(r), 0);
      if (r < ROWS - 1) lineVerts.push(baseX(c), baseY(r), 0, baseX(c), baseY(r + 1), 0);
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x4A90D9, transparent: true, opacity: 0.12 });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  // ── Interacción ─────────────────────────────────────────────────────────
  const mouse  = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  let lastInput = -Infinity; // performance.now() de la última interacción real

  // Coordenadas normalizadas (-1..1) relativas al canvas
  const toLocal = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x:  ((x - rect.left) / rect.width  - 0.5) * 2,
      y: -((y - rect.top)  / rect.height - 0.5) * 2,
    };
  };

  // Solo cuenta como interacción si el puntero está sobre la malla; si no,
  // la malla sigue con su movimiento automático.
  const setTarget = (x, y) => {
    const p = toLocal(x, y);
    if (Math.abs(p.x) > 1.05 || Math.abs(p.y) > 1.05) return;
    target.set(p.x, p.y);
    lastInput = performance.now();
  };

  let rippleIndex = 0;
  const addRipple = (nx, ny) => {
    const half = mat.uniforms.uHalf.value;
    mat.uniforms.uRipples.value[rippleIndex].set(nx * half.x, ny * half.y, clock.getElapsedTime());
    rippleIndex = (rippleIndex + 1) % MAX_RIPPLES;
  };

  const onMouseMove = (e) => setTarget(e.clientX, e.clientY);
  const onTouchMove = (e) => setTarget(e.touches[0].clientX, e.touches[0].clientY);
  const onPointerDown = (e) => {
    setTarget(e.clientX, e.clientY);
    const p = toLocal(e.clientX, e.clientY);
    addRipple(p.x, p.y);
    // Oculta el texto de ayuda después de la primera interacción
    canvas.parentElement?.classList.add('is-touched');
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('pointerdown', onPointerDown);

  // ── Resize ──────────────────────────────────────────────────────────────
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    const halfH = 22 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    mat.uniforms.uHalf.value.set(halfH * camera.aspect, halfH);
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
  let nextAutoRipple = 2.5;
  const page = canvas.closest('.page');

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    if (page && !page.classList.contains('active')) return;

    const t = clock.getElapsedTime();

    // Sin interacción: el "cursor" recorre la malla solo y cada tanto lanza
    // una onda, así se ve viva (también en móviles) e invita a tocarla.
    if (!prefersReducedMotion && performance.now() - lastInput > IDLE_SECONDS * 1000) {
      target.set(Math.sin(t * 0.35) * 0.7, Math.sin(t * 0.5 + 1.3) * 0.6);
      if (t > nextAutoRipple) {
        addRipple(mouse.x, mouse.y);
        nextAutoRipple = t + 6;
      }
    }

    mouse.lerp(target, 0.05);
    mat.uniforms.uTime.value = t;
    mat.uniforms.uMouse.value.copy(mouse);
    renderer.render(scene, camera);
  }
  tick();

  return () => {
    running = false;
    ro.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('pointerdown', onPointerDown);
    heroAnims.forEach((a) => a.pause && a.pause());
    geo.dispose();
    mat.dispose();
    lineGeo.dispose();
    lineMat.dispose();
    renderer.dispose();
    // dispose() no libera el contexto WebGL; sin esto se acumulan contextos
    // y el navegador termina matando los más antiguos.
    renderer.forceContextLoss();
  };
}
