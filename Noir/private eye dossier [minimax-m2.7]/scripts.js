/* ==============================================
1940s FILM NOIR DETECTIVE CASE FILE SYSTEM
JAVASCRIPT
============================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initTypewriterEffects();
    initNavigation();
    initCustomCursor();
    initSmokeTrail();
    initCorkboard();
    initWitnessStatements();
    initScrollAnimations();
    initRainEffects();
    initVignettePulse();
    initDocumentReady();
    
    console.log('Case File #2471 — The Blackwood Conspiracy');
    console.log("Detective J.W. Marlowe reporting for duty.");
});

/* ==============================================
CUSTOM CURSOR
============================================== */
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    document.querySelectorAll('button, .nav-tab, .suspect-card, .evidence-item, .witness-card, .cork-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
    
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

/* ==============================================
SMOKE TRAIL EFFECT
============================================== */
function initSmokeTrail() {
    const smokeContainer = document.getElementById('smokeContainer');
    if (!smokeContainer) return;
    
    let lastSmokeTime = 0;
    const smokeInterval = 150;
    
    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastSmokeTime > smokeInterval) {
            createSmokeParticle(e.clientX, e.clientY);
            lastSmokeTime = currentTime;
        }
    });
    
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 50 + Math.random() * 50;
        for (let i = 0; i < 2; i++) {
            setTimeout(() => createSmokeParticle(x + (Math.random() - 0.5) * 30, y), i * 300);
        }
    }, 2500);
    
    function createSmokeParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'smoke-particle';
        const size = 15 + Math.random() * 15;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
        particle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
        smokeContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
        }, 5000);
    }
}

/* ==============================================
NAVIGATION
============================================== */
function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.case-section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.dataset.section;
            
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.add('active');
                    animateSection(section);
                } else {
                    section.classList.remove('active');
                }
            });
            
            document.getElementById(targetSection).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => tab.style.transform = '', 100);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        const activeIndex = Array.from(navTabs).findIndex(tab => tab.classList.contains('active'));
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const nextIndex = (activeIndex + 1) % navTabs.length;
            if (navTabs[nextIndex]) navTabs[nextIndex].click();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const prevIndex = (activeIndex - 1 + navTabs.length) % navTabs.length;
            if (navTabs[prevIndex]) navTabs[prevIndex].click();
        }
    });
}

function animateSection(section) {
    if (section.id === 'suspects') animateSuspectCards();
    if (section.id === 'evidence') animateEvidencePhotos();
    if (section.id === 'corkboard') animateCorkboard();
}

function animateSuspectCards() {
    const cards = document.querySelectorAll('.suspect-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function animateEvidencePhotos() {
    const photos = document.querySelectorAll('.evidence-item');
    photos.forEach((photo, index) => {
        photo.style.opacity = '0';
        photo.style.transform = 'rotate(-2deg) scale(0.9)';
        setTimeout(() => {
            photo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            photo.style.opacity = '1';
            photo.style.transform = 'rotate(-1deg) scale(1)';
        }, index * 150);
    });
}

function animateCorkboard() {
    const threads = document.querySelectorAll('.red-thread');
    threads.forEach((thread, index) => {
        thread.style.strokeDashoffset = '1000';
        setTimeout(() => {
            thread.style.animation = `thread-draw 1.5s ease forwards ${index * 0.1}s`;
        }, 500);
    });
    
    const items = document.querySelectorAll('.cork-item');
    items.forEach((item, index) => {
        const rotation = (Math.random() - 0.5) * 20;
        item.style.opacity = '0';
        item.style.transform = `scale(0.5) rotate(${rotation}deg)`;
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, index * 100);
    });
}

/* ==============================================
TYPEWRITER EFFECTS
============================================== */
function initTypewriterEffects() {
    const subtitle = document.querySelector('.typewriter');
    if (subtitle) {
        const text = subtitle.dataset.text || subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        function typeSubtitle() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeSubtitle, 80 + Math.random() * 40);
            }
        }
        setTimeout(typeSubtitle, 1000);
    }
    
    const dateEl = document.querySelector('.typewriter-date');
    if (dateEl) {
        const text = dateEl.textContent;
        dateEl.textContent = '';
        let i = 0;
        function typeDate() {
            if (i < text.length) {
                dateEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeDate, 60);
            }
        }
        setTimeout(typeDate, 2500);
    }
    
    const briefContent = document.querySelector('.brief-content');
    if (briefContent) {
        const paragraphs = briefContent.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
            const originalText = p.innerHTML;
            p.innerHTML = '';
            p.style.visibility = 'hidden';
            
            setTimeout(() => {
                p.style.visibility = 'visible';
                let i = 0;
                function typeParagraph() {
                    if (i < originalText.length) {
                        if (originalText[i] === '<') {
                            const tagEnd = originalText.indexOf('>', i);
                            p.innerHTML += originalText.substring(i, tagEnd + 1);
                            i = tagEnd + 1;
                        } else {
                            p.innerHTML += originalText[i];
                            i++;
                        }
                        setTimeout(typeParagraph, 15 + Math.random() * 10);
                    }
                }
                typeParagraph();
            }, 3000 + index * 2000);
        });
    }
}

/* ==============================================
WITNESS STATEMENTS
============================================== */
function initWitnessStatements() {
    const statements = document.querySelectorAll('.typewriter-statement');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.dataset.text;
                if (text && !el.classList.contains('revealed')) {
                    el.classList.add('revealed');
                    revealStatement(el, text);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statements.forEach(statement => observer.observe(statement));
}

function revealStatement(element, text) {
    element.textContent = '';
    let i = 0;
    
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);
    
    const style = document.createElement('style');
    style.id = 'cursor-style';
    style.textContent = `
        .typewriter-cursor {
            animation: cursor-blink 0.8s infinite;
            color: var(--amber-glow);
        }
        @keyframes cursor-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    if (!document.getElementById('cursor-style')) {
        document.head.appendChild(style);
    }
    
    function typeChar() {
        if (i < text.length) {
            let delay = 15 + Math.random() * 15;
            if (text[i] === ' ' || text[i] === '.' || text[i] === ',') {
                delay = 100 + Math.random() * 100;
            }
            if (text[i] === '.') {
                delay = 300;
            }
            element.insertBefore(document.createTextNode(text[i]), cursor);
            i++;
            setTimeout(typeChar, delay);
        } else {
            setTimeout(() => {
                cursor.style.opacity = '0';
                setTimeout(() => {
                    if (cursor.parentNode) cursor.remove();
                }, 300);
            }, 1000);
        }
    }
    
    setTimeout(typeChar, 500);
}

/* ==============================================
CORKBOARD INTERACTION
============================================== */
function initCorkboard() {
    const corkItems = document.querySelectorAll('.cork-item');
    const threads = document.querySelectorAll('.red-thread');
    
    corkItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemId = item.id;
            const isActive = item.classList.contains('active');
            
            if (!isActive) {
                corkItems.forEach(i => i.classList.remove('active'));
                threads.forEach(t => {
                    t.style.opacity = '0.2';
                    t.style.strokeWidth = '1';
                });
                
                threads.forEach(thread => {
                    if (thread.dataset.from === itemId || thread.dataset.to === itemId) {
                        thread.style.opacity = '1';
                        thread.style.strokeWidth = '3';
                        
                        const connectedId = thread.dataset.from === itemId 
                            ? thread.dataset.to 
                            : thread.dataset.from;
                        const connectedItem = document.getElementById(connectedId);
                        if (connectedItem) {
                            connectedItem.classList.add('active');
                        }
                    }
                });
                
                item.classList.add('active');
                
                const central = document.querySelector('.cork-central');
                if (central) {
                    central.style.animation = 'pulse 0.5s ease-in-out 3';
                    setTimeout(() => {
                        central.style.animation = '';
                    }, 1500);
                }
            } else {
                corkItems.forEach(i => i.classList.remove('active'));
                threads.forEach(t => {
                    t.style.opacity = '0.7';
                    t.style.strokeWidth = '2';
                });
            }
        });
    });
    
    threads.forEach(thread => {
        thread.addEventListener('mouseenter', () => {
            if (!document.querySelector('.cork-item.active')) {
                thread.style.opacity = '1';
                thread.style.strokeWidth = '3';
                thread.style.filter = 'drop-shadow(0 0 10px rgba(139, 0, 0, 0.8))';
            }
        });
        thread.addEventListener('mouseleave', () => {
            if (!document.querySelector('.cork-item.active')) {
                thread.style.opacity = '0.7';
                thread.style.strokeWidth = '2';
                thread.style.filter = '';
            }
        });
    });
    
    const corkboardMain = document.getElementById('corkboardMain');
    if (corkboardMain) {
        corkboardMain.addEventListener('dblclick', () => {
            corkItems.forEach(i => i.classList.remove('active'));
            threads.forEach(t => {
                t.style.opacity = '0.7';
                t.style.strokeWidth = '2';
            });
        });
    }
    
    setTimeout(() => {
        const items = document.querySelectorAll('.cork-item:not(.cork-central)');
        items.forEach(item => {
            const currentLeft = parseFloat(item.style.left);
            const currentTop = parseFloat(item.style.top);
            const randomOffsetX = (Math.random() - 0.5) * 10;
            const randomOffsetY = (Math.random() - 0.5) * 10;
            item.style.left = (currentLeft + randomOffsetX) + 'px';
            item.style.top = (currentTop + randomOffsetY) + 'px';
        });
    }, 100);
}

/* ==============================================
SCROLL ANIMATIONS
============================================== */
function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.timeline-item, .suspect-card, .evidence-item, .witness-card');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;
            if (isVisible && !el.classList.contains('animated')) {
                el.classList.add('animated');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    
    document.querySelectorAll('.timeline-item, .suspect-card, .evidence-item, .witness-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    setTimeout(animateOnScroll, 500);
    
    const header = document.querySelector('.case-header');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (header) {
            header.style.backgroundPositionY = scrolled * 0.3 + 'px';
        }
    });
}

/* ==============================================
RAIN EFFECTS
============================================== */
function initRainEffects() {
    const rainOverlay = document.querySelector('.rain-overlay');
    if (!rainOverlay) return;
    
    let rainIntensity = 0.15;
    
    setInterval(() => {
        rainIntensity = 0.1 + Math.random() * 0.15;
        rainOverlay.style.opacity = rainIntensity;
        
        const drops = document.querySelectorAll('.rain-drop');
        drops.forEach(drop => {
            drop.style.left = Math.random() * 100 + '%';
        });
    }, 5000);
}

/* ==============================================
VIGNETTE PULSE
============================================== */
function initVignettePulse() {
    const vignette = document.querySelector('.vignette');
    if (!vignette) return;
    
    let pulseDirection = 1;
    let pulseIntensity = 0;
    
    setInterval(() => {
        pulseIntensity += 0.02 * pulseDirection;
        if (pulseIntensity > 1) pulseDirection = -1;
        if (pulseIntensity < 0) pulseDirection = 1;
        
        const baseOpacity = 0.4 + Math.sin(pulseIntensity) * 0.1;
        vignette.style.background = `radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, ${baseOpacity + 0.4}) 80%, rgba(0, 0, 0, ${baseOpacity + 0.8}) 100%)`;
    }, 100);
}

/* ==============================================
DOCUMENT READY EFFECTS
============================================== */
function initDocumentReady() {
    document.body.classList.add('loaded');
    
    setTimeout(() => {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            opacity: 0;
            z-index: 10001;
            pointer-events: none;
            animation: flash-in 0.3s ease-out forwards;
        `;
        document.body.appendChild(flash);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash-in {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => flash.remove(), 300);
    }, 100);
    
    setTimeout(() => {
        const stamps = document.querySelectorAll('.case-stamp, .suspect-stamp');
        stamps.forEach(stamp => {
            stamp.style.animation = 'stamp-pulse 2s ease-in-out infinite';
        });
    }, 3000);
    
    createAtmosphereIndicator();
}

function createAtmosphereIndicator() {
    const indicator = document.createElement('div');
    indicator.innerHTML = '◉';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        font-size: 1.2rem;
        color: var(--amber-glow);
        z-index: 1000;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.3s ease;
        animation: pulse-glow 3s ease-in-out infinite;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-glow {
            0%, 100% { text-shadow: 0 0 5px rgba(212, 165, 116, 0.3); }
            50% { text-shadow: 0 0 15px rgba(212, 165, 116, 0.6); }
        }
    `;
    document.head.appendChild(style);
    
    indicator.classList.add('atmosphere-indicator');
    indicator.title = "Detective's Bureau — Case Active";
    document.body.appendChild(indicator);
}

/* ==============================================
KEYBOARD SHORTCUTS
============================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeItems = document.querySelectorAll('.cork-item.active');
        const threads = document.querySelectorAll('.red-thread');
        activeItems.forEach(i => i.classList.remove('active'));
        threads.forEach(t => {
            t.style.opacity = '0.7';
            t.style.strokeWidth = '2';
        });
    }
    
    if (e.key >= '1' && e.key <= '5') {
        const tabs = document.querySelectorAll('.nav-tab');
        const index = parseInt(e.key) - 1;
        if (tabs[index]) tabs[index].click();
    }
    
    if (e.key.toLowerCase() === 'c') {
        const threads = document.querySelectorAll('.red-thread');
        threads.forEach(t => {
            t.style.opacity = t.style.opacity === '0' ? '0.7' : '0';
        });
    }
});

/* ==============================================
EASTER EGGS & SPECIAL EFFECTS
============================================== */
document.addEventListener('DOMContentLoaded', () => {
    const fingerprint = document.querySelector('.fingerprint-pattern');
    if (fingerprint) {
        fingerprint.addEventListener('click', function() {
            const secret = document.createElement('div');
            secret.textContent = 'THE TRUTH LIES IN THE NUMBERS...';
            secret.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: var(--font-typewriter);
                font-size: 1.5rem;
                color: var(--amber-glow);
                background: var(--black-primary);
                padding: 30px 50px;
                border: 3px solid var(--amber-glow);
                z-index: 10000;
                animation: fadeIn 0.5s ease;
                text-align: center;
                box-shadow: 0 0 50px rgba(212, 165, 116, 0.3);
            `;
            document.body.appendChild(secret);
            
            setTimeout(() => {
                secret.style.animation = 'fadeIn 0.5s ease reverse';
                setTimeout(() => {
                    if (secret.parentNode) secret.remove();
                }, 500);
            }, 3000);
        });
    }
    
    const caseTitle = document.querySelector('.case-title');
    if (caseTitle) {
        caseTitle.addEventListener('mouseenter', function() {
            this.style.textShadow = '3px 3px 0 var(--black-deep), 0 0 30px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 0, 0, 0.5)';
        });
        caseTitle.addEventListener('mouseleave', function() {
            this.style.textShadow = '3px 3px 0 var(--black-deep), 0 0 30px rgba(0, 0, 0, 0.8)';
        });
    }
    
    const statusActive = document.querySelector('.status-active');
    if (statusActive) {
        statusActive.addEventListener('mouseenter', function() {
            this.style.animation = 'status-blink 0.3s ease-in-out infinite';
        });
        statusActive.addEventListener('mouseleave', function() {
            this.style.animation = 'status-blink 2s ease-in-out infinite';
        });
    }
    
    const briefContent = document.querySelector('.brief-content');
    if (briefContent) {
        briefContent.addEventListener('dblclick', function() {
            const notification = document.createElement('div');
            notification.textContent = 'CLASSIFIED INFORMATION — HANDLE WITH CARE';
            notification.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                font-family: var(--font-typewriter);
                font-size: 0.8rem;
                color: var(--red-blood);
                background: var(--black-primary);
                padding: 15px 25px;
                border: 2px solid var(--red-blood);
                z-index: 10000;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            `;
            document.body.appendChild(notification);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateY(20px); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 3000);
        });
    }
});

/* ==============================================
UTILITY FUNCTIONS
============================================== */
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

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ==============================================
ADDITIONAL STYLES
============================================== */
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .case-section {
        min-height: 100vh;
    }
    
    .evidence-item {
        break-inside: avoid;
        page-break-inside: avoid;
    }
    
    .suspect-card {
        break-inside: avoid;
        page-break-inside: avoid;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .typewriter-cursor {
        animation: cursor-blink 0.8s infinite;
        color: var(--amber-glow);
    }
    
    @keyframes cursor-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    @keyframes pulse-glow {
        0%, 100% { text-shadow: 0 0 5px rgba(212, 165, 116, 0.3); }
        50% { text-shadow: 0 0 15px rgba(212, 165, 116, 0.6); }
    }
    
    .atmosphere-indicator:hover {
        opacity: 1 !important;
    }
`;
document.head.appendChild(additionalStyles);

/* ==============================================
INITIALIZATION COMPLETE
============================================== */
console.log('%c DETECTIVE BUREAU - CASE #2471 ', 'background: #1a1515; color: #d4a574; font-size: 14px; padding: 10px; border: 1px solid #d4a574;');
console.log('%c The Blackwood Conspiracy ', 'background: #8b0000; color: #f5f0ed; font-size: 12px; padding: 5px;');
console.log('%c All systems operational. Investigation ongoing.', 'color: #8a7a7a; font-style: italic;');