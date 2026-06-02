const WeatherDash = (() => {

  const state = {
    refreshInterval: 300,
    refreshRemaining: 300,
    tempBase: 47,
    tempCurrent: 47,
    windDeg: 315,
    windTarget: 315,
    gustBase: 41,
    radarAngle: 0,
    alertVisible: true,
    reducedMotion: false
  };

  const el = {};

  function cacheElements() {
    el.liveTime = document.getElementById('liveTime');
    el.footerTime = document.getElementById('footerTime');
    el.refreshCountdown = document.getElementById('refreshCountdown');
    el.alertBanner = document.getElementById('alertBanner');
    el.alertClose = document.getElementById('alertClose');
    el.heroTemp = document.querySelector('.hero-temp__degrees');
    el.feelsLike = document.querySelector('.hero-temp__feels');
    el.windArrow = document.getElementById('windArrow');
    el.pressureBars = document.querySelectorAll('.pressure-bar');
    el.sunPosition = document.getElementById('sunPosition');
    el.radarCanvas = document.getElementById('radarCanvas');
    el.radarContainer = document.getElementById('radarContainer');
    el.hourlyScroll = document.getElementById('hourlyScroll');
    el.aqiMarker = document.getElementById('aqiMarker');
  }

  function checkReducedMotion() {
    state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${h}:${m}:${s}`;

    if (el.liveTime) el.liveTime.textContent = timeStr;
    if (el.footerTime) el.footerTime.textContent = timeStr;
  }

  function dismissAlert() {
    if (el.alertBanner) {
      el.alertBanner.style.maxHeight = el.alertBanner.scrollHeight + 'px';
      el.alertBanner.style.overflow = 'hidden';
      el.alertBanner.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease';
      requestAnimationFrame(() => {
        el.alertBanner.style.maxHeight = '0';
        el.alertBanner.style.opacity = '0';
        el.alertBanner.style.paddingTop = '0';
        el.alertBanner.style.paddingBottom = '0';
      });
      setTimeout(() => {
        el.alertBanner.style.display = 'none';
      }, 450);
    }
    state.alertVisible = false;
  }

  function updateWindArrow() {
    if (!el.windArrow) return;

    const drift = Math.sin(Date.now() / 2000) * 8;
    state.windTarget = state.windDeg + drift;
    el.windArrow.style.transform = `rotate(${state.windTarget}deg)`;

    const gustDrift = Math.sin(Date.now() / 800) * 3;
    const gustEl = document.querySelector('.gust-value');
    if (gustEl) {
      const gustVal = Math.round(state.gustBase + gustDrift + Math.random() * 2);
      gustEl.innerHTML = `${gustVal} <small>MPH</small>`;
    }
  }

  function renderPressureBars() {
    if (!el.pressureBars || el.pressureBars.length === 0) return;

    const values = [];
    el.pressureBars.forEach(bar => {
      const val = bar.getAttribute('data-val');
      if (val !== '--') {
        values.push(parseFloat(val));
      }
    });

    if (values.length === 0) return;

    const minVal = 29.40;
    const maxVal = 30.20;
    const range = maxVal - minVal;

    el.pressureBars.forEach(bar => {
      const val = bar.getAttribute('data-val');
      if (val !== '--') {
        const numVal = parseFloat(val);
        const normalized = (numVal - minVal) / range;
        const height = Math.max(4, normalized * 50);
        bar.style.height = height + 'px';
      } else {
        bar.style.height = '4px';
        bar.style.opacity = '0.15';
      }
    });
  }

  function updateSunPosition() {
    if (!el.sunPosition) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const sunrise = 6 * 60 + 42;
    const sunset = 17 * 60 + 14;
    const dayDuration = sunset - sunrise;

    let progress;
    if (currentMinutes < sunrise) {
      progress = 0;
    } else if (currentMinutes > sunset) {
      progress = 1;
    } else {
      progress = (currentMinutes - sunrise) / dayDuration;
    }

    const arcContainer = el.sunPosition.parentElement;
    if (!arcContainer) return;

    const containerWidth = arcContainer.offsetWidth * 0.9;
    const containerHeight = arcContainer.offsetHeight;

    const x = progress * containerWidth + (arcContainer.offsetWidth * 0.05);
    const yFactor = Math.sin(progress * Math.PI);
    const y = containerHeight - (yFactor * (containerHeight * 0.85)) - 7;

    el.sunPosition.style.left = x + 'px';
    el.sunPosition.style.bottom = (containerHeight - y) + 'px';

    const isDaytime = currentMinutes >= sunrise && currentMinutes <= sunset;
    el.sunPosition.style.opacity = isDaytime ? '1' : '0.2';
  }

  function drawRadar() {
    if (!el.radarCanvas || !el.radarContainer) return;

    const canvas = el.radarCanvas;
    const container = el.radarContainer;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.min(cx, cy);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const precipBlobs = [
      { angle: 210, dist: 0.7, size: 0.25, intensity: 0.6, speed: 0.0003 },
      { angle: 245, dist: 0.55, size: 0.18, intensity: 0.8, speed: 0.0004 },
      { angle: 260, dist: 0.4, size: 0.12, intensity: 0.4, speed: 0.0005 },
      { angle: 190, dist: 0.85, size: 0.15, intensity: 0.3, speed: 0.0002 },
      { angle: 230, dist: 0.3, size: 0.08, intensity: 0.9, speed: 0.0006 },
      { angle: 280, dist: 0.6, size: 0.1, intensity: 0.5, speed: 0.00035 },
      { angle: 170, dist: 0.75, size: 0.2, intensity: 0.2, speed: 0.00025 }
    ];

    const time = Date.now();

    precipBlobs.forEach(blob => {
      const driftAngle = blob.angle + Math.sin(time * blob.speed) * 5;
      const rad = (driftAngle - 90) * (Math.PI / 180);
      const dist = blob.dist * maxR;
      const bx = cx + Math.cos(rad) * dist;
      const by = cy + Math.sin(rad) * dist;
      const blobR = blob.size * maxR;

      let color;
      if (blob.intensity < 0.3) {
        color = [33, 150, 243];
      } else if (blob.intensity < 0.6) {
        color = [21, 101, 192];
      } else if (blob.intensity < 0.8) {
        color = [13, 71, 161];
      } else {
        color = [255, 23, 68];
      }

      const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, blobR);
      gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${blob.intensity * 0.6})`);
      gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${blob.intensity * 0.3})`);
      gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

      ctx.beginPath();
      ctx.arc(bx, by, blobR, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    const sweepAngle = (time / 4000) * (Math.PI * 2);
    const sweepGrad = ctx.createConicalGradient
      ? null
      : null;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweepAngle);
    const sweepGradient = ctx.createLinearGradient(0, 0, maxR, 0);
    sweepGradient.addColorStop(0, 'rgba(0, 255, 65, 0.12)');
    sweepGradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxR, -0.15, 0.15);
    ctx.closePath();
    ctx.fillStyle = sweepGradient;
    ctx.fill();
    ctx.restore();
  }

  function animateTemperature() {
    if (!el.heroTemp) return;

    const drift = (Math.random() - 0.5) * 0.6;
    const smoothing = 0.95;
    state.tempCurrent = state.tempCurrent * smoothing + (state.tempBase + drift) * (1 - smoothing);
    const displayTemp = Math.round(state.tempCurrent);

    el.heroTemp.textContent = displayTemp;

    const feelsBase = 39;
    const feelsDrift = (displayTemp - state.tempBase) * 0.8;
    if (el.feelsLike) {
      el.feelsLike.textContent = `FEELS LIKE ${Math.round(feelsBase + feelsDrift)}°F`;
    }
  }

  function updateRefreshCountdown() {
    state.refreshRemaining -= 1;

    if (state.refreshRemaining <= 0) {
      state.refreshRemaining = state.refreshInterval;
    }

    if (el.refreshCountdown) {
      el.refreshCountdown.textContent = state.refreshRemaining;

      if (state.refreshRemaining <= 30) {
        el.refreshCountdown.style.color = '#ff2d2d';
      } else if (state.refreshRemaining <= 60) {
        el.refreshCountdown.style.color = '#ffcc00';
      } else {
        el.refreshCountdown.style.color = '';
      }
    }
  }

  function initHourlyScrollIndicators() {
    if (!el.hourlyScroll) return;

    const scrollContainer = el.hourlyScroll;

    const createIndicator = () => {
      const indicator = document.createElement('div');
      indicator.className = 'scroll-indicator';
      indicator.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(14, 14, 14, 0.9));
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-size: 0.6rem;
        color: var(--fg-dim);
        letter-spacing: 0.1em;
        z-index: 5;
      `;
      indicator.textContent = '→';
      indicator.id = 'scrollHint';

      scrollContainer.style.position = 'relative';
      scrollContainer.appendChild(indicator);
    };

    createIndicator();

    scrollContainer.addEventListener('scroll', () => {
      const hint = document.getElementById('scrollHint');
      if (!hint) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const scrolled = scrollContainer.scrollLeft;

      if (scrolled >= maxScroll - 10) {
        hint.style.opacity = '0';
      } else {
        hint.style.opacity = '1';
      }
    });
  }

  function initHourlyRowHighlight() {
    const rows = document.querySelectorAll('.hourly-table tbody tr');
    if (rows.length === 0) return;

    const now = new Date();
    const currentHour = now.getHours();

    const tableTimes = [];
    rows.forEach((row, index) => {
      const timeCell = row.querySelector('td:first-child');
      if (timeCell) {
        const timeText = timeCell.textContent.trim();
        const hour = parseInt(timeText.split(':')[0], 10);
        tableTimes.push({ row, hour, index });
      }
    });

    let closestIndex = 0;
    let closestDiff = 24;
    tableTimes.forEach(item => {
      let diff = currentHour - item.hour;
      if (diff < 0) diff += 24;
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = item.index;
      }
    });

    rows[closestIndex].classList.add('row--current');
    rows[closestIndex].style.borderLeft = '4px solid #ffcc00';
  }

  function initWeeklyCardInteractions() {
    const cards = document.querySelectorAll('.weekly-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => {
          if (c !== card) {
            c.style.opacity = '0.4';
          }
        });
      });
      card.addEventListener('mouseleave', () => {
        cards.forEach(c => {
          c.style.opacity = '';
        });
      });
    });
  }

  function initPanelHoverEffects() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      panel.addEventListener('mouseenter', () => {
        panel.style.borderColor = '#6b6b6b';
        panel.style.zIndex = '10';
      });
      panel.addEventListener('mouseleave', () => {
        panel.style.borderColor = '';
        panel.style.zIndex = '';
      });
    });
  }

  function initVisibilityScaleClick() {
    const marks = document.querySelectorAll('.visibility-mark');
    marks.forEach(mark => {
      mark.style.cursor = 'pointer';
      mark.addEventListener('click', () => {
        marks.forEach(m => m.classList.remove('active'));
        mark.classList.add('active');
      });
    });
  }

  function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && el.hourlyScroll) {
        el.hourlyScroll.scrollBy({ left: 200, behavior: 'smooth' });
      }
      if (e.key === 'ArrowLeft' && el.hourlyScroll) {
        el.hourlyScroll.scrollBy({ left: -200, behavior: 'smooth' });
      }
      if (e.key === 'Escape' && state.alertVisible) {
        dismissAlert();
      }
    });
  }

  function animateAQIMarker() {
    if (!el.aqiMarker) return;

    const baseLeft = 14;
    const drift = Math.sin(Date.now() / 5000) * 0.3;
    el.aqiMarker.style.left = (baseLeft + drift) + '%';
  }

  function initConditionFlash() {
    const conditionEl = document.querySelector('.hero-temp__condition');
    if (!conditionEl) return;

    setInterval(() => {
      conditionEl.style.borderColor = '#ff2d2d';
      setTimeout(() => {
        conditionEl.style.borderColor = '';
      }, 150);
    }, 8000);
  }

  function initStatusDotColor() {
    const statusDot = document.querySelector('.status-dot');
    if (!statusDot) return;

    setInterval(() => {
      const colors = ['#00cc66', '#ffcc00', '#00cc66', '#00cc66', '#00cc66'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      statusDot.style.background = randomColor;
    }, 15000);
  }

  function addCurrentTimeStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .row--current td {
        color: #ffcc00 !important;
        font-weight: 700;
      }
      .row--current td:first-child {
        position: relative;
      }
      .row--current td:first-child::before {
        content: '►';
        position: absolute;
        left: -12px;
        font-size: 0.5rem;
        color: #ffcc00;
      }
    `;
    document.head.appendChild(style);
  }

  function mainLoop() {
    if (!state.reducedMotion) {
      updateWindArrow();
      drawRadar();
      animateTemperature();
      animateAQIMarker();
    }

    requestAnimationFrame(mainLoop);
  }

  function slowLoop() {
    updateSunPosition();
  }

  function init() {
    checkReducedMotion();
    cacheElements();

    updateClock();
    setInterval(updateClock, 1000);

    if (el.alertClose) {
      el.alertClose.addEventListener('click', dismissAlert);
    }

    renderPressureBars();

    updateSunPosition();
    setInterval(slowLoop, 60000);

    updateRefreshCountdown();
    setInterval(updateRefreshCountdown, 1000);

    initHourlyScrollIndicators();
    initHourlyRowHighlight();
    initWeeklyCardInteractions();
    initPanelHoverEffects();
    initVisibilityScaleClick();
    initKeyboardNavigation();
    initConditionFlash();
    initStatusDotColor();
    addCurrentTimeStyle();

    if (!state.reducedMotion) {
      requestAnimationFrame(mainLoop);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        drawRadar();
        updateSunPosition();
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, dismissAlert };
})();