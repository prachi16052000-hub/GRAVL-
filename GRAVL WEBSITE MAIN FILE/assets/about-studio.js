/* About section: scroll reveal + count-up numbers */
(function () {
  var root = document.querySelector('.studio');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nf = new Intl.NumberFormat('en-US');
  var nums = root.querySelectorAll('[data-st-count]');

  function paint(el, v) {
    var d = parseInt(el.getAttribute('data-st-dec') || '0', 10);
    el.firstChild.nodeValue = d ? v.toFixed(d) : nf.format(Math.round(v));
  }
  nums.forEach(function (el) { if (!reduce) paint(el, 0); });

  function count(el) {
    var end = parseFloat(el.getAttribute('data-st-count')), start = performance.now(), dur = 1800;
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 4);
      paint(el, end * e);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  var items = root.querySelectorAll('[data-st]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (i) { i.classList.add('in'); });
    nums.forEach(function (n) { paint(n, parseFloat(n.getAttribute('data-st-count'))); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-st-count]').forEach(function (n) { setTimeout(function () { count(n); }, 250); });
      io.unobserve(en.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (i) { io.observe(i); });
})();
