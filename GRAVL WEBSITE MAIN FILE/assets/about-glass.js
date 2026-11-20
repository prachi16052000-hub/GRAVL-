/* Glass GRAVL logogram (three.js). Extruded + bevelled shape, transmissive physical glass, iridescent edges,
   procedural studio environment. Rotation is scrubbed by scroll with a slow idle spin. Falls back to a static SVG. */
(function () {
  var section = document.querySelector('.vt-glass');
  if (!section) return;
  var stage = section.querySelector('.vt-gstage');
  var host = section.querySelector('.vt-gcanvas');
  var motion = matchMedia('(prefers-reduced-motion: reduce)'), initialized = false, loadStarted = false;
  function fallback() { section.classList.add('is-static'); }
  var THREE_SRC = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';   // on Shopify: point this at the theme asset

  /* three.js (~600KB) is fetched only once the section is within one viewport of the screen, never on the critical path */
  function load() {
    if (motion.matches) {fallback();return;}
    if (loadStarted) return;
    loadStarted = true;
    if (typeof THREE !== 'undefined') { init(); return; }
    var s = document.createElement('script');
    s.src = THREE_SRC; s.async = true;
    s.onload = function () { if (typeof THREE === 'undefined') fallback(); else init(); };
    s.onerror = fallback;
    document.head.appendChild(s);
  }
  if (!host || !('IntersectionObserver' in window)) { fallback(); return; }
  var loader = new IntersectionObserver(function (en) {
    if (!en[0].isIntersecting) return;
    loader.disconnect(); load();
  }, { rootMargin: '100% 0px 100% 0px' });
  loader.observe(section);
  motion.addEventListener('change',function(){
    if(motion.matches) fallback();
    else if(initialized) section.classList.remove('is-static');
    else load();
  });

  function init() {
  if (motion.matches) {loadStarted=false;fallback();return;}
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: host, antialias: true, alpha: true, powerPreference: 'high-performance' });
    if (!renderer.capabilities.isWebGL2) throw new Error('webgl2 required for transmission');
  } catch (e) { fallback(); return; }

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0, 8);

  /* ---- procedural studio environment: coloured emissive strips on a dark room ---- */
  var envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0b0d14);
  function strip(hex, gain, w, h, x, y, z, rx, ry) {
    var c = new THREE.Color(hex).multiplyScalar(gain);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, toneMapped: false }));
    m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); envScene.add(m);
  }
  strip(0xffffff, 6, 14, 3, 0, 8, 0, Math.PI / 2, 0);        // key softbox above
  strip(0xffffff, 3.5, 2, 12, -9, 0, 2, 0, Math.PI / 2);     // white edge light left
  strip(0x35e0ff, 5, 2.2, 10, 8, 1, -3, 0, -Math.PI / 2);    // cyan right
  strip(0xff3fb4, 5, 2.2, 10, -7, -1, -6, 0, Math.PI / 2);   // magenta back-left
  strip(0xffa33a, 5, 14, 2, 0, -8, 1, Math.PI / 2, 0);       // amber below
  strip(0x4a63ff, 4, 10, 6, 0, 0, -10, 0, 0);                // blue behind
  strip(0xffffff, 2.5, 6, 6, 0, 1, 10, 0, 0);                // front fill
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(envScene, 0.03).texture;

  /* ---- logogram outline (first subpath of #gravl-logo), y flipped, centred ---- */
  var s = new THREE.Shape();
  var P = function (x, y) { return [x - 68.2, 68 - y]; };
  var a;
  a = P(136.157, 0.641); s.moveTo(a[0], a[1]);
  function L(x, y) { var p = P(x, y); s.lineTo(p[0], p[1]); }
  function C(x1, y1, x2, y2, x, y) { var p1 = P(x1, y1), p2 = P(x2, y2), p = P(x, y); s.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p[0], p[1]); }
  L(119.953, 0.146); L(9.277, 51.755);
  C(4.643, 53.916, 1.232, 58.187, 0.484, 63.244);
  C(-0.5, 69.904, 3.025, 76.264, 8.962, 79.033);
  L(126.504, 133.844);
  C(131.003, 135.941, 136.157, 132.658, 136.157, 127.694);
  L(136.157, 67.503); L(118.565, 67.503); L(118.565, 112.97); L(16.695, 65.467); L(126.674, 14.184);
  s.closePath();

  var geo = new THREE.ExtrudeGeometry(s, { depth: 20, bevelEnabled: true, bevelThickness: 9, bevelSize: 6, bevelOffset: 0, bevelSegments: 14, curveSegments: 28 });
  geo.center();
  var k = 2.1 / 136;
  // NB: transmission `thickness` is in the mesh's own (unscaled) units, so it must be large because the mesh is scaled by k.
  var glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02,
    transmission: 1, thickness: 210, ior: 1.55,
    attenuationColor: new THREE.Color(0x141a52), attenuationDistance: 1.3,
    iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [200, 1000],
    clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, envMapIntensity: 2.2
  });
  var mesh = new THREE.Mesh(geo, glass);
  mesh.scale.setScalar(k);
  var holder = new THREE.Group();
  holder.add(mesh);
  scene.add(holder);

  var key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 5, 6); scene.add(key);

  /* ---- backdrop the glass refracts: same cream + dot grid as the section ---- */
  var backdrop = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ toneMapped: false }));
  backdrop.position.z = -4; scene.add(backdrop);
  /* ---- brand-teal disc that grows from the centre and floods the viewport; lives in the scene so the glass refracts it ---- */
  var disc = new THREE.Mesh(new THREE.CircleGeometry(1, 128), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x2DBAA4).convertSRGBToLinear(), toneMapped: false }));
  disc.position.z = -3.9; disc.visible = false; scene.add(disc);
  var discEnd = 4, baseS = 1;
  function clamp01(t) { return Math.min(1, Math.max(0, t)); }
  function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
  function easeIO(t) { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var dotTex = null;
  function buildBackdrop(w, h) {
    var cv = document.createElement('canvas');
    var sc = Math.min(window.devicePixelRatio || 1, 2), W = Math.round(w * sc), H = Math.round(h * sc);
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');
    c.fillStyle = '#f8f7f3'; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(0,0,0,.16)';
    for (var y = 12; y < h; y += 24) for (var x = 12; x < w; x += 24) { c.beginPath(); c.arc(x * sc, y * sc, 1.1 * sc, 0, 6.2832); c.fill(); }
    if (dotTex) dotTex.dispose();
    dotTex = new THREE.CanvasTexture(cv); dotTex.encoding = THREE.sRGBEncoding;
    backdrop.material.map = dotTex; backdrop.material.needsUpdate = true;
  }

  var W = 0, H = 0;
  function resize() {
    var r = stage.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (w === W && h === H) return;
    W = w; H = h; wasCovered = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    var dist = camera.position.z - backdrop.position.z;
    var vh = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    backdrop.scale.set(vh * camera.aspect, vh, 1);
    // keep the glass a sensible size on narrow screens
    baseS = Math.min(0.55, Math.max(0.38, camera.aspect * 0.42));   // small, centred logogram
    discEnd = Math.hypot(backdrop.scale.x, backdrop.scale.y) / 2 * 1.04;   // radius that covers the whole viewport
    buildBackdrop(W, H);
  }

  /* ---- progress + loop ---- */
  var inView = true, raf = 0, wasCovered = false;
  function progress() {
    var r = section.getBoundingClientRect(), total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0.5;
  }
  function frame(now) {
    raf = 0;
    if (!inView || document.hidden || motion.matches) return;
    // the pinned section is longer than the glass story: the glass + teal flood use the first 62% of the scroll, the rest belongs to the orbit content
    var gp = Math.min(1, progress() / 0.62);
    // Turn around the logo's vertical axis as the teal backdrop opens.
    var turn = reduce ? 0 : smooth((gp - 0.12) / 0.78);
    holder.rotation.set(-0.12, 0.5 + turn * Math.PI * 2, 0);
    holder.position.y = 0;
    var r = discEnd * easeIO((gp - 0.18) / 0.62);
    disc.visible = r > 0.002; disc.scale.set(r, r, 1);
    var hide = smooth((gp - 0.45) / 0.49);
    holder.visible = hide < 0.995;
    holder.scale.setScalar(Math.max(0.0001, baseS * (1 - hide)));
    // once the teal fully covers the stage and the logogram is gone there is nothing left to animate: stop spending GPU
    var covered = r >= discEnd * 0.999 && !holder.visible;
    if (covered && wasCovered) return;
    wasCovered = covered;
    renderer.render(scene, camera);
  }

  resize();
  function queue() { if (!raf && inView && !document.hidden) raf=requestAnimationFrame(frame); }
  function resized() {resize();queue();}
  window.addEventListener('resize', resized);
  window.addEventListener('scroll', queue, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(resized).observe(stage);
  new IntersectionObserver(function (en) { inView = en[0].isIntersecting; if(inView) queue(); }, { rootMargin: '200px 0px' }).observe(section);
  document.addEventListener('visibilitychange',queue);
  window.addEventListener('pagehide',function(){cancelAnimationFrame(raf);raf=0;});
  window.addEventListener('pageshow',queue);
  motion.addEventListener('change',queue);
  renderer.render(scene, camera);
  raf = requestAnimationFrame(frame);
  section.classList.add('is-live');
  initialized = true;
  section.classList.remove('is-static');
  }   // end init
})();
