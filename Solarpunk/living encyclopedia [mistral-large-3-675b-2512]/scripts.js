// ===== GLOBAL VARIABLES =====
const body = document.body;
const sunlightSlider = document.getElementById('sunlightSlider');
const sunlightHandle = document.getElementById('sunlightHandle');
const themeToggle = document.getElementById('themeToggle');
const loadingIndicator = document.getElementById('loadingIndicator');
const vineLeaves = document.querySelectorAll('.vine-leaf');
const seedIndexItems = document.querySelectorAll('.index-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const markdownEditor = document.querySelector('.markdown-editor');
const markdownPreview = document.querySelector('.markdown-preview');
const tabButtons = document.querySelectorAll('.tab-btn');
const ecosystemCanvas = document.getElementById('ecosystemCanvas');
const ctx = ecosystemCanvas.getContext('2d');

// ===== LOADING INDICATOR =====
function updateLoadingProgress(progress) {
  document.documentElement.style.setProperty('--loading-progress', `${progress}%`);
  if (progress >= 100) {
    setTimeout(() => {
      loadingIndicator.style.opacity = '0';
      loadingIndicator.style.pointerEvents = 'none';
    }, 500);
  }
}

// Simulate loading
window.addEventListener('load', () => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    updateLoadingProgress(progress);
    if (progress >= 100) clearInterval(interval);
  }, 100);
});

// ===== SUNLIGHT METER =====
function updateSunlightIntensity(position) {
  const percent = Math.min(100, Math.max(0, position));
  document.documentElement.style.setProperty('--sunlight-intensity', percent);

  // Update theme based on intensity
  if (percent < 33) {
    body.setAttribute('data-theme', 'dawn');
  } else if (percent < 66) {
    body.setAttribute('data-theme', 'midday');
  } else {
    body.setAttribute('data-theme', 'dusk');
  }

  // Update handle position
  sunlightHandle.style.left = `${percent}%`;
}

// Drag functionality
let isDragging = false;
sunlightSlider.addEventListener('mousedown', (e) => {
  isDragging = true;
  updateHandlePosition(e.clientX);
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  updateHandlePosition(e.clientX);
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

function updateHandlePosition(clientX) {
  const rect = sunlightSlider.getBoundingClientRect();
  const percent = ((clientX - rect.left) / rect.width) * 100;
  updateSunlightIntensity(percent);
}

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentIntensity = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sunlight-intensity'));
  updateSunlightIntensity(currentIntensity > 50 ? 0 : 100);
});

// ===== VINE NAVIGATION =====
// Smooth scroll to sections
vineLeaves.forEach(leaf => {
  leaf.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = leaf.querySelector('a').getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });

    // Update active leaf
    vineLeaves.forEach(l => l.classList.remove('active'));
    leaf.classList.add('active');
  });
});

// Update active leaf on scroll
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  vineLeaves.forEach(leaf => {
    const targetId = leaf.querySelector('a').getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const sectionTop = targetSection.offsetTop;
      const sectionBottom = sectionTop + targetSection.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        vineLeaves.forEach(l => l.classList.remove('active'));
        leaf.classList.add('active');
      }
    }
  });
});

// ===== SEED BANK INDEX =====
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter items
    const filter = button.getAttribute('data-filter');
    seedIndexItems.forEach(item => {
      const text = item.textContent.trim();
      if (filter === 'all' || text.charAt(0).toUpperCase() === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== MARKDOWN EDITOR =====
function updateMarkdownPreview() {
  const markdown = markdownEditor.value;
  // Simple markdown parser (replace with a library like marked.js for production)
  const html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '<p>')
    .replace(/\n/g, '<br>');
  markdownPreview.innerHTML = html;
}

markdownEditor.addEventListener('input', updateMarkdownPreview);

// Tab switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab') + 'Panel';
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      document.getElementById(btn.getAttribute('data-tab') + 'Panel').classList.remove('active');
    });
    button.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// ===== ECOSYSTEM VISUALIZATION =====
function initEcosystemGraph() {
  if (!ecosystemCanvas) return;

  // Set canvas size
  ecosystemCanvas.width = ecosystemCanvas.offsetWidth;
  ecosystemCanvas.height = ecosystemCanvas.offsetHeight;

  // Sample data: nodes and edges
  const nodes = [
    { id: 1, x: 150, y: 150, label: "Mycorrhizal Networks", size: 20 },
    { id: 2, x: 300, y: 100, label: "Permaculture", size: 15 },
    { id: 3, x: 300, y: 200, label: "Bioregion", size: 15 },
    { id: 4, x: 400, y: 150, label: "Mushroom Battery", size: 12 }
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 3 }
  ];

  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '12px var(--font-body)';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, node.x, node.y + 30);
  });

  // Draw edges
  edges.forEach(edge => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = 'rgba(106, 153, 78, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Interactive: click to highlight connections
  ecosystemCanvas.addEventListener('click', (e) => {
    const rect = ecosystemCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    nodes.forEach(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      if (distance <= node.size) {
        alert(`Explore: ${node.label}`);
      }
    });
  });
}

// Initialize graph on load
window.addEventListener('load', initEcosystemGraph);
window.addEventListener('resize', initEcosystemGraph);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  updateSunlightIntensity(50); // Default to midday
  updateMarkdownPreview();
});