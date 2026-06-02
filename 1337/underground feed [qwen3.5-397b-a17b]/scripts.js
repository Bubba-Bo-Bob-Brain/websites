// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    const DECRYPT_SPEED = 30; // ms per frame
    const ITERATIONS = 10; // How many times chars change before settling
    
    // --- Elements ---
    const encryptedBlocks = document.querySelectorAll('.encrypted-block');
    const traceOverlay = document.getElementById('trace-overlay');
    const statBars = document.querySelectorAll('.bar-fill');
    const copyBtns = document.querySelectorAll('.copy-btn');

    // --- 1. Encryption/Decryption Effect ---
    
    function scrambleText(element, finalText) {
        let iterations = 0;
        const originalText = element.innerText;
        
        const interval = setInterval(() => {
            element.innerText = finalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return finalText[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');
            
            if (iterations >= finalText.length) {
                clearInterval(interval);
                element.innerText = finalText; // Ensure final match
            }
            
            iterations += 1/2; // Speed of reveal
        }, DECRYPT_SPEED);
    }

    encryptedBlocks.forEach(block => {
        const cipherText = block.querySelector('.cipher-text');
        const hiddenData = block.getAttribute('data-plaintext');
        const lockedText = block.getAttribute('data-encrypted');
        
        // Initial state
        if(cipherText) cipherText.innerText = lockedText;

        block.addEventListener('mouseenter', () => {
            if(cipherText) {
                scrambleText(cipherText, hiddenData);
                block.style.borderColor = 'var(--neon-cyan)';
                block.style.color = 'var(--neon-cyan)';
            }
        });

        block.addEventListener('mouseleave', () => {
            if(cipherText) {
                scrambleText(cipherText, lockedText);
                block.style.borderColor = '';
                block.style.color = '';
            }
        });
    });

    // --- 2. System Simulation (Stats & Glitches) ---

    // Randomize stat bars occasionally
    setInterval(() => {
        statBars.forEach(bar => {
            if (Math.random() > 0.7) {
                const randomWidth = Math.floor(Math.random() * 40) + 40; // 40-80%
                bar.style.width = `${randomWidth}%`;
                
                // Color shift based on load
                if (randomWidth > 70) {
                    bar.style.backgroundColor = 'var(--neon-red)';
                    bar.style.boxShadow = '0 0 5px var(--neon-red)';
                } else {
                    bar.style.backgroundColor = 'var(--neon-cyan)';
                    bar.style.boxShadow = '0 0 5px var(--neon-cyan)';
                }
            }
        });
    }, 2000);

    // Random UI Glitch Effect
    const glitchElements = document.querySelectorAll('.post, .sidebar, .brand');
    
    function triggerGlitch() {
        const target = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        const originalTransform = target.style.transform;
        const originalFilter = target.style.filter;
        
        // Apply glitch
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.style.filter = 'invert(1) hue-rotate(180deg)';
        
        // Remove glitch
        setTimeout(() => {
            target.style.transform = originalTransform;
            target.style.filter = originalFilter;
        }, 150);

        // Schedule next random glitch
        setTimeout(triggerGlitch, Math.random() * 5000 + 2000);
    }
    
    // Start the glitch loop
    setTimeout(triggerGlitch, 3000);

    // --- 3. "Trace Detected" Simulation ---
    
    // Simulate a security breach after 15 seconds
    setTimeout(() => {
        if (!traceOverlay.classList.contains('hidden')) return; // Already showing
        
        traceOverlay.classList.remove('hidden');
        
        // Play sound effect (optional, browser policy might block auto-audio)
        // const audio = new Audio('alert.mp3'); 
        // audio.play().catch(e => console.log('Audio blocked'));

        setTimeout(() => {
            traceOverlay.classList.add('hidden');
            // Reset styles if needed
        }, 4000); // Warning lasts 4 seconds

    }, 15000);

    // --- 4. Copy to Clipboard ---
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const codeBlock = e.target.closest('.code-snippet').querySelector('code');
            const textToCopy = codeBlock.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btn.innerText;
                btn.innerText = 'COPIED!';
                btn.style.color = 'var(--neon-green)';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.color = '';
                }, 2000);
            });
        });
    });

    // --- 5. Console Easter Egg ---
    console.log("%c NEURAL_NET // UNDERGROUND ", "background: #000; color: #00f3ff; font-size: 20px; font-weight: bold; padding: 10px; border: 2px solid #00f3ff;");
    console.log("Welcome to the underground. Stay quiet, stay encrypted.");
});