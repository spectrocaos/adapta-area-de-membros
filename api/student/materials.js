import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'adapta_secret_key_super_segura'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' })

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Não autorizado.' })

  const token = authHeader.split(' ')[1]
  let decoded
  try { decoded = jwt.verify(token, JWT_SECRET) } catch (err) { return res.status(401).json({ message: 'Token inválido.' }) }

  const userId = decoded.userId

  try {
    // Find all materials shared with classes the student is enrolled in
    const classMaterials = await prisma.classMaterial.findMany({
      where: { class: { classStudents: { some: { studentId: userId } } } },
      include: { material: true }
    })

    // Find all materials directly shared with the student
    const studentMaterials = await prisma.studentMaterial.findMany({
      where: { studentId: userId },
      include: { material: true }
    })

    // Deduplicate and combine
    const materialsMap = new Map()
    classMaterials.forEach(cm => materialsMap.set(cm.materialId, cm.material))
    studentMaterials.forEach(sm => materialsMap.set(sm.materialId, sm.material))

    const materials = Array.from(materialsMap.values())
    
    // Map 'content' to 'adapted' for frontend
    const formattedMaterials = materials.map(m => ({ ...m, adapted: m.content }))

    return res.status(200).json(formattedMaterials)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao listar materiais do aluno.' })
  }
}
