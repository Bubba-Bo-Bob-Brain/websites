// Initialize DOM elements
const lanternGlow = document.getElementById('lanternGlow');
const canvas = document.getElementById('bazaarCanvas');
const ctx = canvas.getContext('2d');
const magicLamps = document.querySelectorAll('.magic-lamp');
const productCards = document.querySelectorAll('.product-card');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section, header, footer');
const acquireButtons = document.querySelectorAll('.acquire-btn');
const heroStars = document.getElementById('heroStars');

// State variables
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;
let particles = [];
const particleSpawnRate = 3;

// Resize canvas to fit window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Linear interpolation for smooth movement
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Lantern glow follow cursor
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateLanternGlow() {
  glowX = lerp(glowX, mouseX, 0.08);
  glowY = lerp(glowY, mouseY, 0.08);
  lanternGlow.style.left = `${glowX}px`;
  lanternGlow.style.top = `${glowY}px`;
  requestAnimationFrame(updateLanternGlow);
}
updateLanternGlow();

// Particle system for incense smoke and embers
class Particle {
  constructor(x, y, isBurst = false) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? canvas.height + 10;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = isBurst ? (Math.random() - 0.5) * 4 - 2 : -(Math.random() * 1 + 0.3);
    this.opacity = Math.random() * 0.5 + 0.2;
    this.life = 1;
    this.decay = Math.random() * 0.005 + 0.002;
    this.color = Math.random() > 0.7 
      ? `rgba(255, 204, 102, ${this.opacity})` 
      : Math.random() > 0.5 
        ? `rgba(255, 255, 255, ${this.opacity * 0.7})` 
        : `rgba(201, 162, 39, ${this.opacity * 0.8})`;
    this.isBurst = isBurst;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.opacity = this.life * 0.5;
    this.size *= 0.999;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function spawnParticles() {
  for (let i = 0; i < particleSpawnRate; i++) {
    particles.push(new Particle());
  }
}

function updateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  spawnParticles();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    
    if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(updateParticles);
}
updateParticles();

// Magic lamp reveal interaction
function revealProduct(lamp) {
  const targetId = lamp.dataset.target;
  const targetCard = document.querySelector(`.product-card[data-product="${targetId}"]`);
  
  if (!targetCard || targetCard.dataset.revealed === 'true') return;

  // Activate lamp animation
  lamp.classList.add('lit');
  targetCard.dataset.revealed = 'true';
  targetCard.classList.add('revealed');

  // Burst of particles from lamp
  const lampRect = lamp.getBoundingClientRect();
  const lampX = lampRect.left + lampRect.width / 2;
  const lampY = lampRect.top + lampRect.height / 2;
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(lampX, lampY, true));
  }
}

// Add event listeners to magic lamps
magicLamps.forEach(lamp => {
  lamp.addEventListener('click', () => revealProduct(lamp));
  lamp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revealProduct(lamp);
    }
  });
});

// Scroll animations with Intersection Observer
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      
      // Update active nav link
      if (entry.target.id) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    }
  });
}, observerOptions);

// Observe sections and product cards
sections.forEach(section => observer.observe(section));
productCards.forEach(card => observer.observe(card));

// Generate hero stars
function generateHeroStars() {
  const starCount = 80;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('hero-star');
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${Math.random() * 2 + 2}s`;
    heroStars.appendChild(star);
  }
}
generateHeroStars();

// Acquire button toast notification
function showToast(message) {
  const existingToast = document.querySelector('.magic-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.classList.add('magic-toast');
  toast.innerHTML = `
    <div class="toast-ornament">✦ ◈ ✦</div>
    <p>${message}</p>
    <div class="toast-ornament">✦ ◈ ✦</div>
  `;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add event listeners to acquire buttons
acquireButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productName = button.dataset.product;
    const productTitles = {
      'flying-carpet': 'The Persian Sky-Rider',
      'bottled-djinn': 'The Bound Efrit of the Eternal Flame',
      'enchanted-lamp': 'The Heirloom of Aladdin\'s Lineage',
      'impossible-spices': 'Saffron Threads of the Djinn\'s Garden',
      'crystal-ball': 'The Oracle of Shifting Sands',
      'magic-feather': 'The Roc\'s Descent Feather'
    };
    showToast(`Your request for ${productTitles[productName]} has been received. A djinn courier will arrive within 3 nights.`);
  });
});

// Smooth scroll for nav links with offset for fixed header
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const offset = 80;
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Subtle parallax effect for hero content
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
  }
});

// Add CSS for dynamic elements (injected via JS to avoid extra CSS file)
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  .hero-star {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: twinkle var(--duration, 3s) ease-in-out infinite;
    opacity: 0;
  }
  .magic-lamp.lit .lamp-flame {
    transform: scale(1.3);
    opacity: 1;
  }
  .magic-lamp.lit .lamp-glow {
    opacity: 1;
    transform: scale(1.2);
  }
  .magic-toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: linear-gradient(135deg, rgba(26, 21, 37, 0.95) 0%, rgba(18, 16, 28, 0.98) 100%);
    border: 1px solid rgba(201, 162, 39, 0.5);
    border-radius: 15px;
    padding: 1.5rem 2rem;
    color: var(--color-ivory);
    font-family: var(--font-display);
    text-align: center;
    z-index: 10000;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(201, 162, 39, 0.3);
    backdrop-filter: blur(10px);
    transition: transform 0.4s ease;
    max-width: 90%;
  }
  .magic-toast.show {
    transform: translateX(-50%) translateY(0);
  }
  .toast-ornament {
    color: var(--color-gold);
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    margin: 0.5rem 0;
  }
  .product-card.in-view {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .court-feature.in-view {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .court-feature:nth-child(1) { animation-delay: 0.1s; }
  .court-feature:nth-child(2) { animation-delay: 0.2s; }
  .court-feature:nth-child(3) { animation-delay: 0.3s; }
`;
document.head.appendChild(dynamicStyles);