// "Candle Hours": a solo lute, picked slowly in A minor at 58 bpm, the way someone
// plays late with the candles low. Original; generated from a fixed seed.
import { rng, pick, sequencer, room, pluck, pluckBuffer } from './kit.js';

export const title = 'Candle Hours';

const BARS = [
  { bass: 45, notes: [57, 60, 64, 69, 64, 60] }, // Am
  { bass: 41, notes: [57, 60, 65, 69, 65, 60] }, // F
  { bass: 48, notes: [55, 60, 64, 67, 64, 60] }, // C
  { bass: 40, notes: [56, 59, 64, 68, 64, 59] }, // E
];
const PATTERNS = [
  [0, 2, 4, 6, 8, 10, 12, 14],
  [0, 3, 6, 8, 11, 14],
  [0, 2, 3, 6, 8, 10, 11, 14],
];

export function play(ctx, out) {
  const r = rng(58);
  const verb = room(ctx, { seconds: 3.4, decay: 2.4, wet: 0.38 });
  const level = ctx.createGain();
  level.gain.value = 6.2;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  const warm = { damp: 0.997, bright: 0.35 };
  BARS.forEach((b) => [b.bass, ...b.notes].forEach((m) => pluckBuffer(ctx, m, warm)));
  let bar = 0;
  let pattern = PATTERNS[0];
  const stop = sequencer(ctx, { bpm: 58, stepsPerBeat: 4, swing: 0.54 }, (step, t) => {
    const s = step % 16;
    if (s === 0) {
      bar = Math.floor(step / 16);
      pattern = pick(r, PATTERNS);
    }
    const B = BARS[bar % 4];
    if (s === 0) pluck(ctx, bus, t, B.bass, 0.7, -0.15, warm);
    if (s === 8 && r() < 0.5) pluck(ctx, bus, t, B.bass + 7, 0.45, -0.15, warm);
    const k = pattern.indexOf(s);
    if (k > 0) {
      // a little human looseness in the timing
      const m = B.notes[k % B.notes.length] + (bar % 8 >= 4 && k === pattern.length - 1 ? 12 : 0);
      pluck(ctx, bus, t + (r() - 0.5) * 0.02, m, 0.38 + r() * 0.15, 0.15, warm);
    }
  });
  return stop;
}
