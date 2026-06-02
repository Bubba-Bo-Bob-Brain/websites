// ============================================
// VERDANTA — Solarpunk Collaborative Wiki
// Interactive Behaviors & Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // LOADER
  // ========================================

  const loader = document.getElementById('loader');
  const loaderText = document.querySelector('.loader-text');

  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2800);
  }

  // ========================================
  // SUNLIGHT INTENSITY METER
  // ========================================

  const sunMeter = document.getElementById('sun-meter');
  const sunFill = document.getElementById('sun-fill');
  const sunThumb = document.getElementById('sun-thumb');
  const intensityValue = document.getElementById('intensity-value');
  const intensityBarFill = document.getElementById('intensity-bar-fill');

  const themes = {
    0.2: 'theme-dawn',
    0.35: 'theme-morning',
    0.5: 'theme-noon',
    0.65: 'theme-golden',
  };

  const themeOrder = ['theme-dawn', 'theme-morning', 'theme-noon', 'theme-golden'];
  const themeNames = ['Dawn', 'Morning', 'Noon', 'Golden Hour'];
  let currentIntensity = 0.65;
  let isDragging = false;

  function setSunIntensity(value) {
    currentIntensity = Math.max(0.1, Math.min(0.9, value));
    const position = currentIntensity;

    // Update meter
    if (sunFill) sunFill.style.width = (position * 100) + '%';
    if (sunThumb) sunThumb.style.left = (position * 100) + '%';
    if (intensityValue) intensityValue.textContent = Math.round(position * 100) + '%';

    // Update intensity bar
    if (intensityBarFill) {
      intensityBarFill.style.width = (position * 100) + '%';
    }

    // Determine theme
    let activeTheme = 'theme-dawn';
    if (position >= 0.65) activeTheme = 'theme-golden';
    else if (position >= 0.5) activeTheme = 'theme-noon';
    else if (position >= 0.35) activeTheme = 'theme-morning';

    // Apply theme
    document.body.className = activeTheme;

    // Update sun glow
    const sunColor = getComputedStyle(document.body).getPropertyValue('--sun-color').trim();
    const sunGlow = getComputedStyle(document.body).getPropertyValue('--sun-glow').trim();

    // Animate pulse on value change
    if (intensityValue) {
      intensityValue.style.transform = 'scale(1.1)';
      setTimeout(() => {
        intensityValue.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // Mouse interaction on sun meter
  if (sunMeter) {
    const track = sunMeter.querySelector('.sun-meter-track');

    function handleSunMove(e) {
      if (!isDragging) return;
      const rect = track.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      setSunIntensity(pct);
    }

    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleSunMove(e);
    });

    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      handleSunMove(e);
    });

    document.addEventListener('mousemove', handleSunMove);
    document.addEventListener('touchmove', handleSunMove);

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);

    // Click to set
    track.addEventListener('click', (e) => {
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setSunIntensity(pct);
    });
  }

  // Auto-cycle sunlight
  let sunAutoCycle = setInterval(() => {
    const cycle = [
      { value: 0.2, duration: 4000 },
      { value: 0.5, duration: 4000 },
      { value: 0.8, duration: 4000 },
      { value: 0.35, duration: 4000 },
    ];

    let step = 0;
    function cycleStep() {
      const target = cycle[step % cycle.length];
      const start = currentIntensity;
      const startTime = performance.now();

      function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / target.duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setSunIntensity(start + (target.value - start) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          step++;
          setTimeout(cycleStep, 2000);
        }
      }

      requestAnimationFrame(animate);
    }

    setTimeout(cycleStep, 3000);
  }, 100);

  // ========================================
  // SIDEBAR TOGGLE
  // ========================================

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
      }
    });
  }

  // ========================================
  // NAV LINK ACTIVE STATE
  // ========================================

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Highlight animation
      link.style.transform = 'translateX(4px)';
      setTimeout(() => {
        link.style.transform = '';
      }, 300);
    });
  });

  // ========================================
  // HERO PARTICLES
  // ========================================

  const heroParticles = document.getElementById('hero-particles');

  if (heroParticles) {
    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left = (Math.random() * 100) + '%';
      particle.style.top = (60 + Math.random() * 40) + '%';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particle.style.animationDelay = (Math.random() * 2) + 's';
      particle.style.width = (3 + Math.random() * 5) + 'px';
      particle.style.height = particle.style.width;

      const colors = ['#e8c860', '#7a9a4a', '#c4882a', '#5a8f29'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      heroParticles.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 8000);
    }

    // Initial burst
    for (let i = 0; i < 12; i++) {
      setTimeout(createParticle, i * 200);
    }

    // Ongoing
    setInterval(createParticle, 800);
  }

  // ========================================
  // SEARCH FUNCTIONALITY
  // ========================================

  const searchInput = document.getElementById('search-input');
  const searchContainer = document.querySelector('.search-container');

  if (searchInput) {
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 1) {
        searchTimeout = setTimeout(() => {
          // Simulate search results
          const results = [
            'Photosynthetic Circuitry',
            'Mycelial Infrastructure',
            'The Cascadia Communes',
            'Kelp Dome Architecture',
            'Butterfly Ventilation Systems',
            'Solar Terracing',
            'Seed Bank Index',
            'Kelp Hybrid',
            'Sunbean',
          ];

          const filtered = results.filter(item =>
            item.toLowerCase().includes(query)
          );

          // Visual feedback
          searchInput.style.borderColor = filtered.length > 0
            ? 'var(--accent-green)'
            : 'var(--accent-rose)';

          if (filtered.length === 0 && query.length > 2) {
            searchInput.placeholder = 'No results found...';
          } else {
            searchInput.placeholder = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`;
          }
        }, 300);
      } else {
        searchInput.style.borderColor = '';
        searchInput.placeholder = 'Search Verdanta...';
      }
    });

    searchInput.addEventListener('focus', () => {
      searchContainer.style.transform = 'scale(1.02)';
      searchContainer.style.transition = 'transform 0.2s ease';
    });

    searchInput.addEventListener('blur', () => {
      searchContainer.style.transform = 'scale(1)';
    });
  }

  // ========================================
  // ARTICLE CARD HOVER EFFECTS
  // ========================================

  const articleCards = document.querySelectorAll('.article-card');

  articleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const image = card.querySelector('.article-card-image');
      if (image) {
        image.style.transform = 'scale(1.05)';
        image.style.transition = 'transform 0.4s ease';
      }
    });

    card.addEventListener('mouseleave', () => {
      const image = card.querySelector('.article-card-image');
      if (image) {
        image.style.transform = 'scale(1)';
      }
    });
  });

  // ========================================
  // SEED BANK INTERACTIONS
  // ========================================

  const seedEntries = document.querySelectorAll('.seedbank-entry');

  seedEntries.forEach(entry => {
    entry.addEventListener('click', () => {
      entry.style.transform = 'scale(0.98)';
      setTimeout(() => {
        entry.style.transform = '';
      }, 150);
    });

    entry.addEventListener('mouseenter', () => {
      const emoji = entry.querySelector('.seed-emoji');
      if (emoji) {
        emoji.style.transform = 'rotate(15deg) scale(1.2)';
        emoji.style.transition = 'transform 0.3s ease';
      }
    });

    entry.addEventListener('mouseleave', () => {
      const emoji = entry.querySelector('.seed-emoji');
      if (emoji) {
        emoji.style.transform = '';
      }
    });
  });

  // ========================================
  // ACTIVITY FEED AUTO-REFRESH SIMULATION
  // ========================================

  const activityFeed = document.querySelector('.activity-feed');

  if (activityFeed) {
    const newActivities = [
      { avatar: '🌸', user: 'Bloomkeeper', action: 'updated', target: 'Cloud Lily cross-references' },
      { avatar: '🐝', user: 'Honeyguide', action: 'commented on', target: 'Solar Terracing' },
      { avatar: '🌿', user: 'Fernwalker', action: 'added image to', target: 'Mycelial Infrastructure' },
    ];

    let activityIndex = 0;

    function addNewActivity() {
      const activity = newActivities[activityIndex % newActivities.length];
      activityIndex++;

      const item = document.createElement('div');
      item.classList.add('activity-item');
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';

      item.innerHTML = `
        <div class="activity-avatar">${activity.avatar}</div>
        <div class="activity-content">
          <p><strong>${activity.user}</strong> ${activity.action} <a href="#">${activity.target}</a></p>
          <span class="activity-time">Just now</span>
        </div>
      `;

      activityFeed.insertBefore(item, activityFeed.firstChild);

      // Animate in
      requestAnimationFrame(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });

      // Remove old items if too many
      const items = activityFeed.querySelectorAll('.activity-item');
      if (items.length > 6) {
        const last = items[items.length - 1];
        last.style.transition = 'opacity 0.5s ease';
        last.style.opacity = '0';
        setTimeout(() => last.remove(), 500);
      }
    }

    // Add new activity every 8 seconds
    setInterval(addNewActivity, 8000);
  }

  // ========================================
  // INTENSITY BAR PULSE
  // ========================================

  const intensityCard = document.querySelector('.intensity-card');

  if (intensityCard) {
    setInterval(() => {
      const bar = intensityCard.querySelector('.intensity-bar-fill');
      if (bar) {
        bar.style.transition = 'width 1s ease';
        bar.style.width = (parseFloat(bar.style.width) + (Math.random() * 4 - 2)) + '%';
      }
    }, 3000);
  }

  // ========================================
  // BUTTON INTERACTIONS
  // ========================================

  const btnExplore = document.getElementById('btn-explore');
  const btnContribute = document.getElementById('btn-contribute');

  if (btnExplore) {
    btnExplore.addEventListener('click', () => {
      document.querySelector('.articles-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  if (btnContribute) {
    btnContribute.addEventListener('click', () => {
      const contributeSection = document.querySelector('.activity-section');
      if (contributeSection) {
        contributeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ========================================
  // INFBOX DECORATIVE CORNER ANIMATIONS
  // ========================================

  const infobox = document.querySelector('.wiki-infobox');

  if (infobox) {
    const corners = infobox.querySelectorAll(
      '.infobox-border-tl, .infobox-border-tr, .infobox-border-bl, .infobox-border-br'
    );

    corners.forEach((corner, i) => {
      corner.style.opacity = '0';
      corner.style.transition = `opacity 0.6s ease ${0.5 + i * 0.15}s`;

      setTimeout(() => {
        corner.style.opacity = '0.3';
      }, 800);
    });
  }

  // ========================================
  // SEED TAG SIDEBAR INTERACTION
  // ========================================

  const seedTags = document.querySelectorAll('.seed-tag');

  seedTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      // Ripple effect
      tag.style.transform = 'scale(0.95)';
      setTimeout(() => {
        tag.style.transform = '';
      }, 150);
    });
  });

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================

  const revealElements = document.querySelectorAll(
    '.article-card, .seedbank-entry, .activity-item, .infobox-section, .intensity-section'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ========================================
  // CURSOR CUSTOMIZATION
  // ========================================

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    @keyframes cursorGlow {
      0%, 100% { box-shadow: 0 0 8px rgba(74, 107, 42, 0.3); }
      50% { box-shadow: 0 0 16px rgba(74, 107, 42, 0.5); }
    }
  `;
  document.head.appendChild(cursorStyle);

  // ========================================
  // RANDOM AMBIENT DETAILS
  // ========================================

  // Add subtle random sway to vine decorations
  const vines = document.querySelectorAll('.vine');

  vines.forEach(vine => {
    setInterval(() => {
      const sway = (Math.random() - 0.5) * 4;
      vine.style.transform = `translateX(${sway}px)`;
    }, 3000);
  });

  // ========================================
  // ACCESSIBILITY: Keyboard Navigation
  // ========================================

  document.addEventListener('keydown', (e) => {
    // Escape to close sidebar on mobile
    if (e.key === 'Escape') {
      sidebar.classList.remove('open');
      sidebar.classList.add('collapsed');
    }

    // Focus search with "/"
    if (e.key === '/' && !searchInput.matches(':focus')) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // ========================================
  // NOTIFICATION SIMULATION
  // ========================================

  const iconBtns = document.querySelectorAll('.icon-btn');

  iconBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(0.9) rotate(10deg)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 200);
    });
  });

  // ========================================
  // SMOOTH THEME TRANSITIONS
  // ========================================

  // Add transition class to body for smooth theme switching
  const style = document.createElement('style');
  style.textContent = `
    body, .sidebar, .main-content, .top-bar, .hero,
    .article-card, .seedbank-entry, .activity-item,
    .wiki-infobox, .intensity-card, .sun-meter {
      transition: background-color 0.8s ease, border-color 0.8s ease,
                  color 0.8s ease, box-shadow 0.8s ease;
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // SEED BANK CROSS-REFERENCE HOVER
  // ========================================

  const crossrefLinks = document.querySelectorAll('.seedbank-crossref a');

  crossrefLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.textDecoration = 'underline';
      link.style.textDecorationColor = 'var(--accent-amber)';
    });

    link.addEventListener('mouseleave', () => {
      link.style.textDecoration = '';
    });
  });

  // ========================================
  // WELCOME MESSAGE
  // ========================================

  console.log('%c🌿 Welcome to Verdanta', 'font-size: 20px; font-weight: bold; color: #4a6b2a;');
  console.log('%cA collaborative solarpunk wiki for a regenerative future.', 'font-size: 12px; color: #5a4a38;');
  console.log('%cTip: Press "/" to focus search, "Escape" to close sidebar.', 'font-size: 11px; color: #8a7a68;');

});