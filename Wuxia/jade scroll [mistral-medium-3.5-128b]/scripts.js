// ===== DOM ELEMENTS =====
const scrollContainer = document.querySelector('.scroll-container');
const scrollHeader = document.querySelector('.scroll-header');
const scrollContent = document.querySelector('.scroll-content');
const skillTree = document.querySelector('.skill-tree');
const qiPaths = document.querySelectorAll('.qi-path');
const qiPoints = document.querySelectorAll('.qi-point');
const navSeals = document.querySelectorAll('.nav-seal');
const parallaxLayers = document.querySelectorAll('.parallax-layer');

// ===== SCROLL UNROLLING ANIMATION =====
function initScrollUnroll() {
  // Hide content initially
  scrollContent.style.opacity = '0';
  scrollContent.style.transform = 'translateY(20px)';

  // Animate header first (like unrolling the top)
  scrollHeader.style.transform = 'translateY(-100%)';
  scrollHeader.style.opacity = '0';

  setTimeout(() => {
    scrollHeader.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    scrollHeader.style.transform = 'translateY(0)';
    scrollHeader.style.opacity = '1';
  }, 500);

  // Then reveal content with a staggered delay
  setTimeout(() => {
    scrollContent.style.transition = 'all 2s ease-out';
    scrollContent.style.opacity = '1';
    scrollContent.style.transform = 'translateY(0)';
  }, 1200);
}

// ===== QI ENERGY PULSE ANIMATION =====
function initQiPulses() {
  qiPoints.forEach((point, index) => {
    // Stagger the pulses
    setTimeout(() => {
      point.style.animation = `qiPointPulse 2s infinite ${index * 0.3}s`;
    }, 1000 + index * 200);

    // Add glow effect on hover
    point.addEventListener('mouseenter', () => {
      point.style.boxShadow = '0 0 20px rgba(30, 136, 229, 0.8)';
      point.style.transform = 'scale(1.2)';
    });

    point.addEventListener('mouseleave', () => {
      point.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
      point.style.transform = 'scale(1)';
    });
  });

  // Animate qi paths (meridians)
  qiPaths.forEach((path, index) => {
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    path.style.animation = `qiPathFlow 3s linear infinite ${index * 0.5}s`;
  });
}

// ===== INK BRUSH STROKE SKILL TREE =====
function initSkillTree() {
  const skillNodes = document.querySelectorAll('.skill-node');

  // Draw branches dynamically (simulate ink strokes)
  skillNodes.forEach((node, index) => {
    if (node.classList.contains('root')) return;

    // Delay each node's appearance
    setTimeout(() => {
      node.style.opacity = '0';
      node.style.transform = 'scale(0.5)';
      node.style.transition = 'all 0.8s ease-out';

      setTimeout(() => {
        node.style.opacity = '1';
        node.style.transform = 'scale(1)';
      }, 100);
    }, 1500 + index * 200);

    // Ink splatter effect on hover
    node.addEventListener('mouseenter', () => {
      const splatter = document.createElement('div');
      splatter.className = 'ink-splatter';
      splatter.style.position = 'absolute';
      splatter.style.width = '30px';
      splatter.style.height = '30px';
      splatter.style.background = 'radial-gradient(circle, rgba(200, 150, 100, 0.3) 0%, transparent 70%)';
      splatter.style.borderRadius = '50%';
      splatter.style.pointerEvents = 'none';
      splatter.style.zIndex = '-1';

      // Random position near the node
      const rect = node.getBoundingClientRect();
      const scrollRect = scrollContainer.getBoundingClientRect();
      splatter.style.left = `${rect.left - scrollRect.left + rect.width / 2 - 15}px`;
      splatter.style.top = `${rect.top - scrollRect.top + rect.height / 2 - 15}px`;

      scrollContainer.appendChild(splatter);

      // Animate splatter
      splatter.style.transform = 'scale(0)';
      splatter.style.opacity = '1';
      setTimeout(() => {
        splatter.style.transition = 'all 0.5s ease-out';
        splatter.style.transform = 'scale(1)';
        splatter.style.opacity = '0';
      }, 10);

      // Remove splatter after animation
      setTimeout(() => {
        splatter.remove();
      }, 500);
    });
  });
}

// ===== SEAL NAVIGATION =====
function initSealNavigation() {
  navSeals.forEach(seal => {
    seal.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = seal.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      // Smooth scroll to section
      scrollContainer.scrollTo({
        top: targetSection.offsetTop - scrollContainer.offsetTop - 20,
        behavior: 'smooth'
      });

      // Seal pulse effect
      seal.style.transform = 'scale(0.8)';
      setTimeout(() => {
        seal.style.transform = 'scale(1.2)';
        setTimeout(() => {
          seal.style.transform = 'scale(1)';
        }, 200);
      }, 100);
    });
  });
}

// ===== PARALLAX ENHANCEMENT =====
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxLayers.forEach((layer, index) => {
      // Different speeds for each layer (deeper layers move slower)
      const speed = 0.1 + (index * 0.05);
      layer.style.transform = `translateX(${scrollY * speed}px)`;
    });
  });
}

// ===== SCROLL SHADOW EFFECT =====
function initScrollShadows() {
  scrollContainer.addEventListener('scroll', () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    // Top shadow (when scrolled down)
    if (scrollTop > 10) {
      scrollContainer.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5), inset 0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
      scrollContainer.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.3)';
    }

    // Bottom shadow (when near the end)
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      scrollContainer.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5), inset 0 -10px 30px rgba(0, 0, 0, 0.1)';
    }
  });
}

// ===== KEYFRAMES (Added via JS for dynamic effects) =====
function addKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes qiPointPulse {
      0%, 100% { box-shadow: 0 0 10px rgba(30, 136, 229, 0.5); }
      50% { box-shadow: 0 0 20px rgba(30, 136, 229, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
    }
    @keyframes qiPathFlow {
      0% { stroke-dashoffset: 10; opacity: 0.7; }
      50% { opacity: 1; }
      100% { stroke-dashoffset: -10; opacity: 0.7; }
    }
    @keyframes inkSplatter {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ===== INITIALIZE ALL EFFECTS =====
function init() {
  addKeyframes();
  initScrollUnroll();
  initQiPulses();
  initSkillTree();
  initSealNavigation();
  initParallax();
  initScrollShadows();
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', init);