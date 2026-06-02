// Boot Sequence
const bootScreen = document.createElement('div');
bootScreen.id = 'boot-screen';
bootScreen.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#03050a;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--font-mono);color:var(--neon-cyan);';
const bootText = document.createElement('div');
bootText.style.cssText = 'font-size:1.2rem;letter-spacing:0.1em;text-align:center;line-height:2;';
bootScreen.appendChild(bootText);
document.body.appendChild(bootScreen);

const bootMessages = [
  'INITIALIZING SECURE CONNECTION...',
  'ROUTING THROUGH 7 PROXY NODES...',
  'BYPASSING ICE COUNTERMEASURES...',
  'DECRYPTING NETWORK FEED...',
  'CONNECTION ESTABLISHED // WELCOME, GHOST_0x7F'
];

let bootIndex = 0;
function runBootSequence() {
  if (bootIndex < bootMessages.length) {
    bootText.textContent = bootMessages[bootIndex];
    bootIndex++;
    setTimeout(runBootSequence, 800);
  } else {
    setTimeout(() => {
      bootScreen.style.transition = 'opacity 0.5s ease';
      bootScreen.style.opacity = '0';
      setTimeout(() => bootScreen.remove(), 500);
    }, 1000);
  }
}
runBootSequence();

// Matrix Rain Background
const matrixCanvas = document.getElementById('matrixCanvas');
const ctx = matrixCanvas.getContext('2d');
let matrixDrops = [];
const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,.<>?';
const fontSize = 14;

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const columns = Math.floor(matrixCanvas.width / fontSize);
  matrixDrops = Array(columns).fill(0).map(() => ({
    x: Math.random() * matrixCanvas.width,
    y: Math.random() * matrixCanvas.height,
    speed: Math.random() * 2 + 1,
    value: ''
  }));
}
window.addEventListener('resize', resizeMatrix);
resizeMatrix();

function drawMatrix() {
  ctx.fillStyle = 'rgba(3, 5, 10, 0.05)';
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  ctx.fillStyle = '#00f0ff';
  ctx.font = `${fontSize}px 'JetBrains Mono'`;

  matrixDrops.forEach(drop => {
    drop.value = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillText(drop.value, drop.x, drop.y);
    drop.y += drop.speed;
    if (drop.y > matrixCanvas.height && Math.random() > 0.975) {
      drop.y = 0;
      drop.x = Math.random() * matrixCanvas.width;
    }
  });
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

// Encrypted Block Decrypt Effect
const encryptedBlocks = document.querySelectorAll('.encrypted-block');
encryptedBlocks.forEach(block => {
  const encryptedText = block.querySelector('.encrypted-text');
  const originalEncrypted = encryptedText.textContent;
  block.dataset.originalEncrypted = originalEncrypted;

  block.addEventListener('mouseenter', () => {
    let glitchCount = 0;
    const glitchInterval = setInterval(() => {
      encryptedText.textContent = originalEncrypted.split('').map(() => matrixChars[Math.floor(Math.random() * matrixChars.length)]).join('');
      glitchCount++;
      if (glitchCount > 10) {
        clearInterval(glitchInterval);
        encryptedText.textContent = originalEncrypted;
        block.classList.add('decrypted');
      }
    }, 30);
    block.dataset.glitchInterval = glitchInterval;
  });

  block.addEventListener('mouseleave', () => {
    clearInterval(block.dataset.glitchInterval);
    block.classList.remove('decrypted');
    encryptedText.textContent = block.dataset.originalEncrypted;
  });
});

// Glitch Avatar Effects
const glitchAvatars = document.querySelectorAll('.glitch-avatar, .avatar-glitch');
glitchAvatars.forEach(avatar => {
  avatar.addEventListener('mouseenter', () => {
    avatar.style.animation = 'none';
    avatar.offsetHeight;
    avatar.style.animation = 'glitch-avatar 0.1s steps(2) infinite';
  });

  avatar.addEventListener('mouseleave', () => {
    avatar.style.animation = '';
  });

  setInterval(() => {
    if (Math.random() > 0.7) {
      avatar.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
      setTimeout(() => avatar.style.transform = '', 100);
    }
  }, 2000 + Math.random() * 3000);
});

// Trace Warning
const traceWarning = document.getElementById('traceWarning');
const appContainer = document.querySelector('.app-container');

function injectShakeKeyframes() {
  if (!document.getElementById('shake-keyframes')) {
    const style = document.createElement('style');
    style.id = 'shake-keyframes';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
      .shake { animation: shake 0.5s ease; }
    `;
    document.head.appendChild(style);
  }
}

function showTrace() {
  injectShakeKeyframes();
  traceWarning.classList.add('active');
  appContainer.classList.add('shake');
  setTimeout(() => appContainer.classList.remove('shake'), 500);
  setTimeout(() => {
    if (traceWarning.classList.contains('active')) dismissTrace();
  }, 5000);
}

function dismissTrace() {
  traceWarning.classList.remove('active');
}

// Copy Code Functionality
function copyCode(button) {
  const codeBlock = button.closest('.code-block');
  const code = codeBlock.querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.textContent;
    button.textContent = '[ COPIED! ]';
    button.style.borderColor = 'var(--neon-green)';
    button.style.color = 'var(--neon-green)';
    button.style.boxShadow = '0 0 10px rgba(0, 255, 157, 0.3)';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.borderColor = '';
      button.style.color = '';
      button.style.boxShadow = '';
    }, 2000);
  });
}

// Feed Tabs & Filters
const feedTabs = document.querySelectorAll('.feed-tab');
const filterBtns = document.querySelectorAll('.filter-btn');
const posts = document.querySelectorAll('.post');

function filterPosts() {
  const activeFeed = document.querySelector('.feed-tab.active').textContent;
  const activeFilter = document.querySelector('.filter-btn.active').textContent;

  posts.forEach(post => {
    const title = post.querySelector('.post-title').textContent;
    const badgeClass = post.querySelector('.author-badge').className;
    let showPost = true;

    if (activeFeed !== 'ALL_FEEDS') {
      const feedMap = {
        'JOBS': '[JOB]',
        'INTEL': '[INTEL]',
        'MARKET': '[MARKET]',
        'DISCUSSIONS': '[DISCUSSION]'
      };
      showPost = title.includes(feedMap[activeFeed]);
    }

    if (activeFilter !== 'ALL') {
      const filterMap = {
        'HACKERS': 'hacker',
        'RUNNERS': 'elite',
        'FIXERS': 'fixer',
        'CORP_LEAKS': '[INTEL]'
      };
      if (activeFilter === 'CORP_LEAKS') {
        showPost = showPost && title.includes(filterMap[activeFilter]);
      } else {
        showPost = showPost && badgeClass.includes(filterMap[activeFilter]);
      }
    }

    if (showPost) {
      post.style.display = '';
      post.style.animation = 'fade-in-up 0.3s ease backwards';
    } else {
      post.style.display = 'none';
    }
  });
}

feedTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    feedTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterPosts();
  });
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterPosts();
  });
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

searchInput.addEventListener('input', debounce(() => {
  const query = searchInput.value.toLowerCase();
  posts.forEach(post => {
    const title = post.querySelector('.post-title').textContent.toLowerCase();
    const body = post.querySelector('.post-body').textContent.toLowerCase();
    const author = post.querySelector('.author-name').textContent.toLowerCase();
    const match = title.includes(query) || body.includes(query) || author.includes(query);
    post.style.display = match ? '' : 'none';
    if (match) post.style.animation = 'fade-in-up 0.3s ease backwards';
  });
}, 300));

// Reputation Bar Animation
window.addEventListener('load', () => {
  const repBar = document.querySelector('.rep-bar');
  const originalWidth = repBar.style.width;
  repBar.style.width = '0%';
  setTimeout(() => {
    repBar.style.transition = 'width 1.5s ease-out';
    repBar.style.width = originalWidth;
  }, 500);
});

// Node Status Pulse Effect
const onlineNodes = document.querySelectorAll('.node-status.online');
setInterval(() => {
  onlineNodes.forEach(node => {
    if (Math.random() > 0.5) {
      node.style.opacity = '0.5';
      setTimeout(() => node.style.opacity = '1', 200);
    }
  });
}, 1500);

// Encrypted Channel Click Effect
const channels = document.querySelectorAll('.channel-item');
channels.forEach(channel => {
  channel.addEventListener('click', () => {
    const accessDenied = document.createElement('div');
    accessDenied.textContent = 'ACCESS DENIED: INSUFFICIENT CLEARANCE';
    accessDenied.style.cssText = `
      position: fixed;
      top: ${channel.getBoundingClientRect().top}px;
      left: ${channel.getBoundingClientRect().left}px;
      background: rgba(255, 0, 64, 0.95);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      z-index: 1000;
      animation: fade-in-up 0.3s ease;
      box-shadow: 0 0 15px rgba(255, 0, 64, 0.5);
    `;
    document.body.appendChild(accessDenied);
    setTimeout(() => {
      accessDenied.style.opacity = '0';
      accessDenied.style.transition = 'opacity 0.3s ease';
      setTimeout(() => accessDenied.remove(), 300);
    }, 1500);
  });
});

// New Post Button Effect
const newPostBtn = document.querySelector('.new-post-btn');
newPostBtn.addEventListener('click', () => {
  newPostBtn.style.animation = 'glitch-avatar 0.2s steps(2) 3';
  setTimeout(() => newPostBtn.style.animation = '', 600);
  
  const queuedMsg = document.createElement('div');
  queuedMsg.textContent = 'TRANSMISSION QUEUED // AWAITING ENCRYPTION';
  queuedMsg.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 240, 255, 0.95);
    color: #03050a;
    padding: 12px 24px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 1000;
    animation: fade-in-up 0.3s ease;
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
  `;
  document.body.appendChild(queuedMsg);
  setTimeout(() => {
    queuedMsg.style.opacity = '0';
    queuedMsg.style.transition = 'opacity 0.3s ease';
    setTimeout(() => queuedMsg.remove(), 300);
  }, 2000);
});

// Action Button Feedback
const actionBtns = document.querySelectorAll('.action-btn');
actionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const originalText = btn.textContent;
    let newText = '';
    let duration = 1500;

    if (originalText.includes('ACCEPT')) newText = '[ ACCEPTED ]';
    else if (originalText.includes('DECRYPT')) {
      newText = '[ DECRYPTING... ]';
      duration = 1000;
      setTimeout(() => btn.textContent = '[ DECRYPTED ]', 1000);
    }
    else if (originalText.includes('INFO')) newText = '[ INFO SENT ]';
    else if (originalText.includes('SHARE')) newText = '[ SHARED ]';
    else if (originalText.includes('BID')) newText = '[ BID PLACED ]';
    else if (originalText.includes('OFFER')) newText = '[ OFFER SENT ]';
    else if (originalText.includes('CONTACT')) newText = '[ CONTACT REQUESTED ]';
    else if (originalText.includes('REPLY')) newText = '[ REPLY QUEUED ]';
    else if (originalText.includes('VOTE')) newText = '[ VOTE CAST ]';
    else if (originalText.includes('DISCUSS')) newText = '[ JOINED DISCUSSION ]';
    else if (originalText.includes('REPORT')) newText = '[ REPORT SUBMITTED ]';

    if (newText && !originalText.includes('DECRYPT')) {
      btn.textContent = newText;
      btn.style.borderColor = 'var(--neon-green)';
      btn.style.color = 'var(--neon-green)';
      btn.style.boxShadow = '0 0 10px rgba(0, 255, 157, 0.3)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
      }, duration);
    }
  });
});

// Trending Topics Click
const topicTags = document.querySelectorAll('.topic-tag');
topicTags.forEach(tag => {
  tag.addEventListener('click', () => {
    searchInput.value = tag.textContent.replace('#', '');
    searchInput.dispatchEvent(new Event('input'));
  });
});

// Poll Option Selection
const pollOptions = document.querySelectorAll('.poll-option');
pollOptions.forEach(option => {
  option.addEventListener('click', () => {
    const radio = option.querySelector('input[type="radio"]');
    radio.checked = true;
    option.style.background = 'rgba(0, 240, 255, 0.1)';
    setTimeout(() => option.style.background = '', 300);
  });
});