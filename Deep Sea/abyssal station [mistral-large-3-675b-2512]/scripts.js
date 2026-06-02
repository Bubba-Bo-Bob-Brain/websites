// ===== DEEP-SEA DASHBOARD SIMULATOR =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM ELEMENTS =====
  const depthSlider = document.getElementById('depth-slider');
  const depthValue = document.getElementById('depth-value');
  const pressureValue = document.getElementById('pressure-value');
  const pressureNeedle = document.getElementById('pressure-needle');
  const temperatureValue = document.getElementById('temperature-value');
  const temperatureNeedle = document.getElementById('temperature-needle');
  const integrityValue = document.getElementById('integrity-value');
  const integrityFill = document.getElementById('integrity-fill');
  const klaxonBar = document.getElementById('klaxon-bar');
  const pingButton = document.getElementById('ping-button');
  const sonarDisplay = document.getElementById('sonar-display');
  const sonarPing = document.getElementById('sonar-ping');
  const sonarRange = document.getElementById('sonar-range');
  const faunaList = document.getElementById('fauna-list');
  const faunaCount = document.getElementById('fauna-count');
  const spectrographCanvas = document.getElementById('spectrograph-canvas');
  const spectrographCtx = spectrographCanvas.getContext('2d');
  const logsContainer = document.getElementById('logs-container');
  const pressureRelease = document.getElementById('pressure-release');
  const timeValue = document.getElementById('time-value');

  // ===== STATE =====
  let hullIntegrity = 98;
  let detectedFauna = [];
  let systemLogs = [];
  let isEmergency = false;
  let bioluminescentParticles = [];
  let spectrographData = Array(100).fill(0).map(() => Math.random() * 50 + 200);

  // ===== INITIALIZATION =====
  initBioluminescentParticles();
  initSpectrograph();
  updateDashboard();
  startClock();
  window.addEventListener('resize', resizeCanvas);

  // ===== EVENT LISTENERS =====
  depthSlider.addEventListener('input', (e) => {
    updateDepth(parseInt(e.target.value));
  });

  pingButton.addEventListener('click', () => {
    triggerSonarPing();
    detectFauna();
  });

  pressureRelease.addEventListener('click', () => {
    releasePressure();
  });

  // ===== DEPTH SIMULATION =====
  function updateDepth(depth) {
    depthValue.textContent = depth.toLocaleString();
    const pressure = (depth * 0.01).toFixed(1);
    const temperature = Math.max(-2, 10 - depth * 0.002).toFixed(1);

    pressureValue.textContent = pressure;
    temperatureValue.textContent = temperature;

    // Update needle rotation
    const pressureAngle = (pressure / 110) * 240 - 120; // 110 ATM max
    const tempAngle = (temperature / 10) * 180 - 90; // -2°C to 8°C
    pressureNeedle.style.transform = `rotate(${pressureAngle}deg)`;
    temperatureNeedle.style.transform = `rotate(${tempAngle}deg)`;

    // Update hull integrity (degrades under pressure)
    const integrityLoss = Math.min(10, depth / 1000);
    hullIntegrity = Math.max(0, 100 - integrityLoss);
    integrityValue.textContent = `${Math.round(hullIntegrity)}%`;
    integrityFill.style.width = `${hullIntegrity}%`;

    // Update warning klaxon (activates below 50% integrity)
    if (hullIntegrity < 50) {
      klaxonBar.style.background = `linear-gradient(90deg, transparent, ${getComputedStyle(document.documentElement).getPropertyValue('--warning-color')}, transparent)`;
      klaxonBar.style.animation = 'klaxonPulse 1s infinite';
    } else {
      klaxonBar.style.background = '';
      klaxonBar.style.animation = '';
    }

    // Update ambient color based on depth
    const hue = 220 - (depth / 11000) * 40; // Shift from blue to teal
    const saturation = 80 - (depth / 11000) * 30; // Reduce saturation at depth
    document.documentElement.style.setProperty('--depth-hue', hue);
    document.documentElement.style.setProperty('--depth-saturation', `${saturation}%`);
  }

  // ===== SONAR PING =====
  function triggerSonarPing() {
    sonarPing.style.animation = 'none';
    void sonarPing.offsetWidth; // Trigger reflow
    sonarPing.style.animation = 'sonarPing 3s infinite';

    // Add log entry
    addLogEntry('Sonar ping initiated', 'sonar');
  }

  // ===== FAUNA DETECTION =====
  function detectFauna() {
    const faunaTypes = [
      { name: 'Vampire Squid', wavelength: 480, depthRange: [500, 1500] },
      { name: 'Firefly Squid', wavelength: 470, depthRange: [200, 600] },
      { name: 'Crystal Jelly', wavelength: 500, depthRange: [0, 200] },
      { name: 'Anglerfish', wavelength: 450, depthRange: [1000, 3000] },
      { name: 'Gulper Eel', wavelength: 490, depthRange: [1500, 4000] },
      { name: 'Deepstaria Enigmatica', wavelength: 460, depthRange: [600, 2000] },
      { name: 'Atolla Jellyfish', wavelength: 485, depthRange: [500, 5000] },
      { name: 'Black Dragonfish', wavelength: 700, depthRange: [1000, 6000] }
    ];

    const currentDepth = parseInt(depthValue.textContent.replace(/,/g, ''));
    const detected = faunaTypes.filter(fauna =>
      currentDepth >= fauna.depthRange[0] && currentDepth <= fauna.depthRange[1]
    );

    detectedFauna = [...new Set([...detectedFauna, ...detected])]; // Avoid duplicates
    faunaCount.textContent = detectedFauna.length;

    // Update fauna list
    faunaList.innerHTML = '';
    detectedFauna.forEach(fauna => {
      const item = document.createElement('div');
      item.className = 'fauna-item';
      item.innerHTML = `
        <div>
          <span>${fauna.name}</span>
          <span style="color: var(--bioluminescent-glow); font-family: var(--font-mono);">${fauna.wavelength}nm</span>
        </div>
      `;
      faunaList.appendChild(item);
    });

    // Update spectrograph
    spectrographData = detectedFauna.map(fauna => fauna.wavelength);
    if (spectrographData.length === 0) spectrographData = [480];

    // Add log entry
    if (detected.length > 0) {
      addLogEntry(`Detected ${detected.length} bioluminescent fauna`, 'sonar');
    }
  }

  // ===== HULL INTEGRITY =====
  function releasePressure() {
    if (hullIntegrity < 50) {
      hullIntegrity = Math.min(100, hullIntegrity + 30);
      integrityValue.textContent = `${Math.round(hullIntegrity)}%`;
      integrityFill.style.width = `${hullIntegrity}%`;
      integrityFill.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
      isEmergency = false;
      pressureRelease.style.background = '#ff0040';

      addLogEntry('Pressure release successful', 'alerts');
    }
  }

  // Simulate hull integrity degradation over time
  setInterval(() => {
    if (hullIntegrity > 0 && !isEmergency) {
      const pressure = parseFloat(pressureValue.textContent);
      const degradation = pressure > 50 ? 0.5 : 0.1;
      hullIntegrity = Math.max(0, hullIntegrity - degradation);
      integrityValue.textContent = `${Math.round(hullIntegrity)}%`;
      integrityFill.style.width = `${hullIntegrity}%`;

      if (hullIntegrity < 20) {
        integrityFill.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
        isEmergency = true;
        pressureRelease.style.background = '#ff0000';
        addLogEntry('CRITICAL HULL FAILURE IMMINENT', 'alerts');
      }
    }
  }, 5000);

  // ===== SYSTEM LOGS =====
  function addLogEntry(message, type = 'all') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type === 'alerts' ? 'warning' : ''}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logsContainer.prepend(entry);

    // Limit logs to 20 entries
    if (logsContainer.children.length > 20) {
      logsContainer.removeChild(logsContainer.lastChild);
    }

    // Store log
    systemLogs.unshift({
      time: new Date().toLocaleTimeString(),
      message,
      type
    });
  }

  // Log filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      logsContainer.innerHTML = '';
      systemLogs
        .filter(log => filter === 'all' || log.type === filter)
        .forEach(log => {
          const entry = document.createElement('div');
          entry.className = `log-entry ${log.type === 'alerts' ? 'warning' : ''}`;
          entry.textContent = `[${log.time}] ${log.time}`;
          logsContainer.appendChild(entry);
        });
    });
  });

  // ===== CLOCK =====
  function startClock() {
    const startTime = Date.now();
    setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      timeValue.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

  // ===== BIOLUMINESCENT PARTICLES =====
  function initBioluminescentParticles() {
    const canvas = document.getElementById('bioluminescent-particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    for (let i = 0; i < 150; i++) {
      bioluminescentParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        glow: Math.random() * 30 + 20,
        hue: Math.random() * 30 + 180 // Blue to teal
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bioluminescentParticles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 1)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = particle.glow;
        ctx.shadowColor = `hsla(${particle.hue}, 100%, 70%, 0.5)`;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  function resizeCanvas() {
    const canvas = document.getElementById('bioluminescent-particles');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ===== SPECTROGRAPH =====
  function initSpectrograph() {
    spectrographCanvas.width = spectrographCanvas.clientWidth;
    spectrographCanvas.height = spectrographCanvas.clientHeight;
    animateSpectrograph();
  }

  function animateSpectrograph() {
    spectrographCtx.clearRect(0, 0, spectrographCanvas.width, spectrographCanvas.height);

    // Simulate spectrum data
    spectrographData = spectrographData.map(value =>
      value + (Math.random() - 0.5) * 5
    );

    const maxValue = Math.max(...spectrographData);
    const barWidth = spectrographCanvas.width / spectrographData.length;

    spectrographData.forEach((value, i) => {
      const barHeight = (value / maxValue) * spectrographCanvas.height;
      const hue = 180 + (value - 450) * 2; // Blue to teal
      spectrographCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      spectrographCtx.fillRect(
        i * barWidth,
        spectrographCanvas.height - barHeight,
        barWidth - 1,
        barHeight
      );

      // Glow effect
      spectrographCtx.shadowBlur = 10;
      spectrographCtx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;
    });

    requestAnimationFrame(animateSpectrograph);
  }

  // ===== UPDATE DASHBOARD =====
  function updateDashboard() {
    const initialDepth = parseInt(depthSlider.value);
    updateDepth(initialDepth);
    detectFauna();
    addLogEntry('Dashboard initialized', 'all');
  }
});