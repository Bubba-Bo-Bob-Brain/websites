document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effects for interactive elements (Links, Buttons, Inputs, Gallery Items)
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // --- 2. Organic Parallax Effect (Hero Section) ---
    const heroSection = document.querySelector('.hero-section');
    const heroFrame = document.querySelector('.hero-frame');
    
    heroSection.addEventListener('mousemove', (e) => {
        // Calculate position relative to center of screen
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;
        
        // Apply subtle rotation and translation to the frame
        // This creates a feeling of depth and floating
        heroFrame.style.transform = `rotate(${-3 + (y * 0.05)}deg) translate(${x}px, ${y}px)`;
    });

    // Reset position when mouse leaves to prevent it getting stuck
    heroSection.addEventListener('mouseleave', () => {
        heroFrame.style.transform = `rotate(-3deg) translate(0px, 0px)`;
    });

    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    // We set initial opacity 0 here to avoid needing extra CSS classes
    const revealElements = document.querySelectorAll('.gallery-item, .about-text, .contact-card, .section-title');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                
                // Calculate stagger delay for gallery items
                let delay = 0;
                if (entry.target.classList.contains('gallery-item')) {
                    const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
                    const index = allGalleryItems.indexOf(entry.target);
                    delay = index * 150; // 150ms delay per item
                } else {
                    delay = 200; // Standard delay for other sections
                }

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply initial hidden state and observe
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        observer.observe(el);
    });

    // --- 4. Navigation Active State (ScrollSpy) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Offset for header height
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // You could style this in CSS if desired
            if (link.getAttribute('href').includes(current)) {
                // Optional: Add specific active styling logic here if needed
                // Currently handled by CSS hover states, but logic is here for expansion
            }
        });
    });

    // --- 5. Form Handling (Themed Interaction) ---
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerText;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Disable button and show "sending" state
        submitBtn.disabled = true;
        submitBtn.innerText = "Sealing Envelope...";
        submitBtn.style.cursor = 'wait';
        
        // Simulate network delay
        setTimeout(() => {
            submitBtn.innerText = "Missive Sent Successfully ✦";
            submitBtn.style.background = "var(--jewel-teal)";
            submitBtn.style.borderColor = "var(--gold-highlight)";
            submitBtn.style.color = "var(--gold-highlight)";
            submitBtn.style.cursor = 'default';
            
            // Clear form
            form.reset();
            
            // Revert button state after a few seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                submitBtn.style.background = ""; // Reverts to CSS stylesheet value
                submitBtn.style.borderColor = "";
                submitBtn.style.color = "";
                submitBtn.style.cursor = 'none'; // Reverts to custom cursor
            }, 4000);
        }, 1500);
    });

});