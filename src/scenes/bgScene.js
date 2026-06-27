import * as THREE from 'three';

export function initBgScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.z = 50;

  // Particle field
  const count = 800;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 120;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    sizes[i] = Math.random() * 2 + 0.5;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#C9A96E') },
      uColor2: { value: new THREE.Color('#4A90D9') },
    },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + position.x * 0.05) * 0.8;
        pos.x += cos(uTime * 0.2 + position.z * 0.05) * 0.5;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (180.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 0.4 + 0.3 * sin(uTime * 0.5 + position.x);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
        vec3 color = mix(uColor1, uColor2, gl_PointCoord.y);
        gl_FragColor = vec4(color, alpha * 0.6);
      }
    `,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Grid lines on floor
  const gridGeo = new THREE.BufferGeometry();
  const lines = [];
  const gridSize = 80;
  const step = 10;
  for (let i = -gridSize; i <= gridSize; i += step) {
    lines.push(-gridSize, -20, i,  gridSize, -20, i);
    lines.push(i, -20, -gridSize,  i, -20, gridSize);
  }
  gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3));
  const gridMat = new THREE.LineBasicMaterial({ color: 0x4A90D9, transparent: true, opacity: 0.06 });
  scene.add(new THREE.LineSegments(gridGeo, gridMat));

  let w = canvas.clientWidth, h = canvas.clientHeight;

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener('resize', resize);

  let running = true;
  const clock = new THREE.Clock();

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    mat.uniforms.uTime.value = clock.getElapsedTime();
    particles.rotation.y = clock.getElapsedTime() * 0.02;
    renderer.render(scene, camera);
  }
  tick();

  return () => { running = false; renderer.dispose(); };
}
