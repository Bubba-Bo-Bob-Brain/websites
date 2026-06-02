document.addEventListener('DOMContentLoaded', function () {
  const sanityFill = document.getElementById('sanity-fill');
  const sanityWarning = document.getElementById('sanity-warning');
  const catalogGrid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('archive-search');
  const searchResultsPool = document.getElementById('search-results-pool');
  const modalPortal = document.getElementById('modal-portal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const archiveEntries = document.querySelectorAll('.archive-card');
  const corruptTexts = document.querySelectorAll('.corrupt-text');
  const deepTrigger = document.getElementById('deep-scroll-trigger');

  let sanityLevel = 100;
  let scrollDepthMax = 0;
  const totalDocumentHeight = () => document.body.scrollHeight - window.innerHeight;

  function updateSanity(amount) {
    sanityLevel = Math.max(0, Math.min(100, sanityLevel + amount));
    sanityFill.style.width = sanityLevel + '%';

    if (sanityLevel < 30) {
      sanityWarning.style.opacity = '1';
      sanityWarning.textContent = 'They are watching you';
    } else if (sanityLevel < 60) {
      sanityWarning.style.opacity = '0.7';
      sanityWarning.textContent = 'Reality is thinning';
    } else {
      sanityWarning.style.opacity = '0';
    }
  }

  function handleScrollSanity() {
    const scrollY = window.scrollY;
    const maxScroll = totalDocumentHeight();
    if (maxScroll <= 0) return;

    const scrollPercent = Math.min(100, (scrollY / maxScroll) * 100);
    if (scrollPercent > scrollDepthMax) {
      const diff = scrollPercent - scrollDepthMax;
      scrollDepthMax = scrollPercent;
      updateSanity(-diff * 0.25);
    }
  }

  window.addEventListener('scroll', handleScrollSanity, { passive: true });

  function corruptTextOnHover(element) {
    const original = element.getAttribute('data-original') || element.textContent;
    element.addEventListener('mouseenter', function () {
      let iterations = 0;
      const interval = setInterval(() => {
        element.textContent = original.split('').map((char, idx) => {
          if (idx < iterations) return original[idx];
          return String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }).join('');
        iterations += 1/2;
        if (iterations >= original.length) {
          clearInterval(interval);
          element.textContent = original;
        }
      }, 30);
    });
  }

  corruptTexts.forEach(corruptTextOnHover);

  const disturbingResults = [
    { title: 'The Skinless Gospel', excerpt: 'A book bound in something warm. Pages turn themselves.' },
    { title: 'Void Lullaby', excerpt: 'A melody that erases the listener’s name from all records.' },
    { title: 'The Crawling Chaos', excerpt: 'Nyarlathotep’s visiting card. It has your address.' },
    { title: 'Starving Heaven', excerpt: 'Coordinates to a place where gods go to die.' },
    { title: 'The Yellow Sign', excerpt: 'A play that writes its own audience into the third act.' }
  ];

  function performSearch(query) {
    searchResultsPool.innerHTML = '';
    if (!query.trim()) {
      searchResultsPool.style.display = 'none';
      return;
    }

    const filtered = disturbingResults.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      const noResult = document.createElement('div');
      noResult.className = 'search-result-item';
      noResult.style.padding = '12px';
      noResult.style.color = '#8c7b6b';
      noResult.textContent = 'No records found. The archive rejects your query.';
      searchResultsPool.appendChild(noResult);
    } else {
      filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.style.padding = '12px 18px';
        div.style.borderBottom = '1px solid #2a1f1a';
        div.style.cursor = 'pointer';
        div.innerHTML = `<strong style="color:#d9c8a9;">${item.title}</strong><br><small>${item.excerpt}</small>`;
        div.addEventListener('click', () => {
          openModal(item.title, item.excerpt);
          searchResultsPool.style.display = 'none';
          searchInput.value = '';
        });
        searchResultsPool.appendChild(div);
      });
    }
    searchResultsPool.style.display = 'block';
  }

  searchInput.addEventListener('input', (e) => performSearch(e.target.value));
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResultsPool.contains(e.target)) {
      searchResultsPool.style.display = 'none';
    }
  });

  function openModal(title, description) {
    modalBody.innerHTML = `
      <h2 style="font-family:'Cinzel'; color:#d9c8a9; margin-bottom:1rem;">${title}</h2>
      <p style="color:#c4b7a6;">${description}</p>
      <div style="margin-top:2rem; font-style:italic; color:#6e1a1a;">The record trembles in your mind.</div>
    `;
    modalPortal.style.display = 'flex';
    updateSanity(-8);
  }

  modalClose.addEventListener('click', () => {
    modalPortal.style.display = 'none';
  });

  modalPortal.addEventListener('click', (e) => {
    if (e.target === modalPortal) modalPortal.style.display = 'none';
  });

  archiveEntries.forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const titleEl = card.querySelector('.card-title');
        const excerptEl = card.querySelector('.card-excerpt');
        const title = titleEl ? titleEl.textContent : 'Unknown Record';
        const excerpt = excerptEl ? excerptEl.textContent : 'No description available.';
        openModal(title, excerpt);
        e.stopPropagation();
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateSanity(-15);
        constabyssalMsg = document.querySelector('.abyssal-message');
        if (abyssalMsg) {
          abyssalMsg.style.color = '#9e2a2b';
          abyssalMsg.textContent = 'Turn back. The abyss stares also.';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.7 });

  if (deepTrigger) observer.observe(deepTrigger);

  const grid = document.getElementById('archive-entries');
  if (grid) {
    grid.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.archive-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - cardCenterX) * 0.02;
        const deltaY = (e.clientY - cardCenterY) * 0.02;
        card.style.transform = `skewY(0.2deg) translateY(0px) perspective(800px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
      });
    });

    grid.addEventListener('mouseleave', () => {
      const cards = document.querySelectorAll('.archive-card');
      cards.forEach(card => {
        card.style.transform = 'skewY(0.2deg) translateY(0px) perspective(800px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  const pupil = document.querySelector('.pupil');
  if (pupil) {
    document.addEventListener('mousemove', (e) => {
      const eye = document.querySelector('.sigil-eye');
      if (!eye) return;
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(6, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) * 0.08);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
});