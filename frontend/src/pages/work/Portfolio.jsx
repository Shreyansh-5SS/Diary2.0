import { useNavigate } from 'react-router-dom'
import styles from './Portfolio.module.css'

export default function Portfolio() {
  const navigate = useNavigate()

  const education = [
    {
      institution: "Nitte Meenakshi Institute of Technology, Bengaluru",
      degree: "Bachelor of Engineering in Computer Science and Engineering",
      duration: "Expected Graduation: May 2027",
      cgpa: "CGPA: 9.15",
      coursework: "Object-Oriented Programming, Database Management Systems, Web Technologies, Data Structures"
    },
    {
      institution: "Dr. Virendra Swarup Education Centre, Avadhpuri, Kanpur",
      degree: "Higher Secondary Education",
      duration: "2019 - 2021",
      cgpa: "Class X: 96.6% | Class XII: 94%",
      coursework: null
    }
  ]

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
    "Java", "Data Structures & Algorithms", "React", "Node.js", "Express", 
    "HTML", "CSS", "JavaScript", "MySQL", "SQLite", "Python", "C++"
  ]

  const certifications = [
    "NPTEL: Blockchain and its Applications",
    "Infosys Springboard: Java Foundation Course",
    "Certificate of Completion: Additive Manufacturing Designer & Industry 4.0",
    "IEEE GRS & NMIT: UAV Data Analysis Workshop"
  ]

  const achievements = [
    "School Rank 5 in National Science Olympiad, 2012",
    "Winner at Hostel's Got Latent (Cultural event), NMIT",
    "Winner at Acoustic Battle of Bands, NMIT"
  ]

  const activities = [
    {
      title: "Nmit Hacks, Social Media Team",
      description: "Co-organized a 48hr National level hackathon, managing logistics for 200+ participants to promote tech innovation."
    },
    {
      title: "MusicClub NMIT",
      description: "Performed at Anadyanta (annual fest) and participated in various flash mobs and festive events throughout college."
    },
    {
      title: "Xfactor Club, NMIT",
      description: "Coordinated a cultural event named 'Among Us' during the annual fest."
    }
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
            tabIndex={0}
          >
            Enter WorkDesk →
          </button>
        </div>
      </section>

      {/* Education Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Education</h2>
          </div>

          <div className={styles.educationList}>
            {education.map((edu, index) => (
              <article key={index} className={styles.educationCard}>
                <h3 className={styles.institution}>{edu.institution}</h3>
                <p className={styles.degree}>{edu.degree}</p>
                <p className={styles.duration}>{edu.duration}</p>
                <p className={styles.cgpa}>{edu.cgpa}</p>
                {edu.coursework && (
                  <p className={styles.coursework}>
                    <strong>Relevant Coursework:</strong> {edu.coursework}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Projects</h2>
          </div>
          
          <div className={styles.projectsList}>
            {projects.map((project, index) => (
              <article key={index} className={styles.projectCard}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                
                <div className={styles.techStack}>
                  {project.tech.map((tech, i) => (
                    <span key={i} className={styles.techTag}>{tech}</span>
                  ))}
                </div>

                <div className={styles.projectActions}>
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                      aria-label={`View ${project.title} on GitHub`}
                      tabIndex={0}
                    >
                      View on GitHub →
                    </a>
                  )}
                  {project.live && (
                    <a 
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                      aria-label={`View live demo of ${project.title}`}
                      tabIndex={0}
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
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Technical Skills</h2>
          </div>
          
          <div className={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <div key={index} className={styles.skillChip}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Certifications</h2>
          </div>

          <ul className={styles.listItems}>
            {certifications.map((cert, index) => (
              <li key={index} className={styles.listItem}>
                <span className={styles.bullet}>•</span>
                <span className={styles.itemText}>{cert}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Achievements Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Achievements</h2>
          </div>

          <ul className={styles.listItems}>
            {achievements.map((achievement, index) => (
              <li key={index} className={styles.listItem}>
                <span className={styles.bullet}>🏆</span>
                <span className={styles.itemText}>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Extracurricular Activities Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Extracurricular Activities</h2>
          </div>

          <div className={styles.activitiesList}>
            {activities.map((activity, index) => (
              <article key={index} className={styles.activityCard}>
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <p className={styles.activityDescription}>{activity.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Contact</h2>
          </div>
          
          <div className={styles.contactGrid}>
            <a 
              href="mailto:singhshreyansh0505@gmail.com"
              className={styles.contactCard}
              aria-label="Send email to Shreyansh Singh"
              tabIndex={0}
            >
              <div className={styles.contactIcon}>📧</div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Email</div>
                <div className={styles.contactValue}>singhshreyansh0505@gmail.com</div>
              </div>
            </a>

            <a 
              href="https://github.com/Shreyansh-5SS"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              aria-label="View GitHub profile"
              tabIndex={0}
            >
              <div className={styles.contactIcon}>💻</div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>GitHub</div>
                <div className={styles.contactValue}>Shreyansh-5SS</div>
              </div>
            </a>

            <a 
              href="https://www.linkedin.com/in/shreyansh-singh-424b0833a/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              aria-label="View LinkedIn profile"
              tabIndex={0}
            >
              <div className={styles.contactIcon}>🔗</div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>LinkedIn</div>
                <div className={styles.contactValue}>Shreyansh Singh</div>
              </div>
            </a>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📱</div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Phone</div>
                <div className={styles.contactValue}>+91 9026622912</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
