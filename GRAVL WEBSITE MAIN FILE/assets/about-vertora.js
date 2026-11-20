/* About top sections: hero entrance + parallax, scroll reveals, count-up numbers, feature parallax */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('.vt-hero');
  var floats = Array.prototype.slice.call(document.querySelectorAll('.vt-fl'));
  var fmedia = document.querySelector('.vt-fmedia');
  var nf = new Intl.NumberFormat('en-US');

  /* ---- reveal / entrance ---- */
  var targets = Array.prototype.slice.call(document.querySelectorAll('.vt-hero, .vt-pic, .vt-fmedia, .vt-fcopy, .vt [data-rv]'));
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  } else {
    // .vt-fmedia starts fully clipped (clip-path), so it never "intersects" itself: watch its parent and reveal it from there
    var watch = new Map();
    targets.forEach(function (t) { watch.set(t.classList.contains('vt-fmedia') ? t.parentElement : t, t); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = watch.get(en.target) || en.target;
        el.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    watch.forEach(function (el, node) { io.observe(node); });
  }

  /* ---- count-up ---- */
  var nums = document.querySelectorAll('[data-vt-count]');
  function paint(el, v) {
    var d = parseInt(el.getAttribute('data-vt-dec') || '0', 10);
    el.textContent = d ? v.toFixed(d) : nf.format(Math.round(v));
  }
  if (reduce || !('IntersectionObserver' in window)) {
    nums.forEach(function (n) { paint(n, parseFloat(n.getAttribute('data-vt-count'))); });
  } else {
    nums.forEach(function (n) { paint(n, 0); });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseFloat(el.getAttribute('data-vt-count')), t0 = performance.now(), dur = 1900;
        cio.unobserve(el);
        (function tick(now) {
          var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 4);
          paint(el, end * e);
          if (t < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { cio.observe(n); });
  }

  /* ---- orbit content on the teal: scrubbed by the glass section's pinned scroll (user-driven, so it also runs with reduced motion) ---- */
  (function () {
    var sec = document.querySelector('.vt-glass'), orbit = document.querySelector('.vt-orbit');
    if (!sec || !orbit) return;
    var cards = Array.prototype.slice.call(orbit.querySelectorAll('.vt-oc'));
    var spans = [[0.66, 0.77], [0.73, 0.84], [0.80, 0.91], [0.87, 0.97]];
    function cl(t) { return Math.min(1, Math.max(0, t)); }
    function sm(t) { t = cl(t); return t * t * (3 - 2 * t); }
    function eo(t) { t = cl(t); return 1 - Math.pow(1 - t, 3); }
    var raf = 0;
    function paint() {
      raf = 0;
      if (sec.classList.contains('is-static')) { orbit.style.cssText = ''; cards.forEach(function (c) { c.style.cssText = ''; }); return; }
      var r = sec.getBoundingClientRect(), total = r.height - window.innerHeight;
      var p = total > 0 ? cl(-r.top / total) : 1;
      var vh = window.innerHeight;
      orbit.style.setProperty('--oo', sm((p - 0.52) / 0.16).toFixed(3));
      orbit.style.setProperty('--rs', (0.6 + 0.4 * eo((p - 0.54) / 0.22)).toFixed(3));
      orbit.style.setProperty('--ct', sm((p - 0.62) / 0.12).toFixed(3));
      orbit.style.visibility = p > 0.5 ? 'visible' : 'hidden';
      orbit.classList.toggle('is-ready', p > 0.94);
      cards.forEach(function (c, i) {
        var t = eo((p - spans[i][0]) / (spans[i][1] - spans[i][0]));
        c.style.setProperty('--cy', ((1 - t) * vh * 0.95).toFixed(1));
        c.style.setProperty('--cr', ((1 - t) * (i % 2 ? 9 : -9)).toFixed(2) + 'deg');
        c.style.setProperty('--co', cl(t * 2.4).toFixed(3));
      });
    }
    function req() { if (!raf) raf = requestAnimationFrame(paint); }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    // is-static is applied asynchronously by the glass script when WebGL/three.js is unavailable
    new MutationObserver(req).observe(sec, { attributes: true, attributeFilter: ['class'] });
    paint();

    /* the active card turns black and shows its photo (hover / focus / tap); card 1 is the default */
    function activate(card) {
      cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });
    }
    cards.forEach(function (c) {
      c.addEventListener('pointerenter', function () { activate(c); });
      c.addEventListener('focus', function () { activate(c); });
      c.addEventListener('click', function () { activate(c); });
    });
  })();

  /* ---- statement after the hero: characters turn from light beige to black as it scrolls through the viewport ---- */
  (function () {
    var el = document.querySelector('.vt-lead');
    if (!el) return;
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    var readable = document.createElement('span');
    readable.className = 'sr-only'; readable.textContent = text;
    el.appendChild(readable);
    var chars = [];
    text.split(' ').forEach(function (word, wi, arr) {
      var w = document.createElement('span');
      w.className = 'vt-w'; w.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < word.length; i++) {
        var c = document.createElement('span');
        c.className = 'vt-ch'; c.textContent = word.charAt(i);
        w.appendChild(c); chars.push(c);
      }
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    var from = [216, 210, 196], to = [11, 11, 11];           // light beige -> near black
    var levels = chars.map(function () { return -1; });
    var edge = 14;                                             // characters that make up the soft leading edge
    var raf = 0;
    function mix(k) { return 'rgb(' + from.map(function (f, i) { return Math.round(f + (to[i] - f) * k); }).join(',') + ')'; }
    function paint() {
      raf = 0;
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var P = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (vh * 0.5 + r.height * 0.55)));
      var n = chars.length;
      for (var i = 0; i < n; i++) {
        var k = Math.min(1, Math.max(0, (P * (n + edge) - i) / edge));
        var lv = Math.round(k * 24);
        if (lv !== levels[i]) { levels[i] = lv; chars[i].style.color = mix(lv / 24); }
      }
    }
    function req() { if (!raf) raf = requestAnimationFrame(paint); }
    if (reduce) { chars.forEach(function (c) { c.style.color = mix(1); }); return; }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    paint();
  })();

  /* ---- feature: pinned, Vision slide first then Mission slide (scrubbed by scroll) ---- */
  (function () {
    var sec = document.querySelector('.vt-feature');
    if (!sec) return;
    var slides = sec.querySelectorAll('.vt-fslide'), a = slides[0], b = slides[1];
    var media = sec.querySelector('.vt-fmedia'), wa = sec.querySelector('.vt-fw--a'), wb = sec.querySelector('.vt-fw--b');
    var staticMQ = window.matchMedia('(prefers-reduced-motion: reduce), (max-height: 540px)');
    var raf = 0, lastT = -1, lastG = -1, lastAp = -1;
    function cl(t) { return Math.min(1, Math.max(0, t)); }
    function sm(t) { t = cl(t); return t * t * (3 - 2 * t); }
    function mode() {
      var st = staticMQ.matches;
      sec.classList.toggle('is-static', st);
      if (st) {
        a.removeAttribute('aria-hidden'); b.removeAttribute('aria-hidden');
        [a, b, wa, wb].forEach(function (n) { n.style.cssText = ''; });
        ['--bs', '--as', '--ao', '--bo'].forEach(function (v) { media.style.removeProperty(v); });
      }
      lastT = -1; lastG = -1; lastAp = -1; paint();
    }
    function paint() {
      raf = 0;
      if (sec.classList.contains('is-static')) return;
      var r = sec.getBoundingClientRect(), total = r.height - window.innerHeight;
      var p = total > 0 ? cl(-r.top / total) : 0;
      var t = sm((p - 0.40) / 0.2);                          // copy + word: hold Vision, cross-fade mid-way, hold Mission
      var g = cl((p - 0.30) / 0.36);                         // image: inset grows over the main photo
      g = g < 0.5 ? 4 * g * g * g : 1 - Math.pow(-2 * g + 2, 3) / 2;
      var ap = sm((p - 0.04) / 0.18);                        // the inset only appears once scrolling starts (Vision shows the main photo alone)
      if (Math.abs(t - lastT) < 0.0005 && Math.abs(g - lastG) < 0.0005 && Math.abs(ap - lastAp) < 0.0005) return;
      lastT = t; lastG = g; lastAp = ap;
      media.style.setProperty('--bo', ap.toFixed(3));
      media.style.setProperty('--bs', (0.36 + 0.099 * ap + 0.541 * g).toFixed(4));   // fades in at ~36-46%, then grows to 100% of the card
      media.style.setProperty('--as', (1 - 0.1 * g).toFixed(4));         // previous photo recedes to 90%
      media.style.setProperty('--ao', (1 - 0.5 * g).toFixed(4));         // ...and dims to 50%
      a.style.setProperty('--so', (1 - t).toFixed(3));  a.style.setProperty('--sy', (-t * 46).toFixed(1) + 'px');
      b.style.setProperty('--so', t.toFixed(3));        b.style.setProperty('--sy', ((1 - t) * 46).toFixed(1) + 'px');
      wa.style.setProperty('--wo', (1 - t).toFixed(3)); wa.style.setProperty('--wy', (-t * 70).toFixed(1) + 'px');
      wb.style.setProperty('--wo', t.toFixed(3));       wb.style.setProperty('--wy', ((1 - t) * 70).toFixed(1) + 'px');
      var m = t > 0.5;
      if (a.getAttribute('aria-hidden') !== String(m)) { a.setAttribute('aria-hidden', String(m)); b.setAttribute('aria-hidden', String(!m)); }
    }
    function req() { if (!raf) raf = requestAnimationFrame(paint); }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    if (staticMQ.addEventListener) staticMQ.addEventListener('change', mode);
    mode();
  })();

  /* ---- parallax (scroll + pointer) ---- */
  if (reduce) return;
  var speeds = [-0.10, -0.2, 0.06, 0.16];       // px of travel per px scrolled (hero photos)
  var pointer = { x: 0, y: 0 }, tx = 0, frame = 0;
  var stage = hero && hero.querySelector('.vt-stage');
  var photo = floats[2];
  if (stage && photo) hero.classList.add('has-photo-zoom');
  function update() {
    frame = 0;
    if (hero) {
      var r = hero.getBoundingClientRect(), vw = window.innerWidth, vh0 = window.innerHeight, sy = window.scrollY;
      if (r.bottom > -200 && r.top < vh0 + 200) {
        var s = -r.top;
        var D = r.top + sy + stage.offsetHeight;                                   // scroll distance over which photo c grows to full width
        var q = Math.min(1, Math.max(0, sy / D));
        var e = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;                // ease in-out
        var fq = Math.min(1, Math.max(0, sy / (vh0 * 0.6))), fe = 1 - Math.pow(1 - fq, 3); // ease out: the other photos drift away
        var fly = [[-0.34 * vw, -230], [0.36 * vw, -160], [0, 0], [0.68 * vw, 80]];
        floats.forEach(function (f, i) {
          if (i === 2) { f.style.setProperty('--mx', '0px'); return; }
          f.style.setProperty('--py', (s * speeds[i % 4]).toFixed(1));
          f.style.setProperty('--fx', (fly[i][0] * fe).toFixed(1));
          f.style.setProperty('--fy', (fly[i][1] * fe).toFixed(1));
          f.style.setProperty('--mx', (pointer.x * (i % 2 ? -16 : 16)).toFixed(1) + 'px');
        });
        if (photo) {
          var box = stage.getBoundingClientRect();
          var compact = vw <= 860;
          var left = box.width * (compact ? .05 : .126);
          var width = box.width * (compact ? .52 : .27);
          var height = box.height * (compact ? .24 : .26);
          var top = box.height * (compact ? .71 : .70);
          photo.style.left = (left * (1 - e) - box.left * e) + 'px';
          photo.style.top = (top * (1 - e) + box.height * e) + 'px';
          photo.style.width = (width + (hero.clientWidth - width) * e) + 'px';
          photo.style.height = (height + (hero.clientHeight - box.height - height) * e) + 'px';
          photo.style.borderRadius = ((1 - e) * 8) + 'px';
        }
      }
    }
    if (fmedia) {
      var m = fmedia.getBoundingClientRect(), vh = window.innerHeight;
      if (m.bottom > 0 && m.top < vh) {
        var p = (m.top + m.height / 2 - vh / 2);          // 0 when centred
        fmedia.style.setProperty('--py', (p * -0.06).toFixed(1));
        fmedia.style.setProperty('--py2', (p * 0.08).toFixed(1));
      }
    }
  }
  function req() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  if (hero) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    req();
  });
  if (hero) hero.addEventListener('pointerleave', function () { pointer.x = 0; req(); });
  update();
})();
