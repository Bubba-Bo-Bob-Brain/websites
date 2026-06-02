/**
 * OTAKU PULSE - Interactive Scripts
 * Neo-Tokyo Editorial Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverElements = document.querySelectorAll('a, button, .featured-card, .panel-item, .character-card, input');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });
  } else {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
  }

  // --- 2. Navigation Scroll Behavior ---
  const nav = document.getElementById('mainNav');
  const navProgress = document.querySelector('.nav-progress');
  let lastScroll = 0;
  let ticking = false;

  function updateNav() {
    const currentScroll = window.scrollY;
    
    // Hide/Show nav
    if (currentScroll > lastScroll && currentScroll > 100) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    
    // Add scrolled class
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
    navProgress.style.width = `${scrollPercent}%`;
    
    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // --- 3. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.section-header, .featured-card, .panel-item, .anime-entry, .community-content, .footer-col');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', `reveal-delay-${(index % 4) + 1}`);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 50);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // --- 4. Hero Stat Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (easeOutExpo)
          const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentValue = Math.floor(easedProgress * endValue);
          
          target.textContent = currentValue.toLocaleString();
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = endValue.toLocaleString();
          }
        }
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => counterObserver.observe(stat));

  // --- 5. Character Spotlight Carousel ---
  const track = document.getElementById('carouselTrack');
  const cards = track ? track.querySelectorAll('.character-card') : [];
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentIndex = 0;
  let autoPlayInterval;

  function goToCard(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    
    cards.forEach(card => card.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    cards[index].classList.add('active');
    indicators[index].classList.add('active');
    currentIndex = index;
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      goToCard(currentIndex + 1);
    }, 6000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      goToCard(currentIndex - 1);
      startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      goToCard(currentIndex + 1);
      startAutoPlay();
    });
  }

  indicators.forEach((ind, idx) => {
    ind.addEventListener('click', () => {
      stopAutoPlay();
      goToCard(idx);
      startAutoPlay();
    });
  });

  if (cards.length > 0) startAutoPlay();

  // --- 6. Seasonal Tracker Tabs ---
  const tabs = document.querySelectorAll('.season-tab');
  const panels = document.querySelectorAll('.season-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${target}Panel`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- 7. Mobile Menu ---
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      menuBtn.classList.toggle('active');
      
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 8. Back to Top Button ---
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 9. Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      
      if (targetEl) {
        const offset = nav.offsetHeight + 20;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 10. Newsletter Form ---
  const newsletterForm = document.getElementById('newsletterForm');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      
      if (emailInput.value) {
        submitBtn.querySelector('.btn-text').textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
          submitBtn.querySelector('.btn-text').textContent = '✓ Subscribed!';
          submitBtn.style.background = 'var(--color-accent-green)';
          emailInput.value = '';
          
          setTimeout(() => {
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        }, 1500);
      }
    });
  }

  // --- 11. Parallax Effect for Hero Cards ---
  const heroCards = document.querySelectorAll('.hero-card');
  
  if (heroCards.length > 0 && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      heroCards.forEach((card, index) => {
        const factor = (index + 1) * 8;
        const rotateX = y * factor * 0.5;
        const rotateY = x * factor * 0.5;
        const translateX = x * factor;
        const translateY = y * factor;
        
        card.style.transform = `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });
  }

  // --- 12. Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollY = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.setProperty('--underline-width', '0%');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--color-text)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => requestAnimationFrame(highlightNavLink));

  console.log('🎌 Otaku Pulse initialized successfully');
});