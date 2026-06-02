// scripts.js - Archive of the Unknowable

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================================
    // SANITY METER
    // ============================================
    const sanityFill = document.getElementById('sanityFill');
    const sanityPercentage = document.getElementById('sanityPercentage');
    let sanity = 100;
    const maxSanity = 100;

    function updateSanity(amount) {
        sanity = Math.max(0, Math.min(maxSanity, sanity + amount));
        const percentage = Math.round((sanity / maxSanity) * 100);
        sanityFill.style.width = percentage + '%';
        sanityPercentage.textContent = percentage + '%';

        // Change color based on sanity level
        if (percentage > 66) {
            sanityFill.style.background = 'linear-gradient(90deg, #2d5a27, #3d7a37)';
        } else if (percentage > 33) {
            sanityFill.style.background = 'linear-gradient(90deg, #5a4a1a, #8a6a2a)';
        } else {
            sanityFill.style.background = 'linear-gradient(90deg, #5a1a1a, #8a2a2a)';
        }

        // Trigger visual effects at low sanity
        if (percentage < 30) {
            document.body.classList.add('low-sanity');
        } else {
            document.body.classList.remove('low-sanity');
        }
    }

    // Scroll-based sanity degradation
    let lastScrollY = window.scrollY;
    let scrollSanityTimer = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        if (scrollDelta > 50 && sanity > 0) {
            scrollSanityTimer += scrollDelta;
            if (scrollSanityTimer > 200) {
                updateSanity(-1);
                scrollSanityTimer = 0;
            }
        }
        lastScrollY = currentScrollY;
    });

    // ============================================
    // NAVIGATION
    // ============================================
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.archive-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;
            
            // Update active states
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === targetSection) {
                    s.classList.add('active');
                    // Small sanity cost for switching sections
                    updateSanity(-0.5);
                }
            });
        });
    });

    // ============================================
    // CORRUPTIBLE TEXT
    // ============================================
    const corruptibleElements = document.querySelectorAll('.corruptible');

    corruptibleElements.forEach(el => {
        const originalText = el.dataset.original || el.textContent;
        el.dataset.original = originalText;

        el.addEventListener('mouseenter', () => {
            if (Math.random() > 0.4) {
                el.classList.add('corrupted');
                // Corrupt the text
                const corrupted = corruptText(originalText);
                el.textContent = corrupted;
                updateSanity(-0.5);
            }
        });

        el.addEventListener('mouseleave', () => {
            setTimeout(() => {
                el.classList.remove('corrupted');
                el.textContent = originalText;
            }, 500);
        });
    });

    function corruptText(text) {
        const corruptionChars = '█▓▒░▀▄▐▌●◆◇◈◎►◄▲▼←→↑↓↔↕▪▫■□▬▲▼◆●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥';
        let corrupted = '';
        for (let i = 0; i < text.length; i++) {
            if (Math.random() > 0.7) {
                corrupted += corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
            } else if (Math.random() > 0.8) {
                corrupted += String.fromCharCode(text.charCodeAt(i) + (Math.random() > 0.5 ? 1 : -1));
            } else {
                corrupted += text[i];
            }
        }
        return corrupted;
    }

    // ============================================
    // STAR CHART CANVAS
    // ============================================
    const canvas = document.getElementById('starCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let constellations = [];
        let animationId;

        function initStars() {
            stars = [];
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random(),
                    twinkleSpeed: Math.random() * 0.02 + 0.01,
                    twinkleOffset: Math.random() * Math.PI * 2
                });
            }

            // Create some constellations
            constellations = [
                [0, 1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12, 13, 14],
                [15, 16, 17],
                [18, 19, 20, 21]
            ];
        }

        function drawStars(time) {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw constellations
            ctx.strokeStyle = 'rgba(45, 90, 39, 0.15)';
            ctx.lineWidth = 0.5;
            constellations.forEach(constellation => {
                ctx.beginPath();
                constellation.forEach((starIndex, i) => {
                    const star = stars[starIndex];
                    if (star) {
                        if (i === 0) {
                            ctx.moveTo(star.x, star.y);
                        } else {
                            ctx.lineTo(star.x, star.y);
                        }
                    }
                });
                ctx.stroke();
            });

            // Draw stars
            stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
                const alpha = star.brightness * twinkle;
                
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
                ctx.fill();

                // Glow effect for brighter stars
                if (star.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(45, 90, 39, ${alpha * 0.1})`;
                    ctx.fill();
                }
            });

            // Draw some "dead" stars (red giants)
            for (let i = 0; i < 5; i++) {
                const star = stars[Math.floor(Math.random() * stars.length)];
                if (star) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(90, 26, 26, 0.1)`;
                    ctx.fill();
                }
            }
        }

        function animateStarChart(time) {
            drawStars(time);
            animationId = requestAnimationFrame(animateStarChart);
        }

        initStars();
        animateStarChart(0);

        // Resize handling
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight * 0.75;
            initStars();
        });
    }

    // ============================================
    // FORBIDDEN SEARCH
    // ============================================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const searchWarning = document.getElementById('searchWarning');
    let searchCount = 0;

    const forbiddenResults = [
        { title: 'The Whisperer in Darkness', content: 'Accessing... ████████ CORRUPTED. The being communicates through radio waves. It knows you are reading this.', danger: 'WARNING: BEING AWARE' },
        { title: 'The Shadow Over Innsmouth', content: 'Records indicate deep ones breeding with humans. Your ancestry may be ████████.', danger: 'CLASSIFIED: ESOTERIC' },
        { title: 'The Dunwich Horror', content: 'A being of impossible size was born to a mortal woman. It could not be seen by human eyes, only its ████████.', danger: 'REALITY BREACH' },
        { title: 'The Call of Cthulhu', content: 'The great old one stirs in R\'lyeh. The stars are right. The ████████ cult grows.', danger: 'IMMINENT AWAKENING' },
        { title: 'The Colour Out of Space', content: 'A meteorite brought something that consumed all life. The area still ████████ to this day.', danger: 'CONTAMINATION ZONE' },
        { title: 'The Haunter of the Dark', content: 'The creature feeds on light. It has been watching you since you started reading. Turn back now.', danger: 'YOU ARE BEING WATCHED' },
        { title: 'The Dreams in the Witch House', content: 'Witchcraft operates through non-Euclidean geometry. Your dreams are ████████.', danger: 'DREAM INVASION' },
        { title: 'The Shadow Out of Time', content: 'The great race of Yith can swap consciousness through time. One of them may be ████████ you.', danger: 'IDENTITY THEFT' }
    ];

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        searchCount++;
        
        // Sanity cost for searching
        updateSanity(-2);

        // Increasingly disturbing warnings
        const warnings = [
            'The archive is aware of your query.',
            'Something in the archive moved when you searched.',
            'You should not have searched for that.',
            'The archive is now aware of you.',
            'It knows your name. It knows where you live.',
            'There is no escape. The knowledge has found you.',
            'You have been marked. The outer gods have taken interest.',
            'Your sanity is now a resource they will harvest.',
            'The boundaries between worlds are thinning because of you.',
            'You have opened a door that cannot be closed.'
        ];

        const warningIndex = Math.min(searchCount - 1, warnings.length - 1);
        searchWarning.textContent = warnings[warningIndex];
        searchWarning.style.color = searchCount > 3 ? '#8a2a2a' : '#555';

        // Generate results
        let resultsHtml = '';
        const numResults = Math.min(2 + Math.floor(searchCount / 2), forbiddenResults.length);

        for (let i = 0; i < numResults; i++) {
            const result = forbiddenResults[i];
            const corruptionLevel = Math.min(searchCount, 5);
            let content = result.content;
            
            // Increase corruption with each search
            for (let c = 0; c < corruptionLevel; c++) {
                const words = content.split(' ');
                const wordIndex = Math.floor(Math.random() * words.length);
                words[wordIndex] = corruptText(words[wordIndex]);
                content = words.join(' ');
            }

            resultsHtml += `
                <div class="search-result-item" style="animation-delay: ${i * 0.1}s">
                    <h4>${result.title}</h4>
                    <p>${content}</p>
                    <span class="result-danger">${result.danger}</span>
                </div>
            `;
        }

        searchResults.innerHTML = resultsHtml;

        // Trigger visual corruption
        const overlay = document.getElementById('corruptionOverlay');
        overlay.classList.add('active');
        setTimeout(() => overlay.classList.remove('active'), 2000);

        // Aggressive sanity drain for repeated searches
        if (searchCount > 3) {
            updateSanity(-5);
        }
        if (searchCount > 6) {
            updateSanity(-10);
        }

        // Random screen shake at high search counts
        if (searchCount > 4) {
            document.body.style.animation = 'screenShake 0.1s ease';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 100);
        }
    }

    // ============================================
    // MOUSE CORRUPTION OVERLAY
    // ============================================
    const corruptionOverlay = document.getElementById('corruptionOverlay');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        corruptionOverlay.style.setProperty('--mouse-x', x + '%');
        corruptionOverlay.style.setProperty('--mouse-y', y + '%');
    });

    // ============================================
    // TENTACLE BORDER ANIMATIONS
    // ============================================
    function createTentacleBorders() {
        const tentacleContainers = document.querySelectorAll('.nav-tentacles, .footer-tentacles');
        
        tentacleContainers.forEach(container => {
            for (let i = 0; i < 8; i++) {
                const tentacle = document.createElement('div');
                tentacle.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: ${(i / 8) * 100}%;
                    width: 2px;
                    height: ${Math.random() * 20 + 10}px;
                    background: linear-gradient(to top, 
                        rgba(45, 90, 39, 0.3),
                        transparent
                    );
                    animation: tentacleWave ${Math.random() * 3 + 2}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    transform-origin: bottom;
                `;
                container.appendChild(tentacle);
            }
        });
    }

    // Add tentacle wave animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes tentacleWave {
            0%, 100% { transform: scaleY(1) translateX(0); }
            25% { transform: scaleY(1.5) translateX(5px) rotate(5deg); }
            50% { transform: scaleY(0.8) translateX(-5px) rotate(-3deg); }
            75% { transform: scaleY(1.3) translateX(3px) rotate(2deg); }
        }
        
        @keyframes screenShake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-2px, 1px); }
            50% { transform: translate(2px, -1px); }
            75% { transform: translate(-1px, 2px); }
        }

        .low-sanity .archive-title {
            animation: titleGlitch 0.5s infinite !important;
        }

        .low-sanity .text-card {
            border-color: var(--accent-red) !important;
        }

        .low-sanity .corruptible {
            animation: corruptText 0.2s infinite !important;
        }
    `;
    document.head.appendChild(styleSheet);

    createTentacleBorders();

    // ============================================
    // TEXT CARD CORRUPTION ON HOVER
    // ============================================
    const textCards = document.querySelectorAll('.text-card');
    
    textCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const corruptibles = card.querySelectorAll('.corruptible');
            corruptibles.forEach((el, index) => {
                setTimeout(() => {
                    if (Math.random() > 0.6) {
                        el.classList.add('corrupted');
                        el.textContent = corruptText(el.dataset.original);
                        updateSanity(-0.3);
                    }
                }, index * 100);
            });
        });

        card.addEventListener('mouseleave', () => {
            const corruptibles = card.querySelectorAll('.corrupted');
            corruptibles.forEach(el => {
                setTimeout(() => {
                    el.classList.remove('corrupted');
                    el.textContent = el.dataset.original;
                }, 300);
            });
        });
    });

    // ============================================
    // RANDOM AMBIENT EFFECTS
    // ============================================
    function randomAmbientEffect() {
        const effects = [
            () => {
                // Random text corruption
                const elements = document.querySelectorAll('.corruptible');
                const randomEl = elements[Math.floor(Math.random() * elements.length)];
                if (randomEl) {
                    randomEl.classList.add('corrupted');
                    randomEl.textContent = corruptText(randomEl.dataset.original);
                    setTimeout(() => {
                        randomEl.classList.remove('corrupted');
                        randomEl.textContent = randomEl.dataset.original;
                    }, 1000);
                }
            },
            () => {
                // Screen flicker
                const overlay = document.getElementById('corruptionOverlay');
                overlay.style.opacity = '0.3';
                setTimeout(() => {
                    overlay.style.opacity = '0';
                }, 100);
            },
            () => {
                // Random sanity drain
                if (Math.random() > 0.7) {
                    updateSanity(-1);
                }
            }
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
    }

    // Run ambient effects periodically
    setInterval(randomAmbientEffect, 8000);

    // ============================================
    // INITIAL STATE
    // ============================================
    // Start with full sanity
    updateSanity(0);

    console.log('%c⚠ THE ARCHIVE IS WATCHING ⚠', 'color: #2d5a27; font-size: 24px; font-weight: bold;');
    console.log('%cYou have accessed forbidden knowledge. The archivists have noted your presence.', 'color: #555; font-style: italic;');
    console.log('%cThere is no going back.', 'color: #5a1a1a; font-weight: bold;');
});