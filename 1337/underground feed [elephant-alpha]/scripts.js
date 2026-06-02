// scripts.js

class CyberNet {
    constructor() {
        this.posts = [];
        this.postIdCounter = 1;
        this.reputation = 8420;
        this.maxReputation = 10000;
        this.traceDetected = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSamplePosts();
        this.startBackgroundEffects();
        this.updateReputationBar();
    }

    bindEvents() {
        // Post submission
        document.getElementById('submitPost').addEventListener('click', () => this.submitPost());
        document.getElementById('postInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.submitPost();
            }
        });

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeTraceModal();
        });

        // Quick buttons
        document.getElementById('newPostBtn').addEventListener('click', () => {
            document.getElementById('postInput').focus();
        });

        // Threat level selection visual feedback
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('threat-level-select')) {
                this.updateThreatVisuals(e.target);
            }
        });

        // Encryption preview hover
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('post-encrypted-preview')) {
                this.showDecryptedPreview(e.target);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('post-encrypted-preview')) {
                this.hideDecryptedPreview(e.target);
            }
        });
    }

    submitPost() {
        const input = document.getElementById('postInput');
        const threatLevel = document.getElementById('threatLevel').value;
        const postType = document.getElementById('postType').value;
        const content = input.value.trim();

        if (!content) {
            this.showNotification('Empty posts cannot be transmitted', 'error');
            return;
        }

        const post = {
            id: this.postIdCounter++,
            author: 'Ghost_0x7F',
            time: this.getCurrentTime(),
            content: content,
            threatLevel: threatLevel,
            type: postType,
            encrypted: true,
            decrypted: false
        };

        this.posts.unshift(post);
        this.renderPost(post);
        input.value = '';
        this.updateCharCount();
        
        // Gain reputation for posting
        this.reputation += Math.floor(Math.random() * 50) + 10;
        if (this.reputation > this.maxReputation) this.reputation = this.maxReputation;
        this.updateReputationBar();

        // Check for trace detection randomly
        if (Math.random() < 0.1) {
            this.triggerTraceDetection();
        }

        this.showNotification('Post transmitted successfully', 'success');
    }

    renderPost(post) {
        const container = document.getElementById('postsContainer');
        const postElement = this.createPostElement(post);
        container.insertBefore(postElement, container.firstChild);
    }

    createPostElement(post) {
        const postEl = document.createElement('div');
        postEl.className = 'post-card';
        postEl.dataset.postId = post.id;
        
        const threatLabel = this.getThreatLabel(post.threatLevel);
        const threatClass = `post-threat-level ${post.threatLevel}`;
        
        postEl.innerHTML = `
            <div class="post-header">
                <div class="post-meta">
                    <div class="post-avatar-placeholder-sm">
                        <span>${post.author.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <div class="post-author">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <span class="${threatClass}">${threatLabel}</span>
            </div>
            <div class="post-content">
                ${this.highlightCode(post.content)}
            </div>
            <div class="post-actions">
                <div class="post-encrypted-preview">
                    🔒 ENCRYPTED PREVIEW
                    <div class="encrypted-content">
                        ${this.generateDecryptedContent(post.content)}
                    </div>
                </div>
                <div class="post-meta">
                    <span class="rep-score" style="font-size: 0.8rem;">+${Math.floor(Math.random() * 20) + 5}</span>
                </div>
            </div>
        `;

        return postEl;
    }

    highlightCode(text) {
        // Simple syntax highlighting for code-like content
        let highlighted = text
            .replace(/(&&|\|\||===|!==|\?|:|;)/g, '<span class="code-keyword">$1</span>')
            .replace(/(".*?"|'.*?')/g, '<span class="code-string">$1</span>')
            .replace(/(function|var|let|const|return|if|else|for|while|import|export)/g, '<span class="code-function">$1</span>')
            .replace(/(#.*$)/gm, '<span class="code-comment">$1</span>');
        
        return highlighted;
    }

    generateDecryptedContent(text) {
        // Generate realistic-looking decrypted content
        const decryptedMessages = [
            'CONFIDENTIAL: Asset transfer scheduled for 0300 hours',
            'PROJECT PHOENIX: Server credentials rotated, access granted',
            'DATABASE EXTRACT: Financial records from CorpSec systems',
            'API KEY: x7h2-9k4m-2p8q-r5t6 (expires in 48h)',
            'LOCATION DATA: Warehouse 7-B, Sector 9, Grid Delta'
        ];
        
        return decryptedMessages[Math.floor(Math.random() * decryptedMessages.length)];
    }

    getThreatLabel(level) {
        const labels = {
            low: 'LOW',
            medium: 'MEDIUM',
            high: 'HIGH',
            critical: 'CRITICAL'
        };
        return labels[level] || 'LOW';
    }

    updateCharCount() {
        const input = document.getElementById('postInput');
        const count = input.value.length;
        document.getElementById('charCount').textContent = `${count}/500`;
        
        // Color code the counter
        const counter = document.getElementById('charCount');
        if (count > 400) {
            counter.style.color = 'var(--neon-pink)';
        } else if (count > 300) {
            counter.style.color = 'var(--neon-orange)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    }

    updateReputationBar() {
        const bar = document.getElementById('repBar');
        const percentage = (this.reputation / this.maxReputation) * 100;
        bar.style.width = `${percentage}%`;
        
        // Change color based on reputation
        if (this.reputation > 8000) {
            bar.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))';
        } else if (this.reputation > 5000) {
            bar.style.background = 'linear-gradient(90deg, var(--neon-orange), var(--neon-pink))';
        } else {
            bar.style.background = 'linear-gradient(90deg, var(--neon-pink), var(--neon-purple))';
        }
    }

    updateThreatVisuals(select) {
        const parent = select.parentElement;
        parent.style.borderColor = select.value === 'high' || select.value === 'critical' 
            ? 'var(--neon-pink)' 
            : 'var(--border-color)';
    }

    showDecryptedPreview(element) {
        const encryptedContent = element.querySelector('.encrypted-content');
        if (encryptedContent) {
            encryptedContent.style.display = 'block';
            element.style.borderColor = 'var(--neon-cyan)';
        }
    }

    hideDecryptedPreview(element) {
        const encryptedContent = element.querySelector('.encrypted-content');
        if (encryptedContent) {
            encryptedContent.style.display = 'none';
            element.style.borderColor = 'rgba(0, 243, 255, 0.3)';
        }
    }

    triggerTraceDetection() {
        if (this.traceDetected) return;
        
        this.traceDetected = true;
        const modal = document.getElementById('traceModal');
        modal.classList.add('active');
        
        // Visual feedback
        document.body.style.filter = 'hue-rotate(10deg)';
        
        setTimeout(() => {
            this.traceDetected = false;
            document.body.style.filter = 'none';
        }, 5000);
    }

    closeTraceModal() {
        document.getElementById('traceModal').classList.remove('active');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 0, 85, 0.2)'};
            border: 1px solid ${type === 'success' ? 'var(--neon-green)' : 'var(--neon-pink)'};
            border-radius: 4px;
            color: ${type === 'success' ? 'var(--neon-green)' : 'var(--neon-pink)'};
            font-family: var(--font-display);
            z-index: 10000;
            animation: notificationSlideIn 0.3s ease;
            box-shadow: 0 0 20px ${type === 'success' ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 0, 85, 0.5)'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    loadSamplePosts() {
        const samplePosts = [
            {
                author: 'Cipher_0x0F',
                time: '14:23:05',
                content: 'New exploit for corporate firewall systems available for acquisition',
                threatLevel: 'high',
                type: 'job'
            },
            {
                author: 'ShadowAgent',
                time: '13:45:22',
                content: 'Data breach at TechCorp - 2.3M records stolen',
                threatLevel: 'critical',
                type: 'leak'
            },
            {
                author: 'ZeroCool',
                time: '12:10:15',
                content: 'Selling custom malware development kit - contact for details',
                threatLevel: 'medium',
                type: 'trade'
            }
        ];

        samplePosts.forEach(postData => {
            const post = {
                id: this.postIdCounter++,
                ...postData,
                encrypted: true,
                decrypted: false
            };
            this.posts.push(post);
            this.renderPost(post);
        });
    }

    startBackgroundEffects() {
        // Random trace effects in background
        setInterval(() => {
            if (Math.random() < 0.02 && !this.traceDetected) {
                this.createTraceEffect();
            }
        }, 1000);
    }

    createTraceEffect() {
        const traces = document.querySelectorAll('.trace-line');
        traces.forEach(line => {
            line.style.animation = 'none';
            setTimeout(() => {
                line.style.animation = '';
            }, 10);
        });
    }

    getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' +
               now.getMinutes().toString().padStart(2, '0') + ':' +
               now.getSeconds().toString().padStart(2, '0');
    }
}

// Initialize the cybernet when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberNet();
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes notificationSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Handle real-time updates
setInterval(() => {
    const timeElements = document.querySelectorAll('.post-time');
    timeElements.forEach(el => {
        const now = new Date();
        el.textContent = now.getHours().toString().padStart(2, '0') + ':' +
                        now.getMinutes().toString().padStart(2, '0') + ':' +
                        now.getSeconds().toString().padStart(2, '0');
    });
}, 1000);