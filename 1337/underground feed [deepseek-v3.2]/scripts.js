// scripts.js
// NEON_NEXUS - Cyberpunk Underground Network
// Interactive Features & Immersive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // GLOBAL VARIABLES & INITIALIZATION
    // ============================================
    
    const traceModal = document.getElementById('traceModal');
    const traceAlertBtn = document.getElementById('traceAlertBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const initiatePurgeBtn = document.getElementById('initiatePurge');
    const dismissTraceBtn = document.getElementById('dismissTrace');
    const liveNodesElement = document.getElementById('liveNodes');
    const encryptedPreviews = document.querySelectorAll('.encrypted-preview');
    const copyCodeButtons = document.querySelectorAll('.copy-code');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    const nodeElements = document.querySelectorAll('.node');
    const upvoteButtons = document.querySelectorAll('.action-btn:nth-child(2)');
    const commentButtons = document.querySelectorAll('.action-btn:nth-child(3)');
    const decryptToolBtn = document.querySelector('.decrypt-tool .btn-primary');
    const decryptTextarea = document.querySelector('.decrypt-tool textarea');
    const decryptSelect = document.querySelector('.decrypt-tool select');
    const searchInput = document.querySelector('.search-box input');
    
    let liveNodesCount = 4728;
    let isTraceActive = false;
    let isPurging = false;
    
    // ============================================
    // SYSTEM INITIALIZATION & BOOT SEQUENCE
    // ============================================
    
    console.log('%c[NEON_NEXUS] Initializing system...', 'color: #00f3ff; font-weight: bold;');
    console.log('%c[SYSTEM] Node connection established', 'color: #00ff9d;');
    console.log('%c[SECURITY] Encryption protocols active', 'color: #ff00ff;');
    
    // Simulate system boot sequence
    setTimeout(() => {
        console.log('%c[BOOT] Feed decryption complete', 'color: #00ff9d;');
        console.log('%c[BOOT] Threat monitoring online', 'color: #ff8c00;');
        console.log('%c[BOOT] User interface rendered', 'color: #4a90e2;');
        
        // Add subtle entrance animation to posts
        document.querySelectorAll('.post').forEach((post, index) => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
    
    // ============================================
    // TRACE DETECTION SYSTEM
    // ============================================
    
    // Open trace modal
    traceAlertBtn.addEventListener('click', function() {
        if (!isTraceActive) {
            activateTraceAlert();
        } else {
            openTraceModal();
        }
    });
    
    // Close modal when clicking X
    closeModalBtn.addEventListener('click', closeTraceModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === traceModal) {
            closeTraceModal();
        }
    });
    
    // Emergency purge button
    initiatePurgeBtn.addEventListener('click', function() {
        if (!isPurging) {
            initiateEmergencyPurge();
        }
    });
    
    // Dismiss trace button
    dismissTraceBtn.addEventListener('click', function() {
        dismissTraceAlert();
    });
    
    // Simulate random trace detection (for demo purposes)
    function simulateRandomTrace() {
        const randomTime = Math.floor(Math.random() * 30000) + 30000; // 30-60 seconds
        setTimeout(() => {
            if (!isTraceActive) {
                activateTraceAlert();
                console.log('%c[SECURITY] Trace detected from unknown entity', 'color: #ff375f; font-weight: bold;');
            }
        }, randomTime);
    }
    
    simulateRandomTrace();
    
    function activateTraceAlert() {
        isTraceActive = true;
        traceAlertBtn.innerHTML = '<i class="fas fa-skull-crossbones"></i> TRACE ACTIVE!';
        traceAlertBtn.classList.add('pulse');
        traceAlertBtn.style.animation = 'pulse 0.8s infinite';
        
        // Add glitch effect to header
        document.querySelector('.main-header').classList.add('glitch-effect');
        
        // Randomly disconnect nodes
        disconnectRandomNodes();
        
        // Update threat stats
        document.querySelector('.stat-value.threat-critical').textContent = '13';
        
        // Log to console
        console.log('%c[SECURITY ALERT] Corporate trace algorithm detected!', 
            'color: #ff375f; font-size: 14px; font-weight: bold; background: black; padding: 5px;');
        
        // Auto-open modal after 2 seconds
        setTimeout(openTraceModal, 2000);
    }
    
    function openTraceModal() {
        traceModal.style.display = 'flex';
        
        // Add dramatic entrance effect
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
        
        // Add sound effect simulation (visual only)
        const warningPulse = document.querySelector('.warning-pulse');
        warningPulse.style.animation = 'pulse 0.5s infinite';
    }
    
    function closeTraceModal() {
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
        
        setTimeout(() => {
            modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            modalContent.style.transform = 'scale(0.8)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                traceModal.style.display = 'none';
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }, 300);
        }, 10);
    }
    
    function initiateEmergencyPurge() {
        isPurging = true;
        
        // Update button text and disable
        initiatePurgeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PURGING...';
        initiatePurgeBtn.disabled = true;
        dismissTraceBtn.disabled = true;
        
        // Add visual effects
        document.body.classList.add('glitch-effect');
        
        // Simulate data purge progress
        let purgeProgress = 0;
        const purgeInterval = setInterval(() => {
            purgeProgress += 10;
            
            // Update modal text
            const modalBody = document.querySelector('.modal-body');
            const progressText = document.createElement('p');
            progressText.className = 'purge-progress';
            progressText.style.color = '#00ff9d';
            progressText.style.fontFamily = 'Share Tech Mono, monospace';
            progressText.textContent = `Purging data... ${purgeProgress}%`;
            
            // Remove previous progress text
            const existingProgress = modalBody.querySelector('.purge-progress');
            if (existingProgress) {
                existingProgress.remove();
            }
            
            modalBody.appendChild(progressText);
            
            // Add node disconnection effect
            if (purgeProgress % 20 === 0) {
                disconnectRandomNodes();
            }
            
            // Complete purge at 100%
            if (purgeProgress >= 100) {
                clearInterval(purgeInterval);
                
                setTimeout(() => {
                    // Reset trace alert
                    isTraceActive = false;
                    isPurging = false;
                    
                    // Update UI
                    traceAlertBtn.innerHTML = '<i class="fas fa-radar"></i> TRACE DETECTED';
                    traceAlertBtn.classList.remove('pulse');
                    traceAlertBtn.style.animation = '';
                    document.querySelector('.main-header').classList.remove('glitch-effect');
                    document.body.classList.remove('glitch-effect');
                    
                    // Update threat stats
                    document.querySelector('.stat-value.threat-critical').textContent = '0';
                    
                    // Show success message
                    const successText = document.createElement('p');
                    successText.className = 'purge-success';
                    successText.style.color = '#00ff9d';
                    successText.style.fontFamily = 'Share Tech Mono, monospace';
                    successText.style.fontWeight = 'bold';
                    successText.textContent = 'PURGE COMPLETE: All traces eliminated';
                    
                    modalBody.appendChild(successText);
                    
                    // Re-enable buttons
                    initiatePurgeBtn.disabled = false;
                    dismissTraceBtn.disabled = false;
                    initiatePurgeBtn.innerHTML = '<i class="fas fa-check"></i> PURGE COMPLETE';
                    
                    // Auto-close modal after 3 seconds
                    setTimeout(() => {
                        closeTraceModal();
                        setTimeout(() => {
                            initiatePurgeBtn.innerHTML = '<i class="fas fa-fire"></i> Initiate Emergency Purge';
                        }, 1000);
                    }, 3000);
                }, 500);
            }
        }, 200);
    }
    
    function dismissTraceAlert() {
        isTraceActive = false;
        
        // Update UI
        traceAlertBtn.innerHTML = '<i class="fas fa-radar"></i> TRACE DETECTED';
        traceAlertBtn.classList.remove('pulse');
        traceAlertBtn.style.animation = '';
        document.querySelector('.main-header').classList.remove('glitch-effect');
        
        // Update threat stats
        document.querySelector('.stat-value.threat-critical').textContent = '12';
        
        // Show identity change effect
        const currentHandle = document.querySelector('.current-handle');
        const originalHandle = currentHandle.textContent;
        
        currentHandle.style.color = '#ff00ff';
        currentHandle.textContent = '@identity_reset_' + Math.floor(Math.random() * 9999);
        
        setTimeout(() => {
            currentHandle.style.color = '#00f3ff';
            setTimeout(() => {
                currentHandle.textContent = originalHandle;
            }, 1000);
        }, 2000);
        
        closeTraceModal();
    }
    
    function disconnectRandomNodes() {
        nodeElements.forEach(node => {
            if (node.classList.contains('active') && Math.random() > 0.5) {
                node.classList.remove('active');
                node.style.opacity = '0.5';
                
                // Update live nodes count
                liveNodesCount--;
                liveNodesElement.textContent = liveNodesCount.toLocaleString();
                
                // Add reconnection after random time
                setTimeout(() => {
                    if (Math.random() > 0.3) {
                        node.classList.add('active');
                        node.style.opacity = '1';
                        liveNodesCount++;
                        liveNodesElement.textContent = liveNodesCount.toLocaleString();
                    }
                }, Math.random() * 5000 + 2000);
            }
        });
    }
    
    // ============================================
    // ENCRYPTED MESSAGE INTERACTION
    // ============================================
    
    encryptedPreviews.forEach(preview => {
        // Add hover decryption effect
        preview.addEventListener('mouseenter', function() {
            const cipherText = this.querySelector('.cipher-text');
            const cipherType = this.getAttribute('data-cipher');
            
            // Store original text
            const originalText = cipherText.textContent;
            
            // Decrypt based on cipher type
            setTimeout(() => {
                let decryptedText = '';
                
                if (cipherType === 'ROT-13') {
                    decryptedText = rot13Decrypt(originalText);
                } else if (cipherType === 'AES-256' || cipherType === 'Blowfish') {
                    // Simulate hex to text conversion for demo
                    decryptedText = hexToString(originalText);
                } else {
                    decryptedText = '[DECRYPTION FAILED: UNSUPPORTED CIPHER]';
                }
                
                // Create decrypted text element
                const decryptedElement = document.createElement('p');
                decryptedElement.className = 'decrypted-text';
                decryptedElement.style.fontFamily = 'Share Tech Mono, monospace';
                decryptedElement.style.color = '#00ff9d';
                decryptedElement.style.marginBottom = '10px';
                decryptedElement.style.wordBreak = 'break-all';
                decryptedElement.style.opacity = '0';
                decryptedElement.style.transition = 'opacity 0.3s ease';
                decryptedElement.textContent = decryptedText;
                
                // Add to preview
                this.appendChild(decryptedElement);
                
                // Fade in
                setTimeout(() => {
                    decryptedElement.style.opacity = '1';
                }, 10);
            }, 300);
        });
        
        preview.addEventListener('mouseleave', function() {
            // Remove decrypted text
            const decryptedElement = this.querySelector('.decrypted-text');
            if (decryptedElement) {
                decryptedElement.style.opacity = '0';
                setTimeout(() => {
                    decryptedElement.remove();
                }, 300);
            }
        });
    });
    
    // Helper decryption functions
    function rot13Decrypt(str) {
        return str.replace(/[A-Za-z]/g, function(c) {
            return String.fromCharCode(c.charCodeAt(0) + (c.toUpperCase() <= 'M' ? 13 : -13));
        });
    }
    
    function hexToString(hex) {
        // Simple hex to text conversion for demo
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            const hexVal = hex.substr(i, 2);
            if (hexVal.match(/[0-9A-Fa-f]{2}/)) {
                str += String.fromCharCode(parseInt(hexVal, 16));
            }
        }
        return str || '[ENCRYPTED DATA: DECRYPTION KEY REQUIRED]';
    }
    
    // ============================================
    // CODE SNIPPET COPY FUNCTIONALITY
    // ============================================
    
    copyCodeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-snippet').querySelector('code');
            const textToCopy = codeBlock.textContent;
            
            // Use Clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showCopyFeedback(this, 'Copied!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    fallbackCopyText(textToCopy, this);
                });
            } else {
                fallbackCopyText(textToCopy, this);
            }
        });
    });
    
    function fallbackCopyText(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(button, 'Copied!');
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            showCopyFeedback(button, 'Failed!');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopyFeedback(button, message) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `<i class="fas fa-check"></i> ${message}`;
        button.style.backgroundColor = 'rgba(0, 255, 157, 0.2)';
        button.style.borderColor = '#00ff9d';
        button.style.color = '#00ff9d';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }
    
    // ============================================
    // FEED FILTERING SYSTEM
    // ============================================
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.textContent.toLowerCase();
            filterFeed(filterType);
        });
    });
    
    function filterFeed(filterType) {
        const posts = document.querySelectorAll('.post');
        
        posts.forEach(post => {
            post.style.display = 'flex';
            post.style.flexDirection = 'column';
            
            if (filterType === 'all threads') {
                post.style.opacity = '1';
                setTimeout(() => {
                    post.style.display = 'flex';
                }, 10);
                return;
            }
            
            let shouldShow = false;
            
            if (filterType === 'high threat' && post.getAttribute('data-threat') === 'high') {
                shouldShow = true;
            } else if (filterType === 'jobs' && post.querySelector('.content-plain').textContent.includes('JOB:')) {
                shouldShow = true;
            } else if (filterType === 'intel' && post.querySelector('.content-plain').textContent.includes('INTEL:')) {
                shouldShow = true;
            } else if (filterType === 'tech' && post.querySelector('.content-plain').textContent.includes('TRADE:')) {
                shouldShow = true;
            }
            
            if (shouldShow) {
                post.style.opacity = '1';
                setTimeout(() => {
                    post.style.display = 'flex';
                }, 10);
            } else {
                post.style.opacity = '0';
                setTimeout(() => {
                    post.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // ============================================
    // POST INTERACTIONS (UPVOTES, COMMENTS, ETC.)
    // ============================================
    
    upvoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const countElement = this.querySelector('.upvote-count');
            let count = parseInt(countElement.textContent);
            
            // Toggle upvote state
            if (this.classList.contains('upvoted')) {
                count--;
                this.classList.remove('upvoted');
                this.innerHTML = '<i class="fas fa-heart"></i> ' + count;
                this.style.color = '';
            } else {
                count++;
                this.classList.add('upvoted');
                this.innerHTML = '<i class="fas fa-heart" style="color: #ff375f;"></i> ' + count;
                
                // Add visual feedback
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
            
            countElement.textContent = count;
        });
    });
    
    commentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const countElement = this.querySelector('.comment-count');
            let count = parseInt(countElement.textContent);
            count++;
            countElement.textContent = count;
            
            // Show comment input
            const post = this.closest('.post');
            const commentInput = post.querySelector('.comment-input');
            
            if (!commentInput) {
                createCommentInput(post);
            }
            
            // Visual feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    function createCommentInput(post) {
        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.style.marginTop = '15px';
        commentSection.style.paddingTop = '15px';
        commentSection.style.borderTop = '1px solid #1a1f29';
        
        const inputGroup = document.createElement('div');
        inputGroup.style.display = 'flex';
        inputGroup.style.gap = '10px';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type encrypted comment (visible to OP only)...';
        input.style.flexGrow = '1';
        input.style.padding = '10px';
        input.style.backgroundColor = 'rgba(26, 31, 41, 0.8)';
        input.style.border = '1px solid #1a1f29';
        input.style.borderRadius = '4px';
        input.style.color = '#00ff9d';
        input.style.fontFamily = 'Share Tech Mono, monospace';
        input.style.fontSize = '0.9rem';
        
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'POST';
        submitBtn.className = 'btn btn-primary btn-small';
        submitBtn.style.padding = '10px 20px';
        
        submitBtn.addEventListener('click', function() {
            if (input.value.trim()) {
                // In a real app, this would send to server
                input.value = '';
                commentSection.remove();
                
                // Show confirmation
                const confirmation = document.createElement('div');
                confirmation.textContent = 'Comment encrypted and sent';
                confirmation.style.color = '#00ff9d';
                confirmation.style.fontFamily = 'Share Tech Mono, monospace';
                confirmation.style.fontSize = '0.8rem';
                confirmation.style.marginTop = '10px';
                confirmation.style.opacity = '0';
                
                post.querySelector('.post-footer').appendChild(confirmation);
                
                setTimeout(() => {
                    confirmation.style.transition = 'opacity 0.3s ease';
                    confirmation.style.opacity = '1';
                    
                    setTimeout(() => {
                        confirmation.style.opacity = '0';
                        setTimeout(() => confirmation.remove(), 300);
                    }, 2000);
                }, 10);
            }
        });
        
        inputGroup.appendChild(input);
        inputGroup.appendChild(submitBtn);
        commentSection.appendChild(inputGroup);
        
        post.querySelector('.post-footer').parentNode.insertBefore(commentSection, post.querySelector('.post-footer'));
        
        // Auto-focus input
        setTimeout(() => input.focus(), 100);
    }
    
    // ============================================
    // QUICK DECRYPT TOOL
    // ============================================
    
    decryptToolBtn.addEventListener('click', function() {
        const cipherText = decryptTextarea.value.trim();
        const cipherType = decryptSelect.value;
        
        if (!cipherText) {
            showDecryptFeedback('No cipher text provided', false);
            return;
        }
        
        let decryptedText = '';
        
        if (cipherType === 'ROT-13') {
            decryptedText = rot13Decrypt(cipherText);
        } else if (cipherType === 'AES-256' || cipherType === 'Blowfish') {
            // Try hex decoding
            decryptedText = hexToString(cipherText);
            
            // If hex decoding fails, show as-is
            if (decryptedText === '[ENCRYPTED DATA: DECRYPTION KEY REQUIRED]') {
                decryptedText = 'Unable to decrypt without proper key';
            }
        } else if (cipherType === 'Custom Key') {
            decryptedText = '[CUSTOM KEY DECRYPTION: NOT IMPLEMENTED IN DEMO]';
        }
        
        // Show result
        const resultDiv = document.createElement('div');
        resultDiv.className = 'decrypt-result';
        resultDiv.style.marginTop = '10px';
        resultDiv.style.padding = '10px';
        resultDiv.style.backgroundColor = 'rgba(26, 31, 41, 0.9)';
        resultDiv.style.border = '1px solid #00f3ff';
        resultDiv.style.borderRadius = '4px';
        resultDiv.style.color = '#00ff9d';
        resultDiv.style.fontFamily = 'Share Tech Mono, monospace';
        resultDiv.style.fontSize = '0.9rem';
        resultDiv.style.whiteSpace = 'pre-wrap';
        resultDiv.style.wordBreak = 'break-all';
        resultDiv.textContent = `Result: ${decryptedText}`;
        
        // Remove previous result
        const existingResult = document.querySelector('.decrypt-result');
        if (existingResult) {
            existingResult.remove();
        }
        
        this.parentNode.appendChild(resultDiv);
        
        // Visual feedback
        showDecryptFeedback('Decryption complete', true);
    });
    
    function showDecryptFeedback(message, success) {
        const originalText = decryptToolBtn.textContent;
        decryptToolBtn.textContent = message;
        decryptToolBtn.style.backgroundColor = success ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 55, 95, 0.2)';
        decryptToolBtn.style.borderColor = success ? '#00ff9d' : '#ff375f';
        decryptToolBtn.style.color = success ? '#00ff9d' : '#ff375f';
        
        setTimeout(() => {
            decryptToolBtn.textContent = originalText;
            decryptToolBtn.style.backgroundColor = '';
            decryptToolBtn.style.borderColor = '';
            decryptToolBtn.style.color = '';
        }, 2000);
    }
    
    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim().toLowerCase();
            
            if (!query) return;
            
            const posts = document.querySelectorAll('.post');
            let foundPosts = 0;
            
            posts.forEach(post => {
                const postText = post.textContent.toLowerCase();
                const userHandle = post.querySelector('.user-handle').textContent.toLowerCase();
                
                if (postText.includes(query) || userHandle.includes(query)) {
                    post.style.boxShadow = '0 0 0 2px #00f3ff, 0 0 20px rgba(0, 243, 255, 0.5)';
                    post.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    foundPosts++;
                    
                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        post.style.boxShadow = '';
                    }, 3000);
                } else {
                    post.style.opacity = '0.3';
                    
                    // Restore opacity after search
                    setTimeout(() => {
                        post.style.opacity = '1';
                    }, 3000);
                }
            });
            
            // Show search results feedback
            const feedback = document.createElement('div');
            feedback.className = 'search-feedback';
            feedback.style.position = 'fixed';
            feedback.style.top = '80px';
            feedback.style.right = '20px';
            feedback.style.padding = '10px 15px';
            feedback.style.backgroundColor = 'rgba(13, 17, 23, 0.95)';
            feedback.style.border = '1px solid #00f3ff';
            feedback.style.borderRadius = '4px';
            feedback.style.color = '#00f3ff';
            feedback.style.fontFamily = 'Share Tech Mono, monospace';
            feedback.style.fontSize = '0.9rem';
            feedback.style.zIndex = '1000';
            feedback.textContent = `Found ${foundPosts} result${foundPosts !== 1 ? 's' : ''} for "${query}"`;
            
            // Remove existing feedback
            const existingFeedback = document.querySelector('.search-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }
            
            document.body.appendChild(feedback);
            
            // Auto-remove feedback
            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transition = 'opacity 0.5s ease';
                setTimeout(() => feedback.remove(), 500);
            }, 3000);
        }
    });
    
    // ============================================
    // NODE CONNECTION ANIMATIONS
    // ============================================
    
    // Simulate node connection activity
    setInterval(() => {
        nodeElements.forEach(node => {
            if (node.classList.contains('active') && Math.random() > 0.7) {
                // Pulse effect
                node.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.5)';
                
                setTimeout(() => {
                    node.style.boxShadow = '';
                }, 500);
            }
        });
        
        // Randomly update live nodes count
        if (Math.random() > 0.8) {
            const change = Math.random() > 0.5 ? 1 : -1;
            liveNodesCount = Math.max(4700, liveNodesCount + change);
            liveNodesElement.textContent = liveNodesCount.toLocaleString();
        }
    }, 3000);
    
    // ============================================
    // ADDITIONAL IMMERSIVE EFFECTS
    // ============================================
    
    // Random glitch effects on avatars
    setInterval(() => {
        const avatars = document.querySelectorAll('.avatar');
        avatars.forEach(avatar => {
            if (Math.random() > 0.9) {
                avatar.classList.add('glitch-effect');
                
                setTimeout(() => {
                    avatar.classList.remove('glitch-effect');
                }, 500);
            }
        });
    }, 5000);
    
    // Threat level updates
    setInterval(() => {
        const threatValue = document.querySelector('.stat-value.threat-critical');
        let currentThreat = parseInt(threatValue.textContent);
        
        if (currentThreat > 0 && Math.random() > 0.7) {
            currentThreat += Math.random() > 0.5 ? 1 : -1;
            currentThreat = Math.max(0, Math.min(20, currentThreat));
            threatValue.textContent = currentThreat;
            
            // Visual feedback for threat change
            if (currentThreat > 12) {
                threatValue.style.color = '#ff375f';
                threatValue.style.textShadow = '0 0 10px rgba(255, 55, 95, 0.7)';
            } else {
                threatValue.style.color = '#ff375f';
                threatValue.style.textShadow = '0 0 8px rgba(255, 55, 95, 0.7)';
            }
        }
    }, 10000);
    
    // Add terminal-like typing effect to new post button
    const newPostBtn = document.querySelector('.btn-primary.btn-block');
    const originalNewPostText = newPostBtn.innerHTML;
    
    newPostBtn.addEventListener('mouseenter', function() {
        if (this.getAttribute('data-typing')) return;
        
        this.setAttribute('data-typing', 'true');
        const originalText = 'New Encrypted Post';
        let currentText = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < originalText.length) {
                currentText += originalText.charAt(i);
                this.innerHTML = `<i class="fas fa-plus"></i> ${currentText}`;
                i++;
            } else {
                clearInterval(typeInterval);
                
                setTimeout(() => {
                    this.innerHTML = originalNewPostText;
                    this.removeAttribute('data-typing');
                }, 1000);
            }
        }, 50);
    });
    
    // Initialize reputation badge animations
    const reputationBadges = document.querySelectorAll('.reputation-badge');
    reputationBadges.forEach(badge => {
        const score = parseInt(badge.getAttribute('data-reputation'));
        const ring = badge.querySelector('.hologram-ring');
        
        // Adjust ring speed based on reputation
        if (score >= 90) {
            ring.style.animationDuration = '2s';
        } else if (score >= 70) {
            ring.style.animationDuration = '3s';
        } else {
            ring.style.animationDuration = '4s';
        }
        
        // Color based on reputation
        if (score >= 90) {
            badge.style.borderColor = '#ffd700';
            ring.style.borderColor = '#ffd700';
        } else if (score >= 80) {
            badge.style.borderColor = '#00f3ff';
            ring.style.borderColor = '#00f3ff';
        }
    });
    
    // ============================================
    // SYSTEM STATUS CONSOLE LOGGING
    // ============================================
    
    console.log('%c========================================', 'color: #666;');
    console.log('%cNEON_NEXUS v2.5.8 Fully Operational', 'color: #00f3ff; font-weight: bold;');
    console.log('%cAll systems nominal', 'color: #00ff9d;');
    console.log('%cEncryption: AES-256 (Active)', 'color: #4a90e2;');
    console.log('%cThreat Monitoring: Online', 'color: #ff8c00;');
    console.log('%cUser Interface: Interactive', 'color: #ff00ff;');
    console.log('%c========================================', 'color: #666;');
    
    // Easter egg: Konami code for admin access
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            console.log('%c[ADMIN ACCESS GRANTED] Welcome back, Ghost.', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
            
            // Visual effect
            document.body.style.filter = 'invert(1)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 1000);
            
            // Reset code
            konamiCode = [];
        }
    });
});