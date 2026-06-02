const customCursor = document.getElementById('customCursor');
const interactiveElements = document.querySelectorAll('a, button, .interactive-panel, .canvas-btn, .subscribe-input');

document.addEventListener('mousemove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
});

interactiveElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        customCursor.classList.add('hovering');
    });
    element.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovering');
    });
});

const characterCards = document.querySelectorAll('.character-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let activeCharIndex = 0;

function updateCarousel(targetIndex) {
    const currentCard = characterCards[activeCharIndex];
    const nextCard = characterCards[targetIndex];

    currentCard.classList.remove('active');
    
    const currentStatFills = currentCard.querySelectorAll('.stat-fill');
    currentStatFills.forEach(fill => {
        fill.style.width = '0%';
    });

    activeCharIndex = targetIndex;
    nextCard.classList.add('active');

    const nextStatFills = nextCard.querySelectorAll('.stat-fill');
    nextStatFills.forEach(fill => {
        const targetWidth = fill.parentElement.nextElementSibling.textContent;
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 150);
    });
}

prevBtn.addEventListener('click', () => {
    let targetIndex = activeCharIndex - 1;
    if (targetIndex < 0) {
        targetIndex = characterCards.length - 1;
    }
    updateCarousel(targetIndex);
});

nextBtn.addEventListener('click', () => {
    let targetIndex = activeCharIndex + 1;
    if (targetIndex >= characterCards.length) {
        targetIndex = 0;
    }
    updateCarousel(targetIndex);
});

function initFirstCardStats() {
    const activeCard = characterCards[0];
    const statFills = activeCard.querySelectorAll('.stat-fill');
    statFills.forEach(fill => {
        const targetWidth = fill.parentElement.nextElementSibling.textContent;
        fill.style.width = targetWidth;
    });
}

window.addEventListener('DOMContentLoaded', initFirstCardStats);

const filterButtons = document.querySelectorAll('.filter-btn');
const trackerItems = document.querySelectorAll('.tracker-card-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        trackerItems.forEach(item => {
            const status = item.getAttribute('data-status');
            if (filterValue === 'all' || status === filterValue) {
                item.style.display = 'flex';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

const canvas = document.getElementById('mangaCanvas');
const ctx = canvas.getContext('2d');
const btnHalftone = document.getElementById('btnHalftone');
const btnSpeedlines = document.getElementById('btnSpeedlines');
const btnClear = document.getElementById('btnClear');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawHalftoneMode = true;
let speedlineBurstMode = false;

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    clearCanvas();
}

function clearCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

function getMousePos(canvasDom, e) {
    const rect = canvasDom.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    lastX = pos.x;
    lastY = pos.y;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    
    ctx.strokeStyle = '#000000';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    if (drawHalftoneMode) {
        drawHalftoneBrush(pos.x, pos.y);
    }

    lastX = pos.x;
    lastY = pos.y;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    if (speedlineBurstMode) {
        drawSpeedlineBurst(lastX, lastY);
    }
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

function drawHalftoneBrush(x, y) {
    ctx.fillStyle = '#000000';
    const radius = 25;
    for (let i = -radius; i < radius; i += 6) {
        for (let j = -radius; j < radius; j += 6) {
            if (i * i + j * j <= radius * radius) {
                if (Math.random() > 0.4) {
                    ctx.beginPath();
                    ctx.arc(x + i, y + j, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
}

function drawSpeedlineBurst(centerX, centerY) {
    const lineCount = 72;
    const outerRadius = Math.max(canvas.width, canvas.height);
    const innerRadius = 40;

    ctx.strokeStyle = '#000000';
    
    for (let i = 0; i < lineCount; i++) {
        const angle = (i * Math.PI * 2) / lineCount + (Math.random() * 0.05);
        const randomInner = innerRadius + (Math.random() * 30);
        
        const startX = centerX + Math.cos(angle) * randomInner;
        const startY = centerY + Math.sin(angle) * randomInner;
        
        const endX = centerX + Math.cos(angle) * outerRadius;
        const endY = centerY + Math.sin(angle) * outerRadius;

        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

btnHalftone.addEventListener('click', () => {
    drawHalftoneMode = !drawHalftoneMode;
    btnHalftone.classList.toggle('active', drawHalftoneMode);
});

btnSpeedlines.addEventListener('click', () => {
    speedlineBurstMode = !speedlineBurstMode;
    btnSpeedlines.classList.toggle('active', speedlineBurstMode);
});

btnClear.addEventListener('click', clearCanvas);

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let currentActive = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            currentActive = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActive}`) {
            link.classList.add('active');
        }
    });
});