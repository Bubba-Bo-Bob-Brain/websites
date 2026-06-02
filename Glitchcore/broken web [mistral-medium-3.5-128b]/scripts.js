// ===== DOM ELEMENTS =====
const errorPage = document.querySelector('.error-page');
const hiddenPages = document.querySelectorAll('.hidden-page');
const clickableElements = document.querySelectorAll('.clickable');
const loadingProgress = document.querySelector('.loading-progress');
const loadingPercent = document.querySelector('.loading-percent');
const countdown = document.querySelector('.countdown');
const glitchElements = document.querySelectorAll('.glitch');
const glitchRows = document.querySelectorAll('.glitch-row');
const corruptedImages = document.querySelectorAll('.corrupted-image');
const terminalOutput = document.querySelector('.terminal-output');

// ===== PAGE NAVIGATION =====
function showPage(targetPageId) {
    // Hide all pages
    errorPage.style.display = 'none';
    hiddenPages.forEach(page => {
        page.style.display = 'none';
    });

    // Show the target page
    if (targetPageId === 'error-page') {
        errorPage.style.display = 'block';
    } else {
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
    }

    // Reset animations and effects
    resetDynamicEffects();
}

// Initialize navigation
clickableElements.forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        const target = element.getAttribute('data-target');
        if (target) {
            showPage(target);
        }
    });
});

// ===== DYNAMIC EFFECTS =====
// Reset effects when switching pages
function resetDynamicEffects() {
    // Reset loading bar
    loadingProgress.style.width = '0%';
    loadingPercent.textContent = '0%';

    // Reset countdown
    if (countdown) {
        countdown.textContent = '10';
    }

    // Re-trigger glitch effects
    glitchElements.forEach(element => {
        element.style.animation = 'none';
        void element.offsetWidth; // Trigger reflow
        element.style.animation = 'glitchSkew 4s infinite linear alternate-reverse';
    });

    // Re-trigger row glitch
    glitchRows.forEach(row => {
        row.style.animation = 'none';
        void row.offsetWidth;
        row.style.animation = 'rowGlitch 5s infinite';
    });

    // Start countdown if on error page
    if (errorPage.style.display === 'block') {
        startCountdown();
    }
}

// ===== LOADING BAR (NEVER FINISHES) =====
function updateLoadingBar() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 70) {
            progress = 0;
        }
        loadingProgress.style.width = `${progress}%`;
        loadingPercent.textContent = `${Math.floor(progress)}%`;
    }, 200);
}
updateLoadingBar();

// ===== COUNTDOWN TIMER =====
function startCountdown() {
    let seconds = 10;
    const interval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 10;
        }
        if (countdown) {
            countdown.textContent = seconds;
        }
    }, 1000);
}
startCountdown();

// ===== RANDOM GLITCH EFFECTS =====
// Randomly glitch text elements
function randomGlitch() {
    glitchElements.forEach(element => {
        if (Math.random() > 0.7) {
            element.style.animation = 'none';
            void element.offsetWidth;
            element.style.animation = 'glitchEffect 0.5s infinite linear alternate-reverse';
            setTimeout(() => {
                element.style.animation = 'glitchSkew 4s infinite linear alternate-reverse';
            }, 500);
        }
    });
}
setInterval(randomGlitch, 2000);

// Randomly glitch table rows
function randomRowGlitch() {
    glitchRows.forEach(row => {
        if (Math.random() > 0.8) {
            row.style.animation = 'none';
            void row.offsetWidth;
            row.style.animation = 'rowGlitch 0.3s infinite';
            setTimeout(() => {
                row.style.animation = 'rowGlitch 5s infinite';
            }, 300);
        }
    });
}
setInterval(randomRowGlitch, 3000);

// ===== CORRUPTED IMAGE EFFECT =====
function flickerImages() {
    corruptedImages.forEach(image => {
        if (Math.random() > 0.9) {
            image.style.opacity = Math.random() > 0.5 ? '0.3' : '1';
        }
    });
}
setInterval(flickerImages, 1000);

// ===== TERMINAL TYPING EFFECT =====
function simulateTerminalTyping() {
    if (!terminalOutput) return;

    const lines = terminalOutput.querySelectorAll('p');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.opacity = '1';
            }, 200);
        }, index * 500);
    });
}

// ===== RANDOM BROKEN LINKS =====
function breakRandomLink() {
    const brokenLinks = document.querySelectorAll('.broken-link');
    if (brokenLinks.length === 0) return;

    const randomLink = brokenLinks[Math.floor(Math.random() * brokenLinks.length)];
    if (randomLink) {
        randomLink.style.textDecoration = 'line-through';
        randomLink.style.color = '#ff2a2a';
        randomLink.style.cursor = 'not-allowed';
        setTimeout(() => {
            randomLink.style.textDecoration = 'none';
            randomLink.style.color = '';
            randomLink.style.cursor = 'pointer';
        }, 2000);
    }
}
setInterval(breakRandomLink, 4000);

// ===== HIDDEN CONTENT EFFECTS =====
// Intact image flicker
const intactImages = document.querySelectorAll('.intact-image');
function flickerIntactImage() {
    intactImages.forEach(image => {
        if (Math.random() > 0.95) {
            image.style.filter = 'hue-rotate(90deg) saturate(5)';
            setTimeout(() => {
                image.style.filter = 'none';
            }, 200);
        }
    });
}
setInterval(flickerIntactImage, 3000);

// ===== KEYBOARD SHORTCUTS =====
// Press 'ESC' to return to error page
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        showPage('error-page');
    }
});

// Press '1'-'5' to navigate to specific pages
document.addEventListener('keydown', (e) => {
    const pageMap = {
        '1': 'error-page',
        '2': 'bsod-page',
        '3': '404-page',
        '4': 'database-page',
        '5': 'hidden-page-1',
        '6': 'hidden-page-2'
    };
    if (pageMap[e.key]) {
        showPage(pageMap[e.key]);
    }
});

// ===== INITIALIZE =====
// Start terminal typing effect if on database page
const databasePage = document.getElementById('database-page');
if (databasePage && databasePage.style.display === 'block') {
    simulateTerminalTyping();
}

// Randomly trigger effects on load
window.addEventListener('load', () => {
    setTimeout(randomGlitch, 500);
    setTimeout(randomRowGlitch, 1000);
    setTimeout(flickerImages, 1500);
});