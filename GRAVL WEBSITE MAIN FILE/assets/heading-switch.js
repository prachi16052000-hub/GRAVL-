(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const phraseDuration = 2350;

  const selector = '.heading-switch[data-endings]';
  function mount(ending) {
    const first = ending.textContent.trim();
    const accessible = document.createElement('span');
    accessible.className = 'heading-switch-static';
    accessible.textContent = first;

    // Stacking the phrases reserves the tallest and widest ending before the first switch.
    const words = document.createElement('span');
    words.className = 'heading-switch-words';
    words.setAttribute('aria-hidden', 'true');
    const phrases = [first, ...ending.dataset.endings.split('|')].map(text => {
      const phrase = document.createElement('span');
      phrase.textContent = text;
      words.append(phrase);
      return phrase;
    });
    ending.replaceChildren(accessible, words);
    let nextTimer;
    let visible = false;

    function start() {
      clearTimeout(nextTimer);
      phrases.forEach((phrase, i) => { phrase.className = i === 0 ? 'is-current' : ''; });
      if (!visible || document.hidden || motion.matches) return;

      let current = 0;
      function advance() {
        phrases[current].className = 'is-leaving';
        current = (current + 1) % phrases.length;
        phrases[current].className = 'is-current is-entering';
        nextTimer = setTimeout(advance, phraseDuration);
      }
      nextTimer = setTimeout(advance, phraseDuration);
    }
    words.addEventListener('animationend', event => {
      event.target.classList.remove('is-entering', 'is-leaving');
    });
    start();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .5;
      start();
    }, {threshold: [0, .5]});
    observer.observe(ending.closest('h1, h2, h3'));
    motion.addEventListener('change', start);
    document.addEventListener('visibilitychange', start);
    return () => {
      clearTimeout(nextTimer);
      observer.disconnect();
      motion.removeEventListener('change', start);
      document.removeEventListener('visibilitychange', start);
    };
  }

  // The first product panel replaces its heading when a shopper changes categories.
  const panel = document.getElementById('panel');
  document.querySelectorAll(selector).forEach(ending => {
    if (!panel?.contains(ending)) mount(ending);
  });
  if (!panel) return;
  let unmountPanel;
  function mountPanel() {
    unmountPanel?.();
    const ending = panel.querySelector(selector);
    unmountPanel = ending ? mount(ending) : null;
  }
  mountPanel();
  new MutationObserver(mountPanel).observe(panel, {childList: true});
})();
