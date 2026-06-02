/* ==========================================
   AETHORIA ONLINE - World Overview Dashboard JavaScript
   ========================================== */

// Configuration & State
const CONFIG = {
  tickRate: 1000,
  chatRefreshRate: 3000,
  priceUpdateRate: 5000,
  bossTimerInitial: 7350,
  playerUpdateRate: 2000,
  eventChance: 0.1
};

const state = {
  serverTime: new Date(),
  gameDay: 2847,
  gameEra: 5,
  seasonDay: 23,
  seasonLength: 45,
  bossTimer: CONFIG.bossTimerInitial,
  currentPlayer: {
    x: 4532,
    y: 2847,
    zone: 'Ironhold Outskirts',
    level: 80,
    name: 'ArcaneStorm'
  },
  notifications: [],
  killFeed: [],
  chatMessages: [],
  achievements: [],
  dragonEggs: [
    { name: 'Mystic Egg', progress: 78, totalTime: 28800 },
    { name: 'Dragon Egg', progress: 34, totalTime: 86400 }
  ]
};

// Utility Functions
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Server Time & Game Clock
function updateServerTime() {
  state.serverTime = new Date();
  const timeEl = document.getElementById('serverTime');
  if (timeEl) {
    const hours = String(state.serverTime.getHours()).padStart(2, '0');
    const minutes = String(state.serverTime.getMinutes()).padStart(2, '0');
    const seconds = String(state.serverTime.getSeconds()).padStart(2, '0');
    timeEl.textContent = hours + ':' + minutes + ':' + seconds;
  }
}

// World Boss Timer
function updateBossTimer() {
  if (state.bossTimer > 0) {
    state.bossTimer--;
    const timerEls = document.querySelectorAll('.timer[data-target]');
    timerEls.forEach(function(el) {
      el.textContent = '\u26A1 ' + formatTime(state.bossTimer);
      if (state.bossTimer < 600) {
        el.classList.add('urgent');
        el.style.color = 'var(--accent-red)';
      }
    });
    if (state.bossTimer === 0) {
      triggerWorldBossSpawn();
    }
  }
}

function triggerWorldBossSpawn() {
  addNotification('\u{1F525} World Boss VALDRIX THE INFERNAL has spawned!', 'urgent');
  state.bossTimer = CONFIG.bossTimerInitial;
  setTimeout(function() {
    if (state.bossTimer > 3600) {
      state.bossTimer = randomRange(1800, 3600);
      addNotification('\u{1F480} World Boss defeated! Next spawn in ' + formatTime(state.bossTimer), 'success');
    }
  }, 30000);
}

// Player Count Simulation
function updatePlayerCount() {
  const changeEl = document.querySelector('.player-count .change');
  if (changeEl) {
    const change = randomRange(-50, 150);
    const valueEl = document.querySelector('.player-count .value');
    if (valueEl) {
      const currentText = valueEl.childNodes[0].textContent;
      const currentCount = parseInt(currentText.replace(/[^\d]/g, ''));
      const newCount = clamp(currentCount + change, 45000, 55000);
      valueEl.childNodes[0].textContent = formatNumber(newCount) + ' ';
      changeEl.textContent = '(' + (change >= 0 ? '+' : '') + change + ')';
      changeEl.className = 'change ' + (change >= 0 ? 'up' : 'down');
    }
  }
}

// Commodity Price Updates
const basePrices = {
  'Void Essence': 2847,
  'Arcane Crystal': 1293,
  'Dragon Scale': 45200,
  'Holy Relic': 8450,
  'Mythril Ore': 456,
  'Moonpetal': 89,
  'Ectoplasm': 234,
  'Phoenix Feather': 128500
};

function updateCommodityPrices() {
  const commodityItems = document.querySelectorAll('.commodity-item');
  commodityItems.forEach(function(item) {
    const itemNameEl = item.querySelector('.item-name');
    const priceChangeEl = item.querySelector('.price-change');
    const priceEl = item.querySelector('.item-price');
    if (itemNameEl && basePrices[itemNameEl.textContent] !== undefined) {
      const changePercent = (Math.random() - 0.5) * 4;
      const itemName = itemNameEl.textContent;
      const newPrice = Math.round(basePrices[itemName] * (1 + changePercent / 100));
      basePrices[itemName] = newPrice;
      if (priceEl) priceEl.textContent = '\u{1F4B0} ' + formatNumber(newPrice);
      if (priceChangeEl) {
        const formattedChange = changePercent >= 0 ? '\u{1F4C8} +' + Math.abs(changePercent).toFixed(1) + '%' : '\u{1F4C9} -' + Math.abs(changePercent).toFixed(1) + '%';
        priceChangeEl.textContent = formattedChange;
        priceChangeEl.className = 'price-change ' + (changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'stable');
      }
    }
  });
}

// Chat System
const chatTemplates = [
  {
    type: 'trade',
    author: ['GoldKing', 'TraderJoe', 'MerchantPro', 'DealFinder'],
    color: '#f97316',
    messages: [
      'WTS {item} - {price}, whisper me! \u{1F6D2}',
      'WTB {item}, paying good price \u{1F4B0}',
      'Fast seller here! {item} for {price}!',
      'Legendary {item} just posted! \u{1F525}'
    ]
  },
  {
    type: 'normal',
    author: ['ShadowMage99', 'BattleMage', 'HealBot', 'SwiftArrow', 'IronWarrior'],
    color: ['#ffd700', '#ff6b6b', '#22c55e', '#a855f7', '#3b82f6'],
    messages: [
      'LF{role} for {dungeon}, need {ilvl}+ ilvl',
      'Anyone want to run {dungeon}? DM me!',
      'GG everyone in that BG match! \u2694\uFE0F',
      'Good luck on your runs today! \u{1F3AE}',
      'Who is ready for raid tonight? \u{1F525}'
    ]
  },
  {
    type: 'guild',
    author: ['GuildMaster', 'OfficerElf', 'HealLead', 'RaidCommander'],
    color: '#4ecdc4',
    messages: [
      'Raid in {time}! Be ready! \u2694\uFE0F',
      'Remember to bring potions! \u{1F9EA}',
      'We are number 1 guild! \u{1F451}',
      'Great run everyone! Better luck next time!',
      'All tanks report to the front! \u{1F6E1}'
    ]
  },
  {
    type: 'system',
    author: null,
    color: '#06b6d4',
    messages: [
      '{player} has reached Level {level}! \u{1F389}',
      'New dungeon unlocked: {dungeon} \u{1F3F0}',
      'Server record: {player} dealt {damage} damage! \u{1F4A5}',
      'Guild {guild} has conquered {dungeon}! \u{1F3C6}'
    ]
  }
];

const dungeonNames = ['Atal\'Dazar', 'King\'s Rest', 'Waycrest Manor', 'Underrot', 'Tol Dagor', 'Soulrender', 'Plaguefall', 'Mists of Tirna Scith'];
const itemNames = ['Shadowfang Blade', 'Mythril Shield', 'Arcane Staff', 'Dragonhide Armor', 'Void Crystal', 'Phoenix Feather', 'Holy Relic', 'Ancient Tablet'];

function generateChatMessage() {
  const template = randomChoice(chatTemplates);
  const messageData = {
    item: randomChoice(itemNames),
    price: formatNumber(randomRange(10, 500) * 1000),
    dungeon: randomChoice(dungeonNames),
    ilvl: randomRange(400, 500),
    role: randomChoice(['Healer', 'Tank', 'DPS']),
    time: randomRange(15, 60) + ' mins',
    player: randomChoice(['GladiatorX', 'ProGamer', 'Newbie123', 'EliteMaster']),
    level: randomRange(70, 80),
    guild: randomChoice(['Celestial Dominion', 'Iron Vanguard', 'Shadow Covenant']),
    damage: formatNumber(randomRange(100, 500) * 1000)
  };
  let message = randomChoice(template.messages);
  Object.keys(messageData).forEach(function(key) {
    message = message.split('{' + key + '}').join(messageData[key]);
  });
  const authorColor = Array.isArray(template.color) ? randomChoice(template.color) : template.color;
  return {
    type: template.type,
    author: template.author ? randomChoice(template.author) : 'System',
    color: authorColor,
    message: message,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
}

function addChatMessage() {
  const newMessage = generateChatMessage();
  state.chatMessages.push(newMessage);
  const chatContainer = document.querySelector('.chat-messages');
  if (chatContainer) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg ' + newMessage.type;
    msgEl.innerHTML = '\
      <span class="msg-time">[' + newMessage.time + ']</span>\
      <span class="msg-author" style="color: ' + newMessage.color + '">' + newMessage.author + ':</span>\
      <span class="msg-content">' + newMessage.message + '</span>';
    chatContainer.appendChild(msgEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (state.chatMessages.length > 50) {
      state.chatMessages.shift();
      if (chatContainer.firstChild) {
        chatContainer.removeChild(chatContainer.firstChild);
      }
    }
  }
}

// Kill Feed
const playerNames = ['ShadowMage99', 'IronWarrior', 'DragonSlayer', 'HealBot', 'SwiftArrow', 'DeathBringer', 'MageKing', 'ElfHunter'];
const weaponTypes = ['\u2694\uFE0F', '\u{1F525}', '\u{1F3F9}', '\u{1F52E}', '\u{1F480}', '\u26A1', '\u{1F319}', '\u{1F5E1}'];
const weaponNames = ['Fireball', 'Power Shot', 'Execute', 'Arcane Blast', 'Shadow Strike', 'Lightning Bolt', 'Moonfire', 'Deep Strike'];

function addKillToFeed() {
  const killer = randomChoice(playerNames);
  let victim = randomChoice(playerNames);
  while (victim === killer) victim = randomChoice(playerNames);
  const weapon = randomChoice(weaponTypes);
  const weaponName = randomChoice(weaponNames);
  const kill = { killer: killer, weapon: weapon, weaponName: weaponName, victim: victim, time: 'now' };
  state.killFeed.unshift(kill);
  const killFeed = document.querySelector('.kill-feed');
  if (killFeed) {
    const killEl = document.createElement('div');
    killEl.className = 'kill-item';
    killEl.innerHTML = '\
      <span class="killer">' + killer + '</span>\
      <span class="kill-weapon">' + weapon + ' ' + weaponName + '</span>\
      <span class="victim">' + victim + '</span>\
      <span class="kill-time">1s</span>';
    killFeed.insertBefore(killEl, killFeed.firstChild);
    document.querySelectorAll('.kill-item .kill-time').forEach(function(el, i) {
      if (i > 0) {
        const seconds = parseInt(el.textContent);
        if (!isNaN(seconds)) el.textContent = (seconds + 3) + 's';
      }
    });
    if (state.killFeed.length > 10) {
      state.killFeed.pop();
      if (killFeed.lastChild) killFeed.removeChild(killFeed.lastChild);
    }
  }
}

// Notification System
function addNotification(message, type) {
  type = type || 'info';
  const notification = { message: message, type: type, timestamp: Date.now() };
  state.notifications.push(notification);
  const pulseCount = document.querySelector('.pulse-count');
  if (pulseCount) {
    const count = parseInt(pulseCount.textContent) + 1;
    pulseCount.textContent = count;
    pulseCount.style.animation = 'none';
    pulseCount.offsetHeight;
    pulseCount.style.animation = 'pulse-glow 1s ease-in-out infinite';
  }
  showToast(message, type);
}

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  const icon = type === 'urgent' ? '\u{1F525}' : type === 'success' ? '\u2705' : '\u2139\uFE0F';
  toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span>';
  toast.style.cssText = '\
    position: fixed;\
    top: 60px;\
    right: 120px;\
    background: var(--bg-panel);\
    border: 1px solid ' + (type === 'urgent' ? 'var(--accent-red)' : type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)') + ';\
    border-radius: var(--radius-md);\
    padding: var(--spacing-sm) var(--spacing-md);\
    display: flex;\
    align-items: center;\
    gap: var(--spacing-sm);\
    font-size: 10px;\
    z-index: 1000;\
    animation: slideInRight 0.3s ease;\
    color: var(--text-primary);';
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// Achievement Notifications
const achievementTemplates = [
  { icon: '\u{1F480}', name: 'Dungeon Delver', desc: 'Complete 100 dungeons' },
  { icon: '\u2694\uFE0F', name: 'Arena Master', desc: 'Reach 2500 rating' },
  { icon: '\u{1F4B0}', name: 'Treasure Hunter', desc: 'Find 1000 gold' },
  { icon: '\u{1F409}', name: 'Dragon Tamer', desc: 'Hatch a dragon' },
  { icon: '\u{1F3F0}', name: 'Siege Breaker', desc: 'Win a castle siege' },
  { icon: '\u2B50', name: 'Rising Star', desc: 'Level up 10 times' },
  { icon: '\u2692\uFE0F', name: 'Master Crafter', desc: 'Craft 500 items' },
  { icon: '\u{1F5FA}', name: 'World Explorer', desc: 'Discover all zones' }
];

function checkAchievements() {
  if (Math.random() < 0.05) {
    const achievement = randomChoice(achievementTemplates);
    addNotification(achievement.icon + ' Achievement Unlocked: ' + achievement.name + '!', 'success');
    const achFeed = document.querySelector('.achievement-feed');
    if (achFeed) {
      const achEl = document.createElement('div');
      achEl.className = 'ach-item';
      achEl.innerHTML = '\
        <span class="ach-icon">' + achievement.icon + '</span>\
        <div class="ach-info">\
          <span class="ach-name">' + achievement.name + '</span>\
          <span class="ach-desc">' + achievement.desc + '</span>\
        </div>\
        <span class="ach-time">Just now</span>';
      achFeed.insertBefore(achEl, achFeed.firstChild);
      if (achFeed.children.length > 10) {
        achFeed.removeChild(achFeed.lastChild);
      }
    }
  }
}

// Dragon Egg Incubation
function updateDragonEggs() {
  state.dragonEggs.forEach(function(egg, index) {
    egg.progress = Math.min(egg.progress + (100 / egg.totalTime), 100);
    const eggItems = document.querySelectorAll('.egg-item');
    const eggItem = eggItems[index];
    if (eggItem) {
      const fill = eggItem.querySelector('.egg-fill');
      const timer = eggItem.querySelector('.egg-timer');
      if (fill) fill.style.width = egg.progress + '%';
      if (timer && egg.progress >= 100) {
        timer.textContent = '\u{1F389} Hatched!';
        timer.style.color = 'var(--accent-green)';
      }
    }
  });
}

// Player Movement Simulation
function updatePlayerPosition() {
  state.currentPlayer.x += randomRange(-5, 5);
  state.currentPlayer.y += randomRange(-5, 5);
  state.currentPlayer.x = clamp(state.currentPlayer.x, 0, 10000);
  state.currentPlayer.y = clamp(state.currentPlayer.y, 0, 10000);
  const minimapPlayer = document.querySelector('.minimap-player');
  const minimapCoords = document.querySelector('.minimap-coords');
  if (minimapPlayer) {
    const relX = 50 + (state.currentPlayer.x - 5000) / 100;
    const relY = 50 + (state.currentPlayer.y - 5000) / 100;
    minimapPlayer.style.left = clamp(relX, 10, 90) + '%';
    minimapPlayer.style.top = clamp(relY, 10, 90) + '%';
  }
  if (minimapCoords) {
    minimapCoords.textContent = '\u{1F4CD} ' + state.currentPlayer.x + ' / ' + state.currentPlayer.y;
  }
  updatePlayerZone();
}

function updatePlayerZone() {
  const zones = [
    { name: 'Ironhold Outskirts', minX: 4000, maxX: 5000, minY: 2500, maxY: 3500 },
    { name: 'Elysium Forest', minX: 6000, maxX: 7000, minY: 2000, maxY: 3000 },
    { name: 'Frostheim Mountains', minX: 3000, maxX: 4000, minY: 4000, maxY: 5000 },
    { name: 'Ashlands Desert', minX: 7000, maxX: 8000, minY: 6000, maxY: 7000 }
  ];
  const zone = zones.find(function(z) {
    return state.currentPlayer.x >= z.minX && state.currentPlayer.x <= z.maxX &&
           state.currentPlayer.y >= z.minY && state.currentPlayer.y <= z.maxY;
  });
  if (zone) {
    state.currentPlayer.zone = zone.name;
    const zoneEl = document.querySelector('.zone-name');
    if (zoneEl) zoneEl.textContent = '\u{1F4CD} ' + zone.name;
  }
}

// Party Finder Updates
function updatePartyFinder() {
  const parties = document.querySelectorAll('.party-entry');
  parties.forEach(function(party) {
    const timerEl = party.querySelector('.party-timer');
    if (timerEl && timerEl.textContent.indexOf('Full') === -1) {
      const match = timerEl.textContent.match(/\d+/);
      const currentTime = match ? parseInt(match[0]) : 0;
      timerEl.textContent = '\u26A1 ' + (currentTime + 1) + 'm';
      if (currentTime > 60) {
        timerEl.classList.add('urgent');
      }
    }
    const slots = party.querySelectorAll('.slot.empty');
    if (slots.length > 0 && Math.random() < 0.1) {
      const slot = randomChoice(Array.from(slots));
      slot.classList.remove('empty');
      slot.classList.add('filled');
      slot.textContent = randomChoice(['DPS', 'HEAL', 'TANK']);
    }
  });
}

// Resource Node Updates
function updateResourceNodes() {
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(function(node) {
    if (node.classList.contains('available')) {
      if (Math.random() < 0.02) {
        node.classList.remove('available');
        node.classList.add('contested');
      }
    } else if (node.classList.contains('contested')) {
      if (Math.random() < 0.05) {
        node.classList.remove('contested');
        node.classList.add('available');
      } else if (Math.random() < 0.1) {
        node.classList.remove('contested');
        node.classList.add('depleted');
        node.textContent = node.textContent.replace('\u26CF\uFE0F', '\u274C');
      }
    } else if (node.classList.contains('depleted')) {
      if (Math.random() < 0.01) {
        node.classList.remove('depleted');
        node.classList.add('available');
        node.textContent = node.textContent.replace('\u274C', '\u26CF\uFE0F');
      }
    }
  });
}

// Weather Effects
function updateWeatherEffects() {
  const weatherCards = document.querySelectorAll('.weather-card');
  weatherCards.forEach(function(card) {
    const effects = card.querySelectorAll('.effect');
    effects.forEach(function(effect) {
      if (Math.random() < 0.1) {
        effect.style.opacity = '0.5';
        setTimeout(function() { effect.style.opacity = '1'; }, 500);
      }
    });
  });
}

// Territory Interactions
function initTerritoryInteractions() {
  const territories = document.querySelectorAll('.territory');
  territories.forEach(function(territory) {
    territory.addEventListener('mouseenter', function() {
      this.style.zIndex = '20';
      this.style.transform = 'scale(1.05)';
    });
    territory.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
      this.style.transform = 'scale(1)';
    });
    territory.addEventListener('click', function() {
      const kingdom = this.dataset.kingdom;
      const alignment = this.dataset.alignment;
      const pop = this.dataset.pop;
      const gdp = this.dataset.gdp;
      addNotification('\u{1F3F0} ' + kingdom + ' - ' + alignment + ' faction | Pop: ' + formatNumber(parseInt(pop)) + ' | GDP: ' + gdp, 'info');
    });
  });
}

// Chat Input Handler
function initChatInput() {
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  if (chatInput && chatSend) {
    chatSend.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        sendChatMessage();
      }
    });
  }
}

function sendChatMessage() {
  const chatInput = document.querySelector('.chat-input');
  if (chatInput && chatInput.value.trim()) {
    const message = {
      type: 'normal',
      author: state.currentPlayer.name,
      color: '#fbbf24',
      message: chatInput.value.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    state.chatMessages.push(message);
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      const msgEl = document.createElement('div');
      msgEl.className = 'chat-msg';
      msgEl.innerHTML = '\
        <span class="msg-time">[' + message.time + ']</span>\
        <span class="msg-author" style="color: ' + message.color + '">' + message.author + ':</span>\
        <span class="msg-content">' + message.message + '</span>';
      chatContainer.appendChild(msgEl);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    chatInput.value = '';
  }
}

// Tab Switching
function initTabSwitching() {
  document.querySelectorAll('.view-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.view-toggle').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
  document.querySelectorAll('.filter-pills .pill').forEach(function(pill) {
    pill.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
    });
  });
  document.querySelectorAll('.activity-filters .filter').forEach(function(filter) {
    filter.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.filter').forEach(function(f) { f.classList.remove('active'); });
      this.classList.add('active');
    });
  });
  document.querySelectorAll('.chat-tabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.innerHTML = '';
        const tabText = this.textContent.toLowerCase();
        const type = tabText.indexOf('guild') !== -1 ? 'guild' : tabText.indexOf('trade') !== -1 ? 'trade' : null;
        state.chatMessages
          .filter(function(m) { return !type || m.type === type || m.type === 'system'; })
          .slice(-20)
          .forEach(function(msg) {
            const msgEl = document.createElement('div');
            msgEl.className = 'chat-msg ' + msg.type;
            msgEl.innerHTML = '\
              <span class="msg-time">[' + msg.time + ']</span>\
              <span class="msg-author" style="color: ' + msg.color + '">' + msg.author + ':</span>\
              <span class="msg-content">' + msg.message + '</span>';
            chatMessages.appendChild(msgEl);
          });
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  });
  document.querySelectorAll('.market-tabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
}

// Tooltip System
function initTooltips() {
  document.querySelectorAll('[title]').forEach(function(el) {
    el.addEventListener('mouseenter', function(e) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.title;
      tooltip.style.cssText = '\
        position: fixed;\
        left: ' + (e.pageX + 10) + 'px;\
        top: ' + (e.pageY + 10) + 'px;\
        background: var(--bg-elevated);\
        border: 1px solid var(--border-medium);\
        padding: var(--spacing-xs) var(--spacing-sm);\
        border-radius: var(--radius-sm);\
        font-size: 9px;\
        z-index: 1000;\
        pointer-events: none;\
        white-space: nowrap;\
        color: var(--text-primary);';
      document.body.appendChild(tooltip);
      this._tooltip = tooltip;
    });
    el.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });
}

// Random World Events
function triggerRandomEvent() {
  const events = [
    {
      name: 'Meteor Shower',
      icon: '\u2604\uFE0F',
      effect: function() { addNotification('\u2604\uFE0F Meteor Shower in Ashlands! Rare resources available!', 'info'); }
    },
    {
      name: 'Guild War Begins',
      icon: '\u2694\uFE0F',
      effect: function() { addNotification('\u2694\uFE0F Guild War declared: Iron Vanguard vs Shadow Covenant!', 'urgent'); }
    },
    {
      name: 'Market Surge',
      icon: '\u{1F4C8}',
      effect: function() {
        Object.keys(basePrices).forEach(function(k) { basePrices[k] = Math.round(basePrices[k] * 1.1); });
        updateCommodityPrices();
        addNotification('\u{1F4C8} Market surge! All commodity prices increased by 10%!', 'success');
      }
    },
    {
      name: 'Rare Spawn',
      icon: '\u2B50',
      effect: function() { addNotification('\u2B50 Rare spawn detected: Golden Dragon in Elysium Forest!', 'urgent'); }
    },
    {
      name: 'Server Boost',
      icon: '\u{1F389}',
      effect: function() { addNotification('\u{1F389} Server-wide 2x XP active for 1 hour!', 'success'); }
    }
  ];
  if (Math.random() < CONFIG.eventChance) {
    const event = randomChoice(events);
    event.effect();
  }
}

// Cooldown Timer Updates
function updateCooldowns() {
  const cdTimers = document.querySelectorAll('.cd-timer:not(.ready)');
  cdTimers.forEach(function(timer) {
    const current = timer.textContent;
    if (current.indexOf('m') !== -1) {
      const minutes = parseInt(current);
      if (minutes > 0) {
        timer.textContent = (minutes - 1) + 'm';
      }
    } else if (current.indexOf('s') !== -1) {
      const seconds = parseInt(current);
      if (seconds > 0) {
        timer.textContent = (seconds - 1) + 's';
      } else {
        timer.textContent = 'Ready!';
        timer.classList.add('ready');
      }
    }
  });
}

// Quest Progress Updates
function updateQuestProgress() {
  const questItems = document.querySelectorAll('.quest-item.in-progress');
  questItems.forEach(function(quest) {
    const progressEl = quest.querySelector('.quest-progress');
    if (progressEl) {
      const progress = progressEl.textContent;
      const match = progress.match(/(\d+)\/(\d+)/);
      if (match) {
        const current = parseInt(match[1]);
        const total = parseInt(match[2]);
        if (current < total && Math.random() < 0.3) {
          const newProgress = Math.min(current + 1, total);
          progressEl.textContent = newProgress + '/' + total;
          if (newProgress === total) {
            quest.classList.remove('in-progress');
            quest.classList.add('completed');
            const checkEl = quest.querySelector('.quest-check');
            if (checkEl) checkEl.textContent = '\u2705';
            const nameEl = quest.querySelector('.quest-name');
            if (nameEl) addNotification('\u2705 Quest completed: ' + nameEl.textContent, 'success');
          }
        }
      }
    }
  });
}

// Season Progress Animation
function updateSeasonProgress() {
  const seasonFill = document.querySelector('.season-fill');
  if (seasonFill) {
    const currentWidth = parseFloat(seasonFill.style.width) || 67;
    const newWidth = Math.min(currentWidth + 0.001, 100);
    seasonFill.style.width = newWidth + '%';
    const label = document.querySelector('.season-label');
    if (label) label.textContent = Math.round(newWidth) + '% Complete';
  }
}

// Key Press Commands
function initKeyCommands() {
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const chatInput = document.querySelector('.chat-input');
      if (chatInput) chatInput.focus();
    }
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      const pulseCount = document.querySelector('.pulse-count');
      if (pulseCount) pulseCount.textContent = '0';
      addNotification('All notifications cleared', 'info');
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.tooltip').forEach(function(t) { t.remove(); });
    }
  });
}

// Add CSS Animations Dynamically
function addDynamicStyles() {
  if (!document.getElementById('dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.textContent = '\
      @keyframes slideInRight {\
        from { transform: translateX(100%); opacity: 0; }\
        to { transform: translateX(0); opacity: 1; }\
      }\
      @keyframes slideOutRight {\
        from { transform: translateX(0); opacity: 1; }\
        to { transform: translateX(100%); opacity: 0; }\
      }\
      .panel .panel-header .view-toggle,\
      .panel .panel-header .filter-pills .pill,\
      .panel .panel-header .market-tabs .tab,\
      .panel .panel-header .activity-filters .filter,\
      .panel .panel-header .chat-tabs .tab {\
        font-size: 9px;\
        padding: 3px 8px;\
        border-radius: var(--radius-sm);\
        cursor: pointer;\
        transition: all var(--transition-fast);\
        color: var(--text-secondary);\
        background: transparent;\
        border: 1px solid transparent;\
      }';
    document.head.appendChild(style);
  }
}

// Initialize Dashboard
function init() {
  console.log('\u2694\uFE0F Aethoria Online Dashboard Initializing...');
  addDynamicStyles();
  initTerritoryInteractions();
  initChatInput();
  initTabSwitching();
  initTooltips();
  initKeyCommands();

  setInterval(updateServerTime, 1000);
  setInterval(updateBossTimer, 1000);
  setInterval(updateCooldowns, 1000);
  setInterval(updatePlayerCount, 10000);
  setInterval(updateCommodityPrices, CONFIG.priceUpdateRate);
  setInterval(addChatMessage, CONFIG.chatRefreshRate);
  setInterval(addKillToFeed, 4000);
  setInterval(updatePartyFinder, 5000);
  setInterval(updateResourceNodes, 8000);
  setInterval(updateDragonEggs, 1000);
  setInterval(updateQuestProgress, 3000);
  setInterval(checkAchievements, 10000);
  setInterval(updateWeatherEffects, 2000);
  setInterval(triggerRandomEvent, 30000);
  setInterval(updateSeasonProgress, 1000);
  setInterval(updatePlayerPosition, CONFIG.playerUpdateRate);

  updateServerTime();
  updateBossTimer();

  console.log('\u2705 Aethoria Online Dashboard Ready!');
  console.log('\u{1F4CA} Loaded panels: 17');
  console.log('\u{1F465} Online players: ' + formatNumber(47892));
  console.log('\u26A1 World Boss: ' + formatTime(state.bossTimer));
}

// Debug Commands
window.Aethoria = {
  forceBossSpawn: function() {
    state.bossTimer = 0;
    addNotification('\u{1F525} World Boss spawning...', 'urgent');
  },
  notify: function(msg, type) { addNotification(msg, type || 'info'); },
  getState: function() { return state; },
  debug: function() {
    console.log('Current State:', state);
    console.log('Base Prices:', basePrices);
    console.log('Chat Messages:', state.chatMessages);
  }
};

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
  konamiCode.push(e.code);
  konamiCode = konamiCode.slice(-10);
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    addNotification('\u{1F409} CHEAT CODE ACTIVATED! Summoning Golden Dragon!', 'success');
    const dragonSlots = document.querySelectorAll('.dragon-slot.empty');
    if (dragonSlots.length > 0) {
      const slot = dragonSlots[0];
      slot.classList.remove('empty');
      slot.classList.add('equipped');
      slot.innerHTML = '\
        <span class="dragon-icon">\u{1F409}</span>\
        <span class="dragon-name">Golden Drake</span>\
        <span class="dragon-level">Lv. 1 \u2B50</span>\
        <span class="dragon-bond">\u2764\uFE0F 100% Bond</span>';
    }
  }
});

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}