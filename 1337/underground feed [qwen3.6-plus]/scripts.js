// scripts.js

// ==========================================
// NEXUS://UNDERGROUND - INTERACTIVITY SCRIPT
// ==========================================

// Expose functions to window for inline HTML event handlers
window.closeTraceModal = closeTraceModal;
window.openPostModal = openPostModal;
window.closePostModal = closePostModal;

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initFilters();
    initNetworkSimulation();
    initCodeCopy();
    initTraceWarning();
    initLoadMore();
    initHackerTextEffect();
    initAvatarJitter();
    injectScreenShakeStyles();
});

// --- 1. Clock System ---
function initClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;

    const updateClock = () => {
        const now = new Date();
        // Format as HH:MM:SS
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    };

    updateClock();
    setInterval(updateClock, 1000);
}

// --- 2. Modal Handlers ---
function openPostModal() {
    const modal = document.getElementById('postModal');
    if (modal) {
        modal.classList.add('active');
        // Auto-focus the title input for better UX
        setTimeout(() => {
            const input = modal.querySelector('.post-title-input');
            if (input) input.focus();
        }, 100);
    }
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    if (modal) modal.classList.remove('active');
}

function closeTraceModal() {
    const modal = document.getElementById('traceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        document.body.classList.remove('screen-shake'); // Remove shake effect
    }
}

// --- 3. Trace Warning Automation ---
function initTraceWarning() {
    const modal = document.getElementById('traceModal');
    if (!modal) return;

    // Trigger randomly between 12 and 35 seconds after load
    const delay = Math.floor(Math.random() * 23000) + 12000;
    
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
        document.body.classList.add('screen-shake'); // Trigger shake effect
        
        // Optional: Flash the screen red briefly
        document.body.style.transition = 'background-color 0.1s';
        document.body.style.backgroundColor = '#2a0005';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 150);
    }, delay);
}

// --- 4. Feed Filtering with Glitch Transition ---
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.feed-post');
    const feedContainer = document.querySelector('.feed-container');

    if (!buttons.length || !posts.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Glitch transition effect on container
            if (feedContainer) {
                feedContainer.style.opacity = '0.4';
                feedContainer.style.transform = 'translateX(4px) skewX(2deg)';
                setTimeout(() => {
                    feedContainer.style.transform = 'translateX(-4px) skewX(-2deg)';
                    setTimeout(() => {
                        feedContainer.style.transform = 'translateX(0) skewX(0)';
                        feedContainer.style.opacity = '1';
                    }, 60);
                }, 60);
            }

            // Filter posts after short delay to match transition
            setTimeout(() => {
                posts.forEach(post => {
                    const type = post.dataset.type;
                    const isVisible = filter === 'all' || filter === type;
                    
                    if (isVisible) {
                        post.style.display = 'block';
                        // Re-trigger entry animation
                        post.style.animation = 'none';
                        post.offsetHeight; /* force reflow */
                        post.style.animation = 'slide-up 0.5s forwards';
                    } else {
                        post.style.display = 'none';
                    }
                });
            }, 100);
        });
    });
}

// --- 5. Network Simulation ---
function initNetworkSimulation() {
    const nodesEl = document.getElementById('activeNodes');
    const statusItems = document.querySelectorAll('.status-right .status-item');
    const latencyItem = statusItems[0]; // "LATENCY: 12ms"
    const statusText = document.querySelector('.status-text');
    
    if (!nodesEl || !latencyItem) return;

    let baseNodes = 1847;
    let baseLatency = 12;

    setInterval(() => {
        // Fluctuate active nodes
        const nodeChange = Math.floor(Math.random() * 7) - 3; // -3 to +3
        baseNodes = Math.max(1500, baseNodes + nodeChange);
        nodesEl.textContent = baseNodes.toLocaleString();
        
        // Fluctuate latency
        const latencyChange = Math.floor(Math.random() * 3) - 1;
        baseLatency = Math.max(8, Math.min(28, baseLatency + latencyChange));
        latencyItem.textContent = `LATENCY: ${baseLatency}ms`;
        
        // Random connection glitch (rare)
        if (statusText && Math.random() > 0.96) {
            statusText.textContent = 'RECONNECTING...';
            statusText.style.color = 'var(--yellow)';
            setTimeout(() => {
                statusText.textContent = 'CONNECTED';
                statusText.style.color = '';
            }, 1200);
        }
    }, 2000);
}

// --- 6. Code Block Copy ---
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.code-copy');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const codeBlock = btn.closest('.code-block');
            if (!codeBlock) return;
            
            const code = codeBlock.querySelector('code');
            if (!code) return;

            const text = code.innerText;
            
            // Modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopiedFeedback(btn);
                }).catch(err => {
                    console.warn('Clipboard API failed, using fallback', err);
                    fallbackCopy(text, btn);
                });
            } else {
                fallbackCopy(text, btn);
            }
        });
    });

    function fallbackCopy(text, btn) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopiedFeedback(btn);
        } catch (err) {
            btn.textContent = 'ERR';
        }
        document.body.removeChild(textarea);
    }

    function showCopiedFeedback(btn) {
        const originalText = btn.textContent;
        btn.textContent = 'COPIED';
        btn.style.color = 'var(--green)';
        btn.style.borderColor = 'var(--green)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    }
}

// --- 7. Load More Simulation ---
function initLoadMore() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.textContent = 'LOADING...';
        btn.style.opacity = '0.7';
        
        // Simulate network request
        setTimeout(() => {
            btn.textContent = 'NO MORE TRANSMISSIONS';
            btn.style.opacity = '0.5';
            btn.style.borderColor = 'var(--text-dim)';
            btn.style.color = 'var(--text-dim)';
            btn.style.cursor = 'default';
        }, 1500);
    });
}

// --- 8. Hacker Text Effect (Logo Glitch) ---
function initHackerTextEffect() {
    const logo = document.querySelector('.logo-glitch');
    if (!logo) return;

    const originalText = logo.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    let intervalId = null;

    logo.addEventListener('mouseenter', () => {
        if (intervalId) clearInterval(intervalId);
        
        let iterations = 0;
        intervalId = setInterval(() => {
            logo.textContent = originalText.split('')
                .map((char, index) => {
                    // If index is less than iterations, show original char
                    if (index < iterations) {
                        return originalText[index];
                    }
                    // Otherwise show random char
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) { 
                clearInterval(intervalId);
            }
            
            iterations += 1 / 2; // Speed of resolution
        }, 30);
    });
}

// --- 9. Random Avatar Jitter ---
function initAvatarJitter() {
    // Simulate signal instability by occasionally glitching avatars
    setInterval(() => {
        const avatars = document.querySelectorAll('.avatar-glitch');
        if (avatars.length === 0) return;
        
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        
        // Apply a quick CSS animation
        randomAvatar.style.animation = 'glitch-text 0.2s linear';
        setTimeout(() => {
            randomAvatar.style.animation = '';
        }, 200);
    }, 5000);
}

// --- Utility: Inject Screen Shake Styles ---
function injectScreenShakeStyles() {
    if (document.getElementById('screen-shake-style')) return;
    const style = document.createElement('style');
    style.id = 'screen-shake-style';
    style.innerHTML = `
        @keyframes screen-shake {
            0% { transform: translate(0, 0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
            100% { transform: translate(0, 0); }
        }
        .screen-shake {
            animation: screen-shake 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}