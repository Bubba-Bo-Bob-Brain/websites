// Grandfather Clock
const updateClock = () => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hoursDeg = (hours * 30) + (minutes * 0.5);
    const minutesDeg = (minutes * 6) + (seconds * 0.1);
    const secondsDeg = seconds * 6;

    const hourHand = document.querySelector('.clock-hand.hours');
    const minuteHand = document.querySelector('.clock-hand.minutes');
    const secondHand = document.querySelector('.clock-hand.seconds');

    if (hourHand) hourHand.style.transform = `rotate(${hoursDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secondsDeg}deg)`;
};

setInterval(updateClock, 1000);
updateClock();

// Invitation Seal
const breakSealBtn = document.getElementById('breakSeal');
const invitationSeal = document.getElementById('invitationSeal');
const invitationContent = document.getElementById('invitationContent');

if (breakSealBtn) {
    breakSealBtn.addEventListener('click', () => {
        invitationSeal.style.transition = 'all 1s ease';
        invitationSeal.style.transform = 'scale(0.8) rotate(5deg)';
        invitationSeal.style.opacity = '0';

        setTimeout(() => {
            invitationSeal.style.display = 'none';
            invitationContent.classList.remove('hidden');
            invitationContent.style.animation = 'cardReveal 1s ease forwards';

            // Trigger a subtle gaslight pulse
            const gaslight = document.querySelector('.ambient-gaslight');
            if (gaslight) {
                gaslight.style.animation = 'none';
                gaslight.offsetHeight;
                gaslight.style.animation = 'gaslightFlicker 8s ease-in-out infinite alternate';
            }
        }, 600);
    });
}

// Scroll Reveal
const revealElements = document.querySelectorAll('.member-card, .notation-card, .section-title');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
});

// Gaslight Flicker Enhancement
const gaslightOverlay = document.querySelector('.ambient-gaslight');

if (gaslightOverlay) {
    const addRandomFlicker = () => {
        const intensity = Math.random() * 0.15 + 0.05;
        gaslightOverlay.style.opacity = intensity;
        setTimeout(() => {
            gaslightOverlay.style.opacity = '0.6';
        }, 50 + Math.random() * 150);
    };

    setInterval(() => {
        if (Math.random() > 0.7) {
            addRandomFlicker();
        }
    }, 2000);
}

// Member Card Hover Effects
const memberCards = document.querySelectorAll('.member-card');

memberCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const portrait = card.querySelector('.portrait');
        if (portrait) {
            portrait.style.filter = `
                sepia(0.8)
                contrast(1.4)
                brightness(0.75)
                saturate(0.2)
            `;
            portrait.style.transition = 'filter 0.5s ease';
        }

        // Add a subtle glow
        const frame = card.querySelector('.card-frame');
        if (frame) {
            frame.style.boxShadow = `
                0 0 30px rgba(255, 159, 61, 0.15),
                0 4px 20px rgba(0, 0, 0, 0.5)
            `;
        }
    });

    card.addEventListener('mouseleave', () => {
        const portrait = card.querySelector('.portrait');
        if (portrait) {
            portrait.style.filter = `
                sepia(0.6)
                contrast(1.2)
                brightness(0.85)
                saturate(0.3)
            `;
        }

        const frame = card.querySelector('.card-frame');
        if (frame) {
            frame.style.boxShadow = `
                0 0 20px rgba(0, 0, 0, 0.5),
                inset 0 0 30px rgba(0, 0, 0, 0.3)
            `;
        }
    });
});

// Seance Schedule Click to Expand
const scheduleItems = document.querySelectorAll('.schedule-item');

scheduleItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.3s ease';
    item.addEventListener('click', () => {
        const day = item.querySelector('.day');
        const location = item.querySelector('.location');

        if (day) {
            day.style.color = 'var(--amber-light)';
            day.style.textShadow = '0 0 8px rgba(255, 159, 61, 0.3)';
        }

        if (location) {
            location.style.color = 'var(--amber)';
            location.style.textShadow = '0 0 6px rgba(255, 159, 61, 0.2)';
        }

        item.style.padding = '10px 0';
        item.style.background = 'rgba(139, 105, 20, 0.05)';

        setTimeout(() => {
            if (day) {
                day.style.color = '';
                day.style.textShadow = '';
            }
            if (location) {
                location.style.color = '';
                location.style.textShadow = '';
            }
            item.style.padding = '';
            item.style.background = '';
        }, 2000);
    });
});

// Typing Effect for Greeting
const greeting = document.querySelector('.greeting');
if (greeting) {
    const text = greeting.textContent;
    greeting.textContent = '';
    let index = 0;

    const typeWriter = () => {
        if (index < text.length) {
            greeting.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 40 + Math.random() * 30);
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(greeting);
}

// Ambient Particle Effect
const createParticle = () => {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: rgba(255, 159, 61, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: floatParticle ${5 + Math.random() * 10}s linear forwards;
    `;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 15000);
};

// Add particle animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes floatParticle {
        0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}50px);
        }
    }
`;
document.head.appendChild(styleSheet);

setInterval(createParticle, 800);

// Clock Chime Sound Visual
const clockChime = document.querySelector('.clock-chime');
if (clockChime) {
    setInterval(() => {
        clockChime.style.transform = 'scale(1.2)';
        setTimeout(() => {
            clockChime.style.transform = 'scale(1)';
        }, 200);
    }, 60000);
}

// Hierarchical filter buttons
const hierarchyLegend = document.querySelector('.hierarchy-legend');
if (hierarchyLegend) {
    hierarchyLegend.addEventListener('click', (e) => {
        const target = e.target.closest('.hierarchy-level');
        if (!target) return;

        const level = target.textContent.toLowerCase();
        const cards = document.querySelectorAll('.member-card');

        cards.forEach(card => {
            const levelClass = card.querySelector('.status-badge').textContent.toLowerCase();
            const match = level.includes(levelClass.split(' ')[0]) ||
                         level.includes(levelClass.split(' ')[1]) ||
                         level.includes(levelClass.split(' ')[2]);

            if (match || level.includes('supreme') || level.includes('inner') || level.includes('outer') || level.includes('initiated')) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0.2';
                card.style.transform = 'translateY(10px)';
            }
        });
    });
}

// Double-click member name to reveal secret message
const memberNames = document.querySelectorAll('.member-name');
memberNames.forEach(name => {
    name.addEventListener('dblclick', () => {
        const secrets = [
            "The veil grows thin at midnight...",
            "Beware the thirteenth hour...",
            "Not all who dwell in shadow are lost...",
            "The Ebon Codex speaks of you...",
            "Your destiny is written in starlight...",
            "The spirits have been expecting you..."
        ];

        const secret = secrets[Math.floor(Math.random() * secrets.length)];
        const tooltip = document.createElement('div');
        tooltip.textContent = secret;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(26, 14, 10, 0.95);
            border: 1px solid var(--frame-gold);
            padding: 20px 30px;
            color: var(--amber-light);
            font-family: 'IM Fell English', serif;
            font-size: 1rem;
            z-index: 10000;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 0 40px rgba(255, 159, 61, 0.2);
            animation: fadeInOut 3s ease forwards;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => tooltip.remove(), 3000);
    });
});

// Add fadeInOut animation
const fadeInOutStyle = document.createElement('style');
fadeInOutStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
`;
document.head.appendChild(fadeInOutStyle);

// Smooth scroll enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Parallax effect on scroll for header
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('.society-header');

    if (header) {
        const scrollPercent = currentScroll / (document.body.scrollHeight - window.innerHeight);
        const offset = scrollPercent * 20;
        header.style.transform = `translateY(${offset}px)`;
    }

    lastScroll = currentScroll;
});

// Add a subtle breathing effect to the seal
const sealWax = document.querySelector('.seal-wax');
if (sealWax) {
    setInterval(() => {
        sealWax.style.boxShadow = `
            0 4px 20px rgba(139, 37, 0, ${0.4 + Math.random() * 0.2}),
            inset 0 -3px 8px rgba(0, 0, 0, 0.4),
            inset 0 3px 8px rgba(255, 100, 50, ${0.1 + Math.random() * 0.1})
        `;
    }, 3000);
}

// Initialize card positions for staggered reveal
document.querySelectorAll('.member-card').forEach((card, index) => {
    card.style.animationDelay = `${0.2 + (index * 0.2)}s`;
});

// Console easter egg
console.log('%c⚜ The Obsidian Athenaeum ⚜', 'color: #c9a84c; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(255,159,61,0.5);');
console.log('%cYou should not be reading this...', 'color: #8b3a2a; font-size: 12px; font-style: italic;');
console.log('%c"The whispering dead know your name." — Extract VII, Ebon Codex', 'color: #6b1a1a; font-size: 11px;');