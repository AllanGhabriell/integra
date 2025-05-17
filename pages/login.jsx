// pages/login.jsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const canSubmit = email.trim() !== '' && password.trim() !== ''

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const callback = `${window.location.origin}/perfil`
    await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: callback
    })
  }

  function handleGoogle() {
    const callback = `${window.location.origin}/perfil`
    signIn('google', { callbackUrl: callback })
  }

  return (
    <div className="container">
      <button className="close-btn" onClick={() => router.push('/')}>X</button>
      <h1 className="title">Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            required
          />
        </label>

        <label className="password-label">
          Senha
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOffIcon className="icon" />
              ) : (
                <EyeIcon className="icon" />
              )}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="btn"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        className="btn google-btn"
        onClick={handleGoogle}
      >
        Entrar com Google
      </button>

      <p className="signup-text">
        Não tem conta?{' '}
        <span
          className="link"
          onClick={() => router.push('/criarConta')}
        >
          Criar conta
        </span>
      </p>

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
          justify-content: center;
          padding: 20px;
          color: white;
          overflow: hidden;
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
          font-size: 3rem;
          margin-bottom: 40px;
          user-select: none;
        }

        form.form {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        label {
          font-size: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          user-select: none;
        }

        .input {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          padding: 12px 15px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input:focus {
          border-color: #8b2af8;
          box-shadow: 0 0 10px #8b2af8;
        }

        .password-label {
          position: relative;
        }

        .password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
          user-select: none;
        }
        .eye-btn:hover {
          color: #8b2af8;
          text-shadow: 0 0 8px #8b2af8;
        }

        .btn {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid white;
          border-radius: 8px;
          color: white;
          font-size: 1.1rem;
          padding: 12px 0;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: default;
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-3px);
          border-color: #8b2af8;
          box-shadow: 0 0 12px #8b2af8;
        }

        .google-btn {
          margin-top: 20px;
        }

        .signup-text {
          margin-top: 30px;
          font-size: 1rem;
          user-select: none;
        }

        .link {
          color: #8b2af8;
          cursor: pointer;
          user-select: none;
          transition: text-shadow 0.3s ease;
        }
        .link:hover {
          text-shadow: 0 0 8px #8b2af8;
        }

        @media (max-width: 480px) {
          .title {
            font-size: 2.2rem;
          }
          form.form {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
