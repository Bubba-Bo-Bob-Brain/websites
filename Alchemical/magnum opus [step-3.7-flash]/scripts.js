document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // STATE & CONFIGURATION
  // ============================================
  const STAGES = [
    {
      id: 'nigredo',
      name: 'NIGREDO',
      latin: 'Nigredo',
      subtitle: 'Blackening',
      color: '#0a0505',
      glow: '#2a1515',
      heat: 'IGNIS',
      materia: 'PRIMA',
      centerText: 'AZOTH',
      subtext: 'IN IGNIS',
      stoneColor: 'radial-gradient(circle at 30% 30%, #2a1515, #0a0505 70%)',
      stoneInner: 'radial-gradient(circle at 40% 40%, #3a2a2a, #0a0505)',
      auraColor: 'rgba(42, 21, 21, 0.4)',
      liquidColor: 'radial-gradient(ellipse at 50% 30%, #4a1a1a, #2a0a0a 60%, #0a0000)',
      surfaceColor: 'rgba(255, 100, 50, 0.3)'
    },
    {
      id: 'albedo',
      name: 'ALBEDO',
      latin: 'Albedo',
      subtitle: 'Whitening',
      color: '#f5f5f0',
      glow: '#e8e8e0',
      heat: 'LVNA',
      materia: 'PVRGATA',
      centerText: 'LVNA',
      subtext: 'IN AQVA',
      stoneColor: 'radial-gradient(circle at 30% 30%, #f5f5f0, #d0d0c8 70%)',
      stoneInner: 'radial-gradient(circle at 40% 40%, #ffffff, #e8e8e0)',
      auraColor: 'rgba(232, 232, 224, 0.5)',
      liquidColor: 'radial-gradient(ellipse at 50% 30%, #e8e8e0, #c8c8c0 60%, #a0a0a0)',
      surfaceColor: 'rgba(255, 255, 255, 0.5)'
    },
    {
      id: 'citrinitas',
      name: 'CITRINITAS',
      latin: 'Citrinitas',
      subtitle: 'Yellowing',
      color: '#ffd700',
      glow: '#ffec8b',
      heat: 'SOL',
      materia: 'TINCTVRA',
      centerText: 'SOL',
      subtext: 'IN AERE',
      stoneColor: 'radial-gradient(circle at 30% 30%, #ffd700, #daa520 70%)',
      stoneInner: 'radial-gradient(circle at 40% 40%, #fffacd, #ffd700)',
      auraColor: 'rgba(255, 215, 0, 0.6)',
      liquidColor: 'radial-gradient(ellipse at 50% 30%, #ffec8b, #ffd700 60%, #daa520)',
      surfaceColor: 'rgba(255, 215, 0, 0.6)'
    },
    {
      id: 'rubedo',
      name: 'RUBEDO',
      latin: 'Rubedo',
      subtitle: 'Reddening',
      color: '#8b0000',
      glow: '#dc143c',
      heat: 'MARS',
      materia: 'PERFECTA',
      centerText: 'LAPIS',
      subtext: 'PHILOSOPHORVM',
      stoneColor: 'radial-gradient(circle at 30% 30%, #dc143c, #8b0000 70%)',
      stoneInner: 'radial-gradient(circle at 40% 40%, #ff6b6b, #dc143c)',
      auraColor: 'rgba(220, 20, 60, 0.7)',
      liquidColor: 'radial-gradient(ellipse at 50% 30%, #dc143c, #8b0000 60%, #4a0000)',
      surfaceColor: 'rgba(220, 20, 60, 0.7)'
    }
  ];

  let currentStage = 0;
  let grindCount = 0;
  const activeElements = new Set();
  let isSecretRevealed = false;

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const stageDots = document.querySelectorAll('.stage-dot');
  const stageBadge = document.getElementById('stageBadge');
  const stone = document.getElementById('stone');
  const stoneInner = document.getElementById('stoneInner');
  const stoneGlow = document.getElementById('stoneGlow');
  const stoneAura = document.getElementById('stoneAura');
  const progressFill = document.getElementById('progressFill');
  const progressPercentage = document.getElementById('progressPercentage');
  const heatValue = document.getElementById('heatValue');
  const materiaValue = document.getElementById('materiaValue');
  const stageValue = document.getElementById('stageValue');
  const tcCenterText = document.getElementById('tcCenterText');
  const tcCenterSubtext = document.getElementById('tcCenterSubtext');
  const crucibleLiquid = document.getElementById('crucibleLiquid');
  const liquidSurface = document.getElementById('liquidSurface');
  const bubblesContainer = document.getElementById('bubblesContainer');
  const mortarPestleContainer = document.getElementById('mortarPestleContainer');
  const grindCountDisplay = document.getElementById('grindCount');
  const mortarContents = document.getElementById('mortarContents');
  const waxSeal = document.getElementById('waxSeal');
  const secretCompartment = document.getElementById('secretCompartment');
  const vials = document.querySelectorAll('.vial');
  const manuscriptScroll = document.getElementById('manuscriptScroll');
  const finalReveal = document.getElementById('finalReveal');
  const celestialOverlay = document.getElementById('celestialOverlay');
  const tcRotator = document.getElementById('tcRotator');

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    generateTicks();
    setupEventListeners();
    setupManuscriptReveal();
    setupParallax();
    setStage(0);
    startBubbleGeneration();
    startAmbientAnimations();
  }

  // ============================================
  // TRANSMUTATION CIRCLE TICKS GENERATION
  // ============================================
  function generateTicks() {
    const ticksGroup = document.getElementById('tcTicks');
    if (!ticksGroup) return;
    
    const cx = 250, cy = 250, r = 242;
    for (let i = 0; i < 72; i++) {
      const angle = (i * 5) * Math.PI / 180;
      const isMajor = i % 6 === 0;
      const innerR = isMajor ? r - 10 : r - 5;
      
      const x1 = cx + innerR * Math.cos(angle);
      const y1 = cy + innerR * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'var(--ink-sepia)');
      line.setAttribute('stroke-width', isMajor ? '2' : '1');
      line.setAttribute('opacity', isMajor ? '0.7' : '0.4');
      
      ticksGroup.appendChild(line);
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function setupEventListeners() {
    // Stage dots
    stageDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const stage = parseInt(dot.dataset.stage);
        setStage(stage);
        triggerStageTransition();
      });
    });

    // Wax seal - secret compartment
    waxSeal.addEventListener('click', () => {
      isSecretRevealed = !isSecretRevealed;
      secretCompartment.classList.toggle('revealed', isSecretRevealed);
      
      // If revealed, maybe advance stage slightly? Or just for show.
      if (isSecretRevealed && currentStage < 3) {
        // Little bonus: increase grind count display temporarily
        grindCountDisplay.textContent = '∞';
        setTimeout(() => {
          grindCountDisplay.textContent = grindCount;
        }, 2000);
      }
    });

    // Mortar and pestle
    mortarPestleContainer.addEventListener('click', (e) => {
      // Only trigger if clicking directly on container, not children? Actually we want the whole area.
      grindMortar();
    });

    // Vials - add elements to crucible
    vials.forEach(vial => {
      vial.addEventListener('click', () => {
        const element = vial.dataset.element;
        addElement(element);
      });
    });

    // Keyboard shortcuts for stages (1-4)
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '4') {
        const stage = parseInt(e.key) - 1;
        setStage(stage);
        triggerStageTransition();
      }
    });
  }

  // ============================================
  // STAGE MANAGEMENT
  // ============================================
  function setStage(stageIndex) {
    if (stageIndex < 0 || stageIndex >= STAGES.length) return;
    
    currentStage = stageIndex;
    const stage = STAGES[stageIndex];

    // Update stage dots
    stageDots.forEach(dot => {
      const dotStage = parseInt(dot.dataset.stage);
      dot.classList.toggle('active', dotStage === stageIndex);
      // Also update dot color to match stage
      if (dotStage === stageIndex) {
        dot.querySelector('.dot').style.background = stage.color;
        dot.querySelector('.dot').style.borderColor = stage.glow;
        dot.querySelector('.dot').style.boxShadow = `0 0 10px ${stage.glow}`;
      } else {
        dot.querySelector('.dot').style.background = '';
        dot.querySelector('.dot').style.borderColor = '';
        dot.querySelector('.dot').style.boxShadow = '';
      }
    });

    // Update stage badge
    stageBadge.textContent = stage.name;
    stageBadge.className = `stage-badge ${stage.id}`;

    // Update stone
    stone.style.background = stage.stoneColor;
    stoneInner.style.background = stage.stoneInner;
    stoneGlow.style.background = `radial-gradient(circle, ${stage.glow}66, transparent 60%)`;
    stoneAura.style.background = `radial-gradient(circle, ${stage.auraColor}, transparent 70%)`;

    // Update progress bar
    const progress = ((stageIndex + 1) / STAGES.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;

    // Update crucible readout
    heatValue.textContent = stage.heat;
    materiaValue.textContent = stage.materia;
    stageValue.textContent = stage.name;

    // Update transmutation circle center
    tcCenterText.textContent = stage.centerText;
    tcCenterSubtext.textContent = stage.subtext;

    // Update body class for stage-specific background
    document.body.className = document.body.className.replace(/nigredo-stage|albedo-stage|citrinitas-stage|rubedo-stage/g, '').trim();
    document.body.classList.add(`${stage.id}-stage`);

    // Update liquid based on stage and active elements
    updateCrucibleLiquid();

    // Update rotator speed? Could vary per stage.
    if (tcRotator) {
      const speeds = [120, 90, 60, 30]; // seconds for full rotation
      tcRotator.style.animationDuration = `${speeds[stageIndex]}s`;
    }
  }

  function triggerStageTransition() {
    // Visual feedback: flash the stone
    stone.style.transition = 'transform 0.2s ease';
    stone.style.transform = 'scale(1.2)';
    setTimeout(() => {
      stone.style.transform = '';
    }, 200);

    // Burst of bubbles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => generateBubble(), i * 50);
    }
  }

  // ============================================
  // CRUCIBLE & ELEMENTS
  // ============================================
  function addElement(element) {
    activeElements.add(element);
    updateCrucibleLiquid();

    // Visual feedback
    const vial = document.querySelector(`.vial[data-element="${element}"]`);
    if (vial) {
      vial.style.transform = 'translateY(-10px) scale(1.1)';
      vial.style.filter = 'brightness(1.3)';
      setTimeout(() => {
        vial.style.transform = '';
        vial.style.filter = '';
      }, 300);
    }

    // If quintessence added, maybe advance stage?
    if (element === 'quintessence' && currentStage < 3) {
      setTimeout(() => setStage(currentStage + 1), 1000);
    }
  }

  function updateCrucibleLiquid() {
    const stage = STAGES[currentStage];
    let color = stage.liquidColor;
    let surfaceColor = stage.surfaceColor;

    // Override with element colors if any active
    if (activeElements.has('fire')) {
      color = 'radial-gradient(ellipse at 50% 30%, #ff6347, #ff4500 60%, #8b0000)';
      surfaceColor = 'rgba(255, 69, 0, 0.5)';
    } else if (activeElements.has('water')) {
      color = 'radial-gradient(ellipse at 50% 30%, #6495ed, #4169e1 60%, #000080)';
      surfaceColor = 'rgba(65, 105, 225, 0.5)';
    } else if (activeElements.has('air')) {
      color = 'radial-gradient(ellipse at 50% 30%, #ffffff, #e6e6fa 60%, #b8b8d0)';
      surfaceColor = 'rgba(255, 255, 255, 0.6)';
    } else if (activeElements.has('earth')) {
      color = 'radial-gradient(ellipse at 50% 30%, #a0522d, #8b4513 60%, #4a2500)';
      surfaceColor = 'rgba(139, 69, 19, 0.5)';
    } else if (activeElements.has('quintessence')) {
      color = 'radial-gradient(ellipse at 50% 30%, #ffec8b, #daa520 60%, #8b6914)';
      surfaceColor = 'rgba(255, 215, 0, 0.7)';
    }

    crucibleLiquid.style.background = color;
    liquidSurface.style.background = `radial-gradient(ellipse, ${surfaceColor}, transparent)`;
  }

  function generateBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 12 + 4;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 70 + 15}%`;
    bubble.style.bottom = '10%';
    bubble.style.animationDuration = `${Math.random() * 2 + 2}s`;
    
    // Randomize bubble color based on stage
    const stage = STAGES[currentStage];
    bubble.style.background = `radial-gradient(circle at 30% 30%, ${stage.glow}aa, ${stage.color}66)`;
    
    bubblesContainer.appendChild(bubble);

    // Remove after animation
    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, 4000);
  }

  function startBubbleGeneration() {
    setInterval(() => {
      if (document.hidden) return; // Don't generate when tab inactive
      generateBubble();
    }, 800);
  }

  // ============================================
  // MORTAR & PESTLE
  // ============================================
  function grindMortar() {
    grindCount++;
    grindCountDisplay.textContent = grindCount;

    // Animate pestle
    const pestle = document.getElementById('pestle');
    if (pestle) {
      pestle.classList.add('grinding');
      setTimeout(() => pestle.classList.remove('grinding'), 300);
    }

    // Show contents after first grind
    if (grindCount === 1) {
      mortarContents.style.opacity = '1';
    }

    // After 10 grinds, reset but keep a trace
    if (grindCount >= 10) {
      // Create a small flash
      mortarContents.style.boxShadow = '0 0 20px var(--gold)';
      setTimeout(() => {
        mortarContents.style.boxShadow = '';
      }, 500);
      
      // Could also add a tiny amount to progress? For now, just reset.
      grindCount = 0;
      grindCountDisplay.textContent = '0';
      mortarContents.style.opacity = '0.7';
    }
  }

  // ============================================
  // MANUSCRIPT REVEAL ON SCROLL
  // ============================================
  function setupManuscriptReveal() {
    const observerOptions = {
      root: manuscriptScroll,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Once revealed, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all manuscript text and marginalia
    document.querySelectorAll('.ms-text, .marginalia').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    // Final reveal special treatment
    if (finalReveal) {
      finalReveal.style.opacity = '0';
      finalReveal.style.transform = 'scale(0.95)';
      finalReveal.style.transition = 'opacity 1s ease, transform 1s ease';
      observer.observe(finalReveal);
    }
  }

  // ============================================
  // PARALLAX EFFECT FOR CELESTIAL OVERLAY
  // ============================================
  function setupParallax() {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      if (celestialOverlay) {
        celestialOverlay.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }

  // ============================================
  // AMBIENT ANIMATIONS
  // ============================================
  function startAmbientAnimations() {
    // Randomly adjust rotator speed slightly for organic feel
    setInterval(() => {
      if (tcRotator) {
        const baseSpeed = [120, 90, 60, 30][currentStage];
        const variation = Math.random() * 10 - 5;
        tcRotator.style.animationDuration = `${baseSpeed + variation}s`;
      }
    }, 5000);

    // Occasionally generate a larger bubble
    setInterval(() => {
      if (Math.random() > 0.7) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 20 + 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 60 + 20}%`;
        bubble.style.bottom = '5%';
        bubble.style.animationDuration = `${Math.random() * 3 + 3}s`;
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,200,100,0.9), rgba(255,100,50,0.6))`;
        bubblesContainer.appendChild(bubble);
        setTimeout(() => {
          if (bubble.parentNode) bubble.remove();
        }, 6000);
      }
    }, 2000);
  }

  // ============================================
  // START
  // ============================================
  init();
});