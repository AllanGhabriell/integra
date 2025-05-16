// pages/usuario.jsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Usuarios() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Redireciona se não for admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.replace('/')
    }
  }, [session, status, router])

  // Busca usuários
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
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          setUsers(us => us.filter(u => u._id !== id))
        } else {
          alert('Erro ao excluir usuário')
        }
      })
  }

  if (status === 'loading' || loading) {
    return <p className="p-4">Carregando usuários…</p>
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <button onClick={() => router.push('/admin')}>X</button>
      </header>

      {error && (
        <div className="text-center mb-4">
          <p className="text-red-500">Erro ao carregar usuários</p>
          <button onClick={fetchUsers}>Recarregar</button>
        </div>
      )}

      {!error && users.length === 0 && (
        <div className="text-center">
          <p className="mb-4">Nenhum usuário cadastrado</p>
          <button onClick={fetchUsers}>Recarregar</button>
        </div>
      )}

      {!error && users.length > 0 && (
        <ul className="space-y-4">
          {users.map(user => (
            <li
              key={user._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <span>{user.name} ({user.email})</span>
              <button onClick={() => handleDelete(user._id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
