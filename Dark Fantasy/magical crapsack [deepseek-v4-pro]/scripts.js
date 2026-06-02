(function() {
  const miseryFill = document.getElementById('miseryFill');
  const miseryValue = document.getElementById('miseryValue');
  const navItems = document.querySelectorAll('.nav-item');
  const panes = document.querySelectorAll('.content-pane');
  const countdownTimer = document.getElementById('countdownTimer');
  const particleContainer = document.getElementById('particleContainer');

  let currentMisery = 94.7;
  let miseryInterval;
  let countdownInterval;

  function updateMiseryDisplay() {
    if (miseryFill && miseryValue) {
      miseryFill.style.width = currentMisery + '%';
      miseryValue.textContent = currentMisery.toFixed(1) + '%';
    }
  }

  function fluctuateMisery() {
    miseryInterval = setInterval(function() {
      let change = (Math.random() - 0.45) * 0.4;
      currentMisery += change;
      if (currentMisery > 99.9) currentMisery = 99.9;
      if (currentMisery < 92.0) currentMisery = 92.0;
      updateMiseryDisplay();
    }, 3200);
  }

  function switchPane(targetId) {
    panes.forEach(function(pane) {
      pane.classList.remove('active');
    });
    const activePane = document.getElementById('pane-' + targetId);
    if (activePane) {
      activePane.classList.add('active');
    }
    navItems.forEach(function(nav) {
      nav.classList.remove('active');
      if (nav.getAttribute('data-pane') === targetId) {
        nav.classList.add('active');
      }
    });
  }

  navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      const pane = this.getAttribute('data-pane');
      if (pane) {
        switchPane(pane);
      }
    });
  });

  function getNextWeepingHour() {
    const now = new Date();
    const target = new Date(now);
    target.setDate(now.getDate() + ((5 + 7 - now.getDay()) % 7));
    target.setHours(23, 59, 59, 999);
    if (target <= now) {
      target.setDate(target.getDate() + 7);
    }
    return target;
  }

  function updateCountdown() {
    if (!countdownTimer) return;
    const weepingHour = getNextWeepingHour();
    const now = new Date().getTime();
    const distance = weepingHour.getTime() - now;

    if (distance < 0) {
      countdownTimer.textContent = "THE WEEPING HOUR IS NOW";
      countdownTimer.style.color = "#ff4d4d";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownTimer.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    countdownTimer.style.color = "#b38b4a";
  }

  function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function createParticles() {
    if (!particleContainer) return;
    const fragment = document.createDocumentFragment();
    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = Math.random() * 20 + 15 + 's';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.backgroundColor = i % 3 === 0 ? '#8b5a5a' : '#6a6a6a';
      fragment.appendChild(particle);
    }
    particleContainer.appendChild(fragment);
  }

  function addArtifactHoverEffect() {
    const cards = document.querySelectorAll('.artifact-card');
    cards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.curse-overlay');
        if (overlay) {
          overlay.style.letterSpacing = '6px';
        }
      });
      card.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.curse-overlay');
        if (overlay) {
          overlay.style.letterSpacing = '4px';
        }
      });
    });
  }

  function addCurseCircleInteraction() {
    const circles = document.querySelectorAll('.curse-circle');
    circles.forEach(function(circle) {
      circle.addEventListener('click', function() {
        this.classList.toggle('active');
        const activeCount = document.querySelectorAll('.curse-circle.active').length;
        const note = document.querySelector('.curse-note');
        if (note) {
          if (activeCount > 3) {
            note.textContent = 'Active Curses: ' + activeCount + ' — You are beyond saving.';
            note.style.color = '#c44b4b';
          } else {
            note.textContent = 'Active Curses: ' + activeCount + ' — Seek a Boneweaver immediately.';
            note.style.color = '#b38b4a';
          }
        }
      });
    });
  }

  function init() {
    updateMiseryDisplay();
    fluctuateMisery();
    startCountdown();
    createParticles();
    addArtifactHoverEffect();
    addCurseCircleInteraction();

    const defaultPane = document.querySelector('.nav-item.active');
    if (defaultPane) {
      const paneId = defaultPane.getAttribute('data-pane');
      if (paneId) switchPane(paneId);
    } else if (navItems.length > 0) {
      navItems[0].classList.add('active');
      const firstPane = navItems[0].getAttribute('data-pane');
      if (firstPane) switchPane(firstPane);
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();