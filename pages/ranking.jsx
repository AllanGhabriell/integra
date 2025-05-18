import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Ranking() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    (async () => {
      try {
        // Busca todos os usuários
        const usersRes = await fetch('/api/usuarios', { credentials: 'include' })
        const users = await usersRes.json()

        // Para cada usuário, busca stats
        const withStats = await Promise.all(users.map(async u => {
          const statsRes = await fetch(`/api/usuarios/${u._id}/stats`, { credentials: 'include' })
          const stats = await statsRes.json()
          return { ...u, totalJogos: stats.totalJogos }
        }))

        // Ordena por totalJogos
        withStats.sort((a, b) => b.totalJogos - a.totalJogos)
        setRanking(withStats)
      } catch {
        setRanking([])
      } finally {
        setLoading(false)
      }
    })()
  }, [session, status, router])

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/')}>X</button>
      <h1 className="title">Ranking de Jogadores</h1>

      {loading ? (
        <p className="loading-text">Carregando ranking…</p>
      ) : (
        <ul className="list">
          {ranking.map((user, idx) => (
            <li key={user._id}
                className={`item ${idx === 0 ? 'rank1' : idx === 1 ? 'rank2' : idx === 2 ? 'rank3' : ''}`}>
              <span className="position">{idx + 1}º</span>
              <span className="name">{user.name}</span>
              <span className="games">{user.totalJogos} jogos</span>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          position: fixed;        /* fixa o container na viewport */
          top: 0;
          left: 0;
          width: 100%;            /* cobre 100% sem considerar scrollbars */
          height: 100vh;          /* 100% da altura da viewport */
          background: linear-gradient(270deg, #000000, #2E0249, #000428);
          background-size: 600% 600%;
          animation: gradientBG 15s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          color: white;
          overflow-y: auto;       /* mantém scroll vertical */
          overflow-x: hidden;     /* remove scroll horizontal */
        }
        @keyframes gradientBG {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .close-btn {
          position: absolute;
          top: 20px; left: 20px;
          background: transparent; border: none;
          color: white; font-size: 1.5rem; cursor: pointer;
        }
        .title {
          font-size: 2.5rem; margin-bottom: 30px;
          user-select: none;
        }
        .loading-text {
          font-size: 1.2rem; margin-top: 40px;
        }
        .list {
          width: 100%; max-width: 600px;
          display: flex; flex-direction: column; gap: 15px;
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
        .name { font-size: 1.1rem; }
        .games { text-align: right; font-size: 1rem; }
        .rank1 {
          background: linear-gradient(45deg, #FFD700, #FFC200);
        }
        .rank2 {
          background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
        }
        .rank3 {
          background: linear-gradient(45deg, #CD7F32, #B87333);
        }
        @media (max-width: 480px) {
          .item {
            grid-template-columns: 30px 1fr;
            grid-template-rows: auto auto;
            gap: 5px;
            text-align: center;
          }
          .games { grid-column: 1 / -1; }
        }
      `}</style>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;  /* elimina qualquer scroll horizontal */
        }
      `}</style>
    </div>
  )  
}
