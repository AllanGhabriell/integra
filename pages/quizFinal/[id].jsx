// pages/quizFinal/[id].jsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function QuizFinal() {
  const router = useRouter()
  const { id, time, score } = router.query
  const { data: session } = useSession()
  const [total, setTotal] = useState(null)
  const [posted, setPosted] = useState(false)

  // busca total de perguntas
  useEffect(() => {
    if (!id) return
    fetch(`/api/quizzes/${id}`)
      .then(res => res.json())
      .then(q => setTotal(q.questions.length))
      .catch(() => setTotal(0))
  }, [id])

  // envia resultado ao servidor (uma só vez)
  useEffect(() => {
    if (session && id && time && score && total != null && !posted) {
      fetch('/api/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: id,
          userId: session.user.id,
          time: Number(time),
          score: Number(score)
        })
      })
        .then(() => setPosted(true))
        .catch(() => {})
    }
  }, [session, id, time, score, total, posted])

  if (total === null) return <p className="p-4">Carregando resultados…</p>

  const correct = Number(score)
  const wrong = total - correct
  const seconds = Number(time)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resultado Final</h1>
      <p className="mb-2">Acertos: {correct}</p>
      <p className="mb-2">Erros: {wrong}</p>
      <p className="mb-6">Tempo: {seconds}s</p>

      <div className="space-x-4">
        <button onClick={() => router.push(`/quiz/${id}`)}>
          Tentar de novo
        </button>
        <button onClick={() => router.push('/')}>Voltar</button>
      </div>
    </div>
  )
}
