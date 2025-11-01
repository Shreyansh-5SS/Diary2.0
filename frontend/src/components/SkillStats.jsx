import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SkillStats.module.css';

const SkillStats = () => {
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopSkills();
  }, []);

  const fetchTopSkills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/pomodoro/skills/top', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTopSkills(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching top skills:', err);
      setError('Failed to load skill stats');
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const getMaxMinutes = () => {
    if (topSkills.length === 0) return 1;
    return Math.max(...topSkills.map(s => s.total_minutes));
  };

  if (loading) {
    return (
      <div className={styles.statsPanel}>
        <h3 className={styles.title}>⏱️ Top Skills (Last 7 Days)</h3>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statsPanel}>
        <h3 className={styles.title}>⏱️ Top Skills (Last 7 Days)</h3>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (topSkills.length === 0) {
    return (
      <div className={styles.statsPanel}>
        <h3 className={styles.title}>⏱️ Top Skills (Last 7 Days)</h3>
        <div className={styles.empty}>
          No pomodoro sessions yet. Start a timer to track your skills!
        </div>
      </div>
    );
  }

  const maxMinutes = getMaxMinutes();

  return (
    <div className={styles.statsPanel}>
      <h3 className={styles.title}>⏱️ Top Skills (Last 7 Days)</h3>
      
      <div className={styles.skillsList}>
        {topSkills.map((skill, index) => (
          <div key={skill.skill_id} className={styles.skillItem}>
            <div className={styles.skillHeader}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.skillName}>{skill.skill_name}</span>
              <span className={styles.skillTime}>{formatMinutes(skill.total_minutes)}</span>
            </div>
            
            <div className={styles.barContainer}>
              <div 
                className={styles.bar}
                style={{ width: `${(skill.total_minutes / maxMinutes) * 100}%` }}
              />
            </div>
            
            <div className={styles.sessionCount}>
              {skill.session_count} session{skill.session_count !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      <button className={styles.refreshButton} onClick={fetchTopSkills} tabIndex={0}>
        🔄 Refresh
      </button>
    </div>
  );
};

export default SkillStats;
