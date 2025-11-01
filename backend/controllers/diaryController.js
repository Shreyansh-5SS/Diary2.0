import knex from 'knex'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.development)

/**
 * Get all diary entries for current user
 * GET /api/diary
 * Query params: from, to, starred
 */
export const getDiaryEntries = async (req, res) => {
  try {
    const { from, to, starred } = req.query
    const userId = req.user.id

    let query = db('diary_entries')
      .where({ user_id: userId })
      .orderBy('entry_date', 'desc')
      .orderBy('created_at', 'desc')

    // Filter by date range
    if (from) {
      query = query.where('entry_date', '>=', from)
    }
    if (to) {
      query = query.where('entry_date', '<=', to)
    }

    // Filter by starred
    if (starred === 'true') {
      query = query.where('starred', true)
    }

    const entries = await query

    res.json({
      entries,
      count: entries.length
    })
  } catch (error) {
    console.error('Get diary entries error:', error)
    res.status(500).json({
      error: 'Failed to fetch diary entries',
      message: error.message
    })
  }
}

/**
 * Get single diary entry
 * GET /api/diary/:id
 */
export const getDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const entry = await db('diary_entries')
      .where({ id, user_id: userId })
      .first()

    if (!entry) {
      return res.status(404).json({
        error: 'Entry not found',
        message: 'Diary entry does not exist or you do not have permission'
      })
    }

    res.json({ entry })
  } catch (error) {
    console.error('Get diary entry error:', error)
    res.status(500).json({
      error: 'Failed to fetch diary entry',
      message: error.message
    })
  }
}

/**
 * Create new diary entry
 * POST /api/diary
 */
export const createDiaryEntry = async (req, res) => {
  try {
    const { title, content, entry_date, mood, tags, image_url, starred } = req.body
    const userId = req.user.id

    // Validation
    if (!content) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Content is required'
      })
    }

    if (!entry_date) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Entry date is required'
      })
    }

    // Create entry
    const [entryId] = await db('diary_entries').insert({
      user_id: userId,
      title: title || null,
      content,
      entry_date,
      mood: mood || null,
      tags: tags ? JSON.stringify(tags) : null,
      image_url: image_url || null,
      starred: starred || false
    })

    // Fetch created entry
    const entry = await db('diary_entries')
      .where({ id: entryId })
      .first()

    res.status(201).json({
      message: 'Diary entry created successfully',
      entry
    })
  } catch (error) {
    console.error('Create diary entry error:', error)
    res.status(500).json({
      error: 'Failed to create diary entry',
      message: error.message
    })
  }
}

/**
 * Update diary entry
 * PUT /api/diary/:id
 */
export const updateDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, entry_date, mood, tags, image_url, starred } = req.body
    const userId = req.user.id

    // Check if entry exists and belongs to user
    const existingEntry = await db('diary_entries')
      .where({ id, user_id: userId })
      .first()

    if (!existingEntry) {
      return res.status(404).json({
        error: 'Entry not found',
        message: 'Diary entry does not exist or you do not have permission'
      })
    }

    // Build update object
    const updates = {
      updated_at: db.fn.now()
    }

    if (title !== undefined) updates.title = title
    if (content !== undefined) updates.content = content
    if (entry_date !== undefined) updates.entry_date = entry_date
    if (mood !== undefined) updates.mood = mood
    if (tags !== undefined) updates.tags = JSON.stringify(tags)
    if (image_url !== undefined) updates.image_url = image_url
    if (starred !== undefined) updates.starred = starred

    // Update entry
    await db('diary_entries')
      .where({ id, user_id: userId })
      .update(updates)

    // Fetch updated entry
    const entry = await db('diary_entries')
      .where({ id })
      .first()

    res.json({
      message: 'Diary entry updated successfully',
      entry
    })
  } catch (error) {
    console.error('Update diary entry error:', error)
    res.status(500).json({
      error: 'Failed to update diary entry',
      message: error.message
    })
  }
}

/**
 * Delete diary entry
 * DELETE /api/diary/:id
 */
export const deleteDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Check if entry exists and belongs to user
    const existingEntry = await db('diary_entries')
      .where({ id, user_id: userId })
      .first()

    if (!existingEntry) {
      return res.status(404).json({
        error: 'Entry not found',
        message: 'Diary entry does not exist or you do not have permission'
      })
    }

    // Delete entry
    await db('diary_entries')
      .where({ id, user_id: userId })
      .delete()

    res.json({
      message: 'Diary entry deleted successfully'
    })
  } catch (error) {
    console.error('Delete diary entry error:', error)
    res.status(500).json({
      error: 'Failed to delete diary entry',
      message: error.message
    })
  }
}
