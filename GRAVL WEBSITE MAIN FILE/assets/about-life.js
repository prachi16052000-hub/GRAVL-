/* Life at GRAVL: seamless auto-drifting photo row + arrows + drag, and scroll reveals */
(function () {
  var root = document.querySelector('.life');
  if (!root) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reducedMotion.matches;

  /* reveals */
  var items = root.querySelectorAll('[data-lf]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (i) { i.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (i) { io.observe(i); });
  }

  /* carousel */
  var view = root.querySelector('.life-view');
  var track = root.querySelector('.life-track');
  if (!view || !track) return;
  var originals = Array.prototype.slice.call(track.children);
  // duplicate the set so the loop is seamless
  originals.forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });

  var x = 0, setW = 0, step = 0, speed = 38;       // px per second
  var hover = false, drag = false, last = 0, lastX = 0, vel = 0, target = null, raf = 0, inView = true;

  function measure() {
    var a = track.children[0].getBoundingClientRect(), b = track.children[originals.length].getBoundingClientRect();
    setW = b.left - a.left;
    step = track.children[1].getBoundingClientRect().left - a.left;
  }
  function wrap(v) { return setW ? ((v % setW) + setW) % setW : v; }
  function paint() { track.style.transform = 'translate3d(' + (-wrap(x)).toFixed(2) + 'px,0,0)'; }

  function tick(now) {
    raf = 0;
    if (!inView || document.hidden) { last = 0; return; }
    var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    if (target !== null) {                          // arrow button easing
      var d = target - x; x += d * Math.min(1, dt * 7);
      if (Math.abs(d) < 0.5) { x = target; target = null; }
    } else if (!drag) {
      if (!reduce && !hover && !root.contains(document.activeElement)) x += speed * dt;
      if (Math.abs(vel) > 0.05) { x += vel; vel *= 0.92; }   // drag momentum
    }
    paint();
    if (target !== null || Math.abs(vel) > .05 || (!reduce && !hover && !root.contains(document.activeElement))) schedule();
  }
  function schedule() { if (!raf && inView && !document.hidden) raf = requestAnimationFrame(tick); }

  view.addEventListener('pointerenter', function () { hover = true; });
  view.addEventListener('pointerleave', function () { hover = false; last = 0; schedule(); });
  view.addEventListener('pointerdown', function (e) {
    drag = true; lastX = e.clientX; vel = 0; target = null; view.classList.add('is-drag');
    try { view.setPointerCapture(e.pointerId); } catch (_) {}
  });
  view.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = lastX - e.clientX; lastX = e.clientX; x += dx; vel = dx; schedule();
  });
  function end() { drag = false; view.classList.remove('is-drag'); schedule(); }
  view.addEventListener('pointerup', end);
  view.addEventListener('pointercancel', end);

  function nudge(dir) { target = (target !== null ? target : x) + dir * step; vel = 0; if (reduce) {x=target;target=null;paint();} else schedule(); }
  var prev = root.querySelector('.life-btn.prev'), next = root.querySelector('.life-btn.next');
  if (prev) prev.addEventListener('click', function () { nudge(-1); });
  if (next) next.addEventListener('click', function () { nudge(1); });
  view.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { nudge(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { nudge(-1); e.preventDefault(); }
  });

  new IntersectionObserver(function (en) { inView = en[0].isIntersecting; last=0; if(inView) schedule(); else {cancelAnimationFrame(raf);raf=0;} }).observe(view);
  reducedMotion.addEventListener('change', function () {reduce=reducedMotion.matches;vel=0;last=0;schedule();});
  root.addEventListener('focusout', function () {setTimeout(schedule,0);});
  document.addEventListener('visibilitychange', function () {last=0;schedule();});
  window.addEventListener('pagehide', function () {cancelAnimationFrame(raf);raf=0;});
  window.addEventListener('pageshow', schedule);
  window.addEventListener('resize', function () { measure(); });
  window.addEventListener('load', measure);
  measure(); paint();
  schedule();
})();
