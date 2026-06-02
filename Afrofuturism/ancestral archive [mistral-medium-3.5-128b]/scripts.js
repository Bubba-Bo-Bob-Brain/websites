// ===== DOM Elements =====
const adinkraSymbols = document.querySelectorAll('.adinkra-symbol');
const sections = document.querySelectorAll('section');
const heroArtifact = document.getElementById('hero-artifact');
const hologram = document.getElementById('current-artifact');
const artifactModel = document.getElementById('artifact-3d');
const artifactTitle = document.getElementById('artifact-title');
const artifactDesc = document.getElementById('artifact-desc');
const thumbnails = document.querySelectorAll('.thumbnail');
const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const starMapCanvas = document.getElementById('star-map');
const toggleConstellationsBtn = document.getElementById('toggle-constellations');
const animateStarsBtn = document.getElementById('animate-stars');
const playNarrationBtn = document.getElementById('play-narration');
const audioWaveform = document.getElementById('audio-waveform');
const audioProgress = document.getElementById('audio-progress');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const griotText = document.getElementById('griot-text');
const revealMoreBtn = document.getElementById('reveal-more');
const prevEraBtn = document.getElementById('prev-era');
const nextEraBtn = document.getElementById('next-era');
const timelineItems = document.querySelectorAll('.timeline-item');
const constellationLabels = document.querySelectorAll('.constellation-labels .label');

// ===== State Variables =====
let currentSection = 'home';
let isPlaying = false;
let currentAudio = null;
let audioContext = null;
let analyser = null;
let dataArray = null;
let animationId = null;
let stars = [];
let isAnimatingStars = false;
let rotationY = 0;
let zoomLevel = 1;
let currentEraIndex = 2; // Start at Medieval Kingdoms
let currentTextIndex = 0;
let isRevealingText = false;

// ===== Artifact Data =====
const artifacts = {
    'bronze-head': {
        title: 'Benin Bronze Head',
        desc: 'A 16th-century royal portrait from the Edo Kingdom, cast in bronze using the lost-wax technique. These heads were used to honor ancestors and kings.',
        era: '1500-1600 CE',
        origin: 'Benin City, Nigeria',
        model: 'bronze'
    },
    'dogon-mask': {
        title: 'Dogon Mask',
        desc: 'Used in rituals by the Dogon people of Mali, these masks represent ancestral spirits and are worn during dances to honor the dead.',
        era: '19th-20th Century',
        origin: 'Bandiagara, Mali',
        model: 'wood'
    },
    'ashanti-gold': {
        title: 'Ashanti Gold Weight',
        desc: 'Small gold weights used by the Ashanti people of Ghana to measure gold dust, which was their currency. Each weight has a unique proverb or symbol.',
        era: '1700-1900 CE',
        origin: 'Ashanti Kingdom, Ghana',
        model: 'gold'
    },
    'nok-terracotta': {
        title: 'Nok Terracotta Head',
        desc: 'One of the earliest known sculptures in sub-Saharan Africa, created by the Nok culture. These terracotta figures are believed to represent ancestors or deities.',
        era: '500 BCE - 200 CE',
        origin: 'Nok, Nigeria',
        model: 'clay'
    }
};

// ===== Audio Data (Simulated) =====
const narrationAudio = {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
    duration: 120 // 2 minutes in seconds
};

// ===== Initialize =====
function init() {
    setupAdinkraNavigation();
    setupHolographicArtifact();
    setupStarMap();
    setupGriotNarration();
    setupTimeline();
    setupScrollEffects();
    setupHeroArtifactAnimation();
}

// ===== Adinkra Symbol Navigation =====
function setupAdinkraNavigation() {
    adinkraSymbols.forEach(symbol => {
        symbol.addEventListener('click', () => {
            const targetSection = symbol.getAttribute('data-section');
            scrollToSection(targetSection);
        });
    });

    // Highlight active symbol on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
                updateActiveSymbol();
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        currentSection = sectionId;
        updateActiveSymbol();
    }
}

function updateActiveSymbol() {
    adinkraSymbols.forEach(symbol => {
        const symbolSection = symbol.getAttribute('data-section');
        if (symbolSection === currentSection) {
            symbol.style.background = 'var(--gold-primary)';
            symbol.querySelector('.symbol-icon').style.color = 'var(--ebony)';
        } else {
            symbol.style.background = 'var(--glass-bg)';
            symbol.querySelector('.symbol-icon').style.color = 'var(--gold-light)';
        }
    });
}

// ===== Holographic Artifact Viewer =====
function setupHolographicArtifact() {
    // Set initial artifact
    switchArtifact('bronze-head');

    // Thumbnail click handlers
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const artifactId = thumbnail.getAttribute('data-artifact');
            switchArtifact(artifactId);
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
    });

    // Rotation controls
    rotateLeftBtn.addEventListener('click', () => {
        rotationY -= 45;
        hologram.style.transform = `rotateY(${rotationY}deg) scale(${zoomLevel})`;
    });

    rotateRightBtn.addEventListener('click', () => {
        rotationY += 45;
        hologram.style.transform = `rotateY(${rotationY}deg) scale(${zoomLevel})`;
    });

    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.2, 2);
        hologram.style.transform = `rotateY(${rotationY}deg) scale(${zoomLevel})`;
    });

    zoomOutBtn.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
        hologram.style.transform = `rotateY(${rotationY}deg) scale(${zoomLevel})`;
    });

    // Pause rotation on hover
    hologram.addEventListener('mouseenter', () => {
        hologram.classList.add('paused');
    });

    hologram.addEventListener('mouseleave', () => {
        hologram.classList.remove('paused');
    });
}

function switchArtifact(artifactId) {
    const artifact = artifacts[artifactId];
    artifactTitle.textContent = artifact.title;
    artifactDesc.textContent = artifact.desc;
    document.querySelector('.artifact-meta .era').textContent = artifact.era;
    document.querySelector('.artifact-meta .origin').textContent = artifact.origin;

    // Update artifact model appearance based on type
    switch (artifact.model) {
        case 'bronze':
            artifactModel.style.background = 'linear-gradient(135deg, #CD7F32, #8B4513)';
            break;
        case 'wood':
            artifactModel.style.background = 'linear-gradient(135deg, #8B4513, #5D4037)';
            break;
        case 'gold':
            artifactModel.style.background = 'linear-gradient(135deg, #FFD700, #D4AF37)';
            break;
        case 'clay':
            artifactModel.style.background = 'linear-gradient(135deg, #8B4513, #A0522D)';
            break;
        default:
            artifactModel.style.background = 'linear-gradient(135deg, #D4AF37, #8B4513)';
    }
}

// ===== Cosmic Star Map =====
function setupStarMap() {
    const ctx = starMapCanvas.getContext('2d');
    starMapCanvas.width = starMapCanvas.offsetWidth;
    starMapCanvas.height = starMapCanvas.offsetHeight;

    // Generate random stars
    generateStars(ctx);

    // Toggle constellation labels
    toggleConstellationsBtn.addEventListener('click', () => {
        constellationLabels.forEach(label => {
            label.classList.toggle('visible');
        });
    });

    // Animate stars
    animateStarsBtn.addEventListener('click', () => {
        isAnimatingStars = !isAnimatingStars;
        if (isAnimatingStars) {
            animateStarsBtn.textContent = 'Stop Animation';
            animateStars(ctx);
        } else {
            animateStarsBtn.textContent = 'Animate Stars';
            cancelAnimationFrame(animationId);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        starMapCanvas.width = starMapCanvas.offsetWidth;
        starMapCanvas.height = starMapCanvas.offsetHeight;
        generateStars(ctx);
    });
}

function generateStars(ctx) {
    stars = [];
    const starCount = 200;
    const centerX = starMapCanvas.width / 2;
    const centerY = starMapCanvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;

    for (let i = 0; i < starCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.8 + 0.2;
        const color = `rgba(212, 175, 55, ${opacity})`;

        stars.push({ x, y, size, color });
    }

    drawStars(ctx);
}

function drawStars(ctx) {
    ctx.clearRect(0, 0, starMapCanvas.width, starMapCanvas.height);

    // Draw background
    const gradient = ctx.createRadialGradient(
        starMapCanvas.width / 2,
        starMapCanvas.height / 2,
        0,
        starMapCanvas.width / 2,
        starMapCanvas.height / 2,
        Math.min(starMapCanvas.width, starMapCanvas.height) / 2
    );
    gradient.addColorStop(0, '#1A120B');
    gradient.addColorStop(1, '#0A2463');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, starMapCanvas.width, starMapCanvas.height);

    // Draw stars
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
    });

    // Draw constellations (static lines)
    drawConstellations(ctx);
}

function drawConstellations(ctx) {
    const centerX = starMapCanvas.width / 2;
    const centerY = starMapCanvas.height / 2;

    // Orion (Osiris)
    ctx.beginPath();
    ctx.moveTo(centerX - 100, centerY - 50);
    ctx.lineTo(centerX - 50, centerY - 100);
    ctx.lineTo(centerX, centerY - 50);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.stroke();

    // Sirius (Sopdet) - single bright star
    ctx.beginPath();
    ctx.arc(centerX + 150, centerY - 100, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 175, 55, 1)';
    ctx.fill();

    // Pleiades (Subaru)
    for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const x = centerX - 100 + Math.cos(angle) * 20;
        const y = centerY + 100 + Math.sin(angle) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
        ctx.fill();
    }

    // Leo (Sekhmet)
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY + 50);
    ctx.lineTo(centerX - 150, centerY + 100);
    ctx.lineTo(centerX - 100, centerY + 50);
    ctx.lineTo(centerX - 150, centerY);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.stroke();
}

function animateStars(ctx) {
    const centerX = starMapCanvas.width / 2;
    const centerY = starMapCanvas.height / 2;

    stars.forEach(star => {
        // Move stars in a circular pattern
        const angle = Math.atan2(star.y - centerY, star.x - centerX);
        star.x = centerX + Math.cos(angle + 0.01) * Math.sqrt(Math.pow(star.x - centerX, 2) + Math.pow(star.y - centerY, 2));
        star.y = centerY + Math.sin(angle + 0.01) * Math.sqrt(Math.pow(star.x - centerX, 2) + Math.pow(star.y - centerY, 2));

        // Twinkle effect
        star.color = `rgba(212, 175, 55, ${0.2 + Math.random() * 0.6})`;
    });

    drawStars(ctx);
    animationId = requestAnimationFrame(() => animateStars(ctx));
}

// ===== Griot Narration =====
function setupGriotNarration() {
    // Simulate audio (in a real app, this would be an actual audio file)
    currentAudio = {
        currentTime: 0,
        duration: narrationAudio.duration,
        play: () => {
            if (isPlaying) return;
            isPlaying = true;
            playNarrationBtn.textContent = '❚❚';
            startAudioPlayback();
        },
        pause: () => {
            if (!isPlaying) return;
            isPlaying = false;
            playNarrationBtn.textContent = '▶';
            stopAudioPlayback();
        }
    };

    // Play/Pause button
    playNarrationBtn.addEventListener('click', () => {
        if (isPlaying) {
            currentAudio.pause();
        } else {
            currentAudio.play();
        }
    });

    // Reveal more text
    revealMoreBtn.addEventListener('click', () => {
        if (isRevealingText) return;
        isRevealingText = true;
        revealNextText();
    });

    // Initialize audio visualization
    setupAudioVisualization();
}

function startAudioPlayback() {
    // Simulate audio playback
    const updateProgress = () => {
        if (!isPlaying) return;

        currentAudio.currentTime += 0.1;
        if (currentAudio.currentTime >= currentAudio.duration) {
            currentAudio.currentTime = 0;
            currentAudio.pause();
            return;
        }

        updateAudioDisplay();
        animationId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
}

function stopAudioPlayback() {
    cancelAnimationFrame(animationId);
}

function updateAudioDisplay() {
    // Update progress bar
    const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
    audioProgress.style.width = `${progressPercent}%`;

    // Update time displays
    currentTimeDisplay.textContent = formatTime(currentAudio.currentTime);
    durationDisplay.textContent = formatTime(currentAudio.duration);

    // Animate waveform
    animateWaveform();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function animateWaveform() {
    // Simulate waveform animation
    const bars = 20;
    let waveformHTML = '';
    for (let i = 0; i < bars; i++) {
        const height = 5 + Math.random() * 20;
        waveformHTML += `<div style="height: ${height}px; width: 4px; background: var(--gold-light); margin: 0 1px; border-radius: 2px;"></div>`;
    }
    audioWaveform.innerHTML = waveformHTML;
}

function setupAudioVisualization() {
    // In a real app, you would use the Web Audio API
    // This is a simplified simulation
    audioWaveform.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.style.height = '5px';
        bar.style.width = '4px';
        bar.style.background = 'var(--gold-light)';
        bar.style.margin = '0 1px';
        bar.style.borderRadius = '2px';
        audioWaveform.appendChild(bar);
    }
}

function revealNextText() {
    const hiddenSpans = griotText.querySelectorAll('.hidden');
    if (currentTextIndex < hiddenSpans.length) {
        hiddenSpans[currentTextIndex].classList.add('visible');
        currentTextIndex++;
        setTimeout(() => {
            isRevealingText = false;
        }, 1000);
    } else {
        revealMoreBtn.textContent = 'All Revealed';
        isRevealingText = false;
    }
}

// ===== Timeline Navigation =====
function setupTimeline() {
    // Set initial active era
    updateTimelineEra();

    // Previous era button
    prevEraBtn.addEventListener('click', () => {
        currentEraIndex = Math.max(0, currentEraIndex - 1);
        updateTimelineEra();
    });

    // Next era button
    nextEraBtn.addEventListener('click', () => {
        currentEraIndex = Math.min(timelineItems.length - 1, currentEraIndex + 1);
        updateTimelineEra();
    });

    // Click on timeline items
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentEraIndex = index;
            updateTimelineEra();
        });
    });
}

function updateTimelineEra() {
    timelineItems.forEach((item, index) => {
        if (index === currentEraIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Scroll to the active item
    timelineItems[currentEraIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}

// ===== Scroll Effects =====
function setupScrollEffects() {
    // Parallax effect for textile backgrounds
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.textile-bg').forEach(bg => {
            bg.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    });

    // Fade in sections as they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(section);
    });
}

// ===== Hero Artifact Animation =====
function setupHeroArtifactAnimation() {
    // Animate the hero artifact
    let angle = 0;
    const animate = () => {
        angle += 0.01;
        heroArtifact.style.background = `
            linear-gradient(${angle * 10}deg,
                rgba(212, 175, 55, 0.2),
                rgba(74, 20, 140, 0.2)
            )
        `;
        animationId = requestAnimationFrame(animate);
    };
    animate();
}

// ===== Initialize the App =====
document.addEventListener('DOMContentLoaded', init);