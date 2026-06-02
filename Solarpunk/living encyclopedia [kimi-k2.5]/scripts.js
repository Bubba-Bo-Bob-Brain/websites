/**
 * The Verdant Library - Solarpunk Encyclopedia
 * Bringing the organic interface to life through interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initSolarMeter();
  initNavigation();
  initSeedBank();
  initScrollAnimations();
  initInteractions();
});

/* ================================ PHOTOSYNTHESIS LOADER ================================ */
function initLoader() {
  const loader = document.getElementById('chlorophyll-loader');
  
  // Complete photosynthesis after animations finish
  setTimeout(() => {
    loader.classList.add('hidden');
    
    // Remove from DOM after fade out
    setTimeout(() => {
      loader.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 800);
  }, 3200);
}

/* ================================ SUNLIGHT INTENSITY METER ================================ */
function initSolarMeter() {
  const luxValue = document.getElementById('luxValue');
  const spectrumFill = document.getElementById('spectrumFill');
  const solarTime = document.getElementById('solarTime');
  const solarMeter = document.getElementById('solarMeter');
  const html = document.documentElement;
  
  // Solar cycle data simulating a day
  const solarCycle = [
    { level: 'high', lux: 12450, time: 'Solar Noon', fill: '5%', desc: 'Peak Photosynthesis' },
    { level: 'medium', lux: 8320, time: 'Golden Hour', fill: '35%', desc: 'Optimal Growth' },
    { level: 'low', lux: 2850, time: 'Late Afternoon', fill: '65%', desc: 'Slowing Metabolism' },
    { level: 'twilight', lux: 180, time: 'Civil Twilight', fill: '92%', desc: 'Starch Storage' },
    { level: 'high', lux: 11800, time: 'Morning Light', fill: '15%', desc: 'Activating Chloroplasts' }
  ];
  
  let cycleIndex = 0;
  let autoCycleInterval;
  
  function updateSolarLevel(index) {
    const data = solarCycle[index];
    
    // Animate value change
    animateValue(luxValue, parseInt(luxValue.textContent.replace(/,/g, '')), data.lux, 1000);
    solarTime.textContent = data.time;
    spectrumFill.style.width = data.fill;
    
    // Update theme
    html.setAttribute('data-sunlight-level', data.level);
    
    // Visual feedback - subtle pulse
    solarMeter.style.transform = 'scale(1.02)';
    setTimeout(() => {
      solarMeter.style.transform = '';
    }, 300);
  }
  
  // Auto cycle every 10 seconds
  function startAutoCycle() {
    autoCycleInterval = setInterval(() => {
      cycleIndex = (cycleIndex + 1) % solarCycle.length;
      updateSolarLevel(cycleIndex);
    }, 10000);
  }
  
  // Manual click to cycle
  solarMeter.addEventListener('click', () => {
    clearInterval(autoCycleInterval); // Pause auto-cycle on interaction
    cycleIndex = (cycleIndex + 1) % solarCycle.length;
    updateSolarLevel(cycleIndex);
    startAutoCycle(); // Restart timer
  });
  
  startAutoCycle();
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      element.textContent = end.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

/* ================================ VINE NAVIGATION ================================ */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const vineNav = document.getElementById('vineNav');
  const navNodes = document.querySelectorAll('.nav-node');
  const sections = document.querySelectorAll('section[id], .seed-bank-index[id]');
  
  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    vineNav.classList.toggle('open');
    const icon = mobileToggle.querySelector('i');
    
    if (vineNav.classList.contains('open')) {
      icon.classList.remove('fa-leaf');
      icon.classList.add('fa-times');
      icon.style.transform = 'rotate(90deg)';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-leaf');
      icon.style.transform = '';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!vineNav.contains(e.target) && !mobileToggle.contains(e.target)) {
      vineNav.classList.remove('open');
      const icon = mobileToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-leaf');
      icon.style.transform = '';
    }
  });
  
  // Smooth scroll navigation
  navNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = node.getAttribute('data-section');
      const target = document.getElementById(targetId);
      
      if (target) {
        // Update active state
        navNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        
        // Close mobile menu
        vineNav.classList.remove('open');
        
        // Smooth scroll with offset for header
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active section on scroll
  const scrollHandler = () => {
    let current = '';
    const scrollPos = window.pageYOffset + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navNodes.forEach(node => {
      node.classList.remove('active');
      if (node.getAttribute('data-section') === current) {
        node.classList.add('active');
      }
    });
  };
  
  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        scrollHandler();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ================================ SEED BANK INTERACTIONS ================================ */
function initSeedBank() {
  const seedPackets = document.querySelectorAll('.seed-packet');
  
  seedPackets.forEach((packet, index) => {
    // Staggered entrance animation delay
    packet.style.animationDelay = `${index * 0.1}s`;
    
    // Germination particle effect on hover
    packet.addEventListener('mouseenter', (e) => {
      createGerminationParticles(packet);
    });
    
    // Click interaction
    packet.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Germination animation
      packet.style.transform = 'scale(0.95) rotate(0deg)';
      
      setTimeout(() => {
        packet.style.transform = '';
        const title = packet.querySelector('h4').textContent;
        showToast(`Knowledge packet germinating: "${title}"`, 'success');
      }, 150);
    });
  });
}

function createGerminationPackets(parent) {
  const rect = parent.getBoundingClientRect();
  const colors = ['#606C38', '#8A9A5B', '#F4A261', '#E9C46A', '#D4A373'];
  
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    const size = 6 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50% ${50 + Math.random() * 20}% 50% 50%;
      pointer-events: none;
      z-index: 1000;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      transform: rotate(${Math.random() * 360}deg);
    `;
    
    document.body.appendChild(particle);
    
    // Organic movement animation
    const angle = (Math.PI * 2 * i) / 6 + (Math.random() * 0.5);
    const velocity = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 40;
    const rot = Math.random() * 180;
    
    const animation = particle.animate([
      { 
        transform: `translate(0, 0) rotate(0deg) scale(1)`, 
        opacity: 0.8 
      },
      { 
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 800 + Math.random() * 400,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    animation.onfinish = () => particle.remove();
  }
}

/* ================================ SCROLL ANIMATIONS ================================ */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Special handling for impact metrics
        if (entry.target.classList.contains('impact-list')) {
          animateMetrics(entry.target);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.article-section, .impl-card, .seed-packet, .pull-quote'
  );
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s, 
                           transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s`;
    observer.observe(el);
  });
  
  // Add in-view styles
  const style = document.createElement('style');
  style.textContent = `
    .in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

function animateMetrics(container) {
  const metrics = container.querySelectorAll('.impact-metric');
  
  metrics.forEach((metric, index) => {
    setTimeout(() => {
      const finalText = metric.textContent;
      const numericMatch = finalText.match(/-?\d+/);
      if (!numericMatch) return;
      
      const finalValue = parseInt(numericMatch[0]);
      const prefix = finalText.includes('+') ? '+' : finalText.includes('-') ? '-' : '';
      const suffix = finalText.includes('%') ? '%' : '';
      let current = 0;
      const increment = finalValue / 25;
      const isNegative = finalValue < 0;
      
      const timer = setInterval(() => {
        current += isNegative ? -Math.abs(increment) : increment;
        
        if ((isNegative && current <= finalValue) || (!isNegative && current >= finalValue)) {
          metric.textContent = finalText;
          clearInterval(timer);
          metric.style.transform = 'scale(1.2)';
          setTimeout(() => metric.style.transform = '', 200);
        } else {
          metric.textContent = `${prefix}${Math.floor(Math.abs(current))}${suffix}`;
        }
      }, 40);
    }, index * 200);
  });
}

/* ================================ GENERAL INTERACTIONS ================================ */
function initInteractions() {
  // Cultivate button
  const cultivateBtn = document.querySelector('.cultivate-btn');
  if (cultivateBtn) {
    cultivateBtn.addEventListener('click', function() {
      const originalHTML = this.innerHTML;
      const originalBg = this.style.background;
      
      this.innerHTML = '<i class="fas fa-seedling"></i> Germinating...';
      this.style.background = 'linear-gradient(135deg, #8A9A5B, #606C38)';
      
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Request Sent';
        showToast('Your cultivation request has been sent to the Network Gardeners!', 'success');
        
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.style.background = originalBg;
        }, 3000);
      }, 1500);
    });
  }
  
  // Wiki link hover effects (tooltip simulation)
  const wikiLinks = document.querySelectorAll('.wiki-link');
  wikiLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.cursor = 'pointer';
    });
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showToast(`Cross-reference: "${this.textContent}" - Knowledge branch connecting...`);
    });
  });
  
  // Parallax background effect on scroll
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const offset = lastScrollY * 0.05;
        document.body.style.backgroundPosition = `0px ${offset}px, 0px ${offset * 0.5}px`;
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('vineNav').classList.remove('open');
      const icon = document.querySelector('.mobile-nav-toggle i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-leaf');
      }
    }
  });
}

/* ================================ UTILITY FUNCTIONS ================================ */
function showToast(message, type = 'info') {
  // Remove existing toasts
  const existing = document.querySelector('.verdant-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'verdant-toast';
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-seedling';
  const color = type === 'success' ? '#606C38' : '#F4A261';
  
  toast.style.cssText = `
    position: fixed;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: rgba(40, 54, 24, 0.95);
    color: #FEFAE0;
    padding: 16px 28px;
    border-radius: 50px;
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.95rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 0 0 2px ${color};
    z-index: 10000;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 90vw;
    backdrop-filter: blur(10px);
  `;
  
  toast.innerHTML = `
    <i class="fas ${icon}" style="color: ${color}; font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  
  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// Germination particles alias for consistency
function createGerminationParticles(parent) {
  createGerminationPackets(parent);
}