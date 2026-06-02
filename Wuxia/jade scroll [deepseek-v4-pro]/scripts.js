(function() {
  const scrollContainer = document.getElementById('sacredScroll');
  const scrollFabric = document.getElementById('scrollFabric');
  const bambooForest = document.getElementById('bambooForest');
  const cloudParallax = document.getElementById('cloudParallax');
  const brushCursor = document.getElementById('brushCursor');
  const qiCanvas = document.getElementById('qiMeridianCanvas');
  const skillCanvas = document.getElementById('inkSkillCanvas');
  const sealNav = document.getElementById('sealNav');
  const skillNodes = document.querySelectorAll('.skill-node');
  const pathCards = document.querySelectorAll('.path-card');
  const acupoints = document.querySelectorAll('.acupoint');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;
  let cursorVisible = true;

  document.addEventListener('mousemove', function(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    if (!cursorVisible) {
      brushCursor.style.opacity = '0.85';
      cursorVisible = true;
    }
  });

  document.addEventListener('mouseleave', function() {
    brushCursor.style.opacity = '0';
    cursorVisible = false;
  });

  document.addEventListener('mouseenter', function() {
    brushCursor.style.opacity = '0.85';
    cursorVisible = true;
  });

  function updateCursor() {
    mouseX += (targetMouseX - mouseX) * 0.15;
    mouseY += (targetMouseY - mouseY) * 0.15;
    brushCursor.style.left = mouseX + 'px';
    brushCursor.style.top = mouseY + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (bambooForest) {
      bambooForest.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
    if (cloudParallax) {
      cloudParallax.style.transform = `translateY(${scrollY * 0.04}px) translateX(${scrollY * 0.02}px)`;
    }
    const scrollRect = scrollContainer.getBoundingClientRect();
    const scrollCenter = scrollRect.top + scrollRect.height / 2;
    const viewCenter = window.innerHeight / 2;
    const offset = (scrollCenter - viewCenter) * 0.03;
    if (scrollFabric) {
      scrollFabric.style.transform = `perspective(1200px) rotateX(${offset * 0.2}deg)`;
    }
  });

  if (qiCanvas) {
    const ctx = qiCanvas.getContext('2d');
    let width = qiCanvas.parentElement.clientWidth;
    let height = qiCanvas.parentElement.clientHeight;
    qiCanvas.width = width;
    qiCanvas.height = height;

    const points = {
      baihui: { x: width * 0.5, y: height * 0.14 },
      laogongLeft: { x: width * 0.2, y: height * 0.44 },
      laogongRight: { x: width * 0.8, y: height * 0.44 },
      dantian: { x: width * 0.5, y: height * 0.58 },
      yongquan: { x: width * 0.5, y: height * 0.88 }
    };

    const meridians = [
      { from: 'baihui', to: 'dantian', type: 'central' },
      { from: 'dantian', to: 'yongquan', type: 'central' },
      { from: 'dantian', to: 'laogongLeft', type: 'arm' },
      { from: 'dantian', to: 'laogongRight', type: 'arm' },
      { from: 'baihui', to: 'laogongLeft', type: 'secondary' },
      { from: 'baihui', to: 'laogongRight', type: 'secondary' }
    ];

    let qiParticles = [];
    const MAX_PARTICLES = 14;

    function createParticle(meridian) {
      const fromPoint = points[meridian.from];
      const toPoint = points[meridian.to];
      return {
        from: meridian.from,
        to: meridian.to,
        x: fromPoint.x,
        y: fromPoint.y,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.005,
        size: 1.8 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.6
      };
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const randomMeridian = meridians[Math.floor(Math.random() * meridians.length)];
      qiParticles.push(createParticle(randomMeridian));
    }

    function drawMeridians() {
      ctx.clearRect(0, 0, width, height);

      meridians.forEach(function(meridian) {
        const from = points[meridian.from];
        const to = points[meridian.to];
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        if (meridian.type === 'central') {
          const cpX = from.x + (Math.random() - 0.5) * 12;
          const cpY = (from.y + to.y) / 2;
          ctx.quadraticCurveTo(cpX, cpY, to.x, to.y);
        } else if (meridian.type === 'arm') {
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 + 20;
          ctx.quadraticCurveTo(midX, midY, to.x, to.y);
        } else {
          const cpX = (from.x + to.x) / 2 + 30;
          const cpY = (from.y + to.y) / 2 - 15;
          ctx.quadraticCurveTo(cpX, cpY, to.x, to.y);
        }
        ctx.strokeStyle = 'rgba(107, 90, 75, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      points && Object.keys(points).forEach(function(key) {
        const p = points[key];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(196, 58, 49, 0.7)';
        ctx.fill();
        ctx.shadowColor = 'rgba(196, 58, 49, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function updateQiParticles() {
      qiParticles.forEach(function(particle) {
        particle.progress += particle.speed;
        if (particle.progress >= 1) {
          particle.progress = 0;
          const randomMeridian = meridians[Math.floor(Math.random() * meridians.length)];
          particle.from = randomMeridian.from;
          particle.to = randomMeridian.to;
        }
        const fromPoint = points[particle.from];
        const toPoint = points[particle.to];
        particle.x = fromPoint.x + (toPoint.x - fromPoint.x) * particle.progress;
        particle.y = fromPoint.y + (toPoint.y - fromPoint.y) * particle.progress;
      });
    }

    function drawQiParticles() {
      qiParticles.forEach(function(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(224, 180, 100, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(196, 140, 60, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(196, 140, 60, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    }

    function animateQi() {
      drawMeridians();
      updateQiParticles();
      drawQiParticles();
      requestAnimationFrame(animateQi);
    }
    animateQi();

    window.addEventListener('resize', function() {
      width = qiCanvas.parentElement.clientWidth;
      height = qiCanvas.parentElement.clientHeight;
      qiCanvas.width = width;
      qiCanvas.height = height;
      points.baihui = { x: width * 0.5, y: height * 0.14 };
      points.laogongLeft = { x: width * 0.2, y: height * 0.44 };
      points.laogongRight = { x: width * 0.8, y: height * 0.44 };
      points.dantian = { x: width * 0.5, y: height * 0.58 };
      points.yongquan = { x: width * 0.5, y: height * 0.88 };
    });
  }

  if (skillCanvas) {
    const skCtx = skillCanvas.getContext('2d');
    const container = skillCanvas.parentElement;
    skillCanvas.width = container.clientWidth;
    skillCanvas.height = container.clientHeight;

    function drawSkillBranches() {
      const w = skillCanvas.width;
      const h = skillCanvas.height;
      skCtx.clearRect(0, 0, w, h);

      const nodes = {
        root: { x: w * 0.5, y: h * 0.92 },
        ironPalm: { x: w * 0.28, y: h * 0.72 },
        shadowStep: { x: w * 0.72, y: h * 0.70 },
        thunderFist: { x: w * 0.14, y: h * 0.48 },
        goldenBell: { x: w * 0.42, y: h * 0.50 },
        swordQi: { x: w * 0.86, y: h * 0.46 },
        celestial: { x: w * 0.5, y: h * 0.22 }
      };

      const connections = [
        { from: 'root', to: 'ironPalm' },
        { from: 'root', to: 'shadowStep' },
        { from: 'ironPalm', to: 'thunderFist' },
        { from: 'ironPalm', to: 'goldenBell' },
        { from: 'shadowStep', to: 'goldenBell' },
        { from: 'shadowStep', to: 'swordQi' },
        { from: 'thunderFist', to: 'celestial' },
        { from: 'goldenBell', to: 'celestial' },
        { from: 'swordQi', to: 'celestial' }
      ];

      connections.forEach(function(conn) {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        skCtx.beginPath();
        skCtx.moveTo(from.x, from.y);
        const cpX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 30;
        const cpY = (from.y + to.y) / 2 - 15;
        skCtx.quadraticCurveTo(cpX, cpY, to.x, to.y);
        skCtx.strokeStyle = 'rgba(44, 26, 14, 0.45)';
        skCtx.lineWidth = 2.2;
        skCtx.setLineDash([8, 6]);
        skCtx.lineCap = 'round';
        skCtx.stroke();
        skCtx.setLineDash([]);

        skCtx.beginPath();
        skCtx.moveTo(from.x, from.y);
        skCtx.quadraticCurveTo(cpX, cpY, to.x, to.y);
        skCtx.strokeStyle = 'rgba(180, 140, 80, 0.25)';
        skCtx.lineWidth = 1.2;
        skCtx.stroke();
      });
    }

    drawSkillBranches();
    window.addEventListener('resize', function() {
      skillCanvas.width = container.clientWidth;
      skillCanvas.height = container.clientHeight;
      drawSkillBranches();
    });
  }

  if (sealNav) {
    sealNav.addEventListener('click', function(e) {
      const button = e.target.closest('.nav-seal');
      if (!button) return;
      const targetId = button.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  skillNodes.forEach(function(node) {
    node.addEventListener('click', function() {
      const skillName = node.querySelector('.node-name').textContent;
      node.classList.add('activated');
      const originalBorder = node.querySelector('.node-circle').style.borderColor;
      node.querySelector('.node-circle').style.borderColor = 'var(--cinnabar-red)';
      node.querySelector('.node-circle').style.boxShadow = '0 0 28px rgba(196,58,49,0.6)';
      setTimeout(function() {
        node.querySelector('.node-circle').style.borderColor = originalBorder;
        node.querySelector('.node-circle').style.boxShadow = '';
        node.classList.remove('activated');
      }, 800);
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.top = '50%';
      ripple.style.left = '50%';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.background = 'rgba(196,58,49,0.4)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.animation = 'none';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '0';
      node.appendChild(ripple);
      requestAnimationFrame(function() {
        ripple.style.transition = 'all 0.7s ease-out';
        ripple.style.width = '90px';
        ripple.style.height = '90px';
        ripple.style.opacity = '0';
      });
      setTimeout(function() {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 750);
    });
  });

  pathCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const pathName = card.querySelector('.path-name').textContent;
      card.style.transition = 'all 0.2s ease';
      card.style.transform = 'scale(0.96)';
      card.style.borderColor = 'var(--cinnabar-light)';
      setTimeout(function() {
        card.style.transform = '';
        card.style.borderColor = '';
      }, 300);
    });
  });

  acupoints.forEach(function(point) {
    point.addEventListener('click', function() {
      const label = point.querySelector('.point-label').textContent;
      const glow = point.querySelector('.point-glow');
      glow.style.width = '22px';
      glow.style.height = '22px';
      glow.style.boxShadow = '0 0 32px var(--cinnabar-light), 0 0 55px rgba(196,58,49,0.9)';
      setTimeout(function() {
        glow.style.width = '';
        glow.style.height = '';
        glow.style.boxShadow = '';
      }, 600);
    });
  });

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes inkDrop {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);
})();