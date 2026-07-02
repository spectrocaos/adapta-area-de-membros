import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'adapta_secret_key_super_segura'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { name, email, password, profile, condition } = req.body

  if (!name || !email || !password || !profile) {
    return res.status(400).json({ message: 'Dados incompletos.' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        profile,
        condition: condition || null,
        onboarded: true,
      }
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // Remove the passwordHash before returning
    const { passwordHash, ...userWithoutPassword } = user

    return res.status(201).json({ success: true, user: userWithoutPassword, token })
  } catch (error) {
    console.error('Register Error:', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}
