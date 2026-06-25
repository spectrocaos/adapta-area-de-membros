console.log('--- LOGIN.JS MODULE LOADING ---')
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

console.log('--- IMPORTS SUCCESSFUL ---')
let prisma
try {
  prisma = new PrismaClient()
  console.log('--- PRISMA INSTANTIATED ---')
} catch (e) {
  console.error('--- PRISMA ERROR ---', e)
}

const JWT_SECRET = process.env.JWT_SECRET || 'adapta_secret_key_super_segura'

export default async function handler(req, res) {
  try {
    console.log('--- HANDLER START ---')
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }

    let body
    try {
      body = req.body
    } catch(e) {
      console.error('Body parsing error', e)
      return res.status(400).json({ message: 'Invalid JSON' })
    }

    const { email, password } = body

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    const { passwordHash, ...userWithoutPassword } = user

    return res.status(200).json({ success: true, user: userWithoutPassword, token })
  } catch (error) {
    console.error('CRITICAL Login Error:', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}
