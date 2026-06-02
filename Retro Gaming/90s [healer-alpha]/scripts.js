// ============================================
// RETRO REALM - Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initGlitchEffects();
    initMascotInteractions();
    initKonamiCode();
    initCheatCodeInput();
    initStatCounters();
    initCartridgeFilters();
    initScoreForm();
    initGuestbook();
    initScrollAnimations();
    initVisitorCounter();
    initVHSEffects();
    initSmoothScroll();
    initTerminalTyping();
    initMoodSelector();
    initNavHighlight();
});

// === GLITCH EFFECTS ===
function initGlitchEffects() {
    // Random glitch effect on logo
    const logoText = document.querySelector('.logo-text');
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            logoText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            logoText.style.textShadow = `
                ${Math.random() * 4 - 2}px 0 var(--neon-cyan),
                ${Math.random() * 4 - 2}px 0 var(--neon-pink)
            `;
            
            setTimeout(() => {
                logoText.style.transform = '';
                logoText.style.textShadow = '';
            }, 100);
        }
    }, 2000);
    
    // Random screen flicker
    setInterval(() => {
        if (Math.random() > 0.98) {
            document.body.style.opacity = '0.95';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }
    }, 500);
}

// === MASCOT INTERACTIONS ===
function initMascotInteractions() {
    const mascot = document.getElementById('byteMascot');
    const speechBubble = document.getElementById('mascotSpeech');
    const speeches = [
        "INSERT COIN!",
        "PRESS START!",
        "GAME ON!",
        "1UP!",
        "LEVEL UP!",
        "HIGH SCORE!",
        "PLAYER 1",
        "READY?",
        "COMBO!",
        "SECRET!",
        "IDDQD?",
        "KONAMI?",
        "GG!",
        "BRB!",
        "LOL!",
        "WOW!"
    ];
    
    let clickCount = 0;
    
    mascot.addEventListener('click', () => {
        clickCount++;
        
        // Change speech bubble
        const randomSpeech = speeches[Math.floor(Math.random() * speeches.length)];
        speechBubble.textContent = randomSpeech;
        speechBubble.style.opacity = '1';
        speechBubble.style.transform = 'translateY(0) scale(1)';
        
        // Animate mascot
        mascot.style.transform = 'scale(1.2)';
        setTimeout(() => {
            mascot.style.transform = '';
        }, 300);
        
        // Easter egg: After 10 clicks
        if (clickCount >= 10) {
            speechBubble.textContent = "YOU FOUND ME!";
            speechBubble.style.color = 'var(--neon-yellow)';
            
            // Create confetti effect
            createConfetti();
            
            setTimeout(() => {
                speechBubble.style.color = '';
                clickCount = 0;
            }, 3000);
        }
        
        // Hide speech bubble after 3 seconds
        setTimeout(() => {
            if (!mascot.matches(':hover')) {
                speechBubble.style.opacity = '0';
                speechBubble.style.transform = 'translateY(10px) scale(0.9)';
            }
        }, 3000);
    });
    
    // Random mascot movements
    setInterval(() => {
        if (Math.random() > 0.9) {
            const container = mascot.querySelector('.mascot-container');
            container.style.animation = 'none';
            container.offsetHeight; // Trigger reflow
            container.style.animation = 'mascotBounce 1s ease-in-out infinite';
        }
    }, 5000);
}

function createConfetti() {
    const colors = ['var(--neon-green)', 'var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-yellow)'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 100%;
            left: ${Math.random() * 100}vw;
            opacity: 0;
            z-index: 10003;
            pointer-events: none;
            animation: confettiFall ${Math.random() * 3 + 2}s ease-out forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Add confetti animation if not exists
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                0% { 
                    transform: translateY(0) rotate(0deg); 
                    opacity: 1;
                }
                100% { 
                    transform: translateY(-100vh) rotate(720deg); 
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// === KONAMI CODE EASTER EGG ===
function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 
        'ArrowDown', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 
        'ArrowLeft', 'ArrowRight', 
        'KeyB', 'KeyA', 
        'Enter'
    ];
    
    let konamiIndex = 0;
    let konamiActivated = false;
    
    document.addEventListener('keydown', (e) => {
        if (konamiActivated) return;
        
        const key = e.code;
        
        if (key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // Show progress
            if (konamiIndex > 0) {
                showToast(`KONAMI: ${konamiIndex}/${konamiCode.length}`);
            }
            
            if (konamiIndex === konamiCode.length) {
                activateKonamiCode();
                konamiActivated = true;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateKonamiCode() {
        const overlay = document.getElementById('konamiOverlay');
        overlay.classList.add('active');
        
        // Play sound effect (visual feedback since we can't use audio)
        document.body.style.animation = 'konamiFlash 0.5s ease';
        
        // Add flash animation
        if (!document.getElementById('konamiFlashStyle')) {
            const style = document.createElement('style');
            style.id = 'konamiFlashStyle';
            style.textContent = `
                @keyframes konamiFlash {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close button
        document.getElementById('konamiClose').addEventListener('click', () => {
            overlay.classList.remove('active');
            konamiActivated = false;
            konamiIndex = 0;
        });
    }
}

// === CHEAT CODE INPUT ===
function initCheatCodeInput() {
    const cheatWrapper = document.getElementById('cheatInputWrapper');
    const cheatInput = document.getElementById('cheatInput');
    
    // Show cheat input when pressing tilde key
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Backquote') {
            cheatWrapper.classList.toggle('active');
            if (cheatWrapper.classList.contains('active')) {
                cheatInput.focus();
            }
        }
        
        // Close on Escape
        if (e.code === 'Escape' && cheatWrapper.classList.contains('active')) {
            cheatWrapper.classList.remove('active');
        }
    });
    
    // Handle cheat code submission
    cheatInput.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            const code = cheatInput.value.toUpperCase().trim();
            processCheatCode(code);
            cheatInput.value = '';
            cheatWrapper.classList.remove('active');
        }
    });
    
    // Cheat codes database
    function processCheatCode(code) {
        const cheatCodes = {
            'IDDQD': () => {
                showToast('GOD MODE ACTIVATED!');
                document.body.style.filter = 'hue-rotate(90deg)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 3000);
            },
            'IDKFA': () => {
                showToast('ALL WEAPONS UNLOCKED!');
                // Flash the cartridge section
                const collection = document.getElementById('collection');
                collection.style.animation = 'cheatFlash 1s ease';
                setTimeout(() => {
                    collection.style.animation = '';
                }, 1000);
            },
            'SHOWME': () => {
                showToast('MAP REVEALED!');
                // Reveal all hidden elements
                document.querySelectorAll('.card-glow').forEach(glow => {
                    glow.style.opacity = '1';
                    setTimeout(() => {
                        glow.style.opacity = '';
                    }, 2000);
                });
            },
            'POWER': () => {
                showToast('INFINITE POWER!');
                // Speed up all animations
                document.documentElement.style.setProperty('--animation-speed', '0.5x');
                setTimeout(() => {
                    document.documentElement.style.setProperty('--animation-speed', '');
                }, 5000);
            },
            'RETRO': () => {
                showToast('RETRO MODE!');
                // Add vintage filter
                document.body.style.filter = 'sepia(1) contrast(1.2)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 3000);
            }
        };
        
        if (cheatCodes[code]) {
            cheatCodes[code]();
            
            // Add cheat flash animation
            if (!document.getElementById('cheatFlashStyle')) {
                const style = document.createElement('style');
                style.id = 'cheatFlashStyle';
                style.textContent = `
                    @keyframes cheatFlash {
                        0%, 100% { background-color: transparent; }
                        50% { background-color: rgba(51, 255, 51, 0.1); }
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            showToast(`UNKNOWN CODE: ${code}`);
        }
    }
}

// === STAT COUNTERS ===
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                
                const updateCount = () => {
                    const count = parseInt(counter.innerText.replace(/,/g, ''));
                    const increment = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment).toLocaleString();
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// === CARTRIDGE FILTERS ===
function initCartridgeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const cartridges = document.querySelectorAll('.cartridge-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            // Filter cartridges with animation
            cartridges.forEach(cartridge => {
                const platform = cartridge.getAttribute('data-platform');
                
                if (filter === 'all' || platform === filter) {
                    cartridge.style.display = '';
                    cartridge.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    cartridge.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        cartridge.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add fade animations
    if (!document.getElementById('fadeStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeStyle';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Cartridge hover effects
    cartridges.forEach(cartridge => {
        cartridge.addEventListener('mouseenter', () => {
            const glow = cartridge.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });
        
        cartridge.addEventListener('mouseleave', () => {
            const glow = cartridge.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '';
            }
        });
    });
}

// === SCORE FORM ===
function initScoreForm() {
    const form = document.getElementById('scoreForm');
    const scoresBody = document.getElementById('scoresBody');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const initials = document.getElementById('playerInitials').value.toUpperCase();
        const game = document.getElementById('gameSelect').value;
        const score = parseInt(document.getElementById('playerScore').value);
        
        if (!initials || !game || !score) {
            showToast('PLEASE FILL ALL FIELDS!');
            return;
        }
        
        // Format score with commas
        const formattedScore = score.toLocaleString();
        
        // Get today's date
        const today = new Date();
        const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}.${today.getFullYear()}`;
        
        // Create new row
        const newRow = document.createElement('tr');
        newRow.className = 'score-row';
        newRow.innerHTML = `
            <td class="col-rank">NEW</td>
            <td class="col-name"><span class="player-name">${initials}</span></td>
            <td class="col-game">${game}</td>
            <td class="col-score">${formattedScore}</td>
            <td class="col-date">${dateStr}</td>
        `;
        
        // Insert at appropriate position
        const rows = Array.from(scoresBody.querySelectorAll('.score-row'));
        let inserted = false;
        
        for (let i = 0; i < rows.length; i++) {
            const existingScore = parseInt(rows[i].querySelector('.col-score').textContent.replace(/,/g, ''));
            
            if (score > existingScore) {
                scoresBody.insertBefore(newRow, rows[i]);
                inserted = true;
                break;
            }
        }
        
        if (!inserted) {
            scoresBody.appendChild(newRow);
        }
        
        // Animate the new row
        newRow.style.animation = 'scoreAdd 1s ease';
        
        // Clear form
        form.reset();
        
        showToast('SCORE SUBMITTED!');
        
        // Update the "YOU???" row
        const youRow = Array.from(scoresBody.querySelectorAll('.score-row'))
            .find(row => row.querySelector('.col-name').textContent.includes('YOU???'));
        
        if (youRow) {
            youRow.querySelector('.col-game').textContent = '???';
            youRow.querySelector('.col-score').textContent = '---';
            youRow.querySelector('.col-date').textContent = '????.??.??';
        }
    });
    
    // Add score animation
    if (!document.getElementById('scoreStyle')) {
        const style = document.createElement('style');
        style.id = 'scoreStyle';
        style.textContent = `
            @keyframes scoreAdd {
                0% { background-color: var(--neon-green); transform: scale(1.05); }
                100% { background-color: transparent; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Input formatting
    const initialsInput = document.getElementById('playerInitials');
    initialsInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    });
    
    const scoreInput = document.getElementById('playerScore');
    scoreInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// === GUESTBOOK ===
function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const entriesContainer = document.getElementById('guestbookEntries');
    let selectedMood = 'ツ Awesome';
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('guestName').value.trim();
        const message = document.getElementById('guestMessage').value.trim();
        
        if (!name || !message) {
            showToast('PLEASE FILL ALL FIELDS!');
            return;
        }
        
        // Format date
        const today = new Date();
        const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
        
        // Create new entry
        const newEntry = document.createElement('div');
        newEntry.className = 'guestbook-entry';
        newEntry.innerHTML = `
            <div class="entry-header">
                <span class="entry-author">★ ${name.toUpperCase()}</span>
                <span class="entry-date">${dateStr}</span>
            </div>
            <p class="entry-message">${escapeHtml(message)}</p>
            <div class="entry-footer">
                <span class="entry-mood">Mood: ${selectedMood}</span>
            </div>
        `;
        
        // Add to top of entries
        entriesContainer.insertBefore(newEntry, entriesContainer.firstChild);
        
        // Animate entry
        newEntry.style.animation = 'entrySlide 0.5s ease';
        
        // Clear form
        form.reset();
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mood') === 'ツ Awesome') {
                btn.classList.add('active');
            }
        });
        
        showToast('GUESTBOOK SIGNED!');
    });
    
    // Mood selector
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMood = btn.getAttribute('data-mood');
        });
    });
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Add entry animation
    if (!document.getElementById('entryStyle')) {
        const style = document.createElement('style');
        style.id = 'entryStyle';
        style.textContent = `
            @keyframes entrySlide {
                from { 
                    opacity: 0; 
                    transform: translateY(-20px);
                    background-color: var(--neon-green);
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0);
                    background-color: transparent;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animation for terminal lines
                if (entry.target.classList.contains('about-terminal')) {
                    const lines = entry.target.querySelectorAll('.terminal-line');
                    lines.forEach((line, index) => {
                        line.style.animationDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.section-header, .cartridge-card, .score-row, .guestbook-entry, .about-terminal, .badge-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// === VISITOR COUNTER ===
function initVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    
    // Simulate visitor count (in real site, this would be server-side)
    let count = localStorage.getItem('retroRealmVisitorCount');
    
    if (!count) {
        count = Math.floor(Math.random() * 10000) + 1000;
        localStorage.setItem('retroRealmVisitorCount', count);
    } else {
        count = parseInt(count) + 1;
        localStorage.setItem('retroRealmVisitorCount', count);
    }
    
    // Animate counter
    let current = 0;
    const increment = Math.ceil(count / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= count) {
            current = count;
            clearInterval(timer);
        }
        counterElement.textContent = String(current).padStart(6, '0');
    }, 30);
}

// === VHS EFFECTS ===
function initVHSEffects() {
    const vhsTracking = document.getElementById('vhsTracking');
    
    // Random VHS tracking effect
    setInterval(() => {
        if (Math.random() > 0.97) {
            vhsTracking.style.opacity = '1';
            vhsTracking.style.transform = `translateY(${Math.random() * 100}%)`;
            
            setTimeout(() => {
                vhsTracking.style.opacity = '0';
                vhsTracking.style.transform = 'translateY(-100%)';
            }, 500);
        }
    }, 3000);
    
    // VHS noise effect on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (Math.abs(scrollTop - lastScrollTop) > 50) {
            vhsTracking.style.opacity = '0.3';
            vhsTracking.style.transform = `translateY(${(scrollTop % 100)}%)`;
            
            setTimeout(() => {
                vhsTracking.style.opacity = '0';
            }, 100);
        }
        
        lastScrollTop = scrollTop;
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// === TERMINAL TYPING EFFECT ===
function initTerminalTyping() {
    const terminal = document.querySelector('.about-terminal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = terminal.querySelectorAll('.terminal-line');
                lines.forEach((line, index) => {
                    line.style.animationDelay = `${index * 0.15}s`;
                });
                observer.unobserve(terminal);
            }
        });
    }, { threshold: 0.3 });
    
    if (terminal) {
        observer.observe(terminal);
    }
}

// === MOOD SELECTOR ===
function initMoodSelector() {
    // Already handled in initGuestbook
}

// === NAV HIGHLIGHT ===
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// === TOAST NOTIFICATION ===
function showToast(message) {
    const toast = document.getElementById('cheatToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// === UTILITY FUNCTIONS ===
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent elements
}, 250));

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            el.style.opacity = '0';
        });
    }, 100);
    
    // Add fadeInUp animation
    if (!document.getElementById('loadStyle')) {
        const style = document.createElement('style');
        style.id = 'loadStyle';
        style.textContent = `
            @keyframes fadeInUp {
                from { 
                    opacity: 0; 
                    transform: translateY(30px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            body:not(.loaded) .hero-content > * {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }
});