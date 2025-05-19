// pages/api/usuarios/[id]/stats.js
import { connectToDatabase } from "../../../../lib/db"
import Resultado from "@/models/Resultado"
import User from "@/models/User"

export default async function handler(req, res) {
  await connectToDatabase()
  const { method, query: { id } } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Método ${method} não permitido`)
  }

  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  const resultados = await Resultado.find({ user: id }).populate('quiz', 'questions')

  const totalJogos = resultados.length
  let somaAcertos = 0
  let somaErros = 0

  resultados.forEach(r => {
    somaAcertos += r.score
    const totalQuestoes = r.quiz.questions.length
    somaErros += totalQuestoes - r.score
  })

  const mediaAcertos = totalJogos > 0 ? somaAcertos / totalJogos : 0
  const mediaErros = totalJogos > 0 ? somaErros / totalJogos : 0

  return res.status(200).json({ totalJogos, mediaAcertos, mediaErros })
}
