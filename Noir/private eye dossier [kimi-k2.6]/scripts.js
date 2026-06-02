// ============================================
// FILM NOIR CASE FILE — SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initSmokeTrail();
  initTabs();
  initCorkboardStrings();
  initRainEffect();
  initParallaxEffects();
  initVenetianBlinds();
  initPushpinEffects();
  initGrainShift();
});

// ============================================
// TYPEWRITER TEXT REVEAL
// ============================================

function initTypewriter() {
  const typewriterElements = document.querySelectorAll('.typewriter-text');
  
  typewriterElements.forEach(el => {
    const originalText = el.textContent.trim();
    el.textContent = '';
    el.dataset.text = originalText;
    el.classList.add('typing');
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.typed) {
        entry.target.dataset.typed = 'true';
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => typeOut(entry.target), delay);
      }
    });
  }, { threshold: 0.3 });
  
  typewriterElements.forEach(el => observer.observe(el));
}

function typeOut(element) {
  const text = element.dataset.text;
  let index = 0;
  const speed = 35;
  
  element.textContent = '';
  element.style.opacity = '1';
  
  function type() {
    if (index < text.length) {
      const char = text.charAt(index);
      element.textContent += char;
      index++;
      
      const variableSpeed = /[.!?]/.test(char) ? speed * 4 : speed;
      setTimeout(type, variableSpeed);
    }
  }
  
  type();
}

// ============================================
// SMOKE CURSOR TRAIL
// ============================================

function initSmokeTrail() {
  const canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let isMoving = false;
  let moveTimeout;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
    
    if (Math.random() > 0.3) {
      createSmokeParticle(mouseX, mouseY);
    }
  });
  
  function createSmokeParticle(x, y) {
    const speed = Math.sqrt(
      Math.pow(mouseX - lastMouseX, 2) + 
      Math.pow(mouseY - lastMouseY, 2)
    );
    
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      size: Math.random() * 15 + 5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -Math.random() * 0.8 - 0.2,
      opacity: Math.random() * 0.15 + 0.05,
      decay: Math.random() * 0.003 + 0.001,
      grow: Math.random() * 0.1 + 0.05
    });
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
  
  function updateSmoke() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      p.x += p.speedX;
      p.y += p.speedY;
      p.size += p.grow;
      p.opacity -= p.decay;
      
      if (p.opacity <= 0) {
        particles.splice(i, 1);
        continue;
      }
      
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size
      );
      gradient.addColorStop(0, `rgba(150, 150, 160, ${p.opacity})`);
      gradient.addColorStop(0.5, `rgba(120, 120, 130, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(100, 100, 110, 0)');
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    requestAnimationFrame(updateSmoke);
  }
  
  updateSmoke();
}

// ============================================
// TAB NAVIGATION
// ============================================

function initTabs() {
  const tabs = document.querySelectorAll('.file-tab');
  const sections = document.querySelectorAll('.case-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSection = tab.dataset.section;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById(targetSection);
      if (target) {
        target.classList.add('active');
      }
      
      if (targetSection === 'corkboard') {
        animateCorkboardStrings();
      }
      
      resetTypewriters(target);
    });
  });
}

function resetTypewriters(container) {
  const typewriters = container.querySelectorAll('.typewriter-text');
  typewriters.forEach(el => {
    if (!el.dataset.typed) {
      el.textContent = '';
    }
  });
}

// ============================================
// CORKBOARD STRING ANIMATIONS
// ============================================

function initCorkboardStrings() {
  const strings = document.querySelectorAll('.red-string');
  strings.forEach(s => {
    s.style.strokeDashoffset = s.getTotalLength();
  });
}

function animateCorkboardStrings() {
  const strings = document.querySelectorAll('.red-string');
  
  strings.forEach((str, index) => {
    const length = str.getTotalLength();
    str.style.strokeDasharray = length;
    str.style.strokeDashoffset = length;
    
    setTimeout(() => {
      str.style.transition = 'stroke-dashoffset 2s ease-out';
      str.style.strokeDashoffset = '0';
    }, index * 400 + 500);
  });
}

// ============================================
// RAIN EFFECT
// ============================================

function initRainEffect() {
  const rainOverlay = document.getElementById('rain-overlay');
  if (!rainOverlay) return;
  
  setTimeout(() => {
    rainOverlay.classList.add('active');
  }, 2000);
  
  let rainIntensity = 0.15;
  
  function fluctuateRain() {
    rainIntensity = 0.1 + Math.random() * 0.15;
    rainOverlay.style.opacity = rainIntensity;
    setTimeout(fluctuateRain, 2000 + Math.random() * 3000);
  }
  
  fluctuateRain();
}

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallaxEffects() {
  const lampPool = document.querySelector('.lamp-pool');
  
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    if (lampPool) {
      lampPool.style.transform = `translate(calc(-50% + ${x * 30}px), calc(-50% + ${y * 30}px))`;
    }
    
    const suspectCards = document.querySelectorAll('.suspect-card');
    suspectCards.forEach((card, index) => {
      const depth = (index % 2 === 0) ? 1 : -1;
      card.style.transform = `translate(${x * 2 * depth}px, ${y * 2 * depth}px)`;
    });
  });
}

// ============================================
// VENETIAN BLIND SHADOWS
// ============================================

function initVenetianBlinds() {
  const blinds = document.getElementById('venetian-blinds');
  if (!blinds) return;
  
  let blindsOffset = 0;
  
  function animateBlinds() {
    blindsOffset += 0.2;
    const skew = Math.sin(blindsOffset * 0.01) * 2;
    blinds.style.transform = `skewX(${skew}deg)`;
    requestAnimationFrame(animateBlinds);
  }
  
  animateBlinds();
}

// ============================================
// PUSH PIN EFFECTS
// ============================================

function initPushpinEffects() {
  const pushpins = document.querySelectorAll('.pushpin');
  
  pushpins.forEach(pin => {
    const parent = pin.parentElement;
    
    parent.addEventListener('mouseenter', () => {
      pin.style.transform = 'translateX(-50%) scale(1.3)';
      pin.style.transition = 'transform 0.2s ease';
    });
    
    parent.addEventListener('mouseleave', () => {
      pin.style.transform = 'translateX(-50%) scale(1)';
    });
  });
}

// ============================================
// FILM GRAIN SHIFT
// ============================================

function initGrainShift() {
  const grain = document.getElementById('grain-overlay');
  if (!grain) return;
  
  let offset = 0;
  
  function shiftGrain() {
    offset += 1;
    grain.style.backgroundPosition = `${offset % 200}px ${(offset * 0.7) % 200}px`;
    requestAnimationFrame(shiftGrain);
  }
  
  shiftGrain();
}

// ============================================
// ADDITIONAL ATMOSPHERE
// ============================================

// Random flicker effect for lamp
function initLampFlicker() {
  const lamp = document.querySelector('.lamp-pool');
  if (!lamp) return;
  
  function flicker() {
    const baseOpacity = 0.04;
    const flickerAmount = Math.random() * 0.02;
    lamp.style.opacity = baseOpacity + flickerAmount;
    
    const nextFlicker = Math.random() * 3000 + 1000;
    setTimeout(flicker, nextFlicker);
  }
  
  flicker();
}

initLampFlicker();

// Subtle ambient sound indicator (visual only)
function initAmbientPulse() {
  const header = document.querySelector('.case-header');
  if (!header) return;
  
  function pulse() {
    const stamp = header.querySelector('.classification-stamp');
    if (stamp) {
      stamp.style.opacity = 0.6 + Math.random() * 0.4;
    }
    setTimeout(pulse, 4000 + Math.random() * 2000);
  }
  
  pulse();
}

initAmbientPulse();

// Keyboard shortcut for quick navigation
document.addEventListener('keydown', (e) => {
  const tabs = document.querySelectorAll('.file-tab');
  const activeIndex = Array.from(tabs).findIndex(t => t.classList.contains('active'));
  
  if (e.key === 'ArrowRight' && activeIndex < tabs.length - 1) {
    tabs[activeIndex + 1].click();
  } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
    tabs[activeIndex - 1].click();
  }
});