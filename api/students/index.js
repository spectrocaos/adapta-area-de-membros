import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'adapta_secret_key_super_segura'

export default async function handler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autorizado.' })
  }

  const token = authHeader.split(' ')[1]
  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' })
  }

  const userId = decoded.userId

  if (req.method === 'GET') {
    try {
      const students = await prisma.user.findMany({
        where: { profile: 'student' },
        select: { id: true, name: true, condition: true, photoUrl: true }
      })
      return res.status(200).json(students)
    } catch (error) {
      console.error('List Students Error:', error)
      return res.status(500).json({ message: 'Erro ao buscar alunos' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
