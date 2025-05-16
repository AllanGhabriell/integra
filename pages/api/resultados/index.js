// pages/api/resultados/index.js
import { connectToDatabase } from '../../../lib/db'
import Resultado from '../../../models/Resultado'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await connectToDatabase()
  const { method, body } = req
  const token = await getToken({ req, secret: SECRET })

  if (method === 'POST') {
    if (!token) {
      return res.status(401).json({ message: 'Faça login para enviar resultados' })
    }
    const { quizId, time, score } = body
    if (!quizId || score == null || time == null) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }
    try {
      const result = new Resultado({
        quiz: quizId,
        user: token.sub,
        time,
        score
      })
      await result.save()
      return res.status(201).json(result)
    } catch (error) {
      console.error('Erro ao salvar resultado:', error)
      return res.status(500).json({ message: 'Erro ao salvar resultado' })
    }
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).end(`Method ${method} Not Allowed`)
}
