document.addEventListener('DOMContentLoaded', function () {
  const sparkleContainer = document.getElementById('sparkle-container');
  const cursorGlow = document.getElementById('cursor-glow');
  const gachaButton = document.getElementById('gacha-button');
  const gachaDisplay = document.getElementById('gacha-display');
  const historyList = document.getElementById('history-list');
  const feedMascotButton = document.getElementById('feed-mascot');
  const mascotStatus = document.getElementById('mascot-status');
  const mascotCompanion = document.getElementById('mascot-companion');
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.querySelector('.speech-text');
  const navLinks = document.querySelectorAll('.nav-link');

  const gachaCharacters = [
    { emoji: '🐱', name: 'neko-chan' },
    { emoji: '🐰', name: 'usagi' },
    { emoji: '🦊', name: 'kitsune' },
    { emoji: '🐻', name: 'kuma' },
    { emoji: '🐼', name: 'panda' },
    { emoji: '🐸', name: 'kaeru' },
    { emoji: '🐙', name: 'tako' },
    { emoji: '🦄', name: 'unicorn' },
    { emoji: '🐣', name: 'piyo' },
    { emoji: '🍡', name: 'dango spirit' }
  ];

  const mascotPhrases = [
    'moe moe kyun! ♡',
    'you look kawaii today! ✿',
    'let\'s watch anime together! 📺',
    'pulling gacha is fun! 🎰',
    'i love headpats! ✨',
    'have a sparkly day! 🌟',
    'kawaii is justice! ♡',
    'nya nya! 🐱',
    'stay fluffy! ☁️'
  ];

  let sparkleTimeout;
  let mascotPhraseInterval;

  function createSparkle(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle-particle');
      const size = Math.random() * 14 + 6;
      const offsetX = (Math.random() - 0.5) * 70;
      const offsetY = (Math.random() - 0.5) * 70;
      const duration = Math.random() * 700 + 500;
      const rotation = Math.random() * 360;
      const colors = ['#ffb7c5', '#ffd166', '#bae1ff', '#d7bde2', '#fff1b0', '#ff9cbb'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      sparkle.style.cssText = `
        position: absolute;
        left: ${x + offsetX}px;
        top: ${y + offsetY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        transform: rotate(${rotation}deg);
        pointer-events: none;
        z-index: 1001;
        animation: sparkleFade ${duration}ms ease-out forwards;
        opacity: 1;
        box-shadow: 0 0 12px ${color};
      `;

      sparkleContainer.appendChild(sparkle);

      sparkle.addEventListener('animationend', function () {
        sparkle.remove();
      });
    }
  }

  const sparkleStyle = document.createElement('style');
  sparkleStyle.textContent = `
    @keyframes sparkleFade {
      0% { transform: rotate(0deg) scale(0); opacity: 1; }
      50% { transform: rotate(180deg) scale(1.4); opacity: 0.8; }
      100% { transform: rotate(360deg) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(sparkleStyle);

  document.addEventListener('mousemove', function (e) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';

    if (sparkleTimeout) clearTimeout(sparkleTimeout);
    sparkleTimeout = setTimeout(function () {
      createSparkle(e.clientX, e.clientY, 2);
    }, 45);
  });

  document.addEventListener('click', function (e) {
    createSparkle(e.clientX, e.clientY, 9);
  });

  const interactiveElements = document.querySelectorAll('.cute-button, .manga-card, .nav-link, .mascot-companion');
  interactiveElements.forEach(function (el) {
    el.addEventListener('mouseenter', function (e) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      createSparkle(centerX, centerY, 4);
    });
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSectionId = 'home';
    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 180) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').substring(1);
      if (href === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      createSparkle(window.innerWidth / 2, window.innerHeight / 2, 8);
    });
  });

  function pullGacha() {
    gachaDisplay.style.transform = 'scale(0.2) rotate(180deg)';
    gachaDisplay.style.opacity = '0.3';

    setTimeout(function () {
      const randomIndex = Math.floor(Math.random() * gachaCharacters.length);
      const character = gachaCharacters[randomIndex];
      gachaDisplay.innerHTML = character.emoji;
      gachaDisplay.style.transform = 'scale(1.2) rotate(0deg)';
      gachaDisplay.style.opacity = '1';

      const historyItem = document.createElement('li');
      historyItem.classList.add('history-item');
      historyItem.textContent = character.emoji + ' ' + character.name;
      historyList.prepend(historyItem);

      if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
      }

      createSparkle(
        gachaDisplay.getBoundingClientRect().left + gachaDisplay.offsetWidth / 2,
        gachaDisplay.getBoundingClientRect().top + gachaDisplay.offsetHeight / 2,
        15
      );

      setTimeout(function () {
        gachaDisplay.style.transform = 'scale(1)';
      }, 200);
    }, 350);
  }

  gachaButton.addEventListener('click', pullGacha);

  function feedMascot() {
    mascotStatus.innerHTML = '<span class="status-text">munch munch... ♡</span>';
    feedMascotButton.disabled = true;
    feedMascotButton.style.opacity = '0.6';
    feedMascotButton.style.pointerEvents = 'none';

    createSparkle(
      mascotCompanion.getBoundingClientRect().left + 40,
      mascotCompanion.getBoundingClientRect().top + 40,
      12
    );

    mascotCompanion.style.transform = 'scale(1.15) translateY(-8px)';

    setTimeout(function () {
      mascotStatus.innerHTML = '<span class="status-text">so happy! ✨🌸</span>';
      mascotCompanion.style.transform = 'scale(1) translateY(0)';
      feedMascotButton.disabled = false;
      feedMascotButton.style.opacity = '1';
      feedMascotButton.style.pointerEvents = 'auto';
    }, 1500);
  }

  feedMascotButton.addEventListener('click', feedMascot);

  function randomMascotPhrase() {
    const randomPhrase = mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)];
    speechText.textContent = randomPhrase;
    speechBubble.style.opacity = '1';
    speechBubble.style.transform = 'translateY(0) scale(1)';

    setTimeout(function () {
      speechBubble.style.opacity = '0';
      speechBubble.style.transform = 'translateY(10px) scale(0.9)';
    }, 2500);
  }

  mascotPhraseInterval = setInterval(randomMascotPhrase, 8000);
  setTimeout(randomMascotPhrase, 1000);

  mascotCompanion.addEventListener('click', function (e) {
    e.stopPropagation();
    randomMascotPhrase();
    mascotCompanion.style.transform = 'scale(1.1) translateY(-10px)';
    createSparkle(e.clientX, e.clientY, 10);
    setTimeout(function () {
      mascotCompanion.style.transform = 'scale(1) translateY(0)';
    }, 300);
  });

  const mascotEyes = document.querySelectorAll('.pupil');
  document.addEventListener('mousemove', function (e) {
    const mascotRect = mascotCompanion.getBoundingClientRect();
    const mascotCenterX = mascotRect.left + mascotRect.width / 2;
    const mascotCenterY = mascotRect.top + mascotRect.height / 2;
    const deltaX = (e.clientX - mascotCenterX) / 35;
    const deltaY = (e.clientY - mascotCenterY) / 35;
    const limitedX = Math.max(-4, Math.min(4, deltaX));
    const limitedY = Math.max(-3, Math.min(3, deltaY));

    mascotEyes.forEach(function (pupil) {
      pupil.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
    });
  });

  updateActiveNavLink();

  console.log('✿ moe moe kyun! kawaii manga universe is ready! ✿');
  console.log('🐰 mochi the bunny says hello!');
});