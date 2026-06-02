/* ============================================
   FLESH/PROTOCOL — BIOPUNK RPG SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initVitals();
  initNavigation();
  initZoneMap();
  initTechTree();
  initJournal();
  initCustomCursor();
});

/* ============================================
   BOOT SEQUENCE
   ============================================ */

function initBootSequence() {
  const bootSequence = document.getElementById('boot-sequence');
  const mainInterface = document.getElementById('main-interface');
  const bootLines = document.querySelectorAll('.boot-line');
  const bootPulse = document.querySelector('.boot-pulse');
  
  const messages = [
    { index: 0, delay: 500 },
    { index: 1, delay: 1800 },
    { index: 2, delay: 3200, type: 'warning' },
    { index: 3, delay: 4200 },
    { index: 4, delay: 5800, type: 'granted' }
  ];
  
  messages.forEach(({ index, delay, type }) => {
    setTimeout(() => {
      const line = bootLines[index];
      line.classList.add('visible');
      if (type) line.classList.add(type);
    }, delay);
  });
  
  setTimeout(() => {
    bootPulse.classList.add('visible');
  }, 6800);
  
  setTimeout(() => {
    bootSequence.classList.add('complete');
    mainInterface.classList.remove('hidden');
    
    requestAnimationFrame(() => {
      mainInterface.classList.add('visible');
    });
  }, 8500);
}

/* ============================================
   VITAL SIGNS MONITORING
   ============================================ */

function initVitals() {
  const heartRateEl = document.getElementById('heart-rate');
  const contaminationEl = document.getElementById('contamination');
  const synapseEl = document.getElementById('synapse-load');
  const timeEl = document.getElementById('station-time');
  
  let baseHeartRate = 72;
  let contamination = 14.3;
  let synapseLoad = 33.7;
  
  function updateVitals() {
    const jitter = Math.sin(Date.now() / 1000) * 4;
    const heartRate = Math.round(baseHeartRate + jitter);
    heartRateEl.textContent = heartRate;
    
    const contJitter = Math.sin(Date.now() / 3000) * 0.5;
    contaminationEl.textContent = (contamination + contJitter).toFixed(1) + '%';
    
    const synJitter = Math.sin(Date.now() / 2000) * 2;
    synapseEl.textContent = Math.min(100, (synapseLoad + synJitter)).toFixed(1) + '%';
    
    const now = new Date();
    timeEl.textContent = now.toISOString().substr(11, 8);
  }
  
  updateVitals();
  setInterval(updateVitals, 250);
}

/* ============================================
   NAVIGATION TABS
   ============================================ */

function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.content-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSection = tab.dataset.section;
      
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById(targetSection);
      if (target) {
        target.classList.add('active');
      }
    });
  });
}

/* ============================================
   CONTAMINATION ZONE MAP
   ============================================ */

function initZoneMap() {
  const zoneAreas = document.querySelectorAll('.zone-area');
  const detailsPanel = document.getElementById('zone-details');
  
  const zoneData = {
    bloomfields: {
      name: 'THE BLOOMFIELDS',
      threat: 'MODERATE',
      threatColor: '#c8ff00',
      description: 'Former agricultural zone. Vegetation displays aggressive growth patterns. Spore density: 847 ppm. Atmospheric toxicity within survivable range for adapted subjects.',
      hazards: ['Spore inhalation', 'Psychotropic pollen', 'Carnivorous root systems'],
      loot: ['Purified water', 'Fruit (verify non-toxic)', 'Bio-fertilizer']
    },
    veins: {
      name: 'THE VEINS',
      threat: 'EXTREME',
      threatColor: '#ff4444',
      description: 'Subterranean fungal network breached surface. Ground is semi-permeable membrane. Movement causes hemorrhaging. Do not run. Do not fall.',
      hazards: ['Membrane collapse', 'Hemorrhagic terrain', 'Neural spore clouds'],
      loot: ['Fungal antibiotics', 'Neural dampeners', 'Membrane samples']
    },
    gastric: {
      name: 'GASTRIC SEA',
      threat: 'SEVERE',
      threatColor: '#ff8800',
      description: 'Lake of digestive fluid from ruptured bioreactor. Fumes dissolve standard hazmat in minutes. Something large feeds at the center. Avoid dusk feeding patterns.',
      hazards: ['Corrosive atmosphere', 'Predatory megafauna', 'Toxic off-gassing'],
      loot: ['Reactor fuel rods', 'Digestive enzymes', 'Pearl formations']
    },
    quiet: {
      name: 'THE QUIET PLACE',
      threat: 'UNKNOWN',
      threatColor: '#8888ff',
      description: 'Sound does not return from this zone. Instruments fail. Survivors report "absence of self." Prolonged exposure results in complete neurological flattening.',
      hazards: ['Auditory null zone', 'Ego dissolution', 'Temporal displacement'],
      loot: ['None confirmed', 'Silence', 'Peace (?)']
    }
  };
  
  zoneAreas.forEach(area => {
    area.addEventListener('click', () => {
      const zoneKey = area.dataset.zone;
      const data = zoneData[zoneKey];
      if (!data) return;
      
      zoneAreas.forEach(z => {
        z.style.strokeWidth = '1';
        z.style.opacity = '0.6';
      });
      area.style.strokeWidth = '3';
      area.style.opacity = '1';
      
      renderZoneDetails(data);
    });
    
    area.addEventListener('mouseenter', () => {
      area.style.cursor = 'pointer';
    });
  });
  
  function renderZoneDetails(data) {
    detailsPanel.innerHTML = `
      <div class="zone-detail-header" style="margin-bottom: 1rem;">
        <h3 style="font-family: var(--font-terminal); font-size: 1.1rem; color: ${data.threatColor}; margin-bottom: 0.25rem;">
          ${data.name}
        </h3>
        <span style="font-family: var(--font-terminal); font-size: 0.75rem; color: ${data.threatColor};">
          THREAT LEVEL: ${data.threat}
        </span>
      </div>
      <p style="font-family: var(--font-body); font-size: 0.95rem; color: var(--color-bone); line-height: 1.7; margin-bottom: 1rem;">
        ${data.description}
      </p>
      <div style="margin-bottom: 1rem;">
        <h4 style="font-family: var(--font-terminal); font-size: 0.8rem; color: var(--color-vein-bright); margin-bottom: 0.5rem;">
          DOCUMENTED HAZARDS
        </h4>
        <ul style="list-style: none; padding: 0;">
          ${data.hazards.map(h => `
            <li style="font-family: var(--font-body); font-size: 0.9rem; color: var(--color-bone); padding: 0.2rem 0; border-bottom: 1px dashed rgba(200,255,0,0.08);">
              ◉ ${h}
            </li>
          `).join('')}
        </ul>
      </div>
      <div>
        <h4 style="font-family: var(--font-terminal); font-size: 0.8rem; color: var(--color-flesh-dim); margin-bottom: 0.5rem;">
          POTENTIAL EXTRACTIONS
        </h4>
        <ul style="list-style: none; padding: 0;">
          ${data.loot.map(l => `
            <li style="font-family: var(--font-body); font-size: 0.9rem; color: var(--color-bone); padding: 0.2rem 0;">
              ◎ ${l}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    detailsPanel.style.animation = 'none';
    requestAnimationFrame(() => {
      detailsPanel.style.animation = 'sectionEnter 0.4s ease';
    });
  }
}

/* ============================================
   BIO-ENHANCEMENT TECH TREE
   ============================================ */

function initTechTree() {
  const nodes = document.querySelectorAll('.tree-node');
  const panel = document.getElementById('techtree-panel');
  const paths = document.querySelectorAll('.tree-path');
  
  const nodeData = {
    core: {
      name: 'HOST ORGANISM',
      desc: 'Baseline human. Fragile. Limited. The raw substrate from which greatness is grown.',
      stats: { survival: '100%', adaptability: '15%', power: '5%' },
      requires: 'None — you are here'
    },
    calcify: {
      name: 'CALCIFICATION PATH',
      desc: 'Harden the exterior. Soften the interior. Pain becomes abstract.',
      stats: { armor: '++', mobility: '--', pain: 'null' },
      requires: 'Core stability, trauma exposure'
    },
    hypergrowth: {
      name: 'HYPERGROWTH PATH',
      desc: 'Cells divide without limit. Mass increases. The flesh remembers every injury and grows stronger.',
      stats: { regeneration: '++', mass: '+++', control: '--' },
      requires: 'Radiation exposure, nutrient surplus'
    },
    synaptogenesis: {
      name: 'SYNAPTOGENESIS PATH',
      desc: 'Neural density multiplies. Thoughts layer upon thoughts. You begin to hear the frequencies between words.',
      stats: { perception: '+++', sanity: '---', telepathy: 'latent' },
      requires: 'Psychoactive catalyst, isolation period'
    },
    'tank-form': {
      name: 'TANK FORM',
      desc: 'Become immovable. Become unkillable. Become alone inside your fortress of bone.',
      stats: { armor: '++++', speed: 'null', social: 'forfeit' },
      requires: 'Calcification Mastery'
    },
    'spike-colony': {
      name: 'SPIKE COLONY',
      desc: 'Offensive calcification. Your body produces weapons. Sleep becomes dangerous.',
      stats: { offense: '+++', rest: 'hazard', intimacy: 'fatal' },
      requires: 'Calcification + Hypergrowth'
    },
    regenerator: {
      name: 'THE REGENERATOR',
      desc: 'Injury is memory. Memory is rewritten. You have died many times and improved each time.',
      stats: { immortality: 'partial', identity: 'fractured', potential: 'infinite' },
      requires: 'Hypergrowth Mastery'
    },
    'swarm-host': {
      name: 'SWARM HOST',
      desc: 'Your body is ecosystem. Symbiotes in your blood make decisions with you, for you, instead of you.',
      stats: { minions: '1000s', autonomy: 'shared', loneliness: 'cured' },
      requires: 'Hypergrowth + Synaptogenesis'
    },
    psionic: {
      name: 'THE PSIONIC',
      desc: 'Thoughts leave your skull. They enter others. Consent is a membrane you no longer recognize.',
      stats: { range: 'planetary', ethics: 'eroded', communion: 'forced' },
      requires: 'Synaptogenesis Mastery'
    },
    'hive-mind': {
      name: 'HIVE MIND',
      desc: 'Boundary of self dissolves. You are many. You are one. You are waiting for more.',
      stats: { individuals: 'variable', will: 'distributed', hunger: 'universal' },
      requires: 'Synaptogenesis + Hypergrowth'
    }
  };
  
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeKey = node.dataset.node;
      const data = nodeData[nodeKey];
      if (!data) return;
      
      nodes.forEach(n => {
        n.querySelector('circle').style.stroke = '#888';
        n.querySelector('text').style.fill = '#888';
      });
      
      const circle = node.querySelector('circle');
      const text = node.querySelector('text');
      if (circle) circle.style.stroke = 'var(--color-flesh-primary)';
      if (text) text.style.fill = 'var(--color-flesh-primary)';
      
      highlightPaths(nodeKey);
      renderTechDetails(data);
    });
  });
  
  function highlightPaths(activeNode) {
    const tier2Nodes = ['tank-form', 'spike-colony', 'regenerator', 'swarm-host', 'psionic', 'hive-mind'];
    const tier1Nodes = ['calcify', 'hypergrowth', 'synaptogenesis'];
    
    if (tier2Nodes.includes(activeNode)) {
      paths.forEach(p => p.classList.add('active'));
    } else if (tier1Nodes.includes(activeNode)) {
      paths.forEach(p => {
        const d = p.getAttribute('d');
        if (d.includes('450,650') || d.includes(activeNode === 'calcify' ? '300,500' : activeNode === 'hypergrowth' ? '450,480' : '600,500')) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    } else {
      paths.forEach(p => p.classList.remove('active'));
    }
  }
  
  function renderTechDetails(data) {
    const statEntries = Object.entries(data.stats || {});
    
    panel.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h3 style="font-family: var(--font-terminal); font-size: 1.1rem; color: var(--color-flesh-primary); margin-bottom: 0.5rem;">
          ${data.name}
        </h3>
        <p style="font-family: var(--font-body); font-size: 0.95rem; color: var(--color-bone); line-height: 1.7;">
          ${data.desc}
        </p>
      </div>
      <div style="margin-bottom: 1rem;">
        <h4 style="font-family: var(--font-terminal); font-size: 0.75rem; color: var(--color-muted); margin-bottom: 0.5rem; letter-spacing: 0.1em;">
          MODIFICATION METRICS
        </h4>
        ${statEntries.map(([key, val]) => `
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid rgba(200,255,0,0.06);">
            <span style="font-family: var(--font-terminal); font-size: 0.8rem; color: var(--color-bone-dark); text-transform: uppercase;">${key}</span>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-flesh-dim);">${val}</span>
          </div>
        `).join('')}
      </div>
      <div style="padding: 0.75rem; background: rgba(200,255,0,0.03); border: 1px solid rgba(200,255,0,0.08);">
        <span style="font-family: var(--font-terminal); font-size: 0.75rem; color: var(--color-warning);">
          REQUIRES: ${data.requires}
        </span>
      </div>
    `;
    
    panel.style.animation = 'none';
    requestAnimationFrame(() => {
      panel.style.animation = 'sectionEnter 0.4s ease';
    });
  }
}

/* ============================================
   SURVIVAL JOURNAL
   ============================================ */

function initJournal() {
  const pages = document.querySelectorAll('.journal-page');
  const prevBtn = document.querySelector('.journal-prev');
  const nextBtn = document.querySelector('.journal-next');
  const dots = document.querySelectorAll('.journal-dot');
  
  let currentPage = 0;
  const totalPages = pages.length;
  
  function showPage(index) {
    pages.forEach((p, i) => {
      p.classList.toggle('active-page', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }
  
  prevBtn.addEventListener('click', () => {
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    showPage(currentPage);
  });
  
  nextBtn.addEventListener('click', () => {
    currentPage = (currentPage + 1) % totalPages;
    showPage(currentPage);
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentPage = index;
      showPage(currentPage);
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentPage = (currentPage - 1 + totalPages) % totalPages;
      showPage(currentPage);
    } else if (e.key === 'ArrowRight') {
      currentPage = (currentPage + 1) % totalPages;
      showPage(currentPage);
    }
  });
}

/* ============================================
   CUSTOM CURSOR TRAIL
   ============================================ */

function initCustomCursor() {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-flesh-dim);
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(trail);
  
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let isActive = false;
  let hideTimeout;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trail.style.opacity = '0.6';
    isActive = true;
    
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      trail.style.opacity = '0';
      isActive = false;
    }, 100);
  });
  
  function animateTrail() {
    if (isActive) {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.left = trailX - 3 + 'px';
      trail.style.top = trailY - 3 + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
  
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-flesh-dim);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(ripple);
    
    let size = 20;
    let opacity = 1;
    
    function animateRipple() {
      size += 3;
      opacity -= 0.03;
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.opacity = opacity;
      ripple.style.borderWidth = (2 * opacity) + 'px';
      
      if (opacity > 0) {
        requestAnimationFrame(animateRipple);
      } else {
        ripple.remove();
      }
    }
    animateRipple();
  });
}

/* ============================================
   RANDOM GLITCH EFFECTS
   ============================================ */

setInterval(() => {
  if (Math.random() > 0.97) {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(t => {
      const original = t.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let glitched = '';
      for (let i = 0; i < original.length; i++) {
        if (Math.random() > 0.7 && original[i] !== ' ') {
          glitched += chars[Math.floor(Math.random() * chars.length)];
        } else {
          glitched += original[i];
        }
      }
      t.textContent = glitched;
      setTimeout(() => {
        t.textContent = original;
      }, 150);
    });
  }
}, 4000);

/* ============================================
   MUTATION CARD EXPANSION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const mutationCards = document.querySelectorAll('.mutation-card');
  
  mutationCards.forEach(card => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      
      mutationCards.forEach(c => c.classList.remove('expanded'));
      
      if (!isExpanded) {
        card.classList.add('expanded');
      }
    });
  });
});

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

document.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= '4') {
    const tabIndex = parseInt(e.key) - 1;
    const tabs = document.querySelectorAll('.nav-tab');
    if (tabs[tabIndex]) {
      tabs[tabIndex].click();
    }
  }
});