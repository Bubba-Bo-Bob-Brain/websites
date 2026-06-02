document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('header');
  const navLinks = document.getElementById('navLinks');
  const mobileToggle = document.getElementById('mobileToggle');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section, .hero-section');
  const spliceButtons = document.querySelectorAll('.splice-btn');
  const spliceModal = document.getElementById('spliceModal');
  const modalMutationName = document.getElementById('modalMutationName');
  const confirmSplice = document.getElementById('confirmSplice');
  const cancelSplice = document.getElementById('cancelSplice');
  const closeModal = document.getElementById('closeModal');
  const exploreBtn = document.getElementById('exploreBtn');
  const zones = document.querySelectorAll('.zone');
  const zoneDetail = document.getElementById('zoneDetail');
  const zonePanelTitle = zoneDetail.querySelector('.zone-panel-title');
  const statFills = zoneDetail.querySelectorAll('.stat-fill');
  const zoneDescription = zoneDetail.querySelector('.zone-description');
  const techNodes = document.querySelectorAll('.tech-node');
  const biomassValue = document.getElementById('biomassValue');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const pageIndicator = document.querySelector('.page-indicator');
  const sporeField = document.getElementById('sporeField');

  let currentBiomass = 12;
  let currentJournalPage = 3;
  const totalJournalPages = 14;

  function createSpores() {
    for (let i = 0; i < 25; i++) {
      const spore = document.createElement('div');
      spore.classList.add('floating-spore');
      const size = Math.random() * 6 + 2;
      spore.style.width = size + 'px';
      spore.style.height = size + 'px';
      spore.style.left = Math.random() * 100 + '%';
      spore.style.top = Math.random() * 100 + '%';
      spore.style.animationDuration = Math.random() * 15 + 10 + 's';
      spore.style.animationDelay = Math.random() * 10 + 's';
      spore.style.opacity = Math.random() * 0.3 + 0.05;
      spore.style.background = Math.random() > 0.6 ? 'var(--spore-bright)' : 'var(--toxic-amber)';
      spore.style.borderRadius = '50%';
      spore.style.position = 'absolute';
      spore.style.pointerEvents = 'none';
      spore.style.filter = 'blur(1px)';
      spore.style.animation = 'sporeFloat ' + spore.style.animationDuration + ' infinite ease-in-out';
      sporeField.appendChild(spore);
    }
  }

  const sporeFloatKeyframes = `
    @keyframes sporeFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(15px, -25px) scale(1.2); }
      50% { transform: translate(-10px, -50px) scale(0.8); }
      75% { transform: translate(-20px, -15px) scale(1.1); }
    }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sporeFloatKeyframes;
  document.head.appendChild(styleSheet);
  createSpores();

  function updateActiveNav() {
    let currentSectionId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSectionId = section.id;
      }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === currentSectionId) {
        item.classList.add('active');
      }
    });
    if (!currentSectionId && window.scrollY < 200) {
      navItems.forEach(item => item.classList.remove('active'));
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  mobileToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  });

  exploreBtn.addEventListener('click', function () {
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const trailerBtn = document.getElementById('trailerBtn');
  trailerBtn.addEventListener('click', function () {
    const originalText = this.querySelector('.btn-text').textContent;
    this.querySelector('.btn-text').textContent = 'STRAIN INJECTED';
    this.style.borderColor = 'var(--spore-bright)';
    this.style.color = 'var(--spore-bright)';
    setTimeout(() => {
      this.querySelector('.btn-text').textContent = originalText;
      this.style.borderColor = 'var(--blood-crimson)';
      this.style.color = 'var(--bone-white)';
    }, 2000);
  });

  let currentSpliceTarget = null;
  spliceButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const card = this.closest('.mutation-card');
      const mutationName = card.querySelector('.mutation-name').textContent;
      currentSpliceTarget = mutationName;
      modalMutationName.textContent = mutationName;
      spliceModal.classList.add('active');
      spliceModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeSpliceModal() {
    spliceModal.classList.remove('active');
    spliceModal.setAttribute('aria-hidden', 'true');
    currentSpliceTarget = null;
  }

  closeModal.addEventListener('click', closeSpliceModal);
  cancelSplice.addEventListener('click', closeSpliceModal);
  spliceModal.addEventListener('click', function (e) {
    if (e.target === spliceModal) closeSpliceModal();
  });

  confirmSplice.addEventListener('click', function () {
    if (currentSpliceTarget && currentBiomass >= 3) {
      currentBiomass -= 3;
      biomassValue.textContent = currentBiomass;
      const allCards = document.querySelectorAll('.mutation-card');
      allCards.forEach(card => {
        if (card.querySelector('.mutation-name').textContent === currentSpliceTarget) {
          card.style.borderColor = 'var(--spore-bright)';
          card.style.boxShadow = '0 0 25px rgba(107, 140, 66, 0.6)';
          const btn = card.querySelector('.splice-btn');
          btn.textContent = 'SPLICED';
          btn.disabled = true;
          btn.style.opacity = '0.6';
        }
      });
      closeSpliceModal();
      const originalBiomass = biomassValue.textContent;
      biomassValue.textContent = currentBiomass;
      biomassValue.style.transform = 'scale(1.4)';
      biomassValue.style.transition = 'transform 0.2s';
      setTimeout(() => {
        biomassValue.style.transform = 'scale(1)';
      }, 200);
    } else if (currentBiomass < 3) {
      alert('Not enough biomass. Harvest more organic matter from the wasteland.');
      closeSpliceModal();
    }
  });

  const zoneData = {
    nexus: {
      name: 'The Nexus',
      spore: 98,
      radiation: 85,
      host: 100,
      desc: 'Ground zero of the Bloom. A pulsating mass of fused organic matter. No human has returned unchanged.'
    },
    spire: {
      name: 'Bone Spire',
      spore: 65,
      radiation: 40,
      host: 75,
      desc: 'A towering structure of calcified remains. Hosts swarm the lower levels; valuable biomass above.'
    },
    hollow: {
      name: 'The Hollow',
      spore: 45,
      radiation: 25,
      host: 50,
      desc: 'An abandoned underground shelter. Spore levels are moderate, but something has made a nest here.'
    },
    outpost: {
      name: 'Outpost 9',
      spore: 10,
      radiation: 5,
      host: 15,
      desc: 'One of the last safe havens. Clean water and minimal contamination. Traders pass through weekly.'
    }
  };

  zones.forEach(zone => {
    zone.addEventListener('click', function () {
      const zoneType = this.getAttribute('data-zone');
      const data = zoneData[zoneType];
      if (data) {
        zonePanelTitle.textContent = data.name;
        zoneDescription.textContent = data.desc;
        statFills[0].style.width = data.spore + '%';
        statFills[1].style.width = data.radiation + '%';
        statFills[2].style.width = data.host + '%';
      }
    });
  });

  techNodes.forEach(node => {
    node.addEventListener('click', function () {
      const techName = this.querySelector('.node-name').textContent;
      const costText = this.querySelector('.node-cost');
      let cost = 0;
      if (costText) {
        cost = parseInt(costText.textContent.match(/\d+/)[0]);
      }
      if (this.classList.contains('active')) {
        return;
      }
      if (cost > 0 && currentBiomass >= cost) {
        currentBiomass -= cost;
        biomassValue.textContent = currentBiomass;
        this.classList.add('active');
        this.style.borderColor = 'var(--spore-bright)';
        this.style.boxShadow = '0 0 20px rgba(107, 140, 66, 0.5)';
        if (costText) costText.textContent = 'UNLOCKED';
        biomassValue.style.transform = 'scale(1.3)';
        setTimeout(() => {
          biomassValue.style.transform = 'scale(1)';
        }, 200);
      } else if (cost > 0) {
        alert('Insufficient biomass. Scavenge the wasteland for more resources.');
      }
    });
  });

  function updateJournal() {
    pageIndicator.textContent = 'Entry ' + currentJournalPage + ' of ' + totalJournalPages;
    const leftTitle = document.querySelector('.left-page .journal-entry-title');
    const leftText = document.querySelector('.left-page .journal-text');
    const rightTitle = document.querySelector('.right-page .journal-entry-title');
    
    if (currentJournalPage === 3) {
      leftTitle.textContent = 'Rule #1: The Flesh is Hungry';
      leftText.textContent = 'Never trust a symbiote that speaks. If your graft whispers while you sleep, amputate immediately. The Bloom consumes from within. I\'ve seen whole camps turn into spore-hives overnight because someone thought they could control a Nexus strain.';
      rightTitle.textContent = 'Scavenger\'s Checklist';
    } else if (currentJournalPage === 4) {
      leftTitle.textContent = 'Rule #2: Water is Memory';
      leftText.textContent = 'Standing water in the wasteland carries genetic echoes. Drink untreated water and you might absorb the memories of the dead. Some scavengers seek this. Most go mad.';
      rightTitle.textContent = 'Edible Flora Guide';
    } else if (currentJournalPage === 2) {
      leftTitle.textContent = 'Introduction: The Bloom';
      leftText.textContent = 'They said it was a bioweapon. They were wrong. It\'s a conversation. The spores don\'t kill you; they invite you to join something larger. Most refuse. The ones who accept are no longer human.';
      rightTitle.textContent = 'Basic Symbiote Care';
    }
  }

  prevPage.addEventListener('click', function () {
    if (currentJournalPage > 1) {
      currentJournalPage--;
      updateJournal();
    }
  });

  nextPage.addEventListener('click', function () {
    if (currentJournalPage < totalJournalPages) {
      currentJournalPage++;
      updateJournal();
    }
  });

  updateJournal();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && spliceModal.classList.contains('active')) {
      closeSpliceModal();
    }
  });

  const allInteractiveElements = document.querySelectorAll('button, a, .zone, .tech-node');
  allInteractiveElements.forEach(el => {
    el.addEventListener('mouseenter', function () {
      document.body.style.cursor = 'pointer';
    });
    el.addEventListener('mouseleave', function () {
      document.body.style.cursor = 'default';
    });
  });

  console.log('Genesis Fall interface initialized. Biomass level: ' + currentBiomass + '. Stay alive, host.');
});