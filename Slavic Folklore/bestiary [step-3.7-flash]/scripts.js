const style = document.createElement('style');
style.textContent = `
  .seal-blessing {
    position: fixed;
    bottom: 140px;
    right: 40px;
    background: #d9cbb8;
    border: 2px solid #8b6914;
    padding: 15px 20px;
    border-radius: 4px;
    font-family: 'Almendra', serif;
    font-size: 1rem;
    color: #1a1008;
    box-shadow: 0 8px 40px rgba(26, 16, 8, 0.5);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 300;
    max-width: 250px;
    text-align: center;
    line-height: 1.4;
  }
  .seal-blessing.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .wax-seal.pressed {
    transform: scale(0.9);
    transition: transform 0.1s ease;
  }
  .creature-entry.visible::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #8b6914;
    border-radius: 4px;
    opacity: 0;
    animation: borderGlow 1s ease-out forwards;
    pointer-events: none;
    z-index: 3;
  }
  @keyframes borderGlow {
    0% { opacity: 0; }
    50% { opacity: 0.5; }
    100% { opacity: 0; }
  }
  .creature-entry.highlight {
    box-shadow: 0 0 30px rgba(139, 105, 20, 0.4), 0 8px 40px rgba(26, 16, 8, 0.5);
    transform: translateY(-5px);
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  const particlesContainer = document.querySelector('.particles-container');
  const waxSeal = document.querySelector('.wax-seal');
  const creatureEntries = document.querySelectorAll('.creature-entry');
  const indexLinks = document.querySelectorAll('.index-link');
  const hearthGlow = document.querySelector('.hearth-glow');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function spawnParticle() {
    if (prefersReducedMotion) return;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * 100;
    const duration = Math.random() * 6 + 6;
    const delay = Math.random() * 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000);
  }

  if (!prefersReducedMotion) {
    setInterval(spawnParticle, 400);
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnParticle, i * 200);
    }
  }

  let sealActive = false;

  function activateSeal() {
    if (sealActive) return;
    sealActive = true;
    waxSeal.classList.add('pressed');
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const burstParticle = document.createElement('div');
        burstParticle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        const startX = 50 + (Math.random() * 20 - 10);
        const startY = 50 + (Math.random() * 20 - 10);
        burstParticle.style.width = `${size}px`;
        burstParticle.style.height = `${size}px`;
        burstParticle.style.left = `${startX}%`;
        burstParticle.style.top = `${startY}%`;
        burstParticle.style.background = '#ff6b35';
        burstParticle.style.boxShadow = '0 0 6px #c85a2a';
        burstParticle.style.animation = 'particleFloat 2s ease-out forwards';
        waxSeal.appendChild(burstParticle);
        setTimeout(() => burstParticle.remove(), 2000);
      }, i * 50);
    }
    const blessing = document.createElement('div');
    blessing.classList.add('seal-blessing');
    blessing.textContent = 'Спасибо за посещение — Да хранит тебя лес';
    document.body.appendChild(blessing);
    setTimeout(() => blessing.classList.add('visible'), 10);
    setTimeout(() => {
      blessing.classList.remove('visible');
      setTimeout(() => blessing.remove(), 500);
      waxSeal.classList.remove('pressed');
      sealActive = false;
    }, 3000);
  }

  waxSeal.addEventListener('click', activateSeal);
  waxSeal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateSeal();
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entryObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  creatureEntries.forEach(entry => {
    entryObserver.observe(entry);
  });

  let mouseX = 50;
  let mouseY = 50;
  let currentX = 50;
  let currentY = 50;

  document.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion) return;
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
  });

  function updateHearthGlow() {
    if (prefersReducedMotion) return;
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    hearthGlow.style.background = `radial-gradient(ellipse at ${currentX}% ${currentY}%, rgba(200, 90, 42, 0.15) 0%, transparent 50%)`;
    requestAnimationFrame(updateHearthGlow);
  }

  updateHearthGlow();

  indexLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEntry = document.querySelector(targetId);
      if (targetEntry) {
        const offset = 20;
        const targetPosition = targetEntry.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        targetEntry.classList.add('highlight');
        setTimeout(() => targetEntry.classList.remove('highlight'), 2000);
      }
    });
  });
});