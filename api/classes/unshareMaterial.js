import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'adapta_secret_key_super_segura'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Não autorizado.' })

  const token = authHeader.split(' ')[1]
  let decoded
  try { decoded = jwt.verify(token, JWT_SECRET) } catch (err) { return res.status(401).json({ message: 'Token inválido.' }) }

  const userId = decoded.userId
  const { classId, materialId } = req.body

  try {
    const cls = await prisma.class.findUnique({ where: { id: classId } })
    if (!cls || cls.teacherId !== userId) return res.status(403).json({ message: 'Acesso negado.' })

    await prisma.classMaterial.delete({
      where: { classId_materialId: { classId, materialId } }
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao remover compartilhamento.' })
  }
}
