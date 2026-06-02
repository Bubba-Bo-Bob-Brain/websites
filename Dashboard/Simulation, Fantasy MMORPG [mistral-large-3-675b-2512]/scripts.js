// ===== GLOBAL STATE =====
const state = {
  serverTime: new Date(),
  population: 1248,
  economyHealth: 78.5,
  activeQuests: 42,
  threatLevel: 3,
  events: [],
  guilds: [
    { name: "Obsidian Claws", icon: "🐉", power: 92, allies: 3, enemies: 1, inWar: true },
    { name: "Silver Phoenix", icon: "⚔️", power: 85, allies: 2, enemies: 1, inWar: true },
    { name: "Verdant Guard", icon: "🌿", power: 78, allies: 5, enemies: 0, inWar: false },
    { name: "Iron Pact", icon: "⚒️", power: 65, allies: 2, enemies: 2, inWar: false },
    { name: "Shadow Syndicate", icon: "👥", power: 55, allies: 1, enemies: 3, inWar: true }
  ],
  dungeons: [
    { name: "Black Hollow", progress: 65, bosses: 3, teams: 12, icon: "💀" },
    { name: "Frostfang Keep", progress: 20, bosses: 0, teams: 3, icon: "❄️" },
    { name: "Mirefen Depths", progress: 40, bosses: 1, teams: 8, icon: "🌊" },
    { name: "Dragonspire", progress: 5, bosses: 0, teams: 2, icon: "🐉" }
  ],
  marketTrends: [
    { item: "Iron Ore", icon: "🪓", trend: "↑ 12%", change: 12 },
    { item: "Frostbloom", icon: "🍄", trend: "↓ 8%", change: -8 },
    { item: "Lore Scrolls", icon: "📜", trend: "↑ 25%", change: 25 }
  ],
  currentSeason: "Autumn",
  seasonProgress: 45,
  weather: [
    { type: "storm", x: 200, y: 100, radius: 30 },
    { type: "blizzard", x: 400, y: 250, radius: 25 }
  ],
  mapZoom: 1,
  mapPan: { x: 0, y: 0 }
};

// ===== DOM ELEMENTS =====
const elements = {
  // Top Bar
  serverTime: document.getElementById("server-time"),
  population: document.getElementById("population"),
  economyHealth: document.getElementById("economy-health"),
  activeQuests: document.getElementById("active-quests"),
  threatLevel: document.getElementById("threat-level"),

  // Left Panel
  eventTicker: document.getElementById("event-ticker"),
  eventTemplate: document.querySelector(".event-template"),

  // Center Panel
  territoryMap: document.getElementById("territory-map"),
  mapTooltip: document.getElementById("map-tooltip"),
  zoomInBtn: document.getElementById("zoom-in"),
  zoomOutBtn: document.getElementById("zoom-out"),
  resetViewBtn: document.getElementById("reset-view"),
  mapFilters: document.querySelectorAll(".map-filters input"),

  // Right Panel
  guildRankings: document.getElementById("guild-rankings"),
  trendChart: document.getElementById("trend-chart"),
  rankingTabs: document.querySelectorAll(".ranking-tab"),

  // Bottom Panel
  dungeonGrid: document.getElementById("dungeon-grid"),
  fragmentScroll: document.getElementById("fragment-scroll")
};

// ===== INITIALIZATION =====
function init() {
  updateGlobalStats();
  generateGuildRankings();
  generateDungeonCards();
  generateMarketTrends();
  startEventTicker();
  setupMapInteractions();
  setupRankingTabs();
  startSeasonalCycle();
  startGuildWarAnimations();
}

// ===== GLOBAL STATS =====
function updateGlobalStats() {
  // Update server time every second
  setInterval(() => {
    state.serverTime = new Date();
    const hours = state.serverTime.getHours().toString().padStart(2, "0");
    const minutes = state.serverTime.getMinutes().toString().padStart(2, "0");
    elements.serverTime.textContent = `🕒 ${hours}:${minutes}`;

    // Simulate population/economy changes
    state.population = Math.max(0, state.population + (Math.random() * 10 - 5));
    state.economyHealth = Math.max(0, Math.min(100, state.economyHealth + (Math.random() * 2 - 1)));
    state.activeQuests = Math.max(0, state.activeQuests + (Math.random() > 0.7 ? 1 : -1));

    elements.population.textContent = `👥 ${Math.floor(state.population)}`;
    elements.economyHealth.textContent = `💰 ${state.economyHealth.toFixed(1)}`;
    elements.activeQuests.textContent = `📜 ${state.activeQuests}`;
    elements.threatLevel.textContent = `☠️ ${state.threatLevel}`;
  }, 1000);
}

// ===== EVENT TICKER =====
function startEventTicker() {
  const eventTypes = [
    { icon: "⚔️", text: (g1, g2) => `Guild <strong>${g1}</strong> declared war on <strong>${g2}</strong>! 🔥` },
    { icon: "🐉", text: (loc) => `Dragon <strong>Ignarion</strong> spotted near <strong>${loc}</strong>! ⚠️` },
    { icon: "🏆", text: (guild) => `<strong>${guild}</strong> completed the <strong>Eldoria Trials</strong>! 🎉` },
    { icon: "💰", text: (item) => `Market spike: <strong>${item}</strong> prices surged! 📈` },
    { icon: "☠️", text: (guild) => `<strong>${guild}</strong> was defeated in <strong>Black Hollow</strong>! 💀` }
  ];

  const locations = ["Frostpeak", "Black Hollow", "Eldoria City", "Mirefen", "Iron Peaks"];
  const items = ["Iron Ore", "Frostbloom", "Lore Scrolls", "Dragon Scales"];

  // Add initial events
  for (let i = 0; i < 5; i++) {
    addEvent();
  }

  // Add new events every 5-15 seconds
  setInterval(addEvent, Math.floor(Math.random() * 10000) + 5000);

  function addEvent() {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    let text = "";
    let icon = eventType.icon;

    switch (eventType.icon) {
      case "⚔️":
        const guild1 = state.guilds[Math.floor(Math.random() * state.guilds.length)].name;
        const guild2 = state.guilds[Math.floor(Math.random() * state.guilds.length)].name;
        text = eventType.text(guild1, guild2);
        break;
      case "🐉":
        text = eventType.text(locations[Math.floor(Math.random() * locations.length)]);
        break;
      case "🏆":
        text = eventType.text(state.guilds[Math.floor(Math.random() * state.guilds.length)].name);
        break;
      case "💰":
        text = eventType.text(items[Math.floor(Math.random() * items.length)]);
        break;
      case "☠️":
        text = eventType.text(state.guilds[Math.floor(Math.random() * state.guilds.length)].name);
        break;
    }

    const event = {
      icon,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    state.events.unshift(event);
    if (state.events.length > 20) state.events.pop();

    renderEvents();
  }

  function renderEvents() {
    elements.eventTicker.innerHTML = "";
    state.events.forEach((event, index) => {
      const eventElement = elements.eventTemplate.cloneNode(true);
      eventElement.style.display = "flex";
      eventElement.querySelector(".event-icon").textContent = event.icon;
      eventElement.querySelector(".event-text").innerHTML = event.text;
      eventElement.querySelector(".event-time").textContent = event.time;
      eventElement.style.animationDelay = `${index * 0.1}s`;
      elements.eventTicker.appendChild(eventElement);
    });
  }
}

// ===== GUILD RANKINGS =====
function generateGuildRankings() {
  // Sort guilds by power
  const sortedGuilds = [...state.guilds].sort((a, b) => b.power - a.power);

  elements.guildRankings.innerHTML = "";
  sortedGuilds.forEach((guild, index) => {
    const guildElement = document.createElement("div");
    guildElement.className = "ranking-item";
    guildElement.innerHTML = `
      <span class="rank">${index + 1}</span>
      <span class="guild-icon">${guild.icon}</span>
      <span class="guild-name">${guild.name}</span>
      <span class="guild-power">⚔️ ${guild.power}</span>
      <span class="guild-allies">🤝 ${guild.allies}</span>
      <span class="guild-enemies">🔥 ${guild.enemies}</span>
    `;

    // Add war animation if in war
    if (guild.inWar) {
      const icon = guildElement.querySelector(".guild-icon");
      icon.style.animation = "guildWarPulse 1.5s infinite";
    }

    elements.guildRankings.appendChild(guildElement);
  });
}

// ===== GUILD WAR ANIMATIONS =====
function startGuildWarAnimations() {
  setInterval(() => {
    state.guilds.forEach(guild => {
      guild.inWar = Math.random() > 0.7; // 30% chance to be at war
    });
    generateGuildRankings();
  }, 15000);
}

// ===== MAP INTERACTIONS =====
function setupMapInteractions() {
  let isDragging = false;
  let startX, startY;
  let translateX = 0, translateY = 0;

  // Tooltip
  elements.territoryMap.addEventListener("mousemove", (e) => {
    const svg = e.target.closest("svg");
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

    // Check biome
    const biome = elements.territoryMap.querySelector(`.biome:hover`);
    if (biome) {
      const territory = biome.getAttribute("data-territory");
      const biomeType = biome.getAttribute("data-biome");
      elements.mapTooltip.innerHTML = `
        <strong>${territory}</strong><br>
        Biome: ${biomeType.charAt(0).toUpperCase() + biomeType.slice(1)}
      `;
      elements.mapTooltip.style.opacity = 1;
      elements.mapTooltip.style.left = `${e.clientX}px`;
      elements.mapTooltip.style.top = `${e.clientY - 40}px`;
      return;
    }

    // Check guild territory
    const guild = elements.territoryMap.querySelector(`.guild:hover`);
    if (guild) {
      const guildName = guild.getAttribute("data-guild");
      const strength = guild.getAttribute("data-strength");
      elements.mapTooltip.innerHTML = `
        <strong>${guildName}</strong><br>
        Strength: ${strength}/100
      `;
      elements.mapTooltip.style.opacity = 1;
      elements.mapTooltip.style.left = `${e.clientX}px`;
      elements.mapTooltip.style.top = `${e.clientY - 40}px`;
      return;
    }

    // Check weather
    const weather = elements.territoryMap.querySelector(`.weather-${state.weather[0].type}:hover`);
    if (weather) {
      const weatherType = weather.getAttribute("data-weather");
      elements.mapTooltip.innerHTML = `
        <strong>${weatherType.charAt(0).toUpperCase() + weatherType.slice(1)}</strong><br>
        Coordinates: ${Math.round(x)}, ${Math.round(y)}
      `;
      elements.mapTooltip.style.opacity = 1;
      elements.mapTooltip.style.left = `${e.clientX}px`;
      elements.mapTooltip.style.top = `${e.clientY - 40}px`;
    } else {
      elements.mapTooltip.style.opacity = 0;
    }
  });

  // Zoom controls
  elements.zoomInBtn.addEventListener("click", () => {
    state.mapZoom = Math.min(3, state.mapZoom + 0.2);
    updateMapTransform();
  });

  elements.zoomOutBtn.addEventListener("click", () => {
    state.mapZoom = Math.max(0.5, state.mapZoom - 0.2);
    updateMapTransform();
  });

  elements.resetViewBtn.addEventListener("click", () => {
    state.mapZoom = 1;
    state.mapPan = { x: 0, y: 0 };
    updateMapTransform();
  });

  // Map filters
  elements.mapFilters.forEach(filter => {
    filter.addEventListener("change", (e) => {
      const type = e.target.getAttribute("data-filter");
      const elements = document.querySelectorAll(`.${type}`);
      elements.forEach(el => {
        el.style.display = e.target.checked ? "block" : "none";
      });
    });
  });

  function updateMapTransform() {
    elements.territoryMap.style.transform = `
      translate(${state.mapPan.x}px, ${state.mapPan.y}px)
      scale(${state.mapZoom})
    `;
  }

  // Drag to pan
  elements.territoryMap.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - state.mapPan.x;
    startY = e.clientY - state.mapPan.y;
    elements.territoryMap.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    state.mapPan.x = e.clientX - startX;
    state.mapPan.y = e.clientY - startY;
    updateMapTransform();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    elements.territoryMap.style.cursor = "grab";
  });
}

// ===== MARKET TRENDS =====
function generateMarketTrends() {
  // Simulate a line chart with SVG
  const width = elements.trendChart.clientWidth;
  const height = elements.trendChart.clientHeight;
  const padding = 20;

  // Generate random data points
  const dataPoints = [];
  for (let i = 0; i < 10; i++) {
    dataPoints.push({
      x: (i / 9) * (width - padding * 2) + padding,
      y: height - padding - (Math.random() * (height - padding * 2))
    });
  }

  // Create SVG path
  let pathData = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
  for (let i = 1; i < dataPoints.length; i++) {
    pathData += ` L ${dataPoints[i].x} ${dataPoints[i].y}`;
  }

  // Create gradient for the line
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--color-accent-neon)" />
          <stop offset="100%" stop-color="var(--color-accent-purple)" />
        </linearGradient>
      </defs>
      <path d="${pathData}" fill="none" stroke="url(#trendGradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${dataPoints[0].x}" cy="${dataPoints[0].y}" r="3" fill="var(--color-accent-neon)" />
      <circle cx="${dataPoints[dataPoints.length - 1].x}" cy="${dataPoints[dataPoints.length - 1].y}" r="3" fill="var(--color-accent-purple)" />
    </svg>
  `;

  elements.trendChart.innerHTML = svg;
}

// ===== DUNGEON CARDS =====
function generateDungeonCards() {
  elements.dungeonGrid.innerHTML = "";
  state.dungeons.forEach(dungeon => {
    const dungeonElement = document.createElement("div");
    dungeonElement.className = "dungeon-card";
    dungeonElement.setAttribute("data-dungeon", dungeon.name);
    dungeonElement.innerHTML = `
      <div class="dungeon-icon">${dungeon.icon}</div>
      <div class="dungeon-name">${dungeon.name}</div>
      <div class="dungeon-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${dungeon.progress}%"></div>
        </div>
        <span>${dungeon.progress}%</span>
      </div>
      <div class="dungeon-meta">
        <span class="boss-status">🐉 Boss: ${dungeon.bosses}/5</span>
        <span class="raid-teams">👥 ${dungeon.teams} Teams</span>
      </div>
    `;
    elements.dungeonGrid.appendChild(dungeonElement);

    // Simulate progress updates
    setInterval(() => {
      dungeon.progress = Math.min(100, dungeon.progress + (Math.random() * 3));
      const fill = dungeonElement.querySelector(".progress-fill");
      fill.style.width = `${dungeon.progress}%`;
      dungeonElement.querySelector(".dungeon-progress span").textContent = `${Math.floor(dungeon.progress)}%`;

      // Randomly complete a boss
      if (Math.random() > 0.9 && dungeon.bosses < 5) {
        dungeon.bosses++;
        dungeonElement.querySelector(".boss-status").textContent = `🐉 Boss: ${dungeon.bosses}/5`;
      }
    }, 5000);
  });
}

// ===== SEASONAL CYCLE =====
function startSeasonalCycle() {
  const seasons = ["Spring", "Summer", "Autumn", "Winter"];
  const seasonIcons = ["🌸", "☀️", "🍂", "❄️"];
  const seasonCycle = document.querySelector(".cycle-season");

  // Update season progress
  setInterval(() => {
    state.seasonProgress += 0.1;
    if (state.seasonProgress >= 100) {
      state.seasonProgress = 0;
      const currentIndex = seasons.indexOf(state.currentSeason);
      state.currentSeason = seasons[(currentIndex + 1) % seasons.length];
      seasonCycle.querySelector(".season-icon").textContent = seasonIcons[(currentIndex + 1) % seasons.length];
      seasonCycle.querySelector(".season-name").textContent = state.currentSeason;
    }

    seasonCycle.querySelector(".progress-fill").style.width = `${state.seasonProgress}%`;
    seasonCycle.querySelector(".season-progress span").textContent = `${Math.floor(state.seasonProgress)}%`;
  }, 1000);
}

// ===== RANKING TABS =====
function setupRankingTabs() {
  elements.rankingTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      elements.rankingTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // In a real app, you'd switch content here
      // For now, just log the tab change
      console.log(`Switched to ${tab.getAttribute("data-tab")} tab`);
    });
  });
}

// ===== LORE FRAGMENTS =====
function generateLoreFragments() {
  const fragments = [
    "The <strong>Obsidian Claws</strong> were once exiles, cast out from the Silver Phoenix after the betrayal of their leader, <em>Veyth the Unbroken</em>. Now, they seek vengeance by awakening the ancient dragon <strong>Ignarion</strong> beneath Black Hollow...",
    "Legends speak of a cursed blade hidden in the depths of <strong>Mirefen Swamp</strong>, said to be forged from a fallen star. None who seek it return...",
    "The <strong>Iron Pact</strong> controls the mines of Frostpeak, but their greed has attracted the attention of a frost wyvern. Will they survive the coming blizzard?",
    "The <strong>Verdant Guard</strong> are the only faction to have tamed a unicorn. Their alliance with the fey of Eldoria Forest makes them nearly untouchable... but for how long?",
    "Rumors say the <strong>Shadow Syndicate</strong> has infiltrated every major guild. Their leader, <em>The Veiled One</em>, is said to be a doppelgänger who has lived for centuries..."
  ];

  fragments.forEach(fragment => {
    const fragmentElement = document.createElement("p");
    fragmentElement.className = "fragment";
    fragmentElement.innerHTML = fragment;
    elements.fragmentScroll.appendChild(fragmentElement);
  });

  // Auto-scroll lore
  setInterval(() => {
    elements.fragmentScroll.scrollTop += 1;
    if (elements.fragmentScroll.scrollTop >= elements.fragmentScroll.scrollHeight - elements.fragmentScroll.clientHeight) {
      elements.fragmentScroll.scrollTop = 0;
    }
  }, 100);
}

// ===== START THE DASHBOARD =====
init();
generateLoreFragments();