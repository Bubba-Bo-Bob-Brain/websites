// scripts.js

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const galleryItems = document.querySelectorAll('.gallery-item');
const contactForm = document.querySelector('.contact-form form');
const submitBtn = document.querySelector('.submit-btn');
const floatingElements = document.querySelectorAll('.floating-flower');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up smooth scrolling for navigation links
  setupSmoothScrolling();
  
  // Set up mobile menu toggle
  setupMobileMenu();
  
  // Initialize gallery animations
  initGalleryAnimations();
  
  // Set up form handling
  setupContactForm();
  
  // Animate floating elements
  animateFloatingElements();
  
  // Set up scroll animations
  setupScrollAnimations();
});

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    this.classList.toggle('active');
  });
}

// Gallery Animations
function initGalleryAnimations() {
  galleryItems.forEach(item => {
    const frame = item.querySelector('.artwork-frame');
    const overlay = item.querySelector('.artwork-overlay');
    
    // Add subtle parallax effect on mouse move
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      frame.style.transform = `translateY(-10px) translate3d(${moveX}px, ${moveY}px, 0)`;
    });
    
    // Reset on mouse leave
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = 'translateY(-10px)';
    });
  });
}

// Contact Form Handling
function setupContactForm() {
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      const nameInput = this.querySelector('input[type="text"]');
      const emailInput = this.querySelector('input[type="email"]');
      const messageInput = this.querySelector('textarea');
      
      let isValid = true;
      
      // Reset previous errors
      [nameInput, emailInput, messageInput].forEach(input => {
        input.parentElement.classList.remove('error');
      });
      
      // Validate fields
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('error');
        isValid = false;
      }
      
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        emailInput.parentElement.classList.add('error');
        isValid = false;
      }
      
      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('error');
        isValid = false;
      }
      
      if (isValid) {
        // Simulate form submission
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success';
          successMessage.textContent = 'Thank you! Your message has been sent.';
          successMessage.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            text-align: center;
            color: #3a7d44;
            font-family: var(--heading-font);
            font-weight: 500;
            margin-top: 1rem;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s ease;
          `;
          
          contactForm.appendChild(successMessage);
          
          // Animate in
          setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
          }, 100);
          
          // Reset form
          contactForm.reset();
          submitBtn.textContent = 'Send Enquiry';
          submitBtn.disabled = false;
          
          // Remove success message after delay
          setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(10px)';
            setTimeout(() => {
              successMessage.remove();
            }, 500);
          }, 5000);
        }, 1500);
      }
    });
  }
}

// Email validation helper
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Floating Elements Animation
function animateFloatingElements() {
  floatingElements.forEach((element, index) => {
    // Randomize animation parameters for each element
    const duration = 15 + Math.random() * 10;
    const delay = Math.random() * 5;
    const xDistance = 20 + Math.random() * 30;
    const yDistance = 10 + Math.random() * 20;
    
    element.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;
  });
}

// Scroll-based Animations
function setupScrollAnimations() {
  // Create intersection observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
  
  // Observe gallery items
  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
  
  // When elements come into view, animate them
  document.addEventListener('scroll', () => {
    document.querySelectorAll('section, .gallery-item').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  });
  
  // Trigger initial check
  window.dispatchEvent(new Event('scroll'));
}

// Add animate-in class for CSS animations
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .form-group.error input,
  .form-group.error textarea {
    border-color: #b88a8a;
    box-shadow: 0 0 0 2px rgba(184, 138, 138, 0.2);
  }
`;
document.head.appendChild(style);

// Additional decorative enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Add decorative swirls to gallery frames
  const frames = document.querySelectorAll('.artwork-frame');
  frames.forEach(frame => {
    // Create decorative corners
    const topLeft = document.createElement('div');
    topLeft.className = 'decorative-corner top-left';
    
    const topRight = document.createElement('div');
    topRight.className = 'decorative-corner top-right';
    
    const bottomLeft = document.createElement('div');
    bottomLeft.className = 'decorative-corner bottom-left';
    
    const bottomRight = document.createElement('div');
    bottomRight.className = 'decorative-corner bottom-right';
    
    frame.appendChild(topLeft);
    frame.appendChild(topRight);
    frame.appendChild(bottomLeft);
    frame.appendChild(bottomRight);
  });
  
  // Add CSS for decorative corners
  const cornerStyle = document.createElement('style');
  cornerStyle.textContent = `
    .decorative-corner {
      position: absolute;
      width: 30px;
      height: 30px;
      z-index: 2;
    }
    
    .decorative-corner.top-left {
      top: 10px;
      left: 10px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M0,15 Q10,5 15,0 Q20,5 30,15" stroke="%23D4AF37" stroke-width="2" fill="none"/></svg>') no-repeat;
    }
    
    .decorative-corner.top-right {
      top: 10px;
      right: 10px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M30,15 Q20,5 15,0 Q10,5 0,15" stroke="%23D4AF37" stroke-width="2" fill="none"/></svg>') no-repeat;
    }
    
    .decorative-corner.bottom-left {
      bottom: 10px;
      left: 10px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M0,15 Q10,25 15,30 Q20,25 30,15" stroke="%23D4AF37" stroke-width="2" fill="none"/></svg>') no-repeat;
    }
    
    .decorative-corner.bottom-right {
      bottom: 10px;
      right: 10px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M30,15 Q20,25 15,30 Q10,25 0,15" stroke="%23D4AF37" stroke-width="2" fill="none"/></svg>') no-repeat;
    }
  `;
  document.head.appendChild(cornerStyle);
});