/* ═══════════════════════════════════════════════════════════════════════════
   ABYSSAL STATION Ω‑9 — DEEP‑SEA OPERATIONS DASHBOARD
   JavaScript controller — all animations, simulations & interactivity
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ───── Utility helpers ───── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const timestamp = () => {
    const d = new Date();
    return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
  };

  /* ───── Global state ───── */
  const state = {
    depth: 3470,               // metres — starting depth
    targetDepth: 3470,
    pressure: 342,             // atmospheres (approx depth/10 + 1)
    temp: 2.1,                 // °C
    hullIntegrity: 100,
    power: 92,
    o2: 88,
    thermal: 76,
    comms: 64,
    missionStart: Date.now() - 14 * 3600 * 1000, // simulate 14 h into mission
    klaxonActive: false,
    klaxonLevel: 0,
    sonarContacts: [],
    fauna: [],
    particles: [],
    viewportTime: 0,
    alertQueue: [],
    alerts: [],
  };

  /* ───── Fauna catalogue ───── */
  const FAUNA_TYPES = [
    { name: "Crystal Jelly",       color: "#60d0ff", glow: "#90e8ff" },
    { name: "Abyssal Anglerfish",  color: "#ff6040", glow: "#ff9060" },
    { name: "Siphonophore Chain",  color: "#c080ff", glow: "#d8a0ff" },
    { name: "Vampire Squid",       color: "#b040c0", glow: "#d070e0" },
    { name: "Barreleye Fish",      color: "#40e8c0", glow: "#60ffd0" },
    { name: "Gulper Eel",          color: "#e0a020", glow: "#f0d050" },
    { name: "Dumbo Octopus",       color: "#5090e0", glow: "#70b0ff" },
    { name: "Bioluminescent Worm", color: "#40ff88", glow: "#60ffa0" },
  ];

  /* ═══════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════ */
  function init() {
    initParticles();
    initFauna();
    initSonarContacts();
    initViewport();
    initGauges();
    initSonar();
    initFaunaCanvas();
    initHull();
    initSystems();
    initKlaxon();
    initCurrentCanvas();
    initAlerts();
    updateClock();
    requestAnimationFrame(loop);
  }

  /* ═══════════════════════════════════════════════════════════
     PARTICLE FIELD – background bioluminescent drift
     ═══════════════════════════════════════════════════════════ */
  function initParticles() {
    const field = $("#particleField");
    const count = 60;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.classList.add("particle");
      const size = rand(2, 6);
      const colors = ["#00f0e8", "#20e8b8", "#40a0ff", "#c840ff", "#ffb840"];
      const col = colors[randInt(0, colors.length - 1)];
      el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${rand(0, 100)}%; top:${rand(0, 100)}%;
        background:${col};
        box-shadow:0 0 ${size * 2}px ${col};
        --dx:${rand(-300, 300)}px;
        --dy:${rand(200, 800)}px;
        animation-duration:${rand(12, 28)}s;
        animation-delay:${rand(-10, 0)}s;
      `;
      field.appendChild(el);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     VIEWPORT CANVAS – deep-sea background scene
     ═══════════════════════════════════════════════════════════ */
  const vpCanvas = $("#viewportCanvas");
  const vpCtx = vpCanvas.getContext("2d");
  let vpW, vpH;

  function initViewport() {
    resizeViewport();
    window.addEventListener("resize", resizeViewport);
  }

  function resizeViewport() {
    const rect = vpCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    vpCanvas.width = rect.width * dpr;
    vpCanvas.height = rect.height * dpr;
    vpCanvas.style.width = rect.width + "px";
    vpCanvas.style.height = rect.height + "px";
    vpCtx.scale(dpr, dpr);
    vpW = rect.width;
    vpH = rect.height;
  }

  function drawViewport(t) {
    vpCtx.clearRect(0, 0, vpW, vpH);

    // Deep gradient background
    const grad = vpCtx.createLinearGradient(0, 0, 0, vpH);
    grad.addColorStop(0, "#061228");
    grad.addColorStop(0.4, "#040e20");
    grad.addColorStop(1, "#020814");
    vpCtx.fillStyle = grad;
    vpCtx.fillRect(0, 0, vpW, vpH);

    // Light rays from above
    const rayCount = 7;
    for (let i = 0; i < rayCount; i++) {
      const x = vpW * (0.15 + (i / rayCount) * 0.7);
      const intensity = 0.02 + Math.sin(t * 0.0005 + i * 1.3) * 0.015;
      vpCtx.save();
      vpCtx.globalAlpha = clamp(intensity, 0, 0.12);
      const ray = vpCtx.createLinearGradient(x, 0, x + 40, vpH);
      ray.addColorStop(0, "rgba(100, 180, 255, 0.6)");
      ray.addColorStop(0.5, "rgba(60, 140, 220, 0.15)");
      ray.addColorStop(1, "rgba(20, 80, 140, 0)");
      vpCtx.fillStyle = ray;
      vpCtx.beginPath();
      vpCtx.moveTo(x - 5, 0);
      vpCtx.lineTo(x + 45, 0);
      vpCtx.lineTo(x + 80, vpH);
      vpCtx.lineTo(x - 40, vpH);
      vpCtx.closePath();
      vpCtx.fill();
      vpCtx.restore();
    }

    // Floating sediment / marine snow
    for (let i = 0; i < 30; i++) {
      const seed = i * 137.5;
      const x = ((seed * 7.3 + t * 0.005) % (vpW + 40)) - 20;
      const y = ((seed * 17.1 + t * 0.012 + Math.sin(t * 0.001 + i) * 10) % (vpH + 40)) - 20;
      const s = 1.5 + Math.sin(t * 0.002 + i) * 0.8;
      vpCtx.beginPath();
      vpCtx.arc(x, y, s, 0, Math.PI * 2);
      vpCtx.fillStyle = `rgba(120, 180, 220, ${0.1 + Math.sin(t * 0.003 + i) * 0.05})`;
      vpCtx.fill();
    }

    // Distant silhouette of a whale or large creature (slow pass)
    const whaleX = ((t * 0.01 + 300) % (vpW + 400)) - 200;
    if (whaleX > -100 && whaleX < vpW + 100) {
      vpCtx.save();
      vpCtx.globalAlpha = 0.08;
      vpCtx.fillStyle = "#204060";
      // Simple whale shape
      const wy = vpH * 0.55 + Math.sin(t * 0.0008) * 15;
      vpCtx.beginPath();
      vpCtx.ellipse(whaleX + 60, wy, 80, 18, 0, 0, Math.PI * 2);
      vpCtx.fill();
      vpCtx.beginPath();
      vpCtx.moveTo(whaleX - 30, wy - 5);
      vpCtx.lineTo(whaleX - 60, wy - 30);
      vpCtx.lineTo(whaleX - 45, wy);
      vpCtx.fill();
      // Dorsal fin
      vpCtx.beginPath();
      vpCtx.moveTo(whaleX + 10, wy - 16);
      vpCtx.lineTo(whaleX + 18, wy - 35);
      vpCtx.lineTo(whaleX + 26, wy - 16);
      vpCtx.fill();
      vpCtx.restore();
    }

    // Caustic shimmer on viewport glass
    vpCtx.save();
    vpCtx.globalAlpha = 0.04 + Math.sin(t * 0.001) * 0.02;
    for (let i = 0; i < 5; i++) {
      const cx = vpW * (0.2 + i * 0.15 + Math.sin(t * 0.0007 + i) * 0.05);
      const cy = vpH * (0.25 + Math.sin(t * 0.0013 + i * 2) * 0.1);
      const r = 40 + Math.sin(t * 0.001 + i) * 20;
      const cg = vpCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cg.addColorStop(0, "rgba(0, 240, 232, 0.5)");
      cg.addColorStop(1, "rgba(0, 200, 180, 0)");
      vpCtx.fillStyle = cg;
      vpCtx.beginPath();
      vpCtx.arc(cx, cy, r, 0, Math.PI * 2);
      vpCtx.fill();
    }
    vpCtx.restore();
  }

  /* ═══════════════════════════════════════════════════════════
     GAUGES – depth & pressure circular gauges
     ═══════════════════════════════════════════════════════════ */
  function initGauges() {
    drawDepthGauge();
    drawPressureGauge();
  }

  function drawGauge(canvas, value, max, label, color, bgArc) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2 + 10;
    const r = Math.min(w, h) / 2 - 15;
    const startAngle = (3 / 4) * Math.PI;
    const endAngle = (1 / 4) * Math.PI;
    const totalAngle = endAngle - startAngle;

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = bgArc || "rgba(42, 80, 130, 0.2)";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();

    // Value arc
    const pct = clamp(value / max, 0, 1);
    const valAngle = startAngle + totalAngle * pct;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, valAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();

    // Glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tick marks
    const tickCount = 10;
    for (let i = 0; i <= tickCount; i++) {
      const ang = startAngle + (totalAngle / tickCount) * i;
      const x1 = cx + Math.cos(ang) * (r - 14);
      const y1 = cy + Math.sin(ang) * (r - 14);
      const x2 = cx + Math.cos(ang) * (r + 4);
      const y2 = cy + Math.sin(ang) * (r + 4);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(100, 150, 200, 0.3)";
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Needle
    const needleAngle = startAngle + totalAngle * pct;
    const needleLen = r - 20;
    const nx = cx + Math.cos(needleAngle) * needleLen;
    const ny = cy + Math.sin(needleAngle) * needleLen;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Value text
    ctx.font = `bold ${r * 0.3}px "Share Tech Mono", monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const displayVal = value >= 1000 ? (value / 1000).toFixed(1) + "k" : Math.round(value);
    ctx.fillText(displayVal, cx, cy - r * 0.15);

    // Label
    ctx.font = `${r * 0.13}px "Orbitron", sans-serif`;
    ctx.fillStyle = "#5a7a9a";
    ctx.fillText(label, cx, cy + r * 0.25);

    ctx.restore();
  }

  function drawDepthGauge() {
    drawGauge($("#depthGauge"), state.depth, 11000, "M", "#00f0e8", "rgba(0, 240, 232, 0.1)");
    $("#depthValue").textContent = state.depth.toLocaleString() + " m";
  }

  function drawPressureGauge() {
    drawGauge($("#pressureGauge"), state.pressure, 1100, "ATM", "#20e8b8", "rgba(32, 232, 184, 0.1)");
    $("#pressureValue").textContent = state.pressure.toFixed(1) + " atm";
  }

  /* ═══════════════════════════════════════════════════════════
     SONAR – sweeping ping with contacts
     ═══════════════════════════════════════════════════════════ */
  const sonarCanvas = $("#sonarCanvas");
  const sonarCtx = sonarCanvas.getContext("2d");
  let sonarAngle = 0;
  let sonarPings = [];

  function initSonar() {
    sonarCanvas.width = sonarCanvas.parentElement.clientWidth;
    sonarCanvas.height = 320;
  }

  function drawSonar(t) {
    const w = sonarCanvas.width;
    const h = sonarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) / 2 - 10;
    const sweepspeed = 0.015;

    sonarCtx.clearRect(0, 0, w, h);

    // Background
    const bg = sonarCtx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    bg.addColorStop(0, "#0a1a2e");
    bg.addColorStop(1, "#040a14");
    sonarCtx.fillStyle = bg;
    sonarCtx.fillRect(0, 0, w, h);

    // Grid circles
    sonarCtx.strokeStyle = "rgba(0, 200, 180, 0.08)";
    sonarCtx.lineWidth = 0.5;
    for (let r = 40; r < maxR; r += 40) {
      sonarCtx.beginPath();
      sonarCtx.arc(cx, cy, r, 0, Math.PI * 2);
      sonarCtx.stroke();
    }

    // Grid lines
    sonarCtx.strokeStyle = "rgba(0, 200, 180, 0.04)";
    for (let a = 0; a < 6; a++) {
      const ang = (a / 6) * Math.PI * 2;
      sonarCtx.beginPath();
      sonarCtx.moveTo(cx, cy);
      sonarCtx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
      sonarCtx.stroke();
    }

    // Range labels
    sonarCtx.font = "10px 'Share Tech Mono', monospace";
    sonarCtx.fillStyle = "rgba(0, 200, 180, 0.3)";
    sonarCtx.textAlign = "center";
    for (let r = 80; r < maxR; r += 80) {
      sonarCtx.fillText(Math.round((r / maxR) * 500) + "m", cx, cy - r + 12);
    }

    // Sweep line
    sonarAngle += sweepspeed;
    if (sonarAngle > Math.PI * 2) sonarAngle -= Math.PI * 2;
    const sx = cx + Math.cos(sonarAngle) * maxR;
    const sy = cy + Math.sin(sonarAngle) * maxR;

    // Sweep gradient
    const sweepGrad = sonarCtx.createConicalGradient
      ? null // Not widely supported, use manual approach
      : null;

    // Draw sweep as a fading arc
    for (let i = 0; i < 30; i++) {
      const a = sonarAngle - (i / 30) * 0.6;
      const alpha = 0.6 * (1 - i / 30);
      const ex = cx + Math.cos(a) * maxR;
      const ey = cy + Math.sin(a) * maxR;
      sonarCtx.beginPath();
      sonarCtx.moveTo(cx, cy);
      sonarCtx.lineTo(
        cx + Math.cos(a - 0.01) * maxR,
        cy + Math.sin(a - 0.01) * maxR
      );
      sonarCtx.lineTo(ex, ey);
      sonarCtx.closePath();
      sonarCtx.fillStyle = `rgba(0, 240, 232, ${alpha})`;
      sonarCtx.fill();
    }

    // Ping ripples
    if (t % 80 < 2) {
      sonarPings.push({ angle: sonarAngle, radius: 20, alpha: 0.8 });
    }
    const newPings = [];
    for (const ping of sonarPings) {
      ping.radius += 2;
      ping.alpha -= 0.015;
      if (ping.alpha > 0 && ping.radius < maxR) {
        newPings.push(ping);
        sonarCtx.beginPath();
        sonarCtx.arc(cx, cy, ping.radius, 0, Math.PI * 2);
        sonarCtx.strokeStyle = `rgba(0, 240, 232, ${ping.alpha})`;
        sonarCtx.lineWidth = 1.5;
        sonarCtx.stroke();
      }
    }
    sonarPings = newPings;

    // Contacts – detected objects
    const contactCount = 8;
    for (let i = 0; i < contactCount; i++) {
      const seed = i * 97.3;
      const dist = ((seed * 3.7) % (maxR - 30)) + 20;
      const angle = ((seed * 2.3) % 360) * (Math.PI / 180);
      const cx2 = cx + Math.cos(angle) * dist;
      const cy2 = cy + Math.sin(angle) * dist;
      const pulse = 0.4 + Math.sin(t * 0.003 + seed) * 0.3;

      // Contact dot
      sonarCtx.beginPath();
      sonarCtx.arc(cx2, cy2, 3, 0, Math.PI * 2);
      sonarCtx.fillStyle = `rgba(0, 240, 232, ${pulse})`;
      sonarCtx.fill();
      sonarCtx.shadowColor = "#00f0e8";
      sonarCtx.shadowBlur = 8;
      sonarCtx.fill();
      sonarCtx.shadowBlur = 0;

      // Contact label
      sonarCtx.font = "9px 'Share Tech Mono', monospace";
      sonarCtx.fillStyle = `rgba(0, 240, 232, ${pulse * 0.7})`;
      sonarCtx.textAlign = "left";
      sonarCtx.fillText(`OBJ-${String(i + 1).padStart(2, "0")}`, cx2 + 8, cy2 - 4);
      sonarCtx.fillText(`${Math.round(dist)}m`, cx2 + 8, cy2 + 8);
    }

    // Center marker
    sonarCtx.beginPath();
    sonarCtx.arc(cx, cy, 3, 0, Math.PI * 2);
    sonarCtx.fillStyle = "#00f0e8";
    sonarCtx.fill();
  }

  /* ═══════════════════════════════════════════════════════════
     FAUNA TRACKER – bioluminescent creatures on canvas + list
     ═══════════════════════════════════════════════════════════ */
  const faunaCanvas = $("#faunaCanvas");
  const faunaCtx = faunaCanvas.getContext("2d");
  let faunaW, faunaH;

  function initFaunaCanvas() {
    faunaCanvas.width = faunaCanvas.parentElement.clientWidth;
    faunaCanvas.height = 260;
    faunaW = faunaCanvas.width;
    faunaH = faunaCanvas.height;
    // Populate fauna list in DOM
    const list = $("#faunaList");
    list.innerHTML = "";
    state.fauna = [];
    for (let i = 0; i < 8; i++) {
      const type = FAUNA_TYPES[i % FAUNA_TYPES.length];
      const count = randInt(1, 12);
      state.fauna.push({ ...type, count, x: rand(30, faunaW - 30), y: rand(30, faunaH - 30), vx: rand(-0.3, 0.3), vy: rand(-0.2, 0.2), phase: rand(0, Math.PI * 2), size: rand(4, 12) });
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="bio-dot" style="background:${type.color};color:${type.color}"></span>
        <span class="name">${type.name}</span>
        <span class="count">${count}</span>
      `;
      list.appendChild(li);
    }
  }

  function drawFauna(t) {
    faunaCtx.clearRect(0, 0, faunaW, faunaH);

    // Deep background
    const fbg = faunaCtx.createRadialGradient(faunaW / 2, faunaH / 2, 0, faunaW / 2, faunaH / 2, faunaW / 2);
    fbg.addColorStop(0, "#081628");
    fbg.addColorStop(1, "#040a14");
    faunaCtx.fillStyle = fbg;
    faunaCtx.fillRect(0, 0, faunaW, faunaH);

    for (const f of state.fauna) {
      const px = f.x + Math.sin(t * 0.001 * f.vx + f.phase) * 30;
      const py = f.y + Math.cos(t * 0.0008 * f.vy + f.phase) * 20;
      const pulse = 0.6 + Math.sin(t * 0.004 + f.phase) * 0.4;

      // Glow
      faunaCtx.save();
      faunaCtx.globalAlpha = pulse * 0.3;
      const grd = faunaCtx.createRadialGradient(px, py, 0, px, py, f.size * 3);
      grd.addColorStop(0, f.color);
      grd.addColorStop(1, "transparent");
      faunaCtx.fillStyle = grd;
      faunaCtx.beginPath();
      faunaCtx.arc(px, py, f.size * 3, 0, Math.PI * 2);
      faunaCtx.fill();
      faunaCtx.restore();

      // Core
      faunaCtx.beginPath();
      faunaCtx.arc(px, py, f.size * 0.5, 0, Math.PI * 2);
      faunaCtx.fillStyle = f.color;
      faunaCtx.globalAlpha = pulse;
      faunaCtx.fill();
      faunaCtx.globalAlpha = 1;

      // Tentacles (jellyfish-like for some)
      if (f.size > 6) {
        faunaCtx.strokeStyle = f.color;
        faunaCtx.globalAlpha = pulse * 0.5;
        faunaCtx.lineWidth = 0.8;
        for (let j = 0; j < 5; j++) {
          faunaCtx.beginPath();
          faunaCtx.moveTo(px - 4 + j * 2, py + f.size * 0.5);
          const wave = Math.sin(t * 0.003 + f.phase + j) * 4;
          faunaCtx.quadraticCurveTo(px - 6 + j * 2, py + f.size + 8 + wave, px - 2 + j * 2, py + f.size + 16 + wave * 1.5);
          faunaCtx.stroke();
        }
        faunaCtx.globalAlpha = 1;
      }
    }

    // Drifting particles in fauna view
    for (let i = 0; i < 15; i++) {
      const px = ((i * 73.7 + t * 0.015) % faunaW);
      const py = ((i * 41.3 + t * 0.008 + Math.sin(t * 0.002 + i) * 10) % faunaH);
      faunaCtx.beginPath();
      faunaCtx.arc(px, py, 1, 0, Math.PI * 2);
      faunaCtx.fillStyle = `rgba(0, 240, 232, ${0.1 + Math.sin(t * 0.003 + i) * 0.05})`;
      faunaCtx.fill();
    }
  }

  /* ═══════════════════════════════════════════════════════════
     HULL INTEGRITY – SVG stress points
     ═══════════════════════════════════════════════════════════ */
  const hullSVG = $("#hullDiagram");

  function initHull() {
    // Create dynamic stress point elements
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 85;
      const cx = 100 + Math.cos(angle) * r;
      const cy = 100 + Math.sin(angle) * r;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", "#20ff88");
      circle.setAttribute("class", "hull-point");
      circle.setAttribute("data-index", i);
      hullSVG.appendChild(circle);

      // Connecting lines
      const nextAngle = ((i + 1) / 12) * Math.PI * 2;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("stroke", "#3a5a7a");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("class", "hull-line");
      hullSVG.appendChild(line);
    }
  }

  function updateHull(t) {
    const points = hullSVG.querySelectorAll(".hull-point");
    const lines = hullSVG.querySelectorAll(".hull-line");
    const riskEl = $("#hullRisk");
    const overallEl = $("#hullOverall");

    points.forEach((pt, i) => {
      const angle = (i / points.length) * Math.PI * 2;
      const baseR = 85;
      // Micro-vibration
      const jitter = Math.sin(t * 0.003 + i * 2) * 1.5;
      const r = baseR + jitter;
      const cx = 100 + Math.cos(angle) * r;
      const cy = 100 + Math.sin(angle) * r;
      pt.setAttribute("cx", cx);
      pt.setAttribute("cy", cy);

      // Color based on simulated stress
      const stress = Math.sin(t * 0.001 + i * 0.5) * 0.3 + 0.7;
      if (stress < 0.5) {
        pt.setAttribute("fill", "var(--warn-red)");
        pt.setAttribute("r", "4");
      } else if (stress < 0.7) {
        pt.setAttribute("fill", "var(--warn-orange)");
        pt.setAttribute("r", "3.5");
      } else {
        pt.setAttribute("fill", "var(--safe-green)");
        pt.setAttribute("r", "3");
      }

      // Glow filter
      pt.style.filter = `drop-shadow(0 0 4px ${pt.getAttribute("fill")})`;
    });

    // Update lines
    for (let i = 0; i < lines.length; i++) {
      const nextPt = points[(i + 1) % points.length];
      lines[i].setAttribute("x2", nextPt.getAttribute("cx"));
      lines[i].setAttribute("y2", nextPt.getAttribute("cy"));
    }

    // Simulated integrity value
    const integrity = state.hullIntegrity + Math.sin(t * 0.0005) * 2;
    overallEl.textContent = clamp(Math.round(integrity), 0, 100) + "%";
    overallEl.className = integrity < 50 ? "danger" : integrity < 75 ? "warning" : "";

    if (integrity < 50) {
      riskEl.textContent = "HIGH";
      riskEl.className = "danger";
    } else if (integrity < 80) {
      riskEl.textContent = "MODERATE";
      riskEl.className = "warning";
    } else {
      riskEl.textContent = "LOW";
      riskEl.className = "";
    }
  }

  /* ═══════════════════════════════════════════════════════════
     SYSTEMS BARS – live fluctuating metrics
     ═══════════════════════════════════════════════════════════ */
  function initSystems() {
    updateSystemBars();
  }

  function updateSystemBars() {
    // Fluctuate values
    state.power = clamp(state.power + rand(-1, 1), 40, 100);
    state.o2 = clamp(state.o2 + rand(-0.8, 0.8), 50, 100);
    state.thermal = clamp(state.thermal + rand(-1, 1), 30, 100);
    state.comms = clamp(state.comms + rand(-2, 2), 20, 100);

    setBar("powerBar", state.power);
    setBar("o2Bar", state.o2);
    setBar("tempBar", state.thermal);
    setBar("commBar", state.comms);
  }

  function setBar(id, value) {
    const el = $("#" + id);
    el.style.width = value + "%";
    // Color shift based on level
    if (value < 50) {
      el.style.background = "linear-gradient(90deg, #8a2020, #ff3040)";
      el.style.boxShadow = "0 0 8px rgba(255, 48, 64, 0.4)";
    } else {
      // Restore original based on id
      const colors = {
        powerBar: "linear-gradient(90deg, #1a6a3a, #20ff88)",
        o2Bar: "linear-gradient(90deg, #1a5a8a, #40a0ff)",
        tempBar: "linear-gradient(90deg, #6a4a1a, #ffb840)",
        commBar: "linear-gradient(90deg, #5a2a7a, #c840ff)",
      };
      el.style.background = colors[id] || "";
      el.style.boxShadow = "";
    }
  }

  /* ═══════════════════════════════════════════════════════════
     ALERT SYSTEM – periodic alerts
     ═══════════════════════════════════════════════════════════ */
  const ALERT_MESSAGES = [
    { level: "info", msg: "Sonar recalibration complete." },
    { level: "info", msg: "External lighting array nominal." },
    { level: "info", msg: "Life support cycle rotation #47 completed." },
    { level: "warn", msg: "Minor hull flex detected – Section C4." },
    { level: "warn", msg: "O₂ recycler efficiency dropped to 88%." },
    { level: "warn", msg: "Thermal vent output fluctuation observed." },
    { level: "warn", msg: "Communication latency spike: 1.2 s." },
    { level: "critical", msg: "Pressure differential anomaly – Sector 7!" },
    { level: "critical", msg: "Hull breach warning – Port side!" },
    { level: "critical", msg: "Emergency buoyancy systems armed." },
    { level: "info", msg: "Bioluminescent activity surge detected." },
    { level: "info", msg: "Geological sample bay temperature stable." },
    { level: "warn", msg: "Backup generator warm-up initiated." },
    { level: "info", msg: "Current flow direction shifted 12° NE." },
    { level: "critical", msg: "Depth exceeding safe operational limit!" },
    { level: "warn", msg: "Fauna tracking lost 2 contacts." },
    { level: "info", msg: "Navigation recalculated for station drift." },
  ];

  function initAlerts() {
    // Generate a few initial alerts
    for (let i = 0; i < 5; i++) {
      pushAlert(ALERT_MESSAGES[randInt(0, ALERT_MESSAGES.length - 1)]);
    }
  }

  function pushAlert({ level, msg }) {
    const alert = { level, msg, time: new Date().toISOString().slice(11, 19) };
    state.alerts.unshift(alert);
    if (state.alerts.length > 50) state.alerts.pop();

    const log = $("#alertLog");
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="alert-time">${alert.time}</span>
      <span class="alert-level ${level}">${level.toUpperCase()}</span>
      <span class="alert-msg">${msg}</span>
    `;
    log.prepend(li);

    // Keep DOM trimmed
    while (log.children.length > 30) log.removeChild(log.lastChild);
  }

  let alertTimer = 0;
  function updateAlerts(dt) {
    alertTimer += dt;
    if (alertTimer > 8000 + Math.random() * 7000) {
      alertTimer = 0;
      pushAlert(ALERT_MESSAGES[randInt(0, ALERT_MESSAGES.length - 1)]);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     KLAXON – warning activation
     ═══════════════════════════════════════════════════════════ */
  function initKlaxon() {
    $("#klaxonBtn").addEventListener("click", () => {
      state.klaxonActive = !state.klaxonActive;
      const btn = $("#klaxonBtn");
      const bar = $("#klaxonBar");

      if (state.klaxonActive) {
        btn.classList.add("active");
        btn.textContent = "⚠ KLAXON ACTIVE";
        state.klaxonLevel = 0;

        // Flash viewport border
        document.getElementById("viewport").style.boxShadow =
          "inset 0 0 60px rgba(0, 20, 60, 0.8), 0 0 30px rgba(255, 48, 64, 0.4), 0 8px 32px rgba(0,0,0,0.6)";

        // Push alert
        pushAlert({ level: "critical", msg: "Warning klaxon activated by operator." });

        // Sound simulation using Web Audio API
        playKlaxonSound();
      } else {
        btn.classList.remove("active");
        btn.textContent = "⚠ KLAXON";
        document.getElementById("viewport").style.boxShadow =
          "inset 0 0 60px rgba(0, 20, 60, 0.8), 0 0 30px rgba(0, 100, 180, 0.15), 0 8px 32px rgba(0,0,0,0.6)";
      }
    });
  }

  function playKlaxonSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);

      // Repeating blips
      let t = ctx.currentTime;
      for (let i = 0; i < 8; i++) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = 330;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.02);
        g.gain.linearRampToValueAtTime(0, t + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.25);
        t += 0.35;
      }
    } catch (e) {
      // Audio not available
    }
  }

  /* ═══════════════════════════════════════════════════════════
     CURRENT FLOW CANVAS – animated arrow visualization
     ═══════════════════════════════════════════════════════════ */
  const currentCanvas = $("#currentCanvas");
  const currentCtx = currentCanvas.getContext("2d");
  let currentW, currentH;

  function initCurrentCanvas() {
    const rect = currentCanvas.parentElement.getBoundingClientRect();
    currentCanvas.width = 220 * (window.devicePixelRatio || 1);
    currentCanvas.height = 50 * (window.devicePixelRatio || 1);
    currentCanvas.style.width = "220px";
    currentCanvas.style.height = "50px";
    currentCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    currentW = 220;
    currentH = 50;
  }

  function drawCurrent(t) {
    currentCtx.clearRect(0, 0, currentW, currentH);

    // Background
    currentCtx.fillStyle = "rgba(4, 14, 30, 0.6)";
    currentCtx.fillRect(0, 0, currentW, currentH);

    // Flowing arrows
    const arrowCount = 8;
    for (let i = 0; i < arrowCount; i++) {
      const x = ((t * 0.02 + i * (currentW / arrowCount)) % (currentW + 20)) - 10;
      const y = currentH / 2 + Math.sin(t * 0.002 + i) * 8;
      const speed = 0.5 + Math.sin(t * 0.001 + i * 3) * 0.3;

      currentCtx.save();
      currentCtx.translate(x, y);
      currentCtx.rotate(Math.PI / 6 * speed);
      currentCtx.beginPath();
      currentCtx.moveTo(-6, -4);
      currentCtx.lineTo(6, 0);
      currentCtx.lineTo(-6, 4);
      currentCtx.closePath();
      currentCtx.fillStyle = `rgba(0, 200, 180, ${0.3 + speed * 0.2})`;
      currentCtx.fill();
      currentCtx.restore();
    }
  }

  /* ═══════════════════════════════════════════════════════════
     SIMULATION – depth, temperature, mission time evolution
     ═══════════════════════════════════════════════════════════ */
  function updateSimulation(t) {
    // Slowly drifting depth
    const depthOsc = Math.sin(t * 0.0001) * 5;
    state.depth = 3470 + depthOsc;
    state.pressure = (state.depth / 10) + 1;

    // Temperature – slight variation
    state.temp = 2.1 + Math.sin(t * 0.0002) * 0.3;

    // Ambient color temperature based on depth
    updateAmbientDepth();

    // Hull micro-fluctuations
    if (Math.sin(t * 0.0003) < -0.95 && !state.klaxonActive) {
      state.hullIntegrity = Math.max(85, state.hullIntegrity - 0.5);
    } else {
      state.hullIntegrity = Math.min(100, state.hullIntegrity + 0.1);
    }
  }

  function updateAmbientDepth() {
    const d = state.depth;
    let cls = "depth-shallow";
    if (d > 6000) cls = "depth-hadal";
    else if (d > 4000) cls = "depth-deep";
    else if (d > 2000) cls = "depth-mid";
    document.body.className = cls;
  }

  function updateClock() {
    const now = new Date(Date.now() + (Date.now() - state.missionStart));
    $("#missionClock").textContent = now.toISOString().slice(11, 19);
    $("#timeStamp").textContent = now.toISOString().slice(0, 19) + " UTC";
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN LOOP
     ═══════════════════════════════════════════════════════════ */
  let lastTime = 0;
  let klaxonBarDir = 1;

  function loop(t) {
    const dt = t - lastTime;
    lastTime = t;

    // Viewport scene
    drawViewport(t);

    // Sonar
    drawSonar(t);

    // Fauna
    drawFauna(t);

    // Gauges
    drawDepthGauge();
    drawPressureGauge();

    // Hull
    updateHull(t);

    // Systems
    updateSystemBars();

    // Current flow
    drawCurrent(t);

    // Alerts
    updateAlerts(dt);

    // Clock every second
    if (t % 1000 < 16) updateClock();

    // Klaxon bar animation
    if (state.klaxonActive) {
      const bar = $("#klaxonBar");
      let fill = parseFloat(bar.style.getPropertyValue("--klaxon-fill") || 0);
      fill += 0.4 * klaxonBarDir;
      if (fill >= 100) { fill = 100; klaxonBarDir = -1; }
      if (fill <= 0) { fill = 0; klaxonBarDir = 1; }
      bar.style.setProperty("--klaxon-fill", fill);
      bar.innerHTML = `<div class="klaxon-fill" style="width:${fill}%"></div>`;
    } else {
      if ($("#klaxonBar").children.length > 0) {
        $("#klaxonBar").innerHTML = "";
      }
    }

    // Temp display
    $("#tempValue").textContent = state.temp.toFixed(1) + " °C";

    requestAnimationFrame(loop);
  }

  /* ───── Boot ───── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();