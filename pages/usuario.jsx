import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Usuarios() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.replace('/')
    }
  }, [session, status, router])

  const fetchUsers = () => {
    setLoading(true)
    fetch('/api/usuarios', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar usuários')
        return res.json()
      })
      .then(data => {
        setUsers(data)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetchUsers()
    }
  }, [session])

  function handleDelete(id) {
    if (!confirm('Deseja realmente excluir este usuário?')) return
    fetch(`/api/usuarios/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          setUsers(us => us.filter(u => u._id !== id))
        } else {
          alert('Erro ao excluir usuário')
        }
      })
  }

  function handleReset(id) {
    if (!confirm('Deseja realmente resetar os dados deste usuário?')) return
    fetch(`/api/usuarios/${id}/reset`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          alert('Dados do usuário resetados com sucesso.')
        } else {
          alert('Erro ao resetar dados do usuário')
        }
      })
  }

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/admin')}>X</button>
      <h1 className="title">Usuários</h1>

      {loading ? (
        <p className="loading-text">Carregando usuários...</p>
      ) : error ? (
        <p className="error">Erro ao carregar usuários.</p>
      ) : (
        <ul className="user-list">
          {users.map(user => (
            <li key={user._id} className="user-item">
              <span>{user.name} ({user.email})</span>
              <div className="button-group">
                <button onClick={() => handleDelete(user._id)} className="btn">
                  Excluir
                </button>
                <button onClick={() => handleReset(user._id)} className="btn reset-btn">
                  Resetar Dados
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
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
          transition: color 0.3s ease;
        }
        .close-btn:hover {
          color: #8b2af8;
          text-shadow: 0 0 8px #8b2af8;
        }

        .title {
          font-size: 2.5rem;
          margin-bottom: 30px;
          user-select: none;
        }

        .loading-text,
        .error {
          font-size: 1.2rem;
          margin-top: 40px;
        }

        .user-list {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .user-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
          user-select: none;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .btn {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          padding: 8px 12px;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        .btn:hover {
          transform: translateY(-3px);
          border-color: #8b2af8;
          box-shadow: 0 0 12px #8b2af8;
        }

        .reset-btn {
          background: rgba(255, 100, 100, 0.1);
          border-color: #ff5c5c;
        }
        .reset-btn:hover {
          border-color: #ff5c5c;
          box-shadow: 0 0 12px #ff5c5c;
        }

        @media (max-width: 480px) {
          .title {
            font-size: 2rem;
          }
          .user-item {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
          .button-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
