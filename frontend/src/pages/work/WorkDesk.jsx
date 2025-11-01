import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TaskModal from './TaskModal'
import TaskDetail from './TaskDetail'
import Pomodoro from '../../components/Pomodoro'
import styles from './WorkDesk.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function WorkDesk() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState({
    backlog: [],
    in_progress: [],
    done: []
  })
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [pomodoroTask, setPomodoroTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testEmailStatus, setTestEmailStatus] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Group tasks by status
      const grouped = {
        backlog: response.data.filter(t => t.status === 'backlog'),
        in_progress: response.data.filter(t => t.status === 'in_progress' || t.status === 'review'),
        done: response.data.filter(t => t.status === 'done')
      }

      setTasks(grouped)
      setError(null)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // If dropped in same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const sourceColumn = source.droppableId
    const destColumn = destination.droppableId
    const taskId = parseInt(draggableId)

    // Find the task
    const task = [...tasks[sourceColumn]].find(t => t.id === taskId)
    if (!task) return

    // Create new state
    const newTasks = { ...tasks }
    
    // Remove from source
    newTasks[sourceColumn] = [...tasks[sourceColumn]]
    newTasks[sourceColumn].splice(source.index, 1)

    // Add to destination
    newTasks[destColumn] = [...tasks[destColumn]]
    newTasks[destColumn].splice(destination.index, 0, task)

    // Update UI immediately
    setTasks(newTasks)

    // Map column names to status values
    const statusMap = {
      backlog: 'backlog',
      in_progress: 'in_progress',
      done: 'done'
    }

    // Update backend
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        { 
          status: statusMap[destColumn],
          position: destination.index
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      console.error('Error updating task:', err)
      // Revert on error
      fetchTasks()
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleStartPomodoro = () => {
    setPomodoroTask(selectedTask)
    setShowPomodoro(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskModal(true)
    setSelectedTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks()
      setSelectedTask(null)
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task')
    }
  }

  const handleModalClose = (shouldRefresh) => {
    setShowTaskModal(false)
    setEditingTask(null)
    if (shouldRefresh) {
      fetchTasks()
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#ca8a04'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const handleTestEmail = async () => {
    try {
      setTestEmailStatus('sending')
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/email/test-email`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTestEmailStatus('success')
      alert(`Test email sent! Mode: ${response.data.mode}\nCheck server console for output.`)
      setTimeout(() => setTestEmailStatus(null), 3000)
    } catch (err) {
      console.error('Error sending test email:', err)
      setTestEmailStatus('error')
      alert('Failed to send test email. Check console for details.')
      setTimeout(() => setTestEmailStatus(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className={styles.workDesk}>
        <div className={styles.loading}>Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className={styles.workDesk}>
      <div className={styles.header}>
        <h1 className={styles.title}>WorkDesk</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.testEmailButton}
            onClick={handleTestEmail}
            disabled={testEmailStatus === 'sending'}
            aria-label="Test email reminder"
            tabIndex={0}
            title="Send test reminder email (check server console)"
          >
            {testEmailStatus === 'sending' ? '⏳' : testEmailStatus === 'success' ? '✅' : testEmailStatus === 'error' ? '❌' : '📧'} Test Email
          </button>
          <button
            className={styles.skillsButton}
            onClick={() => navigate('/work/skills')}
            aria-label="Go to Skills"
            tabIndex={0}
          >
            📚 Skills
          </button>
          <button
            className={styles.timetableButton}
            onClick={() => navigate('/work/timetable')}
            aria-label="Go to Timetable"
            tabIndex={0}
          >
            📅 Timetable
          </button>
          <button
            className={styles.pomodoroButton}
            onClick={() => setShowPomodoro(true)}
            aria-label="Start Pomodoro"
            tabIndex={0}
          >
            🍅 Pomodoro
          </button>
          <button
            className={styles.addButton}
            onClick={handleCreateTask}
            aria-label="Add new task"
            tabIndex={0}
          >
            + Add Task
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {/* Backlog Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>Backlog</h2>
              <span className={styles.columnCount}>{tasks.backlog.length}</span>
            </div>
            <Droppable droppableId="backlog">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.columnContent} ${snapshot.isDraggingOver ? styles.dragOver : ''}`}
                >
                  {tasks.backlog.map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.taskCard} ${snapshot.isDragging ? styles.dragging : ''}`}
                          onClick={() => handleTaskClick(task)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleTaskClick(task)
                            }
                          }}
                          aria-label={`Task: ${task.title}`}
                        >
                          <div className={styles.taskHeader}>
                            <h3 className={styles.taskTitle}>{task.title}</h3>
                            <div
                              className={styles.priorityBadge}
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </div>
                          </div>
                          {task.description && (
                            <p className={styles.taskDescription}>{task.description}</p>
                          )}
                          <div className={styles.taskFooter}>
                            {task.group_name && (
                              <span className={styles.taskGroup}>{task.group_name}</span>
                            )}
                            {task.estimate_mins && (
                              <span className={styles.taskEstimate}>{task.estimate_mins}m</span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* In Progress Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>In Progress</h2>
              <span className={styles.columnCount}>{tasks.in_progress.length}</span>
            </div>
            <Droppable droppableId="in_progress">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.columnContent} ${snapshot.isDraggingOver ? styles.dragOver : ''}`}
                >
                  {tasks.in_progress.map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.taskCard} ${snapshot.isDragging ? styles.dragging : ''}`}
                          onClick={() => handleTaskClick(task)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleTaskClick(task)
                            }
                          }}
                          aria-label={`Task: ${task.title}`}
                        >
                          <div className={styles.taskHeader}>
                            <h3 className={styles.taskTitle}>{task.title}</h3>
                            <div
                              className={styles.priorityBadge}
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </div>
                          </div>
                          {task.description && (
                            <p className={styles.taskDescription}>{task.description}</p>
                          )}
                          <div className={styles.taskFooter}>
                            {task.group_name && (
                              <span className={styles.taskGroup}>{task.group_name}</span>
                            )}
                            {task.estimate_mins && (
                              <span className={styles.taskEstimate}>{task.estimate_mins}m</span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Done Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>Done</h2>
              <span className={styles.columnCount}>{tasks.done.length}</span>
            </div>
            <Droppable droppableId="done">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.columnContent} ${snapshot.isDraggingOver ? styles.dragOver : ''}`}
                >
                  {tasks.done.map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.taskCard} ${snapshot.isDragging ? styles.dragging : ''}`}
                          onClick={() => handleTaskClick(task)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleTaskClick(task)
                            }
                          }}
                          aria-label={`Task: ${task.title}`}
                        >
                          <div className={styles.taskHeader}>
                            <h3 className={styles.taskTitle}>{task.title}</h3>
                            <div
                              className={styles.priorityBadge}
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </div>
                          </div>
                          {task.description && (
                            <p className={styles.taskDescription}>{task.description}</p>
                          )}
                          <div className={styles.taskFooter}>
                            {task.group_name && (
                              <span className={styles.taskGroup}>{task.group_name}</span>
                            )}
                            {task.estimate_mins && (
                              <span className={styles.taskEstimate}>{task.estimate_mins}m</span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
        />
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onUpdate={fetchTasks}
          onStartPomodoro={handleStartPomodoro}
        />
      )}

      {showPomodoro && (
        <div className={styles.pomodoroOverlay}>
          <Pomodoro
            selectedTask={pomodoroTask}
            onClose={() => {
              setShowPomodoro(false)
              setPomodoroTask(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default WorkDesk
