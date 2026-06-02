document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // VELVET CURTAIN REVEAL
  // ============================================
  const curtainOverlay = document.querySelector('.curtain-overlay');
  
  setTimeout(() => {
    document.body.classList.add('loaded');
    
    // Remove curtain from DOM after animation completes
    setTimeout(() => {
      if (curtainOverlay) {
        curtainOverlay.style.display = 'none';
      }
    }, 3000);
  }, 500);

  // ============================================
  // SCROLL-TRIGGERED ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation for performance
        // scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and cards for scroll reveal
  const revealElements = document.querySelectorAll(
    '.performance-card, .tier, .performer-card, .section-title, .hero-frame'
  );
  
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    scrollObserver.observe(el);
  });

  // ============================================
  // SEAT SELECTION SYSTEM
  // ============================================
  const seats = document.querySelectorAll('.seat.available');
  const selectedSeats = new Set();
  
  seats.forEach(seat => {
    seat.addEventListener('click', () => {
      const seatId = seat.getAttribute('aria-label');
      
      if (selectedSeats.has(seatId)) {
        selectedSeats.delete(seatId);
        seat.classList.remove('selected');
        seat.style.background = '';
        seat.style.borderColor = '';
        seat.style.boxShadow = '';
      } else {
        selectedSeats.add(seatId);
        seat.classList.add('selected');
        seat.style.background = 'linear-gradient(135deg, #d4af37 0%, #c5a059 100%)';
        seat.style.borderColor = '#ffd700';
        seat.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.6)';
      }
      
      updateBookingSummary();
    });

    // Keyboard accessibility
    seat.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        seat.click();
      }
    });
  });

  function updateBookingSummary() {
    const count = selectedSeats.size;
    let summaryText = '';
    
    if (count > 0) {
      const seatsList = Array.from(selectedSeats).join(', ');
      summaryText = `Selected: ${count} seat(s) — ${seatsList}`;
      
      // Create or update floating booking indicator
      let indicator = document.querySelector('.booking-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'booking-indicator';
        document.body.appendChild(indicator);
      }
      
      indicator.textContent = summaryText;
      indicator.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, var(--crimson-deep) 0%, var(--crimson-velvet) 100%);
        color: var(--gold-bright);
        font-family: var(--font-display);
        font-size: 0.85rem;
        letter-spacing: 0.1em;
        padding: 1rem 1.5rem;
        border: 2px solid var(--gold-leaf);
        border-radius: 4px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        animation: slideInRight 0.4s ease-out;
        max-width: 300px;
        text-align: center;
      `;
      
      // Add continue button
      const continueBtn = document.createElement('button');
      continueBtn.textContent = 'Proceed to Booking';
      continueBtn.style.cssText = `
        display: block;
        margin-top: 0.8rem;
        background: var(--gold-leaf);
        color: var(--chocolate-dark);
        border: none;
        padding: 0.5rem 1rem;
        font-family: var(--font-display);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.3s ease;
      `;
      continueBtn.addEventListener('click', () => {
        showToast('Booking request submitted! The box office will contact you shortly.');
        selectedSeats.clear();
        document.querySelectorAll('.seat.selected').forEach(s => {
          s.classList.remove('selected');
          s.style.background = '';
          s.style.borderColor = '';
          s.style.boxShadow = '';
        });
        indicator.remove();
      });
      
      continueBtn.addEventListener('mouseenter', () => {
        continueBtn.style.background = 'var(--gold-bright)';
        continueBtn.style.transform = 'translateY(-2px)';
      });
      
      continueBtn.addEventListener('mouseleave', () => {
        continueBtn.style.background = 'var(--gold-leaf)';
        continueBtn.style.transform = 'translateY(0)';
      });
      
      indicator.appendChild(continueBtn);
    } else {
      const indicator = document.querySelector('.booking-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
  }

  // ============================================
  // BOOKING BUTTON TOAST NOTIFICATIONS
  // ============================================
  const bookButtons = document.querySelectorAll('.book-btn');
  
  bookButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const performanceName = btn.closest('.performance-card')
        .querySelector('.opera-name')
        .textContent;
      showToast(`Opening booking for ${performanceName}... Seats will be available soon.`);
    });
  });

  function showToast(message) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      background: linear-gradient(135deg, rgba(26, 15, 10, 0.98) 0%, rgba(74, 4, 4, 0.95) 100%);
      color: var(--gold-pale);
      font-family: var(--font-body);
      font-size: 1rem;
      padding: 1.2rem 1.8rem;
      border: 2px solid var(--gold-leaf);
      border-radius: 4px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      z-index: 2000;
      max-width: 350px;
      animation: slideInRight 0.5s ease-out;
      backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.5s ease-in forwards';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // ============================================
  // CHANDELIER MOUSE INTERACTION
  // ============================================
  const chandelier = document.querySelector('.chandelier');
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
  });

  function animateChandelier() {
    // Smooth follow
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    
    if (chandelier) {
      chandelier.style.transform = `translateX(calc(-50% + ${currentX}px)) rotate(${currentX * 0.3}deg)`;
    }
    
    requestAnimationFrame(animateChandelier);
  }
  
  animateChandelier();

  // ============================================
  // NAVIGATION SCROLL SPY
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold-bright)';
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => navObserver.observe(section));

  // ============================================
  // SMOOTH SCROLL FOR NAV LINKS
  // ============================================
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = 100;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // PERFORMANCE CARD TILT EFFECT
  // ============================================
  const cards = document.querySelectorAll('.performance-card, .performer-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================
  // PARALLAX EFFECT FOR BACKGROUND ELEMENTS
  // ============================================
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const chandelierHeight = chandelier ? chandelier.offsetHeight : 0;
    
    if (chandelier && scrolled < window.innerHeight) {
      // Move chandelier slightly slower than scroll for parallax
      chandelier.style.top = `${-20 + scrolled * 0.3}px`;
    }
  });

  // ============================================
  // KEYBOARD NAVIGATION ENHANCEMENTS
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Press 'C' to toggle curtain (Easter egg)
    if (e.key === 'c' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      document.body.classList.toggle('loaded');
      const curtain = document.querySelector('.curtain-overlay');
      if (curtain) {
        curtain.style.display = document.body.classList.contains('loaded') ? 'none' : 'flex';
      }
    }
  });

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================
  console.log('%c🎭 Royal Court Opera House %c| %cSeason 1724 %cReady',
    'font-family: Cinzel, serif; font-size: 1.2rem; color: #d4af37;',
    '',
    'font-family: Cormorant Garamond, serif; font-style: italic; color: #f4e4bc;',
    ''
  );
});

// Add CSS animation keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
  
  .seat.selected {
    animation: seatPulse 2s ease-in-out infinite;
  }
  
  @keyframes seatPulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
    }
    50% {
      box-shadow: 0 0 30px rgba(212, 175, 55, 0.9), 0 0 40px rgba(255, 215, 0, 0.4);
    }
  }
`;
document.head.appendChild(styleSheet);