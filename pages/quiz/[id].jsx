import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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

  // Estilos compartilhados
  const styles = `
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
    }
    .container {
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(270deg, #000000, #2E0249, #000428);
      background-size: 600% 600%;
      animation: gradientBG 15s ease infinite;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;
      color: white;
      overflow-x: hidden;
    }
    @keyframes gradientBG {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .close-btn {
      align-self: flex-start;
      font-size: 1.5rem;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
      margin-bottom: 20px;
      transition: color 0.3s ease;
    }
    .close-btn:hover {
      color: #8b2af8;
      text-shadow: 0 0 8px #8b2af8;
    }
    .timer {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    .question-box {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid white;
      border-radius: 16px;
      padding: 20px;
      width: 100%;
      max-width: 500px;
    }
    .question-text {
      font-size: 1.4rem;
      margin-bottom: 20px;
    }
    .options {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .option-btn {
      width: 100%;
      text-align: left;
      padding: 12px;
      margin-bottom: 10px;
      border: 1px solid white;
      background: transparent;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .option-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .option-btn.correct {
      background-color: #2dff7e;
      color: black;
      font-weight: bold;
      box-shadow: 0 0 10px #2dff7e;
    }
    .option-btn.incorrect {
      background-color: #ff4b4b;
      color: black;
      font-weight: bold;
      box-shadow: 0 0 10px #ff4b4b;
    }
    .loading-text {
      font-size: 1.2rem;
      margin-top: 40px;
      color: white;
    }
  `

  useEffect(() => {
    if (!id) return
    fetch(`/api/quizzes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Não encontrado')
        return res.json()
      })
      .then(data => {
        const shuffledQuestions = shuffleArray(data.questions)
        setQuiz({ ...data, questions: shuffledQuestions })
        setLoading(false)
      })
      .catch(() => {
        router.replace('/')
      })
  }, [id])

  useEffect(() => {
    if (loading) return
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [loading])

  // Loading
  if (loading || !quiz) {
    return (
      <>
        <div className="container">
          <p className="loading-text">Carregando quiz…</p>
        </div>
        <style jsx>{styles}</style>
      </>
    )
  }

  const question = quiz.questions[currentQ]
  const isLast = currentQ === quiz.questions.length - 1

  function handleSelect(idx) {
    setSelected(idx)
    if (idx === question.correctIndex) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      setSelected(null)
      if (isLast) {
        clearInterval(timerRef.current)
        router.push(
          `/quizFinal/${id}?time=${elapsed}&score=${score + (idx === question.correctIndex ? 1 : 0)}`
        )
      } else {
        setCurrentQ(q => q + 1)
      }
    }, 1000)
  }

  // Main render
  return (
    <>
      <div className="container">
        <button className="close-btn" onClick={() => router.push('/')}>X</button>
        <div className="timer">Cronômetro: {elapsed}s</div>
        <div className="question-box">
          <h2 className="question-text">{question.text}</h2>
          <ul className="options">
            {question.options.map((opt, idx) => {
              let className = "option-btn"
              if (selected !== null) {
                if (idx === selected) {
                  className += idx === question.correctIndex ? " correct" : " incorrect"
                } else if (idx === question.correctIndex) {
                  className += " correct"
                }
              }
              return (
                <li key={idx}>
                  <button
                    className={className}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                  >
                    {opt}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  )
}
