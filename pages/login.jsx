// pages/login.jsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const canSubmit = email.trim() !== '' && password.trim() !== ''

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      alert('Login bem-sucedido')
      router.push('/perfil')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-sm">
      <button
        className="mb-4 text-red-500"
        onClick={() => router.push('/')}
      >
        X
      </button>

      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        className="w-full mt-4 bg-red-500 text-white p-2 rounded"
        onClick={() => signIn('google')}
      >
        Entrar com Google
      </button>

      <p className="mt-4 text-center">
        Não tem conta?{' '}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push('/criarConta')}
        >
          Criar conta
        </span>
      </p>
    </div>
  )
}
