// =============================================
// RETRO FANTASY GRIMOIRE - Interactive Effects
// Particle system, quest interactions, animations
// =============================================

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        particleCount: 30,
        particleInterval: 800,
        questHoverGlow: true,
        statAnimations: true,
        ambientGlow: true
    };
    
    // =========================================
    // 1. AMBIENT PARTICLE SYSTEM
    // =========================================
    
    class ParticleSystem {
        constructor(container) {
            this.container = container;
            this.particles = [];
            this.isRunning = false;
            this.animationFrame = null;
        }
        
        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position along the width
            const x = Math.random() * window.innerWidth;
            const duration = 15 + Math.random() * 25;
            const size = 2 + Math.random() * 4;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                left: ${x}px;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                background: radial-gradient(circle, 
                    rgba(212, 175, 55, ${0.2 + Math.random() * 0.4}), 
                    transparent);
            `;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
            
            // Remove particle after animation completes
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
            }, (duration + delay) * 1000);
        }
        
        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            
            // Create initial burst
            for (let i = 0; i < 10; i++) {
                setTimeout(() => this.createParticle(), i * 200);
            }
            
            // Continuous spawning
            this.interval = setInterval(() => {
                if (this.particles.length < CONFIG.particleCount) {
                    this.createParticle();
                }
            }, CONFIG.particleInterval);
        }
        
        stop() {
            this.isRunning = false;
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.particles.forEach(p => {
                if (p.parentNode) p.parentNode.removeChild(p);
            });
            this.particles = [];
        }
    }
    
    // =========================================
    // 2. QUEST ENTRY INTERACTIONS
    // =========================================
    
    class QuestManager {
        constructor() {
            this.questEntries = document.querySelectorAll('.quest-entry');
            this.activeQuest = null;
            this.init();
        }
        
        init() {
            this.questEntries.forEach((entry, index) => {
                // Click to toggle active state
                entry.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleQuest(entry);
                });
                
                // Hover effects
                entry.addEventListener('mouseenter', () => {
                    if (CONFIG.questHoverGlow) {
                        entry.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.15)';
                    }
                });
                
                entry.addEventListener('mouseleave', () => {
                    entry.style.boxShadow = '';
                });
                
                // Staggered entrance animation
                entry.style.opacity = '0';
                entry.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    entry.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.style.opacity = '1';
                    entry.style.transform = 'translateX(0)';
                }, 300 + index * 150);
            });
        }
        
        toggleQuest(entry) {
            // Remove active from all
            this.questEntries.forEach(e => {
                e.classList.remove('active');
                e.style.boxShadow = '';
            });
            
            // Add active to clicked
            if (entry !== this.activeQuest || !entry.classList.contains('active')) {
                entry.classList.add('active');
                this.activeQuest = entry;
                
                // Play reveal animation
                this.revealQuestDetails(entry);
            } else {
                this.activeQuest = null;
            }
        }
        
        revealQuestDetails(entry) {
            const content = entry.querySelector('.quest-content');
            if (content) {
                content.style.transition = 'all 0.3s ease';
                content.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    content.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }
    
    // =========================================
    // 3. STAT ANIMATIONS
    // =========================================
    
    class StatAnimator {
        constructor() {
            this.stats = document.querySelectorAll('.stat');
            this.bars = document.querySelectorAll('.bar-fill');
            this.init();
        }
        
        init() {
            if (!CONFIG.statAnimations) return;
            
            // Animate stat values on hover
            this.stats.forEach(stat => {
                stat.addEventListener('mouseenter', () => {
                    const value = stat.querySelector('.stat-value');
                    if (value) {
                        value.style.transition = 'all 0.3s ease';
                        value.style.transform = 'scale(1.3)';
                        value.style.color = '#c9a84c';
                    }
                });
                
                stat.addEventListener('mouseleave', () => {
                    const value = stat.querySelector('.stat-value');
                    if (value) {
                        value.style.transform = 'scale(1)';
                        value.style.color = '';
                    }
                });
            });
            
            // Animate resource bars on load
            this.animateBars();
        }
        
        animateBars() {
            this.bars.forEach((bar, index) => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    bar.style.width = targetWidth;
                }, 500 + index * 200);
            });
        }
        
        // Update bar values dynamically
        updateBar(barElement, newWidth) {
            barElement.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
            barElement.style.width = newWidth + '%';
            
            // Update text
            const text = barElement.querySelector('.bar-text');
            if (text) {
                text.style.transition = 'opacity 0.3s ease';
                text.style.opacity = '0';
                setTimeout(() => {
                    text.style.opacity = '1';
                }, 500);
            }
        }
    }
    
    // =========================================
    // 4. INVENTORY TOOLTIP ENHANCEMENTS
    // =========================================
    
    class InventoryManager {
        constructor() {
            this.slots = document.querySelectorAll('.inventory-slot');
            this.init();
        }
        
        init() {
            this.slots.forEach(slot => {
                // Enhanced hover effect
                slot.addEventListener('mouseenter', () => {
                    const icon = slot.querySelector('.item-icon');
                    if (icon) {
                        icon.style.transition = 'transform 0.3s ease';
                        icon.style.transform = 'scale(1.3) rotate(10deg)';
                    }
                });
                
                slot.addEventListener('mouseleave', () => {
                    const icon = slot.querySelector('.item-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }
                });
                
                // Click to "examine" item
                slot.addEventListener('click', () => {
                    if (!slot.classList.contains('empty')) {
                        this.examineItem(slot);
                    }
                });
            });
        }
        
        examineItem(slot) {
            const itemName = slot.getAttribute('data-item') || 'Unknown Item';
            const icon = slot.querySelector('.item-icon')?.textContent || '◇';
            
            // Create examination flash
            slot.style.transition = 'all 0.2s ease';
            slot.style.transform = 'scale(1.1)';
            slot.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.4)';
            
            setTimeout(() => {
                slot.style.transform = 'scale(1)';
                slot.style.boxShadow = '';
            }, 300);
            
            // Log examination (could be expanded to show modal)
            console.log(`Examining: ${itemName} ${icon}`);
        }
    }
    
    // =========================================
    // 5. AMBIENT EFFECTS
    // =========================================
    
    class AmbientEffects {
        constructor() {
            this.candleGlow = document.querySelector('.candle-glow');
            this.init();
        }
        
        init() {
            if (!CONFIG.ambientGlow || !this.candleGlow) return;
            
            // Mouse-following subtle glow
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                
                this.candleGlow.style.background = `
                    radial-gradient(
                        ellipse at ${x}% ${y}%,
                        rgba(255, 200, 100, 0.04) 0%,
                        rgba(255, 150, 50, 0.02) 30%,
                        transparent 60%
                    )
                `;
            });
            
            // Add subtle parallax to book
            this.initParallax();
        }
        
        initParallax() {
            const book = document.querySelector('.book-container');
            if (!book) return;
            
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 4;
                const y = (e.clientY / window.innerHeight - 0.5) * 4;
                
                book.style.transition = 'transform 0.1s ease-out';
                book.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
            });
            
            // Reset on mouse leave
            document.addEventListener('mouseleave', () => {
                book.style.transition = 'transform 0.5s ease-out';
                book.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        }
    }
    
    // =========================================
    // 6. PAGE TRANSITION EFFECTS
    // =========================================
    
    class PageEffects {
        constructor() {
            this.pages = document.querySelectorAll('.page');
            this.init();
        }
        
        init() {
            // Add page curl effect on hover
            this.pages.forEach(page => {
                page.addEventListener('mouseenter', () => {
                    if (page.classList.contains('page-left')) {
                        page.style.transform = 'perspective(1000px) rotateY(-2deg)';
                    } else {
                        page.style.transform = 'perspective(1000px) rotateY(2deg)';
                    }
                });
                
                page.addEventListener('mouseleave', () => {
                    page.style.transform = '';
                });
            });
            
            // Subtle page texture movement
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                
                this.pages.forEach(page => {
                    page.style.backgroundPosition = `${x * 0.5}% ${y * 0.5}%`;
                });
            });
        }
    }
    
    // =========================================
    // 7. INITIALIZATION
    // =========================================
    
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all modules
        const particleSystem = new ParticleSystem(
            document.querySelector('.ambient-particles')
        );
        
        const questManager = new QuestManager();
        const statAnimator = new StatAnimator();
        const inventoryManager = new InventoryManager();
        const ambientEffects = new AmbientEffects();
        const pageEffects = new PageEffects();
        
        // Start particle system after a delay
        setTimeout(() => {
            particleSystem.start();
        }, 1000);
        
        // Add resize handler for particles
        window.addEventListener('resize', () => {
            // Particles will naturally adjust as they're recreated
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // 'Q' key to cycle through quests
            if (e.key === 'q' || e.key === 'Q') {
                const entries = document.querySelectorAll('.quest-entry:not(.locked)');
                const active = document.querySelector('.quest-entry.active');
                let nextIndex = 0;
                
                if (active) {
                    const currentIndex = Array.from(entries).indexOf(active);
                    nextIndex = (currentIndex + 1) % entries.length;
                }
                
                entries.forEach(e => e.classList.remove('active'));
                entries[nextIndex].classList.add('active');
                entries[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // 'Space' to toggle particles
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                if (particleSystem.isRunning) {
                    particleSystem.stop();
                } else {
                    particleSystem.start();
                }
            }
        });
        
        console.log('📜 Grimoire of Aeldoreth initialized');
        console.log('✦ Press Q to cycle quests');
        console.log('✦ Press Space to toggle particles');
    });
    
    // Handle visibility change to pause/resume effects
    document.addEventListener('visibilitychange', () => {
        const particleContainer = document.querySelector('.ambient-particles');
        if (document.hidden) {
            particleContainer.style.animationPlayState = 'paused';
        } else {
            particleContainer.style.animationPlayState = 'running';
        }
    });
    
})();