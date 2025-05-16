import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  await connectToDatabase();

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email não fornecido" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  user.role = "admin";
  await user.save();

  return res.status(200).json({ message: `Usuário ${email} promovido a admin.` });
}
