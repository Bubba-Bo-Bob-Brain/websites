/* ═══════════════════════════════════════════════════════════════════
   NEXUS//BIO — Post-Apocalyptic Biopunk RPG JavaScript
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ========================
  // INITIALIZATION
  // ========================
  document.addEventListener('DOMContentLoaded', function () {
    initSporeParticles();
    initTypedText();
    initStatCounters();
    initMutationFilters();
    initMapInteractions();
    initTechTreeInteractions();
    initScrollAnimations();
    initNavigationTracking();
    initSurvivalCardEffects();
  });

  // ========================
  // SPORE PARTICLES
  // ========================
  function initSporeParticles() {
    const container = document.getElementById('sporeContainer');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const spore = document.createElement('div');
      spore.classList.add('spore');

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 20;
      const opacity = Math.random() * 0.5 + 0.1;

      spore.style.width = size + 'px';
      spore.style.height = size + 'px';
      spore.style.left = left + '%';
      spore.style.animationDuration = duration + 's';
      spore.style.animationDelay = '-' + delay + 's';
      spore.style.opacity = opacity;

      // Randomize color tint
      const colors = [
        'rgba(0,255,136,',  // green
        'rgba(0,240,255,',  // cyan
        'rgba(180,74,255,', // purple
        'rgba(255,170,0,'   // amber
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      spore.style.background = color + '0.7)';
      spore.style.boxShadow = '0 0 ' + (size * 3) + 'px ' + color + '0.4)';

      container.appendChild(spore);
    }
  }

  // ========================
  // TYPED TEXT EFFECT
  // ========================
  function initTypedText() {
    const el = document.getElementById('typedText');
    const phrases = [
      'Initializing genetic matrix...',
      'Scanning contaminated zones...',
      'Loading mutation registry...',
      'Decoding bio-enhancement protocols...',
      'Syncing neural interface...',
      'Welcome, Survivor. Stay adaptive.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 40;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        // Typing forward
        el.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          // Pause before deleting
          if (phraseIndex === phrases.length - 1) {
            // Last phrase — hold longer and stop
            setTimeout(function () {
              isDeleting = true;
              typingSpeed = 20;
              type();
            }, 3000);
            return;
          }
          setTimeout(function () {
            isDeleting = true;
            typingSpeed = 20;
            type();
          }, 1500);
          return;
        }

        typingSpeed = 30 + Math.random() * 50;
      } else {
        // Deleting backward
        el.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typingSpeed = 200;
        }

        typingSpeed = 15;
      }

      setTimeout(type, typingSpeed);
    }

    // Delay the start so the system line finishes first
    setTimeout(type, 2200);
  }

  // ========================
  // STAT COUNTER ANIMATION
  // ========================
  function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    let animated = false;

    function checkScroll() {
      if (animated) return;

      const heroSection = document.getElementById('hero');
      const rect = heroSection.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        animated = true;
        statValues.forEach(function (el) {
          const target = parseInt(el.getAttribute('data-count'), 10);
          animateValue(el, 0, target, 1800);
        });
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    // Also check on load
    checkScroll();
  }

  function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    const isFloat = !Number.isInteger(end);

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + range * eased;

      element.textContent = isFloat ? Math.floor(current) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = end;
        if (end === 147) element.textContent = end;
      }
    }

    requestAnimationFrame(update);
  }

  // ========================
  // MUTATION FILTERS
  // ========================
  function initMutationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.mutation-card');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active button
        filterButtons.forEach(function (b) { return b.classList.remove('active'); });
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        cards.forEach(function (card) {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.animation = 'cardReveal 0.4s ease-out forwards';
          } else {
            card.style.animation = 'cardHide 0.3s ease-in forwards';
            setTimeout(function () {
              if (card.parentElement) {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });

    // Inject filter animation keyframes
    const style = document.createElement('style');
    style.textContent =
      '@keyframes cardReveal { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }' +
      '@keyframes cardHide { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9) translateY(10px); } }';
    document.head.appendChild(style);
  }

  // ========================
  // CONTAMINATION MAP
  // ========================
  function initMapInteractions() {
    const zones = document.querySelectorAll('.map-zone');
    const detailPanel = document.getElementById('zoneDetail');
    const detailName = document.getElementById('zoneDetailName');
    const detailBody = document.getElementById('zoneDetailBody');
    const closeBtn = document.getElementById('zoneCloseBtn');

    const zoneData = {
      'Omega-7': {
        name: 'Zone Ω-7 — Meltdown Crater',
        threat: 'EXTREME',
        color: 'var(--neon-red)',
        content:
          '<p><strong>Classification:</strong> Omega-Level Biohazard</p>' +
          '<p><strong>Location:</strong> Former Site 42 — Eastern Seaboard Collapse Zone</p>' +
          '<p><strong>Threat Profile:</strong> Ground zero of the 2071 nuclear-biological cascade event. Radiation levels exceed 4,000 rads/hour at the epicenter. Mutant apex predators — designated "Titanforms" — patrol the crater rim. The molten core beneath continues to generate novel bio-organisms at an accelerating rate.</p>' +
          '<p><strong>Flora:</strong> Bioluminescent crystalline growths (highly toxic when touched). Fungal networks extend 200m below surface.</p>' +
          '<p><strong>Recommended Gear:</strong> Class-VI hazmat, anti-radiation serums (x3 minimum), plasma weaponry.</p>' +
          '<div class="survival-tip"><span class="tip-label">Intel Warning</span><span class="tip-text">Three expedition teams have entered in the past year. None returned. Satellite imagery shows organic structures forming at the crater center.</span></div>'
      },
      'Delta-3': {
        name: 'Zone Δ-3 — Spore Forest',
        threat: 'HIGH',
        color: 'var(--neon-amber)',
        content:
          '<p><strong>Classification:</strong> High-Risk Bio-Active Zone</p>' +
          '<p><strong>Location:</strong> Pacific Northwest — Former Oregon Temperate Rainforest</p>' +
          '<p><strong>Threat Profile:</strong> A 15km² forest of genetically mutated fungal growth. Spore clouds cause hallucinations, memory loss, and involuntary mutation triggers. The air itself is a delivery mechanism for parasitic mycelium that can colonize a human host in 6-12 hours.</p>' +
          '<p><strong>Flora:</strong> Towering capsid-trees (40m+), spore-shroom clusters, neural-thread vines.</p>' +
          '<p><strong>Recommended Gear:</strong> Sealed respirator, anti-fungal agents, incendiary tools.</p>' +
          '<div class="survival-tip"><span class="tip-label">Survivor Note</span><span class="tip-text">The spores react to body heat. Travel at night when ambient temperatures drop below 8°C to reduce spore activation.</span></div>'
      },
      'Omega-1': {
        name: 'Zone Ω-1 — Genesis Lab',
        threat: 'EXTREME',
        color: 'var(--neon-red)',
        content:
          '<p><strong>Classification:</strong> Sealed Origin Site</p>' +
          '<p><strong>Location:</strong> Coordinates classified — deep desert sector</p>' +
          '<p><strong>Threat Profile:</strong> The research facility where the original bio-weapons were engineered. Automated defense systems remain partially operational. The laboratory vats still contain viable prototype organisms — some dormant, some not. Genetic experiments here produced 60% of the known aggressive mutations.</p>' +
          '<p><strong>Intel:</strong> Rumor persists of a sealed vault containing the "Genesis Sequence" — the original DNA blueprint for all current mutations.</p>' +
          '<p><strong>Recommended Gear:</strong> Full tactical exoskeleton, EMP shielding, squad-level armament.</p>' +
          '<div class="survival-tip"><span class="tip-label">Faction Intel</span><span class="tip-text">Genos Collective has dispatched 4 retrieval teams. None have reported back. Iron Circuit considers it a strategic asset.</span></div>'
      },
      'Beta-5': {
        name: 'Zone β-5 — Rust Dunes',
        threat: 'MEDIUM',
        color: 'var(--neon-cyan)',
        content:
          '<p><strong>Classification:</strong> Moderate Contamination Zone</p>' +
          '<p><strong>Location:</strong> Former industrial corridor — Great Lakes Region</p>' +
          '<p><strong>Threat Profile:</strong> Once a major manufacturing hub, now a sprawling desert of oxidized metal and contaminated sand. Mutated scorpion colonies nest in abandoned vehicles. Metal-corroding bacteria make prolonged equipment exposure dangerous. Radiation levels are moderate but consistent.</p>' +
          '<p><strong>Resources:</strong> Salvageable pre-collapse metals, chemical stores, underground bunkers with potential intact supplies.</p>' +
          '<p><strong>Recommended Gear:</strong> Sand filtration mask, anti-corrosion spray, UV-rated eye protection.</p>' +
          '<div class="survival-tip"><span class="tip-label">Trade Route</span><span class="tip-text">Despite the danger, Rust Dunes is a key trade corridor. Well-armed caravans pass through weekly — consider joining one rather than going solo.</span></div>'
      },
      'Gamma-9': {
        name: 'Zone γ-9 — The Bloom',
        threat: 'HIGH',
        color: 'var(--neon-amber)',
        content:
          '<p><strong>Classification:</strong> Rapidly Expanding Bio-Zone</p>' +
          '<p><strong>Location:</strong> Mississippi River Basin</p>' +
          '<p><strong>Threat Profile:</strong> A massive, living organic structure spreading at approximately 2km/month. "The Bloom" is a continent-scale fungal organism that converts all organic matter into bio-mass. Trees, buildings, animals — all are absorbed and re-purposed. The air is thick with reproductive spores.</p>' +
          '<p><strong>Anomalies:</strong> Reports of humanoid figures moving within The Bloom, suggesting partial assimilation creates a hive-linked hybrid organism.</p>' +
          '<p><strong>Recommended Gear:</strong> Flame-based weaponry, bio-acid resistant armor, extraction beacon.</p>' +
          '<div class="survival-tip"><span class="tip-label">Critical Notice</span><span class="tip-text">Do NOT consume any water within 50km of The Bloom. All water sources show 98% mycelium saturation.</span></div>'
      },
      'Alpha-2': {
        name: 'Zone α-2 — Settler\'s Edge',
        threat: 'LOW',
        color: 'var(--neon-green)',
        content:
          '<p><strong>Classification:</strong> Low-Risk Transition Zone</p>' +
          '<p><strong>Location:</strong> Eastern borderlands — former farmland region</p>' +
          '<p><strong>Threat Profile:</strong> One of the safer regions outside walled settlements. Minor mutation activity — mostly cosmetic flora changes and small fauna mutations. Radiation is negligible. Occasional raider incursions from deeper zones are the primary concern.</p>' +
          '<p><strong>Resources:</strong> Viable farmland, fresh water from deep wells, pre-collapse seed vault discovered in 2089.</p>' +
          '<p><strong>Recommended Gear:</strong> Standard survival kit, trade goods, diplomatic credentials.</p>' +
          '<div class="survival-tip"><span class="tip-label">Settler\'s Tip</span><span class="tip-text">Settler\'s Edge is the best place to recruit new party members. The local trading post is neutral ground for all factions.</span></div>'
      },
      'Beta-1': {
        name: 'Zone β-1 — Submerged City',
        threat: 'MEDIUM',
        color: 'var(--neon-cyan)',
        content:
          '<p><strong>Classification:</strong> Flooded Urban Bio-Hazard</p>' +
          '<p><strong>Location:</strong> Former coastal metropolis — Gulf Region</p>' +
          '<p><strong>Threat Profile:</strong> An entire city submerged beneath 15 meters of irradiated water. The floodwaters carry a mutagenic agent that has transformed the remaining marine life into aggressive, territorial predators. Above water, the skeletal buildings house colonies of bio-luminescent organisms and valuable salvage.</p>' +
          '<p><strong>Resources:</strong> Underwater pre-collapse tech caches, desalination equipment, building materials.</p>' +
          '<p><strong>Recommended Gear:</strong> Diving apparatus, harpoon weaponry, sonar detection device.</p>' +
          '<div class="survival-tip"><span class="tip-label">Dive Warning</span><span class="tip-text">Never dive alone. The aquatic predators hunt using vibration — stay motionless when underwater and always have a spotter.</span></div>'
      },
      'Omega-0': {
        name: 'Zone Ω-0 — Nexus Zero',
        threat: 'EXTREME',
        color: 'var(--neon-red)',
        content:
          '<p><strong>Classification:</strong> ANOMALY — Origin Point Unknown</p>' +
          '<p><strong>Location:</strong> Coordinates shift — reports place it at different locations simultaneously</p>' +
          '<p><strong>Threat Profile:</strong> Nexus Zero is not a fixed location. Survivors describe it as a "living zone" — a region that moves, grows, and adapts. Those who have glimpsed it report reality distortion, time dilation, and encounters with organisms that defy biological classification. Some believe it to be a sentient bio-weapon from the pre-collapse era.</p>' +
          '<p><strong>Anomalies:</strong> Electronic equipment fails within proximity. Mutations acquired near Nexus Zero exhibit unpredictable properties. Several survivors report "memories" of events that haven\'t happened yet after exposure.</p>' +
          '<p><strong>Recommended Gear:</strong> No standard loadout recommended. Go with your instincts, survivor.</p>' +
          '<div class="survival-tip"><span class="tip-label">UNVERIFIED</span><span class="tip-text">The Synapse Mycelium claims Nexus Zero is not a threat but a "becoming." Their emissaries have been observed walking toward it willingly, never to return.</span></div>'
      },
      'Alpha-1': {
        name: 'Zone α-1 — Green Haven',
        threat: 'LOW',
        color: 'var(--neon-green)',
        content:
          '<p><strong>Classification:</strong> Minimal Contamination Zone</p>' +
          '<p><strong>Location:</strong> Northern refuge — former national parklands</p>' +
          '<p><strong>Threat Profile:</strong> The safest known region. Green Haven is home to one of the largest survivor communities. The bio-contamination here is so low that natural ecosystems are beginning to recover. Mutated organisms are rare and typically non-aggressive.</p>' +
          '<p><strong>Resources:</strong> Abundant clean water, wild game, medicinal herbs, Helix Warden garrison providing protection.</p>' +
          '<p><strong>Recommended Gear:</strong> Basic survival gear is sufficient. Consider bringing trade surplus to exchange at the settlement.</p>' +
          '<div class="survival-tip"><span class="tip-label">Refugee Info</span><span class="tip-text">Green Haven accepts new settlers but requires a 30-day quarantine and genetic screening before granting residency.</span></div>'
      }
    };

    zones.forEach(function (zone) {
      zone.addEventListener('click', function (e) {
        e.stopPropagation();
        const zoneName = this.querySelector('.zone-label').textContent.split('\n')[0].trim();
        const data = zoneData[zoneName];

        if (data) {
          detailName.textContent = data.name;
          detailName.style.color = data.color;
          detailBody.innerHTML = data.content;
          detailPanel.classList.add('visible');
          detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Highlight selected zone
          zones.forEach(function (z) { z.style.filter = ''; });
          this.style.filter = 'brightness(1.5) drop-shadow(0 0 8px ' + data.color + ')';
        }
      });
    });

    closeBtn.addEventListener('click', function () {
      detailPanel.classList.remove('visible');
      zones.forEach(function (z) { z.style.filter = ''; });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!detailPanel.contains(e.target) && !e.target.closest('.map-zone')) {
        detailPanel.classList.remove('visible');
        zones.forEach(function (z) { z.style.filter = ''; });
      }
    });

    // Threat-level filter buttons for map
    initMapFilters();
  }

  function initMapFilters() {
    var mapContainer = document.querySelector('.map-container');
    // Create filter bar
    var filterBar = document.createElement('div');
    filterBar.className = 'map-filters';
    filterBar.innerHTML =
      '<button class="map-filter-btn active" data-threat="all">ALL</button>' +
      '<button class="map-filter-btn" data-threat="low">LOW</button>' +
      '<button class="map-filter-btn" data-threat="medium">MEDIUM</button>' +
      '<button class="map-filter-btn" data-threat="high">HIGH</button>' +
      '<button class="map-filter-btn" data-threat="extreme">EXTREME</button>';

    // Insert before map grid
    mapContainer.insertBefore(filterBar, document.getElementById('contaminationMap'));

    // Style injection
    var style = document.createElement('style');
    style.textContent =
      '.map-filters { display: flex; justify-content: center; gap: 10px; padding: 16px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border-dim); flex-wrap: wrap; }' +
      '.map-filter-btn { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border: 1px solid var(--border-mid); background: transparent; color: var(--text-muted); cursor: pointer; border-radius: 2px; transition: all 0.3s; }' +
      '.map-filter-btn:hover { border-color: var(--neon-green); color: var(--neon-green); }' +
      '.map-filter-btn.active { background: rgba(0,255,136,0.1); border-color: var(--neon-green); color: var(--neon-green); }' +
      '.map-zone.filtered-out { opacity: 0.15; pointer-events: none; }';
    document.head.appendChild(style);

    var buttons = filterBar.querySelectorAll('.map-filter-btn');
    var zones = document.querySelectorAll('.map-zone');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { return b.classList.remove('active'); });
        this.classList.add('active');

        var threat = this.getAttribute('data-threat');

        zones.forEach(function (zone) {
          var zoneThreat = zone.getAttribute('data-threat');
          if (threat === 'all' || zoneThreat === threat) {
            zone.classList.remove('filtered-out');
            zone.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          } else {
            zone.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // ========================
  // TECH TREE INTERACTIONS
  // ========================
  function initTechTreeInteractions() {
    var nodes = document.querySelectorAll('.tech-node:not(.locked)');
    var lockedNodes = document.querySelectorAll('.tech-node.locked');
    var svg = document.getElementById('techtreeSVG');

    // Draw connection lines
    drawConnections(svg);

    // Window resize redraw
    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () { drawConnections(svg); }, 250);
    });

    nodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        this.classList.add('active');
        this.querySelector('.node-inner').style.borderColor = 'var(--neon-green)';
        this.querySelector('.node-inner').style.boxShadow = 'var(--glow-green)';
      });

      node.addEventListener('mouseleave', function () {
        this.classList.remove('active');
        this.querySelector('.node-inner').style.borderColor = '';
        this.querySelector('.node-inner').style.boxShadow = '';
      });

      node.addEventListener('click', function () {
        if (this.classList.contains('unlocked')) {
          this.classList.remove('unlocked');
          this.querySelector('.node-inner').style.background = '';
          showToast('Module deactivated: ' + this.querySelector('h4').textContent);
        } else {
          this.classList.add('unlocked');
          this.querySelector('.node-inner').style.background =
            'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,240,255,0.05))';
          this.querySelector('.node-inner').style.borderColor = 'var(--neon-green)';
          showToast('Module unlocked: ' + this.querySelector('h4').textContent);
        }
      });
    });

    lockedNodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        showToast('Locked — Requires prerequisite upgrades', true);
      });
    });

    // Add glow to selected node
    var style = document.createElement('style');
    style.textContent =
      '.tech-node.unlocked .node-outer-ring { opacity: 1; border-color: var(--neon-green); box-shadow: var(--glow-green); }' +
      '.tech-node.unlocked .node-cost { color: var(--neon-green); }' +
      '.toast-notification { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--bg-card); border: 1px solid var(--neon-green); color: var(--neon-green); font-family: var(--font-mono); font-size: 0.75rem; padding: 10px 24px; border-radius: 4px; z-index: 10000; box-shadow: var(--glow-green); animation: toastIn 0.3s ease-out; pointer-events: none; }' +
      '.toast-notification.error { border-color: var(--neon-red); color: var(--neon-red); box-shadow: var(--glow-red); }' +
      '.toast-notification.fade-out { animation: toastOut 0.3s ease-in forwards; }' +
      '@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }' +
      '@keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateX(-50%) translateY(-10px); } }';
    document.head.appendChild(style);
  }

  function drawConnections(svg) {
    svg.innerHTML = '';

    var connections = [
      ['.tier-1[data-id="stem"]', '.tier-2[data-id="muscle"]'],
      ['.tier-1[data-id="stem"]', '.tier-2[data-id="senses"]'],
      ['.tier-1[data-id="stem"]', '.tier-2[data-id="immune"]'],
      ['.tier-2[data-id="muscle"]', '.tier-3[data-id="neuro"]'],
      ['.tier-2[data-id="senses"]', '.tier-3[data-id="neuro"]'],
      ['.tier-2[data-id="senses"]', '.tier-3[data-id="adapt"]'],
      ['.tier-2[data-id="immune"]', '.tier-3[data-id="toxin"]'],
      ['.tier-2[data-id="immune"]', '.tier-3[data-id="adapt"]'],
      ['.tier-3[data-id="neuro"]', '.tier-4[data-id="apex"]'],
      ['.tier-3[data-id="adapt"]', '.tier-4[data-id="apex"]'],
      ['.tier-3[data-id="toxin"]', '.tier-4[data-id="apex"]']
    ];

    var canvasRect = svg.parentElement.getBoundingClientRect();
    var svgRect = svg.getBoundingClientRect();

    connections.forEach(function (pair) {
      var fromEl = document.querySelector(pair[0]);
      var toEl = document.querySelector(pair[1]);

      if (!fromEl || !toEl) return;

      var fromRect = fromEl.getBoundingClientRect();
      var toRect = toEl.getBoundingClientRect();

      var x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
      var y1 = fromRect.top + fromRect.height - svgRect.top;
      var x2 = toRect.left + toRect.width / 2 - svgRect.left;
      var y2 = toRect.top - svgRect.top;

      var midY = (y1 + y2) / 2;

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var d = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + midY + ', ' + x2 + ' ' + midY + ', ' + x2 + ' ' + y2;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(0,255,136,0.15)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-dasharray', '6 4');

      svg.appendChild(path);
    });
  }

  // ========================
  // SCROLL ANIMATIONS
  // ========================
  function initScrollAnimations() {
    var observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Stagger children if section
          var children = entry.target.querySelectorAll('.mutation-card, .survival-card, .faction-card, .tech-node');
          children.forEach(function (child, index) {
            setTimeout(function () {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0) scale(1)';
            }, index * 80);
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(function (section) {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(section);
    });

    // Observe individual cards
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.mutation-card, .faction-card').forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      cardObserver.observe(card);
    });
  }

  // ========================
  // NAVIGATION ACTIVE STATE
  // ========================
  function initNavigationTracking() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function updateActive() {
      var scrollY = window.pageYOffset;

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop - 120;
        var sectionHeight = section.offsetHeight;
        var sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  // ========================
  // SURVIVAL CARD EFFECTS
  // ========================
  function initSurvivalCardEffects() {
    var cards = document.querySelectorAll('.survival-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = (y - centerY) / 20;
        var rotateY = (centerX - x) / 20;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ========================
  // TOAST NOTIFICATION
  // ========================
  function showToast(message, isError) {
    var toast = document.createElement('div');
    toast.className = 'toast-notification' + (isError ? ' error' : '');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('fade-out');
      setTimeout(function () {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    }, 2500);
  }

  // ========================
  // DYNAMIC DNA SEQUENCE IN NAV
  // ========================
  var dnaMini = document.getElementById('dnaMini');
  var bases = ['A', 'T', 'C', 'G'];

  setInterval(function () {
    var sequence = '';
    for (var i = 0; i < 15; i++) {
      sequence += bases[Math.floor(Math.random() * 4)];
      if (i < 14) sequence += '•';
    }
    dnaMini.textContent = sequence;
  }, 3000);

  // ========================
  // AMBIENT SOUND TRIGGER (visual only — no audio files)
  // ========================
  // Simulate occasional "system alerts" in the nav status
  setInterval(function () {
    var indicator = document.querySelector('.status-indicator');
    var states = [
      { text: 'LIFE SIGNS: STABLE', class: 'alive' },
      { text: 'LIFE SIGNS: ELEVATED', class: 'alive' },
      { text: '⚠ MUTATION DETECTED', class: 'alert' }
    ];

    if (Math.random() > 0.7) {
      var state = states[Math.floor(Math.random() * states.length)];
      var label = indicator.querySelector('.status-label');
      var dot = indicator.querySelector('.pulse-dot');

      label.textContent = state.text;
      if (state.class === 'alert') {
        label.style.color = 'var(--neon-amber)';
        dot.style.background = 'var(--neon-amber)';
        dot.style.boxShadow = '0 0 8px var(--neon-amber)';
        setTimeout(function () {
          label.style.color = '';
          dot.style.background = '';
          dot.style.boxShadow = '';
        }, 2000);
      }
    }
  }, 8000);

  // ========================
  // PARALLAX ON HERO ORGANISMS
  // ========================
  window.addEventListener('scroll', function () {
    var scrollY = window.pageYOffset;
    var organisms = document.querySelectorAll('.organism');

    organisms.forEach(function (org, index) {
      var speed = (index + 1) * 0.03;
      var yOffset = scrollY * speed;
      org.style.transform = 'translateY(' + yOffset + 'px)';
    });
  }, { passive: true });

  // ========================
  // RANDOM CODE GLITCH EFFECT
  // ========================
  var terminalLines = document.querySelectorAll('.terminal-line');

  setInterval(function () {
    if (Math.random() > 0.85) {
      terminalLines.forEach(function (line) {
        if (Math.random() > 0.5) {
          var original = line.textContent;
          line.style.color = 'var(--neon-red)';
          line.style.textShadow = '0 0 8px var(--neon-red)';
          setTimeout(function () {
            line.style.color = '';
            line.style.textShadow = '';
          }, 150);
        }
      });
    }
  }, 4000);

})();