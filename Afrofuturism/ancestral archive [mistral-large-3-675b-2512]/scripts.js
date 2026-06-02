document.addEventListener('DOMContentLoaded', () => {
  // ===== ADINKRA NAVIGATION =====
  const adinkraNav = document.getElementById('adinkra-nav');
  const navSymbols = adinkraNav.querySelectorAll('.nav-symbol');

  // Smooth scroll to sections
  navSymbols.forEach(symbol => {
    symbol.addEventListener('click', () => {
      const sectionId = symbol.dataset.section;
      const targetSection = document.getElementById(sectionId);
      targetSection.scrollIntoView({ behavior: 'smooth' });

      // Highlight active symbol
      navSymbols.forEach(s => s.classList.remove('active'));
      symbol.classList.add('active');
    });
  });

  // Highlight symbol on scroll
  window.addEventListener('scroll', () => {
    let currentSection = '';
    document.querySelectorAll('.gallery-section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        currentSection = section.getAttribute('id');
      }
    });

    navSymbols.forEach(symbol => {
      symbol.classList.remove('active');
      if (symbol.dataset.section === currentSection) {
        symbol.classList.add('active');
      }
    });
  });

  // ===== HOLOGRAPHIC ARTIFACT VIEWER =====
  const artifactViewer = document.querySelector('.artifact-3d');
  const controlBtns = document.querySelectorAll('.control-btn');
  let rotateX = 0;
  let rotateY = 0;
  let scale = 1;

  controlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      switch (action) {
        case 'rotate-x':
          rotateX += 45;
          break;
        case 'rotate-y':
          rotateY += 45;
          break;
        case 'zoom-in':
          scale += 0.2;
          break;
        case 'zoom-out':
          scale -= 0.2;
          break;
      }
      artifactViewer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    });
  });

  // ===== STAR MAP INTERACTIONS =====
  const constellations = document.querySelectorAll('.constellation');
  const constellationLines = document.querySelectorAll('.constellation-line');
  const mythText = document.querySelector('.myth-text');

  // Tooltip data
  const starData = {
    1: { name: "Sirius", story: "The Dog Star, guiding souls across the sky." },
    2: { name: "Orion", story: "The Hunter, whose belt points to our ancestral lands." },
    3: { name: "Pleiades", story: "The Seven Sisters, watching over harvests and migrations." }
  };

  // Show tooltip on hover
  constellations.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const starId = star.dataset.star;
      const tooltip = document.createElement('div');
      tooltip.className = 'star-tooltip';
      tooltip.innerHTML = `
        <h4>${starData[starId].name}</h4>
        <p>${starData[starId].story}</p>
      `;
      star.appendChild(tooltip);

      // Update myth text
      mythText.innerHTML = `<p>"${starData[starId].story}"</p>`;
    });

    star.addEventListener('mouseleave', () => {
      const tooltip = star.querySelector('.star-tooltip');
      if (tooltip) tooltip.remove();
    });
  });

  // Draw constellation lines dynamically
  function drawConstellationLines() {
    const stars = Array.from(constellations).map(star => {
      const rect = star.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    });

    constellationLines.forEach((line, i) => {
      if (stars[i] && stars[i + 1]) {
        const angle = Math.atan2(stars[i + 1].y - stars[i].y, stars[i + 1].x - stars[i].x);
        const length = Math.hypot(stars[i + 1].x - stars[i].x, stars[i + 1].y - stars[i].y);
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}rad)`;
        line.style.left = `${stars[i].x}px`;
        line.style.top = `${stars[i].y}px`;
      }
    });
  }

  drawConstellationLines();
  window.addEventListener('resize', drawConstellationLines);

  // ===== GRIOT NARRATION REVEAL =====
  const griotText = document.querySelector('.griot-text p');
  const griotSentences = [
    "In the beginning, there was no time... only the hum of stars whispering in tongues older than Earth.",
    "The first storytellers were the cosmos. They wove threads of light into our bloodlines.",
    "Every artifact here is a portal. Touch it, and the past will speak."
  ];
  let currentSentence = 0;

  // Typewriter effect on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        griotText.style.animation = 'none';
        griotText.offsetHeight; // Trigger reflow
        griotText.style.animation = 'typewriter 4s steps(40) 1s 1 normal both, blinkCursor 0.7s steps(1) infinite';
        griotText.setAttribute('data-text', griotSentences[currentSentence]);
        currentSentence = (currentSentence + 1) % griotSentences.length;
      }
    });
  }, { threshold: 0.5 });

  observer.observe(griotText);

  // ===== AUDIO PLAYER =====
  const audioPlayer = document.querySelector('.audio-player');
  const playBtn = audioPlayer.querySelector('.play-btn');
  const timeSlider = audioPlayer.querySelector('.slider');
  const timeDisplay = audioPlayer.querySelector('.time-display');
  const visualBars = audioPlayer.querySelectorAll('.visual-bar');

  // Mock audio context (simulated for demo)
  let isPlaying = false;
  let currentTime = 0;
  let duration = 225; // 3:45 in seconds

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';

    if (isPlaying) {
      // Simulate audio playing
      const interval = setInterval(() => {
        if (!isPlaying) clearInterval(interval);
        currentTime = Math.min(currentTime + 1, duration);
        timeSlider.value = (currentTime / duration) * 100;
        updateTimeDisplay();
        updateVisualizer();
      }, 1000);
    }
  });

  timeSlider.addEventListener('input', (e) => {
    currentTime = (e.target.value / 100) * duration;
    updateTimeDisplay();
  });

  function updateTimeDisplay() {
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${mins}:${secs} / 3:45`;
  }

  function updateVisualizer() {
    visualBars.forEach((bar, i) => {
      // Simulate audio frequency data
      const randomHeight = Math.floor(Math.random() * 40) + 10;
      bar.style.height = `${randomHeight}px`;
    });
  }

  // ===== ATMOSPHERIC EFFECTS =====
  // Nebula particle animation
  function createNebulaParticles() {
    const hero = document.getElementById('hero');
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'nebula-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      hero.appendChild(particle);
    }
  }

  createNebulaParticles();

  // Gold wireframe parallax
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.gold-wireframe');
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  });
});

// Add CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
  .star-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(26, 18, 43, 0.9);
    color: var(--gold-light);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 1px solid var(--gold);
    font-size: 0.9rem;
    white-space: nowrap;
    z-index: 10;
  }
  .nebula-particle {
    position: absolute;
    background: radial-gradient(circle, var(--gold-light) 0%, transparent 70%);
    border-radius: 50%;
    animation: floatParticle 20s infinite linear;
  }
  @keyframes floatParticle {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
  }
`;
document.head.appendChild(style);