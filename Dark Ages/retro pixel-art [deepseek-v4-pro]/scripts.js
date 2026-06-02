(function() {
  "use strict";

  const bellContainer = document.getElementById('bellContainer');
  const bellTower = document.getElementById('bellTower');
  const bellIndicator = document.getElementById('bellIndicator');
  const pixelCursor = document.getElementById('pixelCursor');
  const pestilenceFill = document.getElementById('pestilenceFill');
  const pestilenceValue = document.getElementById('pestilenceValue');
  const celestialBody = document.getElementById('celestialBody');
  const starsContainer = document.getElementById('starsContainer');
  const skyWindow = document.getElementById('skyWindow');
  const cyclePhase = document.getElementById('cyclePhase');
  const plagueDoctor = document.getElementById('plagueDoctor');
  const scheduleItems = document.querySelectorAll('.schedule-item');

  let pestilenceLevel = 78;
  let bellTimeout = null;
  let dayCycleTimer = null;
  let currentPhase = 0;
  const phases = [
    { name: 'DEEP NIGHT', sky: '#070b14', bodyBottom: '5px', bodyBg: '#d4d4e4', glow: '#a0a0d4', starOpacity: 1 },
    { name: 'MATINS (DAWN)', sky: '#1c1a2e', bodyBottom: '25px', bodyBg: '#f0d4a0', glow: '#d4a44a', starOpacity: 0.8 },
    { name: 'MORNING', sky: '#3a4a6b', bodyBottom: '55px', bodyBg: '#f4e4c1', glow: '#f4b41a', starOpacity: 0 },
    { name: 'HIGH NOON', sky: '#4a6b8a', bodyBottom: '80px', bodyBg: '#fff8e4', glow: '#ffd700', starOpacity: 0 },
    { name: 'AFTERNOON', sky: '#6b5a4a', bodyBottom: '60px', bodyBg: '#f4d4a0', glow: '#d4942a', starOpacity: 0 },
    { name: 'VESPERS (DUSK)', sky: '#3a2a3a', bodyBottom: '30px', bodyBg: '#e4946a', glow: '#c94a2a', starOpacity: 0.4 },
    { name: 'TWILIGHT', sky: '#1f142a', bodyBottom: '10px', bodyBg: '#c4a4c4', glow: '#a04aa0', starOpacity: 0.9 }
  ];

  function generateStars() {
    starsContainer.innerHTML = '';
    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.width = '3px';
      star.style.height = '3px';
      star.style.background = '#f4f0e4';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 70 + '%';
      star.style.boxShadow = '0 0 6px #ffffff';
      starsContainer.appendChild(star);
    }
  }
  generateStars();

  function updateCelestialPosition(phaseIndex) {
    const phase = phases[phaseIndex];
    skyWindow.style.background = `linear-gradient(180deg, ${phase.sky} 0%, #0a0a14 100%)`;
    celestialBody.style.bottom = phase.bodyBottom;
    celestialBody.style.background = `radial-gradient(circle at 30% 30%, ${phase.bodyBg}, #5a4a2a)`;
    celestialBody.style.boxShadow = `0 0 30px ${phase.glow}`;
    starsContainer.style.opacity = phase.starOpacity;
    cyclePhase.textContent = phase.name;
  }

  function advanceDayCycle() {
    currentPhase = (currentPhase + 1) % phases.length;
    updateCelestialPosition(currentPhase);
  }

  function startDayCycle() {
    if (dayCycleTimer) clearInterval(dayCycleTimer);
    updateCelestialPosition(0);
    dayCycleTimer = setInterval(advanceDayCycle, 6500);
  }
  startDayCycle();

  function ringBell(triggerElement = null) {
    if (!bellContainer) return;
    bellContainer.style.transition = 'transform 0.15s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    bellContainer.style.transform = 'rotate(18deg)';
    
    setTimeout(() => {
      bellContainer.style.transform = 'rotate(-15deg)';
    }, 150);
    
    setTimeout(() => {
      bellContainer.style.transform = 'rotate(8deg)';
    }, 300);
    
    setTimeout(() => {
      bellContainer.style.transform = 'rotate(-5deg)';
    }, 420);
    
    setTimeout(() => {
      bellContainer.style.transform = 'rotate(0deg)';
    }, 520);

    bellIndicator.style.opacity = '1';
    bellIndicator.style.transform = 'translateY(0)';
    if (bellTimeout) clearTimeout(bellTimeout);
    bellTimeout = setTimeout(() => {
      bellIndicator.style.opacity = '0';
      bellIndicator.style.transform = 'translateY(20px)';
    }, 1800);

    if (triggerElement) {
      triggerElement.style.color = '#f4b41a';
      triggerElement.style.borderColor = '#f4b41a';
      setTimeout(() => {
        triggerElement.style.color = '';
        triggerElement.style.borderColor = '';
      }, 500);
    }
  }

  if (bellTower) {
    bellTower.addEventListener('click', (e) => {
      e.stopPropagation();
      ringBell();
    });
  }

  scheduleItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      ringBell(item);
      const bellName = item.getAttribute('data-bell');
      const phaseMap = {
        matins: 1,
        lauds: 2,
        prime: 3,
        sext: 4,
        none: 5,
        vespers: 6,
        compline: 0
      };
      if (bellName && phaseMap[bellName] !== undefined) {
        currentPhase = phaseMap[bellName];
        updateCelestialPosition(currentPhase);
      }
    });
  });

  function updatePestilence() {
    const change = (Math.random() - 0.45) * 4;
    pestilenceLevel = Math.min(100, Math.max(30, pestilenceLevel + change));
    pestilenceLevel = Math.round(pestilenceLevel * 10) / 10;
    
    pestilenceFill.style.width = pestilenceLevel + '%';
    pestilenceValue.textContent = Math.floor(pestilenceLevel) + '%';
    
    if (pestilenceLevel > 85) {
      pestilenceValue.style.color = '#cf3a3a';
    } else if (pestilenceLevel > 55) {
      pestilenceValue.style.color = '#cfb53a';
    } else {
      pestilenceValue.style.color = '#6bcf3a';
    }
  }

  setInterval(updatePestilence, 3200);
  updatePestilence();

  document.addEventListener('mousemove', (e) => {
    if (pixelCursor) {
      pixelCursor.style.left = e.clientX + 'px';
      pixelCursor.style.top = e.clientY + 'px';
    }
  });

  document.addEventListener('mouseleave', () => {
    if (pixelCursor) pixelCursor.style.display = 'none';
  });
  document.addEventListener('mouseenter', () => {
    if (pixelCursor) pixelCursor.style.display = 'block';
  });

  if (plagueDoctor) {
    plagueDoctor.addEventListener('click', (e) => {
      e.stopPropagation();
      pestilenceLevel = Math.min(100, pestilenceLevel + 7);
      updatePestilence();
      const doctorMask = document.querySelector('.doctor-mask');
      if (doctorMask) {
        doctorMask.style.background = '#c4a48a';
        setTimeout(() => { doctorMask.style.background = '#e4d4b4'; }, 300);
      }
    });
  }

  const mapTiles = document.querySelectorAll('.map-tile');
  mapTiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      tile.style.filter = 'brightness(1.8)';
      setTimeout(() => { tile.style.filter = ''; }, 300);
    });
  });

  window.addEventListener('load', () => {
    document.body.style.opacity = 1;
  });

})();