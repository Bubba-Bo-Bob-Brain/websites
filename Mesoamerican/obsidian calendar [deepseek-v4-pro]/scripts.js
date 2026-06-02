document.addEventListener('DOMContentLoaded', () => {
  const veil = document.getElementById('loading-veil');
  const calendarWheel = document.getElementById('calendar-wheel');
  const glyphTooltip = document.getElementById('glyph-tooltip');
  const eclipseValue = document.getElementById('eclipse-value');
  const eventTimer = document.getElementById('event-timer');
  const nextEventText = document.getElementById('next-event-text');
  const particleContainer = document.getElementById('particle-container');
  const navGlyphs = document.querySelectorAll('.nav-glyph');
  const dayGlyphs = document.querySelectorAll('.day-glyph');
  const tributeNodes = document.querySelectorAll('.tribute-node');
  const ritualMarkers = document.querySelectorAll('.ritual-marker');
  const deityIcons = document.querySelectorAll('.deity-icon');
  const moonPhase = document.getElementById('moon-phase');
  const venusMarker = document.getElementById('venus-marker');

  const tonalpohualliDays = 260;
  let currentCount = 173;
  let tooltipTimeout;
  let isTooltipLocked = false;

  setTimeout(() => {
    veil.classList.add('veil-lifted');
    setTimeout(() => {
      if (veil.parentNode) veil.parentNode.removeChild(veil);
    }, 900);
  }, 1400);

  function updateEclipseCountdown() {
    if (currentCount <= 0) {
      currentCount = tonalpohualliDays;
      triggerCosmicEvent();
    }
    eclipseValue.textContent = currentCount;
    currentCount--;
  }

  setInterval(updateEclipseCountdown, 800);

  function triggerCosmicEvent() {
    const centralDisc = document.getElementById('central-disc');
    centralDisc.style.transition = 'box-shadow 0.2s ease';
    centralDisc.style.boxShadow = 'inset 0 0 60px rgba(227, 74, 74, 0.9), 0 0 80px #ff3a3a';
    setTimeout(() => {
      centralDisc.style.boxShadow = 'inset 0 0 25px var(--obsidian-deep), 0 0 30px rgba(227, 74, 74, 0.5)';
    }, 600);

    const bloodDrop = document.querySelector('.blood-drop');
    bloodDrop.style.animation = 'none';
    bloodDrop.offsetHeight;
    bloodDrop.style.animation = 'blood-drip 0.4s infinite alternate';
  }

  function updateEventTimer() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    eventTimer.textContent = `${hours}.${minutes}.${seconds}`;
  }

  setInterval(updateEventTimer, 1000);
  updateEventTimer();

  const ritualEvents = [
    'TOXCATL · SMOKING MIRROR RITE',
    'ETZALCUALIZTLI · BEAN FEAST',
    'TLACAXIPEHUALIZTLI · FLAYING OF MEN',
    'OCHPANIZTLI · SWEEPING THE WAY',
    'PANQUETZALIZTLI · RAISING OF BANNERS',
    'IZCALLI · REBIRTH THROUGH FIRE'
  ];

  let eventIndex = 0;
  setInterval(() => {
    eventIndex = (eventIndex + 1) % ritualEvents.length;
    nextEventText.textContent = `NEXT RITUAL: ${ritualEvents[eventIndex]}`;
    const banner = document.getElementById('event-banner');
    banner.style.transition = 'background 0.6s ease';
    banner.style.background = `linear-gradient(90deg, var(--blood-rust), var(--obsidian-deep), var(--jade-shadow))`;
    setTimeout(() => {
      banner.style.background = `linear-gradient(90deg, var(--blood-rust), var(--obsidian-deep), var(--blood-rust))`;
    }, 800);
  }, 12000);

  function positionTooltip(event, glyphName, detailText) {
    if (isTooltipLocked) return;
    const tooltipWidth = glyphTooltip.offsetWidth;
    const tooltipHeight = glyphTooltip.offsetHeight;
    let posX = event.clientX + 20;
    let posY = event.clientY - tooltipHeight - 15;

    if (posX + tooltipWidth > window.innerWidth - 10) {
      posX = event.clientX - tooltipWidth - 20;
    }
    if (posY < 10) {
      posY = event.clientY + 25;
    }

    glyphTooltip.style.left = `${posX}px`;
    glyphTooltip.style.top = `${posY}px`;
    glyphTooltip.querySelector('.tooltip-glyph').textContent = event.target.textContent || '✨';
    glyphTooltip.querySelector('.tooltip-name').textContent = glyphName;
    glyphTooltip.querySelector('.tooltip-detail').textContent = detailText;
    glyphTooltip.classList.add('visible');
  }

  function hideTooltip() {
    if (isTooltipLocked) return;
    glyphTooltip.classList.remove('visible');
  }

  dayGlyphs.forEach(glyph => {
    glyph.addEventListener('mouseenter', (e) => {
      const nahuatl = glyph.getAttribute('data-nahuatl');
      positionTooltip(e, nahuatl, 'Tonalpohualli Day Sign');
    });
    glyph.addEventListener('mouseleave', hideTooltip);
    glyph.addEventListener('click', (e) => {
      isTooltipLocked = !isTooltipLocked;
      if (isTooltipLocked) {
        const nahuatl = glyph.getAttribute('data-nahuatl');
        positionTooltip(e, nahuatl, 'Locked · Click again to release');
      } else {
        hideTooltip();
      }
    });
  });

  tributeNodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const deity = node.getAttribute('data-deity');
      const offering = node.getAttribute('data-offering');
      positionTooltip(e, deity, `Tribute: ${offering}`);
    });
    node.addEventListener('mouseleave', hideTooltip);
  });

  ritualMarkers.forEach(marker => {
    marker.addEventListener('mouseenter', (e) => {
      const festival = marker.getAttribute('data-festival');
      const date = marker.getAttribute('data-date');
      positionTooltip(e, festival, `Ceremony: ${date}`);
    });
    marker.addEventListener('mouseleave', hideTooltip);
  });

  deityIcons.forEach(icon => {
    icon.addEventListener('mouseenter', (e) => {
      const deity = icon.getAttribute('data-deity');
      positionTooltip(e, deity, 'Sacred Teotl Cycle');
    });
    icon.addEventListener('mouseleave', hideTooltip);
  });

  document.addEventListener('mousemove', (e) => {
    if (glyphTooltip.classList.contains('visible') && !isTooltipLocked) {
      const tooltipWidth = glyphTooltip.offsetWidth;
      const tooltipHeight = glyphTooltip.offsetHeight;
      let posX = e.clientX + 20;
      let posY = e.clientY - tooltipHeight - 15;
      if (posX + tooltipWidth > window.innerWidth - 10) posX = e.clientX - tooltipWidth - 20;
      if (posY < 10) posY = e.clientY + 25;
      glyphTooltip.style.left = `${posX}px`;
      glyphTooltip.style.top = `${posY}px`;
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.day-glyph') && !e.target.closest('.tribute-node') && !e.target.closest('.ritual-marker') && !e.target.closest('.deity-icon')) {
      isTooltipLocked = false;
      hideTooltip();
    }
  });

  const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  let moonIndex = 4;
  moonPhase.textContent = moonPhases[moonIndex];
  setInterval(() => {
    moonIndex = (moonIndex + 1) % moonPhases.length;
    moonPhase.textContent = moonPhases[moonIndex];
  }, 4000);

  const venusStates = ['✨', '💫', '⭐', '🌟'];
  let venusIndex = 0;
  venusMarker.textContent = venusStates[venusIndex];
  setInterval(() => {
    venusIndex = (venusIndex + 1) % venusStates.length;
    venusMarker.textContent = venusStates[venusIndex];
  }, 3500);

  navGlyphs.forEach(glyph => {
    glyph.addEventListener('click', function() {
      navGlyphs.forEach(g => g.classList.remove('active'));
      this.classList.add('active');
      const view = this.getAttribute('data-view');
      activateView(view);
    });
  });

  function activateView(view) {
    const wheel = document.getElementById('calendar-wheel');
    const slab = document.getElementById('tribute-slab');
    const banner = document.getElementById('event-banner');

    switch(view) {
      case 'calendar':
        wheel.style.transform = 'scale(1)';
        wheel.style.opacity = '1';
        slab.style.opacity = '1';
        banner.style.opacity = '1';
        break;
      case 'deities':
        wheel.style.transform = 'scale(1.05)';
        wheel.style.opacity = '0.9';
        slab.style.opacity = '0.5';
        banner.style.opacity = '0.6';
        break;
      case 'astronomy':
        wheel.style.transform = 'scale(0.95) rotate(5deg)';
        wheel.style.opacity = '0.8';
        slab.style.opacity = '0.4';
        banner.style.opacity = '0.9';
        break;
      case 'tribute':
        wheel.style.transform = 'scale(0.9)';
        wheel.style.opacity = '0.7';
        slab.style.opacity = '1';
        slab.style.transform = 'scale(1.03)';
        banner.style.opacity = '0.5';
        setTimeout(() => { slab.style.transform = 'scale(1)'; }, 400);
        break;
      default: break;
    }
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = '-10px';
    particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particle.style.background = Math.random() > 0.6 ? 'var(--gold-pale)' : 'var(--jade-luminous)';
    particleContainer.appendChild(particle);

    particle.addEventListener('animationend', () => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
    });
  }

  setInterval(createParticle, 400);
  for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, i * 150);
  }

  calendarWheel.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rings = document.querySelectorAll('.wheel-ring');
    const scrollAmount = e.deltaY * 0.5;
    rings.forEach(ring => {
      const currentDuration = parseFloat(getComputedStyle(ring).animationDuration);
      const newDuration = Math.max(10, Math.min(200, currentDuration + (e.deltaY > 0 ? 5 : -5)));
      ring.style.animationDuration = `${newDuration}s`;
    });
  }, { passive: false });

  let touchStartX = 0;
  calendarWheel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  calendarWheel.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchDelta = touchStartX - e.touches[0].clientX;
    const rings = document.querySelectorAll('.wheel-ring');
    rings.forEach(ring => {
      const currentDuration = parseFloat(getComputedStyle(ring).animationDuration);
      const newDuration = Math.max(10, Math.min(200, currentDuration + (touchDelta > 0 ? 2 : -2)));
      ring.style.animationDuration = `${newDuration}s`;
    });
    touchStartX = e.touches[0].clientX;
  }, { passive: false });

  const centralDisc = document.getElementById('central-disc');
  centralDisc.addEventListener('click', () => {
    currentCount = Math.max(0, currentCount - 20);
    updateEclipseCountdown();
    centralDisc.style.transform = 'scale(0.9)';
    setTimeout(() => { centralDisc.style.transform = 'scale(1)'; }, 150);
  });
});