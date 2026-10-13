// "Lantern Road": the Unfinished Atlas's track. Slow 12/8 at 66 bpm in D dorian:
// plucked strings (Karplus–Strong, rendered in the browser), a low pad, a frame
// drum that arrives late, and a wooden flute that wanders in on the second pass.
// Original; generated from a fixed seed.
import { rng, pick, sequencer, room, pluck, pluckBuffer, pad, flute, frameDrum, hum } from './kit.js';

export const title = 'Lantern Road';

// Dm9 | G/D | Cadd9 | Am7(11), with a D drone under the first two.
const BARS = [
  { bass: 38, pad: [50, 57, 60, 64], arp: [62, 65, 69, 72, 76, 74] },
  { bass: 38, pad: [50, 55, 59, 62], arp: [62, 67, 71, 74, 79, 74] },
  { bass: 36, pad: [48, 55, 60, 62], arp: [60, 64, 67, 72, 74, 67] },
  { bass: 45, pad: [45, 52, 55, 60], arp: [57, 62, 64, 67, 72, 69] },
];
const DORIAN = [62, 64, 65, 67, 69, 71, 72, 74, 76];
const ARP_SLOTS = [0, 2, 3, 5, 6, 8, 9, 11];

export function play(ctx, out) {
  const r = rng(1066);
  const verb = room(ctx, { seconds: 3.6, decay: 2.2, wet: 0.42 });
  // plucks and pads sit quieter than drums; lift the whole track to match the others
  const level = ctx.createGain();
  level.gain.value = 2.8;
  verb.output.connect(level).connect(out);
  const bus = verb.input;
  const stopWind = hum(ctx, level, 0.006, 700);

  // render the plucked notes up front so the first bars do not stutter
  BARS.forEach((b) => b.arp.concat(b.bass + 12).forEach((m) => pluckBuffer(ctx, m)));

  let bar = 0;
  let phrase = [];
  const newPhrase = () => {
    let i = 2 + Math.floor(r() * 4);
    const notes = [];
    let at = 0;
    while (at < 24) {
      const len = pick(r, [3, 3, 6, 6, 9]);
      i = Math.max(0, Math.min(DORIAN.length - 1, i + pick(r, [-2, -1, -1, 1, 1, 2])));
      if (r() < 0.8) notes.push({ at, len: Math.min(len, 24 - at), m: DORIAN[i] });
      at += len;
    }
    return notes;
  };

  const stop = sequencer(ctx, { bpm: 66, stepsPerBeat: 3 }, (step, t, sd) => {
    const s = step % 12;
    if (s === 0) {
      bar = Math.floor(step / 12);
      if (bar % 2 === 0) phrase = newPhrase();
    }
    const B = BARS[bar % 4];
    const cycle = bar % 16;

    if (s === 0) {
      pad(ctx, bus, t, B.pad, sd * 12, 0.7, { cutoff: 700 + (bar % 4) * 120 });
      pluck(ctx, bus, t, B.bass + 12, 0.55, -0.1);
    }

    // a lute-like arpeggio rolling up and back down
    const k = ARP_SLOTS.indexOf(s);
    if (k >= 0 && !(cycle < 2 && k % 2 === 1)) {
      const idx = k < 5 ? k : 8 - k;
      pluck(ctx, bus, t + (r() - 0.5) * 0.012, B.arp[idx % B.arp.length], 0.42 + r() * 0.15, (idx - 2.5) * 0.15);
    }

    if (cycle >= 4) {
      if (s === 0) frameDrum(ctx, bus, t, 0.6);
      if (s === 6) frameDrum(ctx, bus, t, 0.3);
      if (s === 9 && r() < 0.4) frameDrum(ctx, bus, t, 0.22);
    }

    if (cycle >= 8 && cycle < 15) {
      const local = (bar % 2) * 12 + s;
      phrase.forEach((n) => {
        if (n.at === local) flute(ctx, bus, t, n.m, n.len * sd * 0.95, 0.55);
      });
    }
  });

  return () => {
    stop();
    stopWind();
  };
}
