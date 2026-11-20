(() => {
  const dialog = document.getElementById('signup-dialog');
  const form = document.getElementById('popup-signup');
  const sessionKey = 'gravl-signup-seen';
  const preview = new URLSearchParams(location.search).get('signup') === '1';
  let seen = false;
  try { seen = sessionStorage.getItem(sessionKey) === '1'; } catch {}

  function rememberVisit() {
    seen = true;
    try { sessionStorage.setItem(sessionKey, '1'); } catch {}
  }

  function showSignup() {
    if (document.hidden || (!preview && (seen || location.hash || document.activeElement !== document.body))) return;
    if (document.querySelector('#scrim.on, #mega.on, dialog[open]')) return;
    if ([...document.querySelectorAll('video')].some(video => !video.paused)) return;
    dialog.showModal();
    rememberVisit();
  }

  dialog.querySelectorAll('[data-dismiss-signup]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
    form.hidden = true;
    dialog.querySelector('.signup-result').hidden = false;
    const done = dialog.querySelector('.signup-later');
    done.textContent = 'Continue shopping';
    done.focus();
  });
  document.getElementById('newsForm').addEventListener('submit', rememberVisit);
  if (preview) showSignup();
  else if (!seen) setTimeout(showSignup, 5000);
})();
