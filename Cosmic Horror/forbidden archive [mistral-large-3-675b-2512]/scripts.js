// ===== ELDER GLOBALS =====
const sanity = {
  current: 100,
  update(value) {
    this.current = Math.max(0, Math.min(100, value));
    document.documentElement.setAttribute('data-sanity', this.current);
    document.getElementById('sanity-value').textContent = `${this.current}%`;
    if (this.current <= 10) this.criticalState();
  },
  criticalState() {
    document.body.style.animation = 'sanityCritical 0.5s infinite';
    setTimeout(() => document.body.style.animation = '', 1000);
  }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initSanitySystem();
  initTextCorruption();
  initTentacleBorders();
  initSearchSystem();
  initWitnessTestimony();
  initAmbientEffects();
  initAudio();
});

// ===== SANITY SYSTEM =====
function initSanitySystem() {
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const sanityLoss = scrollPercent * 0.5; // Lose 0.5% sanity per scroll %
    sanity.update(100 - sanityLoss);
  });
}

// ===== TEXT CORRUPTION =====
function initTextCorruption() {
  const glitchTargets = document.querySelectorAll('.glitch-text, .nav-link, .item-title');
  glitchTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      const originalText = target.textContent;
      target.setAttribute('data-text', originalText);
      if (!target.classList.contains('nav-link')) {
        target.style.animation = 'glitch 0.3s infinite';
      }
    });

    target.addEventListener('mouseleave', () => {
      if (!target.classList.contains('nav-link')) {
        target.style.animation = '';
        target.textContent = target.getAttribute('data-text');
      }
    });
  });
}

// ===== TENTACLE BORDERS =====
function initTentacleBorders() {
  const borders = document.querySelectorAll('.tentacle-border');
  borders.forEach(border => {
    // Randomize initial animation delay
    const delay = Math.random() * 10;
    border.style.animationDelay = `${delay}s`;
  });
}

// ===== SEARCH SYSTEM =====
function initSearchSystem() {
  const searchInput = document.querySelector('.eldritch-search');
  const searchButton = document.querySelector('.search-button');
  const searchResults = document.querySelector('.search-results');

  const disturbingResults = [
    "The walls breathe here. You shouldn't have searched for that.",
    "████████████████████████████████████████",
    "They are watching. They are always watching.",
    "ERROR: MEMORY CORRUPTION. QUERY DENIED.",
    "The stars here are wrong. The stars here are dead.",
    "WARNING: SANITY THRESHOLD EXCEEDED. LOGGING OUT... ██████████",
    "You hear whispers in the static. They know your name.",
    "The last researcher who searched for this vanished. Coincidence?",
    "The text rearranges itself when you look away. Don't blink.",
    "REDACTED. REDACTED. REDACTED."
  ];

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      searchResults.style.display = 'block';
      const corruptionLevel = 100 - sanity.current;
      const resultIndex = Math.min(
        Math.floor(corruptionLevel / 10),
        disturbingResults.length - 1
      );
      searchResults.innerHTML = `<p class="eldritch-text">${disturbingResults[resultIndex]}</p>`;
      sanity.update(sanity.current - 5); // Lose 5% sanity per search
    }
  });

  // Enter key support
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchButton.click();
  });
}

// ===== WITNESS TESTIMONY =====
function initWitnessTestimony() {
  const testimony = document.querySelector('.witness-testimony');
  const toggle = document.querySelector('.testimony-toggle');
  const content = document.querySelector('.testimony-content');

  const testimonies = [
    "I saw something in the woods. It wasn't human. It wasn't <span class='text-corrupt'>█████</span>.",
    "The last transmission from X-29 was just static... and then <span class='text-corrupt'>█████</span> started speaking.",
    "Don't trust the mirrors. They show things that aren't there. Things that <span class='text-corrupt'>█████</span>.",
    "The archive is alive. It watches. It <span class='text-corrupt'>█████</span> when you sleep.",
    "The stars are moving. The stars are <span class='text-corrupt'>█████</span>.",
    "It whispers your name when you're alone. It knows your <span class='text-corrupt'>█████</span>."
  ];

  let isVisible = true;
  toggle.addEventListener('click', () => {
    isVisible = !isVisible;
    testimony.style.display = isVisible ? 'block' : 'none';
    toggle.innerHTML = isVisible ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
  });

  // Cycle testimonies
  setInterval(() => {
    if (isVisible) {
      const randomIndex = Math.floor(Math.random() * testimonies.length);
      content.innerHTML = testimonies[randomIndex];
    }
  }, 15000);
}

// ===== AMBIENT EFFECTS =====
function initAmbientEffects() {
  // Random glitch flickers
  setInterval(() => {
    const glitchOverlay = document.querySelector('.glitch-overlay');
    const glitchDuration = Math.random() * 200 + 50;
    glitchOverlay.style.opacity = '0.5';
    setTimeout(() => glitchOverlay.style.opacity = '0.1', glitchDuration);
  }, 3000);

  // Warp effect on archive items
  const archiveItems = document.querySelectorAll('.archive-item');
  archiveItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'rotateX(5deg) rotateY(-5deg) scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}

// ===== AUDIO SYSTEM =====
function initAudio() {
  const audio = document.getElementById('ambient-audio');
  audio.volume = 0.3;
  audio.play().catch(e => console.log("Audio play failed:", e));

  // Dynamic volume based on sanity
  setInterval(() => {
    const sanityPercent = sanity.current / 100;
    audio.volume = 0.1 + (0.5 * (1 - sanityPercent));
    if (sanity.current <= 10) {
      audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-ominous-drones-229.mp3";
    } else if (sanity.current <= 30) {
      audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-eerie-ambience-228.mp3";
    }
  }, 1000);

  // Add whispers on hover
  const interactiveElements = document.querySelectorAll('.nav-link, .archive-item, .search-button');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const whisper = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-female-whisper-325.mp3');
      whisper.volume = 0.5;
      whisper.play();
    });
  });
}