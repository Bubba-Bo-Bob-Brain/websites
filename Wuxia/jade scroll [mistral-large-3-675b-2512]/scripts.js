// ===== GLOBALS =====
const scrollContainer = document.querySelector('.scroll-container');
const seals = document.querySelectorAll('.seal');
const skillBranches = document.querySelectorAll('.qi-branch');
const tooltip = document.getElementById('tooltip-1');
const customCursor = document.querySelector('.custom-cursor');
const qiParticles = document.querySelectorAll('.qi-particle');

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initQiFlow();
  initScrollAnimations();
  initSealNavigation();
  initTooltips();
  initCustomCursor();
  initParallax();
});

// ===== QI FLOW ANIMATION =====
function initQiFlow() {
  gsap.registerPlugin(MotionPathPlugin);

  // Animate particles along trunk
  qiParticles.forEach(particle => {
    gsap.to(particle, {
      motionPath: {
        path: "M600,100 Q600,300 600,500 Q600,700 400,800",
        align: "self",
        autoRotate: true
      },
      duration: 8,
      repeat: -1,
      ease: "sine.inOut",
      yoyo: true
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Skill branches grow on scroll
  const branchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out"
        });
      }
    });
  }, observerOptions);

  skillBranches.forEach(branch => {
    // Set initial dash offset for "drawing" effect
    const pathLength = branch.getTotalLength();
    branch.style.strokeDasharray = pathLength;
    branch.style.strokeDashoffset = pathLength;
    branchObserver.observe(branch);
  });

  // Section fade-in
  const sections = document.querySelectorAll('.scroll-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    gsap.set(section, { opacity: 0, y: 50 });
    sectionObserver.observe(section);
  });
}

// ===== SEAL NAVIGATION =====
function initSealNavigation() {
  seals.forEach(seal => {
    seal.addEventListener('click', () => {
      const targetId = seal.dataset.section;
      const targetSection = document.getElementById(targetId);

      // Scroll with smooth animation
      gsap.to(scrollContainer, {
        scrollTo: { y: targetSection.offsetTop - 80, autoKill: false },
        duration: 1.5,
        ease: "power2.inOut"
      });

      // Update active seal
      seals.forEach(s => s.classList.remove('active'));
      seal.classList.add('active');
    });
  });
}

// ===== TOOLTIPS =====
function initTooltips() {
  skillBranches.forEach(branch => {
    branch.addEventListener('mouseenter', (e) => {
      const techniqueName = branch.dataset.technique;
      const techniqueDesc = getTechniqueDescription(techniqueName);

      tooltip.innerHTML = `
        <h3>${techniqueName}</h3>
        <p>${techniqueDesc}</p>
      `;

      // Position tooltip near branch end
      const pathEnd = getPathEndPoint(branch);
      tooltip.style.left = `${pathEnd.x - 125}px`;
      tooltip.style.top = `${pathEnd.y - 100}px`;
      tooltip.style.opacity = '1';

      // Animate tooltip
      gsap.from(tooltip, {
        scale: 0.8,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });

    branch.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

// Helper: Get technique description
function getTechniqueDescription(name) {
  const descriptions = {
    '剑指江山': 'Channel qi into fingertips to summon crescent blades. Mastery required: Earth Rank.',
    '拈花破法': 'Use the "Touch of Death" to disrupt enemy meridians. Cost: 180 Qi.',
    '龙吟大法': 'Roar that shatters boulders. Aura damage radius: 10 meters.',
    '凤凰涅槃': 'Self-combustion technique. Reborn with 30% bonus attack.'
  };
  return descriptions[name] || 'Ancient technique lost to time.';
}

// Helper: Get SVG path end point
function getPathEndPoint(pathElement) {
  const pathLength = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(pathLength);
  const svg = pathElement.ownerSVGElement;
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = point.x;
  svgPoint.y = point.y;
  const { x, y } = svgPoint.matrixTransform(svg.getScreenCTM());
  return { x, y };
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
  document.addEventListener('mousemove', (e) => {
    gsap.to(customCursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out"
    });

    // Trail effect
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    document.body.appendChild(trail);

    gsap.to(trail, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => trail.remove()
    });
  });

  // Scale cursor on interactive elements
  document.querySelectorAll('a, button, .seal, .qi-branch').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(customCursor, { scale: 2, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(customCursor, { scale: 1, duration: 0.3 });
    });
  });
}

// ===== PARALLAX EFFECTS =====
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelector('.clouds').style.transform = `translateX(${scrollY * 0.3}px)`;
    document.querySelector('.bamboo').style.transform = `translateY(${scrollY * 0.1}px)`;
  });
}

// ===== INK WASH FILTER (SVG) =====
// Append ink jitter filter to SVG
const svg = document.querySelector('.skill-tree');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
filter.id = 'inkJitter';
filter.innerHTML = `
  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
`;
defs.appendChild(filter);
svg.insertBefore(defs, svg.firstChild);