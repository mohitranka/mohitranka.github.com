// The reader: one panel every world opens its pages in. It shows the same canonical
// page markup Just Read renders, re-binding the few scripts that page content needs.

const loadedScripts = new Set();

function runScripts(container) {
  container.querySelectorAll('script').forEach((old) => {
    if (old.type === 'application/ld+json') return;
    const s = document.createElement('script');
    for (const a of old.attributes) s.setAttribute(a.name, a.value);
    s.textContent = old.textContent;
    old.replaceWith(s);
  });
}

function ensureScripts(srcs) {
  return Promise.all(
    srcs
      .filter((src) => !/googletagmanager|\/site\/core\.js/.test(src))
      .filter((src) => !loadedScripts.has(src) && ![...document.scripts].some((s) => s.src === src))
      .map(
        (src) =>
          new Promise((resolve) => {
            loadedScripts.add(src);
            const s = document.createElement('script');
            s.src = src;
            s.onload = s.onerror = resolve;
            document.head.appendChild(s);
          })
      )
  );
}

// Copy page markup without anything a previous render left bound to it.
export function cleanHtml(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('.giscus, iframe.giscus-frame').forEach((el) => el.remove());
  tpl.content.querySelectorAll('[data-bound]').forEach((el) => el.removeAttribute('data-bound'));
  return tpl.innerHTML;
}

export function createReader({ onClose }) {
  const el = document.getElementById('reader');
  const place = el.querySelector('.reader-place');
  const scroller = el.querySelector('.reader-scroll');
  const content = el.querySelector('.reader-content');
  el.querySelector('[data-reader-close]').addEventListener('click', () => onClose());

  let current = null;

  async function open(page, { url, label, scroll = null, focus = true }) {
    const same = current && current.url === page.url;
    if (!same) {
      content.innerHTML = cleanHtml(page.html);
      // relative links and images resolve against the page they came from
      content.querySelectorAll('a[href], img[src]').forEach((node) => {
        const attr = node.tagName === 'A' ? 'href' : 'src';
        const v = node.getAttribute(attr);
        if (v && !/^(https?:|mailto:|tel:|#|data:)/.test(v)) node.setAttribute(attr, new URL(v, page.url).href);
      });
      content.querySelectorAll('img').forEach((img) => img.setAttribute('loading', 'lazy'));
      runScripts(content);
      current = page;
      ensureScripts(page.headScripts || []).then(() => window.initContactForm && window.initContactForm());
      if (window.initContactForm) window.initContactForm();
    }
    place.textContent = label || '';
    const wasHidden = el.hidden;
    el.hidden = false;
    document.documentElement.classList.add('reading');

    const hash = new URL(url).hash.slice(1);
    const anchor = hash && content.querySelector('#' + CSS.escape(decodeURIComponent(hash)));
    requestAnimationFrame(() => {
      if (anchor) scroller.scrollTop = anchor.offsetTop - 16;
      else if (scroll !== null) scroller.scrollTop = scroll * Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      else if (!same) scroller.scrollTop = 0;
    });
    if (focus && (wasHidden || !same)) {
      const heading = content.querySelector('h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      } else scroller.focus({ preventScroll: true });
    }
  }

  function close() {
    el.hidden = true;
    document.documentElement.classList.remove('reading');
  }

  function scrollFraction() {
    if (el.hidden) return 0;
    const max = scroller.scrollHeight - scroller.clientHeight;
    return max > 0 ? scroller.scrollTop / max : 0;
  }

  function scrollToHash(hash) {
    const anchor = content.querySelector('#' + CSS.escape(hash));
    if (anchor) scroller.scrollTo({ top: anchor.offsetTop - 16, behavior: 'smooth' });
  }

  return {
    el,
    open,
    close,
    scrollFraction,
    scrollToHash,
    get isOpen() {
      return !el.hidden;
    },
    get page() {
      return current;
    },
    reset() {
      current = null;
      content.innerHTML = '';
      close();
    },
  };
}
