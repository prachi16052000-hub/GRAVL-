(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stats = document.querySelector('.stats-list');
  const counters = Array.from(stats ? stats.querySelectorAll('[data-count]') : []).map(element => {
    const value = Number(element.dataset.count);
    const decimals = Number.isInteger(value) ? 0 : 1;
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return {element, value, decimals, formatter};
  });

  // The HTML contains final numbers for first paint, assistive technology and no-script use.
  function paintCounts(progress) {
    counters.forEach(({element, value, decimals, formatter}) => {
      const factor = 10 ** decimals;
      const current = Math.round(value * progress * factor) / factor;
      const formatted = formatter.format(current);
      if (element.textContent !== formatted) element.textContent = formatted;
    });
  }

  if (!('IntersectionObserver' in window)) return;
  let countFrame = 0;
  const countObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    countObserver.disconnect();
    if (reducedMotion.matches) return;
    const start = performance.now();
    function advance(now) {
      const elapsed = Math.min(1, (now - start) / 1400);
      paintCounts(1 - (1 - elapsed) ** 3);
      countFrame = elapsed < 1 ? requestAnimationFrame(advance) : 0;
    }
    paintCounts(0);
    countFrame = requestAnimationFrame(advance);
  }, {threshold: .25});
  if (stats) countObserver.observe(stats);   // the numbers section may be absent
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && countFrame) {
      cancelAnimationFrame(countFrame);
      countFrame = 0;
      paintCounts(1);
    }
  });

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      reveal.unobserve(entry.target);
    });
  }, {threshold: .16});
  document.querySelectorAll('.story-card, .timeline li').forEach(item => reveal.observe(item));

})();
