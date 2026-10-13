// "The Ferryman's Waltz": an unhurried 3/4 in G major at 92 bpm. Plucked bass on one,
// soft chords on two and three, and a flute that rows the tune across.
// Original; generated from a fixed seed.
import { rng, sequencer, room, pluck, pad, flute, motif } from './kit.js';

export const title = 'The Ferryman’s Waltz';

const BARS = [
  { bass: 43, chord: [59, 62, 67] }, // G
  { bass: 40, chord: [59, 64, 67] }, // Em
  { bass: 48, chord: [60, 64, 67] }, // C
  { bass: 50, chord: [62, 66, 69] }, // D
];
const TUNE = [67, 69, 71, 72, 74, 76, 78, 79];

export function play(ctx, out) {
  const r = rng(392);
  const verb = room(ctx, { seconds: 2.8, decay: 2.6, wet: 0.3 });
  const level = ctx.createGain();
  level.gain.value = 3.1;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  let bar = 0;
  let phrase = [];
  // 6 steps a bar: three beats of two eighths
  const stop = sequencer(ctx, { bpm: 92, stepsPerBeat: 2 }, (step, t, sd) => {
    const s = step % 6;
    if (s === 0) {
      bar = Math.floor(step / 6);
      if (bar % 4 === 0) phrase = motif(r, { slots: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], span: TUNE.length, start: 3, lens: [2, 2, 4, 6], keep: 0.6 });
      if (bar % 4 === 0) pad(ctx, bus, t, [55, 62], sd * 24, 0.5, { cutoff: 600 });
    }
    const B = BARS[bar % 4];
    if (s === 0) pluck(ctx, bus, t, B.bass, 0.7, -0.2);
    if (s === 2 || s === 4) B.chord.forEach((m, k) => pluck(ctx, bus, t + k * 0.01, m, 0.28, 0.15));
    if (bar >= 4 && bar % 16 < 14) {
      const local = (bar % 4) * 6 + s;
      phrase.forEach((n) => n.at === local && flute(ctx, bus, t, TUNE[n.d], n.len * sd * 0.95, 0.55));
    }
  });
  return stop;
}
