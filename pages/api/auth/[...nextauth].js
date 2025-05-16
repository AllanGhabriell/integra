// /pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" }, // Usando JWT para sessões
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        console.log("Tentando autenticar usuário:", credentials.email);
        try {
          await connectToDatabase();
        } catch (error) {
          console.error("Erro ao conectar ao banco de dados:", error);
          throw new Error("Erro interno de conexão");
        }

        let user;
        try {
          user = await User.findOne({ email: credentials.email });
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
          throw new Error("Erro interno ao buscar usuário");
        }

        if (!user) throw new Error("Email ou senha incorretos");

        let passwordMatch;
        try {
          passwordMatch = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
        } catch (error) {
          throw new Error("Erro interno ao validar senha");
        }

        if (!passwordMatch) throw new Error("Email ou senha incorretos");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          // image: user.image, // REMOVIDO: imagem não vai mais no token
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      // session.user.image = token.image // REMOVIDO: não passa mais imagem pela sessão
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        // token.image = user.image // REMOVIDO: imagem não será mais armazenada no token
      }
      return token;
    },
  },

  events: {
    async credentialsSignin(message) {
      console.log("Evento CredentialsSignin:", message);
      if (message.error) {
        console.log("Erro durante o login:", message.error);
      }
    },
  },
});
