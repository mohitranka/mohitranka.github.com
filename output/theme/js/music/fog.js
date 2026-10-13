// "Fog over Mount Backlog": no beat at all. Long pads drifting in E, a few struck bells,
// and the wind. For reading while the map waits. Original; generated from a fixed seed.
import { rng, pick, sequencer, room, pad, bell, hum } from './kit.js';

export const title = 'Fog over Mount Backlog';

const PADS = [
  [40, 47, 54, 59],
  [41, 48, 52, 57],
  [43, 50, 54, 59],
  [40, 47, 52, 55],
];
const BELLS = [64, 65, 67, 71, 72, 76, 79, 83];

export function play(ctx, out) {
  const r = rng(7);
  const verb = room(ctx, { seconds: 4.5, decay: 1.8, wet: 0.55 });
  const level = ctx.createGain();
  level.gain.value = 2.4;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  const stopWind = hum(ctx, level, 0.01, 520);
  let k = 0;
  // one step a beat at 48 bpm; a new pad every eight beats
  const stop = sequencer(ctx, { bpm: 48, stepsPerBeat: 1 }, (step, t, sd) => {
    if (step % 8 === 0) {
      pad(ctx, bus, t, PADS[k % PADS.length], sd * 8, 0.9, { cutoff: 520 + (k % 3) * 160 });
      k++;
    }
    if (r() < 0.32) bell(ctx, bus, t + r() * sd * 0.5, pick(r, BELLS), 0.4 + r() * 0.3, { ring: 1.8, pan: (r() - 0.5) * 0.8 });
  });
  return () => {
    stop();
    stopWind();
  };
}
