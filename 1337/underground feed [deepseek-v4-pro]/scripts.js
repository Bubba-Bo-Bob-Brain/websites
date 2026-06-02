function updateClock() {
  const now = new Date();
  const utcString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const timeElement = document.getElementById('live-time');
  if (timeElement) {
    timeElement.textContent = utcString;
  }
}
updateClock();
setInterval(updateClock, 1000);

const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const tabName = this.dataset.tab;
    console.log('Switched to tab:', tabName);
  });
});

function showTraceWarning() {
  const warning = document.getElementById('trace-warning');
  if (!warning) return;
  warning.classList.remove('hidden');
  setTimeout(() => {
    warning.classList.add('hidden');
  }, 4000);
}

setTimeout(() => {
  showTraceWarning();
}, 7000);

setInterval(() => {
  const randomDelay = Math.floor(Math.random() * 20000) + 15000;
  setTimeout(() => {
    showTraceWarning();
  }, randomDelay);
}, 25000);

const encryptedPreviews = document.querySelectorAll('.encrypted-preview');
encryptedPreviews.forEach(preview => {
  preview.addEventListener('mouseenter', function() {
    const decrypted = this.querySelector('.decrypted-message');
    if (decrypted) {
      decrypted.style.animation = 'none';
      decrypted.offsetHeight;
      decrypted.style.animation = 'fadeInText 0.3s ease forwards';
    }
  });
});

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInText {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const originalText = this.textContent;
    if (this.classList.contains('encrypt-btn')) {
      this.textContent = '🔐 SAVED';
      this.style.color = '#39ff14';
      setTimeout(() => {
        this.textContent = originalText;
        this.style.color = '';
      }, 1200);
    } else {
      const parts = originalText.split(' ');
      if (parts.length === 2) {
        const count = parseInt(parts[1]) + 1;
        this.textContent = parts[0] + ' ' + count;
        this.style.color = '#00f7ff';
        setTimeout(() => {
          this.style.color = '';
        }, 300);
      }
    }
  });
});

const repHologram = document.querySelector('.reputation-hologram');
if (repHologram) {
  repHologram.addEventListener('click', function() {
    const repSpan = this.querySelector('.rep-score');
    if (repSpan) {
      const currentRep = parseFloat(repSpan.textContent.replace('REP: ', ''));
      if (currentRep < 9.9) {
        const newRep = (currentRep + 0.1).toFixed(1);
        repSpan.textContent = 'REP: ' + newRep;
        repSpan.style.color = '#ff00c8';
        setTimeout(() => {
          repSpan.style.color = '';
        }, 500);
      }
    }
  });
}

const avatarGlitch = document.querySelector('.avatar-placeholder');
if (avatarGlitch) {
  avatarGlitch.addEventListener('mouseenter', function() {
    this.style.animation = 'glitch-skew 0.15s infinite linear alternate-reverse';
  });
  avatarGlitch.addEventListener('mouseleave', function() {
    this.style.animation = '';
  });
}

document.querySelectorAll('.post-card').forEach(card => {
  card.addEventListener('click', function(e) {
    if (e.target.closest('button') || e.target.closest('.encrypted-preview')) return;
    this.style.borderColor = '#ff00c8';
    setTimeout(() => {
      this.style.borderColor = '';
    }, 400);
  });
});