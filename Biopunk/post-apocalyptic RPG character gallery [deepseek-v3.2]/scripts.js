// ============================================
// BIO-DATA TERMINAL v2.7.3 - SCRIPTS
// Retro Pixel-Art Biopunk RPG Character Gallery
// ============================================

// ========== CHARACTER DATA ==========
const characters = [
  {
    id: 1,
    name: "CYRUS 'CHROMESKIN' VEX",
    faction: "neo-splicers",
    mutationLevel: 92,
    contamination: "critical",
    vitalSigns: "UNSTABLE",
    bio: "Former corporate bio-engineer turned rogue gene-splicer. His skin produces metallic chromium plating when threatened. Last known location: Sector 7 containment zone. Shows signs of advanced nano-machine assimilation.",
    skills: [
      { name: "GENETIC MANIPULATION", value: 95 },
      { name: "COMBAT ADAPTATION", value: 88 },
      { name: "TOXIC RESISTANCE", value: 76 },
      { name: "SYSTEM HACKING", value: 82 }
    ],
    mutations: ["Chromium Skin Synthesis", "Neural Interface Ports", "Toxin Filtration Organs", "Retractable Bone Blades"],
    timestamp: "23:47:12"
  },
  {
    id: 2,
    name: "LYRA 'PURE-SIGHT' KESSLER",
    faction: "pure-genes",
    mutationLevel: 12,
    contamination: "clean",
    vitalSigns: "OPTIMAL",
    bio: "Leader of the Pure-Genes faction. Advocates for genetic purity and eradication of bio-modifications. Possesses heightened senses and cognitive abilities from selective breeding programs. Wanted for anti-splicer activities.",
    skills: [
      { name: "STRATEGIC PLANNING", value: 94 },
      { name: "MARKSMANSHIP", value: 89 },
      { name: "STEALTH", value: 85 },
      { name: "GENETIC ANALYSIS", value: 91 }
    ],
    mutations: ["Enhanced Vision", "Cognitive Acceleration", "Adrenal Control", "Immune System Optimization"],
    timestamp: "08:15:33"
  },
  {
    id: 3,
    name: "GRONK 'MUTANT-THREE'",
    faction: "mutant-tribes",
    mutationLevel: 78,
    contamination: "exposed",
    vitalSigns: "RESILIENT",
    bio: "Mutant tribe chieftain from the irradiated wastes. Exhibits extreme physical adaptations including secondary arms and reinforced skeletal structure. Communicates through chemical pheromones and gutteral sounds.",
    skills: [
      { name: "RAW STRENGTH", value: 98 },
      { name: "RADIATION ABSORPTION", value: 92 },
      { name: "PACK TACTICS", value: 87 },
      { name: "TERRAIN MASTERY", value: 83 }
    ],
    mutations: ["Quadrupedal Adaptation", "Radiotrophic Metabolism", "Dermal Armor Plating", "Pheromone Glands"],
    timestamp: "15:22:47"
  },
  {
    id: 4,
    name: "SILAS 'GHOST-SPLICE' REVERE",
    faction: "rogue-splicers",
    mutationLevel: 65,
    contamination: "critical",
    vitalSigns: "FLUCTUATING",
    bio: "Mercenary gene-thief with chameleonic skin and optical camouflage. Known for infiltrating corporate labs and stealing experimental bio-tech. Current whereabouts unknown - last transmission indicated severe genetic deterioration.",
    skills: [
      { name: "INFILTRATION", value: 96 },
      { name: "BIOTECH THEFT", value: 90 },
      { name: "ESCAPE ARTISTRY", value: 93 },
      { name: "DISGUISE", value: 97 }
    ],
    mutations: ["Active Camouflage", "Facial Bone Restructuring", "Auditory Enhancement", "Adrenal Overclocking"],
    timestamp: "19:11:05"
  },
  {
    id: 5,
    name: "DR. ELARA VOSS",
    faction: "neo-splicers",
    mutationLevel: 84,
    contamination: "exposed",
    vitalSigns: "STABLE",
    bio: "Lead researcher at Neo-Gen Corporation's experimental division. Voluntarily underwent extensive gene-modification to test prototype enhancements. Developed photosynthetic skin and neural interface with plant-life.",
    skills: [
      { name: "GENETIC ENGINEERING", value: 99 },
      { name: "BOTANICAL CONTROL", value: 95 },
      { name: "NEURAL INTERFACING", value: 91 },
      { name: "DATA ANALYSIS", value: 88 }
    ],
    mutations: ["Photosynthetic Dermis", "Root-like Neural Extensions", "Chlorophyll Production", "Spore Dispersal"],
    timestamp: "12:09:21"
  },
  {
    id: 6,
    name: "KAI 'CLEAN-BLOOD' NAKAMURA",
    faction: "pure-genes",
    mutationLevel: 8,
    contamination: "clean",
    vitalSigns: "OPTIMAL",
    bio: "Enforcer for the Pure-Genes faction. Descendant of one of the few families to survive the bio-plagues without mutation. Enhanced through rigorous training and advanced cybernetics (permitted as 'non-genetic' modification).",
    skills: [
      { name: "HAND-TO-HAND COMBAT", value: 97 },
      { name: "CYBERNETIC INTEGRATION", value: 89 },
      { name: "INTERROGATION", value: 85 },
      { name: "TACTICAL DEPLOYMENT", value: 92 }
    ],
    mutations: ["None (Purified Genome)", "Cyberware Compatibility", "Adrenal Control", "Enhanced Reflexes"],
    timestamp: "06:45:18"
  },
  {
    id: 7,
    name: "MORDRED 'BONE-SHAPER'",
    faction: "mutant-tribes",
    mutationLevel: 88,
    contamination: "critical",
    vitalSigns: "VOLATILE",
    bio: "Tribal shaman who can consciously manipulate his own skeletal structure. Creates weapons and tools from his bones. Considered a living deity by the mutant tribes. Shows signs of advanced bio-contamination and psychic emanations.",
    skills: [
      { name: "BONE MANIPULATION", value: 100 },
      { name: "PSYCHIC PROJECTION", value: 82 },
      { name: "RITUAL LEADERSHIP", value: 90 },
      { name: "TOXIN PRODUCTION", value: 87 }
    ],
    mutations: ["Osteokinetic Control", "Psychic Emanations", "Regenerative Skeleton", "Toxic Bone Marrow"],
    timestamp: "03:33:33"
  },
  {
    id: 8,
    name: "VEN 'DOUBLE-HELIX'",
    faction: "rogue-splicers",
    mutationLevel: 71,
    contamination: "exposed",
    vitalSigns: "STABLE",
    bio: "Former Neo-Gen security officer who stole experimental dual-genome technology. Now hosts two distinct genetic profiles that can switch dominance. Exhibits personality fragmentation and occasional genetic memory bleed-through.",
    skills: [
      { name: "ADAPTIVE COMBAT", value: 93 },
      { name: "GENETIC MEMORY ACCESS", value: 87 },
      { name: "SECURITY SYSTEMS", value: 91 },
      { name: "PSYCHOLOGICAL WARFARE", value: 84 }
    ],
    mutations: ["Dual Genome System", "Personality Partitioning", "Genetic Memory Storage", "Adaptive Immune Response"],
    timestamp: "21:14:29"
  },
  {
    id: 9,
    name: "ZARA 'SYNTH-FLESH' CORVUS",
    faction: "neo-splicers",
    mutationLevel: 95,
    contamination: "critical",
    vitalSigns: "UNSTABLE",
    bio: "Radical bio-artist who replaces body parts with experimental synthetic-biological hybrids. Her work blurs the line between organism and machine. Currently 67% synthetic by mass. Considered dangerously unstable by corporate standards.",
    skills: [
      { name: "SYNTH-BIO FABRICATION", value: 98 },
      { name: "NEURAL NETWORKING", value: 94 },
      { name: "ARTIFICIAL ORGAN DESIGN", value: 96 },
      { name: "CYBERNETIC INTEGRATION", value: 92 }
    ],
    mutations: ["Synthetic Tissue Growth", "Modular Organ Systems", "Neural Network Expansion", "Energy Production"],
    timestamp: "17:52:44"
  },
  {
    id: 10,
    name: "THORNE 'IRON-WILL' VALERIUS",
    faction: "pure-genes",
    mutationLevel: 15,
    contamination: "clean",
    vitalSigns: "OPTIMAL",
    bio: "Pure-Genes strategist and philosopher. Advocates for human purity through mental and physical discipline rather than genetic modification. Despite clean genetics, shows exceptional willpower that some suspect may be latent psychic ability.",
    skills: [
      { name: "STRATEGIC COMMAND", value: 96 },
      { name: "PSYCHOLOGICAL ANALYSIS", value: 92 },
      { name: "MARTIAL DISCIPLINE", value: 89 },
      { name: "LOGISTICAL PLANNING", value: 94 }
    ],
    mutations: ["Suspected Latent Psionics", "Enhanced Willpower", "Adrenal Control", "Cognitive Fortitude"],
    timestamp: "10:28:07"
  },
  {
    id: 11,
    name: "BRUTE 'MANY-MOUTHS'",
    faction: "mutant-tribes",
    mutationLevel: 82,
    contamination: "exposed",
    vitalSigns: "RESILIENT",
    bio: "Scavenger mutant with multiple feeding orifices and a decentralized digestive system. Can consume and process almost any organic matter. Acts as a living waste processor for his tribe. Shows signs of sentient fungal symbiosis.",
    skills: [
      { name: "MATERIAL PROCESSING", value: 100 },
      { name: "TOXIN NEUTRALIZATION", value: 95 },
      { name: "SCAVENGING", value: 97 },
      { name: "SYMBIOTIC RELATIONS", value: 88 }
    ],
    mutations: ["Multiple Digestive Systems", "Fungal Symbiosis", "Acidic Secretions", "Regenerative Gut Flora"],
    timestamp: "14:16:39"
  },
  {
    id: 12,
    name: "NEXUS 'DATA-GHOST'",
    faction: "rogue-splicers",
    mutationLevel: 59,
    contamination: "critical",
    vitalSigns: "TERMINAL",
    bio: "Hacker who uploaded his consciousness into a bio-electrical network. Now exists as a distributed intelligence across multiple contaminated systems. Physical body is a decaying husk maintained by life support. Considered a digital plague vector.",
    skills: [
      { name: "SYSTEM HACKING", value: 99 },
      { name: "DATA ASSIMILATION", value: 97 },
      { name: "NETWORK PROPAGATION", value: 100 },
      { name: "DIGITAL CAMOUFLAGE", value: 95 }
    ],
    mutations: ["Distributed Consciousness", "Bio-Electrical Interface", "Neural Network Expansion", "Digital Plague Vector"],
    timestamp: "00:01:00"
  }
];

// ========== GLOBAL VARIABLES ==========
let currentFilters = {
  faction: 'all',
  mutationLevel: 100,
  contamination: 'all'
};
let currentView = 'grid';
let activeCharacterModal = null;

// ========== DOM ELEMENTS ==========
const charactersGrid = document.getElementById('charactersGrid');
const characterModal = document.getElementById('characterModal');
const modalClose = document.getElementById('modalClose');
const mutationFilter = document.getElementById('mutationFilter');
const mutationSliderValue = document.querySelector('.mutation-slider-value');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  initializeGallery();
  setupEventListeners();
  updateDatabaseStats();
  
  // Initial glitch effect on title
  setTimeout(() => {
    document.querySelector('.glitch').style.animation = 'glitch-animation 5s infinite';
  }, 1000);
});

// ========== GALLERY FUNCTIONS ==========
function initializeGallery() {
  renderCharacters(characters);
}

function renderCharacters(charactersArray) {
  charactersGrid.innerHTML = '';
  
  charactersArray.forEach(character => {
    const characterCard = createCharacterCard(character);
    charactersGrid.appendChild(characterCard);
  });
  
  // Update active filter count
  updateActiveFilterCount();
}

function createCharacterCard(character) {
  const card = document.createElement('div');
  card.className = 'character-card';
  card.dataset.id = character.id;
  card.dataset.faction = character.faction;
  card.dataset.mutation = character.mutationLevel;
  card.dataset.contamination = character.contamination;
  
  // Determine contamination dots
  let contaminationDots = '';
  let dotClass = '';
  let dotCount = 1;
  
  switch(character.contamination) {
    case 'clean':
      dotClass = 'clean';
      dotCount = 1;
      break;
    case 'exposed':
      dotClass = 'exposed';
      dotCount = 2;
      break;
    case 'critical':
      dotClass = 'critical';
      dotCount = 3;
      break;
  }
  
  for (let i = 0; i < 3; i++) {
    if (i < dotCount) {
      contaminationDots += `<div class="contamination-dot ${dotClass}"></div>`;
    } else {
      contaminationDots += '<div class="contamination-dot" style="background-color: #333;"></div>';
    }
  }
  
  // Determine faction badge color
  let factionBadgeClass = '';
  switch(character.faction) {
    case 'neo-splicers':
      factionBadgeClass = 'neo-splicers';
      break;
    case 'pure-genes':
      factionBadgeClass = 'pure-genes';
      break;
    case 'mutant-tribes':
      factionBadgeClass = 'mutant-tribes';
      break;
    case 'rogue-splicers':
      factionBadgeClass = 'rogue-splicers';
      break;
  }
  
  card.innerHTML = `
    <div class="character-portrait">
      <div class="portrait-placeholder">
        <div class="placeholder-text">SUBJECT ${character.id.toString().padStart(3, '0')}</div>
        <div class="placeholder-subtext">// IMAGE CORRUPTED</div>
      </div>
      <div class="portrait-scanning"></div>
    </div>
    <div class="character-info">
      <h3 class="character-name">${character.name}</h3>
      <div class="character-faction">
        <span class="faction-badge ${factionBadgeClass}"></span>
        <span class="faction-name">${character.faction.replace('-', ' ').toUpperCase()}</span>
      </div>
      <div class="character-stats">
        <div class="stat-item-small">
          <div class="stat-label-small">MUTATION</div>
          <div class="stat-value-small">${character.mutationLevel}%</div>
        </div>
        <div class="stat-item-small">
          <div class="stat-label-small">CONTAMINATION</div>
          <div class="contamination-indicator-small">
            <div class="contamination-dots-small">
              ${contaminationDots}
            </div>
          </div>
        </div>
      </div>
      <div class="dna-progress">
        <div class="dna-progress-label">
          <span>DNA STABILITY</span>
          <span>${character.mutationLevel}%</span>
        </div>
        <div class="dna-progress-bar">
          <div class="dna-progress-fill" style="width: ${character.mutationLevel}%"></div>
          <div class="dna-strand"></div>
        </div>
      </div>
    </div>
  `;
  
  // Add click event to open modal
  card.addEventListener('click', () => openCharacterModal(character.id));
  
  return card;
}

// ========== FILTER FUNCTIONS ==========
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      const filterType = this.dataset.filter;
      const filterValue = this.dataset.value;
      
      // Update active state
      document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Update filter
      currentFilters[filterType] = filterValue;
      applyFilters();
    });
  });
  
  // Contamination filters
  document.querySelectorAll('.contamination-filter').forEach(button => {
    button.addEventListener('click', function() {
      const filterType = this.dataset.filter;
      const filterValue = this.dataset.value;
      
      // Update active state
      document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Update filter
      currentFilters[filterType] = filterValue;
      applyFilters();
    });
  });
  
  // Mutation slider
  mutationFilter.addEventListener('input', function() {
    const value = this.value;
    mutationSliderValue.textContent = `MAX: ${value}%`;
    currentFilters.mutationLevel = parseInt(value);
    applyFilters();
  });
  
  // View controls
  document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', function() {
      const viewType = this.dataset.view;
      
      // Update active state
      document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Change view
      currentView = viewType;
      if (viewType === 'list') {
        charactersGrid.style.gridTemplateColumns = '1fr';
      } else {
        charactersGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
      }
    });
  });
  
  // Modal close
  modalClose.addEventListener('click', closeCharacterModal);
  
  // Close modal when clicking outside
  characterModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeCharacterModal();
    }
  });
  
  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && characterModal.classList.contains('active')) {
      closeCharacterModal();
    }
  });
  
  // Action buttons in modal
  document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', function() {
      const btnType = this.classList.contains('download-btn') ? 'download' : 
                     this.classList.contains('tag-btn') ? 'tag' : 'termination';
      
      handleActionButton(btnType);
    });
  });
}

function applyFilters() {
  const filteredCharacters = characters.filter(character => {
    // Faction filter
    if (currentFilters.faction !== 'all' && character.faction !== currentFilters.faction) {
      return false;
    }
    
    // Mutation level filter
    if (character.mutationLevel > currentFilters.mutationLevel) {
      return false;
    }
    
    // Contamination filter
    if (currentFilters.contamination !== 'all' && character.contamination !== currentFilters.contamination) {
      return false;
    }
    
    return true;
  });
  
  renderCharacters(filteredCharacters);
  updateDatabaseStats(filteredCharacters);
}

function updateActiveFilterCount() {
  let activeCount = 0;
  
  if (currentFilters.faction !== 'all') activeCount++;
  if (currentFilters.mutationLevel < 100) activeCount++;
  if (currentFilters.contamination !== 'all') activeCount++;
  
  document.querySelector('.active-filters').textContent = `${activeCount} ACTIVE`;
}

function updateDatabaseStats(filteredCharacters = characters) {
  // Calculate stats
  const totalRecords = filteredCharacters.length;
  const mutationAvg = filteredCharacters.length > 0 ? 
    Math.round(filteredCharacters.reduce((sum, char) => sum + char.mutationLevel, 0) / filteredCharacters.length) : 0;
  
  // Calculate survival rate (mock calculation based on contamination)
  let survivalRate = 0;
  if (filteredCharacters.length > 0) {
    const survivors = filteredCharacters.filter(char => char.vitalSigns !== 'TERMINAL' && char.vitalSigns !== 'UNSTABLE').length;
    survivalRate = Math.round((survivors / filteredCharacters.length) * 100);
  }
  
  // Update DOM
  document.querySelectorAll('.stat-item')[0].querySelector('.stat-value').textContent = totalRecords;
  document.querySelectorAll('.stat-item')[1].querySelector('.stat-value').textContent = `${mutationAvg}%`;
  document.querySelectorAll('.stat-item')[2].querySelector('.stat-value').textContent = `${survivalRate}%`;
}

// ========== MODAL FUNCTIONS ==========
function openCharacterModal(characterId) {
  const character = characters.find(char => char.id === characterId);
  if (!character) return;
  
  activeCharacterModal = characterId;
  
  // Populate modal with character data
  document.getElementById('modalCharacterName').textContent = character.name;
  
  // Faction badge
  const factionBadge = document.getElementById('modalFaction');
  factionBadge.className = `faction-badge ${character.faction}`;
  document.getElementById('modalFactionName').textContent = character.faction.replace('-', ' ').toUpperCase();
  
  // Mutation level
  document.getElementById('modalMutationBar').style.width = `${character.mutationLevel}%`;
  document.getElementById('modalMutationValue').textContent = `${character.mutationLevel}%`;
  
  // Contamination
  const contaminationDots = document.querySelector('#modalContamination .contamination-dots');
  contaminationDots.innerHTML = '';
  
  let dotCount = 0;
  let dotClass = '';
  let contaminationText = '';
  
  switch(character.contamination) {
    case 'clean':
      dotCount = 1;
      dotClass = 'clean';
      contaminationText = 'CLEAN';
      break;
    case 'exposed':
      dotCount = 2;
      dotClass = 'exposed';
      contaminationText = 'EXPOSED';
      break;
    case 'critical':
      dotCount = 3;
      dotClass = 'critical';
      contaminationText = 'CRITICAL';
      break;
  }
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = `contamination-dot ${i < dotCount ? dotClass : ''}`;
    if (i >= dotCount) {
      dot.style.backgroundColor = '#333';
    }
    contaminationDots.appendChild(dot);
  }
  
  document.getElementById('modalContaminationText').textContent = contaminationText;
  
  // Vital signs
  document.getElementById('modalVitalSigns').textContent = character.vitalSigns;
  
  // Skills
  const skillsContainer = document.getElementById('modalSkills');
  skillsContainer.innerHTML = '';
  
  character.skills.forEach(skill => {
    const skillElement = document.createElement('div');
    skillElement.className = 'skill-item';
    skillElement.innerHTML = `
      <div class="skill-name">
        <span>${skill.name}</span>
        <span class="skill-value">${skill.value}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-progress" style="width: ${skill.value}%"></div>
      </div>
    `;
    skillsContainer.appendChild(skillElement);
  });
  
  // Biography
  document.getElementById('modalBio').textContent = character.bio;
  
  // Mutations
  const mutationsList = document.getElementById('modalMutations');
  mutationsList.innerHTML = '';
  
  character.mutations.forEach(mutation => {
    const mutationElement = document.createElement('div');
    mutationElement.className = 'mutation-tag';
    mutationElement.textContent = mutation;
    mutationsList.appendChild(mutationElement);
  });
  
  // Timestamp
  document.getElementById('modalTimestamp').textContent = character.timestamp;
  
  // Show modal with animation
  characterModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Add scanning sound effect (simulated)
  playScanSound();
}

function closeCharacterModal() {
  characterModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  activeCharacterModal = null;
}

function handleActionButton(actionType) {
  if (!activeCharacterModal) return;
  
  const character = characters.find(char => char.id === activeCharacterModal);
  if (!character) return;
  
  let message = '';
  let soundType = '';
  
  switch(actionType) {
    case 'download':
      message = `Downloading bio-data for ${character.name}...`;
      soundType = 'download';
      simulateDownload(character);
      break;
    case 'tag':
      message = `Tagging ${character.name} for retrieval...`;
      soundType = 'tag';
      // In a real app, this would tag the character in the database
      break;
    case 'termination':
      message = `WARNING: Termination order issued for ${character.name}`;
      soundType = 'warning';
      showTerminationWarning(character);
      break;
  }
  
  // Show notification
  showTerminalNotification(message);
  playActionSound(soundType);
}

// ========== SOUND EFFECTS (Simulated) ==========
function playScanSound() {
  // In a real implementation, this would play an actual sound
  console.log('[SOUND] Playing bio-scan sound effect');
}

function playActionSound(soundType) {
  // In a real implementation, this would play different sounds
  console.log(`[SOUND] Playing ${soundType} sound effect`);
}

// ========== UI EFFECTS ==========
function showTerminalNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'terminal-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon"><i class="fas fa-terminal"></i></span>
      <span class="notification-text">${message}</span>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function simulateDownload(character) {
  // Create a fake download
  const dataStr = `BIO-DATA RECORD\n================\nName: ${character.name}\nFaction: ${character.faction}\nMutation Level: ${character.mutationLevel}%\nContamination: ${character.contamination}\nVital Signs: ${character.vitalSigns}\n\nBiography:\n${character.bio}\n\nSkills:\n${character.skills.map(s => `${s.name}: ${s.value}%`).join('\n')}\n\nMutations:\n${character.mutations.join('\n')}\n\nTimestamp: ${character.timestamp}\n\n// END TRANSMISSION`;
  
  // In a real implementation, this would trigger an actual download
  console.log('[DOWNLOAD] Bio-data prepared for download:', dataStr);
  
  // Show completion notification after delay
  setTimeout(() => {
    showTerminalNotification(`Download complete: ${character.name}.bio`);
  }, 1500);
}

function showTerminationWarning(character) {
  // Create warning modal
  const warningModal = document.createElement('div');
  warningModal.className = 'warning-modal';
  warningModal.innerHTML = `
    <div class="warning-content">
      <div class="warning-header">
        <i class="fas fa-skull-crossbones"></i>
        <h3>TERMINATION ORDER CONFIRMATION</h3>
      </div>
      <div class="warning-body">
        <p>You are about to issue a termination order for:</p>
        <p class="warning-target">${character.name}</p>
        <p class="warning-details">Faction: ${character.faction.replace('-', ' ').toUpperCase()}<br>
        Mutation Level: ${character.mutationLevel}%<br>
        Status: ${character.vitalSigns}</p>
        <p class="warning-alert">This action cannot be undone. Confirm termination?</p>
      </div>
      <div class="warning-actions">
        <button class="warning-btn confirm-btn">CONFIRM TERMINATION</button>
        <button class="warning-btn cancel-btn">CANCEL</button>
      </div>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(warningModal);
  
  // Show modal
  setTimeout(() => {
    warningModal.classList.add('show');
  }, 10);
  
  // Add event listeners
  warningModal.querySelector('.confirm-btn').addEventListener('click', () => {
    // In a real app, this would actually mark the character for termination
    showTerminalNotification(`TERMINATION ORDER ISSUED: ${character.name}`);
    warningModal.classList.remove('show');
    setTimeout(() => {
      if (warningModal.parentNode) {
        warningModal.parentNode.removeChild(warningModal);
      }
    }, 300);
  });
  
  warningModal.querySelector('.cancel-btn').addEventListener('click', () => {
    warningModal.classList.remove('show');
    setTimeout(() => {
      if (warningModal.parentNode) {
        warningModal.parentNode.removeChild(warningModal);
      }
    }, 300);
  });
  
  // Close when clicking outside
  warningModal.addEventListener('click', function(e) {
    if (e.target === this) {
      warningModal.classList.remove('show');
      setTimeout(() => {
        if (warningModal.parentNode) {
          warningModal.parentNode.removeChild(warningModal);
        }
      }, 300);
    }
  });
}

// ========== DYNAMIC CSS FOR NOTIFICATIONS ==========
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .terminal-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--terminal-surface);
      border: 2px solid var(--bio-green);
      padding: var(--spacing-md) var(--spacing-lg);
      font-family: var(--font-terminal);
      color: var(--bio-cyan);
      z-index: 2000;
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 157, 0.3);
      max-width: 350px;
    }
    
    .terminal-notification.show {
      transform: translateX(0);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }
    
    .notification-icon {
      color: var(--bio-green);
      font-size: 1.2rem;
    }
    
    .notification-text {
      font-size: 0.9rem;
    }
    
    .warning-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(10, 10, 18, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2001;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    
    .warning-modal.show {
      opacity: 1;
      pointer-events: all;
    }
    
    .warning-content {
      background-color: var(--terminal-surface);
      border: 2px solid var(--status-critical);
      padding: var(--spacing-xl);
      max-width: 500px;
      width: 90%;
      box-shadow: 0 0 30px rgba(255, 0, 85, 0.5);
    }
    
    .warning-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
      color: var(--status-critical);
    }
    
    .warning-header i {
      font-size: 2rem;
    }
    
    .warning-header h3 {
      font-family: var(--font-pixel);
      font-size: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .warning-body {
      margin-bottom: var(--spacing-xl);
      color: var(--bio-cyan);
      line-height: 1.6;
    }
    
    .warning-target {
      font-family: var(--font-pixel);
      font-size: 1.8rem;
      color: var(--bio-green);
      margin: var(--spacing-md) 0;
      text-align: center;
    }
    
    .warning-details {
      background-color: rgba(26, 26, 46, 0.5);
      padding: var(--spacing-md);
      border: 1px solid var(--terminal-border);
      margin: var(--spacing-md) 0;
      font-size: 0.9rem;
    }
    
    .warning-alert {
      color: var(--status-critical);
      font-weight: bold;
      text-align: center;
      margin-top: var(--spacing-lg);
    }
    
    .warning-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
    }
    
    .warning-btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: 1px solid var(--terminal-border);
      background-color: rgba(26, 26, 46, 0.7);
      color: var(--bio-cyan);
      font-family: var(--font-terminal);
      cursor: pointer;
      transition: var(--transition-fast);
    }
    
    .warning-btn.confirm-btn {
      border-color: var(--status-critical);
      background-color: rgba(255, 0, 85, 0.1);
      color: var(--status-critical);
    }
    
    .warning-btn.confirm-btn:hover {
      background-color: rgba(255, 0, 85, 0.3);
    }
    
    .warning-btn.cancel-btn:hover {
      border-color: var(--bio-cyan);
      background-color: rgba(0, 224, 255, 0.1);
    }
  `;
  
  document.head.appendChild(style);
}

// Add dynamic styles when script loads
addDynamicStyles();

// ========== RANDOM TERMINAL GLITCH EFFECT ==========
function triggerRandomGlitch() {
  const glitchElements = document.querySelectorAll('.glitch');
  if (glitchElements.length > 0) {
    const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
    
    // Temporarily increase glitch intensity
    const originalAnimation = randomElement.style.animation;
    randomElement.style.animation = 'glitch-animation 0.5s infinite';
    
    // Return to normal after delay
    setTimeout(() => {
      randomElement.style.animation = originalAnimation;
    }, 500);
  }
}

// Trigger random glitches periodically
setInterval(triggerRandomGlitch, 15000);

// ========== INITIAL RANDOM GLITCH ==========
setTimeout(triggerRandomGlitch, 3000);

console.log('BIO-DATA TERMINAL v2.7.3 initialized successfully.');
console.log('Genetic archive loaded:', characters.length, 'subjects.');
console.log('System status: ONLINE');