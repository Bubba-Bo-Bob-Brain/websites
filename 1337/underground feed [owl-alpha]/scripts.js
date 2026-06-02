/* ============================================
   NEON SHADOW — UNDERGROUND FEED ENGINE
   ============================================ */

(function() {
    'use strict';

    // === DATA: USERS ===
    const users = [
        { id: 1, name: "GHOST_RUNNER", handle: "@ghost_r", role: "RUNNER", status: "online", reputation: "legendary", score: 9847, avatarSeed: "ghost" },
        { id: 2, name: "CipherWraith", handle: "@cwraith", role: "HACKER", status: "ghosted", reputation: "elite", score: 8432, avatarSeed: "cipher" },
        { id: 3, name: "ZeroDay_Zoe", handle: "@zday_zoe", role: "FIXER", status: "online", reputation: "elite", score: 7891, avatarSeed: "zeroday" },
        { id: 4, name: "NeonViper", handle: "@nviper", role: "HACKER", status: "traced", reputation: "trusted", score: 5623, avatarSeed: "viper" },
        { id: 5, name: "DataPhantom", handle: "@dphantom", role: "RUNNER", status: "online", reputation: "trusted", score: 4892, avatarSeed: "phantom" },
        { id: 6, name: "RustWire", handle: "@rustwire", role: "FIXER", status: "ghosted", reputation: "unknown", score: 2103, avatarSeed: "rust" },
        { id: 7, name: "ByteShade", handle: "@bshade", role: "HACKER", status: "online", reputation: "legendary", score: 9201, avatarSeed: "byte" },
        { id: 8, name: "ChromeMoth", handle: "@cmoth", role: "RUNNER", status: "online", reputation: "trusted", score: 3456, avatarSeed: "chrome" },
        { id: 9, name: "NullPointer", handle: "@nptr", role: "HACKER", status: "online", reputation: "elite", score: 8102, avatarSeed: "null" },
        { id: 10, name: "AshKicker", handle: "@akicker", role: "FIXER", status: "ghosted", reputation: "unknown", score: 1567, avatarSeed: "ash" },
    ];

    // === DATA: FEED POSTS ===
    const feedPosts = [
        {
            id: 101,
            authorId: 1,
            category: "jobs",
            threatLevel: 4,
            timestamp: "2025-01-15T14:23:00",
            content: "Need a runner for a high-pickup in Arasaka district. Package is classified. Meet at the usual spot in Kabuki. Bring your own wheels. No corpos, no questions. Payment upfront in crypto.",
            encrypted: true,
            encryptedText: "MEETING POINT: SUBLEVEL 7, WAREHOUSE 44. BRING DECRYPT KEY OMEGA-7. PACKAGE CONTAINS 200GB R&D DATA.",
            likes: 23,
            reposts: 7,
            replies: 4
        },
        {
            id: 102,
            authorId: 2,
            category: "intel",
            threatLevel: 3,
            timestamp: "2025-01-15T14:18:00",
            content: "Breach confirmed on Militech subsidiary. Their firewall is running outdated ICE — laughable. Dumping the access ladder here for anyone who wants in. Don't be greedy.",
            codeBlock: {
                language: "python",
                code: `# Militech Subsidiary Backdoor
import shadow_net as sn

def breach_gate(target):
    sn.rotate_proxy(nodes=7)
    payload = sn.craft_exploit(
        cve="CVE-2025-0042",
        vector="buffer_overflow"
    )
    return sn.inject(target, payload)

# Execute with caution
breach_gate("militech-sub-7.nt")`
            },
            likes: 156,
            reposts: 42,
            replies: 18
        },
        {
            id: 103,
            authorId: 3,
            category: "tech",
            threatLevel: 2,
            timestamp: "2025-01-15T14:10:00",
            content: "Fresh batch of military-grade cyberdecks just came off a corporate transport. Sandevistan implants, Kerenzikov boosters, and a few rare Raven microcyber boards. Prices firm. No lowballers.",
            likes: 89,
            reposts: 31,
            replies: 27
        },
        {
            id: 104,
            authorId: 7,
            category: "encrypted",
            threatLevel: 5,
            timestamp: "2025-01-15T14:05:00",
            content: "",
            encrypted: true,
            encryptedText: "KAISEC BLACKSITE COORDINATES: 37.7749° N, 122.4194° W. ROTATION SCHEDULE CHANGED. NEW GUARD PATTERNS UPLOADED TO SECURE CHANNEL. OPERATION DATE MOVED TO 01/22. CONFIRM RECEIPT.",
            likes: 342,
            reposts: 89,
            replies: 56
        },
        {
            id: 105,
            authorId: 4,
            category: "intel",
            threatLevel: 4,
            timestamp: "2025-01-15T13:58:00",
            content: "WARNING: Biodyne just rolled out new facial recognition grid in Watson district. If you're operating in that zone, update your masks NOW. Three runners already flatlined today.",
            encrypted: true,
            encryptedText: "RECOGNITION ALGORITHM SIGNATURE: BD-FR-v4.2.1. MASK OVERRIDES ATTACHED. ALSO — BIODYNE CEO SCHEDULED FOR MOTORCADE THROUGH WATSON ON 01/18. INTERCEPT POSSIBLE.",
            likes: 201,
            reposts: 67,
            replies: 34
        },
        {
            id: 106,
            authorId: 5,
            category: "jobs",
            threatLevel: 3,
            timestamp: "2025-01-15T13:50:00",
            content: "Looking for a hacker duo for a data extraction job. Target is a Kang Tao server farm in Pacifica. Need someone who can bypass their quantum encryption layer. Split is 60/40. Serious inquiries only.",
            likes: 45,
            reposts: 12,
            replies: 8
        },
        {
            id: 107,
            authorId: 9,
            category: "tech",
            threatLevel: 1,
            timestamp: "2025-01-15T13:42:00",
            content: "Just finished building a custom signal jammer from salvaged Militech parts. Range is about 200m, enough to kill any surveillance drone in the area. Taking orders. Build time is 48 hours.",
            codeBlock: {
                language: "c",
                code: `// Signal Jammer Controller
// Range: 200m | Freq: 2.4-6.0 GHz

#include <jammer.h>

void init_jammer() {
    set_frequency_range(2.4, 6.0);
    set_power_output(MAX);
    set_sweep_mode(CHAOTIC);
    enable_stealth_mode();
}

int main() {
    init_jammer();
    while (operational) {
        sweep_frequencies();
        detect_drones();
        if (target_acquired)
            jam_signal();
    }
    return 0;
}`
            },
            likes: 78,
            reposts: 23,
            replies: 15
        },
        {
            id: 108,
            authorId: 8,
            category: "intel",
            threatLevel: 2,
            timestamp: "2025-01-15T13:35:00",
            content: "Heard through the grapevine that NetWatch is recruiting double agents in the underground. Watch your back. If someone's asking too many questions about safe houses, they're probably compromised.",
            likes: 134,
            reposts: 45,
            replies: 29
        },
        {
            id: 109,
            authorId: 6,
            category: "jobs",
            threatLevel: 3,
            timestamp: "2025-01-15T13:28:00",
            content: "Fixer available for mid-level corporate extractions. I have contacts in Biodyne, Arasaka, and a few smaller biotech firms. Need something pulled? You know where to find me. Clean work, no traces.",
            likes: 34,
            reposts: 8,
            replies: 11
        },
        {
            id: 110,
            authorId: 10,
            category: "encrypted",
            threatLevel: 5,
            timestamp: "2025-01-15T13:20:00",
            content: "",
            encrypted: true,
            encryptedText: "PRIORITY ALPHA: ARASAKA COUNTER-INTELLIGENCE HAS IDENTIFIED THREE SAFE HOUSES IN CITY CENTER. ALL ASSETS MUST RELOCATE BY 0600. NEW LOCATIONS WILL BE BROADCAST ON CHANNEL 9. BURN THIS MESSAGE.",
            likes: 567,
            reposts: 234,
            replies: 89
        }
    ];

    // === DATA: BLACK MARKET ===
    const marketItems = [
        { name: "Raven Microcyber Mk.IV", desc: "Military cyberdeck, barely used", price: "12500", currency: "€$" },
        { name: "Sandevistan Speedware", desc: "Reaction booster, v3.2 firmware", price: "8900", currency: "€$" },
        { name: "Kerenzikov Boostkill", desc: "Evasion implant, modified", price: "6700", currency: "€$" },
        { name: "Tetratronic Rippler", desc: "Netrunner deck, cracked", price: "15200", currency: "€$" },
        { name: "Bioconductor Implant", desc: "Neural interface, black label", price: "4300", currency: "€$" },
        { name: "Graphene Armature", desc: "Subdermal armor plating", price: "9800", currency: "€$" },
    ];

    // === DATA: ADVISORIES ===
    const advisories = [
        { severity: "critical", title: "NETWATCH SWEEP — SECTOR 4", desc: "Active counter-intelligence operation detected. All operatives advised to go dark.", time: "14:22" },
        { severity: "high", title: "ARASAKA LOCKDOWN — DOWNTOWN", desc: "Corporate security heightened. Avoid all Arasaka-affiliated locations.", time: "13:45" },
        { severity: "moderate", title: "SURVEILLANCE GRID — WATSON", desc: "New facial recognition deployed. Update masks and bypass routes.", time: "12:30" },
        { severity: "low", title: "SUPPLY CHAIN — PACIFICA", desc: "New tech shipment arrived. Fixers taking orders for military hardware.", time: "11:15" },
    ];

    // === DATA: TRENDING HASHES ===
    const trendingHashes = [
        { name: "#ArasakaBreach", count: "2.4K", trend: "up" },
        { name: "#MilitechLeaks", count: "1.8K", trend: "up" },
        { name: "#NetWatchAlert", count: "1.2K", trend: "up" },
        { name: "#GhostProtocol", count: "956", trend: "down" },
        { name: "#CyberBlackMarket", count: "834", trend: "up" },
        { name: "#RunnerNetwork", count: "712", trend: "down" },
        { name: "#FixerAvailable", count: "645", trend: "up" },
    ];

    // === UTILITY FUNCTIONS ===
    function getUserById(id) {
        return users.find(u => u.id === id) || users[0];
    }

    function formatTimestamp(isoStr) {
        const d = new Date(isoStr);
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        const hexDay = d.getDate().toString(16).toUpperCase();
        return `${h}:${m}:${s} // 0x${hexDay}`;
    }

    function randomHex(len) {
        const chars = '0123456789ABCDEF';
        let result = '';
        for (let i = 0; i < len; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    function scrambleText(text, revealedChars = 0) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEF';
        let result = '';
        for (let i = 0; i < text.length; i++) {
            if (i < revealedChars) {
                result += text[i];
            } else if (text[i] === ' ') {
                result += ' ';
            } else {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        return result;
    }

    // === AVATAR GLITCH GENERATION ===
    function generateGlitchAvatar(canvas, seed) {
        const ctx = canvas.getContext('2d');
        const size = 80;
        canvas.width = size;
        canvas.height = size;

        const seedNum = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

        // Background
        const bgColors = ['#0a0a0f', '#0d0d14', '#12121c', '#1a1a28'];
        ctx.fillStyle = bgColors[seedNum % bgColors.length];
        ctx.fillRect(0, 0, size, size);

        // Generate pixel pattern
        const pixelSize = 4;
        const colors = ['#00ff41', '#00f0ff', '#ff00aa', '#ff0033', '#0d0d14', '#1a1a28', '#222236'];
        for (let y = 0; y < size; y += pixelSize) {
            for (let x = 0; x < size; x += pixelSize) {
                const noise = Math.sin(x * 12.9898 + y * 78.233 + seedNum) * 43758.5453;
                const val = noise - Math.floor(noise);
                if (val > 0.6) {
                    const colorIdx = Math.floor(val * colors.length) % colors.length;
                    ctx.fillStyle = colors[colorIdx];
                    ctx.globalAlpha = 0.3 + val * 0.5;
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }
        ctx.globalAlpha = 1;

        // Face outline
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2 - 4, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#00ff41';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(size / 2 - 8, size / 2 - 8, 5, 3);
        ctx.fillRect(size / 2 + 3, size / 2 - 8, 5, 3);

        // Mouth line
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(size / 2 - 6, size / 2 + 4);
        ctx.lineTo(size / 2 + 6, size / 2 + 4);
        ctx.stroke();

        // Glitch bars
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 5; i++) {
            const gy = ((seedNum * (i + 1) * 7) % size);
            const gh = 2 + (i % 3);
            ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#ff00aa';
            ctx.fillRect(0, gy, size, gh);
        }

        ctx.globalAlpha = 1;

        // Hex ID overlay
        ctx.fillStyle = '#00ff41';
        ctx.globalAlpha = 0.2;
        ctx.font = '8px monospace';
        ctx.fillText(`0x${randomHex(4)}`, 4, size - 4);
        ctx.globalAlpha = 1;
    }

    // === RENDER FUNCTIONS ===

    function renderActiveUsers() {
        const container = document.getElementById('activeUsers');
        if (!container) return;

        const sortedUsers = [...users].sort((a, b) => b.score - a.score);
        document.getElementById('activeCount').textContent = users.length;

        container.innerHTML = sortedUsers.map(user => `
            <div class="user-item" data-user-id="${user.id}">
                <div class="user-avatar">
                    <canvas id="avatar-sidebar-${user.id}" width="36" height="36"></canvas>
                    <div class="avatar-glitch"></div>
                </div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-role">${user.role}</div>
                </div>
                <span class="user-status-indicator ${user.status}"></span>
            </div>
        `).join('');

        sortedUsers.forEach(user => {
            const canvas = document.getElementById(`avatar-sidebar-${user.id}`);
            if (canvas) generateGlitchAvatar(canvas, user.avatarSeed);
        });
    }

    function renderMarketItems() {
        const container = document.getElementById('marketList');
        if (!container) return;

        container.innerHTML = marketItems.map(item => `
            <div class="market-item">
                <div class="market-item-name">${item.name}</div>
                <div class="market-item-desc">${item.desc}</div>
                <div class="market-item-price">${item.price} <span class="currency">${item.currency}</span></div>
            </div>
        `).join('');
    }

    function renderAdvisories() {
        const container = document.getElementById('advisoryList');
        if (!container) return;

        container.innerHTML = advisories.map(adv => `
            <div class="advisory-item severity-${adv.severity}">
                <div class="advisory-title">${adv.title}</div>
                <div class="advisory-desc">${adv.desc}</div>
                <div class="advisory-time">${adv.time}</div>
            </div>
        `).join('');
    }

    function renderTrendingHashes() {
        const container = document.getElementById('hashList');
        if (!container) return;

        container.innerHTML = trendingHashes.map(hash => `
            <div class="hash-item">
                <span class="hash-name">${hash.name}</span>
                <span class="hash-trend ${hash.trend}">${hash.trend === 'up' ? '▲' : '▼'}</span>
                <span class="hash-count">${hash.count}</span>
            </div>
        `).join('');
    }

    function renderFeedItem(post) {
        const author = getUserById(post.authorId);
        const threatBars = Array(5).fill(0).map((_, i) =>
            `<span class="threat-bar ${i < post.threatLevel ? 'active' + (post.threatLevel >= 4 ? ' high' : post.threatLevel >= 3 ? ' medium' : '') : ''}"></span>`
        ).join('');

        const encryptedHTML = post.encrypted ? `
            <div class="encrypted-message" data-encrypted="${btoa(post.encryptedText)}">
                <span class="cipher-text">${scrambleText(post.encryptedText)}</span>
                <span class="plain-text">${post.encryptedText}</span>
            </div>
        ` : '';

        const codeHTML = post.codeBlock ? `
            <div class="code-block">
                <div class="code-block-header">
                    <span class="code-lang">${post.codeBlock.language}</span>
                    <button class="code-copy-btn">COPY</button>
                </div>
                <pre>${highlightSyntax(post.codeBlock.code, post.codeBlock.language)}</pre>
            </div>
        ` : '';

        return `
            <article class="feed-item category-${post.category}" data-post-id="${post.id}" data-category="${post.category}">
                <div class="feed-item-header">
                    <div class="feed-item-avatar">
                        <canvas id="avatar-feed-${post.id}" width="42" height="42"></canvas>
                    </div>
                    <div class="feed-item-meta">
                        <div class="feed-item-author-row">
                            <span class="feed-item-author">${author.name}</span>
                            <span class="feed-item-handle">${author.handle}</span>
                            <span class="reputation-badge ${author.reputation}">
                                ${author.reputation.toUpperCase()}
                                <span class="reputation-score">${author.score}</span>
                            </span>
                            <span class="feed-item-category">${post.category}</span>
                        </div>
                        <div class="feed-item-timestamp">${formatTimestamp(post.timestamp)}</div>
                    </div>
                    <div class="feed-item-threat" title="Threat Level: ${post.threatLevel}/5">
                        ${threatBars}
                    </div>
                </div>
                <div class="feed-item-body">
                    ${post.content ? `<p>${post.content}</p>` : ''}
                    ${encryptedHTML}
                    ${codeHTML}
                </div>
                <div class="feed-item-actions">
                    <button class="action-btn like" data-action="like">
                        <span>♥</span> ${post.likes}
                    </button>
                    <button class="action-btn repost" data-action="repost">
                        <span>↻</span> ${post.reposts}
                    </button>
                    <button class="action-btn reply" data-action="reply">
                        <span>⟫</span> ${post.replies}
                    </button>
                </div>
            </article>
        `;
    }

    function highlightSyntax(code, language) {
        const keywords = {
            python: ['import', 'def', 'return', 'if', 'while', 'for', 'in', 'True', 'False', 'None', 'class', 'from', 'as'],
            c: ['int', 'void', 'char', 'return', 'if', 'while', 'for', '#include', '#define', 'struct', 'typedef', 'const', 'static'],
            javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'while', 'for', 'class', 'import', 'export', 'async', 'await']
        };

        const langKeywords = keywords[language] || [];
        let html = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Comments
            html = html.replace(/(#.*$|\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="code-comment">$1</span>');

        // Strings
        html = html.replace(/(&quot;[^&]*&quot;|'[^']*'|`[^`]*`)/g, '<span class="code-string">$1</span>');
        html = html.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="code-string">$1</span>');

        // Numbers
        html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');

        // Keywords
        langKeywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'g');
            html = html.replace(regex, '<span class="code-keyword">$1</span>');
        });

        // Function calls
        html = html.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="code-function">$1</span>(');

        return html;
    }

    function renderFeed(filter = 'all') {
        const container = document.getElementById('feedStream');
        if (!container) return;

        const filteredPosts = filter === 'all'
            ? feedPosts
            : feedPosts.filter(p => p.category === filter);

        container.innerHTML = filteredPosts.map(renderFeedItem).join('');

        // Generate avatars for feed items
        filteredPosts.forEach(post => {
            setTimeout(() => {
                const canvas = document.getElementById(`avatar-feed-${post.id}`);
                if (canvas) {
                    const author = getUserById(post.authorId);
                    generateGlitchAvatar(canvas, author.avatarSeed);
                }
            }, 50);
        });

        updateCounts();
        attachEncryptedListeners();
        attachCodeCopyListeners();
        attachActionListeners();
    }

    function updateCounts() {
        document.getElementById('countAll').textContent = feedPosts.length;
        document.getElementById('countJobs').textContent = feedPosts.filter(p => p.category === 'jobs').length;
        document.getElementById('countIntel').textContent = feedPosts.filter(p => p.category === 'intel').length;
        document.getElementById('countTech').textContent = feedPosts.filter(p => p.category === 'tech').length;
        document.getElementById('countEncrypted').textContent = feedPosts.filter(p => p.category === 'encrypted').length;
    }

    // === ENCRYPTED MESSAGE INTERACTION ===
    function attachEncryptedListeners() {
        document.querySelectorAll('.encrypted-message').forEach(el => {
            if (el.dataset.bound) return;
            el.dataset.bound = 'true';

            let decryptInterval = null;
            let revealIndex = 0;
            const encrypted = atob(el.dataset.encrypted);

            el.addEventListener('mouseenter', () => {
                const cipherEl = el.querySelector('.cipher-text');
                const plainEl = el.querySelector('.plain-text');

                revealIndex = 0;
                decryptInterval = setInterval(() => {
                    revealIndex++;
                    if (revealIndex >= encrypted.length) {
                        el.classList.add('decrypted');
                        clearInterval(decryptInterval);
                    } else {
                        cipherEl.textContent = scrambleText(encrypted, revealIndex);
                    }
                }, 30);
            });

            el.addEventListener('mouseleave', () => {
                if (decryptInterval) {
                    clearInterval(decryptInterval);
                    decryptInterval = null;
                }
                el.classList.remove('decrypted');
                el.querySelector('.cipher-text').textContent = scrambleText(encrypted);
            });
        });
    }

    // === CODE COPY ===
    function attachCodeCopyListeners() {
        document.querySelectorAll('.code-copy-btn').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = 'true';

            btn.addEventListener('click', () => {
                const codeBlock = btn.closest('.code-block');
                const code = codeBlock.querySelector('pre').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.textContent = 'COPIED!';
                    btn.style.color = '#00ff41';
                    btn.style.borderColor = '#00ff41';
                    setTimeout(() => {
                        btn.textContent = 'COPY';
                        btn.style.color = '';
                        btn.style.borderColor = '';
                    }, 2000);
                });
            });
        });
    }

    // === ACTION BUTTONS ===
    function attachActionListeners() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = 'true';

            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const postEl = btn.closest('.feed-item');
                const postId = parseInt(postEl.dataset.postId);
                const post = feedPosts.find(p => p.id === postId);
                if (!post) return;

                if (action === 'like') {
                    post.likes++;
                    btn.innerHTML = `<span>♥</span> ${post.likes}`;
                    btn.style.color = '#ff00aa';
                    btn.style.borderColor = '#ff00aa';
                } else if (action === 'repost') {
                    post.reposts++;
                    btn.innerHTML = `<span>↻</span> ${post.reposts}`;
                    btn.style.color = '#00f0ff';
                    btn.style.borderColor = '#00f0ff';
                } else if (action === 'reply') {
                    post.replies++;
                    btn.innerHTML = `<span>⟫</span> ${post.replies}`;
                }

                // Flash animation
                btn.style.transform = 'scale(1.2)';
                setTimeout(() => { btn.style.transform = ''; }, 150);
            });
        });
    }

    // === NAVIGATION FILTER ===
    function initNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                renderFeed(filter);
            });
        });
    }

    // === TRACE DETECTION MODAL ===
    let traceInterval = null;
    let traceTimeRemaining = 5;

    function initTraceModal() {
        const modal = document.getElementById('traceModal');
        const evadeBtn = document.getElementById('traceEvadeBtn');
        const triggerBtn = document.getElementById('triggerTrace');

        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => {
                triggerTrace();
            });
        }

        if (evadeBtn) {
            evadeBtn.addEventListener('click', () => {
                closeTrace();
            });
        }
    }

    function triggerTrace() {
        const modal = document.getElementById('traceModal');
        const traceCode = document.getElementById('traceCode');
        const progressFill = document.getElementById('traceProgress');
        const timer = document.getElementById('traceTimer');

        modal.classList.add('active');
        traceTimeRemaining = 5;

        // Scanning animation
        const scanningTexts = ['SCANNING...', 'TRACING...', 'LOCATING...', 'IDENTIFYING...'];
        let scanIdx = 0;
        traceCode.textContent = scanningTexts[0];

        const scanAnim = setInterval(() => {
            scanIdx = (scanIdx + 1) % scanningTexts.length;
            traceCode.textContent = scanningTexts[scanIdx];
        }, 600);

        // Progress bar
        let progress = 0;
        traceInterval = setInterval(() => {
            progress += 2;
            traceTimeRemaining -= 0.1;
            if (progressFill) progressFill.style.width = Math.min(progress, 100) + '%';
            if (timer) timer.textContent = `EVADE IN ${String(Math.max(0, Math.ceil(traceTimeRemaining))).padStart(2, '0')}:00`;

            if (progress >= 100 || traceTimeRemaining <= 0) {
                clearInterval(scanAnim);
                clearInterval(traceInterval);
                traceCode.textContent = 'LOCKED';
                traceCode.style.color = '#ff0033';
                if (timer) {
                    timer.textContent = 'TRACE COMPLETE';
                    timer.style.color = '#ff0033';
                }
            }
        }, 100);
    }

    function closeTrace() {
        const modal = document.getElementById('traceModal');
        const traceCode = document.getElementById('traceCode');
        const progressFill = document.getElementById('traceProgress');
        const timer = document.getElementById('traceTimer');

        modal.classList.remove('active');
        clearInterval(traceInterval);

        if (traceCode) {
            traceCode.textContent = 'SCANNING...';
            traceCode.style.color = '';
        }
        if (progressFill) progressFill.style.width = '0%';
        if (timer) {
            timer.textContent = 'EVADE IN 00:05';
            timer.style.color = '';
        }
    }

    // === UPTIME COUNTER ===
    let uptimeSeconds = 0;
    function startUptimeCounter() {
        setInterval(() => {
            uptimeSeconds++;
            const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
            const s = String(uptimeSeconds % 60).padStart(2, '0');
            const el = document.getElementById('uptimeCounter');
            if (el) el.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }

    // === LATENCY SIMULATOR ===
    function startLatencySimulator() {
        setInterval(() => {
            const latency = 15 + Math.floor(Math.random() * 30);
            const el = document.getElementById('latencyValue');
            if (el) {
                el.textContent = latency + 'ms';
                el.style.color = latency < 30 ? '#00ff41' : latency < 45 ? '#f0ff00' : '#ff0033';
            }
        }, 2000);
    }

    // === PACKET COUNTER ===
    let packetCount = 0;
    function startPacketCounter() {
        setInterval(() => {
            packetCount += Math.floor(Math.random() * 15) + 1;
            const el = document.getElementById('packetCount');
            if (el) el.textContent = packetCount.toLocaleString();
        }, 500);
    }

    // === BANDWIDTH SIMULATOR ===
    function startBandwidthSimulator() {
        setInterval(() => {
            const bw = (Math.random() * 500 + 50).toFixed(1);
            const el = document.getElementById('bandwidth');
            if (el) el.textContent = bw + ' KB/s';
        }, 1500);
    }

    // === TYPING INDICATOR ===
    function startTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        const textEl = document.getElementById('typingText');
        const typingUsers = users.filter(u => u.status === 'online');

        setInterval(() => {
            if (Math.random() > 0.6 && indicator && textEl) {
                const user = typingUsers[Math.floor(Math.random() * typingUsers.length)];
                textEl.textContent = `${user.name} is typing...`;
                indicator.classList.add('visible');
                setTimeout(() => {
                    indicator.classList.remove('visible');
                }, 2000 + Math.random() * 2000);
            }
        }, 5000);
    }

    // === TERMINAL CURSOR TYPING ===
    const terminalCommands = [
        'monitoring sector 7G...',
        'scanning for ICE...',
        'rotating encryption keys...',
        'checking proxy chain...',
        'verifying node integrity...',
        'analyzing threat vectors...',
        'updating routing tables...',
        'pinging safe houses...',
        'synchronizing with mesh...',
        'decrypting broadcast...',
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function startTerminalCursor() {
        const cursor = document.getElementById('terminalCursor');
        if (!cursor) return;

        setInterval(() => {
            const cmd = terminalCommands[cmdIndex];

            if (!isDeleting) {
                charIndex++;
                cursor.textContent = cmd.substring(0, charIndex);
                if (charIndex >= cmd.length) {
                    setTimeout(() => { isDeleting = true; }, 2000);
                }
            } else {
                charIndex--;
                cursor.textContent = cmd.substring(0, charIndex);
                if (charIndex <= 0) {
                    isDeleting = false;
                    cmdIndex = (cmdIndex + 1) % terminalCommands.length;
                }
            }
        }, isDeleting ? 40 : 80);
    }

    // === NETWORK VISUALIZATION (CANVAS) ===
    function initNetworkViz() {
        const canvas = document.getElementById('networkCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const nodes = [];
        const nodeCount = 20;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 2 + Math.random() * 3,
                color: ['#00ff41', '#00f0ff', '#ff00aa', '#ff0033'][Math.floor(Math.random() * 4)],
                pulse: Math.random() * Math.PI * 2
            });
        }

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
            ctx.fillRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 80) {
                        ctx.strokeStyle = `rgba(0, 255, 65, ${0.1 * (1 - dist / 80)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach(node => {
                node.pulse += 0.02;
                const pulseSize = node.size + Math.sin(node.pulse) * 1;

                ctx.shadowBlur = 5;
                ctx.shadowColor = node.color;
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Update position
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
            });

            requestAnimationFrame(draw);
        }

        draw();
    }

    // === AUTO-INJECT NEW POSTS ===
    const newPostTemplates = [
        { category: "jobs", content: "Urgent: Need a netrunner to slice a Biodyne medical database. Patient records are worth serious eddies on the black market. Meet at Afterlife in 2 hours.", threatLevel: 3 },
        { category: "intel", content: "Corporate chatter suggests Arasaka is planning a major offensive against rogue AI constructs in the Net. All netrunners: exercise extreme caution when diving beyond the Blackwall.", threatLevel: 4 },
        { category: "tech", content: "Just got my hands on a batch of experimental optical camouflage rigs. Military prototype level. They're not perfect — you shimmer a bit in direct sunlight — but they'll fool most scanners.", threatLevel: 2 },
        { category: "intel", content: "Kang Tao is quietly acquiring a small biotech firm in Santo Domingo. Sources say they're after proprietary nanobot tech. Could be a good window for interception.", threatLevel: 2 },
        { category: "jobs", content: "Extraction job — need to pull a scientist out of a corporate lab in North Oak. She has the schematics for a new generation cyberoptic. Heavy security. Looking for a team of 4.", threatLevel: 5 },
        { category: "tech", content: "Custom-built signal interceptor finished. Can capture and decode any short-range comm within 500m. Includes voice print analysis. Taking orders — limited run of 5 units.", threatLevel: 2 },
    ];

    function startAutoPosts() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const template = newPostTemplates[Math.floor(Math.random() * newPostTemplates.length)];
                const author = users[Math.floor(Math.random() * users.length)];
                const now = new Date();

                const newPost = {
                    id: Date.now(),
                    authorId: author.id,
                    category: template.category,
                    threatLevel: template.threatLevel,
                    timestamp: now.toISOString(),
                    content: template.content,
                    likes: 0,
                    reposts: 0,
                    replies: 0
                };

                feedPosts.unshift(newPost);

                // Keep feed manageable
                if (feedPosts.length > 20) feedPosts.pop();

                const container = document.getElementById('feedStream');
                if (container) {
                    const activeFilter = document.querySelector('.nav-btn.active');
                    const filter = activeFilter ? activeFilter.dataset.filter : 'all';

                    if (filter === 'all' || filter === template.category) {
                        const itemHTML = renderFeedItem(newPost);
                        container.insertAdjacentHTML('afterbegin', itemHTML);

                        // Generate avatar
                        setTimeout(() => {
                            const canvas = document.getElementById(`avatar-feed-${newPost.id}`);
                            if (canvas) generateGlitchAvatar(canvas, author.avatarSeed);
                        }, 50);

                        attachEncryptedListeners();
                        attachCodeCopyListeners();
                        attachActionListeners();

                        // Flash the new item
                        const newEl = container.firstElementChild;
                        if (newEl) {
                            newEl.style.borderColor = '#00ff41';
                            newEl.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
                            setTimeout(() => {
                                newEl.style.borderColor = '';
                                newEl.style.boxShadow = '';
                            }, 3000);
                        }
                    }
                }

                updateCounts();
            }
        }, 12000);
    }

    // === CONTROL BUTTONS ===
    function initControls() {
        const refreshBtn = document.getElementById('refreshFeed');
        const soundBtn = document.getElementById('toggleSound');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.transform = 'rotate(360deg)';
                refreshBtn.style.transition = 'transform 0.5s ease';
                setTimeout(() => {
                    refreshBtn.style.transform = '';
                    refreshBtn.style.transition = '';
                }, 500);

                const activeFilter = document.querySelector('.nav-btn.active');
                renderFeed(activeFilter ? activeFilter.dataset.filter : 'all');
            });
        }

        let soundOn = false;
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                soundOn = !soundOn;
                document.getElementById('soundIcon').textContent = soundOn ? '🔊' : '🔇';
            });
        }
    }

    // === RANDOM GLITCH EFFECT ON PAGE ===
    function initRandomGlitches() {
        setInterval(() => {
            if (Math.random() > 0.95) {
                const body = document.body;
                body.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`;
                body.style.filter = `hue-rotate(${Math.random() * 10 - 5}deg)`;
                setTimeout(() => {
                    body.style.transform = '';
                    body.style.filter = '';
                }, 100 + Math.random() * 150);
            }
        }, 3000);
    }

    // === INITIALIZATION ===
    function init() {
        renderActiveUsers();
        renderMarketItems();
        renderAdvisories();
        renderTrendingHashes();
        renderFeed();
        initNavigation();
        initTraceModal();
        initControls();
        initNetworkViz();

        startUptimeCounter();
        startLatencySimulator();
        startPacketCounter();
        startBandwidthSimulator();
        startTypingIndicator();
        startTerminalCursor();
        startAutoPosts();
        initRandomGlitches();

        console.log('%c NEON SHADOW // UNDERGROUND FEED ', 'background: #00ff41; color: #0a0a0f; font-size: 14px; font-weight: bold; padding: 8px;');
        console.log('%c SYSTEM ONLINE. STAY SHADOWED. ', 'color: #00ff41; font-size: 10px;');
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();