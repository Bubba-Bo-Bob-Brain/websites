// Grimscribe’s Tome - Retro Fantasy RPG Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // ========== DRAG-AND-DROP QUEST NOTES ========== //
  const questBoard = document.getElementById('quest-board');
  const questNotes = document.querySelectorAll('.quest-note');

  // Enable drag-and-drop for each quest note
  questNotes.forEach(note => {
    note.setAttribute('draggable', 'true');

    note.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', note.id);
      note.style.opacity = '0.5';
      note.classList.add('dragging');
    });

    note.addEventListener('dragend', () => {
      note.style.opacity = '1';
      note.classList.remove('dragging');
    });
  });

  // Handle drag-over and drop on the quest board
  questBoard.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggedNote = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(questBoard, e.clientY);

    if (afterElement == null) {
      questBoard.appendChild(draggedNote);
    } else {
      questBoard.insertBefore(draggedNote, afterElement);
    }
  });

  // Helper function to determine drop position
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.quest-note:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // ========== COLLAPSIBLE WIDGETS ========== //
  const widgetToggles = document.querySelectorAll('.widget-toggle');

  widgetToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const widget = toggle.closest('.widget');
      const content = widget.querySelector('.widget-content') || widget.querySelector('.character-info, .quest-board, .spellbook-page');

      // Toggle height
      if (widget.classList.contains('collapsed')) {
        widget.classList.remove('collapsed');
        content.style.display = 'block';
      } else {
        widget.classList.add('collapsed');
        content.style.display = 'none';
      }

      // Rotate toggle icon
      toggle.style.transform = widget.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
    });
  });

  // ========== SPELLBOOK PAGE-TURNING ========== //
  const spellbookPages = document.querySelectorAll('.spellbook-page');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  let currentPage = 0;

  // Initialize: Show first page
  showPage(currentPage);

  // Page navigation
  prevPageBtn.addEventListener('click', () => {
    currentPage = Math.max(0, currentPage - 1);
    flipPage(currentPage);
    playSound('page-turn');
  });

  nextPageBtn.addEventListener('click', () => {
    currentPage = Math.min(spellbookPages.length - 1, currentPage + 1);
    flipPage(currentPage);
    playSound('page-turn');
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentPage = Math.max(0, currentPage - 1);
      flipPage(currentPage);
    } else if (e.key === 'ArrowRight') {
      currentPage = Math.min(spellbookPages.length - 1, currentPage + 1);
      flipPage(currentPage);
    }
  });

  // Show/hide pages with 3D flip
  function showPage(index) {
    spellbookPages.forEach((page, i) => {
      page.style.display = i === index ? 'block' : 'none';
      page.style.transform = 'rotateY(0deg)';
    });
  }

  // Flip animation
  function flipPage(index) {
    const current = spellbookPages[currentPage];
    const next = spellbookPages[index];

    current.style.transform = 'rotateY(-90deg)';
    current.style.transition = 'transform 0.5s ease';
    next.style.display = 'block';
    next.style.transform = 'rotateY(90deg)';
    next.style.transition = 'transform 0.5s ease';

    setTimeout(() => {
      current.style.display = 'none';
      next.style.transform = 'rotateY(0deg)';
      current.style.transform = 'rotateY(0deg)';
    }, 500);
  }

  // ========== THEME SWITCHING ========== //
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '🌓';
  themeToggle.title = 'Toggle Day/Night Theme';
  document.body.appendChild(themeToggle);

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('night-theme');
    themeToggle.innerHTML = document.body.classList.contains('night-theme') ? '☀️' : '🌓';
    playSound('theme-switch');
  });

  // ========== EASTER EGGS ========== //
  // Click character portrait to reveal sprite
  const portrait = document.querySelector('.character-portrait');
  portrait.addEventListener('click', () => {
    portrait.innerHTML = `
      <div style="font-family: 'PixelOperator'; font-size: 0.8rem;">
        <pre>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣾⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀
⠀⠀⢠⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀
⠀⢠⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀
⢀⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⡀
⣼⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣧
⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿
        </pre>
        <div style="text-align: center; margin-top: 0.5rem; color: var(--crt-green);">ELDRITCH MAGE</div>
      </div>
    `;
    playSound('mystery');
  });

  // Click clock to reveal hidden quest
  const clock = document.getElementById('clock');
  clock.addEventListener('click', () => {
    const hiddenQuest = document.createElement('div');
    hiddenQuest.className = 'quest-note';
    hiddenQuest.setAttribute('draggable', 'true');
    hiddenQuest.innerHTML = `
      <h3>👁️ THE FORGOTTEN TOME</h3>
      <p>A spectral librarian whispers of a tome hidden beneath the clock tower. Seek it before the next blood moon.</p>
      <div style="font-family: 'PixelOperator'; font-size: 0.8rem; margin-top: 0.5rem; color: var(--crimson);">
        REWARD: 💰 2,000 GOLD | XP: 3000
      </div>
    `;
    questBoard.appendChild(hiddenQuest);
    playSound('secret');
  });

  // ========== SOUND EFFECTS ========== //
  function playSound(type) {
    const sounds = {
      'page-turn': new Audio('https://assets.mixkit.co/sfx/preview/mixkit-page-turn-click-1109.mp3'),
      'click': new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
      'theme-switch': new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-950.mp3'),
      'secret': new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkle-859.mp3'),
      'mystery': new Audio('https://assets.mixkit.co/sfx/preview/mixkit-mystery-magic-967.mp3')
    };

    if (sounds[type]) {
      sounds[type].volume = 0.3;
      sounds[type].play();
    }
  }

  // ========== REAL-TIME CLOCK ========== //
  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clock.textContent = `TIME: ${timeString}`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // ========== MICRO-INTERACTIONS ========== //
  // Hover effects for interactive elements
  document.querySelectorAll('[draggable="true"], button, .inventory-item').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('click'));
  });
});