// ===== UTILITY FUNCTIONS =====
const formatTimeLeft = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
};

const updateCountdown = (card, airDate) => {
  const now = new Date();
  const timeLeft = airDate - now;

  if (timeLeft <= 0) {
    card.querySelector('.countdown-time').textContent = 'Aired!';
    card.querySelector('.ring-progress').style.strokeDashoffset = '0';
    return;
  }

  const { days, hours } = formatTimeLeft(timeLeft);
  card.querySelector('.countdown-time').textContent = `${days}d ${hours}h`;

  // Update SVG ring progress
  const totalDuration = airDate - new Date(airDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week duration
  const progress = (totalDuration - timeLeft) / totalDuration;
  const circumference = 2 * Math.PI * 20; // 20 = radius
  const offset = circumference - progress * circumference;
  card.querySelector('.ring-progress').style.strokeDashoffset = offset;
};

// ===== COUNTDOWN TIMERS =====
const initializeCountdowns = () => {
  document.querySelectorAll('.anime-card').forEach(card => {
    // Mock air date (replace with real data from API/database)
    const airDate = new Date();
    airDate.setDate(airDate.getDate() + Math.floor(Math.random() * 7)); // Next 0-6 days
    airDate.setHours(airDate.getHours() + Math.floor(Math.random() * 24)); // Random hour

    updateCountdown(card, airDate);

    // Update every minute
    setInterval(() => updateCountdown(card, airDate), 60000);
  });
};

// ===== FILTER SYSTEM =====
const setupFilters = () => {
  const filterToggles = document.querySelectorAll('.filter-toggle');
  const genreFilter = document.getElementById('genre-filter');
  const studioFilter = document.getElementById('studio-filter');
  const cards = document.querySelectorAll('.anime-card');

  const applyFilters = () => {
    const activeStatus = document.querySelector('.filter-toggle.active')?.dataset.filter || 'all';
    const selectedGenre = genreFilter.value;
    const selectedStudio = studioFilter.value;

    cards.forEach(card => {
      const cardStatus = card.dataset.status;
      const cardGenres = card.dataset.genres.split(',');
      const cardStudio = card.dataset.studio;

      const statusMatch = activeStatus === 'all' || cardStatus === activeStatus;
      const genreMatch = selectedGenre === 'all' || cardGenres.includes(selectedGenre);
      const studioMatch = selectedStudio === 'all' || cardStudio === selectedStudio;

      card.style.display = (statusMatch && genreMatch && studioMatch) ? 'block' : 'none';
      card.style.opacity = (statusMatch && genreMatch && studioMatch) ? '1' : '0';
      card.style.transform = (statusMatch && genreMatch && studioMatch) ? 'scale(1)' : 'scale(0.9)';
    });
  };

  // Event listeners
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      filterToggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');
      applyFilters();
    });
  });

  genreFilter.addEventListener('change', applyFilters);
  studioFilter.addEventListener('change', applyFilters);
};

// ===== CHIBI MASCOT REACTIONS =====
const setupMascotReactions = () => {
  const mascot = document.getElementById('chibi-mascot');
  const mascotBubble = document.getElementById('mascot-bubble');
  const statusButtons = document.querySelectorAll('.status-btn');
  const cards = document.querySelectorAll('.anime-card');

  const reactions = {
    watching: { text: 'Keep going!', image: 'https://i.imgur.com/8JqJq4N.png' },
    completed: { text: 'Nice work!', image: 'https://i.imgur.com/5u9gK7D.png' },
    dropped: { text: 'Maybe next time...', image: 'https://i.imgur.com/39hN4lK.png' },
  };

  statusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.anime-card');
      const status = button.dataset.status;

      // Update button states
      card.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update mascot reaction
      const reaction = reactions[status];
      mascotBubble.textContent = reaction.text;
      mascot.querySelector('.chibi-image').src = reaction.image;

      // Add a temporary "pop" animation
      mascot.style.transform = 'scale(1.2)';
      setTimeout(() => mascot.style.transform = 'scale(1)', 300);
    });
  });
};

// ===== SPARKLINE ANIMATIONS =====
const animateSparklines = () => {
  const sparklines = document.querySelectorAll('.sparkline-line');

  const animateLine = (line) => {
    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
    line.getBoundingClientRect(); // Trigger reflow
    line.style.transition = 'stroke-dashoffset 1s ease-in-out';
    line.style.strokeDashoffset = '0';
  };

  // Animate on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateLine(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sparklines.forEach(line => observer.observe(line));
};

// ===== LOCAL STORAGE (Optional) =====
const saveWatchStatus = () => {
  const cards = document.querySelectorAll('.anime-card');
  const data = {};

  cards.forEach(card => {
    const title = card.querySelector('.anime-title').textContent;
    const activeStatus = card.querySelector('.status-btn.active')?.dataset.status;
    data[title] = activeStatus;
  });

  localStorage.setItem('animeWatchStatus', JSON.stringify(data));
};

const loadWatchStatus = () => {
  const savedData = localStorage.getItem('animeWatchStatus');
  if (!savedData) return;

  const cards = document.querySelectorAll('.anime-card');
  const data = JSON.parse(savedData);

  cards.forEach(card => {
    const title = card.querySelector('.anime-title').textContent;
    if (data[title]) {
      const activeButton = card.querySelector(`.status-btn[data-status="${data[title]}"]`);
      if (activeButton) {
        card.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
      }
    }
  });
};

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
  initializeCountdowns();
  setupFilters();
  setupMascotReactions();
  animateSparklines();
  loadWatchStatus();

  // Save watch status on change
  document.querySelectorAll('.status-btn').forEach(button => {
    button.addEventListener('click', saveWatchStatus);
  });
});