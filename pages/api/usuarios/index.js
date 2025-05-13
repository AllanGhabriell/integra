// pages/api/usuarios/index.js
import { connectToDatabase } from "../../../lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Erro ao conectar com o banco:", err);
    return res.status(500).json({ message: "Erro ao conectar com o banco de dados" });
  }

  const { method, body } = req;

  if (method === "GET") {
    try {
      // Autenticação desativada temporariamente
      // if (!session || session.user.role !== "admin") {
      //   return res.status(401).json({ message: "Não autorizado" });
      // }

      const users = await User.find({}, "-passwordHash");
      return res.status(200).json(users);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  if (method === "POST") {
    try {
      const { name, email, password, image } = body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        passwordHash,
        image,
        role: "user",
      });

      await user.save();

      return res.status(201).json({
        id: user._id,
        name,
        email,
        image,
        role: user.role,
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Método ${method} não permitido` });
}
