import knex from 'knex'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.development)

/**
 * Get all anime entries for current user
 * GET /api/anime
 * Query params: genre, sort
 */
export const getAnimeList = async (req, res) => {
  try {
    const { genre, sort } = req.query
    const userId = req.user.id

    let query = db('anime_list')
      .where({ user_id: userId })

    // Filter by genre (can be comma-separated)
    if (genre) {
      const genres = genre.split(',').map(g => g.trim())
      genres.forEach(g => {
        query = query.where('genres', 'like', `%${g}%`)
      })
    }

    // Sort
    if (sort === 'rating') {
      query = query.orderBy('rating', 'desc').orderByRaw('rating IS NULL')
    } else if (sort === 'title') {
      query = query.orderBy('title', 'asc')
    } else {
      // Default: most recent first
      query = query.orderBy('created_at', 'desc')
    }

    const animeList = await query

    // Parse JSON fields
    const parsedList = animeList.map(anime => ({
      ...anime,
      genres: anime.genres ? JSON.parse(anime.genres) : []
    }))

    res.json({
      anime: parsedList,
      count: parsedList.length
    })
  } catch (error) {
    console.error('Get anime list error:', error)
    res.status(500).json({
      error: 'Failed to fetch anime list',
      message: error.message
    })
  }
}

/**
 * Get single anime entry
 * GET /api/anime/:id
 */
export const getAnimeEntry = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const anime = await db('anime_list')
      .where({ id, user_id: userId })
      .first()

    if (!anime) {
      return res.status(404).json({
        error: 'Anime not found',
        message: 'Anime entry does not exist or you do not have permission'
      })
    }

    // Parse JSON fields
    const parsed = {
      ...anime,
      genres: anime.genres ? JSON.parse(anime.genres) : []
    }

    res.json({ anime: parsed })
  } catch (error) {
    console.error('Get anime entry error:', error)
    res.status(500).json({
      error: 'Failed to fetch anime entry',
      message: error.message
    })
  }
}

/**
 * Create new anime entry
 * POST /api/anime
 */
export const createAnimeEntry = async (req, res) => {
  try {
    const { title, image_url, genres, rating, status, notes } = req.body
    const userId = req.user.id

    // Validation
    if (!title) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title is required'
      })
    }

    // Validate rating if provided
    if (rating !== null && rating !== undefined) {
      const ratingNum = parseInt(rating)
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Rating must be between 1 and 5'
        })
      }
    }

    // Create entry
    const [animeId] = await db('anime_list').insert({
      user_id: userId,
      title,
      image_url: image_url || null,
      genres: genres && genres.length > 0 ? JSON.stringify(genres) : null,
      rating: rating || null,
      status: status || 'plan_to_watch',
      notes: notes || null,
      episodes_watched: 0
    })

    // Fetch created entry
    const anime = await db('anime_list')
      .where({ id: animeId })
      .first()

    // Parse JSON fields
    const parsed = {
      ...anime,
      genres: anime.genres ? JSON.parse(anime.genres) : []
    }

    res.status(201).json({
      message: 'Anime entry created successfully',
      anime: parsed
    })
  } catch (error) {
    console.error('Create anime entry error:', error)
    res.status(500).json({
      error: 'Failed to create anime entry',
      message: error.message
    })
  }
}

/**
 * Update anime entry
 * PUT /api/anime/:id
 */
export const updateAnimeEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { title, image_url, genres, rating, status, notes, episodes_watched } = req.body
    const userId = req.user.id

    // Check if entry exists and belongs to user
    const existingAnime = await db('anime_list')
      .where({ id, user_id: userId })
      .first()

    if (!existingAnime) {
      return res.status(404).json({
        error: 'Anime not found',
        message: 'Anime entry does not exist or you do not have permission'
      })
    }

    // Validate rating if provided
    if (rating !== null && rating !== undefined) {
      const ratingNum = parseInt(rating)
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Rating must be between 1 and 5'
        })
      }
    }

    // Build update object
    const updates = {
      updated_at: db.fn.now()
    }

    if (title !== undefined) updates.title = title
    if (image_url !== undefined) updates.image_url = image_url
    if (genres !== undefined) updates.genres = genres && genres.length > 0 ? JSON.stringify(genres) : null
    if (rating !== undefined) updates.rating = rating
    if (status !== undefined) updates.status = status
    if (notes !== undefined) updates.notes = notes
    if (episodes_watched !== undefined) updates.episodes_watched = episodes_watched

    // Update entry
    await db('anime_list')
      .where({ id, user_id: userId })
      .update(updates)

    // Fetch updated entry
    const anime = await db('anime_list')
      .where({ id })
      .first()

    // Parse JSON fields
    const parsed = {
      ...anime,
      genres: anime.genres ? JSON.parse(anime.genres) : []
    }

    res.json({
      message: 'Anime entry updated successfully',
      anime: parsed
    })
  } catch (error) {
    console.error('Update anime entry error:', error)
    res.status(500).json({
      error: 'Failed to update anime entry',
      message: error.message
    })
  }
}

/**
 * Delete anime entry
 * DELETE /api/anime/:id
 */
export const deleteAnimeEntry = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Check if entry exists and belongs to user
    const existingAnime = await db('anime_list')
      .where({ id, user_id: userId })
      .first()

    if (!existingAnime) {
      return res.status(404).json({
        error: 'Anime not found',
        message: 'Anime entry does not exist or you do not have permission'
      })
    }

    // Delete entry
    await db('anime_list')
      .where({ id, user_id: userId })
      .delete()

    res.json({
      message: 'Anime entry deleted successfully'
    })
  } catch (error) {
    console.error('Delete anime entry error:', error)
    res.status(500).json({
      error: 'Failed to delete anime entry',
      message: error.message
    })
  }
}
