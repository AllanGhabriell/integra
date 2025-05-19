// pages/ranking.jsx
import { useRouter } from 'next/router'
import { connectToDatabase } from '../lib/db'
import User from '../models/User'
import Resultado from '../models/Resultado'

export async function getServerSideProps() {
  await connectToDatabase()

  // Busca todos os usuários (somente nome e _id)
  const users = await User.find({}, 'name').lean()

  // Agrupa resultados por usuário para contar total de jogos
  const agg = await Resultado.aggregate([
    { $group: { _id: '$user', totalJogos: { $sum: 1 } } }
  ])

  // Cria um mapa { userId: totalJogos }
  const statsMap = Object.fromEntries(
    agg.map(r => [r._id.toString(), r.totalJogos])
  )

  // Monta ranking e ordena
  const ranking = users
    .map(u => ({
      _id: u._id.toString(),
      name: u.name,
      totalJogos: statsMap[u._id.toString()] || 0
    }))
    .sort((a, b) => b.totalJogos - a.totalJogos)

  return { props: { ranking } }
}

export default function Ranking({ ranking }) {
  const router = useRouter()

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/')}>X</button>
      <h1 className="title">Ranking de Jogadores</h1>

      {ranking.length > 0 ? (
        <ul className="list">
          {ranking.map((user, idx) => (
            <li
              key={user._id}
              className={`item ${
                idx === 0 ? 'rank1' :
                idx === 1 ? 'rank2' :
                idx === 2 ? 'rank3' : ''
              }`}
            >
              <span className="position">{idx + 1}º</span>
              <span className="name">{user.name}</span>
              <span className="games">{user.totalJogos} jogos</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="loading-text">Nenhum dado disponível no ranking</p>
      )}

      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(270deg, #000000, #2e0249, #000428);
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
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          user-select: none;
        }

        .position { font-size: 1.2rem; }
        .name     { font-size: 1.1rem; overflow-wrap: break-word; }
        .games    { text-align: right; font-size: 1rem; }

        .rank1 {
          background: linear-gradient(45deg, #ffd700, #ffc200);
        }
        .rank2 {
          background: linear-gradient(45deg, #c0c0c0, #a9a9a9);
        }
        .rank3 {
          background: linear-gradient(45deg, #cd7f32, #b87333);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 1.5rem;
            margin-top: 50px;
          }
          .item {
            padding: 12px;
            grid-template-columns: 30px 1fr;
            grid-template-rows: auto auto;
            gap: 6px;
          }
          .games {
            grid-column: 1 / -1;
            text-align: center;
          }
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
