const storefrontShell = {
  emi: `<dialog class="emi-dialog" id="emi-dialog" aria-labelledby="emi-heading" aria-describedby="emi-note">
  <form method="dialog"><button type="submit" aria-label="Close EMI estimate" autofocus>×</button></form>
  <header><span id="emi-product"></span><h2 id="emi-heading">Pay in three instalments</h2><strong id="emi-now"></strong></header>
  <div class="emi-breakdown">
    <ol id="emi-payments"></ol>
    <div class="emi-total"><span>Total order value</span><b id="emi-total"></b></div>
  </div>
  <p id="emi-note">Illustrative schedule before interest and fees. Your lender confirms eligibility and final terms.</p>
</dialog>`,
  header: `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="button-arrow" viewBox="0 0 20 20"><path d="M3.5 10h12M10.5 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="button-check" viewBox="0 0 20 20"><path d="m4 10 4 4 8-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="gravl-logo" viewBox="0 0 576 135">
      <path fill="currentColor" d="M136.157 0.641 L119.953 0.146 L9.277 51.755 C4.643 53.916 1.232 58.187 0.484 63.244 C-0.5 69.904 3.025 76.264 8.962 79.033 L126.504 133.844 C131.003 135.941 136.157 132.658 136.157 127.694 L136.157 67.503 L118.565 67.503 L118.565 112.97 L16.695 65.467 L126.674 14.184 Z
        M284.822 63.413 L311.356 63.413 C316.068 63.413 319.824 62.456 322.518 60.568 C325.522 58.445 327.042 55.424 327.042 51.582 C327.042 47.735 325.6 44.782 322.755 42.806 C320.077 41.033 316.281 40.182 311.112 40.182 L284.822 40.182 Z
        M322.754 101.104 L303.009 73.872 L284.822 73.872 L284.822 101.104 L270.245 101.104 L270.245 29.83 L313.184 29.83 C322.087 29.899 329.131 31.924 334.106 35.85 C339.085 39.79 341.544 45.014 341.619 51.82 C341.544 57.399 339.848 61.919 336.436 65.588 C333.012 69.269 328.048 71.78 321.683 73.051 L320.046 73.378 L318.254 73.542 L338.86 101.104 Z
        M453.023 101.104 L416.127 29.831 L432.609 29.831 L459.789 84.187 L462.551 84.187 L489.609 29.831 L506.206 29.831 L469.196 101.104 Z
        M516.988 101.104 L516.988 29.831 L531.565 29.831 L531.565 90.644 L575.93 90.644 L575.93 101.104 Z
        M219.543 73.872 L240.293 73.872 L240.136 76.054 C239.763 81.219 237.365 85.292 232.992 88.167 C228.782 90.879 223.128 92.292 216.128 92.366 C207.997 92.215 201.343 89.706 196.352 84.911 C191.332 80.089 188.743 73.555 188.657 65.445 C188.743 57.382 191.332 50.847 196.34 46.036 C201.338 41.157 208.002 38.644 216.193 38.567 C222.182 38.645 227.235 40.069 231.219 42.803 C233.783 44.576 235.863 46.804 237.459 49.444 L252.565 49.444 C250.358 43.442 246.36 38.512 240.638 34.765 C234.179 30.488 225.941 28.284 216.2 28.215 C203.683 28.421 193.465 31.978 185.824 38.793 C178.271 45.462 174.321 54.437 174.081 65.467 C174.323 76.652 178.165 85.378 185.832 92.149 C193.46 98.953 203.669 102.509 216.178 102.719 C228.154 102.646 237.603 99.899 244.267 94.555 C250.894 89.243 254.153 81.976 254.23 72.355 L254.23 63.413 L219.543 63.413 Z
        M388.222 45.026 L391.03 45.026 L404.844 73.87 L374.408 73.87 Z
        M397.034 29.83 L382.097 29.83 L345.779 101.104 L361.29 101.104 L366.896 89.479 L369.381 84.329 L409.81 84.329 L412.234 89.479 L417.84 101.104 L433.468 101.104 Z"/>
    </symbol>
    <linearGradient id="gInk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a5262"/><stop offset=".5" stop-color="#2A2F3A"/><stop offset="1" stop-color="#10131c"/></linearGradient>
    <linearGradient id="gSteel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f4f6"/><stop offset="1" stop-color="#b7bdc6"/></linearGradient>
    <linearGradient id="gSage" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2DBAA4"/><stop offset="1" stop-color="#2DBAA4"/></linearGradient>
  </defs>
</svg>

<div class="announce" aria-live="off">
  <span class="on"><b>4-year warranty</b> on every GRAVL power bank</span>
  <span>Airline compliant. Under 100Wh needs no approval</span>
  <span>Support, Monday to Friday, 8am to 8:30pm</span>
</div>

<header class="header" id="header">
  <div class="wrap bar">
    <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mmenu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg></button>
    <nav class="tabs" id="tabs" aria-label="Categories"></nav>
    <a class="logo" href="#top" aria-label="GRAVL home"><svg viewBox="0 0 576 135" aria-hidden="true" focusable="false"><use href="#gravl-logo"/></svg></a>
    <div class="tools">
      <button class="icon-btn" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg></button>
      <a class="icon-btn" href="#account" aria-label="Account"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.8 20c1.2-3.6 4-5.4 7.2-5.4s6 1.8 7.2 5.4"/></svg></a>
      <button class="icon-btn" data-cart aria-label="Open cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6.500a3 3 0 016 0V8"/></svg><span class="count" data-count-badge hidden>0</span></button>
    </div>
  </div>
  <div class="mega" id="mega"><div class="mega-in" id="megaIn"></div></div>
</header>`,
  footer: `<!-- 13 footer -->
<footer class="foot on-dark">
  <div class="wrap">
    <ul class="footer-benefits" aria-label="The GRAVL standard">
      <li><b>4-year power bank warranty</b><small>Register within 30 days. Terms apply.</small></li>
      <li><b>Built-in battery protection</b><small>Power banks with thermal protection.</small></li>
      <li><b>Power that travels with you</b><small>Check your model and airline’s rules.</small></li>
      <li><b>Support that answers</b><small>Mon–Fri, 8am to 8:30pm.</small></li>
    </ul>
    <div class="footer-main">
      <div class="footer-brand">
        <a class="footer-logo" href="#top" aria-label="GRAVL home"><svg viewBox="0 0 576 135" aria-hidden="true" focusable="false"><use href="#gravl-logo"/></svg></a>
        <p>Essentials built to be depended on. Protected progress.</p>
        <address class="footer-contact"><a href="mailto:care@gravlspace.com">care@gravlspace.com</a><span class="footer-hours">Monday to Friday, 8am to 8:30pm.</span></address>
      </div>
      <nav class="footer-nav footer-nav--shop" aria-labelledby="footer-shop-title"><h3 id="footer-shop-title">Shop</h3><ul id="footShop"></ul></nav>
      <nav class="footer-nav footer-nav--help" aria-labelledby="footer-help-title"><h3 id="footer-help-title">Help</h3><ul><li><a href="https://www.gravlspace.com/pages/register-warranty"><span class="roll-label"><span>Register warranty</span><span aria-hidden="true">Register warranty</span></span></a></li><li><a href="https://www.gravlspace.com/policies/shipping-policy"><span class="roll-label"><span>Shipping</span><span aria-hidden="true">Shipping</span></span></a></li><li><a href="#faq"><span class="roll-label"><span>Returns and refunds</span><span aria-hidden="true">Returns and refunds</span></span></a></li><li><a href="#faq"><span class="roll-label"><span>User manuals</span><span aria-hidden="true">User manuals</span></span></a></li></ul></nav>
      <nav class="footer-nav footer-nav--company" aria-labelledby="footer-company-title"><h3 id="footer-company-title">Company</h3><ul><li><a href="about.html"><span class="roll-label"><span>About GRAVL</span><span aria-hidden="true">About GRAVL</span></span></a></li><li><a href="#top"><span class="roll-label"><span>Buying guide</span><span aria-hidden="true">Buying guide</span></span></a></li><li><a href="mailto:care@gravlspace.com"><span class="roll-label"><span>Contact</span><span aria-hidden="true">Contact</span></span></a></li></ul></nav>
      <div class="footer-newsletter">
        <h2>BE THE FIRST TO KNOW</h2>
        <p>New products, useful updates, and offers from GRAVL.</p>
        <form class="footer-form" id="newsForm"><label class="footer-label" for="newsEmail">Email address</label><input id="newsEmail" type="email" name="email" autocomplete="email" placeholder="Email address" required><button class="btn btn--compact btn--text footer-signup" type="submit"><span class="roll-label"><span>Sign up</span><span aria-hidden="true">Sign up</span></span></button></form>
      </div>
    </div>
    <div class="footer-legal">
      <div class="footer-legal-copy"><p class="footer-copyright">© 2026 GRAVL. All rights reserved.</p><div class="footer-legal-links"><a href="https://www.gravlspace.com/policies/privacy-policy">Privacy</a><a href="https://www.gravlspace.com/policies/terms-of-service">Terms</a></div></div>
      <div class="footer-region"><span>India (INR ₹)</span><a class="footer-back-top" href="#top">Back to top <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4"/></svg></a></div>
    </div>
  </div>
</footer>

<dialog id="signup-dialog" class="signup-dialog" aria-labelledby="signup-title" aria-describedby="signup-description">
  <div class="signup-layout">
    <img class="signup-photo" src="assets/category-lifestyle/power.webp" width="800" height="1000" alt="" loading="lazy">
    <button type="button" class="signup-close" aria-label="Close signup" data-dismiss-signup autofocus>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>
    </button>
    <div class="signup-copy">
      <h2 class="h2" id="signup-title">Get first access to <em>GRAVL offers.</em></h2>
      <p id="signup-description">Get new product launches and offers in your inbox.</p>
      <form id="popup-signup">
        <label class="footer-label" for="popup-email">Email address</label>
        <input id="popup-email" name="email" type="email" autocomplete="email" placeholder="Email address" required>
        <button type="submit" class="btn"><span class="roll-label"><span>Subscribe now</span><span aria-hidden="true">Subscribe now</span></span><svg class="btn-icon" viewBox="0 0 20 20" aria-hidden="true"><use href="#button-arrow"/></svg></button>
      </form>
      <p class="signup-result" role="status" hidden>Thanks for trying the signup. This preview doesn’t send email.</p>
      <button type="button" class="signup-later" data-dismiss-signup>Not now</button>
    </div>
  </div>
</dialog>

<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Cart" aria-hidden="true">
  <div class="drawer-head"><h2>Your cart</h2><button class="icon-btn" id="closeCart" aria-label="Close cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
  <div class="lines" id="lines"></div>
  <div class="assure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.500-3 7.500-7 9-4-1.500-7-4.500-7-9V6l7-3z"/></svg>4-year warranty included on power banks.</div>
  <div class="sub"><span>Subtotal</span><span id="subtotal">₹0</span></div>
  <button class="btn" id="checkout"><span class="roll-label"><span>Checkout</span><span aria-hidden="true">Checkout</span></span><svg class="btn-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><use href="#button-arrow"/></svg></button>
  <p class="fine">Checkout runs on Shopify's standard pages and is not part of this preview.</p>
</aside>

<aside class="mmenu" id="mmenu" aria-label="Menu" aria-hidden="true">
  <div class="mmenu-head"><span class="logo" role="img" aria-label="GRAVL"><svg viewBox="0 0 576 135" aria-hidden="true" focusable="false"><use href="#gravl-logo"/></svg></span><button class="icon-btn" id="closeMenu" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
  <nav id="mrows" aria-label="Shop navigation"></nav>
  <nav class="menu-links" aria-label="More links">
    <a href="#shop/power/new"><span class="roll-label"><span>New</span><span aria-hidden="true">New</span></span></a>
    <a href="#shop/power/offers"><span class="roll-label"><span>Offers</span><span aria-hidden="true">Offers</span></span></a>
    <a href="about.html"><span class="roll-label"><span>About Us</span><span aria-hidden="true">About Us</span></span></a>
    <a href="#faq"><span class="roll-label"><span>Help</span><span aria-hidden="true">Help</span></span></a>
  </nav>
</aside>

<nav class="bbar" aria-label="Quick navigation">
  <a href="#top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 11l8-7 8 7v9h-5v-6H9v6H4v-9z"/></svg><span class="roll-label"><span>Home</span><span aria-hidden="true">Home</span></span></a>
  <button id="bbCats"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg><span class="roll-label"><span>Categories</span><span aria-hidden="true">Categories</span></span></button>
  <button aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="6.500"/><path d="M16 16l4 4"/></svg><span class="roll-label"><span>Search</span><span aria-hidden="true">Search</span></span></button>
  <button data-cart><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6.500a3 3 0 016 0V8"/></svg><span class="roll-label"><span>Cart</span><span aria-hidden="true">Cart</span></span><span class="count" data-count-badge hidden>0</span></button>
</nav>
<div class="toast" id="toast" role="status"></div>`
};

function mountStorefrontShell(part, shop = false) {
  const markup = document.createElement('template');
  markup.innerHTML = storefrontShell[part];
  if (shop) {
    for (const link of markup.content.querySelectorAll('a[href^="#"]')) {
      if (!link.classList.contains('footer-back-top')) link.href = 'index.html' + link.hash;
    }
  }
  document.currentScript.before(markup.content);
}
