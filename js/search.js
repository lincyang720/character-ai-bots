// Advanced search functionality
let allCharacters = [];
let searchResults = [];
let activeFilters = {
    types: [],
    difficulties: [],
    rating: 0,
    platforms: [],
    tags: [],
    searchTerm: ''
};

// Load characters and initialize
async function initSearch() {
    try {
        const response = await fetch('data/characters.json');
        allCharacters = await response.json();
        searchResults = [...allCharacters];

        // Generate popular tags
        generatePopularTags();

        // Display initial results
        performSearch();
    } catch (error) {
        console.error('Error loading characters:', error);
        document.getElementById('loading-results').style.display = 'none';
        document.getElementById('no-results').style.display = 'block';
    }
}

// Generate popular tags from characters
function generatePopularTags() {
    const tagsContainer = document.getElementById('popular-tags');
    if (!tagsContainer) return;

    const tagCounts = {};
    allCharacters.forEach(char => {
        char.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([tag]) => tag);

    tagsContainer.innerHTML = sortedTags.map(tag =>
        `<button class="tag-filter-btn" data-tag="${tag}">#${tag}</button>`
    ).join('');

    // Add click listeners to tag buttons
    tagsContainer.querySelectorAll('.tag-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const tag = btn.dataset.tag;
            if (activeFilters.tags.includes(tag)) {
                activeFilters.tags = activeFilters.tags.filter(t => t !== tag);
            } else {
                activeFilters.tags.push(tag);
            }
            performSearch();
        });
    });
}

// Perform search with all active filters
function performSearch() {
    let results = [...allCharacters];

    // Search term filter
    if (activeFilters.searchTerm) {
        const term = activeFilters.searchTerm.toLowerCase();
        results = results.filter(char =>
            char.name.toLowerCase().includes(term) ||
            char.description.toLowerCase().includes(term) ||
            char.displayName.toLowerCase().includes(term) ||
            char.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }

    // Type filter
    if (activeFilters.types.length > 0) {
        results = results.filter(char => activeFilters.types.includes(char.type));
    }

    // Difficulty filter
    if (activeFilters.difficulties.length > 0) {
        results = results.filter(char => activeFilters.difficulties.includes(char.difficulty));
    }

    // Rating filter
    if (activeFilters.rating > 0) {
        results = results.filter(char => char.rating >= activeFilters.rating);
    }

    // Platform filter
    if (activeFilters.platforms.length > 0) {
        results = results.filter(char =>
            activeFilters.platforms.some(platform => char.platforms[platform])
        );
    }

    // Tags filter
    if (activeFilters.tags.length > 0) {
        results = results.filter(char =>
            activeFilters.tags.some(tag => char.tags.includes(tag))
        );
    }

    // Sort results
    const sortBy = document.getElementById('sort-select')?.value || 'popularity';
    results.sort((a, b) => {
        switch (sortBy) {
            case 'popularity':
                return b.popularity - a.popularity;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'reviews':
                return b.reviews - a.reviews;
            case 'newest':
                return 0; // Would need a date field
            default:
                return 0;
        }
    });

    searchResults = results;
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const grid = document.getElementById('results-grid');
    const loading = document.getElementById('loading-results');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    if (loading) loading.style.display = 'none';

    if (results.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        if (resultsCount) resultsCount.textContent = 'No characters found';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    if (resultsCount) {
        resultsCount.textContent = `Found ${results.length} character${results.length !== 1 ? 's' : ''}`;
    }

    grid.innerHTML = results.map(char => `
        <a href="characters/${char.id}.html" class="character-card" title="View ${char.name} - ${char.type} AI Roleplay Bot">
            <div class="character-icon">${char.image}</div>
            <h3>${char.name}</h3>
            <p>${char.description.substring(0, 100)}...</p>
            <div class="character-footer">
                <span class="rating">⭐ ${char.rating}</span>
                <span class="type-badge">${char.type}</span>
            </div>
        </a>
    `).join('');
}

// Reset all filters
function resetAllFilters() {
    activeFilters = {
        types: [],
        difficulties: [],
        rating: 0,
        platforms: [],
        tags: [],
        searchTerm: ''
    };

    // Clear all checkboxes
    document.querySelectorAll('.type-checkbox, .difficulty-checkbox, .platform-checkbox').forEach(cb => {
        cb.checked = false;
    });

    // Clear rating radio
    document.querySelector('input[name="rating"][value="0"]').checked = true;

    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // Clear active tags
    document.querySelectorAll('.tag-filter-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });

    performSearch();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initSearch();

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            activeFilters.searchTerm = searchInput.value;
            performSearch();
        }, 300));
    }

    // Type checkboxes
    document.querySelectorAll('.type-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            activeFilters.types = Array.from(document.querySelectorAll('.type-checkbox:checked'))
                .map(cb => cb.value);
            performSearch();
        });
    });

    // Difficulty checkboxes
    document.querySelectorAll('.difficulty-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            activeFilters.difficulties = Array.from(document.querySelectorAll('.difficulty-checkbox:checked'))
                .map(cb => cb.value);
            performSearch();
        });
    });

    // Rating radio buttons
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', () => {
            activeFilters.rating = parseFloat(radio.value);
            performSearch();
        });
    });

    // Platform checkboxes
    document.querySelectorAll('.platform-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            activeFilters.platforms = Array.from(document.querySelectorAll('.platform-checkbox:checked'))
                .map(cb => cb.value);
            performSearch();
        });
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', performSearch);
    }

    // Apply filters button
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', performSearch);
    }

    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
    }
});

// Debounce function
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
