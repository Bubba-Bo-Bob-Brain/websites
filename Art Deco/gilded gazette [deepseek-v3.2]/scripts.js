// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('The Gilded Age Chronicle - 1927 Edition');
    
    // Initialize all interactive features
    initChampagneBubbles();
    initParallaxEffect();
    initMastheadAnimation();
    initInteractiveCards();
    initVintageAds();
    initArticleActions();
    initNavigationEffects();
    initTypewriterEffect();
    initGeometricAnimations();
    
    // Add jazz background music toggle
    initJazzMusicToggle();
    
    // Set the current date in the masthead
    updateCurrentDate();
});

// 1. Champagne Bubble Particle Effects
function initChampagneBubbles() {
    const bubbleContainer = document.getElementById('bubble-container');
    const colors = ['#d4af37', '#f7ef8a', '#ffd700', '#ffffff'];
    
    // Create initial bubbles
    for (let i = 0; i < 25; i++) {
        createBubble(bubbleContainer, colors);
    }
    
    // Create new bubbles on interval
    setInterval(() => {
        if (document.hasFocus()) {
            createBubble(bubbleContainer, colors);
        }
    }, 1000);
    
    // Create bubbles on mouse movement
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {
            createBubbleAtPosition(bubbleContainer, colors, e.clientX, e.clientY);
        }
    });
    
    // Create bubbles when clicking interactive elements
    document.querySelectorAll('.hero-button, .nav-link, .card-link, .action-button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            for (let i = 0; i < 5; i++) {
                const rect = element.getBoundingClientRect();
                createBubbleAtPosition(
                    bubbleContainer, 
                    colors, 
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }
        });
    });
}

function createBubble(container, colors) {
    const bubble = document.createElement('div');
    bubble.className = 'champagne-bubble';
    
    const size = Math.random() * 15 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 4 + 3;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.backgroundColor = color;
    bubble.style.opacity = Math.random() * 0.5 + 0.3;
    bubble.style.borderRadius = '50%';
    bubble.style.position = 'absolute';
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.top = '100%';
    bubble.style.boxShadow = `0 0 ${size/2}px ${color}`;
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '9998';
    
    // Animation
    const animation = bubble.animate([
        { transform: 'translateY(0) scale(1)', opacity: 0.8 },
        { transform: `translateY(-${window.innerHeight + 100}px) scale(${Math.random() * 0.5 + 0.8})`, opacity: 0 }
    ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    });
    
    animation.onfinish = () => bubble.remove();
    container.appendChild(bubble);
}

function createBubbleAtPosition(container, colors, x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'champagne-bubble';
    
    const size = Math.random() * 10 + 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 2 + 1;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.backgroundColor = color;
    bubble.style.opacity = Math.random() * 0.7 + 0.3;
    bubble.style.borderRadius = '50%';
    bubble.style.position = 'absolute';
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.style.boxShadow = `0 0 ${size}px ${color}`;
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '9998';
    
    // Random movement
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    
    const animation = bubble.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
        { 
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 100}px) scale(0.1)`, 
            opacity: 0 
        }
    ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    });
    
    animation.onfinish = () => bubble.remove();
    container.appendChild(bubble);
}

// 2. Parallax Scrolling Effect
function initParallaxEffect() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
    
    // Add mouse parallax effect
    document.querySelector('.parallax-hero').addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.1;
            layer.style.transform = `translate3d(${x * speed * 50}px, ${y * speed * 50}px, 0)`;
        });
    });
}

// 3. Animated Masthead with Jazz Rhythm
function initMastheadAnimation() {
    const titleParts = document.querySelectorAll('.title-part-1, .title-part-2, .title-part-3, .title-part-4');
    const subtitleLines = document.querySelectorAll('.subtitle-line');
    const geometricElements = document.querySelectorAll('.masthead-geometric-left, .masthead-geometric-right');
    
    // Staggered entrance animation
    titleParts.forEach((part, index) => {
        part.style.opacity = '0';
        part.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            part.animate([
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fill: 'forwards'
            });
        }, index * 200);
    });
    
    // Subtitles with typewriter effect
    subtitleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter);
                }
            }, 50);
        }, 1000 + (index * 500));
    });
    
    // Geometric elements pulse
    geometricElements.forEach(element => {
        setInterval(() => {
            element.animate([
                { transform: element.classList.contains('masthead-geometric-left') ? 'rotate(45deg) scale(1)' : 'rotate(-45deg) scale(1)' },
                { transform: element.classList.contains('masthead-geometric-left') ? 'rotate(45deg) scale(1.1)' : 'rotate(-45deg) scale(1.1)' },
                { transform: element.classList.contains('masthead-geometric-left') ? 'rotate(45deg) scale(1)' : 'rotate(-45deg) scale(1)' }
            ], {
                duration: 2000,
                easing: 'ease-in-out'
            });
        }, 3000);
    });
}

// 4. Interactive Article Cards
function initInteractiveCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    const vintageAds = document.querySelectorAll('.vintage-ad');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
            
            // Gold highlight effect
            const highlight = document.createElement('div');
            highlight.className = 'card-highlight';
            highlight.style.position = 'absolute';
            highlight.style.top = '0';
            highlight.style.left = '0';
            highlight.style.width = '100%';
            highlight.style.height = '100%';
            highlight.style.background = 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)';
            highlight.style.pointerEvents = 'none';
            highlight.style.zIndex = '-1';
            card.appendChild(highlight);
            
            // Gentle float animation
            card.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-8px)' }
            ], {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '';
            
            // Remove highlight
            const highlight = card.querySelector('.card-highlight');
            if (highlight) highlight.remove();
            
            // Return to original position
            card.animate([
                { transform: 'translateY(-8px)' },
                { transform: 'translateY(0)' }
            ], {
                duration: 300,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });
        
        // Click effect
        card.addEventListener('click', () => {
            card.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0.98)' },
                { transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        });
    });
    
    // Vintage ad interactions
    vintageAds.forEach(ad => {
        ad.addEventListener('mouseenter', () => {
            // Play subtle vintage sound (conceptual)
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Create oscillator for subtle hover sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            
            // Visual effect
            ad.style.borderColor = '#d4af37';
            ad.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.3)';
        });
        
        ad.addEventListener('mouseleave', () => {
            ad.style.borderColor = '';
            ad.style.boxShadow = '';
        });
    });
}

// 5. Vintage Advertisement Effects
function initVintageAds() {
    const ads = document.querySelectorAll('.vintage-ad');
    const adTexts = [
        "LUCKY STRIKE CIGARETTES",
        "THE PAUSE THAT REFRESHES",
        "EUROPE IN FIVE DAYS",
        "THE STANDARD OF THE WORLD"
    ];
    
    ads.forEach((ad, index) => {
        const visual = ad.querySelector('.ad-visual');
        
        // Create vintage pattern for each ad
        const patterns = [
            'stripes', 'dots', 'herringbone', 'chevron'
        ];
        
        const pattern = patterns[index % patterns.length];
        visual.style.backgroundImage = getVintagePattern(pattern);
        
        // Add subtle animation
        visual.style.animation = `vintageFloat 6s infinite ease-in-out ${index * 0.5}s`;
        
        // Add click to reveal more info
        ad.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'vintage-ad-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${adTexts[index]}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>This advertisement from 1927 represents the golden age of print marketing. 
                        The Art Deco style was characterized by geometric shapes, lavish ornamentation, 
                        and bold typography that reflected the optimism and modernity of the era.</p>
                        <p>Original placement would have cost approximately $250-$500 in 1927 dollars 
                        (equivalent to $3,500-$7,000 today).</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Style the modal
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '10000';
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.background = 'linear-gradient(135deg, #1a1a1a, #0a1931)';
            modalContent.style.border = '3px solid #d4af37';
            modalContent.style.padding = '2rem';
            modalContent.style.maxWidth = '500px';
            modalContent.style.color = '#f5f1e6';
            modalContent.style.fontFamily = '"Playfair Display", serif';
            modalContent.style.position = 'relative';
            
            modal.querySelector('.modal-header h3').style.fontFamily = '"Cinzel", serif';
            modal.querySelector('.modal-header h3').style.color = '#d4af37';
            modal.querySelector('.modal-header h3').style.marginBottom = '1rem';
            
            modal.querySelector('.modal-close').style.position = 'absolute';
            modal.querySelector('.modal-close').style.top = '1rem';
            modal.querySelector('.modal-close').style.right = '1rem';
            modal.querySelector('.modal-close').style.background = 'none';
            modal.querySelector('.modal-close').style.border = 'none';
            modal.querySelector('.modal-close').style.color = '#d4af37';
            modal.querySelector('.modal-close').style.fontSize = '2rem';
            modal.querySelector('.modal-close').style.cursor = 'pointer';
            
            // Close modal functionality
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
    
    // Add CSS animation for vintage float
    const style = document.createElement('style');
    style.textContent = `
        @keyframes vintageFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}

function getVintagePattern(pattern) {
    const patterns = {
        stripes: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(212, 175, 55, 0.1) 10px,
            rgba(212, 175, 55, 0.1) 20px
        )`,
        dots: `radial-gradient(
            circle at 10px 10px,
            rgba(212, 175, 55, 0.15) 2px,
            transparent 2px
        )`,
        herringbone: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 5px,
            rgba(212, 175, 55, 0.1) 5px,
            rgba(212, 175, 55, 0.1) 10px
        )`,
        chevron: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 5px,
            rgba(212, 175, 55, 0.1) 5px,
            rgba(212, 175, 55, 0.1) 10px
        )`
    };
    
    return patterns[pattern] || patterns.stripes;
}

// 6. Article Action Buttons
function initArticleActions() {
    const shareButton = document.querySelector('.share-button');
    const saveButton = document.querySelector('.save-button');
    const commentButton = document.querySelector('.comment-button');
    const subscribeButton = document.querySelector('.subscribe-button');
    
    // Share functionality
    shareButton.addEventListener('click', () => {
        const title = document.querySelector('.article-title').textContent;
        const url = window.location.href;
        
        // Create share modal
        const shareModal = document.createElement('div');
        shareModal.className = 'share-modal';
        shareModal.innerHTML = `
            <div class="share-content">
                <h4>Share Article</h4>
                <p>"${title.substring(0, 50)}..."</p>
                <div class="share-options">
                    <button class="share-option twitter">Twitter</button>
                    <button class="share-option facebook">Facebook</button>
                    <button class="share-option copy">Copy Link</button>
                </div>
                <button class="share-close">Close</button>
            </div>
        `;
        
        document.body.appendChild(shareModal);
        
        // Style modal
        shareModal.style.position = 'fixed';
        shareModal.style.top = '0';
        shareModal.style.left = '0';
        shareModal.style.width = '100%';
        shareModal.style.height = '100%';
        shareModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        shareModal.style.display = 'flex';
        shareModal.style.alignItems = 'center';
        shareModal.style.justifyContent = 'center';
        shareModal.style.zIndex = '10000';
        
        const shareContent = shareModal.querySelector('.share-content');
        shareContent.style.background = 'linear-gradient(135deg, #f5f1e6, #e8dfc8)';
        shareContent.style.border = '3px solid #d4af37';
        shareContent.style.padding = '2rem';
        shareContent.style.borderRadius = '0';
        shareContent.style.maxWidth = '400px';
        shareContent.style.color = '#1a1a1a';
        
        // Add share functionality
        shareModal.querySelector('.share-close').addEventListener('click', () => {
            shareModal.remove();
        });
        
        shareModal.querySelector('.twitter').addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        });
        
        shareModal.querySelector('.facebook').addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        });
        
        shareModal.querySelector('.copy').addEventListener('click', () => {
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
                shareModal.remove();
            });
        });
        
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.remove();
            }
        });
    });
    
    // Save functionality (simulated)
    saveButton.addEventListener('click', () => {
        saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        saveButton.style.color = '#d4af37';
        
        setTimeout(() => {
            saveButton.innerHTML = '<i class="far fa-bookmark"></i> Save';
            saveButton.style.color = '';
        }, 2000);
    });
    
    // Comment functionality
    commentButton.addEventListener('click', () => {
        // Scroll to comment section (simulated)
        window.scrollTo({
            top: document.querySelector('.article-footer').offsetTop,
            behavior: 'smooth'
        });
        
        // Create comment input
        const commentInput = document.createElement('div');
        commentInput.className = 'comment-input';
        commentInput.innerHTML = `
            <textarea placeholder="Join the conversation..."></textarea>
            <button class="submit-comment">Submit Comment</button>
        `;
        
        const articleFooter = document.querySelector('.article-footer');
        articleFooter.appendChild(commentInput);
        
        // Focus on textarea
        setTimeout(() => {
            commentInput.querySelector('textarea').focus();
        }, 300);
    });
    
    // Subscribe functionality
    subscribeButton.addEventListener('click', () => {
        // Animate button
        subscribeButton.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
        
        // Show subscription modal
        setTimeout(() => {
            const modal = document.createElement('div');
            modal.className = 'subscribe-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Subscribe to The Gilded Age Chronicle</h3>
                    <p>Receive our weekly publication delivered to your door.</p>
                    <div class="subscription-options">
                        <div class="option monthly">
                            <h4>Monthly</h4>
                            <p class="price">$1.20</p>
                            <button class="select-option">Select</button>
                        </div>
                        <div class="option annual">
                            <h4>Annual</h4>
                            <p class="price">$12.00</p>
                            <button class="select-option">Select</button>
                        </div>
                    </div>
                    <button class="modal-close">Close</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Style and functionality similar to vintage ad modal
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '10000';
            
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 300);
    });
}

// 7. Navigation Effects
function initNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = link.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            ripple.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.position = 'absolute';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            
            link.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Simulate navigation
            const section = link.textContent.replace('◊', '').replace('✦', '').replace('⌘', '').replace('☾', '').replace('⚙', '').replace('♠', '').trim();
            console.log(`Navigating to: ${section}`);
            
            // Highlight active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .nav-link.active {
            color: #d4af37 !important;
        }
        .nav-link.active::before {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}

// 8. Typewriter Effect for Headlines
function initTypewriterEffect() {
    const headlines = document.querySelectorAll('.card-title, .headline-main');
    
    headlines.forEach(headline => {
        const originalText = headline.textContent;
        headline.dataset.originalText = originalText;
        
        headline.addEventListener('mouseenter', () => {
            if (headline.classList.contains('typing')) return;
            
            headline.classList.add('typing');
            headline.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    headline.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        headline.classList.remove('typing');
                    }, 1000);
                }
            }, 30);
        });
        
        headline.addEventListener('mouseleave', () => {
            if (headline.classList.contains('typing')) {
                // If still typing, just restore immediately
                headline.textContent = originalText;
                headline.classList.remove('typing');
            }
        });
    });
}

// 9. Geometric Animations throughout page
function initGeometricAnimations() {
    // Animate geometric dividers
    const dividers = document.querySelectorAll('.divider-ornament');
    
    dividers.forEach(divider => {
        setInterval(() => {
            divider.animate([
                { transform: 'scale(1)', opacity: 0.7 },
                { transform: 'scale(1.2)', opacity: 1 },
                { transform: 'scale(1)', opacity: 0.7 }
            ], {
                duration: 2000,
                easing: 'ease-in-out'
            });
        }, 3000);
    });
    
    // Add floating animation to drop cap
    const dropCap = document.querySelector('.drop-cap');
    if (dropCap) {
        setInterval(() => {
            dropCap.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-5px)' },
                { transform: 'translateY(0)' }
            ], {
                duration: 3000,
                easing: 'ease-in-out'
            });
        }, 5000);
    }
    
    // Animate stats panel numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const number = parseFloat(originalText);
        
        stat.addEventListener('mouseenter', () => {
            let current = 0;
            const increment = number / 20;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = originalText;
                    clearInterval(timer);
                } else {
                    stat.textContent = current.toFixed(0) + (originalText.includes('%') ? '%' : '');
                }
            }, 50);
        });
    });
}

// 10. Jazz Music Toggle
function initJazzMusicToggle() {
    // Create music toggle button
    const musicToggle = document.createElement('button');
    musicToggle.id = 'jazz-music-toggle';
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    musicToggle.title = 'Toggle Jazz Music';
    
    document.body.appendChild(musicToggle);
    
    // Style the toggle button
    musicToggle.style.position = 'fixed';
    musicToggle.style.bottom = '20px';
    musicToggle.style.right = '20px';
    musicToggle.style.width = '50px';
    musicToggle.style.height = '50px';
    musicToggle.style.borderRadius = '50%';
    musicToggle.style.background = 'linear-gradient(45deg, #d4af37, #f7ef8a)';
    musicToggle.style.color = '#1a1a1a';
    musicToggle.style.border = '2px solid #1a1a1a';
    musicToggle.style.fontSize = '1.5rem';
    musicToggle.style.cursor = 'pointer';
    musicToggle.style.zIndex = '10000';
    musicToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    musicToggle.style.display = 'flex';
    musicToggle.style.alignItems = 'center';
    musicToggle.style.justifyContent = 'center';
    
    // Audio context for jazz music simulation
    let audioContext = null;
    let isPlaying = false;
    let oscillator = null;
    let gainNode = null;
    
    musicToggle.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        if (!isPlaying) {
            // Start jazz-inspired audio
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.style.background = 'linear-gradient(45deg, #1a1a1a, #0a1931)';
            musicToggle.style.color = '#d4af37';
            
            // Create jazz rhythm simulation
            playJazzRhythm(audioContext);
        } else {
            // Stop audio
            isPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.style.background = 'linear-gradient(45deg, #d4af37, #f7ef8a)';
            musicToggle.style.color = '#1a1a1a';
            
            if (oscillator) {
                oscillator.stop();
                oscillator = null;
            }
        }
    });
    
    function playJazzRhythm(context) {
        // Create oscillator for bass line
        oscillator = context.createOscillator();
        gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.type = 'sawtooth';
        
        // Jazz chord progression (simplified)
        const notes = [261.63, 329.63, 392.00, 493.88]; // C, E, G, B
        let noteIndex = 0;
        
        function playNextNote() {
            if (!isPlaying) return;
            
            oscillator.frequency.setValueAtTime(notes[noteIndex], context.currentTime);
            gainNode.gain.setValueAtTime(0.05, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
            
            noteIndex = (noteIndex + 1) % notes.length;
            
            setTimeout(() => {
                if (isPlaying) {
                    playNextNote();
                }
            }, 600);
        }
        
        oscillator.start();
        playNextNote();
    }
}

// 11. Update Current Date in Masthead
function updateCurrentDate() {
    const dateElement = document.querySelector('.subtitle-line:nth-child(3)');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('en-US', options).toUpperCase();
        dateElement.textContent = formattedDate;
    }
}

// 12. Add CSS for additional animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .champagne-bubble {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    
    .card-highlight {
        animation: highlightPulse 2s infinite alternate;
    }
    
    @keyframes highlightPulse {
        0% { opacity: 0.1; }
        100% { opacity: 0.3; }
    }
    
    .typing {
        border-right: 2px solid #d4af37;
        animation: blinkCursor 0.7s infinite;
    }
    
    @keyframes blinkCursor {
        0%, 100% { border-color: transparent; }
        50% { border-color: #d4af37; }
    }
    
    .vintage-ad-modal .modal-content {
        animation: modalAppear 0.3s ease-out;
    }
    
    @keyframes modalAppear {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .share-modal .share-content,
    .subscribe-modal .modal-content {
        animation: modalAppear 0.3s ease-out;
    }
    
    .comment-input {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(212, 175, 55, 0.05);
        border: 1px solid rgba(212, 175, 55, 0.3);
    }
    
    .comment-input textarea {
        width: 100%;
        min-height: 100px;
        padding: 0.5rem;
        font-family: inherit;
        border: 1px solid rgba(212, 175, 55, 0.5);
        background: #faf8f2;
        color: #1a1a1a;
        resize: vertical;
    }
    
    .submit-comment {
        background: #d4af37;
        color: #1a1a1a;
        border: none;
        padding: 0.5rem 1rem;
        margin-top: 0.5rem;
        cursor: pointer;
        font-family: 'Cinzel', serif;
        font-weight: bold;
    }
    
    .subscription-options {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .subscription-options .option {
        flex: 1;
        padding: 1rem;
        border: 2px solid #d4af37;
        text-align: center;
    }
    
    .subscription-options .price {
        font-size: 1.5rem;
        color: #d4af37;
        font-weight: bold;
        margin: 0.5rem 0;
    }
    
    .select-option {
        background: #d4af37;
        color: #1a1a1a;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-family: 'Cinzel', serif;
    }
`;

document.head.appendChild(additionalStyles);

// Initialize page with a subtle entrance animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 300);
    
    // Add a welcome message in console
    console.log('%c✨ Welcome to The Gilded Age Chronicle ✨', 'color: #d4af37; font-size: 18px; font-weight: bold;');
    console.log('%cExperience the opulence of the 1920s Art Deco era.', 'color: #8a9a5b; font-size: 14px;');
});