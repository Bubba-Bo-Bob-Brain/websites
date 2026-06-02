/* =====================================================
AKWAMU — The Eternal Archive
Scripts.js
Interactive Functionality for Afrofuturist Digital Museum
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeCosmicCarousel();
    initializeHolographicViewer();
    initializeOraturePlayer();
    initializeStarMap();
    initializeTimeline();
    initializeScrollAnimations();
    initializeAmbientEffects();
});

/* =====================================================
NAVIGATION SYSTEM
===================================================== */
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.adinkra-btn');
    const sections = document.querySelectorAll('.gallery-section, .hero-section');
    const hero = document.getElementById('hero');
    
    hero.classList.add('active');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            
            if (targetSection === 'home' || targetSection === 'origins') {
                hero.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.getElementById(targetSection);
                if (target) {
                    target.classList.add('active');
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    document.querySelector('.hero-scroll-indicator')?.addEventListener('click', () => {
        const origins = document.getElementById('origins');
        if (origins) {
            origins.classList.add('active');
            hero.classList.remove('active');
            document.querySelector('[data-section="origins"]').classList.add('active');
            origins.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

/* =====================================================
COSMIC CAROUSEL - Origin Stories
===================================================== */
function initializeCosmicCarousel() {
    const carousel = document.getElementById('cosmic-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.cosmic-slide');
    const dots = document.querySelectorAll('.cosmic-dot');
    const prevBtn = document.querySelector('.cosmic-nav-btn.prev');
    const nextBtn = document.querySelector('.cosmic-nav-btn.next');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
        
        const activeSlide = slides[index];
        const godAvatar = activeSlide.querySelector('.cosmic-god-avatar');
        if (godAvatar) {
            godAvatar.style.animation = 'none';
            godAvatar.offsetHeight;
            godAvatar.style.animation = 'symbolFloat 6s ease-in-out infinite';
        }
    }
    
    function nextSlide() {
        showSlide((currentSlide + 1) % totalSlides);
    }
    
    function prevSlide() {
        showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }
    
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    document.addEventListener('keydown', (e) => {
        const originsSection = document.getElementById('origins');
        if (originsSection?.classList.contains('active')) {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        }
    });
    
    let autoAdvance = setInterval(nextSlide, 8000);
    carousel.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    carousel.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(nextSlide, 8000);
    });
    
    setTimeout(() => showSlide(0), 500);
}

/* =====================================================
HOLOGRAPHIC ARTIFACT VIEWER
===================================================== */
function initializeHolographicViewer() {
    const artifactViewer = document.getElementById('artifact-display');
    if (!artifactViewer) return;
    
    const rotateX = document.getElementById('rotate-x');
    const rotateY = document.getElementById('rotate-y');
    const rotateZ = document.getElementById('rotate-z');
    const zoomSlider = document.getElementById('zoom-slider');
    const autoRotateBtn = document.getElementById('auto-rotate');
    const artifactHologram = document.querySelector('.artifact-hologram');
    const thumbnails = document.querySelectorAll('.artifact-thumb');
    const artifactDescription = document.getElementById('artifact-description');
    
    let isAutoRotating = false;
    let autoRotateInterval;
    
    const artifactData = {
        obaa: {
            name: 'BENIN BRONZE — OBA',
            period: '15th Century CE',
            origin: 'Edo Kingdom, Nigeria',
            description: 'The golden <strong>Oba bronze plaques</strong> of Benin represent some of the finest metalwork in African history.',
            material: 'Bronze, Copper, Gold',
            technique: 'Lost-wax Casting',
            location: 'Dispersed (1897)'
        },
        akua: {
            name: "AKUA'S CHILD",
            period: '19th Century CE',
            origin: 'Akan, Ghana',
            description: "<strong>Akua's child</strong> fertility figures were commissioned by women who struggled with fertility.",
            material: 'Wood, Gold Leaf',
            technique: 'Carving',
            location: 'British Museum'
        },
        gourd: {
            name: 'SACRED CALABASH',
            period: '18th Century CE',
            origin: 'Yoruba, Nigeria',
            description: 'The <strong>calabash gourd</strong> was essential to Yoruba spiritual practice.',
            material: 'Gourd, Cowrie Shells',
            technique: 'Carving, Incising',
            location: 'Private Collection'
        },
        mask: {
            name: 'BAMILEKE CROWN MASK',
            period: '20th Century CE',
            origin: 'Bamileke, Cameroon',
            description: 'The <strong>ndop</strong> royal masks of the Bamileke were worn by the king during ceremonial dances.',
            material: 'Wood, Beads, Metal',
            technique: 'Carving, Beadwork',
            location: 'Cameroon National Museum'
        },
        staff: {
            name: 'OGUN IRON STAFF',
            period: '16th Century CE',
            origin: 'Yoruba, Nigeria',
            description: "The <strong>Ogun staff</strong> represents the Yoruba god of iron and war.",
            material: 'Iron, Bronze',
            technique: 'Forging',
            location: 'Dispersed'
        }
    };
    
    function updateTransform() {
        const x = rotateX.value;
        const y = rotateY.value;
        const z = rotateZ.value;
        const zoom = zoomSlider.value;
        
        if (artifactHologram) {
            artifactHologram.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) scale(${zoom})`;
        }
    }
    
    function updateArtifactInfo(key) {
        const data = artifactData[key];
        if (!data) return;
        
        const labels = document.querySelectorAll('.holo-label');
        if (labels[0]) labels[0].textContent = data.name;
        if (labels[1]) labels[1].textContent = data.period;
        if (labels[2]) labels[2].textContent = data.origin;
        
        if (artifactDescription) {
            artifactDescription.innerHTML = `<p>${data.description}</p><div class="info-metadata"><div class="metadata-item"><span class="metadata-label">Material</span><span class="metadata-value">${data.material}</span></div><div class="metadata-item"><span class="metadata-label">Technique</span><span class="metadata-value">${data.technique}</span></div><div class="metadata-item"><span class="metadata-label">Current Location</span><span class="metadata-value">${data.location}</span></div></div>`;
        }
    }
    
    function toggleAutoRotate() {
        isAutoRotating = !isAutoRotating;
        autoRotateBtn?.classList.toggle('active', isAutoRotating);
        
        if (isAutoRotating) {
            let angle = 0;
            autoRotateInterval = setInterval(() => {
                angle = (angle + 1) % 360;
                rotateY.value = angle;
                updateTransform();
            }, 30);
        } else {
            clearInterval(autoRotateInterval);
        }
    }
    
    rotateX?.addEventListener('input', updateTransform);
    rotateY?.addEventListener('input', updateTransform);
    rotateZ?.addEventListener('input', updateTransform);
    zoomSlider?.addEventListener('input', updateTransform);
    autoRotateBtn?.addEventListener('click', toggleAutoRotate);
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const artifactKey = thumb.dataset.artifact;
            updateArtifactInfo(artifactKey);
        });
    });
    
    updateTransform();
    updateArtifactInfo('obaa');
}

/* =====================================================
GRIOT NARRATION PLAYER
===================================================== */
function initializeOraturePlayer() {
    const playBtn = document.getElementById('play-narrative');
    const progressBar = document.getElementById('narrative-progress');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');
    const verses = document.querySelectorAll('.verse, .verse-initial, .verse-closing');
    const taleButtons = document.querySelectorAll('.tale-btn');
    
    if (!playBtn) return;
    
    let isPlaying = false;
    let progress = 0;
    const totalDuration = 272;
    
    const taleData = {
        sundiata: { title: 'Epic of Sundiata', duration: '4:32' },
        amadou: { title: 'Hampâté Bâ Wisdom', duration: '5:18' },
        timbuktu: { title: 'Timbuktu Scholars', duration: '3:45' },
        queen: { title: "Queen Nzinga's Reign", duration: '4:05' }
    };
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function revealVerse(index) {
        verses.forEach((verse, i) => {
            if (i <= index) {
                setTimeout(() => {
                    verse.classList.add('visible');
                }, Math.max(0, i - index) * 500);
            } else {
                verse.classList.remove('visible');
            }
        });
    }
    
    function playNarrative() {
        isPlaying = !isPlaying;
        const playIcon = playBtn.querySelector('.play-icon');
        playIcon.textContent = isPlaying ? '⏸' : '▶';
        
        if (isPlaying) {
            let startTime = Date.now();
            let startProgress = progress;
            
            function updateProgress() {
                if (!isPlaying) return;
                
                const elapsed = (Date.now() - startTime) / 1000;
                progress = Math.min(startProgress + elapsed, totalDuration);
                
                progressBar.style.width = `${(progress / totalDuration) * 100}%`;
                timeCurrent.textContent = formatTime(progress);
                
                const verseIndex = Math.floor((progress / totalDuration) * verses.length);
                revealVerse(Math.min(verseIndex, verses.length - 1));
                
                if (progress < totalDuration) {
                    requestAnimationFrame(updateProgress);
                } else {
                    isPlaying = false;
                    playIcon.textContent = '▶';
                    progress = 0;
                    progressBar.style.width = '0%';
                    verses.forEach(v => v.classList.remove('visible'));
                }
            }
            requestAnimationFrame(updateProgress);
        }
    }
    
    function resetPlayer() {
        progress = 0;
        progressBar.style.width = '0%';
        timeCurrent.textContent = '0:00';
        isPlaying = false;
        const playIcon = playBtn.querySelector('.play-icon');
        playIcon.textContent = '▶';
        verses.forEach(v => v.classList.remove('visible'));
    }
    
    playBtn.addEventListener('click', playNarrative);
    
    progressBar.parentElement?.addEventListener('click', (e) => {
        const rect = progressBar.parentElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        progress = (clickX / rect.width) * totalDuration;
        progressBar.style.width = `${(progress / totalDuration) * 100}%`;
        timeCurrent.textContent = formatTime(progress);
    });
    
    taleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            taleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const taleKey = btn.dataset.tale;
            const tale = taleData[taleKey];
            if (tale) {
                timeTotal.textContent = tale.duration;
                resetPlayer();
            }
        });
    });
    
    setTimeout(() => revealVerse(0), 1500);
}

/* =====================================================
STAR MAP - Diaspora Visualization
===================================================== */
function initializeStarMap() {
    const canvas = document.getElementById('diaspora-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const constellationInfo = document.getElementById('constellation-info');
    const infoClose = document.querySelector('.info-close');
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    const zoomIn = document.querySelector('.zoom-btn.zoom-in');
    const zoomOut = document.querySelector('.zoom-btn.zoom-out');
    
    let zoom = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX, lastY;
    
    const stars = {
        origin: [{ x: 0.52, y: 0.45, name: 'Homeland', size: 8, color: '#ffd700' }],
        majorCities: [
            { x: 0.52, y: 0.45, label: 'West Africa' },
            { x: 0.55, y: 0.42, label: 'Mali Empire' },
            { x: 0.48, y: 0.48, label: 'Ghana' },
            { x: 0.58, y: 0.38, label: 'Songhai' },
            { x: 0.62, y: 0.52, label: 'Ethiopia' }
        ],
        diaspora: [
            { x: 0.15, y: 0.40, name: 'Caribbean', size: 4 },
            { x: 0.12, y: 0.42, name: 'Jamaica', size: 3 },
            { x: 0.18, y: 0.38, name: 'Haiti', size: 3 },
            { x: 0.25, y: 0.65, name: 'Brazil', size: 5 },
            { x: 0.08, y: 0.32, name: 'North America', size: 6 },
            { x: 0.20, y: 0.68, name: 'Colombia', size: 3 }
        ],
        routes: [
            { from: { x: 0.52, y: 0.45 }, to: { x: 0.15, y: 0.40 }, strength: 0.8 },
            { from: { x: 0.52, y: 0.45 }, to: { x: 0.08, y: 0.32 }, strength: 0.9 },
            { from: { x: 0.52, y: 0.45 }, to: { x: 0.25, y: 0.65 }, strength: 0.7 },
            { from: { x: 0.52, y: 0.45 }, to: { x: 0.20, y: 0.68 }, strength: 0.5 }
        ]
    };
    
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
    }
    
    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        
        ctx.clearRect(0, 0, w, h);
        
        const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
        bgGrad.addColorStop(0, 'rgba(10, 10, 20, 0.9)');
        bgGrad.addColorStop(1, 'rgba(5, 5, 10, 1)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(w/2 + offsetX, h/2 + offsetY);
        ctx.scale(zoom, zoom);
        ctx.translate(-w/2, -h/2);
        
        stars.routes.forEach(route => {
            const fromX = route.from.x * w;
            const fromY = route.from.y * h;
            const toX = route.to.x * w;
            const toY = route.to.y * h;
            
            const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
            gradient.addColorStop(0, `rgba(212, 175, 55, ${route.strength * 0.3})`);
            gradient.addColorStop(1, `rgba(212, 175, 55, 0.05)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 * route.strength;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.quadraticCurveTo((fromX + toX) / 2, fromY - 50, toX, toY);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        
        stars.origin.forEach(star => {
            const x = star.x * w;
            const y = star.y * h;
            
            const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 4);
            glow.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, star.size * 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffd700';
            ctx.font = `${star.size * 2}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('✦', x, y + star.size * 0.3);
        });
        
        stars.diaspora.forEach(star => {
            const x = star.x * w;
            const y = star.y * h;
            
            ctx.fillStyle = 'rgba(30, 77, 140, 0.3)';
            ctx.beginPath();
            ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#1e4d8c';
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
        ctx.font = '10px Cinzel';
        stars.majorCities.forEach(city => {
            ctx.fillText(city.label, city.x * w, city.y * h);
        });
        
        ctx.restore();
    }
    
    function handleZoom(delta) {
        zoom = Math.max(0.5, Math.min(3, zoom + delta));
        draw();
    }
    
    function handlePan(dx, dy) {
        offsetX += dx;
        offsetY += dy;
        draw();
    }
    
    zoomIn?.addEventListener('click', () => handleZoom(0.2));
    zoomOut?.addEventListener('click', () => handleZoom(-0.2));
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
    });
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        handlePan(dx, dy);
        lastX = e.clientX;
        lastY = e.clientY;
    });
    
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    
    timelineMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const year = marker.dataset.year;
            const event = marker.querySelector('.marker-event').textContent;
            
            const nameEl = constellationInfo.querySelector('.info-name');
            const descEl = constellationInfo.querySelector('.info-description');
            const yearEl = constellationInfo.querySelector('.stat-value');
            
            if (nameEl) nameEl.textContent = event;
            if (yearEl) yearEl.textContent = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
            
            constellationInfo.classList.add('active');
            timelineMarkers.forEach(m => m.classList.remove('active'));
            marker.classList.add('active');
        });
    });
    
    infoClose?.addEventListener('click', () => {
        constellationInfo.classList.remove('active');
    });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function animateStars() {
        stars.diaspora.forEach((star, i) => {
            star.x += Math.sin(Date.now() / 10000 + i) * 0.0001;
            star.y += Math.cos(Date.now() / 10000 + i) * 0.0001;
        });
        draw();
        requestAnimationFrame(animateStars);
    }
    animateStars();
}

/* =====================================================
TIMELINE INTERACTIONS
===================================================== */
function initializeTimeline() {
    const timelineContainer = document.getElementById('timeline-events');
    if (!timelineContainer) return;
    
    const events = document.querySelectorAll('.timeline-event');
    
    const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    events.forEach((event, index) => {
        event.style.opacity = '0';
        event.style.transform = 'translateY(30px)';
        event.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(event);
    });
    
    const futureEvents = document.querySelectorAll('.future-event');
    futureEvents.forEach(event => {
        const marker = event.querySelector('.marker-jewel');
        if (marker) {
            setInterval(() => {
                marker.style.boxShadow = marker.style.boxShadow === '0 0 10px rgba(34, 139, 34, 0.8)' ? '0 0 20px rgba(34, 139, 34, 0.4)' : '0 0 10px rgba(34, 139, 34, 0.8)';
            }, 1500);
        }
    });
    
    const legendary = document.querySelector('.card-legendary');
    if (legendary) {
        setInterval(() => {
            legendary.style.borderColor = legendary.style.borderColor === '#ffd700' ? '#d4af37' : '#ffd700';
        }, 2000);
    }
}

/* =====================================================
SCROLL ANIMATIONS
===================================================== */
function initializeScrollAnimations() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const cosmicBg = document.getElementById('cosmic-bg');
        if (cosmicBg) {
            cosmicBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        header.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        headerObserver.observe(header);
    });
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 12, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'linear-gradient(180deg, rgba(10, 10, 12, 0.95) 0%, rgba(10, 10, 12, 0) 100%)';
            nav.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
    });
}

/* =====================================================
AMBIENT EFFECTS
===================================================== */
function initializeAmbientEffects() {
    const cosmicBackground = document.getElementById('cosmic-bg');
    if (!cosmicBackground) return;
    
    for (let i = 0; i < 15; i++) {
        const orb = document.createElement('div');
        orb.className = 'floating-orb';
        orb.style.cssText = `position:absolute;width:${Math.random() * 4 + 2}px;height:${Math.random() * 4 + 2}px;background:${Math.random() > 0.5 ? 'var(--gold-pale)' : 'var(--text-primary)'};border-radius:50%;opacity:${Math.random() * 0.5 + 0.2};left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:floatOrb ${Math.random() * 20 + 10}s linear infinite;animation-delay:-${Math.random() * 10}s;pointer-events:none;`;
        cosmicBackground.appendChild(orb);
    }
    
    const style = document.createElement('style');
    style.textContent = `@keyframes floatOrb{0%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(30px,-30px) rotate(90deg)}50%{transform:translate(-20px,20px) rotate(180deg)}75%{transform:translate(10px,-10px) rotate(270deg)}100%{transform:translate(0,0) rotate(360deg)}}`;
    document.head.appendChild(style);
    
    const invocationChars = document.querySelectorAll('.invocation-char');
    invocationChars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.5}s`;
        char.style.opacity = '0';
        setTimeout(() => {
            char.style.transition = 'opacity 1s ease-out';
            char.style.opacity = '1';
        }, 1000 + i * 300);
    });
    
    const heroElements = document.querySelectorAll('.hero-header, .hero-invocation');
    heroElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 1s ease-out ${0.5 + i * 0.3}s, transform 1s ease-out ${0.5 + i * 0.3}s`;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300);
    });
    
    const volumeBtn = document.querySelector('.volume-btn');
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            volumeBtn.classList.toggle('active');
        });
    }
}

/* =====================================================
UTILITY FUNCTIONS
===================================================== */
if (!('scrollBehavior' in document.documentElement.style)) {
    window.scrollTo = function(options) {
        const target = typeof options === 'number' ? options : options.top;
        const start = window.pageYOffset;
        const distance = target - start;
        const duration = 500;
        const startTime = performance.now();
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress * (2 - progress);
            window.scrollTo(0, start + distance * ease);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    };
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const infoPanel = document.getElementById('constellation-info');
        if (infoPanel?.classList.contains('active')) {
            infoPanel.classList.remove('active');
        }
    }
    
    const sections = ['origins', 'artifacts', 'orature', 'starmap', 'timeline'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5) {
        const target = document.getElementById(sections[num - 1]);
        if (target) {
            document.querySelectorAll('.gallery-section, .hero-section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.adinkra-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
            document.querySelector(`[data-section="${sections[num - 1]}"]`)?.classList.add('active');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    if (e.key === 'Home') {
        document.querySelectorAll('.gallery-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.adinkra-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('hero')?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('AKWAMU — The Eternal Archive initialized');
});