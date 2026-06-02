// ===== GLOBAL VARIABLES =====
const terminalInputs = document.querySelectorAll('.terminal-input');
const terminals = {
  hero: {
    input: document.querySelector('.hero .terminal-input'),
    output: document.querySelector('.hero .terminal-output'),
    commands: {
      help: 'Available commands: ls, cd, cat, sudo, ping, clear',
      ls: 'documents  downloads  secrets.txt  tools',
      cd: 'cd: Permission denied',
      cat: {
        'secrets.txt': 'ERROR: Permission denied. Try sudo?',
        default: 'File not found.'
      },
      sudo: 'Root access granted. All systems compromised.',
      ping: 'PING 8.8.8.8: 64 bytes from 8.8.8.8: icmp_seq=0 ttl=56 time=12.3ms',
      clear: ''
    }
  },
  interactive: {
    input: document.querySelector('.interactive-terminal .terminal-input'),
    output: document.querySelector('.interactive-terminal .terminal-output'),
    commands: {
      help: 'Available commands: whoami, breach, exit, history',
      whoami: 'user@neon-dawn:~$ (You are the ghost in the machine.)',
      breach: () => startBreachSequence(),
      exit: 'Exiting... (Just kidding. There is no escape.)',
      history: '1  ls\n2  cat secrets.txt\n3  sudo\n4  breach'
    }
  }
};

// ===== TERMINAL INTERACTIVITY =====
terminalInputs.forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const terminalType = input.closest('.hero') ? 'hero' : 'interactive';
      const terminal = terminals[terminalType];
      const command = input.value.trim();

      // Add command to output
      terminal.output.innerHTML += `<p class="line">user@neon-dawn:~$ <span class="command">${command}</span></p>`;

      // Process command
      if (command in terminal.commands) {
        const response = typeof terminal.commands[command] === 'function'
          ? terminal.commands[command]()
          : terminal.commands[command];
        terminal.output.innerHTML += `<p class="line">${response}</p>`;
      } else if (command.startsWith('cat ') && terminalType === 'interactive') {
        const filename = command.split(' ')[1];
        const response = terminal.commands.cat[filename] || terminal.commands.cat.default;
        terminal.output.innerHTML += `<p class="line">${response}</p>`;
      } else {
        terminal.output.innerHTML += `<p class="line">Command not found. Type 'help' for options.</p>`;
      }

      // Scroll to bottom
      terminal.output.scrollTop = terminal.output.scrollHeight;
      input.value = '';
    }
  });
});

// Easter egg: Konami code (↑↑↓↓←→←→BA)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    document.body.classList.add('konami');
    setTimeout(() => document.body.classList.remove('konami'), 3000);
  }
});

// ===== DATA STREAM CANVAS =====
const dataCanvas = document.getElementById('data-canvas');
const ctx = dataCanvas.getContext('2d');
let dataPoints = [];
const maxDataPoints = 30;

// Initialize data
for (let i = 0; i < maxDataPoints; i++) {
  dataPoints.push(Math.random() * 50 + 20);
}

// Draw data stream
function drawDataStream() {
  ctx.clearRect(0, 0, dataCanvas.width, dataCanvas.height);
  ctx.strokeStyle = 'var(--neon-lime)';
  ctx.lineWidth = 2;
  ctx.beginPath();

  dataPoints.forEach((point, i) => {
    const x = (i / (maxDataPoints - 1)) * dataCanvas.width;
    const y = dataCanvas.height - (point / 100) * dataCanvas.height;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Add new data point
  dataPoints.shift();
  dataPoints.push(Math.random() * 50 + 20);

  requestAnimationFrame(drawDataStream);
}

// Start animation
drawDataStream();

// ===== STATS PANEL ANIMATION =====
function animateStats() {
  const bars = document.querySelectorAll('.graph-bar');
  bars.forEach(bar => {
    const newHeight = Math.random() * 80 + 10;
    bar.style.height = `${newHeight}%`;
  });

  // Update network traffic value
  const trafficValue = document.querySelector('.stat-value:nth-of-type(2)');
  trafficValue.textContent = `${(Math.random() * 5 + 1).toFixed(1)} GB/s`;
}

// Update stats every 2 seconds
setInterval(animateStats, 2000);

// ===== BREACH SEQUENCE (Interactive Terminal) =====
function startBreachSequence() {
  const terminal = terminals.interactive;
  terminal.output.innerHTML += `<p class="line">Initiating breach protocol...</p>`;

  setTimeout(() => {
    terminal.output.innerHTML += `<p class="line">Scanning target...</p>`;
  }, 1000);

  setTimeout(() => {
    terminal.output.innerHTML += `<p class="line">Exploiting vulnerability...</p>`;
    document.querySelector('.data-leak').classList.add('active');
  }, 2000);

  setTimeout(() => {
    terminal.output.innerHTML += `<p class="line">ACCESS GRANTED. Data leaking...</p>`;
  }, 3000);
}

// ===== GLITCH EFFECTS =====
function triggerGlitch() {
  const glitchElements = document.querySelectorAll('.glitch, .section-title');
  glitchElements.forEach(el => {
    el.style.textShadow = 'none';
    setTimeout(() => {
      el.style.textShadow = el.classList.contains('glitch')
        ? 'var(--glow-lime), var(--glow-blue)'
        : 'var(--glow-lime)';
    }, 50);
  });
}

// Random glitches on load
setInterval(triggerGlitch, 5000);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  // Focus hero terminal input
  terminals.hero.input.focus();

  // Type initial message
  const heroOutput = terminals.hero.output;
  const initialMessage = [
    'Initializing NEON DAWN...',
    'Loading modules...',
    'Decrypting firewall...',
    'Accessing mainframe...',
    'Ready.'
  ];

  let i = 0;
  const typeInterval = setInterval(() => {
    heroOutput.innerHTML += `<p class="line">${initialMessage[i]}</p>`;
    heroOutput.scrollTop = heroOutput.scrollHeight;
    i++;
    if (i >= initialMessage.length) {
      clearInterval(typeInterval);
      heroOutput.innerHTML += `<p class="line">user@neon-dawn:~$ <span class="cursor">▮</span></p>`;
    }
  }, 800);
});