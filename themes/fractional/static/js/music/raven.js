// "The Raven's Errand": a playful, sneaking tune in C dorian at 112 bpm, swung.
// Plucked staccato bass, a woodblock that keeps looking over its shoulder, and a
// high pizzicato line full of rests. Original; generated from a fixed seed.
import { rng, pick, sequencer, room, pluck, woodblock, motif } from './kit.js';

export const title = 'The Raven’s Errand';

const ROOTS = [48, 48, 51, 46, 48, 53, 51, 55];
const TUNE = [72, 74, 75, 77, 79, 81, 82, 84];

export function play(ctx, out) {
  const r = rng(404);
  const verb = room(ctx, { seconds: 1.6, decay: 3.4, wet: 0.16 });
  const level = ctx.createGain();
  level.gain.value = 6.2;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  const short = { damp: 0.975, bright: 0.6 };
  let bar = 0;
  let phrase = [];
  const stop = sequencer(ctx, { bpm: 112, stepsPerBeat: 4, swing: 0.62 }, (step, t) => {
    const s = step % 16;
    if (s === 0) {
      bar = Math.floor(step / 16);
      if (bar % 2 === 0) phrase = motif(r, { slots: [0, 2, 3, 6, 8, 10, 11, 14], span: TUNE.length, start: 3, lens: [1], keep: 0.5 });
    }
    const root = ROOTS[bar % 8];
    if (s % 4 === 0) pluck(ctx, bus, t, s === 8 ? root + 7 : s === 12 ? root + pick(r, [3, 5, 10]) : root, 0.6, -0.2, short);
    if (s === 6 || s === 14) woodblock(ctx, bus, t, 0.4, s === 6 ? 900 : 760);
    if (s === 15 && r() < 0.3) woodblock(ctx, bus, t, 0.25, 1040);
    if (bar % 8 >= 1 && bar % 8 < 7) {
      const local = (bar % 2) * 16 + s;
      phrase.forEach((n) => n.at === local && pluck(ctx, bus, t, TUNE[n.d], 0.45, 0.25, short));
    }
  });
  return stop;
}
