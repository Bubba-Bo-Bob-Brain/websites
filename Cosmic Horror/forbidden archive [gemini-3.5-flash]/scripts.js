/* ==========================================================================
   THE NYCTAL ARCHIVE - TERMINAL DRIVER & COGNITIVE INTERFACE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE SYSTEM ---
  const state = {
    sanity: 100,
    cognitiveLoad: 0,
    audioInitialized: false,
    starCoordinates: { theta: 33, phi: 108, depth: 8 },
    glitchInterval: null,
    isPurging: false
  };

  // --- GLYPHS FOR CORRUPTION ---
  const ELDRITCH_GLYPHS = "☠☣☤☿☽☉ℵℶℷℸΩλψΦΘ░▒▓█▀▄■┼╫╬◈◇◆▰▱▲▼◀▶";

  // --- DOM SELECTORS ---
  const cursor = document.getElementById("eldritch-cursor");
  const sanityBarFill = document.getElementById("sanity-meter-fill");
  const sanityPercentDisplay = document.getElementById("sanity-percentage");
  const sanityStatusDisplay = document.getElementById("sanity-status-text");
  const cognitiveLoadDisplay = document.getElementById("cognitive-load-value");
  const searchInput = document.getElementById("archive-search");
  const searchFeedback = document.getElementById("search-feedback-text");
  const logOutput = document.getElementById("log-output");
  const starCanvas = document.getElementById("star-chart-canvas");
  const screenFlash = document.querySelector(".glitch-screen-flash");
  const tendrilVignette = document.querySelector(".tendril-vignette");
  const archiveGrid = document.getElementById("archive-display-grid");

  // Coordinate Sliders
  const sliderTheta = document.getElementById("coord-theta");
  const sliderPhi = document.getElementById("coord-phi");
  const sliderDepth = document.getElementById("coord-depth");
  const valTheta = document.getElementById("val-theta");
  const valPhi = document.getElementById("val-phi");
  const valDepth = document.getElementById("val-depth");

  // Buttons
  const alignBtn = document.getElementById("align-stars-btn");
  const panicBtn = document.getElementById("panic-button");
  const decodeBtns = document.querySelectorAll(".decode-btn");

  // --- AUDIO SYNTH ENGINE (Web Audio API) ---
  let audioCtx = null;
  let ambientOsc = null;
  let ambientFilter = null;
  let ambientGain = null;

  function initAudio() {
    if (state.audioInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      
      // Build Sub-Etheric Drone
      ambientOsc = audioCtx.createOscillator();
      ambientFilter = audioCtx.createBiquadFilter();
      ambientGain = audioCtx.createGain();

      ambientOsc.type = "sawtooth";
      ambientOsc.frequency.setValueAtTime(45, audioCtx.currentTime); // Low resonant hum

      ambientFilter.type = "lowpass";
      ambientFilter.frequency.setValueAtTime(120, audioCtx.currentTime);
      ambientFilter.Q.setValueAtTime(8, audioCtx.currentTime);

      ambientGain.gain.setValueAtTime(0.04, audioCtx.currentTime); // Soft background presence

      ambientOsc.connect(ambientFilter);
      ambientFilter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);
      
      ambientOsc.start();
      
      // Start unstable frequency modulation loop
      modulateDrone();
      
      state.audioInitialized = true;
      writeLog("[OK] Sub-etheric audio pipeline synchronized.", "ok");
    } catch (e) {
      console.warn("Audio Context blocked or unsupported.");
    }
  }

  function modulateDrone() {
    if (!audioCtx || !state.audioInitialized) return;
    // Introduce unstable drifts in pitch and filter resonance
    const drift = Math.sin(audioCtx.currentTime * 0.5) * 5;
    ambientOsc.frequency.setValueAtTime(45 + drift, audioCtx.currentTime);
    
    const filterDrift = Math.cos(audioCtx.currentTime * 0.2) * 40;
    ambientFilter.frequency.setValueAtTime(120 + filterDrift, audioCtx.currentTime);

    setTimeout(modulateDrone, 100);
  }

  // Play a digital click when navigating/clicking interface
  function playClick(freq = 800, duration = 0.04, type = "sine") {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Quick decay envelope
    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  // Play deep synthetic error screech
  function playAnomalySound() {
    if (!audioCtx) return;
    playClick(110, 0.4, "sawtooth");
    setTimeout(() => playClick(90, 0.3, "sawtooth"), 100);
    setTimeout(() => playClick(170, 0.5, "square"), 200);
  }

  // --- TERMINAL LOGGER ---
  function writeLog(text, type = "default") {
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    
    const timestamp = new Date().toLocaleTimeString().split(" ")[0];
    entry.textContent = `[${timestamp}] ${text}`;
    
    logOutput.appendChild(entry);
    logOutput.scrollTop = logOutput.scrollHeight;

    // Cap log size
    while (logOutput.children.length > 30) {
      logOutput.removeChild(logOutput.firstChild);
    }
  }

  // --- ELDRITCH CURSOR IMPLEMENTATION ---
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Cursor Hover Effects on interactive elements
  const interactiveElements = document.querySelectorAll("button, input, [type='range'], .archive-card");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
      playClick(1200, 0.02);
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });
  });

  // --- COGNITIVE SYSTEM & SANITY METRICS ---
  function adjustSanity(amount) {
    if (state.isPurging) return;
    
    state.sanity = Math.max(0, Math.min(100, state.sanity + amount));
    state.cognitiveLoad = 100 - state.sanity;

    // Render Sanity HUD Elements
    sanityBarFill.style.width = `${state.sanity}%`;
    sanityPercentDisplay.textContent = `${Math.round(state.sanity)}%`;
    cognitiveLoadDisplay.textContent = `${state.cognitiveLoad.toFixed(2)}%`;

    // Dynamic warning texts based on cognitive deterioration
    if (state.sanity > 75) {
      sanityStatusDisplay.textContent = "COGNITIVE ARCHITECTURE STABLE";
      sanityStatusDisplay.style.color = "var(--phosphor-green)";
      tendrilVignette.style.boxShadow = "inset 0 0 40px rgba(129, 14, 156, 0.3)";
    } else if (state.sanity > 45) {
      sanityStatusDisplay.textContent = "ATTENTION DRIFTING - MEMORY FLUID";
      sanityStatusDisplay.style.color = "var(--decay-purple)";
      tendrilVignette.style.boxShadow = "inset 0 0 80px rgba(129, 14, 156, 0.6)";
    } else if (state.sanity > 15) {
      sanityStatusDisplay.textContent = "CRITICAL COGNITIVE FLOODING DETECTED";
      sanityStatusDisplay.style.color = "var(--eldritch-crimson)";
      tendrilVignette.style.boxShadow = "inset 0 0 130px rgba(255, 42, 42, 0.5), inset 0 0 60px #000";
      if (Math.random() < 0.15) triggerGlitchFlash();
    } else {
      sanityStatusDisplay.textContent = "PSYCHE DETACHED. NO RESTORATION SYSTEM DETECTED.";
      sanityStatusDisplay.style.color = "#ffffff";
      tendrilVignette.style.boxShadow = "inset 0 0 180px rgba(255, 42, 42, 0.8), inset 0 0 100px #000";
      // Force random text scrambles across the entire document
      if (Math.random() < 0.4) scrambleArchaicTexts();
    }

    // Adjust sub-etheric synth frequency dynamically based on cognitive load
    if (ambientOsc) {
      ambientOsc.frequency.setValueAtTime(45 + (state.cognitiveLoad * 0.85), audioCtx.currentTime);
    }
  }

  // Sanity degrades as user scrolls deeper into forbidden archive grids
  archiveGrid.addEventListener("scroll", () => {
    const scrollPercent = archiveGrid.scrollTop / (archiveGrid.scrollHeight - archiveGrid.clientHeight);
    // Sanity drop rate scales with depth scrolled
    const decayAmount = scrollPercent * -0.3;
    adjustSanity(decayAmount);
    
    if (Math.random() < 0.05) {
      writeLog("Depth coordinate descent registered...", "warn");
    }
  });

  // --- TEXT CORRUPTION ENGINE ---
  const corruptElements = document.querySelectorAll(".corrupt-text, .corruption-target");

  corruptElements.forEach((el) => {
    // Keep reference of pristine text to corrupt dynamically
    const originalText = el.textContent.trim();
    el.setAttribute("data-original", originalText);

    el.addEventListener("mouseenter", () => {
      initAudio();
      let iterations = 0;
      const originalArray = originalText.split("");
      
      const interval = setInterval(() => {
        el.innerHTML = originalArray
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iterations) {
              // Return scarred/slightly corrupted original text
              return Math.random() < 0.05 ? ELDRITCH_GLYPHS[Math.floor(Math.random() * ELDRITCH_GLYPHS.length)] : originalArray[index];
            }
            // Active corruption zone
            return ELDRITCH_GLYPHS[Math.floor(Math.random() * ELDRITCH_GLYPHS.length)];
          })
          .join("");

        if (iterations >= originalArray.length) {
          clearInterval(interval);
        }
        iterations += Math.ceil(originalArray.length / 15);
        
        // Soft digital rattle sound while writing
        if (Math.random() < 0.4) playClick(1800, 0.01);
      }, 30);
    });

    el.addEventListener("mouseleave", () => {
      // Return slowly to original, scarred state
      setTimeout(() => {
        el.textContent = el.getAttribute("data-original");
      }, 400);
    });
  });

  // Force global scramble on severe psychosis
  function scrambleArchaicTexts() {
    const randomCardText = corruptElements[Math.floor(Math.random() * corruptElements.length)];
    const textArr = randomCardText.textContent.split("");
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * textArr.length);
      if (textArr[idx] !== " ") textArr[idx] = ELDRITCH_GLYPHS[Math.floor(Math.random() * ELDRITCH_GLYPHS.length)];
    }
    randomCardText.textContent = textArr.join("");
  }

  // --- THE STAR CHART VISUAL ANOMALY CANVAS ---
  const ctx = starCanvas.getContext("2d");
  let starAnimationId = null;

  function resizeStarCanvas() {
    starCanvas.width = starCanvas.parentElement.clientWidth;
    starCanvas.height = 150;
  }
  resizeStarCanvas();
  window.addEventListener("resize", resizeStarCanvas);

  function drawDeadGalaxy() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    
    const centerX = starCanvas.width / 2;
    const centerY = starCanvas.height / 2;
    const time = Date.now() * 0.001;

    const thetaFactor = state.starCoordinates.theta * (Math.PI / 180);
    const phiFactor = state.starCoordinates.phi * (Math.PI / 180);
    const depthFactor = state.starCoordinates.depth;

    // Draw Event Horizon of the Dead Galaxy
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15 + Math.sin(time) * 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(129, 14, 156, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Generate orbiting dust and dead systems based on mathematical sliders
    const pointsCount = 45;
    for (let i = 0; i < pointsCount; i++) {
      const angle = (i * (360 / pointsCount) * Math.PI) / 180 + (time * 0.2);
      
      // Weird orbital math applying coordinates theta & phi to coordinates
      const orbitalRadius = (20 + (i * 1.5)) * (depthFactor * 0.15);
      const x = centerX + Math.cos(angle + thetaFactor) * orbitalRadius;
      const y = centerY + Math.sin(angle * phiFactor) * (orbitalRadius * 0.5);

      // Render star bodies
      ctx.beginPath();
      const radius = Math.random() < 0.05 ? 2.5 : 1;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      
      // Unstable phosphor fading
      if (i % 3 === 0) {
        ctx.fillStyle = "rgba(57, 255, 20, 0.85)";
      } else if (i % 7 === 0) {
        ctx.fillStyle = "rgba(255, 42, 42, 0.9)";
      } else {
        ctx.fillStyle = "rgba(110, 140, 117, 0.4)";
      }
      ctx.fill();

      // Draw faint connections between dead star networks
      if (i > 0 && i % 4 === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = "rgba(57, 255, 20, 0.04)";
        ctx.stroke();
      }
    }

    starAnimationId = requestAnimationFrame(drawDeadGalaxy);
  }
  drawDeadGalaxy();

  // --- HUD INPUTS & SLIDERS INTERACTION ---
  sliderTheta.addEventListener("input", (e) => {
    state.starCoordinates.theta = parseFloat(e.target.value);
    valTheta.textContent = state.starCoordinates.theta;
    playClick(400 + state.starCoordinates.theta, 0.01);
  });

  sliderPhi.addEventListener("input", (e) => {
    state.starCoordinates.phi = parseFloat(e.target.value);
    valPhi.textContent = state.starCoordinates.phi;
    playClick(400 + state.starCoordinates.phi, 0.01);
  });

  sliderDepth.addEventListener("input", (e) => {
    state.starCoordinates.depth = parseFloat(e.target.value);
    valDepth.textContent = `${state.starCoordinates.depth.toFixed(2)}ly`;
    playClick(300 + (state.starCoordinates.depth * 5), 0.01);
  });

  // Align Telescope trigger
  alignBtn.addEventListener("click", () => {
    initAudio();
    writeLog("[INIT] Star-Chart spatial alignment initiated...", "warn");
    playAnomalySound();
    triggerGlitchFlash();
    adjustSanity(-12);

    setTimeout(() => {
      writeLog("[WARN] Connection timed out. Source coordinates occupied by non-baryonic mass.", "err");
    }, 1200);
  });

  // --- SEARCH SYSTEM WRAPPED IN MADNESS ---
  const crypticSearchResponses = [
    "Search refused. The terms entered do not exist in this universe.",
    "Do you hear them? They are crawling through the input logs.",
    "There are no records found, but someone has logged your physical coordinates.",
    "Result found: CODE-998 [FORBIDDEN]. It is behind you.",
    "Error 404: Sanity file corrupted during lookup.",
    "System reports: Depth threshold breached. Abandoning search queries."
  ];

  searchInput.addEventListener("input", (e) => {
    initAudio();
    const query = e.target.value.trim();
    if (query.length > 0) {
      if (Math.random() < 0.15) {
        playClick(100, 0.1, "sawtooth");
        searchFeedback.textContent = crypticSearchResponses[Math.floor(Math.random() * crypticSearchResponses.length)];
        searchFeedback.style.color = "var(--eldritch-crimson)";
        adjustSanity(-1);
      } else {
        searchFeedback.textContent = `Searching: ${query.split("").reverse().join("")}...`; // Reverses text backwards
        searchFeedback.style.color = "var(--text-muted)";
      }
    } else {
      searchFeedback.textContent = "Awaiting input...";
      searchFeedback.style.color = "var(--text-muted)";
    }
  });

  // --- CARD INTERACTIVE DECODERS ---
  decodeBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      initAudio();
      playAnomalySound();
      triggerGlitchFlash();
      
      const parentCard = btn.closest(".archive-card");
      const title = parentCard.querySelector(".card-title").textContent;
      
      writeLog(`Attempting decryption protocol on: [${title}]`, "warn");
      adjustSanity(-15);

      btn.textContent = "DECRYPTION FAILED";
      btn.style.borderColor = "var(--eldritch-crimson)";
      btn.style.color = "var(--eldritch-crimson)";

      setTimeout(() => {
        writeLog("[FATAL ERROR] Cognitive dampening shield failed. Abort decode.", "err");
      }, 800);
    });
  });

  // --- GLITCH FLASH FUNCTION ---
  function triggerGlitchFlash() {
    screenFlash.style.opacity = "0.7";
    setTimeout(() => {
      screenFlash.style.opacity = "0";
    }, 150);
  }

  // --- COGNITIVE PURGE (PANIC BUTTON) ---
  panicBtn.addEventListener("click", () => {
    initAudio();
    if (state.isPurging) return;
    
    state.isPurging = true;
    writeLog("[SYSTEM] Initiating full memory dump and psychic wipe...", "err");
    playAnomalySound();

    // Trigger series of blinding digital spasms
    let flashes = 0;
    const flashInterval = setInterval(() => {
      screenFlash.style.backgroundColor = Math.random() < 0.5 ? "var(--decay-purple)" : "#ffffff";
      screenFlash.style.opacity = Math.random() < 0.8 ? "0.9" : "0.1";
      flashes++;
      
      if (flashes > 12) {
        clearInterval(flashInterval);
        screenFlash.style.opacity = "0";
        screenFlash.style.backgroundColor = "var(--eldritch-crimson)"; // Reset background color
        
        // Full System Recovery Restored
        state.sanity = 100;
        state.cognitiveLoad = 0;
        adjustSanity(0);
        state.isPurging = false;
        
        writeLog("[OK] Neural purge successful. Mind blanked. Terminal reset.", "ok");
      }
    }, 80);
  });

  // --- INITIAL LAUNCH LOGS ---
  setTimeout(() => {
    writeLog("Connecting to PROVIDENCE-6 Node...");
  }, 500);
  setTimeout(() => {
    writeLog("WARNING: System detects high concentration of cognitive hazards.", "warn");
  }, 1500);
  setTimeout(() => {
    writeLog("Ready to receive input. Watch your thoughts.", "ok");
  }, 2500);
});