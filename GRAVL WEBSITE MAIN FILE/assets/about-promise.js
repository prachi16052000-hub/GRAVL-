/* "Our promise": while the stage is pinned, scroll position drives each card rising into place */
(function () {
  var root = document.querySelector('.op');
  if (!root) return;
  var pin = root.querySelector('.op-pin');
  var cards = Array.prototype.slice.call(root.querySelectorAll('.op-card'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var narrow = window.matchMedia('(max-width: 1100px)');
  // [start, end] of each card's entrance, as a share of the pinned scroll distance
  var spans = [[0.0, 0.22], [0.12, 0.36], [0.34, 0.62], [0.56, 0.86]];
  var frame = 0;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function paint() {
    frame = 0;
    var r = pin.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    var drop = window.innerHeight * 0.95;
    cards.forEach(function (c, i) {
      var s = spans[i], t = ease(Math.min(1, Math.max(0, (p - s[0]) / (s[1] - s[0]))));
      c.style.setProperty('--y', ((1 - t) * drop).toFixed(1));
      c.style.setProperty('--spin', ((1 - t) * (i % 2 ? 14 : -14)).toFixed(2) + 'deg');
      c.style.setProperty('--o', (0.15 + 0.85 * Math.min(1, t * 2.2)).toFixed(3));
    });
  }
  function onScroll() { if (!frame) frame = requestAnimationFrame(paint); }
  function mode() {
    var st = reduce.matches || narrow.matches;
    root.classList.toggle('op-static', st);
    if (st) {
      cards.forEach(function (c) { c.style.removeProperty('--y'); c.style.removeProperty('--spin'); c.style.removeProperty('--o'); });
    } else { paint(); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { mode(); onScroll(); });
  reduce.addEventListener && reduce.addEventListener('change', mode);
  narrow.addEventListener && narrow.addEventListener('change', mode);
  mode();
})();
