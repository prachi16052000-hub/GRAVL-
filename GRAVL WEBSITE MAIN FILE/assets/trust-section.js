(() => {
  const section = document.getElementById('why');
  const setup = document.querySelector('.setup-frame');
  const stage = section.querySelector('.trust-stage');
  const grid = section.querySelector('.trust-grid');
  const cards = [...grid.children];
  const actions = section.querySelector('.trust-actions');
  const skip = section.querySelector('.trust-skip');
  const desktopMotion = matchMedia('(min-width: 901px) and (min-height: 580px) and (prefers-reduced-motion: no-preference)');
  let frame = 0;
  let renderedProgress = 0;
  let previousTime = 0;
  let offsets = [];

  // Each part of the sequence is derived from scroll position, including on the way back up.
  function fraction(progress, start, end) {
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  }

  function interval(progress, start, end) {
    const t = fraction(progress, start, end);
    return t * t * (3 - 2 * t);
  }

  function scrollProgress() {
    const bounds = section.getBoundingClientRect();
    return fraction(-bounds.top, 0, Math.max(1, bounds.height - stage.offsetHeight));
  }

  function render(progress) {
    renderedProgress = progress;
    const rise = interval(progress, 0, .15);
    const split = interval(progress, .16, .38);
    stage.style.setProperty('--title-y', (1 - rise) * 35 + 'px');
    stage.style.setProperty('--split-x', split * stage.clientWidth * .42 + 'px');
    stage.style.setProperty('--title-opacity', 1 - interval(progress, .25, .39));

    cards.forEach((card, index) => {
      const start = .25 + index * .156;
      const show = interval(progress, start, start + .085);
      const travel = fraction(progress, start + .035, start + .205);
      const remainingDistance = (1 - travel) ** 2.2;
      card.style.setProperty('--show', show);
      card.style.setProperty('--x', offsets[index] * remainingDistance + 'px');
      card.style.setProperty('--y', (1 - show) * 34 + 'px');
      card.style.setProperty('--scale', .96 + .04 * show);
    });

    const finish = interval(progress, .92, .965);
    stage.style.setProperty('--actions', finish);
    actions.inert = finish < .98;
  }

  function draw(time) {
    frame = 0;
    if (!desktopMotion.matches) return;
    const target = scrollProgress();
    const difference = target - renderedProgress;
    if (Math.abs(difference) < .00015 || target === 0 || target === 1) {
      render(target);
      previousTime = 0;
      return;
    }
    // Smooth wheel steps in real time, independent of display refresh rate.
    const elapsed = previousTime ? time - previousTime : 16;
    previousTime = time;
    render(target - difference * Math.exp(-elapsed / 90));
    frame = requestAnimationFrame(draw);
  }

  function queueDraw() {
    if (!frame && desktopMotion.matches) frame = requestAnimationFrame(draw);
  }

  function measure() {
    section.classList.toggle('trust--scroll', desktopMotion.matches);
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    if (!desktopMotion.matches) {
      actions.inert = false;
      return;
    }
    setup.style.setProperty('--setup-height', setup.offsetHeight + 'px');
    offsets = cards.map(card => grid.clientWidth / 2 - card.offsetLeft - card.offsetWidth / 2);
    render(scrollProgress());
  }

  skip.addEventListener('click', () => {
    const end = window.scrollY + section.getBoundingClientRect().bottom - stage.offsetHeight;
    window.scrollTo({top: end, behavior: 'instant'});
    render(1);
    actions.querySelector('a').focus({preventScroll: true});
  });

  desktopMotion.addEventListener('change', measure);
  const sizes = new ResizeObserver(measure);
  sizes.observe(grid);
  sizes.observe(setup);
  window.addEventListener('resize', queueDraw);
  window.addEventListener('scroll', queueDraw, {passive: true});
  window.addEventListener('pageshow', measure);
  measure();
})();
