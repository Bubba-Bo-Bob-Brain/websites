// ===== NEXUS//NET - Underground Datahaven =====
// Main JavaScript Controller
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
    startAnimations();
    initEncryptedMessages();
    initGlitchEffects();
    initThreatMeter();
    initTraceDetection();
    initCodeCopy();
    initRealTimeClock();
});

// ===== SYSTEM INITIALIZATION =====
function initializeSystem() {
    console.log('%c[NEXUS//NET] System initializing...', 'color: #00ffff; font-weight: bold;');
    
    // Simulate system startup sequence
    const startupMessages = [
        'Loading neural interface drivers...',
        'Establishing quantum encryption tunnel...',
        'Bypassing corporate ICE...',
        'Connecting to underground datanet...',
        'System ready. Welcome to NEXUS//NET'
    ];
    
    let delay = 0;
    startupMessages.forEach((msg, i) => {
        setTimeout(() => {
            console.log(`%c[SYSTEM] ${msg}`, 'color: #00ff88;');
        }, delay);
        delay += 300;
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
    
    // New post button
    const newPostBtn = document.getElementById('new-post-btn');
    if (newPostBtn) {
        newPostBtn.addEventListener('click', openNewPostModal);
    }
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeNewPostModal);
    }
    
    // Close modal on outside click
    const modal = document.getElementById('new-post-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeNewPostModal();
            }
        });
    }
    
    // Post type selector in modal
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', handleTypeSelect);
    });
    
    // Trace warning acknowledge button
    const traceAck = document.getElementById('trace-ack');
    if (traceAck) {
        traceAck.addEventListener('click', dismissTraceWarning);
    }
    
    // Apply job buttons
    const applyButtons = document.querySelectorAll('.apply-job');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', handleJobApplication);
    });
    
    // Node map interaction
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        node.addEventListener('click', handleNodeClick);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// ===== TAB FILTERING =====
function handleTabClick(e) {
    const tab = e.currentTarget;
    const filter = tab.dataset.filter;
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Filter posts
    const posts = document.querySelectorAll('.cyber-post');
    posts.forEach(post => {
        const category = post.dataset.category;
        if (filter === 'all' || category === filter) {
            post.style.display = 'block';
            // Add reveal animation
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
                post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 50);
        } else {
            post.style.display = 'none';
        }
    });
}

// ===== MODAL FUNCTIONS =====
function openNewPostModal() {
    const modal = document.getElementById('new-post-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('.cyber-input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeNewPostModal() {
    const modal = document.getElementById('new-post-modal');
    if (modal) {
        modal.classList.add('hidden');
        // Reset form
        const form = modal.querySelector('.modal-body');
        if (form) {
            form.reset();
            document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.type-btn[data-type="job"]').classList.add('active');
        }
    }
}

function handleTypeSelect(e) {
    const btn = e.currentTarget;
    const type = btn.dataset.type;
    
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update placeholder based on type
    const titleInput = document.querySelector('.cyber-input');
    const textarea = document.querySelector('.cyber-textarea');
    const select = document.querySelector('.cyber-select');
    
    if (titleInput && textarea) {
        switch(type) {
            case 'job':
                titleInput.placeholder = 'Enter job title...';
                textarea.placeholder = 'Describe job requirements, payment, deadline...';
                break;
            case 'leak':
                titleInput.placeholder = 'Enter leak title...';
                textarea.placeholder = 'Describe the corporate leak, include code snippets if applicable...';
                break;
            case 'trade':
                titleInput.placeholder = 'Enter item name...';
                textarea.placeholder = 'Describe item condition, price, meeting location...';
                break;
            case 'message':
                titleInput.placeholder = 'Enter encrypted subject...';
                textarea.placeholder = 'Type your encrypted message (will be masked)...';
                break;
        }
    }
    
    // Update threat level options based on type
    if (select) {
        select.innerHTML = '';
        const options = getThreatOptions(type);
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
    }
}

function getThreatOptions(type) {
    switch(type) {
        case 'job':
            return [
                {value: 'low', label: 'LOW - Courier run, no combat'},
                {value: 'medium', label: 'MEDIUM - Standard infiltration'},
                {value: 'high', label: 'HIGH - Heavy ICE, armed security'},
                {value: 'critical', label: 'CRITICAL - Suicide mission'}
            ];
        case 'leak':
            return [
                {value: 'low', label: 'LOW - Public information'},
                {value: 'medium', label: 'MEDIUM - Internal documents'},
                {value: 'high', label: 'HIGH - Executive emails'},
                {value: 'critical', label: 'CRITICAL - Zero-day exploit'}
            ];
        case 'trade':
            return [
                {value: 'low', label: 'LOW - Legal items'},
                {value: 'medium', label: 'MEDIUM - Grey market tech'},
                {value: 'high', label: 'HIGH - Restricted cyberware'},
                {value: 'critical', label: 'CRITICAL - Illegal weapons'}
            ];
        case 'message':
            return [
                {value: 'low', label: 'LOW - Standard encryption'},
                {value: 'medium', label: 'MEDIUM - Double encryption'},
                {value: 'high', label: 'HIGH - One-time pad'},
                {value: 'critical', label: 'CRITICAL - Burn after reading'}
            ];
        default:
            return [
                {value: 'low', label: 'LOW'},
                {value: 'medium', label: 'MEDIUM'},
                {value: 'high', label: 'HIGH'},
                {value: 'critical', label: 'CRITICAL'}
            ];
    }
}

// ===== ENCRYPTED MESSAGES =====
function initEncryptedMessages() {
    const encryptedElements = document.querySelectorAll('.encrypted-message');
    
    encryptedElements.forEach(el => {
        const fullMessage = el.dataset.full;
        const displayChars = '▣'.repeat(Math.ceil(fullMessage.length / 2));
        
        el.textContent = displayChars;
        el.dataset.original = fullMessage;
        el.dataset.decrypted = false;
        
        el.addEventListener('mouseenter', decryptMessage);
        el.addEventListener('mouseleave', encryptMessage);
        
        // Also support touch devices
        el.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (el.dataset.decrypted === 'true') {
                encryptMessage.call(el);
            } else {
                decryptMessage.call(el);
            }
        });
    });
}

function decryptMessage() {
    const el = this;
    const fullMessage = el.dataset.original;
    
    // Add decryption effect
    el.classList.add('decrypting');
    
    // Decode with "data decoding" effect
    let iterations = 0;
    const maxIterations = 5;
    const interval = setInterval(() => {
        const currentText = fullMessage
            .split('')
            .map((char, index) => {
                if (index < iterations * (fullMessage.length / maxIterations)) {
                    return fullMessage[index];
                }
                // Random character for effect
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        el.textContent = currentText;
        el.style.color = 'var(--neon-green)';
        el.style.textShadow = '0 0 10px var(--neon-green)';
        
        iterations++;
        if (iterations > maxIterations) {
            clearInterval(interval);
            el.textContent = fullMessage;
            el.dataset.decrypted = 'true';
            el.classList.remove('decrypting');
            
            // Add sound effect simulation (visual feedback)
            el.style.animation = 'decrypt-flash 0.3s ease';
            setTimeout(() => {
                el.style.animation = '';
            }, 300);
        }
    }, 30);
}

function encryptMessage() {
    const el = this;
    const fullMessage = el.dataset.original;
    const displayChars = '▣'.repeat(Math.ceil(fullMessage.length / 2));
    
    // Quick scramble effect
    let iterations = 0;
    const maxIterations = 3;
    const interval = setInterval(() => {
        const currentText = fullMessage
            .split('')
            .map((char, index) => {
                if (index > iterations * (fullMessage.length / maxIterations)) {
                    return displayChars[Math.floor(index / 2)] || '▣';
                }
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        el.textContent = currentText;
        iterations++;
        
        if (iterations > maxIterations) {
            clearInterval(interval);
            el.textContent = displayChars;
            el.style.color = 'var(--neon-cyan)';
            el.style.textShadow = 'none';
            el.dataset.decrypted = 'false';
        }
    }, 20);
}

// ===== GLITCH EFFECTS =====
function initGlitchEffects() {
    // Random glitch on avatars
    const avatars = document.querySelectorAll('.glitch-avatar');
    
    setInterval(() => {
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        if (randomAvatar) {
            triggerGlitch(randomAvatar);
        }
    }, 3000);
    
    // Random glitch on text
    const glitchTexts = document.querySelectorAll('.glitch-text');
    setInterval(() => {
        const randomText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
        if (randomText) {
            triggerTextGlitch(randomText);
        }
    }, 5000);
}

function triggerGlitch(element) {
    element.classList.add('glitching');
    
    // Random RGB shift
    const shiftX = (Math.random() - 0.5) * 4;
    const shiftY = (Math.random() - 0.5) * 4;
    
    element.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    element.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    
    setTimeout(() => {
        element.classList.remove('glitching');
        element.style.transform = '';
        element.style.filter = '';
    }, 100);
}

function triggerTextGlitch(element) {
    const originalText = element.dataset.text;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
    
    let iterations = 0;
    const maxIterations = 5;
    const interval = setInterval(() => {
        const glitched = originalText
            .split('')
            .map((char, i) => {
                if (i < iterations) {
                    return originalText[i];
                }
                return Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : originalText[i];
            })
            .join('');
        
        element.textContent = glitched;
        iterations++;
        
        if (iterations > maxIterations) {
            clearInterval(interval);
            element.textContent = originalText;
        }
    }, 30);
}

// ===== THREAT METER =====
function initThreatMeter() {
    const threatFill = document.getElementById('threat-level');
    const threatValue = document.getElementById('threat-value');
    
    if (!threatFill || !threatValue) return;
    
    const threatLevels = [
        {value: 20, label: 'LOW', color: '#00ff88'},
        {value: 40, label: 'ELEVATED', color: '#ffaa00'},
        {value: 60, label: 'HIGH', color: '#ff6600'},
        {value: 80, label: 'SEVERE', color: '#ff3366'},
        {value: 100, label: 'OMEGA', color: '#ff00ff'}
    ];
    
    let currentLevel = 4; // Start at OMEGA
    
    // Animate threat level periodically
    setInterval(() => {
        // Random fluctuation
        if (Math.random() > 0.7) {
            currentLevel = Math.max(0, Math.min(4, currentLevel + (Math.random() > 0.5 ? -1 : 1)));
        }
        
        const level = threatLevels[currentLevel];
        threatFill.style.width = level.value + '%';
        threatFill.style.background = `linear-gradient(90deg, ${level.color}, ${level.color}88)`;
        threatValue.textContent = level.label;
        threatValue.style.color = level.color;
        threatValue.style.textShadow = `0 0 10px ${level.color}`;
    }, 2000);
}

// ===== TRACE DETECTION =====
function initTraceDetection() {
    const traceModal = document.getElementById('trace-warning');
    if (!traceModal) return;
    
    // Simulate random trace detection
    setInterval(() => {
        if (Math.random() > 0.9 && !traceModal.classList.contains('hidden')) {
            // Already showing, ignore
            return;
        }
        
        if (Math.random() > 0.85) {
            showTraceWarning();
        }
    }, 10000);
    
    // Start with a trace warning after 5 seconds for demo
    setTimeout(() => {
        if (Math.random() > 0.5) {
            showTraceWarning();
        }
    }, 5000);
}

function showTraceWarning() {
    const traceModal = document.getElementById('trace-warning');
    if (!traceModal) return;
    
    traceModal.classList.remove('hidden');
    
    // Reset fill animation
    const traceFill = traceModal.querySelector('.trace-fill');
    if (traceFill) {
        traceFill.style.width = '0%';
        // Trigger animation
        setTimeout(() => {
            traceFill.style.width = '100%';
        }, 100);
    }
    
    // Play sound effect (visual flash)
    document.body.style.animation = 'trace-flash 0.5s ease 3';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 1500);
}

function dismissTraceWarning() {
    const traceModal = document.getElementById('trace-warning');
    if (traceModal) {
        traceModal.classList.add('hidden');
    }
}

// ===== CODE COPY FUNCTIONALITY =====
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '📋 COPY';
        copyBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 4px 8px;
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid var(--neon-cyan);
            border-radius: 3px;
            color: var(--neon-cyan);
            font-size: 0.7rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: var(--font-mono);
        `;
        
        block.style.position = 'relative';
        block.appendChild(copyBtn);
        
        block.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        block.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        copyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            copyCode(block);
        });
    });
}

function copyCode(block) {
    const code = block.querySelector('code');
    if (!code) return;
    
    const text = code.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const btn = block.querySelector('.copy-code-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ COPIED';
            btn.style.background = 'rgba(0, 255, 136, 0.3)';
            btn.style.borderColor = 'var(--neon-green)';
            btn.style.color = 'var(--neon-green)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
}

// ===== REAL-TIME CLOCK =====
function initRealTimeClock() {
    const timeElements = document.querySelectorAll('.post-time');
    if (timeElements.length === 0) return;
    
    // Update timestamps to show relative time
    function updateTimestamps() {
        const now = new Date();
        
        timeElements.forEach(el => {
            // Get the stored timestamp from data attribute or parse from text
            let timestamp = el.dataset.timestamp;
            if (!timestamp) {
                // Store original format
                el.dataset.original = el.textContent;
                // For demo, just show current time in cycle format
            }
            
            // Generate cyberpunk-style time
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const cycle = (now.getTime() / 1000 / 60 / 60 / 24).toFixed(1);
            
            // 25% chance to show different format
            if (Math.random() > 0.75) {
                el.textContent = `◉ ${hours}:${minutes}:${seconds} // CYCLE ${cycle}`;
            }
        });
    }
    
    // Update every second
    setInterval(updateTimestamps, 1000);
    updateTimestamps(); // Initial call
}

// ===== JOB APPLICATION =====
function handleJobApplication(e) {
    const btn = e.currentTarget;
    const post = btn.closest('.cyber-post');
    const jobTitle = post.querySelector('.post-title').textContent;
    
    if (btn.disabled) return;
    
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">◈</span> PROCESSING...';
    btn.style.background = 'rgba(255, 170, 0, 0.2)';
    btn.style.borderColor = 'var(--neon-amber)';
    btn.style.color = 'var(--neon-amber)';
    
    // Simulate application process
    setTimeout(() => {
        btn.innerHTML = '<span class="btn-icon">✓</span> ACCEPTED';
        btn.style.background = 'rgba(0, 255, 136, 0.2)';
        btn.style.borderColor = 'var(--neon-green)';
        btn.style.color = 'var(--neon-green)';
        
        // Show success message
        showNotification(`Application submitted for: ${jobTitle}`, 'success');
        
        // Update applicant count
        const statEl = post.querySelector('.stat');
        if (statEl) {
            const text = statEl.textContent;
            const match = text.match(/(\d+) APPLICANTS/);
            if (match) {
                const count = parseInt(match[1]) + 1;
                statEl.innerHTML = `<span class="stat-icon">◉</span> ${count} APPLICANTS`;
            }
        }
    }, 1500);
}

// ===== NODE MAP =====
function handleNodeClick(e) {
    const node = e.currentTarget;
    const nodeId = node.dataset.node;
    
    // Toggle active state
    document.querySelectorAll('.node').forEach(n => n.classList.remove('active'));
    node.classList.add('active');
    
    // Simulate connection
    node.style.animation = 'node-connect 0.5s ease';
    setTimeout(() => {
        node.style.animation = '';
    }, 500);
    
    // Show connection message
    showNotification(`Connected to node: ${nodeId.toUpperCase()}`, 'info');
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        info: 'var(--neon-cyan)',
        success: 'var(--neon-green)',
        warning: 'var(--neon-amber)',
        error: 'var(--neon-red)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: var(--bg-card);
        border: 1px solid ${colors[type] || colors.info};
        border-radius: 4px;
        color: ${colors[type] || colors.info};
        font-family: var(--font-mono);
        font-size: 0.85rem;
        z-index: 10000;
        box-shadow: 0 0 20px ${colors[type] || colors.info}44;
        animation: slide-in 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboard(e) {
    // Ctrl/Cmd + K: New post
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openNewPostModal();
    }
    
    // Escape: Close modal
    if (e.key === 'Escape') {
        closeNewPostModal();
        dismissTraceWarning();
    }
    
    // Ctrl/Cmd + F: Focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        // Could implement search functionality
    }
}

// ===== ANIMATIONS =====
function startAnimations() {
    // Add CSS for slide animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes node-connect {
            0% { transform: scale(1); box-shadow: 0 0 10px var(--neon-cyan); }
            50% { transform: scale(1.2); box-shadow: 0 0 20px var(--neon-cyan); }
            100% { transform: scale(1); box-shadow: 0 0 10px var(--neon-cyan); }
        }
        @keyframes decrypt-flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .glitching {
            animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            20% { transform: skew(-2deg); }
            40% { transform: skew(2deg); }
            60% { transform: skew(-1deg); }
            80% { transform: skew(1deg); }
            100% { transform: skew(0deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Staggered entrance animation for posts
    const posts = document.querySelectorAll('.cyber-post');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        setTimeout(() => {
            post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===== REPUTATION BADGE ANIMATION =====
function animateRepBadges() {
    const badges = document.querySelectorAll('.rep-badge');
    
    badges.forEach(badge => {
        const rep = parseInt(badge.dataset.rep);
        const displayValue = badge.querySelector('.rep-value');
        
        if (displayValue) {
            // Animate count up from 0
            let current = 0;
            const increment = rep / 30;
            const interval = setInterval(() => {
                current += increment;
                if (current >= rep) {
                    current = rep;
                    clearInterval(interval);
                }
                displayValue.textContent = Math.floor(current);
            }, 20);
        }
    });
}

// Initialize reputation animations after page load
setTimeout(animateRepBadges, 1000);

// ===== POST SUBMISSION (Demo) =====
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
    submitBtn.addEventListener('click', function() {
        const title = document.querySelector('.cyber-input').value;
        const content = document.querySelector('.cyber-textarea').value;
        const type = document.querySelector('.type-btn.active').dataset.type;
        const threat = document.querySelector('.cyber-select').value;
        
        if (!title || !content) {
            showNotification('ERROR: Title and content required', 'error');
            return;
        }
        
        // Simulate encryption and submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'ENCRYPTING & BROADCASTING...';
        submitBtn.style.animation = 'pulse 1s infinite';
        
        setTimeout(() => {
            showNotification('Broadcast encrypted and sent to network', 'success');
            closeNewPostModal();
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'ENCRYPT & BROADCAST';
            submitBtn.style.animation = '';
            
            // In a real app, would add the post to the feed
            console.log('New post:', { title, content, type, threat });
        }, 2000);
    });
}

// ===== UTILITY FUNCTIONS =====
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== CONSOLE EASTER EGG =====
console.log('%c NEXUS//NET ', 'background: linear-gradient(90deg, #00ffff, #ff00ff); color: black; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Underground Datahaven v2.7.4 ', 'color: #00ff88; font-style: italic;');
console.log('%c Type "help()" for available commands ', 'color: #ffaa00;');

// Expose some functions globally for console access
window.nexus = {
    showTrace: showTraceWarning,
    dismissTrace: dismissTraceWarning,
    notify: showNotification,
    glitch: () => initGlitchEffects(),
    scan: () => console.log('%c[SCAN] Network scan complete. 24 active nodes found.', 'color: #00ffff;')
};

window.help = function() {
    console.log('%c Available Commands:', 'color: #00ffff; font-weight: bold;');
    console.log('  nexus.showTrace()    - Trigger trace warning');
    console.log('  nexus.dismissTrace() - Dismiss trace warning');
    console.log('  nexus.notify(msg)    - Show notification');
    console.log('  nexus.glitch()       - Trigger random glitches');
    console.log('  nexus.scan()         - Perform network scan');
};

// ===== PERFORMANCE MONITORING =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Only in development
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 100) {
                console.warn(`Slow operation: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
            }
        }
    });
    observer.observe({ entryTypes: ['measure'] });
}

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', function() {
    // Clear any pending intervals/timeouts if needed
    console.log('%c[SYSTEM] Shutting down connection...', 'color: #ff3366;');
});

// ===== END OF SCRIPT =====