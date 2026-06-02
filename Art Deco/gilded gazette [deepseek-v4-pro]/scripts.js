document.addEventListener('DOMContentLoaded', () => {
  const bubbleCanvas = document.getElementById('bubbleCanvas');
  const mastheadTitle = document.getElementById('mainTitle');
  const tickerTape = document.getElementById('tickerTape');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroCta = document.querySelector('.hero__cta');
  const posters = document.querySelectorAll('.vintage-poster');

  const bubbles = [];
  const maxBubbles = 38;

  function createBubbleElement() {
    const bubble = document.createElement('div');
    const size = Math.floor(Math.random() * 28) + 10;
    const leftPos = Math.random() * 100;
    const delay = Math.random() * 14;
    const duration = Math.random() * 10 + 10;
    const opacity = Math.random() * 0.45 + 0.2;

    bubble.style.position = 'absolute';
    bubble.style.bottom = '-30px';
    bubble.style.left = leftPos + '%';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.borderRadius = '50%';
    bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(249, 216, 87, 0.9), rgba(212, 175, 55, 0.4))';
    bubble.style.boxShadow = '0 0 12px rgba(249, 216, 87, 0.5)';
    bubble.style.opacity = opacity;
    bubble.style.animation = `rise ${duration}s ${delay}s linear infinite`;
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '0';

    return bubble;
  }

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes rise {
      0% {
        transform: translateY(0) scale(0.8);
        opacity: 0.6;
      }
      30% {
        transform: translateY(-35vh) scale(1.1);
        opacity: 0.9;
      }
      70% {
        transform: translateY(-75vh) scale(0.9);
        opacity: 0.5;
      }
      100% {
        transform: translateY(-110vh) scale(0.4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  for (let i = 0; i < maxBubbles; i++) {
    const bubbleEl = createBubbleElement();
    bubbleCanvas.appendChild(bubbleEl);
    bubbles.push(bubbleEl);
  }

  setInterval(() => {
    if (bubbles.length > maxBubbles + 12) {
      const oldBubble = bubbles.shift();
      if (oldBubble && oldBubble.parentNode) {
        oldBubble.remove();
      }
    }
    const newBubble = createBubbleElement();
    bubbleCanvas.appendChild(newBubble);
    bubbles.push(newBubble);
  }, 1600);

  const titleLetters = mastheadTitle.textContent.split('');
  mastheadTitle.textContent = '';
  titleLetters.forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.display = 'inline-block';
    span.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.4s';
    span.style.transitionDelay = index * 0.04 + 's';
    span.style.transform = 'translateY(30px)';
    span.style.opacity = '0';
    mastheadTitle.appendChild(span);

    requestAnimationFrame(() => {
      setTimeout(() => {
        span.style.transform = 'translateY(0)';
        span.style.opacity = '1';
      }, 100 + index * 40);
    });
  });

  mastheadTitle.addEventListener('mouseenter', () => {
    const spans = mastheadTitle.querySelectorAll('span');
    spans.forEach((span, idx) => {
      span.style.transform = `translateY(${Math.sin(idx * 0.8) * 5}px)`;
      span.style.textShadow = '0 0 28px rgba(249, 216, 87, 0.9), 2px 4px 0 #121212';
    });
  });

  mastheadTitle.addEventListener('mouseleave', () => {
    const spans = mastheadTitle.querySelectorAll('span');
    spans.forEach((span) => {
      span.style.transform = 'translateY(0)';
      span.style.textShadow = '0 0 20px rgba(212, 175, 55, 0.5), 2px 4px 0 #121212';
    });
  });

  function duplicateTickerContent() {
    if (!tickerTape) return;
    const originalHTML = tickerTape.innerHTML;
    tickerTape.innerHTML = originalHTML + originalHTML;
  }
  duplicateTickerContent();

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (heroCta) {
    heroCta.addEventListener('click', (e) => {
      e.preventDefault();
      const feature = document.getElementById('feature-gatsby');
      if (feature) {
        feature.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.7s cubic-bezier(0.15, 0.85, 0.3, 1.05), transform 0.7s cubic-bezier(0.15, 0.85, 0.3, 1.05)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToReveal = document.querySelectorAll('.col-card, .fashion-item, .arts-feature, .mini-review, .vintage-poster, .feature-story');
  elementsToReveal.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(35px)';
    revealObserver.observe(el);
  });

  posters.forEach(poster => {
    poster.addEventListener('mouseenter', function(e) {
      const inner = this.querySelector('.poster__frame');
      if (inner) {
        inner.style.transition = 'box-shadow 0.25s';
        inner.style.boxShadow = '0 0 25px 5px rgba(212, 175, 55, 0.7)';
      }
    });

    poster.addEventListener('mouseleave', function(e) {
      const inner = this.querySelector('.poster__frame');
      if (inner) {
        inner.style.boxShadow = 'none';
      }
    });
  });

  const geometricSeparators = document.querySelectorAll('.geometric-separator');
  geometricSeparators.forEach(sep => {
    sep.addEventListener('click', () => {
      const fan = sep.querySelector('.geo-fan');
      if (fan) {
        fan.style.transform = 'rotate(180deg)';
        fan.style.transition = 'transform 0.6s ease';
        setTimeout(() => {
          fan.style.transform = 'rotate(0deg)';
        }, 600);
      }
    });
  });

  const hero = document.querySelector('.parallax-hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroTop = hero.getBoundingClientRect().top + scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrollY + window.innerHeight > heroTop && scrollY < heroTop + heroHeight) {
        const offset = (scrollY - heroTop) * 0.3;
        const sunburst = hero.querySelector('.hero__sunburst-motif');
        if (sunburst) {
          sunburst.style.transform = `translateY(${offset * 0.2}px) rotate(5deg)`;
        }
      }
    });
  }
});