document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initNavigation();
    initGriotStory();
    initArtifactViewer();
    initDiasporaMap();
    initTimeline();
    initAudioPlayer();
    initScrollAnimations();
});

function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.gallery-section');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const audioToggle = document.querySelector('.audio-toggle');
    let audioPlaying = false;
    const audioWaves = document.querySelector('.audio-waves');

    audioToggle.addEventListener('click', () => {
        audioPlaying = !audioPlaying;
        audioToggle.classList.toggle('active', audioPlaying);
        if (audioPlaying) {
            audioWaves.style.animation = 'wave-pulse 0.5s ease-in-out infinite';
        } else {
            audioWaves.style.animation = 'wave-pulse 1s ease-in-out infinite';
        }
    });
}

function initGriotStory() {
    const revealBtn = document.querySelector('.reveal-btn');
    const hiddenParagraphs = document.querySelectorAll('.story-paragraph.hidden-text');
    let currentRevealIndex = 0;

    if (revealBtn) {
        revealBtn.addEventListener('click', () => {
            if (currentRevealIndex < hiddenParagraphs.length) {
                const paragraph = hiddenParagraphs[currentRevealIndex];
                paragraph.classList.add('revealed');
                currentRevealIndex++;

                if (currentRevealIndex >= hiddenParagraphs.length) {
                    revealBtn.querySelector('.btn-text').textContent = 'Story Complete';
                    revealBtn.querySelector('.btn-icon').innerHTML = 
                        '<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
                    revealBtn.style.pointerEvents = 'none';
                    revealBtn.style.opacity = '0.6';
                }
            }
        });
    }

    const words = document.querySelectorAll('.word');
    words.forEach(word => {
        word.addEventListener('mouseenter', () => {
            word.style.textShadow = '0 0 20px var(--gold)';
        });
        word.addEventListener('mouseleave', () => {
            word.style.textShadow = 'none';
        });
    });
}

function initArtifactViewer() {
    const artifactBtns = document.querySelectorAll('.artifact-btn');
    const artifactDisplay = document.getElementById('artifact-display');
    const rotationSlider = document.getElementById('artifact-rotation');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const zoomLevel = document.querySelector('.zoom-level');
    const lightBtns = document.querySelectorAll('.light-btn');
    const infoContent = document.getElementById('artifact-info');

    const artifactData = {
        mask: {
            title: 'Benin Bronze Mask',
            catalog: 'BA-1487-QUEEN',
            origin: 'Kingdom of Benin, Nigeria',
            period: '15th Century CE',
            material: 'Cast Bronze',
            dimensions: '52cm × 32cm × 18cm',
            description: 'This Queen Mother mask represents Idia, mother of Esigie, the Oba who ruled Benin in the early 16th century. The mask showcases the sophisticated bronze-casting techniques developed by Benin artisans, using the lost-wax method to create intricate details that honor the divine feminine power of the queen mother.',
            symbols: ['Idia', 'Royal Power', 'Divine Feminine']
        },
        head: {
            title: 'Ife Terracotta Head',
            catalog: 'IF-0892-PORTRAIT',
            origin: 'Ife, Nigeria',
            period: '12th Century CE',
            material: 'Terracotta',
            dimensions: '38cm × 24cm × 28cm',
            description: 'This remarkable portrait head from Ife demonstrates the extraordinary naturalism achieved by Yoruba sculptors nearly a millennium ago. The serene expression and lifelike proportions reflect the Yoruba belief that the head is the seat of destiny and the most important part of the human form.',
            symbols: ['Destiny', 'Yoruba Art', 'Naturalism']
        },
        statue: {
            title: 'Dogon Ancestor Figure',
            catalog: 'DG-0567-ANCESTOR',
            origin: 'Bandiagara Cliff, Mali',
            period: '14th Century CE',
            material: 'Wood',
            dimensions: '85cm × 18cm × 14cm',
            description: 'This ancestor figure represents the spiritual intermediaries between the living and the departed in Dogon cosmology. The raised arms gesture toward the heavens, symbolizing the connection between earth and sky, while the geometric simplification reflects Dogon philosophical concepts of primal creation.',
            symbols: ['Ancestral Wisdom', 'Sky-Earth Connection', 'Dogon Cosmology']
        },
        manuscript: {
            title: 'Timbuktu Manuscript',
            catalog: 'TM-2341-SCHOLAR',
            origin: 'Timbuktu, Mali',
            period: '13th Century CE',
            material: 'Ink on Parchment',
            dimensions: '42cm × 28cm × 2cm',
            description: 'This scholarly manuscript from Timbuktu contains astronomical calculations and mathematical proofs. Timbuktu was one of the world\'s great centers of learning, with scholars traveling from across Africa and the Middle East to study at its universities, preserving knowledge that spanned mathematics, astronomy, law, and medicine.',
            symbols: ['Scholarly Excellence', 'Astronomy', 'Islamic Heritage']
        }
    };

    let currentArtifact = 'mask';
    let currentZoom = 1;
    let currentRotation = 180;
    let currentLight = 'cyan';

    function updateArtifactDisplay() {
        const artifacts = artifactDisplay.querySelectorAll('[class*="artifact-"]');
        artifacts.forEach(artifact => {
            artifact.classList.remove('active');
        });
        const activeArtifact = artifactDisplay.querySelector(`.artifact-${currentArtifact}`);
        if (activeArtifact) {
            activeArtifact.classList.add('active');
        }
    }

    function updateArtifactInfo() {
        const data = artifactData[currentArtifact];
        if (data && infoContent) {
            infoContent.querySelector('.artifact-title').textContent = data.title;
            infoContent.querySelector('.artifact-catalog').textContent = data.catalog;
            const metaItems = infoContent.querySelectorAll('.meta-value');
            metaItems[0].textContent = data.origin;
            metaItems[1].textContent = data.period;
            metaItems[2].textContent = data.material;
            metaItems[3].textContent = data.dimensions;
            infoContent.querySelector('.info-description p').textContent = data.description;
            const badges = infoContent.querySelector('.symbol-badges');
            badges.innerHTML = data.symbols.map(s => `<span class="symbol-badge">${s}</span>`).join('');
        }
    }

    function updateHologramStyle() {
        const activeArtifact = artifactDisplay.querySelector('.active');
        if (activeArtifact) {
            activeArtifact.style.transform = `rotateY(${currentRotation}deg) scale(${currentZoom})`;
        }

        const baseGlow = document.querySelector('.base-glow');
        if (baseGlow) {
            const colorMap = {
                'cyan': 'rgba(0, 229, 229, 0.4)',
                'gold': 'rgba(212, 168, 71, 0.4)',
                'magenta': 'rgba(255, 42, 109, 0.4)'
            };
            baseGlow.style.background = `radial-gradient(ellipse, ${colorMap[currentLight]} 0%, transparent 70%)`;
        }
    }

    artifactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            artifactBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentArtifact = btn.dataset.artifact;
            updateArtifactDisplay();
            updateArtifactInfo();
            updateHologramStyle();
        });
    });

    if (rotationSlider) {
        rotationSlider.addEventListener('input', (e) => {
            currentRotation = e.target.value;
            updateHologramStyle();
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 2) {
                currentZoom = Math.min(2, currentZoom + 0.25);
                zoomLevel.textContent = currentZoom.toFixed(1) + 'x';
                updateHologramStyle();
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 0.5) {
                currentZoom = Math.max(0.5, currentZoom - 0.25);
                zoomLevel.textContent = currentZoom.toFixed(1) + 'x';
                updateHologramStyle();
            }
        });
    }

    lightBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lightBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLight = btn.dataset.light;
            updateHologramStyle();
        });
    });
}

function initDiasporaMap() {
    const diasporaPoints = document.querySelectorAll('.diaspora-point');
    const regionInfo = document.getElementById('region-info');

    const regionData = {
        'west-africa': {
            name: 'West Africa',
            desc: 'The departure point for millions during the transatlantic slave trade. Cultures including Akan, Yoruba, Igbo, Fon, and Kongo peoples were dispersed across the Americas.',
            displaced: '12M+',
            memory: '400+'
        },
        'central-africa': {
            name: 'Central Africa',
            desc: 'Kongo Kingdom and surrounding regions contributed significantly to the African presence in the Americas. Kongo religious and cultural traditions deeply influenced African-American spiritual practices.',
            displaced: '8M+',
            memory: '500+'
        },
        'east-africa': {
            name: 'East Africa',
            desc: 'Swahili coast civilizations maintained trade routes connecting Africa to Asia. Many East Africans were part of Indian Ocean trade networks, spreading cultural influences globally.',
            displaced: '3M+',
            memory: '1000+'
        },
        'americas-north': {
            name: 'North America',
            desc: 'African descendants in North America preserved ancestral traditions through spirituals, folklore, and craft traditions. These cultural practices became foundations for jazz, blues, and countless artistic innovations.',
            displaced: '4M+',
            memory: '400+'
        },
        'americas-caribbean': {
            name: 'Caribbean',
            desc: 'Caribbean islands became centers of African cultural preservation, where traditions like Yoruba religion, Akan naming practices, and Kongo spiritual systems survived and evolved.',
            displaced: '5M+',
            memory: '500+'
        },
        'americas-south': {
            name: 'South America',
            desc: 'Brazil received the largest number of Africans during the slave trade. Yoruba, Fon, and Bantu traditions profoundly shaped Brazilian culture, religion, and music.',
            displaced: '4.5M+',
            memory: '500+'
        },
        'europe': {
            name: 'Europe',
            desc: 'African presence in Europe dates to Roman times. Modern diaspora communities maintain connections to African heritage while contributing to European cultural life.',
            displaced: '2M+',
            memory: '2000+'
        },
        'asia': {
            name: 'Asia',
            desc: 'Ancient trade routes connected East Africa to India, China, and beyond. African communities in Asia maintained cultural traditions while adapting to local contexts.',
            displaced: '1M+',
            memory: '1000+'
        }
    };

    diasporaPoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            const region = point.dataset.region;
            if (regionData[region] && regionInfo) {
                regionInfo.querySelector('.region-name').textContent = regionData[region].name;
                regionInfo.querySelector('.region-desc').textContent = regionData[region].desc;
                const stats = regionInfo.querySelectorAll('.stat-value');
                stats[0].textContent = regionData[region].displaced;
                stats[1].textContent = regionData[region].memory;
            }
        });

        point.addEventListener('click', () => {
            const region = point.dataset.region;
            diasporaPoints.forEach(p => {
                p.style.transform = '';
                p.style.filter = '';
            });
            point.style.transform = 'scale(1.5)';
            point.style.filter = 'drop-shadow(0 0 30px currentColor)';
        });
    });

    const migrationPaths = document.querySelectorAll('.migration-path');
    migrationPaths.forEach((path, index) => {
        path.style.animationDelay = `${index * 0.5}s`;
    });
}

function initTimeline() {
    const eraDots = document.querySelectorAll('.era-dot');
    const prevBtn = document.querySelector('.timeline-nav.prev');
    const nextBtn = document.querySelector('.timeline-nav.next');
    const eras = document.querySelectorAll('.era');

    const eraOrder = ['past', 'classical', 'colonial', 'present', 'future'];
    let currentEraIndex = 0;

    function scrollToEra(index) {
        currentEraIndex = Math.max(0, Math.min(eraOrder.length - 1, index));
        const targetEra = document.querySelector(`.era-${eraOrder[currentEraIndex]}`);
        if (targetEra) {
            targetEra.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        updateEraDots();
    }

    function updateEraDots() {
        eraDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentEraIndex);
        });
    }

    eraDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToEra(index);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToEra(currentEraIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToEra(currentEraIndex + 1);
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const eraObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const eraClass = entry.target.classList[1];
                const eraName = eraClass.replace('era-', '');
                currentEraIndex = eraOrder.indexOf(eraName);
                updateEraDots();
            }
        });
    }, observerOptions);

    eras.forEach(era => eraObserver.observe(era));

    const speculativeEvents = document.querySelectorAll('.event.speculative');
    speculativeEvents.forEach(event => {
        event.style.opacity = '0.7';
        event.addEventListener('mouseenter', () => {
            event.style.opacity = '1';
            event.style.background = 'linear-gradient(135deg, rgba(0, 229, 229, 0.1), transparent)';
        });
        event.addEventListener('mouseleave', () => {
            event.style.opacity = '0.7';
            event.style.background = '';
        });
    });
}

function initAudioPlayer() {
    const listenBtns = document.querySelectorAll('.listen-btn');
    const playBtn = document.querySelector('.player-btn.play');
    const progressBar = document.querySelector('.progress-fill');
    const playerTitle = document.querySelector('.player-title');
    const playerDuration = document.querySelector('.player-duration');
    const visualizerBars = document.querySelectorAll('.bar');

    let isPlaying = false;
    let currentStory = null;
    let progressInterval = null;

    const storyData = {
        'creation': { title: 'The Creation of Mali - Mansa Kouyaté', duration: '12:34' },
        'migration': { title: 'The Great Migration - Mama Nzinga', duration: '18:45' },
        'resistance': { title: 'Songs of Resistance - Baba Fela', duration: '8:22' }
    };

    listenBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const griotCard = btn.closest('.griot-card');
            const storyId = griotCard.dataset.story;
            
            if (currentStory === storyId) {
                togglePlayPause();
            } else {
                currentStory = storyId;
                const story = storyData[storyId];
                if (playerTitle) playerTitle.textContent = story.title;
                if (playerDuration) playerDuration.textContent = '0:00 / ' + story.duration;
                startPlaying();
            }
        });
    });

    if (playBtn) {
        playBtn.addEventListener('click', togglePlayPause);
    }

    function togglePlayPause() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startPlaying();
        } else {
            pausePlaying();
        }
    }

    function startPlaying() {
        isPlaying = true;
        if (playBtn) {
            playBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
        }
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });

        let progress = 0;
        if (progressBar) {
            progress = parseFloat(progressBar.style.width) || 0;
        }
        
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (progress < 100) {
                progress += 0.5;
                if (progressBar) progressBar.style.width = progress + '%';
            } else {
                progress = 0;
                if (progressBar) progressBar.style.width = '0%';
            }
        }, 100);
    }

    function pausePlaying() {
        isPlaying = false;
        if (playBtn) {
            playBtn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>';
        }
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
        if (progressInterval) clearInterval(progressInterval);
    }
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-preamble, .deity-card, .griot-card, .event');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        scrollObserver.observe(el);
    });

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
    }

    const deityCards = document.querySelectorAll('.deity-card');
    deityCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const griotCards = document.querySelectorAll('.griot-card');
    griotCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    const events = document.querySelectorAll('.event');
    events.forEach((event, index) => {
        event.style.transitionDelay = `${index * 0.08}s`;
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroCosmos = document.querySelector('.hero-cosmos');
        if (heroCosmos) {
            heroCosmos.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        const starField = document.querySelector('.star-field');
        if (starField) {
            starField.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });

    const cosmicOrb = document.querySelector('.cosmic-orb');
    if (cosmicOrb) {
        let orbRotation = 0;
        function animateOrb() {
            orbRotation += 0.2;
            cosmicOrb.style.transform = `rotate(${orbRotation}deg)`;
            requestAnimationFrame(animateOrb);
        }
        animateOrb();
    }

    const sections = document.querySelectorAll('.gallery-section');
    const sectionPatterns = {
        'cosmic-origins': 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(212, 168, 71, 0.08) 0%, transparent 50%)',
        'artifacts': 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 229, 229, 0.05) 0%, transparent 50%)',
        'oral-histories': 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(255, 42, 109, 0.05) 0%, transparent 50%)',
        'diaspora-map': 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(212, 168, 71, 0.06) 0%, transparent 60%)',
        'timeline': 'linear-gradient(180deg, rgba(30, 58, 95, 0.08) 0%, transparent 30%)'
    };

    sections.forEach(section => {
        const sectionId = section.id;
        if (sectionPatterns[sectionId]) {
            section.style.backgroundImage = sectionPatterns[sectionId];
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('.adinkra-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
            }
        });
        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('.adinkra-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.letterSpacing = '0.15em';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.letterSpacing = '';
        });
    });

    const regionInfo = document.querySelector('.region-info');
    if (regionInfo) {
        regionInfo.style.transition = 'all 0.5s ease';
    }

    const sankofaSymbol = document.querySelector('.sankofa-symbol');
    if (sankofaSymbol) {
        sankofaSymbol.addEventListener('mouseenter', () => {
            sankofaSymbol.style.transform = 'scale(1.1) rotate(5deg)';
            sankofaSymbol.style.filter = 'drop-shadow(0 0 20px var(--gold))';
        });
        sankofaSymbol.addEventListener('mouseleave', () => {
            sankofaSymbol.style.transform = '';
            sankofaSymbol.style.filter = '';
        });
    }

    addDynamicParticleEffects();
}

function addDynamicParticleEffects() {
    const orbParticles = document.querySelector('.orb-particles');
    if (orbParticles) {
        setInterval(() => {
            const currentOpacity = orbParticles.style.opacity || 1;
            orbParticles.style.opacity = currentOpacity === '1' ? '0.7' : '1';
        }, 3000);
    }

    const hologramArtifact = document.querySelector('.hologram-artifact');
    if (hologramArtifact) {
        let glitchTimeout;
        artifactBtns = document.querySelectorAll('.artifact-btn');
        
        function triggerGlitch() {
            hologramArtifact.style.filter = 'brightness(1.3) contrast(1.1)';
            setTimeout(() => {
                hologramArtifact.style.filter = '';
            }, 50);
        }

        artifactBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                triggerGlitch();
            });
        });
    }

    const visualizerBars = document.querySelectorAll('.bar');
    visualizerBars.forEach((bar, index) => {
        const baseHeight = [20, 35, 50, 40, 55, 30, 45, 25, 50, 35, 40, 20][index];
        bar.style.height = baseHeight + 'px';
    });
}

const heroCta = document.querySelector('.hero-cta');
if (heroCta) {
    heroCta.style.opacity = '0';
    setTimeout(() => {
        heroCta.style.transition = 'opacity 1s ease';
        heroCta.style.opacity = '1';
    }, 1200);
}

const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        scrollIndicator.style.opacity = Math.max(0, 1 - scrollPercent * 3);
    });
}