document.addEventListener('DOMContentLoaded', () => {
  // === DOM ELEMENTS ===
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const artifactCards = document.querySelectorAll('.artifact-card');
  const artifactViewer = document.getElementById('artifactViewer');
  const viewerClose = document.getElementById('viewerClose');
  const viewerArtifactName = document.getElementById('viewerArtifactName');
  const viewerArtifactMeta = document.getElementById('viewerArtifactMeta');
  const viewerArtifactDesc = document.getElementById('viewerArtifactDesc');
  const artifactModel = document.getElementById('artifactModel');
  const rotateButtons = document.querySelectorAll('.rotate-btn');
  const playBtn = document.getElementById('playBtn');
  const progressFill = document.getElementById('progressFill');
  const narrationLines = document.querySelectorAll('.narration-line');
  const constellationLines = document.querySelectorAll('.constellation-line');
  const starNodes = document.querySelectorAll('.star-node');
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const cosmicSection = document.getElementById('cosmic');

  // === STATE VARIABLES ===
  let isPlaying = false;
  let playbackInterval;
  let currentProgress = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let currentRotateZ = 0;
  const playbackSpeed = 0.5; // Progress increment per interval (simulated)

  // === NAVIGATION FUNCTIONALITY ===
  const initNavigation = () => {
    // Smooth scroll for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          // Close modal if open
          artifactViewer.classList.remove('active');
          artifactViewer.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // Active link highlight on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
  };

  // === ARTIFACT VIEWER FUNCTIONALITY ===
  const artifactShapeMap = {
    'benin-bronze': 'mask-shape',
    'dogon-figure': 'figure-shape',
    'kente-textile': 'textile-roll',
    'egyptian-scarab': 'scarab-shape',
    'great-zimbabwe': 'bird-shape',
    'nkisi-nkondi': 'nkisi-shape',
    'mali-manuscript': 'manuscript-shape',
    'ethiopian-cross': 'cross-shape'
  };

  const initArtifactViewer = () => {
    // Open modal on card click
    artifactCards.forEach(card => {
      card.addEventListener('click', () => {
        const artifactData = card.dataset;
        const origin = card.querySelector('.artifact-origin').textContent;
        const name = card.querySelector('.artifact-name').textContent;
        const desc = card.querySelector('.artifact-desc').textContent;

        // Populate modal
        viewerArtifactName.textContent = name;
        viewerArtifactMeta.textContent = origin;
        viewerArtifactDesc.textContent = desc;

        // Set 3D model shape
        const shapeClass = artifactShapeMap[artifactData.artifact] || 'mask-shape';
        artifactModel.className = `artifact-3d-model ${shapeClass}`;
        // Reset rotation
        currentRotateX = 0;
        currentRotateY = 0;
        currentRotateZ = 0;
        artifactModel.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';

        // Show modal
        artifactViewer.classList.add('active');
        artifactViewer.setAttribute('aria-hidden', 'false');
      });

      // Keyboard accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Close modal
    const closeModal = () => {
      artifactViewer.classList.remove('active');
      artifactViewer.setAttribute('aria-hidden', 'true');
    };
    viewerClose.addEventListener('click', closeModal);
    artifactViewer.querySelector('.viewer-backdrop').addEventListener('click', closeModal);

    // Rotation controls
    rotateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.direction;
        switch (direction) {
          case 'left':
            currentRotateY -= 45;
            break;
          case 'right':
            currentRotateY += 45;
            break;
          case 'up':
            currentRotateX -= 45;
            break;
          case 'down':
            currentRotateX += 45;
            break;
        }
        artifactModel.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) rotateZ(${currentRotateZ}deg)`;
      });
    });
  };

  // === GRIOT AUDIO PLAYER FUNCTIONALITY ===
  const initGriotPlayer = () => {
    const togglePlay = () => {
      isPlaying = !isPlaying;
      playBtn.querySelector('.play-icon').textContent = isPlaying ? '❚❚' : '▶';
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause griot narration' : 'Play griot narration');
      document.querySelector('.audio-player').classList.toggle('playing', isPlaying);

      if (isPlaying) {
        // Simulate playback progress
        playbackInterval = setInterval(() => {
          currentProgress += playbackSpeed;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(playbackInterval);
            isPlaying = false;
            playBtn.querySelector('.play-icon').textContent = '▶';
            document.querySelector('.audio-player').classList.remove('playing');
            // Reset narration
            narrationLines.forEach(line => line.classList.remove('visible'));
          }
          progressFill.style.width = `${currentProgress}%`;

          // Reveal narration lines based on delay
          narrationLines.forEach(line => {
            const delay = parseInt(line.dataset.delay);
            const triggerTime = (delay / 754) * 100; // 12:34 = 754s, map delay to percentage
            if (currentProgress >= triggerTime && !line.classList.contains('visible')) {
              line.classList.add('visible');
            }
          });
        }, 100);
      } else {
        clearInterval(playbackInterval);
      }
    };

    playBtn.addEventListener('click', togglePlay);
  };

  // === STAR MAP FUNCTIONALITY ===
  const initStarMap = () => {
    // Animate constellation lines when section is in view
    const cosmicObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          constellationLines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('animate');
            }, index * 200);
          });
        }
      });
    }, { threshold: 0.2 });

    if (cosmicSection) cosmicObserver.observe(cosmicSection);

    // Star node hover tooltip
    starNodes.forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        const name = node.dataset.name;
        if (name) {
          const tooltip = document.createElement('div');
          tooltip.className = 'star-tooltip';
          tooltip.textContent = name;
          tooltip.style.cssText = `
            position: absolute;
            background: rgba(26, 11, 46, 0.9);
            border: 1px solid #D4AF37;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: var(--font-tech);
            font-size: 0.8rem;
            color: #FFD700;
            pointer-events: none;
            z-index: 100;
            white-space: nowrap;
          `;
          document.body.appendChild(tooltip);
          const rect = node.getBoundingClientRect();
          tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
          tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        }
      });

      node.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.star-tooltip');
        if (tooltip) tooltip.remove();
      });
    });
  };

  // === TIMELINE FUNCTIONALITY ===
  const initTimeline = () => {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    timelineEvents.forEach(event => timelineObserver.observe(event));
  };

  // === SCROLL INDICATOR FUNCTIONALITY ===
  const initScrollIndicator = () => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'all';
      }
    });
  };

  // === INITIALIZE ALL MODULES ===
  initNavigation();
  initArtifactViewer();
  initGriotPlayer();
  initStarMap();
  initTimeline();
  initScrollIndicator();
});