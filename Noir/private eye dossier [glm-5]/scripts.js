document.addEventListener('DOMContentLoaded', function() {

    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    if (targetSection === 'corkboard') {
                        setTimeout(drawAllConnections, 100);
                    }
                }
            });
        });
    });

    const smokeContainer = document.getElementById('smokeContainer');
    let lastSmokeTime = 0;
    const smokeThrottle = 50;

    document.addEventListener('mousemove', function(e) {
        const currentTime = Date.now();
        if (currentTime - lastSmokeTime < smokeThrottle) return;
        lastSmokeTime = currentTime;

        const smoke = document.createElement('div');
        smoke.className = 'smoke-wisp';
        smoke.style.left = (e.clientX - 50) + 'px';
        smoke.style.top = (e.clientY - 50) + 'px';
        smokeContainer.appendChild(smoke);

        setTimeout(function() {
            if (smoke.parentNode) {
                smoke.parentNode.removeChild(smoke);
            }
        }, 4000);
    });

    const typewriterLines = document.querySelectorAll('.typewriter-line');
    let typewriterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.5 });

    typewriterLines.forEach(function(line) {
        line.style.animationPlayState = 'paused';
        typewriterObserver.observe(line);
    });

    const corkboard = document.getElementById('conspiracyBoard');
    const threadCanvas = document.getElementById('threadCanvas');
    const boardItems = document.querySelectorAll('.board-item');

    const connections = [
        { from: 'victoria', to: 'victim1' },
        { from: 'victoria', to: 'club' },
        { from: 'victoria', to: 'blackmail' },
        { from: 'raymond', to: 'vinnie' },
        { from: 'raymond', to: 'victim1' },
        { from: 'vinnie', to: 'club' },
        { from: 'vinnie', to: 'money' },
        { from: 'senator', to: 'vinnie' },
        { from: 'senator', to: 'photo' },
        { from: 'senator', to: 'victim2' },
        { from: 'victim1', to: 'blackmail' },
        { from: 'club', to: 'victim2' },
        { from: 'money', to: 'senator' }
    ];

    let draggedItem = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isDragging = false;

    boardItems.forEach(function(item) {
        item.addEventListener('mousedown', startDrag);
        item.addEventListener('touchstart', startDrag, { passive: false });
    });

    function startDrag(e) {
        e.preventDefault();
        draggedItem = this;
        draggedItem.classList.add('dragging');

        const rect = draggedItem.getBoundingClientRect();
        const boardRect = corkboard.getBoundingClientRect();

        if (e.type === 'touchstart') {
            dragOffsetX = e.touches[0].clientX - rect.left;
            dragOffsetY = e.touches[0].clientY - rect.top;
        } else {
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
        }

        isDragging = true;

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', doDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function doDrag(e) {
        if (!isDragging || !draggedItem) return;

        e.preventDefault();

        const boardRect = corkboard.getBoundingClientRect();
        let clientX, clientY;

        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        let newLeft = ((clientX - boardRect.left - dragOffsetX) / boardRect.width) * 100;
        let newTop = ((clientY - boardRect.top - dragOffsetY) / boardRect.height) * 100;

        newLeft = Math.max(0, Math.min(95, newLeft));
        newTop = Math.max(0, Math.min(90, newTop));

        draggedItem.style.left = newLeft + '%';
        draggedItem.style.top = newTop + '%';

        drawAllConnections();
    }

    function endDrag() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
        isDragging = false;

        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', doDrag);
        document.removeEventListener('touchend', endDrag);
    }

    function drawAllConnections() {
        if (!threadCanvas) return;

        const boardRect = corkboard.getBoundingClientRect();
        threadCanvas.setAttribute('width', boardRect.width);
        threadCanvas.setAttribute('height', boardRect.height);

        threadCanvas.innerHTML = '';

        connections.forEach(function(connection, index) {
            const fromElement = document.querySelector('[data-node="' + connection.from + '"]');
            const toElement = document.querySelector('[data-node="' + connection.to + '"]');

            if (!fromElement || !toElement) return;

            const fromRect = fromElement.getBoundingClientRect();
            const toRect = toElement.getBoundingClientRect();

            const fromX = fromRect.left + fromRect.width / 2 - boardRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - boardRect.top;
            const toX = toRect.left + toRect.width / 2 - boardRect.left;
            const toY = toRect.top + toRect.height / 2 - boardRect.top;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            const offset = (Math.random() - 0.5) * 50;

            const controlX1 = fromX + (midX - fromX) * 0.5 + offset;
            const controlY1 = fromY + (midY - fromY) * 0.5 + offset;
            const controlX2 = toX - (toX - midX) * 0.5 + offset;
            const controlY2 = toY - (toY - midY) * 0.5 + offset;

            const d = 'M ' + fromX + ' ' + fromY + 
                      ' C ' + controlX1 + ' ' + controlY1 + ', ' + 
                      controlX2 + ' ' + controlY2 + ', ' + 
                      toX + ' ' + toY;

            path.setAttribute('d', d);
            path.setAttribute('class', 'thread-line');
            path.setAttribute('stroke-opacity', '0.8');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#8b0000');

            const length = path.getTotalLength ? path.getTotalLength() : 300;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = 'drawThread 1s ease forwards ' + (index * 0.1) + 's';

            threadCanvas.appendChild(path);
        });
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = '@keyframes drawThread { to { stroke-dashoffset: 0; } }';
    document.head.appendChild(styleSheet);

    if (corkboard) {
        setTimeout(drawAllConnections, 500);
    }

    window.addEventListener('resize', function() {
        if (document.getElementById('corkboard').classList.contains('active')) {
            drawAllConnections();
        }
    });

    const evidenceItems = document.querySelectorAll('.evidence-item');
    evidenceItems.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    const suspectCards = document.querySelectorAll('.suspect-card');
    suspectCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const dangerFill = this.querySelector('.danger-fill');
            if (dangerFill) {
                dangerFill.style.transition = 'width 0.5s ease';
            }
        });
    });

    const stamps = document.querySelectorAll('.stamp');
    stamps.forEach(function(stamp) {
        stamp.style.animation = 'stampAppear 0.3s ease forwards';
    });

    const stampAnimation = document.createElement('style');
    stampAnimation.textContent = '@keyframes stampAppear { 0% { transform: scale(2) rotate(' + (Math.random() * 20 - 10) + 'deg); opacity: 0; } 50% { transform: scale(0.9) rotate(' + (Math.random() * 10 - 5) + 'deg); } 100% { transform: scale(1) rotate(' + (stamp.textContent === 'CONFIDENTIAL' ? '-5' : '3') + 'deg); opacity: 0.9; } }';
    document.head.appendChild(stampAnimation);

    function createRaindrop() {
        const drops = document.querySelector('.rain-drops');
        if (!drops) return;

        const drop = document.createElement('div');
        drop.style.cssText = 'position: absolute; width: 1px; height: 20px; background: linear-gradient(transparent, rgba(200, 200, 200, 0.3)); left: ' + Math.random() * 100 + '%; top: -20px; animation: rainDrop ' + (0.5 + Math.random() * 0.5) + 's linear forwards;';
        drops.appendChild(drop);

        setTimeout(function() {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        }, 1500);
    }

    const rainAnimation = document.createElement('style');
    rainAnimation.textContent = '@keyframes rainDrop { 0% { transform: translateY(0); opacity: 0.3; } 100% { transform: translateY(100vh); opacity: 0; } }';
    document.head.appendChild(rainAnimation);

    setInterval(createRaindrop, 100);

    const blindOverlay = document.querySelector('.venetian-blinds');
    let blindPosition = 0;

    function animateBlinds() {
        blindPosition += 0.5;
        const offset = Math.sin(blindPosition * 0.01) * 20;
        if (blindOverlay) {
            blindOverlay.style.transform = 'translateX(' + offset + 'px)';
        }
        requestAnimationFrame(animateBlinds);
    }

    animateBlinds();

    const caseTitle = document.querySelector('.case-title');
    if (caseTitle) {
        const text = caseTitle.textContent;
        caseTitle.innerHTML = '';
        let charIndex = 0;

        function typeTitle() {
            if (charIndex < text.length) {
                caseTitle.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeTitle, 50);
            }
        }

        setTimeout(typeTitle, 500);
    }

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(function(title) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(function() {
                        entry.target.style.transition = 'all 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(title);
    });

    const witnessCards = document.querySelectorAll('.witness-card');
    witnessCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        card.style.transition = 'all 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(card);
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(function(card) {
        const number = card.querySelector('.stat-number');
        if (!number) return;

        const targetValue = parseInt(number.textContent);
        let currentValue = 0;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const increment = targetValue / 30;
                    const counter = setInterval(function() {
                        currentValue += increment;
                        if (currentValue >= targetValue) {
                            number.textContent = targetValue;
                            clearInterval(counter);
                        } else {
                            number.textContent = Math.floor(currentValue);
                        }
                    }, 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(card);
    });

    const dangerBars = document.querySelectorAll('.danger-fill');
    dangerBars.forEach(function(bar) {
        const targetWidth = bar.style.width;
        bar.style.width = '0';

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        bar.style.transition = 'width 1s ease-out';
                        bar.style.width = targetWidth;
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(bar);
    });

    let lastScrollTop = 0;
    const sidebar = document.querySelector('.sidebar');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (sidebar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                sidebar.style.transform = 'translateX(-100%)';
            } else {
                sidebar.style.transform = 'translateX(0)';
            }
            sidebar.style.transition = 'transform 0.3s ease';
        }

        lastScrollTop = scrollTop;
    });

    const photoFrames = document.querySelectorAll('.photo-frame, .evidence-frame');
    photoFrames.forEach(function(frame) {
        frame.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(' + (Math.random() * 4 - 2) + 'deg)';
            this.style.transition = 'transform 0.3s ease';
            this.style.zIndex = '100';
        });

        frame.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.zIndex = '1';
        });
    });

    function createFlickerEffect() {
        const appContainer = document.querySelector('.app-container');
        if (!appContainer) return;

        setInterval(function() {
            if (Math.random() > 0.95) {
                appContainer.style.opacity = '0.97';
                setTimeout(function() {
                    appContainer.style.opacity = '1';
                }, 50);
            }
        }, 100);
    }

    createFlickerEffect();

    const boardItemsForAnimation = document.querySelectorAll('.board-item');
    boardItemsForAnimation.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });

        item.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });

    const threadLines = document.querySelectorAll('.thread-line');
    threadLines.forEach(function(line) {
        line.style.animation = 'threadPulse 3s ease-in-out infinite';
    });

    function init() {
        if (document.getElementById('corkboard').classList.contains('active')) {
            drawAllConnections();
        }
    }

    setTimeout(init, 100);

});