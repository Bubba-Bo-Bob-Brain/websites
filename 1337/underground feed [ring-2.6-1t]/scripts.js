// ═══════════════════════════════════════════════════════════════
// NEURA_LINK // SEVEN // CYBERPUNK UNDERGROUND FEED v3.7.2
// Main Application Script
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── Boot Sequence Console Log ──────────────────────────────
    const bootLog = [
        { time: 'T+0ms',  msg: 'NEURAL INTERFACE v3.7.2 — INITIALIZING',         color: '#00fff2' },
        { time: 'T+120ms', msg: 'Loading darknet protocol stack...',              color: '#8892a8' },
        { time: 'T+240ms', msg: 'Establishing encrypted tunnel (AES-512-GCM)...',  color: '#8892a8' },
        { time: 'T+410ms', msg: 'Tunnel established — routing through 7 proxies',  color: '#00ff88' },
        { time: 'T+580ms', msg: 'Authenticating biometric key...',                 color: '#8892a8' },
        { time: 'T+720ms', msg: 'Biometric verified — Welcome, NightChild77',      color: '#00fff2' },
        { time: 'T+890ms', msg: 'Loading feed cache (142 entries)...',             color: '#8892a8' },
        { time: 'T+1.2s',  msg: 'Decryption keys loaded — 3 active sessions',     color: '#b44dff' },
        { time: 'T+1.5s',  msg: 'Threat assessment: ELEVATED — Stay sharp',        color: '#ff6600' },
        { time: 'T+1.8s',  msg: 'NET_CONNECTED — You are the network',             color: '#00fff2' },
    ];

    console.log('%c', 'background: #0a0a0f; padding: 20px; border-radius: 8px; border: 1px solid #00fff2;');
    console.log('%c  ███╗   ██╗███████╗██╗  ██╗ █████╗ ██╗     ', 'color: #00fff2; font-size: 12px; background: #0a0a0f; padding: 4px;');
    console.log('%c  ████╗  ██║██╔════╝██║ ██╔╝██╔══██╗██║     ', 'color: #00fff2; font-size: 12px; background: #0a0a0f; padding: 4px;');
    console.log('%c  ██╔██╗ ██║█████╗  █████╔╝ ███████║██║     ', 'color: #00fff2; font-size: 12px; background: #0a0a0f; padding: 4px;');
    console.log('%c  ██║╚██╗██║██╔══╝  ██╔═██╗ ██╔══██║██║     ', 'color: #00fff2; font-size: 12px; background: #0a0a0f; padding: 4px;');
    console.log('%c  ██║ ╚████║███████╗██║  ██╗██║  ██║███████╗', 'color: #00fff2; font-size: 12px; background: #0a0a0f; padding: 4px;');
    console.log('%c  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝', 'color: #00fff2; font-size: 12px; background: #0a0a0f; padding: 4px; margin-bottom: 10px;');

    bootLog.forEach((entry, i) => {
        setTimeout(() => {
            console.log(`%c[${entry.time}] ${entry.msg}`, `color: ${entry.color}; font-family: 'Share Tech Mono', monospace; font-size: 12px;`);
        }, i * 180);
    });

    // ── DOM References ─────────────────────────────────────────
    const traceWarning = document.getElementById('traceWarning');
    const traceProgress = document.getElementById('traceProgress');
    const traceTimerEl = document.getElementById('traceTimer');
    const traceIdEl = document.getElementById('traceId');
    const purgeBtn = document.getElementById('purgeBtn');
    const ghostBtn = document.getElementById('ghostBtn');
    const hudClock = document.getElementById('hudClock');
    const composeInput = document.querySelector('.compose-input');
    const feedPosts = document.querySelector('.feed-posts');
    const scanlines = document.getElementById('scanlines');

    // ══════════════════════════════════════════════════════════
    // 1. HUD CLOCK
    // ══════════════════════════════════════════════════════════
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        hudClock.textContent = `${h}:${m}:${s}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ══════════════════════════════════════════════════════════
    // 2. TRACE DETECTION SYSTEM
    // ══════════════════════════════════════════════════════════
    const traceEntities = [
        'Arasaka Counter-Intelligence',
        'Militech NetWatch Division',
        'NC CyberSec Task Force',
        'NetWatch AI "Cerberus"',
        'Biotechnica Internal Security',
        'Kang Tao Tactical Ops',
    ];

    let traceActive = false;
    let traceCountdown = 15;
    let traceInterval = null;

    function generateTraceId() {
        const chars = '0123456789ABCDEF';
        let id = '';
        for (let i = 0; i < 12; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
            if (i > 0 && i % 4 === 3 && i < 11) id += '-';
        }
        return id;
    }

    function startTrace() {
        if (traceActive) return;
        traceActive = true;
        traceCountdown = 12 + Math.floor(Math.random() * 8);

        traceIdEl.textContent = generateTraceId();
        traceProgress.style.width = '0%';
        traceTimerEl.textContent = traceCountdown;
        traceWarning.classList.remove('hidden');

        // Add glitch effect to scanlines
        scanlines.style.animationDuration = '0.5s';
        document.body.style.filter = 'hue-rotate(10deg) saturate(1.5)';

        const totalSteps = traceCountdown * 10;
        let currentStep = 0;

        traceInterval = setInterval(() => {
            currentStep++;
            const progress = (currentStep / totalSteps) * 100;
            traceProgress.style.width = progress + '%';

            const remaining = Math.ceil(traceCountdown - (traceCountdown * (currentStep / totalSteps)));
            traceTimerEl.textContent = Math.max(1, remaining);

            if (currentStep >= totalSteps) {
                purgeTrace();
            }
        }, 1000);
    }

    function purgeTrace() {
        clearInterval(traceInterval);
        traceActive = false;
        traceWarning.classList.add('hidden');
        scanlines.style.animationDuration = '8s';
        document.body.style.filter = '';

        // Flash effect
        flashScreen('#ff0040', 100);
        addNotification('CACHE PURGED — Trace signature eliminated', 'success');
    }

    function ghostProtocol() {
        clearInterval(traceInterval);
        traceActive = false;
        traceWarning.classList.add('hidden');
        scanlines.style.animationDuration = '8s';
        document.body.style.filter = '';

        // Deep ghost effect
        document.body.style.opacity = '0';
        flashScreen('#00fff2', 300);

        setTimeout(() => {
            document.body.style.opacity = '1';
            addNotification('GHOST PROTOCOL ACTIVE — All traces rerouted', 'success');

            // Temporarily disable trace detection
            setTimeout(() => {}, 30000);
        }, 400);
    }

    purgeBtn.addEventListener('click', purgeTrace);
    ghostBtn.addEventListener('click', ghostProtocol);

    // Random trace trigger (every 45-120 seconds)
    function scheduleRandomTrace() {
        const delay = 45000 + Math.random() * 75000;
        setTimeout(() => {
            if (!traceActive) {
                startTrace();
            }
            scheduleRandomTrace();
        }, delay);
    }
    setTimeout(scheduleRandomTrace, 15000);

    // ── Screen Flash Utility ───────────────────────────────────
    function flashScreen(color, duration) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; inset: 0; z-index: 9998;
            background: ${color}; opacity: 0.4;
            pointer-events: none;
            transition: opacity ${duration}ms ease-out;
        `;
        document.body.appendChild(flash);
        requestAnimationFrame(() => { flash.style.opacity = '0'; });
        setTimeout(() => flash.remove(), duration + 100);
    }

    // ══════════════════════════════════════════════════════════
    // 3. ENCRYPTED BLOCK — HOVER TO DECRYPT
    // ══════════════════════════════════════════════════════════
    function initEncryption() {
        const encryptedBlocks = document.querySelectorAll('.encrypted-block');
        encryptedBlocks.forEach(block => {
            const encryptedEl = block.querySelector('.encrypted-text');
            if (!encryptedEl) return;

            const decryptedText = encryptedEl.getAttribute('data-decrypt');
            if (!decryptedText) return;

            // Create decrypted overlay
            const decryptedEl = document.createElement('div');
            decryptedEl.className = 'encrypted-decrypted';
            decryptedEl.textContent = decryptedText;
            encryptedEl.parentNode.appendChild(decryptedEl);

            // Event listeners for hover
            block.addEventListener('mouseenter', () => {
                block.classList.add('decrypt-active');
            });
            block.addEventListener('mouseleave', () => {
                block.classList.remove('decrypt-active');
            });
        });
    }
    initEncryption();

    // ══════════════════════════════════════════════════════════
    // 4. INTERACTION BUTTONS
    // ══════════════════════════════════════════════════════════
    function initInteractions() {
        document.querySelectorAll('.interaction-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const label = this.querySelector('.int-label');
                const countEl = this.querySelector('.int-count');

                // Visual feedback
                this.classList.add('clicked');
                setTimeout(() => this.classList.remove('clicked'), 300);

                // Ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'click-ripple';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);

                // Handle specific actions
                const action = label ? label.textContent.trim() : '';

                if (action === 'BOOST') {
                    const count = countEl ? parseInt(countEl.textContent) || 0 : 0;
                    if (countEl) countEl.textContent = count + 1;
                    animateCounter(countEl, count + 1);
                    addNotification('Boost registered — Signal amplified', 'info');
                }

                if (action === 'SAVE') {
                    this.classList.toggle('saved');
                    if (this.classList.contains('saved')) {
                        addNotification('Post saved to encrypted vault', 'info');
                    } else {
                        addNotification('Post removed from vault', 'info');
                    }
                }

                if (action === 'REPLY') {
                    addNotification('Opening encrypted channel...', 'info');
                }

                if (action === 'ENCRYPTED_DM' || action === 'FULL_DUMP' || action === 'REQUEST_QUOTE' || action === 'PLACE_BID' || action === 'DOWNLOAD') {
                    addNotification('Encrypted transmission initiated...', 'info');
                }
            });
        });
    }

    function animateCounter(el, target) {
        if (!el) return;
        let current = 0;
        const step = Math.ceil(target / 15);
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current.toLocaleString();
        }, 30);
    }

    initInteractions();

    // ── Click Ripple CSS ───────────────────────────────────────
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .click-ripple {
            position: absolute; inset: 0; border-radius: 5px;
            background: radial-gradient(circle, rgba(0,255,242,0.2) 0%, transparent 70%);
            animation: rippleExpand 0.5s ease-out forwards;
            pointer-events: none;
        }
        @keyframes rippleExpand {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
        .interaction-btn { position: relative; overflow: hidden; }
        .interaction-btn.clicked {
            transform: scale(0.93);
            background: rgba(0,255,242,0.08) !important;
            border-color: rgba(0,255,242,0.3) !important;
        }
        .interaction-btn.saved {
            color: var(--neon-yellow) !important;
            border-color: rgba(255,215,0,0.3) !important;
            background: rgba(255,215,0,0.06) !important;
        }
    `;
    document.head.appendChild(rippleStyle);

    // ══════════════════════════════════════════════════════════
    // 5. COMPOSE POST — AUTO-RESIZE & SUBMIT
    // ══════════════════════════════════════════════════════════
    function initCompose() {
        composeInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Enter to submit (Shift+Enter for newline)
        composeInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitPost();
            }
        });

        // Transmit button
        const postBtn = document.querySelector('.post-btn');
        if (postBtn) {
            postBtn.addEventListener('click', submitPost);
        }
    }

    function submitPost() {
        const text = composeInput.value.trim();
        if (!text) {
            addNotification('Cannot transmit empty broadcast', 'error');
            composeInput.focus();
            return;
        }

        const threatSelect = document.querySelector('.threat-select');
        const threatLevel = threatSelect ? threatSelect.value : 'info';

        // Create new post element
        const post = document.createElement('article');
        post.className = 'post';
        post.setAttribute('data-threat', threatLevel);

        const timeNow = new Date();
        const timeStr = timeNow.toLocaleTimeString('en-US', { hour12: false }) + ' :: 2077.11.15';

        const threatLabels = {
            info: 'STANDARD',
            low: 'LOW',
            moderate: 'MODERATE',
            high: 'HIGH RISK',
            critical: 'CRITICAL'
        };

        post.innerHTML = `
            <div class="post-threat-banner" data-level="${threatLevel}"></div>
            <div class="post-content">
                <div class="post-header">
                    <div class="post-avatar glitchy-avatar my-avatar" style="background: linear-gradient(135deg, #003344, #005566, #003344);"></div>
                    <div class="post-meta">
                        <div class="post-handle-row">
                            <span class="post-handle">@NightChild77</span>
                            <span class="post-verified">✓</span>
                            <span class="post-threat-tag threat-${threatLevel}">${threatLabels[threatLevel] || 'INFO'}</span>
                        </div>
                        <div class="post-rep-row">
                            <span class="post-timestamp">// T-0s :: ${timeStr}</span>
                        </div>
                    </div>
                </div>
                <div class="post-body">
                    <p class="post-text">${escapeHtml(text)}</p>
                </div>
                <div class="post-interactions">
                    <button class="interaction-btn">
                        <span class="int-icon">⬡</span>
                        <span class="int-label">BOOST</span>
                        <span class="int-count">0</span>
                    </button>
                    <button class="interaction-btn">
                        <span class="int-icon">◌</span>
                        <span class="int-label">REPLY</span>
                        <span class="int-count">0</span>
                    </button>
                    <button class="interaction-btn">
                        <span class="int-icon">▣</span>
                        <span class="int-label">ENCRYPTED_DM</span>
                    </button>
                    <button class="interaction-btn">
                        <span class="int-icon">⚑</span>
                        <span class="int-label">SAVE</span>
                    </button>
                </div>
            </div>
        `;

        // Insert at top of feed
        feedPosts.prepend(post);
        composeInput.value = '';
        composeInput.style.height = 'auto';

        // Animate in
        post.style.opacity = '0';
        post.style.transform = 'translateY(-20px)';
        requestAnimationFrame(() => {
            post.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        });

        // Re-init interactions for new post
        initInteractions();
        initEncryption();

        addNotification('Broadcast transmitted to the network', 'success');

        // Re-apply scroll animations
        initScrollAnimations();
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    initCompose();

    // ══════════════════════════════════════════════════════════
    // 6. CODE COPY FUNCTIONALITY
    // ══════════════════════════════════════════════════════════
    function initCodeCopy() {
        document.querySelectorAll('.code-copy').forEach(btn => {
            btn.addEventListener('click', function () {
                const codeBlock = this.closest('.post-codeblock') || this.closest('.code-analysis');
                const code = codeBlock ? codeBlock.querySelector('code') : null;
                if (!code) return;

                const text = code.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const original = this.textContent;
                    this.textContent = 'COPIED_';
                    this.style.color = '#00ff88';
                    setTimeout(() => {
                        this.textContent = original;
                        this.style.color = '';
                    }, 1500);
                    addNotification('Code copied to clipboard', 'success');
                }).catch(() => {
                    addNotification('Copy failed — clipboard restricted', 'error');
                });
            });
        });
    }
    initCodeCopy();

    // ══════════════════════════════════════════════════════════
    // 7. SCROLL TRIGGERED ANIMATIONS
    // ══════════════════════════════════════════════════════════
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.post').forEach((post, i) => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(30px)';
            post.style.transition = `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
            observer.observe(post);
        });
    }
    initScrollAnimations();

    // ══════════════════════════════════════════════════════════
    // 8. CRYPTO TICKER — SIMULATED LIVE UPDATES
    // ══════════════════════════════════════════════════════════
    function initCryptoTicker() {
        const cryptoPrices = {
            BTC: 247832,
            '¥C': 1.00,
            ETH: 18445,
            NIGHT: 0.0042
        };

        setInterval(() => {
            document.querySelectorAll('.crypto-row').forEach(row => {
                const name = row.querySelector('.crypto-name').textContent;
                const priceEl = row.querySelector('.crypto-price');
                const changeEl = row.querySelector('.crypto-change');

                if (cryptoPrices.hasOwnProperty(name)) {
                    const base = cryptoPrices[name];
                    const fluctuation = base * (Math.random() - 0.495) * 0.01;
                    const newPrice = Math.max(0.0001, base + fluctuation);
                    cryptoPrices[name] = newPrice;

                    const change = ((newPrice - base) / base) * 100;

                    if (name === '¥C') {
                        priceEl.textContent = '¥1.00';
                        changeEl.textContent = '0.0%';
                        changeEl.className = 'crypto-change stable';
                    } else if (name === 'NIGHT') {
                        priceEl.textContent = '¥' + newPrice.toFixed(4);
                        changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
                        changeEl.className = 'crypto-change ' + (change >= 0 ? 'up' : 'down');
                    } else {
                        priceEl.textContent = '¥' + Math.round(newPrice).toLocaleString();
                        changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
                        changeEl.className = 'crypto-change ' + (change >= 0 ? 'up' : 'down');
                    }
                }
            });
        }, 4000);
    }
    initCryptoTicker();

    // ══════════════════════════════════════════════════════════
    // 9. NODE STATUS UPDATES
    // ══════════════════════════════════════════════════════════
    function initNodeStatus() {
        const statusMessages = [
            'breaching Arasaka subnet',
            'selling mil-spec ICEbreakers',
            'looking for a decker',
            'in a firefight — need backup',
            'leaking Biotechnica files',
            'tunneling through Blackwall',
            'extracting encrypted payloads',
            'running counter-intel sweep',
            'mapping neural topology',
            'patching ICE vulnerabilities',
            'ghosting through Ward 404',
            'intercepting Militech comms',
            'cracking biometric locks',
            'deploying surveillance daemons',
            'rerouting through dead nodes',
        ];

        setInterval(() => {
            document.querySelectorAll('.node-status').forEach(status => {
                if (Math.random() > 0.5) {
                    const newMsg = statusMessages[Math.floor(Math.random() * statusMessages.length)];
                    status.textContent = newMsg;
                }
            });
        }, 15000);
    }
    initNodeStatus();

    // ══════════════════════════════════════════════════════════
    // 10. GLITCH EFFECTS
    // ══════════════════════════════════════════════════════════
    function randomGlitch() {
        const logo = document.querySelector('.logo-glitch');
        if (!logo) return;

        const intensity = Math.random();
        if (intensity > 0.7) {
            logo.style.textShadow = `
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #ff00ff,
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #00fff2,
                0 0 40px rgba(0, 255, 242, 0.2)
            `;
            setTimeout(() => {
                logo.style.textShadow = 'none';
            }, 100 + Math.random() * 200);
        }
    }

    setInterval(randomGlitch, 3000);

    // Random screen glitch
    function screenGlitch() {
        const glitch = document.createElement('div');
        glitch.style.cssText = `
            position: fixed; inset: 0; z-index: 9997;
            pointer-events: none;
            background: repeating-linear-gradient(
                0deg,
                transparent 0px, transparent 2px,
                rgba(0, 255, 242, ${Math.random() * 0.03}) 2px,
                rgba(0, 255, 242, ${Math.random() * 0.03}) 4px
            );
            mix-blend-mode: overlay;
        `;
        document.body.appendChild(glitch);
        setTimeout(() => glitch.remove(), 50 + Math.random() * 100);
    }

    setInterval(() => {
        if (Math.random() > 0.85) screenGlitch();
    }, 5000);

    // ══════════════════════════════════════════════════════════
    // 11. NOTIFICATION SYSTEM (Toast)
    // ══════════════════════════════════════════════════════════
    function addNotification(message, type) {
        const container = document.getElementById('notification-container') || createNotificationContainer();

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type || 'info'}`;

        const colors = {
            success: '#00ff88',
            error: '#ff0040',
            info: '#00fff2',
            warning: '#ffd700'
        };
        const color = colors[type] || colors.info;

        toast.innerHTML = `
            <div class="toast-border" style="background: ${color};"></div>
            <div class="toast-content">
                <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : '◈'}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }, 3500);

        // Keep max 5 toasts
        while (container.children.length > 5) {
            container.removeChild(container.firstChild);
        }
    }

    function createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            #notification-container {
                position: fixed;
                top: 60px;
                right: 20px;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
                max-width: 360px;
            }

            .toast-notification {
                display: flex;
                align-items: stretch;
                background: #13162aee;
                border: 1px solid rgba(0, 255, 242, 0.15);
                border-radius: 8px;
                overflow: hidden;
                min-height: 50px;
                opacity: 0;
                transform: translateX(60px);
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .toast-notification.visible {
                opacity: 1;
                transform: translateX(0);
            }

            .toast-border {
                width: 3px;
                flex-shrink: 0;
            }

            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 14px;
                flex: 1;
            }

            .toast-icon {
                font-size: 1rem;
                flex-shrink: 0;
            }

            .toast-message {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.78rem;
                color: #e0e6f0;
                line-height: 1.4;
            }

            .toast-notification.success .toast-icon { color: #00ff88; }
            .toast-notification.error .toast-icon { color: #ff0040; }
            .toast-notification.info .toast-icon { color: #00fff2; }
            .toast-notification.warning .toast-icon { color: #ffd700; }

            .toast-notification.success { border-left: 3px solid #00ff88; }
            .toast-notification.error { border-left: 3px solid #ff0040; }
            .toast-notification.info { border-left: 3px solid #00fff2; }
            .toast-notification.warning { border-left: 3px solid #ffd700; }
        `;
        document.head.appendChild(style);
        return container;
    }

    // ══════════════════════════════════════════════════════════
    // 12. RANDOM AMBIENT EVENTS
    // ══════════════════════════════════════════════════════════
    function initAmbientEvents() {
        // Random incoming transmission notification
        const transmissions = [
            'New message from @phantom_exe',
            'Job offer from @fixerNightCity',
            'Payment received from @dataWraith_99',
            'Connection request from @neon_shogun',
            'File share from @chromeDealer_nc',
            'Forum mention: @streetProphet_nc',
            'ICE breach attempt detected',
            'New listing on dark market',
            'Auction LOT 019 now live',
            'Rumor update: Operation Golden Parachute',
        ];

        setInterval(() => {
            if (Math.random() > 0.6) {
                const msg = transmissions[Math.floor(Math.random() * transmissions.length)];
                addNotification('📡 ' + msg, 'warning');
            }
        }, 20000);

        // Occasional screen static
        setInterval(() => {
            if (Math.random() > 0.8) {
                const staticEl = document.createElement('div');
                staticEl.style.cssText = `
                    position: fixed; inset: 0; z-index: 9996;
                    pointer-events: none;
                    opacity: 0;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' fill='%2300fff2' opacity='0.1'/%3E%3C/svg%3E");
                    transition: opacity 0.05s;
                `;
                document.body.appendChild(staticEl);
                requestAnimationFrame(() => { staticEl.style.opacity = '0.3'; });
                setTimeout(() => {
                    staticEl.style.opacity = '0';
                    setTimeout(() => staticEl.remove(), 100);
                }, 80);
            }
        }, 8000);
    }
    initAmbientEvents();

    // ══════════════════════════════════════════════════════════
    // 13. DYNAMIC DATE DISPLAY IN TIMESTAMPS
    // ══════════════════════════════════════════════════════════
    function updateTimestamps() {
        document.querySelectorAll('.post-timestamp').forEach(ts => {
            const text = ts.textContent;
            // Update "T-XXmin" based on real time
            if (text.includes('T-')) {
                const match = text.match(/T-(\d+)(min|h|d)/);
                if (match) {
                    let val = parseInt(match[1]);
                    const unit = match[2];
                    if (unit === 'min') val += 1;
                    ts.textContent = text.replace(/T-\d+min/, `T-${val}min`).replace(/T-\d+h/, `T-${val + 1}h`);
                }
            }
        });
    }
    // Run every 60s
    setInterval(updateTimestamps, 60000);

    // ══════════════════════════════════════════════════════════
    // 14. THREAT TAG COLOR RANDOMIZER (ambient)
    // ══════════════════════════════════════════════════════════
    function ambientThreatPulse() {
        setInterval(() => {
            document.querySelectorAll('.post-threat-tag').forEach(tag => {
                if (Math.random() > 0.85) {
                    tag.style.opacity = '0.5';
                    setTimeout(() => { tag.style.opacity = '1'; }, 200);
                }
            });
        }, 4000);
    }
    ambientThreatPulse();

    // ══════════════════════════════════════════════════════════
    // 15. KEYBOARD SHORTCUTS
    // ══════════════════════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        // Escape to dismiss trace warning
        if (e.key === 'Escape' && traceActive) {
            ghostProtocol();
        }

        // Ctrl+K to focus compose
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            composeInput.focus();
        }

        // G to toggle ghost mode (visual only)
        if (e.key === 'g' && e.shiftKey) {
            document.body.classList.toggle('ghost-mode');
            if (document.body.classList.contains('ghost-mode')) {
                addNotification('GHOST MODE — Visual cloaking active', 'success');
            } else {
                addNotification('GHOST MODE — Disengaged', 'info');
            }
        }
    });

    // ── Ghost Mode CSS Injection ───────────────────────────────
    const ghostStyle = document.createElement('style');
    ghostStyle.textContent = `
        body.ghost-mode .post,
        body.ghost-mode .sidebar,
        body.ghost-mode .hud-status {
            opacity: 0.15 !important;
            filter: blur(2px) grayscale(1);
            transition: all 0.3s ease;
        }
        body.ghost-mode .compose-post,
        body.ghost-mode #notification-container {
            opacity: 1 !important;
            filter: none !important;
            blur: none !important;
        }
    `;
    document.head.appendChild(ghostStyle);

    // ══════════════════════════════════════════════════════════
    // 16. PROFILE HOLOGRAM EFFECT (Mouse Parallax on Avatar)
    // ══════════════════════════════════════════════════════════
    function initHologramEffect() {
        const profileAvatar = document.querySelector('.profile-avatar');
        if (!profileAvatar) return;

        const container = profileAvatar.parentElement;
        container.addEventListener('mousemove', (e) => {
            const rect = profileAvatar.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            profileAvatar.style.transform = `
                perspective(500px)
                rotateY(${x * 8}deg)
                rotateX(${-y * 8}deg)
                translateZ(5px)
            `;
            profileAvatar.style.boxShadow = `
                ${x * 10}px ${y * 10}px 30px rgba(0, 255, 242, 0.15),
                0 0 20px rgba(0, 255, 242, 0.1)
            `;
        });

        container.addEventListener('mouseleave', () => {
            profileAvatar.style.transform = '';
            profileAvatar.style.boxShadow = '';
        });
    }
    initHologramEffect();

    // ══════════════════════════════════════════════════════════
    // 17. NETWORK ACTIVITY INDICATOR
    // ══════════════════════════════════════════════════════════
    function initNetworkActivity() {
        const activityBar = document.createElement('div');
        activityBar.style.cssText = `
            position: fixed; bottom: 0; left: 0; right: 0;
            height: 2px; z-index: 999;
            background: transparent;
            transition: background 0.3s;
            pointer-events: none;
        `;
        document.body.appendChild(activityBar);

        let packetCount = 0;
        setInterval(() => {
            packetCount = Math.floor(Math.random() * 50) + 10;
            const intensity = packetCount / 60;

            activityBar.style.background = `linear-gradient(90deg,
                transparent 0%,
                rgba(0, 255, 242, ${intensity * 0.6}) ${Math.random() * 30}%,
                rgba(180, 77, 255, ${intensity * 0.3}) 50%,
                rgba(0, 255, 242, ${intensity * 0.4}) ${70 + Math.random() * 30}%,
                transparent 100%
            )`;

            // Update netwatch index in sidebar
            const netwatchEl = document.querySelectorAll('.status-val.warn');
            if (netwatchEl.length > 0 && Math.random() > 0.6) {
                const statuses = ['ELEVATED', 'HIGH', 'CRITICAL', 'MODERATE'];
                netwatchEl[0].textContent = statuses[Math.floor(Math.random() * statuses.length)];
            }
        }, 3000);

        // Simulated data packets flying across screen
        setInterval(() => {
            if (Math.random() > 0.5) return;
            const packet = document.createElement('div');
            packet.style.cssText = `
                position: fixed;
                top: ${44 + Math.random() * (window.innerHeight - 80)}px;
                left: -10px;
                width: 3px;
                height: 3px;
                background: var(--neon-cyan);
                border-radius: 50%;
                z-index: 9996;
                pointer-events: none;
                box-shadow: 0 0 6px rgba(0,255,242,0.5);
                animation: packetFly ${1 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(packet);
            setTimeout(() => packet.remove(), 3000);
        }, 2000);

        const packetAnimStyle = document.createElement('style');
        packetAnimStyle.textContent = `
            @keyframes packetFly {
                0% { left: -10px; opacity: 1; transform: scale(1); }
                80% { opacity: 1; }
                100% { left: calc(100vw + 10px); opacity: 0; transform: scale(0.3); }
            }
        `;
        document.head.appendChild(packetAnimStyle);
    }
    initNetworkActivity();

    // ══════════════════════════════════════════════════════════
    // 18. INITIAL LOAD COMPLETE NOTIFICATION
    // ══════════════════════════════════════════════════════════
    setTimeout(() => {
        addNotification('NEURA_LINK SEVEN connected — 47 posts in feed', 'success');
    }, 3000);

    setTimeout(() => {
        addNotification('Warning: 3 new encrypted messages in inbox', 'warning');
    }, 7000);

})();