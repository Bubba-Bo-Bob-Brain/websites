document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('globalLoader');
  const appContainer = document.getElementById('appContainer');
  const solarDisc = document.getElementById('solarDisc');
  const solarLabel = document.getElementById('solarLabel');
  const sunlightOverlay = document.getElementById('sunlightOverlay');
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('primaryNavList');
  const seedChips = document.querySelectorAll('.seed-chip');
  const body = document.body;

  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 600);
    });
  }

  function updateSolarPosition() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    const dawnStart = 5 * 60;
    const noonTime = 12 * 60;
    const duskEnd = 20 * 60;
    
    let percentage;
    let theme;
    let label;
    
    if (totalMinutes < dawnStart) {
      percentage = 0.05;
      theme = 'theme-night';
      label = 'night rest';
    } else if (totalMinutes < noonTime) {
      percentage = (totalMinutes - dawnStart) / (noonTime - dawnStart);
      theme = 'theme-dawn';
      label = 'morning light';
      if (percentage > 0.5) theme = 'theme-noon';
    } else if (totalMinutes < duskEnd) {
      percentage = 1 - (totalMinutes - noonTime) / (duskEnd - noonTime);
      theme = 'theme-noon';
      label = 'afternoon glow';
      if (percentage < 0.4) {
        theme = 'theme-dusk';
        label = 'golden hour';
      }
    } else {
      percentage = 0.05;
      theme = 'theme-night';
      label = 'night rest';
    }
    
    const leftPosition = 4 + (percentage * 32);
    if (solarDisc) {
      solarDisc.style.left = `${leftPosition}px`;
    }
    
    if (solarLabel) {
      solarLabel.textContent = label;
    }
    
    body.className = '';
    body.classList.add(theme);
    
    if (sunlightOverlay) {
      if (theme === 'theme-night') {
        sunlightOverlay.style.opacity = '0';
      } else if (theme === 'theme-dusk') {
        sunlightOverlay.style.opacity = '0.5';
      } else {
        sunlightOverlay.style.opacity = '1';
      }
    }
  }

  updateSolarPosition();
  setInterval(updateSolarPosition, 60000);

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      
      if (!expanded) {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.top = '100%';
        navList.style.left = '0';
        navList.style.width = '100%';
        navList.style.background = 'rgba(245, 242, 232, 0.95)';
        navList.style.padding = '1rem';
        navList.style.backdropFilter = 'blur(12px)';
      } else {
        navList.style.display = 'none';
      }
    });
  }

  function handleSeedClick(event) {
    const seed = event.target;
    const seedName = seed.textContent.trim();
    seed.style.transform = 'scale(1.1)';
    seed.style.background = '#b3443e';
    setTimeout(() => {
      seed.style.transform = '';
      seed.style.background = '';
    }, 300);
    
    const infobox = document.querySelector('.wiki-infobox');
    if (infobox) {
      const relatedRow = infobox.querySelector('.infobox-row:last-child .infobox-value');
      if (relatedRow) {
        const existingLink = relatedRow.querySelector('a');
        if (!existingLink || existingLink.textContent !== seedName) {
          const newLink = document.createElement('a');
          newLink.href = '#';
          newLink.textContent = seedName;
          relatedRow.innerHTML = '';
          relatedRow.appendChild(newLink);
        }
      }
    }
  }

  seedChips.forEach(chip => {
    chip.addEventListener('click', handleSeedClick);
  });

  const allInternalLinks = document.querySelectorAll('a[href="#"]');
  allInternalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const randomArticles = [
        'Mycelium Insulation',
        'Rainwater Harvesting',
        'Community Wind',
        'Rewilded Riverbeds',
        'Solar Dehydrator'
      ];
      const randomChoice = randomArticles[Math.floor(Math.random() * randomArticles.length)];
      const titleElement = document.querySelector('.article-title');
      if (titleElement) {
        titleElement.textContent = randomChoice;
        titleElement.style.opacity = '0';
        titleElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          titleElement.style.opacity = '1';
        }, 100);
      }
      
      const leadParagraph = document.querySelector('.lead-paragraph');
      if (leadParagraph) {
        leadParagraph.textContent = `A collaborative entry on ${randomChoice.toLowerCase()}, detailing regenerative practices and open-source designs. This document is continuously updated by community stewards.`;
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      const titleElement = document.querySelector('.article-title');
      if (titleElement) {
        titleElement.textContent = 'Photosynthetic Panels';
      }
      const leadParagraph = document.querySelector('.lead-paragraph');
      if (leadParagraph) {
        leadParagraph.textContent = 'Photosynthetic panels mimic the light-harvesting strategies of shade-tolerant forest understory plants. By embedding thylakoid-inspired proteins within a cellulose nanocrystal matrix, these panels convert diffuse sunlight into electricity while remaining fully biodegradable at end-of-life.';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const icon = item.querySelector('.placeholder-icon');
      if (icon) {
        const originalIcon = icon.textContent;
        icon.textContent = '❋';
        icon.style.transform = 'scale(1.4)';
        icon.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          icon.textContent = originalIcon;
          icon.style.transform = 'scale(1)';
        }, 600);
      }
    });
  });

  const sidebarTreeLinks = document.querySelectorAll('.tree-link, .tree-sub-link');
  sidebarTreeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const activeItems = document.querySelectorAll('.tree-item.active');
      activeItems.forEach(item => item.classList.remove('active'));
      
      const parentItem = link.closest('.tree-item');
      if (parentItem) {
        parentItem.classList.add('active');
      }
      
      const titleElement = document.querySelector('.article-title');
      if (titleElement) {
        titleElement.textContent = link.textContent.trim();
        titleElement.style.opacity = '0';
        titleElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          titleElement.style.opacity = '1';
        }, 100);
      }
    });
  });

  const discussionItems = document.querySelectorAll('.discussion-item');
  discussionItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = 'rgba(240, 235, 215, 0.6)';
      item.style.paddingLeft = '0.6rem';
      item.style.transition = 'all 0.3s ease';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '';
      item.style.paddingLeft = '';
    });
  });

  const noteCard = document.querySelector('.note-card');
  if (noteCard) {
    noteCard.addEventListener('click', () => {
      const noteText = noteCard.querySelector('.note-text');
      const noteAuthor = noteCard.querySelector('.note-author');
      const originalText = noteText.textContent;
      const originalAuthor = noteAuthor.textContent;
      
      noteText.textContent = '“Thanks for the tip! Added to the field guide.”';
      noteAuthor.textContent = '— You, just now';
      noteCard.style.background = 'rgba(179, 68, 62, 0.1)';
      
      setTimeout(() => {
        noteText.textContent = originalText;
        noteAuthor.textContent = originalAuthor;
        noteCard.style.background = '';
      }, 2500);
    });
  }

  const articleBody = document.querySelector('.article-body');
  if (articleBody) {
    const paragraphs = articleBody.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(8px)';
      p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      setTimeout(() => {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, 100 + index * 80);
    });
  }
});