const EmberCanvas = {
  canvas: null,
  ctx: null,
  embers: [],
  maxEmbers: 60,

  init() {
    this.canvas = document.getElementById('ember-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createEmbers();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createEmbers() {
    this.embers = [];
    for (let i = 0; i < this.maxEmbers; i++) {
      this.embers.push(this.createEmber());
    }
  },

  createEmber() {
    const isEmber = Math.random() > 0.4;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: isEmber ? Math.random() * 2.5 + 0.5 : Math.random() * 1.2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.5 + 0.1),
      opacity: Math.random() * 0.6 + 0.1,
      opacitySpeed: (Math.random() - 0.5) * 0.008,
      isEmber: isEmber,
      hue: isEmber ? Math.random() * 30 + 15 : Math.random() * 20 + 35,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.01 + 0.005,
      driftAmplitude: Math.random() * 0.5 + 0.2,
      life: Math.random() * 200 + 100,
      maxLife: 0
    };
  },

  resetEmber(ember) {
    const isEmber = Math.random() > 0.4;
    ember.x = Math.random() * this.canvas.width;
    ember.y = this.canvas.height + 10;
    ember.size = isEmber ? Math.random() * 2.5 + 0.5 : Math.random() * 1.2 + 0.3;
    ember.speedX = (Math.random() - 0.5) * 0.3;
    ember.speedY = -(Math.random() * 0.5 + 0.1);
    ember.opacity = Math.random() * 0.4 + 0.1;
    ember.opacitySpeed = (Math.random() - 0.5) * 0.008;
    ember.isEmber = isEmber;
    ember.hue = isEmber ? Math.random() * 30 + 15 : Math.random() * 20 + 35;
    ember.drift = Math.random() * Math.PI * 2;
    ember.driftSpeed = Math.random() * 0.01 + 0.005;
    ember.driftAmplitude = Math.random() * 0.5 + 0.2;
    ember.life = Math.random() * 200 + 100;
    ember.maxLife = ember.life;
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const ember of this.embers) {
      ember.drift += ember.driftSpeed;
      ember.x += ember.speedX + Math.sin(ember.drift) * ember.driftAmplitude;
      ember.y += ember.speedY;
      ember.opacity += ember.opacitySpeed;
      ember.life--;

      if (ember.opacity <= 0.05 || ember.opacity >= 0.7) {
        ember.opacitySpeed *= -1;
      }

      if (ember.life <= 0 || ember.y < -20 || ember.x < -20 || ember.x > this.canvas.width + 20) {
        this.resetEmber(ember);
        continue;
      }

      const lifeFactor = ember.life / (ember.maxLife || 200);
      const currentOpacity = ember.opacity * Math.min(lifeFactor * 3, 1);

      if (ember.isEmber) {
        const gradient = this.ctx.createRadialGradient(
          ember.x, ember.y, 0,
          ember.x, ember.y, Math.max(0.1, ember.size * 3)
        );
        gradient.addColorStop(0, `hsla(${ember.hue}, 85%, 60%, ${currentOpacity})`);
        gradient.addColorStop(0.4, `hsla(${ember.hue}, 75%, 45%, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${ember.hue}, 70%, 30%, 0)`);

        this.ctx.beginPath();
        this.ctx.arc(ember.x, ember.y, Math.max(0.1, ember.size * 3), 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }

      this.ctx.beginPath();
      this.ctx.arc(ember.x, ember.y, Math.max(0.1, ember.size), 0, Math.PI * 2);
      this.ctx.fillStyle = ember.isEmber
        ? `hsla(${ember.hue}, 90%, 70%, ${currentOpacity})`
        : `hsla(${ember.hue}, 20%, 70%, ${currentOpacity * 0.5})`;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
};

const TorchGlow = {
  glow: null,
  mouseX: 0,
  mouseY: 0,
  currentX: 0,
  currentY: 0,

  init() {
    this.glow = document.getElementById('torch-glow');
    if (!this.glow) return;

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.updatePosition();
  },

  updatePosition() {
    this.currentX += (this.mouseX - this.currentX) * 0.08;
    this.currentY += (this.mouseY - this.currentY) * 0.08;

    this.glow.style.left = this.currentX + 'px';
    this.glow.style.top = this.currentY + 'px';

    requestAnimationFrame(() => this.updatePosition());
  }
};

const Preloader = {
  init() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hidePreloader = () => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1000);
    };

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 1500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hidePreloader, 1500);
      });
    }
  }
};

const Navigation = {
  nav: null,
  links: null,
  sections: [],

  init() {
    this.nav = document.getElementById('main-nav');
    this.links = document.querySelectorAll('.nav-link');
    if (!this.nav || !this.links.length) return;

    this.collectSections();
    this.bindScroll();
    this.bindClicks();
  },

  collectSections() {
    this.sections = [];
    this.links.forEach(link => {
      const sectionId = link.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) {
        this.sections.push({ id: sectionId, element: section, link: link });
      }
    });
  },

  bindScroll() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  onScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }

    let currentSection = null;
    for (const section of this.sections) {
      const rect = section.element.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom > 150) {
        currentSection = section;
      }
    }

    this.links.forEach(link => link.classList.remove('active'));
    if (currentSection) {
      currentSection.link.classList.add('active');
    }
  },

  bindClicks() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          const navHeight = this.nav.offsetHeight;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    const heroCta = document.querySelector('.hero-scroll-cta');
    if (heroCta) {
      heroCta.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = heroCta.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          const navHeight = this.nav.offsetHeight;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    }
  }
};

const ScrollReveal = {
  observer: null,

  init() {
    this.createObserver();
    this.observeProphecyVerses();
    this.observeTimelineEvents();
    this.observeBestiaryCards();
    this.observeIlluminatedLetters();
  },

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.classList.add('visible');

          if (entry.target.classList.contains('prophecy-verse')) {
            this.revealVerse(entry.target);
          }

          if (entry.target.classList.contains('bestiary-card')) {
            this.animateStatBars(entry.target);
          }

          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
  },

  observeProphecyVerses() {
    const verses = document.querySelectorAll('.prophecy-verse');
    verses.forEach((verse, index) => {
      verse.style.transitionDelay = (index * 0.3) + 's';
      this.observer.observe(verse);
    });
  },

  observeTimelineEvents() {
    const events = document.querySelectorAll('.timeline-event');
    events.forEach((event, index) => {
      event.style.transitionDelay = (index * 0.2) + 's';
      this.observer.observe(event);
    });
  },

  observeBestiaryCards() {
    const cards = document.querySelectorAll('.bestiary-card');
    cards.forEach((card, index) => {
      card.style.transitionDelay = (index * 0.15) + 's';
      this.observer.observe(card);
    });
  },

  observeIlluminatedLetters() {
    const letters = document.querySelectorAll('.illuminated-letter');
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'illuminatedPulse 2s ease-out';
          letterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    letters.forEach(letter => letterObserver.observe(letter));
  },

  revealVerse(verse) {
    const text = verse.querySelector('p');
    if (!text) return;

    const originalHTML = text.innerHTML;
    text.innerHTML = '';
    text.style.visibility = 'visible';

    let charIndex = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;

    const fullText = tempDiv.textContent;
    const hasBr = originalHTML.includes('<br>');
    const segments = hasBr ? originalHTML.split('<br>') : [originalHTML];

    let currentSegment = 0;
    let segmentCharIndex = 0;

    const typeWriter = () => {
      if (currentSegment >= segments.length) return;

      const segmentText = segments[currentSegment].replace(/<[^>]*>/g, '');
      const isEmTag = segments[currentSegment].includes('<em>');

      if (segmentCharIndex < segmentText.length) {
        if (segmentCharIndex === 0 && currentSegment > 0) {
          text.innerHTML += '<br>';
        }

        const char = segmentText[segmentCharIndex];
        if (isEmTag) {
          const existingEm = text.querySelector('em:last-of-type');
          if (existingEm) {
            existingEm.textContent += char;
          } else {
            const em = document.createElement('em');
            em.textContent = char;
            text.appendChild(em);
          }
        } else {
          text.appendChild(document.createTextNode(char));
        }

        segmentCharIndex++;
        setTimeout(typeWriter, 25 + Math.random() * 15);
      } else {
        currentSegment++;
        segmentCharIndex = 0;
        if (currentSegment < segments.length) {
          setTimeout(typeWriter, 100);
        }
      }
    };

    setTimeout(typeWriter, 300);
  },

  animateStatBars(card) {
    const bars = card.querySelectorAll('.stat-bar');
    bars.forEach((bar, index) => {
      const value = bar.getAttribute('data-value');
      bar.style.setProperty('--fill-width', value + '%');
      setTimeout(() => {
        bar.classList.add('animated');
      }, 300 + index * 150);
    });
  }
};

const BestiaryFilter = {
  filterBtns: null,
  cards: null,

  init() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.cards = document.querySelectorAll('.bestiary-card');
    if (!this.filterBtns.length || !this.cards.length) return;

    this.bindFilters();
  },

  bindFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        this.filterCards(filter);
      });
    });
  },

  filterCards(filter) {
    this.cards.forEach(card => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden-card');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';

            this.reAnimateStatBars(card);
          });
        });
      } else {
        card.classList.add('hidden-card');
      }
    });
  },

  reAnimateStatBars(card) {
    const bars = card.querySelectorAll('.stat-bar');
    bars.forEach(bar => {
      bar.classList.remove('animated');
      setTimeout(() => {
        bar.classList.add('animated');
      }, 200);
    });
  }
};

const BestiaryLore = {
  init() {
    const toggleBtns = document.querySelectorAll('.card-toggle-lore');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.bestiary-card');
        const extendedLore = card.querySelector('.card-extended-lore');
        const isOpen = extendedLore.classList.contains('open');

        if (isOpen) {
          extendedLore.classList.remove('open');
          btn.classList.remove('open');
          btn.textContent = 'Read Full Entry';
        } else {
          extendedLore.classList.add('open');
          btn.classList.add('open');
          btn.textContent = 'Seal Entry';
        }
      });
    });
  }
};

const AncientMap = {
  locations: null,
  activeLocation: null,

  init() {
    this.locations = document.querySelectorAll('.map-location');
    if (!this.locations.length) return;

    this.bindLocations();
  },

  bindLocations() {
    this.locations.forEach(location => {
      location.addEventListener('click', (e) => {
        e.stopPropagation();

        const wasActive = location.classList.contains('active');

        this.locations.forEach(loc => loc.classList.remove('active'));

        if (!wasActive) {
          location.classList.add('active');
          this.activeLocation = location;
        } else {
          this.activeLocation = null;
        }
      });

      location.addEventListener('mouseenter', () => {
        this.positionTooltip(location);
      });
    });

    document.addEventListener('click', () => {
      this.locations.forEach(loc => loc.classList.remove('active'));
      this.activeLocation = null;
    });
  },

  positionTooltip(location) {
    const info = location.querySelector('.location-info');
    if (!info) return;

    const mapContainer = location.closest('.map-parchment');
    if (!mapContainer) return;

    const mapRect = mapContainer.getBoundingClientRect();
    const locRect = location.getBoundingClientRect();

    const locCenterX = locRect.left + locRect.width / 2 - mapRect.left;
    const locCenterY = locRect.top + locRect.height / 2 - mapRect.top;

    if (locCenterX > mapRect.width * 0.6) {
      info.style.left = 'auto';
      info.style.right = 'calc(100% + 10px)';
    } else {
      info.style.left = 'calc(100% + 10px)';
      info.style.right = 'auto';
    }
  }
};

const RuneInteraction = {
  init() {
    const runes = document.querySelectorAll('.hero-rune-border .rune');
    if (!runes.length) return;

    runes.forEach(rune => {
      rune.addEventListener('mouseenter', () => {
        rune.style.opacity = '1';
        rune.style.textShadow = '0 0 12px rgba(201, 168, 76, 0.6), 0 0 25px rgba(201, 168, 76, 0.3)';
        rune.style.transform = 'scale(1.3)';
        rune.style.transition = 'all 0.3s ease-out';
      });

      rune.addEventListener('mouseleave', () => {
        rune.style.opacity = '';
        rune.style.textShadow = '';
        rune.style.transform = '';
        rune.style.transition = 'all 0.6s ease-out';
      });
    });
  }
};

const ProphecySeal = {
  init() {
    const seal = document.querySelector('.prophecy-seal');
    if (!seal) return;

    seal.addEventListener('click', () => {
      seal.style.transition = 'transform 0.6s ease-out';
      seal.style.transform = 'rotate(360deg)';

      setTimeout(() => {
        seal.style.transform = 'rotate(0deg)';
      }, 600);
    });
  }
};

const TorchFlickerEnhance = {
  init() {
    const flames = document.querySelectorAll('.torch-flame');
    if (!flames.length) return;

    flames.forEach(flame => {
      setInterval(() => {
        const flickerIntensity = Math.random();
        const scaleX = 0.92 + Math.random() * 0.16;
        const scaleY = 0.9 + Math.random() * 0.2;
        const opacity = 0.8 + Math.random() * 0.2;

        flame.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;
        flame.style.opacity = opacity;

        if (flickerIntensity > 0.85) {
          flame.style.opacity = '0.6';
          setTimeout(() => {
            flame.style.opacity = '1';
          }, 50 + Math.random() * 100);
        }
      }, 80 + Math.random() * 60);
    });
  }
};

const ParallaxFog = {
  fog: null,

  init() {
    this.fog = document.querySelector('.hero-fog');
    if (!this.fog) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('hero').offsetHeight;
        if (scrollY < heroHeight) {
          this.fog.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
      });
    });
  }
};

const FooterRunes = {
  init() {
    const runes = document.querySelectorAll('.footer-runes span');
    if (!runes.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runes.forEach((rune, index) => {
            setTimeout(() => {
              rune.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
              rune.style.opacity = '0.6';
              rune.style.transform = 'translateY(-3px)';

              setTimeout(() => {
                rune.style.opacity = '0.2';
                rune.style.transform = 'translateY(0)';
              }, 800);
            }, index * 120);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const footerRunesContainer = document.querySelector('.footer-runes');
    if (footerRunesContainer) {
      observer.observe(footerRunesContainer);
    }
  }
};

const CrestAnimation = {
  init() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes illuminatedPulse {
        0% { text-shadow: 0 0 10px rgba(196, 30, 58, 0.4), 0 0 30px rgba(196, 30, 58, 0.15); }
        50% { text-shadow: 0 0 20px rgba(196, 30, 58, 0.7), 0 0 50px rgba(196, 30, 58, 0.3), 0 0 80px rgba(196, 30, 58, 0.1); }
        100% { text-shadow: 0 0 10px rgba(196, 30, 58, 0.4), 0 0 30px rgba(196, 30, 58, 0.15); }
      }
    `;
    document.head.appendChild(style);
  }
};

const BloodMoonClock = {
  init() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const moon = document.createElement('div');
    moon.className = 'blood-moon';
    moon.innerHTML = '<div class="moon-inner"></div>';

    const style = document.createElement('style');
    style.textContent = `
      .blood-moon {
        position: absolute;
        top: 8%;
        right: 12%;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%,
          rgba(196, 30, 58, 0.15) 0%,
          rgba(139, 26, 26, 0.1) 40%,
          rgba(139, 26, 26, 0.05) 60%,
          transparent 70%
        );
        box-shadow:
          0 0 40px rgba(139, 26, 26, 0.15),
          0 0 80px rgba(139, 26, 26, 0.08),
          0 0 120px rgba(139, 26, 26, 0.04);
        z-index: 2;
        animation: moonFloat 8s ease-in-out infinite;
        pointer-events: none;
      }
      .moon-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 35%,
          rgba(196, 30, 58, 0.25) 0%,
          rgba(139, 26, 26, 0.15) 50%,
          transparent 70%
        );
        animation: moonPulse 4s ease-in-out infinite;
      }
      .moon-inner::before {
        content: '';
        position: absolute;
        top: 15%;
        left: 20%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(139, 26, 26, 0.2);
        box-shadow:
          12px 8px 0 4px rgba(139, 26, 26, 0.1),
          -4px 14px 0 2px rgba(139, 26, 26, 0.15);
      }
      @keyframes moonFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.03); }
      }
      @keyframes moonPulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      @media (max-width: 768px) {
        .blood-moon {
          width: 50px;
          height: 50px;
          top: 5%;
          right: 8%;
        }
        .moon-inner {
          width: 30px;
          height: 30px;
        }
      }
    `;
    document.head.appendChild(style);
    hero.appendChild(moon);
  }
};

const AmbientSoundIndicator = {
  init() {
    const style = document.createElement('style');
    style.textContent = `
      .ambient-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(13, 10, 4, 0.8);
        border: 1px solid rgba(201, 168, 76, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.4;
      }
      .ambient-indicator:hover {
        opacity: 1;
        border-color: rgba(201, 168, 76, 0.5);
      }
      .ambient-indicator svg {
        width: 16px;
        height: 16px;
        color: var(--gold-dim);
      }
    `;
    document.head.appendChild(style);
  }
};

const ParchmentWear = {
  init() {
    const style = document.createElement('style');
    style.textContent = `
      .prophecy-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: linear-gradient(180deg, rgba(92, 74, 42, 0.15) 0%, transparent 100%);
        pointer-events: none;
        z-index: 1;
      }
      .prophecy-content::after {
        border: none !important;
      }
      .map-parchment::before {
        box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);
  }
};

const Init = {
  init() {
    Preloader.init();
    EmberCanvas.init();
    TorchGlow.init();
    Navigation.init();
    ScrollReveal.init();
    BestiaryFilter.init();
    BestiaryLore.init();
    AncientMap.init();
    RuneInteraction.init();
    ProphecySeal.init();
    TorchFlickerEnhance.init();
    ParallaxFog.init();
    FooterRunes.init();
    CrestAnimation.init();
    BloodMoonClock.init();
    AmbientSoundIndicator.init();
    ParchmentWear.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Init.init();
});