/* DIGITAL SANCTUARY 2004 - SCRIPTS */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SPARKLE CURSOR TRAIL ---
    const trailContainer = document.getElementById('cursor-trail');
    
    window.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Randomize sparkle appearance
        const size = Math.random() * 8 + 4;
        const color = ['#ff00ff', '#00ffff', '#39ff14', '#ffff00', '#ffffff'][Math.floor(Math.random() * 5)];
        
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.backgroundColor = color;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        sparkle.style.boxShadow = `0 0 10px ${color}`;
        
        // Add a custom animation for the sparkle
        const animationDuration = Math.random() * 1 + 0.5;
        sparkle.style.transition = `all ${animationDuration}s ease-out`;
        
        trailContainer.appendChild(sparkle);

        // Animate the sparkle floating away and fading out
        setTimeout(() => {
            const moveX = (Math.random() - 0.5) * 100;
            const moveY = (Math.random() - 0.5) * 100;
            sparkle.style.transform = `translate(${moveX}px, ${moveY}px) scale(0)`;
            sparkle.style.opacity = '0';
        }, 10);

        // Clean up DOM
        setTimeout(() => {
            sparkle.remove();
        }, animationDuration * 1000);
    }

    // --- 2. MUSIC PLAYER LOGIC ---
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const visualizerBars = document.querySelectorAll('.bar');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
        isPlaying = true;
        playBtn.textContent = '⏸';
        // Trigger visualizer animation
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
        alert('🎶 Now streaming: Toxic - Britney Spears (High Quality 128kbps)');
    });

    stopBtn.addEventListener('click', () => {
        isPlaying = false;
        playBtn.textContent = '▶';
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    });

    // Initialize visualizer to paused
    visualizerBars.forEach(bar => bar.style.animationPlayState = 'paused');

    // --- 3. GUESTBOOK FUNCTIONALITY ---
    const gbSubmit = document.getElementById('gb-submit');
    const gbName = document.getElementById('gb-name');
    const gbMessage = document.getElementById('gb-message');
    const gbEntries = document.getElementById('gb-entries');

    gbSubmit.addEventListener('click', () => {
        const name = gbName.value.trim();
        const msg = gbMessage.value.trim();

        if (name === '' || msg === '') {
            alert('Please enter your name and a message, silly! XD');
            return;
        }

        // Create new entry
        const entry = document.createElement('div');
        entry.className = 'entry';
        
        const date = new Date();
        const dateStr = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
        
        entry.innerHTML = `<strong>${name}:</strong> ${msg} <span class="date">${dateStr}</span>`;
        
        // Prepend to the top of the guestbook
        gbEntries.prepend(entry);

        // Clear inputs
        gbName.value = '';
        gbMessage.value = '';
        
        alert('Message posted! Thanks for visiting my sanctuary! <3');
    });

    // --- 4. HIT COUNTER SIMULATION ---
    const hitCountEl = document.getElementById('count');
    let count = 4329;

    setInterval(() => {
        // Randomly increment the visitor count to make the site feel "active"
        if (Math.random() > 0.7) {
            count++;
            hitCountEl.textContent = count.toString().padStart(7, '0');
        }
    }, 5000);

    // --- 5. VOTE BUTTON INTERACTION ---
    const voteBtn = document.querySelector('.vote-btn');
    voteBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="band"]:checked');
        if (selected) {
            alert(`Thank you for voting for ${selected.value}! They are totally the best!`);
        } else {
            alert('Pick a band first! Be honest!!');
        }
    });
});