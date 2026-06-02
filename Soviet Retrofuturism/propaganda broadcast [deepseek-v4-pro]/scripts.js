document.addEventListener('DOMContentLoaded', function() {
  const tickerTape = document.getElementById('tickerTape');
  if (tickerTape) {
    tickerTape.innerHTML = tickerTape.innerHTML + tickerTape.innerHTML;
  }

  const timeValue = document.getElementById('timeValue');
  function updateCosmoTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (timeValue) {
      timeValue.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }
  updateCosmoTime();
  setInterval(updateCosmoTime, 1000);

  const progressBars = document.querySelectorAll('.bar-fill');
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
          bar.style.width = targetWidth + '%';
        }
        observer.unobserve(bar);
      }
    });
  }, observerOptions);

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });

  const heroPoster = document.getElementById('heroPoster');
  const posterModal = document.getElementById('posterModal');
  const closeModal = document.getElementById('closeModal');

  if (heroPoster && posterModal && closeModal) {
    heroPoster.addEventListener('click', function() {
      posterModal.classList.add('active');
    });

    closeModal.addEventListener('click', function() {
      posterModal.classList.remove('active');
    });

    posterModal.addEventListener('click', function(event) {
      if (event.target === posterModal) {
        posterModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && posterModal.classList.contains('active')) {
        posterModal.classList.remove('active');
      }
    });
  }

  const partyButton = document.querySelector('.party-button');
  if (partyButton) {
    partyButton.addEventListener('click', function(e) {
      e.stopPropagation();
      const originalText = this.textContent;
      this.textContent = 'ЗАЯВКА ПРИНЯТА!';
      this.style.background = '#2e7d32';
      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = '';
        if (posterModal) {
          posterModal.classList.remove('active');
        }
      }, 2000);
    });
  }

  const staticOverlay = document.querySelector('.static-overlay');
  if (staticOverlay) {
    let staticTimeout;
    function triggerStaticBurst() {
      staticOverlay.style.opacity = '0.8';
      staticOverlay.style.background = 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(0,0,0,0.1) 1px, transparent 2px)';
      clearTimeout(staticTimeout);
      staticTimeout = setTimeout(() => {
        staticOverlay.style.opacity = '0.4';
        staticOverlay.style.background = 'repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0px, rgba(0, 0, 0, 0.03) 2px, transparent 3px)';
      }, 150);
    }
    setInterval(() => {
      if (Math.random() < 0.1) {
        triggerStaticBurst();
      }
    }, 2000);
  }

  const broadcastBadge = document.querySelector('.broadcast-badge');
  if (broadcastBadge) {
    broadcastBadge.addEventListener('click', function() {
      const ticker = document.querySelector('.ticker-tape');
      if (ticker) {
        ticker.style.animationPlayState = 
          ticker.style.animationPlayState === 'paused' ? 'running' : 'paused';
        this.textContent = ticker.style.animationPlayState === 'paused' ? 'ПАУЗА' : 'ПРЯМОЙ ЭФИР';
        const liveDot = this.querySelector('.live-dot');
        if (liveDot) {
          liveDot.style.display = ticker.style.animationPlayState === 'paused' ? 'none' : 'inline-block';
        }
      }
    });
  }

  const newsItems = document.querySelectorAll('.news-item');
  newsItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 200 * (index + 1));
  });

  const posterFrame = document.querySelector('.poster-frame');
  if (posterFrame) {
    posterFrame.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    posterFrame.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  }
});