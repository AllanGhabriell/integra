// pages/admin.jsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  // Redireciona se não for admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.replace('/')
    }
  }, [session, status])

  // Busca quizzes
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

  function handleDelete(id) {
    if (!confirm('Deseja realmente apagar este quiz?')) return
    fetch(`/api/quizzes/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setQuizzes(qs => qs.filter(q => q._id !== id))
        } else {
          alert('Erro ao apagar quiz')
        }
      })
  }

  if (status === 'loading' || loading) {
    return <p className="p-4">Carregando...</p>
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administração de Quizzes</h1>
        <div className="space-x-2">
          <button onClick={() => router.push('/usuario')}>Usuários</button>
          <button onClick={() => router.push('/criarQuiz')}>+ Novo quiz</button>
          <button onClick={() => router.push('/')}>X</button>
        </div>
      </header>

      {quizzes.length === 0 ? (
        <p>Nenhum quiz cadastrado</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="border p-4 rounded flex justify-between items-center hover:shadow-lg transition"
            >
              <span className="font-medium">{quiz.title}</span>
              <div className="space-x-2 opacity-0 hover:opacity-100 flex">
                <button onClick={() => router.push(`/editQuiz/${quiz._id}`)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(quiz._id)}>Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
