const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() * 0.3) - 0.15;
    this.speedY = (Math.random() * 0.3) - 0.15;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += dx * force * 0.02;
        this.y += dy * force * 0.02;
      }
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185, 131, 255, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles(120);

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

const graphSvg = document.querySelector('.graph-svg');
function drawCommitGraph() {
  if (!graphSvg) return;
  graphSvg.innerHTML = '';
  const width = 800;
  const height = 300;
  const branches = {
    main: { color: '#3df0e8', y: 80,x: 100, commits: [] },
    feature: { color: '#b983ff', y: 160,x: 100, commits: [] },
    hotfix: { color: '#ff6b9d', y: 230,x: 100, commits: [] }
  };

  for (let i = 0; i < 12; i++) {
    branches.main.commits.push({ x: 100 + i * 55, y: 80 });
  }
  for (let i = 0; i < 7; i++) {
    branches.feature.commits.push({ x: 150 + i * 70, y: 160 });
  }
  for (let i = 0; i < 5; i++) {
    branches.hotfix.commits.push({ x: 200 + i * 80, y: 230 });
  }

  function drawBranch(branchData) {
    const points = branchData.commits;
    if (points.length < 2) return;
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", branchData.color);
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "0.8");
    graphSvg.appendChild(path);

    points.forEach((pt, idx) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", pt.x);
      circle.setAttribute("cy", pt.y);
      circle.setAttribute("r", idx === points.length-1 ? "6" : "4");
      circle.setAttribute("fill", branchData.color);
      circle.setAttribute("stroke", "#0b0a10");
      circle.setAttribute("stroke-width", "1.5");
      graphSvg.appendChild(circle);
    });
  }

  drawBranch(branches.main);
  drawBranch(branches.feature);
  drawBranch(branches.hotfix);

  const mergeLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
  mergeLine.setAttribute("d", "M 420 160 Q 480 120 530 80");
  mergeLine.setAttribute("stroke", "#b983ff");
  mergeLine.setAttribute("stroke-width", "1.5");
  mergeLine.setAttribute("stroke-dasharray", "4 3");
  mergeLine.setAttribute("fill", "none");
  graphSvg.appendChild(mergeLine);
}
drawCommitGraph();

function generateHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;
  grid.innerHTML = '';
  constweeks = 52;
  const days = 7;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      const intensity = Math.random();
      if (intensity > 0.7) {
        cell.style.background = '#2ee6a8';
        cell.style.boxShadow = '0 0 6px #2ee6a8';
      } else if (intensity > 0.4) {
        cell.style.background = '#1f8a6e';
      } else if (intensity > 0.15) {
        cell.style.background = '#1c4d40';
      }
      grid.appendChild(cell);
    }
  }
}
generateHeatmap();

const diffLines = document.querySelectorAll('.diff-line');
diffLines.forEach((line, index) => {
  line.style.transition = 'transform 0.3s ease, background 0.2s';
  line.addEventListener('mouseenter', () => {
    line.style.transform = 'translateX(6px)';
    line.style.background = 'rgba(255,255,255,0.03)';
  });
  line.addEventListener('mouseleave', () => {
    line.style.transform = 'translateX(0)';
    line.style.background = '';
  });
});

const mergeItems = document.querySelectorAll('.merge-item');
mergeItems.forEach(item => {
  item.addEventListener('click', function(e) {
    mergeItems.forEach(i => i.style.border = '1px solid transparent');
    this.style.border = '1px solid rgba(255,255,255,0.2)';
    this.style.background = 'rgba(255,255,255,0.04)';
  });
});

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    this.classList.add('active');
  });
});

const ctrlButtons = document.querySelectorAll('.ctrl-btn');
ctrlButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    ctrlButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    if (this.textContent.trim() === 'Graph') {
      drawCommitGraph();
    }
  });
});

const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

const fileTreeItems = document.querySelectorAll('.tree-item');
fileTreeItems.forEach(item => {
  item.addEventListener('click', function() {
    fileTreeItems.forEach(i => i.classList.remove('active-file'));
    this.classList.add('active-file');
  });
});