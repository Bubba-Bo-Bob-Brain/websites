// ===== GLOBAL VARIABLES =====
const HEARTBEAT_DURATION = 1500; // ms (matches CSS --pulse-speed)
const ORGANS = [
  { id: "heart", min: 60, max: 90, current: 78 },
  { id: "lungs", min: 30, max: 80, current: 42 },
  { id: "liver", min: 5, max: 40, current: 15 },
  { id: "kidneys", min: 80, max: 95, current: 91 }
];
const TOXINS = [
  { type: "Heavy Metals", min: 2, max: 15, current: 4 },
  { type: "Nanopollutants", min: 1, max: 20, current: 6 },
  { type: "Biological", min: 0, max: 10, current: 2 }
];
const MUTATION_PROGRESSION = { min: 0, max: 100, current: 30 };
const NANOMACHINE_COUNT = 12450;

// ===== CANVAS: NANOMACHINE SWARM =====
const canvas = document.getElementById("nanomachine-swarm");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Nanomachine particles
const particles = [];
for (let i = 0; i < 150; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    color: `rgba(170, 255, 0, ${Math.random() * 0.7 + 0.3})`,
    glow: Math.random() > 0.7 // 30% chance of glowing
  });
}

// Draw particles
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    if (p.glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

// Animate particles
function animateParticles() {
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    // Boundary checks
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  drawParticles();
  requestAnimationFrame(animateParticles);
}

// ===== REAL-TIME DATA SIMULATION =====
function updateOrganStatus() {
  ORGANS.forEach(org => {
    // Simulate small fluctuations
    const fluctuation = (Math.random() - 0.5) * 2;
    org.current = Math.min(org.max, Math.max(org.min, org.current + fluctuation));

    // Update DOM
    const fill = document.querySelector(`.organ[data-id="${org.id}"] .bar-fill`);
    if (fill) fill.style.height = `${org.current}%`;

    // Update status text (CAUTION/CRITICAL)
    const statusEl = document.querySelector(`.organ[data-id="${org.id}"] .status`);
    if (org.current < 30) {
      statusEl.textContent = "CRITICAL";
      statusEl.style.color = "#ff00aa";
    } else if (org.current < 60) {
      statusEl.textContent = "CAUTION";
      statusEl.style.color = "#ffcc00";
    } else {
      statusEl.textContent = "STABLE";
      statusEl.style.color = "#aaff00";
    }
  });
}

function updateToxinLevels() {
  let totalToxins = 0;
  TOXINS.forEach(toxin => {
    // Simulate toxin changes
    const fluctuation = (Math.random() - 0.5) * 0.5;
    toxin.current = Math.min(toxin.max, Math.max(toxin.min, toxin.current + fluctuation));
    totalToxins += toxin.current;

    // Update DOM
    const detailEl = document.querySelector(`.toxin-type:contains("${toxin.type}")`);
    if (detailEl) detailEl.querySelector("span").textContent = `${Math.round(toxin.current)}%`;
  });

  // Update total toxin bar
  const totalFill = document.querySelector(".toxin-fill");
  if (totalFill) totalFill.style.width = `${totalToxins}%`;

  // Update heartbeat text
  const heartbeatText = document.querySelector(".heartbeat-text");
  if (heartbeatText) {
    heartbeatText.textContent = `NEURAL SYNC: 98.7% | TOXIN LOAD: ${Math.round(totalToxins)}% | MUTATION INDEX: ${MUTATION_PROGRESSION.current}`;
  }
}

function updateMutationProgress() {
  // Simulate slow mutation progression
  const progression = (Math.random() - 0.7) * 0.2; // Mostly small increases
  MUTATION_PROGRESSION.current = Math.min(
    MUTATION_PROGRESSION.max,
    Math.max(MUTATION_PROGRESSION.min, MUTATION_PROGRESSION.current + progression)
  );

  // Update DOM
  const fill = document.querySelector(".mutation-fill");
  if (fill) fill.style.width = `${MUTATION_PROGRESSION.current}%`;
}

// ===== HEARTBEAT SYNC =====
function pulseHeartbeat() {
  // Trigger CSS animation
  const pulse = document.querySelector(".pulse");
  pulse.style.animation = "none";
  void pulse.offsetWidth; // Force reflow
  pulse.style.animation = `heartbeat-pulse ${HEARTBEAT_DURATION}ms infinite ease-in-out`;

  // Trigger UI pulses
  document.querySelectorAll(".organ").forEach(el => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = `organ-breath 3s infinite ease-in-out`;
  });

  // Glitch effect on heartbeat
  const glitch = document.querySelector(".glitch-overlay");
  glitch.style.animation = "none";
  void glitch.offsetWidth;
  glitch.style.animation = "glitch-scan 0.1s";
}

// ===== DATA STREAM ANIMATION =====
function animateDataStream() {
  const stream = document.querySelector(".data-stream");
  const lines = stream.querySelectorAll(".stream-line");

  // Randomly add glitch lines
  if (Math.random() > 0.7) {
    const glitchLine = document.createElement("div");
    glitchLine.className = "stream-line glitch";
    glitchLine.textContent = `>> ERROR: NEURAL FEEDBACK LOOP DETECTED (${Math.random().toFixed(3)})`;
    stream.insertBefore(glitchLine, lines[0]);
    setTimeout(() => glitchLine.remove(), 2000);
  }

  // Scroll stream
  lines.forEach(line => {
    const currentMargin = parseInt(window.getComputedStyle(line).marginTop) || 0;
    if (currentMargin > -20) {
      line.style.marginTop = `${currentMargin - 1}px`;
    } else {
      line.remove();
    }
  });

  // Add new line
  if (Math.random() > 0.3) {
    const newLine = document.createElement("div");
    newLine.className = "stream-line";
    const organ = ORGANS[Math.floor(Math.random() * ORGANS.length)];
    newLine.textContent = `>> ${organ.id.toUpperCase()}: ${organ.current}% | ${organ.current < 30 ? "CRITICAL" : "STABLE"}`;
    stream.appendChild(newLine);
  }
}

// ===== INTERACTIVE GLITCHES =====
document.addEventListener("mousemove", (e) => {
  const glitch = document.querySelector(".glitch-overlay");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // Distort glitch based on mouse position
  glitch.style.setProperty("--glitch-x", `${x * 10}px`);
  glitch.style.setProperty("--glitch-y", `${y * 10}px`);

  // Random glitch trigger
  if (Math.random() > 0.9) {
    glitch.style.animation = "none";
    void glitch.offsetWidth;
    glitch.style.animation = "glitch-scan 0.1s";
  }
});

// ===== TIMESTAMP UPDATER =====
function updateTimestamp() {
  const now = new Date();
  const timestamp = document.getElementById("timestamp");
  if (timestamp) {
    timestamp.textContent = now.toISOString().replace("T", " ").substring(0, 19);
  }
}

// ===== INITIALIZE =====
function init() {
  // Start animations
  animateParticles();
  setInterval(updateOrganStatus, 3000);
  setInterval(updateToxinLevels, 4000);
  setInterval(updateMutationProgress, 5000);
  setInterval(pulseHeartbeat, HEARTBEAT_DURATION);
  setInterval(animateDataStream, 1000);
  setInterval(updateTimestamp, 1000);

  // Initial glitch
  setTimeout(() => {
    document.querySelector(".glitch-overlay").style.animation = "glitch-scan 0.1s";
  }, 1000);
}

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start everything
init();