(function() {
  const CONFIG = {
    particleCount: 60,
    tiltMaxAngle: 6
  };

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .ash-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.5;
    }
    .filter-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      position: relative;
      z-index: 10;
    }
    .filter-label {
      font-family: 'MedievalSharp', cursive;
      color: #c9a227;
      font-size: 1.2rem;
      margin-right: 0.5rem;
    }
    .filter-btn {
      font-family: 'VT323', monospace;
      background: transparent;
      border: 2px solid #4a3528;
      color: #a89a7c;
      padding: 0.25rem 1rem;
      cursor: pointer;
      transition: all 150ms ease;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .filter-btn:hover {
      border-color: #c9a227;
      color: #c9a227;
      background: rgba(201, 162, 39, 0.1);
    }
    .filter-btn.active {
      background: #6b1010;
      border-color: #8b1a1a;
      color: #d4c5a3;
    }
    .sound-toggle {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: 2px solid #4a3528;
      color: #a89a7c;
      width: 40px;
      height: 40px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms ease;
      z-index: 100;
    }
    .sound-toggle:hover {
      border-color: #c9a227;
      color: #c9a227;
      background: rgba(201, 162, 39, 0.1);
    }
    .character-card.selected {
      border-color: #c9a227 !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), 0 0 30px rgba(201, 162, 39, 0.4) !important;
    }
    .character-card.selected .portrait-frame {
      border-color: #c9a227 !important;
      box-shadow: 0 0 20px rgba(201, 162, 39, 0.3) !important;
    }
    @keyframes plaguePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.15); }
    }
    .property[title="Plague Resistance"] {
      animation: plaguePulse 3s infinite ease-in-out;
      display: inline-block;
    }
    .survivor-score {
      font-family: 'VT323', monospace;
      text-align: center;
      color: #c9a227;
      font-size: 1.1rem;
      margin-top: 0.5rem;
      padding: 0.25rem;
      border: 1px solid #4a3528;
      background: rgba(0,0,0,0.3);
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);

  class AshSystem {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'ash-canvas';
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticle() {
      return {
        x: Math.random() * this.canvas.width,
        y: -10,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 1.2 + 0.3,
        speedX: Math.random() * 0.8 - 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1
      };
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.particles.length < CONFIG.particleCount && Math.random() > 0.9) {
        this.particles.push(this.createParticle());
      }
      this.ctx.fillStyle = '#a89a7c';
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
        p.rotation += p.rotationSpeed;
        if (p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      }
      requestAnimationFrame(() => this.animate());
    }
  }

  class SkillAnimator {
    constructor() {
      this.skillFills = document.querySelectorAll('.skill-fill');
      this.init();
    }

    init() {
      this.skillFills.forEach(bar => {
        const target = bar.style.width;
        bar.dataset.target = target;
        bar.style.width = '0%';
      });
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            setTimeout(() => {
              bar.style.width = bar.dataset.target;
            }, 150);
            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.3 });
      this.skillFills.forEach(bar => observer.observe(bar));
    }
  }

  class TiltEffect {
    constructor() {
      this.cards = document.querySelectorAll('.character-card');
      if (window.matchMedia('(hover: hover)').matches) {
        this.init();
      }
    }

    init() {
      this.cards.forEach(card => {
        card.addEventListener('mousemove', (e) => this.handleMove(e, card));
        card.addEventListener('mouseleave', () => this.handleLeave(card));
      });
    }

    handleMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -CONFIG.tiltMaxAngle;
      const rotateY = ((x - centerX) / centerX) * CONFIG.tiltMaxAngle;
      card.style.setProperty('--rotateX', `${rotateX}deg`);
      card.style.setProperty('--rotateY', `${rotateY}deg`);
    }

    handleLeave(card) {
      card.style.setProperty('--rotateX', '0deg');
      card.style.setProperty('--rotateY', '0deg');
    }
  }

  class CharacterFilter {
    constructor() {
      this.grid = document.querySelector('.character-grid');
      this.cards = Array.from(document.querySelectorAll('.character-card'));
      this.classes = ['Clergy', 'Commoner', 'Nobility', 'Outcast'];
      this.init();
    }

    init() {
      this.createFilterBar();
      this.setupFilters();
    }

    createFilterBar() {
      this.filterBar = document.createElement('div');
      this.filterBar.className = 'filter-bar';
      const label = document.createElement('span');
      label.className = 'filter-label';
      label.textContent = 'Filter by Class:';
      this.filterBar.appendChild(label);
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn active';
      allBtn.textContent = 'All';
      allBtn.dataset.filter = 'all';
      this.filterBar.appendChild(allBtn);
      this.classes.forEach(cls => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = cls;
        btn.dataset.filter = cls;
        this.filterBar.appendChild(btn);
      });
      this.grid.before(this.filterBar);
    }

    setupFilters() {
      this.filterBar.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
          this.filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          const filter = e.target.dataset.filter;
          this.applyFilter(filter);
        }
      });
    }

    applyFilter(filter) {
      this.cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          const classProp = card.querySelector('.property[title="Social Class"]');
          const cardClass = classProp ? classProp.textContent.trim() : '';
          card.style.display = cardClass === filter ? '' : 'none';
        }
      });
    }
  }

  class AmbientSound {
    constructor() {
      this.ctx = null;
      this.playing = false;
      this.oscillators = [];
      this.init();
    }

    init() {
      this.toggleBtn = document.createElement('button');
      this.toggleBtn.className = 'sound-toggle';
      this.toggleBtn.innerHTML = '🔇';
      this.toggleBtn.setAttribute('aria-label', 'Toggle ambient sound');
      this.toggleBtn.addEventListener('click', () => this.toggle());
      document.querySelector('.site-header').appendChild(this.toggleBtn);
    }

    toggle() {
      if (this.playing) {
        this.stop();
        this.toggleBtn.innerHTML = '🔇';
      } else {
        this.play();
        this.toggleBtn.innerHTML = '🔊';
      }
    }

    play() {
      if (this.playing) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [55, 110, 165];
      frequencies.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.2, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(2, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        this.oscillators.push({ osc, gain, lfo });
      });
      this.playing = true;
    }

    stop() {
      if (!this.playing || !this.ctx) return;
      this.oscillators.forEach(({ osc, gain, lfo }) => {
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);
        setTimeout(() => {
          osc.stop();
          lfo.stop();
        }, 1000);
      });
      this.oscillators = [];
      this.ctx.close();
      this.ctx = null;
      this.playing = false;
    }
  }

  class CharacterSelector {
    constructor() {
      this.cards = document.querySelectorAll('.character-card');
      this.selectedCard = null;
      this.init();
    }

    init() {
      this.cards.forEach(card => {
        card.addEventListener('click', () => this.select(card));
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.select(card);
          }
        });
      });
    }

    select(card) {
      if (this.selectedCard === card) {
        card.classList.remove('selected');
        this.selectedCard = null;
        const existing = card.querySelector('.survivor-score');
        if (existing) existing.remove();
      } else {
        if (this.selectedCard) {
          this.selectedCard.classList.remove('selected');
          const existing = this.selectedCard.querySelector('.survivor-score');
          if (existing) existing.remove();
        }
        card.classList.add('selected');
        this.selectedCard = card;
        this.showSurvivorScore(card);
      }
    }

    showSurvivorScore(card) {
      const skills = card.querySelectorAll('.skill-fill');
      let total = 0;
      skills.forEach(skill => {
        const width = parseInt(skill.dataset.target || skill.style.width);
        total += width;
      });
      const average = Math.round(total / skills.length);
      const existing = card.querySelector('.survivor-score');
      if (existing) existing.remove();
      const scoreEl = document.createElement('div');
      scoreEl.className = 'survivor-score';
      scoreEl.textContent = `Survival Score: ${average}%`;
      card.querySelector('.card-content').appendChild(scoreEl);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new AshSystem();
    new SkillAnimator();
    new TiltEffect();
    new CharacterFilter();
    new AmbientSound();
    new CharacterSelector();
  });

})();