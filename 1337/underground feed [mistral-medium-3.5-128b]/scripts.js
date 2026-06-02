// ===== DOM Elements =====
const threatValueElement = document.getElementById('threat-value');
const traceWarningElement = document.getElementById('trace-warning');
const countdownElement = document.getElementById('countdown');
const abortBtn = document.getElementById('abort-btn');
const encryptedPreviews = document.querySelectorAll('.encrypted-preview');
const actionButtons = document.querySelectorAll('.action-btn');
const feedPosts = document.querySelectorAll('.feed-post');
const glitchAvatars = document.querySelectorAll('.glitch-avatar');
const hologramBadges = document.querySelectorAll('.hologram-badge');
const navLinks = document.querySelectorAll('.nav-link');

// ===== State Management =====
let threatLevel = 0;
const maxThreatLevel = 100;
let reputation = 1287;
let traceActive = false;
let countdownInterval;
let currentCountdown = 10;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    updateThreatLevel();
    initializeEncryptedMessages();
    initializeGlitchEffects();
    initializeReputationSystem();
    initializeTraceWarning();
    initializePostInteractions();
    initializeRandomEvents();

    // Set random threat level on load
    setRandomThreatLevel();
});

// ===== Threat Level System =====
function setRandomThreatLevel() {
    threatLevel = Math.floor(Math.random() * 30);
    updateThreatLevel();
}

function increaseThreat(amount = 5) {
    threatLevel = Math.min(threatLevel + amount, maxThreatLevel);
    updateThreatLevel();

    // Chance to trigger trace warning when threat is high
    if (threatLevel > 70 && !traceActive && Math.random() > 0.7) {
        triggerTraceWarning();
    }
}

function decreaseThreat(amount = 5) {
    threatLevel = Math.max(threatLevel - amount, 0);
    updateThreatLevel();
}

function updateThreatLevel() {
    threatValueElement.textContent = getThreatLevelText();

    // Change color based on threat level
    if (threatLevel < 30) {
        threatValueElement.style.color = '#39ff14'; // Green
        threatValueElement.style.textShadow = '0 0 5px #39ff14';
    } else if (threatLevel < 70) {
        threatValueElement.style.color = '#f9f002'; // Yellow
        threatValueElement.style.textShadow = '0 0 5px #f9f002';
    } else {
        threatValueElement.style.color = '#ff2a6d'; // Pink/Red
        threatValueElement.style.textShadow = '0 0 10px #ff2a6d';
    }
}

function getThreatLevelText() {
    if (threatLevel < 20) return 'LOW';
    if (threatLevel < 50) return 'MEDIUM';
    if (threatLevel < 80) return 'HIGH';
    return 'CRITICAL';
}

// ===== Encrypted Message System =====
function initializeEncryptedMessages() {
    encryptedPreviews.forEach(preview => {
        preview.addEventListener('mouseenter', () => {
            // Small chance to increase threat when decrypting
            if (Math.random() > 0.8) {
                increaseThreat(3);
            }
        });

        // Add glitch effect to encrypted text
        const encryptedText = preview.querySelector('.encrypted-placeholder');
        if (encryptedText) {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    encryptedText.style.visibility = 'hidden';
                    setTimeout(() => {
                        encryptedText.style.visibility = 'visible';
                    }, 100);
                }
            }, 1000);
        }
    });
}

// ===== Glitch Effects =====
function initializeGlitchEffects() {
    // Avatar glitch effect
    glitchAvatars.forEach(avatar => {
        setInterval(() => {
            if (Math.random() > 0.9) {
                avatar.style.opacity = '0.7';
                avatar.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    avatar.style.opacity = '1';
                    avatar.style.transform = 'translate(0, 0)';
                }, 100);
            }
        }, 2000);
    });

    // Random glitch effect for logo
    const logoGlitch = document.querySelector('.glitch');
    if (logoGlitch) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                logoGlitch.style.animation = 'none';
                setTimeout(() => {
                    logoGlitch.style.animation = '';
                }, 100);
            }
        }, 3000);
    }
}

// ===== Reputation System =====
function initializeReputationSystem() {
    // Animate the reputation badge ring
    hologramBadges.forEach(badge => {
        const ring = badge.querySelector('.badge-ring');
        if (ring) {
            // Random reputation changes
            setInterval(() => {
                if (Math.random() > 0.9) {
                    const change = Math.floor(Math.random() * 10) - 5;
                    reputation = Math.max(reputation + change, 0);
                    updateReputationBadge();
                }
            }, 5000);
        }
    });
}

function updateReputationBadge() {
    const badgeScores = document.querySelectorAll('.badge-score');
    badgeScores.forEach(score => {
        score.textContent = reputation.toString();

        // Change color based on reputation
        if (reputation > 2000) {
            score.style.fill = '#ff2a6d';
        } else if (reputation > 1500) {
            score.style.fill = '#05d9e8';
        } else {
            score.style.fill = '#e0e0e0';
        }
    });
}

// ===== Trace Warning System =====
function initializeTraceWarning() {
    abortBtn.addEventListener('click', abortTrace);
}

function triggerTraceWarning() {
    if (traceActive) return;

    traceActive = true;
    currentCountdown = 10;
    countdownElement.textContent = currentCountdown;
    traceWarningElement.classList.add('active');

    // Start countdown
    countdownInterval = setInterval(() => {
        currentCountdown--;
        countdownElement.textContent = currentCountdown;

        if (currentCountdown <= 0) {
            clearInterval(countdownInterval);
            completeTrace();
        }
    }, 1000);

    // Increase threat while trace is active
    const threatIncreaseInterval = setInterval(() => {
        increaseThreat(2);
    }, 500);

    // Store interval to clear later
    traceWarningElement.dataset.threatInterval = threatIncreaseInterval;
}

function abortTrace() {
    if (!traceActive) return;

    clearInterval(countdownInterval);
    clearInterval(parseInt(traceWarningElement.dataset.threatInterval));
    traceWarningElement.classList.remove('active');
    traceActive = false;

    // Small chance to fail abort
    if (Math.random() > 0.7) {
        decreaseThreat(10);
        showSystemMessage('ABORT SUCCESSFUL. Signal scrambled.', 'success');
    } else {
        increaseThreat(15);
        showSystemMessage('ABORT FAILED. Trace intensified!', 'error');
        setTimeout(triggerTraceWarning, 2000);
    }
}

function completeTrace() {
    clearInterval(countdownInterval);
    clearInterval(parseInt(traceWarningElement.dataset.threatInterval));
    traceWarningElement.classList.remove('active');
    traceActive = false;

    // Reset threat to high level
    threatLevel = 85;
    updateThreatLevel();
    showSystemMessage('TRACE COMPLETE. Your location may be compromised.', 'error');

    // Add visual glitch effect to the whole page
    document.body.style.filter = 'hue-rotate(90deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 200);
}

// ===== Post Interactions =====
function initializePostInteractions() {
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const post = e.target.closest('.feed-post');
            const action = e.target.textContent.toUpperCase();

            handlePostAction(post, action);
        });
    });
}

function handlePostAction(post, action) {
    const postType = post.dataset.postType;

    switch (action) {
        case 'ACCEPT':
            if (postType === 'job') {
                showSystemMessage('Job accepted. Meet your contact in the shadows.', 'success');
                increaseThreat(8);
                reputation += 50;
                updateReputationBadge();
                post.style.borderColor = '#39ff14';
            }
            break;

        case 'DECRYPT':
            if (postType === 'job') {
                showSystemMessage('Message decrypted. Contents revealed.', 'info');
                increaseThreat(5);
                reputation += 20;
                updateReputationBadge();
            }
            break;

        case 'DOWNLOAD':
            if (postType === 'intel') {
                showSystemMessage('Intel downloaded. Storing in encrypted drive.', 'success');
                increaseThreat(12);
                reputation += 100;
                updateReputationBadge();
                post.style.borderColor = '#05d9e8';
            }
            break;

        case 'CONTACT':
            if (postType === 'market') {
                showSystemMessage('Contact initiated. Meet at the safehouse.', 'success');
                increaseThreat(6);
                reputation += 30;
                updateReputationBadge();
                post.style.borderColor = '#ff2a6d';
            }
            break;

        case 'ABORT CONNECTION':
            // Handled by trace warning system
            break;
    }
}

// ===== System Messages =====
function showSystemMessage(message, type = 'info') {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `system-message ${type}`;
    messageElement.textContent = message;

    // Style based on type
    switch (type) {
        case 'success':
            messageElement.style.color = '#39ff14';
            messageElement.style.textShadow = '0 0 5px #39ff14';
            break;
        case 'error':
            messageElement.style.color = '#ff2a6d';
            messageElement.style.textShadow = '0 0 5px #ff2a6d';
            break;
        case 'info':
        default:
            messageElement.style.color = '#05d9e8';
            messageElement.style.textShadow = '0 0 5px #05d9e8';
    }

    // Add to DOM
    document.body.appendChild(messageElement);

    // Position and animate
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.zIndex = '300';
    messageElement.style.fontFamily = "'Orbitron', sans-serif";
    messageElement.style.fontSize = '0.9rem';
    messageElement.style.padding = '0.5rem 1rem';
    messageElement.style.borderRadius = '4px';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageElement.style.animation = 'fadeInOut 3s ease-out';

    // Remove after animation
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// ===== Random Events =====
function initializeRandomEvents() {
    // Add new random post every 30-60 seconds
    setInterval(addRandomPost, Math.random() * 30000 + 30000);

    // Random threat level changes
    setInterval(() => {
        if (Math.random() > 0.7) {
            const change = Math.floor(Math.random() * 10) - 5;
            if (change > 0) {
                increaseThreat(change);
            } else {
                decreaseThreat(Math.abs(change));
            }
        }
    }, 15000);

    // Random system messages
    setInterval(() => {
        if (Math.random() > 0.8) {
            const messages = [
                { text: 'System update in progress...', type: 'info' },
                { text: 'New encryption protocol detected.', type: 'info' },
                { text: 'Corporate patrol detected nearby.', type: 'error' },
                { text: 'Signal boosted. Connection stable.', type: 'success' },
                { text: 'Warning: Unauthorized access attempt.', type: 'error' }
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showSystemMessage(randomMessage.text, randomMessage.type);
        }
    }, 20000);
}

function addRandomPost() {
    const postTypes = ['job', 'intel', 'market'];
    const randomType = postTypes[Math.floor(Math.random() * postTypes.length)];

    const post = document.createElement('article');
    post.className = 'feed-post';
    post.dataset.postType = randomType;

    // Generate random content based on type
    let content = '';
    switch (randomType) {
        case 'job':
            const jobs = [
                { title: 'Corporate Espionage', body: 'Infiltrate Arasaka subsidiary. Extract prototype schematics.', payment: '500000', tags: '#HIGH-RISK #STEALTH' },
                { title: 'Data Extraction', body: 'Retrieve blackmail material from secure server.', payment: '300000', tags: '#ENCRYPTED #URGENT' },
                { title: 'Personnel Extraction', body: 'Extract defector from corporate facility.', payment: '750000', tags: '#DANGER #TEAM-REQUIRED' }
            ];
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            content = `
                <div class="post-header">
                    <div class="user-avatar glitch-avatar" data-user="random${Math.floor(Math.random() * 1000)}"></div>
                    <div class="user-info">
                        <span class="username">@RANDOM${Math.floor(Math.random() * 1000)}</span>
                        <span class="post-time">${Math.floor(Math.random() * 24)}h ago</span>
                    </div>
                    <div class="post-tags">${job.tags.split(' ').map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                </div>
                <div class="post-content">
                    <h2 class="post-title">${job.title} - <span class="encrypted-text" data-encrypted="true">[REDACTED]</span></h2>
                    <p class="post-body">${job.body} Payment: <span class="credits">${job.payment}</span> or intel trade.</p>
                    <div class="encrypted-preview" data-decrypted="Meet at location ${Math.floor(Math.random() * 10)} at ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}00.">
                        <span class="encrypted-placeholder">XXXX XXXX XXXXXX XXXX</span>
                    </div>
                </div>
                <div class="post-footer">
                    <button class="action-btn">ACCEPT</button>
                    <button class="action-btn">DECRYPT</button>
                    <span class="post-stats">${Math.floor(Math.random() * 100)} | ${Math.floor(Math.random() * 500)}</span>
                </div>
            `;
            break;

        case 'intel':
            const intel = [
                { title: 'Arasaka Security Plans', body: 'Complete blueprints of their new HQ security system.', snippet: '// Security System v4.2\nconst accessCodes = ["ALPHA", "BETA", "GAMMA"];' },
                { title: 'Militech Weapon Specs', body: 'Details on their new experimental cyberware weapons.', snippet: '// Project: Cybernetic Enhancement\nconst powerLevel = 0xFFFF;' },
                { title: 'Corporate Blacklist', body: 'List of all runners marked for elimination.', snippet: 'const blacklist = ["0x7F3A9B", "0x4C8E1D", "0xA1B2C3"];' }
            ];
            const intelItem = intel[Math.floor(Math.random() * intel.length)];
            content = `
                <div class="post-header">
                    <div class="user-avatar glitch-avatar" data-user="whistleblower${Math.floor(Math.random() * 100)}"></div>
                    <div class="user-info">
                        <span class="username">@WHISTLEBLOWER${Math.floor(Math.random() * 100)}</span>
                        <span class="post-time">${Math.floor(Math.random() * 24)}h ago</span>
                    </div>
                    <div class="post-tags"><span class="tag">#LEAK</span><span class="tag">#CONFIDENTIAL</span></div>
                </div>
                <div class="post-content">
                    <h2 class="post-title">${intelItem.title}</h2>
                    <p class="post-body">${intelItem.body} Here's a snippet:</p>
                    <pre class="code-snippet"><code class="language-js">${intelItem.snippet}</code></pre>
                </div>
                <div class="post-footer">
                    <button class="action-btn">DOWNLOAD</button>
                    <span class="post-stats">${Math.floor(Math.random() * 200)} | ${Math.floor(Math.random() * 800)}</span>
                </div>
            `;
            break;

        case 'market':
            const items = [
                { title: 'Neural Interface', rarity: 'LEGENDARY', body: 'Military-grade neural interface with full VR immersion.', price: '1000000', stats: 'Speed: +60% | Defense: +40%' },
                { title: 'Cyberdeck Pro', rarity: 'EPIC', body: 'Advanced cyberdeck with quantum processing.', price: '750000', stats: 'Hacking: +50% | Memory: +30%' },
                { title: 'Smartlink', rarity: 'RARE', body: 'Enhanced targeting system for cyberware.', price: '250000', stats: 'Accuracy: +35% | Range: +20%' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];
            content = `
                <div class="post-header">
                    <div class="user-avatar glitch-avatar" data-user="fixer${Math.floor(Math.random() * 100)}"></div>
                    <div class="user-info">
                        <span class="username">@FIXER${Math.floor(Math.random() * 100)}</span>
                        <span class="post-time">${Math.floor(Math.random() * 24)}h ago</span>
                    </div>
                    <div class="post-tags"><span class="tag">#TECH</span><span class="tag">#${item.rarity}</span></div>
                </div>
                <div class="post-content">
                    <h2 class="post-title">${item.title} - <span class="rarity ${item.rarity.toLowerCase()}">${item.rarity}</span></h2>
                    <p class="post-body">${item.body} <strong>Asking: ${item.price}</strong> or equivalent intel.</p>
                    <div class="item-stats">${item.stats.split(' | ').map(stat => `<span class="stat">${stat}</span>`).join('')}</div>
                </div>
                <div class="post-footer">
                    <button class="action-btn">CONTACT</button>
                    <span class="post-stats">${Math.floor(Math.random() * 100)} | ${Math.floor(Math.random() * 400)}</span>
                </div>
            `;
            break;
    }

    post.innerHTML = content;
    document.querySelector('.feed-container').prepend(post);

    // Initialize interactions for new post
    const newEncryptedPreviews = post.querySelectorAll('.encrypted-preview');
    newEncryptedPreviews.forEach(initializeEncryptedMessages);

    const newActionButtons = post.querySelectorAll('.action-btn');
    newActionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.textContent.toUpperCase();
            handlePostAction(post, action);
        });
    });

    // Add glitch effect to new avatar
    const newAvatar = post.querySelector('.glitch-avatar');
    if (newAvatar) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                newAvatar.style.opacity = '0.7';
                newAvatar.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    newAvatar.style.opacity = '1';
                    newAvatar.style.transform = 'translate(0, 0)';
                }, 100);
            }
        }, 2000);
    }

    showSystemMessage('New post detected in the feed.', 'info');
}

// ===== Utility Functions =====
// Add fade in/out animation for system messages
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);