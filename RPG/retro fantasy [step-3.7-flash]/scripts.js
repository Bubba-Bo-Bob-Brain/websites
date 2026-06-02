// DOM Elements
const characterSheet = {
  name: document.getElementById('char-name'),
  race: document.getElementById('char-race'),
  class: document.getElementById('char-class'),
  level: document.getElementById('char-level'),
  backstory: document.getElementById('char-backstory'),
  stats: {
    str: document.getElementById('stat-str'),
    dex: document.getElementById('stat-dex'),
    con: document.getElementById('stat-con'),
    int: document.getElementById('stat-int'),
    wis: document.getElementById('stat-wis'),
    cha: document.getElementById('stat-cha')
  },
  mods: document.querySelectorAll('.stat-mod')
};

const spellBook = {
  listItems: document.querySelectorAll('.spell-list-item'),
  prevBtn: document.querySelector('.prev-page'),
  nextBtn: document.querySelector('.next-page'),
  activeDisplay: document.getElementById('active-spell'),
  currentIndex: 0
};

const questBoard = {
  cards: document.querySelectorAll('.quest-card'),
  seals: document.querySelectorAll('.wax-seal')
};

const inventory = {
  slots: document.querySelectorAll('.inventory-slot')
};

const ambientElements = {
  dustParticles: document.querySelectorAll('.dust-particle'),
  candleGlow: document.querySelector('.candle-glow'),
  candleFlames: document.querySelectorAll('.candle-flame')
};

// Utility Functions
function calculateModifier(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function saveCharacter() {
  const characterData = {
    name: characterSheet.name.value,
    race: characterSheet.race.value,
    class: characterSheet.class.value,
    level: characterSheet.level.value,
    backstory: characterSheet.backstory.value,
    stats: {}
  };

  Object.keys(characterSheet.stats).forEach(stat => {
    characterData.stats[stat] = characterSheet.stats[stat].value;
  });

  localStorage.setItem('retroRpgCharacter', JSON.stringify(characterData));
}

function loadCharacter() {
  const savedData = localStorage.getItem('retroRpgCharacter');
  if (savedData) {
    const characterData = JSON.parse(savedData);
    
    characterSheet.name.value = characterData.name || '';
    characterSheet.race.value = characterData.race || '';
    characterSheet.class.value = characterData.class || '';
    characterSheet.level.value = characterData.level || 1;
    characterSheet.backstory.value = characterData.backstory || '';

    if (characterData.stats) {
      Object.keys(characterData.stats).forEach(stat => {
        if (characterSheet.stats[stat]) {
          characterSheet.stats[stat].value = characterData.stats[stat];
        }
      });
    }

    updateStatModifiers();
  }
}

function updateStatModifiers() {
  const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  stats.forEach((stat, index) => {
    const value = parseInt(characterSheet.stats[stat].value) || 10;
    characterSheet.mods[index].textContent = calculateModifier(value);
  });
}

// Spell Book Logic
const spells = {
  fireball: {
    name: 'Fireball',
    level: 'Lvl 3',
    school: 'Evocation',
    mana: 'Mana Cost: 45',
    desc: 'A bright streak flashes from your pointing finger to a point you choose within 120 feet and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot radius must make a Dexterity saving throw, taking 8d6 fire damage on a failed save, or half as much on a successful one.',
    tags: ['AoE', 'Fire', 'Damage'],
    icon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#FF5722" opacity="0.2"/>
      <circle cx="40" cy="40" r="20" fill="#FF5722" opacity="0.4"/>
      <circle cx="40" cy="40" r="10" fill="#FF5722"/>
      <path d="M40 10L45 30H65L50 42L55 62L40 50L25 62L30 42L15 30H35L40 10Z" fill="#FFD700"/>
    </svg>`
  },
  heal: {
    name: 'Healing Light',
    level: 'Lvl 2',
    school: 'Evocation',
    mana: 'Mana Cost: 30',
    desc: 'A warm light surrounds a creature of your choice within 60 feet, restoring 2d4+2 hit points. The light also cures one disease or condition affecting the target.',
    tags: ['Heal', 'Light', 'Single Target'],
    icon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#4CAF50" opacity="0.2"/>
      <circle cx="40" cy="40" r="20" fill="#4CAF50" opacity="0.4"/>
      <path d="M40 20L45 35H60L48 43L52 58L40 48L28 58L32 43L20 35H35L40 20Z" fill="#FFD700"/>
    </svg>`
  },
  shield: {
    name: 'Arcane Shield',
    level: 'Lvl 1',
    school: 'Abjuration',
    mana: 'Mana Cost: 20',
    desc: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have resistance to all damage from spells and magical effects.',
    tags: ['Defense', 'Barrier', 'Self'],
    icon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#2196F3" opacity="0.2"/>
      <path d="M40 15L55 25V45L40 55L25 45V25L40 15Z" fill="#1565C0" stroke="#0D47A1" stroke-width="2"/>
      <path d="M40 25L48 32V44L40 50L32 44V32L40 25Z" fill="#64B5F6"/>
    </svg>`
  },
  invisibility: {
    name: 'Invisibility',
    level: 'Lvl 2',
    school: 'Illusion',
    mana: 'Mana Cost: 35',
    desc: 'A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target\'s person. The spell ends for a target that attacks or casts a spell.',
    tags: ['Stealth', 'Utility', 'Single Target'],
    icon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#9C27B0" opacity="0.2"/>
      <path d="M25 35C25 35 30 30 40 30C50 30 55 35 55 35C55 35 55 45 55 50C55 55 50 60 40 60C30 60 25 55 25 50C25 45 25 35 25 35Z" fill="#E1BEE7" opacity="0.5"/>
      <circle cx="40" cy="40" r="15" fill="#CE93D8" opacity="0.3"/>
    </svg>`
  },
  lightning: {
    name: 'Lightning Bolt',
    level: 'Lvl 3',
    school: 'Evocation',
    mana: 'Mana Cost: 45',
    desc: 'A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much on a successful one.',
    tags: ['AoE', 'Lightning', 'Damage'],
    icon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#FFC107" opacity="0.2"/>
      <path d="M45 15L25 45H40L35 65L55 35H40L45 15Z" fill="#FFC107" stroke="#FFA000" stroke-width="2"/>
    </svg>`
  },
  teleport: {
    name: 'Teleport',
    level: 'Lvl 4',
    school: 'Conjuration',
    mana: 'Mana Cost: 60',
    desc: 'You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you are familiar with, or one that you can describe.',
    tags: ['Movement', 'Utility', 'Self'],
    icon: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#00BCD4" opacity="0.2"/>
      <circle cx="30" cy="35" r="8" fill="#00BCD4" opacity="0.6"/>
      <circle cx="50" cy="45" r="8" fill="#00BCD4" opacity="0.6"/>
      <path d="M38 37L42 43M42 37L38 43" stroke="#006064" stroke-width="2"/>
    </svg>`
  }
};

function displaySpell(spellKey) {
  const spell = spells[spellKey];
  if (!spell) return;

  const display = spellBook.activeDisplay;
  display.style.opacity = '0';
  display.style.transform = 'rotateY(90deg)';

  setTimeout(() => {
    display.innerHTML = `
      <div class="spell-icon">${spell.icon}</div>
      <h3 class="spell-name-display">${spell.name}</h3>
      <div class="spell-meta">
        <span class="spell-school">${spell.school}</span>
        <span class="spell-mana">${spell.mana}</span>
      </div>
      <p class="spell-desc">${spell.desc}</p>
      <div class="spell-tags">
        ${spell.tags.map(tag => `<span class="spell-tag">${tag}</span>`).join('')}
      </div>
    `;
    
    display.style.opacity = '1';
    display.style.transform = 'rotateY(0deg)';
  }, 200);
}

function updateActiveSpellItem() {
  spellBook.listItems.forEach((item, index) => {
    item.classList.toggle('active', index === spellBook.currentIndex);
  });
}

function nextSpell() {
  spellBook.currentIndex = (spellBook.currentIndex + 1) % spellBook.listItems.length;
  const spellKey = spellBook.listItems[spellBook.currentIndex].dataset.spell;
  displaySpell(spellKey);
  updateActiveSpellItem();
}

function prevSpell() {
  spellBook.currentIndex = (spellBook.currentIndex - 1 + spellBook.listItems.length) % spellBook.listItems.length;
  const spellKey = spellBook.listItems[spellBook.currentIndex].dataset.spell;
  displaySpell(spellKey);
  updateActiveSpellItem();
}

// Quest Board Logic
function toggleQuestStatus(card) {
  const isCompleted = card.classList.contains('completed');
  const seal = card.querySelector('.wax-seal');
  
  if (isCompleted) {
    card.classList.remove('completed');
    card.classList.add('active');
    if (seal) {
      seal.classList.remove('completed-seal');
      seal.classList.add('active-seal');
      seal.innerHTML = `<circle cx="20" cy="20" r="18" fill="#8B0000"/>
        <path d="M20 8L24 16H32L26 22L28 32L20 26L12 32L14 22L8 16H16L20 8Z" fill="#FFD700"/>`;
    }
  } else {
    card.classList.remove('active');
    card.classList.add('completed');
    if (seal) {
      seal.classList.remove('active-seal');
      seal.classList.add('completed-seal');
      seal.innerHTML = `<circle cx="20" cy="20" r="18" fill="#9E9E9E"/>
        <path d="M12 20L18 26L28 16" stroke="#FFD700" stroke-width="3" fill="none"/>`;
    }
  }
}

// Inventory Logic
function handleInventoryClick(slot) {
  if (slot.classList.contains('empty')) {
    // Visual feedback for empty slot click
    slot.style.borderColor = 'var(--gold)';
    slot.style.background = 'rgba(255, 215, 0, 0.1)';
    setTimeout(() => {
      slot.style.borderColor = '';
      slot.style.background = '';
    }, 300);
  }
}

// Ambient Effects
function createDynamicDust() {
  const ambientBg = document.querySelector('.ambient-bg');
  for (let i = 0; i < 15; i++) {
    const dust = document.createElement('div');
    dust.className = 'dust-particle';
    dust.style.left = `${Math.random() * 100}%`;
    dust.style.top = `${Math.random() * 100}%`;
    dust.style.animationDuration = `${15 + Math.random() * 20}s`;
    dust.style.animationDelay = `${-Math.random() * 20}s`;
    dust.style.width = `${1 + Math.random() * 2}px`;
    dust.style.height = dust.style.width;
    ambientBg.appendChild(dust);
  }
}

function updateCandleFlicker(e) {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  ambientElements.candleGlow.style.transform = `translateX(-50%) translate(${x * 20 - 10}px, ${y * 10 - 5}px)`;
  
  ambientElements.candleFlames.forEach(flame => {
    const scale = 0.9 + Math.random() * 0.2;
    const scaleX = 0.9 + Math.random() * 0.2;
    flame.style.transform = `scaleY(${scale}) scaleX(${scaleX})`;
  });
}

// Scroll Animations
function handleScroll() {
  const sections = document.querySelectorAll('.journal-section');
  const scrollY = window.scrollY;
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
    
    if (isVisible) {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }
  });

  // Parallax effect for dust particles
  ambientElements.dustParticles.forEach((particle, index) => {
    const speed = 0.2 + (index % 3) * 0.1;
    particle.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

// Event Listeners
function initEventListeners() {
  // Character Sheet
  Object.values(characterSheet.stats).forEach(input => {
    input.addEventListener('input', () => {
      updateStatModifiers();
      saveCharacter();
    });
  });

  ['name', 'race', 'class', 'level', 'backstory'].forEach(field => {
    characterSheet[field].addEventListener('input', saveCharacter);
  });

  // Spell Book
  spellBook.listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      spellBook.currentIndex = index;
      const spellKey = item.dataset.spell;
      displaySpell(spellKey);
      updateActiveSpellItem();
    });
  });

  spellBook.prevBtn.addEventListener('click', prevSpell);
  spellBook.nextBtn.addEventListener('click', nextSpell);

  // Keyboard navigation for spell book
  document.addEventListener('keydown', (e) => {
    const spellSection = document.getElementById('spell-book');
    const rect = spellSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      if (e.key === 'ArrowLeft') {
        prevSpell();
      } else if (e.key === 'ArrowRight') {
        nextSpell();
      }
    }
  });

  // Quest Board
  questBoard.cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking the string or thumbtack specifically
      if (e.target.closest('.thumbtack') || e.target.closest('.quest-string')) {
        return;
      }
      toggleQuestStatus(card);
    });
  });

  // Inventory
  inventory.slots.forEach(slot => {
    slot.addEventListener('click', () => handleInventoryClick(slot));
  });

  // Ambient Effects
  document.addEventListener('mousemove', updateCandleFlicker);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialization
function init() {
  loadCharacter();
  updateStatModifiers();
  createDynamicDust();
  initEventListeners();
  
  // Set initial spell display
  if (spellBook.listItems.length > 0) {
    const initialSpell = spellBook.listItems[0].dataset.spell;
    displaySpell(initialSpell);
  }

  // Initial scroll check
  handleScroll();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);