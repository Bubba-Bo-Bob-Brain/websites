/* ═══════════════════════════════════════════════════════════════
   THE COTTAGE WITCH'S GRIMOIRE — Scripts
   Interactive magic for the herbalist's recipe book
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for fonts to load before initializing
  if (document.fonts) {
    document.fonts.ready.then(initializeGrimoire);
  } else {
    // Fallback for browsers that don't support document.fonts
    window.addEventListener('load', initializeGrimoire);
  }
});

function initializeGrimoire() {
  // Initialize all components
  initLoadingScreen();
  initThemeToggle();
  initSeasonalWheel();
  initRecipeCards();
  initForagingTabs();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initFireflyInteraction();
  
  // Add a small delay to ensure all elements are ready
  setTimeout(() => {
    document.body.classList.add('grimoire-loaded');
  }, 100);
}


/* ═══════════════════════════════════════════════════════════════
   LOADING SCREEN
   ═══════════════════════════════════════════════════════════════ */

function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  if (!loadingScreen) return;
  
  // Hide loading screen after a delay
  setTimeout(() => {
    loadingScreen.classList.add('loaded');
    
    // Remove from DOM after transition completes
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 800);
  }, 2800); // Total loading time including bar animation
}


/* ═══════════════════════════════════════════════════════════════
   THEME TOGGLE — Moth & Candlelight Night Mode
   ═══════════════════════════════════════════════════════════════ */

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (!themeToggle) return;
  
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('grimoire-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply saved theme or system preference
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'night');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'night' ? 'day' : 'night';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('grimoire-theme', newTheme);
    
    // Add a little animation feedback
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 150);
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('grimoire-theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'night' : 'day');
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   SEASONAL INGREDIENT WHEEL
   ═══════════════════════════════════════════════════════════════ */

function initSeasonalWheel() {
  const wheel = document.getElementById('seasonal-wheel-interactive');
  const panelTitle = document.getElementById('panel-title');
  const panelSubtitle = document.getElementById('panel-subtitle');
  const ingredientList = document.getElementById('ingredient-list');
  
  if (!wheel || !panelTitle || !panelSubtitle || !ingredientList) return;
  
  const quadrants = wheel.querySelectorAll('.wheel-quadrant');
  
  // Seasonal ingredients data
  const seasonalData = {
    spring: {
      title: 'Spring Harvest',
      subtitle: 'Tender greens and early blossoms awaken',
      ingredients: [
        { icon: '🌱', name: 'Wild Garlic <em>(Allium ursinum)</em>', note: 'Woodland floors and stream banks' },
        { icon: '🍀', name: 'Stinging Nettle <em>(Urtica dioica)</em>', note: 'Top four leaves, before flowering' },
        { icon: '🌼', name: 'Dandelion Greens <em>(Taraxacum officinale)</em>', note: 'Young leaves, before flowers open' },
        { icon: '🌸', name: 'Elderflower <em>(Sambucus nigra)</em>', note: 'Flat-topped clusters, late May' },
        { icon: '🌿', name: 'Wild Chervil <em>(Anthriscus sylvestris)</em>', note: 'Shady hedgerows, sweet anise scent' }
      ],
      note: '"Spring whispers to those who listen with bare feet on cool earth."'
    },
    summer: {
      title: 'Summer Abundance',
      subtitle: 'Sun-warmed fruits and fragrant herbs',
      ingredients: [
        { icon: '🫐', name: 'Elderberries <em>(Sambucus nigra)</em>', note: 'Dark purple clusters, September' },
        { icon: '🍓', name: 'Wild Strawberry <em>(Fragaria vesca)</em>', note: 'Tiny jewels beneath bramble arches' },
        { icon: '🌿', name: 'Yarrow <em>(Achillea millefolium)</em>', note: 'White flower heads, dry meadows' },
        { icon: '🍃', name: 'Lemon Balm <em>(Melissa officinalis)</em>', note: 'Crush leaves for lemon scent' },
        { icon: '🌻', name: 'St. John\'s Wort <em>(Hypericum perforatum)</em>', note: 'Yellow flowers, pierce petals for red oil' }
      ],
      note: '"Gather when the sun is high and the bees are busy."'
    },
    autumn: {
      title: 'Autumn Preserves',
      subtitle: 'Roots, nuts, and the last of the berries',
      ingredients: [
        { icon: '🍄', name: 'Chanterelle <em>(Cantharellus cibarius)</em>', note: 'Golden trumpets, mossy woods' },
        { icon: '🌰', name: 'Hazelnuts <em>(Corylus avellana)</em>', note: 'Fall from fringed cups in September' },
        { icon: '🍂', name: 'Rosehips <em>(Rosa canina)</em>', note: 'After first frost, remove seeds' },
        { icon: '🫚', name: 'Burdock Root <em>(Arctium lappa)</em>', note: 'First year roots, dig deep' },
        { icon: '🍎', name: 'Crab Apples <em>(Malus sylvestris)</em>', note: 'Tart fruit for jellies and vinegars' }
      ],
      note: '"The earth offers its final gifts before the long sleep."'
    },
    winter: {
      title: 'Winter Wisdom',
      subtitle: 'Evergreen sustenance and deep roots',
      ingredients: [
        { icon: '🌲', name: 'Pine Needles <em>(Pinus sylvestris)</em>', note: 'Rich in vitamin C, make tea' },
        { icon: '🫚', name: 'Burdock Root <em>(Arctium lappa)</em>', note: 'Roasted as coffee substitute' },
        { icon: '❄️', name: 'Ivy Berries <em>(Hedera helix)</em>', note: 'External use only, sacred to birds' },
        { icon: '🌿', name: 'Rosemary <em>(Salvia rosmarinus)</em>', note: 'Evergreen, thrives in sheltered spots' },
        { icon: '🍃', name: 'Bay Leaves <em>(Laurus nobilis)</em>', note: 'Evergreen, aromatic leaves' }
      ],
      note: '"Even in the deepest frost, the earth remembers warmth."'
    }
  };
  
  // Add click handlers to each quadrant
  quadrants.forEach(quadrant => {
    quadrant.addEventListener('click', () => {
      const season = quadrant.dataset.season;
      const data = seasonalData[season];
      
      // Remove active class from all quadrants
      quadrants.forEach(q => q.classList.remove('active'));
      
      // Add active class to clicked quadrant
      quadrant.classList.add('active');
      
      // Update panel with animation
      updateIngredientPanel(data);
    });
  });
  
  function updateIngredientPanel(data) {
    // Fade out current content
    panelTitle.style.opacity = '0';
    panelSubtitle.style.opacity = '0';
    ingredientList.style.opacity = '0';
    
    setTimeout(() => {
      // Update content
      panelTitle.textContent = data.title;
      panelSubtitle.textContent = data.subtitle;
      
      // Clear and rebuild ingredient list
      ingredientList.innerHTML = '';
      
      data.ingredients.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        li.style.animationDelay = `${index * 0.1}s`;
        
        li.innerHTML = `
          <span class="ingredient-icon">${item.icon}</span>
          <div class="ingredient-name">
            <strong>${item.name}</strong>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 2px;">
              ${item.note}
            </div>
          </div>
        `;
        
        ingredientList.appendChild(li);
      });
      
      // Update note
      const noteElement = document.getElementById('panel-note').querySelector('.note-text');
      noteElement.textContent = data.note;
      
      // Fade in new content
      panelTitle.style.opacity = '1';
      panelSubtitle.style.opacity = '1';
      ingredientList.style.opacity = '1';
      
      // Add transition styles
      panelTitle.style.transition = 'opacity 0.4s ease';
      panelSubtitle.style.transition = 'opacity 0.4s ease 0.1s';
      ingredientList.style.transition = 'opacity 0.4s ease 0.2s';
    }, 300);
  }
}


/* ═══════════════════════════════════════════════════════════════
   RECIPE CARDS — Expand/Collapse
   ═══════════════════════════════════════════════════════════════ */

function initRecipeCards() {
  const recipeButtons = document.querySelectorAll('.recipe-toggle-btn');
  
  recipeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const targetId = button.getAttribute('aria-controls');
      const targetElement = document.getElementById(targetId);
      const icon = button.querySelector('.btn-icon');
      
      if (!targetElement) return;
      
      // Toggle visibility
      if (expanded) {
        targetElement.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        icon.textContent = '▾';
      } else {
        targetElement.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        icon.textContent = '▴';
        
        // Smooth scroll to recipe content
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest'
          });
        }, 100);
      }
      
      // Add a little bounce animation to the button
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   FORAGING GUIDES — Season Tabs
   ═══════════════════════════════════════════════════════════════ */

function initForagingTabs() {
  const tabs = document.querySelectorAll('.foraging-tab');
  const panels = document.querySelectorAll('.foraging-panel');
  
  if (tabs.length === 0 || panels.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      
      if (!targetPanel) return;
      
      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('foraging-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      
      tab.classList.add('foraging-tab--active');
      tab.setAttribute('aria-selected', 'true');
      
      // Update panel visibility with animation
      panels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('foraging-panel--active');
      });
      
      // Show target panel with fade animation
      targetPanel.style.display = 'block';
      targetPanel.classList.add('foraging-panel--active');
      
      // Add animation class
      targetPanel.style.animation = 'none';
      targetPanel.offsetHeight; // Trigger reflow
      targetPanel.style.animation = 'panel-fade 0.4s ease forwards';
    });
  });
  
  // Initialize first tab as active if none are
  const activeTab = document.querySelector('.foraging-tab--active');
  if (!activeTab && tabs.length > 0) {
    tabs[0].click();
  }
}


/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.intro-card, .potion-card, .flower-card, .remedy-page, .forage-item, .wheel-section, .flowers-section, .foraging-section, .remedies-section'
  );
  
  if (revealElements.length === 0) return;
  
  // Add reveal class to elements
  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    el.classList.add(`reveal-delay-${(index % 4) + 1}`);
  });
  
  // Create intersection observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all reveal elements
  revealElements.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
   ═══════════════════════════════════════════════════════════════ */

function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  if (!backToTop) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  // Smooth scroll to top
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Add a little animation
    backToTop.style.transform = 'translateY(-5px)';
    setTimeout(() => {
      backToTop.style.transform = '';
    }, 300);
  });
}


/* ═══════════════════════════════════════════════════════════════
   SMOOTH SCROLL FOR NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      // Calculate offset for sticky navigation
      const navHeight = document.querySelector('.seasonal-nav')?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, targetId);
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   FIREFLY INTERACTION (Easter Egg)
   ═══════════════════════════════════════════════════════════════ */

function initFireflyInteraction() {
  const header = document.querySelector('.grimoire-header');
  if (!header) return;
  
  // Create extra fireflies on click
  header.addEventListener('click', (e) => {
    // Don't trigger if clicking on a link or button
    if (e.target.closest('a, button')) return;
    
    // Create temporary firefly at click position
    const rect = header.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const firefly = document.createElement('span');
    firefly.className = 'firefly temporary-firefly';
    firefly.style.left = `${x}px`;
    firefly.style.top = `${y}px`;
    firefly.style.animation = 'firefly-drift 4s ease-in-out forwards';
    
    header.appendChild(firefly);
    
    // Remove after animation completes
    setTimeout(() => {
      if (firefly.parentNode) {
        firefly.parentNode.removeChild(firefly);
      }
    }, 4000);
  });
}


/* ═══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = false) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for performance-critical events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Add some magic to the console
console.log(`
%c🌿 The Cottage Witch's Grimoire 🌿
%cA whimsical herbalist's recipe book
%cBest viewed by candlelight with a warm cup of something soothing.

%c~ Elara Mosswood, Cottage Witch
  Est. Harvest Moon, 1847
`, 
'color: #5A7247; font-size: 20px; font-family: serif;',
'color: #B8860B; font-size: 14px; font-family: serif;',
'color: #8B7355; font-size: 12px; font-family: serif; font-style: italic;',
'color: #8B6BAE; font-size: 11px; font-family: cursive;'
);