// ============================================
// THE HERBALIST'S GRIMOIRE - SCRIPTS
// Whimsical interactions and immersive animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initNavigation();
  initNightMode();
  initSeasonalWheel();
  initParticles();
  initScrollReveal();
  initMothInteractions();
});

function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  
  // Prevent scrolling during load animation
  document.body.style.overflow = 'hidden';
  
  // Hide loading screen after animation completes
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    document.body.style.overflow = 'auto';
  }, 2500);
}

function initNavigation() {
  const tabs = document.querySelectorAll('.chapter-tab');
  const sections = document.querySelectorAll('.book-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-section');
      
      // Update active section
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
          section.classList.add('active');
          // Smooth scroll to selected section
          window.scrollTo({
            top: section.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });

      // Update active tab state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function initNightMode() {
  const toggle = document.getElementById('night-toggle');
  const overlay = document.getElementById('night-overlay');
  const body = document.body;

  // Check for saved user preference
  const savedMode = localStorage.getItem('grimoire-night-mode');
  if (savedMode === 'true') {
    body.classList.add('night-mode');
    overlay.classList.add('active');
  }

  // Toggle night mode on button click
  toggle.addEventListener('click', () => {
    body.classList.toggle('night-mode');
    overlay.classList.toggle('active');
    const isNight = body.classList.contains('night-mode');
    localStorage.setItem('grimoire-night-mode', isNight);
  });
}

function initSeasonalWheel() {
  const seasons = document.querySelectorAll('.season');
  const wheel = document.querySelector('.seasonal-wheel');

  seasons.forEach(season => {
    // Rotate wheel to highlight hovered season
    season.addEventListener('mouseenter', () => {
      const rotation = getSeasonRotation(season.dataset.season);
      wheel.style.transform = `rotate(${rotation}deg)`;
    });

    // Reset wheel rotation when mouse leaves
    season.addEventListener('mouseleave', () => {
      wheel.style.transform = 'rotate(0deg)';
    });

    // Mark season as selected on click
    season.addEventListener('click', () => {
      seasons.forEach(s => s.classList.remove('selected'));
      season.classList.add('selected');
    });
  });

  // Helper to calculate rotation angle for each season
  function getSeasonRotation(season) {
    switch(season) {
      case 'spring': return 0;
      case 'summer': return 90;
      case 'autumn': return 180;
      case 'winter': return 270;
      default: return 0;
    }
  }
}

function initParticles() {
  const container = document.getElementById('particles-container');
  const particleCount = 30;
  const colors = ['#f4e8d0', '#e8d5b0', '#c17f6b', '#9b8bb5', '#7a9e7e'];

  for (let i = 0; i < particleCount; i++) {
    createParticle(container, colors);
  }
}

function createParticle(container, colors) {
  const particle = document.createElement('div');
  const size = Math.random() * 6 + 2;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const duration = Math.random() * 20 + 15;
  const delay = Math.random() * 10;
  // Unique end position for each particle's float path
  const endX = Math.random() * 200 - 100;
  const endY = Math.random() * 200 - 100;

  particle.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    left: ${startX}px;
    top: ${startY}px;
    --end-x: ${endX}px;
    --end-y: ${endY}px;
    animation: float-particle ${duration}s ${delay}s infinite ease-in-out;
    filter: blur(1px);
  `;

  container.appendChild(particle);
}

function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  // Observe all scrollable content elements
  document.querySelectorAll('.recipe-card, .flower-specimen, .remedy-note, .tip').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Reveal elements already in view on page load
  setTimeout(() => {
    document.querySelectorAll('.recipe-card, .flower-specimen, .remedy-note, .tip').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }, 100);
}

function initMothInteractions() {
  const moths = document.querySelectorAll('.moth');
  const fireflies = document.querySelectorAll('.firefly');

  // Moths and fireflies react to mouse movement
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Moths move away from cursor
    moths.forEach(moth => {
      const rect = moth.getBoundingClientRect();
      const mothX = rect.left + rect.width / 2;
      const mothY = rect.top + rect.height / 2;
      const distance = Math.sqrt((mouseX - mothX) ** 2 + (mouseY - mothY) ** 2);

      if (distance < 150) {
        const angle = Math.atan2(mouseY - mothY, mouseX - mothX);
        const moveX = Math.cos(angle) * 30;
        const moveY = Math.sin(angle) * 30;
        moth.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    // Fireflies glow brighter near cursor
    fireflies.forEach(firefly => {
      const rect = firefly.getBoundingClientRect();
      const fireflyX = rect.left + rect.width / 2;
      const fireflyY = rect.top + rect.height / 2;
      const distance = Math.sqrt((mouseX - fireflyX) ** 2 + (mouseY - fireflyY) ** 2);

      if (distance < 200) {
        const intensity = 1 - (distance / 200);
        firefly.style.boxShadow = `0 0 ${10 + intensity * 20}px #ffeb3b, 0 0 ${20 + intensity * 30}px #ffeb3b`;
        firefly.style.transform = `scale(${1 + intensity * 0.5})`;
      } else {
        firefly.style.boxShadow = '0 0 10px #ffeb3b, 0 0 20px #ffeb3b';
        firefly.style.transform = 'scale(1)';
      }
    });
  });
}

// Add dynamic styles for animations and interactive states
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  @keyframes float-particle {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translate(var(--end-x), var(--end-y)) rotate(360deg);
      opacity: 0;
    }
  }

  .revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  .season.selected {
    background: rgba(122, 158, 126, 0.2);
    border-color: var(--sage-green);
    transform: scale(1.15);
    z-index: 10;
  }
`;
document.head.appendChild(dynamicStyles);

// Wax seal click interaction
document.querySelectorAll('.recipe-wax-seal').forEach(seal => {
  seal.addEventListener('click', function() {
    this.style.transform = 'rotate(15deg) scale(0.9)';
    setTimeout(() => {
      this.style.transform = 'rotate(15deg) scale(1)';
    }, 200);
  });
  seal.style.cursor = 'pointer';
  seal.style.transition = 'transform 0.2s ease';
});

// Parallax effect for pressed flower watercolor border
const watercolorBlobs = document.querySelectorAll('.watercolor-blob');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  watercolorBlobs.forEach((blob, index) => {
    const speed = (index + 1) * 0.05;
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Keyboard shortcut for night mode (Ctrl + N)
document.addEventListener('keydown', (e) => {
  if (e.key === 'n' && e.ctrlKey) {
    e.preventDefault();
    document.getElementById('night-toggle').click();
  }
});