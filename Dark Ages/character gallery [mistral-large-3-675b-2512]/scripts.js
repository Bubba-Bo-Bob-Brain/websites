// ===== DOM ELEMENTS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.querySelector('.search-box input');
const characterCards = document.querySelectorAll('.character-card');
const relationshipStats = document.querySelectorAll('.stat.relationship');
const modal = document.getElementById('relationship-modal');
const modalNames = document.getElementById('modal-names');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');
const closeLoreButtons = document.querySelectorAll('.close-lore');
const soundToggle = document.getElementById('sound-toggle');

// ===== AMBIENT SOUND (Optional) =====
let ambientSound = null;
if (typeof Audio !== 'undefined') {
  ambientSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-medieval-show-loop-385.mp3');
  ambientSound.loop = true;
  ambientSound.volume = 0.3;
}

soundToggle.addEventListener('click', () => {
  if (ambientSound) {
    if (ambientSound.paused) {
      ambientSound.play();
      soundToggle.textContent = '🔇 Toggle Ambience';
    } else {
      ambientSound.pause();
      soundToggle.textContent = '🔊 Toggle Ambience';
    }
  }
});

// ===== FILTER CHARACTERS =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Get filter value
    const filter = btn.dataset.filter;

    // Filter cards
    characterCards.forEach(card => {
      if (filter === 'all') {
        card.style.display = 'block';
        return;
      }
      if (card.dataset.class === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== SEARCH CHARACTERS =====
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();

  characterCards.forEach(card => {
    const name = card.querySelector('h2').textContent.toLowerCase();
    if (name.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// ===== LORE SCROLL TOGGLE =====
characterCards.forEach(card => {
  const loreScroll = card.querySelector('.lore-scroll');
  const closeLore = card.querySelector('.close-lore');

  // Click anywhere on card to expand lore
  card.addEventListener('click', (e) => {
    if (e.target !== closeLore && !loreScroll.contains(e.target)) {
      loreScroll.style.maxHeight = loreScroll.style.maxHeight ? null : loreScroll.scrollHeight + 'px';
    }
  });

  // Close lore button
  closeLore.addEventListener('click', (e) => {
    e.stopPropagation();
    loreScroll.style.maxHeight = null;
  });
});

// ===== RELATIONSHIP MODAL =====
// Sample relationship data (key: "character1-character2")
const relationshipData = {
  'the-flagellant-the-herbalist': {
    names: 'Brother Malachi & Mara the Greenhand',
    description: 'Brother Malachi once called Mara a witch and demanded she be burned. She cursed him with a brew of belladonna and nightshade. Now, he sweats black blood, and she alone can ease his pain—if she chooses to.',
    choices: {
      heal: 'Mara’s poultice soothes Malachi’s fever, but the mob sees her as a saint.',
      betray: 'Mara flees, but Malachi’s screams haunt her dreams.',
      ignore: 'Malachi dies at dawn. His body vanishes before the pyre is lit.'
    }
  },
  'the-noble-the-flagellant': {
    names: 'Lady Isolde & Brother Malachi',
    description: 'Isolde secretly funds Malachi’s sermons, hoping his fanaticism will protect her lands. He preaches that the plague is God’s wrath—for her sins.',
    choices: {
      fund: 'Isolde’s gold buys Malachi’s silence… for now.',
      exile: 'The mob turns on Malachi. Isolde’s reputation is tarnished.',
      convert: 'Isolde kneels before the cross. The Church rewards her piety.'
    }
  },
  'the-noble-the-mercenary': {
    names: 'Lady Isolde & Gunnar "Redaxe"',
    description: 'Gunnar was once a knight in Isolde’s father’s service. Now, she hires him to defend her walls—while her real enemies plot inside.',
    choices: {
      hire: 'Gunnar’s axe keeps the bandits at bay. But who guards Isolde from Gunnar?',
      betray: 'Gunnar is framed for theft. The dungeon awaits.',
      duel: 'Isolde challenges Gunnar to a duel. Only one leaves the courtyard alive.'
    }
  }
};

// Open modal with dynamic content
relationshipStats.forEach(stat => {
  stat.addEventListener('click', (e) => {
    e.stopPropagation();
    const relationshipKey = stat.dataset.relationship;
    const data = relationshipData[`${relationshipKey.replace('the-', '')}-${stat.closest('.character-card').dataset.class}`] ||
                 relationshipData[`${stat.closest('.character-card').dataset.class}-${relationshipKey.replace('the-', '')}`];

    if (data) {
      modalNames.textContent = data.names;
      modalDescription.textContent = data.description;

      // Clear existing choices
      const choicesContainer = document.querySelector('.modal-choices');
      choicesContainer.innerHTML = '';

      // Add new choices
      Object.entries(data.choices).forEach(([key, text]) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.dataset.choice = key;
        btn.textContent = `⚔️ ${text.split(' ').slice(0, 3).join(' ')}...`;
        btn.title = text;
        btn.addEventListener('click', () => {
          alert(`You chose: ${text}`);
          modal.classList.remove('active');
        });
        choicesContainer.appendChild(btn);
      });

      modal.classList.add('active');
    }
  });
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// ===== MICRO-INTERACTIONS =====
// Pulse animation for stats on hover
document.querySelectorAll('.stat').forEach(stat => {
  stat.addEventListener('mouseenter', () => {
    stat.style.transform = 'scale(1.1)';
  });
  stat.addEventListener('mouseleave', () => {
    stat.style.transform = 'scale(1)';
  });
});

// Fade-in animation for cards on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

characterCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s, transform 0.5s';
  observer.observe(card);
});