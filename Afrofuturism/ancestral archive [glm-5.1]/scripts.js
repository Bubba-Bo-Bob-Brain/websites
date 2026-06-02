document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initNavigation();
  initHeroCosmos();
  initArtifactViewer();
  initGriotHall();
  initStarMap();
  initTimeline();
  initScrollReveal();
  initParallax();
});

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

function initNavigation() {
  const nav = document.getElementById('adinkraNav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.gallery-section');

  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  navItems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY && scrollY > 100) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4) {
        currentSection = section.id;
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === currentSection) {
        item.classList.add('active');
      }
    });

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });
}

function initHeroCosmos() {
  const canvas = document.getElementById('heroCosmos');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let particles = [];
  let animFrame;

  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function createStars() {
    stars = [];
    const count = Math.floor((width * height) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        alpha: 0,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 45 : 190) : 0,
        saturation: Math.random() > 0.85 ? 60 : 0
      });
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 25000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        radius: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.15 + 0.05
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      star.alpha = star.baseAlpha * (0.5 + twinkle * 0.5);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      if (star.hue > 0) {
        ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 80%, ${star.alpha})`;
      } else {
        ctx.fillStyle = `rgba(240, 232, 216, ${star.alpha})`;
      }
      ctx.fill();

      if (star.radius > 1.2 && star.alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${star.alpha * 0.08})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196, 160, 255, ${p.alpha})`;
      ctx.fill();
    }

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createStars();
  createParticles();
  animFrame = requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
    createStars();
    createParticles();
  });
}

function initArtifactViewer() {
  const artifact3d = document.getElementById('artifact3d');
  const nameEl = document.getElementById('artifactName');
  const originEl = document.getElementById('artifactOrigin');
  const descEl = document.getElementById('artifactDescription');
  const mediumEl = document.getElementById('artifactMedium');
  const originMetaEl = document.getElementById('artifactOriginMeta');
  const eraEl = document.getElementById('artifactEra');
  const rotateLeftBtn = document.getElementById('rotateLeft');
  const rotateRightBtn = document.getElementById('rotateRight');
  const indicatorDots = document.querySelectorAll('.indicator-dot');
  const thumbs = document.querySelectorAll('.artifact-thumb');

  if (!artifact3d) return;

  const artifactsData = [
    {
      name: 'Benin Bronze Head',
      origin: 'Kingdom of Benin, 16th Century CE',
      description: 'Commemorative portrait head cast using the lost-wax technique. These bronzes adorned ancestral altars in the Oba\'s palace, connecting the living monarch to his forebears through metal and memory.',
      medium: 'Bronze (copper alloy)',
      originMeta: 'Edo State, present-day Nigeria',
      era: '1550 CE'
    },
    {
      name: 'Nubian Ceramic Vessel',
      origin: 'Kingdom of Kush, 8th Century BCE',
      description: 'Finely crafted ceramic vessel from the Napatan period, decorated with religious iconography and royal insignia. Used in funerary rites to carry provisions into the afterlife of the Kushite pharaohs.',
      medium: 'Earthenware ceramic',
      originMeta: 'Nuri, present-day Sudan',
      era: '750 BCE'
    },
    {
      name: 'Ashanti Gold Weight',
      origin: 'Asante Empire, 18th Century CE',
      description: 'Miniature brass figurine used as a counterweight in gold dust transactions. Each weight encodes a proverb or moral lesson — a philosophical system encoded in commerce itself.',
      medium: 'Brass (lost-wax cast)',
      originMeta: 'Kumasi, present-day Ghana',
      era: '1750 CE'
    },
    {
      name: 'Kuba Royal Cloth',
      origin: 'Kuba Kingdom, 19th Century CE',
      description: 'Ceremonial raffia cloth with elaborate geometric patterns unique to Kuba royalty. Each design is a signature of its maker, and no two are alike — a textile philosophy of individual expression within tradition.',
      medium: 'Raffia palm fiber',
      originMeta: 'Kasai Region, present-day DR Congo',
      era: '1880 CE'
    }
  ];

  let currentFace = 0;
  let autoRotateTimer = null;
  let isAutoRotating = false;

  function setFace(faceIndex, smooth) {
    currentFace = ((faceIndex % 4) + 4) % 4;
    const rotation = currentFace * -90;
    artifact3d.style.transition = smooth ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    artifact3d.style.transform = `rotateY(${rotation}deg)`;

    indicatorDots.forEach(dot => {
      dot.classList.toggle('active', parseInt(dot.dataset.face) === currentFace);
    });

    thumbs.forEach(thumb => {
      thumb.classList.toggle('active', parseInt(thumb.dataset.artifact) === currentFace);
    });

    const data = artifactsData[currentFace];
    if (data && nameEl) {
      nameEl.textContent = data.name;
      originEl.textContent = data.origin;
      descEl.textContent = data.description;
      mediumEl.textContent = data.medium;
      originMetaEl.textContent = data.originMeta;
      eraEl.textContent = data.era;
    }
  }

  function startAutoRotate() {
    stopAutoRotate();
    isAutoRotating = true;
    autoRotateTimer = setInterval(() => {
      setFace(currentFace + 1, true);
    }, 5000);
  }

  function stopAutoRotate() {
    isAutoRotating = false;
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function pauseAutoRotate() {
    stopAutoRotate();
    setTimeout(() => {
      if (!document.querySelector('.artifact-thumb:hover') && !document.querySelector('.rotation-btn:hover')) {
        startAutoRotate();
      }
    }, 10000);
  }

  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', () => {
      setFace(currentFace - 1, true);
      pauseAutoRotate();
    });
  }

  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', () => {
      setFace(currentFace + 1, true);
      pauseAutoRotate();
    });
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const face = parseInt(thumb.dataset.artifact);
      setFace(face, true);
      pauseAutoRotate();
    });
  });

  setFace(0, false);
  startAutoRotate();
}

function initGriotHall() {
  const griotCards = document.querySelectorAll('.griot-card');

  griotCards.forEach(card => {
    const playBtn = card.querySelector('.griot-play-btn');
    const words = card.querySelectorAll('.narration-word');
    const progressBar = card.querySelector('.griot-progress-bar');
    const totalWords = words.length;

    let isPlaying = false;
    let currentWordIndex = 0;
    let intervalId = null;

    function revealNextWord() {
      if (currentWordIndex >= totalWords) {
        stopNarration();
        return;
      }

      words.forEach((w, i) => {
        if (i < currentWordIndex) {
          w.classList.add('revealed');
          w.classList.remove('current');
        } else if (i === currentWordIndex) {
          w.classList.add('revealed', 'current');
        } else {
          w.classList.remove('revealed', 'current');
        }
      });

      const progress = ((currentWordIndex + 1) / totalWords) * 100;
      if (progressBar) {
        progressBar.style.width = progress + '%';
      }

      currentWordIndex++;
    }

    function startNarration() {
      isPlaying = true;
      card.classList.add('playing');
      playBtn.querySelector('.play-triangle').innerHTML = '&#9646;&#9646;';

      if (currentWordIndex >= totalWords) {
        resetNarration();
      }

      intervalId = setInterval(revealNextWord, 80);
    }

    function pauseNarration() {
      isPlaying = false;
      card.classList.remove('playing');
      playBtn.querySelector('.play-triangle').innerHTML = '&#x25B6;';
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function stopNarration() {
      pauseNarration();
      currentWordIndex = totalWords;
      words.forEach(w => {
        w.classList.add('revealed');
        w.classList.remove('current');
      });
      if (progressBar) progressBar.style.width = '100%';
    }

    function resetNarration() {
      currentWordIndex = 0;
      words.forEach(w => {
        w.classList.remove('revealed', 'current');
      });
      if (progressBar) progressBar.style.width = '0%';
    }

    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseNarration();
      } else {
        if (currentWordIndex >= totalWords) {
          resetNarration();
        }
        startNarration();
      }
    });
  });
}

function initStarMap() {
  const canvas = document.getElementById('starMapCanvas');
  const tooltip = document.getElementById('starMapTooltip');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipDesc = document.getElementById('tooltipDescription');
  const tooltipEra = document.getElementById('tooltipEra');

  if (!canvas || !tooltip) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = -1000;
  let mouseY = -1000;
  let hoveredStar = null;
  let animFrame;

  const starMapData = [
    { name: 'Meroë', x: 0.35, y: 0.35, type: 'ancient', description: 'Capital of the Kingdom of Kush, home to more pyramids than Egypt', era: '800 BCE – 350 CE' },
    { name: 'Timbuktu', x: 0.28, y: 0.42, type: 'trade', description: 'Great center of Islamic learning and trans-Saharan trade', era: '1100 – 1600 CE' },
    { name: 'Great Zimbabwe', x: 0.55, y: 0.65, type: 'ancient', description: 'Stone city of the Shona kingdom, hub of gold and ivory trade', era: '1100 – 1450 CE' },
    { name: 'Lagos', x: 0.32, y: 0.52, type: 'diaspora', description: 'Point of departure for millions during the Middle Passage', era: '1500 – 1800 CE' },
    { name: 'Gorée Island', x: 0.22, y: 0.45, type: 'diaspora', description: 'The door of no return — slave trading post off Senegal\'s coast', era: '1536 – 1848 CE' },
    { name: 'Haiti', x: 0.14, y: 0.50, type: 'diaspora', description: 'First Black republic — born from revolution and ancestral strength', era: '1804 CE – present' },
    { name: 'Harlem', x: 0.11, y: 0.32, type: 'diaspora', description: 'Cultural capital of Black America — the Harlem Renaissance', era: '1920s – present' },
    { name: 'Aksum', x: 0.52, y: 0.44, type: 'ancient', description: 'Ancient Ethiopian empire, home of the Queen of Sheba\'s legacy', era: '100 – 940 CE' },
    { name: 'Kinshasa', x: 0.45, y: 0.62, type: 'trade', description: 'Cultural crossroads of Central Africa and the Congo basin', era: '1881 CE – present' },
    { name: 'Bahia', x: 0.17, y: 0.62, type: 'diaspora', description: 'Preservation point of Yoruba traditions in the Americas', era: '1500 CE – present' },
    { name: 'Accra', x: 0.30, y: 0.50, type: 'trade', description: 'Gateway of West African commerce and Pan-African independence', era: '1600 CE – present' },
    { name: 'Lalibela', x: 0.54, y: 0.42, type: 'ancient', description: 'Rock-hewn churches carved from living stone in the 12th century', era: '1180 CE – present' },
    { name: 'Mars Colony', x: 0.85, y: 0.22, type: 'future', description: 'First off-world settlement of the African diaspora', era: '2150 CE (projected)' },
    { name: 'Proxima Station', x: 0.90, y: 0.38, type: 'future', description: 'Orbital archive preserving every griot\'s voice for interstellar transmission', era: '2400 CE (projected)' },
    { name: 'Nommo\'s Reach', x: 0.93, y: 0.55, type: 'future', description: 'Deep-space listening post named for the amphibian sky-beings of Dogon cosmology', era: '2800 CE (projected)' },
    { name: 'Kilwa Kisiwani', x: 0.48, y: 0.56, type: 'trade', description: 'Swahili coast city-state connecting Africa to India and China', era: '800 – 1500 CE' },
    { name: 'Jamaica', x: 0.13, y: 0.44, type: 'diaspora', description: 'Maroon resistance and the preservation of Ashanti spiritual traditions', era: '1655 CE – present' },
    { name: 'Ifẹ̀', x: 0.31, y: 0.47, type: 'ancient', description: 'Cradle of Yoruba civilization — where the gods descended on a golden chain', era: '500 BCE – present' }
  ];

  const starConnections = [
    [0, 7],
    [1, 10],
    [10, 4],
    [4, 5],
    [4, 16],
    [5, 6],
    [16, 6],
    [3, 9],
    [2, 8],
    [7, 11],
    [1, 15],
    [15, 8],
    [17, 3],
    [6, 12],
    [12, 13],
    [13, 14]
  ];

  const typeColors = {
    ancient: { r: 255, g: 215, b: 0 },
    trade: { r: 45, g: 180, b: 120 },
    diaspora: { r: 204, g: 60, b: 70 },
    future: { r: 0, g: 229, b: 255 }
  };

  let backgroundStars = [];

  function resize() {
    const container = canvas.parentElement;
    width = container.offsetWidth;
    height = 550;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    createBackgroundStars();
  }

  function createBackgroundStars() {
    backgroundStars = [];
    const count = Math.floor((width * height) / 5000);
    for (let i = 0; i < count; i++) {
      backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.4 + 0.1,
        twinkle: Math.random() * 0.015 + 0.003,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    for (const bgStar of backgroundStars) {
      const twinkle = Math.sin(time * bgStar.twinkle + bgStar.offset);
      const alpha = bgStar.alpha * (0.5 + twinkle * 0.5);
      ctx.beginPath();
      ctx.arc(bgStar.x, bgStar.y, bgStar.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 190, 170, ${alpha})`;
      ctx.fill();
    }

    for (const conn of starConnections) {
      const starA = starMapData[conn[0]];
      const starB = starMapData[conn[1]];
      if (!starA || !starB) continue;

      const ax = starA.x * width;
      const ay = starA.y * height;
      const bx = starB.x * width;
      const by = starB.y * height;

      const isHovered = (hoveredStar === conn[0] || hoveredStar === conn[1]);

      ctx.beginPath();
      ctx.moveTo(ax, ay);

      const midX = (ax + bx) / 2;
      const midY = (ay + by) / 2 - 20;
      ctx.quadraticCurveTo(midX, midY, bx, by);

      ctx.strokeStyle = isHovered
        ? 'rgba(201, 168, 54, 0.4)'
        : 'rgba(201, 168, 54, 0.08)';
      ctx.lineWidth = isHovered ? 1.5 : 0.5;
      ctx.stroke();

      if (isHovered) {
        ctx.strokeStyle = 'rgba(201, 168, 54, 0.06)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }

    starMapData.forEach((star, index) => {
      const sx = star.x * width;
      const sy = star.y * height;
      const color = typeColors[star.type];
      const isHovered = hoveredStar === index;
      const baseRadius = isHovered ? 6 : 4;
      const pulse = Math.sin(time * 0.003 + index) * 0.5 + 0.5;

      if (isHovered) {
        const glowRadius = 20 + pulse * 8;
        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRadius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      const glowSize = baseRadius + 6 + pulse * 3;
      const smallGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowSize);
      smallGlow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${isHovered ? 0.2 : 0.06})`);
      smallGlow.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      ctx.beginPath();
      ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = smallGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sx, sy, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${isHovered ? 1 : 0.8})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sx, sy, baseRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${isHovered ? 0.9 : 0.5})`;
      ctx.fill();

      if (isHovered) {
        ctx.font = '600 11px Cinzel, serif';
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
        ctx.textAlign = 'center';
        ctx.fillText(star.name, sx, sy - baseRadius - 10);
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    let closestStar = null;
    let closestDist = 25;

    starMapData.forEach((star, index) => {
      const sx = star.x * width;
      const sy = star.y * height;
      const dist = Math.sqrt((mouseX - sx) ** 2 + (mouseY - sy) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestStar = index;
      }
    });

    hoveredStar = closestStar;

    if (closestStar !== null) {
      const star = starMapData[closestStar];
      tooltipTitle.textContent = star.name;
      tooltipDesc.textContent = star.description;
      tooltipEra.textContent = star.era;
      tooltip.classList.add('visible');

      let tooltipX = mouseX + 20;
      let tooltipY = mouseY - 10;

      if (tooltipX + 240 > width) tooltipX = mouseX - 260;
      if (tooltipY + 120 > height) tooltipY = mouseY - 120;

      tooltip.style.left = tooltipX + 'px';
      tooltip.style.top = tooltipY + 'px';
    } else {
      tooltip.classList.remove('visible');
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredStar = null;
    tooltip.classList.remove('visible');
  });

  resize();
  animFrame = requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
  });
}

function initTimeline() {
  const viewport = document.getElementById('timelineViewport');
  const track = document.getElementById('timelineTrack');
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');
  const prevLabel = document.getElementById('prevEraLabel');
  const nextLabel = document.getElementById('nextEraLabel');
  const indicatorDots = document.querySelectorAll('.era-indicator-dot');
  const eras = document.querySelectorAll('.timeline-era');

  if (!viewport || !track) return;

  const eraNames = [
    'Ancient',
    'Classical',
    'Golden Age',
    'Age of Storm',
    'Liberation',
    'Reconnection',
    'Age of Return',
    'Ancestral Cloud',
    'Stellar Diaspora'
  ];

  let currentEraIndex = 0;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  function scrollToEra(index) {
    index = Math.max(0, Math.min(index, eras.length - 1));
    currentEraIndex = index;

    const era = eras[index];
    if (!era) return;

    const eraLeft = era.offsetLeft;
    const viewportWidth = viewport.offsetWidth;
    const eraWidth = era.offsetWidth;
    const scrollTarget = eraLeft - (viewportWidth / 2) + (eraWidth / 2);

    viewport.scrollTo({
      left: Math.max(0, scrollTarget),
      behavior: 'smooth'
    });

    updateIndicators();
    updateLabels();
  }

  function updateIndicators() {
    indicatorDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentEraIndex);
    });
  }

  function updateLabels() {
    if (prevLabel && currentEraIndex > 0) {
      prevLabel.textContent = eraNames[currentEraIndex - 1];
    } else if (prevLabel) {
      prevLabel.textContent = 'Start';
    }

    if (nextLabel && currentEraIndex < eraNames.length - 1) {
      nextLabel.textContent = eraNames[currentEraIndex + 1];
    } else if (nextLabel) {
      nextLabel.textContent = 'End';
    }
  }

  function detectCurrentEra() {
    const scrollLeft = viewport.scrollLeft;
    const viewportCenter = scrollLeft + viewport.offsetWidth / 2;

    let closestIndex = 0;
    let closestDist = Infinity;

    eras.forEach((era, i) => {
      const eraCenter = era.offsetLeft + era.offsetWidth / 2;
      const dist = Math.abs(viewportCenter - eraCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    if (closestIndex !== currentEraIndex) {
      currentEraIndex = closestIndex;
      updateIndicators();
      updateLabels();
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToEra(currentEraIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToEra(currentEraIndex + 1);
    });
  }

  indicatorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const era = dot.dataset.era;
      const eraIndex = Array.from(eras).findIndex(e => e.dataset.era === era);
      if (eraIndex >= 0) scrollToEra(eraIndex);
    });
  });

  viewport.addEventListener('scroll', () => {
    requestAnimationFrame(detectCurrentEra);
  });

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = viewport.scrollLeft;
    viewport.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    viewport.scrollLeft = scrollStart - dx;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.style.cursor = 'crosshair';
  });

  viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
    scrollStart = viewport.scrollLeft;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].pageX - startX;
    viewport.scrollLeft = scrollStart - dx;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    isDragging = false;
  });

  updateIndicators();
  updateLabels();
}

function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.section-header, .origin-card, .griot-card, .artifact-viewer, .star-map-container, .timeline-viewport'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealTargets.forEach(el => observer.observe(el));

  const originCards = document.querySelectorAll('.origin-card');
  originCards.forEach((card, i) => {
    card.dataset.revealDelay = i * 150;
  });

  const griotCards = document.querySelectorAll('.griot-card');
  griotCards.forEach((card, i) => {
    card.dataset.revealDelay = i * 200;
  });
}

function initParallax() {
  const hero = document.getElementById('hero');
  const heroContent = document.querySelector('.hero-content');
  const heroScrollIndicator = document.querySelector('.hero-scroll-indicator');

  if (!hero || !heroContent) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - progress * 1.2;

      if (heroScrollIndicator) {
        heroScrollIndicator.style.opacity = 1 - progress * 3;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  const textileOverlays = document.querySelectorAll('.textile-overlay');

  function updateTextileShift() {
    const scrollY = window.scrollY;

    textileOverlays.forEach(overlay => {
      const section = overlay.parentElement;
      const rect = section.getBoundingClientRect();
      const sectionProgress = -rect.top / rect.height;

      if (sectionProgress >= -0.5 && sectionProgress <= 1.5) {
        overlay.style.transform = `translateY(${sectionProgress * 15}px)`;
      }
    });

    requestAnimationFrame(updateTextileShift);
  }

  updateTextileShift();
}