document.addEventListener('DOMContentLoaded', function() {
  // ===== CURSOR TRAIL =====
  const cursorTrail = document.getElementById('cursor-trail');
  const trailColors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff9900', '#ff0066'];
  let trailTimeout;

  document.addEventListener('mousemove', function(e) {
    clearTimeout(trailTimeout);
    
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    
    const color = trailColors[Math.floor(Math.random() * trailColors.length)];
    dot.style.background = `radial-gradient(circle, ${color}, transparent)`;
    dot.style.boxShadow = `0 0 10px ${color}`;
    
    dot.style.left = (e.clientX - 4) + 'px';
    dot.style.top = (e.clientY - 4) + 'px';
    
    cursorTrail.appendChild(dot);
    
    trailTimeout = setTimeout(() => {
      dot.remove();
    }, 1000);
  });

  // ===== HIT COUNTER =====
  const hitCounterElement = document.getElementById('hit-counter');
  const STORAGE_KEY = 'y2k_profile_hit_counter';
  
  let hitCount = localStorage.getItem(STORAGE_KEY);
  if (!hitCount) {
    hitCount = 0;
  }
  hitCount = parseInt(hitCount) + 1;
  localStorage.setItem(STORAGE_KEY, hitCount);
  
  // Format with leading zeros
  const formattedCount = hitCount.toString().padStart(6, '0');
  hitCounterElement.textContent = formattedCount;

  // ===== GUESTBOOK =====
  const guestbookForm = document.getElementById('guestbook-form');
  const commentsList = document.getElementById('comments-list');
  const GUESTBOOK_KEY = 'y2k_profile_guestbook';
  
  // Load comments from localStorage
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || [];
    commentsList.innerHTML = '';
    
    // Sort by newest first
    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    comments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment';
      commentEl.innerHTML = `
        <div class="comment-author">${escapeHtml(comment.author)}</div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
        <div class="comment-time">${formatDate(comment.timestamp)}</div>
      `;
      commentsList.appendChild(commentEl);
    });
  }
  
  // Add new comment
  guestbookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const authorInput = document.getElementById('guest-name');
    const commentInput = document.getElementById('guest-comment');
    
    if (!authorInput.value.trim() || !commentInput.value.trim()) {
      return;
    }
    
    const newComment = {
      author: authorInput.value.trim(),
      text: commentInput.value.trim(),
      timestamp: new Date().toISOString()
    };
    
    const comments = JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || [];
    comments.push(newComment);
    localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(comments));
    
    // Reset form
    authorInput.value = '';
    commentInput.value = '';
    
    // Reload comments with animation
    loadComments();
    
    // Flash effect on form
    guestbookForm.classList.add('success');
    setTimeout(() => {
      guestbookForm.classList.remove('success');
    }, 500);
  });
  
  loadComments();

  // ===== QUIZ =====
  const quizForm = document.getElementById('quiz-form');
  const quizResult = document.getElementById('quiz-result');
  
  const quizAnswers = {
    pink: {
      title: "Hot Pink Queen!",
      message: "You're a bold, fearless Y2K diva! You love glitter, platform shoes, and making a statement. Your aesthetic is pure 2001 pop princess!"
    },
    green: {
      title: "Lime Green Rebel!",
      message: "You're an edgy, alternative Y2K kid! You probably have a lip ring and love cargo pants. Your vibe is totally anti-mainstream and cool."
    },
    blue: {
      title: "Cyan Dreamer!",
      message: "You're a futuristic Y2K dreamer! You love chrome, holographic everything, and believe the future is now. You probably still use MSN Messenger."
    },
    yellow: {
      title: "Sunshine Optimist!",
      message: "You're a bright, cheerful Y2K enthusiast! You love smiley faces, fuzzy accessories, and spreading good vibes. Your spirit color is definitely smiley yellow!"
    }
  };
  
  quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedColor = document.querySelector('input[name="color"]:checked');
    
    if (!selectedColor) {
      quizResult.innerHTML = '<span style="color: red;">⚠️ Pick a color first!</span>';
      quizResult.style.borderColor = 'red';
      return;
    }
    
    const color = selectedColor.value;
    const result = quizAnswers[color];
    
    quizResult.innerHTML = `
      <div style="font-size: 20px; margin-bottom: 10px;">${result.title}</div>
      <div>${result.message}</div>
    `;
    quizResult.style.borderColor = 'var(--neon-pink)';
    
    // Add confetti effect (simple version)
    createConfetti();
  });
  
  function createConfetti() {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff9900'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      
      document.body.appendChild(confetti);
      
      const animation = confetti.animate([
        { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 3000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => confetti.remove();
    }
  }

  // ===== FRIEND SLOT RANDOM ROTATION =====
  const friendSlots = document.querySelectorAll('.friend-slot');
  friendSlots.forEach((slot, index) => {
    // Random initial rotation between -5 and 5 degrees
    const rotation = (Math.random() * 10 - 5).toFixed(1);
    slot.style.transform = `rotate(${rotation}deg)`;
    
    // On hover, temporarily remove rotation
    slot.addEventListener('mouseenter', function() {
      this.style.transform = 'rotate(0deg) scale(1.15)';
    });
    
    slot.addEventListener('mouseleave', function() {
      this.style.transform = `rotate(${rotation}deg) scale(1)`;
    });
  });

  // ===== RANDOM BLINKY MESSAGES =====
  const blinkiesContainer = document.querySelector('.blinkies');
  const blinkyMessages = [
    { text: "★ NEW! ★", color: "#ff00ff" },
    { text: "● HOT! ●", color: "#00ff00" },
    { text: "► COOL! ◄", color: "#00ffff" },
    { text: "♡ LOVE ♡", color: "#ffff00" },
    { text: "★ FRESH! ★", color: "#ff9900" },
    { text: "● FRESH! ●", color: "#ff0066" },
    { text: "★ UPDATED! ★", color: "#9900ff" },
    { text: "♠ SPICY! ♠", color: "#00ff99" }
  ];
  
  // Shuffle and pick 4 random blinkies
  function randomizeBlinkies() {
    const shuffled = [...blinkyMessages].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    
    blinkiesContainer.innerHTML = '';
    selected.forEach(blinky => {
      const el = document.createElement('div');
      el.className = 'blinky';
      el.textContent = blinky.text;
      el.style.color = blinky.color;
      el.style.animationDelay = (Math.random() * 0.8) + 's';
      blinkiesContainer.appendChild(el);
    });
  }
  
  randomizeBlinkies();
  // Change blinkies every 30 seconds
  setInterval(randomizeBlinkies, 30000);

  // ===== MUSIC PLAYER VISUALIZER ENHANCEMENT =====
  const audio = document.getElementById('bg-music');
  const bars = document.querySelectorAll('.bar');
  
  // Make visualizer react to actual audio if possible (simplified)
  let audioContext, analyser, dataArray, source;
  
  function setupAudioAnalyser() {
    if (!audioContext && audio) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 32;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
  }
  
  // Try to set up audio analyser on user interaction (required by browsers)
  document.addEventListener('click', function once() {
    setupAudioAnalyser();
    document.removeEventListener('click', once);
  }, { once: true });
  
  function animateVisualizer() {
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      bars.forEach((bar, index) => {
        const barHeight = Math.max(10, (average / 255) * 60 * (0.5 + Math.random() * 0.5));
        bar.style.height = barHeight + 'px';
      });
    } else {
      // Fallback to CSS animation
      bars.forEach(bar => {
        bar.style.height = '';
      });
    }
    requestAnimationFrame(animateVisualizer);
  }
  
  // Start visualizer loop
  animateVisualizer();

  // ===== POLAROID ROTATION ON LOAD =====
  const polaroid = document.querySelector('.polaroid');
  if (polaroid) {
    // Random rotation between -5 and 5 degrees on load
    const randomRotation = (Math.random() * 10 - 5).toFixed(1);
    polaroid.style.transform = `rotate(${randomRotation}deg)`;
    
    // Smoothly rotate to -3deg (defined in CSS) after 1 second
    setTimeout(() => {
      polaroid.style.transition = 'transform 1s ease-out';
      polaroid.style.transform = 'rotate(-3deg)';
    }, 1000);
  }

  // ===== AUTO-SCROLL GUESTBOOK TO BOTTOM ON NEW COMMENT =====
  const observer = new MutationObserver(function(mutations) {
    if (mutations[0].addedNodes.length > 0) {
      commentsList.scrollTop = commentsList.scrollHeight;
    }
  });
  
  observer.observe(commentsList, { childList: true });

  // ===== EASTER EGG: KONAMI CODE =====
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', function(e) {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
  
  function activateEasterEgg() {
    // Change background to rainbow animation
    document.body.style.animation = 'rainbow-bg 2s infinite';
    
    // Add rainbow style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow-bg {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Show message
    const message = document.createElement('div');
    message.innerHTML = '🌈🌈🌈 YOU FOUND THE SECRET! Y2K FOREVER! 🌈🌈🌈';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Press Start 2P', monospace;
      font-size: 24px;
      color: #ff00ff;
      text-shadow: 2px 2px 0 #00ffff, -2px -2px 0 #ffff00;
      z-index: 100000;
      background: rgba(0,0,0,0.9);
      padding: 30px;
      border: 5px solid #00ffff;
      border-radius: 20px;
      text-align: center;
    `;
    document.body.appendChild(message);
    
    // Remove after 5 seconds
    setTimeout(() => {
      message.remove();
      document.body.style.animation = '';
    }, 5000);
  }

  // ===== TIME-BASED GREETING =====
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";
  
  const glitterText = document.querySelector('.glitter-text');
  if (glitterText) {
    const originalText = glitterText.textContent;
    glitterText.textContent = `${greeting}! ${originalText}`;
  }

  console.log('%c Y2K PROFILE LOADED! ', 'background: #ff00ff; color: #000; font-size: 20px; font-weight: bold;');
  console.log('%c Try the Konami code for a surprise! ', 'color: #00ffff;');
});