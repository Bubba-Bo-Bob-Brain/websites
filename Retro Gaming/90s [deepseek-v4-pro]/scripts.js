document.addEventListener('DOMContentLoaded', function() {

  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');
  const mascot = document.getElementById('mascot');
  const speechBubble = document.getElementById('speechBubble');
  const liveClock = document.getElementById('liveClock');
  const liveDate = document.getElementById('liveDate');
  const cheatInput = document.getElementById('cheatInput');
  const executeCheat = document.getElementById('executeCheat');
  const cheatOutput = document.getElementById('cheatOutput');
  const easterEggDisplay = document.getElementById('easterEggDisplay');
  const secretComboDisplay = document.getElementById('secretComboDisplay');
  const cartridgeCards = document.querySelectorAll('.cartridge-card');
  const detailScreen = document.querySelector('.detail-placeholder');
  const submitScoreBtn = document.getElementById('submitScore');
  const initialInputs = document.querySelectorAll('.initial-input');
  const leaderboardBody = document.getElementById('leaderboardBody');

  let konamiCodeSequence = [];
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let currentKonamiIndex = 0;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (liveClock) {
      liveClock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    if (liveDate) {
      liveDate.textContent = `${month} ${day} ${year}`;
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      navButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const sectionId = this.getAttribute('data-section');
      sections.forEach(section => section.classList.remove('active-section'));
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active-section');
      }
      playBlipSound();
    });
  });

  if (mascot) {
    mascot.addEventListener('click', function() {
      const messages = [
        "HEY! LISTEN!",
        "WATCH OUT!",
        "TRY A CHEAT CODE!",
        "HIGH SCORE!",
        "GAME ON!",
        "INSERT COIN!"
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const bubbleText = speechBubble.querySelector('p');
      if (bubbleText) {
        bubbleText.innerHTML = randomMsg + '<br>❤️';
      }
      mascot.style.transform = 'scale(1.2)';
      setTimeout(() => {
        mascot.style.transform = 'scale(1)';
      }, 150);
      playBlipSound();
    });

    mascot.addEventListener('mouseenter', function() {
      const bubbleText = speechBubble.querySelector('p');
      if (bubbleText) {
        bubbleText.innerHTML = 'CLICK ME!<br>😜';
      }
    });

    mascot.addEventListener('mouseleave', function() {
      const bubbleText = speechBubble.querySelector('p');
      if (bubbleText) {
        bubbleText.innerHTML = 'WELCOME, PLAYER!<br>PRESS START!';
      }
    });
  }

  function playBlipSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log('Audio play failed silently');
    }
  }

  cartridgeCards.forEach(card => {
    card.addEventListener('click', function() {
      const game = this.getAttribute('data-game');
      const gameNames = {
        'star-fox': 'STAR FOX - 1993',
        'zelda': 'THE LEGEND OF ZELDA - 1991',
        'metroid': 'SUPER METROID - 1994',
        'donkey-kong': 'DONKEY KONG COUNTRY - 1994',
        'mario-kart': 'SUPER MARIO KART - 1992',
        'f-zero': 'F-ZERO - 1990'
      };
      if (detailScreen) {
        detailScreen.textContent = gameNames[game] || 'UNKNOWN GAME';
        detailScreen.style.color = '#39ff14';
      }
      cartridgeCards.forEach(c => c.style.borderColor = '#4a4a6a');
      this.style.borderColor = '#ff00de';
      playBlipSound();
    });
  });

  if (executeCheat && cheatInput && cheatOutput) {
    executeCheat.addEventListener('click', function() {
      handleCheatCode(cheatInput.value.trim().toUpperCase());
      cheatInput.value = '';
    });

    cheatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleCheatCode(cheatInput.value.trim().toUpperCase());
        cheatInput.value = '';
      }
    });
  }

  function handleCheatCode(code) {
    const validCheats = {
      'UPUPDOWNDOWNLEFTRIGHTLEFTRIGHTBA': 'KONAMI CODE ACTIVATED! 30 LIVES!',
      'IDDQD': 'GOD MODE ENABLED',
      'IDKFA': 'ALL WEAPONS AND KEYS',
      'JUSTINBAILEY': 'METROID SECRET',
      '0073735963': 'MIKE TYSON CODE',
      'BARRY': 'LEVEL SKIP'
    };

    let response = 'INVALID CODE... TRY AGAIN';

    if (validCheats[code]) {
      response = validCheats[code];
      if (easterEggDisplay) {
        easterEggDisplay.style.display = 'block';
        setTimeout(() => {
          easterEggDisplay.style.display = 'none';
        }, 4000);
      }
      if (code === 'UPUPDOWNDOWNLEFTRIGHTLEFTRIGHTBA') {
        document.body.style.background = '#ff00de';
        setTimeout(() => {
          document.body.style.background = '';
        }, 1500);
      }
    }

    cheatOutput.innerHTML = `> ${response}<br>> READY_<span class="cursor-blink">█</span>`;
    playBlipSound();
  }

  document.addEventListener('keydown', function(e) {
    const key = e.key;
    const expectedKey = konamiCode[currentKonamiIndex];

    if (key === expectedKey) {
      currentKonamiIndex++;
      if (currentKonamiIndex === konamiCode.length) {
        activateKonamiCode();
        currentKonamiIndex = 0;
      }
    } else {
      currentKonamiIndex = 0;
      if (key === konamiCode[0]) {
        currentKonamiIndex = 1;
      }
    }

    if (secretComboDisplay && secretComboDisplay.style.display === 'block') {
      const kombatKeys = ['a', 'b', 'c', 'd'];
      if (kombatKeys.includes(key.toLowerCase())) {
        secretComboDisplay.querySelector('.combo-text').textContent += key.toUpperCase();
      }
    }
  });

  function activateKonamiCode() {
    if (secretComboDisplay) {
      secretComboDisplay.style.display = 'block';
      secretComboDisplay.querySelector('.combo-text').textContent = 'KOMBAT CODE: ';
      setTimeout(() => {
        secretComboDisplay.style.display = 'none';
        secretComboDisplay.querySelector('.combo-text').textContent = '';
      }, 5000);
    }
    if (easterEggDisplay) {
      easterEggDisplay.style.display = 'block';
      setTimeout(() => {
        easterEggDisplay.style.display = 'none';
      }, 4000);
    }
    playBlipSound();
  }

  if (submitScoreBtn) {
    submitScoreBtn.addEventListener('click', function() {
      const init1 = document.getElementById('init1')?.value.toUpperCase() || '';
      const init2 = document.getElementById('init2')?.value.toUpperCase() || '';
      const init3 = document.getElementById('init3')?.value.toUpperCase() || '';
      const playerName = init1 + init2 + init3;

      if (playerName.length === 3) {
        const randomScore = Math.floor(Math.random() * 5000000) + 5000000;
        const newRow = document.createElement('tr');
        newRow.classList.add('high-score-row');
        newRow.innerHTML = `
          <td>NEW</td>
          <td>${playerName}</td>
          <td>${randomScore}</td>
          <td>ARCADE</td>
        `;
        if (leaderboardBody) {
          leaderboardBody.insertBefore(newRow, leaderboardBody.firstChild);
          if (leaderboardBody.children.length > 8) {
            leaderboardBody.removeChild(leaderboardBody.lastChild);
          }
        }
        initialInputs.forEach(input => input.value = '');
        playBlipSound();
      }
    });
  }

  initialInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
      if (this.value.length === 1 && index < initialInputs.length - 1) {
        initialInputs[index + 1].focus();
      }
    });
  });

  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      menuItems.forEach(mi => {
        mi.classList.remove('highlighted');
        mi.querySelector('.cursor').textContent = ' ';
      });
      this.classList.add('highlighted');
      this.querySelector('.cursor').textContent = '►';
      playBlipSound();
    });
  });

  console.log('RETRO ARCADE VAULT BOOTED // READY PLAYER ONE');
});