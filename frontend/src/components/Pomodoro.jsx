import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styles from './Pomodoro.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const PRESETS = [
  { label: 'Focus', minutes: 25 },
  { label: 'Break', minutes: 5 },
  { label: 'Long Break', minutes: 15 }
]

function Pomodoro({ selectedTask, selectedSkill, onClose }) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [tickSoundEnabled, setTickSoundEnabled] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [initialMinutes, setInitialMinutes] = useState(25)
  const intervalRef = useRef(null)
  const tickSoundRef = useRef(null)

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (tickSoundEnabled && tickSoundRef.current) {
          tickSoundRef.current.play().catch(() => {})
        }

        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(prevMin => {
              if (prevMin === 0) {
                // Timer completed - stop immediately to prevent double execution
                clearInterval(intervalRef.current)
                setIsRunning(false)
                setIsPaused(false)
                // Call handleComplete after state updates
                setTimeout(() => handleComplete(), 0)
                return 0
              }
              return prevMin - 1
            })
            return 59
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, tickSoundEnabled])

  const handleComplete = async () => {
    // Auto-save the completed session
    if (startTime) {
      const endTime = new Date().toISOString()
      const startDate = new Date(startTime)
      const endDate = new Date(endTime)
      const elapsedSeconds = (endDate - startDate) / 1000
      const actualDurationMinutes = Math.max(1, Math.round(elapsedSeconds / 60))

      try {
        const token = localStorage.getItem('token')
        await axios.post(
          `${API_URL}/api/pomodoro`,
          {
            task_id: selectedTask?.id || null,
            skill_id: selectedSkill?.id || null,
            duration_mins: actualDurationMinutes,
            started_at: startTime,
            ended_at: endTime
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert(`Pomodoro complete! ✅\nSession saved: ${actualDurationMinutes} minutes`)
      } catch (error) {
        console.error('Error saving pomodoro:', error)
        alert('Pomodoro complete! ✅\n(Failed to save session)')
      }
      
      setStartTime(null)
    } else {
      alert('Pomodoro complete! ✅')
    }
  }

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(new Date().toISOString())
      setInitialMinutes(minutes)
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = async () => {
    if (!startTime) return

    const endTime = new Date().toISOString()
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    
    // Calculate actual elapsed time in seconds, then convert to minutes
    const elapsedSeconds = (endDate - startDate) / 1000
    const actualDurationMinutes = Math.max(1, Math.round(elapsedSeconds / 60)) // Round to nearest minute, minimum 1

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${API_URL}/api/pomodoro`,
        {
          task_id: selectedTask?.id || null,
          skill_id: selectedSkill?.id || null,
          duration_mins: actualDurationMinutes,
          started_at: startTime,
          ended_at: endTime
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const displayTime = elapsedSeconds < 60 
        ? `${Math.round(elapsedSeconds)} seconds (saved as 1 min)`
        : `${actualDurationMinutes} minutes`
      alert(`Session saved! Duration: ${displayTime}`)
    } catch (error) {
      console.error('Error saving pomodoro:', error)
      alert('Failed to save session')
    }

    setIsRunning(false)
    setIsPaused(false)
    setMinutes(25)
    setSeconds(0)
    setStartTime(null)
    setInitialMinutes(25)
  }

  const handlePreset = (presetMinutes) => {
    if (!isRunning) {
      setMinutes(presetMinutes)
      setSeconds(0)
    }
  }

  const handleCustom = () => {
    const customMins = parseInt(customMinutes)
    if (customMins > 0 && customMins <= 120 && !isRunning) {
      setMinutes(customMins)
      setSeconds(0)
      setCustomMinutes('')
    }
  }

  const formatTime = () => {
    const mins = String(minutes).padStart(2, '0')
    const secs = String(seconds).padStart(2, '0')
    return `${mins}:${secs}`
  }

  return (
    <div className={styles.pomodoro}>
      <div className={styles.header}>
        <h2 className={styles.title}>Pomodoro Timer</h2>
        {onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close pomodoro timer"
            tabIndex={0}
          >
            ✕
          </button>
        )}
      </div>

      {(selectedTask || selectedSkill) && (
        <div className={styles.association}>
          <span className={styles.associationLabel}>
            {selectedTask ? 'Task' : 'Skill'}:
          </span>
          <span className={styles.associationValue}>
            {selectedTask?.title || selectedSkill?.title}
          </span>
        </div>
      )}

      <div className={styles.display}>
        <div className={styles.timer}>{formatTime()}</div>
        <div className={styles.status}>
          {isRunning && !isPaused && '🍅 Running'}
          {isRunning && isPaused && '⏸️ Paused'}
          {!isRunning && '⏹️ Stopped'}
        </div>
      </div>

      <div className={styles.presets}>
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            className={`${styles.presetButton} ${minutes === preset.minutes && !isRunning ? styles.active : ''}`}
            onClick={() => handlePreset(preset.minutes)}
            disabled={isRunning}
            tabIndex={0}
          >
            {preset.label}<br />
            <span className={styles.presetMins}>{preset.minutes}m</span>
          </button>
        ))}
      </div>

      <div className={styles.custom}>
        <input
          type="number"
          className={styles.customInput}
          placeholder="Custom mins"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          min="1"
          max="120"
          disabled={isRunning}
          tabIndex={0}
        />
        <button
          className={styles.customButton}
          onClick={handleCustom}
          disabled={isRunning || !customMinutes}
          tabIndex={0}
        >
          Set
        </button>
      </div>

      <div className={styles.controls}>
        {!isRunning && (
          <button
            className={styles.startButton}
            onClick={handleStart}
            tabIndex={0}
          >
            Start
          </button>
        )}
        {isRunning && (
          <>
            <button
              className={styles.pauseButton}
              onClick={handlePause}
              tabIndex={0}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              className={styles.stopButton}
              onClick={handleStop}
              tabIndex={0}
            >
              Stop & Save
            </button>
          </>
        )}
      </div>

      <div className={styles.options}>
        <label className={styles.optionLabel}>
          <input
            type="checkbox"
            checked={tickSoundEnabled}
            onChange={(e) => setTickSoundEnabled(e.target.checked)}
            tabIndex={0}
          />
          <span>Tick sound</span>
        </label>
      </div>

      <audio
        ref={tickSoundRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjMGHm7A7+OZRQ0PWqzt6a5aGAg+l9z0xHIoBSuBzvLZizUIGGW47OmlUBELTKXh8bllHgU2jdXxx3ssBSyBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWS67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8MSKXh8bllHgU3jdXyx3osBSuBzvLZizcIGWW67+ijTw8="/>
    </div>
  )
}

export default Pomodoro
