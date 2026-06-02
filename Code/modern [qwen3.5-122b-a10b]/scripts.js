// scripts.js
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        
        // --- 1. Background Canvas Animation (The "Commit Stream") ---
        const canvas = document.getElementById('background-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const PARTICLE_COUNT = 60;
        const CONNECTION_DISTANCE = 150;
        const MOUSE_REPULSION = 100;

        // Resize handling
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        // Particle Class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                // Using a ternary to select color prefix
                this.colorPrefix = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(112, 0, 255, ';
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update(mouseX, mouseY) {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (Repulsion)
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MOUSE_REPULSION) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (MOUSE_REPULSION - distance) / MOUSE_REPULSION;
                    this.vx -= forceDirectionX * force * 0.05;
                    this.vy -= forceDirectionY * force * 0.05;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.colorPrefix + this.alpha + ')';
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        // Mouse tracking
        let mouseX = -1000;
        let mouseY = -1000;

        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections first (behind particles)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        const opacity = 0.1 - (distance / CONNECTION_DISTANCE) * 0.1;
                        ctx.strokeStyle = 'rgba(100, 100, 100, ' + opacity + ')';
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(function(p) {
                p.update(mouseX, mouseY);
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // --- 2. Dynamic Heatmap Generation ---
        const heatmapGrid = document.getElementById('heatmap-grid');
        if (heatmapGrid) {
            const rows = 7;
            const cols = 50;

            for (let i = 0; i < rows * cols; i++) {
                const cell = document.createElement('div');
                cell.classList.add('heatmap-cell');
                
                // Random activity level 0-4
                const level = Math.floor(Math.random() * 5);
                cell.classList.add('level-' + level);
                cell.title = 'Contribution Level: ' + level;
                
                heatmapGrid.appendChild(cell);
            }
        }

        // --- 3. File Tree Interaction ---
        const folders = document.querySelectorAll('.folder');
        folders.forEach(function(folder) {
            folder.addEventListener('click', function(e) {
                e.stopPropagation();
                folder.classList.toggle('expanded');
                
                const icon = folder.querySelector('i');
                if (icon) {
                    if (folder.classList.contains('expanded')) {
                        icon.classList.remove('fa-folder');
                        icon.classList.add('fa-folder-open');
                    } else {
                        icon.classList.remove('fa-folder-open');
                        icon.classList.add('fa-folder');
                    }
                }
            });
        });

        // --- 4. Modal Logic ---
        const mergeBtn = document.querySelector('.btn-primary.full-width');
        const modal = document.getElementById('merge-modal');
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelBtn = document.querySelector('.modal-footer .btn-secondary');
        const mergeActionBtn = document.querySelector('.modal-footer .btn-primary');

        // Open modal
        if (mergeBtn) {
            mergeBtn.addEventListener('click', function() {
                if (modal && modal.showModal) {
                    modal.showModal();
                }
            });
        }

        // Close modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                if (modal && modal.close) modal.close();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (modal && modal.close) modal.close();
            });
        }

        // Simulate Merge Action
        if (mergeActionBtn) {
            mergeActionBtn.addEventListener('click', function() {
                const originalText = mergeActionBtn.innerHTML;
                mergeActionBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Merging...';
                mergeActionBtn.disabled = true;

                setTimeout(function() {
                    if (modal && modal.close) modal.close();
                    alert('Merge Successful! Deploying to production...');
                    mergeActionBtn.innerHTML = originalText;
                    mergeActionBtn.disabled = false;
                }, 2000);
            });
        }

        // --- 5. Search Bar Focus Effect ---
        const searchInput = document.querySelector('.search-bar input');
        const searchBar = document.querySelector('.search-bar');

        if (searchInput && searchBar) {
            searchInput.addEventListener('focus', function() {
                searchBar.style.borderColor = 'var(--accent-cyan)';
            });

            searchInput.addEventListener('blur', function() {
                searchBar.style.borderColor = 'var(--border-subtle)';
            });
        }

        // --- 6. Code Line Highlighting ---
        const codeRows = document.querySelectorAll('.code-row');
        codeRows.forEach(function(row) {
            row.addEventListener('mouseenter', function() {
                row.style.background = 'rgba(255, 255, 255, 0.05)';
            });

            row.addEventListener('mouseleave', function() {
                if (row.classList.contains('deleted')) {
                    row.style.background = 'rgba(255, 42, 109, 0.1)';
                } else if (row.classList.contains('added')) {
                    row.style.background = 'rgba(0, 255, 157, 0.1)';
                } else {
                    row.style.background = 'transparent';
                }
            });
        });
    });
})();