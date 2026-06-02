/* ============================================
   CODEX OF THE DAMNED - SCRIPTS
   Interactive Dark Fantasy Experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initCustomCursor();
    initScrollAnimations();
    initSufferingMeter();
    initCursedCounter();
    initSufferingChart();
    initArtifactReveals();
    initCurseGenerator();
    initRitualCalendar();
    initBlightedMap();
    initNavigation();
    initParticleEffects();
});

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows mouse immediately
        cursorX = mouseX;
        cursorY = mouseY;
        
        // Follower has delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .artifact-card, .map-region, .stat-card, .ritual-event, .affliction-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '0.6';
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const ritualEvents = document.querySelectorAll('.ritual-event');
    
    // Intersection Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate stats if in suffering section
                if (entry.target.id === 'suffering-index') {
                    animateStatCounters();
                    animateSeverityBars();
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Separate observer for ritual timeline
    const ritualObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.2
    });
    
    ritualEvents.forEach(event => {
        ritualObserver.observe(event);
    });
}

/* ============================================
   SUFFERING METER
   ============================================ */
function initSufferingMeter() {
    const meterFill = document.getElementById('suffering-fill');
    const meterValue = document.getElementById('suffering-value');
    const cursedCounter = document.getElementById('cursed-counter');
    const cursedCount = document.getElementById('cursed-count');
    
    if (!meterFill || !meterValue) return;
    
    // Animate meter on page load
    setTimeout(() => {
        const targetValue = 87; // World suffering percentage
        animateValue(meterFill, 0, targetValue, 2000);
        animateValueText(meterValue, 0, targetValue, 2000, '%');
        
        // Show cursed counter after meter animation
        setTimeout(() => {
            if (cursedCounter && cursedCount) {
                cursedCounter.style.display = 'block';
                const cursedTotal = Math.floor(Math.random() * 500) + 1200;
                animateValueText(cursedCount, 0, cursedTotal, 1500);
            }
        }, 1000);
    }, 500);
    
    // Gradually increase suffering over time (sinister effect)
    setInterval(() => {
        const currentWidth = parseFloat(meterFill.style.width) || 0;
        if (currentWidth < 95) {
            const increment = Math.random() * 0.2;
            const newValue = Math.min(currentWidth + increment, 95);
            meterFill.style.width = `${newValue}%`;
            meterValue.textContent = `${Math.round(newValue)}%`;
            
            // Update cursed count occasionally
            if (cursedCount && Math.random() > 0.7) {
                const currentCount = parseInt(cursedCount.textContent.replace(/,/g, '')) || 0;
                cursedCount.textContent = (currentCount + Math.floor(Math.random() * 3)).toLocaleString();
            }
        }
    }, 3000);
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        element.style.width = `${current}%`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateValueText(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   STAT COUNTERS & SEVERITY BARS
   ============================================ */
function animateStatCounters() {
    const counters = [
        { id: 'souls-lost', target: 847293, duration: 2500 },
        { id: 'curses-active', target: 342, duration: 2000 },
        { id: 'corruption-level', target: 73, suffix: '%', duration: 1800 },
        { id: 'doom-proximity', target: 7, duration: 1500 }
    ];
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) {
            const current = parseInt(element.textContent.replace(/,/g, '')) || 0;
            animateValueText(element, current, counter.target, counter.duration, counter.suffix || '');
        }
    });
}

function animateSeverityBars() {
    const severityFills = document.querySelectorAll('.severity-fill');
    severityFills.forEach(fill => {
        const targetWidth = parseFloat(fill.style.width);
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = `${targetWidth}%`;
        }, 300);
    });
}

/* ============================================
   SUFFERING CHART (Canvas)
   ============================================ */
function initSufferingChart() {
    const canvas = document.getElementById('misery-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth * window.devicePixelRatio;
        canvas.height = container.clientHeight * window.devicePixelRatio;
        canvas.style.width = container.clientWidth + 'px';
        canvas.style.height = container.clientHeight + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawChart();
    });
    
    // Chart data
    const data = {
        misery: [65, 72, 78, 85, 82, 88, 91, 87, 93, 89, 92, 95],
        hope: [35, 28, 22, 15, 18, 12, 9, 13, 7, 11, 8, 5],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    let animationProgress = 0;
    let chartAnimated = false;
    
    function drawChart() {
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        const padding = { top: 20, right: 30, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
            
            // Y-axis labels
            ctx.fillStyle = '#888888';
            ctx.font = '10px Crimson Text';
            ctx.textAlign = 'right';
            const value = 100 - (i * 20);
            ctx.fillText(value, padding.left - 10, y + 3);
        }
        
        // X-axis labels
        ctx.textAlign = 'center';
        data.labels.forEach((label, i) => {
            const x = padding.left + (chartWidth / (data.labels.length - 1)) * i;
            ctx.fillText(label, x, height - padding.bottom + 20);
        });
        
        // Draw misery line
        drawLine(data.misery, '#8b0000', padding, chartWidth, chartHeight, animationProgress);
        
        // Draw hope line
        drawLine(data.hope, '#2a8b00', padding, chartWidth, chartHeight, animationProgress);
        
        // Draw data points for misery
        data.misery.forEach((value, i) => {
            const x = padding.left + (chartWidth / (data.misery.length - 1)) * i;
            const y = padding.top + chartHeight - (value / 100) * chartHeight * animationProgress;
            
            if (animationProgress > i / (data.misery.length - 1)) {
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#8b0000';
                ctx.fill();
                ctx.strokeStyle = '#0a0a0a';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
        
        // Draw data points for hope
        data.hope.forEach((value, i) => {
            const x = padding.left + (chartWidth / (data.hope.length - 1)) * i;
            const y = padding.top + chartHeight - (value / 100) * chartHeight * animationProgress;
            
            if (animationProgress > i / (data.hope.length - 1)) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#2a8b00';
                ctx.fill();
            }
        });
    }
    
    function drawLine(dataPoints, color, padding, chartWidth, chartHeight, progress) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        dataPoints.forEach((value, i) => {
            const x = padding.left + (chartWidth / (dataPoints.length - 1)) * i;
            const targetY = padding.top + chartHeight - (value / 100) * chartHeight;
            const y = padding.top + chartHeight - ((value / 100) * chartHeight * progress);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                // Smooth curve using quadratic bezier
                const prevX = padding.left + (chartWidth / (dataPoints.length - 1)) * (i - 1);
                const prevY = padding.top + chartHeight - ((dataPoints[i - 1] / 100) * chartHeight * progress);
                const cpX = (prevX + x) / 2;
                const cpY = (prevY + y) / 2;
                ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
                ctx.quadraticCurveTo(x, y, x, y);
            }
        });
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // Animate chart when section becomes visible
    const chartSection = document.querySelector('.suffering-chart');
    if (chartSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !chartAnimated) {
                    chartAnimated = true;
                    let start = null;
                    
                    function animateChart(timestamp) {
                        if (!start) start = timestamp;
                        const progress = (timestamp - start) / 1500;
                        
                        if (progress < 1) {
                            animationProgress = easeOutCubic(progress);
                            drawChart();
                            requestAnimationFrame(animateChart);
                        } else {
                            animationProgress = 1;
                            drawChart();
                        }
                    }
                    
                    requestAnimationFrame(animateChart);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(chartSection);
    }
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

/* ============================================
   ARTIFACT CURSE REVEALS
   ============================================ */
function initArtifactReveals() {
    const artifactCards = document.querySelectorAll('.artifact-card');
    
    artifactCards.forEach(card => {
        const btn = card.querySelector('.artifact-btn');
        const hiddenCurse = card.querySelector('.hidden-curse');
        
        if (btn && hiddenCurse) {
            // Track if curse already revealed
            let revealed = false;
            
            btn.addEventListener('click', () => {
                if (!revealed) {
                    hiddenCurse.style.display = 'block';
                    btn.textContent = 'Curse Revealed';
                    btn.style.background = 'rgba(139, 0, 0, 0.3)';
                    btn.disabled = true;
                    revealed = true;
                    
                    // Increment cursed counter
                    updateCursedCount(1);
                    
                    // Add visual feedback
                    card.style.borderColor = '#8b0000';
                    card.style.boxShadow = '0 0 30px rgba(139, 0, 0, 0.4)';
                    
                    // Play sinister sound effect (if available)
                    playSound('curse-reveal');
                }
            });
        }
        
        // Hover effect with subtle glitch
        card.addEventListener('mouseenter', () => {
            if (!revealed) {
                const placeholder = card.querySelector('.artifact-placeholder');
                if (placeholder) {
                    placeholder.style.filter = 'grayscale(0) drop-shadow(0 0 25px rgba(139, 0, 0, 0.8))';
                }
            }
        });
    });
}

/* ============================================
   CURSE GENERATOR
   ============================================ */
function initCurseGenerator() {
    const generateBtn = document.getElementById('generate-curse');
    const resultDiv = document.getElementById('curse-result');
    
    if (!generateBtn || !resultDiv) return;
    
    const curses = [
        {
            title: "The Curse of Unending Thirst",
            description: "You will never again be satisfied by any drink. Water tastes like ashes, wine like vinegar, and blood like regret. Your throat will feel as if wrapped in sandpaper, and you will spend eternity seeking a drink that quenches, knowing none will.",
            severity: "MODERATE"
        },
        {
            title: "Echoes of Your Sins",
            description: "Every wrong you have ever done will be whispered in your ear by an invisible presence. The voices will grow louder each day, and eventually you will hear them in the voices of loved ones. You will become a hermit, or worse, lash out at those you care about.",
            severity: "SEVERE"
        },
        {
            title: "Limb of the Lost",
            description: "One of your limbs will slowly become translucent. You will be able to see through it to the bone. It will lose sensation and function gradually. Attempts to cut it off will only cause it to regrow elsewhere on your body. The curse spreads slowly but inexorably.",
            severity: "HIGH"
        },
        {
            title: "The Weight of Regret",
            description: "You will carry the physical weight of all your regrets. Each mistake adds an invisible weight that only you feel. Simple tasks become arduous. Eventually you will be unable to move, crushed not by stone but by memory.",
            severity: "EXTREME"
        },
        {
            title: "Eyes of Truth",
            description: "You will see people as they truly are—their flaws, their fears, their darkest impulses laid bare. The beautiful become grotesque, the kind reveal hidden malice. You will trust no one, see no beauty, and eventually go blind from the horror.",
            severity: "SEVERE"
        },
        {
            title: "Hunger of the Hollow",
            description: "No food will satisfy you. You will eat constantly but always feel empty. The more you eat, the hungrier you become. Eventually you will consume things that are not food, then things that were never meant to be eaten, until nothing remains of you but an emptiness that devours.",
            severity: "EXTREME"
        },
        {
            title: "The Silent Bell",
            description: "A bell will toll in your head whenever someone near you lies. In a world of half-truths and deception, it will never stop. Sleep becomes impossible. Eventually you will be driven to violence just to experience silence, even if only for a moment.",
            severity: "HIGH"
        },
        {
            title: "Shattered Reflection",
            description: "Your reflection will slowly fracture into countless pieces. Each piece shows a different version of you—past, potential, alternate paths. You will become obsessed with gathering the pieces, but they shift and multiply. Eventually you will not know which version is real.",
            severity: "MODERATE"
        },
        {
            title: "Chains of Obligation",
            description: "You will feel physically bound to anyone you make a promise to. Breaking a promise causes the chains to tighten, cutting into your flesh. Keeping promises extends them slightly. You will become a slave to your word, unable to make even simple vows without risking entrapment.",
            severity: "HIGH"
        },
        {
            title: "The Rot Within",
            description: "From the inside out, you will decay. Your organs will slowly turn to dust while you remain conscious. You will feel every moment of your own dissolution. Healers can do nothing—the rot is not of the body but of the soul, manifesting physically.",
            severity: "EXTREME"
        }
    ];
    
    let curseCount = 0;
    
    generateBtn.addEventListener('click', () => {
        // Remove previous result
        resultDiv.style.display = 'none';
        
        // Generate random curse
        const randomIndex = Math.floor(Math.random() * curses.length);
        const curse = curses[randomIndex];
        
        // Populate result
        resultDiv.querySelector('.curse-title').textContent = curse.title;
        resultDiv.querySelector('.curse-description').textContent = curse.description;
        resultDiv.querySelector('.curse-severity').textContent = `Severity: ${curse.severity}`;
        
        // Show with animation
        setTimeout(() => {
            resultDiv.style.display = 'block';
            
            // Update severity color
            const severityEl = resultDiv.querySelector('.curse-severity');
            if (curse.severity === 'EXTREME' || curse.severity === 'SEVERE') {
                severityEl.style.background = 'rgba(139, 0, 0, 0.4)';
                severityEl.style.borderColor = '#8b0000';
                severityEl.style.color = '#ff6b6b';
            } else if (curse.severity === 'MODERATE') {
                severityEl.style.background = 'rgba(128, 0, 128, 0.3)';
                severityEl.style.borderColor = '#8b008b';
                severityEl.style.color = '#d8a0d8';
            } else {
                severityEl.style.background = 'rgba(42, 139, 0, 0.3)';
                severityEl.style.borderColor = '#2a8b00';
                severityEl.style.color = '#6bff6b';
            }
        }, 200);
        
        // Increment curse counter
        curseCount++;
        updateCursedCount(1);
        
        // Add dramatic effect
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10);
        
        playSound('curse-generated');
    });
}

/* ============================================
   RITUAL CALENDAR
   ============================================ */
function initRitualCalendar() {
    const events = document.querySelectorAll('.ritual-event');
    const today = new Date();
    
    // Highlight upcoming/current events
    events.forEach(event => {
        const dateStr = event.getAttribute('data-date');
        if (dateStr) {
            const eventDate = new Date(dateStr);
            const isToday = eventDate.toDateString() === today.toDateString();
            const isUpcoming = eventDate > today && (eventDate - today) < (7 * 24 * 60 * 60 * 1000); // Within 7 days
            
            if (isToday) {
                event.classList.add('urgent');
                event.style.borderColor = '#ff0000';
                event.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.4)';
            } else if (isUpcoming) {
                event.classList.add('approaching');
                event.style.borderColor = '#ffa500';
            }
        }
        
        // Add click to expand details
        event.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const content = this.querySelector('.event-content');
            if (this.classList.contains('expanded')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.overflow = 'visible';
            } else {
                content.style.maxHeight = '';
                content.style.overflow = '';
            }
        });
    });
}

/* ============================================
   BLIGHTED MAP
   ============================================ */
function initBlightedMap() {
    const regions = document.querySelectorAll('.map-region');
    
    regions.forEach(region => {
        // Add hover sound effect
        region.addEventListener('mouseenter', () => {
            const blightText = region.querySelector('.region-blight');
            if (blightText) {
                const blightLevel = parseFloat(blightText.textContent.replace(/[^\d.]/g, ''));
                // Adjust color intensity based on blight level
                const intensity = blightLevel / 100;
                region.style.setProperty('--blight-intensity', intensity);
            }
            
            playSound('region-hover');
        });
        
        // Click to show more details
        region.addEventListener('click', () => {
            // Remove active from others
            regions.forEach(r => r.classList.remove('active'));
            region.classList.add('active');
            
            // Could expand to show more details here
            const regionName = region.querySelector('.region-name').textContent;
            console.log(`Selected region: ${regionName}`);
            
            // Visual feedback
            region.style.transform = 'scale(1.1)';
            setTimeout(() => {
                region.style.transform = '';
            }, 300);
        });
    });
}

/* ============================================
   NAVIGATION & SMOOTH SCROLL
   ============================================ */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.codex-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu if exists
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ============================================
   PARTICLE EFFECTS ENHANCEMENT
   ============================================ */
function initParticleEffects() {
    const particlesContainer = document.querySelector('.bg-particles');
    if (!particlesContainer) return;
    
    // Create additional floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.7 ? '#8b0000' : Math.random() > 0.5 ? '#2a8b00' : '#ffffff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.zIndex = '-2';
        
        // Animate
        const duration = Math.random() * 60 + 30;
        const keyframes = [
            { transform: 'translateY(0) translateX(0)' },
            { transform: `translateY(-${Math.random() * 100}px) translateX(${Math.random() * 100 - 50}px)` },
            { transform: 'translateY(0) translateX(0)' }
        ];
        
        particle.animate(keyframes, {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        document.body.appendChild(particle);
        
        // Remove after some time to prevent memory issues
        setTimeout(() => {
            particle.remove();
        }, duration * 1000 * 2);
    }
    
    // Create particles periodically
    setInterval(createParticle, 500);
    
    // Initial burst
    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, i * 100);
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function updateCursedCount(increment) {
    const cursedCount = document.getElementById('cursed-count');
    if (cursedCount) {
        const current = parseInt(cursedCount.textContent.replace(/,/g, '')) || 0;
        cursedCount.textContent = (current + increment).toLocaleString();
        
        // Pulse animation
        cursedCount.parentElement.style.animation = 'none';
        setTimeout(() => {
            cursedCount.parentElement.style.animation = '';
        }, 10);
    }
}

function playSound(soundName) {
    // Create subtle audio feedback (optional, can be extended)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different sounds for different events
    switch(soundName) {
        case 'curse-reveal':
            oscillator.frequency.value = 100;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
        case 'curse-generated':
            oscillator.frequency.value = 80;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'region-hover':
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
    }
}

/* ============================================
   ADDITIONAL INTERACTIONS
   ============================================ */

// Add glitch effect on artifact cards randomly
setInterval(() => {
    const artifacts = document.querySelectorAll('.artifact-card');
    const randomArtifact = artifacts[Math.floor(Math.random() * artifacts.length)];
    
    if (randomArtifact) {
        randomArtifact.style.filter = 'hue-rotate(15deg) saturate(1.2)';
        setTimeout(() => {
            randomArtifact.style.filter = '';
        }, 100);
    }
}, 8000);

// Breathing effect for the cursed counter
const cursedCounter = document.querySelector('.cursed-counter');
if (cursedCounter) {
    setInterval(() => {
        cursedCounter.style.transform = `scale(${1 + Math.random() * 0.05})`;
        setTimeout(() => {
            cursedCounter.style.transform = '';
        }, 200);
    }, 5000);
}

// Dynamic footer warning intensity
const footerWarning = document.querySelector('.footer-warning');
if (footerWarning) {
    setInterval(() => {
        const intensity = 0.8 + Math.random() * 0.2;
        footerWarning.style.opacity = intensity;
    }, 3000);
}

// Easter egg: Konami code reveals special message
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        alert('You have discovered the true name of the world. It is "Sorrow." May this knowledge bring you no peace.');
        konamiCode = [];
    }
});

// Parallax effect for background layers
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const fog = document.querySelector('.bg-fog');
    const particles = document.querySelector('.bg-particles');
    
    if (fog) {
        fog.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    if (particles) {
        particles.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Random atmospheric whispers (text that appears briefly)
function createWhisper() {
    const whispers = [
        "They're watching...",
        "The veil is thin tonight...",
        "Your time is coming...",
        "Nothing escapes the curse...",
        "The codex knows your name...",
        "Suffering eternal...",
        "The blight spreads...",
        "Your soul is marked..."
    ];
    
    const whisper = document.createElement('div');
    whisper.textContent = whispers[Math.floor(Math.random() * whispers.length)];
    whisper.style.position = 'fixed';
    whisper.style.top = Math.random() * 80 + 10 + 'vh';
    whisper.style.left = Math.random() * 80 + 10 + 'vw';
    whisper.style.color = '#8b0000';
    whisper.style.fontFamily = "'Creepster', cursive";
    whisper.style.fontSize = '0.8rem';
    whisper.style.opacity = '0';
    whisper.style.pointerEvents = 'none';
    whisper.style.zIndex = '9999';
    whisper.style.textShadow = '0 0 10px rgba(139, 0, 0, 0.8)';
    whisper.style.transition = 'opacity 2s ease';
    
    document.body.appendChild(whisper);
    
    setTimeout(() => {
        whisper.style.opacity = '0.7';
    }, 100);
    
    setTimeout(() => {
        whisper.style.opacity = '0';
    }, 3000);
    
    setTimeout(() => {
        whisper.remove();
    }, 5000);
}

// Create whispers at random intervals
setInterval(() => {
    if (Math.random() > 0.7) {
        createWhisper();
    }
}, 10000);

console.log('%c CODEX OF THE DAMNED ', 'background: #8b0000; color: #fff; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c You have entered a world of suffering. Turn back now, for there is no return. ', 'color: #8b0000; font-style: italic;');