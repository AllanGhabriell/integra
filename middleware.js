// middleware.js
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const SECRET = process.env.NEXTAUTH_SECRET

const protectedUser = ['/perfil', '/quiz', '/quizFinal']
const protectedAdmin = ['/admin', '/criarQuiz','/editQuiz','/usuario']

export default async function middleware(req) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: SECRET })

  // Rotas de usuário
  if (protectedUser.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Rotas de admin
  if (protectedAdmin.some(path => pathname.startsWith(path))) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/perfil',
    '/quiz/:path*',
    '/quizFinal/:path*',
    '/admin',
    '/criarQuiz',
    '/editQuiz/:path*',
    '/usuario'
  ]
}
