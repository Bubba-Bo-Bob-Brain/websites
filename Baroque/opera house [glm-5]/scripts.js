document.addEventListener('DOMContentLoaded', function() {
    initCurtainReveal();
    initChandelierLight();
    initPerformanceCards();
    initPerformerSpotlights();
    initSeatingChart();
    initScrollAnimations();
    initLightParticles();
});

function initCurtainReveal() {
    const curtainTassels = document.querySelectorAll('.curtain-tassel');
    
    setTimeout(function() {
        document.body.style.overflow = 'auto';
    }, 3500);
    
    setTimeout(function() {
        curtainTassels.forEach(function(tassel) {
            tassel.style.animation = 'tasselSwing 3s ease-in-out infinite';
        });
    }, 3800);
}

function initChandelierLight() {
    const lightRays = document.querySelector('.light-rays');
    const chandelierArms = document.querySelectorAll('.chandelier-arm');
    
    if (!lightRays) return;
    
    let time = 0;
    
    function animateLight() {
        time += 0.01;
        const intensity = 0.4 + Math.sin(time) * 0.2;
        const scale = 1 + Math.sin(time * 0.5) * 0.05;
        lightRays.style.opacity = intensity;
        lightRays.style.transform = 'translateX(-50%) scale(' + scale + ')';
        requestAnimationFrame(animateLight);
    }
    
    animateLight();
    
    chandelierArms.forEach(function(arm, index) {
        const flickerDuration = 0.3 + Math.random() * 0.4;
        arm.style.setProperty('--flicker-duration', flickerDuration + 's');
    });
}

function initPerformanceCards() {
    const cards = document.querySelectorAll('.performance-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(function(card, index) {
        card.style.transitionDelay = (index * 0.15) + 's';
        observer.observe(card);
    });
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const frame = card.querySelector('.gilded-frame-card');
            if (frame) {
                frame.style.boxShadow = '0 0 0 3px #8b6914, 0 0 0 6px #d4a853, 0 0 0 9px #8b6914, 0 0 0 12px #2d1810, 0 0 0 15px #d4a853, 0 0 80px rgba(212, 168, 83, 0.4), inset 0 0 100px rgba(212, 168, 83, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const frame = card.querySelector('.gilded-frame-card');
            if (frame) {
                frame.style.boxShadow = '';
            }
        });
    });
}

function initPerformerSpotlights() {
    const performerCards = document.querySelectorAll('.performer-card');
    
    performerCards.forEach(function(card) {
        const spotlight = card.querySelector('.performer-spotlight');
        if (!spotlight) return;
        
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            spotlight.style.background = 'radial-gradient(circle at ' + (x / rect.width * 100) + '% ' + (y / rect.height * 100) + '%, rgba(255, 220, 150, 0.2) 0%, transparent 50%)';
        });
        
        card.addEventListener('mouseleave', function() {
            spotlight.style.background = 'radial-gradient(ellipse at center, rgba(255, 220, 150, 0.15) 0%, transparent 70%)';
        });
    });
}

function initSeatingChart() {
    const seats = document.querySelectorAll('.seat');
    const reservedSeats = ['A1', 'A2', 'A3', 'B4', 'B5', 'C6', 'C7', 'D1', 'D10', 'E5', 'F6', 'F7'];
    let selectedSeat = null;
    
    seats.forEach(function(seat) {
        const seatId = seat.getAttribute('data-seat');
        
        if (reservedSeats.includes(seatId)) {
            seat.classList.add('reserved');
        } else {
            seat.classList.add('available');
            seat.addEventListener('click', function() {
                handleSeatClick(seat);
            });
        }
        
        seat.addEventListener('mouseenter', function() {
            if (!seat.classList.contains('reserved')) {
                seat.style.transform = 'scale(1.2)';
                seat.style.boxShadow = '0 0 15px #d4a853';
            }
        });
        
        seat.addEventListener('mouseleave', function() {
            if (!seat.classList.contains('selected')) {
                seat.style.transform = '';
                seat.style.boxShadow = '';
            }
        });
    });
    
    function handleSeatClick(seat) {
        if (seat.classList.contains('reserved')) return;
        
        if (selectedSeat && selectedSeat !== seat) {
            selectedSeat.classList.remove('selected');
            selectedSeat.classList.add('available');
            selectedSeat.style.transform = '';
            selectedSeat.style.boxShadow = '';
        }
        
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add('available');
            selectedSeat = null;
        } else {
            seat.classList.remove('available');
            seat.classList.add('selected');
            selectedSeat = seat;
            const seatId = seat.getAttribute('data-seat');
            showSeatNotification(seatId);
        }
    }
    
    function showSeatNotification(seatId) {
        const existingNotification = document.querySelector('.seat-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'seat-notification';
        notification.innerHTML = '<span class="notification-icon">❧</span><span class="notification-text">Seat ' + seatId + ' Selected</span><span class="notification-icon">❧</span>';
        
        notification.style.cssText = 'position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #2d1810, #1a0f0a); border: 2px solid #d4a853; padding: 15px 30px; color: #f4e4bc; font-family: "Playfair Display", serif; font-size: 1.1rem; z-index: 1000; box-shadow: 0 0 30px rgba(212, 168, 83, 0.3); animation: notificationSlide 0.5s ease-out;';
        
        const style = document.createElement('style');
        style.textContent = '@keyframes notificationSlide { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } } @keyframes notificationFade { from { opacity: 1; } to { opacity: 0; } } .notification-icon { color: #d4a853; margin: 0 10px; }';
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.animation = 'notificationFade 0.5s ease-out forwards';
            setTimeout(function() {
                notification.remove();
            }, 500);
        }, 3000);
    }
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        sectionObserver.observe(section);
    });
    
    setTimeout(function() {
        sections.forEach(function(section) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 4000);
}

function initLightParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'light-particles';
    particleContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; overflow: hidden;';
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'light-particle';
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * window.innerWidth;
        const startY = -10;
        const duration = Math.random() * 8000 + 6000;
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle.style.cssText = 'position: absolute; width: ' + size + 'px; height: ' + size + 'px; background: radial-gradient(circle, rgba(255, 220, 150, ' + opacity + '), transparent); border-radius: 50%; left: ' + startX + 'px; top: ' + startY + 'px; animation: particleFall ' + duration + 'ms linear forwards;';
        
        particleContainer.appendChild(particle);
        
        setTimeout(function() {
            particle.remove();
        }, duration);
    }
    
    const style = document.createElement('style');
    style.textContent = '@keyframes particleFall { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(' + (window.innerHeight + 100) + 'px) rotate(360deg); opacity: 0; } }';
    document.head.appendChild(style);
    
    setInterval(createParticle, 400);
    
    for (let i = 0; i < 15; i++) {
        setTimeout(createParticle, i * 200);
    }
}

document.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const chandelier = document.querySelector('.chandelier-container');
    
    if (chandelier) {
        const swayX = (x - 0.5) * 5;
        chandelier.style.transform = 'translateX(calc(-50% + ' + swayX + 'px))';
    }
});

function initRoyalSealAnimation() {
    const seal = document.querySelector('.royal-seal');
    if (!seal) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                seal.style.animation = 'sealReveal 1s ease-out forwards';
            }
        });
    }, { threshold: 0.5 });
    
    seal.style.opacity = '0';
    seal.style.transform = 'scale(0.8) rotate(-10deg)';
    observer.observe(seal);
    
    const style = document.createElement('style');
    style.textContent = '@keyframes sealReveal { 0% { opacity: 0; transform: scale(0.8) rotate(-10deg); } 50% { transform: scale(1.05) rotate(5deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }';
    document.head.appendChild(style);
}

initRoyalSealAnimation();

function initTableHighlight() {
    const tableRows = document.querySelectorAll('.schedule-table tbody tr');
    
    tableRows.forEach(function(row) {
        row.addEventListener('mouseenter', function() {
            const cells = row.querySelectorAll('td');
            cells.forEach(function(cell) {
                cell.style.color = '#f4e4bc';
            });
        });
        
        row.addEventListener('mouseleave', function() {
            const cells = row.querySelectorAll('td');
            cells.forEach(function(cell) {
                cell.style.color = '';
            });
        });
    });
}

initTableHighlight();

function initOrnamentGlow() {
    const ornaments = document.querySelectorAll('.title-ornament');
    
    ornaments.forEach(function(ornament) {
        let glowing = false;
        
        ornament.addEventListener('mouseenter', function() {
            if (!glowing) {
                glowing = true;
                ornament.style.textShadow = '0 0 20px #d4a853, 0 0 40px #d4a853';
                ornament.style.transform = 'scale(1.2)';
                ornament.style.transition = 'all 0.3s ease';
            }
        });
        
        ornament.addEventListener('mouseleave', function() {
            ornament.style.textShadow = '';
            ornament.style.transform = '';
            glowing = false;
        });
    });
}

initOrnamentGlow();

function initPerformancesHover() {
    const performanceCards = document.querySelectorAll('.performance-card');
    
    performanceCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const number = card.querySelector('.performance-number');
            if (number) {
                number.style.color = '#d4a853';
                number.style.opacity = '0.8';
                number.style.transform = 'scale(1.1)';
                number.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const number = card.querySelector('.performance-number');
            if (number) {
                number.style.color = '#8b6914';
                number.style.opacity = '0.4';
                number.style.transform = '';
            }
        });
    });
}

initPerformancesHover();