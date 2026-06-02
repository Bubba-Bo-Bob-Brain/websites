/* ============================================
   THE ARCANE CODEX - Interactive Scripts
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoadingScreen();
    initParticles();
    initCustomCursor();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initSpellBook();
    initInventoryInteractions();
    initQuestBoard();
});

/* ============================================
   LOADING SCREEN
   ============================================ */

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time (adjust as needed)
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 2000);
}

/* ============================================
   PARTICLE SYSTEM - Floating Dust & Embers
   ============================================ */

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Random starting position
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Random size (1-3px)
            this.size = Math.random() * 2 + 1;
            
            // Random velocity
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5 - 0.2; // Slight upward drift
            
            // Random color (golden dust or red embers)
            const isEmber = Math.random() > 0.7;
            if (isEmber) {
                this.color = `rgba(${180 + Math.random() * 75}, ${Math.random() * 50}, ${Math.random() * 25}, ${0.3 + Math.random() * 0.4})`;
                this.speedY -= 0.3; // Embers rise faster
            } else {
                this.color = `rgba(${200 + Math.random() * 55}, ${180 + Math.random() * 50}, ${100 + Math.random() * 50}, ${0.1 + Math.random() * 0.2})`;
            }
            
            // Random life span
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
            
            // Wobble effect
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = 0.02 + Math.random() * 0.03;
        }
        
        update() {
            // Update position with wobble
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.y += this.speedY;
            
            // Decrease life
            this.life--;
            
            // Reset if off screen or dead
            if (this.life <= 0 || 
                this.x < -10 || 
                this.x > canvas.width + 10 || 
                this.y < -10 || 
                this.y > canvas.height + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Add glow effect for embers
            if (this.color.includes('180,') || this.color.includes('200,')) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
            }
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth * 0.05));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(42, 24, 16, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Reset shadow for next frame
        ctx.shadowBlur = 0;
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Add mouse interaction - particles attracted to cursor
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Occasionally spawn new particle near cursor
        if (Math.random() > 0.9) {
            const newParticle = new Particle();
            newParticle.x = mouseX + (Math.random() - 0.5) * 50;
            newParticle.y = mouseY + (Math.random() - 0.5) * 50;
            newParticle.speedX = (Math.random() - 0.5) * 1;
            newParticle.speedY = (Math.random() - 0.5) * 1 - 0.5;
            particles.push(newParticle);
            
            // Remove oldest particle if too many
            if (particles.length > particleCount * 1.5) {
                particles.shift();
            }
        }
    });
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */

function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    
    // Only show custom cursor on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .inv-slot, .quest-notice, .character-card, .spell-category');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    } else {
        // Hide custom cursor on touch devices
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navigation
                const offsetTop = targetSection.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active navigation on scroll
    function updateActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[index].classList.add('active');
            }
        });
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateActiveNav();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initScrollAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for stat bars
                if (entry.target.classList.contains('character-card')) {
                    animateStatBars(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all pages and cards
    document.querySelectorAll('.page, .character-card, .quest-notice').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animated-in elements
    const style = document.createElement('style');
    style.textContent = `
        .page, .character-card, .quest-notice {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .page.animate-in, .character-card.animate-in, .quest-notice.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .character-card {
            transition-delay: 0.2s;
        }
        
        .quest-notice {
            transition-delay: calc(var(--notice-rotation) * 0.01s);
        }
    `;
    document.head.appendChild(style);
    
    // Animate stat bars when card comes into view
    function animateStatBars(card) {
        const statFills = card.querySelectorAll('.stat-fill');
        
        statFills.forEach((fill, index) => {
            // Reset width
            fill.style.width = '0%';
            
            // Animate with stagger
            setTimeout(() => {
                const targetWidth = fill.style.getPropertyValue('--fill-width');
                fill.style.width = targetWidth;
            }, 100 + (index * 100));
        });
    }
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-page');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = heroSection.querySelector('.hero-content');
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const start = 0;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(start + (target - start) * easeOutQuart);
                    
                    counter.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                        
                        // Add a subtle pulse effect when done
                        counter.style.animation = 'counterPulse 0.5s ease';
                    }
                }
                
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Add CSS for counter pulse
    const style = document.createElement('style');
    style.textContent = `
        @keyframes counterPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   SPELL BOOK INTERACTIONS
   ============================================ */

function initSpellBook() {
    const categories = document.querySelectorAll('.spell-category');
    const spellDetails = document.getElementById('spell-details');
    const prevBtn = document.getElementById('prev-spell');
    const nextBtn = document.getElementById('next-spell');
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');
    
    // Spell data organized by category
    const spellData = {
        evocation: [
            {
                name: "Fireball",
                level: "III",
                school: "Evocation",
                castingTime: "1 Action",
                range: "150 ft",
                duration: "Instant",
                components: "V, S, M",
                description: "A bright streak of fire launches from your pointing finger to a point you choose within range and explodes in a 20-foot radius sphere. Each creature makes a Dexterity save, taking 8d6 fire damage on a failed save, or half on success.",
                ritual: true
            },
            {
                name: "Lightning Bolt",
                level: "III",
                school: "Evocation",
                castingTime: "1 Action",
                range: "Self (100 ft line)",
                duration: "Instant",
                components: "V, S, M",
                description: "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line makes a Dexterity save, taking 8d6 lightning damage on a failed save."
            },
            {
                name: "Magic Missile",
                level: "I",
                school: "Evocation",
                castingTime: "1 Action",
                range: "120 ft",
                duration: "Instant",
                components: "V, S",
                description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage. The darts all strike simultaneously."
            }
        ],
        illusion: [
            {
                name: "Minor Illusion",
                level: "I",
                school: "Illusion",
                castingTime: "1 Action",
                range: "30 ft",
                duration: "1 minute",
                components: "S, M",
                description: "You create a sound or an image of an object within range that lasts for the duration. The image can't create sensory effects like taste, smell, or temperature. If a creature uses its action to examine the sound or image, it must make an Intelligence check to discern the illusion."
            },
            {
                name: "Mirror Image",
                level: "II",
                school: "Illusion",
                castingTime: "1 Action",
                range: "Self",
                duration: "1 minute",
                components: "V, S",
                description: "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, making it harder for enemies to target you."
            }
        ],
        transmutation: [
            {
                name: "Fly",
                level: "III",
                school: "Transmutation",
                castingTime: "1 Action",
                range: "Touch",
                duration: "10 minutes",
                components: "V, S, M",
                description: "You touch a willing creature. The target gains a flying speed of 60 feet for the duration."
            },
            {
                name: "Polymorph",
                level: "IV",
                school: "Transmutation",
                castingTime: "1 Action",
                range: "60 ft",
                duration: "1 hour",
                components: "V, S, M",
                description: "You transform a creature that you can see within range into a different creature. The new form can be any beast whose challenge rating is equal to or less than the target's level."
            }
        ],
        abjuration: [
            {
                name: "Shield",
                level: "I",
                school: "Abjuration",
                castingTime: "1 Reaction",
                range: "Self",
                duration: "1 round",
                components: "V, S",
                description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack."
            },
            {
                name: "Counterspell",
                level: "III",
                school: "Abjuration",
                castingTime: "1 Reaction",
                range: "60 ft",
                duration: "Instant",
                components: "S",
                description: "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, the spell fails. If it is casting a spell of 4th level or higher, make an ability check."
            }
        ],
        necromancy: [
            {
                name: "Animate Dead",
                level: "III",
                school: "Necromancy",
                castingTime: "1 minute",
                range: "10 ft",
                duration: "Instant",
                components: "V, S, M",
                description: "This spell creates an undead servant from a pile of bones or a corpse of a Small or Medium humanoid. The target becomes a skeleton or zombie under your command."
            }
        ],
        divination: [
            {
                name: "Detect Magic",
                level: "I",
                school: "Divination",
                castingTime: "1 Action",
                range: "Self",
                duration: "10 minutes",
                components: "V, S",
                description: "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic."
            },
            {
                name: "Scrying",
                level: "V",
                school: "Divination",
                castingTime: "10 minutes",
                range: "Self",
                duration: "10 minutes",
                components: "V, S, M",
                description: "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target."
            }
        ]
    };
    
    let currentCategory = 'evocation';
    let currentPage = 0;
    
    // Function to render spells for current category
    function renderSpells() {
        const spells = spellData[currentCategory];
        totalPagesEl.textContent = spells.length;
        
        // Clear existing spells
        spellDetails.innerHTML = '';
        
        // Create spell card for current page
        const spell = spells[currentPage];
        const spellCard = createSpellCard(spell);
        spellDetails.appendChild(spellCard);
        
        // Update page indicator
        currentPageEl.textContent = currentPage + 1;
        
        // Update button states
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === spells.length - 1;
    }
    
    // Function to create a spell card element
    function createSpellCard(spell) {
        const card = document.createElement('article');
        card.className = 'spell-card';
        
        card.innerHTML = `
            <div class="spell-header">
                <div class="spell-level-badge">${spell.level}</div>
                <h4 class="spell-name">${spell.name}</h4>
                <span class="spell-school">${spell.school}</span>
            </div>
            <div class="spell-meta">
                <span class="meta-item">
                    <span class="meta-label">Casting Time:</span>
                    <span class="meta-value">${spell.castingTime}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Range:</span>
                    <span class="meta-value">${spell.range}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Duration:</span>
                    <span class="meta-value">${spell.duration}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Components:</span>
                    <span class="meta-value">${spell.components}</span>
                </span>
            </div>
            <div class="spell-description">
                ${spell.description}
            </div>
            ${spell.ritual ? '<div class="spell-ritual">🔥 Can be cast as Ritual</div>' : ''}
        `;
        
        return card;
    }
    
    // Category click handlers
    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Update active category
            categories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Update current category and reset page
            currentCategory = category.dataset.category;
            currentPage = 0;
            
            // Render spells for new category
            renderSpells();
            
            // Add page turn animation
            animatePageTurn();
        });
    });
    
    // Page turn button handlers
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            renderSpells();
            animatePageTurn('prev');
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const spells = spellData[currentCategory];
        if (currentPage < spells.length - 1) {
            currentPage++;
            renderSpells();
            animatePageTurn('next');
        }
    });
    
    // Page turn animation
    function animatePageTurn(direction = 'next') {
        const rightPage = document.querySelector('.right-page');
        
        rightPage.style.transform = direction === 'next' ? 'rotateY(-10deg)' : 'rotateY(10deg)';
        rightPage.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            rightPage.style.transform = 'rotateY(0deg)';
        }, 300);
    }
    
    // Initialize with first category
    renderSpells();
    
    // Keyboard navigation for spell book
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.spellbook-page')) {
            if (e.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
                renderSpells();
                animatePageTurn('prev');
            } else if (e.key === 'ArrowRight') {
                const spells = spellData[currentCategory];
                if (currentPage < spells.length - 1) {
                    currentPage++;
                    renderSpells();
                    animatePageTurn('next');
                }
            }
        }
    });
}

/* ============================================
   INVENTORY INTERACTIONS
   ============================================ */

function initInventoryInteractions() {
    const slots = document.querySelectorAll('.inv-slot:not(.empty)');
    
    slots.forEach(slot => {
        // Click to equip/unequip
        slot.addEventListener('click', () => {
            slot.classList.toggle('equipped');
            
            // Add equip animation
            if (slot.classList.contains('equipped')) {
                slot.style.animation = 'equipPulse 0.5s ease';
                setTimeout(() => {
                    slot.style.animation = '';
                }, 500);
            }
        });
        
        // Right-click for context menu (simplified)
        slot.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Create simple context menu
            const menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.innerHTML = `
                <button class="menu-item">Use Item</button>
                <button class="menu-item">Drop Item</button>
                <button class="menu-item">Inspect</button>
            `;
            
            // Position menu
            menu.style.position = 'fixed';
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            menu.style.zIndex = '1000';
            
            // Add to document
            document.body.appendChild(menu);
            
            // Style the menu
            const style = document.createElement('style');
            style.textContent = `
                .context-menu {
                    background: linear-gradient(180deg, var(--leather-mid), var(--leather-dark));
                    border: 2px solid var(--gold-dark);
                    border-radius: 6px;
                    padding: 5px 0;
                    min-width: 150px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    animation: menuFadeIn 0.2s ease;
                }
                
                .menu-item {
                    display: block;
                    width: 100%;
                    padding: 8px 15px;
                    background: transparent;
                    border: none;
                    color: var(--gold-mid);
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    text-align: left;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .menu-item:hover {
                    background: rgba(255,215,0,0.1);
                }
                
                @keyframes menuFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
            
            // Remove menu when clicking elsewhere
            const removeMenu = () => {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            };
            
            document.addEventListener('click', removeMenu);
        });
    });
    
    // Add CSS for equip animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes equipPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255,215,0,0.5); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   QUEST BOARD INTERACTIONS
   ============================================ */

function initQuestBoard() {
    const notices = document.querySelectorAll('.quest-notice');
    
    notices.forEach(notice => {
        // Make notices draggable (simplified)
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        notice.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('notice-pin')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = notice.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            notice.style.zIndex = '30';
            notice.style.transition = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            notice.style.left = `${initialX + dx}px`;
            notice.style.top = `${initialY + dy}px`;
            notice.style.transform = 'rotate(0deg) scale(1.05)';
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            notice.style.zIndex = '';
            notice.style.transition = 'all 0.3s ease';
            
            // Return to original position with animation
            setTimeout(() => {
                notice.style.left = '';
                notice.style.top = '';
                notice.style.transform = `rotate(var(--notice-rotation))`;
            }, 100);
        });
        
        // Pin click to "accept" quest
        const pin = notice.querySelector('.notice-pin');
        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Visual feedback
            pin.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                pin.style.transform = 'translateX(-50%)';
            }, 200);
            
            // Show quest accepted message
            showQuestAccepted(notice.querySelector('.quest-title').textContent);
        });
    });
    
    // Function to show quest accepted notification
    function showQuestAccepted(questName) {
        const notification = document.createElement('div');
        notification.className = 'quest-notification';
        notification.innerHTML = `
            <div class="notification-icon">📜</div>
            <div class="notification-content">
                <div class="notification-title">Quest Accepted!</div>
                <div class="notification-quest">${questName}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Style the notification
        const style = document.createElement('style');
        style.textContent = `
            .quest-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--parchment-mid), var(--parchment-dark));
                border: 2px solid var(--gold-mid);
                border-radius: 8px;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: slideInRight 0.5s ease;
            }
            
            .notification-icon {
                font-size: 2rem;
            }
            
            .notification-title {
                font-family: var(--font-heading);
                font-size: 1.1rem;
                color: var(--leather-dark);
                margin-bottom: 5px;
            }
            
            .notification-quest {
                font-family: var(--font-body);
                font-size: 0.9rem;
                color: var(--ink-faded);
                font-style: italic;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function for performance
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

// Throttle function for scroll events
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
   ADDITIONAL EFFECTS
   ============================================ */

// Add some ambient sound effects (optional, commented out by default)
/*
function initAmbientSound() {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Simple ambient sound generator
    function createAmbientSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(110, audioCtx.currentTime); // Low A note
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        
        // Fade in and out
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 10);
        
        // Stop after fade
        setTimeout(() => {
            oscillator.stop();
        }, 10000);
    }
    
    // Play ambient sound every 30-60 seconds
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            createAmbientSound();
        }
    }, 30000 + Math.random() * 30000);
}
*/

// Easter egg: Konami code for special effect
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    
    // Keep only last 10 keys
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    // Check for Konami code
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Create a burst of magical particles
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const x = canvas.width / 2 + (Math.random() - 0.5) * 200;
            const y = canvas.height / 2 + (Math.random() - 0.5) * 200;
            
            // Create magical burst
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 5 + 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${Math.random() * 60 + 30}, 100%, 70%)`;
            ctx.fill();
            
            // Add glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${Math.random() * 60 + 30}, 100%, 70%)`;
        }, i * 10);
    }
    
    // Reset shadow
    setTimeout(() => {
        ctx.shadowBlur = 0;
    }, 1000);
    
    // Show easter egg message
    const message = document.createElement('div');
    message.textContent = '✨ Arcane Mastery Unlocked! ✨';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--font-display);
        font-size: 2rem;
        color: var(--gold-bright);
        text-shadow: 0 0 20px var(--gold-mid);
        z-index: 10000;
        animation: easterEggFade 3s ease forwards;
    `;
    
    document.body.appendChild(message);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes easterEggFade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after animation
    setTimeout(() => {
        message.remove();
    }, 3000);
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */

// Use requestAnimationFrame for smooth animations
function smoothScrollTo(element, targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeInOutCubic = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + (targetPosition - startPosition) * easeInOutCubic);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Lazy load images (if any were added)
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Clean up event listeners when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause heavy animations
        document.getElementById('particles-canvas').style.display = 'none';
    } else {
        // Page is visible again
        document.getElementById('particles-canvas').style.display = 'block';
    }
});

// Initialize lazy loading if needed
initLazyLoading();

/* ============================================
   EXPORT FOR TESTING (if using modules)
   ============================================ */

// For module systems, you could export functions
// export { initLoadingScreen, initParticles, etc. };