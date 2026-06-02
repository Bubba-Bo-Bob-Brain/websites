document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('section, .creature-card, .grimoire-page');
  animatedElements.forEach(el => el.classList.add('fade-in'));

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  const flames = document.querySelectorAll('.flame');
  flames.forEach(flame => {
    flame.style.animationDuration = `${Math.random() * 0.2 + 0.1}s`;
    flame.style.animationDelay = `${Math.random() * 0.2}s`;
  });

  const mainNav = document.querySelector('.main-nav');
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    .main-nav.scrolled {
      background-color: #2d1f14;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.6);
      border-bottom-color: #e6c65c;
    }
  `;
  document.head.appendChild(navStyle);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }, { passive: true });

  const mapMarkers = document.querySelectorAll('.map-marker');
  const markerStyle = document.createElement('style');
  markerStyle.textContent = `
    .map-marker.active::after {
      opacity: 1;
    }
    .map-marker:hover .marker-pulse,
    .map-marker.active .marker-pulse {
      animation-duration: 1s;
    }
  `;
  document.head.appendChild(markerStyle);

  mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      mapMarkers.forEach(m => m.classList.remove('active'));
      marker.classList.add('active');
    });

    marker.addEventListener('mouseenter', () => {
      marker.querySelector('.marker-pulse').style.animationDuration = '1s';
    });

    marker.addEventListener('mouseleave', () => {
      if (!marker.classList.contains('active')) {
        marker.querySelector('.marker-pulse').style.animationDuration = '2s';
      }
    });
  });

  const mapSection = document.querySelector('.map-section');
  const mapImage = document.querySelector('.map-image');

  window.addEventListener('scroll', () => {
    const sectionTop = mapSection.getBoundingClientRect().top;
    const scrollProgress = -sectionTop / (mapSection.offsetHeight - window.innerHeight);
    const parallaxValue = Math.max(-20, Math.min(20, scrollProgress * 30));
    mapImage.style.transform = `translateY(${parallaxValue}px)`;
  }, { passive: true });

  const prophecySection = document.querySelector('.prophecy-section');
  const prophecyText = document.querySelector('.prophecy-text');
  let prophecyRevealed = false;

  const prophecyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !prophecyRevealed) {
        prophecyRevealed = true;
        const originalHTML = prophecyText.innerHTML;
        const lines = originalHTML.split('<br>');
        prophecyText.innerHTML = lines.map((line, index) => {
          if (line.trim() === '') {
            return `<span class="prophecy-stanza-break" style="opacity: 0; animation: fadeInUp 0.5s ease forwards ${index * 0.2}s"></span>`;
          }
          return `<span class="prophecy-line" style="opacity: 0; animation: fadeInUp 0.5s ease forwards ${index * 0.2}s">${line}</span>`;
        }).join('');

        const prophecyStyle = document.createElement('style');
        prophecyStyle.textContent = `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .prophecy-line {
            display: block;
            margin-bottom: 0.3rem;
          }
          .prophecy-stanza-break {
            display: block;
            height: 1rem;
          }
        `;
        document.head.appendChild(prophecyStyle);
        prophecyObserver.unobserve(prophecySection);
      }
    });
  }, { threshold: 0.3 });

  prophecyObserver.observe(prophecySection);

  const grainOverlay = document.querySelector('.grain-overlay');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    grainOverlay.style.transform = `translate(${x}px, ${y}px)`;
  });
});