import express from 'express'
import knex from 'knex'
import knexConfig from '../knexfile.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()
const db = knex(knexConfig.development)

// Get all pomodoro sessions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await db('pomodoro_sessions')
      .where({ user_id: req.user.id })
      .orderBy('started_at', 'desc')
      .limit(50)
    
    res.json(sessions)
  } catch (error) {
    console.error('Error fetching pomodoro sessions:', error)
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

// Create pomodoro session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { task_id, skill_id, duration_mins, started_at, ended_at } = req.body

    // Validation
    if (!duration_mins || duration_mins <= 0) {
      return res.status(400).json({ error: 'Duration must be positive' })
    }

    if (!started_at || !ended_at) {
      return res.status(400).json({ error: 'Started and ended times required' })
    }

    const [sessionId] = await db('pomodoro_sessions').insert({
      user_id: req.user.id,
      task_id: task_id || null,
      skill_id: skill_id || null,
      duration_mins,
      started_at,
      ended_at
    })

    const session = await db('pomodoro_sessions').where({ id: sessionId }).first()
    res.status(201).json(session)
  } catch (error) {
    console.error('Error creating pomodoro session:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// Get skill time aggregation
router.get('/skills/:id/time', authMiddleware, async (req, res) => {
  try {
    const { since } = req.query
    let query = db('pomodoro_sessions')
      .where({ user_id: req.user.id, skill_id: req.params.id })
      .sum('duration_mins as total_mins')
      .count('* as session_count')

    if (since) {
      query = query.where('started_at', '>=', since)
    }

    const result = await query.first()
    res.json({
      skill_id: parseInt(req.params.id),
      total_minutes: result.total_mins || 0,
      session_count: result.session_count || 0
    })
  } catch (error) {
    console.error('Error getting skill time:', error)
    res.status(500).json({ error: 'Failed to get skill time' })
  }
})

// Get top skills by time (last 7 days)
router.get('/skills/top', authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const topSkills = await db('pomodoro_sessions')
      .select('skill_id', 'skills.name')
      .sum('pomodoro_sessions.duration_mins as total_mins')
      .count('pomodoro_sessions.id as session_count')
      .join('skills', 'pomodoro_sessions.skill_id', 'skills.id')
      .where('pomodoro_sessions.user_id', req.user.id)
      .where('pomodoro_sessions.started_at', '>=', sevenDaysAgo.toISOString())
      .whereNotNull('skill_id')
      .groupBy('skill_id', 'skills.name')
      .orderBy('total_mins', 'desc')
      .limit(3)

    res.json(topSkills)
  } catch (error) {
    console.error('Error getting top skills:', error)
    res.status(500).json({ error: 'Failed to get top skills' })
  }
})

export default router
