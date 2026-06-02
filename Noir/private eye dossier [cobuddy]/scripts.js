document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX - 3 + 'px';
        cursorDot.style.top = mouseY - 3 + 'px';
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX - 14 + 'px';
        cursorRing.style.top = ringY - 14 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Smoke cursor trail
    const smokeCanvas = document.getElementById('smoke-canvas');
    const smokeCtx = smokeCanvas.getContext('2d');
    let smokeParticles = [];

    function resizeSmokeCanvas() {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;
    }
    resizeSmokeCanvas();
    window.addEventListener('resize', resizeSmokeCanvas);

    class SmokeParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 3;
            this.maxSize = Math.random() * 30 + 20;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -0.8 - 0.2;
            this.opacity = 0.15;
            this.life = 1;
            this.decay = Math.random() * 0.008 + 0.003;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size += 0.3;
            this.life -= this.decay;
            this.opacity = Math.max(0, this.life * 0.15);
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(180, 170, 150, ' + this.opacity + ')';
            ctx.fill();
        }
    }

    let lastSmokeTime = 0;
    const smokeInterval = 40;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSmokeTime > smokeInterval) {
            for (let i = 0; i < 2; i++) {
                smokeParticles.push(new SmokeParticle(e.clientX + (Math.random() - 0.5) * 10, e.clientY + (Math.random() - 0.5) * 10));
            }
            lastSmokeTime = now;
        }
    });

    function animateSmoke() {
        smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

        smokeParticles.forEach((p, index) => {
            p.update();
            p.draw(smokeCtx);
            if (p.life <= 0) {
                smokeParticles.splice(index, 1);
            }
        });

        requestAnimationFrame(animateSmoke);
    }
    animateSmoke();

    // Rain on glass effect
    let raindrops = [];

    function createRaindrop() {
        const drop = document.createElement('div');
        drop.style.cssText = 'position: fixed; width: 1px; height: ' + (Math.random() * 60 + 20) + 'px; background: linear-gradient(to bottom, transparent, rgba(200, 200, 200, 0.08)); left: ' + (Math.random() * 100) + '%; top: -' + (Math.random() * 100) + 'px; pointer-events: none; z-index: 101; border-radius: 1px; animation: raindrop-fall ' + (Math.random() * 1.5 + 0.8) + 's linear forwards;';
        document.body.appendChild(drop);

        setTimeout(() => drop.remove(), 2500);
    }

    const rainStyleSheet = document.createElement('style');
    rainStyleSheet.textContent = '@keyframes raindrop-fall { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } }';
    document.head.appendChild(rainStyleSheet);

    setInterval(createRaindrop, 80);

    // Venetian blinds - mouse parallax
    const blinds = document.querySelectorAll('.blind');
    document.addEventListener('mousemove', (e) => {
        const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
        blinds.forEach((blind, i) => {
            const depth = (i + 1) * 0.5;
            blind.style.transform = 'skewX(' + (xRatio * depth) + 'deg)';
        });
    });

    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.tab-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetTab) {
                    section.classList.add('active');
                }
            });

            if (targetTab === 'corkboard') {
                animateCorkboardItems();
            }
        });
    });

    // Corkboard pin interactions
    const pins = document.querySelectorAll('.pin');
    pins.forEach(pin => {
        pin.addEventListener('click', () => {
            pin.style.transform = 'translate(-50%, -50%) scale(1.5)';
            setTimeout(() => {
                pin.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 300);
        });

        pin.addEventListener('mouseenter', () => {
            pin.style.boxShadow = '0 0 10px rgba(139, 0, 0, 0.5), 0 2px 4px rgba(0,0,0,0.5)';
        });

        pin.addEventListener('mouseleave', () => {
            pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)';
        });
    });

    // Corkboard items stagger animation
    function animateCorkboardItems() {
        const items = document.querySelectorAll('.cork-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) rotate(0deg)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = '';
            }, index * 100);
        });
    }

    // Typewriter effect for case notes
    const notePages = document.querySelectorAll('.note-page');
    notePages.forEach((page, pageIndex) => {
        const paragraphs = page.querySelectorAll('.note-body p');
        paragraphs.forEach((p, pIndex) => {
            p.style.cssText = 'overflow: hidden; white-space: nowrap; border-right: 2px solid #333; animation: typewriter-reveal ' + (2 + pIndex * 0.5) + 's steps(40) ' + (pageIndex * 0.3 + pIndex * 0.2) + 's forwards; width: 0;';
        });
    });

    const typewriterStyle = document.createElement('style');
    typewriterStyle.textContent = '@keyframes typewriter-reveal { 0% { width: 0; border-right: 2px solid #333; } 95% { border-right: 2px solid #333; } 100% { width: 100%; border-right: none; } }';
    document.head.appendChild(typewriterStyle);

    // Redacted text hover reveal
    const redactedTexts = document.querySelectorAll('.redacted');
    redactedTexts.forEach(text => {
        text.style.cursor = 'pointer';
        text.title = 'Click to reveal';

        text.addEventListener('click', () => {
            text.style.transition = 'all 0.5s ease';
            text.style.filter = 'blur(0px)';
            text.style.transform = 'scale(1.02)';
        });
    });

    // Evidence item click to zoom
    const evidenceItems = document.querySelectorAll('.evidence-item');
    evidenceItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(1.02)';
            setTimeout(() => {
                item.style.transform = '';
            }, 300);
        });
    });

    // Suspect card tilt effect
    const suspectCards = document.querySelectorAll('.suspect-card');
    suspectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Nav tab hover effect
    navTabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            tab.style.textShadow = '0 0 10px rgba(139, 0, 0, 0.3)';
        });
        tab.addEventListener('mouseleave', () => {
            tab.style.textShadow = 'none';
        });
    });

    // Page load stagger effect
    const allElements = document.querySelectorAll('.case-header, .case-nav, .tab-section');
    allElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 150);
    });

    // Footer stamp hover
    const footerStamp = document.querySelector('.footer-stamp');
    if (footerStamp) {
        footerStamp.addEventListener('mouseenter', () => {
            footerStamp.style.transform = 'rotate(-5deg) scale(1.05)';
        });
        footerStamp.addEventListener('mouseleave', () => {
            footerStamp.style.transform = 'rotate(-2deg) scale(1)';
        });
    }

    // Evidence placeholder hover
    const evidencePlaceholders = document.querySelectorAll('.evidence-placeholder');
    evidencePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('mouseenter', () => {
            placeholder.style.transform = 'scale(1.05)';
            placeholder.style.transition = 'transform 0.3s ease';
        });
        placeholder.addEventListener('mouseleave', () => {
            placeholder.style.transform = 'scale(1)';
        });
    });

    // Witness statement toggle
    const witnessStatements = document.querySelectorAll('.witness-statement');
    witnessStatements.forEach(statement => {
        const text = statement.querySelector('.statement-text');
        text.style.maxHeight = text.scrollHeight + 'px';
        text.style.transition = 'max-height 0.5s ease, padding 0.3s ease';

        statement.addEventListener('click', () => {
            if (text.style.maxHeight && text.style.maxHeight !== '0px') {
                text.style.maxHeight = '0px';
                text.style.paddingTop = '0';
                text.style.paddingBottom = '0';
            } else {
                text.style.maxHeight = text.scrollHeight + 'px';
                text.style.paddingTop = '12px';
                text.style.paddingBottom = '12px';
            }
        });
    });

    // Conspiracy thread SVG pulse
    const threads = document.querySelectorAll('.thread');
    threads.forEach((thread, i) => {
        thread.style.animationDelay = (i * 0.8) + 's';
    });

    // Screen flicker on load
    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
        if (flickerCount < 3) {
            document.body.style.opacity = '0.97';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
            flickerCount++;
        } else {
            clearInterval(flickerInterval);
        }
    }, 800);

    // Status badges pulse
    const statusBadges = document.querySelectorAll('.status-wanted');
    statusBadges.forEach(badge => {
        setInterval(() => {
            badge.style.textShadow = '0 0 8px rgba(204, 34, 34, 0.4)';
            setTimeout(() => {
                badge.style.textShadow = 'none';
            }, 800);
        }, 3000);
    });

    // Keyboard navigation for tabs
    document.addEventListener('keydown', (e) => {
        const activeIndex = Array.from(navTabs).findIndex(t => t.classList.contains('active'));
        if (e.key === 'ArrowRight' && activeIndex < navTabs.length - 1) {
            navTabs[activeIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
            navTabs[activeIndex - 1].click();
        }
    });

    // Print evidence numbers
    const evidenceSpanElements = document.querySelectorAll('.evidence-placeholder span');
    evidenceSpanElements.forEach((span, i) => {
        span.textContent = 'EVIDENCE #' + (i + 1);
    });

    // Final note redacted text stagger reveal on scroll
    const finalNote = document.querySelector('.final-note');
    if (finalNote) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const redactedParagraphs = entry.target.querySelectorAll('.redacted');
                    redactedParagraphs.forEach((p, i) => {
                        setTimeout(() => {
                            p.style.transition = 'all 0.8s ease';
                            p.style.filter = 'blur(0px)';
                            p.style.opacity = '1';
                        }, i * 400);
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(finalNote);
    }

    // Corkboard item pin hover
    const corkItems = document.querySelectorAll('.cork-item');
    corkItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const pin = item.querySelector('.pin');
            if (pin) {
                pin.style.transform = 'translate(-50%, -50%) scale(1.4)';
                pin.style.boxShadow = '0 0 15px rgba(139, 0, 0, 0.6)';
            }
        });
        item.addEventListener('mouseleave', () => {
            const pin = item.querySelector('.pin');
            if (pin) {
                pin.style.transform = 'translate(-50%, -50%) scale(1)';
                pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)';
            }
        });
    });

    console.log('Case file system loaded. Detective Calloway would approve.');
});