/**
 * THE VOID ARCHIVE - Cosmic Horror Interactive Experience
 * Brings the eldritch archive to life with sanity tracking,
 * corrupted text, search functionality, and spatial distortions.
 */
(function() {
  'use strict';

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const state = {
    sanity: 100,
    maxSanity: 100,
    scrollDepth: 0,
    maxScroll: 0,
    isSearching: false,
    activeCategory: 'all',
    entries: [],
    mouseX: 0,
    mouseY: 0
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const elements = {
    body: document.body,
    sanityPanel: document.querySelector('.sanity-panel'),
    sanityFill: document.querySelector('.sanity-fill'),
    sanityValue: document.querySelector('.sanity-value'),
    sanityWarning: document.querySelector('.sanity-warning'),
    sanitySkulls: document.querySelectorAll('.skull'),
    searchInput: document.getElementById('archiveSearch'),
    searchResultsCount: document.getElementById('resultsCount'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    catalogGrid: document.getElementById('catalogGrid'),
    entries: document.querySelectorAll('.catalog-entry'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    scrollWarning: document.getElementById('scrollWarning'),
    deepArchive: document.getElementById('deepArchive'),
    deepEntries: document.querySelectorAll('.deep-entry'),
    cursorFollower: document.querySelector('.cursor-follower'),
    entryModal: document.getElementById('entryModal'),
    modalBackdrop: document.querySelector('.modal-backdrop'),
    modalClose: document.querySelector('.modal-close'),
    modalType: document.querySelector('.modal-type'),
    modalTitle: document.querySelector('.modal-title'),
    modalId: document.querySelector('.modal-id'),
    modalText: document.querySelector('.modal-text'),
    modalWarnings: document.querySelector('.modal-warnings'),
    eyes: document.querySelectorAll('.eye'),
    tentacles: document.querySelectorAll('.tentacle-path')
  };

  // ============================================
  // ENTRY DATA (Extended)
  // ============================================
  const entryDatabase = [
    {
      id: 'VLT-0001-Ω',
      type: 'DEAD TEXT',
      title: 'THE NECRONOMICON FRAGMENTS',
      sanity: 15,
      excerpt: 'Θεὶ τὸ πρῶτον ἐγένετο τὸ σκότος, καὶ τὸ σκότος ἐγένετο ἐν τῇ ἀβύσσῳ. Καὶ τὸ πνεῦμα θεοῦ ἐπεφέρετο ἐπάνω τοῦ ὕδατος. Καὶ εἶπεν ὁ θεός· γενηθήτω φῶς· καὶ ἐγένετο φῶς. Ἀλλὰ τὸ φῶς ἐκεῖνο δὲν ἦταν φῶς—ἦταν ὁ πρῶτος τρόμος.',
      warnings: ['COGNITOHAZARD', 'EXTREME PSYCHOLOGICAL DAMAGE'],
      fullText: 'The first verse speaks of darkness, but it was not the darkness you know. It was awareness. Consciousness without form. The void that sees. They did not create light—they created the ability to perceive, and in that perception, they created fear. The Necronomicon is not a book. It is a wound in reality through which something looks back.'
    },
    {
      id: 'CHT-0087-Γ',
      type: 'STAR CHART',
      title: 'CARINA DERELICTA',
      sanity: 20,
      excerpt: "The corpse of a dead god's galaxy. Stars that burn with no light, planets that orbit nothing, time that flows in seven directions at once.",
      warnings: ['SPATIAL ANOMALY', 'TEMPORAL INSTABILITY'],
      fullText: 'Once, this was a thriving galaxy—the domain of a civilization so advanced they transcended physical form. Then they made contact with something from between dimensions. In a single cosmic instant, every star went dark, every planet froze, every thought ceased. But the geometry remains. The orbits still function. Something still tends this garden of corpses.'
    },
    {
      id: 'TMS-0234-Ξ',
      type: 'TESTIMONY',
      title: "DR. ASHWORTH'S ACCOUNT",
      sanity: 25,
      excerpt: '"It had no face. Only eyes. A thousand eyes. All watching. All knowing. And worst of all—every single one of them was familiar."',
      warnings: ['PSYCHOLOGICAL TRAUMA', 'BODY HORROR'],
      fullText: "Dr. Elena Ashworth, former professor of Xenolinguistics at Miskatonic University. Transcript of final transmission:\n\n\"It speaks in colors your eyes cannot process. It shows me my death—over and over—but each time, I die differently. Sometimes I am old. Sometimes I am never born. It is teaching me that time is not a river but an ocean, and I have been swimming in the shallow end. Now it wants to show me the depths. God forgive me, I want to see.\"\n\nStatus: Deceased. Body recovered. Face missing. Eyes: intact, but they were open at the time of death—fixed on nothing, weeping tears of clear fluid that refused to evaporate."
    },
    {
      id: 'VLT-0042-Σ',
      type: 'DEAD TEXT',
      title: 'THE KING IN YELLOW FRAGMENTS',
      sanity: 30,
      excerpt: 'Along the shore the egg-shaped stones lay scattered. Beyond, the city. God, the city. Its spires pierced the sky like accusation fingers.',
      warnings: ['MEMETIC HAZARD', 'REALITY DISSOLUTION'],
      fullText: "Act I, Scene 2 (recovered from the dreams of seventeen patients who died simultaneously on March 15th, 1895):\n\n\"CASSILDA: Along the shore the egg-shaped stones lay scattered...\nCARCOSA: Beyond, the city...\nKING IN YELLOW: You have seen it? Then you know. The city was never built. It was always there. We merely forgot how to see it. Now I will teach you to remember.\"\n\nAll who read this account report hearing distant brass instruments and seeing a yellow mask in their peripheral vision."
    },
    {
      id: 'ART-0156-Φ',
      type: 'ARTIFACT',
      title: 'THE BLACK STONE',
      sanity: 10,
      excerpt: 'A perfect void given form. It absorbs all light. All attention. All meaning. Stare too long and you become nothing.',
      warnings: ['CLASS 5 ENTITY', 'EXISTENTIAL ERASURE'],
      fullText: 'Origin: Discovered in the Gobi Desert, 1922, by archaeologist Dr. Hugh Gregory.\n\nPhysical description: Obsidian-like material, but density cannot be measured. Appears to weigh nothing and everything simultaneously.\n\nEffects: Subjects who gaze upon the stone report a sensation of "being observed from inside their own skull." After 72 hours of continuous exposure, subjects begin to forget their own names. Then their faces. Then the concept of "self."\n\nCurrent containment: Sealed in a lead-lined chamber. Guards report hearing whispers from inside the chamber. The whispers say their names. Correctly.'
    },
    {
      id: 'CHT-0203-Ψ',
      type: 'STAR CHART',
      title: 'THE WHISPERING VOID',
      sanity: 35,
      excerpt: 'A region of space where time flows backwards. Stars scream as they are born, and the cosmos weeps as they die.',
      warnings: ['TEMPORAL DISPLACEMENT', 'AUDITORY HALLUCINATIONS'],
      fullText: 'Located in the outer rim, approximately 47 billion light-years from Earth (though distance测量 is complicated by local spacetime curvature).\n\nThe Whispering Void is not empty—it is full of anti-sound. Sound that exists as the absence of silence. Ships that enter report hearing their own deaths before they happen. Astronauts have been found floating in the void, their eardrums ruptured, smiling, insisting they "haven\'t arrived yet."\n\nThe cartographic data causes mild nausea in 94% of viewers and complete auditory collapse in 6%. We do not know why some are affected differently.'
    },
    {
      id: 'TMS-0456-Ω',
      type: 'TESTIMONY',
      title: "CAPTAIN VANCE'S FINAL LOG",
      sanity: 40,
      excerpt: '"Day 47. The thing on the hull... it\'s not mechanical. It\'s biological. It pulses. It has veins. I think it\'s feeding."',
      warnings: ['BODY HORROR', 'BIOLOGICAL CONTAMINATION'],
      fullText: "USS Covenant, Final Mission Log, Captain Jonathan Vance:\n\n\"Day 40: We picked up something on long-range sensors. A mass. Organic. Moving against the stellar wind.\n\nDay 42: It matched our velocity. It's following us.\n\nDay 44: It's attached. The metal is... dissolving. Not corroding—dissolving. Becoming part of it.\n\nDay 45: I sent a team out. Jenkins came back alone. He said the others \"joined with the vessel.\" He was crying. He had tears of something black.\n\nDay 46: Jenkins has changed. His skin has a metallic sheen. He says he can hear the ship dreaming.\n\nDay 47: [DATA CORRUPTED] I can see through the hull now. It's beautiful. We are all going home. We never left. [END LOG]\""
    },
    {
      id: 'VLT-0089-Θ',
      type: 'DEAD TEXT',
      title: 'PRONOUNCEABLE BY THE DEAD',
      sanity: 45,
      excerpt: 'In the spaces between thoughts, It waits. In the silence between heartbeats, It speaks. In the void between breaths, It lives.',
      warnings: ['APHOTIC TERROR', 'COGNITIVE DISSONANCE'],
      fullText: "This text was found carved into the walls of a monastery in Tibet. Every monk had gouged out their own eyes. They were found sitting in perfect circles, facing inward, mouths open in silent scream.\n\nThe text reads in ancient Tibetan:\n\n\"Name the Nameless\nName the Nameless\nName the Nameless\n\nTo name is to know\nTo know is to see\nTo see is to be seen\n\nThey see you\nThey see you\nThey have always seen you\n\nClose your eyes\nClose your eyes\nBut it does not help\n\nThey are behind your eyes\nThey have always been behind your eyes\n\nWAKE UP\nWAKE UP\nYOU NEVER WOKE UP\n\n[This portion is illegible—scorched]\n\nThis text was found in the dreams of the monks. They did not write it. They became it."
    },
    {
      id: 'ART-0312-Λ',
      type: 'ARTIFACT',
      title: 'THE LAZARUS ENGINE',
      sanity: 50,
      excerpt: 'It does not repair. It replaces. Every cell. Every thought. Every memory. You are still you—until you realize you\'re not.',
      warnings: ['EXISTENTIAL CORRUPTION', 'IDENTITY DISSOLUTION'],
      fullText: "Discovered in the ruins of a civilization that no longer exists (their name translates roughly to \"Those Who Waited Too Long\").\n\nThe Lazarus Engine appears to be a medical device—but it operates on the principle of \"complete replacement.\" A wound is not healed; it is replaced with new tissue that was never injured. A broken bone is not mended; it is replaced with a bone that was never broken.\n\nThe subjects report feeling \"brand new.\" They also report that their dreams now belong to someone else. Their memories feel borrowed. Their identity feels like a coat that doesn't quite fit.\n\nTwelve volunteers underwent treatment. All twelve claimed to be \"cured\" of various ailments. All twelve now insist they were never ill. All twelve refer to themselves in the third person—and claim their \"previous self\" was a stranger who has since \"left.\"\n\nWe do not know where the \"previous self\" went. We suspect we do not want to know."
    }
  ];

  // ============================================
  // SANITY SYSTEM
  // ============================================
  function updateSanity(amount) {
    state.sanity = Math.max(0, Math.min(100, state.sanity + amount));
    const percentage = state.sanity;
    elements.sanityFill.style.height = percentage + '%';
    elements.sanityValue.textContent = Math.round(percentage) + '%';

    // Update skulls (5 skulls total)
    elements.sanitySkulls.forEach((skull, index) => {
      const threshold = (index + 1) * 20;
      if (percentage < threshold) {
        skull.classList.add('active');
      } else {
        skull.classList.remove('active');
      }
    });

    // Update warning text
    if (percentage > 80) {
      elements.sanityWarning.textContent = 'STABLE';
      elements.sanityPanel.classList.remove('critical');
    } else if (percentage > 60) {
      elements.sanityWarning.textContent = 'UNSETTLING';
      elements.sanityPanel.classList.remove('critical');
    } else if (percentage > 40) {
      elements.sanityWarning.textContent = 'DISTRESSED';
      elements.sanityPanel.classList.remove('critical');
    } else if (percentage > 20) {
      elements.sanityWarning.textContent = 'CRITICAL';
      elements.sanityPanel.classList.add('critical');
    } else {
      elements.sanityWarning.textContent = 'BREAKING';
      elements.sanityPanel.classList.add('critical');
      elements.body.classList.add('sanity-critical');
    }
  }

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    state.scrollDepth = (scrollTop / docHeight) * 100;

    // Sanity decreases as user scrolls deeper
    const sanityLoss = state.scrollDepth * 0.15;
    updateSanity(-sanityLoss);

    // Show scroll warning
    if (state.scrollDepth > 50) {
      elements.scrollWarning.classList.add('visible');
    }

    // Reveal deep archive entries
    if (state.scrollDepth > 70) {
      elements.deepEntries.forEach((entry, index) => {
        setTimeout(function() {
          entry.classList.add('visible');
        }, index * 500);
        // Additional sanity loss for deep content
        updateSanity(-2);
      });
    }

    // Non-Euclidean grid effect
    const entries = document.querySelectorAll('.catalog-entry');
    entries.forEach((entry) => {
      const rect = entry.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (centerY - state.mouseY) * 0.02;
      const rotateY = (state.mouseX - centerX) * 0.02;
      entry.style.setProperty('--rotate-x', rotateX + 'deg');
      entry.style.setProperty('--rotate-y', rotateY + 'deg');
    });
  }

  // ============================================
  // SEARCH FUNCTIONALITY
  // ============================================
  const searchTerms = [
    'necronomicon', 'carcosa', 'king yellow', 'black stone', 'lazarus',
    'whispering void', 'dead galaxy', 'the thing', 'eyes', 'dream',
    'void', 'archive', 'cthulhu', 'nyarlathotep', 'azathoth',
    'yog-sothoth', 'shoggoth', 'deep ones', 'elder things', 'great race', 'flying polyps'
  ];

  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      elements.searchSuggestions.classList.remove('active');
      elements.searchResultsCount.textContent = '';
      return;
    }

    // Calculate sanity impact based on search term darkness
    const darknessTerms = ['death', 'void', 'eyes', 'dream', 'horror', 'madness', 'blood', 'corpse', 'dark', 'dead', 'cthulhu', 'azathoth', 'nyarlathotep'];
    let searchDarkness = 0;
    darknessTerms.forEach(function(term) {
      if (query.includes(term)) searchDarkness += 3;
    });
    updateSanity(-searchDarkness);

    // Find matching entries
    const matches = entryDatabase.filter(function(entry) {
      return entry.title.toLowerCase().includes(query) || entry.excerpt.toLowerCase().includes(query);
    });

    // Show results count
    elements.searchResultsCount.textContent = 'FOUND ' + matches.length + ' ENTRIES' + (query.length > 5 ? '...' : '');

    // Show suggestions
    elements.searchSuggestions.innerHTML = '';
    const suggestions = searchTerms.filter(function(term) {
      return term.includes(query);
    });

    suggestions.slice(0, 5).forEach(function(term) {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.textContent = term;
      item.addEventListener('click', function() {
        elements.searchInput.value = term;
        elements.searchSuggestions.classList.remove('active');
        handleSearch({ target: { value: term } });
      });
      elements.searchSuggestions.appendChild(item);
    });

    if (suggestions.length > 0) {
      elements.searchSuggestions.classList.add('active');
    }

    // Filter displayed entries
    filterEntries(query);
  }

  function filterEntries(query) {
    const entries = document.querySelectorAll('.catalog-entry');
    entries.forEach(function(entry) {
      const title = entry.querySelector('.entry-title').textContent.toLowerCase();
      const excerpt = entry.querySelector('.entry-excerpt').textContent.toLowerCase();
      const type = entry.querySelector('.entry-type').textContent.toLowerCase();
      if (title.includes(query) || excerpt.includes(query) || type.includes(query)) {
        entry.style.display = 'block';
      } else {
        entry.style.display = 'none';
      }
    });
  }

  // ============================================
  // CATEGORY FILTERING
  // ============================================
  function filterByCategory(category) {
    state.activeCategory = category;
    elements.categoryBtns.forEach(function(btn) {
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const entries = document.querySelectorAll('.catalog-entry');
    entries.forEach(function(entry) {
      const entryCategory = entry.dataset.category;
      if (category === 'all' || entryCategory === category) {
        entry.style.display = 'block';
      } else {
        entry.style.display = 'none';
      }
    });

    // Category sanity effects
    if (category === 'texts') updateSanity(-5);
    if (category === 'testimonies') updateSanity(-8);
    if (category === 'charts') updateSanity(-3);
  }

  // ============================================
  // MODAL FUNCTIONALITY
  // ============================================
  function openModal(entryElement) {
    const type = entryElement.querySelector('.entry-type').textContent;
    const title = entryElement.querySelector('.entry-title').textContent;
    const id = entryElement.querySelector('.entry-id').textContent;
    const excerpt = entryElement.querySelector('.entry-excerpt').textContent;
    const warning = entryElement.querySelector('.entry-warning').textContent;
    const sanityCost = parseInt(entryElement.dataset.sanity);

    // Find full entry data
    const fullEntry = entryDatabase.find(function(e) {
      return e.title === title;
    });

    elements.modalType.textContent = type;
    elements.modalTitle.textContent = title;
    elements.modalId.textContent = id;
    elements.modalText.textContent = fullEntry ? fullEntry.fullText : excerpt;
    
    if (fullEntry) {
      elements.modalWarnings.innerHTML = fullEntry.warnings.map(function(w) {
        return '<div class="entry-warning">⚠ ' + w + '</div>';
      }).join('');
    } else {
      elements.modalWarnings.innerHTML = '<div class="entry-warning">⚠ ' + warning + '</div>';
    }

    elements.entryModal.classList.add('active');
    updateSanity(-sanityCost);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    elements.entryModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================
  // CURSOR TRACKING
  // ============================================
  function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

    // Update cursor follower
    elements.cursorFollower.style.left = (e.clientX - 10) + 'px';
    elements.cursorFollower.style.top = (e.clientY - 10) + 'px';

    // Make eyes follow cursor
    elements.eyes.forEach(function(eye) {
      const pupil = eye.querySelector('.pupil');
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      const distance = Math.min(3, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 50);
      pupil.style.transform = 'translate(calc(-50% + ' + (Math.cos(angle) * distance) + 'px), calc(-50% + ' + (Math.sin(angle) * distance) + 'px))';
    });

    // Subtle tentacle movement based on cursor
    const tentacles = document.querySelectorAll('.tentacle-path');
    tentacles.forEach(function(tentacle, index) {
      const wave = Math.sin(Date.now() / 1000 + index) * 5;
      tentacle.style.strokeWidth = (2 + Math.random() * 2) + 'px';
    });
  }

  // ============================================
  // TEXT CORRUPTION EFFECT
  // ============================================
  function corruptText(element) {
    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    let iterations = 0;
    const interval = setInterval(function() {
      element.textContent = originalText
        .split('')
        .map(function(letter, index) {
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (iterations >= originalText.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3;
    }, 30);
  }

  // ============================================
  // RANDOM HORROR EFFECTS
  // ============================================
  function randomHorrorEffect() {
    const effects = [
      // Text corruption on random elements
      function() {
        const titles = document.querySelectorAll('.entry-title');
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        if (randomTitle) {
          corruptText(randomTitle);
          setTimeout(function() {
            randomTitle.textContent = randomTitle.dataset.glitch || randomTitle.textContent;
          }, 2000);
        }
      },
      // Sanity drain
      function() {
        updateSanity(-Math.random() * 5);
      },
      // Visual glitch
      function() {
        elements.body.style.filter = 'hue-rotate(90deg)';
        setTimeout(function() {
          elements.body.style.filter = 'none';
        }, 100);
      },
      // Sound simulation (visual)
      function() {
        elements.searchInput.value += '...';
        setTimeout(function() {
          if (elements.searchInput.value.endsWith('...')) {
            elements.searchInput.value = elements.searchInput.value.slice(0, -3);
          }
        }, 500);
      }
    ];

    // Only trigger effects when sanity is low
    if (state.sanity < 60 && Math.random() < 0.3) {
      const effect = effects[Math.floor(Math.random() * effects.length)];
      effect();
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchInput.addEventListener('focus', function() { updateSanity(-2); });

    elements.categoryBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterByCategory(btn.dataset.category);
      });
    });

    // Entry click handlers
    elements.entries.forEach(function(entry) {
      entry.addEventListener('click', function(e) {
        if (!e.target.classList.contains('entry-access')) {
          openModal(entry);
        }
      });
      entry.addEventListener('mouseenter', function() {
        updateSanity(-parseInt(entry.dataset.sanity) * 0.1);
      });
    });

    // Modal close handlers
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Initial sanity set
    updateSanity(100);

    // Trigger scroll once to set initial state
    handleScroll();

    // Random horror effects interval
    setInterval(randomHorrorEffect, 5000);

    // Entry access buttons
    document.querySelectorAll('.entry-access').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const entry = btn.closest('.catalog-entry');
        openModal(entry);
      });
    });

    // Prevent form submission
    elements.searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') e.preventDefault();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();