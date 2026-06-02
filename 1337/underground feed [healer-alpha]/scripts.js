// ============================================
// DARKNET::GRID - Underground Network Scripts
// Cyberpunk Interactive Experience
// ============================================

// Global State
const DarkNet = {
    state: {
        userCredits: 47892,
        threatLevel: 'elevated',
        isTraceActive: false,
        activeFilter: 'all',
        posts: [],
        liveFeed: [],
        latency: 47
    },
    
    // Encryption keys and ciphers
    encryption: {
        keys: {
            'MILITECH_BREACH_2087': 'https://darknet.grid/target_brief.pdf'
        }
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkNet();
});

function initializeDarkNet() {
    console.log('[DARKNET::GRID] Initializing secure connection...');
    
    // Generate all avatars
    generateAllAvatars();
    
    // Set up encryption hover effects
    setupEncryptionHovers();
    
    // Initialize navigation
    initializeNavigation();
    
    // Start live updates
    startLiveUpdates();
    
    // Start system clock
    updateSystemClock();
    setInterval(updateSystemClock, 1000);
    
    // Start random trace events
    scheduleTraceEvent();
    
    // Initialize threat level animations
    animateThreatMatrix();
    
    // Set up compose box
    initializeComposeBox();
    
    // Set up button interactions
    setupButtonInteractions();
    
    console.log('[DARKNET::GRID] Connection established. Encryption active.');
}

// ============================================
// PROCEDURAL AVATAR GENERATION
// ============================================

function generateAllAvatars() {
    const avatarCanvases = document.querySelectorAll('.avatar-canvas');
    
    avatarCanvases.forEach(canvas => {
        const seed = canvas.getAttribute('data-seed') || Math.random().toString(36).substring(7);
        const size = parseInt(canvas.width);
        
        generateProceduralAvatar(canvas, seed, size);
    });
}

function generateProceduralAvatar(canvas, seed, size) {
    const ctx = canvas.getContext('2d');
    const hash = hashString(seed);
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Create cyberpunk-themed avatar
    const colors = generateAvatarColors(hash);
    
    // Background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, size, size);
    
    // Generate grid pattern
    generateGridPattern(ctx, size, colors.grid, hash);
    
    // Generate main shape
    generateMainShape(ctx, size, colors.primary, hash);
    
    // Add glitch effects
    addGlitchEffects(ctx, size, hash);
    
    // Add scanlines
    addScanlines(ctx, size);
    
    // Add border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function generateAvatarColors(hash) {
    const hue = hash % 360;
    const saturation = 70 + (hash % 30);
    const lightness = 40 + (hash % 20);
    
    return {
        background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        primary: `hsl(${(hue + 120) % 360}, 100%, 60%)`,
        secondary: `hsl(${(hue + 240) % 360}, 90%, 50%)`,
        grid: `hsla(${hue}, 50%, 30%, 0.3)`,
        border: `hsl(${hue}, 100%, 70%)`
    };
}

function generateGridPattern(ctx, size, color, hash) {
    const gridSize = 4;
    const patternDensity = (hash % 10) / 10;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= size; x += gridSize) {
        if (Math.random() < patternDensity) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }
    }
    
    // Horizontal lines
    for (let y = 0; y <= size; y += gridSize) {
        if (Math.random() < patternDensity) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }
    }
}

function generateMainShape(ctx, size, color, hash) {
    const shapeType = hash % 5;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.3;
    
    ctx.fillStyle = color;
    
    switch(shapeType) {
        case 0: // Circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 1: // Square
            ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
            break;
            
        case 2: // Triangle
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX + radius, centerY + radius);
            ctx.lineTo(centerX - radius, centerY + radius);
            ctx.closePath();
            ctx.fill();
            break;
            
        case 3: // Diamond
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX + radius, centerY);
            ctx.lineTo(centerX, centerY + radius);
            ctx.lineTo(centerX - radius, centerY);
            ctx.closePath();
            ctx.fill();
            break;
            
        case 4: // Hexagon
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            break;
    }
    
    // Add inner details based on hash
    addInnerDetails(ctx, size, color, hash);
}

function addInnerDetails(ctx, size, color, hash) {
    const detailType = hash % 4;
    const centerX = size / 2;
    const centerY = size / 2;
    
    ctx.strokeStyle = 'rgba(0, 255, 249, 0.8)';
    ctx.lineWidth = 1;
    
    switch(detailType) {
        case 0: // Concentric circles
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, (size * 0.1) * i, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;
            
        case 1: // Crosshairs
            ctx.beginPath();
            ctx.moveTo(centerX - size * 0.2, centerY);
            ctx.lineTo(centerX + size * 0.2, centerY);
            ctx.moveTo(centerX, centerY - size * 0.2);
            ctx.lineTo(centerX, centerY + size * 0.2);
            ctx.stroke();
            break;
            
        case 2: // Diagonal lines
            ctx.beginPath();
            ctx.moveTo(size * 0.2, size * 0.2);
            ctx.lineTo(size * 0.8, size * 0.8);
            ctx.moveTo(size * 0.8, size * 0.2);
            ctx.lineTo(size * 0.2, size * 0.8);
            ctx.stroke();
            break;
            
        case 3: // Data nodes
            const nodeCount = 3 + (hash % 4);
            for (let i = 0; i < nodeCount; i++) {
                const angle = (i * Math.PI * 2) / nodeCount;
                const x = centerX + (size * 0.15) * Math.cos(angle);
                const y = centerY + (size * 0.15) * Math.sin(angle);
                
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
    }
}

function addGlitchEffects(ctx, size, hash) {
    const glitchIntensity = (hash % 10) / 10;
    
    if (Math.random() < glitchIntensity) {
        // Random color shift
        ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.3)`;
        const glitchX = Math.random() * size;
        const glitchY = Math.random() * size;
        const glitchWidth = Math.random() * size * 0.3;
        const glitchHeight = Math.random() * size * 0.1;
        
        ctx.fillRect(glitchX, glitchY, glitchWidth, glitchHeight);
    }
}

function addScanlines(ctx, size) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let y = 0; y < size; y += 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
    }
}

// ============================================
// ENCRYPTION SYSTEM
// ============================================

function setupEncryptionHovers() {
    const encryptedMessages = document.querySelectorAll('.encrypted-message');
    
    encryptedMessages.forEach(message => {
        const encryptedData = message.getAttribute('data-encrypted');
        const encryptionKey = message.getAttribute('data-key');
        const cipherElement = message.querySelector('.encrypted-cipher');
        const decryptedElement = message.querySelector('.encrypted-decrypted');
        
        if (encryptedData && cipherElement && decryptedElement) {
            // Decode base64
            try {
                const decodedText = atob(encryptedData);
                
                // Store decrypted text
                decryptedElement.textContent = decodedText;
                
                // Add hover effect with typing animation
                message.addEventListener('mouseenter', () => {
                    startDecryptionAnimation(cipherElement, decryptedElement, decodedText);
                });
                
                message.addEventListener('mouseleave', () => {
                    stopDecryptionAnimation(cipherElement, decryptedElement);
                });
            } catch (e) {
                console.error('Failed to decode encrypted message:', e);
            }
        }
    });
}

let decryptionIntervals = [];

function startDecryptionAnimation(cipherElement, decryptedElement, fullText) {
    // Clear any existing animation
    stopDecryptionAnimation(cipherElement, decryptedElement);
    
    let currentIndex = 0;
    const typingSpeed = 30; // ms per character
    
    // Create typing animation
    const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
            // Show partial decryption
            const visibleText = fullText.substring(0, currentIndex);
            const remainingCipher = '█'.repeat(fullText.length - currentIndex);
            
            decryptedElement.textContent = visibleText;
            cipherElement.textContent = remainingCipher;
            
            // Add some randomness to typing
            const delay = typingSpeed + (Math.random() * 20 - 10);
            clearInterval(interval);
            decryptionIntervals.push(setInterval(arguments.callee, delay));
            
            currentIndex++;
        } else {
            // Decryption complete
            cipherElement.style.opacity = '0';
            decryptedElement.style.opacity = '1';
        }
    }, typingSpeed);
    
    decryptionIntervals.push(interval);
}

function stopDecryptionAnimation(cipherElement, decryptedElement) {
    // Clear all intervals
    decryptionIntervals.forEach(interval => clearInterval(interval));
    decryptionIntervals = [];
    
    // Reset elements
    cipherElement.textContent = '████████████████████████████████';
    cipherElement.style.opacity = '1';
    decryptedElement.textContent = '';
    decryptedElement.style.opacity = '0';
}

// ============================================
// TRACE DETECTION SYSTEM
// ============================================

function scheduleTraceEvent() {
    // Random trace event between 30-120 seconds
    const delay = 30000 + Math.random() * 90000;
    
    setTimeout(() => {
        if (!DarkNet.state.isTraceActive && Math.random() > 0.7) {
            triggerTraceWarning();
        }
        scheduleTraceEvent(); // Schedule next trace
    }, delay);
}

function triggerTraceWarning() {
    DarkNet.state.isTraceActive = true;
    const traceWarning = document.getElementById('trace-warning');
    
    // Update trace details
    const originIp = generateRandomIP();
    const countdownElement = traceWarning.querySelector('.countdown');
    const originElement = traceWarning.querySelector('.glitch-text');
    
    if (originElement) {
        originElement.textContent = originIp;
        originElement.setAttribute('data-text', originIp);
    }
    
    // Start countdown
    let timeLeft = 47; // seconds
    countdownElement.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    
    const countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // Trace successful - trigger disconnect
            disconnect();
        } else {
            countdownElement.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        }
    }, 1000);
    
    // Show warning
    traceWarning.classList.remove('hidden');
    
    // Add to live feed
    addLiveFeedItem('⚠ TRACE DETECTED', 'warning');
}

function generateRandomIP() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function initiateSweep() {
    const traceWarning = document.getElementById('trace-warning');
    const countdownElement = traceWarning.querySelector('.countdown');
    
    // Simulate sweep process
    countdownElement.textContent = 'SWEEPING...';
    countdownElement.style.color = '#39ff14';
    
    setTimeout(() => {
        traceWarning.classList.add('hidden');
        DarkNet.state.isTraceActive = false;
        addLiveFeedItem('✓ TRACE ELIMINATED', 'success');
    }, 2000);
}

function routeTor() {
    const traceWarning = document.getElementById('trace-warning');
    const countdownElement = traceWarning.querySelector('.countdown');
    
    // Simulate Tor routing
    countdownElement.textContent = 'ROUTING...';
    countdownElement.style.color = '#00aaff';
    
    setTimeout(() => {
        traceWarning.classList.add('hidden');
        DarkNet.state.isTraceActive = false;
        addLiveFeedItem('✓ TOR ROUTE ESTABLISHED', 'success');
    }, 1500);
}

function disconnect() {
    const traceWarning = document.getElementById('trace-warning');
    
    // Flash screen red
    document.body.style.backgroundColor = '#ff0040';
    document.body.style.transition = 'background-color 0.5s';
    
    setTimeout(() => {
        document.body.style.backgroundColor = '';
        traceWarning.classList.add('hidden');
        DarkNet.state.isTraceActive = false;
        
        // Simulate reconnection
        addLiveFeedItem('⚠ EMERGENCY DISCONNECT', 'warning');
        setTimeout(() => {
            addLiveFeedItem('✓ RECONNECTING...', 'info');
        }, 1000);
    }, 1000);
}

function attemptDecrypt() {
    const btn = event.target;
    const originalText = btn.textContent;
    
    // Simulate decryption attempt
    btn.textContent = 'ATTEMPTING...';
    btn.disabled = true;
    
    setTimeout(() => {
        // 30% chance of success
        if (Math.random() > 0.7) {
            btn.textContent = 'ACCESS GRANTED';
            btn.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
            btn.style.borderColor = '#39ff14';
            btn.style.color = '#39ff14';
            addLiveFeedItem('✓ DECRYPTION SUCCESSFUL', 'success');
        } else {
            btn.textContent = 'ACCESS DENIED';
            btn.style.backgroundColor = 'rgba(255, 0, 64, 0.2)';
            btn.style.borderColor = '#ff0040';
            btn.style.color = '#ff0040';
            addLiveFeedItem('✗ DECRYPTION FAILED', 'warning');
            
            // Reset after delay
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 2000);
        }
    }, 1500);
}

// ============================================
// NAVIGATION & FILTERING
// ============================================

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter type
            const filter = button.getAttribute('data-filter');
            DarkNet.state.activeFilter = filter;
            
            // Filter posts
            filterPosts(filter);
            
            // Add to live feed
            addLiveFeedItem(`FILTER: ${filter.toUpperCase()}`, 'info');
        });
    });
}

function filterPosts(filterType) {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
        const postType = post.getAttribute('data-type');
        
        if (filterType === 'all' || postType === filterType) {
            post.style.display = 'block';
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                post.style.transition = 'all 0.3s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 50);
        } else {
            post.style.display = 'none';
        }
    });
}

// ============================================
// LIVE FEED SYSTEM
// ============================================

function startLiveUpdates() {
    // Add initial items
    addLiveFeedItem('Node @ghost_7 connected', 'info');
    addLiveFeedItem('New job posted: DataExfil', 'info');
    addLiveFeedItem('Transaction: ◈ 15,000 XMR', 'success');
    
    // Periodic updates
    setInterval(() => {
        const updateTypes = [
            { text: 'Node @shadow connected', type: 'info' },
            { text: 'New intel verified', type: 'success' },
            { text: 'Transaction completed', type: 'success' },
            { text: '⚠ Trace attempt blocked', type: 'warning' },
            { text: 'New market listing', type: 'info' },
            { text: 'Encryption rotated', type: 'info' }
        ];
        
        const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
        addLiveFeedItem(randomUpdate.text, randomUpdate.type);
        
        // Update stats
        updateNetworkStats();
    }, 8000);
}

function addLiveFeedItem(text, type = 'info') {
    const liveFeed = document.getElementById('live-feed');
    if (!liveFeed) return;
    
    // Create new item
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    
    // Get current time
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Set content
    feedItem.innerHTML = `
        <span class="feed-time">${timeString}</span>
        <span class="feed-msg ${type === 'warning' ? 'warning' : ''}">${text}</span>
    `;
    
    // Add to top
    liveFeed.insertBefore(feedItem, liveFeed.firstChild);
    
    // Limit to 10 items
    while (liveFeed.children.length > 10) {
        liveFeed.removeChild(liveFeed.lastChild);
    }
    
    // Add animation
    feedItem.style.animation = 'feed-appear 0.3s ease-out';
}

function updateNetworkStats() {
    // Update node count
    const nodeCountElement = document.getElementById('node-count');
    if (nodeCountElement) {
        const currentCount = parseInt(nodeCountElement.textContent.replace(/,/g, ''));
        const newCount = currentCount + Math.floor(Math.random() * 10) - 5;
        nodeCountElement.textContent = Math.max(2500, newCount).toLocaleString();
    }
    
    // Update job count
    const jobCountElement = document.getElementById('job-count');
    if (jobCountElement) {
        const currentJobs = parseInt(jobCountElement.textContent);
        const newJobs = currentJobs + Math.floor(Math.random() * 5) - 2;
        jobCountElement.textContent = Math.max(100, newJobs);
    }
    
    // Update latency
    DarkNet.state.latency = Math.floor(30 + Math.random() * 40);
    const latencyElement = document.getElementById('latency');
    if (latencyElement) {
        latencyElement.textContent = `${DarkNet.state.latency}ms`;
    }
}

// ============================================
// SYSTEM CLOCK
// ============================================

function updateSystemClock() {
    const timeElement = document.getElementById('system-time');
    if (!timeElement) return;
    
    const now = new Date();
    const year = 2087;
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    timeElement.textContent = `${year}.${month}.${day} // ${hours}:${minutes}:${seconds}`;
}

// ============================================
// THREAT MATRIX ANIMATION
// ============================================

function animateThreatMatrix() {
    const threatFill = document.querySelector('.threat-fill');
    if (!threatFill) return;
    
    // Animate threat level
    setInterval(() => {
        const currentHeight = parseInt(threatFill.style.height) || 65;
        const newHeight = Math.max(20, Math.min(90, currentHeight + (Math.random() * 10 - 5)));
        threatFill.style.height = `${newHeight}%`;
    }, 3000);
}

// ============================================
// COMPOSE BOX FUNCTIONALITY
// ============================================

function initializeComposeBox() {
    const composeInput = document.querySelector('.compose-input');
    const composeSubmit = document.querySelector('.compose-submit');
    
    if (composeInput) {
        // Auto-resize textarea
        composeInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight}px`;
        });
        
        // Handle submit
        if (composeSubmit) {
            composeSubmit.addEventListener('click', () => {
                const content = composeInput.value.trim();
                if (content) {
                    // Simulate posting
                    addLiveFeedItem('✓ POST BROADCASTED', 'success');
                    composeInput.value = '';
                    composeInput.style.height = 'auto';
                }
            });
        }
    }
}

// ============================================
// BUTTON INTERACTIONS
// ============================================

function setupButtonInteractions() {
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('.qa-label').textContent;
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // Handle specific actions
            switch(action) {
                case 'GEN KEYS':
                    addLiveFeedItem('✓ NEW KEYS GENERATED', 'success');
                    break;
                case 'WIPE TRACE':
                    addLiveFeedItem('✓ TRACE WIPED', 'success');
                    break;
                case 'NEW NODE':
                    addLiveFeedItem('✓ CONNECTED TO NEW NODE', 'success');
                    break;
                case 'NUKE ID':
                    addLiveFeedItem('⚠ IDENTITY RESET', 'warning');
                    break;
            }
        });
    });
    
    // Stat buttons
    const statBtns = document.querySelectorAll('.stat-btn:not(.disabled)');
    statBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const valueElement = this.querySelector('.stat-value');
            if (valueElement && !isNaN(parseInt(valueElement.textContent))) {
                const currentValue = parseInt(valueElement.textContent);
                const newValue = currentValue + 1;
                valueElement.textContent = newValue;
                
                // Visual feedback
                this.style.color = '#00fff9';
                setTimeout(() => {
                    this.style.color = '';
                }, 300);
            }
        });
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<span class="load-icon">⟲</span> LOADING...';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = '<span class="load-icon">⟲</span> LOAD MORE POSTS';
                this.disabled = false;
                addLiveFeedItem('✓ FEED UPDATED', 'info');
            }, 1500);
        });
    }
    
    // Action buttons in posts
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const action = this.textContent.trim();
            
            // Visual feedback
            const originalBg = this.style.backgroundColor;
            const originalColor = this.style.color;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // Handle specific actions
            switch(action) {
                case 'APPLY FOR JOB':
                    addLiveFeedItem('✓ JOB APPLICATION SENT', 'success');
                    break;
                case 'DOWNLOAD':
                    addLiveFeedItem('✓ DOWNLOAD STARTED', 'info');
                    break;
                case 'BOOST':
                    addLiveFeedItem('✓ POST BOOSTED', 'success');
                    break;
                case 'MAKE OFFER':
                    addLiveFeedItem('✓ OFFER SENT', 'success');
                    break;
                case 'MESSAGE':
                    addLiveFeedItem('✓ MESSAGE COMPOSED', 'info');
                    break;
                case 'REPLY':
                    addLiveFeedItem('✓ REPLY COMPOSED', 'info');
                    break;
                case 'SAVE':
                    addLiveFeedItem('✓ POST SAVED', 'success');
                    break;
                case 'REQUEST ACCESS':
                    addLiveFeedItem('✓ ACCESS REQUESTED', 'info');
                    break;
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Add some random interactivity to elements
document.addEventListener('mousemove', (e) => {
    // Add subtle glow effect following mouse
    const glow = document.createElement('div');
    glow.style.position = 'fixed';
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.style.width = '2px';
    glow.style.height = '2px';
    glow.style.background = '#00fff9';
    glow.style.borderRadius = '50%';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '9996';
    glow.style.opacity = '0.5';
    glow.style.boxShadow = '0 0 5px #00fff9';
    
    document.body.appendChild(glow);
    
    setTimeout(() => {
        glow.style.transition = 'all 0.5s ease';
        glow.style.opacity = '0';
        glow.style.transform = 'scale(10)';
        
        setTimeout(() => {
            glow.remove();
        }, 500);
    }, 100);
});

// Console welcome message
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗██████╗     ║
║   ██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗    ║
║   ██║  ██║██║   ██║██║  ██║██║  ███╗█████╗  ██████╔╝    ║
║   ██║  ██║██║   ██║██║  ██║██║   ██║██╔══╝  ██╔══██╗    ║
║   ██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗██║  ██║    ║
║   ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝    ║
║                                                          ║
║   ██████╗ ███████╗ █████╗ ██████╗ ██╗   ██╗             ║
║   ██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝             ║
║   ██║  ██║█████╗  ███████║██║  ██║ ╚████╔╝              ║
║   ██║  ██║██╔══╝  ██╔══██║██║  ██║  ╚██╔╝               ║
║   ██████╔╝███████╗██║  ██║██████╔╝   ██║                ║
║   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝                ║
║                                                          ║
║   ██████╗  ██████╗ ████████╗                            ║
║   ██╔══██╗██╔═══██╗╚══██╔══╝                            ║
║   ██████╔╝██║   ██║   ██║                               ║
║   ██╔══██╗██║   ██║   ██║                               ║
║   ██████╔╝╚██████╔╝   ██║                               ║
║   ╚═════╝  ╚═════╝    ╚═╝                               ║
║                                                          ║
║   UNDERGROUND NETWORK FEED v3.7.1                        ║
║   All communications are encrypted.                     ║
║   You are now connected to the darknet.                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

console.log('[DARKNET::GRID] System ready. Type "DarkNet" for debug access.');