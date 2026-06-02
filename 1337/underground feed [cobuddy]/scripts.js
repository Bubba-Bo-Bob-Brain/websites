// ===== EPOCH TIME COUNTER =====
function updateEpochTime() {
    const now = Math.floor(Date.now() / 1000);
    const el = document.getElementById('epochTime');
    if (el) {
        el.textContent = now;
    }
}
setInterval(updateEpochTime, 1000);
updateEpochTime();

// ===== ENCRYPTED PREVIEW DECRYPTION =====
document.querySelectorAll('.encrypted-preview').forEach(preview => {
    const encrypted = preview.getAttribute('data-encrypted');
    if (!encrypted) return;

    let decrypted = '';
    try {
        decrypted = atob(encrypted);
    } catch (e) {
        decrypted = encrypted;
    }

    const existingDecrypted = preview.querySelector('.decrypted-msg');
    if (existingDecrypted) {
        existingDecrypted.remove();
    }

    const decryptedSpan = document.createElement('span');
    decryptedSpan.classList.add('decrypted-msg');
    decryptedSpan.textContent = decrypted;
    preview.appendChild(decryptedSpan);

    preview.addEventListener('mouseenter', () => {
        decryptedSpan.style.transition = 'opacity 0.4s ease';
        decryptedSpan.style.opacity = '1';
    });

    preview.addEventListener('mouseleave', () => {
        decryptedSpan.style.transition = 'opacity 0.4s ease';
        decryptedSpan.style.opacity = '0';
    });
});

// ===== TRACE POPUP =====
const tracePopup = document.getElementById('tracePopup');
const traceBtn = document.getElementById('traceBtn');
const purgeBtn = document.getElementById('purgeBtn');
const dismissBtn = document.getElementById('dismissBtn');
const countdownVal = document.getElementById('countdownVal');

let countdownInterval = null;
let countdownSeconds = 12;

function showTracePopup() {
    tracePopup.classList.add('active');
    countdownSeconds = 12;
    updateCountdownDisplay();
    countdownInterval = setInterval(() => {
        countdownSeconds--;
        updateCountdownDisplay();
        if (countdownSeconds <= 0) {
            clearInterval(countdownInterval);
            tracePopup.classList.remove('active');
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const mins = String(Math.floor(countdownSeconds / 60)).padStart(2, '0');
    const secs = String(countdownSeconds % 60).padStart(2, '0');
    countdownVal.textContent = `${mins}:${secs}`;
}

traceBtn.addEventListener('click', () => {
    showTracePopup();
});

purgeBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    tracePopup.classList.remove('active');
    // Simulate reroute
    document.querySelector('.status-text').textContent = 'REROUTED — TUNNEL ACTIVE';
    setTimeout(() => {
        document.querySelector('.status-text').textContent = 'TORGUE PROTOCOL ACTIVE';
    }, 3000);
});

dismissBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    tracePopup.classList.remove('active');
});

// Random trace detection
let traceChance = 0;
setInterval(() => {
    traceChance = Math.random();
    if (traceChance > 0.95) {
        showTracePopup();
    }
}, 15000);

// ===== FEED FILTERING =====
const feedFilters = document.querySelectorAll('.feed-filter');
const posts = document.querySelectorAll('.post');

feedFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        feedFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const category = filter.getAttribute('data-filter');

        posts.forEach(post => {
            if (category === 'all') {
                post.style.display = 'block';
                post.style.animation = 'none';
                setTimeout(() => {
                    post.style.animation = 'post-reveal 0.5s ease forwards';
                }, 50);
            } else {
                if (post.getAttribute('data-category') === category) {
                    post.style.display = 'block';
                    post.style.animation = 'none';
                    setTimeout(() => {
                        post.style.animation = 'post-reveal 0.5s ease forwards';
                    }, 50);
                } else {
                    post.style.display = 'none';
                }
            }
        });
    });
});

// Add post reveal animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes post-reveal {
        from {
            opacity: 0;
            transform: translateY(12px);
            filter: blur(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    }
`;
document.head.appendChild(styleSheet);

// ===== SORT OPTIONS =====
const sortOptions = document.querySelectorAll('.sort-option');

sortOptions.forEach(option => {
    option.addEventListener('click', () => {
        sortOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');

        const sortType = option.textContent.trim().toLowerCase();
        const feed = document.getElementById('feed');

        const postArray = Array.from(posts);
        let sorted;

        if (sortType === 'threat') {
            sorted = postArray.sort((a, b) => {
                const threatA = parseInt(a.querySelector('.threat-val').textContent);
                const threatB = parseInt(b.querySelector('.threat-val').textContent);
                return threatB - threatA;
            });
        } else if (sortType === 'rep') {
            sorted = postArray.sort((a, b) => {
                const repA = parseInt(a.querySelector('.hologram-val').textContent);
                const repB = parseInt(b.querySelector('.hologram-val').textContent);
                return repB - repA;
            });
        } else {
            sorted = postArray.sort((a, b) => {
                const timeA = parseInt(a.querySelector('.post-timestamp').textContent.split(' ')[0]);
                const timeB = parseInt(b.querySelector('.post-timestamp').textContent.split(' ')[0]);
                return timeB - timeA;
            });
        }

        // Re-append in sorted order
        sorted.forEach(post => feed.appendChild(post));

        // Trigger reveal animation
        sorted.forEach((post, i) => {
            post.style.animation = 'none';
            setTimeout(() => {
                post.style.animation = `post-reveal 0.5s ease ${i * 0.05}s forwards`;
            }, 50);
        });
    });
});

// ===== GLITCH AVATAR RANDOM GLITCH =====
document.querySelectorAll('.glitch-avatar').forEach(avatar => {
    const inner = avatar.querySelector('.avatar-inner');
    const user = avatar.getAttribute('data-user');

    if (!inner) return;

    inner.textContent = user ? user.substring(0, 3).toUpperCase() : '??';

    setInterval(() => {
        if (Math.random() > 0.92) {
            inner.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            inner.style.opacity = '0.5';
            setTimeout(() => {
                inner.style.transform = 'translate(0, 0)';
                inner.style.opacity = '1';
            }, 100);
        }
    }, 2000);
});

// ===== CODE BLOCK COPY =====
document.querySelectorAll('.code-action').forEach(btn => {
    btn.addEventListener('click', () => {
        const codeBlock = btn.closest('.code-block').querySelector('code');
        const text = codeBlock.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✓ COPIED';
            btn.style.color = 'var(--neon-green)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.color = '';
            }, 2000);
        });
    });
});

// ===== LOAD MORE =====
const loadMoreBtn = document.getElementById('loadMore');
let loadCount = 0;

const additionalPosts = [
    {
        category: 'jobs',
        user: 'VOID_WALK3R',
        rep: 623,
        threat: 58,
        title: '[ENC] Data splice job — Militech relay node',
        body: 'Need someone to physically splice into a Militech relay node in the waterfront. I can get you close but the ICE is heavy. Payment in untraceable chyen. Must have nerve.',
        tags: ['JOB', 'DISCREET', 'DATA']
    },
    {
        category: 'leaks',
        user: 'NETRUNNER_X',
        rep: 1045,
        threat: 91,
        title: '⚡ LEAK: Kang Tao weapon specs leaked',
        body: 'Full weapon specs for Kang Tao smart rifles. Range, penetration, heat signature — all there. This is hot. Spread it before they pull the files.',
        tags: ['LEAK', 'CRITICAL', 'KANG TAO']
    },
    {
        category: 'tech',
        user: 'R3D_N3ON',
        rep: 789,
        threat: 41,
        title: '♦ TECH: Rogue optic implant — military grade',
        body: 'Stripped a rogue optic from a dead Militech spec-ops. Clean neural interface, night vision baked in. First offer takes it.',
        tags: ['TECH', 'HOT', 'IMPLANT']
    }
];

loadMoreBtn.addEventListener('click', () => {
    loadCount++;
    const feed = document.getElementById('feed');

    const postHTML = additionalPosts.map((post, i) => {
        const threatClass = post.threat > 80 ? 'threat-critical' : post.threat > 50 ? 'threat-high' : post.threat > 30 ? 'threat-medium' : 'threat-low';
        const tagClass = post.tags[1] === 'CRITICAL' || post.tags[1] === 'URGENT' ? 'tag-omega' : post.tags[1] === 'HOT' ? 'tag-hot' : post.tags[1] === 'DISCREET' ? 'tag-discrete' : '';

        return `
            <article class="post post-${post.category}" data-category="${post.category}">
                <div class="post-header">
                    <div class="post-avatar glitch-avatar" data-user="${post.user}">
                        <div class="avatar-inner"></div>
                    </div>
                    <div class="post-user-meta">
                        <div class="post-username">${post.user}</div>
                        <div class="post-timestamp">168724${7000 + loadCount * 100 + i} · just now</div>
                    </div>
                    <div class="hologram-badge" data-rep="${post.rep}">
                        <div class="hologram-ring"></div>
                        <div class="hologram-inner">
                            <span class="hologram-val">${post.rep}</span>
                            <span class="hologram-label">REP</span>
                        </div>
                    </div>
                    <div class="threat-level">
                        <span class="threat-label">THREAT</span>
                        <div class="threat-bar">
                            <div class="threat-fill ${threatClass}" style="width: ${post.threat}%"></div>
                        </div>
                        <span class="threat-val">${post.threat}</span>
                    </div>
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-body">${post.body}</p>
                    <div class="encrypted-preview" data-encrypted="${btoa(post.title.substring(0, 20))}">
                        <span class="encrypted-text">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>
                        <span class="decrypt-hint">[HOVER TO DECRYPT]</span>
                    </div>
                </div>
                <div class="post-footer">
                    <div class="post-actions">
                        <button class="action-btn encrypt-btn">⟐ ENCRYPT</button>
                        <button class="action-btn trade-btn">⇄ TRADE</button>
                        <button class="action-btn leak-btn">◈ LEAK</button>
                    </div>
                    <div class="post-meta">
                        ${post.tags.map(tag => `<span class="meta-tag ${tagClass}">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `;
    }).join('');

    feed.insertAdjacentHTML('beforeend', postHTML);

    // Re-apply event listeners to new posts
    applyPostListeners();

    if (loadCount >= 2) {
        loadMoreBtn.textContent = '✓ ALL NODES LOADED';
        loadMoreBtn.style.borderColor = 'var(--neon-green)';
        loadMoreBtn.style.color = 'var(--neon-green)';
        loadMoreBtn.disabled = true;
    }
});

function applyPostListeners() {
    // Glitch avatars
    document.querySelectorAll('.glitch-avatar').forEach(avatar => {
        const inner = avatar.querySelector('.avatar-inner');
        const user = avatar.getAttribute('data-user');
        if (inner) inner.textContent = user ? user.substring(0, 3).toUpperCase() : '??';
    });

    // Encrypted previews
    document.querySelectorAll('.encrypted-preview').forEach(preview => {
        const encrypted = preview.getAttribute('data-encrypted');
        if (!encrypted) return;

        let decrypted = '';
        try {
            decrypted = atob(encrypted);
        } catch (e) {
            decrypted = encrypted;
        }

        const existingDecrypted = preview.querySelector('.decrypted-msg');
        if (existingDecrypted) existingDecrypted.remove();

        const decryptedSpan = document.createElement('span');
        decryptedSpan.classList.add('decrypted-msg');
        decryptedSpan.textContent = decrypted;
        preview.appendChild(decryptedSpan);

        preview.addEventListener('mouseenter', () => {
            decryptedSpan.style.transition = 'opacity 0.4s ease';
            decryptedSpan.style.opacity = '1';
        });

        preview.addEventListener('mouseleave', () => {
            decryptedSpan.style.transition = 'opacity 0.4s ease';
            decryptedSpan.style.opacity = '0';
        });
    });
}

// ===== MESSAGE COMPOSER =====
const msgInput = document.querySelector('.msg-input');
const encryptSendBtn = document.querySelector('.msg-btn.encrypt-send');
const burnAfterBtn = document.querySelector('.msg-btn.burn-after');

encryptSendBtn.addEventListener('click', () => {
    if (msgInput.value.trim()) {
        msgInput.style.borderColor = 'var(--neon-green)';
        msgInput.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.3)';
        encryptSendBtn.textContent = '✓ SENT — ENCRYPTED';
        encryptSendBtn.style.borderColor = 'var(--neon-green)';
        encryptSendBtn.style.color = 'var(--neon-green)';

        setTimeout(() => {
            msgInput.value = '';
            msgInput.style.borderColor = '';
            msgInput.style.boxShadow = '';
            encryptSendBtn.textContent = '⟐ ENCRYPT & SEND';
            encryptSendBtn.style.borderColor = '';
            encryptSendBtn.style.color = '';
        }, 2500);
    }
});

burnAfterBtn.addEventListener('click', () => {
    if (msgInput.value.trim()) {
        msgInput.style.borderColor = 'var(--neon-red)';
        msgInput.style.boxShadow = '0 0 10px rgba(255, 32, 64, 0.3)';
        burnAfterBtn.textContent = '🔥 BURNING...';
        burnAfterBtn.style.borderColor = 'var(--neon-red)';
        burnAfterBtn.style.color = 'var(--neon-red)';

        setTimeout(() => {
            msgInput.value = '';
            msgInput.style.borderColor = '';
            msgInput.style.boxShadow = '';
            burnAfterBtn.textContent = '🔥 BURN';
            burnAfterBtn.style.borderColor = '';
            burnAfterBtn.style.color = '';

            // Flash effect on composer
            const composer = document.querySelector('.message-composer');
            composer.style.animation = 'none';
            setTimeout(() => {
                composer.style.animation = 'burn-flash 0.5s ease';
            }, 10);
        }, 1500);
    }
});

// Burn flash animation
const burnStyle = document.createElement('style');
burnStyle.textContent = `
    @keyframes burn-flash {
        0% { background: rgba(255, 32, 64, 0.2); }
        100% { background: transparent; }
    }
`;
document.head.appendChild(burnStyle);

// ===== ACTION BUTTONS =====
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const originalText = btn.textContent;
        btn.textContent = '✓';

        setTimeout(() => {
            btn.textContent = originalText;
        }, 1200);
    });
});

// ===== TRACE INDICATOR ANIMATION =====
const traceIndicator = document.getElementById('traceIndicator');
let scanPhase = 0;

setInterval(() => {
    scanPhase = (scanPhase + 1) % 4;
    const statusEl = traceIndicator.querySelector('.trace-status');
    const statuses = ['SCANNING...', 'NOISE DETECTED', 'PROBE ACTIVE', 'CLEAR'];
    statusEl.textContent = statuses[scanPhase];
    statusEl.style.color = scanPhase === 1 ? 'var(--neon-yellow)' : scanPhase === 2 ? 'var(--neon-red)' : 'var(--neon-cyan)';
}, 4000);

// ===== NAVIGATION =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ===== THREAT LOG UPDATES =====
const logEntries = document.querySelectorAll('.log-entry');
setInterval(() => {
    const messages = [
        'Encrypted burst on port 7734',
        'Runner ghosted — Sector 9',
        'Arasaka ICE probe detected',
        'NCPD drone sweep — Sector 3',
        'Blackwall tremor — magnitude 2.1',
        'Fixer dead drop confirmed',
        'NetWatch shadow update active',
        'Biotechnica gene lab breach'
    ];

    const times = document.querySelectorAll('.log-time');
    const msgs = document.querySelectorAll('.log-msg');

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    if (times.length > 0 && msgs.length > 0) {
        const lastTime = times[times.length - 1];
        const lastMsg = msgs[msgs.length - 1];

        lastTime.textContent = timeStr;
        lastMsg.textContent = randomMsg;

        // Highlight new entry
        lastTime.style.color = 'var(--neon-cyan)';
        lastMsg.style.color = 'var(--neon-cyan)';

        setTimeout(() => {
            lastTime.style.color = '';
            lastMsg.style.color = '';
        }, 2000);
    }
}, 8000);

// ===== SCROLLBAR FADE ON SIDEBARS =====
const sidebarLeft = document.querySelector('.sidebar-left');
const sidebarRight = document.querySelector('.sidebar-right');

function handleScrollFade(el) {
    let scrollTimeout;
    el.addEventListener('scroll', () => {
        el.style.opacity = '0.8';
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            el.style.opacity = '1';
        }, 300);
    });
}

if (sidebarLeft) handleScrollFade(sidebarLeft);
if (sidebarRight) handleScrollFade(sidebarRight);

// ===== INITIAL POST ANIMATION =====
document.querySelectorAll('.post').forEach((post, i) => {
    post.style.opacity = '0';
    post.style.animation = `post-reveal 0.5s ease ${i * 0.08}s forwards`;
});

// ===== CONSOLE EASTER EGG =====
console.log('%c⚠ SYNTHWIRE NODE INTEGRITY CHECK ⚠', 'color: #ff2040; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #ff2040;');
console.log('%cYou shouldn\'t be here. Purging trace logs...', 'color: #00f0ff; font-size: 11px;');
console.log('%cGHOST_NULL // NODE 7.4.1 // TORGUE PROTOCOL', 'color: #ff00aa; font-size: 9px;');