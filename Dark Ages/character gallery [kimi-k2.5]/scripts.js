// PESTILENCE: Shadows of the Black Death - Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initFilters();
    initSort();
    initRelationships();
    initSelection();
    initScrollEffects();
    initCardTilt();
    initKeyboardNav();
});

// =====================
// Custom Cursor System
// =====================
function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
        // Hide custom cursor on touch devices
        if (cursor) cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId = null;
    let isActive = true;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isActive) {
            isActive = true;
            animateCursor();
        }
    });

    function animateCursor() {
        if (!isActive) return;
        
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.12;
        cursorY += dy * 0.12;
        
        cursor.style.left = cursorX - 12 + 'px';
        cursor.style.top = cursorY - 12 + 'px';
        
        rafId = requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover states for interactive elements
    const interactiveSelectors = 'button, .bond, .character-card, select, .filter-btn, .select-btn';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(rafId);
        } else {
            isActive = true;
            animateCursor();
        }
    });
}

// =====================
// Filter System
// =====================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.character-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            cards.forEach((card, index) => {
                const cardClass = card.dataset.class;
                const shouldShow = filterValue === 'all' || cardClass === filterValue;

                if (shouldShow) {
                    card.classList.remove('hidden');
                    // Staggered reveal animation
                    card.style.animation = `none`;
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        card.style.animation = `cardEntry 0.6s ease forwards`;
                        card.style.animationDelay = `${index * 0.05}s`;
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '0';
                }
            });

            // Redraw relationship lines after transition
            setTimeout(updateRelationshipLines, 350);
        });
    });
}

// =====================
// Sort System
// =====================
function initSort() {
    const sortSelect = document.getElementById('sort-select');
    const gallery = document.getElementById('gallery');
    const cards = Array.from(document.querySelectorAll('.character-card'));

    sortSelect.addEventListener('change', () => {
        const sortType = sortSelect.value;
        
        // Sort cards array
        cards.sort((a, b) => {
            switch(sortType) {
                case 'name':
                    return a.dataset.name.localeCompare(b.dataset.name);
                case 'plague-res':
                    return parseInt(b.dataset.plague) - parseInt(a.dataset.plague);
                case 'faith':
                    return parseInt(b.dataset.faith) - parseInt(a.dataset.faith);
                case 'survival':
                    return parseInt(b.dataset.survival) - parseInt(a.dataset.survival);
                default:
                    return 0;
            }
        });

        // Animate reordering
        cards.forEach((card, index) => {
            if (card.classList.contains('hidden')) return;
            
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                gallery.appendChild(card);
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 50);
        });

        setTimeout(updateRelationshipLines, 500);
    });
}

// =====================
// Relationship Lines
// =====================
function initRelationships() {
    // Initial draw
    setTimeout(updateRelationshipLines, 300);
    
    // Redraw on resize with debounce
    window.addEventListener('resize', debounce(() => {
        updateRelationshipLines();
    }, 250));

    // Bond hover interactions
    document.querySelectorAll('.bond').forEach(bond => {
        bond.addEventListener('mouseenter', handleBondHover);
        bond.addEventListener('mouseleave', clearHighlights);
    });
}

function updateRelationshipLines() {
    const svg = document.getElementById('relationshipLines');
    if (!svg) return;

    // Remove existing lines (keep defs)
    const existingLines = svg.querySelectorAll('line');
    existingLines.forEach(line => line.remove());

    const gallery = document.getElementById('gallery');
    const cards = document.querySelectorAll('.character-card:not(.hidden)');
    if (!gallery || cards.length === 0) return;

    const galleryRect = gallery.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Build bond connections
    const connections = [];
    const bondGroups = new Map();

    cards.forEach(card => {
        const cardBonds = card.querySelectorAll('.bond');
        cardBonds.forEach(bond => {
            const targetId = bond.dataset.bond;
            const bondType = bond.classList.contains('positive') ? 'positive' : 
                           bond.classList.contains('negative') ? 'negative' : 'neutral';
            
            if (!bondGroups.has(targetId)) {
                bondGroups.set(targetId, []);
            }
            bondGroups.get(targetId).push({ card, type: bondType, bondText: bond.textContent });
        });
    });

    // Draw lines between cards sharing the same bond
    bondGroups.forEach((group) => {
        if (group.length < 2) return;

        for (let i = 0; i < group.length - 1; i++) {
            for (let j = i + 1; j < group.length; j++) {
                const card1 = group[i].card;
                const card2 = group[j].card;
                
                const rect1 = card1.getBoundingClientRect();
                const rect2 = card2.getBoundingClientRect();

                // Calculate center points relative to gallery
                const x1 = rect1.left + rect1.width / 2 - galleryRect.left + scrollLeft;
                const y1 = rect1.top + rect1.height / 2 - galleryRect.top + scrollTop;
                const x2 = rect2.left + rect2.width / 2 - galleryRect.left + scrollLeft;
                const y2 = rect2.top + rect2.height / 2 - galleryRect.top + scrollTop;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                
                const color = group[i].type === 'positive' ? '#4ade80' : 
                             group[i].type === 'negative' ? '#ef4444' : '#8b8680';
                
                line.setAttribute('stroke', color);
                line.setAttribute('stroke-width', '1.5');
                line.setAttribute('stroke-opacity', '0.25');
                line.setAttribute('stroke-dasharray', group[i].type === 'neutral' ? '4,4' : 'none');
                line.classList.add('relationship-line');
                
                svg.appendChild(line);
            }
        }
    });
}

function handleBondHover(e) {
    const bondEl = e.target;
    const targetBond = bondEl.dataset.bond;
    const bondText = bondEl.textContent;

    // Dim all cards except those with this bond
    document.querySelectorAll('.character-card').forEach(card => {
        const hasBond = card.querySelector(`[data-bond="${targetBond}"]`);
        if (hasBond) {
            card.style.opacity = '1';
            card.style.filter = 'brightness(1.1)';
            card.style.zIndex = '10';
        } else {
            card.style.opacity = '0.2';
            card.style.filter = 'grayscale(80%) blur(1px)';
            card.style.zIndex = '1';
        }
    });

    // Highlight specific lines
    document.querySelectorAll('.relationship-line').forEach(line => {
        // Simple check: if line connects highlighted cards, boost opacity
        // Note: In a full implementation, we'd track line-to-bond mapping
        line.setAttribute('stroke-opacity', '0.6');
        line.setAttribute('stroke-width', '2.5');
    });
}

function clearHighlights() {
    document.querySelectorAll('.character-card').forEach(card => {
        card.style.opacity = '';
        card.style.filter = '';
        card.style.zIndex = '';
    });
    
    document.querySelectorAll('.relationship-line').forEach(line => {
        line.setAttribute('stroke-opacity', '0.25');
        line.setAttribute('stroke-width', '1.5');
    });
}

// =====================
// Selection System
// =====================
function initSelection() {
    document.querySelectorAll('.select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.character-card');
            const isSelected = card.classList.contains('selected');
            
            // Clear other selections
            document.querySelectorAll('.character-card').forEach(c => {
                c.classList.remove('selected');
                c.style.transform = '';
            });

            if (!isSelected) {
                card.classList.add('selected');
                createRipple(e, btn);
                
                // Update button text temporarily
                const textSpan = btn.querySelector('.btn-text');
                const originalText = textSpan.textContent;
                textSpan.textContent = 'Selected';
                
                setTimeout(() => {
                    textSpan.textContent = originalText;
                }, 2000);
                
                // Smooth scroll to card if needed
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

function createRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(139, 0, 0, 0.4);
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        pointer-events: none;
        animation: rippleExpand 0.6s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// =====================
// Scroll Effects
// =====================
function initScrollEffects() {
    // Parallax for atmospheric elements
    const ashParticles = document.querySelector('.ash-particles');
    const noise = document.querySelector('.noise-overlay');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (ashParticles) {
                    ashParticles.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.05}deg)`;
                }
                
                if (noise) {
                    noise.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Intersection Observer for cards entering viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'transform, opacity';
            } else {
                entry.target.style.willChange = 'auto';
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('.character-card').forEach(card => {
        observer.observe(card);
    });
}

// =====================
// 3D Card Tilt Effect
// =====================
function initCardTilt() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-8px)
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });
}

// =====================
// Keyboard Navigation
// =====================
function initKeyboardNav() {
    let currentIndex = -1;
    const cards = () => Array.from(document.querySelectorAll('.character-card:not(.hidden)'));
    
    document.addEventListener('keydown', (e) => {
        const cardArray = cards();
        
        if (e.key === 'Escape') {
            // Clear selection and highlights
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            clearHighlights();
            currentIndex = -1;
        }
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % cardArray.length;
            focusCard(cardArray[currentIndex]);
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = currentIndex <= 0 ? cardArray.length - 1 : currentIndex - 1;
            focusCard(cardArray[currentIndex]);
        }
        
        if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            const btn = cardArray[currentIndex].querySelector('.select-btn');
            if (btn) btn.click();
        }
    });
    
    function focusCard(card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.focus();
        // Visual indication
        card.style.outline = '2px solid var(--accent-blood)';
        setTimeout(() => {
            card.style.outline = '';
        }, 1000);
    }
}

// =====================
// Utility: Debounce
// =====================
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

// Update relationship lines when images load (if they were real)
window.addEventListener('load', () => {
    setTimeout(updateRelationshipLines, 100);
});