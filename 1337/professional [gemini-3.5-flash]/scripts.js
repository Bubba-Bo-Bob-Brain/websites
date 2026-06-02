document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // SYSTEM INITIALIZATION & STATE
    // ==========================================================================
    const state = {
        startTime: Date.now(),
        decrypted: false,
        decryptionInterval: null,
        activeNodes: 14,
        threatFeedActive: true,
        commands: {
            help: 'Show available system control protocols.',
            clear: 'Flush the console visual buffer.',
            status: 'Query current tactical system metrics.',
            nodes: 'Refresh topological map connections.',
            decrypt: 'Initialize cipher key reveal sequencer.',
            hack: 'Execute simulation protocol on target network.'
        }
    };

    // ==========================================================================
    // SYSTEM TELEMETRY (CLOCK, LATENCY, IP)
    // ==========================================================================
    const initializeTelemetry = () => {
        // Initialize user IP display
        const ipDisplay = document.getElementById('user-ip');
        if (ipDisplay) {
            const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 223) + 1);
            ipDisplay.textContent = octets.join('.');
        }

        // Live status clocks & update counters
        setInterval(updateUptime, 1000);
        setInterval(fluctuateTelemetry, 4000);
    };

    const updateUptime = () => {
        const uptimeClock = document.getElementById('uptime-clock');
        if (!uptimeClock) return;

        const diff = Date.now() - state.startTime;
        const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

        uptimeClock.textContent = `${hrs}:${mins}:${secs}`;
    };

    const fluctuateTelemetry = () => {
        // Latency fluctuation
        const latencyElement = document.getElementById('network-latency');
        if (latencyElement) {
            const currentLatency = Math.floor(Math.random() * 18) + 8;
            latencyElement.textContent = `${currentLatency}ms`;
        }

        // Packet flow flux
        const packetFlow = document.getElementById('packet-flow-rate');
        if (packetFlow) {
            const rate = (Math.random() * 40 + 80).toFixed(1);
            packetFlow.textContent = `${rate} KB/s`;
        }
    };


    // ==========================================================================
    // DYNAMIC VECTOR TOPOLOGY MAP (SVG)
    // ==========================================================================
    const buildNetworkTopology = () => {
        const svg = document.getElementById('network-svg');
        if (!svg) return;

        // Clear existing SVG elements
        svg.innerHTML = '';

        const width = 400;
        const height = 250;

        // Structured relative coordinates for key tactical network nodes
        const nodes = [
            { id: 'gw', x: 40, y: 125, label: 'GATEWAY_01', type: 'core' },
            { id: 'fw', x: 120, y: 125, label: 'FIREWALL_A', type: 'sec' },
            { id: 'r1', x: 200, y: 70, label: 'ROUTER_SEC_01', type: 'core' },
            { id: 'r2', x: 200, y: 180, label: 'ROUTER_SEC_02', type: 'core' },
            { id: 'db1', x: 340, y: 50, label: 'SQL_MASTER', type: 'db' },
            { id: 'db2', x: 340, y: 100, label: 'AUTH_STORE', type: 'db' },
            { id: 'srv1', x: 340, y: 150, label: 'PROXY_NODE', type: 'srv' },
            { id: 'srv2', x: 340, y: 200, label: 'KERN_COMPILER', type: 'srv' }
        ];

        // Map connection pairs
        const links = [
            { source: 'gw', target: 'fw' },
            { source: 'fw', target: 'r1' },
            { source: 'fw', target: 'r2' },
            { source: 'r1', target: 'db1' },
            { source: 'r1', target: 'db2' },
            { source: 'r2', target: 'srv1' },
            { source: 'r2', target: 'srv2' },
            { source: 'db1', target: 'db2' },
            { source: 'srv1', target: 'srv2' }
        ];

        // Draw structural connection links
        links.forEach(link => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);

            if (sourceNode && targetNode) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', sourceNode.x);
                line.setAttribute('y1', sourceNode.y);
                line.setAttribute('x2', targetNode.x);
                line.setAttribute('y2', targetNode.y);
                line.setAttribute('class', 'network-link');
                svg.appendChild(line);
            }
        });

        // Draw structural nodes
        nodes.forEach(node => {
            // Node group
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            // Interactive circular node element
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', '7');
            circle.setAttribute('class', 'network-node');
            circle.setAttribute('id', `node-${node.id}`);

            // Text tag for retro tactical look
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', node.x);
            label.setAttribute('y', node.y - 12);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#6ab073');
            label.setAttribute('font-size', '8px');
            label.setAttribute('font-family', 'var(--font-terminal)');
            label.textContent = node.label;

            // Simple click feedback inside tactical terminal
            circle.addEventListener('click', () => {
                triggerConsoleLog(`Pinging system terminal node ${node.label}... STATUS: STABLE [OK]`, 'text-success');
                highlightSvgNode(circle);
            });

            group.appendChild(circle);
            group.appendChild(label);
            svg.appendChild(group);
        });
    };

    const highlightSvgNode = (circleElement) => {
        circleElement.setAttribute('fill', '#3dfc5d');
        setTimeout(() => {
            circleElement.setAttribute('fill', 'var(--color-primary-dark)');
        }, 800);
    };


    // ==========================================================================
    // CRYPTOGRAPHIC TRANSMISSION DECRYPTION MATRIX
    // ==========================================================================
    const initializeDecryptionUtility = () => {
        const decryptBtn = document.getElementById('decrypt-btn');
        if (!decryptBtn) return;

        decryptBtn.addEventListener('click', () => {
            runDecryptionSequence();
        });
    };

    const runDecryptionSequence = () => {
        const cipherBox = document.getElementById('cipher-box');
        const cipherText = document.getElementById('cipher-text');
        if (!cipherBox || !cipherText || state.decrypted) return;

        state.decrypted = true;
        const originalMessage = cipherBox.getAttribute('data-decrypted');
        const charset = '01#%@$&*?_ABCDEFGHIKLMNOPQRSTVXYZ';
        let currentIteration = 0;
        const maxIterations = 15;

        // Play alert inside virtual terminal
        triggerConsoleLog('Initializing localized cryptographical decryption matrix array...', 'text-highlight');

        state.decryptionInterval = setInterval(() => {
            let obfuscatedString = '';

            for (let i = 0; i < originalMessage.length; i++) {
                if (originalMessage[i] === ' ') {
                    obfuscatedString += ' ';
                    continue;
                }

                // If character is finalized or random step allows it
                if (currentIteration > (i % 8) + 4) {
                    obfuscatedString += originalMessage[i];
                } else {
                    obfuscatedString += charset[Math.floor(Math.random() * charset.length)];
                }
            }

            cipherText.textContent = obfuscatedString;

            if (currentIteration >= maxIterations) {
                clearInterval(state.decryptionInterval);
                cipherText.textContent = originalMessage;
                cipherText.classList.add('text-success');
                triggerConsoleLog('Decryption system protocol: SECURE REVEAL COMPLETED SUCCESSFULLY.', 'text-success');
            }

            currentIteration++;
        }, 65);
    };


    // ==========================================================================
    // DYNAMIC THREAT & SYSTEM AUDIT FEED
    // ==========================================================================
    const initializeThreatFeed = () => {
        const feedContainer = document.getElementById('audit-feed');
        if (!feedContainer) return;

        // Static seed audit items
        const initialLogs = [
            { action: 'PORT_SCAN_ATTEMPTED', ip: '198.51.100.42', state: 'BLOCKED' },
            { action: 'INTEGRITY_SHIELD_UP', ip: 'INTERNAL_NODE_0x99', state: 'NOMINAL' },
            { action: 'SSH_BRUTEFORCE_MITIGATION', ip: '203.0.113.88', state: 'FILTERED' }
        ];

        initialLogs.forEach(log => appendFeedElement(feedContainer, log.action, log.ip, log.state));

        // Periodic live audit threat arrivals
        setInterval(() => {
            if (state.threatFeedActive) {
                const auditActions = ['ACCESS_REVOKED', 'MALICIOUS_DUMP_QUARANTINED', 'SQL_INJECTION_SHIELDED', 'XSS_FILTER_COMPLIED', 'SESSION_TIMEOUT_EXPIRED'];
                const maliciousIps = ['185.220.101.4', '45.146.164.125', '192.241.211.2', '80.248.237.11'];
                const action = auditActions[Math.floor(Math.random() * auditActions.length)];
                const ip = maliciousIps[Math.floor(Math.random() * maliciousIps.length)];
                const result = 'MITIGATED';

                appendFeedElement(feedContainer, action, ip, result);
            }
        }, 6000);
    };

    const appendFeedElement = (container, action, ip, result) => {
        const timeStr = new Date().toTimeString().split(' ')[0];
        
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <div>
                <span class="feed-timestamp">[${timeStr}]</span>
                <span class="feed-event text-highlight">${action}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                <span class="text-dim">SRC: ${ip}</span>
                <span class="text-success">${result}</span>
            </div>
        `;

        container.prepend(feedItem);

        // Keep internal buffer clean
        if (container.children.length > 25) {
            container.removeChild(container.lastChild);
        }
    };


    // ==========================================================================
    // SYSTEM TERMINAL ENGINE (CLI EMULATION)
    // ==========================================================================
    const initializeTerminal = () => {
        const terminalInput = document.getElementById('terminal-input');
        if (!terminalInput) return;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandText = terminalInput.value.trim();
                if (commandText) {
                    processTerminalCommand(commandText);
                    terminalInput.value = '';
                }
            }
        });
    };

    const triggerConsoleLog = (text, className = '') => {
        const outputContainer = document.getElementById('terminal-output');
        if (!outputContainer) return;

        const line = document.createElement('p');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        outputContainer.appendChild(line);

        // Auto scroll to latest terminal input response
        outputContainer.scrollTop = outputContainer.scrollHeight;
    };

    const processTerminalCommand = (rawCommand) => {
        const command = rawCommand.toLowerCase().trim();
        
        // Always echo typed command
        triggerConsoleLog(`ROOT@NET_CRAWLER:~# ${rawCommand}`);

        switch (command) {
            case 'help':
                triggerConsoleLog('=== AVAILABLE CONTROL SYSTEM PROTOCOLS ===', 'text-highlight');
                Object.entries(state.commands).forEach(([cmd, desc]) => {
                    triggerConsoleLog(`  ${cmd.padEnd(10)} - ${desc}`, 'text-dim');
                });
                break;

            case 'clear':
                const outputContainer = document.getElementById('terminal-output');
                if (outputContainer) outputContainer.innerHTML = '';
                break;

            case 'status':
                triggerConsoleLog('--- CORE DIAGNOSTICS STATS ---', 'text-highlight');
                triggerConsoleLog(`CORE_NODE:     SHADOW_NET v4.9`, 'text-dim');
                triggerConsoleLog(`SYS_STATUS:    NOMINAL`, 'text-success');
                triggerConsoleLog(`THREAT_FEED:   MONITORING ACTIVE`, 'text-success');
                triggerConsoleLog(`IP_ENDPOINT:   ${document.getElementById('user-ip')?.textContent || '127.0.0.1'}`, 'text-dim');
                triggerConsoleLog(`LATENCY_IDX:   ${document.getElementById('network-latency')?.textContent || '14ms'}`, 'text-dim');
                break;

            case 'nodes':
                triggerConsoleLog('Re-initializing topological map paths...', 'text-highlight');
                buildNetworkTopology();
                triggerConsoleLog('Topological network architecture reconstruction sequence COMPLETE.', 'text-success');
                break;

            case 'decrypt':
                const decryptBtn = document.getElementById('decrypt-btn');
                if (decryptBtn && !state.decrypted) {
                    decryptBtn.click();
                } else {
                    triggerConsoleLog('Cryptographical engine status: CIPHER REVEAL COMPLETED PREVIOUSLY.', 'text-danger');
                }
                break;

            case 'hack':
                executeSimulationHack();
                break;

            default:
                triggerConsoleLog(`Command protocol failure: "${rawCommand}" unrecognized. Type "help" for terminal control instructions.`, 'text-danger');
                break;
        }
    };

    const executeSimulationHack = () => {
        triggerConsoleLog('CRITICAL SECURITY PROTOCOLS INITIATING...', 'text-danger blink');
        
        const steps = [
            { text: 'Locating target subnet vulnerabilities...', delay: 600, class: 'text-dim' },
            { text: 'Bypassing central network firewall parameters...', delay: 1200, class: 'text-highlight' },
            { text: 'Injecting custom root authorization modules...', delay: 1800, class: 'text-highlight' },
            { text: 'OVERRIDING SECURE GATEWAY ENCRYPTION SCHEME...', delay: 2400, class: 'text-danger' },
            { text: 'ROOT ACCESS ESTABLISHED: SIMULATED NODE OWNERSHIP ACQUIRED.', delay: 3000, class: 'text-success' }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                triggerConsoleLog(step.text, step.class);
                if (step.text.includes('ROOT ACCESS')) {
                    // Flash SVG Nodes to simulate takeover feedback
                    const svgNodes = document.querySelectorAll('.network-node');
                    svgNodes.forEach(node => {
                        node.setAttribute('fill', '#ff3333');
                        setTimeout(() => {
                            node.setAttribute('fill', 'var(--color-primary-dark)');
                        }, 2000);
                    });
                }
            }, step.delay);
        });
    };

    // ==========================================================================
    // BOOTSTRAP INITIALIZER
    // ==========================================================================
    initializeTelemetry();
    buildNetworkTopology();
    initializeThreatFeed();
    initializeDecryptionUtility();
    initializeTerminal();
});