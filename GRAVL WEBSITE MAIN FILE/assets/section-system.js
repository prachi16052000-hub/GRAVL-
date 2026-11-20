/* One entrance owner for section headings and supporting copy on both pages.
   Card, hero, word-switch and pinned-scroll animations retain their own owners. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mounted = new WeakSet();
  const revealed = new WeakSet();
  const active = new Set();
  const observed = new Set();
  const tokens = getComputedStyle(document.documentElement);
  const selectors = [
    '.sec-head', '.panel-top', '.sets-heading', '.video-review-heading',
    '.faq-intro', '.gift-panel', '.vt-story-heading', '.vt-fslide',
    '.values-intro', '.op-head', '.life-head', '.journey-intro'
  ];
  function reveal(node) {
    const items = node._sectionItems;
    if (!items || revealed.has(node)) return;
    revealed.add(node);
    items.forEach((item, index) => {
      item.classList.remove('section-pending');
      if (reduced.matches) return;
      const animation = item.animate([
        {opacity: 0, translate: '0 24px'},
        {opacity: 1, translate: '0 0'}
      ], {duration: parseFloat(tokens.getPropertyValue('--reveal-duration')) || 800, delay: index * (parseFloat(tokens.getPropertyValue('--reveal-stagger')) || 100), easing: tokens.getPropertyValue('--reveal-ease').trim() || 'ease', fill: 'backwards'});
      active.add(animation);
      animation.finished.then(() => active.delete(animation)).catch(() => active.delete(animation));
    });
    observer?.unobserve(node);
    observed.delete(node);
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (isIntersecting && target.getAttribute('aria-hidden') !== 'true') reveal(target);
    });
  }, {threshold: .12, rootMargin: '0px 0px -6% 0px'}) : null;
  function mount(node, items) {
    if (mounted.has(node) || !items.length) return;
    mounted.add(node);
    node._sectionItems = items;
    items.forEach(item => {
      ['data-reveal', 'data-rv', 'data-bl', 'data-vr', 'data-lf'].forEach(attr => item.removeAttribute(attr));
      item.classList.add('section-text');
      if (!reduced.matches && observer) item.classList.add('section-pending');
    });
    if (observer && !reduced.matches) {observer.observe(node);observed.add(node);}
    else reveal(node);
  }
  function scan() {
    observed.forEach(node=>{if(!node.isConnected){observer.unobserve(node);observed.delete(node);}});
    document.querySelectorAll(selectors.join(',')).forEach(node =>
      mount(node, [...node.children].flatMap(child => child.matches('h2,h3,p') ? [child] : [...child.querySelectorAll('h2,h3,p')])));
    const believe = document.querySelector('#believe');
    if (believe) mount(believe.querySelector('h2'), [...believe.children].filter(e => e.matches('h2,p')));
    const trust = document.querySelector('.trust-title');
    if (trust) mount(trust, [...trust.children]);
  }
  scan();
  const panel = document.querySelector('#panel');
  if (panel) new MutationObserver(scan).observe(panel, {childList:true});
  // A hidden mission slide must reveal when the feature switches, not off-screen.
  document.querySelectorAll('.vt-fslide').forEach(slide => new MutationObserver(() => {
    if (slide.getAttribute('aria-hidden') !== 'true') reveal(slide);
  }).observe(slide, {attributes:true, attributeFilter:['aria-hidden']}));
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    active.forEach(animation => animation.cancel());
    document.querySelectorAll('.section-pending').forEach(item => item.classList.remove('section-pending'));
    // Keep the observer available for categories inserted after motion is re-enabled.
  });
})();
