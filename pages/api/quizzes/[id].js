import { connectToDatabase } from '../../../lib/db'
import Quiz from '../../../models/Quiz'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await connectToDatabase()
  const token = await getToken({ req, secret: SECRET })
  const { method, query: { id } } = req

  // Busca o quiz pelo ID
  const quiz = await Quiz.findById(id)
  if (!quiz) {
    return res.status(404).json({ message: 'Quiz não encontrado' })
  }

  if (method === 'GET') {
    return res.status(200).json(quiz)
  }

  // PUT e DELETE exigem admin
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ message: 'Não autorizado' })
  }

  if (method === 'PUT') {
    quiz.set(req.body)
    await quiz.save()
    return res.status(200).json(quiz)
  }

  if (method === 'DELETE') {
    await quiz.deleteOne()
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET','PUT','DELETE'])
  return res.status(405).end(`Method ${method} Not Allowed`)
}
