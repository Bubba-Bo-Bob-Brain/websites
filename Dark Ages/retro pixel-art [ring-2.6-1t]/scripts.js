/* ============================================================
   THE DARK AGES — A PIXEL CHRONICLE
   scripts.js — All interactive systems and behaviors
   ============================================================ */

(function () {
  'use strict';

  /* ============================
     STATE
     ============================ */
  const state = {
    hour: 19,
    minute: 30,
    season: 'autumn',
    weather: 'clear',
    health: 85,
    hunger: 60,
    faith: 45,
    reputation: 30,
    gold: 15,
    quests: {
      'find-herbalist': { active: true, completed: false },
      'tithe': { active: false, completed: false },
      'mine': { active: false, completed: false },
      'secret': { active: false, completed: false }
    },
    currentLocation: null,
    bellTolling: false,
    plagueDoctorVisible: false,
    modalOpen: false
  };

  const LOCATIONS = {
    tavern: {
      name: 'The Rusty Flagon',
      icon: '🍺',
      desc: 'A dimly lit tavern where weary travelers share tales of woe. The barkeep eyes you suspiciously. Rumor has it a hooded figure was seen here at dusk, whispering of a cursed relic in the old mine.',
      action: 'Order a meal (+10 Hunger, -3 Gold)',
      action2: 'Listen to rumors'
    },
    church: {
      name: 'Chapel of Sorrows',
      icon: '⛪',
      desc: 'Cold stone walls echo with faint chanting. The stained glass depicts saints warding off pestilence. A lone candle flickers before the altar, casting dancing shadows upon ancient scripture.',
      action: 'Pray for guidance (+15 Faith, -5 Hunger)',
      action2: 'Leave a tithe (+10 Reputation, -5 Gold)'
    },
    blacksmith: {
      name: 'Iron & Ember',
      icon: '🔨',
      desc: 'The clang of hammer on anvil rings through the village. The blacksmith, a broad-shouldered man with soot-streaked arms, pauses to regard you. His wares are simple but sturdy.',
      action: 'Sharpen your blade (+10 Reputation, -5 Gold)',
      action2: 'Buy a lockpick (+3 Gold cost)'
    },
    herbalist: {
      name: 'The Green Hollow',
      icon: '🌿',
      desc: 'Dried herbs hang from the low ceiling, filling the air with lavender and sage. The old herbalist peers at you through thick spectacles, her eyes surprisingly sharp.',
      action: 'Buy healing poultice (+20 Health, -5 Gold)',
      action2: 'Ask about the plague'
    },
    gate: {
      name: 'Village Gates',
      icon: '🔔',
      desc: 'Heavy oak doors reinforced with iron bands stand watch over the village. Two guards huddle near a dying fire, their breath visible in the cold air. Beyond lies the dark unknown of the countryside.',
      action: 'Attempt to leave (Dangerous!)',
      action2: 'Talk to the guards'
    },
    crypt: {
      name: 'The Old Crypt',
      icon: '💀',
      desc: 'Stone steps descend into the earth. The air grows cold and heavy with the scent of damp stone and something older. Flickering torchlight reveals faded burial niches along the walls. Something stirs in the deeper darkness.',
      action: 'Descend into the crypt (⚠ Dangerous)',
      action2: 'Search the entrance'
    },
    market: {
      name: 'Market Square',
      icon: '🛒',
      desc: 'Though most stalls are shuttered, a few desperate merchants still hawk their wares. A farmer sells bruised apples. A cloth merchant offers coarse wool at inflated prices. Life goes on, barely.',
      action: 'Buy bread (+15 Hunger, -3 Gold)',
      action2: 'Browse wares'
    },
    mine: {
      name: 'Abandoned Mine',
      icon: '⛏️',
      desc: 'The mine entrance gapes like a wound in the hillside. Rusted tools litter the ground. Wind moans from the depths, carrying the faint scent of iron and old earth. The quest-giver mentioned strange lights seen at night deep within.',
      action: 'Enter the mine (⚠ Very Dangerous)',
      action2: 'Search the entrance'
    },
    farm: {
      name: "Widow's Farm",
      icon: '🌾',
      desc: 'A modest farmstead surrounded by fallow fields. An elderly woman tends a meager garden. She looks up with weary eyes — her husband was taken by the plague last winter.',
      action: 'Offer help (+10 Reputation, -5 Hunger)',
      action2: 'Trade for vegetables (+5 Hunger, +3 Reputation)'
    },
    woods: {
      name: 'The Blighted Woods',
      icon: '🌲',
      desc: 'Twisted trees claw at a canopy so thick that only slivers of pale light reach the forest floor. Strange markings adorn the bark — ward symbols, or warnings? The herbalist sent you here to find moonwort, a rare herb growing only in shadow.',
      action: 'Search for moonwort (Chance encounter!)',
      action2: 'Follow the old trail'
    }
  };

  /* ============================
     DOM REFERENCES
     ============================ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const cursorGlow = $('#cursor-glow');
  const bell = $('#bell');
  const bellContainer = $('#bell-container');
  const rainLayer = $('#rain-layer');
  const fogLayer = $('#fog-layer');
  const snowLayer = $('#snow-layer');
  const ashLayer = $('#ash-layer');
  const weatherOverlay = $('#weather-overlay');
  const timeSlider = $('#time-slider');
  const hourDisplay = $('#hour-display');
  const minuteDisplay = $('#minute-display');
  const periodDisplay = $('#period-display');
  const seasonDisplay = $('#season-display');
  const weatherIcon = $('#weather-icon');
  const temperatureDisplay = $('#temperature-display');
  const moonPhase = $('#moon-phase');
  const healthBar = $('#health-bar');
  const hungerBar = $('#hunger-bar');
  const faithBar = $('#faith-bar');
  const repBar = $('#rep-bar');
  const goldBar = $('#gold-bar');
  const goldValue = $('#gold-value');
  const eventLog = $('#event-log');
  const detailContent = $('#detail-content');
  const detailHeading = $('#detail-heading');
  const player = $('#player-character');
  const mapContainer = $('#map-container');
  const campfire = $('#campfire');
  const modalOverlay = $('#modal-overlay');
  const modalContent = $('#modal-content');
  const modalTitle = $('#modal-title');
  const modalBody = $('#modal-body');
  const modalActions = $('#modal-actions');
  const plagueDoctor = $('#plague-doctor');
  const doctorDismiss = $('#doctor-dismiss');
  const notification = $('#notification');
  const toastIcon = $('#toast-icon');
  const toastText = $('#toast-text');
  const terrainLayer = $('#terrain-layer');

  /* ============================
     CUSTOM CURSOR
     ============================ */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  // Hover detection for clickable elements
  const interactiveEls = $$('.map-location, .modal-btn, #doctor-dismiss, .season-btn, .weather-btn, .inv-slot, .quest-item');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover-active'));
  });

  /* ============================
     TIME SYSTEM
     ============================ */
  function formatTime(h, m) {
    const period = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return {
      hour: String(h12).padStart(2, '0'),
      minute: String(m).padStart(2, '0'),
      period
    };
  }

  function updateClock() {
    const t = formatTime(state.hour, state.minute);
    hourDisplay.textContent = t.hour;
    minuteDisplay.textContent = t.minute;
    periodDisplay.textContent = t.period;
    timeSlider.value = state.hour * 60 + state.minute;
  }

  timeSlider.addEventListener('input', function () {
    const totalMinutes = parseInt(this.value);
    state.hour = Math.floor(totalMinutes / 60) % 24;
    state.minute = totalMinutes % 60;
    updateClock();
    updateLighting();
  });

  function updateLighting() {
    document.body.classList.remove('day-mode', 'night-mode', 'sunset-mode');

    if (state.hour >= 6 && state.hour < 12) {
      document.body.classList.add('day-mode');
    } else if (state.hour >= 12 && state.hour < 18) {
      document.body.classList.add('sunset-mode');
    } else {
      document.body.classList.add('night-mode');
    }
  }

  /* ============================
     SEASON SYSTEM
     ============================ */
  const seasonNames = { spring: '🌱 SPRING', summer: '☀ SUMMER', autumn: '🍂 AUTUMN', winter: '❄ WINTER' };
  const seasonTemps = { spring: 12, summer: 22, autumn: 10, winter: -3 };

  function setSeason(s) {
    state.season = s;
    document.body.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
    document.body.classList.add('season-' + s);
    seasonDisplay.textContent = seasonNames[s];
    $$('.season-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.season === s);
    });
    updateTemperature();
    addLog('Season changed to ' + s.charAt(0).toUpperCase() + s.slice(1));
  }

  $$('.season-btn').forEach(btn => {
    btn.addEventListener('click', () => setSeason(btn.dataset.season));
  });

  /* ============================
     WEATHER SYSTEM
     ============================ */
  const weatherIcons = {
    clear: '☀️',
    rain: '🌧️',
    fog: '🌫️',
    snow: '🌨️',
    ash: '🌋'
  };
  const weatherTemps = { clear: 0, rain: -3, fog: -1, snow: -5, ash: 3 };

  function setWeather(w) {
    state.weather = w;
    $$('.weather-layer').forEach(l => l.classList.remove('active'));

    // Clear particle canvases
    clearRain();
    clearSnow();

    switch (w) {
      case 'rain':
        rainLayer.classList.add('active');
        startRain();
        break;
      case 'fog':
        fogLayer.classList.add('active');
        break;
      case 'snow':
        snowLayer.classList.add('active');
        startSnow();
        break;
      case 'ash':
        ashLayer.classList.add('active');
        break;
      default:
        // clear
        break;
    }

    weatherIcon.textContent = weatherIcons[w];
    $$('.weather-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.weather === w);
    });
    updateTemperature();
    addLog('Weather changed: ' + w);
  }

  $$('.weather-btn').forEach(btn => {
    btn.addEventListener('click', () => setWeather(btn.dataset.weather));
  });

  function updateTemperature() {
    const base = seasonTemps[state.season] || 10;
    const mod = weatherTemps[state.weather] || 0;
    const h = state.hour;
    const timeMod = h >= 12 && h < 15 ? 3 : (h >= 0 && h < 6 ? -5 : 0);
    const temp = base + mod + timeMod;
    temperatureDisplay.textContent = temp + '°';
    temperatureDisplay.style.color = temp <= 0 ? '#88aadd' : temp >= 20 ? '#e25c1a' : '#ddc888';
  }

  /* ============================
     RAIN PARTICLES
     ============================ */
  let rainDrops = [];

  function startRain() {
    clearRain();
    for (let i = 0; i < 80; i++) {
      createRainDrop();
    }
  }

  function createRainDrop() {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.top = Math.random() * -100 + '%';
    drop.style.animationDuration = (0.3 + Math.random() * 0.4) + 's';
    drop.style.animationDelay = Math.random() * 0.5 + 's';
    drop.style.opacity = 0.3 + Math.random() * 0.4;
    rainLayer.appendChild(drop);
    rainDrops.push(drop);
  }

  function clearRain() {
    rainDrops.forEach(d => d.remove());
    rainDrops = [];
  }

  /* ============================
     SNOW PARTICLES
     ============================ */
  let snowFlakes = [];

  function startSnow() {
    clearSnow();
    for (let i = 0; i < 60; i++) {
      createSnowFlake();
    }
  }

  function createSnowFlake() {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    flake.textContent = '❄';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.top = Math.random() * -100 + '%';
    flake.style.animationDuration = (3 + Math.random() * 5) + 's';
    flake.style.animationDelay = Math.random() * 3 + 's';
    flake.style.fontSize = (0.4 + Math.random() * 0.6) + 'rem';
    flake.style.opacity = 0.5 + Math.random() * 0.5;
    snowLayer.appendChild(flake);
    snowFlakes.push(flake);
  }

  function clearSnow() {
    snowFlakes.forEach(d => d.remove());
    snowFlakes = [];
  }

  /* ============================
     BELL SYSTEM
     ============================ */
  function tollBell() {
    if (state.bellTolling) return;
    state.bellTolling = true;
    bell.classList.add('tolling');
    addLog('🔔 The monastery bell tolls across the village...');

    // Add screen shake
    document.body.style.animation = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.animation = 'bellShake 0.6s ease';

    setTimeout(() => {
      bell.classList.remove('tolling');
      state.bellTolling = false;
      document.body.style.animation = 'none';
    }, 600);
  }

  // Auto-toll at certain hours
  function checkBellTime() {
    if (state.minute === 0 && [6, 12, 18, 21, 0].includes(state.hour)) {
      setTimeout(() => tollBell(), 500);
    }
  }

  // Click bell to toll
  bellContainer.addEventListener('click', tollBell);

  // Auto-advance time and check events
  setInterval(() => {
    state.minute++;
    if (state.minute >= 60) {
      state.minute = 0;
      state.hour = (state.hour + 1) % 24;
      checkBellTime();

      // Random hunger drain
      if (state.hour % 3 === 0 && state.minute === 0) {
        state.hunger = Math.max(0, state.hunger - 3);
        updateStats();
        if (state.hunger <= 15) {
          showToast('⚠', 'Thy stomach growls with hunger!');
        }
        if (state.hunger === 0) {
          state.health = Math.max(0, state.health - 5);
          updateStats();
          showToast('💀', 'Starvation weakens thy body!');
        }
      }
    }
    updateClock();
    updateLighting();
    updateTemperature();
  }, 1200); // 1.2 seconds = 1 minute in game

  // Initial bell check
  updateLighting();
  updateTemperature();

  /* ============================
     STATS & INVENTORY
     ============================ */
  function updateStats() {
    healthBar.style.width = state.health + '%';
    hungerBar.style.width = state.hunger + '%';
    faithBar.style.width = state.faith + '%';
    repBar.style.width = state.reputation + '%';
    goldBar.style.width = Math.min(state.gold, 100) + '%';
    goldValue.textContent = state.gold;
  }

  /* ============================
     MAP LOCATION INTERACTIONS
     ============================ */
  $$('.map-location').forEach(loc => {
    loc.addEventListener('click', function () {
      const locId = this.dataset.location;
      openLocation(locId);
    });

    loc.addEventListener('mouseenter', function () {
      this.style.zIndex = '15';
    });
    loc.addEventListener('mouseleave', function () {
      this.style.zIndex = '5';
    });
  });

  function openLocation(locId) {
    const loc = LOCATIONS[locId];
    if (!loc) return;

    state.currentLocation = locId;
    detailHeading.textContent = '◆ ' + loc.name.toUpperCase() + ' ◆';
    detailContent.innerHTML = `
      <div class="modal-illustration">${loc.icon}</div>
      <p>${loc.desc}</p>
      <div class="illuminated-border">
        <div class="manuscript-ornament">◆ ◇ ◆ ◇ ◆</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        <button class="modal-btn" onclick="window.__darkAges.interact('${locId}', 'action')">${loc.action}</button>
        <button class="modal-btn secondary" onclick="window.__darkAges.interact('${locId}', 'action2')">${loc.action2}</button>
      </div>
    `;

    // Also open modal for full immersion
    openModal(loc.name, loc.icon, loc.desc, loc);
    addLog('Visited: ' + loc.name);
  }

  /* ============================
     MODAL SYSTEM
     ============================ */
  window.__darkAges = {
    interact: function (locId, actionType) {
      const loc = LOCATIONS[locId];
      if (!loc) return;

      if (actionType === 'action') {
        handleLocationAction(locId);
      } else {
        handleLocationAction2(locId);
      }
    },
    closeModal: closeModal
  };

  function openModal(title, icon, body, loc) {
    modalOpen = true;
    modalTitle.textContent = icon + ' ' + title;
    modalBody.innerHTML = `
      <div class="modal-illustration">${icon}</div>
      <p>${body}</p>
    `;
    modalActions.innerHTML = '';

    if (loc) {
      const btn1 = document.createElement('button');
      btn1.className = 'modal-btn';
      btn1.textContent = loc.action;
    btn1.addEventListener('click', () => { handleLocationAction(loc.name.toLowerCase().replace(/[^a-z]/g, '').replace('the', '').trim()); });

      const btn2 = document.createElement('button');
      btn2.className = 'modal-btn secondary';
      btn2.textContent = loc.action2;
      btn2.addEventListener('click', () => { handleLocationAction2(loc.name.toLowerCase().replace(/[^a-z]/g, '').replace('the', '').trim()); });

      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-btn secondary';
      closeBtn.textContent = 'Close [✕]';
      closeBtn.addEventListener('click', closeModal);

      modalActions.appendChild(btn1);
      modalActions.appendChild(btn2);
      modalActions.appendChild(closeBtn);
    } else {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-btn';
      closeBtn.textContent = 'Close [✕]';
      closeBtn.addEventListener('click', closeModal);
      modalActions.appendChild(closeBtn);
    }

    modalOverlay.classList.remove('modal-hidden');
    modalOverlay.classList.add('modal-visible');
  }

  function closeModal() {
    modalOpen = false;
    modalOverlay.classList.remove('modal-visible');
    modalOverlay.classList.add('modal-hidden');
  }

  $('#modal-close').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOpen) closeModal();
  });

  /* ============================
     LOCATION ACTION HANDLERS
     ============================ */
  function handleLocationAction(locId) {
    // Map location labels to IDs
    const idMap = {
      'rustyflagon': 'tavern',
      'chapelofsorrows': 'church',
      'ironember': 'blacksmith',
      'thegreenhollow': 'herbalist',
      'villagegates': 'gate',
      'theoldcrypt': 'crypt',
      'marketsquare': 'market',
      'abandonedmine': 'mine',
      'widowsfarm': 'farm',
      'theblightedwoods': 'woods'
    };

    let id = locId;
    for (const [key, val] of Object.entries(idMap)) {
      if (locId === val || locId === key) { id = val; break; }
    }

    switch (id) {
      case 'tavern':
        if (state.gold >= 3) {
          state.gold -= 3;
          state.hunger = Math.min(100, state.hunger + 10);
          updateStats();
          showToast('🍞', 'A warm meal and stale ale. +10 Hunger, -3 Gold');
          addLog('Ate at The Rusty Flagon. The barkeep muttered about a stranger in a dark cloak.');
        } else {
          showToast('⚠', 'Not enough gold for a meal!');
        }
        break;
      case 'church':
        if (state.hunger >= 5) {
          state.hunger -= 5;
          state.faith = Math.min(100, state.faith + 15);
          updateStats();
          showToast('✨', 'Prayer brings comfort. +15 Faith, -5 Hunger');
          addLog('Prayed at the altar. A sense of peace, however fleeting.');
        } else {
          showToast('⚠', 'Too hungry to pray effectively!');
        }
        break;
      case 'blacksmith':
        if (state.gold >= 5) {
          state.gold -= 5;
          state.reputation = Math.min(100, state.reputation + 10);
          updateStats();
          showToast('🔨', 'Blade sharpened! +10 Reputation, -5 Gold');
          addLog('Visited the blacksmith. The hammer rang true.');
        } else {
          showToast('⚠', 'Not enough gold for the blacksmith!');
        }
        break;
      case 'herbalist':
        if (state.gold >= 5) {
          state.gold -= 5;
          state.health = Math.min(100, state.health + 20);
          updateStats();
          showToast('🌿', 'Healing poultice applied! +20 Health, -5 Gold');
          addLog('Bought herbs from the old herbalist. She warned of dark times ahead.');
          // Activate herbalist quest
          state.quests['find-herbalist'].completed = true;
          state.quests['mine'].active = true;
        } else {
          showToast('⚠', 'Not enough gold for healing!');
        }
        break;
      case 'gate':
        showToast('⚠', 'The guards eye you warily. "No travel after dark," they warn.');
        addLog('Attempted to pass the gates. Guards turned you away.');
        break;
      case 'crypt':
        if (state.reputation >= 20) {
          showToast('💀', 'The crypt stirs... Return when better prepared.');
          addLog('Entered the crypt entrance. An unearthly chill drove you back.');
          state.quests['secret'].active = true;
        } else {
          showToast('👻', 'The crypt feels impossibly foreboding. Build your reputation first.');
        }
        break;
      case 'market':
        if (state.gold >= 3) {
          state.gold -= 3;
          state.hunger = Math.min(100, state.hunger + 15);
          updateStats();
          showToast('🍞', 'Bought day-old bread. +15 Hunger, -3 Gold');
          addLog('Traded at Market Square. Prices are steep since the blight.');
        } else {
          showToast('⚠', 'Not enough gold for bread!');
        }
        break;
      case 'mine':
        if (state.quests['mine'].active) {
          state.health = Math.max(0, state.health - 15);
          state.gold += 20;
          state.reputation = Math.min(100, state.reputation + 15);
          updateStats();
          showToast('⛏️', 'Braved the mine! Found ore worth 20 gold. -15 Health, +15 Reputation');
          addLog('Descended into the abandoned mine. Riches and danger in equal measure.');
          state.quests['mine'].completed = true;
        } else {
          showToast('⚠', 'The mine entrance is blocked. Find the herbalist first.');
        }
        break;
      case 'farm':
        state.hunger = Math.max(0, state.hunger - 5);
        state.reputation = Math.min(100, state.reputation + 3);
        updateStats();
        showToast('🌾', 'Helped the widow. +3 Reputation (hunger spent helping)');
        addLog('Assisted the Widow at her farm. A kind deed in dark times.');
        break;
      case 'woods':
        if (state.quests['find-herbalist'].completed) {
          state.faith = Math.min(100, state.faith + 5);
          state.hunger = Math.max(0, state.hunger - 5);
          state.gold += 8;
          updateStats();
          showToast('🌲', 'Found moonwort! Sold for 8 gold. +5 Faith, -5 Hunger');
          addLog('Braved the Blighted Woods and found moonwort. The markings on the trees pulsed faintly.');
        } else {
          state.hunger = Math.max(0, state.hunger - 3);
          updateStats();
          showToast('🌲', 'The woods are dangerous without guidance. Lost some hunger.');
          addLog('Wandered the Blighted Woods. The trees seem to watch. Found nothing of value.');
        }
        break;
      default:
        showToast('?', 'Nothing of interest here... yet.');
    }

    closeModal();
    updateQuestDisplay();
  }

  function handleLocationAction2(locId) {
    const idMap = {
      'rustyflagon': 'tavern',
      'chapelofsorrows': 'church',
      'ironember': 'blacksmith',
      'thegreenhollow': 'herbalist',
      'villagegates': 'gate',
      'theoldcrypt': 'crypt',
      'marketsquare': 'market',
      'abandonedmine': 'mine',
      'widowsfarm': 'farm',
      'theblightedwoods': 'woods'
    };

    let id = locId;
    for (const [key, val] of Object.entries(idMap)) {
      if (locId === val || locId === key) { id = val; break; }
    }

    switch (id) {
      case 'tavern':
        showToast('📜', '"A knight rode north three nights ago," says the barkeep. "He never returned."');
        addLog('Heard rumors at the tavern. A knight missing in the northern woods.');
        break;
      case 'church':
        showToast('📜', 'The holy texts speak of a "Shadow that Devours." The priest looks uneasy.');
        addLog('Listened to the priest\'s sermon about ancient evils stirring.');
        break;
      case 'blacksmith':
        showToast('📜', '"The mine has the finest ore," says the smith. "But something down there doesn\'t want to be found."');
        addLog('Heard the blacksmith\'s warnings about the mine.');
        break;
      case 'herbalist':
        showToast('📜', '"Seek moonwort in the Blighted Woods," she rasps. "But only with the ward-mark."');
        addLog('The herbalist shared her knowledge of the Blighted Woods.');
        break;
      case 'gate':
        showToast('📜', '"Bandits have been spotted on the northern road," warn the guards.');
        addLog('Spoke with the gate guards. Bandit activity reported north of the village.');
        break;
      case 'crypt':
        showToast('📜', 'The entrance reeks of decay. Bones litter the threshold. Perhaps return with better standing...');
        addLog('Scouted the crypt entrance. Not yet strong enough to enter.');
        break;
      case 'market':
        showToast('📜', 'A merchant whispers of a "Plague Doctor" seen in the dead of night near the chapel.');
        addLog('Overheard merchant gossip about a mysterious plague doctor.');
        break;
      case 'mine':
        showToast('📜', 'You need the herbalist\'s blessing before venturing inside.');
        addLog('Surveyed the mine entrance. It is sealed without the herbalist\'s approval.');
        break;
      case 'farm':
        showToast('📜', '"The crops have been failing," she says. "The soil feels... wrong."');
        addLog('Spoke with the widow. The blight has reached her soil.');
        break;
      case 'woods':
        showToast('📜', '"The old symbols on the trees ward off something," you murmur. But ward from what?');
        addLog('Studied the ward symbols carved into the ancient trees.');
        break;
      default:
        showToast('?', 'Nothing more to learn here.');
    }
  }

  /* ============================
     QUEST DISPLAY
     ============================ */
  function updateQuestDisplay() {
    const questList = $('#quest-list');
    questList.innerHTML = '';

    for (const [id, q] of Object.entries(state.quests)) {
      const div = document.createElement('div');
      if (q.completed) {
        div.className = 'quest-item quest-inactive';
        div.innerHTML = '<span class="quest-icon">✔</span><div class="quest-text">Completed</div>';
      } else if (q.active) {
        div.className = 'quest-item quest-active';
        const names = {
          'find-herbalist': 'Find the herbalist in the forest',
          'tithe': 'Pay tithe to the monastery',
          'mine': 'Investigate the abandoned mine',
          'secret': 'Explore the ancient crypt'
        };
        div.innerHTML = `<span class="quest-icon">❖</span><div class="quest-text">${names[id] || id}</div>`;
      } else {
        div.className = 'quest-item quest-locked';
        div.innerHTML = '<span class="quest-icon">✖</span><div class="quest-text">??? (locked)</div>';
      }
      questList.appendChild(div);
    }
  }

  /* ============================
     EVENT LOG / CHRONICLE
     ============================ */
  function addLog(text) {
    const t = formatTime(state.hour, state.minute);
    const entry = document.createElement('div');
    const important = text.includes('!') || text.includes('💀') || text.includes('⚠');
    entry.className = 'log-entry' + (important ? ' log-important' : '');
    entry.innerHTML = `<span class="log-time">[${t.hour}:${t.minute}]</span><span class="log-text">${text}</span>`;
    eventLog.prepend(entry);

    // Keep max 50 entries
    while (eventLog.children.length > 50) {
      eventLog.removeChild(eventLog.lastChild);
    }
  }

  /* ============================
     TOAST / NOTIFICATIONS
     ============================ */
  function showToast(icon, text) {
    toastIcon.textContent = icon;
    toastText.textContent = text;
    notification.classList.add('visible');
    setTimeout(() => notification.classList.remove('visible'), 3000);
  }

  /* ============================
     PLAGUE DOCTOR NPC
     ============================ */
  function showPlagueDoctor() {
    state.plagueDoctorVisible = true;
    plagueDoctor.classList.remove('hidden');
    addLog('⚠ The Plague Doctor has appeared! He has a message...');
  }

  doctorDismiss.addEventListener('click', () => {
    plagueDoctor.classList.add('hidden');
    state.plagueDoctorVisible = false;
    addLog('The Plague Doctor vanished into the mist...');
    showToast('👤', '"We shall meet again, traveler..."');
  });

  // Random plague doctor appearances
  function checkPlagueDoctor() {
    if (state.plagueDoctorVisible) return;
    const hour = state.hour;
    const r = Math.random();
    // More likely at night, especially around midnight
    if (hour >= 22 || hour <= 3) {
      if (r < 0.02) showPlagueDoctor();
    } else if (hour >= 18 || hour <= 6) {
      if (r < 0.008) showPlagueDoctor();
    }
  }

  setInterval(checkPlagueDoctor, 8000);

  /* ============================
     PLAYER MOVEMENT (Click to move)
     ============================ */
  mapContainer.addEventListener('click', function (e) {
    if (e.target.closest('.map-location')) return;
    if (e.target.closest('.modal-box')) return;

    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    player.style.left = 'calc(' + (x / rect.width * 100) + '% - 16px)';
    player.style.bottom = 'auto';
    player.style.top = 'calc(' + (y / rect.height * 100) + '% + 10px)';
    player.style.transform = 'translate(-50%, 50%)';

    // Fade out after moving
    player.style.opacity = '0.5';
    setTimeout(() => { player.style.opacity = '1'; }, 300);
  });

  /* ============================
     CAMPFIRE DYNAMIC INTENSITY
     ============================ */
  function updateCampfire() {
    const fireElements = $$('.fire-flicker');
    const isNight = state.hour >= 18 || state.hour < 6;

    fireElements.forEach(f => {
      if (isNight) {
        f.style.textShadow = '0 0 12px rgba(226, 92, 26, 1), 0 0 24px rgba(226, 92, 26, 0.5)';
      } else {
        f.style.textShadow = '0 0 6px rgba(226, 92, 26, 0.6), 0 0 12px rgba(226, 92, 26, 0.2)';
      }
    });

    campfire.style.opacity = isNight ? '1' : '0.6';
  }

  /* ============================
     MOON PHASE CALCULATION
     ============================ */
  function updateMoonPhase() {
    const dayOfCycle = Math.floor((state.hour * 60 + state.minute) / (1440 / 8));
    const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    moonPhase.textContent = phases[dayOfCycle % phases.length];
  }

  /* ============================
     AMBIENT SOUND (using Web Audio API for subtle atmosphere)
     ============================ */
  let audioCtx = null;

  function initAudio() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      // Audio not supported
    }
  }

  function playWind() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80 + Math.random() * 40, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 4);
  }

  function playBellSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 2);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 4);

    // Second tone for richness
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(554, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(277, audioCtx.currentTime + 2);
    gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start();
    osc2.stop(audioCtx.currentTime + 4);
  }

  // Override bell toll with sound
  const originalTolling = bellContainer.addEventListener.bind(bellContainer);
  bellContainer.onclick = function () {
    tollBell();
    playBellSound();
  };

  /* ============================
     RANDOM AMBIENT EVENTS
     ============================ */
  const ambientMessages = [
    'A crow caws in the distance...',
    'The wind howls through the village.',
    'Distant wolves howl at the moon.',
    'A shutter creaks in the wind.',
    'The fire crackles and sparks rise into the night.',
    'A church bell echoes faintly in the valley.',
    'Rats scurry in the shadows.',
    'The candlelight flickers as if disturbed by unseen breath.',
    'An owl hoots from the old oak.',
    'The ground trembles faintly beneath your feet...',
    'A ghostly whisper fades into silence.',
    'The scent of incense drifts from the chapel.'
  ];

  function triggerAmbientEvent() {
    const hour = state.hour;
    if (Math.random() < 0.15) {
      const msg = ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
      addLog(msg);
    }
  }

  setInterval(triggerAmbientEvent, 15000);

  /* ============================
     DYNAMIC TREE SWAY BASED ON WEATHER
     ============================ */
  function updateTreeAnimation() {
    const trees = $$('.pixel-tree');
    const windSpeed = state.weather === 'rain' || state.weather === 'fog' ? '3s' :
                      state.weather === 'snow' || state.weather === 'ash' ? '2s' : '6s';
    trees.forEach(t => {
      t.style.animationDuration = windSpeed;
    });
  }

  /* ============================
     INITIALIZATION
     ============================ */
  function init() {
    updateClock();
    updateLighting();
    updateStats();
    updateCampfire();
    updateMoonPhase();
    updateTreeAnimation();
    updateTemperature();
    updateQuestDisplay();

    // Add initial log entries
    addLog('The sun sets over the village of Ashenmoor.');
    addLog('Smoke curls from chimneys. The village settles into evening quiet.');

    // Periodic updates
    setInterval(() => {
      updateCampfire();
      updateMoonPhase();
    }, 5000);

    setInterval(updateTreeAnimation, 1000);

    // Initialize audio on first user interaction
    document.addEventListener('click', function initAudioOnce() {
      initAudio();
      document.removeEventListener('click', initAudioOnce);
    }, { once: true });

    // Also on keypress
    document.addEventListener('keydown', function initAudioOnce() {
      initAudio();
      document.removeEventListener('keydown', initAudioOnce);
    }, { once: true });
  }

  init();

})();