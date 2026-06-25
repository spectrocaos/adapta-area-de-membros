# Plano do Backend com SQL (MySQL / SQL Server): ADAPTA

Este documento explica como o back-end do Adapta será estruturado usando um **Banco de Dados Relacional SQL (MSQL / MySQL)** e uma API para tornar o aplicativo totalmente funcional e persistente. Ele substituirá os estados fictícios armazenados no `localStorage` por dados reais no banco de dados.

---

## 1. Arquitetura do Banco de Dados SQL

### Tabelas Principais (Entidades)

#### Tabela: `users`
Armazena os perfis, credenciais e preferências visuais dos usuários (Alunos e Professores).
- `id`: UUID (Chave Primária)
- `name`: VARCHAR (Nome do Usuário)
- `email`: VARCHAR (Único)
- `password_hash`: VARCHAR (Senha criptografada)
- `profile`: ENUM ('teacher', 'student')
- `photoUrl`: VARCHAR (URL da foto de perfil, opcional)
- `condition`: ENUM ('tea', 'dyslexia', 'adhd', 'color_blind') ou NULL
- `onboarded`: BOOLEAN (Se já passou pela introdução)
- `created_at`: TIMESTAMP

#### Tabela: `materials`
Armazena os materiais convertidos e adaptados pelo professor.
- `id`: UUID (Chave Primária)
- `title`: VARCHAR (Título do Material)
- `content`: TEXT (Conteúdo adaptado em markdown)
- `originalType`: VARCHAR (Ex: Texto de Apoio)
- `adaptType`: VARCHAR (Ex: Resumo em Texto)
- `fileType`: VARCHAR ('pdf', 'txt')
- `subject`: VARCHAR (Matéria/Disciplina)
- `condition`: ENUM ('tea', 'dyslexia', 'adhd', 'color_blind')
- `created_by`: UUID (Chave Estrangeira -> `users.id`)
- `created_at`: TIMESTAMP

#### Tabela: `classes`
Armazena as turmas criadas por professores.
- `id`: UUID (Chave Primária)
- `name`: VARCHAR (Nome da Turma, ex: 8º Ano A)
- `grade`: VARCHAR (Série/Matéria)
- `code`: VARCHAR (Código único de acesso)
- `teacher_id`: UUID (Chave Estrangeira -> `users.id`)
- `created_at`: TIMESTAMP

### Tabelas de Relacionamento (Muitos para Muitos)

#### Tabela: `class_students`
Relaciona os alunos que estão matriculados em uma turma.
- `class_id`: UUID (Chave Estrangeira -> `classes.id`)
- `student_id`: UUID (Chave Estrangeira -> `users.id`)
- *Chave Primária Composta (class_id, student_id)*

#### Tabela: `class_materials`
Relaciona os materiais que foram compartilhados com a turma inteira.
- `class_id`: UUID (Chave Estrangeira -> `classes.id`)
- `material_id`: UUID (Chave Estrangeira -> `materials.id`)
- *Chave Primária Composta (class_id, material_id)*

#### Tabela: `student_materials`
Relaciona os materiais compartilhados especificamente e diretamente com um aluno.
- `student_id`: UUID (Chave Estrangeira -> `users.id`)
- `material_id`: UUID (Chave Estrangeira -> `materials.id`)
- `class_id`: UUID (Chave Estrangeira -> `classes.id`) (Opcional, caso queira rastrear de qual turma veio)
- *Chave Primária Composta (student_id, material_id)*

---

## 2. Como Vamos Aplicar no Código

### Passo 1: Construção da API Backend (Node.js / Python / C#)
1. Criar o servidor da API (RESTful) que vai conectar com o banco de dados SQL.
2. Configurar o ORM (ex: Prisma, Sequelize ou Entity Framework) para mapear o banco de dados.

### Passo 2: Refatorar os Hooks do Frontend
*   `useAuth`: Modificar o login e cadastro para fazer chamadas HTTP (POST) para as rotas `/api/auth/login` e `/api/auth/register`, recebendo um token JWT e salvando o estado do usuário.
*   `useLibrary`: Substituir o armazenamento local por requisições HTTP (GET, POST, DELETE) na rota `/api/materials`.
*   `useClasses`: Substituir as ações de criar turmas, adicionar alunos e compartilhar materiais por chamadas na rota `/api/classes`.

---

## 3. Plano de Verificação e Migração

1. Criar a modelagem e aplicar as migrations no banco SQL.
2. Levantar a API backend e testar os endpoints via Postman ou Swagger.
3. Integrar os serviços da API no frontend substituindo o armazenamento local.
4. Testar os fluxos completos na plataforma.
