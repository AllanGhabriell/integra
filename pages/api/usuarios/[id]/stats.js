// pages/api/usuarios/[id]/stats.js
import { connectToDatabase } from "../../../../lib/db"
import Resultado from "@/models/Resultado"
import User from "@/models/User"

export default async function handler(req, res) {
  try {
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

    // Se houver algum resultado com quiz = null, não quebrar
    const resultados = await Resultado.find({ user: id }).populate('quiz', 'questions')

    const totalJogos = resultados.length
    let somaAcertos = 0
    let somaErros = 0

    resultados.forEach(r => {
      // Só soma se score for número
      const score = typeof r.score === 'number' ? r.score : 0
      somaAcertos += score

      // Se não houver r.quiz ou r.quiz.questions, assume 0 questões
      const totalQuestoes = Array.isArray(r.quiz?.questions) ? r.quiz.questions.length : 0
      somaErros += totalQuestoes - score
    })

    const mediaAcertos = totalJogos > 0 ? somaAcertos / totalJogos : 0
    const mediaErros = totalJogos > 0 ? somaErros / totalJogos : 0

    return res.status(200).json({ totalJogos, mediaAcertos, mediaErros })
  } catch (error) {
    console.error('Erro em /api/usuarios/[id]/stats.js:', error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
