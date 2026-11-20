(() => {
  const video = document.querySelector('.vt-shore-video');
  const button = document.querySelector('.vt-video-toggle');
  if (!video || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = reduced.matches;
  let visible = false;
  video.muted = true;
  function sync() {
    if (visible && !pausedByUser && !document.hidden) video.play().catch(() => {});
    else video.pause();
  }
  function label() {
    button.textContent = video.paused ? 'Play' : 'Pause';
    button.setAttribute('aria-label', (video.paused ? 'Play' : 'Pause') + ' ocean video');
  }
  button.addEventListener('click', () => { pausedByUser = !video.paused; sync(); });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 }).observe(video);
  reduced.addEventListener('change', () => { pausedByUser = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
})();
