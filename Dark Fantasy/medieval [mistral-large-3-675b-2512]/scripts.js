// ===== PROPHECY GENERATOR =====
const prophecies = [
  "When the crow drinks the moon’s blood, the last king shall rise from the unmarked grave.",
  "At the stroke of the thirteenth hour, the door without hinges will open, and the hungry dark will feast.",
  "The child born under the black sun shall hold dominion over the bones of gods.",
  "Beware the mirror that shows no reflection, for it hungers for the unwary soul.",
  "When the rivers run backward, the drowned shall walk, and the living will envy the dead.",
  "The sigil of the forgotten shall burn bright on the night of the twin moons, heralding the end of oaths.",
  "The hand that writes its own fate in blood shall be severed by the hand it trusted.",
  "Three ravens whisper your name to the void. When the third falls silent, you shall join them.",
  "The knight who seeks the obsidian throne must first unseat the shadow upon it.",
  "On the night the stars weep, the dead shall reclaim what was stolen, and the thieves will beg for mercy."
];

const crystalBall = document.querySelector('.crystal-ball');
const prophecyText = document.getElementById('prophecy-text');
const runes = document.getElementById('runes');

// Generate a random prophecy
function generateProphecy() {
  const randomIndex = Math.floor(Math.random() * prophecies.length);
  return prophecies[randomIndex];
}

// Animate runes briefly
function animateRunes() {
  runes.style.opacity = '1';
  runes.style.transform = 'scale(1.1)';
  setTimeout(() => {
    runes.style.transform = 'scale(1)';
    runes.style.opacity = '0.8';
  }, 300);
}

// Update prophecy on hover
crystalBall.addEventListener('mouseenter', () => {
  prophecyText.textContent = generateProphecy();
  animateRunes();
});

// Reset prophecy text on mouse leave
crystalBall.addEventListener('mouseleave', () => {
  prophecyText.textContent = 'Hover to reveal thy fate...';
});

// ===== BESTIARY LORE TOGGLE =====
const creatureCards = document.querySelectorAll('.creature-card');

// Toggle lore visibility
creatureCards.forEach(card => {
  const name = card.querySelector('.creature-name');
  name.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    card.classList.toggle('active');
  });
});

// Close lore when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.creature-card')) {
    creatureCards.forEach(card => {
      card.classList.remove('active');
    });
  }
});

// ===== INTERACTIVE WAX SEAL =====
const interactiveSeal = document.querySelector('.interactive-seal');
const colophonWarning = document.querySelector('.colophon-warning');
let clickCount = 0;

// Hidden messages
const hiddenWarnings = [
  "The Court’s gaze lingers upon you, seeker. Are you sure you wish to proceed?",
  "The ink bleeds, the pages whisper... turn back while you still can.",
  "The seal is broken. The last king stirs. Run."
];

// Seal click interaction
interactiveSeal.addEventListener('click', () => {
  clickCount++;

  // Subtle press animation
  interactiveSeal.style.transform = 'scale(0.95)';
  setTimeout(() => {
    interactiveSeal.style.transform = 'scale(1)';
  }, 150);

  // Update warning based on click count
  if (clickCount <= 2) {
    colophonWarning.textContent = hiddenWarnings[clickCount - 1];
  } else {
    // Final message: seal "breaks"
    colophonWarning.textContent = hiddenWarnings[2];
    colophonWarning.style.color = 'var(--blood)';
    colophonWarning.style.fontWeight = 'bold';
    interactiveSeal.style.filter = 'grayscale(100%) brightness(0.5)';
    interactiveSeal.style.cursor = 'not-allowed';
    interactiveSeal.removeEventListener('click', arguments.callee);
  }
});

// ===== GHOSTLY TEXT GLITCHES (BONUS) =====
function applyTextGlitch() {
  const paragraphs = document.querySelectorAll('p');
  const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  const text = randomParagraph.textContent;
  const randomIndex = Math.floor(Math.random() * text.length);

  // Skip if the character is a space or punctuation
  if (/[a-zA-Z]/.test(text[randomIndex])) {
    const glitchedText = text.substring(0, randomIndex) + '█' + text.substring(randomIndex + 1);
    randomParagraph.textContent = glitchedText;

    // Revert after 500ms
    setTimeout(() => {
      randomParagraph.textContent = text;
    }, 500);
  }
}

// 5% chance to glitch on page load
if (Math.random() < 0.05) {
  setTimeout(applyTextGlitch, 2000);
}

// ===== TORCHLIGHT PARALLAX =====
// Subtle parallax effect for torchlight based on mouse position
document.addEventListener('mousemove', (e) => {
  const torchlight = document.getElementById('torchlight');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  torchlight.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(245, 200, 100, 0.2) 0%, transparent 70%)`;
});