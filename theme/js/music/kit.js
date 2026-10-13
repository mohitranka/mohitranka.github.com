// A small synthesis kit for the site's three original tracks. Everything is made here,
// in the browser, from oscillators and noise: no samples, no recordings, nothing borrowed.

export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Deterministic randomness, so a track varies bar to bar but stays itself.
export function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = (r, list) => list[Math.floor(r() * list.length)];

const noiseCache = new WeakMap();
export function noise(ctx) {
  if (noiseCache.has(ctx)) return noiseCache.get(ctx);
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  noiseCache.set(ctx, buf);
  return buf;
}

function noiseSource(ctx, t, offset = Math.random() * 1.5) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  src.loop = true;
  src.start(t, offset);
  return src;
}

function env(gain, t, peak, attack, tau) {
  gain.setValueAtTime(0.0001, t);
  gain.linearRampToValueAtTime(peak, t + attack);
  gain.setTargetAtTime(0.0001, t + attack, tau);
}

function filter(ctx, type, freq, q = 0.7) {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

function panner(ctx, pan) {
  if (!ctx.createStereoPanner) return ctx.createGain();
  const p = ctx.createStereoPanner();
  p.pan.value = pan;
  return p;
}

// A room: dry plus a generated impulse response.
export function room(ctx, { seconds = 2.4, decay = 2.8, wet = 0.22 } = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const conv = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  conv.buffer = ir;
  const wetGain = ctx.createGain();
  wetGain.gain.value = wet;
  input.connect(output);
  input.connect(conv).connect(wetGain).connect(output);
  return { input, output };
}

// The clock: calls onStep for every grid step slightly ahead of time.
export function sequencer(ctx, { bpm, stepsPerBeat = 4, swing = 0.5 }, onStep) {
  const stepDur = 60 / bpm / stepsPerBeat;
  let step = 0;
  let next = ctx.currentTime + 0.12;
  const tick = () => {
    // after a long suspension, rejoin the clock instead of rushing to catch up
    if (next < ctx.currentTime - 0.2) next = ctx.currentTime + 0.05;
    while (next < ctx.currentTime + 0.16) {
      const late = stepsPerBeat === 4 && step % 2 === 1 ? stepDur * (swing - 0.5) * 2 : 0;
      onStep(step, next + late, stepDur);
      step++;
      next += stepDur;
    }
  };
  tick();
  const timer = setInterval(tick, 25);
  return () => clearInterval(timer);
}

/* — Instruments — */

// Electric piano / vibes / piano family: two-operator FM with a decaying index.
export function keys(ctx, out, t, midi, dur, vel = 0.5, o = {}) {
  const { index = 1.1, ratio = 1, decay = 0.9, sustain = 0.32, bell = 0.08, release = 0.25, pan = 0, level = 0.2 } = o;
  const f = mtof(midi);
  const car = ctx.createOscillator();
  car.frequency.value = f;
  const mod = ctx.createOscillator();
  mod.frequency.value = f * ratio;
  const depth = ctx.createGain();
  depth.gain.setValueAtTime(f * index * (0.5 + vel), t);
  depth.gain.setTargetAtTime(f * index * 0.08, t, 0.25);
  mod.connect(depth).connect(car.frequency);
  const amp = ctx.createGain();
  const peak = level * vel;
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.linearRampToValueAtTime(peak, t + 0.006);
  amp.gain.setTargetAtTime(peak * sustain, t + 0.006, decay);
  amp.gain.setTargetAtTime(0.0001, t + dur, release);
  const p = panner(ctx, pan);
  car.connect(amp).connect(p).connect(out);
  if (bell > 0) {
    const tine = ctx.createOscillator();
    tine.frequency.value = f * 4;
    const tg = ctx.createGain();
    env(tg.gain, t, peak * bell * 3, 0.002, 0.05);
    tine.connect(tg).connect(p);
    tine.start(t);
    tine.stop(t + 0.5);
  }
  const end = t + dur + release * 6;
  car.start(t);
  mod.start(t);
  car.stop(end);
  mod.stop(end);
}

// Warm electric bass for the city.
export function bass(ctx, out, t, midi, dur, vel = 0.6) {
  const f = mtof(midi);
  const a = ctx.createOscillator();
  a.type = 'sine';
  a.frequency.value = f;
  const b = ctx.createOscillator();
  b.type = 'triangle';
  b.frequency.value = f;
  const lp = filter(ctx, 'lowpass', 520, 1.2);
  const amp = ctx.createGain();
  const peak = 0.34 * vel;
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.linearRampToValueAtTime(peak, t + 0.012);
  amp.gain.setTargetAtTime(peak * 0.55, t + 0.012, 0.3);
  amp.gain.setTargetAtTime(0.0001, t + dur, 0.06);
  const bg = ctx.createGain();
  bg.gain.value = 0.5;
  a.connect(lp);
  b.connect(bg).connect(lp);
  lp.connect(amp).connect(out);
  [a, b].forEach((o) => {
    o.start(t);
    o.stop(t + dur + 0.5);
  });
}

// Upright bass: a plucked, woody note with a quick filter close.
export function upright(ctx, out, t, midi, dur, vel = 0.6) {
  const f = mtof(midi);
  const a = ctx.createOscillator();
  a.type = 'triangle';
  a.frequency.setValueAtTime(f * 1.012, t);
  a.frequency.exponentialRampToValueAtTime(f, t + 0.04);
  const s = ctx.createOscillator();
  s.frequency.value = f;
  const lp = filter(ctx, 'lowpass', 1600, 2);
  lp.frequency.setValueAtTime(1700, t);
  lp.frequency.setTargetAtTime(380, t, 0.06);
  const amp = ctx.createGain();
  const peak = 0.42 * vel;
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.linearRampToValueAtTime(peak, t + 0.005);
  amp.gain.setTargetAtTime(peak * 0.25, t + 0.005, 0.22);
  amp.gain.setTargetAtTime(0.0001, t + dur, 0.05);
  a.connect(lp);
  s.connect(lp);
  lp.connect(amp).connect(out);
  [a, s].forEach((o) => {
    o.start(t);
    o.stop(t + dur + 0.4);
  });
}

export function kick(ctx, out, t, vel = 0.8) {
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(118, t);
  o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
  const g = ctx.createGain();
  env(g.gain, t, 0.75 * vel, 0.003, 0.1);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.6);
}

export function snare(ctx, out, t, vel = 0.6, { tone = 185, bright = 1800 } = {}) {
  const n = noiseSource(ctx, t);
  const bp = filter(ctx, 'bandpass', bright, 0.8);
  const g = ctx.createGain();
  env(g.gain, t, 0.32 * vel, 0.002, 0.055);
  n.connect(bp).connect(g).connect(out);
  n.stop(t + 0.4);
  const o = ctx.createOscillator();
  o.type = 'triangle';
  o.frequency.value = tone;
  const og = ctx.createGain();
  env(og.gain, t, 0.22 * vel, 0.002, 0.035);
  o.connect(og).connect(out);
  o.start(t);
  o.stop(t + 0.3);
}

export function hat(ctx, out, t, vel = 0.4, open = false, pan = 0.25) {
  const n = noiseSource(ctx, t);
  const hp = filter(ctx, 'highpass', 7200);
  const g = ctx.createGain();
  env(g.gain, t, 0.13 * vel, 0.001, open ? 0.11 : 0.018);
  n.connect(hp).connect(g).connect(panner(ctx, pan)).connect(out);
  n.stop(t + (open ? 0.7 : 0.2));
}

// Brushes: a swish across the beat and a soft tap.
export function swish(ctx, out, t, len, vel = 0.4, pan = -0.2) {
  const n = noiseSource(ctx, t);
  const bp = filter(ctx, 'bandpass', 2600, 0.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.05 * vel, t + len * 0.55);
  g.gain.linearRampToValueAtTime(0.0001, t + len);
  n.connect(bp).connect(g).connect(panner(ctx, pan)).connect(out);
  n.stop(t + len + 0.05);
}
export function tap(ctx, out, t, vel = 0.5) {
  const n = noiseSource(ctx, t);
  const bp = filter(ctx, 'bandpass', 3400, 0.9);
  const g = ctx.createGain();
  env(g.gain, t, 0.2 * vel, 0.002, 0.045);
  n.connect(bp).connect(g).connect(out);
  n.stop(t + 0.3);
}

// Ride cymbal from six detuned square waves, the classic metallic recipe.
const RIDE = [205.3, 304.4, 369.6, 522.7, 540, 800];
export function ride(ctx, out, t, vel = 0.4, pan = 0.35) {
  const hp = filter(ctx, 'highpass', 6500);
  const bp = filter(ctx, 'bandpass', 9000, 0.6);
  const g = ctx.createGain();
  env(g.gain, t, 0.07 * vel, 0.002, 0.32);
  RIDE.forEach((f) => {
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = f * 1.7;
    o.connect(bp);
    o.start(t);
    o.stop(t + 1.4);
  });
  bp.connect(hp).connect(g).connect(panner(ctx, pan)).connect(out);
}

export function woodblock(ctx, out, t, vel = 0.5, pitch = 880) {
  const o = ctx.createOscillator();
  o.frequency.value = pitch;
  const o2 = ctx.createOscillator();
  o2.type = 'triangle';
  o2.frequency.value = pitch * 1.48;
  const g = ctx.createGain();
  env(g.gain, t, 0.18 * vel, 0.001, 0.028);
  o.connect(g);
  o2.connect(g);
  g.connect(panner(ctx, 0.4)).connect(out);
  [o, o2].forEach((x) => {
    x.start(t);
    x.stop(t + 0.25);
  });
}

// Plucked string by Karplus–Strong, rendered once per pitch and reused.
const ksCache = new WeakMap();
export function pluckBuffer(ctx, midi, { seconds = 2.6, damp = 0.996 } = {}) {
  let byPitch = ksCache.get(ctx);
  if (!byPitch) ksCache.set(ctx, (byPitch = new Map()));
  if (byPitch.has(midi)) return byPitch.get(midi);
  const sr = ctx.sampleRate;
  const n = Math.max(2, Math.round(sr / mtof(midi)));
  const len = Math.floor(sr * seconds);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const line = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    // soften the excitation so the pluck sounds like gut, not wire
    prev = prev * 0.5 + (Math.random() * 2 - 1) * 0.5;
    line[i] = prev;
  }
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const cur = line[idx];
    const nx = line[(idx + 1) % n];
    d[i] = cur;
    line[idx] = damp * 0.5 * (cur + nx);
    idx = (idx + 1) % n;
  }
  byPitch.set(midi, buf);
  return buf;
}
export function pluck(ctx, out, t, midi, vel = 0.5, pan = 0) {
  const src = ctx.createBufferSource();
  src.buffer = pluckBuffer(ctx, midi);
  const g = ctx.createGain();
  g.gain.value = 0.42 * vel;
  src.connect(g).connect(panner(ctx, pan)).connect(out);
  src.start(t);
}

// A slow pad: detuned saws under a soft lowpass.
export function pad(ctx, out, t, midis, dur, vel = 0.4, { cutoff = 900 } = {}) {
  const lp = filter(ctx, 'lowpass', cutoff, 0.6);
  const g = ctx.createGain();
  const peak = 0.05 * vel;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + Math.min(1.6, dur * 0.4));
  g.gain.setValueAtTime(peak, t + dur);
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.8);
  midis.forEach((m) => {
    [-7, 7].forEach((cents) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = mtof(m);
      o.detune.value = cents;
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 2);
    });
  });
  lp.connect(g).connect(out);
}

// A breathy wooden flute.
export function flute(ctx, out, t, midi, dur, vel = 0.5) {
  const f = mtof(midi);
  const o = ctx.createOscillator();
  o.frequency.value = f;
  const vib = ctx.createOscillator();
  vib.frequency.value = 4.8;
  const vg = ctx.createGain();
  vg.gain.setValueAtTime(0, t);
  vg.gain.linearRampToValueAtTime(f * 0.004, t + Math.min(0.5, dur));
  vib.connect(vg).connect(o.frequency);
  const g = ctx.createGain();
  const peak = 0.11 * vel;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.09);
  g.gain.setValueAtTime(peak * 0.85, t + dur);
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.18);
  o.connect(g).connect(out);
  const n = noiseSource(ctx, t);
  const bp = filter(ctx, 'bandpass', f * 2, 2);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.linearRampToValueAtTime(0.025 * vel, t + 0.05);
  ng.gain.setTargetAtTime(0.006 * vel, t + 0.05, 0.1);
  ng.gain.setTargetAtTime(0.0001, t + dur, 0.06);
  n.connect(bp).connect(ng).connect(out);
  const end = t + dur + 0.4;
  [o, vib].forEach((x) => {
    x.start(t);
    x.stop(end);
  });
  n.stop(end);
}

export function frameDrum(ctx, out, t, vel = 0.5) {
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(96, t);
  o.frequency.exponentialRampToValueAtTime(64, t + 0.2);
  const g = ctx.createGain();
  env(g.gain, t, 0.4 * vel, 0.006, 0.16);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 1);
  const n = noiseSource(ctx, t);
  const lp = filter(ctx, 'lowpass', 520);
  const ng = ctx.createGain();
  env(ng.gain, t, 0.12 * vel, 0.003, 0.05);
  n.connect(lp).connect(ng).connect(out);
  n.stop(t + 0.4);
}

// Beds that loop under a track: vinyl crackle, city hum, wind.
export function crackle(ctx, out, level = 0.05) {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * 0.012;
    if (Math.random() < 0.0006) d[i] += (Math.random() * 2 - 1) * 0.8;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const bp = filter(ctx, 'bandpass', 2400, 0.4);
  const g = ctx.createGain();
  g.gain.value = level;
  src.connect(bp).connect(g).connect(out);
  src.start();
  return () => src.stop();
}

export function hum(ctx, out, level = 0.02, cutoff = 260) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  src.loop = true;
  const lp = filter(ctx, 'lowpass', cutoff, 0.5);
  const g = ctx.createGain();
  g.gain.value = level;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lg = ctx.createGain();
  lg.gain.value = level * 0.5;
  lfo.connect(lg).connect(g.gain);
  src.connect(lp).connect(g).connect(out);
  src.start();
  lfo.start();
  return () => {
    src.stop();
    lfo.stop();
  };
}
