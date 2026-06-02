// scripts.js
class EldritchArchive {
    constructor() {
        this.sanityLevel = 100;
        this.maxSanity = 100;
        this.scrollThreshold = 300;
        this.searchTimeout = null;
        this.searchIndex = this.initializeSearchIndex();
        this.init();
    }

    init() {
        this.setupSanityMeter();
        this.setupSearch();
        this.setupHoverEffects();
        this.setupScrollDecay();
        this.setupTentacleAnimation();
        this.setupNoiseEffect();
        this.setupCategoryAnimations();
    }

    setupSanityMeter() {
        this.sanityFill = document.getElementById('sanityFill');
        this.sanityValue = document.getElementById('sanityValue');
        this.updateSanityDisplay();
    }

    updateSanityDisplay() {
        const percentage = Math.max(0, this.sanityLevel);
        this.sanityFill.style.width = percentage + '%';
        this.sanityValue.textContent = Math.round(percentage) + '%';
        
        // Color transition based on sanity level
        if (percentage > 60) {
            this.sanityFill.style.background = 'linear-gradient(90deg, #f0e842, #6b2fa8)';
        } else if (percentage > 30) {
            this.sanityFill.style.background = 'linear-gradient(90deg, #ffaa00, #ff0040)';
        } else {
            this.sanityFill.style.background = 'linear-gradient(90deg, #ff0040, #660000)';
            this.sanityFill.style.boxShadow = '0 0 15px #ff0040';
        }
    }

    modifySanity(amount) {
        this.sanityLevel = Math.max(0, Math.min(this.maxSanity, this.sanityLevel + amount));
        this.updateSanityDisplay();
        
        // Add visual feedback when sanity is critically low
        if (this.sanityLevel < 20 && !document.body.classList.contains('sanity-critical')) {
            document.body.classList.add('sanity-critical');
            this.playDistortedSound();
        }
    }

    playDistortedSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0, audioContext.currentTime + 2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
        } catch (e) {
            // Audio context not supported or not allowed
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value, searchResults);
            }, 300);
        });
        
        searchInput.addEventListener('focus', () => {
            if (searchResults.children.length > 0) {
                searchResults.classList.add('active');
            }
        });
        
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchResults.classList.remove('active');
            }, 200);
        });
    }

    performSearch(query, container) {
        container.innerHTML = '';
        
        if (!query.trim()) {
            container.classList.remove('active');
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        const results = [];
        
        // Search through all items
        document.querySelectorAll('.text-item, .chart-item, .testimony-item').forEach(item => {
            const title = item.querySelector('.item-title').textContent.toLowerCase();
            const content = item.querySelector('.item-content').textContent.toLowerCase();
            
            if (title.includes(lowerQuery) || content.includes(lowerQuery)) {
                const category = item.closest('.archive-category').querySelector('.category-title').textContent;
                results.push({
                    title: item.querySelector('.item-title').textContent,
                    content: item.querySelector('.item-content').textContent.substring(0, 100) + '...',
                    category: category,
                    sanity: parseInt(item.dataset.sanity) || 0
                });
            }
        });
        
        // Sort by relevance (closer to query = higher relevance)
        results.sort((a, b) => {
            const aDist = Math.abs(a.sanity);
            const bDist = Math.abs(b.sanity);
            return aDist - bDist;
        });
        
        // Limit results and add disturbing elements
        const limitedResults = results.slice(0, 5);
        
        limitedResults.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Add disturbing content modification based on search depth
            let displayContent = result.content;
            if (index > 2) {
                displayContent = this.corruptText(displayContent);
            }
            if (index > 3) {
                displayContent = this.scrambleText(displayContent);
            }
            
            item.innerHTML = `
                <div style="color: var(--acid-yellow); font-size: 0.75em; margin-bottom: 4px;">${result.category}</div>
                <div style="font-size: 0.7em; color: ${index > 3 ? 'var(--corrupted-green)' : 'rgba(224,224,224,0.7)'}">
                    ${displayContent}
                </div>
                <div style="font-size: 0.6em; color: var(--unstable-violet); margin-top: 5px;">
                    SANITY IMPACT: ${result.sanity}%
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.modifySanity(result.sanity);
                searchInput.value = '';
                container.innerHTML = '';
                container.classList.remove('active');
                
                // Scroll to the item
                const targetItem = document.querySelector(`[data-sanity="${result.sanity}"]`);
                if (targetItem) {
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            container.appendChild(item);
        });
        
        container.classList.add('active');
    }

    corruptText(text) {
        const corruptionChars = ['⊠', '☢', '☣', '☠', '☁', '☂', '☃', '☄', '☈', '☇'];
        const words = text.split(' ');
        return words.map(word => {
            if (Math.random() > 0.7) {
                return corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
            }
            return word;
        }).join(' ');
    }

    scrambleText(text) {
        const words = text.split(' ');
        return words.map(word => {
            if (Math.random() > 0.5) {
                return word.split('').reverse().join('');
            }
            return word;
        }).join(' ');
    }

    setupHoverEffects() {
        document.querySelectorAll('.text-item, .chart-item, .testimony-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.modifySanity(-2);
                
                // Add subtle text distortion effect
                const title = item.querySelector('.item-title');
                const content = item.querySelector('.item-content');
                
                if (title) {
                    title.style.textShadow = `0 0 ${10 + Math.random() * 10}px rgba(240, 232, 66, 0.5)`;
                }
                if (content) {
                    content.style.filter = `hue-rotate(${Math.random() * 60 - 30}deg) brightness(${0.8 + Math.random() * 0.4})`;
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const title = item.querySelector('.item-title');
                const content = item.querySelector('.item-content');
                
                if (title) {
                    title.style.textShadow = '0 0 5px var(--acid-yellow)';
                }
                if (content) {
                    content.style.filter = 'none';
                }
            });
        });
    }

    setupScrollDecay() {
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const decayAmount = Math.min(scrollPercent * 40, 40); // Max 40% sanity loss
            this.modifySanity(-decayAmount);
        });
    }

    setupTentacleAnimation() {
        const tentacles = document.querySelectorAll('.tentacle');
        let time = 0;
        
        function animateTentacles() {
            time += 0.05;
            tentacles.forEach((tentacle, index) => {
                const offset = Math.sin(time + index * 2) * 10;
                tentacle.style.transform = `translateY(${offset}px) rotate(${Math.sin(time + index) * 5}deg)`;
                tentacle.style.opacity = 0.2 + Math.sin(time + index) * 0.1;
            });
            requestAnimationFrame(animateTentacles);
        }
        
        animateTentacles();
    }

    setupNoiseEffect() {
        let noiseIntensity = 0;
        
        function updateNoise() {
            if (this.sanityLevel < 40) {
                noiseIntensity = (40 - this.sanityLevel) / 40 * 0.3;
                document.querySelector('.noise-overlay').style.opacity = noiseIntensity;
            }
            requestAnimationFrame(updateNoise.bind(this));
        }
        
        updateNoise.call(this);
    }

    setupCategoryAnimations() {
        const categories = document.querySelectorAll('.archive-category');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.modifySanity(-1);
                    entry.target.style.animation = 'none';
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeIn 0.5s ease';
                    }, 10);
                }
            });
        }, { threshold: 0.1 });
        
        categories.forEach(category => {
            category.style.opacity = '0';
            category.style.transition = 'opacity 0.5s ease';
            observer.observe(category);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EldritchArchive();
});

// Add CSS animations for fade in
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px) rotateX(10deg); }
        to { opacity: 1; transform: translateY(0) rotateX(0); }
    }
    
    .sanity-critical {
        cursor: none !important;
    }
    
    .sanity-critical .archive-category {
        border-color: var(--sanity-critical) !important;
        box-shadow: 0 0 30px rgba(255, 0, 64, 0.3) !important;
    }
    
    .sanity-critical .category-title {
        color: var(--sanity-critical) !important;
        text-shadow: 0 0 20px var(--sanity-critical) !important;
    }
`;
document.head.appendChild(style);