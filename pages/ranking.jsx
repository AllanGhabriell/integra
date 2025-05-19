import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Ranking() {
  const router = useRouter()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const usersRes = await fetch('/api/usuarios')
        const users = await usersRes.json()

        const withStats = await Promise.all(
          users.map(async u => {
            const statsRes = await fetch(`/api/usuarios/${u._id}/stats`)
            const stats = await statsRes.json()
            return { ...u, totalJogos: stats.totalJogos }
          })
        )

        withStats.sort((a, b) => b.totalJogos - a.totalJogos)
        setRanking(withStats)
      } catch (error) {
        console.error('Erro ao carregar ranking:', error)
        setRanking([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/')}>X</button>
      <h1 className="title">Ranking de Jogadores</h1>

      {loading ? (
        <p className="loading-text">Carregando ranking…</p>
      ) : (
        <ul className="list">
          {ranking.map((user, idx) => (
            <li
              key={user._id}
              className={`item ${
                idx === 0 ? 'rank1' : idx === 1 ? 'rank2' : idx === 2 ? 'rank3' : ''
              }`}
            >
              <span className="position">{idx + 1}º</span>
              <span className="name">{user.name}</span>
              <span className="games">{user.totalJogos} jogos</span>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(270deg, #000000, #2E0249, #000428);
          background-size: 600% 600%;
          animation: gradientBG 15s ease infinite;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;

          padding: 20px;
          box-sizing: border-box;

          color: white;
          overflow-y: auto;
          overflow-x: hidden;
          text-align: center;
        }

        @keyframes gradientBG {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .close-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
        }
        .close-btn:hover {
          color: #8b2af8;
          text-shadow: 0 0 8px #8b2af8;
        }
          
        .title {
          font-size: 2rem;
          margin: 60px 0 20px;
          user-select: none;
        }

        .loading-text {
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .list {
          width: 100%;
          max-width: 600px;
          list-style: none;
          padding: 0;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 40px;
        }

        .item {
          display: grid;
          grid-template-columns: 40px 1fr 80px;
          align-items: center;
          padding: 15px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          user-select: none;
        }

        .position { font-size: 1.2rem; }
        .name     { font-size: 1.1rem; overflow-wrap: break-word; }
        .games    { text-align: right; font-size: 1rem; }

        .rank1 {
          background: linear-gradient(45deg, #FFD700, #FFC200);
        }
        .rank2 {
          background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
        }
        .rank3 {
          background: linear-gradient(45deg, #CD7F32, #B87333);
        }

        @media (max-width: 768px) {
          .title { font-size: 1.5rem; margin-top: 50px; }
          .item { padding: 12px; grid-template-columns: 30px 1fr; grid-template-rows: auto auto; gap: 6px; }
          .games { grid-column: 1 / -1; text-align: center; }
        }

        @media (max-width: 480px) {
          .container { padding: 10px; }
          .title { margin-top: 40px; }
          .item { padding: 10px; gap: 4px; }
          .position { font-size: 1rem; }
          .name     { font-size: 0.9rem; }
          .games    { font-size: 0.9rem; }
        }
      `}</style>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}
