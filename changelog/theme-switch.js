// Light/dark switch for the changelog page. Loaded in <head>, so the saved choice applies before
// the page is drawn. The choice is shared with the notes site: LoveIt keeps it in localStorage under
// "theme" ("light" or "dark"; "auto" or nothing means follow the system), and both sites are on
// blog.emecas.net, so they read and write the same value.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');

  function saved() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  }

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : system.matches;
  }

  apply(saved());

  // Another tab (the notes site or this page) changed the choice.
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(e.newValue);
  });

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-switch');
    if (!button) return;
    function label() {
      var text = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', text);
      button.setAttribute('title', text);
    }
    label();
    system.addEventListener('change', label);
    button.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      apply(next);
      try { window.localStorage.setItem(KEY, next); } catch (e) { /* not saved; still switched */ }
      label();
    });
  });
})();
