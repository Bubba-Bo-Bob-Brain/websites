// Art Nouveau Gallery - Interactive Effects
document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll-Triggered Animations ---
  // Animate gallery items on scroll
  const galleryItems = document.querySelectorAll('.gallery-item');

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

  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  // Animate vine tendrils in the hero section on scroll
  const heroVines = document.querySelectorAll('.hero-border path, .hero-border circle, .hero-border .lily');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroVines.forEach((vine, index) => {
          vine.style.animationDelay = `${index * 0.2}s`;
          vine.style.opacity = '1';
        });
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.querySelector('.hero');
  if (heroSection) heroObserver.observe(heroSection);

  // --- Gold Leaf Shimmer Effect ---
  const galleryContainers = document.querySelectorAll('.gallery-image-container');

  galleryContainers.forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const goldLeaf = container.querySelector('.gold-leaf-overlay');
      if (goldLeaf) {
        goldLeaf.style.background = `
          radial-gradient(circle at ${x}px ${y}px, rgba(212, 163, 56, 0.6) 0%, transparent 20%),
          url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')
        `;
        goldLeaf.style.opacity = '0.4';
      }
    });

    container.addEventListener('mouseleave', () => {
      const goldLeaf = container.querySelector('.gold-leaf-overlay');
      if (goldLeaf) {
        goldLeaf.style.background = '';
        goldLeaf.style.opacity = '0';
      }
    });
  });

  // --- Vine Tendril Growth Animation ---
  const vineFrames = document.querySelectorAll('.vine-frame path');

  vineFrames.forEach(vine => {
    const length = vine.getTotalLength();
    vine.style.strokeDasharray = length;
    vine.style.strokeDashoffset = length;

    const container = vine.closest('.gallery-item');
    container.addEventListener('mouseenter', () => {
      vine.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
      vine.style.strokeDashoffset = '0';
    });

    container.addEventListener('mouseleave', () => {
      vine.style.transition = 'stroke-dashoffset 0.5s ease-in-out';
      vine.style.strokeDashoffset = length;
    });
  });

  // --- Keyboard Navigation for Gallery ---
  const galleryFigures = document.querySelectorAll('.gallery-item');

  galleryFigures.forEach((figure, index) => {
    figure.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        figure.click();
      }

      // Arrow key navigation
      if (e.key === 'ArrowRight' && index < galleryFigures.length - 1) {
        galleryFigures[index + 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        galleryFigures[index - 1].focus();
      }
    });
  });

  // --- Whiplash Navigation Highlight on Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-list a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // --- Performance Optimizations ---
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Additional scroll effects can be added here
        ticking = false;
      });
      ticking = true;
    }
  });
});