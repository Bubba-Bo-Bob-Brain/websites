// Character Data Store
const characters = {
  1: {
    name: "Aldric",
    class: "male",
    occupation: "⚒️ Blacksmith",
    alignment: "⚖️ Lawful Good",
    socialClass: "🏡 Commoner",
    plagueResistance: 75,
    faith: 20,
    health: 90,
    description: "A strong man with calloused hands, Aldric forged tools and weapons for the village. Though not particularly religious, his practical nature and loyalty to his community make him a reliable companion.",
    skills: [
      { name: "Weapon Crafting", value: "90%" },
      { name: "Strength", value: "95%" },
      { name: "Endurance", value: "85%" },
      { name: "Mining", value: "70%" },
      { name: "Leadership", value: "65%" }
    ],
    bonds: "Trusts Tomas and Sir Geoffrey deeply. Has a friendly rivalry with Mercator over trade matters. Protective of the village children."
  },
  2: {
    name: "Sister Beatrice",
    class: "female-nun",
    occupation: "⛪ Nun",
    alignment: "⚖️ Lawful Good",
    socialClass: "⛪ Clergy",
    plagueResistance: 40,
    faith: 95,
    health: 60,
    description: "Sister Beatrice serves at the local abbey, tending to the sick and recording the village's history. Her faith is unwavering, and she carries a small vial of holy water wherever she goes.",
    skills: [
      { name: "Healing", value: "85%" },
      { name: "Herbalism", value: "70%" },
      { name: "Calligraphy", value: "90%" },
      { name: "Sermon", value: "95%" },
      { name: "First Aid", value: "80%" }
    ],
    bonds: "Mentored by Brother Anselm. Works closely with Friar John. Cares for Ravena despite the villagers' suspicions."
  },
  3: {
    name: "Tomas",
    class: "farmer",
    occupation: "🌾 Farmer",
    alignment: "⚖️ Neutral Good",
    socialClass: "🏡 Commoner",
    plagueResistance: 85,
    faith: 30,
    health: 95,
    description: "Tomas works the fields from dawn till dusk, his skin weathered by the sun and his calloused hands know the earth better than any book. He is simple but kind-hearted, and trusts more in the soil than in prayers.",
    skills: [
      { name: "Farming", value: "98%" },
      { name: "Animal Husbandry", value: "90%" },
      { name: "Foraging", value: "85%" },
      { name: "Physical Labor", value: "95%" },
      { name: "Common Sense", value: "100%" }
    ],
    bonds: "Close friend of Aldric since childhood. Supplies food to the entire village. Respects Ulric's hunting skills despite their differences."
  },
  4: {
    name: "Lady Eleanor",
    class: "noblewoman",
    occupation: "👑 Noblewoman",
    alignment: "⚖️ Lawful Neutral",
    socialClass: "👑 Nobility",
    plagueResistance: 25,
    faith: 50,
    health: 45,
    description: "Lady Eleanor of the nearby manor is a woman of refined upbringing but now faces the harsh realities of the plague. She is accustomed to luxury but has learned to adapt, using her influence to protect her tenants.",
    skills: [
      { name: "Diplomacy", value: "90%" },
      { name: "Estate Management", value: "85%" },
      { name: "Etiquette", value: "95%" },
      { name: "Horsemanship", value: "75%" },
      { name: "Languages", value: "70%" }
    ],
    bonds: "Has a complicated relationship with Sir Geoffrey (mutual respect). Relies on Mercator for supplies. Secretly admires Ravena's independence."
  },
  5: {
    name: "Brother Anselm",
    class: "monk",
    occupation: "📜 Monk",
    alignment: "⚖️ Lawful Good",
    socialClass: "⛪ Clergy",
    plagueResistance: 35,
    faith: 98,
    health: 50,
    description: "Brother Anselm spends his days in the scriptorium copying ancient texts and studying the plague. His faith is his shield, and he believes the pestilence is a divine test.",
    skills: [
      { name: "Theology", value: "95%" },
      { name: "Latin", value: "90%" },
      { name: "Calligraphy", value: "85%" },
      { name: "Herbal Medicine", value: "60%" },
      { name: "Meditation", value: "100%" }
    ],
    bonds: "Mentors Sister Beatrice and Friar John. Disagrees with Ravena's methods but respects her results. Shares research with Brother Anselm (himself)."
  },
  6: {
    name: "Mercator",
    class: "merchant",
    occupation: "💰 Merchant",
    alignment: "⚖️ Neutral",
    socialClass: "💼 Merchant",
    plagueResistance: 30,
    faith: 40,
    health: 70,
    description: "Mercator travels from town to town with a caravan of goods. He is pragmatic and opportunistic, seeing the plague as both a danger and a chance for profit.",
    skills: [
      { name: "Bargaining", value: "95%" },
      { name: "Trade Routes", value: "90%" },
      { name: "Appraisal", value: "85%" },
      { name: "Persuasion", value: "80%" },
      { name: "Navigation", value: "75%" }
    ],
    bonds: "Does business with everyone but trusts no one. Has a soft spot for Isabelle's music. Supplies Lady Eleanor with luxuries at premium prices."
  },
  7: {
    name: "Ravena",
    class: "herbalist",
    occupation: "🌿 Herbalist",
    alignment: "🌪️ Chaotic Good",
    socialClass: "🏕️ Outcast",
    plagueResistance: 90,
    faith: 10,
    health: 80,
    description: "Ravena lives on the edge of the village, gathering herbs and brewing remedies. Though many call her a witch, her knowledge of plants has saved many lives, even if she herself is an outcast.",
    skills: [
      { name: "Herbalism", value: "100%" },
      { name: "Potion Brewing", value: "95%" },
      { name: "Plant Lore", value: "90%" },
      { name: "Stealth", value: "85%" },
      { name: "Wilderness Survival", value: "90%" }
    ],
    bonds: "Rescued by Ulric during a wolf attack. Treated by Sister Beatrice when ill. Secretly supplies Tomas with growth tonics for his crops."
  },
  8: {
    name: "Sir Geoffrey",
    class: "knight",
    occupation: "⚔️ Knight",
    alignment: "⚖️ Lawful Good",
    socialClass: "👑 Nobility",
    plagueResistance: 60,
    faith: 70,
    health: 85,
    description: "Sir Geoffrey serves as the local lord's protector. He is chivalrous and brave, though the plague has made his duty even more perilous. He carries a sword and a heart full of honor.",
    skills: [
      { name: "Swordsmanship", value: "90%" },
      { name: "Armor Maintenance", value: "85%" },
      { name: "Tactics", value: "80%" },
      { name: "Horsemanship", value: "95%" },
      { name: "Vigilance", value: "75%" }
    ],
    bonds: "Sworn to protect Lady Eleanor. Trains Tomas's sons in basic defense. Respects Aldric's craftsmanship (armor repairs)."
  },
  9: {
    name: "Maura",
    class: "midwife",
    occupation: "👶 Midwife",
    alignment: "⚖️ Neutral Good",
    socialClass: "🏡 Commoner",
    plagueResistance: 50,
    faith: 60,
    health: 65,
    description: "Maura has delivered dozens of babies in the village. She is calm and nurturing, with a gentle touch that comforts even the most frightened mothers.",
    skills: [
      { name: "Midwifery", value: "95%" },
      { name: "Herbal Remedies", value: "80%" },
      { name: "Childcare", value: "90%" },
      { name: "Bone Setting", value: "70%" },
      { name: "Empathy", value: "100%" }
    ],
    bonds: "Has delivered every child in the village for 20 years. Close friend of Sister Beatrice. Often consulted by Ravena on herbal remedies for mothers."
  },
  10: {
    name: "Friar John",
    class: "friar",
    occupation: "📿 Friar",
    alignment: "⚖️ Neutral Good",
    socialClass: "⛪ Clergy",
    plagueResistance: 45,
    faith: 85,
    health: 55,
    description: "Friar John walks among the people, spreading the word of God and tending to the poor. He is fiery in his sermons but compassionate in his actions.",
    skills: [
      { name: "Preaching", value: "95%" },
      { name: "Charity Work", value: "90%" },
      { name: "Conflict Resolution", value: "80%" },
      { name: "Hunting (for food)", value: "60%" },
      { name: "Cooking", value: "75%" }
    ],
    bonds: "Works the fields with Tomas when not preaching. Sometimes clashes with Brother Anselm over doctrine. Defends Ravena against accusations of witchcraft."
  },
  11: {
    name: "Ulric",
    class: "hunter",
    occupation: "🏹 Hunter",
    alignment: "🌪️ Chaotic Neutral",
    socialClass: "🏕️ Outcast",
    plagueResistance: 80,
    faith: 20,
    health: 90,
    description: "Ulric is a solitary figure who prefers the forest to the village. He trusts animals more than humans and supplies the village with game, though his suspicious nature makes him few friends.",
    skills: [
      { name: "Tracking", value: "95%" },
      { name: "Archery", value: "90%" },
      { name: "Trapping", value: "85%" },
      { name: "Wilderness Survival", value: "100%" },
      { name: "Animal Lore", value: "90%" }
    ],
    bonds: "Saved Ravena from a wolf attack. Supplies meat to Tomas and Aldric. Avoids the clergy but respects Friar John's honesty."
  },
  12: {
    name: "Isabelle",
    class: "bard",
    occupation: "🎵 Bard",
    alignment: "🌪️ Chaotic Good",
    socialClass: "🏡 Commoner",
    plagueResistance: 35,
    faith: 50,
    health: 60,
    description: "Isabelle travels from village to village with her lute, singing songs of old heroes and current tragedies. Her music lifts spirits in these dark times, and her tales remind people of what they fight for.",
    skills: [
      { name: "Music", value: "95%" },
      { name: "Storytelling", value: "90%" },
      { name: "Diplomacy", value: "80%" },
      { name: "Observation", value: "85%" },
      { name: "Morale Boosting", value: "100%" }
    ],
    bonds: "Good friends with Maura (writes songs about her deliveries). Has a romantic tension with Mercator. Inspired by Lady Eleanor's resilience."
  }
};

// DOM Elements
const modal = document.getElementById('character-modal');
const modalCloseBtn = document.querySelector('.modal-close');
const characterCards = document.querySelectorAll('.character-card');
const candlelight = document.getElementById('candlelight');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  setupModalListeners();
  setupCandlelight();
  setupScrollAnimations();
  setupCardInteractions();
});

// Modal functionality
function setupModalListeners() {
  // Open modal when clicking "View Details" button
  characterCards.forEach(card => {
    const viewBtn = card.querySelector('.view-details-btn');
    viewBtn.addEventListener('click', () => {
      const characterId = card.dataset.id;
      openCharacterModal(characterId);
    });
  });

  // Close modal with X button
  modalCloseBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

function openCharacterModal(id) {
  const character = characters[id];
  if (!character) return;

  // Populate modal with character data
  document.getElementById('modal-name').textContent = character.name;
  document.getElementById('modal-silhouette').className = `pixel-silhouette ${character.class}`;
  
  document.querySelector('.modal-occupation').textContent = character.occupation;
  document.querySelector('.modal-alignment').textContent = character.alignment;
  document.querySelector('.modal-social').textContent = character.socialClass;
  
  // Set stats with animation
  setStatBar('modal-plague', 'modal-plague-val', character.plagueResistance);
  setStatBar('modal-faith', 'modal-faith-val', character.faith);
  setStatBar('modal-health', 'modal-health-val', character.health);
  
  // Populate skills
  const skillsList = document.getElementById('modal-skills');
  skillsList.innerHTML = '';
  character.skills.forEach(skill => {
    const li = document.createElement('li');
    li.innerHTML = `${skill.name} <span>${skill.value}</span>`;
    skillsList.appendChild(li);
  });
  
  // Populate bonds and description
  document.getElementById('modal-bonds').textContent = character.bonds;
  document.getElementById('modal-desc').textContent = character.description;
  
  // Show modal with animation
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Trigger stat bar animations after a short delay
  setTimeout(() => {
    animateStatBars();
  }, 100);
}

function setStatBar(fillId, valId, value) {
  const fill = document.getElementById(fillId);
  const val = document.getElementById(valId);
  fill.style.width = '0%';
  val.textContent = `${value}%`;
}

function animateStatBars() {
  const fills = document.querySelectorAll('.stat-fill');
  fills.forEach(fill => {
    const targetWidth = fill.parentElement.nextElementSibling.textContent;
    fill.style.width = targetWidth;
  });
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  // Reset stat bars
  document.querySelectorAll('.stat-fill').forEach(fill => {
    fill.style.width = '0%';
  });
}

// Candlelight effect that follows mouse
function setupCandlelight() {
  let mouseX = 50;
  let mouseY = 50;
  let targetX = 50;
  let targetY = 50;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
  });

  function animateCandlelight() {
    // Smooth interpolation
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;
    
    candlelight.style.setProperty('--mouse-x', `${mouseX}%`);
    candlelight.style.setProperty('--mouse-y', `${mouseY}%`);
    
    requestAnimationFrame(animateCandlelight);
  }
  
  animateCandlelight();
}

// Scroll animations for cards
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100); // Stagger effect within viewport
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  characterCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Additional card interactions
function setupCardInteractions() {
  characterCards.forEach(card => {
    // Add subtle tilt effect on hover (for desktop)
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return; // Disable on mobile
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    
    // Add random flicker to pixel silhouettes occasionally
    const silhouette = card.querySelector('.pixel-silhouette');
    if (silhouette) {
      setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance every interval
          silhouette.style.filter = `drop-shadow(0 0 15px var(--glow-gold)) brightness(${0.7 + Math.random() * 0.3})`;
          setTimeout(() => {
            silhouette.style.filter = '';
          }, 100 + Math.random() * 200);
        }
      }, 2000);
    }
  });
}

// Add subtle particle effects on card hover
function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.width = '4px';
  particle.style.height = '4px';
  particle.style.background = 'var(--accent-gold)';
  particle.style.borderRadius = '50%';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '9999';
  particle.style.boxShadow = '0 0 6px var(--glow-gold)';
  
  document.body.appendChild(particle);
  
  const angle = Math.random() * Math.PI * 2;
  const velocity = 20 + Math.random() * 30;
  const lifetime = 500 + Math.random() * 500;
  
  let opacity = 1;
  let currentX = x;
  let currentY = y;
  let vx = Math.cos(angle) * velocity;
  let vy = Math.sin(angle) * velocity;
  
  const startTime = Date.now();
  
  function animateParticle() {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / lifetime;
    
    if (progress >= 1) {
      particle.remove();
      return;
    }
    
    currentX += vx;
    currentY += vy;
    opacity = 1 - progress;
    
    particle.style.left = `${currentX}px`;
    particle.style.top = `${currentY}px`;
    particle.style.opacity = opacity;
    
    requestAnimationFrame(animateParticle);
  }
  
  requestAnimationFrame(animateParticle);
}

// Add particle creation on card click
document.querySelectorAll('.view-details-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create 8 particles
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        createParticle(centerX, centerY);
      }, i * 30);
    }
  });
});

// Easter egg: Konami code reveals a secret character (just for fun)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      // Secret: Add a 13th character temporarily
      addSecretCharacter();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function addSecretCharacter() {
  const secretHTML = `
    <article class="character-card" data-id="13" style="animation: pulse 2s infinite;">
      <div class="portrait-frame">
        <div class="portrait-placeholder male">
          <div class="pixel-silhouette" style="background: linear-gradient(45deg, #ff00ff, #00ffff);"></div>
        </div>
        <div class="character-name">The Plague Doctor</div>
      </div>
      <div class="card-stats">
        <div class="stat"><span class="emoji">🛡️</span> <span class="label">Plague</span> <span class="value">100%</span></div>
        <div class="stat"><span class="emoji">✝️</span> <span class="label">Faith</span> <span class="value">0%</span></div>
        <div class="stat"><span class="emoji">❤️</span> <span class="label">Health</span> <span class="value">∞</span></div>
      </div>
      <div class="card-details">
        <p class="occupation">🩺 Plague Doctor</p>
        <p class="alignment">⚖️ True Neutral</p>
        <p class="social-class">💀 Undead</p>
      </div>
      <p class="description">Some say he walks still, a figure of beak and cloak, neither living nor dead. He has seen every plague since the Crusades and will outlast this one too. His presence is an omen—some say he brings death, others say he prevents it. No one knows which is true.</p>
      <button class="view-details-btn">View Details</button>
    </article>
  `;
  
  const gallery = document.querySelector('.character-gallery');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = secretHTML;
  const secretCard = tempDiv.firstElementChild;
  
  // Add to data store
  characters[13] = {
    name: "The Plague Doctor",
    class: "",
    occupation: "🩺 Plague Doctor",
    alignment: "⚖️ True Neutral",
    socialClass: "💀 Undead",
    plagueResistance: 100,
    faith: 0,
    health: 100,
    description: "Some say he walks still, a figure of beak and cloak, neither living nor dead. He has seen every plague since the Crusades and will outlast this one too. His presence is an omen—some say he brings death, others say he prevents it. No one knows which is true.",
    skills: [
      { name: "Plague Lore", value: "100%" },
      { name: "Death's Embrace", value: "∞" },
      { name: "Timelessness", value: "∞" },
      { name: "Fear", value: "100%" },
      { name: "Mystery", value: "∞" }
    ],
    bonds: "Appears to no one and everyone. Some claim he visits the dying. Others say he watches Ravena's work with interest. The children whisper he lives in the old cemetery."
  };
  
  // Add event listener to new card
  secretCard.querySelector('.view-details-btn').addEventListener('click', () => {
    openCharacterModal('13');
  });
  
  gallery.appendChild(secretCard);
  
  // Re-setup scroll animations for the new card
  setupScrollAnimations();
  setupCardInteractions();
  
  // Visual feedback
  alert('🔓 Secret character unlocked: The Plague Doctor!');
}

// Add pulse animation for secret character
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(139, 35, 35, 0.7); }
    50% { box-shadow: 0 0 20px 10px rgba(139, 35, 35, 0); }
  }
`;
document.head.appendChild(style);