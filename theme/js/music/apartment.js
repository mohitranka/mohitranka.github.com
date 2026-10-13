// "Brushes on a Tuesday", one of three tracks in the rotation. A jazz trio at 132 bpm, swung:
// a walking upright bass, brushes and ride, and piano comping on rootless voicings in
// B-flat. Every other chorus the right hand finds a short tune, and the end of each
// phrase gets a little grace-note shrug. Original; generated from a fixed seed.
import { rng, pick, sequencer, room, keys, upright, swish, tap, ride, hat, woodblock } from './kit.js';

export const title = 'Brushes on a Tuesday';

// One chord per half bar: Bbmaj7 | G7 | Cm7 | F7 | Dm7 | G7 | Cm7 F7 | Bb6
const H = {
  Bbmaj7: { root: 46, v: [57, 60, 62, 65], s: [70, 72, 74, 77, 79, 81, 82] },
  G7: { root: 43, v: [59, 64, 65, 69], s: [71, 72, 74, 76, 77, 79, 83] },
  Cm7: { root: 48, v: [58, 62, 63, 67], s: [70, 72, 74, 75, 77, 79, 82] },
  F7: { root: 41, v: [57, 62, 63, 67], s: [69, 72, 74, 75, 77, 79, 81] },
  Dm7: { root: 38, v: [57, 60, 64, 65], s: [69, 72, 74, 76, 77, 81, 84] },
  Bb6: { root: 46, v: [55, 60, 62, 65], s: [70, 72, 74, 77, 79, 82, 84] },
};
const FORM = [
  ['Bbmaj7', 'Bbmaj7'], ['G7', 'G7'], ['Cm7', 'Cm7'], ['F7', 'F7'],
  ['Dm7', 'Dm7'], ['G7', 'G7'], ['Cm7', 'F7'], ['Bb6', 'Bb6'],
];

const COMPS = [[0, 5], [2, 8], [5, 11], [3, 9], [0, 8]];

function near(target, low = 36, high = 55) {
  let n = target;
  while (n > high) n -= 12;
  while (n < low) n += 12;
  return n;
}

export function play(ctx, out) {
  const r = rng(404);
  const verb = room(ctx, { seconds: 1.4, decay: 3.5, wet: 0.14 });
  verb.output.connect(out);
  const bus = verb.input;
  const kit = ctx.createGain();
  kit.gain.value = 0.9;
  kit.connect(bus);

  let bar = 0;
  let comp = COMPS[0];
  let motif = [];
  let lastBass = 46;

  function newMotif() {
    const slots = [0, 2, 3, 5, 6, 8, 9, 11].filter(() => r() < 0.45);
    let d = 2 + Math.floor(r() * 3);
    return slots.map((s) => {
      d = Math.max(0, Math.min(6, d + pick(r, [-2, -1, 1, 1, 2])));
      return { s, d, len: pick(r, [1, 2, 2, 3]) };
    });
  }

  // 12 steps a bar: triplet eighths, so beats fall on 0, 3, 6, 9 and the swung
  // "and" on 2, 5, 8, 11.
  const stop = sequencer(ctx, { bpm: 132, stepsPerBeat: 3 }, (step, t, sd) => {
    const s = step % 12;
    if (s === 0) {
      bar = Math.floor(step / 12);
      comp = pick(r, COMPS);
      if (bar % 2 === 0) motif = newMotif();
    }
    const chorus = Math.floor(bar / 8);
    const intro = bar < 2;
    const pair = FORM[bar % 8];
    const ch = H[s < 6 ? pair[0] : pair[1]];
    const beat = s / 3;

    // Walking bass: root, chord tone, scale tone, chromatic approach to the next root.
    if (s % 3 === 0) {
      const nextPair = FORM[(bar + (beat >= 3 ? 1 : 0)) % 8];
      const nextChord = H[beat < 1 ? pair[0] : beat < 3 ? pair[1] : nextPair[0]];
      let note;
      if (beat === 0 || (beat === 2 && pair[0] !== pair[1])) note = near(ch.root);
      else if (beat === 3) {
        const target = near(H[FORM[(bar + 1) % 8][0]].root);
        note = target + (lastBass > target ? 1 : -1);
      } else {
        const pool = [ch.root + 3, ch.root + 4, ch.root + 7, ch.root + 10, ch.root + 2].map((n) => near(n));
        pool.sort((a, b) => Math.abs(a - lastBass) - Math.abs(b - lastBass));
        note = pool[Math.floor(r() * 2)];
        void nextChord;
      }
      lastBass = note;
      upright(ctx, bus, t, note, sd * 2.7, beat % 2 === 0 ? 0.8 : 0.65);
    }

    // Brushes all the way through; ride and comping once the intro is done.
    if (s % 3 === 0) swish(ctx, kit, t, sd * 3, 0.9);
    if (s === 3 || s === 9) {
      tap(ctx, kit, t, 0.55);
      hat(ctx, kit, t, 0.25, false, -0.3);
    }
    if (!intro) {
      if (s === 0 || s === 3 || s === 5 || s === 6 || s === 9 || s === 11) ride(ctx, kit, t, s === 3 || s === 9 ? 0.6 : 0.42);
      comp.forEach((at) => {
        if (at !== s) return;
        ch.v.forEach((m, k) => keys(ctx, bus, t + k * 0.006, m, sd * 1.6, 0.42 + r() * 0.12, { index: 1.6, ratio: 1, decay: 0.5, sustain: 0.18, bell: 0.04, release: 0.08, pan: -0.15, level: 0.12 }));
      });
    }

    // Right hand every other chorus.
    if (chorus % 2 === 1 && bar % 8 < 7) {
      motif.forEach((n) => {
        if (n.s !== s) return;
        keys(ctx, bus, t, ch.s[n.d], sd * n.len, 0.5, { index: 1.4, decay: 0.45, sustain: 0.2, bell: 0.05, release: 0.1, pan: 0.15, level: 0.12 });
      });
    }

    // The shrug at the end of a phrase: a crushed grace note into a high chord tone.
    if (bar % 8 === 7 && s === 8 && !intro) {
      const top = ch.s[5];
      keys(ctx, bus, t, top - 1, sd * 0.3, 0.4, { index: 1.4, decay: 0.2, sustain: 0.1, release: 0.04, level: 0.1 });
      keys(ctx, bus, t + sd * 0.33, top, sd * 1.5, 0.5, { index: 1.4, decay: 0.4, sustain: 0.2, release: 0.1, level: 0.11 });
    }
    if (bar % 4 === 3 && s === 11 && r() < 0.5) woodblock(ctx, kit, t, 0.4, 820);
  });

  return stop;
}
