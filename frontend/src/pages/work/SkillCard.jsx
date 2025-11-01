import styles from './SkillCard.module.css'

function SkillCard({ skill, onClick, formatTime }) {
  const progress = skill.target_hours > 0 
    ? Math.min((skill.total_time_mins / (skill.target_hours * 60)) * 100, 100) 
    : 0

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Skill: ${skill.title}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{skill.title}</h3>
        {skill.learned && <span className={styles.badge}>✓ Learned</span>}
      </div>

      {skill.description && (
        <p className={styles.description}>{skill.description}</p>
      )}

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Time Spent:</span>
          <span className={styles.statValue}>{formatTime(skill.total_time_mins)}</span>
        </div>
        {skill.target_hours > 0 && (
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Target:</span>
            <span className={styles.statValue}>{skill.target_hours}h</span>
          </div>
        )}
      </div>

      {skill.target_hours > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{Math.round(progress)}%</span>
        </div>
      )}

      <button
        className={styles.openButton}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        tabIndex={0}
      >
        Open
      </button>
    </div>
  )
}

export default SkillCard
