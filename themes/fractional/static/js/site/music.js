// Music: off until the visitor presses play. One AudioContext, created on that press;
// each world's track loads only when it is needed, crossfades when the world changes,
// dips while a page is open in the reader, and pauses while the tab is hidden.
import * as prefs from './prefs.js';

const TRACKS = {
  city: () => import('../music/city.js'),
  apartment: () => import('../music/apartment.js'),
  atlas: () => import('../music/atlas.js'),
};
const FADE = 1.6;

export function createMusic({ hud }) {
  const box = hud && hud.querySelector('#music');
  const button = box && box.querySelector('.music-toggle');
  const label = box && box.querySelector('.music-label');
  const trackEl = box && box.querySelector('.music-track');
  const slider = box && box.querySelector('input[type="range"]');
  const bars = box ? [...box.querySelectorAll('.music-bars i')] : [];

  let ctx = null;
  let master, duck, analyser;
  let playing = false;
  let world = 'read';
  let voice = null; // { world, gain, stop }
  let titles = {};
  let volume = Math.min(1, Math.max(0, Number(prefs.get('volume')) || 0.35));
  let raf = 0;

  const gainFor = (v) => Math.pow(v, 1.6) * 0.9;

  function ensureContext() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = gainFor(volume);
    duck = ctx.createGain();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    duck.connect(master).connect(analyser).connect(ctx.destination);
  }

  async function startVoice(id) {
    if (!TRACKS[id]) return;
    const mod = await TRACKS[id]();
    titles[id] = mod.title;
    renderLabel();
    if (!playing || world !== id || (voice && voice.world === id)) return;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + FADE);
    gain.connect(duck);
    voice = { world: id, gain, stop: mod.play(ctx, gain) };
  }

  function stopVoice() {
    if (!voice) return;
    const v = voice;
    voice = null;
    const now = ctx.currentTime;
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setValueAtTime(v.gain.gain.value, now);
    v.gain.gain.linearRampToValueAtTime(0.0001, now + FADE);
    setTimeout(() => {
      v.stop();
      v.gain.disconnect();
    }, FADE * 1000 + 100);
  }

  function renderLabel() {
    if (!box) return;
    box.classList.toggle('is-on', playing);
    document.dispatchEvent(new CustomEvent('site:music', { detail: { playing } }));
    button.setAttribute('aria-pressed', String(playing));
    const name = titles[world];
    label.textContent = playing ? name || 'Music' : 'Music off';
    button.setAttribute('aria-label', playing ? `Stop the music (now playing ${name || 'this world’s track'})` : 'Play this world’s music');
    trackEl.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = name ? `“${name}”` : 'This world’s track';
    trackEl.append(b, 'Original, played live by your browser. Nothing is recorded.');
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

  async function play() {
    if (world === 'read' || !TRACKS[world]) return;
    ensureContext();
    await ctx.resume();
    playing = true;
    prefs.set('music', 'on');
    renderLabel();
    cancelAnimationFrame(raf);
    meter();
    await startVoice(world);
  }

  function pause() {
    playing = false;
    prefs.set('music', 'off');
    if (ctx) stopVoice();
    renderLabel();
  }

  if (button) {
    button.addEventListener('click', () => (playing ? pause() : play()));
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') box.classList.remove('is-open');
    });
  }
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

  // Track names are known before anything plays, so the panel can say what is waiting.
  async function learnTitle(id) {
    if (!TRACKS[id] || titles[id]) return;
    try {
      titles[id] = (await TRACKS[id]()).title;
    } catch (e) {
      /* the label falls back to a generic name */
    }
    renderLabel();
  }

  return {
    setWorld(id) {
      if (id === world) return;
      world = id;
      renderLabel();
      learnTitle(id);
      if (!ctx || !playing) return;
      stopVoice();
      if (id === 'read') {
        // Just Read is silent; the visitor chose music for a world, not for reading
        playing = false;
        renderLabel();
        return;
      }
      startVoice(id);
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
      return playing ? pause() : play();
    },
    get playing() {
      return playing;
    },
  };
}
