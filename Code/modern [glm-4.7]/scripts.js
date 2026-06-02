/**
 * NEXUS GIT - INTERACTIVE LOGIC
 * Handles heatmap generation, file tree navigation, 
 * keyboard shortcuts, and entrance animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeatmap();
    initFileTree();
    initTabs();
    initCopyButton();
    initKeyboardShortcuts();
    initEntranceAnimation();
    initGraphInteractions();
});

/**
 * 1. Generate Dynamic Contribution Heatmap
 * Creates a 52-week grid with randomized activity levels.
 */
function initHeatmap() {
    const heatmapWrapper = document.querySelector('.heatmap-wrapper');
    if (!heatmapWrapper) return;

    const weeks = 52;
    const daysPerWeek = 7;

    for (let w = 0; w < weeks; w++) {
        const weekColumn = document.createElement('div');
        weekColumn.className = 'day-column';

        for (let d = 0; d < daysPerWeek; d++) {
            const dayBox = document.createElement('div');
            dayBox.className = 'heat-box';
            
            // Randomly assign activity level (0 to 4)
            // 0 = empty, 4 = highest
            const activityLevel = Math.floor(Math.random() * 5);
            
            if (activityLevel > 0) {
                dayBox.classList.add(`l-${activityLevel}`);
                const contributions = activityLevel * Math.floor(Math.random() * 5 + 1);
                dayBox.title = `${contributions} contributions`;
            } else {
                dayBox.title = 'No contributions';
            }

            weekColumn.appendChild(dayBox);
        }
        heatmapWrapper.appendChild(weekColumn);
    }
}

/**
 * 2. File Tree Interaction
 * Handles folder collapsing/expanding and icon switching.
 */
function initFileTree() {
    const folders = document.querySelectorAll('.tree-item.folder');

    folders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle collapsed state class
            folder.classList.toggle('collapsed');

            // Toggle visibility of the nested tree structure
            // Assumes the nested content is the immediate next sibling
            const nestedContent = folder.nextElementSibling;
            if (nestedContent && nestedContent.classList.contains('tree-indent')) {
                const isHidden = nestedContent.style.display === 'none';
                nestedContent.style.display = isHidden ? 'block' : 'none';
            }

            // Update Icons
            const folderIcon = folder.querySelector('.folder-icon');
            const arrowIcon = folder.querySelector('.arrow');

            if (folder.classList.contains('collapsed')) {
                if (folderIcon) {
                    folderIcon.classList.remove('fa-folder-open');
                    folderIcon.classList.add('fa-folder');
                }
                if (arrowIcon) {
                    arrowIcon.classList.remove('fa-chevron-down');
                    arrowIcon.classList.add('fa-chevron-right');
                }
            } else {
                if (folderIcon) {
                    folderIcon.classList.remove('fa-folder');
                    folderIcon.classList.add('fa-folder-open');
                }
                if (arrowIcon) {
                    arrowIcon.classList.remove('fa-chevron-right');
                    arrowIcon.classList.add('fa-chevron-down');
                }
            }
        });
    });
}

/**
 * 3. Tab Switching Logic
 * Visually toggles active states in the code explorer.
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Optional: Could hide/show content based on tab data attribute
            // For this demo, we just update the visual state.
        });
    });
}

/**
 * 4. Copy Code Functionality
 * Simulates copying code to clipboard with user feedback.
 */
function initCopyButton() {
    const copyBtn = document.querySelector('.btn-sm .fa-copy')?.parentElement;
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const originalHTML = copyBtn.innerHTML;
            
            // Change button state
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            copyBtn.style.borderColor = 'var(--accent-success)';
            copyBtn.style.color = 'var(--accent-success)';

            // Revert after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 2000);
        });
    }
}

/**
 * 5. Keyboard Shortcuts
 * Focuses search bar on Cmd/Ctrl + K
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
                // Visual feedback on focus
                searchInput.parentElement.style.boxShadow = '0 0 0 2px rgba(0, 240, 255, 0.2)';
                setTimeout(() => {
                    searchInput.parentElement.style.boxShadow = '';
                }, 300);
            }
        }
    });
}

/**
 * 6. Staggered Entrance Animation
 * Animates cards appearing on load for a polished feel.
 */
function initEntranceAnimation() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Trigger animation with staggered delay
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index); // 100ms delay between each card
    });
}

/**
 * 7. Interactive Commit Graph
 * Adds hover effects to SVG nodes in the commit graph.
 */
function initGraphInteractions() {
    const circles = document.querySelectorAll('#commit-graph circle');
    const commitList = document.querySelectorAll('.commit-item');

    circles.forEach((circle, index) => {
        circle.addEventListener('mouseenter', () => {
            // Enlarge the hovered node
            circle.style.r = '10';
            circle.style.transition = 'r 0.2s ease';
            
            // Highlight corresponding commit in list if exists
            if (commitList[index]) {
                commitList[index].style.background = 'rgba(255, 255, 255, 0.1)';
                commitList[index].style.transform = 'scale(1.02)';
                commitList[index].style.transformOrigin = 'left center';
                commitList[index].style.transition = 'all 0.2s ease';
            }
        });

        circle.addEventListener('mouseleave', () => {
            // Reset node
            circle.style.r = '6';
            
            // Reset list item
            if (commitList[index]) {
                commitList[index].style.background = '';
                commitList[index].style.transform = '';
            }
        });
    });
}