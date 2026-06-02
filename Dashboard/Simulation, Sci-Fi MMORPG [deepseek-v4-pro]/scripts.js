(function() {
  const canvas = document.getElementById('starMapCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  const stars = [];
  const gridColor = 'rgba(0, 200, 255, 0.15)';
  const hostileColor = '#ff3a3a';
  const friendlyColor = '#4cff8f';
  const neutralColor = '#a0b0c0';

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width || 400;
    height = canvas.height = rect.height || 180;
    generateStars();
  }

  function generateStars() {
    stars.length = 0;
    const count = 80;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.3,
        type: Math.random() < 0.15 ? 'hostile' : (Math.random() < 0.35 ? 'friendly' : 'neutral'),
        flicker: Math.random() * 0.03 + 0.01
      });
    }
  }

  function drawStarMap() {
    if (!ctx || width === 0) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i <= width; i += 45) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
    for (let j = 0; j <= height; j += 35) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    stars.forEach(star => {
      ctx.beginPath();
      let color = neutralColor;
      if (star.type === 'hostile') color = hostileColor;
      else if (star.type === 'friendly') color = friendlyColor;

      const glow = star.type === 'hostile' ? 6 : 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = glow;
      ctx.fillStyle = color;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      if (star.type === 'hostile' && Math.random() < 0.1) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,50,50,0.4)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    ctx.beginPath();
    ctx.arc(width * 0.7, height * 0.4, 12, 0, 2*Math.PI);
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,170,0,0.15)';
    ctx.fill();
  }

  function animate() {
    drawStarMap();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  resizeCanvas();
  animate();

  const timeElement = document.getElementById('systemTime');
  function updateTime() {
    if (!timeElement) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');
    const ms = String(now.getMilliseconds()).padStart(3,'0');
    timeElement.textContent = `⏱️ ${hours}:${minutes}:${seconds}.${ms} SGT`;
  }
  setInterval(updateTime, 90);
  updateTime();

  const particleCanvas = document.getElementById('particleField');
  if (particleCanvas) {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    const pCtx = particleCanvas.getContext('2d');
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        radius: Math.random() * 1.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    function drawParticles() {
      if (!pCtx) return;
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = particleCanvas.width;
        if (p.x > particleCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particleCanvas.height;
        if (p.y > particleCanvas.height) p.y = 0;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        pCtx.fillStyle = `rgba(180, 220, 255, ${p.opacity})`;
        pCtx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener('resize', () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    });
  }

  const commandEcho = document.getElementById('commandEcho');
  if (commandEcho) {
    const phrases = [
      "INITIATE_STRATEGIC_OVERVIEW --SECTOR=ALPHA_PRIME --FLEET=DEPLOYED",
      "ANALYZING THREAT VECTORS... STAND BY",
      "UPLINK TO NEXUS COMMAND ESTABLISHED",
      "WARP SIGNATURE DETECTED // SECTOR 7G",
      "RESOURCE ALLOCATION OPTIMIZED"
    ];
    let index = 0;
    setInterval(() => {
      index = (index + 1) % phrases.length;
      commandEcho.textContent = phrases[index];
    }, 4200);
  }
})();