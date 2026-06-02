const nightModeToggle = document.getElementById('night-mode-toggle');
const body = document.body;
const categoryButtons = document.querySelectorAll('.nav-item');
const recipeCards = document.querySelectorAll('.recipe-card');
const cauldronLoader = document.getElementById('cauldron-loader');
const recipeModal = document.getElementById('recipe-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
const seasonalWheel = document.querySelector('.wheel-wrapper');
const seasonLabels = document.querySelectorAll('.season-label');
const ingredientList = document.getElementById('ingredient-list');

const seasonalIngredients = {
  spring: ['Wild violet', 'Nettle tips', 'Cleavers', 'Dandelion petals', 'Chickweed'],
  summer: ['St. John’s wort', 'Yarrow', 'Red clover', 'Lavender', 'Meadowsweet'],
  autumn: ['Rose hips', 'Elderberries', 'Black walnuts', 'Slippery elm', 'Hawthorn berries'],
  winter: ['Pine needles', 'Chaga', 'Dried elderflower', 'Cinnamon bark', 'Star anise']
};

const recipeDetails = {
  dewdrop: {
    title: 'Dewdrop Vitality Tea',
    instructions: 'Pluck young hawthorn leaves and violet blossoms at first light. Rinse gently in spring water. Steep in just-boiled water for seven minutes, whispering gratitude. Strain into a clear cup and sweeten with a thread of raw honey. Sip slowly facing east.'
  },
  marigold: {
    title: 'Marigold Sun Pressing',
    instructions: 'Choose fully opened calendula blooms at noon. Place between sheets of absorbent paper within a heavy wooden press. Leave undisturbed for three weeks. Arrange pressed petals on linen paper with fern fronds, securing with a dab of spruce resin.'
  },
  chanterelle: {
    title: 'Chanterelle & Chestnut Ramble',
    instructions: 'Wander where oak roots twist into mossy earth after warm rain. Look for golden folds beneath leaf litter. Harvest by cutting stems, leaving the base. Pair with roasted chestnuts and wild thyme. Never take more than a third of the patch.'
  },
  elderberry: {
    title: 'Elderberry & Thyme Syrup',
    instructions: 'Simmer dried elderberries with fresh thyme sprigs and a cinnamon stick in water for 45 minutes. Mash gently, then strain through muslin. For each cup of liquid, stir in half a cup of dark forest honey. Bottle warm and store in the cold pantry.'
  },
  cordial: {
    title: 'Spiced Orchard Cordial',
    instructions: 'Quarter windfall apples, no need to core. Add to a pot with a cracked cinnamon stick, three cloves, and a curl of orange peel. Cover with water and simmer until fragrant. Strain, then stir in honey to taste. Serve warm by the hearth.'
  },
  forgetmenot: {
    title: 'Forget-me-not Letters',
    instructions: 'Gather tiny forget-me-not blossoms on a dry morning. Press between the pages of a beloved book for ten days. Using tweezers, arrange on cotton paper, then brush lightly with egg white glaze to preserve. Tie with a single linen thread.'
  }
};

function activateCauldron(duration = 800) {
  cauldronLoader.classList.add('active');
  return new Promise(resolve => {
    setTimeout(() => {
      cauldronLoader.classList.remove('active');
      resolve();
    }, duration);
  });
}

function updateSeasonalPanel(season) {
  const ingredients = seasonalIngredients[season] || seasonalIngredients.spring;
  ingredientList.innerHTML = ingredients.map(ing => `<li>${ing}</li>`).join('');
  const panelTitle = document.querySelector('.panel-title');
  if (panelTitle) {
    const seasonNames = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' };
    panelTitle.textContent = `${seasonNames[season]} Bounty`;
  }
}

seasonLabels.forEach(label => {
  label.addEventListener('click', (e) => {
    e.stopPropagation();
    const season = label.closest('.wheel-segment').dataset.season;
    updateSeasonalPanel(season);
    
    const rotations = { spring: 0, summer: 90, autumn: 180, winter: 270 };
    seasonalWheel.style.transform = `rotate(${rotations[season]}deg)`;
  });
});

nightModeToggle.addEventListener('click', () => {
  body.classList.toggle('night-mode');
  if (body.classList.contains('night-mode')) {
    nightModeToggle.setAttribute('aria-label', 'Toggle day mode');
  } else {
    nightModeToggle.setAttribute('aria-label', 'Toggle night mode');
  }
});

nightModeToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    nightModeToggle.click();
  }
});

categoryButtons.forEach(button => {
  button.addEventListener('click', async () => {
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const category = button.dataset.category;
    
    await activateCauldron(700);
    
    recipeCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

function openRecipeModal(recipeKey) {
  const recipe = recipeDetails[recipeKey];
  if (!recipe) return;
  
  modalContent.innerHTML = `
    <h2>${recipe.title}</h2>
    <p class="handwritten" style="margin-top:1.5rem;">${recipe.instructions}</p>
    <p style="font-family:var(--font-hand); margin-top:2rem; color:var(--accent-rose); font-size:1.4rem;">~ with woodland care ~</p>
  `;
  
  recipeModal.classList.add('visible');
  recipeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  recipeModal.classList.remove('visible');
  recipeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-recipe').forEach(button => {
  button.addEventListener('click', (e) => {
    const recipeKey = button.dataset.recipe;
    openRecipeModal(recipeKey);
  });
});

modalClose.addEventListener('click', closeRecipeModal);
modalBackdrop.addEventListener('click', closeRecipeModal);

recipeModal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRecipeModal();
  }
});

const recipeCardButtons = document.querySelectorAll('.recipe-card .open-recipe');
recipeCardButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

updateSeasonalPanel('spring');