// Music: eleven original tracks, synthesized in the browser, played as a rotating
// playlist. It is on by default in the world (browsers only allow sound after a click
// or tap, so it begins at the first one), remembers if the visitor turns it off, and is
// always silent in Just Read. Each track plays for a few minutes, then crossfades into
// the next; the songbook in the world and the HUD panel can pick or skip. Music dips
// while a page is open in the reader and pauses while the tab is hidden.
import * as prefs from './prefs.js';

const L = (name) => () => import(`../music/${name}.js`);
export const PLAYLIST = [
  { id: 'atlas', title: 'Lantern Road', blurb: 'Plucked strings and a wooden flute, slow and walking.', load: L('atlas') },
  { id: 'market', title: 'Market Day at the Citadel', blurb: 'A quick dance with drones, drum and reed.', load: L('market') },
  { id: 'candle', title: 'Candle Hours', blurb: 'A solo lute, late, with the candles low.', load: L('candle') },
  { id: 'apartment', title: 'Brushes on a Tuesday', blurb: 'A small jazz trio, brushes and walking bass.', load: L('apartment') },
  { id: 'ferry', title: 'The Ferryman’s Waltz', blurb: 'An unhurried waltz on plucked strings and flute.', load: L('ferry') },
  { id: 'forge', title: 'Forge Rhythm', blurb: 'Anvil, hammered strings, and a reed now and then.', load: L('forge') },
  { id: 'fog', title: 'Fog over Mount Backlog', blurb: 'No beat at all: pads, bells and wind.', load: L('fog') },
  { id: 'raven', title: 'The Raven’s Errand', blurb: 'A sneaking tune in pizzicato and woodblock.', load: L('raven') },
  { id: 'city', title: 'Night Bus to Nowhere Nagar', blurb: 'Lo-fi jazz: soft keys, round bass, vinyl dust.', load: L('city') },
  { id: 'nocturne', title: 'Hearthside Nocturne', blurb: 'Soft keys by the fire.', load: L('nocturne') },
  { id: 'march', title: 'The Long Road North', blurb: 'A walking march with drones and a chanter.', load: L('march') },
];
const FADE = 1.6; // seconds, for play, stop and skip
const CROSSFADE = 4; // seconds, when the rotation moves on by itself
const TURN = 210; // seconds each track plays before the next one

export function createMusic({ hud }) {
  const box = hud && hud.querySelector('#music');
  const button = box && box.querySelector('.music-toggle');
  const label = box && box.querySelector('.music-label');
  const trackEl = box && box.querySelector('.music-track');
  const nextBtn = box && box.querySelector('.music-next');
  const slider = box && box.querySelector('input[type="range"]');
  const bars = box ? [...box.querySelectorAll('.music-bars i')] : [];

  let ctx = null;
  let master, duck, analyser;
  let playing = false;
  let world = 'read';
  let index = 0;
  let voice = null; // { id, gain, stop, started }
  let token = 0; // guards against a slow track load arriving after a skip
  let clock = 0;
  let raf = 0;
  let waitingForGesture = false;
  let volume = Math.min(1, Math.max(0, Number(prefs.get('volume')) || 0.35));

  const gainFor = (v) => Math.pow(v, 1.6) * 0.9;
  const current = () => PLAYLIST[index];
  const upNext = () => PLAYLIST[(index + 1) % PLAYLIST.length];

  function ensureContext() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = gainFor(volume);
    duck = ctx.createGain();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    // a gentle limiter so no track, however lively, peaks harshly
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 8;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.004;
    limiter.release.value = 0.2;
    duck.connect(limiter).connect(master).connect(analyser).connect(ctx.destination);
  }

  // Browsers keep audio suspended until the visitor clicks, taps or types; wait for it.
  function unlockOnGesture() {
    if (!ctx || ctx.state === 'running' || waitingForGesture) return;
    waitingForGesture = true;
    const resume = () => {
      ['pointerdown', 'keydown', 'touchend'].forEach((t) => document.removeEventListener(t, resume, true));
      waitingForGesture = false;
      if (playing && !document.hidden) ctx.resume();
      renderLabel();
    };
    ['pointerdown', 'keydown', 'touchend'].forEach((t) => document.addEventListener(t, resume, true));
  }

  async function startVoice(fade = FADE) {
    const my = ++token;
    const track = current();
    const mod = await track.load();
    if (my !== token || !playing) return;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + fade);
    gain.connect(duck);
    voice = { id: track.id, gain, stop: mod.play(ctx, gain), started: ctx.currentTime };
  }

  function stopVoice(fade = FADE) {
    if (!voice) return;
    const v = voice;
    voice = null;
    const now = ctx.currentTime;
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setValueAtTime(v.gain.gain.value, now);
    v.gain.gain.linearRampToValueAtTime(0.0001, now + fade);
    setTimeout(() => {
      v.stop();
      v.gain.disconnect();
    }, fade * 1000 + 150);
  }

  function changeTo(i, fade) {
    index = (i + PLAYLIST.length) % PLAYLIST.length;
    if (playing && ctx) {
      stopVoice(fade);
      startVoice(fade);
    }
    renderLabel();
  }

  function renderLabel() {
    const name = current().title;
    document.dispatchEvent(new CustomEvent('site:music', { detail: { playing, id: current().id, title: name } }));
    if (!box) return;
    box.classList.toggle('is-on', playing);
    button.setAttribute('aria-pressed', String(playing));
    const pending = playing && ctx && ctx.state !== 'running';
    label.textContent = playing ? name : 'Music off';
    button.setAttribute('aria-label', playing ? `Stop the music (now playing ${name})` : 'Play music');
    trackEl.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = `“${name}”`;
    trackEl.append(b);
    if (pending) trackEl.append('Starts at your first click or tap.');
    if (nextBtn) nextBtn.textContent = `Next: ${upNext().title}`;
  }

  function meter() {
    if (!playing || !analyser) {
      bars.forEach((i) => (i.style.height = '4px'));
      return;
    }
    const d = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(d);
    bars.forEach((i, k) => (i.style.height = 3 + (d[1 + k * 3] / 255) * 9 + 'px'));
    raf = requestAnimationFrame(meter);
  }

  // The rotation runs on the audio clock, which stops while the tab is hidden.
  function watchTurn() {
    clearInterval(clock);
    clock = setInterval(() => {
      if (playing && voice && ctx.currentTime - voice.started > TURN) changeTo(index + 1, CROSSFADE);
    }, 1000);
  }

  function play() {
    if (world === 'read') return;
    ensureContext();
    playing = true;
    ctx.resume().catch(() => {});
    unlockOnGesture();
    renderLabel();
    cancelAnimationFrame(raf);
    meter();
    watchTurn();
    if (!voice) return startVoice();
  }

  // stop sounding; `remember` records the visitor's choice for next time
  function stop(remember) {
    playing = false;
    token++;
    clearInterval(clock);
    if (remember) prefs.set('music', 'off');
    if (ctx) stopVoice();
    renderLabel();
  }

  function userPlay() {
    prefs.set('music', 'on');
    return play();
  }

  if (button) {
    button.addEventListener('click', () => (playing ? stop(true) : userPlay()));
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') box.classList.remove('is-open');
    });
  }
  if (nextBtn) nextBtn.addEventListener('click', () => changeTo(index + 1, FADE));
  if (slider) {
    slider.value = Math.round(volume * 100);
    slider.addEventListener('input', () => {
      volume = slider.value / 100;
      prefs.set('volume', volume);
      if (master) master.gain.setTargetAtTime(gainFor(volume), ctx.currentTime, 0.05);
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
  renderLabel();

  return {
    setWorld(id) {
      if (id === world) return;
      world = id;
      // Just Read is always silent, without forgetting that music was wanted
      if (id === 'read' && playing) stop(false);
      renderLabel();
    },
    // On by default in the world, unless the visitor turned it off before.
    autostart() {
      if (world !== 'read' && !playing && prefs.get('music') !== 'off') play();
    },
    setReading(open) {
      if (duck) duck.gain.setTargetAtTime(open ? 0.5 : 1, ctx.currentTime, 0.4);
    },
    // Small cues share the music's mute: silent unless music is on.
    sfx(name) {
      if (!playing || !ctx) return;
      const notes = { enter: [72, 76, 79], select: [79], egg: [84, 88, 84, 91] }[name] || [79];
      notes.forEach((m, k) => {
        const t = ctx.currentTime + k * 0.07;
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.008);
        g.gain.setTargetAtTime(0.0001, t + 0.008, 0.09);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.6);
      });
    },
    toggle() {
      return playing ? stop(true) : userPlay();
    },
    next() {
      changeTo(index + 1, FADE);
    },
    // Play a particular song from the songbook.
    playTrack(id) {
      const i = PLAYLIST.findIndex((t) => t.id === id);
      if (i < 0) return;
      if (!playing) {
        index = i;
        return userPlay();
      }
      if (i !== index) changeTo(i, FADE);
    },
    list() {
      return PLAYLIST.map(({ id, title, blurb }) => ({ id, title, blurb }));
    },
    get playing() {
      return playing;
    },
    get title() {
      return current().title;
    },
    get id() {
      return current().id;
    },
  };
}
