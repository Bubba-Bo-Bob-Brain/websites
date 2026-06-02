/* ============================================
   THE GRIMOIRE OF REALMS - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Configuration ---
  const CONFIG = {
    runes: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛝ', 'ᛟ', '✦', '⚝', '☽', '✧', '⟡', '⊹'],
    runeCount: 15,
    particleSpeed: 12,
    scrollThreshold: 100,
    animationDuration: 1500,
    statBarDuration: 2000,
    ringAnimationDuration: 2000,
    currentPage: 1,
    totalPages: 3
  };

  // --- Utility Functions ---
  const utils = {
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
    
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomChoice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    animateCounter(element, target, duration = 2000) {
      const start = 0;
      const startTime = performance.now();
      
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easeProgress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    }
  };

  // --- Rune Particles System ---
  class RuneParticleSystem {
    constructor(container) {
      this.container = container;
      this.particles = [];
      this.init();
    }
    
    init() {
      for (let i = 0; i < CONFIG.runeCount; i++) {
        this.createParticle(i);
      }
    }
    
    createParticle(index) {
      const rune = document.createElement('div');
      rune.className = 'rune';
      rune.textContent = utils.randomChoice(CONFIG.runes);
      
      const left = utils.random(0, 100);
      const size = utils.random(0.8, 2);
      const duration = utils.random(10, 20);
      const delay = utils.random(0, 15);
      
      rune.style.left = `${left}%`;
      rune.style.fontSize = `${size}rem`;
      rune.style.animationDuration = `${duration}s`;
      rune.style.animationDelay = `${delay}s`;
      
      this.container.appendChild(rune);
      this.particles.push(rune);
    }
  }

  // --- Navigation Controller ---
  class NavigationController {
    constructor() {
      this.nav = document.getElementById('mainNav');
      this.links = document.querySelectorAll('.nav-link');
      this.sections = document.querySelectorAll('section[id]');
      this.mobileBtn = document.querySelector('.mobile-menu-btn');
      this.mobileMenu = document.querySelector('.nav-links');
      
      this.init();
    }
    
    init() {
      // Scroll behavior
      window.addEventListener('scroll', utils.debounce(() => this.handleScroll(), 100));
      
      // Link clicks
      this.links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
      
      // Mobile menu
      if (this.mobileBtn) {
        this.mobileBtn.addEventListener('click', () => this.toggleMobileMenu());
      }
      
      // Close mobile menu on resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && this.mobileMenu) {
          this.mobileMenu.style.display = 'flex';
        }
      });
    }
    
    handleScroll() {
      // Nav background on scroll
      if (window.scrollY > CONFIG.scrollThreshold) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
      
      // Active section highlighting
      let currentSection = '';
      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id');
        }
      });
      
      this.links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }
    
    toggleMobileMenu() {
      if (!this.mobileMenu) return;
      
      const isVisible = this.mobileMenu.style.display === 'flex';
      this.mobileMenu.style.display = isVisible ? 'none' : 'flex';
      
      // Animate hamburger
      const lines = this.mobileBtn.querySelectorAll('.menu-line');
      if (!isVisible) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    }
  }

  // --- Scroll Reveal Controller ---
  class ScrollRevealController {
    constructor() {
      this.elements = document.querySelectorAll('.reveal-text, .character-sheet, .quest-notice, .inv-slot:not(.empty), .spell-page, .lore-entry');
      this.init();
    }
    
    init() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      this.elements.forEach(el => observer.observe(el));
    }
  }

  // --- Character Sheet Controller ---
  class CharacterSheetController {
    constructor() {
      this.statBars = document.querySelectorAll('.stat-bar');
      this.rings = document.querySelectorAll('.stat-ring');
      this.expFill = document.querySelector('.exp-fill');
      this.counters = document.querySelectorAll('.stat-number');
      
      this.init();
    }
    
    init() {
      // Observe character section
      const characterSection = document.querySelector('.character-section');
      if (!characterSection) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStatBars();
            this.animateRings();
            this.animateExpBar();
            this.animateCounters();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(characterSection);
    }
    
    animateStatBars() {
      this.statBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.width = bar.style.getPropertyValue('--bar-width');
        }, index * 100);
      });
    }
    
    animateRings() {
      this.rings.forEach(ring => {
        const percent = parseInt(ring.dataset.percent);
        const circle = ring.querySelector('.ring-fill');
        const circumference = 2 * Math.PI * 45; // r=45
        const offset = circumference - (percent / 100) * circumference;
        
        setTimeout(() => {
          circle.style.strokeDashoffset = offset;
        }, 500);
      });
    }
    
    animateExpBar() {
      if (!this.expFill) return;
      const width = this.expFill.dataset.width;
      setTimeout(() => {
        this.expFill.style.width = `${width}%`;
      }, 600);
    }
    
    animateCounters() {
      this.counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        setTimeout(() => {
          utils.animateCounter(counter, target, CONFIG.animationDuration);
        }, 800);
      });
    }
  }

  // --- Spell Book Controller ---
  class SpellBookController {
    constructor() {
      this.currentPage = CONFIG.currentPage;
      this.totalPages = CONFIG.totalPages;
      this.pages = document.querySelectorAll('.spell-page');
      this.dots = document.querySelectorAll('.page-dot');
      this.prevBtn = document.querySelector('.prev-btn');
      this.nextBtn = document.querySelector('.next-btn');
      
      this.init();
    }
    
    init() {
      this.updateButtons();
      this.updateDots();
      
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prevPage());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.nextPage());
      }
      
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const page = parseInt(dot.dataset.page);
          this.goToPage(page);
        });
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        const spellBook = document.querySelector('.spells-section');
        if (!spellBook) return;
        
        const rect = spellBook.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          if (e.key === 'ArrowLeft') this.prevPage();
          if (e.key === 'ArrowRight') this.nextPage();
        }
      });
    }
    
    prevPage() {
      if (this.currentPage <= 1) return;
      
      const currentPageEl = this.pages[this.currentPage - 1];
      currentPageEl.classList.add('flipped');
      
      this.currentPage--;
      this.updateButtons();
      this.updateDots();
    }
    
    nextPage() {
      if (this.currentPage >= this.totalPages) return;
      
      this.currentPage++;
      const prevPageEl = this.pages[this.currentPage - 2];
      prevPageEl.classList.remove('flipped');
      
      this.updateButtons();
      this.updateDots();
    }
    
    goToPage(page) {
      if (page === this.currentPage) return;
      
      if (page > this.currentPage) {
        // Going forward
        for (let i = this.currentPage; i < page; i++) {
          setTimeout(() => this.nextPage(), (i - this.currentPage) * 100);
        }
      } else {
        // Going backward
        for (let i = this.currentPage; i > page; i--) {
          setTimeout(() => this.prevPage(), (this.currentPage - i) * 100);
        }
      }
    }
    
    updateButtons() {
      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentPage <= 1;
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentPage >= this.totalPages;
      }
    }
    
    updateDots() {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === this.currentPage);
      });
    }
  }

  // --- Inventory Tooltip Controller ---
  class InventoryController {
    constructor() {
      this.slots = document.querySelectorAll('.inv-slot:not(.empty)');
      this.init();
    }
    
    init() {
      this.slots.forEach(slot => {
        const tooltip = slot.querySelector('.slot-tooltip');
        if (!tooltip) return;
        
        slot.addEventListener('mouseenter', () => this.positionTooltip(slot, tooltip));
        slot.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
        });
        
        // Click animation
        slot.addEventListener('click', () => {
          slot.style.transform = 'scale(0.95)';
          setTimeout(() => {
            slot.style.transform = '';
          }, 150);
        });
      });
    }
    
    positionTooltip(slot, tooltip) {
      const slotRect = slot.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Position above the slot
      tooltip.style.bottom = `${slotRect.height + 10}px`;
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      
      // Keep within viewport
      const viewportWidth = window.innerWidth;
      const tooltipWidth = tooltipRect.width;
      const slotCenter = slotRect.left + slotRect.width / 2;
      
      if (slotCenter - tooltipWidth / 2 < 10) {
        tooltip.style.left = '0';
        tooltip.style.transform = 'none';
      } else if (slotCenter + tooltipWidth / 2 > viewportWidth - 10) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '0';
        tooltip.style.transform = 'none';
      }
      
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    }
  }

  // --- Ambient Effects ---
  class AmbientEffects {
    constructor() {
      this.heroSection = document.querySelector('.hero-section');
      this.init();
    }
    
    init() {
      // Parallax on hero
      if (this.heroSection) {
        window.addEventListener('scroll', utils.debounce(() => {
          const scrollY = window.scrollY;
          const heroContent = this.heroSection.querySelector('.hero-content');
          if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
          }
        }, 50));
      }
      
      // Subtle mouse tracking for glow effects
      document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
      });
    }
  }

  // --- Quest Board Effects ---
  class QuestBoardEffects {
    constructor() {
      this.notices = document.querySelectorAll('.quest-notice');
      this.init();
    }
    
    init() {
      this.notices.forEach((notice, index) => {
        // Add random slight rotation for organic feel
        const rotation = utils.random(-2, 2);
        notice.style.transform = `rotate(${rotation}deg)`;
        
        // Hover glow based on rarity
        const rarity = notice.dataset.rarity;
        if (rarity) {
          notice.addEventListener('mouseenter', () => {
            const colors = {
              legendary: 'rgba(255, 128, 0, 0.2)',
              epic: 'rgba(163, 53, 238, 0.2)',
              rare: 'rgba(0, 112, 221, 0.2)',
              uncommon: 'rgba(30, 255, 0, 0.2)',
              common: 'rgba(157, 157, 157, 0.2)'
            };
            notice.style.boxShadow = `0 0 30px ${colors[rarity] || 'transparent'}`;
          });
          
          notice.addEventListener('mouseleave', () => {
            notice.style.boxShadow = '2px 3px 10px rgba(0, 0, 0, 0.4)';
          });
        }
      });
    }
  }

  // --- Initialize Everything ---
  function init() {
    // Rune Particles
    const particleContainer = document.getElementById('rune-particles');
    if (particleContainer) {
      new RuneParticleSystem(particleContainer);
    }
    
    // Navigation
    new NavigationController();
    
    // Scroll Reveal
    new ScrollRevealController();
    
    // Character Sheet
    new CharacterSheetController();
    
    // Spell Book
    new SpellBookController();
    
    // Inventory
    new InventoryController();
    
    // Ambient Effects
    new AmbientEffects();
    
    // Quest Board
    new QuestBoardEffects();
    
    console.log('⚔ The Grimoire of Realms has been awakened.');
  }

  // Start the application
  init();
});