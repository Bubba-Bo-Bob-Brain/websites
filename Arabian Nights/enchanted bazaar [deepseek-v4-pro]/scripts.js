(function() {
  'use strict';

  const body = document.body;
  const lanternGlow = document.getElementById('lanternGlow');
  const magicLampToggle = document.getElementById('magicLampToggle');
  const magicModal = document.getElementById('magicModal');
  const closeModal = document.getElementById('closeModal');
  const modalMessage = document.getElementById('modalMessage');
  const incenseCanvas = document.getElementById('incenseCanvas');
  const ctx = incenseCanvas.getContext('2d');
  const wishButtons = document.querySelectorAll('.wish-button');
  const storyContinue = document.querySelector('.story-continue');
  const lampCards = document.querySelectorAll('.magic-lamp-interactive');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;
  let particles = [];
  const maxParticles = 45;

  function updateMousePosition(event) {
    targetX = event.clientX;
    targetY = event.clientY;
  }

  function animateLanternGlow() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;
    if (lanternGlow) {
      lanternGlow.style.transform = `translate(${mouseX - 175}px, ${mouseY - 175}px)`;
    }
    requestAnimationFrame(animateLanternGlow);
  }

  document.addEventListener('mousemove', updateMousePosition);
  animateLanternGlow();

  function resizeCanvas() {
    incenseCanvas.width = window.innerWidth;
    incenseCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class IncenseParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 35 + 15;
      this.speedY = - (Math.random() * 0.4 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.life = 1.0;
      this.decay = Math.random() * 0.004 + 0.002;
      this.opacity = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.speedX + Math.sin(this.y * 0.02) * 0.3;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 1.002;
      return this.life > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.life * this.opacity * 0.5;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, 'rgba(230, 210, 170, 0.7)');
      gradient.addColorStop(0.5, 'rgba(200, 160, 100, 0.3)');
      gradient.addColorStop(1, 'rgba(150, 120, 80, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnIncense() {
    if (particles.length < maxParticles) {
      const startX = Math.random() * incenseCanvas.width;
      const startY = incenseCanvas.height * 0.7 + Math.random() * 80;
      particles.push(new IncenseParticle(startX, startY));
    }
  }

  function animateIncense() {
    if (!incenseCanvas || !ctx) return;
    ctx.clearRect(0, 0, incenseCanvas.width, incenseCanvas.height);
    particles = particles.filter(p => p.update());
    particles.forEach(p => p.draw(ctx));
    requestAnimationFrame(animateIncense);
  }

  setInterval(spawnIncense, 220);
  animateIncense();

  function showModal(message) {
    if (magicModal && modalMessage) {
      modalMessage.textContent = message || 'The merchant wraps your chosen treasure in silk and starlight.';
      magicModal.classList.add('revealed');
      magicModal.setAttribute('aria-hidden', 'false');
    }
  }

  function hideModal() {
    if (magicModal) {
      magicModal.classList.remove('revealed');
      magicModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (closeModal) {
    closeModal.addEventListener('click', hideModal);
  }

  if (magicModal) {
    magicModal.querySelector('.modal-backdrop').addEventListener('click', hideModal);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && magicModal && magicModal.classList.contains('revealed')) {
      hideModal();
    }
  });

  function handleWishButton(event) {
    const card = event.currentTarget.closest('.product-card');
    if (!card) return;
    const productNameElem = card.querySelector('.product-name');
    const productName = productNameElem ? productNameElem.textContent : 'mystical item';
    showModal(`You have added "${productName}" to your wishes. A merchant will attend to you shortly.`);
  }

  wishButtons.forEach(btn => {
    btn.addEventListener('click', handleWishButton);
  });

  function activateLampMagic(lampCard) {
    const lampGlow = lampCard.querySelector('.lamp-glow-hidden');
    const lampElement = lampCard.querySelector('.ornate-lamp');
    if (!lampGlow || !lampElement) return;

    lampGlow.style.opacity = '1';
    lampGlow.style.transition = 'opacity 0.2s ease';

    const productNameElem = lampCard.querySelector('.product-name');
    const name = productNameElem ? productNameElem.textContent : 'enchanted lamp';

    setTimeout(() => {
      lampGlow.style.opacity = '0';
      showModal(`The ${name} shimmers with ancient power! A wisp of magic escapes and circles around you.`);
    }, 900);

    setTimeout(() => {
      lampGlow.style.transition = 'opacity 0.8s ease';
    }, 1000);
  }

  lampCards.forEach(card => {
    const lampElement = card.querySelector('.ornate-lamp');
    if (!lampElement) return;

    let rubTimeout;
    let isRubbing = false;

    function startRub(event) {
      event.preventDefault();
      if (isRubbing) return;
      isRubbing = true;
      lampElement.style.transform = 'scale(0.96)';
      rubTimeout = setTimeout(() => {
        activateLampMagic(card);
        lampElement.style.transform = 'scale(1)';
        isRubbing = false;
      }, 700);
    }

    function cancelRub() {
      if (rubTimeout) {
        clearTimeout(rubTimeout);
        rubTimeout = null;
      }
      lampElement.style.transform = 'scale(1)';
      isRubbing = false;
    }

    lampElement.addEventListener('mousedown', startRub);
    lampElement.addEventListener('mouseup', cancelRub);
    lampElement.addEventListener('mouseleave', cancelRub);
    lampElement.addEventListener('touchstart', startRub, { passive: false });
    lampElement.addEventListener('touchend', cancelRub);
    lampElement.addEventListener('touchcancel', cancelRub);
  });

  if (magicLampToggle) {
    magicLampToggle.addEventListener('click', function() {
      const surpriseMessages = [
        'A playful djinn appears and juggles tiny flames before vanishing!',
        'The bazaar shifts slightly, as if time itself took a breath.',
        'A secret merchant offers you a glimpse of a map to hidden treasure.',
        'The scent of jasmine and old parchment fills the air.',
        'Stars rearrange themselves above the marketplace for a fleeting second.'
      ];
      const randomMsg = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
      showModal(randomMsg);
    });
  }

  if (storyContinue) {
    storyContinue.addEventListener('click', function() {
      const newStory = 'And so the tale continues, winding through the alleys of the bazaar where every shadow holds a story and every whisper is a spell. The merchants are never what they seem, and</p><p class="story-text">the true treasure is the journey itself. Butcher birds sing the songs of lost caravans, and400-year-old tea is served in cups that never empty. Would you like to hear more?';
      const storyScroll = document.querySelector('.story-scroll');
      if (storyScroll) {
        const newParagraph = document.createElement('p');
        newParagraph.className = 'story-text';
        newParagraph.innerHTML = newStory;
        storyScroll.appendChild(newParagraph);
        storyContinue.textContent = 'The tale deepens 📜';
      }
    });
  }

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  const productCards = document.querySelectorAll('.product-card');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  };

  const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1)';
      }
    });
  }, observerOptions);

  productCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    revealOnScroll.observe(card);
  });

  const sections = document.querySelectorAll('.bazaar-section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    sectionObserver.observe(section);
  });

})();