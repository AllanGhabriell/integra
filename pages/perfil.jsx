// pages/perfil.jsx
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Perfil() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)

  // Se estiver autenticando, aguardamos
  useEffect(() => {
    if (status === 'loading') return
    if (!session) return

    fetch(`/api/usuarios/${session.user.id}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [session, status])

  if (status === 'loading') {
    return <p className="p-4">Carregando…</p>
  }

  // Usuário não logado
  if (!session) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="mb-4">Faça login para ver seu perfil</p>
        <button onClick={() => router.push('/login')}>Login</button>
      </div>
    )
  }

  // Já está logado, mas aguardando stats
  if (!stats) {
    return <p className="p-4">Carregando estatísticas…</p>
  }

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 text-red-500"
        onClick={() => router.push('/')}
      >
        X
      </button>

      <div className="flex items-center space-x-4 mb-6">
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
        )}
        <h1 className="text-2xl font-bold">{session.user.name}</h1>
      </div>

      <div className="space-y-2">
        <p>Total de jogos: {stats.totalJogos}</p>
        <p>Média de acertos: {stats.mediaAcertos.toFixed(2)}</p>
        <p>Média de erros: {stats.mediaErros.toFixed(2)}</p>
      </div>

      <button
        className="mt-6"
        onClick={() => {
          signOut()
          router.push('/')
        }}
      >
        Sair
      </button>
    </div>
  )
}
