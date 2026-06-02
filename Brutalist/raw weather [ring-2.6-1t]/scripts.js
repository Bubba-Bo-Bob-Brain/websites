/* ============================================================
   BRUTALIST WEATHER DASHBOARD — SCRIPTS
   Raw. Functional. Unapologetic.
   ============================================================ */

(function () {
  'use strict';

  // ─── MOCK WEATHER DATA ───────────────────────────────────
  // Replace this with a real API call if desired.
  // This object is the single source of truth for the dashboard.

  const WeatherData = {
    location: 'SECTOR 7-G — UNKNOWN ZONE',
    timezone: 'UTC',

    current: {
      temp: 37.2,
      feels_like: 34.8,
      humidity: 78,
      pressure: 1012,
      pressure_trend: 'falling',   // rising | falling | stable
      wind_speed: 42,
      wind_gust: 67,
      wind_deg: 235,
      uv_index: 7.5,
      uv_risk: 'HIGH',
      condition: 'STORM',
      description: 'SEVERE STORM WARNING',
      icon: '⛈',
      cloud_cover: 95,
      visibility: 2.4,
      dew_point: 29.1,
    },

    hourly: [
      { time: 'NOW',   temp: 37.2, feels: 34.8, cond: '⛈ STORM',  precip: 92, wind: 42, humid: 78 },
      { time: '+1h',   temp: 36.1, feels: 33.5, cond: '⛈ STORM',  precip: 88, wind: 44, humid: 80 },
      { time: '+2h',   temp: 34.5, feels: 31.0, cond: '🌧 HEAVY',  precip: 85, wind: 40, humid: 83 },
      { time: '+3h',   temp: 32.0, feels: 28.4, cond: '🌧 HEAVY',  precip: 80, wind: 38, humid: 86 },
      { time: '+4h',   temp: 30.1, feels: 26.0, cond: '🌧 MOD',    precip: 72, wind: 35, humid: 88 },
      { time: '+5h',   temp: 28.4, feels: 24.1, cond: '🌧 MOD',    precip: 65, wind: 33, humid: 90 },
      { time: '+6h',   temp: 26.8, feels: 22.5, cond: '🌦 DRIZZ',  precip: 55, wind: 30, humid: 91 },
      { time: '+7h',   temp: 25.0, feels: 20.8, cond: '🌦 DRIZZ',  precip: 45, wind: 28, humid: 92 },
      { time: '+8h',   temp: 23.5, feels: 19.5, cond: '☁ OVERCAST',precip: 30, wind: 25, humid: 90 },
      { time: '+9h',   temp: 22.8, feels: 19.0, cond: '☁ OVERCAST',precip: 20, wind: 22, humid: 88 },
      { time: '+10h',  temp: 22.0, feels: 18.5, cond: '⛅ PARTIAL', precip: 10, wind: 20, humid: 85 },
      { time: '+11h',  temp: 21.5, feels: 18.2, cond: '⛅ PARTIAL', precip: 5,  wind: 18, humid: 82 },
      { time: '+12h',  temp: 21.0, feels: 18.0, cond: '🌤 CLEAR',  precip: 0,  wind: 15, humid: 80 },
      { time: '+13h',  temp: 22.5, feels: 19.5, cond: '🌤 CLEAR',  precip: 0,  wind: 14, humid: 77 },
      { time: '+14h',  temp: 24.8, feels: 22.0, cond: '🌤 CLEAR',  precip: 0,  wind: 12, humid: 73 },
      { time: '+15h',  temp: 27.0, feels: 24.5, cond: '☀ SUNNY',   precip: 0,  wind: 10, humid: 68 },
      { time: '+16h',  temp: 29.5, feels: 27.0, cond: '☀ SUNNY',   precip: 0,  wind: 10, humid: 65 },
      { time: '+17h',  temp: 31.0, feels: 28.8, cond: '☀ SUNNY',   precip: 0,  wind: 12, humid: 62 },
      { time: '+18h',  temp: 32.5, feels: 30.5, cond: '🌤 CLEAR',  precip: 0,  wind: 14, humid: 58 },
      { time: '+19h',  temp: 33.8, feels: 32.0, cond: '⛅ PARTIAL', precip: 5,  wind: 16, humid: 55 },
      { time: '+20h',  temp: 34.5, feels: 33.0, cond: '⛅ PARTIAL', precip: 10, wind: 18, humid: 53 },
      { time: '+21h',  temp: 35.8, feels: 34.5, cond: '🌦 DRIZZ',  precip: 25, wind: 22, humid: 58 },
      { time: '+22h',  temp: 36.5, feels: 35.0, cond: '🌧 MOD',    precip: 40, wind: 28, humid: 62 },
      { time: '+23h',  temp: 37.0, feels: 34.8, cond: '⛈ STORM',  precip: 70, wind: 38, humid: 70 },
    ],

    alerts: [
      {
        severity: 'SEVERE',
        level: 'severe',
        title: 'TORNADO WATCH — SECTOR 7-G',
        body: 'Conditions favorable for tornado formation. Seek shelter immediately. Rotational velocity detected at 18,000 ft AGL. Do not attempt surface travel.',
        issued: new Date(Date.now() - 600000),
      },
      {
        severity: 'WARNING',
        level: 'warning',
        title: 'FLASH FLOOD WARNING',
        body: 'Rainfall accumulation exceeds 3.0 inches per hour. Drainage systems compromised. Low-lying areas will experience inundation within 15 minutes.',
        issued: new Date(Date.now() - 300000),
      },
      {
        severity: 'INFO',
        level: 'info',
        title: 'WIND ADVISORY',
        body: 'Sustained winds of 40+ km/h with gusts up to 67 km/h expected through 2300Z. Secure all loose objects on the tarmac.',
        issued: new Date(Date.now() - 1200000),
      },
    ],
  };

  // ─── UTILITY FUNCTIONS ────────────────────────────────────

  function $(selector) { return document.querySelector(selector); }
  function $$(selector) { return document.querySelectorAll(selector); }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  function formatTime(date) {
    const d = new Date(date);
    return d.toTimeString().split(' ')[0].slice(0, 5);
  }

  function formatTimeFull(date) {
    return new Date(date).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
  }

  // ─── CLOCK ────────────────────────────────────────────────

  function updateClock() {
    const now = new Date();
    $('#clock').textContent = formatTime(now);
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ─── LOCATION ─────────────────────────────────────────────

  $('#location').textContent = WeatherData.location;

  // ─── HERO SECTION ─────────────────────────────────────────

  function renderHero() {
    const c = WeatherData.current;
    $('#temp').textContent = c.temp.toFixed(1) + '°';
    $('#feels_like').textContent = 'feels like ' + c.feels_like.toFixed(1) + '°';
    $('#weather_desc').textContent = c.condition + ' — ' + c.description;

    // Dynamic hero gradient based on condition
    const heroBg = $('.hero__bg');
    let gradient;
    if (c.condition.includes('STORM')) {
      gradient = 'linear-gradient(180deg, #0d0d2b 0%, #0a0a12 50%, #0a0a0a 100%)';
    } else if (c.condition.includes('CLEAR') || c.condition.includes('SUNNY')) {
      gradient = 'linear-gradient(180deg, #2a1800 0%, #1a0f00 50%, #0a0a0a 100%)';
    } else {
      gradient = 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)';
    }
    heroBg.style.background = gradient;
    document.documentElement.style.setProperty('--hero-gradient', gradient);
  }

  // ─── DATA PANELS ──────────────────────────────────────────

  function renderPanels() {
    const c = WeatherData.current;

    // Wind
    $('#wind_speed').textContent = c.wind_speed + ' km/h';
    $('#wind_dir').textContent = degToCompass(c.wind_deg);
    // Set CSS custom property for arrow rotation
    document.documentElement.style.setProperty('--wind-angle', c.wind_deg + 'deg');

    // Humidity
    $('#humidity').textContent = c.humidity + '%';

    // Pressure
    $('#pressure').textContent = c.pressure + ' hPa';
    const trendEl = $('#press_trend');
    trendEl.textContent = c.pressure_trend.toUpperCase();
    trendEl.className = 'press__trend press__trend--' + c.pressure_trend;

    // UV
    $('#uv_index').textContent = c.uv_index.toFixed(1);
    const uvRiskEl = $('#uv_risk');
    uvRiskEl.textContent = c.uv_risk;
    uvRiskEl.className = 'uv__risk uv__risk--' + uvRiskClass(c.uv_index);
  }

  function degToCompass(deg) {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  }

  function uvRiskClass(uv) {
    if (uv <= 2) return 'low';
    if (uv <= 5) return 'moderate';
    if (uv <= 7) return 'high';
    return 'extreme';
  }

  // ─── HOURLY TABLE ─────────────────────────────────────────

  function renderHourly() {
    const tbody = $('#hourly_body');
    tbody.innerHTML = '';

    WeatherData.hourly.forEach(function (h) {
      const tr = document.createElement('tr');

      const precipBarWidth = clamp(h.precip * 0.8, 0, 100);
      const precipBarColor = h.precip > 70 ? 'var(--red)' : h.precip > 40 ? 'var(--yellow)' : 'var(--cyan-dim)';

      tr.innerHTML =
        '<td>' + h.time + '</td>' +
        '<td class="mono-big">' + h.temp.toFixed(1) + '°</td>' +
        '<td>' + h.feels.toFixed(1) + '°</td>' +
        '<td>' + h.cond + '</td>' +
        '<td>' +
          '<span class="precip__num">' + h.precip + '%</span>' +
          '<span class="precip-bar" style="width:' + precipBarWidth + 'px;background:' + precipBarColor + '"></span>' +
        '</td>' +
        '<td>' + h.wind + ' km/h</td>' +
        '<td>' + h.humid + '%</td>';

      tbody.appendChild(tr);
    });
  }

  // ─── ALERTS ───────────────────────────────────────────────

  function renderAlerts() {
    const container = $('#alerts_list');
    container.innerHTML = '';

    WeatherData.alerts.forEach(function (a) {
      const card = document.createElement('div');
      card.className = 'alert-card alert-card--' + a.level;

      card.innerHTML =
        '<span class="alert__severity">' + a.severity + '</span>' +
        '<h3 class="alert__title">' + a.title + '</h3>' +
        '<p class="alert__body">' + a.body + '</p>' +
        '<p class="alert__time">ISSUED: ' + formatTimeFull(a.issued) + '</p>';

      container.appendChild(card);
    });
  }

  // ─── LIVE DATA SIMULATION ─────────────────────────────────
  // Simulates minor fluctuations every 8 seconds for immersion.

  function simulateDataDrift() {
    const c = WeatherData.current;
    c.temp += (Math.random() - 0.5) * 0.3;
    c.temp = parseFloat(c.temp.toFixed(1));
    c.feels_like += (Math.random() - 0.5) * 0.2;
    c.feels_like = parseFloat(c.feels_like.toFixed(1));
    c.wind_speed = Math.max(5, c.wind_speed + rand(-3, 3));
    c.humidity = clamp(c.humidity + rand(-1, 1), 30, 100);
    c.pressure += rand(-1, 1) * 0.1;
    c.pressure = parseFloat(c.pressure.toFixed(1));
    c.uv_index = clamp(c.uv_index + (Math.random() - 0.5) * 0.3, 0, 12);

    renderHero();
    renderPanels();
  }

  // ─── BRUTALIST GLITCH EFFECT ──────────────────────────────
  // Randomly applies a brief CSS class to the body for a screen-jitter feel.

  function triggerGlitch() {
    const body = document.body;
    body.classList.add('glitch');
    setTimeout(function () { body.classList.remove('glitch'); }, 150 + Math.random() * 200);
  }

  // Random glitch every 8–25 seconds
  function scheduleGlitch() {
    const delay = rand(8000, 25000);
    setTimeout(function () {
      triggerGlitch();
      scheduleGlitch();
    }, delay);
  }

  // ─── NAVIGATION — SMOOTH SCROLL WITH HARSH SNAP ──────────

  function initNavigation() {
    $$('.topbar__nav a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
          // Flash the section border briefly
          target.style.outline = '3px solid #00ffd5';
          setTimeout(function () { target.style.outline = ''; }, 600);
        }
      });
    });
  }

  // ─── DATA REFRESH STAMP ───────────────────────────────────
  // Shows how long ago the data was "fetched"

  let dataFetchTime = new Date();

  function renderDataAge() {
    const ageEl = document.createElement('div');
    ageEl.className = 'data-age';
    ageEl.style.cssText =
      'position:fixed;bottom:10px;right:14px;z-index:9999;font-size:0.6rem;' +
      'color:#555;letter-spacing:0.2em;font-family:monospace;';
    document.body.appendChild(ageEl);

    function update() {
      const diff = Date.now() - dataFetchTime.getTime();
      const secs = Math.floor(diff / 1000);
      ageEl.textContent = 'DATA AGE: ' + secs + 's';
      // Color shifts from cyan to red as data ages
      const ratio = Math.min(secs / 60, 1);
      const r = Math.round(0 + ratio * 255);
      const g = Math.round(255 - ratio * 100);
      const b = Math.round(213 - ratio * 213);
      ageEl.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    update();
    setInterval(update, 1000);
  }

  // ─── AMBIENT SOUND TOGGLE (Web Audio API — noise drone) ──

  function initAmbientDrone() {
    let audioCtx = null;
    let oscillator = null;
    let gainNode = null;

    const btn = document.createElement('button');
    btn.textContent = '◉ AMBIENT DRONE: OFF';
    btn.style.cssText =
      'position:fixed;top:70px;right:14px;z-index:9999;padding:8px 14px;' +
      'font-family:monospace;font-size:0.65rem;letter-spacing:0.2em;' +
      'background:#111;color:#555;border:1px solid #333;cursor:pointer;' +
      'text-transform:uppercase;';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      if (audioCtx) {
        // Stop
        oscillator.stop();
        audioCtx.close();
        audioCtx = null;
        btn.textContent = '◉ AMBIENT DRONE: OFF';
      } else {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.04;
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 55; // low A
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        btn.textContent = '■ AMBIENT DRONE: ON';
      }
    });
  }

  // ─── WIND ARROW ANIMATION ─────────────────────────────────

  function animateWindArrow() {
    const arrow = $('#wind_arrow');
    if (!arrow) return;

    // Create SVG-less CSS arrows dynamically
    const shaft = document.createElement('div');
    shaft.className = 'arrow-shaft';
    const head = document.createElement('div');
    head.className = 'arrow-head';
    const tail = document.createElement('div');
    tail.className = 'arrow-tail';

    arrow.appendChild(shaft);
    arrow.appendChild(head);
    arrow.appendChild(tail);
  }

  // ─── VISIBILITY METER (extra data point) ──────────────────

  function renderVisibilityBar() {
    const hero = $('.hero__content');
    if (!hero) return;

    const vis = WeatherData.current.visibility;
    const bar = document.createElement('div');
    bar.style.cssText =
      'margin-top:16px;display:flex;align-items:center;gap:10px;' +
      'font-size:0.7rem;color:#555;letter-spacing:0.2em;';

    const label = document.createElement('span');
    label.textContent = 'VIS';
    bar.appendChild(label);

    const track = document.createElement('div');
    track.style.cssText =
      'width:120px;height:6px;background:#222;border:1px solid #333;position:relative;';

    const fill = document.createElement('div');
    const fillWidth = clamp((vis / 16) * 100, 0, 100);
    fill.style.cssText =
      'height:100%;width:' + fillWidth + '%;background:#00ffd5;position:absolute;left:0;top:0;';
    track.appendChild(fill);
    bar.appendChild(track);

    const val = document.createElement('span');
    val.textContent = vis + ' km';
    val.style.color = '#00ffd5';
    bar.appendChild(val);

    hero.appendChild(bar);
  }

  // ─── INIT ─────────────────────────────────────────────────

  function init() {
    renderHero();
    renderPanels();
    renderHourly();
    renderAlerts();
    animateWindArrow();
    renderVisibilityBar();
    initNavigation();
    renderDataAge();
    initAmbientDrone();
    scheduleGlitch();

    // Simulate live data drift
    setInterval(simulateDataDrift, 8000);
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();