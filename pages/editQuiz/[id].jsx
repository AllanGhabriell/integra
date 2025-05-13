// pages/editQuiz/[id].jsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function EditQuiz() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query

  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Protege admin e busca dados
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.replace('/')
      return
    }
    if (!id) return
    fetch(`/api/quizzes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setTitle(data.title)
        setQuestions(
          data.questions.map(q => ({
            text: q.text,
            options: [...q.options],
            correctIndex: q.correctIndex
          }))
        )
      })
      .catch(() => {
        alert('Quiz não encontrado')
        router.replace('/admin')
      })
      .finally(() => setLoading(false))
  }, [session, status, id])

  // Handlers (mesmos de criarQuiz)
  function updateQuestion(idx, field, value) {
    setQuestions(qs =>
      qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    )
  }
  function updateOption(qIdx, oIdx, value) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, j) => (j === oIdx ? value : opt)) }
          : q
      )
    )
  }
  function addOption(qIdx) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, ''] } : q
      )
    )
  }
  function removeOption(qIdx, oIdx) {
    setQuestions(qs =>
      qs.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.filter((_, j) => j !== oIdx),
              correctIndex:
                q.correctIndex === oIdx ? null : q.correctIndex > oIdx ? q.correctIndex - 1 : q.correctIndex
            }
          : q
      )
    )
  }
  function addQuestion() {
    if (questions.length < 10) {
      setQuestions(qs => [...qs, { text: '', options: ['', ''], correctIndex: null }])
    }
  }
  function removeQuestion(idx) {
    if (questions.length > 5) {
      setQuestions(qs => qs.filter((_, i) => i !== idx))
    }
  }

  const isValid =
    title.trim() !== '' &&
    questions.every(
      q =>
        q.text.trim() !== '' &&
        q.options.length >= 2 &&
        q.options.every(opt => opt.trim() !== '') &&
        q.correctIndex != null
    )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    setSubmitting(true)
    const res = await fetch(`/api/quizzes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions })
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      alert('Erro ao atualizar quiz')
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return <p className="p-4">Carregando…</p>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button className="mb-4 text-red-500" onClick={() => router.push('/admin')}>
        X
      </button>
      <h1 className="text-2xl font-bold mb-4">Editar Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1">Título do Quiz</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="border p-4 rounded space-y-2">
            <div className="flex justify-between items-center">
              <strong>Pergunta {qi + 1}</strong>
              {questions.length > 5 && (
                <button type="button" onClick={() => removeQuestion(qi)}>
                  Remover pergunta
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Texto da pergunta"
              value={q.text}
              onChange={e => updateQuestion(qi, 'text', e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                  />
                  <input
                    type="text"
                    placeholder={`Opção ${oi + 1}`}
                    value={opt}
                    onChange={e => updateOption(qi, oi, e.target.value)}
                    className="flex-1 border p-2 rounded"
                  />
                  {q.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(qi, oi)}>
                      −
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addOption(qi)}>
                + Opção
              </button>
            </div>
          </div>
        ))}

        <div className="space-x-2">
          {questions.length < 10 && (
            <button type="button" onClick={addQuestion}>
              + Pergunta
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {submitting ? 'Atualizando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}
