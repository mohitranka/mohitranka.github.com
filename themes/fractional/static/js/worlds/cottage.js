// Traveler's Home: the cottage on the Unfinished Atlas, drawn in SVG. The personal
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

// Leather tomes with gilt bands; one of them slides out on hover.
function tomes() {
  const r = seeded(1066);
  const leather = ['#6b2a22', '#7a4a29', '#3f5a3a', '#2e3b55', '#8a5a2b', '#5a2f3f', '#9a7a4a'];
  let out = '';
  [228, 330, 432, 534, 632].forEach((shelf, row) => {
    let x = 418;
    while (x < 600) {
      const w = 13 + Math.floor(r() * 12);
      if (x + w > 604) break;
      const h = 58 + Math.floor(r() * 28);
      const c = leather[Math.floor(r() * leather.length)];
      const pull = row === 1 && x > 470 && x < 500 && !out.includes('ct-pull');
      const lean = row === 3 && x > 560 ? ` transform="rotate(-12 ${x} ${shelf})"` : '';
      out += `<g${pull ? ' class="ct-pull"' : ''}${lean}><rect x="${x}" y="${shelf - h}" width="${w}" height="${h}" rx="2" fill="${c}"/><rect x="${x}" y="${shelf - h + 9}" width="${w}" height="2.5" fill="#d9b25a"/><rect x="${x}" y="${shelf - 13}" width="${w}" height="2.5" fill="#d9b25a"/></g>`;
      x += w + (r() < 0.1 ? 9 : 1);
    }
  });
  return out;
}

function svg() {
  return `
<svg class="ct-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Traveler's Home">
  <defs>
    <pattern id="ct-plaster" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" class="ct-wall"/><path d="M14 30 q20 -6 40 2 M70 88 q18 6 34 -2 M30 104 q10 -4 18 0" class="ct-crack"/></pattern>
    <pattern id="ct-stone" width="60" height="34" patternUnits="userSpaceOnUse"><rect width="60" height="34" class="ct-stone"/><path d="M0 17 H60 M30 0 V17 M0 17 V34 M60 17 V34" class="ct-mortar"/></pattern>
    <linearGradient id="ct-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ct-sky-top"/><stop offset="1" class="ct-sky-low"/></linearGradient>
    <radialGradient id="ct-glow"><stop offset="0" stop-color="#ffb347" stop-opacity=".6"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <clipPath id="ct-window-clip"><path d="M672 360 V200 Q760 110 848 200 V360Z"/></clipPath>
  </defs>

  <rect width="1600" height="650" fill="url(#ct-plaster)"/>
  <rect y="560" width="1600" height="90" fill="url(#ct-stone)"/>
  <rect y="652" width="1600" height="248" class="ct-floor"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 ${690 + i * 40} H1600" class="ct-plank"/>`).join('')}
  ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${(i * 311 + (i % 2) * 150) % 1600} ${690 + i * 40} v40" class="ct-plank"/>`).join('')}

  <!-- the timber frame -->
  <g class="ct-timber">
    <rect width="1600" height="44"/>
    <rect x="0" y="44" width="26" height="608"/>
    <rect x="1574" y="44" width="26" height="608"/>
    <rect x="626" y="44" width="22" height="516"/>
    <rect x="1262" y="44" width="22" height="516"/>
    <path d="M26 44 L190 150 L208 140 L48 44Z M1574 44 L1430 140 L1414 128 L1552 44Z"/>
    <rect x="0" y="548" width="1600" height="14"/>
  </g>

  <!-- iron candle ring -->
  <path d="M960 44 V96" class="ct-chain"/>
  <ellipse cx="960" cy="104" rx="70" ry="12" class="ct-iron-ring"/>
  ${[-56, -20, 20, 56].map((dx) => `<rect x="${956 + dx}" y="80" width="8" height="18" fill="#efe2c4"/><path class="ct-flame" d="M${960 + dx} 66 q6 8 0 14 q-6 -6 0 -14Z"/>`).join('')}
  <ellipse class="ct-night-glow" cx="960" cy="140" rx="300" ry="200" fill="url(#ct-glow)"/>

  <!-- front door: About -->
  <g class="ct-obj" data-section="about" tabindex="0" role="button" aria-label="The front door: About">
    <rect class="ct-hit" x="44" y="170" width="220" height="490"/>
    <path d="M52 650 V300 Q154 150 256 300 V650Z" fill="url(#ct-stone)" class="ct-arch"/>
    <path d="M74 650 V310 Q154 190 234 310 V650Z" class="ct-hall"/>
    <g class="ct-door">
      <path d="M74 650 V310 Q154 190 234 310 V650Z" fill="#6b4428"/>
      <path d="M100 640 V300 M128 640 V262 M156 640 V246 M184 640 V256 M212 640 V290" stroke="#57361f" stroke-width="3"/>
      <rect x="74" y="360" width="160" height="14" fill="#2b2622"/><rect x="74" y="560" width="160" height="14" fill="#2b2622"/>
      ${[92, 120, 148, 176, 204].map((x) => `<circle cx="${x}" cy="367" r="3" fill="#8a8174"/><circle cx="${x}" cy="567" r="3" fill="#8a8174"/>`).join('')}
      <circle cx="210" cy="470" r="13" fill="none" stroke="#2b2622" stroke-width="5"/>
      <rect x="203" y="452" width="14" height="8" fill="#2b2622"/>
    </g>
  </g>
  <g class="ct-obj ct-decor" data-quip="doormat" tabindex="0" role="button" aria-label="The doormat">
    <path d="M70 664 h168 l16 30 h-200z" fill="#9a7a4a"/>
    <text x="154" y="686" text-anchor="middle" class="ct-mat">WELCOME-ISH</text>
  </g>

  <!-- messenger's letterbox and the raven: Contact -->
  <g class="ct-obj" data-section="contact" tabindex="0" role="button" aria-label="The messenger's letterbox: Contact, out at the Messenger's Outpost">
    <rect class="ct-hit" x="276" y="240" width="120" height="320"/>
    <rect x="290" y="300" width="92" height="96" rx="4" fill="#7a4a29"/>
    <path d="M286 300 h100 l-8 -22 h-84z" fill="#57361f"/>
    <rect x="304" y="322" width="64" height="7" rx="3" fill="#2b2622"/>
    <g class="ct-letters"><rect x="312" y="306" width="30" height="20" fill="#efe2c4" transform="rotate(-8 327 316)"/><circle cx="330" cy="318" r="4" fill="#a83a2a"/><rect x="336" y="304" width="26" height="18" fill="#f6ecd2" transform="rotate(6 349 313)"/></g>
    <path d="M306 344 q30 12 60 0" stroke="#57361f" stroke-width="3" fill="none"/>
    <rect x="286" y="470" width="100" height="10" fill="#57361f"/>
    <path d="M298 480 l8 40 M374 480 l-8 40" stroke="#57361f" stroke-width="5"/>
    <g class="ct-raven">
      <path d="M318 470 q-8 -30 14 -46 q18 -10 30 4 l14 -2 l-12 10 q4 24 -12 34z" fill="#1d1c22"/>
      <path class="ct-raven-head" d="M342 428 q12 -12 24 -2 l14 2 l-14 6 q-10 6 -24 -6z" fill="#1d1c22"/>
      <circle cx="356" cy="428" r="2" fill="#efe2c4"/>
    </g>
    <path d="M300 470 l-6 -22 q0 -4 4 -2 l8 22" fill="#efe2c4"/>
  </g>

  <!-- shelves of tomes: Library -->
  <g class="ct-obj" data-section="library" tabindex="0" role="button" aria-label="The shelves: Library">
    <rect class="ct-hit" x="404" y="110" width="212" height="540"/>
    <rect x="408" y="120" width="204" height="528" fill="#57361f"/>
    <rect x="416" y="130" width="188" height="510" fill="#3a2414"/>
    ${[228, 330, 432, 534, 632].map((y) => `<rect x="412" y="${y}" width="196" height="10" fill="#6b4428"/>`).join('')}
    ${tomes()}
    <rect x="430" y="96" width="14" height="24" fill="#efe2c4"/><path class="ct-flame" d="M437 82 q6 8 0 14 q-6 -6 0 -14Z"/>
    <path d="M560 120 q8 -26 30 -26 q14 0 14 26z" fill="#8a8174"/>
  </g>

  <!-- arched window onto the map's country -->
  <g class="ct-obj ct-decor" data-quip="window" tabindex="0" role="button" aria-label="The window">
    <path d="M660 372 V198 Q760 92 860 198 V372Z" fill="#57361f"/>
    <path d="M672 360 V200 Q760 110 848 200 V360Z" fill="url(#ct-sky)"/>
    <g clip-path="url(#ct-window-clip)">
      <circle class="ct-sun" cx="800" cy="190" r="18"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="ct-star" cx="${690 + i * 28}" cy="${170 + (i % 3) * 18}" r="1.6"/>`).join('')}
      <path class="ct-hill-far" d="M660 300 Q720 250 780 276 T870 260 V372 H660Z"/>
      <g class="ct-castle"><rect x="748" y="238" width="34" height="26"/><rect x="741" y="224" width="10" height="40"/><rect x="779" y="224" width="10" height="40"/><path d="M765 238 v-18 l11 4 l-11 4"/></g>
      <rect class="ct-lit" x="762" y="248" width="5" height="7"/>
      <path class="ct-hill-near" d="M660 330 Q730 296 800 322 T870 314 V372 H660Z"/>
      <path class="ct-road" d="M700 372 Q730 340 768 330 T812 316"/>
    </g>
    <path d="M760 110 V360 M672 250 H848 M672 305 H848" class="ct-lead"/>
    <path d="M672 200 L848 360 M848 200 L672 360" class="ct-lead ct-lead--thin"/>
    <rect x="652" y="372" width="216" height="14" fill="#6b4428"/>
  </g>

  <!-- writing desk: Writing (out at the Library of Stories) -->
  <g class="ct-obj" data-section="writing" tabindex="0" role="button" aria-label="The writing desk: Writing, out at the Library of Stories">
    <rect class="ct-hit" x="650" y="400" width="240" height="250"/>
    <rect x="652" y="480" width="236" height="16" fill="#6b4428"/>
    <path d="M664 496 v150 M876 496 v150 M664 600 h212" stroke="#57361f" stroke-width="10"/>
    <g class="ct-page"><path d="M700 480 l6 -40 h70 l-6 40z" fill="#f6ecd2"/><path d="M714 452 h50 M712 462 h46 M710 472 h40" stroke="#9a8a6a" stroke-width="2"/></g>
    <rect x="800" y="462" width="22" height="18" rx="4" fill="#2b2622"/>
    <path class="ct-quill" d="M812 462 q10 -40 34 -62 q-8 30 -30 62z" fill="#efe2c4"/>
    <rect x="846" y="446" width="12" height="34" fill="#efe2c4"/><path class="ct-flame" d="M852 430 q6 8 0 14 q-6 -6 0 -14Z"/>
    <ellipse class="ct-candle-glow" cx="852" cy="440" rx="60" ry="44" fill="url(#ct-glow)"/>
    <rect x="664" y="458" width="30" height="22" fill="#6b2a22"/><rect x="668" y="444" width="26" height="14" fill="#3f5a3a"/>
  </g>

  <!-- the hearth, with a cauldron and an embroidered sampler above -->
  <g class="ct-obj ct-decor" data-action="soup" tabindex="0" role="button" aria-label="The cauldron">
    <path d="M930 650 V300 H1230 V650 H1160 V430 Q1080 360 1000 430 V650Z" fill="url(#ct-stone)" class="ct-hearth"/>
    <rect x="916" y="290" width="328" height="20" fill="#6b4428"/>
    <path d="M1000 650 V430 Q1080 360 1160 430 V650Z" fill="#1d1612"/>
    <g class="ct-fire">
      <path class="ct-fire-a" d="M1040 650 q-10 -50 20 -90 q4 30 20 40 q10 -30 0 -60 q40 30 30 110z" fill="#e86a2a"/>
      <path class="ct-fire-b" d="M1056 650 q-4 -36 18 -58 q2 22 14 30 q10 -12 6 -30 q22 26 12 58z" fill="#f6b94a"/>
    </g>
    <ellipse class="ct-hearth-glow" cx="1080" cy="600" rx="200" ry="120" fill="url(#ct-glow)"/>
    <path d="M1080 360 V470" stroke="#2b2622" stroke-width="4"/>
    <path d="M1036 470 h88 q0 70 -44 70 q-44 0 -44 -70z" fill="#2b2622"/>
    <path class="ct-steam" d="M1066 462 q-8 -14 2 -26 M1090 462 q8 -14 -2 -28" stroke="#d9cfb4" stroke-width="3" fill="none"/>
  </g>
  <g class="ct-obj ct-decor" data-quip="sampler" tabindex="0" role="button" aria-label="An embroidered sampler">
    <rect x="1006" y="150" width="148" height="122" fill="#efe2c4" stroke="#6b4428" stroke-width="6"/>
    <text x="1080" y="184" text-anchor="middle" class="ct-sampler-big">GRANDMASTER</text>
    <text x="1080" y="202" text-anchor="middle" class="ct-sampler-small">of</text>
    <text x="1080" y="224" text-anchor="middle" class="ct-sampler-big">SNACKS</text>
    <path d="M1064 262 h22 l-3 -8 q6 -14 -3 -24 l-7 -3 l-8 6 l2 4 l6 -1 l-8 12 l3 8z" fill="#6b2a22"/>
    <path d="M1014 158 h132 M1014 264 h132" stroke="#a83a2a" stroke-width="2" stroke-dasharray="4 4"/>
  </g>

  <!-- the lute: music -->
  <g class="ct-obj ct-decor" data-action="music" tabindex="0" role="button" aria-label="The lute: open the songbook">
    <rect class="ct-hit" x="1196" y="440" width="64" height="210"/>
    <g class="ct-lute" transform="rotate(-10 1228 560)">
      <ellipse cx="1228" cy="600" rx="30" ry="40" fill="#9a6a3a"/>
      <circle cx="1228" cy="596" r="9" fill="#3a2414"/>
      <rect x="1223" y="470" width="10" height="110" fill="#6b4428"/>
      <path d="M1220 470 l8 -24 l8 24z" fill="#57361f"/>
      <path class="ct-strings" d="M1225 480 V630 M1228 480 V632 M1231 480 V630" stroke="#efe2c4" stroke-width="0.8"/>
    </g>
  </g>

  <!-- a letter from the Citadel, pinned to the beam: Work -->
  <g class="ct-obj" data-section="work" tabindex="0" role="button" aria-label="A letter from the Citadel: Work, out at the Citadel">
    <rect class="ct-hit" x="1300" y="120" width="130" height="190"/>
    <g class="ct-scroll">
      <rect x="1318" y="140" width="96" height="140" fill="#f6ecd2"/>
      <rect x="1312" y="132" width="108" height="14" rx="7" fill="#d9c69a"/><rect x="1312" y="274" width="108" height="14" rx="7" fill="#d9c69a"/>
      <path d="M1340 170 h52 M1334 186 h64 M1334 200 h60 M1334 214 h48" stroke="#6a4e30" stroke-width="2.4"/>
      <g fill="#6a4e30"><rect x="1350" y="230" width="32" height="22"/><rect x="1345" y="222" width="8" height="30"/><rect x="1379" y="222" width="8" height="30"/></g>
      <circle cx="1400" cy="262" r="12" fill="#a83a2a"/>
      <circle cx="1366" cy="128" r="5" fill="#8a8174"/>
    </g>
  </g>

  <!-- the workbench: Projects (out at the Craftsman's Forge) -->
  <g class="ct-obj" data-section="projects" tabindex="0" role="button" aria-label="The workbench: Projects, out at the Craftsman's Forge">
    <rect class="ct-hit" x="1300" y="330" width="270" height="320"/>
    <rect x="1310" y="340" width="250" height="170" fill="#8a6a3e" opacity=".35"/>
    <path d="M1330 360 v80 M1326 352 h8 v12 h-8z" stroke="#57361f" stroke-width="6"/>
    <path d="M1380 356 l10 0 l2 80 l-14 0z" fill="#6b4428"/><rect x="1378" y="436" width="16" height="16" fill="#8a8174"/>
    <path d="M1430 360 h44 v14 h-44z M1446 374 v70 h12 v-70" fill="#57361f"/>
    <path d="M1510 368 a16 16 0 1 0 0.1 0 M1510 398 v52" stroke="#8a8174" stroke-width="8" fill="none"/>
    <rect x="1300" y="520" width="270" height="18" fill="#6b4428"/>
    <path d="M1314 538 v108 M1556 538 v108 M1314 610 h242" stroke="#57361f" stroke-width="10"/>
    <g class="ct-gears">
      <g class="ct-gear ct-gear--a"><circle cx="1380" cy="490" r="24" fill="#b08a4a"/><circle cx="1380" cy="490" r="8" fill="#57361f"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="1376" y="460" width="8" height="10" fill="#b08a4a" transform="rotate(${a} 1380 490)"/>`).join('')}</g>
      <g class="ct-gear ct-gear--b"><circle cx="1418" cy="506" r="14" fill="#8a6a3e"/><circle cx="1418" cy="506" r="5" fill="#57361f"/>${[0, 60, 120, 180, 240, 300].map((a) => `<rect x="1415" y="488" width="6" height="7" fill="#8a6a3e" transform="rotate(${a} 1418 506)"/>`).join('')}</g>
    </g>
    <path d="M1470 520 l50 -18" stroke="#2b2622" stroke-width="6" stroke-linecap="round"/>
  </g>

  <!-- rug, table and chess -->
  <ellipse cx="760" cy="850" rx="360" ry="44" fill="#6b2a22"/>
  <ellipse cx="760" cy="850" rx="320" ry="34" fill="none" stroke="#d9b25a" stroke-width="4" stroke-dasharray="12 8"/>
  <g class="ct-obj ct-decor" data-quip="chess" tabindex="0" role="button" aria-label="The chessboard">
    <rect class="ct-hit" x="580" y="740" width="360" height="160"/>
    <rect x="590" y="790" width="340" height="20" rx="4" fill="#6b4428"/>
    <path d="M612 810 v70 M908 810 v70" stroke="#57361f" stroke-width="12"/>
    <g transform="translate(690 762)">
      <path d="M0 28 L18 0 H122 L140 28Z" fill="#efe2c4"/>
      ${Array.from({ length: 32 }, (_, k) => {
        const row = Math.floor(k / 8);
        const col = k % 8;
        if ((row + col) % 2 === 0) return '';
        const inset = 18 - row * 4.5;
        const w = (140 - 2 * inset) / 8;
        return `<rect x="${inset + col * w}" y="${row * 7}" width="${w}" height="7" fill="#6b4428"/>`;
      }).join('')}
      <path d="M40 10 v-14 h6 v14z M44 -6 a5 5 0 1 0 0.1 0" fill="#1d1c22"/>
      <path d="M92 18 v-16 h7 v16z M95 -1 l-6 -8 h12z" fill="#f6ecd2" stroke="#1d1c22" stroke-width="1.5"/>
    </g>
    <path d="M540 900 v-50 h50 v50 M930 900 v-50 h50 v50" fill="#57361f"/>
    <rect x="532" y="840" width="66" height="14" rx="4" fill="#6b4428"/><rect x="922" y="840" width="66" height="14" rx="4" fill="#6b4428"/>
  </g>

  <rect class="ct-night" width="1600" height="900"/>
  <ellipse class="ct-night-glow" cx="1080" cy="560" rx="320" ry="220" fill="url(#ct-glow)"/>
  <ellipse class="ct-night-glow" cx="852" cy="440" rx="120" ry="90" fill="url(#ct-glow)"/>
</svg>`;
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
