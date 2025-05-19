import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Perfil() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)

  // Definição de estilos para manter a formatação em todos os estados
  const styles = `
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
    }
    .container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(270deg, #000000, #2E0249, #000428);
      background-size: 600% 600%;
      animation: gradientBG 15s ease infinite;
      overflow: hidden;
    }
    @keyframes gradientBG {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .loading-text, .login-text {
      color: white;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    .login-btn, .logout-btn, .close-btn {
      padding: 10px 20px;
      border: 1px solid white;
      background: transparent;
      color: white;
      cursor: pointer;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    .close-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      background: transparent;
      border: none;
      font-size: 1.5rem;
    }
    .close-btn:hover {
      color: #8b2af8;
      text-shadow: 0 0 8px #8b2af8;
    }
    .profile-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid white;
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      color: white;
      width: 90%;
      max-width: 350px;
    }
    .img-box {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .profile-img, .profile-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid white;
      object-fit: cover;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .name {
      font-size: 1.8rem;
      margin-bottom: 10px;
    }
    .stats {
      margin-bottom: 8px;
      font-size: 1.1rem;
    }
    .logout-btn:hover {
      background: white;
      color: black;
    }
  `

  useEffect(() => {
    if (status === 'loading' || !session) return

    fetch(`/api/usuarios/${session.user.id}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erro ao buscar stats:', err))
  }, [session, status])

  // Estado de autenticação carregando
  if (status === 'loading') {
    return (
      <>
        <div className="container">
          <p className="loading-text">Carregando…</p>
        </div>
        <style jsx>{styles}</style>
      </>
    )
  }

  // Usuário não autenticado
  if (!session) {
    return (
      <>
        <div className="container">
          <p className="login-text">Faça login para ver seu perfil</p>
          <button className="login-btn" onClick={() => router.push('/login')}>Login</button>
        </div>
        <style jsx>{styles}</style>
      </>
    )
  }

  // Estatísticas ainda carregando
  if (!stats) {
    return (
      <>
        <div className="container">
          <p className="loading-text">Carregando estatísticas…</p>
        </div>
        <style jsx>{styles}</style>
      </>
    )
  }

  // Estado normal com stats
  return (
    <>
      <div className="container">
        <button className="close-btn" onClick={() => router.push('/')}>X</button>
        <div className="profile-card">
          <div className="img-box">
            {session.user.image ? (
              <img src={session.user.image} alt="Foto de perfil" className="profile-img" />
            ) : (
              <div className="profile-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="80" height="80">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
              </div>
            )}
          </div>
          <h1 className="name">{session.user.name}</h1>
          <p className="stats">Total de jogos: {stats.totalJogos}</p>
          <p className="stats">Média de acertos: {stats.mediaAcertos.toFixed(2)}</p>
          <p className="stats">Média de erros: {stats.mediaErros.toFixed(2)}</p>

          <button className="logout-btn" onClick={() => { signOut(); router.push('/') }}>
            Sair
          </button>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  )
}
