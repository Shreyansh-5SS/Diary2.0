import { useNavigate } from 'react-router-dom'
import styles from './Portfolio.module.css'

export default function Portfolio() {
  const navigate = useNavigate()

  const projects = [
    {
      title: "Shreyansh Personal Diary",
      description: "Full-stack personal diary application with anime watchlist, expense tracker, and brutalist UI design. Features JWT authentication, Chart.js visualizations, and masonry grid layouts.",
      tech: ["React", "Node.js", "Express", "SQLite", "JWT", "Chart.js"],
      github: "https://github.com/Shreyansh-5SS/Diary2.0",
      live: null
    },
    {
      title: "Hangman Game",
      description: "Terminal-based Hangman game with MySQL integration for persistent scoreboards. Dynamic word generation with input validation and session tracking.",
      tech: ["Python", "MySQL"],
      github: "https://github.com/Shreyansh-5SS",
      live: null
    },
    {
      title: "Dungeon Adventures",
      description: "Text-based RPG demonstrating OOP principles with character hierarchies, combat mechanics, and item collection using clean modular architecture.",
      tech: ["C++", "OOP"],
      github: "https://github.com/Shreyansh-5SS",
      live: null
    }
  ]

  const skills = [
    { name: "Java", level: 75 },
    { name: "Data Structures & Algorithms", level: 75 },
    { name: "React", level: 70 },
    { name: "Node.js & Express", level: 70 },
    { name: "HTML & CSS", level: 80 },
    { name: "JavaScript", level: 70 },
    { name: "MySQL & SQLite", level: 65 },
    { name: "Python", level: 60 },
    { name: "C++", level: 65 }
  ]

  const handleEnterWorkDesk = () => {
    navigate('/work/desk')
  }

  return (
    <div className={styles.portfolio}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.portraitContainer}>
            <div className={styles.portraitPlaceholder}>
              <span className={styles.initials}>SS</span>
            </div>
          </div>
          
          <h1 className={styles.displayName}>Shreyansh Singh</h1>
          
          <p className={styles.tagline}>
            Full-Stack Developer & Problem Solver
          </p>
          
          <p className={styles.bio}>
            I'm a Java enthusiast with a solid grip on Data Structures and Algorithms, currently 
            diving into full-stack web development. I enjoy solving problems, picking up new skills, 
            and turning ideas into real, working solutions.
          </p>

          <button 
            onClick={handleEnterWorkDesk}
            className={styles.ctaButton}
            aria-label="Navigate to WorkDesk"
          >
            Enter WorkDesk →
          </button>
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.projectsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <article key={index} className={styles.projectCard}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                
                <div className={styles.techStack}>
                  {project.tech.map((tech, i) => (
                    <span key={i} className={styles.techTag}>{tech}</span>
                  ))}
                </div>

                <div className={styles.projectLinks}>
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      GitHub →
                    </a>
                  )}
                  {project.live && (
                    <a 
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                      aria-label={`View live demo of ${project.title}`}
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={styles.skillsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Technical Skills</h2>
          
          <div className={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <div key={index} className={styles.skillItem}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={styles.skillLevel}>{skill.level}%</span>
                </div>
                <div className={styles.skillBarContainer}>
                  <div 
                    className={styles.skillBar}
                    style={{ width: `${skill.level}%` }}
                    role="progressbar"
                    aria-valuenow={skill.level}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          
          <div className={styles.contactGrid}>
            <a 
              href="mailto:singhshreyansh0505@gmail.com"
              className={styles.contactCard}
              aria-label="Send email to Shreyansh Singh"
            >
              <div className={styles.contactIcon}>✉️</div>
              <div className={styles.contactLabel}>Email</div>
              <div className={styles.contactValue}>singhshreyansh0505@gmail.com</div>
            </a>

            <a 
              href="https://github.com/Shreyansh-5SS"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              aria-label="View GitHub profile"
            >
              <div className={styles.contactIcon}>💻</div>
              <div className={styles.contactLabel}>GitHub</div>
              <div className={styles.contactValue}>Shreyansh-5SS</div>
            </a>

            <a 
              href="https://www.linkedin.com/in/shreyansh-singh-424b0833a/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              aria-label="View LinkedIn profile"
            >
              <div className={styles.contactIcon}>🔗</div>
              <div className={styles.contactLabel}>LinkedIn</div>
              <div className={styles.contactValue}>Shreyansh Singh</div>
            </a>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📱</div>
              <div className={styles.contactLabel}>Phone</div>
              <div className={styles.contactValue}>+91 9026622912</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2025 Shreyansh Singh. Computer Science Engineering Student at NMIT Bengaluru.
        </p>
      </footer>
    </div>
  )
}
