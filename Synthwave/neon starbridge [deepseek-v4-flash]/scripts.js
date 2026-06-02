/**
 * STEP 3 – BRIDGE CONSOLE SCRIPTS
 * Synthwave starship interface: animated comms waveform,
 * target lock state machine, drifting coordinates, shield pulse.
 */
(function () {
  "use strict";

  // ---- DOM refs ----
  const navX = document.getElementById("nav-x");
  const navY = document.getElementById("nav-y");
  const navZ = document.getElementById("nav-z");
  const shieldValue = document.getElementById("shield-value");
  const shieldPoly = document.querySelector("#shield-svg polygon");
  const targetLock = document.getElementById("target-lock");
  const canvas = document.getElementById("wave-canvas");
  const ctx = canvas.getContext("2d");

  // ---- state ----
  let driftFrame = 0;
  let targetState = 0; // 0: acquiring, 1: locked, 2: tracking
  const targetPhrases = ["ACQUIRING", "LOCKED", "TRACKING"];
  let targetTimer = 0;

  // ---- init canvas size ----
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * window.devicePixelRatio || 180;
      canvas.height = rect.height * window.devicePixelRatio || 60;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    } else {
      canvas.width = 180;
      canvas.height = 60;
    }
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ---- drift coordinates ----
  function updateCoords() {
    driftFrame++;
    const t = driftFrame * 0.008;
    // gentle sine modulation around base values
    const baseX = 3.742;
    const baseY = -1.209;
    const baseZ = 8.635;
    const dx = Math.sin(t * 0.7 + 1.2) * 0.012;
    const dy = Math.cos(t * 0.5 + 0.8) * 0.008;
    const dz = Math.sin(t * 0.9 + 2.1) * 0.015;
    const sign = (v) => (v >= 0 ? "+" : "");
    navX.textContent = sign(baseX + dx) + (baseX + dx).toFixed(3);
    navY.textContent = sign(baseY + dy) + (baseY + dy).toFixed(3);
    navZ.textContent = sign(baseZ + dz) + (baseZ + dz).toFixed(3);
  }

  // ---- shield value & ring animation ----
  function updateShield() {
    // base 84% with tiny fluctuation
    const base = 84;
    const ripple = Math.sin(driftFrame * 0.03) * 0.6;
    const val = Math.min(100, Math.max(10, base + ripple));
    shieldValue.textContent = Math.round(val) + "%";
    // map dashoffset: 220 is full, 40 is 84% – animate smoothly
    const maxDash = 220;
    const offset = maxDash * (1 - val / 100);
    if (shieldPoly) {
      shieldPoly.setAttribute("stroke-dashoffset", offset.toFixed(1));
    }
  }

  // ---- target lock state machine ----
  function updateTargetLock() {
    targetTimer++;
    if (targetTimer > 80) {
      targetTimer = 0;
      targetState = (targetState + 1) % targetPhrases.length;
    }
    targetLock.textContent = targetPhrases[targetState];
    // add a subtle blink effect when acquiring
    if (targetState === 0) {
      targetLock.style.opacity = 0.6 + 0.4 * Math.sin(driftFrame * 0.12);
    } else {
      targetLock.style.opacity = 1;
    }
  }

  // ---- comms waveform ----
  function drawWaveform() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // neon cyan with glow
    ctx.strokeStyle = "#00e0ff";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#00e0ff";
    ctx.shadowBlur = 6;
    ctx.beginPath();

    const centerY = h / 2;
    const amp = h * 0.38;
    const freq = 0.025 + 0.005 * Math.sin(driftFrame * 0.02);
    const speed = driftFrame * 0.06;

    for (let x = 0; x < w; x++) {
      // mix of sine waves for synthwave feel
      const t = x * freq + speed;
      const wave1 = Math.sin(t * 1.8) * 0.7;
      const wave2 = Math.sin(t * 3.2 + 1.3) * 0.3;
      const wave3 = Math.sin(t * 7.1 + 0.7) * 0.15;
      const y = centerY + (wave1 + wave2 + wave3) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // second subtle layer (pink, lower opacity)
    ctx.strokeStyle = "#ff2d95";
    ctx.lineWidth = 1;
    ctx.shadowColor = "#ff2d95";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = x * freq * 0.9 + speed * 1.1;
      const wave1 = Math.sin(t * 2.2 + 0.5) * 0.5;
      const wave2 = Math.sin(t * 5.5 + 2.0) * 0.25;
      const y = centerY + (wave1 + wave2) * amp * 0.6;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // reset shadow
    ctx.shadowBlur = 0;
  }

  // ---- main loop ----
  function tick() {
    updateCoords();
    updateShield();
    updateTargetLock();
    drawWaveform();
    requestAnimationFrame(tick);
  }

  tick();
})();