const cursorOrb = document.getElementById('cursor-orb');
const starCanvas = document.getElementById('starfield-canvas');
const starmapCanvas = document.getElementById('diaspora-starmap');
const hologramArtifact = document.getElementById('hologram-artifact');
const artifactMesh = document.querySelector('.artifact-mesh');
const playVoiceBtn = document.getElementById('play-voice');
const nextStoryBtn = document.getElementById('next-story');
const narrationLine = document.getElementById('narration-line');
const waveformBars = document.querySelectorAll('.waveform-bar');
const timelineTrack = document.getElementById('timeline-track');
const modalOverlay = document.getElementById('artifact-modal');
const modalClose = document.getElementById('modal-close');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.gallery-panel');
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.querySelector('.main-nav');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetRotateX = -15;
let targetRotateY = 25;
let currentRotateX = -15;
let currentRotateY = 25;
let isPlayingVoice = false;
let voiceInterval = null;
let starFieldParticles = [];
let starmapNodes = [];
let animationFrameId = null;

const griotStories = [
  "“Listen — the baobab remembers. Its roots drink from the river of time...”",
  "“The drum does not speak of itself; it echoes the heartbeat of the village.”",
  "“When the lion tells the story, the hunter becomes the shadow.”",
  "“Stars are the eyes of ancestors, blinking wisdom into the night.”"
];
let currentStoryIndex = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorOrb.style.left = `${mouseX}px`;
  cursorOrb.style.top = `${mouseY}px`;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  targetRotateY = 25 + ((mouseX - centerX) / centerX) * 18;
  targetRotateX = -15 - ((mouseY - centerY) / centerY) * 12;
});

document.querySelectorAll('a, button, .hologram-artifact, .timeline-era, .nav-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursorOrb.classList.add('hover-interactive'));
  el.addEventListener('mouseleave', () => cursorOrb.classList.remove('hover-interactive'));
});

function initStarfield() {
  const ctx = starCanvas.getContext('2d');
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;

  const particleCount = 180;
  starFieldParticles = [];

  for (let i = 0; i < particleCount; i++) {
    starFieldParticles.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      radius: Math.random() * 2.2 + 0.4,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.7 ? '212, 168, 67' : '180, 95, 58'
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    starFieldParticles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();
      p.y -= p.speed;
      if (p.y < -5) {
        p.y = starCanvas.height + 5;
        p.x = Math.random() * starCanvas.width;
      }
    });
    animationFrameId = requestAnimationFrame(drawStars);
  }
  drawStars();
}

function initStarmap() {
  const ctx = starmapCanvas.getContext('2d');
  starmapCanvas.width = starmapCanvas.parentElement.clientWidth;
  starmapCanvas.height = starmapCanvas.parentElement.clientHeight;

  const nodeCount = 38;
  starmapNodes = [];
  for (let i = 0; i < nodeCount; i++) {
    starmapNodes.push({
      x: Math.random() * starmapCanvas.width,
      y: Math.random() * starmapCanvas.height,
      baseX: 0,
      baseY: 0,
     size: Math.random() * 3 + 1.5,
      pulse: Math.random() * Math.PI * 2
    });
    starmapNodes[i].baseX = starmapNodes[i].x;
    starmapNodes[i].baseY = starmapNodes[i].y;
  }

  function drawStarmap() {
    ctx.clearRect(0, 0, starmapCanvas.width, starmapCanvas.height);
    
    ctx.strokeStyle = 'rgba(212, 168, 67, 0.25)';
    ctx.lineWidth = 0.6;
    for (let i = 0; i < starmapNodes.length; i++) {
      for (let j = i + 1; j < starmapNodes.length; j++) {
        const dx = starmapNodes[i].x - starmapNodes[j].x;
        const dy = starmapNodes[i].y - starmapNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(starmapNodes[i].x, starmapNodes[i].y);
          ctx.lineTo(starmapNodes[j].x, starmapNodes[j].y);
          ctx.stroke();
        }
      }
    }

    starmapNodes.forEach(node => {
      node.pulse += 0.02;
      const offsetX = Math.sin(node.pulse * 1.3) * 0.8;
      const offsetY = Math.cos(node.pulse * 0.9) * 0.8;
      node.x = node.baseX + offsetX;
      node.y = node.baseY + offsetY;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = '#f5c964';
      ctx.shadowColor = '#d4a843';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawStarmap);
  }
  drawStarmap();
}

function updateArtifactRotation() {
  currentRotateX += (targetRotateX - currentRotateX) * 0.08;
  currentRotateY += (targetRotateY - currentRotateY) * 0.08;
  if (artifactMesh) {
    artifactMesh.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
  }
  requestAnimationFrame(updateArtifactRotation);
}

document.getElementById('rot-left').addEventListener('click', () => {
  targetRotateY -= 35;
});

document.getElementById('rot-right').addEventListener('click', () => {
  targetRotateY += 35;
});

hologramArtifact.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }
});

function stopVoicePlayback() {
  if (voiceInterval) {
    clearInterval(voiceInterval);
    voiceInterval = null;
  }
  isPlayingVoice = false;
  playVoiceBtn.querySelector('.play-icon').textContent = '▶';
  waveformBars.forEach(bar => bar.style.animationPlayState = 'paused');
}

playVoiceBtn.addEventListener('click', () => {
  if (isPlayingVoice) {
    stopVoicePlayback();
    return;
  }
  
  isPlayingVoice = true;
  playVoiceBtn.querySelector('.play-icon').textContent = '⏸';
  waveformBars.forEach(bar => bar.style.animationPlayState = 'running');

  const story = griotStories[currentStoryIndex];
  let charIndex = 0;
  narrationLine.textContent = '';

  voiceInterval = setInterval(() => {
    if (charIndex < story.length) {
      narrationLine.textContent += story.charAt(charIndex);
      charIndex++;
    } else {
      stopVoicePlayback();
    }
  }, 55);
});

nextStoryBtn.addEventListener('click', () => {
  stopVoicePlayback();
  currentStoryIndex = (currentStoryIndex + 1) % griotStories.length;
  narrationLine.textContent = griotStories[currentStoryIndex];
});

window.addEventListener('resize', () => {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  if (starmapCanvas) {
    starmapCanvas.width = starmapCanvas.parentElement.clientWidth;
    starmapCanvas.height = starmapCanvas.parentElement.clientHeight;
    starmapNodes.forEach(node => {
      node.baseX = Math.random() * starmapCanvas.width;
      node.baseY = Math.random() * starmapCanvas.height;
    });
  }
});

const observerOptions = {
  threshold: 0.55,
  rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const activeSection = entry.target.getAttribute('data-panel');
      navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        if (linkSection === activeSection) {
          link.classList.add('nav-link--active');
        } else {
          link.classList.remove('nav-link--active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('nav-open');
  const navList = mainNav.querySelector('.nav-list');
  if (navList) {
    navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
  }
});

let isTimelineDragging = false;
let startX, scrollLeftPos;

timelineTrack.addEventListener('mousedown', (e) => {
  isTimelineDragging = true;
  startX = e.pageX - timelineTrack.offsetLeft;
  scrollLeftPos = timelineTrack.scrollLeft;
  timelineTrack.style.cursor = 'grabbing';
});

timelineTrack.addEventListener('mouseleave', () => {
  isTimelineDragging = false;
  timelineTrack.style.cursor = 'grab';
});

timelineTrack.addEventListener('mouseup', () => {
  isTimelineDragging = false;
  timelineTrack.style.cursor = 'grab';
});

timelineTrack.addEventListener('mousemove', (e) => {
  if (!isTimelineDragging) return;
  e.preventDefault();
  const x = e.pageX - timelineTrack.offsetLeft;
  const walk = (x - startX) * 1.8;
  timelineTrack.scrollLeft = scrollLeftPos - walk;
});

initStarfield();
initStarmap();
updateArtifactRotation();