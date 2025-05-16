// pages/api/usuarios/[id].js
import { connectToDatabase } from '../../../lib/db'
import User from '../../../models/User'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await connectToDatabase()
  const token = await getToken({ req, secret: SECRET })
  const { method, query: { id } } = req

  // Só admin
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ message: 'Não autorizado' })
  }

  // Busca o usuário
  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  if (method === 'DELETE') {
    await user.deleteOne()
    return res.status(204).end()
  }

  if (method === 'GET') {
    const { passwordHash, ...rest } = user.toObject()
    return res.status(200).json(rest)
  }

  res.setHeader('Allow', ['GET','DELETE'])
  return res.status(405).end(`Method ${method} Not Allowed`)
}
