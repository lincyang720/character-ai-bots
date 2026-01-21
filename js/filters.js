// Filter and sort functionality for homepage
let allCharacters = [];
let filteredCharacters = [];

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
