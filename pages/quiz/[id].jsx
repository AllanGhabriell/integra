// pages/quiz/[id].jsx
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export default function QuizPage() {
  const router = useRouter()
  const { id } = router.query
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  // Busca o quiz
  useEffect(() => {
    if (!id) return
    fetch(`/api/quizzes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Não encontrado')
        return res.json()
      })
      .then(data => {
        setQuiz(data)
        setLoading(false)
      })
      .catch(() => {
        router.replace('/')
      })
  }, [id])

  // Inicia cronômetro
  useEffect(() => {
    if (loading) return
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [loading])

  if (loading || !quiz) return <p className="p-4">Carregando quiz…</p>

  const question = quiz.questions[currentQ]
  const isLast = currentQ === quiz.questions.length - 1

  function handleNext() {
    // atualiza score
    if (selected === question.correctIndex) {
      setScore(s => s + 1)
    }
    setSelected(null)
    if (isLast) {
      clearInterval(timerRef.current)
      router.push(`/quizFinal/${id}?time=${elapsed}&score=${score + (selected === question.correctIndex ? 1 : 0)}`)
    } else {
      setCurrentQ(q => q + 1)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 text-red-500"
        onClick={() => router.push('/')}
      >
        X
      </button>

      <div className="mb-6">
        <span>Cronômetro: {elapsed}s</span>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">
          {question.text}
        </h2>
        <ul className="space-y-2">
          {question.options.map((opt, idx) => (
            <li key={idx}>
              <button
                className={`w-full text-left p-2 border rounded ${
                  selected === idx ? 'bg-blue-100' : ''
                }`}
                onClick={() => setSelected(idx)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="mt-6 p-2 bg-green-500 text-white rounded disabled:opacity-50"
        onClick={handleNext}
        disabled={selected === null}
      >
        {isLast ? 'Finalizar' : 'Próxima'}
      </button>
    </div>
  )
}
