import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'adapta_secret_key_super_segura'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { uid, email, name, profile, condition, photoUrl } = req.body

  if (!uid || !email) {
    return res.status(400).json({ message: 'UID e E-mail são obrigatórios.' })
  }

  try {
    // 1. Verificar se o usuário já existe por UID ou Email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: uid },
          { email: email }
        ]
      }
    })

    if (!user) {
      // 2. Se não existir, criar um novo usuário com o ID do Firebase
      user = await prisma.user.create({
        data: {
          id: uid,
          name: name || email.split('@')[0],
          email: email,
          passwordHash: 'firebase_auth', // Placeholder pois login é externo
          profile: profile || 'student', // Default
          condition: condition || null,
          photoUrl: photoUrl || null,
          onboarded: false,
        }
      })
    } else if (user.id !== uid) {
      // Se encontrou por e-mail mas o ID no BD é diferente (por exemplo, criado via API clássica),
      // podemos atualizar a foto, nome ou apenas prosseguir usando o id existente no BD.
      // Manter o ID atual do banco é mais seguro para não quebrar chaves estrangeiras existentes.
      console.log(`Usuário encontrado por email com ID de banco diferente. UID Firebase: ${uid}, ID Banco: ${user.id}`)
    }

    // 3. Gerar token JWT do nosso backend para autorizar as rotas existentes
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    const { passwordHash, ...userWithoutPassword } = user

    return res.status(200).json({ success: true, user: userWithoutPassword, token })
  } catch (error) {
    console.error('Firebase Auth Sync Error:', error)
    return res.status(500).json({ message: 'Erro ao sincronizar com o banco de dados.' })
  }
}
