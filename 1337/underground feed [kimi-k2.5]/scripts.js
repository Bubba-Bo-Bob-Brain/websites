/**
 * NULL_SECTOR // NET_FEED v9.2.1
 * Client-side Scripts
 * WARNING: Unauthorized access will be traced
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // System Initialization
    console.log('%c[NULL_SECTOR] // NET_FEED v9.2.1', 'color: #00d4ff; font-family: monospace; font-size: 14px;');
    console.log('%c>> Initializing secure connection...', 'color: #00ff9d;');
    
    // State Management
    const State = {
        encryptionEnabled: true,
        currentFilter: 'all',
        traceActive: false,
        nodeId: `NODE_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        connected: true
    };

    // DOM Elements
    const elements = {
        traceModal: document.getElementById('trace-warning'),
        traceSimulateBtn: document.getElementById('trace-simulate'),
        evadeBtn: document.querySelector('.evade-btn'),
        encryptToggle: document.getElementById('encrypt-toggle'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        postsStream: document.querySelector('.posts-stream'),
        transmitBtn: document.querySelector('.transmit-btn'),
        composerInput: document.querySelector('.composer-input'),
        threatSelect: document.querySelector('.threat-select'),
        quickBtns: document.querySelectorAll('.quick-btn'),
        scrambleElements: document.querySelectorAll('.scramble'),
        encryptedContainers: document.querySelectorAll('.encrypted-container'),
        traceBar: document.querySelector('.trace-bar')
    };

    // Utility Functions
    const Utils = {
        // Generate random hex string
        randomHex: (length) => {
            const chars = '0123456789ABCDEF';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        },

        // Scramble text animation
        scrambleText: (element, finalText, duration = 1500) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$%&*';
            const steps = 20;
            const stepDuration = duration / steps;
            let step = 0;

            const interval = setInterval(() => {
                if (step >= steps) {
                    clearInterval(interval);
                    element.textContent = finalText;
                    return;
                }

                let scrambled = '';
                const progress = step / steps;
                
                for (let i = 0; i < finalText.length; i++) {
                    if (i < Math.floor(finalText.length * progress)) {
                        scrambled += finalText[i];
                    } else {
                        scrambled += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                
                element.textContent = scrambled;
                step++;
            }, stepDuration);
        },

        // Typewriter effect for logs
        typewriterLog: (message, type = 'info') => {
            const logsContainer = document.querySelector('.system-logs');
            const time = new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type === 'warning' ? 'warning' : ''}`;
            logEntry.innerHTML = `
                <span class="log-time">${time}</span>
                <span class="log-msg">${message}</span>
            `;
            
            logsContainer.insertBefore(logEntry, logsContainer.children[1]);
            
            // Keep only last 6 logs
            const entries = logsContainer.querySelectorAll('.log-entry');
            if (entries.length > 6) {
                entries[entries.length - 1].remove();
            }
        },

        // Create glitch effect
        triggerGlitch: (element, intensity = 1) => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            
            const glitchClass = intensity > 1 ? 'critical-glitch' : 'glitch-avatar';
            element.classList.add(glitchClass);
            
            setTimeout(() => {
                element.classList.remove(glitchClass);
            }, 300 * intensity);
        },

        // Random number generator
        random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };

    // Encryption/Decryption System
    const Crypto = {
        decryptOnHover: (container) => {
            const encryptedText = container.querySelector('.encrypted-text');
            const originalText = encryptedText.textContent;
            const decryptedContent = container.dataset.decrypted;
            const hint = container.querySelector('.decrypt-hint');
            
            if (!decryptedContent) return;

            let isDecrypting = false;
            
            container.addEventListener('mouseenter', () => {
                if (isDecrypting) return;
                isDecrypting = true;
                hint.textContent = '[ DECRYPTING... ]';
                hint.style.color = '#00ff9d';
                
                // Simulate decryption process
                const steps = 10;
                let step = 0;
                
                const decryptInterval = setInterval(() => {
                    if (step >= steps) {
                        clearInterval(decryptInterval);
                        encryptedText.textContent = decryptedContent;
                        encryptedText.style.color = '#00ff9d';
                        encryptedText.style.textShadow = '0 0 10px rgba(0, 255, 157, 0.5)';
                        hint.textContent = '[ DECRYPTED - MOVE TO HIDE ]';
                        Utils.typewriterLog('Transmission decrypted', 'success');
                        return;
                    }
                    
                    // Show random characters during decryption
                    let scramble = '';
                    for (let i = 0; i < decryptedContent.length; i++) {
                        if (Math.random() > 0.5) {
                            scramble += String.fromCharCode(33 + Math.random() * 94);
                        } else {
                            scramble += decryptedContent[i];
                        }
                    }
                    encryptedText.textContent = scramble;
                    step++;
                }, 50);
            });
            
            container.addEventListener('mouseleave', () => {
                isDecrypting = false;
                encryptedText.textContent = originalText;
                encryptedText.style.color = '';
                encryptedText.style.textShadow = '';
                hint.textContent = '[ HOVER_TO_DECRYPT ]';
                hint.style.color = '';
            });
        },

        decryptButton: (btn) => {
            btn.addEventListener('click', (e) => {
                const post = e.target.closest('.post-card');
                const container = post.querySelector('.encrypted-container');
                if (container) {
                    // Trigger hover event programmatically
                    const event = new MouseEvent('mouseenter');
                    container.dispatchEvent(event);
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        const leaveEvent = new MouseEvent('mouseleave');
                        container.dispatchEvent(leaveEvent);
                    }, 5000);
                }
            });
        }
    };

    // Trace Detection System
    const TraceSystem = {
        activate: () => {
            if (State.traceActive) return;
            State.traceActive = true;
            
            elements.traceModal.classList.remove('hidden');
            Utils.typewriterLog('WARNING: Corporate trace detected!', 'warning');
            
            // Reset trace bar animation
            elements.traceBar.style.animation = 'none';
            elements.traceBar.offsetHeight;
            elements.traceBar.style.animation = 'traceProgress 3s ease-out forwards';
            
            // Scramble coordinates
            const coordElement = elements.traceModal.querySelector('.scramble');
            const finalCoord = `TAIWAN_STATION_${Utils.random(1, 99).toString().padStart(2, '0')}`;
            Utils.scrambleText(coordElement, finalCoord);
            
            // Play alert sound effect (simulated via console)
            console.warn('%c⚠ TRACE DETECTED - GHOST PROTOCOL REQUIRED', 'color: #ff0040; font-size: 16px; font-weight: bold;');
        },

        evade: () => {
            if (!State.traceActive) return;
            
            // Success animation
            elements.evadeBtn.textContent = 'REROUTING...';
            elements.evadeBtn.style.background = '#00ff9d';
            
            setTimeout(() => {
                State.traceActive = false;
                elements.traceModal.classList.add('hidden');
                elements.evadeBtn.textContent = 'INITIATE GHOST PROTOCOL';
                elements.evadeBtn.style.background = '';
                
                Utils.typewriterLog('Ghost protocol initiated - Trace evaded', 'success');
                Utils.typewriterLog(`Proxy switched to TOKYO-${Utils.random(1, 20)}`);
                
                // Randomize footer proxy
                document.querySelector('.footer-text:last-child').textContent = 
                    `PROXY: MACAU-${Utils.random(1, 15)}`;
            }, 1500);
        }
    };

    // Feed Management
    const Feed = {
        filter: (category) => {
            const posts = document.querySelectorAll('.post-card');
            
            posts.forEach(post => {
                const postCategory = post.dataset.category;
                
                if (category === 'all' || postCategory === category) {
                    post.style.display = '';
                    // Staggered fade in
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, Utils.random(0, 100));
                } else {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            });
            
            Utils.typewriterLog(`Filter applied: ${category.toUpperCase()}`);
        },

        addPost: (content, threat, encrypted) => {
            const post = document.createElement('article');
            post.className = `post-card`;
            post.dataset.category = 'jobs';
            post.dataset.threat = threat;
            
            const time = new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            let contentHtml = '';
            if (encrypted) {
                contentHtml = `
                    <div class="encrypted-container" data-decrypted="${content}">
                        <div class="encryption-header">
                            <span class="lock-icon">&#128274;</span>
                            <span class="enc-label">ENCRYPTED_TRANSMISSION</span>
                            <span class="enc-level">AES-256</span>
                        </div>
                        <p class="encrypted-text">${Utils.randomHex(32)}...</p>
                        <div class="decrypt-hint">[ HOVER_TO_DECRYPT ]</div>
                    </div>
                `;
            } else {
                contentHtml = `<p class="post-text">${content}</p>`;
            }
            
            post.innerHTML = `
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar glitch-avatar">
                            <div class="avatar-placeholder" style="--avatar-color: #00d4ff;">U</div>
                        </div>
                        <div class="author-meta">
                            <h4 class="author-name">ghost_runner_07</h4>
                            <span class="author-handle">@ghost_runner_07</span>
                        </div>
                    </div>
                    <div class="post-threat-indicator ${threat}">
                        <span class="threat-icon">&#9889;</span>
                        <span class="threat-text">${threat.toUpperCase()}</span>
                    </div>
                </div>
                <div class="post-content">
                    ${contentHtml}
                </div>
                <div class="post-meta">
                    <span class="timestamp">${time} UTC</span>
                    <span class="location-spoof">ORIGIN_MASKED</span>
                </div>
                <div class="post-actions">
                    <button class="action-btn">
                        <span class="action-icon">&#9660;</span>
                        <span class="action-count">0</span>
                    </button>
                    <button class="action-btn">
                        <span class="action-icon">&#8599;</span>
                        <span class="action-count">0</span>
                    </button>
                </div>
            `;
            
            // Insert at top with animation
            post.style.opacity = '0';
            post.style.transform = 'translateY(-20px)';
            elements.postsStream.insertBefore(post, elements.postsStream.firstChild);
            
            // Animate in
            requestAnimationFrame(() => {
                post.style.transition = 'all 0.5s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            });
            
            // Initialize encryption if needed
            if (encrypted) {
                const encContainer = post.querySelector('.encrypted-container');
                if (encContainer) Crypto.decryptOnHover(encContainer);
            }
        }
    };

    // Event Listeners
    const initEventListeners = () => {
        // Filter buttons
        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                elements.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                Feed.filter(e.target.dataset.filter);
            });
        });

        // Trace simulation
        elements.traceSimulateBtn?.addEventListener('click', () => {
            TraceSystem.activate();
        });

        elements.evadeBtn?.addEventListener('click', () => {
            TraceSystem.evade();
        });

        // Encryption toggle
        elements.encryptToggle?.addEventListener('change', (e) => {
            State.encryptionEnabled = e.target.checked;
            const label = document.querySelector('.toggle-label');
            if (label) {
                label.textContent = State.encryptionEnabled ? 'ENCRYPT' : 'PLAIN';
                label.style.color = State.encryptionEnabled ? '#00ff9d' : '#ff3300';
            }
            Utils.typewriterLog(`Encryption ${State.encryptionEnabled ? 'enabled' : 'disabled'}`, 
                State.encryptionEnabled ? 'info' : 'warning');
        });

        // Transmit button
        elements.transmitBtn?.addEventListener('click', () => {
            const content = elements.composerInput.value.trim();
            if (!content) {
                Utils.typewriterLog('Error: Empty transmission', 'warning');
                elements.composerInput.style.borderColor = '#ff3300';
                setTimeout(() => {
                    elements.composerInput.style.borderColor = '';
                }, 1000);
                return;
            }

            const threat = elements.threatSelect.value;
            Feed.addPost(content, threat, State.encryptionEnabled);
            
            Utils.typewriterLog('Transmission sent to network');
            elements.composerInput.value = '';
            
            // Visual feedback
            elements.transmitBtn.style.background = '#00ff9d';
            elements.transmitBtn.textContent = 'SENT';
            setTimeout(() => {
                elements.transmitBtn.style.background = '';
                elements.transmitBtn.innerHTML = '<span class="btn-text">TRANSMIT</span><span class="btn-icon">></span>';
            }, 1000);
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            if (btn.id === 'trace-simulate') return; // Already handled
            
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent;
                
                switch(action) {
                    case 'WIPE_LOGS':
                        const logs = document.querySelectorAll('.log-entry');
                        logs.forEach((log, index) => {
                            setTimeout(() => {
                                log.style.opacity = '0';
                                setTimeout(() => log.remove(), 300);
                            }, index * 100);
                        });
                        Utils.typewriterLog('Logs purged successfully');
                        break;
                        
                    case 'SWITCH_PROXY':
                        const cities = ['TOKYO', 'SINGAPORE', 'HONG_KONG', 'SHANGHAI', 'SEOUL', 'MUMBAI'];
                        const city = cities[Utils.random(0, cities.length - 1)];
                        const num = Utils.random(1, 20);
                        document.querySelector('.footer-text:last-child').textContent = `PROXY: ${city}-${num}`;
                        Utils.typewriterLog(`Proxy switched to ${city}-${num}`);
                        break;
                }
                
                // Button feedback
                btn.style.background = 'rgba(0, 212, 255, 0.2)';
                setTimeout(() => {
                    btn.style.background = '';
                }, 300);
            });
        });

        // Initialize encrypted containers
        elements.encryptedContainers.forEach(container => {
            Crypto.decryptOnHover(container);
        });

        // Decrypt buttons
        document.querySelectorAll('.decrypt-action').forEach(btn => {
            Crypto.decryptButton(btn);
        });

        // Copy code buttons
        document.querySelectorAll('.copy-code').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codeBlock = e.target.closest('.code-block').querySelector('code');
                const text = codeBlock.textContent;
                
                navigator.clipboard.writeText(text).then(() => {
                    e.target.textContent = 'COPIED';
                    e.target.style.borderColor = '#00ff9d';
                    e.target.style.color = '#00ff9d';
                    
                    setTimeout(() => {
                        e.target.textContent = 'COPY';
                        e.target.style.borderColor = '';
                        e.target.style.color = '';
                    }, 2000);
                    
                    Utils.typewriterLog('Code copied to clipboard');
                });
            });
        });

        // Trace action buttons (simulate trace)
        document.querySelectorAll('.trace-action').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.typewriterLog('Initiating trace sequence...', 'warning');
                setTimeout(() => TraceSystem.activate(), 1000);
            });
        });

        // Avatar glitch on hover
        document.querySelectorAll('.glitch-avatar').forEach(avatar => {
            avatar.addEventListener('mouseenter', () => {
                Utils.triggerGlitch(avatar, 2);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                elements.transmitBtn?.click();
            }
            if (e.key === 'Escape' && State.traceActive) {
                TraceSystem.evade();
            }
        });
    };

    // Ambient Effects
    const initAmbientEffects = () => {
        // Random glitch on runner avatars
        setInterval(() => {
            const avatars = document.querySelectorAll('.runner-avatar, .author-avatar');
            const randomAvatar = avatars[Utils.random(0, avatars.length - 1)];
            if (randomAvatar && Math.random() > 0.7) {
                Utils.triggerGlitch(randomAvatar, 1);
            }
        }, 3000);

        // Update timestamps periodically
        setInterval(() => {
            const timestamps = document.querySelectorAll('.timestamp');
            if (timestamps.length > 0) {
                const now = new Date();
                const time = now.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                // Only update the newest timestamp
                timestamps[0].textContent = `${time} UTC`;
            }
        }, 60000);

        // Random system logs
        const randomLogs = [
            'Packet loss detected on node 847',
            'Re-routing through backup proxy',
            'Encryption key rotation complete',
            'New runner connected from Night City',
            'ICE signature detected and blocked',
            'Syncing with distributed ledger',
            'Ping: 12ms to Tokyo hub',
            'Memory optimization complete'
        ];

        setInterval(() => {
            if (Math.random() > 0.8) {
                const log = randomLogs[Utils.random(0, randomLogs.length - 1)];
                Utils.typewriterLog(log);
            }
        }, 15000);
    };

    // Initialize
    initEventListeners();
    initAmbientEffects();

    // Initial scramble effects
    elements.scrambleElements.forEach(el => {
        const finalText = el.textContent;
        Utils.scrambleText(el, finalText, 2000);
    });

    // Console easter egg
    console.log('%c> System ready. Welcome to the Underground.', 'color: #00ff9d; font-family: monospace;');
    console.log('%c> Remember: In the dark, we are all ghosts.', 'color: #00d4ff; font-family: monospace; font-style: italic;');
});