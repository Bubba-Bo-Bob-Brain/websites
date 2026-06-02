// ====== TEATRO DUCALE – STAGIONE BAROCCA ======
// scripts.js – curtain, chandelier light, spotlight hover, and atmospheric details

(function () {
  'use strict';

  // ====== 1. CURTAIN REVEAL ======
  const curtain = document.getElementById('curtain-overlay');
  if (curtain) {
    // wait one frame then close
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.classList.add('closed');
        // after transition ends, hide from screen readers
        curtain.addEventListener('transitionend', function handler() {
          curtain.style.display = 'none';
          curtain.removeEventListener('transitionend', handler);
        });
      });
    });
  }

  // ====== 2. CHANDELIER LIGHT DRIFT (already in CSS, but we add a subtle random offset) ======
  const chandelier = document.querySelector('.chandelier');
  if (chandelier) {
    // add a gentle parallax on mouse move (optional baroque drama)
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      chandelier.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    });
  }

  // ====== 3. SPOTLIGHT HOVER ON EVENT CARDS (enhance existing CSS) ======
  const cards = document.querySelectorAll('.event-card');
  cards.forEach((card) => {
    const spotlight = card.querySelector('.card-spotlight');
    if (!spotlight) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(230,200,124,0.12) 0%, transparent 60%)`;
      spotlight.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      spotlight.style.background = `radial-gradient(ellipse at 30% 20%, rgba(230,200,124,0.06) 0%, transparent 60%)`;
      spotlight.style.opacity = '0.3';
    });
  });

  // ====== 4. SEATING CHART – subtle glow on royal box hover ======
  const royalBoxes = document.querySelectorAll('.box.royal');
  royalBoxes.forEach((box) => {
    box.addEventListener('mouseenter', () => {
      box.style.boxShadow = '0 0 24px rgba(230,200,124,0.5), 0 0 0 1px var(--gold-bright)';
    });
    box.addEventListener('mouseleave', () => {
      box.style.boxShadow = '0 0 8px rgba(0,0,0,0.5)';
    });
  });

  // ====== 5. TABLE ROW HOVER – enhance with a subtle flicker (optional) ======
  const tableRows = document.querySelectorAll('.schedule-table tbody tr');
  tableRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      row.style.transition = 'background 0.15s ease';
    });
  });

  // ====== 6. GRAIN OVERLAY – already in CSS, but ensure it's visible ======
  // (nothing to do, purely decorative)

  // ====== 7. CHANDELIER CANDLE FLICKER (tiny random opacity) ======
  const candles = document.querySelectorAll('.candle');
  if (candles.length) {
    function flickerCandles() {
      candles.forEach((candle) => {
        const flicker = 0.75 + Math.random() * 0.25;
        candle.style.opacity = flicker;
        // subtle glow change
        const glow = 12 + Math.random() * 10;
        candle.style.boxShadow = `0 0 ${glow}px #fae3a0`;
      });
      requestAnimationFrame(() => {
        setTimeout(flickerCandles, 300 + Math.random() * 400);
      });
    }
    flickerCandles();
  }

  // ====== 8. (optional) BAROQUE FLOURISH – add a class to body after load ======
  document.body.classList.add('baroque-ready');

  // ====== 9. LIGHT SPOTS – enhance with slight random drift via CSS custom props ======
  const spots = document.querySelectorAll('.light-spot');
  spots.forEach((spot, index) => {
    const duration = 6 + index * 2;
    const delay = index * 2.5;
    spot.style.setProperty('--drift-duration', `${duration}s`);
    spot.style.setProperty('--drift-delay', `${delay}s`);
    // we already have keyframes, but we can add a tiny extra random offset
    const xOff = (Math.random() - 0.5) * 20;
    const yOff = (Math.random() - 0.5) * 20;
    spot.style.setProperty('--x-off', `${xOff}px`);
    spot.style.setProperty('--y-off', `${yOff}px`);
  });

  // ====== 10. RESPONSIVE: adjust chandelier scale on small screens ======
  function adjustChandelier() {
    if (!chandelier) return;
    const width = window.innerWidth;
    if (width < 640) {
      chandelier.style.transform = `translateX(-50%) scale(0.6)`;
    } else if (width < 1024) {
      chandelier.style.transform = `translateX(-50%) scale(0.8)`;
    } else {
      chandelier.style.transform = `translateX(-50%) scale(1)`;
    }
  }
  window.addEventListener('resize', adjustChandelier);
  adjustChandelier();

  // ====== 11. HERO CROWN subtle pulse ======
  const crown = document.querySelector('.gilded-crown');
  if (crown) {
    setInterval(() => {
      crown.style.transition = 'transform 2s ease, filter 2s ease';
      crown.style.transform = 'scale(1.02)';
      crown.style.filter = 'drop-shadow(0 0 30px rgba(230,200,124,0.4))';
      setTimeout(() => {
        crown.style.transform = 'scale(1)';
        crown.style.filter = 'drop-shadow(0 0 20px rgba(230,200,124,0.2))';
      }, 2000);
    }, 5000);
  }

})();