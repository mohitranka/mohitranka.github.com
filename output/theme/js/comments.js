/**
 * Keep the giscus comment widget on the visitor's site theme.
 *
 * comments.html ships the widget with the site default (dark); giscus posts a
 * message to the parent frame once its iframe is live, which is our cue to push
 * the theme the visitor actually has selected. Toggling the theme pushes it
 * again.
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

  window.addEventListener('message', function (event) {
    if (event.origin === ORIGIN && event.data && event.data.giscus) apply();
  });

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      // base.html flips data-theme in its own click handler; read it after that.
      setTimeout(apply, 0);
    });
  }
})();
