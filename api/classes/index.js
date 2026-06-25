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

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

  if (req.method === 'GET') {
    try {
      let classes = []
      if (user.profile === 'teacher') {
        classes = await prisma.class.findMany({
          where: { teacherId: userId },
          include: {
            classStudents: { include: { student: true } },
            classMaterials: true,
            studentMaterials: true
          },
          orderBy: { createdAt: 'desc' }
        })
        
        // Format for frontend compatibility
        classes = classes.map(c => ({
          ...c,
          students: c.classStudents.map(cs => ({
            id: cs.student.id,
            name: cs.student.name,
            condition: cs.student.condition,
            sharedMaterials: c.studentMaterials.filter(sm => sm.studentId === cs.student.id).map(sm => sm.materialId)
          })),
          sharedMaterials: c.classMaterials.map(cm => cm.materialId)
        }))
        
      } else {
        classes = await prisma.class.findMany({
          where: {
            classStudents: { some: { studentId: userId } }
          },
          include: {
            teacher: true,
            classMaterials: true
          },
          orderBy: { createdAt: 'desc' }
        })
      }
      return res.status(200).json(classes)
    } catch (error) {
      console.error('List Classes Error:', error)
      return res.status(500).json({ message: 'Erro ao buscar turmas' })
    }
  }

  if (req.method === 'POST') {
    if (user.profile !== 'teacher') return res.status(403).json({ message: 'Acesso negado.' })
    
    try {
      const { name, subject, description } = req.body
      const newClass = await prisma.class.create({
        data: {
          name,
          grade: subject || 'Geral',
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          teacherId: userId
        }
      })
      return res.status(201).json({ ...newClass, students: [], sharedMaterials: [] })
    } catch (error) {
      console.error('Create Class Error:', error)
      return res.status(500).json({ message: 'Erro ao criar turma' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
