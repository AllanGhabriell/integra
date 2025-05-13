// pages/api/usuarios/[id].js
import dbConnect from "../../../lib/db";
import User from "@/models/User";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  if (method === "GET") {
    const { passwordHash, ...rest } = user.toObject();
    return res.status(200).json(rest);
  }

  if (method === "DELETE") {
    await user.remove();
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
