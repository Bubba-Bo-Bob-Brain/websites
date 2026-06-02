/* ============================================
   ANIME FLOW SEASONAL TRACKER - JAVELIN
   ============================================ */

// DOM Elements
const animeGrid = document.getElementById('animeGrid');
const mascot = document.getElementById('mascot');
const mascotDialogue = document.getElementById('mascotDialogue');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const viewToggles = document.querySelectorAll('.view-toggle');
const totalShowsEl = document.getElementById('totalShows');
const watchedEpisodesEl = document.getElementById('watchedEpisodes');
const daysUntilEndEl = document.getElementById('daysUntilEnd');
const completionRateEl = document.getElementById('completionRate');
const randomPickBtn = document.getElementById('randomPick');

// Anime Data (Simulated)
const animeData = [
  {
    id: 1,
    title: "Demon Slayer: Hashira Training Arc",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "ufotable",
    genres: ["action", "fantasy", "drama"],
    episodes: { current: 8, total: 12 },
    airDay: "Sunday",
    rating: 8.9,
    ratingTrend: [8.5, 8.7, 8.6, 8.8, 8.9, 8.9],
    countdownDays: 3,
    watchStatus: "watching",
    progress: 8
  },
  {
    id: 2,
    title: "My Hero Academia Season 7",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "Bones",
    genres: ["action", "sci-fi", "drama"],
    episodes: { current: 6, total: 25 },
    airDay: "Saturday",
    rating: 8.7,
    ratingTrend: [8.6, 8.7, 8.7, 8.6, 8.7, 8.7],
    countdownDays: 6,
    watchStatus: "watching",
    progress: 6
  },
  {
    id: 3,
    title: "Spy × Family Season 2",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "WIT Studio",
    genres: ["action", "comedy", "slice-of-life"],
    episodes: { current: 4, total: 12 },
    airDay: "Saturday",
    rating: 9.1,
    ratingTrend: [9.0, 9.0, 9.1, 9.1, 9.1, 9.1],
    countdownDays: 6,
    watchStatus: "watching",
    progress: 4
  },
  {
    id: 4,
    title: "The Dangers in My Heart Season 2",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "Shin-Ei Animation",
    genres: ["romance", "comedy", "drama"],
    episodes: { current: 9, total: 12 },
    airDay: "Friday",
    rating: 8.8,
    ratingTrend: [8.5, 8.6, 8.7, 8.7, 8.8, 8.8],
    countdownDays: 2,
    watchStatus: "planned",
    progress: 0
  },
  {
    id: 5,
    title: "Mushoku Tensei: Jobless Reincarnation Season 2",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "Studio Bind",
    genres: ["fantasy", "drama", "romance"],
    episodes: { current: 11, total: 12 },
    airDay: "Sunday",
    rating: 9.0,
    ratingTrend: [8.9, 9.0, 9.0, 9.0, 9.0, 9.0],
    countdownDays: 3,
    watchStatus: "watching",
    progress: 11
  },
  {
    id: 6,
    title: "One Piece: Egghead Arc",
    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "Toei Animation",
    genres: ["action", "adventure", "fantasy"],
    episodes: { current: 15, total: 30 },
    airDay: "Sunday",
    rating: 8.6,
    ratingTrend: [8.5, 8.5, 8.6, 8.6, 8.6, 8.6],
    countdownDays: 3,
    watchStatus: "watching",
    progress: 15
  },
  {
    id: 7,
    title: "Frieren: Beyond Journey's End Part 2",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "Madhouse",
    genres: ["fantasy", "adventure", "drama"],
    episodes: { current: 5, total: 12 },
    airDay: "Friday",
    rating: 9.2,
    ratingTrend: [9.1, 9.2, 9.2, 9.2, 9.2, 9.2],
    countdownDays: 2,
    watchStatus: "watching",
    progress: 5
  },
  {
    id: 8,
    title: "The Apothecary Diaries",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    studio: "TOHO animation",
    genres: ["mystery", "drama", "historical"],
    episodes: { current: 12, total: 12 },
    airDay: "Monday",
    rating: 8.9,
    ratingTrend: [8.7, 8.8, 8.8, 8.9, 8.9, 8.9],
    countdownDays: 7,
    watchStatus: "completed",
    progress: 12
  }
];

// Mascot Dialogues
const mascotDialogues = {
  default: [
    "Let's track your anime journey!",
    "What will you watch next?",
    "So many great shows this season!",
    "Don't forget to update your progress!"
  ],
  watching: [
    "You're watching this one! Keep going!",
    "Episode update time!",
    "This show is getting good, right?"
  ],
  planned: [
    "This is on your watchlist!",
    "Planning to watch this soon?",
    "This one looks promising!"
  ],
  dropped: [
    "Not feeling this one?",
    "Too many shows, gotta choose!"
  ],
  completed: [
    "You finished this one! Great job!",
    "Another series completed!"
  ],
  filter: [
    "Filtering by genre!",
    "Let's narrow it down!",
    "Finding your favorites!"
  ],
  random: [
    "Feeling lucky? Let's pick one!",
    "Random choice time!",
    "Let fate decide!"
  ]
};

// State Variables
let currentFilter = 'all';
let currentSort = 'airing';
let currentView = 'grid';
let totalWatchedEpisodes = animeData.reduce((sum, anime) => {
  return sum + (anime.watchStatus === 'watching' || anime.watchStatus === 'completed' ? anime.progress : 0);
}, 0);

// Initialize the application
function init() {
  renderAnimeCards();
  updateStatistics();
  setupEventListeners();
  startCountdownUpdates();
  setupMascotInteractions();
}

// Render anime cards to the grid
function renderAnimeCards() {
  // Clear existing cards (except template)
  const existingCards = animeGrid.querySelectorAll('.anime-card');
  existingCards.forEach((card, index) => {
    if (index > 0) card.remove();
  });
  
  // Filter and sort data
  let filteredData = filterAnimeData(animeData);
  filteredData = sortAnimeData(filteredData);
  
  // Create and append cards
  filteredData.forEach(anime => {
    const card = createAnimeCard(anime);
    animeGrid.appendChild(card);
  });
  
  // Update total shows count
  totalShowsEl.textContent = filteredData.length;
  
  // Update mascot dialogue for filter
  if (currentFilter !== 'all') {
    updateMascotDialogue('filter');
  }
}

// Create anime card element
function createAnimeCard(anime) {
  const card = document.querySelector('.anime-card').cloneNode(true);
  card.classList.remove('hidden');
  card.dataset.id = anime.id;
  card.dataset.genres = anime.genres.join(' ');
  card.dataset.studio = anime.studio;
  
  // Update card content
  card.querySelector('.poster-image').src = anime.image;
  card.querySelector('.poster-image').alt = anime.title;
  card.querySelector('.studio-name').textContent = anime.studio;
  card.querySelector('.anime-title').textContent = anime.title;
  card.querySelector('.episode-info').innerHTML = `<i class="fas fa-play-circle"></i> Ep. ${anime.episodes.current}/${anime.episodes.total}`;
  card.querySelector('.air-day').innerHTML = `<i class="far fa-calendar-alt"></i> ${anime.airDay}s`;
  card.querySelector('.rating-value').textContent = anime.rating;
  
  // Update genre tags
  const genreTags = card.querySelector('.genre-tags');
  genreTags.innerHTML = '';
  anime.genres.forEach(genre => {
    const tag = document.createElement('span');
    tag.className = `genre-tag tag-${genre}`;
    tag.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
    genreTags.appendChild(tag);
  });
  
  // Update rating sparkline
  const sparklineSvg = card.querySelector('.sparkline');
  const points = anime.ratingTrend.map((rating, index) => {
    const x = (index * 20) + 5;
    const y = 20 - ((rating - 8.0) * 20); // Normalize to 8.0-9.5 range
    return `${x},${y}`;
  }).join(' ');
  sparklineSvg.setAttribute('points', points);
  
  // Update countdown ring
  const countdownRing = card.querySelector('.ring-progress');
  const percentage = (anime.countdownDays / 7) * 100;
  countdownRing.setAttribute('stroke-dasharray', `${percentage}, 100`);
  card.querySelector('.countdown-days').textContent = anime.countdownDays;
  
  // Update watch status
  const statusButtons = card.querySelectorAll('.status-btn');
  statusButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.status === anime.watchStatus) {
      btn.classList.add('active');
    }
    
    // Add click event
    btn.addEventListener('click', function() {
      updateWatchStatus(anime.id, this.dataset.status);
      this.parentElement.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      updateMascotDialogue(this.dataset.status);
    });
  });
  
  // Update progress bar
  const progressPercentage = (anime.progress / anime.episodes.total) * 100;
  const progressFill = card.querySelector('.progress-fill');
  progressFill.style.width = `${progressPercentage}%`;
  card.querySelector('.progress-text').textContent = `${anime.progress}/${anime.episodes.total} episodes`;
  
  // Add click event to card
  card.addEventListener('click', function(e) {
    if (!e.target.closest('.status-btn') && !e.target.closest('.filter-btn')) {
      card.classList.toggle('card-expanded');
      updateMascotDialogue(anime.watchStatus);
    }
  });
  
  return card;
}

// Filter anime data based on current filter
function filterAnimeData(data) {
  if (currentFilter === 'all') return data;
  
  return data.filter(anime => 
    anime.genres.includes(currentFilter)
  );
}

// Sort anime data based on current sort
function sortAnimeData(data) {
  switch(currentSort) {
    case 'rating':
      return [...data].sort((a, b) => b.rating - a.rating);
    case 'popularity':
      // Simulate popularity based on rating + episode count
      return [...data].sort((a, b) => {
        const aPopularity = a.rating + (a.episodes.current / 10);
        const bPopularity = b.rating + (b.episodes.current / 10);
        return bPopularity - aPopularity;
      });
    case 'title':
      return [...data].sort((a, b) => a.title.localeCompare(b.title));
    case 'airing':
    default:
      return [...data].sort((a, b) => a.countdownDays - b.countdownDays);
  }
}

// Update watch status for an anime
function updateWatchStatus(animeId, status) {
  const anime = animeData.find(a => a.id === animeId);
  if (!anime) return;
  
  anime.watchStatus = status;
  
  // Update progress based on status
  if (status === 'watching' && anime.progress === 0) {
    anime.progress = 1;
  } else if (status === 'dropped') {
    anime.progress = 0;
  }
  
  // Update statistics
  updateStatistics();
  
  // Update card progress display
  const card = document.querySelector(`.anime-card[data-id="${animeId}"]`);
  if (card) {
    const progressPercentage = (anime.progress / anime.episodes.total) * 100;
    const progressFill = card.querySelector('.progress-fill');
    progressFill.style.width = `${progressPercentage}%`;
    card.querySelector('.progress-text').textContent = `${anime.progress}/${anime.episodes.total} episodes`;
  }
}

// Update all statistics
function updateStatistics() {
  // Calculate total watched episodes
  totalWatchedEpisodes = animeData.reduce((sum, anime) => {
    return sum + (anime.watchStatus === 'watching' || anime.watchStatus === 'completed' ? anime.progress : 0);
  }, 0);
  
  // Calculate completion rate
  const totalPossibleEpisodes = animeData.reduce((sum, anime) => {
    return sum + (anime.watchStatus === 'watching' || anime.watchStatus === 'completed' ? anime.episodes.total : 0);
  }, 0);
  
  const completionRate = totalPossibleEpisodes > 0 
    ? Math.round((totalWatchedEpisodes / totalPossibleEpisodes) * 100) 
    : 0;
  
  // Update DOM elements
  watchedEpisodesEl.textContent = totalWatchedEpisodes;
  completionRateEl.textContent = `${completionRate}%`;
  
  // Update days until season end (simulated)
  const daysLeft = Math.max(0, 42 - Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 42);
  daysUntilEndEl.textContent = daysLeft;
}

// Update mascot dialogue
function updateMascotDialogue(context = 'default') {
  const dialogues = mascotDialogues[context] || mascotDialogues.default;
  const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
  
  mascotDialogue.querySelector('p').textContent = randomDialogue;
  
  // Add animation effect
  mascotDialogue.style.animation = 'none';
  setTimeout(() => {
    mascotDialogue.style.animation = 'dialoguePulse 2s infinite';
  }, 10);
}

// Start countdown updates for all anime
function startCountdownUpdates() {
  // Update countdowns every minute
  setInterval(() => {
    document.querySelectorAll('.anime-card').forEach(card => {
      const countdownDays = card.querySelector('.countdown-days');
      const ringProgress = card.querySelector('.ring-progress');
      
      if (countdownDays && ringProgress) {
        let days = parseInt(countdownDays.textContent);
        
        // Simulate countdown progression
        if (days > 0) {
          // Random chance to decrement (simulating time passing)
          if (Math.random() < 0.01) {
            days = Math.max(0, days - 1);
            countdownDays.textContent = days;
            
            const percentage = (days / 7) * 100;
            ringProgress.setAttribute('stroke-dasharray', `${percentage}, 100`);
          }
        } else {
          // Reset to 7 when countdown reaches 0 (new episode)
          days = 7;
          countdownDays.textContent = days;
          ringProgress.setAttribute('stroke-dasharray', '100, 100');
          
          // Update episode count
          const episodeText = card.querySelector('.episode-info');
          if (episodeText) {
            const match = episodeText.textContent.match(/Ep\. (\d+)\/(\d+)/);
            if (match) {
              const current = parseInt(match[1]);
              const total = parseInt(match[2]);
              if (current < total) {
                episodeText.innerHTML = `<i class="fas fa-play-circle"></i> Ep. ${current + 1}/${total}`;
                
                // Update anime data
                const animeId = parseInt(card.dataset.id);
                const anime = animeData.find(a => a.id === animeId);
                if (anime) {
                  anime.episodes.current = Math.min(anime.episodes.current + 1, anime.episodes.total);
                  anime.countdownDays = 7;
                  
                  // Auto-increment progress if watching
                  if (anime.watchStatus === 'watching' && anime.progress < anime.episodes.current) {
                    anime.progress = anime.episodes.current;
                    
                    // Update progress bar
                    const progressFill = card.querySelector('.progress-fill');
                    const progressText = card.querySelector('.progress-text');
                    const progressPercentage = (anime.progress / anime.episodes.total) * 100;
                    progressFill.style.width = `${progressPercentage}%`;
                    progressText.textContent = `${anime.progress}/${anime.episodes.total} episodes`;
                    
                    updateStatistics();
                  }
                }
              }
            }
          }
        }
      }
    });
  }, 60000); // Update every minute
}

// Setup mascot interactions
function setupMascotInteractions() {
  mascot.addEventListener('click', function() {
    // Animate mascot
    this.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
      this.style.transform = '';
    }, 300);
    
    // Random dialogue
    const contexts = Object.keys(mascotDialogues);
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    updateMascotDialogue(randomContext);
  });
  
  // Random dialogue changes periodically
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance every 30 seconds
      updateMascotDialogue('default');
    }
  }, 30000);
}

// Setup all event listeners
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderAnimeCards();
    });
  });
  
  // Sort select
  sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    renderAnimeCards();
  });
  
  // View toggles
  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      viewToggles.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentView = this.dataset.view;
      
      // Update grid layout
      if (currentView === 'list') {
        animeGrid.style.gridTemplateColumns = '1fr';
        animeGrid.classList.add('list-view');
      } else {
        animeGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        animeGrid.classList.remove('list-view');
      }
    });
  });
  
  // Random pick button
  randomPickBtn.addEventListener('click', function() {
    const cards = document.querySelectorAll('.anime-card:not(.hidden)');
    if (cards.length === 0) return;
    
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    
    // Highlight the random card
    cards.forEach(card => card.classList.remove('random-pick'));
    randomCard.classList.add('random-pick');
    
    // Scroll to the card
    randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Update mascot dialogue
    updateMascotDialogue('random');
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      randomCard.classList.remove('random-pick');
    }, 3000);
  });
  
  // Add CSS for random pick highlight
  const style = document.createElement('style');
  style.textContent = `
    .anime-card.random-pick {
      animation: randomPickGlow 1s ease-in-out infinite alternate;
      border-color: var(--accent) !important;
      z-index: 10;
    }
    
    @keyframes randomPickGlow {
      0% { box-shadow: 0 0 20px rgba(255, 204, 0, 0.5); }
      100% { box-shadow: 0 0 40px var(--accent); }
    }
    
    .list-view .anime-card {
      display: flex;
      height: 200px;
    }
    
    .list-view .card-poster {
      width: 150px;
      height: 100%;
      flex-shrink: 0;
    }
    
    .list-view .card-content {
      flex-grow: 1;
    }
  `;
  document.head.appendChild(style);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Space to random pick
  if (e.code === 'Space' && !e.target.matches('input, textarea, select')) {
    e.preventDefault();
    randomPickBtn.click();
  }
  
  // Escape to clear filter
  if (e.code === 'Escape' && currentFilter !== 'all') {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    currentFilter = 'all';
    renderAnimeCards();
  }
  
  // Number keys to filter by genre
  if (e.code >= 'Digit1' && e.code <= 'Digit6') {
    const index = parseInt(e.code.replace('Digit', '')) - 1;
    const filterBtns = Array.from(filterButtons);
    if (filterBtns[index]) {
      filterBtns[index].click();
    }
  }
});

// Add service worker-like offline capability notification
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('AnimeFlow: Service Worker would be registered here for offline functionality.');
  });
}

// Export functions for debugging (optional)
window.AnimeFlow = {
  getAnimeData: () => animeData,
  updateStatistics,
  renderAnimeCards,
  updateMascotDialogue
};