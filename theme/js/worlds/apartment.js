// Apartment 404: the site as a lived-in 1990s sitcom set, drawn in SVG. Each section
// is an object in the room; a few objects are just objects, with opinions. The remote
// control lists every section, so nothing depends on precise pointing.

const PLACES = {
  about: { name: 'The front door', what: 'About' },
  writing: { name: 'The writing desk', what: 'Writing' },
  work: { name: 'The computer', what: 'Work' },
  projects: { name: 'The workbench', what: 'Projects' },
  library: { name: 'The bookshelf', what: 'Library' },
  contact: { name: 'The telephone', what: 'Contact' },
};

const QUIPS = {
  chess: 'The engine says I’m winning. The engine has been wrong before.',
  window: 'That’s Side Quest City out there. The rent reflects the view.',
  poster: 'Title self-awarded. The federation is still reviewing the paperwork.',
  sofa: 'The sofa has seen things. Mostly reruns.',
  plant: 'Watered on a strict schedule of “oh no”.',
};

const TV = ['bars', 'static', 'standby', 'chess'];

function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function books() {
  const r = seeded(404);
  const colours = ['#e8553f', '#f2c14e', '#fff4d6', '#4f7ac9', '#7a2e3a', '#3d8a6b', '#c9774a', '#2d3a5c', '#e9a8a0'];
  let out = '';
  [222, 322, 422, 522, 622].forEach((shelf, row) => {
    let x = 396;
    while (x < 570) {
      const w = 11 + Math.floor(r() * 13);
      if (x + w > 574) break;
      const h = 54 + Math.floor(r() * 30);
      const lean = row === 3 && x > 520 ? ` transform="rotate(-14 ${x} ${shelf})"` : '';
      const c = colours[Math.floor(r() * colours.length)];
      const pull = row === 1 && x > 450 && x < 480 && !out.includes('apt-pull');
      out += `<g${pull ? ' class="apt-pull"' : ''}${lean}><rect x="${x}" y="${shelf - h}" width="${w}" height="${h}" rx="1.5" fill="${c}"/><rect x="${x + 2}" y="${shelf - h + 10}" width="${w - 4}" height="3" fill="rgba(0,0,0,.18)"/></g>`;
      x += w + (r() < 0.12 ? 10 : 1);
    }
  });
  return out;
}

function skyline() {
  const r = seeded(7);
  let out = '';
  let x = 640;
  while (x < 900) {
    const w = 22 + Math.floor(r() * 34);
    const h = 60 + Math.floor(r() * 120);
    out += `<rect class="apt-tower" x="${x}" y="${360 - h}" width="${w}" height="${h}"/>`;
    for (let wy = 360 - h + 10; wy < 350; wy += 16) {
      for (let wx = x + 5; wx < x + w - 6; wx += 10) if (r() < 0.45) out += `<rect class="apt-lit" x="${wx}" y="${wy}" width="4" height="6"/>`;
    }
    x += w + 4;
  }
  return out;
}

function svg() {
  return `
<svg class="apt-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Apartment 404">
  <defs>
    <pattern id="apt-paper" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" class="apt-wall"/><path d="M20 0 V40" class="apt-stripe"/><circle cx="0" cy="20" r="2.5" class="apt-dot"/><circle cx="40" cy="20" r="2.5" class="apt-dot"/></pattern>
    <linearGradient id="apt-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="apt-sky-top"/><stop offset="1" class="apt-sky-low"/></linearGradient>
    <radialGradient id="apt-glow"><stop offset="0" stop-color="#ffd98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
    <clipPath id="apt-window-clip"><rect x="640" y="122" width="250" height="226"/></clipPath>
    <clipPath id="apt-tv-clip"><rect x="1196" y="658" width="134" height="100" rx="14"/></clipPath>
  </defs>

  <rect width="1600" height="650" fill="url(#apt-paper)"/>
  <rect width="1600" height="26" class="apt-trim"/>
  <rect y="630" width="1600" height="22" class="apt-trim"/>
  <rect y="652" width="1600" height="248" class="apt-floor"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 ${690 + i * 40} H1600" class="apt-plank"/>`).join('')}
  ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${(i * 297 + (i % 2) * 140) % 1600} ${690 + i * 40} v40" class="apt-plank"/>`).join('')}

  <!-- ceiling lamp -->
  <path d="M800 0 V64" class="apt-cord"/>
  <path d="M762 64 h76 l22 40 h-120z" class="apt-shade"/>
  <ellipse class="apt-night-glow" cx="800" cy="200" rx="300" ry="220" fill="url(#apt-glow)"/>

  <!-- front door: About -->
  <g class="apt-obj" data-section="about" tabindex="0" role="button" aria-label="The front door: About">
    <rect class="apt-hit" x="40" y="160" width="210" height="560"/>
    <rect x="50" y="168" width="190" height="464" class="apt-trim"/>
    <rect x="64" y="182" width="162" height="450" class="apt-hall"/>
    <g class="apt-door">
      <rect x="64" y="182" width="162" height="450" fill="#5b3a7a"/>
      <rect x="84" y="206" width="122" height="150" rx="4" fill="none" stroke="#4a2e66" stroke-width="6"/>
      <rect x="84" y="384" width="122" height="220" rx="4" fill="none" stroke="#4a2e66" stroke-width="6"/>
      <text x="145" y="292" text-anchor="middle" class="apt-404">404</text>
      <circle cx="145" cy="238" r="5" fill="#2a1840"/>
      <circle cx="204" cy="420" r="9" fill="#e1b04a"/>
      <rect x="196" y="440" width="16" height="6" rx="2" fill="#c49536"/>
    </g>
    <path d="M70 650 h150 l14 30 h-178z" fill="#8a6a3e"/>
    <text x="145" y="672" text-anchor="middle" class="apt-mat">WELCOME-ISH</text>
  </g>

  <!-- mailbox and telephone: Contact -->
  <g class="apt-obj" data-section="contact" tabindex="0" role="button" aria-label="The telephone and mailbox: Contact">
    <rect class="apt-hit" x="250" y="280" width="120" height="370"/>
    <rect x="262" y="300" width="80" height="60" rx="6" fill="#4f7ac9"/>
    <rect x="276" y="318" width="52" height="6" rx="3" fill="#24395e"/>
    <g class="apt-flag"><rect x="340" y="306" width="6" height="34" fill="#e8553f"/><rect x="340" y="306" width="22" height="12" fill="#e8553f"/></g>
    <rect x="256" y="520" width="104" height="12" fill="#6b4428"/>
    <path d="M266 532 v110 M350 532 v110" stroke="#6b4428" stroke-width="8"/>
    <g class="apt-phone">
      <path d="M272 520 l10 -34 h52 l10 34z" fill="#c4404a"/>
      <circle cx="308" cy="504" r="11" fill="#fff4d6"/>
      <circle cx="308" cy="504" r="4" fill="#c4404a"/>
      <g class="apt-handset"><rect x="268" y="474" width="80" height="12" rx="6" fill="#a8343e"/><rect x="266" y="468" width="18" height="16" rx="5" fill="#a8343e"/><rect x="332" y="468" width="18" height="16" rx="5" fill="#a8343e"/></g>
    </g>
    <path d="M346 512 q30 40 -4 90" fill="none" stroke="#a8343e" stroke-width="3"/>
  </g>

  <!-- bookshelf: Library -->
  <g class="apt-obj" data-section="library" tabindex="0" role="button" aria-label="The bookshelf: Library">
    <rect class="apt-hit" x="380" y="100" width="210" height="540"/>
    <rect x="384" y="112" width="200" height="520" fill="#6b4428"/>
    <rect x="392" y="120" width="184" height="504" fill="#4a2e1a"/>
    ${[222, 322, 422, 522, 622].map((y) => `<rect x="388" y="${y}" width="192" height="10" fill="#7d5233"/>`).join('')}
    ${books()}
    <path d="M410 112 q14 -40 10 -60 M424 112 q-2 -30 18 -50 M430 112 q20 -24 36 -26" stroke="#3d8a6b" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="404" y="98" width="40" height="16" rx="3" fill="#c9774a"/>
  </g>

  <!-- window -->
  <g class="apt-obj apt-decor" data-quip="window" tabindex="0" role="button" aria-label="The window">
    <rect x="628" y="110" width="274" height="250" class="apt-trim"/>
    <rect x="640" y="122" width="250" height="226" fill="url(#apt-sky)"/>
    <g clip-path="url(#apt-window-clip)">
      <circle class="apt-sun" cx="840" cy="170" r="22"/>
      ${skyline()}
    </g>
    <path d="M765 122 V348 M640 236 H890" class="apt-mullion"/>
    <path d="M608 100 h56 q-8 140 6 270 h-62z M922 100 h-56 q8 140 -6 270 h62z" fill="#93394a"/>
    <rect x="600" y="92" width="330" height="12" rx="6" fill="#5b3420"/>
  </g>

  <!-- writing desk: Writing -->
  <g class="apt-obj" data-section="writing" tabindex="0" role="button" aria-label="The writing desk: Writing">
    <rect class="apt-hit" x="610" y="370" width="300" height="275"/>
    <rect x="620" y="470" width="290" height="18" fill="#8a5530"/>
    <rect x="630" y="488" width="96" height="144" fill="#7a4a29"/>
    <rect x="642" y="504" width="72" height="40" rx="3" fill="none" stroke="#5e391f" stroke-width="4"/>
    <rect x="642" y="560" width="72" height="56" rx="3" fill="none" stroke="#5e391f" stroke-width="4"/>
    <rect x="884" y="488" width="14" height="144" fill="#7a4a29"/>
    <g class="apt-paper"><rect x="716" y="392" width="76" height="52" fill="#fffaf0"/><path d="M726 406 h52 M726 416 h44 M726 426 h50" stroke="#9a958c" stroke-width="2"/></g>
    <path d="M694 470 l12 -38 h96 l12 38z" fill="#2d3a5c"/>
    <rect x="704" y="428" width="100" height="14" rx="4" fill="#1e2840"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${716 + i * 12}" cy="456" r="4" fill="#fff4d6"/>`).join('')}
    <rect x="636" y="452" width="46" height="18" fill="#f2c14e"/><rect x="640" y="440" width="40" height="12" fill="#e8553f"/>
    <g class="apt-lamp"><path d="M868 470 v-6 h28 v6z M880 464 l-10 -56 l-24 -12" stroke="#2a2a2a" stroke-width="5" fill="none"/><path d="M826 388 l30 -8 l10 26 l-38 10z" fill="#3d8a6b"/><ellipse class="apt-lamp-glow" cx="826" cy="440" rx="70" ry="44" fill="url(#apt-glow)"/></g>
  </g>

  <!-- poster -->
  <g class="apt-obj apt-decor" data-quip="poster" tabindex="0" role="button" aria-label="A poster">
    <g transform="rotate(-2 1020 250)">
      <rect x="950" y="150" width="140" height="196" fill="#fff4d6" stroke="#2a2a2a" stroke-width="3"/>
      <path d="M1000 300 h40 l-6 -14 q10 -26 -6 -46 l-12 -6 l-14 10 l4 8 l10 -2 l-14 22 l6 14z" fill="#2a2a2a"/>
      <text x="1020" y="186" text-anchor="middle" class="apt-poster-big">GRANDMASTER</text>
      <text x="1020" y="206" text-anchor="middle" class="apt-poster-small">of</text>
      <text x="1020" y="232" text-anchor="middle" class="apt-poster-big">SNACKS</text>
      <rect x="1052" y="268" width="22" height="30" rx="3" fill="#e8553f" transform="rotate(12 1063 283)"/>
    </g>
  </g>

  <!-- sideboard and record player: music -->
  <g class="apt-obj apt-decor" data-action="music" tabindex="0" role="button" aria-label="The record player: play or stop the music">
    <rect class="apt-hit" x="930" y="460" width="180" height="180"/>
    <rect x="940" y="540" width="164" height="92" fill="#7a4a29"/>
    <path d="M1022 548 v78" stroke="#5e391f" stroke-width="4"/>
    <circle cx="1010" cy="586" r="4" fill="#e1b04a"/><circle cx="1034" cy="586" r="4" fill="#e1b04a"/>
    <rect x="956" y="512" width="132" height="28" rx="4" fill="#c9774a"/>
    <g class="apt-record"><circle cx="1006" cy="512" r="38" fill="#1d1c1a"/><circle cx="1006" cy="512" r="28" fill="none" stroke="#3a3936" stroke-width="2"/><circle cx="1006" cy="512" r="12" fill="#e8553f"/><path d="M1006 476 v10" stroke="#55534e" stroke-width="3"/></g>
    <path d="M1070 492 v20 l-24 22" stroke="#d8d4cc" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g transform="rotate(-8 1096 520)"><rect x="1086" y="470" width="10" height="70" fill="#4f7ac9"/><rect x="1097" y="476" width="10" height="64" fill="#f2c14e"/></g>
  </g>

  <!-- computer: Work -->
  <g class="apt-obj" data-section="work" tabindex="0" role="button" aria-label="The computer: Work">
    <rect class="apt-hit" x="1110" y="320" width="230" height="325"/>
    <rect x="1120" y="480" width="214" height="16" fill="#8a5530"/>
    <path d="M1132 496 v136 M1322 496 v136" stroke="#7a4a29" stroke-width="10"/>
    <rect x="1150" y="340" width="148" height="128" rx="10" fill="#d9cfb4"/>
    <rect x="1164" y="354" width="120" height="92" rx="8" fill="#14301f"/>
    <g class="apt-screen"><text x="1172" y="374" class="apt-code">&gt; uptime: yes</text><text x="1172" y="392" class="apt-code">&gt; pager: quiet</text><text x="1172" y="410" class="apt-code">&gt; coffee: low</text><rect class="apt-caret" x="1172" y="418" width="9" height="12" fill="#7cf0a0"/></g>
    <rect x="1196" y="468" width="56" height="12" fill="#c4b99c"/>
    <rect x="1170" y="486" width="110" height="10" rx="3" fill="#bdb193"/>
    <g class="apt-mug"><rect x="1296" y="452" width="24" height="28" rx="3" fill="#fff4d6"/><path d="M1320 460 q10 2 0 14" stroke="#fff4d6" stroke-width="4" fill="none"/><path class="apt-steam" d="M1304 444 q-6 -10 2 -18 M1312 444 q6 -10 -2 -20" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/></g>
  </g>

  <!-- workbench: Projects -->
  <g class="apt-obj" data-section="projects" tabindex="0" role="button" aria-label="The workbench: Projects">
    <rect class="apt-hit" x="1350" y="190" width="240" height="455"/>
    <rect x="1366" y="200" width="214" height="220" fill="#c9a679"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => `<circle cx="${1380 + j * 21}" cy="${214 + i * 27}" r="2" fill="#8a6a3e"/>`).join('')).join('')}
    <path d="M1396 236 l8 0 l0 80 l-8 0z M1388 228 h24 v10 h-24z" fill="#4f7ac9"/>
    <path d="M1440 230 l10 0 l2 90 l-14 0z" fill="#e8553f"/><rect x="1442" y="320" width="6" height="40" fill="#999"/>
    <path d="M1482 240 h50 v14 h-50z M1500 254 v76 h12 v-76" fill="#5b3420"/><rect x="1480" y="236" width="56" height="22" fill="#6d6d6d"/>
    <path d="M1546 240 a16 16 0 1 0 0.1 0 M1546 270 v70" stroke="#6d6d6d" stroke-width="8" fill="none"/>
    <rect x="1350" y="500" width="240" height="18" fill="#8a5530"/>
    <path d="M1362 518 v114 M1578 518 v114 M1362 600 h216" stroke="#7a4a29" stroke-width="10"/>
    <g class="apt-bot"><rect x="1400" y="448" width="64" height="52" rx="6" fill="#3d8a6b"/><rect x="1412" y="460" width="40" height="18" rx="3" fill="#14301f"/><circle class="apt-led" cx="1422" cy="469" r="4" fill="#7cf0a0"/><circle class="apt-led" cx="1442" cy="469" r="4" fill="#7cf0a0"/><path d="M1432 448 v-22" stroke="#2a2a2a" stroke-width="3"/><circle cx="1432" cy="424" r="5" fill="#e8553f"/></g>
    <path d="M1496 496 l60 -24" stroke="#2a2a2a" stroke-width="6" stroke-linecap="round"/><circle class="apt-spark" cx="1494" cy="497" r="5" fill="#ffe066"/>
  </g>

  <!-- rug, sofa, coffee table with chess -->
  <ellipse cx="760" cy="850" rx="360" ry="46" fill="#3d6b6a"/>
  <ellipse cx="760" cy="850" rx="320" ry="36" fill="none" stroke="#2f5352" stroke-width="4" stroke-dasharray="10 8"/>
  <g class="apt-obj apt-decor" data-quip="sofa" tabindex="0" role="button" aria-label="The sofa">
    <path d="M470 724 q0 -86 80 -86 h400 q80 0 80 86z" fill="#a83f4f"/>
    <rect x="452" y="716" width="616" height="74" rx="24" fill="#c4505e"/>
    <rect x="440" y="690" width="60" height="110" rx="26" fill="#a83f4f"/><rect x="1020" y="690" width="60" height="110" rx="26" fill="#a83f4f"/>
    <rect x="520" y="676" width="80" height="56" rx="16" fill="#f2c14e" transform="rotate(-8 560 704)"/>
  </g>
  <g class="apt-obj apt-decor" data-quip="chess" tabindex="0" role="button" aria-label="The chessboard">
    <rect class="apt-hit" x="590" y="760" width="340" height="140"/>
    <rect x="600" y="818" width="320" height="16" rx="4" fill="#5b3420"/>
    <path d="M620 834 v54 M900 834 v54" stroke="#5b3420" stroke-width="10"/>
    <g transform="translate(690 790)">
      <path d="M0 28 L18 0 H122 L140 28Z" fill="#fff4d6"/>
      ${Array.from({ length: 32 }, (_, k) => {
        const row = Math.floor(k / 8);
        const col = k % 8;
        if ((row + col) % 2 === 0) return '';
        const y = row * 7;
        const inset = 18 - row * 4.5;
        const w = (140 - 2 * inset) / 8;
        return `<rect x="${inset + col * w}" y="${y}" width="${w}" height="7" fill="#7a4a29"/>`;
      }).join('')}
      <path d="M40 10 v-14 h6 v14z M44 -6 a5 5 0 1 0 0.1 0" fill="#1d1c1a"/>
      <path d="M92 18 v-16 h7 v16z M95 -1 l-6 -8 h12z" fill="#fffaf0" stroke="#1d1c1a" stroke-width="1.5"/>
      <path d="M70 14 v-12 h6 v12z" fill="#1d1c1a"/>
    </g>
    <rect x="820" y="800" width="20" height="18" rx="3" fill="#e8553f"/>
  </g>

  <!-- television: an easter egg -->
  <g class="apt-obj apt-decor" data-action="tv" tabindex="0" role="button" aria-label="The television: change the channel">
    <rect x="1160" y="780" width="200" height="100" fill="#5b3420"/>
    <path d="M1236 640 l-30 -50 M1284 640 l34 -56" stroke="#2a2a2a" stroke-width="3"/>
    <rect x="1180" y="640" width="190" height="140" rx="14" fill="#8a5530"/>
    <rect x="1196" y="658" width="134" height="100" rx="14" fill="#111"/>
    <g clip-path="url(#apt-tv-clip)" class="apt-tv">
      <g class="apt-ch apt-ch-bars">${['#fff4d6', '#f2c14e', '#7fd6e0', '#7cc47a', '#d070c8', '#e8553f', '#4f7ac9'].map((c, i) => `<rect x="${1196 + i * 19.2}" y="658" width="19.4" height="74" fill="${c}"/>`).join('')}<rect x="1196" y="732" width="134" height="26" fill="#1d1c1a"/></g>
      <g class="apt-ch apt-ch-static"><rect x="1196" y="658" width="134" height="100" fill="#777"/>${Array.from({ length: 70 }, (_, i) => `<rect x="${1196 + ((i * 37) % 134)}" y="${658 + ((i * 53) % 100)}" width="${4 + (i % 5) * 3}" height="2" fill="${i % 2 ? '#eee' : '#333'}"/>`).join('')}</g>
      <g class="apt-ch apt-ch-standby"><rect x="1196" y="658" width="134" height="100" fill="#2d3a5c"/><text x="1263" y="700" text-anchor="middle" class="apt-tv-text">PLEASE STAND BY</text><text x="1263" y="720" text-anchor="middle" class="apt-tv-small">the laugh track is on a break</text></g>
      <g class="apt-ch apt-ch-chess"><rect x="1196" y="658" width="134" height="100" fill="#14301f"/><text x="1263" y="700" text-anchor="middle" class="apt-tv-text">CHESS, LIVE</text><text x="1263" y="720" text-anchor="middle" class="apt-tv-small">move 31. still thinking.</text></g>
    </g>
    <circle cx="1350" cy="680" r="7" fill="#d9cfb4"/><circle cx="1350" cy="704" r="7" fill="#d9cfb4"/>
  </g>

  <!-- plant -->
  <g class="apt-obj apt-decor" data-quip="plant" tabindex="0" role="button" aria-label="A plant">
    <path d="M286 900 l10 -80 h60 l10 80z" fill="#c9774a"/>
    <path d="M326 820 q-50 -60 -30 -130 M326 820 q10 -80 50 -120 M326 820 q-20 -50 10 -90 M326 820 q40 -30 70 -40" stroke="#3d8a6b" stroke-width="12" fill="none" stroke-linecap="round"/>
  </g>

  <rect class="apt-night" width="1600" height="900"/>
  <ellipse class="apt-night-glow" cx="826" cy="430" rx="160" ry="110" fill="url(#apt-glow)"/>
  <ellipse class="apt-night-glow" cx="1224" cy="400" rx="120" ry="90" fill="url(#apt-glow)" opacity=".5"/>
</svg>`;
}

let api;
let el;
let room;
let label;
let bubble;
let remote;
let current = 'home';
let reading = false;
let channel = 0;
let bubbleTimer;
let chessTimer;
let cleanup = [];

function on(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  cleanup.push(() => target.removeEventListener(type, fn, opts));
}

function objFor(section) {
  return room.querySelector(`.apt-obj[data-section="${section}"]`);
}

function showLabel(obj) {
  const section = obj.dataset.section;
  if (!section) return hideLabel();
  const place = PLACES[section];
  let extra = '';
  if (section === 'library' && api.data.bookCount) extra = ` · ${api.data.bookCount} books`;
  if (section === 'writing' && api.data.essays.length) extra = ` · ${api.data.essays.length} essays`;
  label.innerHTML = '';
  const b = document.createElement('b');
  b.textContent = place.name;
  label.append(b, place.what + extra);
  const r = obj.querySelector('.apt-hit')?.getBoundingClientRect() || obj.getBoundingClientRect();
  const x = Math.min(innerWidth - 120, Math.max(120, r.left + r.width / 2));
  label.style.left = x + 'px';
  label.style.top = Math.max(70, r.top) + 'px';
  label.hidden = false;
}
function hideLabel() {
  label.hidden = true;
}

function say(obj, text, ms = 3600) {
  const r = obj.getBoundingClientRect();
  bubble.textContent = text;
  bubble.style.left = Math.min(innerWidth - 170, Math.max(170, r.left + r.width / 2)) + 'px';
  bubble.style.top = Math.max(80, r.top + 10) + 'px';
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
  if (obj.dataset.action === 'music') {
    api.toggleMusic();
    setTimeout(() => say(obj, api.musicPlaying() ? 'Side A: “Brushes on a Tuesday”.' : 'Needle up.', 2200), 80);
  }
  if (obj.dataset.action === 'tv') {
    channel = (channel + 1) % TV.length;
    room.dataset.channel = TV[channel];
    api.sfx('egg');
  }
}

function frame() {
  // While a page is open, slide the room so the object it came from stays in view.
  const svgEl = room.querySelector('.apt-svg');
  const narrow = innerWidth <= 760;
  let dx = 0;
  if (reading && !narrow && current !== 'home') {
    const obj = objFor(current);
    const rr = api.readerRect();
    if (obj && rr) {
      const hit = obj.querySelector('.apt-hit') || obj;
      const or = hit.getBoundingClientRect();
      const offset = Number(room.dataset.dx || 0);
      const centre = or.left + or.width / 2 - offset;
      const freeCentre = rr.left / 2;
      dx = Math.min(0, Math.max(-(innerWidth - rr.left + 40), freeCentre - centre));
    }
  }
  room.dataset.dx = String(dx);
  svgEl.style.transform = narrow ? '' : `translateX(${dx}px)`;
  if (narrow) {
    // pan the set so the place in question is centred
    const obj = current !== 'home' && objFor(current);
    const target = obj ? (obj.querySelector('.apt-hit') || obj).getBoundingClientRect() : null;
    const left = target ? room.scrollLeft + target.left + target.width / 2 - innerWidth / 2 : (room.scrollWidth - innerWidth) / 2;
    room.scrollTo({ left, behavior: api.reduceMotion ? 'auto' : 'smooth' });
  }
}

const world = {
  id: 'apartment',

  async mount(stage, worldApi) {
    api = worldApi;
    cleanup = [];
    el = document.createElement('div');
    el.className = 'apt';
    el.innerHTML = `
      <div class="apt-room" data-channel="bars">${svg()}</div>
      <header class="apt-title"><p class="apt-name">Apartment 404</p><p class="apt-tag">Click anything. Most things are something.</p></header>
      <p class="apt-label" hidden></p>
      <p class="apt-bubble" role="status" hidden></p>
      <nav class="apt-remote" aria-label="Apartment 404: rooms">
        ${Object.entries(PLACES)
          .map(([id, p], i) => `<button type="button" data-go="${id}" style="--b:${['#e8553f', '#f2c14e', '#4f7ac9', '#3d8a6b', '#d070c8', '#fff4d6'][i]}"><span class="apt-btn" aria-hidden="true"></span>${p.what}</button>`)
          .join('')}
      </nav>`;
    stage.appendChild(el);
    room = el.querySelector('.apt-room');
    label = el.querySelector('.apt-label');
    bubble = el.querySelector('.apt-bubble');
    remote = el.querySelector('.apt-remote');
    world.setTheme(api.theme());

    room.querySelectorAll('.apt-obj').forEach((obj) => {
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
    remote.querySelectorAll('[data-go]').forEach((b) => on(b, 'click', () => api.go(b.dataset.go)));
    on(window, 'resize', frame);
    on(document, 'site:music', (e) => room.classList.toggle('is-playing', e.detail.playing));
    room.classList.toggle('is-playing', api.musicPlaying());
  },

  show(section) {
    current = section;
    room.querySelectorAll('.apt-obj.is-active').forEach((o) => o.classList.remove('is-active'));
    const obj = section !== 'home' && objFor(section);
    if (obj) obj.classList.add('is-active');
    remote.querySelectorAll('[data-go]').forEach((b) => b.toggleAttribute('aria-current', b.dataset.go === section));
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
