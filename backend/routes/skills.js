import express from 'express'
import knex from 'knex'
import knexConfig from '../knexfile.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()
const db = knex(knexConfig.development)

// Apply auth middleware to all routes
router.use(authMiddleware)

// GET /api/skills - List all skills for user with total time
router.get('/', async (req, res) => {
  try {
    const skills = await db('skills')
      .select(
        'skills.*',
        db.raw('COALESCE(SUM(pomodoro_sessions.duration_mins), 0) as total_time_mins')
      )
      .leftJoin('pomodoro_sessions', 'skills.id', 'pomodoro_sessions.skill_id')
      .where('skills.user_id', req.user.id)
      .groupBy('skills.id')
      .orderBy('skills.created_at', 'desc')

    res.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

// GET /api/skills/:id - Get single skill with total time
router.get('/:id', async (req, res) => {
  try {
    const skill = await db('skills')
      .select(
        'skills.*',
        db.raw('COALESCE(SUM(pomodoro_sessions.duration_mins), 0) as total_time_mins')
      )
      .leftJoin('pomodoro_sessions', 'skills.id', 'pomodoro_sessions.skill_id')
      .where({
        'skills.id': req.params.id,
        'skills.user_id': req.user.id
      })
      .groupBy('skills.id')
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    res.json(skill)
  } catch (error) {
    console.error('Error fetching skill:', error)
    res.status(500).json({ error: 'Failed to fetch skill' })
  }
})

// POST /api/skills - Create new skill
router.post('/', async (req, res) => {
  try {
    const { title, description, target_hours, learned } = req.body

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' })
    }

    const [id] = await db('skills').insert({
      user_id: req.user.id,
      title: title.trim(),
      description: description || null,
      target_hours: target_hours || 0,
      learned: learned || false
    })

    const newSkill = await db('skills').where({ id }).first()
    res.status(201).json({ ...newSkill, total_time_mins: 0 })
  } catch (error) {
    console.error('Error creating skill:', error)
    res.status(500).json({ error: 'Failed to create skill' })
  }
})

// PUT /api/skills/:id - Update skill
router.put('/:id', async (req, res) => {
  try {
    const { title, description, target_hours, learned } = req.body

    const skill = await db('skills')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    const updates = {}
    if (title !== undefined) updates.title = title.trim()
    if (description !== undefined) updates.description = description
    if (target_hours !== undefined) updates.target_hours = target_hours
    if (learned !== undefined) updates.learned = learned
    updates.updated_at = db.fn.now()

    await db('skills')
      .where({ id: req.params.id })
      .update(updates)

    const updatedSkill = await db('skills')
      .select(
        'skills.*',
        db.raw('COALESCE(SUM(pomodoro_sessions.duration_mins), 0) as total_time_mins')
      )
      .leftJoin('pomodoro_sessions', 'skills.id', 'pomodoro_sessions.skill_id')
      .where('skills.id', req.params.id)
      .groupBy('skills.id')
      .first()

    res.json(updatedSkill)
  } catch (error) {
    console.error('Error updating skill:', error)
    res.status(500).json({ error: 'Failed to update skill' })
  }
})

// DELETE /api/skills/:id - Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const skill = await db('skills')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    await db('skills').where({ id: req.params.id }).delete()
    res.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Error deleting skill:', error)
    res.status(500).json({ error: 'Failed to delete skill' })
  }
})

// GET /api/skills/:id/analytics - Get 7-day time analytics for skill
router.get('/:id/analytics', async (req, res) => {
  try {
    const skill = await db('skills')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    // Get last 7 days of data
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const sessions = await db('pomodoro_sessions')
      .select(
        db.raw('DATE(started_at) as date'),
        db.raw('SUM(duration_mins) as total_mins'),
        db.raw('COUNT(*) as session_count')
      )
      .where('skill_id', req.params.id)
      .where('started_at', '>=', sevenDaysAgo.toISOString())
      .groupBy(db.raw('DATE(started_at)'))
      .orderBy('date', 'asc')

    res.json(sessions)
  } catch (error) {
    console.error('Error fetching skill analytics:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

// GET /api/skills/:id/notes - Get all notes for skill
router.get('/:id/notes', async (req, res) => {
  try {
    const skill = await db('skills')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    const notes = await db('skill_notes')
      .where('skill_id', req.params.id)
      .orderBy('created_at', 'desc')

    res.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

// POST /api/skills/:id/notes - Create note for skill
router.post('/:id/notes', async (req, res) => {
  try {
    const { title, body } = req.body

    const skill = await db('skills')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Note title is required' })
    }

    const [id] = await db('skill_notes').insert({
      skill_id: req.params.id,
      title: title.trim(),
      body: body || ''
    })

    const newNote = await db('skill_notes').where({ id }).first()
    res.status(201).json(newNote)
  } catch (error) {
    console.error('Error creating note:', error)
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// PUT /api/skills/:skillId/notes/:noteId - Update note
router.put('/:skillId/notes/:noteId', async (req, res) => {
  try {
    const { title, body } = req.body

    const skill = await db('skills')
      .where({ id: req.params.skillId, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    const note = await db('skill_notes')
      .where({ id: req.params.noteId, skill_id: req.params.skillId })
      .first()

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    const updates = {}
    if (title !== undefined) updates.title = title.trim()
    if (body !== undefined) updates.body = body
    updates.updated_at = db.fn.now()

    await db('skill_notes')
      .where({ id: req.params.noteId })
      .update(updates)

    const updatedNote = await db('skill_notes')
      .where({ id: req.params.noteId })
      .first()

    res.json(updatedNote)
  } catch (error) {
    console.error('Error updating note:', error)
    res.status(500).json({ error: 'Failed to update note' })
  }
})

// DELETE /api/skills/:skillId/notes/:noteId - Delete note
router.delete('/:skillId/notes/:noteId', async (req, res) => {
  try {
    const skill = await db('skills')
      .where({ id: req.params.skillId, user_id: req.user.id })
      .first()

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    const note = await db('skill_notes')
      .where({ id: req.params.noteId, skill_id: req.params.skillId })
      .first()

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    await db('skill_notes').where({ id: req.params.noteId }).delete()
    res.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

export default router
