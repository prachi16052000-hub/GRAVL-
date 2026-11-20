(() => {
  const timeline = document.querySelector('#journey .timeline');
  if (!timeline) return;

  const steps = Array.from(timeline.children);
  const stacked = matchMedia('(max-width: 799px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const section = timeline.closest('section');
  const stage = section.querySelector('.wrap');
  let travel = 0;
  let selected = -1;
  let frame = 0;

  function measure() {
    const height = stage.offsetHeight;
    const pinned = !stacked.matches && !reduced.matches && innerHeight >= height + 48;
    section.classList.toggle('journey-slow', pinned);
    travel = pinned ? Math.max(600, innerHeight * .7) * steps.length : 0;
    section.style.minHeight = pinned ? (height + travel + 200) + 'px' : '';
    section.style.setProperty('--journey-top', Math.max(24, (innerHeight - height) / 2) + 'px');
    schedule();
  }

  function select(index) {
    if (selected === index) return;
    selected = index;
    steps.forEach((step, i) => {
      const active = i === index;
      step.classList.toggle('is-current', active);
      step.querySelector('button').setAttribute('aria-expanded', String(active));
      step.querySelector('.milestone-detail').style.visibility = active ? 'visible' : 'hidden';
    });
  }

  function followScroll() {
    frame = 0;
    const focused = document.activeElement;
    if (timeline.contains(focused) && focused.matches(':focus-visible')) return;
    if (stacked.matches) {
      const mid = innerHeight / 2;
      const distances = steps.map(step => {
        const rect = step.getBoundingClientRect();
        return Math.abs(rect.top + rect.height / 2 - mid);
      });
      select(distances.indexOf(Math.min(...distances)));
    } else if (travel) {
      const top = parseFloat(getComputedStyle(stage).top);
      const start = section.getBoundingClientRect().top + 100 - top;
      const progress = -start / travel;
      select(Math.max(0, Math.min(steps.length - 1, Math.floor(progress * steps.length))));
    } else {
      const bar = steps[0].querySelector('button').getBoundingClientRect();
      const progress = (1 - (bar.top + bar.height / 2) / innerHeight);
      select(Math.max(0, Math.min(steps.length - 1, Math.floor(progress * steps.length))));
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(followScroll);
  }

  steps.forEach((step, i) => {
    const date = step.querySelector('.milestone-date');
    const detail = step.querySelector('p');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'milestone-date';
    date.replaceWith(button);
    date.removeAttribute('class');
    button.append(date);
    detail.id = 'journey-step-' + (i + 1);
    detail.className = 'milestone-detail';
    step.append(detail);
    button.setAttribute('aria-controls', detail.id);
    button.setAttribute('aria-label', date.textContent + ', ' + step.querySelector('h3').textContent);
    step.addEventListener('pointermove', event => {
      if (event.pointerType === 'mouse') select(i);
    });
    step.addEventListener('focusin', () => select(i));
    button.addEventListener('click', () => select(i));
  });
  timeline.classList.add('interactive');
  timeline.addEventListener('pointerleave', schedule);
  timeline.addEventListener('focusout', schedule);
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  reduced.addEventListener('change', measure);
  document.fonts?.ready.then(measure);
  measure();
})();
