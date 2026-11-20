/* Mission: scroll-triggered reveals */
(function () {
  var root = document.querySelector('.mission');
  if (!root) return;
  var items = root.querySelectorAll('[data-ms]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (i) { i.classList.add('in'); });
    return;
  }
  // The photo starts fully clipped (clip-path), so observe its wrapper instead and reveal it from there.
  var media = root.querySelector('.mission-media');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target;
      if (t === media.parentElement) { media.classList.add('in'); }
      else { t.classList.add('in'); }
      io.unobserve(t);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (i) { if (i !== media) io.observe(i); });
  if (media) io.observe(media.parentElement);
})();
