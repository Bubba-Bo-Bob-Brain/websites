// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== GLOBAL STATE =====
  const state = {
    suffering: 0, // 0-100 (Solace to Oblivion)
    afflictions: [],
    blightActive: false,
    rotActive: false,
  };

  // ===== DOM ELEMENTS =====
  const elements = {
    // Suffering Index
    sufferingGauge: document.getElementById('sufferingGauge'),
    sufferingFill: document.getElementById('sufferingFill'),
    // Blighted Map
    blightedMap: document.getElementById('blightedMap'),
    blightToggle: document.getElementById('blightToggle'),
    rotToggle: document.getElementById('rotToggle'),
    // Cursed Artifacts
    artifactsGrid: document.getElementById('artifactsGrid'),
    // Dark Ritual Calendar
    ritualCalendar: document.getElementById('ritualCalendar'),
    // Affliction Tracker
    afflictionSelect: document.getElementById('afflictionSelect'),
    addAffliction: document.getElementById('addAfflicction'), // Note: Fixed typo in HTML ID
    clearAfflictions: document.getElementById('clearAfflictions'),
    afflictionLedger: document.getElementById('afflictionLedger'),
    // Cursor
    cursor: document.getElementById('cursor'),
    cursorTrail: document.getElementById('cursor-trail'),
  };

  // ===== CURSOR EFFECTS =====
  document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    // Update cursor position
    elements.cursor.style.left = `${x}px`;
    elements.cursor.style.top = `${y}px`;
    // Create trail
    const trail = elements.cursorTrail.cloneNode(true);
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);
    // Fade out trail
    setTimeout(() => {
      trail.style.opacity = '0';
      trail.style.transform = 'scale(1.5)';
      setTimeout(() => trail.remove(), 500);
    }, 100);
  });

  // ===== SUFFERING INDEX =====
  const updateSuffering = (amount) => {
    state.suffering = Math.min(100, Math.max(0, state.suffering + amount));
    elements.sufferingFill.style.width = `${state.suffering}%`;
    updateSufferingEffects();
    return state.suffering;
  };

  const updateSufferingEffects = () => {
    document.body.classList.remove(
      'suffering-effect-1',
      'suffering-effect-2',
      'suffering-effect-3',
      'suffering-effect-4',
      'suffering-effect-5'
    );
    if (state.suffering >= 20) document.body.classList.add('suffering-effect-1');
    if (state.suffering >= 40) document.body.classList.add('suffering-effect-2');
    if (state.suffering >= 60) document.body.classList.add('suffering-effect-3');
    if (state.suffering >= 80) document.body.classList.add('suffering-effect-4');
    if (state.suffering >= 90) document.body.classList.add('suffering-effect-5');
  };

  // ===== BLIGHTED MAP =====
  const generateBlightedMap = () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.background = 'rgba(0, 0, 0, 0.3)';

    // Create regions (simplified for demo)
    const regions = [
      { name: 'The Withering Wastes', d: 'M100,50 Q200,30 300,50 Q400,80 450,150 Q500,200 400,250 Q300,220 200,200 Q100,180 100,50 Z', fill: '#4a5d23', blighted: false },
      { name: 'The Bleeding Fen', d: 'M300,100 Q400,80 500,100 Q600,120 650,200 Q700,250 600,280 Q500,260 400,250 Q350,200 300,100 Z', fill: '#8c0327', blighted: false },
      { name: 'The Hollow Spire', d: 'M200,200 Q300,150 400,200 Q500,250 450,300 Q400,350 300,350 Q200,300 200,200 Z', fill: '#3a3a3a', blighted: false },
      { name: 'The Shattered Vale', d: 'M50,200 Q100,150 200,200 Q300,250 250,300 Q200,350 100,300 Q50,250 50,200 Z', fill: '#5a0218', blighted: false },
    ];

    regions.forEach((region, i) => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', region.d);
      path.setAttribute('fill', region.fill);
      path.setAttribute('stroke', '#d4af37');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('data-name', region.name);
      path.classList.add('region');
      path.addEventListener('mouseenter', () => {
        if (state.blightActive) {
          path.setAttribute('fill', '#5a0218');
          path.setAttribute('stroke', '#8c0327');
          updateSuffering(2);
        }
      });
      svg.appendChild(path);
    });

    elements.blightedMap.innerHTML = '';
    elements.blightedMap.appendChild(svg);

    // Blight toggle
    elements.blightToggle.addEventListener('click', () => {
      state.blightActive = !state.blightActive;
      elements.blightToggle.textContent = state.blightActive
        ? 'The Blight Spreads...'
        : 'Toggle Blight';
      if (state.blightActive) updateSuffering(5);
    });

    // Rot toggle
    elements.rotToggle.addEventListener('click', () => {
      state.rotActive = !state.rotActive;
      const regions = svg.querySelectorAll('.region');
      regions.forEach((region, i) => {
        if (state.rotActive) {
          region.style.filter = 'sepia(1) saturate(5) brightness(0.5)';
          region.style.transition = 'filter 2s ease-in-out';
          updateSuffering(10);
        } else {
          region.style.filter = 'none';
        }
      });
    });
  };

  // ===== CURSED ARTIFACTS =====
  const cursedArtifacts = [
    {
      name: 'The Hollow Crown',
      effect: 'Affliction: Madness (Voices in the Dark)',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%233a3a3a" stroke="%23d4af37" stroke-width="2"/><circle cx="50" cy="50" r="30" fill="none" stroke="%238c0327" stroke-width="1" stroke-dasharray="3,2"/><path d="M30,50 L70,50 M50,30 L50,70" stroke="%23d4af37" stroke-width="2"/></svg>',
    },
    {
      name: 'The Bleeding Chalice',
      effect: 'Affliction: Hemorrhage (Blood Weeps from Wounds)',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,20 Q30,50 50,80 Q70,50 50,20 Z" fill="%238c0327" stroke="%23d4af37" stroke-width="2"/><path d="M40,40 L60,40 M45,50 L55,50 M40,60 L60,60" stroke="%23f5e7c1" stroke-width="1"/></svg>',
    },
    {
      name: 'The Shattered Mirror',
      effect: 'Affliction: Doppelgänger (See Thy Worst Self)',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="60" fill="%233a3a3a" stroke="%23d4af37" stroke-width="2"/><path d="M30,20 L50,40 L70,20 M30,40 L50,60 L70,40 M30,60 L50,80 L70,60" stroke="%238c0327" stroke-width="1"/></svg>',
    },
    {
      name: 'The Withering Bell',
      effect: 'Affliction: Decay (Flesh Turns to Dust)',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,30 Q50,10 70,30 Q60,50 50,60 Q40,50 30,30 Z" fill="%234a5d23" stroke="%23d4af37" stroke-width="2"/><circle cx="50" cy="35" r="3" fill="%23d4af37"/><path d="M45,35 L45,20" stroke="%23d4af37" stroke-width="1"/></svg>',
    },
  ];

  const renderArtifacts = () => {
    elements.artifactsGrid.innerHTML = '';
    cursedArtifacts.forEach((artifact) => {
      const card = document.createElement('div');
      card.className = 'artifact-card';
      card.innerHTML = `
        <div class="artifact-card__image" style="background-image: url('${artifact.image}')"></div>
        <div class="artifact-card__name">${artifact.name}</div>
        <div class="artifact-card__effect">${artifact.effect}</div>
      `;
      card.addEventListener('click', () => {
        updateSuffering(5);
        card.classList.add('glow');
        setTimeout(() => card.classList.remove('glow'), 1000);
      });
      elements.artifactsGrid.appendChild(card);
    });
  };

  // ===== DARK RITUAL CALENDAR =====
  const darkRituals = [
    { day: 1, name: 'Day of the Shattered Moon', description: 'The moon bleeds. Madness spreads.' },
    { day: 7, name: 'The Howling', description: 'The wind carries voices of the dead.' },
    { day: 13, name: 'The Black Mass', description: 'A gathering of the forsaken.' },
    { day: 20, name: 'The Veil Thins', description: 'The dead walk among the living.' },
    { day: 28, name: 'The Last Light', description: 'The sun dims. Hope fades.' },
  ];

  const generateRitualCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'ritual-calendar__grid';

    // Add month/year header
    const header = document.createElement('div');
    header.className = 'ritual-calendar__header';
    header.textContent = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    calendarGrid.appendChild(header);

    // Add days of the week
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach((day) => {
      const dayEl = document.createElement('div');
      dayEl.className = 'ritual-calendar__day-header';
      dayEl.textContent = day;
      calendarGrid.appendChild(dayEl);
    });

    // Add days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'ritual-calendar__day';
      dayEl.textContent = i;

      // Check for rituals
      const ritual = darkRituals.find((r) => r.day === i);
      if (ritual) {
        dayEl.classList.add('ritual-day');
        dayEl.title = `${ritual.name}: ${ritual.description}`;
        dayEl.addEventListener('click', () => {
          updateSuffering(15);
          dayEl.classList.add('active');
        });
      }

      calendarGrid.appendChild(dayEl);
    }

    elements.ritualCalendar.innerHTML = '';
    elements.ritualCalendar.appendChild(calendarGrid);
  };

  // ===== AFFLICTION TRACKER =====
  const afflictions = {
    withering: { name: 'Withering', duration: '7 Days', effect: () => updateSuffering(1) },
    bleeding: { name: 'Bleeding', duration: 'Until Healed', effect: () => updateSuffering(3) },
    fever: { name: 'Fever', duration: '3 Days', effect: () => updateSuffering(2) },
    curse: { name: 'Curse of the Hollow Eye', duration: 'Eternal', effect: () => updateSuffering(10) },
    rot: { name: 'Rot of the Flesh', duration: 'Until Purged', effect: () => updateSuffering(5) },
    'void-touched': { name: 'Void-Touched', duration: 'Forever', effect: () => updateSuffering(20) },
  };

  const renderAfflictions = () => {
    elements.afflictionLedger.innerHTML = '';
    state.afflictions.forEach((afflictionKey, index) => {
      const affliction = afflictions[afflictionKey];
      const item = document.createElement('div');
      item.className = 'affliction-item';
      item.innerHTML = `
        <div class="affliction-item__name">${affliction.name}</div>
        <div class="affliction-item__duration">Duration: ${affliction.duration}</div>
        <div class="affliction-item__remove">×</div>
      `;
      item.querySelector('.affliction-item__remove').addEventListener('click', () => {
        state.afflictions.splice(index, 1);
        renderAfflictions();
      });
      elements.afflictionLedger.appendChild(item);
      // Trigger effect
      affliction.effect();
    });
  };

  elements.addAffliction.addEventListener('click', () => {
    const afflictionKey = elements.afflictionSelect.value;
    if (afflictionKey && !state.afflictions.includes(afflictionKey)) {
      state.afflictions.push(afflictionKey);
      renderAfflictions();
    }
  });

  elements.clearAfflictions.addEventListener('click', () => {
    state.afflictions = [];
    renderAfflictions();
  });

  // ===== INITIALIZE =====
  const init = () => {
    generateBlightedMap();
    renderArtifacts();
    generateRitualCalendar();
    renderAfflictions();
    updateSuffering(0); // Initialize effects
  };

  init();
});