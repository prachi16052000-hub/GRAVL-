/* Optional smoothing; native anchors remain functional if the CDN is unavailable. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let lenis, frame = 0;
  function tick(time) { frame = 0; if (!lenis || document.hidden) return; lenis.raf(time); frame = requestAnimationFrame(tick); }
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    if (reduced.matches) { lenis?.destroy(); lenis = null; return; }
    if (!lenis && typeof Lenis !== 'undefined') lenis = new Lenis({lerp:.085,smoothWheel:true,wheelMultiplier:1});
    if (!lenis) return;
    if (document.hidden || document.body.classList.contains('overlay-open')) lenis.stop();
    else {lenis.start();frame=requestAnimationFrame(tick);}
  }
  document.querySelectorAll('.drawer,.lines,.mmenu,.mega').forEach(el=>el.setAttribute('data-lenis-prevent',''));
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button!==0 || !lenis) return;
    let target;
    try {target=document.getElementById(decodeURIComponent(link.hash.slice(1)));} catch {return;}
    if (!target) return;
    event.preventDefault();
    if (location.hash!==link.hash) history.pushState(null,'',link.hash);
    lenis.scrollTo(target,{offset:-90,duration:1.2,onComplete:()=>{
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    }});
  });
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;lenis?.stop();});
  addEventListener('pageshow',sync);
  sync();
})();
