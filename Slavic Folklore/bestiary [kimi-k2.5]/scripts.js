/** 
 * LEŚNIK'S CODEX - SCRIPTS
 * A Bestiary of Slavic Shadows
 * Interactive Manuscript & Creature Compendium
 */

class BestiaryCodex {
    constructor() {
        this.config = {
            creatures: ['leshy', 'rusalka', 'baba-yaga', 'zmey', 'poludnitsa', 'vila', 'kikimora'],
            emberCount: 15,
            emberInterval: 800,
            pageTurnDuration: 600
        };
        
        this.state = {
            currentIndex: 0,
            isAnimating: false,
            embersActive: true,
            readingStartTime: Date.now(),
            creaturesViewed: new Set()
        };
        
        this.dom = {
            entries: document.querySelectorAll('.creature-entry'),
            navItems: document.querySelectorAll('.creature-nav'),
            prevBtn: document.querySelector('.nav-btn.prev'),
            nextBtn: document.querySelector('.nav-btn.next'),
            currentPage: document.querySelector('.page-indicator .current'),
            totalPages: document.querySelector('.page-indicator .total'),
            embersContainer: document.querySelector('.embers-container'),
            codex: document.querySelector('.codex'),
            toc: document.querySelector('.toc-sidebar')
        };
        
        this.romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        this.init();
    }
    
    init() {
        this.validateDOM();
        this.bindEvents();
        this.generateEmbers();
        this.updateDisplay();
        this.checkDeepLink();
        console.log('Leśnik\'s Codex initialized');
    }
    
    validateDOM() {
        if (!this.dom.entries.length) console.warn('No entries found');
        if (!this.dom.navItems.length) console.warn('No nav items found');
    }
    
    bindEvents() {
        if (this.dom.prevBtn) {
            this.dom.prevBtn.addEventListener('click', () => this.navigate('prev'));
        }
        if (this.dom.nextBtn) {
            this.dom.nextBtn.addEventListener('click', () => this.navigate('next'));
        }
        
        this.dom.navItems.forEach((item, index) => {
            item.addEventListener('click', () => this.goToCreature(index));
        });
        
        document.addEventListener('keydown', (e) => this.handleGlobalKeys(e));
        
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
        
        document.addEventListener('visibilitychange', () => {
            this.state.embersActive = !document.hidden;
        });
    }
    
    navigate(direction) {
        if (this.state.isAnimating) return;
        const newIndex = direction === 'next' 
            ? this.state.currentIndex + 1 
            : this.state.currentIndex - 1;
            
        if (newIndex >= 0 && newIndex < this.config.creatures.length) {
            this.transitionTo(newIndex);
        } else if (direction === 'next' && newIndex >= this.config.creatures.length) {
            this.transitionTo(0);
        } else if (direction === 'prev' && newIndex < 0) {
            this.transitionTo(this.config.creatures.length - 1);
        }
    }
    
    goToCreature(index) {
        if (index === this.state.currentIndex || this.state.isAnimating) return;
        this.transitionTo(index);
    }
    
    transitionTo(newIndex) {
        this.state.isAnimating = true;
        const currentEntry = this.dom.entries[this.state.currentIndex];
        
        if (currentEntry) {
            currentEntry.style.animation = 'pageFadeOut 0.3s ease-in forwards';
        }
        
        setTimeout(() => {
            this.state.currentIndex = newIndex;
            this.state.creaturesViewed.add(this.config.creatures[newIndex]);
            this.updateDisplay();
            
            const newEntry = this.dom.entries[newIndex];
            if (newEntry) {
                newEntry.style.animation = 'none';
                newEntry.offsetHeight;
                newEntry.style.animation = 'pageFadeIn 0.6s ease-out forwards';
            }
            
            history.replaceState(null, null, `#${this.config.creatures[newIndex]}`);
            this.state.isAnimating = false;
        }, 300);
    }
    
    updateDisplay() {
        const current = this.state.currentIndex;
        const creature = this.config.creatures[current];
        
        this.dom.entries.forEach((entry, idx) => {
            entry.classList.toggle('active', idx === current);
        });
        
        this.dom.navItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === current);
            if (this.state.creaturesViewed.has(this.config.creatures[idx]) && idx !== current) {
                item.style.opacity = '0.7';
            }
        });
        
        if (this.dom.currentPage) {
            this.dom.currentPage.textContent = this.romanNumerals[current];
        }
        
        document.title = `${this.getCreatureTitle(creature)} | Leśnik's Codex`;
    }
    
    generateEmbers() {
        if (!this.dom.embersContainer) return;
        
        const createEmber = () => {
            if (!this.state.embersActive) return;
            const ember = document.createElement('div');
            ember.className = 'ember';
            const startX = Math.random() * 100;
            const size = 2 + Math.random() * 4;
            const duration = 10 + Math.random() * 10;
            
            ember.style.left = `${startX}%`;
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.animationDuration = `${duration}s`;
            
            this.dom.embersContainer.appendChild(ember);
            
            ember.addEventListener('animationend', () => {
                if (ember.parentNode) ember.remove();
            });
        };
        
        for (let i = 0; i < this.config.emberCount; i++) {
            setTimeout(createEmber, i * 200);
        }
        
        setInterval(() => {
            if (this.dom.embersContainer.children.length < this.config.emberCount) {
                createEmber();
            }
        }, this.config.emberInterval);
    }
    
    handleGlobalKeys(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.navigate('prev');
                break;
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.navigate('next');
                break;
            case 'Home':
                e.preventDefault();
                this.goToCreature(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToCreature(this.config.creatures.length - 1);
                break;
        }
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.navigate('next');
            } else {
                this.navigate('prev');
            }
        }
    }
    
    checkDeepLink() {
        const hash = window.location.hash.replace('#', '');
        const index = this.config.creatures.indexOf(hash);
        if (index !== -1) {
            this.state.currentIndex = index;
            this.updateDisplay();
        }
    }
    
    getCreatureTitle(slug) {
        const titles = {
            'leshy': 'The Leshy',
            'rusalka': 'The Rusalka',
            'baba-yaga': 'Baba Yaga',
            'zmey': 'Zmey Gorynych',
            'poludnitsa': 'Poludnitsa',
            'vila': 'The Vila',
            'kikimora': 'The Kikimora'
        };
        return titles[slug] || slug;
    }
}

function activateSecretMode() {
    console.log('Secret knowledge unlocked');
    document.body.style.filter = 'sepia(0.3) contrast(1.1)';
    
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(pos => {
        const rune = document.createElement('div');
        rune.textContent = 'ᛟ';
        const topBottom = pos.includes('top') ? 'top' : 'bottom';
        const leftRight = pos.includes('left') ? 'left' : 'right';
        
        rune.style.cssText = `
            position: fixed;
            ${topBottom}: 20px;
            ${leftRight}: 20px;
            font-size: 2rem;
            color: #6b1515;
            opacity: 0.5;
            pointer-events: none;
            z-index: 3000;
        `;
        document.body.appendChild(rune);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.codex = new BestiaryCodex();
    });
} else {
    window.codex = new BestiaryCodex();
}

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateSecretMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});