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
        // Conexão
        try {
          await connectToDatabase();
        } catch (error) {
          console.error("Erro ao conectar ao banco de dados:", error);
          throw new Error("Erro interno de conexão");
        }

        // Busca usuário
        let user;
        try {
          user = await User.findOne({ email: credentials.email });
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
          throw new Error("Erro interno ao buscar usuário");
        }

        if (!user) {
          throw new Error("Email ou senha incorretos");
        }

        // Valida senha
        let passwordMatch;
        try {
          passwordMatch = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
        } catch (error) {
          console.error("Erro ao validar senha:", error);
          throw new Error("Erro interno ao validar senha");
        }

        if (!passwordMatch) {
          throw new Error("Email ou senha incorretos");
        }

        // Retorna dados do usuário
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
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
