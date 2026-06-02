// ============================================
// TOMORROWLAND TOURS — 1960s SPACE AGE SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStarfield();
  initDeparturesBoard();
  initPanorama();
  initMascot();
  initBookingForm();
  initScrollAnimations();
  initLuggageTags();
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const nav = document.getElementById('mainNav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.style.background = 'linear-gradient(180deg, rgba(255,248,231,0.98) 0%, rgba(255,248,231,0.95) 100%)';
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      nav.style.background = 'linear-gradient(180deg, rgba(255,248,231,0.98) 0%, rgba(255,248,231,0.85) 100%)';
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
  
  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = nav.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// STARFIEL D BACKGROUND
// ============================================

function initStarfield() {
  const starfield = document.getElementById('starfield');
  if (!starfield) return;
  
  // Create additional dynamic stars
  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 2;
    
    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > 0.7 ? '#40E0D0' : Math.random() > 0.5 ? '#FF6B6B' : '#FFF'};
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: 0;
      animation: starTwinkle ${duration}s ease-in-out ${delay}s infinite;
      pointer-events: none;
    `;
    
    starfield.appendChild(star);
  }
  
  // Add shooting star
  setInterval(() => {
    createShootingStar(starfield);
  }, 8000);
}

function createShootingStar(container) {
  const star = document.createElement('div');
  const startX = Math.random() * 80 + 10;
  const startY = Math.random() * 30;
  
  star.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    background: #FFF;
    border-radius: 50%;
    left: ${startX}%;
    top: ${startY}%;
    box-shadow: 0 0 10px 2px #FFF, 0 0 20px 4px #40E0D0;
    pointer-events: none;
    z-index: 5;
  `;
  
  const tail = document.createElement('div');
  tail.style.cssText = `
    position: absolute;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FFF);
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 2px;
  `;
  
  star.appendChild(tail);
  container.appendChild(star);
  
  // Animate shooting star
  const endX = startX + (Math.random() * 20 + 10);
  const endY = startY + (Math.random() * 15 + 5);
  
  star.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${(endX - startX)}vw, ${(endY - startY)}vh) scale(0.5)`, opacity: 0 }
  ], {
    duration: 1500,
    easing: 'ease-out'
  }).addEventListener('finish', () => {
    star.remove();
  });
}

// Add keyframes for star twinkle
const starTwinkleStyle = document.createElement('style');
starTwinkleStyle.textContent = `
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;
document.head.appendChild(starTwinkleStyle);

// ============================================
// DEPARTURES BOARD
// ============================================

function initDeparturesBoard() {
  const boardRows = document.querySelectorAll('.board-row');
  
  // Animate rows on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, 100 + Array.from(boardRows).indexOf(entry.target) * 150);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  boardRows.forEach(row => observer.observe(row));
  
  // Flip clock effect for times
  const timeCells = document.querySelectorAll('.cell-time[data-flip]');
  
  setInterval(() => {
    timeCells.forEach(cell => {
      const currentTime = cell.textContent;
      const [hours, minutes] = currentTime.split(':').map(Number);
      
      // Add a few minutes
      let newMinutes = minutes + Math.floor(Math.random() * 3);
      let newHours = hours;
      
      if (newMinutes >= 60) {
        newMinutes -= 60;
        newHours = (newHours + 1) % 24;
      }
      
      const newTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      
      if (newTime !== currentTime) {
        flipTime(cell, newTime);
      }
    });
  }, 30000); // Update every 30 seconds
  
  // Random status changes
  setInterval(() => {
    const statuses = document.querySelectorAll('.cell-status');
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (Math.random() > 0.7) {
      const statusTexts = ['Boarding', 'On Time', 'On Time', 'On Time', 'Delayed', 'Final Call'];
      const statusClasses = ['status-boarding', 'status-ontime', 'status-ontime', 'status-ontime', 'status-delayed', 'status-boarding'];
      const randomIndex = Math.floor(Math.random() * statusTexts.length);
      
      randomStatus.textContent = statusTexts[randomIndex];
      randomStatus.className = 'cell-status ' + statusClasses[randomIndex];
    }
  }, 15000);
}

function flipTime(element, newTime) {
  const oldContent = element.textContent;
  
  // Create flip animation
  element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  element.style.transform = 'rotateX(-90deg)';
  element.style.opacity = '0';
  
  setTimeout(() => {
    element.textContent = newTime;
    element.style.transform = 'rotateX(0deg)';
    element.style.opacity = '1';
  }, 300);
}

// ============================================
// PARALLAX PANORAMA
// ============================================

function initPanorama() {
  const section = document.getElementById('experience');
  if (!section) return;
  
  const layers = {
    back: document.getElementById('layerBack'),
    mid: document.getElementById('layerMid'),
    front: document.getElementById('layerFront')
  };
  
  let ticking = false;
  
  const updateParallax = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      
      if (layers.back) {
        layers.back.style.transform = `translateY(${clampedProgress * -30}px)`;
      }
      if (layers.mid) {
        layers.mid.style.transform = `translateY(${clampedProgress * -60}px)`;
      }
      if (layers.front) {
        layers.front.style.transform = `translateY(${clampedProgress * -90}px)`;
      }
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  
  // Mouse parallax for planets
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    const planets = section.querySelectorAll('.distant-planet');
    planets.forEach((planet, index) => {
      const factor = (index + 1) * 15;
      planet.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

// ============================================
// MASCOT INTERACTIVITY
// ============================================

function initMascot() {
  const mascot = document.getElementById('mascotIllustration');
  const speech = document.getElementById('mascotSpeech');
  
  if (!mascot || !speech) return;
  
  // Track mouse for eye movement
  document.addEventListener('mousemove', (e) => {
    const eyes = mascot.querySelectorAll('.eye');
    const mascotRect = mascot.getBoundingClientRect();
    const mascotCenterX = mascotRect.left + mascotRect.width / 2;
    const mascotCenterY = mascotRect.top + mascotRect.height / 3;
    
    const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
    const distance = Math.min(5, Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY) / 50);
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    eyes.forEach(eye => {
      eye.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
  
  // Waving animation on click
  mascot.addEventListener('click', () => {
    const arm = mascot.querySelector('.arm-right');
    if (arm) {
      arm.style.transform = 'rotate(40deg)';
      arm.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        arm.style.transform = 'rotate(20deg)';
      }, 300);
      
      // Show speech bubble with animation
      speech.style.transform = 'scale(0.95)';
      speech.style.transition = 'transform 0.2s ease';
      
      setTimeout(() => {
        speech.style.transform = 'scale(1)';
      }, 200);
    }
  });
  
  // Blink animation
  const blinkEyes = () => {
    const eyes = mascot.querySelectorAll('.eye');
    eyes.forEach(eye => {
      eye.style.height = '2px';
      eye.style.transition = 'height 0.15s ease';
      
      setTimeout(() => {
        eye.style.height = '12px';
      }, 150);
    });
    
    setTimeout(blinkEyes, Math.random() * 4000 + 2000);
  };
  
  setTimeout(blinkEyes, 3000);
}

// ============================================
// BOOKING FORM
// ============================================

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  
  // Set minimum date to today
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
  
  // Destination change effects
  const destSelect = document.getElementById('bookingDest');
  const submitBtn = document.getElementById('bookingSubmit');
  
  if (destSelect && submitBtn) {
    destSelect.addEventListener('change', () => {
      const destinations = {
        'moon': { color: '#20B2AA', text: 'To the Moon!' },
        'mars': { color: '#E85D5D', text: 'Mars Bound!' },
        'orbit': { color: '#40E0D0', text: 'Orbital Luxury!' },
        'venus': { color: '#F0C040', text: 'Cloud City!' },
        'jupiter': { color: '#D4A017', text: 'Gas Giant!' }
      };
      
      const selected = destinations[destSelect.value];
      if (selected) {
        submitBtn.style.background = `linear-gradient(135deg, ${selected.color} 0%, ${selected.color}dd 100%)`;
        submitBtn.querySelector('.submit-text').textContent = selected.text;
      }
    });
  }
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('.booking-submit');
    const originalText = btn.querySelector('.submit-text').textContent;
    
    btn.querySelector('.submit-text').textContent = 'Launching...';
    btn.disabled = true;
    
    // Simulate booking process
    setTimeout(() => {
      btn.querySelector('.submit-text').textContent = 'Booked! ✓';
      btn.style.background = 'linear-gradient(135deg, #20B2AA 0%, #008B8B 100%)';
      
      // Reset after delay
      setTimeout(() => {
        btn.querySelector('.submit-text').textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1500);
  });
  
  // Input focus effects
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.02)';
      input.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .luggage-tag, .feature');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
          entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        });
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    revealObserver.observe(el);
  });
  
  // Parallax for hero elements
  const hero = document.querySelector('.hero');
  const heroPlanet = document.getElementById('heroPlanet');
  const saturnRing = document.getElementById('saturnRing');
  
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      if (heroPlanet) {
        heroPlanet.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      }
      
      if (saturnRing) {
        saturnRing.style.transform = `rotate(-20deg) translate(${x * 30}px, ${y * 15}px)`;
      }
    });
  }
}

// ============================================
// LUGGAGE TAG INTERACTIONS
// ============================================

function initLuggageTags() {
  const tags = document.querySelectorAll('.luggage-tag');
  
  tags.forEach(tag => {
    // Swing animation on hover
    tag.addEventListener('mouseenter', () => {
      const string = tag.querySelector('.tag-string');
      if (string) {
        string.style.transform = 'translateX(-50%) rotate(5deg)';
        string.style.transition = 'transform 0.4s ease';
        
        setTimeout(() => {
          string.style.transform = 'translateX(-50%) rotate(-3deg)';
        }, 200);
        
        setTimeout(() => {
          string.style.transform = 'translateX(-50%) rotate(0deg)';
        }, 400);
      }
    });
    
    // Destination preview on click
    tag.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      
      const destination = tag.dataset.destination;
      const tagBody = tag.querySelector('.tag-body');
      
      // Pulse effect
      tagBody.style.animation = 'tagPulse 0.6s ease';
      
      setTimeout(() => {
        tagBody.style.animation = '';
      }, 600);
    });
  });
  
  // Add tag pulse keyframes
  const tagPulseStyle = document.createElement('style');
  tagPulseStyle.textContent = `
    @keyframes tagPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(tagPulseStyle);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Random integer between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

prefersReducedMotion.addEventListener('change', (e) => {
  if (e.matches) {
    // Disable complex animations
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }
});

// Initialize reduced motion check
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c🚀 Tomorrowland Tours', 'font-size: 24px; font-weight: bold; color: #FF6B6B;');
console.log('%cSee the Solar System in Style!', 'font-size: 14px; color: #40E0D0;');
console.log('%cSince 1962 — The Future is Now', 'font-size: 12px; color: #F0C040; font-style: italic;');