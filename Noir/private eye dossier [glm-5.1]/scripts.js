(function () {

  var rainCanvas = document.getElementById('rain-canvas');
  var rainCtx = rainCanvas.getContext('2d');
  var rainDrops = [];
  var RAIN_COUNT = 120;

  var smokeCanvas = document.getElementById('smoke-canvas');
  var smokeCtx = smokeCanvas.getContext('2d');
  var smokeParticles = [];
  var mouseX = -200;
  var mouseY = -200;
  var isMouseMoving = false;
  var mouseTimer = null;

  var flashOverlay = document.getElementById('flash-overlay');
  var navTabs = document.querySelectorAll('.nav-tab');
  var sections = document.querySelectorAll('.case-section');

  var corkboard = document.getElementById('corkboard');
  var threadSvg = document.getElementById('thread-canvas');
  var threadCountEl = document.getElementById('thread-count');
  var btnClearThreads = document.getElementById('btn-clear-threads');
  var btnAutoConnect = document.getElementById('btn-auto-connect');

  var connections = [];
  var selectedPinId = null;
  var isDragging = false;
  var hasDragged = false;
  var dragTarget = null;
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  var typewriterStarted = false;
  var typewriterComplete = false;
  var typewriterTimeouts = [];

  var autoConnections = [
    { from: 'moreau', to: 'handkerchief' },
    { from: 'moreau', to: 'castellano' },
    { from: 'moreau', to: 'sterling' },
    { from: 'castellano', to: 'weapon' },
    { from: 'castellano', to: 'morano' },
    { from: 'castellano', to: 'photo' },
    { from: 'castellano', to: 'brennan' },
    { from: 'morano', to: 'weapon' },
    { from: 'morano', to: 'telegram' },
    { from: 'brennan', to: 'ledger' },
    { from: 'sterling', to: 'ledger' },
    { from: 'handkerchief', to: 'sterling' }
  ];


  // ========================================
  // RAIN ON GLASS
  // ========================================

  function resizeRainCanvas() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
  }

  function createRainDrop(startAtTop) {
    return {
      x: Math.random() * rainCanvas.width,
      y: startAtTop ? -20 : Math.random() * rainCanvas.height,
      length: Math.random() * 18 + 6,
      speed: Math.random() * 5 + 5,
      opacity: Math.random() * 0.25 + 0.05,
      drift: Math.random() * 0.6 - 0.1,
      thickness: Math.random() * 0.8 + 0.4
    };
  }

  function initRain() {
    resizeRainCanvas();
    rainDrops = [];
    for (var i = 0; i < RAIN_COUNT; i++) {
      rainDrops.push(createRainDrop(false));
    }
  }

  function animateRain() {
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);

    for (var i = 0; i < rainDrops.length; i++) {
      var drop = rainDrops[i];

      rainCtx.beginPath();
      rainCtx.moveTo(drop.x, drop.y);
      rainCtx.lineTo(drop.x + drop.drift * 2, drop.y + drop.length);
      rainCtx.strokeStyle = 'rgba(170, 190, 210, ' + drop.opacity + ')';
      rainCtx.lineWidth = drop.thickness;
      rainCtx.lineCap = 'round';
      rainCtx.stroke();

      drop.y += drop.speed;
      drop.x += drop.drift;

      if (drop.y > rainCanvas.height + 20) {
        rainDrops[i] = createRainDrop(true);
      }
    }

    requestAnimationFrame(animateRain);
  }


  // ========================================
  // SMOKE WISP CURSOR TRAIL
  // ========================================

  function resizeSmokeCanvas() {
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;
  }

  function addSmokeParticle(x, y) {
    smokeParticles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      size: Math.random() * 10 + 3,
      opacity: Math.random() * 0.12 + 0.03,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -Math.random() * 1.2 - 0.3,
      life: 1.0,
      decay: Math.random() * 0.012 + 0.006,
      growth: Math.random() * 0.25 + 0.08
    });
  }

  function animateSmoke() {
    smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

    if (isMouseMoving && Math.random() > 0.35) {
      addSmokeParticle(mouseX, mouseY);
    }

    for (var i = smokeParticles.length - 1; i >= 0; i--) {
      var p = smokeParticles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.size += p.growth;
      p.life -= p.decay;
      p.opacity *= 0.985;
      p.vx += (Math.random() - 0.5) * 0.08;
      p.vy -= 0.005;

      if (p.life <= 0 || p.opacity < 0.002) {
        smokeParticles.splice(i, 1);
        continue;
      }

      var currentOpacity = p.opacity * p.life;
      var gradient = smokeCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, 'rgba(190, 190, 200, ' + currentOpacity + ')');
      gradient.addColorStop(0.5, 'rgba(160, 160, 175, ' + (currentOpacity * 0.5) + ')');
      gradient.addColorStop(1, 'rgba(140, 140, 155, 0)');

      smokeCtx.beginPath();
      smokeCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      smokeCtx.fillStyle = gradient;
      smokeCtx.fill();
    }

    if (smokeParticles.length > 60) {
      smokeParticles.splice(0, smokeParticles.length - 60);
    }

    requestAnimationFrame(animateSmoke);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;

    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(function () {
      isMouseMoving = false;
    }, 120);
  });


  // ========================================
  // NAVIGATION
  // ========================================

  function switchSection(sectionId) {
    sections.forEach(function (s) {
      s.classList.remove('active');
    });

    navTabs.forEach(function (t) {
      t.classList.remove('active');
    });

    var targetSection = document.getElementById('section-' + sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    var activeTab = document.querySelector('.nav-tab[data-section="' + sectionId + '"]');
    if (activeTab) {
      activeTab.classList.add('active');
    }

    if (sectionId === 'overview') {
      startTypewriter();
      revealTimeline();
    }

    if (sectionId === 'suspects') {
      animateThreatMeters();
      staggerReveal('.suspect-card', 150);
    }

    if (sectionId === 'evidence') {
      staggerReveal('.evidence-card', 120);
    }

    if (sectionId === 'witnesses') {
      animateCredibilityBars();
      staggerReveal('.witness-statement', 200);
    }

    if (sectionId === 'corkboard') {
      setTimeout(function () {
        updateAllThreads();
      }, 100);
    }
  }

  navTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      switchSection(this.dataset.section);
    });
  });


  // ========================================
  // STAGGERED REVEAL
  // ========================================

  function staggerReveal(selector, delay) {
    var items = document.querySelectorAll(selector);
    items.forEach(function (item, i) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(15px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(function () {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, delay * (i + 1));
    });
  }


  // ========================================
  // TYPEWRITER TEXT REVEAL
  // ========================================

  function startTypewriter() {
    if (typewriterComplete) return;

    var container = document.getElementById('case-narrative');
    var paragraphs = container.querySelectorAll('p');

    if (!typewriterStarted) {
      typewriterStarted = true;

      var fullTexts = [];
      paragraphs.forEach(function (p) {
        fullTexts.push(p.textContent);
      });

      var currentParagraph = 0;

      function typeParagraph(index) {
        if (index >= paragraphs.length) {
          typewriterComplete = true;
          return;
        }

        var p = paragraphs[index];
        var fullText = fullTexts[index];
        p.textContent = '';
        p.classList.add('typewriter-visible', 'typewriter-typing');

        var charIndex = 0;

        function typeChar() {
          if (charIndex < fullText.length) {
            p.textContent += fullText[charIndex];
            charIndex++;

            var baseSpeed = 22;
            var char = fullText[charIndex - 1];
            if (char === '.' || char === '!' || char === '?') {
              baseSpeed = 120;
            } else if (char === ',') {
              baseSpeed = 60;
            } else if (char === '—') {
              baseSpeed = 80;
            } else {
              baseSpeed = 18 + Math.random() * 16;
            }

            var t = setTimeout(typeChar, baseSpeed);
            typewriterTimeouts.push(t);
          } else {
            p.classList.remove('typewriter-typing');
            var t = setTimeout(function () {
              typeParagraph(index + 1);
            }, 350);
            typewriterTimeouts.push(t);
          }
        }

        typeChar();
      }

      typeParagraph(0);
    } else if (!typewriterComplete) {
      // If revisited before complete, show all text immediately
      clearTypewriterTimeouts();
      paragraphs.forEach(function (p) {
        p.classList.add('typewriter-visible');
        p.classList.remove('typewriter-typing');
      });
      typewriterComplete = true;
    }
  }

  function clearTypewriterTimeouts() {
    typewriterTimeouts.forEach(function (t) {
      clearTimeout(t);
    });
    typewriterTimeouts = [];
  }


  // ========================================
  // TIMELINE REVEAL
  // ========================================

  function revealTimeline() {
    var items = document.querySelectorAll('.timeline-item');
    items.forEach(function (item, i) {
      item.classList.remove('timeline-visible');
      setTimeout(function () {
        item.classList.add('timeline-visible');
      }, i * 250 + 600);
    });
  }


  // ========================================
  // THREAT METERS
  // ========================================

  function animateThreatMeters() {
    var fills = document.querySelectorAll('.threat-fill');
    fills.forEach(function (fill, i) {
      var level = parseInt(fill.dataset.level);
      fill.style.width = '0';
      setTimeout(function () {
        fill.style.width = (level * 20) + '%';
      }, 200 + i * 150);
    });
  }


  // ========================================
  // CREDIBILITY BARS
  // ========================================

  function animateCredibilityBars() {
    var fills = document.querySelectorAll('.credibility-fill');
    fills.forEach(function (fill, i) {
      var score = parseInt(fill.dataset.score);
      fill.style.width = '0';
      setTimeout(function () {
        fill.style.width = (score * 10) + '%';
      }, 200 + i * 200);
    });
  }


  // ========================================
  // EVIDENCE CAMERA FLASH
  // ========================================

  var evidenceCards = document.querySelectorAll('.evidence-card');
  evidenceCards.forEach(function (card) {
    card.addEventListener('click', function () {
      flashOverlay.classList.add('flash-active');

      setTimeout(function () {
        flashOverlay.classList.remove('flash-active');
      }, 80);

      setTimeout(function () {
        flashOverlay.classList.add('flash-active');
        flashOverlay.style.opacity = '0.4';

        setTimeout(function () {
          flashOverlay.classList.remove('flash-active');
          flashOverlay.style.opacity = '';
        }, 60);
      }, 150);
    });
  });


  // ========================================
  // CORKBOARD — THREAD CONNECTIONS
  // ========================================

  function getPinCenter(pinEl) {
    var boardRect = corkboard.getBoundingClientRect();
    var pinRect = pinEl.getBoundingClientRect();

    var x = pinRect.left + pinRect.width / 2 - boardRect.left;
    var y = pinRect.top + 8 - boardRect.top;

    return { x: x, y: y };
  }

  function connectionExists(fromId, toId) {
    return connections.some(function (c) {
      return (c.from === fromId && c.to === toId) ||
             (c.from === toId && c.to === fromId);
    });
  }

  function buildPathD(fromCenter, toCenter) {
    var midX = (fromCenter.x + toCenter.x) / 2;
    var midY = (fromCenter.y + toCenter.y) / 2;
    var dx = toCenter.x - fromCenter.x;
    var dy = toCenter.y - fromCenter.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var curvature = Math.min(dist * 0.08, 25);
    var offsetX = (Math.random() - 0.5) * curvature;
    var offsetY = (Math.random() - 0.5) * curvature;

    return 'M ' + fromCenter.x + ' ' + fromCenter.y +
           ' Q ' + (midX + offsetX) + ' ' + (midY + offsetY) +
           ' ' + toCenter.x + ' ' + toCenter.y;
  }

  function createThread(fromId, toId) {
    if (fromId === toId) return;
    if (connectionExists(fromId, toId)) return;

    var fromEl = document.querySelector('[data-pin="' + fromId + '"]');
    var toEl = document.querySelector('[data-pin="' + toId + '"]');

    if (!fromEl || !toEl) return;

    var fromCenter = getPinCenter(fromEl);
    var toCenter = getPinCenter(toEl);
    var d = buildPathD(fromCenter, toCenter);

    var glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowPath.setAttribute('d', d);
    glowPath.setAttribute('stroke', 'rgba(200, 30, 30, 0.25)');
    glowPath.setAttribute('stroke-width', '5');
    glowPath.setAttribute('fill', 'none');
    glowPath.style.pointerEvents = 'none';

    var visiblePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    visiblePath.setAttribute('d', d);
    visiblePath.setAttribute('stroke', '#8b0000');
    visiblePath.setAttribute('stroke-width', '1.5');
    visiblePath.setAttribute('fill', 'none');
    visiblePath.setAttribute('opacity', '0.75');
    visiblePath.style.pointerEvents = 'none';

    var hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hitPath.setAttribute('d', d);
    hitPath.setAttribute('stroke', 'transparent');
    hitPath.setAttribute('stroke-width', '12');
    hitPath.setAttribute('fill', 'none');
    hitPath.style.pointerEvents = 'stroke';
    hitPath.style.cursor = 'pointer';

    threadSvg.appendChild(glowPath);
    threadSvg.appendChild(visiblePath);
    threadSvg.appendChild(hitPath);

    hitPath.addEventListener('mouseenter', function () {
      visiblePath.setAttribute('stroke', '#e34234');
      visiblePath.setAttribute('stroke-width', '2.5');
      glowPath.setAttribute('stroke', 'rgba(200, 30, 30, 0.5)');
    });

    hitPath.addEventListener('mouseleave', function () {
      visiblePath.setAttribute('stroke', '#8b0000');
      visiblePath.setAttribute('stroke-width', '1.5');
      glowPath.setAttribute('stroke', 'rgba(200, 30, 30, 0.25)');
    });

    hitPath.addEventListener('click', function (e) {
      e.stopPropagation();
      severThread(fromId, toId);
    });

    var connection = {
      from: fromId,
      to: toId,
      hitPath: hitPath,
      visiblePath: visiblePath,
      glowPath: glowPath
    };

    connections.push(connection);
    updateThreadCount();
  }

  function severThread(fromId, toId) {
    var index = connections.findIndex(function (c) {
      return (c.from === fromId && c.to === toId) ||
             (c.from === toId && c.to === fromId);
    });

    if (index !== -1) {
      var conn = connections[index];
      conn.hitPath.remove();
      conn.visiblePath.remove();
      conn.glowPath.remove();
      connections.splice(index, 1);
      updateThreadCount();
    }
  }

  function updateThreadCount() {
    threadCountEl.textContent = connections.length;
  }

  function updateAllThreads() {
    connections.forEach(function (conn) {
      var fromEl = document.querySelector('[data-pin="' + conn.from + '"]');
      var toEl = document.querySelector('[data-pin="' + conn.to + '"]');

      if (!fromEl || !toEl) return;

      var fromCenter = getPinCenter(fromEl);
      var toCenter = getPinCenter(toEl);
      var d = buildPathD(fromCenter, toCenter);

      conn.hitPath.setAttribute('d', d);
      conn.visiblePath.setAttribute('d', d);
      conn.glowPath.setAttribute('d', d);
    });
  }

  function clearAllThreads() {
    while (connections.length > 0) {
      var conn = connections[0];
      conn.hitPath.remove();
      conn.visiblePath.remove();
      conn.glowPath.remove();
      connections.splice(0, 1);
    }
    updateThreadCount();
  }


  // ========================================
  // CORKBOARD — PIN INTERACTION
  // ========================================

  var pinnedItems = document.querySelectorAll('.pinned-item');

  pinnedItems.forEach(function (pin) {
    pin.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;

      hasDragged = false;
      dragTarget = this;

      var rect = this.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;

      this.style.zIndex = '20';

      e.preventDefault();
    });

    pin.addEventListener('click', function (e) {
      if (hasDragged) return;

      var pinId = this.dataset.pin;

      if (!selectedPinId) {
        selectedPinId = pinId;
        this.classList.add('pin-selected');
      } else if (selectedPinId === pinId) {
        selectedPinId = null;
        this.classList.remove('pin-selected');
      } else {
        var firstPin = document.querySelector('[data-pin="' + selectedPinId + '"]');
        if (firstPin) firstPin.classList.remove('pin-selected');

        createThread(selectedPinId, pinId);
        selectedPinId = null;
      }
    });

    // Touch support
    pin.addEventListener('touchstart', function (e) {
      hasDragged = false;
      dragTarget = this;

      var touch = e.touches[0];
      var rect = this.getBoundingClientRect();
      dragOffsetX = touch.clientX - rect.left;
      dragOffsetY = touch.clientY - rect.top;

      this.style.zIndex = '20';

      e.preventDefault();
    }, { passive: false });
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragTarget) return;

    hasDragged = true;

    var boardRect = corkboard.getBoundingClientRect();
    var newX = e.clientX - boardRect.left - dragOffsetX;
    var newY = e.clientY - boardRect.top - dragOffsetY;

    newX = Math.max(0, Math.min(newX, boardRect.width - dragTarget.offsetWidth));
    newY = Math.max(0, Math.min(newY, boardRect.height - dragTarget.offsetHeight));

    dragTarget.style.left = newX + 'px';
    dragTarget.style.top = newY + 'px';

    updateAllThreads();
  });

  document.addEventListener('touchmove', function (e) {
    if (!dragTarget) return;

    hasDragged = true;

    var touch = e.touches[0];
    var boardRect = corkboard.getBoundingClientRect();
    var newX = touch.clientX - boardRect.left - dragOffsetX;
    var newY = touch.clientY - boardRect.top - dragOffsetY;

    newX = Math.max(0, Math.min(newX, boardRect.width - dragTarget.offsetWidth));
    newY = Math.max(0, Math.min(newY, boardRect.height - dragTarget.offsetHeight));

    dragTarget.style.left = newX + 'px';
    dragTarget.style.top = newY + 'px';

    updateAllThreads();

    e.preventDefault();
  }, { passive: false });

  document.addEventListener('mouseup', function () {
    if (dragTarget) {
      dragTarget.style.zIndex = '';
      var target = dragTarget;
      dragTarget = null;
      setTimeout(function () {
        isDragging = false;
      }, 50);
    }
  });

  document.addEventListener('touchend', function () {
    if (dragTarget) {
      dragTarget.style.zIndex = '';
      dragTarget = null;
    }
  });


  // ========================================
  // CORKBOARD — CONTROL BUTTONS
  // ========================================

  btnClearThreads.addEventListener('click', function () {
    clearAllThreads();

    var selectedPin = document.querySelector('.pin-selected');
    if (selectedPin) {
      selectedPin.classList.remove('pin-selected');
      selectedPinId = null;
    }
  });

  btnAutoConnect.addEventListener('click', function () {
    clearAllThreads();

    var selectedPin = document.querySelector('.pin-selected');
    if (selectedPin) {
      selectedPin.classList.remove('pin-selected');
      selectedPinId = null;
    }

    autoConnections.forEach(function (conn, i) {
      setTimeout(function () {
        createThread(conn.from, conn.to);
      }, i * 180);
    });
  });


  // ========================================
  // VENETIAN BLIND FLICKER
  // ========================================

  var blindsEl = document.getElementById('venetian-blinds');

  function flickerBlinds() {
    var delay = 5000 + Math.random() * 15000;

    setTimeout(function () {
      blindsEl.style.transition = 'opacity 0.1s ease';
      blindsEl.style.opacity = '0.2';

      setTimeout(function () {
        blindsEl.style.opacity = '0.6';

        setTimeout(function () {
          blindsEl.style.opacity = '0.3';

          setTimeout(function () {
            blindsEl.style.opacity = '0.5';
            blindsEl.style.transition = '';
            flickerBlinds();
          }, 80);
        }, 60);
      }, 100);
    }, delay);
  }


  // ========================================
  // CLASSIFIED STAMP ANIMATION
  // ========================================

  function animateClassifiedStamp() {
    var stamp = document.querySelector('.classified-stamp');
    if (!stamp) return;

    stamp.style.opacity = '0';
    stamp.style.transform = 'translateY(-50%) rotate(12deg) scale(1.8)';

    setTimeout(function () {
      stamp.style.transition = 'opacity 0.15s ease, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      stamp.style.opacity = '0.35';
      stamp.style.transform = 'translateY(-50%) rotate(12deg) scale(1)';

      setTimeout(function () {
        stamp.style.transition = 'transform 0.1s ease';
        stamp.style.transform = 'translateY(-50%) rotate(12deg) scale(1.03)';

        setTimeout(function () {
          stamp.style.transform = 'translateY(-50%) rotate(12deg) scale(1)';
          stamp.style.transition = '';
        }, 100);
      }, 300);
    }, 800);
  }


  // ========================================
  // HEADER ENTRANCE ANIMATION
  // ========================================

  function animateHeaderEntrance() {
    var headerElements = [
      '.header-top-bar',
      '.case-number-line',
      '.case-title',
      '.case-subtitle',
      '.header-meta'
    ];

    headerElements.forEach(function (selector, i) {
      var el = document.querySelector(selector);
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 200 + i * 180);
      }
    });
  }


  // ========================================
  // AMBIENT SMOKE WISPS (background atmosphere)
  // ========================================

  function addAmbientSmoke() {
    if (Math.random() > 0.3) return;

    var x = Math.random() * window.innerWidth;
    var y = window.innerHeight + 10;

    smokeParticles.push({
      x: x,
      y: y,
      size: Math.random() * 30 + 15,
      opacity: Math.random() * 0.04 + 0.01,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.15,
      life: 1.0,
      decay: Math.random() * 0.003 + 0.001,
      growth: Math.random() * 0.15 + 0.05
    });
  }

  setInterval(addAmbientSmoke, 800);


  // ========================================
  // WINDOW RESIZE HANDLER
  // ========================================

  var resizeTimer = null;

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeRainCanvas();
      resizeSmokeCanvas();
      if (document.getElementById('section-corkboard').classList.contains('active')) {
        updateAllThreads();
      }
    }, 150);
  });


  // ========================================
  // KEYBOARD NAVIGATION
  // ========================================

  document.addEventListener('keydown', function (e) {
    var sectionKeys = {
      '1': 'overview',
      '2': 'suspects',
      '3': 'evidence',
      '4': 'witnesses',
      '5': 'corkboard'
    };

    if (sectionKeys[e.key]) {
      switchSection(sectionKeys[e.key]);
    }

    // Escape to deselect pin
    if (e.key === 'Escape' && selectedPinId) {
      var selectedPin = document.querySelector('[data-pin="' + selectedPinId + '"]');
      if (selectedPin) selectedPin.classList.remove('pin-selected');
      selectedPinId = null;
    }
  });


  // ========================================
  // INITIALIZATION
  // ========================================

  function init() {
    resizeRainCanvas();
    resizeSmokeCanvas();
    initRain();
    animateRain();
    animateSmoke();
    animateHeaderEntrance();
    animateClassifiedStamp();
    flickerBlinds();

    switchSection('overview');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();