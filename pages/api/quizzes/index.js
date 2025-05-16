// pages/api/quizzes/index.js
import { connectToDatabase } from '../../../lib/db'
import Quiz from '../../../models/Quiz'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await connectToDatabase()
  const token = await getToken({ req, secret: SECRET })

  if (req.method === 'GET') {
    const quizzes = await Quiz.find({})
    return res.status(200).json(quizzes)
  }

  if (req.method === 'POST') {
    if (!token || token.role !== 'admin') {
      return res.status(401).json({ message: 'Não autorizado' })
    }
    const quiz = new Quiz(req.body)
    await quiz.save()
    return res.status(201).json(quiz)
  }

  res.setHeader('Allow', ['GET','POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
