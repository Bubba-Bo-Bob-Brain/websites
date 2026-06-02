document.addEventListener('DOMContentLoaded', function () {
  const bootScreen = document.getElementById('boot-screen');
  const windows = document.querySelectorAll('.draggable-window');
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  const taskbarItems = document.querySelectorAll('.taskbar-item');
  const secretLink = document.querySelector('.secret-link');
  const intactWindow = document.getElementById('window-intact');
  const restartBtn = document.getElementById('restart-btn');
  const claimBtn = document.querySelector('.claim-btn');
  const percentageSpan = document.getElementById('percentage');
  const clockElement = document.getElementById('clock');
  const cursorTrail = document.getElementById('cursor-trail');

  let bootTimeout;
  let percentageInterval;
  let trailElements = [];
  let mouseX = 0;
  let mouseY = 0;

  function initBootSequence() {
    bootTimeout = setTimeout(() => {
      bootScreen.style.opacity = '0';
      bootScreen.style.visibility = 'hidden';
      startClock();
      startPercentageSimulation();
    }, 2800);
  }

  function startClock() {
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  function startPercentageSimulation() {
    let percent = 87;
    percentageInterval = setInterval(() => {
      const randomChange = Math.floor(Math.random() * 5) - 2;
      percent = Math.min(99, Math.max(80, percent + randomChange));
      if (percentageSpan) {
        percentageSpan.textContent = percent + '%';
      }
      const progressFill = document.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = percent + '%';
      }
    }, 400);
  }

  function makeDraggable(element) {
    const titlebar = element.querySelector('.window-titlebar');
    if (!titlebar) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    titlebar.addEventListener('mousedown', function (e) {
      if (e.target.classList.contains('window-dot')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = element.offsetLeft;
      initialTop = element.offsetTop;
      element.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      element.style.left = (initialLeft + dx) + 'px';
      element.style.top = (initialTop + dy) + 'px';
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = '';
      }
    });
  }

  function focusWindow(windowElement) {
    windows.forEach(win => {
      win.style.zIndex = '10';
    });
    windowElement.style.zIndex = '50';
    windowElement.style.display = 'flex';
    windowElement.classList.add('active-window');
  }

  function toggleWindow(windowId) {
    const targetWindow = document.getElementById(windowId);
    if (!targetWindow) return;

    if (targetWindow.style.display === 'flex') {
      targetWindow.style.display = 'none';
      targetWindow.classList.remove('active-window');
    } else {
      focusWindow(targetWindow);
    }
  }

  desktopIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const windowId = this.getAttribute('data-window');
      if (windowId) {
        toggleWindow(windowId);
      }
    });
    icon.addEventListener('dblclick', function () {
      const windowId = this.getAttribute('data-window');
      if (windowId) {
        const win = document.getElementById(windowId);
        if (win) {
          focusWindow(win);
        }
      }
    });
  });

  taskbarItems.forEach(item => {
    item.addEventListener('click', function () {
      const windowId = this.getAttribute('data-window');
      if (windowId) {
        toggleWindow(windowId);
      }
    });
  });

  windows.forEach(win => {
    makeDraggable(win);
    win.style.display = 'none';
  });

  const bsodWindow = document.getElementById('window-bsod');
  if (bsodWindow) {
    bsodWindow.style.display = 'flex';
    bsodWindow.style.left = '80px';
    bsodWindow.style.top = '60px';
    bsodWindow.style.zIndex = '20';
  }

  const window404 = document.getElementById('window-404');
  if (window404) {
    window404.style.display = 'flex';
    window404.style.left = '250px';
    window404.style.top = '180px';
    window404.style.zIndex = '15';
  }

  const dbWindow = document.getElementById('window-database');
  if (dbWindow) {
    dbWindow.style.display = 'flex';
    dbWindow.style.left = '420px';
    dbWindow.style.top = '280px';
    dbWindow.style.zIndex = '10';
  }

  const popupWindow = document.getElementById('window-popup');
  if (popupWindow) {
    popupWindow.style.display = 'flex';
    popupWindow.style.left = '150px';
    popupWindow.style.top = '350px';
    popupWindow.style.zIndex = '5';
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      alert('RESTART FAILED. CORRUPTED BOOT SECTOR. PRESS ANY KEY TO CONTINUE...');
      const bsodFace = document.querySelector('.bsod-face');
      if (bsodFace) {
        bsodFace.textContent = ':(';
        bsodFace.style.color = '#ff0000';
      }
      const progressText = document.querySelector('.bsod-progress');
      if (progressText) {
        progressText.textContent = 'ERROR: 0% COMPLETE (HALTED)';
      }
    });
  }

  if (claimBtn) {
    claimBtn.addEventListener('click', function () {
      alert('CONGRATULATIONS! YOU HAVE WON A FREE VIRUS SCAN. DOWNLOADING NOW...');
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const newPopup = popupWindow.cloneNode(true);
          newPopup.style.left = (Math.random() * window.innerWidth * 0.6) + 'px';
          newPopup.style.top = (Math.random() * window.innerHeight * 0.6) + 'px';
          newPopup.style.display = 'flex';
          newPopup.style.zIndex = '60';
          document.getElementById('window-container').appendChild(newPopup);
          makeDraggable(newPopup);
        }, i * 400);
      }
    });
  }

  if (secretLink) {
    secretLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (intactWindow) {
        intactWindow.style.display = 'flex';
        intactWindow.style.left = '300px';
        intactWindow.style.top = '100px';
        intactWindow.style.zIndex = '80';
        intactWindow.classList.add('active-window');
        const hiddenIcon = document.querySelector('.secret-desktop-icon');
        if (hiddenIcon) {
          hiddenIcon.style.opacity = '1';
        }
        const hiddenTaskbar = document.querySelector('.hidden-taskbar-item');
        if (hiddenTaskbar) {
          hiddenTaskbar.style.opacity = '1';
        }
      }
    });
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    createTrailDot(e.clientX, e.clientY);
  });

  function createTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    dot.style.borderRadius = '0';
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '10001';
    dot.style.boxShadow = '0 0 8px currentColor';
    dot.style.transition = 'all 0.4s ease-out';
    cursorTrail.appendChild(dot);
    trailElements.push(dot);

    setTimeout(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0.2)';
    }, 20);

    setTimeout(() => {
      if (dot.parentNode === cursorTrail) {
        cursorTrail.removeChild(dot);
        trailElements = trailElements.filter(el => el !== dot);
      }
    }, 500);
  }

  function addRandomGlitchToTexts() {
    const texts = document.querySelectorAll('.glitch-text, .sql-error, .bsod-face');
    texts.forEach(text => {
      setInterval(() => {
        if (Math.random() > 0.7) {
          const original = text.textContent;
          const corrupted = original.split('').map(char => {
            if (Math.random() > 0.8) return String.fromCharCode(33 + Math.floor(Math.random() * 94));
            return char;
          }).join('');
          text.setAttribute('data-original', original);
          text.textContent = corrupted;
          setTimeout(() => {
            if (text.getAttribute('data-original')) {
              text.textContent = text.getAttribute('data-original');
            }
          }, 120);
        }
      }, 2000);
    });
  }

  function simulateDeadLinks() {
    const deadLinks = document.querySelectorAll('.dead-link');
    deadLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const originalText = this.textContent;
        this.textContent = 'ERROR_ACCESSING_RESOURCE';
        this.style.color = '#ff0000';
        setTimeout(() => {
          this.textContent = originalText;
          this.style.color = '#8888ff';
        }, 800);
      });
    });
  }

  initBootSequence();
  addRandomGlitchToTexts();
  simulateDeadLinks();

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Unsaved data may be corrupted.';
  });
});