const animeData = [
  {
    id: 1,
    title: "Blade of the Crimson Moon",
    subtitle: "紅月の刃",
    studio: "MAPPA",
    genres: ["action", "fantasy"],
    rating: 8.7,
    totalEpisodes: 24,
    watchedEpisodes: 18,
    status: "watching",
    nextEpisodeIn: 3840000,
    ratingHistory: [7.2, 7.8, 8.1, 8.0, 8.5, 8.3, 8.7, 8.6, 8.8, 8.7],
    banner: "linear-gradient(135deg, #ff4757 0%, #ff6b81 50%, #c44569 100%)"
  },
  {
    id: 2,
    title: "Starfall Academy",
    subtitle: "星降学園",
    studio: "Kyoto Animation",
    genres: ["romance", "slice-of-life"],
    rating: 9.1,
    totalEpisodes: 13,
    watchedEpisodes: 13,
    status: "completed",
    nextEpisodeIn: null,
    ratingHistory: [8.5, 8.8, 9.0, 9.1, 9.2, 9.0, 9.1, 9.3, 9.1, 9.1],
    banner: "linear-gradient(135deg, #ff6ec7 0%, #c084fc 50%, #a78bfa 100%)"
  },
  {
    id: 3,
    title: "Quantum Echoes",
    subtitle: "量子の残響",
    studio: "Bones",
    genres: ["sci-fi", "action"],
    rating: 8.3,
    totalEpisodes: 24,
    watchedEpisodes: 6,
    status: "watching",
    nextEpisodeIn: 7200000,
    ratingHistory: [7.5, 7.8, 8.0, 8.2, 8.1, 8.3, 8.0, 8.4, 8.2, 8.3],
    banner: "linear-gradient(135deg, #00e5ff 0%, #00b8d4 50%, #0077b6 100%)"
  },
  {
    id: 4,
    title: "Tavern of Whispers",
    subtitle: "囁きの酒場",
    studio: "ufotable",
    genres: ["fantasy", "drama"],
    rating: 8.9,
    totalEpisodes: 12,
    watchedEpisodes: 4,
    status: "watching",
    nextEpisodeIn: 14400000,
    ratingHistory: [8.0, 8.4, 8.7, 8.5, 8.8, 8.9, 8.7, 8.8, 9.0, 8.9],
    banner: "linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #4c1d95 100%)"
  },
  {
    id: 5,
    title: "Laugh Track Zero",
    subtitle: "笑いゼロ",
    studio: "Trigger",
    genres: ["comedy", "slice-of-life"],
    rating: 7.6,
    totalEpisodes: 11,
    watchedEpisodes: 11,
    status: "completed",
    nextEpisodeIn: null,
    ratingHistory: [6.8, 7.2, 7.5, 7.8, 7.6, 7.9, 7.7, 7.5, 7.8, 7.6],
    banner: "linear-gradient(135deg, #ffd700 0%, #fbbf24 50%, #f59e0b 100%)"
  },
  {
    id: 6,
    title: "Neon Abyss Protocol",
    subtitle: "ネオン深淵プロトコル",
    studio: "Production I.G",
    genres: ["sci-fi", "action"],
    rating: 8.0,
    totalEpisodes: 24,
    watchedEpisodes: 0,
    status: "plan-to-watch",
    nextEpisodeIn: 28800000,
    ratingHistory: [7.0, 7.5, 7.8, 8.0, 7.9, 8.1, 8.0, 7.8, 8.2, 8.0],
    banner: "linear-gradient(135deg, #00e5ff 0%, #7cff9b 50%, #00b8d4 100%)"
  },
  {
    id: 7,
    title: "Cherry Blossom Samurai",
    subtitle: "桜の武士",
    studio: "Wit Studio",
    genres: ["action", "drama"],
    rating: 8.5,
    totalEpisodes: 26,
    watchedEpisodes: 12,
    status: "watching",
    nextEpisodeIn: 5400000,
    ratingHistory: [7.8, 8.0, 8.2, 8.4, 8.3, 8.6, 8.5, 8.4, 8.7, 8.5],
    banner: "linear-gradient(135deg, #ff4757 0%, #ff6ec7 50%, #c0392b 100%)"
  },
  {
    id: 8,
    title: "Moonlit Bakery",
    subtitle: "月光パンケーキ",
    studio: "CloverWorks",
    genres: ["romance", "slice-of-life"],
    rating: 8.2,
    totalEpisodes: 13,
    watchedEpisodes: 3,
    status: "watching",
    nextEpisodeIn: 10800000,
    ratingHistory: [7.5, 7.8, 8.0, 8.1, 8.3, 8.2, 8.4, 8.1, 8.3, 8.2],
    banner: "linear-gradient(135deg, #ff6ec7 0%, #ff9ff3 50%, #f368e0 100%)"
  },
  {
    id: 9,
    title: "Iron Requiem",
    subtitle: "鉄のレクイエム",
    studio: "Madhouse",
    genres: ["action", "horror"],
    rating: 7.9,
    totalEpisodes: 24,
    watchedEpisodes: 24,
    status: "completed",
    nextEpisodeIn: null,
    ratingHistory: [7.0, 7.4, 7.7, 7.9, 8.1, 7.8, 8.0, 7.7, 8.2, 7.9],
    banner: "linear-gradient(135deg, #ff4757 0%, #2d1b4e 50%, #1a1a2e 100%)"
  },
  {
    id: 10,
    title: "Parallel Garden",
    subtitle: "平行庭園",
    studio: "SHAFT",
    genres: ["fantasy", "romance"],
    rating: 8.8,
    totalEpisodes: 12,
    watchedEpisodes: 0,
    status: "plan-to-watch",
    nextEpisodeIn: 43200000,
    ratingHistory: [8.2, 8.5, 8.7, 8.9, 8.8, 9.0, 8.7, 8.9, 9.1, 8.8],
    banner: "linear-gradient(135deg, #a855f7 0%, #ff6ec7 50%, #fbbf24 100%)"
  },
  {
    id: 11,
    title: "Drift Velocity",
    subtitle: "ドリフト速度",
    studio: "Sunrise",
    genres: ["action", "sci-fi"],
    rating: 7.4,
    totalEpisodes: 24,
    watchedEpisodes: 8,
    status: "watching",
    nextEpisodeIn: 1800000,
    ratingHistory: [6.8, 7.0, 7.2, 7.5, 7.3, 7.6, 7.4, 7.2, 7.5, 7.4],
    banner: "linear-gradient(135deg, #7cff9b 0%, #00e5ff 50%, #00b8d4 100%)"
  },
  {
    id: 12,
    title: "Sugar Rush Rush",
    subtitle: "シュガーラッシュ",
    studio: "A-1 Pictures",
    genres: ["comedy", "romance"],
    rating: 7.1,
    totalEpisodes: 13,
    watchedEpisodes: 0,
    status: "plan-to-watch",
    nextEpisodeIn: 36000000,
    ratingHistory: [6.5, 6.8, 7.0, 7.2, 7.1, 7.3, 7.0, 7.2, 7.1, 7.1],
    banner: "linear-gradient(135deg, #ffd700 0%, #ff6ec7 50%, #ff9ff3 100%)"
  }
];

const mascotMessages = {
  watching: ["So hyped! ✨", "Tamon time! ~", "Almost there! ⚡", "Can't stop! 💫"],
  completed: ["Done! Yay~ 🎉", "So satisfying! ✨", "Masterpiece! 🌟", "Time for more!"],
  "plan-to-watch": ["Add it! ✦", "On the list! ~", "Gotta watch! 💕", "Someday~ 🌸"],
  default: ["Tamon! ✦", "Watch more! ~", "AniCal! ⭐", "Moe! 💖"]
};

let currentFilter = "all";
let currentGenre = null;
let countdownIntervals = {};

function formatTime(ms) {
  if (!ms || ms <= 0) return "Airing now!";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function createSparklinePath(history) {
  const width = 200;
  const height = 40;
  const padding = 4;
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;

  const points = history.map((val, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return { linePath, areaPath, width, height };
}

function createCountdownRing(progress) {
  const circumference = 2 * Math.PI * 15;
  const offset = circumference - (progress * circumference);
  return { circumference, offset };
}

function getMascotMood(watched, total) {
  if (watched === total && total > 0) return "completed";
  if (watched > 0) return "watching";
  return "default";
}

function updateMascotReaction(status) {
  const mouth = document.getElementById("mascot-mouth");
  const bubble = document.getElementById("mascot-bubble");
  const text = document.getElementById("mascot-text");
  const sparkles = document.getElementById("mascot-sparkles");

  const mood = getMascotMood(0, 0);
  let messages;

  if (status) {
    messages = mascotMessages[status] || mascotMessages.default;
  } else {
    messages = mascotMessages[mood] || mascotMessages.default;
  }

  const message = messages[Math.floor(Math.random() * messages.length)];

  mouth.style.borderRadius = status === "completed" ? "50%" : "0 0 12px 12px";
  mouth.style.height = status === "completed" ? "8px" : "6px";
  mouth.style.width = status === "completed" ? "16px" : "12px";

  text.textContent = message;
  bubble.style.animation = "none";
  bubble.offsetHeight;
  bubble.style.animation = "bubblePop 0.3s ease-out";

  if (status === "completed") {
    sparkles.textContent = "✨✨✨";
    sparkles.style.animationDuration = "0.5s";
  } else if (status === "watching") {
    sparkles.textContent = "✦";
    sparkles.style.animationDuration = "2s";
  } else {
    sparkles.textContent = "✧";
    sparkles.style.animationDuration = "3s";
  }
}

function createAnimeCard(anime) {
  const progress = anime.totalEpisodes > 0 ? (anime.watchedEpisodes / anime.totalEpisodes) * 100 : 0;
  const sparkline = createSparklinePath(anime.ratingHistory);
  const countdownProgress = anime.nextEpisodeIn
    ? Math.max(0, Math.min(1, 1 - (anime.nextEpisodeIn / 86400000)))
    : 0;
  const ring = createCountdownRing(countdownProgress);

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(anime.rating / 2) ? "filled" : ""
  );

  const card = document.createElement("div");
  card.className = "anime-card";
  card.dataset.status = anime.status;
  card.dataset.id = anime.id;

  const genreTags = anime.genres.map(g =>
    `<span class="genre-tag ${g}">${g}</span>`
  ).join("");

  card.innerHTML = `
    <div class="card-banner">
      <div class="card-banner-img" style="background: ${anime.banner};"></div>
      <div class="card-banner-overlay"></div>
      <div class="card-status-badge ${anime.status}">
        ${anime.status === "watching" ? "Airing" : anime.status === "completed" ? "Complete" : "Plan to Watch"}
      </div>
      ${anime.nextEpisodeIn ? `
        <div class="card-countdown">
          <div class="countdown-ring">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle class="ring-bg" cx="18" cy="18" r="15"/>
              <circle class="ring-progress" cx="18" cy="18" r="15"
                stroke-dasharray="${ring.circumference}"
                stroke-dashoffset="${ring.offset}"/>
            </svg>
          </div>
          <span class="countdown-time">${formatTime(anime.nextEpisodeIn)}</span>
        </div>
      ` : ''}
    </div>
    <div class="card-body">
      <h2 class="card-title">${anime.title}</h2>
      <p class="card-subtitle">${anime.subtitle} · ${anime.studio}</p>
      <div class="card-genres">${genreTags}</div>
      <div class="card-rating">
        <span class="rating-score">${anime.rating}</span>
        <div class="rating-stars">
          ${stars.map(s => `<span class="star ${s}">★</span>`).join("")}
        </div>
        <div class="rating-sparkline">
          <svg viewBox="0 0 ${sparkline.width} ${sparkline.height}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparklineGradient-${anime.id}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,215,0,0.3)"/>
                <stop offset="100%" stop-color="rgba(255,215,0,0)"/>
              </linearGradient>
            </defs>
            <path class="area" d="${sparkline.areaPath}"/>
            <path d="${sparkline.linePath}"/>
          </svg>
        </div>
      </div>
      <div class="card-progress">
        <div class="progress-header">
          <span class="progress-label">Progress</span>
          <span class="progress-value">${anime.watchedEpisodes} / ${anime.totalEpisodes} eps</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${progress}%"></div>
        </div>
      </div>
      <div class="watch-status">
        <button class="status-btn ${anime.status === "watching" ? "active-airing" : ""}"
          data-status="watching" data-id="${anime.id}">Watching</button>
        <button class="status-btn ${anime.status === "plan-to-watch" ? "active-plan" : ""}"
          data-status="plan-to-watch" data-id="${anime.id}">Plan</button>
        <button class="status-btn ${anime.status === "completed" ? "active-done" : ""}"
          data-status="completed" data-id="${anime.id}">Done</button>
      </div>
    </div>
  `;

  return card;
}

function renderGrid() {
  const grid = document.getElementById("anime-grid");
  grid.innerHTML = "";

  const filtered = animeData.filter(anime => {
    const statusMatch = currentFilter === "all" || anime.status === currentFilter;
    const genreMatch = !currentGenre || anime.genres.includes(currentGenre);
    return statusMatch && genreMatch;
  });

  filtered.forEach((anime, index) => {
    const card = createAnimeCard(anime);
    card.style.animationDelay = `${index * 0.08}s`;
    grid.appendChild(card);
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--color-text-muted);">
        <p style="font-size: 48px; margin-bottom: 16px;">🌸</p>
        <p style="font-family: var(--font-display); font-size: 20px;">No series found</p>
        <p style="font-size: 13px; margin-top: 8px;">Try adjusting your filters~</p>
      </div>
    `;
  }

  updateStats();
  attachCardListeners();
}

function attachCardListeners() {
  document.querySelectorAll(".status-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const newStatus = e.target.dataset.status;
      const anime = animeData.find(a => a.id === id);
      if (anime) {
        anime.status = newStatus;
        renderGrid();
        updateMascotReaction(newStatus);
      }
    });
  });
}

function updateStats() {
  const total = animeData.length;
  const watching = animeData.filter(a => a.status === "watching").length;
  const completed = animeData.filter(a => a.status === "completed").length;

  document.getElementById("total-series").textContent = total;
  document.getElementById("watching-count").textContent = watching;
  document.getElementById("completed-count").textContent = completed;
}

function startCountdowns() {
  setInterval(() => {
    animeData.forEach(anime => {
      if (anime.nextEpisodeIn && anime.nextEpisodeIn > 0) {
        anime.nextEpisodeIn -= 1000;
        if (anime.nextEpisodeIn <= 0) anime.nextEpisodeIn = 0;
      }
    });
    document.querySelectorAll(".anime-card").forEach(card => {
      const id = parseInt(card.dataset.id);
      const anime = animeData.find(a => a.id === id);
      if (!anime) return;

      const countdownEl = card.querySelector(".countdown-time");
      const ringEl = card.querySelector(".ring-progress");

      if (countdownEl) {
        countdownEl.textContent = formatTime(anime.nextEpisodeIn);
      }

      if (ringEl && anime.nextEpisodeIn) {
        const progress = Math.max(0, Math.min(1, 1 - (anime.nextEpisodeIn / 86400000)));
        const ring = createCountdownRing(progress);
        ringEl.style.strokeDashoffset = ring.offset;
      }
    });
  }, 1000);
}

function initFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderGrid();
    });
  });

  document.querySelectorAll(".genre-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const genre = btn.dataset.genre;
      if (currentGenre === genre) {
        currentGenre = null;
        btn.classList.remove("active");
      } else {
        document.querySelectorAll(".genre-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentGenre = genre;
      }
      renderGrid();
    });
  });
}

function initMascot() {
  const mascot = document.getElementById("mascot");
  mascot.addEventListener("click", () => {
    const messages = mascotMessages.default;
    const message = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById("mascot-text").textContent = message;
    document.getElementById("mascot-bubble").style.animation = "none";
    document.getElementById("mascot-bubble").offsetHeight;
    document.getElementById("mascot-bubble").style.animation = "bubblePop 0.3s ease-out";
  });
}

function init() {
  renderGrid();
  initFilters();
  initMascot();
  startCountdowns();
  updateMascotReaction();
}

document.addEventListener("DOMContentLoaded", init);