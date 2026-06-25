# Tarefas de Implementação do Backend SQL (Adapta)

Este documento divide o desenvolvimento e integração do backend SQL em blocos de tarefas lógicas, para garantir uma implementação assertiva e completa.

---

## Bloco 1: Modelagem e Configuração do Banco de Dados
- [x] 1.1. Definir o SGBD SQL a ser utilizado (SQL Server, MySQL ou PostgreSQL).
- [x] 1.2. Inicializar o projeto backend (ex: Node.js + Express + Prisma / Sequelize).
- [x] 1.3. Criar a estrutura e tabelas principais (`users`, `materials`, `classes`).
- [x] 1.4. Criar as tabelas de relacionamento (`class_students`, `class_materials`, `student_materials`).
- [x] 1.5. Executar as migrations e popular dados base (seed) no banco (ex: contas de teste).

## Bloco 2: Autenticação e Gestão de Usuários
- [x] 2.1. Criar o endpoint de Cadastro (`POST /api/auth/register`) salvando a senha como hash.
- [x] 2.2. Criar o endpoint de Login (`POST /api/auth/login`) retornando um token JWT.
- [x] 2.3. Criar endpoint para atualizar dados do perfil (`PUT /api/users/:id`).
- [x] 2.4. Refatorar o `useAuth` no frontend para consumir as APIs de autenticação.
- [x] 2.5. Validar restrição de rotas no frontend com base no token JWT.

## Bloco 3: Gestão de Biblioteca de Materiais (Library)
- [x] 3.1. Criar endpoint para listar materiais de um professor (`GET /api/materials`).
- [x] 3.2. Criar endpoint para salvar novo material adaptado (`POST /api/materials`).
- [x] 3.3. Criar endpoint para excluir material (`DELETE /api/materials/:id`).
- [x] 3.4. Refatorar o `useLibrary` no frontend para sincronizar a biblioteca via API.

## Bloco 4: Gestão de Turmas e Alunos
- [x] 4.1. Criar endpoints para gerenciamento de turmas (`GET`, `POST`, `PUT`, `DELETE` em `/api/classes`).
- [x] 4.2. Criar endpoint para buscar alunos cadastrados na plataforma (para adição manual em turmas).
- [x] 4.3. Criar endpoint para adicionar/remover aluno de uma turma na tabela `class_students`.
- [x] 4.4. Refatorar o hook `useClasses` (criar turma e listagem geral) para conectar à API.

## Bloco 5: Compartilhamento e Acesso aos Materiais
- [x] 5.1. Criar endpoint para compartilhar/descompartilhar materiais com uma turma inteira (Tabela `class_materials`).
- [x] 5.2. Criar endpoint para compartilhar/descompartilhar materiais com um aluno específico (Tabela `student_materials`).
- [x] 5.3. Criar endpoint para o **Aluno** consultar os materiais liberados para ele (via turma ou direto).
- [x] 5.4. Atualizar a tela `ClassDetailPage.jsx` para integrar corretamente essas novas chamadas.

## Bloco 6: Revisão e Testes Finais
- [x] 6.1. Garantir tratamento de erros apropriado e feedbacks de carregamento no frontend.
- [x] 6.2. Remover mock data remanescente nos arquivos de estado.
- [x] 6.3. Verificar fluxos: Cadastro -> Login -> Criar Turma -> Add Aluno -> Compartilhar Material -> Aluno Acessar. o fluxo completo do Aluno: Loga na conta > vê materiais compartilhados > visualiza conteúdo.
