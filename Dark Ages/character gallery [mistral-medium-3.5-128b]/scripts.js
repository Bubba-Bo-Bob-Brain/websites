document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const characterCards = document.querySelectorAll('.character-card');

    function animateOnLoad() {
        characterCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function filterCharacters(filter) {
        characterCards.forEach(card => {
            const cardClass = card.getAttribute('data-class');
            if (filter === 'all' || cardClass === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    function toggleCardExpansion(card) {
        card.classList.toggle('expanded');
        if (card.classList.contains('expanded')) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            filterCharacters(filter);
        });
    });

    characterCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            toggleCardExpansion(card);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCardExpansion(card);
            }
        });

        card.setAttribute('tabindex', '0');
    });

    animateOnLoad();
});