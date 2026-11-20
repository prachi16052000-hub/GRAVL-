// Navigation, the cart and their catalogue are shared by the static storefront pages.
const gravlStorefront = (() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

const homePage = document.getElementById('switcher') ? '' : 'index.html';
const inr=n=>'₹'+n.toLocaleString('en-IN');
// Labels are site-owned copy. Only the first line contributes to the accessible name.
const rollLabel=text=>`<span class="roll-label"><span>${text}</span><span aria-hidden="true">${text}</span></span>`;
const ARROW='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

/* placeholder product art */
const sh='<ellipse cx="100" cy="178" rx="52" ry="7" fill="#0C0F19" opacity=".12"/>';
const leds=(x,y,c='var(--teal)')=>[0,1,2,3].map(i=>`<circle cx="${x+i*9}" cy="${y}" r="2" fill="${c}" opacity="${i<3?1:.35}"/>`).join('');
const ART={
 engine:`${sh}<rect x="36" y="48" width="128" height="104" rx="18" fill="url(#gInk)"/><rect x="50" y="62" width="62" height="26" rx="6" fill="#05070d"/><text x="58" y="81" font-family="Work Sans,sans-serif" font-size="15" font-weight="500" fill="var(--teal)">240W</text><rect x="124" y="66" width="26" height="8" rx="4" fill="#05070d"/><rect x="124" y="80" width="26" height="8" rx="4" fill="#05070d"/>${leds(52,134)}`,
 forge:`${sh}<rect x="56" y="28" width="88" height="144" rx="16" fill="url(#gInk)"/><rect x="68" y="40" width="64" height="24" rx="6" fill="#05070d"/><text x="76" y="57" font-family="Work Sans,sans-serif" font-size="13" font-weight="500" fill="var(--teal)">85%</text>${leds(86,156)}`,
 axis:`${sh}<rect x="60" y="32" width="80" height="136" rx="14" fill="url(#gInk)"/><rect x="70" y="150" width="60" height="4" rx="2" fill="#05070d"/>${leds(86,48)}`,
 vault:`${sh}<rect x="44" y="40" width="112" height="120" rx="20" fill="url(#gSteel)"/><rect x="58" y="54" width="84" height="30" rx="7" fill="#0C0F19"/><text x="68" y="75" font-family="Work Sans,sans-serif" font-size="15" font-weight="500" fill="var(--teal)">100%</text><circle cx="100" cy="124" r="14" fill="none" stroke="#2A2F3A" stroke-width="2"/>`,
 core:`${sh}<rect x="62" y="34" width="76" height="132" rx="20" fill="url(#gSage)"/><rect x="76" y="148" width="48" height="4" rx="2" fill="#0C0F19" opacity=".35"/>${leds(86,50,'#0C0F19')}`,
 qi:`${sh}<rect x="58" y="34" width="84" height="132" rx="20" fill="url(#gSteel)"/><circle cx="100" cy="92" r="27" fill="none" stroke="#2A2F3A" stroke-width="3"/><rect x="97" y="126" width="6" height="22" rx="3" fill="#2A2F3A"/>`,
 sigma:`${sh}<rect x="66" y="50" width="68" height="104" rx="18" fill="url(#gInk)"/>${leds(86,138)}<rect x="84" y="62" width="32" height="6" rx="3" fill="#05070d"/>`,
 ring:`${sh}<ellipse cx="100" cy="112" rx="46" ry="50" fill="none" stroke="url(#gInk)" stroke-width="18"/><rect x="70" y="40" width="60" height="38" rx="14" fill="url(#gInk)"/><circle cx="100" cy="59" r="8" fill="var(--teal)"/>`,
 charger:`${sh}<rect x="82" y="26" width="8" height="30" rx="3" fill="#B7BDC6"/><rect x="110" y="26" width="8" height="30" rx="3" fill="#B7BDC6"/><rect x="58" y="52" width="84" height="100" rx="18" fill="url(#gSteel)"/><rect x="84" y="132" width="32" height="8" rx="4" fill="#2A2F3A"/>`,
 cable:`${sh}<path d="M60 150V96a40 40 0 0180 0v54" fill="none" stroke="#2A2F3A" stroke-width="8" stroke-linecap="round"/><rect x="48" y="140" width="24" height="34" rx="6" fill="url(#gInk)"/><rect x="128" y="140" width="24" height="34" rx="6" fill="url(#gInk)"/>`,
 hub:`${sh}<rect x="28" y="84" width="144" height="40" rx="12" fill="url(#gInk)"/><rect x="42" y="98" width="20" height="10" rx="3" fill="#05070d"/><rect x="70" y="98" width="20" height="10" rx="3" fill="#05070d"/><rect x="98" y="98" width="14" height="10" rx="5" fill="#05070d"/><rect x="120" y="98" width="14" height="10" rx="5" fill="#05070d"/><circle cx="154" cy="103" r="3" fill="var(--teal)"/><path d="M100 84V56" stroke="#2A2F3A" stroke-width="6" stroke-linecap="round"/>`,
 stand:`${sh}<path d="M44 150h112" stroke="url(#gSteel)" stroke-width="12" stroke-linecap="round"/><path d="M58 150l30-78h78" fill="none" stroke="#B7BDC6" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><rect x="76" y="46" width="98" height="16" rx="5" fill="url(#gInk)" transform="rotate(-8 125 54)"/>`
};
const art=k=>`<svg class="art" viewBox="0 0 200 200" aria-hidden="true">${ART[k]||''}</svg>`;
$$('[data-art]').forEach(e=>{const s=art(e.dataset.art); if(e.classList.contains('art')) e.innerHTML=`<svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">${ART[e.dataset.art]}</svg>`; else e.innerHTML=s;});

/* data: read from gravlspace.com on 13 Nov 2026 */
const P={
 engine:{n:'Engine 240',spec:'27,000mAh · 240W · 97.2Wh',price:6898,was:7665,r:4.8,rc:9,tag:'Bestseller',cat:'power'},
 forge:{n:'Forge 130',spec:'20,000mAh · 130W dual port',price:6125,r:4.8,rc:5,cat:'power'},
 axis:{n:'Axis 67',spec:'20,000mAh · 67W',price:4064,was:4515,r:4.7,rc:7,cat:'power'},
 vault:{specImage:false,n:'Vault 200',spec:'20,000mAh · Laptop power bank',price:9945,was:17499,tag:'New',cat:'power'},
 core:{n:'Core 30',spec:'10,000mAh · Semi-solid',price:2847,was:3797,r:5.0,rc:1,cat:'power'},
 qi:{n:'Qi Surface',spec:'10,000mAh · 25W wireless',price:3748,was:4165,cat:'power'},
 sigma:{n:'Sigma 35',spec:'10,000mAh · Compact',price:2756,was:3675,cat:'power'},
 arc:{n:'Arc ring mouse',spec:'Wearable ring mouse',price:4199,was:5899,tag:'New',cat:'gear',art:'ring'}
};
Object.keys(P).forEach(k=>{P[k].id=k;P[k].art=P[k].art||k});
const CATS=[
 {id:'power',n:'Power Banks',lead:'engine',line:'Lasts all day, no cap.',subs:['Laptop','Compact','Semi Solid','MagSafe'],items:['engine','forge','axis','core','vault','qi','sigma']},
 {id:'chargers',n:'Chargers & Adapters',lead:'charger',line:'One charger, all devices. Easy.',subs:['Wall chargers','Desktop chargers','Travel adapters']},
 {id:'cables',n:'Cables',lead:'cable',line:'Built to last. Certified goated.',subs:['USB-C','Braided','Multi-device']},
 {id:'hubs',n:'Hubs & Docks',lead:'hub',line:'Desk setup? Served.',subs:['Desk hubs','Laptop docks','Card readers']},
 {id:'stands',n:'Stands & Mounts',lead:'stand',line:'Stable AF. Zero drama.',subs:['Laptop stands','Phone stands','MagSafe mounts']},
 {id:'gear',n:'Productivity Gear',lead:'ring',line:'Small tools, big vibes.',subs:['Ring mouse','Desk tools'],items:['arc']}
];
const STAR='<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l2 4.300 4.700.500-3.500 3.200 1 4.600L8 11.800l-4.200 2.300 1-4.600L1.300 6.300 6 5.800z"/></svg>';
function addButton(p, extraClass = "") {
  return `<button type="button" class="btn add ${extraClass}" data-add="${p.id}"><span class="a">${rollLabel('Add to cart')}</span><span class="b">${rollLabel('Added')}</span><svg class="btn-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><use class="icon-arrow" href="#button-arrow"/><use class="icon-check" href="#button-check"/></svg></button>`;
}
const storePhotos = {
  engine: 'GravlEngine2401.webp?v=1792132927',
  forge: 'Forge_130_1.webp?v=1792132040',
  axis: 'Axis_67_1.webp?v=1792132515',
  core: 'Core301.png?v=1781605134',
  qi: 'GravlQiSurface1.webp?v=1792133493',
  sigma: 'Sigma_35_1.webp?v=1792131603'
};
function productPhoto(product) {
  const file = storePhotos[product.id];
  const storefrontImage = file
    ? `<img class="store-photo" src="https://www.gravlspace.com/cdn/shop/files/${file}&amp;width=900" alt="" loading="lazy" decoding="async">`
    : '';
  return `<span class="product-photo${product.id === 'arc' ? ' product-photo--arc' : ''}">
    <img class="packshot" src="assets/products/${product.id}.webp" alt="" loading="lazy" decoding="async">
    ${storefrontImage}
    ${product.specImage === false ? '' : `<img class="listing-spec" src="assets/products/second/${product.id}.webp" alt="${product.n} specifications: ${product.spec}" width="1000" height="1000" loading="lazy" decoding="async">`}
  </span>`;
}
// Each layer becomes eligible for display only after its own image loads.
document.addEventListener('load', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (img.classList.contains('store-photo')) img.parentElement.classList.add('has-store-photo');
  if (img.classList.contains('listing-spec')) img.classList.add('is-loaded');
}, true);
function emiAmounts(price) {
  const base = Math.floor(price / 3);
  return [0,1,2].map(index => base + Number(index < price % 3));
}
const card=(p,i=0,{emi=false}={})=>`<article class="card product-card" style="--i:${i}">
 <div class="card-visual"><a class="card-media" href="engine-240.html" aria-label="${p.n}">${p.tag?`<span class="tag ${p.tag==='New'?'new':''}">${p.tag==='Bestseller'?'Best seller':p.tag}</span>`:''}<span class="card-price">${inr(p.price)}</span>${productPhoto(p)}</a>${addButton(p, 'shop')}</div>
 <div class="card-body"><div class="card-txt"><h3><a href="engine-240.html">${p.n}</a></h3><span class="spec">${p.spec}</span>${p.r?`<span class="rate">${STAR}${p.r.toFixed(1)} · ${p.rc} review${p.rc>1?'s':''}</span>`:''}</div>${emi ? `<button type="button" class="card-emi" data-emi="${p.id}" aria-haspopup="dialog" aria-controls="emi-dialog" aria-label="View EMI estimate for ${p.n}"><b>EMI</b><span>Est. ${inr(emiAmounts(p.price)[0])}/mo</span></button>` : ''}</div></article>`;


/* announce */
const ann=$$('.announce span');let ai=0, announcementTimer;
const announcementMotion=matchMedia('(prefers-reduced-motion: reduce)');
function syncAnnouncement(){
 clearInterval(announcementTimer);
 if(announcementMotion.matches || document.hidden || ann.length<2)return;
 announcementTimer=setInterval(()=>{ann[ai].classList.remove('on');ai=(ai+1)%ann.length;ann[ai].classList.add('on')},5000);
}
announcementMotion.addEventListener('change',syncAnnouncement);
document.addEventListener('visibilitychange',syncAnnouncement);
addEventListener('pagehide',()=>clearInterval(announcementTimer));
addEventListener('pageshow',syncAnnouncement);
syncAnnouncement();

/* header: tabs, mega, shrink, hide */
const tabs = $('#tabs'), mega = $('#mega'), megaIn = $('#megaIn'), header = $('#header');
const quickLinks = [
  ['Shop All Products', 'shop.html'], ['New Arrivals', '#shop/power/new'],
  ['Best Sellers', '#bestsellers'], ['Deals & Offers', '#shop/power/offers'], ['Bundles', '#setup']
];
const shopFilters = {
  offers: ['Power bank offers', Object.keys(P).filter(id => P[id].was > P[id].price)],
  new: ['New arrivals', ['vault','arc']],
  '10k': ['10,000 mAh', ['core','qi','sigma']],
  '20k': ['20,000 mAh', ['forge','axis','vault']],
  '27k': ['27,000 mAh+', ['engine']],
  laptops: ['For laptops', ['engine','forge','axis','vault']],
  phones: ['For phones', ['core','qi','sigma']],
  travel: ['For travel', ['sigma','core','qi']],
  fast: ['Fast charging', ['engine','vault','forge','axis']],
  multi: ['Multi-device', ['engine','vault','forge']],
  pd: ['USB-C PD', ['engine','forge','axis']],
  ring: ['Ring mouse', ['arc']]
};
const categoryMenus = {
  power: {title:'Power Banks', line:'Power that keeps up.', groups:[
    ['By Capacity', ['10k','20k','27k']], ['By Use', ['laptops','phones','travel']], ['By Feature', ['fast','multi','pd']]
  ]},
  gear: {title:'Productivity Gear', line:'Control at your fingertips.', groups:[
    ['By Type', ['ring']], ['Featured', ['new']], ['Explore', [['The work set','#setup'],['Gear overview','#shop/gear']]]
  ]}
};
function shopIndexMarkup() {
  const links = quickLinks.map(([name,href]) => `<a href="${href.startsWith('#') ? homePage + href : href}">${rollLabel(name)}</a>`).join('');
  const tiles = CATS.map(c => `<a class="menu-category" href="shop.html?category=${c.id}"><span class="menu-thumb"><img src="assets/categories/${c.id}.webp" width="150" height="98" alt=""></span>${rollLabel(c.n)}</a>`).join('');
  return `<div class="shop-index"><div class="shop-shortcuts">${links}</div><div><h3 class="shop-heading">Browse by Category</h3><div class="shop-tiles">${tiles}</div></div></div>`;
}
function categoryMenuMarkup(id) {
  const menu = categoryMenus[id];
  const groups = menu.groups.map(([name,entries]) => {
    const links = entries.map(entry => {
      const [label,href] = Array.isArray(entry) ? entry : [shopFilters[entry][0],`#shop/${id}/${entry}`];
      return `<a href="${href.startsWith('#') ? homePage + href : href}">${rollLabel(label)}</a>`;
    }).join('');
    return `<div class="shop-group"><h3>${name}</h3>${links}</div>`;
  }).join('');
  return `<div class="shop-category-menu"><a class="cat menu-feature" data-feature="${id}" href="shop.html?category=${id}"><img src="assets/category-lifestyle/${id}.webp" width="960" height="1200" loading="lazy" alt=""><span class="cat-name">${menu.title}</span><strong class="cat-line">${menu.line}</strong><span class="circle-arrow" aria-hidden="true">${ARROW}</span></a>${groups}</div>`;
}
function menuButton(id,label) {
  return `<button type="button" class="tab" data-menu="${id}" aria-controls="mega" aria-expanded="false">${rollLabel(label)}</button>`;
}
tabs.innerHTML = [
  menuButton('all','Shop all'), ...Object.entries(categoryMenus).map(([id,menu])=>menuButton(id,menu.title)),
  `<a class="tab" href="${homePage}#shop/power/new">${rollLabel('New')}</a>`, `<a class="tab" href="${homePage}#shop/power/offers">${rollLabel('Offers')}</a>`,
  `<a class="tab" href="about.html"${location.pathname.endsWith('/about.html') ? ' aria-current="page"' : ''}>${rollLabel('About Us')}</a>`
].join('');
const menuButtons = $$('[data-menu]',tabs);
let activeTrigger = null, pinned = false, dismissTimer;
function closeMega() {
  clearTimeout(dismissTimer);
  if (!activeTrigger) return;
  activeTrigger.setAttribute('aria-expanded','false');
  activeTrigger.classList.remove('open');
  mega.classList.remove('open');
  mega.inert = true;
  activeTrigger = null;
  pinned = false;
}
function showMega(button) {
  clearTimeout(dismissTimer);
  if (activeTrigger === button) return;
  closeMega();
  activeTrigger = button;
  megaIn.innerHTML = button.dataset.menu === 'all' ? shopIndexMarkup() : categoryMenuMarkup(button.dataset.menu);
  button.setAttribute('aria-expanded','true');
  button.classList.add('open');
  mega.inert = false;
  mega.classList.add('open');
}
mega.inert = true;
menuButtons.forEach(button => {
  button.addEventListener('pointerenter', e => {if(e.pointerType==='mouse') showMega(button)});
  button.addEventListener('click', () => {
    if (activeTrigger === button && pinned) return closeMega();
    showMega(button);
    pinned = true;
  });
  button.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey && activeTrigger === button)) {
      e.preventDefault(); showMega(button); pinned = true; megaIn.querySelector('a').focus(); return;
    }
  });
});
header.addEventListener('pointerleave', () => {
  if (!pinned && !mega.contains(document.activeElement)) dismissTimer = setTimeout(closeMega,140);
});
mega.addEventListener('pointerenter', () => clearTimeout(dismissTimer));
header.addEventListener('focusout', e => {if (!header.contains(e.relatedTarget)) closeMega()});
for (const item of $$('.tab[href], .bar>.logo, .tools',header)) {
  item.addEventListener('pointerenter',closeMega);
  item.addEventListener('focusin',closeMega);
}
document.addEventListener('pointerdown', e => {if (!header.contains(e.target)) closeMega()});
header.addEventListener('keydown', e => {
  if (!activeTrigger || e.defaultPrevented) return;
  const trigger = activeTrigger;
  if (e.key==='Escape') {closeMega();trigger.focus();e.preventDefault();return}
  if (e.key==='Tab' && mega.contains(e.target)) {
    const links = $$('a',megaIn);
    if (e.shiftKey && e.target===links[0]) {e.preventDefault();closeMega();trigger.focus()}
    if (!e.shiftKey && e.target===links[links.length-1]) {e.preventDefault();closeMega();trigger.nextElementSibling.focus()}
  }
});
mega.addEventListener('click', e=>{if (e.target.closest('a')) closeMega()});
matchMedia('(max-width:1050px)').addEventListener('change',closeMega);
let lastY=0,tick=false;
function onScroll(){
 const y=scrollY;
 header.classList.toggle('small',y>40);
 if(!mega.classList.contains('open')) header.classList.toggle('hide',y>lastY&&y>500);
 lastY=y;
 tick=false;
}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});

$('#footShop').innerHTML=CATS.map(c=>`<li><a href="shop.html?category=${c.id}" data-cat="${c.id}">${rollLabel(c.n)}</a></li>`).join('');

/* cart */
const cartStorageKey = 'gravl-preview-cart';
let cart = {};
function restoreCart() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(cartStorageKey) || '{}');
    cart = Object.fromEntries(Object.entries(saved).filter(([id, qty]) =>
      Object.hasOwn(P, id) && Number.isSafeInteger(qty) && qty > 0));
  } catch { /* Storage can be unavailable in a local preview. */ }
  renderCart();
}
function saveCart() {
  try { sessionStorage.setItem(cartStorageKey, JSON.stringify(cart)); } catch {}
  renderCart();
}
const drawer=$('#drawer'),scrim=$('#scrim'),mmenu=$('#mmenu');
function renderCart(){const ks=Object.keys(cart);const n=ks.reduce((a,k)=>a+cart[k],0);
 $$('[data-count-badge]').forEach(b=>{b.textContent=n;b.hidden=!n;b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')});
 $('#lines').innerHTML=ks.length?ks.map(k=>`<div class="line">${art(P[k].art)}<div><b>${P[k].n}</b><small>${inr(P[k].price)}</small></div><span class="qty"><button data-q="${k}" data-d="-1" aria-label="Remove one ${P[k].n}">−</button>${cart[k]}<button data-q="${k}" data-d="1" aria-label="Add one ${P[k].n}">+</button></span></div>`).join(''):'<p class="empty">Your cart is empty.</p>';
 $('#subtotal').textContent=inr(ks.reduce((a,k)=>a+cart[k]*P[k].price,0));}
function add(k, quantity=1){cart[k]=(cart[k]||0)+quantity;saveCart()}
function done(btn){btn.classList.add('done');setTimeout(()=>btn.classList.remove('done'),1600)}
let overlayOpener = null, overlay = null, backgroundState = [], lockedY = 0, cartTimer;
const focusable = 'button:not(:disabled), a[href], input:not(:disabled), select, textarea, [tabindex="0"]';
function activateOverlay(element, opener) {
  overlayOpener = opener || document.activeElement;
  overlay = element;
  lockedY = scrollY;
  backgroundState = [...document.body.children].filter(el => ![drawer,mmenu,scrim,$('#toast')].includes(el)).map(el => [el,el.inert]);
  backgroundState.forEach(([el]) => {el.inert=true});
  document.body.style.setProperty('--locked-scroll', `-${lockedY}px`);
  document.body.classList.add('overlay-open');
  element.inert=false;
  element.setAttribute('role','dialog'); element.setAttribute('aria-modal','true');
  element.classList.add('on'); element.setAttribute('aria-hidden','false'); scrim.classList.add('on');
  element.querySelector(focusable)?.focus({preventScroll:true});
}
function openCart(opener=document.activeElement){closeAll(false);activateOverlay(drawer,opener)}
function closeAll(restoreFocus=true){
  clearTimeout(cartTimer);
  drawer.classList.remove('on');drawer.setAttribute('aria-hidden','true');drawer.inert=true;
  mmenu.classList.remove('on');mmenu.setAttribute('aria-hidden','true');mmenu.inert=true;
  $('#menuBtn').setAttribute('aria-expanded','false');scrim.classList.remove('on');
  if(!overlay)return;
  overlay.removeAttribute('aria-modal');overlay=null;
  backgroundState.forEach(([el,inert])=>{el.inert=inert});backgroundState=[];
  document.body.classList.remove('overlay-open');document.body.style.removeProperty('--locked-scroll');
  window.scrollTo({top:lockedY,behavior:'instant'});
  if(restoreFocus && overlayOpener?.isConnected)overlayOpener.focus({preventScroll:true});
  overlayOpener=null;
}
drawer.inert=true;mmenu.inert=true;
document.addEventListener('keydown',e=>{
  if(!overlay || e.key!=='Tab')return;
  const items=$$(focusable,overlay).filter(el=>el.getClientRects().length && !el.closest('[inert]'));
  if(!items.length)return;
  if(e.shiftKey && (document.activeElement===items[0] || !overlay.contains(document.activeElement))){e.preventDefault();items.at(-1).focus()}
  else if(!e.shiftKey && (document.activeElement===items.at(-1) || !overlay.contains(document.activeElement))){e.preventDefault();items[0].focus()}
});
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-add]');if(a){add(a.dataset.add, Number(a.dataset.quantity) || 1);done(a);clearTimeout(cartTimer);cartTimer=setTimeout(()=>openCart(a),450);return}
 const q=e.target.closest('[data-q]');if(q){const k=q.dataset.q;cart[k]+=+q.dataset.d;if(cart[k]<=0)delete cart[k];saveCart();return}
 const cartButton=e.target.closest('[data-cart]');if(cartButton)openCart(cartButton);});
$('#closeCart').addEventListener('click',closeAll);scrim.addEventListener('click',closeAll);
addEventListener('keydown',e=>{if(e.key==='Escape'){const wasMenu=mmenu.classList.contains('on');closeAll();if(wasMenu)mobileOpener?.focus()}});
$('#checkout').addEventListener('click',()=>toast('Checkout is not part of this preview.'));
restoreCart();
window.addEventListener('pageshow', event => { if (event.persisted) restoreCart(); });

/* mobile menu */
const mobileNav = $('#mrows');
const mobileTrigger = $('#menuBtn');
let mobileOpener;
mobileNav.innerHTML = shopIndexMarkup() + '<div class="mobile-shop-groups">' +
  Object.entries(categoryMenus).map(([id,menu]) => `<details><summary>${menu.title}</summary>${categoryMenuMarkup(id)}</details>`).join('') + '</div>';
mmenu.addEventListener('click', e => {if(e.target.closest('a')) closeAll()});
function openMenu(event) {
  closeMega(); closeAll(false);
  mobileOpener = event.currentTarget;
  activateOverlay(mmenu,mobileOpener);
  mobileTrigger.setAttribute('aria-expanded','true');
  $('#closeMenu').focus();
}
mobileTrigger.addEventListener('click',openMenu);
$('#bbCats').addEventListener('click',openMenu);
$('#closeMenu').addEventListener('click',()=>{closeAll();mobileOpener?.focus()});

/* forms + toast */
let tT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),2800)}
document.addEventListener('submit',e=>{const f=e.target;if(!f.matches('#newsForm, [data-notify]'))return;e.preventDefault();f.reset();
 toast(f.dataset.notify?`Noted for ${f.dataset.notify}. Preview only, nothing is sent.`:'Subscribed. Preview only, nothing is sent.')});

for (const trigger of document.querySelectorAll('button[aria-label="Search"]')) {
  trigger.addEventListener('click', () => { location.href = 'shop.html#catalog-search'; });
}
onScroll();
function setupVideoPlayers(reviewVideos) {
  for (const video of reviewVideos) {
    const playButton = video.nextElementSibling;
    video.controls = false;
    playButton.hidden = false;
    playButton.addEventListener('click', () => {
      playButton.hidden = true;
      video.controls = true;
      video.focus({preventScroll:true});
      video.play().catch(() => {
        if (!video.error) {
          video.controls = false;
          playButton.hidden = false;
          playButton.focus({preventScroll:true});
        }
      });
    });
    video.addEventListener('play', () => {
      for (const other of reviewVideos) if (other !== video) other.pause();
    });
    video.addEventListener('ended', () => {
      const restoreFocus = document.activeElement === video;
      video.load();
      video.controls = false;
      playButton.hidden = false;
      if (restoreFocus) playButton.focus({preventScroll:true});
    });
  }
}
function setupFAQ(faqQuestions, entries, idPrefix, initialOpen = -1) {
  faqQuestions.innerHTML=entries.map(([q,a,category],i)=>`<article class="qa ${i===initialOpen?'open':''}"${category ? ` data-faq-category="${category}"` : ''}><h3><button type="button" id="${idPrefix}-question-${i}" aria-expanded="${i===initialOpen}" aria-controls="${idPrefix}-answer-${i}"><span>${q}</span><span class="pm" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 8h10"/><path class="pm-v" d="M8 3v10"/></svg></span></button></h3><div class="qa-a" id="${idPrefix}-answer-${i}" role="region" aria-labelledby="${idPrefix}-question-${i}" aria-hidden="${i!==initialOpen}"${i===initialOpen?'':' hidden inert'}><p>${a}</p></div></article>`).join('');
  const faqCards = $$('.qa',faqQuestions);
  const faqMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const faqMotionOptions = {duration:360,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
  const faqAnswerMotion = new WeakMap();
  let faqListMotion;
  function setFAQExpanded(card, expanded, animate=true) {
    const answer = $('.qa-a',card);
    if (animate && card.classList.contains('open') === expanded) return;
    const height = answer.getBoundingClientRect().height;
    const opacity = answer.hidden ? 0 : getComputedStyle(answer).opacity;
    const transform = answer.hidden ? 'translateY(4px)' : getComputedStyle(answer).transform;
    faqAnswerMotion.get(answer)?.cancel();
    faqAnswerMotion.delete(answer);
    card.classList.toggle('open',expanded);
    $('button',card).setAttribute('aria-expanded',String(expanded));
    answer.setAttribute('aria-hidden',String(!expanded));
    answer.inert = !expanded;
    answer.hidden = false;
    if (!animate || faqMotionPreference.matches || !answer.animate) {
      answer.hidden = !expanded;
      return;
    }
    const animation = answer.animate([
      {height:height+'px',opacity,transform},
      {height:(expanded ? answer.scrollHeight : 0)+'px',opacity:expanded?1:0,transform:expanded?'none':'translateY(-4px)'}
    ],faqMotionOptions);
    faqAnswerMotion.set(answer,animation);
    animation.onfinish=()=>{
      if (faqAnswerMotion.get(answer) !== animation) return;
      answer.hidden = !expanded;
      animation.cancel();
      faqAnswerMotion.delete(answer);
    };
  }
  function animateFAQLayout(update, fade=false) {
    const height = faqQuestions.getBoundingClientRect().height;
    faqListMotion?.cancel();
    update();
    if (faqMotionPreference.matches || !faqQuestions.animate) return;
    const visible = faqCards.filter(card=>!card.hidden);
    const target = visible.reduce((total,card)=>total+$('h3',card).getBoundingClientRect().height+(card.classList.contains('open')?$('.qa-a',card).scrollHeight:0),0)+Math.max(0,visible.length-1)*10;
    const animation = faqQuestions.animate([
      {height:height+'px',opacity:fade?.65:1,transform:fade?'translateY(6px)':'none'},
      {height:target+'px',opacity:1,transform:'none'}
    ],faqMotionOptions);
    faqListMotion = animation;
    animation.onfinish=()=>{if(faqListMotion===animation){animation.cancel();faqListMotion=null}};
  }
  faqQuestions.addEventListener('click',event=>{
    const button = event.target.closest('.qa button');
    if (!button) return;
    const card = button.closest('.qa');
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    animateFAQLayout(()=>{for (const item of faqCards) setFAQExpanded(item,item === card && expanded)});
  });
  function settleFAQMotion() {
    faqListMotion?.cancel();
    faqListMotion = null;
    for (const card of faqCards) setFAQExpanded(card,card.classList.contains('open'),false);
  }
  addEventListener('resize',settleFAQMotion,{passive:true});
  faqMotionPreference.addEventListener('change',settleFAQMotion);
  return {faqCards,setFAQExpanded,animateFAQLayout};
}
return { setupFAQ, setupVideoPlayers, card, addButton, emiAmounts, P, CATS, art, rollLabel, ARROW, inr, shopFilters, add, done, openCart };
})();
