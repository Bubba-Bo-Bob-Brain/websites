document.addEventListener('DOMContentLoaded', () => {
  initCursorTrail();
  initStarRating();
  initMusicPlayer();
  initGuestbook();
  initHitCounter();
  initAddFriendButton();
  initSecretSparkle();
  initBlinkieInteractions();
  initPageLoadAnimations();
});

function initCursorTrail() {
  const cursorTrail = document.querySelector('.cursor-trail');
  document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    const glitterColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF69B4', '#00FF00', '#FFFFFF'];
    sparkle.style.backgroundColor = glitterColors[Math.floor(Math.random() * glitterColors.length)];
    sparkle.style.left = `${e.clientX - 6}px`;
    sparkle.style.top = `${e.clientY - 6}px`;
    cursorTrail.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  });
}

function initStarRating() {
  const stars = document.querySelectorAll('.star');
  const ratingText = document.querySelector('.rating-text');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const selectedRating = parseInt(star.dataset.rating);
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.rating) <= selectedRating);
      });
      const ratingMessages = [
        '😢 Oh no... I\'ll update my layout to be cooler!!',
        '😐 Thanks for the rating, I guess...',
        '🙂 Cool, thanks for stopping by!',
        '😆 YAY!! You\'re so sweet!!',
        '🤩 OMG 5 STARS!! I LOVE YOU FOREVER!!'
      ];
      ratingText.textContent = ratingMessages[selectedRating - 1];
    });
  });
}

function initMusicPlayer() {
  const playBtn = document.querySelector('.play-btn');
  const pauseBtn = document.querySelector('.pause-btn');
  const trackStatus = document.querySelector('.track-status');
  const playlistItems = document.querySelectorAll('.playlist li');
  let isPlaying = false;
  let activeTrack = playlistItems[0];

  playBtn.addEventListener('click', () => {
    isPlaying = true;
    const trackName = activeTrack.textContent.replace(/^\d+\.\s/, '');
    trackStatus.textContent = `PLAYING: ${trackName}`;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    document.querySelector('.music-player').classList.add('playing');
  });

  pauseBtn.addEventListener('click', () => {
    isPlaying = false;
    trackStatus.textContent = 'PAUSED :(';
    pauseBtn.disabled = true;
    playBtn.disabled = false;
    document.querySelector('.music-player').classList.remove('playing');
  });

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      playlistItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeTrack = item;
      if (isPlaying) {
        const trackName = item.textContent.replace(/^\d+\.\s/, '');
        trackStatus.textContent = `PLAYING: ${trackName}`;
      }
    });
  });
}

function initGuestbook() {
  const form = document.querySelector('.guestbook-form');
  const entriesContainer = document.querySelector('.guestbook-entries');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('guest-name');
    const commentInput = document.getElementById('guest-comment');
    const guestName = nameInput.value.trim();
    const guestComment = commentInput.value.trim();

    if (!guestName || !guestComment) {
      alert('PLEASE FILL IN BOTH YOUR NAME AND COMMENT!! >:(');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US');
    const randomAscii = ['♥♥♥', '(◕‿◕✿)', '\m/ >.< \m/', '(✿◠‿◠)', '☆*:.｡.o(≧▽≦)o.｡.:*☆', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'][Math.floor(Math.random() * 6)];

    const newEntry = document.createElement('div');
    newEntry.classList.add('guest-entry');
    newEntry.innerHTML = `
      <p class="entry-name">${escapeHtml(guestName)}</p>
      <p class="entry-date">${currentDate}</p>
      <p class="entry-comment">${escapeHtml(guestComment)}</p>
      <p class="entry-ascii">${randomAscii}</p>
    `;

    entriesContainer.prepend(newEntry);
    nameInput.value = '';
    commentInput.value = '';

    newEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const successMessage = document.createElement('p');
    successMessage.textContent = '💌 THANKS FOR SIGNING MY GUESTBOOK!! 💌';
    successMessage.style.cssText = 'text-align: center; font-weight: bold; color: #FF00FF; margin-top: 1rem; font-size: 1.2rem; animation: fadeOut 3s forwards;';
    form.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initHitCounter() {
  const digitElements = document.querySelectorAll('.digit');
  const targetNumber = 14823;
  const paddedTarget = targetNumber.toString().padStart(6, '0');
  let currentCount = 0;
  const countStep = Math.ceil(targetNumber / 120);

  const counterInterval = setInterval(() => {
    currentCount += countStep;
    if (currentCount >= targetNumber) {
      currentCount = targetNumber;
      clearInterval(counterInterval);
    }
    const paddedCount = currentCount.toString().padStart(6, '0');
    digitElements.forEach((digit, index) => {
      digit.textContent = paddedCount[index];
    });
  }, 25);
}

function initAddFriendButton() {
  const addBtn = document.querySelector('.add-friend-btn');
  addBtn.addEventListener('click', () => {
    addBtn.textContent = '💖 ADDED!! YOU\'RE ON MY TOP 8 NOW 💖';
    addBtn.style.background = '#00FF00';
    addBtn.style.color = '#000000';
    addBtn.disabled = true;
    addBtn.style.cursor = 'not-allowed';
    spawnConfetti(addBtn);
  });
}

function spawnConfetti(sourceElement) {
  const rect = sourceElement.getBoundingClientRect();
  const confettiColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF69B4', '#00FF00'];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const size = 8 + Math.random() * 8;
    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 12;
    let posX = 0;
    let posY = 0;
    let opacity = 1;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed - 6;

    const animateConfetti = () => {
      posX += velocityX;
      posY += velocityY + 0.4;
      opacity -= 0.015;
      confetti.style.transform = `translate(${posX}px, ${posY}px)`;
      confetti.style.opacity = opacity;
      if (opacity > 0) {
        requestAnimationFrame(animateConfetti);
      } else {
        confetti.remove();
      }
    };
    requestAnimationFrame(animateConfetti);
  }
}

function initSecretSparkle() {
  const secretSparkle = document.querySelector('.secret-sparkle');
  secretSparkle.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #FFFF00;
      border: 4px solid #000;
      padding: 2rem;
      z-index: 10000;
      text-align: center;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      box-shadow: 8px 8px 0px #FF00FF;
      max-width: 90%;
      line-height: 1.6;
    `;
    modal.innerHTML = `
      <p style="font-size: 2.5rem; margin-bottom: 1rem;">🐾</p>
      <p style="margin-bottom: 1rem; color: #FF00FF;">🤫 TOP SECRET:</p>
      <p style="margin-bottom: 1.5rem;">I still have my original 1997 Tamagotchi that I take to school every day! I feed it during lunch and everything, don't tell anyone ;)</p>
      <button id="close-secret-modal" style="
        padding: 0.7rem 1.2rem;
        background: #FF00FF;
        color: #FFFF00;
        border: 3px solid #000;
        font-family: 'Press Start 2P', cursive;
        cursor: pointer;
        font-size: 0.7rem;
      ">OK I WON'T TELL!!</button>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-secret-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  });
}

function initBlinkieInteractions() {
  const blinkies = document.querySelectorAll('.blinkie');
  blinkies.forEach(blinkie => {
    blinkie.addEventListener('click', () => {
      blinkie.style.transition = 'transform 0.5s ease';
      blinkie.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => {
        blinkie.style.transform = 'rotate(0deg) scale(1)';
        setTimeout(() => blinkie.style.transition = '', 500);
      }, 500);
    });
  });
}

function initPageLoadAnimations() {
  const loadSections = document.querySelectorAll(
    '.construction-banner, .add-friend-btn, .profile-header, .rate-profile, .music-player, .top-friends, .blinkies, .guestbook, .hit-counter'
  );
  loadSections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
}