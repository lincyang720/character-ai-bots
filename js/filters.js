// Filter and sort functionality for homepage
let allCharacters = [];
let filteredCharacters = [];
let currentMoodFilter = null;
const PAGE_SIZE = 12;
let visibleLimit = PAGE_SIZE;

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
function applyFilters({ resetPage = true } = {}) {
    const typeFilter = document.getElementById('type-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const platformFilter = document.getElementById('platform-filter');
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

    if (platformFilter && platformFilter.value) {
        filtered = filtered.filter(char => Boolean(char.platforms?.[platformFilter.value]));
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
    if (resetPage) visibleLimit = PAGE_SIZE;
    displayCharacters();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function displayCharacters() {
    const grid = document.getElementById('characters-grid');
    const count = document.getElementById('characters-count');
    const loadMore = document.getElementById('load-more-characters');
    if (!grid) return;

    const visibleCharacters = filteredCharacters.slice(0, visibleLimit);
    grid.innerHTML = visibleCharacters.map(char => `
        <a href="characters/${encodeURIComponent(char.id)}.html" class="character-card" title="View ${escapeHtml(char.name)} - ${escapeHtml(char.type)} AI Roleplay Bot">
            <div class="character-icon">${escapeHtml(char.image)}</div>
            <h3>${escapeHtml(char.name)}</h3>
            <p>${escapeHtml(char.description.substring(0, 100))}...</p>
            <div class="character-footer">
                <span class="rating">⭐ ${escapeHtml(char.rating)}</span>
                <span class="type-badge">${escapeHtml(char.type)}</span>
            </div>
        </a>
    `).join('');

    if (count) count.textContent = `Showing ${visibleCharacters.length} of ${filteredCharacters.length} characters`;
    if (loadMore) {
        const remaining = filteredCharacters.length - visibleCharacters.length;
        loadMore.hidden = remaining <= 0;
        loadMore.textContent = `Load ${Math.min(PAGE_SIZE, remaining)} more character${remaining === 1 ? '' : 's'}`;
    }
}

function loadMoreCharacters() {
    visibleLimit += PAGE_SIZE;
    displayCharacters();
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
    const platformFilter = document.getElementById('platform-filter');
    const sortFilter = document.getElementById('sort-filter');
    const quickSearch = document.getElementById('quick-search');

    if (typeFilter) typeFilter.value = '';
    if (difficultyFilter) difficultyFilter.value = '';
    if (platformFilter) platformFilter.value = '';
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
    const platformFilter = document.getElementById('platform-filter');
    const sortFilter = document.getElementById('sort-filter');
    const quickSearch = document.getElementById('quick-search');
    const loadMore = document.getElementById('load-more-characters');

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (difficultyFilter) difficultyFilter.addEventListener('change', applyFilters);
    if (platformFilter) platformFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    if (quickSearch) {
        quickSearch.addEventListener('input', debounce(applyFilters, 300));
    }
    if (loadMore) loadMore.addEventListener('click', loadMoreCharacters);

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
