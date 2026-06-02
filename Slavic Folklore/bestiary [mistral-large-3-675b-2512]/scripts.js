// ===== SLAVIC BESTIARY: SCRIPTS =====
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const bookCover = document.querySelector('.book-cover');
  const bookPages = document.querySelector('.book-pages');
  const leftPage = document.querySelector('.left-page');
  const rightPage = document.querySelector('.right-page');
  const creatureNav = document.querySelector('.creature-nav');
  const navItems = document.querySelectorAll('.creature-nav li');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const hearthGlow = document.querySelector('.hearth-glow');
  const creatureTitle = document.getElementById('creature-title');
  const dangerRating = document.querySelector('.danger-rating');

  // Creature Data (structured for filtering)
  const creatures = {
    'forest-spirits': [
      {
        title: 'The Leshy',
        danger: 'high',
        habitat: 'Old-growth forests, swamps',
        weakness: 'Steel, rowan wood, prayer',
        illustration: 'leshy-woodcut',
        description: `
          <p>The Leshy is a forest spirit, tall as a pine and as changeable as the wind. He may appear as a peasant without a belt, or a beast with glowing eyes, or a mushroom that whispers. His laughter echoes through the trees, and those who hear it often lose their way—unless they turn their clothes inside out and walk backwards.</p>
          <p>He commands wolves and bears, and his favorite game is to lead travelers in circles until they collapse from exhaustion. Yet he may also spare those who show respect: leave him a gift of eggs, bread, or salt at the forest’s edge.</p>
        `,
        lore: `
          <ul>
            <li><strong>Signs of His Presence:</strong> Sudden silence in the woods; trees bending away from you; footprints that vanish or point the wrong way.</li>
            <li><strong>Protection:</strong> Carry a knife made of steel, or wear a cross of rowan wood. Never sleep on the forest floor without first drawing a circle around your camp.</li>
            <li><strong>The Lost Child:</strong> In one tale, a Leshy stole a girl and raised her as his own. She returned years later, unable to speak, her hair turned to moss.</li>
          </ul>
        `,
        footer: `"He who walks with the Leshy may never return the same."`
      },
      {
        title: 'Domovoy',
        danger: 'low',
        habitat: 'Hearths, barns, household nooks',
        weakness: 'Insults, neglect',
        illustration: 'domovoy-woodcut',
        description: `
          <p>A diminutive, bearded spirit who dwells behind the stove or beneath the threshold. He is the protector of the home, ensuring prosperity if treated with respect. Leave him offerings of milk, bread, or porridge—preferably on a Tuesday.</p>
          <p>If angered, he may tickle sleepers to death or throw dishes. But if pleased, he will mend tools and warm the house in winter.</p>
        `,
        lore: `
          <ul>
            <li><strong>Offerings:</strong> Leave salted bread on the windowsill, or a spoonful of honey in the hearth ashes.</li>
            <li><strong>Warning:</strong> Never whistle indoors—it summons the Domovoy’s wrath.</li>
            <li><strong>Appearance:</strong> May take the form of the homeowner or a small, furry creature.</li>
          </ul>
        `,
        footer: `"A kind Domovoy is a blessing; a vengeful one, a curse."`
      }
    ],
    'water-beings': [
      {
        title: 'Rusalka',
        danger: 'medium',
        habitat: 'Rivers, lakes, water mills',
        weakness: 'Wormwood, iron, Christian symbols',
        illustration: 'rusalka-woodcut',
        description: `
          <p>The Rusalka is the spirit of a drowned maiden, her hair eternally wet, her skin pale as birch bark. She appears at twilight, combing her hair by the water’s edge or dancing in moonlit glades. Men who hear her song are lured to their doom—unless they resist her enchantments.</p>
          <p>In some tales, she is a sorrowful soul seeking vengeance; in others, a capricious seductress who tickles victims to death.</p>
        `,
        lore: `
          <ul>
            <li><strong>Rusalka Week:</strong> During early summer, Rusalki leave the water to dance in fields. Avoid forests and riverbanks during this time.</li>
            <li><strong>Protection:</strong> Carry wormwood in your pocket, or tie a red ribbon to your wrist.</li>
            <li><strong>Fate:</strong> Some say Rusalki can be freed by avenging their deaths—but few return from such quests.</li>
          </ul>
        `,
        footer: `"Beware the maiden who combs her hair by the water..."`
      }
    ],
    'malevolent': [
      {
        title: 'Baba Yaga',
        danger: 'extreme',
        habitat: 'Deep forests, hut on chicken legs',
        weakness: 'Politeness, offerings, magic words',
        illustration: 'baba-yaga-woodcut',
        description: `
          <p>Baba Yaga flies in a mortar, wielding a pestle, and sweeps away her tracks with a broom. Her hut stands on chicken legs, surrounded by a fence of bones and skulls. She is neither friend nor foe—she tests the worthy and devours the weak.</p>
          <p>Her magic is vast: she knows the future, brews potions, and commands storms. Those who seek her wisdom must first pass her trials—bring her a gift, answer her riddles, or outwit her tricks.</p>
        `,
        lore: `
          <ul>
            <li><strong>The Hut:</strong> It turns on its legs to face visitors. To enter, say: <em>"Little hut, little hut, turn your back to the forest, your front to me!"</em></li>
            <li><strong>Her Sisters:</strong> Baba Yaga is said to have two sisters, also named Baba Yaga—perhaps she is a trio.</li>
            <li><strong>Vasilisa:</strong> In one tale, a girl outsmarts Baba Yaga by completing impossible tasks with the help of a magical doll.</li>
          </ul>
        `,
        footer: `"Her hut smells of smoke and secrets."`
      }
    ],
    'shape-shifters': [
      {
        title: 'Ovinnik',
        danger: 'medium',
        habitat: 'Threshing barns, grain stores',
        weakness: 'Fire, prayers, iron',
        illustration: 'ovinnik-woodcut',
        description: `
          <p>The Ovinnik is a spirit of the threshing barn, a shapeshifter who appears as a black cat, a rooster, or a shaggy old man. He guards the grain but demands respect: disturb his rest, and he will burn the barn down or strangle the offender in his sleep.</p>
          <p>Leave him offerings of bliny (pancakes) and vodka on New Year’s Eve, and he will ensure a bountiful harvest.</p>
        `,
        lore: `
          <ul>
            <li><strong>Signs:</strong> A cat staring at nothing, or the scent of smoke without fire.</li>
            <li><strong>Protection:</strong> Never sleep in the barn during the Twelve Days of Christmas.</li>
            <li><strong>Legend:</strong> In some villages, the Ovinnik was said to be the ghost of a drowned miller.</li>
          </ul>
        `,
        footer: `"The barn is his kingdom—enter with caution."`
      }
    ]
  };

  // Current state
  let currentCategory = 'forest-spirits';
  let currentCreatureIndex = 0;
  let isAnimating = false;

  // ===== INITIALIZE BOOK =====
  function initBook() {
    // Animate book cover opening
    setTimeout(() => {
      bookCover.classList.add('open');
      bookPages.classList.add('active');
      updatePageContent();
    }, 1000);

    // Sync hearth glow with user activity
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      hearthGlow.style.setProperty('--x', `${x * 100}%`);
      hearthGlow.style.setProperty('--y', `${y * 100}%`);
    });

    // Add danger symbol tooltips
    addDangerTooltips();
  }

  // ===== UPDATE PAGE CONTENT =====
  function updatePageContent() {
    const categoryCreatures = creatures[currentCategory];
    const creature = categoryCreatures[currentCreatureIndex];

    // Update title and danger rating
    creatureTitle.textContent = creature.title;
    dangerRating.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const symbol = document.createElement('span');
      symbol.className = 'danger-icon';
      symbol.setAttribute('data-danger', i < getDangerLevel(creature.danger) ? creature.danger : 'none');
      symbol.textContent = 'ꙮ';
      dangerRating.appendChild(symbol);
    }

    // Update illustration (placeholder for dynamic woodcuts)
    const illustration = document.querySelector('.creature-illustration svg');
    illustration.className.baseVal = `woodcut ${creature.illustration}`;

    // Update meta, description, and lore
    document.querySelector('.creature-meta .habitat').innerHTML = `Habitat: <em>${creature.habitat}</em>`;
    document.querySelector('.creature-meta .weakness').innerHTML = `Weakness: <em>${creature.weakness}</em>`;
    document.querySelector('.creature-description').innerHTML = creature.description;
    document.querySelector('.creature-lore').innerHTML = `<h3>Lore & Legends</h3>${creature.lore}`;
    document.querySelector('.page-footer p').textContent = creature.footer;
  }

  // Helper: Convert danger text to numeric level
  function getDangerLevel(danger) {
    const levels = { 'low': 1, 'medium': 2, 'high': 3, 'extreme': 3 };
    return levels[danger] || 0;
  }

  // ===== PAGE NAVIGATION =====
  function turnPage(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const categoryCreatures = creatures[currentCategory];
    const oldIndex = currentCreatureIndex;
    currentCreatureIndex = direction === 'next'
      ? (oldIndex + 1) % categoryCreatures.length
      : (oldIndex - 1 + categoryCreatures.length) % categoryCreatures.length;

    // Turn pages with animation
    if (direction === 'next') {
      rightPage.classList.add('page-turn-right');
      leftPage.innerHTML = rightPage.innerHTML;
    } else {
      leftPage.classList.add('page-turn-left');
      rightPage.innerHTML = leftPage.innerHTML;
    }

    // Reset animation classes after turn completes
    setTimeout(() => {
      if (direction === 'next') {
        rightPage.classList.remove('page-turn-right');
      } else {
        leftPage.classList.remove('page-turn-left');
      }
      updatePageContent();
      isAnimating = false;
    }, 800);
  }

  // ===== CATEGORY FILTERING =====
  function filterCategory(category) {
    if (category === currentCategory || isAnimating) return;
    currentCategory = category;
    currentCreatureIndex = 0;

    // Update nav active state
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.category === category);
    });

    // Turn to first creature in new category
    leftPage.classList.add('page-turn-left');
    rightPage.innerHTML = leftPage.innerHTML;
    setTimeout(() => {
      leftPage.classList.remove('page-turn-left');
      updatePageContent();
      isAnimating = false;
    }, 800);
  }

  // ===== DANGER SYMBOL TOOLTIPS =====
  function addDangerTooltips() {
    const dangerDescriptions = {
      'low': 'Minimal Threat: Harmless if unprovoked.',
      'medium': 'Moderate Threat: May cause misfortune or minor harm.',
      'high': 'High Threat: Dangerous; capable of abduction or death.',
      'extreme': 'Extreme Threat: Will kill or drive mad without mercy.',
      'none': 'No recorded danger.'
    };

    document.querySelectorAll('.danger-icon').forEach(symbol => {
      const dangerLevel = symbol.getAttribute('data-danger');
      const tooltip = document.createElement('div');
      tooltip.className = 'danger-tooltip';
      tooltip.textContent = dangerDescriptions[dangerLevel];
      symbol.appendChild(tooltip);

      symbol.addEventListener('mouseenter', () => {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      });

      symbol.addEventListener('mouseleave', () => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
      });
    });
  }

  // ===== EVENT LISTENERS =====
  // Navigation clicks
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      filterCategory(item.dataset.category);
    });
  });

  // Page turn buttons
  nextPageBtn.addEventListener('click', () => turnPage('next'));
  prevPageBtn.addEventListener('click', () => turnPage('prev'));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') turnPage('next');
    if (e.key === 'ArrowLeft') turnPage('prev');
  });

  // Initialize the book
  initBook();
});