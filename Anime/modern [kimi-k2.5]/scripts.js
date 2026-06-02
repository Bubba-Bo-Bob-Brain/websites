/**
 * INK & FRAME - Anime & Manga Universe
 * Interactive Scripts
 * Features: Custom cursor, Speed lines canvas, Character carousel, Scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initLoader();
  initCustomCursor();
  initSpeedLines();
  initMobileMenu();
  initCharacterCarousel();
  initScrollAnimations();
  initNavbarScroll();
  initSmoothScroll();
});

/**
 * Loading Screen
 * Simulates loading progress and fades out
 */
function initLoader() {
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loading-progress');
  
  if (!loader || !progress) return;

  // Animate progress bar
  setTimeout(() => {
    progress.style.width = '100%';
  }, 100);

  // Remove loader after animation
  setTimeout(() => {
    loader.classList.add('loader-hidden');
    
    // Trigger hero animations after load
    setTimeout(() => {
      document.querySelectorAll('.hero-text').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1}s`;
        el.classList.add('animate');
      });
    }, 500);
    
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 2200);
}

/**
 * Custom Cursor
 * Magnetic effect with hover scaling
 */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  
  if (!cursor || !cursorDot) return;
  
  // Check for touch device
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation
  function animateCursor() {
    // Outer cursor (laggy)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Inner dot (snappy)
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverables = document.querySelectorAll('a, button, .manga-panel, .anime-card, .character-card');
  
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
}

/**
 * Speed Lines Canvas Animation
 * Creates radial speed lines emanating from center
 */
function initSpeedLines() {
  const canvas = document.getElementById('speed-lines');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let lines = [];
  let animationId;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  // Line class
  class SpeedLine {
    constructor() {
      this.reset();
    }
    
    reset() {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200;
      this.x = width / 2 + Math.cos(angle) * distance;
      this.y = height / 2 + Math.sin(angle) * distance;
      this.angle = angle;
      this.speed = 2 + Math.random() * 4;
      this.length = 20 + Math.random() * 50;
      this.width = 0.5 + Math.random() * 1.5;
      this.opacity = 0;
      this.maxOpacity = 0.1 + Math.random() * 0.2;
      this.life = 0;
      this.maxLife = 100 + Math.random() * 100;
    }
    
    update() {
      this.life++;
      const progress = this.life / this.maxLife;
      
      // Fade in then out
      if (progress < 0.2) {
        this.opacity = (progress / 0.2) * this.maxOpacity;
      } else if (progress > 0.8) {
        this.opacity = ((1 - progress) / 0.2) * this.maxOpacity;
      }
      
      // Move outward from center
      const moveX = Math.cos(this.angle) * this.speed;
      const moveY = Math.sin(this.angle) * this.speed;
      this.x += moveX;
      this.y += moveY;
      
      if (this.life >= this.maxLife || 
          this.x < -this.length || this.x > width + this.length ||
          this.y < -this.length || this.y > height + this.length) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';
      
      const endX = this.x + Math.cos(this.angle) * this.length;
      const endY = this.y + Math.sin(this.angle) * this.length;
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    }
  }
  
  // Initialize lines
  for (let i = 0; i < 50; i++) {
    lines.push(new SpeedLine());
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    lines.forEach(line => {
      line.update();
      line.draw();
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Only animate when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
      } else {
        cancelAnimationFrame(animationId);
      }
    });
  });
  
  observer.observe(canvas);
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = menu?.querySelectorAll('.mobile-link');
  
  if (!toggle || !menu) return;
  
  let isOpen = false;
  
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    
    if (isOpen) {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close on link click
  links?.forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Character Spotlight Carousel
 * 3D-style card transitions
 */
function initCharacterCarousel() {
  const cards = document.querySelectorAll('.character-card');
  const prevBtn = document.getElementById('char-prev');
  const nextBtn = document.getElementById('char-next');
  const dots = document.querySelectorAll('#char-dots span');
  
  if (!cards.length) return;
  
  let currentIndex = 0;
  const total = cards.length;
  
  function updateCarousel() {
    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next', 'hidden');
      
      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === (currentIndex - 1 + total) % total) {
        card.classList.add('prev');
      } else if (index === (currentIndex + 1) % total) {
        card.classList.add('next');
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('bg-ink', index === currentIndex);
      dot.classList.toggle('bg-gray-300', index !== currentIndex);
    });
  }
  
  function next() {
    currentIndex = (currentIndex + 1) % total;
    updateCarousel();
  }
  
  function prev() {
    currentIndex = (currentIndex - 1 + total) % total;
    updateCarousel();
  }
  
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
  
  // Auto-advance every 6 seconds
  setInterval(next, 6000);
  
  updateCarousel();
}

/**
 * GSAP Scroll Animations
 * Parallax and reveal effects
 */
function initScrollAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded, using fallback animations');
    initFallbackAnimations();
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Seasonal cards stagger
  gsap.from('.anime-card', {
    scrollTrigger: {
      trigger: '#seasonal-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });
  
  // Manga panels reveal
  gsap.from('.manga-panel', {
    scrollTrigger: {
      trigger: '#manga',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });
  
  // News articles
  gsap.from('#news article', {
    scrollTrigger: {
      trigger: '#news',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  });
  
  // Parallax effects
  gsap.to('.halftone-overlay', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    },
    backgroundPosition: '0 100px'
  });
  
  // Hero parallax
  gsap.to('header img', {
    scrollTrigger: {
      trigger: 'header',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 100,
    scale: 1.1
  });
}

/**
 * Fallback animations if GSAP fails
 */
function initFallbackAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.anime-card, .manga-panel, #news article').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/**
 * Navbar Hide/Show on Scroll
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
          if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
          } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
          }
        } else {
          navbar.style.transform = 'translateY(0)';
          navbar.style.backgroundColor = 'transparent';
        }
        
        lastScroll = currentScroll;
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed nav
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Manga Panel Hover Effects
 * Adds dynamic tilt and sound-like feedback
 */
document.querySelectorAll('.manga-panel').forEach(panel => {
  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  panel.addEventListener('mouseleave', () => {
    panel.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    panel.style.transition = 'transform 0.5s ease';
  });
  
  panel.addEventListener('mouseenter', () => {
    panel.style.transition = 'transform 0.1s ease';
  });
});

/**
 * Anime Card Tilt Effect
 */
document.querySelectorAll('.anime-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/**
 * Form Handling
 */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = 'SUBSCRIBED!';
    button.style.backgroundColor = 'var(--color-manga-cyan)';
    button.style.color = 'var(--color-ink)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
      button.style.color = '';
      form.reset();
    }, 3000);
  });
});

/**
 * Performance: Pause animations when tab is hidden
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.classList.add('paused');
  } else {
    document.body.classList.remove('paused');
  }
});