// Side Quest City: a small, fictional Bangalore at dusk, in low-poly 3D. Six buildings
// are the six sections; the camera glides between them, the traffic keeps its own
// counsel, and anyone who prefers can drive an auto-rickshaw around with WASD.
// Evolved from the old town tour (the same renderer setup, tone mapping and labels).
import * as THREE from '../vendor/three.module.min.js';

const P = 24; // block pitch
const B = 17; // block size
const EDGE = 2.5 * P; // outermost road
const ROADS = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => k * P);

const PLACES = {
  about: { name: 'My Apartment', what: 'About', block: [-1, -1], colour: '#ff8fb1' },
  writing: { name: 'The Daily Commit', what: 'Writing', block: [1, -1], colour: '#ffe066' },
  work: { name: 'Business District', what: 'Work', block: [2, -2], colour: '#7fd6ff' },
  projects: { name: 'The Garage', what: 'Projects', block: [2, 1], colour: '#ffa94d' },
  library: { name: 'Bookstore', what: 'Library', block: [-1, 1], colour: '#b197fc' },
  contact: { name: 'Post Office', what: 'Contact', block: [0, 1], colour: '#ff6b6b' },
};

const DISTRICTS = [
  { name: 'Filter Coffee Junction', test: (x, z) => Math.abs(x) < 14 && Math.abs(z) < 14 },
  { name: 'Tech Park Phase 7', test: (x, z) => x > 12 && z < -12 },
  { name: 'Old Quarter', test: (x, z) => x <= 12 && z < -12 },
  { name: 'Industrial Layout', test: (x, z) => x > 12 && z >= -12 },
  { name: 'Market Road', test: () => true },
];

const QUIPS = {
  cow: 'The cow has right of way. The cow has always had right of way.',
  flyover: 'Flyover opening soon. It has been opening soon since 2011.',
  pothole: 'A pothole of historical importance. Please do not disturb it.',
  coffee: 'Filter coffee: now with even more filter.',
};

function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function canvasTexture(w, h, draw) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function fitText(g, text, maxW, size, weight, family) {
  let fs = size;
  do {
    g.font = `${weight} ${fs}px ${family}`;
    fs -= 3;
  } while (g.measureText(text).width > maxW && fs > 12);
}

function signTexture(text, { bg = '#1a0f2e', fg = '#ffe066', w = 512, h = 128, family = "'Big Shoulders Display', Inter, sans-serif", weight = 900, size = 92, border = null } = {}) {
  return canvasTexture(w, h, (g) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    if (border) {
      g.strokeStyle = border;
      g.lineWidth = 8;
      g.strokeRect(8, 8, w - 16, h - 16);
    }
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    fitText(g, text, w - 48, size, weight, family);
    g.fillText(text, w / 2, h / 2 + 4);
  });
}

// Facades: a window grid, and a matching map of which windows are lit at night.
function facadeTextures(wall, seed) {
  const r = seeded(seed);
  const lit = [];
  const base = canvasTexture(128, 128, (g) => {
    g.fillStyle = wall;
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = 'rgba(0,0,0,0.08)';
    g.fillRect(0, 120, 128, 8);
    for (let y = 0; y < 2; y++)
      for (let x = 0; x < 2; x++) {
        g.fillStyle = '#2b3245';
        g.fillRect(16 + x * 64, 22 + y * 64, 32, 36);
        g.fillStyle = 'rgba(255,255,255,0.15)';
        g.fillRect(16 + x * 64, 22 + y * 64, 32, 4);
        lit.push(r() < 0.55);
      }
  });
  const glow = canvasTexture(128, 128, (g) => {
    g.fillStyle = '#000';
    g.fillRect(0, 0, 128, 128);
    let k = 0;
    for (let y = 0; y < 2; y++)
      for (let x = 0; x < 2; x++) {
        if (lit[k++]) {
          g.fillStyle = r() < 0.3 ? '#9fd8ff' : '#ffc46b';
          g.fillRect(16 + x * 64, 22 + y * 64, 32, 36);
        }
      }
  });
  [base, glow].forEach((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  });
  return { base, glow };
}

// Box UVs scaled to the box, so the window grid repeats at a constant size.
function tiledBox(w, h, d, unit = 4) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let face = 0; face < 6; face++) {
    const [fu, fv] = dims[face];
    for (let i = 0; i < 4; i++) {
      const k = face * 4 + i;
      uv.setXY(k, uv.getX(k) * Math.max(1, Math.round(fu / unit)), uv.getY(k) * Math.max(1, Math.round(fv / unit)));
    }
  }
  // two draw groups instead of six: walls (material 0), then roof and floor (material 1)
  const idx = geo.index.array;
  const faces = [0, 1, 4, 5, 2, 3].flatMap((f) => Array.from(idx.slice(f * 6, f * 6 + 6)));
  geo.setIndex(faces);
  geo.clearGroups();
  geo.addGroup(0, 24, 0);
  geo.addGroup(24, 12, 1);
  return geo;
}

let api;
let root;
let renderer, scene, camera, clock;
let raf = 0;
let cleanup = [];
let els = {};

function on(t, type, fn, o) {
  t.addEventListener(type, fn, o);
  cleanup.push(() => t.removeEventListener(type, fn, o));
}

function build(stage) {
  const night = () => api.theme() === 'dark';
  // Render only when something changed: traffic (unless motion is reduced), the camera,
  // the player, or a flagged change such as a resize or theme switch.
  let dirty = true;
  const reduce = api.reduceMotion;

  root = document.createElement('div');
  root.className = 'city';
  root.innerHTML = `
    <canvas class="city-canvas" aria-hidden="true"></canvas>
    <div class="city-tags" aria-hidden="true"></div>
    <header class="city-readout"><span class="city-pin" aria-hidden="true"></span><div><p class="city-here">Filter Coffee Junction</p><p class="city-area">Side Quest City</p></div></header>
    <nav class="city-travel" aria-label="Side Quest City: quick travel">
      <p class="city-travel-title">Quick travel</p>
      <ul>
        <li><button type="button" data-go="home"><i style="--c:#fffaf0"></i>Filter Coffee Junction<span>Home</span></button></li>
        ${Object.entries(PLACES).map(([id, p]) => `<li><button type="button" data-go="${id}"><i style="--c:${p.colour}"></i>${p.name}<span>${p.what}</span></button></li>`).join('')}
      </ul>
    </nav>
    <div class="city-map" aria-hidden="true"><canvas width="360" height="360"></canvas></div>
    <p class="city-hint">Click a building to go in · Drag to look around · <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to drive the auto</p>
    <p class="city-prompt" hidden></p>
    <p class="city-bubble" role="status" hidden></p>`;
  stage.appendChild(root);
  els = {
    canvas: root.querySelector('.city-canvas'),
    tags: root.querySelector('.city-tags'),
    here: root.querySelector('.city-here'),
    area: root.querySelector('.city-area'),
    travel: root.querySelector('.city-travel'),
    map: root.querySelector('.city-map canvas'),
    prompt: root.querySelector('.city-prompt'),
    bubble: root.querySelector('.city-bubble'),
    hint: root.querySelector('.city-hint'),
  };

  // phones and tablets get a lighter renderer: lower resolution, no MSAA, a smaller shadow map
  const light = api.coarse || innerWidth <= 760;
  renderer = new THREE.WebGLRenderer({ canvas: els.canvas, antialias: !light, powerPreference: light ? 'default' : 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = light ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  // only buildings, trees and props cast shadows, and they never move: draw the map once
  renderer.shadowMap.autoUpdate = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd98a8a, 150, 330);
  camera = new THREE.PerspectiveCamera(30, 1, 1, 700);
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0xffd6c2, 0x3b2b4a, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffb27a, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(light ? 1024 : 2048, light ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -80, right: 80, top: 80, bottom: -80, near: 10, far: 260 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const mats = new Map();
  const mat = (color, opts = {}) => {
    const key = color + JSON.stringify(opts);
    if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...opts }));
    return mats.get(key);
  };
  const mesh = (geo, m, x = 0, y = 0, z = 0, { shadow = true, receive = true, ry = 0 } = {}) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.rotation.y = ry;
    o.castShadow = shadow;
    o.receiveShadow = receive;
    return o;
  };
  const glowing = []; // materials whose emissive follows night
  const glowMat = (color, emissive, strength = 1.6) => {
    const m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0, roughness: 0.5, flatShading: true });
    m.userData.night = strength;
    glowing.push(m);
    return m;
  };
  const signMat = (tex, strength = 1.3) => {
    const m = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.15, roughness: 0.6 });
    m.userData.night = strength;
    m.userData.day = 0.15;
    glowing.push(m);
    return m;
  };
  const halo = (() => {
    const tex = canvasTexture(64, 64, (g) => {
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,214,140,0.9)');
      grad.addColorStop(1, 'rgba(255,214,140,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
    });
    return new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
  })();

  const r = seeded(560001);
  const pickables = [];

  /* — Ground, roads, blocks — */
  const ground = mesh(new THREE.PlaneGeometry(900, 900), mat(0x3a3346), 0, -0.05, 0, { shadow: false });
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const asphalt = mesh(new THREE.PlaneGeometry(EDGE * 2 + 10, EDGE * 2 + 10), mat(0x2f2c38), 0, 0, 0, { shadow: false });
  asphalt.rotation.x = -Math.PI / 2;
  scene.add(asphalt);
  // Repeated pieces (dashes, trees, lamps, tanks) are batched into instanced meshes:
  // one draw call per kind instead of hundreds.
  const batches = new Map();
  const e3 = new THREE.Euler();
  const q4 = new THREE.Quaternion();
  function stamp(kind, geo, material, x, y, z, sx = 1, sy = 1, sz = 1, { ry = 0, rx = 0, shadow = true } = {}) {
    if (!batches.has(kind)) batches.set(kind, { geo, material, shadow, list: [] });
    q4.setFromEuler(e3.set(rx, ry, 0));
    batches.get(kind).list.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q4.clone(), new THREE.Vector3(sx, sy, sz)));
  }
  function flushBatches() {
    for (const { geo, material, shadow, list } of batches.values()) {
      const im = new THREE.InstancedMesh(geo, material, list.length);
      list.forEach((m, i) => im.setMatrixAt(i, m));
      im.castShadow = shadow;
      im.receiveShadow = true;
      scene.add(im);
    }
  }

  // lane markings
  const dash = mat(0xe8d9a8);
  const dashGeo = new THREE.PlaneGeometry(0.35, 2.4);
  for (const k of ROADS) {
    for (let t = -EDGE; t < EDGE; t += 6) {
      if (ROADS.some((q) => Math.abs(q - (t + 3)) < 4)) continue;
      stamp('dash', dashGeo, dash, k, 0.02, t + 3, 1, 1, 1, { rx: -Math.PI / 2, shadow: false });
      stamp('dash', dashGeo, dash, t + 3, 0.02, k, 1, 1, 1, { rx: -Math.PI / 2, ry: Math.PI / 2, shadow: false });
    }
  }

  const facades = ['#f7c8d2', '#c9ecd9', '#fff1b8', '#cfe4ff', '#f4ecdc', '#ffd8a8', '#e3d4ff'].map((c, i) => facadeTextures(c, 70 + i));
  const glassFacade = facadeTextures('#5f7fa8', 99);
  const roofMat = mat(0xd8d0c4);
  const facadeMats = facades.map((f) => {
    const m = new THREE.MeshStandardMaterial({ map: f.base, emissive: 0xffffff, emissiveMap: f.glow, emissiveIntensity: 0, roughness: 0.8 });
    m.userData.night = 1.1;
    glowing.push(m);
    return m;
  });
  const glassMat = (() => {
    const m = new THREE.MeshStandardMaterial({ map: glassFacade.base, emissive: 0xffffff, emissiveMap: glassFacade.glow, emissiveIntensity: 0, roughness: 0.25, metalness: 0.3 });
    m.userData.night = 1.3;
    glowing.push(m);
    return m;
  })();
  const tankMat = mat(0x1f2328);
  const tankGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 10);

  function building(x, z, w, d, h, { glass = false, tanks = true } = {}) {
    const fm = glass ? glassMat : facadeMats[Math.floor(r() * facadeMats.length)];
    const b = mesh(tiledBox(w, h, d), [fm, roofMat], x, h / 2 + 0.3, z);
    scene.add(b);
    // the black water tanks on every Bangalore roof
    if (tanks && !glass) {
      const n = 1 + Math.floor(r() * 2);
      for (let i = 0; i < n; i++) stamp('tank', tankGeo, tankMat, x + (r() - 0.5) * (w - 2), h + 1, z + (r() - 0.5) * (d - 2));
    }
    return b;
  }

  const leaf = [mat(0x4f9a4a), mat(0x3f8a45), mat(0x5aa856)];
  const trunk = mat(0x6b4a33);
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.32, 2.2, 6);
  const crownGeo = new THREE.IcosahedronGeometry(1.7, 0);
  function tree(x, z, s = 1) {
    stamp('trunk', trunkGeo, trunk, x, 1.1 * s + 0.3, z, s, s, s);
    const k = Math.floor(r() * 3);
    stamp('crown' + k, crownGeo, leaf[k], x, 3.1 * s + 0.3, z, s, s * 0.75, s, { ry: r() * 6 });
  }

  const lampMat = glowMat(0xfff6dc, 0xffd28a, 2.2);
  const halos = [];
  const poleGeo = new THREE.CylinderGeometry(0.1, 0.12, 4.2, 6);
  const bulbGeo = new THREE.SphereGeometry(0.32, 8, 6);
  const poleMat = mat(0x55505e);
  function streetLight(x, z) {
    stamp('pole', poleGeo, poleMat, x, 2.4, z, 1, 1, 1, { shadow: false });
    stamp('bulb', bulbGeo, lampMat, x, 4.6, z, 1, 1, 1, { shadow: false });
    const s = new THREE.Sprite(halo);
    s.position.set(x, 4.6, z);
    s.scale.set(5, 5, 1);
    halos.push(s);
    scene.add(s);
  }

  const sidewalk = mat(0xb3aab8);
  const walkGeo = new THREE.BoxGeometry(B + 1.4, 0.3, B + 1.4);
  const placeBlocks = new Map(Object.entries(PLACES).map(([id, p]) => [p.block.join(','), id]));
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const cx = i * P;
      const cz = j * P;
      stamp('walk', walkGeo, sidewalk, cx, 0.15, cz, 1, 1, 1, { shadow: false });
      const key = `${i},${j}`;
      if (placeBlocks.has(key) || (i === 0 && j === 0)) continue;
      // filler: taller towards the tech park in the north-east
      const tall = i >= 1 && j <= -1;
      const lots = [[-4.2, -4.2], [4.2, -4.2], [-4.2, 4.2], [4.2, 4.2]];
      lots.forEach(([lx, lz], k) => {
        if (r() < 0.12) return tree(cx + lx, cz + lz, 1.2);
        const h = tall ? 12 + r() * 22 : 4 + r() * 9;
        building(cx + lx, cz + lz, 7 + r() * 0.8, 7 + r() * 0.8, h, { glass: tall && k % 2 === 0 });
      });
    }
  }
  // sidewalk trees and lamps
  for (const k of ROADS) {
    for (let t = -EDGE + 8; t < EDGE; t += P) {
      if (r() < 0.75) tree(k + 4.3, t + 4, 0.8);
      if (r() < 0.6) tree(t + 4, k - 4.3, 0.8);
    }
  }
  for (const x of ROADS) for (const z of ROADS) streetLight(x + 4.4, z + 4.4);

  // the city goes on: low roofs out to the haze
  const ring = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0x5d5368), 420);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < 420; i++) {
    let x, z;
    do {
      x = (r() - 0.5) * 420;
      z = (r() - 0.5) * 420;
    } while (Math.abs(x) < EDGE + 8 && Math.abs(z) < EDGE + 8);
    const h = 2 + r() * (Math.hypot(x, z) < 120 ? 9 : 5);
    m4.compose(new THREE.Vector3(x, h / 2, z), new THREE.Quaternion(), new THREE.Vector3(5 + r() * 6, h, 5 + r() * 6));
    ring.setMatrixAt(i, m4);
  }
  ring.receiveShadow = true;
  scene.add(ring);

  /* — Places — */
  const places = {};
  function addPlace(id, group, height, extra = []) {
    const p = PLACES[id];
    const [i, j] = p.block;
    group.position.set(i * P, 0.3, j * P);
    group.traverse((o) => {
      if (o.isMesh) {
        o.userData.pick = { type: 'place', id };
        pickables.push(o);
      }
    });
    scene.add(group);
    extra.forEach((o) => scene.add(o));
    const tag = document.createElement('p');
    tag.className = 'city-tag';
    tag.style.setProperty('--c', p.colour);
    tag.innerHTML = `<b></b><span></span>`;
    tag.querySelector('b').textContent = p.name;
    tag.querySelector('span').textContent = p.what;
    els.tags.appendChild(tag);
    places[id] = { id, group, tag, pos: new THREE.Vector3(i * P, 0, j * P), top: height + 2 };
  }
  const G = () => new THREE.Group();
  const add = (g, ...o) => (o.forEach((x) => g.add(x)), g);

  // My Apartment: pink, four floors, balconies, washing on the line.
  {
    const g = G();
    const fm = facadeMats[0];
    add(g, mesh(tiledBox(12, 14, 10), [fm, roofMat], 0, 7, -1));
    for (let f = 0; f < 4; f++) {
      add(g, mesh(new THREE.BoxGeometry(12.4, 0.3, 1.6), mat(0xf4ecdc), 0, 2.6 + f * 3.4, 4.6));
      add(g, mesh(new THREE.BoxGeometry(12.4, 0.9, 0.12), mat(0x5a6b8c), 0, 3.2 + f * 3.4, 5.4));
    }
    ['#ffe066', '#7fd6ff', '#ff6b6b', '#ffffff'].forEach((c, k) => add(g, mesh(new THREE.PlaneGeometry(0.9, 1.1), mat(c, { side: THREE.DoubleSide }), -3 + k * 1.6, 13.8 - 0.8, 5.2)));
    add(g, mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.6, 10), tankMat, 3.5, 14.8, -2));
    const s = mesh(new THREE.PlaneGeometry(5, 1.2), signMat(signTexture('NO. 404', { bg: '#5b3a7a', fg: '#fff4d6', family: "'Righteous', Inter, sans-serif", weight: 400 })), 0, 1.9, 5.45, { shadow: false });
    add(g, s);
    add(g, mesh(new THREE.BoxGeometry(2, 2.6, 0.3), mat(0x5b3a7a), 0, 1.3, 4.1));
    addPlace('about', g, 15);
  }

  // The Daily Commit: a newspaper office with a headline board fed by the essays.
  let headline;
  {
    const g = G();
    const fm = facadeMats[4];
    add(g, mesh(tiledBox(14, 10, 11), [fm, roofMat], 0, 5, -1));
    add(g, mesh(new THREE.BoxGeometry(14.4, 0.6, 11.4), mat(0x1d1c1a), 0, 10.2, -1));
    add(g, mesh(new THREE.PlaneGeometry(13, 2.4), signMat(signTexture('THE DAILY COMMIT', { bg: '#1d1c1a', fg: '#fffaf0', family: 'Georgia, serif', weight: 700 })), 0, 11.9, 4.55, { shadow: false }));
    add(g, mesh(new THREE.BoxGeometry(13.6, 2.6, 0.2), mat(0x1d1c1a), 0, 11.9, 4.4));
    const essays = api.data.essays.slice(0, 6);
    let k = 0;
    const draw = () =>
      canvasTexture(512, 256, (c, w, h) => {
        c.fillStyle = '#fffaf0';
        c.fillRect(0, 0, w, h);
        c.fillStyle = '#c2541f';
        c.fillRect(24, 22, 120, 10);
        c.fillStyle = '#1d1c1a';
        c.font = '700 22px Inter, sans-serif';
        c.fillText('LATE EDITION', 160, 34);
        const t = essays.length ? essays[k % essays.length].title : 'Nothing to report';
        c.font = '700 40px Georgia, serif';
        const words = t.split(' ');
        let line = '';
        let y = 92;
        for (const word of words) {
          const test = line ? line + ' ' + word : word;
          if (c.measureText(test).width > w - 48 && line) {
            c.fillText(line, 24, y);
            line = word;
            y += 46;
          } else line = test;
        }
        c.fillText(line, 24, y);
      });
    headline = { mat: signMat(draw(), 0.9), next: () => {
      k++;
      headline.mat.map.dispose();
      const t = draw();
      headline.mat.map = t;
      headline.mat.emissiveMap = t;
      headline.mat.needsUpdate = true;
    } };
    add(g, mesh(new THREE.PlaneGeometry(8, 4), headline.mat, 0, 5, 4.56, { shadow: false }));
    add(g, mesh(new THREE.BoxGeometry(2.4, 2.6, 0.3), mat(0x2d3a5c), -4.5, 1.3, 4.5));
    addPlace('writing', g, 13);
  }

  // Business District: three glass towers and a sign with ambitions.
  {
    const g = G();
    add(g, mesh(tiledBox(7, 38, 7), [glassMat, roofMat], -3.5, 19, -3.5));
    add(g, mesh(tiledBox(6, 28, 6), [glassMat, roofMat], 4.5, 14, -3));
    add(g, mesh(tiledBox(6, 20, 6), [glassMat, roofMat], 1, 10, 4.5));
    add(g, mesh(new THREE.CylinderGeometry(0.15, 0.15, 6, 6), mat(0x9aa0aa), -3.5, 41, -3.5));
    const blink = glowMat(0xff4d4d, 0xff3030, 3);
    add(g, mesh(new THREE.SphereGeometry(0.4, 8, 6), blink, -3.5, 44, -3.5));
    add(g, mesh(new THREE.PlaneGeometry(9, 1.6), signMat(signTexture('TECH PARK PHASE 7', { bg: '#0f2a3a', fg: '#7fd6ff' }), 1.6), -2, 2.4, 0.06 + 0.02, { shadow: false }));
    addPlace('work', g, 40);
  }

  // The Garage: a shed with a roller shutter and a car on stands.
  {
    const g = G();
    add(g, mesh(new THREE.BoxGeometry(13, 6, 10), mat(0xc9ccd1), 0, 3, -1.5));
    const roof = mesh(new THREE.CylinderGeometry(5.4, 5.4, 13.2, 12, 1, false, 0, Math.PI), mat(0x8a929c), 0, 6, -1.5);
    roof.rotation.z = Math.PI / 2;
    roof.rotation.y = Math.PI / 2;
    roof.scale.set(1, 1, 0.45);
    add(g, roof);
    for (let k = 0; k < 7; k++) add(g, mesh(new THREE.BoxGeometry(7, 0.5, 0.15), mat(k % 2 ? 0x9aa0aa : 0xb4b9c0), -1.5, 0.6 + k * 0.62, 3.6));
    add(g, mesh(new THREE.PlaneGeometry(6.5, 1.3), signMat(signTexture('GARAGE', { bg: '#ffa94d', fg: '#1d1c1a' })), -1.5, 5.2, 3.56, { shadow: false }));
    const car = G();
    add(car, mesh(new THREE.BoxGeometry(3.2, 1, 1.8), mat(0x2f6fd6)), mesh(new THREE.BoxGeometry(1.8, 0.8, 1.6), mat(0xcfe4ff), -0.2, 0.9, 0));
    car.position.set(4.6, 1.6, 5.4);
    add(g, car, mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), mat(0x444444), 3.5, 0.55, 5.4), mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), mat(0x444444), 5.8, 0.55, 5.4));
    const forge = mesh(new THREE.PlaneGeometry(3.2, 0.8), signMat(signTexture('FORGE INSIDE', { bg: '#1d1c1a', fg: '#ffa94d', size: 70 })), 4.6, 3.1, 6.3, { shadow: false });
    add(g, forge);
    addPlace('projects', g, 9);
  }

  // Bookstore: an awning, and the favourites in the window.
  {
    const g = G();
    const fm = facadeMats[6];
    add(g, mesh(tiledBox(12, 8, 10), [fm, roofMat], 0, 4, -1));
    for (let k = 0; k < 6; k++) {
      const stripe = mesh(new THREE.BoxGeometry(2, 0.2, 2.6), mat(k % 2 ? 0xfff4d6 : 0x7a2e3a), -5 + k * 2, 3.4, 5.2);
      stripe.rotation.x = 0.3;
      add(g, stripe);
    }
    add(g, mesh(new THREE.PlaneGeometry(10, 1.4), signMat(signTexture('BOOKSTORE', { bg: '#2d1b4e', fg: '#e5dbff' })), 0, 6.6, 4.05, { shadow: false }));
    add(g, mesh(new THREE.PlaneGeometry(9, 2.2), mat(0x2b2140), 0, 1.5, 4.03, { shadow: false }));
    const loader = new THREE.TextureLoader();
    api.data.books.slice(0, 7).forEach((b, k) => {
      if (!b.cover) return;
      const tex = loader.load(b.cover);
      tex.colorSpace = THREE.SRGBColorSpace;
      add(g, mesh(new THREE.PlaneGeometry(0.95, 1.45), new THREE.MeshBasicMaterial({ map: tex }), -3.6 + k * 1.2, 1.5, 4.08, { shadow: false }));
    });
    addPlace('library', g, 9);
  }

  // Post Office: red, with the pillar box out front.
  {
    const g = G();
    add(g, mesh(new THREE.BoxGeometry(13, 7, 9), mat(0xc73e3a), 0, 3.5, -1.5));
    add(g, mesh(new THREE.BoxGeometry(13.6, 1, 9.6), mat(0xf4ecdc), 0, 7.4, -1.5));
    for (let k = 0; k < 4; k++) add(g, mesh(new THREE.CylinderGeometry(0.35, 0.35, 6, 8), mat(0xf4ecdc), -4.5 + k * 3, 3, 3.3));
    add(g, mesh(new THREE.PlaneGeometry(9, 1.3), signMat(signTexture('POST OFFICE', { bg: '#f4ecdc', fg: '#a62c2a' })), 0, 6.3, 3.06, { shadow: false }));
    add(g, mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.2, 12), mat(0xd62f2a), 5.2, 1.1, 5.6), mesh(new THREE.SphereGeometry(0.62, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xd62f2a), 5.2, 2.2, 5.6));
    addPlace('contact', g, 9);
  }

  // Filter Coffee Junction: the centre, a rain tree and a coffee stall.
  {
    scene.add(mesh(new THREE.CylinderGeometry(7.5, 7.5, 0.4, 24), mat(0x6fae55), 0, 0.35, 0, { shadow: false }));
    tree(0, 0, 2.4);
    const stall = G();
    add(stall, mesh(new THREE.BoxGeometry(3.4, 2.2, 2.2), mat(0xf2c14e)), mesh(new THREE.BoxGeometry(4, 0.25, 2.8), mat(0x7a2e3a), 0, 1.3, 0.2));
    add(stall, mesh(new THREE.PlaneGeometry(3.2, 0.7), signMat(signTexture('FILTER COFFEE', { bg: '#7a2e3a', fg: '#fff4d6', size: 80 })), 0, 1.9, 1.62, { shadow: false }));
    stall.position.set(4.6, 1.4, 4.6);
    stall.rotation.y = Math.PI / 4;
    stall.traverse((o) => o.isMesh && ((o.userData.pick = { type: 'quip', id: 'coffee' }), pickables.push(o)));
    scene.add(stall);
  }

  flushBatches();

  /* — Jokes the city tells — */
  // The flyover: opening soon, since 2011.
  {
    const deckMat = mat(0xb9b2a4);
    const z = 1.5 * P;
    scene.add(mesh(new THREE.BoxGeometry(44, 1, 6), deckMat, -44, 7, z));
    for (let x = -62; x <= -26; x += 9) scene.add(mesh(new THREE.BoxGeometry(1.4, 7, 1.4), deckMat, x, 3.5, z));
    for (let k = 0; k < 6; k++) scene.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 4), mat(0x6d6d6d), -21.6, 8.5, z - 2.5 + k));
    const sign = mesh(new THREE.PlaneGeometry(7, 2.6), signMat(canvasTexture(512, 192, (g, w, h) => {
      g.fillStyle = '#ffe066';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#1d1c1a';
      g.textAlign = 'center';
      g.font = "900 64px 'Big Shoulders Display', Inter, sans-serif";
      g.fillText('FLYOVER OPENING SOON', w / 2, 82);
      g.font = '700 40px Inter, sans-serif';
      g.fillText('since 2011', w / 2, 150);
    }), 1), -24, 10.4, z + 3.05, { shadow: false });
    sign.userData.pick = { type: 'quip', id: 'flyover' };
    pickables.push(sign);
    scene.add(sign);
  }
  // A heritage pothole, cordoned off.
  {
    const x = 1.5 * P;
    const z = -6;
    const hole = mesh(new THREE.CircleGeometry(1.4, 10), mat(0x16151a), x, 0.03, z, { shadow: false });
    hole.rotation.x = -Math.PI / 2;
    scene.add(hole);
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2;
      const cone = mesh(new THREE.ConeGeometry(0.35, 1, 8), mat(0xff7a1a), x + Math.cos(a) * 2, 0.5, z + Math.sin(a) * 2);
      cone.userData.pick = { type: 'quip', id: 'pothole' };
      pickables.push(cone);
      scene.add(cone);
    }
    hole.userData.pick = { type: 'quip', id: 'pothole' };
    pickables.push(hole);
  }
  // The cow, who was here first.
  let cow;
  {
    cow = G();
    const white = mat(0xf4f1ea);
    add(cow, mesh(new THREE.BoxGeometry(2.6, 1.2, 1.1), white, 0, 1.5, 0), mesh(new THREE.BoxGeometry(0.9, 0.8, 0.7), white, 1.6, 1.9, 0));
    for (const [x, z] of [[-0.9, -0.35], [0.9, -0.35], [-0.9, 0.35], [0.9, 0.35]]) add(cow, mesh(new THREE.BoxGeometry(0.25, 1, 0.25), white, x, 0.5, z));
    add(cow, mesh(new THREE.ConeGeometry(0.12, 0.5, 5), mat(0xc9a679), 1.7, 2.5, -0.25), mesh(new THREE.ConeGeometry(0.12, 0.5, 5), mat(0xc9a679), 1.7, 2.5, 0.25));
    add(cow, mesh(new THREE.SphereGeometry(0.42, 8, 6), mat(0xffb27a), 0, 2.35, 0));
    cow.position.set(-0.5 * P + 4.2, 0.3, 0.5 * P - 6);
    cow.rotation.y = 0.6;
    cow.traverse((o) => o.isMesh && ((o.userData.pick = { type: 'quip', id: 'cow' }), pickables.push(o)));
    scene.add(cow);
  }

  /* — Traffic — */
  const vehicles = [];
  const autoParts = (g) => {
    add(g, mesh(new THREE.BoxGeometry(1.5, 0.9, 2.4), mat(0x2e8b57), 0, 0.75, 0), mesh(new THREE.BoxGeometry(1.6, 0.25, 2.2), mat(0xffd400), 0, 1.95, -0.05));
    add(g, mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mat(0x1d1c1a), -0.7, 1.45, 0.9), mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mat(0x1d1c1a), 0.7, 1.45, 0.9), mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mat(0x1d1c1a), -0.7, 1.45, -1.1), mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mat(0x1d1c1a), 0.7, 1.45, -1.1));
    add(g, mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8), mat(0x111111), 0, 0.3, 1.1));
    return g;
  };
  const carParts = (g, colour) => add(g, mesh(new THREE.BoxGeometry(1.7, 0.8, 3.4), mat(colour), 0, 0.7, 0), mesh(new THREE.BoxGeometry(1.5, 0.7, 1.8), mat(0xcfe4ff, { roughness: 0.3 }), 0, 1.45, -0.2));
  const busTex = signTexture('NOWHERE NAGAR', { bg: '#111', fg: '#ff9e2c', size: 70 });
  const busParts = (g) => {
    add(g, mesh(new THREE.BoxGeometry(2.3, 2.6, 8), mat(0x2f7dbd), 0, 1.6, 0), mesh(new THREE.BoxGeometry(2.34, 0.8, 7.4), mat(0x1d2b3a), 0, 2.2, 0));
    add(g, mesh(new THREE.PlaneGeometry(2, 0.45), signMat(busTex, 1.4), 0, 2.75, 4.01, { shadow: false }));
    return g;
  };
  const lanes = [];
  for (const k of ROADS) {
    lanes.push({ axis: 'z', at: k + 1.6, dir: 1 }, { axis: 'z', at: k - 1.6, dir: -1 }, { axis: 'x', at: k - 1.6, dir: 1 }, { axis: 'x', at: k + 1.6, dir: -1 });
  }
  const tails = [];
  for (let i = 0; i < 30; i++) {
    const lane = lanes[Math.floor(r() * lanes.length)];
    const kind = r();
    const g = G();
    if (kind < 0.45) autoParts(g);
    else if (kind < 0.9) carParts(g, [0xffffff, 0xd8342c, 0x2b2f3a, 0x9aa0aa, 0xf2c14e][Math.floor(r() * 5)]);
    else busParts(g);
    const tail = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff3b3b, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, map: halo.map }));
    tail.scale.set(1.6, 1.6, 1);
    tail.position.set(0, 0.8, kind >= 0.9 ? -4.2 : -1.8);
    g.add(tail);
    tails.push(tail.material);
    const v = { g, lane, t: (r() - 0.5) * EDGE * 2, speed: (kind >= 0.9 ? 6 : 8 + r() * 6) * lane.dir };
    g.rotation.y = lane.axis === 'z' ? (lane.dir > 0 ? 0 : Math.PI) : lane.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    // traffic receives shadows but does not cast them: a cheaper shadow pass
    g.traverse((o) => o.isMesh && (o.castShadow = false));
    vehicles.push(v);
    scene.add(g);
  }

  // The visitor's own auto, for anyone who wants to drive.
  const player = { g: autoParts(G()), heading: Math.PI, speed: 0, driving: false };
  player.g.position.set(0.5 * P - 1.6, 0.05, 6);
  player.g.add(mesh(new THREE.ConeGeometry(0.35, 0.8, 4), glowMat(0xffe066, 0xffe066, 2), 0, 3, 0));
  player.g.rotation.y = player.heading;
  scene.add(player.g);

  /* — Theme — */
  function applyTheme() {
    const n = night();
    const sky = n ? ['#0b1028', '#1d2350', '#4a3a6e'] : ['#2a1b4f', '#a8457a', '#ff9e5e'];
    scene.background = canvasTexture(4, 256, (g, w, h) => {
      const grad = g.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, sky[0]);
      grad.addColorStop(0.55, sky[1]);
      grad.addColorStop(1, sky[2]);
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    });
    scene.fog.color.set(n ? 0x2a2550 : 0xd98a8a);
    hemi.color.set(n ? 0x8a8fd8 : 0xffd6c2);
    hemi.groundColor.set(n ? 0x1d1a2e : 0x3b2b4a);
    hemi.intensity = n ? 0.75 : 1.05;
    sun.color.set(n ? 0x9fb4ff : 0xffb27a);
    sun.intensity = n ? 0.8 : 2.6;
    sun.position.set(n ? 60 : -90, n ? 110 : 55, n ? -40 : 60);
    renderer.toneMappingExposure = n ? 1.1 : 1;
    glowing.forEach((m) => (m.emissiveIntensity = n ? m.userData.night : m.userData.day || 0));
    halo.opacity = n ? 0.85 : 0;
    tails.forEach((m) => (m.opacity = n ? 0.9 : 0));
    renderer.shadowMap.needsUpdate = true;
    dirty = true;
  }
  applyTheme();

  /* — Camera — */
  const AZ = new THREE.Vector3(1, 0, 1).normalize();
  const ELEV = 0.86; // radians above the ground
  const want = { target: new THREE.Vector3(0, 0, 0), dist: 150 };
  const now = { target: new THREE.Vector3(0, 0, 0), dist: 150 };
  let free = null; // the screen region the reader leaves free

  function placeCamera() {
    const off = AZ.clone().multiplyScalar(Math.cos(ELEV) * now.dist);
    off.y = Math.sin(ELEV) * now.dist;
    camera.position.copy(now.target).add(off);
    camera.lookAt(now.target);
  }

  function resize() {
    const w = root.clientWidth || innerWidth;
    const h = root.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    applyOffset();
  }
  function applyOffset() {
    const w = root.clientWidth || innerWidth;
    const h = root.clientHeight || innerHeight;
    const rr = api.readerRect();
    free = null;
    if (rr) {
      free = rr.top > h * 0.2 ? { cx: w / 2, cy: rr.top / 2 } : { cx: rr.left / 2, cy: h / 2 };
      camera.setViewOffset(w, h, w / 2 - free.cx, h / 2 - free.cy, w, h);
    } else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    dirty = true;
  }

  const homeView = () => {
    const w = root.clientWidth || innerWidth;
    return { target: new THREE.Vector3(0, 0, 4), dist: w < 700 ? 330 : 215 };
  };
  function goTo(section, instant) {
    if (section === 'home' || !places[section]) Object.assign(want, homeView());
    else {
      const p = places[section];
      want.target = p.pos.clone().add(new THREE.Vector3(0, Math.min(p.top * 0.35, 10), 0));
      want.dist = section === 'work' ? 125 : 85;
    }
    player.driving = false;
    if (instant || reduce) {
      now.target.copy(want.target);
      now.dist = want.dist;
    }
  }
  Object.assign(now, homeView());
  Object.assign(want, homeView());

  /* — Picking — */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hover = null;
  function pickAt(clientX, clientY) {
    const rect = els.canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit ? hit.object.userData.pick : null;
  }
  function setHover(pick) {
    const id = pick && pick.type === 'place' ? pick.id : null;
    if (hover === id) return;
    hover = id;
    Object.values(places).forEach((p) => p.tag.classList.toggle('is-hover', p.id === id));
    els.canvas.style.cursor = pick ? 'pointer' : '';
  }

  function say(text, x, y) {
    els.bubble.textContent = text;
    els.bubble.style.left = Math.min(innerWidth - 170, Math.max(170, x)) + 'px';
    els.bubble.style.top = Math.max(90, y) + 'px';
    els.bubble.hidden = false;
    clearTimeout(say.t);
    say.t = setTimeout(() => (els.bubble.hidden = true), 3600);
  }

  /* — Input: click, drag to pan, wheel to zoom, WASD to drive — */
  let drag = null;
  on(els.canvas, 'pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, target: now.target.clone(), moved: false };
    els.canvas.setPointerCapture(e.pointerId);
  });
  on(els.canvas, 'pointermove', (e) => {
    if (drag) {
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
      if (drag.moved) {
        const k = now.dist / 520;
        const right = new THREE.Vector3(1, 0, -1).normalize();
        const up = new THREE.Vector3(-1, 0, -1).normalize();
        want.target = drag.target.clone().addScaledVector(right, -dx * k).addScaledVector(up, (dy * k) / Math.sin(ELEV));
        want.target.x = Math.max(-EDGE, Math.min(EDGE, want.target.x));
        want.target.z = Math.max(-EDGE, Math.min(EDGE, want.target.z));
        now.target.copy(want.target);
        player.driving = false;
      }
      return;
    }
    if (e.pointerType === 'mouse') setHover(pickAt(e.clientX, e.clientY));
  });
  on(els.canvas, 'pointerup', (e) => {
    const d = drag;
    drag = null;
    if (!d || d.moved) return;
    const pick = pickAt(e.clientX, e.clientY);
    if (!pick) return;
    if (pick.type === 'place') {
      api.sfx('select');
      api.go(pick.id);
    } else {
      api.sfx('egg');
      say(QUIPS[pick.id], e.clientX, e.clientY - 20);
    }
  });
  on(els.canvas, 'wheel', (e) => {
    e.preventDefault();
    want.dist = Math.max(40, Math.min(340, want.dist * Math.exp(e.deltaY * 0.0012)));
  }, { passive: false });

  const keys = new Set();
  const DRIVE = { KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 };
  on(window, 'keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], .reader, dialog')) return;
    if (DRIVE[e.code]) {
      e.preventDefault();
      keys.add(e.code);
      player.driving = true;
      root.classList.add('is-driving');
    }
    if ((e.code === 'KeyE' || e.code === 'Enter') && nearPlace) {
      e.preventDefault();
      api.go(nearPlace);
    }
  });
  on(window, 'keyup', (e) => keys.delete(e.code));
  on(window, 'blur', () => keys.clear());

  els.travel.querySelectorAll('[data-go]').forEach((b) => on(b, 'click', () => api.go(b.dataset.go)));
  on(window, 'resize', resize);

  /* — Minimap — */
  const mapCtx = els.map.getContext('2d');
  function drawMap() {
    const S = 360;
    const scale = 1.5;
    const c = mapCtx;
    const t = now.target;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, S, S);
    c.fillStyle = '#231d33';
    c.fillRect(0, 0, S, S);
    // screen-aligned: right = (x - z), down = (x + z)
    const k = Math.SQRT1_2 * scale;
    c.setTransform(k, k, -k, k, S / 2 - (t.x - t.z) * k, S / 2 - (t.x + t.z) * k);
    c.fillStyle = '#3b3450';
    c.fillRect(-EDGE - 4, -EDGE - 4, EDGE * 2 + 8, EDGE * 2 + 8);
    for (let i = -2; i <= 2; i++)
      for (let j = -2; j <= 2; j++) {
        c.fillStyle = i === 0 && j === 0 ? '#4f8a4a' : '#6b6380';
        c.fillRect(i * P - B / 2, j * P - B / 2, B, B);
      }
    Object.values(places).forEach((p) => {
      c.fillStyle = PLACES[p.id].colour;
      c.beginPath();
      c.arc(p.pos.x, p.pos.z, 5, 0, Math.PI * 2);
      c.fill();
    });
    c.fillStyle = '#ffe066';
    c.beginPath();
    c.arc(player.g.position.x, player.g.position.z, 3, 0, Math.PI * 2);
    c.fill();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.strokeStyle = '#fffaf0';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(S / 2, S / 2 - 12);
    c.lineTo(S / 2 + 9, S / 2 + 9);
    c.lineTo(S / 2 - 9, S / 2 + 9);
    c.closePath();
    c.stroke();
  }

  /* — Loop — */
  let nearPlace = null;
  let lastArea = '';
  let headlineClock = 0;
  const v3 = new THREE.Vector3();
  const blocked = (x, z) => {
    // inside a block (not on a road)?
    const fx = ((x + 2.5 * P) % P + P) % P;
    const fz = ((z + 2.5 * P) % P + P) % P;
    const inBlock = (f) => f > (P - B) / 2 + 0.5 && f < P - (P - B) / 2 - 0.5;
    return inBlock(fx) && inBlock(fz);
  };

  const lastCam = new THREE.Vector4();
  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    if (!reduce) {
      for (const v of vehicles) {
        v.t += v.speed * dt;
        if (v.t > EDGE + 8) v.t = -EDGE - 8;
        if (v.t < -EDGE - 8) v.t = EDGE + 8;
        if (v.lane.axis === 'z') v.g.position.set(v.lane.at, 0.05, v.t);
        else v.g.position.set(v.t, 0.05, v.lane.at);
      }
      cow.children[0].rotation.z = Math.sin(time * 0.8) * 0.02;
      headlineClock += dt;
      if (headlineClock > 7) {
        headlineClock = 0;
        headline.next();
      }
    }

    if (player.driving) {
      const fwd = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
      const turn = (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) - (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0);
      player.speed += (fwd * 26 - player.speed * 2.2) * dt;
      player.heading += turn * dt * 2.4 * Math.sign(player.speed || 1) * Math.min(1, Math.abs(player.speed) / 4 + 0.2);
      const nx = player.g.position.x + Math.sin(player.heading) * player.speed * dt;
      const nz = player.g.position.z + Math.cos(player.heading) * player.speed * dt;
      if (!blocked(nx, nz) && Math.abs(nx) < EDGE + 5 && Math.abs(nz) < EDGE + 5) player.g.position.set(nx, 0.05, nz);
      else player.speed *= -0.3;
      player.g.rotation.y = player.heading;
      want.target.copy(player.g.position);
      want.dist = Math.min(want.dist, 80);
      // the nearest door, if close enough to knock
      nearPlace = null;
      let best = 15;
      for (const p of Object.values(places)) {
        const d = Math.hypot(p.pos.x - player.g.position.x, p.pos.z - player.g.position.z);
        if (d < best) (best = d), (nearPlace = p.id);
      }
      els.prompt.hidden = !nearPlace;
      if (nearPlace) els.prompt.innerHTML = `Press <kbd>E</kbd> to enter ${PLACES[nearPlace].name}`;
    } else if (!els.prompt.hidden) {
      els.prompt.hidden = true;
      nearPlace = null;
    }

    // glide
    const k = reduce ? 1 : 1 - Math.exp(-dt * 3.2);
    now.target.lerp(want.target, k);
    now.dist += (want.dist - now.dist) * k;
    placeCamera();
    // haze sits past the city at any zoom
    scene.fog.near = now.dist * 1.15;
    scene.fog.far = now.dist * 2.6;

    const moved = Math.abs(lastCam.x - now.target.x) + Math.abs(lastCam.z - now.target.z) + Math.abs(lastCam.w - now.dist) > 0.01;
    lastCam.set(now.target.x, 0, now.target.z, now.dist);
    const covered = root.classList.contains('is-reading') && innerWidth <= 760;
    if (!moved && !dirty && !player.driving && (reduce || covered)) {
      raf = requestAnimationFrame(tick);
      return;
    }
    if (hover !== null || moved || player.driving) dirty = true;

    // labels
    const w = root.clientWidth;
    const h = root.clientHeight;
    for (const p of Object.values(places)) {
      v3.set(p.pos.x, p.top, p.pos.z).project(camera);
      const x = (v3.x * 0.5 + 0.5) * w;
      const y = (-v3.y * 0.5 + 0.5) * h;
      const off = v3.z > 1 || x < -60 || x > w + 60 || y < -20 || y > h + 40;
      p.tag.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
      p.tag.classList.toggle('is-off', off);
    }

    // where am I
    const tx = now.target.x;
    const tz = now.target.z;
    let here = DISTRICTS.find((d) => d.test(tx, tz)).name;
    let area = 'Side Quest City';
    for (const p of Object.values(places)) {
      if (Math.hypot(p.pos.x - tx, p.pos.z - tz) < 13) {
        area = here;
        here = PLACES[p.id].name;
      }
    }
    if (here + area !== lastArea) {
      lastArea = here + area;
      els.here.textContent = here;
      els.area.textContent = area;
    }

    if (moved || player.driving || dirty) drawMap();
    renderer.render(scene, camera);
    dirty = false;
    raf = requestAnimationFrame(tick);
  }

  resize();
  placeCamera();
  raf = requestAnimationFrame(tick);

  return {
    goTo,
    applyTheme,
    reframe: () => applyOffset(),
    places,
    dispose() {
      cancelAnimationFrame(raf);
      clearTimeout(say.t);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        ms.forEach((m) => {
          if (m.map) m.map.dispose();
          if (m.emissiveMap && m.emissiveMap !== m.map) m.emissiveMap.dispose();
          m.dispose();
        });
      });
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

let city = null;
let aborted = false;

const world = {
  id: 'city',

  async mount(stage, worldApi) {
    api = worldApi;
    cleanup = [];
    aborted = false;
    // the display faces must be ready before the signs are painted
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
    await Promise.allSettled([document.fonts.load("900 40px 'Big Shoulders Display'"), document.fonts.load("40px 'Righteous'")]);
    if (aborted) return; // the visitor left before the city was built
    city = build(stage);
  },

  show(section, { instant } = {}) {
    city.goTo(section, instant);
    root.querySelectorAll('.city-travel [data-go]').forEach((b) => b.toggleAttribute('aria-current', b.dataset.go === section));
    Object.values(city.places).forEach((p) => p.tag.classList.toggle('is-active', p.id === section));
  },

  setReading(open) {
    root.classList.toggle('is-reading', open);
    requestAnimationFrame(() => city.reframe());
  },

  setTheme() {
    city.applyTheme();
  },

  unmount() {
    aborted = true;
    cleanup.forEach((fn) => fn());
    cleanup = [];
    if (city) city.dispose();
    city = null;
    root?.remove();
    root = renderer = scene = camera = clock = null;
    els = {};
  },
};

export default world;
