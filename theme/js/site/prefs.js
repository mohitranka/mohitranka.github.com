// Visitor preferences. Every read and write tolerates blocked storage, so a private
// window or disabled site data just means the defaults, never a broken page.

const DEFAULTS = {
  world: 'read', // read | atlas
  music: 'on', // on by default in the world; 'off' once the visitor turns it off
  volume: '0.35',
};

export const WORLD_IDS = ['read', 'atlas'];

// Earlier versions had a city and an apartment; every world choice now opens the atlas.
export function normalise(w) {
  return w === 'city' || w === 'atlas' || w === 'apartment' ? 'atlas' : 'read';
}

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

// The world the visitor actually chose, or null if they never chose one.
export function storedWorld() {
  try {
    const w = localStorage.getItem('world');
    return w === null ? null : normalise(w);
  } catch (e) {
    return null;
  }
}

export function world() {
  return normalise(get('world'));
}
