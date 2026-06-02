document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. LIGHTING & AMBIENT EFFECTS
    // ==========================================================================
    const body = document.body;
    const flashlight = document.getElementById('flashlight');
    const lampToggle = document.getElementById('lampToggle');
    const audioToggle = document.getElementById('audioToggle');
    const audioStatus = document.getElementById('audioStatus');
    const rainAudio = document.getElementById('rainAudio');
    const jazzAudio = document.getElementById('jazzAudio');

    // Flashlight mouse tracking
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        flashlight.style.setProperty('--mouse-x', `${x}px`);
        flashlight.style.setProperty('--mouse-y', `${y}px`);
    });

    // Lamp toggle switch
    lampToggle.addEventListener('click', () => {
        body.classList.toggle('lamp-off');
    });

    // Retro Ambient Audio Controller
    let ambientPlaying = false;
    audioToggle.addEventListener('click', () => {
        if (!ambientPlaying) {
            // Play atmospheric rain and jazz
            rainAudio.volume = 0.40;
            jazzAudio.volume = 0.15;
            
            Promise.all([rainAudio.play(), jazzAudio.play()])
                .then(() => {
                    ambientPlaying = true;
                    audioStatus.textContent = "Mute Ambient";
                    audioToggle.classList.add('red-accent');
                })
                .catch(err => console.log("Audio playback blocked until user interaction."));
        } else {
            rainAudio.pause();
            jazzAudio.pause();
            ambientPlaying = false;
            audioStatus.textContent = "Play Ambient";
            audioToggle.classList.remove('red-accent');
        }
    });


    // ==========================================================================
    // 2. CABINET FOLDER TAB SYSTEM
    // ==========================================================================
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');

            tabLinks.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));

            link.classList.add('active');
            document.getElementById(targetTab).classList.remove('hidden');

            // Trigger typing effect if entering the statement transcript tab
            if (targetTab === 'witnesses') {
                triggerCurrentStatement();
            }
        });
    });

    // Suspect Profiles Overlay Controller
    const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
    const backToListBtns = document.querySelectorAll('.back-to-list-btn');
    const suspectsContainer = document.querySelector('.suspects-list');
    const sectionHeader = document.querySelector('#suspects .section-header');

    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Hide suspects listing and its title
            suspectsContainer.classList.add('hidden');
            sectionHeader.classList.add('hidden');
            
            // Show selected detailed profile sheet
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    backToListBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hide all active detailed profile sheets
            document.querySelectorAll('.profile-detail').forEach(sheet => {
                sheet.classList.add('hidden');
            });
            
            // Restore main suspects list view
            suspectsContainer.classList.remove('hidden');
            sectionHeader.classList.remove('hidden');
        });
    });


    // ==========================================================================
    // 3. TYPEWRITER STENOGRAPHY TRANSCRIPTS
    // ==========================================================================
    const transcriptOutput = document.getElementById('transcriptOutput');
    const rewindTranscript = document.getElementById('rewindTranscript');
    const statementTabs = document.querySelectorAll('.statement-tab');

    const statements = {
        clerk: `DEPOSITION - CLERK OF THE GRAND HOTEL\n\n"I was on duty at the front desk last Tuesday night when Evelyn Vance came in. It was about 11:45 PM. She looked distressed... kept checking her watch. She asked if Mr. Sterling had arrived yet. I told her he went up to his room half an hour prior with a bottle of champagne.\n\nShe took the elevator up. Thirty minutes later, she rushed down the service stairs alone. No lipstick on. Pale as a sheet. I didn't hear any shots, but then again, the thunder that night was loud enough to rattle the windowpanes."`,
        doorman: `DEPOSITION - ARTHUR (DOORMAN AT BLUE DAHLIA)\n\n"Sure, I saw Joe Falcone's muscle lounging in the sedan down the block. 'The Bruiser' they call him. He was smoking those unfiltered cigarettes and staring straight up at Sterling's balcony.\n\nEvelyn Vance came out of the club around 11:15 PM and hailed a cab. She was carrying a small purse, not her usual stage case. Later, around midnight, Falcone himself walked past me. He had a look on his face like he just won the lottery, but his knuckles were raw. Something dirty went down."`
    };

    let activeWitness = 'clerk';
    let typingInterval = null;

    function typeStatement(text) {
        clearInterval(typingInterval);
        transcriptOutput.textContent = '';
        let index = 0;

        typingInterval = setInterval(() => {
            if (index < text.length) {
                transcriptOutput.textContent += text.charAt(index);
                index++;
                
                // Keep auto-scrolling to bottom of paper during transcription
                transcriptOutput.scrollTop = transcriptOutput.scrollHeight;
            } else {
                clearInterval(typingInterval);
            }
        }, 15); // Authentic high-speed typewriter pace
    }

    function triggerCurrentStatement() {
        typeStatement(statements[activeWitness]);
    }

    statementTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            statementTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeWitness = tab.getAttribute('data-witness');
            triggerCurrentStatement();
        });
    });

    rewindTranscript.addEventListener('click', () => {
        triggerCurrentStatement();
    });


    // ==========================================================================
    // 4. CONSPIRACY BOARD DRAG & RED THREAD SYSTEM
    // ==========================================================================
    const corkboard = document.getElementById('corkboard');
    const threadOverlay = document.getElementById('threadOverlay');
    const draggables = document.querySelectorAll('.draggable');

    // Define the logical links between board pins
    const connections = [
        { from: 'node-headline', to: 'node-victim' },
        { from: 'node-victim', to: 'node-evelyn' },
        { from: 'node-victim', to: 'node-falcone' },
        { from: 'node-evelyn', to: 'node-weapon' },
        { from: 'node-falcone', to: 'node-cyanide' },
        { from: 'node-weapon', to: 'node-cyanide' }
    ];

    // Drag-and-drop mechanics
    draggables.forEach(elem => {
        elem.addEventListener('mousedown', (e) => {
            // Ensure target isn't the interactive button inside profile cards
            if (e.target.tagName === 'BUTTON') return;

            e.preventDefault();
            
            // Put the dragged element on top of others
            draggables.forEach(d => d.style.zIndex = 10);
            elem.style.zIndex = 50;

            const rect = elem.getBoundingClientRect();
            const boardRect = corkboard.getBoundingClientRect();
            
            const shiftX = e.clientX - rect.left;
            const shiftY = e.clientY - rect.top;

            function moveAt(clientX, clientY) {
                let newLeft = clientX - boardRect.left - shiftX;
                let newTop = clientY - boardRect.top - shiftY;

                // Restrict boundary limit to keep elements inside the corkboard frame
                const maxLeft = boardRect.width - rect.width;
                const maxTop = boardRect.height - rect.height;

                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));

                elem.style.left = `${newLeft}px`;
                elem.style.top = `${newTop}px`;

                // Recalculate vector lines for the red strings dynamically
                updateThreads();
            }

            function onMouseMove(moveEvent) {
                moveAt(moveEvent.clientX, moveEvent.clientY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
            }, { once: true });
        });
    });

    // Calculates coordinates of pin centers and updates SVG string paths
    function updateThreads() {
        // Clear all old vector threads
        threadOverlay.innerHTML = '';

        const boardRect = corkboard.getBoundingClientRect();

        connections.forEach(conn => {
            const startNode = document.getElementById(conn.from);
            const endNode = document.getElementById(conn.to);

            if (startNode && endNode) {
                // Find pin centers relative to the corkboard element
                const startPin = startNode.querySelector('.pin');
                const endPin = endNode.querySelector('.pin');

                if (startPin && endPin) {
                    const startPinRect = startPin.getBoundingClientRect();
                    const endPinRect = endPin.getBoundingClientRect();

                    const x1 = (startPinRect.left + startPinRect.width / 2) - boardRect.left;
                    const y1 = (startPinRect.top + startPinRect.height / 2) - boardRect.top;

                    const x2 = (endPinRect.left + endPinRect.width / 2) - boardRect.left;
                    const y2 = (endPinRect.top + endPinRect.height / 2) - boardRect.top;

                    // Generate dynamic line elements inside SVG
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('class', 'thread-line');
                    
                    threadOverlay.appendChild(line);
                }
            }
        });
    }

    // Initialize board connections and setup initial render on resize
    setTimeout(updateThreads, 100);
    window.addEventListener('resize', updateThreads);
});