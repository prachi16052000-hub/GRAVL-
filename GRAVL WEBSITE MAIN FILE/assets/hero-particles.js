/* About hero: dense grain particles wandering in random directions, dragged along by the mouse */
(function () {
  var banner = document.querySelector('.hero .banner');
  var cv = document.querySelector('.hero-particles');
  if (!banner || !cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = 1, P = [], mouse = { x: -999, y: -999, vx: 0, vy: 0 }, raf;
  var COLORS = ['#8a98a8', '#a9b6c3', '#ffffff', '#6f7f90'];

  function seed() {
    var n = Math.round(Math.min(4500, (W * H) / 220));
    P = [];
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * 6.2832, sp = 0.08 + Math.random() * 0.35;
      P.push({
        x: Math.random() * W, y: Math.random() * H,
        dx: Math.cos(ang) * sp, dy: Math.sin(ang) * sp,   // own random heading
        vx: 0, vy: 0,                                       // mouse-induced velocity
        r: 0.6 + Math.random() * 1.5,
        a: 0.25 + Math.random() * 0.6,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        turn: 0.02 + Math.random() * 0.05
      });
    }
  }
  function resize() {
    var r = banner.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    mouse.vx *= 0.9; mouse.vy *= 0.9;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      // random wander: heading slowly rotates at random
      var s = Math.sqrt(p.dx * p.dx + p.dy * p.dy), a = Math.atan2(p.dy, p.dx) + (Math.random() - 0.5) * p.turn * 2;
      p.dx = Math.cos(a) * s; p.dy = Math.sin(a) * s;
      // dragged along with the mouse
      var ox = p.x - mouse.x, oy = p.y - mouse.y, d2 = ox * ox + oy * oy;
      if (d2 < 32400) { var f = 1 - Math.sqrt(d2) / 180; f *= f; p.vx += mouse.vx * f * 0.35; p.vy += mouse.vy * f * 0.35; }
      p.vx *= 0.93; p.vy *= 0.93;
      p.x += p.dx + p.vx; p.y += p.dy + p.vy;
      if (p.x < -4) p.x = W + 4; else if (p.x > W + 4) p.x = -4;
      if (p.y < -4) p.y = H + 4; else if (p.y > H + 4) p.y = -4;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  var bg = banner.querySelector('.hero-bg');
  banner.addEventListener('pointermove', function (e) {
    var r = banner.getBoundingClientRect(), nx = e.clientX - r.left, ny = e.clientY - r.top;
    if (mouse.x > -900) { mouse.vx = Math.max(-40, Math.min(40, nx - mouse.x)); mouse.vy = Math.max(-40, Math.min(40, ny - mouse.y)); }
    mouse.x = nx; mouse.y = ny;
    if (bg) bg.style.transform = 'translate(' + ((nx / r.width - 0.5) * -24) + 'px,' + ((ny / r.height - 0.5) * -14) + 'px) scale(1.06)';
  });
  banner.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; mouse.vx = mouse.vy = 0; if (bg) bg.style.transform = ''; });
  window.addEventListener('resize', resize);
  resize();
  if (reduce) frame(); else raf = requestAnimationFrame(frame);
})();
