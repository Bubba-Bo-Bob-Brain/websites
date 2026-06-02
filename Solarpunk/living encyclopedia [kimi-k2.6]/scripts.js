// ============================================
// THE VERDANT CODEX — SOLARPUNK WIKI SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initPhotosynthesisLoader();
  initSolarMeter();
  initVineNavigation();
  initSeedBank();
  initCitationFormats();
  initHeaderScroll();
  initSmoothScroll();
  initArticleActions();
  initSearchGrowth();
});

// ============================================
// PHOTOSYNTHESIS LOADER
// Germinates knowledge on page load
// ============================================

function initPhotosynthesisLoader() {
  const loader = document.getElementById('photosynthesis-loader');
  const app = document.getElementById('app');
  
  if (!loader || !app) return;
  
  const germinationTime = 2200;
  
  setTimeout(() => {
    loader.classList.add('loader-hidden');
    app.classList.remove('app-hidden');
    
    setTimeout(() => {
      loader.style.display = 'none';
      triggerEntryAnimations();
    }, 600);
  }, germinationTime);
}

function triggerEntryAnimations() {
  const header = document.querySelector('.site-header');
  const sidebar = document.querySelector('.vine-sidebar');
  const article = document.querySelector('.article-meadow');
  const context = document.querySelector('.context-panel');
  
  const elements = [header, sidebar, article, context].filter(Boolean);
  
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + (index * 150));
  });
}

// ============================================
// SOLAR INTENSITY METER
// Shifts page palette based on time of day
// ============================================

function initSolarMeter() {
  const meter = document.getElementById('solar-meter');
  const fill = document.getElementById('solar-fill');
  const valueOutput = document.getElementById('solar-value');
  
  if (!meter || !fill || !valueOutput) return;
  
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeDecimal = hour + (minute / 60);
  
  const solarData = calculateSolarIntensity(timeDecimal);
  
  applySolarTheme(solarData.phase);
  updateMeterDisplay(solarData);
  
  let currentIntensity = solarData.intensity;
  let targetIntensity = solarData.intensity;
  
  setInterval(() => {
    const fresh = calculateSolarIntensity(new Date().getHours() + new Date().getMinutes() / 60);
    targetIntensity = fresh.intensity;
  }, 60000);
  
  function animateMeter() {
    currentIntensity += (targetIntensity - currentIntensity) * 0.05;
    const displayValue = Math.round(currentIntensity);
    
    fill.style.width = `${currentIntensity}%`;
    valueOutput.textContent = `${displayValue}%`;
    
    if (Math.abs(targetIntensity - currentIntensity) > 0.1) {
      requestAnimationFrame(animateMeter);
    }
  }
  
  animateMeter();
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      meter.classList.add('scrolled');
    } else {
      meter.classList.remove('scrolled');
    }
  });
}

function calculateSolarIntensity(timeDecimal) {
  let phase, intensity;
  
  if (timeDecimal < 5) {
    phase = 'night';
    intensity = 10 + Math.random() * 5;
  } else if (timeDecimal < 7) {
    phase = 'dawn';
    intensity = 15 + (timeDecimal - 5) / 2 * 40;
  } else if (timeDecimal < 11) {
    phase = 'midday';
    intensity = 55 + (timeDecimal - 7) / 4 * 30;
  } else if (timeDecimal < 15) {
    phase = 'golden';
    intensity = 85 - (timeDecimal - 11) / 4 * 10;
  } else if (timeDecimal < 19) {
    phase = 'dusk';
    intensity = 75 - (timeDecimal - 15) / 4 * 55;
  } else {
    phase = 'night';
    intensity = 20 - (timeDecimal - 19) / 5 * 15;
  }
  
  intensity = Math.max(5, Math.min(95, intensity + (Math.random() * 6 - 3)));
  
  return { phase, intensity };
}

function applySolarTheme(phase) {
  document.body.setAttribute('data-solar', phase);
}

function updateMeterDisplay({ intensity }) {
  const fill = document.getElementById('solar-fill');
  const valueOutput = document.getElementById('solar-value');
  
  if (fill) fill.style.width = `${intensity}%`;
  if (valueOutput) valueOutput.textContent = `${Math.round(intensity)}%`;
}

// ============================================
// VINE NAVIGATION
// Expandable branch system with organic behavior
// ============================================

function initVineNavigation() {
  const sidebar = document.getElementById('vine-sidebar');
  const roots = document.getElementById('category-roots');
  
  if (!sidebar || !roots) return;
  
  drawVinePath();
  window.addEventListener('resize', debounce(drawVinePath, 200));
  
  const toggles = roots.querySelectorAll('.branch-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (event) => {
      const branch = toggle.closest('.root-branch');
      const leaves = branch.querySelector('.branch-leaves');
      const isExpanded = branch.classList.contains('expanded');
      
      closeSiblingBranches(branch);
      
      if (isExpanded) {
        collapseBranch(branch);
      } else {
        expandBranch(branch);
      }
      
      event.stopPropagation();
    });
  });
  
  animateVineEntrance();
}

function drawVinePath() {
  const vineSvg = document.querySelector('.vine-svg');
  const vinePath = document.querySelector('.vine-path');
  const branches = document.querySelectorAll('.root-branch');
  
  if (!vineSvg || !vinePath || branches.length === 0) return;
  
  let pathD = 'M 2 0';
  let currentY = 0;
  
  branches.forEach((branch, index) => {
    const toggle = branch.querySelector('.branch-toggle');
    if (!toggle) return;
    
    const rect = toggle.getBoundingClientRect();
    const sidebarRect = document.querySelector('.vine-sidebar').getBoundingClientRect();
    const relativeY = rect.top - sidebarRect.top + (rect.height / 2);
    
    if (index === 0) {
      pathD = `M 2 ${relativeY}`;
    } else {
      pathD += ` L 2 ${relativeY}`;
    }
    
    currentY = relativeY;
  });
  
  vinePath.setAttribute('d', pathD);
}

function expandBranch(branch) {
  const leaves = branch.querySelector('.branch-leaves');
  const toggle = branch.querySelector('.branch-toggle');
  
  branch.classList.add('expanded');
  branch.classList.remove('collapsed');
  
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  if (leaves) {
    leaves.classList.remove('collapsed');
    leaves.style.maxHeight = leaves.scrollHeight + 'px';
    leaves.style.opacity = '1';
  }
  
  setTimeout(() => drawVinePath(), 400);
}

function collapseBranch(branch) {
  const leaves = branch.querySelector('.branch-leaves');
  const toggle = branch.querySelector('.branch-toggle');
  
  branch.classList.remove('expanded');
  branch.classList.add('collapsed');
  
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  if (leaves) {
    leaves.classList.add('collapsed');
    leaves.style.maxHeight = '0';
    leaves.style.opacity = '0';
  }
  
  setTimeout(() => drawVinePath(), 400);
}

function closeSiblingBranches(activeBranch) {
  const parent = activeBranch.parentElement;
  if (!parent) return;
  
  const siblings = parent.querySelectorAll('.root-branch');
  
  siblings.forEach(sibling => {
    if (sibling !== activeBranch && sibling.classList.contains('expanded')) {
      collapseBranch(sibling);
    }
  });
}

function animateVineEntrance() {
  const branches = document.querySelectorAll('.root-branch');
  
  branches.forEach((branch, index) => {
    branch.style.opacity = '0';
    branch.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      branch.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      branch.style.opacity = '1';
      branch.style.transform = 'translateX(0)';
    }, 300 + (index * 100));
  });
}

// ============================================
// SEED BANK CROSS-REFERENCE
// Interactive germination system
// ============================================

function initSeedBank() {
  const seedList = document.getElementById('seed-list');
  if (!seedList) return;
  
  const seeds = seedList.querySelectorAll('.seed-item');
  
  seeds.forEach((seed, index) => {
    seed.style.opacity = '0';
    seed.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
      seed.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      seed.style.opacity = '1';
      seed.style.transform = 'translateY(0)';
    }, 800 + (index * 120));
    
    const link = seed.querySelector('.seed-link');
    if (!link) return;
    
    link.addEventListener('mouseenter', () => {
      germinateNearbySeeds(seed);
    });
    
    link.addEventListener('click', (event) => {
      if (link.classList.contains('seed-new')) {
        event.preventDefault();
        createNewSeedConnection(link);
      }
    });
  });
}

function germinateNearbySeeds(hoveredSeed) {
  const siblings = hoveredSeed.parentElement.querySelectorAll('.seed-item');
  
  siblings.forEach(sibling => {
    if (sibling === hoveredSeed) return;
    
    const distance = Math.abs(
      Array.from(siblings).indexOf(sibling) - 
      Array.from(siblings).indexOf(hoveredSeed)
    );
    
    if (distance <= 2) {
      const delay = distance * 80;
      setTimeout(() => {
        sibling.style.transition = 'transform 0.3s ease';
        sibling.style.transform = 'translateX(4px)';
        
        setTimeout(() => {
          sibling.style.transform = 'translateX(0)';
        }, 300);
      }, delay);
    }
  });
}

function createNewSeedConnection(link) {
  const seedName = link.querySelector('.seed-name');
  if (!seedName) return;
  
  const originalText = seedName.textContent;
  seedName.textContent = 'Germinating...';
  
  const glyph = link.querySelector('.seed-glyph');
  if (glyph) {
    glyph.style.animation = 'seedPulse 0.5s ease-in-out infinite';
  }
  
  setTimeout(() => {
    seedName.textContent = 'Connection established!';
    link.style.borderColor = 'var(--photosynth-green)';
    
    setTimeout(() => {
      seedName.textContent = originalText;
      if (glyph) glyph.style.animation = '';
      link.style.borderColor = '';
    }, 2000);
  }, 1500);
}

// ============================================
// CITATION FORMATS
// Switch between mycelial, academic, seed packet
// ============================================

function initCitationFormats() {
  const formatButtons = document.querySelectorAll('.format-btn');
  const preview = document.getElementById('citation-preview');
  
  if (!preview) return;
  
  const codeBlock = preview.querySelector('.citation-code');
  if (!codeBlock) return;
  
  const formats = {
    mycelial: `@mycelial{verdant2047,
  title = {Photosynthetic Façades},
  codex = {living-technologies/photosynthetic-facades},
  germinated = {2047-03-15},
  cultivators = {247},
  health = {thriving}
}`,
    academic: `@article{verdant2047facades,
  author = {Collective, Verdant Codex},
  title = {Photosynthetic Façades: Building-Integrated Photosynthesis in Urban Ecosystems},
  journal = {Journal of Regenerative Architecture},
  year = {2047},
  volume = {12},
  pages = {45--67}
}`,
    seed: `SPECIES: photosynthetic-facades
ORIGIN: living-technologies
GERMINATED: 2047-03-15
CULTIVATORS: 247
YIELD: thriving
HARVEST: protein-feed, bioplastic-precursor
PROPAGATION: open-pollination`
  };
  
  formatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      formatButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const format = btn.getAttribute('data-format');
      if (formats[format]) {
        codeBlock.style.opacity = '0';
        
        setTimeout(() => {
          codeBlock.textContent = formats[format];
          codeBlock.style.opacity = '1';
        }, 200);
      }
    });
  });
}

// ============================================
// HEADER SCROLL BEHAVIOR
// ============================================

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScroll = 0;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > lastScroll && currentScroll > 200) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        
        if (currentScroll > 50) {
          header.style.boxShadow = '0 4px 20px rgba(13, 31, 13, 0.08)';
        } else {
          header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      event.preventDefault();
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      target.style.transition = 'background 0.6s ease';
      target.style.background = 'rgba(232, 197, 71, 0.08)';
      
      setTimeout(() => {
        target.style.background = '';
      }, 1500);
    });
  });
}

// ============================================
// ARTICLE ACTIONS
// Cultivate, graft, propagate interactions
// ============================================

function initArticleActions() {
  const cultivateBtn = document.querySelector('.cultivate-btn');
  const graftBtn = document.querySelector('.graft-btn');
  const propagateBtn = document.querySelector('.propagate-btn');
  
  if (cultivateBtn) {
    cultivateBtn.addEventListener('click', () => {
      const count = cultivateBtn.querySelector('data');
      if (count) {
        const currentValue = parseInt(count.value.replace(',', ''));
        const newValue = currentValue + 1;
        count.value = newValue;
        count.textContent = newValue.toLocaleString();
        
        animateButtonPulse(cultivateBtn);
        spawnParticleBurst(cultivateBtn);
      }
    });
  }
  
  if (graftBtn) {
    graftBtn.addEventListener('click', () => {
      animateButtonPulse(graftBtn);
      showToast('Grafted to your collection');
    });
  }
  
  if (propagateBtn) {
    propagateBtn.addEventListener('click', () => {
      animateButtonPulse(propagateBtn);
      showToast('Propagated to mycelial network');
    });
  }
}

function animateButtonPulse(button) {
  button.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }, 100);
}

function spawnParticleBurst(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 8px;
      height: 8px;
      background: var(--solar-gold, #e8c547);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10001;
    `;
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 40 + Math.random() * 20;
    const duration = 600 + Math.random() * 200;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
    ], {
      duration,
      easing: 'cubic-bezier(0, 0.9, 0.57, 1)'
    }).addEventListener('finish', () => particle.remove());
  }
}

function showToast(message) {
  const existing = document.querySelector('.verdant-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'verdant-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 28px;
    background: var(--deep-forest, #0d1f0d);
    color: var(--solar-gold, #e8c547);
    font-family: 'Cinzel Decorative', serif;
    font-size: 0.85rem;
    border-radius: 999px;
    border: 1px solid var(--moss-green, #3d6b3d);
    z-index: 10001;
    animation: toastRise 0.4s ease-out;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastFade 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============================================
// SEARCH GROWTH
// Expanding search interaction
// ============================================

function initSearchGrowth() {
  const searchForm = document.querySelector('.search-growth');
  const searchInput = searchForm?.querySelector('input');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('focus', () => {
    searchForm.style.transform = 'scale(1.02)';
    searchForm.style.transition = 'transform 0.3s ease';
  });
  
  searchInput.addEventListener('blur', () => {
    searchForm.style.transform = 'scale(1)';
  });
  
  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const query = searchInput.value.trim();
    if (!query) {
      searchInput.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        searchInput.style.animation = '';
      }, 500);
      return;
    }
    
    searchInput.disabled = true;
    searchInput.value = 'Searching mycelium...';
    
    setTimeout(() => {
      searchInput.value = query;
      searchInput.disabled = false;
      showToast(`Found in mycelial network: "${query}"`);
    }, 1200);
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const searchInput = document.querySelector('.search-growth input');
    if (searchInput && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
  }
  
  if (event.key === 'Escape') {
    const searchInput = document.querySelector('.search-growth input');
    if (searchInput && document.activeElement === searchInput) {
      searchInput.blur();
    }
  }
});

// ============================================
// PREFERS REDUCED MOTION
// ============================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}