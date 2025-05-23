import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function QuizFinal() {
  const router = useRouter()
  const { id, time, score } = router.query
  const { data: session, status } = useSession()
  const [total, setTotal] = useState(null)
  const [posted, setPosted] = useState(false)

  // Estilos compartilhados
  const styles = `
    html,
    body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    }

    .container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(270deg, #000000, #2E0249, #000428);
    background-size: 600% 600%;
    background-repeat: no-repeat;
    background-position: center center;
    animation: gradientBG 15s ease infinite;
    padding: 20px;
    box-sizing: border-box;
    }

    @keyframes gradientBG {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    }

    .result-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid white;
    border-radius: 16px;
    padding: 30px;
    text-align: center;
    color: white;
    width: 90%;
    max-width: 350px;
    box-sizing: border-box;
    }

    .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    }

    .stat {
    font-size: 1.2rem;
    margin-bottom: 10px;
    }

    .button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
    }

    .icon-button {
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    flex: 1 1 120px;
    box-sizing: border-box;
    margin-bottom: 10px;
    }

    .icon-button:hover {
    background: white;
    color: black;
    }

    .loading-text {
    color: white;
    font-size: 1.2rem;
    text-align: center;
    }

    /* Responsividade para telas menores */
    @media (max-width: 600px) {
    .container {
      padding: 15px;
    }

    .result-card {
      padding: 20px;
    }

    .title {
      font-size: 1.5rem;
      margin-bottom: 15px;
    }

    .stat {
      font-size: 1rem;
      margin-bottom: 8px;
    }

    .button-group {
      gap: 10px;
    }

    .icon-button {
      padding: 8px 16px;
      font-size: 1rem;
      flex: 1 1 100%;
    }

    .loading-text {
      font-size: 1rem;
      margin-top: 20px;
    }
    }

  `

  useEffect(() => {
    if (!id) return
    fetch(`/api/quizzes/${id}`)
      .then(res => res.json())
      .then(q => setTotal(q.questions.length))
      .catch(() => setTotal(0))
  }, [id])

  useEffect(() => {
    if (
      status === 'authenticated' &&
      id &&
      time != null &&
      score != null &&
      total != null &&
      !posted
    ) {
      fetch('/api/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id, time: Number(time), score: Number(score) }),
        credentials: 'include'
      })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json()
            console.error('Erro ao enviar resultado:', data)
            throw new Error(data.message || 'Falha ao enviar')
          }
          setPosted(true)
        })
        .catch(err => console.error(err))
    }
  }, [status, id, time, score, total, posted])

  // Loading
  if (total === null) {
    return (
      <>
        <div className="container">
          <p className="loading-text">Carregando resultados…</p>
        </div>
        <style jsx>{styles}</style>
      </>
    )
  }

  const correct = Number(score)
  const wrong = total - correct
  const seconds = Number(time)

  return (
    <>
      <div className="container">
        <div className="result-card">
          <h1 className="title">Resultado Final</h1>
          <p className="stat">Acertos: {correct}</p>
          <p className="stat">Erros: {wrong}</p>
          <p className="stat">Tempo: {seconds}s</p>
          <div className="button-group">
            <button className="icon-button" onClick={() => router.push(`/quiz/${id}`)}>Tentar Novamente</button>
            <button className="icon-button" onClick={() => router.push('/')}>Sair</button>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  )
}
