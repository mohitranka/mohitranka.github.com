/**
 * Keep the giscus comment widget on the visitor's site theme.
 *
 * The site restores its saved theme before the comments widget is loaded. Push
 * that theme to Giscus when its iframe appears/loads and whenever it changes.
 */
(function () {
  var ORIGIN = 'https://giscus.app';

  function siteTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply() {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.contentWindow.postMessage({ giscus: { setConfig: { theme: siteTheme() } } }, ORIGIN);
  }

  function watchFrame() {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.addEventListener('load', apply);
    apply();
  }

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes') apply();
      if (mutation.type === 'childList') watchFrame();
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'], childList: true, subtree: true });

  watchFrame();
})();
