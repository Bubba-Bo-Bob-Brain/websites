// ===== Screen Navigation =====
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        // Trigger page-specific effects
        if (screenId === 'screen-db') {
            startDbDump();
        }
        if (screenId === 'screen-hidden') {
            triggerHiddenDiscovery();
        }
    }
}

// ===== Corrupted Text Shuffling =====
function corruptText(element, intensity = 0.3) {
    const original = element.textContent;
    const chars = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ0123456789!@#$%&*';
    
    setInterval(() => {
        if (Math.random() < intensity) {
            let corrupted = '';
            for (let i = 0; i < original.length; i++) {
                if (Math.random() < 0.1) {
                    corrupted += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    corrupted += original[i];
                }
            }
            element.textContent = corrupted;
            setTimeout(() => {
                element.textContent = original;
            }, 100 + Math.random() * 200);
        }
    }, 2000 + Math.random() * 3000);
}

// Apply to specific elements
document.addEventListener('DOMContentLoaded', () => {
    const glitchElements = document.querySelectorAll('.glitch-text h2, .corrupted-text p, .error-details p');
    glitchElements.forEach(el => corruptText(el, 0.15));
});

// ===== Fake Loading Bar =====
const loadingProgress = document.getElementById('loading-progress');
const loadingText = document.getElementById('loading-text');

if (loadingProgress && loadingText) {
    let progress = 0;
    let direction = 1;
    let textIndex = 0;
    const loadingTexts = [
        'LOADING ARCHIVE...',
        'DECRYPTING SECTORS...',
        'READING CORRUPTED DATA...',
        'ERROR: SECTOR 7 FAILED',
        'RETRYING...',
        'LOADING ARCHIVE...',
        'SCANNING FOR INTEGRITY...',
        'INTEGRITY CHECK FAILED',
        'LOADING CORRUPTED ARCHIVE...',
        '...'
    ];

    setInterval(() => {
        progress += direction * (Math.random() * 3);
        if (progress >= 100) {
            progress = 100;
            direction = -1;
        }
        if (progress <= 0) {
            progress = 0;
            direction = 1;
        }
        loadingProgress.style.width = progress + '%';

        if (Math.random() < 0.1) {
            textIndex = (textIndex + 1) % loadingTexts.length;
            loadingText.textContent = loadingTexts[textIndex];
        }
    }, 200);

    // Occasionally reset
    setInterval(() => {
        if (Math.random() < 0.3) {
            progress = 0;
            direction = 1;
            loadingProgress.style.width = '0%';
        }
    }, 5000);
}

// ===== Database Dump Animation =====
let dbDumpStarted = false;
function startDbDump() {
    if (dbDumpStarted) return;
    dbDumpStarted = true;

    const dbDump = document.getElementById('db-dump');
    if (!dbDump) return;

    const dumpLines = [
        '-- MySQL dump 8.47.3',
        '-- Host: localhost    Database: corrupt_net',
        '-- Server version       3.23.49-nt',
        '',
        '/*!400001 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;',
        '/*!400001 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;',
        '/*!400001 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;',
        '/*!400001 SET NAMES utf8 */;',
        '/*!400001 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;',
        '/*!400001 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;',
        '',
        '-- Table structure for table `users`',
        'DROP TABLE IF EXISTS `users`;',
        'CREATE TABLE `users` (',
        '  `id` int(11) NOT NULL AUTO_INCREMENT,',
        '  `username` varchar(255) DEFAULT NULL,',
        '  `email` varchar(255) DEFAULT NULL,',
        '  `password_hash` varchar(512) DEFAULT NULL,',
        '  `last_login` datetime DEFAULT NULL,',
        '  `session_token` varchar(128) DEFAULT NULL,',
        '  `access_level` tinyint(1) DEFAULT 0,',
        '  `deleted` tinyint(1) DEFAULT 0,',
        '  PRIMARY KEY (`id`)',
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1;',
        '',
        '-- Dumping data for table `users`',
        'LOCK TABLES `users` WRITE;',
        '',
        '--- CORRUPTED ENTRY ---',
        'INSERT INTO `users` VALUES',
        '  (1,\'admin\',\'admin@corrupt-net.org\',\'$2a$10$N9qo8uLOickgx2ZMRZoMyeXOjKXGw7zGXu4tV.yaZx5qOvOHhI3yq\',\'1997-03-14 02:47:33\',NULL,1,0),',
        '  (2,\'anonymous\',\'ghost@void.net\',\'$2a$10$ corrupted $hash_value\',\'1997-03-14 02:41:07\',NULL,0,0),',
        '  (3,\'archive_keeper\',\'keeper@the-nternet.org\',\'$2a$10$XVqDzY9kQx7KlPmN5wR2RuGhIjKbOvTsPuQrStUvWxYzAbCdEfGh\',\'1997-03-14 00:00:00\',NULL,2,0),',
        '  (4,\'?????\'',NULL, NULL, NULL, '--- DATA CORRUPTED ---', '--- END CORRUPTED ---',
        '',
        '-- Table structure for table `leaked_files`',
        'DROP TABLE IF EXISTS `leaked_files`;',
        'CREATE TABLE `leaked_files` (',
        '  `id` int(11) NOT NULL AUTO_INCREMENT,',
        '  `filename` varchar(512) DEFAULT NULL,',
        '  `file_size` bigint(20) DEFAULT NULL,',
        '  `uploaded_by` int(11) DEFAULT NULL,',
        '  `upload_date` datetime DEFAULT NULL,',
        '  `is_corrupted` tinyint(1) DEFAULT 1,',
        '  `integrity_hash` varchar(64) DEFAULT NULL,',
        '  PRIMARY KEY (`id`)',
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1;',
        '',
        '-- Dumping data for table `leaked_files`',
        'LOCK TABLES `leaked_files` WRITE;',
        '',
        'INSERT INTO `leaked_files` VALUES',
        '  (1,\'user_database.sql\',847773120,1,\'1997-03-14 02:47:33\',1,\'a1b2c3d4e5f6...CORRUPTED\'),',
        '  (2,\'passwords.enc\',4194304,1,\'1997-03-14 02:47:33\',1,\'deadbeef...CORRUPTED\'),',
        '  (3,\'crash_log_1997.txt\',102400,1,\'1997-03-14 02:30:00\',1,\'00000000...CORRUPTED\'),',
        '  (4,\'hidden_page.html\',3421,3,\'1997-03-14 00:00:00\',0,\'goldeneye...INTACT\'),',
        '  (5,\'memory_archive.dat\',16777216,3,\'1997-03-14 00:00:00\',0,\'faithful...INTACT\'),',
        '  (6,\'???_file_0x00.dat\',0,NULL,NULL,1,NULL);',
        '',
        'UNLOCK TABLES;',
        '',
        '-- Time: 1997-03-14 02:49:11',
        '-- ERROR 1146: Table \'corrupt_net.secret_content\' doesn\'t exist',
        '-- WARNING: 3 records marked as corrupted during dump',
        '-- NOTE: One file remains intact. Seek it through the errors.',
    ];

    let lineIndex = 0;
    const typeSpeed = 30 + Math.random() * 40;

    function typeLine() {
        if (lineIndex >= dumpLines.length) {
            // Loop after a pause
            setTimeout(() => {
                lineIndex = 0;
                dbDump.textContent = '';
                typeLine();
            }, 2000);
            return;
        }

        const line = dumpLines[lineIndex];
        const isCorrupt = line.includes('CORRUPTED') || line.includes('???') || line.includes('?????');
        const isIntact = line.includes('INTACT');

        let formattedLine = line;
        if (isCorrupt) {
            formattedLine = `<span class="corrupt-line">${escapeHtml(line)}</span>`;
        } else if (isIntact) {
            formattedLine = `<span style="color: var(--text-gold); font-weight: bold;">${escapeHtml(line)}</span>`;
        } else {
            formattedLine = escapeHtml(line);
        }

        dbDump.innerHTML += formattedLine + '\n';
        lineIndex++;
        dbDump.scrollTop = dbDump.scrollHeight;

        setTimeout(typeLine, typeSpeed + Math.random() * 20);
    }

    typeLine();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Hidden Page Discovery =====
function triggerHiddenDiscovery() {
    // Easter egg: if user reached here, show additional effects
    const hiddenContainer = document.querySelector('.hidden-container');
    if (!hiddenContainer) return;

    // Add golden particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200);
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: var(--text-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9990;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        opacity: 0;
        box-shadow: 0 0 6px var(--text-gold);
    `;
    document.body.appendChild(particle);

    // Animate particle floating up
    let posY = parseFloat(particle.style.top);
    let opacity = 0;
    let growing = true;

    const animate = () => {
        if (growing) {
            opacity += 0.02;
            if (opacity >= 1) growing = false;
        } else {
            opacity -= 0.01;
            posY -= 0.5;
            particle.style.top = posY + 'vh';
        }
        particle.style.opacity = opacity;
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    animate();
}

// ===== Cursor Trail Effect =====
const cursorTrail = document.getElementById('cursor-trail');
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 50) return;
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 4px;
        height: 4px;
        background: var(--text-green);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9995;
        opacity: 0.6;
        transform: translate(-2px, -2px);
    `;
    document.body.appendChild(trail);

    let opacity = 0.6;
    const fadeOut = () => {
        opacity -= 0.02;
        trail.style.opacity = opacity;
        if (opacity > 0) {
            requestAnimationFrame(fadeOut);
        } else {
            trail.remove();
        }
    };
    fadeOut();
});

// ===== Random Glitch Bursts =====
setInterval(() => {
    if (Math.random() < 0.15) {
        const screens = document.querySelectorAll('.screen.active');
        screens.forEach(screen => {
            screen.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            setTimeout(() => {
                screen.style.filter = 'none';
            }, 50 + Math.random() * 150);
        });
    }
}, 3000);

// ===== Visitor Counter Corruption =====
const visitorCounter = document.querySelector('.visitor-counter');
if (visitorCounter) {
    setInterval(() => {
        if (Math.random() < 0.3) {
            let count = '';
            const length = 15 + Math.floor(Math.random() * 10);
            for (let i = 0; i < length; i++) {
                count += Math.floor(Math.random() * 10);
            }
            visitorCounter.textContent = 'VISITORS: ' + count;
            setTimeout(() => {
                visitorCounter.textContent = 'VISITORS: 000000000000000000000';
            }, 1000);
        }
    }, 5000);
}

// ===== System Time Drift =====
const systemTime = document.querySelector('.system-time');
if (systemTime) {
    setInterval(() => {
        const now = new Date();
        // Drift the time slightly for eerie effect
        const drifted = new Date(now.getTime() + (Math.random() - 0.5) * 60000);
        const formatted = drifted.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        systemTime.textContent = 'SYSTEM TIME: ' + formatted;
    }, 3000);
}

// ===== Corrupt Image Placeholder =====
const corruptImage = document.querySelector('.corrupt-image');
if (corruptImage) {
    setInterval(() => {
        if (Math.random() < 0.2) {
            const glitchFactor = Math.random();
            if (glitchFactor < 0.33) {
                corruptImage.style.transform = `translateX(${Math.random() * 20 - 10}px) skewX(${Math.random() * 5}deg)`;
            } else if (glitchFactor < 0.66) {
                corruptImage.style.filter = `contrast(${1 + Math.random() * 2}) saturate(${Math.random() * 0.5}) hue-rotate(${Math.random() * 360}deg) blur(${Math.random() * 3}px)`;
            } else {
                corruptImage.style.opacity = 0.3 + Math.random() * 0.7;
            }
            setTimeout(() => {
                corruptImage.style.transform = '';
                corruptImage.style.filter = 'contrast(1.5) saturate(0.3) hue-rotate(90deg) blur(1px)';
                corruptImage.style.opacity = 1;
            }, 200);
        }
    }, 2000);
}

// ===== Labyrinth Map Node Clicks =====
document.querySelectorAll('.map-node').forEach(node => {
    node.addEventListener('click', () => {
        const screenId = node.getAttribute('data-screen');
        if (screenId) {
            // Mark as visited
            document.querySelectorAll('.map-node').forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            node.classList.add('visited');
            goToScreen(screenId);
        }
    });
});

// ===== Hidden Link Easter Egg =====
const hiddenLink = document.querySelector('.hidden-link');
if (hiddenLink) {
    let clickCount = 0;
    hiddenLink.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 3) {
            goToScreen('screen-hidden');
            clickCount = 0;
        } else {
            // Visual feedback
            hiddenLink.style.color = 'var(--text-gold)';
            hiddenLink.style.textShadow = '0 0 20px var(--text-gold)';
            setTimeout(() => {
                hiddenLink.style.color = 'transparent';
                hiddenLink.style.textShadow = 'none';
            }, 500);
        }
    });
}

// ===== Audio Context for subtle glitch sounds (optional visual only) =====
// We'll skip actual audio to keep it clean, but we can add visual feedback

// ===== Initial Boot Sequence =====
window.addEventListener('load', () => {
    // Brief flash effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);

    // Animate visitor counter on load
    const counter = document.querySelector('.visitor-counter');
    if (counter) {
        let count = 0;
        const target = 1337;
        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 1000);
            if (count >= target) {
                count = target;
                clearInterval(interval);
            }
            counter.textContent = 'VISITORS: ' + String(count).padStart(21, '0');
        }, 30);
    }
});

// ===== Fake Console Messages =====
console.log('%c⚠ WARNING: You should not be reading this.', 'color: red; font-size: 20px; font-weight: bold;');
console.log('%cerror://memory_not_found — The Nternet Archive v0.0.1', 'color: #00ff41; font-size: 12px;');
console.log('%cCorrupted data detected in console output stream.', 'color: #ffb000; font-size: 10px;');
console.log('%c ACCESS GRANTED: You found the developer console. The hidden page is elsewhere.', 'color: #e8d5b7; font-size: 9px;');