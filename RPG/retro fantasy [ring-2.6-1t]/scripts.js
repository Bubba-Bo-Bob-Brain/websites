// ═══════════════════════════════════════════════════════
// THE CRIMSON TAVERNE — JAVASCRIPT
// ═══════════════════════════════════════════════════════

// ─── DATA ──────────────────────────────────────────────

const STATS = [
  { name: 'Strength', abbr: 'STR', icon: '💪', base: 14 },
  { name: 'Dexterity', abbr: 'DEX', icon: '🏹', base: 16 },
  { name: 'Constitution', abbr: 'CON', icon: '🛡️', base: 12 },
  { name: 'Intelligence', abbr: 'INT', icon: '🧠', base: 18 },
  { name: 'Wisdom', abbr: 'WIS', icon: '👁️', base: 15 },
  { name: 'Charisma', abbr: 'CHA', icon: '👑', base: 13 },
];

const QUESTS = [
  {
    title: 'The Missing Caravan',
    difficulty: 'easy',
    desc: 'A merchant caravan has failed to arrive at the Crimson Taverne. The trail leads east toward the Whispering Woods.',
    reward: 150,
    gold: 150,
    objectives: ['Investigate the last known position', 'Find survivor testimonies', 'Track the goblin raiders to their camp', 'Retrieve the stolen goods'],
    details: 'The merchant guild is offering a generous reward for the safe recovery of their goods. Several guards were taken hostage and need rescuing.',
    giver: 'Guildmaster Harren'
  },
  {
    title: 'The Cursed Crypt',
    difficulty: 'medium',
    desc: 'Villagers near Old Kethara report undead rising from a forgotten burial ground. The local priest has requested aid.',
    reward: 350,
    gold: 350,
    objectives: ['Speak with Father Aldric', 'Enter the Crypt of Dread', 'Purify the desecrated altar', 'Defeat the Bone Warden'],
    details: 'Ancient runes seal the lower vaults. Bring a scholar of ancient tongues if you wish to unlock the deepest chambers and their treasures.',
    giver: 'Father Aldric'
  },
  {
    title: 'Wyrm of the Ashen Peaks',
    difficulty: 'hard',
    desc: 'A young dragon has claimed the mountain pass, blocking all trade between the northern and southern kingdoms.',
    reward: 800,
    gold: 800,
    objectives: ['Gather intelligence on the wyrm\'s lair', 'Acquire fire-resistant potions', 'Navigate the volcanic tunnels', 'Slay or drive off the dragon'],
    details: 'The wyrm, known as Cinderclaw, is territorial but not without cunning. Direct confrontation is ill-advised without proper preparation.',
    giver: 'King\'s Warden Elara'
  },
  {
    title: 'Whispers in the Dark',
    difficulty: 'deadly',
    desc: 'A primordial entity stirs beneath the Sunken City. Fishermen speak of madness spreading along the coast.',
    reward: 2000,
    gold: 2000,
    objectives: ['Decipher the ancient texts', 'Locate the Sunken City', 'Confront the Deep One\'s cultists', 'Seal the rift before it widens'],
    details: 'This quest is not for the faint of heart. Many seasoned adventurers have entered the Sunken City. None have returned sane.',
    giver: 'Archmage Veyla'
  },
  {
    title: 'Herb Gathering for the Apothecary',
    difficulty: 'easy',
    desc: 'The local apothecary needs rare herbs from the Enchanted Glade. Fairies make the trip dangerous but the reward is worthy.',
    reward: 50,
    gold: 50,
    objectives: ['Collect Moonpetal Flowers (x8)', 'Harvest Silverleaf Root (x5)', 'Avoid or befriend the forest fairies'],
    details: 'The fairies are mischievous but not malicious. A small offering of honeycomb should earn safe passage through their grove.',
    giver: 'Apothecary Mirren'
  },
  {
    title: 'The Bandit Lord\'s Gambit',
    difficulty: 'medium',
    desc: 'A cunning bandit lord known as "The Fox" has been raiding villages with unnatural precision. Someone is feeding him information.',
    reward: 400,
    gold: 400,
    objectives: ['Track The Fox\'s movements', 'Infiltrate the bandit camp', 'Uncover the traitor in the village', 'Capture or defeat The Fox'],
    details: 'Intelligence suggests The Fox has magical aid. Be prepared for arcane traps and enchanted sentries guarding his stronghold.',
    giver: 'Captain Voris, Town Guard'
  }
];

const SPELLS = {
  fire: [
    { name: 'Fire Bolt', school: 'Evocation', level: 'Cantrip', mana: '5', desc: 'A basic ranged attack that hurls a mote of fire at a target. Reliable damage at range.' },
    { name: 'Burning Hands', school: 'Evocation', level: '1st', mana: '15', desc: 'Fan your fingers to create a cone of roaring flames. Devastating at close range against grouped foes.' },
    { name: 'Scorching Ray', school: 'Evocation', level: '3rd', mana: '30', desc: 'Three rays of fire streak toward targets. Each ray tracks its victim with deadly accuracy.' },
    { name: 'Wall of Fire', school: 'Evocation', level: '4th', mana: '40', desc: 'Creates a blazing barrier that damages all who pass through. Excellent for controlling the battlefield.' },
    { name: 'Meteor Swarm', school: 'Evocation', level: '9th', mana: '100', desc: 'The ultimate destructive spell. Calls down a rain of meteors upon a vast area. Few survive.' }
  ],
  frost: [
    { name: 'Ray of Frost', school: 'Evocation', level: 'Cantrip', mana: '5', desc: 'A freezing beam that slows and damages a single target. Useful for kiting enemies.' },
    { name: 'Cone of Cold', school: 'Evocation', level: '5th', mana: '35', desc: 'A torrent of absolute cold erupts from your hands. Flash-freezes everything in its path.' },
    { name: 'Ice Storm', school: 'Evocation', level: '4th', mana: '40', desc: 'Summons a tempest of ice and hail in a large area. Crushing damage and difficult terrain.' },
    { name: 'Wall of Ice', school: 'Evocation', level: '4th', mana: '35', desc: 'Creates an impenetrable barrier of solid ice. Can be shaped and reshaped at will.' }
  ],
  lightning: [
    { name: 'Spark', school: 'Evocation', level: 'Cantrip', mana: '2', desc: 'A tiny spark leaps from your finger. Enough to ignite tinder or distract a foe.' },
    { name: 'Lightning Bolt', school: 'Evocation', level: '3rd', mana: '25', desc: 'A bolt of crackling lightning erupts from your hand. Strikes in a devastating line.' },
    { name: 'Chain Lightning', school: 'Evocation', level: '6th', mana: '60', desc: 'A bolt that arcs between multiple enemies. Each link in the chain carries lethal voltage.' },
    { name: 'Thunderwave', school: 'Evocation', level: '1st', mana: '12', desc: 'A wave of force erupts from your palm. Knocks back enemies and shatters fragile objects.' }
  ],
  arcane: [
    { name: 'Magic Missile', school: 'Evocation', level: '1st', mana: '10', desc: 'Three darts of pure magical energy streak unerringly toward your target. They never miss.' },
    { name: 'Counterspell', school: 'Abjuration', level: '3rd', mana: '20', desc: 'Negates an enemy spell in progress. The duel of mages begins here.' },
    { name: 'Teleport', school: 'Conjuration', level: '7th', mana: '50', desc: 'Instantly transport yourself to a location you have seen. Risk increases with distance.' },
    { name: 'Time Stop', school: 'Transmutation', level: '9th', mana: '100', desc: 'Freeze time itself for several moments. Act freely while the world stands still.' }
  ],
  healing: [
    { name: 'Cure Wounds', school: 'Evocation', level: '1st', mana: '10', desc: 'Channel radiant energy to mend wounds. A staple for any adventuring healer.' },
    { name: 'Healing Word', school: 'Evocation', level: '1st', mana: '12', desc: 'A whispered prayer that mends an ally from afar. Bonus action casting.' },
    { name: 'Mass Heal', school: 'Evocation', level: '9th', mana: '80', desc: 'A wave of restorative power washes over all nearby allies. Can even raise the recently fallen.' },
    { name: 'Regenerate', school: 'Transmutation', level: '7th', mana: '55', desc: 'The target\'s body begins to knit itself back together at an accelerated rate.' }
  ]
};

const SHOP_ITEMS = {
  weapons: [
    { icon: '⚔️', name: 'Longsword +1', type: 'Melee Weapon', cost: 350, desc: 'A finely crafted blade with a faint magical hum. +1 to hit and damage.' },
    { icon: '🏹', name: 'Elven Longbow', type: 'Ranged Weapon', cost: 500, desc: 'Sleek bow carved from heartwood. Grants advantage at long range.' },
    { icon: '🗡️', name: 'Dagger of Venom', type: 'Light Weapon', cost: 200, desc: 'A wicked blade coated in paralytic toxin. DC 13 Con save or be paralyzed.' },
    { icon: '⚒️', name: 'Warhammer +2', type: 'Melee Weapon', cost: 800, desc: 'Runed iron warhammer. Extra damage to constructs and undead.' },
    { icon: '🪓', name: 'Flame Tongue', type: 'Melee Weapon', cost: 1200, desc: 'On command, this sword wreathes in flame. 2d6 fire damage bonus.' },
    { icon: '🗡️', name: 'Shadow Blade', type: 'Light Weapon', cost: 950, desc: 'In dim light, this blade is invisible to all but its wielder.' }
  ],
  armor: [
    { icon: '🛡️', name: 'Shield of Faith', type: 'Shield', cost: 400, desc: 'A golden shield that hums with divine power. +2 AC bonus.' },
    { icon: '🦺', name: 'Chain Mail +1', type: 'Armor', cost: 600, desc: 'Interlocking steel rings enchanted for greater protection.' },
    { icon: '🪖', name: 'Helm of Telepathy', type: 'Helmet', cost: 350, desc: 'Allows the wearer to communicate telepathically within 60ft.' },
    { icon: '🥋', name: 'Robes of Protection', type: 'Light Armor', cost: 550, desc: 'Silken robes that shimmer faintly. +1 to AC and saving throws.' },
    { icon: '🛡️', name: 'Dragon Scale Mail', type: 'Armor', cost: 2500, desc: 'Rare armor crafted from dragon scales. Resistance to one element.' },
    { icon: '🧤', name: 'Gauntlets of Ogre Power', type: 'Accessory', cost: 450, desc: 'Sets the wearer\'s Strength to 19. Heavy, but oh so effective.' }
  ],
  potions: [
    { icon: '🧪', name: 'Potion of Healing', type: 'Consumable', cost: 50, desc: 'Restores 4d4+4 hit points. A staple in any adventurer\'s pack.' },
    { icon: '🧪', name: 'Potion of Greater Healing', type: 'Consumable', cost: 150, desc: 'Restores 8d8+8 hit points. The adventurer\'s best friend.' },
    { icon: '🧪', name: 'Potion of Fire Breath', type: 'Consumable', cost: 200, desc: 'For 3 rounds, exhale a 15ft cone of fire (4d6 damage).' },
    { icon: '🧪', name: 'Potion of Invisibility', type: 'Consumable', cost: 180, desc: 'Turns invisible for 1 hour, or until you attack or cast.' },
    { icon: '🧪', name: 'Elixir of Dragon\'s Blood', type: 'Consumable', cost: 800, desc: 'Grants fire resistance for 24 hours. Taste awful.' },
    { icon: '🧪', name: 'Potion of Supreme Mana', type: 'Consumable', cost: 300, desc: 'Restores 6 spell slots of 3rd level or below.' }
  ],
  misc: [
    { icon: '🔦', name: 'Lantern of Revealing', type: 'Utility', cost: 80, desc: 'Sheds bright light for 60ft. Invisible creatures and objects are revealed.' },
    { icon: '🧭', name: 'Rope of Climbing', type: 'Utility', cost: 120, desc: '60ft of rope that obeys spoken commands. Climbs on command.' },
    { icon: '📜', name: 'Scroll of Teleportation', type: 'Consumable', cost: 350, desc: 'Teleports you and up to 5 allies to any location you\'ve seen.' },
    { icon: '💎', name: 'Bag of Holding', type: 'Wondrous', cost: 1000, desc: 'Extradimensional space: 500 lbs, 64 cubic feet. Don\'t look inside.' },
    { icon: '🗝️', name: 'Ring of Keys', type: 'Accessory', cost: 25, desc: 'Magical keys that open any non-magical lock. Three uses per day.' },
    { icon: '📿', name: 'Amulet of Proof', type: 'Accessory', cost: 600, desc: 'Grants immunity to being frightened and charmed.' }
  ]
};


// ─── NOTIFICATION SYSTEM ───────────────────────────────

let notifTimeout;

function showNotification(title, body) {
  const el = document.getElementById('notification');
  document.getElementById('notifTitle').textContent = title;
  document.getElementById('notifBody').textContent = body;
  el.classList.add('show');
  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(function() {
    el.classList.remove('show');
  }, 3500);
}


// ─── TOOLTIP SYSTEM ────────────────────────────────────

const tooltip = document.getElementById('itemTooltip');
let activeTooltipItem = null;

function showTooltip(item, e) {
  activeTooltipItem = item;
  document.getElementById('ttName').textContent = item.name;
  document.getElementById('ttType').textContent = item.type;
  document.getElementById('ttDesc').textContent = item.desc;
  document.getElementById('ttStats').textContent = '\u{1F4B0} ' + item.cost + ' gold';
  tooltip.style.display = 'block';
  positionTooltip(e);
}

function positionTooltip(e) {
  let x = e.clientX + 15;
  let y = e.clientY + 15;
  if (x + 260 > window.innerWidth) x = e.clientX - 270;
  if (y + 150 > window.innerHeight) y = e.clientY - 160;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

function hideTooltip() {
  tooltip.style.display = 'none';
  activeTooltipItem = null;
}


// ─── CHARACTER STATS ───────────────────────────────────

let currentStats = {};

function modFromScore(score) {
  return Math.floor((score - 10) / 2);
}

function renderStats() {
  const grid = document.getElementById('statGrid');
  grid.innerHTML = '';
  STATS.forEach(function(stat) {
    const val = currentStats[stat.abbr] || stat.base;
    const mod = modFromScore(val);
    const card = document.createElement('div');
    card.className = 'stat-card corner-ornament';
    card.innerHTML =
      '<div class="stat-icon">' + stat.icon + '</div>' +
      '<div class="stat-name">' + stat.abbr + '</div>' +
      '<div class="stat-value">' + val + '</div>' +
      '<div class="stat-mod ' + (mod >= 0 ? 'positive' : 'negative') + '">(' + (mod >= 0 ? '+' : '') + mod + ')</div>';

    const gauge = document.createElement('div');
    gauge.className = 'stat-gauge';
    const fill = document.createElement('div');
    fill.className = 'stat-gauge-fill';
    const pct = Math.min(100, Math.max(0, (val - 1) / 19 * 100));
    fill.style.width = pct + '%';
    gauge.appendChild(fill);
    card.appendChild(gauge);
    grid.appendChild(card);
  });
}

function rollStats() {
  currentStats = {};
  STATS.forEach(function(stat) {
    let rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort(function(a, b) { return b - a; });
    rolls.pop();
    currentStats[stat.abbr] = rolls.reduce(function(a, b) { return a + b; }, 0);
  });
  renderStats();
  showNotification('\u{1F3B2} Ability Scores Rolled!', 'Click "Roll" again to reroll your stats.');
}

document.getElementById('rollStatsBtn').addEventListener('click', rollStats);


// ─── QUEST BOARD ───────────────────────────────────────

const acceptedQuests = new Set();

function renderQuests() {
  const board = document.getElementById('questBoard');
  board.innerHTML = '';
  QUESTS.forEach(function(q, i) {
    const card = document.createElement('div');
    card.className = 'quest-card corner-ornament';
    card.dataset.index = i;
    const accepted = acceptedQuests.has(i);
    card.innerHTML =
      '<span class="difficulty-badge difficulty-' + q.difficulty + '">' + q.difficulty + '</span>' +
      '<h3>' + q.title + '</h3>' +
      '<p>' + q.desc + '</p>' +
      '<div class="quest-reward">' +
        '<span class="gold-icon">\u{1F4B0}</span> ' + q.gold + ' Gold &nbsp;|&nbsp; ' + q.reward + ' XP' +
      '</div>' +
      '<div class="quest-details">' +
        '<p style="font-style:italic;color:var(--gold-dim);font-size:0.8rem;margin-bottom:8px;">\u{1F4DC} From: ' + q.giver + '</p>' +
        '<ul class="quest-objectives">' +
          q.objectives.map(function(o) { return '<li>' + o + '</li>'; }).join('') +
        '</ul>' +
        '<p>' + q.details + '</p>' +
        '<button class="accept-btn ' + (accepted ? 'accepted' : '') + '" data-index="' + i + '">' +
          (accepted ? '\u2705 Quest Accepted' : '\u2694\uFE0F Accept Quest') +
        '</button>' +
      '</div>';

    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('accept-btn') || e.target.closest('.accept-btn')) return;
      this.classList.toggle('expanded');
    });

    card.querySelector('.quest-details').addEventListener('click', function(e) {
      e.stopPropagation();
    });

    const acceptBtn = card.querySelector('.accept-btn');
    acceptBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const idx = parseInt(this.dataset.index);
      if (!acceptedQuests.has(idx)) {
        acceptedQuests.add(idx);
        this.textContent = '\u2705 Quest Accepted';
        this.classList.add('accepted');
        card.querySelector('.quest-details').classList.add('active');
        showNotification('\u{1F4DC} Quest Accepted!',
          'You have accepted "' + QUESTS[idx].title + '" — ' + QUESTS[idx].gold + ' gold reward.');
      }
    });

    board.appendChild(card);
  });
}


// ─── SPELL BOOK ────────────────────────────────────────

let activeSchool = 'fire';

function renderSpells() {
  const pages = document.getElementById('spellPages');
  pages.innerHTML = '';
  const spells = SPELLS[activeSchool];
  const page = document.createElement('div');
  page.className = 'spell-page active';
  const grid = document.createElement('div');
  grid.className = 'spell-grid';
  spells.forEach(function(spell) {
    const card = document.createElement('div');
    card.className = 'spell-card';
    card.innerHTML =
      '<div class="spell-school-tag">' + spell.school + ' \u00B7 ' + spell.level + '</div>' +
      '<h4>' + spell.name + '</h4>' +
      '<p class="spell-desc">' + spell.desc + '</p>' +
      '<div class="spell-meta">' +
        '<span class="spell-mana">\u2728 ' + spell.mana + ' Mana</span>' +
        '<span class="spell-level">' + spell.level + '</span>' +
      '</div>';
    grid.appendChild(card);
  });
  page.appendChild(grid);
  pages.appendChild(page);
}

document.querySelectorAll('.spell-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.spell-tab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
    activeSchool = this.dataset.school;
    renderSpells();
  });
});


// ─── SHOP / INVENTORY ──────────────────────────────────

let activeCategory = 'weapons';
let gold = 1240;

function renderShop() {
  const grid = document.getElementById('inventoryGrid');
  grid.innerHTML = '';
  const items = SHOP_ITEMS[activeCategory];
  items.forEach(function(item, i) {
    const slot = document.createElement('div');
    slot.className = 'item-slot corner-ornament';
    slot.innerHTML =
      '<span class="item-icon">' + item.icon + '</span>' +
      '<div class="item-name">' + item.name + '</div>' +
      '<div class="item-type">' + item.type + '</div>' +
      '<div class="item-cost">\u{1F4B0} ' + item.cost + '</div>';

    slot.addEventListener('mouseenter', function(e) {
      showTooltip(item, e);
    });
    slot.addEventListener('mousemove', function(e) {
      if (activeTooltipItem === item) positionTooltip(e);
    });
    slot.addEventListener('mouseleave', hideTooltip);
    slot.addEventListener('click', function() {
      if (gold >= item.cost) {
        gold -= item.cost;
        document.getElementById('goldAmount').textContent = gold.toLocaleString();
        showNotification('\u{1F6D2} Purchase Complete!',
          'You bought ' + item.name + ' for ' + item.cost + ' gold.');
        slot.style.borderColor = 'var(--forest-light)';
        var capturedSlot = slot;
        setTimeout(function() {
          if (capturedSlot) capturedSlot.style.borderColor = '';
        }, 1000);
      } else {
        showNotification('\u26A0\uFE0F Not Enough Gold',
          'You need ' + (item.cost - gold) + ' more gold.');
      }
    });
    grid.appendChild(slot);
  });
}

document.querySelectorAll('.shop-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.shop-tab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
    activeCategory = this.dataset.category;
    renderShop();
  });
});


// ─── PARTICLE SYSTEM — Floating Embers ─────────────────

var var_gold_dim = '#8a7030';

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
var particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Particle() {
  this.reset();
}

Particle.prototype.reset = function() {
  this.x = Math.random() * canvas.width;
  this.y = canvas.height + 10;
  this.vx = (Math.random() - 0.5) * 0.5;
  this.vy = -(Math.random() * 0.8 + 0.2);
  this.size = Math.random() * 2.5 + 0.5;
  this.opacity = Math.random() * 0.6 + 0.2;
  this.decay = Math.random() * 0.002 + 0.001;
  var colors = ['#ff6a00', '#ffaa00', '#ffcc00', '#ff4400', '#ffdd55'];
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.wobbleSpeed = Math.random() * 0.02 + 0.01;
  this.wobbleAmp = Math.random() * 0.5 + 0.2;
  this.phase = Math.random() * Math.PI * 2;
};

Particle.prototype.update = function() {
  this.x += this.vx + Math.sin(this.phase) * this.wobbleAmp;
  this.y += this.vy;
  this.phase += this.wobbleSpeed;
  this.opacity -= this.decay;
  if (this.opacity <= 0 || this.y < -10) this.reset();
};

Particle.prototype.draw = function() {
  ctx.save();
  ctx.globalAlpha = this.opacity;
  ctx.fillStyle = this.color;
  ctx.shadowBlur = 8;
  ctx.shadowColor = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

function CandleGlow(x, y) {
  this.x = x;
  this.y = y;
  this.radius = Math.random() * 150 + 80;
  this.opacity = Math.random() * 0.04 + 0.01;
  this.pulse = Math.random() * 0.02 + 0.01;
  this.phase = Math.random() * Math.PI * 2;
}

CandleGlow.prototype.update = function() {
  this.phase += this.pulse;
};

CandleGlow.prototype.draw = function() {
  var o = this.opacity + Math.sin(this.phase) * 0.01;
  var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
  grad.addColorStop(0, 'rgba(255,140,0,' + o + ')');
  grad.addColorStop(0.5, 'rgba(255,100,0,' + (o * 0.3) + ')');
  grad.addColorStop(1, 'rgba(255,100,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
};

for (var i = 0; i < 80; i++) particles.push(new Particle());

var candleGlows = [
  new CandleGlow(window.innerWidth * 0.25, window.innerHeight * 0.15),
  new CandleGlow(window.innerWidth * 0.75, window.innerHeight * 0.1),
  new CandleGlow(window.innerWidth * 0.5, window.innerHeight * 0.05)
];

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  candleGlows.forEach(function(g) { g.update(); g.draw(); });
  particles.forEach(function(p) { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ─── SCROLL REVEAL ─────────────────────────────────────

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
  observer.observe(el);
});


// ─── NAV HIGHLIGHT ON SCROLL ───────────────────────────

var sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', function() {
  var current = '';
  sections.forEach(function(section) {
    var top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.id;
  });
  document.querySelectorAll('.nav-bar a').forEach(function(a) {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});


// ─── BLOOD MOON EASTER EGG ─────────────────────────────

var moonOverlay = document.getElementById('moonOverlay');
var moonActive = false;

document.addEventListener('dblclick', function(e) {
  moonActive = !moonActive;
  moonOverlay.classList.toggle('active', moonActive);
  document.body.style.filter = moonActive ? 'sepia(30%) brightness(0.9) contrast(1.1)' : '';

  var flames = document.querySelectorAll('.flame');
  if (moonActive) {
    showNotification('\u{1F311} Blood Moon Rises...', 'The realm darkens. Shadows grow longer...');
    flames.forEach(function(f) {
      f.style.background = 'radial-gradient(ellipse at 50% 80%, #ff3300, #cc0000, transparent)';
    });
  } else {
    flames.forEach(function(f) {
      f.style.background = '';
    });
  }
});


// ─── INITIALIZE ────────────────────────────────────────

rollStats();
renderQuests();
renderSpells();
renderShop();