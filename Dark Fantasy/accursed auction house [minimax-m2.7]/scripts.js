/* ============================================
THE OBSIDIAN GAVEL - DARK FANTASY AUCTION HOUSE JAVASCRIPT
============================================ */
(function() {
    'use strict';

    /* ============================================
    CONFIGURATION & STATE
    ============================================ */
    const CONFIG = {
        updateInterval: 1000,
        bloodDripDuration: 3000,
        spectralFadeDuration: 4000,
        visitorUpdateInterval: 5000,
        toastDuration: 4000,
        modalCloseDelay: 3000,
        bidIncrementBase: 15,
        heartBeatDuration: 500
    };

    const STATE = {
        activeLots: new Map(),
        visitorCount: 1247,
        bidHistories: new Map(),
        watchlist: new Set(),
        activeToasts: [],
        isInitialized: false
    };

    /* ============================================
    UTILITY FUNCTIONS
    ============================================ */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max, decimals = 2) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return {
            hours: String(hrs).padStart(2, '0'),
            minutes: String(mins).padStart(2, '0'),
            seconds: String(secs).padStart(2, '0'),
            full: `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        };
    }

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

    function createElement(tag, classes = [], attributes = {}) {
        const el = document.createElement(tag);
        classes.forEach(cls => el.classList.add(cls));
        Object.entries(attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
        return el;
    }

    /* ============================================
    TOAST NOTIFICATION SYSTEM
    ============================================ */
    const ToastManager = {
        container: null,

        init() {
            this.container = document.getElementById('toast-container');
            if (!this.container) {
                this.container = createElement('div', ['toast-container'], { id: 'toast-container' });
                document.body.appendChild(this.container);
            }
        },

        show(message, type = 'info', icon = '📜') {
            if (!this.container) this.init();
            const toast = createElement('div', ['toast', type]);
            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            `;
            this.container.appendChild(toast);
            STATE.activeToasts.push(toast);

            toast.offsetHeight;
            toast.style.animation = 'toast-in 0.5s ease-out forwards';

            setTimeout(() => {
                this.hide(toast);
            }, CONFIG.toastDuration);

            return toast;
        },

        hide(toast) {
            if (!toast || !toast.parentNode) return;
            toast.classList.add('hiding');
            toast.style.animation = 'toast-out 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                const index = STATE.activeToasts.indexOf(toast);
                if (index > -1) STATE.activeToasts.splice(index, 1);
            }, 300);
        },

        success(message) {
            return this.show(message, 'success', '✓');
        },

        warning(message) {
            return this.show(message, 'warning', '⚠');
        },

        error(message) {
            return this.show(message, 'error', '✗');
        },

        info(message) {
            return this.show(message, 'info', '📜');
        }
    };

    /* ============================================
    BID MODAL
    ============================================ */
    const BidModal = {
        modal: null,
        isVisible: false,

        init() {
            this.modal = document.getElementById('bid-modal');
            if (this.modal) {
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) this.hide();
                });
                const closeBtn = this.modal.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.hide());
                }
            }
        },

        show(lotTitle, bidAmount) {
            if (!this.modal) this.init();
            if (this.isVisible) return;

            const title = this.modal.querySelector('.modal-title');
            const message = this.modal.querySelector('.modal-message');
            const amount = this.modal.querySelector('.modal-amount');

            if (title) title.textContent = 'Bid Accepted';
            if (message) message.textContent = `Your soul has been reserved for: ${lotTitle}`;
            if (amount) amount.innerHTML = `<span class="currency">☠</span> ${formatNumber(bidAmount)} Souls`;

            this.modal.classList.add('visible');
            this.isVisible = true;

            this.modal.style.animation = 'none';
            this.modal.offsetHeight;
            this.modal.style.animation = 'modal-fade-in 0.3s ease-out forwards';

            setTimeout(() => this.hide(), CONFIG.modalCloseDelay);
        },

        hide() {
            if (!this.modal || !this.isVisible) return;
            this.modal.style.animation = 'modal-fade-out 0.3s ease-in forwards';
            setTimeout(() => {
                this.modal.classList.remove('visible');
                this.isVisible = false;
            }, 300);
        }
    };

    /* ============================================
    TIMER SYSTEM
    ============================================ */
    const TimerSystem = {
        timers: new Map(),

        init() {
            document.querySelectorAll('.lot-timer-section').forEach(section => {
                const lot = section.closest('.auction-lot');
                if (!lot) return;
                const lotId = lot.dataset.lotId;
                const digits = section.querySelectorAll('.timer-digit');
                if (digits.length >= 3) {
                    const initialSeconds = this.parseTimerDigits(digits);
                    this.timers.set(lotId, {
                        element: section,
                        digits: Array.from(digits),
                        totalSeconds: initialSeconds,
                        interval: null
                    });
                }
            });
            this.startAllTimers();
        },

        parseTimerDigits(digits) {
            const hours = parseInt(digits[0]?.textContent) || 0;
            const minutes = parseInt(digits[1]?.textContent) || 0;
            const seconds = parseInt(digits[2]?.textContent) || 0;
            return hours * 3600 + minutes * 60 + seconds;
        },

        startAllTimers() {
            this.timers.forEach((timer, lotId) => {
                if (!timer.interval) {
                    timer.interval = setInterval(() => this.updateTimer(lotId), CONFIG.updateInterval);
                }
            });
        },

        stopTimer(lotId) {
            const timer = this.timers.get(lotId);
            if (timer && timer.interval) {
                clearInterval(timer.interval);
                timer.interval = null;
            }
        },

        updateTimer(lotId) {
            const timer = this.timers.get(lotId);
            if (!timer) return;

            timer.totalSeconds--;

            if (timer.totalSeconds < 0) {
                this.handleTimerEnd(lotId, timer);
                return;
            }

            const time = formatTime(timer.totalSeconds);
            if (timer.digits[0]) timer.digits[0].textContent = time.hours;
            if (timer.digits[1]) timer.digits[1].textContent = time.minutes;
            if (timer.digits[2]) timer.digits[2].textContent = time.seconds;

            this.updateUrgency(timer);

            if (Math.random() < 0.02) {
                this.triggerFlicker(timer);
            }
        },

        updateUrgency(timer) {
            const display = timer.element.querySelector('.timer-display');
            if (!display) return;
            const digits = display.querySelector('.timer-digits');
            if (!digits) return;

            digits.classList.remove('urgent', 'soon');

            if (timer.totalSeconds <= 120) {
                digits.classList.add('urgent');
            } else if (timer.totalSeconds <= 300) {
                digits.classList.add('soon');
            }
        },

        triggerFlicker(timer) {
            const display = timer.element.querySelector('.timer-display');
            if (!display) return;

            const originalOpacity = display.style.opacity;
            display.style.opacity = '0.5';
            setTimeout(() => { display.style.opacity = '1'; }, 50);
            setTimeout(() => { display.style.opacity = '0.7'; }, 100);
            setTimeout(() => { display.style.opacity = originalOpacity || '1'; }, 150);
        },

        handleTimerEnd(lotId, timer) {
            this.stopTimer(lotId);
            const lot = document.querySelector(`[data-lot-id="${lotId}"]`);
            if (!lot) return;

            const statusEl = lot.querySelector('.lot-status');
            if (statusEl) {
                statusEl.textContent = '● SOLD';
                statusEl.classList.remove('status-active', 'status-ending', 'status-soon');
                statusEl.style.color = 'var(--color-text-muted)';
            }

            ToastManager.warning(`Lot #${lotId} has ended! The curse passes to a new owner.`);

            lot.style.animation = 'lot-ending 0.5s ease-out forwards';

            const bidSubmit = lot.querySelector('.bid-submit');
            if (bidSubmit) {
                bidSubmit.disabled = true;
                bidSubmit.style.opacity = '0.5';
                bidSubmit.style.pointerEvents = 'none';
            }
        },

        addTime(lotId, seconds) {
            const timer = this.timers.get(lotId);
            if (timer) {
                timer.totalSeconds += seconds;
                this.updateTimerDisplay(timer);
            }
        },

        updateTimerDisplay(timer) {
            const time = formatTime(timer.totalSeconds);
            if (timer.digits[0]) timer.digits[0].textContent = time.hours;
            if (timer.digits[1]) timer.digits[1].textContent = time.minutes;
            if (timer.digits[2]) timer.digits[2].textContent = time.seconds;
        }
    };

    /* ============================================
    BID SYSTEM
    ============================================ */
    const BidSystem = {
        init() {
            document.querySelectorAll('.auction-lot').forEach(lot => {
                this.setupLotBidding(lot);
            });
        },

        setupLotBidding(lot) {
            const lotId = lot.dataset.lotId;
            const bidInput = lot.querySelector('.bid-input');
            const decreaseBtn = lot.querySelector('.bid-decrease');
            const increaseBtn = lot.querySelector('.bid-increase');
            const submitBtn = lot.querySelector('.bid-submit');
            const currentBidEl = lot.querySelector('.bid-amount .amount');
            const incrementEl = lot.querySelector('.increment-text');

            if (!bidInput || !submitBtn) return;

            const currentBid = parseInt(currentBidEl?.textContent.replace(/,/g, '')) || 0;
            const increment = this.parseIncrement(incrementEl?.textContent);
            const minBid = currentBid + increment;

            bidInput.value = minBid;
            bidInput.min = minBid;

            decreaseBtn?.addEventListener('click', () => {
                const current = parseInt(bidInput.value) || minBid;
                const newValue = Math.max(minBid, current - increment);
                bidInput.value = newValue;
                this.animateBidChange(bidInput, 'decrease');
            });

            increaseBtn?.addEventListener('click', () => {
                const current = parseInt(bidInput.value) || minBid;
                const newValue = current + increment;
                bidInput.value = newValue;
                this.animateBidChange(bidInput, 'increase');
            });

            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitBid(lot, lotId, parseInt(bidInput.value));
            });

            bidInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.submitBid(lot, lotId, parseInt(bidInput.value));
                }
            });
        },

        parseIncrement(text) {
            if (!text) return CONFIG.bidIncrementBase;
            const match = text.match(/\+?(\d+)/);
            return match ? parseInt(match[1]) : CONFIG.bidIncrementBase;
        },

        animateBidChange(input, direction) {
            input.style.transform = direction === 'increase' ? 'scale(1.1)' : 'scale(0.95)';
            input.style.color = direction === 'increase' ? 'var(--color-gold-bright)' : 'var(--color-blood)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
                input.style.color = '';
            }, 150);
        },

        submitBid(lot, lotId, amount) {
            const currentBidEl = lot.querySelector('.bid-amount .amount');
            const incrementEl = lot.querySelector('.increment-text');

            const currentBid = parseInt(currentBidEl?.textContent.replace(/,/g, '')) || 0;
            const increment = this.parseIncrement(incrementEl?.textContent);
            const minBid = currentBid + increment;

            if (amount < minBid) {
                ToastManager.error(`Bid must be at least ${formatNumber(minBid)} souls!`);
                return;
            }

            this.animateBloodDrip(lot);
            this.updateCurrentBid(lot, amount);
            this.addBidHistory(lotId, amount);

            submitBtn.classList.add('success');
            setTimeout(() => submitBtn.classList.remove('success'), 500);

            const title = lot.querySelector('.lot-title')?.textContent || 'Unknown Item';
            BidModal.show(title, amount);

            if (Math.random() < 0.3) {
                TimerSystem.addTime(lotId, randomInt(30, 120));
                ToastManager.info('Your bid has extended the auction!');
            }

            bidInput.value = amount + increment;
            bidInput.min = amount + increment;
        },

        updateCurrentBid(lot, newAmount) {
            const amountEl = lot.querySelector('.bid-amount .amount');
            if (!amountEl) return;

            amountEl.style.animation = 'none';
            amountEl.offsetHeight;
            amountEl.style.animation = 'bid-update 0.5s ease-out';
            amountEl.textContent = formatNumber(newAmount);

            const incrementEl = lot.querySelector('.increment-text');
            if (incrementEl) {
                const newIncrement = Math.ceil(newAmount * 0.02);
                incrementEl.textContent = `+${formatNumber(newIncrement)} souls`;
            }

            const historyToggle = lot.querySelector('.history-toggle-btn .history-count');
            if (historyToggle) {
                const match = historyToggle.textContent.match(/\((\d+)/);
                if (match) {
                    const count = parseInt(match[1]) + 1;
                    historyToggle.textContent = `(${count} bids)`;
                }
            }
        },

        animateBloodDrip(lot) {
            const drip = lot.querySelector('.increment-drip');
            if (!drip) return;

            const drop = document.createElement('div');
            drop.className = 'blood-drop-animation';
            drop.innerHTML = '<div class="drip-particle"></div>';
            drip.appendChild(drop);

            setTimeout(() => {
                drop.style.animation = 'blood-drop-anim 1s ease-in forwards';
            }, 10);

            setTimeout(() => {
                if (drop.parentNode) drop.parentNode.removeChild(drop);
            }, 1000);
        },

        addBidHistory(lotId, amount) {
            const lot = document.querySelector(`[data-lot-id="${lotId}"]`);
            if (!lot) return;

            const historyEntries = lot.querySelector('.history-entries');
            if (!historyEntries) return;

            const names = [
                'The Hollow Count', 'Madame Vesper', 'The Bargain Hunter',
                'Archon of the Ninth Circle', 'Anonymous Wraith', 'The Pale Collector',
                'Whispers in the Void', 'He Who Bargains', 'The Forgotten Heir',
                'Voice from the Abyss', 'The Patient One', 'Shadow of Valdoria'
            ];

            const newEntry = document.createElement('div');
            newEntry.className = 'history-entry spectral';
            newEntry.innerHTML = `
                <span class="bidder-name">${names[randomInt(0, names.length - 1)]}</span>
                <span class="bidder-amount">${formatNumber(amount)}</span>
                <span class="bid-time">Just now</span>
            `;

            historyEntries.insertBefore(newEntry, historyEntries.firstChild);

            newEntry.style.opacity = '0';
            newEntry.style.transform = 'translateY(-10px)';

            requestAnimationFrame(() => {
                newEntry.style.transition = 'all 0.3s ease-out';
                newEntry.style.opacity = '1';
                newEntry.style.transform = 'translateY(0)';
            });

            historyEntries.querySelectorAll('.history-entry:not(:first-child) .bid-time').forEach(time => {
                const match = time.textContent.match(/(\d+):(\d+)/);
                if (match) {
                    const mins = parseInt(match[1]);
                    const secs = parseInt(match[2]) + 1;
                    if (secs >= 60) {
                        time.textContent = `${mins + 1}:00 ago`;
                    } else {
                        time.textContent = `${mins}:${String(secs).padStart(2, '0')} ago`;
                    }
                }
            });
        },

        getRandomBidder() {
            const names = [
                'The Hollow Count', 'Madame Vesper', 'The Bargain Hunter',
                'Archon of the Ninth Circle', 'Anonymous Wraith',
                'The Pale Collector', 'Whispers in the Void', 'He Who Bargains'
            ];
            return names[randomInt(0, names.length - 1)];
        }
    };

    /* ============================================
    LORE PANEL SYSTEM
    ============================================ */
    const LoreSystem = {
        init() {
            document.querySelectorAll('.lore-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleLorePanel(button);
                });
                button.addEventListener('mouseenter', () => this.playWhisper(button));
            });
        },

        toggleLorePanel(button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const lot = button.closest('.auction-lot');
            const panel = lot?.querySelector('.lore-panel');
            if (!panel) return;

            button.setAttribute('aria-expanded', !isExpanded);

            const textEl = button.querySelector('.lore-text');
            if (textEl) {
                textEl.textContent = isExpanded ? 'Reveal Forbidden Lore' : 'Seal the Lore';
            }

            if (isExpanded) {
                panel.classList.remove('visible');
                this.breakSeal(panel);
            } else {
                panel.classList.add('visible');
                panel.querySelectorAll('.lore-seal').forEach(seal => {
                    seal.style.opacity = '0.3';
                });
            }
        },

        breakSeal(panel) {
            const seal = panel.querySelector('.lore-seal');
            if (!seal) return;

            seal.style.transition = 'all 0.5s ease-out';
            seal.style.transform = 'translateY(-50%) scale(1.2) rotate(15deg)';

            setTimeout(() => {
                seal.style.opacity = '0';
                seal.style.transform = 'translateY(-50%) scale(0) rotate(360deg)';
            }, 500);
        },

        playWhisper(button) {
            const lot = button.closest('.auction-lot');
            const title = lot?.querySelector('.lot-title');
            if (title) {
                title.style.transition = 'transform 0.3s ease-out';
                title.style.transform = 'translateX(2px)';
                setTimeout(() => {
                    title.style.transform = 'translateX(0)';
                }, 150);
                this.playWhisperSound();
            }
        },

        playWhisperSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                // Audio not supported
            }
        }
    };

    /* ============================================
    BID HISTORY SYSTEM
    ============================================ */
    const HistorySystem = {
        init() {
            document.querySelectorAll('.history-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => this.toggleHistory(btn));
            });
        },

        toggleHistory(button) {
            const lot = button.closest('.auction-lot');
            const history = lot?.querySelector('.bid-history');
            if (!history) return;

            history.classList.toggle('visible');

            const arrow = button.querySelector('span:first-child');
            if (arrow) {
                arrow.textContent = history.classList.contains('visible') ? '⏱ Hide History' : '⏱ Bid History';
            }
        }
    };

    /* ============================================
    WATCHLIST SYSTEM
    ============================================ */
    const WatchlistSystem = {
        init() {
            document.querySelectorAll('.watch-button').forEach(btn => {
                btn.addEventListener('click', () => this.toggleWatch(btn));
            });
        },

        toggleWatch(button) {
            const lot = button.closest('.auction-lot');
            if (!lot) return;

            const lotId = lot.dataset.lotId;
            const isWatched = STATE.watchlist.has(lotId);

            if (isWatched) {
                STATE.watchlist.delete(lotId);
                button.classList.remove('active');
                button.querySelector('.watch-icon').textContent = '♡';
                ToastManager.info('Item removed from your watchlist.');
            } else {
                STATE.watchlist.add(lotId);
                button.classList.add('active');
                button.querySelector('.watch-icon').textContent = '♥';
                button.style.animation = 'heart-beat 0.5s ease-out';
                setTimeout(() => {
                    button.style.animation = '';
                }, 500);
                ToastManager.success('Item added to your watchlist!');
            }
        }
    };

    /* ============================================
    SPECTRAL BIDDERS SYSTEM
    ============================================ */
    const SpectralBidders = {
        init() {
            document.querySelectorAll('.spectral-bidders').forEach(container => {
                this.animateBidders(container);
            });
        },

        animateBidders(container) {
            const bidders = container.querySelectorAll('.spectral-bidder');
            if (bidders.length === 0) return;

            function animate() {
                const randomBidder = bidders[randomInt(0, bidders.length - 1)];
                randomBidder.style.opacity = '0.2';
                setTimeout(() => {
                    randomBidder.style.opacity = '1';
                }, randomInt(1000, 3000));
                setTimeout(animate, randomInt(2000, 5000));
            }

            setTimeout(animate, randomInt(500, 2000));
        },

        updateBidders(container, newBidder) {
            const bidders = container.querySelector('.bidders-list');
            if (!bidders) return;

            const bidderEls = bidders.querySelectorAll('.spectral-bidder');
            for (let i = bidderEls.length - 1; i > 0; i--) {
                bidderEls[i].textContent = bidderEls[i - 1].textContent;
            }

            bidderEls[0].textContent = newBidder;
            bidderEls[0].style.animation = 'none';
            bidderEls[0].offsetHeight;
            bidderEls[0].style.animation = 'spectral-new 0.5s ease-out';
        }
    };

    /* ============================================
    VISITOR COUNTER SYSTEM
    ============================================ */
    const VisitorSystem = {
        init() {
            const countEl = document.getElementById('visitor-count');
            if (countEl) {
                this.animateVisitorCount(countEl);
                setInterval(() => this.updateVisitorCount(countEl), CONFIG.visitorUpdateInterval);
            }
        },

        animateVisitorCount(element) {
            const target = parseInt(element.textContent.replace(/,/g, '')) || STATE.visitorCount;
            let current = 0;
            const increment = Math.ceil(target / 50);

            function animate() {
                current += increment;
                if (current >= target) {
                    element.textContent = formatNumber(target);
                } else {
                    element.textContent = formatNumber(current);
                    requestAnimationFrame(animate);
                }
            }
            animate();
        },

        updateVisitorCount(element) {
            const change = randomInt(-15, 25);
            STATE.visitorCount = Math.max(1000, STATE.visitorCount + change);
            element.textContent = formatNumber(STATE.visitorCount);
            element.style.animation = 'none';
            element.offsetHeight;
            element.style.animation = 'visitor-pulse 0.5s ease-out';
        }
    };

    /* ============================================
    NAVIGATION SYSTEM
    ============================================ */
    const Navigation = {
        init() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setActiveSection(link.dataset.section);
                });
                link.addEventListener('mouseenter', () => this.playNavSound());
            });
        },

        setActiveSection(section) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === section);
            });

            if (section === 'current') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (section === 'upcoming') {
                const upcomingSection = document.querySelector('.upcoming-section');
                if (upcomingSection) {
                    upcomingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            ToastManager.info(`Browsing ${section}...`);
        },

        playNavSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                // Audio not supported
            }
        }
    };

    /* ============================================
    AMBIENT EFFECTS
    ============================================ */
    const AmbientEffects = {
        particles: [],

        init() {
            this.createFloatingParticles();
            this.animateHeaderRunes();
            this.animateEye();
            this.addScrollEffects();
        },

        createFloatingParticles() {
            const container = document.querySelector('.ambient-particles');
            if (!container) return;

            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'ambient-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${randomInt(2, 5)}px;
                    height: ${randomInt(2, 5)}px;
                    background: ${Math.random() > 0.5 ? 'var(--color-gold)' : 'var(--color-spectral)'};
                    border-radius: 50%;
                    opacity: ${randomFloat(0.1, 0.4)};
                    left: ${randomInt(5, 95)}%;
                    top: ${randomInt(10, 90)}%;
                    animation: float-particle ${randomInt(10, 20)}s infinite ease-in-out;
                    animation-delay: -${randomInt(0, 10)}s;
                `;
                container.appendChild(particle);
                this.particles.push(particle);
            }
        },

        animateHeaderRunes() {
            const runes = document.querySelectorAll('.rune');
            if (runes.length === 0) return;

            runes.forEach((rune, index) => {
                setInterval(() => {
                    if (Math.random() < 0.1) {
                        rune.style.color = 'var(--color-gold-bright)';
                        rune.style.textShadow = '0 0 10px var(--color-gold)';
                        setTimeout(() => {
                            rune.style.color = '';
                            rune.style.textShadow = '';
                        }, 500);
                    }
                }, 1000);
            });
        },

        animateEye() {
            const eye = document.querySelector('.occult-eye');
            if (!eye) return;

            setInterval(() => {
                if (Math.random() < 0.05) {
                    eye.style.transform = 'scale(1.1)';
                    const eyeSvg = eye.querySelector('.eye-svg');
                    if (eyeSvg) {
                        eyeSvg.style.filter = 'drop-shadow(0 0 30px var(--color-gold-bright))';
                    }
                    setTimeout(() => {
                        eye.style.transform = 'scale(1)';
                        if (eyeSvg) {
                            eyeSvg.style.filter = '';
                        }
                    }, 300);
                }
            }, 2000);
        },

        addScrollEffects() {
            let lastScrollY = window.scrollY;
            const onScroll = throttle(() => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY) {
                    document.querySelectorAll('.spectral-smoke').forEach(smoke => {
                        smoke.style.transform = `translateY(${currentScrollY * 0.1}px)`;
                    });
                }
                lastScrollY = currentScrollY;
            }, 16);
            window.addEventListener('scroll', onScroll);
        }
    };

    /* ============================================
    BID SIMULATION
    ============================================ */
    const BidSimulation = {
        interval: null,

        init() {
            this.interval = setInterval(() => this.simulateRandomBid(), randomInt(10000, 30000));
        },

        simulateRandomBid() {
            const lots = document.querySelectorAll('.auction-lot[data-lot-id]');
            if (lots.length === 0) return;

            const randomLot = lots[randomInt(0, lots.length - 1)];
            const lotId = randomLot.dataset.lotId;
            const currentBidEl = randomLot.querySelector('.bid-amount .amount');
            const currentBid = parseInt(currentBidEl?.textContent.replace(/,/g, '')) || 0;
            const increment = Math.ceil(currentBid * randomFloat(0.01, 0.03));
            const newBid = currentBid + increment;

            BidSystem.updateCurrentBid(randomLot, newBid);
            BidSystem.addBidHistory(lotId, newBid);

            const spectralBidders = randomLot.querySelector('.spectral-bidders');
            if (spectralBidders) {
                SpectralBidders.updateBidders(spectralBidders, BidSystem.getRandomBidder());
            }

            if (Math.random() < 0.2) {
                TimerSystem.addTime(lotId, randomInt(15, 60));
            }
        },

        stop() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    };

    /* ============================================
    CANDLE FLAME ENHANCEMENT
    ============================================ */
    const CandleFlames = {
        init() {
            document.querySelectorAll('.candle-flame, .candle-flame-mini').forEach(flame => {
                this.enhanceFlame(flame);
            });
        },

        enhanceFlame(flame) {
            setInterval(() => {
                if (Math.random() < 0.1) {
                    const inner = flame.querySelector('.flame-inner, .flame-inner-mini');
                    if (inner) {
                        const originalTransform = inner.style.transform;
                        inner.style.transition = 'transform 0.1s ease-out';
                        inner.style.transform = `translateX(-50%) scaleY(${randomFloat(0.9, 1.1)}) scaleX(${randomFloat(0.9, 1.1)})`;
                        setTimeout(() => {
                            inner.style.transform = originalTransform || 'translateX(-50%)';
                        }, 100);
                    }
                }
            }, 200);

            setInterval(() => {
                const glow = flame.querySelector('.flame-glow, .flame-glow-mini');
                if (glow) {
                    glow.style.opacity = randomFloat(0.6, 1);
                }
            }, 500);
        }
    };

    /* ============================================
    SCROLL ANIMATIONS
    ============================================ */
    const ScrollAnimations = {
        observer: null,

        init() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateIn(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.auction-lot').forEach(lot => {
                lot.style.opacity = '0';
                lot.style.transform = 'translateY(30px)';
                this.observer.observe(lot);
            });

            document.querySelectorAll('.upcoming-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                this.observer.observe(card);
            });
        },

        animateIn(element) {
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    };

    /* ============================================
    KEYBOARD NAVIGATION
    ============================================ */
    const KeyboardNav = {
        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    BidModal.hide();
                }
                if (e.key >= '1' && e.key <= '7') {
                    const index = parseInt(e.key) - 1;
                    const lots = document.querySelectorAll('.auction-lot');
                    if (lots[index]) {
                        const submitBtn = lots[index].querySelector('.bid-submit');
                        if (submitBtn && !submitBtn.disabled) {
                            submitBtn.click();
                        }
                    }
                }
            });
        }
    };

    /* ============================================
    INJECT ADDITIONAL ANIMATIONS
    ============================================ */
    function injectAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes lot-ending {
                0% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(0.98); filter: brightness(1.5) saturate(0.5); }
                100% { transform: scale(1); filter: brightness(0.7) saturate(0.5); opacity: 0.7; }
            }
            @keyframes bid-update {
                0% { transform: scale(1.2); color: var(--color-gold-bright); text-shadow: 0 0 20px var(--color-gold); }
                100% { transform: scale(1); }
            }
            @keyframes visitor-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); color: var(--color-spectral-glow); }
                100% { transform: scale(1); }
            }
            @keyframes blood-drop-anim {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(20px) scale(0.5); opacity: 0; }
            }
            .drip-particle {
                position: absolute;
                width: 6px;
                height: 8px;
                background: var(--color-blood);
                border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
                left: 50%;
                transform: translateX(-50%);
            }
            @keyframes spectral-new {
                0% { opacity: 0; transform: translateY(-10px); color: var(--color-gold); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes modal-fade-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /* ============================================
    INITIALIZATION
    ============================================ */
    function init() {
        if (STATE.isInitialized) return;
        STATE.isInitialized = true;

        console.log('%c☠ The Obsidian Gavel ☠', 'color: #d4af37; font-size: 24px; font-weight: bold;');
        console.log('%cWelcome to the Forbidden Auction House', 'color: #8b2525; font-size: 14px;');
        console.log('%cAll bids are final. All souls are binding.', 'color: #6b1c1c; font-style: italic;');

        injectAnimations();
        ToastManager.init();
        BidModal.init();
        TimerSystem.init();
        BidSystem.init();
        LoreSystem.init();
        HistorySystem.init();
        WatchlistSystem.init();
        SpectralBidders.init();
        VisitorSystem.init();
        Navigation.init();
        AmbientEffects.init();
        BidSimulation.init();
        CandleFlames.init();
        ScrollAnimations.init();
        KeyboardNav.init();

        setTimeout(() => {
            ToastManager.info('The auction house awakens. Browse at your own peril...');
        }, 1500);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            BidSimulation.stop();
        } else {
            BidSimulation.init();
        }
    });

    // Expose to global
    window.AuctionHouse = {
        STATE,
        ToastManager,
        BidModal,
        TimerSystem,
        BidSystem,
        LoreSystem,
        HistorySystem,
        WatchlistSystem,
        SpectralBidders,
        VisitorSystem,
        Navigation,
        AmbientEffects,
        BidSimulation,
        CandleFlames,
        ScrollAnimations,
        KeyboardNav
    };

})();