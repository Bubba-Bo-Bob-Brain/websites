/* ============================================
   Teatro della Corte - Baroque Opera House
   Interactive JavaScript with Immersive Effects
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCurtainReveal();
    initializeChandelier();
    initializeNavigation();
    initializeHeroSpotlights();
    initializeStatsCounter();
    initializePerformanceFilters();
    initializeSpotlightHover();
    initializeSeatingChart();
    initializeTicketSelection();
    initializeScrollAnimations();
    hideLoadingOverlay();
});

/* ============================================
   Curtain Reveal Animation
   ============================================ */
function initializeCurtainReveal() {
    const curtainOverlay = document.getElementById('curtainOverlay');
    const chandelierContainer = document.getElementById('chandelierContainer');
    
    // Show curtain initially
    curtainOverlay.classList.add('active');
    
    // After a brief delay, reveal the curtain
    setTimeout(() => {
        curtainOverlay.classList.add('revealed');
        
        // Show chandelier after curtain starts opening
        setTimeout(() => {
            chandelierContainer.classList.add('visible');
        }, 800);
    }, 1500);
    
    // Remove curtain from DOM after animation completes
    setTimeout(() => {
        curtainOverlay.style.display = 'none';
    }, 4000);
}

/* ============================================
   Chandelier with Particle Effects
   ============================================ */
function initializeChandelier() {
    const lightParticles = document.getElementById('lightParticles');
    const particleCount = 30;
    
    // Create floating light particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'light-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${8 + Math.random() * 4}s`;
        lightParticles.appendChild(particle);
    }
    
    // Animate chandelier sway with slight randomness
    const chandelier = document.querySelector('.chandelier');
    if (chandelier) {
        setInterval(() => {
            const randomRotation = (Math.random() - 0.5) * 2; // -1 to 1 degrees
            chandelier.style.transform = `rotate(${randomRotation}deg)`;
        }, 8000);
    }
}

/* ============================================
   Navigation with Smooth Scrolling
   ============================================ */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    // Handle nav link clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.querySelector('.nav-link').getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === current) {
                item.classList.add('active');
            }
        });
    });
}

/* ============================================
   Hero Spotlight Animations
   ============================================ */
function initializeHeroSpotlights() {
    const spotlights = document.querySelectorAll('.spotlight');
    
    spotlights.forEach((spotlight, index) => {
        // Add random movement to each spotlight
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 100;
            const randomY = (Math.random() - 0.5) * 50;
            const randomRotate = (Math.random() - 0.5) * 10;
            
            spotlight.style.transform = `translateX(${randomX}px) translateY(${randomY}px) rotate(${randomRotate}deg)`;
        }, 5000 + index * 2000);
    });
}

/* ============================================
   Animated Stats Counter
   ============================================ */
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'));
                animateCounter(target, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/* ============================================
   Performance Filter System
   ============================================ */
function initializePerformanceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const performanceCards = document.querySelectorAll('.performance-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter cards with animation
            performanceCards.forEach((card, index) => {
                const composer = card.getAttribute('data-composer');
                const shouldShow = filter === 'all' || composer === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
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
}

/* ============================================
   Spotlight Hover Effect on Cards
   ============================================ */
function initializeSpotlightHover() {
    const cardsWithSpotlight = document.querySelectorAll('.performance-card, .artist-card');
    
    cardsWithSpotlight.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const spotlightOverlay = card.querySelector('.spotlight-overlay');
            if (spotlightOverlay) {
                spotlightOverlay.style.setProperty('--mouse-x', `${x}px`);
                spotlightOverlay.style.setProperty('--mouse-y', `${y}px`);
            }
            
            const spotlightEffect = card.querySelector('.spotlight-effect');
            if (spotlightEffect) {
                spotlightEffect.style.setProperty('--mouse-x', `${x}px`);
                spotlightEffect.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    });
}

/* ============================================
   Interactive Seating Chart
   ============================================ */
function initializeSeatingChart() {
    const seats = document.querySelectorAll('.seat');
    const boxes = document.querySelectorAll('.box');
    let selectedSeats = new Set();
    let selectedBoxes = new Set();
    
    // Handle seat selection
    seats.forEach(seat => {
        if (seat.classList.contains('taken')) return;
        
        seat.addEventListener('click', () => {
            const seatId = seat.getAttribute('data-seat');
            const price = parseInt(seat.getAttribute('data-price'));
            
            if (selectedSeats.has(seatId)) {
                selectedSeats.delete(seatId);
                seat.classList.remove('selected');
            } else {
                selectedSeats.add({ id: seatId, price, type: 'seat' });
                seat.classList.add('selected');
            }
            
            updateSelectionSummary();
        });
        
        // Add hover sound effect simulation (visual feedback)
        seat.addEventListener('mouseenter', () => {
            if (!seat.classList.contains('taken')) {
                seat.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8)';
            }
        });
        
        seat.addEventListener('mouseleave', () => {
            if (!seat.classList.contains('selected') && !seat.classList.contains('taken')) {
                seat.style.boxShadow = '';
            }
        });
    });
    
    // Handle box selection
    boxes.forEach(box => {
        if (box.querySelector('.box-status').textContent === 'Taken') return;
        
        box.addEventListener('click', () => {
            const boxId = box.getAttribute('data-box');
            const price = parseInt(box.getAttribute('data-price'));
            const seats = parseInt(box.getAttribute('data-seats'));
            
            if (selectedBoxes.has(boxId)) {
                selectedBoxes.delete(boxId);
                box.classList.remove('selected');
            } else {
                selectedBoxes.add({ id: boxId, price, seats, type: 'box' });
                box.classList.add('selected');
            }
            
            updateSelectionSummary();
        });
    });
    
    // Store selection data globally for ticket system
    window.seatingSelection = {
        getSelectedSeats: () => Array.from(selectedSeats),
        getSelectedBoxes: () => Array.from(selectedBoxes),
        clearSelection: () => {
            selectedSeats.clear();
            selectedBoxes.clear();
            seats.forEach(seat => seat.classList.remove('selected'));
            boxes.forEach(box => box.classList.remove('selected'));
            updateSelectionSummary();
        }
    };
}

/* ============================================
   Ticket Selection System
   ============================================ */
function initializeTicketSelection() {
    const ticketCards = document.querySelectorAll('.ticket-card');
    const quantityInputs = document.querySelectorAll('.quantity-selector input');
    const plusButtons = document.querySelectorAll('.qty-btn.plus');
    const minusButtons = document.querySelectorAll('.qty-btn.minus');
    const bookButtons = document.querySelectorAll('.book-btn');
    const clearButton = document.getElementById('clearSelection');
    const proceedButton = document.getElementById('proceedBtn');
    const summaryContent = document.getElementById('summaryContent');
    const totalAmount = document.getElementById('totalAmount');
    
    // Store ticket selections
    const ticketSelections = new Map();
    
    // Quantity selector functionality
    quantityInputs.forEach(input => {
        const tier = input.id.replace('-qty', '');
        const card = input.closest('.ticket-card');
        const maxSeats = parseInt(input.getAttribute('max'));
        const priceRange = card.querySelector('.tier-range').textContent;
        const [minPrice, maxPrice] = priceRange.split('-').map(p => parseInt(p.replace(/[^0-9]/g, '')));
        
        // Initialize with 1
        ticketSelections.set(tier, {
            quantity: 1,
            minPrice,
            maxPrice,
            total: minPrice
        });
        
        updateTicketDisplay(tier);
    });
    
    // Plus button handlers
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tier = button.getAttribute('data-tier');
            const input = document.getElementById(`${tier}-qty`);
            const max = parseInt(input.getAttribute('max'));
            const currentValue = parseInt(input.value);
            
            if (currentValue < max) {
                input.value = currentValue + 1;
                updateTicketQuantity(tier, currentValue + 1);
            }
        });
    });
    
    // Minus button handlers
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tier = button.getAttribute('data-tier');
            const input = document.getElementById(`${tier}-qty`);
            const currentValue = parseInt(input.value);
            
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateTicketQuantity(tier, currentValue - 1);
            }
        });
    });
    
    // Book button handlers
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tier = button.getAttribute('data-tier');
            const selection = ticketSelections.get(tier);
            
            if (selection && selection.quantity > 0) {
                // Add to summary
                addToSummary(tier, selection);
                
                // Visual feedback
                button.textContent = 'Added ✓';
                button.style.background = 'rgba(42, 90, 42, 0.8)';
                
                setTimeout(() => {
                    button.textContent = 'Add to Selection';
                    button.style.background = '';
                }, 1500);
            }
        });
    });
    
    // Clear all button
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (window.seatingSelection) {
                window.seatingSelection.clearSelection();
            }
            
            ticketSelections.clear();
            quantityInputs.forEach(input => {
                input.value = 1;
            });
            
            // Reset displays
            document.querySelectorAll('.selected-seats').forEach(display => {
                const tier = display.id.replace('-seats', '');
                updateTicketDisplay(tier);
            });
            
            summaryContent.innerHTML = '<p class="empty-message">No seats selected yet</p>';
            totalAmount.textContent = '€0';
            proceedButton.disabled = true;
            
            // Reset book buttons
            bookButtons.forEach(button => {
                button.style.background = '';
                button.textContent = 'Add to Selection';
            });
        });
    }
    
    // Update ticket quantity in selection
    function updateTicketQuantity(tier, quantity) {
        const selection = ticketSelections.get(tier);
        if (selection) {
            selection.quantity = quantity;
            selection.total = quantity * selection.minPrice; // Use min price for estimate
            updateTicketDisplay(tier);
        }
    }
    
    // Update ticket card display
    function updateTicketDisplay(tier) {
        const selection = ticketSelections.get(tier);
        if (!selection) return;
        
        const displayElement = document.getElementById(`${tier}-seats`);
        if (displayElement) {
            const seatCount = displayElement.querySelector('.seat-count');
            const totalPrice = displayElement.querySelector('.total-price');
            
            if (seatCount) seatCount.textContent = selection.quantity;
            if (totalPrice) totalPrice.textContent = `€${selection.total}`;
        }
    }
    
    // Add item to summary
    function addToSummary(tier, selection) {
        // Clear empty message if present
        const emptyMessage = summaryContent.querySelector('.empty-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        // Get tier name
        const tierCard = document.querySelector(`.ticket-card[data-tier="${tier}"]`);
        const tierName = tierCard ? tierCard.querySelector('.tier-name').textContent : tier;
        
        // Create summary item
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span class="summary-item-name">${tierName} (${selection.quantity} seat${selection.quantity > 1 ? 's' : ''})</span>
            <span class="summary-item-price">€${selection.total}</span>
        `;
        
        summaryContent.appendChild(summaryItem);
        
        // Update total
        updateTotalAmount();
        proceedButton.disabled = false;
        
        // Add animation
        summaryItem.style.opacity = '0';
        summaryItem.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            summaryItem.style.transition = 'all 0.3s ease';
            summaryItem.style.opacity = '1';
            summaryItem.style.transform = 'translateX(0)';
        }, 10);
    }
    
    // Update total amount
    function updateTotalAmount() {
        let total = 0;
        const summaryItems = summaryContent.querySelectorAll('.summary-item-price');
        
        summaryItems.forEach(item => {
            const price = parseInt(item.textContent.replace(/[^0-9]/g, ''));
            total += price;
        });
        
        totalAmount.textContent = `€${total}`;
        
        // Add pulse animation to total
        totalAmount.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalAmount.style.transition = 'transform 0.3s ease';
            totalAmount.style.transform = 'scale(1)';
        }, 10);
    }
    
    // Proceed button
    proceedButton.addEventListener('click', () => {
        // In a real app, this would proceed to checkout
        const total = totalAmount.textContent;
        
        // Create success modal effect
        proceedButton.innerHTML = 'Processing...';
        proceedButton.disabled = true;
        
        setTimeout(() => {
            proceedButton.innerHTML = '✓ Success!';
            proceedButton.style.background = 'rgba(42, 90, 42, 0.8)';
            
            setTimeout(() => {
                proceedButton.innerHTML = 'Proceed to Checkout';
                proceedButton.style.background = '';
                proceedButton.disabled = false;
            }, 2000);
        }, 1500);
    });
}

/* ============================================
   Scroll-Triggered Animations
   ============================================ */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-ornate-border, .performance-card, .artist-card, .ticket-card, .stat-card'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(element);
    });
}

/* ============================================
   Loading Overlay
   ============================================ */
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Wait for all initial animations to start
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        
        // Remove from DOM after fade out
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 800);
    }, 2000);
}

/* ============================================
   Additional Interactive Effects
   ============================================ */

// Parallax effect for hero section spotlights on mouse move
document.addEventListener('mousemove', (e) => {
    const spotlights = document.querySelectorAll('.spotlight');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    spotlights.forEach((spotlight, index) => {
        const speed = 0.02 + index * 0.01;
        const x = (mouseX - 0.5) * window.innerWidth * speed;
        const y = (mouseY - 0.5) * window.innerHeight * speed;
        
        spotlight.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add tactile feedback to all buttons
document.querySelectorAll('button, .nav-link, .card-cta, .gold-button').forEach(element => {
    element.addEventListener('mousedown', () => {
        element.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('mouseup', () => {
        element.style.transform = '';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = '';
    });
});

// Smooth reveal for section content
function revealSectionContent(section) {
    const elements = section.querySelectorAll(
        '.section-header, .season-stats, .performances-filter, .performances-grid, ' +
        '.seating-container, .artists-grid, .ticket-options, .selection-summary'
    );
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Add decorative floating elements
function createFloatingDecorations() {
    const container = document.querySelector('.opera-container');
    const decorationCount = 15;
    
    for (let i = 0; i < decorationCount; i++) {
        const decoration = document.createElement('div');
        decoration.className = 'floating-decoration';
        decoration.style.cssText = `
            position: absolute;
            width: ${20 + Math.random() * 30}px;
            height: ${20 + Math.random() * 30}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            animation: float-decoration ${15 + Math.random() * 20}s ease-in-out infinite;
            animation-delay: ${Math.random() * -20}s;
        `;
        container.appendChild(decoration);
    }
    
    // Add CSS animation for floating
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-decoration {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.3;
            }
            25% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg);
                opacity: 0.6;
            }
            50% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg);
                opacity: 0.3;
            }
            75% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg);
                opacity: 0.6;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize floating decorations after page load
setTimeout(createFloatingDecorations, 3000);

// Performance optimization: pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.chandelier, .flame, .light-beam, .spotlight');
    
    if (document.hidden) {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to close any modals or clear selections
    if (e.key === 'Escape') {
        if (window.seatingSelection) {
            window.seatingSelection.clearSelection();
        }
    }
    
    // Arrow keys for seat navigation (future enhancement)
    // Could be implemented for accessibility
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    // Update spotlight positions on touch
    const spotlights = document.querySelectorAll('.spotlight');
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    spotlights.forEach((spotlight, index) => {
        const speed = 0.05 + index * 0.02;
        const currentTransform = spotlight.style.transform;
        // Simple parallax on touch move
    });
}, { passive: true });

console.log('Teatro della Corte - Baroque Opera House initialized successfully.');
console.log('Welcome to the most immersive opera experience.');