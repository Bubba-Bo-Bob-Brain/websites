(function() {
  const gallery = document.getElementById('characterGallery');
  if (!gallery) return;

  const cards = Array.from(gallery.querySelectorAll('.character-card'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((card, index) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(40px) scale(0.95)';
    card.style.transition = `opacity 0.7s ease ${index * 0.06}s, transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1) ${index * 0.06}s`;
    observer.observe(card);
  });

  const plagueMarks = document.querySelectorAll('.plague-mark');
  plagueMarks.forEach(mark => {
    mark.addEventListener('mouseenter', () => {
      mark.style.transform = 'scale(1.4)';
      mark.style.transition = 'transform 0.2s ease';
    });
    mark.addEventListener('mouseleave', () => {
      mark.style.transform = mark.classList.contains('severe') ? 'scale(1)' : 'scale(1)';
    });
  });

  const headerSkulls = document.querySelectorAll('.divider-skull');
  headerSkulls.forEach(skull => {
    skull.addEventListener('click', () => {
      document.body.style.transition = 'background-color 0.3s';
      const currentBg = getComputedStyle(document.body).backgroundColor;
      if (currentBg === 'rgb(18, 14, 11)') {
        document.body.style.backgroundColor = '#1a1210';
        setTimeout(() => { document.body.style.backgroundColor = '#120e0b'; }, 150);
      }
    });
  });

  const title = document.querySelector('.game-title');
  if (title) {
    title.addEventListener('mouseenter', () => {
      title.style.textShadow = '0 0 35px rgba(230,195,132,0.9), 0 0 15px #b14545, 0 6px 12px black';
      title.style.transition = 'text-shadow 0.3s ease';
    });
    title.addEventListener('mouseleave', () => {
      title.style.textShadow = '0 0 20px rgba(230,195,132,0.6), 0 4px 8px rgba(0,0,0,0.8)';
    });
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * -5;

      card.style.transform = `translateY(-8px) scale(1.02) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1) perspective(800px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.4s ease';
    });
  });

  const statBars = document.querySelectorAll('.stat-fill');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 50);
        statsObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  statBars.forEach(bar => statsObserver.observe(bar));

  const footer = document.querySelector('.main-footer');
  if (footer) {
    footer.addEventListener('click', () => {
      const yearEl = footer.querySelector('.footer-year');
      if (yearEl) {
        yearEl.style.color = '#b14545';
        yearEl.style.textShadow = '0 0 15px #8b3a3a';
        setTimeout(() => {
          yearEl.style.color = '';
          yearEl.style.textShadow = '';
        }, 600);
      }
    });
  }

  console.log('MORTAL VESPERS — The doomed await your gaze.');
})();