document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMedium = document.getElementById('lightbox-medium');
  const lightboxYear = document.getElementById('lightbox-year');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryPieces = document.querySelectorAll('.gallery-piece');
  const navLinks = document.querySelectorAll('.nav-link');
  const ctaLink = document.querySelector('.cta-link');
  const submitBtn = document.querySelector('.submit-btn');
  const commissionForm = document.querySelector('.commission-form');
  const allInteractiveElements = document.querySelectorAll('a, button, .gallery-piece, input, textarea, .nav-link, .cta-link, .submit-btn');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isHoveringInteractive = false;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  allInteractiveElements.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      isHoveringInteractive = true;
      cursor.classList.add('hover-link');
    });
    el.addEventListener('mouseleave', function() {
      isHoveringInteractive = false;
      cursor.classList.remove('hover-link');
    });
  });

  function animateCursor() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.addEventListener('mousedown', function() {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(0.8)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });

  document.addEventListener('mouseup', function() {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = '1';
  });

  const themeClasses = [
    'placeholder-gold',
    'placeholder-emerald',
    'placeholder-amethyst',
    'placeholder-sapphire',
    'placeholder-ruby',
    'placeholder-opal'
  ];

  const themeGradients = {
    'placeholder-gold': 'linear-gradient(135deg, #3a3020 0%, #5a4a30 30%, #c9a24e 50%, #8a6e2f 70%, #2a2018 100%)',
    'placeholder-emerald': 'linear-gradient(135deg, #1a3025 0%, #2d5a4b 30%, #4a7c6b 50%, #2d5a4b 70%, #0f1f18 100%)',
    'placeholder-amethyst': 'linear-gradient(135deg, #2a1a30 0%, #5c3d6e 30%, #7d5a8f 50%, #5c3d6e 70%, #1a0f20 100%)',
    'placeholder-sapphire': 'linear-gradient(135deg, #0f1a28 0%, #1e3a5f 30%, #345e8a 50%, #1e3a5f 70%, #080f18 100%)',
    'placeholder-ruby': 'linear-gradient(135deg, #2a1518 0%, #7a2e3b 30%, #a34a56 50%, #7a2e3b 70%, #1a0d10 100%)',
    'placeholder-opal': 'linear-gradient(135deg, #1a2025 0%, #5c6e7a 30%, #8a9ba5 50%, #5c6e7a 70%, #0f1518 100%)'
  };

  function openLightbox(pieceElement) {
    const imageContainer = pieceElement.querySelector('.piece-image');
    const titleElement = pieceElement.querySelector('.piece-title');
    const mediumElement = pieceElement.querySelector('.piece-medium');
    const yearElement = pieceElement.querySelector('.piece-year');

    let themeClass = '';
    for (let i = 0; i < themeClasses.length; i++) {
      if (imageContainer.classList.contains(themeClasses[i])) {
        themeClass = themeClasses[i];
        break;
      }
    }

    lightboxImage.style.background = themeGradients[themeClass] || themeGradients['placeholder-gold'];
    lightboxImage.style.backgroundSize = 'cover';
    lightboxImage.style.backgroundPosition = 'center';

    const figureDiv = document.createElement('div');
    figureDiv.className = 'mucha-figure';
    figureDiv.style.position = 'absolute';
    figureDiv.style.width = '60%';
    figureDiv.style.height = '80%';
    figureDiv.style.top = '10%';
    figureDiv.style.left = '20%';
    figureDiv.style.background = 'radial-gradient(ellipse at center, rgba(245, 236, 215, 0.3) 0%, transparent 70%)';
    figureDiv.style.borderRadius = '40% 40% 30% 30%';

    const figureInner = document.createElement('div');
    figureInner.style.position = 'absolute';
    figureInner.style.top = '15%';
    figureInner.style.left = '30%';
    figureInner.style.width = '40%';
    figureInner.style.height = '25%';
    figureInner.style.background = 'radial-gradient(ellipse at center, rgba(245, 236, 215, 0.4) 0%, transparent 70%)';
    figureInner.style.borderRadius = '50%';
    figureDiv.appendChild(figureInner);

    const patternDiv = document.createElement('div');
    patternDiv.className = 'gilded-pattern';
    patternDiv.style.position = 'absolute';
    patternDiv.style.top = '0';
    patternDiv.style.left = '0';
    patternDiv.style.width = '100%';
    patternDiv.style.height = '100%';
    patternDiv.style.backgroundImage = 'radial-gradient(circle at 20% 30%, rgba(201, 162, 78, 0.4) 1px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(201, 162, 78, 0.3) 2px, transparent 2px), radial-gradient(circle at 50% 80%, rgba(201, 162, 78, 0.35) 1.5px, transparent 1.5px), radial-gradient(circle at 30% 70%, rgba(201, 162, 78, 0.25) 1px, transparent 1px), radial-gradient(circle at 70% 20%, rgba(201, 162, 78, 0.3) 2px, transparent 2px)';
    patternDiv.style.backgroundSize = '60px 60px, 80px 80px, 50px 50px, 70px 70px, 55px 55px';
    patternDiv.style.opacity = '0.5';

    lightboxImage.innerHTML = '';
    lightboxImage.style.position = 'relative';
    lightboxImage.appendChild(figureDiv);
    lightboxImage.appendChild(patternDiv);

    lightboxTitle.textContent = titleElement ? titleElement.textContent : 'Untitled';
    lightboxMedium.textContent = mediumElement ? mediumElement.textContent : '';
    lightboxYear.textContent = yearElement ? yearElement.textContent : '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    cursor.style.opacity = '0';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    cursor.style.opacity = '1';
  }

  galleryPieces.forEach(function(piece) {
    piece.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(piece);
    });

    piece.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(piece);
      }
    });
  });

  lightboxClose.addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  galleryPieces.forEach(function(piece, index) {
    piece.style.opacity = '0';
    piece.style.transform = 'translateY(40px)';
    piece.style.transition = 'opacity 0.8s ease ' + (index * 0.12) + 's, transform 0.8s ease ' + (index * 0.12) + 's';
    observer.observe(piece);
  });

  const sectionHeaders = document.querySelectorAll('.section-header, .about-title, .collection-content, .commission-card');
  sectionHeaders.forEach(function(el, index) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease ' + (index * 0.1) + 's, transform 0.8s ease ' + (index * 0.1) + 's';
    observer.observe(el);
  });

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  if (ctaLink) {
    ctaLink.addEventListener('click', function(e) {
      const targetId = ctaLink.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  if (commissionForm) {
    commissionForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const visionField = document.getElementById('vision');

      if (!nameField.value.trim() || !emailField.value.trim() || !visionField.value.trim()) {
        const missingFields = [];
        if (!nameField.value.trim()) missingFields.push('Nom');
        if (!emailField.value.trim()) missingFields.push('Courriel');
        if (!visionField.value.trim()) missingFields.push('Votre Vision');

        alert('Veuillez remplir tous les champs requis: ' + missingFields.join(', '));
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        alert('Veuillez entrer une adresse courriel valide.');
        return;
      }

      submitBtn.classList.add('submitting');
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      submitBtn.querySelector('.btn-text').textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      setTimeout(function() {
        submitBtn.querySelector('.btn-text').textContent = 'Envoyé avec succès!';
        submitBtn.style.borderColor = '#4a7c6b';
        submitBtn.style.color = '#4a7c6b';
        submitBtn.querySelector('.btn-whiplash').style.background = '#4a7c6b';

        commissionForm.reset();

        setTimeout(function() {
          submitBtn.classList.remove('submitting');
          submitBtn.querySelector('.btn-text').textContent = originalText;
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
          submitBtn.querySelector('.btn-whiplash').style.background = '';
          submitBtn.disabled = false;
        }, 2500);
      }, 1500);
    });
  }

  const stainedGlassPanel = document.querySelector('.stained-glass-panel');
  if (stainedGlassPanel) {
    stainedGlassPanel.addEventListener('mousemove', function(e) {
      const rect = stainedGlassPanel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / centerX * 3;
      const moveY = (y - centerY) / centerY * 3;

      const shards = stainedGlassPanel.querySelectorAll('.glass-shard');
      shards.forEach(function(shard, index) {
        const depth = (index + 1) * 2;
        shard.style.transform = 'translate(' + (moveX * depth) + 'px, ' + (moveY * depth) + 'px)';
        shard.style.transition = 'transform 0.3s ease-out';
      });
    });

    stainedGlassPanel.addEventListener('mouseleave', function() {
      const shards = stainedGlassPanel.querySelectorAll('.glass-shard');
      shards.forEach(function(shard) {
        shard.style.transform = 'translate(0, 0)';
        shard.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
      });
    });
  }

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / centerX * 10;
      const moveY = (y - centerY) / centerY * 10;

      const leftBurst = heroSection.querySelector('.left-burst');
      const rightBurst = heroSection.querySelector('.right-burst');

      if (leftBurst) {
        leftBurst.style.transform = 'translate(' + (-moveX * 0.5) + 'px, ' + (-moveY * 0.5) + 'px)';
        leftBurst.style.transition = 'transform 0.4s ease-out';
      }
      if (rightBurst) {
        rightBurst.style.transform = 'translate(' + (moveX * 0.5) + 'px, ' + (moveY * 0.5) + 'px)';
        rightBurst.style.transition = 'transform 0.4s ease-out';
      }
    });
  }

  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    const text = brandName.textContent;
    brandName.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.style.display = 'inline-block';
      span.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease';
      span.style.cursor = 'default';
      brandName.appendChild(span);
    }

    brandName.addEventListener('mouseenter', function() {
      const letters = brandName.querySelectorAll('span');
      letters.forEach(function(letter, index) {
        letter.style.transform = 'translateY(-5px)';
        letter.style.color = '#c9a24e';
        letter.style.transitionDelay = (index * 0.04) + 's';
      });
    });

    brandName.addEventListener('mouseleave', function() {
      const letters = brandName.querySelectorAll('span');
      letters.forEach(function(letter) {
        letter.style.transform = 'translateY(0)';
        letter.style.color = '';
        letter.style.transitionDelay = '0s';
      });
    });
  }

  window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.6s ease';
  });

  document.body.style.opacity = '0';
});