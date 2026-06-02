// === VOIDNET // TERMINAL FEED CONTROLLER ===
// Cyberpunk underground social network — full interactivity

document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initReputationHologram();
    initThreatMonitor();
    initChannelFilter();
    initComposerTabs();
    initEncryptedBlocks();
    initCodeCopy();
    initTraceWarning();
    initProxyAnimation();
    initTagCloud();
    initTransmitButton();
    initLoadMore();
    initActionButtons();
});

// === CLOCK ===
function initClock() {
    const timeEl = document.getElementById('headerTime');
    
    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${h}:${m}:${s}`;
    }
    
    update();
    setInterval(update, 1000);
}

// === REPUTATION HOLOGRAM ===
function initReputationHologram() {
    const container = document.getElementById('holoParticles');
    const scoreEl = document.getElementById('reputationScore');
    
    // Generate floating particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'holo-particle';
        const angle = (i / 12) * Math.PI * 2;
        const radius = 50 + Math.random() * 20;
        particle.style.left = `${50 + Math.cos(angle) * radius}%`;
        particle.style.top = `${50 + Math.sin(angle) * radius}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particle.style.animationDuration = `${2 + Math.random() * 2}s`;
        container.appendChild(particle);
    }
    
    // Animate score on load
    let current = 0;
    const target = 847;
    const increment = Math.ceil(target / 60);
    
    function animateScore() {
        current += increment;
        if (current >= target) {
            current = target;
            scoreEl.textContent = current;
            return;
        }
        scoreEl.textContent = current;
        requestAnimationFrame(animateScore);
    }
    
    setTimeout(animateScore, 500);
}

// === THREAT MONITOR ===
function initThreatMonitor() {
    const bars = document.querySelectorAll('.threat-bar');
    const valueEl = document.getElementById('threatValue');
    
    function setThreatLevel(level) {
        bars.forEach((bar, i) => {
            bar.classList.toggle('active', i < level);
        });
        
        const levels = ['level-low', 'level-medium', 'level-high', 'level-critical'];
        const labels = ['MINIMAL', 'ELEVATED', 'HIGH', 'CRITICAL'];
        const levelMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 3 };
        
        valueEl.className = 'threat-value ' + levels[levelMap[level]];
        valueEl.textContent = labels[levelMap[level]];
    }
    
    // Initial: elevated (2 bars)
    setThreatLevel(2);
    
    // Random fluctuation
    setInterval(() => {
        const rand = Math.random();
        if (rand > 0.92) {
            const newLevel = Math.floor(Math.random() * 5) + 1;
            setThreatLevel(Math.min(newLevel, 5));
        }
    }, 3000);
}

// === CHANNEL FILTER ===
function initChannelFilter() {
    const navItems = document.querySelectorAll('.nav-item');
    const posts = document.querySelectorAll('.post');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const channel = this.dataset.channel;
            
            posts.forEach(post => {
                if (channel === 'all' || post.dataset.channel === channel) {
                    post.classList.remove('hidden');
                    post.style.animation = 'none';
                    post.offsetHeight; // trigger reflow
                    post.style.animation = 'fade-in-up 0.5s ease-out';
                } else {
                    post.classList.add('hidden');
                }
            });
        });
    });
}

// === COMPOSER TABS ===
function initComposerTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// === ENCRYPTED BLOCKS ===
function initEncryptedBlocks() {
    const blocks = document.querySelectorAll('.encrypted-block');
    
    blocks.forEach(block => {
        const encrypted = block.querySelector('.encrypted-text');
        const decrypted = block.querySelector('.decrypted-content');
        const text = block.dataset.decrypted;
        
        // Store original encrypted HTML
        const originalEncrypted = encrypted.innerHTML;
        
        // Prepare decrypted content
        decrypted.textContent = text;
        
        // Glitch animation on hover
        let glitchInterval;
        
        block.addEventListener('mouseenter', function() {
            const chars = encrypted.querySelectorAll('.enc-char');
            const originalTexts = Array.from(chars).map(c => c.textContent);
            
            glitchInterval = setInterval(() => {
                chars.forEach((char, i) => {
                    if (Math.random() > 0.7) {
                        char.textContent = String.fromCharCode(
                            33 + Math.floor(Math.random() * 94)
                        );
                    }
                });
            }, 50);
            
            setTimeout(() => clearInterval(glitchInterval), 300);
        });
        
        block.addEventListener('mouseleave', function() {
            clearInterval(glitchInterval);
            encrypted.innerHTML = originalEncrypted;
        });
    });
}

// === CODE COPY ===
function initCodeCopy() {
    const copyBtns = document.querySelectorAll('.code-copy');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const original = this.textContent;
                this.textContent = 'COPIED';
                this.style.color = 'var(--neon-green)';
                this.style.borderColor = 'var(--neon-green)';
                
                setTimeout(() => {
                    this.textContent = original;
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 2000);
            });
        });
    });
}

// === TRACE WARNING ===
function initTraceWarning() {
    const warning = document.getElementById('traceWarning');
    const bar = document.getElementById('traceBar');
    
    // Trigger randomly
    function triggerTrace() {
        warning.classList.add('active');
        bar.style.width = '0%';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            bar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    warning.classList.remove('active');
                }, 500);
            }
        }, 30);
    }
    
    // Random trigger every 30-60 seconds
    function scheduleTrace() {
        const delay = 30000 + Math.random() * 30000;
        setTimeout(() => {
            triggerTrace();
            scheduleTrace();
        }, delay);
    }
    
    setTimeout(scheduleTrace, 45000);
}

// === PROXY ANIMATION ===
function initProxyAnimation() {
    const nodes = document.querySelectorAll('.proxy-node');
    const lines = document.querySelectorAll('.proxy-line');
    
    function pulseChain() {
        nodes.forEach((node, i) => {
            setTimeout(() => {
                node.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    node.style.transform = 'scale(1)';
                }, 200);
            }, i * 150);
        });
    }
    
    setInterval(pulseChain, 4000);
}

// === TAG CLOUD ===
function initTagCloud() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const channel = this.textContent.toLowerCase().replace('#', '');
            
            // Find matching nav item and click it
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                if (item.dataset.channel === 'all') {
                    item.click();
                }
            });
            
            // Highlight effect
            this.style.background = 'var(--neon-cyan)';
            this.style.color = 'var(--bg-primary)';
            
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 300);
        });
    });
}

// === TRANSMIT BUTTON ===
function initTransmitButton() {
    const btn = document.getElementById('transmitBtn');
    const textarea = document.getElementById('composerText');
    
    btn.addEventListener('click', function() {
        const text = textarea.value.trim();
        if (!text) return;
        
        // Visual feedback
        btn.style.background = 'var(--neon-cyan)';
        btn.style.color = 'var(--bg-primary)';
        
        setTimeout(() => {
            btn.style.background = '';
            btn.style.color = '';
            textarea.value = '';
        }, 300);
        
        // Simulate transmission
        console.log('TRANSMITTING:', text);
    });
}

// === LOAD MORE ===
function initLoadMore() {
    const btn = document.getElementById('loadMore');
    const feed = document.getElementById('feedItems');
    
    const archivePosts = [
        {
            channel: 'jobs',
            threat: 'medium',
            author: 'STREET_DOC',
            badge: 'FIXER',
            badgeClass: 'fixer',
            time: '3h ago',
            rep: '890',
            title: '>> CYBERWARE INSTALLATION // BACK ALLEY CLINIC',
            content: 'Looking for a ripperdoc who can handle military-grade chrome. Full sleeve replacement, neural link upgrade, and ocular implant swap. No questions asked, cash only.',
            accepts: 12,
            replies: 4
        },
        {
            channel: 'intel',
            threat: 'high',
            author: 'NET_WRAITH',
            badge: 'HACKER',
            badgeClass: 'hacker',
            time: '5h ago',
            rep: '3.4k',
            title: '>> ARASAKA TOWER BLUEPRINTS // FLOOR 42-47',
            content: 'Complete architectural schematics for the new Arasaka downtown tower. Includes security camera coverage, guard rotation schedules, and sub-basement access points. Don\'t ask how I got these.',
            accepts: 234,
            replies: 67,
            hasCode: true,
            codeLang: 'json',
            codeFile: 'tower_access.json',
            code: `{
  "tower_id": "ARA-DT-2847",
  "floors": [42, 43, 44, 45, 46, 47],
  "security_level": "MAXIMUM",
  "cameras": 47,
  "guards_per_shift": 23,
  "access_codes": {
    "service_elevator": "████-████",
    "sub_basement": "████-████"
  }
}`
        },
        {
            channel: 'market',
            threat: 'low',
            author: 'CHROME_DEALER',
            badge: 'RUNNER',
            badgeClass: 'runner',
            time: '6h ago',
            rep: '2.1k',
            title: '>> MONOWIRE // THERMAL EDGE // CUSTOM GRIP',
            content: 'Military surplus monowire with thermal cutting edge. Custom carbon-fiber grip, fingerprint lock. One previous owner (deceased). Serious offers only.',
            specs: [
                { label: 'LENGTH', value: '3.2M // RETRACTABLE' },
                { label: 'TENSION', value: '12000 PSI' },
                { label: 'PRICE', value: '€45,000', price: true },
                { label: 'ORIGIN', value: 'KANG TAO SURPLUS' }
            ],
            accepts: 8,
            replies: 15
        }
    ];
    
    btn.addEventListener('click', function() {
        const originalText = this.querySelector('.load-text').textContent;
        this.querySelector('.load-text').textContent = '>> DECRYPTING ARCHIVES';
        this.disabled = true;
        
        setTimeout(() => {
            archivePosts.forEach((post, index) => {
                setTimeout(() => {
                    const article = createPostElement(post);
                    feed.appendChild(article);
                }, index * 200);
            });
            
            this.querySelector('.load-text').textContent = originalText;
            this.disabled = false;
        }, 1500);
    });
}

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post';
    article.dataset.channel = post.channel;
    article.dataset.threat = post.threat;
    
    let extraContent = '';
    
    if (post.specs) {
        extraContent = `
            <div class="item-specs">
                ${post.specs.map(s => `
                    <div class="spec-row">
                        <span class="spec-label">${s.label}</span>
                        <span class="spec-value${s.price ? ' price' : ''}">${s.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (post.hasCode) {
        const highlightedCode = syntaxHighlight(post.code);
        extraContent = `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-lang">${post.codeLang}</span>
                    <span class="code-filename">${post.codeFile}</span>
                    <button class="code-copy">COPY</button>
                </div>
                <pre class="code-content"><code>${highlightedCode}</code></pre>
            </div>
        `;
    }
    
    article.innerHTML = `
        <div class="post-threat ${post.threat}"></div>
        <div class="post-header">
            <div class="post-avatar glitch-avatar">
                <span class="av-char">◈</span>
            </div>
            <div class="post-meta">
                <span class="post-author">${post.author}</span>
                <span class="post-badge ${post.badgeClass}">${post.badge}</span>
                <span class="post-time">${post.time}</span>
            </div>
            <div class="post-rep">rep: ${post.rep}</div>
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p>${post.content}</p>
            ${extraContent}
        </div>
        <div class="post-actions">
            <button class="action-btn" data-action="accept">
                <span class="action-icon">▶</span> ACCEPT
            </button>
            <button class="action-btn" data-action="reply">
                <span class="action-icon">↩</span> REPLY
            </button>
            <button class="action-btn" data-action="leak">
                <span class="action-icon">⚡</span> LEAK
            </button>
            <div class="post-engagement">
                <span>${post.accepts} accepts</span>
                <span>${post.replies} replies</span>
            </div>
        </div>
    `;
    
    // Re-initialize code copy for new elements
    if (post.hasCode) {
        const newCopyBtn = article.querySelector('.code-copy');
        newCopyBtn.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const original = this.textContent;
                this.textContent = 'COPIED';
                this.style.color = 'var(--neon-green)';
                this.style.borderColor = 'var(--neon-green)';
                
                setTimeout(() => {
                    this.textContent = original;
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 2000);
            });
        });
    }
    
    return article;
}

function syntaxHighlight(code) {
    return code
        .replace(/"([^"]*)"/g, '<span class="code-string">"$1"</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="code-keyword">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
        .replace(/(\[|\]|\{|\}|:|,)/g, '<span class="code-variable">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>');
}

// === ACTION BUTTONS ===
function initActionButtons() {
    const feed = document.getElementById('feedItems');
    
    feed.addEventListener('click', function(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        
        const action = btn.dataset.action;
        
        if (action === 'accept') {
            btn.style.background = 'rgba(0, 255, 136, 0.15)';
            btn.style.borderColor = 'var(--neon-green)';
            btn.style.color = 'var(--neon-green)';
            
            const countEl = btn.closest('.post-actions').querySelector('.post-engagement span:first-child');
            const match = countEl.textContent.match(/(\d+)/);
            if (match) {
                countEl.textContent = `${parseInt(match[1]) + 1} accepts`;
            }
        }
        
        if (action === 'leak') {
            btn.style.animation = 'none';
            btn.offsetHeight;
            btn.style.animation = 'action-pulse 0.5s ease-in-out 3';
        }
    });
}

// === RANDOM GLITCH EFFECTS ===
setInterval(() => {
    const avatars = document.querySelectorAll('.glitch-avatar');
    const random = avatars[Math.floor(Math.random() * avatars.length)];
    if (random) {
        random.style.transform = 'translate(2px, -1px)';
        setTimeout(() => {
            random.style.transform = '';
        }, 100);
    }
}, 5000);

// === SCROLL PARALLAX FOR SIDEBAR ===
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            const scrolled = window.pageYOffset;
            const holo = document.querySelector('.reputation-holo');
            if (holo) {
                holo.style.transform = `rotateX(${scrolled * 0.02}deg)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});