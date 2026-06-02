document.addEventListener('DOMContentLoaded', function() {
  initStarfield();
  initClock();
  initMascotMessages();
  initModal();
  initSmoothScroll();
  initRocketInteraction();
  initMarqueePause();
  initFormHandlers();
  initScrollAnimations();
});

function initStarfield() {
  const starfield = document.getElementById('starfield');
  if (!starfield) return;

  const starCount = 120;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star-particle');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.7 + 0.3;
    const twinkleDuration = Math.random() * 3 + 2;
    const twinkleDelay = Math.random() * 5;

    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: #FFFAF0;
      border-radius: 50%;
      top: ${y}%;
      left: ${x}%;
      opacity: ${opacity};
      animation: starTwinkle ${twinkleDuration}s ease-in-out ${twinkleDelay}s infinite;
      pointer-events: none;
    `;
    fragment.appendChild(star);
  }

  starfield.appendChild(fragment);

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes starTwinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.8); }
    }
  `;
  document.head.appendChild(styleSheet);
}

function initClock() {
  const clockDisplay = document.getElementById('clockDisplay');
  if (!clockDisplay) return;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}`;
  }

  updateClock();
  setInterval(updateClock, 10000);
}

function initMascotMessages() {
  const mascotMessage = document.getElementById('mascotMessage');
  const mascotBubble = document.getElementById('mascotBubble');
  if (!mascotMessage || !mascotBubble) return;

  const messages = [
    "Don't forget your space suit, explorer!",
    "Mars is lovely this time of year!",
    "Zero-gravity taffy is my favorite!",
    "I've been to every planet, you know!",
    "The Moon's cheese is delicious!",
    "Fasten your seatbelt, space cadet!",
    "Starlight Station has the best views!",
    "Collecting rocket stamps is my hobby!",
    "See you at the launch pad!",
    "The future is now, friends!"
  ];

  let messageIndex = 0;

  function changeMessage() {
    mascotBubble.style.transform = 'scale(0.9)';
    mascotBubble.style.opacity = '0';

    setTimeout(function() {
      messageIndex = (messageIndex + 1) % messages.length;
      mascotMessage.textContent = messages[messageIndex];
      mascotBubble.style.transform = 'scale(1.05)';
      mascotBubble.style.opacity = '1';

      setTimeout(function() {
        mascotBubble.style.transform = 'scale(1)';
      }, 200);
    }, 300);
  }

  setInterval(changeMessage, 5000);
}

function initModal() {
  const modal = document.getElementById('bookingModal');
  const reserveBtn = document.getElementById('reserveBtn');
  const brochureBtn = document.getElementById('brochureBtn');
  const closeModal = document.getElementById('closeModal');
  const bookingForm = document.getElementById('bookingForm');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModalHandler() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (reserveBtn) {
    reserveBtn.addEventListener('click', openModal);
  }

  if (brochureBtn) {
    brochureBtn.addEventListener('click', function() {
      const destinationSelect = document.getElementById('destinationSelect');
      if (destinationSelect) {
        destinationSelect.value = '';
      }
      openModal();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
  }

  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModalHandler();
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModalHandler();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const destination = document.getElementById('destinationSelect').value;
      const name = document.getElementById('nameInput').value;
      const passengers = document.getElementById('passengersInput').value;
      const date = document.getElementById('departureDate').value;

      if (!destination || !name || !date) {
        shakeElement(bookingForm);
        return;
      }

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-icon">✧</span> PROCESSING...';
      submitBtn.disabled = true;

      setTimeout(function() {
        submitBtn.innerHTML = '<span class="btn-icon">✓</span> BOOKED!';
        submitBtn.style.backgroundColor = 'var(--color-turquoise)';
        submitBtn.style.borderColor = 'var(--color-turquoise)';

        setTimeout(function() {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
          bookingForm.reset();
          closeModalHandler();
        }, 2000);
      }, 1500);
    });
  }
}

function shakeElement(element) {
  element.style.animation = 'none';
  element.offsetHeight;
  element.style.animation = 'shake 0.5s ease-in-out';

  const shakeKeyframes = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
      20%, 40%, 60%, 80% { transform: translateX(6px); }
    }
  `;

  const existingShakeStyle = document.getElementById('shake-style');
  if (!existingShakeStyle) {
    const styleEl = document.createElement('style');
    styleEl.id = 'shake-style';
    styleEl.textContent = shakeKeyframes;
    document.head.appendChild(styleEl);
  }

  setTimeout(function() {
    element.style.animation = '';
  }, 500);
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.site-header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

function initRocketInteraction() {
  const heroRocket = document.getElementById('heroRocket');
  if (!heroRocket) return;

  const heroSection = document.querySelector('.hero-section');

  if (heroSection) {
    heroSection.addEventListener('mousemove', function(event) {
      const rect = heroSection.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / centerX * 15;
      const moveY = (y - centerY) / centerY * 15;

      heroRocket.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(25deg)`;
      heroRocket.style.transition = 'transform 0.3s ease-out';
    });

    heroSection.addEventListener('mouseleave', function() {
      heroRocket.style.transform = 'translate(-50%, -50%) rotate(25deg)';
      heroRocket.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  }
}

function initMarqueePause() {
  const marqueeTrack = document.querySelector('.marquee-track');
  if (!marqueeTrack) return;

  const testimonialsSection = document.querySelector('.testimonials-section');

  if (testimonialsSection) {
    testimonialsSection.addEventListener('mouseenter', function() {
      marqueeTrack.style.animationPlayState = 'paused';
    });

    testimonialsSection.addEventListener('mouseleave', function() {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }
}

function initFormHandlers() {
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const inputs = newsletterForm.querySelectorAll('input');
      let allFilled = true;

      inputs.forEach(function(input) {
        if (!input.value.trim()) {
          allFilled = false;
          input.style.borderColor = 'var(--color-coral)';
          setTimeout(function() {
            input.style.borderColor = '';
          }, 1500);
        }
      });

      if (!allFilled) {
        shakeElement(newsletterForm);
        return;
      }

      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'SUBSCRIBED!';
      submitBtn.style.backgroundColor = 'var(--color-turquoise)';
      submitBtn.style.color = 'var(--color-navy)';

      setTimeout(function() {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
        newsletterForm.reset();
      }, 2000);
    });
  }

  const cardButtons = document.querySelectorAll('.btn-card');
  cardButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const card = this.closest('.destination-card');
      const destination = card ? card.dataset.destination : null;

      const destinationSelect = document.getElementById('destinationSelect');
      if (destinationSelect && destination) {
        const destinationMap = {
          'moon': 'moon',
          'mars': 'mars',
          'orbital': 'orbital'
        };
        destinationSelect.value = destinationMap[destination] || '';
      }

      const modal = document.getElementById('bookingModal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.destination-card, .mascot-container, .testimonial-card, .schedule-board');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
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

  animatedElements.forEach(function(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(element);
  });
}

const flapCells = document.querySelectorAll('.board-row:not(.header-row) .depart-time');
if (flapCells.length > 0) {
  flapCells.forEach(function(cell) {
    const originalTime = cell.textContent.trim();
    const parts = originalTime.split(':');
    if (parts.length === 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      const randomOffset = Math.floor(Math.random() * 11) - 5;
      const newMinutes = minutes + randomOffset;
      let displayHours = hours;
      let displayMinutes = newMinutes;

      if (newMinutes >= 60) {
        displayHours = (hours + 1) % 24;
        displayMinutes = newMinutes - 60;
      } else if (newMinutes < 0) {
        displayHours = (hours - 1 + 24) % 24;
        displayMinutes = newMinutes + 60;
      }

      const timeString = `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`;
      cell.textContent = timeString;
      cell.style.color = 'var(--color-gold)';
    }
  });
}