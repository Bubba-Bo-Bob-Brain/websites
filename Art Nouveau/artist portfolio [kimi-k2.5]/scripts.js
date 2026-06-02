/**
 * Art Nouveau Portfolio - Interactive Scripts
 * Elara Vance Portfolio & Gallery
 * 
 * Features:
 * - Organic scroll animations with Intersection Observer
 * - Parallax effects for decorative vines and elements
 * - Mobile navigation with smooth transitions
 * - Form interactions with validation feedback
 * - Staggered reveal animations for gallery items
 * - Custom cursor effects for immersive experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavigation();
  initScrollAnimations();
  initParallaxEffects();
  initGalleryInteractions();
  initFormHandling();
  initCustomCursor();
});

/* ============================================
   NAVIGATION MODULE
   ============================================ */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  let lastScroll = 0;

  // Scroll-based navbar styling
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for background effect
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll direction (optional enhancement)
    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle with animation
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isActive = navLinks.classList.contains('active');
      
      // Animate hamburger to X
      const spans = mobileMenuBtn.querySelectorAll('span');
      if (isActive) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      });
    });
  }

  // Smooth scroll for anchor links with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Add stagger delay for children if it's a container
        if (entry.target.classList.contains('stagger-children')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 150);
          });
        }
      }
    });
  }, observerOptions);

  // Elements to animate
  const animateElements = [
    '.gallery-item',
    '.text-panel',
    '.portrait-frame',
    '.section-divider',
    '.form-group',
    '.section-header',
    '.hero-content > *'
  ];

  animateElements.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
      observer.observe(el);
    });
  });

  // Add revealed class styling via JS to ensure it applies
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallaxEffects() {
  const vines = document.querySelectorAll('.hero-vines');
  const dividers = document.querySelectorAll('.section-divider');
  
  // Check for touch device to disable parallax on mobile
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        // Parallax for side vines (different speeds for left and right)
        vines.forEach((vine, index) => {
          const speed = index === 0 ? 0.5 : 0.3;
          vine.style.transform = `translateY(${scrolled * speed}px) ${index === 1 ? 'scaleX(-1)' : ''}`;
        });

        // Subtle rotation for dividers based on scroll
        dividers.forEach((divider, index) => {
          const rect = divider.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = (center - viewportCenter) / window.innerHeight;
          const rotation = distance * 5; // Max 5 degrees
          
          divider.style.transform = `rotate(${rotation}deg)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   GALLERY INTERACTIONS
   ============================================ */
function initGalleryInteractions() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Create lightbox dynamically
  const lightbox = document.createElement('div');
  lightbox.className = 'art-nouveau-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <div class="lightbox-frame">
        <img src="" alt="" class="lightbox-image">
        <div class="lightbox-caption">
          <h3 class="lightbox-title"></h3>
          <p class="lightbox-meta"></p>
        </div>
      </div>
      <button class="lightbox-nav prev" aria-label="Previous">&larr;</button>
      <button class="lightbox-nav next" aria-label="Next">&rarr;</button>
    </div>
  `;
  
  // Add lightbox styles
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    .art-nouveau-lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
    }
    
    .art-nouveau-lightbox.active {
      opacity: 1;
      visibility: visible;
    }
    
    .lightbox-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(44, 36, 27, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .lightbox-content {
      position: relative;
      z-index: 2;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .lightbox-frame {
      position: relative;
      padding: 20px;
      background: var(--color-parchment);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    
    .lightbox-frame::before {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border: 1px solid var(--color-gold);
      pointer-events: none;
    }
    
    .lightbox-image {
      max-width: 80vw;
      max-height: 70vh;
      object-fit: contain;
      display: block;
    }
    
    .lightbox-caption {
      text-align: center;
      padding: 1.5rem 1rem 0.5rem;
      color: var(--color-ink);
    }
    
    .lightbox-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .lightbox-meta {
      font-family: var(--font-accent);
      font-style: italic;
      color: var(--color-ink-light);
      font-size: 0.95rem;
    }
    
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: var(--color-parchment);
      font-size: 2.5rem;
      cursor: pointer;
      line-height: 1;
      transition: color 0.3s;
    }
    
    .lightbox-close:hover {
      color: var(--color-gold);
    }
    
    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(245, 240, 230, 0.1);
      border: 1px solid var(--color-gold);
      color: var(--color-parchment);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .lightbox-nav:hover {
      background: var(--color-gold);
      color: var(--color-ink);
    }
    
    .lightbox-nav.prev { left: -80px; }
    .lightbox-nav.next { right: -80px; }
    
    @media (max-width: 768px) {
      .lightbox-nav.prev { left: 10px; }
      .lightbox-nav.next { right: 10px; }
      .lightbox-nav {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }
    }
  `;
  
  document.head.appendChild(lightboxStyles);
  document.body.appendChild(lightbox);

  // Lightbox functionality
  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    title: item.querySelector('.artwork-title').textContent,
    meta: item.querySelector('.artwork-meta').textContent
  }));

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

  // Navigation
  lightbox.querySelector('.prev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  });

  lightbox.querySelector('.next').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }
  });

  function updateLightbox() {
    const img = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const meta = lightbox.querySelector('.lightbox-meta');
    
    // Fade effect
    img.style.opacity = '0';
    
    setTimeout(() => {
      img.src = images[currentIndex].src;
      title.textContent = images[currentIndex].title;
      meta.textContent = images[currentIndex].meta;
      img.style.opacity = '1';
    }, 200);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Hover effect enhancement for vine frames
  galleryItems.forEach(item => {
    const frame = item.querySelector('.vine-frame');
    const svg = frame.querySelector('svg');
    
    item.addEventListener('mouseenter', () => {
      // Subtle gold shimmer effect
      svg.style.filter = 'drop-shadow(0 0 8px rgba(201, 176, 55, 0.6))';
      svg.style.transition = 'filter 0.4s ease';
    });
    
    item.addEventListener('mouseleave', () => {
      svg.style.filter = 'none';
    });
  });
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initFormHandling() {
  const form = document.getElementById('commissionForm');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission with visual feedback
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      
      // Loading state
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending...';
      submitBtn.style.opacity = '0.7';
      
      // Simulate network request
      setTimeout(() => {
        // Success state
        submitBtn.querySelector('.btn-text').textContent = 'Inquiry Sent!';
        submitBtn.style.background = 'var(--color-emerald)';
        submitBtn.style.borderColor = 'var(--color-emerald)';
        
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-message';
        successMsg.innerHTML = `
          <p style="color: var(--color-gold); margin-top: 1.5rem; font-style: italic; text-align: center; opacity: 0; transform: translateY(10px); transition: all 0.5s ease;">
            Thank you for your inquiry. I shall respond within three days.
          </p>
        `;
        form.appendChild(successMsg);
        
        // Trigger animation
        setTimeout(() => {
          successMsg.querySelector('p').style.opacity = '1';
          successMsg.querySelector('p').style.transform = 'translateY(0)';
        }, 100);
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.opacity = '1';
          successMsg.remove();
        }, 5000);
        
      }, 1500);
    });

    // Input focus effects for floating labels
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  }
}

/* ============================================
   CUSTOM CURSOR EFFECT (Desktop only)
   ============================================ */
function initCustomCursor() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const cursor = document.createElement('div');
  cursor.className = 'art-nouveau-cursor';
  
  const cursorStyles = document.createElement('style');
  cursorStyles.textContent = `
    .art-nouveau-cursor {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-gold);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      transition: transform 0.15s ease, opacity 0.15s ease;
      mix-blend-mode: difference;
    }
    
    .art-nouveau-cursor.hover {
      transform: scale(2);
      background: rgba(201, 176, 55, 0.1);
    }
    
    .art-nouveau-cursor.click {
      transform: scale(0.8);
    }
    
    @media (max-width: 1024px) {
      .art-nouveau-cursor { display: none; }
    }
  `;
  
  document.head.appendChild(cursorStyles);
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor following
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const interactiveElements = document.querySelectorAll('a, button, .gallery-item, input, select, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // Click states
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

/* ============================================
   ADDITIONAL ENHANCEMENTS
   ============================================ */

// Preload critical images
window.addEventListener('load', () => {
  const criticalImages = document.querySelectorAll('.hero img, .portrait-image-container img');
  criticalImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });
});

// Add subtle noise texture animation for depth
function initNoiseAnimation() {
  const overlay = document.querySelector('.grain-overlay');
  if (!overlay) return;
  
  let frame = 0;
  function animateNoise() {
    frame++;
    if (frame % 3 === 0) { // Update every 3rd frame for performance
      overlay.style.transform = `translate(${Math.random() * 10}px, ${Math.random() * 10}px)`;
    }
    requestAnimationFrame(animateNoise);
  }
  // Uncomment to enable subtle noise movement:
  // animateNoise();
}

// Initialize noise if desired
// initNoiseAnimation();

console.log('🎨 Art Nouveau Portfolio Initialized - Elara Vance');