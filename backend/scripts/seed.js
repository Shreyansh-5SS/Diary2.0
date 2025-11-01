import knex from 'knex'
import bcrypt from 'bcrypt'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.development)

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Hash password for demo user
    const passwordHash = await bcrypt.hash('demo123', 10)

    // Insert demo user
    const [userId] = await db('users').insert({
      email: 'demo@local',
      password_hash: passwordHash,
      name: 'Shreyansh',
      avatar_url: null,
    }).returning('id')

    console.log('✅ Demo user created (email: demo@local, password: demo123)')

    // Seed diary entries
    await db('diary_entries').insert([
      {
        user_id: userId,
        title: 'First Day of the Journey',
        content: 'Started building my personal diary app today. The brutalist design is coming together nicely. Excited to see where this goes!',
        entry_date: '2024-01-15',
        mood: 'excited',
        tags: JSON.stringify(['productivity', 'coding', 'motivation']),
      },
      {
        user_id: userId,
        title: 'Reflection on Progress',
        content: 'Made significant progress on the frontend. The split landing page looks exactly how I envisioned it. Typography system is clean and minimal.',
        entry_date: '2024-01-20',
        mood: 'satisfied',
        tags: JSON.stringify(['reflection', 'frontend', 'design']),
      },
      {
        user_id: userId,
        title: 'Late Night Thoughts',
        content: 'Sometimes the best ideas come at 2 AM. Thinking about adding more features to the work dashboard. Need to balance minimalism with functionality.',
        entry_date: '2024-01-25',
        mood: 'contemplative',
        tags: JSON.stringify(['ideas', 'planning', 'design-philosophy']),
      },
    ])

    console.log('✅ Diary entries seeded')

    // Seed anime list
    await db('anime_list').insert([
      {
        user_id: userId,
        title: 'Steins;Gate',
        image_url: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
        status: 'completed',
        episodes_watched: 24,
        total_episodes: 24,
        rating: 9.5,
        notes: 'Mind-bending time travel story. One of the best anime I\'ve ever watched.',
      },
      {
        user_id: userId,
        title: 'Attack on Titan',
        image_url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
        status: 'watching',
        episodes_watched: 45,
        total_episodes: 87,
        rating: 9.0,
        notes: 'Epic action and plot twists. Currently binging season 3.',
      },
      {
        user_id: userId,
        title: 'Cowboy Bebop',
        image_url: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg',
        status: 'completed',
        episodes_watched: 26,
        total_episodes: 26,
        rating: 9.2,
        notes: 'Timeless classic. Amazing soundtrack and character development.',
      },
      {
        user_id: userId,
        title: 'Death Note',
        image_url: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
        status: 'completed',
        episodes_watched: 37,
        total_episodes: 37,
        rating: 8.8,
        notes: 'Psychological thriller at its finest. Light vs L was incredible.',
      },
      {
        user_id: userId,
        title: 'Demon Slayer',
        image_url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
        status: 'plan_to_watch',
        episodes_watched: 0,
        total_episodes: 26,
        rating: null,
        notes: 'Heard amazing things about the animation quality. On my watchlist.',
      },
    ])

    console.log('✅ Anime list seeded')

    // Seed expenses
    await db('expenses').insert([
      {
        user_id: userId,
        category: 'groceries',
        amount: 45.50,
        budget_limit: 200.00,
        description: 'Weekly grocery shopping at local market',
        expense_date: '2024-01-20',
      },
      {
        user_id: userId,
        category: 'entertainment',
        amount: 15.99,
        budget_limit: 50.00,
        description: 'Netflix subscription renewal',
        expense_date: '2024-01-22',
      },
      {
        user_id: userId,
        category: 'transportation',
        amount: 30.00,
        budget_limit: 100.00,
        description: 'Gas fill-up for the week',
        expense_date: '2024-01-24',
      },
      {
        user_id: userId,
        category: 'dining',
        amount: 28.75,
        budget_limit: 150.00,
        description: 'Dinner with friends at local restaurant',
        expense_date: '2024-01-26',
      },
    ])

    console.log('✅ Expenses seeded')

    // Seed tasks
    await db('tasks').insert([
      {
        user_id: userId,
        title: 'Complete database migrations',
        description: 'Set up Knex migrations and seed initial data for all tables',
        status: 'completed',
        priority: 'high',
        due_date: '2024-01-27',
        tags: JSON.stringify(['backend', 'database', 'development']),
        completed_at: db.fn.now(),
      },
      {
        user_id: userId,
        title: 'Build CRUD endpoints',
        description: 'Create REST API endpoints for diary entries, tasks, and expenses',
        status: 'in_progress',
        priority: 'high',
        due_date: '2024-01-30',
        tags: JSON.stringify(['backend', 'api', 'development']),
        completed_at: null,
      },
      {
        user_id: userId,
        title: 'Implement authentication',
        description: 'Add JWT-based authentication with login and registration',
        status: 'pending',
        priority: 'medium',
        due_date: '2024-02-05',
        tags: JSON.stringify(['backend', 'security', 'auth']),
        completed_at: null,
      },
    ])

    console.log('✅ Tasks seeded')

    // Seed skills
    await db('skills').insert([
      {
        user_id: userId,
        name: 'React',
        category: 'programming',
        proficiency: 9,
        is_featured: true,
        display_order: 1,
      },
      {
        user_id: userId,
        name: 'Node.js',
        category: 'programming',
        proficiency: 8,
        is_featured: true,
        display_order: 2,
      },
      {
        user_id: userId,
        name: 'TypeScript',
        category: 'programming',
        proficiency: 8,
        is_featured: true,
        display_order: 3,
      },
      {
        user_id: userId,
        name: 'UI/UX Design',
        category: 'design',
        proficiency: 7,
        is_featured: false,
        display_order: 4,
      },
    ])

    console.log('✅ Skills seeded')

    // Seed timetable slots
    await db('timetable_slots').insert([
      {
        user_id: userId,
        day_of_week: 'monday',
        start_time: '09:00',
        end_time: '12:00',
        title: 'Deep Work Session',
        description: 'Focus on personal projects and coding',
        color: '#ff6347',
        is_recurring: true,
      },
      {
        user_id: userId,
        day_of_week: 'monday',
        start_time: '14:00',
        end_time: '17:00',
        title: 'Client Work',
        description: 'Work on client projects and meetings',
        color: '#0f172a',
        is_recurring: true,
      },
      {
        user_id: userId,
        day_of_week: 'wednesday',
        start_time: '10:00',
        end_time: '11:30',
        title: 'Learning Time',
        description: 'Study new technologies and frameworks',
        color: '#ff6347',
        is_recurring: true,
      },
    ])

    console.log('✅ Timetable slots seeded')

    // Seed projects
    await db('projects').insert([
      {
        user_id: userId,
        title: 'Shreyansh Personal Diary',
        description: 'A brutalist-minimal personal productivity and diary application',
        detailed_description: 'Full-stack diary app with React, Node.js, and SQLite. Features include diary entries, anime tracking, expense management, pomodoro timer, and portfolio showcase.',
        image_url: null,
        tech_stack: JSON.stringify(['React', 'Vite', 'Node.js', 'Express', 'SQLite', 'Knex']),
        project_url: 'http://localhost:5173',
        github_url: 'https://github.com/Shreyansh-5SS/Diary2.0',
        is_featured: true,
        display_order: 1,
        completed_date: null,
      },
      {
        user_id: userId,
        title: 'Portfolio Website',
        description: 'Personal portfolio showcasing projects and skills',
        detailed_description: 'Minimalist portfolio built with modern web technologies.',
        image_url: null,
        tech_stack: JSON.stringify(['React', 'CSS Modules', 'Framer Motion']),
        project_url: null,
        github_url: null,
        is_featured: false,
        display_order: 2,
        completed_date: '2023-12-15',
      },
    ])

    console.log('✅ Projects seeded')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\nDemo credentials:')
    console.log('  Email: demo@local')
    console.log('  Password: demo123\n')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await db.destroy()
  }
}

seed()
