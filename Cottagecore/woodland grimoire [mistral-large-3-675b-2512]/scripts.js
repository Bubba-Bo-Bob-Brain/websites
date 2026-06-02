// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2000); // Simulate brewing time
});

// ===== SEASONAL WHEEL =====
const wheel = document.querySelector('.seasonal-wheel');
const seasonDisplay = document.getElementById('season-display');
let isDragging = false;
let startAngle = 0;
let currentAngle = 0;

// Season data
const seasons = [
  { name: 'Spring', description: 'The earth awakens! Violets carpet the meadows, nettles strengthen the blood, and dandelions whisper secrets to the bees. Brew tonics for renewal and growth.' },
  { name: 'Summer', description: 'The sun reigns supreme. Roses blush in the gardens, chamomile dries in golden bunches, and lavender hums with the bees. Preserve the light for darker days.' },
  { name: 'Autumn', description: 'The veil thins. Mugwort dreams of the moon, elderberries cluster like rubies, and hawthorn guards the hedgerows. Prepare for slumber and spirit walks.' },
  { name: 'Winter', description: 'The world sleeps beneath frost. Pine needles perfume the air, mistletoe hangs heavy with promises, and yarrow waits beneath the snow. Warm the bones and kindle the hearth.' }
];

// Initialize wheel
function initWheel() {
  const slices = document.querySelectorAll('.wheel-slice');
  slices.forEach((slice, index) => {
    slice.addEventListener('click', () => {
      if (!isDragging) {
        currentAngle = index * 90;
        wheel.style.transform = `rotate(${currentAngle}deg)`;
        updateSeasonDisplay(index);
      }
    });
  });
}

// Drag-to-rotate functionality
wheel.addEventListener('mousedown', (e) => {
  isDragging = true;
  startAngle = e.clientX;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = e.clientX - startAngle;
  currentAngle += delta;
  wheel.style.transform = `rotate(${currentAngle}deg)`;
  startAngle = e.clientX;
});

window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  // Snap to nearest 90° (season)
  const snappedAngle = Math.round(currentAngle / 90) * 90;
  wheel.style.transform = `rotate(${snappedAngle}deg)`;
  currentAngle = snappedAngle;
  updateSeasonDisplay(Math.abs(snappedAngle / 90) % 4);
});

// Update seasonal description
function updateSeasonDisplay(seasonIndex) {
  const season = seasons[seasonIndex];
  seasonDisplay.innerHTML = `
    <h3>${season.name}</h3>
    <p>${season.description}</p>
    <small>Click a recipe below to explore ${season.name.toLowerCase()} potions.</small>
  `;
  // Highlight recipes from the selected season
  const recipeCards = document.querySelectorAll('.recipe-card');
  recipeCards.forEach(card => {
    card.style.opacity = card.dataset.season === season.name.toLowerCase() ? '1' : '0.6';
  });
}

// ===== NIGHT MODE TOGGLE =====
const candle = document.querySelector('.candle-toggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'day';
html.setAttribute('data-theme', savedTheme);

// Toggle theme
candle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'day' ? 'night' : 'day';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  // Animate flame
  const flame = document.querySelector('.flame');
  flame.style.animation = 'none';
  setTimeout(() => {
    flame.style.animation = 'flame-flicker 2s infinite ease-in-out';
  }, 10);
});

// Flickering flame effect
function flickerFlame() {
  const flame = document.querySelector('.flame');
  if (flame) {
    const randomScale = 0.9 + Math.random() * 0.2;
    flame.style.transform = `scale(${randomScale})`;
  }
}
setInterval(flickerFlame, 200);

// ===== PRESSED FLOWERS =====
const flowers = document.querySelectorAll('.pressed-flower');
flowers.forEach(flower => {
  flower.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = flower.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create a scattering flower
    const scatterFlower = flower.cloneNode(true);
    scatterFlower.style.position = 'fixed';
    scatterFlower.style.left = `${x}px`;
    scatterFlower.style.top = `${y}px`;
    scatterFlower.style.transform = 'scale(0.8)';
    scatterFlower.style.transition = 'all 1s ease-out';
    document.body.appendChild(scatterFlower);

    // Animate scattering
    setTimeout(() => {
      const angle = Math.random() * 360;
      const distance = 50 + Math.random() * 100;
      scatterFlower.style.transform = `translate(${distance}px, ${distance}px) rotate(${angle}deg) scale(0.5)`;
      scatterFlower.style.opacity = '0';
    }, 10);

    // Remove after animation
    setTimeout(() => {
      scatterFlower.remove();
    }, 1000);

    // Restore the flower after 2 seconds
    setTimeout(() => {
      flower.style.opacity = '0';
      setTimeout(() => {
        flower.style.opacity = '1';
      }, 1000);
    }, 2000);
  });
});

// ===== RECIPE CARD HOVER EFFECTS =====
const recipeCards = document.querySelectorAll('.recipe-card');
recipeCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'rotate(0deg) scale(1.02)';
    // Add shimmer
    const shimmer = document.createElement('div');
    shimmer.classList.add('shimmer');
    shimmer.style.position = 'absolute';
    shimmer.style.top = '0';
    shimmer.style.left = '0';
    shimmer.style.width = '100%';
    shimmer.style.height = '100%';
    shimmer.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)';
    shimmer.style.animation = 'shimmer 1.5s infinite';
    card.appendChild(shimmer);
    setTimeout(() => {
      shimmer.remove();
    }, 1500);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotate(-1deg) scale(1)';
  });
});

// ===== INGREDIENT TOOLTIPS =====
const ingredients = document.querySelectorAll('.ingredient');
ingredients.forEach(ingredient => {
  ingredient.addEventListener('mouseenter', () => {
    const tooltip = ingredient.querySelector('::after');
    // Add a tiny scroll animation
    const scroll = document.createElement('div');
    scroll.classList.add('tooltip-scroll');
    scroll.style.position = 'absolute';
    scroll.style.bottom = '100%';
    scroll.style.left = '50%';
    scroll.style.transform = 'translateX(-50%)';
    scroll.style.width = '20px';
    scroll.style.height = '20px';
    scroll.style.backgroundColor = 'var(--bg-parchment)';
    scroll.style.border = '1px solid var(--border-dark)';
    scroll.style.borderRadius = '50%';
    scroll.style.fontSize = '0.7rem';
    scroll.style.display = 'flex';
    scroll.style.alignItems = 'center';
    scroll.style.justifyContent = 'center';
    scroll.textContent = '✨';
    document.body.appendChild(scroll);
    setTimeout(() => {
      scroll.remove();
    }, 1000);
  });
});

// ===== BUBBLES ANIMATION =====
function animateBubbles() {
  const bubbles = document.querySelectorAll('.bubble');
  bubbles.forEach(bubble => {
    const delay = Math.random() * 2;
    bubble.style.animationDelay = `${delay}s`;
  });
}
animateBubbles();

// ===== INITIALIZE =====
initWheel();
updateSeasonDisplay(0); // Default to Spring