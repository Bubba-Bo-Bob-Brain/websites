/* ============================================
   ANCESTRAL COSMOS - DIGITAL MUSEUM
   Interactive JavaScript
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoadingCeremony();
    initCustomCursor();
    initNavigation();
    initCosmicCanvas();
    initHolographicArtifacts();
    initAncestralVoices();
    initCosmicOrigins();
    initEternalTimeline();
    initStarMap();
    initGriotNarration();
    initScrollAnimations();
    initStatCounters();
});

/* ============================================
   LOADING CEREMONY
   ============================================ */

function initLoadingCeremony() {
    const loadingCeremony = document.getElementById('loading-ceremony');
    
    // Simulate loading process
    setTimeout(() => {
        loadingCeremony.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Start hero animations after loading
        setTimeout(() => {
            startHeroAnimations();
        }, 500);
    }, 2500);
    
    // Add animation to loading symbol
    const loadingSymbol = document.querySelector('.adinkra-loading');
    if (loadingSymbol) {
        let rotation = 0;
        setInterval(() => {
            rotation += 1;
            loadingSymbol.style.transform = `rotate(${rotation}deg)`;
        }, 30);
    }
}

function startHeroAnimations() {
    // Additional hero animations can be triggered here
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */

function initCustomCursor() {
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (!cursorRing || !cursorDot) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediately update dot position
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Smooth ring following with delay
    function animateCursor() {
        // Ease toward mouse position
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Interactive elements cursor effect
    const interactiveElements = document.querySelectorAll('a, button, .artifact-card, .voice-card, .nav-link, .carousel-btn, .dot, .holo-btn, .play-btn, .progress-bar, .era-marker, .star-point');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorRing.style.borderColor = '#ffd700';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.borderColor = '#d4af37';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const soundToggle = document.getElementById('soundToggle');
    
    // Scroll behavior for navigation
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sound toggle functionality
    if (soundToggle) {
        let soundOn = false;
        soundToggle.addEventListener('click', () => {
            soundOn = !soundOn;
            soundToggle.style.color = soundOn ? '#ffd700' : '#d4af37';
            // In a real implementation, this would toggle ambient sound
            console.log(`Sound ${soundOn ? 'ON' : 'OFF'}`);
        });
    }
}

/* ============================================
   COSMIC CANVAS (HERO BACKGROUND)
   ============================================ */

function initCosmicCanvas() {
    const canvas = document.getElementById('cosmicCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Star properties
    const stars = [];
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            opacity: Math.random(),
            speed: Math.random() * 0.5 + 0.1
        });
    }
    
    // Nebula properties
    const nebulae = [];
    const numNebulae = 5;
    
    for (let i = 0; i < numNebulae; i++) {
        nebulae.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 200 + 100,
            color: `hsla(${Math.random() * 60 + 20}, 70%, 50%, ${Math.random() * 0.1 + 0.05})`,
            speed: Math.random() * 0.2 + 0.05
        });
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw nebulae
        nebulae.forEach(nebula => {
            const gradient = ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.radius
            );
            
            gradient.addColorStop(0, nebula.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move nebula
            nebula.x += nebula.speed;
            if (nebula.x > canvas.width + nebula.radius) {
                nebula.x = -nebula.radius;
            }
        });
        
        // Draw stars
        stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Twinkle effect
            star.opacity += (Math.random() - 0.5) * 0.05;
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));
            
            // Move stars
            star.x += star.speed;
            if (star.x > canvas.width) {
                star.x = 0;
                star.y = Math.random() * canvas.height;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ============================================
   HOLOGRAPHIC ARTIFACTS
   ============================================ */

function initHolographicArtifacts() {
    const artifactCards = document.querySelectorAll('.artifact-card');
    const modal = document.getElementById('artifactModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    // Artifact data
    const artifactData = {
        1: {
            title: "Golden Crown of Meroë",
            description: "A ceremonial crown adorned with solar symbols and sacred scarabs, representing divine kingship along the Nile. This exquisite piece from the Kingdom of Kush showcases the advanced metalworking techniques of ancient African artisans.",
            origin: "Kingdom of Kush",
            period: "c. 1200 BCE",
            material: "Gold Alloy"
        },
        2: {
            title: "Axumite Obelisk Fragment",
            description: "A carved granite stela depicting the architectural genius of ancient Ethiopia. These towering monuments symbolized the connection between earth and sky, and were erected to commemorate royal figures.",
            origin: "Axumite Empire",
            period: "c. 500 CE",
            material: "Granite"
        },
        3: {
            title: "Benin Bronze Mother",
            description: "An exquisite bronze sculpture of Queen Mother Idia, exemplifying the mastery of lost-wax casting technique. These bronzes were created to adorn the royal palace and commemorate important figures.",
            origin: "Benin Kingdom",
            period: "c. 1600 CE",
            material: "Bronze"
        },
        4: {
            title: "Golden Stool Vessel",
            description: "A sacred gold vessel embodying the soul of the Ashanti nation, crafted with intricate Adinkra symbolism. The Golden Stool is central to Ashanti mythology and kingship.",
            origin: "Ashanti Empire",
            period: "c. 1800 CE",
            material: "Gold"
        }
    };
    
    // Add click event to artifact cards
    artifactCards.forEach(card => {
        const exploreBtn = card.querySelector('.artifact-explore-btn');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const artifactId = card.getAttribute('data-artifact');
                openArtifactModal(artifactId);
            });
        }
        
        // Rotate controls
        const rotateLeftBtn = card.querySelector('.rotate-left');
        const rotateRightBtn = card.querySelector('.rotate-right');
        const zoomBtn = card.querySelector('.zoom');
        const artifact3d = card.querySelector('.artifact-3d');
        
        if (rotateLeftBtn && artifact3d) {
            rotateLeftBtn.addEventListener('click', () => {
                const currentRotation = artifact3d.style.transform || 'rotate(0deg)';
                const match = currentRotation.match(/rotate\((\d+)deg\)/);
                const currentDeg = match ? parseInt(match[1]) : 0;
                artifact3d.style.transform = `rotate(${currentDeg - 45}deg)`;
            });
        }
        
        if (rotateRightBtn && artifact3d) {
            rotateRightBtn.addEventListener('click', () => {
                const currentRotation = artifact3d.style.transform || 'rotate(0deg)';
                const match = currentRotation.match(/rotate\((\d+)deg\)/);
                const currentDeg = match ? parseInt(match[1]) : 0;
                artifact3d.style.transform = `rotate(${currentDeg + 45}deg)`;
            });
        }
        
        if (zoomBtn && artifact3d) {
            zoomBtn.addEventListener('click', () => {
                const currentScale = artifact3d.style.transform || 'scale(1)';
                const match = currentScale.match(/scale\((\d+(?:\.\d+)?)\)/);
                const currentScaleVal = match ? parseFloat(match[1]) : 1;
                
                if (currentScaleVal === 1) {
                    artifact3d.style.transform = 'scale(1.3)';
                } else {
                    artifact3d.style.transform = 'scale(1)';
                }
            });
        }
    });
    
    // Modal functions
    function openArtifactModal(artifactId) {
        const artifact = artifactData[artifactId];
        if (!artifact || !modal) return;
        
        // Update modal content
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description');
        const detailVals = modal.querySelectorAll('.detail-val');
        
        if (modalTitle) modalTitle.textContent = artifact.title;
        if (modalDescription) modalDescription.textContent = artifact.description;
        if (detailVals.length >= 3) {
            detailVals[0].textContent = artifact.origin;
            detailVals[1].textContent = artifact.period;
            detailVals[2].textContent = artifact.material;
        }
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeArtifactModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeArtifactModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeArtifactModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeArtifactModal();
        }
    });
}

/* ============================================
   ANCESTRAL VOICES (AUDIO PLAYERS)
   ============================================ */

function initAncestralVoices() {
    const voiceCards = document.querySelectorAll('.voice-card');
    
    voiceCards.forEach(card => {
        const playBtn = card.querySelector('.play-btn');
        const progressBar = card.querySelector('.progress-bar');
        const progressFill = card.querySelector('.progress-fill');
        const progressHandle = card.querySelector('.progress-handle');
        const waveformCanvas = card.querySelector('.waveform-canvas');
        
        if (!playBtn) return;
        
        let isPlaying = false;
        let progress = 0;
        let animationInterval;
        
        // Simulate audio playback
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playBtn.classList.add('playing');
                startWaveformAnimation(waveformCanvas);
                startProgressSimulation();
            } else {
                playBtn.classList.remove('playing');
                stopWaveformAnimation(waveformCanvas);
                stopProgressSimulation();
            }
        });
        
        // Progress bar click
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                progress = (clickX / width) * 100;
                updateProgress();
            });
        }
        
        function startProgressSimulation() {
            animationInterval = setInterval(() => {
                progress += 0.5;
                if (progress >= 100) {
                    progress = 0;
                    isPlaying = false;
                    playBtn.classList.remove('playing');
                    stopProgressSimulation();
                    stopWaveformAnimation(waveformCanvas);
                }
                updateProgress();
            }, 100);
        }
        
        function stopProgressSimulation() {
            clearInterval(animationInterval);
        }
        
        function updateProgress() {
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressHandle) progressHandle.style.left = `${progress}%`;
        }
        
        // Transcript reveal animation
        const transcriptText = card.querySelector('.transcript-text');
        if (transcriptText) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateTextReveal(transcriptText);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(card);
        }
    });
}

function startWaveformAnimation(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    let animationId;
    const bars = 50;
    const barWidth = width / bars;
    
    function drawWaveform() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < bars; i++) {
            const barHeight = Math.random() * height * 0.8;
            const x = i * barWidth;
            const y = (height - barHeight) / 2;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(1, '#d4af37');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
        
        animationId = requestAnimationFrame(drawWaveform);
    }
    
    drawWaveform();
    
    // Store animation ID for stopping
    canvas.animationId = animationId;
}

function stopWaveformAnimation(canvas) {
    if (canvas && canvas.animationId) {
        cancelAnimationFrame(canvas.animationId);
        
        // Clear canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function animateTextReveal(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const speed = 30; // ms per character
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

/* ============================================
   COSMIC ORIGINS CAROUSEL
   ============================================ */

function initCosmicOrigins() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !prevBtn || !nextBtn || dots.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = 3;
    
    function updateCarousel() {
        // Move track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Auto-advance carousel
    let autoAdvanceInterval = setInterval(nextSlide, 8000);
    
    // Pause auto-advance on hover
    const carousel = document.querySelector('.origins-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoAdvanceInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoAdvanceInterval = setInterval(nextSlide, 8000);
        });
    }
    
    // Initialize
    updateCarousel();
}

/* ============================================
   ETERNAL TIMELINE
   ============================================ */

function initEternalTimeline() {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    const eraMarkers = document.querySelectorAll('.era-marker');
    
    // Add hover effects to timeline events
    timelineEvents.forEach(event => {
        event.addEventListener('mouseenter', () => {
            const marker = event.querySelector('.marker-inner');
            if (marker) {
                marker.style.transform = 'scale(1.5)';
                marker.style.boxShadow = '0 0 20px #d4af37';
            }
        });
        
        event.addEventListener('mouseleave', () => {
            const marker = event.querySelector('.marker-inner');
            if (marker) {
                marker.style.transform = 'scale(1)';
                marker.style.boxShadow = 'none';
            }
        });
        
        // Scroll animation for timeline events
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(event);
    });
    
    // Era marker interactions
    eraMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const era = marker.getAttribute('data-era');
            const eraEvents = document.querySelectorAll(`.timeline-event.${era}`);
            
            // Highlight events from this era
            timelineEvents.forEach(event => {
                event.style.opacity = '0.3';
                event.style.transform = 'scale(0.95)';
            });
            
            eraEvents.forEach(event => {
                event.style.opacity = '1';
                event.style.transform = 'scale(1) translateX(10px)';
                event.style.borderColor = '#d4af37';
                event.style.boxShadow = '0 10px 40px rgba(212, 175, 55, 0.3)';
            });
            
            // Scroll to first event of this era
            if (eraEvents.length > 0) {
                eraEvents[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Reset after 3 seconds
            setTimeout(() => {
                timelineEvents.forEach(event => {
                    event.style.opacity = '1';
                    event.style.transform = 'scale(1)';
                    event.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                    event.style.boxShadow = 'none';
                });
            }, 3000);
        });
    });
}

/* ============================================
   STAR MAP
   ============================================ */

function initStarMap() {
    const starmapViz = document.getElementById('starmapViz');
    if (!starmapViz) return;
    
    // Star data
    const stars = [
        // Origin point (Africa)
        { x: 50, y: 50, size: 8, type: 'origin', name: 'Africa - Origin', description: 'The cradle of humanity, source of all civilizations.' },
        
        // Major communities
        { x: 20, y: 30, size: 6, type: 'community', name: 'North America', description: 'Home to vibrant African diaspora communities.' },
        { x: 80, y: 40, size: 6, type: 'community', name: 'South America', description: 'Rich Afro-Latin cultures and traditions.' },
        { x: 30, y: 70, size: 6, type: 'community', name: 'Caribbean', description: 'Islands with deep African roots and heritage.' },
        { x: 70, y: 20, size: 6, type: 'community', name: 'Europe', description: 'African communities contributing to European culture.' },
        { x: 85, y: 75, size: 6, type: 'community', name: 'Australia', description: 'Growing African diaspora in the Pacific.' },
        
        // Diaspora settlements
        { x: 15, y: 45, size: 4, type: 'diaspora', name: 'Brazil', description: 'Largest African population outside Africa.' },
        { x: 25, y: 35, size: 4, type: 'diaspora', name: 'United States', description: 'Rich African American history and culture.' },
        { x: 35, y: 65, size: 4, type: 'diaspora', name: 'Jamaica', description: 'Center of Caribbean African culture.' },
        { x: 65, y: 25, size: 4, type: 'diaspora', name: 'United Kingdom', description: 'Historical and contemporary African connections.' },
        { x: 75, y: 65, size: 4, type: 'diaspora', name: 'India', description: 'Ancient African presence in South Asia.' },
        { x: 90, y: 50, size: 4, type: 'diaspora', name: 'Canada', description: 'Growing African Canadian communities.' }
    ];
    
    // Create stars
    stars.forEach(star => {
        const starElement = document.createElement('div');
        starElement.className = `star-point ${star.type}-star`;
        starElement.style.left = `${star.x}%`;
        starElement.style.top = `${star.y}%`;
        starElement.style.width = `${star.size}px`;
        starElement.style.height = `${star.size}px`;
        
        // Color based on type
        switch(star.type) {
            case 'origin':
                starElement.style.background = '#ffd700';
                starElement.style.boxShadow = '0 0 15px #ffd700';
                break;
            case 'community':
                starElement.style.background = '#50c878';
                starElement.style.boxShadow = '0 0 10px #50c878';
                break;
            case 'diaspora':
                starElement.style.background = '#8b5cf6';
                starElement.style.boxShadow = '0 0 8px #8b5cf6';
                break;
        }
        
        // Add tooltip
        starElement.setAttribute('title', star.name);
        starElement.setAttribute('data-description', star.description);
        
        // Click event
        starElement.addEventListener('click', () => {
            showStarInfo(star);
        });
        
        // Hover effects
        starElement.addEventListener('mouseenter', () => {
            starElement.style.transform = 'scale(2)';
            starElement.style.zIndex = '10';
        });
        
        starElement.addEventListener('mouseleave', () => {
            starElement.style.transform = 'scale(1)';
            starElement.style.zIndex = '1';
        });
        
        starmapViz.appendChild(starElement);
    });
    
    // Create connection lines
    const connections = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 0, to: 3 },
        { from: 0, to: 4 },
        { from: 0, to: 5 },
        { from: 0, to: 6 },
        { from: 0, to: 7 }
    ];
    
    connections.forEach(conn => {
        const fromStar = stars[conn.from];
        const toStar = stars[conn.to];
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        // Calculate line position and rotation
        const dx = toStar.x - fromStar.x;
        const dy = toStar.y - fromStar.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        line.style.left = `${fromStar.x}%`;
        line.style.top = `${fromStar.y}%`;
        line.style.width = `${length}%`;
        line.style.height = '2px';
        line.style.background = 'linear-gradient(90deg, rgba(212, 175, 55, 0.5), transparent)';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 0';
        
        starmapViz.appendChild(line);
    });
    
    // Star info display
    const locationTitle = document.querySelector('.location-title');
    const locationDescription = document.querySelector('.location-description');
    
    function showStarInfo(star) {
        if (locationTitle) locationTitle.textContent = star.name;
        if (locationDescription) locationDescription.textContent = star.description;
        
        // Add animation
        if (locationTitle) {
            locationTitle.style.animation = 'none';
            setTimeout(() => {
                locationTitle.style.animation = 'fadeSlideUp 0.5s ease forwards';
            }, 10);
        }
    }
}

/* ============================================
   GRIOT NARRATION
   ============================================ */

function initGriotNarration() {
    const narrationLines = document.querySelectorAll('.narration-line');
    
    if (narrationLines.length === 0) return;
    
    // Use Intersection Observer for scroll-triggered animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const line = entry.target;
                const delay = parseInt(line.getAttribute('data-line')) * 300;
                
                setTimeout(() => {
                    line.classList.add('revealed');
                }, delay);
                
                observer.unobserve(line);
            }
        });
    }, { threshold: 0.5 });
    
    narrationLines.forEach(line => {
        observer.observe(line);
    });
    
    // Griot figure hover effect
    const griotFigure = document.querySelector('.griot-full-figure');
    const griotAura = document.querySelector('.griot-aura');
    
    if (griotFigure && griotAura) {
        griotFigure.addEventListener('mouseenter', () => {
            griotAura.style.opacity = '0.8';
            griotAura.style.transform = 'translate(-50%, -50%) scale(1.2)';
        });
        
        griotFigure.addEventListener('mouseleave', () => {
            griotAura.style.opacity = '0.3';
            griotAura.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initScrollAnimations() {
    // Generic fade-in animation for elements
    const fadeElements = document.querySelectorAll('.section-header, .artifact-card, .voice-card, .origin-card, .timeline-event, .starmap-sidebar, .griot-container');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });
    
    // Parallax effect for textile patterns
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        document.querySelectorAll('.section-textile-bg').forEach(bg => {
            const speed = 0.3;
            bg.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/* ============================================
   STAT COUNTERS
   ============================================ */

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                const duration = 2000; // ms
                const steps = 60;
                const stepTime = duration / steps;
                const increment = countTo / steps;
                
                let currentCount = 0;
                
                const counter = setInterval(() => {
                    currentCount += increment;
                    target.textContent = Math.floor(currentCount);
                    
                    if (currentCount >= countTo) {
                        target.textContent = countTo;
                        clearInterval(counter);
                    }
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add global animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeSlideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .star-point {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .connection-line {
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }
    
    .connection-line:hover {
        opacity: 1;
    }
    
    .timeline-event {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .timeline-event.visible {
        opacity: 1;
        transform: translateX(0);
    }
`;
document.head.appendChild(style);