document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // SALOON DOORS & INTRO SEQUENCE
  // =========================================
  const saloonDoors = document.getElementById('saloon-doors');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const tumbleweedContainer = document.getElementById('tumbleweed-container');

  enterBtn.addEventListener('click', () => {
    saloonDoors.classList.add('entered');
    mainContent.classList.add('visible');
    tumbleweedContainer.classList.add('visible');
    
    // Initialize dust particles upon entry
    initDustParticles();
    
    // Initial cylinder spin for dramatic effect
    spinCylinderTo(0);
    
    // Remove doors from DOM flow after transition completes
    setTimeout(() => {
      saloonDoors.style.display = 'none';
    }, 1500);
  });

  // =========================================
  // DUST PARTICLE CANVAS SYSTEM
  // =========================================
  function initDustParticles() {
    const canvas = document.getElementById('dust-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 90;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class DustParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() * 0.8) + 0.2;
        this.speedY = (Math.random() * 0.3) - 0.1;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.life = Math.random() * 400 + 200;
        this.age = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.age++;
        
        // Fade out near end of life
        const lifeRatio = this.age / this.life;
        if (lifeRatio > 0.7) {
          this.opacity *= 0.98;
        }

        if (this.age > this.life || this.x > canvas.width + 20 || this.y > canvas.height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 196, 164, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new DustParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // =========================================
  // REVOLVER NAVIGATION & SECTION SWITCHING
  // =========================================
  const cylinder = document.getElementById('cylinder');
  const chambers = document.querySelectorAll('.chamber');
  const sections = document.querySelectorAll('section');
  let currentRotation = 0;
  let isSpinning = false;

  function spinCylinderTo(targetIndex) {
    if (isSpinning) return;
    isSpinning = true;

    const anglePerChamber = 60;
    const targetAngle = -(targetIndex * anglePerChamber);
    
    // Calculate shortest path with extra spins for effect
    const currentMod = currentRotation % 360;
    let diff = targetAngle - currentMod;
    if (diff > 0) diff -= 360; // Always spin counter-clockwise
    
    // Add 2 full rotations for mechanical feel
    currentRotation += diff - 720;
    
    cylinder.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      isSpinning = false;
    }, 800);
  }

  chambers.forEach((chamber, index) => {
    chamber.addEventListener('click', () => {
      if (chamber.classList.contains('active') || isSpinning) return;
      
      chambers.forEach(c => c.classList.remove('active'));
      chamber.classList.add('active');
      
      const sectionId = chamber.dataset.section;
      spinCylinderTo(index);
      switchSection(sectionId);
    });
  });

  function switchSection(sectionId) {
    sections.forEach(section => {
      section.classList.remove('active-section');
    });
    
    const target = document.getElementById(sectionId);
    if (target) {
      // Small delay to sync with cylinder spin
      setTimeout(() => {
        target.classList.add('active-section');
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  }

  // Set initial active state
  chambers[0].classList.add('active');

  // =========================================
  // SHERIFF STATS COUNTER ANIMATION
  // =========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStatCounter(element, targetValue) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out quart for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 4);
      element.textContent = Math.floor(ease * targetValue);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = targetValue;
      }
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.dataset.count, 10);
          animateStatCounter(stat, target);
        });
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) statsObserver.observe(aboutSection);

  // =========================================
  // TELEGRAPH FORM HANDLING
  // =========================================
  const telegraphForm = document.getElementById('telegraph-form');
  const formResponse = document.getElementById('form-response');

  if (telegraphForm) {
    telegraphForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = telegraphForm.querySelector('.submit-btn');
      const originalHTML = btn.innerHTML;
      
      btn.innerHTML = '<span class="btn-text">Transmitting via Western Union...</span>';
      btn.disabled = true;
      
      // Simulate transmission delay
      setTimeout(() => {
        formResponse.textContent = '⚡ Telegram received at Sheriff\'s Office. Deputy will dispatch to your location within 48 hours. Stay sharp.';
        formResponse.classList.add('show');
        btn.innerHTML = '<span class="btn-text">Message Dispatched</span> <span class="btn-icon">✓</span>';
        
        // Reset form after success
        setTimeout(() => {
          telegraphForm.reset();
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          setTimeout(() => formResponse.classList.remove('show'), 3000);
        }, 2500);
      }, 1800);
    });
  }

  // =========================================
  // POSTER HOVER TILT EFFECT (OPTIONAL POLISH)
  // =========================================
  const posters = document.querySelectorAll('.wanted-poster');
  
  posters.forEach(poster => {
    poster.addEventListener('mousemove', (e) => {
      const rect = poster.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      poster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    poster.addEventListener('mouseleave', () => {
      poster.style.transform = '';
    });
  });

  // =========================================
  // KEYBOARD NAVIGATION SUPPORT
  // =========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const current = document.querySelector('.chamber.active');
      const next = current?.nextElementSibling || chambers[0];
      next.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const current = document.querySelector('.chamber.active');
      const prev = current?.previousElementSibling || chambers[chambers.length - 1];
      prev.click();
    }
  });
});