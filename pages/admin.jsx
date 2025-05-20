import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.replace('/')
    }
  }, [session, status])

  useEffect(() => {
    if (!session || session.user.role !== 'admin') return
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

  if (status === 'loading' || loading) {
    return <p className="loading">Carregando...</p>
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Administração de Quizzes</h1>
        <div className="buttons">
          <button onClick={() => router.push('/usuario')}>Usuários</button>
          <button onClick={() => router.push('/criarQuiz')}>+ Novo quiz</button>
          <button onClick={() => router.push('/')}>X</button>
        </div>
      </header>

      {quizzes.length === 0 ? (
        <p className="message">Nenhum quiz cadastrado</p>
      ) : (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-item">
              <span className="quiz-title">{quiz.title}</span>
              <div className="quiz-actions">
                <button onClick={() => router.push(`/editQuiz/${quiz._id}`)}>Editar</button>
                <button onClick={() => {
                  if (!confirm('Deseja realmente apagar este quiz?')) return
                  fetch(`/api/quizzes/${quiz._id}`, { method: 'DELETE' })
                    .then(res => {
                      if (res.ok) {
                        setQuizzes(qs => qs.filter(q => q._id !== quiz._id))
                      } else {
                        alert('Erro ao apagar quiz')
                      }
                    })
                }}>Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

<style jsx>{`
  .container {
    width: 100%;
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(270deg, #000, #2E0249, #000428);
    background-size: 600% 600%;
    animation: gradientBG 15s ease infinite;
    color: white;
    font-family: sans-serif;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  @keyframes gradientBG {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 30px;
  }

  .title {
    font-size: 2rem;
    margin: 0;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .buttons button {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid white;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    flex: 1 1 auto;
    min-width: 100px;
  }

  .buttons button:hover {
    background: white;
    color: black;
  }

  .message {
    font-size: 1.2rem;
    margin-top: 20px;
    text-align: center;
  }

  .quiz-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .quiz-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    border: 1px solid white;
    border-radius: 10px;
    padding: 16px;
    transition: box-shadow 0.3s ease;
  }

  .quiz-item:hover {
    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
  }

  .quiz-title {
    font-weight: bold;
    flex: 1 1 100%;
    word-break: break-word;
  }

  .quiz-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    opacity: 0.8;
  }

  .quiz-actions button {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid white;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    flex: 1 1 auto;
    min-width: 80px;
  }

  .quiz-actions button:hover {
    background: white;
    color: black;
  }

  .loading {
    padding: 20px;
    font-size: 1.2rem;
    color: white;
    text-align: center;
  }

  /* Global reset do html/body */
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  /* Ajustes para telas pequenas */
  @media (max-width: 600px) {
    .container {
      padding: 20px 10px;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
    }

    .title {
      font-size: 1.5rem;
    }

    .buttons button {
      padding: 6px 12px;
      font-size: 0.9rem;
    }

    .quiz-item {
      padding: 12px;
    }

    .quiz-actions button {
      padding: 4px 8px;
      font-size: 0.85rem;
    }
  }
`}</style>


      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}
