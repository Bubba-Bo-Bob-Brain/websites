/**
 * LABORATORIUM MAGNUM OPUS - SCRIPTS
 * The Living Workbench
 */

class AlchemicalEngine {
    constructor() {
        this.currentStage = 'nigredo';
        this.stageIndex = 0;
        this.stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
        this.stageNames = {
            'nigredo': 'Nigredo',
            'albedo': 'Albedo', 
            'citrinitas': 'Citrinitas',
            'rubedo': 'Rubedo'
        };
        
        // Elemental composition
        this.elements = {
            salt: 0,
            sulfur: 0,
            mercury: 0,
            azoth: 0
        };
        
        // Ingredients in mortar
        this.mortarContents = [];
        this.isGrinding = false;
        
        // Transmutation progress
        this.transmutationProgress = 0;
        this.rotationSpeed = 1;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initStarfield();
        this.startCrucibleBubbles();
        this.updateStageDisplay();
    }
    
    cacheDOM() {
        this.body = document.body;
        this.starfield = document.getElementById('starfield');
        this.outerMandala = document.getElementById('outer-mandala');
        this.innerMandala = document.getElementById('inner-mandala');
        this.philosopherStone = document.getElementById('philosopher-stone');
        this.stageIndicator = document.getElementById('stage-indicator');
        this.crucibleLiquid = document.getElementById('liquid-contents');
        this.bubbleContainer = document.querySelector('.bubble-container');
        this.mortar = document.getElementById('mortar');
        this.pestle = document.getElementById('pestle');
        this.ingredientsPile = document.querySelector('.ingredients-pile');
        this.ingredientJars = document.querySelectorAll('.ingredient-jar');
        this.sigilButtons = document.querySelectorAll('.sigil-btn');
        this.marginalia = document.querySelectorAll('.marginalia');
        this.gaugeNeedle = document.querySelector('.gauge-needle');
        this.residueSlots = document.querySelectorAll('.residue-slot');
        this.toast = document.getElementById('mystical-toast');
        this.incantationOverlay = document.getElementById('incantation-overlay');
        this.incantationText = document.querySelector('.incantation-text');
    }
    
    bindEvents() {
        // Sigil buttons for elemental addition
        this.sigilButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const element = btn.dataset.element;
                this.addElement(element);
            });
        });
        
        // Drag and drop for ingredients
        this.ingredientJars.forEach(jar => {
            jar.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('ingredient', jar.dataset.ingredient);
                jar.classList.add('dragging');
            });
            
            jar.addEventListener('dragend', () => {
                jar.classList.remove('dragging');
            });
            
            // Also support click to add
            jar.addEventListener('click', () => {
                this.addToMortar(jar.dataset.ingredient);
            });
        });
        
        // Mortar drop zone
        this.mortar.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        this.mortar.addEventListener('drop', (e) => {
            e.preventDefault();
            const ingredient = e.dataTransfer.getData('ingredient');
            if (ingredient) {
                this.addToMortar(ingredient);
            }
        });
        
        // Pestle grinding interaction
        this.pestle.addEventListener('mousedown', () => this.startGrinding());
        this.pestle.addEventListener('mouseup', () => this.stopGrinding());
        this.pestle.addEventListener('mouseleave', () => this.stopGrinding());
        
        // Touch support for mobile
        this.pestle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startGrinding();
        });
        this.pestle.addEventListener('touchend', () => this.stopGrinding());
        
        // Planetary symbols in mandala
        const planets = document.querySelectorAll('.planetary-symbols text');
        planets.forEach(planet => {
            planet.addEventListener('click', () => {
                this.boostTransmutation();
                this.showToast(`Invoked ${planet.classList[1]}`);
            });
        });
        
        // Keyboard shortcuts for hermetic access
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.attemptTransmutation();
            }
        });
    }
    
    // ============================================
    // STAGE MANAGEMENT
    // ============================================
    
    advanceStage() {
        if (this.stageIndex < this.stages.length - 1) {
            this.stageIndex++;
            this.currentStage = this.stages[this.stageIndex];
            this.applyStageTransition();
        } else {
            this.manifestPhilosopherStone();
        }
    }
    
    applyStageTransition() {
        // Update body data attribute for CSS
        this.body.dataset.stage = this.currentStage;
        
        // Show incantation
        this.showIncantation();
        
        // Update progress segments
        this.updateStageDisplay();
        
        // Update crucible liquid color
        this.updateCrucibleAppearance();
        
        // Reveal marginalia for this stage
        this.revealMarginalia();
        
        // Update gauge
        this.updateGauge();
        
        // Show notification
        setTimeout(() => {
            this.showToast(`Entered ${this.stageNames[this.currentStage]}`);
        }, 2000);
        
        // Check for Rubedo completion
        if (this.currentStage === 'rubedo') {
            setTimeout(() => this.manifestPhilosopherStone(), 3000);
        }
    }
    
    updateStageDisplay() {
        const segments = document.querySelectorAll('.progress-segment');
        segments.forEach((seg, idx) => {
            seg.classList.remove('active', 'completed');
            if (idx < this.stageIndex) {
                seg.classList.add('completed');
            } else if (idx === this.stageIndex) {
                seg.classList.add('active');
            }
        });
        
        const stageName = document.querySelector('.stage-name');
        if (stageName) {
            stageName.textContent = this.stageNames[this.currentStage];
        }
    }
    
    showIncantation() {
        const incantations = {
            'nigredo': 'Visita Interiora Terrae...',
            'albedo': 'Rectificando Invenies...',
            'citrinitas': 'Ocultum Lapidem...',
            'rubedo': 'Philosophicus Lapis Manifestus!'
        };
        
        this.incantationText.textContent = incantations[this.currentStage];
        this.incantationOverlay.classList.add('visible');
        
        // Speed up rotation during incantation
        this.setRotationSpeed(3);
        
        setTimeout(() => {
            this.incantationOverlay.classList.remove('visible');
            this.setRotationSpeed(1);
        }, 3000);
    }
    
    // ============================================
    // ELEMENTAL SYSTEM
    // ============================================
    
    addElement(element) {
        this.elements[element]++;
        this.transmutationProgress += 10;
        
        // Visual feedback
        this.createElementalBurst(element);
        this.showToast(`Added ${element.charAt(0).toUpperCase() + element.slice(1)}`);
        
        // Increase rotation speed temporarily
        this.setRotationSpeed(2);
        setTimeout(() => this.setRotationSpeed(1), 1000);
        
        // Check for stage advancement
        if (this.transmutationProgress >= (this.stageIndex + 1) * 25) {
            this.advanceStage();
        }
        
        // Activate corresponding residue slot
        this.activateResidue(element);
    }
    
    activateResidue(element) {
        const mapping = {
            'salt': 'earth',
            'sulfur': 'fire',
            'mercury': 'water',
            'azoth': 'air'
        };
        
        const slot = document.querySelector(`[data-residue="${mapping[element]}"]`);
        if (slot) {
            slot.classList.add('active');
            setTimeout(() => slot.classList.remove('active'), 2000);
        }
    }
    
    createElementalBurst(element) {
        const colors = {
            salt: '#ffffff',
            sulfur: '#ffd700',
            mercury: '#c0c0c0',
            azoth: '#4a90e2'
        };
        
        // Create particle effect at cursor or center
        const rect = this.outerMandala.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[element]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 10px ${colors[element]};
            `;
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // ============================================
    // CRUCIBLE SYSTEM
    // ============================================
    
    startCrucibleBubbles() {
        setInterval(() => {
            if (Math.random() > 0.3) {
                this.createBubble();
            }
        }, 800);
    }
    
    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 15 + 5;
        const left = Math.random() * 80 + 10;
        const drift = (Math.random() - 0.5) * 40;
        const duration = Math.random() * 2 + 3;
        
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            --drift: ${drift}px;
            animation-duration: ${duration}s;
        `;
        
        this.bubbleContainer.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), duration * 1000);
    }
    
    updateCrucibleAppearance() {
        // Liquid color is handled by CSS variables, but we can add particles
        const intensity = this.stageIndex + 1;
        for (let i = 0; i < intensity * 5; i++) {
            setTimeout(() => this.createBubble(), i * 100);
        }
    }
    
    updateGauge() {
        const rotation = this.stageIndex * 90;
        if (this.gaugeNeedle) {
            this.gaugeNeedle.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
        }
    }
    
    // ============================================
    // MORTAR AND PESTLE
    // ============================================
    
    addToMortar(ingredient) {
        if (this.mortarContents.length < 5) {
            this.mortarContents.push(ingredient);
            this.updateMortarVisual();
            this.showToast(`${ingredient} added to mortar`);
            
            // Visual feedback - ingredient falls in
            this.animateIngredientDrop(ingredient);
        } else {
            this.showToast('Mortar is full! Grind to transmute.');
        }
    }
    
    animateIngredientDrop(ingredient) {
        this.ingredientsPile.classList.add('has-contents');
        
        // Flash effect
        this.mortar.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        setTimeout(() => {
            this.mortar.style.boxShadow = '';
        }, 300);
    }
    
    updateMortarVisual() {
        if (this.mortarContents.length > 0) {
            this.ingredientsPile.classList.add('has-contents');
        }
    }
    
    startGrinding() {
        if (this.mortarContents.length === 0) {
            this.showToast('Add ingredients first');
            return;
        }
        
        this.isGrinding = true;
        this.pestle.classList.add('grinding');
        
        // Create grinding particles
        this.grindingInterval = setInterval(() => {
            this.createGrindParticles();
        }, 300);
        
        // After 3 seconds of grinding, transmute contents
        this.grindTimeout = setTimeout(() => {
            this.transmuteMortarContents();
        }, 3000);
    }
    
    stopGrinding() {
        this.isGrinding = false;
        this.pestle.classList.remove('grinding');
        
        if (this.grindingInterval) {
            clearInterval(this.grindingInterval);
        }
        if (this.grindTimeout) {
            clearTimeout(this.grindTimeout);
        }
    }
    
    createGrindParticles() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${this.getStageColor()};
            border-radius: 50%;
            pointer-events: none;
            left: ${50 + (Math.random() - 0.5) * 40}%;
            top: ${50 + (Math.random() - 0.5) * 20}%;
            opacity: 0.8;
        `;
        
        this.mortar.querySelector('.mortar-bowl').appendChild(particle);
        
        particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.8 },
            { transform: 'translateY(-30px) scale(0)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
    
    transmuteMortarContents() {
        // Convert ingredients to elements
        const ingredientMap = {
            'lead': 'salt',
            'quicksilver': 'mercury',
            'antimony': 'sulfur',
            'cinnabar': 'azoth'
        };
        
        this.mortarContents.forEach(ing => {
            if (ingredientMap[ing]) {
                this.addElement(ingredientMap[ing]);
            }
        });
        
        this.mortarContents = [];
        this.ingredientsPile.classList.remove('has-contents');
        this.showToast('Materia Prima transmuted');
        this.stopGrinding();
    }
    
    getStageColor() {
        const colors = {
            'nigredo': '#4a4a6a',
            'albedo': '#d0d0c8',
            'citrinitas': '#d4af37',
            'rubedo': '#ff6b6b'
        };
        return colors[this.currentStage];
    }
    
    // ============================================
    // TRANSMUTATION CIRCLE
    // ============================================
    
    setRotationSpeed(multiplier) {
        const baseSpeed = 60; // seconds
        this.outerMandala.style.animationDuration = `${baseSpeed / multiplier}s`;
        this.innerMandala.style.animationDuration = `${(baseSpeed * 0.66) / multiplier}s`;
    }
    
    boostTransmutation() {
        this.transmutationProgress += 5;
        this.setRotationSpeed(4);
        setTimeout(() => this.setRotationSpeed(1), 2000);
        
        // Create energy ring
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute;
            border: 2px solid ${this.getStageColor()};
            border-radius: 50%;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            opacity: 0;
        `;
        
        this.outerMandala.appendChild(ring);
        
        ring.animate([
            { transform: 'scale(0.8)', opacity: 1 },
            { transform: 'scale(1.5)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => ring.remove();
    }
    
    // ============================================
    // MANUSCRIPT REVELATION
    // ============================================
    
    revealMarginalia() {
        this.marginalia.forEach(margin => {
            const revealStage = margin.dataset.reveal;
            const revealIndex = this.stages.indexOf(revealStage);
            
            if (revealIndex <= this.stageIndex) {
                margin.classList.add('revealed');
            }
        });
    }
    
    // ============================================
    // PHILOSOPHER'S STONE
    // ============================================
    
    manifestPhilosopherStone() {
        this.philosopherStone.classList.add('manifested');
        this.showToast('LAPIS PHILOSOPHORUM');
        
        // Dramatic effects
        this.setRotationSpeed(0.2); // Slow to almost stop
        
        // Golden explosion
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createElementalBurst('sulfur');
            }, i * 50);
        }
        
        // Show completion seal
        const seal = document.getElementById('seal-container');
        if (seal) {
            seal.classList.remove('hidden');
        }
    }
    
    // ============================================
    // UTILITIES
    // ============================================
    
    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
    
    attemptTransmutation() {
        // Spacebar shortcut to try advancing
        if (this.transmutationProgress >= (this.stageIndex + 1) * 25) {
            this.advanceStage();
        } else {
            this.showToast('More elements required...');
            this.setRotationSpeed(2);
            setTimeout(() => this.setRotationSpeed(1), 500);
        }
    }
    
    // ============================================
    // CELESTIAL BACKGROUND
    // ============================================
    
    initStarfield() {
        const canvas = this.starfield;
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        const stars = [];
        const starCount = 200;
        
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random()
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) star.y = canvas.height;
                
                star.opacity += (Math.random() - 0.5) * 0.05;
                star.opacity = Math.max(0.1, Math.min(1, star.opacity));
                
                ctx.fillStyle = `rgba(212, 175, 55, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.alchemicalEngine = new AlchemicalEngine();
    
    // Add subtle parallax effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const sphere = document.getElementById('zodiac-ring');
        if (sphere) {
            sphere.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    });
});

// Expose incantation for console access
window.speakLatin = (phrase) => {
    const engine = window.alchemicalEngine;
    if (engine) {
        engine.incantationText.textContent = phrase;
        engine.incantationOverlay.classList.add('visible');
        setTimeout(() => {
            engine.incantationOverlay.classList.remove('visible');
        }, 3000);
    }
};