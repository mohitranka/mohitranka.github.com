// "Market Day at the Citadel": a quick 6/8 dance in D mixolydian at 116 bpm. Drones
// under a plucked chord pattern, a frame drum on the lilt, and a reed tune that trades
// phrases with a flute. Original; generated from a fixed seed.
import { rng, sequencer, room, pluck, frameDrum, drone, chanter, flute, motif } from './kit.js';

export const title = 'Market Day at the Citadel';

const CHORDS = [
  [50, 57, 62, 66], // D
  [48, 55, 60, 64], // C
  [50, 57, 62, 66], // D
  [43, 50, 55, 59], // G
];
const TUNE = [62, 64, 66, 67, 69, 71, 72, 74, 76];

export function play(ctx, out) {
  const r = rng(1203);
  const verb = room(ctx, { seconds: 2, decay: 3, wet: 0.2 });
  const level = ctx.createGain();
  level.gain.value = 1.9;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  let bar = 0;
  let a = null;
  let b = null;
  // 6 steps a bar: two dotted beats of three eighths each
  const stop = sequencer(ctx, { bpm: 116, stepsPerBeat: 3 }, (step, t, sd) => {
    const s = step % 6;
    if (s === 0) {
      bar = Math.floor(step / 6);
      if (bar % 16 === 0) {
        a = motif(r, { slots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], span: TUNE.length, start: 4, lens: [1, 1, 2, 3], keep: 0.75 });
        b = motif(r, { slots: [0, 2, 3, 5, 6, 8, 9, 11], span: TUNE.length, start: 6, lens: [1, 2, 3], keep: 0.7 });
      }
      if (bar % 8 === 0) drone(ctx, bus, t, [38, 45], sd * 48, 0.8);
    }
    const ch = CHORDS[Math.floor(bar / 2) % 4];
    if (s === 0) pluck(ctx, bus, t, ch[0], 0.6, -0.2);
    if (s === 2 || s === 5) ch.slice(1).forEach((m, k) => pluck(ctx, bus, t + k * 0.008, m, 0.35, 0.1 * k));
    if (s === 0) frameDrum(ctx, bus, t, 0.65);
    if (s === 3) frameDrum(ctx, bus, t, 0.4);
    if (s === 5 && r() < 0.5) frameDrum(ctx, bus, t, 0.2);
    const phrase = bar % 16 < 8 ? a : b;
    const local = (bar % 2) * 6 + s;
    if (bar % 16 >= 2 && bar % 8 !== 7) {
      phrase.forEach((n) => {
        if (n.at !== local) return;
        if (bar % 16 < 8) chanter(ctx, bus, t, TUNE[n.d], n.len * sd * 0.9, 0.6);
        else flute(ctx, bus, t, TUNE[n.d] + 12, n.len * sd * 0.9, 0.5);
      });
    }
  });
  return stop;
}
