/* "What we believe in": staggered reveal, and the four cards open one by one as you scroll through the pinned grid.
   Hover / keyboard focus still opens a card; the last card you interacted with stays open until the scroll moves on. */
(function () {
  var root = document.querySelector('.believe');
  if (!root) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reducedMotion.matches;

  /* ---- reveal ---- */
  var items = root.querySelectorAll('[data-bl]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (i) { i.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---- scroll-driven expansion ---- */
  var track = root.querySelector('.bl-track'), sticky = root.querySelector('.bl-sticky');
  var cards = Array.prototype.slice.call(root.querySelectorAll('.bl-card'));
  if (!track || !sticky || !cards.length) return;
  var compact = window.matchMedia('(hover: none), (max-width: 900px)');   // those layouts show every card open already
  var current = -2, raf = 0, scrollIndex = -1, hoverIndex = -1;
  var lastScroll = window.scrollY, lastScrollTime = -Infinity;
  var pointerX = null, pointerY = null;
  var starts = [0.06, 0.30, 0.54, 0.78];                                  // share of the pinned scroll at which each card opens

  function setActive(i) {
    if (i === current) return;
    current = i;
    cards.forEach(function (c, k) { c.classList.toggle('is-open', k === i); });
  }
  function mode() {
    reduce = reducedMotion.matches;
    hoverIndex = -1;
    scrollIndex = -1;
    var st = reduce || compact.matches;
    root.classList.toggle('bl-static', st);
    if (st) { current = -2; cards.forEach(function (c) { c.classList.remove('is-open'); }); }
    else paint();
  }
  function paint() {
    raf = 0;
    if (root.classList.contains('bl-static')) return;
    var r = track.getBoundingClientRect();
    var top = parseFloat(getComputedStyle(sticky).top) || 0;
    var span = r.height - sticky.offsetHeight;
    var p = span > 0 ? Math.min(1, Math.max(0, (top - r.top) / span)) : 0;
    // A small dead zone prevents trackpad reversals at a boundary from
    // repeatedly restarting the expand/collapse transitions.
    var hysteresis = span > 0 ? Math.min(.02, 32 / span) : 0;
    while (scrollIndex < starts.length - 1 && p >= starts[scrollIndex + 1] + hysteresis) scrollIndex++;
    while (scrollIndex >= 0 && p < starts[scrollIndex] - hysteresis) scrollIndex--;
    var focused = cards.indexOf(document.activeElement);
    setActive(focused >= 0 && cards[focused].matches(':focus-visible') ? focused : hoverIndex >= 0 ? hoverIndex : scrollIndex);
  }
  function req() { if (!raf) raf = requestAnimationFrame(paint); }

  root.querySelector('.bl-grid').addEventListener('pointerleave', function () { hoverIndex = -1; pointerX = pointerY = null; req(); });
  cards.forEach(function (c, i) {
    // real mouse movement only: browsers fire synthetic hover events when the page scrolls under a still pointer
    c.addEventListener('pointermove', function (e) {
      if (root.classList.contains('bl-static') || e.pointerType === 'touch') return;
      var moved = pointerX !== null && (e.clientX !== pointerX || e.clientY !== pointerY);
      pointerX = e.clientX; pointerY = e.clientY;
      if (!moved || performance.now() - lastScrollTime < 180) return;
      hoverIndex = i;
      req();
    });
    c.addEventListener('focus', function () { if (!root.classList.contains('bl-static')) setActive(i); });
  });
  window.addEventListener('scroll', function () {
    if (Math.abs(window.scrollY - lastScroll) > 2) {
      hoverIndex = -1;
      lastScrollTime = performance.now();
      lastScroll = window.scrollY;
    }
    req();
  }, { passive: true });
  root.addEventListener('focusout', req);
  window.addEventListener('resize', req);
  if (compact.addEventListener) compact.addEventListener('change', mode);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', mode);
  mode();
})();
