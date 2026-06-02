// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Decryption functionality for encrypted messages
    const encryptedMessages = document.querySelectorAll('.message-preview');
    
    encryptedMessages.forEach(message => {
        message.addEventListener('mouseenter', function() {
            const cipherText = this.querySelector('.cipher-text');
            const decryptedText = this.querySelector('.decrypted-text');
            
            if (cipherText && decryptedText) {
                cipherText.style.display = 'none';
                decryptedText.style.display = 'block';
            }
        });
        
        message.addEventListener('mouseleave', function() {
            const cipherText = this.querySelector('.cipher-text');
            const decryptedText = this.querySelector('.decrypted-text');
            
            if (cipherText && decryptedText) {
                cipherText.style.display = 'block';
                decryptedText.style.display = 'none';
            }
        });
    });
    
    // Copy button functionality for code blocks
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block').querySelector('code');
            const textToCopy = codeBlock.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = 'COPIED!';
                this.style.background = 'rgba(57, 255, 20, 0.2)';
                this.style.color = '#39ff14';
                this.style.borderColor = '#39ff14';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = 'rgba(0, 255, 255, 0.1)';
                    this.style.color = '#00ffff';
                    this.style.borderColor = 'rgba(0, 255, 255, 0.3)';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });
    
    // Trace detection simulation
    const traceButtons = document.querySelectorAll('.action-btn.trace');
    const traceWarning = document.getElementById('traceWarning');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const timerDisplay = document.getElementById('timer');
    
    let countdownInterval;
    
    traceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Show trace warning
            traceWarning.classList.add('active');
            
            // Start countdown
            let seconds = 15;
            updateTimerDisplay(seconds);
            
            countdownInterval = setInterval(() => {
                seconds--;
                updateTimerDisplay(seconds);
                
                if (seconds <= 0) {
                    clearInterval(countdownInterval);
                    simulateDisconnect();
                }
            }, 1000);
        });
    });
    
    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    function simulateDisconnect() {
        traceWarning.querySelector('h3').textContent = 'CONNECTION LOST';
        traceWarning.querySelector('p').textContent = 'Network breach prevented. System secured.';
        disconnectBtn.textContent = 'RECONNECT';
        
        disconnectBtn.onclick = function() {
            traceWarning.classList.remove('active');
            traceWarning.querySelector('h3').textContent = 'TRACE DETECTED';
            traceWarning.querySelector('p').textContent = 'Security sweep initiated. Disconnect immediately!';
            disconnectBtn.textContent = 'DISCONNECT NOW';
        };
    }
    
    disconnectBtn.addEventListener('click', function() {
        clearInterval(countdownInterval);
        traceWarning.classList.remove('active');
    });
    
    // Reputation badge animation
    const repBadges = document.querySelectorAll('.hologram-badge');
    
    repBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.animationDuration = '0.5s';
            this.style.transform = 'scale(1.2)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.animationDuration = '4s';
            this.style.transform = 'scale(1)';
        });
    });
    
    // Glitch effect for avatars
    const glitchAvatars = document.querySelectorAll('.glitch-avatar');
    
    glitchAvatars.forEach(avatar => {
        setInterval(() => {
            if (Math.random() > 0.7) {
                avatar.style.animation = 'none';
                setTimeout(() => {
                    avatar.style.animation = 'glitch 0.3s linear';
                }, 10);
            }
        }, 3000);
    });
    
    // Action button feedback
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            const actionType = this.classList.contains('encrypt') ? 'ENCRYPTED' : 
                              this.classList.contains('trace') ? 'TRACING...' : 
                              this.classList.contains('boost') ? 'BOOSTED!' : 'DONE';
            
            this.innerHTML = `<span class="icon">${this.querySelector('.icon').textContent}</span> ${actionType}`;
            this.style.background = this.classList.contains('encrypt') ? 'rgba(57, 255, 20, 0.2)' :
                                   this.classList.contains('trace') ? 'rgba(0, 255, 255, 0.2)' :
                                   'rgba(255, 0, 255, 0.2)';
            this.style.color = this.classList.contains('encrypt') ? '#39ff14' :
                              this.classList.contains('trace') ? '#00ffff' :
                              '#ff00ff';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = 'rgba(30, 30, 60, 0.5)';
                this.style.color = '';
            }, 2000);
        });
    });
    
    // Simulate new posts appearing
    function simulateNewPost() {
        const feed = document.querySelector('.cyber-feed');
        const postTemplate = document.querySelector('.post-card').cloneNode(true);
        
        // Modify the cloned post
        const timestamp = postTemplate.querySelector('.timestamp');
        timestamp.textContent = 'JUST NOW';
        
        const posterName = postTemplate.querySelector('h3');
        posterName.textContent = 'GHOST_IN_SHELL';
        
        const repScore = postTemplate.querySelector('.rep-score');
        repScore.textContent = Math.floor(Math.random() * 1000);
        
        const content = postTemplate.querySelector('.post-content p');
        content.textContent = 'New exploit discovered in corporate network. Selling access codes. High risk, high reward. Message contains vulnerability details.';
        
        const threatTag = postTemplate.querySelector('.threat-tag');
        const threatLevel = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
        threatTag.className = 'threat-tag ' + threatLevel;
        threatTag.textContent = threatLevel.toUpperCase() + ' THREAT';
        
        postTemplate.setAttribute('data-threat', threatLevel);
        
        // Add to feed with animation
        postTemplate.style.opacity = '0';
        postTemplate.style.transform = 'translateY(20px)';
        feed.insertBefore(postTemplate, feed.firstChild.nextSibling);
        
        // Animate entrance
        setTimeout(() => {
            postTemplate.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            postTemplate.style.opacity = '1';
            postTemplate.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove oldest post if too many
        const posts = document.querySelectorAll('.post-card');
        if (posts.length > 10) {
            posts[posts.length - 1].remove();
        }
    }
    
    // Periodically add new posts
    setInterval(simulateNewPost, 30000);
    
    // Initialize with some random interactions
    setTimeout(() => {
        const randomAvatar = glitchAvatars[Math.floor(Math.random() * glitchAvatars.length)];
        randomAvatar.style.animation = 'glitch 0.3s linear';
    }, 5000);
});