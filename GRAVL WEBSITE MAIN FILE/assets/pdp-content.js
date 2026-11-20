/* Engine 240 editorial template. Published model data: gravlspace.com/products/gravl-engine-240 */
const engine240 = (() => {
  const {addButton, emiAmounts, inr, rollLabel, setupFAQ, setupVideoPlayers} = gravlStorefront;
  const features = [
    ['Combined output','240W','Connect two compatible devices for up to 140W through the built-in cable and 100W through the USB-C port.'],
    ['Cell capacity','27,000mAh','A lithium-polymer battery stores power for your laptop, tablet and phone between sockets.'],
    ['Battery energy','97.2Wh','This is the battery’s stored energy in watt-hours. Check your airline’s power-bank policy before travelling.'],
    ['Built-in USB-C','140W','The attached cable can supply up to 140W to a compatible laptop and also recharge the Engine.']
  ];
  const specs = [
    ['Model','Engine 240 · GPB005'],['Combined output','240W (140W + 100W)'],['Battery','27,000mAh lithium-polymer · 97.2Wh'],
    ['Built-in cable','USB-C · up to 140W input and output'],['USB-C port','Up to 100W input and output'],['USB-A port','Up to 22.5W output'],
    ['Display','Battery percentage and live output'],['Dimensions','162 × 56 × 50mm'],['Weight','730g']
  ];
  const parts = [
    {name:'Built-in USB-C cable',x:72,y:10,description:'The attached cable handles up to 140W in either direction. Use it to charge a compatible laptop or refill the Engine.'},
    {name:'Smart display',x:51,y:30,description:'See the battery percentage and live output together, so you can check what your devices are drawing.'},
    {name:'Battery housing',x:41,y:69,description:'Inside the grey housing is a 27,000mAh lithium-polymer battery with 97.2Wh of stored energy.'}
  ];
  const chapters = [
    ['Output','One charge source for two devices.','Connect your laptop to the built-in 140W cable and a second device to the 100W USB-C port. Both can draw power at the same time.','engine-studio.webp','See the connections','#look-closer'],
    ['Capacity','Carry the reserve with you.','The Engine stores 97.2Wh in a body measuring 162 × 56 × 50mm. At 730g, it fits a work bag alongside your laptop.','product-sets/work.webp','View specifications','#technical'],
    ['Display','See what’s charging.','Check the remaining battery percentage and live output on the display before you leave the desk.','products/engine.webp','Inspect the display','#look-closer']
  ];
  const heading = (id,text) => `<div class="sec-head"><h2 class="h2" id="${id}">${text}</h2></div>`;
  const buyLink = (label,href) => `<a class="tab" href="${href}">${rollLabel(label)}</a>`;
  const buyingDetails = [
    ['In the box','Engine 240 power bank, welcome kit and user manual.'],
    ['Power &amp; compatibility',`Up to 240W shared across two USB-C connections. Output depends on the device and charging protocol.<br>${buyLink('Full specifications','#technical')}`],
    ['4-year warranty',`The full product is covered for one year. Register within 30 days for three additional years of battery coverage.<br>${buyLink('Register your warranty','https://www.gravlspace.com/pages/register-warranty')}`],
    ['Shipping &amp; support',`${buyLink('Shipping policy','https://www.gravlspace.com/policies/shipping-policy')}<br>For product questions, contact ${buyLink('care@gravlspace.com','mailto:care@gravlspace.com')}.`]
  ];
  function buyControls(product) {
    return `<button type="button" class="card-emi" data-emi="engine" aria-haspopup="dialog" aria-controls="emi-dialog"><b>EMI</b> Est. ${inr(emiAmounts(product.price)[0])}/mo</button>
      <p class="engine-finish"><strong>Finish</strong><span>Grey</span></p>
      <div class="engine-order"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-step="-1" aria-label="Decrease quantity" disabled>−</button><output id="order-qty" aria-live="polite">1</output><button type="button" data-step="1" aria-label="Increase quantity">+</button></div>${addButton(product)}</div>
      <div class="engine-benefits"><span>7-day replacement</span><span>BIS certified</span></div>
      <div class="faq-panel"><div class="faq-questions" role="group" aria-label="Product details"></div></div>`;
  }
  function sections() {
    return `<nav class="pdp-sections collection-tabs" aria-label="Engine 240 sections">
        ${[['highlights','Highlights'],['look-closer','Look closer'],['in-use','Features'],['showreel','Showreel'],['technical','Specifications']].map(([id,label])=>`<a class="tab" href="#${id}">${label}</a>`).join('')}
      </nav>
      <section class="sec" id="highlights" aria-labelledby="highlight-title">${heading('highlight-title','Engine 240 <em>at a glance.</em>')}
        <div class="pdp-bento">
          ${features.map(([label,value,detail])=>`<details class="metric-tile"><summary><span>${label}</span><strong>${value}</strong></summary><p>${detail}</p></details>`).join('')}
          <a class="bento-photo scene-wide" href="#showreel" aria-label="Watch the Engine 240 showreel"><img src="assets/engine-studio.webp" alt="" loading="lazy"></a>
          <a class="bento-note note-left" href="#look-closer"><h3>The cable comes with it.</h3><p>Take the 140W lead straight from your bag to your laptop.</p><span class="link">Look closer</span></a>
          <div class="bento-photo scene-tall"><img src="assets/launch-studio/engine-2k.webp" alt="Engine 240 in the studio" loading="lazy"></div>
          <a class="bento-note note-right" href="#technical"><h3>Power, on display.</h3><p>Read your charge level and live output with a glance.</p><span class="link">Specifications</span></a>
          <div class="bento-photo scene-detail"><img src="assets/products/engine.webp" alt="Detail of the Engine’s screen and cable" loading="lazy"></div>
        </div>
      </section>
      <section class="sec" id="look-closer" aria-labelledby="closer-title">
        <div class="sec-head"><h2 class="h2" id="closer-title">Look <em>closer.</em></h2><p>Select a point to explore the Engine 240.</p></div>
        <div class="engine-explorer"><div class="engine-overview"><div class="part-plane"><img src="assets/products/engine.webp" alt="Engine 240 with selectable component markers" loading="lazy">
          ${parts.map((part,i)=>`<button class="set-marker" type="button" data-part="${i}" aria-label="${part.name}" aria-controls="part-detail-${i}" style="left:${part.x}%;top:${part.y}%">+</button>`).join('')}</div></div>
          <div class="engine-explain"><div class="part-lens" aria-hidden="true"><img src="assets/products/engine.webp" alt="" loading="lazy"></div>
            <div class="part-list">${parts.map((part,i)=>`<div class="part-row"><button data-part="${i}" type="button" aria-controls="part-detail-${i}"><span aria-hidden="true">${String.fromCharCode(65+i)}</span>${part.name}</button><div id="part-detail-${i}" class="part-answer"><div><p>${part.description}</p></div></div></div>`).join('')}</div>
          </div></div>
      </section>
      <section class="engine-life on-dark" aria-labelledby="life-heading"><img src="assets/pdp-lifestyle.webp" loading="lazy" alt="A traveller working on her laptop in a sunlit lounge">
        <div><span class="eyebrow"><i></i>Lifestyle</span><h2 class="h2" id="life-heading">A desk between destinations.</h2><p>Power for your laptop and phone, wherever you settle in to work.</p></div>
      </section>
      <section class="sec values pdp-story" id="in-use" aria-labelledby="story-title">${heading('story-title','Engine 240 <em>in use.</em>')}
        <div class="value-stack">${chapters.map(([label,title,copy,photo,link,href])=>`<article class="value"><div class="value-copy"><span class="eyebrow"><i></i>${label}</span><h3>${title}</h3><p class="value-text">${copy}</p><a class="btn btn--compact btn--text" href="${href}">${rollLabel(link)}</a></div><div class="value-photo"><img src="assets/${photo}" alt="" loading="lazy"></div></article>`).join('')}</div>
      </section>
      <section class="sec" id="showreel" aria-labelledby="reel-heading">${heading('reel-heading','Watch <em>showreel.</em>')}
        <div class="video-review engine-film"><video playsinline controls preload="none" src="assets/engine-240-showreel.mp4" poster="assets/engine-studio.webp" aria-label="Engine 240 showreel, a silent film showing the product and its specifications"></video>
          <button class="video-review-play" type="button" aria-label="Play Engine 240 showreel" hidden><span class="video-play-disc" aria-hidden="true"></span></button></div>
      </section>
      <section class="sec pdp-technical" id="technical" aria-labelledby="tech-title">${heading('tech-title','Technical <em>specifications.</em>')}
        <table aria-labelledby="tech-title"><tbody>${specs.map(([label,value])=>`<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('')}</tbody></table>
      </section>`;
  }
  function mount(root) {
    setupFAQ(root.querySelector('.pdp-buy .faq-questions'),buyingDetails,'engine-detail');
    const explorer = root.querySelector('.engine-explorer');
    function selectPart(index) {
      const part = parts[index];
      const lens = explorer.querySelector('.part-lens');
      lens.style.setProperty('--x',-part.x+'%');
      lens.style.setProperty('--y',-part.y+'%');
      for (const button of explorer.querySelectorAll('[data-part]')) {
        const selected = Number(button.dataset.part) === index;
        if (button.classList.contains('set-marker')) {
          button.classList.toggle('is-highlighted',selected);
          button.setAttribute('aria-pressed',String(selected));
          button.textContent = selected ? '×' : '+';
        } else {
          button.setAttribute('aria-expanded',String(selected));
          button.parentElement.classList.toggle('selected',selected);
          const answer = button.nextElementSibling;
          answer.setAttribute('aria-hidden',String(!selected));
        }
      }
    }
    explorer.addEventListener('click',event=>{const button=event.target.closest('[data-part]');if(button) selectPart(Number(button.dataset.part));});
    root.querySelector('.pdp-story').addEventListener('click',event=>{if(event.target.closest('.value:last-child a')) selectPart(1);});
    selectPart(0);
    const order=root.querySelector('.engine-order');
    order.addEventListener('click',event=>{
      const step=event.target.closest('[data-step]');
      if (!step) return;
      const output=order.querySelector('output');
      const quantity=Math.max(1,Number(output.value)+Number(step.dataset.step));
      output.value=quantity;
      order.querySelector('[data-step="-1"]').disabled=quantity===1;
      order.querySelector('[data-add]').dataset.quantity=quantity;
    });
    setupVideoPlayers(root.querySelectorAll('.engine-film video'));
  }
  return {intro:'A 27,000mAh laptop power bank with a built-in USB-C cable and up to 240W of combined output.',buyControls,sections,mount};
})();
