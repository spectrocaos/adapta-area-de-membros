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
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      const cls = await prisma.class.findUnique({ where: { id } })
      if (!cls || cls.teacherId !== userId) {
        return res.status(403).json({ message: 'Turma não encontrada ou acesso negado.' })
      }

      await prisma.class.delete({ where: { id } })
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Delete Class Error:', error)
      return res.status(500).json({ message: 'Erro ao deletar turma.' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
