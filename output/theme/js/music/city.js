// "Night Bus to Nowhere Nagar": Side Quest City's track. Lo-fi jazz at 82 bpm:
// a ii–V–I turnaround in F on a soft electric piano, a round bass, lazy swung drums,
// vinyl dust and the city humming under it. The melody is generated from a fixed
// seed inside each chord's own notes, so it is the same tune every evening.
import { rng, pick, sequencer, room, keys, bass, kick, snare, hat, crackle, hum } from './kit.js';

export const title = 'Night Bus to Nowhere Nagar';

// Eight bars: Gm9 C13 Fmaj9 Dm9 | Gm9 C13 Am7 D7(b9)
const BARS = [
  { root: 43, chord: [58, 62, 65, 69], tune: [70, 72, 74, 77, 79, 81] },
  { root: 48, chord: [58, 62, 64, 69], tune: [69, 72, 74, 76, 79, 81] },
  { root: 41, chord: [57, 60, 64, 67], tune: [69, 72, 74, 76, 77, 79] },
  { root: 38, chord: [53, 57, 60, 64], tune: [69, 72, 74, 76, 77, 81] },
  { root: 43, chord: [58, 62, 65, 69], tune: [70, 72, 74, 77, 79, 81] },
  { root: 48, chord: [58, 62, 64, 69], tune: [69, 72, 74, 76, 79, 81] },
  { root: 45, chord: [55, 60, 64, 67], tune: [67, 69, 72, 74, 76, 79] },
  { root: 38, chord: [54, 57, 60, 63], tune: [66, 69, 72, 74, 75, 78] },
];

const COMP = [
  [[0, 6, 0.55], [6, 4, 0.38], [10, 6, 0.45]],
  [[0, 10, 0.55], [12, 3, 0.32]],
  [[2, 4, 0.5], [8, 8, 0.48]],
  [[0, 3, 0.5], [3, 5, 0.42], [11, 5, 0.4]],
];

export function play(ctx, out) {
  const r = rng(82);
  const verb = room(ctx, { seconds: 1.8, decay: 3.2, wet: 0.18 });
  const lofi = ctx.createBiquadFilter();
  lofi.type = 'lowpass';
  lofi.frequency.value = 3600;
  verb.output.connect(lofi).connect(out);
  const bus = verb.input;
  const drums = ctx.createGain();
  drums.gain.value = 0.8;
  drums.connect(lofi);

  const stopDust = crackle(ctx, out, 0.05);
  const stopHum = hum(ctx, out, 0.018, 240);

  let bar = 0;
  let comp = COMP[0];
  let motif = null;

  function newMotif() {
    const slots = [0, 3, 6, 8, 10, 14].filter(() => r() < 0.55);
    if (!slots.length) slots.push(0, 6);
    let i = Math.floor(r() * 3) + 1;
    return slots.map((s) => {
      i = Math.max(0, Math.min(5, i + pick(r, [-1, 0, 1, 1, 2, -2])));
      return { step: s, deg: i, len: pick(r, [2, 3, 4, 6]) };
    });
  }

  const stop = sequencer(ctx, { bpm: 82, stepsPerBeat: 4, swing: 0.6 }, (step, t, sd) => {
    const s = step % 16;
    if (s === 0) {
      bar = Math.floor(step / 16);
      comp = pick(r, COMP);
      if (bar % 4 === 0) motif = newMotif();
    }
    // a 32-bar form: intro, groove, groove with melody, a two-bar breath
    const form = bar < 4 ? 'intro' : (bar - 4) % 28;
    const section = form === 'intro' ? 'intro' : form < 12 ? 'groove' : form < 24 ? 'melody' : form < 26 ? 'break' : 'groove';
    const B = BARS[bar % 8];
    const next = BARS[(bar + 1) % 8];

    comp.forEach(([at, len, v]) => {
      if (at !== s) return;
      B.chord.forEach((m, k) => keys(ctx, bus, t + k * 0.012, m, len * sd, v * (0.85 + r() * 0.3), { pan: (k - 1.5) * 0.12, level: 0.13 }));
    });

    if (section !== 'break') {
      if (s === 0) bass(ctx, bus, t, B.root, sd * 5, 0.75);
      if (s === 8 && r() < 0.7) bass(ctx, bus, t, B.root + 7, sd * 4, 0.55);
      if (s === 12) bass(ctx, bus, t, B.root + 12, sd * 2, 0.45);
      if (s === 14) bass(ctx, bus, t, next.root + (r() < 0.5 ? 1 : -1), sd * 2, 0.5);
    }

    if (section === 'groove' || section === 'melody') {
      if (s === 0 || s === 10 || (s === 7 && r() < 0.3)) kick(ctx, drums, t, s === 0 ? 0.85 : 0.6);
      if (s === 4 || s === 12) snare(ctx, drums, t, 0.55, { tone: 170, bright: 1500 });
      if (s === 15 && r() < 0.25) snare(ctx, drums, t, 0.18, { tone: 170, bright: 1500 });
      if (s % 2 === 0) hat(ctx, drums, t, s % 4 === 0 ? 0.5 : 0.32, s === 14 && r() < 0.3);
    }
    if (section === 'intro' && s % 4 === 0 && bar > 1) hat(ctx, drums, t, 0.25);

    if (section === 'melody' && motif && bar % 4 < 3) {
      motif.forEach((n) => {
        if (n.step !== s) return;
        keys(ctx, bus, t, B.tune[n.deg] + 12, n.len * sd, 0.42, { index: 0.5, ratio: 4, decay: 0.6, sustain: 0.2, bell: 0.3, pan: 0.2, level: 0.11 });
      });
    }
  });

  return () => {
    stop();
    stopDust();
    stopHum();
  };
}
