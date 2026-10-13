// The site runtime. Every page is a complete Just Read page first; this module adds
// the theme toggle, the essay outline, and, when the visitor opens it, the Unfinished
// Atlas: the same pages shown as places on a map, with a cottage on it for the
// personal ones. The world, its styles and its music load only when chosen.
import * as prefs from './prefs.js';
import { createRouter } from './router.js';
import { createReader, cleanHtml } from './reader.js';
import { createMusic } from './music.js';

const html = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dataEl = document.getElementById('site-data');
const data = dataEl ? JSON.parse(dataEl.textContent) : null;

// Template URLs are relative to the page that rendered them; pin them now, before
// any history change moves the base.
if (data) {
  const abs = (u) => (u ? new URL(u, location.href).href : u);
  data.root = abs(data.root);
  data.assets = abs(data.assets);
  for (const k of Object.keys(data.sections)) data.sections[k] = abs(data.sections[k]);
  data.essays.forEach((e) => (e.url = abs(e.url)));
  data.books.forEach((b) => (b.cover = abs(b.cover)));
}

export const WORLDS = {
  atlas: {
    title: 'The Unfinished Atlas',
    module: '../worlds/home.js',
    css: ['worlds/atlas.css', 'worlds/cottage.css'],
    places: {
      home: 'The Unfinished Atlas',
      about: 'The front door',
      library: 'The shelves',
      contact: "The messenger's letterbox",
      writing: 'Library of Stories',
      work: 'The Citadel',
      projects: "Craftsman's Forge",
    },
  },
};

/* — Theme — */
function setThemeLabels() {
  const dark = html.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'));
}
document.querySelectorAll('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    prefs.set('theme', next);
    setThemeLabels();
    if (active && active.setTheme) active.setTheme(next);
  })
);
setThemeLabels();

/* — Essay outline (Just Read) — */
let outlineObserver = null;
function buildOutline(root = document) {
  const nav = root.querySelector('[data-outline]');
  const body = root.querySelector('.essay .entry-content');
  if (!nav || !body) return;
  const heads = [...body.querySelectorAll(':scope > h2')];
  if (heads.length < 3) return;
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ol = document.createElement('ol');
  heads.forEach((h) => {
    if (!h.id) h.id = slug(h.textContent);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ol.appendChild(li);
  });
  const label = document.createElement('p');
  label.textContent = 'In this essay';
  nav.replaceChildren(label, ol);
  nav.hidden = false;
  const links = [...ol.querySelectorAll('a')];
  if (outlineObserver) outlineObserver.disconnect();
  const io = (outlineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.removeAttribute('aria-current'));
        links[heads.indexOf(e.target)].setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '0px 0px -70% 0px' }
  ));
  heads.forEach((h) => io.observe(h));
}
buildOutline();

/* — Toast: short, visible notes (a world that cannot run here, a failed load). — */
let toastTimer;
function toast(msg) {
  let t = document.querySelector('.site-toast');
  if (!t) {
    t = document.createElement('p');
    t.className = 'site-toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 5200);
}

/* — Worlds — */
const stage = document.getElementById('world-stage');
const hud = document.getElementById('world-hud');
const curtain = document.getElementById('world-curtain');
const statusEl = document.getElementById('world-status');
const siteMain = document.getElementById('site');
const homeTitle = 'Mohit Ranka';

const router = data ? createRouter(data.root) : null;
const music = createMusic({ hud, assetsUrl: data ? data.assets : '' });
const reader = data ? createReader({ onClose: () => navigate(data.root, { push: true }) }) : null;

let current = 'read'; // the world on screen
let active = null; // its module instance
let busy = false;
let seq = 0; // bumps on every world change; stale async work checks it and stops
let navSeq = 0; // the same for page loads inside a world
let shownSection = 'home';
const loadedUrl = location.href.split('#')[0];
let originalHtml = null; // the page this document was loaded with, kept for Just Read

function loadCss(hrefs) {
  return Promise.all([].concat(hrefs).map(loadOne));
}
function loadOne(href) {
  const url = new URL('../../css/' + href, import.meta.url).href;
  if (document.querySelector(`link[href="${url}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = url;
    l.onload = resolve;
    l.onerror = () => reject(new Error('Could not load ' + href));
    document.head.appendChild(l);
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// The thematic wipe between worlds: each world styles its own curtain in style.css.
async function curtainIn(style) {
  if (reduceMotion) return;
  curtain.dataset.style = style;
  html.classList.add('world-switching');
  curtain.classList.remove('is-out');
  void curtain.offsetWidth;
  curtain.classList.add('is-in');
  await wait(560);
}
async function curtainOut() {
  if (reduceMotion) {
    html.classList.remove('world-switching');
    return;
  }
  curtain.classList.add('is-out');
  await wait(560);
  curtain.classList.remove('is-in', 'is-out');
  html.classList.remove('world-switching');
}

function worldApi(id) {
  return {
    id,
    data,
    reduceMotion,
    coarse: window.matchMedia('(pointer: coarse)').matches,
    theme: () => html.getAttribute('data-theme'),
    go: (section) => navigate(section === 'home' ? data.root : data.sections[section], { push: true }),
    navigate: (url) => navigate(url, { push: true }),
    sfx: (name) => music.sfx(name),
    toggleMusic: () => music.toggle(),
    musicPlaying: () => music.playing,
    musicTitle: () => music.title,
    music,
    toast,
    readerRect: () => (reader.isOpen ? reader.el.getBoundingClientRect() : null),
    section: () => router.sectionFor(location.href),
  };
}

async function enterWorld(id, { initial = false } = {}) {
  const def = WORLDS[id];
  if (!def || busy) return;
  busy = true;
  const my = ++seq;
  const fromRead = current === 'read';
  const readScroll = fromRead ? window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) : reader.scrollFraction();
  try {
    if (!initial) await curtainIn(id);
    const [mod] = await Promise.all([import(def.module), loadCss(def.css)]);
    if (my !== seq) return;
    if (outlineObserver) outlineObserver.disconnect();
    if (active) {
      active.unmount();
      active = null;
    }
    stage.replaceChildren();
    stage.dataset.world = id;
    if (fromRead) {
      // the page this document loaded becomes the reader's first page
      originalHtml = originalHtml ?? siteMain.innerHTML;
      router.remember({ url: loadedUrl, title: document.title, html: cleanHtml(originalHtml), headScripts: [] });
      siteMain.replaceChildren();
    }
    html.classList.remove('world-loading', 'world-atlas');
    html.classList.add('world-on', 'world-' + id);
    html.setAttribute('data-world', id);
    hud.hidden = false;
    stage.removeAttribute('aria-hidden');
    stage.inert = false;
    current = id;
    const world = mod.default;
    await world.mount(stage, worldApi(id));
    if (my !== seq) {
      // the visitor left while this world was still building
      world.unmount();
      return;
    }
    active = world;
    prefs.set('world', id);
    music.setWorld(id);
    music.autostart();
    await show(location.href, { instant: true, scroll: readScroll, focus: !initial });
    statusEl.textContent = `Now in ${def.title}.`;
    if (!initial) {
      music.sfx('enter');
      // the button that opened the world is gone; give focus to the world's own navigation
      if (router.sectionFor(location.href) === 'home') focusPlace('home');
    }
  } catch (err) {
    console.error('[worlds] could not open', id, err);
    toast(`${def.title} did not load. Here is the plain page instead.`);
    await leaveToRead({ silent: true });
  } finally {
    busy = false;
    await curtainOut();
  }
}

async function leaveToRead({ silent = false } = {}) {
  ++seq;
  ++navSeq;
  const target = location.href;
  const fraction = reader && reader.isOpen ? reader.scrollFraction() : 0;
  prefs.set('world', 'read');
  music.setWorld('read');
  if (!silent && current !== 'read') await curtainIn('read');
  if (target.split('#')[0] !== loadedUrl) {
    // the visitor has moved on inside the world: load that page as itself
    prefs.session('read-scroll', fraction);
    location.assign(target);
    return;
  }
  if (active) {
    active.unmount();
    active = null;
  }
  stage.replaceChildren();
  stage.setAttribute('aria-hidden', 'true');
  stage.inert = true;
  reader && reader.reset();
  hud.hidden = true;
  html.classList.remove('world-on', 'world-loading', 'reading', 'world-atlas');
  html.setAttribute('data-world', 'read');
  if (originalHtml !== null) {
    siteMain.innerHTML = cleanHtml(originalHtml);
    siteMain.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      for (const a of old.attributes) s.setAttribute(a.name, a.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
    if (window.initContactForm) window.initContactForm();
    buildOutline();
    bindChoosers(siteMain);
  }
  document.title = originalTitle;
  current = 'read';
  siteMain.focus({ preventScroll: true });
  requestAnimationFrame(() => window.scrollTo(0, fraction * Math.max(0, document.documentElement.scrollHeight - innerHeight)));
  if (!silent) statusEl.textContent = 'Just Read: the plain pages, no world and no music.';
  if (!silent) await curtainOut();
}

const originalTitle = document.title;

// Show a URL inside the current world: the world moves to its place, the reader opens.
function narrow() {
  return innerWidth <= 760;
}

// Put keyboard focus on the place in the world that stands for a section.
function focusPlace(section) {
  // only what is on screen: the room and the map are both mounted, one is inert
  const visible = (sel) => [...stage.querySelectorAll(sel)].find((el) => !el.closest('[inert]'));
  const el =
    section === 'home'
      ? visible('[data-go][aria-current]') || visible('[data-go]') || visible('.atlas')
      : visible(`[data-section="${section}"]`) || visible(`[data-go="${section}"]`);
  if (el) el.focus({ preventScroll: true });
}

async function show(url, { instant = false, scroll = null, focus = true } = {}) {
  const my = ++navSeq;
  const section = router.sectionFor(url) || 'home';
  if (!active) return;
  active.show(section, { instant, url });
  if (section === 'home') {
    const wasOpen = reader.isOpen;
    reader.close();
    stage.inert = false;
    if (wasOpen && focus) focusPlace(shownSection);
    shownSection = 'home';
    active.setReading && active.setReading(false);
    music.setReading(false);
    document.title = homeTitle;
    return;
  }
  let page;
  try {
    page = await router.load(url);
  } catch (err) {
    console.error('[worlds] page failed', url, err);
    toast('That page did not load. Opening it directly instead.');
    location.assign(url);
    return;
  }
  // a later navigation may have overtaken this one
  if (my !== navSeq || current === 'read' || !active) return;
  shownSection = section;
  // each kind of page takes its own form in the world: a scroll, a charter, a ledger…
  reader.el.dataset.section = section;
  await reader.open(page, { url, label: WORLDS[current].places[section], scroll, focus });
  // on phones the reader is a sheet over the world: keep the hidden half out of the tab order
  stage.inert = narrow();
  active.setReading && active.setReading(true);
  music.setReading(true);
  document.title = page.title;
}

async function navigate(url, { push = true } = {}) {
  if (current === 'read' || !active) {
    location.assign(url);
    return;
  }
  const abs = new URL(url, location.href).href;
  const samePage = abs.split('#')[0] === location.href.split('#')[0];
  if (push && abs !== location.href) history.pushState({ world: current }, '', abs);
  if (samePage && reader.isOpen && new URL(abs).hash) {
    reader.scrollToHash(decodeURIComponent(new URL(abs).hash.slice(1)));
    return;
  }
  await show(abs);
  if (typeof window.gtag === 'function') window.gtag('event', 'page_view', { page_location: location.href, page_title: document.title });
}

if (router) {
  document.addEventListener('click', (e) => {
    if (current === 'read' || e.defaultPrevented) return;
    const a = e.target.closest('a');
    if (!a || a.hasAttribute('data-just-read') || !router.isPageLink(a, e)) return;
    e.preventDefault();
    navigate(a.href, { push: true });
  });
  window.addEventListener('popstate', () => {
    if (current !== 'read' && active) show(location.href, { instant: false });
    // history entries pushed inside a world still exist after Just Read: load them for real
    else if (current === 'read' && location.href.split('#')[0] !== loadedUrl) location.reload();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || current === 'read') return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    if (reader.isOpen) navigate(data.root, { push: true });
  });
}

/* — Stepping inside, and back out to Just Read — */
function choose(id) {
  if (id === current || busy) return;
  if (id === 'read') leaveToRead();
  else enterWorld(id);
}

function bindChoosers(scope) {
  scope.querySelectorAll('[data-world-choose]').forEach((b) => {
    b.hidden = false;
    if (b.dataset.boundChoose) return;
    b.dataset.boundChoose = '1';
    b.addEventListener('click', () => choose(b.dataset.worldChoose));
  });
  scope.querySelectorAll('[data-just-read]').forEach((a) => {
    if (a.dataset.boundRead) return;
    a.dataset.boundRead = '1';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      leaveToRead();
    });
  });
}

if (data) {
  bindChoosers(document);

  const asked = new URLSearchParams(location.search).get('world');
  if (asked) prefs.set('world', prefs.normalise(asked));
  const want = prefs.world();
  if (want !== 'read') {
    enterWorld(want, { initial: true });
  } else {
    html.classList.remove('world-loading');
    const back = prefs.session('read-scroll');
    if (back !== null) requestAnimationFrame(() => window.scrollTo(0, Number(back) * Math.max(0, document.documentElement.scrollHeight - innerHeight)));
  }
} else {
  html.classList.remove('world-loading');
}

// Tests and the debug harness reach the runtime here.
if (new URLSearchParams(location.search).has('debug')) {
  window.__site = { enterWorld, leaveToRead, navigate, music, get world() { return current; }, get active() { return active; } };
}
