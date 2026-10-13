// "The Long Road North": a walking march at 92 bpm in A mixolydian. Drones on A and E,
// a reed chanter tune, and a frame drum and a light snare keeping the step.
// Original; generated from a fixed seed.
import { rng, sequencer, room, drone, chanter, frameDrum, snare, motif } from './kit.js';

export const title = 'The Long Road North';

const TUNE = [64, 66, 67, 69, 71, 73, 74, 76, 78, 79];

export function play(ctx, out) {
  const r = rng(1314);
  const verb = room(ctx, { seconds: 2.4, decay: 2.8, wet: 0.24 });
  const level = ctx.createGain();
  level.gain.value = 2.9;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  let bar = 0;
  let a = [];
  let b = [];
  const stop = sequencer(ctx, { bpm: 92, stepsPerBeat: 4, swing: 0.5 }, (step, t, sd) => {
    const s = step % 16;
    if (s === 0) {
      bar = Math.floor(step / 16);
      if (bar % 8 === 0) {
        drone(ctx, bus, t, [33, 45, 52], sd * 128, 0.9);
        a = motif(r, { slots: [0, 4, 6, 8, 12, 14, 16, 20, 24, 26, 28], span: TUNE.length, start: 3, lens: [2, 2, 4, 6], keep: 0.8 });
        b = motif(r, { slots: [0, 2, 4, 8, 10, 12, 16, 18, 20, 24, 28], span: TUNE.length, start: 6, lens: [2, 4], keep: 0.8 });
      }
    }
    if (s === 0 || s === 8) frameDrum(ctx, bus, t, s === 0 ? 0.75 : 0.5);
    if (s === 4 || s === 12) snare(ctx, bus, t, 0.22, { tone: 210, bright: 2600 });
    if (s === 14 && r() < 0.4) snare(ctx, bus, t, 0.12, { tone: 210, bright: 2600 });
    if (bar % 8 >= 1) {
      const phrase = bar % 8 < 5 ? a : b;
      const local = (bar % 2) * 16 + s;
      phrase.forEach((n) => n.at === local && chanter(ctx, bus, t, TUNE[n.d], n.len * sd * 0.92, 0.6));
    }
  });
  return stop;
}
