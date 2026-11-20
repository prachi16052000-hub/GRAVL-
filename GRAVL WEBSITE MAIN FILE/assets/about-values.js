/* "The thinking inside": reveal the heading and each stacked card as it scrolls into view */
(function () {
  var root = document.querySelector('.values');
  if (!root) return;
  var items = root.querySelectorAll('[data-vr], .value-stack .value');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (i) { i.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (i) { io.observe(i); });
})();
