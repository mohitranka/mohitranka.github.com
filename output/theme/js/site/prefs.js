// Visitor preferences. Every read and write tolerates blocked storage, so a private
// window or disabled site data just means the defaults, never a broken page.

const DEFAULTS = {
  world: 'read', // read | city | apartment | atlas
  music: 'off', // off | on: whether the visitor last left music playing
  volume: '0.35',
};

export const WORLD_IDS = ['read', 'city', 'apartment', 'atlas'];

export function get(key) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? DEFAULTS[key] ?? null : v;
  } catch (e) {
    return DEFAULTS[key] ?? null;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {
    /* storage unavailable: the choice lasts for this page only */
  }
}

export function session(key, value) {
  try {
    if (value === undefined) {
      const v = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      return v;
    }
    sessionStorage.setItem(key, String(value));
  } catch (e) {
    return null;
  }
  return null;
}

export function world() {
  const w = get('world');
  return WORLD_IDS.includes(w) ? w : 'read';
}
