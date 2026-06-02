// Digital Museum - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Section highlighting in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Hologram 3D Interaction
    const holograms = document.querySelectorAll('.hologram-3d');
    holograms.forEach(hologram => {
        hologram.addEventListener('mousemove', (e) => {
            const rect = hologram.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            hologram.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        hologram.addEventListener('mouseleave', () => {
            hologram.style.transform = 'rotateX(15deg) rotateY(0deg)';
        });
    });

    // Artifact Control Buttons
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.artifact-card');
            const hologram = card.querySelector('.hologram-3d');
            const action = this.textContent;
            
            switch(action) {
                case '▶':
                    hologram.style.animationPlayState = 'running';
                    break;
                case '◀':
                    hologram.style.animationPlayState = 'paused';
                    break;
                case '+':
                    hologram.style.transform = hologram.style.transform 
                        ? hologram.style.transform + ' scale(1.1)' 
                        : 'scale(1.1)';
                    break;
                case '-':
                    const currentTransform = hologram.style.transform;
                    hologram.style.transform = currentTransform.replace(/scale\\([^)]+\\)/, 'scale(1)');
                    break;
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Oral History Player
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const storyItems = document.querySelectorAll('.story-item');
    const progressFill = document.getElementById('progress-fill');
    const audioWaveform = document.querySelector('.audio-waveform');
    let isPlaying = false;
    let currentStory = 0;
    let playInterval;

    function updateStory() {
        storyItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentStory);
        });
        
        // Animate waveform
        audioWaveform.style.opacity = isPlaying ? '1' : '0.5';
        if (isPlaying) {
            audioWaveform.style.transform = 'scaleY(1)';
        }
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? '⏸' : '▶';
        
        if (isPlaying) {
            playInterval = setInterval(() => {
                // Simulate progress
                const progress = Math.min(100, parseFloat(progressFill.style.width || 35) + 0.1);
                progressFill.style.width = progress + '%';
                
                if (progress >= 100) {
                    nextStory();
                }
            }, 100);
        } else {
            clearInterval(playInterval);
        }
    }

    function nextStory() {
        currentStory = (currentStory + 1) % storyItems.length;
        updateStory();
        progressFill.style.width = '0%';
    }

    function prevStory() {
        currentStory = (currentStory - 1 + storyItems.length) % storyItems.length;
        updateStory();
        progressFill.style.width = '0%';
    }

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', () => {
        nextStory();
        if (!isPlaying) {
            togglePlay();
        }
    });
    prevBtn.addEventListener('click', () => {
        prevStory();
        if (!isPlaying) {
            togglePlay();
        }
    });

    // Cosmic Star Map Interaction
    const starMap = document.querySelector('.star-map');
    if (starMap) {
        starMap.addEventListener('mousemove', (e) => {
            const rect = starMap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Move cosmic info based on mouse position
            const info = document.querySelector('.cosmic-info');
            if (info) {
                info.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
            }
        });
    }

    // Timeline Navigation
    const timelineBtns = document.querySelectorAll('.timeline-btn');
    const timelineEvents = document.querySelectorAll('.timeline-event');
    let currentTimeline = 0;

    timelineBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (index === 0) {
                // Previous
                currentTimeline = (currentTimeline - 1 + timelineEvents.length) % timelineEvents.length;
            } else {
                // Next
                currentTimeline = (currentTimeline + 1) % timelineEvents.length;
            }
            
            timelineEvents.forEach((event, i) => {
                event.classList.toggle('active', i === currentTimeline);
            });
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.artifact-card, .story-item, .cosmic-info').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add floating particles effect
    function createFloatingParticles() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: rgba(255, 215, 0, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: floatParticle 3s ease-out forwards;
        `;
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '-10px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    // Add CSS for particle animation if not already added
    if (!document.querySelector('#particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) translateX(50px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create particles periodically
    setInterval(createFloatingParticles, 2000);

    // Initialize first story
    updateStory();
    
    // Add active class to current nav link
    const currentLocation = location.hash;
    if (currentLocation) {
        const activeLink = document.querySelector(`.nav-link[href="${currentLocation}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});

// Add dynamic background effects
(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(255, 215, 0, ${Math.random() * 0.3})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.size > 0.2) this.size -= 0.01;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
})();