const runeSymbols = [
  '\u1685', '\u1690', '\u1691', '\u1692', '\u1693',
  '\u1694', '\u1695', '\u1696', '\u1697', '\u1698',
  '\u1699', '\u169A', '\u169B', '\u16A0', '\u16A1',
  '\u16A2', '\u16A3', '\u16A4', '\u16A5', '\u16A6',
  '\u16A7', '\u16A8', '\u16A9', '\u16AA', '\u16AB',
  '\u16AC', '\u16AD', '\u16AE', '\u16AF', '\u16B0',
  '\u16B1', '\u16B2', '\u16B3', '\u16B4', '\u16B5',
  '\u16B6', '\u16B7', '\u16C0', '\u16C1', '\u16C2'
];

const miseryBaseValue = 87;
let currentMiseryValue = miseryBaseValue;
let miseryFluctuation = 0;

function createRuneParticles() {
  const container = document.getElementById('runeParticles');
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'rune-particle';
    particle.textContent = runeSymbols[Math.floor(Math.random() * runeSymbols.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 12 + 's';
    particle.style.animationDuration = (10 + Math.random() * 8) + 's';
    particle.style.fontSize = (12 + Math.random() * 10) + 'px';
    particle.style.opacity = '0';
    container.appendChild(particle);
  }
}

function initCurseCursor() {
  const cursor = document.getElementById('curseCursor');
  let cursorX = 0;
  let cursorY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', function(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', function() {
    cursor.classList.remove('visible');
  });

  const interactiveElements = document.querySelectorAll('a, button, .affliction-card, .artifact-card, .ritual-event, .landscape-entry');
  interactiveElements.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursor.classList.add('expanded');
    });
    el.addEventListener('mouseleave', function() {
      cursor.classList.remove('expanded');
    });
  });

  function animateCursor() {
    currentX += (cursorX - currentX) * 0.15;
    currentY += (cursorY - currentY) * 0.15;
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });
}

function initMiseryGauge() {
  const gaugeValue = document.getElementById('miseryGaugeValue');
  const miniFill = document.getElementById('miseryFillMini');
  const miniValue = document.getElementById('miseryValueMini');
  const proclamation = document.getElementById('miseryProclamation');

  function updateMisery() {
    miseryFluctuation = Math.sin(Date.now() / 5000) * 2 + Math.sin(Date.now() / 3000) * 1;
    currentMiseryValue = Math.min(100, Math.max(0, miseryBaseValue + miseryFluctuation));
    const rounded = Math.round(currentMiseryValue);

    if (gaugeValue) {
      gaugeValue.textContent = rounded;
    }
    if (miniFill) {
      miniFill.style.width = rounded + '%';
    }
    if (miniValue) {
      miniValue.textContent = rounded + '%';
    }

    if (proclamation) {
      if (rounded >= 90) {
        proclamation.querySelector('.proclamation-text').textContent =
          'The realm has crossed into Total Collapse. The Seventh Seal fractures. There is no precedent. There is no hope.';
      } else if (rounded >= 85) {
        proclamation.querySelector('.proclamation-text').textContent =
          'The realm verges upon Total Collapse. All signs point to the Seventh Seal fracturing.';
      } else if (rounded >= 75) {
        proclamation.querySelector('.proclamation-text').textContent =
          'Suffering intensifies across all measures. The Veil thins. Dark rites grow in potency.';
      } else {
        proclamation.querySelector('.proclamation-text').textContent =
          'The world endures its torment, though the respite is brief and the direction unchanged.';
      }
    }
  }

  setInterval(updateMisery, 200);
}

function initAfflictionFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.affliction-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      filterBtns.forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      cards.forEach(function(card) {
        const cardType = card.getAttribute('data-type');
        if (filter === 'all' || cardType === filter) {
          card.classList.remove('hidden-card');
          card.classList.add('fade-in');
          setTimeout(function() {
            card.classList.remove('fade-in');
          }, 500);
        } else {
          card.classList.add('hidden-card');
          card.classList.remove('fade-in');
        }
      });
    });
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.affliction-card, .landscape-entry, .ritual-event, .artifact-card, .chronicle-entry, .misery-gauge-container, .calendar-current, .section-ornament, .section-title, .section-subtitle, .misery-proclamation'
  );

  revealElements.forEach(function(el) {
    el.classList.add('reveal-up');
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(function() {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function(el, index) {
    const parent = el.closest('.affliction-grid, .landscape-entries, .ritual-timeline, .artifact-catalog, .chronicle-entries, .misery-index-section');
    if (parent) {
      const siblings = parent.querySelectorAll('.reveal-up');
      const siblingIndex = Array.from(siblings).indexOf(el);
      if (siblingIndex > 0) {
        el.dataset.revealDelay = siblingIndex * 100;
      }
    }
    observer.observe(el);
  });
}

function initProgressBars() {
  const progressBars = document.querySelectorAll('.affliction-progress-fill');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const targetProgress = entry.target.getAttribute('data-progress');
        entry.target.style.width = targetProgress + '%';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  progressBars.forEach(function(bar) {
    bar.style.width = '0%';
    bar.style.transition = 'width 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
    observer.observe(bar);
  });

  const breakdownFills = document.querySelectorAll('.breakdown-fill');
  const breakdownObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const targetValue = entry.target.getAttribute('data-value');
        entry.target.style.width = targetValue + '%';
        entry.target.style.transition = 'width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)';
        breakdownObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  breakdownFills.forEach(function(fill) {
    const targetWidth = fill.style.width;
    fill.style.width = '0%';
    fill.style.transition = 'none';
    fill.setAttribute('data-value', parseInt(targetWidth));
    breakdownObserver.observe(fill);
  });

  const corruptionFills = document.querySelectorAll('.corruption-fill');
  const corruptionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const parentRow = entry.target.closest('.meta-row');
        if (parentRow) {
          const valueSpan = parentRow.querySelector('.meta-value');
          if (valueSpan) {
            const text = valueSpan.textContent.trim();
            const match = text.match(/(\d+)%/);
            if (match) {
              const targetVal = match[1];
              entry.target.style.width = targetVal + '%';
              entry.target.style.transition = 'width 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            }
          }
        }
        corruptionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  corruptionFills.forEach(function(fill) {
    const currentWidth = fill.style.width;
    fill.style.width = '0%';
    fill.style.transition = 'none';
    corruptionObserver.observe(fill);
  });
}

function initGaugeAnimation() {
  const gaugeOuter = document.querySelector('.gauge-ring-outer');
  const gaugeValue = document.getElementById('miseryGaugeValue');

  if (gaugeOuter) {
    const degrees = (miseryBaseValue / 100) * 360;
    gaugeOuter.style.background = 'conic-gradient(from 0deg, #8b1a1a 0deg, #c41e1e ' + degrees + 'deg, #1a1412 ' + degrees + 'deg, #1a1412 360deg)';
  }

  if (gaugeValue) {
    let count = 0;
    const target = miseryBaseValue;
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const counter = setInterval(function() {
      count += increment;
      if (count >= target) {
        count = target;
        clearInterval(counter);
      }
      gaugeValue.textContent = Math.round(count);
    }, stepTime);
  }
}

function initAtmosphericEffects() {
  const landscapeVisuals = document.querySelectorAll('.landscape-visual');

  landscapeVisuals.forEach(function(visual) {
    const entry = visual.closest('.landscape-entry');
    if (!entry) return;

    entry.addEventListener('mouseenter', function() {
      const weatherLayer = visual.querySelector('.landscape-weather');
      if (weatherLayer) {
        weatherLayer.style.opacity = '1.5';
      }
      const sky = visual.querySelector('.landscape-sky');
      if (sky) {
        sky.style.filter = 'brightness(0.8) saturate(1.3)';
        sky.style.transition = 'filter 0.8s ease';
      }
    });

    entry.addEventListener('mouseleave', function() {
      const weatherLayer = visual.querySelector('.landscape-weather');
      if (weatherLayer) {
        weatherLayer.style.opacity = '1';
      }
      const sky = visual.querySelector('.landscape-sky');
      if (sky) {
        sky.style.filter = 'brightness(1) saturate(1)';
      }
    });
  });
}

function initArtifactInteraction() {
  const artifactCards = document.querySelectorAll('.artifact-card');

  artifactCards.forEach(function(card) {
    const glow = card.querySelector('.artifact-glow');
    if (!glow) return;

    card.addEventListener('mouseenter', function() {
      glow.style.transform = 'scale(1.6)';
      glow.style.opacity = '1';
      glow.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    });

    card.addEventListener('mouseleave', function() {
      glow.style.transform = 'scale(1)';
      glow.style.opacity = '0.5';
    });
  });
}

function initCorruptionBorders() {
  const borders = document.querySelectorAll('.corruption-border');

  function updateBorderIntensity() {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const intensity = 0.4 + scrollPercent * 0.6;

    borders.forEach(function(border) {
      border.style.opacity = intensity;
    });
  }

  window.addEventListener('scroll', updateBorderIntensity, { passive: true });
  updateBorderBorders();
}

function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.querySelector('.hero-section');

  if (!heroContent || !heroSection) return;

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
      heroContent.style.opacity = 1 - progress * 1.2;
    }
  }, { passive: true });
}

function initRuneParticleRespawn() {
  const container = document.getElementById('runeParticles');

  setInterval(function() {
    const particles = container.querySelectorAll('.rune-particle');
    const randomParticle = particles[Math.floor(Math.random() * particles.length)];

    if (randomParticle) {
      randomParticle.textContent = runeSymbols[Math.floor(Math.random() * runeSymbols.length)];
      randomParticle.style.left = Math.random() * 100 + '%';
      randomParticle.style.animationDelay = '0s';
    }
  }, 4000);
}

function initRitualTimelineHover() {
  const ritualEvents = document.querySelectorAll('.ritual-event');

  ritualEvents.forEach(function(event) {
    const content = event.querySelector('.event-content');
    if (!content) return;

    event.addEventListener('mouseenter', function() {
      content.style.borderColor = 'var(--color-parchment)';
      content.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
    });

    event.addEventListener('mouseleave', function() {
      if (!content.classList.contains('event-content-active') && !content.classList.contains('event-content-dread')) {
        content.style.borderColor = '';
        content.style.boxShadow = '';
      }
    });
  });
}

function initBloodDripOnHeroTitle() {
  const titleLine = document.querySelector('.title-line-2');
  if (!titleLine) return;

  let drip = document.createElement('span');
  drip.className = 'blood-drip';
  drip.style.cssText = 'position: absolute; bottom: -10px; left: 30%; width: 2px; height: 0; background: linear-gradient(180deg, #c41e1e, transparent); opacity: 0; transition: height 3s ease, opacity 2s ease;';

  titleLine.style.position = 'relative';
  titleLine.appendChild(drip);

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          drip.style.height = '40px';
          drip.style.opacity = '0.6';
        }, 1500);
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(titleLine);
}

function initGlitchEffect() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  function glitch() {
    title.style.transform = 'translate(' + (Math.random() * 4 - 2) + 'px, ' + (Math.random() * 2 - 1) + 'px)';
    title.style.filter = 'hue-rotate(' + (Math.random() * 10 - 5) + 'deg)';

    setTimeout(function() {
      title.style.transform = '';
      title.style.filter = '';
    }, 100);
  }

  setInterval(function() {
    if (Math.random() > 0.85) {
      glitch();
      if (Math.random() > 0.5) {
        setTimeout(glitch, 150);
      }
    }
  }, 3000);
}

function initSmoothNavScroll() {
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initCurrentRitualHighlight() {
  const activeEvent = document.querySelector('.ritual-active');

  if (activeEvent) {
    const content = activeEvent.querySelector('.event-content');
    if (content) {
      content.style.borderColor = '';
      content.style.boxShadow = '0 0 20px rgba(139,26,26,0.15)';
    }
  }
}

function initLandscapeParallax() {
  const landscapeVisuals = document.querySelectorAll('.landscape-visual');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const visual = entry.target;
        const layers = visual.querySelectorAll('.landscape-layer');

        window.addEventListener('scroll', function() {
          const rect = visual.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const visualCenter = rect.top + rect.height / 2;
          const screenCenter = windowHeight / 2;
          const offset = (visualCenter - screenCenter) / windowHeight;

          layers.forEach(function(layer, index) {
            const depth = (index + 1) * 0.3;
            layer.style.transform = 'translateY(' + (offset * depth * 20) + 'px)';
          });
        }, { passive: true });

        observer.unobserve(visual);
      }
    });
  }, {
    threshold: 0.1
  });

  landscapeVisuals.forEach(function(visual) {
    observer.observe(visual);
  });
}

function initAfflictionCardHover() {
  const cards = document.querySelectorAll('.affliction-card');

  cards.forEach(function(card) {
    const severity = card.getAttribute('data-severity');
    let shadowColor = 'rgba(139,26,26,0.15)';

    if (severity === 'critical') {
      shadowColor = 'rgba(255,68,0,0.15)';
    } else if (severity === 'extreme') {
      shadowColor = 'rgba(106,42,138,0.15)';
    } else if (severity === 'severe') {
      shadowColor = 'rgba(196,30,30,0.15)';
    } else if (severity === 'widespread') {
      shadowColor = 'rgba(106,170,62,0.15)';
    } else if (severity === 'moderate') {
      shadowColor = 'rgba(154,130,40,0.15)';
    }

    card.addEventListener('mouseenter', function() {
      card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.8), 0 0 30px ' + shadowColor;
    });

    card.addEventListener('mouseleave', function() {
      card.style.boxShadow = '';
    });
  });
}

function initChronicleEntryHover() {
  const entries = document.querySelectorAll('.chronicle-entry');

  entries.forEach(function(entry) {
    entry.addEventListener('mouseenter', function() {
      const text = entry.querySelector('.chronicle-text');
      if (text) {
        text.style.color = 'var(--color-ghost)';
        text.style.transition = 'color 0.3s ease';
      }
    });

    entry.addEventListener('mouseleave', function() {
      const text = entry.querySelector('.chronicle-text');
      if (text) {
        text.style.color = '';
      }
    });
  });
}

function initMiseryGaugeRotation() {
  const gaugeOuter = document.querySelector('.gauge-ring-outer');

  if (gaugeOuter) {
    let rotation = 0;
    let lastTime = Date.now();

    function updateRotation() {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      rotation += delta * 0.01;

      const fluctuation = Math.sin(Date.now() / 5000) * 2 + Math.sin(Date.now() / 3000) * 1;
      const currentValue = Math.min(100, Math.max(0, miseryBaseValue + fluctuation));
      const degrees = (currentValue / 100) * 360;

      gaugeOuter.style.background = 'conic-gradient(from ' + (rotation % 360) + 'deg, #8b1a1a 0deg, #c41e1e ' + degrees + 'deg, #1a1412 ' + degrees + 'deg, #1a1412 360deg)';

      requestAnimationFrame(updateRotation);
    }

    updateRotation();
  }
}

function initActiveRitualPulse() {
  const activeMarker = document.querySelector('.event-marker-active');

  if (activeMarker) {
    const eventContent = activeMarker.closest('.ritual-event').querySelector('.event-content');

    setInterval(function() {
      if (eventContent) {
        eventContent.style.boxShadow = '0 0 ' + (15 + Math.random() * 10) + 'px rgba(139,26,26,' + (0.1 + Math.random() * 0.1) + ')';
      }
    }, 2000);
  }
}

function initDreadRitualFlicker() {
  const dreadEvent = document.querySelector('.ritual-dread');

  if (dreadEvent) {
    setInterval(function() {
      if (Math.random() > 0.7) {
        const content = dreadEvent.querySelector('.event-content');
        if (content) {
          content.style.opacity = '0.85';
          setTimeout(function() {
            content.style.opacity = '1';
          }, 80);
          setTimeout(function() {
            content.style.opacity = '0.9';
          }, 160);
          setTimeout(function() {
            content.style.opacity = '1';
          }, 240);
        }
      }
    }, 4000);
  }
}

function initScrollProgressCorruption() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 2px; z-index: 999; transition: width 0.1s linear; background: linear-gradient(90deg, #8b1a1a, #c41e1e, #6a2a8a, #6aaa3e); pointer-events: none;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });
}

function init() {
  createRuneParticles();
  initCurseCursor();
  initHeaderScroll();
  initMiseryGauge();
  initAfflictionFilters();
  initScrollReveal();
  initProgressBars();
  initGaugeAnimation();
  initAtmosphericEffects();
  initArtifactInteraction();
  initHeroParallax();
  initRuneParticleRespawn();
  initRitualTimelineHover();
  initBloodDripOnHeroTitle();
  initGlitchEffect();
  initSmoothNavScroll();
  initCurrentRitualHighlight();
  initLandscapeParallax();
  initAfflictionCardHover();
  initChronicleEntryHover();
  initMiseryGaugeRotation();
  initActiveRitualPulse();
  initDreadRitualFlicker();
  initScrollProgressCorruption();

  setTimeout(function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }
  }, 100);
}

function initHeroEntrance() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
  }

  const heroRunes = document.querySelectorAll('.hero-rune');
  heroRunes.forEach(function(rune, index) {
    rune.style.opacity = '0';
    rune.style.transform = 'scale(0.5)';
    rune.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    rune.style.transitionDelay = (0.3 + index * 0.15) + 's';

    setTimeout(function() {
      rune.style.opacity = '';
      rune.style.transform = '';
    }, 200);
  });

  const titleLines = document.querySelectorAll('.title-line');
  titleLines.forEach(function(line, index) {
    line.style.opacity = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = 'opacity 1s ease, transform 1s ease';
    line.style.transitionDelay = (0.8 + index * 0.3) + 's';

    setTimeout(function() {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 200);
  });

  const epigraph = document.querySelector('.hero-epigraph');
  if (epigraph) {
    epigraph.style.opacity = '0';
    epigraph.style.transition = 'opacity 1.2s ease';
    epigraph.style.transitionDelay = '1.8s';
    setTimeout(function() {
      epigraph.style.opacity = '';
    }, 200);
  }

  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    subtitle.style.opacity = '0';
    subtitle.style.transition = 'opacity 1s ease';
    subtitle.style.transitionDelay = '2.2s';
    setTimeout(function() {
      subtitle.style.opacity = '';
    }, 200);
  }

  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.transition = 'opacity 1s ease';
    scrollIndicator.style.transitionDelay = '3s';
    setTimeout(function() {
      scrollIndicator.style.opacity = '';
    }, 200);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initHeroEntrance();
  init();
});