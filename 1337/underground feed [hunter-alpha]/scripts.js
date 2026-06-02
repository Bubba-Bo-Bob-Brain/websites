/* ========================================
   NEXUS UNDERGROUND NETWORK
   Cyberpunk Social Feed JavaScript
   ======================================== */

// ========================================
// DATA RAIN BACKGROUND
// ========================================

class DataRain {
    constructor() {
        this.canvas = document.getElementById('dataRain');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|\\/*-+=~`!@#$%^&()';
        this.fontSize = 14;
        this.columns = [];
        this.drops = [];
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.init());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        this.columns = [];
        this.drops = [];
        
        for (let i = 0; i < columnCount; i++) {
            this.columns.push(i);
            this.drops.push(Math.random() * -100);
        }
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.font = `${this.fontSize}px Share Tech Mono`;
        
        for (let i = 0; i < this.columns.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = this.columns[i] * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Vary the color for some characters
            if (Math.random() > 0.98) {
                this.ctx.fillStyle = '#ff00aa';
            } else if (Math.random() > 0.95) {
                this.ctx.fillStyle = '#39ff14';
            } else {
                this.ctx.fillStyle = '#00f0ff';
            }
            
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// ENCRYPTED MESSAGE DECRYPTION
// ========================================

class EncryptionHandler {
    constructor() {
        this.encryptedPreviews = document.querySelectorAll('.encrypted-preview');
        this.init();
    }
    
    init() {
        this.encryptedPreviews.forEach(preview => {
            preview.addEventListener('mouseenter', (e) => this.decrypt(e.target.closest('.encrypted-preview')));
            preview.addEventListener('mouseleave', (e) => this.reencrypt(e.target.closest('.encrypted-preview')));
        });
    }
    
    decrypt(preview) {
        const decryptedText = preview.dataset.decrypted;
        const textElement = preview.querySelector('.encrypted-text');
        const labelElement = preview.querySelector('.encrypted-label');
        
        if (!decryptedText || !textElement) return;
        
        labelElement.textContent = '🔓 DECRYPTING...';
        preview.classList.add('decrypting');
        
        // Create decrypting animation
        let currentIndex = 0;
        const chars = '█▓▒░╔╗╚╝║═┼┤├┴┬│─┌┐└┘';
        
        const decryptInterval = setInterval(() => {
            let result = '';
            for (let i = 0; i < decryptedText.length; i++) {
                if (i < currentIndex) {
                    result += decryptedText[i];
                } else if (i < currentIndex + 5) {
                    result += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    result += '▪';
                }
            }
            textElement.textContent = result;
            textElement.style.color = `hsl(${160 + Math.random() * 40}, 100%, 50%)`;
            
            currentIndex++;
            
            if (currentIndex > decryptedText.length) {
                clearInterval(decryptInterval);
                textElement.textContent = decryptedText;
                textElement.style.color = '#39ff14';
                labelElement.textContent = '🔓 DECRYPTED — MOUSE AWAY TO RE-ENCRYPT';
                preview.classList.remove('decrypting');
            }
        }, 20);
        
        preview.decryptInterval = decryptInterval;
    }
    
    reencrypt(preview) {
        const textElement = preview.querySelector('.encrypted-text');
        const labelElement = preview.querySelector('.encrypted-label');
        
        if (preview.decryptInterval) {
            clearInterval(preview.decryptInterval);
        }
        
        // Animate re-encryption
        const originalText = textElement.textContent;
        let currentIndex = originalText.length;
        const chars = '█▓▒░╔╗╚╝║═┼┤├┴┬│─┌┐└┘';
        
        const encryptInterval = setInterval(() => {
            let result = '';
            for (let i = 0; i < originalText.length; i++) {
                if (i < currentIndex) {
                    result += originalText[i];
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            textElement.textContent = result;
            textElement.style.color = `hsl(${0 + Math.random() * 60}, 50%, ${40 + Math.random() * 20}%)`;
            
            currentIndex -= 2;
            
            if (currentIndex <= 0) {
                clearInterval(encryptInterval);
                textElement.textContent = '▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪';
                textElement.style.color = '#6e7681';
                labelElement.textContent = '🔒 CLASSIFIED INTEL — HOVER TO DECRYPT';
            }
        }, 15);
    }
}

// ========================================
// TRACE WARNING SYSTEM
// ========================================

function showTraceWarning() {
    const warning = document.getElementById('traceWarning');
    warning.classList.remove('hidden');
    
    // Play alert sound effect (visual representation)
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (!warning.classList.contains('hidden')) {
            dismissTrace();
        }
    }, 5000);
}

function dismissTrace() {
    const warning = document.getElementById('traceWarning');
    warning.style.animation = 'traceFadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        warning.classList.add('hidden');
        warning.style.animation = '';
    }, 500);
}

// Add dismiss animation
const traceFadeOutStyle = document.createElement('style');
traceFadeOutStyle.textContent = `
    @keyframes traceFadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(traceFadeOutStyle);

// ========================================
// AVATAR GLITCH EFFECTS
// ========================================

class AvatarGlitch {
    constructor() {
        this.avatars = document.querySelectorAll('.glitch-avatar');
        this.init();
    }
    
    init() {
        // Random glitch effect on avatars
        setInterval(() => {
            const randomAvatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
            this.triggerGlitch(randomAvatar);
        }, 3000);
    }
    
    triggerGlitch(avatar) {
        if (!avatar) return;
        
        avatar.style.animation = 'none';
        setTimeout(() => {
            avatar.style.animation = '';
        }, 10);
        
        const layers = avatar.querySelectorAll('.avatar-glitch-layer');
        layers.forEach((layer, index) => {
            layer.style.animation = `avatarGlitch${index + 1} 0.2s ease-in-out`;
            setTimeout(() => {
                layer.style.animation = '';
            }, 200);
        });
    }
}

// ========================================
// CODE COPY FUNCTIONALITY
// ========================================

class CodeCopy {
    constructor() {
        this.copyButtons = document.querySelectorAll('.code-copy');
        this.init();
    }
    
    init() {
        this.copyButtons.forEach(button => {
            button.addEventListener('click', (e) => this.copyCode(e.target));
        });
    }
    
    copyCode(button) {
        const codeBlock = button.closest('.code-block');
        const codeContent = codeBlock.querySelector('.code-content code');
        
        if (!codeContent) return;
        
        const textToCopy = codeContent.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = 'COPIED!';
            button.style.color = '#39ff14';
            button.style.borderColor = '#39ff14';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.color = '';
                button.style.borderColor = '';
            }, 2000);
        }).catch(() => {
            button.textContent = 'ERROR';
            button.style.color = '#ff003c';
        });
    }
}

// ========================================
// POST INTERACTIONS
// ========================================

class PostInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        // Post action buttons
        document.querySelectorAll('.post-action').forEach(action => {
            action.addEventListener('click', (e) => this.handleAction(e));
        });
        
        // Tag buttons in composer
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleTag(e.target));
        });
        
        // Broadcast button
        const broadcastBtn = document.querySelector('.composer-broadcast');
        if (broadcastBtn) {
            broadcastBtn.addEventListener('click', () => this.broadcast());
        }
        
        // Load more button
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    }
    
    handleAction(e) {
        const action = e.currentTarget;
        const countEl = action.querySelector('.action-count');
        
        if (!countEl) return;
        
        // Check if already clicked
        if (action.classList.contains('active')) {
            action.classList.remove('active');
            countEl.textContent = parseInt(countEl.textContent) - 1;
            action.style.color = '';
            action.style.background = '';
        } else {
            action.classList.add('active');
            countEl.textContent = parseInt(countEl.textContent) + 1;
            action.style.color = '#00f0ff';
            action.style.background = 'rgba(0, 240, 255, 0.1)';
            
            // Trigger glitch effect
            this.triggerActionGlitch(action);
        }
    }
    
    triggerActionGlitch(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'actionGlitch 0.3s ease-out';
        }, 10);
    }
    
    toggleTag(btn) {
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            btn.style.background = 'rgba(0, 240, 255, 0.2)';
            btn.style.borderColor = '#00f0ff';
            btn.style.color = '#00f0ff';
        } else {
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }
    }
    
    broadcast() {
        const input = document.querySelector('.composer-input');
        const text = input.value.trim();
        
        if (!text) {
            this.showNotification('ERROR: Message cannot be empty', 'error');
            return;
        }
        
        // Simulate encryption and broadcast
        const broadcastBtn = document.querySelector('.composer-broadcast');
        broadcastBtn.textContent = 'ENCRYPTING...';
        broadcastBtn.disabled = true;
        
        setTimeout(() => {
            broadcastBtn.textContent = 'ROUTING...';
        }, 500);
        
        setTimeout(() => {
            broadcastBtn.textContent = 'BROADCAST SENT ✓';
            broadcastBtn.style.background = 'linear-gradient(135deg, #39ff14 0%, #00f0ff 100%)';
            
            this.showNotification('Transmission encrypted and broadcast to all nodes', 'success');
            
            setTimeout(() => {
                broadcastBtn.textContent = 'BROADCAST ▸';
                broadcastBtn.style.background = '';
                broadcastBtn.disabled = false;
                input.value = '';
            }, 2000);
        }, 1500);
    }
    
    loadMore() {
        const btn = document.querySelector('.load-more-btn');
        btn.innerHTML = '<span class="load-icon">⟐</span><span class="load-text">DECRYPTING...</span><span class="load-icon">⟐</span>';
        
        setTimeout(() => {
            btn.innerHTML = '<span class="load-icon">⟐</span><span class="load-text">NO MORE TRANSMISSIONS</span><span class="load-icon">⟐</span>';
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
        }, 2000);
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-text">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.5s ease-out forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 4px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.85rem;
        z-index: 10001;
        animation: notificationSlideIn 0.5s ease-out;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }
    
    .notification-success {
        border-color: #39ff14;
        color: #39ff14;
    }
    
    .notification-error {
        border-color: #ff003c;
        color: #ff003c;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    @keyframes notificationSlideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes notificationSlideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes actionGlitch {
        0% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        50% { transform: translateX(2px); }
        75% { transform: translateX(-1px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// LIVE DATA UPDATES
// ========================================

class LiveDataUpdates {
    constructor() {
        this.init();
    }
    
    init() {
        // Update network stats periodically
        setInterval(() => this.updateNetworkStats(), 5000);
        
        // Update latency
        setInterval(() => this.updateLatency(), 2000);
        
        // Update node count
        setInterval(() => this.updateNodeCount(), 8000);
    }
    
    updateNetworkStats() {
        const dataTransfer = document.getElementById('dataTransfer');
        const encryptedComms = document.getElementById('encryptedComms');
        
        if (dataTransfer) {
            const current = parseFloat(dataTransfer.textContent);
            const newValue = (current + Math.random() * 0.5).toFixed(1);
            dataTransfer.textContent = `${newValue} TB`;
            this.flashElement(dataTransfer);
        }
        
        if (encryptedComms) {
            const newValue = (97 + Math.random() * 2.9).toFixed(1);
            encryptedComms.textContent = `${newValue}%`;
            this.flashElement(encryptedComms);
        }
    }
    
    updateLatency() {
        const latency = document.getElementById('latency');
        if (latency) {
            const newLatency = Math.floor(8 + Math.random() * 15);
            latency.textContent = `${newLatency}ms`;
            
            if (newLatency > 20) {
                latency.style.color = '#ff6a00';
            } else if (newLatency > 15) {
                latency.style.color = '#ff6a00';
            } else {
                latency.style.color = '#39ff14';
            }
        }
    }
    
    updateNodeCount() {
        const nodeCount = document.querySelector('.node-count');
        const activeNodes = document.getElementById('activeNodes');
        
        if (nodeCount) {
            const current = parseInt(nodeCount.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 20) - 10;
            const newValue = current + change;
            nodeCount.textContent = `${newValue.toLocaleString()} NODES`;
            this.flashElement(nodeCount);
        }
        
        if (activeNodes) {
            const current = parseInt(activeNodes.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 20) - 10;
            const newValue = current + change;
            activeNodes.textContent = newValue.toLocaleString();
            this.flashElement(activeNodes);
        }
    }
    
    flashElement(element) {
        element.style.transition = 'none';
        element.style.color = '#00f0ff';
        element.style.textShadow = '0 0 10px rgba(0, 240, 255, 0.5)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.color = '';
            element.style.textShadow = '';
        }, 300);
    }
}

// ========================================
// RANDOM GLITCH EFFECTS
// ========================================

class RandomGlitch {
    constructor() {
        this.elements = [
            '.logo',
            '.post-title',
            '.author-name',
            '.ticker-item'
        ];
        
        this.init();
    }
    
    init() {
        setInterval(() => this.triggerRandomGlitch(), 4000);
    }
    
    triggerRandomGlitch() {
        const selector = this.elements[Math.floor(Math.random() * this.elements.length)];
        const elements = document.querySelectorAll(selector);
        
        if (elements.length === 0) return;
        
        const element = elements[Math.floor(Math.random() * elements.length)];
        
        // Create glitch effect
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'randomGlitch 0.3s ease-out';
        
        // Add temporary color shift
        const originalColor = element.style.color;
        element.style.color = Math.random() > 0.5 ? '#ff00aa' : '#00f0ff';
        
        setTimeout(() => {
            element.style.animation = '';
            element.style.color = originalColor;
        }, 300);
    }
}

// Add random glitch animation
const glitchStyles = document.createElement('style');
glitchStyles.textContent = `
    @keyframes randomGlitch {
        0% { 
            transform: translateX(0) skewX(0);
            filter: none;
        }
        10% { 
            transform: translateX(-3px) skewX(-2deg);
            filter: hue-rotate(90deg);
        }
        20% { 
            transform: translateX(3px) skewX(2deg);
            filter: hue-rotate(180deg);
        }
        30% { 
            transform: translateX(-2px) skewX(-1deg);
            filter: hue-rotate(270deg);
        }
        40% { 
            transform: translateX(2px) skewX(1deg);
            filter: hue-rotate(360deg);
        }
        50% { 
            transform: translateX(-1px);
            filter: none;
        }
        100% { 
            transform: translateX(0);
            filter: none;
        }
    }
`;
document.head.appendChild(glitchStyles);

// ========================================
// THREAT LEVEL ANIMATIONS
// ========================================

class ThreatAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Occasionally flash threat indicators
        setInterval(() => this.flashRandomThreat(), 6000);
        
        // Update corp threat bars periodically
        setInterval(() => this.updateCorpThreats(), 10000);
    }
    
    flashRandomThreat() {
        const threats = document.querySelectorAll('.threat-level');
        if (threats.length === 0) return;
        
        const randomThreat = threats[Math.floor(Math.random() * threats.length)];
        randomThreat.style.animation = 'none';
        randomThreat.offsetHeight;
        randomThreat.style.animation = 'threatFlash 0.5s ease-out';
    }
    
    updateCorpThreats() {
        const threatBars = document.querySelectorAll('.corp-threat-fill');
        threatBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            const change = Math.floor(Math.random() * 10) - 5;
            const newWidth = Math.max(20, Math.min(98, currentWidth + change));
            bar.style.width = `${newWidth}%`;
        });
    }
}

// Add threat flash animation
const threatFlashStyle = document.createElement('style');
threatFlashStyle.textContent = `
    @keyframes threatFlash {
        0%, 100% { 
            box-shadow: none;
            transform: scale(1);
        }
        50% { 
            box-shadow: 0 0 20px currentColor;
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(threatFlashStyle);

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

class SearchHandler {
    constructor() {
        this.input = document.querySelector('.search-input');
        this.init();
    }
    
    init() {
        if (!this.input) return;
        
        this.input.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeSearch(e.target.value);
            }
        });
    }
    
    handleSearch(query) {
        const encryptBadge = document.querySelector('.search-encrypt');
        if (!encryptBadge) return;
        
        if (query.length > 0) {
            encryptBadge.textContent = `[${query.length} CHARS]`;
            encryptBadge.style.color = '#39ff14';
        } else {
            encryptBadge.textContent = '[AES-256]';
            encryptBadge.style.color = '';
        }
    }
    
    executeSearch(query) {
        if (!query.trim()) return;
        
        // Simulate encrypted search
        const container = document.querySelector('.search-container');
        container.style.borderColor = '#ff6a00';
        container.style.boxShadow = '0 0 20px rgba(255, 106, 0, 0.3)';
        
        setTimeout(() => {
            container.style.borderColor = '#39ff14';
            container.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.3)';
            
            setTimeout(() => {
                container.style.borderColor = '';
                container.style.boxShadow = '';
            }, 1000);
        }, 500);
    }
}

// ========================================
// NAVIGATION INTERACTIONS
// ========================================

class NavigationHandler {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }
    
    handleNavClick(e) {
        e.preventDefault();
        
        // Remove active from all
        this.navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked
        e.currentTarget.classList.add('active');
        
        // Trigger visual feedback
        e.currentTarget.style.animation = 'navClick 0.3s ease-out';
        setTimeout(() => {
            e.currentTarget.style.animation = '';
        }, 300);
    }
}

// Add nav click animation
const navStyles = document.createElement('style');
navStyles.textContent = `
    @keyframes navClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.98); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(navStyles);

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    const dataRain = new DataRain();
    const encryption = new EncryptionHandler();
    const avatarGlitch = new AvatarGlitch();
    const codeCopy = new CodeCopy();
    const postInteractions = new PostInteractions();
    const liveData = new LiveDataUpdates();
    const randomGlitch = new RandomGlitch();
    const threatAnimations = new ThreatAnimations();
    const searchHandler = new SearchHandler();
    const navigation = new NavigationHandler();
    
    // Console easter egg
    console.log('%c NEXUS UNDERGROUND NETWORK ', 'background: #0a0a0f; color: #00f0ff; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Welcome, runner. All communications are monitored. ', 'background: #0a0a0f; color: #ff00aa; font-size: 12px; padding: 5px;');
    console.log('%c ⚠ TRACE PROTECTION ACTIVE ⚠ ', 'background: #ff003c; color: #ffffff; font-size: 10px; padding: 3px;');
    
    // Random trace warning (for demo purposes - disabled by default)
    // Uncomment the line below to enable random trace warnings
    // setTimeout(() => showTraceWarning(), 10000);
    
    // Add loading complete indicator
    document.body.classList.add('loaded');
    
    // Stagger post animations
    const posts = document.querySelectorAll('.post');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.5s ease-out';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
    }
    
    // Escape to dismiss trace warning
    if (e.key === 'Escape') {
        dismissTrace();
    }
    
    // T for random trace warning (demo)
    if (e.key === 't' && e.altKey) {
        showTraceWarning();
    }
});

// ========================================
// PERFORMANCE MONITORING (Visual only)
// ========================================

class PerformanceVisualizer {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        
        // Only show in debug mode
        if (window.location.hash === '#debug') {
            this.createFPSCounter();
            this.monitor();
        }
    }
    
    createFPSCounter() {
        const counter = document.createElement('div');
        counter.id = 'fps-counter';
        counter.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(10, 10, 15, 0.9);
            border: 1px solid #00f0ff;
            padding: 5px 10px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px;
            color: #00f0ff;
            z-index: 99999;
        `;
        document.body.appendChild(counter);
        this.counter = counter;
    }
    
    monitor() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            if (this.counter) {
                this.counter.textContent = `FPS: ${this.fps}`;
                this.counter.style.color = this.fps < 30 ? '#ff003c' : this.fps < 50 ? '#ff6a00' : '#39ff14';
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// Initialize performance visualizer
const perfVis = new PerformanceVisualizer();

// ========================================
// INTERCEPTED COMM ANIMATION
// ========================================

class InterceptedCommAnimation {
    constructor() {
        this.comms = document.querySelectorAll('.intercepted-comm');
        this.init();
    }
    
    init() {
        // Add typing effect to comm lines when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCommLines(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.comms.forEach(comm => observer.observe(comm));
    }
    
    animateCommLines(comm) {
        const lines = comm.querySelectorAll('.comm-line');
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            
            setTimeout(() => {
                line.style.transition = 'all 0.3s ease-out';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }
}

// Initialize intercepted comm animation
const commAnimation = new InterceptedCommAnimation();

// ========================================
// MARKET ITEM HOVER EFFECTS
// ========================================

class MarketItemEffects {
    constructor() {
        this.items = document.querySelectorAll('.market-item');
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            item.addEventListener('mouseenter', () => this.onHover(item));
            item.addEventListener('mouseleave', () => this.onLeave(item));
        });
    }
    
    onHover(item) {
        const price = item.querySelector('.price-value');
        if (price) {
            price.style.textShadow = '0 0 15px rgba(57, 255, 20, 0.8)';
        }
    }
    
    onLeave(item) {
        const price = item.querySelector('.price-value');
        if (price) {
            price.style.textShadow = '';
        }
    }
}

// Initialize market effects
const marketEffects = new MarketItemEffects();

// ========================================
// TICKER RANDOMIZATION
// ========================================

class TickerRandomizer {
    constructor() {
        this.messages = [
            '◆ MEGACORP-7 BREACH CONFIRMED — 2.4TB EXFILTRATED',
            '◆ NEW ZERO-DAY ON DARKMART — BID STARTS AT 50K CREDITS',
            '◆ GHOST_PROTOCOL COMPROMISED — ALL OPERATIVES RE-ROUTE',
            '◆ NEURAL IMPLANT V3.2 PATCHED — EXPLOIT WINDOW CLOSED',
            '◆ RUNNER "SILVER_HAND" TAGGED — AVOID SECTOR 7G',
            '◆ QUANTUM ENCRYPTION KEYS ROTATED — UPDATE YOUR CERTS',
            '◆ CORPORATE WETWORK CONTRACT OPEN — 200K CREDITS',
            '◆ ARASAKA PATROL DRONES SPOTTED IN SECTOR 12',
            '◆ SAFE HOUSE IN SECTOR 4 COMPROMISED — RELOCATE',
            '◆ NEW RUNNER RECRUITMENT — SKILLS: NETRUNNING, COMBAT',
            '◆ ICE BREAKER V5.0 LEAKED — DOWNLOAD FROM DEAD DROP',
            '◆ TRAUMA TEAM CONTRACTS NOW ACCEPTING CRYPTO PAYMENTS'
        ];
        this.init();
    }
    
    init() {
        // Occasionally add new ticker items
        setInterval(() => this.addRandomMessage(), 15000);
    }
    
    addRandomMessage() {
        const ticker = document.querySelector('.ticker-content');
        if (!ticker) return;
        
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        const newItem = document.createElement('span');
        newItem.className = 'ticker-item';
        newItem.textContent = message;
        newItem.style.color = '#00f0ff';
        
        ticker.appendChild(newItem);
        
        // Flash effect
        setTimeout(() => {
            newItem.style.transition = 'color 1s ease';
            newItem.style.color = '';
        }, 500);
    }
}

// Initialize ticker
const tickerRandomizer = new TickerRandomizer();