// ===== ALCHEMICAL LABORATORY =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== STATE =====
  const state = {
    currentStage: 0, // 0: Nigredo, 1: Albedo, 2: Citrinitas, 3: Rubedo
    stages: ['Nigredo', 'Albedo', 'Citrinitas', 'Rubedo'],
    ingredientsGround: 0,
    maxIngredients: 3
  };

  // ===== DOM ELEMENTS =====
  const transmutationCircle = document.getElementById('transmutationCircle');
  const philosophersStone = document.getElementById('philosophersStone');
  const crucible = document.getElementById('crucible');
  const stageIndicators = document.querySelectorAll('.stage');
  const pestle = document.getElementById('pestle');
  const ingredients = document.querySelectorAll('.ingredient');
  const resetButton = document.getElementById('resetButton');
  const manuscriptNotes = document.querySelectorAll('.note');
  const manuscript = document.getElementById('manuscript');

  // ===== INITIALIZE =====
  updateStageUI();
  startCircleRotation();
  startCrucibleBubbling();

  // ===== TRANSMUTATION CIRCLE =====
  function startCircleRotation() {
    let rotation = 0;
    setInterval(() => {
      rotation += 0.2;
      transmutationCircle.style.transform = `rotate(${rotation}deg)`;
      // Advance stage every full rotation (360deg)
      if (rotation % 360 === 0) {
        advanceStage();
      }
    }, 50);
  }

  // ===== CRUCIBLE ANIMATION =====
  function startCrucibleBubbling() {
    setInterval(() => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.left = `${Math.random() * 80 + 10}%`;
      bubble.style.animationDelay = `${Math.random() * 2}s`;
      crucible.querySelector('.crucible-contents').appendChild(bubble);
      setTimeout(() => bubble.remove(), 3000);
    }, 800);
  }

  // ===== STAGE PROGRESSION =====
  function advanceStage() {
    if (state.currentStage < state.stages.length - 1) {
      state.currentStage++;
      updateStageUI();
    }
  }

  function updateStageUI() {
    // Update stone color
    philosophersStone.classList.toggle('active', state.currentStage === 3);
    philosophersStone.style.background = `radial-gradient(circle, var(--${state.stages[state.currentStage].toLowerCase()}) 0%, var(--gold) 100%)`;

    // Update stage indicators
    stageIndicators.forEach((stage, index) => {
      stage.classList.toggle('active', index === state.currentStage);
    });
  }

  // ===== MORTAR & PESTLE =====
  pestle.addEventListener('click', () => {
    if (state.ingredientsGround < state.maxIngredients) {
      state.ingredientsGround++;
      // Remove an ingredient
      const ingredient = document.querySelector('.ingredient:not(.ground)');
      if (ingredient) {
        ingredient.classList.add('ground');
        ingredient.style.opacity = '0';
      }
      // Advance stage every 3 grinds
      if (state.ingredientsGround % 3 === 0) {
        advanceStage();
      }
    }
  });

  // ===== MANUSCRIPT REVEALS =====
  // Scroll-triggered marginalia
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const revealNote = entry.target.querySelector('.note[data-reveal="scroll"]');
        if (revealNote) revealNote.style.opacity = '1';
      }
    });
  }, { threshold: 0.5 });

  observer.observe(manuscript);

  // Click-triggered marginalia
  manuscriptNotes.forEach(note => {
    if (note.dataset.reveal === 'click') {
      note.parentElement.addEventListener('click', () => {
        note.style.opacity = note.style.opacity === '1' ? '0' : '1';
      });
    }
  });

  // ===== RESET WORK =====
  resetButton.addEventListener('click', () => {
    state.currentStage = 0;
    state.ingredientsGround = 0;
    updateStageUI();
    // Restore ingredients
    ingredients.forEach(ingredient => {
      ingredient.classList.remove('ground');
      ingredient.style.opacity = '0.8';
    });
    // Hide marginalia
    manuscriptNotes.forEach(note => {
      note.style.opacity = '0';
    });
  });

  // ===== CELESTIAL OVERLAY =====
  document.addEventListener('mousemove', (e) => {
    const overlay = document.querySelector('.celestial-overlay');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    overlay.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
  });
});