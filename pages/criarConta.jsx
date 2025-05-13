// pages/criarConta.jsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function CriarConta() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Validação de campos e senha
  const isPasswordValid = password.trim().length >= 6
  const canSubmit =
    name.trim() !== '' &&
    email.trim() !== '' &&
    isPasswordValid &&
    file !== null

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(f)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setError(null)

    // Converte imagem em base64 (já em preview)
    const imageData = preview

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, image: imageData })
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Erro ao criar conta')
      }

      // Faz login automático
      const login = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (login.error) {
        throw new Error(login.error)
      }

      alert('Conta criada com sucesso')
      router.push('/perfil')
    } catch (err) {
      setError(err.message || 'Erro desconhecido')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <button
        className="mb-4 text-red-500"
        onClick={() => router.push('/login')}
      >
        X
      </button>

      <h1 className="text-2xl font-bold mb-4">Criar Conta</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

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
          {!isPasswordValid && password && (
            <p className="text-red-500 text-sm mt-1">A senha deve ter pelo menos 6 caracteres.</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Prévia"
              className="mt-2 w-24 h-24 object-cover rounded-full"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}
