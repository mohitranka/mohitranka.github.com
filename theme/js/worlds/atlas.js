import { deckle } from './paper.js';

// The Unfinished Atlas: the site's home screen, drawn in SVG from a fixed seed. Its
// landmarks are Writing, Work, Projects and Contact; Traveler's Home is the cottage you
// step into; the map pans and zooms by drag, wheel, pinch,
// keys or buttons, remembers where you have been, and a lantern walks the road
// between places. The fog in the north-east is the part that has not been written yet.

const W = 2000;
const H = 1300;

const PLACES = {
  about: { name: "Traveler's Home", x: 520, y: 760, verb: 'Step inside', icon: 'home' },
  writing: { name: 'Library of Stories', x: 860, y: 540, verb: 'Read the stories', icon: 'tower' },
  work: { name: 'The Citadel', x: 1250, y: 560, verb: 'Enter the Citadel', icon: 'castle' },
  projects: { name: "Craftsman's Forge", x: 1440, y: 830, verb: 'Visit the forge', icon: 'forge' },
  contact: { name: "Messenger's Outpost", x: 770, y: 1050, verb: 'Send a message', icon: 'outpost' },
};
const ROAD_ORDER = ['about', 'writing', 'work', 'projects', 'contact'];

function describe(section, data) {
  switch (section) {
    case 'about':
      return 'A cottage with shelves of books, a letterbox for messages and a fire that is usually lit. Who lives here, briefly.';
    case 'writing':
      return `Essays on systems, platforms, people, and the occasional detour. ${data.essays.length} volumes so far.`;
    case 'work':
      return 'Where the day jobs live: Booking.com, Postman, LinkedIn. Well defended, mostly by on-call rotas.';
    case 'contact':
      return 'Leave a message with the rider. Every one is read by the traveller himself.';
    default:
      return 'Things built on his own time and actually finished. Forge is on the anvil.';
  }
}

/* — Drawing helpers — */
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Catmull–Rom through points, as cubic Béziers.
function smooth(pts, closed = false) {
  const n = pts.length;
  const at = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return closed ? d + 'Z' : d;
}

function blob(cx, cy, rx, ry, seed, n = 120, rough = 1) {
  const r = rng(seed);
  const ph = [r(), r(), r(), r(), r()].map((v) => v * Math.PI * 2);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + rough * (0.11 * Math.sin(3 * a + ph[0]) + 0.07 * Math.sin(5 * a + ph[1]) + 0.04 * Math.sin(9 * a + ph[2]) + 0.025 * Math.sin(17 * a + ph[3]) + 0.012 * Math.sin(31 * a + ph[4]));
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return { d: smooth(pts, true), pts, cx, cy };
}

const f = (n) => n.toFixed(1);

// The coast's hachures: short pen strokes standing off the shore into the sea, as an
// engraver shaded a coastline. Even spacing along the outline, outward normals, a
// little variation in length so it reads as drawn.
function hachures(shape, seed, { gap = 6.5, min = 5, max = 15 } = {}) {
  const r = rng(seed);
  const { pts, cx, cy } = shape;
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const seg = Math.hypot(dx, dy);
    let nx = dy / seg;
    let ny = -dx / seg;
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    if ((mx - cx) * nx + (my - cy) * ny < 0) (nx = -nx), (ny = -ny);
    const steps = Math.max(1, Math.floor(seg / gap));
    for (let s = 0; s < steps; s++) {
      const t = (s + r() * 0.6) / steps;
      const x = a[0] + dx * t;
      const y = a[1] + dy * t;
      const len = min + r() * (max - min) * (r() < 0.12 ? 1.6 : 1);
      const tilt = (r() - 0.5) * 0.25;
      d += `M${f(x + nx * 2.5)} ${f(y + ny * 2.5)}l${f((nx + tilt * ny) * len)} ${f((ny - tilt * nx) * len)}`;
    }
  }
  return d;
}

// A pen-drawn peak: a jagged outline, the paper showing through, and close hatching
// down the shadowed flank so the range reads dark on one side.
function peak(r, x, y, h, w) {
  const ax = x + (r() - 0.5) * w * 0.3;
  const ay = y - h;
  const lx = x - w;
  const rx = x + w * 0.9;
  const kl = [ax - w * 0.3, ay + h * 0.32];
  const kr = [ax + w * 0.28, ay + h * 0.28];
  const ridge = `M${f(lx)} ${f(y)} L${f(kl[0])} ${f(kl[1])} L${f(ax - w * 0.1)} ${f(ay + h * 0.12)} L${f(ax)} ${f(ay)} L${f(kr[0])} ${f(kr[1])} L${f(rx)} ${f(y)}`;
  let hatch = '';
  const n = Math.max(4, Math.round(h / 4.2));
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const px = ax + (rx - ax) * t;
    const py = ay + (y - ay) * t;
    const room = y - py;
    const len = Math.min(room / 0.95, w * (0.65 - t * 0.35));
    if (len > 2) hatch += `M${f(px - 1)} ${f(py + 1)}l${f(-len * 0.42)} ${f(len * 0.92)}`;
  }
  // a few short strokes on the lit side, and the foot of the slope
  for (let i = 1; i < 3; i++) {
    const t = 0.35 + i * 0.2;
    hatch += `M${f(ax - (ax - lx) * t + 3)} ${f(ay + (y - ay) * t)}l${f(4 + r() * 3)} ${f(5 + r() * 4)}`;
  }
  return `<path class="at-mtn-fill" d="${ridge}Z"/><path class="at-mtn" d="${ridge}"/><path class="at-mtn-hatch" d="${hatch}"/>`;
}

// A range: peaks scattered along a spine, big in the middle, with foothills at the ends.
function range(r, spine, count, hmin, hmax, spread = 30) {
  const peaks = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const seg = Math.min(spine.length - 2, Math.floor(t * (spine.length - 1)));
    const lt = t * (spine.length - 1) - seg;
    const [ax, ay] = spine[seg];
    const [bx, by] = spine[seg + 1];
    const x = ax + (bx - ax) * lt + (r() - 0.5) * 18;
    const y = ay + (by - ay) * lt + (r() - 0.5) * spread;
    const mid = Math.sin(t * Math.PI);
    const h = hmin + (hmax - hmin) * (0.35 + 0.65 * mid) * (0.7 + r() * 0.5);
    peaks.push([x, y, h, h * (0.55 + r() * 0.25)]);
  }
  peaks.sort((a, b) => a[1] - b[1]);
  return peaks.map(([x, y, h, w]) => peak(r, x, y, h, w)).join('');
}

// Woods: crowds of round-crowned trees, each inked with a shaded side, with the odd pine.
function forest(r, cx, cy, rx, ry, count) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    pts.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, r()]);
  }
  pts.sort((a, b) => a[1] - b[1]);
  return pts
    .map(([x, y, k]) => {
      if (k < 0.18) return `<path class="at-pine" d="M${f(x)} ${f(y)} l-8 0 l8 -22 l8 22z M${f(x)} ${f(y)} v5"/>`;
      const rr = 6 + k * 5;
      return `<g class="at-tree"><circle class="at-crown" cx="${f(x)}" cy="${f(y - rr)}" r="${f(rr)}"/><path class="at-crown-shade" d="M${f(x + rr * 0.15)} ${f(y - rr * 0.12)} a${f(rr)} ${f(rr)} 0 0 0 ${f(rr * 0.8)} ${f(-rr * 0.75)} M${f(x + rr * 0.25)} ${f(y - rr * 0.5)} l${f(rr * 0.35)} ${f(-rr * 0.3)}"/><path class="at-trunk" d="M${f(x)} ${f(y)} v4"/></g>`;
    })
    .join('');
}

// Hills: low humps, each shaded with a few strokes on its far side.
function hills(r, list) {
  return list
    .map(([x, y]) => {
      const h = 16 + r() * 10;
      return `<path class="at-hill-fill" d="M${x - 24} ${y} q24 -${f(h * 1.9)} 48 0Z"/><path class="at-hill" d="M${x - 24} ${y} q24 -${f(h * 1.9)} 48 0 M${x + 6} ${y - h * 0.55} l7 ${f(h * 0.5)} M${x + 12} ${y - h * 0.32} l5 ${f(h * 0.3)} M${x + 1} ${y - h * 0.75} l7 ${f(h * 0.65)}"/>`;
    })
    .join('');
}

const ICONS = {
  home: '<path d="M-22 0 v-26 l22 -18 l22 18 v26z"/><path class="at-roof" d="M-25 -25 l25 -21 l25 21 z"/><rect class="at-door" x="-6" y="-15" width="12" height="15"/><path d="M8 -38 v-12 h7 v18" /><path class="at-smoke" d="M12 -54 q-6 -8 2 -16 q8 -8 0 -16"/>',
  tower: '<path class="at-stone" d="M-16 0 v-50 h32 v50z"/><path class="at-roof" d="M-20 -50 l20 -24 l20 24z"/><rect class="at-door" x="-6" y="-16" width="12" height="16"/><path d="M-9 -40 h18 M-9 -32 h18"/><path class="at-book" d="M28 -6 h22 v-14 h-22z M30 -20 v14 M36 -20 v14 M42 -20 v14"/>',
  castle: '<path class="at-stone" d="M-36 0 v-40 h72 v40z"/><path class="at-stone" d="M-46 0 v-66 h18 v66z M28 0 v-66 h18 v66z"/><path d="M-46 -66 v-8 h6 v6 h6 v-6 h6 v8 M28 -66 v-8 h6 v6 h6 v-6 h6 v8"/><path class="at-door" d="M-8 0 v-18 a8 8 0 0 1 16 0 v18"/><path d="M0 -40 v-30"/><path class="at-flag" d="M0 -70 l16 6 l-16 6z"/>',
  forge: '<path d="M-28 0 v-30 h56 v30z"/><path class="at-roof" d="M-32 -30 l32 -18 l32 18z"/><path class="at-stone" d="M12 -40 v-26 h12 v32"/><rect class="at-door" x="-10" y="-18" width="20" height="18"/><circle class="at-ember" cx="0" cy="-8" r="5"/><path class="at-smoke" d="M18 -70 q-8 -10 2 -20 q10 -10 0 -20"/>',
  temple: '<path d="M-34 0 h68 v-6 h-68z M-30 -6 v-30 h60 v30"/><path d="M-38 -36 h76 l-38 -22z"/><path d="M-20 -6 v-30 M-7 -6 v-30 M7 -6 v-30 M20 -6 v-30"/>',
  outpost: '<path class="at-stone" d="M-12 0 l4 -56 h16 l4 56z"/><path class="at-stone" d="M-18 -56 h36 v-10 h-36z"/><path d="M0 -66 v-22"/><path class="at-flag" d="M0 -88 l18 6 l-18 6z"/><path d="M14 0 h40 M18 0 v10 M30 0 v10 M42 0 v10"/><path class="at-bird" d="M34 -50 q6 -6 12 0 q6 -6 12 0"/>',
};

// The compass: double rings, four barbed arrows, flame-like petals between them and a
// star at the heart, with "North" lettered above. An original drawing in the manner of
// hand-inked maps.
function compass() {
  let arrows = '';
  let petals = '';
  for (let i = 0; i < 4; i++) {
    const a = i * 90;
    arrows += `<g transform="rotate(${a})"><path class="at-c-shaft" d="M0 -24 V-112 M-3 -24 V-104"/><path class="at-c-head" d="M0 -132 L11 -108 L0 -114 L-11 -108 Z"/><path class="at-c-barb" d="M-8 -74 L0 -84 L8 -74 M-6 -62 L0 -70 L6 -62"/></g>`;
    petals += `<g transform="rotate(${a + 45})"><path class="at-c-petal" d="M0 -26 C 14 -38, -4 -52, 10 -70 C -10 -62, -16 -44, 0 -26 Z"/><path class="at-c-petal-line" d="M0 -30 C 6 -40, -2 -52, 7 -64"/></g>`;
  }
  let star = '';
  for (let i = 0; i < 16; i++) {
    const rr = i % 2 ? 7 : 17;
    const ang = (i * Math.PI) / 8;
    star += `${i ? 'L' : 'M'}${f(Math.sin(ang) * rr)} ${f(-Math.cos(ang) * rr)}`;
  }
  return `<circle r="74" class="at-c-ring"/><circle r="68" class="at-c-ring at-c-ring--thin"/>${petals}${arrows}<circle r="24" class="at-c-hub"/><circle r="20" class="at-c-ring at-c-ring--thin"/><path class="at-c-star" d="${star}Z"/><circle r="3.5" class="at-c-pin"/><text class="at-c-north" y="-146" text-anchor="middle">North</text>`;
}

function mapSvg(data) {
  const r = rng(1066);
  const roadPts = ROAD_ORDER.map((id) => [PLACES[id].x, PLACES[id].y + 6]);
  // bend the road through the countryside rather than in straight lines
  const bent = [];
  roadPts.forEach((p, i) => {
    const q = roadPts[(i + 1) % roadPts.length];
    bent.push(p, [(p[0] + q[0]) / 2 + (r() - 0.5) * 120, (p[1] + q[1]) / 2 + (r() - 0.5) * 90]);
  });
  const road = smooth(bent, true);
  const coast = blob(1000, 700, 780, 520, 7);
  const isle1 = blob(1760, 1080, 90, 50, 11, 60);
  const isle2 = blob(230, 330, 110, 70, 23, 60);
  const river = smooth([[1010, 410], [990, 500], [1060, 600], [1030, 700], [1110, 800], [1150, 930], [1240, 1060], [1260, 1215]]);
  const tribs = [
    smooth([[820, 430], [860, 520], [930, 560], [990, 590], [1046, 604]]),
    smooth([[1440, 560], [1380, 640], [1300, 700], [1200, 760], [1112, 806]]),
    smooth([[1560, 760], [1470, 860], [1380, 930], [1250, 960], [1160, 950]]),
    smooth([[1120, 440], [1080, 520], [1060, 580]]),
  ];

  const landmarks = Object.entries(PLACES)
    .map(
      ([id, p]) => `
    <g class="at-place" data-section="${id}" transform="translate(${p.x} ${p.y})" tabindex="0" role="button" aria-label="${p.name}: ${id === 'writing' ? 'Writing' : id[0].toUpperCase() + id.slice(1)}">
      <rect class="at-place-hit" x="-140" y="-104" width="280" height="168" rx="28"/>
      <circle class="at-beacon" r="62" cy="-24" style="--d:${ROAD_ORDER.indexOf(id) * 0.7}s"/>
      <circle class="at-stamp" r="64" cy="-24"/>
      <g class="at-icon" transform="scale(1.35)">${ICONS[p.icon]}</g>
      <path class="at-ribbon"/>
      <text class="at-place-name" y="40" text-anchor="middle">${p.name}</text>
    </g>`
    )
    .join('');

  return `
<svg class="at-svg" viewBox="0 0 ${W} ${H}" role="group" aria-label="The Unfinished Atlas: a map of the site">
  <defs>
    <filter id="at-tremble" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <!-- the sheet: one stained parchment under the whole map, also used to let drawings hide what is behind them -->
    <pattern id="at-paper" patternUnits="userSpaceOnUse" x="-260" y="-200" width="2520" height="1700"><image href="/theme/images/stains.jpg" width="2520" height="1700" preserveAspectRatio="none"/></pattern>
    <pattern id="at-vellum" width="560" height="560" patternUnits="userSpaceOnUse"><image href="/theme/images/vellum.jpg" width="560" height="560"/></pattern>
    <pattern id="at-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V5" stroke="#2b1d10" stroke-width="1.15"/></pattern>
    <radialGradient id="at-fog"><stop offset="0" class="at-fog-in"/><stop offset=".7" class="at-fog-in" stop-opacity=".85"/><stop offset="1" class="at-fog-in" stop-opacity="0"/></radialGradient>
    <radialGradient id="at-lamp"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
    <path id="at-sea-name" d="M90 1190 Q 420 1250 780 1222"/>
    <path id="at-bay-name" d="M1560 150 Q 1760 130 1930 220"/>
    <path id="at-range-name" d="M690 196 Q 950 168 1230 196"/>
    <path id="at-hills-name" d="M250 560 Q 400 520 560 548"/>
    <path id="at-wood-name" d="M1080 1112 Q 1240 1140 1420 1108"/>
  </defs>
  <rect class="at-sheet" x="-3000" y="-3000" width="${W + 6000}" height="${H + 6000}"/>
  <rect x="-260" y="-200" width="2520" height="1700" fill="url(#at-paper)"/>

  <g class="at-ink">
    <path class="at-hachure" d="${hachures(coast, 3)}"/>
    <path class="at-hachure" d="${hachures(isle1, 5, { gap: 5.5, max: 11 })}"/>
    <path class="at-hachure" d="${hachures(isle2, 9, { gap: 5.5, max: 11 })}"/>
    <path class="at-land" d="${coast.d}"/>
    <path class="at-land" d="${isle1.d}"/><path class="at-land" d="${isle2.d}"/>

    ${tribs.map((d) => `<path class="at-river at-river--trib" d="${d}"/>`).join('')}
    <path class="at-river" d="${river}"/>
    <ellipse class="at-lake" cx="1052" cy="604" rx="40" ry="22"/>
    ${hills(r, [[380, 640], [430, 610], [470, 650], [600, 660], [360, 720], [520, 700], [700, 860], [760, 820], [1520, 980], [860, 1120], [920, 1160], [300, 900], [260, 860]])}
    <g>${range(r, [[640, 410], [760, 360], [900, 330], [1040, 350], [1180, 340], [1260, 380]], 46, 34, 104, 36)}</g>
    <g>${range(r, [[520, 1150], [600, 1170], [700, 1160]], 9, 20, 44, 16)}</g>
    <g>${forest(r, 1240, 1010, 140, 80, 120)}${forest(r, 700, 720, 80, 56, 40)}${forest(r, 380, 1010, 95, 66, 52)}${forest(r, 1520, 870, 60, 40, 22)}</g>
  </g>

  <path class="at-road" d="${road}"/>
  <path class="at-road-travelled" d="${road}"/>
  <circle class="at-lamplight" r="140" fill="url(#at-lamp)" cx="${PLACES.about.x}" cy="${PLACES.about.y - 20}"/>

  <text class="at-region at-region--great" x="1180" y="226" text-anchor="middle" transform="rotate(3 1180 226)">Mount Backlog</text>
  <text class="at-region" x="1250" y="1140" text-anchor="middle" transform="rotate(2 1250 1140)">Forest of Half-Read Books</text>
  <text class="at-region" x="420" y="578" text-anchor="middle" transform="rotate(-6 420 578)">The Quiet Hills</text>
  <text class="at-region at-region--sea" x="660" y="1244" text-anchor="middle" transform="rotate(2 660 1244)">Sea of Open Tabs</text>
  <text class="at-region at-region--sea at-region--bay" x="1640" y="1262" text-anchor="middle" transform="rotate(-3 1640 1262)">Bay of Small Talk</text>
  <text class="at-region at-region--small" x="1060" y="650" text-anchor="middle">Lake Later</text>

  <g class="at-fog">
    <ellipse cx="1720" cy="390" rx="260" ry="180" fill="url(#at-fog)"/>
    <ellipse cx="1860" cy="300" rx="200" ry="140" fill="url(#at-fog)"/>
    <ellipse cx="1620" cy="330" rx="170" ry="110" fill="url(#at-fog)"/>
    <text x="1700" y="372" text-anchor="middle" class="at-fog-text">here be unfinished thoughts</text>
  </g>

  <g class="at-ship">
    <path class="at-hull" d="M-44 -6 Q -40 14 -18 16 H 26 Q 44 12 50 -8 L 38 -6 L 34 -2 H -30 L -36 -8 Z"/>
    <path class="at-hull-line" d="M-38 4 H 40 M-34 9 H 34"/>
    <path class="at-mast" d="M-6 -2 V -64 M20 -2 V -46 M-30 -6 V -34"/>
    <path class="at-sail" d="M-24 -58 Q -6 -48 12 -58 Q 16 -40 12 -22 Q -6 -14 -24 -22 Q -28 -40 -24 -58 Z"/>
    <path class="at-sail" d="M8 -42 Q 20 -36 32 -42 Q 35 -30 32 -18 Q 20 -13 8 -18 Q 5 -30 8 -42 Z"/>
    <path class="at-sail" d="M-30 -32 L -46 -10 L -30 -10 Z"/>
    <path class="at-flag" d="M-6 -64 l14 4 l-14 4z"/>
  </g>
  <g class="at-serpent" tabindex="0" role="button" aria-label="Something in the water">
    <circle class="at-place-hit" cx="1850" cy="1200" r="60"/>
    <path class="at-serpent-body" d="M1800 1210 q15 -30 30 0 q15 30 30 0 q15 -30 30 0 M1890 1210 q12 -40 30 -36 q10 2 4 12"/>
    <path class="at-wave" d="M1790 1214 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0"/>
  </g>
  ${[[300, 1100], [180, 760], [1800, 820], [1700, 1240], [1880, 520], [520, 200], [880, 140], [1300, 160]].map(([x, y]) => `<path class="at-wave at-wave--bob" d="M${x} ${y} q8 -6 16 0 t16 0 M${x + 8} ${y + 8} q8 -6 16 0"/>`).join('')}

  ${landmarks}

  <!-- the Minstrel's Camp: the songbook, out on the map -->
  <g class="at-camp" transform="translate(1000 960)" tabindex="0" role="button" aria-label="The Minstrel's Camp: open the songbook">
    <rect class="at-place-hit" x="-140" y="-104" width="280" height="168" rx="28"/>
    <circle class="at-beacon" r="62" cy="-24" style="--d:2.1s"/>
    <g class="at-icon" transform="scale(1.35)">
      <path class="at-roof" d="M-58 0 l26 -46 l26 46z"/><path d="M-32 -46 v46"/>
      <path d="M-6 0 l14 -8 M-6 -8 l14 8" />
      <path class="at-ember" d="M1 -6 q4 -8 0 -16 q-4 8 0 16z"/>
      <circle cx="26" cy="-22" r="5"/><path d="M26 -17 v14 M20 0 l6 -3 l6 3"/>
      <ellipse cx="34" cy="-10" rx="7" ry="5" transform="rotate(-30 34 -10)"/><path d="M38 -13 l10 -10"/>
    </g>
    <g class="at-notes"><path d="M20 -70 v-16 l10 -3 v14 M20 -70 a4 3 0 1 1 -0.1 0"/><path d="M44 -88 v-14 M44 -88 a4 3 0 1 1 -0.1 0"/></g>
    <path class="at-ribbon"/>
    <text class="at-place-name" y="40" text-anchor="middle">Minstrel’s Camp</text>
  </g>

  <g class="at-compass" transform="translate(1640 640) scale(0.7)">
    ${compass()}
  </g>
  <circle class="at-lantern" r="9" cx="${PLACES.about.x}" cy="${PLACES.about.y + 6}"/>
  <rect class="at-grain" x="-3000" y="-3000" width="${W + 6000}" height="${H + 6000}" fill="url(#at-vellum)"/>
</svg>`;
}

/* — World — */
let api, el, svg, card, cleanup = [];
let cam = { x: W / 2, y: H / 2, z: 1 }; // centre in map units, map units per pixel
let fit = 1;
let anim = 0;
let current = 'home';
let reading = false;
let visited = new Set();
let road, roadLen, roadMarks = {};

function on(t, type, fn, o) {
  t.addEventListener(type, fn, o);
  cleanup.push(() => t.removeEventListener(type, fn, o));
}

function loadVisited() {
  try {
    visited = new Set(JSON.parse(localStorage.getItem('atlas-visited') || '[]'));
  } catch (e) {
    visited = new Set();
  }
}
function saveVisited() {
  try {
    localStorage.setItem('atlas-visited', JSON.stringify([...visited]));
  } catch (e) {
    /* the map forgets on reload; it still works */
  }
}

function size() {
  const r = el.getBoundingClientRect();
  return { w: r.width || innerWidth, h: r.height || innerHeight };
}

// The part of the screen the map can use: beside the reader, or above it on a phone.
function freeArea() {
  const { w, h } = size();
  const rr = reading ? api.readerRect() : null;
  if (!rr) return { cx: w / 2, cy: h / 2, w, h };
  if (rr.top > h * 0.2) return { cx: w / 2, cy: rr.top / 2, w, h: rr.top };
  return { cx: rr.left / 2, cy: h / 2, w: rr.left, h };
}

function clampCam(c) {
  const { w, h } = size();
  const z = Math.min(fit * 1.15, Math.max(fit / 3.2, c.z));
  const hx = (w * z) / 2;
  const hy = (h * z) / 2;
  const x = Math.min(W + 200 - Math.min(hx, W / 2), Math.max(-200 + Math.min(hx, W / 2), c.x));
  const y = Math.min(H + 150 - Math.min(hy, H / 2), Math.max(-150 + Math.min(hy, H / 2), c.y));
  return { x, y, z };
}

function apply() {
  const { w, h } = size();
  svg.setAttribute('viewBox', `${(cam.x - (w * cam.z) / 2).toFixed(1)} ${(cam.y - (h * cam.z) / 2).toFixed(1)} ${(w * cam.z).toFixed(1)} ${(h * cam.z).toFixed(1)}`);
  placeCard();
}

let stillTimer = 0;
// The ink's tremble is a filter; while the camera moves it is switched off so panning
// and zooming stay smooth, then it settles back once the map is still.
function moving() {
  el.classList.add('is-camming');
  clearTimeout(stillTimer);
  stillTimer = setTimeout(() => el && el.classList.remove('is-camming'), 220);
}

function setCam(next, { instant = false, ms = 950 } = {}) {
  cancelAnimationFrame(anim);
  const to = clampCam(next);
  if (instant || api.reduceMotion) {
    cam = to;
    apply();
    return;
  }
  const from = { ...cam };
  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const t = Math.min(1, (now - t0) / ms);
    const k = ease(t);
    cam = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, z: from.z * Math.pow(to.z / from.z, k) };
    apply();
    moving();
    if (t < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}

function overview(opts) {
  const { w, h } = size();
  // fit the whole map inside the charred edge and the lettered band
  const inset = w > 760 ? 150 : 70;
  fit = Math.max(W / Math.max(200, w - inset), H / Math.max(200, h - inset));
  // portrait phones: fill the height and let the visitor pan, rather than a postage stamp
  const z = w < 760 && h > w ? Math.min(fit, (H * 0.85) / h) : fit;
  setCam({ x: W / 2, y: H / 2 + 20, z }, opts);
}

function focusOn(section, opts) {
  const p = PLACES[section];
  const area = freeArea();
  const { w, h } = size();
  const z = Math.min(fit * 0.6, Math.max((W * 0.32) / area.w, fit / 2.6));
  setCam({ x: p.x + (w / 2 - area.cx) * z, y: p.y - 30 + (h / 2 - area.cy) * z, z }, opts);
}

function toScreen(x, y) {
  const { w, h } = size();
  return { x: (x - cam.x) / cam.z + w / 2, y: (y - cam.y) / cam.z + h / 2 };
}

/* — Card — */
let cardFor = null;
function showCard(section) {
  cardFor = section;
  const p = PLACES[section];
  card.querySelector('.at-card-name').textContent = p.name;
  card.querySelector('.at-card-text').textContent = describe(section, api.data);
  const go = card.querySelector('.at-card-go');
  go.textContent = p.verb;
  go.dataset.go = section;
  card.querySelector('.at-card-seen').hidden = !visited.has(section);
  card.hidden = false;
  placeCard();
}
function hideCard() {
  cardFor = null;
  card.hidden = true;
}
function placeCard() {
  if (!cardFor || card.hidden) return;
  const p = PLACES[cardFor];
  const s = toScreen(p.x, p.y);
  const { w, h } = size();
  const cw = card.offsetWidth || 300;
  const ch = card.offsetHeight || 160;
  const box = el.getBoundingClientRect();
  // the other places on screen: the card must never sit on top of one
  const others = [...svg.querySelectorAll('.at-place, .at-camp')]
    .filter((g) => g.dataset.section !== cardFor)
    .map((g) => {
      const r = g.querySelector('.at-place-hit').getBoundingClientRect();
      return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top };
    });
  // how much of the other places a card at (l, t) would hide
  const covers = (l, t) =>
    others.reduce((sum, o) => sum + Math.max(0, Math.min(l + cw, o.r) - Math.max(l, o.l)) * Math.max(0, Math.min(t + ch, o.b) - Math.max(t, o.t)), 0);
  const clamp = (l, t) => [Math.min(w - cw - 16, Math.max(16, l)), Math.min(h - ch - 16, Math.max(80, t))];
  const below = s.y + 30 / cam.z + 34;
  const above = s.y - 80 / cam.z - ch;
  const right = s.x + 150 / cam.z;
  const left = s.x - 150 / cam.z - cw;
  const middle = s.y - ch / 2;
  // in order of preference: below its name, above its icon, beside it, then the diagonals
  const options = [
    [s.x - cw / 2, below], [s.x - cw / 2, above], [right, middle], [left, middle],
    [right, below], [left, below], [right, above], [left, above],
  ].map(([l, t]) => clamp(l, t));
  let best = options[0];
  let least = Infinity;
  for (const o of options) {
    const c = covers(o[0], o[1]);
    if (c < least - 1) (least = c), (best = o);
    if (c === 0) break;
  }
  const [cl, ct] = best;
  card.style.left = cl + 'px';
  card.style.top = ct + 'px';
}

/* — Ribbons: every place you can visit carries its name on an unfurled banner — */
function drawRibbons() {
  svg.querySelectorAll('.at-place-name').forEach((text) => {
    const ribbon = text.previousElementSibling;
    if (!ribbon || !ribbon.classList.contains('at-ribbon')) return;
    const b = text.getBBox();
    if (!b.width) return;
    const x0 = b.x - 14;
    const x1 = b.x + b.width + 14;
    const y0 = b.y - 3;
    const y1 = b.y + b.height + 1;
    const h = y1 - y0;
    const sag = 3;
    // the unrolled band, its top and bottom edges gently waved
    const band = `M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 - sag} ${x1} ${y0} L${x1} ${y1} Q${(x0 + x1) / 2} ${y1 - sag} ${x0} ${y1} Z`;
    // each end rolled up: a cylinder of paper with a curl showing its turns
    const roll = (x, dir) =>
      `M${x} ${y0} C${x + dir * 14} ${y0 - 2}, ${x + dir * 14} ${y1 + 2}, ${x} ${y1} C${x + dir * 6} ${y1 + 1}, ${x + dir * 8} ${y0 + h * 0.45}, ${x + dir * 3} ${y0 + h * 0.4} C${x - dir * 2} ${y0 + h * 0.35}, ${x - dir * 1} ${y0 + h * 0.62}, ${x + dir * 4} ${y0 + h * 0.6}`;
    ribbon.setAttribute('d', band + roll(x0, -1) + roll(x1, 1));
  });
}

/* — Road, lantern, stamps — */
function measureRoad() {
  road = svg.querySelector('.at-road');
  roadLen = road.getTotalLength();
  const samples = 600;
  for (const id of ROAD_ORDER) {
    const p = PLACES[id];
    let best = 0, bd = Infinity;
    for (let i = 0; i < samples; i++) {
      const q = road.getPointAtLength((i / samples) * roadLen);
      const d = (q.x - p.x) ** 2 + (q.y - p.y - 6) ** 2;
      if (d < bd) (bd = d), (best = (i / samples) * roadLen);
    }
    roadMarks[id] = best;
  }
}

let lanternAt = 'about';
let lanternAnim = 0;
function walkLantern(to) {
  if (!roadMarks[to] && roadMarks[to] !== 0) return;
  const lantern = svg.querySelector('.at-lantern');
  const lamp = svg.querySelector('.at-lamplight');
  const a = roadMarks[lanternAt];
  const b = roadMarks[to];
  let d = b - a;
  if (Math.abs(d) > roadLen / 2) d -= Math.sign(d) * roadLen;
  lanternAt = to;
  cancelAnimationFrame(lanternAnim);
  const place = (len) => {
    const p = road.getPointAtLength(((len % roadLen) + roadLen) % roadLen);
    lantern.setAttribute('cx', p.x);
    lantern.setAttribute('cy', p.y);
    lamp.setAttribute('cx', p.x);
    lamp.setAttribute('cy', p.y - 20);
  };
  if (api.reduceMotion) return place(b);
  const ms = Math.min(2200, 400 + Math.abs(d) * 1.1);
  const t0 = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - t0) / ms);
    place(a + d * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2));
    if (t < 1) lanternAnim = requestAnimationFrame(step);
  };
  lanternAnim = requestAnimationFrame(step);
}

function renderVisited() {
  const out = ROAD_ORDER.filter((s) => s !== 'about');
  svg.querySelectorAll('.at-place').forEach((g) => g.classList.toggle('is-visited', visited.has(g.dataset.section)));
  // the fog thins a little for every place explored
  svg.querySelector('.at-fog').style.opacity = String(Math.max(0.45, 1 - out.filter((s) => visited.has(s)).length * 0.16));
  el.querySelector('.at-legend-count').textContent = `${out.filter((s) => visited.has(s)).length} of ${out.length} places visited`;
}

/* — Input — */
function bindInput() {
  const pointers = new Map();
  let drag = null;
  let pinch = null;
  let moved = false;
  let pressed = null; // what was under the pointer when it went down

  on(svg, 'pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // capture only once a drag starts: capturing on press would retarget the release to
    // the whole map, and a click on a landmark would never reach the landmark
    pressed = e.target;
    moved = false;
    cancelAnimationFrame(anim);
    if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, cam: { ...cam } };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), cam: { ...cam }, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
      drag = null;
    }
  });
  on(svg, 'pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(pinch.mid.x, pinch.mid.y, pinch.cam.z * (pinch.d / d), pinch.cam);
      moved = true;
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 5) {
      moved = true;
      try {
        svg.setPointerCapture(e.pointerId);
      } catch (err) {
        /* the pointer already left; the drag still works while it is over the map */
      }
    }
    if (moved) {
      el.classList.add('is-dragging');
      cam = clampCam({ x: drag.cam.x - dx * cam.z, y: drag.cam.y - dy * cam.z, z: cam.z });
      apply();
      moving();
    }
  });
  const end = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 0) {
      drag = null;
      el.classList.remove('is-dragging');
    }
  };
  on(svg, 'pointerup', (e) => {
    const wasMoved = moved;
    const target = pressed || e.target;
    pressed = null;
    end(e);
    if (wasMoved) return;
    const place = target.closest('.at-place');
    if (place) {
      const id = place.dataset.section;
      // touch: the first tap shows the card, the second goes in
      if (e.pointerType === 'touch' && cardFor !== id) return showCard(id);
      api.sfx('select');
      visit(id);
      return;
    }
    if (target.closest('.at-serpent')) return serpent();
    const camp = target.closest('.at-camp');
    if (camp) return api.openSongbook && api.openSongbook(camp);
    if (e.pointerType === 'touch') hideCard();
  });
  on(svg, 'pointercancel', end);
  on(svg, 'wheel', (e) => {
    e.preventDefault();
    const r = el.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, cam.z * Math.exp(e.deltaY * 0.0016), cam);
  }, { passive: false });

  svg.querySelectorAll('.at-place').forEach((g) => {
    on(g, 'pointerenter', (e) => e.pointerType !== 'touch' && showCard(g.dataset.section));
    on(g, 'pointerleave', (e) => e.pointerType !== 'touch' && setTimeout(() => !card.matches(':hover') && cardFor === g.dataset.section && hideCard(), 700));
    on(g, 'focus', () => showCard(g.dataset.section));
    on(g, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        visit(g.dataset.section);
      }
    });
  });
  const camp = svg.querySelector('.at-camp');
  on(camp, 'keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), api.openSongbook && api.openSongbook(camp)));
  on(document, 'site:music', (e) => el.classList.toggle('is-playing', e.detail.playing));
  const egg = svg.querySelector('.at-serpent');
  on(egg, 'keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), serpent()));
  on(card, 'pointerleave', () => setTimeout(() => !card.matches(':hover') && hideCard(), 250));

  on(el, 'keydown', (e) => {
    if (e.target.closest('input, textarea, button')) return;
    const stepPx = 80 * cam.z;
    const moves = { ArrowLeft: [-stepPx, 0], ArrowRight: [stepPx, 0], ArrowUp: [0, -stepPx], ArrowDown: [0, stepPx] };
    if (moves[e.key]) {
      e.preventDefault();
      setCam({ x: cam.x + moves[e.key][0], y: cam.y + moves[e.key][1], z: cam.z }, { ms: 250 });
    } else if (e.key === '+' || e.key === '=') zoomBy(1 / 1.4);
    else if (e.key === '-' || e.key === '_') zoomBy(1.4);
  });
  el.querySelector('[data-zoom="in"]').addEventListener('click', () => zoomBy(1 / 1.4));
  el.querySelector('[data-zoom="out"]').addEventListener('click', () => zoomBy(1.4));
  el.querySelector('[data-zoom="fit"]').addEventListener('click', () => overview());
  card.querySelector('.at-card-go').addEventListener('click', (e) => {
    e.stopPropagation();
    visit(e.currentTarget.dataset.go);
  });
  card.addEventListener('click', () => cardFor && visit(cardFor));
  on(window, 'resize', () => {
    const z = cam.z / fit;
    const { w, h } = size();
    fit = Math.max((W * 0.92) / w, (H * 0.92) / h);
    cam = clampCam({ ...cam, z: fit * z });
    apply();
  });
}

function visit(id) {
  if (id === 'about' && api.enterHome) api.enterHome();
  else api.go(id);
}

function zoomAt(sx, sy, z, base) {
  const { w, h } = size();
  const mx = base.x + (sx - w / 2) * base.z;
  const my = base.y + (sy - h / 2) * base.z;
  const nz = clampCam({ ...base, z }).z;
  cam = clampCam({ x: mx - (sx - w / 2) * nz, y: my - (sy - h / 2) * nz, z: nz });
  apply();
  moving();
}
function zoomBy(f) {
  setCam({ ...cam, z: cam.z * f }, { ms: 300 });
}

function serpent() {
  el.classList.remove('is-serpent');
  void el.offsetWidth;
  el.classList.add('is-serpent');
  api.sfx('egg');
  const note = el.querySelector('.at-note');
  note.textContent = 'Here be a sea serpent. Mostly decorative.';
  note.hidden = false;
  setTimeout(() => (note.hidden = true), 3600);
}

const world = {
  id: 'atlas',

  async mount(stage, worldApi) {
    api = worldApi;
    cleanup = [];
    loadVisited();
    el = document.createElement('div');
    el.className = 'atlas';
    el.tabIndex = -1;
    el.innerHTML = `
      ${mapSvg(api.data)}
      <div class="at-sheet-frame" aria-hidden="true">
        <div class="at-band at-band--top"><span></span></div>
        <div class="at-band at-band--bottom"><span></span></div>
        <div class="at-band at-band--left"><span></span></div>
        <div class="at-band at-band--right"><span></span></div>
        <i class="at-roundel"></i><i class="at-roundel"></i><i class="at-roundel"></i><i class="at-roundel"></i>
        <div class="at-burn"></div>
      </div>
      <header class="at-cartouche"><p class="at-title">The Unfinished Atlas</p><p class="at-sub">being a survey of one person’s interests, partly complete</p></header>
      <aside class="at-card" hidden>
        <p class="at-card-name"></p>
        <p class="at-card-text"></p>
        <p class="at-card-seen" hidden>Already visited.</p>
        <button type="button" class="at-card-go"></button>
      </aside>
      <div class="at-legend"><p class="at-legend-title">Legend</p><p class="at-legend-ribbon"><svg class="at-key at-key--ribbon" viewBox="0 0 46 16" aria-hidden="true"><path d="M8 2 H38 L45 3.5 L41 8 L45 12.5 L38 14 H8 L1 12.5 L5 8 L1 3.5Z"/></svg>a place you can visit</p><p><span class="at-key at-key--road"></span>the road travelled</p><p><span class="at-key at-key--stamp"></span>places already visited</p><p class="at-legend-count"></p><p class="at-legend-hint">Click any name on a ribbon to go there. Drag to wander; scroll or pinch to zoom.</p></div>
      <div class="at-zoom" role="group" aria-label="Zoom the map">
        <button type="button" data-zoom="in" aria-label="Zoom in"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
        <button type="button" data-zoom="out" aria-label="Zoom out"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
        <button type="button" data-zoom="fit" aria-label="Show the whole map">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
        </button>
      </div>
      <p class="at-note" role="status" hidden></p>`;
    stage.appendChild(el);
    svg = el.querySelector('.at-svg');
    card = el.querySelector('.at-card');
    world.setTheme(api.theme());
    // the border band is lettered with the atlas's own words, round all four sides
    const verse = 'being a survey of one person’s interests, partly complete · drawn from life in Bangalore · here be unfinished thoughts · the road goes on, and the map with it · ';
    el.querySelectorAll('.at-band span').forEach((s) => (s.textContent = verse.repeat(6)));
    // every sheet laid on the map has a torn edge (the cartouche is a drawn scroll instead)
    deckle(el.querySelector('.at-legend'), { seed: 5 });
    deckle(card, { seed: 9, amp: 2.6 });
    deckle(el.querySelector('.at-note'), { seed: 13, amp: 2.4 });
    measureRoad();
    renderVisited();
    drawRibbons();
    document.fonts.load("30px 'IM Fell English SC'").then(() => svg && drawRibbons(), () => {});
    bindInput();
    overview({ instant: true });
  },

  show(section, { instant } = {}) {
    current = section;
    svg.querySelectorAll('.at-place').forEach((g) => g.classList.toggle('is-active', g.dataset.section === section));
    if (section === 'home') {
      hideCard();
      overview({ instant });
      return;
    }
    if (!visited.has(section)) {
      visited.add(section);
      saveVisited();
    }
    renderVisited();
    hideCard();
    walkLantern(section);
    // the reader is about to open; frame the place beside it
    requestAnimationFrame(() => focusOn(section, { instant }));
  },

  setReading(open) {
    reading = open;
    el.classList.toggle('is-reading', open);
    if (current !== 'home') requestAnimationFrame(() => focusOn(current));
  },

  setTheme(theme) {
    el.classList.toggle('is-night', theme === 'dark');
  },

  unmount() {
    clearTimeout(stillTimer);
    cancelAnimationFrame(anim);
    cancelAnimationFrame(lanternAnim);
    cleanup.forEach((fn) => fn());
    cleanup = [];
    el.remove();
  },
};

export default world;
