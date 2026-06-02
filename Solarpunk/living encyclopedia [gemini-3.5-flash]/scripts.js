document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initSunlightIntensitySystem();
  initSeedBankFilters();
  initInteractiveSimulations();
});

/**
 * 1. PHOTOSYNTHESIS LOADER
 * Simulates systemic data synthesis before revealing the node interface.
 */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Let the beautiful loading animation play out fully
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.transform = 'scale(1.05)';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800); // Matches CSS transition duration
  }, 2200);
}

/**
 * 2. SUNLIGHT INTENSITY SYSTEM
 * Allows the user to shift the intensity of sunlight reaching the node.
 * Dynamically adjusts CSS custom properties to change the color palette from dawn/overcast to high-noon.
 * Updates telemetry calculations in real-time.
 */
function initSunlightIntensitySystem() {
  const sunSlider = document.getElementById('sun-slider');
  const sunVal = document.getElementById('sun-val');
  const root = document.documentElement;
  const batteryFill = document.querySelector('#node-charge .bar-fill');
  const batteryVal = document.querySelector('#node-charge .val');

  if (!sunSlider) return;

  const updateSolarTelemetry = (intensity) => {
    // Update the CSS variable (normalized value between 0.0 and 1.0)
    const normalizedIntensity = intensity / 100;
    root.style.setProperty('--sun-intensity', normalizedIntensity);

    // Update slider label
    sunVal.textContent = `${intensity}%`;

    // Simulate battery response: High sunlight charges node battery to max
    const baseBattery = 30; // Min operational level
    const dynamicCharge = Math.min(100, Math.floor(baseBattery + (normalizedIntensity * 70)));
    
    if (batteryFill && batteryVal) {
      batteryFill.style.width = `${dynamicCharge}%`;
      batteryVal.textContent = `${dynamicCharge}%`;

      // Visual color feedback for battery level
      if (dynamicCharge > 80) {
        batteryFill.style.boxShadow = '0 0 12px var(--color-accent-sun)';
      } else if (dynamicCharge < 50) {
        batteryFill.style.boxShadow = 'none';
      }
    }
  };

  // Listen to slider adjustments
  sunSlider.addEventListener('input', (e) => {
    updateSolarTelemetry(e.target.value);
  });

  // Initial calculation run
  updateSolarTelemetry(sunSlider.value);
}

/**
 * 3. SEED BANK FILTER SYSTEM
 * Provides instantaneous, animated sorting of the companion-planting seed database.
 */
function initSeedBankFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const seedCards = document.querySelectorAll('.seed-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from other buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      seedCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          // Smooth fade-in animation trigger
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // Matches CSS transition length
        }
      });
    });
  });
}

/**
 * 4. INTERACTIVE SIMULATIONS & SYSTEM NOTIFICATIONS
 * Simulates a live mesh network with fluctuating metrics and functional action buttons.
 */
function initInteractiveSimulations() {
  // Fluctuating mesh peers to mimic real-time node discoveries
  const peerElement = document.querySelector('.peers-count .val');
  if (peerElement) {
    setInterval(() => {
      const currentPeers = parseInt(peerElement.textContent.replace(/,/g, ''));
      const shift = Math.floor(Math.random() * 7) - 3; // Random drift -3 to +3
      const newPeers = Math.max(1200, currentPeers + shift);
      peerElement.textContent = newPeers.toLocaleString() + ' Online';
    }, 6000);
  }

  // Dynamic status messages via a customized Toast Notification System
  const triggerNotification = (message, icon = '🌿') => {
    // Create notification bubble
    const toast = document.createElement('div');
    toast.className = 'p2p-toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <p class="toast-message">${message}</p>
    `;

    // Append to body
    document.body.appendChild(toast);

    // Apply notification specific styles dynamically to prevent stylesheet bloat
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'var(--color-bg-card)',
      border: '1.5px solid var(--color-accent-leaf)',
      borderRadius: '16px 4px 16px 4px',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
      zIndex: '1000',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });

    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 100);

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  };

  // Button Action: Share Node via Peer-to-Peer
  const shareBtn = document.getElementById('share-node');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      triggerNotification('Broadcasting article cryptographically to nearest solar-nodes!', '🌐');
    });
  }

  // Button Action: Propose Edit
  const editBtn = document.getElementById('edit-btn');
  const articleContent = document.getElementById('article');
  let isEditing = false;

  if (editBtn && articleContent) {
    editBtn.addEventListener('click', () => {
      isEditing = !isEditing;
      if (isEditing) {
        articleContent.setAttribute('contenteditable', 'true');
        articleContent.focus();
        editBtn.innerHTML = '💾 Save Draft';
        editBtn.style.background = 'var(--color-accent-sun)';
        editBtn.style.color = 'var(--color-bg-deep)';
        triggerNotification('Wiki page is now interactive. Propose edits and update parameters.', '✍️');
      } else {
        articleContent.setAttribute('contenteditable', 'false');
        editBtn.innerHTML = '✍️ Propose Edit';
        editBtn.style.background = 'transparent';
        editBtn.style.color = 'var(--color-text-main)';
        triggerNotification('Draft saved locally. Changes are pending consensus approval.', '🌿');
      }
    });
  }

  // Animate Map Nodes periodically to show activity pulses
  const gridDots = document.querySelectorAll('.grid-dot');
  setInterval(() => {
    if (gridDots.length > 0) {
      const randomIndex = Math.floor(Math.random() * gridDots.length);
      gridDots[randomIndex].classList.toggle('active');
    }
  }, 4000);
}