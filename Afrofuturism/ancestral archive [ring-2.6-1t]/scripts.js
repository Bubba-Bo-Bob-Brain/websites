// ============================================================
// AETHERA - Digital Museum of African Heritage & Cosmic Archives
// Main JavaScript: scripts.js
// ============================================================

(function () {
    'use strict';

    // ==================== UTILITY FUNCTIONS ====================
    function $(selector, parent) {
        return (parent || document).querySelector(selector);
    }
    function $$(selector, parent) {
        return Array.from((parent || document).querySelectorAll(selector));
    }
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }
    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // ==================== LOADING SCREEN ====================
    const loadingScreen = $('#loading-screen');
    const loadingBar = $('#loading-bar');
    let loadProgress = 0;

    function simulateLoading() {
        const interval = setInterval(function () {
            loadProgress += Math.random() * 8 + 2;
            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(interval);
                setTimeout(hideLoadingScreen, 600);
            }
            loadingBar.style.width = loadProgress + '%';
        }, 150);
    }

    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        initMainExperience();
    }

    // ==================== CUSTOM CURSOR ====================
    const cursorGlow = $('#cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX = lerp(cursorX, mouseX, 0.08);
        cursorY = lerp(cursorY, mouseY, 0.08);
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }

    // ==================== MAIN NAVIGATION ====================
    const mainNav = $('#main-nav');
    const navLinks = $$('.nav-link');
    const sections = $$('.gallery-section, .hero-section');
    let currentSection = 'home';

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        let activeId = 'home';

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;
            if (scrollY >= top && scrollY < top + height) {
                activeId = id;
            }
        });

        if (activeId !== currentSection) {
            currentSection = activeId;
            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.dataset.section === activeId ||
                    (activeId === 'home' && link.dataset.section === 'home'));
            });
        }

        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==================== SCROLL REVEAL ====================
    const revealElements = $$('.reveal, .section-header, .artifact-card, .oral-card, .timeline-event, .cosmic-story');

    function setupScrollReveal() {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(function (el) { observer.observe(el); });
    }

    // ==================== HERO SECTION ====================
    let heroParticles = [];
    const heroCanvas = document.createElement('canvas');
    const heroStarsContainer = $('.hero-stars');
    let heroCtx = null;

    function initHeroCanvas() {
        const heroSection = $('.hero-section');
        if (!heroSection) return;
        heroCanvas.width = heroSection.offsetWidth;
        heroCanvas.height = heroSection.offsetHeight;
        heroCanvas.style.position = 'absolute';
        heroCanvas.style.inset = '0';
        heroCanvas.style.zIndex = '0';
        heroCanvas.style.pointerEvents = 'none';
        heroSection.insertBefore(heroCanvas, heroStarsContainer);
        heroCtx = heroCanvas.getContext('2d');

        for (let i = 0; i < 120; i++) {
            heroParticles.push({
                x: Math.random() * heroCanvas.width,
                y: Math.random() * heroCanvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                color: Math.random() > 0.8 ? '255, 215, 0' : '255, 255, 255'
            });
        }
    }

    function animateHeroParticles() {
        if (!heroCtx) return;
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        heroParticles.forEach(function (p) {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = heroCanvas.width;
            if (p.x > heroCanvas.width) p.x = 0;
            if (p.y < 0) p.y = heroCanvas.height;
            if (p.y > heroCanvas.height) p.y = 0;

            heroCtx.beginPath();
            heroCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            heroCtx.fillStyle = 'rgba(' + p.color + ', ' + p.opacity + ')';
            heroCtx.fill();

            heroCtx.beginPath();
            heroCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            heroCtx.fillStyle = 'rgba(' + p.color + ', ' + (p.opacity * 0.1) + ')';
            heroCtx.fill();
        });

        requestAnimationFrame(animateHeroParticles);
    }

    // ==================== ARTIFACT GALLERY ====================
    const filterBtns = $$('.filter-btn');
    const artifactCards = $$('.artifact-card');
    const artifactDetailPanel = $('#artifact-detail');
    const detailContent = $('#detail-content');
    const detailCloseBtn = $('#detail-close');

    const artifactData = {
        '001': {
            title: 'Golden Stool of Unity',
            era: 'Ashanti Empire, c. 1695 CE',
            fullDesc: 'The legendary Sika Dwa Kofi — the Golden Stool — is the most sacred symbol of the Ashanti people. According to tradition, it descended from the heavens in a cloud of white dust and landed upon a blanket, signifying divine endorsement of Osei Tutu I as the first Asantehene. The stool is believed to house the soul of the Ashanti nation itself. Made of pure gold, adorned with bells that warn of danger, it has never touched the ground and can never touch the ground. It rests upon its own blanket, perpetually hovering above the earth.',
            details: { 'Material': 'Pure Gold', 'Dimensions': '24 x 18 x 12 in', 'Location': 'Kumasi Fort', 'Status': 'Sacred - Not on Public Display' }
        },
        '002': {
            title: "Anansi's Story Weaving Loom",
            era: 'Akan Oral Tradition, Pre-1400 CE',
            fullDesc: 'In Akan mythology, Anansi the Spider is the keeper of all stories. This symbolic loom represents his divine gift — the ability to weave narratives into the very fabric of reality. Each thread represents a story, and the patterns created form the moral and ethical framework of Akan society. The loom is said to still exist, hidden in the branches of a great silk-cotton tree, waiting for the next worthy storyteller to find it.',
            details: { 'Origin': 'Bono State, Ghana', 'Material': 'Silk & Gold Thread', 'Stories Woven': 'Infinite', 'Guardian': 'Anansi' }
        },
        '003': {
            title: 'Timbuktu Manuscript Fragment',
            era: 'Mali Empire, c. 1450 CE',
            fullDesc: 'This fragment is one of hundreds of thousands of manuscripts preserved in the libraries of Timbuktu. Written in Ajami script, it contains astronomical calculations that demonstrate the advanced mathematical knowledge of West African scholars. The University of Sankore attracted students from across the Islamic world and beyond, making Timbuktu one of the greatest intellectual centers of the medieval era.',
            details: { 'Script': 'Ajami (Arabic-based)', 'Subject': 'Astronomical Mathematics', 'Institution': 'University of Sankore', 'Catalog': 'MS-TIM-1450-003' }
        },
        '004': {
            title: 'Kebra Nagast Illuminated Copy',
            era: 'Ethiopian Empire, c. 1600 CE',
            fullDesc: 'The Kebra Nagast ("Glory of Kings") is a 14th-century Ethiopian text that traces the Solomonic dynasty back to King Solomon and the Queen of Sheba. This illuminated copy features stunning miniature paintings and gold leaf decorations. The text is not merely historical — it is a theological charter legitimizing Ethiopian imperial rule and connecting Ethiopian Christianity to its Old Testament roots.',
            details: { 'Language': 'Ge\'ez', 'Pages': '227 illuminated folios', 'Medium': 'Gold leaf, natural pigments on vellum', 'Location': 'National Archives, Addis Ababa' }
        },
        '005': {
            title: 'Quantum Djembe Interface',
            era: 'Neo-Accra Collective, 2247 CE',
            fullDesc: 'This futuristic artifact merges ancient West African drumming traditions with quantum computing. The djembe\'s goatskin membrane has been replaced with a quantum-entangled neural mesh that responds to the drummer\'s neural patterns. Each rhythm played generates unique quantum states that can be decoded as computational instructions, effectively making music a programming language.',
            details: { 'Creator': 'Kwame Adjei-Boateng', 'Material': 'Neural Mesh & Quantum Crystal', 'Function': 'Musical-Quantum Computing Interface', 'Epoch': 'Post-Singularity African Renaissance' }
        },
        '006': {
            title: 'Eternal Ancestor Mask',
            era: 'Yoruba Future Guild, 2389 CE',
            fullDesc: 'This bioluminescent mask represents the pinnacle of Yoruba artistic and technological evolution. Embedded with neural-recording crystals, it captures the facial data, voice patterns, and personality matrices of up to twelve generations of ancestors. When worn, the mask interfaces with the wearer\'s neural implant, allowing direct communion with holographic ancestor avatars in real time.',
            details: { 'Crafted by': 'Yoruba Future Guild, Ile-Ife Orbital', 'Material': 'Bioluminescent Polymer & Neural Crystal', 'Generations Stored': '12', 'Interface': 'Neural-Link Holographic Communion' }
        }
    };

    // Filter functionality
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.dataset.filter;

            artifactCards.forEach(function (card) {
                var epoch = card.dataset.epoch;
                var match = filter === 'all' || epoch === filter;
                if (match) {
                    card.style.display = '';
                    card.style.animation = 'card-reveal-anim 0.5s ease both';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    var cardKeyframes = document.createElement('style');
    cardKeyframes.textContent = '@keyframes card-reveal-anim { 0% { opacity: 0; transform: translateY(30px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }';
    document.head.appendChild(cardKeyframes);

    // Rotation and zoom controls
    var rotationStates = {};

    $$('.artifact-viewer').forEach(function (viewer) {
        var id = viewer.id;
        rotationStates[id] = { angle: 0, zoom: 1, autoRotate: true };

        var object3d = viewer.querySelector('.artifact-3d-object');
        if (!object3d) return;

        var rotCCW = viewer.querySelector('.rot-btn--ccw');
        var rotCW = viewer.querySelector('.rot-btn--cw');
        var zoomInBtn = viewer.querySelector('[data-action="zoom-in"]');
        var zoomOutBtn = viewer.querySelector('[data-action="zoom-out"]');

        function applyTransform() {
            object3d.style.transform = 'rotateY(' + rotationStates[id].angle + 'deg) rotateX(5deg) scale(' + rotationStates[id].zoom + ')';
        }

        if (rotCW) {
            rotCW.addEventListener('click', function () {
                rotationStates[id].autoRotate = false;
                rotationStates[id].angle += 45;
                object3d.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                applyTransform();
                setTimeout(function () { rotationStates[id].autoRotate = true; }, 2000);
            });
        }

        if (rotCCW) {
            rotCCW.addEventListener('click', function () {
                rotationStates[id].autoRotate = false;
                rotationStates[id].angle -= 45;
                object3d.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                applyTransform();
                setTimeout(function () { rotationStates[id].autoRotate = true; }, 2000);
            });
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', function () {
                rotationStates[id].zoom = Math.min(rotationStates[id].zoom + 0.2, 2);
                object3d.style.transition = 'transform 0.4s ease';
                applyTransform();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', function () {
                rotationStates[id].zoom = Math.max(rotationStates[id].zoom - 0.2, 0.5);
                object3d.style.transition = 'transform 0.4s ease';
                applyTransform();
            });
        }

        var card = viewer.closest('.artifact-card');
        if (card) {
            card.addEventListener('click', function (e) {
                if (e.target.closest('.rot-btn') || e.target.closest('.zoom-btn')) return;
                var artifactId = card.dataset.artifactId;
                openArtifactDetail(artifactId);
            });
        }
    });

    function openArtifactDetail(id) {
        var data = artifactData[id];
        if (!data) return;

        var detailsHtml = '';
        if (data.details) {
            detailsHtml = '<div class="detail-meta"><table>';
            for (var key in data.details) {
                if (data.details.hasOwnProperty(key)) {
                    detailsHtml += '<tr><td class="detail-meta__key">' + key + '</td><td>' + data.details[key] + '</td></tr>';
                }
            }
            detailsHtml += '</table></div>';
        }

        detailContent.innerHTML =
            '<div class="detail-3d-preview">' +
            '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">' +
            '<span style="font-size:4rem;color:var(--color-gold);opacity:0.3;">&#x2299;</span>' +
            '</div></div>' +
            '<h3>' + data.title + '</h3>' +
            '<div class="detail-era">' + data.era + '</div>' +
            '<p>' + data.fullDesc + '</p>' + detailsHtml;

        artifactDetailPanel.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    detailCloseBtn.addEventListener('click', function () {
        artifactDetailPanel.classList.remove('visible');
        document.body.style.overflow = '';
    });

    artifactDetailPanel.addEventListener('click', function (e) {
        if (e.target === artifactDetailPanel) {
            artifactDetailPanel.classList.remove('visible');
            document.body.style.overflow = '';
        }
    });

    // Auto-rotate 3D objects
    function autoRotateObjects() {
        $$('.artifact-3d-object').forEach(function (obj) {
            var viewer = obj.closest('.artifact-viewer');
            var id = viewer ? viewer.id : null;
            if (id && rotationStates[id] && rotationStates[id].autoRotate) {
                rotationStates[id].angle += 0.3;
                obj.style.transform = 'rotateY(' + rotationStates[id].angle + 'deg) rotateX(5deg) scale(' + rotationStates[id].zoom + ')';
            }
        });
        requestAnimationFrame(autoRotateObjects);
    }

    // ==================== ORAL HISTORIES / GRIOT SECTION ====================
    var playBtns = $$('.play-btn');
    var waveformCanvases = $$('.waveform-canvas');
    var griotTextEl = $('#griot-text');
    var griotCursor = $('#griot-cursor');
    var griotStartBtn = $('#griot-start-btn');
    var griotResetBtn = $('#griot-reset-btn');

    var waveformData = {};
    var currentlyPlaying = null;

    function initWaveforms() {
        waveformCanvases.forEach(function (canvas) {
            var storyId = canvas.dataset.story;
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            var ctx = canvas.getContext('2d');

            var peaks = [];
            for (var i = 0; i < 80; i++) {
                peaks.push(Math.random() * 0.8 + 0.2);
            }
            waveformData[storyId] = { peaks: peaks, ctx: ctx, canvas: canvas, isPlaying: false, animFrame: null };

            drawWaveform(storyId, 0);
        });
    }

    function drawWaveform(storyId, progress) {
        var data = waveformData[storyId];
        if (!data) return;

        var peaks = data.peaks;
        var ctx = data.ctx;
        var canvas = data.canvas;
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        var barWidth = w / peaks.length;

        peaks.forEach(function (peak, i) {
            var barHeight = peak * h * 0.8 * (0.5 + 0.5 * Math.sin(i * 0.3 + progress * 0.05));
            var x = i * barWidth;
            var y = (h - barHeight) / 2;

            var gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 152, 0, 0.3)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        });
    }

    function animateWaveform(storyId) {
        var data = waveformData[storyId];
        if (!data || !data.isPlaying) return;

        var progress = 0;
        function frame() {
            if (!data.isPlaying) return;
            progress++;
            drawWaveform(storyId, progress);
            data.animFrame = requestAnimationFrame(frame);
        }
        frame();
    }

    function stopWaveform(storyId) {
        var data = waveformData[storyId];
        if (!data) return;
        data.isPlaying = false;
        if (data.animFrame) cancelAnimationFrame(data.animFrame);
        drawWaveform(storyId, 0);
    }

    playBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var storyId = btn.dataset.story;

            if (currentlyPlaying && currentlyPlaying !== storyId) {
                var prevBtn = document.querySelector('.play-btn[data-story="' + currentlyPlaying + '"]');
                if (prevBtn) {
                    prevBtn.classList.remove('playing');
                    prevBtn.querySelector('.play-icon').textContent = String.fromCharCode(9654);
                    prevBtn.querySelector('.play-label').textContent = 'Listen';
                    stopWaveform(currentlyPlaying);
                }
            }

            if (currentlyPlaying === storyId) {
                btn.classList.remove('playing');
                btn.querySelector('.play-icon').textContent = String.fromCharCode(9654);
                btn.querySelector('.play-label').textContent = 'Listen';
                stopWaveform(storyId);
                currentlyPlaying = null;
            } else {
                btn.classList.add('playing');
                btn.querySelector('.play-icon').textContent = String.fromCharCode(9646);
                btn.querySelector('.play-label').textContent = 'Playing';
                waveformData[storyId].isPlaying = true;
                animateWaveform(storyId);
                currentlyPlaying = storyId;
            }
        });
    });

    // Griot narration - typewriter effect
    var griotTexts = [
        "Listen closely, child. Before the written word, there was the spoken word. Before the spoken word, there was the drum. And before the drum... there was the heartbeat of the Earth herself.",
        "The ancestors did not vanish. They transformed. They became the wind that bends the baobab, the river that carves the canyon, the star that lights the path home.",
        "Every kente pattern tells a story. Every adinkra symbol holds a philosophy. The cloth you see is not decoration — it is a language written in thread and time.",
        "We are the griots — the living libraries. As long as one voice remembers, the past is never truly gone. And as long as there are ears willing to listen, the future can be shaped by ancient wisdom.",
        "Look around you. This archive is not made of stone or paper. It is made of light, memory, and the unbreakable thread that connects every child of Africa to the first spark of creation."
    ];

    var griotIndex = 0;
    var griotCharIndex = 0;
    var griotActive = false;

    function typeGriotText() {
        if (!griotActive) return;

        if (griotIndex >= griotTexts.length) {
            griotActive = false;
            griotCursor.style.visibility = 'hidden';
            return;
        }

        var text = griotTexts[griotIndex];
        griotTextEl.textContent = text.substring(0, griotCharIndex);
        griotTextEl.classList.add('visible');
        griotCursor.style.visibility = 'visible';

        griotCharIndex++;

        if (griotCharIndex > text.length) {
            griotCharIndex = 0;
            griotIndex++;
            setTimeout(typeGriotText, 1500);
        } else {
            var delay = Math.random() * 30 + 20;
            setTimeout(typeGriotText, delay);
        }
    }

    griotStartBtn.addEventListener('click', function () {
        if (griotActive) return;
        griotActive = true;
        griotIndex = 0;
        griotCharIndex = 0;
        griotTextEl.textContent = '';
        griotCursor.style.visibility = 'visible';
        griotStartBtn.disabled = true;
        griotStartBtn.style.opacity = '0.5';
        typeGriotText();
    });

    griotResetBtn.addEventListener('click', function () {
        griotActive = false;
        griotIndex = 0;
        griotCharIndex = 0;
        griotTextEl.textContent = '';
        griotTextEl.classList.remove('visible');
        griotCursor.style.visibility = 'visible';
        griotStartBtn.disabled = false;
        griotStartBtn.style.opacity = '1';
    });

    // ==================== COSMIC ORIGIN STORIES ====================
    var cosmicStories = $$('.cosmic-story');
    var cosmicPrev = $('#cosmic-prev');
    var cosmicNext = $('#cosmic-next');
    var cosmicDotsContainer = $('#cosmic-dots');
    var cosmicProgressFill = $('#cosmic-progress-fill');
    var currentCosmicIndex = 0;
    var cosmicAutoPlay;

    // Create navigation dots
    cosmicStories.forEach(function (story, i) {
        var dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', function () { showCosmicStory(i); });
        cosmicDotsContainer.appendChild(dot);
    });

    function showCosmicStory(index) {
        cosmicStories.forEach(function (s) { s.classList.remove('active'); });
        cosmicStories[index].classList.add('active');

        var dots = $$('.cosmic-progress__dots .dot');
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === index);
        });

        currentCosmicIndex = index;
        updateCosmicProgress();
    }

    function updateCosmicProgress() {
        var percentage = (currentCosmicIndex / (cosmicStories.length - 1)) * 100;
        cosmicProgressFill.style.width = percentage + '%';
    }

    cosmicNext.addEventListener('click', function () {
        var next = (currentCosmicIndex + 1) % cosmicStories.length;
        showCosmicStory(next);
        resetCosmicAutoPlay();
    });

    cosmicPrev.addEventListener('click', function () {
        var prev = (currentCosmicIndex - 1 + cosmicStories.length) % cosmicStories.length;
        showCosmicStory(prev);
        resetCosmicAutoPlay();
    });

    function resetCosmicAutoPlay() {
        clearInterval(cosmicAutoPlay);
        cosmicAutoPlay = setInterval(function () {
            var next = (currentCosmicIndex + 1) % cosmicStories.length;
            showCosmicStory(next);
        }, 7000);
    }

    cosmicAutoPlay = setInterval(function () {
        var next = (currentCosmicIndex + 1) % cosmicStories.length;
        showCosmicStory(next);
    }, 7000);

    // ==================== COSMIC STARS BACKGROUND ====================
    function initCosmicStars() {
        var container = $('#cosmic-stars');
        if (!container) return;

        for (var i = 0; i < 200; i++) {
            var star = document.createElement('div');
            var size = Math.random() * 2.5 + 0.5;
            var animDur = randomRange(2, 6);
            var animDelay = randomRange(0, 4);
            var twinkleType = i % 3;
            star.style.cssText =
                'position:absolute;' +
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'background:' + (Math.random() > 0.8 ? 'rgba(255,215,0,0.8)' : 'rgba(255,255,255,0.6)') + ';' +
                'border-radius:50%;' +
                'top:' + (Math.random() * 100) + '%;' +
                'left:' + (Math.random() * 100) + '%;' +
                'box-shadow:0 0 ' + (Math.random() * 4 + 2) + 'px currentColor;' +
                'animation:twinkle-' + twinkleType + ' ' + animDur + 's ease-in-out infinite ' + animDelay + 's;';
            container.appendChild(star);
        }

        var twinkleStyles = document.createElement('style');
        twinkleStyles.textContent =
            '@keyframes twinkle-0 { 0%,100%{opacity:0.3;} 50%{opacity:1;} }' +
            '@keyframes twinkle-1 { 0%,100%{opacity:0.5;} 50%{opacity:0.2;} }' +
            '@keyframes twinkle-2 { 0%,100%{opacity:0.4;} 30%{opacity:1;} 70%{opacity:0.3;} }';
        document.head.appendChild(twinkleStyles);
    }

    // ==================== TIMELINE ====================
    var timelineEvents = $$('.timeline-event');
    var timelinePrev = $('#timeline-prev');
    var timelineNext = $('#timeline-next');
    var timelineZoomIn = $('#timeline-zoom-in');
    var timelineZoomOut = $('#timeline-zoom-out');
    var timelineAxis = $('#timeline-axis');
    var timelineZoom = 1;

    function highlightTimelineEvent() {
        var containerRect = document.querySelector('.timeline-container').getBoundingClientRect();
        var containerCenter = containerRect.top + containerRect.height / 2;

        var closest = 0;
        var closestDist = Infinity;

        timelineEvents.forEach(function (event, i) {
            var rect = event.getBoundingClientRect();
            var dist = Math.abs(rect.top + rect.height / 2 - containerCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });

        timelineEvents.forEach(function (event, i) {
            event.style.opacity = i === closest ? '1' : '0.4';
            event.style.transform = i === closest ? 'scale(1)' : 'scale(0.95)';
            event.style.transition = 'all 0.5s ease';
        });
    }

    timelineNext.addEventListener('click', function () {
        var section = document.querySelector('.timeline-section');
        var current = Math.round(window.scrollY);
        var containerBottom = section.offsetHeight + section.offsetTop;
        window.scrollTo({ top: Math.min(current + 400, containerBottom), behavior: 'smooth' });
    });

    timelinePrev.addEventListener('click', function () {
        var section = document.querySelector('.timeline-section');
        var current = Math.round(window.scrollY);
        var sectionTop = section.offsetTop;
        window.scrollTo({ top: Math.max(current - 400, sectionTop), behavior: 'smooth' });
    });

    timelineZoomIn.addEventListener('click', function () {
        timelineZoom = Math.min(timelineZoom + 0.2, 2);
        timelineAxis.style.transform = 'translateX(-50%) scaleY(' + timelineZoom + ')';
    });

    timelineZoomOut.addEventListener('click', function () {
        timelineZoom = Math.max(timelineZoom - 0.2, 0.5);
        timelineAxis.style.transform = 'translateX(-50%) scaleY(' + timelineZoom + ')';
    });

    // ==================== DIASPORA STAR MAP ====================
    function hexToRgba(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    function initStarMap() {
        var viewport = document.getElementById('starmap-canvas');
        if (!viewport) return;

        var canvas = document.createElement('canvas');
        canvas.width = viewport.offsetWidth || 1200;
        canvas.height = viewport.offsetHeight || 500;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        viewport.appendChild(canvas);

        var ctx = canvas.getContext('2d');

        var starNodes = [
            { x: 0.12, y: 0.45, name: 'Ethiopia', type: 'origin', desc: 'Cradle of Humanity' },
            { x: 0.20, y: 0.35, name: 'Kemet (Egypt)', type: 'origin', desc: 'Land of the Pharaohs' },
            { x: 0.25, y: 0.55, name: 'Nubia', type: 'origin', desc: 'Kingdom of Kush' },
            { x: 0.30, y: 0.30, name: 'Timbuktu', type: 'hub', desc: 'Center of Learning' },
            { x: 0.35, y: 0.60, name: 'Great Zimbabwe', type: 'hub', desc: 'Stone City of Gold' },
            { x: 0.50, y: 0.50, name: 'Gulf of Guinea', type: 'forced', desc: 'Middle Passage' },
            { x: 0.28, y: 0.15, name: 'North Africa', type: 'hub', desc: 'Mediterranean Diaspora' },
            { x: 0.60, y: 0.20, name: 'Brazil', type: 'diaspora', desc: 'Largest African Diaspora' },
            { x: 0.65, y: 0.35, name: 'Caribbean', type: 'diaspora', desc: 'African Heritage Islands' },
            { x: 0.70, y: 0.50, name: 'USA', type: 'diaspora', desc: 'African American Heritage' },
            { x: 0.75, y: 0.30, name: 'UK', type: 'diaspora', desc: 'Windrush Generation' },
            { x: 0.80, y: 0.55, name: 'Haiti', type: 'diaspora', desc: 'First Black Republic' },
            { x: 0.85, y: 0.20, name: 'Luna Colony', type: 'future', desc: 'Selenic Settlement Alpha' },
            { x: 0.90, y: 0.65, name: 'Mars Arcadia', type: 'future', desc: 'Red Planet Cultural Hub' },
            { x: 0.50, y: 0.80, name: 'Orbital Baobab', type: 'future', desc: 'Space Station Heritage Center' }
        ];

        var starNodeColors = {
            origin: '#FFD700',
            hub: '#4FC3F7',
            forced: '#E91E63',
            diaspora: '#69F0AE',
            future: '#CE93D8'
        };

        var isDragging = false;
        var mapOffsetX = 0;
        var mapOffsetY = 0;
        var hoveredNode = null;
        var frame = 0;

        function drawStarMap() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Cosmic dust gradient
            var dustGrad = ctx.createRadialGradient(
                canvas.width * 0.4, canvas.height * 0.5, 0,
                canvas.width * 0.4, canvas.height * 0.5, canvas.width * 0.6
            );
            dustGrad.addColorStop(0, 'rgba(224, 64, 251, 0.05)');
            dustGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = dustGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Constellation lines
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 10]);
            for (var i = 0; i < starNodes.length; i++) {
                for (var j = i + 1; j < starNodes.length; j++) {
                    var dx = starNodes[i].x - starNodes[j].x;
                    var dy = starNodes[i].y - starNodes[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 0.25) {
                        ctx.beginPath();
                        ctx.moveTo(
                            starNodes[i].x * canvas.width + mapOffsetX,
                            starNodes[i].y * canvas.height + mapOffsetY
                        );
                        ctx.lineTo(
                            starNodes[j].x * canvas.width + mapOffsetX,
                            starNodes[j].y * canvas.height + mapOffsetY
                        );
                        ctx.stroke();
                    }
                }
            }
            ctx.setLineDash([]);

            // Draw star nodes
            starNodes.forEach(function (node) {
                var px = node.x * canvas.width + mapOffsetX;
                var py = node.y * canvas.height + mapOffsetY;
                var color = starNodeColors[node.type] || '#FFF';

                // Glow
                var glowGrad = ctx.createRadialGradient(px, py, 0, px, py, 25);
                var rgbaColor = hexToRgba(color, 0.4);
                glowGrad.addColorStop(0, rgbaColor);
                glowGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = glowGrad;
                ctx.beginPath();
                ctx.arc(px, py, 25, 0, Math.PI * 2);
                ctx.fill();

                // Star dot
                var radius = (node === hoveredNode) ? 7 : 5;
                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Label
                if (node === hoveredNode || (px > 50 && px < canvas.width - 100)) {
                    ctx.font = '11px Raleway, sans-serif';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.name, px, py - 14);
                }
            });

            // "You Are Here" marker
            var hereX = canvas.width * 0.15 + mapOffsetX;
            var hereY = canvas.height * 0.5 + mapOffsetY;
            ctx.beginPath();
            ctx.arc(hereX, hereY, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.font = '10px Raleway, sans-serif';
            ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center';
            ctx.fillText('YOU ARE HERE', hereX, hereY + 20);

            // Hover tooltip
            var overlay = document.getElementById('starmap-overlay');
            if (hoveredNode) {
                overlay.innerHTML =
                    '<div style="position:absolute;left:' + (hoveredNode.x * 100) + '%;top:' + (hoveredNode.y * 100) + '%;transform:translate(-50%,-110%);background:rgba(10,10,15,0.95);border:1px solid rgba(255,215,0,0.5);padding:12px 16px;border-radius:4px;white-space:nowrap;font-family:Raleway,sans-serif;font-size:0.8rem;color:#E8E0D0;box-shadow:0 0 20px rgba(255,215,0,0.2);">' +
                    '<div style="color:#FFD700;font-weight:600;margin-bottom:4px;">' + hoveredNode.name + '</div>' +
                    '<div style="color:#B0A898;">' + hoveredNode.desc + '</div>' +
                    '</div>';
            } else {
                overlay.innerHTML = '';
            }
        }

        // Mouse interaction
        viewport.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            var mx = (e.clientX - rect.left) / rect.width;
            var my = (e.clientY - rect.top) / rect.height;

            hoveredNode = null;
            starNodes.forEach(function (node) {
                var dist = Math.sqrt(Math.pow(node.x - mx, 2) + Math.pow(node.y - my, 2));
                if (dist < 0.04) hoveredNode = node;
            });

            if (isDragging) {
                mapOffsetX += e.movementX;
                mapOffsetY += e.movementY;
            }

            viewport.style.cursor = hoveredNode ? 'pointer' : 'grab';
        });

        viewport.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragOffsetX = e.clientX - mapOffsetX;
            dragOffsetY = e.clientY - mapOffsetY;
        });

        viewport.addEventListener('mouseup', function () { isDragging = false; });
        viewport.addEventListener('mouseleave', function () {
            isDragging = false;
            hoveredNode = null;
        });

        // Touch support
        viewport.addEventListener('touchstart', function (e) {
            isDragging = true;
            var touch = e.touches[0];
            dragOffsetX = touch.clientX - mapOffsetX;
            dragOffsetY = touch.clientY - mapOffsetY;
        }, { passive: true });

        viewport.addEventListener('touchmove', function (e) {
            if (isDragging) {
                var touch = e.touches[0];
                mapOffsetX = touch.clientX - dragOffsetX;
                mapOffsetY = touch.clientY - dragOffsetY;
            }
        }, { passive: true });

        viewport.addEventListener('touchend', function () { isDragging = false; });

        // Animation loop
        function animateMap() {
            frame++;
            drawStarMap();
            requestAnimationFrame(animateMap);
        }
        animateMap();
    }

    // ==================== AMBIENT AUDIO TOGGLE ====================
    var ambientToggle = $('#ambient-toggle');
    var ambientPlaying = false;
    var audioCtx = null;
    var oscillators = null;
    var gainNode = null;

    ambientToggle.addEventListener('click', function () {
        ambientPlaying = !ambientPlaying;
        ambientToggle.classList.toggle('active', ambientPlaying);

        if (ambientPlaying) {
            playAmbient();
        } else {
            stopAmbient();
        }
    });

    function playAmbient() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.08;
            gainNode.connect(audioCtx.destination);

            var osc1 = audioCtx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.value = 55;
            var gain1 = audioCtx.createGain();
            gain1.gain.value = 0;
            osc1.connect(gain1);
            gain1.connect(gainNode);
            osc1.start();
            gain1.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 2);

            var osc2 = audioCtx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 82.5;
            var gain2 = audioCtx.createGain();
            gain2.gain.value = 0;
            osc2.connect(gain2);
            gain2.connect(gainNode);
            osc2.start();
            gain2.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 2);

            var osc3 = audioCtx.createOscillator();
            osc3.type = 'sine';
            osc3.frequency.value = 110;
            var gain3 = audioCtx.createGain();
            gain3.gain.value = 0;
            osc3.connect(gain3);
            gain3.connect(gainNode);
            osc3.start();
            gain3.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 2);

            oscillators = [osc1, osc2, osc3];
        } catch (e) {
            console.log('Web Audio API is not supported in this browser');
        }
    }

    function stopAmbient() {
        if (oscillators) {
            oscillators.forEach(function (o) {
                try { o.stop(); } catch (e) {}
            });
            oscillators = null;
        }
        if (audioCtx) {
            try { audioCtx.close(); } catch (e) {}
            audioCtx = null;
        }
    }

    // ==================== THEME TOGGLE ====================
    var themeToggle = $('#theme-toggle');
    var isLightTheme = false;

    themeToggle.addEventListener('click', function () {
        isLightTheme = !isLightTheme;
        document.body.classList.toggle('light-theme', isLightTheme);
        themeToggle.querySelector('.theme-icon').textContent = isLightTheme ? String.fromCharCode(9691) : String.fromCharCode(9690);
    });

    // ==================== BACK TO TOP ====================
    var backToTopBtn = $('#back-to-top');

    window.addEventListener('scroll', function () {
        backToTopBtn.classList.toggle('visible', window.scrollY > 500);
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== PARALLAX & SECTION TRACKING ====================
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateActiveNav();
                highlightTimelineEvent();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ==================== INITIALIZATION ====================
    function initMainExperience() {
        animateCursor();
        initHeroCanvas();
        animateHeroParticles();
        initWaveforms();
        setupScrollReveal();
        initCosmicStars();
        initStarMap();
        updateActiveNav();

        // Show first cosmic story
        showCosmicStory(0);
    }

    // Start the loading simulation
    simulateLoading();

})();