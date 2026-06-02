// ============================================================
// scripts.js – 1960s Space Age Tours
// ============================================================
// Parallax planet overlay, live departure board, and
// atomic-era micro-interactions.
// ============================================================

(function () {
  'use strict';

  // ---------- 1. PARALLAX PLANET OVERLAY ----------
  // Create a set of floating celestial bodies that move with the scroll.
  const parallaxContainer = document.querySelector('.parallax-planets');
  if (!parallaxContainer) return;

  // Build planets (retro circles with rings / starburst hints)
  const planetCount = 8;
  const planetData = [
    { size: 90, color: 'var(--coral)', top: 8, left: 5, opacity: 0.15, ring: true },
    { size: 60, color: 'var(--turquoise)', top: 40, left: 85, opacity: 0.12, ring: false },
    { size: 120, color: '#f4a460', top: 70, left: 15, opacity: 0.08, ring: true },
    { size: 40, color: '#ffd700', top: 15, left: 70, opacity: 0.2, ring: false },
    { size: 80, color: '#e07a5f', top: 55, left: 60, opacity: 0.1, ring: true },
    { size: 50, color: '#81b29a', top: 85, left: 40, opacity: 0.12, ring: false },
    { size: 100, color: '#3d405b', top: 25, left: 45, opacity: 0.06, ring: true },
    { size: 35, color: 'var(--cream)', top: 65, left: 25, opacity: 0.15, ring: false },
  ];

  planetData.forEach((data) => {
    const planet = document.createElement('div');
    planet.className = 'parallax-planet';
    planet.style.cssText = `
      position: absolute;
      width: ${data.size}px;
      height: ${data.size}px;
      top: ${data.top}%;
      left: ${data.left}%;
      background: ${data.color};
      border-radius: 50%;
      opacity: ${data.opacity};
      pointer-events: none;
      z-index: 0;
      mix-blend-mode: screen;
      box-shadow: 0 0 60px ${data.color};
      transition: transform 0.1s linear;
    `;

    // Add ring decoration for some planets
    if (data.ring) {
      const ring = document.createElement('div');
      ring.style.cssText = `
        position: absolute;
        width: 140%;
        height: 20%;
        top: 40%;
        left: -20%;
        border: 2px solid ${data.color};
        border-radius: 50%;
        opacity: 0.3;
        transform: rotate(-10deg);
      `;
      planet.appendChild(ring);
    }

    // Small dot (moon / starburst)
    const moon = document.createElement('div');
    moon.style.cssText = `
      position: absolute;
      width: 12px;
      height: 12px;
      background: var(--cream);
      border-radius: 50%;
      top: 15%;
      right: 10%;
      opacity: 0.3;
    `;
    planet.appendChild(moon);

    parallaxContainer.appendChild(planet);
  });

  // Parallax scroll effect – move planets at different speeds
  let scrollY = 0;
  let ticking = false;

  function updateParallax() {
    scrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const planets = document.querySelectorAll('.parallax-planet');
        planets.forEach((planet, index) => {
          const speed = 0.05 + (index % 5) * 0.02;
          const yOffset = scrollY * speed;
          const xOffset = scrollY * (0.03 + (index % 3) * 0.01);
          planet.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  // Initial position
  updateParallax();

  // ---------- 2. LIVE DEPARTURE BOARD ----------
  // Update the "departure" times to show a running clock,
  // and randomly flip statuses for atmosphere.

  const boardRows = document.querySelectorAll('.board-row:not(.board-header)');
  if (boardRows.length > 0) {
    // Store original departure times (GMT strings) for each row
    const originalTimes = [];
    boardRows.forEach((row) => {
      const cell = row.querySelector('.cell.depart');
      if (cell) originalTimes.push(cell.textContent.trim());
      else originalTimes.push('');
    });

    // Update times every 30 seconds to simulate a live board
    function updateBoardClock() {
      const now = new Date();
      // Round to nearest minute for stable display
      const minutes = now.getUTCMinutes();
      const hours = now.getUTCHours();
      const displayTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} GMT`;

      boardRows.forEach((row, index) => {
        const cell = row.querySelector('.cell.depart');
        if (cell) {
          // Keep original time structure but update minutes to show "live" feel
          // We preserve the original hour but show current minutes for a dynamic board
          const orig = originalTimes[index] || '12:00 GMT';
          const origHour = orig.match(/(\d{2}):\d{2}/);
          if (origHour) {
            // Use original hour, but current minutes (rotates every 30s)
            const newMin = String(minutes).padStart(2, '0');
            cell.textContent = `${origHour[1]}:${newMin} GMT`;
          }
        }
      });
    }

    // Update every 30 seconds
    setInterval(updateBoardClock, 30000);
    // Initial call
    updateBoardClock();

    // Random status flip every 12 seconds for one random row
    setInterval(() => {
      if (boardRows.length === 0) return;
      const randomIndex = Math.floor(Math.random() * boardRows.length);
      const row = boardRows[randomIndex];
      const statusCell = row.querySelector('.cell.status');
      if (!statusCell) return;

      const statuses = ['ON TIME', 'BOARDING', 'DELAYED', 'GATE CLOSED'];
      // Pick a status that is not the current one
      let newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      if (newStatus === statusCell.textContent.trim()) {
        newStatus = statuses[(Math.floor(Math.random() * statuses.length) + 1) % statuses.length];
      }

      statusCell.textContent = newStatus;
      // Update class for color
      statusCell.className = 'cell status';
      if (newStatus === 'ON TIME' || newStatus === 'BOARDING') {
        statusCell.classList.add('go');
      } else if (newStatus === 'DELAYED' || newStatus === 'GATE CLOSED') {
        statusCell.classList.add('warn');
      }
    }, 12000);
  }

  // ---------- 3. STARBURST GLOW MICRO-INTERACTION ----------
  // On hover, add a subtle pulse to the hero starburst
  const starburstSVG = document.querySelector('.starburst-svg');
  if (starburstSVG) {
    starburstSVG.addEventListener('mouseenter', () => {
      starburstSVG.style.transition = 'filter 0.3s ease';
      starburstSVG.style.filter = 'drop-shadow(0 0 40px var(--starburst-glow)) brightness(1.2)';
    });
    starburstSVG.addEventListener('mouseleave', () => {
      starburstSVG.style.filter = 'drop-shadow(0 0 20px var(--starburst-glow))';
    });
  }

  // ---------- 4. LUGGAGE TAG HOVER EFFECT ----------
  // Add a slight rotation and shadow lift to destination cards
  const cards = document.querySelectorAll('.destination-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease';
    });
  });

  // ---------- 5. BOOKING FORM VALIDATION (simple) ----------
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const destination = document.getElementById('destination');
      const passengers = document.getElementById('passengers');
      if (!destination || !passengers) return;

      // Simple atomic-age alert
      const msg = `☄️ RESERVATION CONFIRMED ☄️\n\nDestination: ${destination.options[destination.selectedIndex].text}\nPassengers: ${passengers.value}\n\n“Your ticket to the stars is booked!”`;
      alert(msg);
    });
  }

  // ---------- 6. DEPARTURE BOARD HEADER GLOW (cosmetic) ----------
  const boardTitle = document.querySelector('.board-title');
  if (boardTitle) {
    setInterval(() => {
      const glow = Math.sin(Date.now() / 800) * 0.3 + 0.7;
      boardTitle.style.textShadow = `0 0 ${20 + glow * 20}px var(--coral)`;
    }, 100);
  }

})();