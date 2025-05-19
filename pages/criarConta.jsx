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

  const isPasswordValid = password.trim().length >= 6
  const canSubmit = name.trim() !== '' && email.trim() !== '' && isPasswordValid

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

    const imageData = preview || null

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

      const login = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (login.error) throw new Error(login.error)

      alert('Conta criada com sucesso')
      router.push('/perfil')
    } catch (err) {
      setError(err.message || 'Erro desconhecido')
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/login')}>X</button>
      <div className="form-box">
        <h1 className="title">Criar Conta</h1>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {!isPasswordValid && password && (
            <p className="error-text">A senha deve ter pelo menos 6 caracteres.</p>
          )}

          <label>Foto de Perfil (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <img src={preview} alt="Prévia" className="preview" />
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="submit-btn"
          >
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(270deg, #000000, #2E0249, #000428);
          background-size: 600% 600%;
          animation: gradientBG 15s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          overflow-x: hidden;
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
          color: #f87171;
          text-shadow: 0 0 8px #f87171;
        }

        .form-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
        }

        .title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          text-align: center;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        label {
          font-weight: bold;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="file"] {
          padding: 10px;
          border-radius: 8px;
          border: none;
        }

        .preview {
          margin-top: 10px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
          align-self: center;
        }

        .submit-btn {
          padding: 10px;
          border: 1px solid white;
          background: transparent;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-btn:hover:enabled {
          background: white;
          color: black;
        }

        .error-msg {
          color: #f87171;
          text-align: center;
          margin-bottom: 10px;
        }

        .error-text {
          font-size: 0.85rem;
          color: #f87171;
        }
      `}</style>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}
