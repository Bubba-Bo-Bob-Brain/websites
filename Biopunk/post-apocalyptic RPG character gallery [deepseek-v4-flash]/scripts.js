/* ===== scripts.js – BIO·WASTE coven gallery ===== */
/* mutation pulse · faction highlight · dna flicker · survival tooltip */

(function() {
  'use strict';

  // ----- DOM refs -----
  const cards = document.querySelectorAll('.char-card');
  const dnaStrands = document.querySelectorAll('.dna-strand');
  const galleryGrid = document.getElementById('galleryGrid');

  // ----- 1. mutation badge low/high dynamic update (extra flair) -----
  cards.forEach(card => {
    const badge = card.querySelector('.mutation-badge');
    const mutValue = parseFloat(card.dataset.mutation) || 0;
    if (badge) {
      // already styled via CSS, but we add a subtle data attribute for js fun
      badge.dataset.mut = mutValue;
      // extra: if mutation > 90, add a pulsing class
      if (mutValue > 90) {
        badge.classList.add('mut-critical');
      } else if (mutValue < 40) {
        badge.classList.add('mut-stable');
      }
    }
  });

  // ----- 2. faction highlight on hover (card border glow enhancement) -----
  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const faction = this.dataset.faction || 'unknown';
      // we already have css border colors, but we can add a data attribute for debugging
      this.dataset.activeFaction = faction;
    });
    card.addEventListener('mouseleave', function() {
      delete this.dataset.activeFaction;
    });
  });

  // ----- 3. dna strand idle animation: random tiny flicker (pixel perfect) -----
  function flickerDna() {
    dnaStrands.forEach(strand => {
      const helixes = strand.querySelectorAll('.helix');
      helixes.forEach((helix, index) => {
        // randomly change opacity for 1-2 helixes per strand
        if (Math.random() < 0.08) {
          const originalOpacity = window.getComputedStyle(helix).opacity;
          helix.style.transition = 'opacity 0.08s';
          helix.style.opacity = '0.3';
          setTimeout(() => {
            helix.style.opacity = originalOpacity || '0.6';
          }, 80 + Math.random() * 40);
        }
      });
    });
  }
  // run flicker every 2.5 seconds (gives organic feel)
  setInterval(flickerDna, 2500);

  // also trigger flicker on card hover for extra connection
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // subtle flicker wave on dna strands
      dnaStrands.forEach(strand => {
        const helixes = strand.querySelectorAll('.helix');
        helixes.forEach((helix, idx) => {
          setTimeout(() => {
            helix.style.transition = 'opacity 0.1s, transform 0.15s';
            helix.style.opacity = '0.2';
            helix.style.transform = 'scaleY(1.8)';
            setTimeout(() => {
              helix.style.opacity = '';
              helix.style.transform = '';
            }, 120);
          }, idx * 30);
        });
      });
    });
  });

  // ----- 4. survival skill breakdown: click on survival stat shows detail (tooltip-like) -----
  cards.forEach(card => {
    const survivalStat = card.querySelector('.stat.survival');
    if (!survivalStat) return;

    survivalStat.addEventListener('click', function(e) {
      e.stopPropagation();
      // remove any existing custom tooltip
      const existing = card.querySelector('.survival-tooltip');
      if (existing) {
        existing.remove();
        return;
      }

      // extract survival value
      const text = this.textContent.trim();
      const match = text.match(/(\d+)\/10/);
      if (!match) return;
      const value = parseInt(match[1], 10);

      // build breakdown
      const breakdown = {
        'Scavenging': Math.min(10, value + 2),
        'Combat': Math.min(10, value + 1),
        'Mutation resistance': Math.min(10, 10 - value + 2),
        'Stealth': Math.min(10, value - 1 > 0 ? value - 1 : 1),
        'Tech': Math.min(10, value + 0)
      };

      const tooltip = document.createElement('div');
      tooltip.className = 'survival-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #0e0f0c;
        border: 1px solid var(--border-glow, #b5e853);
        padding: 0.8rem 1.2rem;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #e3f0d6;
        z-index: 50;
        width: 180px;
        box-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 0 1px #4a5c2e;
        pointer-events: none;
        white-space: nowrap;
      `;
      tooltip.innerHTML = '<div style="border-bottom:1px dashed #4a5c2e; margin-bottom:0.4rem; font-weight:bold;">⚡ survival breakdown</div>' +
        Object.entries(breakdown).map(([skill, val]) => {
          const bar = '█'.repeat(val) + '░'.repeat(10 - val);
          return `<div style="display:flex;justify-content:space-between;gap:0.5rem;"><span>${skill}</span><span style="color:${val > 5 ? '#b5e853' : '#e03060'};">${bar}</span></div>`;
        }).join('');

      // position relative to card content
      const content = card.querySelector('.card-content');
      if (content) {
        content.style.position = 'relative';
        content.appendChild(tooltip);
      }

      // remove on any click outside
      const removeTooltip = (ev) => {
        if (!tooltip.contains(ev.target) && ev.target !== survivalStat) {
          tooltip.remove();
          document.removeEventListener('click', removeTooltip);
        }
      };
      setTimeout(() => document.addEventListener('click', removeTooltip), 10);
    });
  });

  // ----- 5. bio-contamination animated pulse on high values (extra visual) -----
  cards.forEach(card => {
    const contamStat = card.querySelector('.stat.bio-contam');
    if (!contamStat) return;
    const contamText = contamStat.textContent || '';
    const contamMatch = contamText.match(/(\d+)%/);
    if (!contamMatch) return;
    const contamValue = parseInt(contamMatch[1], 10);
    if (contamValue > 70) {
      contamStat.style.animation = 'contamPulse 2s ease-in-out infinite';
      // inject keyframes if not already present
      if (!document.getElementById('contamKeyframes')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'contamKeyframes';
        styleSheet.textContent = `
          @keyframes contamPulse {
            0%, 100% { color: #f0c060; text-shadow: 0 0 2px rgba(240,192,96,0.2); }
            50% { color: #e03060; text-shadow: 0 0 8px rgba(224,48,96,0.6); }
          }
        `;
        document.head.appendChild(styleSheet);
      }
    }
  });

  // ----- 6. pixel-perfect grid sort by mutation (extra interactive) -----
  // double-click on title sorts cards by mutation (just for fun)
  const title = document.querySelector('.bio-title');
  if (title) {
    title.addEventListener('dblclick', function(e) {
      e.preventDefault();
      const cardsArray = Array.from(cards);
      const sorted = cardsArray.sort((a, b) => {
        const mutA = parseFloat(a.dataset.mutation) || 0;
        const mutB = parseFloat(b.dataset.mutation) || 0;
        return mutB - mutA; // descending: highest mutation first
      });
      // reorder in DOM
      sorted.forEach(card => galleryGrid.appendChild(card));
      // flash effect
      this.style.textShadow = '0 0 20px #b5e853, 0 0 40px #b5e853';
      setTimeout(() => {
        this.style.textShadow = '';
      }, 400);
    });
  }

  // ----- 7. initialize: small random delay on card load for staggered feel -----
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + index * 60);
  });

  // expose some functions for console exploration (optional)
  window.__biopunk = {
    cards,
    flickerDna,
    sortByMutation: () => {
      const sorted = Array.from(cards).sort((a, b) => (parseFloat(b.dataset.mutation)||0) - (parseFloat(a.dataset.mutation)||0));
      sorted.forEach(c => galleryGrid.appendChild(c));
    }
  };

  console.log('☣️ BIO·WASTE gallery loaded · mutation samples active');
})();