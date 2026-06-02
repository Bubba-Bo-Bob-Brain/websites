/* ============================================
   CASE FILE #2471 - THE BLACKWOOD AFFAIR
   Film Noir Detective Case File System
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeAllSystems();
});

function initializeAllSystems() {
    createRainEffect();
    initializeSmokeTrail();
    initializeTabNavigation();
    initializeTypewriterEffect();
    initializeConspiracyBoard();
    initializeEvidenceFilters();
    initializeSuspectCards();
    initializeModal();
    initializeScrollEffects();
    playAmbientSounds();
}

/* ============================================
   RAIN ON GLASS EFFECT
   ============================================ */

function createRainEffect() {
    const rainContainer = document.getElementById('rainContainer');
    const dropCount = 100;
    
    for (let i = 0; i < dropCount; i++) {
        createRaindrop(rainContainer);
    }
    
    setInterval(() => {
        const drops = rainContainer.querySelectorAll('.raindrop');
        drops.forEach(drop => {
            if (Math.random() > 0.95) {
                drop.remove();
                createRaindrop(rainContainer);
            }
        });
    }, 100);
}

function createRaindrop(container) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    
    const left = Math.random() * 100;
    const duration = 0.5 + Math.random() * 1;
    const delay = Math.random() * 2;
    const height = 15 + Math.random() * 15;
    
    drop.style.left = `${left}%`;
    drop.style.height = `${height}px`;
    drop.style.animationDuration = `${duration}s`;
    drop.style.animationDelay = `${delay}s`;
    drop.style.opacity = 0.1 + Math.random() * 0.2;
    
    container.appendChild(drop);
    
    drop.addEventListener('animationend', () => {
        drop.remove();
        createRaindrop(container);
    });
}

/* ============================================
   SMOKE TRAIL CURSOR EFFECT
   ============================================ */

function initializeSmokeTrail() {
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    let mouseX = width / 2;
    let mouseY = height / 2;
    
    class SmokeParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 20 + 10;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = -Math.random() * 0.5 - 0.2;
            this.life = 1;
            this.decay = 0.005 + Math.random() * 0.01;
            this.opacity = 0.1 + Math.random() * 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size += 0.1;
            this.life -= this.decay;
            this.opacity = this.life * 0.15;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, 'rgba(100, 100, 100, 0.5)');
            gradient.addColorStop(0.5, 'rgba(80, 80, 80, 0.2)');
            gradient.addColorStop(1, 'rgba(60, 60, 60, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    function createParticle() {
        if (particles.length < particleCount) {
            particles.push(new SmokeParticle(mouseX, mouseY));
        }
    }
    
    function animateSmoke() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw();
            
            if (particle.life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        if (Math.random() > 0.7) {
            createParticle();
        }
        
        requestAnimationFrame(animateSmoke);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (Math.random() > 0.8) {
            createParticle();
        }
    });
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    animateSmoke();
}

/* ============================================
   TAB NAVIGATION
   ============================================ */

function initializeTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetId);
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            targetPanel.classList.add('active');
            
            if (targetId === 'conspiracy') {
                setTimeout(drawConnections, 100);
            }
            
            playSound('click');
        });
    });
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */

function initializeTypewriterEffect() {
    const typewriterSection = document.getElementById('typewriterText');
    if (!typewriterSection) return;
    
    const lines = typewriterSection.querySelectorAll('.typed-line');
    let currentLine = 0;
    
    lines.forEach(line => {
        line.textContent = '';
        line.style.opacity = '1';
        line.style.transform = 'translateX(0)';
    });
    
    function typeLine(line, text, callback) {
        let index = 0;
        const speed = 30 + Math.random() * 20;
        
        function type() {
            if (index < text.length) {
                line.textContent += text[index];
                index++;
                playSound('type');
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        
        type();
    }
    
    function startTypewriter() {
        currentLine = 0;
        
        function typeNextLine() {
            if (currentLine < lines.length) {
                const line = lines[currentLine];
                const text = line.getAttribute('data-text');
                typeLine(line, text, () => {
                    currentLine++;
                    setTimeout(typeNextLine, 300);
                });
            }
        }
        
        typeNextLine();
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTypewriter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(typewriterSection);
}

/* ============================================
   CONSPIRACY BOARD CONNECTIONS
   ============================================ */

function initializeConspiracyBoard() {
    const svg = document.getElementById('connectionsSvg');
    const toggleBtn = document.getElementById('toggleConnections');
    const resetBtn = document.getElementById('resetBoard');
    
    let connectionsVisible = true;
    
    const connections = [
        { from: '.suspect-victoria', to: '.victim-photo', color: 'red', label: 'Spouse' },
        { from: '.suspect-edmund', to: '.victim-photo', color: 'blue', label: 'Son' },
        { from: '.suspect-helena', to: '.victim-photo', color: 'red', label: 'Affair' },
        { from: '.suspect-marcus', to: '.victim-photo', color: 'yellow', label: 'Partner' },
        { from: '.suspect-unknown', to: '.victim-photo', color: 'black', label: 'Unknown' },
        { from: '.suspect-victoria', to: '.suspect-helena', color: 'red', label: 'Rivals' },
        { from: '.suspect-edmund', to: '.suspect-marcus', color: 'yellow', label: 'Business' },
    ];
    
    window.drawConnections = function() {
        if (!svg) return;
        
        const board = document.getElementById('corkboard');
        const boardRect = board.getBoundingClientRect();
        
        svg.innerHTML = '';
        
        connections.forEach(conn => {
            const fromEl = document.querySelector(conn.from);
            const toEl = document.querySelector(conn.to);
            
            if (!fromEl || !toEl) return;
            
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            
            const x1 = fromRect.left + fromRect.width / 2 - boardRect.left;
            const y1 = fromRect.top + fromRect.height / 2 - boardRect.top;
            const x2 = toRect.left + toRect.width / 2 - boardRect.left;
            const y2 = toRect.top + toRect.height / 2 - boardRect.top;
            
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const offset = 20 * (Math.random() - 0.5);
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${x1} ${y1} Q ${midX + offset} ${midY + offset} ${x2} ${y2}`;
            
            path.setAttribute('d', d);
            path.setAttribute('class', `thread-line ${conn.color}`);
            
            if (!connectionsVisible) {
                path.style.opacity = '0';
            }
            
            svg.appendChild(path);
            
            animateThread(path);
        });
    };
    
    function animateThread(path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        
        setTimeout(() => {
            path.style.strokeDashoffset = '0';
        }, 100);
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            connectionsVisible = !connectionsVisible;
            toggleBtn.textContent = connectionsVisible ? 'HIDE THREADS' : 'SHOW THREADS';
            
            const threads = svg.querySelectorAll('.thread-line');
            threads.forEach(thread => {
                thread.style.transition = 'opacity 0.3s ease';
                thread.style.opacity = connectionsVisible ? '1' : '0';
            });
            
            playSound('click');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            drawConnections();
            playSound('click');
        });
    }
    
    const conspiracyTab = document.querySelector('[data-tab="conspiracy"]');
    if (conspiracyTab) {
        conspiracyTab.addEventListener('click', () => {
            setTimeout(drawConnections, 200);
        });
    }
}

/* ============================================
   EVIDENCE FILTERS
   ============================================ */

function initializeEvidenceFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const evidenceItems = document.querySelectorAll('.evidence-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            evidenceItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'panel-fade-in 0.3s ease';
                } else {
                    item.style.display = 'none';
                }
            });
            
            playSound('click');
        });
    });
}

/* ============================================
   SUSPECT CARDS INTERACTION
   ============================================ */

function initializeSuspectCards() {
    const suspectCards = document.querySelectorAll('.suspect-card');
    
    const suspectDetails = {
        victoria: {
            name: 'VICTORIA BLACKWOOD',
            age: 45,
            relation: 'Wife',
            background: 'Born Victoria Ashford, old money family. Married Edward 20 years ago in what many called a marriage of convenience.',
            motive: '$2M life insurance policy signed just weeks before the murder. Marriage had been deteriorating.',
            alibi: 'Claims she was in her bedroom all evening, but security footage places her near the library at 10:20 PM.',
            notes: 'Neighbors report frequent arguments. Victoria was seen meeting with a lawyer two days before the murder.',
            threatLevel: 'HIGH'
        },
        edmund: {
            name: 'EDMUND BLACKWOOD',
            age: 28,
            relation: 'Son',
            background: 'Black sheep of the family. Gambling problems, failed business ventures. Stands to inherit the family business.',
            motive: 'Owes $50,000 to dangerous people. Father threatened to cut him off completely.',
            alibi: 'Claims he was at a poker game downtown, but left the table for 45 minutes around 10:30 PM.',
            notes: 'Was seen arguing with his father at the party. Phone records show calls to unknown numbers.',
            threatLevel: 'MEDIUM'
        },
        helena: {
            name: 'HELENA VOSS',
            age: 32,
            relation: 'Secretary',
            background: 'Worked for Blackwood Industries for 5 years. Rumors of an affair have circulated for months.',
            motive: 'Blackwood threatened to fire her and expose their affair to her family.',
            alibi: 'Left the party early claiming illness, but neighbor reports seeing her car near the estate at 10:50 PM.',
            notes: 'Intimate letters found in victim\'s desk. Helena had recently purchased a new car - cash payment.',
            threatLevel: 'HIGH'
        },
        marcus: {
            name: 'MARCUS CHEN',
            age: 55,
            relation: 'Business Partner',
            background: 'Co-founded Blackwood Industries with victim. Company facing financial difficulties.',
            motive: 'Blackwood was blocking a merger that would have saved the company. Marcus stood to lose everything.',
            alibi: 'Claims he was at his office until midnight. Secretary confirms, but building security logs show he left at 10:15 PM.',
            notes: 'Business ledger shows suspicious payments. Marcus has connections to organized crime figures.',
            threatLevel: 'MEDIUM'
        },
        james: {
            name: 'JAMES WHITMORE',
            age: 60,
            relation: 'Butler',
            background: 'Served the Blackwood family for 30 years. Only employee with keys to all rooms.',
            motive: 'Blackwood threatened to dismiss him after 30 years of service. Pension would be lost.',
            alibi: 'Claims he was in the kitchen all evening. Multiple staff members confirm.',
            notes: 'Most consistent alibi of all suspects. However, his access to all areas of the house is concerning.',
            threatLevel: 'LOW'
        },
        unknown: {
            name: 'UNKNOWN MALE',
            age: 'Unknown',
            relation: 'Unidentified',
            background: 'No identification available. Description matches no known associates of the victim.',
            motive: 'Unknown. Possible connection to blackmail payments found in victim\'s ledger.',
            alibi: 'None. Seen climbing over garden wall by gardener at approximately 10:40 PM.',
            notes: 'Red wool fiber found at scene matches description. Blurry photo from security camera. Male, tall, dark coat, red scarf.',
            threatLevel: 'UNKNOWN'
        }
    };
    
    suspectCards.forEach(card => {
        card.addEventListener('click', () => {
            const suspectId = card.getAttribute('data-suspect');
            const details = suspectDetails[suspectId];
            
            if (details) {
                showSuspectModal(details);
            }
            
            playSound('click');
        });
        
        card.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });
}

/* ============================================
   MODAL SYSTEM
   ============================================ */

function initializeModal() {
    const modal = document.getElementById('suspectModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        playSound('click');
    }
    
    window.showSuspectModal = function(details) {
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2>${details.name}</h2>
                <span class="modal-threat ${details.threatLevel.toLowerCase()}">${details.threatLevel} THREAT</span>
            </div>
            <div class="modal-section">
                <h3>PROFILE</h3>
                <p><strong>Age:</strong> ${details.age}</p>
                <p><strong>Relation to Victim:</strong> ${details.relation}</p>
            </div>
            <div class="modal-section">
                <h3>BACKGROUND</h3>
                <p>${details.background}</p>
            </div>
            <div class="modal-section">
                <h3>MOTIVE</h3>
                <p>${details.motive}</p>
            </div>
            <div class="modal-section">
                <h3>ALIBI</h3>
                <p>${details.alibi}</p>
            </div>
            <div class="modal-section">
                <h3>DETECTIVE'S NOTES</h3>
                <p>${details.notes}</p>
            </div>
        `;
        
        modal.classList.add('active');
    };
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */

function initializeScrollEffects() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const statementCards = document.querySelectorAll('.statement-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    statementCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

/* ============================================
   SOUND EFFECTS (Simulated)
   ============================================ */

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const sounds = {
        click: { frequency: 800, duration: 0.05, type: 'square' },
        type: { frequency: 1200, duration: 0.02, type: 'sine' },
        hover: { frequency: 400, duration: 0.03, type: 'sine' }
    };
    
    const sound = sounds[type];
    if (!sound) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = sound.frequency;
        oscillator.type = sound.type;
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + sound.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
    } catch (e) {
        // Audio not supported or blocked
    }
}

function playAmbientSounds() {
    // Ambient noir atmosphere could be added here
    // For now, we'll keep it silent to avoid auto-play issues
}

/* ============================================
   VENETIAN BLIND ANIMATION ENHANCEMENT
   ============================================ */

function enhanceVenetianBlinds() {
    const blinds = document.querySelectorAll('.blind-strip');
    
    let time = 0;
    
    function animateBlinds() {
        time += 0.02;
        
        blinds.forEach((blind, index) => {
            const offset = Math.sin(time + index * 0.5) * 2;
            const skew = Math.sin(time * 0.5 + index * 0.3) * 1;
            blind.style.transform = `translateY(${offset}px) skewX(${skew}deg)`;
        });
        
        requestAnimationFrame(animateBlinds);
    }
    
    animateBlinds();
}

/* ============================================
   CORKBOARD INTERACTION
   ============================================ */

function initializeCorkboardInteraction() {
    const board = document.getElementById('corkboard');
    const photos = board.querySelectorAll('.board-photo');
    const notes = board.querySelectorAll('.board-note');
    
    photos.forEach(photo => {
        photo.addEventListener('click', () => {
            photo.style.transform = 'scale(1.1) rotate(0deg)';
            setTimeout(() => {
                photo.style.transform = '';
            }, 300);
        });
    });
    
    notes.forEach(note => {
        note.addEventListener('click', () => {
            const currentRotation = note.style.transform;
            if (currentRotation.includes('rotate')) {
                note.style.transform = currentRotation.replace(/rotate\([^)]+\)/, 'rotate(0deg)');
            } else {
                note.style.transform = `${currentRotation} rotate(${Math.random() * 6 - 3}deg)`;
            }
        });
    });
}

/* ============================================
   EVIDENCE ITEM HOVER EFFECTS
   ============================================ */

function initializeEvidenceEffects() {
    const evidenceItems = document.querySelectorAll('.evidence-item');
    
    evidenceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const photo = item.querySelector('.evidence-photo');
            if (photo) {
                photo.style.filter = 'brightness(1.2) contrast(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const photo = item.querySelector('.evidence-photo');
            if (photo) {
                photo.style.filter = '';
            }
        });
    });
}

/* ============================================
   WITNESS CREDIBILITY ANIMATION
   ============================================ */

function animateCredibilityBars() {
    const credBars = document.querySelectorAll('.cred-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    credBars.forEach(bar => observer.observe(bar));
}

/* ============================================
   CLASSIFICATION STAMP ANIMATION
   ============================================ */

function animateClassificationStamp() {
    const stamp = document.querySelector('.classification-stamp');
    
    if (stamp) {
        setInterval(() => {
            stamp.style.opacity = '1';
            setTimeout(() => {
                stamp.style.opacity = '0.7';
            }, 200);
        }, 5000);
    }
}

/* ============================================
   INITIALIZE ALL ENHANCED FEATURES
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    enhanceVenetianBlinds();
    initializeCorkboardInteraction();
    initializeEvidenceEffects();
    animateCredibilityBars();
    animateClassificationStamp();
    
    addModalStyles();
});

/* ============================================
   DYNAMIC MODAL STYLES
   ============================================ */

function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--noir-medium);
        }
        
        .modal-header h2 {
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--noir-paper);
            margin: 0;
        }
        
        .modal-threat {
            padding: 0.25rem 0.75rem;
            font-family: var(--font-typewriter);
            font-size: 0.7rem;
            letter-spacing: 1px;
        }
        
        .modal-threat.high {
            background: var(--accent-red);
            color: var(--noir-white);
        }
        
        .modal-threat.medium {
            background: var(--accent-gold);
            color: var(--noir-black);
        }
        
        .modal-threat.low {
            background: var(--noir-gray);
            color: var(--noir-white);
        }
        
        .modal-threat.unknown {
            background: var(--noir-medium);
            color: var(--noir-silver);
            border: 1px dashed var(--noir-gray);
        }
        
        .modal-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-left: 3px solid var(--accent-red);
        }
        
        .modal-section h3 {
            font-family: var(--font-typewriter);
            font-size: 0.8rem;
            color: var(--accent-red);
            margin-bottom: 0.5rem;
            letter-spacing: 2px;
        }
        
        .modal-section p {
            font-family: var(--font-body);
            font-size: 0.95rem;
            color: var(--noir-paper);
            line-height: 1.6;
            margin: 0;
        }
        
        .modal-section strong {
            color: var(--noir-cream);
        }
    `;
    
    document.head.appendChild(style);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   WINDOW RESIZE HANDLER
   ============================================ */

window.addEventListener('resize', debounce(() => {
    const svg = document.getElementById('connectionsSvg');
    if (svg && document.getElementById('conspiracy').classList.contains('active')) {
        drawConnections();
    }
}, 250));

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */

console.log('%c CASE FILE #2471 ', 'background: #8b0000; color: #f5f2ed; font-size: 20px; padding: 10px;');
console.log('%c THE BLACKWOOD AFFAIR ', 'background: #1a1a1a; color: #c4b9a8; font-size: 14px; padding: 5px;');
console.log('%c Property of Precinct 14 - Unauthorized Access Prohibited ', 'color: #6b6b6b; font-size: 10px;');