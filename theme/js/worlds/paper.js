// Paper in the world is torn, not cut: every sheet gets a deckled edge. The edge is a
// clip-path polygon whose points sit at percentages along each side with a few pixels
// of jitter, so it follows the element at any size without being recomputed.

function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

// `outsetY` lets a sheet keep things drawn beyond its top and bottom (a scroll's rollers).
export function deckle(el, { seed = 7, amp = 3.2, points = 26, outsetY = 0 } = {}) {
  if (!el) return;
  const r = rng(seed);
  const j = () => (r() * amp).toFixed(1);
  const pts = [];
  for (let i = 0; i <= points; i++) pts.push(`${((i / points) * 100).toFixed(2)}% ${outsetY ? `-${outsetY}px` : `${j()}px`}`);
  for (let i = 1; i <= points; i++) pts.push(`calc(100% - ${j()}px) ${((i / points) * 100).toFixed(2)}%`);
  for (let i = points - 1; i >= 0; i--) pts.push(`${((i / points) * 100).toFixed(2)}% ${outsetY ? `calc(100% + ${outsetY}px)` : `calc(100% - ${j()}px)`}`);
  for (let i = points - 1; i >= 1; i--) pts.push(`${j()}px ${((i / points) * 100).toFixed(2)}%`);
  el.style.clipPath = `polygon(${pts.join(', ')})`;
}

export function undeckle(el) {
  if (el) el.style.clipPath = '';
}
