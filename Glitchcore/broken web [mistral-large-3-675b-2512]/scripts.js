// ===== LABYRINTH OF LOST PIXELS =====
// A script to simulate digital decay and hidden secrets.

// ===== GLOBAL VARIABLES =====
const body = document.body;
const glitchTitle = document.querySelector('.glitch-title');
const loadingBar = document.querySelector('.loading-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const fragments = document.querySelectorAll('.fragment');
const bsodScreen = document.getElementById('bsod-1');
const errorPage = document.getElementById('error-1');
const secretPage = document.getElementById('secret-page');
const portal = document.getElementById('portal');
const enterPortal = document.getElementById('enter-portal');
const retryButton = document.querySelector('.retry-button');
const brokenLinks = document.querySelectorAll('.broken-link');
const corruptedImage = document.querySelector('.corrupted-image img');
const taskbarClock = document.querySelector('.taskbar-clock');

// ===== HELPER FUNCTIONS =====
// Random number between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Randomly shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = random(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Melts text by randomly swapping characters
const meltText = (element, intensity = 5) => {
  const originalText = element.textContent;
  let meltedText = originalText.split('');

  for (let i = 0; i < intensity; i++) {
    const pos1 = random(0, meltedText.length - 1);
    const pos2 = random(0, meltedText.length - 1);
    [meltedText[pos1], meltedText[pos2]] = [meltedText[pos2], meltedText[pos1]];
  }

  element.textContent = meltedText.join('');
};

// Simulates a CRT screen flicker
const flickerScreen = () => {
  body.style.backgroundColor = `rgb(${random(0, 20)}, ${random(200, 255)}, ${random(0, 20)})`;
  setTimeout(() => {
    body.style.backgroundColor = '';
  }, 50);
};

// Corrupts an image by adding "dead pixels"
const corruptImage = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (random(0, 100) < 5) { // 5% chance to corrupt a pixel
      data[i] = random(0, 255);     // R
      data[i + 1] = random(0, 255); // G
      data[i + 2] = random(0, 255); // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
  img.src = canvas.toDataURL();
};

// ===== INITIAL GLITCHES =====
// Corrupt the main title on load
setTimeout(() => {
  meltText(glitchTitle, 3);
}, 1000);

// Corrupt the image on load
if (corruptedImage) {
  setTimeout(() => {
    corruptImage(corruptedImage);
  }, 2000);
}

// ===== FAKE LOADING BAR =====
let loadingProgress = 0;
const loadingInterval = setInterval(() => {
  loadingProgress += random(1, 10);
  loadingBar.style.width = `${loadingProgress}%`;
  loadingPercentage.textContent = `${loadingProgress}%`;

  // Reset randomly
  if (loadingProgress > 90 || random(0, 100) < 10) {
    loadingProgress = 0;
    loadingBar.style.width = '0%';
    loadingPercentage.textContent = '0%';
    flickerScreen();
  }
}, 200);

// ===== ERROR SCREEN TRIGGERS =====
// Show BSOD on clicking certain links
brokenLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (link.textContent.includes('ABOUT')) {
      bsodScreen.classList.remove('hidden');
      setTimeout(() => {
        bsodScreen.classList.add('hidden');
      }, 5000);
    }
  });
});

// Show 404 on clicking corrupted image
if (corruptedImage) {
  corruptedImage.addEventListener('click', () => {
    errorPage.classList.remove('hidden');
  });
}

// Hide error page on retry
retryButton.addEventListener('click', () => {
  errorPage.classList.add('hidden');
});

// ===== TEXT FRAGMENT PUZZLE =====
// Clicking fragments in order reveals the secret page
let fragmentOrder = [];
const correctOrder = ['They said the data would last forever. They were wrong.', 'The last backup was in 1998. We never tested the restore.', 'I still remember the dial-up tone.'];

fragments.forEach(fragment => {
  fragment.addEventListener('click', () => {
    const glitchText = fragment.getAttribute('data-glitch');
    fragmentOrder.push(glitchText);
    fragment.textContent = glitchText;

    // Check if order is correct
    if (JSON.stringify(fragmentOrder) === JSON.stringify(correctOrder)) {
      portal.classList.remove('hidden');
    } else if (fragmentOrder.length >= correctOrder.length) {
      // Reset if wrong order
      fragmentOrder = [];
      fragments.forEach(f => f.textContent = '▯'.repeat(random(10, 20)));
    }
  });
});

// Enter the portal to see the secret page
enterPortal.addEventListener('click', () => {
  secretPage.classList.remove('hidden');
  portal.classList.add('hidden');
});

// ===== DYNAMIC GLITCHES =====
// Random text melting on hover
document.querySelectorAll('.fragment, .broken-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    meltText(el, 2);
  });
});

// Random screen flickers
setInterval(() => {
  if (random(0, 100) < 10) {
    flickerScreen();
  }
}, 3000);

// Randomly shift elements slightly
const shiftElements = document.querySelectorAll('.broken-table td, .fragment');
setInterval(() => {
  shiftElements.forEach(el => {
    if (random(0, 100) < 5) {
      el.style.transform = `translate(${random(-5, 5)}px, ${random(-5, 5)}px)`;
      setTimeout(() => {
        el.style.transform = '';
      }, 500);
    }
  });
}, 1000);

// ===== FAKE CLOCK =====
// Updates the taskbar clock every second
const updateClock = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  taskbarClock.textContent = `${hours}:${minutes} ${ampm}`;
};

setInterval(updateClock, 1000);
updateClock(); // Initialize clock