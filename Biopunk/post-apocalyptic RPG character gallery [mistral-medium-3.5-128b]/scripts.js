// ===== DOM ELEMENTS =====
const filterButtons = document.querySelectorAll('.filter-btn');
const characterCards = document.querySelectorAll('.character-card');
const crtOverlay = document.querySelector('.crt-overlay');
const scanlines = document.querySelector('.scanlines');
const glitchElements = document.querySelectorAll('.glitch');

// ===== SOUND EFFECTS (Placeholder) =====
// In a real implementation, you'd use Audio() with sound files.
// For now, we'll simulate with console logs and visual feedback.
const playSound = (soundType) => {
  console.log(`Playing sound: ${soundType}`);
  // Example: new Audio(`sounds/${soundType}.mp3`).play();
};

// ===== FILTER FUNCTIONALITY =====
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    // Filter cards with animation
    characterCards.forEach(card => {
      const faction = card.dataset.faction;
      const shouldShow = filter === 'all' || faction === filter;

      if (shouldShow) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.display = 'block';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 400);
      }
    });

    playSound('filter');
  });
});

// ===== HOVER EFFECTS =====
characterCards.forEach(card => {
  // Hover sound (simulated)
  card.addEventListener('mouseenter', () => {
    playSound('hover');
    // Add temporary glitch effect to the card
    card.style.transition = 'all 0.1s ease';
    card.style.filter = 'hue-rotate(10deg) brightness(1.1)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.filter = 'none';
    }, 200);
  });

  // DNA strand animation on hover
  const dnaStrand = card.querySelector('.dna-strand');
  if (dnaStrand) {
    card.addEventListener('mouseenter', () => {
      dnaStrand.style.animation = 'none';
      dnaStrand.offsetHeight; // Trigger reflow
      dnaStrand.style.animation = 'dnaFloat 2s infinite linear';
    });
    card.addEventListener('mouseleave', () => {
      dnaStrand.style.animation = 'dnaFloat 5s infinite linear';
    });
  }
});

// ===== RANDOM GLITCH EFFECTS =====
const triggerRandomGlitch = () => {
  glitchElements.forEach(element => {
    if (Math.random() > 0.7) {
      element.style.animation = 'none';
      element.offsetHeight; // Trigger reflow
      element.style.animation = 'glitchSkew 0.3s infinite linear alternate-reverse';
      setTimeout(() => {
        element.style.animation = 'glitchSkew 4s infinite linear alternate-reverse';
      }, 300);
    }
  });

  // Random CRT flicker
  if (Math.random() > 0.8) {
    crtOverlay.style.opacity = '0.8';
    scanlines.style.opacity = '0.2';
    setTimeout(() => {
      crtOverlay.style.opacity = '0.9';
      scanlines.style.opacity = '0.3';
    }, 100);
  }
};

// Trigger glitches periodically
setInterval(triggerRandomGlitch, 3000);

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      // Animate mutation bar
      const mutationLevel = parseInt(card.dataset.mutation);
      const statFill = card.querySelector('.stat-fill');
      if (statFill) {
        statFill.style.width = '0%';
        setTimeout(() => {
          statFill.style.width = `${mutationLevel}%`;
        }, 100);
      }

      // Animate skill bars
      const skillFills = card.querySelectorAll('.skill-fill');
      skillFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 200);
      });

      // Add reveal animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    }
  });
}, observerOptions);

// Observe all character cards
characterCards.forEach(card => {
  observer.observe(card);
});

// ===== DNA STRAND DYNAMIC ANIMATION =====
const dnaStrands = document.querySelectorAll('.dna-strand');
dnaStrands.forEach(strand => {
  // Randomize animation duration and direction
  const duration = 3 + Math.random() * 4;
  const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
  strand.style.animation = `dnaFloat ${duration}s infinite linear ${direction}`;
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Press 'G' to trigger a glitch
  if (e.key.toLowerCase() === 'g') {
    triggerRandomGlitch();
    playSound('glitch');
  }

  // Press '1'-'4' to filter by faction
  const factionKeys = {
    '1': 'scavenger',
    '2': 'corporate',
    '3': 'mutant',
    '4': 'mercenary',
    '0': 'all'
  };

  if (factionKeys[e.key]) {
    const filter = factionKeys[e.key];
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.click();
      }
    });
  }
});

// ===== TOOLTIP FOR CHARACTER NAMES (Optional) =====
characterCards.forEach(card => {
  const nameElement = card.querySelector('.character-name');
  const placeholderImg = card.querySelector('.placeholder-img');
  const characterName = placeholderImg ? placeholderImg.dataset.name : 'Unknown';

  nameElement.title = `Name: ${characterName}\nFaction: ${card.dataset.faction}\nMutation Level: ${card.dataset.mutation}%`;
});

// ===== PARALLAX EFFECT FOR HEADER =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.style.transform = `translateY(${scrollY * 0.3}px)`;
  header.style.opacity = 1 - (scrollY * 0.002);
});

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  playSound('intro');
  // Trigger initial glitch
  setTimeout(triggerRandomGlitch, 1000);
});