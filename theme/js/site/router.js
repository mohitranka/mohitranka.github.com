// Where a URL belongs, and fetching a page's content so a world can show it without
// a reload. Pages stay plain HTML; this only reads the canonical markup.

export function createRouter(rootUrl) {
  const rootPath = new URL(rootUrl).pathname;
  const cache = new Map();

  function path(url) {
    const u = new URL(url, location.href);
    if (u.origin !== location.origin || !u.pathname.startsWith(rootPath)) return null;
    return u.pathname.slice(rootPath.length);
  }

  // The six sections every world maps onto its own places.
  function sectionFor(url) {
    const p = path(url);
    if (p === null) return null;
    if (p === '' || p === 'index.html') return 'home';
    if (/^about(\/|$)/.test(p)) return 'about';
    if (/^(blog|tags|category|categories|author|authors)(\/|$)/.test(p)) return 'writing';
    if (/^work(\/|$)/.test(p)) return 'work';
    if (/^projects(\/|$)/.test(p)) return 'projects';
    if (/^library(\/|$)/.test(p)) return 'library';
    if (/^contact(\/|$)/.test(p)) return 'contact';
    return 'writing';
  }

  // Links a world can open in place: same-site HTML pages, not feeds or files.
  function isPageLink(a, event) {
    if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return false;
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) return false;
    const p = path(a.href);
    if (p === null) return false;
    return !/\.(xml|txt|json|png|jpe?g|webp|gif|svg|pdf|zip)$/i.test(p);
  }

  async function load(url) {
    const key = new URL(url, location.href).href.split('#')[0];
    if (cache.has(key)) return cache.get(key);
    const res = await fetch(key, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const main = doc.getElementById('site');
    if (!main) throw new Error('No content in ' + key);
    const page = {
      url: key,
      title: doc.title,
      html: main.innerHTML,
      headScripts: [...doc.querySelectorAll('head script[src]')].map((s) => new URL(s.getAttribute('src'), key).href),
      canonical: doc.querySelector('link[rel="canonical"]')?.href || key,
    };
    cache.set(key, page);
    return page;
  }

  function remember(page) {
    cache.set(page.url, page);
  }

  return { path, sectionFor, isPageLink, load, remember };
}
