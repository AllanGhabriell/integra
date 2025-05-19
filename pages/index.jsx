import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const styles = `
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-x: hidden;
    }
    .container {
      position: relative;
      width: 100vw;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      background: linear-gradient(270deg, #000000, #2E0249, #000428);
      background-size: 600% 600%;
      animation: gradientBG 15s ease infinite;
      overflow-y: auto;
    }
    @keyframes gradientBG {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .header {
      position: fixed;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .main {
      z-index: 1;
      text-align: center;
      width: 100%;
      max-width: 1200px;
      padding: 24px 16px 40px;
      margin-top: 80px; /* space for fixed header */
    }
    .title {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 24px;
      word-break: break-word;
    }
    .empty p {
      font-size: 1.1rem;
      color: white;
      margin-bottom: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }
    .card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border: 1px solid white;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      word-break: break-word;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    .card-title {
      font-size: 1.2rem;
      color: white;
      margin-bottom: 12px;
    }
    .btn {
      padding: 6px 12px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      color: white;
      border: 1px solid white;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      white-space: normal;
    }
    .btn:hover {
      transform: translateY(-2px);
      border-color: #8b2af8;
      box-shadow: 0 0 8px #8b2af8;
    }
    .btn.full {
      grid-column: 1 / -1;
      font-size: 1rem;
      padding: 8px 16px;
    }
    .loading {
      color: white;
      font-size: 1.2rem;
      margin-top: 20vh;
    }
    .ranking-btn {
      position: fixed;
      top: 16px;
      right: 16px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      color: white;
      border: 1px solid white;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: box-shadow 0.3s ease, border-color 0.3s ease;
      z-index: 10;
      white-space: normal;
    }
    .ranking-btn:hover {
      border-color: #FFFF00;
      box-shadow: 0 0 8px #FFFF00;
    }

    /* Responsividade */
    @media (max-width: 768px) {
      .title {
        font-size: 2rem;
        margin-bottom: 20px;
      }
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 10px;
      }
      .card {
        padding: 10px;
      }
      .card-title {
        font-size: 1rem;
        margin-bottom: 10px;
      }
      .btn {
        font-size: 0.85rem;
        padding: 5px 10px;
      }
      .btn.full {
        font-size: 0.95rem;
        padding: 6px 12px;
      }
    }

    @media (max-width: 480px) {
      .header {
        top: 12px;
        left: 12px;
      }
      .ranking-btn {
        top: 12px;
        right: 12px;
        padding: 5px 10px;
        font-size: 0.85rem;
      }
      .main {
        margin-top: 64px;
        padding: 16px 12px 32px;
      }
      .title {
        font-size: 1.75rem;
        margin-bottom: 16px;
      }
      .grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .card {
        padding: 8px;
      }
      .card-title {
        font-size: 0.95rem;
        margin-bottom: 8px;
      }
      .btn {
        font-size: 0.8rem;
        padding: 4px 8px;
      }
      .btn.full {
        font-size: 0.9rem;
        padding: 6px 10px;
      }
      .empty p {
        font-size: 0.9rem;
      }
    }
  `

  useEffect(() => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <>
      <div className="container">
        <p className="loading">Carregando quizzes…</p>
      </div>
      <style jsx>{styles}</style>
    </>
  )

  return (
    <div className="container">
      <header className="header">
        {!session && (
          <button className="btn" onClick={() => router.push('/login')}>Login</button>
        )}
        {session && (
          <button className="btn" onClick={() => router.push('/perfil')}>Perfil</button>
        )}
        {session?.user.role === 'admin' && (
          <button className="btn" onClick={() => router.push('/admin')}>Admin</button>
        )}
      </header>

      <button
        className="btn ranking-btn"
        onClick={() => router.push('/ranking')}
      >
        Ranking
      </button>

      <main className="main">
        <h1 className="title">YesOrNo</h1>

        {quizzes.length === 0 ? (
          <div className="empty">
            <p>Nenhum quiz disponível</p>
            {session?.user.role === 'admin' && (
              <button className="btn" onClick={() => router.push('/criarQuiz')}>Criar Quiz</button>
            )}
          </div>
        ) : (
          <div className="grid">
            {session?.user.role === 'admin' && (
              <button className="btn full" onClick={() => router.push('/criarQuiz')}>+ Criar Quiz</button>
            )}
            {quizzes.map(quiz => (
              <div key={quiz._id} className="card">
                <h2 className="card-title">{quiz.title}</h2>
                <button className="btn" onClick={() => router.push(`/quiz/${quiz._id}`)}>Jogar</button>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{styles}</style>
    </div>
  )
}
