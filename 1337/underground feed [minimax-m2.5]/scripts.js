/* ============================================
NETRUNNER::UNDERGROUND - Interactive Scripts - v2.4.77
================================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    console.log('◈ NETRUNNER::UNDERGROUND v2.4.77');
    console.log('◈ Systems initializing...');

    // Real-time System Clock
    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    // Trace Warning System
    startTraceSequence();

    // Tab Filtering System
    initTabSystem();

    // Encrypted Content Hover Decryption
    initEncryptionDecrypt();

    // Glitch Avatar Effects
    initGlitchEffects();

    // Hologram Badge Animation
    initHologramEffects();

    // Post Interactions
    initPostInteractions();

    // Threat Monitor Live Feed
    initThreatMonitor();

    // Code Snippet Copy Functionality
    initCodeCopy();

    // Profile Edit Button
    initProfileEdit();

    // New Post & Scan Buttons
    initQuickActions();

    // Staggered Post Animation
    initPostAnimations();

    console.log('◈ All systems operational');
});

/* ============================================
System Clock
================================================ */

function updateSystemClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    const clockElement = document.getElementById('systemClock');
    if (clockElement) {
        // Add slight glitch effect occasionally
        if (Math.random() < 0.02) {
            clockElement.style.textShadow = '2px 0 red, -2px 0 cyan';
            setTimeout(() => {
                clockElement.style.textShadow = '';
            }, 100);
        }
        clockElement.textContent = timeString;
    }
}

/* ============================================
Trace Warning System
================================================ */

let traceTimeout;

function startTraceSequence() {
    // Show trace warning after random delay (5-15 seconds)
    const delay = 5000 + Math.random() * 10000;
    traceTimeout = setTimeout(showTraceWarning, delay);
}

function showTraceWarning() {
    const traceWarning = document.getElementById('traceWarning');
    if (traceWarning) {
        traceWarning.classList.remove('hidden');
        // Auto-dismiss after 10 seconds
        setTimeout(dismissTrace, 10000);
    }
}

function dismissTrace() {
    const traceWarning = document.getElementById('traceWarning');
    if (traceWarning) {
        traceWarning.classList.add('hidden');
        // Schedule next trace after 30-60 seconds
        setTimeout(startTraceSequence, 30000 + Math.random() * 30000);
    }
}

/* ============================================
Tab System
================================================ */

function initTabSystem() {
    const tabs = document.querySelectorAll('.tab');
    const posts = document.querySelectorAll('.feed-post');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Get the feed type
            const feedType = this.dataset.feed;

            // Filter posts
            filterPosts(feedType, posts);
        });
    });
}

function filterPosts(feedType, posts) {
    posts.forEach((post, index) => {
        if (feedType === 'all') {
            post.style.display = 'block';
            animatePostIn(post, index);
        } else {
            // Determine post type based on content
            const postTypeBadge = post.querySelector('.post-type-badge');
            if (postTypeBadge) {
                const badgeText = postTypeBadge.textContent.toLowerCase();
                let shouldShow = false;

                switch(feedType) {
                    case 'jobs':
                        shouldShow = badgeText.includes('contract');
                        break;
                    case 'intel':
                        shouldShow = badgeText.includes('intel');
                        break;
                    case 'market':
                        shouldShow = badgeText.includes('market');
                        break;
                    case 'encrypted':
                        shouldShow = badgeText.includes('encrypted');
                        break;
                }

                if (shouldShow) {
                    post.style.display = 'block';
                    animatePostIn(post, index);
                } else {
                    post.style.display = 'none';
                }
            }
        }
    });
}

function animatePostIn(post, index) {
    post.style.opacity = '0';
    post.style.transform = 'translateY(20px)';
    setTimeout(() => {
        post.style.transition = 'all 0.5s ease';
        post.style.opacity = '1';
        post.style.transform = 'translateY(0)';
    }, index * 100);
}

/* ============================================
Encryption Decryption on Hover
================================================ */

function initEncryptionDecrypt() {
    const encryptedContents = document.querySelectorAll('.encrypted-content');

    encryptedContents.forEach(content => {
        content.addEventListener('mouseenter', function() {
            // Add decrypting animation
            this.style.background = 'rgba(57, 255, 20, 0.05)';
            const cipherText = this.querySelector('.cipher-text');
            if (cipherText) {
                cipherText.style.opacity = '0.5';
                // Typewriter effect
                simulateDecrypt(this);
            }
        });

        content.addEventListener('mouseleave', function() {
            this.style.background = '';
            const cipherText = this.querySelector('.cipher-text');
            if (cipherText) {
                cipherText.style.opacity = '1';
            }
        });
    });
}

function simulateDecrypt(element) {
    const decryptedText = element.querySelector('.decrypted-text');
    if (decryptedText) {
        decryptedText.style.display = 'block';
        decryptedText.style.opacity = '0';
        let opacity = 0;
        const interval = setInterval(() => {
            opacity += 0.1;
            decryptedText.style.opacity = opacity;
            if (opacity >= 1) clearInterval(interval);
        }, 50);
    }
}

/* ============================================
Glitch Avatar Effects
================================================ */

function initGlitchEffects() {
    const avatars = document.querySelectorAll('.glitch-avatar');

    avatars.forEach(avatar => {
        // Random glitch on load
        setTimeout(() => {
            triggerRandomGlitch(avatar);
        }, Math.random() * 2000);

        // Occasional random glitch
        avatar.addEventListener('mouseenter', function() {
            triggerGlitch(this);
        });
    });
}

function triggerGlitch(avatar) {
    const layers = avatar.querySelectorAll('.glitch-layer');
    layers.forEach((layer, index) => {
        layer.style.animation = `glitch-${index + 1} 0.3s ${index * 0.1}s`;
        setTimeout(() => {
            layer.style.animation = '';
        }, 500);
    });
}

function triggerRandomGlitch(avatar) {
    if (Math.random() < 0.3) {
        triggerGlitch(avatar);
    }
    // Schedule next random glitch
    setTimeout(() => {
        triggerRandomGlitch(avatar);
    }, 3000 + Math.random() * 5000);
}

/* ============================================
Hologram Effects
================================================ */

function initHologramEffects() {
    const holograms = document.querySelectorAll('.hologram-effect');

    holograms.forEach(hologram => {
        hologram.addEventListener('mouseenter', function() {
            this.style.animation = 'hologram-scan 0.5s infinite';
        });
        hologram.addEventListener('mouseleave', function() {
            this.style.animation = 'hologram-scan 2s infinite';
        });
    });
}

/* ============================================
Post Interactions
================================================ */

function initPostInteractions() {
    // Accept Contract buttons
    document.querySelectorAll('.action-btn.accept').forEach(btn => {
        btn.addEventListener('click', function() {
            const post = this.closest('.feed-post');
            const title = post.querySelector('.post-title').textContent;
            showNotification(`◈ CONTRACT ACCEPTED: ${title.substring(0, 30)}...`, 'success');
            this.innerHTML = '<span class="btn-icon">◈</span> ACCEPTED';
            this.style.background = 'var(--magenta)';
            this.style.color = 'var(--bg-primary)';
            this.disabled = true;
        });
    });

    // Purchase buttons
    document.querySelectorAll('.action-btn.purchase').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('◈ Contacting seller... Establishing encrypted channel.', 'info');
        });
    });

    // Share buttons
    document.querySelectorAll('.action-btn.share').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('◈ Transmission spread to network. 12 nodes received.', 'success');
            const stat = this.closest('.post-footer').querySelector('.stat:first-child');
            if (stat) {
                const count = parseInt(stat.textContent.match(/\d+/)[0]);
                stat.innerHTML = `<span class="stat-icon">◉</span> ${count + 12} HIDES`;
            }
        });
    });

    // Bookmark functionality
    document.querySelectorAll('.action-btn:not(.accept):not(.purchase):not(.share)').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            if (btnText.includes('WATCHLIST')) {
                showNotification('◈ Added to watchlist', 'success');
                this.innerHTML = '<span class="btn-icon">◈</span> IN WATCHLIST';
            } else if (btnText.includes('DOWNLOAD')) {
                showNotification('◈ Downloading encrypted package...', 'info');
            } else if (btnText.includes('SAVE COORDINATES')) {
                showNotification('◈ Coordinates saved to secure vault', 'success');
            } else if (btnText.includes('TRACE SOURCE')) {
                showNotification('◈ Initiating trace protocol...', 'warning');
                setTimeout(() => {
                    showNotification('◈ Trace failed - source routed through 12 proxy nodes', 'error');
                }, 3000);
            } else if (btnText.includes('DETAILS')) {
                showNotification('◈ Loading contract details...', 'info');
            }
        });
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span class="notif-icon">◈</span> <span class="notif-text">${message}</span>`;

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: var(--bg-secondary);
            border: 1px solid var(--cyan);
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-size: 0.8rem;
            z-index: 10000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-success { border-color: var(--electric-green); }
        .notification-error { border-color: var(--danger-red); }
        .notification-warning { border-color: var(--warning-orange); }
        .notification-info { border-color: var(--cyan); }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

/* ============================================
Threat Monitor Live Feed
================================================ */

function initThreatMonitor() {
    const threatItems = document.querySelectorAll('.threat-item');
    // Add random new threats periodically
    addRandomThreat();
    setInterval(addRandomThreat, 8000);
}

function addRandomThreat() {
    const threatFeed = document.querySelector('.threat-feed');
    if (!threatFeed) return;

    const threats = [
        'NetWatch subnet scan detected',
        'Arasaka ICE patrol active',
        'Biotechnica security update',
        'Militech tracer ping detected',
        'Corporate data breach detected',
        'Unusual network traffic pattern',
        'Encrypted transmission intercepted',
        'New vulnerability discovered',
        'Security patch released',
        'Anonymous user logged in'
    ];

    const threatDescriptions = [
        'Arasaka subnet scan detected',
        'Militech ICE patrol active',
        'NetWatch tracer ping',
        'BioWare security update',
        '!!! ICE BREAK ATTEMPT',
        'Tyger Claws data access',
        'Maelstrom gang activity',
        'Voodoo Boys probe detected',
        'NetWatch decryption attempt',
        'Corporate firewall breach'
    ];

    // Randomly add new threat
    if (Math.random() < 0.4) {
        const newThreat = document.createElement('div');
        newThreat.className = 'threat-item';
        newThreat.style.animation = 'fadeIn 0.5s ease';

        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const desc = threats[Math.floor(Math.random() * threats.length)];

        newThreat.innerHTML = `<span class="threat-time">${time}</span><span class="threat-desc">${desc}</span>`;
        threatFeed.insertBefore(newThreat, threatFeed.firstChild);

        // Keep only last 6 items
        while (threatFeed.children.length > 6) {
            threatFeed.removeChild(threatFeed.lastChild);
        }
    }
}

// Add fadeIn animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }`;
document.head.appendChild(fadeInStyle);

/* ============================================
Code Copy Functionality
================================================ */

function initCodeCopy() {
    document.querySelectorAll('.code-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const codeBlock = this.closest('.code-snippet').querySelector('code');
            const text = codeBlock.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                this.textContent = '[COPIED]';
                this.style.color = 'var(--electric-green)';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            });
        });
    });
}

/* ============================================
Profile Edit
================================================ */

function initProfileEdit() {
    const editBtn = document.querySelector('.profile-edit');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            showNotification('◈ Profile editor not available in underground mode', 'warning');
        });
    }
}

/* ============================================
Quick Actions
================================================ */

function initQuickActions() {
    // New Post button
    const newPostBtn = document.querySelector('.action-btn-large.new-post');
    if (newPostBtn) {
        newPostBtn.addEventListener('click', function() {
            showNotification('◈ New transmission module loading...', 'info');
        });
    }

    // Scan Frequencies button
    const scanBtn = document.querySelector('.action-btn-large.scan');
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            showNotification('◈ Scanning frequencies...', 'info');
            // Visual scanning effect
            this.innerHTML = '<span class="btn-icon-large">◈</span> SCANNING...';
            this.style.animation = 'pulse 0.5s infinite';
            setTimeout(() => {
                this.innerHTML = '<span class="btn-icon-large">◈</span> 3 SIGNALS FOUND';
                this.style.animation = '';
                showNotification('◈ 3 new transmissions intercepted', 'success');
            }, 3000);
        });
    }
}

/* ============================================
Post Animations on Load
================================================ */

function initPostAnimations() {
    const posts = document.querySelectorAll('.feed-post');

    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        setTimeout(() => {
            post.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 150 + 500);
    });
}

/* ============================================
Additional Ambient Effects
================================================ */

// Random screen flicker
setInterval(() => {
    if (Math.random() < 0.05) {
        document.body.style.filter = 'brightness(1.1)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 50 + Math.random() * 100);
    }
}, 2000);

// Random CRT color shift
setInterval(() => {
    if (Math.random() < 0.03) {
        document.body.style.animation = 'color-shift 0.2s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 200);
    }
}, 5000);

// Add color-shift animation
const ambientStyle = document.createElement('style');
ambientStyle.textContent = `@keyframes color-shift { 0%, 100% { filter: none; } 25% { filter: hue-rotate(90deg); } 50% { filter: hue-rotate(180deg) saturate(1.5); } 75% { filter: hue-rotate(270deg); } }`;
document.head.appendChild(ambientStyle);

// Console Easter Egg
console.log(` %c◈ NETRUNNER::UNDERGROUND %c v2.4.77-UNDERGROUND %c◈ PROTECTED BY ENCRYPTION %c◈ NETWATCH: MONITORING `, 'color: #00f0ff; font-weight: bold;', 'color: #ff00aa;', 'color: #39ff14;', 'color: #ff6b00;');
console.log('%c◈ Glitch for fun...', 'color: #888; font-style: italic;');

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('').toLowerCase().includes('arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba')) {
        showNotification('◈ EASTER EGG ACTIVATED - GHOST PROTOCOL UNLOCKED', 'success');
        document.body.style.animation = 'ghost-mode 2s infinite';

        const ghostStyle = document.createElement('style');
        ghostStyle.textContent = `@keyframes ghost-mode { 0%, 100% { filter: invert(0); } 50% { filter: invert(1); } }`;
        document.head.appendChild(ghostStyle);
    }
});