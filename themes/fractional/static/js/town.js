// Mohit's town — the homepage as a small low-poly island you walk around.
// Every building is a real part of the site; the plain page below is the fallback.
import * as THREE from './vendor/three.module.min.js';

const root = document.getElementById('town');
const dataEl = document.getElementById('town-data');

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

if (root && dataEl) {
  if (webglAvailable()) {
    try {
      init(JSON.parse(dataEl.textContent));
    } catch (err) {
      console.error('[town] failed to start', err);
      root.classList.add('town--fallback');
    }
  } else {
    root.classList.add('town--fallback');
  }
}

function init(data) {
  const canvas = root.querySelector('.town-canvas');
  const labelsEl = root.querySelector('.town-labels');
  const panel = root.querySelector('.town-panel');
  const uiObstacles = root.querySelectorAll('.town-hint, .town-skip, .town-card, .town-panel');
  let uiRects = [];
  // Measured once per resize / panel change, never inside the frame loop.
  function measureUI() {
    const r = canvas.getBoundingClientRect();
    uiRects = [];
    for (const el of uiObstacles) {
      if (!el.offsetParent || el.hidden || getComputedStyle(el).visibility === 'hidden') continue;
      const b = el.getBoundingClientRect();
      if (b.width && b.height) uiRects.push({ l: b.left - r.left, r: b.right - r.left, t: b.top - r.top, b: b.bottom - r.top });
    }
    for (const p of places) {
      p.lw = p.label.offsetWidth / 2 + 8;
      p.lh = p.label.offsetHeight;
    }
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // — Palettes: the town follows the site's light/dark toggle (day / night). —
  const PALETTE = {
    day: {
      sky: 0x9fd3e6, fog: 0xb9e0ec, sea: 0x3d9cc2, foam: 0xe9f6fb,
      hemiSky: 0xffffff, hemiGround: 0x8cc76a, hemi: 1.05, sun: 0xfff1d6, sunI: 2.4,
      window: 0x2d3a4a, windowGlow: 0x000000, lampGlow: 0x000000, lamp: 0,
    },
    night: {
      sky: 0x0d1830, fog: 0x13213d, sea: 0x173a5c, foam: 0x5f7fa3,
      hemiSky: 0x7d8fc4, hemiGround: 0x2a3b2e, hemi: 0.8, sun: 0xa9bdff, sunI: 0.95,
      window: 0xffcf7a, windowGlow: 0xffb347, lampGlow: 0xffd28a, lamp: 9,
    },
  };
  const C = {
    sand: 0xf0d9a6, grass: 0x8cc76a, grassDark: 0x6fae55, path: 0xe9c98f, stone: 0xb9b2a4,
    stoneDark: 0x8f877a, wall: 0xf4ecdc, wood: 0x8a5a3b, woodDark: 0x5e3b25,
    roofRed: 0xd9653b, roofSlate: 0x5a6b8c, roofTeal: 0x2f8f83, roofOchre: 0xe0a33c,
    ember: 0xff8a2a, red: 0xd8342c, ink: 0x1d1f24, leaf: 0x4f9a4a, leafLight: 0x74b85a,
    skin: 0xc58c5c, hair: 0x1f1a17, shirt: 0x2f6fd6, trousers: 0x2b2f3a, shoe: 0x16181d,
  };

  const isNight = () => document.documentElement.getAttribute('data-theme') !== 'light';

  // — Renderer, scene, camera —
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PALETTE.day.fog, 55, 120);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 300);
  const CAM_OFFSET = new THREE.Vector3(0, 30, 34);
  // Look a little ahead of the character so the row of buildings sits mid-frame.
  const LOOK_AHEAD = new THREE.Vector3(0, 0, -7);
  let portrait = false;

  const hemi = new THREE.HemisphereLight(0xffffff, C.grass, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(-18, 30, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -34;
  sun.shadow.camera.right = 34;
  sun.shadow.camera.top = 34;
  sun.shadow.camera.bottom = -34;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 90;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  scene.add(sun.target);

  // — Helpers —
  const mats = new Map();
  function mat(color, opts = {}) {
    const key = color + JSON.stringify(opts);
    if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...opts }));
    return mats.get(key);
  }
  function mesh(geo, material, { x = 0, y = 0, z = 0, ry = 0, shadow = true, receive = true } = {}) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    m.castShadow = shadow;
    m.receiveShadow = receive;
    return m;
  }
  function seeded(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // Text drawn into a texture for signs.
  function signTexture(text, { bg = '#f4ecdc', fg = '#1d1f24', w = 512, h = 160, size = 72, weight = 700 } = {}) {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const g = cv.getContext('2d');
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = fg;
    g.lineWidth = 8;
    g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    let fs = size;
    do {
      g.font = `${weight} ${fs}px Inter, system-ui, sans-serif`;
      fs -= 4;
    } while (g.measureText(text).width > w - 60 && fs > 20);
    g.fillText(text, w / 2, h / 2 + 4);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }
  function sign(text, w, h, opts) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: signTexture(text, opts), roughness: 0.9 }));
    m.castShadow = false;
    return m;
  }

  // Windows glow at night; one shared material keeps the switch cheap.
  const windowMat = new THREE.MeshStandardMaterial({ color: PALETTE.day.window, emissive: 0x000000, roughness: 0.4, flatShading: true });
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xfff6dc, emissive: 0x000000, roughness: 0.5 });
  const haloMat = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const g = cv.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,214,140,0.9)');
    grad.addColorStop(1, 'rgba(255,214,140,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const m = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
    return m;
  })();
  const haloTexture = haloMat.map;

  // — Island, sea, paths —
  const sea = mesh(new THREE.CircleGeometry(160, 48), new THREE.MeshStandardMaterial({ color: PALETTE.day.sea, roughness: 0.35, metalness: 0.05 }), { y: -0.6, shadow: false });
  sea.rotation.x = -Math.PI / 2;
  scene.add(sea);

  const foam = mesh(new THREE.RingGeometry(30.2, 31.6, 48), new THREE.MeshBasicMaterial({ color: PALETTE.day.foam, transparent: true, opacity: 0.7 }), { y: -0.55, shadow: false, receive: false });
  foam.rotation.x = -Math.PI / 2;
  scene.add(foam);

  scene.add(mesh(new THREE.CylinderGeometry(30.5, 32, 1.2, 40), mat(C.sand), { y: -0.6, shadow: false }));
  const grass = mesh(new THREE.CylinderGeometry(27.5, 28.5, 0.6, 40), mat(C.grass), { y: -0.1, shadow: false });
  scene.add(grass);

  // Streets: one ring road passes every door; a few spokes join it to the plaza.
  const RING_IN = 9.7;
  const RING_OUT = 11.9;
  const ring = mesh(new THREE.RingGeometry(RING_IN, RING_OUT, 64), mat(C.path), { y: 0.22, shadow: false });
  ring.rotation.x = -Math.PI / 2;
  scene.add(ring);
  const SPOKES = [-62, 0, 62, 180];
  for (const deg of SPOKES) {
    const a = THREE.MathUtils.degToRad(deg);
    const len = RING_IN - 4.8;
    const mid = 4.8 + len / 2;
    const s = mesh(new THREE.BoxGeometry(2.4, 0.08, len + 0.6), mat(C.path), { y: 0.225, shadow: false });
    s.position.set(Math.sin(a) * mid, 0.225, -Math.cos(a) * mid);
    s.rotation.y = -a;
    scene.add(s);
  }
  const plaza = mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.1, 28), mat(C.path), { y: 0.23, shadow: false });
  scene.add(plaza);
  const plazaInner = mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.7, 12), mat(C.stone), { y: 0.5 });
  scene.add(plazaInner);
  const pool = mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0x5fb6d6, roughness: 0.2 }), { y: 0.86, shadow: false });
  scene.add(pool);

  // — Buildings —
  let forgeRef = null;
  const colliders = []; // {x, z, r}
  const places = [];
  const lampLights = [];

  function house({ w, d, h, wall = C.wall, roof = C.roofRed, roofH = 2.2 }) {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(w, h, d), mat(wall), { y: h / 2 }));
    const r = mesh(new THREE.CylinderGeometry(0.01, Math.max(w, d) * 0.78, roofH, 4, 1), mat(roof), { y: h + roofH / 2 });
    r.rotation.y = Math.PI / 4;
    r.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
    g.add(r);
    // door and windows on the +z face
    g.add(mesh(new THREE.BoxGeometry(1.1, 1.9, 0.12), mat(C.woodDark), { y: 0.95, z: d / 2 + 0.03 }));
    for (const sx of [-1, 1]) {
      if (w < 3.4) break;
      g.add(mesh(new THREE.BoxGeometry(0.9, 0.9, 0.1), windowMat, { x: sx * (w / 2 - 0.9), y: h * 0.6, z: d / 2 + 0.03, shadow: false }));
    }
    return g;
  }

  function placeAt(group, x, z, faceAngle) {
    group.position.set(x, 0.2, z);
    group.rotation.y = faceAngle;
    scene.add(group);
  }

  // Each place: position, the door point the character walks to, and its panel.
  function addPlace(def) {
    const { id, x, z, radius = 3.4, build } = def;
    const face = Math.atan2(-x, -z); // doors face the plaza
    const g = build();
    placeAt(g, x, z, face);
    colliders.push({ x, z, r: radius });
    const door = new THREE.Vector3(x + Math.sin(face) * (radius + 1.8), 0, z + Math.cos(face) * (radius + 1.8));
    const labelPos = new THREE.Vector3(x, def.labelY || 7.2, z);
    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'town-label';
    label.tabIndex = -1;
    label.textContent = def.title;
    label.addEventListener('click', () => walkTo(door, id));
    labelsEl.appendChild(label);
    places.push({ ...def, door, labelPos, label });
  }

  // Forge — the open-source project.
  addPlace({
    id: 'forge', title: 'Forge', x: -13.26, z: -8.95, radius: 3.6,
    build() {
      const g = new THREE.Group();
      g.add(mesh(new THREE.BoxGeometry(6, 3.2, 5), mat(C.stone), { y: 1.6 }));
      g.add(mesh(new THREE.BoxGeometry(6.6, 0.5, 5.6), mat(C.stoneDark), { y: 3.45 }));
      const chim = mesh(new THREE.BoxGeometry(1.2, 3.2, 1.2), mat(C.stoneDark), { x: 1.8, y: 5, z: -1.2 });
      g.add(chim);
      // open front: anvil and hearth
      g.add(mesh(new THREE.BoxGeometry(4.2, 2.4, 0.3), mat(C.ink), { y: 1.2, z: 2.42, shadow: false }));
      const hearth = mesh(new THREE.BoxGeometry(1.8, 0.9, 1.2), mat(C.stoneDark), { x: -1.4, y: 0.45, z: 3.3 });
      g.add(hearth);
      const coals = mesh(new THREE.BoxGeometry(1.3, 0.25, 0.8), new THREE.MeshStandardMaterial({ color: C.ember, emissive: C.ember, emissiveIntensity: 1.6 }), { x: -1.4, y: 0.95, z: 3.3, shadow: false });
      g.add(coals);
      g.add(mesh(new THREE.BoxGeometry(0.9, 0.5, 0.5), mat(C.ink, { metalness: 0.6, roughness: 0.4 }), { x: 1.2, y: 1.05, z: 3.4 }));
      g.add(mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), mat(C.woodDark), { x: 1.2, y: 0.4, z: 3.4 }));
      const fire = new THREE.PointLight(C.ember, 14, 9, 1.6);
      fire.position.set(-1.4, 1.6, 3.6);
      g.add(fire);
      g.userData.fire = fire;
      g.userData.coals = coals;
      const s = sign('FORGE', 3.4, 1.0, { bg: '#1d1f24', fg: '#ff8a2a' });
      s.position.set(0, 3.0, 2.62);
      g.add(s);
      forgeRef = g;
      return g;
    },
  });

  // Print shop — Writing.
  addPlace({
    id: 'writing', title: 'Writing', x: -7.51, z: -14.13, radius: 3.4,
    build() {
      const g = house({ w: 6, d: 5, h: 3.6, roof: C.roofSlate, roofH: 2.4 });
      const s = sign('WRITING', 3.6, 1.0, { bg: '#f4ecdc', fg: '#1d1f24' });
      s.position.set(0, 3.0, 2.56);
      g.add(s);
      // the press: a big roller on a frame beside the door
      const roller = mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 14), mat(C.ink, { metalness: 0.5, roughness: 0.45 }), { x: -2.2, y: 1.05, z: 3.3 });
      roller.rotation.z = Math.PI / 2;
      g.add(roller);
      for (const sx of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.18, 1.6, 0.9), mat(C.woodDark), { x: -2.2 + sx * 1.15, y: 0.8, z: 3.3 }));
      g.add(mesh(new THREE.BoxGeometry(2.0, 0.08, 1.3), mat(0xffffff), { x: -2.2, y: 0.55, z: 3.3 }));
      // pages drying on a line across the front
      g.add(mesh(new THREE.BoxGeometry(5.2, 0.04, 0.04), mat(C.ink), { y: 4.15, z: 2.7, shadow: false }));
      for (let i = 0; i < 6; i++) {
        const page = mesh(new THREE.PlaneGeometry(0.55, 0.75), mat(i % 2 ? 0xffffff : 0xf1e6cc, { side: THREE.DoubleSide }), { x: -2.2 + i * 0.88, y: 3.72, z: 2.72, shadow: false });
        page.rotation.z = (i % 2 ? 1 : -1) * 0.06;
        g.add(page);
      }
      g.add(mesh(new THREE.BoxGeometry(0.9, 2.2, 0.9), mat(C.stoneDark), { x: 1.8, y: 5.4, z: -1 }));
      return g;
    },
  });

  // Bookshop — Library, with real covers in the window.
  addPlace({
    id: 'library', title: 'Library', x: 0.0, z: -16.0, radius: 3.4,
    build() {
      const g = house({ w: 6, d: 5, h: 3.6, roof: C.roofTeal, roofH: 2.2 });
      const s = sign('BOOKS', 3.2, 0.95, { bg: '#2f8f83', fg: '#ffffff' });
      s.position.set(0, 3.05, 2.56);
      g.add(s);
      const shelf = mesh(new THREE.BoxGeometry(4.6, 0.14, 0.5), mat(C.wood), { y: 0.95, z: 2.75 });
      g.add(shelf);
      const loader = new THREE.TextureLoader();
      const covers = (data.books || []).slice(0, 7);
      covers.forEach((b, i) => {
        const tex = loader.load(b.cover);
        tex.colorSpace = THREE.SRGBColorSpace;
        const book = mesh(new THREE.PlaneGeometry(0.55, 0.82), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), { x: -1.95 + i * 0.65, y: 1.43, z: 2.85, shadow: false });
        book.rotation.x = -0.12;
        g.add(book);
      });
      return g;
    },
  });

  // Offices — Booking.com, Postman, LinkedIn (names only).
  const offices = data.work || [];
  const officeSpots = [
    { x: 7.51, z: -14.13, roof: C.roofOchre },
    { x: 13.11, z: -9.18, roof: C.roofRed },
    { x: 14.85, z: -2.09, roof: C.roofSlate },
  ];
  offices.slice(0, 3).forEach((o, i) => {
    const spot = officeSpots[i];
    addPlace({
      id: 'work-' + i, title: o.name, x: spot.x, z: spot.z, radius: 2.8, labelY: 8.4, work: o,
      build() {
        const g = new THREE.Group();
        const door = () => g.add(mesh(new THREE.BoxGeometry(1.1, 1.9, 0.12), mat(C.woodDark), { y: 0.95, z: 2.23 }));
        const win = (x, y, z, w = 0.7, h = 0.7) => g.add(mesh(new THREE.BoxGeometry(w, h, 0.1), windowMat, { x, y, z, shadow: false }));
        let signY = 2.6;
        if (i === 0) {
          // a slim tower with a parapet and an antenna
          g.add(mesh(new THREE.BoxGeometry(3.6, 8.6, 4.2), mat(C.wall), { y: 4.3 }));
          g.add(mesh(new THREE.BoxGeometry(3.9, 0.35, 4.5), mat(spot.roof), { y: 8.75 }));
          g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 5), mat(C.ink), { x: 0.9, y: 10, z: -0.8 }));
          for (let f = 0; f < 4; f++) for (const sx of [-1, 0, 1]) win(sx * 1.05, 3.2 + f * 1.45, 2.11, 0.6, 0.8);
          signY = 2.45;
        } else if (i === 1) {
          // a low workshop with a sawtooth roof
          g.add(mesh(new THREE.BoxGeometry(5.6, 3.6, 4.2), mat(C.wall), { y: 1.8 }));
          for (let k = 0; k < 3; k++) {
            const tooth = mesh(new THREE.CylinderGeometry(0.01, 1.1, 1.5, 3, 1), mat(spot.roof), { x: -1.85 + k * 1.85, y: 4.15 });
            tooth.rotation.x = Math.PI / 2;
            tooth.rotation.y = Math.PI / 2;
            tooth.scale.set(1, 4.2 / 2.2, 1);
            g.add(tooth);
          }
          for (const sx of [-1.9, 1.9]) win(sx, 1.9, 2.11, 1.2, 0.9);
          signY = 3.0;
        } else {
          // a stepped block with a roof garden
          g.add(mesh(new THREE.BoxGeometry(4.8, 3.6, 4.4), mat(C.wall), { y: 1.8 }));
          g.add(mesh(new THREE.BoxGeometry(3.4, 2.6, 3.2), mat(C.wall), { x: -0.5, y: 4.9, z: -0.4 }));
          g.add(mesh(new THREE.BoxGeometry(3.6, 0.25, 3.4), mat(spot.roof), { x: -0.5, y: 6.3, z: -0.4 }));
          g.add(mesh(new THREE.BoxGeometry(1.3, 0.35, 1.3), mat(C.leafLight), { x: 1.65, y: 3.78, z: 1.2 }));
          for (const sx of [-1.4, 1.4]) win(sx, 2.3, 2.21, 1.0, 0.8);
          for (const sx of [-1.4, 0.4]) win(sx, 5.0, 1.21, 0.8, 0.7);
          signY = 3.05;
        }
        door();
        const s = sign(o.name, 3.2, 0.72, { bg: '#ffffff', fg: '#1d1f24', size: 64 });
        s.position.set(0, signY, i === 2 ? 2.26 : 2.17);
        g.add(s);
        return g;
      },
    });
  });

  // Post box — Contact.
  addPlace({
    id: 'contact', title: 'Contact', x: -13.92, z: -1.46, radius: 1.2, labelY: 4.4,
    build() {
      const g = new THREE.Group();
      g.add(mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.2, 14), mat(C.red, { roughness: 0.5 }), { y: 1.1 }));
      g.add(mesh(new THREE.SphereGeometry(0.7, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(C.red, { roughness: 0.5 }), { y: 2.2 }));
      g.add(mesh(new THREE.BoxGeometry(0.8, 0.12, 0.1), mat(C.ink), { y: 1.75, z: 0.68, shadow: false }));
      g.add(mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.18, 14), mat(C.ink), { y: 0.09 }));
      return g;
    },
  });

  // — Trees, lamps, flowers —
  const rand = seeded(20131029);
  function blocked(x, z, pad) {
    const r = Math.hypot(x, z);
    if (r < 7 || (r > RING_IN - 1.2 && r < RING_OUT + 1.2)) return true;
    for (const c of colliders) if (Math.hypot(x - c.x, z - c.z) < c.r + pad) return true;
    const a = Math.atan2(x, -z);
    for (const deg of SPOKES) {
      const d = Math.abs(Math.atan2(Math.sin(a - THREE.MathUtils.degToRad(deg)), Math.cos(a - THREE.MathUtils.degToRad(deg))));
      if (r < RING_IN && d * r < 2.2) return true;
    }
    return false;
  }
  for (let i = 0; i < 70; i++) {
    const a = rand() * Math.PI * 2;
    const r = 8 + rand() * 18;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (blocked(x, z, 2.2)) continue;
    const s = 0.7 + rand() * 0.7;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 1.2 * s, 6), mat(C.wood), { y: 0.6 * s }));
    const leafy = rand() > 0.5;
    if (leafy) {
      g.add(mesh(new THREE.IcosahedronGeometry(1.15 * s, 0), mat(rand() > 0.5 ? C.leaf : C.leafLight), { y: 1.9 * s }));
    } else {
      g.add(mesh(new THREE.ConeGeometry(1.0 * s, 2.4 * s, 7), mat(C.grassDark), { y: 2.2 * s }));
    }
    g.position.set(x, 0.2, z);
    g.rotation.y = rand() * Math.PI;
    scene.add(g);
    colliders.push({ x, z, r: 0.6 * s });
  }
  // lamps around the plaza, kept off the paths
  const pathAngles = SPOKES.map((deg) => Math.atan2(-Math.cos(THREE.MathUtils.degToRad(deg)), Math.sin(THREE.MathUtils.degToRad(deg))));
  const lampAngles = [];
  for (let k = 0; k < 24 && lampAngles.length < 6; k++) {
    const a = (k / 24) * Math.PI * 2;
    const clear = pathAngles.every((pa) => Math.abs(Math.atan2(Math.sin(a - pa), Math.cos(a - pa))) > 0.32);
    const spaced = lampAngles.every((la) => Math.abs(Math.atan2(Math.sin(a - la), Math.cos(a - la))) > 0.7);
    if (clear && spaced) lampAngles.push(a);
  }
  for (let i = 0; i < lampAngles.length; i++) {
    const a = lampAngles[i];
    const x = Math.cos(a) * 6.2;
    const z = Math.sin(a) * 6.2;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.6, 6), mat(C.ink), { y: 1.3 }));
    g.add(mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), lampMat, { y: 2.75, shadow: false }));
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(2.4, 2.4, 1);
    halo.position.y = 2.75;
    g.add(halo);
    g.position.set(x, 0.2, z);
    scene.add(g);
    if (i % 2 === 0) {
      const l = new THREE.PointLight(PALETTE.night.lampGlow, 0, 10, 1.8);
      l.position.set(x, 3.1, z);
      scene.add(l);
      lampLights.push(l);
    }
  }
  // Night sky: a moon and stars that ride with the camera, so they always sit in the
  // band of sky at the top of the frame (the fog would otherwise swallow them).
  const sky = new THREE.Group();
  const moon = new THREE.Mesh(new THREE.CircleGeometry(1.15, 32), new THREE.MeshBasicMaterial({ color: 0xf6f1d8, fog: false, depthTest: false }));
  moon.renderOrder = 10;
  const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTexture, color: 0xbfd0ff, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  moonGlow.scale.set(7, 7, 1);
  moonGlow.material.depthTest = false;
  moonGlow.renderOrder = 9;
  sky.add(moonGlow);
  sky.add(moon);
  const STAR_COUNT = 90;
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(STAR_COUNT * 3), 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9, depthTest: false }));
  stars.renderOrder = 8;
  sky.add(stars);
  sky.visible = false;
  camera.add(sky);
  scene.add(camera);
  function layoutSky() {
    const depth = 60;
    const halfH = depth * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const halfW = halfH * camera.aspect;
    moon.position.set(-halfW * 0.55, halfH * 0.88, -depth);
    moonGlow.position.copy(moon.position);
    const srand = seeded(7);
    const pos = starGeo.attributes.position;
    for (let i = 0; i < STAR_COUNT; i++) {
      pos.setXYZ(i, (srand() * 2 - 1) * halfW, halfH * (0.8 + srand() * 0.2), -depth - 1);
    }
    pos.needsUpdate = true;
  }

  // Forge smoke: a few drifting puffs.
  const smoke = [];
  {
    const smokeMat = new THREE.MeshStandardMaterial({ color: 0xd9d4cc, transparent: true, opacity: 0.6, flatShading: true });
    for (let i = 0; i < 6; i++) {
      const p = mesh(new THREE.IcosahedronGeometry(0.45, 0), smokeMat.clone(), { shadow: false, receive: false });
      p.userData.t = i / 6;
      scene.add(p);
      smoke.push(p);
    }
  }

  // — The character —
  const hero = new THREE.Group();
  const body = new THREE.Group();
  hero.add(body);
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  function limb(group, w, h, d, color, x, y) {
    const m = mesh(new THREE.BoxGeometry(w, h, d), mat(color), { y: -h / 2 });
    group.add(m);
    group.position.set(x, y, 0);
    body.add(group);
  }
  limb(legL, 0.32, 0.9, 0.34, C.trousers, -0.2, 0.95);
  limb(legR, 0.32, 0.9, 0.34, C.trousers, 0.2, 0.95);
  legL.add(mesh(new THREE.BoxGeometry(0.34, 0.16, 0.48), mat(C.shoe), { y: -0.92, z: 0.07 }));
  legR.add(mesh(new THREE.BoxGeometry(0.34, 0.16, 0.48), mat(C.shoe), { y: -0.92, z: 0.07 }));
  body.add(mesh(new THREE.BoxGeometry(0.86, 0.95, 0.5), mat(C.shirt), { y: 1.42 }));
  limb(armL, 0.24, 0.85, 0.26, C.shirt, -0.56, 1.85);
  limb(armR, 0.24, 0.85, 0.26, C.shirt, 0.56, 1.85);
  armL.add(mesh(new THREE.BoxGeometry(0.22, 0.2, 0.24), mat(C.skin), { y: -0.92 }));
  armR.add(mesh(new THREE.BoxGeometry(0.22, 0.2, 0.24), mat(C.skin), { y: -0.92 }));
  body.add(mesh(new THREE.BoxGeometry(0.62, 0.62, 0.6), mat(C.skin), { y: 2.24 }));
  body.add(mesh(new THREE.BoxGeometry(0.68, 0.24, 0.66), mat(C.hair), { y: 2.6 }));
  body.add(mesh(new THREE.BoxGeometry(0.68, 0.36, 0.14), mat(C.hair), { y: 2.42, z: -0.27 }));
  body.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), mat(C.ink), { x: -0.14, y: 2.28, z: 0.31, shadow: false }));
  body.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), mat(C.ink), { x: 0.14, y: 2.28, z: 0.31, shadow: false }));
  hero.position.set(0, 0.25, 4.2);
  scene.add(hero);

  // A soft ring marks where a click will walk to.
  const marker = mesh(new THREE.RingGeometry(0.35, 0.55, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }), { y: 0.3, shadow: false, receive: false });
  marker.rotation.x = -Math.PI / 2;
  scene.add(marker);

  // — Movement —
  const keys = new Set();
  let target = null; // auto-walk destination (Vector3)
  let targetPlace = null;
  const vel = new THREE.Vector3();
  const SPEED = 7.5;

  function walkTo(v, placeId = null) {
    target = new THREE.Vector3(v.x, 0, v.z);
    targetPlace = placeId;
    marker.position.set(v.x, 0.3, v.z);
    marker.material.opacity = 0.9;
    canvas.focus({ preventScroll: true });
  }

  const KEYMAP = { ArrowUp: 'f', KeyW: 'f', ArrowDown: 'b', KeyS: 'b', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
  canvas.addEventListener('keydown', (e) => {
    if (KEYMAP[e.code]) {
      keys.add(KEYMAP[e.code]);
      target = null;
      e.preventDefault();
    } else if (e.key === 'Enter' && active) {
      window.location.href = active.href;
    }
  });
  canvas.addEventListener('keyup', (e) => KEYMAP[e.code] && keys.delete(KEYMAP[e.code]));
  canvas.addEventListener('blur', () => keys.clear());

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.25);
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(groundPlane, hit)) {
      // a click on or near a building walks to its door
      const near = places.find((p) => Math.hypot(hit.x - p.x, hit.z - p.z) < p.radius + 1.2);
      walkTo(near ? near.door : hit, near ? near.id : null);
    }
  });

  root.querySelectorAll('[data-walk]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = places.find((pl) => pl.id === btn.dataset.walk || (btn.dataset.walk === 'work' && pl.id === 'work-0'));
      if (p) walkTo(p.door, p.id);
    });
  });

  // Bend the walking direction around the fountain, buildings and trees ahead.
  const FOUNTAIN = { x: 0, z: 0, r: 1.9 };
  function steerAround(dir) {
    const hx = hero.position.x;
    const hz = hero.position.z;
    let sx = 0;
    let sz = 0;
    for (const c of [FOUNTAIN, ...colliders]) {
      const ox = c.x - hx;
      const oz = c.z - hz;
      const dist = Math.hypot(ox, oz);
      const ahead = ox * dir.x + oz * dir.z;
      if (ahead <= 0 || dist > c.r + 3.5) continue;
      const side = ox * dir.z - oz * dir.x; // obstacle's offset across the walking line
      const clearance = c.r + 0.9;
      if (Math.abs(side) >= clearance) continue;
      const push = ((clearance - Math.abs(side)) / clearance) * 1.6;
      const s = side > 0 ? -1 : 1;
      sx += s * dir.z * push;
      sz += -s * dir.x * push;
    }
    dir.x += sx;
    dir.z += sz;
    dir.normalize();
  }

  function collide(pos) {
    const d = Math.hypot(pos.x, pos.z);
    if (d > 26.5) pos.multiplyScalar(26.5 / d);
    for (const c of colliders) {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const dist = Math.hypot(dx, dz);
      const min = c.r + 0.45;
      if (dist < min && dist > 0.0001) {
        pos.x = c.x + (dx / dist) * min;
        pos.z = c.z + (dz / dist) * min;
      }
    }
    const pd = Math.hypot(pos.x, pos.z);
    if (pd < 2.3) pos.multiplyScalar(2.3 / Math.max(pd, 0.0001));
  }

  // — Proximity panel —
  let active = null;
  const panelTitle = panel.querySelector('.town-panel-title');
  const panelBody = panel.querySelector('.town-panel-body');
  const panelLink = panel.querySelector('.town-panel-link');

  function panelFor(p) {
    if (p.id === 'forge') return { title: 'The Forge', body: data.forge, href: data.links.forge, cta: 'Open Forge on GitHub' };
    if (p.id === 'writing') return { title: 'The print shop', list: data.essays.map((e) => ({ text: e.title, href: e.url, meta: e.date })), body: `${data.essayCount} essays on platforms, data, reliability, and leading teams.`, href: data.links.writing, cta: 'Read all the writing' };
    if (p.id === 'library') return { title: 'The bookshop', list: data.books.map((b) => ({ text: b.title, href: b.url, meta: b.author, cover: b.cover })), body: 'Favourite books, from my Goodreads shelf.', href: data.links.library, cta: 'See everything on Goodreads' };
    if (p.id === 'contact') return { title: 'The post box', body: 'Write to me about something I have written, about Forge, or about an engineering problem you are working through.', href: data.links.contact, cta: 'Send a message' };
    return { title: p.work.name, body: `${p.work.role}. ${p.work.outcome}`, href: p.work.href, cta: 'More on my work' };
  }

  let hop = 0;
  let faceTarget = null;
  function showPanel(p) {
    if (active && active.id === p.id) return;
    hop = 1;
    faceTarget = Math.atan2(p.x - hero.position.x, p.z - hero.position.z);
    const info = panelFor(p);
    active = { id: p.id, href: info.href };
    panelTitle.textContent = info.title;
    panelBody.textContent = '';
    if (info.body) {
      const para = document.createElement('p');
      para.textContent = info.body;
      panelBody.appendChild(para);
    }
    if (info.list && info.list.length) {
      const ul = document.createElement('ul');
      info.list.forEach((item) => {
        const li = document.createElement('li');
        if (item.cover) {
          const img = document.createElement('img');
          img.src = item.cover;
          img.alt = '';
          img.width = 28;
          img.height = 42;
          img.loading = 'lazy';
          li.appendChild(img);
          li.classList.add('has-cover');
        }
        const text = document.createElement('div');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        text.appendChild(a);
        if (item.meta) {
          const s = document.createElement('span');
          s.textContent = item.meta;
          text.appendChild(s);
        }
        li.appendChild(text);
        ul.appendChild(li);
      });
      panelBody.appendChild(ul);
    }
    panelLink.href = info.href;
    panelLink.textContent = info.cta;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    root.classList.add('has-panel');
    requestAnimationFrame(measureUI);
  }
  function hidePanel() {
    if (!active) return;
    active = null;
    panel.classList.remove('is-open');
    panel.hidden = true;
    root.classList.remove('has-panel');
    requestAnimationFrame(measureUI);
  }

  // — Theme —
  let night = null;
  function applyTheme() {
    const n = isNight();
    if (n === night) return;
    night = n;
    const P = n ? PALETTE.night : PALETTE.day;
    scene.background = new THREE.Color(P.sky);
    scene.fog.color.set(P.fog);
    sea.material.color.set(P.sea);
    foam.material.color.set(P.foam);
    hemi.color.set(P.hemiSky);
    hemi.groundColor.set(P.hemiGround);
    hemi.intensity = P.hemi;
    sun.color.set(P.sun);
    sun.intensity = P.sunI;
    sun.position.set(n ? 16 : -18, 30, n ? -10 : 14);
    windowMat.color.set(P.window);
    windowMat.emissive.set(P.windowGlow);
    windowMat.emissiveIntensity = n ? 1.4 : 0;
    lampMat.emissive.set(P.lampGlow);
    lampMat.emissiveIntensity = n ? 2.4 : 0;
    lampMat.color.set(n ? 0xffd28a : 0xfff6dc);
    haloMat.opacity = n ? 0.85 : 0;
    sky.visible = n;
    lampLights.forEach((l) => (l.intensity = P.lamp));
    renderer.toneMappingExposure = n ? 1.15 : 1.0;
    root.classList.toggle('town--night', n);
  }
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  applyTheme();

  // — Layout —
  const viewport = { width: 1, height: 1 };
  function resize() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    viewport.width = w;
    viewport.height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // narrow screens pull the camera back so the whole plaza stays in frame
    // Portrait screens get a wider, steeper camera so the island, not the sea, fills the frame.
    const aspect = w / h;
    portrait = aspect < 0.8;
    if (portrait) {
      camera.fov = 60;
      CAM_OFFSET.set(0, 66, 26);
      hero.scale.setScalar(1.5);
    } else {
      hero.scale.setScalar(1);
      const scale = aspect < 1.3 ? 1.35 : 1;
      camera.fov = 32;
      CAM_OFFSET.set(0, 30 * scale, 34 * scale);
    }
    const reach = CAM_OFFSET.length();
    scene.fog.near = reach + 12;
    scene.fog.far = reach + 70;
    layoutSky();
    requestAnimationFrame(measureUI);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(root);
  resize();

  // — Loop —
  const clock = new THREE.Clock();
  const camTarget = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let walkPhase = 0;
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  camTarget.copy(hero.position).add(LOOK_AHEAD);
  camera.position.copy(camTarget).add(CAM_OFFSET);

  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible || document.hidden) return;
    update(dt);
    renderer.render(scene, camera);
  }

  function update(dt) {
    t += dt;

    // input → desired direction (camera looks down -z, so forward is -z)
    const dir = tmp.set(0, 0, 0);
    if (keys.has('f')) dir.z -= 1;
    if (keys.has('b')) dir.z += 1;
    if (keys.has('l')) dir.x -= 1;
    if (keys.has('r')) dir.x += 1;
    if (target && dir.lengthSq() === 0) {
      dir.set(target.x - hero.position.x, 0, target.z - hero.position.z);
      if (dir.length() < 0.3) {
        target = null;
        dir.set(0, 0, 0);
      }
    }
    if (dir.lengthSq() > 0) {
      dir.normalize();
      steerAround(dir);
      dir.multiplyScalar(SPEED);
    }
    vel.lerp(dir, 1 - Math.pow(0.0005, dt));
    const speed = vel.length();
    hero.position.addScaledVector(vel, dt);
    collide(hero.position);
    if (speed > 0.2 || faceTarget !== null) {
      const want = speed > 0.2 ? Math.atan2(vel.x, vel.z) : faceTarget;
      let diff = want - hero.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      hero.rotation.y += diff * Math.min(1, dt * 12);
    }
    // walk cycle
    walkPhase += dt * speed * 1.6;
    const swing = Math.min(speed / SPEED, 1) * 0.7;
    legL.rotation.x = Math.sin(walkPhase) * swing;
    legR.rotation.x = -Math.sin(walkPhase) * swing;
    armL.rotation.x = -Math.sin(walkPhase) * swing * 0.8;
    armR.rotation.x = Math.sin(walkPhase) * swing * 0.8;
    if (speed > 0.2) faceTarget = null;
    hop = Math.max(0, hop - dt * 2.2);
    const hopY = reduceMotion ? 0 : Math.sin(hop * Math.PI) * 0.55;
    body.position.y = Math.abs(Math.sin(walkPhase)) * 0.08 * swing + hopY + (reduceMotion ? 0 : Math.sin(t * 2) * 0.015);

    marker.material.opacity = target ? 0.6 + Math.sin(t * 6) * 0.25 : Math.max(0, marker.material.opacity - dt * 3);

    // camera follows
    tmp.copy(hero.position).add(LOOK_AHEAD);
    if (portrait) tmp.z += active ? 13 : 3;
    camTarget.lerp(tmp, 1 - Math.pow(0.02, dt));
    camera.position.copy(camTarget).add(CAM_OFFSET);
    camera.lookAt(camTarget.x, camTarget.y + 1.2, camTarget.z);
    sun.target.position.copy(camTarget);
    sun.position.set(camTarget.x + (night ? 16 : -18), 30, camTarget.z + (night ? -10 : 14));

    // ambient life
    if (!reduceMotion) {
      foam.scale.setScalar(1 + Math.sin(t * 0.8) * 0.006);
      pool.position.y = 0.86 + Math.sin(t * 1.4) * 0.01;
    }
    if (forgeRef) {
      const f = forgeRef.userData.fire;
      f.intensity = (night ? 22 : 12) * (0.85 + (reduceMotion ? 0 : Math.sin(t * 13) * 0.08 + Math.sin(t * 7.3) * 0.07));
      const base = new THREE.Vector3(1.8, 6.8, -1.2).applyMatrix4(forgeRef.matrixWorld);
      smoke.forEach((p) => {
        p.userData.t = (p.userData.t + dt * (reduceMotion ? 0 : 0.18)) % 1;
        const k = p.userData.t;
        p.position.set(base.x + Math.sin(k * 6 + p.id) * 0.4 + k * 1.2, base.y + k * 4.5, base.z + k * 0.6);
        p.scale.setScalar(0.5 + k * 1.4);
        p.material.opacity = 0.55 * (1 - k);
      });
    }

    // proximity
    let nearest = null;
    let best = Infinity;
    for (const p of places) {
      const d = Math.hypot(hero.position.x - p.door.x, hero.position.z - p.door.z);
      if (d < best) {
        best = d;
        nearest = p;
      }
    }
    if (nearest && best < 2.6) showPanel(nearest);
    else if (best > 3.4) hidePanel();
    if (targetPlace && active && active.id === targetPlace) targetPlace = null;

    // floating labels; when two would overlap, the one nearer the character wins
    const r = viewport;
    const placed = [];
    const order = places.slice().sort((a, b) => Math.hypot(hero.position.x - a.x, hero.position.z - a.z) - Math.hypot(hero.position.x - b.x, hero.position.z - b.z));
    for (const p of order) {
      const v = p.labelPos.clone().project(camera);
      const onScreen = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      const lw = p.lw || 40;
      const lh = p.lh || 28;
      const lx = Math.min(Math.max(((v.x + 1) / 2) * r.width, lw), r.width - lw);
      let ly = Math.max(((1 - v.y) / 2) * r.height, lh + 8);
      const boxAt = (y) => ({ l: lx - lw + 4, r: lx + lw - 4, t: y - lh - 4, b: y + 4 });
      const hits = (box, list) => list.find((o) => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t);
      // a label under an overlay pill drops just below it instead of disappearing
      const ui = hits(boxAt(ly), uiRects);
      if (ui) ly = ui.b + lh + 8;
      const box = boxAt(ly);
      p.label.style.transform = `translate(-50%, -100%) translate(${lx}px, ${ly}px)`;
      const clash = !!hits(box, uiRects) || !!hits(box, placed);
      const show = onScreen && !clash;
      if (show) placed.push(box);
      p.label.classList.toggle('is-hidden', !show);
      p.label.classList.toggle('is-near', active && active.id === p.id);
    }
  }

  // Test hook (only with ?debug): advance the simulation without rendering.
  if (new URLSearchParams(window.location.search).has('debug')) {
    window.__town = {
      step(seconds) {
        for (let s = 0; s < seconds; s += 1 / 60) update(1 / 60);
      },
      hero: () => ({ x: hero.position.x, z: hero.position.z }),
      active: () => (active ? active.id : null),
    };
  }

  root.classList.add('town--ready');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureUI);
  requestAnimationFrame(measureUI);
  frame();
}
