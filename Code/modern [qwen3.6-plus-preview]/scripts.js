/**
 * ForgeCode - Source Code Management Interface
 * Main JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. INITIALIZATION & LOADER
  // ==========================================
  
  const pageLoader = document.getElementById('pageLoader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      initAnimations();
    }, 800);
  });

  // ==========================================
  // 2. CUSTOM CURSOR
  // ==========================================
  
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  const interactiveElements = 'a, button, input, .tree-item, .palette-item, .mr-item, .collaborator, select, textarea';

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate update for dot
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    
    // Parallax effect for ambient orbs
    const moveX = (mouseX - window.innerWidth / 2) * 0.02;
    const moveY = (mouseY - window.innerHeight / 2) * 0.02;
    document.querySelectorAll('.ambient-orb').forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });
  });

  // Smooth follow for ring
  function animateCursor() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    
    ringX += dx * 0.15;
    ringY += dy * 0.15;
    
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorRing.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorRing.classList.remove('hover');
    }
  });

  // ==========================================
  // 3. COMMAND PALETTE
  // ==========================================
  
  const commandPalette = document.getElementById('commandPalette');
  const paletteInput = document.getElementById('paletteInput');
  const paletteResults = document.getElementById('paletteResults');
  const paletteClose = document.querySelector('.palette-close');
  let selectedIndex = -1;

  // Toggle logic
  function togglePalette(show) {
    if (show) {
      commandPalette.hidden = false;
      requestAnimationFrame(() => {
        commandPalette.classList.add('active');
        paletteInput.focus();
      });
    } else {
      commandPalette.classList.remove('active');
      setTimeout(() => {
        commandPalette.hidden = true;
        paletteInput.value = '';
        filterCommands('');
      }, 200);
    }
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette(!commandPalette.classList.contains('active'));
    }
    if (e.key === 'Escape' && commandPalette.classList.contains('active')) {
      togglePalette(false);
    }
  });

  paletteClose.addEventListener('click', () => togglePalette(false));
  document.querySelector('.palette-backdrop').addEventListener('click', () => togglePalette(false));

  // Search and Navigation
  const commands = Array.from(document.querySelectorAll('.palette-item'));

  function filterCommands(query) {
    const q = query.toLowerCase();
    let visibleCount = 0;
    
    commands.forEach((cmd, index) => {
      const text = cmd.querySelector('.palette-item-text').textContent.toLowerCase();
      const match = text.includes(q);
      cmd.style.display = match ? 'flex' : 'none';
      cmd.classList.toggle('selected', false);
      if (match) visibleCount++;
    });
    
    selectedIndex = visibleCount > 0 ? 0 : -1;
    updateSelection();
  }

  paletteInput.addEventListener('input', (e) => filterCommands(e.target.value));

  function updateSelection() {
    const visible = commands.filter(c => c.style.display !== 'none');
    visible.forEach((cmd, i) => {
      cmd.classList.toggle('selected', i === selectedIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!commandPalette.classList.contains('active')) return;
    
    const visible = commands.filter(c => c.style.display !== 'none');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % visible.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + visible.length) % visible.length;
      updateSelection();
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const action = visible[selectedIndex].getAttribute('data-command');
      alert(`Executing command: ${action}`);
      togglePalette(false);
    }
  });

  // ==========================================
  // 4. FILE TREE INTERACTIONS
  // ==========================================
  
  document.querySelectorAll('.tree-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = e.target.closest('.tree-item');
      const isExpanded = parent.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', isExpanded);
    });
  });

  // ==========================================
  // 5. BRANCH SELECTOR
  // ==========================================
  
  const branchBtn = document.getElementById('branchBtn');
  const branchDropdown = document.getElementById('branchDropdown');

  branchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = branchDropdown.hidden;
    branchDropdown.hidden = !isOpen;
    branchBtn.classList.toggle('open', isOpen);
    if (isOpen) branchDropdown.querySelector('input').focus();
  });

  document.addEventListener('click', (e) => {
    if (!branchDropdown.contains(e.target) && !branchBtn.contains(e.target)) {
      branchDropdown.hidden = true;
      branchBtn.classList.remove('open');
    }
  });

  // ==========================================
  // 6. DIFF VIEWER RENDERING
  // ==========================================
  
  const diffContent = document.getElementById('diffContent');
  
  const diffData = [
    { type: 'hunk', content: '@@ -42,6 +42,14 @@ export const Button: React.FC<ButtonProps> = ({' },
    { type: 'ctx', left: 42, right: 42, content: '  className,' },
    { type: 'ctx', left: 43, right: 43, content: '  variant = "primary",' },
    { type: 'ctx', left: 44, right: 44, content: '  size = "md",' },
    { type: 'ctx', left: 45, right: 45, content: '  disabled = false,' },
    { type: 'removed', left: 46, right: '-', content: '  isLoading = false,' },
    { type: 'added', left: '-', right: 46, content: '  isLoading = false,' },
    { type: 'added', left: '-', right: 47, content: '  icon: IconComponent,' },
    { type: 'added', left: '-', right: 48, content: '  iconPosition = "left",' },
    { type: 'ctx', left: 47, right: 49, content: '  children,' },
    { type: 'ctx', left: 48, right: 50, content: '  ...rest' },
    { type: 'ctx', left: 49, right: 51, content: '}: ButtonProps) => {' },
    { type: 'removed', left: 50, right: '-', content: '  const classes = cx(' },
    { type: 'removed', left: 51, right: '-', content: '    baseStyles,' },
    { type: 'added', left: '-', right: 52, content: '  const classes = cx(' },
    { type: 'added', left: '-', right: 53, content: '    baseStyles,' },
    { type: 'added', left: '-', right: 54, content: '    variants[variant],' },
    { type: 'ctx', left: 52, right: 55, content: '    sizes[size],' },
    { type: 'ctx', left: 53, right: 56, content: '    disabled && "opacity-50 cursor-not-allowed",' },
    { type: 'added', left: '-', right: 57, content: '    isLoading && "pointer-events-none",' },
  ];

  function renderDiff() {
    diffContent.innerHTML = '';
    diffData.forEach(line => {
      const row = document.createElement('div');
      row.className = `diff-line ${line.type}`;
      
      if (line.type === 'hunk') {
        row.innerHTML = `<div class="line-num hunk" style="grid-column: span 6; border: none; background: transparent; color: var(--accent-primary); padding-left: 0;">${line.content}</div>`;
      } else {
        row.innerHTML = `
          <div class="line-num">${line.left}</div>
          <div class="line-num">${line.right}</div>
          <div class="line-content">${escapeHtml(line.content)}</div>
          <div class="line-num" style="opacity:0.3">${line.left}</div>
          <div class="line-num" style="opacity:0.3">${line.right}</div>
          <div class="line-content" style="opacity:0.5">${escapeHtml(line.content)}</div>
        `;
      }
      diffContent.appendChild(row);
    });
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  renderDiff();

  // ==========================================
  // 7. COMMIT GRAPH (CANVAS)
  // ==========================================
  
  const canvas = document.getElementById('commitCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawGraph();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawGraph() {
    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    
    ctx.clearRect(0, 0, w, h);
    
    // Generate mock data
    const days = 30;
    const data = {
      additions: Array.from({length: days}, () => Math.random() * 50),
      deletions: Array.from({length: days}, () => Math.random() * 30),
      commits: Array.from({length: days}, () => Math.random() * 10)
    };

    const maxVal = Math.max(...data.additions, ...data.deletions);
    
    // Draw Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = padding + (h - padding * 2) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    // Helper to draw line
    function drawLine(values, color, fill = false) {
      ctx.beginPath();
      values.forEach((val, i) => {
        const x = padding + (i / (days - 1)) * (w - padding * 2);
        const y = padding + (h - padding * 2) * (1 - val / maxVal);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (fill) {
        ctx.lineTo(w - padding, h - padding);
        ctx.lineTo(padding, h - padding);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Draw data
    drawLine(data.additions, '#34d399', true);
    drawLine(data.deletions, '#f87171');
    
    // Draw commits as dots
    data.commits.forEach((val, i) => {
      const x = padding + (i / (days - 1)) * (w - padding * 2);
      const y = padding + (h - padding * 2) * (1 - val / 10);
      
      ctx.beginPath();
      ctx.arc(x, y, val > 5 ? 4 : 2, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa';
      ctx.fill();
    });
  }

  // ==========================================
  // 8. CONTRIBUTION HEATMAP
  // ==========================================
  
  const heatmapGrid = document.getElementById('heatmapGrid');
  const heatmapMonths = document.getElementById('heatmapMonths');

  function generateHeatmap() {
    const weeks = 52;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Render months
    months.forEach(m => {
      const span = document.createElement('span');
      span.textContent = m;
      heatmapMonths.appendChild(span);
    });

    // Render cells
    for (let i = 0; i < weeks * 7; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      const level = Math.floor(Math.random() * 5);
      cell.setAttribute('data-level', level);
      
      // Tooltip on hover
      cell.title = `${Math.floor(Math.random() * 10)} contributions on ${new Date(Date.now() - (weeks * 7 - i) * 86400000).toLocaleDateString()}`;
      
      heatmapGrid.appendChild(cell);
    }
  }

  generateHeatmap();

  // ==========================================
  // 9. MERGE REQUEST FILTERS
  // ==========================================
  
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mrItems = document.querySelectorAll('.mr-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      mrItems.forEach(item => {
        const status = item.classList.contains('status-open') ? 'open' : 
                       item.classList.contains('status-merged') ? 'merged' : 'closed';
        
        if (filter === status || filter === 'all') {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 10. SCROLL ANIMATIONS
  // ==========================================
  
  function initAnimations() {
    const panels = document.querySelectorAll('.panel, .activity-feed');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    panels.forEach((panel, i) => {
      panel.classList.add(`delay-${Math.min(i + 1, 5)}`);
      observer.observe(panel);
    });
  }

  // ==========================================
  // 11. SEARCH INTERACTION
  // ==========================================
  
  const globalSearch = document.getElementById('globalSearch');
  globalSearch.addEventListener('focus', () => {
    togglePalette(true);
    globalSearch.blur();
  });

});