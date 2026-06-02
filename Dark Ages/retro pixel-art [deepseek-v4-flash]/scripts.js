/* ============================================
   scripts.js  —  DARK AGES · PIXEL REALM
   ============================================ */

(function() {
  'use strict';

  // ----- DOM references -----
  const overlay = document.getElementById('daynightOverlay');
  const daynightToggle = document.getElementById('daynightToggle');
  const bellTower = document.getElementById('bellTower');
  const bellRingBtn = document.getElementById('bellRingBtn');
  const seasonDisplay = document.getElementById('seasonDisplay');
  const hutWindow = document.getElementById('hutWindow');
  const footerClock = document.getElementById('footerClock');

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = {
    village: document.getElementById('section-village'),
    kings: document.getElementById('section-kings'),
    lore: document.getElementById('section-lore'),
    map: document.getElementById('section-map')
  };

  // ----- State -----
  let isNight = false;
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  let seasonIndex = 2; // autumn
  let bellTimeout = null;
  let clockInterval = null;

  // ----- Utility: update season display & hut window -----
  function updateSeason(offset) {
    seasonIndex = (seasonIndex + offset + 4) % 4;
    const season = seasons[seasonIndex];
    seasonDisplay.textContent = season;

    // change hut window color based on season
    if (hutWindow) {
      const seasonColors = {
        spring: '#6a9a5a',
        summer: '#c4a84a',
        autumn: '#c45a2c',
        winter: '#8aacb8'
      };
      hutWindow.style.background = seasonColors[season] || '#c45a2c';
    }

    // change overlay tint slightly (very subtle)
    if (overlay) {
      const tintMap = {
        spring: 'rgba(30, 50, 20, 0.35)',
        summer: 'rgba(50, 40, 10, 0.30)',
        autumn: 'rgba(40, 25, 15, 0.40)',
        winter: 'rgba(20, 30, 40, 0.45)'
      };
      overlay.style.setProperty('--night-shadow-alpha', tintMap[season] || 'rgba(15,12,10,0.65)');
    }
  }

  // ----- Day/Night toggle -----
  function toggleDayNight() {
    isNight = !isNight;
    overlay.classList.toggle('is-night', isNight);

    // update button label
    daynightToggle.textContent = isNight ? '☀️ day breaks' : '🌙 night falls';

    // hut window night effect
    if (hutWindow) {
      hutWindow.classList.toggle('is-night', isNight);
    }

    // optional: add a data attribute to body for further css hooks
    document.body.dataset.theme = isNight ? 'night' : 'day';
  }

  // ----- Bell toll -----
  function tollBell() {
    if (bellTimeout) {
      clearTimeout(bellTimeout);
      bellTimeout = null;
    }

    bellTower.classList.add('is-ringing');

    // create a subtle "vibration" effect on the main wrapper
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) {
      wrapper.style.transition = 'transform 0.08s';
      wrapper.style.transform = 'translateX(2px)';
      setTimeout(() => { wrapper.style.transform = 'translateX(-2px)'; }, 80);
      setTimeout(() => { wrapper.style.transform = 'translateX(1px)'; }, 160);
      setTimeout(() => { wrapper.style.transform = 'translateX(0)'; }, 240);
    }

    // hide bell after 1.5s
    bellTimeout = setTimeout(() => {
      bellTower.classList.remove('is-ringing');
      bellTimeout = null;
    }, 1500);
  }

  // ----- Navigation: show/hide sections -----
  function navigateTo(pageId) {
    // hide all sections
    Object.keys(sections).forEach(key => {
      const el = sections[key];
      if (el) {
        el.style.display = 'none';
      }
    });

    // show target section
    const target = sections[pageId];
    if (target) {
      target.style.display = 'block';
    }

    // update nav active state
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageId) {
        link.classList.add('active');
      }
    });
  }

  // ----- Clock update -----
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    footerClock.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // ----- Initialize -----
  function init() {
    // set default season display
    updateSeason(0);

    // start clock
    updateClock();
    clockInterval = setInterval(updateClock, 1000);

    // ----- Event listeners -----

    // day/night toggle
    daynightToggle.addEventListener('click', toggleDayNight);

    // bell ring
    bellRingBtn.addEventListener('click', tollBell);

    // navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (page && sections[page]) {
          navigateTo(page);
          // update URL hash without scroll
          history.pushState(null, '', '#' + page);
        }
      });
    });

    // handle back/forward navigation via hashchange
    window.addEventListener('hashchange', function() {
      const hash = window.location.hash.replace('#', '');
      if (hash && sections[hash]) {
        navigateTo(hash);
      } else {
        // default to village
        navigateTo('village');
      }
    });

    // initial navigation based on URL hash or default
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && sections[initialHash]) {
      navigateTo(initialHash);
    } else {
      navigateTo('village');
    }

    // ----- Seasonal cycle (auto-advance every 20 seconds) -----
    setInterval(() => {
      updateSeason(1);
    }, 20000);

    // ----- Optional: keyboard shortcuts -----
    document.addEventListener('keydown', function(e) {
      if (e.key === 'n' || e.key === 'N') {
        toggleDayNight();
      }
      if (e.key === 'b' || e.key === 'B') {
        tollBell();
      }
      // number keys for navigation
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 4) {
        const pages = ['village', 'kings', 'lore', 'map'];
        const target = pages[num - 1];
        if (target) {
          navigateTo(target);
          history.pushState(null, '', '#' + target);
        }
      }
    });

    // ----- Set CSS variable for overlay alpha (used by daynight) -----
    overlay.style.setProperty('--night-shadow-alpha', 'rgba(15,12,10,0.65)');
  }

  // start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();