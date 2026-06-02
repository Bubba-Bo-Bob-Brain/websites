// ============================================================
// scripts.js — Chronicles of the Ur‑Epoch
// Interactive atlas: region clicks, timeline, tooltips, lore
// ============================================================

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const regions = document.querySelectorAll('.region');
  const tooltip = document.getElementById('mapTooltip');
  const loreCard = document.getElementById('loreCard');
  const regionName = document.getElementById('regionName');
  const regionEra = document.getElementById('regionEra');
  const regionDescription = document.getElementById('regionDescription');
  const tradeInfo = document.getElementById('tradeInfo');
  const eraSlider = document.getElementById('eraSlider');
  const eraMarkers = document.querySelectorAll('.era-marker');

  // ---------- LORE DATABASE (region data) ----------
  const loreData = {
    zephyria: {
      name: 'Zephyria',
      era: '⚔️ Age of Empires',
      description: `
        <p>The coastal cradle of the Zephyrian League. Renowned for its purple‑dye trade and the oracles of the Cliff Temple.</p>
        <p class="myth-note">⚡ Myth: The Griffin of Zephyria guards a crystal that controls the tides.</p>
      `,
      trade: ['🛳️ Silk Route', '🌿 Spice Route'],
      eraVariants: {
        0: { era: '🌅 Dawn Era', desc: '<p>Early fishing villages and the first oracles. The Griffin’s crystal was still hidden beneath the waves.</p><p class="myth-note">⚡ Myth: The first Zephyrian king wrestled the Griffin for a single scale.</p>' },
        1: { era: '⚔️ Age of Empires', desc: '<p>The coastal cradle of the Zephyrian League. Renowned for its purple‑dye trade and the oracles of the Cliff Temple.</p><p class="myth-note">⚡ Myth: The Griffin of Zephyria guards a crystal that controls the tides.</p>' },
        2: { era: '🌊 Exodus', desc: '<p>Rising seas swallowed the lower districts. The oracles fled inland, carrying the Griffin’s crystal.</p><p class="myth-note">⚡ Myth: The crystal was shattered into seven fragments, hidden across the continent.</p>' }
      }
    },
    numinor: {
      name: 'Numinor',
      era: '⚔️ Age of Empires',
      description: `
        <p>The heartland of the Numinorean Empire. Great ziggurats and star‑gazers who mapped the heavens.</p>
        <p class="myth-note">🐉 Myth: The Sphinx of Numinor posed riddles to unworthy rulers.</p>
      `,
      trade: ['🛳️ Silk Route', '🪙 Gold Route'],
      eraVariants: {
        0: { era: '🌅 Dawn Era', desc: '<p>Nomadic tribes first settled the fertile plains. They built the first stone circles to track the stars.</p><p class="myth-note">🐉 Myth: A winged serpent taught the elders the constellations.</p>' },
        1: { era: '⚔️ Age of Empires', desc: '<p>The heartland of the Numinorean Empire. Great ziggurats and star‑gazers who mapped the heavens.</p><p class="myth-note">🐉 Myth: The Sphinx of Numinor posed riddles to unworthy rulers.</p>' },
        2: { era: '🌊 Exodus', desc: '<p>Internal strife and drought fractured the empire. The ziggurats fell into ruin, their star‑charts scattered.</p><p class="myth-note">🐉 Myth: The Sphinx sealed itself inside the Great Ziggurat, waiting for a worthy heir.</p>' }
      }
    },
    kemet: {
      name: 'Kemet',
      era: '⚔️ Age of Empires',
      description: `
        <p>The black‑land of the Nile‑like river. Builders of colossal monuments and masters of alchemy.</p>
        <p class="myth-note">☀️ Myth: The Sun Serpent dwells beneath the great pyramid.</p>
      `,
      trade: ['🌿 Spice Route', '🪙 Gold Route'],
      eraVariants: {
        0: { era: '🌅 Dawn Era', desc: '<p>The first pharaohs united the river tribes. They began quarrying stone for the first mastabas.</p><p class="myth-note">☀️ Myth: The Sun Serpent emerged from the primordial waters to guide the first king.</p>' },
        1: { era: '⚔️ Age of Empires', desc: '<p>The black‑land of the Nile‑like river. Builders of colossal monuments and masters of alchemy.</p><p class="myth-note">☀️ Myth: The Sun Serpent dwells beneath the great pyramid.</p>' },
        2: { era: '🌊 Exodus', desc: '<p>The river changed course, bringing famine. The empire collapsed; the great monuments were buried by sand.</p><p class="myth-note">☀️ Myth: The Sun Serpent sleeps, waiting for the river to return.</p>' }
      }
    },
    thule: {
      name: 'Thule',
      era: '⚔️ Age of Empires',
      description: `
        <p>The mist‑shrouded northern isles. Fierce seafarers who hunted whales and carved runes into bone.</p>
        <p class="myth-note">🐍 Myth: The Leviathan of Thule coils beneath the ice.</p>
      `,
      trade: ['🛳️ Silk Route', '🦴 Ivory Route'],
      eraVariants: {
        0: { era: '🌅 Dawn Era', desc: '<p>Hunter‑gatherers crossed the frozen straits in skin boats. They worshipped the great whale spirits.</p><p class="myth-note">🐍 Myth: The Leviathan was a gentle giant who taught the people to sing.</p>' },
        1: { era: '⚔️ Age of Empires', desc: '<p>The mist‑shrouded northern isles. Fierce seafarers who hunted whales and carved runes into bone.</p><p class="myth-note">🐍 Myth: The Leviathan of Thule coils beneath the ice.</p>' },
        2: { era: '🌊 Exodus', desc: '<p>The ice melted, flooding the isles. The Thule people took to the sea in great dragon‑prowed ships.</p><p class="myth-note">🐍 Myth: The Leviathan rose from the depths and led the fleet to a new land.</p>' }
      }
    },
    yinshan: {
      name: 'Yin‑Shan',
      era: '⚔️ Age of Empires',
      description: `
        <p>The eastern mountain kingdoms. Terrace farmers, jade carvers, and scholars who studied the flight of birds.</p>
        <p class="myth-note">🐉 Myth: The Celestial Dragon breathes the clouds that water the terraces.</p>
      `,
      trade: ['🪙 Gold Route', '🦴 Ivory Route'],
      eraVariants: {
        0: { era: '🌅 Dawn Era', desc: '<p>Mountain tribes built cliff dwellings and worshipped the wind. They first discovered jade in the riverbeds.</p><p class="myth-note">🐉 Myth: The Celestial Dragon shed its scales, which became the first jade.</p>' },
        1: { era: '⚔️ Age of Empires', desc: '<p>The eastern mountain kingdoms. Terrace farmers, jade carvers, and scholars who studied the flight of birds.</p><p class="myth-note">🐉 Myth: The Celestial Dragon breathes the clouds that water the terraces.</p>' },
        2: { era: '🌊 Exodus', desc: '<p>Earthquakes toppled the terraces. The kingdoms fragmented, and the jade mines were abandoned.</p><p class="myth-note">🐉 Myth: The Celestial Dragon ascended to the heavens, swearing to return when the mountains are whole.</p>' }
      }
    },
    aztlan: {
      name: 'Aztlan',
      era: '⚔️ Age of Empires',
      description: `
        <p>The western jungle realm. Pyramid‑builders who tracked the stars and offered incense to feathered serpents.</p>
        <p class="myth-note">🌿 Myth: The Feathered Serpent created the first cocoa plant.</p>
      `,
      trade: ['🌿 Spice Route', '🦴 Ivory Route'],
      eraVariants: {
        0: { era: '🌅 Dawn Era', desc: '<p>Hunter‑gatherers roamed the deep jungle. They built the first earth mounds to mark the solstices.</p><p class="myth-note">🌿 Myth: The Feathered Serpent taught them to cultivate maize.</p>' },
        1: { era: '⚔️ Age of Empires', desc: '<p>The western jungle realm. Pyramid‑builders who tracked the stars and offered incense to feathered serpents.</p><p class="myth-note">🌿 Myth: The Feathered Serpent created the first cocoa plant.</p>' },
        2: { era: '🌊 Exodus', desc: '<p>The jungle grew thick and the cities were swallowed by vines. The people dispersed into smaller tribes.</p><p class="myth-note">🌿 Myth: The Feathered Serpent sleeps in the heart of the jungle, guarding the lost cities.</p>' }
      }
    }
  };

  // ---------- STATE ----------
  let activeRegion = 'zephyria';
  let currentEra = 1; // 0=Dawn, 1=Empire, 2=Exodus

  // ---------- HELPERS ----------
  function getEraLabel(index) {
    const labels = ['🌅 Dawn', '⚔️ Empire', '🌊 Exodus'];
    return labels[index] || '⚔️ Empire';
  }

  function updateLore(regionId, eraIndex) {
    const data = loreData[regionId];
    if (!data) return;

    const variant = data.eraVariants[eraIndex] || data.eraVariants[1];
    regionName.textContent = data.name;
    regionEra.textContent = variant.era;
    regionDescription.innerHTML = variant.desc;
    tradeInfo.innerHTML = data.trade.map(t => `<span class="trade-badge">${t}</span>`).join('');

    // update era markers
    eraMarkers.forEach((marker, idx) => {
      marker.classList.toggle('active-era', idx === eraIndex);
    });
  }

  function setActiveRegion(regionId) {
    // remove active class from all regions
    regions.forEach(r => r.classList.remove('active-region'));
    const target = document.querySelector(`.region[data-region="${regionId}"]`);
    if (target) target.classList.add('active-region');
    activeRegion = regionId;
    updateLore(regionId, currentEra);
  }

  // ---------- EVENT: region click ----------
  regions.forEach(region => {
    region.addEventListener('click', function (e) {
      const id = this.dataset.region;
      if (id && loreData[id]) {
        setActiveRegion(id);
      }
    });

    // hover tooltip
    region.addEventListener('mouseenter', function (e) {
      const id = this.dataset.region;
      const data = loreData[id];
      if (!data) return;
      tooltip.textContent = `${data.name} · ${getEraLabel(currentEra)}`;
      tooltip.classList.add('visible');
    });

    region.addEventListener('mousemove', function (e) {
      const mapFrame = this.closest('.map-frame');
      const rect = mapFrame.getBoundingClientRect();
      const x = e.clientX - rect.left + 12;
      const y = e.clientY - rect.top - 10;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    });

    region.addEventListener('mouseleave', function () {
      tooltip.classList.remove('visible');
    });
  });

  // ---------- EVENT: timeline slider ----------
  eraSlider.addEventListener('input', function () {
    const val = parseInt(this.value, 10);
    currentEra = val;
    updateLore(activeRegion, val);

    // update era markers
    eraMarkers.forEach((marker, idx) => {
      marker.classList.toggle('active-era', idx === val);
    });

    // (optional) animate map borders? could be extended
  });

  // ---------- EVENT: myth icon tooltip ----------
  document.querySelectorAll('.myth-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function (e) {
      const myth = this.dataset.myth || 'ancient legend';
      tooltip.textContent = `⚡ ${myth.charAt(0).toUpperCase() + myth.slice(1)} site`;
      tooltip.classList.add('visible');
    });
    icon.addEventListener('mousemove', function (e) {
      const mapFrame = this.closest('.map-frame');
      const rect = mapFrame.getBoundingClientRect();
      const x = e.clientX - rect.left + 12;
      const y = e.clientY - rect.top - 10;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    });
    icon.addEventListener('mouseleave', function () {
      tooltip.classList.remove('visible');
    });
  });

  // ---------- INIT ----------
  function init() {
    // set default active region
    setActiveRegion('zephyria');
    // set default era slider position
    eraSlider.value = currentEra;
    eraMarkers.forEach((marker, idx) => {
      marker.classList.toggle('active-era', idx === currentEra);
    });
  }

  init();

})();