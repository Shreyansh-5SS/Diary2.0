import express from 'express'
import knex from 'knex'
import knexConfig from '../knexfile.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()
const db = knex(knexConfig.development)

// GET /api/timetable - Get all timetable slots for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const slots = await db('timetable_slots')
      .leftJoin('tasks', 'timetable_slots.task_id', 'tasks.id')
      .select(
        'timetable_slots.*',
        'tasks.title as task_title',
        'tasks.priority as task_priority'
      )
      .where('timetable_slots.user_id', req.user.id)
      .orderBy('timetable_slots.day_of_week', 'asc')
      .orderBy('timetable_slots.start_time', 'asc')

    res.json(slots)
  } catch (error) {
    console.error('Error fetching timetable:', error)
    res.status(500).json({ error: 'Failed to fetch timetable' })
  }
})

// POST /api/timetable - Create timetable slot
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, description, is_free_time, task_id } = req.body

    // Validation
    if (day_of_week === undefined || day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({ error: 'day_of_week must be 0-6' })
    }

    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'start_time and end_time are required' })
    }

    // Check time format (HH:MM or HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:MM or HH:MM:SS' })
    }

    // Check if end_time is after start_time
    const startMinutes = timeToMinutes(start_time)
    const endMinutes = timeToMinutes(end_time)
    
    if (endMinutes <= startMinutes) {
      return res.status(400).json({ error: 'end_time must be after start_time' })
    }

    const [id] = await db('timetable_slots').insert({
      user_id: req.user.id,
      day_of_week,
      start_time,
      end_time,
      description: description || null,
      is_free_time: is_free_time || false,
      task_id: task_id || null
    })

    const newSlot = await db('timetable_slots')
      .leftJoin('tasks', 'timetable_slots.task_id', 'tasks.id')
      .select(
        'timetable_slots.*',
        'tasks.title as task_title',
        'tasks.priority as task_priority'
      )
      .where('timetable_slots.id', id)
      .first()

    res.status(201).json(newSlot)
  } catch (error) {
    console.error('Error creating timetable slot:', error)
    res.status(500).json({ error: 'Failed to create timetable slot' })
  }
})

// PUT /api/timetable/:id - Update timetable slot
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, description, is_free_time, task_id } = req.body

    const slot = await db('timetable_slots')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!slot) {
      return res.status(404).json({ error: 'Timetable slot not found' })
    }

    const updates = {}
    if (day_of_week !== undefined) {
      if (day_of_week < 0 || day_of_week > 6) {
        return res.status(400).json({ error: 'day_of_week must be 0-6' })
      }
      updates.day_of_week = day_of_week
    }
    if (start_time !== undefined) updates.start_time = start_time
    if (end_time !== undefined) updates.end_time = end_time
    if (description !== undefined) updates.description = description
    if (is_free_time !== undefined) updates.is_free_time = is_free_time
    if (task_id !== undefined) updates.task_id = task_id
    updates.updated_at = db.fn.now()

    await db('timetable_slots')
      .where({ id: req.params.id })
      .update(updates)

    const updatedSlot = await db('timetable_slots')
      .leftJoin('tasks', 'timetable_slots.task_id', 'tasks.id')
      .select(
        'timetable_slots.*',
        'tasks.title as task_title',
        'tasks.priority as task_priority'
      )
      .where('timetable_slots.id', req.params.id)
      .first()

    res.json(updatedSlot)
  } catch (error) {
    console.error('Error updating timetable slot:', error)
    res.status(500).json({ error: 'Failed to update timetable slot' })
  }
})

// DELETE /api/timetable/:id - Delete timetable slot
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const slot = await db('timetable_slots')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!slot) {
      return res.status(404).json({ error: 'Timetable slot not found' })
    }

    await db('timetable_slots').where({ id: req.params.id }).del()

    res.json({ message: 'Timetable slot deleted' })
  } catch (error) {
    console.error('Error deleting timetable slot:', error)
    res.status(500).json({ error: 'Failed to delete timetable slot' })
  }
})

// POST /api/timetable/suggest - Suggest timetable based on tasks and free slots
router.post('/suggest', authMiddleware, async (req, res) => {
  try {
    // Get all free time slots for this user
    const freeSlots = await db('timetable_slots')
      .where({ user_id: req.user.id, is_free_time: true })
      .orderBy('day_of_week', 'asc')
      .orderBy('start_time', 'asc')

    if (freeSlots.length === 0) {
      return res.json({ 
        suggestions: [], 
        message: 'No free time slots available. Add free slots first.' 
      })
    }

    // Get tasks that need scheduling (not done, have estimates)
    const tasks = await db('tasks')
      .where({ user_id: req.user.id })
      .whereNotIn('status', ['done'])
      .whereNotNull('estimate_mins')
      .where('estimate_mins', '>', 0)
      .orderBy('priority', 'asc') // urgent=1, high=2, medium=3, low=4
      .orderBy('due_date', 'asc')

    if (tasks.length === 0) {
      return res.json({ 
        suggestions: [], 
        message: 'No tasks with time estimates found. Add estimates to your tasks.' 
      })
    }

    // Priority weights for greedy scheduling
    const priorityWeights = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    }

    // Sort tasks by priority and due date
    const sortedTasks = tasks.sort((a, b) => {
      const priorityDiff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0)
      if (priorityDiff !== 0) return priorityDiff
      
      if (a.due_date && b.due_date) {
        return new Date(a.due_date) - new Date(b.due_date)
      }
      if (a.due_date) return -1
      if (b.due_date) return 1
      return 0
    })

    // Greedy scheduling algorithm
    const suggestions = []
    const remainingTasks = [...sortedTasks]
    const availableSlots = freeSlots.map(slot => ({
      ...slot,
      availableMinutes: timeToMinutes(slot.end_time) - timeToMinutes(slot.start_time)
    }))

    for (const task of remainingTasks) {
      let remainingTaskMinutes = task.estimate_mins

      // Try to fit task into available slots
      for (const slot of availableSlots) {
        if (remainingTaskMinutes <= 0) break
        if (slot.availableMinutes <= 0) continue

        // Calculate how much time we can allocate in this slot
        const allocatedMinutes = Math.min(remainingTaskMinutes, slot.availableMinutes)
        
        // Calculate new time slot for this task
        const slotStartMinutes = timeToMinutes(slot.start_time)
        const currentStartMinutes = slotStartMinutes + (timeToMinutes(slot.end_time) - timeToMinutes(slot.start_time) - slot.availableMinutes)
        const currentEndMinutes = currentStartMinutes + allocatedMinutes

        suggestions.push({
          task_id: task.id,
          task_title: task.title,
          task_priority: task.priority,
          day_of_week: slot.day_of_week,
          start_time: minutesToTime(currentStartMinutes),
          end_time: minutesToTime(currentEndMinutes),
          duration_mins: allocatedMinutes,
          description: `Work on: ${task.title}`
        })

        // Update remaining time
        remainingTaskMinutes -= allocatedMinutes
        slot.availableMinutes -= allocatedMinutes
      }
    }

    res.json({ 
      suggestions,
      tasksScheduled: new Set(suggestions.map(s => s.task_id)).size,
      totalTasks: sortedTasks.length
    })
  } catch (error) {
    console.error('Error suggesting timetable:', error)
    res.status(500).json({ error: 'Failed to generate suggestions' })
  }
})

// Helper functions
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
}

export default router
