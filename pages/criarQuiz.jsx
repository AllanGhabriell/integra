// pages/criarQuiz.jsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function CriarQuiz() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?.role || session.user.role !== 'admin') {
      router.replace('/')
    }
  }, [session, status, router])

  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState(
    Array.from({ length: 5 }, () => ({ text: '', options: ['', ''], correctIndex: null }))
  )
  const [submitting, setSubmitting] = useState(false)

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
          ? { ...q, options: q.options.filter((_, j) => j !== oIdx) }
          : q
      )
    )
  }

  function setCorrect(qIdx, oIdx) {
    setQuestions(qs =>
      qs.map((q, i) => (i === qIdx ? { ...q, correctIndex: oIdx } : q))
    )
  }

  function addQuestion() {
    setQuestions(qs => [...qs, { text: '', options: ['', ''], correctIndex: null }])
  }

  function removeQuestion(idx) {
    setQuestions(qs => qs.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions }),
    })
    setSubmitting(false)
    if (res.ok) {
      router.push('/admin')
    } else {
      alert('Erro ao criar quiz.')
    }
  }

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/admin')}>X</button>
      <h1 className="title">Criar Quiz</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Título do Quiz
          <input
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="question-block">
            <div className="question-header">
              <label>
                Pergunta {qIdx + 1}
                <input
                  className="input"
                  value={q.text}
                  onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                  required
                />
              </label>
              <button
                type="button"
                className="btn small"
                onClick={() => removeQuestion(qIdx)}
              >
                Apagar Pergunta
              </button>
            </div>

            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="option-row">
                <input
                  className="input"
                  value={opt}
                  onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                  required
                />
                <input
                  type="radio"
                  name={`correct-${qIdx}`}
                  checked={q.correctIndex === oIdx}
                  onChange={() => setCorrect(qIdx, oIdx)}
                />
                <button type="button" className="remove-btn" onClick={() => removeOption(qIdx, oIdx)}>−</button>
              </div>
            ))}

            <button type="button" className="btn small" onClick={() => addOption(qIdx)}>
              Adicionar Opção
            </button>
          </div>
        ))}

        <button type="button" className="btn add-q" onClick={addQuestion}>
          + Adicionar Pergunta
        </button>

        <button type="submit" className="btn submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar Quiz'}
        </button>
      </form>
      <style jsx>{`
        .container {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(270deg, #000000, #2E0249, #000428);
          background-size: 600% 600%;
          animation: gradientBG 15s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 40px 20px;
          color: white;
          overflow-y: auto;
          overflow-x: hidden;
        }

        @keyframes gradientBG {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .close-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .title {
          font-size: 2.5rem;
          margin-bottom: 30px;
          user-select: none;
        }

        .form {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        label {
          display: flex;
          flex-direction: column;
          font-size: 1.2rem;
          user-select: none;
        }

        .input {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          padding: 12px 15px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .input:focus {
          border-color: #8b2af8;
          box-shadow: 0 0 10px #8b2af8;
        }

        .question-block {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 15px;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .btn {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          color: white;
          font-size: 1.1rem;
          padding: 12px 0;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-3px);
          border-color: #8b2af8;
          box-shadow: 0 0 12px #8b2af8;
        }

        .btn.small {
          padding: 8px 12px;
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          .title {
            font-size: 2rem;
          }

          .form {
            max-width: 100%;
          }
        }

        .btn.add-q {
          margin-top: 20px;
          width: fit-content;
          align-self: center;
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
