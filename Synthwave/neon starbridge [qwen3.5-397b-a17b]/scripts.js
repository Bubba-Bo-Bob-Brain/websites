/* V-88 STARBRIDGE CONSOLE SCRIPTS */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- UTILITIES ---
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
  
  // --- 1. SYSTEM CLOCK ---
  const updateClock = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
    const clockElement = document.getElementById('system-clock');
    if (clockElement) clockElement.textContent = timeString;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // --- 2. DATA SIMULATION (Nav & Velocity) ---
  const navX = document.getElementById('nav-x');
  const navY = document.getElementById('nav-y');
  const navZ = document.getElementById('nav-z');
  const velDisplay = document.getElementById('velocity-display');
  const distDisplay = document.getElementById('distance-display');
  
  let distance = 1240.5;

  setInterval(() => {
    if (navX && navY && navZ) {
      // Randomize Coordinates
      navX.textContent = randomFloat(-900, 900);
      navY.textContent = randomFloat(-900, 900);
      navZ.textContent = randomFloat(-900, 900);
    }
    
    if (velDisplay) {
      // Increment Velocity slightly
      velDisplay.textContent = randomFloat(800, 950);
    }

    if (distDisplay) {
      // Increment Distance
      distance += 0.1;
      distDisplay.textContent = distance.toFixed(1);
    }
  }, 2000);

  // --- 3. SHIELD INTEGRITY ANIMATION ---
  const shieldFill = document.querySelector('.shield-fill');
  const shieldPercent = document.getElementById('shield-percent');
  let integrity = 100;

  setInterval(() => {
    if (!shieldFill || !shieldPercent) return;

    // Simulate damage/recharge fluctuation
    const change = randomInt(-5, 3);
    integrity += change;
    if (integrity > 100) integrity = 100;
    if (integrity < 20) integrity = 20;

    // Update Text
    shieldPercent.textContent = integrity;

    // Update SVG Circle (Circumference ~251.2 for r=40)
    const offset = 251.2 - (251.2 * integrity) / 100;
    shieldFill.style.strokeDashoffset = offset;

    // Color change on low health
    if (integrity < 40) {
      shieldFill.style.stroke = '#ff0000'; // Red
    } else {
      shieldFill.style.stroke = '#00f3ff'; // Cyan
    }
  }, 1500);

  // --- 4. WEAPONS TARGETING SYSTEM ---
  const reticle = document.querySelector('.targeting-reticle');
  const lockIndicator = document.getElementById('target-lock');
  const weaponsReady = document.getElementById('weapons-ready');
  
  if (reticle && lockIndicator && weaponsReady) {
    let isLocked = false;

    reticle.addEventListener('click', () => {
      if (isLocked) {
        // Unlock
        isLocked = false;
        lockIndicator.textContent = "SEARCHING...";
        lockIndicator.style.color = "var(--neon-yellow)";
        const circle = reticle.querySelector('.reticle-circle');
        if (circle) circle.style.borderColor = "var(--neon-pink)";
      } else {
        // Locking sequence
        lockIndicator.textContent = "LOCKING...";
        setTimeout(() => {
          isLocked = true;
          lockIndicator.textContent = "LOCKED";
          lockIndicator.style.color = "var(--neon-cyan)";
          const circle = reticle.querySelector('.reticle-circle');
          if (circle) circle.style.borderColor = "var(--neon-cyan)";
          
          // Flash effect
          weaponsReady.style.backgroundColor = "var(--neon-pink)";
          setTimeout(() => {
            weaponsReady.style.backgroundColor = "var(--neon-cyan)";
          }, 200);
        }, 1000);
      }
    });
  }

  // --- 5. AUDIO VISUALIZER ---
  const bars = document.querySelectorAll('.frequency-display .bar');
  if (bars.length > 0) {
    setInterval(() => {
      bars.forEach(bar => {
        const h = randomInt(10, 100);
        bar.style.setProperty('--height', `${h}%`);
      });
    }, 150);
  }

  // --- 6. COMMS LOG SIMULATION ---
  const commsLog = document.getElementById('comms-log');
  if (commsLog) {
    const messages = [
      "> SCANNING FREQUENCIES...",
      "> INCOMING TRANSMISSION...",
      "> SECTOR 7 CLEAR",
      "> ANOMALY DETECTED",
      "> REROUTING POWER...",
      "> GRID STABLE",
      "> APPROACHING NEBULA"
    ];

    setInterval(() => {
      const p = document.createElement('p');
      p.textContent = messages[randomInt(0, messages.length - 1)];
      commsLog.appendChild(p);
      if (commsLog.children.length > 4) {
        commsLog.removeChild(commsLog.firstChild);
      }
    }, 3000);
  }

  // --- 7. PARALLAX EFFECT (Mouse Movement) ---
  document.addEventListener('mousemove', (e) => {
    const grid = document.getElementById('grid-floor');
    const stars = document.getElementById('starfield');
    
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    // Move grid slightly opposite to mouse
    if (grid) {
      grid.style.transform = `rotateX(60deg) translateX(${x * 0.5}px) translateY(${y * 0.5}px)`;
    }
    
    // Move stars slightly more for depth
    if (stars) {
      stars.style.transform = `translateX(${x * 2}px) translateY(${y * 2}px)`;
    }
  });

});