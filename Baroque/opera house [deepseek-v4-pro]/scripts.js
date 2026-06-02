(function() {
  const curtainLeft = document.querySelector('.curtain-left');
  const curtainRight = document.querySelector('.curtain-right');
  const curtainCrest = document.querySelector('.curtain-crest');
  const grandCurtain = document.getElementById('grandCurtain');
  const mainStage = document.querySelector('.grand-stage');
  const chandelier = document.querySelector('.chandelier-container');
  const eventCards = document.querySelectorAll('.event-card');
  const performerProfiles = document.querySelectorAll('.performer-profile');

  function openCurtain() {
    if (!curtainLeft || !curtainRight) return;

    curtainLeft.style.transform = 'translateX(-105%)';
    curtainRight.style.transform = 'translateX(105%)';

    if (curtainCrest) {
      curtainCrest.style.opacity = '1';
      curtainCrest.style.transform = 'scale(1)';
    }

    setTimeout(() => {
      if (grandCurtain) {
        grandCurtain.style.opacity = '0';
        setTimeout(() => {
          if (grandCurtain) grandCurtain.style.display = 'none';
        }, 1800);
      }
      if (mainStage) {
        mainStage.style.opacity = '1';
        mainStage.style.transform = 'translateY(0)';
      }
    }, 1100);
  }

  window.addEventListener('load', () => {
    setTimeout(openCurtain, 400);
  });

  function setupChandelierSway() {
    if (!chandelier) return;
    let swayTimeout;
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const swayAmount = (e.clientX - centerX) * 0.015;
      chandelier.style.transform = `translateX(calc(-50% + ${swayAmount}px))`;
      clearTimeout(swayTimeout);
      swayTimeout = setTimeout(() => {
        chandelier.style.transform = 'translateX(-50%)';
      }, 2000);
    });
  }

  function setupEventCards() {
    eventCards.forEach(card => {
      card.addEventListener('mouseenter', function(e) {
        const frame = this.querySelector('.card-rococo-frame');
        if (frame) {
          frame.style.transition = 'transform 0.3s ease, box-shadow 0.4s ease';
        }
      });

      const brochureBtn = card.querySelector('.btn-brochure');
      if (brochureBtn) {
        brochureBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const eventName = card.dataset.event || 'this performance';
          alert(`The gilded libretto for ${eventName.replace(/-/g, ' ')} is being prepared by the royal scribe.`);
        });
      }
    });
  }

  function setupPerformerSpotlight() {
    performerProfiles.forEach(profile => {
      profile.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const spotlight = this.querySelector('.profile-spotlight');
        if (spotlight) {
          spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, #b84c2c 0%, #2b0a0a 80%)`;
        }
      });

      profile.addEventListener('mouseleave', function() {
        const spotlight = this.querySelector('.profile-spotlight');
        if (spotlight) {
          spotlight.style.background = '';
        }
      });
    });
  }

  function setupSeatInteraction() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      box.addEventListener('click', function() {
        if (this.classList.contains('royal-box')) {
          alert('The Royal Box is reserved for His Majesty the King.');
        } else {
          alert(`Palco ${this.textContent} selected. A footman will escort you.`);
        }
      });
    });
  }

  setupChandelierSway();
  setupEventCards();
  setupPerformerSpotlight();
  setupSeatInteraction();
})();