document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CLOCK SYSTEM ---
    const initClock = () => {
        const hourHand = document.querySelector('.hand.hour');
        const minuteHand = document.querySelector('.hand.minute');
        const secondHand = document.querySelector('.hand.second');

        const updateClock = () => {
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();

            const secondsDegrees = ((seconds / 60) * 360);
            const minutesDegrees = ((minutes / 60) * 360) + ((seconds/60)*6);
            const hoursDegrees = ((hours / 12) * 360) + ((minutes/60)*30);

            secondHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
            minuteHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
            hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;
        };

        setInterval(updateClock, 1000);
        updateClock(); // Initial call
    };

    // --- 2. PROPAGANDA ROTATOR ---
    const initPosters = () => {
        const slides = document.querySelectorAll('.poster');
        const prevBtn = document.getElementById('prev-poster');
        const nextBtn = document.getElementById('next-poster');
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            // Handle wrapping
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        // Auto rotate every 8 seconds
        const startAutoPlay = () => { autoPlayInterval = setInterval(nextSlide, 8000); };
        const stopAutoPlay = () => { clearInterval(autoPlayInterval); };

        nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
        prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });

        startAutoPlay();
    };

    // --- 3. RADIO INTERCEPT LOGIC ---
    const initRadio = () => {
        const feedContainer = document.getElementById('intercept-feed');
        const toggleBtn = document.getElementById('radio-toggle');
        const freqSlider = document.querySelector('.slider-knob');
        let isRadioOn = true;

        const messages = [
            { text: "[ENCRYPTED] Signal detected at 42.5N...", type: "normal" },
            { text: "Weather report: Heavy fog expected in valleys.", type: "normal" },
            { text: "Squadron 7 returning to base. Low fuel.", type: "normal" },
            { text: "ALERT: Unauthorized transmission on Channel 4.", type: "warning" },
            { text: "Supply convoy delayed by 12 hours.", type: "normal" },
            { text: "Enemy artillery heard in Grid J-9.", type: "warning" },
            { text: "Code: 'EAGLE HAS LANDED' confirmed.", type: "normal" },
            { text: "Interference detected. Adjust frequency.", type: "warning" }
        ];

        const getTime = () => {
            const now = new Date();
            return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        };

        const addMessage = () => {
            if (!isRadioOn) return;

            const msgData = messages[Math.floor(Math.random() * messages.length)];
            const entry = document.createElement('div');
            entry.className = `log-entry ${msgData.type}`;
            
            // Random slight delay to simulate decoding/typing effect visually via opacity or just simple append
            entry.innerHTML = `<span class="timestamp">${getTime()}</span> ${msgData.text}`;
            
            feedContainer.appendChild(entry);
            
            // Auto scroll to bottom
            feedContainer.scrollTop = feedContainer.scrollHeight;

            // Limit entries to prevent memory leak
            if (feedContainer.children.length > 20) {
                feedContainer.removeChild(feedContainer.firstChild);
            }
        };

        // Toggle Switch
        toggleBtn.addEventListener('click', () => {
            isRadioOn = !isRadioOn;
            toggleBtn.classList.toggle('active');
            
            const screen = document.querySelector('.crt-screen');
            if(!isRadioOn) {
                screen.style.opacity = '0.3';
                screen.style.filter = 'grayscale(100%)';
            } else {
                screen.style.opacity = '1';
                screen.style.filter = 'none';
            }
        });

        // Frequency Slider changes noise text (simulation)
        freqSlider.addEventListener('input', (e) => {
            if(!isRadioOn) return;
            // Add a static burst visual
            const burst = document.createElement('div');
            burst.textContent = "shhhhhhh...";
            burst.style.color = '#555';
            burst.style.fontSize = '0.7rem';
            feedContainer.appendChild(burst);
            feedContainer.scrollTop = feedContainer.scrollHeight;
        });

        // Random interval for messages
        setInterval(() => {
            if(Math.random() > 0.6) addMessage();
        }, 3000);
    };

    // --- 4. STRATEGY MAP INTERACTIONS (DRAG & DROP) ---
    const initMap = () => {
        const tokens = document.querySelectorAll('.unit-token');
        const mapSurface = document.querySelector('.map-surface');
        
        tokens.forEach(token => {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            const onMouseDown = (e) => {
                isDragging = true;
                token.style.zIndex = 100; // Bring to front
                token.style.cursor = 'grabbing';

                // Get mouse offset relative to token
                const rect = token.getBoundingClientRect();
                const parentRect = mapSurface.getBoundingClientRect();
                
                // Calculate current left/top in percentage relative to parent
                const currentLeftPercent = (token.offsetLeft / parentRect.width) * 100;
                const currentTopPercent = (token.offsetTop / parentRect.height) * 100;

                startX = e.clientX;
                startY = e.clientY;
                
                // Store initial percentage positions
                initialLeft = token.offsetLeft;
                initialTop = token.offsetTop;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;

                // Boundaries
                const parentRect = mapSurface.getBoundingClientRect();
                const tokenRect = token.getBoundingClientRect();

                const maxLeft = parentRect.width - token.offsetWidth;
                const maxTop = parentRect.height - token.offsetHeight;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft > maxLeft) newLeft = maxLeft;
                if (newTop > maxTop) newTop = maxTop;

                token.style.left = `${newLeft}px`;
                token.style.top = `${newTop}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                token.style.zIndex = 10; // Reset z-index
                token.style.cursor = 'grab';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            token.addEventListener('mousedown', onMouseDown);
        });
    };

    // --- 5. RESOURCE GAUGES SIMULATION ---
    const initGauges = () => {
        const steelGauge = { el: document.querySelector('.gauge-fill.steel-fill'), needle: document.querySelector('.gauge-wrapper:nth-child(1) .gauge-needle'), text: document.querySelector('.gauge-wrapper:nth-child(1) .gauge-value'), val: 78 };
        const fuelGauge = { el: document.querySelector('.gauge-fill.fuel-fill'), needle: document.querySelector('.gauge-wrapper:nth-child(2) .gauge-needle'), text: document.querySelector('.gauge-wrapper:nth-child(2) .gauge-value'), val: 32 };
        const troopsGauge = { el: document.querySelector('.gauge-fill.manpower-fill'), needle: document.querySelector('.gauge-wrapper:nth-child(3) .gauge-needle'), text: document.querySelector('.gauge-wrapper:nth-child(3) .gauge-value'), val: 92 };

        const gauges = [steelGauge, fuelGauge, troopsGauge];

        const updateGauge = (gauge) => {
            // Fluctuate value slightly
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            let newVal = gauge.val + change;
            
            // Clamp values
            if (newVal > 100) newVal = 100;
            if (newVal < 10) newVal = 10; // Never drop to zero for visual reasons
            gauge.val = newVal;

            // Update Text
            gauge.text.textContent = `${newVal}%`;

            // Update Needle Rotation (-90deg is 0%, 90deg is 100%)
            const deg = -90 + ((newVal / 100) * 180);
            gauge.needle.style.transform = `translateX(-50%) rotate(${deg}deg)`;

            // Update SVG Stroke Dashoffset (126 is full length roughly)
            // offset = 126 - (126 * percent / 100)
            const offset = 126 - (126 * (newVal / 100));
            gauge.el.style.strokeDashoffset = offset;
        };

        // Update gauges periodically
        setInterval(() => {
            gauges.forEach(g => updateGauge(g));
        }, 2000);
    };

    // --- 6. DEPLOY BUTTON & PRODUCTION BARS ---
    const initProduction = () => {
        const deployBtn = document.getElementById('deploy-btn');
        const bars = document.querySelectorAll('.bar-fill');
        
        deployBtn.addEventListener('click', () => {
            // Visual feedback
            deployBtn.textContent = "DEPLOYING...";
            deployBtn.style.background = "#555";
            
            // Flash effect
            const overlay = document.querySelector('.lighting-overlay');
            overlay.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            setTimeout(() => { overlay.style.backgroundColor = "transparent"; }, 200);

            // Simulate resource consumption
            setTimeout(() => {
                deployBtn.textContent = "RESERVES SENT";
                // Reduce bars slightly
                bars.forEach(bar => {
                    let currentW = parseInt(bar.style.width);
                    if (currentW > 10) {
                        bar.style.width = (currentW - 5) + "%";
                    }
                });

                setTimeout(() => {
                    deployBtn.textContent = "DEPLOY RESERVES";
                    deployBtn.style.background = ""; // Reset to CSS gradient
                }, 2000);
            }, 1000);
        });

        // Slowly increase production bars over time
        setInterval(() => {
            bars.forEach(bar => {
                let w = parseInt(bar.style.width);
                if (!isNaN(w) && w < 100) {
                    bar.style.width = (w + 1) + "%";
                }
            });
        }, 5000);
    };

    // --- INITIALIZATION ---
    initClock();
    initPosters();
    initRadio();
    initMap();
    initGauges();
    initProduction();

    // Add random map pins occasionally
    const mapSurface = document.querySelector('.map-surface');
    setInterval(() => {
        if(Math.random() > 0.7) {
            const pin = document.createElement('div');
            pin.className = Math.random() > 0.5 ? 'push-pin red' : 'push-pin blue';
            pin.style.top = Math.random() * 80 + 10 + '%';
            pin.style.left = Math.random() * 80 + 10 + '%';
            mapSurface.appendChild(pin);
            
            // Remove old pins if too many
            const pins = mapSurface.querySelectorAll('.push-pin');
            if(pins.length > 10) {
                mapSurface.removeChild(pins[0]);
            }
        }
    }, 10000);

});