const BroadcastAuthority = {
  clockElement: null,
  tickerTrack: null,
  planBars: [],
  planValues: [],
  statNumbers: [],
  navLinks: [],
  sections: [],

  init: function () {
    this.cacheElements();
    this.startClock();
    this.setupTicker();
    this.setupScrollObserver();
    this.setupNavHighlighting();
    this.setupSmoothScroll();
    this.setupSignalGlitch();
    this.startUptimeCounter();
  },

  cacheElements: function () {
    this.clockElement = document.getElementById('broadcastClock');
    this.tickerTrack = document.querySelector('.ticker-track');

    this.planBars = document.querySelectorAll('.plan-bar-fill');
    this.planValues = document.querySelectorAll('.plan-value');
    this.statNumbers = document.querySelectorAll('.stat-number');

    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
  },

  startClock: function () {
    var self = this;

    function updateClock() {
      var now = new Date();
      var moscowOffset = 3 * 60;
      var utc = now.getTime() + now.getTimezoneOffset() * 60000;
      var moscowTime = new Date(utc + moscowOffset * 60000);

      var hours = String(moscowTime.getHours()).padStart(2, '0');
      var minutes = String(moscowTime.getMinutes()).padStart(2, '0');
      var seconds = String(moscowTime.getSeconds()).padStart(2, '0');

      self.clockElement.textContent = hours + ':' + minutes + ':' + seconds + ' МСК';
    }

    updateClock();
    setInterval(updateClock, 1000);
  },

  setupTicker: function () {
    var content = document.getElementById('tickerContent');
    if (!content) return;

    var items = content.innerHTML;
    content.innerHTML = items + items;

    var track = this.tickerTrack;
    if (!track) return;

    track.addEventListener('mouseenter', function () {
      content.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', function () {
      content.style.animationPlayState = 'running';
    });
  },

  setupScrollObserver: function () {
    var self = this;

    var observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    var planObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          self.animatePlanBars();
          planObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          self.animateStatCounters();
          statsObserver.unobserve(entry.target);
        }
      });
      }, observerOptions);

    var planSection = document.getElementById('fiveyear');
    var statsSection = document.getElementById('statistics');

    if (planSection) planObserver.observe(planSection);
    if (statsSection) statsObserver.observe(statsSection);
  },

  animatePlanBars: function () {
    var self = this;

    this.planBars.forEach(function (bar, index) {
      var targetWidth = bar.getAttribute('data-width');
      var delay = index * 200;

      setTimeout(function () {
        bar.style.width = targetWidth + '%';
      }, delay);
    });

    this.planValues.forEach(function (valueEl, index) {
      var target = parseInt(valueEl.getAttribute('data-target'), 10);
      var suffix = valueEl.getAttribute('data-suffix') || '';
      var delay = index * 200;
      var duration = 2000;
      var startDelay = delay;

      setTimeout(function () {
        self.animateCounter(valueEl, 0, target, duration, suffix);
      }, startDelay);
    });
  },

  animateStatCounters: function () {
    var self = this;

    this.statNumbers.forEach(function (el, index) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var delay = index * 300;
      var duration = 2500;

      setTimeout(function () {
        self.animateCounter(el, 0, target, duration, suffix);
      }, delay);
    });
  },

  animateCounter: function (element, start, end, duration, suffix) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (end - start) * easedProgress);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = end.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  },

  setupNavHighlighting: function () {
    var self = this;
    var sectionPositions = {};

    function calculatePositions() {
      self.sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        sectionPositions[section.id] = {
          top: rect.top + window.pageYOffset,
          bottom: rect.bottom + window.pageYOffset
        };
      });
    }

    calculatePositions();

    var scrollTimeout;
    window.addEventListener('scroll', function () {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var scrollPos = window.pageYOffset + 200;

        var activeId = null;
        self.sections.forEach(function (section) {
          if (
            sectionPositions[section.id] &&
            scrollPos >= sectionPositions[section.id].top &&
            scrollPos < sectionPositions[section.id].bottom
          ) {
            activeId = section.id;
          }
        });

        self.navLinks.forEach(function (link) {
          link.classList.remove('active');
          var href = link.getAttribute('href');
          if (href === '#' + activeId) {
            link.classList.add('active');
          }
        });
      }, 50);
    });

    var resizeTimeout;
    window.addEventListener('resize', function () {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculatePositions, 200);
    });
  },

  setupSmoothScroll: function () {
    this.navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          var headerHeight = document.querySelector('.broadcast-header').offsetHeight;
          var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  },

  setupSignalGlitch: function () {
    var interference = document.querySelector('.signal-interference');
    if (!interference) return;

    function triggerGlitch() {
      interference.style.opacity = '1';
      interference.style.transform = 'translateX(' + (Math.random() * 6 - 3) + 'px)';

      var heroHeadline = document.querySelector('.hero-headline');
      if (heroHeadline) {
        heroHeadline.style.textShadow = String(Math.random() * 4 - 2) + 'px ' + String(Math.random() * 4 - 2) + 'px 0 rgba(230,0,0,0.8), ' + String(Math.random() * 4 - 2) + 'px ' + String(Math.random() * 4 - 2) + 'px 0 rgba(255,215,0,0.5)';
        heroHeadline.style.transform = 'skewX(' + (Math.random() * 2 - 1) + 'deg)';
      }

      var glitchDuration = 50 + Math.random() * 150;

      setTimeout(function () {
        interference.style.opacity = '0';
        interference.style.transform = 'translateX(0)';
        if (heroHeadline) {
          heroHeadline.style.textShadow = '2px 2px 0 rgba(139, 0, 0, 0.5)';
          heroHeadline.style.transform = 'skewX(0)';
        }
      }, glitchDuration);

      var nextGlitch = 5000 + Math.random() * 20000;
      setTimeout(triggerGlitch, nextGlitch);
    }

    var initialDelay = 3000 + Math.random() * 5000;
    setTimeout(triggerGlitch, initialDelay);
  },

  startUptimeCounter: function () {
    var cycleCount = 287;
    var cycleMinutes = 42;

    function updateCycle() {
      cycleMinutes++;
      if (cycleMinutes >= 60) {
        cycleMinutes = 0;
        cycleCount++;
      }

      var tagDate = document.querySelector('.tag-date');
      if (tagDate) {
        tagDate.textContent = 'CYCLE ' + cycleCount + '.' + String(cycleMinutes).padStart(2, '0') + ' \u2014 YEAR 84 OF THE REVOLUTION';
      }
    }

    setInterval(updateCycle, 60000);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  BroadcastAuthority.init();
});