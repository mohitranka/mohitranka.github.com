// "Forge Rhythm": the Craftsman's Forge at work. An anvil keeps time at 100 bpm, a
// hammered string ostinato runs in E minor, and a reed answers now and then.
// Original; generated from a fixed seed.
import { rng, pick, sequencer, room, pluck, pluckBuffer, anvil, frameDrum, drone, chanter } from './kit.js';

export const title = 'Forge Rhythm';

const OSTINATO = [
  [64, 71, 67, 71, 64, 71, 67, 74],
  [64, 72, 67, 72, 64, 72, 67, 71],
  [62, 69, 66, 69, 62, 69, 66, 71],
  [64, 71, 67, 71, 64, 71, 66, 63],
];
const REED = [64, 66, 67, 69, 71, 72, 74, 76];

export function play(ctx, out) {
  const r = rng(1100);
  const verb = room(ctx, { seconds: 1.8, decay: 3.2, wet: 0.18 });
  const level = ctx.createGain();
  level.gain.value = 3.0;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  const ring = { damp: 0.994, bright: 0.85 };
  OSTINATO.flat().forEach((m) => pluckBuffer(ctx, m, ring));
  let bar = 0;
  const stop = sequencer(ctx, { bpm: 100, stepsPerBeat: 4, swing: 0.52 }, (step, t, sd) => {
    const s = step % 16;
    if (s === 0) {
      bar = Math.floor(step / 16);
      if (bar % 4 === 0) drone(ctx, bus, t, [40, 47], sd * 64, 0.6);
    }
    const line = OSTINATO[bar % 4];
    if (s % 2 === 0) pluck(ctx, bus, t, line[s / 2], s % 4 === 0 ? 0.5 : 0.36, 0.2, ring);
    if (bar >= 2) {
      if (s === 0 || s === 10) anvil(ctx, bus, t, s === 0 ? 0.42 : 0.3, 860);
      if (s === 6 && r() < 0.4) anvil(ctx, bus, t, 0.2, 980);
      if (s === 0 || s === 8) frameDrum(ctx, bus, t, s === 0 ? 0.7 : 0.45);
    }
    if (bar % 8 >= 4 && bar % 8 < 7 && (s === 0 || s === 6 || s === 12) && r() < 0.7) chanter(ctx, bus, t, pick(r, REED), sd * pick(r, [3, 4, 6]), 0.5);
  });
  return stop;
}
