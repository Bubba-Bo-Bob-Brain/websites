// Aethelgard Online — World Dashboard
// Real-time simulation engine

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    updateInterval: 3000,
    tickerSpeed: 50,
    maxEvents: 50,
    refreshRate: 1000
  };

  // ===== STATE =====
  const state = {
    players: 847,
    serverTime: new Date(),
    tick: 0,
    economy: {
      gold: 1284750,
      itemsTraded: 0,
      activeListings: 15423
    },
    raids: [
      { name: 'Molten Core', progress: 47, party: 8, maxParty: 10, status: 'active' },
      { name: 'Crypt of Whispers', progress: 82, party: 10, maxParty: 10, status: 'active' },
      { name: 'Abyssal Depths', progress: 23, party: 6, maxParty: 10, status: 'active' },
      { name: 'Sky Citadel', progress: 100, party: 10, maxParty: 10, status: 'completed' }
    ],
    resources: {
      northgard: { name: 'Northgard', amount: 847293, production: 1247 },
      ironhold: { name: 'Ironhold', amount: 623456, production: 892 },
      eldoria: { name: 'Eldoria', amount: 432189, production: 654 },
      shadowfen: { name: 'Shadowfen', amount: 298765, production: 432 }
    },
    events: [
      { time: '14:23', icon: '⚔️', text: 'Nightfall Reapers defeated Iron Vanguard in Guild Battle' },
      { time: '14:15', icon: '💎', text: 'Legendary Phoenix Feather dropped in Molten Core' },
      { time: '14:02', icon: '🏰', text: 'Castle Stormgard captured by Dawnbringers' },
      { time: '13:48', icon: '📈', text: 'Market index reaches all-time high of 2,847' },
      { time: '13:35', icon: '⚡', text: 'Server performance spike resolved' },
      { time: '13:22', icon: '🎮', text: 'New PvP season starts in 2 hours' },
      { time: '13:10', icon: '💀', text: 'World boss Fenrir defeated by raid group' },
      { time: '12:58', icon: '🏆', text: 'Player "Shadowblade" reaches Grandmaster rank' }
    ],
    marketItems: [
      { name: 'Dragon Scale', price: 1247, change: 2.3 },
      { name: 'Phoenix Feather', price: 892, change: -1.5 },
      { name: 'Shadow Essence', price: 2341, change: 5.7 },
      { name: 'Crystal Shard', price: 567, change: 0.8 },
      { name: 'Void Stone', price: 4521, change: -3.2 },
      { name: 'Elixir of Power', price: 189, change: 12.4 },
      { name: 'Dragon Scale', price: 3456, change: 2.1 },
      { name: 'Moon Dust', price: 789, change: -1.5 }
    ],
    topPlayers: [
      { name: 'Nightmare', rank: 1, rating: 2847, class: 'Assassin' },
      { name: 'Stormbringer', rank: 2, rating: 2791, class: 'Mage' },
      { name: 'Ironwall', rank: 3, rating: 2734, class: 'Warrior' },
      { name: 'Shadowstep', rank: 4, rating: 2689, class: 'Rogue' },
      { name: 'Lightweaver', rank: 5, rating: 2642, class: 'Paladin' }
    ]
  };

  // Helper: format number with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Helper: format percentage with sign
  function formatPct(val) {
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}%`;
  }

  // Helper: random int
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper: random float
  function randomFloat(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  }

  // Update territory map
  function updateTerritoryMap() {
    const territories = document.querySelectorAll('.territory');
    const factions = ['northgard', 'ironhold', 'eldoria', 'shadowfen', 'stormreach'];
    const colors = ['#4fc3f7', '#ff7043', '#66bb6a', '#ab47bc', '#ffa726'];
    const names = ['Northgard', 'Ironhold', 'Eldoria', 'Shadowfen', 'Stormreach'];
    
    territories.forEach((territory, index) => {
      const faction = factions[Math.floor(Math.random() * factions.length)];
      const control = randomFloat(40, 100);
      territory.querySelector('.territory-faction').textContent = faction;
      territory.querySelector('.territory-control').textContent = control + '%';
      territory.querySelector('.territory-bar').style.width = control + '%';
    });
  }

  // Helper: update ticker
  function updateTicker() {
    const ticker = document.querySelector('.ticker-content');
    if (!ticker) return;
    
    const events = state.marketEvents;
    const event = events[Math.floor(Math.random() * events.length)];
    const item = event.item;
    const action = Math.random() > 0.5 ? 'sold for' : 'bought for';
    const price = randomInt(100, 5000);
    ticker.textContent = `🔄 ${item} ${action} ${price} gold • `;
    
    setTimeout(updateTicker, randomInt(3000, 8000));
  }

  // Helper: random int
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Initialize dashboard
  function initDashboard() {
    // Update player count
    updatePlayerCount();
    
    // Update server time
    updateServerTime();
    
    // Update resource values
    updateResources();
    
    // Update PvP leaderboard
    updateLeaderboard();
    
    // Update event timeline
    updateEvents();
    
    // Start market ticker
    startMarketTicker();
    
    // Update territory map
    updateTerritoryMap();
    
    // Start auto-refresh intervals
    setInterval(updatePlayerCount, 5000);
    setInterval(updateResources, 10000);
    setInterval(updateEvents, 15000);
    setInterval(updateTerritoryMap, 30000);
    
    // Update server time every second
    setInterval(updateServerTime, 1000);
  }

  // Update player count
  function updatePlayerCount() {
    const count = randomInt(1247, 1893);
    document.getElementById('player-count').textContent = count.toLocaleString();
    
    const online = randomInt(342, 876);
    document.getElementById('online-count').textContent = online.toLocaleString();
  }

  // Update server time
  function updateServerTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('server-time').textContent = timeStr;
    
    // Update season day
    const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    document.getElementById('season-day').textContent = day;
  }

  // Update resources
  function updateResources() {
    const gold = randomInt(100000, 500000);
    const materials = randomInt(50000, 200000);
    const food = randomInt(20000, 100000);
    
    document.getElementById('gold-reserve').textContent = gold.toLocaleString();
    document.getElementById('materials').textContent = materials.toLocaleString();
    document.getElementById('food-supply').textContent = food.toLocaleString();
  }

  // Update events
  function updateEvents() {
    const events = [
      { type: 'battle', message: 'Battle for Stormgard Keep', status: 'ongoing' },
      { type: 'raid', message: 'Dragonflight raid forming', status: 'recruiting' },
      { type: 'tournament', message: 'Arena Season 7', status: 'active' },
      { type: 'festival', message: 'Harvest Moon Festival', status: 'upcoming' },
      { type: 'invasion', message: 'Demon incursion at Dawnhold', status: 'warning' }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    document.getElementById('current-event').textContent = event.message;
    document.getElementById('event-status').textContent = event.status;
  }

  // Start market ticker
  function startMarketTicker() {
    const items = state.marketItems;
    const tickerEl = document.getElementById('market-ticker');
    
    function updateTicker() {
      const item = items[Math.floor(Math.random() * items.length)];
      const change = randomFloat(-15, 15);
      const direction = change >= 0 ? '↑' : '↓';
      const color = change >= 0 ? '#4caf50' : '#f44336';
      
      tickerEl.innerHTML = `${item}: ${randomInt(100, 5000)}g ${direction} ${Math.abs(change).toFixed(1)}%`;
      tickerEl.style.color = color;
    }
    
    updateTicker();
    setInterval(updateTicker, 3000);
  }

  // Update territory map
  function updateTerritoryMap() {
    const territories = [
      { name: 'Northgard', control: randomFloat(45, 75), faction: 'Frostborne' },
      { name: 'Ironhold', control: randomFloat(50, 80), faction: 'Ironclad' },
      { name: 'Shadowfen', control: randomFloat(30, 60), faction: 'Nightshade' },
      { name: 'Stormpeak', control: randomFloat(40, 70), faction: 'Stormguard' },
      { name: 'Sunvale', control: randomFloat(55, 85), faction: 'Dawnweavers' }
    ];
    
    territories.forEach((territory, index) => {
      const el = document.getElementById(`territory-${index + 1}`);
      if (el) {
        el.querySelector('.territory-control').textContent = `${territory.control}%`;
        el.querySelector('.territory-faction').textContent = territory.faction;
        el.querySelector('.progress-fill').style.width = `${territory.control}%`;
      }
    });
  }

  // Update leaderboard
  function updateLeaderboard() {
    const players = state.pvpLeaderboard;
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    
    players.forEach((player, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="rank">#${index + 1}</td>
        <td class="player-name">${player.name}</td>
        <td class="player-rating">${player.rating}</td>
        <td class="player-wins">${player.wins}</td>
        <td class="player-losses">${player.losses}</td>
        <td class="player-kdr">${player.kdr}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Initialize dashboard
  document.addEventListener('DOMContentLoaded', () => {
    // Update all dashboard components
    updatePlayerCount();
    updateResources();
    updateEvents();
    updateTerritoryMap();
    updateLeaderboard();
    startMarketTicker();
    
    // Set up real-time updates
    setInterval(() => {
      updatePlayerCount();
      updateResources();
      updateEvents();
    }, 10000);
    
    setInterval(() => {
      updateTerritoryMap();
    }, 30000);
    
    setInterval(() => {
      updateLeaderboard();
    }, 60000);
    
    // Animate progress bars
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const width = bar.getAttribute('data-width') || '0';
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 100);
    });
  });

  // Utility functions
  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
})();