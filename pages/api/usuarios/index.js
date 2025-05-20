import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcrypt";

// Função principal do handler da rota
export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Erro ao conectar com o banco:", err);
    return res.status(500).json({ message: "Erro ao conectar com o banco de dados" });
  }

  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        // Busca todos os usuários, omitindo a hash da senha
        const users = await User.find({}, "-passwordHash");
        return res.status(200).json(users);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        return res.status(500).json({ message: "Erro ao buscar usuários" });
      }

    case "POST":
      try {
        const { name, email, password, image } = body;

        // Verifica se todos os campos obrigatórios estão presentes
        if (!name || !email || !password) {
          return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
        }

        // Verifica se o e-mail já está cadastrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "Email já cadastrado" });
        }

        // Criptografa a senha antes de salvar
        const passwordHash = await bcrypt.hash(password, 10);

        // Cria e salva o novo usuário
        const newUser = new User({
          name,
          email,
          passwordHash,
          image: image || "", // Caso não envie imagem, salva string vazia
          role: "user",
        });

        await newUser.save();

        return res.status(201).json({
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          role: newUser.role,
        });
      } catch (err) {
        console.error("Erro ao criar usuário:", err);
        return res.status(500).json({ message: "Erro ao criar usuário" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Método ${method} não permitido` });
  }
}
