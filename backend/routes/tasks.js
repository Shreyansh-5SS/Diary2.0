import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import db from '../db.js'

const router = express.Router()

// Get all tasks for user with optional filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { group, status } = req.query
    let query = db('tasks').where({ user_id: req.user.id })

    if (group) {
      query = query.andWhere({ group_name: group })
    }

    if (status) {
      query = query.andWhere({ status })
    }

    const tasks = await query.orderBy('position', 'asc').orderBy('created_at', 'desc')
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Get single task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

// Create task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      status = 'backlog', 
      group_name, 
      priority = 'medium', 
      estimate_mins, 
      due_date, 
      reminder_datetime,
      position = 0
    } = req.body

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' })
    }

    if (title.length > 255) {
      return res.status(400).json({ error: 'Title must be less than 255 characters' })
    }

    const validStatuses = ['backlog', 'in_progress', 'review', 'done']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' })
    }

    if (estimate_mins !== null && estimate_mins !== undefined) {
      if (typeof estimate_mins !== 'number' || estimate_mins < 0) {
        return res.status(400).json({ error: 'Estimate must be a positive number' })
      }
    }

    const [taskId] = await db('tasks').insert({
      user_id: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : null,
      status,
      group_name: group_name ? group_name.trim() : null,
      priority,
      estimate_mins: estimate_mins || null,
      due_date: due_date || null,
      reminder_datetime: reminder_datetime || null,
      position
    })

    const task = await db('tasks').where({ id: taskId }).first()
    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      status, 
      group_name, 
      priority, 
      estimate_mins, 
      due_date, 
      reminder_datetime,
      position
    } = req.body

    // Check if task exists and belongs to user
    const existingTask = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // Validation
    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' })
      }
      if (title.length > 255) {
        return res.status(400).json({ error: 'Title must be less than 255 characters' })
      }
    }

    if (status !== undefined) {
      const validStatuses = ['backlog', 'in_progress', 'review', 'done']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority' })
      }
    }

    if (estimate_mins !== undefined && estimate_mins !== null) {
      if (typeof estimate_mins !== 'number' || estimate_mins < 0) {
        return res.status(400).json({ error: 'Estimate must be a positive number' })
      }
    }

    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description ? description.trim() : null
    if (status !== undefined) updateData.status = status
    if (group_name !== undefined) updateData.group_name = group_name ? group_name.trim() : null
    if (priority !== undefined) updateData.priority = priority
    if (estimate_mins !== undefined) updateData.estimate_mins = estimate_mins || null
    if (due_date !== undefined) updateData.due_date = due_date || null
    if (reminder_datetime !== undefined) updateData.reminder_datetime = reminder_datetime || null
    if (position !== undefined) updateData.position = position

    await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .update(updateData)

    const task = await db('tasks').where({ id: req.params.id }).first()
    res.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .delete()

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
