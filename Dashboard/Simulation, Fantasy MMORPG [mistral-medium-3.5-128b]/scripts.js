// ===== GLOBAL STATE =====
const state = {
  onlinePlayers: 12450,
  activeRaids: 4,
  goldFlow: 320,
  weather: {
    Aetheria: { icon: '☀️', temp: 24, condition: 'Clear', wind: 8, humidity: 45 },
    Frostveil: { icon: '❄️', temp: -5, condition: 'Blizzard', wind: 22, humidity: 80 },
    Emberhold: { icon: '🌋', temp: 38, condition: 'Volcanic Ash', wind: 15, humidity: 20 },
    Stormhold: { icon: '⛈️', temp: 18, condition: 'Thunderstorm', wind: 30, humidity: 90 }
  },
  season: {
    current: 'Spring',
    progress: 35,
    cycle: ['Spring', 'Summer', 'Autumn', 'Winter']
  },
  dayCycle: 12,
  lastUpdated: new Date(),
  serverStatus: 'Online',
  raids: [
    { name: 'Crypt of the Forgotten', progress: 87, time: '12:45', status: 'In Progress' },
    { name: 'Molten Core', progress: 63, time: '18:20', status: 'In Progress' },
    { name: 'Castle Blackthorn', progress: 100, time: '05:10', status: 'Completed' },
    { name: 'Vortex of Madness', progress: 0, time: '--:--', status: 'Not Started' },
    { name: 'Web of Shadows', progress: 25, time: '25:30', status: 'In Progress' }
  ],
  marketItems: [
    { icon: '⚔️', name: 'Steel Sword', price: 125, trend: '+5%' },
    { icon: '🛡️', name: 'Dragonplate', price: 2450, trend: '-2%' },
    { icon: '🍄', name: 'Mana Potion', price: 45, trend: '+12%' },
    { icon: '💎', name: 'Diamond', price: 8000, trend: 'Stable' },
    { icon: '🧙', name: 'Spell Scroll', price: 320, trend: '+8%' },
    { icon: '🐎', name: 'Warhorse', price: 1800, trend: '-3%' }
  ],
  events: [
    "⚡ Stormcallers have captured Emberhold Outpost!",
    "💀 Crypt of the Forgotten resets in 01:23:45!",
    "🔥 Dragon Attack in Frostveil! Seek shelter!",
    "🏆 Guild War declared: Obsidian Legion vs. Shadow Syndicate!",
    "🌪️ Vortex of Madness now open for raids!",
    "💰 Market Crash: Diamond prices drop by 15%!",
    "🛡️ Iron Pact has claimed a new territory!",
    "☠️ Necromancer sightings near Castle Blackthorn!",
    "🌿 Verdant Guard is recruiting! Join now!",
    "🐉 Drakonar has awoken! Raid starts in 30 minutes!"
  ],
  guilds: [
    { rank: 1, name: 'Obsidian Legion', members: 420, power: '12.5M', territories: 15, alliance: 'Iron Pact' },
    { rank: 2, name: 'Frostborn', members: 380, power: '11.8M', territories: 12, alliance: 'Iron Pact' },
    { rank: 3, name: 'Stormcallers', members: 350, power: '10.2M', territories: 9, alliance: 'Tideborn' },
    { rank: 4, name: 'Verdant Guard', members: 290, power: '8.7M', territories: 7, alliance: 'Wildheart' },
    { rank: 5, name: 'Shadow Syndicate', members: 240, power: '7.5M', territories: 5, alliance: 'None' },
    { rank: 6, name: 'Dawnbringers', members: 220, power: '6.3M', territories: 4, alliance: 'Radiant' },
    { rank: 7, name: 'Drakonar', members: 180, power: '5.9M', territories: 3, alliance: 'None' },
    { rank: 8, name: 'Tideborn', members: 160, power: '5.1M', territories: 2, alliance: 'Stormcallers' }
  ]
};

// ===== DOM ELEMENTS =====
const elements = {
  worldTime: document.getElementById('world-time'),
  serverTime: document.getElementById('server-time'),
  onlinePlayers: document.getElementById('online-players'),
  activeRaids: document.getElementById('active-raids'),
  goldFlow: document.getElementById('gold-flow'),
  weather: document.getElementById('weather'),
  temp: document.getElementById('temp'),
  season: document.getElementById('season'),
  dayCycle: document.getElementById('day-cycle'),
  lastUpdated: document.getElementById('last-updated'),
  serverStatus: document.getElementById('server-status'),
  territoryMap: document.getElementById('territory-map'),
  guildTable: document.getElementById('guild-table'),
  raidList: document.getElementById('raid-list'),
  eventTicker: document.getElementById('event-ticker'),
  currentSeason: document.getElementById('current-season'),
  seasonProgress: document.getElementById('season-progress')
};

// ===== INITIAL RENDER =====
function renderInitialState() {
  // Update top bar stats
  elements.onlinePlayers.textContent = state.onlinePlayers.toLocaleString();
  elements.activeRaids.textContent = state.activeRaids;
  elements.goldFlow.textContent = state.goldFlow.toLocaleString();
  elements.weather.textContent = state.weather.Aetheria.condition;
  elements.temp.textContent = `${state.weather.Aetheria.temp}°C`;
  elements.season.textContent = state.season.current;
  elements.dayCycle.textContent = state.dayCycle;
  elements.lastUpdated.textContent = formatTime(state.lastUpdated);
  elements.serverStatus.textContent = state.serverStatus;

  // Render guild table
  renderGuildTable();

  // Render raid list
  renderRaidList();

  // Render market items
  renderMarketItems();

  // Render weather cards
  renderWeatherCards();

  // Render event ticker
  renderEventTicker();

  // Render season progress
  updateSeasonProgress();

  // Start clocks
  startClocks();

  // Start dynamic updates
  startDynamicUpdates();
}

// ===== CLOCKS =====
function startClocks() {
  function updateClocks() {
    const now = new Date();
    const worldTime = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // World time is +3 hours
    elements.worldTime.textContent = formatTime(worldTime);
    elements.serverTime.textContent = formatTime(now);
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ===== DYNAMIC UPDATES =====
function startDynamicUpdates() {
  // Update player count randomly every 5-10 seconds
  setInterval(() => {
    state.onlinePlayers += Math.floor(Math.random() * 20) - 10;
    elements.onlinePlayers.textContent = state.onlinePlayers.toLocaleString();
    elements.lastUpdated.textContent = formatTime(new Date());
  }, 5000 + Math.random() * 5000);

  // Update gold flow randomly
  setInterval(() => {
    state.goldFlow += Math.floor(Math.random() * 50) - 25;
    elements.goldFlow.textContent = state.goldFlow.toLocaleString();
  }, 7000 + Math.random() * 5000);

  // Update raid progress
  setInterval(updateRaidProgress, 10000);

  // Update marketplace
  setInterval(updateMarketplace, 15000);

  // Update weather
  setInterval(updateWeather, 30000);

  // Update season progress
  setInterval(updateSeason, 60000);

  // Add random events
  setInterval(addRandomEvent, 20000);
}

// ===== GUILD TABLE =====
function renderGuildTable() {
  elements.guildTable.innerHTML = state.guilds.map(guild => `
    <tr>
      <td>${guild.rank}</td>
      <td>${guild.icon || ''} ${guild.name}</td>
      <td>${guild.members.toLocaleString()}</td>
      <td>${guild.power}</td>
      <td>${guild.territories}</td>
      <td>${guild.alliance}</td>
    </tr>
  `).join('');
}

// ===== RAID PROGRESS =====
function renderRaidList() {
  elements.raidList.innerHTML = state.raids.map(raid => `
    <div class="raid-item">
      <span class="raid-name">${getRaidIcon(raid.name)} ${raid.name}</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${raid.progress}%;"></div>
      </div>
      <span class="raid-time">⏱️ ${raid.time}</span>
      <span class="raid-status">${getRaidStatusIcon(raid.status)} ${raid.status}</span>
    </div>
  `).join('');
}

function updateRaidProgress() {
  state.raids.forEach(raid => {
    if (raid.status === 'In Progress') {
      raid.progress += Math.floor(Math.random() * 5);
      if (raid.progress >= 100) {
        raid.progress = 100;
        raid.status = 'Completed';
      }
    } else if (raid.status === 'Not Started' && Math.random() > 0.7) {
      raid.status = 'In Progress';
    }
  });
  renderRaidList();
}

function getRaidIcon(name) {
  const icons = {
    'Crypt of the Forgotten': '💀',
    'Molten Core': '🌋',
    'Castle Blackthorn': '🏰',
    'Vortex of Madness': '🌪️',
    'Web of Shadows': '🕷️'
  };
  return icons[name] || '⚔️';
}

function getRaidStatusIcon(status) {
  const icons = {
    'In Progress': '🔥',
    'Completed': '✅',
    'Not Started': '⏳'
  };
  return icons[status] || '❓';
}

// ===== MARKETPLACE =====
function renderMarketItems() {
  const marketGrid = document.querySelector('.market-grid');
  marketGrid.innerHTML = state.marketItems.map(item => `
    <div class="market-item">
      <span class="item-icon">${item.icon}</span>
      <span class="item-name">${item.name}</span>
      <span class="item-price">${item.price.toLocaleString()}💰</span>
      <span class="item-trend">${item.trend}</span>
    </div>
  `).join('');
}

function updateMarketplace() {
  state.marketItems.forEach(item => {
    const change = Math.floor(Math.random() * 20) - 10;
    item.price += change;
    if (item.price < 1) item.price = 1;

    // Update trend
    if (change > 0) {
      item.trend = `↑ ${Math.abs(change)}%`;
    } else if (change < 0) {
      item.trend = `↓ ${Math.abs(change)}%`;
    } else {
      item.trend = '↗️ Stable';
    }
  });
  renderMarketItems();
}

// ===== WEATHER =====
function renderWeatherCards() {
  const weatherCards = document.querySelectorAll('.weather-card');
  weatherCards.forEach((card, index) => {
    const region = Object.keys(state.weather)[index];
    const data = state.weather[region];
    card.innerHTML = `
      <h3>${getWeatherIcon(region)} ${region}</h3>
      <div class="weather-icon">${data.icon}</div>
      <div class="weather-details">
        <span>${data.temp}°C | ${data.condition}</span>
        <span>Wind: ${data.wind} km/h</span>
        <span>Humidity: ${data.humidity}%</span>
      </div>
    `;
  });
}

function updateWeather() {
  const regions = Object.keys(state.weather);
  regions.forEach(region => {
    const weather = state.weather[region];
    const conditions = ['Clear', 'Cloudy', 'Rain', 'Storm', 'Snow', 'Blizzard', 'Fog', 'Volcanic Ash'];
    const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
    weather.condition = newCondition;
    weather.temp += Math.floor(Math.random() * 5) - 2;
    weather.wind = Math.floor(Math.random() * 30) + 5;
    weather.humidity = Math.floor(Math.random() * 60) + 20;

    // Update icon based on condition
    if (newCondition.includes('Snow') || newCondition.includes('Blizzard')) {
      weather.icon = '❄️';
    } else if (newCondition.includes('Rain') || newCondition.includes('Storm')) {
      weather.icon = '⛈️';
    } else if (newCondition.includes('Clear')) {
      weather.icon = '☀️';
    } else if (newCondition.includes('Cloudy') || newCondition.includes('Fog')) {
      weather.icon = '☁️';
    } else if (newCondition.includes('Volcanic')) {
      weather.icon = '🌋';
    }
  });
  renderWeatherCards();
  elements.weather.textContent = state.weather.Aetheria.condition;
  elements.temp.textContent = `${state.weather.Aetheria.temp}°C`;
}

function getWeatherIcon(region) {
  const icons = {
    Aetheria: '🌍',
    Frostveil: '❄️',
    Emberhold: '🔥',
    Stormhold: '⚡'
  };
  return icons[region] || '🌐';
}

// ===== EVENT TICKER =====
function renderEventTicker() {
  elements.eventTicker.innerHTML = state.events.map(event => `
    <div class="event-item">${event}</div>
  `).join('');
}

function addRandomEvent() {
  const newEvent = state.events[Math.floor(Math.random() * state.events.length)];
  state.events.unshift(newEvent);
  if (state.events.length > 6) state.events.pop();
  renderEventTicker();
}

// ===== SEASON PROGRESS =====
function updateSeasonProgress() {
  elements.currentSeason.textContent = state.season.current;
  elements.seasonProgress.style.width = `${state.season.progress}%`;
}

function updateSeason() {
  state.season.progress += Math.floor(Math.random() * 5);
  if (state.season.progress >= 100) {
    state.season.progress = 0;
    const currentIndex = state.season.cycle.indexOf(state.season.current);
    state.season.current = state.season.cycle[(currentIndex + 1) % state.season.cycle.length];
  }
  updateSeasonProgress();
}

// ===== TOOLTIPS (Optional Enhancement) =====
function addTooltips() {
  const itemsWithTooltips = document.querySelectorAll('[data-tooltip]');
  itemsWithTooltips.forEach(item => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = item.getAttribute('data-tooltip');
    item.appendChild(tooltip);

    item.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });

    item.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  renderInitialState();
  addTooltips();
});