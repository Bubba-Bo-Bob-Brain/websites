// ===== DOM Elements =====
const commitGraphCanvas = document.getElementById('commitGraph');
const contributionHeatmap = document.getElementById('contributionHeatmap');
const fileTreeNodes = document.querySelectorAll('.file-node');
const mergeRequestCards = document.querySelectorAll('.merge-request-card');
const repoCards = document.querySelectorAll('.repo-card');
const activityItems = document.querySelectorAll('.activity-item');

// ===== Commit Graph Visualization =====
class CommitGraph {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.commits = this.generateMockCommits();
    this.branches = [
      { name: 'main', color: '#00f5ff' },
      { name: 'dev', color: '#b388ff' },
      { name: 'feature/login', color: '#ff2a6d' }
    ];
    this.nodeRadius = 6;
    this.lineWidth = 2;
    this.animationProgress = 0;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);
    this.resize();
    this.animate();
  }

  generateMockCommits() {
    const commits = [];
    const now = Date.now();
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const branchIndex = Math.floor(Math.random() * this.branches.length);
      commits.push({
        id: `commit-${i}`,
        date: new Date(now - daysAgo * 24 * 60 * 60 * 1000),
        branch: this.branches[branchIndex].name,
        color: this.branches[branchIndex].color,
        x: Math.random() * 800 + 100,
        y: Math.random() * 300 + 50
      });
    }
    // Sort by date (newest first)
    commits.sort((a, b) => b.date - a.date);
    return commits;
  }

  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw branches
    this.branches.forEach(branch => {
      this.ctx.strokeStyle = branch.color;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();
      const branchCommits = this.commits.filter(c => c.branch === branch.name);
      if (branchCommits.length > 0) {
        this.ctx.moveTo(branchCommits[0].x, branchCommits[0].y);
        for (let i = 1; i < branchCommits.length; i++) {
          this.ctx.lineTo(branchCommits[i].x, branchCommits[i].y);
        }
      }
      this.ctx.stroke();
    });

    // Draw commit nodes
    this.commits.forEach(commit => {
      this.ctx.fillStyle = commit.color;
      this.ctx.beginPath();
      this.ctx.arc(commit.x, commit.y, this.nodeRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // Glow effect
      this.ctx.shadowColor = commit.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = commit.color;
      this.ctx.beginPath();
      this.ctx.arc(commit.x, commit.y, this.nodeRadius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Tooltip (hover effect)
      this.ctx.font = '10px Rajdhani, sans-serif';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(commit.id.substring(0, 7), commit.x + 10, commit.y - 5);
    });
  }

  animate() {
    // Smooth animation for graph rendering
    if (this.animationProgress < 1) {
      this.animationProgress += 0.05;
      this.draw();
      requestAnimationFrame(() => this.animate());
    }
  }
}

// ===== Contribution Heatmap =====
class ContributionHeatmap {
  constructor(container) {
    this.container = container;
    this.days = 365;
    this.weeks = Math.ceil(this.days / 7);
    this.generateHeatmap();
  }

  generateHeatmap() {
    this.container.innerHTML = '';
    const today = new Date();
    const contributions = [];

    // Generate mock contribution data
    for (let i = 0; i < this.days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const intensity = Math.random();
      contributions.push({
        date: date,
        intensity: intensity > 0.8 ? 4 : intensity > 0.6 ? 3 : intensity > 0.4 ? 2 : intensity > 0.2 ? 1 : 0
      });
    }

    // Create heatmap cells
    contributions.forEach((day, index) => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      const intensity = day.intensity;
      if (intensity > 0) {
        const opacity = intensity * 0.25 + 0.1;
        if (intensity === 1) cell.style.backgroundColor = `rgba(0, 245, 255, ${opacity})`;
        if (intensity === 2) cell.style.backgroundColor = `rgba(179, 136, 255, ${opacity})`;
        if (intensity === 3) cell.style.backgroundColor = `rgba(255, 42, 109, ${opacity})`;
        if (intensity === 4) cell.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      }
      cell.title = day.date.toDateString();
      this.container.appendChild(cell);
    });
  }
}

// ===== File Tree Explorer =====
class FileTree {
  constructor(nodes) {
    this.nodes = nodes;
    this.init();
  }

  init() {
    this.nodes.forEach(node => {
      node.addEventListener('click', () => this.toggleNode(node));
      // Expand nodes with children by default
      if (node.nextElementSibling && node.nextElementSibling.classList.contains('file-children')) {
        node.classList.add('expanded');
        node.nextElementSibling.style.display = 'block';
      }
    });
  }

  toggleNode(node) {
    const children = node.nextElementSibling;
    if (children && children.classList.contains('file-children')) {
      node.classList.toggle('expanded');
      children.style.display = node.classList.contains('expanded') ? 'block' : 'none';
      // Update toggle icon
      const toggleIcon = node.querySelector('.toggle-icon');
      if (toggleIcon) {
        toggleIcon.textContent = node.classList.contains('expanded') ? '▼' : '▶';
      }
    }
  }
}

// ===== Diff Viewer Enhancements =====
class DiffViewer {
  constructor() {
    this.initSyntaxHighlighting();
    this.initLineNumbers();
  }

  initSyntaxHighlighting() {
    const diffLines = document.querySelectorAll('.diff-line');
    diffLines.forEach(line => {
      if (line.classList.contains('added')) {
        line.style.backgroundColor = 'rgba(0, 255, 133, 0.15)';
      } else if (line.classList.contains('removed')) {
        line.style.backgroundColor = 'rgba(255, 126, 95, 0.15)';
      }
    });
  }

  initLineNumbers() {
    const lineNumbers = document.querySelectorAll('.diff-line-number');
    lineNumbers.forEach((number, index) => {
      number.textContent = index + 1;
    });
  }
}

// ===== Merge Request Animations =====
class MergeRequestAnimations {
  constructor(cards) {
    this.cards = cards;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      // Add pulse animation for open requests
      if (card.classList.contains('open')) {
        card.style.animation = 'pulse 2s infinite';
      }
      // Add fade-in effect
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    });
  }
}

// ===== Repository Card Hover Effects =====
class RepoCardEffects {
  constructor(cards) {
    this.cards = cards;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const glowColor = card.classList.contains('featured') ? '#00f5ff' : '#b388ff';
        card.style.boxShadow = `0 0 20px rgba(${this.hexToRgb(glowColor)}, 0.3)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
      });
    });
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  }
}

// ===== Activity Feed Animations =====
class ActivityFeedAnimations {
  constructor(items) {
    this.items = items;
    this.init();
  }

  init() {
    this.items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100);
    });
  }
}

// ===== Smooth Scroll & Parallax Effects =====
class ScrollEffects {
  constructor() {
    this.init();
  }

  init() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.transform = `translateY(${rate}px)`;
        hero.style.opacity = 1 - scrolled / 700;
      });
    }
  }
}

// ===== Initialize All Features =====
document.addEventListener('DOMContentLoaded', () => {
  // Commit Graph
  if (commitGraphCanvas) {
    new CommitGraph(commitGraphCanvas);
  }

  // Contribution Heatmap
  if (contributionHeatmap) {
    new ContributionHeatmap(contributionHeatmap);
  }

  // File Tree
  if (fileTreeNodes.length > 0) {
    new FileTree(fileTreeNodes);
  }

  // Diff Viewer
  new DiffViewer();

  // Merge Request Animations
  if (mergeRequestCards.length > 0) {
    new MergeRequestAnimations(mergeRequestCards);
  }

  // Repo Card Effects
  if (repoCards.length > 0) {
    new RepoCardEffects(repoCards);
  }

  // Activity Feed Animations
  if (activityItems.length > 0) {
    new ActivityFeedAnimations(activityItems);
  }

  // Scroll Effects
  new ScrollEffects();

  // Add global animations
  this.addGlobalAnimations();
});

function addGlobalAnimations() {
  // Add CSS animations for pulse effect
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 245, 255, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(0, 245, 255, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 245, 255, 0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes glow {
      0% { text-shadow: 0 0 5px rgba(0, 245, 255, 0.5); }
      50% { text-shadow: 0 0 10px rgba(0, 245, 255, 0.8); }
      100% { text-shadow: 0 0 5px rgba(0, 245, 255, 0.5); }
    }
  `;
  document.head.appendChild(style);

  // Apply glow animation to logo
  const logo = document.querySelector('.logo-text');
  if (logo) {
    logo.style.animation = 'glow 2s infinite';
  }
}