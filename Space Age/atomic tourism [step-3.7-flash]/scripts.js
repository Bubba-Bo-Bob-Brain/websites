document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // DYNAMIC STAR FIELD GENERATION
  // ============================================
  const starField = document.getElementById('starField');
  const starCount = 150;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 2 + 1}px`;
    star.style.height = star.style.width;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    star.style.setProperty('--opacity', Math.random() * 0.7 + 0.3);
    starField.appendChild(star);
  }

  // ============================================
  // SCROLL-TRIGGERED FADE ANIMATIONS
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  fadeElements.forEach(el => observer.observe(el));

  // ============================================
  // LIVE DEPARTURE BOARD UPDATES
  // ============================================
  const flightRows = document.querySelectorAll('.flight-row');
  const statuses = [
    { text: 'ON TIME', class: 'on-time', light: 'green' },
    { text: 'BOARDING', class: 'boarding', light: 'yellow' },
    { text: 'DELAYED 2H', class: 'delayed', light: 'red' }
  ];
  const departureBoard = document.querySelector('.departure-board');
  const liveClock = document.createElement('div');
  liveClock.classList.add('live-clock');
  liveClock.style.cssText = `
    position: absolute;
    top: 10px;
    right: 15px;
    font-family: var(--font-display);
    color: var(--turquoise);
    font-size: 1.2rem;
    z-index: 10;
    text-shadow: 1px 1px 0 var(--space-blue);
    letter-spacing: 0.1em;
  `;
  departureBoard.appendChild(liveClock);
  const updateClock = () => {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  setInterval(updateClock, 1000);
  updateClock();
  setInterval(() => {
    const randomRow = flightRows[Math.floor(Math.random() * flightRows.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const statusCell = randomRow.querySelector('.status');
    const statusLight = statusCell.querySelector('.status-light');
    statusCell.textContent = randomStatus.text;
    statusCell.className = `status ${randomStatus.class}`;
    statusLight.className = `status-light ${randomStatus.light}`;
    randomRow.style.background = 'rgba(64, 224, 208, 0.2)';
    setTimeout(() => {
      randomRow.style.background = '';
    }, 1000);
  }, 8000);

  // ============================================
  // MASCOT PARALLAX INTERACTION
  // ============================================
  const mascotWrapper = document.querySelector('.mascot-wrapper');
  const rockets = document.querySelectorAll('.rocket');
  mascotWrapper.addEventListener('mousemove', (e) => {
    const rect = mascotWrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rockets.forEach((rocket, index) => {
      const intensity = (index + 1) * 8;
      rocket.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    });
  });
  mascotWrapper.addEventListener('mouseleave', () => {
    rockets.forEach(rocket => {
      rocket.style.transform = 'translate(0, 0)';
    });
  });

  // ============================================
  // BOOKING MODAL FUNCTIONALITY
  // ============================================
  const modalHTML = `
    <div class="booking-modal" id="bookingModal">
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">✕</button>
        <h2 class="modal-title">BOOK YOUR STARSHIP</h2>
        <svg class="modal-starburst" viewBox="0 0 100 100" width="60" height="60" aria-hidden="true">
          <polygon points="50,5 55,25 75,20 65,35 85,45 65,50 75,70 55,60 50,80 45,60 25,70 35,50 15,45 35,35 25,20 45,25" fill="#FF7F50" stroke="#1A1A2E" stroke-width="2"/>
        </svg>
        <form class="booking-form">
          <div class="form-group">
            <label for="name">ASTRONAUT NAME</label>
            <input type="text" id="name" required placeholder="CAPTAIN CARL">
          </div>
          <div class="form-group">
            <label for="email">MISSION CONTROL EMAIL</label>
            <input type="email" id="email" required placeholder="carl@lunarleisure.space">
          </div>
          <div class="form-group">
            <label for="destination">DESTINATION</label>
            <select id="destination" required>
              <option value="lunar">LUNAR GETAWAY</option>
              <option value="mars">MARS EXPEDITION</option>
              <option value="orbital">ORBITAL HOTEL</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date">LAUNCH DATE</label>
            <input type="date" id="date" required>
          </div>
          <div class="form-group">
            <label for="travelers">NUMBER OF TRAVELERS</label>
            <input type="number" id="travelers" min="1" max="10" value="1" required>
          </div>
          <button type="submit" class="submit-btn">CONFIRM BOOKING</button>
        </form>
        <div class="success-message" style="display: none;">
          <h3>YOUR MISSION IS BOOKED!</h3>
          <p>Prepare for launch! Your confirmation has been sent to mission control.</p>
          <svg class="success-stamp" viewBox="0 0 100 100" width="80" height="80" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#40E0D0" stroke-width="4"/>
            <text x="50" y="55" text-anchor="middle" fill="#FF7F50" font-family="var(--font-display)" font-size="14">APPROVED</text>
          </svg>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById('bookingModal');
  const modalContent = modal.querySelector('.modal-content');
  const closeBtn = modal.querySelector('.modal-close');
  const bookingForm = modal.querySelector('.booking-form');
  const successMessage = modal.querySelector('.success-message');
  const destinationSelect = modal.querySelector('#destination');
  const reserveButtons = document.querySelectorAll('.destination-cta');
  reserveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const destination = btn.closest('.destination-card').querySelector('.destination-name').textContent;
      if (destination.includes('LUNAR')) destinationSelect.value = 'lunar';
      if (destination.includes('MARS')) destinationSelect.value = 'mars';
      if (destination.includes('ORBITAL')) destinationSelect.value = 'orbital';
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalContent.classList.add('open'), 10);
    });
  });
  const closeModal = () => {
    modalContent.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      bookingForm.style.display = 'block';
      successMessage.style.display = 'none';
      bookingForm.reset();
    }, 300);
  };
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    bookingForm.style.display = 'none';
    successMessage.style.display = 'block';
    setTimeout(closeModal, 4000);
  });

  // Inject modal styles
  const modalStyles = document.createElement('style');
  modalStyles.textContent = `
    .booking-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(26, 26, 46, 0.9);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(5px);
    }
    .modal-content {
      background: var(--cream);
      border: var(--border-thick);
      padding: var(--space-lg);
      max-width: 500px;
      width: 90%;
      box-shadow: var(--shadow-xl);
      position: relative;
      transform: scale(0.9);
      opacity: 0;
      transition: all 0.3s ease;
    }
    .modal-content.open {
      transform: scale(1);
      opacity: 1;
    }
    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--coral);
      color: var(--cream);
      border: var(--border-thin);
      width: 30px;
      height: 30px;
      font-family: var(--font-display);
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .modal-close:hover {
      background: var(--coral-dark);
      transform: rotate(90deg);
    }
    .modal-title {
      text-align: center;
      color: var(--space-blue);
      margin-bottom: var(--space-sm);
      font-size: 1.8rem;
    }
    .modal-starburst {
      display: block;
      margin: 0 auto var(--space-md);
      animation: logoPulse 2s ease-in-out infinite;
    }
    .booking-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .form-group label {
      font-family: var(--font-display);
      font-size: 0.9rem;
      color: var(--space-blue);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-group input, .form-group select {
      padding: var(--space-xs);
      border: var(--border-thin);
      background: var(--cream);
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--space-blue);
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--turquoise);
      box-shadow: 0 0 0 2px var(--turquoise-light);
    }
    .submit-btn {
      margin-top: var(--space-sm);
      padding: var(--space-sm);
      background: var(--turquoise);
      color: var(--space-blue);
      border: var(--border-medium);
      font-family: var(--font-display);
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-md);
    }
    .submit-btn:hover {
      background: var(--turquoise-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .success-message {
      text-align: center;
    }
    .success-message h3 {
      color: var(--coral);
      margin-bottom: var(--space-sm);
    }
    .success-stamp {
      margin-top: var(--space-md);
      animation: popIn 0.5s ease-out;
    }
    @keyframes popIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .live-clock {
      font-variant-numeric: tabular-nums;
    }
  `;
  document.head.appendChild(modalStyles);

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const headerHeight = 80;
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // LOGO HOVER SPIN INTERACTION
  // ============================================
  const starburstLogo = document.querySelector('.starburst-logo');
  starburstLogo.addEventListener('mouseenter', () => {
    starburstLogo.style.animation = 'none';
    starburstLogo.offsetHeight;
    starburstLogo.style.animation = 'logoSpin 1s ease-in-out';
  });
  starburstLogo.addEventListener('mouseleave', () => {
    starburstLogo.style.animation = 'logoPulse 3s ease-in-out infinite';
  });
  const logoSpinStyle = document.createElement('style');
  logoSpinStyle.textContent = `
    @keyframes logoSpin {
      from { transform: rotate(0deg) scale(1); }
      to { transform: rotate(360deg) scale(1.1); }
    }
  `;
  document.head.appendChild(logoSpinStyle);
});