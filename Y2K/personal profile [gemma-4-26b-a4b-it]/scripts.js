/* --- Y2K MASTERPIECE SCRIPTS --- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SPARKLE CURSOR TRAIL ---
    const trailContainer = document.getElementById('cursor-trail');
    
    document.addEventListener('mousemove', (e) => {
        createParticle(e.clientX, e.clientY);
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('trail-particle');
        
        // Randomize size and color slightly for variety
        const size = Math.random() * 8 + 4 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        
        // Position the particle
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random color from our palette
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;

        document.body.appendChild(particle);

        // Animate out and remove
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 500,
            easing: 'ease-out'
        });

        animation.onfinish = () => particle.remove();
    }


    // --- 2. WINAMP MUSIC PLAYER (SIMULATED) ---
    const tracks = [
        { name: "Toxic", artist: "Britney Spears" },
        { name: "Genie in a Bottle", artist: "Christina Aguilera" },
        { name: "Oops!... I Did It Again", artist: "Britney Spears" },
        { name: "Bye Bye Bye", artist: "*NSYNC" },
        { name: "Baby One More Time", artist: "Britney Spears" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const lcdText = document.querySelector('.lcd-text');
    const lcdTrack = document.querySelector('.lcd-track');
    const marqueeSong = document.querySelector('.song-name');
    const visualizer = document.querySelector('.winamp-visualizer');

    function updatePlayerUI() {
        const track = tracks[currentTrackIndex];
        lcdText.textContent = "00:00"; // Reset timer for demo
        lcdTrack.textContent = `${track.artist} - ${track.name}`;
        marqueeSong.textContent = `"${track.name}" - ${track.artist}`;
        
        if (!isPlaying) {
            playPauseBtn.textContent = "▶";
            visualizer.style.animationPlayState = 'paused';
        } else {
            playPauseBtn.textContent = "⏸";
            visualizer.style.animationPlayState = 'running';
        }
    }

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        updatePlayerUI();
    });

    stopBtn.addEventListener('click', () => {
        isPlaying = false;
        updatePlayerUI();
        lcdText.textContent = "00:00";
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        updatePlayerUI();
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        updatePlayerUI();
    });

    // Initial Load
    updatePlayerUI();


    // --- 3. GUESTBOOK SYSTEM ---
    const guestbookEntries = document.getElementById('guestbook-entries');
    const guestNameInput = document.getElementById('guest-name');
    const guestMsgInput = document.getElementById('guest-msg');
    const postBtn = document.getElementById('post-guestbook');

    postBtn.addEventListener('click', () => {
        const name = guestNameInput.value.trim();
        const msg = guestMsgInput.value.trim();

        if (name && msg) {
            const newEntry = document.createElement('div');
            newEntry.classList.add('entry');
            newEntry.innerHTML = `
                <span class="entry-user">${name}:</span>
                <span class="entry-msg">${msg}</span>
            `;
            
            // Prepend to show newest at top
            guestbookEntries.prepend(newEntry);
            
            // Clear inputs
            guestNameInput.value = '';
            guestMsgInput.value = '';

            // Tiny visual feedback
            newEntry.style.animation = 'flash 0.5s ease-out';
        } else {
            alert("Enter a name and a message, silly! <3");
        }
    });


    // --- 4. HIT COUNTER ANIMATION ---
    const counterVal = document.getElementById('counter-val');
    let count = 4320;
    const target = 4321;

    const counterInterval = setInterval(() => {
        count++;
        counterVal.textContent = count.toString().padStart(7, '0');
        if (count >= target) clearInterval(counterInterval);
    }, 100);

});