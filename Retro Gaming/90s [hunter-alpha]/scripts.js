/* ═══════════════════════════════════════════════════
   PIXEL VAULT — RETRO GAMING SHRINE
   Interactive Engine v1.0
   ═══════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── STATE ───
    const state = {
        soundEnabled: true,
        konamiProgress: [],
        konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        unlockedCheats: new Set(),
        currentCarouselPage: 0,
        bootComplete: false
    };

    // ─── AUDIO ENGINE (Web Audio API) ───
    const AudioEngine = {
        context: null,
        
        init() {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        },

        playTone(frequency, duration, type = 'square', volume = 0.1) {
            if (!state.soundEnabled || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(volume, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        },

        blip() {
            this.playTone(880, 0.05, 'square', 0.08);
        },

        powerUp() {
            const notes = [262, 330, 392, 523];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.15, 'square', 0.1), i * 80);
            });
        },

        unlock() {
            const notes = [523, 659, 784, 1047, 784, 1047];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.2, 'square', 0.12), i * 100);
            });
        },

        error() {
            this.playTone(150, 0.3, 'sawtooth', 0.1);
        },

        type() {
            this.playTone(1200, 0.02, 'square', 0.05);
        },

        konami() {
            const melody = [392, 440, 392, 330, 392, 523, 494, 440];
            melody.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.12, 'square', 0.1), i * 80);
            });
        }
    };

    // ─── BOOT SEQUENCE ───
    const BootSequence = {
        screen: null,
        lines: null,

        init() {
            this.screen = document.getElementById('boot-screen');
            this.lines = this.screen.querySelectorAll('.boot-line');
            this.start();
        },

        start() {
            this.lines.forEach((line, index) => {
                const delay = parseInt(line.dataset.delay) || (index * 500);
                setTimeout(() => {
                    line.classList.add('visible');
                    AudioEngine.playTone(600 + (index * 100), 0.05, 'square', 0.05);
                }, delay);
            });

            // Click to skip or auto-fade
            this.screen.addEventListener('click', () => this.complete());
            setTimeout(() => this.complete(), 4000);
        },

        complete() {
            if (state.bootComplete) return;
            state.bootComplete = true;
            
            this.screen.classList.add('fade-out');
            document.getElementById('site-wrapper').classList.remove('hidden');
            
            setTimeout(() => {
                this.screen.style.display = 'none';
                AudioEngine.powerUp();
                initAfterBoot();
            }, 500);
        }
    };

    // ─── PARTICLE SYSTEM ───
    const ParticleSystem = {
        container: null,
        colors: ['#ff00ff', '#00ffff', '#39ff14', '#ffff00', '#ff6600'],

        init() {
            this.container = document.getElementById('particles');
            this.spawn();
        },

        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const duration = Math.random() * 6 + 6;
            const delay = Math.random() * 4;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            
            this.container.appendChild(particle);
            
            // Remove and recreate
            setTimeout(() => {
                particle.remove();
                this.createParticle();
            }, (duration + delay) * 1000);
        },

        spawn() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => this.createParticle(), i * 200);
            }
        }
    };

    // ─── MASCOT ANIMATION ───
    const Mascot = {
        frames: null,
        currentFrame: 0,

        init() {
            this.frames = document.querySelectorAll('.mascot-frame');
            if (this.frames.length) {
                this.animate();
            }
        },

        animate() {
            setInterval(() => {
                this.frames.forEach(f => f.classList.remove('active'));
                this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                this.frames[this.currentFrame].classList.add('active');
            }, 250);
        }
    };

    // ─── TYPEWRITER EFFECT ───
    const Typewriter = {
        element: null,
        text: '',
        index: 0,

        init() {
            this.element = document.getElementById('hero-subtitle');
            if (!this.element) return;
            
            this.text = this.element.textContent;
            this.element.textContent = '';
            this.element.style.width = 'auto';
            this.type();
        },

        type() {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                AudioEngine.type();
                setTimeout(() => this.type(), 50 + Math.random() * 30);
            } else {
                // Remove cursor after typing complete
                setTimeout(() => {
                    this.element.style.borderRight = 'none';
                }, 2000);
            }
        }
    };

    // ─── VHS TIMESTAMP ───
    const VHSTimestamp = {
        element: null,

        init() {
            this.element = document.getElementById('vhs-time');
            if (this.element) {
                this.update();
                setInterval(() => this.update(), 1000);
            }
        },

        update() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            this.element.textContent = `${hours}:${minutes}:${seconds}`;
        }
    };

    // ─── LEADERBOARD ───
    const Leaderboard = {
        container: null,
        data: [
            { rank: 1, name: 'ACE_KNG', game: 'Street Fighter II', score: 9999999, date: '08/15/94' },
            { rank: 2, name: 'NINJA_X', game: 'Mortal Kombat', score: 8750420, date: '08/14/94' },
            { rank: 3, name: 'PIXEL_QN', game: 'Sonic the Hedgehog', score: 7892100, date: '08/12/94' },
            { rank: 4, name: 'BLAZE_42', game: 'Mega Man X', score: 6543210, date: '08/10/94' },
            { rank: 5, name: 'RETRO_KD', game: 'Donkey Kong Country', score: 5432100, date: '08/09/94' },
            { rank: 6, name: 'CYBER_Z', game: 'Final Fight', score: 4987650, date: '08/08/94' },
            { rank: 7, name: 'TURBO_99', game: 'F-Zero', score: 4321098, date: '08/07/94' },
            { rank: 8, name: 'MEGA_DRV', game: 'Golden Axe', score: 3876543, date: '08/06/94' },
            { rank: 9, name: 'ARCADE_1', game: 'Pac-Man', score: 3210987, date: '08/05/94' },
            { rank: 10, name: 'PLAYER_1', game: 'Galaga', score: 2999999, date: '08/04/94' }
        ],

        init() {
            this.container = document.getElementById('leaderboard-body');
            if (!this.container) return;
            
            this.render();
            this.setupObserver();
        },

        render() {
            this.data.forEach((entry, index) => {
                const row = document.createElement('div');
                row.className = 'leaderboard-row';
                if (index === 0) row.classList.add('top-1');
                if (index === 1) row.classList.add('top-2');
                if (index === 2) row.classList.add('top-3');
                
                row.style.transitionDelay = `${index * 0.1}s`;
                
                row.innerHTML = `
                    <span class="col-rank rank-${entry.rank}">#${entry.rank}</span>
                    <span class="col-name">${entry.name}</span>
                    <span class="col-game">${entry.game}</span>
                    <span class="col-score">${entry.score.toLocaleString()}</span>
                    <span class="col-date">${entry.date}</span>
                `;
                
                this.container.appendChild(row);
            });
        },

        setupObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const rows = this.container.querySelectorAll('.leaderboard-row');
                        rows.forEach((row, i) => {
                            setTimeout(() => row.classList.add('visible'), i * 100);
                        });
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(this.container);
        }
    };

    // ─── GAME COLLECTION ───
    const GameCollection = {
        container: null,
        carouselDots: null,
        data: [
            { 
                icon: '🐉', 
                title: 'MEGA QUEST VI', 
                year: '1993', 
                rarity: 'legendary',
                desc: 'The rarest cartridge in the vault. Only 50 copies ever made.',
                genre: 'RPG',
                players: '1',
                rating: '★★★★★'
            },
            { 
                icon: '👊', 
                title: 'STREET COMBAT', 
                year: '1992', 
                rarity: 'rare',
                desc: 'Underground fighting tournament. Master all 12 fighters.',
                genre: 'Fighting',
                players: '1-2',
                rating: '★★★★☆'
            },
            { 
                icon: '🚀', 
                title: 'STAR BLAZER', 
                year: '1991', 
                rarity: 'uncommon',
                desc: 'Intense space shooter with revolutionary parallax scrolling.',
                genre: 'Shooter',
                players: '1-2',
                rating: '★★★★☆'
            },
            { 
                icon: '🏰', 
                title: 'KNIGHT QUEST', 
                year: '1990', 
                rarity: 'common',
                desc: 'Classic platformer adventure through 8 treacherous worlds.',
                genre: 'Platform',
                players: '1',
                rating: '★★★☆☆'
            },
            { 
                icon: '🏎️', 
                title: 'TURBO RACERS', 
                year: '1994', 
                rarity: 'rare',
                desc: 'High-speed racing with 16 unique tracks and split-screen multiplayer.',
                genre: 'Racing',
                players: '1-4',
                rating: '★★★★★'
            },
            { 
                icon: '👻', 
                title: 'PHANTOM MANOR', 
                year: '1993', 
                rarity: 'uncommon',
                desc: 'Spooky puzzle-platformer with over 100 haunted rooms.',
                genre: 'Puzzle',
                players: '1',
                rating: '★★★★☆'
            },
            { 
                icon: '⚔️', 
                title: 'BLADE WARRIOR', 
                year: '1992', 
                rarity: 'common',
                desc: 'Hack and slash action with RPG elements. A hidden gem.',
                genre: 'Action',
                players: '1',
                rating: '★★★☆☆'
            },
            { 
                icon: '🎯', 
                title: 'PIXEL HUNTER', 
                year: '1994', 
                rarity: 'legendary',
                desc: 'Experimental shooter that pushes hardware limits. Collector\'s item.',
                genre: 'Shooter',
                players: '1-2',
                rating: '★★★★★'
            }
        ],

        init() {
            this.container = document.getElementById('collection-carousel');
            this.carouselDots = document.getElementById('carousel-dots');
            
            if (!this.container) return;
            
            this.render();
            this.setupControls();
        },

        render() {
            this.data.forEach((game, index) => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.animationDelay = `${index * 0.1}s`;
                
                card.innerHTML = `
                    <div class="game-card-inner">
                        <div class="game-card-front">
                            <div class="cartridge-label">
                                <div class="cartridge-icon">${game.icon}</div>
                                <div class="cartridge-title">${game.title}</div>
                            </div>
                            <div class="game-year">${game.year}</div>
                            <div class="game-rarity rarity-${game.rarity}">${game.rarity.toUpperCase()}</div>
                        </div>
                        <div class="game-card-back">
                            <h4>${game.title}</h4>
                            <p>${game.desc}</p>
                            <div class="game-stats">
                                <div class="game-stat">
                                    <span class="game-stat-label">Genre:</span>
                                    <span class="game-stat-value">${game.genre}</span>
                                </div>
                                <div class="game-stat">
                                    <span class="game-stat-label">Players:</span>
                                    <span class="game-stat-value">${game.players}</span>
                                </div>
                                <div class="game-stat">
                                    <span class="game-stat-label">Rating:</span>
                                    <span class="game-stat-value">${game.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                this.container.appendChild(card);
            });
        },

        setupControls() {
            const cards = this.container.querySelectorAll('.game-card');
            
            // Add hover tilt effect
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.querySelector('.game-card-inner').style.transform = 
                        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.querySelector('.game-card-inner').style.transform = '';
                });
            });
        }
    };

    // ─── CHEAT TERMINAL ───
    const CheatTerminal = {
        input: null,
        output: null,
        body: null,
        unlocks: null,

        cheats: {
            'GODMODE': { element: 'unlock-godmode', message: '> GOD MODE ACTIVATED! Invincibility enabled.' },
            'IDDQD': { element: 'unlock-godmode', message: '> IDDQD accepted. Demon mode engaged!' },
            'IDKFA': { element: 'unlock-secret', message: '> IDKFA: All weapons and keys granted!' },
            'JUSTINBAILEY': { element: 'unlock-secret', message: '> JUSTIN BAILEY: Secret suit unlocked!' },
            'IDDQD': { element: 'unlock-godmode', message: '> IDDQD accepted. Demon mode engaged!' },
            'UPUPDOWNDOWN': { element: 'unlock-konami', message: '> Partial code detected... keep going!' },
            'ABACABB': { element: 'unlock-secret', message: '> Blood code accepted. No limits!' },
            'NARPASWORD': { element: 'unlock-godmode', message: '> NARPASWORD: Infinite power!' }
        },

        init() {
            this.input = document.getElementById('terminal-input');
            this.output = document.querySelector('.terminal-output');
            this.body = document.getElementById('terminal-body');
            this.unlocks = document.getElementById('cheat-unlocks');
            
            if (!this.input) return;
            
            this.setupInput();
            this.focusInput();
        },

        setupInput() {
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCode(this.input.value.trim().toUpperCase());
                    this.input.value = '';
                }
                AudioEngine.type();
            });

            // Keep focus on input when clicking terminal
            this.body.addEventListener('click', () => this.focusInput());
        },

        focusInput() {
            this.input.focus();
        },

        processCode(code) {
            if (!code) return;

            // Add input to output
            this.addLine(`C:\\> ${code}`, 'term-line');

            if (this.cheats[code] && !state.unlockedCheats.has(code)) {
                // Valid cheat code
                state.unlockedCheats.add(code);
                this.addLine(this.cheats[code].message, 'term-line');
                this.addLine('> Cheat unlocked! Scroll down to see your reward.', 'term-line dim');
                this.unlockReward(this.cheats[code].element);
                AudioEngine.unlock();
            } else if (state.unlockedCheats.has(code)) {
                this.addLine('> Code already activated!', 'term-line dim');
                AudioEngine.blip();
            } else {
                // Invalid code
                this.addLine('> ERROR: Invalid cheat code. Try again...', 'term-line');
                this.addLine('> Hint: Try classic codes like GODMODE, IDDQD, or IDKFA', 'term-line dim');
                AudioEngine.error();
                this.input.classList.add('shake');
                setTimeout(() => this.input.classList.remove('shake'), 500);
            }

            // Scroll terminal to bottom
            this.body.scrollTop = this.body.scrollHeight;
        },

        addLine(text, className) {
            const line = document.createElement('p');
            line.className = className;
            line.textContent = text;
            this.output.appendChild(line);
        },

        unlockReward(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.remove('hidden');
            }
        }
    };

    // ─── KONAMI CODE DETECTOR ───
    const KonamiCode = {
        progress: null,
        display: null,

        init() {
            this.progress = document.getElementById('konami-progress');
            this.display = document.getElementById('konami-keys');
            
            if (!this.display) return;
            
            this.renderProgress();
            this.setupListener();
        },

        renderProgress() {
            const keys = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];
            this.display.innerHTML = keys.map((key, i) => 
                `<span data-index="${i}">${key}</span>`
            ).join('');
        },

        setupListener() {
            document.addEventListener('keydown', (e) => {
                const key = e.key;
                const expectedKey = state.konamiCode[state.konamiProgress.length];
                
                // Check if key matches (case insensitive for letters)
                if (key.toLowerCase() === expectedKey.toLowerCase() || key === expectedKey) {
                    state.konamiProgress.push(key);
                    
                    // Update visual progress
                    const spans = this.display.querySelectorAll('span');
                    const currentIndex = state.konamiProgress.length - 1;
                    if (spans[currentIndex]) {
                        spans[currentIndex].classList.add('active');
                    }
                    
                    AudioEngine.blip();
                    
                    // Check if code complete
                    if (state.konamiProgress.length === state.konamiCode.length) {
                        this.activate();
                    }
                } else if (key !== 'Shift' && key !== 'Control' && key !== 'Alt') {
                    // Reset on wrong key (ignore modifier keys)
                    state.konamiProgress = [];
                    const spans = this.display.querySelectorAll('span');
                    spans.forEach(s => s.classList.remove('active'));
                }
            });
        },

        activate() {
            AudioEngine.konami();
            
            // Show unlock in terminal
            CheatTerminal.addLine('', 'term-line');
            CheatTerminal.addLine('★★★ KONAMI CODE ACCEPTED! ★★★', 'term-line');
            CheatTerminal.addLine('> +30 Lives granted. You are a true gamer.', 'term-line');
            CheatTerminal.addLine('> Secret vault access: GRANTED', 'term-line dim');
            
            // Show unlock card
            CheatTerminal.unlockReward('unlock-konami');
            
            // Show secret overlay
            setTimeout(() => {
                this.showSecretOverlay();
            }, 1000);
            
            state.unlockedCheats.add('KONAMI');
        },

        showSecretOverlay() {
            const overlay = document.getElementById('secret-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
            }
        }
    };

    // ─── STAT COUNTERS ───
    const StatCounters = {
        cards: null,
        animated: new Set(),

        init() {
            this.cards = document.querySelectorAll('.stat-card');
            if (!this.cards.length) return;
            
            this.setupObserver();
        },

        setupObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animated.add(entry.target);
                        this.animateCard(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            this.cards.forEach(card => observer.observe(card));
        },

        animateCard(card) {
            card.classList.add('animated');
            
            const target = parseInt(card.dataset.target);
            const suffix = card.dataset.suffix || '';
            const counter = card.querySelector('.counter');
            
            if (!counter) return;
            
            const duration = 2000;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target.toLocaleString();
                    AudioEngine.blip();
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    // ─── NAVIGATION ───
    const Navigation = {
        links: null,
        sections: null,

        init() {
            this.links = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section[id]');
            
            if (!this.links.length) return;
            
            this.setupSmoothScroll();
            this.setupActiveTracking();
            this.setupSoundEffects();
        },

        setupSmoothScroll() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupActiveTracking() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveLink(id);
                    }
                });
            }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
            
            this.sections.forEach(section => observer.observe(section));
        },

        setActiveLink(id) {
            this.links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        },

        setupSoundEffects() {
            document.querySelectorAll('[data-sound]').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    const soundType = element.dataset.sound;
                    if (soundType === 'blip') AudioEngine.blip();
                    else if (soundType === 'powerup') AudioEngine.powerUp();
                });
                
                element.addEventListener('click', () => {
                    const soundType = element.dataset.sound;
                    if (soundType === 'powerup') AudioEngine.powerUp();
                });
            });
        }
    };

    // ─── SOUND TOGGLE ───
    const SoundToggle = {
        button: null,
        onIcon: null,
        offIcon: null,

        init() {
            this.button = document.getElementById('sound-toggle');
            this.onIcon = this.button?.querySelector('.sound-on');
            this.offIcon = this.button?.querySelector('.sound-off');
            
            if (!this.button) return;
            
            this.button.addEventListener('click', () => this.toggle());
        },

        toggle() {
            state.soundEnabled = !state.soundEnabled;
            
            if (state.soundEnabled) {
                this.onIcon.classList.remove('hidden');
                this.offIcon.classList.add('hidden');
                AudioEngine.blip();
            } else {
                this.onIcon.classList.add('hidden');
                this.offIcon.classList.remove('hidden');
            }
        }
    };

    // ─── SECRET OVERLAY ───
    const SecretOverlay = {
        init() {
            const closeBtn = document.getElementById('secret-close');
            const overlay = document.getElementById('secret-overlay');
            
            if (closeBtn && overlay) {
                closeBtn.addEventListener('click', () => {
                    overlay.classList.add('hidden');
                    AudioEngine.powerUp();
                });
            }
        }
    };

    // ─── FOOTER EASTER EGG ───
    const FooterEasterEgg = {
        init() {
            const egg = document.getElementById('footer-easter-egg');
            if (!egg) return;
            
            egg.addEventListener('click', () => {
                // Trigger Konami code hint
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), 500);
                
                CheatTerminal.addLine('', 'term-line');
                CheatTerminal.addLine('> Easter egg discovered! Try the Konami Code...', 'term-line dim');
                CheatTerminal.addLine('> ↑↑↓↓←→←→BA', 'term-line');
                
                AudioEngine.blip();
            });
        }
    };

    // ─── VHS TRACKING EFFECT (on scroll) ───
    const VHSTracking = {
        lastScrollY: 0,
        timeout: null,

        init() {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        },

        onScroll() {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - this.lastScrollY);
            
            // Only trigger on fast scrolling
            if (scrollDelta > 50) {
                document.body.classList.add('vhs-glitch');
                
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    document.body.classList.remove('vhs-glitch');
                }, 300);
            }
            
            this.lastScrollY = currentScrollY;
        }
    };

    // ─── RANDOM CRT FLICKER ───
    const CRTFlicker = {
        init() {
            setInterval(() => {
                if (Math.random() > 0.97) {
                    document.body.classList.add('distort');
                    setTimeout(() => document.body.classList.remove('distort'), 150);
                }
            }, 100);
        }
    };

    // ─── HEADER SCROLL EFFECT ───
    const HeaderScroll = {
        header: null,
        lastScrollY: 0,

        init() {
            this.header = document.querySelector('.site-header');
            if (!this.header) return;
            
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        },

        onScroll() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.header.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                this.header.style.background = '';
            }
            
            this.lastScrollY = currentScrollY;
        }
    };

    // ─── INITIALIZE AFTER BOOT ───
    function initAfterBoot() {
        Typewriter.init();
        Mascot.init();
        ParticleSystem.init();
        Leaderboard.init();
        GameCollection.init();
        StatCounters.init();
        VHSTracking.init();
        CRTFlicker.init();
        HeaderScroll.init();
    }

    // ─── DOM READY ───
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize Audio on first interaction
        document.addEventListener('click', () => {
            if (!AudioEngine.context) {
                AudioEngine.init();
            }
        }, { once: true });

        // Initialize systems that don't depend on boot
        BootSequence.init();
        VHSTimestamp.init();
        CheatTerminal.init();
        KonamiCode.init();
        Navigation.init();
        SoundToggle.init();
        SecretOverlay.init();
        FooterEasterEgg.init();
    });

})();