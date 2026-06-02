// ===== LANTERN GLOW EFFECT =====
const lanternGlow = document.querySelector('.lantern-glow');

document.addEventListener('mousemove', (e) => {
  // Position the lantern glow near the cursor
  lanternGlow.style.left = `${e.clientX - 50}px`;
  lanternGlow.style.top = `${e.clientY - 50}px`;

  // Add a subtle trail effect
  lanternGlow.style.transform = 'scale(1)';
  clearTimeout(lanternGlow.timeout);
  lanternGlow.timeout = setTimeout(() => {
    lanternGlow.style.transform = 'scale(0.8)';
  }, 100);
});

// ===== INCENSE SMOKE PARTICLES =====
const incenseSmoke = document.getElementById('incense-smoke');

// Create smoke particles
function createSmokeParticle() {
  const particle = document.createElement('div');
  particle.classList.add('smoke-particle');

  // Random starting position
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.top = `${Math.random() * 100 + 50}vh`;
  particle.style.width = `${Math.random() * 10 + 5}px`;
  particle.style.height = particle.style.width;
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  particle.style.animationDuration = `${Math.random() * 10 + 5}s`;

  incenseSmoke.appendChild(particle);

  // Remove particle after animation
  setTimeout(() => {
    particle.remove();
  }, 15000);
}

// Generate particles periodically
setInterval(createSmokeParticle, 300);

// ===== "RUB TO REVEAL" INTERACTION =====
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
  const overlay = card.querySelector('.product-overlay');
  const revealProgress = card.querySelector('.reveal-progress');
  const rubInstruction = card.querySelector('.rub-instruction');
  let isDragging = false;
  let progress = 0;

  // Mouse down: start dragging
  card.addEventListener('mousedown', () => {
    isDragging = true;
    card.style.cursor = 'grabbing';
  });

  // Mouse move: update progress
  card.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calculate progress based on drag distance
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    progress = percentage;
    revealProgress.style.width = `${progress}%`;

    // Fully revealed: trigger effect
    if (progress >= 100) {
      overlay.style.opacity = '0';
      rubInstruction.textContent = 'ﺕﻣﻼﺳ ﻞﺒﻗ ﻰﻠﻋ';
      card.style.boxShadow = '0 0 20px var(--gold-primary)';
      card.style.transform = 'translateY(-10px) scale(1.02)';
    }
  });

  // Mouse up: stop dragging
  document.addEventListener('mouseup', () => {
    isDragging = false;
    card.style.cursor = 'grab';
  });

  // Reset on mouse leave
  card.addEventListener('mouseleave', () => {
    isDragging = false;
    card.style.cursor = 'grab';
  });
});

// ===== SCROLL ANIMATIONS =====
// Fade in product cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe product cards
productCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// ===== RETURN TO TOP LANTERN =====
const returnToTop = document.querySelector('.return-to-top');

returnToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Add a subtle glow to the lantern on hover
returnToTop.addEventListener('mouseenter', () => {
  returnToTop.style.textShadow = '0 0 10px var(--gold-primary)';
});

returnToTop.addEventListener('mouseleave', () => {
  returnToTop.style.textShadow = 'none';
});

// ===== PARALLAX EFFECT FOR MERCHANT SPOTLIGHT =====
const spotlightImage = document.querySelector('.spotlight-image img');

window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  spotlightImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
});