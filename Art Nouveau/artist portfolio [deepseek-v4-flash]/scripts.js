/* =============================================
   Élodie Verrier · Art Nouveau Portfolio
   script.js
   ============================================= */

(function () {
  'use strict';

  // =============================================
  // DOM References
  // =============================================

  const hero = document.querySelector('.hero');
  const navLinks = document.querySelectorAll('.nav-link');
  const galleryPieces = document.querySelectorAll('.gallery-piece');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm = document.getElementById('contactForm');
  const glassPanels = document.querySelectorAll('.glass-panel');
  const stainedGlass = document.querySelector('.hero-stained-glass');

  // =============================================
  // Intersection Observer for Gallery Pieces
  // =============================================

  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  galleryPieces.forEach((piece, index) => {
    piece.style.transitionDelay = `${index * 0.1}s`;
    galleryObserver.observe(piece);
  });

  // =============================================
  // Stained Glass Parallax Effect
  // =============================================

  function updateStainedGlass(mouseX, mouseY) {
    if (!stainedGlass) return;

    const rect = stainedGlass.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (mouseX - centerX) / window.innerWidth;
    const deltaY = (mouseY - centerY) / window.innerHeight;

    glassPanels.forEach((panel, index) => {
      const speed = 0.02 + (index % 4) * 0.01;
      const x = deltaX * speed * 100;
      const y = deltaY * speed * 100;
      panel.style.transform = `translate(${x}px, ${y}px)`;
      panel.style.opacity = 0.03 + Math.abs(deltaX + deltaY) * 0.02;
    });
  }

  document.addEventListener('mousemove', (e) => {
    updateStainedGlass(e.clientX, e.clientY);
  });

  // =============================================
  // Navigation Active State & Smooth Scroll
  // =============================================

  function updateActiveNav() {
    const sections = ['home', 'gallery', 'about', 'contact'];
    let currentSection = 'home';

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.3) {
          currentSection = sectionId;
        }
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSection);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Smooth scroll for nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // =============================================
  // Scroll to Top Button
  // =============================================

  function toggleScrollTop() {
    if (window.pageYOffset > window.innerHeight * 0.5) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // =============================================
  // Gallery Piece Hover Effect - Gold Leaf
  // =============================================

  galleryPieces.forEach((piece) => {
    const frame = piece.querySelector('.piece-frame');
    const image = piece.querySelector('.image-placeholder');

    piece.addEventListener('mouseenter', () => {
      if (image) {
        image.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      }
    });

    piece.addEventListener('mouseleave', () => {
      if (image) {
        image.style.transform = 'scale(1)';
      }
    });

    // Gold shimmer effect on image hover
    if (frame) {
      frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (image) {
          image.style.backgroundPosition = `${x}% ${y}%`;
        }
      });
    }
  });

  // =============================================
  // Hero Parallax Effect
  // =============================================

  function heroParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-background');

    if (heroContent && scrolled < window.innerHeight) {
      const speed = 0.3;
      heroContent.style.transform = `translateY(${scrolled * speed}px)`;
      heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }

    if (heroBg && scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

  // =============================================
  // Contact Form Handling
  // =============================================

  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');

    // Animate input labels on focus
    formInputs.forEach((input) => {
      input.addEventListener('focus', () => {
        const label = input.previousElementSibling;
        if (label && label.classList.contains('form-label')) {
          label.style.color = 'var(--color-gold-light)';
        }
      });

      input.addEventListener('blur', () => {
        const label = input.previousElementSibling;
        if (label && label.classList.contains('form-label')) {
          label.style.color = '';
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.querySelector('.submit-text').textContent;

      // Simulate sending
      submitBtn.querySelector('.submit-text').textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Show success state
        submitBtn.querySelector('.submit-text').textContent = 'Message envoyé ✧';
        submitBtn.style.borderColor = 'var(--color-emerald)';
        submitBtn.style.color = 'var(--color-emerald)';

        // Reset form
        contactForm.reset();

        setTimeout(() => {
          submitBtn.querySelector('.submit-text').textContent = originalText;
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // =============================================
  // Scroll Indicator Click
  // =============================================

  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        const offset = 100;
        const targetPosition = gallerySection.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  }

  // =============================================
  // Section Reveal Animations
  // =============================================

  const sections = document.querySelectorAll('section');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const title = entry.target.querySelector('.section-title');
          const subtitle = entry.target.querySelector('.section-subtitle');
          const decoration = entry.target.querySelector('.section-decoration');

          if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              title.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
              title.style.opacity = '1';
              title.style.transform = 'translateY(0)';
            });
          }

          if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              subtitle.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s';
              subtitle.style.opacity = '1';
              subtitle.style.transform = 'translateY(0)';
            });
          }

          if (decoration) {
            decoration.style.opacity = '0';
            requestAnimationFrame(() => {
              decoration.style.transition = 'opacity 0.6s ease 0.1s';
              decoration.style.opacity = '1';
            });
          }

          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  sections.forEach((section) => {
    const title = section.querySelector('.section-title');
    if (title) {
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
      sectionObserver.observe(section);
    }
  });

  // =============================================
  // Iris Flower Animation Enhancement
  // =============================================

  const irisFlowers = document.querySelectorAll('.iris-flower');
  irisFlowers.forEach((iris) => {
    iris.style.animation = 'irisSway 6s ease-in-out infinite';
    iris.style.transformOrigin = 'bottom center';
  });

  // =============================================
  // Navigation Background Change on Scroll
  // =============================================

  const nav = document.querySelector('.whiplash-nav');

  function updateNavBackground() {
    if (window.pageYOffset > 100) {
      nav.style.background = 'rgba(26, 26, 26, 0.95)';
      nav.style.backdropFilter = 'blur(20px)';
    } else {
      nav.style.background = 'rgba(26, 26, 26, 0.8)';
    }
  }

  window.addEventListener('scroll', updateNavBackground, { passive: true });

  // =============================================
  // Vine Animation on Gallery Hover
  // =============================================

  const vinePaths = document.querySelectorAll('.vine-path');
  vinePaths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  // =============================================
  // Initial Load Animation
  // =============================================

  document.addEventListener('DOMContentLoaded', () => {
    // Animate hero elements on load
    const heroContent = document.querySelector('.hero-content');
    const heroElements = heroContent.querySelectorAll(
      '.hero-decoration, .artist-name, .hero-subtitle, .hero-iris, .scroll-indicator'
    );

    heroElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';

      setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 200 + index * 200);
    });

    // Animate stained glass on load
    glassPanels.forEach((panel, index) => {
      panel.style.opacity = '0';
      setTimeout(() => {
        panel.style.transition = 'opacity 1s ease';
        panel.style.opacity = '0.04';
      }, 100 + index * 100);
    });
  });

  // =============================================
  // Keyboard Navigation
  // =============================================

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        activeElement.blur();
      }
    }
  });

  // =============================================
  // Resize Handler
  // =============================================

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate any layout-dependent values if needed
      updateActiveNav();
    }, 250);
  });

})();