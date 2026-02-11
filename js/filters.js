// Filter and sort functionality for homepage
let allCharacters = [];
let filteredCharacters = [];
let currentMoodFilter = null;

// Mood to character type mapping
const moodMapping = {
    romantic: ['Yandere', 'Tsundere', 'Kuudere', 'Dandere'],
    adventure: ['Vampire', 'Fantasy', 'Demon', 'Dragon', 'Knight', 'Pirate', 'Werewolf'],
    comfort: ['Dandere', 'Modern', 'Cafe', 'Nurse', 'Yoga', 'Florist'],
    mystery: ['Detective', 'Ghost', 'Fortune', 'Witch', 'Assassin'],
    scifi: ['Sci-Fi', 'Android', 'Space', 'Time', 'Hacker'],
    casual: ['Modern', 'Bookstore', 'Cafe', 'Barista', 'Chef', 'Photographer']
};

// Load characters data
async function initFilters() {
    try {
        const response = await fetch('data/characters.json');
        allCharacters = await response.json();
        filteredCharacters = [...allCharacters];
        applyFilters();
    } catch (error) {
        console.error('Error loading characters:', error);
    }
}

// Apply all filters
function applyFilters() {
    const typeFilter = document.getElementById('type-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const sortFilter = document.getElementById('sort-filter');
    const quickSearch = document.getElementById('quick-search');

    let filtered = [...allCharacters];

    // Mood filter (takes priority)
    if (currentMoodFilter) {
        const moodKeywords = moodMapping[currentMoodFilter];
        filtered = filtered.filter(char => {
            // Check if character type or name matches any mood keywords
            return moodKeywords.some(keyword =>
                char.type.includes(keyword) ||
                char.name.toLowerCase().includes(keyword.toLowerCase()) ||
                char.category?.includes(keyword)
            );
        });
    }

    // Type filter
    if (typeFilter && typeFilter.value) {
        filtered = filtered.filter(char => char.type === typeFilter.value);
    }

    // Difficulty filter
    if (difficultyFilter && difficultyFilter.value) {
        filtered = filtered.filter(char => char.difficulty === difficultyFilter.value);
    }

    // Quick search
    if (quickSearch && quickSearch.value) {
        const searchTerm = quickSearch.value.toLowerCase();
        filtered = filtered.filter(char =>
            char.name.toLowerCase().includes(searchTerm) ||
            char.description.toLowerCase().includes(searchTerm) ||
            char.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // Sort
    if (sortFilter) {
        const sortBy = sortFilter.value;
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'popularity':
                    return b.popularity - a.popularity;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'reviews':
                    return b.reviews - a.reviews;
                default:
                    return 0;
            }
        });
    }

    filteredCharacters = filtered;
    displayCharacters(filtered);
}

// Apply mood filter
function applyMoodFilter(mood) {
    currentMoodFilter = mood;

    // Scroll to characters section
    const charactersSection = document.querySelector('.characters-section');
    if (charactersSection) {
        charactersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update active mood card
    document.querySelectorAll('.mood-card').forEach(card => {
        card.classList.remove('active');
    });
    const activeCard = document.querySelector(`[data-mood="${mood}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }

    applyFilters();
}


// Reset filters
function resetFilters() {
    const typeFilter = document.getElementById('type-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const sortFilter = document.getElementById('sort-filter');
    const quickSearch = document.getElementById('quick-search');

    if (typeFilter) typeFilter.value = '';
    if (difficultyFilter) difficultyFilter.value = '';
    if (sortFilter) sortFilter.value = 'popularity';
    if (quickSearch) quickSearch.value = '';

    // Reset mood filter
    currentMoodFilter = null;
    document.querySelectorAll('.mood-card').forEach(card => {
        card.classList.remove('active');
    });

    applyFilters();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initFilters();

    // Filter change listeners
    const typeFilter = document.getElementById('type-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const sortFilter = document.getElementById('sort-filter');
    const quickSearch = document.getElementById('quick-search');

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (difficultyFilter) difficultyFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    if (quickSearch) {
        quickSearch.addEventListener('input', debounce(applyFilters, 300));
    }

    // Mood card click listeners
    document.querySelectorAll('.mood-card').forEach(card => {
        card.addEventListener('click', () => {
            const mood = card.getAttribute('data-mood');
            applyMoodFilter(mood);
        });
    });
});

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
