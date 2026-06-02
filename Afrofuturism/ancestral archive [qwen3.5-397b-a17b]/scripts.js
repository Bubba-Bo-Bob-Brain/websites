/* =========================================
   SANKOFA ARCHIVE - INTERACTIVITY SCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOADING SEQUENCE ---
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    // Simulate data loading
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initAnimations();
        }, 800);
    }, 2000);

    // --- 2. CUSTOM CURSOR LOGIC ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Smooth follow effect
    setInterval(() => {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        
        cursor.style.left = posX - 4 + 'px'; // Center offset
        cursor.style.top = posY - 4 + 'px';
        
        follower.style.left = mouseX - 20 + 'px';
        follower.style.top = mouseY - 20 + 'px';
    }, 10);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hover effects for cursor
    const hoverables = document.querySelectorAll('a, button, .artifact-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'transparent';
            cursor.style.border = '1px solid var(--gold)';
            follower.style.transform = 'scale(0.5)';
            follower.style.borderColor = 'var(--gold)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--gold)';
            cursor.style.border = 'none';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = 'var(--gold)';
        });
    });

    // --- 3. ARTIFACT GALLERY LOGIC ---
    const artifacts = document.querySelectorAll('.artifact-card');
    const prevBtn = document.getElementById('prev-artifact');
    const nextBtn = document.getElementById('next-artifact');
    let currentArtifactIndex = 0;

    function updateGallery() {
        artifacts.forEach((art, index) => {
            if (index === currentArtifactIndex) {
                art.classList.add('active');
                art.style.display = 'block';
                // Reset animation
                art.style.animation = 'none';
                art.offsetHeight; /* trigger reflow */
                art.style.animation = 'float 4s ease-in-out infinite';
            } else {
                art.classList.remove('active');
                art.style.display = 'none';
            }
        });
    }

    // Initialize gallery state
    updateGallery();

    nextBtn.addEventListener('click', () => {
        currentArtifactIndex = (currentArtifactIndex + 1) % artifacts.length;
        updateGallery();
    });

    prevBtn.addEventListener('click', () => {
        currentArtifactIndex = (currentArtifactIndex - 1 + artifacts.length) % artifacts.length;
        updateGallery();
    });

    // 3D Tilt Effect on Artifacts
    artifacts.forEach(art => {
        art.addEventListener('mousemove', (e) => {
            const rect = art.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPct = x / rect.width - 0.5;
            const yPct = y / rect.height - 0.5;
            
            art.style.transform = `perspective(1000px) rotateY(${xPct * 20}deg) rotateX(${yPct * -20}deg) translateZ(20px)`;
        });

        art.addEventListener('mouseleave', () => {
            art.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
        });
    });

    // --- 4. GRIOT NARRATION & TEXT REVEAL ---
    const playBtn = document.getElementById('play-griot');
    const kineticTexts = document.querySelectorAll('.kinetic-text');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        const icon = playBtn.querySelector('path');
        
        if (isPlaying) {
            // Simulate Play State
            icon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); // Pause icon
            playBtn.style.borderColor = 'var(--gold)';
            playBtn.style.boxShadow = '0 0 20px var(--gold-glow)';
            
            // Reveal text sequentially
            kineticTexts.forEach((text, index) => {
                setTimeout(() => {
                    text.classList.add('active');
                }, index * 2000); // 2 seconds per paragraph
            });
        } else {
            // Simulate Pause State
            icon.setAttribute('d', 'M8 5v14l11-7z'); // Play icon
            playBtn.style.borderColor = 'var(--gold)';
            playBtn.style.boxShadow = 'none';
            kineticTexts.forEach(text => text.classList.remove('active'));
        }
    });

    // --- 5. SCROLL OBSERVER (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 1s ease-out';
        observer.observe(section);
    });

    // Add visible class styles dynamically or rely on CSS if pre-defined
    // Since we are in JS, let's add the style rule dynamically for the 'visible' state
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // --- 6. INITIALIZATION FUNCTION ---
    function initAnimations() {
        console.log("Sankofa Archive Systems Online.");
        // Trigger hero animation manually if needed
        const heroContent = document.querySelector('.hero-content');
        if(heroContent) {
            heroContent.style.opacity = '0';
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease';
                heroContent.style.opacity = '1';
            }, 100);
        }
    }

    // --- 7. SMOOTH SCROLL FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});