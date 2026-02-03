'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Character {
  id: string
  name: string
  description: string
  image: string
  type: string
  rating: number
  popularity: number
  tags: string[]
}

interface SearchClientProps {
  characters: Character[]
}

export default function SearchClient({ characters }: SearchClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>(characters)

  useEffect(() => {
    let filtered = characters.filter(char => {
      const matchesSearch = !searchTerm ||
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = !selectedType || char.type === selectedType

      return matchesSearch && matchesType
    })

    // Sort
    if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.popularity - a.popularity)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredCharacters(filtered)
  }, [searchTerm, selectedType, sortBy, characters])

  return (
    <>
      <section className="search-filters">
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, type, or tags..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Yandere">Yandere</option>
                <option value="Tsundere">Tsundere</option>
                <option value="Kuudere">Kuudere</option>
                <option value="Dandere">Dandere</option>
                <option value="Vampire">Vampire</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Modern">Modern</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="search-results">
        <div className="results-header">
          <h2>Search Results</h2>
          <span>Showing {filteredCharacters.length} of {characters.length} characters</span>
        </div>

        <div className="characters-grid">
          {filteredCharacters.map((char) => (
            <Link
              key={char.id}
              href={`/characters/${char.id}`}
              className="character-card"
              title={`View ${char.name} - ${char.type} AI Roleplay Bot`}
            >
              <div className="character-icon">{char.image}</div>
              <h3>{char.name}</h3>
              <p>{char.description.substring(0, 100)}...</p>
              <div className="character-footer">
                <span className="rating">⭐ {char.rating}</span>
                <span className="type-badge">{char.type}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
