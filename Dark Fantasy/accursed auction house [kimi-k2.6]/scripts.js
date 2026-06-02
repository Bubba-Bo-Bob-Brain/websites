document.addEventListener('DOMContentLoaded', function() {
    
    // === Blood Cursor ===
    const bloodCursor = document.getElementById('blood-cursor');
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    
    function animateCursor() {
        currentX += (cursorX - currentX) * 0.15;
        currentY += (cursorY - currentY) * 0.15;
        bloodCursor.style.left = currentX - 10 + 'px';
        bloodCursor.style.top = currentY - 10 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // === Candelabra Timer System ===
    function initTimers() {
        const timers = document.querySelectorAll('.candelabra-timer');
        
        timers.forEach(timer => {
            const deadlineStr = timer.dataset.deadline;
            const deadline = new Date(deadlineStr);
            const digitIds = [];
            const flames = timer.querySelectorAll('.timer-flame');
            
            // Collect digit IDs from flame data attributes
            flames.forEach(flame => {
                const digitId = flame.dataset.digit;
                if (digitId && !digitIds.includes(digitId)) {
                    digitIds.push(digitId);
                }
            });
            
            // For small timers without data-digit, use position-based IDs
            if (digitIds.length === 0) {
                const smallDigits = timer.querySelectorAll('.timer-digit');
                smallDigits.forEach((digit, index) => {
                    digitIds.push(digit.id);
                });
            }
            
            function updateTimer() {
                const now = new Date();
                const diff = deadline - now;
                
                if (diff <= 0) {
                    // Timer expired — candles extinguish
                    flames.forEach(flame => {
                        flame.style.opacity = '0';
                        flame.style.transform = 'scaleY(0.1)';
                        flame.style.transition = 'all 0.5s ease';
                    });
                    const label = timer.querySelector('.timer-label');
                    if (label) label.textContent = 'The Veil Has Sealed';
                    return;
                }
                
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                const timeStr = 
                    String(hours).padStart(2, '0') + 
                    String(minutes).padStart(2, '0') + 
                    String(seconds).padStart(2, '0');
                
                // Update digits
                const allDigits = timer.querySelectorAll('.timer-digit');
                allDigits.forEach((digit, index) => {
                    const newValue = timeStr[index] || '0';
                    if (digit.textContent !== newValue) {
                        digit.textContent = newValue;
                        // Trigger flame flicker intensity on change
                        const parentCandle = digit.closest('.timer-candle');
                        const flame = parentCandle.querySelector('.timer-flame');
                        if (flame) {
                            flame.style.animationDuration = '0.05s';
                            setTimeout(() => {
                                flame.style.animationDuration = '';
                            }, 300);
                        }
                    }
                });
                
                // Intensify flicker as deadline approaches
                const urgency = 1 - (diff / (24 * 60 * 60 * 1000));
                if (urgency > 0.7) {
                    flames.forEach(flame => {
                        const baseSpeed = 0.08;
                        const speed = baseSpeed - (urgency * 0.06);
                        flame.style.animationDuration = Math.max(0.04, speed) + 's';
                        // Shift color toward more red
                        const redShift = Math.floor(urgency * 100);
                        flame.style.filter = `hue-rotate(-${redShift}deg) brightness(${1 + urgency * 0.3})`;
                    });
                }
                
                // Wax drip animation sync
                const waxes = timer.querySelectorAll('.timer-wax');
                waxes.forEach((wax, index) => {
                    const dripChance = urgency * 0.3;
                    if (Math.random() < dripChance && !wax.classList.contains('dripping')) {
                        createWaxDrip(wax);
                    }
                });
            }
            
            updateTimer();
            setInterval(updateTimer, 1000);
        });
    }
    
    function createWaxDrip(waxElement) {
        waxElement.classList.add('dripping');
        const drip = document.createElement('div');
        drip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            width: 4px;
            height: 0;
            background: var(--aged-parchment);
            border-radius: 0 0 50% 50%;
            transform: translateX(-50%);
            animation: wax-drip-fall 2s ease-in forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes wax-drip-fall {
                0% { height: 0; opacity: 1; }
                80% { height: 20px; opacity: 0.8; }
                100% { height: 25px; opacity: 0; transform: translateX(-50%) translateY(5px); }
            }
        `;
        document.head.appendChild(style);
        
        waxElement.style.position = 'relative';
        waxElement.appendChild(drip);
        
        setTimeout(() => {
            drip.remove();
            waxElement.classList.remove('dripping');
        }, 2000);
    }
    
    // === Wax Seal Shatter ===
    function initSeals() {
        const seals = document.querySelectorAll('.wax-seal');
        
        seals.forEach(seal => {
            seal.addEventListener('click', function(e) {
                const curseId = this.dataset.curse;
                const warning = document.getElementById('curse-' + curseId);
                if (!warning || warning.classList.contains('revealed')) return;
                
                // Create shatter effect
                const rect = this.getBoundingClientRect();
                const particles = 12;
                
                for (let i = 0; i < particles; i++) {
                    createShatterParticle(rect, i);
                }
                
                // Animate seal breaking
                const wax = this.querySelector('.seal-wax');
                wax.style.transition = 'all 0.4s ease';
                wax.style.transform = 'scale(1.2) rotate(' + (Math.random() * 30 - 15) + 'deg)';
                wax.style.opacity = '0';
                
                const threads = this.querySelector('.seal-threads');
                if (threads) {
                    threads.style.transition = 'all 0.3s ease';
                    threads.style.opacity = '0';
                    threads.style.transform = 'translateX(20px)';
                }
                
                // Reveal curse
                setTimeout(() => {
                    warning.classList.add('revealed');
                    this.style.display = 'none';
                    
                    // Play whisper text effect
                    const curseText = warning.querySelector('.curse-text');
                    if (curseText) {
                        whisperText(curseText);
                    }
                }, 200);
            });
        });
    }
    
    function createShatterParticle(rect, index) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        const angle = (index / 12) * Math.PI * 2;
        const distance = Math.random() * 60 + 30;
        
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, var(--fresh-blood) 0%, var(--dried-blood) 100%);
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(particle);
        
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;
        const rotation = Math.random() * 720 - 360;
        
        particle.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
    
    // === Whisper Text Effect ===
    function whisperText(element) {
        const originalText = element.textContent;
        const chars = '§¶†‡•·˚˙‥…‰※‼‽⁂⁜⁕⁂۩۞';
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) return originalText[index];
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            iterations += 1/2;
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 30);
    }
    
    // === Lore Panel Toggle ===
    function initLorePanels() {
        const toggles = document.querySelectorAll('.lore-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isRevealed = content.classList.contains('revealed');
                
                if (isRevealed) {
                    content.classList.remove('revealed');
                    this.querySelector('.lore-text').textContent = 'Uncover Forbidden Lore';
                    this.querySelector('.lore-icon').textContent = '📜';
                } else {
                    content.classList.add('revealed');
                    this.querySelector('.lore-text').textContent = 'Seal Away Knowledge';
                    this.querySelector('.lore-icon').textContent = '🔒';
                    
                    // Animate ink spread
                    const ink = content.querySelector('.lore-ink');
                    if (ink) {
                        ink.style.animation = 'none';
                        ink.offsetHeight;
                        ink.style.animation = 'ink-spread 2s ease-out';
                    }
                }
            });
        });
    }
    
    // Add ink spread animation
    const inkStyle = document.createElement('style');
    inkStyle.textContent = `
        @keyframes ink-spread {
            0% { transform: scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(inkStyle);
    
    // === Spectral Bidder Animations ===
    function initSpectralBidders() {
        const bidders = document.querySelectorAll('.spectral-entity');
        
        // Random emergence for new bidders
        setInterval(() => {
            const emerging = document.querySelector('.spectral-entity[data-presence="emerging"]');
            if (emerging && Math.random() < 0.3) {
                emerging.dataset.presence = 'strong';
            }
        }, 5000);
        
        // Random status changes
        const statuses = ['bidding', 'watching', 'lingering', 'calculating', 'whispering'];
        setInterval(() => {
            const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
            const statusEl = randomBidder.querySelector('.spectral-status');
            if (statusEl && Math.random() < 0.2) {
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                statusEl.style.opacity = '0';
                setTimeout(() => {
                    statusEl.textContent = newStatus;
                    statusEl.style.opacity = '1';
                }, 300);
            }
        }, 8000);
        
        // Flicker effect on names
        bidders.forEach(bidder => {
            const name = bidder.querySelector('.spectral-name');
            if (!name) return;
            
            setInterval(() => {
                if (Math.random() < 0.1) {
                    name.style.textShadow = '0 0 8px rgba(232, 220, 196, 0.5)';
                    setTimeout(() => {
                        name.style.textShadow = '';
                    }, 200);
                }
            }, 3000 + Math.random() * 4000);
        });
    }
    
    // === Bid Increment Interactions ===
    function initBidButtons() {
        const buttons = document.querySelectorAll('.bid-increment');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const increment = parseInt(this.dataset.increment);
                const item = this.closest('.auction-item');
                const amountEl = item.querySelector('.item-current-bid .bid-amount');
                
                if (!amountEl) return;
                
                const currentAmount = parseInt(amountEl.textContent.replace(/,/g, ''));
                const newAmount = currentAmount + increment;
                
                // Animate the bid
                animateBidAmount(amountEl, currentAmount, newAmount);
                
                // Blood surge effect on button
                const pulse = this.querySelector('.bid-pulse');
                pulse.style.animation = 'none';
                pulse.offsetHeight;
                pulse.style.animation = 'bid-heartbeat 0.5s ease-out';
                
                // Add to history
                const historyList = item.querySelector('.history-list');
                if (historyList) {
                    addBidToHistory(historyList, newAmount);
                }
                
                // Update timer urgency
                const timer = item.querySelector('.candelabra-timer');
                if (timer) {
                    const flames = timer.querySelectorAll('.timer-flame');
                    flames.forEach(flame => {
                        flame.style.animationDuration = '0.06s';
                        setTimeout(() => {
                            flame.style.animationDuration = '';
                        }, 1000);
                    });
                }
            });
        });
    }
    
    function animateBidAmount(element, from, to) {
        const duration = 800;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(from + (to - from) * eased);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function addBidToHistory(historyList, amount) {
        const bidderNames = [
            'Elias Blackwood',
            'The Dowager of Salt',
            'Seven-Names-None-True',
            'Child-of-the-Well',
            'The Smiling Nun',
            'Last-King-of-Worms',
            'Marrow-Collector'
        ];
        const name = bidderNames[Math.floor(Math.random() * bidderNames.length)];
        
        const entry = document.createElement('li');
        entry.className = 'history-entry';
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-20px)';
        entry.innerHTML = `
            <span class="bidder-spectral" data-name="${name}">${name}</span>
            <span class="bid-amount">${amount.toLocaleString()}</span>
            <span class="bid-time">just now</span>
        `;
        
        historyList.insertBefore(entry, historyList.firstChild);
        
        // Remove old entries
        while (historyList.children.length > 5) {
            historyList.lastChild.remove();
        }
        
        // Animate in
        requestAnimationFrame(() => {
            entry.style.transition = 'all 0.5s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        });
        
        // Spectral flicker on new name
        const spectralName = entry.querySelector('.bidder-spectral');
        if (spectralName) {
            setTimeout(() => {
                spectralName.style.textShadow = '0 0 12px rgba(232, 220, 196, 0.8)';
                setTimeout(() => {
                    spectralName.style.textShadow = '';
                }, 400);
            }, 500);
        }
    }
    
    // === Hover Sound Simulation (Visual) ===
    function initHoverEffects() {
        // Whisper effect on item names
        const itemNames = document.querySelectorAll('.item-name');
        itemNames.forEach(name => {
            name.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
                this.style.letterSpacing = '0.08em';
                this.style.textShadow = '0 0 15px rgba(139, 0, 0, 0.3)';
            });
            name.addEventListener('mouseleave', function() {
                this.style.letterSpacing = '';
                this.style.textShadow = '';
            });
        });
        
        // Auction item hover - intensify aura
        const items = document.querySelectorAll('.auction-item');
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const aura = this.querySelector('.item-aura');
                if (aura) {
                    aura.style.background = 'radial-gradient(ellipse at 30% 20%, rgba(139, 0, 0, 0.15) 0%, transparent 70%)';
                }
            });
            item.addEventListener('mouseleave', function() {
                const aura = this.querySelector('.item-aura');
                if (aura) {
                    aura.style.background = '';
                }
            });
        });
    }
    
    // === Initialize All Systems ===
    initTimers();
    initSeals();
    initLorePanels();
    initSpectralBidders();
    initBidButtons();
    initHoverEffects();
    
    // === Random Atmospheric Events ===
    setInterval(() => {
        // Random candle flicker intensity across all timers
        const allFlames = document.querySelectorAll('.timer-flame');
        const randomFlame = allFlames[Math.floor(Math.random() * allFlames.length)];
        if (randomFlame && Math.random() < 0.15) {
            randomFlame.style.animationDuration = '0.04s';
            randomFlame.style.transform = 'scaleY(1.3)';
            setTimeout(() => {
                randomFlame.style.animationDuration = '';
                randomFlame.style.transform = '';
            }, 200);
        }
    }, 2000);
    
    // Subtle page breathing effect
    let breathPhase = 0;
    function breathe() {
        breathPhase += 0.005;
        const intensity = Math.sin(breathPhase) * 0.02 + 1;
        document.documentElement.style.setProperty('--breath', intensity);
        requestAnimationFrame(breathe);
    }
    breathe();
    
    // Header candles respond to mouse proximity
    const headerCandles = document.querySelector('.header-candles');
    if (headerCandles) {
        document.addEventListener('mousemove', function(e) {
            const rect = headerCandles.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const distance = Math.abs(e.clientX - centerX);
            const maxDistance = window.innerWidth / 2;
            const influence = Math.max(0, 1 - distance / maxDistance);
            
            const flames = headerCandles.querySelectorAll('.flame');
            flames.forEach((flame, index) => {
                const offset = index - 1;
                const lean = influence * offset * 5;
                flame.style.transform = `translateX(calc(-50% + ${lean}px)) skewX(${lean * 0.5}deg)`;
            });
        });
    }
});