document.addEventListener('DOMContentLoaded', function () {
  const carouselTrack = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const transitionOverlay = document.getElementById('pageTransition');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  let currentSlide = 0;
  let autoPlayInterval;
  const totalSlides = slides.length;

  function updateCarousel(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    updateCarousel(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel(prevIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      nextSlide();
      startAutoPlay();
    });

    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', function(e) {
      const slideIndex = parseInt(this.getAttribute('data-slide'), 10);
      if (!isNaN(slideIndex)) {
        updateCarousel(slideIndex);
        startAutoPlay();
      }
    });
  });

  if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

  function simulatePageTransition(targetUrl) {
    if (transitionOverlay) {
      transitionOverlay.classList.add('active');
      setTimeout(() => {
        if (targetUrl && targetUrl !== '#') {
          window.location.href = targetUrl;
        } else {
          transitionOverlay.classList.remove('active');
        }
      }, 500);
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const parentItem = this.closest('.nav-item');
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      if (parentItem) {
        parentItem.classList.add('active');
      }
      simulatePageTransition(this.getAttribute('href'));
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      if (mainNav) {
        if (mainNav.style.display === 'flex') {
          mainNav.style.display = 'none';
        } else {
          mainNav.style.display = 'flex';
          mainNav.style.position = 'absolute';
          mainNav.style.top = '100%';
          mainNav.style.left = '0';
          mainNav.style.width = '100%';
          mainNav.style.background = 'rgba(10,9,12,0.95)';
          mainNav.style.padding = '1rem';
          mainNav.style.flexDirection = 'column';
          mainNav.style.backdropFilter = 'blur(10px)';
        }
      }
    });
  }

  const ctaButton = document.querySelector('.cta-btn');
  if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
      e.preventDefault();
      simulatePageTransition('#');
    });
  }

  const seasonCards = document.querySelectorAll('.season-card');
  seasonCards.forEach(card => {
    card.addEventListener('click', function() {
      simulatePageTransition('#');
    });
  });

  const mosaicItems = document.querySelectorAll('.mosaic-item');
  mosaicItems.forEach(item => {
    item.addEventListener('click', function() {
      simulatePageTransition('#');
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 900 && mainNav) {
      mainNav.style.display = '';
      mainNav.style.position = '';
      mainNav.style.width = '';
      mainNav.style.background = '';
      mainNav.style.padding = '';
      mainNav.style.flexDirection = '';
    }
  });
});