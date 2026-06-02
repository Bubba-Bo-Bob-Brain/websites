const laboratorium = document.getElementById('laboratorium');
const stageIndicator = document.getElementById('stageIndicator');
const stageSymbol = document.getElementById('stageSymbol');
const stageName = document.getElementById('stageName');
const transmutationCore = document.getElementById('transmutationCore');
const philosopherStone = document.getElementById('philosopherStone');
const alembicLiquid = document.getElementById('alembicLiquid');
const goldVeil = document.getElementById('goldVeil');
const mortar = document.getElementById('mortar');
const pestle = document.getElementById('pestle');
const groundMaterial = document.getElementById('groundMaterial');
const manuscriptScroll = document.getElementById('manuscriptScroll');
const marginaliaNote = document.getElementById('marginaliaNote');
const advanceBtn = document.getElementById('advanceStage');
const grindBtn = document.getElementById('grindAction');
const progressDots = document.querySelectorAll('.progress-dot');
const planetaryRing = document.getElementById('planetaryRing');
const planets = document.querySelectorAll('.planet');
const rawIngredients = document.querySelectorAll('.raw-ingredient');
const pouchContents = document.getElementById('pouchContents');
const celestialCanvas = document.getElementById('celestialCanvas');
const ctx = celestialCanvas.getContext('2d');

const stages = [
  { name: 'Nigredo', symbol: '🜄', subtitle: 'Putrefactio', liquid: '#1a1008', stone: '#1a1a1a', veil: 0.2, core: '#2a2018' },
  { name: 'Albedo', symbol: '🜁', subtitle: 'Purificatio', liquid: '#d9d9d9', stone: '#e0e0e0', veil: 0.5, core: '#c0b7a8' },
  { name: 'Citrinitas', symbol: '🜂', subtitle: 'Sublimatio', liquid: '#d4a843', stone: '#e6c860', veil: 0.8, core: '#b3923a' },
  { name: 'Rubedo', symbol: '🜃', subtitle: 'Perfectio', liquid: '#a12f2f', stone: '#e63946', veil: 1.0, core: '#8b1a1a' }
];

let currentStage = 0;
let isGrinding = false;
let groundCount = 0;
let celestialStars = [];
let mouseX = 0;
let mouseY = 0;

function initCelestial() {
  celestialCanvas.width = window.innerWidth;
  celestialCanvas.height = window.innerHeight;
  celestialStars = [];
  for (let i = 0; i < 80; i++) {
    celestialStars.push({
      x: Math.random() * celestialCanvas.width,
      y: Math.random() * celestialCanvas.height,
      radius: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.03 + 0.005
    });
  }
  drawCelestial();
}

function drawCelestial() {
  ctx.clearRect(0, 0, celestialCanvas.width, celestialCanvas.height);
  celestialStars.forEach(star => {
    star.alpha += star.pulse;
    if (star.alpha > 0.8 || star.alpha < 0.15) star.pulse *= -1;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 210, 180, ${star.alpha})`;
    ctx.fill();
  });

  const centerX = celestialCanvas.width / 2;
  const centerY = celestialCanvas.height / 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 160, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(201, 169, 78, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const zodiacSymbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * 180;
    const y = centerY + Math.sin(angle) * 180;
    ctx.font = '16px serif';
    ctx.fillStyle = 'rgba(200, 170, 100, 0.45)';
    ctx.fillText(zodiacSymbols[i], x - 8, y + 6);
  }
  requestAnimationFrame(drawCelestial);
}

function updateStageUI() {
  const stage = stages[currentStage];
  stageSymbol.textContent = stage.symbol;
  stageName.textContent = stage.name;
  stageIndicator.querySelector('.stage-subtitle').textContent = stage.subtitle;
  alembicLiquid.style.background = `linear-gradient(0deg, ${stage.liquid} 0%, ${stage.liquid}dd 80%)`;
  philosopherStone.style.background = stage.stone;
  philosopherStone.style.boxShadow = `0 0 25px ${stage.stone}`;
  transmutationCore.style.background = `radial-gradient(circle, ${stage.core} 20%, #0f0c08 90%)`;
  goldVeil.style.opacity = stage.veil;
  
  progressDots.forEach((dot, index) => {
    if (index <= currentStage) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  if (currentStage === 3) {
    philosopherStone.style.transform = 'scale(2.2)';
    philosopherStone.style.opacity = '1';
    transmutationCore.style.boxShadow = '0 0 50px #e63946, 0 0 100px #ff4d4d';
    advanceBtn.textContent = 'Opus Perfectum';
    advanceBtn.disabled = true;
  } else {
    philosopherStone.style.transform = 'scale(1)';
    advanceBtn.textContent = 'Calcinate';
    advanceBtn.disabled = false;
  }
}

function advanceStage() {
  if (currentStage < 3) {
    currentStage++;
    updateStageUI();
    triggerStageTransition();
  }
}

function triggerStageTransition() {
  laboratorium.style.transition = 'background 1.2s ease';
  if (currentStage === 1) laboratorium.style.background = 'radial-gradient(ellipse at center, #2a2720 0%, #0e0c08 90%)';
  if (currentStage === 2) laboratorium.style.background = 'radial-gradient(ellipse at center, #2e2410 0%, #0f0a04 90%)';
  if (currentStage === 3) laboratorium.style.background = 'radial-gradient(ellipse at center, #2a1015 0%, #0a0406 90%)';
  
  planetaryRing.style.transform = 'scale(1.05)';
  setTimeout(() => { planetaryRing.style.transform = 'scale(1)'; }, 600);
}

function grindPestle() {
  if (isGrinding) return;
  isGrinding = true;
  pestle.style.transform = 'translateX(-50%) rotate(25deg) translateY(-8px)';
  
  setTimeout(() => {
    pestle.style.transform = 'translateX(-50%) rotate(5deg) translateY(2px)';
    groundCount++;
    if (groundCount >= 3) {
      groundMaterial.style.opacity = '1';
      groundMaterial.textContent = '🜘';
      marginaliaNote.style.opacity = '1';
      marginaliaNote.style.background = 'rgba(212, 168, 67, 0.25)';
    }
    isGrinding = false;
  }, 350);
}

function selectIngredient(element) {
  const type = element.dataset.type;
  element.style.transform = 'scale(1.4)';
  setTimeout(() => { element.style.transform = 'scale(1)'; }, 200);
  
  if (type === 'vitriol') {
    alembicLiquid.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => { alembicLiquid.style.filter = 'none'; }, 1200);
  } else if (type === 'antimony') {
    philosopherStone.style.filter = 'brightness(1.5)';
    setTimeout(() => { philosopherStone.style.filter = 'none'; }, 800);
  }
}

function handlePlanetClick(planet) {
  const planetName = planet.dataset.planet;
  planet.style.transform = 'translateX(-50%) scale(1.6)';
  setTimeout(() => { planet.style.transform = 'translateX(-50%) scale(1)'; }, 300);
  
  const coreGlyph = document.querySelector('.core-glyph');
  const symbols = { saturn: '♄', jupiter: '♃', mars: '♂', sun: '☉', venus: '♀', mercury: '☿', moon: '☽' };
  coreGlyph.textContent = symbols[planetName] || '🜍';
}

advanceBtn.addEventListener('click', advanceStage);
grindBtn.addEventListener('click', grindPestle);

mortar.addEventListener('click', (e) => {
  if (e.target.closest('.pestle')) return;
  grindPestle();
});

rawIngredients.forEach(ing => {
  ing.addEventListener('click', (e) => {
    e.stopPropagation();
    selectIngredient(ing);
  });
  ing.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', ing.dataset.type);
  });
});

mortar.addEventListener('dragover', (e) => e.preventDefault());
mortar.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('text/plain');
  if (type) {
    groundMaterial.style.opacity = '1';
    groundMaterial.textContent = type === 'vitriol' ? '🜖' : type === 'antimony' ? '♁' : '🜓';
    grindPestle();
  }
});

planets.forEach(planet => {
  planet.addEventListener('click', (e) => {
    e.stopPropagation();
    handlePlanetClick(planet);
  });
});

manuscriptScroll.addEventListener('scroll', () => {
  const scrollTop = manuscriptScroll.scrollTop;
  if (scrollTop > 60) {
    marginaliaNote.style.opacity = '1';
    marginaliaNote.style.transform = 'translateX(0)';
  }
});

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  const moveX = (mouseX / window.innerWidth - 0.5) * 8;
  const moveY = (mouseY / window.innerHeight - 0.5) * 8;
  planetaryRing.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

window.addEventListener('resize', () => {
  celestialCanvas.width = window.innerWidth;
  celestialCanvas.height = window.innerHeight;
});

initCelestial();
updateStageUI();

setTimeout(() => {
  marginaliaNote.style.opacity = '0.7';
}, 2000);