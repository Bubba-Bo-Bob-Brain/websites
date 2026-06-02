/* ═══════════════════════════════════════════════════════════
   ANIWAVE — Winter 2025 Seasonal Tracker
   Interactive Script
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initSparkles();
  initScrollReveal();
  initFilters();
  initStatusPills();
  initMascot();
  initParallax();
  initCountdownRings();
  updateStats();
});

/* ─── Sparkle Particle System ─── */
function initSparkles() {
  const field = document.getElementById('sparkleField');
  const colors = ['#FF2D78', '#00D4FF', '#FFE600', '#9B59B6', '#2ECC71', '#FFFFFF'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 3;

    sparkle.style.left = `${x}%`;
    sparkle.style.top = `${y}%`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.background = color;
    sparkle.style.animationDelay = `${delay}s`;
    sparkle.style.animationDuration = `${duration}s`;
    sparkle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    field.appendChild(sparkle);
  }
}

/* ─── Scroll Reveal Animation ─── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.anime-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
}

/* ─── Filter & Sort System ─── */
function initFilters() {
  const chips = document.querySelectorAll('.chip[data-filter]');
  const sortChips = document.querySelectorAll('.chip.sort-chip');
  const grid = document.getElementById('animeGrid');

  let currentFilter = 'all';
  let currentSort = 'airdate';

  // Filter Logic
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      applyFilterAndSort();
    });
  });

  // Sort Logic
  sortChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sortChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentSort = chip.dataset.sort;
      applyFilterAndSort();
    });
  });

  function applyFilterAndSort() {
    const cards = Array.from(document.querySelectorAll('.anime-card'));
    
    // Fade out
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px) scale(0.98)';
    });

    setTimeout(() => {
      // Filter
      const filtered = cards.filter(card => {
        if (currentFilter === 'all') return true;
        return card.dataset.status === currentFilter;
      });

      // Sort
      filtered.sort((a, b) => {
        switch (currentSort) {
          case 'rating':
            return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
          case 'title':
            return a.querySelector('.card-title').textContent.localeCompare(b.querySelector('.card-title').textContent);
          case 'studio':
            return a.querySelector('.studio').textContent.localeCompare(b.querySelector('.studio').textContent);
          case 'airdate':
          default:
            return parseInt(a.dataset.airday) - parseInt(b.dataset.airday);
        }
      });

      // Hide non-matching cards
      cards.forEach(card => card.classList.add('hidden'));
      filtered.forEach(card => card.classList.remove('hidden'));

      // Reorder DOM
      filtered.forEach(card => grid.appendChild(card));

      // Fade in
      filtered.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, i * 50);
      });
    }, 300);
  }
}

/* ─── Status Pill Interaction ─── */
function initStatusPills() {
  const allPills = document.querySelectorAll('.pill');
  
  allPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const card = pill.closest('.anime-card');
      const newStatus = pill.dataset.status;
      const oldStatus = card.dataset.status;

      if (newStatus === oldStatus) return;

      // Update active pill
      card.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Update card data
      card.dataset.status = newStatus;

      // Animate progress bar color based on status
      const progressBar = card.querySelector('.progress-fill');
      const statusColors = {
        watching: 'linear-gradient(90deg, #FF2D78, #00D4FF)',
        plan: 'linear-gradient(90deg, #00D4FF, #2ECC71)',
        completed: 'linear-gradient(90deg, #2ECC71, #FFE600)',
        onhold: 'linear-gradient(90deg, #F39C12, #E74C3C)',
        dropped: 'linear-gradient(90deg, #E74C3C, #636e72)'
      };
      progressBar.style.background = statusColors[newStatus];

      // Trigger mascot reaction
      triggerMascotReaction(newStatus);

      // Burst effect for completed
      if (newStatus === 'completed') {
        createBurstEffect(card);
      }

      // Update global stats
      updateStats();
    });
  });
}

/* ─── Burst Effect ─── */
function createBurstEffect(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#FFE600', '#FF2D78', '#00D4FF', '#2ECC71'];
  
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    const angle = (i / 12) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    
    particle.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 8px;
      height: 8px;
      background: ${colors[i % colors.length]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 0 10px ${colors[i % colors.length]};
    `;
    
    document.body.appendChild(particle);
    
    const animation = particle.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { 
        transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    });
    
    animation.onfinish = () => particle.remove();
  }
}

/* ─── Chibi Mascot System ─── */
function initMascot() {
  const mascot = document.getElementById('chibiMascot');
  const bubble = document.getElementById('mascotBubble');
  const svg = document.getElementById('mascotSvg');
  const mouthPath = svg.querySelector('path[stroke="#D4756B"]');
  const leftEye = svg.querySelectorAll('ellipse[fill="#1A1A2E"]')[0];
  const rightEye = svg.querySelectorAll('ellipse[fill="#1A1A2E"]')[1];

  const phrases = {
    neutral: ["Let's go! 🎌", "Pick something to watch!", "Anime time~ ✨", "Which one next? 🤔"],
    watching: ["Keep it up! 🔥", "Don't miss the next ep!", "So good! 😍", "Binge mode! 📺"],
    plan: ["Good taste! 👌", "Added to the pile 📚", "So many choices!", "Can't wait! 🤩"],
    completed: ["You're amazing! 🎉", "10/10 would recommend!", "Next season! 🌟", "Masterpiece! ✨"],
    onhold: ["Taking a break? ☕", "Come back soon! 🥺", "I'll wait here...", "Paused! ⏸️"],
    dropped: ["Not for you? 😅", "Next! ➡️", "We all drop sometimes", "On to better ones! 🚀"]
  };

  // Hover bubble
  mascot.addEventListener('mouseenter', () => {
    const status = getOverallStatus();
    bubble.textContent = phrases[status][Math.floor(Math.random() * phrases[status].length)];
    bubble.classList.add('visible');
  });

  mascot.addEventListener('mouseleave', () => {
    setTimeout(() => bubble.classList.remove('visible'), 1000);
  });

  // Click interaction
  mascot.addEventListener('click', () => {
    mascot.style.transform = 'scale(0.9) rotate(10deg)';
    setTimeout(() => {
      mascot.style.transform = '';
    }, 200);
    bubble.classList.add('visible');
    setTimeout(() => bubble.classList.remove('visible'), 2000);
  });

  // Global trigger for status changes
  window.triggerMascotReaction = function(status) {
    const phraseList = phrases[status] || phrases.neutral;
    bubble.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
    bubble.classList.add('visible');
    
    // Animate mascot jump
    mascot.style.animation = 'none';
    void mascot.offsetWidth; // Trigger reflow
    mascot.style.animation = 'mascotJump 0.5s ease-out, mascotBounce 3s ease-in-out infinite 0.5s';
    
    setTimeout(() => bubble.classList.remove('visible'), 3000);
  };

  function getOverallStatus() {
    const watching = document.querySelectorAll('[data-status="watching"]').length;
    const completed = document.querySelectorAll('[data-status="completed"]').length;
    if (completed > 3) return 'completed';
    if (watching > 3) return 'watching';
    return 'neutral';
  }

  // Add jump animation dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes mascotJump {
      0% { transform: translateY(0) scale(1); }
      40% { transform: translateY(-30px) scale(1.1); }
      70% { transform: translateY(-10px) scale(1.05); }
      100% { transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Countdown Ring Animations ─── */
function initCountdownRings() {
  const rings = document.querySelectorAll('.countdown-progress');
  
  rings.forEach((ring, i) => {
    const targetOffset = ring.getAttribute('stroke-dashoffset');
    ring.style.strokeDashoffset = '213.6'; // Start empty
    
    setTimeout(() => {
      ring.style.strokeDashoffset = targetOffset;
    }, 200 + i * 100);
  });

  // Simulate live countdown updates
  setInterval(() => {
    document.querySelectorAll('.countdown-ring').forEach(ring => {
      const circle = ring.querySelector('.countdown-progress');
      const currentOffset = parseFloat(circle.style.strokeDashoffset || circle.getAttribute('stroke-dashoffset'));
      // Subtle pulse
      if (currentOffset < 200) {
        circle.style.filter = `drop-shadow(0 0 ${6 + Math.random() * 4}px currentColor)`;
      }
    });
  }, 2000);
}

/* ─── Parallax Header ─── */
function initParallax() {
  const header = document.querySelector('.hero-header');
  const waves = document.querySelectorAll('.wave');
  const mascot = document.querySelector('.chibi-mascot');
  
  if (window.innerWidth < 768) return; // Disable on mobile

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    waves.forEach((wave, i) => {
      const factor = (i + 1) * 5;
      wave.style.transform = `translateX(${x * factor}px)`;
    });

    if (mascot) {
      mascot.style.transform = `translate(${x * 10}px, ${y * 5}px)`;
    }
  });
}

/* ─── Card Hover Tilt Effect ─── */
function initCardInteractions() {
  document.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const tiltX = (y - 0.5) * 6;
      const tiltY = (x - 0.5) * -6;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
      
      // Move glow to cursor
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,45,120,0.4), transparent 60%)`;
        glow.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      const glow = card.querySelector('.card-glow');
      if (glow) glow.style.opacity = '0';
    });
  });
}

/* ─── Update Global Stats ─── */
function updateStats() {
  const cards = document.querySelectorAll('.anime-card');
  let total = cards.length;
  let watching = 0;
  let episodesWatched = 0;

  cards.forEach(card => {
    if (card.dataset.status === 'watching') watching++;
    episodesWatched += parseInt(card.dataset.watched) || 0;
  });

  animateNumber('statTotal', total);
  animateNumber('statWatching', watching);
  animateNumber('statEpisodes', episodesWatched);
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  
  const start = parseInt(el.textContent) || 0;
  const diff = target - start;
  const duration = 500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    
    el.textContent = Math.round(start + diff * eased);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/* ─── Sparkline Hover Animation ─── */
document.querySelectorAll('.anime-card').forEach(card => {
  const sparkline = card.querySelector('.sparkline-path');
  if (!sparkline) return;
  
  const originalPoints = sparkline.getAttribute('points');
  
  card.addEventListener('mouseenter', () => {
    sparkline.style.filter = 'drop-shadow(0 0 4px currentColor) brightness(1.3)';
    sparkline.style.transform = 'scaleY(1.1)';
    sparkline.style.transformOrigin = 'bottom';
  });
  
  card.addEventListener('mouseleave', () => {
    sparkline.style.filter = '';
    sparkline.style.transform = '';
  });
});