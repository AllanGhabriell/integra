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

  if (loading) return <p className="p-4">Carregando quizzes…</p>

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">YesOrNo</h1>
        <nav className="space-x-4">
          {!session && (
            <button onClick={() => router.push('/login')}>Login</button>
          )}
          {session && (
            <button onClick={() => router.push('/perfil')}>Perfil</button>
          )}
          {session?.user.role === 'admin' && (
            <button onClick={() => router.push('/admin')}>Admin</button>
          )}
        </nav>
      </header>

      {quizzes.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">Nenhum quiz disponível</p>
          {session?.user.role === 'admin' && (
            <button onClick={() => router.push('/criarQuiz')}>
              Criar quiz
            </button>
          )}
        </div>
      ) : (
        <div>
          {session?.user.role === 'admin' && (
            <button
              className="mb-4"
              onClick={() => router.push('/criarQuiz')}
            >
              Criar quiz
            </button>
          )}
          <ul className="space-y-4">
            {quizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <span className="text-lg font-medium">{quiz.title}</span>
                <button onClick={() => router.push(`/quiz/${quiz._id}`)}>
                  Jogar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
