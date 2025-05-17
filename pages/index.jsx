// pages/index.jsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="loading">Carregando quizzes…</p>

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
      <style jsx>{`
        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(270deg, #000000, #2E0249, #000428);
          background-size: 600% 600%;
          animation: gradientBG 15s ease infinite;
        }
        @keyframes gradientBG {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .header {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 10px;
        }
        .main {
          z-index: 1;
          text-align: center;
          max-width: 1200px;
          padding: 0 20px;
          width: 100%;
        }
        .title {
          font-size: 4rem;
          color: white;
          margin-bottom: 40px;
        }
        .empty p {
          font-size: 1.2rem;
          color: white;
          margin-bottom: 20px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        }
        .card-title {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn {
          padding: 10px 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid white;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-3px);
          border-color: #8b2af8;
          box-shadow: 0 0 10px #8b2af8;
        }
        .btn.full {
          grid-column: 1 / -1;
          font-size: 1.2rem;
        }
        .loading {
          color: white;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  )
}
