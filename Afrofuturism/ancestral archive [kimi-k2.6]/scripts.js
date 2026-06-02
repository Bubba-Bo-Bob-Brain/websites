const state = {
  currentSection: 'hero',
  griotPlaying: false,
  griotIndex: 0,
  artifactRotation: 0,
  artifactAutoRotate: true,
  timelineProgress: 0,
  timelineAutoplay: false,
  activeRecording: null,
  starMapHovered: null,
  modalOpen: false
};

const griotStories = [
  "In the beginning, before the beginning, there was only the great water. Then Amma, the primordial god, took clay and formed the earth. But the earth was incomplete, for it had no voice...",
  "The Dogon say that the Nommo came from Sirius, riding a wave of fire across the void. They brought water, they brought speech, they brought the pattern of all things that live...",
  "Listen, child. The ancestors do not die. They become the breath in the drum, the spark in the fire, the silence between the stars. When you speak their names, you call them home...",
  "Sankofa — it is not taboo to fetch what is at risk of being left behind. Return, and return again, until every story finds its listener..."
];

const artifacts = {
  stool: {
    name: 'Golden Stool of Asante',
    origin: 'Ashanti Empire, 1700 CE',
    description: 'Forged from the sky by Okomfo Anokye, this stool holds the soul of the Asante nation. None may sit upon it — it is the throne of the people\'s spirit itself.',
    material: 'Pure Gold',
    dimensions: '46 × 61 cm',
    status: 'Preserved'
  },
  mask: {
    name: 'Dogon Kanaga Mask',
    origin: 'Bandiagara Escarpment, 15th Century',
    description: 'The Kanaga represents the cosmic cross of the Dogon universe — the arms of the creator reaching between earth and sky, life and death, the visible and the hidden.',
    material: 'Wood, Pigment, Fiber',
    dimensions: '120 × 80 cm',
    status: 'Preserved'
  },
  head: {
    name: 'Ife Bronze Head',
    origin: 'Ile-Ife, 12th-14th Century',
    description: 'So naturalistic it was once claimed to be too advanced for African hands. Now we know: Ife masters understood the human soul in bronze before Europe knew bronze at all.',
    material: 'Brass, Zinc',
    dimensions: '35 cm height',
    status: 'Preserved'
  },
  pillow: {
    name: 'Akan Gold Dust Pillow',
    origin: 'Gold Coast, 18th Century',
    description: 'A chief\'s headrest, where gold dust — the currency of souls — was measured and stored. To sleep upon gold was to dream in wealth, to wake in responsibility.',
    material: 'Wood, Gold Leaf',
    dimensions: '20 × 45 cm',
    status: 'Fragile'
  },
  staff: {
    name: 'Yoruba Divination Staff',
    origin: 'Oyo Empire, 17th Century',
    description: 'Opa Osun — the staff of the river goddess. When the diviner casts the chain, this staff listens. It has heard ten thousand questions, and remembers every answer.',
    material: 'Iron, Copper, Cowrie',
    dimensions: '90 cm length',
    status: 'Active'
  }
};

const storyDetails = {
  dogon: {
    title: 'Sirius & the Nommo',
    content: `
      <h2>The Star Knowledge of the Dogon</h2>
      <p>In 1931, French anthropologist Marcel Griaule recorded something extraordinary in the cliffs of Bandiagara: a people who knew of Sirius B, a white dwarf invisible to the naked eye, who knew of its 50-year elliptical orbit, who knew it was made of something heavier than iron.</p>
      <p>They called it Po Tolo — the star of the Digitaria seed. And they said the Nommo, ancestral spirits of water and wisdom, came from there.</p>
      <p>How did they know? The Dogon say: we have always known. The knowledge was given, not discovered. It was taught by beings who descended in a noisy whirlwind, who had fish-like bodies and needed water to breathe, who brought the arts of civilization to a young humanity.</p>
      <p>Whether myth or memory, the Dogon star knowledge challenges our assumptions about what traditional societies can know. Their cosmology describes not just Sirius B, but a third star in the system — Sirius C — which astronomers only began to suspect in the 1990s.</p>
      <p>The Nommo are returning, the elders say. Not in ships, but in dreams. In the water that falls from the sky. In the children born with eyes that see in both directions.</p>
    `
  },
  yoruba: {
    title: 'The Cosmic Egg',
    content: `
      <h2>Oduduwa and the Chain from Heaven</h2>
      <p>Before there was land, there was only water and marsh. Olokun, the owner of the waters, ruled a world without earth, without firmament, without place for humans to stand.</p>
      <p>Then Oduduwa, the first king, the first ancestor, asked for a chain from heaven. He climbed down from the sky realm of Orun, carrying a snail shell filled with sand, a hen, and a black cat.</p>
      <p>He poured the sand upon the waters. The hen scratched it, spreading it in all directions, creating the hills and valleys of what would become Ile-Ife, the cradle of the world.</p>
      <p>The cat? The cat watched. The cat remembers. And on certain nights, when the moon is right, the cat still speaks in the language of the first creation, telling any who listen how it was done.</p>
      <p>From Oduduwa came the sixteen royal children who would found the Yoruba city-states. From them came the orishas, the ancestors, the divine forces that still shape the world. The chain still hangs in the sky — we call it the Milky Way. The shell still rests in Ile-Ife, though only the Ooni may approach it.</p>
    `
  },
  khoisan: {
    title: 'The Dancing Stars',
    content: `
      <h2>When the Sky Was Close Enough to Touch</h2>
      <p>The San people of the Kalahari tell of a time when there was no Moon. The sky was closer then, and the Milky Way was a great campfire around which the First People danced.</p>
      <p>But a young girl, lonely and proud, wanted to keep the fire for herself. She grabbed a burning ember and ran. The ember grew cold in her hands, becoming the Moon — dimmer than the fire it came from, but persistent, cycling through death and rebirth.</p>
      <p>The stars themselves were people once. The Morning Star was a great hunter, the Evening Star his wife. Orion was a man who hunted eland across the sky, and the three stars of his belt are the arrows he never fired.</p>
      <p>When a San shaman enters trance, they climb the thread of the sky, becoming the stars themselves, hunting with Orion, dancing with the First People. The rock art of the Drakensberg shows these sky-journeys — figures with bleeding noses, feet that leave the ground, bodies that become therianthropes, half-human, half-beast.</p>
      <p>The stars are still dancing. On clear desert nights, if you listen carefully, you can hear the rhythm. It is the same rhythm the San have played for forty thousand years. It is the heartbeat of the galaxy, slowed down to human scale.</p>
    `
  }
};

function init() {
  initCosmicDust();
  initCustomCursor();
  initNavigation();
  initHeroAnimations();
  initGriot();
  initArtifactViewer();
  initVoiceWave();
  initStarMap();
  initTimeline();
  initScrollObserver();
  initModal();
}

function initCosmicDust() {
  const container = document.getElementById('cosmicDust');
  const particleCount = 80;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > 0.7 ? '#c9a84c' : '#f5e6d3'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: dustFloat ${Math.random() * 20 + 10}s linear infinite;
      animation-delay: ${Math.random() * -20}s;
    `;
    container.appendChild(particle);
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dustFloat {
      0% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 50 - 25}px); }
      50% { transform: translateY(-${Math.random() * 200 + 100}px) translateX(${Math.random() * 100 - 50}px); }
      75% { transform: translateY(-${Math.random() * 300 + 150}px) translateX(${Math.random() * 50 - 25}px); }
      100% { transform: translateY(-${Math.random() * 400 + 200}px) translateX(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  document.querySelectorAll('button, a, .origin-card, .voice-card, .story-node, .era, .thumb').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  
  document.addEventListener('mousedown', () => cursor.classList.add('active'));
  document.addEventListener('mouseup', () => cursor.classList.remove('active'));
}

function initNavigation() {
  const nav = document.querySelector('.adinkra-nav');
  const progressFill = document.getElementById('progressFill');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;
    progressFill.style.width = progress + '%';
    
    if (scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('href');
      scrollToSection(target.slice(1));
    });
  });
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function initHeroAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
  
  const sphereParticles = document.getElementById('sphereParticles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    const angle = (i / 30) * Math.PI * 2;
    const radius = 140 + Math.random() * 60;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: #c9a84c;
      border-radius: 50%;
      left: calc(50% + ${x}px);
      top: calc(50% + ${y}px);
      opacity: ${Math.random() * 0.6 + 0.2};
      animation: orbit ${Math.random() * 10 + 10}s linear infinite;
    `;
    sphereParticles.appendChild(particle);
  }
  
  const orbitStyle = document.createElement('style');
  orbitStyle.textContent = `
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(${Math.random() * 20}px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(${Math.random() * 20}px) rotate(-360deg); }
    }
  `;
  document.head.appendChild(orbitStyle);
}

function animateCounter(element, target) {
  const duration = 2000;
  const start = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function initGriot() {
  const textEl = document.getElementById('griotText');
  const playBtn = document.getElementById('griotPlay');
  const prevBtn = document.getElementById('griotPrev');
  const nextBtn = document.getElementById('griotNext');
  
  let currentChar = 0;
  let typingInterval = null;
  
  function typeStory() {
    const story = griotStories[state.griotIndex];
    textEl.textContent = '';
    currentChar = 0;
    
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
      if (currentChar < story.length) {
        textEl.textContent += story[currentChar];
        currentChar++;
      } else {
        clearInterval(typingInterval);
        state.griotPlaying = false;
        playBtn.innerHTML = '&#xE108;';
      }
    }, 40);
  }
  
  playBtn.addEventListener('click', () => {
    if (state.griotPlaying) {
      clearInterval(typingInterval);
      state.griotPlaying = false;
      playBtn.innerHTML = '&#xE108;';
    } else {
      state.griotPlaying = true;
      playBtn.innerHTML = '&#xE111;';
      if (currentChar >= griotStories[state.griotIndex].length) {
        typeStory();
      } else {
        typingInterval = setInterval(() => {
          const story = griotStories[state.griotIndex];
          if (currentChar < story.length) {
            textEl.textContent += story[currentChar];
            currentChar++;
          } else {
            clearInterval(typingInterval);
            state.griotPlaying = false;
            playBtn.innerHTML = '&#xE108;';
          }
        }, 40);
      }
    }
  });
  
  prevBtn.addEventListener('click', () => {
    state.griotIndex = (state.griotIndex - 1 + griotStories.length) % griotStories.length;
    currentChar = 0;
    typeStory();
  });
  
  nextBtn.addEventListener('click', () => {
    state.griotIndex = (state.griotIndex + 1) % griotStories.length;
    currentChar = 0;
    typeStory();
  });
  
  typeStory();
}

function initArtifactViewer() {
  const holoMesh = document.getElementById('holoMesh');
  const rotateLeft = document.getElementById('rotateLeft');
  const rotateRight = document.getElementById('rotateRight');
  const rotateProgress = document.getElementById('rotateProgress');
  const viewerZoom = document.getElementById('viewerZoom');
  const thumbnails = document.querySelectorAll('.thumb');
  
  for (let i = 0; i < 12; i++) {
    const ring = document.createElement('div');
    const size = 60 + i * 20;
    ring.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      border: 1px solid rgba(201, 168, 76, ${0.3 - i * 0.02});
      border-radius: 50%;
      transform: translate(-50%, -50%) rotateX(60deg) rotateZ(${i * 30}deg);
      animation: artifactRing ${8 + i * 2}s linear infinite;
    `;
    holoMesh.appendChild(ring);
  }
  
  const artifactStyle = document.createElement('style');
  artifactStyle.textContent = `
    @keyframes artifactRing {
      from { transform: translate(-50%, -50%) rotateX(60deg) rotateZ(0deg); }
      to { transform: translate(-50%, -50%) rotateX(60deg) rotateZ(360deg); }
    }
  `;
  document.head.appendChild(artifactStyle);
  
  function updateRotation() {
    holoMesh.style.animation = 'none';
    holoMesh.style.transform = `rotateY(${state.artifactRotation}deg)`;
    const progress = ((state.artifactRotation % 360) + 360) % 360;
    rotateProgress.style.width = (progress / 360 * 100) + '%';
  }
  
  rotateLeft.addEventListener('click', () => {
    state.artifactAutoRotate = false;
    state.artifactRotation -= 30;
    updateRotation();
  });
  
  rotateRight.addEventListener('click', () => {
    state.artifactAutoRotate = false;
    state.artifactRotation += 30;
    updateRotation();
  });
  
  let zoomed = false;
  viewerZoom.addEventListener('click', () => {
    zoomed = !zoomed;
    const scale = zoomed ? 1.5 : 1;
    document.getElementById('artifactHologram').style.transform = `scale(${scale})`;
  });
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      
      const artifactKey = thumb.dataset.artifact;
      const data = artifacts[artifactKey];
      
      document.getElementById('artifactName').textContent = data.name;
      document.getElementById('artifactOrigin').textContent = data.origin;
      document.getElementById('artifactDescription').textContent = data.description;
      document.getElementById('artifactMaterial').textContent = data.material;
      document.getElementById('artifactDimensions').textContent = data.dimensions;
      
      const statusEl = document.getElementById('artifactStatus') || document.querySelector('.status-preserved');
      if (statusEl) {
        statusEl.textContent = data.status;
        statusEl.className = 'meta-value status-' + data.status.toLowerCase();
      }
      
      holoMesh.style.animation = 'artifactSpin 0.5s ease';
      setTimeout(() => {
        holoMesh.style.animation = '';
      }, 500);
    });
  });
}

function initVoiceWave() {
  const canvas = document.getElementById('voiceWave');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const bars = 100;
  let time = 0;
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / bars;
    
    for (let i = 0; i < bars; i++) {
      const x = i * barWidth;
      const frequency = 0.02 + (i / bars) * 0.03;
      const amplitude = state.activeRecording ? 80 : 20;
      const noise = Math.sin(time * 2 + i * frequency) * amplitude;
      const noise2 = Math.cos(time * 1.5 + i * 0.05) * amplitude * 0.5;
      const height = Math.abs(noise + noise2) + 5;
      
      const gradient = ctx.createLinearGradient(0, canvas.height / 2 - height, 0, canvas.height / 2 + height);
      gradient.addColorStop(0, 'rgba(201, 168, 76, 0)');
      gradient.addColorStop(0.5, `rgba(201, 168, 76, ${0.3 + (state.activeRecording ? 0.4 : 0)})`);
      gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height / 2 - height / 2, barWidth - 1, height);
    }
    
    time += 0.05;
    requestAnimationFrame(draw);
  }
  
  draw();
  
  document.querySelectorAll('.voice-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.voice-card');
      const isPlaying = btn.classList.contains('playing');
      
      document.querySelectorAll('.voice-play').forEach(b => {
        b.classList.remove('playing');
        b.innerHTML = '&#xE108;';
      });
      
      if (!isPlaying) {
        btn.classList.add('playing');
        btn.innerHTML = '&#xE111;';
        state.activeRecording = card.dataset.recording;
      } else {
        state.activeRecording = null;
      }
    });
  });
}

function initStarMap() {
  const canvas = document.getElementById('starMap');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const stars = [];
  const connections = [];
  const regions = [
    { name: 'West Africa', x: 0.35, y: 0.45, color: '#c9a84c', radius: 6 },
    { name: 'Nile Valley', x: 0.55, y: 0.35, color: '#c9a84c', radius: 5 },
    { name: 'Great Zimbabwe', x: 0.58, y: 0.65, color: '#c9a84c', radius: 4 },
    { name: 'The Americas', x: 0.2, y: 0.4, color: '#b87333', radius: 5 },
    { name: 'Orbital Habitats', x: 0.7, y: 0.2, color: '#2e1a47', radius: 4 }
  ];
  
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      brightness: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.01
    });
  }
  
  regions.forEach((region, i) => {
    regions.forEach((other, j) => {
      if (i < j) {
        const distance = Math.sqrt(
          Math.pow(region.x - other.x, 2) + 
          Math.pow(region.y - other.y, 2)
        );
        if (distance < 0.5) {
          connections.push({ from: i, to: j, opacity: 1 - distance });
        }
      }
    });
  });
  
  let mouseX = 0, mouseY = 0;
  let hoveredRegion = null;
  
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
    
    hoveredRegion = null;
    regions.forEach((region, i) => {
      const distance = Math.sqrt(
        Math.pow(mouseX - region.x, 2) + 
        Math.pow(mouseY - region.y, 2)
      );
      if (distance < 0.05) {
        hoveredRegion = i;
      }
    });
    
    const mapInfo = document.getElementById('mapInfo');
    if (hoveredRegion !== null) {
      const region = regions[hoveredRegion];
      mapInfo.querySelector('.map-location').textContent = region.name;
      const details = [
        'Ancient homeland of the Bantu expansion',
        'Cradle of Nile Valley civilizations',
        'Medieval trading empire and stone architecture',
        'Destination of the Middle Passage and maroon societies',
        'Projected orbital settlements, 2084 onwards'
      ];
      mapInfo.querySelector('.map-details').textContent = details[hoveredRegion];
    } else {
      mapInfo.querySelector('.map-location').textContent = 'Select a Star';
      mapInfo.querySelector('.map-details').textContent = 'Hover over nodes to explore journeys';
    }
  });
  
  function draw() {
    ctx.fillStyle = '#0a0608';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.brightness += star.twinkleSpeed;
      const opacity = (Math.sin(star.brightness) + 1) / 2 * 0.8 + 0.2;
      
      ctx.beginPath();
      ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 230, 211, ${opacity * 0.6})`;
      ctx.fill();
    });
    
    connections.forEach(conn => {
      const from = regions[conn.from];
      const to = regions[conn.to];
      
      ctx.beginPath();
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
      
      const midX = (from.x + to.x) / 2 + (Math.sin(Date.now() * 0.001) * 0.05);
      const midY = (from.y + to.y) / 2;
      
      ctx.quadraticCurveTo(
        midX * canvas.width, midY * canvas.height,
        to.x * canvas.width, to.y * canvas.height
      );
      
      const gradient = ctx.createLinearGradient(
        from.x * canvas.width, from.y * canvas.height,
        to.x * canvas.width, to.y * canvas.height
      );
      gradient.addColorStop(0, `rgba(201, 168, 76, ${conn.opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(184, 115, 51, ${conn.opacity * 0.3})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    regions.forEach((region, i) => {
      const x = region.x * canvas.width;
      const y = region.y * canvas.height;
      const isHovered = i === hoveredRegion;
      
      ctx.beginPath();
      ctx.arc(x, y, region.radius * (isHovered ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fillStyle = region.color;
      ctx.fill();
      
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(x, y, region.radius * 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201, 168, 76, 0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const pulse = (Math.sin(Date.now() * 0.005) + 1) / 2;
        ctx.beginPath();
        ctx.arc(x, y, region.radius * 4 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201, 168, 76, ${0.2 * (1 - pulse)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
  
  document.querySelectorAll('.story-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      const region = node.dataset.region;
      const regionMap = {
        'west-africa': 0, 'nile-valley': 1, 'great-zimbabwe': 2,
        'new-world': 3, 'afro-future': 4
      };
      hoveredRegion = regionMap[region];
    });
    node.addEventListener('mouseleave', () => {
      hoveredRegion = null;
    });
  });
}

function initTimeline() {
  const eras = document.querySelectorAll('.era');
  const fill = document.getElementById('timelineFill');
  const scrubber = document.getElementById('timelineScrubber');
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');
  const autoplayBtn = document.getElementById('timelineAutoplay');
  
  let currentEra = 0;
  let autoplayInterval = null;
  
  function setEra(index) {
    currentEra = Math.max(0, Math.min(index, eras.length - 1));
    eras.forEach((era, i) => {
      era.classList.toggle('active', i === currentEra);
    });
    const progress = (currentEra / (eras.length - 1)) * 100;
    fill.style.width = progress + '%';
    scrubber.value = progress;
  }
  
  prevBtn.addEventListener('click', () => setEra(currentEra - 1));
  nextBtn.addEventListener('click', () => setEra(currentEra + 1));
  
  scrubber.addEventListener('input', () => {
    const progress = parseFloat(scrubber.value);
    const eraIndex = Math.round((progress / 100) * (eras.length - 1));
    setEra(eraIndex);
  });
  
  autoplayBtn.addEventListener('click', () => {
    state.timelineAutoplay = !state.timelineAutoplay;
    autoplayBtn.style.background = state.timelineAutoplay ? 'var(--color-gold)' : 'transparent';
    autoplayBtn.style.color = state.timelineAutoplay ? 'var(--color-void)' : 'var(--color-gold)';
    
    if (state.timelineAutoplay) {
      autoplayInterval = setInterval(() => {
        if (currentEra >= eras.length - 1) {
          setEra(0);
        } else {
          setEra(currentEra + 1);
        }
      }, 3000);
    } else {
      clearInterval(autoplayInterval);
    }
  });
  
  eras.forEach((era, i) => {
    era.addEventListener('click', () => setEra(i));
  });
  
  setEra(0);
}

function initScrollObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        state.currentSection = id;
        
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
        
        entry.target.querySelectorAll('.section-header, .origin-card, .voice-card, .era, .story-node').forEach((el, i) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          setTimeout(() => {
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 100);
        });
      }
    });
  }, { threshold: 0.3 });
  
  sections.forEach(section => observer.observe(section));
}

function initModal() {
  const modal = document.getElementById('storyModal');
  const closeBtn = document.getElementById('modalClose');
  const body = document.getElementById('modalBody');
  
  document.querySelectorAll('.card-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const storyKey = btn.dataset.story;
      const story = storyDetails[storyKey];
      
      if (story) {
        body.innerHTML = `
          <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-gold); margin-bottom: 1.5rem;">${story.title}</h2>
          <div style="color: var(--color-cream); line-height: 1.9; font-size: 1.05rem;">
            ${story.content}
          </div>
        `;
        modal.classList.add('open');
        state.modalOpen = true;
      }
    });
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    state.modalOpen = false;
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      state.modalOpen = false;
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.modalOpen) {
      modal.classList.remove('open');
      state.modalOpen = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);