// pages/api/resultados/index.js
import dbConnect from "../../../lib/db";
import Resultado from "@/models/Resultado";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();
  const { method, body } = req;
  const session = await getSession({ req });

  if (method === "POST") {
    if (!session) {
      return res
        .status(401)
        .json({ message: "Faça login para enviar resultados" });
    }
    const { quizId, time, score } = body;
    const result = new Resultado({
      quiz: quizId,
      user: session.user.id,
      time,
      score,
    });
    await result.save();
    return res.status(201).json(result);
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
