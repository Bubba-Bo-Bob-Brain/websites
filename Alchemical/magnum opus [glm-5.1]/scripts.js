const Lab = {

  state: {
    currentStage: 'nigredo',
    stageIndex: 0,
    stages: ['nigredo', 'albedo', 'citrinitas', 'rubedo'],
    circleClicks: 0,
    clicksToAdvance: 3,
    grindCount: 0,
    maxGrinds: 7,
    crucibleIngredients: [],
    stoneQualities: {
      tincture: 0,
      projectio: 0,
      elixir: 0
    },
    noteCount: 1,
    planetAngles: [0, 1.05, 2.1, 3.15, 4.2, 5.25, 0.5],
    planetSpeeds: [0.008, 0.006, 0.005, 0.004, 0.003, 0.002, 0.001],
    celestialCtx: null,
    celestialDisplaySize: 0,
    celestialRAF: null,
    resizeTimeout: null,
    combinationNotes: {
      sulfurMercury: false,
      trinity: false,
      goldSulfur: false
    },
    opusComplete: false
  },

  init() {
    this.injectDynamicStyles();
    this.createStars();
    this.createAmbientMotes();
    this.positionRingSymbols();
    this.setupTransmutationCircle();
    this.setupIngredients();
    this.setupMortar();
    this.setupNotes();
    this.setupTooltips();
    this.initCelestialCanvas();
    this.revealMarginalia();
    this.updateStageOrbs();
    this.generateCrucibleBubbles();
    this.generateCrucibleVapor();
    this.generateGemRays();
    this.addNote('system', '⚗', 'Opus inceptum — The Great Work begins in darkness');
    this.animateEntry();
  },

  injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = [
      '@keyframes pulseExpand {',
      '  0% { transform: scale(1); opacity: 0.7; }',
      '  100% { transform: scale(3); opacity: 0; }',
      '}',
      '@keyframes noteSlideIn {',
      '  0% { opacity: 0; transform: translateX(-10px); }',
      '  100% { opacity: 1; transform: translateX(0); }',
      '}',
      '@keyframes ingredientPop {',
      '  0% { transform: scale(1); }',
      '  50% { transform: scale(1.15); }',
      '  100% { transform: scale(1); }',
      '}',
      '.ingredient.selected { animation: ingredientPop 0.5s ease; }'
    ].join('\n');
    document.head.appendChild(style);
  },

  animateEntry() {
    const workspace = document.getElementById('workspace');
    if (!workspace) return;

    workspace.style.opacity = '0';
    workspace.style.transform = 'translateY(8px)';
    workspace.style.transition = 'opacity 2.5s ease, transform 2.5s ease';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        workspace.style.opacity = '1';
        workspace.style.transform = 'translateY(0)';
      });
    });
  },

  createStars() {
    const bg = document.getElementById('celestialBackground');
    if (!bg) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 130; i++) {
      const star = document.createElement('div');
      star.className = 'star' + (Math.random() > 0.91 ? ' bright' : '');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--twinkle-duration', (2 + Math.random() * 5) + 's');
      star.style.setProperty('--twinkle-delay', (Math.random() * 7) + 's');
      fragment.appendChild(star);
    }
    bg.appendChild(fragment);
  },

  createAmbientMotes() {
    const container = document.getElementById('ambientParticles');
    if (!container) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 14; i++) {
      const mote = document.createElement('div');
      mote.className = 'mote';
      mote.style.left = Math.random() * 100 + '%';
      mote.style.top = (35 + Math.random() * 65) + '%';
      mote.style.setProperty('--mote-size', (2 + Math.random() * 4) + 'px');
      mote.style.setProperty('--mote-duration', (14 + Math.random() * 20) + 's');
      mote.style.setProperty('--mote-delay', (Math.random() * 14) + 's');
      mote.style.setProperty('--mote-drift-x', (-45 + Math.random() * 90) + 'px');
      mote.style.setProperty('--mote-drift-y', (-70 - Math.random() * 130) + 'px');
      mote.style.setProperty('--mote-drift-x2', (-65 + Math.random() * 130) + 'px');
      mote.style.setProperty('--mote-drift-y2', (-150 - Math.random() * 110) + 'px');
      fragment.appendChild(mote);
    }
    container.appendChild(fragment);
  },

  positionRingSymbols() {
    const container = document.getElementById('transmutationContainer');
    if (!container) return;

    const size = container.offsetWidth;
    const halfSize = size / 2;

    const rings = [
      { id: 'outerRing', radius: halfSize * 0.88 },
      { id: 'middleRing', radius: halfSize * 0.65 },
      { id: 'innerRing', radius: halfSize * 0.40 }
    ];

    rings.forEach(ring => {
      const el = document.getElementById(ring.id);
      if (!el) return;

      const symbols = el.querySelectorAll('.ring-symbol');
      symbols.forEach(sym => {
        const angleDeg = parseFloat(sym.dataset.angle);
        const angleRad = angleDeg * Math.PI / 180;
        const x = ring.radius * Math.sin(angleRad);
        const y = -ring.radius * Math.cos(angleRad);
        sym.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      });
    });
  },

  setupTransmutationCircle() {
    const container = document.getElementById('transmutationContainer');
    if (!container) return;

    container.addEventListener('click', () => {
      if (this.state.opusComplete) {
        this.addNote('system', '☀', 'Opus iam perfectum est — The Work is complete');
        this.burstAmbientMotes(5);
        return;
      }

      this.state.circleClicks++;

      this.accelerateRings();

      this.pulseStoneCore();

      this.emitPulseRing();

      if (this.state.circleClicks >= this.state.clicksToAdvance) {
        this.state.circleClicks = 0;
        if (this.state.stageIndex < 3) {
          this.advanceStage();
        } else {
          this.completeOpus();
        }
      } else {
        var remaining = this.state.clicksToAdvance - this.state.circleClicks;
        this.addNote('system', '☿', 'Circulus activatus — ' + remaining + ' pulsationes restant');
      }
    });

    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'button');
    container.setAttribute('aria-label', 'Transmutation Circle — Click to advance the Great Work');
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        container.click();
      }
    });
  },

  accelerateRings() {
    var ringIds = ['outerRing', 'middleRing', 'innerRing'];
    ringIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.style.animationDuration = '4s';
      }
    });

    setTimeout(function() {
      ringIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.style.animationDuration = '';
        }
      });
    }, 2800);
  },

  pulseStoneCore() {
    var core = document.getElementById('stoneCore');
    if (!core) return;

    core.style.transform = 'scale(1.5)';
    core.style.transition = 'transform 0.12s ease-out';

    setTimeout(function() {
      core.style.transform = '';
      core.style.transition = 'transform 0.5s ease';
    }, 120);
  },

  emitPulseRing() {
    var vessel = document.getElementById('stoneVessel');
    if (!vessel) return;

    var pulse = document.createElement('div');
    pulse.style.cssText = 'position:absolute;inset:-12px;border-radius:50%;border:2px solid var(--stage-accent);opacity:0.7;pointer-events:none;animation:pulseExpand 1.8s ease-out forwards;';
    vessel.appendChild(pulse);

    setTimeout(function() {
      if (pulse.parentNode) pulse.remove();
    }, 1900);
  },

  advanceStage() {
    var nextIndex = this.state.stageIndex + 1;
    var nextStage = this.state.stages[nextIndex];

    this.triggerFlash(nextStage);

    this.state.stageIndex = nextIndex;
    this.state.currentStage = nextStage;
    document.body.dataset.stage = nextStage;

    this.updateStageIndicator();
    this.revealMarginalia();
    this.updateStageOrbs();
    this.updateStoneQualities();

    this.crucibleBurst();
    this.burstAmbientMotes(18);

    var stageNames = {
      nigredo: 'Nigredo — Putrefactio',
      albedo: 'Albedo — Purificatio',
      citrinitas: 'Citrinitas — Illustratio',
      rubedo: 'Rubedo — Coniunctio'
    };
    this.addNote('transmutation', '✦', 'TRANS MUTATIO: ' + stageNames[nextStage]);

    if (nextStage === 'albedo') {
      this.addNote('success', '☽', 'Materia purificatur — the soul washes clean in lunar light');
    } else if (nextStage === 'citrinitas') {
      this.addNote('success', '☉', 'Sol philosophicus oritur — the golden sun rises in the vessel');
    } else if (nextStage === 'rubedo') {
      this.addNote('warning', '♈', 'Rubedo proxima est — the final conjunction approaches...');
    }
  },

  triggerFlash(stage) {
    var flash = document.getElementById('stageFlash');
    if (!flash) return;

    flash.className = 'stage-flash ' + stage + '-flash active';

    setTimeout(function() {
      flash.className = 'stage-flash';
    }, 2400);
  },

  completeOpus() {
    this.state.opusComplete = true;

    this.addNote('transmutation', '☀', 'OPUS PERFECTUM — Lapis Philosophorum natus est!');
    this.addNote('success', '✦', 'Aurum potabile — the Elixir of Life is achieved');
    this.addNote('success', '☿', 'Ut supra, ita infra — As above, so below');

    this.state.stoneQualities.tincture = 100;
    this.state.stoneQualities.projectio = 100;
    this.state.stoneQualities.elixir = 100;
    this.updateStoneQualityBars();

    var gem = document.getElementById('stoneGem');
    if (gem) {
      gem.style.filter = 'brightness(1.8) drop-shadow(0 0 30px rgba(255, 215, 0, 0.9))';
    }

    var gemGlow = document.getElementById('gemInnerGlow');
    if (gemGlow) {
      gemGlow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.95), rgba(255, 180, 0, 0.5), transparent)';
    }

    this.burstAmbientMotes(45);

    var flash = document.getElementById('stageFlash');
    if (flash) {
      flash.className = 'stage-flash rubedo-flash active';
      flash.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.95), rgba(200, 160, 50, 0.98))';
      setTimeout(function() {
        flash.className = 'stage-flash';
        flash.style.background = '';
      }, 3500);
    }

    var stoneSymbol = document.getElementById('stoneSymbol');
    if (stoneSymbol) {
      stoneSymbol.textContent = '✦';
      stoneSymbol.style.fontSize = '1.4rem';
    }
  },

  updateStageIndicator() {
    var stages = document.querySelectorAll('.stage-indicator .stage');
    var self = this;

    stages.forEach(function(el, i) {
      el.classList.remove('active', 'completed');
      if (i === self.state.stageIndex) {
        el.classList.add('active');
      } else if (i < self.state.stageIndex) {
        el.classList.add('completed');
      }
    });
  },

  revealMarginalia() {
    var stageOrder = { nigredo: 0, albedo: 1, citrinitas: 2, rubedo: 3 };
    var currentIndex = stageOrder[this.state.currentStage];

    document.querySelectorAll('.marginalia').forEach(function(el) {
      var revealStage = el.dataset.revealStage;
      var revealIndex = stageOrder[revealStage];
      if (revealIndex <= currentIndex) {
        setTimeout(function() {
          el.classList.add('revealed');
        }, (revealIndex + 1) * 400);
      }
    });
  },

  updateStageOrbs() {
    var stageOrder = { nigredo: 0, albedo: 1, citrinitas: 2, rubedo: 3 };
    var currentIndex = stageOrder[this.state.currentStage];

    for (var i = 1; i <= 4; i++) {
      var orb = document.getElementById('stageOrb' + i);
      if (!orb) continue;
      orb.classList.remove('active', 'completed');
      if (i - 1 === currentIndex) {
        orb.classList.add('active');
      } else if (i - 1 < currentIndex) {
        orb.classList.add('completed');
      }
    }

    document.querySelectorAll('.stage-orb-connector').forEach(function(conn, i) {
      if (i < currentIndex) {
        conn.classList.add('lit');
      } else {
        conn.classList.remove('lit');
      }
    });
  },

  updateStoneQualities() {
    var stageBoost = 25;
    var q = this.state.stoneQualities;
    q.tincture = Math.min(100, q.tincture + stageBoost);
    q.projectio = Math.min(100, q.projectio + stageBoost);
    q.elixir = Math.min(100, q.elixir + stageBoost);
    this.updateStoneQualityBars();
  },

  updateStoneQualityBars() {
    var q = this.state.stoneQualities;

    var mappings = [
      { fill: 'tinctureFill', value: 'tinctureValue', key: 'tincture' },
      { fill: 'projectioFill', value: 'projectioValue', key: 'projectio' },
      { fill: 'elixirFill', value: 'elixirValue', key: 'elixir' }
    ];

    mappings.forEach(function(m) {
      var fillEl = document.getElementById(m.fill);
      var valueEl = document.getElementById(m.value);
      if (fillEl) fillEl.style.width = q[m.key] + '%';
      if (valueEl) valueEl.textContent = q[m.key] + '%';
    });
  },

  setupIngredients() {
    var self = this;
    document.querySelectorAll('.ingredient').forEach(function(el) {
      el.addEventListener('click', function() {
        var ingredient = el.dataset.ingredient;
        self.addIngredientToCrucible(ingredient, el);
      });
    });
  },

  addIngredientToCrucible(ingredient, shelfEl) {
    shelfEl.classList.remove('selected');
    void shelfEl.offsetWidth;
    shelfEl.classList.add('selected');
    setTimeout(function() { shelfEl.classList.remove('selected'); }, 1200);

    this.state.crucibleIngredients.push(ingredient);

    var container = document.getElementById('crucibleIngredients');
    if (container) {
      var symbolMap = {
        sulfur: '\u{1F70D}',
        mercury: '\u263F',
        salt: '\u{1F714}',
        antimony: '\u{1F72A}',
        arsenic: '\u{1F73A}',
        'gold-leaf': '\u2609'
      };

      var sym = document.createElement('span');
      sym.className = 'dissolving-symbol';
      sym.textContent = symbolMap[ingredient] || '?';
      container.appendChild(sym);
      setTimeout(function() { if (sym.parentNode) sym.remove(); }, 3200);
    }

    this.updateFormula();
    this.addCrucibleBubbles(5);

    var nameMap = {
      sulfur: 'Sulphur',
      mercury: 'Mercurius',
      salt: 'Sal',
      antimony: 'Stibium',
      arsenic: 'Arsenicum',
      'gold-leaf': 'Aurum'
    };
    this.addNote('system', '\u2697', nameMap[ingredient] + ' in crucibulum additur');

    this.state.stoneQualities.tincture = Math.min(100, this.state.stoneQualities.tincture + 2);
    this.state.stoneQualities.projectio = Math.min(100, this.state.stoneQualities.projectio + 2);
    this.updateStoneQualityBars();

    this.checkCombinations();

    this.adjustCrucibleLiquid();
  },

  adjustCrucibleLiquid() {
    var liquid = document.getElementById('crucibleLiquid');
    if (!liquid) return;

    var count = this.state.crucibleIngredients.length;
    var baseHeight = 45;
    var addedHeight = Math.min(count * 2, 15);
    liquid.style.height = (baseHeight + addedHeight) + 'px';
  },

  checkCombinations() {
    var ingredients = this.state.crucibleIngredients;
    var has = function(name) { return ingredients.indexOf(name) !== -1; };

    if (has('sulfur') && has('mercury') && !this.state.combinationNotes.sulfurMercury) {
      this.state.combinationNotes.sulfurMercury = true;
      this.addNote('success', '\u263F', 'Coniunctio Sulphuris et Mercurii — prima materia formatur!');
      this.state.stoneQualities.elixir = Math.min(100, this.state.stoneQualities.elixir + 6);
      this.updateStoneQualityBars();
    }

    if (has('sulfur') && has('mercury') && has('salt') && !this.state.combinationNotes.trinity) {
      this.state.combinationNotes.trinity = true;
      this.addNote('success', '\u{1F70F}', 'Trinitas alchemica completa — Tria sunt omnia!');
      this.state.stoneQualities.elixir = Math.min(100, this.state.stoneQualities.elixir + 10);
      this.updateStoneQualityBars();
    }

    if (has('gold-leaf') && has('sulfur') && !this.state.combinationNotes.goldSulfur) {
      this.state.combinationNotes.goldSulfur = true;
      this.addNote('success', '\u2609', 'Aurum et Sulphur coniunguntur — tinctura aurea apparet!');
      this.state.stoneQualities.tincture = Math.min(100, this.state.stoneQualities.tincture + 10);
      this.updateStoneQualityBars();
    }
  },

  updateFormula() {
    var formulaEl = document.getElementById('formulaText');
    if (!formulaEl) return;

    var ingredients = this.state.crucibleIngredients;
    if (ingredients.length === 0) {
      formulaEl.textContent = '\u2014 vas vacuum est \u2014';
      return;
    }

    var symbolMap = {
      sulfur: 'S\u{1F70D}',
      mercury: '\u263F',
      salt: '\u{1F714}',
      antimony: '\u{1F72A}',
      arsenic: '\u{1F73A}',
      'gold-leaf': '\u2609'
    };

    var symbols = ingredients.map(function(i) { return symbolMap[i] || i; });
    formulaEl.textContent = symbols.join(' + ');
  },

  generateCrucibleBubbles() {
    var container = document.getElementById('crucibleBubbles');
    if (!container) return;

    for (var i = 0; i < 7; i++) {
      var bubble = document.createElement('div');
      bubble.className = 'bubble';
      var size = 3 + Math.random() * 5;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = (10 + Math.random() * 80) + '%';
      bubble.style.bottom = (5 + Math.random() * 25) + '%';
      bubble.style.setProperty('--bubble-duration', (1.5 + Math.random() * 2.5) + 's');
      bubble.style.setProperty('--bubble-delay', (Math.random() * 5) + 's');
      container.appendChild(bubble);
    }
  },

  addCrucibleBubbles(count) {
    var container = document.getElementById('crucibleBubbles');
    if (!container) return;

    for (var i = 0; i < count; i++) {
      (function(index) {
        setTimeout(function() {
          var bubble = document.createElement('div');
          bubble.className = 'bubble';
          var size = 2 + Math.random() * 8;
          bubble.style.width = size + 'px';
          bubble.style.height = size + 'px';
          bubble.style.left = (10 + Math.random() * 80) + '%';
          bubble.style.bottom = (5 + Math.random() * 30) + '%';
          bubble.style.setProperty('--bubble-duration', (0.8 + Math.random() * 1.5) + 's');
          bubble.style.setProperty('--bubble-delay', '0s');
          container.appendChild(bubble);
          setTimeout(function() { if (bubble.parentNode) bubble.remove(); }, 3000);
        }, index * 120);
      })(i);
    }
  },

  generateCrucibleVapor() {
    var container = document.getElementById('crucibleVapor');
    if (!container) return;

    for (var i = 0; i < 4; i++) {
      var wisp = document.createElement('div');
      wisp.className = 'vapor-wisp';
      wisp.style.left = (15 + i * 18 + Math.random() * 8) + '%';
      wisp.style.setProperty('--vapor-duration', (2.5 + Math.random() * 2.5) + 's');
      wisp.style.setProperty('--vapor-delay', (i * 0.9 + Math.random() * 1.5) + 's');
      wisp.style.setProperty('--vapor-drift', (-7 + Math.random() * 14) + 'px');
      container.appendChild(wisp);
    }
  },

  crucibleBurst() {
    var liquid = document.getElementById('crucibleLiquid');
    if (liquid) {
      liquid.style.height = '60px';
      setTimeout(function() { liquid.style.height = ''; }, 1400);
    }

    this.addCrucibleBubbles(12);

    var vapor = document.getElementById('crucibleVapor');
    if (vapor) {
      for (var i = 0; i < 4; i++) {
        var wisp = document.createElement('div');
        wisp.className = 'vapor-wisp';
        wisp.style.left = (15 + Math.random() * 70) + '%';
        wisp.style.setProperty('--vapor-duration', (1.2 + Math.random()) + 's');
        wisp.style.setProperty('--vapor-delay', (i * 0.25) + 's');
        wisp.style.setProperty('--vapor-drift', (-10 + Math.random() * 20) + 'px');
        vapor.appendChild(wisp);
        (function(el) {
          setTimeout(function() { if (el.parentNode) el.remove(); }, 3500);
        })(wisp);
      }
    }
  },

  setupMortar() {
    var self = this;
    var assembly = document.getElementById('mortarAssembly');
    if (!assembly) return;

    assembly.addEventListener('click', function() {
      self.grind();
    });

    assembly.setAttribute('tabindex', '0');
    assembly.setAttribute('role', 'button');
    assembly.setAttribute('aria-label', 'Mortar and Pestle — Click to grind ingredients');
    assembly.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.grind();
      }
    });
  },

  grind() {
    if (this.state.grindCount >= this.state.maxGrinds) {
      this.addNote('warning', '\u2692', 'Materia iam ad pulverem redacta est — Already ground fine');
      return;
    }

    this.state.grindCount++;

    var pestle = document.getElementById('pestle');
    if (pestle) {
      pestle.classList.remove('grinding');
      void pestle.offsetWidth;
      pestle.classList.add('grinding');
    }

    var valueEl = document.getElementById('grindValue');
    if (valueEl) valueEl.textContent = this.state.grindCount;

    var fill = document.getElementById('grindFill');
    if (fill) fill.style.width = (this.state.grindCount / this.state.maxGrinds * 100) + '%';

    var powder = document.getElementById('mortarPowder');
    if (powder) powder.style.height = (this.state.grindCount / this.state.maxGrinds * 80) + '%';

    this.state.stoneQualities.tincture = Math.min(100, this.state.stoneQualities.tincture + 1);
    this.state.stoneQualities.projectio = Math.min(100, this.state.stoneQualities.projectio + 2);
    this.updateStoneQualityBars();

    var romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    this.addNote('system', '\u2692', 'Trituratio ' + romanNumerals[this.state.grindCount - 1] + ' \u2014 materia teritur');

    if (this.state.grindCount >= this.state.maxGrinds) {
      var self = this;
      setTimeout(function() {
        self.addNote('success', '\u2692', 'Triturationes completae \u2014 materia ad pulverem redacta');
        self.state.stoneQualities.projectio = Math.min(100, self.state.stoneQualities.projectio + 10);
        self.updateStoneQualityBars();
      }, 450);
    }
  },

  setupNotes() {
    var self = this;
    var input = document.getElementById('noteField');
    if (!input) return;

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && input.value.trim()) {
        self.addNote('system', '\u270E', input.value.trim());
        input.value = '';
      }
    });
  },

  addNote(type, icon, text) {
    var log = document.getElementById('notesLog');
    if (!log) return;

    this.state.noteCount++;

    var romanNumerals = [
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
      'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
      'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
      'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL'
    ];
    var numeral = romanNumerals[Math.min(this.state.noteCount - 1, romanNumerals.length - 1)] || this.state.noteCount;

    var entry = document.createElement('div');
    entry.className = 'note-entry';
    entry.dataset.type = type;
    entry.style.animation = 'noteSlideIn 0.5s ease-out';

    entry.innerHTML = '<span class="note-time">Hora ' + numeral + '</span><span class="note-icon">' + icon + '</span><span class="note-text">' + text + '</span>';

    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    while (log.children.length > 40) {
      log.removeChild(log.firstChild);
    }
  },

  setupTooltips() {
    var tooltipLayer = document.getElementById('tooltipLayer');
    if (!tooltipLayer) return;

    var tooltip = document.createElement('div');
    tooltip.className = 'alchemical-tooltip';
    tooltipLayer.appendChild(tooltip);

    var tooltipData = {
      saturn: '\u2654 Saturnus \u2014 Lead, Time, The Restrictor',
      jupiter: '\u2653 Iupiter \u2014 Tin, Expansion, The King',
      mars: '\u2642 Mars \u2014 Iron, War, The Separator',
      sun: '\u2609 Sol \u2014 Gold, Consciousness, The Goal',
      venus: '\u2640 Venus \u2014 Copper, Love, The Unifier',
      mercury: '\u263F Mercurius \u2014 Quicksilver, Spirit, The Transformer',
      moon: '\u263D Luna \u2014 Silver, Soul, The Reflector',
      aries: '\u2648 Aries \u2014 Fire, Beginning, The Ram',
      taurus: '\u2649 Taurus \u2014 Earth, Stability, The Bull',
      gemini: '\u264A Gemini \u2014 Air, Duality, The Twins',
      cancer: '\u264B Cancer \u2014 Water, Hearth, The Crab',
      leo: '\u264C Leo \u2014 Fire, Will, The Lion',
      virgo: '\u264D Virgo \u2014 Earth, Purity, The Virgin',
      libra: '\u264E Libra \u2014 Air, Balance, The Scales',
      scorpio: '\u264F Scorpio \u2014 Water, Death, The Scorpion',
      sagittarius: '\u2650 Sagittarius \u2014 Fire, Quest, The Archer',
      capricorn: '\u2651 Capricorn \u2014 Earth, Ascent, The Goat',
      aquarius: '\u2652 Aquarius \u2014 Air, Knowledge, The Water-Bearer',
      pisces: '\u2653 Pisces \u2014 Water, Dissolution, The Fish',
      ignis: '\u{1F702} Ignis \u2014 Fire, Will, Transformation',
      aqua: '\u{1F704} Aqua \u2014 Water, Emotion, Dissolution',
      terra: '\u{1F703} Terra \u2014 Earth, Body, Fixation',
      aer: '\u{1F701} Aer \u2014 Air, Mind, Sublimation'
    };

    var ingredientTooltips = {
      sulfur: 'Sulphur \u2014 The Soul of Matter, Principle of Combustibility',
      mercury: 'Mercurius \u2014 The Spirit of Matter, Principle of Transformation',
      salt: 'Sal \u2014 The Body of Matter, Principle of Fixation',
      antimony: 'Stibium \u2014 The Gray Wolf, Purifier of Metals',
      arsenic: 'Arsenicum \u2014 The White Smoke, Agent of Sublimation',
      'gold-leaf': 'Aurum \u2014 The Sun Made Flesh, The Goal Incarnate'
    };

    var showTooltip = function(text, rect) {
      tooltip.textContent = text;
      tooltip.classList.add('visible');
      tooltip.style.left = (rect.left + rect.width / 2) + 'px';
      tooltip.style.top = (rect.top - 10) + 'px';
      tooltip.style.transform = 'translate(-50%, -100%)';
    };

    var hideTooltip = function() {
      tooltip.classList.remove('visible');
    };

    document.querySelectorAll('.ring-symbol').forEach(function(sym) {
      sym.addEventListener('mouseenter', function() {
        var planet = sym.dataset.planet;
        var zodiac = sym.dataset.zodiac;
        var element = sym.dataset.element;
        var key = planet || zodiac || element;

        if (tooltipData[key]) {
          var rect = sym.getBoundingClientRect();
          showTooltip(tooltipData[key], rect);
        }
      });

      sym.addEventListener('mouseleave', hideTooltip);
    });

    document.querySelectorAll('.ingredient').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        var key = el.dataset.ingredient;
        if (ingredientTooltips[key]) {
          var rect = el.getBoundingClientRect();
          showTooltip(ingredientTooltips[key], rect);
        }
      });

      el.addEventListener('mouseleave', hideTooltip);
    });
  },

  initCelestialCanvas() {
    var canvas = document.getElementById('celestialCanvas');
    if (!canvas) return;

    var container = canvas.parentElement;
    var size = Math.min(container.offsetWidth, 280);
    var dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    this.state.celestialDisplaySize = size;
    this.state.celestialCtx = canvas.getContext('2d');
    this.state.celestialCtx.scale(dpr, dpr);

    this.positionCelestialLabels(size);
    this.startCelestialAnimation();
  },

  positionCelestialLabels(size) {
    var labels = document.querySelectorAll('.celestial-label');
    var radii = [0.15, 0.25, 0.35, 0.45, 0.57, 0.72, 0.88];

    labels.forEach(function(label, i) {
      var radius = radii[i] * size;
      var angle = -Math.PI / 2 + i * 0.42;
      var x = size / 2 + radius * Math.cos(angle);
      var y = size / 2 + radius * Math.sin(angle);
      label.style.left = x + 'px';
      label.style.top = y + 'px';
      label.style.transform = 'translate(-50%, -50%)';
    });
  },

  startCelestialAnimation() {
    if (this.state.celestialRAF) {
      cancelAnimationFrame(this.state.celestialRAF);
    }

    var self = this;
    var animate = function() {
      self.drawCelestial();
      self.state.celestialRAF = requestAnimationFrame(animate);
    };
    animate();
  },

  drawCelestial() {
    var ctx = this.state.celestialCtx;
    var size = this.state.celestialDisplaySize;
    if (!ctx || !size) return;

    var center = size / 2;

    ctx.clearRect(0, 0, size, size);

    var planets = [
      { name: 'Luna', radius: 0.15, color: '#c0c0c0', dotSize: 2.8 },
      { name: 'Mercurius', radius: 0.25, color: '#a0a0c0', dotSize: 2.2 },
      { name: 'Venus', radius: 0.35, color: '#e0c0a0', dotSize: 2.8 },
      { name: 'Sol', radius: 0.45, color: '#ffd700', dotSize: 3.5 },
      { name: 'Mars', radius: 0.57, color: '#c04030', dotSize: 2.2 },
      { name: 'Iupiter', radius: 0.72, color: '#c0a060', dotSize: 3.2 },
      { name: 'Saturnus', radius: 0.88, color: '#808070', dotSize: 2.8 }
    ];

    var style = getComputedStyle(document.body);
    var accent = style.getPropertyValue('--stage-accent').trim() || '#708090';

    ctx.font = (size * 0.042) + 'px serif';
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.35;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var zodiacSymbols = ['\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D', '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653'];
    for (var z = 0; z < zodiacSymbols.length; z++) {
      var zAngle = (z / 12) * Math.PI * 2 - Math.PI / 2;
      var zR = center * 0.96;
      var zX = center + zR * Math.cos(zAngle);
      var zY = center + zR * Math.sin(zAngle);
      ctx.fillText(zodiacSymbols[z], zX, zY);
    }

    ctx.globalAlpha = 1;

    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      var r = planet.radius * center;

      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      this.state.planetAngles[i] += this.state.planetSpeeds[i];
      var pAngle = this.state.planetAngles[i];

      var pX = center + r * Math.cos(pAngle);
      var pY = center + r * Math.sin(pAngle);

      ctx.beginPath();
      ctx.arc(pX, pY, planet.dotSize * 3, 0, Math.PI * 2);
      var glow = ctx.createRadialGradient(pX, pY, 0, pX, pY, planet.dotSize * 3);
      glow.addColorStop(0, planet.color + '50');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pX, pY, planet.dotSize, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();
    }

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 0.5;

    for (var j = 0; j < planets.length - 1; j++) {
      var r1 = planets[j].radius * center;
      var r2 = planets[j + 1].radius * center;
      var a1 = this.state.planetAngles[j];
      var a2 = this.state.planetAngles[j + 1];

      ctx.beginPath();
      ctx.moveTo(center + r1 * Math.cos(a1), center + r1 * Math.sin(a1));
      ctx.lineTo(center + r2 * Math.cos(a2), center + r2 * Math.sin(a2));
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#4a5568';
    ctx.fill();

    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(center - 8, center);
    ctx.lineTo(center + 8, center);
    ctx.moveTo(center, center - 8);
    ctx.lineTo(center, center + 8);
    ctx.stroke();
    ctx.globalAlpha = 1;
  },

  generateGemRays() {
    var container = document.getElementById('gemRays');
    if (!container) return;

    for (var i = 0; i < 8; i++) {
      var ray = document.createElement('div');
      ray.className = 'ray';
      ray.style.transform = 'rotate(' + (i * 45) + 'deg) translateY(-32px)';
      ray.style.animationDelay = (i * 0.5) + 's';
      container.appendChild(ray);
    }
  },

  burstAmbientMotes(count) {
    var container = document.getElementById('ambientParticles');
    if (!container) return;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var mote = document.createElement('div');
      mote.className = 'mote';
      mote.style.left = (20 + Math.random() * 60) + '%';
      mote.style.top = (25 + Math.random() * 50) + '%';
      mote.style.setProperty('--mote-size', (3 + Math.random() * 6) + 'px');
      mote.style.setProperty('--mote-duration', (4 + Math.random() * 9) + 's');
      mote.style.setProperty('--mote-delay', (Math.random() * 2) + 's');
      mote.style.setProperty('--mote-drift-x', (-65 + Math.random() * 130) + 'px');
      mote.style.setProperty('--mote-drift-y', (-45 - Math.random() * 110) + 'px');
      mote.style.setProperty('--mote-drift-x2', (-90 + Math.random() * 180) + 'px');
      mote.style.setProperty('--mote-drift-y2', (-140 - Math.random() * 90) + 'px');
      fragment.appendChild(mote);
    }
    container.appendChild(fragment);
  },

  handleResize() {
    var self = this;
    clearTimeout(this.state.resizeTimeout);
    this.state.resizeTimeout = setTimeout(function() {
      self.positionRingSymbols();
      self.initCelestialCanvas();
    }, 250);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Lab.init();
});

window.addEventListener('resize', function() {
  Lab.handleResize();
});