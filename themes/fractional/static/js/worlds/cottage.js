import { deckle } from './paper.js';

// Traveler's Home: the cottage on the Unfinished Atlas, a candlelit hall. The personal
// sections live here (front door, shelves, messenger's letterbox); the writing desk,
// the letter from the Citadel and the workbench are shortcuts back out to their places
// on the map. A few objects are just objects, with opinions. The wayfinder bar covers
// every destination, so nothing depends on precise pointing.

const PLACES = {
  about: { name: 'The front door', what: 'About' },
  library: { name: 'The shelves', what: 'Library' },
  contact: { name: "The messenger's letterbox", what: "Contact, out at the Messenger's Outpost" },
  writing: { name: 'The writing desk', what: 'Writing, out at the Library of Stories' },
  work: { name: 'A letter from the Citadel', what: 'Work, out at the Citadel' },
  projects: { name: 'The workbench', what: "Projects, out at the Craftsman's Forge" },
};

const QUIPS = {
  chess: 'The engine says I’m winning. The engine has been wrong before.',
  window: 'That’s the Citadel up on the ridge. The commute is uphill both ways.',
  sampler: 'Embroidered by hand. The title is self-awarded; the federation is still reviewing the paperwork.',
  doormat: 'Welcome-ish. The ish is load-bearing.',
};
const SOUPS = ['Soup of the day: soup.', 'Yesterday’s soup, now with more history.', 'The soup is unfinished. Like the atlas.', 'Do not ask what is in the soup. The soup does not know either.'];

function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Traveler's Home is a candlelit hall, rendered as one plate (scripts/render_hall.py:
// stone, oak, a woven rug, books, barrels, all lit by the hearth and the sconces). The
// page draws on top of it, with the same camera, everything that moves or can be
// clicked: the fire and every flame, the cauldron, the raven, the lute, the papers on
// the table, the clickable places and their names on curled scrolls.

// the plate's camera, in page units: eye 1.7m up, walls at x = +-5, the back wall at z = 9
const pt = (X, Y, Z) => [800 + (800 * X) / Z, 430 - (800 * Y) / Z];
const xy = (X, Y, Z) => pt(X, Y, Z).map((n) => n.toFixed(1)).join(' ');
const poly = (pts) => pts.map((p) => xy(...p)).join(' ');
// the screen rectangle that holds a box in the room
function rectOf(lo, hi) {
  const ps = [];
  for (const X of [lo[0], hi[0]]) for (const Y of [lo[1], hi[1]]) for (const Z of [lo[2], hi[2]]) ps.push(pt(X, Y, Z));
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return `x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(Math.max(...xs) - x).toFixed(0)}" height="${(Math.max(...ys) - y).toFixed(0)}"`;
}
const hit = (lo, hi) => `<rect class="ct-hit" ${rectOf(lo, hi)} rx="10"/>`;

// a flame: a teardrop with a hot core, and a halo that breathes
function flame(X, Y, Z, size = 1, halo = true) {
  const [x, y] = pt(X, Y, Z);
  const s = (size * 800) / Z / 100;
  const d = `M${x.toFixed(1)} ${y.toFixed(1)} c${(-3.2 * s).toFixed(1)} ${(-3 * s).toFixed(1)} ${(-2.6 * s).toFixed(1)} ${(-8 * s).toFixed(1)} 0 ${(-14 * s).toFixed(1)} c${(2.6 * s).toFixed(1)} ${(6 * s).toFixed(1)} ${(3.2 * s).toFixed(1)} ${(11 * s).toFixed(1)} 0 ${(14 * s).toFixed(1)}z`;
  return `${halo ? `<ellipse class="ct-halo" cx="${x.toFixed(1)}" cy="${(y - 6 * s).toFixed(1)}" rx="${(34 * s).toFixed(1)}" ry="${(30 * s).toFixed(1)}" fill="url(#ct-halo)"/>` : ''}<path class="ct-flame" d="${d}" fill="url(#ct-flame)"/>`;
}

// a candle standing at (X, Y, Z), `h` metres tall
function candle(X, Y, Z, h = 0.16, r = 0.022) {
  const [x0, y0] = pt(X - r, Y, Z);
  const [x1, y1] = pt(X + r, Y + h, Z);
  return `<rect x="${x0.toFixed(1)}" y="${y1.toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${(y0 - y1).toFixed(1)}" fill="url(#ct-wax)"/>${flame(X, Y + h, Z, 0.55)}`;
}

// a box drawn from the room: its front face and its top, lit from the fire
function prism(lo, hi, front, top) {
  return `<polygon points="${poly([[lo[0], lo[1], lo[2]], [hi[0], lo[1], lo[2]], [hi[0], hi[1], lo[2]], [lo[0], hi[1], lo[2]]])}" fill="${front}"/><polygon points="${poly([[lo[0], hi[1], lo[2]], [hi[0], hi[1], lo[2]], [hi[0], hi[1], hi[2]], [lo[0], hi[1], hi[2]]])}" fill="${top}"/>`;
}

// the names of the places in the hall, lettered on small curled scrolls as on the map
const tag = (X, Y, Z, text) => {
  const [x, y] = pt(X, Y, Z);
  return `<path class="ct-ribbon"/><text class="ct-place-name" x="${x.toFixed(0)}" y="${y.toFixed(0)}" text-anchor="middle">${text}</text>`;
};

function svg() {
  const [fx, fy] = pt(0, -1.62, 8.4);
  const [rx, ry] = pt(0, 1.95, 6.4);
  const [, cy0] = pt(0, 3.3, 6.4);
  const [ox, oy] = pt(0, -1.05, 8.32);
  return `
<svg class="ct-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Traveler's Home">
  <defs>
    <radialGradient id="ct-flame" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffd76a"/><stop offset=".8" stop-color="#f08a2a"/><stop offset="1" stop-color="#c84a14" stop-opacity=".2"/></radialGradient>
    <radialGradient id="ct-halo"><stop offset="0" stop-color="#ffc46a" stop-opacity=".55"/><stop offset=".4" stop-color="#ff9a3a" stop-opacity=".18"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient>
    <radialGradient id="ct-glow"><stop offset="0" stop-color="#ffb347" stop-opacity=".6"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <radialGradient id="ct-hover"><stop offset="0" stop-color="#ffd59a" stop-opacity=".22"/><stop offset=".7" stop-color="#ffc070" stop-opacity=".08"/><stop offset="1" stop-color="#ffc070" stop-opacity="0"/></radialGradient>
    <linearGradient id="ct-wax" x1="0" x2="1"><stop offset="0" stop-color="#8a6a44"/><stop offset=".45" stop-color="#f1dcae"/><stop offset="1" stop-color="#7a5a38"/></linearGradient>
    <linearGradient id="ct-fireA" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff2b0"/><stop offset=".35" stop-color="#ffb43c"/><stop offset=".8" stop-color="#e2561a"/><stop offset="1" stop-color="#a02a10" stop-opacity="0"/></linearGradient>
    <linearGradient id="ct-fireB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#ffe07a"/><stop offset="1" stop-color="#ff9a30" stop-opacity="0"/></linearGradient>
    <linearGradient id="ct-iron" x1="0" x2="1"><stop offset="0" stop-color="#0c0a09"/><stop offset=".55" stop-color="#2a2420"/><stop offset=".8" stop-color="#5a3a20"/><stop offset="1" stop-color="#140f0c"/></linearGradient>
    <linearGradient id="ct-lute" x1="0" x2="1"><stop offset="0" stop-color="#3a1e0c"/><stop offset=".5" stop-color="#a8682e"/><stop offset="1" stop-color="#4a260e"/></linearGradient>
    <linearGradient id="ct-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9d2a0"/><stop offset="1" stop-color="#b8925a"/></linearGradient>
  </defs>

  <image href="/theme/images/hall.jpg" width="1600" height="900" preserveAspectRatio="none"/>

  <!-- the window: dusk by day, night after dark -->
  <g class="ct-obj ct-decor" data-quip="window" tabindex="0" role="button" aria-label="The window">
    ${hit([-5, -0.1, 5.9], [-4.9, 1.6, 7.2])}
    <polygon class="ct-window-night" points="${poly([[-5, 0.05, 6.05], [-5, 0.05, 7.05], [-5, 1.0, 7.05], ...[0.2, 0.4, 0.6, 0.8].map((k) => [-5, 1 + 0.5 * Math.sin(Math.PI * k), 6.55 + 0.5 * Math.cos(Math.PI * k)]), [-5, 1.0, 6.05]])}"/>
  </g>

  <!-- the hearth: a log fire, and a cauldron on its chain -->
  <g class="ct-obj ct-decor" data-action="soup" tabindex="0" role="button" aria-label="The cauldron">
    ${hit([-0.9, -1.7, 8.4], [0.9, 0.2, 8.4])}
    <ellipse class="ct-hearth-glow" cx="${fx.toFixed(0)}" cy="${(fy - 20).toFixed(0)}" rx="230" ry="150" fill="url(#ct-glow)"/>
    <g class="ct-fire">
      <path class="ct-fire-a" d="M${fx - 62} ${fy} q-6 -40 16 -66 q2 26 14 32 q6 -34 -4 -60 q34 26 30 76 q10 -14 6 -34 q26 26 10 52z" fill="url(#ct-fireA)"/>
      <path class="ct-fire-a ct-fire-c" d="M${fx + 2} ${fy} q-4 -34 20 -58 q0 22 12 26 q10 -16 4 -40 q26 30 12 72z" fill="url(#ct-fireA)"/>
      <path class="ct-fire-b" d="M${fx - 34} ${fy} q-2 -26 14 -42 q2 16 10 20 q6 -10 4 -26 q20 22 8 48z" fill="url(#ct-fireB)"/>
    </g>
    <path d="M${ox} ${(oy - 92).toFixed(0)} V${(oy - 26).toFixed(0)}" stroke="#14100c" stroke-width="2.4"/>
    <path d="M${ox - 30} ${(oy - 24).toFixed(0)} h60 q2 30 -30 36 q-32 -6 -30 -36z" fill="url(#ct-iron)"/>
    <path d="M${ox - 32} ${(oy - 26).toFixed(0)} h64" stroke="#5a3a20" stroke-width="3" stroke-linecap="round"/>
    <path class="ct-steam" d="M${ox - 10} ${(oy - 30).toFixed(0)} q-8 -12 2 -24 q8 -10 0 -22 M${ox + 10} ${(oy - 30).toFixed(0)} q8 -12 -2 -26" stroke="#f1e3c4" stroke-opacity=".45" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>

  <!-- the banner over the mantel -->
  <g class="ct-obj ct-decor" data-quip="sampler" tabindex="0" role="button" aria-label="An embroidered banner">
    ${hit([-0.66, 1.0, 8.4], [0.66, 2.62, 8.4])}
    <text x="800" y="${pt(0, 2.18, 8.4)[1].toFixed(0)}" text-anchor="middle" class="ct-sampler-big">grandmaster</text>
    <text x="800" y="${pt(0, 1.98, 8.4)[1].toFixed(0)}" text-anchor="middle" class="ct-sampler-small">of</text>
    <text x="800" y="${pt(0, 1.72, 8.4)[1].toFixed(0)}" text-anchor="middle" class="ct-sampler-big">snacks</text>
  </g>

  <!-- the sconces and the candle ring -->
  <g class="ct-lights">
    ${candle(-1.9, 0.92, 8.82, 0.14, 0.03)}${candle(1.9, 0.92, 8.82, 0.14, 0.03)}
    ${candle(-4.82, 0.92, 7.45, 0.14, 0.03)}${candle(4.82, 0.92, 5.9, 0.14, 0.03)}
    <path d="M${rx} ${cy0.toFixed(0)} V${(ry - 4).toFixed(0)}" stroke="#14100c" stroke-width="2"/>
    <ellipse cx="${rx}" cy="${ry.toFixed(0)}" rx="${(800 * 0.62) / 6.4}" ry="10" fill="none" stroke="#1a1410" stroke-width="4"/>
    ${[-0.5, -0.18, 0.18, 0.5].map((X) => candle(X, 1.95 + (Math.abs(X) > 0.3 ? -0.02 : 0.03), 6.4 + (Math.abs(X) > 0.3 ? 0 : 0.3), 0.16, 0.025)).join('')}
    ${candle(-0.95, 0.58, 8.22, 0.12)}${candle(1.3, 0.58, 8.25, 0.1)}
    ${candle(-2.42, -0.9, 3.0 + 2.1, 0.2, 0.026)}
    ${candle(-2.62, -0.9, 3.0 + 1.95, 0.14, 0.026)}
  </g>
  <ellipse class="ct-night-glow" cx="${rx}" cy="${ry + 40}" rx="300" ry="200" fill="url(#ct-glow)"/>

  <!-- the front door: About -->
  <g class="ct-obj" data-section="about" tabindex="0" role="button" aria-label="The front door: About">
    ${hit([2.0, -1.7, 9], [3.74, 1.12, 9])}
    ${tag(2.86, -0.95, 9, 'the door')}
  </g>
  <g class="ct-obj ct-decor" data-quip="doormat" tabindex="0" role="button" aria-label="The doormat">
    <polygon class="ct-hit" points="${poly([[2.35, -1.7, 8.2], [3.35, -1.7, 8.2], [3.35, -1.7, 8.78], [2.35, -1.7, 8.78]])}"/>
  </g>

  <!-- the bookcase: Library -->
  <g class="ct-obj" data-section="library" tabindex="0" role="button" aria-label="The shelves: Library">
    ${hit([-4.62, -1.7, 8.42], [-2.2, 1.56, 9])}
    ${tag(-3.41, 1.72, 8.42, 'the shelves')}
  </g>

  <!-- the letterbox on the wall, and the raven on its perch: Contact -->
  <g class="ct-obj" data-section="contact" tabindex="0" role="button" aria-label="The messenger's letterbox: Contact, out at the Messenger's Outpost">
    ${hit([-5, -0.8, 7.75], [-4.7, 0.85, 8.62])}
    <g class="ct-letters"><polygon points="${poly([[-4.98, 0.17, 7.98], [-4.98, 0.17, 8.2], [-4.98, 0.33, 8.18], [-4.98, 0.31, 7.99]])}" fill="url(#ct-paper)"/></g>
    ${(() => {
      const [x, y] = pt(-4.9, -0.6, 8.2);
      return `<g class="ct-raven" transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">
        <path d="M-6 0 q-6 -18 6 -28 q10 -6 16 2 l9 -1 l-7 6 q3 15 -6 21z" fill="#0d0b0b"/>
        <path class="ct-raven-head" d="M8 -26 q7 -8 15 -1 l9 1 l-9 4 q-6 3 -15 -4z" fill="#0d0b0b"/>
        <circle cx="16" cy="-26" r="1.3" fill="#e8b860"/>
        <path d="M-4 0 l-2 7 M4 0 l1 7" stroke="#0d0b0b" stroke-width="1.4"/>
      </g>`;
    })()}
    ${tag(-4.9, 1.02, 8.2, 'the letterbox')}
  </g>

  <!-- the long table: Writing (out at the Library of Stories) -->
  <g class="ct-obj" data-section="writing" tabindex="0" role="button" aria-label="The writing desk: Writing, out at the Library of Stories">
    ${hit([-3.7, -1.7, 4.4], [-1.15, -0.55, 5.65])}
    <g class="ct-page"><polygon points="${poly([[-2.25, -0.899, 4.62], [-1.62, -0.899, 4.6], [-1.58, -0.899, 5.08], [-2.2, -0.899, 5.12]])}" fill="url(#ct-paper)"/>
      ${[0, 1, 2, 3].map((k) => `<polyline points="${poly([[-2.15, -0.899, 4.72 + k * 0.08], [-1.7, -0.899, 4.71 + k * 0.08]])}" stroke="#3a2412" stroke-width="1" opacity=".6"/>`).join('')}</g>
    ${prism([-1.5, -0.9, 4.75], [-1.4, -0.82, 4.85], '#100c09', '#2a201a')}
    <path class="ct-quill" d="M${xy(-1.45, -0.82, 4.8)} q8 -40 34 -58 q-8 30 -30 58z" fill="#eadfc8" stroke="#6a5a44" stroke-width=".8"/>
    ${prism([-3.5, -0.9, 4.7], [-2.95, -0.8, 5.1], '#4a1414', '#7a5a3a')}
    ${prism([-3.45, -0.8, 4.75], [-3.0, -0.72, 5.08], '#1c2a1a', '#8a6a44')}
    ${prism([-3.42, -0.72, 4.78], [-3.05, -0.66, 5.05], '#5a3a14', '#9a7a52')}
    <ellipse class="ct-candle-glow" ${(() => {
      const [x, y] = pt(-2.5, -0.62, 5.0);
      return `cx="${x.toFixed(0)}" cy="${y.toFixed(0)}"`;
    })()} rx="120" ry="80" fill="url(#ct-glow)"/>
    ${tag(-2.4, -1.3, 4.4, 'the writing desk')}
  </g>

  <!-- a letter from the Citadel, nailed by the door: Work -->
  <g class="ct-obj" data-section="work" tabindex="0" role="button" aria-label="A letter from the Citadel: Work, out at the Citadel">
    ${hit([3.95, 0.12, 9], [4.66, 1.16, 9])}
    ${tag(4.3, -0.05, 9, 'a letter')}
  </g>

  <!-- the workbench: Projects (out at the Craftsman's Forge) -->
  <g class="ct-obj" data-section="projects" tabindex="0" role="button" aria-label="The workbench: Projects, out at the Craftsman's Forge">
    ${hit([4.0, -1.7, 6.3], [5, 1.0, 8.25])}
    ${tag(4.6, 1.22, 7.1, 'the workbench')}
  </g>

  <!-- chess on the little table -->
  <g class="ct-obj ct-decor" data-quip="chess" tabindex="0" role="button" aria-label="The chessboard">
    ${hit([1.55, -1.7, 4.55], [2.65, -0.85, 5.45])}
  </g>

  <!-- the lute, leaning on the barrel: music -->
  <g class="ct-obj ct-decor" data-action="music" tabindex="0" role="button" aria-label="The lute: open the songbook">
    ${(() => {
      const [x, y] = pt(2.8, -1.7, 4.5);
      return `<rect class="ct-hit" x="${(x - 40).toFixed(0)}" y="${(y - 210).toFixed(0)}" width="90" height="214" rx="10"/>
      <g class="ct-lute" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(12)">
        <path d="M0 -6 c-34 0 -40 -50 -26 -74 c10 -18 42 -18 52 0 c14 24 8 74 -26 74z" fill="url(#ct-lute)"/>
        <circle cx="0" cy="-52" r="9" fill="#120a05"/><circle cx="0" cy="-52" r="12" fill="none" stroke="#d8b070" stroke-width="1" opacity=".6"/>
        <rect x="-5" y="-170" width="10" height="96" fill="#2a1608"/>
        <path d="M-6 -170 l6 -24 l6 24z" fill="#3a1e0c"/>
        <path class="ct-strings" d="M-2 -168 V-18 M0 -168 V-16 M2 -168 V-18" stroke="#e8d8b0" stroke-width=".5" opacity=".8"/>
        <path d="M-10 -20 h20" stroke="#1a0c04" stroke-width="3"/>
      </g>`;
    })()}
  </g>

  <!-- motes of dust drifting in the firelight -->
  <g class="ct-motes">${Array.from({ length: 14 }, (_, k) => `<circle cx="${640 + ((k * 97) % 330)}" cy="${300 + ((k * 61) % 240)}" r="${(0.8 + (k % 3) * 0.5).toFixed(1)}" style="animation-delay:${-(k * 1.7).toFixed(1)}s"/>`).join('')}</g>

  <rect class="ct-night" width="1600" height="900"/>
</svg>`;
}

// Fit each scroll to its name once the lettering has its real width (as the map does).
function drawRibbons(root) {
  root.querySelectorAll('.ct-place-name').forEach((text) => {
    const ribbon = text.previousElementSibling;
    const b = text.getBBox();
    if (!b.width) return;
    const x0 = b.x - 12;
    const x1 = b.x + b.width + 12;
    const y0 = b.y - 2;
    const y1 = b.y + b.height + 1;
    const h = y1 - y0;
    const band = `M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 - 3} ${x1} ${y0} L${x1} ${y1} Q${(x0 + x1) / 2} ${y1 - 3} ${x0} ${y1} Z`;
    const roll = (x, dir) =>
      `M${x} ${y0} C${x + dir * 12} ${y0 - 2}, ${x + dir * 12} ${y1 + 2}, ${x} ${y1} C${x + dir * 5} ${y1 + 1}, ${x + dir * 7} ${y0 + h * 0.45}, ${x + dir * 3} ${y0 + h * 0.4} C${x - dir * 2} ${y0 + h * 0.35}, ${x - dir * 1} ${y0 + h * 0.62}, ${x + dir * 4} ${y0 + h * 0.6}`;
    ribbon.setAttribute('d', band + roll(x0, -1) + roll(x1, 1));
  });
}

let api;
let el;
let room;
let label;
let bubble;
let bar;
let current = 'home';
let reading = false;
let soup = 0;
let bubbleTimer;
let chessTimer;
let cleanup = [];

function on(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  cleanup.push(() => target.removeEventListener(type, fn, opts));
}

function objFor(section) {
  return room.querySelector(`.ct-obj[data-section="${section}"]`);
}

function showLabel(obj) {
  const section = obj.dataset.section;
  const isLute = obj.dataset.action === 'music';
  if (!section && !isLute) return hideLabel();
  const place = isLute ? { name: 'The lute', what: 'The songbook: eleven tunes' } : PLACES[section];
  let extra = '';
  if (section === 'library' && api.data.bookCount) extra = ` · ${api.data.bookCount} books`;
  label.innerHTML = '';
  const b = document.createElement('b');
  b.textContent = place.name;
  label.append(b, place.what + extra);
  const r = (obj.querySelector('.ct-hit') || obj).getBoundingClientRect();
  label.style.left = Math.min(innerWidth - 130, Math.max(130, r.left + r.width / 2)) + 'px';
  label.style.top = Math.max(80, r.top) + 'px';
  label.hidden = false;
}
function hideLabel() {
  label.hidden = true;
}

function say(obj, text, ms = 3600) {
  const r = obj.getBoundingClientRect();
  bubble.textContent = text;
  bubble.style.left = Math.min(innerWidth - 170, Math.max(170, r.left + r.width / 2)) + 'px';
  bubble.style.top = Math.max(90, r.top + 10) + 'px';
  bubble.hidden = false;
  bubble.classList.remove('is-on');
  void bubble.offsetWidth;
  bubble.classList.add('is-on');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => (bubble.hidden = true), ms);
}

function activate(obj) {
  if (obj.dataset.section) {
    api.sfx('select');
    api.go(obj.dataset.section);
    return;
  }
  const quip = obj.dataset.quip;
  if (quip) {
    say(obj, QUIPS[quip]);
    if (quip === 'chess') chessTimer = setTimeout(() => api.navigate(api.data.sections.about + '#interests'), 1800);
    return;
  }
  if (obj.dataset.action === 'soup') {
    say(obj, SOUPS[soup % SOUPS.length]);
    soup++;
    room.classList.remove('is-stirred');
    void room.offsetWidth;
    room.classList.add('is-stirred');
    api.sfx('egg');
  }
  if (obj.dataset.action === 'music') api.openSongbook(obj);
}

function frame() {
  // While a page is open, slide the room so the object it came from stays in view.
  const svgEl = room.querySelector('.ct-svg');
  const narrow = innerWidth <= 760;
  let dx = 0;
  if (reading && !narrow && current !== 'home') {
    const obj = objFor(current);
    const rr = api.readerRect();
    if (obj && rr) {
      const hit = (obj.querySelector('.ct-hit') || obj).getBoundingClientRect();
      const centre = hit.left + hit.width / 2 - Number(room.dataset.dx || 0);
      dx = Math.min(0, Math.max(-(innerWidth - rr.left + 40), rr.left / 2 - centre));
    }
  }
  room.dataset.dx = String(dx);
  svgEl.style.transform = narrow ? '' : `translateX(${dx}px)`;
  if (narrow) {
    // on phones the cottage is wider than the screen: pan to the place in question
    const obj = current !== 'home' && objFor(current);
    const target = obj ? (obj.querySelector('.ct-hit') || obj).getBoundingClientRect() : null;
    const left = target ? room.scrollLeft + target.left + target.width / 2 - innerWidth / 2 : (room.scrollWidth - innerWidth) / 2;
    room.scrollTo({ left, behavior: api.reduceMotion ? 'auto' : 'smooth' });
  }
}

const ICON = {
  about: '<path d="M6 21V8a6 6 0 0 1 12 0v13"/><path d="M4 21h16"/><circle cx="15" cy="14" r="0.8"/>',
  library: '<path d="M4 19V5a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1z"/><path d="M8 4h4v16H8z"/><path d="M13 5.5l3.5-1 4 14.5-3.5 1z"/>',
  contact: '<rect x="3" y="6" width="18" height="13" rx="1"/><path d="M3 7l9 6 9-6"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

const world = {
  id: 'cottage',

  async mount(stage, worldApi) {
    api = worldApi;
    cleanup = [];
    el = document.createElement('div');
    el.className = 'ct';
    el.innerHTML = `
      <div class="ct-room">${svg()}</div>
      <header class="ct-title"><p class="ct-name">Traveler’s Home</p><p class="ct-tag">Click anything. Most things are something.</p></header>
      <p class="ct-label" hidden></p>
      <p class="ct-bubble" role="status" hidden></p>
      <nav class="ct-bar" aria-label="Traveler’s Home">
        <button type="button" data-go="about">${icon('about')}About</button>
        <button type="button" data-go="library">${icon('library')}Library</button>
        <button type="button" data-go="contact">${icon('contact')}Contact</button>
        <button type="button" data-map>${icon('map')}Back to the map</button>
      </nav>`;
    stage.appendChild(el);
    room = el.querySelector('.ct-room');
    label = el.querySelector('.ct-label');
    bubble = el.querySelector('.ct-bubble');
    bar = el.querySelector('.ct-bar');
    drawRibbons(room);
    document.fonts.load("22px 'Uncial Antiqua'").then(() => el && drawRibbons(room), () => {});
    deckle(bar, { seed: 6, amp: 2.6 });
    world.setTheme(api.theme());

    room.querySelectorAll('.ct-obj').forEach((obj) => {
      on(obj, 'click', () => activate(obj));
      on(obj, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(obj);
        }
      });
      on(obj, 'pointerenter', () => showLabel(obj));
      on(obj, 'pointerleave', hideLabel);
      on(obj, 'focus', () => showLabel(obj));
      on(obj, 'blur', hideLabel);
    });
    bar.querySelectorAll('[data-go]').forEach((b) => on(b, 'click', () => api.go(b.dataset.go)));
    on(bar.querySelector('[data-map]'), 'click', () => api.toMap());
    on(window, 'resize', frame);
    on(document, 'site:music', (e) => room.classList.toggle('is-playing', e.detail.playing));
    room.classList.toggle('is-playing', api.musicPlaying());
  },

  show(section) {
    current = section;
    room.querySelectorAll('.ct-obj.is-active').forEach((o) => o.classList.remove('is-active'));
    const obj = section !== 'home' && objFor(section);
    if (obj) obj.classList.add('is-active');
    bar.querySelectorAll('[data-go]').forEach((b) => b.toggleAttribute('aria-current', b.dataset.go === section));
    hideLabel();
    requestAnimationFrame(frame);
  },

  setReading(open) {
    reading = open;
    el.classList.toggle('is-reading', open);
    requestAnimationFrame(frame);
  },

  setTheme(theme) {
    el.classList.toggle('is-night', theme === 'dark');
  },

  unmount() {
    cleanup.forEach((fn) => fn());
    cleanup = [];
    clearTimeout(bubbleTimer);
    clearTimeout(chessTimer);
    el.remove();
  },
};

export default world;
