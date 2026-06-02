document.addEventListener('DOMContentLoaded', () => {
  // --- Configuration & State ---
  const state = {
    time: 12,
    season: 'spring',
    showConstellations: true,
    showIslandNames: true,
    bioluminescence: true,
    swellIntensity: 5,
    currentSpeed: 50,
    mouseX: 0,
    mouseY: 0,
    domeRotation: { x: 0, y: 0 }
  };

  // --- DOM Elements ---
  const starField = document.getElementById('starField');
  const constellationLayer = document.getElementById('constellationLayer');
  const starDome = document.getElementById('starDome');
  const infoPanel = document.getElementById('infoPanel');
  const infoDetails = document.getElementById('infoDetails');
  const waveCanvas = document.getElementById('waveCanvas');
  const waveCtx = waveCanvas.getContext('2d');
  const bioCanvas = document.getElementById('bioluminescenceCanvas');
  const bioCtx = bioCanvas.getContext('2d');
  const loadingScreen = document.getElementById('loadingScreen');
  
  // Controls
  const timeSlider = document.getElementById('timeSlider');
  const timeDisplay = document.getElementById('timeDisplay');
  const seasonToggle = document.getElementById('seasonToggle');
  const swellInput = document.getElementById('swellIntensity');
  const currentInput = document.getElementById('currentSpeed');
  const navBtns = document.querySelectorAll('.nav-btn');
  const checkboxes = {
    showConstellations: document.getElementById('showConstellations'),
    showIslandNames: document.getElementById('showIslandNames'),
    bioluminescence: document.getElementById('bioluminescence')
  };

  // --- Data: Polynesian Star Knowledge ---
  const starData = {
    hokulea: { name: "Hokule'a", meaning: "Star of Gladness (Polaris)", desc: "The North Star. It stands still while other stars move. Used to find true North." },
    manu: { name: "Manu", meaning: "The Bird", desc: "A large constellation representing a bird. Its rising and setting mark important sailing seasons." },
    ike: { name: "Ike", meaning: "Knowledge", desc: "Represents the knowledge required to navigate the open ocean. Visible in the southern sky." },
    pualoa: { name: "Pualoa", meaning: "Long Journey", desc: "Marks the path for long voyages across the equator." },
    hikianalia: { name: "Hikianalia", meaning: "Star of Guidance", desc: "Used as a key reference point for latitude determination." },
    kaulana: { name: "Kaulana", meaning: "Famous/Renowned", desc: "A bright star used for timing and direction." }
  };

  // --- Initialization ---
  function init() {
    resizeCanvases();
    generateStars();
    drawConstellations();
    setupEventListeners();
    startAnimations();

    // Hide loading screen after a brief moment
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
    }, 1500);
  }

  // --- Star Field System ---
  function generateStars() {
    starField.innerHTML = '';
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star-point');
      
      // Random position within the dome area
      const ra = Math.random() * 360;
      const dec = (Math.random() * 180) - 90;
      
      // Convert to CSS position (simplified projection)
      const x = 50 + (ra - 180) * 1.2; 
      const y = 50 + dec * 1.2;
      
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      
      // Random size and brightness
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = Math.random() * 0.8 + 0.2;
      
      // Add data attributes for interaction
      const keys = Object.keys(starData);
      star.dataset.star = keys[Math.floor(Math.random() * keys.length)];
      
      // Click event for info
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        showStarInfo(star.dataset.star);
      });
      
      starField.appendChild(star);
    }
  }

  function drawConstellations() {
    if (!state.showConstellations) {
      constellationLayer.innerHTML = '';
      return;
    }
    
    constellationLayer.innerHTML = '';
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";

    // Define paths for constellations (simplified for demo)
    const paths = [
      { d: "M 45% 40% L 50% 35% L 55% 40%", color: "rgba(100, 255, 218, 0.4)" },
      { d: "M 30% 60% L 40% 55% L 50% 60%", color: "rgba(255, 183, 0, 0.3)" }
    ];

    paths.forEach(pathData => {
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathData.d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", pathData.color);
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("stroke-dasharray", "4 4");
      svg.appendChild(path);
    });

    constellationLayer.appendChild(svg);
  }

  // --- Bioluminescent Wake System ---
  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.color = `hsl(${160 + Math.random() * 40}, 100%, 70%)`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.96;
    }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function handleBioluminescence(e) {
    if (!state.bioluminescence) return;
    const rect = bioCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(x, y));
    }
  }

  function animateBioluminescence() {
    bioCtx.clearRect(0, 0, bioCanvas.width, bioCanvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(bioCtx);
      if (particles[i].life <= 0 || particles[i].size <= 0.1) {
        particles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(animateBioluminescence);
  }

  // --- Wave Animation System ---
  let waveOffset = 0;

  function animateWaves() {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    waveCtx.fillStyle = 'rgba(17, 34, 64, 0.3)';
    waveCtx.beginPath();
    
    const intensity = state.swellIntensity * 0.5;
    const speed = state.currentSpeed * 0.001;
    waveOffset += speed;

    for (let i = 0; i <= waveCanvas.width; i += 10) {
      const y = waveCanvas.height / 2 + 
                Math.sin((i + waveOffset * 50) * 0.01) * intensity * 10 + 
                Math.sin((i + waveOffset * 20) * 0.02) * intensity * 5;
      
      if (i === 0) {
        waveCtx.moveTo(i, y);
      } else {
        waveCtx.lineTo(i, y);
      }
    }

    waveCtx.lineTo(waveCanvas.width, waveCanvas.height);
    waveCtx.lineTo(0, waveCanvas.height);
    waveCtx.closePath();
    waveCtx.fill();
    
    requestAnimationFrame(animateWaves);
  }

  // --- UI & Interaction Logic ---
  function showStarInfo(starKey) {
    const data = starData[starKey];
    if (!data) return;

    infoDetails.innerHTML = `
      <p><strong>${data.name}</strong>: ${data.meaning}</p>
      <p>${data.desc}</p>
    `;
    infoPanel.classList.add('active');

    setTimeout(() => {
      infoPanel.classList.remove('active');
    }, 5000);
  }

  function setupEventListeners() {
    // Mouse Move for Dome Rotation
    document.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      state.domeRotation.x = (e.clientY - centerY) * 0.05;
      state.domeRotation.y = (e.clientX - centerX) * 0.05;
    });

    // Bioluminescence Trail
    document.addEventListener('mousemove', handleBioluminescence);

    // Controls
    timeSlider.addEventListener('input', (e) => {
      state.time = parseFloat(e.target.value);
      const hours = Math.floor(state.time);
      const minutes = Math.floor((state.time - hours) * 60);
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      timeDisplay.textContent = timeString;
    });

    seasonToggle.addEventListener('change', (e) => {
      state.season = e.target.value;
    });

    swellInput.addEventListener('input', (e) => {
      state.swellIntensity = parseInt(e.target.value);
    });

    currentInput.addEventListener('input', (e) => {
      state.currentSpeed = parseInt(e.target.value);
    });

    // Checkboxes
    checkboxes.showConstellations.addEventListener('change', (e) => {
      state.showConstellations = e.target.checked;
      drawConstellations();
    });

    checkboxes.showIslandNames.addEventListener('change', (e) => {
      state.showIslandNames = e.target.checked;
      document.querySelectorAll('.island-name').forEach(el => {
        el.style.display = state.showIslandNames ? 'block' : 'none';
      });
    });

    checkboxes.bioluminescence.addEventListener('change', (e) => {
      state.bioluminescence = e.target.checked;
    });

    // Navigation Buttons
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log(`Switched to view: ${btn.dataset.view}`);
      });
    });

    // Window Resize
    window.addEventListener('resize', resizeCanvases);
  }

  function resizeCanvases() {
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = window.innerHeight;
    bioCanvas.width = window.innerWidth;
    bioCanvas.height = window.innerHeight;
  }

  function startAnimations() {
    animateBioluminescence();
    animateWaves();
  }

  function updateDomeRotation() {
    if (starDome) {
      starDome.style.transform = `translate(-50%, -50%) rotateY(${state.domeRotation.y}deg) rotateX(${state.domeRotation.x}deg)`;
    }
    requestAnimationFrame(updateDomeRotation);
  }

  // Start the dome rotation loop
  updateDomeRotation();

  // Initialize
  init();
});