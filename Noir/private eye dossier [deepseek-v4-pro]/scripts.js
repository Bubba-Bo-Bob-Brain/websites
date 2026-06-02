(function() {
  const smokeTrail = document.querySelector('.smoke-trail');
  const typewriterElements = document.querySelectorAll('.typewriter-text');
  const suspectCards = document.querySelectorAll('.suspect-card');
  const boardPins = document.querySelectorAll('.board-pin');
  const caseNumber = document.querySelector('.typewriter-cursor');
  const venetianShadows = document.querySelector('.venetian-shadows');

  let mouseX = 0;
  let mouseY = 0;
  let smokeTimeout;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!smokeTrail) return;

    smokeTrail.style.opacity = '0.7';
    smokeTrail.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(190,190,200,0.25) 0%, rgba(140,140,160,0.12) 30%, transparent 70%)`;

    clearTimeout(smokeTimeout);
    smokeTimeout = setTimeout(() => {
      if (smokeTrail) smokeTrail.style.opacity = '0';
    }, 120);
  });

  function scrambleText(element, finalText, duration = 700) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
    const originalText = finalText;
    let interval = setInterval(() => {
      let scrambled = '';
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      }
      element.textContent = scrambled;
    }, 40);

    setTimeout(() => {
      clearInterval(interval);
      element.textContent = finalText;
    }, duration);
  }

  function revealTypewriterText(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const finalText = element.getAttribute('data-text') || element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #c42e2e';
        
        let index = 0;
        const typingInterval = setInterval(() => {
          if (index < finalText.length) {
            element.textContent += finalText.charAt(index);
            index++;
          } else {
            clearInterval(typingInterval);
            element.style.borderRight = '2px solid transparent';
          }
        }, 28);
        
        observer.unobserve(element);
      }
    });
  }

  const typewriterObserver = new IntersectionObserver(revealTypewriterText, {
    threshold: 0.4,
    rootMargin: '0px'
  });

  typewriterElements.forEach(el => {
    const text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', text);
    el.textContent = '';
    typewriterObserver.observe(el);
  });

  if (caseNumber) {
    const valueSpan = caseNumber.querySelector('.value');
    if (valueSpan) {
      const originalValue = valueSpan.textContent;
      setInterval(() => {
        scrambleText(valueSpan, originalValue, 400);
      }, 5000);
    }
  }

  suspectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      const name = this.querySelector('.name')?.textContent || 'Suspect';
      const alibi = this.querySelector('.alibi-strip')?.textContent || 'unknown';
      
      this.style.transition = '0.15s';
      this.style.transform = 'translateX(4px)';
      setTimeout(() => { this.style.transform = ''; }, 150);

      const brief = document.createElement('div');
      brief.className = 'interrogation-popup';
      brief.innerHTML = `<strong>${name}</strong><br>${alibi}`;
      brief.style.position = 'fixed';
      brief.style.bottom = '20px';
      brief.style.left = '20px';
      brief.style.background = '#0a0a08';
      brief.style.color = '#f4f1ea';
      brief.style.border = '1px solid #c42e2e';
      brief.style.padding = '0.7rem 1.2rem';
      brief.style.fontFamily = 'IBM Plex Mono';
      brief.style.zIndex = '999';
      brief.style.boxShadow = '0 0 18px black';
      document.body.appendChild(brief);
      
      setTimeout(() => {
        if (brief && brief.parentNode) brief.remove();
      }, 2200);
    });
  });

  boardPins.forEach(pin => {
    pin.addEventListener('click', function(e) {
      e.stopPropagation();
      const pinName = this.textContent;
      this.style.transform = 'translate(-50%, -50%) scale(1.3)';
      this.style.background = '#e05a5a';
      setTimeout(() => {
        this.style.transform = 'translate(-50%, -50%) scale(1)';
        this.style.background = '#b22222';
      }, 200);

      const relatedThreads = document.querySelectorAll('.red-thread');
      relatedThreads.forEach(thread => {
        thread.style.stroke = '#f0a0a0';
        thread.style.strokeWidth = '1.2';
        setTimeout(() => {
          thread.style.stroke = '#c42e2e';
          thread.style.strokeWidth = '0.8';
        }, 500);
      });
    });
  });

  if (venetianShadows) {
    document.addEventListener('mousemove', function(e) {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 6;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 4;
      venetianShadows.style.transform = `translateY(${moveY}px) translateX(${moveX}px)`;
    });
  }

  const headerStamp = document.querySelector('.header-stamp');
  if (headerStamp) {
    headerStamp.addEventListener('mouseenter', () => {
      headerStamp.style.transform = 'rotate(0.5deg) scale(1.05)';
    });
    headerStamp.addEventListener('mouseleave', () => {
      headerStamp.style.transform = 'rotate(-1deg) scale(1)';
    });
  }
})();