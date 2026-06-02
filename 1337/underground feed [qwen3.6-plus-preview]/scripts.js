/* =========================================
   NEXUS:BLACK // JAVASCRIPT
   Theme: Cyberpunk Underground
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c NEXUS:BLACK // SYSTEM ONLINE ', 'background: #00f3ff; color: #000; font-size: 14px; font-weight: bold;');
    
    // Initialize Systems
    initGlitchEffects();
    initTicker();
    initDecryption();
    initCopyPaste();
    initTraceProtocol();
    initBroadcast();
    initScrollLoader();
});

/* =========================================
   1. GLITCH EFFECTS
   ========================================= */

function initGlitchEffects() {
    const glitchContainers = document.querySelectorAll('.glitch-container');
    
    // Randomly apply intense glitch classes to avatars
    setInterval(() => {
        glitchContainers.forEach(container => {
            if (Math.random() > 0.9) {
                container.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    container.style.transform = 'translate(0,0)';
                }, 100);
            }
        });
    }, 500);

    // Avatar color shifting
    const avatars = document.querySelectorAll('.avatar-svg');
    setInterval(() => {
        avatars.forEach(svg => {
            if(Math.random() > 0.95) {
                const originalColor = svg.getAttribute('fill') || '#3a4550';
                svg.setAttribute('fill', '#00f3ff');
                setTimeout(() => svg.setAttribute('fill', originalColor), 100);
            }
        });
    }, 800);
}

/* =========================================
   2. DYNAMIC TICKER
   ========================================= */

function initTicker() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    setInterval(() => {
        const randomItem = tickerItems[Math.floor(Math.random() * tickerItems.length)];
        const priceEl = randomItem.querySelector('.t-price');
        const currentPriceStr = priceEl.textContent.replace(/[^0-9.-]/g, '');
        let currentPrice = parseFloat(currentPriceStr);
        
        if (isNaN(currentPrice)) return;

        // Fluctuate price
        const change = (Math.random() - 0.5) * (currentPrice * 0.05);
        const newPrice = currentPrice + change;
        const isUp = change > 0;

        // Format price
        const formattedPrice = newPrice.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

        priceEl.textContent = `${formattedPrice} CR ${isUp ? '▲' : '▼'}`;
        
        // Flash effect
        priceEl.style.color = isUp ? 'var(--accent)' : 'var(--secondary)';
        priceEl.style.textShadow = isUp ? '0 0 8px var(--accent)' : '0 0 8px var(--secondary)';
        
        setTimeout(() => {
            priceEl.style.color = '';
            priceEl.style.textShadow = '';
        }, 500);

    }, 2000);
}

/* =========================================
   3. DECRYPTION MECHANISM
   ========================================= */

function initDecryption() {
    // Matrix-style text scramble effect for decrypt buttons
    const decryptButtons = document.querySelectorAll('.decrypt-btn');
    
    decryptButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postCard = e.target.closest('.post-card');
            const encryptedBlock = postCard.querySelector('.encrypted-block');
            const overlay = encryptedBlock.querySelector('.encrypt-overlay');
            const content = encryptedBlock.querySelector('.decrypt-content');
            
            // Check if already decrypted
            if (encryptedBlock.classList.contains('decrypted')) {
                // Re-lock
                encryptedBlock.classList.remove('decrypted');
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
                content.style.opacity = '0';
                content.style.transform = 'translateY(10px)';
                btn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    DECRYPT
                `;
                return;
            }

            // Start decryption sequence
            btn.innerHTML = 'DECRYPTING...';
            btn.disabled = true;
            
            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Show content
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                    
                    encryptedBlock.classList.add('decrypted');
                    btn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        LOCK
                    `;
                    btn.disabled = false;
                    
                    // Play a subtle sound effect placeholder
                    // console.log('Audio: Decrypt success');
                }
            }, 100);
        });
    });
}

/* =========================================
   4. CODE PASTE COPY
   ========================================= */

function initCopyPaste() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.closest('.code-paste').querySelector('.code-content');
            const text = codeBlock.innerText;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'COPIED!';
                btn.style.color = 'var(--accent)';
                btn.style.borderColor = 'var(--accent)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            });
        });
    });
}

/* =========================================
   5. TRACE PROTOCOL (WARNING POPUP)
   ========================================= */

function initTraceProtocol() {
    const traceAlert = document.getElementById('trace-alert');
    const severBtn = document.getElementById('sever-btn');
    const traceFill = document.querySelector('.trace-fill');
    
    let traceTimer;
    let traceInterval;
    
    // Function to trigger trace
    function triggerTrace() {
        traceAlert.classList.remove('hidden');
        
        // Animate progress bar
        let width = 0;
        traceInterval = setInterval(() => {
            width += Math.random() * 5;
            traceFill.style.width = `${width}%`;
            
            if (width >= 100) {
                clearInterval(traceInterval);
                // Breach complete
                document.body.innerHTML = '<div style="background:black; color:red; height:100vh; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:2rem; text-align:center;">CONNECTION TERMINATED<br>LOCATION COMPROMISED</div>';
            }
        }, 200);
    }
    
    // Trigger randomly between 15s and 45s
    function scheduleTrace() {
        const delay = Math.floor(Math.random() * 30000) + 15000;
        traceTimer = setTimeout(triggerTrace, delay);
    }
    
    // Start the timer
    scheduleTrace();
    
    // Sever connection handler
    severBtn.addEventListener('click', () => {
        traceAlert.classList.add('hidden');
        clearInterval(traceInterval);
        clearTimeout(traceTimer);
        traceFill.style.width = '0%';
        
        // Reset timer for next trace
        scheduleTrace();
    });
}

/* =========================================
   6. BROADCAST POST
   ========================================= */

function initBroadcast() {
    const broadcastBtn = document.querySelector('.btn-broadcast');
    const input = document.querySelector('.cyber-input');
    const feedStream = document.getElementById('feed-stream');
    
    broadcastBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        
        // Create new post element
        const newPost = document.createElement('article');
        newPost.className = 'post-card';
        newPost.setAttribute('data-threat', 'low');
        newPost.setAttribute('data-post-id', Math.floor(Math.random() * 10000));
        newPost.style.opacity = '0';
        newPost.style.transform = 'translateY(-20px)';
        newPost.style.transition = 'all 0.4s ease';
        
        const now = new Date();
        const timeString = 'Just now // NODE: LOCAL';
        
        newPost.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="mini-avatar glitch-container" data-intensity="low"></div>
                    <div class="author-details">
                        <span class="author-name">KAITO // RUNNER</span>
                        <span class="post-time">${timeString}</span>
                    </div>
                </div>
                <div class="threat-badge threat-low">
                    <span class="threat-label">THREAT</span>
                    <span class="threat-value">LOW</span>
                </div>
            </div>
            
            <div class="post-body">
                <p class="post-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>

            <div class="post-footer">
                <button class="action-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    0 REPS
                </button>
                <button class="action-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    SHARE
                </button>
            </div>
        `;
        
        // Insert at top
        feedStream.insertBefore(newPost, feedStream.firstChild);
        
        // Animate in
        requestAnimationFrame(() => {
            newPost.style.opacity = '1';
            newPost.style.transform = 'translateY(0)';
        });
        
        // Clear input
        input.value = '';
        
        // Re-init glitch for new avatar
        initGlitchEffects();
    });
}

/* =========================================
   7. INFINITE SCROLL LOADER
   ========================================= */

function initScrollLoader() {
    const loader = document.querySelector('.feed-loader');
    const feedStream = document.getElementById('feed-stream');
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Simulate loading more posts
            setTimeout(() => {
                const placeholder = document.createElement('div');
                placeholder.style.padding = '20px';
                placeholder.style.textAlign = 'center';
                placeholder.style.color = 'var(--text-muted)';
                placeholder.style.fontFamily = 'var(--font-mono)';
                placeholder.textContent = '>> CONNECTION UNSTABLE... RETRYING SYNC...';
                feedStream.appendChild(placeholder);
                
                setTimeout(() => placeholder.remove(), 2000);
            }, 1000);
        }
    }, { rootMargin: '200px' });
    
    observer.observe(loader);
}