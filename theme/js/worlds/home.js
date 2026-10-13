// The Unfinished Atlas, with Traveler's Home on it: one world, two scenes.
// The map is the home screen and holds the outward sections (Writing, Work, Projects, Contact).
// Traveler's Home is a cottage on the map; going in zooms the map into the house and the
// cottage opens out of it, holding the personal sections (About, Library).
import map from './atlas.js';
import cottage from './cottage.js';

const INDOORS = new Set(['about', 'library']);
const OUTSIDE = new Set(['writing', 'work', 'projects', 'contact']);
const MS = 950;
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

let api;
let el;
let mapEl;
let homeEl;
let scene = 'map';
let want = null; // which scene the next visit to the overview should land in
let moving = [];
let cleanup = [];
let book = null;
let bookOpener = null;

function on(t, type, fn, o) {
  t.addEventListener(type, fn, o);
  cleanup.push(() => t.removeEventListener(type, fn, o));
}

function settle() {
  moving.forEach((a) => a.cancel());
  moving = [];
  el.classList.remove('is-moving');
  el.dataset.scene = scene;
  mapEl.inert = scene !== 'map';
  homeEl.inert = scene !== 'cottage';
}

// Where the house is on screen, so the zoom goes in through its door.
function houseOnScreen() {
  const hit = mapEl.querySelector('.at-place[data-section="about"] .at-place-hit');
  const W = el.clientWidth;
  const H = el.clientHeight;
  const r = hit && hit.getBoundingClientRect();
  if (!r || !r.width || r.right < 0 || r.left > W || r.bottom < 0 || r.top > H) return { x: W / 2, y: H / 2 };
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* — The songbook: every song, chosen from inside the world — */
function renderBook() {
  if (!book) return;
  const m = api.music;
  const list = book.querySelector('.sb-list');
  list.replaceChildren(
    ...m.list().map((t, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.track = t.id;
      const now = m.playing && m.id === t.id;
      if (now) b.setAttribute('aria-current', 'true');
      b.innerHTML = `<span class="sb-n">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i] || i + 1}</span><span class="sb-t"></span><span class="sb-b"></span>${now ? '<span class="sb-now">playing</span>' : ''}`;
      b.querySelector('.sb-t').textContent = t.title;
      b.querySelector('.sb-b').textContent = t.blurb;
      b.addEventListener('click', () => api.music.playTrack(t.id));
      li.appendChild(b);
      return li;
    })
  );
  book.querySelector('.sb-toggle').textContent = m.playing ? 'Rest the music' : 'Play';
}

function openSongbook(opener) {
  bookOpener = opener || document.activeElement;
  book.hidden = false;
  renderBook();
  (book.querySelector('.sb-list [aria-current]') || book.querySelector('.sb-list button')).focus({ preventScroll: true });
}
function closeSongbook() {
  if (!book || book.hidden) return;
  book.hidden = true;
  if (bookOpener && bookOpener.focus) bookOpener.focus({ preventScroll: true });
}

function setScene(next, { instant = false } = {}) {
  if (next === scene) return;
  const from = scene;
  scene = next;
  if (instant || api.reduceMotion) {
    settle();
    return;
  }
  moving.forEach((a) => a.cancel());
  el.classList.add('is-moving');
  const W = el.clientWidth;
  const H = el.clientHeight;
  const { x, y } = houseOnScreen();
  const far = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
  const opts = { duration: MS, easing: EASE, fill: 'both' };
  const zoomed = `translate(${x}px, ${y}px) scale(3.2) translate(${-x}px, ${-y}px)`;
  const going = from === 'map';
  // the map dives toward the house while the cottage opens out of it as a circle
  const mapFrames = going
    ? [{ transform: 'none', opacity: 1 }, { transform: zoomed, opacity: 1, offset: 0.65 }, { transform: zoomed, opacity: 0 }]
    : [{ transform: zoomed, opacity: 0 }, { transform: zoomed, opacity: 1, offset: 0.35 }, { transform: 'none', opacity: 1 }];
  const homeFrames = going
    ? [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(0px at ${x}px ${y}px)`, offset: 0.3 }, { clipPath: `circle(${far}px at ${x}px ${y}px)` }]
    : [{ clipPath: `circle(${far}px at ${x}px ${y}px)` }, { clipPath: `circle(0px at ${x}px ${y}px)`, offset: 0.7 }, { clipPath: `circle(0px at ${x}px ${y}px)` }];
  const a1 = mapEl.animate(mapFrames, opts);
  const a2 = homeEl.animate(homeFrames, opts);
  moving = [a1, a2];
  a2.finished.then(settle, () => {});
}

const world = {
  id: 'atlas',

  async mount(stage, worldApi) {
    api = worldApi;
    cleanup = [];
    scene = 'map';
    want = null;
    el = document.createElement('div');
    el.className = 'home-world';
    el.dataset.scene = 'map';
    mapEl = document.createElement('div');
    mapEl.className = 'home-scene home-map';
    homeEl = document.createElement('div');
    homeEl.className = 'home-scene home-cottage';
    book = document.createElement('section');
    book.className = 'songbook';
    book.hidden = true;
    book.setAttribute('aria-label', 'Songbook');
    book.innerHTML = `
      <header class="sb-head">
        <p class="sb-title">The Songbook</p>
      </header>
      <ol class="sb-list"></ol>
      <div class="sb-foot">
        <button type="button" class="sb-toggle">Play</button>
        <button type="button" class="sb-next">Next song</button>
        <button type="button" class="sb-close">Close</button>
      </div>`;
    el.append(mapEl, homeEl, book);
    stage.appendChild(el);
    book.querySelector('.sb-toggle').addEventListener('click', () => api.music.toggle());
    book.querySelector('.sb-next').addEventListener('click', () => api.music.next());
    book.querySelector('.sb-close').addEventListener('click', closeSongbook);
    on(document, 'site:music', renderBook);

    const sub = {
      ...api,
      enterHome: () => {
        want = 'cottage';
        api.go('home');
      },
      toMap: () => {
        want = 'map';
        api.go('home');
      },
      openSongbook,
    };
    await map.mount(mapEl, sub);
    await cottage.mount(homeEl, sub);
    settle();

    // Escape in the cottage (no page open) steps back out to the map.
    // Escape closes the songbook first, before anything else hears it.
    on(
      window,
      'keydown',
      (e) => {
        if (e.key !== 'Escape' || !book || book.hidden) return;
        e.stopPropagation();
        closeSongbook();
      },
      true
    );
    on(window, 'keydown', (e) => {
      if (e.key !== 'Escape' || scene !== 'cottage' || api.readerRect()) return;
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      sub.toMap();
    });
  },

  show(section, opts = {}) {
    closeSongbook();
    if (INDOORS.has(section)) {
      cottage.show(section, opts);
      setScene('cottage', opts);
    } else if (OUTSIDE.has(section)) {
      map.show(section, opts);
      setScene('map', opts);
    } else {
      const target = want || scene;
      want = null;
      if (target === 'cottage') cottage.show('home', opts);
      else map.show('home', opts);
      setScene(target, opts);
    }
  },

  setReading(open) {
    map.setReading(open);
    cottage.setReading(open);
  },

  setTheme(theme) {
    map.setTheme(theme);
    cottage.setTheme(theme);
  },

  unmount() {
    moving.forEach((a) => a.cancel());
    moving = [];
    cleanup.forEach((fn) => fn());
    cleanup = [];
    map.unmount();
    cottage.unmount();
    el.remove();
  },
};

export default world;
