document.addEventListener('DOMContentLoaded', () => {

    // ===== FILTER FUNCTIONALITY =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.character-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach((card, index) => {
                const faction = card.dataset.faction;

                if (filter === 'all' || faction === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    // Stagger reveal
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== GLITCH EFFECT ON LOGO =====
    const glitchLogo = document.querySelector('.glitch-logo h1');
    const originalText = glitchLogo.innerHTML;

    function triggerGlitch() {
        const chars = originalText.split('');
        const glitchChars = '█▓▒░╔╗╚╝║═';
        let glitched = '';

        for (let i = 0; i < chars.length; i++) {
            if (chars[i] === ' ') {
                glitched += chars[i];
            } else if (Math.random() > 0.85) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += chars[i];
            }
        }

        glitchLogo.innerHTML = glitched;

        setTimeout(() => {
            glitchLogo.innerHTML = originalText;
        }, 100);
    }

    // Glitch on load and periodically
    setTimeout(triggerGlitch, 500);
    setInterval(triggerGlitch, 5000);

    // ===== PORTRAIT SCAN LINE ON HOVER =====
    cards.forEach(card => {
        const portraitScan = card.querySelector('.portrait-scan');
        if (portraitScan) {
            card.addEventListener('mouseenter', () => {
                portraitScan.style.opacity = '0.8';
            });
            card.addEventListener('mouseleave', () => {
                portraitScan.style.opacity = '0';
            });
        }
    });

    // ===== STAT BAR ANIMATION ON SCROLL =====
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statFills = entry.target.querySelectorAll('.stat-fill, .mutation-fill');
                statFills.forEach(fill => {
                    const width = fill.style.getPropertyValue('--fill') || fill.style.getPropertyValue('--mutation');
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
            }
        });
    }, observerOptions);

    cards.forEach(card => statsObserver.observe(card));

    // ===== CARD TILT EFFECT =====
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ===== TYPING EFFECT FOR HEADER SUBTITLE =====
    const subtitleEl = document.querySelector('.header-subtitle');
    const subtitleText = subtitleEl.textContent;
    subtitleEl.textContent = '';
    subtitleEl.style.opacity = '0';

    let charIndex = 0;
    function typeSubtitle() {
        if (charIndex < subtitleText.length) {
            subtitleEl.textContent += subtitleText[charIndex];
            charIndex++;
            setTimeout(typeSubtitle, 30);
        } else {
            subtitleEl.style.opacity = '1';
        }
    }

    setTimeout(typeSubtitle, 800);

    // ===== SKILL TAG POP ON HOVER =====
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) translateY(-2px)';
            this.style.boxShadow = '0 0 8px rgba(0, 255, 65, 0.2)';
        });
        tag.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // ===== RANDOM BIOSCAN DATA ON LOAD =====
    const terminalFooter = document.querySelector('.footer-text');
    const originalFooter = terminalFooter.innerHTML;

    function updateFooterStats() {
        const subjects = document.querySelectorAll('.character-card').length;
        const uptime = Math.floor(Math.random() * 999) + 100;
        terminalFooter.innerHTML = `
            <span class="footer-label">SYSTEM:</span> BIO_TERMINAL v2.07.1 &nbsp;|&nbsp;
            <span class="footer-label">STATUS:</span> DEGRADED &nbsp;|&nbsp;
            <span class="footer-label">SUBJECTS:</span> ${subjects}/6 LOADED &nbsp;|&nbsp;
            <span class="footer-label">UPTIME:</span> ${uptime}h &nbsp;|&nbsp;
            <span class="footer-label">MEM:</span> ${Math.floor(Math.random() * 30 + 60)}%
        `;
    }

    setTimeout(updateFooterStats, 2000);

    // ===== CORNER DECORATION FLICKER =====
    function flickerCorners() {
        const corners = document.querySelectorAll('.portrait-frame');
        corners.forEach(corner => {
            if (Math.random() > 0.95) {
                corner.style.borderColor = 'rgba(0, 255, 65, 0.4)';
                setTimeout(() => {
                    corner.style.borderColor = '';
                }, 150);
            }
        });
    }

    setInterval(flickerCorners, 300);

    // ===== INITIALIZE STAT BARS FOR VISIBLE CARDS =====
    const initObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.stat-fill, .mutation-fill');
                fills.forEach(fill => {
                    const val = fill.style.getPropertyValue('--fill') || fill.style.getPropertyValue('--mutation');
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = val;
                    }, 200);
                });
                initObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => initObserver.observe(card));

    // ===== ENHANCED FILTER BUTTON FEEDBACK =====
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Brief flash on the header line
            const headerLine = document.querySelector('.header-line');
            headerLine.style.opacity = '0.8';
            setTimeout(() => {
                headerLine.style.opacity = '0.3';
            }, 200);
        });
    });

    // ===== MOUSE TRACKING CURSOR GLOW =====
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // ===== AMBIENT TERMINAL MESSAGES =====
    const messages = [
        'SCANNING BIO-SIGNATURES...',
        'MUTATION DATABASE UPDATED',
        'FACTION LOYALTY CHECK: PASS',
        'CONTAMINATION ALERT: SECTOR 7',
        'ARCHIVE SYNC: 3 FRAGMENTS FOUND',
        'BIO-LOCK: AUTHORIZED',
        'SPORULATION INDEX: NOMINAL',
        'D.N.A. SEQUENCE VERIFIED'
    ];

    const statusText = document.querySelector('.status-text');
    let msgIndex = 0;

    function rotateMessage() {
        statusText.style.opacity = '0';
        setTimeout(() => {
            statusText.textContent = `ARCHIVE v2.07.1 — ${messages[msgIndex]}`;
            statusText.style.opacity = '1';
            msgIndex = (msgIndex + 1) % messages.length;
        }, 300);
    }

    setInterval(rotateMessage, 4000);
    statusText.style.transition = 'opacity 0.3s';

    // ===== CARD CLICK - EXPAND DETAIL =====
    cards.forEach(card => {
        card.addEventListener('dblclick', () => {
            card.style.zIndex = '100';
            card.style.boxShadow = `
                0 0 40px rgba(0,255,65,0.15),
                0 0 80px rgba(0,255,65,0.05),
                0 16px 60px rgba(0,0,0,0.7)
            `;
            card.style.borderColor = 'rgba(0,255,65,0.4)';

            // Flash the portrait frame
            const frame = card.querySelector('.portrait-frame');
            if (frame) {
                frame.style.borderColor = 'rgba(0,255,65,0.6)';
                setTimeout(() => {
                    frame.style.borderColor = '';
                }, 500);
            }

            // Scale up briefly
            card.style.transform = 'scale(1.02) translateY(-4px)';

            setTimeout(() => {
                card.style.zIndex = '';
                card.style.boxShadow = '';
                card.style.borderColor = '';
                card.style.transform = '';
            }, 2000);
        });
    });

    // ===== PIXELATED SELECT INDICATOR =====
    const bodyStyle = document.createElement('style');
    bodyStyle.textContent = `
        .cursor-glow { display: block; }
        ::selection {
            background: rgba(0, 255, 65, 0.3);
            color: #c8f0c8;
        }
    `;
    document.head.appendChild(bodyStyle);

});