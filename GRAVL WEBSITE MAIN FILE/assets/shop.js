(() => {
  const { P, CATS, card, emiAmounts, inr, rollLabel, shopFilters } = gravlStorefront;
  const root = document.querySelector('.shop-page');
  const params = new URLSearchParams(location.search);
  const products = Object.values(P);
  const categoryFor = id => CATS.find(category => category.id === id);
  const breadcrumb = items => `<nav class="shop-crumb" aria-label="Breadcrumb"><a href="index.html">Home</a>${items.map(([name, href]) => `<span aria-hidden="true">/</span>${href ? `<a href="${href}">${name}</a>` : `<span aria-current="page">${name}</span>`}`).join('')}</nav>`;

  function showProduct(product) {
    if (!product) {
      document.title = 'Product unavailable | GRAVL';
      root.innerHTML = '<section class="sec"><h1 class="h2">Product unavailable</h1><a class="link" href="shop.html">Browse all products</a></section>';
      return;
    }
    const category = categoryFor(product.cat);
    const images = [
      ['Product view', `assets/products/${product.id}.webp`],
      ['Studio view', `assets/launch-studio/${product.id}-2k.webp`]
    ];
    if (product.specImage !== false) images.push(['Specifications', `assets/products/second/${product.id}.webp`]);
    images.push(['Studio environment','assets/engine-studio.webp'],['Desk setup','assets/product-sets/work.webp']);
    const related = products.filter(other => other !== product)
      .sort((a,b) => Number(b.cat === product.cat) - Number(a.cat === product.cat)).slice(0,3);
    document.title = product.n + ' | GRAVL';
    document.querySelector('meta[name="description"]').content = product.n + ' — ' + product.spec;
    root.innerHTML = breadcrumb([['Shop all','shop.html'],[category.n,'shop.html?category='+category.id],[product.n]]) + `
      <div class="pdp-layout">
        <section class="pdp-gallery" aria-label="Product gallery">
          <img class="pdp-image contained packshot-view" src="${images[0][1]}" alt="${product.n}, product view" fetchpriority="high">
          <div class="pdp-thumbs">${images.map(([label, src], i) => `<button type="button" data-image="${i}" aria-label="${label}" aria-pressed="${i === 0}"><img src="${src}" alt=""></button>`).join('')}</div>
        </section>
        <section class="pdp-buy" aria-labelledby="product-title">
          ${product.r ? `<p class="pdp-rating"><span class="rating-star" aria-hidden="true">★</span><strong>${product.r.toFixed(1)} / 5</strong><span aria-hidden="true">·</span><span>${product.rc} review${product.rc === 1 ? '' : 's'}</span></p>` : ''}
          <h1 class="h2" id="product-title">${product.n}</h1>
          <p class="pdp-spec">${engine240.intro}</p>
          <div class="pdp-price"><strong>${inr(product.price)}</strong>${product.was > product.price ? `<del>${inr(product.was)}</del><small>Save ${inr(product.was - product.price)}</small>` : ''}</div>
          ${engine240.buyControls(product)}
        </section>
      </div>
      ${engine240.sections()}
      <section class="sec"><div class="sec-head"><h2 class="h2">You may also like.</h2><a class="link" href="shop.html">${rollLabel('Shop all')}</a></div><div class="catalog-grid">${related.map(card).join('')}</div></section>`;
    engine240.mount(root);
    const image = root.querySelector('.pdp-image');
    root.querySelector('.pdp-thumbs').addEventListener('click', event => {
      const button = event.target.closest('[data-image]');
      if (!button) return;
      const [label, src] = images[button.dataset.image];
      image.src = src;
      image.alt = product.n + ', ' + label.toLowerCase();
      image.classList.toggle('contained', ['0','2'].includes(button.dataset.image));
      image.classList.toggle('packshot-view', button.dataset.image === '0');
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image.getAnimations().forEach(animation=>animation.cancel());
        image.animate([{opacity:.65},{opacity:1}],{duration:220,easing:'ease-out'});
      }
      for (const thumb of button.parentElement.children) thumb.setAttribute('aria-pressed', thumb === button);
    });
  }

  function showCollection() {
    const priceLimit = Math.max(1000, Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000);
    const priceBands = [
      ['under3k','Under ₹3,000',0,3000],
      ['3to5k','₹3,000 – ₹4,999',3000,5000],
      ['5to8k','₹5,000 – ₹7,999',5000,8000],
      ['over8k','₹8,000 and above',8000,Infinity]
    ];
    const facets = Object.fromEntries(Object.entries(shopFilters).map(([key,[name,ids]]) =>
      [key,{name:key === 'offers' ? 'On sale' : name, matches:p => ids.includes(p.id)}]));
    for (const [key,name,min,max] of priceBands) facets[key] = {name,matches:p => p.price >= min && p.price < max};
    const groups = [
      ['Capacity',['10k','20k','27k']], ['Use',['laptops','phones','travel']],
      ['Features',['fast','multi','pd']],
      ['Price',priceBands.map(([key]) => key)], ['Offers & arrivals',['offers','new']]
    ];
    const categoryUrl = id => 'shop.html' + (id ? '?category=' + id : '');
    const sortChoices = [
      ['', 'Featured'], ['low', 'Price: low to high'],
      ['high', 'Price: high to low'], ['name', 'Name: A to Z']
    ];
    root.innerHTML = `<div class="collection-crumb"></div>
      <section class="collection-cover on-dark"><img alt="" fetchpriority="high"><div class="collection-cover-copy"></div></section>
      <nav class="collection-tabs" aria-label="Product categories">
        ${[['','All products'],...CATS.map(c=>[c.id,c.n])].map(([id,name]) =>
          `<a class="tab" href="${categoryUrl(id)}" data-collection="${id}">${rollLabel(name)}</a>`).join('')}
      </nav>
      <div class="collection-layout">
        <aside class="catalog-sidebar" aria-label="Collection filters">
          <div class="filter-head"><h2>Filters</h2><button class="filter-toggle" aria-controls="filter-body" aria-expanded="false">Filters <span aria-hidden="true">+</span></button><button class="filter-clear" hidden>Clear filters</button></div>
          <div id="filter-body" class="filter-groups"></div>
        </aside>
        <section class="catalog-results" aria-label="Collection products">
          <div class="catalog-toolbar">
            <label class="search-field"><span class="sr-only">Find a product</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg><input id="catalog-search" type="search" placeholder="Search products"></label>
            <div class="catalog-summary" role="status"></div>
            <div class="sort-field">
              <span id="sort-label">Sort by</span>
              <button type="button" class="sort-trigger" aria-labelledby="sort-label sort-value" aria-haspopup="menu" aria-expanded="false" aria-controls="sort-menu">
                <span id="sort-value">Featured</span>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div id="sort-menu" role="menu" aria-labelledby="sort-label" hidden>
                ${sortChoices.map(([value,label]) => `<button type="button" role="menuitemradio" value="${value}" tabindex="-1" aria-checked="false">${label}</button>`).join('')}
              </div>
            </div>
          </div>
          <div class="catalog-grid"></div><div class="category-soon"></div>
        </section>
      </div>`;
    const find = selector => root.querySelector(selector);
    const search = find('#catalog-search');
    const sort = find('.sort-trigger');
    const sortMenu = find('#sort-menu');
    const sortOptions = Array.from(sortMenu.children);
    function setSort(value) {
      const selected = sortOptions.find(option => option.value === value) || sortOptions[0];
      sort.value = selected.value;
      find('#sort-value').textContent = selected.textContent;
      for (const option of sortOptions) option.setAttribute('aria-checked', String(option === selected));
    }
    function closeSort() {
      sortMenu.hidden = true;
      sort.setAttribute('aria-expanded', 'false');
    }
    function openSort() {
      sortMenu.hidden = false;
      sort.setAttribute('aria-expanded', 'true');
      sortOptions.find(option => option.value === sort.value).focus();
    }
    const sidebar = find('.catalog-sidebar');
    const clear = find('.filter-clear');
    const grid = find('.catalog-grid');
    const toggle = find('.filter-toggle');
    const mobile = matchMedia('(max-width:760px)');
    let category, items, availableGroups;
    let minPrice = 0, maxPrice = priceLimit, savedBands = [];
    function priceFilter() {
      return `<fieldset class="filter-group price-filter"><legend>Price</legend>
        <div class="price-values"><span data-price-label="min"></span><span data-price-label="max"></span></div>
        <div class="price-slider"><div class="price-track" aria-hidden="true"></div>
          <input type="range" data-price="min" aria-label="Minimum price" min="0" max="${priceLimit}">
          <input type="range" data-price="max" aria-label="Maximum price" min="0" max="${priceLimit}">
        </div>
        <small class="saved-price-bands" hidden></small></fieldset>`;
    }
    function syncPrice() {
      const slider = find('.price-slider');
      if (!slider) return;
      for (const [key, value] of [['min', minPrice], ['max', maxPrice]]) {
        const input = slider.querySelector(`[data-price="${key}"]`);
        input.value = value;
        input.setAttribute('aria-valuetext', inr(value));
        find(`[data-price-label="${key}"]`).textContent = inr(value);
        slider.style.setProperty('--' + key, (value / priceLimit * 100) + '%');
      }
      slider.querySelector('[data-price="min"]').style.zIndex = maxPrice === priceLimit ? 2 : 1;
      const note = find('.saved-price-bands');
      note.hidden = !savedBands.length;
      note.textContent = savedBands.map(band => band[1]).join(' · ');
    }
    const local = location.protocol === 'file:';
    function readRoute() {
      return new URLSearchParams(local && location.hash.startsWith('#collection:') ? location.hash.slice(12) : location.search);
    }
    function saveRoute(settings, method) {
      const url = new URL(location.href);
      if (local) url.hash = 'collection:' + settings.toString();
      else { url.search = settings.toString(); url.hash = ''; }
      if (url.href !== location.href) history[method](null,'',url);
    }
    function setPanel(open) {
      find('#filter-body').hidden = mobile.matches && !open;
      toggle.setAttribute('aria-expanded',String(open));
      toggle.lastElementChild.textContent = open ? '−' : '+';
    }
    function updateResults(write = true) {
      const selected = Array.from(sidebar.querySelectorAll('input:checked'), input => input.value);
      const term = search.value.trim().toLowerCase();
      const matches = items.filter(product => {
        if (product.price < minPrice || product.price > maxPrice) return false;
        if (savedBands.length && !savedBands.some(([key]) => facets[key].matches(product))) return false;
        if (!(product.n+' '+product.spec).toLowerCase().includes(term)) return false;
        return availableGroups.every(([,keys]) => {
          const checked = keys.filter(key => selected.includes(key));
          return !checked.length || checked.some(key => facets[key].matches(product));
        });
      });
      if (sort.value === 'low') matches.sort((a,b)=>a.price-b.price);
      if (sort.value === 'high') matches.sort((a,b)=>b.price-a.price);
      if (sort.value === 'name') matches.sort((a,b)=>a.n.localeCompare(b.n));
      grid.innerHTML = matches.map((p,i)=>card(p,i,{emi:true})).join('');
      if (items.length && !matches.length) grid.innerHTML = '<div class="no-matches"><h2>No matching products</h2><button class="link" data-reset>Clear filters</button></div>';
      find('.catalog-summary').textContent = matches.length+' product'+(matches.length===1 ? '' : 's');
      clear.hidden = !(selected.length || search.value || minPrice || maxPrice < priceLimit || savedBands.length);
      if (!write) return;
      const settings = new URLSearchParams();
      if (category) settings.set('category',category.id);
      for (const key of selected) settings.append('filter',key);
      for (const [key] of savedBands) settings.append('filter', key);
      if (minPrice) settings.set('minPrice', minPrice);
      if (maxPrice < priceLimit) settings.set('maxPrice', maxPrice);
      if (search.value) settings.set('q',search.value);
      if (sort.value) settings.set('sort',sort.value);
      saveRoute(settings,'replaceState');
    }
    function selectCollection(settings) {
      category = categoryFor(settings.get('category'));
      const title = category?.n || 'Shop all';
      items = products.filter(p => !category || p.cat === category.id);
      availableGroups = groups.map(([name,keys]) => [name,keys.filter(key => items.some(facets[key].matches))]).filter(([,keys])=>keys.length);
      document.title = title+' | GRAVL';
      find('.collection-crumb').innerHTML = breadcrumb(category ? [['Shop all','shop.html'],[title]] : [[title]]);
      const cover = find('.collection-cover');
      const categoryId = category?.id || 'all';
      if (cover.dataset.category !== categoryId) {
        cover.dataset.category = categoryId;
        cover.querySelector('img').src = 'assets/collection-banners/'+categoryId+'.webp';
        cover.querySelector('.collection-cover-copy').innerHTML = `<h1 class="h2">${title}.</h1><p>${category?.line || 'Power banks and everyday tech essentials.'}</p>`;
      }
      sidebar.hidden = !items.length;
      for (const link of root.querySelectorAll('[data-collection]')) {
        if (link.dataset.collection === (category?.id || '')) link.setAttribute('aria-current','page');
        else link.removeAttribute('aria-current');
      }
      const selected = settings.getAll('filter');
      const bands = priceBands.filter(([key]) => selected.includes(key));
      const readPrice = (key, fallback) => {
        const raw = settings.get(key);
        return raw && /^\d+$/.test(raw) ? Math.min(priceLimit, Number(raw)) : fallback;
      };
      minPrice = readPrice('minPrice', bands[0]?.[2] ?? 0);
      maxPrice = readPrice('maxPrice', bands.length ? Math.min(priceLimit, bands[bands.length - 1][3] - 1) : priceLimit);
      minPrice = Math.min(minPrice, maxPrice);
      savedBands = bands.some((band, i) => i && bands[i - 1][3] !== band[2]) ? bands : [];
      find('.filter-groups').innerHTML = availableGroups.map(([name,keys]) => name === 'Price' ? priceFilter() : `<fieldset class="filter-group"><legend>${name}</legend>${keys.map(key =>
        `<label><input type="checkbox" value="${key}" ${selected.includes(key) ? 'checked' : ''}><span>${facets[key].name}</span></label>`).join('')}</fieldset>`).join('');
      find('.catalog-toolbar').hidden = !items.length;
      find('.category-soon').innerHTML = items.length ? '' : `<h2 class="h2">Coming soon.</h2><p>Get notified when ${title.toLowerCase()} arrive.</p><form class="notify" data-notify="${title}"><input type="email" required placeholder="Email address" aria-label="Email address"><button class="btn">Notify me</button></form>`;
      search.value = settings.get('q') || '';
      syncPrice();
      closeSort();
      setSort(settings.get('sort'));
      updateResults(false);
    }
    function resetFilters() {
      for (const input of sidebar.querySelectorAll('input:checked')) input.checked = false;
      search.value = '';
      minPrice = 0;
      maxPrice = priceLimit;
      savedBands = [];
      syncPrice();
      updateResults();
      search.focus({preventScroll:true});
    }
    clear.addEventListener('click',resetFilters);
    grid.addEventListener('click',e=>{ if (e.target.closest('[data-reset]')) resetFilters(); });
    sidebar.addEventListener('change',event => {
      if (event.target.type === 'checkbox') updateResults();
    });
    sidebar.addEventListener('input', event => {
      const bound = event.target.dataset.price;
      if (!bound) return;
      if (bound === 'min') minPrice = Math.min(event.target.valueAsNumber, maxPrice);
      else maxPrice = Math.max(event.target.valueAsNumber, minPrice);
      savedBands = [];
      syncPrice();
      updateResults();
    });
    sidebar.addEventListener('click', event => {
      if (!event.target.matches('.price-slider')) return;
      const track = event.target.querySelector('.price-track').getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (event.clientX - track.left) / track.width));
      const value = Math.round(fraction * priceLimit);
      const bound = Math.abs(value - minPrice) < Math.abs(value - maxPrice) || value < minPrice ? 'min' : 'max';
      const input = event.target.querySelector(`[data-price="${bound}"]`);
      input.value = value;
      input.focus({preventScroll:true});
      input.dispatchEvent(new Event('input', {bubbles:true}));
    });
    search.addEventListener('input',()=>updateResults());
    sort.addEventListener('click', () => sortMenu.hidden ? openSort() : closeSort());
    sort.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      openSort();
    });
    sortMenu.addEventListener('click', event => {
      const option = event.target.closest('[role="menuitemradio"]');
      if (!option) return;
      setSort(option.value);
      closeSort();
      sort.focus();
      updateResults();
    });
    sortMenu.addEventListener('keydown', event => {
      const index = sortOptions.indexOf(document.activeElement);
      const count = sortOptions.length;
      switch (event.key) {
        case 'ArrowDown': sortOptions[(index + 1) % count].focus(); break;
        case 'ArrowUp': sortOptions[(index + count - 1) % count].focus(); break;
        case 'Home': sortOptions[0].focus(); break;
        case 'End': sortOptions[count - 1].focus(); break;
        case 'Escape': closeSort(); sort.focus(); break;
        case 'Tab': closeSort(); sort.focus(); return;
        default: return;
      }
      event.preventDefault();
    });
    document.addEventListener('pointerdown', event => {
      if (!event.target.closest('.sort-field')) closeSort();
    });
    find('.sort-field').addEventListener('focusout', event => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeSort();
    });
    toggle.addEventListener('click',()=>setPanel(toggle.getAttribute('aria-expanded') !== 'true'));
    mobile.addEventListener('change',()=>setPanel(!mobile.matches));
    document.addEventListener('click',event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
      const url = new URL(link.href);
      const menuRoute = link.closest('#header,#mmenu') && url.pathname.endsWith('/index.html') && url.hash.match(/^#shop\/([a-z]+)(?:\/([\w-]+))?$/);
      if (url.origin !== location.origin) return;
      if (!menuRoute && (url.pathname !== location.pathname || url.searchParams.has('product') || url.hash)) return;
      event.preventDefault();
      const settings = menuRoute ? new URLSearchParams({category:menuRoute[1]}) : url.searchParams;
      if (menuRoute?.[2]) settings.set('filter',menuRoute[2]);
      if (sort.value) settings.set('sort',sort.value);
      saveRoute(settings,'pushState');
      selectCollection(settings);
      if (mobile.matches) setPanel(false);
      if (!link.hasAttribute('data-collection')) find('.collection-cover').scrollIntoView({block:'start'});
    });
    window.addEventListener('popstate',()=>selectCollection(readRoute()));
    setPanel(!mobile.matches);
    selectCollection(readRoute());
    if (location.hash === '#catalog-search') search.focus();
  }
    const emiDialog = document.getElementById('emi-dialog');
    root.addEventListener('click',event => {
      const trigger = event.target.closest('[data-emi]');
      if (!trigger) return;
      const product = P[trigger.dataset.emi];
      const amounts = emiAmounts(product.price);
      const dates = ['Today','In 1 month','In 2 months'];
      emiDialog.querySelector('#emi-product').textContent = product.n;
      emiDialog.querySelector('#emi-now').textContent = inr(amounts[0])+' now';
      emiDialog.querySelector('#emi-total').textContent = inr(product.price);
      emiDialog.querySelector('#emi-payments').innerHTML = amounts.map((amount,i) =>
        `<li><i aria-hidden="true"></i><b>${inr(amount)}</b><span>${dates[i]}</span></li>`).join('');
      trigger.focus({preventScroll:true});
      emiDialog.showModal();
    });
    emiDialog.addEventListener('click',event => {
      if (event.target !== emiDialog) return;
      const rect = emiDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) emiDialog.close();
    });
  if (root.hasAttribute('data-engine-page')) showProduct(P.engine);
  else if (params.has('product') && Object.hasOwn(P,params.get('product'))) location.replace('engine-240.html'+location.hash);
  else if (params.has('product')) showProduct(null);
  else showCollection();
})();

