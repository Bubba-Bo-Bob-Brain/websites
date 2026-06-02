// === THE ORDER OF THE GILDED SEPULCHER ===
// Victorian Occult Society Directory — Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // GRANDFATHER CLOCK — Real-time Mechanism
  // ============================================
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const secondHand = document.getElementById('secondHand');
  const clockPendulum = document.getElementById('clockPendulum');

  function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Calculate hand positions
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours % 12 / 12) * 360 + (minutes / 60) * 30;

    if (secondHand) secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  }

  // Initialize clock
  updateClock();
  setInterval(updateClock, 1000);

  // Pendulum animation is handled via CSS, but we can add subtle variations
  if (clockPendulum) {
    setInterval(() => {
      const randomOffset = (Math.random() - 0.5) * 2;
      clockPendulum.style.animationDuration = `${1.8 + randomOffset}s`;
    }, 4000);
  }

  // Clock click interaction — chime sound simulation (visual feedback)
  const grandfatherClock = document.querySelector('.grandfather-clock');
  if (grandfatherClock) {
    grandfatherClock.addEventListener('click', () => {
      grandfatherClock.style.filter = 'drop-shadow(0 0 30px rgba(240, 192, 120, 0.8))';
      setTimeout(() => {
        grandfatherClock.style.filter = 'drop-shadow(0 0 10px rgba(212, 160, 86, 0.3))';
      }, 300);
    });
  }

  // ============================================
  // SEALED ENVELOPE INVITATION MECHANIC
  // ============================================
  const sealedEnvelope = document.getElementById('sealedEnvelope');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const invitationContent = document.getElementById('invitationContent');
  let envelopeOpen = false;

  function openEnvelope() {
    if (envelopeOpen) return;
    
    envelopeOpen = true;
    sealedEnvelope.classList.add('opened');
    
    // Hide envelope, show invitation after flap animation
    setTimeout(() => {
      sealedEnvelope.style.opacity = '0';
      sealedEnvelope.style.pointerEvents = 'none';
      
      setTimeout(() => {
        invitationContent.classList.add('visible');
      }, 300);
    }, 800);
  }

  if (sealedEnvelope) {
    sealedEnvelope.addEventListener('click', openEnvelope);
    sealedEnvelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  // Close invitation by clicking outside or on close button (if added)
  document.addEventListener('click', (e) => {
    if (envelopeOpen && invitationContent.classList.contains('visible')) {
      if (!invitationContent.contains(e.target) && !sealedEnvelope.contains(e.target)) {
        // Optional: close functionality
        // envelopeOpen = false;
        // invitationContent.classList.remove('visible');
        // sealedEnvelope.classList.remove('opened');
        // sealedEnvelope.style.opacity = '1';
        // sealedEnvelope.style.pointerEvents = 'auto';
      }
    }
  });

  // ============================================
  // MEMBER FILTERING — Hierarchy Navigation
  // ============================================
  const hierarchyBtns = document.querySelectorAll('.hierarchy-btn');
  const memberCards = document.querySelectorAll('.member-card');

  hierarchyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      hierarchyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCircle = btn.dataset.circle;

      // Filter members with animation
      memberCards.forEach((card, index) => {
        const cardCircle = card.dataset.circle;
        
        if (filterCircle === 'all' || cardCircle === filterCircle) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // Trigger reflow
          card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`;
        } else {
          card.classList.add('hidden');
        }
      });

      // Scroll to members section if needed
      const membersSection = document.querySelector('.members-section');
      if (membersSection && filterCircle !== 'all') {
        const firstVisibleCard = document.querySelector('.member-card:not(.hidden)');
        if (firstVisibleCard) {
          setTimeout(() => {
            firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
    });
  });

  // ============================================
  // SCROLL ANIMATIONS — Intersection Observer
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe section titles
  document.querySelectorAll('.section-title').forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(30px)';
    title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(title);
  });

  // Observe seance cards
  document.querySelectorAll('.seance-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    observer.observe(card);
  });

  // Observe member cards (initial state)
  document.querySelectorAll('.member-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // ============================================
  // AMBIENT GASLIGHT EFFECTS — Dynamic Flicker
  // ============================================
  const sconces = document.querySelectorAll('.gaslight-sconce');
  const chandelier = document.querySelector('.gaslight-chandelier');
  const ambient = document.querySelector('.gaslight-ambient');

  function randomFlicker() {
    sconces.forEach(sconce => {
      const randomOpacity = 0.4 + Math.random() * 0.4;
      const randomScale = 0.95 + Math.random() * 0.1;
      sconce.style.opacity = randomOpacity;
      sconce.style.transform = `scale(${randomScale})`;
    });

    if (chandelier) {
      const chandelierOpacity = 0.5 + Math.random() * 0.4;
      chandelier.style.opacity = chandelierOpacity;
    }

    if (ambient) {
      const ambientOpacity = 0.6 + Math.random() * 0.3;
      ambient.style.opacity = ambientOpacity;
    }
  }

  // Subtle random flicker every 2-4 seconds
  function scheduleFlicker() {
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      randomFlicker();
      scheduleFlicker();
    }, delay);
  }

  scheduleFlicker();

  // ============================================
  // PARALLAX EFFECT — Mouse Movement
  // ============================================
  const emblem = document.querySelector('.society-emblem');
  const headerContent = document.querySelector('.header-content');

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    if (emblem) {
      emblem.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
    }

    if (headerContent) {
      headerContent.style.transform = `translate(${mouseX * 5}px, ${mouseY * 5}px)`;
    }

    // Move gaslight sconces slightly based on mouse
    sconces.forEach((sconce, index) => {
      const factor = (index + 1) * 2;
      sconce.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px) scale(${0.95 + Math.random() * 0.1})`;
    });
  });

  // ============================================
  // DAGUERREOTYPE INTERACTIVE EFFECTS
  // ============================================
  memberCards.forEach(card => {
    const portrait = card.querySelector('.portrait-frame');
    
    card.addEventListener('mouseenter', () => {
      if (portrait) {
        portrait.style.transform = 'rotateY(5deg) rotateX(5deg)';
        portrait.style.transition = 'transform 0.6s ease';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (portrait) {
        portrait.style.transform = 'rotateY(0) rotateX(0)';
      }
    });

    // Click to "inspect" daguerreotype
    card.addEventListener('click', () => {
      const daguerreotype = card.querySelector('.daguerreotype');
      if (daguerreotype) {
        daguerreotype.style.transform = 'scale(1.1)';
        daguerreotype.style.transition = 'transform 0.4s ease';
        setTimeout(() => {
          daguerreotype.style.transform = 'scale(1)';
        }, 400);
      }
    });
  });

  // ============================================
  // SEANCE CARD HOVER EFFECTS
  // ============================================
  const seanceCards = document.querySelectorAll('.seance-card');
  
  seanceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const seal = card.querySelector('.seance-wax-seal');
      if (seal) {
        seal.style.transform = 'scale(1.1) rotate(15deg)';
        seal.style.transition = 'transform 0.4s ease';
      }
    });

    card.addEventListener('mouseleave', () => {
      const seal = card.querySelector('.seance-wax-seal');
      if (seal) {
        seal.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION ENHANCEMENTS
  // ============================================
  document.addEventListener('keydown', (e) => {
    // ESC to close invitation
    if (e.key === 'Escape' && envelopeOpen) {
      envelopeOpen = false;
      invitationContent.classList.remove('visible');
      sealedEnvelope.classList.remove('opened');
      sealedEnvelope.style.opacity = '1';
      sealedEnvelope.style.pointerEvents = 'auto';
    }

    // Number keys to filter hierarchy
    if (e.key >= '1' && e.key <= '5') {
      const btns = document.querySelectorAll('.hierarchy-btn');
      const index = parseInt(e.key) - 1;
      if (btns[index]) {
        btns[index].click();
      }
    }
  });

  // ============================================
  // CONSOLE EASTER EGG
  // ============================================
  console.log('%c🔮 The Order of the Gilded Sepulcher 🔮', 'color: #d4a056; font-size: 20px; font-family: serif; text-shadow: 0 0 10px rgba(212, 160, 86, 0.5);');
  console.log('%c"Per Aspera Ad Astra"', 'color: #c8a880; font-style: italic; font-size: 14px;');
  console.log('%cYou have found the hidden console. The Order watches.', 'color: #9a8060; font-size: 12px;');

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================
  console.log('%c✨ All systems initialized. Welcome, member.', 'color: #dcc08a; font-size: 11px;');
});