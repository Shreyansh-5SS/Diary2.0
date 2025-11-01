import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AnimeModal from '../components/AnimeModal'
import axios from 'axios'
import styles from '../styles/Anime.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Common anime genres
const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
]

export default function Anime() {
  const [animeList, setAnimeList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAnime, setEditingAnime] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [sortBy, setSortBy] = useState('recent')
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchAnimeList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/anime`)
      setAnimeList(response.data.anime)
    } catch (error) {
      console.error('Failed to fetch anime list:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...animeList]

    // Filter by genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(anime =>
        selectedGenres.every(genre =>
          anime.genres && anime.genres.includes(genre)
        )
      )
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => {
        if (!a.rating) return 1
        if (!b.rating) return -1
        return b.rating - a.rating
      })
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }
    // Default is 'recent' which is already sorted from backend

    setFilteredList(filtered)
  }

  const handleCreate = () => {
    setEditingAnime(null)
    setShowModal(true)
  }

  const handleEdit = (anime) => {
    setEditingAnime(anime)
    setShowModal(true)
  }

  const handleSave = async () => {
    setShowModal(false)
    setEditingAnime(null)
    await fetchAnimeList()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this anime?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/api/anime/${id}`)
      await fetchAnimeList()
    } catch (error) {
      console.error('Failed to delete anime:', error)
      alert('Failed to delete anime')
    }
  }

  const toggleGenreFilter = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSortBy('recent')
  }

  const renderRating = (rating) => {
    if (!rating) return <span className={styles.noRating}>Not rated</span>

    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      )
    }
    return <div className={styles.starsContainer}>{stars}</div>
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } })
    } else if (isAuthenticated) {
      fetchAnimeList()
    }
  }, [isAuthenticated, authLoading, navigate, location])

  useEffect(() => {
    applyFiltersAndSort()
  }, [animeList, selectedGenres, sortBy])

  if (authLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading anime list...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Anime Watchlist</h1>
        <button onClick={handleCreate} className={styles.createButton}>
          + Add Anime
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Filter by Genre:</label>
          <div className={styles.genreChips}>
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenreFilter(genre)}
                className={`${styles.genreChip} ${
                  selectedGenres.includes(genre) ? styles.genreChipActive : ''
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterSection}>
          <label htmlFor="sort" className={styles.filterLabel}>
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {(selectedGenres.length > 0 || sortBy !== 'recent') && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        )}
      </div>

      {filteredList.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {animeList.length === 0
              ? 'No anime in your watchlist yet.'
              : 'No anime match your filters.'}
          </p>
          <p className={styles.emptyHint}>
            {animeList.length === 0
              ? 'Click "Add Anime" to start building your collection'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className={styles.masonryGrid}>
          {filteredList.map((anime) => (
            <article key={anime.id} className={styles.animeCard}>
              {anime.image_url && (
                <div className={styles.coverContainer}>
                  <img
                    src={anime.image_url}
                    alt={anime.title}
                    className={styles.cover}
                  />
                </div>
              )}

              <div className={styles.cardContent}>
                <h2 className={styles.animeTitle}>{anime.title}</h2>

                {anime.genres && anime.genres.length > 0 && (
                  <div className={styles.genres}>
                    {anime.genres.map((genre, index) => (
                      <span key={index} className={styles.genreTag}>
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.rating}>{renderRating(anime.rating)}</div>

                {anime.status && (
                  <div className={styles.status}>
                    Status: <span className={styles.statusValue}>{anime.status.replace(/_/g, ' ')}</span>
                  </div>
                )}

                {anime.notes && (
                  <p className={styles.notes}>{anime.notes.substring(0, 100)}{anime.notes.length > 100 ? '...' : ''}</p>
                )}

                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEdit(anime)}
                    className={styles.actionButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(anime.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <AnimeModal
          anime={editingAnime}
          onClose={() => {
            setShowModal(false)
            setEditingAnime(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
