// scripts.js

class CeremonialCalendar {
    constructor() {
        this.currentSegment = 0;
        this.totalSegments = 13;
        this.segmentRotation = 0;
        this.deityIndex = 0;
        this.eclipseInterval = null;
        this.init();
    }

    init() {
        this.createCalendarWheel();
        this.setupEventListeners();
        this.startEclipseCountdown();
        this.startDeityCarousel();
        this.setupTooltipSystem();
        this.setupNavigation();
        this.addAmbientEffects();
    }

    createCalendarWheel() {
        const wheelSegments = document.getElementById('wheelSegments');
        const segmentNames = [
            { name: 'TONAL', glyph: '📜', color: '#006d5b' },
            { name: 'NAGUAL', glyph: '🐍', color: '#004d3d' },
            { name: 'TECPATL', glyph: '⚡', color: '#d4af37' },
            { name: 'CALLI', glyph: '🏠', color: '#8b0000' },
            { name: 'TOZIHUITL', glyph: '🌅', color: '#d4af37' },
            { name: 'APAN', glyph: '🌊', color: '#006d5b' },
            { name: 'MALINAL', glyph: '🌿', color: '#004d3d' },
            { name: 'OCELOTL', glyph: '🐆', color: '#d4af37' },
            { name: 'CUETLACH', glyph: '🎭', color: '#8b0000' },
            { name: 'CINTLI', glyph: '🌽', color: '#006d5b' },
            { name: 'CHICOME', glyph: '🌾', color: '#004d3d' },
            { name: 'TOXCATL', glyph: '💧', color: '#d4af37' },
            { name: 'HUEYTOZ', glyph: '🔥', color: '#8b0000' }
        ];

        segmentNames.forEach((segment, index) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'segment';
            segmentElement.style.transform = `rotate(${index * (360 / this.totalSegments)}deg)`;
            
            const segmentContent = document.createElement('div');
            segmentContent.style.transform = `rotate(${-index * (360 / this.totalSegments)}deg)`;
            segmentContent.innerHTML = `
                <span style="font-size: 0.8rem; text-shadow: 0 0 10px ${segment.color};">${segment.glyph}</span>
                <span style="display: block; margin-top: 5px; font-size: 0.7rem;">${segment.name}</span>
            `;
            
            segmentElement.appendChild(segmentContent);
            wheelSegments.appendChild(segmentElement);
        });

        this.updateWheelYear();
    }

    updateWheelYear() {
        const yearElement = document.getElementById('currentYear');
        const cycles = Math.floor(Date.now() / (52 * 24 * 60 * 60 * 1000)) % 52;
        const haab = Math.floor(Date.now() / (365 * 24 * 60 * 60 * 1000)) % 18;
        yearElement.textContent = `52-HUN ${cycles} ${haab}-HAAB`;
    }

    setupEventListeners() {
        // Rotate wheel buttons
        document.getElementById('rotateLeft').addEventListener('click', () => this.rotateWheel(-1));
        document.getElementById('rotateRight').addEventListener('click', () => this.rotateWheel(1));

        // Wheel mouse drag
        let isDragging = false;
        let startAngle = 0;
        let currentRotation = 0;

        const wheel = document.getElementById('stoneWheel');
        
        wheel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startAngle = e.clientX;
            wheel.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = e.clientX - startAngle;
            const newRotation = currentRotation + (delta * 0.5);
            wheel.style.transform = `rotate(${newRotation}deg)`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                wheel.style.cursor = 'grab';
                currentRotation = parseFloat(wheel.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
            }
        });

        // Touch support for mobile
        wheel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startAngle = e.touches[0].clientX;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const delta = e.touches[0].clientX - startAngle;
            const newRotation = currentRotation + (delta * 0.5);
            wheel.style.transform = `rotate(${newRotation}deg)`;
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
            currentRotation = parseFloat(wheel.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        });
    }

    rotateWheel(direction) {
        this.currentSegment += direction;
        if (this.currentSegment < 0) this.currentSegment = this.totalSegments - 1;
        if (this.currentSegment >= this.totalSegments) this.currentSegment = 0;

        this.segmentRotation = this.currentSegment * (360 / this.totalSegments);
        document.getElementById('stoneWheel').style.transform = `rotate(${this.segmentRotation}deg)`;
        
        this.updateActiveNavItem();
    }

    setupTooltipSystem() {
        const tooltips = document.querySelectorAll('.glyph-tooltip');
        
        tooltips.forEach(tooltip => {
            const glyph = tooltip.getAttribute('data-glyph');
            const meanings = {
                'TONAL': 'Tonal energy - The day sign carries specific energies and influences',
                'NAHUI': 'Nahui represents sacred numbers and cosmic order in the Aztec calendar',
                'CELESTIAL': 'Celestial alignment - Stars and planets in sacred configuration',
                'RITUAL': 'Ritual practice - Sacred ceremony connecting human and divine'
            };

            const meaning = meanings[glyph] || 'Sacred glyph with cosmic significance';
            const symbol = tooltip.querySelector('.glyph-symbol');
            const meaningSpan = tooltip.querySelector('.tooltip-text span:last-child');
            
            if (meaningSpan) {
                meaningSpan.textContent = meaning;
            }

            tooltip.addEventListener('mouseenter', (e) => {
                const tooltipEl = document.getElementById('glyphTooltip');
                tooltipEl.style.opacity = '1';
                tooltipEl.style.visibility = 'visible';
            });

            tooltip.addEventListener('mouseleave', () => {
                const tooltipEl = document.getElementById('glyphTooltip');
                tooltipEl.style.opacity = '0';
                tooltipEl.style.visibility = 'hidden';
            });

            tooltip.addEventListener('mousemove', (e) => {
                const tooltipEl = document.getElementById('glyphTooltip');
                tooltipEl.style.left = e.pageX + 'px';
                tooltipEl.style.top = (e.pageY - 100) + 'px';
            });
        });
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.glyph-btn');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                navButtons.forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');

                const section = e.currentTarget.getAttribute('data-section');
                const targetSection = document.getElementById(section);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    startEclipseCountdown() {
        // Set a future eclipse date (December 26, 2024)
        const eclipseDate = new Date('December 26, 2024 12:00:00').getTime();
        
        this.eclipseInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = eclipseDate - now;

            if (distance < 0) {
                clearInterval(this.eclipseInterval);
                document.getElementById('eclipseStatus').textContent = 'ECLIPSE BEGUN';
                document.getElementById('eclipseStatus').style.color = 'var(--blood-red-light)';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

            // Update status based on time remaining
            const statusEl = document.getElementById('eclipseStatus');
            if (distance > 86400000) {
                statusEl.textContent = 'PRE-ECLIPSE CEREMONY';
                statusEl.style.color = 'var(--gold)';
            } else {
                statusEl.textContent = 'ECLIPSE IMMINENT';
                statusEl.style.color = 'var(--blood-red-light)';
            }
        }, 1000);
    }

    startDeityCarousel() {
        setInterval(() => {
            this.deityIndex = (this.deityIndex + 1) % 3;
            this.updateDeityDisplay();
        }, 4000);
    }

    updateDeityDisplay() {
        const cards = document.querySelectorAll('.deity-card');
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.deityIndex);
        });
    }

    addAmbientEffects() {
        // Add floating particles effect
        const container = document.querySelector('.container');
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 3px;
                    height: 3px;
                    background: var(--gold);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 999;
                    animation: floatParticle 3s linear forwards;
                `;
                
                // Add keyframes dynamically if not already present
                if (!document.querySelector('#particleKeyframes')) {
                    const style = document.createElement('style');
                    style.id = 'particleKeyframes';
                    style.textContent = `
                        @keyframes floatParticle {
                            0% { 
                                opacity: 0; 
                                transform: translateY(100vh) scale(0); 
                            }
                            10% { 
                                opacity: 1; 
                                transform: translateY(0) scale(1); 
                            }
                            90% { 
                                opacity: 1; 
                            }
                            100% { 
                                opacity: 0; 
                                transform: translateY(-100px) scale(0.5); 
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.top = '-10px';
                container.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }
        }, 2000);

        // Animate section titles on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; // trigger reflow
                    entry.target.style.animation = 'sectionFadeIn 1s ease-out';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-title, .ritual-card, .deity-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease';
            observer.observe(el);
        });

        // Add scroll reveal keyframes
        const scrollStyle = document.createElement('style');
        scrollStyle.textContent = `
            @keyframes sectionFadeIn {
                from { 
                    opacity: 0; 
                    transform: translateY(30px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
        `;
        document.head.appendChild(scrollStyle);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CeremonialCalendar();
    
    // Add some additional interactive hover effects
    const ritualCards = document.querySelectorAll('.ritual-card');
    ritualCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        // Simulate left rotation
        const event = new Event('click');
        document.getElementById('rotateLeft')?.dispatchEvent(event);
    } else if (e.key === 'ArrowRight') {
        // Simulate right rotation
        const event = new Event('click');
        document.getElementById('rotateRight')?.dispatchEvent(event);
    }
});