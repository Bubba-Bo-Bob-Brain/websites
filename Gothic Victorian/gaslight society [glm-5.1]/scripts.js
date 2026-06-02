const InvitationScreen = {
  element: document.getElementById('invitation-screen'),
  seal: document.getElementById('wax-seal'),
  mainDirectory: document.getElementById('main-directory'),
  isBroken: false,

  init() {
    if (!this.seal) return;
    this.seal.addEventListener('click', () => this.breakSeal());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.isBroken) this.breakSeal();
    });
  },

  breakSeal() {
    if (this.isBroken) return;
    this.isBroken = true;

    this.seal.style.transition = 'transform 0.8s ease-in, opacity 0.8s ease-in 0.3s';
    this.seal.style.transform = 'translateX(-50%) scale(1.3) rotate(15deg)';
    this.seal.style.opacity = '0';

    const flaps = document.querySelectorAll('.envelope-flap');
    flaps.forEach((flap) => {
      flap.style.transition = 'transform 1s ease 0.4s, opacity 0.6s ease 0.8s';
      flap.style.transform = 'rotateX(-180deg)';
      flap.style.opacity = '0';
    });

    const paper = document.querySelector('.envelope-paper');
    if (paper) {
      paper.style.transition = 'transform 0.6s ease 0.6s, opacity 0.4s ease 1s';
      paper.style.transform = 'translate(-50%, -50%) scale(1.05)';
      paper.style.opacity = '0.6';
    }

    const script = document.querySelector('.envelope-script');
    if (script) {
      script.style.transition = 'opacity 0.4s ease 1.2s';
      script.style.opacity = '0';
    }

    setTimeout(() => {
      this.element.classList.add('invitation-dismissed');
      this.mainDirectory.classList.remove('directory-hidden');

      setTimeout(() => {
        this.element.style.display = 'none';
        DirectoryNav.updateActive();
      }, 1200);
    }, 1400);
  }
};

const GrandfatherClock = {
  hourHand: document.getElementById('clock-hour'),
  minuteHand: document.getElementById('clock-minute'),
  secondHand: document.getElementById('clock-second'),
  chimeIndicator: document.getElementById('chime-indicator'),
  lastChimeHour: -1,

  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = hours * 30 + minutes * 0.5;

    if (this.secondHand) {
      this.secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    }
    if (this.minuteHand) {
      this.minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    }
    if (this.hourHand) {
      this.hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    if (minutes === 0 && seconds < 5 && hours !== this.lastChimeHour) {
      this.lastChimeHour = hours;
      this.triggerChime();
    }
  },

  triggerChime() {
    if (!this.chimeIndicator) return;
    this.chimeIndicator.classList.add('chiming');
    setTimeout(() => {
      this.chimeIndicator.classList.remove('chiming');
    }, 4500);
  }
};

const MemberFilter = {
  buttons: document.querySelectorAll('.filter-btn'),
  cards: document.querySelectorAll('.member-card'),

  init() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.setActive(btn);
        this.filterCards(filter);
      });
    });
  },

  setActive(activeBtn) {
    this.buttons.forEach((btn) => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  },

  filterCards(filter) {
    this.cards.forEach((card, index) => {
      const cardCircle = card.dataset.circle;
      const shouldShow = filter === 'all' || cardCircle === filter;

      if (shouldShow) {
        card.classList.remove('card-hidden');
        card.classList.remove('card-reveal');
        void card.offsetWidth;
        card.style.animationDelay = `${index * 0.06}s`;
        card.classList.add('card-reveal');
      } else {
        card.classList.add('card-hidden');
        card.classList.remove('card-reveal');
      }
    });
  }
};

const ScrollReveal = {
  sections: document.querySelectorAll('.directory-section'),
  observer: null,

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-reveal');
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  }
};

const DirectoryNav = {
  links: document.querySelectorAll('.nav-link'),
  sectionIds: [],
  sections: [],
  observer: null,

  init() {
    this.links.forEach((link) => {
      const sectionId = link.dataset.section;
      if (sectionId) {
        this.sectionIds.push(sectionId);
        const section = document.getElementById(sectionId);
        if (section) this.sections.push(section);
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.section;
        const target = document.getElementById(targetId);
        if (target) {
          const navHeight = document.getElementById('directory-nav').offsetHeight;
          const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    this.setupScrollObserver();
  },

  setupScrollObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setActiveLink(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  },

  setActiveLink(sectionId) {
    this.links.forEach((link) => {
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  updateActive() {
    const scrollPos = window.scrollY + 150;
    let currentSection = this.sectionIds[0];

    this.sections.forEach((section, index) => {
      if (section && section.offsetTop <= scrollPos) {
        currentSection = this.sectionIds[index];
      }
    });

    if (currentSection) {
      this.setActiveLink(currentSection);
    }
  }
};

const LabyrinthInteraction = {
  rings: document.querySelectorAll('.labyrinth-ring'),

  init() {
    this.rings.forEach((ring) => {
      ring.addEventListener('click', () => {
        const circle = ring.dataset.circle;
        this.highlightRing(ring);
        this.scrollToMembers(circle);
      });
    });
  },

  highlightRing(activeRing) {
    this.rings.forEach((ring) => {
      ring.style.opacity = ring === activeRing ? '1' : '0.4';
      ring.style.transition = 'opacity 0.4s ease';
    });

    setTimeout(() => {
      this.rings.forEach((ring) => {
        ring.style.opacity = '1';
      });
    }, 2000);
  },

  scrollToMembers(circle) {
    const membersSection = document.getElementById('members');
    if (!membersSection) return;

    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${circle}"]`);
    if (matchingBtn) {
      matchingBtn.click();
    }

    const navHeight = document.getElementById('directory-nav').offsetHeight;
    const targetTop = membersSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
};

const GaslightFlicker = {
  overlay: document.getElementById('gaslight-overlay'),
  baseStyle: '',
  isInitialized: false,

  init() {
    if (!this.overlay) return;
    this.baseStyle = this.overlay.style.cssText;
    this.isInitialized = true;

    setInterval(() => {
      if (Math.random() < 0.15) {
        this.triggerFlicker();
      }
    }, 4000);
  },

  triggerFlicker() {
    if (!this.isInitialized || !this.overlay) return;

    const dimIntensity = 0.6 + Math.random() * 0.3;
    this.overlay.style.opacity = dimIntensity.toString();

    setTimeout(() => {
      this.overlay.style.opacity = (dimIntensity + 0.1).toString();

      setTimeout(() => {
        this.overlay.style.opacity = '1';
      }, 80 + Math.random() * 120);
    }, 50 + Math.random() * 80);
  }
};

const SeanceRowHighlight = {
  rows: document.querySelectorAll('.seance-row'),

  init() {
    this.rows.forEach((row) => {
      row.addEventListener('click', () => {
        this.rows.forEach((r) => r.style.borderLeftColor = '');
        row.style.borderLeft = '3px solid var(--amber-glow)';
        row.style.transition = 'border-left-color 0.3s ease';

        setTimeout(() => {
          row.style.borderLeftColor = '';
          row.style.borderLeftWidth = '';
        }, 3000);
      });
    });
  }
};

const MemberCardInteraction = {
  cards: document.querySelectorAll('.member-card'),

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        this.dimOtherCards(card);
      });

      card.addEventListener('mouseleave', () => {
        this.restoreAllCards();
      });
    });
  },

  dimOtherCards(hoveredCard) {
    this.cards.forEach((card) => {
      if (card !== hoveredCard && !card.classList.contains('card-hidden')) {
        card.style.opacity = '0.6';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
      }
    });
  },

  restoreAllCards() {
    this.cards.forEach((card) => {
      if (!card.classList.contains('card-hidden')) {
        card.style.opacity = '1';
      }
    });
  }
};

const AmbientSounds = {
  clockElement: document.getElementById('grandfather-clock'),
  tickEnabled: true,

  init() {
    if (!this.clockElement) return;

    setInterval(() => {
      if (!this.tickEnabled) return;
      this.visualTick();
    }, 1000);
  },

  visualTick() {
    const trunk = this.clockElement.querySelector('.clock-trunk');
    if (!trunk) return;

    trunk.style.transition = 'box-shadow 0.15s ease';
    trunk.style.boxShadow = 'inset 0 0 4px rgba(212, 168, 71, 0.08)';

    setTimeout(() => {
      trunk.style.boxShadow = '';
    }, 150);
  }
};

const ParallaxHeader = {
  header: document.getElementById('society-header'),
  crest: null,

  init() {
    this.crest = this.header ? this.header.querySelector('.society-crest') : null;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  },

  onScroll() {
    const scrollY = window.pageYOffset;
    if (scrollY > 400) return;

    if (this.crest) {
      const translateY = scrollY * 0.15;
      const scale = 1 - scrollY * 0.0003;
      this.crest.style.transform = `translateY(${translateY}px) scale(${Math.max(scale, 0.9)})`;
      this.crest.style.transition = 'transform 0.1s linear';
    }
  }
};

const InitializationSequence = {
  init() {
    InvitationScreen.init();
    GrandfatherClock.init();
    MemberFilter.init();
    ScrollReveal.init();
    DirectoryNav.init();
    LabyrinthInteraction.init();
    GaslightFlicker.init();
    SeanceRowHighlight.init();
    MemberCardInteraction.init();
    AmbientSounds.init();
    ParallaxHeader.init();

    window.addEventListener('scroll', () => {
      DirectoryNav.updateActive();
    }, { passive: true });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  InitializationSequence.init();
});