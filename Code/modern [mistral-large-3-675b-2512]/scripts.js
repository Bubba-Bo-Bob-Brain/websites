// ===== Utility Functions =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== 1. Custom Cursor =====
const cursor = $('.cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}

// ===== 2. File Tree Interaction =====
function setupFileTree() {
  const folders = $$('.tree-node.folder');
  folders.forEach(folder => {
    const header = folder.querySelector('.node-header');
    const children = folder.querySelector('.node-children');
    const arrow = folder.querySelector('.node-arrow');

    header.addEventListener('click', () => {
      const isOpen = folder.classList.toggle('open');
      if (isOpen) {
        children.style.maxHeight = children.scrollHeight + 'px';
        arrow.style.transform = 'rotate(90deg)';
      } else {
        children.style.maxHeight = '0';
        arrow.style.transform = 'rotate(0deg)';
      }
    });

    // Auto-open first level
    if (folder.dataset.path === 'client' || folder.dataset.path === 'server') {
      header.click();
    }
  });
}

// ===== 3. Commit Graph Visualization (Canvas) =====
function drawCommitGraph() {
  const canvas = $('#commitGraph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.clientWidth;
  const height = canvas.height = canvas.clientHeight;

  // Simulated commit graph data
  const commits = [
    { x: 50, y: 30, color: '#00f2ff', size: 8, message: 'Initial commit', author: 'alice', date: '2 weeks ago' },
    { x: 150, y: 60, color: '#b559ff', size: 10, message: 'feat: add file tree', author: 'bob', date: '1 week ago' },
    { x: 100, y: 100, color: '#ff00ff', size: 6, message: 'fix: header styling', author: 'charlie', date: '5 days ago' },
    { x: 200, y: 120, color: '#00f2ff', size: 9, message: 'refactor: sidebar layout', author: 'alice', date: '3 days ago' },
    { x: 150, y: 160, color: '#b559ff', size: 7, message: 'docs: update README', author: 'dave', date: '1 day ago' },
  ];

  const branches = [
    { from: 0, to: 1, color: '#00f2ff', thickness: 2 },
    { from: 1, to: 2, color: '#b559ff', thickness: 1.5 },
    { from: 1, to: 3, color: '#00f2ff', thickness: 2 },
    { from: 3, to: 4, color: '#b559ff', thickness: 1.5 },
  ];

  // Draw branches
  branches.forEach(b => {
    ctx.beginPath();
    ctx.moveTo(commits[b.from].x, commits[b.from].y);
    ctx.lineTo(commits[b.to].x, commits[b.to].y);
    ctx.strokeStyle = b.color;
    ctx.lineWidth = b.thickness;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  // Draw commits
  commits.forEach((commit, i) => {
    ctx.beginPath();
    ctx.arc(commit.x, commit.y, commit.size, 0, Math.PI * 2);
    ctx.fillStyle = commit.color;
    ctx.shadowColor = commit.color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Pulsing animation
    const glow = () => {
      const pulse = Math.sin(Date.now() / 500 + i) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(commit.x, commit.y, commit.size * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = commit.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5 * pulse;
      ctx.stroke();
      ctx.globalAlpha = 1;
      requestAnimationFrame(glow);
    };
    glow();
  });

  // Tooltip
  const tooltip = $('#graphTooltip');
  if (tooltip) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find nearest commit
      let nearest = null;
      let minDist = Infinity;
      commits.forEach(c => {
        const dx = c.x - x;
        const dy = c.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20 && dist < minDist) {
          minDist = dist;
          nearest = c;
        }
      });

      if (nearest) {
        tooltip.style.opacity = '1';
        tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        tooltip.style.top = `${e.clientY - rect.top + 10}px`;
        tooltip.querySelector('.commit-hash').textContent = `#${Math.random().toString(36).substring(2, 8)}`;
        tooltip.querySelector('.commit-message').textContent = nearest.message;
        tooltip.querySelector('.commit-author span').textContent = nearest.author;
        tooltip.querySelector('.commit-date').textContent = nearest.date;
      } else {
        tooltip.style.opacity = '0';
      }
    });
  }
}

// ===== 4. Contribution Heatmap =====
function generateHeatmap() {
  const grid = $('.heatmap-grid');
  if (!grid) return;

  // Simulate 1 year of activity
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(today.getFullYear() - 1);

  // Data: random contributions
  const data = {};
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    data[key] = Math.floor(Math.random() * 5);
  }

  // Render grid
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let currentMonth = start.getMonth();
  let currentDay = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 && d.getMonth() !== currentMonth) {
      currentMonth = d.getMonth();
      const span = document.createElement('span');
      span.textContent = months[currentMonth];
      $('.heatmap-months').appendChild(span);
    }

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    const level = data[d.toISOString().split('T')[0]] || 0;
    cell.dataset.level = level;

    // Apply color based on level
    switch(level) {
      case 0: cell.style.background = 'var(--color-bg-tertiary)'; break;
      case 1: cell.style.background = '#2a5454'; break;
      case 2: cell.style.background = '#3e7a7a'; break;
      case 3: cell.style.background = '#00f2ff'; cell.style.boxShadow = '0 0 6px #00f2ff'; break;
      case 4: cell.style.background = '#b559ff'; cell.style.boxShadow = '0 0 8px #b559ff'; break;
    }

    // Glow animation
    if (level >= 3) {
      cell.style.animation = `pulse 2s infinite alternate`;
    }

    grid.appendChild(cell);
  }
}

// ===== 5. Scroll Animations (Intersection Observer) =====
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-animate', 'fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('[data-animate]').forEach(el => observer.observe(el));
}

// ===== 6. Branch Dropdown Toggle =====
function setupBranchDropdown() {
  const btn = $('.branch-btn');
  const dropdown = $('.branch-dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
  setupFileTree();
  drawCommitGraph();
  generateHeatmap();
  setupScrollAnimations();
  setupBranchDropdown();

  // Initialize Prism syntax highlighting
  Prism.highlightAll();
});