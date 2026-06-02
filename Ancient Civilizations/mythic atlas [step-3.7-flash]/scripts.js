// CODEX MUNDI - Interactive Atlas of the Ancient World
// Antiquarian Cartography Engine

class AncientAtlas {
  constructor() {
    this.currentView = 'political';
    this.currentEra = 2; // Age of Heroes (index 2)
    this.selectedRegion = null;
    this.caravanAnimationId = null;
    
    // Era data with different border configurations
    this.eraData = {
      0: { // Age of Dawn
        name: 'The Age of Dawn',
        regions: {
          aethoria: { path: 'M150,200 L230,170 L300,210 L330,270 L290,330 L230,350 L170,310 L130,250 Z', color: '#c9a87c' },
          valdoria: { path: 'M80,80 L180,60 L260,100 L240,180 L160,200 L80,160 Z', color: '#7a9bb8' },
          zephyria: { path: 'M450,180 L600,160 L700,200 L730,280 L670,340 L550,360 L470,300 L430,240 Z', color: '#d4b896' },
          thalassia: { path: 'M320,420 L420,390 L490,450 L470,530 L390,570 L310,520 L290,450 Z', color: '#8fb8c9' },
          nordheim: { path: 'M600,80 L750,60 L850,100 L870,180 L800,230 L700,220 L630,160 Z', color: '#9b8b7a' },
          kemetia: { path: 'M450,480 L600,460 L730,500 L770,580 L700,660 L550,680 L450,630 L430,560 Z', color: '#d4a574' }
        }
      },
      1: { // Age of Kings
        name: 'The Age of Kings',
        regions: {
          aethoria: { path: 'M180,240 L260,210 L330,250 L360,310 L320,370 L260,390 L200,350 L160,290 Z', color: '#c9a87c' },
          valdoria: { path: 'M100,100 L200,80 L280,120 L260,200 L180,220 L100,180 Z', color: '#7a9bb8' },
          zephyria: { path: 'M500,200 L650,180 L750,220 L780,300 L720,360 L600,380 L520,320 L480,260 Z', color: '#d4b896' },
          thalassia: { path: 'M350,450 L450,420 L520,480 L500,560 L420,600 L340,550 L320,480 Z', color: '#8fb8c9' },
          nordheim: { path: 'M650,100 L800,80 L900,120 L920,200 L850,250 L750,240 L680,180 Z', color: '#9b8b7a' },
          kemetia: { path: 'M500,500 L650,480 L780,520 L820,600 L750,680 L600,700 L500,650 L480,580 Z', color: '#d4a574' }
        }
      },
      2: { // Age of Heroes
        name: 'The Age of Heroes',
        regions: {
          aethoria: { path: 'M200,250 L280,220 L350,260 L380,320 L340,380 L280,400 L220,360 L180,300 Z', color: '#c9a87c' },
          valdoria: { path: 'M100,100 L200,80 L280,120 L260,200 L180,220 L100,180 Z', color: '#7a9bb8' },
          zephyria: { path: 'M500,200 L650,180 L750,220 L780,300 L720,360 L600,380 L520,320 L480,260 Z', color: '#d4b896' },
          thalassia: { path: 'M350,450 L450,420 L520,480 L500,560 L420,600 L340,550 L320,480 Z', color: '#8fb8c9' },
          nordheim: { path: 'M650,100 L800,80 L900,120 L920,200 L850,250 L750,240 L680,180 Z', color: '#9b8b7a' },
          kemetia: { path: 'M500,500 L650,480 L780,520 L820,600 L750,680 L600,700 L500,650 L480,580 Z', color: '#d4a574' }
        }
      },
      3: { // Age of Empires
        name: 'The Age of Empires',
        regions: {
          aethoria: { path: 'M220,230 L300,200 L370,240 L400,300 L360,360 L300,380 L240,340 L200,280 Z', color: '#c9a87c' },
          valdoria: { path: 'M120,120 L220,100 L300,140 L280,220 L200,240 L120,200 Z', color: '#7a9bb8' },
          zephyria: { path: 'M480,180 L630,160 L730,200 L760,280 L700,340 L580,360 L500,300 L460,240 Z', color: '#d4b896' },
          thalassia: { path: 'M330,430 L430,400 L500,460 L480,540 L400,580 L320,530 L300,460 Z', color: '#8fb8c9' },
          nordheim: { path: 'M670,120 L820,100 L920,140 L940,220 L870,270 L770,260 L700,200 Z', color: '#9b8b7a' },
          kemetia: { path: 'M520,480 L670,460 L800,500 L840,580 L770,660 L620,680 L520,630 L500,560 Z', color: '#d4a574' }
        }
      },
      4: { // Age of Twilight
        name: 'The Age of Twilight',
        regions: {
          aethoria: { path: 'M180,260 L260,230 L330,270 L360,330 L320,390 L260,410 L200,370 L160,310 Z', color: '#c9a87c' },
          valdoria: { path: 'M80,80 L180,60 L260,100 L240,180 L160,200 L80,160 Z', color: '#7a9bb8' },
          zephyria: { path: 'M520,220 L670,200 L770,240 L800,320 L740,380 L620,400 L540,340 L500,280 Z', color: '#d4b896' },
          thalassia: { path: 'M370,470 L470,440 L540,500 L520,580 L440,620 L360,570 L340,500 Z', color: '#8fb8c9' },
          nordheim: { path: 'M630,80 L780,60 L880,100 L900,180 L830,230 L730,220 L660,160 Z', color: '#9b8b7a' },
          kemetia: { path: 'M480,520 L630,500 L760,540 L800,620 L730,700 L580,720 L480,670 L460,600 Z', color: '#d4a574' }
        }
      }
    };

    // Lore data for each civilization
    this.loreData = {
      aethoria: {
        name: 'Aethoria',
        subtitle: 'The Cradle of Philosophy',
        description: 'Aethoria stands as the beacon of wisdom and artistic achievement in the ancient world. Its marble cities rise from the azure coast, home to philosophers, poets, and heroes whose names echo through eternity.',
        history: 'Founded by the legendary hero Perseus Aethon, Aethoria grew from a collection of city-states into a sophisticated civilization that valued democracy, philosophy, and the pursuit of knowledge above all else.',
        culture: 'The Aethorians are known for their love of debate, their magnificent temples to the gods of wisdom, and their unrivaled navy that patrols the Azure Sea.',
        trade: 'Aethoria maintains extensive trade routes with Zephyria, exchanging olive oil, wine, and philosophical texts for spices, silk, and precious metals.'
      },
      valdoria: {
        name: 'Valdoria',
        subtitle: 'The Realm of Eternal Winter',
        description: 'In the frozen northern reaches, Valdoria thrives where others would perish. Its people are warriors, seafarers, and masters of the harsh northern seas.',
        history: 'Settled by the great explorer Thorin Ironhand, Valdoria expanded through a combination of fierce independence and strategic alliances with neighboring realms.',
        culture: 'Valdorian society revolves around the great halls where warriors gather to share tales of adventure. Their shipbuilding skills are unmatched, and their longships can navigate the stormiest seas.',
        trade: 'Valdoria trades furs, iron, and amber with Nordheim and Aethoria, their caravans braving the mountain passes to reach southern markets.'
      },
      zephyria: {
        name: 'Zephyria',
        subtitle: 'Empire of the Rising Sun',
        description: 'Zephyria stretches across the eastern lands, a vast empire of ancient wisdom, magnificent palaces, and intricate gardens that stretch to the horizon.',
        history: 'The Zephyrian Empire was forged by Cyrus the Great, who united warring tribes into the largest civilization the world has ever known. Their capital, Persepolis, shines like a jewel in the desert sun.',
        culture: 'Zephyrians are masters of administration, engineering, and art. Their Royal Road connects the farthest reaches of the empire, allowing messengers to travel with unprecedented speed.',
        trade: 'The Silk Road begins in Zephyria, carrying exotic goods from distant lands. They trade spices, textiles, and precious stones with all neighboring civilizations.'
      },
      thalassia: {
        name: 'Thalassia',
        subtitle: 'Masters of the Azure Sea',
        description: 'Thalassia controls the maritime trade routes of the ancient world. Their purple-dyed sails are seen on every sea, and their merchant ships carry goods from every corner of the known world.',
        history: 'Founded by the cunning princess Europa, Thalassia grew from a single port city into a thalassocracy that dominates sea trade through superior navigation and commercial acumen.',
        culture: 'Thalassians are born sailors, their children learning to navigate by the stars before they can walk. Their alphabet revolutionized record-keeping and spread throughout the Mediterranean.',
        trade: 'Thalassia serves as the primary trade intermediary, connecting Kemetia, Aethoria, and Zephyria through maritime routes. They trade purple dye, glass, and manufactured goods.'
      },
      nordheim: {
        name: 'Nordheim',
        subtitle: 'The Northern Kingdom',
        description: 'Nordheim stands at the crossroads of the ancient world, a kingdom of forests, fjords, and fertile plains that bridges the northern wilderness with southern civilization.',
        history: 'The Nordheim people descended from the fierce tribes that once challenged the great empires. Under King Frederick the Wise, they transformed into a sophisticated kingdom while retaining their warrior traditions.',
        culture: 'Nordheim is known for its craftsmanship, particularly in metalwork and woodworking. Their mead halls are legendary, where skalds compose epic poems of heroic deeds.',
        trade: 'Nordheim trades timber, iron, and honey with Valdoria and Aethoria, their merchant caravans crossing the mountain passes to reach southern markets.'
      },
      kemetia: {
        name: 'Kemetia',
        subtitle: 'Gift of the Nile',
        description: 'Kemetia flourishes along the great river that gives it life. Its monuments to the gods rise from the desert sands, testaments to a civilization that has endured for millennia.',
        history: 'The oldest continuous civilization in the known world, Kemetia traces its lineage to the divine pharaohs who first tamed the Nile. Their monumental architecture and complex religion have influenced all neighboring cultures.',
        culture: 'Kemetians are masters of architecture, medicine, and astronomy. Their priests serve as intermediaries between the mortal world and the divine, their knowledge preserved in sacred hieroglyphs.',
        trade: 'Kemetia trades grain, papyrus, and linen throughout the ancient world. Their caravans reach Zephyria and Thalassia, bringing the bounty of the Nile to distant markets.'
      }
    };

    // Trade route data
    this.tradeRoutes = {
      1: {
        name: 'The Royal Road',
        type: 'land',
        from: 'Athens',
        to: 'Persepolis',
        goods: ['Olive Oil', 'Wine', 'Philosophical Texts', 'Spices', 'Silk', 'Precious Metals'],
        description: 'The primary overland trade route connecting Aethoria and Zephyria, traversing mountain passes and fertile valleys.'
      },
      2: {
        name: 'The Northern Passage',
        type: 'land',
        from: 'Valhalla',
        to: 'Bergen',
        goods: ['Furs', 'Iron', 'Amber', 'Timber', 'Honey'],
        description: 'A rugged trade route through the northern mountains, braved by hardy merchants and their caravans.'
      },
      3: {
        name: 'The Azure Sea Route',
        type: 'maritime',
        from: 'Tyre',
        to: 'Thebes',
        goods: ['Purple Dye', 'Glass', 'Grain', 'Papyrus', 'Linen'],
        description: 'The busiest maritime trade route, connecting the great port of Tyre with the ancient markets of Kemetia.'
      },
      4: {
        name: 'The Eastern Caravan Trail',
        type: 'land',
        from: 'Persepolis',
        to: 'Thebes',
        goods: ['Spices', 'Textiles', 'Precious Stones', 'Incense', 'Exotic Animals'],
        description: 'A vital trade corridor linking the Zephyrian Empire with Kemetia, crossing desert oases and fertile river valleys.'
      }
    };

    // Mythological sites data
    this.mythSites = {
      olympus: {
        name: 'Mount Olympus',
        type: 'Sacred Mountain',
        description: 'The dwelling place of the gods, where Zeus and his divine council watch over the mortal world. Only the most worthy heroes may ascend its slopes.',
        significance: 'Home of the Olympian pantheon. The mountain\'s peak is perpetually shrouded in clouds, and lightning is said to be the work of Zeus himself.',
        rituals: 'Pilgrims leave offerings of honey cakes and wine at the mountain\'s base, hoping to catch a glimpse of the divine.'
      },
      delphi: {
        name: 'Oracle of Delphi',
        type: 'Prophetic Site',
        description: 'The most revered oracle in the ancient world, where the priestess Pythia channels the will of Apollo to reveal hidden truths.',
        significance: 'All major decisions in Aethoria and beyond are made only after consulting the Oracle. Her prophecies have shaped the course of history.',
        rituals: 'Pilgrims purify themselves at the Castalian Spring before consulting the Oracle, bringing lavish gifts to secure favorable prophecy.'
      },
      yggdrasil: {
        name: 'Yggdrasil',
        type: 'World Tree',
        description: 'The great ash tree that connects the nine worlds of Norse cosmology. Its roots drink from the well of wisdom, and its branches reach into the heavens.',
        significance: 'The axis mundi of Valdorian belief. The gods gather beneath Yggdrasil for their daily councils, and the tree\'s health determines the fate of all creation.',
        rituals: 'Sacred blots are performed at the tree\'s base, with offerings of mead and carved runes placed in its bark.'
      },
      phoenix: {
        name: 'Phoenix Nest',
        type: 'Mythical Beast Lair',
        description: 'The hidden nest of the immortal phoenix, a bird of fire that cyclically regenerates, burning itself to ash only to rise again renewed.',
        significance: 'The phoenix\'s tears are said to have healing properties, and its feathers are prized by kings and emperors. The nest is made of cinnamon and frankincense.',
        rituals: 'Only those pure of heart may approach the nest. The phoenix appears only once every 500 years, and its song is said to grant temporary immortality.'
      },
      underworld: {
        name: 'Gates of Hades',
        type: 'Underworld Entrance',
        description: 'The threshold between the world of the living and the realm of the dead. Guarded by the three-headed dog Cerberus, none may pass without proper rites.',
        significance: 'The final destination of all mortals. Heroes have descended into the underworld to retrieve loved ones or gain forbidden knowledge, but few return unchanged.',
        rituals: 'The dead are buried with a coin to pay Charon, the ferryman. Annual festivals honor the dead, when the veil between worlds grows thin.'
      }
    };

    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.initializeAnimations();
    this.startCaravanAnimations();
    this.initializeTooltips();
  }

  cacheDOM() {
    // Main elements
    this.svg = document.querySelector('.ancient-map');
    this.politicalLayer = document.getElementById('politicalLayer');
    this.tradeLayer = document.getElementById('tradeLayer');
    this.mythLayer = document.getElementById('mythLayer');
    this.terrainLayer = document.getElementById('terrainLayer');
    this.infoPanel = document.getElementById('infoPanel');
    this.panelContent = document.getElementById('panelContent');
    this.closePanel = document.getElementById('closePanel');
    this.timelineSlider = document.getElementById('timelineSlider');
    this.currentEraDisplay = document.getElementById('currentEra');
    this.tooltip = document.getElementById('mapTooltip');
    this.controlBtns = document.querySelectorAll('.control-btn');
    this.timelineMarkers = document.querySelectorAll('.marker');
    
    // Region elements
    this.regions = document.querySelectorAll('.region');
    this.cities = document.querySelectorAll('.city-marker');
    this.sacredSites = document.querySelectorAll('.sacred-site');
    this.caravans = document.querySelectorAll('.caravan');
  }

  bindEvents() {
    // View control buttons
    this.controlBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        this.switchView(view);
        
        // Update active button
        this.controlBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Region clicks
    this.regions.forEach(region => {
      region.addEventListener('click', (e) => {
        if (region.classList.contains('unclaimed')) return;
        this.selectRegion(region);
      });

      region.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, region.dataset.civilization);
      });

      region.addEventListener('mousemove', (e) => {
        this.moveTooltip(e);
      });

      region.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });

    // City clicks
    this.cities.forEach(city => {
      city.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCity(city);
      });

      city.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, city.dataset.city, true);
      });

      city.addEventListener('mousemove', (e) => {
        this.moveTooltip(e);
      });

      city.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });

    // Sacred site clicks
    this.sacredSites.forEach(site => {
      site.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectSacredSite(site);
      });

      site.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, site.dataset.myth, false, true);
      });

      site.addEventListener('mousemove', (e) => {
        this.moveTooltip(e);
      });

      site.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });

    // Close panel
    this.closePanel.addEventListener('click', () => {
      this.closeInfoPanel();
    });

    // Timeline slider
    this.timelineSlider.addEventListener('input', (e) => {
      const era = parseInt(e.target.value);
      this.changeEra(era);
    });

    // Timeline markers
    this.timelineMarkers.forEach(marker => {
      marker.addEventListener('click', () => {
        const era = parseInt(marker.dataset.era);
        this.timelineSlider.value = era;
        this.changeEra(era);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeInfoPanel();
      }
    });

    // Click outside to close panel
    document.addEventListener('click', (e) => {
      if (!this.infoPanel.contains(e.target) && 
          !e.target.closest('.region') && 
          !e.target.closest('.city-marker') && 
          !e.target.closest('.sacred-site')) {
        this.closeInfoPanel();
      }
    });
  }

  switchView(view) {
    this.currentView = view;
    
    // Hide all layers first
    this.politicalLayer.style.opacity = '0';
    this.tradeLayer.classList.remove('visible');
    this.mythLayer.classList.remove('visible');
    this.terrainLayer.classList.remove('visible');
    
    // Show selected layer with delay for smooth transition
    setTimeout(() => {
      switch(view) {
        case 'political':
          this.politicalLayer.style.opacity = '1';
          break;
        case 'trade':
          this.tradeLayer.classList.add('visible');
          this.restartCaravanAnimations();
          break;
        case 'myth':
          this.mythLayer.classList.add('visible');
          break;
        case 'terrain':
          this.terrainLayer.classList.add('visible');
          break;
      }
    }, 300);
  }

  selectRegion(region) {
    // Remove active class from all regions
    this.regions.forEach(r => r.classList.remove('active'));
    
    // Add active class to selected region
    region.classList.add('active');
    this.selectedRegion = region;
    
    const civKey = region.dataset.civilization;
    const lore = this.loreData[civKey];
    
    if (lore) {
      this.displayLore(lore);
    }
  }

  selectCity(city) {
    const cityName = city.dataset.city;
    let info = '';
    
    // Find which region this city belongs to
    const region = city.closest('.region') || city.parentElement.closest('.region');
    if (region) {
      const civKey = region.dataset.civilization;
      const lore = this.loreData[civKey];
      if (lore) {
        info = `<div class="lore-entry">
          <h3 class="lore-title">${this.capitalizeFirst(cityName)}</h3>
          <p class="lore-subtitle">${lore.name} - Major City</p>
          <p class="lore-text">${lore.description} This bustling metropolis serves as a key hub in the region's trade and cultural exchange.</p>
        </div>`;
      }
    }
    
    this.showInfoPanel(`${this.capitalizeFirst(cityName)}`, info);
  }

  selectSacredSite(site) {
    const mythKey = site.dataset.myth;
    const mythData = this.mythSites[mythKey];
    
    if (mythData) {
      const content = `
        <div class="lore-entry">
          <h3 class="lore-title">${mythData.name}</h3>
          <p class="lore-subtitle">${mythData.type}</p>
          <p class="lore-text">${mythData.description}</p>
        </div>
        <div class="myth-annotation">
          <strong>Significance:</strong> ${mythData.significance}
        </div>
        <div class="lore-entry">
          <h3 class="lore-title">Rituals & Worship</h3>
          <p class="lore-text">${mythData.rituals}</p>
        </div>
      `;
      
      this.showInfoPanel(mythData.name, content);
    }
  }

  displayLore(lore) {
    const content = `
      <div class="lore-entry">
        <h3 class="lore-title">${lore.name}</h3>
        <p class="lore-subtitle">${lore.subtitle}</p>
        <p class="lore-text">${lore.description}</p>
      </div>
      <div class="lore-entry">
        <h3 class="lore-title">History & Origins</h3>
        <p class="lore-text">${lore.history}</p>
      </div>
      <div class="lore-entry">
        <h3 class="lore-title">Culture & Society</h3>
        <p class="lore-text">${lore.culture}</p>
      </div>
      <div class="lore-entry">
        <h3 class="lore-title">Trade & Economy</h3>
        <p class="lore-text">${lore.trade}</p>
      </div>
    `;
    
    this.showInfoPanel(lore.name, content);
  }

  showInfoPanel(title, content) {
    this.panelContent.innerHTML = content || '<p class="lore-text">No information available.</p>';
    this.infoPanel.classList.add('open');
    
    // Re-trigger animations
    const entries = this.panelContent.querySelectorAll('.lore-entry');
    entries.forEach((entry, index) => {
      entry.style.animation = 'none';
      setTimeout(() => {
        entry.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
      }, 10);
    });
  }

  closeInfoPanel() {
    this.infoPanel.classList.remove('open');
    this.regions.forEach(r => r.classList.remove('active'));
    this.selectedRegion = null;
  }

  changeEra(eraIndex) {
    this.currentEra = eraIndex;
    const eraData = this.eraData[eraIndex];
    
    // Update era display
    this.currentEraDisplay.textContent = eraData.name;
    
    // Update timeline markers
    this.timelineMarkers.forEach(marker => {
      marker.classList.toggle('active', parseInt(marker.dataset.era) === eraIndex);
    });
    
    // Animate region changes
    this.animateRegionTransition(eraData.regions);
  }

  animateRegionTransition(newRegions) {
    // Fade out current regions
    this.regions.forEach(region => {
      region.style.transition = 'opacity 0.5s ease';
      region.style.opacity = '0';
    });
    
    setTimeout(() => {
      // Update region paths
      Object.keys(newRegions).forEach(civKey => {
        const region = document.querySelector(`.region[data-civilization="${civKey}"]`);
        if (region) {
          region.setAttribute('d', newRegions[civKey].path);
          region.style.fill = newRegions[civKey].color;
          region.style.opacity = '0.7';
        }
      });
      
      // Fade back in
      setTimeout(() => {
        this.regions.forEach(region => {
          region.style.opacity = '0.7';
        });
      }, 50);
    }, 500);
  }

  showTooltip(e, dataKey, isCity = false, isMyth = false) {
    let content = '';
    
    if (isCity) {
      content = this.capitalizeFirst(dataKey);
    } else if (isMyth) {
      const mythData = this.mythSites[dataKey];
      content = mythData ? mythData.name : dataKey;
    } else {
      const lore = this.loreData[dataKey];
      content = lore ? lore.name : dataKey;
    }
    
    this.tooltip.querySelector('.tooltip-content').textContent = content;
    this.tooltip.classList.add('visible');
    this.moveTooltip(e);
  }

  moveTooltip(e) {
    this.tooltip.style.left = `${e.clientX}px`;
    this.tooltip.style.top = `${e.clientY - 10}px`;
  }

  hideTooltip() {
    this.tooltip.classList.remove('visible');
  }

  initializeAnimations() {
    // Animate regions on load
    this.regions.forEach((region, index) => {
      region.style.opacity = '0';
      region.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        region.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        region.style.opacity = '0.7';
        region.style.transform = 'scale(1)';
      }, 200 + index * 100);
    });

    // Animate cities
    this.cities.forEach((city, index) => {
      city.style.opacity = '0';
      setTimeout(() => {
        city.style.transition = 'opacity 0.5s ease';
        city.style.opacity = '1';
      }, 800 + index * 50);
    });

    // Animate sacred sites
    this.sacredSites.forEach((site, index) => {
      site.style.opacity = '0';
      site.style.transform = 'scale(0)';
      
      setTimeout(() => {
        site.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        site.style.opacity = '1';
        site.style.transform = 'scale(1)';
      }, 1200 + index * 100);
    });
  }

  startCaravanAnimations() {
    this.caravans.forEach((caravan, index) => {
      const route = caravan.dataset.route;
      const routePath = this.getRoutePath(route);
      
      if (routePath) {
        caravan.style.offsetPath = `path('${routePath}')`;
        caravan.style.animation = `moveCaravan 8s linear infinite`;
        caravan.style.animationDelay = `${index * 2}s`;
      }
    });
  }

  restartCaravanAnimations() {
    this.caravans.forEach(caravan => {
      caravan.style.animation = 'none';
      setTimeout(() => {
        caravan.style.animation = 'moveCaravan 8s linear infinite';
      }, 10);
    });
  }

  getRoutePath(routeId) {
    const routes = {
      1: 'M280,320 Q400,280 520,280',
      2: 'M180,160 Q400,140 750,160',
      3: 'M420,520 Q500,580 600,600',
      4: 'M650,300 Q680,450 650,550'
    };
    return routes[routeId] || '';
  }

  initializeTooltips() {
    // Add hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('.region, .city-marker, .sacred-site');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.1)';
      });
      
      el.addEventListener('mouseleave', function() {
        this.style.filter = '';
      });
    });
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Parallax effect for map on mouse move
  initParallax() {
    const mapWrapper = document.querySelector('.map-wrapper');
    
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 100;
      const y = (window.innerHeight / 2 - e.clientY) / 100;
      
      if (mapWrapper) {
        mapWrapper.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }
}

// Additional Interactive Features
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.init();
  }

  init() {
    // Create floating dust particles for atmosphere
    this.createParticles();
    this.animate();
  }

  createParticles() {
    const container = document.querySelector('.atlas-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(184, 134, 11, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
        animation-delay: ${Math.random() * -20}s;
      `;
      document.body.appendChild(particle);
    }
  }

  animate() {
    // Additional particle animations can be added here
  }
}

// Sound Effects Manager (optional enhancement)
class SoundManager {
  constructor() {
    this.enabled = false;
    this.audioContext = null;
  }

  init() {
    // Initialize Web Audio API for immersive sound effects
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  playHoverSound() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playClickSound() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Main atlas application
  const atlas = new AncientAtlas();
  
  // Optional: Initialize parallax effect
  atlas.initParallax();
  
  // Optional: Initialize particle system for atmosphere
  const particles = new ParticleSystem();
  
  // Optional: Initialize sound manager
  const soundManager = new SoundManager();
  
  // Expose to global scope for debugging
  window.atlas = atlas;
  window.soundManager = soundManager;
  
  // Add loading complete class to body
  document.body.classList.add('loaded');
  
  console.log('🏛️  Codex Mundi - Atlas of the Ancient World');
  console.log('📜 The ancient map awakens...');
  console.log('✨ Click on regions, cities, and sacred sites to explore their secrets.');
  console.log('⏳ Use the timeline to journey through the ages.');
  console.log('🗺️  Toggle between Political, Trade, Myth, and Terrain views.');
});

// Add dynamic CSS for floating particles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
  @keyframes floatParticle {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
      opacity: 0;
    }
  }
  
  .dust-particle {
    position: fixed;
    pointer-events: none;
    z-index: 1;
  }
`;
document.head.appendChild(particleStyles);