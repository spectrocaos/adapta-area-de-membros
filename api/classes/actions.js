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
  const { action, classId, studentId, materialId } = req.body

  if (!action || !classId) return res.status(400).json({ message: 'Missing parameters.' })

  try {
    const cls = await prisma.class.findUnique({ where: { id: classId } })
    if (!cls || cls.teacherId !== userId) return res.status(403).json({ message: 'Acesso negado.' })

    if (action === 'addStudent') {
      await prisma.classStudent.create({ data: { classId, studentId } })
    } else if (action === 'removeStudent') {
      await prisma.classStudent.deleteMany({ where: { classId, studentId } })
    } else if (action === 'shareMaterial') {
      await prisma.classMaterial.create({ data: { classId, materialId } })
    } else if (action === 'unshareMaterial') {
      await prisma.classMaterial.deleteMany({ where: { classId, materialId } })
    } else if (action === 'shareStudentMaterial') {
      await prisma.studentMaterial.create({ data: { classId, studentId, materialId } })
    } else if (action === 'unshareStudentMaterial') {
      await prisma.studentMaterial.deleteMany({ where: { classId, studentId, materialId } })
    } else {
      return res.status(400).json({ message: 'Ação inválida.' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro interno.' })
  }
}
