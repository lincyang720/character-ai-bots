// Load and display characters data
let charactersData = [];

// Fetch characters data
async function loadCharacters() {
    try {
        const response = await fetch('data/characters.json');
        charactersData = await response.json();
        return charactersData;
    } catch (error) {
        console.error('Error loading characters:', error);
        return [];
    }
}

// Create character card HTML
function createCharacterCard(character) {
    return `
        <a href="characters/${character.id}.html" class="character-card">
            <div class="character-icon">${character.image}</div>
            <h3>${character.name}</h3>
            <p>${character.description.substring(0, 100)}...</p>
            <div class="character-footer">
                <span class="rating">⭐ ${character.rating}</span>
                <span class="type-badge">${character.type}</span>
            </div>
        </a>
    `;
}

// Display characters in grid
function displayCharacters(characters) {
    const grid = document.getElementById('characters-grid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('no-results');

    if (!grid) return;

    if (loading) loading.style.display = 'none';

    if (characters.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    grid.innerHTML = characters.map(char => createCharacterCard(char)).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const characters = await loadCharacters();
    displayCharacters(characters);

    // Update total characters count
    const totalCharsElement = document.getElementById('total-characters');
    if (totalCharsElement) {
        totalCharsElement.textContent = `${characters.length}+`;
    }
});
