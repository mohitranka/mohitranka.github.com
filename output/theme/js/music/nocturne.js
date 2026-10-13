// "Hearthside Nocturne": soft keys by the fire in E-flat at 64 bpm. Broken chords in
// the left hand, a sparse tune in the right, a low pad, and the fire crackling.
// Original; generated from a fixed seed.
import { rng, sequencer, room, keys, pad, crackle, motif } from './kit.js';

export const title = 'Hearthside Nocturne';

const BARS = [
  { bass: 39, arp: [51, 55, 58, 62], tune: [70, 72, 74, 75, 77, 79] }, // Ebmaj7
  { bass: 36, arp: [51, 55, 58, 60], tune: [70, 72, 74, 75, 77, 79] }, // Cm7
  { bass: 44, arp: [51, 55, 60, 63], tune: [68, 70, 72, 75, 77, 79] }, // Abmaj7
  { bass: 46, arp: [53, 56, 60, 63], tune: [68, 70, 72, 75, 77, 80] }, // Bb7sus
];
const SOFT = { index: 0.6, ratio: 1, decay: 1.4, sustain: 0.25, bell: 0.04, release: 0.6, level: 0.16 };

export function play(ctx, out) {
  const r = rng(64);
  const verb = room(ctx, { seconds: 3.2, decay: 2.2, wet: 0.36 });
  const level = ctx.createGain();
  level.gain.value = 3.1;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  const stopFire = crackle(ctx, out, 0.035);
  let bar = 0;
  let phrase = [];
  const stop = sequencer(ctx, { bpm: 64, stepsPerBeat: 2 }, (step, t, sd) => {
    const s = step % 8;
    if (s === 0) {
      bar = Math.floor(step / 8);
      if (bar % 2 === 0) phrase = motif(r, { slots: [0, 2, 3, 5, 6, 8, 10, 12, 14], span: 6, start: 3, lens: [1, 2, 3, 4], keep: 0.5 });
    }
    const B = BARS[bar % 4];
    if (s === 0) {
      keys(ctx, bus, t, B.bass, sd * 7, 0.5, { ...SOFT, pan: -0.2 });
      pad(ctx, bus, t, [B.bass + 12, B.bass + 19], sd * 8, 0.4, { cutoff: 500 });
    }
    if (s >= 1) keys(ctx, bus, t, B.arp[(s - 1) % 4], sd * 1.6, 0.32 + (s === 4 ? 0.08 : 0), { ...SOFT, pan: -0.1 });
    if (bar >= 2) {
      const local = (bar % 2) * 8 + s;
      phrase.forEach((n) => n.at === local && keys(ctx, bus, t, B.tune[n.d], n.len * sd, 0.45, { ...SOFT, pan: 0.2 }));
    }
  });
  return () => {
    stop();
    stopFire();
  };
}
