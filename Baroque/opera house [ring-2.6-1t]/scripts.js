/* ============================================================
   TEATRO DELLA CORONA D'ORO — INTERACTIVE SCRIPTS
   ============================================================ */

(function () {
    'use strict';

    // ==================== UTILITY FUNCTIONS ====================
    function $(selector, parent) {
        return (parent || document).querySelector(selector);
    }
    function $$(selector, parent) {
        return [...(parent || document).querySelectorAll(selector)];
    }
    function lerp(start, end, t) {
        return start + (end - start) * t;
    }
    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    // ==================== CURTAIN REVEAL ====================
    const curtainOverlay = $('#curtain-overlay');
    const curtainLeft = $('.curtain-left');
    const curtainRight = $('.curtain-right');
    const mainContent = $('#main-content');

    function openCurtain() {
        return new Promise((resolve) => {
            // Add a small delay before starting
            setTimeout(() => {
                curtainLeft.style.animation = 'curtainSlideLeft 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';
                curtainRight.style.animation = 'curtainSlideRight 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';

                // After curtain animation completes, reveal content
                setTimeout(() => {
                    curtainOverlay.style.transition = 'opacity 1s ease';
                    curtainOverlay.style.opacity = '0';
                    setTimeout(() => {
                        curtainOverlay.style.display = 'none';
                        mainContent.classList.remove('hidden');
                        // Trigger content entrance animation
                        requestAnimationFrame(() => {
                            mainContent.classList.add('visible');
                        });
                        resolve();
                    }, 1000);
                }, 2000);
            }, 600);
        });
    }

    // ==================== FLOATING DUST PARTICLES ====================
    function createDustParticles() {
        const body = document.body;
        const particleCount = window.innerWidth < 768 ? 15 : 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('dust');
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (8 + Math.random() * 15) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (1 + Math.random() * 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = 0.2 + Math.random() * 0.4;
            body.appendChild(particle);

            // Animate particle
            animateDust(particle);
        }
    }

    function animateDust(particle) {
        const duration = 8000 + Math.random() * 15000;
        const startX = parseFloat(particle.style.left);
        const drift = (Math.random() - 0.5) * 40;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;

            const y = progress * 100;
            const x = startX + Math.sin(progress * Math.PI * 4) * drift;
            const scale = 0.3 + Math.sin(progress * Math.PI) * 0.7;
            const opacity = 0.1 + Math.sin(progress * Math.PI) * 0.3;

            particle.style.transform = `translate(${x}vw, ${-y}vh) scale(${scale})`;
            particle.style.opacity = opacity;

            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ==================== SCROLL REVEAL ====================
    function setupScrollReveals() {
        const reveals = $$('.reveal, .performance-card, .performer-card');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.15,
                    rootMargin: '0px 0px -50px 0px',
                }
            );

            reveals.forEach((el) => observer.observe(el));
        } else {
            // Fallback: show everything immediately
            reveals.forEach((el) => el.classList.add('visible'));
        }
    }

    // ==================== CHANDELIER INTERACTION ====================
    function setupChandelierInteraction() {
        const chandelier = $('.chandelier');
        if (!chandelier) return;

        let mouseX = 0;
        let mouseY = 0;
        let chandX = chandelier.offsetLeft;
        let chandY = chandelier.offsetTop;
        let targetRotate = 0;
        let currentRotate = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            const rect = chandelier.parentElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (mouseX - centerX) / centerX;
            const deltaY = (mouseY - centerY) / centerY;

            targetRotate = deltaX * 1.5;
        });

        function animateChandelier() {
            currentRotate = lerp(currentRotate, targetRotate, 0.05);
            chandelier.style.transform = `rotate(${currentRotate}deg)`;

            // Subtle candle flicker response to mouse proximity
            const candles = $$('.candle-flame');
            const rect = chandelier.parentElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const dist = Math.abs(mouseX - centerX) / window.innerWidth;

            if (dist < 0.3) {
                candles.forEach((flame, i) => {
                    const intensity = 1 + (0.3 - dist) * 2;
                    flame.style.animationDuration = (1 + (1 - intensity) * 0.5) + 's';
                });
            }

            requestAnimationFrame(animateChandelier);
        }
        animateChandelier();
    }

    // ==================== CHANDELIER LIGHT PROJECTION ====================
    function setupLightCaustics() {
        const caustics = $('.light-caustics');
        if (!caustics) return;

        const stage = $('.hero-section');
        if (!stage) return;

        let mouseOnStage = false;

        stage.addEventListener('mousemove', (e) => {
            const rect = stage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            caustics.style.background = `
                radial-gradient(ellipse at ${x + 5}% ${y - 10}%, rgba(255, 191, 0, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse at ${x - 5}% ${y + 5}%, rgba(255, 200, 100, 0.08) 0%, transparent 40%),
                radial-gradient(ellipse at ${x}% ${y}%, rgba(255, 230, 150, 0.04) 0%, transparent 60%)
            `;
            mouseOnStage = true;
        });

        stage.addEventListener('mouseleave', () => {
            mouseOnStage = false;
            caustics.style.background = `
                radial-gradient(ellipse at 50% 0%, rgba(255, 191, 0, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 20%, rgba(255, 200, 100, 0.05) 0%, transparent 60%)
            `;
        });
    }

    // ==================== PERFORMER SPOTLIGHT ====================
    function setupPerformerSpotlights() {
        const cards = $$('.performer-card');

        cards.forEach((card) => {
            const spotlight = card.querySelector('.performer-spotlight');
            const frame = card.querySelector('.performer-frame');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                spotlight.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,191,0,0.08) 0%, transparent 60%)`;
            });

            card.addEventListener('mouseenter', () => {
                spotlight.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                spotlight.style.opacity = '0';
            });
        });
    }

    // ==================== SEAT SELECTION ====================
    let selectedSeat = null;
    const selectedSeats = [];

    function setupSeatSelection() {
        const seats = $$('.seat.available, .box.box-open');

        seats.forEach((seat) => {
            seat.addEventListener('click', () => {
                const seatId = seat.getAttribute('data-seat');
                const tier = seat.getAttribute('data-tier');

                // Deselect previous
                if (selectedSeat) {
                    selectedSeat.classList.remove('selected');
                }

                // Toggle selection
                if (seat.classList.contains('selected')) {
                    seat.classList.remove('selected');
                    selectedSeat = null;
                    hideModal();
                } else {
                    seat.classList.add('selected');
                    selectedSeat = seat;
                    showBookingModal(seatId, tier);
                }
            });
        });
    }

    function getTierName(tier) {
        const names = {
            orchestra: 'Orchestra',
            mezzanine: 'Mezzanine',
            grand: 'Grand Tier',
            upper: 'Upper Circle',
            gallery: 'Gallery',
        };
        return names[tier] || tier;
    }

    function getTierPrice(tier) {
        const prices = {
            orchestra: { min: 180, max: 250 },
            mezzanine: { min: 120, max: 180 },
            grand: { min: 80, max: 120 },
            upper: { min: 50, max: 80 },
            gallery: { min: 25, max: 50 },
        };
        return prices[tier] || { min: 0, max: 0 };
    }

    function getRandomPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function showBookingModal(seatId, tier) {
        const modal = $('#booking-modal');
        const perfName = $('#modal-performance-name');
        const seatNum = $('#modal-seat-number');
        const tierName = $('#modal-tier-name');
        const price = $('#modal-price');

        // Get current performance (first card with ribbon "Opening Night" for demo)
        const currentPerf = $('.performance-card__ribbon');
        const perfText = currentPerf ? currentPerf.textContent.trim() : 'Season Performance';

        const prices = getTierPrice(tier);
        const seatPrice = getRandomPrice(prices.min, prices.max);

        perfName.textContent = 'Norma — Opening Night';
        seatNum.textContent = `Row ${seatId.charAt(0).toUpperCase()}, Seat ${seatId.slice(1)}`;
        tierName.textContent = getTierName(tier);
        price.textContent = `€${seatPrice}.00`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        const modal = $('#booking-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function setupModalClose() {
        const closeBtn = $('#modal-close');
        const cancelBtn = $('#btn-cancel');
        const overlay = $('.modal-overlay');
        const confirmBtn = $('#btn-confirm');

        closeBtn.addEventListener('click', hideModal);
        cancelBtn.addEventListener('click', () => {
            hideModal();
            if (selectedSeat) {
                selectedSeat.classList.remove('selected');
                selectedSeat = null;
            }
        });
        overlay.addEventListener('click', () => {
            hideModal();
            if (selectedSeat) {
                selectedSeat.classList.remove('selected');
                selectedSeat = null;
            }
        });

        confirmBtn.addEventListener('click', () => {
            hideModal();
            showToast('Your reservation has been confirmed! A confirmation will be sent to your correspondence address.');

            if (selectedSeat) {
                selectedSeat.classList.remove('selected');
                selectedSeat.classList.remove('available');
                selectedSeat.classList.add('booked');
                selectedSeat.textContent = '✓';
                selectedSeat.style.cursor = 'not-allowed';
                selectedSeat.style.opacity = '0.6';
                selectedSeat.style.textDecoration = 'line-through';
                selectedSeat = null;
            }
        });
    }

    // ==================== TOAST NOTIFICATION ====================
    let toastTimeout = null;

    function showToast(message) {
        const toast = $('#toast');
        const msgEl = $('#toast-message');
        msgEl.textContent = message;

        if (toastTimeout) clearTimeout(toastTimeout);

        toast.classList.add('visible');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 4500);
    }

    // ==================== BOOK BUTTONS (Performance Cards) ====================
    function setupBookButtons() {
        const buttons = $$('.btn-book');
        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const perf = btn.getAttribute('data-performance');
                const perfNames = {
                    norma: 'Norma',
                    traviata: 'La Traviata',
                    figaro: 'Le Nozze di Figaro',
                    boheme: 'La Bohème',
                    aida: 'Aida',
                    rigoletto: 'Rigoletto',
                    cosi: 'Così fan tutte',
                    tosca: 'Tosca',
                };

                // Scroll to seating chart
                const seatingSection = document.querySelector('.seating-section');
                if (seatingSection) {
                    seatingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Show a brief toast
                setTimeout(() => {
                    showToast(`Selected: ${perfNames[perf] || 'Performance'} — Please choose your seat in the chart below`);
                }, 600);
            });
        });
    }

    // ==================== DYNAMIC HEADER SHADOW ====================
    function setupHeaderScrollEffect() {
        const header = $('.site-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(212,175,55,0.05)';
                header.style.background = 'linear-gradient(to bottom, var(--dark-wood) 0%, var(--charcoal) 100%)';
                header.style.position = 'sticky';
                header.style.top = '0';
                header.style.zIndex = '100';
            } else {
                header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.8)';
                header.style.background = 'linear-gradient(to bottom, var(--dark-wood) 0%, var(--charcoal) 100%)';
                header.style.position = 'relative';
                header.style.top = 'auto';
            }
        });
    }

    // ==================== COUNTER ANIMATION FOR SEASON DETAILS ====================
    function setupCounterAnimation() {
        const detailItems = $$('.season-detail-item');
        let animated = false;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        detailItems.forEach((item, i) => {
                            setTimeout(() => {
                                item.style.transform = 'scale(1.05)';
                                item.style.transition = 'transform 0.3s ease';
                                setTimeout(() => {
                                    item.style.transform = 'scale(1)';
                                }, 200);
                            }, i * 100);
                        });
                    }
                });
            },
            { threshold: 0.5 }
        );

        const introSection = document.querySelector('.season-intro-section');
        if (introSection) observer.observe(introSection);
    }

    // ==================== PERFORMER BIO REVEAL ====================
    function setupPerformerReveal() {
        const cards = $$('.performer-card');

        cards.forEach((card) => {
            const bio = card.querySelector('.performer-bio');
            const roles = card.querySelector('.performer-roles');
            const name = card.querySelector('.performer-name');

            // Initially hide bio details
            if (bio) {
                bio.style.maxHeight = '0';
                bio.style.overflow = 'hidden';
                bio.style.transition = 'max-height 0.6s ease, opacity 0.4s ease';
                bio.style.opacity = '0';
            }
            if (roles) {
                roles.style.opacity = '0';
                roles.style.transform = 'translateY(10px)';
                roles.style.transition = 'all 0.5s ease';
            }

            card.addEventListener('mouseenter', () => {
                if (bio) {
                    bio.style.maxHeight = '200px';
                    bio.style.opacity = '1';
                }
                if (roles) {
                    roles.style.opacity = '1';
                    roles.style.transform = 'translateY(0)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (bio) {
                    bio.style.maxHeight = '0';
                    bio.style.opacity = '0';
                }
                if (roles) {
                    roles.style.opacity = '0';
                    roles.style.transform = 'translateY(10px)';
                }
            });
        });
    }

    // ==================== PERFORMANCE CARD PARALLAX ====================
    function setupParallaxEffect() {
        const cards = $$('.performance-card');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const windowCenter = window.innerHeight / 2;
                const distance = cardCenter - windowCenter;
                const factor = distance / window.innerHeight;

                // Subtle parallax shift
                const offset = factor * 20;
                card.style.transform = `translateX(${8 - Math.abs(offset)}px) translateY(${offset * 0.5}px)`;
            });
        }, { passive: true });
    }

    // ==================== TIMELINE MARKER ANIMATION ====================
    function setupTimelineMarkers() {
        const markers = document.querySelectorAll('.performance-card::before');
        // Using Intersection Observer for timeline dots
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.boxShadow = '0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.3)';
                        entry.target.style.transform = 'translate(-50%, -50%) scale(1.3)';
                        entry.target.style.transition = 'all 0.5s ease';
                    }
                });
            },
            { threshold: 0.5 }
        );
    }

    // ==================== TIER HIGHLIGHT ON HOVER ====================
    function setupTierHighlights() {
        const tiers = $$('.tier');
        tiers.forEach((tier) => {
            tier.addEventListener('mouseenter', () => {
                tier.style.borderColor = 'rgba(212,175,55,0.3)';
                tier.style.boxShadow = '0 0 30px rgba(212,175,55,0.08)';
            });
            tier.addEventListener('mouseleave', () => {
                tier.style.borderColor = 'rgba(212,175,55,0.1)';
                tier.style.boxShadow = 'none';
            });
        });
    }

    // ==================== SEAT TOOLTIP ====================
    function setupSeatTooltips() {
        const seats = $$('.seat.available, .seat.booked, .box.box-open, .box.box-closed');
        let tooltip = null;

        seats.forEach((seat) => {
            seat.addEventListener('mouseenter', (e) => {
                tooltip = document.createElement('div');
                tooltip.className = 'seat-tooltip';
                const id = seat.getAttribute('data-seat');
                const tier = seat.getAttribute('data-tier');
                const tierNames = {
                    orchestra: 'Orchestra',
                    mezzanine: 'Mezzanine',
                    grand: 'Grand Tier',
                    upper: 'Upper Circle',
                    gallery: 'Gallery',
                };

                let html = `<strong>Seat ${id}</strong><br>Tier: ${tierNames[tier] || tier}`;

                if (seat.classList.contains('available')) {
                    const prices = getTierPrice(tier);
                    const price = getRandomPrice(prices.min, prices.max);
                    html += `<br>Price: €${price}.00<br><em style="color: #4a8; font-size: 11px;">Click to reserve</em>`;
                    tooltip.style.borderColor = 'rgba(74,222,128,0.5)';
                    tooltip.style.color = '#4a8';
                } else if (seat.classList.contains('booked')) {
                    html += `<br><span style="color: #a44;">Already Booked</span>`;
                    tooltip.style.borderColor = 'rgba(212,175,55,0.3)';
                    tooltip.style.color = 'var(--warm-gray)';
                } else {
                    tooltip.style.borderColor = 'rgba(212,175,55,0.3)';
                }

                tooltip.innerHTML = html;
                document.body.appendChild(tooltip);

                const rect = seat.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - 45) + 'px';
                tooltip.style.transform = 'translateX(-50%)';
                tooltip.style.opacity = '1';
            });

            seat.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            });
        });
    }

    // ==================== PERFORMANCE CARD COUNTDOWN RIBBONS ====================
    function setupRibbons() {
        const ribbons = $$('.performance-card__ribbon');
        ribbons.forEach((ribbon) => {
            // Add subtle shimmer
            ribbon.addEventListener('mouseenter', () => {
                ribbon.style.boxShadow = '0 0 15px rgba(212,175,55,0.4)';
            });
            ribbon.addEventListener('mouseleave', () => {
                ribbon.style.boxShadow = 'none';
            });
        });
    }

    // ==================== KEYBOARD ACCESSIBILITY ====================
    function setupKeyboardNavigation() {
        const seats = $$('.seat.available, .box.box-open');
        seats.forEach((seat) => {
            seat.setAttribute('tabindex', '0');
            seat.setAttribute('role', 'button');
            seat.setAttribute('aria-label', `Seat ${seat.getAttribute('data-seat')} in ${seat.getAttribute('data-tier')} tier`);

            seat.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    seat.click();
                }
            });
        });
    }

    // ==================== SMOOTH SCROLL FOR ANCHORS ====================
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ==================== BACKGROUND PARTICLE CONSTELLATION ====================
    function setupConstellation() {
        const hero = $('.hero-section');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let stars = [];

        function resize() {
            canvas.width = hero.offsetWidth * window.devicePixelRatio;
            canvas.height = hero.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function createStars() {
            stars = [];
            const count = Math.floor((canvas.width * canvas.height) / 8000);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * canvas.width / window.devicePixelRatio,
                    y: Math.random() * canvas.height / window.devicePixelRatio,
                    radius: Math.random() * 1.5 + 0.3,
                    alpha: Math.random() * 0.5 + 0.1,
                    speed: Math.random() * 0.005 + 0.002,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        function drawStars(time) {
            ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
            stars.forEach((star) => {
                const flicker = Math.sin(time * star.speed + star.phase) * 0.3 + 0.7;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 140, ${star.alpha * flicker})`;
                ctx.fill();
            });
            requestAnimationFrame(drawStars);
        }

        resize();
        createStars();
        window.addEventListener('resize', () => { resize(); createStars(); });
        requestAnimationFrame(drawStars);
    }

    // ==================== INITIALIZATION ====================
    function init() {
        console.log('🏛 Teatro della Corona d\'Oro — Initializing...');

        // Open curtain
        openCurtain().then(() => {
            console.log('🎭 Curtain opened. Showtime!');

            // Initialize all interactive features after curtain opens
            setupScrollReveals();
            setupChandelierInteraction();
            setupLightCaustics();
            setupPerformerSpotlights();
            setupSeatSelection();
            setupModalClose();
            setupBookButtons();
            setupHeaderScrollEffect();
            setupCounterAnimation();
            setupPerformerReveal();
            setupTierHighlights();
            setupSeatTooltips();
            setupRibbons();
            setupKeyboardNavigation();

            // Create ambient effects
            createDustParticles();
            setupConstellation();
        });

        // Non-blocking setup
        setupParallaxEffect();
        setupSmoothScroll();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();