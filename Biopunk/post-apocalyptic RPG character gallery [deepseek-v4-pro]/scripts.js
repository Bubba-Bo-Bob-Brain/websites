document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const characterCards = document.querySelectorAll('.character-card');
  const statBars = document.querySelectorAll('.stat-bar-fill');

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  };

  const animateBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bars = card.querySelectorAll('.stat-bar-fill');
        bars.forEach(bar => {
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 120);
        });
        observer.unobserve(card);
      }
    });
  };

  const barObserver = new IntersectionObserver(animateBars, observerOptions);
  characterCards.forEach(card => barObserver.observe(card));

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      characterCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'cardFadeIn 0.4s ease forwards';
          
          const bars = card.querySelectorAll('.stat-bar-fill');
          bars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = originalWidth;
            }, 80);
          });
        } else {
          card.style.animation = 'cardFadeOut 0.25s ease forwards';
          card.addEventListener('animationend', function hideCard() {
            if (card.style.animation === 'cardFadeOut 0.25s ease forwards') {
              card.style.display = 'none';
            }
            card.removeEventListener('animationend', hideCard);
          });
        }
      });
    });
  });

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes cardFadeIn {
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardFadeOut {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.96); }
    }
  `;
  document.head.appendChild(styleSheet);

  const cards = document.querySelectorAll('.character-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const mutationLevel = card.getAttribute('data-mutation');
      const contamination = card.getAttribute('data-contamination');
      
      const tooltip = document.createElement('div');
      tooltip.className = 'bio-tooltip';
      tooltip.innerHTML = `
        <span class="tooltip-mutation">MUT: ${mutationLevel}%</span>
        <span class="tooltip-contamination">CONT: ${contamination}%</span>
      `;
      tooltip.style.position = 'absolute';
      tooltip.style.bottom = '15px';
      tooltip.style.left = '15px';
      tooltip.style.background = 'rgba(10,12,10,0.95)';
      tooltip.style.border = '1px solid var(--toxic-green)';
      tooltip.style.padding = '0.4rem 0.7rem';
      tooltip.style.fontFamily = 'Share Tech Mono, monospace';
      tooltip.style.fontSize = '0.7rem';
      tooltip.style.color = '#33ff33';
      tooltip.style.zIndex = '20';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.letterSpacing = '0.05rem';
      tooltip.style.boxShadow = '0 0 18px rgba(51,255,51,0.3)';
      tooltip.classList.add('tooltip-active');
      
      card.style.position = 'relative';
      card.appendChild(tooltip);
    });

    card.addEventListener('mouseleave', () => {
      const tooltip = card.querySelector('.bio-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });

  const dnaStrand = document.querySelector('.footer-dna-strand');
  if (dnaStrand) {
    const basePairs = dnaStrand.querySelectorAll('.base-pair');
    basePairs.forEach((pair, index) => {
      pair.style.animation = `baseGlow 2s ${index * 0.2}s infinite alternate`;
    });
  }

  const additionalStyles = document.createElement('style');
  additionalStyles.textContent = `
    @keyframes baseGlow {
      0% { text-shadow: 0 0 4px #33ff33; }
      100% { text-shadow: 0 0 14px #b44dff, 0 0 25px #33ff33; }
    }
    .tooltip-active {
      animation: tooltipSlide 0.2s ease-out;
    }
    @keyframes tooltipSlide {
      0% { opacity: 0; transform: translateY(6px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(additionalStyles);

  const headerTitle = document.querySelector('.site-title');
  if (headerTitle) {
    headerTitle.addEventListener('mouseover', () => {
      headerTitle.style.textShadow = '0 0 20px #33ff33, 0 0 45px #b44dff, 3px 3px 0 #000';
    });
    headerTitle.addEventListener('mouseleave', () => {
      headerTitle.style.textShadow = '0 0 10px #33ff33, 0 0 40px rgba(51,255,51,0.4)';
    });
  }

  const allCards = document.querySelectorAll('.character-card');
  const randomGlitch = () => {
    const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
    if (randomCard && randomCard.style.display !== 'none') {
      randomCard.style.transition = '0.08s ease';
      randomCard.style.transform = 'translate(2px, -1px)';
      randomCard.style.borderColor = '#b44dff';
      setTimeout(() => {
        randomCard.style.transform = '';
        randomCard.style.borderColor = '';
      }, 100);
    }
  };

  setInterval(() => {
    if (Math.random() > 0.7) {
      randomGlitch();
    }
  }, 2800);
});