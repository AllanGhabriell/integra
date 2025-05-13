// pages/api/usuarios/[id]/stats.js
import connectToDatabase from "../../../../lib/db";
import Resultado from "@/models/Resultado";
import User from "@/models/User";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await connectToDatabase();
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  // Somente o próprio usuário ou admin podem ver
  if (!session || (session.user.id !== id && session.user.role !== "admin")) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Método ${method} não permitido`);
  }

  // Verifica se o usuário existe
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  // Busca todos os resultados desse usuário, populando as perguntas para contar erros
  const resultados = await Resultado.find({ user: id }).populate(
    "quiz",
    "questions"
  );

  const totalJogos = resultados.length;
  let somaAcertos = 0;
  let somaErros = 0;

  resultados.forEach((r) => {
    somaAcertos += r.score;
    const totalQuestoes = r.quiz.questions.length;
    somaErros += totalQuestoes - r.score;
  });

  const mediaAcertos = totalJogos > 0 ? somaAcertos / totalJogos : 0;
  const mediaErros = totalJogos > 0 ? somaErros / totalJogos : 0;

  return res.status(200).json({ totalJogos, mediaAcertos, mediaErros });
}
