document.addEventListener('DOMContentLoaded', () => {
  const cursorGlow = document.getElementById('cursor-glow');
  const spellbookModal = document.getElementById('spellbook-modal');
  const closeSpellbookBtn = document.getElementById('close-spellbook');
  const characterPanel = document.getElementById('character-panel');
  const questCards = document.querySelectorAll('.quest-card');
  const inventorySlots = document.querySelectorAll('.inv-slot');
  const spellbookPages = document.querySelectorAll('.spellbook-page');

  let mouseX = 0;
  let mouseY = 0;
  let glowVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorGlow) {
      cursorGlow.style.left = mouseX + 'px';
      cursorGlow.style.top = mouseY + 'px';
    }
    if (!glowVisible) {
      cursorGlow.style.opacity = '1';
      glowVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (cursorGlow) {
      cursorGlow.style.opacity = '0';
      glowVisible = false;
    }
  });

  document.addEventListener('mouseenter', () => {
    if (cursorGlow) {
      cursorGlow.style.opacity = '1';
      glowVisible = true;
    }
  });

  if (characterPanel) {
    characterPanel.addEventListener('click', () => {
      spellbookModal.classList.add('visible');
    });
  }

  if (closeSpellbookBtn) {
    closeSpellbookBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      spellbookModal.classList.remove('visible');
    });
  }

  if (spellbookModal) {
    spellbookModal.addEventListener('click', (e) => {
      if (e.target === spellbookModal) {
        spellbookModal.classList.remove('visible');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spellbookModal.classList.contains('visible')) {
      spellbookModal.classList.remove('visible');
    }
  });

  questCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('quest-accept')) {
        const questTitle = card.querySelector('.quest-title').innerText;
        card.style.transition = 'all 0.4s ease';
        card.style.transform = 'scale(0.95)';
        card.style.borderColor = '#c9a84c';
        card.style.boxShadow = '0 0 20px rgba(201, 168, 76, 0.7)';
        
        const acceptBtn = card.querySelector('.quest-accept');
        const originalText = acceptBtn.innerText;
        acceptBtn.innerText = 'Quest Accepted!';
        acceptBtn.style.background = '#4a7c59';
        
        setTimeout(() => {
          card.style.transform = 'scale(1)';
          acceptBtn.innerText = originalText;
          acceptBtn.style.background = '';
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }, 1500);

        const pinnedCard = document.querySelector('.quest-card.pinned');
        if (pinnedCard && pinnedCard !== card) {
          pinnedCard.classList.remove('pinned');
          const pin = pinnedCard.querySelector('.quest-pin');
          if (pin) pin.remove();
        }
        
        if (!card.classList.contains('pinned')) {
          card.classList.add('pinned');
          if (!card.querySelector('.quest-pin')) {
            const pinElement = document.createElement('div');
            pinElement.classList.add('quest-pin');
            card.appendChild(pinElement);
          }
        }
      }
    });

    card.addEventListener('mouseenter', () => {
      const difficultyEl = card.querySelector('.quest-difficulty');
      if (difficultyEl) {
        difficultyEl.style.transition = 'transform 0.2s';
        difficultyEl.style.transform = 'scale(1.1)';
      }
    });

    card.addEventListener('mouseleave', () => {
      const difficultyEl = card.querySelector('.quest-difficulty');
      if (difficultyEl) {
        difficultyEl.style.transform = 'scale(1)';
      }
    });
  });

  inventorySlots.forEach(slot => {
    if (slot.classList.contains('empty')) return;

    slot.addEventListener('click', () => {
      const itemName = slot.getAttribute('data-item');
      if (!itemName) return;

      slot.style.transition = 'all 0.15s ease';
      slot.style.transform = 'scale(0.9)';
      slot.style.borderColor = '#c9a84c';
      slot.style.boxShadow = '0 0 16px rgba(201, 168, 76, 0.8)';

      setTimeout(() => {
        slot.style.transform = 'scale(1.04)';
        slot.style.borderColor = '';
        slot.style.boxShadow = '';
      }, 200);
    });

    slot.addEventListener('mouseenter', () => {
      const icon = slot.querySelector('.item-icon');
      if (icon) {
        icon.style.transition = 'transform 0.3s';
        icon.style.transform = 'rotate(-8deg) scale(1.2)';
      }
    });

    slot.addEventListener('mouseleave', () => {
      const icon = slot.querySelector('.item-icon');
      if (icon) {
        icon.style.transform = 'rotate(0deg) scale(1)';
      }
    });
  });

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = link.parentElement;
      
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      parentItem.classList.add('active');
      
      link.style.transition = 'all 0.15s';
      link.style.transform = 'scale(0.92)';
      setTimeout(() => {
        link.style.transform = 'scale(1)';
      }, 150);
    });
  });

  if (spellbookPages.length >= 2) {
    const page1 = spellbookPages[0];
    const page2 = spellbookPages[1];
    
    let currentPage = 0;
    
    const flipPage = () => {
      if (currentPage === 0) {
        page1.style.transition = 'transform 0.5s ease, opacity 0.3s';
        page2.style.transition = 'transform 0.5s ease, opacity 0.3s';
        page1.style.transform = 'rotateY(-15deg) translateX(-10px)';
        page1.style.opacity = '0.6';
        page2.style.transform = 'rotateY(0deg) translateX(0)';
        page2.style.opacity = '1';
        currentPage = 1;
      } else {
        page1.style.transition = 'transform 0.5s ease, opacity 0.3s';
        page2.style.transition = 'transform 0.5s ease, opacity 0.3s';
        page1.style.transform = 'rotateY(0deg) translateX(0)';
        page1.style.opacity = '1';
        page2.style.transform = 'rotateY(15deg) translateX(10px)';
        page2.style.opacity = '0.6';
        currentPage = 0;
      }
    };

    const spellbookRight = document.querySelector('.spellbook-right');
    if (spellbookRight) {
      spellbookRight.addEventListener('click', (e) => {
        if (e.target.closest('.close-spellbook')) return;
        flipPage();
      });
    }

    spellbookPages.forEach(page => {
      page.style.transformOrigin = 'left center';
      page.style.cursor = 'pointer';
    });
  }

  const titleElement = document.querySelector('.main-title');
  if (titleElement) {
    const text = titleElement.innerText;
    titleElement.innerText = '';
    
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(15px)';
      span.style.transition = `all 0.4s ease ${index * 0.05}s`;
      titleElement.appendChild(span);
    });

    setTimeout(() => {
      titleElement.querySelectorAll('span').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    }, 200);
  }

  const panels = document.querySelectorAll('.panel');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  panels.forEach(panel => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(30px)';
    panel.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(panel);
  });

  setTimeout(() => {
    panels.forEach(panel => {
      if (panel.getBoundingClientRect().top < window.innerHeight) {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }
    });
  }, 100);

  const statBars = document.querySelectorAll('.stat-bar');
  statBars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    bar.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 400);
  });
});