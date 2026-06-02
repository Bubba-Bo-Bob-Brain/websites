(function() {
  'use strict';

  // ===== CURSOR GLOW =====
  const cursorGlow = document.querySelector('.cursor-glow');
  let mouseX = -999;
  let mouseY = -999;
  let glowX = -999;
  let glowY = -999;
  const smoothFactor = 0.12;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursorGlow() {
    glowX += (mouseX - glowX) * smoothFactor;
    glowY += (mouseY - glowY) * smoothFactor;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursorGlow);
  }

  animateCursorGlow();

  // ===== INCENSE SMOKE PARTICLES =====
  const incenseContainer = document.getElementById('incense-container');
  let particleCount = 0;
  const maxParticles = 30;

  function createIncenseParticle() {
    if (particleCount >= maxParticles) return;
    const particle = document.createElement('div');
    particle.className = 'incense-particle';
    const size = 4 + Math.random() * 8;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (10 + Math.random() * 80) + '%';
    particle.style.bottom = '0px';
    const duration = 6 + Math.random() * 8;
    const drift = -30 + Math.random() * 60;
    particle.style.setProperty('--drift', drift + 'px');
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = '0s';
    particle.style.opacity = '0.3';
    incenseContainer.appendChild(particle);
    particleCount++;

    particle.addEventListener('animationend', () => {
      particle.remove();
      particleCount--;
    });
  }

  setInterval(() => {
    createIncenseParticle();
  }, 800);

  // Create initial burst
  for (let i = 0; i < 8; i++) {
    setTimeout(createIncenseParticle, i * 200);
  }

  // ===== RUB TO REVEAL =====
  const rubButtons = document.querySelectorAll('.rub-btn');

  rubButtons.forEach((btn) => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.product-card');
      if (!card) return;

      // Visual rub effect
      card.style.transition = 'transform 0.1s ease';
      card.style.transform = 'scale(0.98) rotate(-1deg)';
      setTimeout(() => {
        card.style.transform = 'scale(1.02) rotate(1deg)';
      }, 100);
      setTimeout(() => {
        card.style.transform = 'scale(1) rotate(0deg)';
      }, 200);

      // Glow burst
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.opacity = '1';
        glow.style.transition = 'opacity 0.1s ease';
        setTimeout(() => {
          glow.style.transition = 'opacity 1s ease';
          glow.style.opacity = '0';
        }, 300);
      }

      // Particle burst from button
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
          position: fixed;
          width: ${4 + Math.random() * 6}px;
          height: ${4 + Math.random() * 6}px;
          background: radial-gradient(circle, #f4c97e, #b8863c);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          left: ${cx}px;
          top: ${cy}px;
          opacity: 1;
        `;
        document.body.appendChild(spark);
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 100;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 30;
        const duration = 600 + Math.random() * 400;
        spark.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ], {
          duration: duration,
          easing: 'ease-out',
          fill: 'forwards'
        }).onfinish = () => spark.remove();
      }

      // Show a brief message
      const messages = [
        '✨ A secret shimmer unfolds...',
        '🌀 The magic stirs within...',
        '🌟 Ancient power awakens...',
        '💫 The enchantment responds...',
        '🔮 A hidden wonder revealed...'
      ];
      const msg = document.createElement('div');
      msg.textContent = messages[Math.floor(Math.random() * messages.length)];
      msg.style.cssText = `
        position: fixed;
        top: ${cy - 40}px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(12, 10, 26, 0.9);
        color: #f4c97e;
        font-family: 'Scheherazade New', serif;
        font-size: 1.1rem;
        padding: 0.6rem 1.5rem;
        border: 1px solid rgba(201, 160, 92, 0.4);
        border-radius: 4px;
        pointer-events: none;
        z-index: 10001;
        text-align: center;
        white-space: nowrap;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        animation: msgFade 2s ease-out forwards;
      `;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    });
  });

  // Add keyframes for message fade (injected via style)
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes msgFade {
      0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
      15% { opacity: 1; transform: translateX(-50%) translateY(0); }
      75% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ===== CARD HOVER ENHANCEMENT =====
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', function() {
      const glow = this.querySelector('.card-glow');
      if (glow) {
        glow.style.opacity = '1';
      }
    });
    card.addEventListener('mouseleave', function() {
      const glow = this.querySelector('.card-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });

  // ===== NAVIGATION SMOOTH SCROLL =====
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      navLinks.forEach((l) => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ===== ACTIVE NAV ON SCROLL =====
  const sections = document.querySelectorAll('.gallery-section');
  function updateActiveNav() {
    let current = '';
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top < 300) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ===== LANTERN PARALLAX ON MOUSE MOVE =====
  const lanterns = document.querySelectorAll('.lantern, .mini-lantern');
  document.addEventListener('mousemove', (e) => {
    const xFactor = (e.clientX / window.innerWidth - 0.5) * 2;
    const yFactor = (e.clientY / window.innerHeight - 0.5) * 2;
    lanterns.forEach((lantern, index) => {
      const depth = 0.5 + (index % 3) * 0.3;
      const xShift = xFactor * 6 * depth;
      const yShift = yFactor * 3 * depth;
      lantern.style.transform = `translate(${xShift}px, ${yShift}px) rotate(${xFactor * 2}deg)`;
    });
  });

})();