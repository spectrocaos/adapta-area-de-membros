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
      const materials = await prisma.material.findMany({
        where: { createdBy: userId },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(materials)
    } catch (error) {
      console.error('List Materials Error:', error)
      return res.status(500).json({ message: 'Erro ao buscar materiais.' })
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body
      const newMaterial = await prisma.material.create({
        data: {
          title: data.title,
          content: data.content || data.adapted || '',
          originalType: data.originalType || 'Texto',
          adaptType: data.adaptType || 'Adaptação Padrão',
          fileType: data.fileType || 'txt',
          subject: data.subject || 'Geral',
          condition: data.condition || 'tea',
          createdBy: userId
        }
      })
      // Ajustar formato do retorno para compatibilidade com frontend (adapted -> content)
      return res.status(201).json({ ...newMaterial, adapted: newMaterial.content })
    } catch (error) {
      console.error('Create Material Error:', error)
      return res.status(500).json({ message: 'Erro ao criar material.' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
