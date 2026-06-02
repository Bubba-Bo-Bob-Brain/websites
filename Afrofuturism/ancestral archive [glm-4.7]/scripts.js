document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. COSMIC STAR MAP (Hero Background)
       ========================================= */
    const canvas = document.getElementById('starMap');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    
    // Configuration
    const starCount = 100;
    const connectionDistance = 120;
    const mouseDistance = 150;

    // Resize handling
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Star Class
    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Slow drift
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.9 ? '#D4AF37' : '#ffffff'; // Occasional gold star
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize Stars
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    // Animation Loop
    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections first (behind stars)
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${1 - dist / connectionDistance})`; // Gold connections
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animateStars);
    }
    animateStars();


    /* =========================================
       2. GRIOT NARRATION (Typewriter Effect)
       ========================================= */
    const griotElement = document.getElementById('griot-text');
    const phrases = [
        "Initializing memory banks... Tracing lineage from the first star dust to the digital beyond...",
        "We are the children of the cosmos, woven into the fabric of time.",
        "Listen closely, for the ancestors speak in the silence between the stars.",
        "The archive is eternal. The lineage is unbroken."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 50;

    function typeLoop() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            griotElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 30; // Faster deleting
        } else {
            griotElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 60 + Math.random() * 50; // Variable human typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(typeLoop, typeSpeed);
    }
    
    // Start typing
    setTimeout(typeLoop, 1000);


    /* =========================================
       3. HOLOGRAPHIC ARTIFACT CONTROLS
       ========================================= */
    const artifactContainer = document.querySelector('.artifact-model');
    const btnLeft = document.getElementById('btn-rotate-left');
    const btnRight = document.getElementById('btn-rotate-right');
    let rotationY = 0;

    function updateRotation() {
        artifactContainer.style.transform = `rotateY(${rotationY}deg)`;
    }

    btnLeft.addEventListener('click', () => {
        rotationY -= 45;
        updateRotation();
        triggerGlitch();
    });

    btnRight.addEventListener('click', () => {
        rotationY += 45;
        updateRotation();
        triggerGlitch();
    });

    // Visual glitch feedback on rotation
    function triggerGlitch() {
        artifactContainer.style.filter = "hue-rotate(90deg) blur(2px)";
        setTimeout(() => {
            artifactContainer.style.filter = "drop-shadow(0 0 15px var(--color-holo-cyan))";
        }, 150);
    }

    // Artifact Thumbnails (Simple simulation of swapping data)
    const thumbs = document.querySelectorAll('.artifact-thumb');
    const dataPoints = document.querySelectorAll('.data-point span');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all
            thumbs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            thumb.classList.add('active');
            
            // Randomize data to simulate scanning new object
            dataPoints[0].textContent = ["EDO KINGDOM", "KUSH EMPIRE", "GREAT ZIMBABWE", "MALI EMPIRE"][Math.floor(Math.random()*4)];
            dataPoints[1].textContent = [`${Math.floor(Math.random()*20)+10}TH CENTURY`, "3000 BC", "12TH CENTURY"][Math.floor(Math.random()*3)];
            
            // Spin the artifact briefly
            rotationY += 360;
            updateRotation();
        });
    });


    /* =========================================
       4. TIMELINE SCROLL REVEAL
       ========================================= */
    const timelineCards = document.querySelectorAll('.timeline-card');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    timelineCards.forEach(card => {
        timelineObserver.observe(card);
    });


    /* =========================================
       5. ORAL HISTORY VISUALIZER & PLAYER
       ========================================= */
    const playBtn = document.getElementById('playBtn');
    const vinyl = document.querySelector('.vinyl-record');
    const vCanvas = document.getElementById('audioVisualizer');
    const vCtx = vCanvas.getContext('2d');
    let isPlaying = false;
    let animationId;

    // Set canvas size
    function resizeVisualizer() {
        vCanvas.width = vCanvas.offsetWidth;
        vCanvas.height = vCanvas.offsetHeight;
    }
    resizeVisualizer();

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        togglePlayState();
    });

    function togglePlayState() {
        if (isPlaying) {
            vinyl.classList.add('spinning');
            playBtn.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'; // Pause Icon
            animateVisualizer();
            playTranscript();
        } else {
            vinyl.classList.remove('spinning');
            playBtn.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'; // Play Icon
            cancelAnimationFrame(animationId);
            vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
        }
    }

    // Simulate Audio Waveform
    function animateVisualizer() {
        if (!isPlaying) return;

        vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
        
        const bars = 50;
        const barWidth = vCanvas.width / bars;
        
        vCtx.fillStyle = '#00F0FF'; // Cyan
        
        for (let i = 0; i < bars; i++) {
            // Generate random height based on sine wave + noise for organic look
            const height = Math.random() * vCanvas.height * 0.8 * Math.sin(i * 0.1 + Date.now() * 0.005);
            const x = i * barWidth;
            const y = (vCanvas.height - height) / 2; // Center vertically
            
            vCtx.fillRect(x, y, barWidth - 2, Math.abs(height));
        }

        animationId = requestAnimationFrame(animateVisualizer);
    }

    // Transcript Reveal
    const transcriptElement = document.getElementById('transcript-text');
    const fullTranscript = "In the beginning, there was the word. And the word was rhythm. Before the stone, before the star, there was the beat. We carry the drum in our chests, a thunder that echoes across millennia. Listen... can you hear the ancestors calling your name?";
    let transcriptIndex = 0;

    function playTranscript() {
        if (!isPlaying || transcriptIndex >= fullTranscript.length) {
            // Reset if finished
            if (transcriptIndex >= fullTranscript.length) {
                transcriptIndex = 0;
                transcriptElement.textContent = "";
                if(isPlaying) setTimeout(playTranscript, 1000);
            }
            return;
        }
        
        transcriptElement.textContent += fullTranscript.charAt(transcriptIndex);
        transcriptIndex++;
        
        // Random typing speed for voice simulation
        setTimeout(playTranscript, Math.random() * 50 + 30);
    }


    /* =========================================
       6. NAVIGATION HIGHLIGHTING
       ========================================= */
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === current) {
                item.classList.add('active');
                // Optional: Change background pattern based on section
                updateBackgroundPattern(current);
            }
        });
    });

    function updateBackgroundPattern(sectionId) {
        const bg = document.getElementById('bg-pattern');
        // Slight opacity shifts to indicate "traveling" through time
        if (sectionId === 'artifacts') {
            bg.style.opacity = '0.05';
        } else if (sectionId === 'timeline') {
            bg.style.opacity = '0.12';
        } else {
            bg.style.opacity = '0.08';
        }
    }

});