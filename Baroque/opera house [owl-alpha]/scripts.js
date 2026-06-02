/* ==========================================================================
   THÉÂTRE ROYAL DE LA COUR — SCRIPT BAROQUE
   Orchestration of theatrical effects and interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================================
       1. CURTAIN REVEAL — The Grand Opening
       ===================================================================== */
    const curtainLeft = document.getElementById('curtain-left');
    const curtainRight = document.getElementById('curtain-right');
    const curtainValance = document.getElementById('curtain-valance');
    const body = document.body;

    setTimeout(() => {
        curtainLeft.classList.add('reveal');
        curtainRight.classList.add('reveal');
        curtainValance.classList.add('reveal');
    }, 300);

    setTimeout(() => {
        body.classList.add('loaded');
    }, 600);

    setTimeout(() => {
        curtainLeft.style.display = 'none';
        curtainRight.style.display = 'none';
        curtainValance.style.display = 'none';
    }, 3500);


    /* =====================================================================
       2. CHANDELIER LIGHT PATTERNS — Moving Candlelight
       ===================================================================== */
    const chandelier = document.getElementById('chandelier');
    const lightPatterns = document.getElementById('light-patterns');
    const chandelierGlow = document.getElementById('chandelier-glow');

    function updateChandelierPosition() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        if (scrollY < viewportHeight) {
            const opacity = Math.max(0, 1 - scrollY / viewportHeight);
            const scale = 1 - scrollY / (viewportHeight * 3);
            chandelier.style.opacity = opacity;
            chandelier.style.transform = `translateX(-50%) scale(${Math.max(0.3, scale)})`;
        }
    }

    window.addEventListener('scroll', updateChandelierPosition, { passive: true });


    /* =====================================================================
       3. SPOTLIGHT EFFECT ON PERFORMER CARDS
       ===================================================================== */
    const spotlightOverlay = document.getElementById('spotlight-overlay');
    const performerCards = document.querySelectorAll('.performer-card');

    performerCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            spotlightOverlay.classList.add('active');
            updateSpotlight(e);
        });

        card.addEventListener('mousemove', (e) => {
            updateSpotlight(e);
        });

        card.addEventListener('mouseleave', () => {
            spotlightOverlay.classList.remove('active');
        });
    });

    function updateSpotlight(event) {
        const x = event.clientX;
        const y = event.clientY;
        spotlightOverlay.style.background = `radial-gradient(
            circle 120px at ${x}px ${y}px,
            transparent 0%,
            rgba(13, 5, 5, 0.7) 100%
        )`;
    }


    /* =====================================================================
       4. SCROLL-TRIGGERED REVEALS — Opera & Performer Cards
       ===================================================================== */
    const operaCards = document.querySelectorAll('.opera-card');
    const scrollRevealCards = document.querySelectorAll('.performer-card, .opera-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    operaCards.forEach((card, index) => {
        card.dataset.revealDelay = (index * 150).toString();
        revealObserver.observe(card);
    });

    const performerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                performerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.performer-card').forEach((card, index) => {
        card.dataset.revealDelay = (index * 120).toString();
        performerObserver.observe(card);
    });


    /* =====================================================================
       5. SEATING CHART INTERACTIONS
       ===================================================================== */
    const seats = document.querySelectorAll('.seat[data-seat]');
    const loges = document.querySelectorAll('.loge[data-tier]');
    const tierSelect = document.getElementById('tier-select');

    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            const tier = seat.closest('[data-tier]')?.dataset.tier;
            if (tier && tierSelect) {
                for (let i = 0; i < tierSelect.options.length; i++) {
                    if (tierSelect.options[i].value === tier) {
                        tierSelect.selectedIndex = i;
                        tierSelect.style.borderColor = 'var(--gold-bright)';
                        tierSelect.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)';
                        setTimeout(() => {
                            tierSelect.style.borderColor = 'var(--gold-dark)';
                            tierSelect.style.boxShadow = 'none';
                        }, 2000);
                        break;
                    }
                }
            }
        });

        seat.addEventListener('mouseenter', () => {
            seat.style.zIndex = '10';
        });

        seat.addEventListener('mouseleave', () => {
            seat.style.zIndex = '';
        });
    });

    loges.forEach(loge => {
        loge.addEventListener('click', () => {
            const tier = loge.dataset.tier;
            if (tier === 'royale') {
                showRoyalNotification();
                return;
            }
            if (tierSelect) {
                for (let i = 0; i < tierSelect.options.length; i++) {
                    if (tierSelect.options[i].value === 'parterre') {
                        tierSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });

    function showRoyalNotification() {
        const notification = document.createElement('div');
        notification.textContent = '✦ Loge Royale — Sur Invitation Uniquement ✦';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1.5rem 2.5rem;
            font-family: 'Cinzel Decorative', serif;
            font-size: 0.9rem;
            letter-spacing: 0.15em;
            color: var(--gold-bright);
            background: linear-gradient(135deg, rgba(58, 10, 10, 0.97), rgba(13, 5, 5, 0.97));
            border: 2px solid var(--gold-bright);
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.2), 0 20px 60px rgba(0, 0, 0, 0.8);
            z-index: 10000;
            text-align: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }


    /* =====================================================================
       6. NAVIGATION SMOOTH SCROLL & ACTIVE STATE
       ===================================================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.royal-nav')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gold-bright)' : 'var(--gold-pale)';
                    link.style.borderColor = link.getAttribute('href') === `#${id}` ? 'var(--gold-dark)' : 'transparent';
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => navObserver.observe(section));


    /* =====================================================================
       7. RESERVATION FORM HANDLING
       ===================================================================== */
    const reservationForm = document.getElementById('reservation-form');

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const opera = document.getElementById('opera-select').value;
        const name = document.getElementById('name-input').value.trim();
        const tier = document.getElementById('tier-select').value;

        if (!opera || !name || !tier) {
            showFormNotification('Veuillez remplir tous les champs, s\'il vous plaît.', 'error');
            return;
        }

        const submitBtn = reservationForm.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="submit-text">Traitement...</span>';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<span class="submit-text">✦ Requête Acceptée ✦</span>';
            submitBtn.style.opacity = '1';
            submitBtn.style.borderColor = 'var(--gold-bright)';
            submitBtn.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';

            showFormNotification(
                `Merci, ${name}. Votre requête pour "${getOperaTitle(opera)}" en ${getTierLabel(tier)} a été enregistrée. Un huissier vous contactera sous peu.`,
                'success'
            );

            reservationForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.borderColor = 'var(--gold-dark)';
                submitBtn.style.boxShadow = 'none';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    function getOperaTitle(value) {
        const titles = {
            'armide': 'Armide',
            'atys': 'Atys',
            'persee': 'Persée',
            'phaeton': 'Phaëton',
            'isis': 'Isis',
            'proserpine': 'Proserpine'
        };
        return titles[value] || value;
    }

    function getTierLabel(value) {
        const labels = {
            'parterre': 'Le Parterre',
            'première': 'Première Loge',
            'premiere': 'Première Loge',
            'deuxième': 'Deuxième Loge',
            'deuxieme': 'Deuxième Loge',
            'amphithéâtre': 'L\'Amphithéâtre',
            'amphitheatre': 'L\'Amphithéâtre',
            'paradis': 'Le Paradis'
        };
        return labels[value] || value;
    }

    function showFormNotification(message, type) {
        const existing = document.querySelector('.form-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1.5rem 2.5rem;
            font-family: 'Cormorant Garamond', serif;
            font-size: 1rem;
            font-style: italic;
            line-height: 1.6;
            color: ${type === 'error' ? 'var(--crimson-light)' : 'var(--cream)'};
            background: linear-gradient(135deg, rgba(58, 10, 10, 0.97), rgba(13, 5, 5, 0.97));
            border: 2px solid ${type === 'error' ? 'var(--crimson-light)' : 'var(--gold-bright)'};
            box-shadow: 0 0 40px rgba(255, 215, 0, ${type === 'error' ? '0.1' : '0.2'}), 0 20px 60px rgba(0, 0, 0, 0.8);
            z-index: 10000;
            text-align: center;
            max-width: 400px;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }


    /* =====================================================================
       8. OPERA CARD BUTTON HANDLING
       ===================================================================== */
    const cardButtons = document.querySelectorAll('.card-button');

    cardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const opera = button.closest('.opera-card').dataset.opera;
            const operaSelect = document.getElementById('opera-select');

            if (operaSelect) {
                for (let i = 0; i < operaSelect.options.length; i++) {
                    if (operaSelect.options[i].value === opera) {
                        operaSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            const reservationsSection = document.getElementById('reservations');
            if (reservationsSection) {
                const navHeight = document.querySelector('.royal-nav')?.offsetHeight || 0;
                const targetPosition = reservationsSection.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* =====================================================================
       9. PARALLAX EFFECTS ON HERO ELEMENTS
       ===================================================================== */
    const heroInner = document.querySelector('.hero-inner');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (heroInner && scrollY < window.innerHeight) {
            heroInner.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroInner.style.opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
        }
    }, { passive: true });


    /* =====================================================================
       10. CANDLE FLAME INTENSITY VARIATION
       ===================================================================== */
    const flames = document.querySelectorAll('.candle-flame');

    setInterval(() => {
        flames.forEach(flame => {
            const randomScale = 0.85 + Math.random() * 0.3;
            const randomRotate = -3 + Math.random() * 6;
            flame.style.transform = `translateX(-50%) scale(${randomScale}) rotate(${randomRotate}deg)`;
        });
    }, 150);


    /* =====================================================================
       11. GOLD SHIMMER PHASE OFFSET FOR VISUAL RICHNESS
       ===================================================================== */
    const goldElements = document.querySelectorAll('.card-frame, .performer-frame, .form-frame');

    goldElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.8}s`;
    });


    /* =====================================================================
       12. KEYBOARD NAVIGATION SUPPORT
       ===================================================================== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.form-notification');
            notifications.forEach(n => n.remove());
        }
    });


    /* =====================================================================
       13. INITIALIZATION COMPLETE LOG
       ===================================================================== */
    console.log('%c✦ Théâtre Royal de la Cour — Saison MMVXXV ✦', 'color: #d4a843; font-family: Georgia, serif; font-size: 14px; font-style: italic;');
    console.log('%c"Ut Musica Sic Anima"', 'color: #b8860b; font-family: Georgia, serif; font-size: 11px; font-style: italic;');

});