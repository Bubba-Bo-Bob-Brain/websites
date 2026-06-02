const SakuraSpark = {
  init() {
    this.cacheElements();
    this.createSakuraPetals();
    this.createSparkles();
    this.bindSeasonTabs();
    this.bindGenreFilters();
    this.bindStatusFilters();
    this.bindSortSelect();
    this.bindWatchStatusButtons();
    this.detectCountdownUrgency();
    this.addPosterShine();
    this.updateStats();
    this.updateChibiMood();
    this.startCountdownTicker();
  },

  cacheElements() {
    this.sakuraCanvas = document.getElementById('sakuraCanvas');
    this.sparkleLayer = document.getElementById('sparkleLayer');
    this.seasonTabs = document.getElementById('seasonTabs');
    this.genreFilters = document.getElementById('genreFilters');
    this.statusFilters = document.getElementById('statusFilters');
    this.sortSelect = document.getElementById('sortSelect');
    this.animeGrid = document.getElementById('animeGrid');
    this.toastContainer = document.getElementById('toastContainer');
    this.chibiMascot = document.getElementById('chibiMascot');
    this.chibiBubble = document.getElementById('chibiBubble');
    this.bubbleText = document.getElementById('bubbleText');
    this.chibiBody = document.getElementById('chibiBody');
    this.chibiMouth = document.getElementById('chibiMouth');
    this.chibiEyeL = document.getElementById('chibiEyeL');
    this.chibiEyeR = document.getElementById('chibiEyeR');
    this.statWatching = document.getElementById('statWatching');
    this.statCompleted = document.getElementById('statCompleted');
    this.statPlanned = document.getElementById('statPlanned');
    this.statDropped = document.getElementById('statDropped');
    this.statTotal = document.getElementById('statTotal');
    this.allCards = Array.from(document.querySelectorAll('.anime-card'));
    this.currentGenreFilter = 'all';
    this.currentStatusFilter = 'all';
    this.currentSort = 'popularity';
  },

  createSakuraPetals() {
    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';
      const size = 8 + Math.random() * 12;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (8 + Math.random() * 12) + 's';
      petal.style.animationDelay = (Math.random() * 15) + 's';
      const hueShift = Math.random() * 30 - 15;
      petal.style.filter = `hue-rotate(${hueShift}deg)`;
      this.sakuraCanvas.appendChild(petal);
    }
  },

  createSparkles() {
    const sparkleCount = 20;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const size = 2 + Math.random() * 4;
      sparkle.style.width = size + 'px';
      sparkle.style.height = size + 'px';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDuration = (2 + Math.random() * 4) + 's';
      sparkle.style.animationDelay = (Math.random() * 5) + 's';
      this.sparkleLayer.appendChild(sparkle);
    }
  },

  bindSeasonTabs() {
    const tabs = this.seasonTabs.querySelectorAll('.season-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.showToast(`Switched to ${tab.textContent} season`, 'watching');
      });
    });
  },

  bindGenreFilters() {
    const chips = this.genreFilters.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentGenreFilter = chip.dataset.genre;
        this.applyFilters();
      });
    });
  },

  bindStatusFilters() {
    const chips = this.statusFilters.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentStatusFilter = chip.dataset.status;
        this.applyFilters();
      });
    });
  },

  bindSortSelect() {
    this.sortSelect.addEventListener('change', () => {
      this.currentSort = this.sortSelect.value;
      this.applyFilters();
    });
  },

  applyFilters() {
    let visibleCards = this.allCards.slice();

    if (this.currentGenreFilter !== 'all') {
      visibleCards = visibleCards.filter(card => {
        const genres = card.dataset.genres.split(',');
        return genres.includes(this.currentGenreFilter);
      });
    }

    if (this.currentStatusFilter !== 'all') {
      visibleCards = visibleCards.filter(card => {
        return card.dataset.status === this.currentStatusFilter;
      });
    }

    visibleCards = this.sortCards(visibleCards, this.currentSort);

    this.allCards.forEach(card => {
      card.classList.add('hidden');
    });

    const grid = this.animeGrid;
    visibleCards.forEach(card => {
      card.classList.remove('hidden');
      grid.appendChild(card);
    });
  },

  sortCards(cards, sortBy) {
    const sorted = cards.slice();
    switch (sortBy) {
      case 'popularity':
        sorted.sort((a, b) => parseInt(a.dataset.popularity) - parseInt(b.dataset.popularity));
        break;
      case 'rating':
        sorted.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
        break;
      case 'countdown':
        sorted.sort((a, b) => {
          const aDays = parseInt(a.querySelector('.countdown-ring').dataset.daysLeft) + parseInt(a.querySelector('.countdown-ring').dataset.hoursLeft) / 24;
          const bDays = parseInt(b.querySelector('.countdown-ring').dataset.daysLeft) + parseInt(b.querySelector('.countdown-ring').dataset.hoursLeft) / 24;
          return aDays - bDays;
        });
        break;
      case 'title':
        sorted.sort((a, b) => {
          const aTitle = a.querySelector('.card-title').textContent;
          const bTitle = b.querySelector('.card-title').textContent;
          return aTitle.localeCompare(bTitle);
        });
        break;
      case 'studio':
        sorted.sort((a, b) => {
          const aStudio = a.querySelector('.studio-tag').textContent;
          const bStudio = b.querySelector('.studio-tag').textContent;
          return aStudio.localeCompare(bStudio);
        });
        break;
    }
    return sorted;
  },

  bindWatchStatusButtons() {
    this.allCards.forEach(card => {
      const statusContainer = card.querySelector('.watch-status');
      const buttons = statusContainer.querySelectorAll('.status-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const newStatus = btn.dataset.status;
          const currentStatus = card.dataset.status;

          if (newStatus === currentStatus) {
            card.dataset.status = 'none';
            statusContainer.dataset.status = 'none';
            buttons.forEach(b => b.classList.remove('active'));
            this.showToast('Removed from list', 'dropped');
          } else {
            card.dataset.status = newStatus;
            statusContainer.dataset.status = newStatus;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const title = card.querySelector('.card-title').textContent;
            const statusLabels = {
              watching: 'Now watching',
              planned: 'Added to plan',
              completed: 'Marked complete',
              dropped: 'Dropped'
            };
            this.showToast(`${statusLabels[newStatus]}: ${title}`, newStatus);
          }

          this.updateStats();
          this.updateChibiMood();
          this.applyFilters();
        });
      });
    });
  },

  updateStats() {
    let watching = 0;
    let completed = 0;
    let planned = 0;
    let dropped = 0;

    this.allCards.forEach(card => {
      const status = card.dataset.status;
      if (status === 'watching') watching++;
      else if (status === 'completed') completed++;
      else if (status === 'planned') planned++;
      else if (status === 'dropped') dropped++;
    });

    this.animateStatNumber(this.statWatching, watching);
    this.animateStatNumber(this.statCompleted, completed);
    this.animateStatNumber(this.statPlanned, planned);
    this.animateStatNumber(this.statDropped, dropped);
    this.animateStatNumber(this.statTotal, watching + completed + planned + dropped);
  },

  animateStatNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    if (current === target) return;

    const duration = 400;
    const startTime = performance.now();

    const step = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(current + (target - current) * eased);
      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  },

  updateChibiMood() {
    let watching = 0;
    let completed = 0;
    let planned = 0;
    let dropped = 0;

    this.allCards.forEach(card => {
      const status = card.dataset.status;
      if (status === 'watching') watching++;
      else if (status === 'completed') completed++;
      else if (status === 'planned') planned++;
      else if (status === 'dropped') dropped++;
    });

    this.chibiMascot.classList.remove('mood-excited', 'mood-happy', 'mood-sleepy', 'mood-sad');

    const messages = {
      excited: [
        'You\'re on fire! Keep watching!',
        'So many shows, so little time!',
        'Anime marathon mode! ✦'
      ],
      happy: [
        'Great taste in anime!',
        'You\'re doing great!',
        'Enjoying the season? ✦'
      ],
      sleepy: [
        'Add some shows to watch~',
        'Waiting for you to start~',
        'Anything catch your eye? ✦'
      ],
      sad: [
        'Don\'t give up on anime!',
        'Maybe try something new?',
        'There\'s always next season... ✦'
      ]
    };

    let mood;
    if (dropped > watching + completed) {
      mood = 'sad';
    } else if (completed >= 2 && watching >= 3) {
      mood = 'excited';
    } else if (watching >= 2 || completed >= 1) {
      mood = 'happy';
    } else {
      mood = 'sleepy';
    }

    this.chibiMascot.classList.add(`mood-${mood}`);
    const moodMessages = messages[mood];
    this.bubbleText.textContent = moodMessages[Math.floor(Math.random() * moodMessages.length)];
  },

  detectCountdownUrgency() {
    const rings = document.querySelectorAll('.countdown-ring');
    rings.forEach(ring => {
      const days = parseInt(ring.dataset.daysLeft);
      const hours = parseInt(ring.dataset.hoursLeft);
      const totalHours = days * 24 + hours;

      if (ring.classList.contains('countdown-done')) return;

      if (totalHours <= 24) {
        ring.classList.add('imminent');
      } else if (totalHours <= 72) {
        ring.classList.add('urgent');
      }
    });
  },

  addPosterShine() {
    this.allCards.forEach((card, index) => {
      const poster = card.querySelector('.card-poster');
      const shine = document.createElement('div');
      shine.className = 'poster-shine';
      shine.style.animationDelay = (index * 0.3) + 's';
      poster.appendChild(shine);
    });
  },

  showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 2600);
  },

  startCountdownTicker() {
    setInterval(() => {
      const rings = document.querySelectorAll('.countdown-ring:not(.countdown-done)');
      rings.forEach(ring => {
        let hours = parseInt(ring.dataset.hoursLeft);
        let days = parseInt(ring.dataset.daysLeft);
        let totalHours = days * 24 + hours;

        if (totalHours > 0) {
          totalHours -= 1;
          days = Math.floor(totalHours / 24);
          hours = totalHours % 24;
          ring.dataset.daysLeft = days;
          ring.dataset.hoursLeft = hours;

          const ringText = ring.querySelector('.ring-text');
          if (days > 0) {
            ringText.textContent = days + 'd';
          } else if (hours > 0) {
            ringText.textContent = hours + 'h';
          } else {
            ringText.textContent = 'NOW';
            ring.classList.add('imminent');
          }

          const totalEpisodes = parseInt(ring.dataset.totalEpisodes);
          const nextEpisode = parseInt(ring.dataset.nextEpisode);
          const circumference = 125.66;
          const progress = nextEpisode / totalEpisodes;
          const offset = circumference * (1 - progress);
          const progressCircle = ring.querySelector('.ring-progress');
          progressCircle.setAttribute('stroke-dashoffset', offset);

          ring.classList.remove('urgent', 'imminent');
          if (totalHours <= 24 && totalHours > 0) {
            ring.classList.add('imminent');
          } else if (totalHours <= 72 && totalHours > 24) {
            ring.classList.add('urgent');
          }
        }
      });
    }, 60000);

    this.runImmediateCountdownTick();
  },

  runImmediateCountdownTick() {
    const rings = document.querySelectorAll('.countdown-ring:not(.countdown-done)');
    rings.forEach(ring => {
      const days = parseInt(ring.dataset.daysLeft);
      const hours = parseInt(ring.dataset.hoursLeft);
      const totalEpisodes = parseInt(ring.dataset.totalEpisodes);
      const nextEpisode = parseInt(ring.dataset.nextEpisode);
      const circumference = 125.66;
      const progress = nextEpisode / totalEpisodes;
      const offset = circumference * (1 - progress);
      const progressCircle = ring.querySelector('.ring-progress');
      progressCircle.setAttribute('stroke-dashoffset', offset);

      const ringText = ring.querySelector('.ring-text');
      if (days > 0) {
        ringText.textContent = days + 'd';
      } else if (hours > 0) {
        ringText.textContent = hours + 'h';
      } else {
        ringText.textContent = 'NOW';
        ring.classList.add('imminent');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SakuraSpark.init();
});