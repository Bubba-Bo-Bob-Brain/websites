// solar·pedia – collaborative wiki scripts
// photosynthesis loader, sunlight meter, interactive sidebar, and grain overlay

(function () {
  "use strict";

  // --- 1. Photosynthesis loader ---
  const loader = document.createElement('div');
  loader.className = 'loader-overlay';
  loader.innerHTML = `
    <div class="leaf-loader">
      <div class="leaf-spinner"></div>
      <p class="loader-text">photosynthesizing …</p>
    </div>
  `;
  document.body.appendChild(loader);

  // simulate loading delay (1.5–2.5s)
  const loadTime = 1500 + Math.random() * 1000;
  setTimeout(() => {
    loader.classList.add('loader-fade');
    setTimeout(() => loader.remove(), 600);
  }, loadTime);

  // ---- sunlight meter ----
  const meterFill = document.getElementById('meterFill');
  const meterLabel = document.getElementById('meterLabel');
  if (meterFill && meterLabel) {
    const intensities = [
      { min: 0, max: 15, label: 'night' },
      { min: 15, max: 30, label: 'dawn' },
      { min: 30, max: 50, label: 'morning' },
      { min: 50, max: 70, label: 'noon' },
      { min: 70, max: 85, label: 'afternoon' },
      { min: 85, max: 100, label: 'golden hour' },
    ];

    function updateMeter() {
      // simulate slight fluctuation + time of day
      const hour = new Date().getHours();
      let base = 0;
      if (hour >= 6 && hour < 10) base = 30 + Math.random() * 20;
      else if (hour >= 10 && hour < 14) base = 55 + Math.random() * 25;
      else if (hour >= 14 && hour < 18) base = 40 + Math.random() * 30;
      else if (hour >= 18 && hour < 20) base = 60 + Math.random() * 20;
      else base = 10 + Math.random() * 15;

      // clamp
      const val = Math.min(100, Math.max(0, base));
      meterFill.style.width = val + '%';

      // label
      const found = intensities.find(
        (r) => val >= r.min && val < r.max
      );
      meterLabel.textContent = found ? found.label : 'noon';

      // set CSS custom property for palette shift
      const sunLevel = val / 100;
      document.documentElement.style.setProperty('--sun-level', sunLevel);
    }

    updateMeter();
    setInterval(updateMeter, 8000); // refresh every 8s

    // also update on page visibility (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateMeter();
    });
  }

  // --- 2. sidebar active link highlight ---
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('section[id], article[id], header[id], footer[id]');

  function updateActiveLink() {
    let currentId = '';
    const scrollY = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();

  // --- 3. card hover vine decoration (micro interaction) ---
  const cards = document.querySelectorAll('.wiki-card');
  cards.forEach((card) => {
    const vine = document.createElement('div');
    vine.className = 'card-vine-hover';
    vine.setAttribute('aria-hidden', 'true');
    card.appendChild(vine);

    card.addEventListener('mouseenter', () => {
      vine.style.opacity = '0.6';
      vine.style.transform = 'scaleY(1)';
    });
    card.addEventListener('mouseleave', () => {
      vine.style.opacity = '0';
      vine.style.transform = 'scaleY(0.6)';
    });
  });

  // --- 4. seed bank interactive hover (micro) ---
  const seedItems = document.querySelectorAll('.seed-item');
  seedItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const emoji = item.querySelector('.seed-emoji');
      if (emoji) {
        emoji.style.transform = 'scale(1.4)';
        emoji.style.transition = 'transform 0.2s ease';
      }
    });
    item.addEventListener('mouseleave', () => {
      const emoji = item.querySelector('.seed-emoji');
      if (emoji) {
        emoji.style.transform = 'scale(1)';
      }
    });
  });

  // --- 5. plant-fiber texture noise (CSS already has grain, but we add subtle parallax) ---
  const grain = document.querySelector('.global-grain');
  if (grain) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 6 - 3;
      const y = (e.clientY / window.innerHeight) * 6 - 3;
      grain.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // --- 6. smooth scroll for internal links (progressive enhancement) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update url hash without jump
        history.pushState(null, '', href);
      }
    });
  });

  // --- 7. photosynthesis loader style injection (dynamic) ---
  const loaderStyle = document.createElement('style');
  loaderStyle.textContent = `
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: #e4edd6;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }
    .loader-overlay.loader-fade {
      opacity: 0;
      visibility: hidden;
    }
    .leaf-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
    }
    .leaf-spinner {
      width: 64px;
      height: 64px;
      border-radius: 50% 0 50% 0;
      background: linear-gradient(145deg, #8bc34a, #558b2f);
      animation: leafSpin 2s ease-in-out infinite, pulseGlow 2.8s ease-in-out infinite;
      box-shadow: 0 0 0 12px rgba(120, 180, 60, 0.08), 0 0 0 24px rgba(120, 180, 60, 0.03);
    }
    @keyframes leafSpin {
      0% { transform: rotate(0deg) scale(1); border-radius: 50% 0 50% 0; }
      50% { transform: rotate(180deg) scale(1.06); border-radius: 0 50% 0 50%; }
      100% { transform: rotate(360deg) scale(1); border-radius: 50% 0 50% 0; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 12px rgba(100, 160, 50, 0.06), 0 0 0 24px rgba(100, 160, 50, 0.02); }
      50% { box-shadow: 0 0 0 20px rgba(100, 160, 50, 0.15), 0 0 0 36px rgba(100, 160, 50, 0.05); }
    }
    .loader-text {
      font-family: 'Gloock', 'Times New Roman', serif;
      font-size: 1rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #3a5a2a;
      opacity: 0.7;
      animation: pulseText 2.2s ease-in-out infinite;
    }
    @keyframes pulseText {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    /* card vine hover effect */
    .card-vine-hover {
      position: absolute;
      right: 0.8rem;
      top: 0.5rem;
      bottom: 0.5rem;
      width: 2px;
      background: linear-gradient(to bottom, transparent, #8aaa6a, transparent);
      opacity: 0;
      transform: scaleY(0.6);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    }
    /* grain overlay base */
    .global-grain {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.045;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 300px 300px;
      mix-blend-mode: multiply;
      transition: transform 0.1s ease-out;
    }
    /* sunlight meter dynamic label */
    .meter-label {
      transition: color 0.4s ease;
    }
  `;
  document.head.appendChild(loaderStyle);

  // --- 8. optional: add a small 'rewilding' counter to footer (playful) ---
  const footer = document.querySelector('.wiki-footer');
  if (footer) {
    const counter = document.createElement('span');
    counter.className = 'rewild-counter';
    counter.style.marginLeft = '1rem';
    counter.style.fontSize = '0.75rem';
    counter.style.opacity = '0.5';
    // random species count
    const species = Math.floor(800 + Math.random() * 400);
    counter.textContent = `🌿 ${species} rewilded species documented`;
    footer.appendChild(counter);
  }

  // --- 9. accessibility: announce loader removal for screen readers ---
  const observer = new MutationObserver(() => {
    if (!document.querySelector('.loader-overlay')) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      announcer.textContent = 'Page loaded successfully.';
      document.body.appendChild(announcer);
      setTimeout(() => announcer.remove(), 3000);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: false });

  // --- 10. handle missing meter gracefully ---
  if (!meterFill || !meterLabel) {
    console.warn('solar·pedia: sunlight meter elements not found.');
  }
})();