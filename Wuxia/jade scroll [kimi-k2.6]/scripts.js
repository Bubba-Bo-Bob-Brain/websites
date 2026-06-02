// ============================================
// HEAVENLY SWORD CODEX — WUXIA SCROLL SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollUnroll();
    initSealNavigation();
    initParallaxBackgrounds();
    initFloatingPetals();
    initAmbientQi();
    initSkillTreeAnimations();
    initMeridianCanvas();
    initMeridianInteraction();
    initLoreAccordion();
    initScrollReveal();
    initTechniqueCardAnimations();
});

// ============================================
// SCROLL UNROLL ANIMATION
// ============================================

function initScrollUnroll() {
    const scrollContainer = document.getElementById('scrollContainer');
    if (!scrollContainer) return;
    
    // Add subtle vibration after unroll completes
    setTimeout(() => {
        scrollContainer.style.animation = 'settleScroll 0.5s ease-out';
    }, 2000);
    
    // Custom keyframe for settling effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes settleScroll {
            0% { transform: translateY(-2px); }
            50% { transform: translateY(1px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// SEAL NAVIGATION
// ============================================

function initSealNavigation() {
    const navSeals = document.querySelectorAll('.nav-seal');
    const sections = document.querySelectorAll('.content-section');
    
    // Active state management
    navSeals.forEach(seal => {
        seal.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = seal.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active states
                navSeals.forEach(s => s.classList.remove('active'));
                seal.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Add pulse effect to seal
                seal.querySelector('.seal-stamp').style.animation = 'none';
                setTimeout(() => {
                    seal.querySelector('.seal-stamp').style.animation = '';
                }, 10);
            }
        });
    });
    
    // Update active seal based on scroll position
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navSeals.forEach(seal => {
                    seal.classList.remove('active');
                    if (seal.getAttribute('href') === `#${sectionId}`) {
                        seal.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ============================================
// PARALLAX BACKGROUNDS
// ============================================

function initParallaxBackgrounds() {
    const bambooLayer = document.getElementById('bambooLayer');
    const cloudLayer = document.getElementById('cloudLayer');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const scrollHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = scrollY / scrollHeight;
                
                if (bambooLayer) {
                    bambooLayer.style.transform = `translateY(${scrollY * 0.15}px) skewX(${Math.sin(scrollY * 0.01) * 0.5}deg)`;
                }
                
                if (cloudLayer) {
                    cloudLayer.style.transform = `translateX(${-scrollPercent * 30}%)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// FLOATING PETALS
// ============================================

function initFloatingPetals() {
    const container = document.getElementById('floatingPetals');
    if (!container) return;
    
    const petalCount = 15;
    const petalColors = ['#e8d0d0', '#f0e0d0', '#e0d8e8', '#f5e8e0'];
    
    for (let i = 0; i < petalCount; i++) {
        createPetal(container, petalColors, i);
    }
}

function createPetal(container, colors, index) {
    const petal = document.createElement('div');
    const size = Math.random() * 10 + 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    petal.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * 0.8}px;
        background: ${color};
        border-radius: 50% 0 50% 0;
        opacity: 0.6;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: -20px;
    `;
    
    container.appendChild(petal);
    
    // Animate petal
    animatePetal(petal, index);
}

function animatePetal(petal, index) {
    const duration = Math.random() * 8000 + 10000;
    const delay = index * 800 + Math.random() * 2000;
    const swayAmount = Math.random() * 60 + 30;
    
    setTimeout(() => {
        let startTime = null;
        const startX = parseFloat(petal.style.left);
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;
            
            if (progress >= 1) {
                petal.remove();
                return;
            }
            
            const y = progress * (window.innerHeight + 100);
            const x = startX + Math.sin(progress * Math.PI * 4) * swayAmount;
            const rotation = progress * 720;
            const opacity = Math.sin(progress * Math.PI) * 0.6;
            
            petal.style.transform = `translate(${x}%, ${y}px) rotate(${rotation}deg)`;
            petal.style.opacity = opacity;
            
            requestAnimationFrame(step);
        }
        
        requestAnimationFrame(step);
    }, delay);
}

// ============================================
// AMBIENT QI PARTICLES
// ============================================

function initAmbientQi() {
    const container = document.getElementById('ambientQi');
    if (!container) return;
    
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        createQiParticle(container, i);
    }
}

function createQiParticle(container, index) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(201,168,76,0.6), transparent);
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
    `;
    
    container.appendChild(particle);
    
    // Animate with CSS animation for performance
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 4;
    
    particle.style.animation = `qiFloat ${duration}s ease-in-out ${delay}s infinite`;
    
    // Add keyframe if not exists
    if (!document.getElementById('qiKeyframes')) {
        const style = document.createElement('style');
        style.id = 'qiKeyframes';
        style.textContent = `
            @keyframes qiFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                25% { transform: translate(20px, -30px) scale(1.2); opacity: 0.6; }
                50% { transform: translate(-10px, -50px) scale(0.8); opacity: 0.4; }
                75% { transform: translate(15px, -20px) scale(1.1); opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// SKILL TREE ANIMATIONS
// ============================================

function initSkillTreeAnimations() {
    const skillTree = document.getElementById('skillTree');
    if (!skillTree) return;
    
    const nodes = skillTree.querySelectorAll('.skill-node');
    const branches = skillTree.querySelectorAll('.ink-branch');
    
    // Animate nodes on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate branches first
                branches.forEach((branch, i) => {
                    setTimeout(() => {
                        branch.style.animation = 'inkDraw 1.5s ease-out forwards';
                    }, i * 200);
                });
                
                // Then animate nodes
                nodes.forEach((node, i) => {
                    setTimeout(() => {
                        node.style.opacity = '0';
                        node.style.transform = 'translate(-50%, -50%) scale(0)';
                        node.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        
                        setTimeout(() => {
                            node.style.opacity = '1';
                            node.style.transform = 'translate(-50%, -50%) scale(1)';
                        }, 50);
                    }, 800 + i * 150);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillTree);
    
    // Node interaction
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            nodes.forEach(n => {
                if (n !== node) {
                    n.style.opacity = '0.4';
                }
            });
            highlightConnectedBranches(node.dataset.node);
        });
        
        node.addEventListener('mouseleave', () => {
            nodes.forEach(n => {
                n.style.opacity = '1';
            });
            resetBranchHighlights();
        });
    });
}

function highlightConnectedBranches(nodeId) {
    // Simple connection logic - could be expanded
    const branches = document.querySelectorAll('.ink-branch');
    branches.forEach(branch => {
        branch.style.stroke = '#b22222';
        branch.style.filter = 'url(#inkBlur) drop-shadow(0 0 4px rgba(178,34,34,0.5))';
    });
}

function resetBranchHighlights() {
    const branches = document.querySelectorAll('.ink-branch');
    branches.forEach(branch => {
        branch.style.stroke = '#2a1810';
        branch.style.filter = 'url(#inkBlur)';
    });
}

// ============================================
// MERIDIAN CANVAS
// ============================================

function initMeridianCanvas() {
    const canvas = document.getElementById('meridianCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    // Meridian data points (normalized 0-1)
    const meridians = [
        { name: 'governor', x: 0.5, y: 0.1, type: 'yang' },
        { name: 'conception', x: 0.5, y: 0.3, type: 'yin' },
        { name: 'heart', x: 0.45, y: 0.45, type: 'fire' },
        { name: 'lung', x: 0.55, y: 0.42, type: 'metal' },
        { name: 'liver', x: 0.4, y: 0.55, type: 'wood' },
        { name: 'kidney', x: 0.6, y: 0.58, type: 'water' },
        { name: 'spleen', x: 0.5, y: 0.65, type: 'earth' },
        { name: 'dantian', x: 0.5, y: 0.78, type: 'core' }
    ];
    
    // Connections
    const connections = [
        ['governor', 'conception'],
        ['conception', 'heart'],
        ['conception', 'lung'],
        ['heart', 'liver'],
        ['lung', 'liver'],
        ['lung', 'kidney'],
        ['liver', 'spleen'],
        ['kidney', 'spleen'],
        ['spleen', 'dantian'],
        ['heart', 'dantian'],
        ['kidney', 'dantian']
    ];
    
    function draw() {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw subtle body outline
        drawBodyOutline(ctx, width, height);
        
        // Draw connections with qi flow
        connections.forEach(([from, to], index) => {
            const fromPoint = meridians.find(m => m.name === from);
            const toPoint = meridians.find(m => m.name === to);
            
            if (fromPoint && toPoint) {
                drawQiFlow(ctx, fromPoint, toPoint, width, height, time, index);
            }
        });
        
        // Draw meridian points
        meridians.forEach(m => {
            drawMeridianPoint(ctx, m, width, height, time);
        });
        
        time += 0.02;
        animationId = requestAnimationFrame(draw);
    }
    
    function drawBodyOutline(ctx, width, height) {
        ctx.save();
        ctx.strokeStyle = 'rgba(42, 24, 16, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        
        // Subtle vertical axis
        ctx.beginPath();
        ctx.moveTo(width / 2, height * 0.05);
        ctx.lineTo(width / 2, height * 0.95);
        ctx.stroke();
        
        ctx.restore();
    }
    
    function drawQiFlow(ctx, from, to, width, height, t, index) {
        const fromX = from.x * width;
        const fromY = from.y * height;
        const toX = to.x * width;
        const toY = to.y * height;
        
        // Main connection line
        ctx.save();
        ctx.strokeStyle = 'rgba(42, 24, 16, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        // Qi flow particles
        const flowOffset = (t * 0.5 + index * 0.3) % 1;
        const particleX = fromX + (toX - fromX) * flowOffset;
        const particleY = fromY + (toY - fromY) * flowOffset;
        
        const gradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 8);
        gradient.addColorStop(0, 'rgba(201, 168, 76, 0.8)');
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawMeridianPoint(ctx, meridian, width, height, t) {
        const x = meridian.x * width;
        const y = meridian.y * height;
        const pulseSize = Math.sin(t * 2 + meridian.x * 10) * 2 + 4;
        
        ctx.save();
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize + 8);
        gradient.addColorStop(0, 'rgba(178, 34, 34, 0.3)');
        gradient.addColorStop(1, 'rgba(178, 34, 34, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize + 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Center point
        ctx.fillStyle = '#b22222';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    draw();
    
    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            draw();
        }
    });
}

// ============================================
// MERIDIAN INTERACTION
// ============================================

function initMeridianInteraction() {
    const points = document.querySelectorAll('.meridian-point');
    const infoDefault = document.querySelector('.info-default');
    const infoDetail = document.getElementById('infoDetail');
    const detailName = document.getElementById('detailName');
    const detailDesc = document.getElementById('detailDesc');
    const detailEffects = document.getElementById('detailEffects');
    
    const meridianData = {
        'governor': {
            name: 'Governor Vessel',
            desc: 'The sea of yang meridians. Controls all yang energy in the body, governing strength, vitality, and external martial power.',
            effects: ['Strength +15%', 'Yang Qi Surge', 'Battle Fury']
        },
        'conception': {
            name: 'Conception Vessel',
            desc: 'The sea of yin meridians. Nurtures internal energy, spiritual cultivation, and regenerative abilities.',
            effects: ['Recovery +20%', 'Yin Harmony', 'Spirit Shield']
        },
        'heart': {
            name: 'Heart Meridian',
            desc: 'The sovereign of all organs. Governs blood, spirit, and the clarity of mind necessary for martial mastery.',
            effects: ['Focus +25%', 'Blood Flow', 'Iron Will']
        },
        'lung': {
            name: 'Lung Meridian',
            desc: 'Master of qi and breath control. Essential for internal energy techniques and sustained combat.',
            effects: ['Breath Control', 'Qi Capacity +10%', 'Poison Resistance']
        },
        'liver': {
            name: 'Liver Meridian',
            desc: 'Stores blood and governs tendons. Provides the flexibility and explosive power for advanced techniques.',
            effects: ['Flexibility +20%', 'Tendon Strength', 'Swift Reflexes']
        },
        'kidney': {
            name: 'Kidney Meridian',
            desc: 'The root of pre-heaven essence. Stores jing and governs bone marrow, the foundation of deep cultivation.',
            effects: ['Essence +15%', 'Bone Density', 'Longevity']
        },
        'spleen': {
            name: 'Spleen Meridian',
            desc: 'Transforms food and drink into qi and blood. The root of post-heaven nourishment.',
            effects: ['Stamina +20%', 'Qi Regeneration', 'Earth Roots']
        },
        'dantian': {
            name: 'Lower Dantian',
            desc: 'The elixir field where qi is gathered, refined, and stored. The furnace of all cultivation.',
            effects: ['Qi Storage +30%', 'Core Stability', 'Ascension Gate']
        }
    };
    
    points.forEach(point => {
        point.addEventListener('mouseenter', () => {
            const meridian = point.dataset.meridian;
            const data = meridianData[meridian];
            
            if (data && infoDefault && infoDetail) {
                infoDefault.style.display = 'none';
                infoDetail.classList.add('active');
                
                detailName.textContent = data.name;
                detailDesc.textContent = data.desc;
                detailEffects.innerHTML = data.effects
                    .map(effect => `<span class="effect-tag">${effect}</span>`)
                    .join('');
            }
        });
    });
    
    // Reset when leaving meridian area
    const canvasContainer = document.querySelector('.meridian-canvas-container');
    if (canvasContainer) {
        canvasContainer.addEventListener('mouseleave', () => {
            if (infoDefault && infoDetail) {
                infoDefault.style.display = '';
                infoDetail.classList.remove('active');
            }
        });
    }
}

// ============================================
// LORE ACCORDION
// ============================================

function initLoreAccordion() {
    const items = document.querySelectorAll('.lore-item');
    
    items.forEach(item => {
        const header = item.querySelector('.lore-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            items.forEach(i => {
                i.classList.remove('active');
                const toggle = i.querySelector('.lore-toggle');
                if (toggle) toggle.style.transform = '';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const toggle = item.querySelector('.lore-toggle');
                if (toggle) toggle.style.transform = 'rotate(180deg)';
                
                // Animate content reveal with ink spread effect
                const content = item.querySelector('.lore-content');
                if (content) {
                    content.style.opacity = '0';
                    setTimeout(() => {
                        content.style.transition = 'opacity 0.6s ease';
                        content.style.opacity = '1';
                    }, 100);
                }
            }
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.content-section, .technique-card, .cultivation-stage');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger stat bar animations for technique cards
                const statFills = entry.target.querySelectorAll('.stat-fill');
                statFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.transition = 'width 1s ease-out';
                        fill.style.width = width;
                    }, 300);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ============================================
// TECHNIQUE CARD ANIMATIONS
// ============================================

function initTechniqueCardAnimations() {
    const cards = document.querySelectorAll('.technique-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Create ripple effect on ink wash
            const inkWash = card.querySelector('.card-ink-wash');
            if (inkWash) {
                inkWash.style.transition = 'all 0.6s ease';
                inkWash.style.opacity = '0.2';
                inkWash.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const inkWash = card.querySelector('.card-ink-wash');
            if (inkWash) {
                inkWash.style.opacity = '0.1';
                inkWash.style.transform = 'scale(1)';
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add will-change for performance
window.addEventListener('load', () => {
    const animatedElements = document.querySelectorAll(
        '.scroll-container, .cloud-layer, .bamboo-parallax, .floating-petals'
    );
    animatedElements.forEach(el => {
        el.style.willChange = 'transform';
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Cancel any running animations
    const highestId = window.requestAnimationFrame(() => {});
    for (let i = 0; i < highestId; i++) {
        window.cancelAnimationFrame(i);
    }
});