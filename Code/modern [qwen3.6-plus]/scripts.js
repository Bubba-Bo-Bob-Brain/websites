/**
 * NexusCode - Interactive Experience
 * Core JavaScript for animations, interactions, and dynamic rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initCustomCursor();
  initNavbarScroll();
  initTerminalAnimation();
  initAnimatedCounters();
  initFileTree();
  initTabs();
  initHeatmap();
  initCommitGraph();
  initParallaxEffect();
  initScrollReveal();
});

/* =========================================
   1. Custom Cursor System
   ========================================= */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state for interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .tree-row, .tab, .btn, input, .icon-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* =========================================
   2. Navbar Scroll Effect
   ========================================= */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* =========================================
   3. Terminal Typing & Fade Animation
   ========================================= */
function initTerminalAnimation() {
  const lines = document.querySelectorAll('.terminal-line');
  if (!lines.length) return;

  lines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(8px)';
    line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, index * 350 + 400);
  });
}

/* =========================================
   4. Animated Counters (Intersection Observer)
   ========================================= */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.count);
        animateValue(entry.target, 0, target, 1800);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));

  function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }
}

/* =========================================
   5. Interactive File Tree
   ========================================= */
function initFileTree() {
  document.querySelectorAll('.tree-item.folder').forEach(folder => {
    folder.addEventListener('click', (e) => {
      // Prevent toggling if clicking a child element that shouldn't trigger it
      if (e.target.closest('.tree-children')) return;
      folder.classList.toggle('expanded');
    });
  });
}

/* =========================================
   6. Tab Switching Logic
   ========================================= */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update tab states
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding panel
      const targetId = `${tab.dataset.tab}-tab`;
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          // Trigger reflow for animations if needed
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
          });
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* =========================================
   7. Dynamic Contribution Heatmap
   ========================================= */
function initHeatmap() {
  const container = document.getElementById('contributionHeatmap');
  if (!container) return;

  const weeks = 24;
  const days = 7;

  // Inject minimal required styles if not fully defined
  const style = document.createElement('style');
  style.textContent = `
    .heatmap-grid { display: flex; gap: 4px; padding: 1rem 0; overflow-x: auto; }
    .heatmap-column { display: flex; flex-direction: column; gap: 4px; }
    .heatmap-cell { width: 12px; height: 12px; border-radius: 3px; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
    .heatmap-cell:hover { transform: scale(1.5); z-index: 10; box-shadow: 0 0 8px var(--neon-cyan-glow); }
    .level-0 { background: var(--bg-hover); }
    .level-1 { background: rgba(0, 229, 255, 0.2); }
    .level-2 { background: rgba(0, 229, 255, 0.4); }
    .level-3 { background: rgba(0, 229, 255, 0.7); }
    .level-4 { background: var(--neon-cyan); box-shadow: 0 0 6px var(--neon-cyan-glow); }
  `;
  document.head.appendChild(style);

  container.innerHTML = '';

  for (let w = 0; w < weeks; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-column';
    
    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      // Weighted random for realistic contribution patterns
      const rand = Math.random();
      let level = 0;
      if (rand > 0.85) level = 4;
      else if (rand > 0.65) level = 3;
      else if (rand > 0.4) level = 2;
      else if (rand > 0.2) level = 1;

      cell.className = `heatmap-cell level-${level}`;
      cell.title = `${Math.floor(Math.random() * 25)} contributions`;
      col.appendChild(cell);
    }
    container.appendChild(col);
  }
}

/* =========================================
   8. Canvas Commit Graph Visualization
   ========================================= */
function initCommitGraph() {
  const canvas = document.getElementById('commitGraph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrame;

  // Data structure for branches and commits
  const nodes = [];
  const connections = [];
  
  // Generate realistic git-like structure
  function generateData() {
    nodes.length = 0;
    connections.length = 0;
    
    const mainBranch = [];
    const featureBranch = [];
    const hotfixBranch = [];
    
    // Main branch commits
    for (let i = 0; i < 6; i++) {
      mainBranch.push({ id: nodes.length, branch: 'main', color: '#00e5ff' });
      nodes.push(mainBranch[mainBranch.length - 1]);
    }
    
    // Feature branch
    featureBranch.push({ id: nodes.length, branch: 'feature', parent: 1, color: '#a78bfa' });
    nodes.push(featureBranch[0]);
    featureBranch.push({ id: nodes.length, branch: 'feature', parent: featureBranch[0].id, color: '#a78bfa' });
    nodes.push(featureBranch[1]);
    
    // Hotfix branch
    hotfixBranch.push({ id: nodes.length, branch: 'hotfix', parent: 2, color: '#f472b6' });
    nodes.push(hotfixBranch[0]);
    
    // Connections
    for (let i = 0; i < mainBranch.length - 1; i++) {
      connections.push([mainBranch[i].id, mainBranch[i + 1].id]);
    }
    connections.push([1, featureBranch[0].id]);
    connections.push([featureBranch[0].id, featureBranch[1].id]);
    connections.push([featureBranch[1].id, 4]); // Merge back
    connections.push([2, hotfixBranch[0].id]);
    connections.push([hotfixBranch[0].id, 5]); // Merge back
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  function layoutNodes() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    const mainNodes = nodes.filter(n => n.branch === 'main');
    const featNodes = nodes.filter(n => n.branch === 'feature');
    const hotfixNodes = nodes.filter(n => n.branch === 'hotfix');
    
    // Position main
    mainNodes.forEach((n, i) => {
      n.x = 40;
      n.y = (height / (mainNodes.length + 1)) * (i + 1);
    });
    
    // Position feature
    featNodes.forEach((n, i) => {
      n.x = width * 0.6;
      n.y = (height / (mainNodes.length + 1)) * (2 + i);
    });
    
    // Position hotfix
    hotfixNodes.forEach((n, i) => {
      n.x = width * 0.8;
      n.y = (height / (mainNodes.length + 1)) * (3);
    });
  }

  function draw() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    connections.forEach(([startId, endId]) => {
      const start = nodes.find(n => n.id === startId);
      const end = nodes.find(n => n.id === endId);
      if (!start || !end) return;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      
      // Bezier curve for smooth lines
      const cp1x = start.x;
      const cp1y = start.y + (end.y - start.y) * 0.5;
      const cp2x = end.x;
      const cp2y = end.y - (end.y - start.y) * 0.5;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
      
      ctx.strokeStyle = start.color + '44';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Glow effect on hover (simulated with static subtle glow)
      ctx.strokeStyle = start.color + '22';
      ctx.lineWidth = 6;
      ctx.stroke();
    });
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = node.color + '66';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  function init() {
    resize();
    generateData();
    layoutNodes();
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    layoutNodes();
    draw();
  });

  // Initial render with delay for container sizing
  setTimeout(init, 100);
}

/* =========================================
   9. Parallax Floating Cards
   ========================================= */
function initParallaxEffect() {
  const hero = document.querySelector('.hero-visual');
  const cards = document.querySelectorAll('.floating-card');
  
  if (!hero || !cards.length) return;

  let bounds = hero.getBoundingClientRect();
  
  function updateBounds() {
    bounds = hero.getBoundingClientRect();
  }
  
  window.addEventListener('resize', updateBounds);

  hero.addEventListener('mousemove', (e) => {
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    cards.forEach((card, i) => {
      const depth = (i + 1) * 0.5;
      const moveX = (x - centerX) * depth * 0.02;
      const moveY = (y - centerY) * depth * 0.02;
      
      card.style.transform = `
        translate(${moveX}px, ${moveY}px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `;
    });
  });

  hero.addEventListener('mouseleave', () => {
    cards.forEach(card => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'translate(0, 0) rotateX(0) rotateY(0)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* =========================================
   10. Scroll Reveal Animations
   ========================================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.feature-card, .stat-card, .activity-item, .sidebar-panel');
  
  // Initial state
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay based on index among siblings
        const siblings = Array.from(entry.target.parentNode.children).filter(c => revealElements.includes(c));
        const index = siblings.indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
}