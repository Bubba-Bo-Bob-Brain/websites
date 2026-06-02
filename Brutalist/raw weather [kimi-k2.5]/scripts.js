// BRUTALIST_WEATHER_DASHBOARD_SCRIPT
// RAW_FUNCTIONALITY_NO_ABSTRACTION

document.addEventListener('DOMContentLoaded', function() {
    
    // ELEMENTS
    const timeDisplay = document.getElementById('current-time');
    const lastUpdate = document.getElementById('last-update');
    const mainTemp = document.getElementById('main-temp');
    const feelsLike = document.getElementById('feels-like');
    const gustSpeed = document.getElementById('gust-speed');
    const gustTime = document.getElementById('gust-time');
    const windArrows = document.querySelectorAll('.wind-arrow');
    const alertBox = document.getElementById('weather-alert');
    const tableRows = document.querySelectorAll('.brutal-table tbody tr');
    
    // STATE
    let glitchActive = false;
    let alertVisible = true;
    
    // TIMESTAMP_GENERATOR
    function updateTimestamp() {
        const now = new Date();
        const brutalTime = now.toISOString().replace('T', '_').substring(0, 19) + '_UTC';
        timeDisplay.textContent = brutalTime;
        timeDisplay.style.color = '#ffff00';
        setTimeout(() => {
            timeDisplay.style.color = '';
        }, 100);
    }
    
    // AGGRESSIVE_CLOCK
    setInterval(updateTimestamp, 1000);
    updateTimestamp();
    
    // LAST_UPDATE_STAMP
    function setLastUpdate() {
        const now = new Date();
        lastUpdate.textContent = now.toISOString().substring(11, 19);
    }
    setLastUpdate();
    
    // TEMPERATURE_GLITCH_EFFECT
    function glitchTemp() {
        if (glitchActive) return;
        glitchActive = true;
        const original = mainTemp.textContent;
        const glitches = ['42', '4Z', 'Z2', '!!', '42'];
        let count = 0;
        
        const interval = setInterval(() => {
            mainTemp.textContent = glitches[count % glitches.length];
            mainTemp.style.color = '#ff0000';
            mainTemp.style.textShadow = '4px 4px 0px #ffff00';
            count++;
            
            if (count > 5) {
                clearInterval(interval);
                mainTemp.textContent = original;
                mainTemp.style.color = '';
                mainTemp.style.textShadow = '';
                glitchActive = false;
            }
        }, 50);
    }
    
    // RANDOM_GLITCH_TRIGGER
    setInterval(() => {
        if (Math.random() > 0.95) glitchTemp();
    }, 5000);
    
    // WIND_ARROW_INTERACTION
    windArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const direction = this.getAttribute('data-direction');
            const speed = this.querySelector('.wind-speed').textContent;
            
            // BRUTAL_CONSOLE_OUTPUT
            console.log('/// WIND_DATA_CAPTURED ///');
            console.log('DIRECTION: ' + direction + '°');
            console.log('VELOCITY: ' + speed);
            console.log('TIMESTAMP: ' + new Date().toISOString());
            
            // VISUAL_FEEDBACK
            this.style.backgroundColor = '#ff0000';
            this.style.color = '#ffffff';
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 300);
            
            // AGGRESSIVE_GUST_UPDATE
            const newGust = Math.floor(Math.random() * 20) + 25;
            gustSpeed.textContent = newGust;
            gustTime.textContent = new Date().toLocaleTimeString('en-US', {hour12: false});
        });
    });
    
    // TABLE_ROW_SCANNER
    tableRows.forEach((row, index) => {
        row.addEventListener('mouseenter', function() {
            const cells = this.getElementsByTagName('td');
            if (cells[2].textContent === 'STORM') {
                this.style.backgroundColor = '#ff0000';
                this.style.color = '#ffffff';
            }
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
        });
        
        // CLICK_TO_HIGHLIGHT_ROW
        row.addEventListener('click', function() {
            tableRows.forEach(r => {
                r.style.border = '1px solid #000000';
                r.style.transform = '';
            });
            this.style.border = '4px solid #ff0000';
            this.style.transform = 'scale(1.02) rotate(-0.5deg)';
            this.style.zIndex = '100';
            this.style.position = 'relative';
            this.style.boxShadow = '8px 8px 0px #000000';
        });
    });
    
    // KEYBOARD_BRUTALISM
    document.addEventListener('keydown', function(e) {
        // R_KEY_REFRESH
        if (e.key === 'r' || e.key === 'R') {
            document.body.style.backgroundColor = '#ffff00';
            setTimeout(() => {
                document.body.style.backgroundColor = '';
            }, 100);
            setLastUpdate();
            glitchTemp();
        }
        
        // SPACE_KEY_TOGGLE_ALERT
        if (e.key === ' ') {
            e.preventDefault();
            alertVisible = !alertVisible;
            alertBox.style.display = alertVisible ? 'flex' : 'none';
        }
        
        // G_KEY_MANUAL_GLITCH
        if (e.key === 'g' || e.key === 'G') {
            glitchTemp();
        }
    });
    
    // DATA_CORRUPTION_SIMULATION
    setInterval(() => {
        if (Math.random() > 0.98) {
            const humidity = document.getElementById('humidity');
            const originalText = humidity.textContent;
            humidity.textContent = 'ERR%';
            humidity.style.color = '#ff0000';
            humidity.style.fontSize = '4rem';
            
            setTimeout(() => {
                humidity.textContent = originalText;
                humidity.style.color = '';
                humidity.style.fontSize = '';
            }, 200);
        }
    }, 8000);
    
    // INITIAL_CONSOLE_ART
    console.log('╔════════════════════════════════════╗');
    console.log('║   BRUTALIST_WEATHER_SYSTEM_v1.0    ║');
    console.log('║   STATUS: OPERATIONAL              ║');
    console.log('║   MODE: RAW_EXPOSED                ║');
    console.log('╚════════════════════════════════════╝');
    console.log('COMMANDS: [R]efresh [G]litch [SPACE]toggle_alert');
    
    // MOUSE_TRACKER_BRUTAL
    document.addEventListener('mousemove', function(e) {
        if (e.clientX < 50 && e.clientY < 50) {
            console.log('/// EDGE_DETECTION: TOP_LEFT_CORNER ///');
        }
    });
});