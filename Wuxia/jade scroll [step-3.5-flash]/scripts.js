// ============================================
// 武學秘典 · 天機閣 - Wuxia Martial Arts Scroll
// Interactive JavaScript Module
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoadingScreen();
    initParallax();
    initNavigation();
    initSkillTrees();
    initMeridianChart();
    initScrollAnimations();
    initTooltips();
});

// ============================================
// Loading Screen
// ============================================
function initLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const scrollContainer = document.querySelector('.scroll-container');
    
    // Simulate loading with minimum display time
    const minLoadTime = 2000;
    const startTime = Date.now();
    
    // Hide loading screen after content is ready
    function hideLoading() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            
            // Trigger scroll unroll animation
            setTimeout(() => {
                scrollContainer.classList.add('unrolling');
                // Remove unroll class after animation completes
                setTimeout(() => {
                    scrollContainer.classList.remove('unrolling');
                }, 1500);
            }, 300);
        }, remaining);
    }
    
    // Check if all images and resources are loaded
    if (document.readyState === 'complete') {
        hideLoading();
    } else {
        window.addEventListener('load', hideLoading);
    }
}

// ============================================
// Parallax Background Effect
// ============================================
function initParallax() {
    const parallaxElements = {
        bambooLeft: document.querySelector('.bamboo-stalk.left'),
        bambooRight: document.querySelector('.bamboo-stalk.right'),
        cloud1: document.querySelector('.cloud-1'),
        cloud2: document.querySelector('.cloud-2'),
        cloud3: document.querySelector('.cloud-3')
    };
    
    // Check if all elements exist
    if (!Object.values(parallaxElements).every(el => el)) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax intensities (different speeds for depth)
        const intensities = {
            bambooLeft: 0.15,
            bambooRight: 0.12,
            cloud1: 0.08,
            cloud2: 0.06,
            cloud3: 0.04
        };
        
        Object.keys(parallaxElements).forEach(key => {
            const el = parallaxElements[key];
            if (el) {
                const yPos = scrollY * intensities[key];
                el.style.transform = `${el.style.transform.replace(/translateY\([^)]*\)/, '')} translateY(${yPos}px)`;
            }
        });
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Initial call
}

// ============================================
// Navigation System
// ============================================
function initNavigation() {
    const navSeals = document.querySelectorAll('.nav-seal');
    const sections = document.querySelectorAll('.skill-section');
    const scrollContainer = document.querySelector('.scroll-container');
    
    // Set initial active section
    const initialSection = document.querySelector('.skill-section.active');
    if (initialSection) {
        initialSection.style.display = 'block';
    }
    
    navSeals.forEach(seal => {
        seal.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('href').substring(1);
            const section = document.getElementById(targetSection);
            
            if (!section) return;
            
            // Update active seal
            navSeals.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Fade out current section
            const currentActive = document.querySelector('.skill-section.active');
            if (currentActive && currentActive !== section) {
                currentActive.style.opacity = '0';
                currentActive.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    currentActive.style.display = 'none';
                    currentActive.classList.remove('active');
                    
                    // Show new section with animation
                    section.style.display = 'block';
                    // Force reflow
                    section.offsetHeight;
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                    section.classList.add('active');
                    
                    // Generate tree connections for this section
                    generateTreeConnections(targetSection);
                }, 400);
            } else if (!currentActive) {
                section.style.display = 'block';
                section.classList.add('active');
                generateTreeConnections(targetSection);
            }
            
            // Scroll to section if needed
            const sectionTop = section.offsetTop;
            const containerTop = scrollContainer.offsetTop;
            const offset = sectionTop - containerTop - 100;
            
            if (offset > 0) {
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Skill Tree System
// ============================================
function initSkillTrees() {
    // Generate connections for all trees on page load
    const treeContainers = document.querySelectorAll('.skill-tree-container');
    treeContainers.forEach(container => {
        const sectionId = container.parentElement.id;
        generateTreeConnections(sectionId);
    });
    
    // Add hover effects to skill nodes
    const skillNodes = document.querySelectorAll('.skill-node');
    skillNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.zIndex = '10';
        });
        
        // Add click to toggle detail
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            const detail = this.querySelector('.node-detail');
            if (detail) {
                detail.style.display = detail.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
}

function generateTreeConnections(sectionId) {
    const container = document.getElementById(`${sectionId}-tree`);
    if (!container) return;
    
    const svg = container.querySelector('.tree-connections');
    const nodes = container.querySelectorAll('.skill-node');
    
    if (!svg) return;
    
    // Clear existing paths
    svg.innerHTML = '';
    
    // Create a map of nodes by ID
    const nodeMap = new Map();
    nodes.forEach(node => {
        const nodeId = node.getAttribute('data-id');
        if (nodeId) {
            const rect = node.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            nodeMap.set(nodeId, {
                element: node,
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top,
                parentId: node.getAttribute('data-parent')
            });
        }
    });
    
    // Draw connections from each node to its parent
    nodeMap.forEach((nodeData, nodeId) => {
        if (nodeData.parentId && nodeMap.has(nodeData.parentId)) {
            const parentData = nodeMap.get(nodeData.parentId);
            drawInkStroke(svg, parentData, nodeData);
        }
    });
    
    // Animate the paths
    setTimeout(() => {
        const paths = svg.querySelectorAll('path');
        paths.forEach((path, index) => {
            setTimeout(() => {
                path.classList.add('ink-stroke');
            }, index * 100);
        });
    }, 100);
}

function drawInkStroke(svg, parent, child) {
    // Calculate control points for a curved path (Bezier curve)
    const dx = child.x - parent.x;
    const dy = child.y - parent.y;
    
    // Control point distance based on curve
    const curveIntensity = 0.5;
    const cp1x = parent.x + dx * curveIntensity;
    const cp1y = parent.y - dy * 0.1; // Slight upward curve at start
    const cp2x = child.x - dx * curveIntensity;
    const cp2y = child.y + dy * 0.1; // Slight downward curve at end
    
    // Create path with slight wobble for hand-drawn effect
    const wobble = () => (Math.random() - 0.5) * 2;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `
        M ${parent.x + wobble()}, ${parent.y + wobble()}
        C ${cp1x + wobble()}, ${cp1y + wobble()},
          ${cp2x + wobble()}, ${cp2y + wobble()},
          ${child.x + wobble()}, ${child.y + wobble()}
    `);
    
    path.setAttribute('stroke', 'var(--ink-pale)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    
    svg.appendChild(path);
}

// ============================================
// Meridian Chart with Qi Flow
// ============================================
function initMeridianChart() {
    const meridianContainer = document.querySelector('.meridian-container');
    if (!meridianContainer) return;
    
    const meridianPaths = document.querySelectorAll('.meridian-path');
    const qiParticlesGroup = document.querySelector('.qi-particles');
    
    if (!qiParticlesGroup) return;
    
    // Create particles for each meridian
    const meridianColors = {
        '任脈': 'var(--qi-red)',
        '督脈': 'var(--qi-blue)',
        '衝脈': 'var(--qi-purple)',
        '帶脈': 'var(--qi-gold)'
    };
    
    meridianPaths.forEach(path => {
        const name = path.getAttribute('data-name');
        const color = meridianColors[name] || 'var(--qi-red)';
        
        // Create multiple particles per meridian
        for (let i = 0; i < 5; i++) {
            createQiParticle(qiParticlesGroup, path, color, i * 0.8);
        }
    });
}

function createQiParticle(container, pathElement, color, delay) {
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('r', '4');
    particle.setAttribute('fill', color);
    particle.style.opacity = '0';
    particle.style.filter = `drop-shadow(0 0 6px ${color})`;
    
    // Animate along the path
    const pathLength = pathElement.getTotalLength();
    const duration = 4000 + Math.random() * 2000; // 4-6 seconds
    
    // Create animation
    const animate = () => {
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        anim.setAttribute('attributeName', 'opacity');
        anim.setAttribute('values', '0;1;1;0');
        anim.setAttribute('keyTimes', '0;0.2;0.8;1');
        anim.setAttribute('dur', `${duration}ms`);
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('begin', `${delay}s`);
        
        const motion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        motion.setAttribute('dur', `${duration}ms`);
        motion.setAttribute('repeatCount', 'indefinite');
        motion.setAttribute('begin', `${delay}s`);
        motion.setAttribute('rotate', 'auto');
        
        const mp = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
        mp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + pathElement.id || pathElement.getAttribute('data-name'));
        
        motion.appendChild(mp);
        particle.appendChild(anim);
        particle.appendChild(motion);
        container.appendChild(particle);
    };
    
    // Ensure path has an ID for mpath
    if (!pathElement.id) {
        pathElement.id = 'meridian-' + Math.random().toString(36).substr(2, 9);
    }
    
    animate();
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('skill-section')) {
                    animateSkillNodes(entry.target);
                }
                
                if (entry.target.classList.contains('section-header')) {
                    animateSectionHeader(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe sections and headers
    document.querySelectorAll('.skill-section, .section-header').forEach(el => {
        observer.observe(el);
    });
}

function animateSkillNodes(section) {
    const nodes = section.querySelectorAll('.skill-node');
    nodes.forEach((node, index) => {
        const delay = index * 0.1;
        node.style.opacity = '0';
        node.style.transform = `translate(-50%, -50%) translateY(20px)`;
        node.style.transition = `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`;
        
        setTimeout(() => {
            node.style.opacity = '1';
            node.style.transform = 'translate(-50%, -50%) translateY(0)';
        }, 100);
    });
}

function animateSectionHeader(header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(30px)';
    header.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 300);
}

// ============================================
// Tooltips
// ============================================
function initTooltips() {
    const tooltip = document.getElementById('skill-tooltip');
    const skillNodes = document.querySelectorAll('.skill-node');
    
    if (!tooltip) return;
    
    skillNodes.forEach(node => {
        const detail = node.querySelector('.node-detail');
        if (!detail) return;
        
        // Clone detail content for tooltip
        const tooltipContent = detail.cloneNode(true);
        tooltipContent.style.display = 'block';
        tooltipContent.style.position = 'static';
        tooltipContent.style.transform = 'none';
        tooltipContent.style.opacity = '1';
        tooltipContent.style.border = 'none';
        tooltipContent.style.boxShadow = 'none';
        tooltipContent.style.background = 'transparent';
        tooltipContent.style.padding = '0';
        
        // Clear tooltip and add content
        tooltip.innerHTML = '';
        tooltip.appendChild(tooltipContent);
        
        node.addEventListener('mouseenter', function(e) {
            const rect = node.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
            tooltip.style.transform = 'translate(-50%, -100%)';
            tooltip.classList.add('visible');
        });
        
        node.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
        
        node.addEventListener('mousemove', function(e) {
            const rect = node.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
        });
    });
    
    // Hide tooltip when mouse leaves it
    tooltip.addEventListener('mouseenter', () => {
        tooltip.classList.add('visible');
    });
    
    tooltip.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });
}

// ============================================
// Scroll Container Effects
// ============================================
// Add subtle scroll-based effects
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    const scrollContainer = document.querySelector('.scroll-container');
    
    if (scrollContainer) {
        const rect = scrollContainer.getBoundingClientRect();
        
        // Add shadow when scrolling
        if (currentScrollY > lastScrollY && rect.top < 100) {
            scrollContainer.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)';
        } else {
            scrollContainer.style.boxShadow = 'var(--scroll-shadow)';
        }
    }
    
    lastScrollY = currentScrollY;
}, { passive: true });

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Mouse Trail Effect (Optional, subtle)
// ============================================
(function initMouseTrail() {
    // Only enable on desktop
    if (window.matchMedia('(hover: hover)').matches) {
        const dots = [];
        const dotCount = 8;
        
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'mouse-trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.4}px;
                height: ${4 - i * 0.4}px;
                background: rgba(196, 30, 58, ${0.4 - i * 0.04});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(dot);
            dots.push({ element: dot, x: 0, y: 0 });
        }
        
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        let moveTimeout;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            
            // Show dots
            dots.forEach(dot => {
                dot.element.style.opacity = '1';
            });
            
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                isMoving = false;
                dots.forEach(dot => {
                    dot.element.style.opacity = '0';
                });
            }, 100);
        });
        
        // Animate dots with delay
        function animateTrail() {
            let x = mouseX;
            let y = mouseY;
            
            dots.forEach((dot, index) => {
                setTimeout(() => {
                    dot.element.style.left = `${x}px`;
                    dot.element.style.top = `${y}px`;
                }, index * 15);
            });
            
            requestAnimationFrame(animateTrail);
        }
        
        animateTrail();
    }
})();

// ============================================
// Keyboard Navigation Support
// ============================================
document.addEventListener('keydown', (e) => {
    const sections = ['inner', 'external', 'forms', 'meridian'];
    const currentSection = document.querySelector('.skill-section.active');
    const currentId = currentSection ? currentSection.id : 'inner-cultivation';
    const currentIndex = sections.findIndex(s => currentId.includes(s));
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sections.length;
        const nextSeal = document.querySelector(`.nav-seal[data-section="${sections[nextIndex]}"]`);
        if (nextSeal) nextSeal.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        const prevSeal = document.querySelector(`.nav-seal[data-section="${sections[prevIndex]}"]`);
        if (prevSeal) prevSeal.click();
    }
});

// ============================================
// Performance: Debounce & Throttle utilities
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

// ============================================
// Easter Egg: Secret Key Combination
// ============================================
let secretKeySequence = [];
const secretCode = ['KeyU', 'KeyL', 'KeyT', 'KeyR']; // ULTR
const secretMessage = '你已發現天機閣最高機密！';

document.addEventListener('keydown', (e) => {
    secretKeySequence.push(e.code);
    secretKeySequence = secretKeySequence.slice(-4);
    
    if (secretKeySequence.join(',') === secretCode.join(',')) {
        showSecretReveal();
        secretKeySequence = [];
    }
});

function showSecretReveal() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 26, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.5s;
    `;
    
    overlay.innerHTML = `
        <div style="
            text-align: center;
            color: #f5f2eb;
            font-family: 'Ma Shan Zheng', cursive;
        ">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">天機閣</h1>
            <p style="font-size: 1.5rem; letter-spacing: 0.3em;">${secretMessage}</p>
            <button style="
                margin-top: 40px;
                padding: 12px 30px;
                font-size: 1.2rem;
                background: var(--seal-red);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-family: var(--font-body);
            ">確認</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('button').addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.5s';
        setTimeout(() => overlay.remove(), 500);
    });
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// Console Easter Egg
// ============================================
console.log(`
%c武學秘典 · 天機閣
%c天地不仁，以萬物為芻狗；聖人不仁，以百姓為芻狗。
%c— 《道德經》

%cSecret: Press U-L-T-R for a surprise...
`, 
'font-size: 24px; color: #c41e3a; font-family: serif;',
'font-size: 14px; color: #4a4a4a; font-style: italic;',
'font-size: 12px; color: #6a6a6a;',
'font-size: 10px; color: #8a8a8a;'
);

// ============================================
// End of Script
// ============================================