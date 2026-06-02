/**
 * BOUNTY BOARD - Sheriff's Dispatch & Interactive Features
 * Sun-bleached JavaScript for the Wanted Poster Board
 */

(function () {
  'use strict';

  // ---------- STATE ----------
  const state = {
    activeOutlaw: 0,
    cylinderRotations: 0,
    dispatchEntries: [],
  };

  const outlaws = [
    {
      name: 'El Diablo',
      alias: 'The Scorpion',
      reward: '$9,000',
      status: 'DEAD OR ALIVE',
      dispatch: [
        'Dispatch #142: Last seen near Red Rock Canyon. Armed and extremely dangerous.',
        'Dispatch #97: Reward increased by the Territorial Governor.',
        'Dispatch #33: Known associate of the Sundance gang.',
      ],
    },
    {
      name: 'Calamity Jane',
      alias: 'The Whiskey Queen',
      reward: '$3,200',
      status: 'ALIVE PREFERRED',
      dispatch: [
        'Dispatch #211: Wanted for armed robbery and wagon heist.',
        'Dispatch #189: Last spotted in Deadwood Gulch saloon.',
        'Dispatch #156: Reward offered by Wells Fargo.',
      ],
    },
    {
      name: 'Sundance Kid',
      alias: 'The Shadow',
      reward: '$5,500',
      status: 'DEAD OR ALIVE',
      dispatch: [
        'Dispatch #307: Known accomplice of the Butch Cassidy gang.',
        'Dispatch #289: Wanted for train robbery and arson.',
        'Dispatch #271: Believed heading south toward Mexico.',
      ],
    },
    {
      name: 'Bloody Bill',
      alias: 'The Red Butcher',
      reward: '$8,000',
      status: 'DEAD ONLY',
      dispatch: [
        'Dispatch #412: Last seen near Red Creek canyon.',
        'Dispatch #398: Wanted for the massacre at Fort Wallace.',
        'Dispatch #376: Armed and extremely dangerous.',
      ],
    },
  ];

  // DOM references
  const posterCards = document.querySelectorAll('.poster-card');
  const cylinderChambers = document.querySelectorAll('.chamber');
  const logEntriesContainer = document.getElementById('logEntries');

  let currentIndex = 0;

  function updateUI(index) {
    const outlaw = outlaws[index];
    // update log entries
    if (logEntriesContainer) {
      logEntriesContainer.innerHTML = outlaw.dispatch
        .map(
          (entry, i) => `
        <div class="log-entry" style="animation: fadeInLog 0.4s ease ${i * 0.12}s both">
          <span class="log-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span class="log-text">${entry}</span>
        </div>`
        )
        .join('');
    }

    // update cylinder active state
    cylinderChambers.forEach((ch, i) => {
      ch.classList.toggle('active', i === index);
    });

    // optional: highlight matching poster (visual cue)
    posterCards.forEach((card, i) => {
      card.style.opacity = i === index ? '1' : '0.7';
      card.style.transform =
        i === index
          ? 'scale(1.02) rotate(0deg)'
          : 'scale(1) rotate(var(--rot, 0deg))';
    });
  }

  // ---------- CYLINDER NAVIGATION ----------
  cylinderChambers.forEach((chamber) => {
    chamber.addEventListener('click', function () {
      const idx = parseInt(this.dataset.index, 10);
      if (isNaN(idx)) return;
      currentIndex = idx;
      // rotate cylinder visual (spinning effect)
      const cylinder = document.getElementById('cylinderChambers');
      if (cylinder) {
        state.cylinderRotations += 1;
        const angle = state.cylinderRotations * 360 + idx * 90;
        cylinder.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cylinder.style.transform = `rotate(${angle}deg)`;
      }
      updateUI(currentIndex);
      // trigger saloon door transition as a flourish
      triggerSaloonDoor();
    });
  });

  // ---------- SALOON DOOR PAGE TRANSITION ----------
  function triggerSaloonDoor() {
    const leftDoor = document.querySelector('.saloon-door.left');
    const rightDoor = document.querySelector('.saloon-door.right');
    if (!leftDoor || !rightDoor) return;

    // close doors
    leftDoor.classList.remove('open');
    rightDoor.classList.remove('open');

    // after a brief moment, swing them open
    setTimeout(() => {
      leftDoor.classList.add('open');
      rightDoor.classList.add('open');
    }, 200);

    // reset after animation completes (so they stay open)
    // but we want them closed again after a while? let's keep them open.
    // add a tiny reset if needed (for repeated triggers)
  }

  // open doors on page load
  window.addEventListener('load', function () {
    setTimeout(() => {
      const leftDoor = document.querySelector('.saloon-door.left');
      const rightDoor = document.querySelector('.saloon-door.right');
      if (leftDoor && rightDoor) {
        leftDoor.classList.add('open');
        rightDoor.classList.add('open');
      }
    }, 400);
  });

  // ---------- TUMBLEWEED CONTROL (pause on hover) ----------
  const tumbleweed = document.getElementById('tumbleweed');
  if (tumbleweed) {
    tumbleweed.addEventListener('mouseenter', function () {
      this.style.animationPlayState = 'paused';
    });
    tumbleweed.addEventListener('mouseleave', function () {
      this.style.animationPlayState = 'running';
    });
  }

  // ---------- DISPATCH LOG AUTO-UPDATE (simulate live feed) ----------
  function addDispatchEntry() {
    const container = document.getElementById('dispatchEntries');
    if (!container) return;

    const entries = [
      'Deputy reporting dust storm on the eastern trail.',
      'Wire from Tucson: stagecoach delayed.',
      'Bounty hunter collected reward for Johnny Three-Fingers.',
      'Saloon brawl contained. No casualties.',
      'Horses stolen from livery stable. Search party formed.',
      'Telegram: Federal Marshal arriving next week.',
      'Prisoner escape attempt thwarted.',
    ];

    const randomEntry = entries[Math.floor(Math.random() * entries.length)];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const p = document.createElement('p');
    p.innerHTML = `<span class="entry-time">${time}</span> ${randomEntry}`;
    p.style.animation = 'fadeInLog 0.5s ease both';
    container.appendChild(p);

    // keep last 8 entries
    while (container.children.length > 8) {
      container.removeChild(container.firstChild);
    }

    // auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  // initial dispatch log entries (from current outlaw)
  function populateInitialLog() {
    const container = document.getElementById('dispatchEntries');
    if (!container) return;
    const outlaw = outlaws[currentIndex];
    container.innerHTML = outlaw.dispatch
      .map(
        (entry, i) => `
      <p style="animation: fadeInLog 0.4s ease ${i * 0.15}s both">
        <span class="entry-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        ${entry}
      </p>`
      )
      .join('');
  }

  // ---------- CARD CLICK (show outlaw detail via cylinder) ----------
  posterCards.forEach((card, index) => {
    card.addEventListener('click', function () {
      currentIndex = index;
      const cylinder = document.getElementById('cylinderChambers');
      if (cylinder) {
        state.cylinderRotations += 1;
        const angle = state.cylinderRotations * 360 + index * 90;
        cylinder.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cylinder.style.transform = `rotate(${angle}deg)`;
      }
      updateUI(currentIndex);
      triggerSaloonDoor();
    });
  });

  // ---------- INIT ----------
  function init() {
    populateInitialLog();
    updateUI(0);
    // set initial cylinder rotation to match index 0
    const cylinder = document.getElementById('cylinderChambers');
    if (cylinder) {
      cylinder.style.transition = 'none';
      cylinder.style.transform = 'rotate(0deg)';
    }
    // start live dispatch feed (every 12 seconds)
    setInterval(addDispatchEntry, 12000);
    // add a first extra entry after 5 seconds
    setTimeout(addDispatchEntry, 5000);
  }

  // ---------- ADD MISSING FADE-IN KEYFRAME (dynamic) ----------
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInLog {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .log-entry {
      padding: 0.2rem 0;
      border-bottom: 1px dashed rgba(0,0,0,0.1);
    }
    .log-entry:last-child { border: none; }
    .log-time {
      font-weight: 700;
      color: var(--blood, #7a2e2e);
      margin-right: 10px;
    }
    .log-text { color: var(--ink, #2e1e0f); }
  `;
  document.head.appendChild(styleSheet);

  // run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();